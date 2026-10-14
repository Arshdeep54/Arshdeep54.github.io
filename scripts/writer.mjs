// Local writing tool: edit content/blog/<slug>.md in the browser, the dev blog page re-renders on every save.
// Run with `npm run write`, then open http://localhost:4100/?slug=<slug> next to http://localhost:3099/blog/<slug>
import http from "node:http"
import fs from "node:fs"
import path from "node:path"

const PORT = 4100
const BLOG_PORT = process.env.BLOG_PORT || 3099
const dir = path.join(process.cwd(), "content/blog")
const listeners = new Map() // slug -> Set<res>
const lastWrite = new Map() // slug -> text the writer itself saved, so the file watcher can skip it

const broadcast = (slug, from) => {
  for (const client of listeners.get(slug) ?? []) client.write(`data: ${from}\n\n`)
}

// edits made outside the writer (another editor, a script) reach the blog page and open writer tabs too
fs.watch(dir, (_, name) => {
  if (!name?.endsWith(".md")) return
  const slug = name.slice(0, -3)
  let text
  try { text = fs.readFileSync(path.join(dir, name), "utf8") } catch { return }
  if (text === lastWrite.get(slug)) return
  lastWrite.set(slug, text)
  broadcast(slug, "external")
})

const fileFor = (slug) => (/^[a-z0-9-]+$/.test(slug || "") ? path.join(dir, `${slug}.md`) : null)

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`)
    const slug = url.searchParams.get("slug")
    const file = fileFor(slug)

    if (url.pathname === "/events" && file) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      })
      res.write(": connected\n\n")
      if (!listeners.has(slug)) listeners.set(slug, new Set())
      listeners.get(slug).add(res)
      req.on("close", () => listeners.get(slug).delete(res))
      return
    }

    if (url.pathname === "/file" && file && req.method === "GET") {
      if (!fs.existsSync(file)) return res.writeHead(404).end()
      return res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end(fs.readFileSync(file, "utf8"))
    }

    if (url.pathname === "/file" && file && req.method === "PUT") {
      let body = ""
      req.on("data", (chunk) => (body += chunk))
      req.on("end", () => {
        lastWrite.set(slug, body)
        try {
          fs.writeFileSync(file, body)
        } catch (err) {
          return res.writeHead(500).end(String(err))
        }
        broadcast(slug, url.searchParams.get("from") || "writer")
        res.writeHead(204).end()
      })
      return
    }

    if (url.pathname === "/") {
      const drafts = fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3))
      return res
        .writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
        .end(page(drafts, BLOG_PORT))
    }

    res.writeHead(404).end()
  })
  .listen(PORT, "127.0.0.1", () => console.log(`writer on http://localhost:${PORT}  (blog preview on :${BLOG_PORT})`))

const page = (drafts, blogPort) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Writer</title>
<style>
:root{--bg:#0c0c0c;--panel:#141414;--fg:#e8e8e3;--mut:#8b8b85;--line:#262626;--acc:#a5d6bd}
*{box-sizing:border-box}
html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 system-ui,sans-serif}
body{display:flex;flex-direction:column}
header{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line);flex-wrap:wrap}
select,button,a.btn{background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:4px;padding:5px 9px;font:inherit;font-size:13px;cursor:pointer;text-decoration:none}
button:hover,a.btn:hover{border-color:var(--mut)}
.tools{display:flex;gap:4px;flex-wrap:wrap}
.tools button{min-width:32px;font-family:ui-monospace,monospace}
.grow{flex:1}
.status{color:var(--mut);font-size:12px;font-family:ui-monospace,monospace}
.status.err{color:#e2765f}
textarea{flex:1;width:100%;max-width:820px;margin:0 auto;display:block;background:var(--bg);color:var(--fg);border:0;outline:0;resize:none;
  padding:32px 24px 50vh;font:16px/1.75 ui-monospace,"JetBrains Mono",Menlo,monospace;caret-color:var(--acc);tab-size:2}
footer{display:flex;gap:16px;padding:6px 14px;border-top:1px solid var(--line);color:var(--mut);font:12px ui-monospace,monospace}
</style></head>
<body>
<header>
  <select id="slug">${drafts.map((d) => `<option>${d}</option>`).join("")}</select>
  <div class="tools">
    <button data-line="## " title="Section heading">H2</button>
    <button data-line="### " title="Sub heading">H3</button>
    <button data-wrap="**" title="Bold (Ctrl+B)"><b>B</b></button>
    <button data-wrap="_" title="Italic (Ctrl+I)"><i>I</i></button>
    <button data-wrap="\`" title="Inline code (Ctrl+E)">\`c\`</button>
    <button data-link title="Link (Ctrl+K)">link</button>
    <button data-line="> " title="Pull quote">“ ”</button>
    <button data-line="- " title="Bullet list">•</button>
    <button data-line="1. " title="Numbered list">1.</button>
    <button data-block="\`\`\`ts file.ts · what this shows\\n\\n\`\`\`" title="Code panel (lang, then panel title)">{ }</button>
    <button data-wrap="$" title="Inline math (Ctrl+M)">$x$</button>
    <button data-block="$$\n\n$$" title="Equation block">∑</button>
    <button data-block="| Column | Column |\\n| --- | --- |\\n| a | b |" title="Table">tbl</button>
    <button data-block="---" title="Divider">—</button>
  </div>
  <span class="grow"></span>
  <span id="status" class="status">loading</span>
  <a id="preview" class="btn" target="blog">open preview ↗</a>
</header>
<textarea id="ed" spellcheck="true" autofocus></textarea>
<footer><span id="words">0 words</span><span id="mins"></span><span class="grow"></span><span>content/blog/<span id="fname"></span>.md</span></footer>
<script>
const ed = document.getElementById("ed"), status = document.getElementById("status"), pick = document.getElementById("slug")
const params = new URLSearchParams(location.search)
let slug = params.get("slug") || pick.value, timer, events
const me = Math.random().toString(36).slice(2)

function setStatus(text, err) { status.textContent = text; status.className = "status" + (err ? " err" : "") }
function stats() {
  const words = ed.value.trim() ? ed.value.trim().split(/\\s+/).length : 0
  document.getElementById("words").textContent = words + " words"
  document.getElementById("mins").textContent = "~" + Math.max(1, Math.round(words / 230)) + " min read"
}
async function load() {
  pick.value = slug
  document.getElementById("fname").textContent = slug
  document.getElementById("preview").href = "http://localhost:${blogPort}/blog/" + slug
  history.replaceState(null, "", "?slug=" + slug)
  // the file wins; the browser copy is only a fallback when the server can't be reached
  const backup = localStorage.getItem("draft:" + slug + ":unsaved")
  const res = await fetch("/file?slug=" + slug).catch(() => null)
  if (res) localStorage.removeItem("draft:" + slug + ":unsaved")
  ed.value = res?.ok ? await res.text() : res ? "" : backup ?? ""
  stats(); setStatus("saved")
  events?.close()
  events = new EventSource("/events?slug=" + slug)
  events.onmessage = async (e) => {
    if (e.data === me || timer) return // our own save, or we're mid-typing and will overwrite anyway
    const res = await fetch("/file?slug=" + slug)
    if (!res.ok) return
    const text = await res.text()
    if (text === ed.value) return
    const pos = ed.selectionStart
    ed.value = text; ed.setSelectionRange(pos, pos)
    localStorage.removeItem("draft:" + slug + ":unsaved")
    stats(); setStatus("updated from file")
  }
}
async function save() {
  try {
    timer = null
    const res = await fetch("/file?slug=" + slug + "&from=" + me, { method: "PUT", body: ed.value })
    if (!res.ok) throw new Error(res.status)
    localStorage.removeItem("draft:" + slug + ":unsaved")
    setStatus("saved")
  } catch (e) { setStatus("NOT SAVED: writer server unreachable, kept in browser", true) }
}
ed.addEventListener("input", () => {
  try { localStorage.setItem("draft:" + slug + ":unsaved", ed.value) } catch {}
  stats(); setStatus("saving…"); clearTimeout(timer); timer = setTimeout(save, 150)
})
pick.addEventListener("change", () => { slug = pick.value; load() })

// editing helpers; insertText keeps the browser's undo history
function insert(text, selStart, selEnd) {
  ed.focus(); document.execCommand("insertText", false, text)
  if (selStart != null) { const base = ed.selectionStart - text.length; ed.setSelectionRange(base + selStart, base + selEnd) }
}
function wrap(mark) {
  const s = ed.value.slice(ed.selectionStart, ed.selectionEnd) || "text"
  insert(mark + s + mark, mark.length, mark.length + s.length)
}
function linePrefix(prefix) {
  const start = ed.value.lastIndexOf("\\n", ed.selectionStart - 1) + 1
  ed.setSelectionRange(start, start); insert(prefix)
}
function block(text) {
  const before = ed.value.slice(0, ed.selectionStart)
  const pad = before === "" || before.endsWith("\\n\\n") ? "" : before.endsWith("\\n") ? "\\n" : "\\n\\n"
  insert(pad + text + "\\n\\n")
}
function link() {
  const s = ed.value.slice(ed.selectionStart, ed.selectionEnd) || "text"
  insert("[" + s + "](https://)", s.length + 3, s.length + 11)
}
document.querySelectorAll(".tools button").forEach((b) => b.addEventListener("click", () => {
  if (b.dataset.wrap) wrap(b.dataset.wrap)
  else if (b.dataset.line) linePrefix(b.dataset.line)
  else if (b.dataset.block) block(b.dataset.block.replace(/\\\\n/g, "\\n"))
  else if ("link" in b.dataset) link()
}))
ed.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { e.preventDefault(); insert("  ") }
  if (!(e.ctrlKey || e.metaKey)) return
  const k = e.key.toLowerCase()
  if (k === "b") { e.preventDefault(); wrap("**") }
  if (k === "i") { e.preventDefault(); wrap("_") }
  if (k === "e") { e.preventDefault(); wrap("\`") }
  if (k === "m") { e.preventDefault(); wrap("$") }
  if (k === "k") { e.preventDefault(); link() }
  if (k === "s") { e.preventDefault(); clearTimeout(timer); save() }
})
load()
</script>
</body></html>`

import fs from "node:fs"
import path from "node:path"
import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import type { Element } from "hast"
import { CodePanel, Fig, H2, P, Pull } from "@/components/blog-prose"
import { figures } from "@/components/figures"
import { Panel, PanelLink, SidePanels } from "@/components/side-panel"

const dir = path.join(process.cwd(), "content/blog")

export function hasMarkdown(slug: string) {
  return fs.existsSync(path.join(dir, `${slug}.md`))
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export default function MarkdownPost({ slug }: { slug: string }) {
  return <SidePanels>{render(fs.readFileSync(path.join(dir, `${slug}.md`), "utf8"))}</SidePanels>
}

function render(source: string) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      skipHtml // lets <!-- notes --> in the draft stay private
      components={components}
    >
      {source}
    </Markdown>
  )
}

const components: Components = {
  h2: ({ children }) => <H2 id={slugify(String(children))}>{children}</H2>,
  h3: ({ children }) => <h3 className="mt-10 mb-3 text-lg font-medium tracking-tight">{children}</h3>,
  p: ({ children }) => <P>{children}</P>,
  blockquote: ({ children }) => <Pull>{children}</Pull>,
  // fenced block: ```lang title words → CodePanel titled "title words" (or the lang)
  // ```note id Title → side panel content, opened by a [text](#note-id) link, not shown inline
  // ```figure name → a figure from components/figures.tsx, the fence body is its caption
  pre: ({ node }) => {
    const code = node?.children[0] as Element | undefined
    const text = code?.children.map((c) => ("value" in c ? c.value : "")).join("") ?? ""
    const meta = (code?.data as { meta?: string } | undefined)?.meta
    const lang = String((code?.properties.className as string[] | undefined)?.[0] ?? "").replace("language-", "")
    if (lang === "note") {
      const [id = "", ...title] = (meta ?? "").split(" ")
      // title goes through markdown too, so $W^Q$ in it is typeset
      const heading = (
        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={{ p: ({ children }) => <>{children}</> }}>
          {title.join(" ")}
        </Markdown>
      )
      return <Panel id={id} title={heading}>{render(text)}</Panel>
    }
    if (lang === "figure") {
      if (!meta || !(meta in figures)) throw new Error(`unknown figure "${meta}"`)
      return <Fig caption={text.trim()}>{figures[meta]}</Fig>
    }
    return <CodePanel title={meta || lang || "code"}>{text.replace(/\n$/, "")}</CodePanel>
  },
  ul: ({ children }) => <ul className="mb-5 max-w-2xl list-disc space-y-2 pl-5 text-foreground/85">{children}</ul>,
  ol: ({ children }) => <ol className="mb-5 max-w-2xl list-decimal space-y-2 pl-5 text-foreground/85">{children}</ol>,
  a: ({ href, children }) =>
    href?.startsWith("#note-") ? (
      <PanelLink id={href.slice(6)}>{children}</PanelLink>
    ) : (
      // links to other posts open in a new tab, so the reader keeps their place in this one
      <a
        href={href}
        {...(href?.startsWith("/blog/") && { target: "_blank", rel: "noopener" })}
        className="underline decoration-accent/40 underline-offset-2 hover:text-accent"
      >
        {children}
      </a>
    ),
  hr: () => <hr className="my-10 border-border" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} className="my-8 rounded border border-border" />
  ),
  table: ({ children }) => (
    <div className="my-6 max-w-2xl overflow-x-auto"><table className="w-full border-collapse text-sm">{children}</table></div>
  ),
  th: ({ children }) => <th className="border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground">{children}</th>,
  td: ({ children }) => <td className="border border-border px-3 py-2.5 align-top text-muted-foreground">{children}</td>,
}

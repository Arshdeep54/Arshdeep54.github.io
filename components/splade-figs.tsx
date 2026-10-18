"use client"

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import katex from "katex"

// Interactive figures for the SPLADE post. All numbers except the BERT token IDs are illustrative.

const Tex = ({ children }: { children: string }) => (
  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(children, { throwOnError: false }) }} />
)

const fmt = (v: number, d = 2) => (Math.abs(v) < 0.005 ? 0 : v).toFixed(d)
const shade = (p: number) => `color-mix(in oklch, var(--foreground) ${Math.round(Math.min(1, Math.max(0, p)) * 85)}%, transparent)`

function Pills<V extends string | number>({ options, value, onChange }: {
  options: { value: V; label: string }[]
  value: V
  onChange: (v: V) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded border px-2 py-0.5 font-mono text-xs ${o.value === value ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Bars({ rows, max, digits = 2 }: { rows: { label: string; value: number; dim?: boolean }[]; max: number; digits?: number }) {
  return (
    <div className="space-y-1.5 font-mono text-xs">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3">
          <span className={r.dim ? "text-muted-foreground" : "text-foreground"}>{r.label}</span>
          <div className="h-2 rounded-sm bg-border">
            <div
              className="h-2 rounded-sm bg-foreground transition-all duration-300"
              style={{ width: `${(Math.max(0, r.value) / max) * 100}%`, opacity: r.dim ? 0.45 : 1 }}
            />
          </div>
          <span className="text-right text-muted-foreground">{r.value.toFixed(digits)}</span>
        </div>
      ))}
    </div>
  )
}

function Matrix({ m, rows, cols, heat, hl }: {
  m: (number | string)[][]
  rows?: string[]
  cols?: string[]
  heat?: number
  hl?: (i: number, j: number) => boolean
}) {
  return (
    <table className="border-separate border-spacing-1 font-mono text-xs">
      <tbody>
        {cols && (
          <tr>
            {rows && <th />}
            {cols.map((c) => <th key={c} className="px-1 text-right font-normal text-muted-foreground">{c}</th>)}
          </tr>
        )}
        {m.map((r, i) => (
          <tr key={i}>
            {rows && <th className="pr-2 text-right font-normal text-muted-foreground">{rows[i]}</th>}
            {r.map((v, j) => {
              const p = heat && typeof v === "number" ? v / heat : 0
              return (
                <td
                  key={j}
                  className={`min-w-11 rounded-sm border px-2 py-1 text-right ${hl?.(i, j) ? "border-foreground" : "border-border"} ${p > 0.55 ? "text-background" : ""}`}
                  style={heat ? { background: shade(p) } : undefined}
                >
                  {typeof v === "number" ? fmt(v) : v}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ---------- the rabbit hole ----------

const hole = [
  "SPLADE: \u201cuses the logits of BERT's MLM layer\u201d",
  "what's MLM? \u2192 how BERT was trained",
  "what's BERT? \u2192 the encoder half of a transformer",
  "what's a transformer? \u2192 attention, stacked",
  "attention needs Q, K, V. from where??",
  "and the word vectors themselves, from where??",
  "\u2026and why is there a GELU here",
]

export function RabbitHole() {
  return (
    <div className="space-y-1.5 font-mono text-xs text-muted-foreground">
      {hole.map((h, i) => (
        <div key={h} style={{ marginLeft: `${i * 1.1}rem` }} className={i === 0 ? "text-foreground" : ""}>
          {i ? "\u21b3 " : ""}{h}
        </div>
      ))}
      <div className="pt-2 text-foreground">{"\u2191 climbing back out to SPLADE"}</div>
    </div>
  )
}

// ---------- BM25 view vs SPLADE view of one doc, as sparse vectors ----------

// [token, real bert-base-uncased ID, value, added by expansion]
type Slot = [string, number, number, boolean?]
const bm25Doc: Slot[] = [["i", 1045, 1], ["went", 2253, 1], ["for", 2005, 1], ["a", 1037, 1], ["run", 2448, 1]]
const spladeDoc: Slot[] = [
  ["run", 2448, 2.4],
  ["running", 2770, 1.5, true],
  ["jogging", 28233, 1.2, true],
  ["marathon", 8589, 0.9, true],
  ["exercise", 6912, 0.8, true],
  ["went", 2253, 0.6],
  ["ran", 2743, 0.5, true],
]

// value on top, word under it; zero runs get an empty second line so every number sits on one row
function Cell({ top, word, faded }: { top: string; word?: string; faded?: boolean }) {
  return (
    <span className={`flex shrink-0 flex-col items-center leading-snug ${faded || !word ? "text-muted-foreground" : ""}`}>
      <span className="whitespace-nowrap">{top}</span>
      <span className="text-[10px] text-muted-foreground">{word ?? "\u00a0"}</span>
    </span>
  )
}

function SparseVector({ name, slots, digits }: { name: string; slots: Slot[]; digits: number }) {
  const byId = [...slots].sort((a, b) => a[1] - b[1])
  return (
    <div className="space-y-3 font-mono">
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="flex items-start gap-x-1 overflow-x-auto pb-1 text-xs">
        <Cell top="[ 0…0," />
        {byId.map(([t, , v, added], i) => (
          <Fragment key={t}>
            {i > 0 && <Cell top="0…0," />}
            <Cell top={v.toFixed(digits) + ","} word={added ? `+${t}` : t} faded={added} />
          </Fragment>
        ))}
        <Cell top="0…0 ]" />
      </div>
    </div>
  )
}

export function Expansion() {
  return (
    <div className="space-y-8">
      <div className="font-mono text-xs text-muted-foreground">doc: &ldquo;i went for a run&rdquo;</div>
      <SparseVector name="BM25, term frequency: 5 of 30,522 slots non-zero" slots={bm25Doc} digits={0} />
      <SparseVector name="SPLADE, learned weights: 7 of 30,522 slots non-zero" slots={spladeDoc} digits={1} />
    </div>
  )
}

// ---------- WordPiece ----------

const sentences: [string, number][][] = [
  [["[CLS]", 101], ["i", 1045], ["went", 2253], ["for", 2005], ["a", 1037], ["run", 2448], ["[SEP]", 102]],
  [["[CLS]", 101], ["she", 2016], ["ran", 2743], ["a", 1037], ["marathon", 8589], ["[SEP]", 102]],
  [["[CLS]", 101], ["sp", 11867], ["##lad", 27266], ["##e", 2063], ["is", 2003], ["ti", 14841], ["##ring", 4892], ["[SEP]", 102]],
  [["[CLS]", 101], ["jo", 8183], ["##g", 2290], ["vs", 5443], ["jogging", 28233], ["[SEP]", 102]],
]

export function WordPiece() {
  const [s, setS] = useState(0)
  return (
    <div className="space-y-4">
      <Pills
        options={["i went for a run", "she ran a marathon", "splade is tiring", "jog vs jogging"].map((label, value) => ({ value, label }))}
        value={s}
        onChange={setS}
      />
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {sentences[s].map(([t, id], i) => (
          <div key={i} className={`rounded border px-2 py-1 text-center ${t.startsWith("[") ? "border-dashed border-border text-muted-foreground" : "border-border"}`}>
            <div className="text-foreground">{t}</div>
            <div className="text-muted-foreground">{id}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------- embedding lookup ----------

const vocab = ["the", "river", "bank", "flows", "money", "loan"]
const X = [[2.0, 0.4, 0.0, 1.0], [1.2, 1.6, 0.6, 0.2], [1.8, 0.0, 1.4, 0.4]]
const E = [[0.1, 0.2, 0.1, 0.1], X[0], X[1], X[2], [0.3, 1.9, 0.2, 0.1], [0.2, 1.7, 0.5, 0.0]]

export function Embedding() {
  const [w, setW] = useState(2)
  return (
    <div className="space-y-4">
      <Pills options={vocab.map((label, value) => ({ value, label }))} value={w} onChange={setW} />
      <div className="flex flex-wrap items-center gap-4 overflow-x-auto">
        <Matrix m={E} rows={vocab.map((v, i) => `${i} ${v}`)} cols={["d1", "d2", "d3", "d4"]} hl={(i) => i === w} />
        <span className="font-mono text-muted-foreground">{"\u2192"}</span>
        <div className="space-y-1">
          <Tex>{`\\mathbf x_{\\text{${vocab[w]}}} = E_{${w},:}`}</Tex>
          <Matrix m={[E[w]]} hl={() => true} />
        </div>
      </div>
    </div>
  )
}

// ---------- toy self-attention: "river bank flows" ----------

const mul = (A: number[][], B: number[][]) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)))
const softmax = (r: number[]) => {
  const m = Math.max(...r)
  const e = r.map((v) => Math.exp(v - m))
  const s = e.reduce((a, b) => a + b)
  return e.map((v) => v / s)
}
const words = ["river", "bank", "flows"]
const Wq = [[0.2, 0.6], [1.0, 0.1], [0.1, -0.8], [0.3, 0.4]]
const Wk = [[0.9, 0.2], [0.1, 0.9], [-0.6, 0.3], [0.8, -0.3]]
const Wv = [[0.5, 0.1], [0.1, 0.6], [0.4, -0.3], [0.2, 0.3]]
const Q = mul(X, Wq)
const K = mul(X, Wk)
const V = mul(X, Wv)
const S = Q.map((q) => K.map((k) => q[0] * k[0] + q[1] * k[1]))
const A = S.map((r) => softmax(r.map((v) => v / Math.SQRT2)))
const Z = mul(A, V)

export function AttentionHeat() {
  const [q, setQ] = useState(1)
  return (
    <div className="space-y-4">
      <Pills options={words.map((label, value) => ({ value, label: `${label} asks` }))} value={q} onChange={setQ} />
      <div className="flex flex-wrap items-start gap-6">
        <Matrix m={A.map((r) => r.map((v) => Math.round(v * 100) / 100))} rows={words} cols={words} heat={1} hl={(i) => i === q} />
        <div className="space-y-2 text-sm">
          <Tex>{`\\mathbf z_{\\text{${words[q]}}} = ${words.map((w, j) => `${fmt(A[q][j])}\\,\\mathbf v_{\\text{${w}}}`).join(" + ")}`}</Tex>
          <div><Tex>{`= [${fmt(Z[q][0])},\\ ${fmt(Z[q][1])}]`}</Tex></div>
        </div>
      </div>
    </div>
  )
}

// ---------- attention: the formula is the navigation ----------

const Sd = S.map((r) => r.map((v) => v / Math.SQRT2))
const round2 = (m: number[][]) => m.map((r) => r.map((v) => Math.round(v * 100) / 100))

function Labeled({ tex, note, children }: { tex: string; note: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm"><Tex>{tex}</Tex></div>
      {children}
      <div className="font-mono text-xs text-muted-foreground">{note}</div>
    </div>
  )
}

// in computation order, which is also the order "next" and the idle tour follow
const formulaParts: { id: string; tex: string; view: ReactNode }[] = [
  {
    id: "q", tex: "Q",
    view: <Labeled tex="Q = XW^Q" note="one query per word"><Matrix m={Q} rows={words} /></Labeled>,
  },
  {
    id: "k", tex: "K^{\\top}",
    view: (
      <div className="flex flex-wrap items-start gap-6">
        <Labeled tex="K^{\top}" note="one key per word, as columns"><Matrix m={[0, 1].map((i) => K.map((k) => k[i]))} cols={words} /></Labeled>
        <Labeled tex="QK^{\top}" note="row asks, column answers"><Matrix m={round2(S)} rows={words} cols={words} heat={Math.max(...S.flat())} /></Labeled>
      </div>
    ),
  },
  {
    id: "d", tex: "\\sqrt{d_k}",
    view: <Labeled tex="QK^{\top} / \sqrt 2" note="same pattern, smaller numbers"><Matrix m={round2(Sd)} rows={words} cols={words} heat={Math.max(...Sd.flat())} /></Labeled>,
  },
  {
    id: "softmax", tex: "\\operatorname{softmax}",
    view: <Labeled tex="A" note="each row adds up to 1"><Matrix m={round2(A)} rows={words} cols={words} heat={1} /></Labeled>,
  },
  {
    id: "v", tex: "V",
    view: (
      <div className="flex flex-wrap items-start gap-6">
        <Labeled tex="V = XW^V" note="what each word hands over"><Matrix m={V} rows={words} /></Labeled>
        <Labeled tex="Z = AV" note="every word, remixed"><Matrix m={Z} rows={words} /></Labeled>
      </div>
    ),
  },
]

export function AttentionFormula() {
  const [i, setI] = useState(0)
  const [seen, setSeen] = useState([0])
  const [touched, setTouched] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.5 })
  const n = formulaParts.length

  // until the reader clicks, step through on its own so it's clear the pieces are live
  useEffect(() => {
    if (touched || !inView) return
    const id = setInterval(() => setI((p) => (p + 1) % n), 2200)
    return () => clearInterval(id)
  }, [touched, inView, n])

  const go = (j: number) => {
    setTouched(true)
    setI(j)
    setSeen((s) => (s.includes(j) ? s : [...s, j]))
  }
  const piece = (id: string) => {
    const j = formulaParts.findIndex((f) => f.id === id)
    return (
      <button
        type="button"
        onClick={() => go(j)}
        aria-pressed={i === j}
        className={`relative rounded border px-2 py-1 transition-colors ${i === j ? "border-foreground bg-foreground/10 text-foreground" : "border-dashed border-border text-foreground/70 hover:border-foreground hover:text-foreground"}`}
      >
        <Tex>{formulaParts[j].tex}</Tex>
        {!seen.includes(j) && <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-foreground" />}
      </button>
    )
  }
  const sym = (tex: string) => <span className="text-muted-foreground"><Tex>{tex}</Tex></span>
  const nav = "rounded border border-border px-2 py-0.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"

  return (
    <div ref={ref} className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2 py-2 text-xl">
        {piece("softmax")}{sym("\\Big(")}{piece("q")}{piece("k")}{sym("/")}{piece("d")}{sym("\\Big)")}{piece("v")}
      </div>
      <div className="min-h-56 overflow-x-auto rounded border border-border p-4">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            {formulaParts[i].view}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-muted-foreground">step {i + 1} of {n}</span>
        <div className="flex gap-1">
          <button type="button" onClick={() => go((i - 1 + n) % n)} className={nav} aria-label="previous step">{"\u2190"}</button>
          <button type="button" onClick={() => go((i + 1) % n)} className={nav} aria-label="next step">{"\u2192"}</button>
        </div>
      </div>
    </div>
  )
}

// ---------- multi-head: concatenating the heads for one token ----------

// head 1 is the real toy output for "bank", the other two are made up
const heads = [Z[1], [0.2, 1.1], [-0.4, 0.9]]
const headShade = [0.08, 0.18, 0.3]

function HeadBlock({ v, i }: { v: number[]; i: number }) {
  return (
    <div className="flex rounded-sm border border-border" style={{ background: shade(headShade[i]) }}>
      {v.map((x, k) => <span key={k} className="w-12 px-1 py-1 text-center">{fmt(x)}</span>)}
    </div>
  )
}

export function Concat() {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="space-y-2">
        {heads.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-14 text-muted-foreground">head {i + 1}</span>
            <HeadBlock v={v} i={i} />
          </div>
        ))}
      </div>
      <div className="text-muted-foreground">{"↓"} concat, side by side</div>
      <div className="flex flex-wrap items-start gap-1">
        {heads.map((v, i) => (
          <div key={i} className="space-y-1 text-center">
            <HeadBlock v={v} i={i} />
            <div className="text-[10px] text-muted-foreground">head {i + 1}</div>
          </div>
        ))}
      </div>
      <div className="text-muted-foreground">{"↓"} <Tex>{"\\times\\, W^O"}</Tex> mixes them into one vector for &ldquo;bank&rdquo;</div>
    </div>
  )
}

// ---------- learning W^Q, W^K by gradient descent ----------

type Train = { wq: number[][]; wk: number[][]; losses: number[] }
const rand = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647 * 2 - 1
const attnBank = (wq: number[][], wk: number[][]) => {
  const q = mul([X[1]], wq)[0]
  return softmax(mul(X, wk).map((k) => (q[0] * k[0] + q[1] * k[1]) / Math.SQRT2))
}
const lossOf = (wq: number[][], wk: number[][]) => -Math.log(attnBank(wq, wk)[0])
const init = (seed: number): Train => {
  const r = rand(seed)
  const wq = Array.from({ length: 4 }, () => [r(), r()])
  const wk = Array.from({ length: 4 }, () => [r(), r()])
  return { wq, wk, losses: [lossOf(wq, wk)] }
}
// ponytail: finite-difference gradient, fine for 16 numbers; real training uses backprop
const trainStep = ({ wq, wk, losses }: Train): Train => {
  const [nq, nk] = [wq, wk].map((W) => W.map((r) => [...r]))
  const grad = (W: number[][], i: number, j: number) => {
    const v = W[i][j]
    W[i][j] = v + 1e-4
    const up = lossOf(nq, nk)
    W[i][j] = v - 1e-4
    const dn = lossOf(nq, nk)
    W[i][j] = v
    return (up - dn) / 2e-4
  }
  const g = [nq, nk].map((W) => W.map((r, i) => r.map((_, j) => grad(W, i, j))))
  ;[nq, nk].forEach((W, m) => W.forEach((r, i) => r.forEach((_, j) => { r[j] -= 0.05 * g[m][i][j] })))
  return { wq: nq, wk: nk, losses: [...losses, lossOf(nq, nk)] }
}

export function TrainAttention() {
  const [seed, setSeed] = useState(7)
  const [t, setT] = useState(() => init(7))
  const [left, setLeft] = useState(0)
  useEffect(() => {
    if (!left) return
    const id = setTimeout(() => { setT(trainStep); setLeft(left - 1) }, 40)
    return () => clearTimeout(id)
  }, [left])
  const a = attnBank(t.wq, t.wk)
  const mx = Math.max(...t.losses)
  const n = Math.max(50, t.losses.length - 1)
  const pts = t.losses.map((v, i) => `${(i / n) * 320},${95 - (v / mx) * 85}`).join(" ")
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Pills options={[{ value: 1, label: "1 step" }, { value: 50, label: "train 50 steps" }]} value={-1} onChange={(v) => (v === 1 ? setT(trainStep) : setLeft(50))} />
        <Pills options={[{ value: 0, label: "new random start" }]} value={-1} onChange={() => { setLeft(0); setSeed(seed + 1); setT(init(seed * 31 + 1)) }} />
      </div>
      <div className="flex flex-wrap items-start gap-4 overflow-x-auto">
        <div className="space-y-1"><Tex>W^Q</Tex><Matrix m={t.wq} /></div>
        <div className="space-y-1"><Tex>W^K</Tex><Matrix m={t.wk} /></div>
        <div className="min-w-56 flex-1 space-y-2">
          <div className="font-mono text-xs text-muted-foreground">bank attends to</div>
          <Bars rows={words.map((x, j) => ({ label: x, value: a[j] }))} max={1} />
          <div className="text-sm"><Tex>{`\\text{step } ${t.losses.length - 1},\\quad L = -\\log ${fmt(a[0])} = ${fmt(t.losses[t.losses.length - 1], 3)}`}</Tex></div>
        </div>
      </div>
      <svg viewBox="0 0 320 100" className="w-full text-foreground" role="img" aria-label="Loss going down over training steps">
        <line x1="0" x2="320" y1="95" y2="95" stroke="currentColor" opacity="0.2" />
        <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ---------- sinusoidal positions ----------

export function Positions() {
  const [pos, setPos] = useState(7)
  const D = 32
  const P = 32
  const pe = (p: number, i: number) => (i % 2 ? Math.cos : Math.sin)(p / Math.pow(10000, (i - (i % 2)) / D))
  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${D * 10} ${P * 6}`} className="w-full" role="img" aria-label="Position vectors as a grid, one row per position">
        {Array.from({ length: P }, (_, p) => Array.from({ length: D }, (_, i) => (
          <rect key={`${p}-${i}`} x={i * 10} y={p * 6} width="10" height="6" style={{ fill: shade((pe(p, i) + 1) / 2) }} />
        )))}
        <rect x="0.5" y={pos * 6} width={D * 10 - 1} height="6" fill="none" stroke="var(--foreground)" strokeWidth="1" />
      </svg>
      <label className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="w-24 text-foreground">position {pos}</span>
        <input type="range" min={0} max={P - 1} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="plot-range min-w-0 flex-1" />
      </label>
    </div>
  )
}

// ---------- one BERT encoder layer, repeated 12 times (after the Illustrated Transformer's diagram) ----------

const encCols = [205, 375]

export function EncoderStack() {
  const box = (x: number, y: number, w: number, h: number, label: string, fill: number) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill="currentColor" fillOpacity={fill} stroke="currentColor" strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={15} fill="currentColor">{label}</text>
    </g>
  )
  const up = (x: number, y1: number, y2: number) => <line x1={x} y1={y1} x2={x} y2={y2 + 4} stroke="currentColor" strokeWidth={1.5} markerEnd="url(#enc-arrow)" />
  // residual: from the sub-block's input, around the left, into its Add & Norm
  const skip = (yFrom: number, yTo: number) => (
    <path d={`M${encCols[1]},${yFrom} H125 V${yTo} H136`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#enc-arrow)" opacity={0.7} />
  )
  return (
    <svg viewBox="0 0 560 590" role="img" aria-label="One BERT encoder layer: multi-head attention, add and norm, a feed-forward network per token, add and norm, repeated 12 times" className="mx-auto h-auto w-full max-w-sm font-mono text-foreground">
      <defs>
        <marker id="enc-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>

      <text x={290} y={40} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.6}>to the next layer</text>

      {/* the layer */}
      <rect x={110} y={90} width={340} height={355} rx={16} fill="none" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.5} />
      <text x={96} y={268} textAnchor="middle" fontSize={13} fill="currentColor" opacity={0.6} transform="rotate(-90 96 268)">ONE ENCODER LAYER</text>

      {/* × 12: the output goes back in as the next layer's input */}
      <path d="M450,105 H495 V430 H458" fill="none" stroke="currentColor" strokeWidth={1.5} markerEnd="url(#enc-arrow)" />
      <text x={503} y={272} fontSize={17} fill="currentColor">{"×"}12</text>

      {skip(430, 315)}
      {skip(282, 135)}

      {box(140, 360, 300, 38, "Multi-head attention", 0.14)}
      {box(140, 298, 300, 34, "Add & Norm", 0)}
      {encCols.map((c) => <g key={c}>{box(c - 60, 218, 120, 34, "FFN", 0.07)}</g>)}
      {box(140, 118, 300, 34, "Add & Norm", 0)}

      {encCols.map((c, i) => (
        <g key={c}>
          {up(c, 118, 60)}
          {up(c, 218, 152)}
          {up(c, 298, 252)}
          {up(c, 360, 332)}
          {up(c, 471, 398)}
          <circle cx={c} cy={480} r={9} fill="none" stroke="currentColor" strokeWidth={1.5} />
          <path d={`M${c - 5},480 H${c + 5} M${c},475 V485`} stroke="currentColor" strokeWidth={1.5} />
          <line x1={c} y1={513} x2={c} y2={489} stroke="currentColor" strokeWidth={1.5} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={c - 28 + k * 14} y={513} width={14} height={14} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeOpacity={0.6} />
          ))}
          <text x={c - 36} y={524} textAnchor="end" fontSize={14} fill="currentColor" opacity={0.7}>x{i ? "₂" : "₁"}</text>
          <text x={c} y={560} textAnchor="middle" fontSize={16} fill="currentColor">{words[i]}</text>
        </g>
      ))}
      <text x={encCols[0] - 16} y={477} textAnchor="end" fontSize={12} fill="currentColor" opacity={0.6}>+ position</text>
    </svg>
  )
}

// ---------- the MLM head guessing a masked word ----------

const guesses: { s: string; g: [string, number][] }[] = [
  { s: "i went for a [MASK]", g: [["run", 0.31], ["walk", 0.24], ["swim", 0.08], ["drive", 0.07], ["ride", 0.05], ["banana", 0.0]] },
  { s: "we sat on the river [MASK]", g: [["bank", 0.44], ["bed", 0.11], ["side", 0.07], ["edge", 0.05], ["shore", 0.04], ["loan", 0.0]] },
  { s: "i deposited the cash at the [MASK]", g: [["bank", 0.63], ["atm", 0.07], ["office", 0.04], ["counter", 0.03], ["store", 0.02], ["river", 0.0]] },
]

export function MlmHead() {
  const [s, setS] = useState(0)
  return (
    <div className="space-y-4">
      <Pills options={guesses.map((g, value) => ({ value, label: g.s }))} value={s} onChange={setS} />
      <Bars rows={guesses[s].g.map(([label, value]) => ({ label, value }))} max={0.7} />
      <div className="font-mono text-xs text-muted-foreground">top guesses out of all 30,522, after softmax. made-up but realistic numbers</div>
    </div>
  )
}

// ---------- from the w_ij grid to one sparse doc vector ----------

const docToks = ["she", "ran", "a", "marathon"]
const vcols = ["run", "ran", "marathon", "race", "running", "she", "a", "banana"]
const logits = [
  [-1.2, 0.3, -0.8, -1.5, -1.0, 4.1, -0.5, -3.0],
  [3.2, 5.0, 0.9, 1.4, 2.1, -0.4, -1.1, -2.6],
  [0.4, -0.2, 0.6, 0.8, -0.6, -1.0, 1.2, -2.2],
  [2.0, 0.5, 6.0, 2.6, 1.7, -1.3, -0.9, -2.9],
]
const pipeSteps = ["logits w\u1d62\u2c7c", "ReLU", "log(1 + \u00b7)", "max over tokens"]
const pipeTex = [
  "w_{ij}",
  "\\text{ReLU}(w_{ij}) = \\max(0, w_{ij})",
  "\\log\\big(1 + \\text{ReLU}(w_{ij})\\big)",
  "w_j = \\max_i \\log\\big(1 + \\text{ReLU}(w_{ij})\\big)",
]
const spladeWeights = vcols.map((_, j) => Math.max(...logits.map((r) => Math.log(1 + Math.max(0, r[j])))))

export function SpladePipeline() {
  const [step, setStep] = useState(0)
  const m = logits.map((r) => r.map((v) => (step === 0 ? v : step === 1 ? Math.max(0, v) : Math.log(1 + Math.max(0, v)))))
  const best = vcols.map((_, j) => m.reduce((b, r, i) => (r[j] > m[b][j] ? i : b), 0))
  return (
    <div className="space-y-4">
      <Pills options={pipeSteps.map((label, value) => ({ value, label: `${value + 1}. ${label}` }))} value={step} onChange={setStep} />
      <div className="text-sm"><Tex>{pipeTex[step]}</Tex></div>
      <div className="overflow-x-auto">
        <Matrix
          m={m}
          rows={docToks}
          cols={vcols}
          heat={step === 0 ? 6 : step === 1 ? 6 : Math.log(7)}
          hl={(i, j) => step === 3 && best[j] === i && m[i][j] > 0}
        />
        {step === 3 && (
          <div className="mt-2">
            <Matrix m={[spladeWeights]} rows={["doc"]} cols={vcols} heat={Math.log(7)} />
          </div>
        )}
      </div>
      <div className="font-mono text-xs text-muted-foreground">
        rows = tokens of the doc, columns = 8 of the 30,522 vocab slots. {step === 3 ? "outlined = the token that won each column" : ""}
      </div>
    </div>
  )
}

// ---------- the sparsity penalty, as a toy ----------

const flopsTerms: { t: string; w: number; p: number }[] = [
  ...vcols.slice(0, 7).map((t, j) => ({ t, w: spladeWeights[j], p: ({ she: 0.35, a: 0.9 } as Record<string, number>)[t] ?? 0.05 })),
  { t: "jogging", w: 0.5, p: 0.01 },
  { t: "athlete", w: 0.4, p: 0.01 },
  { t: "finish", w: 0.3, p: 0.03 },
]

export function Flops() {
  const [lambda, setLambda] = useState(0)
  const rows = flopsTerms
    .map(({ t, w, p }) => ({ label: t, value: Math.max(0, w - lambda * (0.3 + 2.5 * p)) }))
    .sort((a, b) => b.value - a.value)
  const active = rows.filter((r) => r.value > 0).length
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="w-24 text-foreground">λ = {lambda.toFixed(2)}</span>
        <input type="range" min={0} max={2} step={0.02} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} className="plot-range min-w-0 flex-1" />
        <span className="w-28 text-right">{active} non-zero</span>
      </label>
      <Bars rows={rows.map((r) => ({ ...r, dim: r.value === 0 }))} max={2} />
    </div>
  )
}

// ---------- scoring: sparse dot product ----------

const query: Record<string, number> = { run: 2.1, morning: 1.8, running: 1.1, jogging: 0.8, exercise: 0.5 }
const docs: { name: string; text: string; v: Record<string, number> }[] = [
  { name: "A", text: "she ran a marathon", v: { marathon: 1.95, ran: 1.79, run: 1.44, race: 1.28, running: 1.13, jogging: 0.5 } },
  { name: "B", text: "how to run a python script", v: { python: 2.4, script: 2.1, run: 1.3, code: 1.1, execute: 0.9, program: 0.8 } },
  { name: "C", text: "jogging every morning", v: { jogging: 2.3, morning: 2.0, running: 1.2, run: 1.0, every: 0.9, exercise: 0.7 } },
]
const bm25Words: Record<string, string[]> = { A: [], B: ["run"], C: ["morning"] }
const shared = (v: Record<string, number>) => Object.keys(query).filter((t) => t in v)
const score = (v: Record<string, number>) => shared(v).reduce((s, t) => s + query[t] * v[t], 0)

export function SparseDot() {
  const [d, setD] = useState(0)
  const doc = docs[d]
  const terms = shared(doc.v)
  return (
    <div className="space-y-4">
      <div className="font-mono text-xs">
        <span className="text-muted-foreground">query &ldquo;morning run&rdquo; {"\u2192"} </span>
        {Object.entries(query).map(([t, w]) => `${t} ${w}`).join(" \u00b7 ")}
      </div>
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="text-muted-foreground">
            <th className="py-1 text-left font-normal">doc</th>
            <th className="py-1 text-left font-normal">BM25 matches</th>
            <th className="py-1 text-right font-normal">SPLADE score</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((x, i) => (
            <tr key={x.name} onClick={() => setD(i)} className={`cursor-pointer border-t border-border ${i === d ? "text-foreground" : "text-muted-foreground"}`}>
              <td className="py-1.5">{x.name}: {x.text}</td>
              <td className="py-1.5">{bm25Words[x.name].join(", ") || "nothing, score 0"}</td>
              <td className="py-1.5 text-right">{score(x.v).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space-y-1 text-sm">
        <div className="font-mono text-xs text-muted-foreground">doc {doc.name}: {Object.entries(doc.v).map(([t, w]) => `${t} ${w}`).join(" \u00b7 ")}</div>
        <Tex>{`s(q, d_{${doc.name}}) = ${terms.map((t) => `\\underbrace{${query[t]} \\times ${doc.v[t]}}_{\\text{${t}}}`).join(" + ")} = ${score(doc.v).toFixed(2)}`}</Tex>
      </div>
    </div>
  )
}

// ---------- indexing and search, end to end ----------

const flow = [
  { name: "indexing, once, offline", steps: ["doc", "SPLADE (BERT + MLM head + max)", "{marathon 1.95, ran 1.79, run 1.44, \u2026}", "posting lists: marathon \u2192 (A, 1.95) \u2026"] },
  { name: "search, every query", steps: ["query", "SPLADE (or just its tokens)", "{run 2.1, morning 1.8, \u2026}", "walk those posting lists, add up q\u2c7c \u00d7 d\u2c7c", "ranked docs"] },
]

export function SpladeFlow() {
  return (
    <div className="space-y-5">
      {flow.map((f) => (
        <div key={f.name} className="space-y-2">
          <div className="font-mono text-xs text-muted-foreground">{f.name}</div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {f.steps.map((s, i) => (
              <Fragment key={s}>
                {i > 0 && <span className="text-muted-foreground">{"\u2192"}</span>}
                <span className="rounded border border-border px-2 py-1">{s}</span>
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plot } from "@/components/plot"

// BM25's TF term with length factor L = 1 - b + b·θ, plotted live as k and b are dragged
const S = (t: number, k: number, L = 1) => (t * (k + 1)) / (t + k * L)
const L = (theta: number, b: number) => 1 - b + b * theta

function Slider({ name, hint, value, min, max, step, onChange }: {
  name: string
  hint: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
      <span className="w-[4.5rem] shrink-0 whitespace-nowrap text-foreground">{name} = {value.toFixed(2)}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="plot-range min-w-0 flex-1"
      />
      <span className="w-[5.5rem] shrink-0 whitespace-nowrap text-right">{hint}</span>
    </label>
  )
}

const KSlider = ({ k, setK }: { k: number; setK: (v: number) => void }) => (
  <Slider name="k" hint="usual 1.2–2" value={k} min={0} max={3} step={0.05} onChange={setK} />
)
const BSlider = ({ b, setB }: { b: number; setB: (v: number) => void }) => (
  <Slider name="b" hint="usual 0.75" value={b} min={0} max={1} step={0.05} onChange={setB} />
)

export function Saturation() {
  const [k, setK] = useState(1.2)
  return (
    <div className="space-y-4">
      <Plot
        id="saturation"
        x={[0, 20]}
        y={[0, 4.2]}
        xTicks={[0, 5, 10, 15, 20]}
        yTicks={[0, 1, 2, 3, 4]}
        xLabel="TF"
        yLabel="score"
        curves={[
          { label: `BM25, ceiling k + 1 = ${(k + 1).toFixed(2)}`, f: (t) => S(t, k) },
          { label: "raw TF", f: (t) => t },
        ]}
      />
      <KSlider k={k} setK={setK} />
    </div>
  )
}

export function SaturationSlope() {
  const [k, setK] = useState(1.2)
  return (
    <div className="space-y-4">
      <Plot
        id="saturation-slope"
        x={[0, 10]}
        y={[0, 3]}
        xTicks={[0, 2, 4, 6, 8, 10]}
        yTicks={[0, 1, 2, 3]}
        xLabel="TF"
        yLabel="dS / dTF"
        curves={[
          { label: "BM25 slope", f: (t) => (k * (k + 1)) / (t + k) ** 2 },
          { label: "raw TF slope", f: () => 1 },
        ]}
      />
      <KSlider k={k} setK={setK} />
    </div>
  )
}

export function LengthTf() {
  const [k, setK] = useState(1.2)
  const [b, setB] = useState(0.75)
  return (
    <div className="space-y-4">
      <Plot
        id="length-tf"
        x={[0, 20]}
        y={[0, 4.2]}
        xTicks={[0, 5, 10, 15, 20]}
        yTicks={[0, 1, 2, 3, 4]}
        xLabel="TF"
        yLabel="score"
        curves={[0.5, 1, 2, 4].map((theta) => ({ label: `θ = ${theta}`, f: (t: number) => S(t, k, L(theta, b)) }))}
      />
      <div className="space-y-2">
        <KSlider k={k} setK={setK} />
        <BSlider b={b} setB={setB} />
      </div>
    </div>
  )
}

export function LengthTheta() {
  const [k, setK] = useState(1.2)
  const [b, setB] = useState(0.75)
  return (
    <div className="space-y-4">
      <Plot
        id="length-theta"
        x={[0, 5]}
        y={[0, 4.2]}
        xTicks={[0, 1, 2, 3, 4, 5]}
        yTicks={[0, 1, 2, 3, 4]}
        xLabel="θ = |D| / avgdl"
        yLabel="score"
        curves={[
          { label: `b = ${b.toFixed(2)}`, f: (theta) => S(3, k, L(theta, b)) },
          { label: "b = 0 (no length penalty)", f: () => S(3, k) },
        ]}
      />
      <div className="space-y-2">
        <KSlider k={k} setK={setK} />
        <BSlider b={b} setB={setB} />
      </div>
    </div>
  )
}

type Curve = { label: string; f: (x: number) => number }

// the site is monochrome, so curves are told apart by dash and opacity, in this order
const looks = [
  { opacity: 1, dash: undefined },
  { opacity: 0.75, dash: "6 4" },
  { opacity: 0.6, dash: "2 4" },
  { opacity: 0.45, dash: "10 3 2 3" },
]

const W = 340
const H = 220
const pad = { l: 42, r: 8, t: 10, b: 40 }

/** Line plot of a few functions, drawn as inline SVG. `id` must be unique on the page (clip path). */
export function Plot({
  id,
  x,
  y,
  xTicks,
  yTicks,
  xLabel,
  yLabel,
  curves,
}: {
  id: string
  x: [number, number]
  y: [number, number]
  xTicks: number[]
  yTicks: number[]
  xLabel: string
  yLabel: string
  curves: Curve[]
}) {
  const sx = (v: number) => pad.l + ((v - x[0]) / (x[1] - x[0])) * (W - pad.l - pad.r)
  const sy = (v: number) => H - pad.b - ((v - y[0]) / (y[1] - y[0])) * (H - pad.t - pad.b)
  const path = (f: Curve["f"]) => {
    let d = ""
    let pen = false
    for (let i = 0; i <= 400; i++) {
      const xv = x[0] + (i / 400) * (x[1] - x[0])
      const yv = f(xv)
      if (!Number.isFinite(yv)) {
        pen = false
        continue
      }
      d += `${pen ? "L" : "M"}${sx(xv).toFixed(1)},${sy(Math.max(Math.min(yv, y[1] + 100), y[0] - 100)).toFixed(1)}`
      pen = true
    }
    return d
  }

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${yLabel} against ${xLabel}: ${curves.map((c) => c.label).join(", ")}`}
        className="w-full h-auto text-muted-foreground"
      >
        <clipPath id={`plot-${id}`}>
          <rect x={pad.l} y={pad.t} width={W - pad.l - pad.r} height={H - pad.t - pad.b} />
        </clipPath>
        {yTicks.map((v) => (
          <g key={`y${v}`}>
            <line x1={pad.l} x2={W - pad.r} y1={sy(v)} y2={sy(v)} stroke="currentColor" opacity={v === 0 ? 0.6 : 0.15} />
            <text x={pad.l - 6} y={sy(v) + 4} textAnchor="end" fontSize="12" fill="currentColor">{v}</text>
          </g>
        ))}
        {xTicks.map((v) => (
          <g key={`x${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={pad.t} y2={H - pad.b} stroke="currentColor" opacity={v === 0 ? 0.6 : 0.15} />
            <text x={sx(v)} y={H - pad.b + 16} textAnchor="middle" fontSize="12" fill="currentColor">{v}</text>
          </g>
        ))}
        <text x={(pad.l + W - pad.r) / 2} y={H - 4} textAnchor="middle" fontSize="12" fill="currentColor">{xLabel}</text>
        <text transform={`translate(12 ${(pad.t + H - pad.b) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="currentColor">{yLabel}</text>
        <g clipPath={`url(#plot-${id})`} className="text-foreground" fill="none" stroke="currentColor" strokeWidth="2">
          {curves.map((c, i) => (
            <path key={c.label} d={path(c.f)} strokeDasharray={looks[i].dash} opacity={looks[i].opacity} />
          ))}
        </g>
      </svg>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
        {curves.map((c, i) => (
          <span key={c.label} className="flex items-center gap-1.5">
            <svg width="22" height="6" aria-hidden="true" className="text-foreground">
              <line x1="0" y1="3" x2="22" y2="3" stroke="currentColor" strokeWidth="2" strokeDasharray={looks[i].dash} opacity={looks[i].opacity} />
            </svg>
            {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

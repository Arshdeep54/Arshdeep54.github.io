import type { ReactNode } from "react"
import { Plot } from "@/components/plot"
import { LengthTf, LengthTheta, Saturation, SaturationSlope } from "@/components/bm25-plots"

// Figures for markdown posts, placed with a ```figure <name> fence whose body is the caption.

export const figures: Record<string, ReactNode> = {
  // From Brute Force to BM25
  log: (
    <Plot
      id="log"
      x={[0, 4]}
      y={[-3, 2]}
      xTicks={[0, 1, 2, 3, 4]}
      yTicks={[-3, -2, -1, 0, 1, 2]}
      xLabel="x"
      yLabel="y"
      curves={[
        { label: "ln x", f: Math.log },
        { label: "ln(x + 1)", f: (x) => Math.log(x + 1) },
      ]}
    />
  ),
  saturation: <Saturation />,
  "saturation-slope": <SaturationSlope />,
  "length-tf": <LengthTf />,
  "length-theta": <LengthTheta />,
}

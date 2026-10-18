import type { ReactNode } from "react"
import { Plot } from "@/components/plot"
import { LengthTf, LengthTheta, Saturation, SaturationSlope } from "@/components/bm25-plots"
import {
  AttentionHeat,
  AttentionFormula,
  Concat,
  EncoderStack,
  Embedding,
  Expansion,
  Flops,
  MlmHead,
  Positions,
  RabbitHole,
  SparseDot,
  SpladeFlow,
  SpladePipeline,
  TrainAttention,
  WordPiece,
} from "@/components/splade-figs"

const relu = (x: number) => Math.max(0, x)
// tanh approximation, the one BERT's code uses
const gelu = (x: number) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)))

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

  // Sparse Retrieval, Part 2: SPLADE
  expansion: <Expansion />,
  "rabbit-hole": <RabbitHole />,
  wordpiece: <WordPiece />,
  embedding: <Embedding />,
  "attention-heat": <AttentionHeat />,
  "attention-formula": <AttentionFormula />,
  concat: <Concat />,
  "encoder-stack": <EncoderStack />,
  "train-attention": <TrainAttention />,
  positions: <Positions />,
  activations: (
    <Plot
      id="activations"
      x={[-3, 3]}
      y={[-0.5, 3]}
      xTicks={[-3, -2, -1, 0, 1, 2, 3]}
      yTicks={[0, 1, 2, 3]}
      xLabel="x"
      yLabel="output"
      curves={[
        { label: "GELU (BERT)", f: gelu },
        { label: "ReLU", f: relu },
      ]}
    />
  ),
  "mlm-head": <MlmHead />,
  "log-relu": (
    <div className="mx-auto max-w-md">
      <Plot
        id="log-relu"
        x={[-3, 8]}
        y={[-1, 8]}
        xTicks={[-2, 0, 2, 4, 6, 8]}
        yTicks={[0, 2, 4, 6, 8]}
        xLabel="logit wᵢⱼ"
        yLabel="weight"
        curves={[
          { label: "log(1 + ReLU(x))", f: (x) => Math.log(1 + relu(x)) },
          { label: "ReLU(x)", f: relu },
        ]}
      />
    </div>
  ),
  "splade-pipeline": <SpladePipeline />,
  flops: <Flops />,
  "splade-flow": <SpladeFlow />,
  "sparse-dot": <SparseDot />,
}

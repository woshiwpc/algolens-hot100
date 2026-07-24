export type Difficulty = '简单' | '中等' | '困难'

export type VisualKind =
  | 'array'
  | 'window'
  | 'matrix'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'backtracking'
  | 'binary-search'
  | 'stack'
  | 'heap'
  | 'dp'

export interface ProblemExample {
  label: string
  input: string
  output: string
  source: 'leetcode' | 'supplement'
}

export interface ProblemDefinition {
  id: number
  title: string
  slug: string
  category: string
  difficulty: Difficulty
  pattern: string
  summary: string
  sample: string
  examples: readonly ProblemExample[]
  visualKind: VisualKind
  sourceCode: string
  leetcodeUrl: string
  codeReference?: {
    label: '代码随想录参考'
    pageTitle: string
    url: string
    cppVariants: number
  }
}

export interface VisualNode {
  id: string
  label: string
  x: number
  y: number
}

export interface VisualEdge {
  from: string
  to: string
  dashed?: boolean
}

export interface UniversalSnapshot {
  kind: VisualKind
  title: string
  sample: string
  values: Array<string | number>
  active: number[]
  visited: number[]
  pointers: Record<string, number>
  matrix: Array<Array<string | number>>
  nodes: VisualNode[]
  edges: VisualEdge[]
  stack: Array<string | number>
  table: Array<Array<string | number>>
  path: string[]
  phase: number
  totalPhases: number
  result: string
}

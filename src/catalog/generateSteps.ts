import type { Step } from '../types/step'
import type {
  ProblemDefinition,
  UniversalSnapshot,
  VisualEdge,
  VisualNode,
} from './types'

const FALLBACK_VALUES = [2, 7, 1, 8, 3, 6, 4]

function parseValues(sample: string): Array<string | number> {
  const quoted = sample.match(/"([^"]+)"/)
  const firstBracket = sample.match(/\[([^[]+)\]/)

  if (firstBracket) {
    const tokens = firstBracket[1]
      .split(',')
      .map((token) => token.trim().replace(/^"|"$/g, ''))
      .filter((token) => token && token !== 'null')
      .slice(0, 12)
    if (tokens.length) {
      return tokens.map((token) => {
        const number = Number(token)
        return Number.isFinite(number) ? number : token
      })
    }
  }

  if (quoted?.[1]) return Array.from(quoted[1]).slice(0, 14)

  const numbers = sample.match(/-?\d+/g)?.map(Number).slice(0, 10)
  return numbers?.length ? numbers : FALLBACK_VALUES
}

function parseMatrix(sample: string): Array<Array<string | number>> {
  const matrixPart = sample.match(/\[\[(.*?)\]\]/)?.[1]
  const numbers = matrixPart?.match(/-?\d+|[A-Za-z]/g) ?? []
  const values = numbers.slice(0, 20).map((value) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : value
  })
  if (!values.length) return [[1, 1, 0], [1, 0, 1], [1, 1, 1]]

  const explicitRows = matrixPart?.split(/\],\s*\[/).length ?? 1
  const columns = Math.max(1, Math.ceil(values.length / explicitRows))
  return Array.from({ length: explicitRows }, (_, row) =>
    values.slice(row * columns, (row + 1) * columns),
  )
}

function treeNodes(values: Array<string | number>): VisualNode[] {
  const labels = values.length ? values.slice(0, 7) : [1, 2, 3, 4, 5, 6, 7]
  const positions = [
    [50, 12], [26, 39], [74, 39], [14, 72], [38, 72], [62, 72], [86, 72],
  ]
  return labels.map((label, index) => ({
    id: String(index),
    label: String(label),
    x: positions[index][0],
    y: positions[index][1],
  }))
}

function graphNodes(values: Array<string | number>): VisualNode[] {
  const labels = (values.length ? values : [0, 1, 2, 3, 4, 5]).slice(0, 7)
  return labels.map((label, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / labels.length
    return {
      id: String(index),
      label: String(label),
      x: 50 + Math.cos(angle) * 34,
      y: 50 + Math.sin(angle) * 34,
    }
  })
}

function connect(nodes: VisualNode[], tree: boolean): VisualEdge[] {
  if (tree) {
    return nodes.slice(1).map((node, index) => ({
      from: String(Math.floor((index + 1 - 1) / 2)),
      to: node.id,
    }))
  }
  return nodes.map((node, index) => ({
    from: node.id,
    to: nodes[(index + 1) % nodes.length].id,
    dashed: index % 3 === 2,
  }))
}

function importantLines(sourceCode: string): number[] {
  const lines = sourceCode.split('\n')
  const ranked = lines
    .map((line, index) => ({ line: index + 1, text: line.trim() }))
    .filter(({ text }) => /^(for|while|if|else|return)|\b(dfs|push|pop|swap|dp\[|ans\s*=|ans\.)/.test(text))
    .map(({ line }) => line)

  const unique = Array.from(new Set(ranked))
  if (unique.length >= 6) return unique.slice(0, 6)

  const candidates = [3, Math.ceil(lines.length * 0.3), Math.ceil(lines.length * 0.48), Math.ceil(lines.length * 0.64), Math.ceil(lines.length * 0.8), lines.length - 1]
  const safeCandidates = candidates.map((line) =>
    Math.max(1, Math.min(lines.length, line)),
  )
  return Array.from(new Set([...unique, ...safeCandidates])).slice(0, 6)
}

function makeTable(rows: number, columns: number, filled: number) {
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns }, (_, col) => {
      const index = row * columns + col
      return index < filled ? (row + col + 1) % 9 : '·'
    }),
  )
}

export function generateProblemSteps(problem: ProblemDefinition): Step<UniversalSnapshot>[] {
  const values = parseValues(problem.sample)
  const matrix = parseMatrix(problem.sample)
  const isTree = problem.visualKind === 'tree' || problem.visualKind === 'heap' || problem.visualKind === 'backtracking'
  const nodes = isTree ? treeNodes(values) : graphNodes(values)
  const edges = connect(nodes, isTree)
  const lines = importantLines(problem.sourceCode)
  const totalPhases = 6

  const descriptions = [
    `载入默认示例，先识别输入规模与需要维护的状态。`,
    `核心策略是「${problem.pattern}」：${problem.summary}`,
    `进入标准代码的主循环或递归分支，处理当前高亮元素。`,
    `依据条件更新指针、容器或状态转移，并保持算法不变量。`,
    `继续排除不可能的选择，把已确定的局部结果合并进答案。`,
    `遍历完成；由最终状态读出结果，并复核复杂度与边界。`,
  ]

  return descriptions.map((description, phase) => {
    const progress = phase / (totalPhases - 1)
    const length = Math.max(1, values.length)
    const activeIndex = Math.min(length - 1, Math.floor(progress * length))
    const visitedCount = Math.min(length, Math.ceil(progress * length))
    const flatMatrixLength = Math.max(1, matrix.flat().length)
    const matrixActive = Math.min(flatMatrixLength - 1, Math.floor(progress * flatMatrixLength))
    const nodeActive = Math.min(nodes.length - 1, Math.floor(progress * nodes.length))
    const stackSize = Math.max(0, Math.ceil(progress * Math.min(values.length, 6)))
    const pointers: Record<string, number> = {}

    if (problem.visualKind === 'window') {
      pointers.left = Math.max(0, activeIndex - 2)
      pointers.right = activeIndex
    } else if (problem.visualKind === 'binary-search') {
      pointers.left = Math.min(activeIndex, Math.floor((length - 1) / 2))
      pointers.mid = Math.floor((pointers.left + length - 1) / 2)
      pointers.right = length - 1
    } else if (problem.visualKind === 'array') {
      pointers.current = activeIndex
      if (/双指针|三指针|边界/.test(problem.pattern)) {
        pointers.left = Math.min(activeIndex, length - 1)
        pointers.right = Math.max(pointers.left, length - 1 - Math.floor(progress * 2))
      }
    }

    const active = problem.visualKind === 'matrix' || problem.visualKind === 'graph'
      ? [matrixActive]
      : [activeIndex]
    const visited = Array.from({ length: visitedCount }, (_, index) => index)

    return {
      id: `${problem.id}-phase-${phase}`,
      codeLine: lines[Math.min(phase, lines.length - 1)] ?? 1,
      description,
      variables: {
        phase: `${phase + 1} / ${totalPhases}`,
        strategy: problem.pattern,
        current: values[activeIndex] ?? '—',
        progress: `${Math.round(progress * 100)}%`,
      },
      snapshot: {
        kind: problem.visualKind,
        title: problem.pattern,
        sample: problem.sample,
        values,
        active,
        visited,
        pointers,
        matrix,
        nodes,
        edges,
        stack: values.slice(0, stackSize),
        table: makeTable(4, 6, Math.ceil(progress * 24)),
        path: nodes.slice(0, Math.max(1, nodeActive + 1)).map((node) => node.id),
        phase,
        totalPhases,
        result: phase === totalPhases - 1 ? problem.summary : '',
      },
    }
  })
}

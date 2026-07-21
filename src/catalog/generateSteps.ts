import type { Step } from '../types/step'
import type {
  ProblemDefinition,
  UniversalSnapshot,
  VisualEdge,
  VisualNode,
} from './types'

const FALLBACK_VALUES = [2, 7, 1, 8, 3, 6, 4]
const MAX_STEPS = 520

function parseValues(sample: string): Array<string | number> {
  if (/=\s*\[\s*\]/.test(sample)) return []
  const quoted = sample.match(/"([^"]+)"/)
  const firstBracket = sample.match(/\[([^[]+)\]/)

  if (firstBracket) {
    const tokens = firstBracket[1]
      .split(',')
      .map((token) => token.trim().replace(/^"|"$/g, ''))
      .filter((token) => token && token !== 'null')
      .slice(0, 16)
    if (tokens.length) {
      return tokens.map((token) => {
        const number = Number(token)
        return Number.isFinite(number) ? number : token
      })
    }
  }

  if (quoted?.[1]) return Array.from(quoted[1]).slice(0, 18)
  const numbers = sample.match(/-?\d+/g)?.map(Number).slice(0, 14)
  return numbers?.length ? numbers : FALLBACK_VALUES
}

function parseMatrix(sample: string): Array<Array<string | number>> {
  const matrixPart = sample.match(/\[\[(.*?)\]\]/)?.[1]
  const tokens = matrixPart?.match(/-?\d+|[A-Za-z]/g) ?? []
  const values = tokens.slice(0, 36).map((value) => {
    const number = Number(value)
    return Number.isFinite(number) ? number : value
  })
  if (!values.length) return [[1, 1, 0], [1, 0, 1], [1, 1, 1]]
  const rows = matrixPart?.split(/\],\s*\[/).length ?? 1
  const columns = Math.max(1, Math.ceil(values.length / rows))
  return Array.from({ length: rows }, (_, row) =>
    values.slice(row * columns, (row + 1) * columns),
  )
}

function numberParam(sample: string, name: string, fallback: number) {
  const match = sample.match(new RegExp(`${name}\\s*=\\s*(-?\\d+)`))
  return match ? Number(match[1]) : fallback
}

function quotedParam(sample: string, name: string) {
  return sample.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))?.[1] ?? ''
}

function allQuoted(sample: string) {
  return Array.from(sample.matchAll(/"([^"]*)"/g), (match) => match[1])
}

function numericValues(values: Array<string | number>) {
  return values.map(Number).filter(Number.isFinite)
}

function treeNodes(values: Array<string | number>): VisualNode[] {
  const labels = (values.length ? values : ['∅']).slice(0, 15)
  return labels.map((label, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const first = 2 ** level - 1
    const offset = index - first
    const count = 2 ** level
    return {
      id: String(index),
      label: String(label),
      x: ((offset + 0.5) / count) * 92 + 4,
      y: 12 + level * 23,
    }
  })
}

function graphNodes(values: Array<string | number>): VisualNode[] {
  const labels = (values.length ? values : [0, 1, 2, 3, 4, 5]).slice(0, 9)
  return labels.map((label, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / labels.length
    return { id: String(index), label: String(label), x: 50 + Math.cos(angle) * 34, y: 50 + Math.sin(angle) * 34 }
  })
}

function connect(nodes: VisualNode[], tree: boolean): VisualEdge[] {
  if (tree) {
    return nodes.slice(1).map((node, index) => ({ from: String(Math.floor(index / 2)), to: node.id }))
  }
  if (nodes.length < 2) return []
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
    .filter(({ text }) => /^(for|while|if|else|return)|\b(dfs|push|pop|swap|reverse|dp\[|ans\s*=|ans\.|left\s*=|right\s*=)/.test(text))
    .map(({ line }) => line)
  const candidates = [3, Math.ceil(lines.length * 0.3), Math.ceil(lines.length * 0.5), Math.ceil(lines.length * 0.7), lines.length - 1]
  return Array.from(new Set([...ranked, ...candidates.map((line) => Math.max(1, Math.min(lines.length, line)))]))
}

interface TraceContext {
  problem: ProblemDefinition
  sample: string
  values: Array<string | number>
  matrix: Array<Array<string | number>>
  nodes: VisualNode[]
  edges: VisualEdge[]
  lines: number[]
  steps: Step<UniversalSnapshot>[]
  record: (
    description: string,
    variables?: Record<string, unknown>,
    overrides?: Partial<UniversalSnapshot>,
  ) => void
}

function createContext(problem: ProblemDefinition, sample: string): TraceContext {
  const values = parseValues(sample)
  const matrix = parseMatrix(sample)
  const isTree = ['tree', 'heap', 'backtracking'].includes(problem.visualKind)
  const nodes = isTree ? treeNodes(values) : graphNodes(values)
  const edges = connect(nodes, isTree)
  const lines = importantLines(problem.sourceCode)
  const steps: Step<UniversalSnapshot>[] = []

  const record: TraceContext['record'] = (description, variables = {}, overrides = {}) => {
    if (steps.length >= MAX_STEPS) return
    const index = steps.length
    steps.push({
      id: `${problem.id}-${index}`,
      codeLine: lines[index % lines.length] ?? 1,
      description,
      variables,
      snapshot: {
        kind: problem.visualKind,
        title: problem.pattern,
        sample,
        values: [...values],
        active: [],
        visited: [],
        pointers: {},
        matrix: matrix.map((row) => [...row]),
        nodes: nodes.map((node) => ({ ...node })),
        edges: edges.map((edge) => ({ ...edge })),
        stack: [],
        table: [],
        path: [],
        phase: index,
        totalPhases: 0,
        result: '',
        ...overrides,
      },
    })
  }

  return { problem, sample, values, matrix, nodes, edges, lines, steps, record }
}

function traceArray(ctx: TraceContext) {
  const { problem, values, record } = ctx
  const nums = numericValues(values)
  record(`读取输入，准备执行「${problem.pattern}」。`, { n: values.length, input: values })

  if ([11, 42].includes(problem.id) && nums.length) {
    let left = 0, right = nums.length - 1, best = 0
    while (left < right) {
      record(`比较左右边界 ${left} 与 ${right}。`, { left, right, leftValue: nums[left], rightValue: nums[right], best }, { active: [left, right], visited: [], pointers: { left, right } })
      const score = problem.id === 11
        ? Math.min(nums[left], nums[right]) * (right - left)
        : Math.max(0, Math.min(...nums.slice(0, left + 1)) - nums[left])
      best = Math.max(best, score)
      const moveLeft = nums[left] <= nums[right]
      record(moveLeft ? '左侧是当前短板，移动 left 才可能改善答案。' : '右侧是当前短板，移动 right 才可能改善答案。', { score, best, move: moveLeft ? 'left++' : 'right--' }, { active: [left, right], visited: [], pointers: { left, right } })
      if (moveLeft) ++left
      else --right
    }
    record('双指针相遇，所有可能的有效边界已经处理。', { answer: best }, { active: [left], pointers: { left, right }, result: `演示完成，当前答案为 ${best}。` })
    return
  }

  if (problem.id === 283) {
    const state = [...nums]
    let slow = 0
    for (let fast = 0; fast < state.length; ++fast) {
      record(`fast 检查索引 ${fast} 的值 ${state[fast]}。`, { slow, fast, value: state[fast] }, { values: [...state], active: [fast], visited: Array.from({ length: fast }, (_, i) => i), pointers: { slow, fast } })
      if (state[fast] !== 0) {
        ;[state[slow], state[fast]] = [state[fast], state[slow]]
        record(`发现非零值，与 slow=${slow} 交换。`, { slow, fast, array: state }, { values: [...state], active: [slow, fast], visited: Array.from({ length: fast + 1 }, (_, i) => i), pointers: { slow, fast } })
        ++slow
      }
    }
    record('扫描结束，所有非零元素保持相对顺序并移动到前部。', { answer: state }, { values: state, visited: state.map((_, i) => i), result: `结果：[${state.join(', ')}]` })
    return
  }

  if (problem.id === 1) {
    const target = numberParam(ctx.sample, 'target', 0)
    const seen = new Map<number, number>()
    for (let i = 0; i < nums.length; ++i) {
      const need = target - nums[i]
      record(`读取 nums[${i}]=${nums[i]}，计算补数 ${need}。`, { i, value: nums[i], need, seen: Object.fromEntries(seen) }, { active: [i], visited: Array.from({ length: i }, (_, j) => j), pointers: { current: i } })
      if (seen.has(need)) {
        const answer = [seen.get(need), i]
        record('补数已经在哈希表中，直接得到两个下标。', { answer }, { active: answer as number[], visited: Array.from({ length: i + 1 }, (_, j) => j), result: `答案下标：[${answer.join(', ')}]` })
        return
      }
      seen.set(nums[i], i)
      record(`把 ${nums[i]} → ${i} 写入哈希表。`, { seen: Object.fromEntries(seen) }, { active: [i], visited: Array.from({ length: i + 1 }, (_, j) => j), pointers: { current: i } })
    }
  }

  let running = 0
  let best = nums.length ? nums[0] : 0
  const visited: number[] = []
  for (let index = 0; index < values.length; ++index) {
    record(`进入第 ${index + 1} 轮，读取索引 ${index} 的值 ${values[index]}。`, { index, value: values[index], running, best }, { active: [index], visited: [...visited], pointers: { current: index } })
    const value = Number(values[index])
    if (Number.isFinite(value)) {
      running += value
      best = Math.max(best, running)
    }
    visited.push(index)
    record(`按「${problem.pattern}」更新本轮状态。`, { index, running, best, invariant: problem.summary }, { active: [index], visited: [...visited], pointers: { current: index } })
  }
  record('所有输入元素均已处理，返回累积状态中的最终答案。', { processed: visited.length, best }, { visited, result: `执行完成：${problem.summary}` })
}

function traceWindow(ctx: TraceContext) {
  const { problem, values, record, sample } = ctx
  const chars = values.map(String)
  const k = Math.max(1, numberParam(sample, 'k', quotedParam(sample, 'p').length || 3))
  const seen = new Map<string, number>()
  let left = 0, best = 0
  record(`建立窗口状态，left 从 0 开始。`, { left, k, inputLength: chars.length }, { pointers: { left, right: 0 } })
  for (let right = 0; right < chars.length; ++right) {
    const char = chars[right]
    record(`right 扩张到 ${right}，把「${char}」纳入窗口。`, { left, right, char, window: chars.slice(left, right + 1).join('') }, { active: [right], visited: Array.from({ length: right }, (_, i) => i), pointers: { left, right } })
    const duplicate = seen.get(char)
    const fixedWindow = [438, 239].includes(problem.id)
    if (problem.id === 3 && duplicate !== undefined && duplicate >= left) {
      record(`「${char}」在窗口内重复，旧位置是 ${duplicate}。`, { duplicate, left, right }, { active: [duplicate, right], pointers: { left, right } })
      left = duplicate + 1
      record(`left 跳到 ${left}，排除旧重复字符。`, { left, right }, { active: [right], pointers: { left, right } })
    } else if (fixedWindow && right - left + 1 > k) {
      record(`窗口长度超过 k=${k}，移出左端字符「${chars[left]}」。`, { removedIndex: left, removed: chars[left], k }, { active: [left, right], pointers: { left, right } })
      ++left
    } else if (problem.id === 76 && right - left + 1 > Math.max(3, k)) {
      record('当前窗口已满足一次覆盖检查，尝试收缩左边界。', { left, right, windowLength: right - left + 1 }, { active: [left, right], pointers: { left, right } })
      ++left
    }
    seen.set(char, right)
    best = Math.max(best, right - left + 1)
    record('更新窗口计数与当前最优答案。', { left, right, windowLength: right - left + 1, best }, { active: Array.from({ length: right - left + 1 }, (_, i) => left + i), visited: Array.from({ length: right + 1 }, (_, i) => i), pointers: { left, right } })
  }
  record('右边界到达末尾，窗口扫描完成。', { best, total: chars.length }, { visited: chars.map((_, i) => i), result: `窗口执行完成；记录到的最优长度为 ${best}。` })
}

function traceMatrix(ctx: TraceContext) {
  const { problem, matrix, record } = ctx
  const rows = matrix.length, columns = matrix[0]?.length ?? 0
  const order: Array<[number, number]> = []

  if (problem.id === 54) {
    let top = 0, bottom = rows - 1, left = 0, right = columns - 1
    while (top <= bottom && left <= right) {
      for (let col = left; col <= right; ++col) order.push([top, col])
      ++top
      for (let row = top; row <= bottom; ++row) order.push([row, right])
      --right
      if (top <= bottom) for (let col = right; col >= left; --col) order.push([bottom, col])
      --bottom
      if (left <= right) for (let row = bottom; row >= top; --row) order.push([row, left])
      ++left
    }
  } else if (problem.id === 240) {
    const target = numberParam(ctx.sample, 'target', 0)
    let row = 0, col = columns - 1
    while (row < rows && col >= 0) {
      order.push([row, col])
      const value = Number(matrix[row][col])
      if (value === target) break
      if (value > target) --col
      else ++row
    }
  } else {
    for (let row = 0; row < rows; ++row)
      for (let col = 0; col < columns; ++col) order.push([row, col])
  }

  record(`读取 ${rows}×${columns} 矩阵并初始化边界/标记。`, { rows, columns })
  const visited: number[] = []
  for (const [row, col] of order) {
    const index = row * columns + col
    record(`访问 matrix[${row}][${col}] = ${matrix[row][col]}。`, { row, col, value: matrix[row][col] }, { active: [index], visited: [...visited] })
    visited.push(index)
    record(`按「${problem.pattern}」完成这个格子的状态更新。`, { row, col, processed: visited.length, rule: problem.summary }, { active: [index], visited: [...visited] })
  }
  record('矩阵中所有需要访问的位置均已处理。', { visitedCells: visited.length }, { visited, result: `矩阵执行完成，共处理 ${visited.length} 个格子。` })
}

function traceLinkedList(ctx: TraceContext) {
  const { problem, values, record } = ctx
  record('创建哑结点/工作指针，保存链表头部。', { length: values.length, head: values[0] ?? 'null' })
  if (!values.length) {
    record('输入为空链表，直接返回 null。', { return: 'null' }, { values: [], result: '空链表无需继续处理。' })
    return
  }
  const reversed = [206, 24, 25].includes(problem.id)
  const state = [...values]
  const visited: number[] = []
  for (let index = 0; index < state.length; ++index) {
    record(`工作指针来到第 ${index} 个节点，值为 ${state[index]}。`, { index, current: state[index], next: state[index + 1] ?? 'null' }, { values: [...state], active: [index], visited: [...visited], pointers: { current: index } })
    if (reversed) {
      record('先保存 next，再修改当前节点的指向，避免丢失后续链表。', { prev: index ? state[index - 1] : 'null', current: state[index], savedNext: state[index + 1] ?? 'null' }, { values: [...state], active: index ? [index - 1, index] : [index], visited: [...visited, index], pointers: { prev: Math.max(0, index - 1), current: index } })
    } else {
      record(`执行「${problem.pattern}」的比较/连接动作。`, { node: state[index], processed: index + 1 }, { values: [...state], active: [index], visited: [...visited, index], pointers: { current: index } })
    }
    visited.push(index)
  }
  if (problem.id === 206) state.reverse()
  record('工作指针到达链表末尾，返回新的头结点或计算结果。', { resultHead: state[0] ?? 'null' }, { values: state, visited, result: `链表执行完成：${state.join(' → ')}${state.length ? ' → null' : ''}` })
}

function traceTree(ctx: TraceContext) {
  const { problem, nodes, record } = ctx
  record('从根节点开始，建立递归调用栈或 BFS 队列。', { root: nodes[0]?.label ?? 'null', nodeCount: nodes.length })
  if (!nodes.length || nodes[0]?.label === '∅') {
    record('根节点为空，命中递归基线并返回。', { return: problem.id === 104 ? 0 : 'null' }, { result: '空树处理完成。' })
    return
  }
  const order = problem.id === 94
    ? nodes.map((_, i) => i).sort((a, b) => ((a * 2 + 1) % nodes.length) - ((b * 2 + 1) % nodes.length))
    : nodes.map((_, i) => i)
  const path: string[] = []
  for (const index of order) {
    const node = nodes[index]
    path.push(node.id)
    record(`进入节点 ${node.label}，处理它的左/右子树关系。`, { node: node.label, index, stackDepth: Math.floor(Math.log2(index + 1)) + 1 }, { active: [index], visited: path.map(Number), path: [...path] })
    record(`节点 ${node.label} 的子问题返回，按「${problem.pattern}」合并结果。`, { node: node.label, completed: path.length, rule: problem.summary }, { active: [index], visited: path.map(Number), path: [...path] })
  }
  record('根节点的子问题已经合并，得到整棵树的答案。', { visitedNodes: path.length }, { visited: path.map(Number), path, result: `树执行完成，共访问 ${path.length} 个节点。` })
}

function traceGraph(ctx: TraceContext) {
  const { problem, nodes, record } = ctx
  const queue: number[] = nodes.length ? [0] : []
  const visited: number[] = []
  record(`初始化 visited 与${problem.id === 207 ? '入度队列' : '遍历队列'}。`, { queue, visited })
  while (queue.length && visited.length < nodes.length) {
    const current = queue.shift()!
    if (visited.includes(current)) continue
    record(`从队列取出节点 ${nodes[current].label}。`, { current, queue: [...queue], visited: [...visited] }, { active: [current], visited: [...visited], path: visited.map(String), stack: [...queue] })
    visited.push(current)
    const next = (current + 1) % nodes.length
    if (!visited.includes(next) && !queue.includes(next)) queue.push(next)
    if (current + 2 < nodes.length && current % 2 === 0) queue.push(current + 2)
    record('标记当前节点，并把新发现的相邻节点加入队列。', { visited: [...visited], queue: [...queue] }, { active: [current], visited: [...visited], path: visited.map(String), stack: [...queue] })
  }
  record('队列为空，所有可达节点已经处理。', { visitedCount: visited.length }, { visited, path: visited.map(String), result: `图遍历完成，共处理 ${visited.length} 个节点。` })
}

function traceBacktracking(ctx: TraceContext) {
  const { problem, values, nodes, record, sample, matrix } = ctx
  const path: Array<string | number> = []
  const snapshot = (depth: number) => ({
    path: nodes.slice(0, Math.max(1, Math.min(nodes.length, depth + 1))).map((node) => node.id),
    active: [Math.max(0, Math.min(nodes.length - 1, depth))],
  })
  const choose = (value: string | number, depth: number) => {
    path.push(value)
    record(`第 ${depth + 1} 层选择「${value}」，加入当前路径。`, { depth, choice: value, path: [...path] }, snapshot(depth))
  }
  const undo = (depth: number) => {
    const removed = path.pop()
    record(`撤销「${removed}」，恢复现场并尝试下一个选择。`, { depth, removed, path: [...path] }, snapshot(Math.max(0, depth - 1)))
  }
  const canContinue = () => ctx.steps.length < MAX_STEPS - 3
  record('初始化路径 path、选择状态与剪枝集合，进入第一层递归。', { path: [] })

  if (problem.id === 46) {
    const choices = values.slice(0, 7)
    const used = new Set<number>()
    const dfs = (depth: number) => {
      if (!canContinue()) return
      if (depth === choices.length) {
        record(`路径长度达到 n，收集排列 [${path.join(', ')}]。`, { solution: [...path] }, snapshot(depth - 1))
        return
      }
      for (let index = 0; index < choices.length; ++index) {
        if (used.has(index)) continue
        used.add(index); choose(choices[index], depth); dfs(depth + 1); undo(depth); used.delete(index)
      }
    }
    dfs(0)
  } else if (problem.id === 78) {
    const choices = values.slice(0, 10)
    const dfs = (start: number) => {
      if (!canContinue()) return
      record(`当前路径 [${path.join(', ')}] 是一个合法子集，立即收集。`, { start, subset: [...path] }, snapshot(path.length - 1))
      for (let index = start; index < choices.length; ++index) {
        choose(choices[index], path.length); dfs(index + 1); undo(path.length - 1)
      }
    }
    dfs(0)
  } else if (problem.id === 17) {
    const digits = quotedParam(sample, 'digits')
    const letters: Record<string, string> = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' }
    const dfs = (index: number) => {
      if (!canContinue()) return
      if (index === digits.length) {
        record(`数字串全部处理，收集组合「${path.join('')}」。`, { solution: path.join('') }, snapshot(index - 1))
        return
      }
      for (const char of letters[digits[index]] ?? '') {
        choose(char, index); dfs(index + 1); undo(index)
      }
    }
    dfs(0)
  } else if (problem.id === 39) {
    const choices = numericValues(values).sort((a, b) => a - b)
    const target = numberParam(sample, 'target', 0)
    const dfs = (start: number, remain: number) => {
      if (!canContinue()) return
      if (remain === 0) {
        record(`剩余目标为 0，收集组合 [${path.join(', ')}]。`, { solution: [...path] }, snapshot(path.length - 1))
        return
      }
      for (let index = start; index < choices.length && choices[index] <= remain; ++index) {
        choose(choices[index], path.length); dfs(index, remain - choices[index]); undo(path.length - 1)
      }
    }
    dfs(0, target)
  } else if (problem.id === 22) {
    const n = Math.min(6, numberParam(sample, 'n', 3))
    const dfs = (left: number, right: number) => {
      if (!canContinue()) return
      if (left + right === 2 * n) {
        record(`长度达到 ${2 * n}，收集合法括号「${path.join('')}」。`, { solution: path.join('') }, snapshot(path.length - 1))
        return
      }
      if (left < n) { choose('(', path.length); dfs(left + 1, right); undo(path.length - 1) }
      if (right < left) { choose(')', path.length); dfs(left, right + 1); undo(path.length - 1) }
    }
    dfs(0, 0)
  } else if (problem.id === 131) {
    const text = quotedParam(sample, 's')
    const palindrome = (left: number, right: number) => {
      while (left < right) if (text[left++] !== text[right--]) return false
      return true
    }
    const dfs = (start: number) => {
      if (!canContinue()) return
      if (start === text.length) {
        record(`切分到字符串末尾，收集 [${path.join(' | ')}]。`, { solution: [...path] }, snapshot(path.length - 1))
        return
      }
      for (let end = start; end < text.length; ++end) {
        const part = text.slice(start, end + 1)
        record(`检查片段「${part}」是否为回文。`, { start, end, part, palindrome: palindrome(start, end) }, snapshot(path.length))
        if (!palindrome(start, end)) continue
        choose(part, path.length); dfs(end + 1); undo(path.length - 1)
      }
    }
    dfs(0)
  } else if (problem.id === 51) {
    const n = Math.min(6, numberParam(sample, 'n', 4))
    const columns = new Set<number>(), diag1 = new Set<number>(), diag2 = new Set<number>()
    const dfs = (row: number) => {
      if (!canContinue()) return
      if (row === n) {
        record(`成功放置 ${n} 个皇后，收集列方案 [${path.join(', ')}]。`, { solution: [...path] }, snapshot(row - 1))
        return
      }
      for (let col = 0; col < n; ++col) {
        const conflict = columns.has(col) || diag1.has(row - col) || diag2.has(row + col)
        record(`检查 (${row}, ${col})：${conflict ? '与已有皇后冲突，剪枝' : '位置安全'}。`, { row, col, conflict }, snapshot(row))
        if (conflict) continue
        columns.add(col); diag1.add(row - col); diag2.add(row + col); choose(col, row)
        dfs(row + 1)
        undo(row); columns.delete(col); diag1.delete(row - col); diag2.delete(row + col)
      }
    }
    dfs(0)
  } else if (problem.id === 79) {
    const word = sample.match(/word\s*=\s*"?([A-Za-z]+)"?/)?.[1] ?? ''
    const rows = matrix.length, columns = matrix[0]?.length ?? 0
    const used = new Set<number>()
    const dfs = (row: number, col: number, index: number): boolean => {
      if (!canContinue()) return false
      if (index === word.length) {
        record(`单词「${word}」全部匹配成功。`, { word, matched: index }, { ...snapshot(path.length - 1), matrix, visited: [...used] })
        return true
      }
      if (row < 0 || row >= rows || col < 0 || col >= columns) return false
      const cell = row * columns + col
      if (used.has(cell) || String(matrix[row][col]) !== word[index]) return false
      used.add(cell); choose(matrix[row][col], index)
      record(`匹配 board[${row}][${col}]，继续搜索四个相邻方向。`, { row, col, index, char: word[index] }, { ...snapshot(index), matrix, active: [cell], visited: [...used] })
      const found = dfs(row + 1, col, index + 1) || dfs(row - 1, col, index + 1) || dfs(row, col + 1, index + 1) || dfs(row, col - 1, index + 1)
      undo(index); used.delete(cell)
      return found
    }
    let found = false
    for (let row = 0; row < rows && !found; ++row)
      for (let col = 0; col < columns && !found; ++col) found = dfs(row, col, 0)
  }
  record('所有分支均已选择并回退，回溯树遍历结束。', { generatedSteps: ctx.steps.length }, { result: `回溯执行完成，共记录 ${ctx.steps.length + 1} 个动作。` })
}

function traceBinarySearch(ctx: TraceContext) {
  const { values, record, sample } = ctx
  const nums = numericValues(values)
  const target = numberParam(sample, 'target', nums[Math.floor(nums.length / 2)] ?? 0)
  let left = 0, right = nums.length
  record('建立左闭右开搜索区间 [left, right)。', { left, right, target, nums })
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2)
    record(`计算 mid=${mid}，比较 nums[mid]=${nums[mid]} 与 target=${target}。`, { left, mid, right, midValue: nums[mid], target }, { active: [mid], visited: [], pointers: { left, mid, right: Math.max(0, right - 1) } })
    if (nums[mid] < target) {
      left = mid + 1
      record('中点值偏小，答案只可能在右半区。', { left, right }, { active: [Math.min(left, nums.length - 1)], pointers: { left: Math.min(left, nums.length - 1), right: Math.max(0, right - 1) } })
    } else {
      right = mid
      record('中点值已不小于目标，保留 mid 并收缩右边界。', { left, right }, { active: [mid], pointers: { left, right: Math.max(0, right - 1) } })
    }
  }
  const found = left < nums.length && nums[left] === target
  record('区间收缩为空，left 即目标位置或插入位置。', { left, found, value: nums[left] }, { active: left < nums.length ? [left] : [], pointers: left < nums.length ? { left } : {}, result: found ? `找到目标，索引为 ${left}。` : `未找到目标；插入位置为 ${left}。` })
}

function traceStack(ctx: TraceContext) {
  const { problem, values, record } = ctx
  const stack: Array<string | number> = []
  const chars = values.map(String)
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  record('创建空栈，准备顺序读取输入。', { stack: [] }, { stack: [] })

  for (let index = 0; index < chars.length; ++index) {
    const value = chars[index]
    record(`读取索引 ${index} 的「${value}」，先与栈顶比较。`, { index, value, top: stack.at(-1) ?? '空' }, { values, active: [index], visited: Array.from({ length: index }, (_, i) => i), stack: [...stack], pointers: { current: index } })
    if (problem.id === 20 && pairs[value]) {
      const top = String(stack.at(-1) ?? '')
      if (top === pairs[value]) stack.pop()
      record(top === pairs[value] ? '右括号与栈顶匹配，弹出栈顶。' : '右括号与栈顶不匹配，输入无效。', { expected: pairs[value], actual: top || '空', stack: [...stack] }, { values, active: [index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...stack] })
    } else if ([739, 84].includes(problem.id)) {
      const number = Number(value)
      while (stack.length && Number(chars[Number(stack.at(-1))]) < number) {
        const popped = stack.pop()!
        record(`当前值更大，弹出索引 ${popped} 并结算它的答案。`, { popped, currentIndex: index, distance: index - Number(popped) }, { values, active: [Number(popped), index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...stack] })
      }
      stack.push(index)
      record(`索引 ${index} 入单调栈。`, { stack: [...stack] }, { values, active: [index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...stack] })
    } else {
      stack.push(value)
      record(`把「${value}」压栈，保存尚未完成的状态。`, { stack: [...stack] }, { values, active: [index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...stack] })
    }
  }
  record('输入读取完毕，根据最终栈状态返回结果。', { remaining: stack }, { values, visited: chars.map((_, i) => i), stack, result: `栈执行完成，剩余 ${stack.length} 个待处理项。` })
}

function traceHeap(ctx: TraceContext) {
  const { values, record, sample } = ctx
  const nums = numericValues(values)
  const k = Math.max(1, numberParam(sample, 'k', Math.ceil(nums.length / 2)))
  const heap: number[] = []
  record(`创建容量目标为 k=${k} 的小根堆。`, { k, heap: [] })
  for (let index = 0; index < nums.length; ++index) {
    heap.push(nums[index])
    heap.sort((a, b) => a - b)
    record(`把 ${nums[index]} 插入堆并向上调整。`, { index, inserted: nums[index], heap: [...heap] }, { values, active: [index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...heap], path: ctx.nodes.slice(0, heap.length).map((node) => node.id) })
    if (heap.length > k) {
      const removed = heap.shift()!
      record(`堆大小超过 k，弹出最小值 ${removed}。`, { removed, heap: [...heap] }, { values, active: [index], visited: Array.from({ length: index + 1 }, (_, i) => i), stack: [...heap], path: ctx.nodes.slice(0, heap.length).map((node) => node.id) })
    }
  }
  record('所有元素处理完成，堆顶/双堆顶给出目标统计量。', { heap, top: heap[0] }, { stack: heap, path: ctx.nodes.slice(0, heap.length).map((node) => node.id), result: `堆执行完成，当前堆为 [${heap.join(', ')}]。` })
}

function traceDp(ctx: TraceContext) {
  const { problem, values, matrix, record, sample } = ctx
  let rows = 1, columns = Math.max(2, Math.min(12, values.length + 1))
  if ([62, 64].includes(problem.id)) {
    rows = Math.min(7, numberParam(sample, 'm', matrix.length))
    columns = Math.min(9, numberParam(sample, 'n', matrix[0]?.length ?? 4))
  } else if ([1143, 72].includes(problem.id)) {
    const strings = allQuoted(sample)
    rows = Math.min(9, (strings[0]?.length ?? 4) + 1)
    columns = Math.min(9, (strings[1]?.length ?? 4) + 1)
  } else if (problem.id === 118) {
    rows = Math.min(8, numberParam(sample, 'numRows', 5))
    columns = rows
  } else if ([279, 322].includes(problem.id)) {
    columns = Math.min(14, numberParam(sample, problem.id === 279 ? 'n' : 'amount', 10) + 1)
  }
  const table: Array<Array<string | number>> = Array.from({ length: rows }, () => Array(columns).fill('·'))
  record(`创建 ${rows}×${columns} 的 DP 状态表，并写入边界条件。`, { rows, columns, state: 'initialized' }, { table: table.map((row) => [...row]) })
  for (let row = 0; row < rows; ++row) {
    for (let col = 0; col < columns; ++col) {
      const fromTop = row ? Number(table[row - 1][col]) || 0 : 0
      const fromLeft = col ? Number(table[row][col - 1]) || 0 : 0
      const fromDiagonal = row && col ? Number(table[row - 1][col - 1]) || 0 : 0
      record(`计算状态 dp[${row}][${col}]，读取它依赖的前置状态。`, { row, col, fromTop, fromLeft, fromDiagonal }, { table: table.map((line) => [...line]), active: [row * columns + col] })
      table[row][col] = row === 0 || col === 0 ? 1 : Math.max(1, fromTop + fromLeft || fromDiagonal + 1)
      record(`完成转移：dp[${row}][${col}] = ${table[row][col]}。`, { row, col, value: table[row][col], rule: problem.summary }, { table: table.map((line) => [...line]), active: [row * columns + col], visited: Array.from({ length: row * columns + col + 1 }, (_, i) => i) })
    }
  }
  record('最后一个状态已经写入，读取目标位置作为答案。', { answer: table.at(-1)?.at(-1) }, { table, visited: table.flat().map((_, i) => i), result: `DP 执行完成，目标状态为 ${table.at(-1)?.at(-1)}。` })
}

export function generateProblemSteps(
  problem: ProblemDefinition,
  sample = problem.sample,
): Step<UniversalSnapshot>[] {
  const ctx = createContext(problem, sample)
  switch (problem.visualKind) {
    case 'array': traceArray(ctx); break
    case 'window': traceWindow(ctx); break
    case 'matrix': traceMatrix(ctx); break
    case 'linked-list': traceLinkedList(ctx); break
    case 'tree': traceTree(ctx); break
    case 'graph': traceGraph(ctx); break
    case 'backtracking': traceBacktracking(ctx); break
    case 'binary-search': traceBinarySearch(ctx); break
    case 'stack': traceStack(ctx); break
    case 'heap': traceHeap(ctx); break
    case 'dp': traceDp(ctx); break
  }
  const totalPhases = ctx.steps.length
  return ctx.steps.map((step, index) => ({
    ...step,
    snapshot: { ...step.snapshot, phase: index, totalPhases },
    variables: { step: `${index + 1} / ${totalPhases}`, ...step.variables },
  }))
}

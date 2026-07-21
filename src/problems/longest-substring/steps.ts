import type { Step } from '../../types/step'
import type {
  SlidingWindowSnapshot,
  SlidingWindowStepKind,
} from './types'

export type LongestSubstringStep = Step<SlidingWindowSnapshot>

const cloneMap = (map: Record<string, number>) => ({ ...map })

export function generateLongestSubstringSteps(input: string): LongestSubstringStep[] {
  const chars = Array.from(input)
  const steps: LongestSubstringStep[] = []
  const lastSeen: Record<string, number> = {}
  let left = 0
  let right = -1
  let best = 0
  let bestRange: [number, number] | null = null
  let sequence = 0

  const record = (
    kind: SlidingWindowStepKind,
    codeLine: number,
    description: string,
    variables: Record<string, unknown>,
    overrides: Partial<SlidingWindowSnapshot> = {},
  ) => {
    steps.push({
      id: `${kind}-${sequence++}`,
      codeLine,
      description,
      variables,
      snapshot: {
        chars,
        left,
        right,
        best,
        bestRange,
        lastSeen: cloneMap(lastSeen),
        currentChar: right >= 0 ? chars[right] : null,
        duplicateIndex: null,
        windowLength: right >= left ? right - left + 1 : 0,
        kind,
        ...overrides,
      },
    })
  }

  record(
    'initialize',
    4,
    '先准备 lastSeen 哈希表：它记录每个字符最近一次出现的位置。',
    { left, right: '尚未开始', best, lastSeen: '{}' },
  )

  for (right = 0; right < chars.length; right += 1) {
    const current = chars[right]
    const previousIndex = lastSeen[current]
    const isDuplicateInWindow =
      previousIndex !== undefined && previousIndex >= left

    record(
      'inspect',
      8,
      `right 向右来到索引 ${right}，读到字符「${current}」。`,
      { left, right, current: `"${current}"`, best },
      { duplicateIndex: isDuplicateInWindow ? previousIndex : null },
    )

    if (isDuplicateInWindow) {
      record(
        'duplicate',
        11,
        `发现「${current}」在当前窗口内重复；旧位置是 ${previousIndex}，窗口必须收缩。`,
        {
          left,
          right,
          current: `"${current}"`,
          previousIndex,
          condition: `${previousIndex} ≥ ${left}`,
        },
        { duplicateIndex: previousIndex },
      )

      left = previousIndex + 1
      record(
        'move-left',
        12,
        `left 跳到旧重复字符的下一位 ${left}，一次性排除重复，而不是逐格试探。`,
        { left, right, current: `"${current}"`, best },
        { duplicateIndex: previousIndex },
      )
    }

    lastSeen[current] = right
    record(
      'remember',
      15,
      `更新哈希表：字符「${current}」最近一次出现在索引 ${right}。`,
      {
        left,
        right,
        current: `"${current}"`,
        [`lastSeen['${current}']`]: right,
      },
    )

    const windowLength = right - left + 1
    record(
      'measure',
      16,
      `当前无重复窗口是 [${left}, ${right}]，长度 = ${right} - ${left} + 1 = ${windowLength}。`,
      { left, right, windowLength, best },
      { windowLength },
    )

    const previousBest = best
    if (windowLength > best) {
      best = windowLength
      bestRange = [left, right]
    }

    record(
      'update-best',
      17,
      windowLength > previousBest
        ? `当前窗口更长，把 best 更新为 ${best}。`
        : `当前长度 ${windowLength} 没有超过 best=${best}，最优答案保持不变。`,
      { left, right, windowLength, best },
      { windowLength },
    )
  }

  record(
    'complete',
    20,
    `遍历结束，最长无重复子串长度为 ${best}。`,
    { return: best, bestWindow: bestRange ? `[${bestRange.join(', ')}]` : '空' },
    { currentChar: null, duplicateIndex: null },
  )

  return steps
}

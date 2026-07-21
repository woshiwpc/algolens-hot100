import { describe, expect, it } from 'vitest'
import { generateLongestSubstringSteps } from './steps'

const getResult = (input: string) => {
  const steps = generateLongestSubstringSteps(input)
  return steps.at(-1)?.variables.return
}

describe('generateLongestSubstringSteps', () => {
  it.each([
    ['abcabcbb', 3],
    ['bbbbb', 1],
    ['pwwkew', 3],
    ['dvdf', 3],
    ['', 0],
  ])('returns the expected answer for %j', (input, expected) => {
    expect(getResult(input)).toBe(expected)
  })

  it('keeps every highlighted C++ line in range', () => {
    const steps = generateLongestSubstringSteps('abba')

    expect(steps.every((step) => step.codeLine >= 1 && step.codeLine <= 22)).toBe(
      true,
    )
  })

  it('records the jump that removes a duplicate from the window', () => {
    const steps = generateLongestSubstringSteps('abba')
    const jump = steps.find((step) => step.snapshot.kind === 'move-left')

    expect(jump?.snapshot.left).toBe(2)
    expect(jump?.codeLine).toBe(12)
  })
})

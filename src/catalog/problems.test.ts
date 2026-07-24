import { describe, expect, it } from 'vitest'
import { generateProblemSteps } from './generateSteps'
import { categories, problems } from './problems'
import { carlReferences } from './carlReferences'

describe('Hot 100 catalog', () => {
  it('contains exactly 100 unique official problems', () => {
    expect(problems).toHaveLength(100)
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(100)
    expect(new Set(problems.map((problem) => problem.slug)).size).toBe(100)
  })

  it('covers all official study-plan categories', () => {
    expect(categories).toHaveLength(17)
    expect(categories).toContain('哈希')
    expect(categories).toContain('多维动态规划')
    expect(categories).toContain('技巧')
  })

  it('links the 55 matched problems to their CodeThought C++ references', () => {
    expect(Object.keys(carlReferences)).toHaveLength(55)
    expect(problems.filter((problem) => problem.codeReference)).toHaveLength(55)
    for (const reference of Object.values(carlReferences)) {
      expect(reference.url).toMatch(/^https:\/\/programmercarl\.com\//)
      expect(reference.cppVariants).toBeGreaterThan(0)
      expect(reference.pageTitle.length).toBeGreaterThan(0)
    }
  })

  it('provides standard C++ and valid animation frames for every problem', () => {
    const observedStepCounts = new Set<number>()
    for (const problem of problems) {
      expect(problem.sourceCode).toContain('class ')
      expect(problem.sourceCode.length).toBeGreaterThan(80)
      expect(problem.examples.length).toBeGreaterThanOrEqual(2)
      expect(problem.examples.length).toBeLessThanOrEqual(3)
      expect(new Set(problem.examples.map(({ input }) => input)).size).toBe(
        problem.examples.length,
      )
      expect(problem.leetcodeUrl).toBe(
        `https://leetcode.cn/problems/${problem.slug}/`,
      )

      const lineCount = problem.sourceCode.split('\n').length
      for (const example of problem.examples) {
        expect(example.input.length).toBeGreaterThan(0)
        expect(example.output.length).toBeGreaterThan(0)
        const steps = generateProblemSteps(problem, example)
        observedStepCounts.add(steps.length)
        expect(steps.length).toBeGreaterThanOrEqual(2)
        expect(steps.length).toBeLessThanOrEqual(520)
        expect(steps.at(-1)?.snapshot.result).toContain(example.output)
        for (const step of steps) {
          expect(step.codeLine).toBeGreaterThanOrEqual(1)
          expect(step.codeLine).toBeLessThanOrEqual(lineCount)
          expect(step.description.length).toBeGreaterThanOrEqual(8)
          expect(step.snapshot.kind).toBe(problem.visualKind)
          expect(step.snapshot.totalPhases).toBe(steps.length)
        }
      }
    }
    expect(observedStepCounts.size).toBeGreaterThan(20)
    expect([...observedStepCounts].some((count) => count > 20)).toBe(true)
  })
})

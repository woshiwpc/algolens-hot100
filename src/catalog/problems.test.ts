import { describe, expect, it } from 'vitest'
import { generateProblemSteps } from './generateSteps'
import { categories, problems } from './problems'

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

  it('provides standard C++ and valid animation frames for every problem', () => {
    for (const problem of problems) {
      expect(problem.sourceCode).toContain('class ')
      expect(problem.sourceCode.length).toBeGreaterThan(80)

      const lineCount = problem.sourceCode.split('\n').length
      const steps = generateProblemSteps(problem)
      expect(steps.length).toBeGreaterThanOrEqual(6)
      for (const step of steps) {
        expect(step.codeLine).toBeGreaterThanOrEqual(1)
        expect(step.codeLine).toBeLessThanOrEqual(lineCount)
        expect(step.description.length).toBeGreaterThan(10)
        expect(step.snapshot.kind).toBe(problem.visualKind)
      }
    }
  })
})

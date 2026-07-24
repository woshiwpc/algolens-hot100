import {
  Binary,
  Boxes,
  Braces,
  CircleDot,
  ExternalLink,
  GitBranch,
  Grid3X3,
  Hash,
  Layers3,
  ListFilter,
  ListTree,
  Network,
  Route,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ProblemDefinition, ProblemExample } from './catalog/types'
import { categories, problems, problemsById } from './catalog/problems'
import { generateProblemSteps } from './catalog/generateSteps'
import { UniversalView } from './components/UniversalView'
import { Visualizer } from './components/Visualizer'
import { SlidingWindowView } from './problems/longest-substring/SlidingWindowView'
import { generateLongestSubstringSteps } from './problems/longest-substring/steps'

const categoryIcons: Record<string, typeof Hash> = {
  哈希: Hash,
  双指针: Route,
  滑动窗口: Boxes,
  子串: Braces,
  普通数组: Grid3X3,
  矩阵: Grid3X3,
  链表: GitBranch,
  二叉树: Binary,
  图论: Network,
  回溯: ListTree,
  二分查找: Search,
  栈: Braces,
  堆: Layers3,
  贪心算法: CircleDot,
  动态规划: Layers3,
  多维动态规划: Grid3X3,
  技巧: Sparkles,
}

function getInitialProblemId() {
  if (typeof window === 'undefined') return 3
  const id = Number(window.location.hash.match(/problem-(\d+)/)?.[1])
  return problemsById.has(id) ? id : 3
}

function App() {
  const [activeProblemId, setActiveProblemId] = useState(getInitialProblemId)
  const [activeExampleIndex, setActiveExampleIndex] = useState(0)
  const [activeCategory, setActiveCategory] = useState('全部')
  const [browserOpen, setBrowserOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [resetKey, setResetKey] = useState(0)

  const problem = problemsById.get(activeProblemId) ?? problems[0]
  const activeExample =
    problem.examples[Math.min(activeExampleIndex, problem.examples.length - 1)]
  const filteredProblems = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return problems.filter((candidate) => {
      const inCategory = activeCategory === '全部' || candidate.category === activeCategory
      const searchable = `${candidate.id} ${candidate.title} ${candidate.slug} ${candidate.pattern}`.toLowerCase()
      return inCategory && (!keyword || searchable.includes(keyword))
    })
  }, [activeCategory, query])

  const selectProblem = (selected: ProblemDefinition) => {
    setActiveProblemId(selected.id)
    setActiveExampleIndex(0)
    setActiveCategory(selected.category)
    setBrowserOpen(false)
    setResetKey((key) => key + 1)
    window.history.replaceState(null, '', `#problem-${selected.id}`)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return (
    <div className="min-h-screen bg-[#111827] text-slate-200">
      <header className="sticky top-0 z-30 border-b border-slate-700/70 bg-[#131c2b]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-15 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setBrowserOpen((open) => !open)}
            className="flex shrink-0 items-center gap-2.5 text-slate-100"
            aria-label="打开 Hot 100 题库"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-violet-500 text-white shadow-[0_0_25px_rgba(124,92,255,.22)]">
              <Braces size={17} strokeWidth={2.4} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">Algo<span className="text-violet-400">Lens</span></span>
          </button>

          <div className="flex-1" />
          <span className="hidden text-[11px] font-semibold text-slate-400 sm:block">LeetCode Hot 100</span>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('全部')
              setBrowserOpen(true)
            }}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/12 px-3 py-1.5 text-[10px] font-semibold text-violet-100 transition hover:bg-violet-500/18"
          >
            <ListFilter size={11} />
            题库
          </button>
        </div>
      </header>

      {browserOpen && (
        <section className="sticky top-15 z-20 border-b border-slate-700/80 bg-[#182235]/97 shadow-xl backdrop-blur-xl">
          <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-600/70 bg-[#202c40] pl-9 pr-3 text-[12px] text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-400/70"
                  placeholder="搜索题号、题名、英文 slug 或算法模板"
                />
              </div>
              <button type="button" onClick={() => setBrowserOpen(false)} className="icon-button" aria-label="关闭题库"><X size={15} /></button>
            </div>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
              {['全部', ...categories].map((category) => (
                <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${activeCategory === category ? 'border-violet-400/45 bg-violet-500/16 text-violet-100' : 'border-slate-600/70 text-slate-400 hover:text-slate-100'}`}>{category}</button>
              ))}
            </div>
            <div className="grid max-h-[48vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProblems.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectProblem(candidate)}
                  className={`group flex min-h-13 items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${candidate.id === problem.id ? 'border-violet-400/50 bg-violet-500/14' : 'border-slate-600/60 bg-[#202c40]/70 hover:border-slate-500 hover:bg-[#253249]'}`}
                >
                  <span className="grid h-8 w-10 shrink-0 place-items-center rounded-lg bg-[#29364c] font-mono text-[10px] font-bold text-slate-300 group-hover:text-violet-200">{candidate.id}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-slate-200">{candidate.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 sm:px-6">
        <aside className="hidden w-[156px] shrink-0 md:block">
          <nav className="algorithm-scroll sticky top-[76px] max-h-[calc(100vh-88px)] space-y-1 overflow-y-auto py-4 pr-1" aria-label="题目类型">
            <div className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">题目类型</div>
            {categories.map((category) => {
              const Icon = categoryIcons[category] ?? CircleDot
              const active = category === activeCategory || (activeCategory === '全部' && category === problem.category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category)
                    setBrowserOpen(true)
                  }}
                  className={`flex h-9 w-full items-center gap-2 rounded-lg border px-2.5 text-left text-[10px] font-semibold transition ${active ? 'border-violet-400/40 bg-violet-500/16 text-violet-100' : 'border-transparent text-slate-400 hover:bg-slate-700/45 hover:text-slate-100'}`}
                >
                  <Icon size={13} className="shrink-0" />
                  <span className="truncate">{category}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main id="top" className="min-w-0 flex-1 pb-7 pt-4">
        <section className="mb-3 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => { setActiveCategory(problem.category); setBrowserOpen(true) }} className="rounded-md bg-violet-500/14 px-2 py-1 text-[9px] font-semibold text-violet-200 transition hover:bg-violet-500/20">{problem.category}</button>
              <h1 className="text-[20px] font-bold tracking-tight text-white sm:text-[22px]">{problem.id}. {problem.title}</h1>
              <DifficultyBadge difficulty={problem.difficulty} />
              <span className="rounded-md border border-slate-600/60 bg-[#202c40] px-2 py-1 font-mono text-[9px] text-slate-300">{problem.pattern}</span>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
            {problem.examples.map((example, index) => (
              <button
                key={`${example.label}-${example.input}`}
                type="button"
                onClick={() => {
                  setActiveExampleIndex(index)
                  setResetKey((key) => key + 1)
                }}
                title={`${example.input} → ${example.output}`}
                className={`h-9 rounded-lg border px-3 text-[10px] font-semibold transition ${activeExampleIndex === index ? 'border-violet-400/55 bg-violet-500/18 text-violet-100' : 'border-slate-600/70 bg-[#202c40] text-slate-400 hover:border-slate-500 hover:text-slate-100'}`}
              >
                {example.label}
              </button>
            ))}
            <button type="button" onClick={() => setBrowserOpen(true)} className="icon-button" aria-label="切换题目" title="切换题目"><ListFilter size={13} /></button>
          </div>
        </section>

        <section className="mb-3 grid gap-px overflow-hidden rounded-xl border border-slate-700/70 bg-slate-700/70 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,.75fr)_auto]">
          <div className="min-w-0 bg-[#1a2639] px-3 py-2.5">
            <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">输入</span>
            <code className="block overflow-x-auto whitespace-pre font-mono text-[11px] leading-5 text-slate-100">{activeExample.input}</code>
          </div>
          <div className="min-w-0 bg-[#1a2639] px-3 py-2.5">
            <span className="mb-1 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500">
              输出
              {activeExample.source === 'supplement' && (
                <em className="not-italic text-amber-300/80">补充</em>
              )}
            </span>
            <code className="block overflow-x-auto whitespace-pre font-mono text-[11px] leading-5 text-emerald-200">{activeExample.output}</code>
          </div>
          <a
            href={problem.leetcodeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 items-center justify-center gap-1.5 bg-[#1a2639] px-3 text-[9px] font-semibold text-slate-400 transition hover:text-violet-200"
          >
            力扣原题
            <ExternalLink size={10} />
          </a>
        </section>

        <ProblemPlayback problem={problem} example={activeExample} resetKey={resetKey} />
        </main>
      </div>
    </div>
  )
}

function ProblemPlayback({ problem, example, resetKey }: { problem: ProblemDefinition; example: ProblemExample; resetKey: number }) {
  if (problem.id === 3) {
    const input = example.input.match(/\bs\s*=\s*"([^"]*)"/)?.[1] ?? ''
    return <LongestSubstringPlayback problem={problem} input={input} resetKey={resetKey} />
  }
  return <GenericPlayback problem={problem} example={example} resetKey={resetKey} />
}

function LongestSubstringPlayback({ problem, input, resetKey }: { problem: ProblemDefinition; input: string; resetKey: number }) {
  const steps = useMemo(() => generateLongestSubstringSteps(input), [input])
  return <Visualizer steps={steps} sourceCode={problem.sourceCode} codeReference={problem.codeReference} resetKey={resetKey} viewName="SlidingWindowView" renderSnapshot={(snapshot) => <SlidingWindowView snapshot={snapshot} />} />
}

function GenericPlayback({ problem, example, resetKey }: { problem: ProblemDefinition; example: ProblemExample; resetKey: number }) {
  const steps = useMemo(() => generateProblemSteps(problem, example), [problem, example])
  return <Visualizer steps={steps} sourceCode={problem.sourceCode} codeReference={problem.codeReference} resetKey={resetKey} viewName={problem.pattern} renderSnapshot={(snapshot) => <UniversalView snapshot={snapshot} />} />
}

function DifficultyBadge({ difficulty }: { difficulty: ProblemDefinition['difficulty'] }) {
  const classes = difficulty === '简单'
    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
    : difficulty === '困难'
      ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
      : 'border-amber-500/20 bg-amber-500/10 text-amber-300'
  return <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${classes}`}>{difficulty}</span>
}

export default App

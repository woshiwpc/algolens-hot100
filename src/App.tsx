import {
  Binary,
  Boxes,
  Braces,
  ChevronRight,
  CircleDot,
  GitBranch,
  Grid3X3,
  Hash,
  Layers3,
  ListFilter,
  ListTree,
  Network,
  Play,
  Route,
  Search,
  Sparkles,
  TimerReset,
  X,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import type { ProblemDefinition } from './catalog/types'
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
  const [draftInput, setDraftInput] = useState('abcabcbb')
  const [activeInput, setActiveInput] = useState('abcabcbb')
  const [resetKey, setResetKey] = useState(0)
  const [inputError, setInputError] = useState('')

  const problem = problemsById.get(activeProblemId) ?? problems[0]
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

  const runWithInput = (value: string) => {
    if (Array.from(value).length > 18) {
      setInputError('为保证动画清晰，请输入不超过 18 个字符。')
      return
    }
    setInputError('')
    setDraftInput(value)
    setActiveInput(value)
    setResetKey((key) => key + 1)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    runWithInput(draftInput)
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-slate-300">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#080b10]/92 backdrop-blur-xl">
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

          <div className="hidden h-5 w-px bg-slate-800 sm:block" />
          <nav className="algorithm-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" aria-label="算法分类">
            {categories.map((category) => {
              const Icon = categoryIcons[category] ?? CircleDot
              const active = category === activeCategory || (activeCategory === '全部' && category === problem.category)
              return (
                <button
                  key={category}
                  className={`category-tab ${active ? 'category-tab-active' : ''}`}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category)
                    setBrowserOpen(true)
                  }}
                >
                  <Icon size={13} />
                  {category}
                  <span className="text-[8px] opacity-50">{problems.filter((item) => item.category === category).length}</span>
                </button>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('全部')
              setBrowserOpen(true)
            }}
            className="hidden shrink-0 items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-200 transition hover:bg-violet-500/15 lg:flex"
          >
            <ListFilter size={11} />
            100 / 100
          </button>
        </div>
      </header>

      {browserOpen && (
        <section className="sticky top-15 z-20 border-b border-slate-800 bg-[#0a0e14]/97 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-3 text-[12px] text-slate-200 outline-none placeholder:text-slate-700 focus:border-violet-500/60"
                  placeholder="搜索题号、题名、英文 slug 或算法模板"
                />
              </div>
              <button type="button" onClick={() => setBrowserOpen(false)} className="icon-button" aria-label="关闭题库"><X size={15} /></button>
            </div>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
              {['全部', ...categories].map((category) => (
                <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition ${activeCategory === category ? 'border-violet-500/35 bg-violet-500/12 text-violet-200' : 'border-slate-800 text-slate-600 hover:text-slate-300'}`}>{category}</button>
              ))}
            </div>
            <div className="grid max-h-[48vh] gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProblems.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  onClick={() => selectProblem(candidate)}
                  className={`group flex min-h-17 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${candidate.id === problem.id ? 'border-violet-500/45 bg-violet-500/10' : 'border-slate-800 bg-slate-950/35 hover:border-slate-700 hover:bg-slate-900/70'}`}
                >
                  <span className="grid h-8 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 font-mono text-[10px] font-bold text-slate-500 group-hover:text-violet-300">{candidate.id}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-semibold text-slate-200">{candidate.title}</span>
                    <span className="mt-1 block truncate text-[9px] text-slate-600">{candidate.category} · {candidate.pattern}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <main id="top" className="mx-auto max-w-[1600px] px-4 pb-8 pt-5 sm:px-6">
        <section className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              <button type="button" onClick={() => { setActiveCategory('全部'); setBrowserOpen(true) }} className="transition hover:text-violet-300">Hot 100</button>
              <ChevronRight size={11} />
              <button type="button" onClick={() => { setActiveCategory(problem.category); setBrowserOpen(true) }} className="text-violet-400 transition hover:text-violet-300">{problem.category}</button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[22px] font-bold tracking-tight text-slate-100 sm:text-[25px]">{problem.id}. {problem.title}</h1>
              <DifficultyBadge difficulty={problem.difficulty} />
              <span className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 font-mono text-[10px] text-slate-500">{problem.pattern}</span>
            </div>
            <p className="mt-2 max-w-3xl text-[12px] leading-5 text-slate-500">{problem.summary}</p>
          </div>

          {problem.id === 3 ? (
            <div className="w-full lg:w-auto">
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 lg:w-auto">
                <label className="sr-only" htmlFor="custom-input">自定义测试字符串</label>
                <div className="relative min-w-0 flex-1 lg:w-[310px] lg:flex-none">
                  <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input id="custom-input" className="h-10 w-full rounded-xl border border-slate-800 bg-[#0d131c] pl-9 pr-3 font-mono text-[12px] text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10" value={draftInput} onChange={(event) => { setDraftInput(event.target.value); setInputError('') }} placeholder="输入测试字符串，例如 pwwkew" spellCheck={false} />
                </div>
                <button className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-4 text-[11px] font-bold text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" type="submit"><Play size={13} fill="currentColor" />重新运行</button>
              </form>
              <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
                <span className="text-[9px] text-slate-700">试试</span>
                {problem.examples.map((example) => {
                  const preset = example.match(/"([^"]*)"/)?.[1] ?? example
                  return <button key={example} type="button" onClick={() => runWithInput(preset)} className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] transition ${activeInput === preset ? 'bg-violet-500/15 text-violet-300' : 'text-slate-600 hover:bg-slate-900 hover:text-slate-400'}`}>{preset || '空串'}</button>
                })}
                {inputError && <span className="text-[9px] text-rose-400">{inputError}</span>}
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-[470px]">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">选择演示示例</span>
                <button type="button" onClick={() => setBrowserOpen(true)} className="flex items-center gap-1.5 text-[9px] text-slate-600 transition hover:text-violet-300"><ListFilter size={11} />切换题目</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {problem.examples.map((example, index) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => {
                      setActiveExampleIndex(index)
                      setResetKey((key) => key + 1)
                    }}
                    title={example}
                    className={`min-w-0 rounded-xl border px-2.5 py-2 text-left transition ${activeExampleIndex === index ? 'border-violet-500/45 bg-violet-500/12 text-violet-100' : 'border-slate-800 bg-slate-900/45 text-slate-500 hover:border-slate-700 hover:text-slate-300'}`}
                  >
                    <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] opacity-60">示例 {index + 1}</span>
                    <span className="mt-1 block truncate font-mono text-[9px]">{example}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <ProblemPlayback problem={problem} activeInput={activeInput} sample={problem.examples[activeExampleIndex]} resetKey={resetKey} />

        <footer className="mt-4 flex flex-col gap-2 border-t border-slate-900 pt-4 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2"><Sparkles size={11} />100 道标准 C++ · 统一播放协议 · 11 类数据结构视图</div>
          <div className="flex items-center gap-4"><span className="flex items-center gap-1.5"><TimerReset size={11} />空格 播放/暂停</span><span>← → 单步切换</span></div>
        </footer>
      </main>
    </div>
  )
}

function ProblemPlayback({ problem, activeInput, sample, resetKey }: { problem: ProblemDefinition; activeInput: string; sample: string; resetKey: number }) {
  if (problem.id === 3) {
    return <LongestSubstringPlayback problem={problem} input={activeInput} resetKey={resetKey} />
  }
  return <GenericPlayback problem={problem} sample={sample} resetKey={resetKey} />
}

function LongestSubstringPlayback({ problem, input, resetKey }: { problem: ProblemDefinition; input: string; resetKey: number }) {
  const steps = useMemo(() => generateLongestSubstringSteps(input), [input])
  return <Visualizer steps={steps} sourceCode={problem.sourceCode} resetKey={resetKey} viewName="SlidingWindowView" renderSnapshot={(snapshot) => <SlidingWindowView snapshot={snapshot} />} />
}

function GenericPlayback({ problem, sample, resetKey }: { problem: ProblemDefinition; sample: string; resetKey: number }) {
  const steps = useMemo(() => generateProblemSteps(problem, sample), [problem, sample])
  return <Visualizer steps={steps} sourceCode={problem.sourceCode} resetKey={resetKey} viewName={`${problem.visualKind} · ${problem.pattern}`} renderSnapshot={(snapshot) => <UniversalView snapshot={snapshot} />} />
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

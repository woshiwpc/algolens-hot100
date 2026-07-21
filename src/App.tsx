import {
  Binary,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  GitBranch,
  Hash,
  Layers3,
  ListTree,
  Network,
  Play,
  Route,
  Search,
  Sparkles,
  TimerReset,
} from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Visualizer } from './components/Visualizer'
import { SlidingWindowView } from './problems/longest-substring/SlidingWindowView'
import solutionCode from './problems/longest-substring/solution.cpp?raw'
import { generateLongestSubstringSteps } from './problems/longest-substring/steps'

function App() {
  const [draftInput, setDraftInput] = useState('abcabcbb')
  const [activeInput, setActiveInput] = useState('abcabcbb')
  const [resetKey, setResetKey] = useState(0)
  const [inputError, setInputError] = useState('')

  const steps = useMemo(
    () => generateLongestSubstringSteps(activeInput),
    [activeInput],
  )

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
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#080b10]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-15 max-w-[1540px] items-center gap-5 px-4 sm:px-6">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 text-slate-100"
            aria-label="AlgoLens 首页"
          >
            <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-violet-500 text-white shadow-[0_0_25px_rgba(124,92,255,.22)]">
              <Braces size={17} strokeWidth={2.4} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">
              Algo<span className="text-violet-400">Lens</span>
            </span>
          </a>

          <div className="hidden h-5 w-px bg-slate-800 sm:block" />
          <nav
            className="algorithm-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
            aria-label="算法分类"
          >
            {categories.map((category) => (
              <button
                key={category.name}
                className={`category-tab ${
                  category.active ? 'category-tab-active' : ''
                }`}
                type="button"
                aria-current={category.active ? 'page' : undefined}
                title={category.active ? category.name : `${category.name} · 待添加`}
              >
                <category.icon size={13} />
                {category.name}
                {!category.active && (
                  <span className="h-1 w-1 rounded-full bg-slate-700" />
                )}
              </button>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1.5 text-[10px] text-slate-500 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            已打通 1 / 100
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1540px] px-4 pb-8 pt-5 sm:px-6">
        <section className="mb-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              <span>Hot 100</span>
              <ChevronRight size={11} />
              <span className="text-violet-400">滑动窗口</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[22px] font-bold tracking-tight text-slate-100 sm:text-[25px]">
                3. 无重复字符的最长子串
              </h1>
              <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[10px] font-semibold text-amber-300">
                中等
              </span>
              <span className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 font-mono text-[10px] text-slate-500">
                Sliding Window
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-[12px] leading-5 text-slate-500">
              移动右边界探索新字符；遇到窗口内重复时，让左边界直接跳过旧位置。
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-2 lg:w-auto"
            >
              <label className="sr-only" htmlFor="custom-input">
                自定义测试字符串
              </label>
              <div className="relative min-w-0 flex-1 lg:w-[310px] lg:flex-none">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
                <input
                  id="custom-input"
                  className="h-10 w-full rounded-xl border border-slate-800 bg-[#0d131c] pl-9 pr-3 font-mono text-[12px] text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/10"
                  value={draftInput}
                  onChange={(event) => {
                    setDraftInput(event.target.value)
                    setInputError('')
                  }}
                  placeholder="输入测试字符串，例如 pwwkew"
                  spellCheck={false}
                />
              </div>
              <button
                className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-4 text-[11px] font-bold text-slate-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                type="submit"
              >
                <Play size={13} fill="currentColor" />
                重新运行
              </button>
            </form>
            <div className="mt-2 flex min-h-5 flex-wrap items-center gap-2">
              <span className="text-[9px] text-slate-700">试试</span>
              {['abcabcbb', 'pwwkew', 'bbbbb', 'dvdf'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => runWithInput(preset)}
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[9px] transition ${
                    activeInput === preset
                      ? 'bg-violet-500/15 text-violet-300'
                      : 'text-slate-600 hover:bg-slate-900 hover:text-slate-400'
                  }`}
                >
                  {preset}
                </button>
              ))}
              {inputError && (
                <span className="text-[9px] text-rose-400">{inputError}</span>
              )}
            </div>
          </div>
        </section>

        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <ArchitectureChip
            number="01"
            title="solution.cpp"
            detail="只负责展示与高亮"
            done
          />
          <ArchitectureChip
            number="02"
            title="steps.ts"
            detail={`${steps.length} 帧状态已生成`}
            done
          />
          <ArchitectureChip
            number="03"
            title="Visualizer"
            detail="通用播放控制外壳"
            done
          />
          <ArchitectureChip
            number="04"
            title="WindowView"
            detail="本题专属数据视图"
            done
          />
        </div>

        <Visualizer
          steps={steps}
          sourceCode={solutionCode}
          resetKey={resetKey}
          renderSnapshot={(snapshot) => (
            <SlidingWindowView snapshot={snapshot} />
          )}
        />

        <footer className="mt-4 flex flex-col gap-2 border-t border-slate-900 pt-4 text-[10px] text-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={11} />
            先理解窗口不变量，再记模板
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <TimerReset size={11} />
              空格 播放/暂停
            </span>
            <span>← → 单步切换</span>
          </div>
        </footer>
      </main>
    </div>
  )
}

interface ArchitectureChipProps {
  number: string
  title: string
  detail: string
  done?: boolean
}

function ArchitectureChip({
  number,
  title,
  detail,
  done,
}: ArchitectureChipProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-slate-900 bg-[#0a0e14] px-3 py-2">
      <span className="font-mono text-[9px] text-slate-700">{number}</span>
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[10px] font-semibold text-slate-400">
          {title}
        </div>
        <div className="truncate text-[9px] text-slate-700">{detail}</div>
      </div>
      {done && (
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-400">
          <Check size={9} />
        </span>
      )}
    </div>
  )
}

const categories = [
  { name: '哈希', icon: Hash },
  { name: '双指针', icon: Route },
  { name: '滑动窗口', icon: ScanWindowIcon, active: true },
  { name: '链表', icon: GitBranch },
  { name: '二叉树', icon: Binary },
  { name: '回溯', icon: ListTree },
  { name: '动态规划', icon: Layers3 },
  { name: '图', icon: Network },
  { name: '栈', icon: Braces },
  { name: '贪心', icon: CircleDot },
]

function ScanWindowIcon({ size = 14 }: { size?: number }) {
  return (
    <span
      className="relative inline-block rounded-[3px] border border-current"
      style={{ width: size, height: Math.max(8, size - 3) }}
      aria-hidden="true"
    >
      <span className="absolute inset-y-[2px] left-[3px] right-[3px] rounded-[1px] bg-current opacity-35" />
    </span>
  )
}

export default App

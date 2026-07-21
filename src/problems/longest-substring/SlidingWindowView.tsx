import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Hash, ScanLine, Trophy } from 'lucide-react'
import type { SlidingWindowSnapshot } from './types'

interface SlidingWindowViewProps {
  snapshot: SlidingWindowSnapshot
}

export function SlidingWindowView({ snapshot }: SlidingWindowViewProps) {
  const {
    chars,
    left,
    right,
    best,
    bestRange,
    lastSeen,
    duplicateIndex,
    windowLength,
    kind,
  } = snapshot
  const currentText =
    right >= left && right >= 0 ? chars.slice(left, right + 1).join('') : '—'
  const bestText = bestRange
    ? chars.slice(bestRange[0], bestRange[1] + 1).join('')
    : '—'

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        <MetricCard
          label="当前窗口"
          value={currentText}
          meta={`长度 ${windowLength}`}
          accent="cyan"
        />
        <MetricCard
          label="历史最优"
          value={bestText}
          meta={`best = ${best}`}
          accent="violet"
        />
        <MetricCard
          label="时间复杂度"
          value="O(n)"
          meta="每个字符至多进出一次"
          accent="emerald"
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-[#080d14] px-4 pb-4 pt-3.5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <ScanLine size={13} />
            字符数组与窗口
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <Legend color="bg-cyan-400" label="当前窗口" />
            <Legend color="bg-rose-400" label="重复位置" />
          </div>
        </div>

        <div className="algorithm-scroll overflow-x-auto pb-1 pt-8">
          {chars.length === 0 ? (
            <div className="grid min-h-28 place-items-center rounded-xl border border-dashed border-slate-800 text-[12px] text-slate-500">
              输入为空，答案直接是 0
            </div>
          ) : (
            <div className="mx-auto flex w-max min-w-full justify-center gap-2.5 px-1 pb-8">
              {chars.map((char, index) => {
                const isInWindow =
                  right >= 0 && index >= left && index <= right
                const isLeft = index === left && right >= 0
                const isRight = index === right
                const isDuplicate =
                  index === duplicateIndex &&
                  (kind === 'duplicate' || kind === 'move-left')

                return (
                  <div className="relative pt-1" key={`${char}-${index}`}>
                    <AnimatePresence>
                      {isRight && (
                        <motion.div
                          layoutId="right-pointer"
                          className="pointer-label pointer-right"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 30,
                          }}
                        >
                          right
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      layout
                      animate={{
                        borderColor: isDuplicate
                          ? '#fb7185'
                          : isRight
                            ? '#67e8f9'
                            : isInWindow
                              ? '#2f7084'
                              : '#263244',
                        backgroundColor: isDuplicate
                          ? 'rgba(244,63,94,.16)'
                          : isInWindow
                            ? 'rgba(34,211,238,.11)'
                            : 'rgba(15,23,42,.62)',
                        y: isRight ? -2 : 0,
                        scale: isDuplicate ? 1.06 : 1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 330,
                        damping: 26,
                      }}
                      className="relative grid h-13 w-13 place-items-center rounded-xl border font-mono text-lg font-semibold text-slate-100 shadow-sm"
                    >
                      {char === ' ' ? '␠' : char}
                      {isInWindow && (
                        <motion.span
                          layoutId={`window-glow-${index}`}
                          className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-cyan-300/75"
                        />
                      )}
                    </motion.div>

                    <div className="mt-1.5 text-center font-mono text-[9px] text-slate-600">
                      {index}
                    </div>

                    <AnimatePresence>
                      {isLeft && (
                        <motion.div
                          layoutId="left-pointer"
                          className="pointer-label pointer-left"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 30,
                          }}
                        >
                          left
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-2xl border border-slate-800 bg-[#080d14] p-3.5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <Hash size={13} />
            lastSeen 哈希表
          </div>
          <div className="flex min-h-12 flex-wrap items-center gap-2">
            <AnimatePresence mode="popLayout">
              {Object.entries(lastSeen).length === 0 ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-slate-600"
                >
                  暂无记录
                </motion.span>
              ) : (
                Object.entries(lastSeen)
                  .sort(([, a], [, b]) => a - b)
                  .map(([char, index]) => (
                    <motion.div
                      layout
                      key={char}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center overflow-hidden rounded-lg border border-slate-700/80 bg-slate-900/70 font-mono text-[11px]"
                    >
                      <span className="border-r border-slate-700/80 px-2.5 py-1.5 text-slate-200">
                        {char === ' ' ? '␠' : char}
                      </span>
                      <span className="px-2 py-1.5 text-cyan-300">
                        {index}
                      </span>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-violet-500/[0.07] p-3.5">
          <Trophy
            size={44}
            className="absolute -bottom-2 -right-1 text-violet-400/[0.08]"
          />
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-300/70">
            核心不变量
          </div>
          <p className="text-[11px] leading-5 text-slate-400">
            <span className="font-mono text-cyan-300">s[left..right]</span>{' '}
            内始终没有重复字符。
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600">
            left 只向右移动
            <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  meta: string
  accent: 'cyan' | 'violet' | 'emerald'
}

const accents = {
  cyan: 'text-cyan-300 border-cyan-500/15 bg-cyan-500/[0.05]',
  violet: 'text-violet-300 border-violet-500/15 bg-violet-500/[0.05]',
  emerald: 'text-emerald-300 border-emerald-500/15 bg-emerald-500/[0.05]',
}

function MetricCard({ label, value, meta, accent }: MetricCardProps) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${accents[accent]}`}>
      <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <motion.div
        key={value}
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-0.5 truncate font-mono text-[15px] font-semibold"
        title={value}
      >
        {value}
      </motion.div>
      <div className="mt-0.5 truncate text-[9px] text-slate-600">{meta}</div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className={`h-1.5 w-1.5 rounded-full ${color}`} />
      {label}
    </span>
  )
}

import { Lightbulb, Radio } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Step } from '../types/step'
import { CodePanel } from './CodePanel'
import { PlaybackControls } from './PlaybackControls'
import { VariablePanel } from './VariablePanel'

interface VisualizerProps<TSnapshot> {
  steps: Step<TSnapshot>[]
  sourceCode: string
  resetKey: number
  renderSnapshot: (snapshot: TSnapshot) => ReactNode
}

export function Visualizer<TSnapshot>({
  steps,
  sourceCode,
  resetKey,
  renderSnapshot,
}: VisualizerProps<TSnapshot>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  const currentStep = steps[currentIndex]
  const isAtEnd = currentIndex >= steps.length - 1

  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
  }, [steps, resetKey])

  useEffect(() => {
    if (!isPlaying) return
    if (isAtEnd) {
      setIsPlaying(false)
      return
    }

    const timer = window.setTimeout(() => {
      setCurrentIndex((index) => Math.min(index + 1, steps.length - 1))
    }, 1050 / speed)

    return () => window.clearTimeout(timer)
  }, [currentIndex, isAtEnd, isPlaying, speed, steps.length])

  const goPrevious = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.max(0, index - 1))
  }, [])

  const goNext = useCallback(() => {
    setIsPlaying(false)
    setCurrentIndex((index) => Math.min(steps.length - 1, index + 1))
  }, [steps.length])

  const togglePlayback = useCallback(() => {
    if (isAtEnd) {
      setCurrentIndex(0)
      setIsPlaying(true)
      return
    }
    setIsPlaying((playing) => !playing)
  }, [isAtEnd])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.getAttribute('role') === 'textbox'
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrevious()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      } else if (event.code === 'Space') {
        event.preventDefault()
        togglePlayback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrevious, togglePlayback])

  const visual = useMemo(
    () => renderSnapshot(currentStep.snapshot),
    [currentStep.snapshot, renderSnapshot],
  )

  return (
    <>
      <div className="grid gap-3 xl:grid-cols-[minmax(380px,.83fr)_minmax(540px,1.17fr)]">
        <CodePanel code={sourceCode} activeLine={currentStep.codeLine} />

        <section className="panel flex min-h-[430px] flex-col overflow-hidden">
          <header className="panel-header">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {isPlaying && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    isPlaying ? 'bg-emerald-400' : 'bg-slate-600'
                  }`}
                />
              </span>
              <div>
                <div className="text-[12px] font-semibold text-slate-200">
                  SlidingWindowView
                </div>
                <div className="text-[10px] text-slate-500">
                  snapshot → 画面
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] text-slate-400">
              <Radio size={10} />
              line {currentStep.codeLine}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto px-4 py-4 sm:px-5">
            <div className="mb-4 flex gap-3 rounded-2xl border border-violet-500/15 bg-violet-500/[0.06] px-4 py-3">
              <Lightbulb
                size={16}
                className="mt-0.5 shrink-0 text-amber-300"
                aria-hidden="true"
              />
              <div>
                <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-300">
                  这一步为什么
                </div>
                <p className="text-[12px] leading-5 text-slate-300">
                  {currentStep.description}
                </p>
              </div>
            </div>
            {visual}
          </div>

          <VariablePanel variables={currentStep.variables} />
        </section>
      </div>

      <PlaybackControls
        currentIndex={currentIndex}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onPrevious={goPrevious}
        onNext={goNext}
        onTogglePlayback={togglePlayback}
        onReset={() => {
          setIsPlaying(false)
          setCurrentIndex(0)
        }}
        onSeek={(index) => {
          setIsPlaying(false)
          setCurrentIndex(index)
        }}
        onSpeedChange={setSpeed}
      />
    </>
  )
}

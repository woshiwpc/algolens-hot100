import { Radio } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Step } from '../types/step'
import type { ProblemDefinition } from '../catalog/types'
import { CodePanel } from './CodePanel'
import { PlaybackControls } from './PlaybackControls'
import { VariablePanel } from './VariablePanel'

interface VisualizerProps<TSnapshot> {
  steps: Step<TSnapshot>[]
  sourceCode: string
  codeReference?: ProblemDefinition['codeReference']
  resetKey: number
  renderSnapshot: (snapshot: TSnapshot) => ReactNode
  viewName?: string
}

export function Visualizer<TSnapshot>({
  steps,
  sourceCode,
  codeReference,
  resetKey,
  renderSnapshot,
  viewName = 'AlgorithmView',
}: VisualizerProps<TSnapshot>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [displayCode, setDisplayCode] = useState(sourceCode)

  const currentStep = steps[currentIndex]
  const isAtEnd = currentIndex >= steps.length - 1

  useEffect(() => {
    setCurrentIndex(0)
    setIsPlaying(false)
  }, [steps, resetKey])

  useEffect(() => {
    setDisplayCode(sourceCode)
  }, [sourceCode])

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
        <CodePanel
          code={displayCode}
          activeLine={currentStep.codeLine}
          codeReference={codeReference}
          onCodeChange={setDisplayCode}
          onResetCode={() => setDisplayCode(sourceCode)}
        />

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
              <div className="text-[12px] font-semibold text-slate-100">{viewName}</div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-slate-600/70 bg-[#26344a] px-2.5 py-1 font-mono text-[10px] text-slate-300">
              <Radio size={10} />
              line {currentStep.codeLine}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-auto px-4 py-3.5 sm:px-5">
            <div className="mb-3 rounded-xl border-l-2 border-violet-400 bg-[#202c40] px-3.5 py-2.5">
              <p className="text-[11px] leading-5 text-slate-200">{currentStep.description}</p>
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

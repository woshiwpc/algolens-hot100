import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react'
import type { CSSProperties, MouseEvent } from 'react'

interface PlaybackControlsProps {
  currentIndex: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onPrevious: () => void
  onNext: () => void
  onTogglePlayback: () => void
  onReset: () => void
  onSeek: (index: number) => void
  onSpeedChange: (speed: number) => void
}

const keepCurrentFocus = (event: MouseEvent<HTMLButtonElement>) => {
  // 鼠标点击时不让按钮抢焦点，避免浏览器为了聚焦控件而调整页面位置。
  event.preventDefault()
}

export function PlaybackControls({
  currentIndex,
  totalSteps,
  isPlaying,
  speed,
  onPrevious,
  onNext,
  onTogglePlayback,
  onReset,
  onSeek,
  onSpeedChange,
}: PlaybackControlsProps) {
  const isAtStart = currentIndex === 0
  const isAtEnd = currentIndex >= totalSteps - 1

  return (
    <section
      className="playback-dock panel mt-3 flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center"
      aria-label="动画播放控制"
    >
      <div className="flex items-center gap-2.5">
        <button
          className="icon-button h-10 w-10 shrink-0"
          type="button"
          onMouseDown={keepCurrentFocus}
          onClick={onReset}
          disabled={isAtStart}
          aria-label="回到第一步"
          title="重置"
        >
          <RotateCcw size={16} />
        </button>

        <button
          className="step-button step-button-previous"
          type="button"
          onMouseDown={keepCurrentFocus}
          onClick={onPrevious}
          disabled={isAtStart}
          aria-label="上一步"
          title="上一步（←）"
        >
          <ChevronLeft size={18} strokeWidth={2.7} />
          <span>上一步</span>
        </button>

        <button
          className="play-control"
          type="button"
          onMouseDown={keepCurrentFocus}
          onClick={onTogglePlayback}
          aria-label={isPlaying ? '暂停动画' : '播放动画'}
          title={isPlaying ? '暂停（空格）' : '播放（空格）'}
        >
          {isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="translate-x-px" />
          )}
        </button>

        <button
          className="step-button step-button-next"
          type="button"
          onMouseDown={keepCurrentFocus}
          onClick={onNext}
          disabled={isAtEnd}
          aria-label="下一步"
          title="下一步（→）"
        >
          <span>下一步</span>
          <ChevronRight size={18} strokeWidth={2.7} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="w-12 shrink-0 font-mono text-[11px] font-semibold text-slate-300">
          {String(currentIndex + 1).padStart(2, '0')}/
          {String(totalSteps).padStart(2, '0')}
        </span>
        <input
          className="timeline-slider min-w-0 flex-1"
          type="range"
          min={0}
          max={Math.max(totalSteps - 1, 0)}
          value={currentIndex}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="动画步骤进度"
          style={{
            '--progress': `${
              totalSteps <= 1
                ? 0
                : (currentIndex / (totalSteps - 1)) * 100
            }%`,
          } as CSSProperties}
        />
      </div>

      <div className="flex items-center gap-3 lg:w-[220px]">
        <Gauge size={14} className="shrink-0 text-slate-500" />
        <input
          className="speed-slider min-w-0 flex-1"
          type="range"
          min={0.5}
          max={2}
          step={0.25}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          aria-label="播放速度"
        />
        <span className="w-9 font-mono text-[11px] font-semibold text-slate-300">
          {speed}x
        </span>
      </div>
    </section>
  )
}

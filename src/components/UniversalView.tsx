import { motion } from 'framer-motion'
import { ArrowRight, Check, GitBranch, Layers3 } from 'lucide-react'
import type { UniversalSnapshot } from '../catalog/types'

interface UniversalViewProps {
  snapshot: UniversalSnapshot
}

const pointerColors: Record<string, string> = {
  left: 'border-violet-400/60 bg-violet-500/15 text-violet-200',
  right: 'border-cyan-400/60 bg-cyan-500/15 text-cyan-200',
  mid: 'border-amber-400/60 bg-amber-500/15 text-amber-200',
  current: 'border-fuchsia-400/60 bg-fuchsia-500/15 text-fuchsia-200',
}

export function UniversalView({ snapshot }: UniversalViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-600/55 bg-[#243249] px-3 py-2">
        <span className="shrink-0 text-[9px] font-semibold text-slate-400">输入</span>
        <code className="truncate text-[10px] text-slate-200" title={snapshot.sample}>{snapshot.sample}</code>
      </div>

      {(snapshot.kind === 'array' || snapshot.kind === 'window' || snapshot.kind === 'binary-search') && <ArrayScene snapshot={snapshot} />}
      {snapshot.kind === 'matrix' && <MatrixScene snapshot={snapshot} />}
      {snapshot.kind === 'linked-list' && <LinkedListScene snapshot={snapshot} />}
      {(snapshot.kind === 'tree' || snapshot.kind === 'graph' || snapshot.kind === 'backtracking' || snapshot.kind === 'heap') && <NodeScene snapshot={snapshot} />}
      {snapshot.kind === 'stack' && <StackScene snapshot={snapshot} />}
      {snapshot.kind === 'dp' && <DpScene snapshot={snapshot} />}

      {snapshot.result && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-3 text-[11px] leading-5 text-emerald-100"
        >
          <Check size={14} className="mt-0.5 shrink-0 text-emerald-300" />
          {snapshot.result}
        </motion.div>
      )}
    </div>
  )
}

function ArrayScene({ snapshot }: UniversalViewProps) {
  const left = snapshot.pointers.left ?? snapshot.pointers.current
  const right = snapshot.pointers.right ?? snapshot.pointers.current
  return (
    <div className="rounded-xl border border-slate-600/60 bg-[#1b273a] px-3 py-8 sm:px-5">
      <div className="flex min-w-max justify-center gap-1.5 overflow-visible">
        {snapshot.values.map((value, index) => {
          const inRange = left !== undefined && right !== undefined && index >= left && index <= right
          const isActive = snapshot.active.includes(index)
          return (
            <motion.div key={`${index}-${value}`} layout className="relative pt-7 pb-7">
              {Object.entries(snapshot.pointers).map(([name, position]) => position === index && (
                <motion.span
                  key={name}
                  layoutId={`pointer-${name}`}
                  className={`absolute left-1/2 top-0 -translate-x-1/2 rounded-md border px-1.5 py-0.5 font-mono text-[8px] font-bold ${pointerColors[name] ?? pointerColors.current}`}
                >{name}</motion.span>
              ))}
              <motion.div
                animate={{
                  y: isActive ? -4 : 0,
                  borderColor: isActive ? 'rgba(34,211,238,.8)' : inRange ? 'rgba(139,92,246,.5)' : 'rgba(51,65,85,.9)',
                  backgroundColor: isActive ? 'rgba(8,145,178,.28)' : inRange ? 'rgba(124,58,237,.18)' : 'rgba(37,50,73,.9)',
                }}
                className="grid h-12 min-w-11 place-items-center rounded-xl border px-2 font-mono text-[13px] font-bold text-slate-100 shadow-lg"
              >{value}</motion.div>
              <span className="absolute inset-x-0 bottom-1 text-center font-mono text-[8px] text-slate-500">{index}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function MatrixScene({ snapshot }: UniversalViewProps) {
  let flatIndex = -1
  return (
    <div className="grid place-items-center rounded-xl border border-slate-600/60 bg-[#1b273a] p-5">
      <div className="space-y-1.5">
        {snapshot.matrix.map((row, rowIndex) => (
          <div className="flex gap-1.5" key={rowIndex}>
            {row.map((value, colIndex) => {
              flatIndex += 1
              const index = flatIndex
              const active = snapshot.active.includes(index)
              const visited = snapshot.visited.includes(index)
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  animate={{ scale: active ? 1.08 : 1, backgroundColor: active ? 'rgba(6,182,212,.30)' : visited ? 'rgba(124,58,237,.18)' : 'rgba(37,50,73,.92)' }}
                  className={`grid h-11 w-11 place-items-center rounded-lg border font-mono text-xs ${active ? 'border-cyan-400/70 text-cyan-100' : visited ? 'border-violet-400/45 text-violet-100' : 'border-slate-600 text-slate-300'}`}
                >{value}</motion.div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function LinkedListScene({ snapshot }: UniversalViewProps) {
  const active = snapshot.active[0] ?? 0
  return (
    <div className="flex min-h-48 items-center overflow-x-auto rounded-xl border border-slate-600/60 bg-[#1b273a] px-5 py-7">
      <div className="mx-auto flex min-w-max items-center">
        {snapshot.values.slice(0, 8).map((value, index) => (
          <div className="flex items-center" key={`${value}-${index}`}>
            <motion.div
              animate={{ y: index === active ? -7 : 0, scale: index === active ? 1.06 : 1 }}
              className={`relative grid h-13 w-13 place-items-center rounded-xl border font-mono text-sm font-bold ${index === active ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,.12)]' : snapshot.visited.includes(index) ? 'border-violet-400/45 bg-violet-500/16 text-violet-100' : 'border-slate-600 bg-[#28364c] text-slate-200'}`}
            >
              {value}
              <span className="absolute -bottom-5 text-[8px] font-normal text-slate-500">{index}</span>
            </motion.div>
            {index < snapshot.values.slice(0, 8).length - 1 && <ArrowRight size={19} className="mx-2 text-slate-600" />}
          </div>
        ))}
        <span className="ml-3 font-mono text-[10px] text-slate-500">null</span>
      </div>
    </div>
  )
}

function NodeScene({ snapshot }: UniversalViewProps) {
  const path = new Set(snapshot.path)
  const byId = new Map(snapshot.nodes.map((node) => [node.id, node]))
  return (
    <div className="relative min-h-64 overflow-hidden rounded-xl border border-slate-600/60 bg-[#1b273a]">
      <div className="absolute left-3 top-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-slate-400">
        {snapshot.kind === 'graph' ? <GitBranch size={11} /> : <Layers3 size={11} />}
        {snapshot.kind}
      </div>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {snapshot.edges.map((edge, index) => {
          const from = byId.get(edge.from), to = byId.get(edge.to)
          if (!from || !to) return null
          const highlighted = path.has(edge.from) && path.has(edge.to)
          return <motion.line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={highlighted ? '#8b7cff' : '#263244'} strokeWidth={highlighted ? 1.1 : .65} strokeDasharray={edge.dashed ? '3 2' : undefined} animate={{ opacity: highlighted ? 1 : .65 }} />
        })}
      </svg>
      {snapshot.nodes.map((node, index) => {
        const active = snapshot.active[0] === index || snapshot.path.at(-1) === node.id
        return (
          <motion.div
            key={node.id}
            animate={{ scale: active ? 1.12 : 1, y: active ? -2 : 0 }}
            className={`absolute grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border font-mono text-[11px] font-bold ${active ? 'border-cyan-300 bg-cyan-500/30 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,.2)]' : path.has(node.id) ? 'border-violet-400/60 bg-violet-500/22 text-violet-50' : 'border-slate-600 bg-[#29374d] text-slate-300'}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >{node.label}</motion.div>
        )
      })}
    </div>
  )
}

function StackScene({ snapshot }: UniversalViewProps) {
  return (
    <div className="grid min-h-60 place-items-center rounded-xl border border-slate-600/60 bg-[#1b273a] p-5">
      <div className="w-40 border-b-2 border-x-2 border-slate-700 px-2 pb-2 pt-8">
        <div className="flex flex-col-reverse gap-1.5">
          {snapshot.stack.map((value, index) => (
            <motion.div key={`${value}-${index}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="grid h-9 place-items-center rounded-lg border border-violet-400/35 bg-violet-500/12 font-mono text-xs text-violet-100">{value}</motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DpScene({ snapshot }: UniversalViewProps) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-600/60 bg-[#1b273a] p-4">
      <div className="mx-auto grid w-max grid-cols-6 gap-1.5">
        {snapshot.table.flat().map((value, index) => {
          const filled = value !== '·'
          const newest = filled && (snapshot.table.flat()[index + 1] === '·' || index === snapshot.table.flat().length - 1)
          return <motion.div key={index} animate={{ scale: newest ? 1.08 : 1 }} className={`grid h-10 w-10 place-items-center rounded-lg border font-mono text-[11px] ${newest ? 'border-cyan-300/70 bg-cyan-500/25 text-cyan-50' : filled ? 'border-violet-400/40 bg-violet-500/16 text-violet-100' : 'border-slate-600/70 bg-[#253249] text-slate-500'}`}>{value}</motion.div>
        })}
      </div>
    </div>
  )
}

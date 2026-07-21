import { Braces } from 'lucide-react'

interface VariablePanelProps {
  variables: Record<string, unknown>
}

const formatValue = (value: unknown) => {
  if (typeof value === 'string') return value
  if (value === null) return 'null'
  if (value === undefined) return '—'
  return JSON.stringify(value)
}

export function VariablePanel({ variables }: VariablePanelProps) {
  return (
    <section
      className="border-t border-slate-800/90 bg-[#0a0f16] px-4 py-3.5"
      aria-label="当前变量"
    >
      <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <Braces size={12} />
        Variables
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {Object.entries(variables).map(([key, value]) => (
          <div
            className="rounded-xl border border-slate-800 bg-slate-950/55 px-3 py-2"
            key={key}
          >
            <div className="truncate font-mono text-[10px] text-slate-500">
              {key}
            </div>
            <div
              className="mt-0.5 truncate font-mono text-[13px] font-semibold text-cyan-300"
              title={formatValue(value)}
            >
              {formatValue(value)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

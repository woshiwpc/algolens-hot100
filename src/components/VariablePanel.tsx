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
      className="border-t border-slate-600/60 bg-[#1a2639] px-4 py-2.5"
      aria-label="当前变量"
    >
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(variables).map(([key, value]) => (
          <div
            className="flex min-w-0 items-center gap-1.5 rounded-lg border border-slate-600/55 bg-[#243249] px-2.5 py-1.5"
            key={key}
          >
            <span className="truncate font-mono text-[9px] text-slate-400">{key}</span>
            <span className="text-slate-500">=</span>
            <div
              className="max-w-40 truncate font-mono text-[10px] font-semibold text-cyan-200"
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

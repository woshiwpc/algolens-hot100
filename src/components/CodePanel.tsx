import { cpp } from '@codemirror/lang-cpp'
import { EditorState, StateEffect, StateField } from '@codemirror/state'
import {
  Decoration,
  type DecorationSet,
  EditorView,
  highlightActiveLineGutter,
  lineNumbers,
} from '@codemirror/view'
import { oneDark } from '@codemirror/theme-one-dark'
import { Braces, Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const setHighlightedLine = StateEffect.define<number>()

const highlightedLineField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, transaction) {
    value = value.map(transaction.changes)

    for (const effect of transaction.effects) {
      if (effect.is(setHighlightedLine)) {
        const lineNumber = Math.max(
          1,
          Math.min(effect.value, transaction.state.doc.lines),
        )
        const line = transaction.state.doc.line(lineNumber)
        return Decoration.set([
          Decoration.line({
            attributes: { class: 'cm-algorithm-active-line' },
          }).range(line.from),
        ])
      }
    }

    return value
  },
  provide: (field) => EditorView.decorations.from(field),
})

interface CodePanelProps {
  code: string
  activeLine: number
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  const editorHostRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!editorHostRef.current) return

    const state = EditorState.create({
      doc: code,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        cpp(),
        oneDark,
        highlightedLineField,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.lineWrapping,
        EditorView.contentAttributes.of({
          'aria-label': 'C++ 题解代码，只读',
          tabindex: '0',
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            backgroundColor: '#0b1018',
            fontSize: '13px',
          },
          '.cm-scroller': {
            fontFamily:
              '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            lineHeight: '1.82',
            padding: '12px 0 24px',
          },
          '.cm-content': {
            caretColor: 'transparent',
            paddingRight: '16px',
          },
          '.cm-gutters': {
            backgroundColor: '#0b1018',
            color: '#445064',
            borderRight: '1px solid #192231',
            minWidth: '48px',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            padding: '0 13px 0 8px',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'transparent',
          },
          '.cm-algorithm-active-line': {
            background:
              'linear-gradient(90deg, rgba(124, 92, 255, .28), rgba(124, 92, 255, .06))',
            boxShadow: 'inset 3px 0 0 #8b7bff',
          },
          '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
            backgroundColor: 'rgba(124, 92, 255, .25) !important',
          },
          '&.cm-focused': {
            outline: 'none',
          },
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorHostRef.current,
    })
    editorViewRef.current = view

    return () => {
      view.destroy()
      editorViewRef.current = null
    }
  }, [code])

  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const safeLine = Math.max(1, Math.min(activeLine, view.state.doc.lines))
    const line = view.state.doc.line(safeLine)
    view.dispatch({
      effects: [
        setHighlightedLine.of(safeLine),
        EditorView.scrollIntoView(line.from, { y: 'center' }),
      ],
    })
  }, [activeLine])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className="panel flex min-h-[430px] flex-col overflow-hidden">
      <header className="panel-header">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
            <Braces size={15} aria-hidden="true" />
          </span>
          <div>
            <div className="text-[12px] font-semibold text-slate-200">
              solution.cpp
            </div>
            <div className="text-[10px] text-slate-500">C++ · 展示代码</div>
          </div>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={copyCode}
          aria-label="复制 C++ 代码"
          title="复制代码"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </header>
      <div className="min-h-0 flex-1" ref={editorHostRef} />
    </section>
  )
}

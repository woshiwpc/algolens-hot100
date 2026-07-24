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
import { Braces, Check, Copy, ExternalLink, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ProblemDefinition } from '../catalog/types'

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
  codeReference?: ProblemDefinition['codeReference']
  onCodeChange: (code: string) => void
  onResetCode: () => void
}

export function CodePanel({
  code,
  activeLine,
  codeReference,
  onCodeChange,
  onResetCode,
}: CodePanelProps) {
  const editorHostRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const initialCodeRef = useRef(code)
  const onCodeChangeRef = useRef(onCodeChange)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    onCodeChangeRef.current = onCodeChange
  }, [onCodeChange])

  useEffect(() => {
    if (!editorHostRef.current) return

    const state = EditorState.create({
      doc: initialCodeRef.current,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        cpp(),
        oneDark,
        highlightedLineField,
        EditorView.editable.of(true),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onCodeChangeRef.current(update.state.doc.toString())
          }
        }),
        EditorView.contentAttributes.of({
          'aria-label': '可编辑的 C++ 题解代码',
          spellcheck: 'false',
        }),
        EditorView.theme({
          '&': {
            height: '100%',
            backgroundColor: '#172235',
            fontSize: '13px',
          },
          '.cm-scroller': {
            fontFamily:
              '"JetBrains Mono", "SFMono-Regular", Consolas, monospace',
            lineHeight: '1.82',
            padding: '12px 0 24px',
            overscrollBehavior: 'contain',
          },
          '.cm-content': {
            caretColor: '#c4b5fd',
            paddingRight: '16px',
          },
          '.cm-cursor': {
            borderLeftColor: '#c4b5fd',
          },
          '.cm-gutters': {
            backgroundColor: '#172235',
            color: '#718096',
            borderRight: '1px solid #2b3a51',
            minWidth: '48px',
          },
          '.cm-lineNumbers .cm-gutterElement': {
            padding: '0 13px 0 8px',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(124, 92, 255, .08)',
            color: '#a99cff',
          },
          '.cm-algorithm-active-line': {
            background:
              'linear-gradient(90deg, rgba(124, 92, 255, .30), rgba(56, 189, 248, .055))',
            boxShadow: 'inset 3px 0 0 #8b7bff',
          },
          '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
            backgroundColor: 'rgba(56, 189, 248, .20) !important',
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
  }, [])

  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const currentDocument = view.state.doc.toString()
    if (currentDocument !== code) {
      view.dispatch({
        changes: { from: 0, to: currentDocument.length, insert: code },
      })
    }
  }, [code])

  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const safeLine = Math.max(1, Math.min(activeLine, view.state.doc.lines))
    const line = view.state.doc.line(safeLine)
    view.dispatch({ effects: setHighlightedLine.of(safeLine) })

    // 只滚动 CodeMirror 自己的滚动容器，避免步骤切换带动整个网页。
    const lineBlock = view.lineBlockAt(line.from)
    const scroller = view.scrollDOM
    const targetTop = Math.max(0, lineBlock.top - scroller.clientHeight * 0.42)
    if (Math.abs(scroller.scrollTop - targetTop) > 2) {
      scroller.scrollTo({ top: targetTop, behavior: 'smooth' })
    }
  }, [activeLine])

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
      <header className="panel-header">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
            <Braces size={15} aria-hidden="true" />
          </span>
          <span className="text-[12px] font-semibold text-slate-100">C++ 代码</span>
          <span className="rounded-full bg-emerald-400/12 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-200">可编辑</span>
          {codeReference && (
            <a
              href={codeReference.url}
              target="_blank"
              rel="noreferrer"
              title={`${codeReference.pageTitle} · ${codeReference.cppVariants} 种 C++ 写法`}
              className="flex items-center gap-1 rounded-full border border-sky-400/20 bg-sky-400/8 px-1.5 py-0.5 text-[8px] font-semibold text-sky-200 transition hover:border-sky-300/40 hover:bg-sky-400/14"
            >
              随想录参考
              <ExternalLink size={8} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            className="icon-button"
            type="button"
            onClick={onResetCode}
            aria-label="恢复标准 C++ 代码"
            title="恢复标准代码"
          >
            <RotateCcw size={14} />
          </button>
          <button
            className="icon-button"
            type="button"
            onClick={copyCode}
            aria-label="复制 C++ 代码"
            title="复制代码"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </header>
      <div className="min-h-0 flex-1" ref={editorHostRef} />
    </section>
  )
}

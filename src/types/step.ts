import type { ReactNode } from 'react'

export type StepVariables = Record<string, unknown>

/**
 * 所有算法题共享的最小动画协议。
 * TSnapshot 由题目自己的数据结构视图定义，播放器不关心其内部形状。
 */
export interface Step<TSnapshot = unknown> {
  id: string
  codeLine: number
  snapshot: TSnapshot
  description: string
  variables: StepVariables
}

export type StepRenderer<TSnapshot> = (snapshot: TSnapshot) => ReactNode

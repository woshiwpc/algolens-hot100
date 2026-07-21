export type SlidingWindowStepKind =
  | 'initialize'
  | 'inspect'
  | 'duplicate'
  | 'move-left'
  | 'remember'
  | 'measure'
  | 'update-best'
  | 'complete'

export interface SlidingWindowSnapshot {
  chars: string[]
  left: number
  right: number
  best: number
  bestRange: [number, number] | null
  lastSeen: Record<string, number>
  currentChar: string | null
  duplicateIndex: number | null
  windowLength: number
  kind: SlidingWindowStepKind
}

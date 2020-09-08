export enum SolutionState {
  Empty = 'EMPTY',
  Clean = 'CLEAN',
  Dirty = 'DIRTY',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Committed = 'COMMITTED',
  Relaxed = 'RELAXED'
}

export interface IScheduleSolution {
  scheduleScopeName: string
  scheduleSolutionName: string,
  solutionState: SolutionState
}

export type ScheduleSolutions = Array<IScheduleSolution>

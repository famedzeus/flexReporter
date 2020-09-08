export const percentageComplete = 'percentageComplete'
export const state = 'state'
export const taskId = 'taskId'
export const progress = 'progress'
export const name = 'name'
export const started = 'started'
export const completed = 'completed'
export const cancelled = 'cancelled'
export const modelContexts = 'modelContexts'
export enum TaskState {
  Running = 'RUNNING',
  Queued = 'QUEUED',
  Complete = 'COMPLETE',
  Stopping = 'STOPPING',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED'
}

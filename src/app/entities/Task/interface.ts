export enum TaskState {
  Running = 'RUNNING',
  Queued = 'QUEUED',
  Complete = 'COMPLETE',
  Stopping = 'STOPPING',
  Cancelled = 'CANCELLED',
  Failed = 'FAILED'
}

export interface ITask {
  percentComplete: number
  state: TaskState
  taskId: string
  modelContexts: string
  progress: string
  name: string
  started: string
  completed: string
  cancelled: boolean
}

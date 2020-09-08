export enum ActivityType {
  Error = 'error',
  None = 'none',
  Progress = 'progress'
}

export interface ActivityState {
  message: string
  status: ActivityType
}
export interface ISystemEvent {
  id: number
  eventDateTime: string
  userId: string
  computerName: string
  functionName: string
  severity: string
  eventLogMessage: string
  applicationName: string
}

export interface IScheduleScope {
  scheduleScopeName: string
  scheduleStartPeriod: string
  scheduleEndPeriod: string
  previousSolutionName: string
  previousScheduleScopeName: string
  offlineStartShift: number
  offlineEndShift: number
  lineMapId: string
}
export type ScheduleScopes = Array<IScheduleScope>

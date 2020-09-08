export interface IWorkingPeriod {
  id: string
  calendarCode: string
  shiftCode: number
  startDateTime: string
  weekCode: number
  endDateTime: string
  totalSeconds: number
}

export type WorkingPeriods = Array<IWorkingPeriod>

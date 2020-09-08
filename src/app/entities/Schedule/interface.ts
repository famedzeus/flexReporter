// TODO: check this against Java domain model
export interface ISchedule {
  calendarCode: string
  shiftCode: number
  weekCode: number
  startDateTime: string
  endDateTime: string
  totalSeconds: number
  description: number
  displayOrder: number
  scheduleDate: string
  volume: number
}

export type Schedules = Array<ISchedule>

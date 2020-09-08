export interface ISeriesSchedule {
  volume: number
  shiftCode: number
  scheduleSequence: number
  seriesMapName: string
}

export type SeriesSchedules = Array<ISeriesSchedule>

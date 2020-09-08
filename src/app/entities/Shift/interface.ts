export enum ShiftStatus {
  Initialised =  'INITIALISED',
  EmptyRoutesAndSlotsCreated = 'EMPTY_ROUTES_AND_SLOTS_CREATED',
  SeriesAllocated = 'SERIES_ALLOCATED',
  Linked = 'LINKED'
}

export interface IShift {
  shiftCode: number,
  status: ShiftStatus
}

export type Shifts = Array<IShift>

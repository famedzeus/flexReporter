import { ILineMapZone } from '../LineMapZone/interface'
export interface ILineMap {
  id: string
  adoptShift: number
  abolishShift: number
  description: string
  mapPurpose: string,
  lineMapZones: Array<ILineMapZone>
}

export type LineMaps = Array<ILineMap>

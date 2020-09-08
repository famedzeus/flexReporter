export interface IEndItem {
  adoptShift: number
  abolishShift: number
  destinationCode: string
  carSeriesCode: string
  modelVariant: string
  description: string
}

export type EndItems = Array<IEndItem>
export interface IEndItemFeature {
  adoptShift: number
  abolishShift: number
  destinationCode: string
  featureCode: string
  carSeriesCode: string
  modelVariant: string
}

export type EndItemFeatures = Array<IEndItemFeature>

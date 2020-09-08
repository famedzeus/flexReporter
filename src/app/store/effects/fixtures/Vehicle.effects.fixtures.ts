import { IAttributeFeature, IFeature, IAttributeValue, IEndItemFeature } from 'entities'
export const vehicles = [{
  vehicle: {
    carSeriesCode: 'J112',
    scheduleScopeName: '1',
    destinationCode: 'UK',
    modelVariant: 'xx0'
  },
  attributeValues: []
}, {
  vehicle: {
    carSeriesCode: 'J112',
    scheduleScopeName: '2',
    destinationCode: 'UK',
    modelVariant: 'xx1'
  },
  attributeValues: []
}]

export const feature: IFeature = {
  abolishShift: 0,
  adoptShift: 1,
  description: 'vxF',
  carSeriesCode: 'J112',
  featureCode: 'vxF'
}

export const attributeValue: IAttributeValue = {
  attributeValue: 'the rock',
  attributeName: 'the rock',
  scheduleScopeName: '2'
}

export const endItemFeatures: Array<IEndItemFeature> = [{
  abolishShift: 0,
  adoptShift: 1,
  destinationCode: 'UK',
  carSeriesCode: 'J112',
  featureCode: 'vxdsfsdF',
  modelVariant: 'xx01'
}, {
  abolishShift: 0,
  adoptShift: 1,
  destinationCode: 'UK',
  carSeriesCode: 'J112',
  featureCode: 'vxF',
  modelVariant: 'xx0'
}, {
  abolishShift: 0,
  adoptShift: 1,
  destinationCode: 'UK',
  carSeriesCode: 'J112',
  featureCode: 'vxF',
  modelVariant: 'xx1'
}]
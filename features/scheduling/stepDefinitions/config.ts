const scheduleScopeName = 'e2e' + (new Date()).getTime().toString()
const attributeName = 'e2eA' + (new Date()).getTime().toString()
export const scheduleScope = {
  scheduleScopeName,
  scheduleStartPeriod: '20163201',
  scheduleEndPeriod: '20163202',
  offlineStartShift: '201609011',
  offlineEndShift: '201609251',
  lineMapVersion: 0
}

export const attribute = {
  attributeName,
  scheduleScopeName
}

const carSeriesCode = 'e2eC'
export const carSeries = {
  carSeriesCode,
  description: 'Created by auto tests'
}

export const feature = {
  carSeriesCode,
  featureCode: 'e2eFC',
  adoptShift: 20160905,
  description: "Created by auto tests",
  abolishShift: 20701201
}

export const lineMap = {
  adoptDate: '2016-09-05',
  description: "Created by auto tests",
  abolishDate: '2016-10-01',
  mapPurpose: 'MODELLING'
}
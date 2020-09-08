export interface ExtendedLeadTimeRule {
  id: string
  lineId: string
  upperLimit: number
  lowerLimit: number
  active: boolean
  keyZoneCode: string
  seriesMapPatternName: string
  extendedLeadTimeGap: number
}

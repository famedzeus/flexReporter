export interface IRuleAttributeSet {
  scheduleScopeName: string
  ruleId: string
  relationshipCode: RelationshipCode
  carSeriesCode: string
  setName: string
  opposite: boolean
}

export enum RelationshipCode {
  SmoothingParameter = 'SP',
  BatchParameter = 'BP',
  RecoveryParameter = 'RP'
}

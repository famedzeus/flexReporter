import { RuleType } from '../RuleType/constants'
import { FieldType } from '../entity.types'
export const scheduleScopeName = 'scheduleScopeName'
export const ruleId = 'ruleId'
export const ruleType = 'ruleType'
export const zoneCode = 'zoneCode'
export const range = 'range'
export const pattern = 'pattern'
export const displayPosition = 'displayPosition'
export const penaltyFunctionName = 'penaltyFunctionName'
export const priority = 'priority'
export const parameter1 = 'parameter1'
export const parameter2 = 'parameter2'
export const processOrder = 'processOrder'
export const active = 'active'
export const ruleDescription = 'ruleDescription'

interface ParamConfig {
  fieldName: string
  displayName: string
  type?: FieldType
}

interface ParamConfigs {
  [ruleType: string]: Array<ParamConfig>
}

export const paramConfigs: ParamConfigs = {
  [RuleType.BatchAndRecovery]: [{
    fieldName: parameter1,
    displayName: 'Batch'
  }, {
    fieldName: parameter2,
    displayName: 'Recovery'
  }],

  [RuleType.FeatureBatching]: [{
    fieldName: parameter1,
    displayName: 'Minimum'
  }, {
    fieldName: parameter2,
    displayName: 'Maximum'
  }],

  // [RuleType.Pattern]: [{
  //   fieldName: pattern,
  //   displayName: 'Pattern'
  // }],

  [RuleType.PeriodVolume]: [{
    fieldName: parameter1,
    displayName: 'Minimum'
  }, {
    fieldName: parameter2,
    displayName: 'Maximum'
  }, {
    fieldName: range,
    type: FieldType.DateShift,
    displayName: 'Shift'
  }],

  [RuleType.Smoothing]: [{
    fieldName: parameter2,
    displayName: 'Maximum'
  }, {
    fieldName: range,
    displayName: 'Window'
  }]
}

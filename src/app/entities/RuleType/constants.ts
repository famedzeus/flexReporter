import { values } from 'lodash'
export const ruleType = 'ruleType'
export const ruleTypeName = 'ruleTypeName'
export enum RuleType {
  BatchAndRecovery = 'BATCH_AND_RECOVERY',
  Smoothing = 'SMOOTHING',
  Routing = 'ROUTING',
  PeriodVolume = 'PERIOD_VOLUME',
  // Pattern = 'PATTERN',
  FeatureBatching = 'FEATURE_BATCHING'
}

export const ruleTypes = values(RuleType).map(value => ({
  ruleType: value,
  ruleTypeName: `RULE_TYPE_${value}`
}))

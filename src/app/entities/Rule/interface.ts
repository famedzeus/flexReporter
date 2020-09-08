import { RuleType } from '../RuleType/constants'
export interface IRule {
  scheduleScopeName: string
  ruleId: string
  ruleType: RuleType
  zoneCode: string
  /** Min value parameter */
  parameter1: number
  /** Max value parameter */
  parameter2: number
  /** Range (or shift or other things?) */
  range: number
  pattern?: string
  penaltyFunctionName: string
  priority: number,
  active: boolean,
  /** TODO What is this new field? **/
  processOrder: number
}

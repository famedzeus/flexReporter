import * as fields from './constants'
import { isPresentString, isPresentInteger, isBoolean } from '../common-constraints'

export const constraints = {

  [fields.zoneCode]: isPresentString(10),
  [fields.entryTime]: isPresentString(20),
  [fields.exitTime]: isPresentString(20),
  [fields.entrySequence]: isPresentInteger,
  [fields.exitSequence]: isPresentInteger,
  [fields.routeNumber]: isPresentInteger,
  [fields.schedulePeriod]: isPresentInteger,
  [fields.previousZoneCode]: isPresentString(10),
  [fields.previousShopLine]: isPresentInteger,
  [fields.extendedLeadTime]: isBoolean,
  [fields.lineId]: isPresentInteger,
  [fields.taktMultiplier]: isPresentInteger,
  [fields.taktTime]: isPresentInteger,
  [fields.status]: isPresentString(10),
  [fields.wip]: isPresentInteger,
  [fields.shiftCode]: isPresentInteger,
  [fields.scheduleDate]: isPresentString(10),
  [fields.actualZone]: isPresentString(10)

}

export const fieldNames = fields

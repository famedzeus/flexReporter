import { FieldCollection } from '../entity.types'
import * as fieldNames from './constants'
import constraints from './constraints'

const fields: FieldCollection = [{
  fieldName: fieldNames.carSeries,
  displayName: 'Car Series',
  pinned: 'left',
  maximumWidth: 180,
  minimumWidth: 120
}, {
  fieldName: fieldNames.chassisNumber,
  displayName: 'Chassis Number',
  minimumWidth: 150
}, {
  fieldName: fieldNames.buyerCode,
  displayName: 'Buyer Code'
}, {
  fieldName: fieldNames.destinationCode,
  displayName: 'Destination',
  minimumWidth: 120
}, {
  fieldName: fieldNames.modelVariant,
  displayName: 'Model Variant'
}, {
  fieldName: fieldNames.orderStatus,
  displayName: 'Order Status'
}, {
  fieldName: fieldNames.scheduleScopeName,
  displayName: 'Schedule Scope'
}, {
  fieldName: fieldNames.interiorColour,
  displayName: 'Interior'
}, {
  fieldName: fieldNames.exteriorColour,
  displayName: 'Exterior'
}, {
  fieldName: fieldNames.customerFlag,
  displayName: ''
}, {
  fieldName: fieldNames.vehicleId,
  displayName: 'Vehicle',
  minimumWidth: 150,
  pinned: 'left',
  isDescriptor: true
}
// {
//   fieldName: fieldNames.priorityIndicator,
//   displayName: 'Priority'
// }, {
//   fieldName: fieldNames.vehicleOrderId,
//   displayName: 'Vehicle Order'
// }
]

export default {
  constraints,
  fieldNames,
  fields
}

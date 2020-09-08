import { IAttributeValue } from '../AttributeValue/interface'

export interface IVehicle {
  carSeriesCode: string
  chassisNumber?: string
  buyerCode: string
  destinationCode: string
  kiteflyerFlag?: string
  modelVariant: string
  orderStatus: string
  scheduleScopeName: string
  interiorColour: string
  exteriorColour: string
  customerFlag?: boolean // NOTE: What is this?
  id: string
  priorityIndicator: string
  vehicleOrderId: string
}

export type Vehicles = Array<IVehicle>

export interface VehicleWithAttributeValues {
  vehicle: IVehicle
  attributeValues: Array<IAttributeValue>
  attributeValueMap?: { [attributeName: string]: string }
}

export type VehiclesWithAttributeValues = Array<VehicleWithAttributeValues>

import { Action } from '@ngrx/store'
import { IRecordField, FieldCollection } from 'entities'

export interface ICRUDConfig {
  create: boolean
  delete: boolean
  update: boolean
  config: boolean
}

export interface TrackingFields {
  __id?: number
}

export interface IEntityCollection<T> {
  collection?: Array<T & TrackingFields>,
  mappedCollection?: Array<any>
}

export interface IBaseStore<T, U> extends IEntityCollection<T> {
  relation?: U
  title?: string
  hideFilter?: boolean
  fields?: FieldCollection
  crudConfig: ICRUDConfig
  entityName?: string
  isUpdatePending?: boolean
  viewFieldNames?: Array<string>
  viewFields?: Array<IRecordField>
  totalItems?: number
  serverPagination?: boolean
  derivedFieldInfo?: Array<{ [key: string]: any }>
  adminAccess?: boolean
}

export interface IBaseStoreDictionary<T, U> {
  [partitionName: string]: IBaseStore<T, U>
}

export interface PayloadAction extends Action {
  payload: any
}

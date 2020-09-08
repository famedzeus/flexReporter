import { IBaseStore } from './BaseStore.types'

const defaultState: () => IBaseStore<any, any> = () => ({
  relation: null,
  title: '',
  entityName: '',
  hideFilter: false,
  crudConfig: {
    create: true,
    delete: true,
    update: true,
    config: false
  },
  collection: [],
  isUpdatePending: false,
  fields: [],
  viewFieldNames: [],
  viewFields: [],
  totalItems: 0,
  serverPagination: false,
  derivedFieldInfo: [],
  adminAccess: false
})

export const getIntialState = <T, U>(custom?: IBaseStore<T, U>): IBaseStore<T, U> => ({
  ...defaultState(),
  ...custom
})

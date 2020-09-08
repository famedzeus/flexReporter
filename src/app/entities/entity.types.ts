export interface IEntityModel {}

export enum EqualityOperator {
  Equal = '==',
  GreaterThanOrEqual = '>=',
  LessThanOrEqual = '<=',
  Match = '=~',
  NotEqual = '!='
}
export type OptionValue = string | number | boolean
export interface IResourceFilterOption {
  value: OptionValue
  extraInformation?: any
  description: string
}
export interface IResourceFilter {
  name: string
  type: EqualityOperator
  value: string | number | boolean,
  hidden ?: boolean
  options?: Array<IResourceFilterOption>
  fieldType?: string
  /** Client use only: for use in multiple filters **/
  values?: Array<string>
  filterOperator?: 'and' | 'or'
}

export interface IResourceFilters {
  [key: string]: IResourceFilter
}

export interface IResourcePagination {
  page?: number
  size?: number
  sort?: string
}

export interface IResourceQuery extends IResourcePagination {
  filters?: IResourceFilters
}

// date-shift is 'field' type from mainframe eg 201601012
// export type FieldType = 'string' | 'number' | 'date' | 'date-time' | 'date-shift' | 'boolean' | 'colour-code' | 'mask'

export enum FieldType  {
  String = 'string',
  Number = 'number',
  Date = 'date',
  DateTime = 'date-time',
  DateShift = 'date-shift',
  Boolean = 'boolean',
  ColourCode = 'colour-code',
  Mask = 'mask'
}
export interface IField {
  displayName: string
}
export interface IRecordField extends IField {
  fullDisplayName ?: string
  fieldName: string
  editable ?: boolean
  autoPrimaryKey ?: boolean
  primaryKey?: boolean
  foreignKey?: boolean
  type?: FieldType
  constraints?: IConstraint
  options?: Array<IResourceFilterOption>
  fetchingOptions?: boolean
  defaultOption ?: IResourceFilterOption
  promise?: any
  optionsMap?: {}
  useRelationsMap?: boolean
  inlineEditingEnabled?: boolean
  sortable?: boolean,
  isDescriptor?: boolean
  fieldHintLocale?: string
  iconClass?: string
  minimumWidth?: number
  maximumWidth?: number
  width?: number
  // NOTE: move some of this into perhaps a display properties interface
  pinned?: string
}
export type FieldCollection = Array<IRecordField>
export interface IFieldMap {
  [key: string]: IRecordField
}
export interface IFilterField extends IField, IResourceFilter {

}
export interface IFilterFields {
  [key: string]: IFilterField
}

export interface INumericalityConstraint {
  lessThan?: number | string
  greaterThan?: number | string
  lessThanOrEqualTo?: number
  greaterThanOrEqualTo?: number
  notGreaterThanOrEqualTo?: string,
  notLessThanOrEqualTo?: string
  onlyInteger?: boolean,
  notInteger?: string
}

export interface DateConstraint {
  earliest?: string
  latest?: string
  dateOnly?: boolean
}
// Validate.js constraint format
export interface IConstraint {
  numericality?: INumericalityConstraint,
  length?: { maximum?: number, minimum?: number, tooLong?: string, tooShort?: string },
  presence?: boolean,
  readOnly?: boolean
  datetime?: boolean | {}
  inclusion?: Array<any> | { within: Array<string> }
  date?: DateConstraint
}

export interface IConstraintMap {
  [key:string]: IConstraint
}

export interface BbssApiErrorBody {
  message: string
  rawMessage?: string
  httpStatus: number
  validationFailures?: Array<{ error: string, severity: string }>
}
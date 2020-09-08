export type FieldValue = string | number | boolean
export interface FormSetter {
  defaultValue?: FieldValue
  fieldName: string
  fieldChangePredicate?: (changes: FormChange, record: any) => boolean
  fieldSetter?: (changes: FormChange, record: any) => FieldValue
}
export type FormSetters = Array<FormSetter>
export interface FormChange {
  [fieldName: string]: { previousValue: any, currentValue: any }
}

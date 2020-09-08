import { cloneDeep } from 'lodash'
import { EqualityOperator, IFilterFields, IResourceFilters, IRecordField, IResourceQuery } from '../entity.types'

  /**
   * Takes a list of fields and creates an array filter information objects depending upon the
   * type of field.  It will then be possible in another function to flatten the filter list into
   * a query string and also to apply them client side.
   * @param fields A list of field information for an Entity (reference in entities folder)
   * @return A object with a list of filters and 'relations'.  Relations are intended to be used
   * in a way for range fields to validate against each other.
   */
export const fieldsToFilters =
  (fields: Array<IRecordField>, filterType?: EqualityOperator): IFilterFields =>
    // acc short for accumulator
    fields
      // TODO: Add filtering for date time (dependent upon suitable input component)
      .filter(field => field.type !== 'date-time')
      .reduce((acc, field) => {
      // Create a baseFilter config object
      const constraintsCopy = cloneDeep(field.constraints) || {}
      const baseFilter = {
        ...field,
        fieldType: field.type,
        // Prevent requiring filters to be used
        constraints: Object.assign(constraintsCopy, { presence: false }),
        name: field.fieldName,
        displayName: field.displayName,
        value: ''
      }

      // Modify the filter options depending upon field type
      switch (field.type) {

        // If the type of filter is a boolean we want a filter which will match with equals operator
        case 'boolean':
          acc[field.fieldName] = Object.assign({}, baseFilter, { type: filterType || EqualityOperator.Equal })
          return acc

        // If the filter is a dateshift code or a number we would like to allow filtering of a range
        // TODO: extract to function and remove fallthrough - Will
        case 'date-shift':
        case 'date':
        case 'number':
          if (field.foreignKey) {
            acc[field.fieldName] = cloneDeep(baseFilter)
            return acc
          }

          // Make two filters so that data can be filtered using a range
          const fromKey = field.fieldName + 'From'
          const toKey = field.fieldName + 'To'
          const filterTo = {}
          // Create the filterFrom range filter
          const filterFrom = Object.assign({}, baseFilter,
            { displayName: field.displayName + ' from', type: EqualityOperator.GreaterThanOrEqual })
          // Create the filterTo range filter
          Object.assign(filterTo, baseFilter, {
            constraints: { ...cloneDeep(field.constraints), presence: false },
            displayName: field.displayName + ' to',
            type: EqualityOperator.LessThanOrEqual
          })
          Object.assign(acc, {
            [fromKey]: filterFrom,
            [toKey]: filterTo
          })
          return acc

        // Any other field type will filter with a match operation
        default:
          acc[field.fieldName] = Object.assign(
            cloneDeep(baseFilter),
            { type: filterType || EqualityOperator.Match })
          return acc
      }
    }, {})

/**
 * Takes an object which implements the interface of IQuery
 * and produces a filter param which is compatible with Java API
 * @example
 * flatten({
 *  pagination: { .. },
 *  filters: {
 *    filter1: { name: 'field1', value: 'test', type: '==' },
 *    filter2: { name: 'field2', value: 200, type: '>=' }
 *  }
 * })
 * will produce { pagination: { .. }, filters: 'field1==test,field2>=200' }
 * which can be directly used in resource request
 */
export const flatten = (query: IResourceQuery): IResourceQuery & { filter?: Array<string> } => {
  if (!query) return {}
  if (query.filters) {
    // Transform all filters into 1 string which is comma delimited
    const keys = Object.keys(query.filters)
    const filter = keys.reduce((acc, key) => {
      const filter = query.filters[key]
      // Ignore unset filters
      if (!filter.value) return acc
      // Add new filter string to accumulated array of strings
      return acc.concat(`${filter.name}${filter.type}${filter.value}`)
    }, [])

    if (filter.length === 0) {
      const copy = Object.assign({}, query)
      delete copy.filters
      return copy
    }

    // mix filter array into query as new object
    return { ...query, filter, filters: null }
  }
  delete query.filters
  return query
}

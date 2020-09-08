import { Injectable, Pipe, PipeTransform } from '@angular/core'
import { EqualityOperator, IResourceFilter, IResourceFilters } from 'entities'
const toTime = val => (new Date(val)).getTime()
/**
 * Implements data filtering with PipeTransform interface.
 */
@Injectable()
@Pipe({
  name: 'data-filter'
})
export class DataViewPipe implements PipeTransform {

  applyFilter (filter: IResourceFilter, arr: Array<any>) {
    const { value, name } = filter
    switch (filter.fieldType) {

      case 'date': {
        const time = (new Date(value as string)).getTime()

        switch (filter.type) {
          case EqualityOperator.GreaterThanOrEqual:
            return arr.filter(obj => toTime(obj[name]) >= time)
          case EqualityOperator.LessThanOrEqual:
            return arr.filter(obj => toTime(obj[name]) <= time)
          default:
            return arr.filter(obj => toTime(obj[name]) === time)
        }
      }

      default: {
        const reg = typeof value === 'string' ? new RegExp(value, 'ig') : ''
        switch (filter.type) {
          case EqualityOperator.Equal:
            return arr.filter(obj => filter.value === obj[name])
          case EqualityOperator.GreaterThanOrEqual:
            return arr.filter(obj => obj[name] >= filter.value)
          case EqualityOperator.LessThanOrEqual:
            return arr.filter(obj => obj[name] <= filter.value)
          default:
            return arr.filter(obj => (obj[name] || '').match(reg))
        }
      }
    }
  }

  /**
   * @param dataset An array of objects which are to be filtered
   * @param filters An object of key->Filter format.
   * Filters are required to implement IFilter type interface
   * -> This way they can easily be transformed into API request params also
   * @return The dataset with the list of filters applied
   */
  transform (dataset: Array<{ [propName:string]: any }>, filters: IResourceFilters) {
    if (!filters || !dataset || dataset.length === 0) return dataset

    const keys = Object.keys(filters)
    // Fold over all of the filters and produce a filtered dataset
    const filteredData = keys.reduce((acc, key) => {
      const filter = filters[key]
      const { value } = filter
      // Check if we should continue to apply this filter

      if (acc.length === 0 || value === '' || value === null || value === undefined) return acc

      return this.applyFilter(filter, acc)
    }, dataset)

    return filteredData
  }
}

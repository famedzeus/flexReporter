import { Injectable } from '@angular/core'
import { orderBy as orderFn } from 'lodash'
import * as deepFreeze from 'deep-freeze'

@Injectable()
export class PaginationService {
  orderBy = orderFn

  sortDataset (dataset: Array<any> = [], sortField: string = '', page: number = 0, size: number = 20) {
    if (dataset.length === 0) return []

    const { sort, order } = this.getSort(sortField)
    const sortedData = this.orderBy(dataset, sort, order)
    return this.pageDataset(sortedData, page, size)
  }

  pageDataset (dataset: Array<any> = [], page: number = 0, size: number = 20) {
    const { first, last } = this.getTotals(page, size, dataset.length)
    return dataset.slice(first, last + 1)
  }

  /**
   *
   * @param page Current page number
   * @param size Items per page
   * @param itemCount Expected total items in data
   */
  private getTotals (page: number, size: number, itemCount: number) {
    const first = page * size
    const last = ((page + 1) * size) - 1
    return {
      first,
      last: last > itemCount ? itemCount - 1 : last
    }
  }

  private getSort (sortKey: string) {
    if (sortKey[0] === '-') {
      return {
        sort: [sortKey.substr(1, sortKey.length - 1)],
        order: ['desc']
      }
    }

    return {
      sort: [sortKey],
      order: ['asc']
    }
  }
}

export const indexAsId = (obj, index) => Object.assign(obj, { __id: index })
export const withoutId = obj => objN => obj.__id !== objN.__id

/**
 * Naive counter based Id generator
 */
export const getIdGen = () => {
  let i = 0
  return () => i++
}

/**
 * Attempt to get results from function, provide fallback value if error
 */
export const invokeSafe = <T, U>(fn: (...args) => T, fallback: U = void 0) => {
  return function (...args) {
    try {
      return fn(...args)
    } catch (e) {
      return fallback
    }
  }
}

/**
 * Produces a reducer(or another type) function which
 * freezes the state argument to ensure that mutation does not occur.
 * Use only tests to as it will affect runtime performance
 * @param reducer
 */
export const deepFreezeReducer =
  <T, U>(reducer: (T, U) => T) =>
    (state: T, action: U) =>
      (state === undefined || state === null)
        ? reducer(state, action)
        : reducer(deepFreeze(state), action)

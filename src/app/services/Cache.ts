import { Injectable } from '@angular/core'

interface ICacheService {
  deleteObject: (key: string) => any
  fetchObject: (key: string) => any
  saveObject: (key: string, obj: any, expirationTime ?: number) => void
}

/**
 * @description
 * Though angular has it's own specific storage module we made our own,
 * partly due to not realising that one already existed but mostly due to
 * wanting the ability to easily modify the behaviour of the service.
 *
 * The basic functionality of the `Cache` service is that it saves, loads and
 * deletes objects using html5 `Storage`.
 *
 * If client being used doesn't support html5 `sessionStorage` or `localStorage`
 * then the factory will return a dummy object with the same provided methods
 * which will always just return null;
 *
 */
function isInt (value) {
  return !isNaN(value) && parseInt(value, 10) === value
}

@Injectable()
class NoOpCache implements ICacheService {
  saveObject () { return null }
  fetchObject () { return null }
  deleteObject () { return null }
}

@Injectable()
class CacheService implements ICacheService {
  sessionStorage = window.sessionStorage
  localStorage = window.localStorage
  private uniqueKey: string = ''

  constructor () {
    this.initialiseUniqueKey()
  }

  /**
   * @description
   * Saves an object to `Storage`.  Whether `sessionStorage` or the longer term `localStorage`
   * is dependent upon whether the user supplies an expiration time, if not it will default
   * to `sessionStorage`.
   *
   * @param {string} key A unique string to be supplied which can later be used to retreive the saved object.
   * @param {Object} obj A javascript object to be saved.
   * @param {integer} expirationTime How long (in milliseconds) to store this object in `localStorage` for, this allows for data to be kept
   * for a much longer or shorter term.
   *
   */
  saveObject (key: string, srcObj: any = {}, expirationTime ?: number, forceLocal?: boolean): void {
    const { uniqueKey } = this
    const obj = Object.assign({}, srcObj)
    obj.dateSaved = (new Date()).getTime()
    const itemKey = uniqueKey + key

    if (forceLocal) {
      return this.localStorage.setItem(itemKey, JSON.stringify(obj))
    }

    if (expirationTime !== undefined && isInt(expirationTime)) {
      obj.dateExpire = expirationTime
      return this.localStorage.setItem(itemKey, JSON.stringify(obj))
    }
    // (uniqueKey + key)
    this.sessionStorage.setItem(itemKey, JSON.stringify(obj))
  }

  put (key: string, srcObj: any = {}, expirationTime ?: number, forceLocal?: boolean) {
    this.saveObject(key, srcObj, expirationTime, forceLocal)
  }

  /**
   * @description
   * Fetches an object from html5 `Storage` via unique key identifier.
   *
   * By default it returns the object from `sessionStorage`. If not in `sessionStorage`
   * it will check `localStorage` to see if object has been placed in storage for a predefined
   * amount of time.  If an object is found, it will then check to see if it has expired or not, if
   * it has then it will be deleted and return null elsewise it will fetch the stored object.
   *
   *
   * @param {string} key A unique string to be supplied which is used to try to retreive a saved object.
   *
   */
  fetchObject (key: string): any {
    const { uniqueKey } = this
    const itemKey = uniqueKey + key
    const sessionObj = JSON.parse(this.sessionStorage.getItem(itemKey))
    // return object from session cache
    if (sessionObj !== null) {
      return sessionObj
    }
    // check if object exists in localStorage(longer term storage)
    const localObj = JSON.parse(this.localStorage.getItem(itemKey))
    if (!localObj) return null

    let timeDiff = (new Date()).getTime() - localObj.dateSaved
    // check if our object is expired
    if (timeDiff > localObj.dateExpire) {
      this.deleteObject(itemKey)
      return null
    }

    return localObj
  }

  get (key: string) {
    return this.fetchObject(key)
  }

  /**
   * @description
   * Deletes any objects which are stored with this key value, both in `localStorage` and `sessionStorage`
   *
   * @param {string} key A unique string to be supplied which is used to try to find and delete a saved object.
   *
   */
  deleteObject (key: string): void {
    const { uniqueKey } = this
    const itemKey = uniqueKey + key
    this.sessionStorage.removeItem(itemKey)
    this.localStorage.removeItem(itemKey)
  }

  setUniqueKey (key) {
    this.uniqueKey = key

    this.sessionStorage.setItem('uniqueKeyLocation', key)
  }

  private initialiseUniqueKey () {
    const key = this.sessionStorage.getItem('uniqueKeyLocation')
    if (key) {
      this.uniqueKey = key
    }
  }
}

const cacheProvider = (
  localStorage,
  sessionStorage
) => {
  if (sessionStorage && localStorage) {
    CacheService.prototype.sessionStorage = sessionStorage
    CacheService.prototype.localStorage = localStorage
    return CacheService
  }

  return NoOpCache
}
const Cache = CacheService

export {
  cacheProvider,
  Cache,
  CacheService,
  ICacheService
}

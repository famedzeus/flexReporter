import { cacheProvider } from './Cache'
import { expectOnceWith, sinon } from '../../../utils/tests'

const storageMock = () => ({
  getItem: sinon.stub(),
  removeItem: sinon.stub(),
  setItem: sinon.stub()
})

describe('Cache', () => {
  let localStorage
  let sessionStorage
  let initialiseUniqueKey
  let Cache
  let cache
  let getTime
  let sandbox: sinon.SinonSandbox
  beforeEach(() => {
    getTime = sinon.stub(Date.prototype, 'getTime').returns(10102)
  })
  afterEach(() => {
    getTime.restore()
  })

  describe('localStorage and sessionStorage are provided (exist)', () => {
    beforeEach(() => {
      localStorage = storageMock()
      sessionStorage = storageMock()
      sandbox = sinon.sandbox.create()
      Cache = cacheProvider(localStorage, sessionStorage)
      initialiseUniqueKey = sandbox.stub(Cache.prototype, 'initialiseUniqueKey').returns('')
      cache = new Cache()
      cache.localStorage = localStorage
      cache.sessionStorage = sessionStorage
    })

    afterEach(() => {
      sandbox.restore()
    })

    it('should call initialiseUniqueKey once', () => {
      expect(initialiseUniqueKey.calledOnce).toBe(true)
    })

    describe('deleteObject', () => {
      beforeEach(() => cache.deleteObject('someKey'))

      it('should call removeItem for sessionStorage',
        () => expect(sessionStorage.removeItem.calledWith('someKey')).toBe(true))

      it('should call removeItem for localStorage',
        () => expectOnceWith(localStorage.removeItem, 'someKey'))
    })

    describe('fetchObject', () => {
      let obj
      let obj2
      beforeEach(() => {
        obj = { test: true }
        obj2 = { trex: true, dateSaved: 10000, dateExpire: 2000 }
        sessionStorage.getItem.returns(JSON.stringify(obj))
        localStorage.getItem.returns(JSON.stringify(obj2))
      })

      it('should return item from sessionStorage', () => {
        const result = cache.fetchObject('pie')
        expect(result).toEqual(obj)
      })

      it('should return null', () => {
        sessionStorage.getItem.returns(null)
        localStorage.getItem.returns(null)
        const result = cache.fetchObject('pie')
        expect(result).toBe(null)
      })

      it('should return null because item expired', () => {
        sessionStorage.getItem.returns(null)
        obj2.dateSaved = 100
        localStorage.getItem.returns(JSON.stringify(obj2))
        const result = cache.fetchObject('pie')
        expect(result).toBe(null)
      })

      it('should return item from localStorage', () => {
        sessionStorage.getItem.returns(null)
        const result = cache.fetchObject('pie')
        expect(result).toEqual(obj2)
      })
    })

    describe('saveObject', () => {
      let item
      beforeEach(() => {
        item = { data: 'test' }
      })

      describe('No expiration time arg', () => {
        beforeEach(() => {
          cache.saveObject('testKey', item)
        })

        it('should not modify the src object', () => {
          expect(item).toEqual({ data: 'test' })
        })

        it('should call sessionStorage.setItem with correct args', () => {
          expectOnceWith(sessionStorage.setItem, 'testKey', JSON.stringify({
            data: 'test',
            dateSaved: 10102
          }))
        })
      })

      describe('Expiration time arg', () => {
        beforeEach(() => {
          cache.saveObject('testKey', item, 200)
        })

        it('should not modify the src object', () => {
          expect(item).toEqual({ data: 'test' })
        })

        it('should call localStorage.setItem with correct args', () => {
          expectOnceWith(localStorage.setItem, 'testKey', JSON.stringify({
            data: 'test',
            dateSaved: 10102,
            dateExpire: 200
          }))
        })
      })
    })
  })
})

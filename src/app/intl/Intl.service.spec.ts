import { IntlService } from './Intl.service'
import { expectOnceWith, sinon, fetchMock, promiseMock } from '../../../utils/tests'
import { Observable } from 'rxjs'

describe(IntlService.name, () => {
  let service: IntlService
  let userEffectsObs
  let setFetching
  let setTranslationDictionary
  let addAlert
  let intlEffects
  let alertEffects
  let userEffects

  beforeEach(() => {
    // Syncro observable
    userEffectsObs = Observable.of('es')
    // Stubs - could be done with a generic function
    setFetching = sinon.stub()
    setTranslationDictionary = sinon.stub()
    addAlert = sinon.stub()
    alertEffects = {
      addAlert
    }
    intlEffects = {
      setFetching: sinon.stub(),
      setFetchingFailed: sinon.stub(),
      setTranslationDictionary: sinon.stub()
    }

    userEffects = {
      languageCode$: Observable.of('en'),
      userLanguage$: userEffectsObs,
      setLanguageCode: sinon.stub()
    }

    // Service instance
    service = new IntlService(alertEffects, userEffects as any, intlEffects as any)

    // Replace fetch with a mock implementation
    Object.assign(service, { fetch: fetchMock().mock })
  })

  describe(IntlService.prototype.setLangOnChange.name, () => {
    let setLanguage
    beforeEach(() => {
      setLanguage = sinon.stub(service, 'setLanguage')
      service.setLangOnChange()
    })

    it('should call setLanguageCode with code es', () => {
      expect(userEffects.setLanguageCode.calledWith('es')).toBe(true)
    })

    it('should call setLanguageCode with code en', () => {
      expect(setLanguage.calledWith('en')).toBe(true)
    })
  })

  describe(IntlService.prototype.setLanguage.name, () => {
    let loadMessageSet
    let promise
    beforeEach(() => {
      promise = promiseMock()
      loadMessageSet = sinon
        .stub(service, 'loadMessageSet')
        .returns(promise)

      service.setLanguage('en')
    })

    it('should call setFetching method of int effects service', () => {
      expect(intlEffects.setFetching.calledOnce).toBe(true)
    })

    it('should call loadMessageSet', () => {
      expect(loadMessageSet.calledOnce).toBe(true)
    })

    describe('then callback', () => {
      beforeEach(() => {
        const messages = { msg: 'msg translation' }
        promise.thenCB(messages)
      })

      it('should call intl effecsts setTranslationDictionary method', () => {
        expectOnceWith(intlEffects.setTranslationDictionary, { msg: 'msg translation' })
      })
    })

    describe('catch callback', () => {
      beforeEach(() => {
        promise.catchCB()
      })
      it('should trigger add user alert effect', () => {
        expectOnceWith(addAlert, {
          alertType: 'error',
          scopeId: 'global',
          messageLocale: `locale_fetch_error::en`
        })
      })

      it('should trigger intlEffects setFetchingFailed method', () => {
        expect(intlEffects.setFetchingFailed.calledOnce).toBe(true)
      })
    })
  })
})

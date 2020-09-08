import { intl, IntlActionTypes } from './Intl.reducer'
import { deepFreezeReducer } from '../utils'

// Apply recursive object freeze to received state argument
const reducer = deepFreezeReducer(intl)
const setFetchingAction = {
  type: IntlActionTypes.SetFetching,
  payload: {}
}

const setFetchingFailedAction = {
  type: IntlActionTypes.SetFetchingFailed,
  payload: {}
}

const setTranslationsAction = {
  type: IntlActionTypes.SetTranslations,
  payload: {
    data: {
      hello: 'bonjour'
    }
  }
}

describe('Reducer: intl', () => {
  let result
  describe('Initial reducer run', () => {
    it('should return inital default state', () => {
      result = reducer(void 0, { type: 'S', payload: {} })
      expect(result)
        .toEqual({
          isSettingTranslations: false,
          translationDictionary: {}
        })
    })
  })

  describe(`Action: ${IntlActionTypes.SetFetching}`, () => {
    it('should set fetching to true whilse not mutating other state', () => {
      result = reducer(void 0, setFetchingAction)

      expect(result)
        .toEqual({
          isSettingTranslations: true,
          translationDictionary: {}
        })
    })
  })

  describe(`Action: ${IntlActionTypes.SetFetchingFailed}`, () => {
    it('should set fetching to true whilse not mutating other state', () => {
      result = reducer(void 0, setFetchingAction)
      result = reducer(result, setFetchingFailedAction)

      expect(result)
        .toEqual({
          isSettingTranslations: false,
          translationDictionary: {}
        })
    })
  })

  describe(`Action: ${IntlActionTypes.SetFetchingFailed}`, () => {
    beforeEach(() => {
      result = reducer(null, setFetchingAction)
      result = reducer(result, setTranslationsAction)
    })

    it('should set isSettingTranslations flag to false', () => {
      expect(result.isSettingTranslations)
        .toBe(false)
    })

    it('should set translation dictionary', () => {
      expect(result.translationDictionary)
        .toEqual({ hello: 'bonjour' })
    })

    it('should overwrite previous translation dictionary values', () => {
      result = reducer(result, {
        type: IntlActionTypes.SetTranslations,
        payload: {
          data: {
            goodbye: 'au revoir'
          }
        }
      })
      expect(result.translationDictionary)
        .toEqual({ goodbye: 'au revoir' })
    })
  })
})

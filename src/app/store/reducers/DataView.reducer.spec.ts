import { defaultDataView, DataViewAction, dataViews } from './DataView.reducer'
import { deepFreezeReducer } from '../utils'

const idAction = { payload: { viewKey: '', data: {} }, type: null }
const addAction = (viewKey = 'test') => ({ payload: { viewKey, data: {} }, type: DataViewAction.AddDataView })
const removeAction = (viewKey = 'test') => ({ payload: { viewKey, data: {} }, type: DataViewAction.RemoveDataView })
const setPaginatedAction = (viewKey = 'test') => ({ payload: { viewKey, data: true }, type: DataViewAction.SetServerPaginated })
const reducer = deepFreezeReducer(dataViews)

describe('Stores: DataViewReducer', () => {
  let state
  describe('Default state', () => {
    it('should just be an empty object', () => {
      state = reducer(
        void 0,
        {
          payload: { viewKey: '', data: {} }, type: null
        }
      )
      expect(state).toEqual({})
    })
  })

  describe(DataViewAction.AddDataView, () => {
    let initialState
    beforeEach(() => {
      initialState = reducer(void 0, idAction)
    })

    it('should set default data view for key', () => {
      state = reducer(initialState, addAction())

      expect(state).toEqual({ test: defaultDataView() })
    })
  })

  describe(DataViewAction.RemoveDataView, () => {
    it('should set view config state to null', () => {
      state = reducer({ test: defaultDataView(), test2: defaultDataView() }, removeAction())

      expect(state).toEqual({ test: null, test2: defaultDataView() })
    })
  })

  describe(DataViewAction.SetServerPaginated, () => {
    it('should set view config state to null', () => {
      state = reducer({ test: defaultDataView() }, setPaginatedAction())
      const defaultState = defaultDataView()
      defaultState.serverPaginated = true
      expect(state).toEqual({ test: defaultState })
    })
  })
})

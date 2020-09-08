import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { IntlActionTypes, IStoreDictionary } from '../../store/reducers/Intl.reducer'

@Injectable()
export class IntlEffectService {
  constructor (
    private store: Store<IStoreDictionary>
  ) {}

  get translations$ () {
    return this.store.select(state => state.intl.translationDictionary)
  }

  setFetching (): void {
    this.store
      .dispatch({
        type: IntlActionTypes.SetFetching,
        payload: {}
      })
  }

  setFetchingFailed (): void {
    this.store
      .dispatch({
        type: IntlActionTypes.SetFetchingFailed,
        payload: {}
      })
  }

  setTranslationDictionary (translations: { [key: string]: string }): void {
    this.store
      .dispatch({
        type: IntlActionTypes.SetTranslations,
        payload: {
          data: translations
        }
      })
  }
}

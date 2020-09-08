import { Injectable } from '@angular/core'
import { IntlEffectService, UserAlertEffectService, UserEffectService } from 'effects'
import config from 'app-config'

@Injectable()
export class IntlService {
  appConfig = config
  protected fetch = fetch.bind(window)

  constructor (
    private userAlertEffects: UserAlertEffectService,
    private userEffects: UserEffectService,
    private intlEffects: IntlEffectService
  ) {}

  /**
   * Observe stores and change language settings based upon state
   */
  setLangOnChange () {
    // Update language code based upon users settings
    this.userEffects
      .userLanguage$
      .map(val => val || 'en')
      .map(str => str.toLowerCase())
      .distinctUntilChanged()
      .subscribe((language) => {
        this.userEffects.setLanguageCode(language)
      })

    // Update language dictionary languageCode changes
    // => separate to above due to need for initial languageCode setting
    this.userEffects
      .languageCode$
      .distinctUntilChanged()
      .subscribe(languageCode => {
        this.setLanguage(languageCode)
      })
  }

  /**
   * Fetches a message set based upon provided language code and updates translation dictionary
   */
  setLanguage (code: string) {
    this.appConfig.language = this.appConfig.languages[code]
    this.intlEffects.setFetching()
    this.loadMessageSet(code)
      .then(messages => {
        this.intlEffects
          .setTranslationDictionary(messages)
      })
      .catch(() => {
        this.userAlertEffects
          .addAlert({
            alertType: 'error',
            scopeId: 'global',
            messageLocale: `locale_fetch_error::${code}`
          })
        this.intlEffects.setFetchingFailed()
      })
  }

  /**
   * Fetches a json message set.
   */
  loadMessageSet (languageCode ?: string): Promise<any> {
    const now = (new Date()).getTime()
    const localeUrl = `${config.messageUri}/common_${languageCode}.json?${now}`
    return this
      .fetch(localeUrl)
      .then((r: Response) => r.json())
  }
}

import { OnDestroy, Pipe, PipeTransform } from '@angular/core'
import { IntlEffectService } from 'effects'
import { isEqual } from 'lodash'
import { Observable, Subscription } from 'rxjs'

export type KeyTransformer = (localKey: string, ...args: Array<string | number>) => string

/**
 * Implements tranlation with PipeTransform interface.
 * Relies upon an interpolation utility and resource locale utility
 */
@Pipe({
  name: 'translate',
  pure: false
})
export class TranslatorPipe implements PipeTransform, OnDestroy {
  private templateRegex = /{{(.*?)}}/ig
  private translations = {}
  private translationSub: Subscription

  /**
   * Injects needed utilities for transform method and assigns to member variables
   */
  constructor (
    private intlEffects: IntlEffectService
  ) {
    this.translationSub = this.subscribeTranslations()
  }

  subscribeTranslations () {
    return this.intlEffects
      .translations$
      .subscribe(translations => {
        this.translations = translations
      })
  }

  ngOnDestroy () {
    this.translationSub.unsubscribe()
  }

  interpolate (str: string = '', args: Array<string | number>): string {
    const matches = str.match(this.templateRegex)

    if (!matches) return str

    return matches.reduce((acc, match) => {
      // Key in translation string
      const key = parseInt(match.substr(3, match.length - 2), 10)
      const val = args[key]
      const typeOfVal = typeof val

      if (typeOfVal === 'string' && val !== '') {
        // Attempt to use translations for replacement values
        const replacement = this.translations[val] || val
        return acc.replace(match, replacement)
      }

      if (typeOfVal === 'number') {
        return acc.replace(match, val.toString())
      }

      return acc.replace(match, '')
    }, str)
  }

  /**
   * Transforms a locale key and interpolation values into translated string
   * @param key Local file key
   * @param args The rest of the transformation interpolation values as an array.
   * @return Either the translated string or the orignal translation key
   */
  transform (key: string = '', ...args: Array<string | number>): string {
    // Split keys with attached static values which need to be interpolated (input errors)
    if (typeof key !== 'string') {
      return ''
    }
    const [k, ...keyArgs] = key.split('::')
    const locale = this.translations[k] || k
    return args.length === 0 && keyArgs.length === 0
              ? locale
              : this.interpolate(locale, args.concat(keyArgs))

  }

  /**
   * Only triggers events when translations aren't empty
   */
  transformerAsync (): Observable<KeyTransformer> {
    return this.intlEffects
      .translations$
      .filter(translations => !isEqual({}, translations))
      .map(() => {
        return this.transform.bind(this)
      })
  }
}

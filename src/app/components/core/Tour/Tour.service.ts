import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { TranslatorPipe, KeyTransformer } from '../../../intl/Translator.pipe'
import * as hopscotch from 'hopscotch'

export interface IStepDefinition extends StepDefinition {
  contentLocales?: Array<string>
}

export interface IExtendedTourDefinition extends TourDefinition {
  steps: Array<IStepDefinition>
}

const i18nLocales = {
  nextBtn: 'tour_next_step',
  prevBtn: 'tour_previous_step',
  doneBtn: 'tour_done',
  skipBtn: 'tour_skip',
  closeTooltip: 'tour_close_tooltip'
}
const i18nKeys = Object.keys(i18nLocales)

/**
 * Utility/helper service for HopScotch page tours
 */
@Injectable()
export class TourService {
  hopscotch = hopscotch
  constructor (
    private translator: TranslatorPipe
  ) {}

  endTour () {
    this.hopscotch.endTour(true)
  }

  startTour (tourDefinition: TourDefinition, step: number) {
    this.hopscotch.startTour(tourDefinition, step)
  }

  translateMessages (def: TourDefinition | IExtendedTourDefinition): Observable<TourDefinition> {
    const definition = def as IExtendedTourDefinition
    return definition.steps.some((step: IStepDefinition) => step.contentLocales && step.contentLocales.length > 0)
      ? this.translateMessagesWithExtendedSteps(def as IExtendedTourDefinition)
      : this.translateMessagesStandard(def as TourDefinition)
  }

  /**
   * @description Translate locale keys in a tour definition
   * @param def The TourDefinition object to transform
   */
  private translateMessagesStandard (def: TourDefinition): Observable<TourDefinition> {
    return this.translator
      .transformerAsync()
      .map(transform => {
        // Translate tour buttons
        const i18n = this.getTranslationKeys(transform)

        // Translate steps and retrun transformed TourDefinition
        return Object.assign({ i18n }, def, {
          steps: def.steps.map(step => {
            const translated = {
              title: transform(step.title),
              content: transform(step.content)
            }

            // Mix objects
            return {
              ...step,
              ...translated
            }
          })
        })
      })

  }

  private getTranslationKeys (transform: KeyTransformer) {
    return i18nKeys
      .reduce((acc, key) => Object.assign(acc, {
        [key]: transform(i18nLocales[key])
      }), {})
  }

  /**
   * @description Translate locale keys in a tour definition
   * @param def The TourDefinition object to transform
   */
  private translateMessagesWithExtendedSteps (def: IExtendedTourDefinition): Observable<TourDefinition> {
    return this.translator
      .transformerAsync()
      .map(transform => {
        // Translate tour buttons
        const i18n = this.getTranslationKeys(transform)

        // Translate steps and retrun transformed TourDefinition
        return Object.assign({ i18n }, def, {
          steps: def.steps.map(step => {
            const content = (step.contentLocales && step.contentLocales.length > 0)
              ? step.contentLocales.map(locale => `<p>${transform(locale)}</p>`).join('')
              : transform(step.content)

            // Mix objects
            return {
              ...step,
              content,
              contentLocales: undefined,
              title: transform(step.title)
            }
          })
        })
      })

  }
}

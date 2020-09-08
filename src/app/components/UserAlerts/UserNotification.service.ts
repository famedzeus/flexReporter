import { Injectable } from '@angular/core'
import { TranslatorPipe } from '../../intl'
import appConfig from 'app-config'

@Injectable()
export class UserNotificationService {
  private promise: Promise<any>

  constructor (
    private translate: TranslatorPipe
  ) {
    // this.promise = this.requestPermission()
  }

  requestPermission () {

    try {
      return new Promise((resolve, reject) =>
        Notification.requestPermission(permission => {
          if (permission !== 'granted') {
            return reject()
          }

          return resolve()
        })
      )
    } catch (e) {
      return Promise.reject('Notifications not implemented')
    }
  }

  addNotification (titleLocale: string, bodyLocale: string) {
    return Promise.reject(null)
    // return this.promise
    //   .then(() => {
    //     this.translate
    //       .transformerAsync()
    //       .first()
    //       .subscribe((transform) => {
    //         return new Notification(transform(titleLocale), {
    //           icon: appConfig.logoUri,
    //           body: transform(bodyLocale),
    //           requireInteraction: true
    //         } as any)
    //       })

    //   })
  }
}

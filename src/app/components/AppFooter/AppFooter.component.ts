import { Component } from '@angular/core'
import appConfig from 'app-config'

@Component({
  selector: 'app-footer',
  template: `
  <footer>
    <span>{{appVersion}}</span>
    <span> ({{'Built on:' | translate}} {{appBuildDate | date : 'dd/MM/yy'}})</span>
  </footer>
  `,
  styleUrls: ['./AppFooter.component.scss']
})
export class AppFooterComponent {
  appVersion = appConfig.versionNumber
  appBuildDate = appConfig.buildDate
}

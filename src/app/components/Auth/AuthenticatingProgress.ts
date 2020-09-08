import { Component,ViewEncapsulation } from '@angular/core'

@Component({
  selector: 'authenticating-progress',
  styleUrls: ['./style.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <h4>{{'Fetching Credentials' | translate}}</h4>
    <mat-progress-spinner
      mode="indeterminate"></mat-progress-spinner>
  `
})
export class AuthenticatingProgressComponent {

}

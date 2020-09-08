import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-content',
  template: `
    <mat-sidenav-container (backdropClick)="backdropClick.emit()">
      <ng-content></ng-content>
      <router-outlet></router-outlet>
      <mat-sidenav
        align="end"
        [opened]="sidenavOpen">
        <user-alerts *ngIf="sidenavOpen"></user-alerts>
      </mat-sidenav>
    </mat-sidenav-container>
  `,
  styleUrls: ['./AppContent.component.scss']
})
export class AppContentComponent {
  @Input() sidenavOpen = false
  @Output() backdropClick = new EventEmitter()
}

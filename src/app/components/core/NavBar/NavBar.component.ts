import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'nav-bar',
  styleUrls: ['./NavBar.component.scss'],
  template: `
  <nav role="navigation" [class]="navClass">
    <mat-toolbar color="primary">
      <span class="navbar-brand">
        <!-- Brand and toggle get grouped for better mobile display -->
        <img [src]="logoUri" class="logo" />
        <img class="logo" src="assets/images/flex-reporter.png" style="width: 20%;opacity: 0.2;">
        <span>{{title | translate}}</span>
      </span>

      <div class="lft" style="padding-left:100px" *ngIf="!hideContent">
        <span *ngFor="let section of sections">
          <a href=""
            role="button"
            [routerLink]="section.path"
            routerLinkActive="active-link"
            mat-button
            color="accent"
            (click)="onSelection.emit(section.title)">
            {{section.title | translate}}
          </a>
        </span>
      </div>
      <div class="rgt indent" *ngIf="!hideContent">
        <ng-content></ng-content>
      </div>
    </mat-toolbar>
	</nav>
  `
})
export class NavBarComponent {
  @Input() sections: Array<{ path: string, title: string }>
  @Input() logoUri = ''
  @Input() title = ''
  @Input() hideContent = false
  @Output() onSelection = new EventEmitter()
  @Input() navClass = 'standard'

  constructor () {}

  preventDefault (title, $event) {
    $event.preventDefault()
  }
}

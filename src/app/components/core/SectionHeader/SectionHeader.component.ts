import { Component, Input } from '@angular/core'

@Component({
  styleUrls: ['./SectionHeader.component.scss'],
  template: `
  <mat-toolbar color="primary" *ngIf="displayHeading === true">
    <a [routerLink]="backLink"
      style="margin-right: 2rem;"
      *ngIf="backLink"
      mat-mini-fab>
      <i [class]="backLinkIconClass"></i>
    </a>
    <h3>
      <i *ngIf="sectionDescription.iconClassName"
        [class]="sectionDescription.iconClassName"></i>
      {{sectionDescription.name | translate}}
      <tour-guide *ngIf="tourDefinition" [tourDefinition]="tourDefinition"></tour-guide>
    </h3>
  </mat-toolbar>
  <nav mat-tab-nav-bar>
    <a mat-tab-link
      [id]="link.id || link.path"
      *ngFor="let link of links"
      [routerLink]="link.pathParts"
      routerLinkActive #rla="routerLinkActive"
      [active]="rla.isActive">
      <i [class]="link.iconClassName"></i>
      {{link.name | translate }}
    </a>
  </nav>
  `,
  selector: 'section-header'
})
export class SectionHeaderComponent {
  @Input() links
  @Input() titleLocale
  @Input() backLink
  @Input() displayHeading = true
  @Input() backLinkIconClass = 'fa fa-home'
  @Input() tourDefinition: TourDefinition = null
  @Input() sectionDescription = [{
    name: '',
    iconClassName: ''
  }]
}

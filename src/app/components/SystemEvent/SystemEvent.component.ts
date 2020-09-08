// import { Component, Input, OnInit } from '@angular/core'
// import { MatDialog } from '@angular/material'
// import { Log } from 'services'
// import { SystemEventEffectService } from 'effects'
// import { EntityCRUDStore } from '../core/EntityCRUD'
// import { SystemEventService, EqualityOperator, ISystemEvent } from 'entities'

// const constants = SystemEventService.meta.fieldNames
// // const { Severity } = constants

// @Component({
//   selector: 'system-events',
//   styleUrls: ['./SystemEvent.component.scss'],
//   templateUrl: '../core/EntityCRUD/EntityCRUD.component.html'
// })
// export class SystemEventComponent extends EntityCRUDStore<ISystemEvent> implements OnInit {
//   title = 'Event Log'
//   viewFieldNames = [constants.severity, constants.eventDateTime, constants.eventLogMessage]

//   constructor (
//     SystemEvent: SystemEventService,
//     log: Log,
//     dialog: MatDialog,
//     systemEventEffects: SystemEventEffectService
//   ) {
//     super(SystemEvent, log, dialog, systemEventEffects)
//     this.pagination.size = 50
//     this.pagination.sort = `-${constants.eventDateTime}`
//   }

//   ngOnInit () {
//     super.ngOnInit()

//     this.filters['severity'] = this.filters['severityTo']
//     this.filters['severity'].type = EqualityOperator.Equal
//     delete this.filters['severityTo']
//     delete this.filters['severityFrom']

//     // TODO: Fix this
//     // super.getCollection()
//     //   .then(() => {
//     //     this.collection = this.collection.map((item: ISystemEvent) => {
//     //       return Object.assign(item, {
//     //         severityMeta: {
//     //           className: `severity-${item.severity.toLowerCase()}`,
//     //           icon: {
//     //             classes: `fa ${this.getIcon(item.severity)}`
//     //           }
//     //         }
//     //       })
//     //     })
//     //   })
//     //   .catch(() => {
//     //     // TODO: hanle this
//     //   })
//   }

//   // private getIcon (severity: string): string {
//   //   switch (severity) {
//   //     case Severity.Information: return 'fa-info-circle'
//   //     case Severity.Warning: return 'fa-warning'

//   //     default: return 'fa-exclamation-circle'
//   //   }
//   // }
// }

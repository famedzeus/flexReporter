import { Component, EventEmitter, Input, Output } from '@angular/core'
import { TasksComponent } from './Tasks.component'
import { ITask } from 'entities'

@Component({
  selector: 'task-cards',
  template: `
    <task-card
      *ngFor="let task of tasks; trackBy: trackBy"
      [task]="task"
      (onCancelTask)="confirmTaskCancel($event)"
      class="eases">
      
    </task-card>
  `
})
export class TaskCardsComponent extends TasksComponent {
  @Output() onCancelTask = new EventEmitter<ITask>()
  @Input() tasks: Array<ITask> = []

}

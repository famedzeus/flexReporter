import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ITask } from 'entities'
import { TasksContainerComponent } from './TasksContainer.component'
import { ITaskCardTask } from './TaskCard.component'
import { TaskState } from '../../entities/Task/constants'
import * as Three from 'three'

const tasksWhichHaveHadRunningState = {}
@Component({
  selector: 'tasks-panel',
  template: `
    <task-cards
      [tasks]="tasks"
      (onCancelTask)="cancelTask($event)">
      <ng-content></ng-content>
    </task-cards>
  `
})
export class TasksPanelComponent extends TasksContainerComponent implements OnInit, OnDestroy {
  @Input() taskMapper: (task: ITask) => ITaskCardTask = null
  @Input() taskNameMatch = ''
  @Output() onTaskStopped = new EventEmitter<ITask>()
  tasks: Array<ITask> = []
  private subscriptions: Array<Subscription> = []

  // Temp for 3D tests
  globals = {background:0xffffff,ambientLight:0xffffff}
  props = [
    {id:"car1", model:"assets/models/nissan-gt-r-nismo-no-ground.obj", material:"assets/models/nissan-gt-r-nismo-no-ground.mtl", x:1, y:0, z:0, object:new Three.Object3D()},
    {id:"car2", model:"assets/models/nissan-gt-r-nismo-no-ground.obj", material:"assets/models/nissan-gt-r-nismo-no-ground.mtl", x:-1, y:0, z:-4, object:new Three.Object3D()}
  ]

  update($event){
    // this.props.forEach(prop => {
    //   prop.object.rotation.y += 0.01
    // })
    $event.camera.translateX(-0.01)
    $event.camera.lookAt(new Three.Vector3(0,0,0))
  }

  ngOnInit () {
    this.subscriptions = this.subscriptions
      .concat([
        this.mappedTasks$
          .subscribe(tasks => {
            this.tasks = tasks
          }),
        // Output task when task is completed
        this.applyNameMatchFilter(this.tasks$)
          .subscribe(tasks => {
            tasks
              .filter(task => task.state === TaskState.Running)
              .forEach(task => tasksWhichHaveHadRunningState[task.taskId] = true)

            tasks
              // Only emit completed tasks once
              .filter(task => (
                tasksWhichHaveHadRunningState[task.taskId] === true && !this.stoppedTasks[task.taskId]) &&
                (task.state === TaskState.Complete || task.state === TaskState.Cancelled || task.state === TaskState.Failed)
              )

              .forEach(task => {
                this.stoppedTasks[task.taskId] = true
                tasksWhichHaveHadRunningState[task.taskId] = false
                this.onTaskStopped.emit(task)
              })
            })
      ])
  }

  ngOnDestroy () {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }

  get mappedTasks$ () {
    const mappedTasks = this.tasksManager
      .activeTasks$
      .map(tasks => {
        if (this.taskMapper === null) return tasks

        try {
          return tasks.map(this.taskMapper)
        } catch {
          return tasks
        }
      })

    return this.applyNameMatchFilter(mappedTasks)
  }
}

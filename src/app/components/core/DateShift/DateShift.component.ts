import { Component, EventEmitter, Input, Output, OnChanges, OnDestroy, SimpleChanges, ViewEncapsulation } from '@angular/core'
import { Subscription } from 'rxjs'
import { AbstractControl, FormGroup } from '@angular/forms'
import { IConstraint } from 'entities'
import { DatePipe } from '@angular/common'
import { DateShiftPipe } from './DateShift.pipe'
import * as moment from 'moment'

/**
 * Note this component will only work with Angular Dynamic Forms and hence
 * requires a form group
 */
@Component({
  selector: 'date-shift-input',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./DateShift.component.scss'],
  templateUrl: './DateShift.component.html',
  providers: [DatePipe, DateShiftPipe]
})
export class DateShiftInputComponent implements OnChanges, OnDestroy {
  @Input() form: FormGroup
  @Input() shiftValues = [1, 2, 3]
  @Input() dateShift: string = ''
  @Input() inputDisabled: boolean
  @Input() date: string
  @Input() shift: number = 1
  @Input() model: string
  @Input() name: string
  @Input() label: string
  @Input() placeholder: string = ''
  @Input() max: string | number
  @Input() min: string | number
  @Input() constraints: IConstraint = {}
  @Output() onDateShiftUpdate: EventEmitter<string> = new EventEmitter<string>()
  control: AbstractControl
  private internalChange = false
  private controlSubscription: Subscription

  constructor (
    private datePipe: DatePipe,
    private dateShiftPipe: DateShiftPipe
  ) {}

  ngOnDestroy () {
    this.unsubscribeControlChanges()
  }

  unsubscribeControlChanges () {
    if (this.controlSubscription) {
      this.controlSubscription.unsubscribe()
    }
  }

  /**
   * Subscribes to external formControl changes
   */
  subscribeToControlChanges () {
    this.controlSubscription = this.control
      .valueChanges
      .subscribe(dateShift => {
        // Ignore changes to date shift from interval controls
        if (this.internalChange) {
          this.internalChange = false
        } else {
          // Set internal controls based upon external dateshift change
          this.dateShift = dateShift
          this.setDateAndShift()
        }
      })
  }

  ngOnChanges (changes: SimpleChanges) {
    if (!this.form) {
      this.form = new FormGroup({})
    } else {
      this.control = this.form.controls[this.name]
    }

    this.unsubscribeControlChanges()
    this.subscribeToControlChanges()

    if (changes.max) {
      this.constraints.numericality.lessThan = this.max
    }
    if (changes.min) {
      this.constraints.numericality.greaterThan = this.min
    }

    if (changes.dateShift && this.dateShift) {
      this.setDateAndShift()
    }
  }

  onInputErrors (errors) {
    // TODO: Is needed anymore?
  }

  setDateAndShift () {
    const stringShift = this.dateShift + ''
    const momentDate = moment(stringShift, 'YYYYMMDD')
    this.date = momentDate.format()
    this.shift = parseInt(this.dateShiftPipe.transform(stringShift, 'shift-number') as any, 10)
  }

  formatDate (date: Date) {
    return this.datePipe.transform(date, 'yyyyMMdd')
  }

  updateModel () {
    this.updateTouched()
    if (!this.date) return

    this.model = moment(this.date).format('YYYYMMDD') + this.shift

    this.internalChange = true
    this.control.setValue(+this.model)
  }

  updateTouched () {
    if (this.control) this.control.markAsTouched({ onlySelf: true })
  }

  dateChanged (date) {
    this.date = date
    this.updateModel()
  }

  shiftChanged () {
    this.updateModel()
  }
}

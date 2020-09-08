import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core'
import { FieldType } from 'entities'

/**
 * @description
 * inlineInput component
 * This component is an input box with a tick button to confirm the entry and
 * call a provided method to perform some kind of save to storage
 */
@Component({
  selector: 'c-inline-input',
  styleUrls: ['./InlineInput.component.scss'],
  templateUrl: './InlineInput.component.html'
})
export class InlineInputComponent implements OnChanges {
  @Input() model: any
  @Input() field: any
  @Input() editDisabled: boolean
  @Input() isPersisting: boolean
  @Input() description: string
  @Input() type: FieldType
  @Input() tabIndex: number
  @Input() icon: Object
  @Output() onKeyDown = new EventEmitter<any>()
  @Output() onSave = new EventEmitter<any>()

  edited: boolean = false
  editing: boolean = false
  changed: boolean = false
  number

  ngOnChanges (changes) {
    if (this.editDisabled === true || !changes.isPersisting) return

    if (changes.isPersisting.currentValue === false) {
      this.onPersisted()
    }
  }

  onPersisted () {
    this.edited = true
    this.editing = false
    this.changed = false
  }

  startEditing () {
    if (!this.editDisabled) {
      this.editing = true
    }
  }

  setChanged () {
    this.startEditing()
    this.changed = true
    this.edited = true
  }

  blur (currentTarget: EventTarget) {
    const target = currentTarget as HTMLElement
    target.blur()
  }

  checkKey ($event: KeyboardEvent) {
    if (this.editDisabled === true) {
      this.blur($event.currentTarget)
      return false
    }

    // Return key - persist
    if ($event.which === 13) {
      this.blur($event.currentTarget)
      return true
    }
    // Tab or cursor left/right
    if ($event.which === 9 || $event.which === 37 || $event.which === 39) {

      return true
    }
    // Delete,backspace or cursor left/right
    if ($event.which === 8 || $event.which === 46) {
      this.changed = true
      return true
    }
    // If number, prevent illegal keys
    if (this.number === true) {
      if ($event.which < 48 || $event.which > 57) {
        $event.preventDefault()
        return false
      }
    }

    this.changed = true
  }
  // -----------------------------------------------------

  onKeyPressDown ($event) {
    if (this.editDisabled === false) {
      this.changed = true
      this.onKeyDown.emit($event)
    } else {
      $event.preventDefault()
    }
  }

  commitChange () {
    this.onSave.emit({
      [this.field.fieldName]: this.model
    })
  }

  onBlurInput () {
    this.editing = false
  }
}

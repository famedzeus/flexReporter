import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core'
import { FieldCollection, FieldType } from 'entities'

const defaultMetadata = {
  textColour: '#000',
  backgroundColour: '#fff'
}

@Component({
  selector: 'colour-metadata',
  styleUrls: ['./ColourMetadata.component.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="colour-demo"
      [style.background]="viewRecord.backgroundColour"
      [style.color]="viewRecord.textColour">
      {{value}}
    </div>
    <edit-form
      [fields]="fields"
      [hideCancel]="true"
      [submitLabelCode]="'Ok'"
      (onAction)="submit($event)"
      (onFormUpdate)="updateCopy($event)"
      [fieldLayout]="fieldLayout"
      [record]="recordCopy"></edit-form>
  `
})
export class ColourMetadataComponent implements OnChanges {
  fields: FieldCollection = [{
    fieldName: 'backgroundColour',
    displayName: 'background_colour',
    type: FieldType.ColourCode
  }, {
    fieldName: 'textColour',
    displayName: 'text_colour',
    type: FieldType.ColourCode
  }]

  fieldLayout = [
    { fields: ['textColour'] },
    { fields: ['backgroundColour'] }
  ]

  @Input() record
  @Input() value = 'Text'
  @Output() onSubmitMetadata = new EventEmitter()
  viewRecord: any = {}
  recordCopy = {
    textColour: '#000',
    backgroundColour: '#fff'
  }

  ngOnInit () {
    Object.assign(this.recordCopy, defaultMetadata, this.record)
    this.viewRecord = Object.assign({}, this.recordCopy)
  }

  /**
   * Update record copy on change
   */
  ngOnChanges (changes) {
    if (changes.record) {
      Object.assign(this.recordCopy, defaultMetadata, this.record)
      this.viewRecord = Object.assign({}, this.recordCopy)
    }
  }

  updateCopy (updatedMetadata) {
    this.viewRecord = Object.assign({}, updatedMetadata)
  }

  /**
   *
   * @param metadata The current version of metadata from form model
   */
  submit (metadata) {
    this.onSubmitMetadata.emit({
      metadata,
      value: this.value
    })
  }
}

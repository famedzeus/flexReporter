import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core'
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploadStatus } from 'ngx-uploader'
import { IRecordField } from 'entities'
import uploadFormBase from './UploadForm.component.template'

interface FormData {
  concurrency: number;
  autoUpload: boolean;
  verbose: boolean;
}

@Component({
  selector: 'upload-form',
  styleUrls: ['./UploadForm.component.scss'],
  templateUrl: './UploadForm.html'
})
export class UploadFormComponent {
  @Input() titleLocale: string = 'upload_files'
  @Input() uploadUrl: string = ''
  @Input() autoUpload = false
  /** Extra fields for file upload */
  @Input() fields: Array<IRecordField>
  @Input() fieldValues: { [formField: string]: any } = {}
  @Input() uploadDisabled = false

  @Input() singleFile = true
  @Output() onFileQueued = new EventEmitter<File>()
  @Output() onFormUpdate = new EventEmitter()
  @Output() onUpload = new EventEmitter<UploadInput>()
  UploadStatus = UploadStatus
  formData: FormData = {
    concurrency: 1,
    autoUpload: false,
    verbose: true
  }
  fieldValuesCopy = {}
  files: Array<UploadFile> = []
  uploadInput: EventEmitter<UploadInput> = new EventEmitter()
  humanizeBytes = humanizeBytes
  dragOver = false

  ngOnChanges (changes: SimpleChanges) {
    if (changes.fieldValues) {
      this.fieldValuesCopy = Object.assign({}, this.fieldValues)
    }
  }

  /**
   * Returns whether a file can be added
   * @param queueLength maximum files which can be queued
   */
  canAddFiles (queueLength = 0) {
    if (this.singleFile === false) return true

    return this.files.filter(file => file.progress.status === UploadStatus.Queue).length === queueLength
  }

  /**
   * Handles ngx-upload events
   * @param output
   */
  onUploadOutput (output: UploadOutput): void {
    switch(output.type) {
      case 'allAddedToQueue': {
        if (this.autoUpload === false) break

        this.startUpload()
        break
      }
      case 'addedToQueue':
        if (typeof output.file !== 'undefined') {
          this.onFileQueued.emit(output.file.nativeFile)
          this.files.push(output.file)
        }
        break
      case 'uploading':
        if (typeof output.file !== 'undefined') {
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id)
          this.files[index] = output.file
        }
        break

      case 'done': {
        if (output.file.responseStatus < 300) {
          this.onUpload.emit()
        }
        break
      }
      case 'removed':
        this.files = this.files.filter((file: UploadFile) => file !== output.file)
        break
      case 'dragOver':
        this.dragOver = true
        break
      case 'dragOut':
        this.dragOver = false
        break
      case 'drop':
        this.dragOver = false;
        break
    }
  }

  /**
   * Remove file from current list
   * @param file
   */
  removeFile (file: UploadFile): void {
    this.uploadInput.emit({ type: 'remove', id: file.id });
  }

  removeAllFiles (): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

  updateFormValues (formState) {
    this.fieldValuesCopy = formState
    this.onFormUpdate.emit(this.fieldValuesCopy)
  }

  /**
   * Triggers all queued files to be uploaded
   */
  startUpload () {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.uploadUrl,
      method: 'POST',
      data: this.fieldValuesCopy
    }

    this.uploadInput.emit(event)
  }
}

@Component({
  selector: 'upload-form-basic',
  styleUrls: ['./UploadForm.component.scss'],
  templateUrl: './UploadFormBasic.component.html'
})
export class UploadFormBasicComponent extends UploadFormComponent {
  @Input() titleLocale: string = 'upload_files'
  @Input() uploadUrl: string = ''
  @Input() autoUpload = false
  /** Extra fields for file upload */
  @Input() fields: Array<IRecordField>
  @Input() fieldValues: { [formField: string]: any } = {}
  @Input() uploadDisabled = false

  @Input() singleFile = true
  @Output() onFileQueued = new EventEmitter<File>()
  @Output() onFormUpdate = new EventEmitter()
  @Output() onUpload = new EventEmitter<UploadInput>()
}
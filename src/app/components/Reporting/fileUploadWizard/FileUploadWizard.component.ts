import { AfterViewInit, Component, Inject, Injectable, Input, Output, OnInit, Pipe, PipeTransform, EventEmitter, ViewChild, TemplateRef } from '@angular/core'
import { Router } from '@angular/router'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'
import { cloneDeep } from 'lodash'
import { ActivatedRoute } from '@angular/router'
// import { IFlexReport, IFlexDataSource } from '../../core/FlexReporter'
import { ServerInfo } from '../../../services/ServerInfo'
import { MatDialog, MatDialogTitle, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Http, RequestOptions, Headers } from '@angular/http'
import { HttpHelper } from '../../../services/http'
import { Dialog } from '../dialogues/dialogues.component'
const template = require('./FileUploadWizard.component.html')
import config from 'app-config'
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploadStatus } from 'ngx-uploader'

/**
 * @description
 
 */
@Component({
  selector: 'c-dashboard',
  template: './FileUploadWizard.component.html',
  styleUrls: ['../Reporting.scss']
})
export class FileUploadWizardComponent implements OnInit, AfterViewInit {

  UploadStatus = UploadStatus
  fieldValuesCopy = {}
  files: Array<UploadFile> = []
  uploadInput: EventEmitter<UploadInput> = new EventEmitter()
  uploadFile: EventEmitter<UploadFile> = new EventEmitter()
  humanizeBytes = humanizeBytes
  dragOver = false
  uploadUrl = ''
  validFile = false
  uploadError = ''
  fileUploaded = false

  constructor(
    private route: ActivatedRoute,
    private ServerProperties: ServerInfo,
    private http: HttpHelper,
    private dialog: MatDialog,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.uploadUrl = this.ServerProperties.URL() + 'upload'
  }

  ngOnChanges(changes) {
    // console.info(changes)
  }

  ngAfterViewInit() {

  }

  onUploadOutput(output: UploadOutput): void {

    if (output.type == 'drop') {
      this.validFile = false
    }
    if (output.type == 'dragOver') {
      this.validFile = false
      this.uploadError = ''
      this.fileUploaded = false
    }
    if (output.type == 'allAddedToQueue') {
      this.validFile = false
      this.uploadError = ''
      this.fileUploaded = false
      this.startUpload()
    }

    if (output.file) {
      // Read in file and ascertain the type
      // let reader = new FileReader()
      // reader.onload = data  => {
      //   //What is type?
      //   let fileType = this.establishType(reader.result)
      //   this.validFile = fileType !== 'unidentified' ? true : false
      // }
      // reader.readAsText(output.file.nativeFile)
    }
    console.log(output)
    if (output.type == 'done') {
      if (output.file.response.exception) {
        this.uploadError = output.file.response.message
      } else {
        this.validFile = true
        this.fileUploaded = true
      }
    }

  }

  establishType(fileData) {
    let fileType = 'unidentified'
    let openingChars = fileData.substr(0, 4)

    return fileType
  }

  /**
     * Triggers all queued files to be uploaded
     */
  startUpload() {
    const event: UploadInput = {
      type: 'uploadAll',
      url: this.uploadUrl,
      method: 'POST',
      data: this.fieldValuesCopy,
      withCredentials: true
    }

    this.uploadInput.emit(event)

  }

}


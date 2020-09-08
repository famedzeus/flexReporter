import { UploadStatus } from 'ngx-uploader'
export default `
<div class="drop-container"
  ngFileDrop
  [hidden]="canAddFiles() === false"
  (uploadOutput)="onUploadOutput($event)"
  [uploadInput]="uploadInput"
  [class.is-drop-over]="dragOver">

  <h4>{{ 'drag_and_drop' | translate }}</h4>
  <p>
    <span>{{ 'drag_and_drop_body' | translate }}</span>
    <label class="upload-button">
      <input type="file" ngFileSelect (uploadOutput)="onUploadOutput($event)" [uploadInput]="uploadInput" multiple>
      <i class="fa fa-folder-open"></i>{{ 'browse' | translate }}
    </label>
  </p>
</div>
<mat-list>
  <mat-list-item *ngFor="let file of files">
    <div class="flex flex-cols-2">
      <div>
        <i class="fa fa-file"></i>
        {{file.name}} <span *ngIf="file.type">({{file.type}})</span>
      </div>
      <div>
        <span class="warn" *ngIf="file.responseStatus === 409">
          {{ 'data_import_error_409' | translate }}
        </span>
        <span class="warn" *ngIf="file.responseStatus === 400">
          {{ 'data_import_error_400' | translate }}
        </span>
        <mat-progress-bar
          mode="determinate"
          *ngIf="file.data && file.progress.status === ${UploadStatus.Uploading}"
          [value]="file.data.percentage"></mat-progress-bar>
      </div>
    </div>
    <button mat-mini-fab
      color="warn"
      *ngIf="file.responseStatus"
      (click)="removeFile(file)">
      <i class="fa fa-times"></i>
    </button>

  </mat-list-item>
</mat-list>
<edit-form
  *ngIf="fields && fields.length > 0 && files.length > 0 && canAddFiles(1)"
  [fields]="fields"
  [hideCancel]="true"
  hideSave="true"
  [record]="fieldValues"
  (onFormUpdate)="onFormUpdate.emit($event)"></edit-form>
<button mat-raised-button
  [disabled]="uploadDisabled"
  color="primary"
  *ngIf="canAddFiles(1)"
  (click)="startUpload()">
  <i class="fa fa-upload"></i>
  {{ 'start_upload' | translate }}
</button>
`
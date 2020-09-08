import {
  AfterViewInit, ElementRef, Component, EventEmitter,
  Input, OnChanges, Output, ViewChild } from '@angular/core'

/**
 * Behaves like a mix of uib popover and uibmodal
 *
 * I would have used uib popover or c popover but I would like the component to be able to use
 * provided content ("transclusion")
 */

@Component({
  selector: 'popover-modal',
  styleUrls: ['./PopoverModal.component.scss'],
  template: `
  <div #container
    [id]="dialogId"
    [style.left]="containerPosition.left + 'px'"
    [style.top]="containerPosition.top + 'px'"
    [style.position]="position"
    [class]="classNames" [hidden]="showDialog === false">

    <header #head [class.dragable]="isDragable">
      <h4>
        {{title}}
      </h4>
      <a role="button" *ngIf="canClose" (click)="close()">
        <div>
          <div></div>
          <div></div>
        </div>
      </a>
    </header>
    <ng-content></ng-content>
  </div>
  `
})
export class PopoverModalComponent implements AfterViewInit, OnChanges {
  @Input() xPosition
  @Input() yPosition
  @Input() displayContent = false
  @Input() position = 'fixed'
  @Input() title: string
  @Input() isDragable: boolean = false
  @Input() positionFromCenter = true
  @Input() canClose = true
  @Input() dialogId = 'popoverDialog'
  @Output() onClose = new EventEmitter<any>()
  @ViewChild('container') container: ElementRef
  @ViewChild('head') head: ElementRef
  classNames = ''
  containerPosition = {
    top: 0,
    left: 0
  }
  showDialog = false
  closeTimeoutId = null
  window = window
  startX: number = null
  startY: number = null
  dx = 0
  dy = 0

  ngAfterViewInit () {
    this.setModalPosition()

    if (this.isDragable) {
      this.adjustContainerPosition = this.adjustContainerPosition.bind(this)
      const headEl = this.head.nativeElement
      headEl
        .addEventListener('mousedown', (e) => {
          this.setStartCoords(e)
          document.addEventListener('mousemove', this.adjustContainerPosition)
        })

      document
        .addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', this.adjustContainerPosition)
        })
    }
  }

  ngOnChanges (changes) {
    if (changes.displayContent || changes.xPosition || changes.yPosition) {
      this.handleShowChange()
    }
  }

  adjustContainerPosition (e) {
    const dx = e.clientX - this.startX
    const dy = e.clientY - this.startY

    const left = this.containerPosition.left + dx
    const top = this.containerPosition.top + dy

    if (top >= 0) {
      this.containerPosition.top = top
    }

    if (left >= 0) {
      this.containerPosition.left = left
    }
    this.setStartCoords(e)
  }

  calcContainerOffset (dimension: number) {
    return this.positionFromCenter ? dimension / 2 : 0
  }

  /**
   * Set the (fixed) position of the content container
   */
  setModalPosition () {
    const container = this.container.nativeElement
    // // Set center positions
    const xMod = this.calcContainerOffset(container.clientWidth)
    const yMod = this.calcContainerOffset(container.clientHeight)

    // TODO - Make this less hacky
    const diff = window.innerWidth - xMod - this.xPosition - 260
    const xMod2 = diff < 0 ? 160 : 0
    // const adjustedX = (this.xPosition - xMod)
    // const adjustedY = (this.yPosition - yMod)
    // // Modify position if setting to center places dialog off screen
    // const { top } = this.adjustForWindow(this.yPosition, container.clientHeight)
    this.containerPosition.left = this.xPosition - xMod - xMod2
    this.containerPosition.top = this.yPosition - yMod
  }

  /**
   *  Handlex external change to Input which controls show/hide state of component
   */
  handleShowChange () {
    if (this.displayContent && !this.showDialog) {
      setTimeout(() => this.setModalPosition(), 0)
      this.showDialog = true
      this.classNames = 'showing'
    } else if (!this.displayContent && this.showDialog) {
      this.close()
    }
  }

  /**
   * Adjust the initial position of the popover so that it is on screen
   * TODO: take care of X position
   */
  adjustForWindow (top, height) {
    if (top < 0) {
      return {
        top: 0
      }
    }

    const { innerHeight } = this.window
    if (top + height > innerHeight) {
      return {
        top: innerHeight - height
      }
    }

    return { top }
  }

  /**
   * Trigger close of dialog
   */
  close () {
    if (this.closeTimeoutId) return

    this.classNames = 'closing'
    this.closeTimeoutId = setTimeout(
      () => {
        this.onClose.emit(null)
        this.closeTimeoutId = null
        this.showDialog = false
      }, 500
    )
  }

  private setStartCoords (e) {
    this.startX = e.clientX
    this.startY = e.clientY
  }
}

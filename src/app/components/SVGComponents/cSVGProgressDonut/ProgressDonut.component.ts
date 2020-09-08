import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'

@Component({
  selector: 'progress-donut',
  styleUrls: ['./ProgressDonut.component.scss'],
  templateUrl: './ProgressDonut.component.html'
})
export class ProgressDonutComponent implements OnChanges {
  @Input() bgColor: string
  @Input() radius: number
  @Input() failed: boolean = false
  @Input() progressWidth
  @Input() percent: number = 0
  @Input() title: string
  rad: number = 360
  intervalId: number = null
  formattedPercent: number = 0

  ngOnChanges (changes: SimpleChanges) {
    if (changes.percent && typeof this.percent === 'number') {
      this.formattedPercent = Math.floor(+this.percent)
    }
  }

  getStroke () {
    if (this.failed === true) return 'red'

    const g = Math.floor((this.formattedPercent) / 100 * 255)
    return `rgb(0, ${g}, 0)`
  }
}

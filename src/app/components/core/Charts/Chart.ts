import { AfterViewInit, Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core'
import { range } from 'lodash'
import * as Chart from 'chart.js'

@Component({
  selector: 'vs-chart',
  styleUrls: ['./styles.scss'],
  templateUrl: './template.html'
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @Input() xAxisLabels: Array<string | number> = []
  @Input() yRatio: number = 3
  @Input() xRatio: number = 4
  @Input() title: string = ''
  @Input() type: string = 'bar'
  @Input() colours: Array<string> = []
  @Input() datasets: Array<Chart.ChartDataSets>
  @Input() showLegend = true
  


  @ViewChild('canv') canvas
  chart: Chart
  chartConfig
  viewInitialised = false

  colourGen () {
    const b = '255'
    const a = '0.7'
    const startR = 40
    const endR = 160
    const startG = 215
    const endG = 90
    const count = this.datasets.length === 1 ? this.datasets[0].data.length : this.datasets.length

    if (count === 0) return []

    if (count === 1) return [`rgba(${startR}, ${startG}, ${b}, ${a})`]

    const incrementR = Math.abs(startR - endR) / (count - 1)
    const decrementG = Math.abs(startG - endG) / (count - 1)
    return range(0, count)
      .map(i => {
        const r = Math.floor(startR + (incrementR * i))
        const g = Math.floor(startG - (decrementG * i))
        return `rgba(${r}, ${g}, ${b}, ${a})`
      })

  }

  renderChart () {
    if (this.chart) {
      Object.assign(this.chart.data, { datasets: this.getDatasetsWithConfig(), labels: this.xAxisLabels })
      this.chart.update()
    } else {
      this.setInitialChartConfig()
      this.chart = new Chart(this.canvas.nativeElement.getContext('2d'), this.chartConfig)
    }
  }

  getDatasetsWithConfig () {
    const colours = this.colours.length === 0 ? this.colourGen() : this.colours
    return this.datasets
      .map((dataset, index) => Object.assign({}, dataset, {
        borderWidth: 1,
        pointRadius: 0,
        backgroundColor: this.getColour(colours, index)
      }))

  }

  setInitialChartConfig () {
    this.chartConfig = {
      type: this.type,
      data: {
        labels: this.xAxisLabels,
        datasets: this.getDatasetsWithConfig()
      },
      options: {
        title: {
          display: true,
          text: this.title
        },
        scales: this.getScales(),
        legend: {
          display: this.showLegend
        }
       }
    }
  }

  ngAfterViewInit () {
    if (this.datasets) {
      this.renderChart()
    }

    this.viewInitialised = true
  }

  ngOnChanges (changes: SimpleChanges) {
    if (this.viewInitialised && changes.datasets) {
      this.renderChart()
    }
  }

  private getColour (colours: Array<string>, index: number) {
    if (this.type === 'line' && colours[index]) {
      return colours[index]
    }

    return colours
  }

  private getScales () {

    if (this.type === 'line' || this.type === 'bar') {
      return {
        yAxes: [{
          ticks: {
            beginAtZero: true
          } as Chart.LinearTickOptions
        }],
        xAxes: []
      }
    }

    return {
      yAxes: [],
      xAxes: []
    }
  }
}

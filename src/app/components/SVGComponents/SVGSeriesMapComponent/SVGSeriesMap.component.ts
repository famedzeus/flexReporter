import { Component, OnInit, Input, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core'
import { Log } from 'services'

interface IMetaData {
    name:string,
    background:string,
    text:string
}

/**
 * @description
 * Series Map Graphic Component
 */
@Component({
  selector: 'svg-series-map',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./SVGSeriesMap.component.scss'],
  templateUrl: './SVGSeriesMap.component.html'
})
export class SVGSeriesMapComponent implements OnInit, OnChanges{
    @Input() map:IMetaData
    @Input() car:IMetaData
    @Input() volume:number
    @Input() offline:Date
    @Input() viewbox:string
    @Input() routeNumber:number

    elementRef:ElementRef
    width:number
    arrowPoints:string
    offlineTextX:number

    constructor (
        log: Log,
        elementRef:ElementRef
    ) {
        log.debug('Series Map Graphic Component Init')
        this.elementRef = elementRef
    }

    ngOnInit(){
        this.width = this.elementRef.nativeElement.getBoundingClientRect().width-10
        this.arrowPoints = `0,20 ${this.width - 10},20 ${this.width},30 ${this.width - 10},40 0,40 0,0`
        this.offlineTextX = this.width - 120
    }

    ngOnChanges(){
        // default colours if no colours defined
        if (!this.map.background) {
            this.map.background = '#ddd'
            this.map.text = '#000'
        }
        if (!this.car.background) {
            this.car.background = '#ddd'
            this.car.text = '#000'
        }
    }

}

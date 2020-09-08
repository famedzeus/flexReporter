import { Component, OnInit } from '@angular/core'
import appConfig from 'app-config'
import { random } from 'lodash'

@Component({
  selector: 'route-not-found',
  templateUrl: './RouteNotFound.component.html',
  styleUrls: ['./RouteNotFound.component.scss']
})
export class RouteNotFoundComponent implements OnInit {

  configurations = [{
    titleLocale: '404_car_crash_title',
    imgSrc: `${appConfig.imagesUri}/404/crash.png`,
    contentLocale: '404_car_crash_content'
  }, {
    titleLocale: '404_dragon_title',
    imgSrc: `${appConfig.imagesUri}/404/dragon.jpg`,
    contentLocale: '404_dragon_content'
  }]
  configuration

  ngOnInit () {
    this.configuration = this.configurations[random(0, this.configurations.length - 1)]
  }
}

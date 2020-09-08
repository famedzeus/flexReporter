import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AlertEmitter } from './alert-emitter'
import { HttpHelper } from './http'
import { ServerInfo } from './ServerInfo'
import { HttpRequestEffectService } from '../store/effects/HttpRequest.effects'
import { Cache } from './Cache'

@NgModule({
  imports: [RouterModule],
  providers: [
    AlertEmitter,
    Cache,
    HttpHelper,
    HttpRequestEffectService,
    ServerInfo
  ]
})
export class ServicesModule {

}

import { NgModule } from '@angular/core'
import { ThreeDSceneComponent } from './Scene/ThreeDScene'
import { ThreeDScene } from './Scene/ThreeDScene.service'

@NgModule({
    declarations: [ThreeDSceneComponent],
    entryComponents: [ThreeDSceneComponent],
    providers: [ThreeDScene],
    exports: [ThreeDSceneComponent]
})
export class ThreeDModule {} 

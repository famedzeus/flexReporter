import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'

import { SliderRangeComponent } from './SliderRange.component'
import { SliderComponent } from './Slider.component';
import { SliderHandleComponent } from './SliderHandle.component';
import { SliderFineAdjustComponent } from './SliderFineAdjust.component'
import { SliderLabelComponent } from './SliderLabel.component';
import { SliderScaleComponent } from './SliderScale.component';

const components = [
  SliderComponent,
  SliderFineAdjustComponent,
  SliderHandleComponent,
  SliderLabelComponent,
  SliderRangeComponent,
  SliderScaleComponent]

@NgModule({
  imports: [CommonModule],
  exports: components,
  entryComponents: components,
  declarations: components,
  providers: [],
})
export class SliderModule { }

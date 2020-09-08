import { emitterMock } from '../../../../../utils/tests'
import { MaskInputComponent } from './'

describe('UI Components.MaskInput', () => {
  let component: MaskInputComponent
  let onChange

  beforeEach(() => {
    onChange = emitterMock()
    component = new MaskInputComponent()
    component.onChange = onChange
  })

  // describe('Angular Lifecyle Handlers', () => {

  //   describe('ngOnInit', () => {

  //   })

  // })

})

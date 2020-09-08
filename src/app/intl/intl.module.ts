import { NgModule } from '@angular/core'
import { EffectsModule} from '../store/effects.module'
import { IntlService } from './Intl.service'
import { TranslatorPipe } from './Translator.pipe'

const providers = [IntlService, TranslatorPipe]
@NgModule({
  imports: [EffectsModule],
  declarations: [TranslatorPipe],
  providers,
  exports: [TranslatorPipe]
})
export class IntlModule {}

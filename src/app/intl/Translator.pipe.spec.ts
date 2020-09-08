import { TranslatorPipe } from './Translator.pipe'
import { Observable, Subscription } from 'rxjs'
import { sinon } from '../../../utils/tests'

const messages = {
  val_param: 'foo {{$0}} bar',
  val_params3: 'foo {{$0}} bar {{$0}}{{$1}}',
  val_no_params: 'foo bar'
}

describe('transformers.TranslatorPipe', () => {
  let translator
  let observable
  let subscription
  let result
  let sandbox
  afterEach(() => {
    sandbox.restore()
  })
  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    subscription = sandbox.stub(Subscription.prototype, 'unsubscribe')
    observable = Observable.of(messages)
    const effectsMock = {
      translations$: observable
    }
    translator = new TranslatorPipe(effectsMock as any)
  })

  describe('Translate args provided', () => {
    it('should return interpolated result', () => {
      result = translator.transform('val_param', 'test')
      expect(result).toBe('foo test bar')
    })

    it('should return interpolated result', () => {
      result = translator.transform('val_params3', 'test')
      expect(result).toBe('foo test bar test')
    })

    it('should return interpolated result', () => {
      result = translator.transform('val_params3', 'test', 'test2')
      expect(result).toBe('foo test bar testtest2')
    })
  })

  describe('No translate args provided', () => {
    beforeEach(() => {
      result = translator.transform('val_no_params')
    })

    it('should return the unmodified locale', () => {
      expect(result).toBe(messages.val_no_params)
    })
  })

  describe('ngOnDestroy method', () => {
    it('should unsubscribe from intl store effects', () => {
      translator.ngOnDestroy()
      expect(subscription.called).toBe(true)
    })
  })
})

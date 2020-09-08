import { UploadFormComponent } from './UploadForm.component'
import { UploadStatus } from 'ngx-uploader'

describe('UploadFromComponent', () => {
  const proto = UploadFormComponent.prototype
  let component: UploadFormComponent

  beforeEach(() => {
    component = new UploadFormComponent()
  })

  describe(proto.canAddFiles.name, () => {
    const oneQueuedFile = [
          { progress: { status: UploadStatus.Queue } }]
    describe('single file mode = false', () => {
      beforeEach(() => {
        component.singleFile = false
      })
      it('should always allow file add if not single file mode', () => {
        component.files = oneQueuedFile as any
        expect(component.canAddFiles()).toBe(true)
      })


    })

    describe('single file mode = true', () => {
      beforeEach(() => {
        component.singleFile = true
      })
      it('should not allow file to be added', () => {
        component.files = oneQueuedFile as any
        expect(component.canAddFiles()).toBe(false)
      })

      it('should allow file to be added', () => {
        component.files = oneQueuedFile as any
        expect(component.canAddFiles(1)).toBe(true)
      })
    })
  })
})
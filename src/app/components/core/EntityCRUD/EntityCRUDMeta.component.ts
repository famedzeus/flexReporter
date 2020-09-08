import { EntityCRUDStore } from './EntityCRUDStore.component'
import { MatDialog } from '@angular/material'
import { IBaseStore } from '../../../store'
import { EntityCRUDService } from '../../../store/effects/Entity.effects.base'
import { ParameterEffectService } from 'effects'
import { getBoundOffset } from '../../../services/browser-utils'
import { Log } from 'services'

export class EntityCRUDStoreMeta<T> extends EntityCRUDStore<T> {
  editMetadata = false
  metadataPosition: { x?: number, y?: number } = {}
  metaValue = ''
  metadata = {}
  fieldValueMetadata = {}
  // List of field names for which metadata is to be associated
  metaEditFieldNames = []
  // Target element to be matched for popup position
  target = 'filtered'

  constructor (
    log: Log,
    dialog: MatDialog,
    protected parameterEffects: ParameterEffectService,
    EffectsService: EntityCRUDService<T, any>,
    OtherEffectsServices: Array<EntityCRUDService<any, any>> = []
  ) {
    super(log, dialog, EffectsService, OtherEffectsServices)
    this.setMetadata()
  }

  /**
   * Request meta data for entity and add to component instance
   */
  setMetadata (entityName?: string) {
    this.subscriptions.push(
      this.parameterEffects
        .getMetadata$(entityName || this.EffectsService.entityName)
        .subscribe(metadata => {
          this.metadata = metadata[this.metaEditFieldNames[0]] || {}
          this.fieldValueMetadata = metadata
          this.hideMetaEdit()
        })
    )
  }

  /**
   * Intercepts action request to see if settings is the actionName in the message
   * -> If it is it handles opening the popover modal
   */
  onActionRequest (message: {actionName: string, value: any, $event: any}, modal) {
    const { actionName, value, $event } = message

    if (actionName === 'Settings') {
      // Set info for modal popover and the attribute to attach data
      this.metaValue = value[this.metaEditFieldNames[0]]
      // Initial click position
      const targetRegEx = new RegExp(this.target, 'gi')

      this.metadataPosition = getBoundOffset($event.target, targetRegEx)
      this.editMetadata = true
    } else {
      super.onActionRequest(message, modal)
    }
  }

  hideMetaEdit () {
    this.editMetadata = false
  }

  /**
   * Requests an update to metadata value then refreshes current data
   */
  updateMetadata ($event) {
    const { value, metadata } = $event

    this
      .parameterEffects
      .setMetadata(
        this.EffectsService.entityName, this.metaEditFieldNames[0],
        value, metadata
      )
  }
}

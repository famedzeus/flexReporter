import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { ActivityType, ActivityState } from '../../components/core/LoadingDialog'
import { GlobalActivityAction, GlobalActivityActionType, RestrictedActivityType } from '../reducers/GlobalActivity.reducer'

export { ActivityType }
@Injectable()
export class GlobalActivityEffectService {
  constructor (
    private store: Store<{ globalActivityState: ActivityState }>
  ) {}

  // Action dispatchers

  setNoActivity () {
    this.store
      .dispatch<GlobalActivityAction>({
        type: GlobalActivityActionType.SetNoActivity
      })
  }

  setActivity (status: RestrictedActivityType, message: string) {
    this.store
      .dispatch<GlobalActivityAction>({
        type: GlobalActivityActionType.SetActivity,
        status,
        message
      })
  }

  // Observable state getters
  get activityState$ () {
    return this.store.select(state => state.globalActivityState)
  }
}

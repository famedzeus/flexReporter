import { NgModule } from '@angular/core'
import { EntitiesModule } from 'entities'
import { DataViewPipe } from './effects/DataView.pipe'
import { PaginationService } from './utils'
import * as effects from './effects'

// import { ArtificialFeatureEffectService } from './effects/ArtificialFeature.effects'
// import { AttributeEffectService } from './effects/Attribute.effects'
// import { AttributeFeatureEffectService } from './effects/AttributeFeature.effects'
// import { AttributeSetEffectService } from './effects/AttributeSet.effects'
// import { AttributeSetAttributeValueEffectService } from './effects/AttributeSetAttributeValue.effects'
// import { AttributeSetHierarchyEffectService } from './effects/AttributeSetHierarchy.effects'
// import { AttributeValueEffectService } from './effects/AttributeValue.effects'
// import { CarSeriesEffectService } from './effects/CarSeries.effects'
// import { CarSeriesColourGroupEffectService } from './effects/CarSeriesColourGroup.effects'
// import { ColourEffectService } from './effects/Colour.effects'
// import { ColourElementEffectService } from './effects/ColourElement.effects'
// import { ColourTypeEffectService } from './effects/ColourType.effects'
// import { CostFunctionTypeEffectService } from './effects/CostFunctionType.effects'
import { DataViewEffectService } from './effects/DataView.effects'
// import { DestinationEffectService  } from './effects/Destination.effects'
// import { EndItemEffectService } from './effects/EndItem.effects'
// import { EndItemFeatureEffectService } from './effects/EndItemFeature.effects'
// import { FeatureEffectService } from './effects/Feature.effects'
import { GlobalActivityEffectService } from './effects/GlobalActivity.effects'
import { IntlEffectService } from './effects/Intl.effects'
// import { LineEffectService } from './effects/Line.effects'
// import { LineMapEffectService } from './effects/LineMap.effects'
// import { LineMapZoneEffectService } from './effects/LineMapZone.effects'
// import { MetricWeightEffectService } from './effects/MetricWeight.effects'
import { ParameterEffectService } from './effects/Parameter.effects'
// import { PenaltyFunctionEffectService } from './effects/PenaltyFunction.effects'
// import { RouteEffectService } from './effects/Route.effects'
// import { RuleEffectService } from './effects/Rule.effects'
// import { RuleAttributeSetEffectService } from './effects/RuleAttributeSet.effects'
// import { RuleTypeEffectService } from './effects/RuleType.effects'
// import { ScheduleEffectService } from './effects/Schedule.effects'
// import { ScheduleScopeEffectService } from './effects/ScheduleScope.effects'
// import { ScheduleSolutionEffectService } from './effects/ScheduleSolution.effects'
// import { ScheduleSolutionRouteEffectService } from './effects/ScheduleSolutionRoute.effects'
// import { ScheduleSolutionSlotEffectService } from './effects/ScheduleSolutionSlot.effects'
// import { SolutionStateEffectService } from './effects/ScheduleSolutionState.effects'
// import { ScheduleSolutionSlotSummaryEffects } from './effects/ScheduleSolutionSlotSummary.effects'
// import { SeriesMapEffectService } from './effects/SeriesMap.effects'
// import { SeriesMapGroupEffectService } from './effects/SeriesMapGroup.effects'
// import { SeriesMapGroupPatternEffectService } from './effects/SeriesMapGroupPattern.effects'
// import { SeriesMapPatternEffectService } from './effects/SeriesMapPattern.effects'
// import { SeriesMapPatternElementEffectService } from './effects/SeriesMapPatternElement.effects'
// import { SeriesMapZoneEffectService } from './effects/SeriesMapZone.effects'
// import { ShiftEffectService } from './effects/Shift.effects'
// import { ShopEffectService } from './effects/Shop.effects'
// import { ShopLineEffectService } from './effects/ShopLine.effects'
// import { SolutionMetricValueEffectService } from './effects/SolutionMetricValue.effects'
import { SystemEventEffectService } from './effects/SystemEvent.effects'
import { TaskEffectService } from './effects/Task.effects'
import { UserEffectService } from './effects/User.effects'
import { UserAlertEffectService } from './effects/UserAlert.effects'
import { UserGroupEffectService } from './effects/UserGroup.effects'
import { UserGroupUserEffectService } from './effects/UserGroupUser.effects'
// import { VehicleEffectService } from './effects/Vehicle.effects'
// import { ZoneEffectService } from './effects/Zone.effects'
// import { ZonePatternEffectService } from './effects/ZonePattern.effects'
// import { ZonePatternElementEffectService } from './effects/ZonePatternElement.effects'
// import { ZoneTypeEffectService } from './effects/ZoneType.effects'
// import { ZoneWIPEffectService } from './effects/ZoneWIP.effects'

@NgModule({
  imports: [
    EntitiesModule
  ],
  declarations: [DataViewPipe],
  exports: [DataViewPipe],
  providers: [
    DataViewPipe,
    // ArtificialFeatureEffectService,
    // AttributeEffectService,
    // AttributeFeatureEffectService,
    // AttributeSetEffectService,
    // AttributeSetAttributeValueEffectService,
    // AttributeSetHierarchyEffectService,
    // AttributeValueEffectService,
    // CarSeriesEffectService,
    // CarSeriesColourGroupEffectService,
    // ColourEffectService,
    // ColourElementEffectService,
    // ColourTypeEffectService,
    // CostFunctionTypeEffectService,
    DataViewEffectService,
    // DestinationEffectService,
    // EndItemEffectService,
    // EndItemFeatureEffectService,
    // FeatureEffectService,
    GlobalActivityEffectService,
    IntlEffectService,
    // LineEffectService,
    // LineMapEffectService,
    // LineMapZoneEffectService,
    // MetricWeightEffectService,
    ParameterEffectService,
    // PenaltyFunctionEffectService,
    // RouteEffectService,
    // RuleEffectService,
    // RuleAttributeSetEffectService,
    // RuleTypeEffectService,
    // ScheduleEffectService,
    // ScheduleScopeEffectService,
    // ScheduleSolutionEffectService,
    // ScheduleSolutionRouteEffectService,
    // ScheduleSolutionSlotEffectService,
    // SolutionStateEffectService,
    // ScheduleSolutionSlotSummaryEffects,
    // SeriesMapEffectService,
    // SeriesMapGroupEffectService,
    // SeriesMapGroupPatternEffectService,
    // SeriesMapPatternEffectService,
    // SeriesMapPatternElementEffectService,
    // SeriesMapZoneEffectService,
    // ShiftEffectService,
    // ShopEffectService,
    // ShopLineEffectService,
    // SolutionMetricValueEffectService,
    SystemEventEffectService,
    TaskEffectService,
    UserEffectService,
    UserAlertEffectService,
    UserGroupEffectService,
    UserGroupUserEffectService,
    // VehicleEffectService,
    // ZoneEffectService,
    // ZonePatternEffectService,
    // ZonePatternElementEffectService,
    // ZoneTypeEffectService,
    // ZoneWIPEffectService,
    PaginationService
  ]
})
export class EffectsModule {}

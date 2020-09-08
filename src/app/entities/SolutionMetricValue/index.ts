import entitySpec from './fields'
import { makeResourceService, ActionUri, NoSuccessAlerts, EntityMeta, EntityName,
  IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { SolutionMetricValue } from './interface'

const { fieldNames } = entitySpec

@EntityName('SolutionMetricValue')
@EntityMeta(entitySpec)
@NoSuccessAlerts()
@Uri(`metrics/:${fieldNames.scheduleScopeName}/:${fieldNames.scheduleSolutionName}/:${fieldNames.metricName}`)
class SolutionMetricValueResource extends Resource<SolutionMetricValue> {
  meta = entitySpec
}

interface ISolutionMetricValueResource extends IResource<SolutionMetricValue> {}

/**
 * @description
 * Provides a $resource for access to SolutionMetricValues.
 */
@Injectable()
export class SolutionMetricValueService extends makeResourceService<SolutionMetricValueResource, ISolutionMetricValueResource>(SolutionMetricValueResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'
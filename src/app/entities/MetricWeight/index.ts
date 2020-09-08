import entitySpec from './fields'
import { makeResourceService, Action, ActionUri, EntityMeta, EntityName,
         IResource, Resource, Uri } from '../reflect'
import { Injectable } from '@angular/core'
import { HttpHelper } from '../../services/http'
import { MetricWeight } from './interface'

const { fieldNames } = entitySpec

@EntityName('MetricWeight')
@EntityMeta(entitySpec)
@Uri(`metricWeights/:${fieldNames.metricName}`)
class MetricWeightResource extends Resource<MetricWeight> {
  meta = entitySpec
}

interface IMetricWeightResource extends IResource<MetricWeight> {}

/**
 * @description
 * Provides a ResourceService for access to MetricWeight.
 */
@Injectable()
export class MetricWeightService extends makeResourceService<MetricWeightResource, IMetricWeightResource>(MetricWeightResource) {
  static meta = entitySpec
  constructor (
    public HttpHelper: HttpHelper
  ) { super(HttpHelper) }
}

export * from './interface'

// Endpoint definitions & url parameters to keep to DRY
// -> Could potentially be partially generated with a nested object struct
// -> Done manually for the current moment for clarity
const scheduleScopeName = 'scheduleScopeName';
const calendarCode = 'calendarCode';
const shiftCode = 'shiftCode';
const carSeriesCode = 'carSeriesCode'
const nameCode = 'nameCode'
const name = 'name'
const seriesMapName = 'seriesMapName'
const filter = 'filter'
const sort = 'sort'
const id = 'id'
const sequence = 'sequence'
const carSeries = 'carSeries'
const featureCode = 'featureCode'
const filterParams = `@${filter}`
const sortParams = `@${sort}`

// Schedule scope ------------------------------------------
const scheduleScopeUri = `scheduleScopes/:${scheduleScopeName}`
const scheduleScopeParams = {
  [scheduleScopeName]: `@${scheduleScopeName}`
}

// Schedule Solution
const scheduleSolutionName = 'scheduleSolutionName'
const scheduleSolutionUri = `${scheduleScopeUri}/scheduleSolutions/:${scheduleSolutionName}`
const scheduleSolutionParams = Object.assign({
  [scheduleSolutionName]: `@${scheduleSolutionName}`
}, scheduleScopeParams)

// Temporary for mocking purposes - assuming that tasks will be from regular task manager
const scheduleSolutionCustomUris = [{
  actionName: 'generateSolution',
  method: 'POST',
  uri: `${scheduleSolutionUri}/generate`,
  params: scheduleSolutionParams
}, {
  actionName: 'tasks',
  isArray: true,
  method: 'GET',
  uri: `${scheduleScopeUri}/scheduleSolutions/tasks`,
  params: scheduleSolutionParams
}, {
  actionName: 'getSummary',
  method: 'GET',
  uri: `${scheduleSolutionUri}/summary`,
  params: scheduleSolutionParams
}]


// Attributes ------------------------------------------
const attributeName = 'attributeName';
const attributeUri = `${scheduleScopeUri}/attributes/:${attributeName}`
const attributeValue = 'attributeValue'
const attributeValueUri = `${attributeUri}/attributeValues/:${attributeValue}`
const attributeFeatureUri = `${attributeValueUri}/attributeFeatures/:${carSeries}/:${featureCode}`
const setName = 'setName'
const attributeSetMemberUri = `attributeSetMembers/:${scheduleScopeName}/:${setName}`
const attributeSetUri = `attributeSets/:${scheduleScopeName}`
const attributeParams = Object.assign({
  [attributeName]: `@${attributeName}`
}, scheduleScopeParams)
const attributeValueParams = Object.assign({
  [attributeValue]: `@${attributeValue}`
}, attributeParams)
const attributeFeatureParams = Object.assign({
  [featureCode]: `@${featureCode}`,
  [carSeriesCode]: `@${carSeriesCode}`
}, attributeValueParams)
const attributeSetParams = Object.assign({
  [setName]: `@${setName}`
}, scheduleScopeParams)

const attributeSetMemberParams = Object.assign({}, attributeSetParams)


// Car Series ------------------------------------------
const carSeriesUri = `carSeries/:${carSeriesCode}`
const carSeriesParams = {
  [carSeriesCode]:`@${carSeriesCode}`
}

// Destination
const destinationCode = 'destinationCode'
const destinationUri = `destinations/:${destinationCode}`
const destinationParams = {
  [destinationCode]: `@${destinationCode}`
}

const eventLogUri = `eventLog/:${id}`
const eventLogParams = {
  [id]: `@${id}`
}

// end item
const endItemUri = `endItems`
const endItemFeatureUri = `endItemFeatures`

// feature ------------------------------------------
const featureUri = 'features'
const mask = 'mask'

const artificialFeatureUri = `artificialFeatures/:${carSeriesCode}/:${mask}/:${featureCode}/:${destinationCode}`
const artificialFeatureParams = {
  [featureCode]: `@${featureCode}`,
  [mask]: `@${mask}`,
  [destinationCode]: `@${destinationCode}`,
  [carSeriesCode]: `@${carSeriesCode}`
}


// Line ------------------------------------------
const lineUri = `lines/:id`
const linesUri = `lines/:id`
const lineMapZoneUri = 'lineMapZones/:id'


// Get zones by line Id --------------------------------------
const zonesByLineId = 'lines/:${lineId}/zones'
// GET /v1/lines/{lineId}/zones

// parameters
const parameterUri = 'parameters'

// Penalty Function
const penaltyFunctionName = 'penaltyFunctionName'
const penaltyFunctionUri = `penaltyFunctions/:${penaltyFunctionName}`
const penaltyFunctionParams = {
  [penaltyFunctionName]: `@${penaltyFunctionName}`
}

// Route
const schedulePeriod = 'schedulePeriod'
const routeNumber = 'routeNumber'
const routeUri = `routes/:${routeNumber}/:${schedulePeriod}`
const routeParams = {
  [routeNumber]: `@${routeNumber}`,
  [routeUri]: `@${routeUri}`
}

// Rule ------------------------------------------
const ruleId = 'ruleId'
const ruleUri = `rules/:${scheduleScopeName}/:${ruleId}`
const ruleAttributeSetUri = `${scheduleScopeUri}/ruleAttributeSets`
const relationshipCode = 'relationshipCode'
const ruleAttSetRelationshipUri = 'ruleAttSetRelationships/:relationshipCode'
const ruleTypeCode = 'ruleTypeCode'
const ruleTypeUri = `ruleTypes/:${ruleTypeCode}`
const ruleParams = Object.assign({
  [ruleId]: `@${ruleId}`
}, scheduleScopeParams)
const ruleAttributeSetParams = {
  [scheduleScopeName]: `@${scheduleScopeName}`
}
const ruleAttSetRelationshipParams = {
  [relationshipCode]: `@${relationshipCode}`
}
const ruleTypeParams = {
  [ruleTypeCode]: `@${ruleTypeCode}`
}


// Series Map ------------------------------------------
const seriesMapUri = `seriesMaps/:${seriesMapName}`
const seriesMapGroupsUri = `seriesMapGroups/:${id}`
const seriesMapPatternNamesUri = `seriesMapPatternNames/:${nameCode}`
const seriesMapPatternsUri = `seriesMapPatterns/:${sequence}/:${nameCode}`
const seriesMapGroupPatternsUri = `seriesMapGroupPatterns/:${sequence}/:${name}`
const seriesMapZonesUri = 'seriesMapZones/'
const seriesMapParams = {
  [seriesMapName]:`@${seriesMapName}`
}
const seriesMapGroupsParams = {
  [id]:`@${id}`
}
const seriesMapPatternNamesParams = {
  [nameCode]:`@${nameCode}`
}
const seriesMapPatternsParams = Object.assign({
  [name]:`@${name}`,
  [sequence]:`@${sequence}`
} )
const seriesMapGroupPatternsParams = Object.assign({
  [sequence]:`@${sequence}`,
  [name]:`@${name}`
} )

// Series Schedule ------------------------------------------
const seriesScheduleUri = `seriesSchedules/:${shiftCode}/:${seriesMapName}`
const seriesScheduleParams = {
  [shiftCode]: `@${shiftCode}`,
  [seriesMapName]:`@${seriesMapName}`
}


// Shop line ------------------------------------------
const shopLineUri = `shopLines/:${calendarCode}`
const shopLineParams = {
  [calendarCode]: `@${calendarCode}`
}


// Shift ------------------------------------------
const shiftUri = `shifts/:${calendarCode}/:${shiftCode}?sort=:${sort}`
const shiftParams = Object.assign({
  [shiftCode]: `@${shiftCode}`
}, shopLineParams)

// Shop ------------------------------------------
const shopsUri = 'shops/'
const shopUri = `shops/:id`
const shopParams = {
  id: '@id'
}
const lineParams = shopParams

// Slot ------------------------------------------
const slots = 'slots'
const slotUri = `${slots}`
const slotCustomUris = [{
  actionName: 'getNumberOfSlots',
  uri: `slots/fromShift/:fromDate/:fromShift/toShift/:toDate/:toShift/count`,
  params: {
    fromDate: '@fromDate',
    fromShift: '@fromShift',
    toDate: '@toDate',
    toShift: '@toShift'
  }
}, {
  actionName: 'getSlotAllocations',
  uri: `results/:zoneCode`,
  isArray: true,
  params: {
    zoneCode: '@zoneCode'
  }
}]

// Slot statuses ------------------------------------------
const statuses = 'statuses'
const statusesUri = `${statuses}`

// Vehicle
const vehicleId =  `vehicleId`
const vehicleUri = `vehicles/:${vehicleId}`
const vehicleParams = {
  [vehicleId]: `@${vehicleId}`
}

const allocationUri = `allocations/:${vehicleId}/:${routeNumber}`
const allocationParams = Object.assign({

}, routeParams, vehicleParams)


// Zone ------------------------------------------
const zoneCode = 'zoneCode'
const mapName = 'mapName'
const zoneUri = `zones/:${zoneCode}`;
const zoneCustomUris = [{ uri: 'zones/zoneTypes', actionName: 'queryZoneTypes' },{ uri: 'zones/offlineZoneForSeriesMap/', actionName: 'queryOfflineZoneForMap' }]
const zoneTypeUri = `zones/zoneTypes`
const offlineZoneForMapUri = `zones/offlineZoneForSeriesMap/`
const zoneParams = {
  [zoneCode]: `@${zoneCode}`,
  [mapName]: `@${mapName}`,
}

// Zone pattern ------------------------------------------
const zonePatternUri = `zonePatterns/:${id}`
const zonePatternParams = {
  [id]: `@${id}`
}

// Zone pattern elements ------------------------------------------
const zonePatternId = `zonePatternId`
const zonePatternElementUri = `zonePatternElements/:${zonePatternId}/:${sequence}`
const zonePatternElementParams = Object.assign({
  [zonePatternId]: `@${zonePatternId}`,
  [sequence]: `@${sequence}`
})

// Zone WIP ------------------------------------------
const zoneWIPUri = `zoneWIPs/:${zoneCode}/:${calendarCode}/:${shiftCode}`
const zoneWIPParams = Object.assign({
  [calendarCode]: `@${calendarCode}`
}, shiftParams, zoneParams)

export default {
  allocationUri,
  allocationParams,
  artificialFeatureUri,
  artificialFeatureParams,
  attributeUri,
  attributeParams,
  attributeValueUri,
  attributeValueParams,
  attributeFeatureUri,
  attributeFeatureParams,
  attributeSetUri,
  attributeSetParams,
  attributeSetMemberUri,
  attributeSetMemberParams,
  carSeriesUri,
  carSeriesParams,
  destinationUri,
  destinationParams,
  endItemUri,
  endItemFeatureUri,
  eventLogUri,
  eventLogParams,
  featureUri,
  filterParams,
  linesUri,
  lineUri,
  lineParams,
  lineMapZoneUri,
  parameterUri,
  penaltyFunctionUri,
  penaltyFunctionParams,
  routeNumber,
  routeUri,
  ruleUri,
  ruleParams,
  ruleAttributeSetUri,
  ruleAttributeSetParams,
  ruleAttSetRelationshipUri,
  ruleAttSetRelationshipParams,
  ruleTypeUri,
  ruleTypeParams,
  scheduleScopeUri,
  scheduleScopeParams,
  scheduleSolutionUri,
  scheduleSolutionParams,
  scheduleSolutionCustomUris,
  seriesMapUri,
  seriesMapParams,
  seriesMapGroupsUri,
  seriesMapGroupsParams,
  seriesMapPatternNamesUri,
  seriesMapPatternNamesParams,
  seriesMapPatternsUri,
  seriesMapPatternsParams,
  seriesScheduleUri,
  seriesScheduleParams,
  seriesMapGroupPatternsUri,
  seriesMapGroupPatternsParams,
  seriesMapZonesUri,
  shopsUri,
  shopLineUri,
  shopLineParams,
  shopUri,
  shopParams,
  shiftUri,
  shiftParams,
  slotUri,
  slotCustomUris,
  vehicleUri,
  vehicleParams,
  zoneWIPUri,
  zoneWIPParams,
  zoneUri,
  zoneParams,
  zoneTypeUri,
  offlineZoneForMapUri,
  zonePatternUri,
  zonePatternParams,
  zonePatternElementUri,
  zonePatternElementParams
}

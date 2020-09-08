import { isPresent } from '../common-constraints'

export const constraints = {
  setName: isPresent,
  carSeriesCode: isPresent,
  opposite: isPresent
}

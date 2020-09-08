
export interface Slider {
  sliderHandles: Array<SliderHandle>
  sliderRanges: Array<SliderRange>
  crossoverDisabled: boolean
}

export interface SliderRange {
  sliderHandleStart: SliderHandle
  sliderHandleEnd: SliderHandle
}

export interface SliderHandle {
  /** Percentage Value */
  percentage?: number
  snappedPercentage?: number
  value?: number
  label?: string
  fineLabel?: string
  active?: boolean
  handleColour?: string
}
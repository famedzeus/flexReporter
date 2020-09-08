export interface IColourSettings  {
  textColour: string
  backgroundColour: string
}

export type MetaSettings = IColourSettings

export interface IParameter {
  parameter: string
  parameterType: string
  value: MetaSettings | string
  userId: string
}

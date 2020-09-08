export interface IColorKey {
  backgroundColor: string
  textColor: string
  styleExpression: Object
}

export class ColorKey implements IColorKey {
  backgroundColor
  textColor
  styleExpression

  constructor (bgColorField: string,color: string,style?: string) {
    this.backgroundColor = bgColorField
    this.textColor = color
    this.styleExpression = style ? style : `background:${this.backgroundColor};color:${this.textColor}`
  }

  getStyle () {
    return this.styleExpression
  }

}

export interface IShopLine {
  calendarCode: string
  shopId: string
  lineId: string
  buildOrder: number
}

type ShopLines = Array<IShopLine>

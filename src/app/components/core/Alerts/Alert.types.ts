export type AlertType = 'danger' | 'success' | 'info' | 'warning'

export interface IAlert {
  displayMilliseconds: number,
  message: string,
  type: AlertType
}

export type IAlerts = Array<IAlert>

export interface ILanguage {
  name: string
  code: string
}

export interface IAppSection {
  title: string
  disabled: boolean
  path: string
}

export interface ILanguages {
  [key: string]: ILanguage
}

export interface IServer {
  domain: string
  port: number
  secure: boolean
}

export interface IAPI {
  uri: string,
  version: number
}

export type IAppSections = Array<IAppSection>
export enum Env {
  Dev = 'DEV',
  QA = 'QA',
  Test = 'TEST',
  Production = 'PROD',
  UnitTesting = 'UNIT'
}
export interface IAppConfig {
  api: IAPI
  env: Env
  serverSubdomain: string
  versionNumber: string
  buildDate: string
  languages: ILanguages
  language: ILanguage
  logging: boolean
  sections: IAppSections
  server: IServer
  plantName ?: string
  permissionsDisabled ?: boolean
  imagesUri: string
  assetsUri: string
  logoUri: string
  messageUri: string,
  endpoints: Array<any>,
  endPointsUri: string
}

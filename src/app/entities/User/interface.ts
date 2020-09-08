export interface IUser {
  userName: string,
  emailAddress: string,
  language: string,
  enabled: string | boolean,
  userId: string
}

export interface IVehicleSchedulingUser {
  username: string
  authorities: Array<{ authority: string }>
  accountNonExpired: boolean  // NOTE: Why are these field names negated?
  accountNonLocked: boolean
  credentialsNonExpired: boolean
  enabled: boolean
  displayName: string
  emailAddress: string
  language: string
  groups: Array<string>
}

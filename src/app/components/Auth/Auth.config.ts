export const standardAdminPermisions = {
  create: true,
  delete: true,
  update: true,
  config: true,
  user: true
}
export const standardUserPermissions = {
  create: true,
  delete: true,
  update: true,
  config: false,
  user: false
}

export const userPermissions = {
  routes: {
    admin: standardAdminPermisions,
    user: standardUserPermissions
  },
  scheduling: {
    admin: standardAdminPermisions,
    user: standardUserPermissions
  },
  plant: {
    admin: standardAdminPermisions,
    user: standardUserPermissions
  }
}

export const userAccessCode = 'U'
export const adminAccessCode = 'A'

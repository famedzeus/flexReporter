// import { UserAuth } from './user-auth'
// import { MockHttp } from '../../entities/_framework/fixtures'
// import { UserService, UserGroupService } from 'entities'
// import { AuthenticatingProgressComponent } from './AuthenticatingProgress'
// import { dialogMock, expectOnceWith, fetchMock, sinon } from '../../../../utils/tests'
// import { userGroups } from './user-auth.fixtures'
// import { standardAdminPermisions } from './Auth.config'

// const forceResponse = (obj, method, response, success) => {
//   const old = obj[method].bind(obj)
//   sinon.stub(obj, method, (...args) => {
//     old(...args)
//     return Promise.resolve(response)
//   })
// }

// const forceSuccessResponse = (obj, method, response) => {
//   forceResponse(obj, method, response, true)
// }

// describe('Components: Auth - UserAuth Service', () => {
//   let User: UserService
//   let UserGroup: UserGroupService
//   let userAuth: UserAuth
//   let dialog
//   let userFetch
//   let userGroupFetch
//   let sandbox
//   let userHttp

//   beforeEach(() => {
//     sandbox = sinon.sandbox.create()

//     // Stub Promise.all and capture callbacks
//     sandbox.stub(Promise, 'all', () => Promise.resolve({}))
//     const fetchM = fetchMock()
//     userFetch = fetchM.mock
//     userHttp = MockHttp(userFetch)
//     User = new UserService(userHttp)

//     userGroupFetch = fetchMock().mock
//     UserGroup = new UserGroupService(MockHttp(userGroupFetch))
//     dialog = dialogMock()
//   })

//   afterEach(() => {
//     sandbox.restore()
//   })

//   describe('initialisation', () => {
//   //   beforeEach((done) => {
//   //     forceSuccessResponse(User, 'getCurrentUser', {
//   //       username: 'testy', // This field is User Id in reality
//   //       enabled: true,
//   //       accountNonExpired: true,
//   //       accountNonLocked: true,
//   //       credentialsNonExpired: true,
//   //       groups: ['BBSS_ADMINGROUP']
//   //     })

//   //     forceSuccessResponse(User, 'logoutCurrentUser', {})
//   //     forceSuccessResponse(User, 'find', {})

//   //     forceSuccessResponse(UserGroup, 'query', {
//   //       data: userGroups
//   //     })

//   //     userAuth = new UserAuth(dialog as any, {} as any, User, UserGroup, null, null)
//   //     userAuth.authInfoPromise.then(done).catch(done)
//   //   })

//   //   it('should make request to log out user', () => {
//   //     expect(userFetch.calledWith('url/loggedonuser/logout')).toBe(true)
//   //   })

//   //   it('should make request to get current user', () => {
//   //     expect(userFetch.calledWith('url/loggedonuser')).toBe(true)
//   //   })

//   //   it('should make request for usergroups', () => {
//   //     expect(userGroupFetch.calledWith('url/userGroups')).toBe(true)
//   //   })

//   //   it('should open a dialog whilst fetching', () => {
//   //     expectOnceWith(dialog.open, AuthenticatingProgressComponent)
//   //   })

//   //   it('should make request for User of received loggedonuser', () => {
//   //     expect(userFetch.calledWith('url/users/testy?userId=testy')).toBe(true)
//   //   })

//   //   it('should close the dialog when request is resolved', () => {
//   //     expect(dialog.close.called).toBe(true)
//   //   })

//   //   it('should correctly set 0 error codes', () => {
//   //     expect(userAuth.errorCodes.length).toBe(0)
//   //   })

//   //   it('should correctly give user bbss admin permissions', (done) => {
//   //     userAuth.getPermissions('scheduling')
//   //       .then(permissions => {
//   //         expect(permissions).toEqual(standardAdminPermisions)
//   //       })
//   //       .then(done)
//   //       .catch(() => null)

//   //   })
//   })
// })

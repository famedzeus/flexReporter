declare var APP_BUILD_DATE: string
declare var APP_VERSION
const API_VERSION = 1
const serverSubdomain = `vehicle-scheduling-reporting`
export default {
versionNumber: APP_VERSION,
  buildDate: APP_BUILD_DATE,
  permissionsDisabled: false,
  serverSubdomain,
  api: {
    version: API_VERSION,
    uri: `${serverSubdomain}/api/v${API_VERSION}/`
  },
  plantName: 'NMUK',
  assetsUri: 'assets',
  imagesUri: 'assets/images',
  logoUri: 'assets/images/nissan-logo-red.jpg',
  language: {name: '', code: ''},
  endpoints:[],
  messageUri: 'app/messages',
  endPointsUri: 'app/endpoints',
  sections: [{
     title: 'Dashboards',
     path: '/dashboards',
     disabled: false
  },{
     title: 'Data upload wizard',
     path: '/admin',
     disabled: false
  }
  // ,{
  //    title: 'Builder',
  //    path: '/build',
  //    disabled: false
  // }, {
  //    title: 'Generator',
  //    path: '/generate',
  //    disabled: false
  // },{
  //    title: 'Prototype',
  //    path: '/prototype',
  //    disabled: false
  // }
  // {
  //   title: 'System Log',
  //   path: '/systemLog',
  //   disabled: true
  // }
  // {
  //   title: 'Reports',
  //   disabled: false
  // }
  ],
  languages: {
    'en': {
      name: 'English',
      code: 'en'
    },
    'es': {
      name: 'Spanish',
      code: 'es'
    },
    'fr': {
      name: 'French',
      code: 'fr'
    },
    'de': {
      name: 'German',
      code: 'de'
    },
    'it': {
      name: 'Italian',
      code: 'it'
    },
    'jp': {
      name: 'Japanese',
      code: 'jp'
    }
  }
}



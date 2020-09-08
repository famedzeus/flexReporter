const fs = require('fs')
const path = require('path')

function root(__path = '.') {
  return path.join(__dirname + '/../', __path);
}


module.exports = (env = 'dev') => {

  // dll helpers
  function getManifest(__path) {
    var __fs = fs || require('fs');
    var manifest = tryDll(() => JSON.parse(__fs.readFileSync(root(`./dist/${env}/dll/` + __path + '-manifest.json'), 'utf8')
        // TODO(gdi2290): workaround until webpack fixes dll generation
          .replace(/}(.*[\n\r]\s*)}(.*[\n\r]\s*)}"activeExports": \[\]/, '')));
    return manifest;
  }
  function getDllAssets(chunk) {
    var assets =  tryDll(() => require(root(`./dist/${env}/dll/webpack-assets.json`)));
    // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
    return assets[chunk]['js'];
  }
  function getAssets(chunk) {
    var assets =  tryDll(() => require(root(`./dist/${env}/webpack-assets.json`)));
    // {"vendors":{"js":"vendors.js"},"polyfills":{"js":"polyfills.js"}}
    return assets[chunk]['js'];
  }
  function tryDll(cb) {
    try {
      return cb();
    } catch (e) {
      console.info("Initializing `%s`...", "DLL files");
      var spawn = require('cross-spawn');
      spawn.sync("npm", ["run", "dll"], { stdio: "inherit" });
      return cb();
      // throw new Error('Please run `npm run dll` first before building or running the server');
    }
  }
  
  return {
    getManifest,
    getDllAssets,
    getAssets,
    tryDll,
    root
  }
}
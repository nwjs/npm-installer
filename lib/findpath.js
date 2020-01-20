var fs = require('fs');
var path = require('path');
var bindir = path.resolve(__dirname, '..', 'nwjs');

module.exports = function() {
  var bin = bindir;
  var platform = process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform;
  if (platform === 'darwin') {
    if (fs.existsSync(path.join(bin, 'Contents'))) {
      bin = path.join(bin, 'Contents', 'MacOS', 'nwjs');
    } else {
      bin = path.join(bin, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    }
  } else if (platform === 'win32') {
    bin = path.join(bin, 'nw.exe');
  } else {
    bin = path.join(bin, 'nw');
  }
  return bin;
}

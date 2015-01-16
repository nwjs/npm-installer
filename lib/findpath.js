var fs = require('fs');
var path = require('path');
var bindir = path.resolve(__dirname, '..', 'nwjs');

module.exports = function() {
  var bin = bindir;
  if (process.platform === 'darwin') {
    if (fs.existsSync(path.join(bin, 'Contents'))) {
      bin = path.join(bin, 'Contents', 'MacOS', 'nwjs');
    } else {
      bin = path.join(bin, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    }
  } else if (process.platform === 'win32') {
    bin = path.join(bin, 'nw.exe');
  } else {
    bin = path.join(bin, 'nw');
  }
  return bin;
}

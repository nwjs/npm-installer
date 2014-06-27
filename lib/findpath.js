var fs = require('fs');
var path = require('path');
var bindir = path.resolve(__dirname, '..', 'nodewebkit');

module.exports = function() {
  var bin = bindir;
  if (process.platform === 'darwin') {
    if (fs.existsSync(path.join(bin, 'Contents'))) {
      bin = path.join(bin, 'Contents', 'MacOS', 'node-webkit');
    } else {
      bin = path.join(bin, 'node-webkit.app', 'Contents', 'MacOS', 'node-webkit');
    }
  } else if (process.platform === 'win32') {
    bin = path.join(bin, 'nw.exe');
  } else {
    bin = path.join(bin, 'nw');
  }
  return bin;
}

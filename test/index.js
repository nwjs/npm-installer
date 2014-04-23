var test = require('tape');
var path = require('path');
var fs = require('fs');

test('has downloaded and extracted', function(t) {
  t.plan(1);
  var bin = path.resolve(__dirname, '..', 'nodewebkit');
  if (process.platform === 'darwin') {
    bin = path.join(bin, 'Contents', 'MacOS', 'node-webkit');
  } else if (process.platform === 'win32') {
    bin = path.join(bin, 'nw.exe');
  } else {
    bin = path.join(bin, 'nw');
  }
  fs.exists(bin, t.ok.bind(t));
});

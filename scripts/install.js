#!/usr/bin/env node

var download = require('download');
var rimraf = require('rimraf');
var createBar = require('multimeter')(process);
var path = require('path');
var fs = require('fs');

var version = require('../package.json').version.slice(0, 5);
var url = false;
var urlBase = 'http://dl.node-webkit.org/v';

// Determine download url
if (process.platform === 'darwin') {
  url = urlBase + version + '/node-webkit-v' + version + '-osx-ia32.zip';
} else if (process.platform === 'win32') {
  url = urlBase + version + '/node-webkit-v' + version + '-win-ia32.zip';
} else if (process.arch === 'ia32') {
  url = urlBase + version + '/node-webkit-v' + version + '-linux-ia32.tar.gz';
} else if (process.arch === 'x64') {
  url = urlBase + version + '/node-webkit-v' + version + '-linux-x64.tar.gz';
}

function error(e) {
  console.error((typeof e === 'string') ? e : e.message);
  process.exit(0);
}

if (!url) error('Could not find a compatible version of node-webkit to download for your platform.');

var dest = path.resolve(__dirname, '..', 'nodewebkit');
rimraf.sync(dest);

var bar = createBar({ before: url + ' [' });

var total = 0;
var progress = 0;
var d = download(url, dest, { extract: true, strip: 1 });
d.on('response', function(res) {
  total = parseInt(res.headers['content-length']);
});
d.on('data', function(data) {
  progress += data.length;
  if (total > 0) {
    var percent = progress / total * 100;
    bar.percent(percent);
    if (percent >= 100) {
      console.log('');
      console.log('Extracting...');
    }
  }
});
d.on('error', error);
d.on('close', function() {
  // If OSX, manually set file permissions (until adm-zip supports getting the file mode from zips)
  if (process.platform === 'darwin') {
    [
      'Contents/MacOS/node-webkit',
      'Contents/Frameworks/node-webkit Helper.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/node-webkit Helper.app/Contents/Resources/crash_report_sender',
      'Contents/Frameworks/node-webkit Helper.app/Contents/MacOS/node-webkit Helper',
      'Contents/Frameworks/node-webkit Helper.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib',
      'Contents/Frameworks/node-webkit Helper NP.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/node-webkit Helper NP.app/Contents/Resources/crash_inspector',
      'Contents/Frameworks/node-webkit Helper NP.app/Contents/MacOS/node-webkit Helper NP',
      'Contents/Frameworks/node-webkit Helper NP.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib',
      'Contents/Frameworks/node-webkit Helper EH.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/node-webkit Helper EH.app/Contents/Resources/crash_inspector',
      'Contents/Frameworks/node-webkit Helper EH.app/Contents/MacOS/node-webkit Helper EH',
      'Contents/Frameworks/node-webkit Helper EH.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib'
    ].forEach(function(filepath) {
      filepath = path.resolve(dest, filepath);
      if (fs.existsSync(filepath)) {
        fs.chmodSync(filepath, '0755');
      }
    });
  }
  process.nextTick(function() {
    process.exit();
  });
});

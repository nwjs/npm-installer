#!/usr/bin/env node

var download = require('download');
var rimraf = require('rimraf');
var semver = require('semver');
var createBar = require('multimeter')(process);
var path = require('path');
var fs = require('fs');

var v = semver.parse(require('../package.json').version);
var version = [v.major, v.minor, v.patch].join('.');
if (v.prerelease && typeof v.prerelease[0] === 'string') {
  var prerelease = v.prerelease[0].split('-');
  if (prerelease.length > 1) {
    prerelease = prerelease.slice(0, -1);
  }
  version += '-' + prerelease.join('-');
}
var url = false;
var urlBase = 'http://dl.nwjs.io/v';

// Determine download url
switch (process.platform) {
  case 'win32':
    url = urlBase + version + '/nwjs-v' + version + '-win-' + process.arch +'.zip';
    break;
  case 'darwin':
    url = urlBase + version + '/nwjs-v' + version + '-osx-' + process.arch + '.zip';
    break;
  case 'linux':
    url = urlBase + version + '/nwjs-v' + version + '-linux-' + process.arch + '.tar.gz';
    break;
}

function error(e) {
  console.error((typeof e === 'string') ? e : e.message);
  process.exit(0);
}

if (!url) error('Could not find a compatible version of nw.js to download for your platform.');

var dest = path.resolve(__dirname, '..', 'nwjs');
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
    if (!fs.existsSync(path.join(dest, 'Contents'))) {
      dest = path.join(dest, 'nwjs.app');
    }
    [
      'Contents/MacOS/nwjs',
      'Contents/Frameworks/nwjs Helper.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/nwjs Helper.app/Contents/Resources/crash_report_sender',
      'Contents/Frameworks/nwjs Helper.app/Contents/MacOS/nwjs Helper',
      'Contents/Frameworks/nwjs Helper.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib',
      'Contents/Frameworks/nwjs Helper NP.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/nwjs Helper NP.app/Contents/Resources/crash_inspector',
      'Contents/Frameworks/nwjs Helper NP.app/Contents/MacOS/nwjs Helper NP',
      'Contents/Frameworks/nwjs Helper NP.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib',
      'Contents/Frameworks/nwjs Helper EH.app/Contents/Resources/crash_report_sender.app/Contents/MacOS/crash_report_sender',
      'Contents/Frameworks/nwjs Helper EH.app/Contents/Resources/crash_inspector',
      'Contents/Frameworks/nwjs Helper EH.app/Contents/MacOS/nwjs Helper EH',
      'Contents/Frameworks/nwjs Helper EH.app/Contents/Libraries/libclang_rt.asan_osx_dynamic.dylib'
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

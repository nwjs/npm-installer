#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var ZIP = require('zip');
var mkdirp = require('mkdirp');
var zlib = require('zlib');
var tar = require('tar');

var version = require('../package.json').version.slice(0, 5);
var url = false;

// Determine download url
if (process.platform === 'darwin') {
  url = 'http://s3.amazonaws.com/node-webkit/v' + version + '/node-webkit-v' + version + '-osx-ia32.zip';
} else if (process.platform === 'win32') {
  url = 'http://s3.amazonaws.com/node-webkit/v' + version + '/node-webkit-v' + version + '-win-ia32.zip';
} else if (process.arch === 'ia32') {
  url = 'http://s3.amazonaws.com/node-webkit/v' + version + '/node-webkit-v' + version + '-linux-ia32.tar.gz';
} else if (process.arch === 'x64') {
  url = 'http://s3.amazonaws.com/node-webkit/v' + version + '/node-webkit-v' + version + '-linux-x64.tar.gz';
}

function error(e) {
  console.error((typeof e === 'string') ? e : e.message);
  process.exit(0);
}

if (!url) error('Could not find a compatible version of node-webkit to download for your platform.');

var ext = path.extname(url);
var download = path.resolve(__dirname, '..', 'nodewebkit' + ext);

rimraf.sync(download);
var dest = path.resolve(__dirname, '..', 'nodewebkit');

var isZip = url.match(/\.zip/);
if (isZip) {
  // Where to download and extract
  var zipfile = fs.createWriteStream(download);
  var finished = false;
  zipfile.on('finish', function() {
    if (finished) return;
    finished = true;

    console.log('Finish downloading. Extracting...');

    var reader = ZIP.Reader(fs.readFileSync(download));
    reader.forEach(function(entry) {
      var mode = entry.getMode();
      var filename = path.resolve(dest, entry.getName());
      if (entry.isDirectory()) {
        mkdirp.sync(filename, mode);
      } else {
        mkdirp.sync(path.dirname(filename));
        fs.writeFileSync(filename, entry.getData());
      }
      if (mode) fs.chmodSync(filename, mode);
    });
    rimraf.sync(download);
  });
  zipfile.on('close', function() {
    zipfile.emit('finish');
  });
} else {
  var unpackStream = unpack(dest);
  var gunzipper = zlib.createGunzip();
  gunzipper.pipe(unpackStream);
}

// Download!
console.log('Downloading ' + url + '...');
var request = http.get(url, function(response) {
  response.pipe(isZip ? zipfile : gunzipper);
}).on('error', error);

function unpack(target, cb) {
  if (typeof target === 'function') {
    cb = target;
    target = undefined;
  }
  if (!cb) cb = function noop(){};
  if (!target) target = process.cwd();

  var untarStream = tar.Extract({ path: target, strip: 1 });
  var untarError = false;

  untarStream.on('error', function(e) {
    untarError = true;
    cb(e);
  });

  untarStream.on('end', function() {
    if (untarError) return;
    cb();
  });

  return untarStream;
}
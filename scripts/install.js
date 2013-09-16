#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
var rimraf = require('rimraf');

var version = require('../package.json').version;
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

// Where to download and extract
var zipfile = fs.createWriteStream(download);
zipfile.on('finish', function() {
  console.log('Finish downloading. Extracting...');
  var zip = new AdmZip(download);
  zip.extractAllTo(path.resolve(__dirname, '..', 'nodewebkit'), true);
  rimraf.sync(download);
});

// Download!
console.log('Downloading ' + url + '...');
var request = http.get(url, function(response) {
  response.pipe(zipfile);
}).on('error', error);
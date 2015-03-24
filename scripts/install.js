#!/usr/bin/env node

var request = require('request');
var rimraf = require('rimraf');
var semver = require('semver');
var createBar = require('multimeter')(process);
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var urlModule = require('url');
var Decompress = require('decompress');
var fileExists = require('file-exists');
var chalk = require('chalk');
var os = require('os');

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
var filename = false;
var urlBase = process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE ||  'http://dl.nwjs.io/v';

// Determine download filename
switch (process.platform) {
  case 'win32':
    filename = 'nwjs-v' + version + '-win-' + process.arch +'.zip';
    break;
  case 'darwin':
    filename = 'nwjs-v' + version + '-osx-' + process.arch + '.zip';
    break;
  case 'linux':
    filename = 'nwjs-v' + version + '-linux-' + process.arch + '.tar.gz';
    break;
}

// Create download url
url = urlBase + version + '/' + filename;

function logError(e) {
  console.error(chalk.bold.red((typeof e === 'string') ? e : e.message));
  process.exit(1);
}

function cb(error) {
  if( error != null ) {
    return logError( error )
  }

  process.nextTick(function() {
    process.exit();
  });
}

function dc(filepath, cb) {
  var dest = path.resolve(__dirname, '..', 'nwjs');
  rimraf.sync(dest);

  var decompressOptions = { strip: 1, mode: '755' };

  new Decompress()
    .src( filepath )
    .dest( dest )
    .use( Decompress.zip(decompressOptions) )
    .use( Decompress.targz(decompressOptions) )
    .run( cb );
}

if (!url) logError('Could not find a compatible version of nw.js to download for your platform.');

var parsedUrl = urlModule.parse(url);

if( parsedUrl.protocol == 'file:' ) {
  if ( !fileExists(parsedUrl.path) ) {
    logError('Could not find ' + parsedUrl.path);
  }
  dc(parsedUrl.path, cb);
} else {
  var tmpfile = path.resolve(os.tmpdir(), filename);

  request.get(url)
    .on('error', function(err) {
      logError(err);
    })
    .pipe(
      fs.createWriteStream(tmpfile)
        .on('finish', function() {
            dc(tmpfile, function(error) {
              fs.unlink(tmpfile);
              cb(error);
            })
        })
    );
}

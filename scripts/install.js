#!/usr/bin/env node

var Download = require('download');
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
var urlBase = process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE ||  'http://dl.nwjs.io/v';

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

if (!url) logError('Could not find a compatible version of nw.js to download for your platform.');

var dest = path.resolve(__dirname, '..', 'nwjs');
rimraf.sync(dest);

var bar = createBar({ before: url + ' [' });

var total = 0;
var progress = 0;

var parsedUrl = urlModule.parse(url);
var decompressOptions = { strip: 1, mode: '755' };
if( parsedUrl.protocol == 'file:' ) {
  if ( !fileExists(parsedUrl.path) ) {
    logError('Could not find ' + parsedUrl.path);
  }
  new Decompress()
    .src( parsedUrl.path )
    .dest( dest )
    .use( Decompress.zip(decompressOptions) )
    .use( Decompress.targz(decompressOptions) )
    .run( cb );
} else {
  new Download(merge({ extract: true }, decompressOptions))
    .get( url )
    .dest( dest )
    .run( cb );
}

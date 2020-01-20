#!/usr/bin/env node

var download = require('download');
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

var buildType = process.env.npm_config_nwjs_build_type || process.env.NWJS_BUILD_TYPE || 'normal';

var v = semver.parse(require('../package.json').version);
var version = [v.major, v.minor, v.patch].join('.');
if (v.prerelease && typeof v.prerelease[0] === 'string') {
  var prerelease = v.prerelease[0].split('-');
  if (prerelease.length > 1) {
    prerelease = prerelease.slice(0, -1);
  }
  version += '-' + prerelease.join('-');
}

if ( version.slice(-4) === '-sdk' ){
   version = version.slice(0, -4);
   buildType = 'sdk';
} else if ( version.slice(-3) === 'sdk' ){
   version = version.slice(0, -3);
   buildType = 'sdk';
}

var url = false;
var arch = process.env.npm_config_nwjs_process_arch || process.arch;
var urlBase = process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE ||  'https://dl.nwjs.io/v';
var buildTypeSuffix = buildType === 'normal' ? '' : ('-' + buildType);
var platform = process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform;

// Determine download url
switch (platform) {
  case 'win32':
    url = urlBase + version + '/nwjs' + buildTypeSuffix + '-v' + version + '-win-' + arch +'.zip';
    break;
  case 'darwin':
    url = urlBase + version + '/nwjs' + buildTypeSuffix + '-v' + version + '-osx-' + arch + '.zip';
    break;
  case 'linux':
    url = urlBase + version + '/nwjs' + buildTypeSuffix + '-v' + version + '-linux-' + arch + '.tar.gz';
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

function fileExistsAndAvailable(filepath) {
  try {
    return fileExists(filepath);
  } catch(err) {
    return false;
  }
}

if (!url) logError('Could not find a compatible version of nw.js to download for your platform.');

var dest = path.resolve(__dirname, '..', 'nwjs');
rimraf.sync(dest);

var bar = createBar({ before: url + ' [' });

var total = 0;
var progress = 0;

var parsedUrl = urlModule.parse(url);
var decompressOptions = { strip: 1, mode: '755' };
var filePath;
if( parsedUrl.protocol == 'file:' ) {
  filePath = path.resolve(
    decodeURIComponent(
      url.slice( 'file://'.length )
    )
  );
  if ( !fileExistsAndAvailable(filePath) ) logError(
    'Could not find ' + filePath
  );
  new Decompress()
    .src( filePath )
    .dest( dest )
    .use( Decompress.zip(decompressOptions) )
    .use( Decompress.targz(decompressOptions) )
    .run( cb );
} else {
  download(url, dest, merge({ extract: true }, decompressOptions))
    .then(function() {cb();})
    .catch(function(e) {cb(e);});
}

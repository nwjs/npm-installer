#!/usr/bin/env node

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const { copyAssets } = require('./app_assets.js');
const findpath = require('./findpath.js').findpath;

function run() {
  // Rename nw.js's own package.json as workaround for https://github.com/nwjs/nw.js/issues/1503
  var packagejson = path.resolve(__dirname, '..', 'package.json');
  var packagejsonBackup = path.resolve(__dirname, '..', 'package_backup.json');
  if (!fs.existsSync(packagejsonBackup)) {
    try {
      fs.renameSync(packagejson, packagejsonBackup);
    } catch (err) {}
  }

  // copy over any asset files (icons, etc) specified via CLI args:
  copyAssets(process.platform, findpath());

  // Normalize cli args
  var args = process.argv.slice(2);
  var cwd = (args.length < 1) ? '.' : args[0];
  if (!fs.existsSync(path.resolve(cwd))) {
    args = ['.'].concat(args);
  } else {
    args = [cwd].concat(args.slice(1));
  }

  // Spawn node-webkit
  var nw = spawn(findpath(), args, { stdio: 'inherit' });
  nw.on('close', function() {
    process.nextTick(function() {
      process.exit(0);
    });
  });

  // Restore package.json shortly after nw is spawned
  setTimeout(function() {
    try {
      if (fs.existsSync(packagejsonBackup)) {
        fs.renameSync(packagejsonBackup, packagejson);
      }
    } catch (err) {}
  }, 1000);
}

if (!fs.existsSync(findpath())) {
  console.log('nw.js appears to have failed to download and extract. Attempting to download and extract again...');
  var child = spawn(process.execPath, [path.resolve(__dirname, '..', 'scripts', 'install.js')], { stdio: 'inherit' });
  child.on('close', run);
} else {
  run();
}

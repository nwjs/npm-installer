#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import { copyAssets } from '../lib/app_assets.js';
import findpath from '../lib/findpath.mjs';

function run() {
  // Rename nw.js's own package.json as workaround for https://github.com/nwjs/nw.js/issues/1503
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
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
  var child = spawn(process.execPath, [path.resolve(__dirname, '..', 'scripts', 'install.mjs')], { stdio: 'inherit' });
  child.on('close', run);
} else {
  run();
}

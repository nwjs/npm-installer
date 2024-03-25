#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, renameSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { platform, argv, nextTick, exit, execPath } from 'node:process';
import { fileURLToPath } from 'node:url';

import { copyAssets } from '../lib/app_assets.js';
import util from '../src/util.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function run() {
  // Rename nw.js's own package.json as workaround for https://github.com/nwjs/nw.js/issues/1503
  var packagejson = resolve(__dirname, '..', 'package.json');
  var packagejsonBackup = resolve(__dirname, '..', 'package_backup.json');
  if (!existsSync(packagejsonBackup)) {
    try {
      renameSync(packagejson, packagejsonBackup);
    } catch (err) { }
  }

  // copy over any asset files (icons, etc) specified via CLI args:
  copyAssets(platform, util.findpath());

  // Normalize cli args
  var args = argv.slice(2);
  var cwd = (args.length < 1) ? '.' : args[0];
  if (!existsSync(resolve(cwd))) {
    args = ['.'].concat(args);
  } else {
    args = [cwd].concat(args.slice(1));
  }

  // Spawn node-webkit
  var nw = spawn(util.findpath(), args, { stdio: 'inherit' });
  nw.on('close', function () {
    nextTick(function () {
      exit(0);
    });
  });

  // Restore package.json shortly after nw is spawned
  setTimeout(function () {
    try {
      if (existsSync(packagejsonBackup)) {
        renameSync(packagejsonBackup, packagejson);
      }
    } catch (err) { }
  }, 1000);
}

if (!existsSync(util.findpath())) {
  console.log('nw.js appears to have failed to download and extract. Attempting to download and extract again...');
  var child = spawn(execPath, [resolve(__dirname, '..', 'src', 'postinstall.js')], { stdio: 'inherit' });
  child.on('close', run);
} else {
  run();
}

#!/usr/bin/env node

import child_process from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { copyAssets } from './app_assets.js';
import { findpath } from './findpath.js';

async function run() {
  /* Rename nw.js's own package.json as workaround for https://github.com/nwjs/nw.js/issues/1503 */
  const packagejson = path.resolve(__dirname, '..', 'package.json');
  const packagejsonBackup = path.resolve(__dirname, '..', 'package_backup.json');
  if (fs.existsSync(packagejsonBackup) === false) {
    try {
      fs.renameSync(packagejson, packagejsonBackup);
    } catch (err) {}
  }

  /* Copy over any asset files (icons, etc) specified via CLI args */
  copyAssets(process.platform, findpath());

  /* Normalize cli args */
  const args = process.argv.slice(2);
  const cwd = (args.length < 1) ? '.' : args[0];
  if (fs.existsSync(path.resolve(cwd)) === false) {
    args = ['.'].concat(args);
  } else {
    args = [cwd].concat(args.slice(1));
  }

  // Spawn node-webkit
  const nw = child_process.spawn(findpath(), args, { stdio: 'inherit' });
  nw.on('close', function() {
    process.nextTick(function() {
      process.exit(0);
    });
  });

  /* Restore package.json shortly after nw is spawned */
  setTimeout(function() {
    try {
      if (fs.existsSync(packagejsonBackup)) {
        fs.renameSync(packagejsonBackup, packagejson);
      }
    } catch (err) {}
  }, 1000);
}

if (fs.existsSync(findpath()) === false) {
  console.log('NW.js failed to download and extract. Attempting to download and extract again...');
  const child = child_process.spawn(process.execPath, [path.resolve(__dirname, '..', 'scripts', 'install.js')], { stdio: 'inherit' });
  child.on('close', run);
} else {
  run();
}

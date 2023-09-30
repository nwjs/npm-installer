#!/usr/bin/env node

const { createWriteStream, existsSync, rmSync, renameSync } = require('node:fs');
const { get } = require('node:https');
const { resolve } = require('node:path');
const { arch, env, platform, exit } = require('node:process');
const { URL } = require('node:url');

const compressing = require('compressing');
const progress = require('cli-progress');
const semver = require('semver');

/**
 * NW.js build flavor
 * 
 * @type {'sdk' | 'normal'}
 */
let buildType = env.npm_config_nwjs_build_type || env.NWJS_BUILD_TYPE || 'normal';

// Parse Node manifest version.
let parsedVersion = semver.parse(require('../package.json').version);
let versionString = `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`;

// Check if version is a prelease.
if (parsedVersion.prerelease !== undefined && typeof parsedVersion.prerelease[0] === 'string') {
  let prerelease = parsedVersion.prerelease[0].split('-');
  if (prerelease.length > 1) {
    prerelease = prerelease.slice(0, -1);
  }
  versionString = `${versionString}-${prerelease}`;
}

// Check build flavor
if (versionString.slice(-4) === '-sdk') {
  versionString = versionString.slice(0, -4);
  buildType = 'sdk';
} else if (versionString.slice(-3) === 'sdk') {
  versionString = versionString.slice(0, -3);
  buildType = 'sdk';
}

let url = '';
let hostArch = env.npm_config_nwjs_process_arch || arch;
let urlBase = env.npm_config_nwjs_urlbase || env.NWJS_URLBASE || 'https://dl.nwjs.io/v';
let buildTypeSuffix = buildType === 'normal' ? '' : `-${buildType}`;
let hostOs = env.npm_config_nwjs_platform || env.NWJS_PLATFORM || platform;

// Determine download url
switch (hostOs) {
  case 'win32':
    url = `${urlBase}${versionString}/nwjs${buildTypeSuffix}-v${versionString}-win-${hostArch}.zip`;
    break;
  case 'darwin':
    url = `${urlBase}${versionString}/nwjs${buildTypeSuffix}-v${versionString}-osx-${hostArch}.zip`;
    break;
  case 'linux':
    url = `${urlBase}${versionString}/nwjs${buildTypeSuffix}-v${versionString}-linux-${hostArch}.tar.gz`;
    break;
}

if (url === '') {
  console.error('Could not find a compatible version of nw.js to download for your platform.');
}

let dest = resolve(__dirname, '..', 'nwjs');

if (existsSync(dest) === true) {
  console.info("[ INFO ] The NW.js binary already exists.");
  exit(0);
}

let parsedUrl = new URL(url);
let filePath = '';
if (parsedUrl.protocol === 'file:') {
  filePath = resolve(
    decodeURIComponent(
      url.slice('file://'.length)
    )
  );

  if (existsSync(filePath) === false) {
    console.error('Could not find ' + filePath);
  }

} else {

  const bar = new progress.SingleBar({}, progress.Presets.rect);

  const stream = createWriteStream(dest);

  get(url, (response) => {

    let chunks = 0;
    bar.start(Number(response.headers["content-length"]), 0);
    response.on("data", async (chunk) => {
      chunks += chunk.length;
      bar.increment();
      bar.update(chunks);
    });

    response.on("error", () => {
      rmSync(dest, {
        recursive: true,
        force: true,
      });
    });

    response.on("end", () => {
      if (platform === "linux") {
        compressing.tgz.uncompress(dest, ".")
          .then(() => rmSync(dest, {
            recursive: true,
            force: true,
          }))
          .then(() => {
            renameSync(`nwjs-v${versionString}-${platform}-${arch}`, "nwjs");
          });
      } else {
        compressing.zip.uncompress(dest, ".")
          .then(() => rmSync(dest, {
            recursive: true,
            force: true,
          }))
          .then(() => {
            renameSync(`nwjs-v${versionString}-${platform}-${arch}`, "nwjs");
          });
      }
    });
    response.pipe(stream);
  });
}

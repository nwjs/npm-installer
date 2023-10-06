import { createWriteStream, existsSync } from 'node:fs';
import { rename, rm } from 'node:fs/promises';
import { get } from 'node:https';
import { dirname, resolve } from 'node:path';
import { arch, env, platform, exit } from 'node:process';
import { fileURLToPath, URL } from 'node:url';

import compressing from 'compressing';
import progress from 'cli-progress';
import semver from 'semver';

import nodeManifest from '../package.json' assert { type: 'json' };

/**
 * NW.js build flavor
 * 
 * @type {'sdk' | 'normal'}
 */
let buildType = env.npm_config_nwjs_build_type || env.NWJS_BUILD_TYPE || 'normal';

/**
 * Parsed string version to Semver version object
 */
let parsedVersion = semver.parse(nodeManifest.version);

/**
 * Version string of the format `X.Y.Z-pre`.
 * The prerelease segment `pre` is used to specify build flavor, or other tags.
 * 
 * @type {string}
 */
let versionString = [
  parsedVersion.major,
  parsedVersion.minor,
  parsedVersion.patch
].join('.');

// Check if version is a prelease.
if (typeof parsedVersion?.prerelease?.[0] === 'string') {
  let prerelease = parsedVersion.prerelease[0].split('-');
  if (prerelease.length > 1) {
    prerelease = prerelease.slice(0, -1);
  }
  versionString = [versionString, prerelease].join('-');
}

// Check build flavor and slice that off the `versionString`.
if (versionString.slice(-4) === '-sdk') {
  versionString = versionString.slice(0, -4);
  buildType = 'sdk';
} else if (versionString.slice(-3) === 'sdk') {
  versionString = versionString.slice(0, -3);
  buildType = 'sdk';
}

/**
 * URL to download or get binaries from.
 * 
 * @type {string}
 */
let url = '';

/**
 * Host operating system
 * 
 * @type {NodeJS.Platform | 'osx' | 'win'}
 */
let hostOs = env.npm_config_nwjs_platform || env.NWJS_PLATFORM || platform;

/**
 * Host architecture
 * 
 * @type {NodeJS.Architecture}
 */
let hostArch = env.npm_config_nwjs_process_arch || arch;

/**
 * URL base prepended to `url`.
 * 
 * @type {string}
 */
let urlBase = env.npm_config_nwjs_urlbase || env.NWJS_URLBASE || 'https://dl.nwjs.io/v';

const PLATFORM_KV = {
  darwin: 'osx',
  linux: 'linux',
  win32: 'win',
};

const ARCH_KV = {
  x64: 'x64',
  ia32: 'ia32',
  arm64: 'arm64',
};

url = [
  urlBase,
  versionString,
  '/nwjs',
  buildType === 'normal' ? '' : `-${buildType}`,
  '-v',
  versionString,
  '-',
  PLATFORM_KV[hostOs],
  '-',
  ARCH_KV[hostArch],
  PLATFORM_KV[hostOs] === 'linux' ? '.tar.gz' : '.zip'
].join('');

if (PLATFORM_KV[hostOs] === undefined || ARCH_KV[hostArch] === undefined) {
  console.error('[ ERROR ] Could not find a compatible version of nw.js to download for your platform.');
  exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * The folder where NW.js binaries are placed.
 * 
 * @type {string}
 */
let nwDir = resolve(__dirname, '..', 'nwjs');

if (existsSync(nwDir) === true) {
  exit(0);
}

let parsedUrl = new URL(url);

/**
 * Path to the compressed binary.
 * 
 * @type {string}
 */
let filePath = '';

/**
   * Helper function keep code DRY.
   * @param {string} dir - directory to remove
   */
const rmAndRename = async (dir) => {
  await rm(dir, { recursive: true, force: true });
  await rename(`nwjs-v${versionString}-${PLATFORM_KV[hostOs]}-${ARCH_KV[hostArch]}`, 'nwjs');
};

// If the url is linking to the file system,
// then it is assumed that a compressed binary exists in that location. 
if (parsedUrl.protocol === 'file:') {
  filePath = resolve(decodeURIComponent(url.slice('file://'.length)));

  if (existsSync(filePath) === false) {
    console.error('[ ERROR ] Could not find ' + filePath);
  }

  // If the compressed file is of ZIP format:
  if (filePath.slice(-3) === '.zip') {
    compressing.zip.uncompress(filePath, '.').then(async () => await rmAndRename(filePath));
    // If the compressed file is of TGZ format:
  } else if (filePath.slice(-7) === '.tar.gz') {
    compressing.tgz.uncompress(filePath, '.').then(async () => await rmAndRename(filePath));
  } else {
    console.error(`[ ERROR ] Expected .zip or .tar.gz file format. Got ${filePath}`);
    exit(1);
  }

} else {

  const bar = new progress.SingleBar({}, progress.Presets.rect);

  const stream = createWriteStream(nwDir);

  get(url, (response) => {

    let chunks = 0;
    bar.start(Number(response.headers['content-length']), 0);
    response.on('data', async (chunk) => {
      chunks += chunk.length;
      bar.increment();
      bar.update(chunks);
    });

    response.on('error', async () => await rm(nwDir, { force: true }));

    response.on('end', () => {
      if (PLATFORM_KV[hostOs] === 'linux') {
        compressing.tgz.uncompress(nwDir, '.').then(async () => await rmAndRename(nwDir));
      } else {
        compressing.zip.uncompress(nwDir, '.').then(async () => await rmAndRename(nwDir));
      }
    });
    response.pipe(stream);
  });
}

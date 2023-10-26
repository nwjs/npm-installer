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

await install();

async function install() {

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

  const __dirname = dirname(fileURLToPath(import.meta.url));

  /**
   * URL to download or get binaries from.
   * 
   * @type {string}
   */
  let url = '';

  /**
   * URL base prepended to `url`.
   * 
   * @type {string}
   */
  let urlBase = env.npm_config_nwjs_urlbase || env.NWJS_URLBASE || 'https://dl.nwjs.io/v';

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
   * Path to the decompressed folder.
   * 
   * @type {string}
   */
  let nwFile = '';

  /**
   * Extension of the downloaded file.
   * 
   * @type {'.tar.gz' | '.zip'}
   */
  let nwExt = '';

  /**
   * Path to the compressed file.
   * 
   * @type {string}
   */
  let nwCache = '';

  /**
   * Path to the renamed folder containing NW.js binaries.
   * 
   * @type {string}
   */
  let nwDir = resolve(__dirname, '..', 'nwjs');

  // Check if version is a prelease.
  if (typeof parsedVersion?.prerelease?.[0] === 'string') {
    let prerelease = parsedVersion.prerelease[0].split('-');
    if (prerelease.length > 1) {
      prerelease = prerelease.slice(0, -1);
    }
    versionString = [versionString, ...prerelease].join('-');
  }

  // Check build flavor and slice that off the `versionString`.
  if (versionString.endsWith('-sdk')) {
    versionString = versionString.slice(0, -4);
    buildType = 'sdk';
  } else if (versionString.endsWith('sdk')) {
    versionString = versionString.slice(0, -3);
    buildType = 'sdk';
  }

  nwFile = [
    'nwjs',
    buildType === 'normal' ? '' : `-${buildType}`,
    '-v',
    versionString,
    '-',
    PLATFORM_KV[hostOs],
    '-',
    ARCH_KV[hostArch],
  ].join('');

  nwExt = PLATFORM_KV[hostOs] === 'linux' ? '.tar.gz' : '.zip'

  nwCache = [nwFile, nwExt].join('');

  url = [
    urlBase,
    versionString,
    '/',
    nwCache,
  ].join('');

  if (!PLATFORM_KV[hostOs] || !ARCH_KV[hostArch]) {
    console.error('[ ERROR ] Could not find a compatible version of nw.js to download for your platform.');
    exit(1);
  }

  /**
   * Parsed URL.
   * 
   * @type {URL}
   */
  let parsedUrl = new URL(url);

  /**
   * Request download from server.
   * 
   * @type {Promise<void> | null}
   */
  let request = null;

  if (parsedUrl.protocol === 'file:') {
    nwCache = resolve(decodeURIComponent(url.slice('file://'.length)));
    if (existsSync(nwCache) === false) {
      console.error('[ ERROR ] Could not find ' + nwCache);
      exit(1);
    }
  }

  if (existsSync(nwCache) === false) {
    const bar = new progress.SingleBar({}, progress.Presets.rect);

    const stream = createWriteStream(nwCache);
    request = new Promise((res, rej) => {
      get(url, (response) => {

        let chunks = 0;
        bar.start(Number(response.headers['content-length']), 0);
        response.on('data', async (chunk) => {
          chunks += chunk.length;
          bar.increment();
          bar.update(chunks);
        });

        response.on('error', async () => {
          await rm(nwCache, { force: true });
          rej();
        });

        response.on('end', () => {
          res();
        });

        response.pipe(stream);
      });
    });
  }

  if (request !== null) {
    await request;
  }
  await rm(nwDir, {
    recursive: true,
    force: true,
  });
  await compressing[platform === 'linux' ? 'tgz' : 'zip']
    .uncompress(nwCache, '.');
  await rename(
    nwFile,
    nwDir
  );

  return;
}
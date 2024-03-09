import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import compressing from 'compressing';
import semver from 'semver';

import manifest from '../package.json' assert { type: 'json' };

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

install()
  .catch((error) => {
    if (error.code === 'EPERM') {
      console.error('Unable to create symlink since user did not run as Administrator.');
    }
  });

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
  let urlBase = process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE || 'https://dl.nwjs.io/v';

  /**
   * NW.js build flavor
   * 
   * @type {'sdk' | 'normal'}
   */
  let buildType = process.env.npm_config_nwjs_build_type || process.env.NWJS_BUILD_TYPE || 'normal';

  /**
   * Parsed string version to Semver version object
   */
  let parsedVersion = semver.parse(manifest.version);

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
  let hostOs = process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform;

  /**
   * Host architecture
   * 
   * @type {NodeJS.Architecture}
   */
  let hostArch = process.env.npm_config_nwjs_process_arch || process.arch;

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
  let nwDir = path.resolve(__dirname, '..', 'nwjs');

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

  uri = [
    urlBase,
    versionString,
    '/',
    nwCache,
  ].join('');

  if (!PLATFORM_KV[hostOs] || !ARCH_KV[hostArch]) {
    console.error('[ ERROR ] Could not find a compatible version of nw.js to download for your platform.');
    process.exit(1);
  }

  /**
   * Parsed URL.
   * 
   * @type {URL}
   */
  let parsedUrl = new url.URL(uri);

  /**
   * Request download from server.
   * 
   * @type {Promise<void> | null}
   */
  let request = null;

  if (parsedUrl.protocol === 'file:') {
    nwCache = path.resolve(decodeURIComponent(uri.slice('file://'.length)));
    if (fs.existsSync(nwCache) === false) {
      console.error('[ ERROR ] Could not find ' + nwCache);
      process.exit(1);
    }
  }

  if (fs.existsSync(nwCache) === false) {

    const stream = fs.createWriteStream(nwCache);
    request = new Promise((res, rej) => {
      https.get(uri, (response) => {

        let chunks = 0;
        response.on('data', async (chunk) => {
          chunks += chunk.length;
        });

        response.on('error', async () => {
          await fs.promises.rm(nwCache, { force: true });
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
  await fs.promises.rm(nwDir, {
    recursive: true,
    force: true,
  });
  await compressing[process.platform === 'linux' ? 'tgz' : 'zip']
    .uncompress(nwCache, '.');
  await fs.promises.rename(
    nwFile,
    nwDir
  );

  // This allows nw-builder to treat ./node_modules/nw as cacheDir and access the downloaded binary.
  await fs.promises.symlink(nwDir, nwFile);

  return;
}

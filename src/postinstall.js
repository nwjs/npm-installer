import fs from 'node:fs';
import process from 'node:process';

import semver from 'semver';

import get from './get.js';
import util from './util.js';

await postinstall()
    .catch((error) => {
        if (error.code === 'EPERM') {
            console.error('Unable to create symlink since user did not run as Administrator.');
        }
    });

async function postinstall() {
    /**
     * @type {object}
     */
    const nodeManifest = JSON.parse(await fs.promises.readFile(path.resolve('..', 'package.json'), { encoding: 'utf-8' }));
    const parsedVersion = semver.parse(nodeManifest.version);
    let version = [
        parsedVersion.major,
        parsedVersion.minor,
        parsedVersion.patch
    ].join('.');

    let flavor = process.env.npm_config_nwjs_build_type || process.env.NWJS_BUILD_TYPE || 'normal';
    /* Check if version is a prelease. */
    if (typeof parsedVersion?.prerelease?.[0] === 'string') {
        let prerelease = parsedVersion.prerelease[0].split('-');
        if (prerelease.length > 1) {
            prerelease = prerelease.slice(0, -1);
        }
        version = [version, ...prerelease].join('-');
    }

    /* Check build flavor and slice that off the `version`. */
    if (version.endsWith('-sdk')) {
        version = version.slice(0, -4);
        flavor = 'sdk';
    } else if (version.endsWith('sdk')) {
        version = version.slice(0, -3);
        flavor = 'sdk';
    }

    const platform = util.PLATFORM_KV[process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform];
    const arch = util.ARCH_KV[process.env.npm_config_nwjs_process_arch || process.env.NWJS_ARCH || process.arch];
    const downloadUrl = process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE || 'https://dl.nwjs.io';
    const cacheDir = process.env.npm_config_nwjs_cache_dir || process.env.NWJS_CACHE_DIR || '.';
    const cache = process.env.npm_config_nwjs_cache || process.env.NWJS_CACHE || true;
    const ffmpeg = process.env.npm_config_nwjs_ffmpeg || process.env.NWJS_FFMPEG || false;
    const nativeAddon = process.env.npm_config_nwjs_native_addon || process.env.NWJS_NATIVE_ADDON || false;

    await get({
        version,
        flavor,
        platform,
        arch,
        downloadUrl,
        cacheDir,
        cache,
        ffmpeg: ffmpeg,
        nativeAddon: nativeAddon
    });
}

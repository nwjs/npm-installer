import child_process from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';
import path from 'node:path';
import url from 'node:url';

import semver from 'semver';

import get from './get.js';
import util from './util.js';

await postinstall()
    .catch((error) => {
        if (error.code === 'EPERM') {
            console.error('Unable to create symlink since user did not run as Administrator.');
        } else {
            console.error(error)
        }
    });

async function postinstall() {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    /**
     * @type {fs.PathLike}
     */
    const nodeManifestPath = path.resolve(__dirname, '..', 'package.json');
    /**
     * @type {object}
     */
    const nodeManifest = JSON.parse(await fs.promises.readFile(nodeManifestPath));
    const parsedVersion = semver.parse(nodeManifest.version);
    let version = [
        parsedVersion.major,
        parsedVersion.minor,
        parsedVersion.patch
    ].join('.');

    let flavor = process.env.npm_config_nwjs_build_type || process.env.NWJS_BUILD_TYPE || 'normal';

    /**
     * If `parsedVersion` is `null`, then prerelease is `"null"`.
     * If `parsedVersion?.prerelease` is `[]`, then prerelease is `"undefined"`.
     * If `parsedVersion?.prerelease[0]` is `"N-sdk"` where N represents a build number, then prerelease is `"N-sdk"`.
     *
     * @type {"null" | "undefined" | "N-sdk" | ""}
     */
    const prerelease = String(parsedVersion?.prerelease[0]);
    /* Check build flavor and slice that off the `version`. */
    if (prerelease.endsWith('sdk')) {
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

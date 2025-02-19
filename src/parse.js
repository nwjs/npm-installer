import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import semver from 'semver';

import util from '../src/util.js';

/**
 * @typedef {object} ParseOptions
 * @property {string | "latest" | "stable" | "lts"} version                 Runtime version
 * @property {"normal" | "sdk"}                     flavor                  Build flavor
 * @property {"linux" | "osx" | "win"}              platform                Target platform
 * @property {"ia32" | "x64" | "arm64"}             arch                    Target arch
 * @property {string}                               downloadUrl             Download server.
 * @property {string}                               cacheDir                Cache directory
 * @property {string}                               srcDir                  Source directory
 * @property {boolean}                              cache                   If false, remove cache and redownload.
 * @property {boolean}                              ffmpeg                  If true, ffmpeg is not downloaded.
 * @property {false | "gyp"}                        nativeAddon             Rebuild native modules
 * @property {boolean}                              unref                   Unref the child process and unblock the caller
 */

/**
 * Parse options.
 *
 * @param {ParseOptions} options
 * @return {Promise<ParseOptions>}
 */
export default async function parse(options) {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    /**
     * @type {fs.PathLike}
     */
    const nodeManifestPath = path.resolve(__dirname, '..', 'package.json');
    /**
     * @type {object}
     */
    const nodeManifest = JSON.parse(await fs.promises.readFile(nodeManifestPath, { encoding: 'utf-8' }));
    options.version = options.version ?? nodeManifest.version;
    const parsedVersion = semver.parse(options.version);
    options.version = [
        parsedVersion.major,
        parsedVersion.minor,
        parsedVersion.patch
    ].join('.');
    options.flavor = options.flavor || process.env.npm_config_nwjs_build_type || process.env.NWJS_BUILD_TYPE || 'normal';
    if (String(parsedVersion?.prerelease[0]).endsWith('sdk')) {
        options.flavor = 'sdk';
    }
    options.platform = options.platform || util.PLATFORM_KV[process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform];
    options.arch = options.arch || util.ARCH_KV[process.env.npm_config_nwjs_process_arch || process.env.NWJS_ARCH || process.arch];
    options.downloadUrl = options.downloadUrl || process.env.npm_config_nwjs_urlbase || process.env.NWJS_URLBASE || 'https://dl.nwjs.io';
    options.cacheDir = options.npm_config_nwjs_urlbase || process.env.npm_config_nwjs_cache_dir || process.env.NWJS_CACHE_DIR || path.resolve(__dirname, '..');
    options.srcDir = options.srcDir || process.cwd();
    options.cache = options.cache || process.env.npm_config_nwjs_cache || process.env.NWJS_CACHE || true;
    options.ffmpeg = options.ffmpeg || process.env.npm_config_nwjs_ffmpeg || process.env.NWJS_FFMPEG || false;
    options.nativeAddon = options.nativeAddon || process.env.npm_config_nwjs_native_addon || process.env.NWJS_NATIVE_ADDON || false;
    options.unref = options.unref || process.env.npm_config_nwjs_unref || process.env.NWJS_UNREF || false;

    return { ...options };
}

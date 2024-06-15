import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import url from 'node:url';

import parse from './parse.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * Check if file exists at specified path.
 *
 * @param  {fs.PathLike}           filePath  - File path to check existence of
 * @return {Promise<boolean>}           `true` if exists, otherwise `false`
 */
async function fileExists(filePath) {
    let exists = true;
    try {
        await fs.promises.stat(filePath);
    } catch {
        exists = false;
    }
    return exists;
}

const PLATFORM_KV = {
    darwin: "osx",
    linux: "linux",
    win32: "win",
};

const ARCH_KV = {
    x64: "x64",
    ia32: "ia32",
    arm64: "arm64",
};

const EXE_NAME = {
    win: "nw.exe",
    osx: "nwjs.app/Contents/MacOS/nwjs",
    linux: "nw",
};

/**
 * Get the platform dependant path of the NW.js or ChromeDriver binary.
 *
 * @param {'nwjs' | 'chromedriver' | 'all'} Path to NW.js or Chromedriver executable.
 * @return {Promise<string>}
 */
async function findpath(executable = 'nwjs', options = {}) {
    options = await parse(options);
    const nwDir = path.resolve(__dirname, '..', `nwjs${options.flavor === "sdk" ? "-sdk" : ""}-v${options.version}-${options.platform}-${options.arch}`);

    /**
     * File path to executable.
     *
     * @type {string}
     */
    let binPath = '';

    /**
     * Get the platform dependant path of the NW.js directory containing everything.
     */
    function findDir() {
        binPath = nwDir;
    }

    /**
     * Get the platform dependant path of the NW.js binary.
     */
    function findNwjs() {
        binPath = path.resolve(nwDir, EXE_NAME[options.platform]);
    }

    /**
     * Get the platform dependant path of the ChromeDriver binary.
     */
    function findChromeDriver() {
        binPath = path.resolve(nwDir, `chromedriver${process.platform === "win32" ? ".exe" : ""}`);
    }

    if (executable === 'nwjs') {
        findNwjs();
    } else if (executable === 'chromedriver') {
        findChromeDriver();
    } else if (executable === 'all') {
        findDir();
    } else {
        console.error(`[ ERROR ] Expected nwjs or chromedriver, got ${executable}.`);
    }

    return binPath;
}

export default { ARCH_KV, EXE_NAME, PLATFORM_KV, fileExists, findpath }

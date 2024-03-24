import fs from 'node:fs';

/**
 * Check if file exists at specified path.
 *
 * @param  {NodeJS.fs.}           filePath  - File path to check existence of
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
 * Get the compressed file name.
 * 
 * @param {string} version
 * @param {string} flavor
 * @param {string} platform
 * @param {string} arch
 * @returns {string}
 */
function getCompressedFile(version, flavor, platform, arch) {
    return [
        'nwjs',
        flavor === 'normal' ? '' : `-${flavor}`,
        '-v',
        version,
        '-',
        PLATFORM_KV[platform],
        '-',
        ARCH_KV[arch],
    ].join('');
}

export default { ARCH_KV, EXE_NAME, PLATFORM_KV, fileExists, getCompressedFile }

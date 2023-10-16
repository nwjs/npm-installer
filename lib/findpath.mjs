import { dirname } from 'node:path';
import { env, platform } from 'node:process';
import { fileURLToPath, join } from 'node:path';

/**
 * Get the platform dependant path of the NW.js binary.
 * 
 * @return {string}
 */
export default function findpath() {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const nwDir = resolve(__dirname, '..', 'nwjs');
  let binPath = '';

  /**
 * Host operating system
 * 
 * @type {NodeJS.Platform | 'osx' | 'win'}
 */
  let hostOs = env.npm_config_nwjs_platform || env.NWJS_PLATFORM || platform;

  if (hostOs === 'osx') {
    binPath = join(nwDir, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
  } else if (hostOs === 'win') {
    binPath = join(nwDir, 'nw.exe');
  } else {
    binPath = join(nwDir, 'nw');
  }

  return binPath;
}

import { dirname } from 'node:path';
import { env, platform } from 'node:process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Get the platform dependant path of the NW.js binary.
 * 
 * @param {'nwjs' | 'chromedriver'} exe Path to NW.js or Chromedriver executable.
 * @return {string}
 */
export default function findpath(exe = 'nwjs') {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const nwDir = resolve(__dirname, '..', 'nwjs');
  /**
   * File path to executable.
   * 
   * @type {string}
   */
  let binPath = '';

  /**
    * Host operating system
    * 
    * @type {NodeJS.Platform | 'osx' | 'win'}
    */
  let hostOs = env.npm_config_nwjs_platform || env.NWJS_PLATFORM || platform;

  if (exe === 'nwjs') {
    if (hostOs === 'osx') {
      binPath = join(nwDir, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    } else if (hostOs === 'win') {
      binPath = join(nwDir, 'nw.exe');
    } else {
      binPath = join(nwDir, 'nw');
    }
  } else if (exe === 'chromedriver') {
    binPath = resolve(nwDir, `chromedriver${platform === "win32" ? ".exe" : ""}`);
  } else {
    console.error(`[ ERROR ] Expected nwjs or chromedriver, got ${exe}.`);
  }

  return binPath;
}

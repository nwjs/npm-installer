import { env, platform } from 'node:process';
import { join, resolve } from 'node:path';

/**
 * Get the platform dependant path of the NW.js or ChromeDriver binary.
 * 
 * @param {'nwjs' | 'chromedriver'} executable Path to NW.js or Chromedriver executable.
 * @return {string}
 */
export function findpath(executable = 'nwjs') {
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
    * @type {NodeJS.Platform}
    */
  let hostOs = env.npm_config_nwjs_platform || env.NWJS_PLATFORM || platform;

  /**
   * Get the platform dependant path of the NW.js binary.
   */
  function findNwjs() {
    if (hostOs === 'darwin') {
      binPath = join(nwDir, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    } else if (hostOs === 'win32') {
      binPath = join(nwDir, 'nw.exe');
    } else {
      binPath = join(nwDir, 'nw');
    }
  }

  /**
   * Get the platform dependant path of the ChromeDriver binary.
   */
  function findChromeDriver() {
    binPath = resolve(nwDir, `chromedriver${platform === "win32" ? ".exe" : ""}`);
  }
  
  if (executable === 'nwjs') {
    findNwjs();
  } else if (executable === 'chromedriver') {
    findChromeDriver();
  } else {
    console.error(`[ ERROR ] Expected nwjs or chromedriver, got ${executable}.`);
  }

  return binPath;
}

import process from 'node:process';
import path from 'node:path';

/**
 * Get the platform dependant path of the NW.js or ChromeDriver binary.
 * 
 * @param {'nwjs' | 'chromedriver'} executable Path to NW.js or Chromedriver executable.
 * @return {string}
 */
function findpath(executable = 'nwjs') {
  const nwDir = path.resolve(__dirname, '..', 'nwjs');
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
  let hostOs = process.env.npm_config_nwjs_platform || process.env.NWJS_PLATFORM || process.platform;

  /**
   * Get the platform dependant path of the NW.js binary.
   */
  function findNwjs() {
    if (hostOs === 'darwin') {
      binPath = path.join(nwDir, 'nwjs.app', 'Contents', 'MacOS', 'nwjs');
    } else if (hostOs === 'win32') {
      binPath = path.join(nwDir, 'nw.exe');
    } else {
      binPath = path.join(nwDir, 'nw');
    }
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
  } else {
    console.error(`[ ERROR ] Expected nwjs or chromedriver, got ${executable}.`);
  }

  return binPath;
}

export default { findpath };

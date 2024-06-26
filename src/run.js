import child_process from "node:child_process";
import console from "node:console";
import path from "node:path";
import process from "node:process";

import util from "./util.js";

/**
 * @typedef {object} RunOptions
 * @property {string | "latest" | "stable" | "lts"} [version = "latest"]    Runtime version
 * @property {"normal" | "sdk"}                     [flavor = "normal"]     Build flavor
 * @property {"linux" | "osx" | "win"}              [platform]              Target platform
 * @property {"ia32" | "x64" | "arm64"}             [arch]                  Target arch
 * @property {string}                               [srcDir = "./src"]      Source directory
 * @property {string}                               [cacheDir = "./cache"]  Cache directory
 * @property {boolean}                              [unref = false]         Unref the child process and unblock the caller
 * @property {string[]}                             [args = []]             Command line arguments
 */

/**
 * Run NW.js application.
 *
 * @async
 * @function
 * 
 * @param  {RunOptions}    options  Run mode options
 * @return {Promise<void>}
 */
async function run({
  version = "latest",
  flavor = "normal",
  platform = util.PLATFORM_KV[process.platform],
  arch = util.ARCH_KV[process.arch],
  srcDir = ".",
  cacheDir = "./cache",
  unref = false,
  args = [],
}) {

  try {
    if (util.EXE_NAME[platform] === undefined) {
      throw new Error("Unsupported platform.");
    }

    const nwDir = path.resolve(
      cacheDir,
      `nwjs${flavor === "sdk" ? "-sdk" : ""}-v${version}-${platform}-${arch}`,
    );

    return new Promise((res, rej) => {
      const nwProcess = child_process.spawn(
        path.resolve(nwDir, util.EXE_NAME[platform]),
        [srcDir, ...args],
        { stdio: "inherit" },
      );

      nwProcess.on("close", () => {
        res();
      });

      nwProcess.on("message", (message) => {
        console.log(message);
      });

      nwProcess.on("error", (error) => {
        console.error(error);
        rej(error);
      });

      if (unref) {
        nwProcess.unref();
      }
    });
  } catch (error) {
    console.error(error);
  }
}

export default run;

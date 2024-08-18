import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import * as nw from "../../src/index.js";
import decompress from "../../src/decompress.js";
import util from '../../src/util.js';

describe("get/decompress", async function () {

  let nwFilePath = '';
  let nwDirPath = '';
  let nwOutPath = "./tests/fixture/cache";

  afterAll(async function () {
    await fs.promises.rm(nwOutPath, { recursive: true, force: true });
  });

  beforeAll(async function () {
    nwDirPath = await nw.findpath('all', { flavor: 'sdk' });

    const cacheExists = await util.fileExists(nwOutPath)
    if (!cacheExists) {
      await fs.promises.mkdir(nwOutPath);
    }

    if (process.platform === 'linux') {
      nwFilePath = nwDirPath + '.tar.gz';
    } else {
      nwFilePath = nwDirPath + '.zip';
    }
  });

  it("decompresses a NW.js binary", async function () {
    await decompress(nwFilePath, nwOutPath);
  }, Infinity);

  it.runIf(process.platform === 'darwin')("preserves symlinks on macos", async function () {
    const frameworksPath = path.resolve(process.cwd(), nwOutPath, nwDirPath, "nwjs.app", "Contents", "Frameworks", "nwjs Framework.framework");
    const symlinks = [
      path.join(frameworksPath, "Helpers"),
      path.join(frameworksPath, "Libraries"),
      path.join(frameworksPath, "nwjs Framework"),
      path.join(frameworksPath, "Resources"),
      path.join(frameworksPath, "Versions", "Current"),
    ];

    for (const symlink of symlinks) {
      const stats = await fs.promises.lstat(symlink);
      expect(stats.isSymbolicLink()).toEqual(true);
    }
  });
});

import fs from "node:fs";
import process from "node:process";

import { afterEach, describe, expect, it } from "vitest";

import nw from "../../src/nw.js";
import util from "../../src/util.js";

describe("get/nw", function () {

  let nwFile = '';

  afterEach(function () {
    fs.promises.rm(nwFile, { recursive: true, force: true });
  });

  it("downloades a NW.js Linux tarball or Windows/MacOS zip", async function () {
    nwFile = await nw(
      "https://dl.nwjs.io",
      "0.83.0",
      "sdk",
      util.PLATFORM_KV[process.platform],
      util.ARCH_KV[process.arch],
      "./tests/fixtures"
    );
    expect(util.fileExists(nwFile)).resolves.toBe(true);
  }, Infinity);
});

import fs from "node:fs";
import process from "node:process";

import { afterEach, beforeAll, describe, expect, it } from "vitest";

import ffmpeg from "../../src/ffmpeg.js";
import util from "../../src/util.js";

describe("get/ffmpeg", function () {

  let ffmpegFile = '';

  afterEach(function () {
    fs.promises.rm(ffmpegFile, { recursive: true, force: true });
  });

  beforeAll(async function () {
    await fs.promises.mkdir("./tests/fixture", { recursive: true });
  });

  it("downloades community prebuild FFmpeg for specifc platform", async function () {
    ffmpegFile = await ffmpeg(
      "https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt/releases/download",
      "0.83.0",
      util.PLATFORM_KV[process.platform],
      util.ARCH_KV[process.arch],
      "./tests/fixtures"
    );
    expect(util.fileExists(ffmpegFile)).resolves.toBe(true);
  }, Infinity);
});

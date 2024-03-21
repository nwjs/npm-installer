import fs from "node:fs";

import { afterEach, describe, expect, it } from "vitest";

import request from "./request.js";
import util from "./util.js";

describe("get/request", function () {

  let url = "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"
  const filePath = "./test/fixture/cache/request.test.json";

  afterEach(async function () {
    await fs.promises.rm(filePath, { force: true });
  });

  it("downloads from specific url", async function () {
    await request(url, filePath);
    expect(util.fileExists(filePath)).resolves.toBe(true);
  }, Infinity);
});

import { describe, expect, it } from "vitest";

import request from "../../src/request.js";
import util from "../../src/util.js";

describe.skip("get/request", function () {

  let url = "https://raw.githubusercontent.com/nwutils/nw-builder/main/src/util/osx.arm.versions.json"
  const filePath = "./test/fixture/cache/request.test.json";

  it("downloads from specific url", async function () {
    await request(url, filePath);
    expect(util.fileExists(filePath)).resolves.toBe(true);
  });
}, Infinity);

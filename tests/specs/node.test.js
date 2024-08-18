import fs from "node:fs";

import { afterEach, describe, expect, it } from "vitest";

import node from "../../src/node.js";
import util from "../../src/util.js";

describe("get/node", function () {

  let nodeFile = '';

  afterEach(function () {
    fs.promises.rm(nodeFile, { recursive: true, force: true });
  });

  it("downloades Node headers", async function () {
    nodeFile = await node(
      "https://dl.nwjs.io",
      "0.83.0",
      "./tests/fixtures"
    );
    expect(util.fileExists(nodeFile)).resolves.toBe(true);
  }, Infinity);
});

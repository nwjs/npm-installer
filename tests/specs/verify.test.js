import { describe, expect, it } from "vitest";

import verify from "../../src/verify.js";

describe("get/verify", function () {

  it("verify shasums", { timeout: Infinity }, async function () {
    const status = await verify(
      'https://dl.nwjs.io/v0.90.0/SHASUMS256.txt',
      './shasum/0.90.0.txt',
      '.'
    );
    expect(status).toBe(true);
  });
});

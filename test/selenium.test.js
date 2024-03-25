import assert from "node:assert";
import path from "node:path";

import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { describe, it } from "vitest";

import util from "../src/util.js";

const { Driver, ServiceBuilder, Options } = chrome;

describe("run", async () => {
  let driver = undefined;

  it("should run post install", async () => {
    const options = new Options();
    const args = [
      `--nwapp=${path.resolve("test", "app")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = util.findpath("chromedriver");

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    assert.strictEqual(text, "Hello, World! Is anyone out there?");
  }, { timeout: Infinity });
});

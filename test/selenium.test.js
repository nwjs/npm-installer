import path from "node:path";

import selenium from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import util from "../src/util.js";

describe("run", async function () {
  let driver = undefined;

  beforeAll(async function () {
    const options = new chrome.Options();
    const seleniumArgs = [
      `--nwapp=${path.resolve("test", "app")}`,
      "--headless=new",
    ];

    options.addArguments(seleniumArgs);

    const chromedriverPath = await util.findpath("chromedriver");
    const service = new chrome.ServiceBuilder(chromedriverPath).build();

    driver = chrome.Driver.createSession(options, service);
  });

  it("should run post install", async function () {
    const textElement = await driver.findElement(selenium.By.id('test'));

    const text = await textElement.getText();

    expect(text).toEqual('Hello, World! Is anyone out there?');
  }, { timeout: Infinity });

  afterAll(function () {
    driver.quit();
  });

});
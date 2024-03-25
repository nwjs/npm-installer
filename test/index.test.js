import fs from 'node:fs';
import { expect, test } from 'vitest';

import util from '../src/util.js';

test('nwjs has downloaded and been extracted', function() {
  expect(fs.existsSync(util.findpath())).toBe(true);
});

test('chromedriver does not exist in normal build', function() {
  expect(fs.existsSync(util.findpath('chromedriver'))).toBe(false);
});

import fs from 'node:fs';
import { expect, test } from 'vitest';

import { findpath } from '../src/util.js';

test('nwjs has downloaded and been extracted', function() {
  expect(fs.existsSync(findpath())).toBe(true);
});

test('chromedriver does not exist in normal build', function() {
  expect(fs.existsSync(findpath('chromedriver'))).toBe(false);
});

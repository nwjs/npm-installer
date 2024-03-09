import assert from 'node:assert';
import fs from 'node:fs';
import test from 'node:test';

import { findpath } from '../src/findpath.js';

test('nwjs has downloaded and been extracted', function() {
  assert.strictEqual(fs.existsSync(findpath()), true);
});

test('chromedriver does not exist in normal build', function() {
  assert.strictEqual(fs.existsSync(findpath('chromedriver')), false);
});

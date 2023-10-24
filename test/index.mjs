import { strictEqual } from 'node:assert';
import { existsSync } from 'node:fs';
import test from 'node:test';

import findpath from '../lib/findpath.mjs';

test('nwjs has downloaded and been extracted', function() {
  strictEqual(existsSync(findpath()), true);
});

test('chromedriver does not exist in normal build', function() {
  strictEqual(existsSync(findpath('chromedriver')), false);
});

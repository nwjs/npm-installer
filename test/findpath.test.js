import fs from 'node:fs';
import { expect, test } from 'vitest';

import util from '../src/util.js';

test('nwjs has downloaded and been extracted', function() {
  expect(fs.existsSync(util.findpath())).toBe(true);
});

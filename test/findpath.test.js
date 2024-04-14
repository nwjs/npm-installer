import fs from 'node:fs';
import { expect, test } from 'vitest';

import util from '../src/util.js';

test('nwjs has downloaded and been extracted', async function() {
  const path = await util.findpath();
  expect(fs.existsSync(path)).toEqual(true);
});

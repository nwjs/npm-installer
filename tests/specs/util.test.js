import { expect, test } from 'vitest';

import util from '../../src/util.js';

test('nwjs has downloaded and been extracted', async function () {
  const path = await util.findpath('nwjs', { flavor: 'sdk' });
  expect(util.fileExists(path)).resolves.toEqual(true);
});

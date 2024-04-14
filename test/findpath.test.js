import fs from 'node:fs';
import { expect, test } from 'vitest';

import util from '../src/util.js';

test('nwjs has downloaded and been extracted', function () {
  util.findpath('nwjs').then(function (path) {
    expect(fs.existsSync(path)).toEqual(true);
  })
  .catch((error) => {
    console.log(error);
  });
});

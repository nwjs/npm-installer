import { strictEqual } from 'node:assert';
import { existsSync } from 'node:fs';
import test from 'node:test';

import findpath from '../lib/findpath.mjs';

test('has downloaded and extracted', function() {
  strictEqual(existsSync(findpath()), true);
});

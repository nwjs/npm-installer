const { strictEqual } = require('node:assert');
const { existsSync } = require('node:fs');
const test = require('node:test');

const findpath = require('../lib/findpath.js').findpath;

test('nwjs has downloaded and been extracted', function() {
  strictEqual(existsSync(findpath()), true);
});

test('chromedriver does not exist in normal build', function() {
  strictEqual(existsSync(findpath('chromedriver')), false);
});

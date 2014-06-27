var test = require('tape');
var path = require('path');
var fs = require('fs');
var findpath = require('../lib/findpath.js');

test('has downloaded and extracted', function(t) {
  t.plan(1);
  fs.exists(findpath(), t.ok.bind(t));
});

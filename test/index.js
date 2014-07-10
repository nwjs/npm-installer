var test = require('tape');
var path = require('path');
var fs = require('fs');
var findpath = require('../').findpath;

test('has downloaded and extracted', function(t) {
  t.plan(1);
  fs.exists(findpath(), t.ok.bind(t));
});

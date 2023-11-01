const fs = require('node:fs');

const nodeManifest = require('../package.json');

nodeManifest.version = nodeManifest.version + '-sdk';

fs.writeFileSync('./package.json', JSON.stringify(nodeManifest, null, 2));

const { writeFile } = require('node:fs/promises');

const nodeManifest = require('../package.json');

nodeManifest.version = nodeManifest.version + '-sdk';

await writeFile('./package.json', JSON.stringify(nodeManifest, null, 2));

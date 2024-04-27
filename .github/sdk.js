import fs from 'node:fs';

let nodeManifest = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8'}));

nodeManifest.version = nodeManifest.version + '-sdk';

fs.writeFileSync('./package.json', JSON.stringify(nodeManifest, null, 2));

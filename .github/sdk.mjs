import { writeFile } from 'node:fs/promises';

import nodeManifest from '../package.json' assert { type: 'json' };

nodeManifest.version = nodeManifest.version + '-sdk';

await writeFile('./package.json', JSON.stringify(nodeManifest, null, 2));

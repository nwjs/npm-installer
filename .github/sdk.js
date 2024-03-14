import { writeFileSync } from 'node:fs';

import nodeManifest from '../package.json' assert { type: 'json' };

nodeManifest.version = nodeManifest.version + '-sdk';

writeFileSync('./package.json', JSON.stringify(nodeManifest, null, 2));

import { writeFileSync } from 'node:fs';

import nodeManifest, { version } from '../package.json';

version = version + '-sdk';

writeFileSync('./package.json', JSON.stringify(nodeManifest, null, 2));

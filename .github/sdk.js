import { writeFileSync } from 'node:fs';

import manifest from '../package.json';

manifest.version = manifest.version + '-sdk';

writeFileSync('./package.json', JSON.stringify(manifest, null, 2));

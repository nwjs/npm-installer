import fs from 'node:fs';

import manifest from '../package.json';

manifest.version = manifest.version + '-sdk';

fs.writeFileSync('./package.json', JSON.stringify(manifest, null, 2));

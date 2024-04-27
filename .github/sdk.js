import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
/**
 * @type {fs.PathLike}
*/
const nodeManifestPath = path.resolve(__dirname, '..' ,'package.json');
/**
 * @type {object}
 */
const nodeManifest = JSON.parse(fs.readFileSync(nodeManifestPath), { encoding: 'utf-8' });

nodeManifest.version = nodeManifest.version + '-sdk';

fs.writeFileSync('./package.json', JSON.stringify(nodeManifest, null, 2));

/**
 * Check if file exists at specified path.
 *
 * @param  {string}           filePath  - File path to check existence of
 * @return {Promise<boolean>}           `true` if exists, otherwise `false`
 */
async function fileExists(filePath) {
    let exists = true;
    try {
        await fs.promises.stat(filePath);
    } catch {
        exists = false;
    }
    return exists;
}

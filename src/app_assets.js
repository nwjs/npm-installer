import { readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import { argv } from 'yargs';

// Helper to simulate the shell's "cp" command
function copyFileSync(srcFile, destFile) {
  var content = readFileSync(srcFile);
  writeFileSync(destFile, content);
}

// Copy asset files (specified via process.argv) over to the app binary's folder
export function copyAssets(platform, binPath) {
  // OS X: Save a custom plist file to Contents/Info.plist in the
  // app bundle. This lets you customize things like the app's menubar
  // name and icon (see argv.mac_icon below)
  if (argv.mac_plist && platform === 'darwin') {
    var plistPath = join(binPath, '..', '..', 'Info.plist');
    copyFileSync(argv.mac_plist, plistPath);
  }

  // OS X: Save icon files to the Resources dir in the app bundle.
  // Note that for the icon to work properly you need to point to
  // it with a custom plist file.
  if (argv.mac_icon && platform === 'darwin') {
    var iconName = basename(argv.mac_icon);    // Preserve the file's name
    var iconPath = join(binPath, '..', '..', 'Resources', iconName);
    copyFileSync(argv.mac_icon, iconPath);
  }
}

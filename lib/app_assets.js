var fs = require('fs');
var path = require('path');
var argv = require('yargs').argv;

// Helper to simulate the shell's "cp" command
function copyFileSync(srcFile, destFile) {
  var content = fs.readFileSync(srcFile);
  fs.writeFileSync(destFile, content);
}

// Copy asset files (specified via process.argv) over to the app binary's folder
exports.copyAssets = function copyAssets(platform, binPath) {
  // OS X: Save a custom plist file to Contents/Info.plist in the
  // app bundle. This lets you customize things like the app's menubar
  // name and icon (see argv.mac_icon below)
  if (argv.mac_plist && platform === 'darwin') {
    var plistPath = path.join(binPath, '..', '..', 'Info.plist');
    copyFileSync(argv.mac_plist, plistPath);
  }

  // OS X: Save icon files to the Resources dir in the app bundle.
  // Note that for the icon to work properly you need to point to
  // it with a custom plist file.
  if (argv.mac_icon && platform === 'darwin') {
    var iconName = path.basename(argv.mac_icon);    // Preserve the file's name
    var iconPath = path.join(binPath, '..', '..', 'Resources', iconName);
    copyFileSync(argv.mac_icon, iconPath);
  }
};

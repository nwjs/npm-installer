exports.findpath = () => require('node:child_process').execSync('node -p '+ __dirname + '/findpath.mjs').slice(0,-1).trim();

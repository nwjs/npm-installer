# nw

An npm installer for [NW.js](https://nwjs.io).

[![npm](https://img.shields.io/npm/v/nw)](https://www.npmjs.com/package/nw)

## Install

### Latest version of normal build flavor:

```shell
npm install --save-dev nw
```

### Specific version with changes to installer:

```shell
npm install --save-dev nw@0.85.0-1
```

> You may use `npm view nw versions` to view the list of available versions.

### Specify build flavor:

```shell
npm install --save-dev nw@sdk
```

> Optionally set `nwjs_build_type=sdk` in `.npmrc` or `NWJS_BUILD_TYPE=sdk` environment variable.

### Specify platform:

Set `nwjs_platform` in `.npmrc` or `NWJS_PLATFORM` environment variable. Defaults to `process.platform`.

### Specify architecture:

Set `nwjs_arch` in `.npmrc` or `NWJS_ARCH` environment variable. Defaults to `process.arch`.

### Specify cache directory:

Set `nwjs_cache_dir` in `.npmrc` or `NWJS_ARCH` environment variable. Defaults to `./node_modules/nw`.

### Specify cache flag:

Set `nwjs_cache` in `.npmrc` or `NWJS_ARCH` environment variable to keep or delete cached binaries. Defaults to `true`.

### Specify ffmpeg flag:

Set `nwjs_ffmpeg` in `.npmrc` or `NWJS_ARCH` environment variable to toggle downloading [community FFmpeg binaries](https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt). Defaults to `false`.

### Specify Native Addon flag:

Set `nwjs_native_addon` in `.npmrc` or `NWJS_NATIVE_ADDON` environment variable to toggle downloading NW.js Node headers. Defaults to `false`.

### Specify download URL:

Set `nwjs_urlbase` in `.npmrc`or `NWJS_URLBASE` environment variable. Defaults to `https://dl.nwjs.io`. The file system (`file://`) is also supported (for example, `file:///home/localghost/local_mirror`).

## Usage

Add a script in your `package.json`:

```json
{
  "scripts": {
    "start": "nw /path/to/app"
  }
}
```

Executing `npm start` runs the NW.js app. Omitting the file path makes NW.js check for valid project in current working directory. You can also call `nw` directly from `node_modules/.bin/nw`.

## Command Line Options

There are a few (platform-specific) arguments you can pass to the `nw` executable to customize your nw.js application:

* `--mac_plist <path-to-plist-file>`: (OS X only) Copies the given file to Info.plist in the app
  bundle. This lets you do things like change your app's name and point to a different icon.

* `--mac_icon <path-to-icns-file>`: (OS X only) Copies the given .icns file to the Resources/ dir
  in the app bundle. You will need to point to the file with a custom plist file as well (see
  `--mac_list`)

**NOTE**: These options will keep the copied files in the app bundle for as long as the bundle is
on the filesystem (they're not deleted between app invocations). As a result, they're not
recommended if you installed nw globally using `-g`.  Also note that
[OS X caches these files](http://proteo.me.uk/2011/08/mac-application-bundle-caching/),
so you may need to manually clear these cached files during development.

## APIs

### Find path to the NW.js binary:

``` js
import { findpath } from 'nw';
var path = findpath();
```

## Find the path to the chromedriver binary

``` js
import { findpath } from 'nw';
var path = findpath('chromedriver');
```

## License

[NW.js](https://github.com/nwjs/nw.js)'s code and this installer use the MIT license.

# nw

An npm installer for [NW.js](https://nwjs.io).

[![npm](https://img.shields.io/npm/v/nw)](https://www.npmjs.com/package/nw)

## Install

Please go through the [CHANGELOG](https://github.com/nwjs/npm-installer/blob/main/CHANGELOG.md) carefully and choose the appropriate version. Bug fixes and feature updates are pushed to the repo periodically.

### Latest version globally

```shell
npm install -g nw
```

You might run into issues installing globally. [Learn how to fix this](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)

### Latest version of normal build flavor:

```shell
npm install --save-dev nw
```

### Specific version with changes to installer:

```shell
npm install --save-dev nw@0.96.0
```

> You may use `npm view nw versions` to view the list of available versions.

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

## APIs

### Find path to the NW.js binary:

``` js
import { findpath } from 'nw';
let path = await findpath();
```

## Find the path to the chromedriver binary

``` js
import { findpath } from 'nw';
let path = await findpath('chromedriver', { flavor: 'sdk' });
```

## Download specific versions independant of installer version

```js
import { get } from 'nw';

await get({
  // options
});
```

Options:

| Name | Type    | Default   | Description | CLI Usage | .npmrc Usage | .env Usage | Module Usage |
| ---- | ------- | --------- | ----------- | --------- | ------------ | ---------- | ------------ |
| version | `string \| "latest" \| "stable"` | `"latest"` | Runtime version | `npm install --save-dev nw` | `` | `` | `get({ version: "latest" })` |
| flavor | `"normal" \| "sdk"` | `"normal"` | Runtime flavor | `npm install --save-dev nw@sdk` | `nwjs_build_type=sdk` | `export NWJS_BUILD_TYPE=sdk` | `get({ flavor: "sdk" })` |
| platform | `"linux" \| "osx" \| "win"` | | Host platform | `npm install --save-dev --nwjs-platform nw` | `nwjs_platform=linux` | `NWJS_PLATFORM=linux` | `get({ platform: "linux" })` |
| arch | `"ia32" \| "x64" \| "arm64"` | | Host architecture | `npm install --save-dev --nwjs-arch nw` | `nwjs_arch=x64` | `NWJS_ARCH=x64` | `get({ arch: "x64"})` |
| downloadUrl | `"https://dl.nwjs.io" \| "https://npm.taobao.org/mirrors/nwjs" \| https://npmmirror.com/mirrors/nwjs \| "https://github.com/corwin-of-amber/nw.js/releases/"` | `"https://dl.nwjs.io"` | Download server (https and file system is supported, for eg `file:///home/user/nwjs_cache`) | `npm install --save-dev --nwjs-urlbase=https://dl.nwjs.io` | `nwjs_urlbase=https://dl.nwjs.io` | `NWJS_URLBASE=https://dl.nwjs.io` | `get({ downloadUrl: "https://dl.nwjs.io"})` |
| cacheDir | `string` | `"./node_modules/nw"` | Directory to cache NW binaries | `npm install --save-dev --nwjs-cache-dir ./cache` | `nwjs_cache_dir=./cache` | `NWJS_CACHE_DIR=./cache` | `get({ cacheDir: "./cache" })` |
| cache | `boolean` | `true`| If true the existing cache is used. Otherwise it removes and redownloads it. | `npm install --save-dev --nwjs-cache=true` | `nwjs_cache=true` | `NWJS_CACHE=true` | `get({ cache: true })` |
| ffmpeg | `boolean` | `false`| If true the chromium ffmpeg is replaced by [community version](https://github.com/nwjs-ffmpeg-prebuilt/nwjs-ffmpeg-prebuilt) with proprietary codecs. | `npm install --save-dev --nwjs-ffmpeg=true` | `nwjs_ffmpeg=true` | `NWJS_FFMPEG=true` | `get({ ffmpeg: true })` |
| nodeAddon | `false \| "gyp"` | `false` | Download Node headers | `npm install --save-dev --nwjs-native-addon=true` | `nwjs_native_addon=true` | `NWJS_NATIVE_ADDON=true` | `get({ nativeAddon: true })` |
| unref | `boolean` | `false` | [Prevent the parent process from waiting for a given subprocess](https://nodejs.org/api/child_process.html#subprocessunref). This is useful if you're using `nw` package to call the executable and want to prevent zombie processes eating up memory. | `npm install --save-dev --nwjs-unref=true` | `nwjs_unref=true` | `NWJS_UNREF=true` | `get({ unref: true })` |

## License

[NW.js](https://github.com/nwjs/nw.js)'s code and this installer use the MIT license.

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
npm install --save-dev nw@0.95.0
```

> You may use `npm view nw versions` to view the list of available versions.

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

### Specify unref flag

Set `nwjs_unref` in `.npmrc` or `NWJS_UNREF` environment variable. Default to `false`. This is useful if you're using `nw` package to call the executable and want to prevent zombie processes eating up memory.

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
| platform | `"linux" \| "osx" \| "win"` | | Host platform | `npm install --save-dev --nwjs-platform nw@sdk` | `nwjs_platform=linux` | `NWJS_PLATFORM=linux` | `get({ platform: "linux" })` |
| arch | `"ia32" \| "x64" \| "arm64"` | | Host architecture |
| downloadUrl | `"https://dl.nwjs.io" \| "https://npm.taobao.org/mirrors/nwjs" \| https://npmmirror.com/mirrors/nwjs \| "https://github.com/corwin-of-amber/nw.js/releases/"` | `"https://dl.nwjs.io"` | Download server |
| cacheDir | `string` | `"./cache"` | Directory to cache NW binaries |
| cache | `boolean` | `true`| If true the existing cache is used. Otherwise it removes and redownloads it. |
| ffmpeg | `boolean` | `false`| If true the chromium ffmpeg is replaced by community version with proprietary codecs. |
| nodeAddon | `false \| "gyp"` | `false` | Download Node headers |

## License

[NW.js](https://github.com/nwjs/nw.js)'s code and this installer use the MIT license.

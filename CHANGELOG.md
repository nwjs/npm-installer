# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

## [0.88.0-3]

### Added

- Get file path to NW.js directory. [5b37b6d](https://github.com/nwjs/npm-installer/commit/5b37b6dcb8b1cfd9cc4cfffa516613e6231d00dd)

## [0.88.0-2]

### Changed

- Spawned process inherits stdout and is not detached. [df9fdc3](https://github.com/nwjs/npm-installer/commit/df9fdc3e7cfc4c62550f8ee5464a70b13fd1ce76)

## [0.88.0-1]

### Changed

- Correctly parse the prerelease object. [9802fb8](https://github.com/nwjs/npm-installer/commit/9802fb88753b1943f307a6f9a33a212cf9aae73e)

## [0.88.0]

### Changed

- Upgrade Axios [b63ceaa](https://github.com/nwjs/npm-installer/commit/b63ceaa5bf24239b93f42489fa63dae4cf65a9d8)

## [0.87.0-4]

### Added

- Add `unref` option. See the [Node docs](https://nodejs.org/api/child_process.html#subprocessunref) for more info. [f772c0e](https://github.com/nwjs/npm-installer/commit/f772c0e5516d7b6a6be502d3682a49d67f907687)

## [0.87.0-3]

### Changed

- Simplify prelease detection logic [f35e2f5](https://github.com/nwjs/npm-installer/commit/f35e2f53932d89c8fe4c569367cb04e310e25bd7)

## [0.87.0-2]

### Changed

- Close zip file after reading all entries [5c481a7](https://github.com/nwjs/npm-installer/commit/5c481a75e7446d6c01bd4146ad46e218edb89fb9)

## [0.87.0-1]

### Changed

- Set default cache using __dirname [601911f](https://github.com/nwjs/npm-installer/commit/601911fbb374fd01b07fa138718b0d7d2751fc51)

- Pass CLI args to NW.js process. [e5d6fb1](https://github.com/nwjs/npm-installer/commit/e5d6fb18a291f30a318dc0df5806e69a6f83ea9b)

## [0.87.0]

### Changed

- Allow passing unknown options to `nw` via `commander` acting as parser. [466494a](https://github.com/nwjs/npm-installer/commit/466494adbf3894210d753cc3d59050ae3c4d8d0c)

## [0.86.0-3]

### Changed

- `findpath` looks for actual path and not symlink. On Windows, if user does not have Administrator privileges, symlink is not created, then `findpath` fails to find the file path. `findpath` is async with return type `Promise<string>` and has a secondary options argument. This is useful when you have multiple binaries. Here's an example of how to get the file path to ChromeDriver. [75a9fc0](https://github.com/nwjs/npm-installer/commit/75a9fc02a2aeb91fc1a7b49700fb9617ff3c020b)

```js
const nwPath = await findpath('chromedriver', { flavor: 'sdk' });
```

## [0.86.0-2]

### Changed

- Correct default path to NW.js binary

## [0.86.0-1]

### Changed

- Fix module import.

## [0.86.0]

### Changed

- Fix undefined `version` in parsing logic.

## [0.85.0-4]

### Added

- Allow user to run specific binaries by specifing version, flavor, platform, arch and cacheDir options via CLI.

### Changed

- Fix run mode and remove workaround for disappearing Node manifest.

### Removed

- mac_plist and mac_icon CLI options.

## [0.85.0-3]

### Changed

- Publish `sdk` version first.

## [0.85.0-2]

### Added

- Re-add support for `file://` which had been accidently removed in the previous release.
- Expose `get` function as public API

```js
import { get } from 'nw';

await get({
  // options
});
```

## [0.85.0-1]

### Added

- Option to specify cache directory by setting `nwjs_cache_dir` in `.npmrc` or `NWJS_CACHE_DIR` as ENV variable. Defaults to `./node_modules/nw`.

- Option to customise caching behaviour by enabling/disabling `nwjs_cache` in `.npmrc` or `NWJS_CACHE` as ENV variable. Defaults to `false`.

- Option to download community ffmpeg by enabling/disabling `nwjs_ffmpeg` in `.npmrc` or `NWJS_FFMPEG` as ENV variable. Defaults to `false`.

- Option to download NW.js Node headers by enabling/disabling `nwjs_native_addon` in `.npmrc` or `NWJS_NATIVE_ADDON` as ENV variable. Defaults to `false`.

### Changed

Switch from CJS to ESM.

ESM import:

```javascript
import { findpath } from 'nw';
```

Previous CJS import:

```javascript
    const { findpath } = require('nw');
```

Current CJS import:

```javascript
    let nw;
    import('nw').then(object => {
        nw = object;
    });
```

### Removed

- CJS support.
- `compressing` package.
- `cli-progress` package.

## [0.85.0]

## Changed

- Handle error when trying to create symlink on Windows as non-Administrator [aca09ab](https://github.com/nwjs/npm-installer/commit/aca09abbd315fc87c6c4f813748aa4a5898bbda7)
- Symlink `nwjs` directory to `nwjs-VERSION-PLATFORM-ARCH` directory [adc6d88](https://github.com/nwjs/npm-installer/commit/adc6d88cc3ed3fcf79d30278f99b7440f8961ead)

## [0.81.0-3]

### Changed

- Append `-sdk` to version for SDK releases. [08785c3](https://github.com/nwjs/npm-installer/commit/08785c36d7df9878439a6e3d0de4273bf220216f)

## [0.81.0-2]

### Changed

- Correctly decompress files post download. [#122](https://github.com/nwjs/npm-installer/pull/122)

## [0.81.0-1]

### Added

- Detect ChromeDriver path [#115](https://github.com/nwjs/npm-installer/pull/115)

### Changed

- Refactor install script [#115](https://github.com/nwjs/npm-installer/pull/115)
- Do not pin Node version in `package.json`. [#106](https://github.com/nwjs/npm-installer/pull/106)

## 0.79.0

### Changed

- Update `merge` dependency [#95](https://github.com/nwjs/npm-installer/pull/95)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

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

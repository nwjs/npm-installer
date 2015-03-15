# nw [![Build Status](http://img.shields.io/travis/nwjs/npm-installer.svg)](https://travis-ci.org/nwjs/npm-installer)

An installer for [nw.js](https://github.com/nwjs/nw.js).

> nw.js is an app runtime based on Chromium and io.js. For building desktop applications that will run on OSX, Windows and Linux.

[![NPM](https://nodei.co/npm/nw.png?downloads=true)](https://nodei.co/npm/nw/)

## usage
Install locally to your project with: `npm install nw` and then in your `package.json` add a script:

```json
{
  "scripts": {
    "start": "nw"
  }
}
```

Now it will run your local project when you type `npm start`.

If your project is in another folder, add the path to the project `"start": "nw path/to/app"`.

You could also call the binary directly with `node_modules/.bin/nw` instead of adding to your `package.json`.

### global
You can also install globally with `npm install nw -g` and then in any project type `nw` to run the project. Installing locally is recommended though as each project can have its own dependent version of nw.js.

## example
If you want a really quick example try this:

1. `git clone https://github.com/zcbenz/nw-sample-apps && cd nw-sample-apps`
2. `npm init`
3. `npm install nw`
4. `"node_modules/.bin/nw" file-explorer`

and now you should see a file explorer demo app.

## command line options
There are a few (platform-specific) arguments you can pass to the `nw` executable to
customize your nw.js application:

* `--mac_plist <path-to-plist-file>`: (OS X only) Copies the given file to Info.plist in the app
  bundle. This lets you do things like change your app's name and point to a different icon.

* `--mac_icon <path-to-icns-file>`: (OS X only) Copies the given .icns file to the Resources/ dir
  in the app bundle. You will need to point to the file with a custom plist file as well (see
  `--mac_list`)

**NOTE**: These options will keep the copied files in the app bundle for as long as the bundle is
on the filesystem (they're not deleted between app invocations). As a result, they're not
recommended if you installed nwjs globally using `-g`.  Also note that
[OS X caches these files](http://proteo.me.uk/2011/08/mac-application-bundle-caching/),
so you may need to manually clear these cached files during development.

## install a specific version of nw.js

To install a specific version of nw.js use npm with the specific version: `npm install nw@0.12.0`

> *Please note:* This npm package version tracks the version of nw.js that will be installed, with an additional build number that is used for revisions to the installer. As such `0.12.0-1` and `0.12.0-2` will both install `nw.js@0.12.0` but the latter has newer changes to the installer.

You may use `npm view nw versions` to view the list of available versions.

## finding the path to the nw.js binary

If you would like to programmatically retrieve the path to the nw.js binary use:

``` js
var findpath = require('nw').findpath;
var nwpath = findpath();
// nwpath will equal the path to the binary depending on your environment
```

## retrieve binaries from custom download location or file path

The installer attempts to download binaries from the default location of `http://dl.nwjs.io/v`. You can override this by setting the npm config property `nwjs_urlbase` on the command line by passing the `--nwjs_urlbase` option:

``` shell
npm install nwjs --nwjs_urlbase=http://my.own.location/somewhere
```

or adding it to your `.npmrc` file (https://www.npmjs.org/doc/files/npmrc.html):

```
nwjs_urlbase=http://my.own.location/somewhere
```

You can alternatively set an environment variable `NWJS_URLBASE`:

``` shell
export NWJS_URLBASE=http://my.own.location/somewhere
```

The installer supports `file://` URLs to retrieve files from the local filesystem:

``` shell
export NWJS_URLBASE=file:///home/bilbo/my/own/mirror
```

## using a proxy with or without authentication

If you are behind a proxy server you have to set an environment variable ```http_proxy``` with proxy servers url:

```
export http_proxy="http://username:password@myproxy.com:8080"
```

or

```
export http_proxy="http://myproxy.com:8080"
```

## license
[nw.js](https://github.com/rogerwang/nw.js)'s code and this installer use the MIT license.

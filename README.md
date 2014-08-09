# nodewebkit [![Build Status](http://img.shields.io/travis/shama/nodewebkit.svg)](https://travis-ci.org/shama/nodewebkit)

An installer for [node-webkit](https://github.com/rogerwang/node-webkit).

> node-webkit is an app runtime based on Chromium and node.js. For building desktop applications that will run on OSX, Windows and Linux.

[![NPM](https://nodei.co/npm/nodewebkit.png?downloads=true)](https://nodei.co/npm/nodewebkit/)

## usage
Install locally to your project with: `npm install nodewebkit` and then in your `package.json` add a script:

```json
{
  "scripts": {
    "start": "nodewebkit"
  }
}
```

Now it will run your local project when you type `npm start`.

If your project is in another folder, add the path to the project `"start": "nodewebkit path/to/app"`.

You could also call the binary directly with `node_modules/.bin/nodewebkit` instead of adding to your `package.json`.

### global
You can also install globally with `npm install nodewebkit -g` and then in any project type `nodewebkit` to run the project. Installing locally is recommended though as each project can have its own dependent version of node-webkit.

## example
If you want a really quick example try this:

1. `git clone https://github.com/zcbenz/nw-sample-apps && cd nw-sample-apps`
2. `npm install nodewebkit`
3. `node_modules/.bin/nodewebkit file-explorer`

and now you should see a file explorer demo app.

## command line options
There are a few (platform-specific) arguments you can pass to the `nodewebkit` executable to
customize your node-webkit application:

* `--mac_plist <path-to-plist-file>`: (OS X only) Copies the given file to Info.plist in the app
  bundle. This lets you do things like change your app's name and point to a different icon.

* `--mac_icon <path-to-icns-file>`: (OS X only) Copies the given .icns file to the Resources/ dir
  in the app bundle. You will need to point to the file with a custom plist file as well (see
  `--mac_list`)

**NOTE**: These options will keep the copied files in the app bundle for as long as the bundle is
on the filesystem (they're not deleted between app invocations). As a result, they're not
recommended if you installed nodewebkit globally using `-g`.  Also note that
[OS X caches these files](http://proteo.me.uk/2011/08/mac-application-bundle-caching/),
so you may need to manually clear these cached files during development.

## install a specific version of node-webkit

To install a spcific version of node-webkit use npm with the specific version: `npm install nodewebkit@0.9.2`

> *Please note:* This npm package version tracks the version of node-webkit that will be installed, with an additional build number that is used for revisions to the installer. As such `0.9.2-1` and `0.9.2-2` will both install `node-webkit@0.9.2` but the latter has newer changes to the installer.

## finding the path to the node-webkit binary

If you would like to programmatically retrieve the path to the node-webkit binary use:

``` js
var findpath = require('nodewebkit').findpath;
var nwpath = findpath();
// nwpath will equal the path to the binary depending on your environment
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
[node-webkit](https://github.com/rogerwang/node-webkit)'s code and this installer use the MIT license.

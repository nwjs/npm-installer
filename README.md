# nodewebkit

An installer for [node-webkit](https://github.com/rogerwang/node-webkit).

> node-webkit is an app runtime based on Chromium and node.js. For building desktop applications that will run on OSX, Windows and Linux.

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
You can also install globally with `npm install nodewebkit -g` and then in any project type `nodewebkit` to run the project. Installing locally is recommended though as each project can have it's own dependent version of node-webkit.

## example
If you want a really quick example try this:

1. `git clone https://github.com/zcbenz/nw-sample-apps && cd nw-sample-apps`
2. `npm install nodewebkit`
3. `node_modules/.bin/nodewebkit file-explorer`

and now you should see a file explorer demo app.

## license
[node-webkit](https://github.com/rogerwang/node-webkit)'s code and this installer use the MIT license.

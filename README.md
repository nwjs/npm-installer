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

Now it will run your local project when you type `npm start`. If your project is in another folder do `"start": "nodewebkit path/to/app"`.

You could also just do `./node_modules/.bin/nodewebkit` if you didn't want to add the script to your `package.json`.

### global
You can also install globally with `npm install nodewebkit -g` and then in any project type `nodewebkit` to run the project. Installing locally is recommended though as each project can have it's own dependent version of node-webkit.


## license
[node-webkit](https://github.com/rogerwang/node-webkit)'s code and this installer use the MIT license.

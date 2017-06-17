# IPFSWebpackPlugin
> Creates additional webpack assets for loading the assets via IPFS in the browser

IPFSWebpackPlugin is a plugin for webpack that makes it easy for you to load
your generated assets via IPFS. It comes with a loader you can use instead
of loading assets directly, and your assets will be loaded via the IPFS
network instead.

## Table of Contents

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Security

IPFS provides content-addressing and IPFSWebpackPlugin embeds the hash directly
in the source code, meaning that your application will for sure be the right
thing loaded from the network.

IPFSWebpackPlugin does make use of `eval` which executes the JavaScript received
from IPFS.

## Background

IPFSWebpackPlugin was created to make the creation and loading of IPFS-powered
applications as easy as possible. 

It was created as one possible solution to https://github.com/ipfs/js-ipfs/issues/127

## Install

- Install with npm/yarn/your favorite node module manager
    - `npm install ipfs-webpack-plugin` / `yarn add ipfs-webpack-plugin`
- Incluide in your webpack configuration

```
const IPFSWebpackPlugin = require('ipfs-webpack-plugin')
// ...
plugins: [new IPFSWebpackPlugin()]
```

Replace the lines where you import your webpack assets with the following:

```
<script src="dist/loader.js"></script>
<script src="dist/ipfs.js"></script>
```

`loader.js` should be loaded before `ipfs.js` as the loader will show the spinner and wait
for IPFS to be included, unless a `Ipfs` instance already exists on the page.

A full example can be seen by looking at the following files:

- `webpack.config.js` < webpack configuration using IPFSWebpackPlugin
- `application.js` < Tiny react application demonstration everything works
- `index.html` < HTML file loading `loader.js` and `ipfs.js`, ends up loading the React application above

A full example can be seen in the file `webpack.config.js` in this repository

### Configuration

**NOT YET IMPLEMENTED**

You can provide options for the IPFS nodes used by IPFSWebpackPlugin (the loader + compiler)

```
plugins: [new IPFSWebpackPlugin({
    compilerNode: {/* ipfs options */} // defaults to js-ipfs defaults
    loaderNode: {/* ipfs options */} // defaults to js-ipfs defaults
    spinner: true|false // defaults to true
})]
```

## How it works?

- When including the plugin in your webpack configuration, it starts listening for emission of assets and for compilation to be done
- Once emission starts, it adds `loader.js` and `ipfs.js` to the outputted assets, so it's included in your build
- Once compilation is done, it adds your assets to IPFS and modifies the outputted `loader.js` to include the hash for your application
- When the application is then loaded in the browser, `loader.js` waits for a ipfs node to be available and then loads the application based on the hash
- Finally, when the contents have been fully loaded, it calls `eval` with the application source, executing the code from your build

And now you have your assets loaded from IPFS directly in the browser :)

## Contribute

Contributions are highly welcome! Take a look at the issues and write a message if you have any questions.

PRs are always welcome but recommended to open a issue discussing the planned contribution before.

## License

[MIT 2017 Victor Bjelkholm](./LICENSE)

const path = require('path')
const fs = require('fs')
const IPFS = require('ipfs')

// TODO - doesn't exit properly, ipfs node is keeping process running?
// TODO - get to work in Chrome "Uncaught RangeError: Array buffer allocation failed"

function IPFSWebpackPlugin (options) {
  // TODO allow to inject build-ipfs-node options and loader-ipfs-node options
  // TODO allow disabling the spinner
}

function addFile (pathToAdd, transform) {
  const fullPath = path.resolve(__dirname, pathToAdd)
  return {
    source: function () {
      return fs.readFileSync(fullPath)
    },
    size: function () {
      return fs.statSync(fullPath).size
    }
  }
}

IPFSWebpackPlugin.prototype.apply = function (compiler) {
  // Here the compiler beings emitting assets, add our loader + ipfs node
  compiler.plugin('emit', (params, callback) => {
    params.assets['loader.js'] = addFile('loader.js')
    params.assets['ipfs.js'] = addFile('ipfs.js')
    callback()
  })
  // The compiler is done with all generatation, time to modify the loader with the correct hash
  // TODO should handle all assets, currently just one
  compiler.plugin('done', (stats) => {
    const { outputOptions } = stats.compilation
    const fileToAdd = path.resolve(outputOptions.path, outputOptions.filename)
    const node = new IPFS({
      repo: path.resolve(__dirname, '.ipfs-repo')
    })
    node.on('ready', () => {
      node.files.add(fs.readFileSync(fileToAdd), (err, res) => {
        if (err) return callback(err)
        const { hash, size } = res[0]
        // Replace hash in loader to the one for the asset
        const fileToReplaceIn = path.resolve(outputOptions.path, 'loader.js')
        const file = fs.readFileSync(fileToReplaceIn).toString()
        const fileReplaced = file.replace('__replaced_hash__', hash)
        fs.writeFileSync(fileToReplaceIn, fileReplaced)
      })
    })
    node.on('error', (err) => {
      throw err
    })
  })
}

module.exports = IPFSWebpackPlugin
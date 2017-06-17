// Styling for loading spinner
const spinnerCSS = `.spinner {
  width: 40px;
  height: 40px;
  background-color: #333;
  opacity: 0.5;

  margin: 0 auto;
  -webkit-animation: sk-rotateplane 2.0s infinite ease-in-out;
  animation: sk-rotateplane 2.0s infinite ease-in-out;
}

.spinner-container {
  position: absolute;
  top: 10px;
  right: 10px;
}

@-webkit-keyframes sk-rotateplane {
  0% { -webkit-transform: perspective(120px) }
  50% { -webkit-transform: perspective(120px) rotateY(180deg) }
  100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
}

@keyframes sk-rotateplane {
  0% { 
    transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg) 
  } 50% { 
    transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg) 
  } 100% { 
    transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
  }
}`
// Here we're creating and adding the spinner
// TODO should be remoavable with plugin options
const node = document.createElement('style')
node.innerHTML = spinnerCSS
document.body.appendChild(node)

const spinner = document.createElement('div')
spinner.setAttribute('class', 'spinner')

const spinnerContainer = document.createElement('div')
spinnerContainer.setAttribute('class', 'spinner-container')

spinnerContainer.appendChild(spinner)
document.body.appendChild(spinnerContainer)

function log (msg) {
  console.log('[IPFS-Loader]', msg)
}

function bootstrap (hash, timeout) {
  if (typeof Ipfs === 'undefined') {
    log('Did not find global IPFS yet, trying again in ' + timeout / 1000 + ' second')
    return setTimeout(() => bootstrap(hash, timeout * 2), timeout)
  }
  const node = new Ipfs()
  node.on('ready', () => {
    spinner.style.animationDuration = '1s'
    // TODO should only happen if running in dev-mode
    node.swarm.connect('/ip4/127.0.0.1/tcp/4003/ws/ipfs/Qmev5eJKon6YE2Eqs46e9HpmtBRjXfH9FvF4px2kCkEzMp', (err) => {
      if (err) {
        log('failed connecting to local node')
        log(err)
      }
    })
    log('Starting load of application ' + hash)
    console.time('application-load')
    node.files.cat(hash, (err, res) => {
      const contents = []
      log('Got contents stream')
      res.on('data', (data) => {
        log('Got data from stream')
        contents.push(data.toString())
      })
      res.on('end', () => {
        log('Stream finished, executing contents')
        console.timeEnd('application-load')
        const fullContents = contents.join('')
        spinnerContainer.remove()
        console.time('application-eval')
        // eval is not the greatest, but at least we're sure we got the right content :)
        window.eval(fullContents)
        console.timeEnd('application-eval')
      })
    })
  })
}
// This string will be replaced with the hash of the application we're trying to load
bootstrap('__replaced_hash__', 100)
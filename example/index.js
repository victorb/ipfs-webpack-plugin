// This is just a tiny test application that would display a simple React application
// Trying to keep it simple so no ES6 nor JSX
const React = require('react')
const ReactDOM = require('react-dom')

const Clicker = React.createClass({
  getInitialState: function () {
    return {clicks: 0}
  },
  onClick: function() {
    this.setState({ clicks: this.state.clicks + 1 })
  },
  render: function() {
    return React.createElement('button', { onClick: this.onClick }, `Clicks: ${this.state.clicks}`)
  }
})

const Application = React.createClass({
  render: function() {
    return React.createElement('div', null, ['Hello from a IPFS-loaded React application.', React.createElement(Clicker)])
  }
})

ReactDOM.render(React.createElement(Application), document.getElementById('root'))

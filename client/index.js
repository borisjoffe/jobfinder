'use strict'

// import _ from 'lodash'
// import React from 'react'
const ReactDOM = require('react-dom')
const h = require('react-hyperscript')

if (module.hot) {
	module.hot.accept()
}

const App = (/* props */) => {
	return h('div', [
		h('span', 'Hello World'),
	])
}

ReactDOM.render(h(App), document.getElementById('app'))

module.exports = App

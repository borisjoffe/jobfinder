'use strict'

if (module.hot) {
	module.hot.accept()
}

const _ = require('lodash')

require('../util')

const React = require('react')
const ReactDOM = require('react-dom')
const h = require('react-hyperscript')

const { JobsView } = require('./JobsView')()


const data = {
	// TODO: get from server
	jobs: require('../data/jobs.db.json'),
	// jobs: [],
}

const state = {
	searchTerm: ''
}

const actions = {
	jobs: {  // namespace
		onFilterChange,
	},
}

const APP = {
	data,
	state,
	actions,

}

function onFilterChange(e) {
	//jshint validthis:true
	this.setState({
		searchTerm: e.target.value
	})
}


/**
 * Recursively bind all the object's methods (at any depth)
 * to the specified thisArg
 */
function bindAllTo(thisArg, obj) {
	Object.keys(obj).map(key => {
		var val = obj[key]
		if (typeof val === 'function')
			obj[key] = val.bind(thisArg)
		else if (typeof val === 'object')  // go deeper
			obj[key] = bindAllTo(thisArg, val)
	})

	return obj
}

class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = APP.state

		this.actions = bindAllTo(this, actions)
		// this.onFilterChange = onFilterChange.bind(this)
	}

	render() {
		return h(JobsView, {
			data: _.cloneDeep(APP.data),  // TODO: use immutable data structure
			state: this.state,
			actions: this.actions,
		})
	}
}



ReactDOM.render(h(App), document.getElementById('app'))

module.exports = JobsView

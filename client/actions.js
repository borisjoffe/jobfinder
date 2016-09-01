'use strict'

exports.onFilterChange = function onFilterChange(e) {
	this.setState({
		searchTerm: e.target.value
	})
}

exports.onPrioritize = function onPrioritize(e) {
	this.setState({ _priority: e.target.value })
}

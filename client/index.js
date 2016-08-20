'use strict'

if (module.hot) {
	module.hot.accept()
}

require('./util')

// const _ = require('lodash')
const React = require('react')
const ReactDOM = require('react-dom')
const h = require('react-hyperscript')
// const classnames = require('classnames')

const APP = {
	// TODO: get from server
	jobs: require('../data/jobs.db.json'),
	// jobs: [],
}

const unsafeHtmlProp = (htmlStr) => {
	return { dangerouslySetInnerHTML: {__html: htmlStr}}
}

const SearchBar = (props) => {
	var searchTerm = props.filter

	return h('input', {
		type: 'text',
		placeholder: 'Search jobs',
		value: searchTerm ? searchTerm : '',
		onChange: props.onFilterChange,
	})
}

const Jobs = (props) => {
	var jobs = APP.jobs.items

	return h('ul', [
		jobs.map((job, key) => h(UpworkJob, {job, key, filter: props.filter})),
	])
}

const hasUppercase = (str) => {
	return Array.from(str).reduce((_, c) => {
		if (c.toUpperCase() === c)
			return true
	}, false)
}

// smartcase search
const filterJob = (job, filter) => {
	if (!filter)
		return true

	var desc = job.description
	  , title = job.title

	// case-insensitive search
	if (!hasUppercase(filter)) {
		desc = desc.toLowerCase()
		title = title.toLowerCase()
	}

	if (typeof filter === 'string')
		return desc.includes(filter) || title.includes(filter)

	else
		throw new TypeError('(filterJob) filter must be string' +
		' but was:' + filter)
}

const UpworkJob = (props) => {
	var job = props.job

	// TODO: make hidden or return null???
	if (!filterJob(job, props.filter))
		return null
	// var hidden = !filterJob(job, props.filter)

	return h('li', /* { className: classnames({hidden}) } ,*/ [
		h('div', {title: Object.keys(job)}, job.title),
		h('div', job.date),
		h('div', unsafeHtmlProp(job.description)),
	])
}

function onFilterChange(e) {
	//jshint validthis:true
	this.setState({
		filter: e.target.value
	})
}

class JobsList extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			filter: ''
		}

		this.onFilterChange = onFilterChange.bind(this)
	}

	render() {
		return h('div', [
			h('h1', 'Jobs'),
			h(SearchBar, {filter: this.state.filter, onFilterChange: this.onFilterChange}),
			h(Jobs, {filter: this.state.filter}),
		])
	}
}

ReactDOM.render(h(JobsList), document.getElementById('app'))

module.exports = JobsList

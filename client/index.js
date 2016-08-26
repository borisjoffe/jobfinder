'use strict'

if (module.hot) {
	module.hot.accept()
}

require('../util')

const _ = require('lodash')
const React = require('react')
const ReactDOM = require('react-dom')
const h = require('react-hyperscript')
const t = require('tcomb')
// const classnames = require('classnames')

const APP = {
	// TODO: get from server
	jobs: require('../data/jobs.db.json'),
	// jobs: [],
}

const unsafeHtmlProp = (htmlStr) => {
	return { dangerouslySetInnerHTML: {__html: htmlStr}}
}

const SearchBar = ({ searchTerm, onFilterChange }) => {
	t.String(searchTerm)

	return h('input', {
		type: 'text',
		placeholder: 'Search jobs',
		value: searchTerm ? searchTerm : '',
		onChange: onFilterChange,
	})
}

const JobsList = (props) => {
	var jobs = props.jobs

	return h('ul', [
		jobs.map((job, key) => h(Job, {job, key})),
	])
}

const hasUppercase = (str) => {
	return Array.from(str).reduce((_, c) => {
		if (c.toUpperCase() === c)
			return true
	}, false)
}

// smartcase search
const filterJob = (filter, job) => {
	t.String(filter)

	if (!filter)
		return true

	var { desc, title } = job

	// case-insensitive search
	if (!hasUppercase(filter)) {
		desc = desc.toLowerCase()
		title = title.toLowerCase()
	}

	if (typeof filter === 'string')
		return desc.includes(filter) || title.includes(filter)

	// TODO: add RegExp option for filter
}

const Job = ({ job }) => {
	return h('li', [
		h('div', {title: Object.keys(job)}, job.title),
		h('div', job.date),
		h('div', unsafeHtmlProp(job.desc)),
	])
}

function onFilterChange(e) {
	//jshint validthis:true
	this.setState({
		searchTerm: e.target.value
	})
}

class JobsView extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			searchTerm: ''
		}

		this.onFilterChange = onFilterChange.bind(this)
	}

	render() {
		var searchTerm = this.state.searchTerm

		var jobs = APP.jobs.items
		var filteredJobs = jobs
			.filter(_.curry(filterJob)(searchTerm))

		return h('div', [
			h('h1', 'Jobs'),
			h(SearchBar, {searchTerm, onFilterChange: this.onFilterChange}),
			h('span', `Showing  ${filteredJobs.length} / ${jobs.length} jobs`),
			h(JobsList, { jobs: filteredJobs }),
		])
	}
}

ReactDOM.render(h(JobsView), document.getElementById('app'))

module.exports = JobsView

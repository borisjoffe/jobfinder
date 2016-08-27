'use strict'

const _ = require('lodash')
const h = require('react-hyperscript')
const t = require('tcomb')
const moment = require('moment')

const JobsView = (props) => {
	var { data, state, actions } = props

	var searchTerm = state.searchTerm

	var jobs = data.jobs.items
	var _order = data.jobs._order

	// creates array from jobs object
	var filteredJobs = _.filter(jobs, _.curry(filterJob)(searchTerm))

	return h('div', [
		h('h1.jobs-title', 'Jobs'),
		h('.jobs-search-component', [
			h(SearchBar, {searchTerm, onFilterChange: actions.jobs.onFilterChange}),
			h('span.jobs-shown', `Showing ${filteredJobs.length} / ${_order.length} jobs`),
		]),
		h(JobsList, { jobs: filteredJobs }),
	])

}


const JobsList = (props) => {
	var jobs = props.jobs

	return h('.jobs-list', [
		jobs.map((job, key) => h(Job, {job, key})),
	])
}


const Job = ({ job }) => {
	var jobDate = moment(job.date, moment.ISO_8601)

	return h('.job-item', [
		h('.job-title', {title: Object.keys(job)}, job.title),
		h('.job-date', { title: jobDate.toLocaleString() },
			'Posted ' + jobDate.fromNow()),
		h('.description', unsafeHtmlProp(job.desc)),
	])
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

const hasUppercase = (str) => {
	return Array.from(str).reduce((_, c) => {
		if (c.toUpperCase() === c)
			return true
	}, false)
}

const unsafeHtmlProp = (htmlStr) => {
	return { dangerouslySetInnerHTML: {__html: htmlStr}}
}


module.exports = function () {
	return {
		JobsView
	}
}

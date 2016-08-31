'use strict'

const _ = require('lodash')
const h = require('react-hyperscript')
const t = require('tcomb')
const moment = require('moment')

const u = require('../util')()
const cn = u.classnames

const MAX_DISPLAYED_JOBS = 10

const JobsView = (props) => {
	var { data, state, actions } = props

	var searchTerm = state.searchTerm

	var jobs = data.jobs.items
	var _order = data.jobs._order

	// creates array from jobs object
	var filteredJobs = _.filter(jobs, _.curry(filterJob)(searchTerm))
	var numFilteredJobs = filteredJobs.length
	var displayedJobs = filteredJobs
		.slice(0, MAX_DISPLAYED_JOBS)

	return h('div', [
		h('h1.jobs-title', 'Jobs'),
		h('.jobs-search-component', [
			h(SearchBar, {searchTerm, onFilterChange: actions.jobs.onFilterChange}),
			h('span.jobs-filtered', `${numFilteredJobs} / ${_order.length} jobs`),
		]),
		h(JobsList, { jobs: displayedJobs, selectedJobIdx: state.selectedJobIdx }),
	])

}


const JobsList = (props) => {
	var { jobs, selectedJobIdx } = props


	return h('.jobs-list',  [
		jobs.map((job, idx) => h(Job, {job, key: idx, selected: selectedJobIdx === idx})),
	])
}


const Job = ({ job, selected }) => {
	var jobDate = moment(job.date, moment.ISO_8601)

	if (selected)
		u.log('selected')

	return h('.job-item', cn({'job-selected': selected}),
		[ h('.left.job-title', {title: Object.keys(job)}, job.title)
		, h(Priority, { priority: job._priority })
		, h('.job-date', { title: jobDate.toLocaleString() }
			, 'Posted ' + jobDate.fromNow())
		, h('.description', unsafeHtmlProp(job.desc))
	])
}

// function setPriority(priority) {
// 	this.setState({_priority: priority})
// }

/**
 * Priority must be 1 (low), 2 (med), 3 (high), or falsy
 */
const Priority = ({ priority }) => {
	const priorityArr = ['low', 'med', 'high']
	const priorityCssSuffix = priorityArr[priority] || 'none'

	return h('.right' + '.priority-' + priorityCssSuffix, [
		h('span',
			{ title: 'Priority: ' + priority
			, name: 'priority'
		},
		[ h('button.priority-none', cn({'priority-selected': priorityCssSuffix === 'none'}),  'none')
		, h('button.priority-low', cn({'priority-selected': priorityCssSuffix === 'low'}), 'low')
		, h('button.priority-med', cn({'priority-selected': priorityCssSuffix === 'med'}), 'med')
		, h('button.priority-high', cn({'priority-selected': priorityCssSuffix === 'high'}), 'high')
		]
		)
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

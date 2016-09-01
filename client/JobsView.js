'use strict'

const _ = require('lodash')
const h = require('react-hyperscript')
const t = require('tcomb')
const moment = require('moment')
const classnames = require('classnames')

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
		h(JobsList,
			{ jobs: displayedJobs
			, selectedJobIdx: state.selectedJobIdx
			, onPrioritize: actions.jobs.onPrioritize
			}),
	])

}


const JobsList = (props) => {
	var { jobs, selectedJobIdx, onPrioritize } = props


	return h('.jobs-list',  [
		jobs.map((job, idx) =>
			h(Job,
				{ job
				, key: idx
				, selected: selectedJobIdx === idx
				, onPrioritize
				})),
	])
}


const Job = ({ job, selected }) => {
	var jobDate = moment(job.date, moment.ISO_8601)

	if (selected)
		u.log('selected')

	return h('.job-item', cn({'job-selected': selected}),
		[ h('.left.job-title',
			{ title: u.pretty(job)
			}
			, job.title)

		, h(Priority,
			{ priority: job._priority
			})

		, h('.clearfix')

		, h('.job-date',
			{ title: jobDate.toLocaleString()
			}
			, 'Posted ' + jobDate.fromNow())

		, h('.description',
			unsafeHtmlProp(job.desc))
	])
}

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
		['none'].concat(priorityArr)
			.map(priority =>
				h(PriorityButton, {priority, selectedPriority: priorityCssSuffix})
			)
		)
	])
}

const PriorityButton = ({ priority, selectedPriority }) => {
	return h('button.priority-' + priority,
		{ className: classnames({'priority-selected': (selectedPriority === priority)})
		, value: priority }
	, priority)
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

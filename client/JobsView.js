'use strict'

const _ = require('lodash')
const h = require('react-hyperscript')
const t = require('tcomb')

const JobsView = (props) => {
	var { data, state, actions } = props

	var searchTerm = state.searchTerm

	var jobs = data.jobs.items
	var filteredJobs = jobs
		.filter(_.curry(filterJob)(searchTerm))

	return h('div', [
		h('h1', 'Jobs'),
		h(SearchBar, {searchTerm, onFilterChange: actions.jobs.onFilterChange}),
		h('span', `Showing  ${filteredJobs.length} / ${jobs.length} jobs`),
		h(JobsList, { jobs: filteredJobs }),
	])

}


const JobsList = (props) => {
	var jobs = props.jobs

	return h('ul', [
		jobs.map((job, key) => h(Job, {job, key})),
	])
}


const Job = ({ job }) => {
	return h('li', [
		h('div', {title: Object.keys(job)}, job.title),
		h('div', job.date),
		h('div', unsafeHtmlProp(job.desc)),
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
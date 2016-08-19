'use strict'

if (module.hot) {
	module.hot.accept()
}

// const _ = require('lodash')
// const React = require('react')
const ReactDOM = require('react-dom')
const h = require('react-hyperscript')

const APP = {
	// TODO: get from server
	jobs: require('../data/jobs.db.json'),
	// jobs: [],
}

const unsafeHtmlProp = (htmlStr) => {
	return { dangerouslySetInnerHTML: {__html: htmlStr}}
}

const Jobs = () => {
	var jobs = APP.jobs.items

	return h('ul', [
		jobs.map((job) => h(UpworkJob, {job})),
	])
}

const UpworkJob = (props) => {
	var job = props.job

	return h('li', [
		h('div', {title: Object.keys(job)}, job.title),
		h('div', job.date),
		h('div', unsafeHtmlProp(job.description)),
	])
}

const App = (/* props */) => {
	return h('div', [
		h('h1', 'Jobs'),
		h(Jobs),
	])
}

ReactDOM.render(h(App), document.getElementById('app'))

module.exports = App

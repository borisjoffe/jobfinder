'use strict'

const _ = require('lodash')

var APP

function logIfDiff(obj, k1, k2) {
	if (obj[k1] !== obj[k2]) {
		warn('is diff')
		warn(k1, 'not equal to', k2, obj[k1], obj[k2])
	}
}

function clean(job) {
	logIfDiff(job, 'description', 'summary')
	logIfDiff(job, 'date', 'pubDate')

	return _.pick(job, ['guid', 'title', 'description', 'date', 'pubDate',
		'link'])
}

function cleanAll(jobs) {
	log('transform: starting clean')

	log('there are', jobs.items.length, 'items')

	jobs.items = jobs.items.map(clean)
	return jobs
}


function transform(job) {
	return job
}

function transformAll(jobs) {
	log('transform: starting transform')

	jobs.items = jobs.items.map(transform)
	return jobs
}


module.exports = function (app) {
	APP = app

	return {
		clean,
		cleanAll,

		transform,
		transformAll,
	}
}

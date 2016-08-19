'use strict'

const _ = require('lodash')
const l = require('log4js').getLogger('transform')

var APP

function logIfDiff(obj, k1, k2) {
	if (obj[k1] !== obj[k2]) {
		l.warn('is diff')
		l.warn(k1, 'not equal to', k2, obj[k1], obj[k2])
	}
}

function clean(job) {
	logIfDiff(job, 'description', 'summary')
	logIfDiff(job, 'date', 'pubDate')

	return _.pick(job, ['guid', 'title', 'description', 'date', 'pubDate',
		'link'])
}

function cleanAll(jobs) {
	l.info('transform: starting clean')

	l.info('there are', jobs.items.length, 'items')

	jobs.items = jobs.items.map(clean)
	return jobs
}


function transform(job) {
	return job
}

function transformAll(jobs) {
	l.info('transform: starting transform')

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
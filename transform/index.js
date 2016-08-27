'use strict'

const _ = require('lodash')
const l = require('log4js').getLogger('transform')

var APP, u

function logIfDiff(obj, k1, k2) {
	if (obj[k1] !== obj[k2]) {
		l.warn(k1, 'not equal to', k2)
		l.warn('k1:', obj[k1])
		l.warn('k2:', obj[k2])
	}
}

function clean(job) {
	logIfDiff(job, 'description', 'summary')
	logIfDiff(job, 'date', 'pubDate')

	job.desc = job.description

	return _.pick(job, ['guid', 'title', 'desc', 'date', 'pubDate', 'link'])
}

function cleanAll(jobs) {
	l.info('transform: starting clean')

	l.info('there are', jobs._order.length, 'items')

	jobs.items = _.mapValues(jobs.items, clean)

	return jobs
}

function transform(job) {
	job.title = u.stripEnd(job.title, ' - Upwork')

	return job
}

function transformAll(jobs) {
	l.info('transform: starting transform')

	jobs.items = _.mapValues(jobs.items, transform)
	return jobs
}


module.exports = function (app) {
	APP = app
	u = APP.util

	return {
		clean,
		cleanAll,

		transform,
		transformAll,
	}
}

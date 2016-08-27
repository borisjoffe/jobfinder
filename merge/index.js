'use strict'

const l = require('log4js').getLogger('merge')
const _ = require('lodash')

var APP

function jobs(originalJobs, newJobs) {
	l.info('merging jobs')

	const overlap = _.intersection(originalJobs._order, newJobs._order)
	l.info('job overlap:', overlap.length)

	return {
		meta: newJobs.meta,
		items: Object.assign(originalJobs.items, newJobs.items),
		_order: _.uniq(originalJobs._order.concat(newJobs._order)),
	}

}

module.exports = function (app) {
	APP = app

	return {
		jobs
	}
}

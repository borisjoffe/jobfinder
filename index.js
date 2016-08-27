'use strict'


const l = require('log4js').getLogger('jobf')
const _ = require('lodash')
// const co = require('co')

// const u = require('./util')

var APP

const sources = ['upwork']  // TODO: extract from config

function processSourceStream(sourceName) {

	const feed = APP.cfg[sourceName].feed.main

	var tableName = 'jobs'

	var transform = _.flow(
		APP.transform.cleanAll,
		APP.transform.transformAll
	)

	var persistAsync = (jobs) => APP.db.write(jobs, tableName)

	var originalJobs

	APP
		.db.read(tableName)
		.then(data => {
			originalJobs = data
			l.info('found', originalJobs._order.length, 'jobs in db')
		})
		.then(() => {
			APP
				.fetch.read(feed, sourceName)
				.then(transform)
				.then(newJobs => APP.merge.jobs(originalJobs, newJobs))
				.then(persistAsync)
				.then(() => l.info('done'))
				.catch(l.error)
		})
		.catch(l.error)

}

function init() {
	APP = {}
	APP.cfg = require('./config')()
	APP.data = {}

	// modified node modules
	APP.t = require('./types')()

	// submodules
	APP.util = require('./util')()
	APP.fetch = require('./fetch')(APP)
	APP.db = require('./db')(APP)
	APP.merge = require('./merge')(APP)
	APP.transform = require('./transform')(APP)

	sources.map(processSourceStream)

	return APP
}

init()

module.exports = init

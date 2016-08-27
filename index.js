'use strict'


const l = require('log4js').getLogger('jobf')
const _ = require('lodash')
// const co = require('co')

// const u = require('./util')

var APP, transform, persistAsync

const sources = ['upwork']  // TODO: extract from config

function processStream(sourceName) {

	const feed = APP.cfg[sourceName].feed.main

	APP.fetch
		.read(feed, sourceName)
		.then(transform)
		.then(persistAsync)
		.then(() => l.info('done'))
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
	APP.transform = require('./transform')(APP)

	transform = _.flow(
		APP.transform.cleanAll,
		APP.transform.transformAll
	)

	persistAsync = (jobs) => APP.db.write(jobs, 'jobs')

	sources.map(processStream)

	return APP
}

init()

module.exports = init

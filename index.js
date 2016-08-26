'use strict'


const l = require('log4js').getLogger('jobf')
const _ = require('lodash')
// const co = require('co')

require('util')


function init() {
	const APP = {}
	APP.cfg = require('./config')()
	APP.data = {}

	// modified node modules
	APP.t = require('./types')()

	// submodules
	APP.fetch = require('./fetch')(APP)
	APP.db = require('./db')(APP)
	APP.transform = require('./transform')(APP)

	const upworkFeed = APP.cfg.upwork.feed.main

	var transform = _.flow(
		APP.transform.cleanAll,
		APP.transform.transformAll
	)

	var persistAsync = (jobs) => APP.db.write(jobs, 'jobs')

	APP.fetch
		.read(upworkFeed)
		.then(transform)
		.then(persistAsync)
		.then(() => l.info('done'))
		.catch(l.error)

	return APP
}

init()

module.exports = init

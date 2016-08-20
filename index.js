'use strict'


const l = require('log4js').getLogger('jobf')
const _ = require('lodash')
const t = require('tcomb')
// const co = require('co')

require('util')


t.NotEmpty = t.irreducible('NotEmpty', (x) => x.length > 0)

t.VString = t.intersection([t.String, t.NotEmpty], 'Non-empty string')

function init() {
	const APP = {}
	APP.cfg = require('./config')()
	APP.data = {}

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

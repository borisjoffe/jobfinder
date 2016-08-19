'use strict'

const l = require('log4js').getLogger('jobf')
const _ = require('lodash')
// const co = require('co')

/* Globals */
global.rootRequire = function (path) {
	return require('./' + path)
}

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

function log(...args) {
	console.log(...args)
	return args.slice(-1)
}

function warn(...args) {
	console.warn(...args)
	return args.slice(-1)
}

function err(...args) {
	console.error(...args)
	return args.slice(-1)
}

global.log = log
global.warn = warn
global.err = err

init()

module.exports = init

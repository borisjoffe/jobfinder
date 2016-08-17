'use strict'

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

	const upworkFeed = APP.cfg.upwork.feed.main
	const upworkDb = APP.cfg.upwork.db

	var persistAsync = (db) => {
		return (jobs) => APP.db.write(jobs, db)
	}

	APP.fetch
		.read(upworkFeed)
		.then(persistAsync(upworkDb))
		.then(log)
		.catch(err)

	return APP
}

function log(...args) {
	console.log(...args)
}

function err(...args) {
	console.error(...args)
}

init()

module.exports = init

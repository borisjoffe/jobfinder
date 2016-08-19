'use strict'

const l = require('log4js').getLogger('db')
const fs = require('fs')
const assert = require('assert')

var APP, DB

function write(data, tablename, opts) {
	l.info('db: starting write')
	assert(typeof tablename === 'string')

	var dataStr
	var filename = DB[tablename]

	if (typeof data === 'object')
		dataStr = JSON.stringify(data)

	return new Promise(function (resolve, reject) {
		fs.writeFile(filename, dataStr, function (err) {
			if (err)
				reject(err)
			else
				resolve(data)
		})
	})
}

module.exports = (app) => {
	APP = app
	DB = APP.cfg.db

	return {
		write,
	}
}

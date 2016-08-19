'use strict'

const l = require('log4js').getLogger('db')
const fs = require('fs')

const t = require('tcomb')

var APP, DB

function write(data, tablename, opts) {
	l.info('db: starting write')
	t.VString(tablename)

	var dataStr
	var filename = DB[tablename]
	t.VString(tablename)

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

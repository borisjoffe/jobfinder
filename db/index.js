'use strict'

const l = require('log4js').getLogger('db')
const fs = require('fs')

var APP, DB
var t

/**
 * Write object to a json file
 */
function write(data, tablename, opts) {
	l.info('db: starting write')
	t.VString(tablename)

	var dataStr
	var filename = DB[tablename]
	t.VString(filename)

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

/**
 * Return object from json file
 */
function read(tablename, opts) {
	l.info('db: starting read')
	t.VString(tablename)

	var filename = DB[tablename]
	t.VString(filename)

	return new Promise(function (resolve, reject) {
		fs.readFile(filename, function (err, data) {
			if (err)
				reject(err)
			else
				resolve(JSON.parse(data))
		})
	})

}

module.exports = (app) => {
	APP = app
	DB = APP.cfg.db
	t = APP.t

	return {
		write,
		read,
	}
}

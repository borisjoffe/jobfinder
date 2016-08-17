'use strict'

const l = require('log4js').getLogger('db')
const fs = require('fs')

var APP

function write(data, dbname, tablename, opts) {
	l.info('db: starting write')

	var str

	if (typeof data === 'object')
		str = JSON.stringify(data, null, '\t')

	return new Promise(function (resolve, reject) {
		fs.writeFile(dbname, str, function (err) {
			if (err)
				reject(err)
			else
				resolve(data)
		})
	})
}

module.exports = (app) => {
	APP = app

	return {
		write,
	}
}

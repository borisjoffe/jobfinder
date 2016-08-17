'use strict'

const fs = require('fs')

var APP

function write(data, dbname, tablename, opts) {
	var str

	if (typeof data === 'object')
		str = JSON.stringify(data, null, '\t')

	fs.writeFile(dbname + '.json', str)
}

module.exports = (app) => {
	APP = app

	return {
		write,
	}
}

'use strict'

module.exports = function () {
	const db_directory = 'data/'

	return {
		upwork: {
			db: db_directory + 'upwork.db.json',
			feed: {
				main: 'https://www.upwork.com/ab/feed/topics/atom?securityToken=<SECURITY_TOKEN_HERE>'
			}
		}

	}
}

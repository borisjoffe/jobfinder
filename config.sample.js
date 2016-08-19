'use strict'

module.exports = function () {
	const db_directory = 'data/'

	return {
		db: {
			jobs: db_directory + 'jobs.db.json',
		},
		upwork: {
			feed: {
				main: 'https://www.upwork.com/ab/feed/topics/atom?securityToken=<SECURITY_TOKEN_HERE>'
			}
		}

	}
}

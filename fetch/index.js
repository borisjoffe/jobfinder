"use strict"

module.exports = function () {

	const upworkFeed = rootRequire('config')().upwork.feed.main
	console.log('upworkFeed:', upworkFeed)

	return {

	}
}

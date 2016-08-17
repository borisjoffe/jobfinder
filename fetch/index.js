'use strict'

// const co = require('co')
const request = require('request')
const FeedParser = require('feedparser')

const jobs = {
	meta: {},
	items: []
}

var APP

var read = function (feedUrl) {

	const req = request(feedUrl)

		// https://github.com/danmactough/node-feedparser
		, feedparser = new FeedParser({addmeta: false})

	req.on('error', function (error) {
		console.error('request error:', error)
	})

	req.on('response', function (res) {
		var stream = this

		if (res.statusCode !== 200)
			return this.emit('error', new Error('Bad status code'))

		stream.pipe(feedparser)
	})

	return new Promise((resolve, reject) => {
		feedparser.on('meta', function (meta) {
			jobs.meta = meta
		})

		feedparser.on('readable', function () {
			// This is where the action is!
			var stream = this
				// , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
				, item

			while (item = stream.read()) {
				jobs.items.push(item)
			}

			resolve(jobs)
		})

		feedparser.on('error', function (error) {
			reject('feedparser error:' + error)
		})

	})
}

module.exports = function (_app) {
	APP = _app

	return {
		read
	}
}

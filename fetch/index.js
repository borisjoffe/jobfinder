'use strict'

// const co = require('co')
const l = require('log4js').getLogger('fetch')
const request = require('request')
const FeedParser = require('feedparser')

const jobs = {
	meta: {},
	items: Object.create(null),
	_order: [],
}

var APP, u

var read = function (feedUrl, sourceName) {

	const req = request(feedUrl)

		// https://github.com/danmactough/node-feedparser
		, feedparser = new FeedParser({addmeta: false})

	req.on('error', function (error) {
		l.error('request error:', error)
	})

	req.on('response', function (res) {
		var stream = this

		if (res.statusCode !== 200)
			return this.emit('error', new Error('Bad status code'))

		stream.pipe(feedparser)
	})

	l.info('fetch: starting fetch')

	return new Promise((resolve, reject) => {
		feedparser.on('meta', function (meta) {
			jobs.meta[sourceName] = meta
		})

		feedparser.on('readable', function () {

			// This is where the action is!
			var stream = this
				// , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
				, item

			while (item = stream.read()) {
				if (item.guid in jobs.items) {
					l.warn('guid: ' + item.guid + 'already exists')
					// l.info('existing object: ' + u.pretty(jobs.items))
					// l.info('new object: ' + u.pretty(jobs.items))
				}

				jobs.items[item.guid] = item

				// save order
				jobs._order.push(item.guid)

				l.info('added item:', item.title)
			}

		})

		feedparser.on('end', function () {
			resolve(jobs)
		})

		feedparser.on('error', function (error) {
			reject('feedparser error:' + error)
		})

	})
}

module.exports = function (_app) {
	APP = _app
	u = APP.util

	return {
		read
	}
}

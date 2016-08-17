"use strict"

/* Globals */
global.rootRequire = function (path) {
	return require('./' + path)
}

function init() {
	return {
		fetch: require('./fetch/index.js')(),
	}
}

init()

module.exports = init

'use strict'

/* Globals */
global.rootRequire = function (path) {
	return require('./' + path)
}


global.log = function log(...args) {
	console.log(...args)
	return args.slice(-1)
}

global.warn = function warn(...args) {
	console.warn(...args)
	return args.slice(-1)
}

global.err = function err(...args) {
	console.error(...args)
	return args.slice(-1)
}


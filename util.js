'use strict'

var util = {}

// Causes webpack warnings and not used anywhere - comment out for now
// TODO: file bug?
// util.rootRequire = function (path) {
// 	return require('./' + path)
// }

util.log = function log(...args) {
	console.log(...args)
	return args.slice(-1)
}

util.warn = function warn(...args) {
	console.warn(...args)
	return args.slice(-1)
}

util.err = function err(...args) {
	console.error(...args)
	return args.slice(-1)
}

module.exports = util

/* Globals */
var global = global || window
Object.assign(global, util)

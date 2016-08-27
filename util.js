'use strict'

// Causes webpack warnings and not used anywhere - comment out for now
// TODO: file bug?
// util.rootRequire = function (path) {
// 	return require('./' + path)
// }


/* ===============================
 *           Logging
 * =============================== */

exports.log = function log(...args) {
	console.log(...args)
	return args.slice(-1)
}

exports.warn = function warn(...args) {
	console.warn(...args)
	return args.slice(-1)
}

exports.err = function err(...args) {
	console.error(...args)
	return args.slice(-1)
}

exports.pretty = (obj) => JSON.stringify(obj, null, '\t')


/* ===============================
 *           String
 * =============================== */

exports.stripEnd = function (str, end) {
	var stripped = str
	if (str.endsWith(end))
		stripped = str.replace(new RegExp(end + '$'), '')
	return stripped
}


/* ===============================
 *          Client side
 * =============================== */

if (typeof window !== 'undefined') {
	const classnames = require('classnames')

	exports.classnames = (...args) => ({ className: classnames(...args) })
}


module.exports = function () {
	return exports
}

/* Globals */
// Object.assign(global, exports)

'use strict'

const _ = require('lodash')

/**
 * Return a cloned tcomb with custom types added
 */
module.exports = function (t) {
	if (typeof t !== 'object')
		t = require('tcomb')

	t = _.cloneDeep(t)

	t.NotEmpty = t.irreducible('NotEmpty', (x) => x.length > 0)

	t.VString = t.intersection([t.String, t.NotEmpty], 'Non-empty string')

	return t
}

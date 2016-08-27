'use strict'

// Plop: https://github.com/amwmedia/plop
// inquirer prompts: https://github.com/SBoudrias/Inquirer.js/#objects

const { stripEnd } = require('./util')()

module.exports = function (plop) {
	plop.setGenerator('js', {
		prompts: [{
			type: 'input',
			name: 'filename',
			message: 'Enter a relative filename/path:',
			filter: function (filename) {
				console.log('entered:', filename)

				// create folder with index.js
				// e.g. 'server/' -> 'server/index.js'
				if (filename.endsWith('/'))
					filename = filename + '/index'

				if (filename.endsWith('.js'))
					filename = stripEnd(filename, '.js')

				return filename
			},
		}],
		actions: [{
			type: 'add',
			path: '{{filename}}.js',
			templateFile: 'plop/templ.js',
		}],
	})
}

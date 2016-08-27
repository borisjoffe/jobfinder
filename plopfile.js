'use strict'

// Plop: https://github.com/amwmedia/plop
// inquirer prompts: https://github.com/SBoudrias/Inquirer.js/#objects

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

				if (!filename.endsWith('.js'))
					filename += '.js'

				return filename
			},
		}],
		actions: [{
			type: 'add',
			path: '{{filename}}',
			templateFile: 'plop/js.templ',
		}],
	})
}

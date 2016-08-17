'use strict'

// Plop: https://github.com/amwmedia/plop
// inquirer prompts: https://github.com/SBoudrias/Inquirer.js/#objects

module.exports = function (plop) {
	plop.setGenerator('js', {
		prompts: [{
			type: 'input',
			name: 'filename',
			message: 'Enter a relative filename/path (without the js extension)',
			filter: function (filename) {
				console.log('entered:', filename)

				if (/\//.test(filename))
					return filename
				else
					return filename + '/index'
			},
		}],
		actions: [{
			type: 'add',
			path: '{{filename}}.js',
			templateFile: 'plop/js.templ',
		}],
	})
}

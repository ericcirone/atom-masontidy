var fs = require('fs'),
	spawn = require('child_process').spawn;

defaultCfg = {
	binary: "/usr/local/bin/masontidy",
	masonVersion: "2",
	defaultIndent: "4",
	perlTidyArgs: ""
};

inputCfg = defaultCfg;

module.exports = {
	config: {
		binary: {
			title: "Binary",
      		description: "Binary to use for Masontidy.",
			type: "string",
			default: defaultCfg.binary
		},
		masonVersion: {
			title: "Mason Version",
      		description: "Mason version to use for Masontidy.",
			type: "string",
			default: defaultCfg.masonVersion
		},
		defaultIndent: {
			title: "Indent Size",
      		description: "Indent Size",
			type: "string",
			default: defaultCfg.defaultIndent
		}
		// },
		// perlTidyArgs: {
		// 	title: "Binary",
     //  		description: "Default binary to use for Masontidy.",
		// 	type: "string",
		// 	default: ""
		// }
	},

	activate: function () {
		atom.commands.add('atom-workspace', 'masontidy:tidy', function () {

			var editor = atom.workspace.getActiveTextEditor();
			var path = inputCfg.binary;

			if (fs.existsSync(path)) {
				var position = editor.getCursorScreenPosition();
				masontidy(path, editor.getText(), inputCfg, function (perl) {
					editor.transact(function () {
						editor.setText(perl);
						editor.getLastCursor().setScreenPosition(position);
					});
				});
			} else {
				editor.setText('No masontidy found at "' + path + '".');
			}
		});
	}
};

function masontidy(path, before, args, cb) {

	var after = '';
	var masontidy = spawn(path, ["-m", args.masonVersion, "--indent-perl-block", args.defaultIndent, "--indent-block", args.defaultIndent, "-p"]);
	masontidy.stdin.setEncoding = 'utf-8';
	masontidy.stdout.setEncoding = 'utf-8';
	masontidy.stdin.end(before);
	masontidy.on('exit', function () {
		cb(after);
	});
	masontidy.stdout.on('data', function (chunk) {
		after += chunk;
	});
}

var fs    = require('fs'),
    spawn = require('child_process').spawn;

module.exports = {

  config: {
    binary: {
      type: "string",
      default: "/usr/local/bin/masontidy"
    }
  },

  activate: function() {
    atom.commands.add('atom-workspace', 'masontidy:tidy', function() {

      var editor = atom.workspace.getActiveTextEditor();
      var path   = atom.config.get('masontidy.binary');

      if (fs.existsSync(path)) {
        var position = editor.getCursorScreenPosition();
        masontidy(path, editor.getText(), function (perl) {
          editor.transact(function() {
            editor.setText(perl);
            editor.getLastCursor().setScreenPosition(position);
          });
        });
      }

      else {
        editor.setText('No masontidy found at "' + path + '".');
      }
    });
  }
};

function masontidy(path, before, cb) {

  var after = '';
  var masontidy = spawn(path);
  masontidy.stdin.setEncoding  = 'utf-8';
  masontidy.stdout.setEncoding = 'utf-8';
  masontidy.stdin.end(before);
  masontidy.on('exit', function() {
    cb(after);
  });
  masontidy.stdout.on('data', function(chunk) {
    after += chunk;
  });
}

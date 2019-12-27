const stream = require('stream'),
    JSONStream = require('JSONStream'),
    bl = require('bl'),
    spawn = require('child_process').spawn;

async function getInfo(filePath, opts) {
  return new Promise((resolve, reject) => {
    const params = [
      '-show_streams', 
      '-show_format',
      '-print_format', 
      'json', 
      filePath
    ];

    let info;
    let stderr;

    const ffprobe = spawn(opts.path, params);

    ffprobe.stderr.pipe(bl(function (err, data) {
      stderr = data.toString();
    }));

    ffprobe.stdout
      .pipe(JSONStream.parse())
      .once('data', (data) => {
        info = data;
      });

    ffprobe.once('close', (code) => {
      if (!code) {
        return resolve(info);
      }
      const err = stderr.split('\n').filter(Boolean).pop();
      reject(new Error(err));
    });
  })
}

module.exports = getInfo;

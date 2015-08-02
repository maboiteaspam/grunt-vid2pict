
module.exports = function(grunt) {

  var spawn = require('child_process').spawn
  var path = require('path')

  grunt.registerMultiTask('vid2pict', function () {
    var done = this.async();
    var options = this.options()
    var ffmpeg = options.ffmpeg || process.env['FFMPEG'] || 'ffmpeg'
    var dst = options.dst || null || 'img%03d.png'
    var src = options.src
    var fps = options.fps || 24
    var ss = options.ss
    var t = options.t
    var clevel = options.compression_level
    var quality = options.quality
    var name = options.name || 'no-name'
    if (dst) {
      var dirpath = path.dirname(dst)
      var cssFile = dirpath+'/animation.css'
      var jsFile = dirpath+'/animation.js'

      grunt.file.delete(dirpath)
      grunt.file.mkdir(dirpath)

      var args = ['-i', src];
      ('ss' in options) && (args = args.concat(['-ss', ss]));
      ('t' in options) && (args = args.concat(['-t', t]));
      ('fps' in options) && (args = args.concat(['-vf']));
      ('fps' in options) && (args = args.concat(['fps='+fps]));
      // png // btwn 0-100, 100 is better
      ('compression_level' in options) && (args = args.concat(['-compression_level', clevel]));
      // jpg // btwn 1-31, 1 is better
      ('quality' in options) && (args = args.concat(['-q:v', quality]));
      args = args.concat([dst]);
      spawn(ffmpeg, args, {stdio: 'inherit'})
        .on('close', function () {
          var files = grunt.file.expand({cwd: dirpath}, '*')
          var css = ''
          var sfiles = files.sort(function(a, b) {
            return +/\d+/.exec(a)[0] - +/\d+/.exec(b)[0];
          });
          sfiles.forEach(function(file, i) {
            css += '.frame'+i+name+'{background-image: url('+path.join(file)+');}\n'
          })
          grunt.file.write(cssFile, css)
          var playerOpts = {
            name: name,
            readMode: 'forward',
            start: 0,
            speed: ('fps' in options) ? fps/24 : 1,
            length: files.length
          }
          var js = 'window.playerVideo = window.playerVideo || {}, ' +
            'window.playerVideo[\''+name+'\'] = ' + JSON.stringify(playerOpts, null, 4)
          grunt.file.write(jsFile, js)
          done()
        })
    }
  });
};

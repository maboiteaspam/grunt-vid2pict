
module.exports = function(grunt) {

  var spawn = require('child_process').spawn
  var path = require('path')

  grunt.registerMultiTask('vid2pict', function () {
    var done = this.async();
    var options = this.options()
    var ffmpeg = options.ffmpeg || process.env['FFMPEG'] || 'ffmpeg'
    var dst = options.dst || null || 'img%03d.png'
    var src = ('src' in options) ? options.src : false
    var fps = ('fps' in options) ? options.fps : 24
    var ss = ('ss' in options) ? options.ss : 0
    var t = ('t' in options) ? options.t : 1
    var crop = ('crop' in options) ? options.crop : false
    var startFrame = 'startFrame' in options ? parseInt(options.startFrame) : -1
    var endFrame = 'endFrame' in options ? parseInt(options.endFrame) : 9999999
    var clevel = ('compression_level' in options) ? options.compression_level : 100
    var quality = ('quality' in options) ? options.quality : 1
    var baseUrl = ('baseUrl' in options) ? options.baseUrl : '/'
    var name = ('name' in options) ? options.name : 'no-name'

    if (dst) {
      var dirpath = path.dirname(dst)
      var cssFile = dirpath+'/animation.css'
      var jsFile = dirpath+'/animation.js'

      grunt.file.delete(dirpath)
      grunt.file.mkdir(dirpath)

      // ffmpeg is picky about arguments order.
      /*
       "ffmpeg.exe" -i "Video.mp4" -ss 26 -t 3 -vf fps=24 -q:v 12  -filter:v "crop=661:913:208:631" "app/images/test-vid2/img%03d.jpg"
       */
      var args = ['-i', src];
      ('ss' in options) && (args = args.concat(['-ss', ss]));
      ('t' in options) && (args = args.concat(['-t', t]));
      ('fps' in options) && (args = args.concat(['-vf', ['fps='+fps]]));
      // png // btwn 0-100, 100 is better
      ('compression_level' in options) && (args = args.concat(['-compression_level', clevel]));
      // jpg // btwn 1-31, 1 is better
      ('quality' in options) && (args = args.concat(['-q:v', quality]));
      ('crop' in options) && (args = args.concat(['-filter:v', 'crop='+crop+'']));
      args = args.concat([dst]);

      grunt.log.ok(ffmpeg+ ' '+args.join(' '))

      spawn(ffmpeg, args, {stdio: 'inherit'})
        .on('close', function () {
          var files = grunt.file.expand({cwd: dirpath}, '*')
          var css = ''
          var sfiles = files.sort(function(a, b) {
            return +/\d+/.exec(a)[0] - +/\d+/.exec(b)[0];
          });
          var framesLength = 0
          var frames = []
          sfiles.forEach(function(file, i) {
            if (i+1>=startFrame && i+1<=endFrame) {
              css += '.frame'+framesLength+name+'{background-image: url(' + file + ');}\n'
              framesLength++
              frames.push(baseUrl + file)
            }
          })
          grunt.file.write(cssFile, css)
          var playerOpts = {
            name: name,
            readMode: 'forward',
            baseUrl: baseUrl,
            start: 0,
            speed: ('fps' in options) ? fps/24 : 1,
            length: framesLength,
            frames: frames
          }
          var js = 'window.playerVideo = window.playerVideo || {};\n' +
            'window.playerVideo[\''+name+'\'] = ' + JSON.stringify(playerOpts, null, 4)+';\n'
          grunt.file.write(jsFile, js)
          done()
        })
    }
  });
};

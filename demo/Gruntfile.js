
var grunt = require('grunt')

grunt.loadNpmTasks('grunt-vid2pict');
grunt.loadNpmTasks('grunt-request-progress');

grunt.initConfig({
  vid2pict: {
    'test': {
      'options': {
        src: 'fixtures/big_buck_bunny.webm',
        dst: 'web/test-vid/img%03d.jpg',
        //compression_level: 0,
        quality: 12,
        ss: 0,
        t: 60,
        fps: 12
      }
    }
  },
  'request-progress': {
    'mp4-sample': {
      options:{
        request: {'proxy':'http://localhost:3213'},
        allowOverwrite: true,
        dst: 'fixtures/big_buck_bunny.mp4',
        src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
      }
    },
    'webm-sample': {
      options:{
        request: {'proxy':'http://localhost:3213'},
        dst: 'fixtures/big_buck_bunny.webm',
        src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.webm'
      }
    }
  }
})

grunt.registerTask('default', [
  'request-progress:mp4-sample',
  'request-progress:webm-sample',
  'vid2pict:test'
]);

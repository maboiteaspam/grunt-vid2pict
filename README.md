# grunt-vid2pict

Transforms a video into a picture based web animation.

It exports the video to `png` or `jpeg` using `ffmpeg`.

Then it generates a `css` file, which describe frame sequencing.

It also generates a `javascript` file containing useful information 
to play the produced videos.

I need this kind of things to work with transparency and so on.

See the [Demo](demo/)

## Installation

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the 
[Getting Started](http://gruntjs.com/getting-started) guide.

Run the following commands to download and install the application:

```sh
npm i grunt-vid2pict --save-dev
```

Load the task with

```js
grunt.loadNpmTasks('grunt-vid2pict');
```

## FFMPEG

This module use ffmpeg under the hood.

It lookup for 
- `options.ffmpeg` inlined grunt task option
- `process.ENV['FFMPEG']` a predefined variable
- `ffmpeg` in the PATH

## Documentation

Configure a task such

```js

grunt.initConfig({
  vid2pict: {
    'test': {
      'options': {
        src: 'test/fixtures/big_buck_bunny.webm',
        dst: 'test/test-vid/img%03d.jpg', // png|jpeg
        //compression_level: 0, // png 100-0
        quality: 12, // jpeg 1-31
        ss: 0, // start time sequence
        t: 60, // duration
        fps: 12 // frames per second to keep
      }
    }
  }
})

grunt.registerTask('default', [
  'vid2pict:test'
]);
```


## How to contribute

1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.

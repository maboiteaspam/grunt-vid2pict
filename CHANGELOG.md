:package: patch v0.0.5

```
- remove css support for pictPlayer, use img nodes instead, it is much more reliable.
- add startFrame / endFrame options to grunt task for a better control animation start/stops.
- add baseUrl options to control location of the pictures in the exported JS animation file.
- fixed the task options reading.
- added frames list to JS animation file.
```


In between release are not interesting 
as they was focused on fixing the packages for bower and npm.


:package: initial v0.0.1

```
Transforms a video into a picture based web animation.
It exports the video to `png` or `jpeg` using `ffmpeg`.
It generates a `css` file, which describe frame sequencing.
It generates a `javascript` file containing video options.
Provides a dependency-free player.
```


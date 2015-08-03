var PictPlayer = function (el, opt) {

  // and if your pictures and framerates requires that
  this.el = el
  this.opt = opt || {}

  this.front = document.createElement('img')
  this.el.appendChild(this.front)

  this.onLoop = null
  this.isPlaying = false
  this.frame = 0

  this.play = function () {

    var that = this
    var speed = this.opt.speed
    var frames = this.opt.frames

    this.front.setAttribute('src', frames[this.frame])

    this.isPlaying = true
    setTimeout(function(){
      if (that.isPlaying) {
        that.moveToNextFrame()
        if (that.isPlaying)  that.play()

      }
    }, 40 / speed)
    return this
  }

  this.moveToNextFrame = function () {

    var curFrame = this.frame
    var isFinish = false
    var length = this.opt.length
    var readMode = this.opt.readMode
    var isLooping = this.opt.isLooping
    var onLoop = this.opt.onLoop

    if (readMode==='forward') {
      isFinish = curFrame+1>=length
    } else {
      isFinish = curFrame-1<0
    }

    if (isFinish && isLooping && onLoop) onLoop(this)

    if (readMode==='forward') {
      if (isFinish) {
        if (isLooping) {
          this.frame = 0
        } else {
          this.stop()
        }
      } else {
        this.frame++;
      }
    } else {
      if (isFinish) {
        if (isLooping) {
          this.frame = length-1
        } else {
          this.stop()
        }
      } else {
        this.frame--;
      }
    }

    return this
  }

  this.goToFrame = function (n) {
    this.frame = n
    return this
  }

  this.goToLastFrame = function () {
    var length = this.opt.length
    var readMode = this.opt.readMode
    if (readMode==='forward') {
      this.goToFrame(length)
    } else {
      this.goToFrame(0)
    }
    return this
  }

  this.goToFirstFrame = function () {
    var length = this.opt.length
    var readMode = this.opt.readMode
    if (readMode==='forward') {
      this.goToFrame(0)
    } else {
      this.goToFrame(length)
    }
    return this
  }

  this.loop = function (isLooping, onLoop) {
    this.set('isLooping', isLooping)
    this.set('onLoop', onLoop)
    return this
  }

  this.pause = function () {
    this.isPlaying = false
    return this
  }

  this.stop = function () {
    this.isPlaying = false
    this.frame = 0
    return this
  }

  this.readBackward = function (backward) {
    this.set('readMode', backward ? 'backward' : 'forward')
    return this
  }

  this.set = function (opt, v) {
    this.opt[opt] = v
    return this
  }

  this.get = function (opt) {
    return this.opt[opt]
  }

}
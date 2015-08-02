var PictPlayer = function (el, opt) {

  this.buffer = []
  this.bufferLength = 1 // you can increase that if your cpu allows it
  // and if your pictures and framerates requires that
  this.el = el
  this.opt = opt || {}

  this.front = document.createElement('div')
  this.bufferEl = []
  for(var i=0;i<this.bufferLength;i++) {
    this.buffer.push('')
    this.bufferEl.push(document.createElement('div'))
    this.el.appendChild(this.bufferEl[i])
  }
  this.el.appendChild(this.front)

  this.onLoop = null
  this.isPlaying = false
  this.previousFrame = null
  this.frame = 0

  this.play = function () {

    var that = this
    var name = this.opt.name
    var speed = this.opt.speed

    var pFrame = this.previousFrame

    var css = this.front.getAttribute('class') || ''
    if (pFrame!==null) css = css.replace(' frame'+pFrame+name, '')
    css += ' frame'+this.frame+name
    this.front.setAttribute('class', css)

    for(var i=0;i<this.bufferLength;i++) {
      that.bufferEl[i].setAttribute('class', ' frame'+this.buffer[i]+name)
    }
    this.isPlaying = true
    setTimeout(function(){
      if (that.isPlaying) {
        if (that.previousFrame!==null)
          that.buffer.push(that.previousFrame)
        that.buffer.push(that.frame)
        that.previousFrame = that.frame
        if (that.buffer.length>that.bufferLength)
          that.buffer.splice(0, that.buffer.length-that.bufferLength)
        that.moveToNextFrame()
        if (that.isPlaying) {
          that.play()

        }
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
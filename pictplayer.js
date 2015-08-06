/*global PictPlayer: true */

var PictPlayer = function (el, opt) {

  // and if your pictures and framerates requires that
  this.el = el;
  this.opt = opt || {};

  var that = this;
  this.opt.frames.forEach(function(e, i) {
    var d = document.createElement('img');
    d.setAttribute('src', e);
    d.setAttribute('style', 'z-index:0;opacity:0;');
    d.setAttribute('frameindex', i);
    that.el.appendChild(d);
  });

  this.isPlaying = false;
  this.frame = 0;
  this.prevFrame = -1;

  this.play = function () {

    this.isPlaying = true;

    var speed = this.opt.speed;

    if (this.el.childNodes[this.frame]) {
      this.el.childNodes[this.frame].setAttribute('style', 'z-index:1;opacity:1;');
    }

    if (this.prevFrame > -1 && this.frame !== this.prevFrame) {
      if (this.el.childNodes[this.prevFrame]) {
        this.el.childNodes[this.prevFrame].setAttribute('style', 'z-index:0;opacity:0;');
      }
      this.prevFrame = -1;
    }

    this.prevFrame = parseInt(this.frame);

    if (that.isEnded()) {
      if (that.opt.isLooping && that.opt.onLoop) that.opt.onLoop(this);
      else that.isPlaying = false;
    } else {
      that.frame = that.getNextFrame();
    }

    if (that.isPlaying){
      setTimeout(function(){
        if (that.isPlaying){
          that.play();
        }
      }, 40 / speed);
    }

    return this;
  };

  this.isEnded = function () {

    var curFrame = this.frame;
    var isFinish = false;
    var length = this.opt.length;
    var readMode = this.opt.readMode;

    if (readMode==='forward') {
      isFinish = curFrame>=length-1;
    } else {
      isFinish = curFrame<=0;
    }

    return isFinish;
  };

  this.getNextFrame = function () {

    var curFrame = 0+this.frame;
    var length = this.opt.length;
    var isLooping = this.opt.isLooping;
    var readMode = this.opt.readMode;

    var isFinish = this.isEnded();

    if (!isFinish) {
      if (readMode==='forward') {
        curFrame++;
      } else {
        curFrame--;
      }
    } else {
      if (isLooping) {
        if (readMode==='forward') {
          curFrame=0;
        } else {
          curFrame=length-1;
        }
      }
    }

    return curFrame;
  };

  this.goToFrame = function (n) {
    this.frame = n;
    return this;
  };

  this.goToLastFrame = function () {
    var length = this.opt.length;
    var readMode = this.opt.readMode;
    if (readMode==='forward') {
      this.goToFrame(length-1);
    } else {
      this.goToFrame(0);
    }
    return this;
  };

  this.goToFirstFrame = function () {
    var length = this.opt.length;
    var readMode = this.opt.readMode;
    if (readMode==='forward') {
      this.goToFrame(0);
    } else {
      this.goToFrame(length-1);
    }
    return this;
  };

  this.loop = function (isLooping, onLoop) {
    this.set('isLooping', isLooping);
    this.set('onLoop', onLoop);
    return this;
  };

  this.pause = function () {
    this.isPlaying = false;
    return this;
  };

  this.stop = function () {
    this.isPlaying = false;
    this.frame = 0;
    return this;
  };

  this.readBackward = function (backward) {
    this.set('readMode', backward ? 'backward' : 'forward');
    return this;
  };

  this.set = function (k, v) {
    this.opt[k] = v;
    return this;
  };

  this.get = function (k) {
    return this.opt[k];
  };

};

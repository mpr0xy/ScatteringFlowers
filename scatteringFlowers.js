(function(window) {
  function rnd(n, m) {
    return parseInt(Math.random() * (m - n) + n);
  }
  var ScatteringFlowers = function(options) {
    this.SFDiv = null;
    this.SFImage = null;
    this.line = null;
    this.column = null;
    this.useTime = null;
    this.scale = null;
    this.opacity = null;
    this.rotateXStart = null;
    this.rotateXEnd = null;
    this.rotateYStart = null;
    this.rotateYEnd = null;
    this.subItemWidth = null;
    this.subItemHeight = null;
    this.SFWrapperDiv = null;
    this.SFDivCenterWidth = null;
    this.SFDivCenterHeight = null;
    if (!options.id || !options.image) {
      throw "new ScatteringFlowers Error: miss id or image";
    }
    this.config(options);
  };

  ScatteringFlowers.prototype.config = function(options) {
    this.SFImage = options.image || this.SFImage;
    this.line = options.line || (this.line ? this.line : 5);
    this.column = options.column || (this.column ? this.column : 5);
    this.scale = options.scale || (this.scale ? this.scale : '1.5');
    this.opacity = options.opacity || (this.opacity ? this.opacity : 0);
    this.rotateXStart = options.rotateXStart || (this.rotateXStart ? this.rotateXStart : -180);
    this.rotateXEnd = options.rotateXEnd || (this.rotateXEnd ? this.rotateXEnd : 180);
    this.rotateYStart = options.rotateYStart || (this.rotateYStart ? this.rotateYStart : -180);
    this.rotateYEnd = options.rotateYEnd || (this.rotateYEnd ? this.rotateYEnd : 180);

    if (options.id) {
      this.useTime = options.useTime || (this.useTime ? this.useTime : 1);
      this.options = options;
      this.SFDiv = document.getElementById(options.id);
      // 单个子元素的宽高
      this.subItemWidth = this.SFDiv.offsetWidth / this.column;
      this.subItemHeight = this.SFDiv.offsetHeight / this.line;
      // 容器的中心距离
      this.SFDivCenterWidth = this.SFDiv.offsetWidth / 2;
      this.SFDivCenterHeight = this.SFDiv.offsetHeight / 2;
      this.init();
    } else {
      // 更新动画运行的时间
      if (this.useTime && (this.useTime != options.useTime)) {
        this.useTime = options.useTime || 1;
        for (var i = 0; i < this.line; i++) {
          for (var j = 0; j < this.column; j++) {
            var divItem = document.getElementById(this.options.id + '-SF-' + i + '-' + j)
            divItem.style.transition = this.useTime + 's all ease';
          }
        }
      }
    }
  }

  ScatteringFlowers.prototype.init = function() {
    var subItemWidth = this.subItemWidth
    var subItemHeight = this.subItemHeight
    this.SFWrapperDiv = document.createElement('div');
    this.SFWrapperDiv.style.position = 'relative';
    for (var i = 0; i < this.line; i++) {
      for (var j = 0; j < this.column; j++) {
        var imageItem = document.createElement('img');
        imageItem.src = this.SFImage;
        imageItem.style.width = this.SFDiv.offsetWidth + 'px';
        imageItem.style.height = this.SFDiv.offsetHeight + 'px';
        imageItem.style.transform = 'translate3d(-'+ (j * subItemWidth) +'px,-' + (i * subItemHeight) +'px,0)';
        imageItem.style.webkitTransform = imageItem.style.transform;

        var divItem = document.createElement('div');
        divItem.id = this.options.id + '-SF-' + i + '-' + j;
        divItem.style.position = 'absolute';
        divItem.style.left = (j * subItemWidth) + 'px';
        divItem.style.top = (i * subItemHeight) + 'px';
        divItem.style.width = subItemWidth + 'px';
        divItem.style.height = subItemHeight + 'px';
        divItem.style.overflow = 'hidden';
        divItem.style.transition = this.useTime + 's all ease';
        divItem.style.webkitTransition = divItem.style.transition;
        divItem.appendChild(imageItem);
        this.SFWrapperDiv.appendChild(divItem);
      }
    }
    this.SFDiv.appendChild(this.SFWrapperDiv);
  }

  ScatteringFlowers.prototype.run = function(options) {
    var effect = options.effect;
    var isEndHidden = options.isEndHidden || false;
    var effectMap = {
      'spread': this.effectSpread,
      'down': this.effectDown,
      'up': this.effectUp // TODO
    }
    if (effectMap[effect]) {
      effectMap[effect].call(this, isEndHidden);
    }
  }

  ScatteringFlowers.prototype.endHidden = function() {
    var self = this;
    setTimeout(function() {
      self.SFDiv.removeChild(self.SFWrapperDiv);
      self.init();
    }, self.useTime * 1000);
  }

  ScatteringFlowers.prototype.effectSpread = function(isEndHidden) {
    for (var i = 0; i < this.line; i++) {
      for (var j = 0; j < this.column; j++) {
        var divItem = document.getElementById(this.options.id + '-SF-' + i + '-' + j)
        if (!divItem) {
          console.log("can't find " + this.options.id + '-SF-' + i + '-' + j);
          break;
        }
        // 计算每个div到父容器中心的距离 根据正负确定飞出的方向
        var disX = (divItem.offsetLeft + divItem.offsetWidth / 2) - this.SFDivCenterWidth;
        var disY = (divItem.offsetTop + divItem.offsetHeight / 2) - this.SFDivCenterHeight;

        divItem.style.transform = 'perspective(800px) translate3d(' +
          disX + 'px, ' + disY + 'px, 600px) rotateY(' +
          rnd(this.rotateXStart, this.rotateXStart) + 'deg) rotateX(' + rnd(this.rotateYStart, this.rotateYEnd) + 'deg) scale('
          + this.scale + ',' + this.scale + ')';
        divItem.style.webkitTransform = divItem.style.transform;
        divItem.style.opacity = this.opacity;
      }
    }
    if (!isEndHidden) {
      this.endHidden();
    }
  }

  ScatteringFlowers.prototype.effectDown = function(isEndHidden) {
    for (var i = 0; i < this.line; i++) {
      for (var j = 0; j < this.column; j++) {
        var divItem = document.getElementById(this.options.id + '-SF-' + i + '-' + j)
        if (!divItem) {
          console.log("can't find " + this.options.id + '-SF-' + i + '-' + j);
          break;
        }
        // 计算每个div到父容器中心的距离 根据正负确定飞出的方向
        var downLength = this.SFDiv.offsetHeight;

        divItem.style.transform = 'perspective(800px) translate3d(' +
          0 + 'px, ' + downLength + 'px, 600px) rotateY(' +
          rnd(this.rotateXStart, this.rotateXStart) + 'deg) rotateX(' + rnd(this.rotateYStart, this.rotateYEnd) + 'deg) scale('
          + this.scale + ',' + this.scale + ')';
        divItem.style.webkitTransform = divItem.style.transform;
        divItem.style.opacity = this.opacity;
      }
    }
    if (!isEndHidden) {
      this.endHidden();
    }
  }

  window.ScatteringFlowers = ScatteringFlowers;
})(window);
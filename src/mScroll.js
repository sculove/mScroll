mScroll.VERSION = '#__VERSION__#';
mScroll.HSCROLLBAR_CLASS = "__scroll_for_Hscrollbar__";
mScroll.VSCROLLBAR_CLASS = "__scroll_for_Vscrollbar__";

// constructor
function mScroll(el, option) {
	this.option = {
		deceleration : 0.0005,
		momentumDuration : _$.android ? 500 : 200,
		effect : mEffect.cubicBezier(0.18, 0.35, 0.56, 1),
		useHorizontal : false,
		useVertical : true,
		useDiagonalTouch : true,
		useBounce : true,
		useMomentum :  true,
		use3d : _$.use3d,
		useTransition : _$.useTransition,
		useScrollbar : true,
		useFadeScrollbar : true
	};
	_$.extend(this.option, option);

	// tempory option
	this.option.useTransition = true;

	this.wrapper = typeof el == "string" ? document.querySelector(el) : el;
	this._init();
	this.refresh();
}

mScroll.prototype = new mComponent();
_$.extend(mScroll.prototype, {
	_init : function() {
		// define variable
		this._timer = {
			"ani" : -1,
			"touch" : -1,
			"updater" : -1,
			"bugOffset" : -1,
			"bugHighlight" : -1
		};
		this.isPlaying = false;
		this._bufferPos = { x : 0, y : 0};
		this.x = 0;
		this.y = 0;

		this._setStyle();
		this.touch = new mTouch(this.wrapper, {
			tapThreshold : 1,
			slopeThreshold : 5,
			moveThreshold : 0
		});
		this._manageEvent();
	},

	_setInitStyle : function(css) {
		css = css || {};
		css[_$.toPrefixStr("transform")] = _$.getTranslate(0,0, this.option.use3d);

		if(this.option.useTransition) {
			css[_$.toPrefixStr("transitionTimingFunction")] = this.option.effect.toString();
		}
		return css;
	},

	_setStyle : function() {
		var wrapperStyle = this.wrapper.style,
			wrapperCss = { "overflow" : "hidden" },
			scrollerCss = { "left" : "0px", "top" : "0px" };

		// wrapper
		( wrapperStyle.position == "" || wrapperStyle.position == "static") && (wrapperCss.position = "relative");

		// scroller
		this.scroller = this.wrapper.children[0];
		this.scrollerStyle = this.scroller.style;
		( this.scrollerStyle.position == "" || this.scrollerStyle.position == "static") && (scrollerCss.position = "relative");
		this._setInitStyle(scrollerCss);

		// for style throttling
		_$.extend( this.scrollerStyle, scrollerCss);
		_$.extend( wrapperStyle, wrapperCss);

		if(_$.hasOffsetBug) {
			this.dummy = this.scroller.querySelector("._scroller_dummy_atag_");
			if(!this.dummy) {
				this.dummy = document.createElement("a");
				this.dummy.href = 'javascript:void(0);';
				this.dummy.className = "_scroller_dummy_atag_";
				_$.extend(this.dummy.style, {
					"position" : "absolute",
					"height" : "0px",
					"width" : "0px"
				});
				this.scroller.appendChild(this.dummy);
			}
		}

		// scrollbar
		if(this.option.useScrollbar) {
			this.option.useVertical && this._createScrollbar("v");
			this.option.useHorizontal && this._createScrollbar("h");
		}
	},

	_manageEvent : function(remove) {
		var method = remove ? "off" : "on";
		this.touch[method]("start", this._start.bind(this));
		this.touch[method]("move", this._move.bind(this));
		this.touch[method]("end", this._end.bind(this));

		// bind updater
		!this.option.useTransition && (this.updater = (function() {
			// console.log("updater [", this.x, this.y , "] =>", this._bufferPos);
			if(this._bufferPos.x != this.x || this._bufferPos.y != this.y) {
				this._setPos(this._bufferPos.x, this._bufferPos.y);
			}
			this._startUpdater();
		}).bind(this));

		// bind transitionEnd
		if(this.option.useTransition) {
			this._transitionEnd = (function(e) {
				if(e.target != this.scroller || !this.isPlaying ) {
					return;
				}
				this._transitionTime(0);
				this.isPlaying = false;
				if ( !this.restore(300) ) {
					this.trigger("scrollEnd");
				}
			}).bind(this);

			method = remove ? "removeEventListener" : "addEventListener";
			this.scroller[method]("transitionend", this._transitionEnd);
		}

		// bind offsetbug
		_$.hasOffsetBug && (this._fixOffsetBugFunc = (function() {
			if(this.scroller) {
				var ht = this._scrollerOffset();
				ht[_$.toPrefixStr("transform")] = _$.version >= 4 ? _$.getTranslate(0,0,this.option.use3d) : null;
				ht[_$.toPrefixStr("transitionDuration")] = null;
				_$.extend(this.scrollerStyle, ht);
				if(parseInt(_$.version,10) <= 3) {
					this.dummy.focus();
				}
			}
		}).bind(this));

		// bind highlightbug
		_$.hasHighlightBug && (this._fixHighlightFunc = (function() {
			_$.addClass(this.wrapper, _$.KITKAT_HIGHLIGHT_CLASS);
		}).bind(this));
	},

	_createScrollbar : function(direction) {
		var className = direction == "v" ? mScroll.VSCROLLBAR_CLASS : mScroll.HSCROLLBAR_CLASS,
			scrollbar = this.wrapper.querySelector("div." + className),
			indicator;
		if(!scrollbar) {
			var scrollbarStyle = "pointer-events:none; position:absolute; z-index:9999;",
				indecatorStyle = "position:absolute;background-color:rgba(0,0,0,0.3);border-radius:3px;left:0px;top:0px;";
			indicator = document.createElement("div"),
			scrollbar = document.createElement("div");
			scrollbar.className = className;

			if(direction == "v") {
				scrollbarStyle += "width:7px;bottom:2px;top:2px;right:1px;";
				indecatorStyle += "width:100%;";
			} else {
				scrollbarStyle += "height:7px;left:2px;right:2px;bottom:0;";
				indecatorStyle += "height:100%;";
			}
			scrollbar.style.cssText = scrollbarStyle;
			indicator.style.cssText = indecatorStyle;
			_$.extend(indicator.style, this._setInitStyle());
			scrollbar.appendChild(indicator);
			this.wrapper.appendChild(scrollbar);
		}
		this[direction + "scrollbar"] = scrollbar;
		this[direction + "indicator"] = indicator || scrollbar.children[0];
	},

	_refreshScrollbar : function(direction) {
		if(direction == "v") {
			if(!this.useVScroll || this.wrapperH == this.scrollerH) {
				this.hscrollbar.style.display = "none";
				return;
			}
		} else {
			if(!this.useHScroll || this.wrapperW == this.scrollerW) {
				this.vscrollbar.style.display = "none";
				return;
			}
		}
		var size = 0, p;
		if(direction == "v") {
			p = "height";
			size = Math.max(Math.round(Math.pow(this.wrapperH,2) / this.scrollerH), 8);
			this._vindicatorProp = ( this.wrapperH - size ) / this.maxScrollY;
		} else {
			p = "width";
			size = Math.max(Math.round(Math.pow(this.wrapperV,2) / this.scrollerV), 8);
			this._hindicatorProp = ( this.wrapperW - size ) / this.maxScrollX;
		}
		this[direction + "indicator"].style[p] = (isNaN(size) ? 0 : size) + "px";
	},

	refresh : function() {
		_$.hasHighlightBug && _$.addClass(this.wrapper, _$.KITKAT_HIGHLIGHT_CLASS);

		this.wrapperW	= this.wrapper.clientWidth;
		this.wrapperH = this.wrapper.clientHeight;
		this.scrollerW = this.scroller.offsetWidth;
		this.scrollerH = this.scroller.offsetHeight;
		this.maxScrollX =  this.wrapperW - this.scrollerW;
		this.maxScrollY = this.wrapperH - this.scrollerH;
		this.useHScroll = this.option.useHorizontal && (this.maxScrollX <= 0);
		this.useVScroll = this.option.useVertical && (this.maxScrollX <= 0);

		(this.useHScroll && !this.useVScroll) && (this.scrollerStyle.height = "100%");
		(this.useVScroll && !this.useHScroll) && (this.scrollerStyle.width = "100%");

		if(this.option.useScrollbar) {
			this.useVScroll && this._refreshScrollbar("v");
			this.useHScroll && this._refreshScrollbar("h");
		}

		// Workaround : when you can't scroll, android browser has wrong position
		(!this.useHScroll && !this.useVScroll) && this._fixOffsetBug();
	},

	_scrollerOffset : function(e) {
		var translateOffset = _$.getTranslateOffset(this.scroller),
			styleOffset = _$.hasOffsetBug ? _$.getStyleOffset(this.scrollerStyle) : {left:0,top:0},
			x = this._boundaryX(translateOffset.left + styleOffset.left),
			y = this._boundaryY(translateOffset.top + styleOffset.top);
		return {
			left : x,
			top : y
		};
	},

	_fixOffsetBug : function() {
		if(_$.hasOffsetBug) {
			this._clearOffsetBug();
			this._timer["bugOffset"] = setTimeout( this._fixOffsetBugFunc, 200);
		}
	},

	_fixHighlight : function(){
		if(_$.hasHighlightBug) {
			_$.removeClass(this.wrapper, _$.KITKAT_HIGHLIGHT_CLASS);

			// Workaround : sometime, it is not working. e.g. NaverAPP
			this.wrapper.clientHeight;	// force reflow

			clearTimeout(this._timer["bugHighlight"]);
			this._timer["bugHighlight"] = setTimeout( this._fixHighlightFunc ,200);
		}
	},

	_clearOffsetBug : function() {
		if(_$.hasOffsetBug) {
			clearTimeout(this._timer["bugOffset"]);
			this._timer["bugOffset"] = -1;
		}
	},

	_clearTouchEnd : function() {
		if(this._timer["touch"] != -1) {
			clearTimeout(this._timer["touch"]);
			this._timer["touch"] = -1;
		}
	},

	_preventSystemScroll : function(e) {
		switch(e.moveType) {
		case mTouch.HSCROLL :
			if(this.useHScroll) {
				if( !this.option.useBounce &&
					( (this.x >= 0 && e.vectorX >0 ) || (this.x <= this.maxScrollX && e.vectorX <0) )
				) {
					// this._forceRestore(we);
					return;
				} else {
					e.preventDefault();
					e.stopPropagation();
				}
			}
			break;
		case mTouch.VSCROLL :
			if(this.useVScroll) {
				if( !this.option.useBounce &&
					( (this.y >= 0 && e.vectorY >0 ) || (this.y <= this.maxScrollY && e.vectorY <0) )
				) {
					// this._forceRestore(we);
					return;
				} else {
					e.preventDefault();
					e.stopPropagation();
				}
			}
			break;
		case mTouch.DSCROLL :
			if(this.option.useDiagonalTouch) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				return;
			}
			break;
		default :
			e.preventDefault();
			e.stopPropagation();
		}
	},

	// touchstart/mousedown
	_start : function(e) {
		// console.debug("start",e.moveType, e);
		//
		this._clearTimer();
		if(this.trigger("beforeStart",e)) {
			// stop~!
			this.isPlaying && this._stopScroll();
			if(!this.trigger("start",e)) {
				e.stop();
			}
		} else {
			e.stop();
		}
	},

	// touchmove/mousemove
	_move : function(e) {
		// console.debug("move",e.moveType,e.duration, e.vectorX, e.vectorY);

		this._clearTimer();
		_$.hasClickBug && (this.scrollerStyle.pointerEvents = "none");

		if(this.trigger("beforeMove", e)) {
			// prevent system scroll
			this._preventSystemScroll(e);

			var nextX=0, nextY=0;
			if(this.option.useBounce) {
				(this.useHScroll) && (nextX = this.x + (this.x >=0 || this.x <=this.maxScrollX ? e.vectorX/3 : e.vectorX));
				(this.useVScroll) && (nextY = this.y + (this.y >=0 || this.y <=this.maxScrollY ? e.vectorY/3 : e.vectorY));

				// Galaxy S3 device : sometimes, don't trigger a touchend event
				if(e._type.indexOf("touch") != -1) {
					this._timer["touch"] = setTimeout( (function() {
						//self._forceRestore(we);
					}).bind(this) ,500);
				}
			} else {
				nextX = this._boundaryX(this.x + e.vectorX);
				nextY = this._boundaryY(this.y + e.vectorY);
			}
			this._setPos(nextX, nextY);
			if(!this.trigger("move", e)) {
				e.stop();
			}
		} else {
			e.stop();
		}
	},

	// touchend/mouseup/pointerup
	// touchcancel/pointercancel
	_end : function(e) {
		// console.debug("end",e.moveType,e.duration, e.vectorX, e.vectorY);
		this._clearTimer();

		switch(e.moveType) {
			case mTouch.HSCROLL:
			case mTouch.VSCROLL:
			case mTouch.DSCROLL:
				this._endForScroll(e);
				break;
			default :
				this._fixHighlight();
		}
		_$.hasClickBug && (this.scrollerStyle.pointerEvents = "auto");
	},

	_setPos : function(x, y) {
		this.x = x = Number(this.useHScroll ? x : 0);
		this.y = y = Number(this.useVScroll ? y : 0);

		var styleOffset = _$.hasOffsetBug? _$.getStyleOffset(this.scrollerStyle) : {left:0, top:0};
		x -= styleOffset.left,
		y -= styleOffset.top;
		this.scrollerStyle[_$.toPrefixStr("transform")] = _$.getTranslate(x + "px", y + "px", this.option.use3d);
		// console.info(_$.toPrefixStr("transform"), _$.getTranslate(x + "px", y + "px", this.option.use3d));

		if(this.option.useScrollbar) {
			this.useVScroll && this._setScrollbarPos("v", this.y);
			this.useHScroll && this._setScrollbarPos("h", this.x);
		}
		this._bufferPos = {
			x : this.x,
			y : this.y
		};

		// @event position
		this.trigger("position", {
			x : this.x,
			y : this.y
		});
	},


	_transitionTime: function (duration) {
		if(!this.option.useTransition) { return; }
		duration += 'ms';
		var durationStr = _$.toPrefixStr("transitionDuration");
		this.scrollerStyle[durationStr] = duration;

		if(this.option.useScrollbar) {
			if (this.useHScroll && this.hindicator) {
				this.hindicator.style[durationStr] = duration;
			}
			if (this.useVScroll && this.vindicator) {
				this.vindicator.style[durationStr] = duration;
			}
		}
	},

	_setScrollbarPos : function(direction, pos) {
		pos = this["_" + direction + "indicator" + "Prop"] * pos;
		var Indicator = this[direction + "indicator"],
			IndicatorStyle = Indicator.style;

		// @todo fade
		if(_$.hasOffsetBug) {
			var bufferPos = parseInt( direction === "h" ? IndicatorStyle.left : IndicatorStyle.top, 10);
			pos -= isNaN(bufferPos) ? 0 : bufferPos;
		}
		IndicatorStyle[_$.toPrefixStr("transform")] = _$.getTranslate( direction == "h" ? pos + "px" : 0, direction == "h" ? 0 : pos + "px", this.option.use3d);
	},

	_boundaryX : function(x) {
		return this.useHScroll ? (x > 0 ? 0 : (x < this.maxScrollX ? this.maxScrollX : x) ) : 0;
	},

	_boundaryY : function(y) {
		return this.useVScroll ? (y > 0 ? 0 : (y < this.maxScrollY ? this.maxScrollY : y) ) : 0;
	},

	_clearTimer : function() {
		this._clearOffsetBug();
		this._clearTouchEnd();
	},

	_endForScroll :  function(e) {
		var param = {
			x : this.x,
			y : this.y,
			nextX : this.x,
			nextY : this.y
		}, isMomentum = e.shortestDuration <= this.option.momentumDuration;

		if(isMomentum) {
			var speedX = 0, speedY = 0,
				nextX = {distance:0, duration:0}, nextY = {distance:0, duration:0};
			if(this.useHScroll) {
				speedX = Math.abs(e.shortestDistanceX)/e.shortestDuration;
				nextX = this._getMomentum(-e.shortestDistanceX, speedX, this.wrapperW, -this.x, -this.maxScrollX + this.x);
				param.nextX = this.x + nextX.distance;
			}
			if(this.useVScroll) {
				speedY = Math.abs(e.shortestDistanceY)/e.shortestDuration;
				nextY = this._getMomentum(-e.shortestDistanceY, speedY, this.wrapperH, -this.y, -this.maxScrollY + this.y);
				param.nextY = this.y + nextY.distance;
			}
			param.duration = Math.max(Math.max(nextX.duration, nextY.duration),10);
			// console.info(param.y , "=>", param.nextY, "(", param.duration, ")");
		} else {
			param.duration = 0;
		}

		if(this.trigger("beforeScroll", param)) {
			if(isMomentum) {
				if(!this.option.useBounce) {
					param.nextX = param.nextX;
					param.nextY = param.nextY;
					param.duration = param.duration;
				}
				this.scrollTo(param.nextX, param.nextY, param.duration);
			} else {
				// out of range
				if( ( this.useHScroll &&  ( param.nextX > 0  || param.nextX  < this.maxScrollX)) ||
				   (this.useVScroll &&  ( param.nextY > 0  || param.nextY  < this.maxScrollY)) ) {
					this.restore(300);
				} else {
					this._setPos(param.nextX, param.nextY);
				}
			}
		}
	},

	restore : function(duration) {
		var nextX = this._boundaryX(this.x),
			nextY = this._boundaryY(this.y);
		if(nextX === this.x && nextY == this.y) {
			// end animation
			return false;
		} else {
			this.scrollTo(nextX, nextY, duration);
			return true;
		}
	},

	_stopScroll : function() {
		var offset = this._scrollerOffset();

		// if(!this.option("bUseFixedScrollbar")) {
		// 	this._hideScrollBar("V");
		// 	this._hideScrollBar("H");
		// }
		if(this.option.useTransition) {
			this._transitionTime(0);
		} else {
			cancelAnimationFrame(this._timer["ani"]);
			this._stopUpdater();
		}
		this._setPos(this._boundaryX(offset.left), this._boundaryY(offset.top));
		this.isPlaying = false;
		// @todo isStop?
		this.trigger("scrollEnd");
		this._fixOffsetBug();
	},

	scrollTo : function(x, y, duration) {
		// console.info("scrollTo : " ,x,y, "(",duration,")");
		if(!duration) {
			this._setPos(x, y);
		} else {
			if(this.option.useTransition) {
				this.isPlaying = true;
				this._transitionTime(duration);
				this._setPos(x,y);
			} else {
				this._animate(x,y, duration);
			}
		}
	},

	_animate : function(x,y, duration) {
		if(this.isPlaying) return;
		this.isPlaying = true;

		var self = this,
			startTime = (new Date()).getTime(),
			fx = this.useHScroll ? this.option.effect(this.x, x) : 0,
			fy = this.useVScroll ? this.option.effect(this.y, y) : 0,
			now;

		this._startUpdater();
		(function animate () {
			now = (new Date()).getTime();
			if (now >= startTime + duration) {
				self._stopUpdater();
				self._setPos(x, y);
				self.isPlaying = false;
				if(!self.restore(300)) {
					console.error("end");
					self.trigger("scrollEnd");
				}
				return;
			}
			now = (now - startTime) / duration;
			self._bufferPos = {
				x : fx && fx(now),
				y : fy && fy(now)
			};
			if(self.isPlaying) {
				self._timer["ani"] = requestAnimationFrame(animate);
			} else{
				self._stopUpdater();
			}
		})();
	},

	_startUpdater : function() {
		this._stopUpdater();
		this._timer["updater"] = requestAnimationFrame(this.updater);
		// console.log("start-updater", this._timer["updater"]);
	},

	_stopUpdater : function() {
		cancelAnimationFrame(this._timer["updater"]);
		this._timer["updater"] = -1;
		// console.log("stop-updater");
	},

	_getMomentum: function (distance, speed, size, current, max) {
		var deceleration = this.option.deceleration,
			momentum = (speed*speed)/2,
			nextDist = momentum/ deceleration,
			nextDuration = 0,
			outBoundSize = 0;
		if (distance < 0 && nextDist > current) {
			outBoundSize = size / (6 / (nextDist / speed * deceleration));
			current = current + outBoundSize;
			speed = speed * current / nextDist;
			nextDist = current;
		} else if (distance > 0 && nextDist > max) {
			outBoundSize = size / (6 / (nextDist / speed * deceleration));
			max = max + outBoundSize;
			speed = speed * max / nextDist;
			nextDist = max;
		}
		nextDist = nextDist * (distance > 0 ? -1 : 1);
		nextDuration = (speed / deceleration) - this.option.momentumDuration;
		nextDuration = nextDuration < 0 ? 0 : nextDuration;
		return {
			distance: nextDist,
			duration: Math.round(nextDuration)
		};
	},

	destroy : function() {
		this._manageEvent(true);
		this.touch.destroy();
	}
});
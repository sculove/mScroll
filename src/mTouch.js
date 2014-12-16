// move type
mTouch.NONE = 0;
mTouch.HSCROLL = 1;
mTouch.VSCROLL = 2;
mTouch.DSCROLL = 3;
mTouch.TAP = 4;

function mTouch(el, option) {
	this.option = {
		tapThreshold : 6,
		slopeThreshold : 25,
		moveThreshold : 7
	};
	_$.extend(this.option, option);

	this.wrapper = typeof el == "string" ? document.querySelector(el) : el;
	this._init();
}

mTouch.prototype = {
	_init : function() {
		this.info = {
			"start" : {},
			"before" : {},
			"toucheCount" : 0,
			"actions" : []
		};
		this._eventType = (function() {
			if('ontouchstart' in window) {
				return {
					type : "touch",
					start : "touchstart",
					move : "touchmove",
					end : "touchend",
					cancel : "touchcancel"
				};
			// } else if (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) {
			// 	return {
			// 		type : "pointer",
			// 		start : "MSPointerDown",
			// 		move : "MSPointerMove",
			// 		end : "MSPointerUp",
			// 		cancel : "MSPointerCancel"
			// 	};
			} else {
				return {
					type : "mouse",
					start : 'mousedown',
			            move : 'mousemove',
			            end : 'mouseup',
			            cancel : null
				};
			}
		})();
		this._setSlope();
		this._manageEvent();
	},

	_setSlope : function() {
		this.slope = {
			h : ((window.innerHeight / 2) / window.innerWidth).toFixed(2) * 1,
			v : (window.innerHeight / (window.innerWidth / 2)).toFixed(2) * 1
		};
	},

	_manageEvent : function(remove) {
		var method = remove ? "removeEventListener" : "addEventListener";

		this.wrapper[method](this._eventType.start, this);
		this.wrapper[method](this._eventType.move, this);
		this.wrapper[method](this._eventType.end, this);
		(this._eventType.cancel != null) && this.wrapper[method](this._eventType.cancel, this);
	},

	handleEvent : function(e) {
		switch ( e.type ) {
			case this._eventType.start :
				this._start(e);
				break;
			case this._eventType.move :
				this._move(e);
				break;
			case this._eventType.cancel :
			case this._eventType.end :
				this._end(e);
				break;
		}
	},

	_getTouchInfo : function(e){
		var result = [],
			time = e.timeStamp;
		if(this._eventType.type == "touch") {
			var touches = e.touches;
			if(touches.length <= 1) {
				touches =  e.changedTouches;
			}
			for(var i=0, len = touches.length, touch; i<len; i++) {
				touch = touches[i];
				result.push({
					time : time,
					x : touch.pageX,
					y : touch.pageY
				});
			}
		} else {
			result.push({
				time : time,
				x : e.pageX,
				y : e.pageY
			});
		}
		return result;
	},

	_resetTouchInfo : function(){
		if(this.info["actions"].length == 0)  return;
		this.info = {
			"start" : {},
			"before" : {},
			"toucheCount" : 0,
			"actions" : []
		};
		this.moveType = mTouch.NONE;
	},

	_determineMoveType : function(info) {
		if(this.moveType == mTouch.NONE || this.moveType == mTouch.TAP) {
			var distX = Math.abs(this.info["start"].x - info.x),
				distY = Math.abs(this.info["start"].y - info.y),
				dist = distX + distY;
			if ((distX <= this.option.tapThreshold) && (distY <= this.option.tapThreshold)) {
			    this.moveType = mTouch.TAP;
			} else {
			    this.moveType = mTouch.NONE;
			}
			if (this.option.slopeThreshold  <= dist ) {
				var nSlope = parseFloat((distY / distX).toFixed(2), 10);
				if ((this.slope.h === -1) && (this.slope.v === -1)) {
				    this.moveType = mTouch.DSCROLL;
				} else {
					if (nSlope <= this.slope.h) {
						this.moveType = mTouch.HSCROLL;
					} else if (nSlope >= this.slope.v) {
						this.moveType = mTouch.VSCROLL;
					} else {
						this.moveType = mTouch.DSCROLL;
					}
				}
			}
		}
	},

	// make custom event params
	_getEventParam : function(info) {
		var startInfo = this.info["start"],
			beforeInfo = this.info["before"],
			shortestInfo = this.info["actions"][0],
		ret = {
			duration : info.time - startInfo.time,
			distanceX : (this.moveType === mTouch.VSCROLL)? 0 : info.x - startInfo.x,
			distanceY : (this.moveType === mTouch.HSCROLL)? 0 : info.y - startInfo.y,
			shortestDistanceX : (this.moveType === mTouch.VSCROLL)? 0 : info.x - shortestInfo.x,
			shortestDistanceY : (this.moveType === mTouch.HSCROLL)? 0 : info.y - shortestInfo.y,
			shortestDuration :  info.time - shortestInfo.time,
			vectorX : info.x - beforeInfo.x,
			vectorY : info.y - beforeInfo.y,
			moveType : this.moveType
		};

		// for touch
		if(this._eventType.type == "touch") {
			ret.x = info.x;
			ret.y = info.y;
		}
		return ret;
	},

	_saveActions : function(info) {
		_$.extend(this.info["before"], info);
		this.info["actions"].push(_$.extend({}, info));
            // actions have only 5!
            (this.info["actions"].length > 5) && this.info["actions"].shift();
	},

	_start : function(e) {
		if(!this.has("start")) return;

		var infos = this._getTouchInfo(e);
		this.info["toucheCount"] = infos.length;

		// multi-touch is out!
		if(infos.length > 1) {
			return;
		} else {
			this._resetTouchInfo();
		}
		e.moveType = this.moveType = mTouch.TAP;
		this.trigger('start', e);

		this.info["start"] = infos[0];
		this._saveActions(infos[0]);
	},

	_move : function(e) {
		if(!this.has("move")) return;

		// if 'start' is not working. move is out!
		if(this.info["toucheCount"] <= 0) {
		    return;
		}
		var info = this._getTouchInfo(e)[0];

		// Determine move type
		this._determineMoveType(info);
		var param = this._getEventParam(info),
			dist = 0;
		switch(this.moveType) {
			case mTouch.HSCROLL:
				dist = Math.abs(param.distanceX);
				break;
			case mTouch.VSCROLL:
				dist = Math.abs(param.distanceY);
				break;
			case mTouch.DSCROLL:
				dist = Math.abs(Math.sqrt(Math.pow(param.distanceX,2) + Math.pow(param.distanceY,2)));
				break;
		}

		// if moveThreshold is low than distance, 'move' event is not working
		// if slopeThreshold is low than distance, 'move' event is not working
		// if moveType is 'tap' or 'none', 'move' event is not working
		if(dist < this.option.moveThreshold
			|| dist <  this.option.slopeThreshold
			|| (this.moveType == mTouch.NONE || this.moveType == mTouch.TAP)
		) {
			return;
		}
		this.trigger('move', _$.extend(e, param));
		this._saveActions(info);
	},

	_end : function(e) {
		if(!this.has("end")) return;

		var infos = this._getTouchInfo(e);
		this.info["toucheCount"]-=infos.length;
		if (this.info["toucheCount"] > 0) {
			return;
		}
		this.trigger('end', _$.extend(e, this._getEventParam(infos[0])));
		this._resetTouchInfo();
	},

	destory : function() {
		this._manageEvent(true);
		this._resetTouchInfo();
	}
};

_$.extend(mTouch.prototype, mComponent.prototype);
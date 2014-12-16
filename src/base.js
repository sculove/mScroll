// requestAnimationFrame / canselAnimationFrame
var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame|| window.msRequestAnimationFrame;
var caf = window.cancelAnimationFrame || window.webkitCancelAnimationFrame|| window.mozCancelAnimationFrame|| window.msCancelAnimationFrame;

if(raf&&!caf){
	var keyInfo = {};
	var oldraf = raf;
	raf = function(callback){
		function wrapCallback(){
			if(keyInfo[key]){
			callback();
			}
		}
		var key = oldraf(wrapCallback);
		keyInfo[key] = true;
		return key;
	};
	caf = function(key){
		delete keyInfo[key];
	};
} else if(!(raf&&caf)){
	raf = function(callback) { return window.setTimeout(callback, 16); };
	caf = window.clearTimeout;
}
window.requestAnimationFrame = raf;
window.cancelAnimationFrame = caf;

// Function.bind for polifill
// http://sculove.pe.kr/wp/wp-content/uploads/2013/11/ECMAScript5.png
if(!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
	  if (typeof this !== 'function') {
	    // closest thing possible to the ECMAScript 5
	    // internal IsCallable function
	    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	  }
	  var aArgs   = Array.prototype.slice.call(arguments, 1),
	      fToBind = this,
	      fNOP    = function() {},
	      fBound  = function() {
	        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
	               aArgs.concat(Array.prototype.slice.call(arguments)));
	      };

	  fNOP.prototype = this.prototype;
	  fBound.prototype = new fNOP();
	  return fBound;
	};
}

var _$ = (function() {
	function _getTranslateOffsetFromCSSMatrix(e) {
		var curTransform  = new WebKitCSSMatrix(window.getComputedStyle(e).webkitTransform);
		return {
			top : curTransform.m42,
			left : curTransform.m41
		};
	}

	function _getTranslateOffsetFromStyle(e) {
		var top = 0,
			left = 0,
			temp = [],
			transValue = [],
			s = e.style[_.toPrefixStr("transform")];
		if(!!s && s.length >0){
		    if(/translate[XY]/.test(s)){
		        var tx = s.match(/translateX\(([-0-9px]*)\)/);
		        var ty = s.match(/translateY\(([-0-9px]*)\)/);
		        transValue.push(!!tx && tx.length > 1 ? tx[1] : "0px");
		        transValue.push(!!ty && ty.length > 1 ? ty[1] : "0px");
		        temp[1] = transValue.join(",");
		    }
            else{
    			temp = s.match(/translate.{0,2}\((.*)\)/);
            }
			if(!!temp && temp.length >1){
				var a = temp[1].split(',');
				if(!!a && a.length >1){
					top = parseInt(a[1],10);
					left = parseInt(a[0],10);
				}
			}
		}
		return {
			top : top,
			left : left
		};
	}

	var _ua = navigator.userAgent,
		_ = {
			KITKAT_HIGHLIGHT_CLASS : '_jmc_no_tap_highlight_',
			ios : /iPhone|iPad/.test(_ua),
			android : /Android/.test(_ua),
			chromeBrowser : /Chrome|CriOS/.test(_ua),
			firefoxBrowser : /Firefox/.test(_ua),
			sBrowser : /(SAMSUNG|Chrome)/.test(_ua),
			cssPrefix : (function() {
				var bodyStyle = document.body.style;
				if(typeof bodyStyle.webkitTransition !== "undefined") {
					return "webkit";
				} else if(typeof bodyStyle.transition !== "undefined") {
					return "";
				} else if(typeof bodyStyle.MozTransition !== "undefined") {
					return "Moz";
				} else if(typeof bodyStyle.OTransition !== "undefined") {
					return  "O";
				} else if(typeof bodyStyle.msTransition !== 'undefined'){
					return "ms";
				}
			})(),
			extend : function(target, obj) {
				for(var p in obj) {
					target[p] = obj[p];
				}
				return target;
			},
			getTranslate : function(x,y, is3d) {
				return "translate" + (is3d ? "3d" : "") + "(" + x + "," + y + (is3d ? ",0)" : ")");
			},
			toPrefixStr : function(p) {
				if(p.length <= 0) {
					return p;
				}
				p = _.cssPrefix == "" ? p.charAt(0).toLowerCase() + p.substr(1) : p.charAt(0).toUpperCase() + p.substr(1);
				return _.cssPrefix + p;
			},
			hasClass : function (e, c) {
				var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
				return re.test(e.className);
			},
			addClass : function (e, c) {
				if ( _.hasClass(e, c) ) {
					return;
				}
				e.className = e.className + " " + c;
			},
			removeClass : function (e, c) {
				if ( !_.hasClass(e, c) ) {
					return;
				}
				var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
				e.className = e.className.replace(re, ' ');
			},
			getTranslateOffset : function(e){
				var offset;
				// Andorid 3.0 has WebKitCSSMatrix. but, it isn't usable
				if(_.android && parseInt(_.version,10) === 3) {
				   offset = _getTranslateOffsetFromStyle(e);
				} else {
				   if('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()){
					  offset = _getTranslateOffsetFromCSSMatrix(e);
				   } else {
					  offset = _getTranslateOffsetFromStyle(e);
				   }
				}
				return offset;
			},
			getStyleOffset : function(style) {
				var left = parseInt(style.left,10),
				  top = parseInt(style.top,10);
				return {
				  left : isNaN(left) ? 0 : left,
				  top : isNaN(top) ? 0 : top
				};
			},
		};

	_.version = (function(){
		var version = "", mv;
		if(_.ios){
			mv =  _ua.match(/OS\s([\d|\_]+\s)/i);
			if(mv !== null&& mv.length > 1){
				version = mv[1];
			}
		} else if(_.android) {
			mv =  _ua.match(/Android\s([^\;]*)/i);
			if(mv !== null&& mv.length > 1){
				version = mv[1];
			}
		}
		return version.replace(/\_/g,'.').replace(/\s/g, "");
	})();

	_.use3d = (function() {
		// chrome (less then 25) has a text blur bug.
		// but samsung sbrowser fix it.
		if(_.chromeBrowser && _.version < "25" && !_.sBrowser) {
			return false;
		}
		var result = false;
		if(_.ios || _.firefoxBrowser) {
			result = true;
		} else if(_.android) {
			// @todo overseas handling

			if(_.version >= "4.1.0") {
				// android 4.1+ blacklist
				if(/EK-GN120|SM-G386F/.test(_ua)) {	// EK-GN120 : Galaxy Camera, SM-G386F : Galaxy Core LTE
					result = false;
				} else {
					result = true;
				}
			} else {
				if(_.version >= "4.0.3" &&
					/SHW-|SHV-|GT-|SCH-|SGH-|SPH-|LG-F160|LG-F100|LG-F180|LG-F200|EK-|IM-A|LG-F240|LG-F260/.test(_ua) &&
					!/SHW-M420|SHW-M200|GT-S7562/.test(_ua)) {    // SHW-M420 : Galaxy Nexus , SHW-M200 : NexusS , GT-S7562 : Galaxy S duos
					result = true;
				}
			}
		} else {
			result = true;
		}
		return result;
	})();

	_.useTransition = (function() {
		if(_.android) {
			if(_.version >= "4.3") {
				return true;
			}
		} else if(_.ios) {
			// iOS7+ : transition not working with scroll event
			if(parseInt(_.version,10) <= "6") {
				return true;
			}
		}
		return false;
	})();

	_.hasClickBug = (function() {
		return _.ios;
	})();

	_.hasHighlightBug = (function() {	// for android kitkat
		return (_.chromeBrowser && !_.sBrowser && _.version < 35);
	})();

	// if you change offset(left,top,..), you can be click(or highlight) a wrong position.
	_.hasOffsetBug = (function() {
		var result = false;
		if(_.android) {
			if(_.chrome || _.firefox) {
				result = false;
			} else {
				if(_.version < "3") {
					result = true;
				}
			}
		} else {
			result = false;
		}
		return result;
	})();

	// Workaround for iOS6+ devices : requestAnimationFrame not working with scroll event
	if(_.ios && parseInt(_.version) >= 6) requestAnimationFrame(function(){});

	// make styleTag for Kitkat highlight Bug
	if(_.hasHighlightBug && !document.getElementById('_jmc_no_tap_highlight_tag_')) {
		var elStyleTag = document.createElement('style');
		var elHTML = document.getElementsByTagName('html')[0];
		elStyleTag.type = "text/css";
		elStyleTag.id = '_jmc_no_tap_highlight_tag_';
		elHTML.insertBefore(elStyleTag, elHTML.firstChild);
		var oSheet = elStyleTag.sheet || elStyleTag.styleSheet;
		oSheet.insertRule('.' + _.KITKAT_HIGHLIGHT_CLASS + ' { -webkit-tap-highlight-color: rgba(0,0,0,0); }', 0);
		oSheet.insertRule('.' + _.KITKAT_HIGHLIGHT_CLASS + ' * { -webkit-tap-highlight-color: rgba(0,0,0,0); }', 0);
	}
	return _;
})();
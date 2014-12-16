var mEffect = function(effect) {
	if (this instanceof arguments.callee) {
		throw new Error("You can't create a instance of this");
	}

	// usable value
	var number = /^(\-?[0-9\.]+)(%|\w+)?$/, // %,px,em
		RGB = /^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i, // rgb(R,G,B)
		RGBA = /^rgba\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+),\s?([0-9\.]+)\)$/i, // rgba(R,G,B,alpha)
		HSL = /^hsl\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%\)$/i, // hsl(H,S,L)
		HSLA = /^hsla\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%,\s?([0-9\.]+)\)$/i, // hsla(H,S,L,alpha)
		hex = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i, // #FFFFFF
		color3to6 = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i; // #FFF

	// value to object { value, unit }
	var getUnitAndValue = function(v) {
		var value = v, unit;
		if (number.test(v)) { // number
			value = parseFloat(v);
			unit = RegExp.$2 || "";
		} else if (RGB.test(v)) { // RGB
			value = {rgb:[parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), 1]};
			unit = 'color';
		} else if (RGBA.test(v)) { // RGBA
			value = {rgb:[parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10), parseFloat(RegExp.$4)]};
			unit = 'color';
		} else if (HSL.test(v)) { // HSL
			value = {hsl:[parseFloat(RegExp.$1), parseFloat(RegExp.$2)/100, parseFloat(RegExp.$3)/100, 1]};
			value.rgb = hsl2rgb.apply(this, value.hsl); // RGB
			unit = 'color';
		} else if (HSLA.test(v)) { // HSLA
			value = {hsl:[parseFloat(RegExp.$1), parseFloat(RegExp.$2)/100, parseFloat(RegExp.$3)/100, parseFloat(RegExp.$4)]};
			value.rgb = hsl2rgb.apply(this, value.hsl); // RGB
			unit = 'color';
		} else if (hex.test(v = v.replace(color3to6, '#$1$1$2$2$3$3'))) { // #color
			value = {rgb:[parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16), 1]};
			unit = 'color';
		} else {
			console.trace("error");
			throw new Error('unit error (' + v + ')');
		}
		return {
			value : value,
			unit : unit
		};
	};

	// multi-value string to Array
	// fExplode('20px 30px 40px') -> [ '20px', '30px', '40px' ]
	// fExplode('20px rgb(255, 0, 0) #fff') -> [ '20px', 'rgb(255, 0, 0)', '#fff' ]
	var explode = function(str) {
		var ret = [];
		str.replace(/([^\s]+\([^\)]*\)|[^\s]+)\s?/g, function(_, a) { ret.push(a); });
		return ret;
	};

	// multi-value string to Object [ {value, unit}, {value, unit}, ... ]
	var getUnitAndValueList = function(v) {
		var list = explode(v?v+'':'0'),
			ret = [];

		for (var i = 0, len = list.length; i < len; i++) {
			ret.push(getUnitAndValue(list[i]));
		}

		return ret;
	};

	// http://jsfiddle.net/EPWF6/9/
	var hsl2rgb = function(H, S, L, alpha) {
		H = (H % 360) / 60;
		var C = (1 - Math.abs((2 * L) - 1)) * S;
		var X = C * (1 - Math.abs((H % 2) - 1));
		var R1 = 0, G1 = 0, B1 = 0;

		if (H >= 5 || H < 1) {
			R1 = C;
			B1 = X;
		} else if (H >= 4) {
			R1 = X;
			B1 = C;
		} else if (H >= 3) {
			G1 = X;
			B1 = C;
		} else if (H >= 2) {
			G1 = C;
			B1 = X;
		} else if (H >= 1) {
			R1 = X;
			G1 = C;
		}

		var m = L - (C / 2);

		return [
			Math.round((R1 + m) * 255),
			Math.round((G1 + m) * 255),
			Math.round((B1 + m) * 255),
			alpha
		];

	};

	// 이펙트 함수
	return function(start, end) {
		var arrayStart, arrayEnd;

		// parse
		var parse = function() {
			var changed = false;

			// if start value is change, check 'change' property
			if (instance.start !== start) {
				arrayStart = getUnitAndValueList(instance.start);
				start = instance.start;
				changed = true;
			}

			// if end value is change, check 'change' property
			if (instance.end !== end) {
				arrayEnd = getUnitAndValueList(instance.end);
				end = instance.end;
				changed = true;
			}

			// if you change, parsing!
			if (changed) {
				var len = Math.max(arrayStart.length, arrayEnd.length);

				// if start and end position aren't same, c
				if (arrayStart.length !== arrayEnd.length && len > 1) {

					switch (arrayStart.length) {
					case 1: _$.extend(arrayStart[1] , arrayStart[0]); // not break
					case 2: _$.extend(arrayStart[2] , arrayStart[0]); // not break
					case 3: _$.extend(arrayStart[3] , arrayStart[1]); break;
					}

					switch (arrayEnd.length) {
					case 1: _$.extend(arrayEnd[1] , arrayEnd[0]); // not break
					case 2: _$.extend(arrayEnd[2] , arrayEnd[0]); // not break
					case 3: _$.extend(arrayEnd[3] , arrayEnd[1]); break;
					}

				}

				for (var i = 0, oStart, oEnd; i < len; i++) {
					oStart = arrayStart[i];
					oEnd = arrayEnd[i];

					// if either start or end is '0', corrent same unit
					if (oStart.value === 0) { oStart.unit = oEnd.unit; }
					else if (oEnd.value === 0) { oEnd.unit = oStart.unit; }

					// different unit is error!
					if (oStart.unit != oEnd.unit) {
						throw new Error('unit error (' + start + ' ~ ' + end + ')');
					}

				}

			}

		};

		// p is from 0.0 to 1.0
		var instance = function(p) {
			var values = [];
			parse(); // validate start and end position

			for (var i = 0, len = Math.max(arrayStart.length, arrayEnd.length), oStart, oEnd, alpha, unit; i < len; i++) {
				oStart = arrayStart[i];
				oEnd = arrayEnd[i];

				start = oStart.value;
				end = oEnd.value;
				unit = oStart.unit;

				var value = effect(p),
					getResult = function(s, d, unit) {
						return Math.round(((d - s) * value + s) * 1000000) / 1000000 + (unit || 0);
					};

				// number + unit
				if (unit !== 'color') {
					values.push(getResult(start, end, unit));
					continue;
				}

				// if unit is HSL,..
				if (start.hsl && end.hsl) {
					start = start.hsl;
					end = end.hsl;

					var h = Math.round(getResult(start[0], end[0]));
					var s = Math.max(0, Math.min(1, getResult(start[1], end[1]))) * 100;
					var l = Math.max(0, Math.min(1, getResult(start[2], end[2]))) * 100;
					alpha = getResult(start[3], end[3]);

					if (alpha === 1) {
						values.push('hsl(' + [ h, s+'%', l+'%' ].join(',') + ')');
					} else {
						values.push('hsla(' + [ h, s+'%', l+'%', alpha ].join(',') + ')');
					}
				// if unit is RGB,..
				} else {
					start = start.rgb;
					end = end.rgb;
					var r = Math.max(0, Math.min(255, Math.round(getResult(start[0], end[0]))));
					var g = Math.max(0, Math.min(255, Math.round(getResult(start[1], end[1]))));
					var b = Math.max(0, Math.min(255, Math.round(getResult(start[2], end[2]))));
					alpha = getResult(start[3], end[3]);

					if (alpha === 1) {
						var dummy = ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
						values.push('#' + Array(7 - dummy.length).join('0') + dummy);
					} else {
						values.push('rgba(' + [ r, g, b, alpha ].join(',') + ')');
					}

				}

			}
			return values.join(' ');

		};

		switch (arguments.length) {
		case 0: break;
		case 1:
			end = start || '0';
			start = '0';
			break;
		}
		instance.start = start;
		instance.end = end;
		instance.effectConstructor = arguments.callee;
		start = end = null;

		if (arguments.length > 1) {
			parse();  // validate start and end position
		}
		return instance;
	};
};

// http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
mEffect._cubicBezier = function(x1, y1, x2, y2){
	return function(t){
		var cx = 3.0 * x1,
	    	bx = 3.0 * (x2 - x1) - cx,
	    	ax = 1.0 - cx - bx,
	    	cy = 3.0 * y1,
	    	by = 3.0 * (y2 - y1) - cy,
	    	ay = 1.0 - cy - by;

	    function sampleCurveX(t) {
	    	return ((ax * t + bx) * t + cx) * t;
	    }
	    function sampleCurveY(t) {
	    	return ((ay * t + by) * t + cy) * t;
	    }
	    function sampleCurveDerivativeX(t) {
	    	return (3.0 * ax * t + 2.0 * bx) * t + cx;
	    }
	    function solveCurveX(x,epsilon) {
	    	var t0, t1, t2, x2, d2, i;
	    	for (t2 = x, i = 0; i<8; i++) {
	    		x2 = sampleCurveX(t2) - x;
	    		if (Math.abs(x2) < epsilon) {
	    			return t2;
	    		}
	    		d2 = sampleCurveDerivativeX(t2);
	    		if(Math.abs(d2) < 1e-6) {
	    			break;
	    		}
	    		t2 = t2 - x2 / d2;
	    	}
		t0 = 0.0;
		t1 = 1.0;
		t2 = x;
		if (t2 < t0) {
			return t0;
		}
		if (t2 > t1) {
			return t1;
		}
		while (t0 < t1) {
			x2 = sampleCurveX(t2);
			if (Math.abs(x2 - x) < epsilon) {
				return t2;
			}
			if (x > x2) {
				t0 = t2;
			} else {
				t1 = t2;
			}
			t2 = (t1 - t0) * 0.5 + t0;
		}
	    	return t2; // Failure.
	    }
	    return sampleCurveY(solveCurveX(t, 1 / 200));
	};
};

// effects
mEffect.cubicBezier = function(x1, y1, x2, y2){
	var f = mEffect(mEffect._cubicBezier(x1, y1, x2, y2));
	var cssTimingFunction = 'cubic-bezier(' + [ x1, y1, x2, y2 ].join(',') + ')';
	f.toString = function() { return cssTimingFunction; };
	return f;
};

mEffect.linear = mEffect(function(s) {
	return s;
});
mEffect.linear.toString = function() { return 'linear'; };

mEffect.easeIn = mEffect(function(s) {
	return Math.pow(s, 3);
});
mEffect.easeIn.toString = function() { return 'ease-in'; };

mEffect.easeOut = mEffect(function(s) {
	return Math.pow((s - 1), 3) + 1;
});
mEffect.easeOut.toString = function() { return 'ease-out'; };

mEffect.easeInOut = mEffect(function(s) {
	return (s < 0.5) ? mEffect.easeIn(0, 1)(2 * s) * 0.5 : mEffect.easeOut(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
mEffect.easeInOut.toString = function() { return 'ease-in-out'; };
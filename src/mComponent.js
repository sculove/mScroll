function mComponent() {
	this._eventHandler={};
}

mComponent.prototype = {
	on : function(type, fn) {
		var handler = this._eventHandler[type];
		if (typeof handler == 'undefined'){
			handler = this._eventHandler[type] = [];
		}
		handler.push(fn);
		return this;
	},
	off : function(type, fn) {
		if(this.has(type)) {
			var index = this._eventHandler[type].indexOf(fn);
			if ( index != -1 ) {
				this._eventHandler[type].splice(index, 1);
			}
		}
		return this;
	},
	trigger : function(type, param) {
		if(!this.has(type)) return true;
		param = param || {};
		var fns = this._eventHandler[type].concat();
		_$.extend(param, {_type:type});	// safari has a type parameter

		if(typeof param._extend == "undefined") {
			param._extend = [];
			param.stop = function() {
				if(param._extend.length > 0) {
					param._extend[param._extend.length-1].cancel = true;
				}
			};
		}
		param._extend.push({
			cancel : false
		});
		for (var i=0, len=fns.length; i < len; i++){
			fns[i].call(this, param);
		}
		return !param._extend.pop().cancel;
	},
	has : function(type) {
		return !!this._eventHandler[type];
	}
};
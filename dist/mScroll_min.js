var raf=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame;var caf=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.msCancelAnimationFrame;if(raf&&!caf){var keyInfo={};var oldraf=raf;raf=function(callback){function wrapCallback(){if(keyInfo[key])callback()}var key=oldraf(wrapCallback);keyInfo[key]=true;return key};caf=function(key){delete keyInfo[key]}}else if(!(raf&&caf)){raf=function(callback){return window.setTimeout(callback,16)};caf=window.clearTimeout}window.requestAnimationFrame=raf;window.cancelAnimationFrame=caf;if(!Function.prototype.bind)Function.prototype.bind=function(oThis){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var aArgs=Array.prototype.slice.call(arguments,1),fToBind=this,fNOP=function(){},fBound=function(){return fToBind.apply(this instanceof fNOP&&oThis?this:oThis,aArgs.concat(Array.prototype.slice.call(arguments)))};fNOP.prototype=this.prototype;fBound.prototype=new fNOP;return fBound};var _$=function(){function _getTranslateOffsetFromCSSMatrix(e){var curTransform=new WebKitCSSMatrix(window.getComputedStyle(e).webkitTransform);return{top:curTransform.m42,left:curTransform.m41}}function _getTranslateOffsetFromStyle(e){var top=0,left=0,temp=[],transValue=[],s=e.style[_.toPrefixStr("transform")];if(!!s&&s.length>0){if(/translate[XY]/.test(s)){var tx=s.match(/translateX\(([-0-9px]*)\)/);var ty=s.match(/translateY\(([-0-9px]*)\)/);transValue.push(!!tx&&tx.length>1?tx[1]:"0px");transValue.push(!!ty&&ty.length>1?ty[1]:"0px");temp[1]=transValue.join(",")}else temp=s.match(/translate.{0,2}\((.*)\)/);if(!!temp&&temp.length>1){var a=temp[1].split(",");if(!!a&&a.length>1){top=parseInt(a[1],10);left=parseInt(a[0],10)}}}return{top:top,left:left}}var _ua=navigator.userAgent,_={KITKAT_HIGHLIGHT_CLASS:"_jmc_no_tap_highlight_",ios:/iPhone|iPad/.test(_ua),android:/Android/.test(_ua),chromeBrowser:/Chrome|CriOS/.test(_ua),firefoxBrowser:/Firefox/.test(_ua),sBrowser:/(SAMSUNG|Chrome)/.test(_ua),cssPrefix:function(){var bodyStyle=document.body.style;if("undefined"!==typeof bodyStyle.webkitTransition)return"webkit";else if("undefined"!==typeof bodyStyle.transition)return"";else if("undefined"!==typeof bodyStyle.MozTransition)return"Moz";else if("undefined"!==typeof bodyStyle.OTransition)return"O";else if("undefined"!==typeof bodyStyle.msTransition)return"ms"}(),extend:function(target,obj){for(var p in obj)target[p]=obj[p];return target},getTranslate:function(x,y,is3d){return"translate"+(is3d?"3d":"")+"("+x+","+y+(is3d?",0)":")")},toPrefixStr:function(p){if(p.length<=0)return p;p=""==_.cssPrefix?p.charAt(0).toLowerCase()+p.substr(1):p.charAt(0).toUpperCase()+p.substr(1);return _.cssPrefix+p},hasClass:function(e,c){var re=new RegExp("(^|\\s)"+c+"(\\s|$)");return re.test(e.className)},addClass:function(e,c){if(_.hasClass(e,c))return;e.className=e.className+" "+c},removeClass:function(e,c){if(!_.hasClass(e,c))return;var re=new RegExp("(^|\\s)"+c+"(\\s|$)","g");e.className=e.className.replace(re," ")},getTranslateOffset:function(e){var offset;if(_.android&&3===parseInt(_.version,10))offset=_getTranslateOffsetFromStyle(e);else if("WebKitCSSMatrix"in window&&"m11"in new WebKitCSSMatrix)offset=_getTranslateOffsetFromCSSMatrix(e);else offset=_getTranslateOffsetFromStyle(e);return offset},getStyleOffset:function(style){var left=parseInt(style.left,10),top=parseInt(style.top,10);return{left:isNaN(left)?0:left,top:isNaN(top)?0:top}}};_.version=function(){var version="",mv;if(_.ios){mv=_ua.match(/OS\s([\d|\_]+\s)/i);if(null!==mv&&mv.length>1)version=mv[1]}else if(_.android){mv=_ua.match(/Android\s([^\;]*)/i);if(null!==mv&&mv.length>1)version=mv[1]}return version.replace(/\_/g,".").replace(/\s/g,"")}();_.use3d=function(){if(_.chromeBrowser&&_.version<"25"&&!_.sBrowser)return false;var result=false;if(_.ios||_.firefoxBrowser)result=true;else if(_.android){if(_.version>="4.1.0")if(/EK-GN120|SM-G386F/.test(_ua))result=false;else result=true;else if(_.version>="4.0.3"&&/SHW-|SHV-|GT-|SCH-|SGH-|SPH-|LG-F160|LG-F100|LG-F180|LG-F200|EK-|IM-A|LG-F240|LG-F260/.test(_ua)&&!/SHW-M420|SHW-M200|GT-S7562/.test(_ua))result=true}else result=true;return result}();_.useTransition=function(){if(_.android){if(_.version>="4.3")return true}else if(_.ios)if(parseInt(_.version,10)<="6")return true;return false}();_.hasClickBug=function(){return _.ios}();_.hasHighlightBug=function(){return _.chromeBrowser&&!_.sBrowser&&_.version<35}();_.hasOffsetBug=function(){var result=false;if(_.android){if(_.chrome||_.firefox)result=false;else if(_.version<"3")result=true}else result=false;return result}();if(_.ios&&parseInt(_.version)>=6)requestAnimationFrame(function(){});if(_.hasHighlightBug&&!document.getElementById("_jmc_no_tap_highlight_tag_")){var elStyleTag=document.createElement("style");var elHTML=document.getElementsByTagName("html")[0];elStyleTag.type="text/css";elStyleTag.id="_jmc_no_tap_highlight_tag_";elHTML.insertBefore(elStyleTag,elHTML.firstChild);var oSheet=elStyleTag.sheet||elStyleTag.styleSheet;oSheet.insertRule("."+_.KITKAT_HIGHLIGHT_CLASS+" { -webkit-tap-highlight-color: rgba(0,0,0,0); }",0);oSheet.insertRule("."+_.KITKAT_HIGHLIGHT_CLASS+" * { -webkit-tap-highlight-color: rgba(0,0,0,0); }",0)}return _}();function mComponent(){}mComponent.prototype={_eventHandler:{},on:function(type,fn){var handler=this._eventHandler[type];if("undefined"==typeof handler)handler=this._eventHandler[type]=[];handler.push(fn);return this},off:function(type,fn){if(this.has(type)){var index=this._eventHandler[type].indexOf(fn);if(index!=-1)this._eventHandler[type].splice(index,1)}return this},trigger:function(type,param){if(!this.has(type))return true;var fns=this._eventHandler[type].concat();_$.extend(param,{_type:type});if("undefined"==typeof param._extend){param._extend=[];param.stop=function(){if(param._extend.length>0)param._extend[param._extend.length-1].cancel=true}}param._extend.push({cancel:false});for(var i=0,len=fns.length;i<len;i++)fns[i].call(this,param);return!param._extend.pop().cancel},has:function(type){return!!this._eventHandler[type]}};var mEffect=function(effect){if(this instanceof arguments.callee)throw new Error("You can't create a instance of this");var number=/^(\-?[0-9\.]+)(%|\w+)?$/,RGB=/^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i,RGBA=/^rgba\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+),\s?([0-9\.]+)\)$/i,HSL=/^hsl\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%\)$/i,HSLA=/^hsla\(([0-9\.]+)\s?,\s?([0-9\.]+)%\s?,\s?([0-9\.]+)%,\s?([0-9\.]+)\)$/i,hex=/^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,color3to6=/^#([0-9A-F])([0-9A-F])([0-9A-F])$/i;var getUnitAndValue=function(v){var value=v,unit;if(number.test(v)){value=parseFloat(v);unit=RegExp.$2||""}else if(RGB.test(v)){value={rgb:[parseInt(RegExp.$1,10),parseInt(RegExp.$2,10),parseInt(RegExp.$3,10),1]};unit="color"}else if(RGBA.test(v)){value={rgb:[parseInt(RegExp.$1,10),parseInt(RegExp.$2,10),parseInt(RegExp.$3,10),parseFloat(RegExp.$4)]};unit="color"}else if(HSL.test(v)){value={hsl:[parseFloat(RegExp.$1),parseFloat(RegExp.$2)/100,parseFloat(RegExp.$3)/100,1]};value.rgb=hsl2rgb.apply(this,value.hsl);unit="color"}else if(HSLA.test(v)){value={hsl:[parseFloat(RegExp.$1),parseFloat(RegExp.$2)/100,parseFloat(RegExp.$3)/100,parseFloat(RegExp.$4)]};value.rgb=hsl2rgb.apply(this,value.hsl);unit="color"}else if(hex.test(v=v.replace(color3to6,"#$1$1$2$2$3$3"))){value={rgb:[parseInt(RegExp.$1,16),parseInt(RegExp.$2,16),parseInt(RegExp.$3,16),1]};unit="color"}else{console.trace("error");throw new Error("unit error ("+v+")")}return{value:value,unit:unit}};var explode=function(str){var ret=[];str.replace(/([^\s]+\([^\)]*\)|[^\s]+)\s?/g,function(_,a){ret.push(a)});return ret};var getUnitAndValueList=function(v){var list=explode(v?v+"":"0"),ret=[];for(var i=0,len=list.length;i<len;i++)ret.push(getUnitAndValue(list[i]));return ret};var hsl2rgb=function(H,S,L,alpha){H=H%360/60;var C=(1-Math.abs(2*L-1))*S;var X=C*(1-Math.abs(H%2-1));var R1=0,G1=0,B1=0;if(H>=5||H<1){R1=C;B1=X}else if(H>=4){R1=X;B1=C}else if(H>=3){G1=X;B1=C}else if(H>=2){G1=C;B1=X}else if(H>=1){R1=X;G1=C}var m=L-C/2;return[Math.round(255*(R1+m)),Math.round(255*(G1+m)),Math.round(255*(B1+m)),alpha]};return function(start,end){var arrayStart,arrayEnd;var parse=function(){var changed=false;if(instance.start!==start){arrayStart=getUnitAndValueList(instance.start);start=instance.start;changed=true}if(instance.end!==end){arrayEnd=getUnitAndValueList(instance.end);end=instance.end;changed=true}if(changed){var len=Math.max(arrayStart.length,arrayEnd.length);if(arrayStart.length!==arrayEnd.length&&len>1){switch(arrayStart.length){case 1:_$.extend(arrayStart[1],arrayStart[0]);case 2:_$.extend(arrayStart[2],arrayStart[0]);case 3:_$.extend(arrayStart[3],arrayStart[1])}switch(arrayEnd.length){case 1:_$.extend(arrayEnd[1],arrayEnd[0]);case 2:_$.extend(arrayEnd[2],arrayEnd[0]);case 3:_$.extend(arrayEnd[3],arrayEnd[1])}}for(var i=0,oStart,oEnd;i<len;i++){oStart=arrayStart[i];oEnd=arrayEnd[i];if(0===oStart.value)oStart.unit=oEnd.unit;else if(0===oEnd.value)oEnd.unit=oStart.unit;if(oStart.unit!=oEnd.unit)throw new Error("unit error ("+start+" ~ "+end+")")}}};var instance=function(p){var values=[];parse();for(var i=0,len=Math.max(arrayStart.length,arrayEnd.length),oStart,oEnd,alpha,unit;i<len;i++){oStart=arrayStart[i];oEnd=arrayEnd[i];start=oStart.value;end=oEnd.value;unit=oStart.unit;var value=effect(p),getResult=function(s,d,unit){return Math.round(1e6*((d-s)*value+s))/1e6+(unit||0)};if("color"!==unit){values.push(getResult(start,end,unit));continue}if(start.hsl&&end.hsl){start=start.hsl;end=end.hsl;var h=Math.round(getResult(start[0],end[0]));var s=100*Math.max(0,Math.min(1,getResult(start[1],end[1])));var l=100*Math.max(0,Math.min(1,getResult(start[2],end[2])));alpha=getResult(start[3],end[3]);if(1===alpha)values.push("hsl("+[h,s+"%",l+"%"].join(",")+")");else values.push("hsla("+[h,s+"%",l+"%",alpha].join(",")+")")}else{start=start.rgb;end=end.rgb;var r=Math.max(0,Math.min(255,Math.round(getResult(start[0],end[0]))));var g=Math.max(0,Math.min(255,Math.round(getResult(start[1],end[1]))));var b=Math.max(0,Math.min(255,Math.round(getResult(start[2],end[2]))));alpha=getResult(start[3],end[3]);if(1===alpha){var dummy=(r<<16|g<<8|b).toString(16).toUpperCase();values.push("#"+Array(7-dummy.length).join("0")+dummy)}else values.push("rgba("+[r,g,b,alpha].join(",")+")")}}return values.join(" ")};switch(arguments.length){case 0:break;case 1:end=start||"0";start="0"}instance.start=start;instance.end=end;instance.effectConstructor=arguments.callee;start=end=null;if(arguments.length>1)parse();return instance}};mEffect._cubicBezier=function(x1,y1,x2,y2){return function(t){var cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;function sampleCurveX(t){return((ax*t+bx)*t+cx)*t}function sampleCurveY(t){return((ay*t+by)*t+cy)*t}function sampleCurveDerivativeX(t){return(3*ax*t+2*bx)*t+cx}function solveCurveX(x,epsilon){var t0,t1,t2,x2,d2,i;for(t2=x,i=0;i<8;i++){x2=sampleCurveX(t2)-x;if(Math.abs(x2)<epsilon)return t2;d2=sampleCurveDerivativeX(t2);if(Math.abs(d2)<1e-6)break;t2-=x2/d2}t0=0;t1=1;t2=x;if(t2<t0)return t0;if(t2>t1)return t1;while(t0<t1){x2=sampleCurveX(t2);if(Math.abs(x2-x)<epsilon)return t2;if(x>x2)t0=t2;else t1=t2;t2=.5*(t1-t0)+t0}return t2}return sampleCurveY(solveCurveX(t,1/200))}};mEffect.cubicBezier=function(x1,y1,x2,y2){var f=mEffect(mEffect._cubicBezier(x1,y1,x2,y2));var cssTimingFunction="cubic-bezier("+[x1,y1,x2,y2].join(",")+")";f.toString=function(){return cssTimingFunction};return f};mEffect.linear=mEffect(function(s){return s});mEffect.linear.toString=function(){return"linear"};mEffect.easeIn=mEffect(function(s){return Math.pow(s,3)});mEffect.easeIn.toString=function(){return"ease-in"};mEffect.easeOut=mEffect(function(s){return Math.pow(s-1,3)+1});mEffect.easeOut.toString=function(){return"ease-out"};mEffect.easeInOut=mEffect(function(s){return s<.5?.5*mEffect.easeIn(0,1)(2*s):.5*mEffect.easeOut(0,1)(2*s-1)+.5});mEffect.easeInOut.toString=function(){return"ease-in-out"};mTouch.NONE=0;mTouch.HSCROLL=1;mTouch.VSCROLL=2;mTouch.DSCROLL=3;mTouch.TAP=4;function mTouch(el,option){this.option={tapThreshold:6,slopeThreshold:25,moveThreshold:7};_$.extend(this.option,option);this.wrapper="string"==typeof el?document.querySelector(el):el;this._init()}mTouch.prototype={_init:function(){this.info={start:{},before:{},toucheCount:0,actions:[]};this._eventType=function(){if("ontouchstart"in window)return{type:"touch",start:"touchstart",move:"touchmove",end:"touchend",cancel:"touchcancel"};else return{type:"mouse",start:"mousedown",move:"mousemove",end:"mouseup",cancel:null}}();this._setSlope();this._manageEvent()},_setSlope:function(){this.slope={h:1*(window.innerHeight/2/window.innerWidth).toFixed(2),v:1*(window.innerHeight/(window.innerWidth/2)).toFixed(2)}},_manageEvent:function(remove){var method=remove?"removeEventListener":"addEventListener";this.wrapper[method](this._eventType.start,this);this.wrapper[method](this._eventType.move,this);this.wrapper[method](this._eventType.end,this);null!=this._eventType.cancel&&this.wrapper[method](this._eventType.cancel,this)},handleEvent:function(e){switch(e.type){case this._eventType.start:this._start(e);break;case this._eventType.move:this._move(e);break;case this._eventType.cancel:case this._eventType.end:this._end(e)}},_getTouchInfo:function(e){var result=[],time=e.timeStamp;if("touch"==this._eventType.type){var touches=e.touches;if(touches.length<=1)touches=e.changedTouches;for(var i=0,len=touches.length,touch;i<len;i++){touch=touches[i];result.push({time:time,x:touch.pageX,y:touch.pageY})}}else result.push({time:time,x:e.pageX,y:e.pageY});return result},_resetTouchInfo:function(){if(0==this.info["actions"].length)return;this.info={start:{},before:{},toucheCount:0,actions:[]};this.moveType=mTouch.NONE},_determineMoveType:function(info){if(this.moveType==mTouch.NONE||this.moveType==mTouch.TAP){var distX=Math.abs(this.info["start"].x-info.x),distY=Math.abs(this.info["start"].y-info.y),dist=distX+distY;if(distX<=this.option.tapThreshold&&distY<=this.option.tapThreshold)this.moveType=mTouch.TAP;else this.moveType=mTouch.NONE;if(this.option.slopeThreshold<=dist){var nSlope=parseFloat((distY/distX).toFixed(2),10);if(this.slope.h===-1&&this.slope.v===-1)this.moveType=mTouch.DSCROLL;else if(nSlope<=this.slope.h)this.moveType=mTouch.HSCROLL;else if(nSlope>=this.slope.v)this.moveType=mTouch.VSCROLL;else this.moveType=mTouch.DSCROLL}}},_getEventParam:function(info){var startInfo=this.info["start"],beforeInfo=this.info["before"],shortestInfo=this.info["actions"][0],ret={duration:info.time-startInfo.time,distanceX:this.moveType===mTouch.VSCROLL?0:info.x-startInfo.x,distanceY:this.moveType===mTouch.HSCROLL?0:info.y-startInfo.y,shortestDistanceX:this.moveType===mTouch.VSCROLL?0:info.x-shortestInfo.x,shortestDistanceY:this.moveType===mTouch.HSCROLL?0:info.y-shortestInfo.y,shortestDuration:info.time-shortestInfo.time,vectorX:info.x-beforeInfo.x,vectorY:info.y-beforeInfo.y,moveType:this.moveType};if("touch"==this._eventType.type){ret.x=info.x;ret.y=info.y}return ret},_saveActions:function(info){_$.extend(this.info["before"],info);this.info["actions"].push(_$.extend({},info));this.info["actions"].length>5&&this.info["actions"].shift()},_start:function(e){if(!this.has("start"))return;var infos=this._getTouchInfo(e);this.info["toucheCount"]=infos.length;if(infos.length>1)return;else this._resetTouchInfo();e.moveType=this.moveType=mTouch.TAP;this.trigger("start",e);this.info["start"]=infos[0];this._saveActions(infos[0])},_move:function(e){if(!this.has("move"))return;if(this.info["toucheCount"]<=0)return;var info=this._getTouchInfo(e)[0];this._determineMoveType(info);var param=this._getEventParam(info),dist=0;switch(this.moveType){case mTouch.HSCROLL:dist=Math.abs(param.distanceX);break;case mTouch.VSCROLL:dist=Math.abs(param.distanceY);break;case mTouch.DSCROLL:dist=Math.abs(Math.sqrt(Math.pow(param.distanceX,2)+Math.pow(param.distanceY,2)))}if(dist<this.option.moveThreshold||dist<this.option.slopeThreshold||this.moveType==mTouch.NONE||this.moveType==mTouch.TAP)return;this.trigger("move",_$.extend(e,param));this._saveActions(info)},_end:function(e){if(!this.has("end"))return;var infos=this._getTouchInfo(e);this.info["toucheCount"]-=infos.length;if(this.info["toucheCount"]>0)return;this.trigger("end",_$.extend(e,this._getEventParam(infos[0])));this._resetTouchInfo()},destory:function(){this._manageEvent(true);this._resetTouchInfo()}};_$.extend(mTouch.prototype,mComponent.prototype);mScroll.VERSION="#__VERSION__#";mScroll.HSCROLLBAR_CLASS="__scroll_for_Hscrollbar__";mScroll.VSCROLLBAR_CLASS="__scroll_for_Vscrollbar__";function mScroll(el,option){this.option={deceleration:5e-4,momentumDuration:_$.android?500:200,effect:mEffect.cubicBezier(.18,.35,.56,1),useHorizontal:false,useVertical:true,useDiagonalTouch:true,useBounce:true,useMomentum:true,use3d:_$.use3d,useTransition:_$.useTransition,useScrollbar:true,useFadeScrollbar:true};_$.extend(this.option,option);this.option.useTransition=false;this.wrapper="string"==typeof el?document.querySelector(el):el;this._init();this.refresh()}mScroll.prototype={_init:function(){this._timer={ani:-1,touch:-1,updater:-1,bugOffset:-1,bugHighlight:-1};this._queue=[];this._bufferPos={x:0,y:0};this.x=0;this.y=0;this._setStyle();this.touch=new mTouch(this.wrapper,{tapThreshold:1,slopeThreshold:5,moveThreshold:0});this._manageEvent()},_setInitStyle:function(css){css=css||{};css[_$.toPrefixStr("transform")]=_$.getTranslate(0,0,this.option.use3d);if(this.option.useTransition)css[_$.toPrefixStr("transitionTimingFunction")]=this.option.effect.toString();return css},_setStyle:function(){var wrapperStyle=this.wrapper.style,wrapperCss={overflow:"hidden"},scrollerCss={left:"0px",top:"0px"};(""==wrapperStyle.position||"static"==wrapperStyle.position)&&(wrapperCss.position="relative");this.scroller=this.wrapper.children[0];this.scrollerStyle=this.scroller.style;(""==this.scrollerStyle.position||"static"==this.scrollerStyle.position)&&(scrollerCss.position="relative");this._setInitStyle(scrollerCss);_$.extend(this.scrollerStyle,scrollerCss);_$.extend(wrapperStyle,wrapperCss);if(_$.hasOffsetBug){this.dummy=this.scroller.querySelector("._scroller_dummy_atag_");if(!this.dummy){this.dummy=document.createElement("a");this.dummy.href="javascript:void(0);";this.dummy.className="_scroller_dummy_atag_";_$.extend(this.dummy.style,{position:"absolute",height:"0px",width:"0px"});this.scroller.appendChild(this.dummy)}}if(this.option.useScrollbar){this.option.useVertical&&this._createScrollbar("v");this.option.useHorizontal&&this._createScrollbar("h")}},_manageEvent:function(remove){var method=remove?"off":"on";this.touch[method]("start",this._start.bind(this));this.touch[method]("move",this._move.bind(this));this.touch[method]("end",this._end.bind(this));!this.option.useTransition&&(this.updater=function(){if(this._bufferPos.x!=this.x||this._bufferPos.y!=this.y)this._setPos(this._bufferPos.x,this._bufferPos.y);this._startUpdater()}.bind(this));_$.hasOffsetBug&&(this._fixOffsetBugFunc=function(){if(this.scroller){this._translateToStyle(this.scroller);if(parseInt(_$.version,10)<=3)this.dummy.focus();console.error("[todo] android 3.0이하에서 발생하는 offsetBug 처리")}}.bind(this));_$.hasHighlightBug&&(this._fixHighlightFunc=function(){_$.addClass(this.wrapper,_$.KITKAT_HIGHLIGHT_CLASS)}.bind(this))},_createScrollbar:function(direction){var className="v"==direction?mScroll.VSCROLLBAR_CLASS:mScroll.HSCROLLBAR_CLASS,scrollbar=this.wrapper.querySelector("div."+className),indicator;if(!scrollbar){var scrollbarStyle="pointer-events:none; position:absolute; z-index:9999;",indecatorStyle="position:absolute;background-color:rgba(0,0,0,0.3);border-radius:3px;left:0px;top:0px;";indicator=document.createElement("div"),scrollbar=document.createElement("div");scrollbar.className=className;if("v"==direction){scrollbarStyle+="width:7px;bottom:2px;top:2px;right:1px;";indecatorStyle+="width:100%;"}else{scrollbarStyle+="height:7px;left:2px;right:2px;bottom:0;";indecatorStyle+="height:100%;"}scrollbar.style.cssText=scrollbarStyle;indicator.style.cssText=indecatorStyle;_$.extend(indicator.style,this._setInitStyle());scrollbar.appendChild(indicator);this.wrapper.appendChild(scrollbar)}this[direction+"scrollbar"]=scrollbar;this[direction+"indicator"]=indicator||scrollbar.children[0]},_refreshScrollbar:function(direction){if("v"==direction){if(!this.useVScroll||this.wrapperH==this.scrollerH){this.hscrollbar.style.display="none";return}}else if(!this.useHScroll||this.wrapperW==this.scrollerW){this.vscrollbar.style.display="none";return}var size=0,p;if("v"==direction){p="height";size=Math.max(Math.round(Math.pow(this.wrapperH,2)/this.scrollerH),8);this._vindicatorProp=(this.wrapperH-size)/this.maxScrollY}else{p="width";size=Math.max(Math.round(Math.pow(this.wrapperV,2)/this.scrollerV),8);this._hindicatorProp=(this.wrapperW-size)/this.maxScrollX}this[direction+"indicator"].style[p]=(isNaN(size)?0:size)+"px"},refresh:function(){_$.hasHighlightBug&&_$.addClass(this.wrapper,_$.KITKAT_HIGHLIGHT_CLASS);this.wrapperW=this.wrapper.clientWidth;this.wrapperH=this.wrapper.clientHeight;this.scrollerW=this.scroller.offsetWidth;this.scrollerH=this.scroller.offsetHeight;this.maxScrollX=this.wrapperW-this.scrollerW;this.maxScrollY=this.wrapperH-this.scrollerH;this.useHScroll=this.option.useHorizontal&&this.maxScrollX<=0;this.useVScroll=this.option.useVertical&&this.maxScrollX<=0;this.useHScroll&&!this.useVScroll&&(this.scrollerStyle.height="100%");this.useVScroll&&!this.useHScroll&&(this.scrollerStyle.width="100%");if(this.option.useScrollbar){this.useVScroll&&this._refreshScrollbar("v");this.useHScroll&&this._refreshScrollbar("h")}!this.useHScroll&&!this.useVScroll&&this._fixOffsetBug()},_translateToStyle:function(e){var translateOffset=_$.getTranslateOffset(e);var styleOffset=_$.getStyleOffset(this.scrollerStyle);_$.extend(this.scrollerStyle,{left:translateOffset.left+styleOffset.left+"px",top:styleOffset.left+styleOffset.left+"px"})},_fixOffsetBug:function(){if(_$.hasOffsetBug){this._clearOffsetBug();this._timer["bugOffset"]=setTimeout(this._fixOffsetBugFunc,200)}},_fixHighlight:function(){if(_$.hasHighlightBug){_$.removeClass(this.wrapper,_$.KITKAT_HIGHLIGHT_CLASS);this.wrapper.clientHeight;clearTimeout(this._timer["bugHighlight"]);this._timer["bugHighlight"]=setTimeout(this._fixHighlightFunc,200)}},_clearOffsetBug:function(){if(_$.hasOffsetBug){clearTimeout(this._timer["bugOffset"]);this._timer["bugOffset"]=-1}},_clearTouchEnd:function(){if(this._timer["touch"]!=-1){clearTimeout(this._timer["touch"]);this._timer["touch"]=-1}},_preventSystemScroll:function(e){switch(e.moveType){case mTouch.HSCROLL:if(this.useHScroll)if(!this.option.useBounce&&(this.x>=0&&e.vectorX>0||this.x<=this.maxScrollX&&e.vectorX<0))return;else{e.preventDefault();e.stopPropagation()}break;case mTouch.VSCROLL:if(this.useVScroll)if(!this.option.useBounce&&(this.y>=0&&e.vectorY>0||this.y<=this.maxScrollY&&e.vectorY<0))return;else{e.preventDefault();e.stopPropagation()}break;case mTouch.DSCROLL:if(this.option.useDiagonalTouch){e.preventDefault();e.stopPropagation()}else return;break;default:e.preventDefault();e.stopPropagation()}},_start:function(e){this._clearTimer();this.isPlaying&&this._stopScroll()},_move:function(e){this._clearTimer();_$.hasClickBug&&(this.scrollerStyle.pointerEvents="none");if(this.trigger("beforeMove",e)){this._preventSystemScroll(e);var nextX=0,nextY=0;if(this.option.useBounce){this.useHScroll&&(nextX=this.x+(this.x>=0||this.x<=this.maxScrollX?e.vectorX/3:e.vectorX));this.useVScroll&&(nextY=this.y+(this.y>=0||this.y<=this.maxScrollY?e.vectorY/3:e.vectorY));if(e._type.indexOf("touch")!=-1)this._timer["touch"]=setTimeout(function(){}.bind(this),500)}else{nextX=this._boundaryX(this.x+e.vectorX);nextY=this._boundaryY(this.y+e.vectorY)}this._setPos(nextX,nextY)}else{e.preventDefault();e.stopPropagation()}},_end:function(e){this._clearTimer();switch(e.moveType){case mTouch.HSCROLL:case mTouch.VSCROLL:case mTouch.DSCROLL:this._endForScroll(e);break;default:this._fixHighlight()}_$.hasClickBug&&(this.scrollerStyle.pointerEvents="auto")},_setPos:function(x,y){this.x=x=Number(this.useHScroll?x:0);this.y=y=Number(this.useVScroll?y:0);var styleOffset=_$.hasOffsetBug?_$.getStyleOffset(this.scrollerStyle):{left:0,top:0};x-=styleOffset.left,y-=styleOffset.top;this.scrollerStyle[_$.toPrefixStr("transform")]=_$.getTranslate(x+"px",y+"px",this.option.use3d);if(this.option.useScrollbar){this.useVScroll&&this._setScrollbarPos("v",this.y);this.useHScroll&&this._setScrollbarPos("h",this.x)}this._bufferPos={x:this.x,y:this.y};this.trigger("position",{x:this.x,y:this.y})},_stopScroll:function(){this._stopUpdater();this._stop();this._fixOffsetBug()},_setScrollbarPos:function(direction,pos){pos=this["_"+direction+"indicator"+"Prop"]*pos;var Indicator=this[direction+"indicator"],IndicatorStyle=Indicator.style;if(_$.hasOffsetBug){var bufferPos=parseInt("h"===direction?IndicatorStyle.left:IndicatorStyle.top,10);pos-=isNaN(bufferPos)?0:bufferPos}IndicatorStyle[_$.toPrefixStr("transform")]=_$.getTranslate("h"==direction?pos+"px":0,"h"==direction?0:pos+"px",this.option.use3d)},_boundaryX:function(x){return this.useHScroll?x>0?0:x<this.maxScrollX?this.maxScrollX:x:0},_boundaryY:function(y){return this.useVScroll?y>0?0:y<this.maxScrollY?this.maxScrollY:y:0},_clearTimer:function(){this._clearOffsetBug();this._clearTouchEnd()},_endForScroll:function(e){var param={x:this.x,y:this.y,nextX:this.x,nextY:this.y},isMomentum=e.shortestDuration<=this.option.momentumDuration;if(isMomentum){var speedX=0,speedY=0,nextX={distance:0,duration:0},nextY={distance:0,duration:0};if(this.useHScroll){speedX=Math.abs(e.shortestDistanceX)/e.shortestDuration;nextX=this._getMomentum(-e.shortestDistanceX,speedX,this.wrapperW,-this.x,-this.maxScrollX+this.x);param.nextX=this.x+nextX.distance}if(this.useVScroll){speedY=Math.abs(e.shortestDistanceY)/e.shortestDuration;nextY=this._getMomentum(-e.shortestDistanceY,speedY,this.wrapperH,-this.y,-this.maxScrollY+this.y);param.nextY=this.y+nextY.distance}param.duration=Math.max(Math.max(nextX.duration,nextY.duration),10);console.info(param.y,"=>",param.nextY,"(",param.duration,")")}else param.duration=0;if(this.trigger("beforeScroll",param))if(isMomentum)if(this.option.useBounce)this.scrollTo(param.nextX,param.nextY,param.duration);else this.scrollTo(this._boundaryX(param.nextX),this._boundaryY(param.nextY),param.duration);else if(this.useHScroll&&(param.nextX>0||param.nextX<this.maxScrollX)||this.useVScroll&&(param.nextY>0||param.nextY<this.maxScrollY))this.restore(300);else this._setPos(param.nextX,param.nextY)},restore:function(duration){var nextX=this._boundaryX(this.x),nextY=this._boundaryY(this.y);if(nextX===this.x&&nextY==this.y)this.isPlaying=false;else this.scrollTo(nextX,nextY,duration)},_stop:function(){if(this.option.useTransition);else{cancelAnimationFrame(this._timer["ani"]);this._stopUpdater()}this.isPlaying&&this._setPos(this.x,this.y);this._queue.length=0;this.isPlaying=false},scrollTo:function(x,y,duration){this._stop();this._queue.push({x:this.useHScroll?x:0,y:this.useVScroll?y:0,duration:duration||0});this._animate()},_animate:function(){var step;if(this.isPlaying)return;if(!this._queue.length){this.restore(300);return}do{step=this._queue.shift();if(!step)return}while(step.x=this.x&&step.y==this.y);if(0==step.duration){this._setPos(step.x,step.y);this._animate();return}var self=this;this.isPlaying=true;if(this.option.useTransition);else this._animationTimer(step)},_animationTimer:function(step){var self=this;var startTime=(new Date).getTime(),fx=this.useHScroll?this.option.effect(this.x,step.x):0,fy=this.useVScroll?this.option.effect(this.y,step.y):0,now;this._startUpdater();!function animate(){now=(new Date).getTime();if(now>=startTime+step.duration){self._stopUpdater();self._setPos(step.x,step.y);self.isPlaying=false;self._animate();return}now=(now-startTime)/step.duration;self._bufferPos={x:fx&&fx(now),y:fy&&fy(now)};if(self.isPlaying)self._timer["ani"]=requestAnimationFrame(animate);else self._stopUpdater()}()},_startUpdater:function(){this._stopUpdater();this._timer["updater"]=requestAnimationFrame(this.updater)},_stopUpdater:function(){cancelAnimationFrame(this._timer["updater"]);this._timer["updater"]=-1},_getMomentum:function(distance,speed,size,current,max){var deceleration=this.option.deceleration,momentum=speed*speed/2,nextDist=momentum/deceleration,nextDuration=0,outBoundSize=0;if(distance<0&&nextDist>current){outBoundSize=size/(6/(nextDist/speed*deceleration));current+=outBoundSize;speed=speed*current/nextDist;nextDist=current}else if(distance>0&&nextDist>max){outBoundSize=size/(6/(nextDist/speed*deceleration));max+=outBoundSize;speed=speed*max/nextDist;nextDist=max}nextDist*=distance>0?-1:1;nextDuration=speed/deceleration-this.option.momentumDuration;nextDuration=nextDuration<0?0:nextDuration;return{distance:nextDist,duration:Math.round(nextDuration)}},destroy:function(){this._manageEvent(true);this.touch.destroy()}};_$.extend(mScroll.prototype,mComponent.prototype);
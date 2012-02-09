/**
 * Jindo Component
 * @version 1.0.2
 * NHN_Library:Jindo_Component-1.0.2;JavaScript Components for Jindo;
 * 
 * jindo.Component
 * jindo.UIComponent
 * jindo.Effect
 * jindo.Timer
 * jindo.Transition
 * jindo.DragArea
 * jindo.RolloverArea
 * jindo.Foggy
 * jindo.DropArea
 */

/**
 * @fileOverview 진도 컴포넌트를 구현하기 위한 코어 클래스
 * @version 1.0.2
 */
jindo.Component = jindo.$Class({
	/** @lends jindo.Component.prototype */

	_htEventHandler : null,
	_htOption : null,

	/**
	 * jindo.Component를 초기화한다.
	 * @class 다른 컴포넌트가 상속해 사용하는 Jindo Component의 Core
	 * @constructs  
	 */
	$init : function() {
		var aInstance = this.constructor.getInstance();
		aInstance.push(this);
		this._htEventHandler = {};
		this._htOption = {};
		this._htOption._htSetter = {};
	},
	
	/**
	 * 옵션값을 설정하거나 가져온다.
	 * htCustomEventHandler 옵션을 선언해서 attach() 메소드를 사용하지 않고 커스텀 이벤트핸들러를 등록할 수 있다.
	 * @param {String} sName 옵션의 이름
	 * @param {String} sValue 옵션의 값
	 * @return {this} 컴포넌트 객체 자신
	 * @example
var MyComponent = jindo.$Class({
	method : function() {
		alert(this.option("foo"));
	}
}).extend(jindo.Component);

var oInst = new MyComponent();
oInst.option("foo", 123); // 또는 oInst.option({ foo : 123 });
oInst.method(); // 결과 123
	 * @example
//커스텀이벤트핸들러 등록예제
oInst.option("htCustomEventHandler", {
	test : function(oCustomEvent) {
	
	}
});

//이미 "htCustomEventHandler" 옵션이 설정되어있는 경우에는 무시된다.
oInst.option("htCustomEventHandler", {
	change : function(oCustomEvent) {
	
	}
});
	 */
	option : function(sName, vValue) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption;
			case "string" : 
				if (typeof vValue != "undefined") {
					if (sName == "htCustomEventHandler") {
						if (typeof this._htOption[sName] == "undefined") {
							this.attach(vValue);
						} else {
							return this;
						}
					}
					
					this._htOption[sName] = vValue;
					if (typeof this._htOption._htSetter[sName] == "function") {
						this._htOption._htSetter[sName](vValue);	
					}
				} else {
					return this._htOption[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					if (sKey == "htCustomEventHandler") {
						if (typeof this._htOption[sKey] == "undefined") {
							this.attach(sName[sKey]);
						} else {
							continue;
						}
					}
					
					this._htOption[sKey] = sName[sKey];
					if (typeof this._htOption._htSetter[sKey] == "function") {
						this._htOption._htSetter[sKey](sName[sKey]);	
					}
				}
				break;
		}
		return this;
	},
	
	/**
	 * 옵션의 setter 함수를 설정하거나 가져온다.
	 * 옵션의 setter 함수는 지정된 옵션이 변경되면 수행되는 함수이다.
	 * @param {String} sName setter의 이름
	 * @param {Function} fSetter setter 함수
	 * @return {this} 컴포넌트 객체 자신
	 * @example
oInst.option("sMsg", "test");
oInst.optionSetter("sMsg", function(){
	alert("sMsg 옵션값이 변경되었습니다.");
});
oInst.option("sMsg", "change"); -> alert발생
	 * @example
//HashTable 형태로 설정가능
oInst.optionSetter({
	"sMsg" : function(){
	},
	"nNum" : function(){
	}
});
	 */
	optionSetter : function(sName, fSetter) {
		switch (typeof sName) {
			case "undefined" :
				return this._htOption._htSetter;
			case "string" : 
				if (typeof fSetter != "undefined") {
					this._htOption._htSetter[sName] = jindo.$Fn(fSetter, this).bind();
				} else {
					return this._htOption._htSetter[sName];
				}
				break;
			case "object" :
				for(var sKey in sName) {
					this._htOption._htSetter[sKey] = jindo.$Fn(sName[sKey], this).bind();
				}
				break;
		}
		return this;
	},
	
	/**
	 * 이벤트를 발생시킨다.
	 * @param {Object} sEvent 커스텀이벤트명
	 * @param {Object} oEvent 커스텀이벤트 핸들러에 전달되는 객체.
	 * @return {Boolean} 핸들러의 커스텀이벤트객체에서 stop메소드가 수행되면 false를 리턴
	 * @example
//커스텀 이벤트를 발생시키는 예제
var MyComponent = jindo.$Class({
	method : function() {
		this.fireEvent('happened', {
			sHello : 'world',
			sAbc : '123'
		});
	}
}).extend(jindo.Component);

var oInst = new MyComponent().attach({
	happened : function(oCustomEvent) {
		alert(eCustomEvent.sHello + '/' + oCustomEvent.nAbc); // 결과 : world/123
	}
};

<button onclick="oInst.method(event);">Click me</button> 
	 */
	fireEvent : function(sEvent, oEvent) {
		oEvent = oEvent || {};
		var fInlineHandler = this['on' + sEvent],
			aHandlerList = this._htEventHandler[sEvent] || [],
			bHasInlineHandler = typeof fInlineHandler == "function",
			bHasHandlerList = aHandlerList.length > 0;
			
		if (!bHasInlineHandler && !bHasHandlerList) {
			return true;
		}
		aHandlerList = aHandlerList.concat(); //fireEvent수행시 핸들러 내부에서 detach되어도 최초수행시의 핸들러리스트는 모두 수행
		
		oEvent.sType = sEvent;
		if (typeof oEvent._aExtend == 'undefined') {
			oEvent._aExtend = [];
			oEvent.stop = function(){
				if (oEvent._aExtend.length > 0) {
					oEvent._aExtend[oEvent._aExtend.length - 1].bCanceled = true;
				}
			};
		}
		oEvent._aExtend.push({
			sType: sEvent,
			bCanceled: false
		});
		
		var aArg = [oEvent], 
			i, nLen;
			
		for (i = 2, nLen = arguments.length; i < nLen; i++){
			aArg.push(arguments[i]);
		}
		
		if (bHasInlineHandler) {
			fInlineHandler.apply(this, aArg);
		}
	
		if (bHasHandlerList) {
			var fHandler;
			for (i = 0, fHandler; (fHandler = aHandlerList[i]); i++) {
				fHandler.apply(this, aArg);
			}
		}
		
		return !oEvent._aExtend.pop().bCanceled;
	},

	/**
	 * 커스텀 이벤트 핸들러를 등록한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToAttach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 등록 방법 예제
//아래처럼 등록하면 appear 라는 사용자 이벤트 핸들러는 총 3개가 등록되어 해당 이벤트를 발생시키면 각각의 핸들러 함수가 모두 실행됨.
//attach 을 통해 등록할때는 이벤트명에 'on' 이 빠지는 것에 유의.
function fpHandler1(oEvent) { .... };
function fpHandler2(oEvent) { .... };

var oInst = new MyComponent();
oInst.onappear = fpHandler1; // 직접 등록
oInst.attach('appear', fpHandler1); // attach 함수를 통해 등록
oInst.attach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	attach : function(sEvent, fHandlerToAttach) {
		if (arguments.length == 1) {

			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.attach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];

		if (typeof aHandler == 'undefined'){
			aHandler = this._htEventHandler[sEvent] = [];
		}

		aHandler.push(fHandlerToAttach);

		return this;
	},
	
	/**
	 * 커스텀 이벤트 핸들러를 해제한다.
	 * @param {Object} sEvent
	 * @param {Object} fHandlerToDetach
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//이벤트 해제 예제
oInst.onappear = null; // 직접 해제
oInst.detach('appear', fpHandler1); // detach 함수를 통해 해제
oInst.detach({
	appear : fpHandler1,
	more : fpHandler2
});
	 */
	detach : function(sEvent, fHandlerToDetach) {
		if (arguments.length == 1) {
			jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler, sEvent) {
				this.detach(sEvent, fHandler);
			}, this).bind());
		
			return this;
		}

		var aHandler = this._htEventHandler[sEvent];
		if (aHandler) {
			for (var i = 0, fHandler; (fHandler = aHandler[i]); i++) {
				if (fHandler === fHandlerToDetach) {
					aHandler = aHandler.splice(i, 1);
					break;
				}
			}
		}

		return this;
	},
	
	/**
	 * 등록된 모든 커스텀 이벤트 핸들러를 해제한다.
	 * @param {String} sEvent 이벤트명. 생략시 모든 등록된 커스텀 이벤트 핸들러를 해제한다. 
	 * @return {this} 컴포넌트 객체 자신
	 * @example
//"show" 커스텀이벤트 핸들러 모두 해제
oInst.detachAll("show");

//모든 커스텀이벤트 핸들러 해제
oInst.detachAll();
	 */
	detachAll : function(sEvent) {
		var aHandler = this._htEventHandler;
		
		if (arguments.length) {
			
			if (typeof aHandler[sEvent] == 'undefined') {
				return this;
			}
	
			delete aHandler[sEvent];
	
			return this;
		}	
		
		for (var o in aHandler) {
			delete aHandler[o];
		}
		return this;				
	}
});

/**
 * 다수의 컴포넌트를 일괄 생성하는 Static Method
 * @param {Array} aObject 기준엘리먼트의 배열
 * @param {HashTable} htOption 옵션객체의 배열
 * @return {Array} 생성된 컴포넌트 객체 배열
 * @example
var Instance = jindo.Component.factory(
	cssquery('li'),
	{
		foo : 123,
		bar : 456
	}
);
 */
jindo.Component.factory = function(aObject, htOption) {
	var aReturn = [],
		oInstance;

	if (typeof htOption == "undefined") {
		htOption = {};
	}
	
	for(var i = 0, el; (el = aObject[i]); i++) {
		oInstance = new this(el, htOption);
		aReturn[aReturn.length] = oInstance;
	}

	return aReturn;
};

/**
 * 컴포넌트의 생성된 인스턴스를 리턴한다.
 * @return {Array} 생성된 인스턴스의 배열
 */
jindo.Component.getInstance = function(){
	if (typeof this._aInstance == "undefined") {
		this._aInstance = [];
	}
	return this._aInstance;
};

/**
 * @fileOverview UI 컴포넌트를 구현하기 위한 코어 클래스
 * @version 1.0.2
 */
jindo.UIComponent = jindo.$Class({
	/** @lends jindo.UIComponent.prototype */
		
	/**
	 * jindo.UIComponent를 초기화한다.
	 * @constructs
	 * @class UI Component에 상속되어 사용되는 Jindo Component의 Core
	 * @extends jindo.Component
	 */
	$init : function() {
		this._bIsActivating = false; //컴포넌트의 활성화 여부
	},

	/**
	 * 컴포넌트의 활성여부를 가져온다.
	 * @return {Boolean}
	 */
	isActivating : function() {
		return this._bIsActivating;
	},

	/**
	 * 컴포넌트를 활성화한다.
	 * _onActivate 메소드를 수행하므로 반드시 상속받는 클래스에 _onActivate 메소드가 정의되어야한다.
	 * @return {this}
	 */
	activate : function() {
		if (this.isActivating()) {
			return this;
		}
		this._bIsActivating = true;
		
		if (arguments.length > 0) {
			this._onActivate.apply(this, arguments);
		} else {
			this._onActivate();
		}
				
		return this;
	},
	
	/**
	 * 컴포넌트를 비활성화한다.
	 * _onDeactivate 메소드를 수행하므로 반드시 상속받는 클래스에 _onDeactivate 메소드가 정의되어야한다.
	 * @return {this}
	 */
	deactivate : function() {
		if (!this.isActivating()) {
			return this;
		}
		this._bIsActivating = false;
		
		if (arguments.length > 0) {
			this._onDeactivate.apply(this, arguments);
		} else {
			this._onDeactivate();
		}
		
		return this;
	}
}).extend(jindo.Component);	

/**
 * @version 1.0.2
 */

/*
 * TERMS OF USE - EASING EQUATIONS
 * Open source under the BSD License.
 * Copyright (c) 2001 Robert Penner, all rights reserved.
 */

/**
 * 새로운 이펙트 함수를 생성한다.
 * @namespace 수치의 중간값을 쉽게 얻을 수 있게 하는 static 컴포넌트
 * @function
 * @param {Function} fEffect 0~1 사이의 숫자를 인자로 받아 정해진 공식에 따라 0~1 사이의 값을 리턴하는 함수
 * @return {Function} 이펙트 함수. 이 함수는 시작값과 종료값을 입력하여 특정 시점에 해당하는 값을 구하는 타이밍 함수를 생성한다.
 */
jindo.Effect = function(fEffect) {
	if (this instanceof arguments.callee) {
		throw new Error("You can't create a instance of this");
	}
	
	var rxNumber = /^(\-?[0-9\.]+)(%|px|pt|em)?$/,
		rxRGB = /^rgb\(([0-9]+)\s?,\s?([0-9]+)\s?,\s?([0-9]+)\)$/i,
		rxHex = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,
		rx3to6 = /^#([0-9A-F])([0-9A-F])([0-9A-F])$/i;
	
	var getUnitAndValue = function(v) {
		var nValue = v, sUnit;
		
		if (rxNumber.test(v)) {
			nValue = parseFloat(v); 
			sUnit = RegExp.$2 || "";
		} else if (rxRGB.test(v)) {
			nValue = [parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10), parseInt(RegExp.$3, 10)];
			sUnit = 'color';
		} else if (rxHex.test(v = v.replace(rx3to6, '#$1$1$2$2$3$3'))) {
			nValue = [parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16)];
			sUnit = 'color';
		} 
				
		return { 
			nValue : nValue, 
			sUnit : sUnit 
		};
	};
	
	return function(nStart, nEnd) {
		var sUnit;
		if (arguments.length > 1) {
			nStart = getUnitAndValue(nStart);
			nEnd = getUnitAndValue(nEnd);
			sUnit = nEnd.sUnit;
		} else {
			nEnd = getUnitAndValue(nStart);
			nStart = null;
			sUnit = nEnd.sUnit;
		} 
		
		// 두개의 단위가 다르면
		if (nStart && nEnd && nStart.sUnit != nEnd.sUnit) {
			throw new Error('unit error');
		}
		
		nStart = nStart && nStart.nValue;
		nEnd = nEnd && nEnd.nValue;
		
		var fReturn = function(p) {
			var nValue = fEffect(p),
				getResult = function(s, d) {
					return (d - s) * nValue + s + sUnit; 
				};
			
			if (sUnit == 'color') {
				var r = Math.max(0, Math.min(255, parseInt(getResult(nStart[0], nEnd[0]), 10))) << 16;
				r |= Math.max(0, Math.min(255, parseInt(getResult(nStart[1], nEnd[1]), 10))) << 8;
				r |= Math.max(0, Math.min(255, parseInt(getResult(nStart[2], nEnd[2]), 10)));
				
				r = r.toString(16).toUpperCase();
				for (var i = 0; 6 - r.length; i++) {
					r = '0' + r;
				}
					
				return '#' + r;
			}
			return getResult(nStart, nEnd);
		};
		
		if (nStart === null) {
			fReturn.setStart = function(s) {
				s = getUnitAndValue(s);
				
				if (s.sUnit != sUnit) {
					throw new Error('unit eror');
				}
				nStart = s.nValue;
			};
		}
		return fReturn;
	};
};

/**
 * linear 이펙트 함수
 */
jindo.Effect.linear = jindo.Effect(function(s) {
	return s;
});

/**
 * easeInSine 이펙트 함수
 */
jindo.Effect.easeInSine = jindo.Effect(function(s) {
	return (s == 1) ? 1 : -Math.cos(s * (Math.PI / 2)) + 1;
});
/**
 * easeOutSine 이펙트 함수
 */
jindo.Effect.easeOutSine = jindo.Effect(function(s) {
	return Math.sin(s * (Math.PI / 2));
});
/**
 * easeInOutSine 이펙트 함수
 */
jindo.Effect.easeInOutSine = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInSine(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInSine 이펙트 함수
 */
jindo.Effect.easeOutInSine = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutSine(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInSine(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuad 이펙트 함수
 */
jindo.Effect.easeInQuad = jindo.Effect(function(s) {
	return s * s;
});
/**
 * easeOutQuad 이펙트 함수
 */
jindo.Effect.easeOutQuad = jindo.Effect(function(s) {
	return -(s * (s - 2));
});
/**
 * easeInOutQuad 이펙트 함수
 */
jindo.Effect.easeInOutQuad = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuad(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuad 이펙트 함수
 */
jindo.Effect.easeOutInQuad = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuad(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuad(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInCubic 이펙트 함수
 */
jindo.Effect.easeInCubic = jindo.Effect(function(s) {
	return Math.pow(s, 3);
});
/**
 * easeOutCubic 이펙트 함수
 */
jindo.Effect.easeOutCubic = jindo.Effect(function(s) {
	return Math.pow((s - 1), 3) + 1;
});
/**
 * easeInOutCubic 이펙트 함수
 */
jindo.Effect.easeInOutCubic = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeIn(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOut(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInCubic 이펙트 함수
 */
jindo.Effect.easeOutInCubic = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOut(0, 1)(2 * s) * 0.5 : jindo.Effect.easeIn(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuart 이펙트 함수
 */
jindo.Effect.easeInQuart = jindo.Effect(function(s) {
	return Math.pow(s, 4);
});
/**
 * easeOutQuart 이펙트 함수
 */
jindo.Effect.easeOutQuart = jindo.Effect(function(s) {
	return -(Math.pow(s - 1, 4) - 1);
});
/**
 * easeInOutQuart 이펙트 함수
 */
jindo.Effect.easeInOutQuart = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuart(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuart 이펙트 함수
 */
jindo.Effect.easeOutInQuart = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuart(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuart(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInQuint 이펙트 함수
 */
jindo.Effect.easeInQuint = jindo.Effect(function(s) {
	return Math.pow(s, 5);
});
/**
 * easeOutQuint 이펙트 함수
 */
jindo.Effect.easeOutQuint = jindo.Effect(function(s) {
	return Math.pow(s - 1, 5) + 1;
});
/**
 * easeInOutQuint 이펙트 함수
 */
jindo.Effect.easeInOutQuint = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInQuint(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInQuint 이펙트 함수
 */
jindo.Effect.easeOutInQuint = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutQuint(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInQuint(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInCircle 이펙트 함수
 */
jindo.Effect.easeInCircle = jindo.Effect(function(s) {
	return -(Math.sqrt(1 - (s * s)) - 1);
});
/**
 * easeOutCircle 이펙트 함수
 */
jindo.Effect.easeOutCircle = jindo.Effect(function(s) {
	return Math.sqrt(1 - (s - 1) * (s - 1));
});
/**
 * easeInOutCircle 이펙트 함수
 */
jindo.Effect.easeInOutCircle = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInCircle(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutInCircle 이펙트 함수
 */
jindo.Effect.easeOutInCircle = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutCircle(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInCircle(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInBack 이펙트 함수
 */
jindo.Effect.easeInBack = jindo.Effect(function(s) {
	var n = 1.70158;
	return (s == 1) ? 1 : (s / 1) * (s / 1) * ((1 + n) * s - n);
});
/**
 * easeOutBack 이펙트 함수
 */
jindo.Effect.easeOutBack = jindo.Effect(function(s) {
	var n = 1.70158;
	return (s === 0) ? 0 : (s = s / 1 - 1) * s * ((n + 1) * s + n) + 1;
});
/**
 * easeInOutBack 이펙트 함수
 */
jindo.Effect.easeInOutBack = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInBack(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutBack(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInElastic 이펙트 함수
 */
jindo.Effect.easeInElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s/=1) == 1) {
		return 1;
	}
	if (!p) {
		p = 0.3;
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	return -(a * Math.pow(2, 10 * (s -= 1)) * Math.sin((s - 1) * (2 * Math.PI) / p));
});

/**
 * easeOutElastic 이펙트 함수
 */
jindo.Effect.easeOutElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s/=1) == 1) {
		return 1;
	}
	if (!p) {
		p = 0.3;
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	return (a * Math.pow(2, -10 * s) * Math.sin((s - n) * (2 * Math.PI) / p ) + 1);
});
/**
 * easeInOutElastic 이펙트 함수
 */
jindo.Effect.easeInOutElastic = jindo.Effect(function(s) {
	var p = 0, a = 0, n;
	if (s === 0) {
		return 0;
	}
	if ((s/=1/2) == 2) {
		return 1;
	}
	if (!p) {
		p = (0.3 * 1.5);
	}
	if (!a || a < 1) { 
		a = 1; n = p / 4; 
	} else {
		n = p / (2 * Math.PI) * Math.asin(1 / a);
	}
	if (s < 1) {
		return -0.5 * (a * Math.pow(2, 10 * (s -= 1)) * Math.sin( (s - n) * (2 * Math.PI) / p ));
	}
	return a * Math.pow(2, -10 * (s -= 1)) * Math.sin( (s - n) * (2 * Math.PI) / p ) * 0.5 + 1;
});

/**
 * easeOutBounce 이펙트 함수
 */
jindo.Effect.easeOutBounce = jindo.Effect(function(s) {
	if (s < (1 / 2.75)) {
		return (7.5625 * s * s);
	} else if (s < (2 / 2.75)) {
		return (7.5625 * (s -= (1.5 / 2.75)) * s + 0.75);
	} else if (s < (2.5 / 2.75)) {
		return (7.5625 * (s -= (2.25 / 2.75)) * s + 0.9375);
	} else {
		return (7.5625 * (s -= (2.625 / 2.75)) * s + 0.984375);
	} 
});
/**
 * easeInBounce 이펙트 함수
 */
jindo.Effect.easeInBounce = jindo.Effect(function(s) {
	return 1 - jindo.Effect.easeOutBounce(0, 1)(1 - s);
});
/**
 * easeInOutBounce 이펙트 함수
 */
jindo.Effect.easeInOutBounce = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInBounce(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutBounce(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * easeInExpo 이펙트 함수
 */
jindo.Effect.easeInExpo = jindo.Effect(function(s) {
	return (s === 0) ? 0 : Math.pow(2, 10 * (s - 1));
});
/**
 * easeOutExpo 이펙트 함수
 */
jindo.Effect.easeOutExpo = jindo.Effect(function(s) {
	return (s == 1) ? 1 : -Math.pow(2, -10 * s / 1) + 1;
});
/**
 * easeInOutExpo 이펙트 함수
 */
jindo.Effect.easeInOutExpo = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeInExpo(0, 1)(2 * s) * 0.5 : jindo.Effect.easeOutExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});
/**
 * easeOutExpo 이펙트 함수
 */
jindo.Effect.easeOutInExpo = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.easeOutExpo(0, 1)(2 * s) * 0.5 : jindo.Effect.easeInExpo(0, 1)((2 * s) - 1) * 0.5 + 0.5;
});

/**
 * Cubic-Bezier curve
 * @param {Number} x1
 * @param {Number} y1
 * @param {Number} x2
 * @param {Number} y2
 * @see http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
 */
jindo.Effect._cubicBezier = function(x1, y1, x2, y2){
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

/**
 * Cubic-Bezier 함수를 생성한다.
 * @see http://en.wikipedia.org/wiki/B%C3%A9zier_curve
 * @param {Number} x1 control point 1의 x좌표
 * @param {Number} y1 control point 1의 y좌표
 * @param {Number} x2 control point 2의 x좌표
 * @param {Number} y2 control point 2의 y좌표
 * @return {Function} 생성된 이펙트 함수
 */
jindo.Effect.cubicBezier = function(x1, y1, x2, y2){
	return jindo.Effect(jindo.Effect._cubicBezier(x1, y1, x2, y2));
};

/**
 * Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 ease 함수
 * jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEase = jindo.Effect.cubicBezier(0.25, 0.1, 0.25, 1);

/**
 * Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeIn 함수
 * jindo.Effect.cubicBezier(0.42, 0, 1, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseIn = jindo.Effect.cubicBezier(0.42, 0, 1, 1);

/**
 * Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeOut 함수
 * jindo.Effect.cubicBezier(0, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseOut = jindo.Effect.cubicBezier(0, 0, 0.58, 1);

/**
 * Cubic-Bezier 커브를 이용해 CSS3 Transition Timing Function과 동일한 easeInOut 함수
 * jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);
 * @see http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag
 */
jindo.Effect.cubicEaseInOut = jindo.Effect.cubicBezier(0.42, 0, 0.58, 1);

/**
 * Cubic-Bezier 커브를 이용해 easeOutIn 함수를 구한다.
 * jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);
 */
jindo.Effect.cubicEaseOutIn = jindo.Effect.cubicBezier(0, 0.42, 1, 0.58);

/**
 * overphase 이펙트 함수
 */
jindo.Effect.overphase = jindo.Effect(function(s){
	s /= 0.652785;
	return (Math.sqrt((2 - s) * s) + (0.1 * s)).toFixed(5);	
});

/**
 * sin 곡선의 일부를 이용한 sinusoidal 이펙트 함수
 */
jindo.Effect.sinusoidal = jindo.Effect(function(s) {
	return (-Math.cos(s * Math.PI) / 2) + 0.5;
});

/**
 * mirror 이펙트 함수
 * sinusoidal 이펙트 함수를 사용한다.
 */
jindo.Effect.mirror = jindo.Effect(function(s) {
	return (s < 0.5) ? jindo.Effect.sinusoidal(0, 1)(s * 2) : jindo.Effect.sinusoidal(0, 1)(1 - (s - 0.5) * 2);
});

/**
 * nPulse의 진동수를 가지는 cos 함수를 구한다.
 * @param {Number} nPulse 진동수
 * @return {Function} 생성된 이펙트 함수
 * @example
var f = jindo.Effect.pulse(3); //진동수 3을 가지는 함수를 리턴
//시작 수치값과 종료 수치값을 설정해 jindo.Effect 함수를 생성
var fEffect = f(0, 100);
fEffect(0); => 0
fEffect(1); => 100
 */
jindo.Effect.pulse = function(nPulse) {
    return jindo.Effect(function(s){
		return (-Math.cos((s * (nPulse - 0.5) * 2) * Math.PI) / 2) + 0.5;	
	});
};

/**
 * nPeriod의 주기와 nHeight의 진폭을 가지는 sin 함수를 구한다.
 * @param {Number} nPeriod 주기
 * @param {Number} nHeight 진폭
 * @return {Function} 생성된 이펙트 함수
 * @example
var f = jindo.Effect.wave(3, 1); //주기 3, 높이 1을 가지는 함수를 리턴
//시작 수치값과 종료 수치값을 설정해 jindo.Effect 함수를 생성
var fEffect = f(0, 100);
fEffect(0); => 0
fEffect(1); => 0
 */
jindo.Effect.wave = function(nPeriod, nHeight) {
    return jindo.Effect(function(s){
    	return (nHeight || 1) * (Math.sin(nPeriod * (s * 360) * Math.PI / 180)).toFixed(5);
	});
};

/**
 * easeIn 이펙트 함수
 * easeInCubic 함수와 동일하다.
 * @see easeInCubic
 */
jindo.Effect.easeIn = jindo.Effect.easeInCubic;
/**
 * easeOut 이펙트 함수
 * easeOutCubic 함수와 동일하다.
 * @see easeOutCubic
 */
jindo.Effect.easeOut = jindo.Effect.easeOutCubic;
/**
 * easeInOut 이펙트 함수
 * easeInOutCubic 함수와 동일하다.
 * @see easeInOutCubic
 */
jindo.Effect.easeInOut = jindo.Effect.easeInOutCubic;
/**
 * easeOutIn 이펙트 함수
 * easeOutInCubic 함수와 동일하다.
 * @see easeOutInCubic
 */
jindo.Effect.easeOutIn = jindo.Effect.easeOutInCubic;
/**
 * bounce 이펙트 함수
 * easeOutBounce 함수와 동일하다.
 * @see easeOutBounce
 */
jindo.Effect.bounce = jindo.Effect.easeOutBounce;
/**
 * elastic 이펙트 함수
 * easeInElastic 함수와 동일하다.
 * @see easeInElastic
 */
jindo.Effect.elastic = jindo.Effect.easeInElastic;
/**
 * @fileOverview 타이머를 편리하게 사용할 수 있게해주는 컴포넌트
 * @version 1.0.2
 */
jindo.Timer = jindo.$Class({
	/** @lends jindo.Timer.prototype */

	/**
	 * Timer 컴포넌트를 초기화한다.
	 * @constructs
	 * @class 타이머의 사용을 편리하게 해주는 컴포넌트
	 * @extends jindo.Component
 	 */
	$init : function() { 
		this._nTimer = null;
		this._nLatest = null;
		this._nRemained = 0;
		this._nDelay = null;
		this._fRun = null;
		this._bIsRunning = false;
	},
	
	/**
	 * 함수를 지정한 시간이 지난 후에 실행한다. 실행될 콜백 함수가 true 를 리턴하면 setInterval 을 사용한 것처럼 계속 반복해서 수행된다.
	 * @param {Function} fCallback	지정된 지연 시간 이후에 실행될 콜백 함수
	 * @param {Number} nDelay	msec 단위의 지연 시간
	 * @return {Boolean} 항상 true
	 * @example
var o = new jindo.Timer();
o.start(function() {
	// ...
	return true;
}, 100);
	 */
 	start : function(fRun, nDelay) {
		this.abort();
		
		this._nRemained = 0;
		this._nDelay = nDelay;
		this._fRun = fRun;
		
		this._bIsRunning = true;
		this._nLatest = this._getTime();
		this.fireEvent('wait');
		this._excute(this._nDelay, false);
		
		return true;
	},
	
	/**
	 * 타이머의 동작 여부를 가져온다.
	 * @return {Boolean} 동작중이면 true, 그렇지 않으면 false
	 */
	isRunning : function() {
		return this._bIsRunning;
	},
	
	_getTime : function() {
		return new Date().getTime();
	},
	
	_clearTimer : function() {
		var bFlag = false;
		
		if (this._nTimer) {
			clearInterval(this._nTimer);
			this._bIsRunning = false;
			bFlag = true;
		}
		
		this._nTimer = null;
		return bFlag;
	},
	
	/**
	 * 현재 대기상태에 있는 타이머를 중단시킨다.
	 * @return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
	 */
	abort : function() {
		var bReturn = this._clearTimer();
		if (bReturn) {
			this.fireEvent('abort');
			this._fRun = null;
		}
		return bReturn;
	},
	
	/**
	 * 현재 동작하고 있는 타이머를 일시정지 시킨다.
	 * @return {Boolean} 이미 멈춰있었으면 false, 그렇지 않으면 true
	 */
	pause : function() {
		var nPassed = this._getTime() - this._nLatest;
		this._nRemained = Math.max(this._nDelay - nPassed, 0);
		
		return this._clearTimer();
	},
	
	_excute : function(nDelay, bResetDelay) {
		var self = this;
		this._clearTimer();
	
		this._bIsRunning = true;
		this._nTimer = setInterval(function() {
			if (self._nTimer) { //self._nTimer가 null일때도 간헐적으로 수행되는 버그가 있어 추가
				self.fireEvent('run');
				
				var r = self._fRun();
				self._nLatest = self._getTime();
				
				if (!r) {
					clearInterval(self._nTimer);
					self._nTimer = null;
					self._bIsRunning = false;
					self.fireEvent('end');
					return;
				}
				
				self.fireEvent('wait');
				if (bResetDelay) {
					self._excute(self._nDelay, false);
				}
			}							   
		}, nDelay);
	},
	
	/**
	 * 일시정지 상태인 타이머를 재개시킨다.
	 * @return {Boolean} 재개에 성공했으면 true, 그렇지 않으면 false
	 */
	resume : function() {
		if (!this._fRun || this.isRunning()) {
			return false;
		}
		
		this._bIsRunning = true;
		this.fireEvent('wait');
		this._excute(this._nRemained, true);
		this._nRemained = 0;
		return true;
	}
}).extend(jindo.Component);

/**
 * @fileOverview 엘리먼트의 css 스타일을 조정해 부드러운 움직임(변형)을 표현하는 컴포넌트
 * @version 1.0.2
 */
jindo.Transition = jindo.$Class({
	/** @lends jindo.Transition.prototype */
	_nFPS : 30,
	
	_aTaskQueue : null,
	_oTimer : null,
	
	_bIsWaiting : true, // 큐의 다음 동작을 하길 기다리는 상태
	_bIsPlaying : false, // 재생되고 있는 상태
	
	/**
	 * Transition 컴포넌트를 초기화한다.
	 * @constructs
	 * @class 엘리먼트의 css style의 변화를 주어 움직이는 효과를 주는 컴포넌트
	 * @param {HashTable} htOption 옵션 객체
	 * @extends jindo.Component
	 * @requires jindo.Effect
	 * @requires jindo.Timer
	 */
	$init : function(htOption) {
		this._aTaskQueue = [];
		this._oTimer = new jindo.Timer();
		this._oSleepTimer = new jindo.Timer();
		
		this.option({ 
			fEffect : jindo.Effect.linear, 
			bCorrection : false 
		});
		this.option(htOption || {});
	},

	/**
	 * 효과가 재생될 초당 frame rate를 설정하거나 가져온다.
	 * @param {Number} nFPS (생략시 현재 frame rate 리턴)
	 * @return {Number | this} 
	 */
	fps : function(nFPS) {
		if (arguments.length > 0) {
			this._nFPS = nFPS;
			return this;
		}
		
		return this._nFPS;
	},
	
	/**
	 * 트랜지션이 진행중인지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isPlaying : function() {
		return this._bIsPlaying;
	},
	
	/**
	 * 진행되고 있는 Transition을 중지시킨다.
	 * @return {this}
	 */
	abort : function() {
		this._aTaskQueue = [];
		this._oTimer.abort();
		this._oSleepTimer.abort();
		
		if (this._bIsPlaying) {
			this.fireEvent("abort");
		}

		this._bIsWaiting = true;
		this._bIsPlaying = false;
		
		this._htTaskToDo = null;
		return this;
	},
	
	/**
	 * Transition을 수행한다.
	 * 파라메터를 지정(queue 메소드와 동일)하였을 경우에는 해당 동작을 바로 실행시키고, 파라메터가 생략되었을 때에는 지금까지 queue()로 지정된 동작들을 시작시킨다.
	 * 파라메터는 function타입으로 지정하여 콜백을 수행할수 있다. (예제 참고)
	 * @param {Number} nDuration Transition이 진행될 시간
	 * @param {Array} aCommand 적용할 명령셋
	 * @return {this}
	 * @see jindo.Transition#queue
	 * @example
oTransition.start(1000, 
	jindo.$("foo"), {
		'@left' : '200px'
	}
));
	 * @example
oTransition.start(1000, [
	[jindo.$("foo"), {
		'@left' : '200px'
	}],
	
	[jindo.$("bar"), {
		'@top' : '200px'
	}]
]));
	 * @example
oTransition.queue(1000,
	jindo.$("foo"), {
		'@left' : '200px'
	}
));
oTransition.start();
	 */
	start : function(nDuration, elTarget, htInfo) {
		if (arguments.length > 0) {
			this.queue.apply(this, arguments);
		}
		
		this._prepareNextTask();
		return this;
	},
	
	/**
	 * Transition을 큐에 담는다.
	 * 여러 단계의 Transition을 담아두고 순차적으로 실행시킬때 사용한다. start() 메소드가 호출되기 전까지 수행되지 않는다.
	 * 파라메터 aCommand는 [(HTMLElement)엘리먼트, (HashTable)Transition정보]로 구성되어야 하고, 여러명령을 동시에 적용할 수 있다.
	 * 파라메터로 function을 지정하여 콜백을 등록할 수 있다.
	 * @param {Number} nDuration Transition이 진행될 시간
	 * @param {Array} aCommand 적용할 명령셋
	 * @return {this}
	 * @see jindo.Transition#start
	 * @example 하나의 엘리먼트에 여러개의 명령을 지정하는 예제
oTransition.queue(1000,
	jindo.$("foo"), {
		'@left' : '200px',
		'@top' : '50px',
		'@width' : '200px',
		'@height' : '200px',
		'@backgroundColor' : [ '#07f', 'rgb(255, 127, 127)' ]
	}
); 
	 * @example 여러개의 엘리먼트에 명령을 지정하는 예 1
oTransition.queue(1000,
	jindo.$("foo"), {
		"@left" : jindo.Effect.linear("200px")
	},
	jindo.$("bar"), {
		"@top" : jindo.Effect.easeOut("200px")
	}
);
	 * @example 여러개의 엘리먼트에 명령을 지정하는 예 2
oTransition.queue(1000, [
	[jindo.$("foo"), {
		"@left" : jindo.Effect.linear("200px")
	}],
	[jindo.$("bar"), {
		"@top" : jindo.Effect.easeIn("200px")
	}]
]);  
	 * @example 엘리먼트를 getter / setter 함수로 지정하는 예  
oTransition.queue(1000, [
	[{
		getter : function(sKey) {
			return jindo.$Element("foo")[sKey]();
		},
		
		setter : function(sKey, sValue) {
			jindo.$Element("foo")[sKey](parseFloat(sValue));
		}
	}, {
		'height' : jindo.Effect.easeIn(100)
	}]
]);  
	 * @example 파라메터로 function을 지정하여 콜백을 수행하는 예제
oTransition.start(function(){
	alert("end")
});
	 */
	queue : function(nDuration, aCommand) {
		var htTask;
		if (typeof arguments[0] == 'function') {
			htTask = {
				sType : "function",
				fTask : arguments[0]
			};
		} else {
			var a = [];
			if (arguments[1] instanceof Array) {
				a = arguments[1];
			} else {
				var aInner = [];
				jindo.$A(arguments).forEach(function(v, i){
					if (i > 0) {
						aInner.push(v);
						if (i % 2 === 0) {
							a.push(aInner.concat());
							aInner = [];
						} 
					}
				});
			}
			
			htTask = {
				sType : "task",
				nDuration : nDuration, 
				aList : []
			};
			
			for (var i = 0, nLen = a.length; i < nLen; i ++) {
				var aValue = [],
					htArg = a[i][1],
					sEnd;
				
				for (var sKey in htArg) {
					sEnd = htArg[sKey];
					if (/^(@|style\.)(\w+)/i.test(sKey)) {
						aValue.push([ "style", RegExp.$2, sEnd ]);
					} else {
						aValue.push([ "attr", sKey, sEnd ]);
					}
				}
				
				htTask.aList.push({
					elTarget : a[i][0],
					aValue : aValue
				});
			}
		}
		this._queueTask(htTask);
		
		return this;
	},
	
	/**
	 * 진행되고 있는 Transition을 일시중지시킨다.
	 * Transition이 진행중일때만 가능하다. (sleep 상태일 때에는 불가능)
	 * @return {this}
	 */
	pause : function() {
		if (this._oTimer.abort()) {
			this.fireEvent("pause");
		}
		return this;
	},
	
	/**
	 * 일시중지된 Transition을 재시작시킨다.
	 * @return {this}
	 */
	resume : function() {
		if (this._htTaskToDo) {
			if (this._bIsWaiting === false && this._bIsPlaying === true) {
				this.fireEvent("resume");
			}
			
			this._doTask();
			
			this._bIsWaiting = false;
			this._bIsPlaying = true;
		
			var self = this;
			this._oTimer.start(function() {
				var bEnd = !self._doTask();
				if (bEnd) {
					self._bIsWaiting = true;
					setTimeout(function() { 
						self._prepareNextTask(); 
					}, 0);
				}
				
				return !bEnd;
			}, this._htTaskToDo.nInterval);
		}
		return this;
	},
	
	/**
	 * 지정된 Transition이 종료된 이후에 또 다른 Transition 을 수행한다.
	 * start() 메소드는 더이상 현재 진행중인 Transition을 abort시키지 않는다.
	 * @return {this}
	 * @deprecated start()
	 */
	precede : function(nDuration, elTarget, htInfo) {
		this.start.apply(this, arguments);
		return this;
	},
	
	/**
	 * 현재의 Transition 종료 후 다음 Transition 진행하기전에 지정된 시간만큼 동작을 지연한다.
	 * @param {Number} nDuration 지연할 시간
	 * @param {Function} fCallback 지연이 시작될때 수행될 콜백함수 (생략가능)
	 * @return {this}
	 * @example
oTransition.start(1000, jindo.$("foo"), {
	"@left" : jindo.Effect.linear(oPos.pageX + "px")
}).sleep(500).start(1000, jindo.$("bar"), {
	"@top" : jindo.Effect.easeOut(oPos.pageY + "px")
});
	 */
	sleep : function(nDuration, fCallback) {
		if (typeof fCallback == "undefined") {
			fCallback = function(){};
		}
		this._queueTask({
			sType : "sleep",
			nDuration : nDuration,
			fCallback : fCallback 
		});
		this._prepareNextTask();
		return this;
	},
	
	_queueTask : function(v) {
		this._aTaskQueue.push(v);
	},
	
	_dequeueTask : function() {
		var htTask = this._aTaskQueue.shift();
		if (htTask) {
			if (htTask.sType == "task") {
				var aList = htTask.aList;
				for (var i = 0, nLength = aList.length; i < nLength; i++) {
					var elTarget = aList[i].elTarget,
						welTarget = jindo.$Element(elTarget);
					
					for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
						var sType = aValue[j][0],
							sKey = aValue[j][1],
							fFunc = aValue[j][2];
						
						if (typeof fFunc != "function") {
							var fEffect = this.option("fEffect");
							if (fFunc instanceof Array) {
								fFunc = fEffect(fFunc[0], fFunc[1]);
							} else {
								fFunc = fEffect(fFunc);
							}
							aValue[j][2] = fFunc;
						}
						
						if (fFunc.setStart) {
							if (this._isHTMLElement(elTarget)) {
								switch (sType) {
									case "style":
										fFunc.setStart(welTarget.css(sKey));
										break;
										
									case "attr":
										fFunc.setStart(welTarget.$value()[sKey]);
										break;
								}
							} else {
								fFunc.setStart(elTarget.getter(sKey));
							}
						}
					}
				}
			}
			return htTask;
		} else {
			return null;
		}
	},
	
	_prepareNextTask : function() {
		if (this._bIsWaiting) {
			var htTask = this._dequeueTask();
			if (htTask) {
				switch (htTask.sType) {
					case "task":
						if (!this._bIsPlaying) {
							this.fireEvent("start");
						}
						var nInterval = 1000 / this._nFPS,
							nGap = nInterval / htTask.nDuration;
						
						this._htTaskToDo = {
							aList: htTask.aList,
							nRatio: 0,
							nInterval: nInterval,
							nGap: nGap,
							nStep: 0,
							nTotalStep: Math.ceil(htTask.nDuration / nInterval)
						};
						
						this.resume();
						break;
					case "function":
						if (!this._bIsPlaying) {
							this.fireEvent("start");
						}
						htTask.fTask();
						this._prepareNextTask();
						break;
					case "sleep":
						if (this._bIsPlaying) {
							this.fireEvent("sleep", {
								nDuration: htTask.nDuration
							});
							htTask.fCallback();
						}
						var self = this;
						this._oSleepTimer.start(function(){
							self.fireEvent("awake");
							self._prepareNextTask();
						}, htTask.nDuration);
						break;
				}
			} else {
				if (this._bIsPlaying) {
					this._bIsPlaying = false;
					this.abort();
					this.fireEvent("end");
				}
			}
		}
	},
	
	_isHTMLElement : function(el) {
		return ("tagName" in el);
	},
	
	_doTask : function() {
		var htTaskToDo = this._htTaskToDo,
			nRatio = parseFloat(htTaskToDo.nRatio.toFixed(5), 1),
			nStep = htTaskToDo.nStep,
			nTotalStep = htTaskToDo.nTotalStep,
			aList = htTaskToDo.aList,
			htCorrection = {},
			bCorrection = this.option("bCorrection");
		
		for (var i = 0, nLength = aList.length; i < nLength; i++) {
			var elTarget = aList[i].elTarget,
				welTarget = jindo.$Element(elTarget);
			
			for (var j = 0, aValue = aList[i].aValue, nJLen = aValue.length; j < nJLen; j++) {
				var sType = aValue[j][0],
					sKey = aValue[j][1],
					sValue = aValue[j][2](nRatio);
				
				if (this._isHTMLElement(elTarget)) {
					if (bCorrection) {
						var sUnit = /^\-?[0-9\.]+(%|px|pt|em)?$/.test(sValue) && RegExp.$1 || "";
						if (sUnit) {
							var nValue = parseFloat(sValue);
							nValue += htCorrection[sKey] || 0;
							nValue = parseFloat(nValue.toFixed(5));
							if (i == nLength - 1) {
								sValue = Math.round(nValue) + sUnit;
							} else {
								htCorrection[sKey] = nValue - Math.floor(nValue);
								sValue = parseInt(nValue, 10) + sUnit;
							}
						}
					}
					switch (sType) {
						case "style":
							welTarget.css(sKey, sValue);
							break;
							
						case "attr":
							welTarget.$value()[sKey] = sValue;
							break;
					}
				} else {
					elTarget.setter(sKey, sValue);
				}
				
				if (this._bIsPlaying) {
					this.fireEvent("playing", {
						element : elTarget,
						sKey : sKey,
						sValue : sValue,
						nStep : nStep,
						nTotalStep : nTotalStep
					});
				}
			}
		}
		htTaskToDo.nRatio = Math.min(htTaskToDo.nRatio + htTaskToDo.nGap, 1);
		htTaskToDo.nStep += 1;
		return nRatio != 1;
	}
}).extend(jindo.Component);

// jindo.$Element.prototype.css 패치
(function() {
	var b = jindo.$Element.prototype.css;
	jindo.$Element.prototype.css = function(k, v) {
		if (k == "opacity") {
			return typeof v != "undefined" ? this.opacity(parseFloat(v)) : this.opacity();
		} else {
			return v != "undefined" ? b.call(this, k, v) : b.call(this, k);
		}
	};
})();
/**
 * @fileOverview HTML Element를 Drag할 수 있게 해주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 1.0.2
 */

jindo.DragArea = jindo.$Class({
	/** @lends jindo.DragArea.prototype */
	
	/**
	 * DragArea 컴포넌트를 생성한다.
	 * DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트를 Drag 가능하게 하는 기능을 한다.
	 * @constructs
	 * @class HTML Element를 Drag할 수 있게 해주는 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {HTMLElement} el Drag될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oDragArea = new jindo.DragArea(document, {
	"sClassName" : 'dragable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drag 가능하게 된다. 
	"bFlowOut" : true, // (Boolean) 드래그될 엘리먼트가 상위 기준 엘리먼트의 영역을 벗어날 수 있는지의 여부. 상위 엘리먼트의 크기가 드래그되는 객체보다 크거나 같아야지만 동작하도록 수정. 작은 경우 document사이즈로 제한한다.
	"bSetCapture" : true, //ie에서 setCapture 사용여부
	"nThreshold" : 0 // (Number) 드래그가 시작되기 위한 최소 역치값(px) 
}).attach({
	handleDown : function(oCustomEvent) {
		//드래그될 handle 에 마우스가 클릭되었을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	weEvent : (jindo.$Event) mousedown시 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 dragStart 이벤트가 발생하지 않고 중단된다.
	},
	dragStart : function(oCustomEvent) {
		//드래그가 시작될 때 발생 (마우스 클릭 후 첫 움직일 때 한 번)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 beforedrag 이벤트가 발생하지 않고 중단된다.
	},
	beforeDrag : function(oCustomEvent) {
		//드래그가 시작되고 엘리먼트가 이동되기 직전에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elFlowOut : (HTMLElement) bFlowOut 옵션이 적용될 상위 기준 엘리먼트 (변경가능)
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 될 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 될 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
		//oCustomEvent.stop(); 이 수행되면 뒤따르는 drag 이벤트가 발생하지 않고 중단된다.
		//oCustomEvent.nX = null; // 가로로는 안 움직이게
		//oCustomEvent.nX = Math.round(oCustomEvent.nX / 20) * 20;
		//oCustomEvent.nY = Math.round(oCustomEvent.nY / 20) * 20;
		//if (oCustomEvent.nX < 0) oCustomEvent.nX = 0;
		//if (oCustomEvent.nY < 0) oCustomEvent.nY = 0;
	},
	drag : function(oCustomEvent) {
		//드래그 엘리먼트가 이동하는 중에 발생 (이동중 beforedrag, drag 순으로 연속적으로 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트
		//	weEvent : (jindo.$Event) 마우스 이동 중 (mousemove) 발생되는 jindo.$Event 객체
		//	nX : (Number) 드래그 된 x좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nY : (Number) 드래그 된 y좌표. 이 좌표로 엘리먼트가 이동 된다.
		//	nGapX : (Number) 드래그가 시작된 x좌표와의 차이
		//	nGapY : (Number) 드래그가 시작된 y좌표와의 차이
		//};
	},
	dragEnd : function(oCustomEvent) {
		//드래그(엘리먼트 이동)가 완료된 후에 발생 (mouseup시 1회 발생. 뒤이어 handleup 발생)
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	bInterupted : (Boolean) 드래그중 stopDragging() 호출로 강제적으로 드래그가 종료되었는지의 여부
		//	nX : (Number) 드래그 된 x좌표.
		//	nY : (Number) 드래그 된 y좌표.
		//}
	},
	handleUp : function(oCustomEvent) {
		//드래그된 handle에 마우스 클릭이 해제됬을 때 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 된 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
		//};
	}
});
	 */
	$init : function(el, htOption) {
		this.option({
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		});
		
		this.option(htOption || {});
		
		this._el = el;
		
		this._bIE = jindo.$Agent().navigator().ie;
		
		this._htDragInfo = {
			"bIsDragging" : false,
			"bPrepared" : false, //mousedown이 되었을때 true, 이동중엔 false
			"bHandleDown" : false,
			"bForceDrag" : false
		};

		this._wfOnMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfOnMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfOnMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		this._wfOnDragStart = jindo.$Fn(this._onDragStart, this);
		this._wfOnSelectStart = jindo.$Fn(this._onSelectStart, this);
		
		this.activate();
	},
	
	_findDraggableElement : function(el) {
		if (jindo.$$.test(el, "input[type=text], textarea, select")){
			return null;
		} 
		
		var self = this;
		var sClass = '.' + this.option('sClassName');
		
		var isChildOfDragArea = function(el) {
			if (el === null) {
				return false;
			}
			if (self._el === document || self._el === el) {
				return true;
			} 
			return jindo.$Element(self._el).isParentOf(el);
		};
		
		var elReturn = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!isChildOfDragArea(elReturn)) {
			elReturn = null;
		}
		return elReturn;
	},
	
	/**
	 * 레이어가 현재 드래그 되고 있는지 여부를 가져온다
	 * @return {Boolean} 레이어가 현재 드래그 되고 있는지 여부
	 */
	isDragging : function() {
		var htDragInfo = this._htDragInfo; 
		return htDragInfo.bIsDragging && !htDragInfo.bPrepared;
	},
	
	/**
	 * 드래그를 강제 종료시킨다.
	 * @return this;
	 */
	stopDragging : function() {
		this._stopDragging(true);
		return this;
	},
	
	_stopDragging : function(bInterupted) {
		this._wfOnMouseMove.detach(document, 'mousemove');
		this._wfOnMouseUp.detach(document, 'mouseup');
		
		if (this.isDragging()) {
			var htDragInfo = this._htDragInfo,
				welDrag = jindo.$Element(htDragInfo.elDrag);
			
			htDragInfo.bIsDragging = false;
			htDragInfo.bForceDrag = false;
			htDragInfo.bPrepared = false;
			
			if(this._bIE && this._elSetCapture) {
				this._elSetCapture.releaseCapture();
				this._elSetCapture = null;
			}
			
			this.fireEvent('dragEnd', {
				"elArea" : this._el,
				"elHandle" : htDragInfo.elHandle,
				"elDrag" : htDragInfo.elDrag,
				"nX" : parseInt(welDrag.css("left"), 10) || 0,
				"nY" : parseInt(welDrag.css("top"), 10) || 0,
				"bInterupted" : bInterupted
			});
		}
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 attach 한다. 
	 */
	_onActivate : function() {
		this._wfOnMouseDown.attach(this._el, 'mousedown');
		this._wfOnDragStart.attach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.attach(this._el, 'selectstart'); // for IE	
	},
	
	/**
	 * DragArea 동작을 위한 mousedown, dragstart, selectstart 이벤트를 detach 한다. 
	 */
	_onDeactivate : function() {
		this._wfOnMouseDown.detach(this._el, 'mousedown');
		this._wfOnDragStart.detach(this._el, 'dragstart'); // for IE
		this._wfOnSelectStart.detach(this._el, 'selectstart'); // for IE
	},
	
	/**
	 * 이벤트를 attach한다.
	 * @deprecated activate
	 */
	attachEvent : function() {
		this.activate();
	},
	
	/**
	 * 이벤트를 detach한다.
	 * @deprecated deactivate
	 */
	detachEvent : function() {
		this.deactivate();
	},
	
	/**
	 * 이벤트의 attach 여부를 가져온다.
	 * @deprecated isActivating
	 */
	isEventAttached : function() {
		return this.isActivating();
	},
	
	/**
	 * 마우스다운이벤트와 관계없이 지정된 엘리먼트를 드래그 시작한다.
	 * @param {HTMLElement} el 드래그할 엘리먼트
	 * @return {Boolean} 드래그시작여부
	 */
	startDragging : function(el) {
		var elDrag = this._findDraggableElement(el);
		if (elDrag) {
			this._htDragInfo.bForceDrag = true;
			this._htDragInfo.bPrepared = true;
			this._htDragInfo.elHandle = elDrag;
			this._htDragInfo.elDrag = elDrag;
			
			this._wfOnMouseMove.attach(document, 'mousemove');
			this._wfOnMouseUp.attach(document, 'mouseup');
			return true;
		}
		return false;
	},
	
	_onMouseDown : function(we) {
		/* IE에서 네이버 툴바의 마우스제스처 기능 사용시 우클릭하면 e.mouse().right가 false로 들어오므로 left값으로만 처리하도록 수정 */
		if (!we.mouse().left || we.mouse().right) {
			this._stopDragging(true);
			return;
		}
		
		// 드래그 할 객체 찾기
		var el = this._findDraggableElement(we.element);
		if (el) {
			var oPos = we.pos(),
				htDragInfo = this._htDragInfo;
			
			htDragInfo.bHandleDown = true;
			htDragInfo.bPrepared = true;
			htDragInfo.nButton = we._event.button;
			htDragInfo.elHandle = el;
			htDragInfo.elDrag = el;
			htDragInfo.nPageX = oPos.pageX;
			htDragInfo.nPageY = oPos.pageY;
			if (this.fireEvent('handleDown', { 
				elHandle : el, 
				elDrag : el, 
				weEvent : we 
			})) {
				this._wfOnMouseMove.attach(document, 'mousemove');
			} 
			this._wfOnMouseUp.attach(document, 'mouseup');
			
			we.stop(jindo.$Event.CANCEL_DEFAULT);			
		}
	},
	
	_onMouseMove : function(we) {
		var htDragInfo = this._htDragInfo,
			htParam, htRect,
			oPos = we.pos(), 
			htGap = {
				"nX" : oPos.pageX - htDragInfo.nPageX,
				"nY" : oPos.pageY - htDragInfo.nPageY
			};

		if (htDragInfo.bPrepared) {
			var nThreshold = this.option('nThreshold'),
				htDiff = {};
			
			if (!htDragInfo.bForceDrag && nThreshold) {
				htDiff.nPageX = oPos.pageX - htDragInfo.nPageX;
				htDiff.nPageY = oPos.pageY - htDragInfo.nPageY;
				var nDistance = Math.sqrt(htDiff.nPageX * htDiff.nPageX + htDiff.nPageY * htDiff.nPageY);
				if (nThreshold > nDistance){
					return;
				} 
			}

			if (this._bIE && this.option("bSetCapture")) {
				this._elSetCapture = (this._el === document) ? document.body : this._findDraggableElement(we.element);
				if (this._elSetCapture) {
					this._elSetCapture.setCapture(false);
				}
			}
			 
			htParam = {
				elArea : this._el,
				elHandle : htDragInfo.elHandle,
				elDrag : htDragInfo.elDrag,
				htDiff : htDiff, //nThreshold가 있는경우 htDiff필요
				weEvent : we //jindo.$Event
			};
			
				
			htDragInfo.bIsDragging = true;
			htDragInfo.bPrepared = false;
			if (this.fireEvent('dragStart', htParam)) {
				var welDrag = jindo.$Element(htParam.elDrag),
					htOffset = welDrag.offset();
				
				htDragInfo.elHandle = htParam.elHandle;
				htDragInfo.elDrag = htParam.elDrag;
				htDragInfo.nX = parseInt(welDrag.css('left'), 10) || 0;
				htDragInfo.nY = parseInt(welDrag.css('top'), 10) || 0;
				htDragInfo.nClientX = htOffset.left + welDrag.width() / 2;
				htDragInfo.nClientY = htOffset.top + welDrag.height() / 2;
			} else {
				htDragInfo.bPrepared = true;
				return;
			}
		} 
				
		if (htDragInfo.bForceDrag) {
			htGap.nX = oPos.clientX - htDragInfo.nClientX;
			htGap.nY = oPos.clientY - htDragInfo.nClientY;
		}
		
		htParam = {
			"elArea" : this._el,
			"elFlowOut" : htDragInfo.elDrag.parentNode, 
			"elHandle" : htDragInfo.elHandle,
			"elDrag" : htDragInfo.elDrag,
			"weEvent" : we, 		 //jindo.$Event
			"nX" : htDragInfo.nX + htGap.nX,
			"nY" : htDragInfo.nY + htGap.nY,
			"nGapX" : htGap.nX,
			"nGapY" : htGap.nY
		};
		
		if (this.fireEvent('beforeDrag', htParam)) {
			var elDrag = htDragInfo.elDrag;
			if (this.option('bFlowOut') === false) {
				var elParent = htParam.elFlowOut,
					aSize = [ elDrag.offsetWidth, elDrag.offsetHeight ],
					nScrollLeft = 0, nScrollTop = 0;
					
				if (elParent == document.body) {
					elParent = null;
				}
				
				if (elParent && aSize[0] <= elParent.scrollWidth && aSize[1] <= elParent.scrollHeight) {
					htRect = { 
						nWidth : elParent.clientWidth, 
						nHeight : elParent.clientHeight
					};	
					nScrollLeft = elParent.scrollLeft;
					nScrollTop = elParent.scrollTop;
				} else {
					var	htClientSize = jindo.$Document().clientSize();
						
					htRect = {
						nWidth : htClientSize.width, 
						nHeight : htClientSize.height
					};
				}
	
				if (htParam.nX !== null) {
					htParam.nX = Math.max(htParam.nX, nScrollLeft);
					htParam.nX = Math.min(htParam.nX, htRect.nWidth - aSize[0] + nScrollLeft);
				}
				
				if (htParam.nY !== null) {
					htParam.nY = Math.max(htParam.nY, nScrollTop);
					htParam.nY = Math.min(htParam.nY, htRect.nHeight - aSize[1] + nScrollTop);
				}
			}
			if (htParam.nX !== null) {
				elDrag.style.left = htParam.nX + 'px';
			}
			if (htParam.nY !== null) {
				elDrag.style.top = htParam.nY + 'px';
			}

			this.fireEvent('drag', htParam);
		}else{
			htDragInfo.bIsDragging = false;
		}
	},
	
	_onMouseUp : function(we) {
		this._stopDragging(false);
		
		var htDragInfo = this._htDragInfo;
		htDragInfo.bHandleDown = false;
		
		this.fireEvent("handleUp", {
			weEvent : we,
			elHandle : htDragInfo.elHandle,
			elDrag : htDragInfo.elDrag 
		});
	},
	
	_onDragStart : function(we) {
		if (this._findDraggableElement(we.element)) { 
			we.stop(jindo.$Event.CANCEL_DEFAULT); 
		}
	},
	
	_onSelectStart : function(we) {
		if (this.isDragging() || this._findDraggableElement(we.element)) {
			we.stop(jindo.$Event.CANCEL_DEFAULT);	
		}
	}
	
}).extend(jindo.UIComponent);
/**
 * @fileOverview 마우스의 롤오버 액션을 커스텀이벤트 핸들링으로 쉽게 컨트롤할 수 있게 도와주는 컴퍼넌트
 * @version 1.0.2
 */
jindo.RolloverArea = jindo.$Class({
	/** @lends jindo.RolloverArea.prototype */
	  
	/**
	 * RolloverArea 컴포넌트를 초기화한다.
	 * RolloverArea 컴포넌트는 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 엘리먼트에 마우스액션이 있을 경우 클래스명을 변경하는 이벤트를 발생시킨다.
	 * @constructs 
	 * @class 마우스 이벤트에 따라 롤오버효과를 쉽게 처리할 수 있게 도와주는 컴포넌트
	 * @extends jindo.UIComponent
	 * @param {HTMLElement} el 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 */				  
	$init : function(el, htOption) {
		this.option({ 
			sClassName : "rollover", 
			sClassPrefix : "rollover-",
			bCheckMouseDown : true,
			bActivateOnload : true,
			htStatus : {
				sOver : "over",
				sDown : "down"
			} 
		});
		this.option(htOption || {});
		
		this._elArea = jindo.$(el);
		this._aOveredElements = [];
		this._aDownedElements = [];
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		this._wfMouseDown = jindo.$Fn(this._onMouseDown, this);
		this._wfMouseUp = jindo.$Fn(this._onMouseUp, this);
		
		if (this.option("bActivateOnload")) {
			this.activate();
		}
	},
	
	_addOvered : function(el) {
		this._aOveredElements.push(el);
	},
	
	_removeOvered : function(el) {
		this._aOveredElements.splice(jindo.$A(this._aOveredElements).indexOf(el), 1);
	},
	
	_addStatus : function(el, sStatus) {
		jindo.$Element(el).addClass(this.option('sClassPrefix') + sStatus);
	},
	
	_removeStatus : function(el, sStatus) {
		jindo.$Element(el).removeClass(this.option('sClassPrefix') + sStatus);
	},
	
	_isInnerElement : function(elParent, elChild) {
		return elParent === elChild ? true : jindo.$Element(elParent).isParentOf(elChild);
	},
	
	/**
	 * RolloverArea를 활성화시킨다.
	 * @return {this}
	 */
	_onActivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(true);
		this._wfMouseOver.attach(this._elArea, 'mouseover');
		this._wfMouseOut.attach(this._elArea, 'mouseout');
		if (this.option("bCheckMouseDown")) {
			this._wfMouseDown.attach(this._elArea, 'mousedown');
			this._wfMouseUp.attach(document, 'mouseup');
		}
	},
	
	/**
	 * RolloverArea를 비활성화시킨다.
	 * @return {this}
	 */
	_onDeactivate : function() {
		jindo.$Element.prototype.preventTapHighlight && jindo.$Element(this._elArea).preventTapHighlight(false);
		this._wfMouseOver.detach(this._elArea, 'mouseover');
		this._wfMouseOut.detach(this._elArea, 'mouseout');
		this._wfMouseDown.detach(this._elArea, 'mousedown');
		this._wfMouseUp.detach(document, 'mouseup');
		
		this._aOveredElements.length = 0;
		this._aDownedElements.length = 0;
	},
	
	_findRollover : function(el) {
		var sClassName = this.option('sClassName');
		return jindo.$$.test(el, '.' + sClassName) ? el : jindo.$$.getSingle('! .' + sClassName, el);
	},
	
	_onMouseOver : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			}
			
			this._addOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			
			if (this.fireEvent('over', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseOut : function(we) {
		var el = we.element,
			elRelated = we.relatedElement,
			htParam;
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (elRelated && this._isInnerElement(el, elRelated)) {
				continue;
			} 
			
			this._removeOvered(el);
				
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			if (this.fireEvent('out', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sOver);
			} 
		}
	},
	
	_onMouseDown : function(we) {
		var el = we.element,
			htParam;
			
		while ((el = this._findRollover(el))) {
			htParam = { 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			};
			this._aDownedElements.push(el);
			if (this.fireEvent('down', htParam)) {
				this._addStatus(htParam.element, htParam.htStatus.sDown);
			}
			
			el = el.parentNode;
		}
	},
	
	_onMouseUp : function(we) {
		var el = we.element,
			aTargetElementDatas = [],		
			aDownedElements = this._aDownedElements,
			htParam,
			elMouseDown,
			i;
		
		for (i = 0; (elMouseDown = aDownedElements[i]); i++) {
			aTargetElementDatas.push({ 
				element : elMouseDown,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (; (el = this._findRollover(el)); el = el.parentNode) {
			if (jindo.$A(aDownedElements).indexOf(el) > -1) {
				continue;
			}
			
			aTargetElementDatas.push({ 
				element : el,
				htStatus : this.option("htStatus"),
				weEvent : we
			});
		}
		
		for (i = 0; (htParam = aTargetElementDatas[i]); i++) {
			if (this.fireEvent('up', htParam)) {
				this._removeStatus(htParam.element, htParam.htStatus.sDown);
			}		
		}
		
		this._aDownedElements = [];
	}
}).extend(jindo.UIComponent);

/**
 * @fileOverview 특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 1.0.2
 */
jindo.Foggy = jindo.$Class({
	/** @lends jindo.Foggy.prototype */

	_elFog : null,
	_bFogAppended : false,
	_oExcept : null,
	_bFogVisible : false,
	_bFogShowing : false,
	_oTransition : null,
	/**
	 * Foggy 컴포넌트를 생성한다.
	 * Foggy 컴포넌트는 특정영역을 highlighting하기 위해 이외의 부분을 안개처럼 뿌옇게 가려주는 기능을 한다.
	 * @constructs
	 * @class 특정영역을 강조하기 위해 이외의 부분전체를 안개처럼 뿌옇게 가려주는 컴포넌트
	 * @extends jindo.Component
	 * @requires jindo.Effect
	 * @requires jindo.Transition
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var foggy = new jindo.Foggy({
	sClassName : "fog", //(String) fog 레이어에 지정될 클래스명
	nShowDuration : 200, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)
	nShowOpacity : 0.5, //(Number) fog 레이어가 모두 보여졌을 때의 투명도 (0~1사이의 값)
	nHideDuration : 200, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)
	nHideOpacity : 0, //(Number) fog 레이어를 숨기기위해 적용할 투명도 (0~1사이의 값)
	fShowEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 보여줄 때 적용할 효과
	fHideEffect : jindo.Effect.linear, // (jindo.Effect) fog 레이어를 숨길 때 적용할 효과
	nFPS : 15 //(Number) 효과가 재생될 초당 frame rate
	nZIndex : 32000 //(Number) foggy layer의 zindex. foggy에 의해 가려지지 않게 할 요소가 있는 경우에 사용 
}).attach({
	beforeShow : function(oCustomEvent) {
		//oCustomEvent.stop(); 수행시 fog레이어를 보여주지 않음.
	},
	show : function() {
		//fog 레이어가 화면에 보여지고나서 발생
	},
	beforeHide : function(oCustomEvent) {
		//oCustomEvent.stop(); 수행시 fog레이어를 숨기지 않음.
	},
	hide : function() {
		//fog 레이어가 화면에서 숨겨지고나서 발생
	}
});

//컴포넌트에 의해 생성된 fog레이어에 대한 설정
foggy.getFog().className = 'fog';
foggy.getFog().onclick = function() { foggy.hide(); };
	 */
	$init : function(htOption) {
		this.option({
			sClassName : "fog",
			nShowDuration : 200,
			nShowOpacity : 0.5,
			nHideDuration : 200,
			nHideOpacity : 0,
			fShowEffect : jindo.Effect.linear,
			fHideEffect : jindo.Effect.linear,
			nFPS : 15,
			nZIndex : 32000
		});
		this.option(htOption || {});

		this._elFog = jindo.$('<div class="' + this.option("sClassName") + '">');
		this._welFog = jindo.$Element(this._elFog);
		document.body.insertBefore(this._elFog, document.body.firstChild);
		this._welFog.opacity(this.option('nHideOpacity'));
		this._welFog.hide();

		this._oExcept = {};

		this._oTransition = new jindo.Transition().fps(this.option("nFPS"));

		this._fOnResize = jindo.$Fn(this._fitFogToDocument, this);
		this._fOnScroll = jindo.$Fn(this._fitFogToDocumentScrollSize, this);
	},

	_getScroll : function(wDocument) {
		return {
			top : window.pageYOffset || document[wDocument._docKey].scrollTop,
			left : window.pageXOffset || document[wDocument._docKey].scrollLeft
		};
	},

	_fitFogToDocument : function() {
		var wDocument = jindo.$Document();

		this._elFog.style.left = this._getScroll(wDocument).left + 'px';
		this._elFog.style.width = "100%";

		var self = this;
		clearTimeout(this._nTimer);
		this._nTimer = null;

		//가로스크롤이 생겼다 사라지는경우의 버그를 수정하기위한 setTimeout
		this._nTimer = setTimeout(function(){

			var oSize = wDocument.clientSize();

			self._elFog.style.top = self._getScroll(wDocument).top + 'px';
			self._elFog.style.height = oSize.height + 'px';

			self._elFog.style.left = self._getScroll(wDocument).left + 'px';

		}, 100);
	},

	_fitFogToDocumentScrollSize : function() {
		var oSize = jindo.$Document().scrollSize();
		this._elFog.style.left = "0";
		this._elFog.style.top = "0";
		this._elFog.style.width = oSize.width + 'px';
		this._elFog.style.height = oSize.height + 'px';
	},

	/**
	 * 생성된 fog 레이어 엘리먼트를 가져온다.
	 * @return {HTMLElement} fog 레이어 엘리먼트
	 */
	getFog : function() {
		return this._elFog;
	},

	/**
	 * fog 레이어가 보여졌는지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isShown : function() {
		return this._bFogVisible;
	},

	/**
	 * fog 레이어가 보여지고 있는 상태인지 여부를 가져온다.
	 * @return {Boolean}
	 */
	isShowing : function() {
		return this._bFogShowing;
	},
	
	/**
	 * fog 레이어를 보여준다. (elExcept는 가리지 않는다.)
	 * @param {HTMLElement} elExcept
	 */
	show : function(elExcept) {
		if (!this._bFogVisible) {
			if (this.fireEvent('beforeShow')) {
				if (elExcept) {
					this._oExcept.element = elExcept;
					var sPosition = jindo.$Element(elExcept).css('position');
					if (sPosition == 'static') {
						elExcept.style.position = 'relative';
					}

					this._oExcept.position = elExcept.style.position;
					this._oExcept.zIndex = elExcept.style.zIndex;
					elExcept.style.zIndex = this.option('nZIndex')+1;
				}

				this._elFog.style.zIndex = this.option('nZIndex');
				this._elFog.style.display = 'none';

				this._fitFogToDocument();
				this._fOnResize.attach(window, "resize");
				this._fOnScroll.attach(window, "scroll");

				this._elFog.style.display = 'block';

				var self = this;
				this._bFogShowing = true;
				this._oTransition.abort().start(this.option('nShowDuration'),
					this._elFog, { '@opacity' : this.option("fShowEffect")(this.option('nShowOpacity')) }
				).start(function() {
					self._bFogVisible = true;
					self._bFogShowing = false;
					self.fireEvent('show');
				});
			}
		}
	},

	/**
	 * fog 레이어를 숨긴다.
	 */
	hide : function() {
		if (this._bFogVisible || this._bFogShowing) {
			if (this.fireEvent('beforeHide')) {
				var self = this;

				this._oTransition.abort().start(this.option('nHideDuration'),
					this._elFog, { '@opacity' : this.option("fHideEffect")(this.option('nHideOpacity')) }
				).start(function() {
					self._elFog.style.display = 'none';

					var elExcept = self._oExcept.element;
					if (elExcept) {
						elExcept.style.position = self._oExcept.position;
						elExcept.style.zIndex = self._oExcept.zIndex;
					}
					self._oExcept = {};
					self._fOnResize.detach(window, "resize");
					self._fOnScroll.detach(window, "scroll");

					self._bFogVisible = false;

					self.fireEvent('hide');
				});
			}
		}
	}
}).extend(jindo.Component);

/**
 * @fileOverview HTMLElement를 Drop할 수 있게 해주는 컴포넌트
 * @author hooriza, modified by senxation
 * @version 1.0.2
 */
jindo.DropArea = jindo.$Class({
	/** @lends jindo.DropArea.prototype */
	
	/**
	 * DropArea 컴포넌트를 생성한다.
	 * DragArea 컴포넌트는 상위 기준 엘리먼트의 자식들 중 특정 클래스명을 가진 모든 엘리먼트에 Drag된 엘리먼트를 Drop 가능하게 한다.
	 * @constructs
	 * @class HTMLElement를 Drop할 수 있게 해주는 컴포넌트
	 * @extends jindo.Component
	 * @requires jindo.DragArea
	 * @param {HTMLElement || document} el Drop될 엘리먼트들의 상위 기준 엘리먼트. 컴포넌트가 적용되는 영역(Area)이 된다.
	 * @param {HashTable} htOption 옵션 객체
	 * @example
var oDropArea = new jindo.DropArea(document, { 
	sClassName : 'dropable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drop 가능하게 된다. 
	oDragInstance : oDragArea // (jindo.DragArea) Drop이 될 대상인 DragArea 컴포넌트의 인스턴스
}).attach({
	dragStart : function(oCustomEvent) {
		//oDragInstance의 dragStart 이벤트에 연이어 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 될 엘리먼트 (핸들을 드래그하여 레이어 전체를 드래그되도록 하고 싶으면 이 값을 설정한다. 아래 예제코드 참고)
		//	htDiff : (HashTable) handledown된 좌표와 dragstart된 좌표의 차이 htDiff.nPageX, htDiff.nPageY
		//	weEvent : (jindo.$Event) 마우스 이동 중 발생되는 jindo.$Event 객체
		//};
	},
	over : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트에 마우스 커서가 올라갈 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//}
	},
	move : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트위에서 마우스 커서가 움직일 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	weEvent : (jindo.$Event) 마우스 이동시 발생하는 jindo의 jindo.$Event 객체
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//	nRatioX : (Number) 드랍될 엘리먼트 내부의 좌우비율
		//	nRatioY : (Number) 드랍될 엘리먼트 내부의 상하비율
		//}
	},
	out : function(oCustomEvent) {
		//Drag된 채 Drop 가능한 엘리먼트에서 마우스 커서가 벗어날 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 엘리먼트
		//}
	}, 
	drop : function(oCustomEvent) {
		//Drop 가능한 엘리먼트에 성공적으로 드랍 될 경우 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elHandle : (HTMLElement) Drag하기위한 이벤트를 받은 핸들 엘리먼트
		//	elDrag : (HTMLElement) 실제 Drag 된 엘리먼트 
		//	elDrop : (HTMLElement) Drop 될 대상 엘리먼트
		//	weEvent : (jindo.$Event) mouseup시 발생되는 jindo.$Event 객체 
		//}
	},
	dragEnd : function(oCustomEvent) {
		//oDragInstance의 dragEnd 이벤트에 연이어 발생
		//전달되는 이벤트 객체 oCustomEvent = {
		//	elArea : (HTMLElement) 기준 엘리먼트
		//	elHandle : (HTMLElement) 옵션의 className으로 설정된 드래그 될 핸들 엘리먼트 (mousedown된 엘리먼트)
		//	elDrag : (HTMLElement) 실제로 드래그 된 엘리먼트
		//  aDrop : (Array) Drop 될 대상 엘리먼트의 배열
		//	nX : (Number) 드래그 된 x좌표.
		//	nY : (Number) 드래그 된 y좌표.
		//}
	}
});
	 */
	$init : function(el, htOption) {
		this._el = jindo.$(el);
		this._wel = jindo.$Element(this._el);
		
		this.option({ 
			sClassName : 'droppable', 
			oDragInstance : null 
		});
		this.option(htOption || {});
		
		this._waOveredDroppableElement = jindo.$A([]);
		
		this._elHandle = null;
		this._elDragging = null;
				
		this._wfMouseMove = jindo.$Fn(this._onMouseMove, this);
		this._wfMouseOver = jindo.$Fn(this._onMouseOver, this);
		this._wfMouseOut = jindo.$Fn(this._onMouseOut, this);
		var oDrag = this.option('oDragInstance');
		if (oDrag) {
			var self = this;
			oDrag.attach({
				handleDown : function(oCustomEvent) {
					self._elHandle = oCustomEvent.elHandle;
					self._waOveredDroppableElement.empty(); 
				},
				dragStart : function(oCustomEvent) {
					self._reCalculate();
					self.fireEvent(oCustomEvent.sType, oCustomEvent); //dragStart
					
					self._wfMouseMove.attach(document, 'mousemove'); //move
					//self._wfMouseOver.attach(self._el, 'mouseover'); //over
					//self._wfMouseOut.attach(self._el, 'mouseout');  //out
				},
				drag : function(oCustomEvent) {
					self._elDragging = oCustomEvent.elDrag; 
				},
				dragEnd : function(oCustomEvent) {
					var o = {};
					for (var sKey in oCustomEvent) {
						o[sKey] = oCustomEvent[sKey];
					}
					o.aDrop = self.getOveredLists().concat();
					
					self._clearOveredDroppableElement(oCustomEvent.weEvent, oCustomEvent.bInterupted); //drop
					self.fireEvent(oCustomEvent.sType, o); //dragEnd
					
					self._wfMouseMove.detach(document, 'mousemove');
					//self._wfMouseOver.detach(self._el, 'mouseover');
					//self._wfMouseOut.detach(self._el, 'mouseout'); 
				},
				handleUp : function(oCustomEvent) {
					self._elDragging = null;
					self._elHandle = null;
				}
			});
		} 
	},
	
	_addOveredDroppableElement : function(elDroppable) {
		if (this._waOveredDroppableElement.indexOf(elDroppable) == -1) {
			this._waOveredDroppableElement.push(elDroppable);
			this.fireEvent('over', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},
	
	_fireMoveEvent : function(elDroppable, oRect, oPos, we) {
		var nRatioX = (oPos.pageX - oRect.nLeft) / (oRect.nRight - oRect.nLeft);
		var nRatioY = (oPos.pageY - oRect.nTop) / (oRect.nBottom - oRect.nTop);
		
		this.fireEvent('move', {
			weEvent : we,
			elHandle : this._elHandle,
			elDrag : this._elDragging, 
			elDrop : elDroppable, 
			nRatioX : nRatioX,
			nRatioY : nRatioY
		});
	},

	_removeOveredDroppableElement : function(elDroppable) {
		var nIndex = this._waOveredDroppableElement.indexOf(elDroppable);
		if (nIndex != -1) {
			this._waOveredDroppableElement.splice(nIndex, 1);
			this.fireEvent('out', { 
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable  
			});
		}
	},

	_clearOveredDroppableElement : function(weEvent, bInterupted) {
		if (bInterupted) {
			this._waOveredDroppableElement.empty();
			return;
		}
		for (var elDroppable; (elDroppable = this._waOveredDroppableElement.$value()[0]); ) {
			this._waOveredDroppableElement.splice(0, 1);
			this.fireEvent('drop', {
				weEvent : weEvent,
				elHandle : this._elHandle,
				elDrag : this._elDragging, 
				elDrop : elDroppable 
			});
		}
	},
	
	/**
	 * Drag되고 있는 채, 마우스가 올라간 엘리먼트의 리스트를 구함
	 * @return {Array} 겹쳐진 엘리먼트 
	 */
	getOveredLists : function() {
		return this._waOveredDroppableElement ? this._waOveredDroppableElement.$value() : [];
	},
	
	_isChildOfDropArea : function(el) {
		if (this._el === document || this._el === el){
			return true;
		} 
		return this._wel.isParentOf(el);
	},
	
	_findDroppableElement : function(el) {
		if(!el) return null;
		var sClass = '.' + this.option('sClassName');		
		var elDroppable = jindo.$$.test(el, sClass) ? el : jindo.$$.getSingle('! ' + sClass, el);
		if (!this._isChildOfDropArea(el)) { //기준 엘리먼트가 document인 경우 Magnetic일때 문서밖으로 커서이동시 event 발생!
			elDroppable = null;
		}
		return elDroppable;
	},
	
	_isDragging : function() {
		var oDrag = this.option('oDragInstance');
		return (oDrag && oDrag.isDragging());
	},
	
	_onMouseMove : function(we) {		
		if (this._isDragging()) {
			
			var oPos = we.pos();

			if (we.element == this._elDragging || jindo.$Element(this._elDragging).isParentOf(we.element)) { //Magnetic
				var aItem = this._aItem;
				var aItemRect = this._aItemRect;
				
				for (var i = 0, htRect, el; ((htRect = aItemRect[i]) && (el = aItem[i])); i++) {
					if ( htRect.nLeft <= oPos.pageX && oPos.pageX <= htRect.nRight && htRect.nTop <= oPos.pageY && oPos.pageY <= htRect.nBottom ) {
						this._addOveredDroppableElement(el);
						this._fireMoveEvent(el, htRect, oPos, we);
					} else {
						this._removeOveredDroppableElement(el);
					}
				}
			} else { //Pointing

				var elDroppable = this._findDroppableElement(we.element);
				if(this.elPrevMove && this.elPrevMove != elDroppable){
					this._removeOveredDroppableElement(this.elPrevMove);
					this.elPrevMove = null;
				}
				
				// IE9에서 mousemove event의 element가 dragarea를 반환하기 때문에 droppable을 정상적으로 찾지 못함. 이 경우는 mouse pointer 위치의 element를 이용하여 droppable 탐색
				if( elDroppable==we.element || (!elDroppable && document.elementFromPoint)){
					elDroppable = this._findDroppableElement(document.elementFromPoint(oPos.pageX, oPos.pageY));
				}
				if (!elDroppable) {
					return;
				}
				
				this.elPrevMove = elDroppable;
			
				this._addOveredDroppableElement(elDroppable);
			
				var htOffset = jindo.$Element(elDroppable).offset();
				var htArea = {
					"nLeft" : htOffset.left,
					"nTop" : htOffset.top,
					"nRight" : htOffset.left + elDroppable.offsetWidth,
					"nBottom" : htOffset.top + elDroppable.offsetHeight
				};
		
				if ( htArea.nLeft <= oPos.pageX && oPos.pageX <= htArea.nRight && htArea.nTop <= oPos.pageY && oPos.pageY <= htArea.nBottom ) {
					this._fireMoveEvent(elDroppable, htArea, oPos, we);
				}
			}
			
		}
	},
	
	_onMouseOver : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable) {
				this._addOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_onMouseOut : function(we) {
		if (this._isDragging()) {
			var elDroppable = this._findDroppableElement(we.element);
			if (elDroppable && we.relatedElement && !jindo.$Element(we.relatedElement).isChildOf(we.element)) {
				this._removeOveredDroppableElement(elDroppable);
			}
		}
	},
	
	_getRectInfo : function(el) {
		var htOffset = jindo.$Element(el).offset();	
		return {
			nLeft : htOffset.left,
			nTop : htOffset.top,
			nRight : htOffset.left + el.offsetWidth,
			nBottom : htOffset.top + el.offsetHeight
		};
	},
	
	_reCalculate : function() {
		var aItem = jindo.$$('.' + this.option('sClassName'), this._el);
			
		if (this._el.tagName && jindo.$$.test(this._el, '.' + this.option('sClassName'))) {
			aItem.push(this._el);
		}
		
		this._aItem = aItem;
		this._aItemRect = [];
		
		for (var i = 0, el; (el = aItem[i]); i++) {
			this._aItemRect.push(this._getRectInfo(el));
		}
	}
}).extend(jindo.Component);


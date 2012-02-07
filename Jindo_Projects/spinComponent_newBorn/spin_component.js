var spin= $Class({
	
	_elIncreaBtn : null,
	_elDecreaBtn : null,
	_fUserCallback : null,
	_keep : false,
	_timer :null,
	_invoker:null,
	_fUserCallback : null, 
	_direction : null,
	_elText :null,
	_regExp:/\d+/gi,
	_DELAY_SECOND : 1000,
	
	
	$init : function(welSpinBox, fUserCallback, htOption){
	
		this.option({
			init: 200,
			min: 100,
			max : 300,
			step : 1,
			starterDelay : 0.5,
			durationDelay : 0.1
		});
		
		this.option(htOption || {});
		
		this._fUserCallback = (typeof fUserCallback === 'function') ? fUserCallback : function(){};	
		welSpinBox = (welSpinBox instanceof $Element) ? welSpinBox : $Element(welSpinBox);
		this._setElement(welSpinBox);
		this._attachEvent();		
	},
	
	_setElement : function(welSpinBox){
		//var test = $$.getSingle("<input>", welSpinBox);
		//console.debug(test);
		
		var btns = $$("button", welSpinBox.$value());		
		this._elText = $Element($$("input" , welSpinBox.$value())[0]);
		this._elIncreaBtn = $Element(btns[0]);
		this._elDecreaBtn = $Element(btns[1]);
		
		$Element(this._elIncreaBtn).addClass("increaseBtn");
		$Element(this._elDecreaBtn).addClass("decreaseBtn");
		this._elText.text(this.option("init"));
	},
	
	_attachEvent : function(){
		var mouseblur= $Fn(this._mouseBlur, this).attach(this._elText, 'blur'); 
		var inMouseDown = $Fn(this._mouseDown, this).attach(this._elIncreaBtn,"mousedown");
		var inMouseUp = $Fn(this._mouseUp, this).attach(this._elIncreaBtn,"mouseup");
		var inMouseOver = $Fn(this._mouseOver, this).attach(this._elIncreaBtn,"mouseover");
		
		var deMouseDown = $Fn(this._mouseDown, this).attach(this._elDecreaBtn,"mousedown");
		var deMouseUp = $Fn(this._mouseUp, this).attach(this._elDecreaBtn,"mouseup");
		var deMouseOver = $Fn(this._mouseOver, this).attach(this._elDecreaBtn,"mouseover");
	},
		
	
	
	_increase : function(){	
		this._elText.attr("value", this._checkRange(parseFloat(this._elText.text()) + this.option("step")) );
	},
	
	_decrease : function(){
		var value = this._checkRange(parseFloat(this._elText.text()) - this.option("step"));
		this._elText.attr("value",  value);
	},
	
	_mouseOver :function(event){
		this.fireEvent("mouseover",event);
	},
	
	_mouseDown : function(event){
		this._direction = $Element(event.element).hasClass("increaseBtn");
		this._keep=true;
		this._timer =setTimeout($Fn(this._keepPressCall, this).bind(),  this.option("starterDelay")*this._DELAY_SECOND);
		this.fireEvent("mousedown", event);
	},
	
	/* 버튼 동작에 따른 함수 */
	_mouseUp : function(event){	
		this._keep=false;
		clearTimeout(this._timer);
		if(!this._invoker){  //거짓일때만 업		
			this._direction ? this._increase() : this._decrease();	
			this._fUserCallback(this._elText.text());
		}
		this._invoker=false;
		this.fireEvent("mouseup", event);
	},
	
	_keepPressCall : function(){
		this._invoker= true;
		if(this._keep){		
			this._direction ? this._increase() : this._decrease();
			this._timer=setTimeout($Fn(this._keepPressCall, this).bind(), this.option("durationDelay")*this._DELAY_SECOND);
			this._fUserCallback(this._elText.text());
		}
	},
	
	_mouseBlur : function(){
		var nNumberValue = this._elText.attr("value").match(this._regExp).join("");
		var nReturnedValue = this._checkRange(nNumberValue);
		this._elText.attr("value", nReturnedValue);
		this._fUserCallback(this._elText.text());
	},
	
	/* 숫자 이외에 문자값 제거 */
	_checkRegExp : function(value){
		return value.match(this._regExp).join("");
	},
	
	/* 최대값 최소값 비교 */
	_checkRange : function(nNumberValue){
		var _nEnteredNum=parseFloat(nNumberValue);	
		var max = this.option("max");
		var min = this.option("min");	
		var _nReturnNum=0;
				
		_nReturnNum = _nEnteredNum < min? min : (_nEnteredNum > max? max : _nEnteredNum);
		return _nReturnNum;
	}	
	
}).extend(jindo.Component);
	





$=jindo;

var spinBox= $Class({
	
	_oSpinBox : null,
	_elIncreaBtn : null,
	_elDecreaBtn : null,
	_btnOptions : null,
	_fUserCallback : null,
	_regExp:/\d+/gi,
	_keep : false,
	_timer :null,
	_invoker:null,
	_fUserCallback : null, 
	_direction : null,
	
	$init : function(oSpinBox, elIncreaseBtn, elDecreaseBtn,btnOptions, fUserCallback){
		this._oSpinBox = oSpinBox;
		//_oSpinBox.attr("value",200);  /* 초기화 방법 attr 에 넣는것 그냥 text()로 */
		this._oSpinBox.text(200);
		this._elIncreaBtn = elIncreaseBtn;
		this._elDecreaBtn = elDecreaseBtn;
		this._btnOptions = btnOptions;
		
		
		if(typeof fUserCallback =='function'){
			this._fUserCallback = fUserCallback;  //콜백 함수 
		}
		$Fn(this.checkRegExp, this).attach(this._oSpinBox, 'blur'); 
		$Fn(this.fBtnDown, this).attach(this._elIncreaBtn,"mousedown");
		$Fn(this.fBtnDown, this).attach(this._elDecreaBtn,"mousedown");
		$Fn(this.fBtnUp, this).attach(this._elIncreaBtn,"mouseup");	
		$Fn(this.fBtnUp, this).attach(this._elDecreaBtn,"mouseup");
			
	},
	
	/* 값을 증감 시키는 순수 함수 */
	fIncrease : function(){
		var step = this._btnOptions.step;
		this._oSpinBox.attr("value", this.checkRange(parseFloat(this._oSpinBox.text()) + step) );
	},
	
	fDecrease : function(){
		var step = this._btnOptions.step;
		var value = this.checkRange(parseFloat(this._oSpinBox.text()) - step);
		this._oSpinBox.attr("value",  value);
	},
	
	
	fBtnDown : function(e){
		this._direction = $Element($Event((window.e || e)).element).text();
		this._keep=true;
		this._timer =setTimeout($Fn(this.keepPressCall, this).bind(), 500);
	},
	
	/* 버튼 동작에 따른 함수 */
	fBtnUp : function(){		
		this._keep=false;
		clearTimeout(this._timer);
		if(!this._invoker){  //거짓일때만 업
			if(this._direction=="up"){
				this.fIncrease();
			}else{
				this.fDecrease();
			}	
		}
		this._invoker=false;
		//this._fUserCallback();		
	},
	
	keepPressCall : function(){
		this._invoker= true;
		if(this._keep){		
			//this._fUserCallBack();.
			if(this._direction=="up")
				this.fIncrease();
			else
				this.fDecrease();
			this._timer=setTimeout($Fn(this.keepPressCall, this).bind(),100);
		}
	},
	

	/* 숫자 이외에 문자값 제거 */
	checkRegExp : function(){
		var numberValue = this._oSpinBox.attr("value").match(this._regExp).join("");		
		var num = this.checkRange(numberValue);
		this._oSpinBox.attr("value", num);
	},
	
	/* 최대값 최소값 비교 */
	checkRange : function(numberValue){
		var enteredNum=parseFloat(numberValue);	
		var max = this._btnOptions.max;
		var min = this._btnOptions.min;	
		var returnNum=0;
		
		returnNum = enteredNum < min? min : (returnNum= enteredNum > max? max : enteredNum);
		return returnNum;
	}	
	
});
	
	
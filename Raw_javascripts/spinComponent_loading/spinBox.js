/**
 * �ۼ��� : ������
 * 
 */

//var oSpinBox, oIncreaseBtn, oDecreaseBtn, startTime;
/*
window.onload=function(){
	oSpinBox = document.getElementById("spinBox");
	oIncreaseBtn = document.getElementById("increaseBtn");
	oDecreaseBtn = document.getElementById("decreaseBtn");
	
	
	var insSpin = new spinBox(oSpinBox, oIncreaseBtn, oDecreaseBtn);
	insSpin.init();
};
*/

var _fUserCallHandler;
var spinBox = function(oSpinBox, oIncreaseBtn, oDecreaseBtn, options, fUserCallBackOption){
		
	var regExp=/\d+/gi;
	var max=options.max;
	var min=options.min;
	var step = options.step;
	oSpinBox.value = options.def;
	
	
	var oIncrease = function(){
		var valueNumber = parseFloat(oSpinBox.value);
		oSpinBox.value = valueNumber+ step;
		oSpinBox.value = checkRange(oSpinBox.value);
		
	};
	
	var oDecrease = function(){
		var valueNumber = parseFloat(oSpinBox.value);
		oSpinBox.value = valueNumber-step;
		oSpinBox.value = checkRange(oSpinBox.value);
	};
	
	/* ���Խ� üũ */
	function checkRegExp(){
		var numberValue = oSpinBox.value.match(regExp).join("");		
		oSpinBox.value = checkRange(numberValue);
	}

	function checkRange(numberValue){
		//����üũ���� ������ number�� ��ȯ
		var newNum=parseFloat(numberValue);	
		var returnNum;
		if(newNum<min){
			returnNum=min; 
		}else if (newNum>max){
			returnNum=max;
		}else{
			returnNum=newNum;
		}
		return returnNum;
	}
	
	

	
	
	var init=function(){
		addEvent(oSpinBox,"blur",checkRegExp);

		keepInFunction = new actionFunction(oIncreaseBtn);
		keepDeFunction = new actionFunction(oDecreaseBtn);
		
		keepInFunction.setPressedFunction(oIncrease);
		keepDeFunction.setPressedFunction(oDecrease);
		_fUserCallHandler=fUserCallBackOption;
	
	};
	init();
	
};

var actionFunction = function(btnElement){
	
	var _btnElem = btnElement;
	var callBack;
	
	var _keep=false;
	var _timer;
	
	this.setPressedFunction = function(callBackFunction){
		callBack=callBackFunction;
	};
	
	function _fUserCallBack(){
		if(typeof _fUserCallHandler =='function'){
			_fUserCallHandler();
		}
	};
	
	function keepPressCall(){
		callBack();
		if(_keep==true){
			_fUserCallBack();
			setTimeout(keepPressCall,100);
		}
		_keep=true;
	}
	
	var btnDown = function(){
		_keep=true;	
		_timer = setTimeout(keepPressCall, 500);
	};

	
	function btnUp(){
		clearTimeout(_timer);
		if(_keep==true){
			callBack();
			_fUserCallBack();
			  //콜백 함수 실행
		}
		_keep=false;
		
	}
	

	var init = function(){
		addEvent(_btnElem, 'mousedown', btnDown);
		addEvent(_btnElem, 'change', btnDown);
		addEvent(document, 'mouseup', btnUp);
	};
	
	init();
};


function addEvent(element, eventType, handler){
	if(window.addEventListener){
		element.addEventListener(eventType,handler, false);
	}else{
		element.attachEvent("on"+eventType, handler);
	}
}
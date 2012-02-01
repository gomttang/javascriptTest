/**
 * 작성자 : 김진형
 * 
 */

var oSpinBox, oIncreaseBtn, oDecreaseBtn, startTime; /* 전역 */

window.onload=function(){
	oSpinBox = document.getElementById("spinBox");
	oIncreaseBtn = document.getElementById("increaseBtn");
	oDecreaseBtn = document.getElementById("decreaseBtn");
	oSpinBox.value=200;  /* 초기화=200 */
	
	var insSpin = new spinBox(oSpinBox, oIncreaseBtn, oDecreaseBtn);
	insSpin.init();
	
	

	
};



var spinBox = function(oSpinBox, oIncreaseBtn, oDecreaseBtn){
	
	test("a basic test example", function() {
		  ok( true, "this test is fine" );  
		  var val = 301;
		  equal(checkRange(301), 300, "We expect value to be 300" );
		  equal(checkRange(99), 100, "We expect value to be 100" );
		//  equal(oIncrease(), 201, "RegExp Test Success!");
		});
	
	var regExp=/\d+/gi;
	
	var oIncrease = function(){
		var valueNumber = parseInt(oSpinBox.value);
		oSpinBox.value = valueNumber+ 1;
		oSpinBox.value = checkRange(oSpinBox.value);
		
		/* test code */
		var test = valueNumber+ 1;
		return test;
	};
	
	var oDecrease = function(){
		var valueNumber = parseInt(oSpinBox.value);
		oSpinBox.value = valueNumber-1;
		oSpinBox.value = checkRange(oSpinBox.value);
	};
	
	/* 정규식 체크 */
	function checkRegExp(){
		var numberValue = oSpinBox.value.match(regExp).join("");		
		oSpinBox.value = checkRange(numberValue);
	}

	function checkRange(numberValue){
		//범위체크에서 무조건 number로 변환
		var newNum=parseInt(numberValue);	
		var returnNum;
		if(newNum<100){
			returnNum=100; 
		}else if (newNum>300){
			returnNum=300;
		}else{
			returnNum=newNum;
		}
		return returnNum;
	}

	
	this.init=function(){
		addEvent(oSpinBox,"blur",checkRegExp);

		keepInFunction = new actionFunction(oIncreaseBtn);
		keepDeFunction = new actionFunction(oDecreaseBtn);
		
		keepInFunction.setPressedFunction(oIncrease);
		keepDeFunction.setPressedFunction(oDecrease);
		
	};
	
	
};

var actionFunction = function(btnElement){
	
	var _btnElem = btnElement;
	var callBack;
	
	var _keep=false;
	var _timer;
	
	this.setPressedFunction = function(callBackFunction){
		callBack=callBackFunction;
	};
	
	
	function keepPressCall(){
		callBack();
		if(_keep==true){
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
		}
		_keep=false;
		
	}
	
	
	
	var init = function(){
		addEvent(_btnElem, 'mousedown', btnDown);
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
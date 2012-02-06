/**
 * 
 */

//var eventFlag=true;


$Element.prototype.drag= function drag(targetElement, fCallback){
	
	
	var startX , startY, 
		origX , origY,
		deltaX ,deltaY;
	var _clonedElement;
	var _pressFlag=false;
	
	/* 이벤트 할당 */
	$Fn(mouseDownHandler, this).attach(this, "mousedown");
	$Fn(mouseMoveHandler, this).attach(document, "mousemove"); // this로 하면 마우스가 빨라지면 못따라
	$Fn(mouseUpHandler, this).attach(document, "mouseup");

	
	function mouseDownHandler(event){
		startX =  event.pos().pageX;
		startY =  event.pos().pageY;
		orgiX = this.offset().left;
		orgiY = this.offset().top;
		deltaX = startX-orgiX;
		deltaY = startY-orgiY;
		
		_pressFlag =true;
		
		/* 엘리먼트 복사 */
		_clonedElement =$Element(this.outerHTML());
		_clonedElement.css('position','absolute');
		_clonedElement.css('z-index','9999');
		_clonedElement.appendTo(document.body);
		
		event.stop();
	}
	
	/* 움직임 핸들러 */
	function mouseMoveHandler(event) {
		if(!_pressFlag) return false;
		_clonedElement.offset(event.pos().pageY - deltaY, event.pos().pageX - deltaX);
		
		event.stop();
	}
	
	function mouseUpHandler(){
		var result;
		if(!_pressFlag) return false;
		
		//var test = _clonedElement.$value().getBoundingClientRect();
		var _elDragable = {
				x : _clonedElement.offset().left,
				y : _clonedElement.offset().top,
				width : parseInt(_clonedElement.css("width")),
				height : parseInt(_clonedElement.css("height"))
		};
		var _elTarget={
				x : targetElement.offset().left,
				y : targetElement.offset().top,
				width : parseInt(targetElement.css("width")),
				height : parseInt(targetElement.css("height"))
		};
		
		if(((_elDragable.x + _elDragable.width) >= _elTarget.x) &&
				((_elDragable.y + _elDragable.height) >= _elTarget.y) &&
				((_elDragable.x) <= (_elTarget.x + _elTarget.width)) &&
				((_elDragable.y) <= (_elTarget.y + _elTarget.height)) ){
				result=true;
			}else{		
				result=false;
			}
		
		if(typeof fCallback == 'function' ){	
			fCallback(result);
		}
		_pressFlag =false;
		_clonedElement.leave();

	}
	return this;	
};



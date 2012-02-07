/**
 * 
 */

//var eventFlag=true;

function drag(elementToDrag, targetElement, event, callBackFunc ){
	
	var startX = event.clientX, 
		startY = event.clientY;
	var origX = elementToDrag.offsetLeft, 
		origY = elementToDrag.offsetTop;
	var deltaX = startX - origX, 
		deltaY = startY - origY;
	

	var dragElement = elementToDrag.cloneNode(true); /* 媛앹껜 蹂듭궗 */
	elementToDrag.parentNode.appendChild(dragElement);

	
	if(document.addEventListener){
		document.addEventListener("mousemove",moveHandler,true);
		document.addEventListener("mouseup",upHandler,true);
	}else if(document.attachEvent){
		dragElement.setCapture();
		dragElement.attachEvent("onmousemove",moveHandler);
		dragElement.attachEvent("onmouseup",upHandler);
		dragElement.attachEvent("onlosecapture", upHandler);
	}
	
	
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;  
	}
	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}

		
	function moveHandler(e){
		if(!e) 
			e= window.event;
		
		dragElement.style.left =(e.clientX - deltaX) + "px";
		dragElement.style.top = (e.clientY- deltaY) + "px";
		
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
			
	}
	
	function upHandler(e){
		var result=true;
		var dragableEl={
				x : dragElement.offsetLeft,
				y : dragElement.offsetTop,
				width : dragElement.offsetWidth,
				height : dragElement.offsetHeight
		};
		
		var targetEl ={
				x: targetElement.offsetLeft,
				y: targetElement.offsetTop,
				width :  targetElement.offsetWidth,
				height : targetElement.offsetHeight
		};
		
		
		if(((dragableEl.x + dragableEl.width) >= targetEl.x) &&
			((dragableEl.y + dragableEl.height) >= targetEl.y) &&
			((dragableEl.x) <= (targetEl.x + targetEl.width)) &&
			((dragableEl.y) <= (targetEl.y + targetEl.height)) ){
			result=true;
		}else{		
			result=false;
		}
			
	
		
		if(!e) 
			e= window.event;
		
		if(document.removeEventListener){
			document.removeEventListener("mousemove",moveHandler,true);
			document.removeEventListener("mouseup",upHandler,true);
		}else if(document.detachEvent){
			dragElement.detachEvent("onmousemove",moveHandler);
			dragElement.detachEvent("onmouseup",upHandler);
			dragElement.detachEvent("onlosecapture", upHandler);
			dragElement.releaseCapture();
		}
	
		
		if(e.stopPropagation){
			e.stopPropagation();
		}else{
			e.cancelBubble = true;
		}
		elementToDrag.parentNode.removeChild(dragElement);		/* �대룞以묒씤 媛앹껜 ��젣 */
		if(result)
			return callBackFunc(true,elementToDrag);
		else
			return callBackFunc(false,elementToDrag);
	}	
	
}



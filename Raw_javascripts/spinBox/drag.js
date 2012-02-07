/**
 * 
 */

//var eventFlag=true;

function drag(elementToDrag, targetElement, event){
	//eventFlag=true;
	var startX = event.clientX, 
		startY = event.clientY;
	var origX = elementToDrag.offsetLeft, 
		origY = elementToDrag.offsetTop;
	var deltaX = startX - origX, 
		deltaY = startY - origY;
	
	//var targetEl = targetElement;	
	var dragElement = elementToDrag.cloneNode(true); /* 객체 복사 */
	document.body.appendChild(dragElement);

	
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
		
		var dropOffset={
				x : dragElement.offsetLeft,
				y : dragElement.offsetTop,
				width : dragElement.offsetWidth,
				height : dragElement.offsetHeight
		};
		
		var targetEl ={
				x: targetElement.offsetLeft,
				y: targetElement.offsetHeight,
				width :  targetElement.offsetWidth,
				height : targetElement.offsetWidth
		};
		
		
		if(((dropOffset.x + dropOffset.width) >= targetEl.x) &&
			((dropOffset.y + dropOffset.height) >= targetEl.y) &&
			((dropOffset.x) <= (targetEl.x + targetEl.width)) &&
			((dropOffset.y) <= (targetEl.y + targetEl.height)) ){
			
			document.getElementById("stat").innerHTML="들어왔다";
		}else{
			document.getElementById("stat").innerHTML="ㅠㅠ";
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
		document.body.removeChild(dragElement);		/* 이동중인 객체 삭제 */
	//	eventFlag=false;		
			
	}	
}



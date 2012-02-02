
var SpinComponent=function(elCanvas,userOptions){
	
	var context;
	var middleX, middleY;

	/* 옵션값들 */ 
	var options={};
	var lines, length, width, radius, trail, speed, bShadow, color;
	var lineAngle;
	var nCurrentLine=0;	
	/* SpinComponent 객체 생성시 옵션 설정 */
	/*
	if(userOptions!=undefined){
		setOptions(userOptions);
	}*/
	
	
	this.init=function(){
		/* 배경화면 */
		context = elCanvas.getContext('2d');		
		context.fillStyle = 'rgba(0,0,0,0.05)';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);	
		context.lineCap='round';
		
		
			d=0;
			/* 디폴트 옵션 */
			option={
					lines : 13,
					length : 10,
					width : 4,
					radius : 10,
					speed : 100,
					trail : 1.0,
					color : {r:0, g:0, b:0}				
			};
				
	
		/* 버튼 등록 */
		
		
		/* 옵션 세팅 */
		setOptions(option);
	};
	
	

	this.onDataChange= function(){
		var nLines = document.getElementById("lines").value;
		var nLength =document.getElementById("length").value;
		var nWidth =document.getElementById("width").value;
		var nRadius =document.getElementById("radius").value;
		var nTrail =document.getElementById("trail").value;
		var nSpeed =document.getElementById("speed").value;
		var nR = document.getElementById("r").value;
		var nG =document.getElementById("g").value;
		var nB =document.getElementById("b").value;
		
		var changeOptions={
				lines: parseInt(nLines),
				length:parseInt(nLength),
				width: parseInt(nWidth),
				radius : parseInt(nRadius),
				trail : parseFloat(nTrail),
				speed : parseInt(nSpeed),
				color :{r:parseInt(nR), g:parseInt(nG), b:parseInt(nB)}
				};

		clearTimeout(timer);
		setOptions(changeOptions);
	};
	
	

	
	/* 옵션 설정 */
	function setOptions(options){	
		/* 객체의 중심점 */
		middleX = context.canvas.width/2;
		middleY = context.canvas.height/2;
		
		lines = options.lines;
		length = options.length;
		width = options.width;
		radius = options.radius;
		speed = options.speed;
		trail = options.trail;
		bShadow = options.bShadow;
		color = options.color;
		imageDraw();
	}
	
	
	
	function imageDraw(){

		context.clearRect(0, 0, context.canvas.width, context.canvas.width);		
		context.fillStyle = 'rgba(0,0,0,0.0.05)';
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
		
		trail=1.0;
		lineAngle = (Math.PI*2) / lines; /* 선간 각도 */
		var currentLineAngle = nCurrentLine * lineAngle * -1;
		
		context.stroke(); // 이제까지의 패스선 그래픽으로 표현
		context.closePath(); 
			
		for(var i=0; i < lines; i++){
			context.beginPath();  //패스를 그리기 시작
			context.lineWidth = width;
			
			context.strokeStyle = 'rgba('+color.r+', '+color.g+', '+color.b+', '+trail+')';						
			context.moveTo(middleX + Math.sin(currentLineAngle)*(radius), middleY+Math.cos(currentLineAngle)*(radius));			
			context.lineTo(middleX + Math.sin(currentLineAngle)*(radius + length), middleY+Math.cos(currentLineAngle)*(radius + length));

			context.stroke(); // 이제까지의 패스선 그래픽으로 표현
			context.closePath(); ///패스를 그리기 끝
			
			currentLineAngle += lineAngle;
			
			/* 밝기 감소치 */
			trail-=0.05;	
		}
		
		nCurrentLine++;		
		if(nCurrentLine >= lines) 
			nCurrentLine = 0;
	
		timer=setTimeout(imageDraw, speed);
	};
	
};

function addEvent(element, eventType, handler){
	if(window.addEventListener){
		element.addEventListener(eventType,handler, false);
	}else{
		element.attachEvent("on"+eventType, handler);
	}
}


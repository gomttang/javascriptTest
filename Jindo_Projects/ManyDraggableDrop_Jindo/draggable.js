
function draggable(elElement){
	
	var _welEl = $Element(elElement);
	var nRed = parseInt((Math.random() * 10),10) + 1;
	var nBlue =  parseInt((Math.random() * 10),10) + 1;
	var oClientSize = $Document().clientSize();
	var elCloneDrag = null;
	var elDragPos=null;
	
	makeBoxes();		
	addComponentEvent();
	
	function makeBoxes(){
		for(var i = 0 ; i < nRed ; i++){	
			var nXRed = parseInt(Math.random() * oClientSize.width, 10);
			var nYRed = parseInt(Math.random() * oClientSize.height, 10);
			var elRed = $Element("<div>").className("draggable").offset(nYRed, nXRed);
			_welEl.append(elRed);
		}
		
		for(var i = 0 ; i < nBlue ; i++){
			var nXBlue = parseInt(Math.random() * oClientSize.width,10);
			var nYBlue = parseInt(Math.random() * oClientSize.height,10);
			var elBlue = $Element("<div>").className("dropable").offset(nYBlue, nXBlue).text(0);
			_welEl.append(elBlue);
		}
	}
	
	function addComponentEvent(){
		/* foggy */
		var oFoggy = new jindo.Foggy({sClassName : "fog"});		
		_welEl.delegate('click','.dropable',function(e){oFoggy.show(e.element);});  // $Fn(function(e){oFoggy.show(e.element);} , window).attach($$(".droparea"),"click");  
		oFoggy.getFog().onclick = function() { oFoggy.hide(); };
		
		/* Rollover */
		new jindo.RolloverArea($$(".draggable"),{
				sClassName : "draggable", 
				sClassPrefix : "draggable-",
				bCheckMouseDown : true,
				bActivateOnload : true,
				htStatus : {
					sOver : "over",
					sDown : "down"
				}});
		
		/* transition */
		var oTransition = new jindo.Transition({ 	
						//fEffect : jindo.Effect.overphase
						fEffect : jindo.Effect.easeOut
		}).attach({
				'end' : function(e){
					deleteCloneElement();
				}
		});
		
		/* drag */
		var oDragArea = new jindo.DragArea(document,{
			sClassName : 'draggable',
			bFlowOut : true,
			bSetCapture : true, //ie에서 bSetCapture 사용여부
			nThreshold : 0
		}).attach({
				'dragStart' : function(oCustomEvent) {
					if(elCloneDrag){ /* 이미 trasition 실행 도중에 새로운 액션 시작할 경우 기존의trasition 제거 */
						oTransition.abort();
						deleteCloneElement();
					}
					elCloneDrag  =  oCustomEvent.elDrag.cloneNode(true);
					elDragPos = {top: $Element(oCustomEvent.elDrag).css("top") , left: $Element(oCustomEvent.elDrag).css("left") };
					$Element(elCloneDrag).appendTo($Element(oCustomEvent.elDrag).parent());
					oCustomEvent.elDrag=elCloneDrag;
				},
				'handleUp' : function(oCustomEvent){
					if(elCloneDrag){
						oTransition.start(800, [
						                     	[elCloneDrag, {
						                     		'@left' : elDragPos.left
						                     	}],
						                     	
						                     	[elCloneDrag, {
						                     		'@top' : elDragPos.top
						                     	}]
						                     ]);
					}
				},
				
		});
		
		/* drop */
		new jindo.DropArea(document, { 
			sClassName : 'dropable', // (String) 상위 기준 엘리먼트의 자식 중 해당 클래스명을 가진 모든 엘리먼트는 Drop 가능하게 된다. 
			oDragInstance : oDragArea // (jindo.DragArea) Drop이 될 대상인 DragArea 컴포넌트의 인스턴스
		}).attach({
				'over' : function(oCustomEvent) {
					$Element(oCustomEvent.elDrop).addClass("dropable-over");
				},
				'out' : function(oCustomEvent) {
					$Element(oCustomEvent.elDrop).removeClass("dropable-over");
				}, 
				'drop' : function(oCustomEvent) { 			 /* drop 성공시 에만 실행 */
					var welBlue = $Element(oCustomEvent.elDrop);
					var nCount = parseInt(welBlue.text(),10);
					welBlue.text(++nCount);		
					$Element(oCustomEvent.elDrop).removeClass("dropable-over");
					deleteCloneElement();	
				}
			
		});
	}
	
	function deleteCloneElement(){
		$Element(elCloneDrag).leave();	
		elCloneDrag = null;
	}
};


 
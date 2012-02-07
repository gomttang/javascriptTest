


window.onload = function(){
	
	var drinksInstance = new drinks();	
	drinksInstance.init();
};




var drinks = function(){
	var consoles,randomNum;
	
	var sortOfDrinks = new Array();	
	
	leftMoneys=document.getElementById("money");
	consoles= document.getElementById("consoles");

	this.init = function(){
		setDrinks("Coke",500, randomValue());
		setDrinks("Pepsi",600, randomValue());
		setDrinks("Water",100, randomValue());
		setDrinks("Pee",200, randomValue());
		setDrinks("Cider",300, randomValue());
		setDrinks("DanJang",800, randomValue());
		setDrinks("riceDrinking",400, randomValue());
		setDrinks("Coki",700, randomValue());
		
		moneyPrint();
		drinkingPrint();
	};
	
	var setDrinks = function(names, prices, lefts){	
		sortOfDrinks.push({name:names, price:prices, left: lefts});//[{name : names, price: prices}];
	};
	
	

	function printConsole(consoleText){
		var txt=document.createTextNode(consoleText+"\n\r");
		consoles.appendChild(txt);
		consoles.scrollTop=99999;
	}
	
	var objDiv ;
	var oMoney= document.getElementById("moneyWrapper");
	var otargetMoneyBox = document.getElementById("insertMoney");
	var oMyMoneyStat = document.getElementById("leftMoneyWrapper");
	var oReturnButton = document.getElementById("returnButton");
	var parentNode=document.getElementById("menu");
	
	var initMoney=new Array(50,100,500,1000);
	var consoleText="";
	
	
	
	/* 돈을 div하위에 넣어준다. */
	
	var moneyPrint = function(){
		innerTop=230;
		for(var i=0; i<initMoney.length;i++){
			
			objDiv = document.createElement("div");
			objDiv.className="won";
			objDiv.innerHTML=initMoney[i];
			
			innerTop=innerTop+50;
			objDiv.style.top += innerTop + "px";
			oMoney.appendChild(objDiv);
			bandingMachinEventListener(objDiv, "moneyEventListener");
		}	
		bandingMachinEventListener(oReturnButton, "returnButtonEventListener");
	};
	
	
	/* 자판기 화면에 음료를 그려준다 */
	var drinkingPrint = function(){
		randomNum = randomRange(0,7);
		//console.debug(randomNum);
		var i=0,k=0;		
		while(randomNum[i]!=null){
			if(typeof randomNum[i]!='undefined'){
				objDiv = document.createElement("div");
				objDiv.className="dWrapper";
				
				drinkNameNode=document.createElement("span");
				drinkNameNode.className="drink";
				drinkNameNode.innerHTML=sortOfDrinks[randomNum[i]].name;
				
				drinkPriceNode=document.createElement("span");
				drinkPriceNode.className="price";
				drinkPriceNode.innerHTML=sortOfDrinks[randomNum[i]].price;
				
				drinkLeftNode=document.createElement("span");
				drinkLeftNode.className="left";
				drinkLeftNode.innerHTML=sortOfDrinks[randomNum[i]].left;
				
				objDiv.appendChild(drinkNameNode);
				objDiv.appendChild(drinkPriceNode);
				objDiv.appendChild(drinkLeftNode);	
				
				bandingMachinEventListener(objDiv,"drinkingEventListener");
			}else{
				continue;
			}
			++k;
			i++;
			parentNode.appendChild(objDiv);
		}		
	};
	
	function bandingMachinEventListener(obj,type){
		if(type=="moneyEventListener"){
			addEvent(obj,"mousedown",function(e){
				e=window.event || e;	
				drag(obj,otargetMoneyBox,e, MoneyInsertEvent);	
			});		
		}else if(type=="drinkingEventListener"){
			addEvent(obj,"mousedown",buyDrinking);
		}else if(type=="returnButtonEventListener"){
			addEvent(obj,"mousedown",moneyReturnEvent);
		}
	}
	
	/*
	 * myMoney 지갑에 있는돈
	 * selectedMoney 방금 선택한 돈
	 * insertedMoney 자판기에 있는돈 
	 */

	var selectedMoney;
	var insertedMoney = 0;
	var myMoney=10000;
	var _paperFlag=0;
	
	var moneyReturnEvent = function(){
		myMoney = myMoney + insertedMoney;
		insertedMoney=0;
		consoleText=otargetMoneyBox.innerHTML + " WON RETRUNED....";
		printConsole(consoleText);
		otargetMoneyBox.innerHTML = "0";
		oMyMoneyStat.innerHTML = myMoney;
		_paperFlag=0;
	
	};
	
	
	/* 돈 드래그 앤 드랍 시 이벤트 */
	var MoneyInsertEvent =function(result, obj){
		
		selectedMoney= parseInt(obj.innerHTML);

		if(insertedMoney>=3000){
			consoleText=" maximun 3000won..sorry";
			printConsole(consoleText);
			return;
		}
		if(selectedMoney==1000 && result!=false){
			_paperFlag+=1;
			if(_paperFlag>=2){
				consoleText=selectedMoney + " : youcan't!! you have just have 1000 won!!";
				printConsole(consoleText);
				return;
			}
		}
		if(myMoney>0){
			if(result==true){
				
				insertedMoney+=selectedMoney;
				otargetMoneyBox.innerHTML=insertedMoney;
				
				myMoney=myMoney-selectedMoney;
				oMyMoneyStat.innerHTML=myMoney;
				
				consoleText=selectedMoney + " : inserted your money!";
				
			}else if(result==false){
				myMoney=myMoney-selectedMoney;    /* 지갑에 있는돈 */
				oMyMoneyStat.innerHTML=myMoney;  
				
				consoleText=selectedMoney + " dropped money m.m";
			}
			printConsole(consoleText);
		}else{
			consoleText=selectedMoney + " no money..";
			printConsole(consoleText);
		}
		
	};
	
		
	/* 드링킹 이벤트 */
	var buyDrinking=function(){
		
		var childs = this.childNodes;
		
		thisDrinkingName = childs[0];
		thisDrinkingNameValue = thisDrinkingName.innerHTML;
		
		thisDrinkingPrice = thisDrinkingName.nextSibling;
		thisDrinkingPriceValue=parseInt(thisDrinkingPrice.innerHTML);
		
		thisDrinkingLeft = this.lastChild;
		thisDrinkingLeftValue = parseInt(thisDrinkingLeft.innerHTML);
		
		
		if(thisDrinkingLeftValue > 0 && thisDrinkingPriceValue <= insertedMoney ){
			insertedMoney= insertedMoney - thisDrinkingPriceValue;
			thisDrinkingLeft.innerHTML = thisDrinkingLeftValue -1;
			otargetMoneyBox.innerHTML=insertedMoney;
			consoleText=thisDrinkingNameValue + " :you get it!";	
		}else if(thisDrinkingLeftValue <= 0){
			consoleText=thisDrinkingNameValue + " no more in the machine...sorry.";
		}else if(thisDrinkingPriceValue > insertedMoney){
			consoleText="not enough money";
		}
		printConsole(consoleText);
		consoleText="";
	};
	
	
	
	
	/* 랜덤 값 계산 */
	var randomValue = function(){
		return Math.floor((Math.random() * (3 - 1 + 1)) + 1 );
	};
	/* Random */
	var randomRange = function(n1, n2){	  	
        var ar = new Array();
        var temp;
        var rnum;

        for(var i=n1; i<=n2; i++){
            ar.push(i);
        }

        for(var i=0; i< ar.length ; i++){
            rnum = Math.floor((Math.random() * (n2 - n1 + 1)) + n1 );
            temp = ar[i];
            ar[i] = ar[rnum];
            ar[rnum] = temp;	
        }        
      
        return ar;
	};
};
	


function addEvent(Element, EventType, Handler) {

	if(document.addEventListener) {
		//DOM 占쏙옙占�
		Element.addEventListener(EventType, Handler, false);
	}else if(document.attachEvent) {
		//IE	
		Element.attachEvent("on"+EventType, Handler);
	}
};	
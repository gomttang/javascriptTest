

var testQunit=function(){
	
	var mockDrinksInstance = new drinks();
	var insertedMoney, selectedMoney,_paperFlag=0,myMoney=0;
	
	this.testQunitStart= function(){
		var testInstance = new drinks();
		
		test("a basic test example", function() {
	  	ok( true, "this test is fine" );
	  		  	
		});
		
		test("Insert Money Test", function() {		  		  	
		  	var m = fInsertMoney(3000,1000);
		    equal( m, 3000, "maximum 3000 test> you will have 3000 ");
		    fInsertMoney(1000,1000);
		    m = fInsertMoney(1000,1000);
		    equal( m, 1000, "1000*2 test > you will have 1000 ");
		});
		test("ReturnEvent Test", function() {		  		  	
			value = fMoneyReturnEvent(1000, 100)
		    equal( value, 1100, "you will have 1100 ");
		});
	
	};
	var fMoneyReturnEvent = function(myMoney, insertedMoney){
		myMoney = myMoney + insertedMoney;
		insertedMoney=0;
		//consoleText=otargetMoneyBox.innerHTML + " WON RETRUNED....";
		//printConsole(consoleText);
	//	otargetMoneyBox.innerHTML = "0";
	//	oMyMoneyStat.innerHTML = myMoney;
		_paperFlag=0;
		return myMoney;
	
	};
	
	var fInsertMoney = function(insertedMoney,selectedMoney, result){
  		
		if(insertedMoney>=3000){
			consoleText=" maximun 3000won..sorry";
			//printConsole(consoleText);
			return insertedMoney;
		}
		if(selectedMoney==1000 && result!=false){
			_paperFlag+=1;
			if(_paperFlag>=2){
				consoleText=selectedMoney + " : youcan't!! you have just have 1000 won!!";
			//	printConsole(consoleText);
				return insertedMoney;
			}
		}
		if(myMoney>0){
			if(result==true){			
				insertedMoney+=selectedMoney;
			//	otargetMoneyBox.innerHTML=insertedMoney;		
				myMoney=myMoney-selectedMoney;
			//	oMyMoneyStat.innerHTML=myMoney;			
				consoleText=selectedMoney + " : inserted your money!";		
			}else if(result==false){
				myMoney=myMoney-selectedMoney;    
			//	oMyMoneyStat.innerHTML=myMoney;  			
				consoleText=selectedMoney + " dropped money m.m";
			}
		//	printConsole(consoleText);
		}else{
			consoleText=selectedMoney + " no money..";
		//	printConsole(consoleText);
		}
		return insertedMoney;
	
	};
  	
	
	

};
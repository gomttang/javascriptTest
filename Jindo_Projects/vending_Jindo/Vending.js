/**
 * 
 */


var Vending=$Class({
	
	_nMoneyInWallet : 10000,
	_nInsertedMoney : 0,
	_elInsertArea: null,
	_nCountChunWon: 1,
	_elConsole:null,
	
	$init :  function(disPlayElement){
		this._elConsole = new Console($Element("consoles"));
		var oDrinkingProduct = new DrinkingProduct(disPlayElement,this._elConsole);	
		oDrinkingProduct.attach("onproductclick", $Fn(this.buyEvent, this).bind());
		this.displayMoney();
	},
	
	displayMoney : function(){
		var _elInsertArea = $Element("insertMoney");
			
		$Element("50won").drag(_elInsertArea, $Fn(function(drop){ 
			if(drop) this.insert(50);
			else this.dropToFloor(50);
		}, this).bind());
		$Element("100won").drag(_elInsertArea, $Fn(function(drop){ 
			if(drop) this.insert(100);
			else this.dropToFloor(100);
		}, this).bind());
		$Element("500won").drag(_elInsertArea, $Fn(function(drop){ 
			if(drop) this.insert(500);
			else this.dropToFloor(500);
		}, this).bind());
		$Element("1000won").drag(_elInsertArea, $Fn(function(drop){ 
			if(drop) this.insert(1000);
			else this.dropToFloor(1000);
		}, this).bind());
		
		$Fn(this.returnMoney,this).attach($Element("returnButton"), "click");
	},

	
	insert : function(money){
		
		if(this._nMoneyInWallet < 0 || this._nMoneyInWallet < money){
			this._elConsole.out("돈이 부족 합니다.");
			return false;
		}
		
		if(money==1000 && this._countChunWon>=2){
			this._elConsole.out(money+" 2 times!!! no more..");
			return false;
		}
		if(money==1000){
			this._nCountChunWon++;
		}
		
		this._nInsertedMoney+=money;
		this._nMoneyInWallet-=money;
		this._elConsole.out("inserted "+money+" won ");
		this.refresh();
	},
	
	dropToFloor : function(money){
		this._nMoneyInWallet-=money;
		this._elConsole.out(money+"won droped. you lost your money");
		this.refresh();
	},
	
	returnMoney : function(){
		this._nCountChunWon=1;
		this._nMoneyInWallet+=this._nInsertedMoney;
		this._elConsole.out(this._nInsertedMoney+"won returned");
		this._nInsertedMoney=0;
		this.refresh();
	},
	
	
	buyEvent : function(e){	
		sDrinkingName = e.product._sName;
		nDrinkingPrice = parseInt(e.product._nPrice);
		nDrinkingAmount = parseInt(e.product._nAmount);
		
		if(nDrinkingAmount <=0){
			this._elConsole.out(sDrinkingName + " sold out");
			return false;
		}else{
			if(this._nInsertedMoney < nDrinkingPrice){
				this._elConsole.out(sDrinkingName + " Not enough Money");
			}else{
				this._nInsertedMoney-=nDrinkingPrice;
				this._elConsole.out("You get ::: "+ sDrinkingName);
				e.product._nAmount -=1;
				
			}
		}
		this.refresh();
		
	},
	
	refresh:function(){
		$Element("insertMoney").text(this._nInsertedMoney);
		$Element("leftMoneyWrapper").text(this._nMoneyInWallet);
	}
	


}).extend(jindo.Component);





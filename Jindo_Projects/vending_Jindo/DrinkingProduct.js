/**
 * 
 */


var DrinkingProduct=$Class({
	_oSortOfDrinks : [{name: "coke", price : 100},
	                {name : "pepsi", price: 200},
	                {name : "soju", price:300},
	                {name : "Fanta", price :400},
	                {name : "RiceD", price: 500},
	                {name : "Vita500", price : 600},
	                {name : "water", price : 700},
	                {name : "pee",price : 800}],
	_aDrinks:[],
	_elDisplayElement:null,
	_elConsole : null,
	_buyEvent : null,
	
	$init :  function(displayElement,elConsole){
		this._elConsole=elConsole;
		this._elDisplayElement = displayElement;
		this.setDrinksRandom(this._elDisplayElement);
	},

	setDrinksRandom : function(displayElement){
	
		for(var i=0; i< 8; i++){
			var index = Math.floor(Math.random()*(this._oSortOfDrinks.length));
			var amount = Math.floor(Math.random()*3)+1;
			
			this._aDrinks.push(new Product(this._oSortOfDrinks[index].name, this._oSortOfDrinks[index].price, amount));
			this._oSortOfDrinks.remove(index); /* 리스트에서 제거 */
			this.display(this._aDrinks[i]);	
		}
		
	},
	
	display : function(someDrink){
		var _objDiv = $Element("<div></div>");
		_objDiv.className("dWrapper");
		
		var drinkNameNode=$Element("<span></span>");
		drinkNameNode.className("drink");
		drinkNameNode.text(someDrink.getName());
		
		var drinkPriceNode=$Element("<span></span>");
		drinkPriceNode.className("price");
		drinkPriceNode.text(someDrink.getPrice());
		
		var drinkLeftNode=$Element("<span></span>");
		drinkLeftNode.className("amount");
		drinkLeftNode.text(someDrink.getAmount());
		
		_objDiv.append(drinkNameNode);
		_objDiv.append(drinkPriceNode);
		_objDiv.append(drinkLeftNode);	
		
		_objDiv.appendTo(this._elDisplayElement);
		
		$Fn($Fn(function(o){this.fireEvent("onproductclick", {product: o});}, this).bind(someDrink), this).attach(_objDiv,"click");
	},
	
	
}).extend(jindo.Component);


/* 상품에 관한 정보 */
var Product = $Class({
	_sName: null,
	_nPrice: null,
	_nAmount : null,
	
	$init : function(name, price, amount){
		this._sName= name;
		this._nPrice= price;
		this._nAmount=amount;
	},
	
	getName : function(){
		return this._sName;
	},
	
	getPrice : function(){
		return this._nPrice;
	},
	
	getAmount : function(){
		return this._nAmount;
	}
	
});

Array.prototype.remove = function(from, to) {
	  var rest = this.slice((to || from) + 1 || this.length);
	  this.length = from < 0 ? this.length + from : from;
	  return this.push.apply(this, rest);
};
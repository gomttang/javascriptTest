/**
 *  작성자 : 김진형
 *  2012.02.04
 */


var Console =$Class({
	_elConsole : null,
	
	$init : function(elConsole){
		this._elConsole = elConsole;
	},
	
	out : function(txt){
		var _txt=document.createTextNode(txt+"\r\n");
		this._elConsole.$value().appendChild(_txt);
		this._elConsole.$value().scrollTop=99999;
	}
});
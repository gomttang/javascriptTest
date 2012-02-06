/*  1. XHR +XML  */
function ajaxRequestXml() {
	var oAjax = new $Ajax('text/data_XML_for_XHR.xml',{
		type : 'xhr',
		method : 'get',
		onload : function(res){
				var list = $Element('list');
				list.empty();
				
				var elData = cssquery.getSingle('data',res.xml());

				list.html(elData.firstChild.nodeValue);
		},
		
	});
	oAjax.request();
	
};

/*  2. XHR + JSON  */
function ajaxRequestJson() {
	
	var oAjax = new $Ajax('text/data_JSON_for_XHR.txt',{
		type : 'xhr',
		method : 'get',
		onload : function(res){
			var oStr = res.json();	
			var list = $Element('list');
			list.empty();
			for(var i =0 , nLen=oStr.length ; i < nLen; i++){
				list.append($("<li>"+ oStr[i]+"</li>"));
			}
			
			},
			timeout : 3,
			ontimeout : function(){
				alert("Timeout!");
			},
	async : true,	
	});
	oAjax.request();
};


/*  3. XHR + Plain Text  */
function ajaxRequest() {
		
		var oAjax = new $Ajax('text/data_PlainText_for_XHR.txt',{
				type : 'xhr',
				method : 'get',
				onload : function(res){
					$Element('list').html(res.text());
				},	
		
				timeout : 3,
				ontimeout : function(){
					alert("Timeout!");
				},
		async : true,
		});
		oAjax.request();		
};



/*  4. Jsonp + JSON  */
function ajaxRequestJsonpJSON() {
	
	var oAjax = new $Ajax('text/data_JSON_for_JSONP.txt',{
			type : 'jsonp',
			method : 'get',  //자동으로 설정됨
			jsonp_charset : 'utf-8',
			
			onload : function(res){
				var response = res.json();	
				var list = $Element('list');
				list.empty();
				var aTemp = response.substring(1, response.length-1).split(',');
			
				for(var i=0, nLen=aTemp.length ; i< nLen ; i++){
					list.append($("<li>"+aTemp[i]+"</li>"));
				}
			},	
			callbackid: '12345', 
			callbackname : '_callback',
			timeout : 3,
			ontimeout : function(){
				alert("Timeout!");
			},
	
	});
	oAjax.request();		
};

/*  5. Jsonp + Plain Text  */
function ajaxRequestJsonpPlain() {
		var oAjax = new $Ajax('text/data_PlainText_for_JSONP.txt',{
				type : 'jsonp',
				method : 'get',  //자동으로 설정됨
				jsonp_charset : 'utf-8',
				
				onload : function(res){
					var aTemp = res.json();
					$Element('list').html(aTemp);
				},	
				callbackid: '12345',
				callbackname : '_callback',
				timeout : 3,
				ontimeout : function(){
					alert("Timeout!");
				},
		
		});
		oAjax.request();		
};













var calender = new $Class({
	
	_aData : [],
	_welBtnPrevYear: null,
	_welBtnPrevMon : null,
	_welBtnNextYear : null,
	_welBtnNextMon : null,
	_welYearMonthTitle : null,
	_elWeek : null,
	_elCloneTemplete : null,
	_elParentNode : null,
	
	
	$init : function(welClenderElement, oOption){
		this.option({	
			language : "kr",
		});		
		this.option(oOption || {});
		
		var today = new Date();
		this.oToday ={
			nYear : today.getFullYear(),
			nMonth : today.getMonth()+1, /* 0~11 [1월~12월*/
			nDate : today.getDate() /* 1-31일 */  
		};		
		this._getElement(welClenderElement);
		if(!this.option("nYear")){
			this._today();
		}
		
		this._setBtnEvent();
		this._setOptions();
	},
	
	
	_setOptions : function(){	
		if(this.option("language")){
			var aLangEnLower =["S","M","T","W","T","F","S"];
			var aLangEn=["Sun","Mon","Tue","Wen","Thu","Fri","Sat"];
			var aLangKr=["일","월","화","수","목","금","토"];
			var aLang = null;
			
			if(this.option("language") === "en"){
				aLang = aLangEn;
			}else if(this.option("language") === "enl"){
				aLang = aLangEnLower;
			}else if(this.option("language") === "kr"){
				aLang = aLangKr;
			}
		
			var elDayTemp = $$.getSingle("tr", this._welClenderElement);
			var welDayParent = $Element(elDayTemp.parentNode);
			var elCloneDay = elDayTemp.cloneNode(true);
			welDayParent.append(elCloneDay);
			var elDay = $$("th", elCloneDay);
			
			for(var i = 0; i < aLang.length ; i++){
				var welDay = $Element(elDay[i]);
				welDay.text(aLang[i]);
			}	
			$Element(elDayTemp).leave();
		}
	},
	
	_getElement : function(welClenderElement){
		this.welClenderElement = (welClenderElement instanceof $Element) ? welClenderElement : $Element(welClenderElement);
		
		this._welBtnPrevYear =$Element($$.getSingle(".btn-prev-year",this.welClenderElement));
		this._welBtnPrevMon=$Element($$.getSingle(".btn-prev-mon",this.welClenderElement));
		this._welBtnNextYear=$Element($$.getSingle(".btn-next-year",this.welClenderElement));
		this._welBtnNextMon=$Element($$.getSingle(".btn-next-mon",this.welClenderElement));
		
		this._welYearMonthTitle= $Element($$.getSingle(".year-month-title"),this.welClenderElement);
		this._elWeek =  $$.getSingle(".week",this.welClenderElement);
		/* 템플릿을 복제한다.  */
		this._elCloneTemplete = this._elWeek.cloneNode(true);
		this._elParentNode = this._elWeek.parentNode;
	},
	
	/* 이벤트 세팅 */
	_setBtnEvent : function(){
		$Fn(function(e){this._setChangeCalender(-1, 0);}, this).attach(this._welBtnPrevYear, "click");
		$Fn(function(e){this._setChangeCalender(+1, 0);}, this).attach(this._welBtnNextYear, "click");
		$Fn(function(e){this._setChangeCalender(0, -1);}, this).attach(this._welBtnPrevMon, "click");
		$Fn(function(e){this._setChangeCalender(0, +1);}, this).attach(this._welBtnNextMon, "click");	
		
		this._onDateClick = $Fn(function(event){
			for(var i=0; i<this._aData.length; i++){
				if(this._aData[i].welDate.$value() == event.element)
					this.fireEvent("ondateclick", this._aData[i], this._aData[i].welDate);				
				}		
			
			}, this).bind();
		$Element(this._elParentNode).delegate('click', '.date', this._onDateClick);
	},
	/* 버튼 이벤트에 따른 년/월 변경 */
	_setChangeCalender : function(nYear, nMonth) {		
		var oNewDate = new Date(this._nYear, this._nMonth);		
		oNewDate.setFullYear(this._nYear+nYear, (this._nMonth - 1) + nMonth);			
		this._setDate(oNewDate.getFullYear(), oNewDate.getMonth()+1, oNewDate.getDate());
	},
	
	_today : function(){
		this._setDate(this.oToday.nYear, this.oToday.nMonth, this.oToday.nDate);
	},
	/* 지정한 날짜를 저장한다 */
	_setDate : function(nYear, nMonth, nDate){
		this._nYear = nYear;
		this._nMonth =nMonth;
		this._nDate = nDate;
		this._draw();
	},
		
	_draw : function(){
		$Element(this._elParentNode).empty();	
		this._aData.length=0;
		var _oDate = new Date(this._nYear, this._nMonth-1, 1);
		var _nFirstDay = this._getFirstDay(this._nYear, this._nMonth);
		var _nLastDate = this._getLastDate(this._nYear, this._nMonth);	
		
		/* 시작 날짜 정하기(지난날 고려) */
		_oDate.setDate(1+(this._getFirstDay(this._nYear, this._nMonth)*-1));
		this._welYearMonthTitle.text(this._nYear+"/"+this._nMonth);
		
		var nLen = this._getWeekLines(_nFirstDay, _nLastDate);
		for(var i=0; i < nLen ; i++){
			var _elNewCloneWeek = this._elCloneTemplete.cloneNode(true);
			this._elParentNode.appendChild(_elNewCloneWeek);
			var _elDates = $$('.date', _elNewCloneWeek);
			
			for(var j = 0 ; j < 7 ; j++){
				var nDate = _oDate.getDate();
				var nDay = _oDate.getDay();
				var nYear = _oDate.getFullYear();
				var nMonth = _oDate.getMonth()+1;
				var _welDate = $Element(_elDates[j]);
				var _tempDate ={
						nDate: nDate,
						nYear : nYear,
						nMonth : nMonth,
						welDate : _welDate
				};
				_welDate.text(_oDate.getDate());
				this._aData.push(_tempDate);
				this._setClassName(_welDate,nYear, nMonth, nDate, nDay);
				_oDate.setDate(nDate+1);
			}
		}
	},
	/* 클래스 네임을 지정한다 */
	_setClassName : function(_elDate, nYear, nMonth, nDate, nDay){
		if(nMonth < this._nMonth){
			_elDate.addClass("prev-mon");
		}
		if(nMonth > this._nMonth){
			_elDate.addClass("next-mon");
		}
		if(nDate === this.oToday.nDate && nMonth === this.oToday.nMonth && nYear === this.oToday.nYear ){
			_elDate.addClass("today");
		}
		if(nDay == 0){
			_elDate.addClass("sun");
		}else if(nDay == 6){
			_elDate.addClass("sat");
		}
		
	},
	
	_getFirstDay : function(nYear, nMonth){
		 return new Date(nYear, nMonth - 1, 1).getDay();  /* 첫째 요일 . 0일 1월 */
	},
	
	_getLastDate : function(nYear, nMonth){
		return new Date(nYear, nMonth, 0).getDate();  /* 마지막 날짜*/
	},
	
	_getWeekLines : function(nFirstDay, nLastDay){
		return Math.ceil( (nFirstDay + nLastDay) / 7);
	},
	
}).extend(jindo.Component);
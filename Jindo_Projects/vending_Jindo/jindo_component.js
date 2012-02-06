/**
 * Jindo Component
 * @version 1.0.2
 * NHN_Library:Jindo_Component-1.0.2;JavaScript Components for Jindo;
 */


jindo.Component=jindo.$Class({_htEventHandler:null,_htOption:null,$init:function(){var aInstance=this.constructor.getInstance();aInstance.push(this);this._htEventHandler={};this._htOption={};this._htOption._htSetter={};},option:function(sName,vValue){switch(typeof sName){case"undefined":return this._htOption;case"string":if(typeof vValue!="undefined"){if(sName=="htCustomEventHandler"){if(typeof this._htOption[sName]=="undefined"){this.attach(vValue);}else{return this;}}
this._htOption[sName]=vValue;if(typeof this._htOption._htSetter[sName]=="function"){this._htOption._htSetter[sName](vValue);}}else{return this._htOption[sName];}
break;case"object":for(var sKey in sName){if(sKey=="htCustomEventHandler"){if(typeof this._htOption[sKey]=="undefined"){this.attach(sName[sKey]);}else{continue;}}
this._htOption[sKey]=sName[sKey];if(typeof this._htOption._htSetter[sKey]=="function"){this._htOption._htSetter[sKey](sName[sKey]);}}
break;}
return this;},optionSetter:function(sName,fSetter){switch(typeof sName){case"undefined":return this._htOption._htSetter;case"string":if(typeof fSetter!="undefined"){this._htOption._htSetter[sName]=jindo.$Fn(fSetter,this).bind();}else{return this._htOption._htSetter[sName];}
break;case"object":for(var sKey in sName){this._htOption._htSetter[sKey]=jindo.$Fn(sName[sKey],this).bind();}
break;}
return this;},fireEvent:function(sEvent,oEvent){oEvent=oEvent||{};var fInlineHandler=this['on'+sEvent],aHandlerList=this._htEventHandler[sEvent]||[],bHasInlineHandler=typeof fInlineHandler=="function",bHasHandlerList=aHandlerList.length>0;if(!bHasInlineHandler&&!bHasHandlerList){return true;}
aHandlerList=aHandlerList.concat();oEvent.sType=sEvent;if(typeof oEvent._aExtend=='undefined'){oEvent._aExtend=[];oEvent.stop=function(){if(oEvent._aExtend.length>0){oEvent._aExtend[oEvent._aExtend.length-1].bCanceled=true;}};}
oEvent._aExtend.push({sType:sEvent,bCanceled:false});var aArg=[oEvent],i,nLen;for(i=2,nLen=arguments.length;i<nLen;i++){aArg.push(arguments[i]);}
if(bHasInlineHandler){fInlineHandler.apply(this,aArg);}
if(bHasHandlerList){var fHandler;for(i=0,fHandler;(fHandler=aHandlerList[i]);i++){fHandler.apply(this,aArg);}}
return!oEvent._aExtend.pop().bCanceled;},attach:function(sEvent,fHandlerToAttach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.attach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(typeof aHandler=='undefined'){aHandler=this._htEventHandler[sEvent]=[];}
aHandler.push(fHandlerToAttach);return this;},detach:function(sEvent,fHandlerToDetach){if(arguments.length==1){jindo.$H(arguments[0]).forEach(jindo.$Fn(function(fHandler,sEvent){this.detach(sEvent,fHandler);},this).bind());return this;}
var aHandler=this._htEventHandler[sEvent];if(aHandler){for(var i=0,fHandler;(fHandler=aHandler[i]);i++){if(fHandler===fHandlerToDetach){aHandler=aHandler.splice(i,1);break;}}}
return this;},detachAll:function(sEvent){var aHandler=this._htEventHandler;if(arguments.length){if(typeof aHandler[sEvent]=='undefined'){return this;}
delete aHandler[sEvent];return this;}
for(var o in aHandler){delete aHandler[o];}
return this;}});jindo.Component.factory=function(aObject,htOption){var aReturn=[],oInstance;if(typeof htOption=="undefined"){htOption={};}
for(var i=0,el;(el=aObject[i]);i++){oInstance=new this(el,htOption);aReturn[aReturn.length]=oInstance;}
return aReturn;};jindo.Component.getInstance=function(){if(typeof this._aInstance=="undefined"){this._aInstance=[];}
return this._aInstance;};
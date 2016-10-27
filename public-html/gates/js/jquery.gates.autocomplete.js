/**
 * 
 */


/**
 * $('#myTextField').gatesAutocomplete({
 *   source: 'url',
 *   formatItem: function(item) {
 *     return item.id + ': ' + item.description;
 *   },
 *   formatResult: function(item) {
 *     return item.description;
 *   },
 *   select: function(item) {
 *     $('#myHiddenField).val(item.id);
 *   }
 * });
 */

if (typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  };
}

var thisId=""; // to be used when predictive is triggered from grid e.g. $('#'+thisId).val("value to be displayed");

(function( $ ){
	var requestIndex = 0;
	
	var methods = {
		init: function() {
		
		}
	};


	$.fn.gatesAutocomplete = function(optionsParameter) {
		var defaults = {
			source: null,
			extraParams: null,
			timeout: 10000,
			name:null,		//name of the associated field to be displayed in error msg
			minLength: 2,
			mustMatch: false, //to clear the input field when no items in resultset
			formatItem: formatItem, // to format the items in resultset
			formatResult: formatResult,
			select: null,
			beforeTrigger:beforeTrigger,
			noMatchHandler:noMatchHandler, //Action to be taken if no match is found(e.g. alert/show prompt)
			showTimeOutErrorMessage:true,	// to configure time out error messages
			autoSelectFirst:false,		   // to select first element in the result set on tab out	
			autoSelectWhenSingle:false,	  // to auto select on tab out when resultset contains single item		
			onChange:onChange,           //to override change event of respective text boxes.
			autoSelectCriteria:autoSelectCriteria,
			autoSelectTextAfter:false,
			onBlur:onBlur,
			defaultValue:'',
			errorMessage:''
		};

		var options = $.extend({}, defaults, {}, optionsParameter);
		
		function formatResult(item) {
			return item.name;
		}

		function formatItem(item) {
			return item.name + " (id: " + item.id + ")";
		}

		function beforeTrigger() {
			return "";
		}
		
		function noMatchHandler() {
			return '';
		}
		
		function onChange() {
			return '';
		}
		
		function autoSelectCriteria(item) {
			return 'false';
		}
		
		function onBlur() {
			return '';
		}
		
		return this.each(function() {
			var dataToSelect="";
			var totalItemsFound=0;
			var isAutoSelected=false;
			var isTriggeredManually=false;
			var isInputChanged=false;
			var isBlank=false;
			var isAutocompleteTriggered=false;
			var valueInTextBox="";
			var isAutoSelectFunctionTriggered=false;
			var isSelectedFromMouse=false;
			var isMouseUp=true;
			var isResponseReceived=true;
			
			
			
			if($(this).val().trim()=='' && options.defaultValue.trim()!='') {
				$(this).val(options.defaultValue);
			}
			$(this).keypress(function(event) {
				isInputChanged=true;
				isAutocompleteTriggered=false;
				thisId=$(this).attr('id');
				thisId=thisId.replace(".", "\\.");
				if(event.which!=13) {
					dataToSelect="";
					totalItemsFound=0;
					isAutoSelected=false;
					setTimeout(function(){
						valueInTextBox=$('#'+thisId).val();
					},2);
				}
			});
			
			$(this).bind('paste',function(event) {
				thisId=$(this).attr('id');
				thisId=thisId.replace(".", "\\.");
				setTimeout(function(){
					isInputChanged=true;
					isAutocompleteTriggered=false;
					dataToSelect="";
					totalItemsFound=0;
					isAutoSelected=false;
					setTimeout(function(){
						valueInTextBox=$('#'+thisId).val();
					},2);
				},1);
				
			});
			
			$(this).keydown(function(event) {
				if(event.which==46 || event.which==8) {
					isInputChanged=true;
					isAutocompleteTriggered=false;
					dataToSelect="";
					totalItemsFound=0;
					isAutoSelected=false;
				}
				thisId=$(this).attr('id');
				thisId=thisId.replace(".", "\\.");
				if(event.which!=13) {
					setTimeout(function(){
						valueInTextBox=$('#'+thisId).val();
					},2);
				}
			});
			
			if(options.autoSelectFirst || options.autoSelectWhenSingle) {
				$(this).blur(function(event){
					var val=$(this).val();
					if(val.trim()=="") {
						isBlank=true;
					}
					else {
						isBlank=false;
					}
					if(!isAutocompleteTriggered && !isAutoSelected && !isBlank && isInputChanged && valueInTextBox==$('#'+thisId).val()) {
						isTriggeredManually=true;
						$(this).autocomplete('search', $(this).val());
					}
					else if(isInputChanged && document.hasFocus()){
						setTimeout(function(){
							
							if(!isAutoSelectFunctionTriggered && !isSelectedFromMouse) {
								setTimeout(function(){
									if(!isAutoSelectFunctionTriggered) {
										callAutoSelect();
									}
								},100);
							}
							else if(isMouseUp){ //Mouse in released state i.e. Mouse would be in up state all the time except when mouse is clicked and not yet released 
								setTimeout(function(){
									options.onChange();
									options.onBlur();
								},100);
							}
							
						},100);
					}
					else {
						setTimeout(function(){
							options.onBlur();
						},100);
					}
				});
				$('.ui-autocomplete').live('mousedown',function(){
					isSelectedFromMouse=true;
					isMouseUp=false;
				});
				$('.ui-autocomplete').live('mouseup',function(){
					isSelectedFromMouse=true;
					isMouseUp=true;
				});
			}
			else {
				$(this).blur(function(){
					setTimeout(function(){
						options.onBlur();
					},100);
				});
				
				$(this).change(function(){
					setTimeout(function(){
						options.onChange();
					},100);
				});
			}
			
			$(this).autocomplete({
				//source: options.source, //TODO: handle extraParams and set in URL
				source: function( request, response ) {
					options.beforeTrigger(),
					isAutoSelectFunctionTriggered=false;
					dataToSelect="";
					totalItemsFound=0;
					isAutocompleteTriggered=true;
					isSelectedFromMouse=false;
					isResponseReceived=false;
					var id=this.element.attr('id');
					if ( self.xhr ) {
						self.xhr.abort();
					}
					self.xhr = $.ajax({
						url: options.source,
						timeout: options.timeout,
						data: $.extend({}, request, {}, options.extraParams),
						dataType: "json",
						autocompleteRequest: ++requestIndex,
						success: function( data, status ) {
							//console.log('response received');
							isResponseReceived=true;
							if ( this.autocompleteRequest === requestIndex ) {
								if(data.length==0 && options.noMatchHandler()!='') {
									options.noMatchHandler();
								}
								if(data.length>0 && (options.autoSelectFirst || options.autoSelectWhenSingle)) {
									if(options.autoSelectCriteria(data[0])==true || options.autoSelectCriteria(data[0])==false || options.autoSelectCriteria(data[0])==undefined) {
										for(var index=0;index<data.length;index++) {
											if(options.autoSelectCriteria(data[index])) {
												dataToSelect=data[index];
												break;
											}
										}
									}
									else {
										dataToSelect=data[0];
									}
								}
								else {
									dataToSelect="";
								}
								totalItemsFound=data.length;
								
								response( data );
								if(isTriggeredManually) {
									//setTimeout(function(){
										if(!isAutoSelectFunctionTriggered) {
											autoSelectFunction();
											options.onChange();
											options.onBlur();
										}
									//},50);
									
								}
							}
						},
						error: function(jqXHR, textStatus, errorThrown) {
							isResponseReceived=true;
							if ( this.autocompleteRequest === requestIndex ) {
								var messageText="";
								if(options.name!=null) {
									messageText="Retry! "+ options.name+ " Timeout";
								}
								else{
										messageText="Retry! "+id;
								}
								
								if(textStatus=="error"){
									if(options.showTimeOutErrorMessage) {
										messageText=messageText+" Could not retrieve records.";
										if(options.errorMessage!='') {
											messageText=options.errorMessage;
										}
										$.achtung({
							                className: 'achtungFail',
							                timeout: 3000,
							                message: messageText
							            });
									}
								}
								else if(textStatus == "timeout") {
									if(options.showTimeOutErrorMessage) {
										messageText=messageText+" Timeout";
										$.achtung({
							                className: 'achtungFail',
							                timeout: 3000,
							                message: messageText
							            });
									}
								}
								 
	
								
								dataToSelect="";
								totalItemsFound=0;
								response( [] );
							}
						}
					});
				},
				minLength: options.minLength,
				focus: function( event, ui ) {
				    //D024822: Change of focus selects first entry in org pick list
					$(this).val( options.formatResult(ui.item) );
					return false;
				},
				change: function(event, ui) {
					
					if (options.mustMatch && !ui.item) {
						var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
						var valid = false;
						var $autocomplete = $(this);
						
						// -----------------------------------
						
						var matchHandler = function() {
							var autocomplete = $( this ).data( "autocomplete" );
							
							//- $(autocomplete.menu.element)[0].innerText
							if (autocomplete.xhr) {
							var items = $.parseJSON(autocomplete.xhr.responseText);
							if(items.length==1)
							{
								options.select(items[0]);
							}
							else
								{
									for (var i=0; i<items.length; i++) {
										var text = formatResult(items[i]);
										if (text.match(matcher)) {
											valid = true;
											//- $autocomplete.val(text);
											options.select(items[i]);
											
											break;
										}
									}
								}
							}
							
							$( ".ui-autocomplete-input" ).die( "autocompleteopen", arguments.callee);
							$autocomplete.autocomplete('close');
						}
						
						 $( ".ui-autocomplete-input" ).live( "autocompleteopen", matchHandler);

							$(this).autocomplete('search', $(this).val());
						// -----------------------------------

						 
						if (!valid) {
							$(this).val('');
							return false;
						}
					}
					else if (!ui.item && document.hasFocus()) {
						if(!isAutoSelectFunctionTriggered) {
							callAutoSelect();
						}
					}

				},
				select: function( event, ui ) {
					console.log('triggering select');
					isAutoSelected=true;
					dataToSelect="";
					isAutoSelectFunctionTriggered=true;
					totalItemsFound=0;
					options.select(ui.item);
					$(this).val(options.formatResult(ui.item) );
					if (options.autoSelectTextAfter === true) $(this).select();
					return false;
				}
			})
			.data( "autocomplete" )._renderItem = function( ul, item ) {
				if(options.extraParams != null)
					var renderedOption = options.formatResult(item);
				else
					var renderedOption = options.formatItem(item);

				renderedOption = renderedOption.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + 
					$.ui.autocomplete.escapeRegex(this.term) + 
					")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");

				var even = (ul.children().size()%2) == 0;
				var listItem= $( "<li></li>" )
					.data( "item.autocomplete", item )
					.append( "<a class=\"" + (even?'ac_even':'ac_odd') + "\">" + renderedOption + "</a>" )
					.appendTo( ul );
				
				return listItem;
			};
			
			function callAutoSelect() {
				//console.log('triggered callAutoSelect()');
				if(isResponseReceived && !isAutoSelectFunctionTriggered) {
					//console.log('triggering autoselect');
					autoSelectFunction();
					options.onChange();
					options.onBlur();
				}
				else {
					//console.log('before timeout');
					setTimeout(function(){
						//console.log('after timeout');
						if(!isAutoSelectFunctionTriggered) {
							callAutoSelect();
						}
					},100);
				}
			}
			
			function autoSelectFunction() {
				//console.log('triggered autoselect');
				isAutoSelectFunctionTriggered=true;
				if(valueInTextBox==$('#'+thisId).val()) {
					if(options.autoSelectFirst) {
						if(options.mustMatch) {
							if(dataToSelect!="" && dataToSelect!=null && dataToSelect!=undefined) {
								var formattedResult=options.formatResult(dataToSelect);
								$('#'+thisId).val(formattedResult);
								options.select(dataToSelect);
								$('#'+thisId).val(formattedResult);
								isAutoSelected=true;
							}
							else {
								$('#'+thisId).val(options.defaultValue);
								dataToSelect="";
								totalItemsFound=0;
								isAutoSelected=false;
							}
						}
						else {
							if(dataToSelect!="" && dataToSelect!=null && dataToSelect!=undefined) {
								var formattedResult=options.formatResult(dataToSelect);
								$('#'+thisId).val(formattedResult);
								options.select(dataToSelect);
								$('#'+thisId).val(formattedResult);
								dataToSelect="";
								totalItemsFound=0;
								isAutoSelected=true;
							}
						}
						$('.ui-autocomplete').hide();
					}
					else if(options.autoSelectWhenSingle && totalItemsFound==1) {
							if(options.mustMatch) {
								if(dataToSelect!="" && dataToSelect!=null && dataToSelect!=undefined) {
									var formattedResult=options.formatResult(dataToSelect);
									$('#'+thisId).val(formattedResult);
									options.select(dataToSelect);
									$('#'+thisId).val(formattedResult);
									dataToSelect="";
									totalItemsFound=0;
									isAutoSelected=true;
								}
								else {
									$('#'+thisId).val(options.defaultValue);
									dataToSelect="";
									totalItemsFound=0;
									isAutoSelected=false;
								}
							}
							else {
								if(dataToSelect!="" && dataToSelect!=null && dataToSelect!=undefined) {
									var formattedResult=options.formatResult(dataToSelect);
									$('#'+thisId).val(formattedResult);
									options.select(dataToSelect);
									$('#'+thisId).val(formattedResult);
									dataToSelect="";
									totalItemsFound=0;
									isAutoSelected=true;
								}
							}
							$('.ui-autocomplete').hide();
						}
					else {
						if(options.mustMatch) {
							$('#'+thisId).val(options.defaultValue);
							dataToSelect="";
							totalItemsFound=0;
							isAutoSelected=false;
						}
						$('.ui-autocomplete').hide();
					}
				}
				else {
					dataToSelect="";
					totalItemsFound=0;
					isAutoSelected=false;
				}
				isTriggeredManually=false;
				isInputChanged=false;
				isAutocompleteTriggered=false;
			}
			
		});
		
		

	};
})( jQuery );





function autoComplete(id,method,search,contextPath){

	var url = contextPath+'/cas/autocomplete.do?method='+method+'&searchType='+search;
	$( "#"+id ).autocomplete({
		source: url,
		minLength: 2,
		//mustMatch: true,
		focus: function( event, ui ) {
			$( "#"+id ).val( ui.item.name );
			return false;
		},
		select: function( event, ui ) {
			$( "#"+id ).val( ui.item.name);
			return false;
		}	
	})
	.data( "autocomplete" )._renderItem = function( ul, item ) {
		var renderedOption = item.name + " (id: " + item.id + ")";
		
		renderedOption = renderedOption.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + 
		$.ui.autocomplete.escapeRegex(this.term) + 
		")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
		
		var even = (ul.children().size()%2) == 0;
		var listItem= $( "<li></li>" )
		.data( "item.autocomplete", item )
		.append( "<a class=\"" + (even?'ac_even':'ac_odd') + "\">" + renderedOption + "</a>" )
		.appendTo( ul );
		
		return listItem;
	};

}

function prediAddressSearch(id,method,search,contextPath){

	var url = contextPath+'/cas/predAddressSearch.do?method='+method+'&searchType='+search;
	
	$( "#"+id ).autocomplete({
		source: url,
		minLength: 2,
		focus: function( event, ui ) {
		$( "#"+id ).val( ui.item.name );
		return false;
		},
		select: function( event, ui ) {
			$( "#"+id ).val( ui.item.name );
			return false;
			}
	})
	.data( "autocomplete" )._renderItem = function( ul, item ) {
		var renderedOption = item.name + " (id: " + item.id + ")";
		
		renderedOption = renderedOption.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + 
		$.ui.autocomplete.escapeRegex(this.term) + 
		")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
		
		var even = (ul.children().size()%2) == 0;
		var listItem= $( "<li></li>" )
		.data( "item.autocomplete", item )
		.append( "<a class=\"" + (even?'ac_even':'ac_odd') + "\">" + renderedOption + "</a>" )
		.appendTo( ul );
		
		return listItem;
	};

}

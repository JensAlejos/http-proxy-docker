/**
 *  Javascript File for Customer and Some function of One time customer section
 *  Other files to be referred for quote screen are 
 *  quote.js
 *  quote_routing.js
 *  quote_notify.js
 *  add_one_time_customer.js  
 */
var quoteFromSelection = '';
var quoteVersSelection = '';

$(function() {
	var quoteIdFromPred = '';
	$('#quoteNumber').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: 'Quote Number',
		autoSelectFirst:true,
	 	extraParams: {
		 		 method: 'searchQtNo',
		 		 searchType: '294'
	 	},
	 	minLength: 7,
		formatItem : function(data) {
			return data.qtNo ;
		},
		formatResult : function(data) {
			return data.qtNo ;
		},
		select : function(data) {
			quoteIdFromPred = data.qtId;
			$('#quoteVersionNumber').removeAttr("disabled");
			$('#quoteVersionNumber').focus();
			if(autoSelect){
				document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
			}
			$('#quoteNumber').change();
		}
	});
	
	/*$('#quoteNumber').blur(function(){
		
	});*/
	
	

	if($('#quoteNumber').val()!=''){
		$('#quoteVersionNumber').removeAttr("disabled");
		$('#quoteVersionNumber').gatesAutocomplete({
			source:_context+'/cas/autocomplete.do',
			name: 'Version Number',
			autoSelectFirst:true,
		 	extraParams: {
			 		 method: 'searchQtVerNo',
			 		 searchType: '295',
			 		 parentSearch:  function() { return $('#quoteNumber').val(); }
		 	},
			formatItem : function(data) {
				return data.verNo ;
			},
			formatResult : function(data) {
				return data.verNo ;
			},
			select : function(data) {
				quoteIdFromPred = data.qtId;
				//if(autoSelect)
				{
					document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
				}
			}
			
		});
	}else{
		$('#quoteVersionNumber').val('');
		$('#quoteVersionNumber').attr("disabled",true);
	}
	$('#quoteNumber').focusin(function(){
		autoSelect = false;
	});
	$('#quoteVersionNumber').focusin(function(){
		autoSelect = false;
	});

	$('#quoteNumber').keydown(function(evt) {
		//callOnBlur();
		
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  var isQuoteChanged = $("#isQuoteChanged").val();
		  if(key == '13' || key == '9'){
			  if((!_isCommodityChanged  &&  !_isCommodityRatingAttributeChanged  && !_isQuoteClauseChanged  && !_isRatingAttributeChanged  && !_isChargeAttributeChanged )){
				  if($('#quoteNumber').val()!='' && 
						  $('#quoteVersionNumber').val()!='' 
							  && quoteIdFromPred != ''){
					  document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
					  callOnBlur();
					  $('#QuoteFromSelection').val($('#quoteNumber').val());
				  }else{
					  if($('#quoteNumber').val()!='' && checkQuote()){
						  $('#quoteVersionNumber').removeAttr("disabled");
						  loadQuote($('#quoteNumber').val());
						  $('#QuoteFromSelection').val($('#quoteNumber').val());
						  callOnBlur();
					  }else {
						  blockUI();
							$.ajax({
								type: "GET",
								url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
								//data: queryString,
								success: function(responseText){
									document.location.href = _context + '/quote/showNewForm?error=y';
									$.unblockUI();
									$("#isQuoteNumberChanged").val("false");
								}
							});
							scrollWin();
							_isCommodityChanged  = false;
							_isCommodityRatingAttributeChanged = false ;
							_isQuoteClauseChanged = false ;
							isQuoteChanged = false;
							_isRatingAttributeChanged  = false ;
							_isChargeAttributeChanged = false ;
							return;
					  } 
				  }
			  
			  }else{
				  //Change on the Quote.. Quote needs to update
				  //1. Dialogue Box "There are unsaved Changes. Would you like to discard changes or not"
				  //2. If Discard load new  Quote else Load Old Quote
				  var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
				  if(isConfirm){
					  if($('#quoteNumber').val()!='' && checkQuote()){
						  $('#quoteVersionNumber').removeAttr("disabled");
						  $("#isQuoteChanged").val("false");
						  $("#isQuoteNumberChanged").val("false");
						  loadQuote($('#quoteNumber').val());
						  callOnBlur();
						  $('#QuoteFromSelection').val($('#quoteNumber').val());
			
					  }else {
						  blockUI();
							$.ajax({
								type: "GET",
								url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
								//data: queryString,
								success: function(responseText){
									document.location.href = _context + '/quote/showNewForm?error=y';
									$.unblockUI();
								}
							});
							scrollWin();
							$("#isQuoteNumberChanged").val("false");
							$("#isQuoteChanged").val("false");
							return;
					  } 
				  
				  }else{
					  if($('#QuoteFromSelection').val() != ''){
						  $('#quoteNumber').val($('#QuoteFromSelection').val());
					  }
					  /*
					  if($('#quoteNumber').val()!='' && 
							  $('#quoteVersionNumber').val()!='' 
								  && quoteIdFromPred != ''){
						  document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
						  callOnBlur();
					  }else{
						  if($('#quoteNumber').val()!='' && checkQuote()){
							  $('#quoteVersionNumber').removeAttr("disabled");
							  loadQuote($('#quoteNumber').val());
							  callOnBlur();
						  }else {
							  blockUI();
								$.ajax({
									type: "GET",
									url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
									//data: queryString,
									success: function(responseText){
										showResponseMessages(responseText.messages);
										$.unblockUI();
									}
								});
								scrollWin();
								return;
						  } 
					  }
				  */}
			  }
		  }
	});
	
	$('#quoteVersionNumber').keydown(function(evt) { 
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  var isQuoteChanged = $("#isQuoteChanged").val();
		
		  if(key == '13' || key == '9'){
			  if((!_isCommodityChanged  &&  !_isCommodityRatingAttributeChanged  && !_isQuoteClauseChanged  && !_isRatingAttributeChanged  && !_isChargeAttributeChanged )){
				  if($('#quoteVersionNumber').val()!='' 
					  && quoteIdFromPred != ''){
					  document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
					  quoteVersSelection = $('#quoteVersionNumber').val();
				  }else{
				  	  //D025273: Maintain quote - tried to reload page by hitting enter got error enter valid version
					  loadQuote($('#quoteNumber').val());
				  }
			  }else{
				  var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
				  if(isConfirm){
					  if($('#quoteVersionNumber').val()!='' 
						  && quoteIdFromPred != ''){
						  document.location.href=_context+'/quote/getQuote?quoteId='+quoteIdFromPred;
						  $("#isQuoteNumberChanged").val("false");
							$("#isQuoteChanged").val("false");
							quoteVersSelection = $('#quoteVersionNumber').val();
					  }else{
					  	  //D025273: Maintain quote - tried to reload page by hitting enter got error enter valid version
						  loadQuote($('#quoteNumber').val());
					  }
				  }else{
					  $('#quoteVersionNumber').val(quoteVersSelection);
				  }
			  }
		  }
	});
	
	
	//Changed from focusout to change for Defect 028744
	$('#quoteNumber').change(function() {
		var quoteNo = $('#quoteNumber').val();
		if(quoteNo.length > 1){
			if(!checkQuote()){
				var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
				if(quoteString == newQuoteString){
			         $.ajax({
							type: "GET",
							url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
							//data: queryString,
							success: function(responseText){
								document.location.href = _context + '/quote/showNewForm?error=y';
								$.unblockUI();
								$("#isQuoteNumberChanged").val("false");
							}
					});
					scrollWin();
					_isCommodityChanged  = false;
					_isCommodityRatingAttributeChanged = false ;
					_isQuoteClauseChanged = false ;
					isQuoteChanged = false;
					_isRatingAttributeChanged  = false ;
					_isChargeAttributeChanged = false ;
					return;
					$.unblockUI();
				}
			}
		}
		else if(quoteNo == ''){
			 document.location.href = _context + '/quote/showNewForm';
			 $("#isQuoteNumberChanged").val("false");
			 $("#isQuoteChanged").val("false");
		     $.unblockUI();
		}

	});
	
	
	function checkQuote(){
		var flag = true;
		//Commented for Defect 028744
		//blockUI();
		var quoteNo = $('#quoteNumber').val();
		$.ajax({
			type: "GET",
			async: false,
			url: _context + "/quote/findIfQuoteExists?quoteNumber=" + quoteNo ,
			success: function(responseText){
				   if(responseText.data == ""){
					   flag = false;
					   $.unblockUI();
				   } 
				   else{
					   document.location.href=_context+'/quote/getQuote?quoteId='+responseText.data;
				   }
				}
			});
			return flag;
	}

	});

/********** Supporting functions **********/
var autoSelect = false;
function loadQuote(qtNo){
	var quoteId;
	var queryString = $('#quoteForm').formSerialize();
	$.ajax({
		   type: "POST",
		   data: queryString,
		   url: _context + "/quote/fetchQuoteToDisplay?quoteNumber =" + qtNo ,
		   success: function(responseText){
			   if(responseText.success){
				   quoteId = responseText.data;	
				   document.location.href=_context+'/quote/getQuote?quoteId=' + quoteId;
			   } else {
				   blockUI();
				   autoSelect = true;
				   $("#quoteSave").focus();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
						//data: queryString,
						success: function(responseText){
							//showResponseMessages(responseText.messages);
							window.setTimeout(function () {
							   showResponseMessages(responseText.messages)
							}, 2000);
							$.unblockUI();
						}
					});
					scrollWin();
					return;
			   }
		   }
	});
}

function callOnBlur(){
	if($('#quoteNumber').val()!=''  ){
		$('#quoteVersionNumber').removeAttr("disabled");
		$('#quoteVersionNumber').gatesAutocomplete({
			source:_context+'/cas/autocomplete.do',
			name: 'Version Number',
			autoSelectFirst:true,
		 	extraParams: {
			 		 method: 'searchQtVerNo',
			 		 searchType: '295',
			 		 parentSearch:  function() { return $('#quoteNumber').val(); }
		 	},
			formatItem : function(data) {
				return data.verNo ;
			},
			formatResult : function(data) {
				return data.verNo ;
			},
			select : function(data) {
				quoteIdFromPred = data.qtId;
			}
		});
	}else{
		$('#quoteVersionNumber').val('');
		$('#quoteVersionNumber').attr("disabled",true);
	}
}
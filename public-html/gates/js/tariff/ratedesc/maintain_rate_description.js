var somethingChanged = false;
var isInputChange="";
var wholeFlag = false;
var isDateChanged =false;
var dataName=null;
var _pageMode = 'Add';
$(function() {
	$( "#alert_success" ).dialog({
		resizable: false,
		autoOpen: false,
		height:'auto',
		width:500,
		modal: true,
		buttons: {
			"OK": function() {
				$( this ).dialog( "close" );
				$( "#blockUIDIV" ).parent().show();
				$( "#blockUIDIV" ).show();
				var split=$("#secondaryAmount").val().split(",");
			    var finalAmount="";
				for(var index=0;index<split.length;index++) {
					finalAmount=finalAmount+split[index];
				}
				$("#secondaryAmount").val(finalAmount);
				var secAmt= $("#secondaryAmount").val();
				var index=  secAmt.indexOf('.');
				 if(index!=-1){
					 $.unblockUI();
						$('#secondaryAmount').validationEngine('showPrompt', 'Must be an Integer', 'error', 'topRight', true);
						return false;
					}
				somethingChanged=false;
				$("#rateDescForm").attr("action","createOrUpdateRateDescription");
				$("#rateDescForm").submit();
			},
			"Cancel":function() {
				$( this ).dialog( "close" );
				$.unblockUI();
				   return;
			}
		}
	});
	//Added for Defect D023587
	if(!_newdisplay)
		$('#newButton').css('visibility','hidden');
	tabSequence('#rateDescForm');
	$('#customerRateGrid').trigger("reloadGrid");
	$('#frtPayRateGrid').trigger("reloadGrid");
	if($('#secondaryAmount').val()=="0"){
		 $('#secondaryAmount').val("");
	 }
	 var secAmnt=$('#secondaryAmount').val();
	 $('#secondaryAmount').val(trim(secAmnt));
	 if($('#secondaryAmount').val()!=null && $('#secondaryAmount').val()!='')
	 {
		 var values = $('#secondaryAmount').val().split(",");
	 	$("#secondaryAmount").val($("#secondaryAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 
	 }
	 if($('#secondaryAmount').val() == "" )
	 {
	  var element = document.getElementById('secondaryAmountTypeCode');
	  if(element.value=='.'){
		    element.value = '.';
		   }
	  
	 }
	if(_displayonly || _displayonly==true || _displayonly=="true"){
		$('#rateReplicate').attr("disabled","disabled");
		$('#rateXCopy').attr("disabled","disabled");
	}
	
	if($('#grpType').val() =="03" || $('#grpType').val()=="07"  ){
		$('#legacyRate1').removeAttr("disabled");
	}else{
		$('#legacyRate1').attr("disabled","disabled");
	}
	 /*if($('#isWholeDollarflag').val()=='true' || $('#isWholeDollarflag').val()==true || $('#isWholeDollarflag').val()=='false'||$('#isWholeDollarflag').val()==false)
	 {
	      somethingChanged = true;
	 }*/
	//Whole Dollar click
	$("#roundToNearestDollar1").click(function() {
		if($('#roundToNearestDollar1').attr('checked')){
			wholeFlag = true;
		}else{
			wholeFlag = false;
		}
	});
	
	if(_readonlyRateModify){
	$('#rateMainDiv').gatesDisable();
	}
	// updated for defect# D026765
	$('input').not("#isCurrentFutureFrt, #isCurrentFutureCust").change(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	});
	$('textarea').change(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	});
/*	$('img').click(function() {
		somethingChanged = true;
	});*/
	$('select').change(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	});
	 $('table').click(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					
				 }
		    }
	});
/*	 $('#sData').click(function() {
		  somethingChanged=true;
	  });*/
	 
	 var oldSecondaryAmount= $('#secondaryAmount').val();
	 $('#secondaryAmount').blur(function() {
			 if($('#secondaryAmount').val()=="0"){
				 $('#secondaryAmount').val("");
			 }
			 if($('#secondaryAmount').val().trim() == "")
				 {
				 var element = document.getElementById('secondaryAmountTypeCode');
					    element.value = '.';
				 }
			 var secAmnt=$('#secondaryAmount').val();
			 $('#secondaryAmount').val(trim(secAmnt));
				 var values = $('#secondaryAmount').val().split(",");
			 	$("#secondaryAmount").val($("#secondaryAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
			 	$("#secondaryAmount").val($("#secondaryAmount").val().replace(/[-?]*/g,''));
			 	
			 	var newSecondaryAmount= $('#secondaryAmount').val();
			 	if(oldSecondaryAmount!=newSecondaryAmount) {
			 		somethingChanged = true;
			 	}
		 });
	 var oldgeneralRateIncrExempt1= $('#generalRateIncrExempt1').val();
	 $('#generalRateIncrExempt1').blur(function() { 
		 var newgeneralRateIncrExempt1= $('#generalRateIncrExempt1').val();
		 if(oldgeneralRateIncrExempt1!=newgeneralRateIncrExempt1) {
			 somethingChanged = true; 
			 }
	   });	 	 
		
	 var oldCityVal= $('#cityCode').val();
	 $('#cityCode').blur(function() { 
		 var newCityVal= $('#cityCode').val();
		 if(oldCityVal!=newCityVal) {
			 somethingChanged = true; 
			 }
	   });
	
	 $('input').live('keydown', function(event) {
		 if(!(event.keyCode>=37 && event.keyCode<=40) && event.keyCode!=9 && event.shiftKey!=true && event.ctrlKey!=true && event.altKey!=true) {
		 var el = $(this);
		 
		 setTimeout(function() {
			 var maxlength = $(el).attr('maxlength'); // get maxlength value
		     var inputlength = $(el).val().length; // get the length of the text
		     if ( inputlength >= maxlength ){ // if the text is equal of more than the max length
		    	 var nextElement=$(el).next('input[type="text"]');// set focus to the next text field
		    	// alert($(el).attr('id'));
		    	//if($($(el).attr('id') == 'planEquipLengthFeet') || $(el).attr('id') == 'planEquipHeightCode'){		    		 
		    	//} else {
		    		 $(nextElement).focus(function() {$(nextElement).select(); });
		    		 $(nextElement).focus();
		    	 //}
		     }
			}, 100);
		 }
		 
		});
	 
$('input').live('keyup', function(event) {
		 
		 if(!(event.keyCode>=37 && event.keyCode<=40) && event.keyCode!=9 && event.shiftKey!=true && event.ctrlKey!=true && event.altKey!=true) {
		 var el = $(this);
		 
		 setTimeout(function() {
			 var maxlength = $(el).attr('maxlength'); // get maxlength value
		     var inputlength = $(el).val().length; // get the length of the text
		     if ( inputlength >= maxlength ){ // if the text is equal of more than the max length
		    	 var nextElement=$(el).next('input[type="text"]');// set focus to the next text field
		    	 //alert($(el).attr('id'));
		    	 //if($($(el).attr('id') == 'planEquipLengthFeet') || $(el).attr('id') == 'planEquipHeightCode'){		    		 
		    	 //} else {
		    		 $(nextElement).focus(function() {$(nextElement).select(); });
		    		 $(nextElement).focus();
		    	 //}
		    	 
		     }
			}, 100);
		 }
		 
		});
	
	 
	var rateDescId = $('#rateDescId').val();
	if ((rateDescId == null) || (rateDescId == '')) {
		var _pageMode = 'Add';
	}
	else{
		_pageMode = 'Edit';
	}
	$("#rateDescForm").validationEngine('attach');
	$("#effectiveDate").datepicker({dateFormat : 'mm-dd-yy'});
	$("#expirationDate").datepicker({dateFormat : 'mm-dd-yy'});

	// Set Pref date & eff date value from Session Var or Current Date.
	var _prefDate = $('#prefDateSessionVar').val();

	var rateEffDate = $('#effectiveDate').val();
	var err = document.getElementById('errorMsgDiv');
	if (rateDescId == null || rateDescId == '') {
		if (_prefDate != null && _prefDate != '') {
			if (_pageMode == 'Add' && err == null) {
				$("#effectiveDate").datepicker('setDate', _prefDate);
			}
			$("#preferencedate").datepicker('setDate', _prefDate);
		} else {
			if (_pageMode == 'Add' && err == null) {
				$("#effectiveDate").datepicker('setDate', new Date());
			}
			$("#preferencedate").datepicker('setDate', new Date());
		}
	} else {
		$("#effectiveDate").datepicker('setDate', rateEffDate);
		$("#preferencedate").datepicker('setDate', _prefDate);
	}

	var effDate=$("#effectiveDate").val();
	if(effDate!=null && effDate!=""){
 		$.ajax({
 			url : _context+'/tm/traiffRate/onChangeEffectiveDate',
 			type : "POST",
 			data : {effectiveDate:$('#effectiveDate').val()},
 			success : function(responseText) {
	 				if (responseText.success == true) {
	 					$('#customerRateGrid').trigger("reloadGrid");
	 					return true;
	 				}
 				}
 		});
	}
	
	var grpPk =  $('#grpPk').val();


	$('#addFrtPayable').click(function() {
		if(_pageMode=="Add"){
			somethingChanged = false;
		}
		$.ajax({
				type : "GET",
				url : _context+ "/tm/frtPayable/validateIfValidServiceGroupForFrtRates?",
				data : "tariffRateDescriptionId="+ rateDescId,
				success : function(msg) {
					if (msg == "valid" && ! _displayonly) {
						document.location.href = _context+ '/tm/frtPayable/showForm?actionPerformed=showForm&tariffRateDescriptionId='+ rateDescId+'&addFreightPayableFlag='+"Add";
					} else if(msg != "valid") {
						return;	
					}
				}
			});
	});

	// Rate Description Save function- Button onclick function
	$('#rateSave').click(function() {
		var success=false;
		if ($("#rateDescForm").validationEngine('validate')) {
			 if($('#secondaryAmount').val() == "")
			 {
			  var element = document.getElementById('secondaryAmountTypeCode');
			  if(element.value=='.'){
			    element.value = '.';
			   }
			 }
			var isEquipmentValidationRequired=false;
			
			if ($("#rateDescId").val() == "") {// Add request
				//alert($('#planEquipHeightCode').val());
				if($('#planEquipHeightCode').val()=='&' || $('#planEquipFunctionCode').val()=='&') {//D033297
					if($('#planEquipHeightCode').val()=='&'){
						$("#planEquipHeightCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					} else {
						$("#planEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					}
					return false;
				}
				
				var equipLength = $('#planEquipLengthFeet').val();
				var charExists = (equipLength.indexOf('&') >= 0) ? true : false;
				
				if(charExists){
					$("#planEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					return false;
				}
				$('#planEquipFunctionCode').val($('#planEquipFunctionCode').val().toUpperCase());
				$('#planEquipHeightCode').val($('#planEquipHeightCode').val().toUpperCase());
				if($('#planEquipFunctionCode').val().trim().length!=0 || $('#planEquipLengthFeet').val().trim().length!=0) {
					$('#planEquipFunctionCode').val($('#planEquipFunctionCode').val().toUpperCase());
					$('#planEquipHeightCode').val($('#planEquipHeightCode').val().toUpperCase());
					if($('#planEquipFunctionCode').val().trim().length==0) {
						$("#planEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
						return false;
					}
					else if($('#planEquipLengthFeet').val().trim().length==0) {
						$("#planEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
						return false;
					}
					isEquipmentValidationRequired=true;
				}
				if(isEquipmentValidationRequired) {
					$.ajax({
						type : "GET",
						url : _context+ "/tm/traiffRate/isEquipmentValid?",
						data : "planEquipFunctionCode="+ $("#planEquipFunctionCode").val()+ "&planEquipLengthFeet="+ $("#planEquipLengthFeet").val()+ "&planEquipHeightCode="+ $("#planEquipHeightCode").val(),
						success : function(responseText) {
							var data = responseText.data;
							var isValid=true;
							if(data=='false'){
								$("#planEquipFunctionCode").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
								isValid=false;
							}
							else {
								var split=$("#secondaryAmount").val().split(",");
								var finalAmount="";
								for(var index=0;index<split.length;index++) {
									finalAmount=finalAmount+split[index];
								}
								$("#secondaryAmount").val(finalAmount);
								var secAmt= $("#secondaryAmount").val();
								var index=  secAmt.indexOf('.');
								
								 if(index>0)
									{
										$('#secondaryAmount').validationEngine('showPrompt', 'Must be an Integer', 'error', 'topRight', true);
										return false;
									}
								 somethingChanged = false;
								$("#rateDescForm").attr("action","createOrUpdateRateDescription");
								$("#rateDescForm").submit();
								
							} 
							
						}
					}); 
				}
				else {
					var split=$("#secondaryAmount").val().split(",");
					var finalAmount="";
					for(var index=0;index<split.length;index++) {
						finalAmount=finalAmount+split[index];
					}
					$("#secondaryAmount").val(finalAmount);
					var secAmt= $("#secondaryAmount").val();
					var index=  secAmt.indexOf('.');
					 if(index>0)
						{
							$('#secondaryAmount').validationEngine('showPrompt', 'Must be an Integer', 'error', 'topRight', true);
							return false;
						}
					 somethingChanged = false;
					$("#rateDescForm").attr("action","createOrUpdateRateDescription");
					$("#rateDescForm").submit();
					
				}
			} else {
				//alert($('#planEquipHeightCode').val());
				if($('#planEquipHeightCode').val()=='&' || $('#planEquipFunctionCode').val()=='&') {//D033297
					if($('#planEquipHeightCode').val()=='&'){
						$("#planEquipHeightCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					} else {
						$("#planEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					}
					return false;
				}
				
				var equipLength = $('#planEquipLengthFeet').val();
				var charExists = (equipLength.indexOf('&') >= 0) ? true : false;
				
				if(charExists){
					$("#planEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
					return false;
				}
				$('#planEquipFunctionCode').val($('#planEquipFunctionCode').val().toUpperCase());
				$('#planEquipHeightCode').val($('#planEquipHeightCode').val().toUpperCase());
			 if(custRateadded==true){
				 somethingChanged =true;
			 }
			 
			if (somethingChanged == true || somethingChanged=="true") {
				if($('#isWholeDollarflag').val()=='true' || $('#isWholeDollarflag').val()==true || $('#isWholeDollarflag').val()=='false'||$('#isWholeDollarflag').val()==false) {
					if($('#planEquipFunctionCode').val().trim().length!=0 || $('#planEquipLengthFeet').val().trim().length!=0) {
						
						if($('#planEquipFunctionCode').val().trim().length==0) {
							$("#planEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
							return false;
						}
						else if($('#planEquipLengthFeet').val().trim().length==0) {
							$("#planEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
							return false;
						}
						isEquipmentValidationRequired=true;
					}
				if(isEquipmentValidationRequired) {
					blockUI();
					$.ajax({
						type : "GET",
						url : _context+ "/tm/traiffRate/isEquipmentValid?",
						data : "planEquipFunctionCode="+ $("#planEquipFunctionCode").val()+ "&planEquipLengthFeet="+ $("#planEquipLengthFeet").val()+ "&planEquipHeightCode="+ $("#planEquipHeightCode").val(),
						success : function(responseText) {
							var data = responseText.data;
							var isValid=true;
							if(data=='false'){
								$("#planEquipFunctionCode").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
								isValid=false;
								$.unblockUI();
							}
							else {
								//alert( "rdPK="+ $("#rateDescId").val()+ "&effDate="+ $("#effectiveDate").val()+ "&expDate="+ $("#expirationDate").val());
								$.ajax({
									type : "POST",
									url : _context+ "/tm/traiffRate/validateRateDescUpdateReqForDepEntities?",
									data : "rdPK="+ $("#rateDescId").val()+ "&effDate="+ $("#effectiveDate").val()+ "&expDate="+ $("#expirationDate").val(),
									success : function(msg) {
										if (msg == "Success") {
											success=true;
										} 
										else if (msg.indexOf("Customer Charge")!=-1 || msg.indexOf("Payable Eff/Exp")!=-1 ||  msg.indexOf("Dependent conditions")!=-1){
//												/alert(msg);/
											//$( "#blockUIDIV" ).parent().hide();
									   		//$( "#blockUIDIV" ).hide();
											$.unblockUI();
											$('#alert_success').text(msg+" Do you want to continue?");
									   		$('#alert_success').dialog('open');
									   		
//									   		/success=true;/
										}
///										else  {
//											if(isDateChanged){
//												var r = confirm(msg+". Do you want to continue?");
//												if (r == true) {
//													success=true;
//												}
//												else{
//													$.unblockUI();
//												   return;
//												}
//											}
//											else{
//												success=true;
//													}
//												} 
										if(success==true || success=="true"){
											var split=$("#secondaryAmount").val().split(",");
										    var finalAmount="";
											for(var index=0;index<split.length;index++) {
												finalAmount=finalAmount+split[index];
											}
											$("#secondaryAmount").val(finalAmount);
											var secAmt= $("#secondaryAmount").val();
											var index=  secAmt.indexOf('.');
											 if(index!=-1){
												 $.unblockUI();
													$('#secondaryAmount').validationEngine('showPrompt', 'Must be an Integer', 'error', 'topRight', true);
													return false;
												}
											somethingChanged=false;
											$("#rateDescForm").attr("action","createOrUpdateRateDescription");
											$("#rateDescForm").submit();
										}
									}
										});
									} 
								}
							}); 
						}
					}
				} else {
					$("#secondaryAmount").val($("#secondaryAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
					alert("No fields have changed. Cannot update");
				}
			}
		} else {
			return false;
		}
	});

	// Button for Revenue Division LInkages
	$('#rateRevenueCondBtn').click(function() {
		var tariffgrpType = $('#grpType').val();
		var tariffgrpName = $('#grpName').val();
		var tariffsrc = $('#srcTariff').val();
		var tariffItem = $('#itemCode').val();
		var rateId = $('#rateDescId').val();
		// var tariffgrpType = "01"
		var tariffTogrpType = "04"
		submiturl = _context + "/cas//rateRevenueSearch.do?";
		submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&rateId=" + rateId+ "&groupToTypeCode=" + tariffTogrpType+ "&screenName=revenue";
		document.location.href = submiturl + submitdata;
	});

	$('#cancel').click(function() {
		var tariffgrpType = $('#grpType').val();
		var tariffgrpName = $('#grpName').val();
		var tariffsrc = $('#srcTariff').val();
		var tariffItem = $('#itemCode').val();
		var rateId = $('#rateDescId').val();
		var currentFuture = $('#isCurrentFuture').val();
		if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
			currentFuture='Y';
		}
		else{
			currentFuture='N';
		}
		if(custRateadded==true){
			 somethingChanged =true;
		 }
		if (somethingChanged) {
				var r = confirm("All the unsaved Changes will be discarded!");
				if (r == true) {
			 		$.ajax({
			 			url : _context+'/tm/traiffRate/onExit',
			 			type : "POST",
			 			data : {exit:true},
			 			success : function(responseText) {
				 				if (responseText.success == true) {
				 					document.location.href = _context+ '/cas/rateDesriptionSearch.do?currentFuture='+currentFuture+'&exitfrom='+'exit';
				 					return true;
				 				}
			 				}
			 		});
				}
			}
		else {
	 		$.ajax({
	 			url : _context+'/tm/traiffRate/onExit',
	 			type : "POST",
	 			data : {exit:true},
	 			success : function(responseText) {
		 				if (responseText.success == true) {
		 					document.location.href = _context+ '/cas/rateDesriptionSearch.do?currentFuture='+currentFuture+'&exitfrom='+'exit';

		 					return true;
		 				}
	 				}
	 		});
		}
	});

	// rateXCopy
	$('#rateXCopy').click(function() {
		
		if(custRateadded==true){
			 somethingChanged =true;
		 }
		
		if (somethingChanged) {
				var r = confirm("All the unsaved Changes will be discarded!");
				if (r == false) {
					return;
				}
		}
		
		
		
			var screenName = $('#screenName').val();
			var tariffRateDescriptionId = $('#rateDescId').val();
			var submiturl = "";
			var submitdata = "";
			var rateid = "";
			var currentFuture = $('#isCurrentFuture').val(); 
/*			if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
				currentFuture='Y';
			}
			else{
				currentFuture='N';
			}*/
			var cusRateIdsSel = jQuery("#customerRateGrid").getGridParam('selarrrow');
			var frtRateIdsSel = jQuery("#frtPayRateGrid").getGridParam('selarrrow');
			
			var cusRateIdsSelLen=0;
			var frtRateIdsSelLen=0;
			if (cusRateIdsSel!=undefined){
				cusRateIdsSelLen=cusRateIdsSel.length;
			}
			if (frtRateIdsSel!=undefined){
				frtRateIdsSelLen=frtRateIdsSel.length;
			}
			
			
			if ((cusRateIdsSelLen + frtRateIdsSelLen) > 1) {
				alert('Please select only one Customer Rate or Frt Pay Rate to copy');
				return;
			}
			if ((cusRateIdsSelLen + frtRateIdsSelLen) == 0) {
				alert('Please select at least one Customer Rate or Frt Pay Rate to copy');
				return;
			}
			if (cusRateIdsSelLen != 0) {// customer rate
				rateid = cusRateIdsSel;
				if(rateid!=null && rateid!="" && rateid!="null"){
				submiturl = _context+ "/copyCustomerRate/showForm?";
				submitdata = "tariffRateDescriptionId="+ tariffRateDescriptionId+ "&tariffRateAmountId=" + rateid+ "&screenName=" + screenName+"&currentFuture="+currentFuture;
				}
				else{
					alert('Please save the Customer rate before XCopying');
					return false;
				}
			} else if(frtRateIdsSelLen!=0){// frt rate
				submiturl = _context+ "/copyFrtPayableRate/showForm?";
				rateid = frtRateIdsSel;
				submitdata = "tariffRateDescriptionId="+ tariffRateDescriptionId+ "&frtPayableRateAmountId=" + rateid+ "&screenName=" + screenName+"&isCurrentFuture="+currentFuture;
			}
			document.location.href = submiturl + submitdata;
		});

	//code for condition button

	$('#rateCond').click(function() {
		
		if(custRateadded==true){
			 somethingChanged =true;
		 }
		
		if (somethingChanged) {
				var r = confirm("All the unsaved Changes will be discarded!");
				if (r == false) {
					return;
				}
		}
		
		
		
		
					var grpPk =  $('#grpPk').val();
					var tariffgrpType = $('#grpType').val();
					var tariffgrpName = $('#grpName').val();
					var tariffsrc = $('#srcTariff').val();
					var tariffItem = $('#itemCode').val();
					var tariffRateDescriptionId = $('#rateDescId').val();
					var equp = $('#planEquipFunctionCode').val()+" "+$('#planEquipLengthFeet').val()+" "+$('#planEquipHeightCode').val();
					//alert(document.rateDescForm.directionCode.value);
					var directionCode = $('#directionCodeHidden').val();
					var city = $('#cityCode').val();
					var description = $('#description').val();
					var cityCode =city.split(" ");
					var currentFuture = $('#isCurrentFuture').val(); 
					if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
						currentFuture='Y';
					}
					else{
						currentFuture='N';
					}
					var key="From"
						if(tariffgrpType!="01"){
							key="To"
						}
					var rateDescription= equp+"-"+directionCode+" "+cityCode[0]+"-"+description;
					submiturl = _context + "/cas/tariffConditionSearch.do?";
					submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode=" + tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem+"&rateDescription="+ encodeURIComponent(rateDescription)+"&from=_rate&tariffRateDescriptionId="+tariffRateDescriptionId+"&tariffGrpId="+grpPk+"&key="+key+"&currentFuture="+currentFuture;
					document.location.href = submiturl + submitdata;
				});
		
	/*$('#secondaryAmountTypeCode').change(
			function() {
				var label1 = "UOM";
				var label2 = "Secondary Amount:";
				var secAmntSel = document
						.getElementById('secondaryAmountTypeCode').value;
				// If Sec. Amount base is either Threshold or Min Qty.- change
				// label to UOM
				if (secAmntSel == 'D' || secAmntSel == 'M') {

					$('#lblSecAmount').text(label1);
				} else {
					$('#lblSecAmount').text(label2);
				}
			});*/
	// City Auto complete
	$('#cityCode').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		formatItem : function(city) {
		 	 document.getElementById('cityID').value=city.cityCode;
		 	 dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
			return dataName;
		},
		formatResult : function(city) {
		 	 dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
			return dataName;
		},
		select : function(city) {
			dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
			document.getElementById('cityID').value=city.cityCode;
			$('#cityCode').val(dataName);
		}
	});
	//Blurr the data for invalid group Id
	 $('#cityCode').change(function(){
		 var cityVal=$('#cityCode').val();
		 if(cityVal!='****') {
			 if(document.getElementById('cityID').value==null || document.getElementById('cityID').value=="" ){
					$('#cityCode').val("");
					//alert("Enter either be a valid City Code or the wildcard string, '****'");
		    	}
			else{
				$('#cityCode').val(dataName);
				$('#cityID').val("");
			}
		 }
	    }); 
	 
	$('#cityCode').gatesPopUpSearch({
		func : function() {
			cityPopupSearch()
		}
	});
	
	// Comment
	var args = {
		entityType : 'TRRD',
		entityId : $('#rateDescId').val(),
		commentId : "commentId"
	};

	$("#comment_link").comments(args);
	var args1 = {
		entityType : 'TRSV',
		entityId : $("#grpPk").val(),
		commentId : "groupCommentId",
		viewOnly : true,
		commentsFrame : 'grpCommentsFrame'
	};
	$("#grp_comment_link").comments(args1);
	var args2 = {
		entityType : 'TRSI',
		entityId : $("#itemPk").val(),
		commentId : "itemCommentId",
		viewOnly : true,
		commentsFrame : 'itmCommentsFrame'
	};
	$("#itm_comment_link").comments(args2);

	// History

	var historyArgs = {
		entityId : $('#rateDescId').val(),
		entity : 'com.matson.gates.tm.rate.domain.TariffRateDescription'
	};
	$("#history_link").history(historyArgs);

	if($('#disableCityData').val()=="true"){
		$('.disable').attr("disabled",true);
		$('#cityCode').attr("disabled",true);
		$('#cityCode').css({'background-color':'#C0C0C0'}); 
		$('#popupSearchcityCode').hide();
		
	}
	else{
		$('.disable').attr("disabled",false);
		$('#cityCode').attr("disabled",false);
	}
	
//New Button Functionality	
	$('#newButton').click(function(){
		var grpType =  $('#grpType').val();
	    var grpCode = document.getElementById('grpName').value;
	    var sourceCode = document.getElementById('srcTariff').value;
	    var itemCode=document.getElementById('itemCode').value;				
		var grpPk =  $('#grpPk').val();
		var itemPk = $('#itemPk').val();
		var temp = new Array();
		var msg= grpPk+","+itemPk;
		var currentFuture = $('#isCurrentFuture').val(); 
		//alert('grpPk-'+grpPk+'itemPk-'+itemPk);
		
		var rateDescId = "DUMMY-TGSI"+","+msg+","+grpType+","+grpCode+","+sourceCode+","+itemCode;
		if(custRateadded==true){
			 somethingChanged =true;
		 }
		if (somethingChanged) {
				var r = confirm("All the unsaved Changes will be discarded!");
				if (r == true) {
					document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ rateDescId+'&currentFuture='+currentFuture ;
				}
		}
		else{
			document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ rateDescId+'&currentFuture='+currentFuture ;
		}
		
    });
	//disable newButton
	var disableNewButton=$('#disableNewButton').val();
	var disableNext=$('#disableNextButton').val();
	//Disabling of Next Button	
	if(disableNext=='true'){
		 $('#itemNxtBtn').hide();
	 }else{
		 $('#itemNxtBtn').show();
	 }
	/*if(disableNewButton=='true'){
		 $('#newButton').hide();
	 }else{
		 $('#newButton').show();
	 }*/
	//end disable

	
	if((rateDescId!= null)&&(rateDescId != '') && disableNewButton!='true'){
		$('#newButton').show();
		$('#newButton').removeAttr("disabled");
			_pageMode='onAdd';	
	}
	else if(disableNewButton!='true'){
		$('#newButton').attr("disabled","disabled");
	}
	//disable at ADD mode
	$('#rateXCopy').attr("disabled","disabled");		
	if(_pageMode=='Add'){			
		$('#rateCond').attr("disabled","disabled");
		$('#rateReplicate').attr("disabled","disabled");
		$('#itemNxtBtn').hide();
		$('#newButton').show();
	}
	else{
		/*if(_pageMode=='onAdd'){
			$('#newButton').show()
			$('#itemNxtBtn').hide();
			}
		else{
			$('#newButton').hide()
			$('#itemNxtBtn').show();
			}*/
		$('#rateCond').removeAttr("disabled");
		if(!_displayonly){
			$('#rateReplicate').removeAttr("disabled");
		}
	}				
	//end disable

	
  	var oldDescription=$('#description').val();
 	$('#description').change(function() {
		var description=$('#description').val();
		$('#description').val(trim(description));
		var newDescription=trim(description);
		 if(oldDescription!=newDescription){
			 	somethingChanged = true;
			 }
		 else{
			 	somethingChanged = false;
			 }
	 });
  	var oldchoiceAssistText=$('#choiceAssistText').val();
 	$('#choiceAssistText').change(function() {
		 var choiceAssistText=$('#choiceAssistText').val();
		$('#choiceAssistText').val(trim(choiceAssistText));
		var newchoiceAssistText=trim(choiceAssistText);
		 if(oldchoiceAssistText!=newchoiceAssistText){
			 	somethingChanged = true;
			 }
		 else{
			 	somethingChanged = false;
			 }
	 });
 	
 	
 	$('#planEquipHeightCode').gatesPopUpSearch({func:function() {equipPopupSearch()}}); 	
 	$('#effectiveDate').change(function() {
 		isDateChanged=true;
 		$.ajax({
 			url : _context+'/tm/traiffRate/onChangeEffectiveDate',
 			type : "POST",
 			data : {effectiveDate:$('#effectiveDate').val()},
 			success : function(responseText) {
	 				if (responseText.success == true) {
	 					//$('#customerRateGrid').trigger("reloadGrid");
	 					return true;
	 				}
 				}
 		});
 	});
 	$('#expirationDate').change(function() {
 		isDateChanged=true;
 		$.ajax({
 			url : _context+'/tm/traiffRate/onChangeExpirationDate',
 			type : "POST",
 			data : {expirationDate:$('#expirationDate').val()},
 			success : function(responseText) {
	 				if (responseText.success == true) {
	 					return true;
	 				}
 				}
 		});
 	});
 	//customer rate grid:
 	var oldCurrentFutureCust=$('#isCurrentFutureCust').val();
	 $('#isCurrentFutureCust').change(function() {
		 var newCurrentFuture=document.getElementById('isCurrentFutureCust').checked;
		  if(oldCurrentFutureCust!=newCurrentFuture) {
		 		$.ajax({
		 			url : _context+'/tm/traiffRate/onChangeCustFlag',
		 			type : "POST",
		 			data : {isCurrentFutureCust:newCurrentFuture},
		 			success : function(responseText) {
			 				if (responseText.success == true) {
			 					 $('#isCurrentFutureCust').val(newCurrentFuture);
			 					 $('#isCurrentFuture').val(newCurrentFuture);
			 					//$('#isCurrentFuture').val(newCurrentFuture);
			 					$('#customerRateGrid').trigger("reloadGrid");
			 					// document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ rateDescId+"&currentFuture="+newCurrentFuture ;
			 					return true;
			 				}
		 				}
		 		});
		 }
	 });
	//Freight rate grid:
	 	var oldCurrentFutureFrt=$('#isCurrentFutureFrt').val();
		 $('#isCurrentFutureFrt').change(function() {
			 var newCurrentFuture=document.getElementById('isCurrentFutureFrt').checked;
			  if(oldCurrentFutureFrt!=newCurrentFuture) {
			 		$.ajax({
			 			url : _context+'/tm/traiffRate/onChangeFrtFlag',
			 			type : "POST",
			 			data : {isCurrentFutureFrt:newCurrentFuture},
			 			success : function(responseText) {
				 				if (responseText.success == true) {
				 					 $('#isCurrentFutureFrt').val(newCurrentFuture);
				 					$('#isCurrentFuture').val(newCurrentFuture);
				 					$('#frtPayRateGrid').trigger("reloadGrid");
				 					// document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ rateDescId+"&currentFuture="+newCurrentFuture ;
				 					return true;
				 				}
			 				}
			 		});
			 }
		 });
		 var oldRoundToNearestDollar=$('#roundToNearestDollar1').val();
		 $('#roundToNearestDollar1').change(function() {
			 var newRoundToNearestDollar=document.getElementById('roundToNearestDollar1').checked;
			 wholeFlag = newRoundToNearestDollar;
			  if(oldRoundToNearestDollar!=newRoundToNearestDollar) {
			 		$.ajax({
			 			url : _context+'/tm/traiffRate/onChangeWholeDollar',
			 			type : "POST",
			 			data : {isWholeDollar:newRoundToNearestDollar},
			 			success : function(responseText) {
				 				if (responseText.success == true) {
				 					 $('#roundToNearestDollar1').val(newRoundToNearestDollar);
				 					somethingChanged = true;
				 					return true;
				 				}
			 				}
			 		});
			 }
		 });
		
/*		 if($('#isWholeDollarflag').val()=='true' || $('#isWholeDollarflag').val()==true)
			 {
			 wholeFlag = true;
			 document.getElementById('roundToNearestDollar1').checked=true;
			 var newRoundToNearestDollar=$('#isWholeDollarflag').val();
			 		$.ajax({
			 			url : _context+'/tm/traiffRate/onChangeWholeDollar',
			 			type : "POST",
			 			data : {isWholeDollar:newRoundToNearestDollar},
			 			success : function(responseText) {
				 				if (responseText.success == true) {
				 					 $('#roundToNearestDollar1').val(newRoundToNearestDollar);
				 					somethingChanged = true;
				 					return true;
				 				}
			 				}
			 		});
			 }
		   else if($('#isWholeDollarflag').val()=='false' || $('#isWholeDollarflag').val()==false)
		   { 
			   wholeFlag = false;
				 document.getElementById('roundToNearestDollar1').checked=false;
		         var newRoundToNearestDollar=$('#isWholeDollarflag').val();
		  		 $.ajax({
		 			url : _context+'/tm/traiffRate/onChangeWholeDollar',
		 			type : "POST",
		 			data : {isWholeDollar:newRoundToNearestDollar},
		 			success : function(responseText) {
			 				if (responseText.success == true) {
			 					 $('#roundToNearestDollar1').val(newRoundToNearestDollar);
			 					somethingChanged = true;
			 					return true;
			 				}
		 				}
		 		});
	
		 }*/
		 
		 
		 //$('#generalRateIncrExempt1').addClass('noTab');
		 //$('#roundToNearestDollar1').addClass('noTab');
		 //$('#isCurrentFutureCust').addClass('noTab');
			// start - Added below code to escape tab on cas search table header and values
			$('#gview_customerRateGrid a').addClass('noTab');				
			$('#gview_customerRateGrid input[id="cb_customerRateGrid"]').addClass('noTab');
			
			$('#gbox_customerRateGrid a').addClass('noTab');				
			$('#gbox_customerRateGrid input[id="cb_customerRateGrid"]').addClass('noTab');
			
			$('#customerRateGridDiv a').addClass('noTab');				
			$('#customerRateGridDiv input[id="cb_customerRateGrid"]').addClass('noTab');
			
			$('#jqgridcus a').addClass('noTab');				
			$('#jqgridcus input[id="cb_customerRateGrid"]').addClass('noTab');
			
			$('#customerRateGrid a').addClass('noTab');				
			$('#customerRateGrid input[id="cb_customerRateGrid"]').addClass('noTab');
				
		 
		 
});

function removeErrorPointers() {
	$('#rateDescForm').validationEngine('hideAll');
}

// Next Functionality
function loadNextRateDescDetails() {
	var rateDescToUpdate = "NEXT";
	var currentFuture = $('#isCurrentFuture').val(); 
	if (somethingChanged) {
		var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {
			document.location.href = _context + '/tm/traiffRate/showForm?rateDescId=' + rateDescToUpdate+"&currentFuture="+currentFuture;
		}
	}
	else{
		document.location.href = _context + '/tm/traiffRate/showForm?rateDescId=' + rateDescToUpdate+"&currentFuture="+currentFuture;
	}
}
function loadReplicate() {
	
	if(custRateadded==true){
		 somethingChanged =true;
	 }
	if (somethingChanged) {
			var r = confirm("All the unsaved Changes will be discarded!");
			if (r == false) {
				return;
			}
	}
	
	var tariffRateDescriptionId = $('#rateDescId').val();
	var screen='02';
	var currentFuture = $('#isCurrentFuture').val(); 
	if (tariffRateDescriptionId == null || tariffRateDescriptionId == '') {
		alert('Please save the Rate before Replication');
	}
	else {
		document.location.href = _context + '/RateDescription/replicate/showForm?rateDescriptionId='+ tariffRateDescriptionId+'&screen='+screen+'&currentFuture='+currentFuture;
	}
}
function fnCheckEmptyField()
{
	var split=$("#secondaryAmount").val().split(",");
	var newString="";
	for(var index=0;index<split.length;index++) {
		newString=newString+split[index];
	}
	return newString;
}

function cityPopupSearch() {
	var actionUrl = _context + "/city/manualLookup/showForm?term="+ $('#cityCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function cityUpdate(id) {
	$('#cityCode').val(id);
}
function equipPopupSearch() {   
	var actionUrl = _context+"/equipment/lookup/showForm?equipCode="+$('#planEquipFunctionCode').val()+"&equipLen="+$('#planEquipLengthFeet').val()+"&equipHt="+$('#planEquipHeightCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'EquipmentSearch', windowStyle);    
}
function equipUpdate(id){
	var values = id.split(",");
	$('#planEquipFunctionCode').val(values[0]);
	$('#planEquipLengthFeet').val(values[1].trim());
	$('#planEquipHeightCode').val(values[2]);
}
function showEditCustomerRateDialog (id){
	var rateIdsSel = jQuery("#customerRateGrid").getGridParam('selarrrow');
	var rateDescId = $('#rateDescId').val();
	var rateAmntIds="";
	var currentFuture = $('#isCurrentFuture').val(); 
	//var isCurrentFuture = document.getElementById('isCurrentFuture').checked;
	//alert(currentFuture);
	if(rateIdsSel!=null && rateIdsSel!=""){
		rateAmntIds=rateIdsSel;
	}
	else{
		rateAmntIds=id;
	}
	document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+rateDescId+'&isCurrentFuture='+currentFuture;
	
}
function showEditFrtRateDialog (id){
	var rateIdsSel = jQuery("#frtPayRateGrid").getGridParam('selarrrow');
	var rateDescId = $('#rateDescId').val();
	var rateAmntIds="";
	var currentFuture = $('#isCurrentFuture').val(); 
	if(rateIdsSel!=null && rateIdsSel!=""){
		rateAmntIds=rateIdsSel;
	}
	else{
		rateAmntIds=id;
	}
	document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+rateDescId+'&wholeFlag='+wholeFlag+'&isCurrentFuture='+currentFuture;
}

// prepare the form when the DOM is ready
var somethingChanged = false;

$ (function() {
	var milTruckerRateId = $("#milTruckerRateId").val();
	
    var options = {
        success:       showResponse,  // post-submit callback 
        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
     };
    $('input').change(function() { 
		somethingChanged = true; 
	}); 

	$('input[type="checkbox"]').change(function() { 
		somethingChanged = true; 
	});

	$('select').change(function() { 
		somethingChanged = true; 
	});
	
	$('textarea').change(function() { 
		somethingChanged = true; 
	});

	$('input[type="radiobutton"]').change(function() { 
		somethingChanged = false; 
	});
	
	$('#truckerRateNext').click( function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/truckerRate/showNextTruckerRate?truckerRateId="+$("#milTruckerRateId").val(),
					//data: queryString,
					success: function(responseText){
						$("#maintainTruckerRateForm").loadJSON(responseText.data);
						if(responseText.data.isLastRate == true){
							$("#truckerRateNext").attr("disabled", true);	
						}
						if(responseText.data.isFirstRate == false){
							$("#truckerRatePrev").removeAttr("disabled");	
						}
						$("#effectiveDate").val(responseText.data.effectiveDateString);
						$("#expirationDate").val(responseText.data.expirationDateString);
						parseFloatFields();
						setResponseDataInTruckerFields(responseText.data);				
						showResponseMessages(responseText.messages);
						somethingChanged = false;
						changeFreeTime = false;
						changeOverTime = false;
						$.unblockUI();
					}
				});				
			}
		} else {
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/quote/truckerRate/showNextTruckerRate?truckerRateId="+$("#milTruckerRateId").val(),
				//data: queryString,
				success: function(responseText){
					$("#maintainTruckerRateForm").loadJSON(responseText.data);
					if(responseText.data.isLastRate == true){
						$("#truckerRateNext").attr("disabled", true);	
					}
					if(responseText.data.isFirstRate == false){
						$("#truckerRatePrev").removeAttr("disabled");	
					}
					$("#effectiveDate").val(responseText.data.effectiveDateString);
					$("#expirationDate").val(responseText.data.expirationDateString);
					parseFloatFields();
					setResponseDataInTruckerFields(responseText.data);				
					showResponseMessages(responseText.messages);
					somethingChanged = false;
					changeFreeTime = false;
					changeOverTime = false;
					$.unblockUI();
				}
			});
		}
		
	});
	
	$('#truckerRatePrev').click( function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/truckerRate/showPrevTruckerRate?truckerRateId="+$("#milTruckerRateId").val(),
					//data: queryString,
					success: function(responseText){
						$("#maintainTruckerRateForm").loadJSON(responseText.data);
						if(responseText.data.isLastRate == false){
							$("#truckerRateNext").removeAttr("disabled");
						}
						if(responseText.data.isFirstRate == true){
							$("#truckerRatePrev").attr("disabled", true);	
						}
						$("#effectiveDate").val(responseText.data.effectiveDateString);
						$("#expirationDate").val(responseText.data.expirationDateString);
						parseFloatFields();
						setResponseDataInTruckerFields(responseText.data);
						showResponseMessages(responseText.messages);
						somethingChanged = false;
						changeFreeTime = false;
						changeOverTime = false;
						$.unblockUI();
					}
				});				
			}
		}else{
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/quote/truckerRate/showPrevTruckerRate?truckerRateId="+$("#milTruckerRateId").val(),
				//data: queryString,
				success: function(responseText){
					$("#maintainTruckerRateForm").loadJSON(responseText.data);
					if(responseText.data.isLastRate == false){
						$("#truckerRateNext").removeAttr("disabled");
					}
					if(responseText.data.isFirstRate == true){
						$("#truckerRatePrev").attr("disabled", true);	
					}
					$("#effectiveDate").val(responseText.data.effectiveDateString);
					$("#expirationDate").val(responseText.data.expirationDateString);
					parseFloatFields();
					setResponseDataInTruckerFields(responseText.data);
					showResponseMessages(responseText.messages);
					somethingChanged = false;
					changeFreeTime = false;
					changeOverTime = false;
					$.unblockUI();
				}
			});			
		}
		
	});
	
	var calculateTotalCharge = function(){
		var queryString = $('#maintainTruckerRateForm').formSerialize();
		$.ajax({
			type: "POST",
			url: _context +"/quote/truckerRate/calculateTotalCharge",
			data: queryString,
			success: function(responseText) {	
				if (responseText.data) {
					var data = responseText.data;
					console.log(data.totalCharge);
					if (data.totalCharge) $("#totalCharge").val(data.totalCharge.toFixed(0));
					if (data.fuelSurchargeAmount) $("#fuelSurchargeAmount").val(data.fuelSurchargeAmount.toFixed(2));
					if (data.chaseRate) $("#chaseRate").val(data.chaseRate.toFixed(2));
				}
			}
		});	
	};
	
	$('#fuelSurchargeAmount,#truckerCost,#chaseRate').blur(calculateTotalCharge);
	$('#fuelSurchargeTypeCodePercentage,#fuelSurchargeTypeCodeAmount').change(calculateTotalCharge);
	
    $('#truckerRateSave').click( function() {
    	console.log("Inside truckerRateSave ajax");
    	var isCallProcessed = false;
		if(!isExpirationBeforeEffective($("#effectiveDate").val(),$("#expirationDate").val())){
			$("#expirationDate").validationEngine('showPrompt', 'Expiration Date entered cannot be before effective date. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
			return false;
		}
		if(!isExpirationBeforeToday($("#expirationDate").val())){
			$("#expirationDate").validationEngine('showPrompt', 'Expiration Date entered cannot be before current date. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
			return false;
		}
		
		if ( !$("#maintainTruckerRateForm").validationEngine('validate')  || validateFreeTimeAndOverTime()=='false') {
			return;
		}
    	
    	if (somethingChanged == false) {
			$('#msgDiv').html("<div class=\"message_error\">No fields have changed. Cannot update</div>");
			$('#msgDiv').show();
			 return;
		} else{
			
			var currentDate = $.datepicker.formatDate('mm-dd-yy',new Date());
			$("#effectiveDate").val(currentDate);
			
	    	var milTruckerRateId = $("#milTruckerRateId").val();
	
			if ((milTruckerRateId == null) || (milTruckerRateId == '')) {
				_pageMode = "Add";
			} else {
				$("#truckerDelete").attr("disabled", false);
				_pageMode = "Update";
			}
	    
			if($('#rsdollar').val() != null && $('#rsdollar').val() != ''){//D033743
				$("#isAllowHouseholdGoodsMove").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
			}
			
				
			
			// Drop Pull Validation
			var dropPull = $("#isDropPull").val();
			$("#isDropPull").val(dropPull);
			if (dropPull == 'Y') {
				$("#freeTimeRate").val('');
				$("#overRegTimeHourlyRate").val('');
				$("#freeTimeRate").attr("disabled", "disabled");
				$("#overRegTimeHourlyRate").attr("disabled", "disabled");
			}
			if(changeFreeTime){
				$("#truckerFreeTime").val("");				
			}
			if(changeOverTime){
				$("#truckerOverTime").val("");
			}
			if (_pageMode == "Add") {
				var queryString = $('#maintainTruckerRateForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/truckerRate/createUpdateTruckerRate",
					data: queryString,
					success: function(responseText) {	
						$("#maintainTruckerRateForm").loadJSON(responseText.data);
						$.unblockUI();
						showResponseMessages(responseText.messages);	
						$("#effectiveDate").val(responseText.data.effectiveDateString);
						$("#expirationDate").val(responseText.data.expirationDateString);
						if(responseText.data.isDropPull == 'Y'){
							$("#freeTimeRate").val('');
							$("#overRegTimeHourlyRate").val('');
							$("#freeTimeRate").attr("disabled", "disabled");
							$("#overRegTimeHourlyRate").attr("disabled", "disabled");
						}
						parseFloatFields();
						somethingChanged = false;
						changeFreeTime = false;
						changeOverTime = false;
						
						if($('#rsdollar').val() != null && $('#rsdollar').val() != ''){//D033743 : as per above comment restoring the field stat after the controller response
							$("#isAllowHouseholdGoodsMove").attr("disabled", true);
						} else {
							$("#isAllowHouseholdGoodsMove").attr("disabled", false);
						}
					}
				});				
			} else {
				if ((_pageMode=="Update") && (somethingChanged==true)) {
					var queryString = $('#maintainTruckerRateForm').formSerialize();
					blockUI();
					$.ajax({
						type: "POST",
						url: _context +"/quote/truckerRate/createUpdateTruckerRate",
						data: queryString,
						success: function(responseText) {	
							$("#maintainTruckerRateForm").loadJSON(responseText.data);
							$.unblockUI();
							showResponseMessages(responseText.messages);
							$("#effectiveDate").val(responseText.data.effectiveDateString);
							$("#expirationDate").val(responseText.data.expirationDateString);
							if(responseText.data.isDropPull == 'Y'){
								$("#freeTimeRate").val('');
								$("#overRegTimeHourlyRate").val('');
								$("#freeTimeRate").attr("disabled", "disabled");
								$("#overRegTimeHourlyRate").attr("disabled", "disabled");
							}
							parseFloatFields();
							somethingChanged = false;
							changeFreeTime = false;
							changeOverTime = false;
							
							if($('#rsdollar').val() != null && $('#rsdollar').val() != ''){//D033743 : as per above comment restoring the actual stat of field after the controller respone
								$("#isAllowHouseholdGoodsMove").attr("disabled", true);
							} else {
								$("#isAllowHouseholdGoodsMove").attr("disabled", false);
							}
						}
					});	
					
				}
			}
		}    	
	});
    
    if(_onlyDisplay){
		$('#truckerRateModify').gatesDisable();
			}
}); 

function scrollWin(){
	$('html,body').animate({
	scrollTop: $("#msgDiv").offset().top
	}, 200);
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
  
	if (responseText.messages) {		
		var messages = responseText.messages;
		var messageContent = '';
		
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}

		$('#msgDiv').html(messageContent);
		scrollWin();
	}
	
	if(responseText.success) {
		somethingChanged = false;
		changeFreeTime = false;
		changeOverTime = false;
	}
	
	if(responseText.data!=null && messages.error.length == 0) {		
		var data = responseText.data;
		$("#milTruckerRateId").val(data.milTruckerRateId);
		$("#totalCharge").val(data.totalCharge.toFixed(2));
		$("#fuelSurchargeAmount").val(data.fuelSurchargeAmount.toFixed(2));
		if (data.chaseRate != null) {
			$("#chaseRate").val(data.chaseRate.toFixed(2));
		}
	}
} 

function parseFloatFields(){	
	if($("#overRegTimeHourlyRate").val() != ""){
		overRegTimeHourlyRate = parseFloat($("#overRegTimeHourlyRate").val());
		$("#overRegTimeHourlyRate").val(overRegTimeHourlyRate.toFixed(2));	
	}
	if($("#truckerCost").val() != ""){
		truckerCost = parseFloat($("#truckerCost").val());
		$("#truckerCost").val(truckerCost.toFixed(2));	
	}
	if($("#fuelSurchargeAmount").val() != ""){
		fuelSurchargeAmount = parseFloat($("#fuelSurchargeAmount").val());
		$("#fuelSurchargeAmount").val(fuelSurchargeAmount.toFixed(2));	
	}
	
	if($("#chaseRate").val() != ""){
		chaseRate = parseFloat($("#chaseRate").val());
		$("#chaseRate").val(chaseRate.toFixed(2));	
	}
	if($("#hazardousFeeRate").val() != ""){
		hazardousFeeRate = parseFloat($("#hazardousFeeRate").val());
		$("#hazardousFeeRate").val(hazardousFeeRate.toFixed(2));	
	}
	
}

function setResponseDataInTruckerFields(response){
	document.getElementById("cityStateZipCodeDIV").innerHTML=response.truckerCity +" , "+response.truckerState+ " "+response.truckerZip;
	if(response.truckerHouseholdGoodsMovementAllowed == "Y"){		
		$("#isAllowHouseholdGoodsMove").attr("checked", true);
	}else{
		if($('#rsdollar').val() == null || $('#rsdollar').val() == ''){//D033743 : remove RS-ind check only if rsdollar is not present as presence of RS$ means it was present with rate .This is to preserve the rate RS-ind even if the new trucker RS-ind is N
			$("#isAllowHouseholdGoodsMove").removeAttr("checked");
		}
	}
	document.getElementById("phoneDIV").innerHTML=response.truckerPhone;
	if(response.fuelSurchargeType == "P"){
		document.getElementById("percentage").innerHTML=response.fuelSurchargeType;	
	}
	if(response.fuelSurchargeType == "A"){
		document.getElementById("amount").innerHTML=response.fuelSurchargeType;	
	}
	document.getElementById("fuelSurchargeDIV").innerHTML=response.fuelSurcharge;
	$("#fuelSurchargeAmount").val(Number(response.fuelSurchargeAmount).toFixed(2));
	
	// D033743 Starts - The below block is added to ensure that rsdollar enabling / disabling / color code works if trucker name is changed for already existing trucker rate
	if (!$('#isAllowHouseholdGoodsMove').is(":checked")){ 
		$("#rsdollar").attr("disabled", true);
		document.getElementById("rsdollar").style.backgroundColor = "#cfe2f3";
	} else {
		$("#rsdollar").attr("disabled", false);
	}
	
	if($('#rsdollar').val() != null && $('#rsdollar').val() != ''){
		$("#isAllowHouseholdGoodsMove").attr("disabled", true);
	} else {
		$("#isAllowHouseholdGoodsMove").attr("disabled", false);
	}
	
	if($('#defaultRsDollar').val() != null && $('#defaultRsDollar').val() == 'Y'){
		document.getElementById("rsdollar").style.backgroundColor = "yellow";
		var defRsdollar = $("#defaultRsDollarVal").val();
		$("#rsdollar").val(defRsdollar);//this will ensure that default RS$ of changed trucker name will be displayed
	}
	// D033743 Ends
}
// prepare the form when the DOM is ready
var somethingChanged = false;
var _pageMode="default";

$ (function() { 
    var options = { 
        //target:        '#output2',   // target element(s) to be updated with server response 
       // beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
 
        // other available options: 
        //url:       url         // override for form's 'action' attribute 
        //type:      type        // 'get' or 'post', override for form's 'method' attribute 
        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
 
        // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    };

    $('input').change(function() { 
		somethingChanged = true; 
	}); 

	$('input[type="checkbox"]').change(function() { 
		somethingChanged = true; 
	});
	
	$('input[type="radiobutton"]').change(function() { 
		somethingChanged = false; 
	});
    
	
    $('#truckerSave').click(function(){
		if ( !$("#maintainTruckerForm").validationEngine('validate') ) {			
			return;
		}
		
		if (!validatePhoneNo()) {
			return;
		}		
    	if(somethingChanged==false) {    		
			// No Fields are changed, hence return.
    		$('#msgDiv').html("<div class=\"message_error\">No Fields have changed.</div>");
			$('#msgDiv').show();
			 return;
		} else {
	    	var milTruckerId = $("#milTruckerId").val();
			var fuelSurchargePercentage =  $("#fuelSurchargeTypeCodePercentage").attr('checked');
			
			if((milTruckerId == null)||(milTruckerId == '')) {			
				_pageMode="Add";
			} else{
				$("#truckerDelete").attr("disabled", false);
				_pageMode="Update";
			}
			
			if(_pageMode=="Add"){
				if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){
					$("#isAllowHouseholdGoodsMove").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
				}
				if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
					$("#rsdollar").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
				}
				blockUI();
				_pageMode="Update";
	 			$("#maintainTruckerForm").attr("action", "createTrucker");
	 			$("#maintainTruckerForm").ajaxSubmit(options);
	 			if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743 : as per above comment :  disable field was enable so as to pass its actual value to controller : restoring it now
					$("#isAllowHouseholdGoodsMove").attr("disabled", true);
				} else {
					$("#isAllowHouseholdGoodsMove").attr("disabled", false);
				}
	 			if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
	 				$("#rsdollar").attr("disabled", true);
	 			}
			} else {
				if(!$("#isActive").is(":checked") && $("#activeTruckerRate").val()=='true'){
					var r=confirm("Active Trucker Rates exist, Rates will be inactivated");
					if (r==true) {
						blockUI();
						if((_pageMode=="Update") && (somethingChanged==true)){
							if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743
								$("#isAllowHouseholdGoodsMove").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
							}
							if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
								$("#rsdollar").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
							}
				 			$("#maintainTruckerForm").attr("action", "updateTrucker");
				 			$("#maintainTruckerForm").ajaxSubmit(options);
				 			if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743 : as per above comment :  disable field was enable so as to pass its actual value to controller : restoring it now
								$("#isAllowHouseholdGoodsMove").attr("disabled", true);
							} else {
								$("#isAllowHouseholdGoodsMove").attr("disabled", false);
							}
				 			if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
				 				$("#rsdollar").attr("disabled", true);
				 			}
						}
					}
					else{
						$("#isActive").attr("checked", true);
					}
				}
				else{
					blockUI();
					if((_pageMode=="Update") && (somethingChanged==true)){
						if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743
							$("#isAllowHouseholdGoodsMove").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
						}
						if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
							$("#rsdollar").removeAttr("disabled"); // this is to let the actual value pass to controller . After the controller response this will be restored
						}
			 			$("#maintainTruckerForm").attr("action", "updateTrucker");
			 			$("#maintainTruckerForm").ajaxSubmit(options);
			 			if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743 : as per above comment restoring the actual enable / disable rule
							$("#isAllowHouseholdGoodsMove").attr("disabled", true);
						} else {
							$("#isAllowHouseholdGoodsMove").attr("disabled", false);
						}
			 			if(!$("#isAllowHouseholdGoodsMove").is(":checked")){
			 				$("#rsdollar").attr("disabled", true);
			 			}
					}
				}
			}
		}
	});
    
    if(_readonly){
		$('#modifyTrucker').gatesDisable();
	}
}); 

function validatePhoneNo() {

	var countryCode = $.trim($('#countryCode').val());
	var areaCode = $.trim($('#areaCode').val());
	var exchange = $.trim($('#exchangeCode').val());
	var station = $.trim($('#stationCode').val());
	var extension = $.trim($('#extension').val());

	var valid = true;

	if (countryCode == '' && areaCode == '' && exchange == '' && station == '' && extension == '') {
		return valid;
	} else {

		if (areaCode == '') {
			$('#areaCode').validationEngine('showPrompt', 'Please enter area code', 'error', 'topRight', true);
			valid = false;
		}
		if (valid && (exchange == '')) {
			$('#exchangeCode').validationEngine('showPrompt', 'Please enter exchange code', 'error', 'topRight', true);
			valid = false;
		}
		if (valid && station == '') {
			$('#stationCode').validationEngine('showPrompt', 'Please enter station code', 'error', 'topRight', true);
			valid = false;
		}

		if (valid) {
			if (countryCode == '' || countryCode == '1' || countryCode == '01' || countryCode == '001') {
				if (areaCode.length != 3) {
					$('#areaCode').validationEngine('showPrompt', 'Area code must be of 3 digits', 'error', 'topRight', true);
					valid = false;
				}
				if (valid && exchange.length != 3) {
					$('#exchangeCode').validationEngine('showPrompt', 'Exchange must be of 3 digits', 'error', 'topRight', true);
					valid = false;
				}
				if (valid && station.length != 4) {
					$('#stationCode').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
					valid = false;
				}
			} else {
				if (valid && areaCode.length < 2) {
					$('#areaCode').validationEngine('showPrompt', 'Area code must be of 2-4 digits', 'error', 'topRight', true);
					valid = false;
				}
				if (valid && exchange.length < 3) {
					$('#exchangeCode').validationEngine('showPrompt', 'Exchange must be of 3-4 digits', 'error', 'topRight', true);
					valid = false;
				}
				if (valid && station.length != 4) {
					$('#stationCode').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
					valid = false;
				};
			}
		}
	}
	return valid;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
  
	if (responseText.messages) {
		//alert("in resp:"+responseText.data);
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
	}
	
	if(responseText.messages != null && responseText.messages.error != null && 
			responseText.messages.error == "") {
		somethingChanged = false;
		$("#truckerDelete").removeAttr("disabled");
	}
	
	if(responseText.data!=null) {
		var data = responseText.data;
		if (!(data.success == "error")) {
			$("#milTruckerId").val(data);
		}
	}
	$.unblockUI();
}
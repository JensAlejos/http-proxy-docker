$(function() {
	
	$("#milRequiredDeliveryDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	
	$("#milRequiredDeliveryDate").change(function(){
		if(!validateDate('milRequiredDeliveryDate')){
			$(this).validationEngine('showPrompt', '* Enter date in Format (mm-dd-yyyy)', 'error', 'topRight', true);
		}
	});
	
	$('#militaryConsignorCode').blur(
			function ()
			{
				if($('#militaryConsignorCode').val()!=''){
					var s1 = $('#militaryConsignorCode').val();
					$('#militaryConsignorCode').val(s1.toUpperCase());
					
				}
			});
	
	        $('#militaryPortCallFileNumber').blur(
			function ()
			{
				if($('#militaryPortCallFileNumber').val()!=''){
					var s3 = $('#militaryPortCallFileNumber').val();
					$('#militaryPortCallFileNumber').val(s3.toUpperCase());
					
				}
			});
	        $('#governmentBillOfLadingNbr').blur(
	    			function ()
	    			{
	    				if($('#governmentBillOfLadingNbr').val()!=''){
	    					var s4 = $('#governmentBillOfLadingNbr').val();
	    					$('#governmentBillOfLadingNbr').val(s4.toUpperCase());
	    					
	    				}
	    			});
	
	        $('#militaryContractNumber').blur(
	    			function ()
	    			{
	    				if($('#militaryContractNumber').val()!=''){
	    					var s5 = $('#militaryContractNumber').val();
	    					$('#militaryContractNumber').val(s5.toUpperCase());
	    					
	    				}
	    			});
	
	        $('#militaryVoyageDocNumber').blur(
	    			function ()
	    			{
	    				if($('#militaryVoyageDocNumber').val()!=''){
	    					var s6 = $('#militaryVoyageDocNumber').val();
	    					$('#militaryVoyageDocNumber').val(s6.toUpperCase());
	    					
	    				}
	    			});

// Autocompleter and lookup for Cargo Pickup
	$('#cargoPickupCityCodeDesc').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		formatItem : function(item) {
			return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode + "-" + item.cityName;
		},
		select : function(item) {
			$('#cargoPickupCityCode').val(item.cityCode);
		}
	});
	
	$('#cargoDeliveryCityCodeDesc').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		formatItem : function(item) {
			return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode + "-" + item.cityName;
		},
		select : function(item) {
			$('#cargoDeliveryCityCode').val(item.cityCode);
		}
	});
	
	$('#cargoPickupCityCodeDesc').blur(function() {
		if ($('#cargoPickupCityCode').val() == "")
		{
			$('#cargoPickupCityCodeDesc').val('');
		}
		else if($('#cargoPickupCityCodeDesc').val() == '')
		{
			$('#cargoPickupCityCode').val('');
		}
	});
	
	$('#cargoDeliveryCityCodeDesc').blur(function() {
		if ($('#cargoDeliveryCityCode').val() == "")
		{
			$('#cargoDeliveryCityCodeDesc').val('');
		}
		else if($('#cargoDeliveryCityCodeDesc').val() == '')
		{
			$('#cargoDeliveryCityCode').val('');
		}
	});
	
	// function- cityUpdate is in routing.js for pickup and delivery
	$('#cargoPickupCityCodeDesc').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#cargoPickupCityCode').val(), 8);
		}
	});
	
	$('#cargoDeliveryCityCodeDesc').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#cargoDeliveryCityCode').val(), 9);
		}
	});
	
	$('#militaryIbsStatusCode').change(function(){
		//alert("militaryIbsStatusCode change");
		/*if(($('#customerGroupId :selected').text()=="GOVERNMENT") && $('#isAllowBookingUnit').val()=="Y"){
			setIBSCodeMandatory();
			var ibsCodeText='';
			if($('#militaryIbsStatusCode option:selected').text()!=''){
				ibsCodeText = $('#militaryIbsStatusCode option:selected').text().split(":")[1];
			}
			setCargoPickupDeliveryMandatory(ibsCodeText);
		}
		else{
			//$(this).val("");
			//Block commented by Mangesh: NO BR
			resetIBSCode();
			resetCargoPickup();
			resetCargoDelivery();
		}*/
		///----------Added by pRIYANKA
		setIBSCodeMandatory();
		var ibsCodeText='';
		if($('#militaryIbsStatusCode option:selected').text()!=''){
			ibsCodeText = $('#militaryIbsStatusCode option:selected').text().split(":")[1];
		}
		setCargoPickupDeliveryMandatory(ibsCodeText);
		//------------------
	});
	
	$('#milRequiredDeliveryDate').change(function(){
		$('#requiredDeliveryDate').val($(this).val());
	});
	
	/*$('#militaryPortCallFileNumber').change(function(){
		if($.trim($(this).val())==''){
			setAccordianTabDetails('maintainShipmentMilitaryId', 'Military');
		}
		else{
			setAccordianTabDetails('maintainShipmentMilitaryId', 'Military - '+$.trim($(this).val()));
		}
		$.trim($(this).val());
	});*/
});

function setIBSCodeMandatory(){
	// IBSCode Code
	$("#ibsCodeLbl").html("IBS Code<span class=\"mandatory\">*</span>");
	$("#militaryIbsStatusCode").addClass("validate\[required\]");
}

function resetIBSCode(){
	// IBSCode Code
	$("#ibsCodeLbl").html("IBS Code");
	$("#militaryIbsStatusCode").removeClass("validate\[required\]");
}

function setCargoPickupDeliveryMandatory(ibsStatusCode){
	if(ibsStatusCode.substr(0, 4)=='DOOR'){
		 setCargoPickupMandatory();
	}
	else{
		resetCargoPickup();
	}
	
	if(ibsStatusCode.substr(5, 9)=='DOOR'){
		setCargoDeliveryMandatory();
	}
	else{
		resetCargoDelivery();
	}
}

function validateIBSCode(){
	/*if(!(($('#customerGroupId :selected').text()=="GOVERNMENT") && $('#isAllowBookingUnit').val()=="Y") && $('#militaryIbsStatusCode').val()!=""){
		//$('#militaryIbsStatusCode').val("");
		return "IBS code is not valid for this shipment.";
   	}*/
}

function setCargoPickupMandatory(){
	$('#cargoPickupCityCodeDesc').removeAttr("disabled");
	$("#cargoPickupLbl").html("Cargo Pickup<span class=\"mandatory\">*</span>");
	$("#cargoPickupCityCodeDesc").addClass("validate\[required\]");
	$('#popupSearchcargoPickupCityCodeDesc').show();
}

function resetCargoPickup(){
	$('#cargoPickupCityCodeDesc').val('');
	$('#cargoPickupCityCodeDesc').attr("disabled", true);
	$("#cargoPickupLbl").html("Cargo Pickup");
	$("#cargoPickupCityCodeDesc").removeClass("validate\[required\]");
	$('#popupSearchcargoPickupCityCodeDesc').hide();
}

function setCargoDeliveryMandatory(){
	$('#cargoDeliveryCityCodeDesc').removeAttr("disabled");
	$("#cargoDeliveryLbl").html("Cargo Delivery<span class=\"mandatory\">*</span>");
	$("#cargoDeliveryCityCodeDesc").addClass("validate\[required\]");
	$('#popupSearchcargoDeliveryCityCodeDesc').show();
	//$('#imgPayeeLine'+index).show();
}

function resetCargoDelivery(){
	$('#cargoDeliveryCityCodeDesc').val('');
	$('#cargoDeliveryCityCodeDesc').attr("disabled", true);
	$("#cargoDeliveryLbl").html("Cargo Delivery");
	$("#cargoDeliveryCityCodeDesc").removeClass("validate\[required\]");
	$('#popupSearchcargoDeliveryCityCodeDesc').hide();
}

/*function validateRDD(){
	var conventionalRDD = $('#requiredDeliveryDate').val();
	var rdd = $('#milRequiredDeliveryDate').val();
	//alert("conventionalRDD: "+rdd);
	//alert("rdd: "+conventionalRDD);
	if(conventionalRDD!=null && conventionalRDD!='' && rdd!= null && rdd!='' && conventionalRDD!=rdd){
		return "VVD Routing's Conventional RDD and Military's RDD should match.";
	}*/
//}


function setMilitaryDiv() {
	var divText = $('#militaryPortCallFileNumber').val();
	if ($.trim(divText) == '') {
		setAccordianTabDetails('maintainShipmentMilitaryId', 'Military');
	} else {
		setAccordianTabDetails('maintainShipmentMilitaryId', ' - '
				+ $.trim(divText));
	}
	$.trim(divText);
}

function updateMilitaryData(responseText){
	//alert("responseText.data.header.requiredDeliveryDate"+responseText.data.header.requiredDeliveryDate);
	//alert("responseText.data.routing.freightDestinationCityCode"+responseText.data.routing.freightDestinationCityCode);
	$('#milRequiredDeliveryDate').val(responseText.data.header.requiredDeliveryDate);
	$('#cargoDeliveryCityCode').val(responseText.data.routing.freightDestinationCityCode);
	$('#cargoDeliveryCityCodeDesc').val(responseText.data.routing.freightDestinationCityCodeDescription);
	$('#cargoPickupCityCode').val(responseText.data.routing.freightOriginCityCode);
	$('#cargoPickupCityCodeDesc').val(responseText.data.routing.freightOriginCityCodeDescription);
	if(responseText.data.militaryShipment.militaryIbsStatusCode==''){
		resetCargoPickup();
		resetCargoDelivery();
	}else{
		var ibsCodeText='';
		if($('#militaryIbsStatusCode option:selected').text()!=''){
			ibsCodeText = $('#militaryIbsStatusCode option:selected').text().split(":")[1];
		}
		setCargoPickupDeliveryMandatory(ibsCodeText);
	}
}
$(function() {
	
	$("#milRequiredDeliveryDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
			if(!$('#requiredDeliveryDate').attr("disabled"))
				$('#requiredDeliveryDate').val($("#milRequiredDeliveryDate").val());
			/*if(!$('#premiumRDD').attr("disabled"))
				$('#premiumRDD').val($("#milRequiredDeliveryDate").val());*/
				militaryHeader();
		}
	});
	
	$("#milRequiredDeliveryDate").change(function(){
		if($("#milRequiredDeliveryDate").val()=='' && $('#requiredDeliveryDate').attr("disabled") != 'disabled'){
			$('#requiredDeliveryDate').val($("#milRequiredDeliveryDate").val());
		} else if(!validateDate('milRequiredDeliveryDate', false)){
			$(this).validationEngine('showPrompt', '* Enter date in Format (mm-dd-yyyy)', 'error', 'topRight', true);
		} else{
			 if($('#requiredDeliveryDate').attr("disabled") != 'disabled'){
					$('#requiredDeliveryDate').val($("#milRequiredDeliveryDate").val());
				}
			 /*if($('#premiumRDD').attr("disabled") != 'disabled'){
					$('#premiumRDD').val($("#milRequiredDeliveryDate").val());
				}*/
		}
		militaryHeader();
	});

// Autocompleter and lookup for Cargo Pickup
	$('#cargoPickupCityCodeDesc').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		name: "Cargo Pickup City Code",
		autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
			//return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
			//return item.cityCode + "-" + item.cityName;
		},
		select : function(item) {
			$('#cargoPickupCityCode').val(item.cityCode);
			isBookingChanged = "Y";
		}
	});
	
	$('#cargoDeliveryCityCodeDesc').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		name: "Cargo Delivery City Code",
		autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
			//return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
			//return item.cityCode + "-" + item.cityName;
		},
		select : function(item) {
			$('#cargoDeliveryCityCode').val(item.cityCode);
			isBookingChanged = "Y";
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
		//Commenting out as per D016178
		//alert("militaryIbsStatusCode change");
		/*if(($('#customerGroupId :selected').text()=="GOVERNMENT") && $.trim($('#loadDschServiceGroupCode').val())=='CON' && $('#isAllowBookingUnit').val()=="Y"){
			setIBSCodeMandatory();
			var ibsCodeText='';
			if($('#militaryIbsStatusCode option:selected').text()!=''){
				ibsCodeText = $('#militaryIbsStatusCode option:selected').text().split(":")[1];
			}
			setCargoPickupDeliveryMandatory(ibsCodeText);
		}
		else{
			//$(this).val("");
			resetIBSCode();
			resetCargoPickup();
			resetCargoDelivery();
		}*/
		/*&& $('#militaryIbsStatusCode').val()!=""*/
		if($('#militaryIbsStatusCode option:selected').text()!='')
			setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
		validateIBSCode();
	});
	
	$('#milRequiredDeliveryDate').change(function(){
		$('#requiredDeliveryDate').val($(this).val());
		
		militaryHeader();
	});
	
	$('#militaryPortCallFileNumber').change(function(){
		/*if($.trim($(this).val())==''){
			setAccordianTabDetails('maintainBookingMilitaryId', '');
		}
		else{
			setAccordianTabDetails('maintainBookingMilitaryId', ' - '+$.trim($(this).val()));
		}
		$.trim($(this).val());*/
		militaryHeader();
	});
	
	militaryHeader();
	
	
});
//18644
function militaryHeader(){
	var header='';
	if($('#militaryPortCallFileNumber').val()!=' ' &&$('#militaryPortCallFileNumber').val()!='' ){
		header=header+'PCFN- '+$('#militaryPortCallFileNumber').val();
	}
	if($('#milRequiredDeliveryDate').val()!='')
		{
		header=header+' | RDD- '+$('#milRequiredDeliveryDate').val();
		}
	if(header==''){
		setAccordianTabDetails('maintainBookingMilitaryId', '');
	}
	else{
		setAccordianTabDetails('maintainBookingMilitaryId', ' - '+header);
	}
}

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
	//alert("ibsStatusCode: " + ibsStatusCode);
	if(ibsStatusCode!=undefined && ibsStatusCode!="" && ibsStatusCode.substr(0, 4)=='DOOR'){
		 setCargoPickupMandatory();
	}
	else{
		resetCargoPickup();
	}
	
	if(ibsStatusCode!=undefined && ibsStatusCode!="" && ibsStatusCode.substr(5, 9)=='DOOR'){
		setCargoDeliveryMandatory();
	}
	else{
		resetCargoDelivery();
	}
}

function setCargoPickupMandatory(){
	$('#cargoPickupCityCodeDesc').removeAttr("disabled");
	$("#cargoPickupLbl").html("Cargo Pickup<span class=\"mandatory\">*</span>");
	$("#cargoPickupCityCodeDesc").addClass("validate\[required\]");
}

function resetCargoPickup(){
	$('#cargoPickupCityCodeDesc').attr("disabled", true);
	$("#cargoPickupLbl").html("Cargo Pickup");
	$("#cargoPickupCityCodeDesc").removeClass("validate\[required\]");
	$('#cargoPickupCityCodeDesc').val("");
	$('#cargoPickupCityCode').val("");
}

function setCargoDeliveryMandatory(){
	$('#cargoDeliveryCityCodeDesc').removeAttr("disabled");
	$("#cargoDeliveryLbl").html("Cargo Delivery<span class=\"mandatory\">*</span>");
	$("#cargoDeliveryCityCodeDesc").addClass("validate\[required\]");
}

function resetCargoDelivery(){
	$('#cargoDeliveryCityCodeDesc').attr("disabled", true);
	$("#cargoDeliveryLbl").html("Cargo Delivery");
	$("#cargoDeliveryCityCodeDesc").removeClass("validate\[required\]");
	$('#cargoDeliveryCityCodeDesc').val("");
	$('#cargoDeliveryCityCode').val("");
}

/*function validateRDD(){
	var conventionalRDD = $('#requiredDeliveryDate').val();
	var rdd = $('#milRequiredDeliveryDate').val();
	//alert("conventionalRDD: "+rdd);
	//alert("rdd: "+conventionalRDD);
	if(conventionalRDD!=null && conventionalRDD!='' && rdd!= null && rdd!='' && conventionalRDD!=rdd){
		return "VVD Routing's Conventional RDD and Military's RDD should match.";
	}
}*/

function validateMilitaryFieldsOnSave(){
	var isValid = true;
	if(!$("#militaryIbsStatusCode").hasClass('validate[required]') && $('#militaryIbsStatusCode').val()!=null && $('#militaryIbsStatusCode').val()!="" && $("#tcnGrid").getGridParam("records")==0){
		if(!$('#maintainBookingMilitary').is(':visible')){
			expandMilitaryDiv();
			$('#militaryIbsStatusCode').validationEngine('showPrompt', '* IBS code is not valid for this booking as no TCN exists.', 'error', 'topRight', true);
		}
		else{
			$('#militaryIbsStatusCode').validationEngine('showPrompt', '* IBS code is not valid for this booking as no TCN exists.', 'error', 'topRight', true);
		}
		isValid = false;
   	}
	else if($("#militaryIbsStatusCode").hasClass('validate[required]')&& !$("#tcnGrid").getGridParam("records")==0){
		if($('#militaryIbsStatusCode').val()==""){
			if(!$('#maintainBookingMilitary').is(':visible')){
				expandMilitaryDiv();
			}
			$('#militaryIbsStatusCode').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
			isValid = false;
		}
		if($("#cargoPickupCityCodeDesc").hasClass('validate[required]') && $('#cargoPickupCityCodeDesc').val()==""){
			if(!$('#maintainBookingMilitary').is(':visible')){
				expandMilitaryDiv();
			}
			$('#cargoPickupCityCodeDesc').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
			isValid = false;
		}
		if($("#cargoDeliveryCityCodeDesc").hasClass('validate[required]') && $('#cargoDeliveryCityCodeDesc').val()==""){
			if(!$('#maintainBookingMilitary').is(':visible')){
				expandMilitaryDiv();
			}
			$('#cargoDeliveryCityCodeDesc').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	return isValid;
}

function validateIBSCode(){
	//alert("IBS: " + $('#militaryIbsStatusCode').val());
	if($("#tcnGrid").getGridParam("records")==0 && $('#militaryIbsStatusCode').val()!=null && $('#militaryIbsStatusCode').val()!=""){
		$("#militaryTcn").addClass("validate\[required\]");
   	}else{
   		$("#militaryTcn").removeClass("validate\[required\]");
   	}
}

function expandMilitaryDiv(){
	//collapseAll();
	expandSection(5);
	/*$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all')[5].className = "ui-accordion-header ui-helper-reset ui-state-active ui-corner-top";
	$('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
	//window.scrollTo(0, 0);
	$('#maintainBookingMilitary').css('display', 'block');*/
}

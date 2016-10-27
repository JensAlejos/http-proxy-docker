var iterated = false;
var freightModified = false;
var estimatedDropOffDateModified = false;
var povChanged="N";
var POV_NAME = "PERSONAL AUTO";
var ALASKA_POV_NAME = "ALASKA AUTO";
var GOVERNMENT_NAME = "GOVERNMENT";
//Create all the frieght grids

$(document).ready(function() {
	freightTabSequence();
	createEquipmentGrid();

//$("#plannedArrivalDate").datepicker({dateFormat: 'mm-dd-yy'});
$("#estimatedDropOffDate").datepicker({
	dateFormat: 'mm-dd-yy',
	onSelect : function(dateText, elem)
	{
		freightModified = true;
		isBookingChanged = "Y";
		estimatedDropOffDateModified = true;
		var validated = validateAutoEstDropOffDate();
		if(validated){
			$("#estimatedDropOffDate").validationEngine('hide');
		}
	}
});

$('#pieceCount').change(function(){
	showPieceCountWarnMsg();
	if($.trim($('#pieceCount').val())=='0' || $.trim($('#pieceCount').val())==0)
		{
		$('#pieceCount').val('');
		
		}
	//added for	D025466
	calculateCube();

	
});

/*$('#estimatedDropOffDate').change(function(){
	freightModified = true;
	var validated = validateAutoEstDropOffDate();
	if(validated && $('#estimatedDropOffDate').val()!='undefined' && $('#estimatedDropOffDate').val()!=null && $('#estimatedDropOffDate').val()!=''){
		$("#estimatedDropOffDate").validationEngine('hide');
	}
});*/

$('#tariffCommodityDescription').gatesPopUpSearch({
	func : function() {
		commPopupSearch();
	}
});

$('#tariffItemNoteNumber').gatesPopUpSearch({
	func : function() {
		notePopupSearch();
	}
});

$('#freight\\.isRoRo1').change(function(){
	freightModified = true;
	isBookingChanged = "Y";
	if($("#equipmentGrid").getGridParam("reccount")!=0 && $('#freight\\.isRoRo1').is(':checked')==true){
		var isConfirm = confirm("All the freight equiments will be deleted. Please confirm to proceed!");
		if (isConfirm) {
			$.ajax({
				url: _context+'/booking/freight/updateRollingStock',
				data: {isRoRo:$('#freight\\.isRoRo1').is(':checked'), isAllEquipDelete:true},
				success:function(responseText){
					if(!responseText.success){
						showResponseMessages('msgDivFrtEqp', responseText);
						$('#msgDivFrtEqp').show();
					}else{
						loadEquipmentGrid();
					}
				} 	
			});
		}
		else{
			$('#freight\\.isRoRo1').attr('checked', false);
		}
	}
	else{
		$.ajax({
			url: _context+'/booking/freight/updateRollingStock',
			data: {isRoRo:$('#freight\\.isRoRo1').is(':checked'), isAllEquipDelete:false}
		});
	}
	setMandatoryPieces();
});

$('#tariffCommodityDescription').change(function(){
	freightModified = true;
	isBookingChanged = "Y";
	var tariffCommodityDescription = $(this).val();
	if($("#tariffCommodityDescriptionHidden").val()==$.trim(tariffCommodityDescription)){
		$(this).val($.trim(tariffCommodityDescription));
	}
	else if($("#tariffCommodityDescriptionHidden").val()!=tariffCommodityDescription){
		// Validate Tariff details
    	if($('#tariffCommodityDescription').val()!='' && $('#tariff').val()!='' && $('#tariffItemNumber').val()!=''){
    		$("#commodityCode").attr("readonly", true);
    		$.ajax({
    			url: _context +"/booking/freight/validateTariffDetails",
    			type: 'POST',
    			data: serializeFreight() + "&trade="+$('#tradeCode').val()+"&loadServiceCode="+$("#loadServiceCode").val()+"&dischargeServiceCode="+$("#dischargeServiceCode").val()+"&blOriginCityCode="+$('#blOriginCityCode').val()+"&originPortCityCode="+$('#originPortCityCode').val()+"&destinationPortCityCode="+$('#destinationPortCityCode').val()+"&blDestinationCityCode="+$('#blDestinationCityCode').val(),
    			success: function(responseText){
    				$('#msgDivFrt').hide();
    				if(responseText.success){
    					if(responseText.data!=null){
    						$.each(responseText.data, function(key, val) {
						    	   if(key=='commodityCodes'){
						    		   populateCommodityCodeList(val);
						    	   }
						    	   else if(key=='tariffItemCmdtyDescId'){
						    		   $("#tariffItemCmdtyDescId").val(val);  
						    	   }
    						});
    					}
    				}
    				else{
    					$.unblockUI();
    					$('#bookingSave').attr("disabled", false);
    					scrollToCommodity();
    					$('#msgDivFrt').show();
						showResponseMessages('msgDivFrt', responseText);
    				}
    				$("#commodityCode").attr("readonly", false);
    				$("#tariffCommodityDescriptionHidden").val($.trim(tariffCommodityDescription));
    			}
    		});
    	}
	}
});

// code for source tariff predictive search
var tarGrpIds='';
$('#tariff').gatesAutocomplete({
	source: _context+'/cas/autocomplete.do',
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
	name: "Tariff",
	extraParams: {
	 		 method: 'searchTariffSource',
	 		 searchType: '11',
	 		 // term: trf,
	 		 groupType:  '01'
	 },
	 formatItem: function(data) {
		 $(data).each(function(){
			 tarGrpIds=tarGrpIds+"-"+data.id+"|"+data.name;								     	    	
			});
		 //dataName=data.name;
	 	 //$('input[name="grpId"]').val(data.id);
	 	return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
		 	 // alert("Grp: " + data.id);
	 		 $('#tariff').val(data.name);
	 		 $('#tariff').trigger('change');
	 		 $('#tariffCheck').val(data.name);
	 		 //$('#tariffHidden').val(data.name);
	 		 $('#frtGrpId').val(data.id);
	 		 setMandatoryTariffItem();
	 		 if($('div.message_error', '#msgDivFrt').is(':visible')){
				$('#msgDivFrt').hide();
	 		 }
	 		 
	 }		 
});	

$('#tariff').bind('blur', function(event) {	
	if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
		$('#tariffItemNoteNumber').attr('disabled', true);
	} else {
		$('#tariffItemNoteNumber').attr('disabled', false);
	}
	//change D025868
 	setFreightAccordianTabDetails($('#totalCommodityLines').text(), $.trim($('#tariff').val()), $.trim($('#tariffItemNumber').val()),$.trim($("#commodityDescription").val()), $("#tariffCommodityDescription").val());
	
});

// Blurr the data for invalid group Id
 $('#tariff').change(function(){
    freightModified = true;
    isBookingChanged = "Y";
 	if($.trim($('#tariff').val())!='' && tarGrpIds.indexOf("-")<=0){
		var values=tarGrpIds.split("-");
		for(var i=1;i<values.length;i++){
			var val=values[i].split("|");
			if($.trim(val[1]) != '' && $.trim($('#tariff').val())==$.trim(val[1].toLowerCase())){
				$("#tariff").val(val[1]);
				//$('#tariffHidden').val(val[1]);
				$('#frtGrpId').val(val[0]);
		 		 setMandatoryTariffItem();
				break;
			}
		}
		tarGrpIds='';
 	}
 	
 	if($.trim($('#tariff').val())=='' || ($("#tariff").val()!=$('#tariffHidden').val())){
		resetMandatoryTariffCmdDesc();
		resetTariffDetails();
		if(checkIfAnyFreightFieldHasValue() && $.trim($("#commodityDescription").val())==''){
			$('#commodityDescription').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
			$("#commodityDescription").addClass("validate[required]");
		}
		$("#primaryFreightPresent").val('N');
	} 
	else{
		resetMandatoryCustDesc();
	}
	$('#msgDivFrt').html('');
	$('#msgDivFrt').hide();
	
	if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
		$('#tariffItemNoteNumber').attr('disabled', true);
	} else {
		$('#tariffItemNoteNumber').attr('disabled', false);
	}
	
	setAutoBillMandatory();
	
	$('#tariffHidden').val($('#tariff').val());
 }); 

// code for item predictive
var itemIds='';
$('#tariffItemNumber').gatesAutocomplete({
	 source: _context+'/cas/autocomplete.do',
	 name: "Tariff Number",
	 minLength: 1,
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
	 extraParams: {
		 method: 'searchItemName',
	 		 searchType: '43',
	 		 // term: function(){return (request.term==null ||
				// $.trim(request.term)=='')?"ALL":request.term;},
	 		 groupType:  '01',
	 		 sourceTariff:  function(){return ($('#tariff').val()==null || $.trim($('#tariff').val())=='')?"ALL":$('#tariff').val();},
	 		 groupName:   function(){return ($('#tariff').val()==null || $.trim($('#tariff').val())=='')?"ALL":$('#tariff').val();}
	 },
	 formatItem: function(data) {
		 $(data).each(function(){
			 itemIds=itemIds+"-"+data.id+"|"+data.name;								     	    	
			});
		//dataName=data.name;
	 	return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
			if($('#tariffItemNumber').val()==data.name){
				isBookingChanged = "Y";
			}
		 	$('#tariffItemNumber').val(data.name);
		 	$('#tariffItemNumberHidden').val(data.name);
		 	$('#frtItemId').val(data.id);
		 	$('#tariffItemNoteNumber').attr('disabled', false);
		 	// Fetch Primary Commodity of current Tariff & its Item
		 	getPrimaryCommodity($('#tariff').val(), data.name);
		 	if(data.id!=null && $.trim(data.id)!='' && $.trim($('#tariffItemNoteNumber').val())!=''){
		 		validateNote1(data.id, $('#tariffItemNoteNumber').val());
		 	}
	 }		 
});	

$('#tariffItemNumber').bind('blur', function(event) {	
	if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
		$('#tariffCommodityDescription').val('');
		$('#tariffItemNoteNumber').val('');
		$('#tariffItemNoteNumber').attr('disabled', true);
	} else {
		$('#tariffItemNoteNumber').attr('disabled', false);
	}
	//change D025868
	setFreightAccordianTabDetails($('#totalCommodityLines').text(), $.trim($('#tariff').val()), $.trim($('#tariffItemNumber').val()),$.trim($("#commodityDescription").val()), $("#tariffCommodityDescription").val());
});



// Blurr the data for invalid item Id
$('#tariffItemNumber').change(function(){
	freightModified = true;
	isBookingChanged = "Y";
 	if($.trim($('#tariffItemNumber').val())!='' && itemIds.indexOf("-")<=0){
		var values=itemIds.split("-");
		for(var i=1;i<values.length;i++){
			var val=values[i].split("|");
			if($.trim($('#tariffItemNumber').val())==$.trim(val[1].toLowerCase())){
				$("#tariffItemNumber").val(val[1]);
				$('#tariffItemNumberHidden').val(val[1]);
				$('#frtItemId').val(val[0]);
				getPrimaryCommodity($('#tariff').val(), val[1]);
				break;
			}
		}
		itemIds='';
 	}
	 
	if($.trim($('#tariffItemNumber').val())=='' || ($('#tariffItemNumber').val()!=$('#tariffItemNumberHidden').val())){
		$("#tariffItemNumber").val(""); 
		$('#tariffItemNumberHidden').val("");
		$("#frtItemId").val("");
		clearCommodityCodeList();
		resetMandatoryTariffCmdDesc();
		if($.trim($('#tariff').val())!='' && ($("#tariff").val()==$('#tariffHidden').val())){
			setMandatoryTariffItem();
		}
		$("#primaryFreightPresent").val("");
		$('#msgDivFrt').html('');
		$('#msgDivFrt').hide();
	} 
		
	if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
		$('#tariffItemNoteNumber').attr('disabled', true);
	} else {
		$('#tariffItemNoteNumber').attr('disabled', false);
 	}
	
	setAutoBillMandatory();
}); 	
	 
$('#tariffItemNoteNumber').change(function(){
	freightModified = true;
	isBookingChanged = "Y";
	if($.trim($(this).val())==''){
		$(this).val(""); 
	}
	//D028014: 	PROD Error Message 
	$(this).val($(this).val().toUpperCase());
});

$('#tariffItemNoteNumber').focusout(function(){
	//D030513: 	PROD Error Message 
	$(this).val($(this).val().toUpperCase());
});
 
$('#vinNumber').change(function(){
	freightModified = true;
	isBookingChanged = "Y";
	var lastUserProvidedVinNumber = $.trim($("#lastUserProvidedVinNumber").val());
	var vin = $.trim($(this).val());
	if(lastUserProvidedVinNumber!=vin && (vin.length>0 && vin.length<=17)){
		$.ajax({
	 		 url: _context+'/booking/freight/getVehicleDetails',
	 		 data:{vinNumber:vin, measurementSource:$('#unitOfMeasureSourceCode').val()},
	 		 success: function(responseText) {
	 			 // alert(responseText.success);
	 		 		 if(responseText.success){
	 		 			if($('#bookingTypeCode').val()=='B' && !$('#vinNumberLbl span').hasClass('mandatory') /*
																												 * &&
																												 * vin.length==17
																												 */){
	 		 				// setMandatoryPOV();
	 		 				$("#freightWeightLbl").html($("#freightWeightLbl").text()+"<span class=\"mandatory\">*</span>");
	 		 				$("#weight").addClass("validate[required]");
	 		 			}

	 		 			$('#vinNumber').val(responseText.data.vehicleInfo.vinNumber);
	 		 			$('#vehicleYear').val(responseText.data.vehicleInfo.year);
	 		 			$('#vehicleMake').val(responseText.data.vehicleInfo.make);
	 		 			$('#vehicleModel').val(responseText.data.vehicleInfo.model);
	 		 			if($('#unitOfMeasureSourceCode').val()=="I"){
	 		 				$('#feetLength').val(responseText.data.length.toString().split(".")[0]);
 		 		    		$('#inchesLength').val($.trim(responseText.data.length.toString().split(".")[1])==''?0:responseText.data.length.toString().split(".")[1]);
	 		 				
 		 		    		$('#feetWidth').val(responseText.data.width.toString().split(".")[0]);
 		 		    		$('#inchesWidth').val($.trim(responseText.data.width.toString().split(".")[1])==''?0:responseText.data.width.toString().split(".")[1]);
 		 		    		
 		 		    		$('#feetHeight').val(responseText.data.height.toString().split(".")[0]);
 		 		    		$('#inchesHeight').val($.trim(responseText.data.height.toString().split(".")[1])==''?0:responseText.data.height.toString().split(".")[1]);
	 		 			}
	 		 			else{
	 		 				$('#freightConventionalAddl').loadJSON(responseText.data.vehicleInfo);
	 		 			}
	 		 			if(responseText.data.vehicleInfo.weight!= null && responseText.data.vehicleInfo.weight!='' && responseText.data.vehicleInfo.weight!='0'
							 && responseText.data.cube!= null && responseText.data.cube!='' && responseText.data.cube!='0'){
		 		 			$('#weight').val(responseText.data.vehicleInfo.weight);
		 		 			$('#cube').val(responseText.data.cube);
							}
	 		 			$('#pieceCount').val(1);
	 		 			loadHazGrid();
	 		 			
	 		 			$('#msgDivFrt').hide();
	 		 			$('#msgDivFrt').html('');
	 		 		 }
	 		 		 else{
	 		 			// resetVinNumberDetails();
	 		 			if(!($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($('#customerGroupId :selected').text()==POV_NAME ||$('#customerGroupId :selected').text()==POV_NAME ))){
				    		if($('#unitOfMeasureSourceCode').val()=="M"){
				    			$("#freightWeightLbl").html("Wgt-Kgs");
				    		}
				    		else if($('#unitOfMeasureSourceCode').val()=="I"){
				    			$("#freightWeightLbl").html("Wgt-Lbs");
				    		}	
				    		
				    		if($('#bookingTypeCode').val()=='B'){
				    			$("#weight").removeClass("validate[required]");
				    		}
			    		}
	 		 			
						$('#msgDivFrt').show();
						$('#msgDivFrt').html('<div class="message_info">There is no detail available for the provided VIN.</div>');
	 		 		 }
	 		 }
	   });   
	}
	else if(vin.length==0){
		$('#msgDivFrt').hide();
		$('#msgDivFrt').html('');
		
		if(!($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($('#customerGroupId :selected').text()==POV_NAME ||$('#customerGroupId :selected').text()==ALASKA_POV_NAME ))){
    		if($('#unitOfMeasureSourceCode').val()=="M"){
    			$("#freightWeightLbl").html("Wgt-Kgs");
    		}
    		else if($('#unitOfMeasureSourceCode').val()=="I"){
    			$("#freightWeightLbl").html("Wgt-Lbs");
    		}	
    		
    		if($('#bookingTypeCode').val()=='B'){
	    			$("#weight").removeClass("validate[required]");
	    		}
		}
	}
	$(this).val(vin);
	// Setting to current vin no
	$("#lastUserProvidedVinNumber").val(vin);
 });

$('#unitOfMeasureSourceCode').change(function(){
	$('#msgDiv').html('');
	measurementUnitChangeConfirmation();
});

$("a.vinsightUnitIdUrl").click(function(){
	window.open($("a.vinsightUnitIdUrl").attr("href"));
});
    
$('#nextFreight').click(function(){
	if(freightModified){
		var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm to proceed!");
		if (isConfirm) {
			getFreight(parseInt($("#freightSeqNo").val()) + 1);
		}
	}
	else{
		getFreight(parseInt($("#freightSeqNo").val()) + 1);
	}
});   

$('#previousFreight').click(function(){
	if(freightModified){
		var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm to proceed!");
		if (isConfirm) {
			if($("#freightSeqNo").val()=='1'){
				getFreight($("#freightSeqNo").val());
			}
			else{
				getFreight(parseInt($("#freightSeqNo").val()) - 1);
			}
		}
	}
	else{
		if($("#freightSeqNo").val()=='1'){
			getFreight($("#freightSeqNo").val());
		}
		else{
			getFreight(parseInt($("#freightSeqNo").val()) - 1);
		}
	}
}); 

$('#addFreight').click(function(){
	if($.trim($('#loadDschServiceGroupCode').val())=="AU" && ( $.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME)){
		if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0' && parseInt($.trim($('#totalCommodityLines').text()))>=1){
			alert("Adding more than one commodity for customer group- POV is not allowed.");
			return;
		}
	}
	var dataUrl = _context +"/booking/freight/addFreight";
	addUpdateFreight(dataUrl,null);
});

$('#updateFreight').click(function(){
	var dataUrl = _context +"/booking/freight/updateFreight";
	addUpdateFreight(dataUrl,null);
});

$('#clearFreight').click(function(){
	//var tariff = $('#tariff').val();
	var freightSeqNo=$('#freightSeqNo').val();
	var bookingFreightId=$('#bookingFreightId').val();
	//resetMandatory();
	resetMandatoryTariffCmdDesc();
	resetMandatoryCmdDesc();
	clearFreight();
	setFirstVVD();
	loadNewFreight(freightSeqNo,bookingFreightId);
	//$('#tariff').val(tariff);
});

$('#deleteFreight').click(function(){
var confirmDelete = confirm('Do you want to delete commodity?');
if(confirmDelete){
	$.ajax({
		url: _context+'/booking/freight/deleteFreight?id='+$('#freightSeqNo').val()+ '&measurementSource='+$('#unitOfMeasureSourceCode').val(),
		success: function(responseText){
			if(responseText.success){
				clearFreight();
				if(responseText.data!=null){
					getFreightJSONresponse(responseText.data);
					populateCommodityLines(responseText.data.commodityLines, responseText.data.currentCommodityLine);
					enableDisableFreightButtons(responseText.data.commodityLines.length, responseText.data.freightSeqNo);
				    afterFreightLoadComplete($('#totalCommodityLines').text(), responseText.data.tariff, responseText.data.tariffItemNumber, responseText.data.commodityDescription, responseText.data.tariffCommodityDescription);
				}
				else{
					$('#freightSeqNo').val('');
					populateCommodityLines('', '');
					enableDisableFreightButtons(0, 0);
					afterFreightLoadComplete($('#totalCommodityLines').text(), '', '', '', '');
					loadFreightGrids();
				}
				if($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME )){
					setMandatoryPOV();
				}
				 isBookingChanged = "Y";
				$('#msgDivFrt').show();
				$('#msgDivFrt').html('<div class="message_info">Successfully deleted.</div>');
			}
		}
	});
}
});

$('#currentCommodityLine').change(function(){  
	if(freightModified){
		var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm to proceed!");
		if(isConfirm){
			getFreight($(this).val());
		}
	}
	else{
		getFreight($(this).val());
	}
});

$('#commodityHeader').click(function(){  
	if(!addFreightEnabled()){
		if($('#showAlertTCGLDSP').val()=="true"){
			addfreightEnabledAlertMessage();
			if($('#tariff').is(':visible'))
				$($('.booking-section')[4]).accordion('option', 'active', false);
			disableAccordian(4);
		}
		else{
			$('#showAlertTCGLDSP').val("true");
		}
	}
	//Added for Defect D027295
	else if (isCommodityDisplayOnly || isCommodityModifiable)
	{
		if(!iterated){
			iterated = true;
			var status = $($('.booking-section')[4]).accordion('option', 'active');
			if ((typeof status == "boolean" && !status) || (status=="0" && !$('#tariff').is(':visible'))) {
				$($('.booking-section')[4]).accordion("enable");
				$($('.booking-section')[4]).accordion('option', 'active', 0);
				
				showFreight($.trim($('#customerGroupId :selected').text()));
				//loadFreightGrids();
				
			}
		}
	}
});
$('#commodityHeader').keydown(function(event) {
	if(event.which==13) {
		jQuery(this).trigger('click');
	}
});
$('#commodityCode,#pieceCount,#pieceUnitOfMeasureCode,#weight,#cube,#commodityDescription,#freight\\.isOversize1,' + 
		//'#plannedArrivalDate,'+
		'#vehicleYear,#vehicleMake,#vehicleModel,#vehicleLicenseNumber,#vehicleLicenseStateCode,#vehicleColor,#description,#bkdVessel,#bkdVoyage,#bkdDirection,#recdVessel,#recdVoyage,#recdDirection,#specialInstruction').change(function(){ 
	freightModified = true;
	isBookingChanged = "Y";
});

$('#length,#feetLength,#inchesLength,#width,#feetWidth,#inchesWidth,#height,#feetHeight,#inchesHeight,').change(function(){ 
	freightModified = true;
	isBookingChanged = "Y";
	calculateCube();
});
	
//	D026264: 	FW: Maintain Booking - Error message with dims | booking - need to be able to enter inches greater than 11 and have system convert to feet and inches
$('#inchesLength').change(function() {
	var feets = $('#feetLength').val();
	var inches = $('#inchesLength').val();
	var extraFeets = getFeetFromInches(inches);
	var remInches = getModInches(inches);
	$('#feetLength').val(Number(feets) + Number(extraFeets));
	$('#inchesLength').val(remInches);
	$("#dimensionDiv").validationEngine('validate');
	calculateCube();
});

$('#inchesWidth').change(function() {
	var feets = $('#feetWidth').val();
	var inches = $('#inchesWidth').val();
	var extraFeets = getFeetFromInches(inches);
	var remInches = getModInches(inches);
	$('#feetWidth').val(Number(feets) + Number(extraFeets));
	$('#inchesWidth').val(remInches);
	$("#dimensionDiv").validationEngine('validate');
	calculateCube();
});

$('#inchesHeight').change(function() {
	var feets = $('#feetHeight').val();
	var inches = $('#inchesHeight').val();
	var extraFeets = getFeetFromInches(inches);
	var remInches = getModInches(inches);
	$('#feetHeight').val(Number(feets) + Number(extraFeets));
	$('#inchesHeight').val(remInches);
	$("#dimensionDiv").validationEngine('validate');
	calculateCube();
});

populateCountryPhoneCodes();

enableDisableNote();
/*
$('#commodityDescription').bind('paste', function(event){
	var pastedText = undefined;
	  if (window.clipboardData && window.clipboardData.getData) { // IE
	    pastedText = window.clipboardData.getData('Text');
	  } else if (e.clipboardData && e.clipboardData.getData) {
	    pastedText = e.clipboardData.getData('text/plain');
	  }
	setTimeout(function(){
		wrapTextArea('commodityDescription', 30);
		}, 250);
	return true;
});

$('#commodityDescription').live('keyup', function(evt){
	
	var keyCode = evt.keyCode;
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
        //alert("Line Length exceeded 20 characters");
        //evt.preventDefault(); // prevent characters from appearing
		wrapTextArea('commodityDescription', 30);
	}
	return true;
});*/
	
	$('#commodityDescription').blur(function(event){
		$('#commodityDescription').val(($('#commodityDescription').val()).toUpperCase()); 
	splitCommodity();
		return true;
	});

});

function measurementUnitChangeConfirmation(){
	var isConfirm = confirm("Measurement System is being changed. Press Ok to confirm!");
	if (!isConfirm){
		if($('#unitOfMeasureSourceCode :selected').val()=="I"){
			$('#unitOfMeasureSourceCode').val("M");
		}
		else if($('#unitOfMeasureSourceCode :selected').val()=="M"){
			$('#unitOfMeasureSourceCode').val("I");
		}
		return;
	}
	else{
		measurementUnitChange();
	}
}

function measurementUnitChange(){
	setCubeWeightLengthWidthHeight($('#unitOfMeasureSourceCode').val());
	$.ajax({
		url: _context+'/booking/freight/convertFreightDimensions?measurementSource='+$('#unitOfMeasureSourceCode').val()+'&freightSeqNo='+$('#freightSeqNo').val()+'&length='+$('#length').val()+'&width='+$('#width').val()+'&height='+$('#height').val()+'&feetLength='+$('#feetLength').val()+'&inchesLength='+$('#inchesLength').val()+'&feetWidth='+$('#feetWidth').val()+'&inchesWidth='+$('#inchesWidth').val()+'&feetHeight='+$('#feetHeight').val()+'&inchesHeight='+$('#inchesHeight').val()+'&cube='+$('#cube').val()+'&weight='+$('#weight').val(),
		success: function(responseText){
			if(responseText.success){
				if($('#unitOfMeasureSourceCode').val()=="I"){
	 				$('#feetLength').val(responseText.data.feetLength);
 		    		$('#inchesLength').val(responseText.data.inchesLength);
	 				
 		    		$('#feetWidth').val(responseText.data.feetWidth);
 		    		$('#inchesWidth').val(responseText.data.inchesWidth);
 		    		
 		    		$('#feetHeight').val(responseText.data.feetHeight);
 		    		$('#inchesHeight').val(responseText.data.inchesHeight);
 		 		}
	 			else if($('#unitOfMeasureSourceCode').val()=="M"){
	 				$('#length').val(responseText.data.length);
 		    		$('#width').val(responseText.data.width);
 		    		$('#height').val(responseText.data.height);
	 			}
				
				$('#weight').val(responseText.data.weight);
				$('#cube').val(responseText.data.cube);
			}
		}
	
	});
}

// Set Cube & Weight according to Measurement Source
function setCubeWeightLengthWidthHeight(measurementSource){
	switch(measurementSource){
        case "M": 
        	$("#freightWeightLbl").html("Wgt-Kgs");
    		$("#freightCubeLbl").html("Cubic Mt");
    		$('#length').show();
    		$('#feetLengthLbl').hide();
    		$('#feetLength').hide();
    		$('#inchesLengthLbl').hide();
    		$('#inchesLength').hide();
    		
    		$('#width').show();
    		$('#feetWidthLbl').hide();
    		$('#feetWidth').hide();
    		$('#inchesWidthLbl').hide();
    		$('#inchesWidth').hide();
    		
    		$('#height').show();
    		$('#feetHeightLbl').hide();
    		$('#feetHeight').hide();
    		$('#inchesHeightLbl').hide();
    		$('#inchesHeight').hide();
    		
        break;
        case "I": 
        	$("#freightWeightLbl").html("Wgt-Lbs");
    		$("#freightCubeLbl").html("Cubic Ft");
    		
    		$('#length').hide();
    		$('#feetLengthLbl').show();
    		$('#feetLength').show();
    		$('#inchesLengthLbl').show();
    		$('#inchesLength').show();
    		
    		$('#width').hide();
    		$('#feetWidthLbl').show();
    		$('#feetWidth').show();
    		$('#inchesWidthLbl').show();
    		$('#inchesWidth').show();
    		
    		$('#height').hide();
    		$('#feetHeightLbl').show();
    		$('#feetHeight').show();
    		$('#inchesHeightLbl').show();
    		$('#inchesHeight').show();
        break;
    }
}

// Containerized
function showContainerized(){
	$('#freightEquipment').show();
	$('#freightConventionalAddl').show();
	$('#bookingAuto').hide();
	$('#freightHaz').show();
	$('#freightMBU').hide();
}

// POV
function showPOV(){
	$('#freightEquipment').hide();
	$('#freightConventionalAddl').show();
	$('#bookingAuto').show();
	$('#freightHaz').show();
	$('#freightMBU').hide();
}

// Conventional
function showConventional(){
	$('#freightEquipment').show();
	$('#freightConventionalAddl').show();
	$('#bookingAuto').show();
	$('#freightHaz').show();
	$('#freightMBU').hide();
}

// Conventional- Commercial Auto
function showConventionalCommercialAuto(){
	$('#freightEquipment').hide();
	$('#freightConventionalAddl').show();
	$('#bookingAuto').hide();
	$('#freightHaz').show();
	$('#freightMBU').hide();
}

// Conventional- MBU
function showConventionalMBU(){
	$('#freightEquipment').show();
	$('#freightConventionalAddl').show();
	$('#bookingAuto').hide();
	$('#freightHaz').show();
	$('#freightMBU').show();
}

// Setting mandatory fields for Tariff Commodity Description
function setMandatoryCmdDesc(){
	$("#commodityDescription").addClass("validate[required]");
}

function resetMandatoryCmdDesc(){
	$("#commodityDescription").removeClass("validate[required]");
}

function setMandatoryTariffCmdDesc(){
	// Tariff Commodity Desc
	$("#tariffCmdDescLbl").html("Commodity Desc<span class=\"mandatory\">*</span>");
	$("#tariffCommodityDescription").addClass("validate[required]");
	
	setMandatoryTariffItem();
	
	// Commodity Code
	$("#commodityCodeLbl").html("Com. Code<span class=\"mandatory\">*</span>");
	$("#commodityCode").addClass("validate[required]");
}

function resetMandatoryTariffCmdDesc(){
	// Tariff Commodity Desc
	$("#tariffCmdDescLbl").html("Commodity Desc");
	$("#tariffCommodityDescription").removeClass("validate[required]");
	
	resetMandatoryTariffItem();
	
	// Commodity Code
	$("#commodityCodeLbl").html("Com. Code");
	$("#commodityCode").removeClass("validate[required]");
}

function setMandatoryTariffItem(){
	// Tariff
	if($("#isAutobill").val()=="true"){
		$("#tariffLbl").html("Tariff<span class=\"mandatory\">*</span>");
		$("#tariff").addClass("validate[required]");
		
		// Item
		$("#itemLbl").html("Item<span class=\"mandatory\">*</span>");
		$("#tariffItemNumber").addClass("validate[required]");
	}
}

function resetMandatoryTariffItem(){
	// Tariff
	$("#tariffLbl").html("Tariff");
	$("#tariff").removeClass("validate[required]");
	
	// Item
	$("#itemLbl").html("Item");
	$("#tariffItemNumber").removeClass("validate[required]");
}

function setMandatoryPOV(){
	$("#freightWeightLbl").html($("#freightWeightLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vinNumberLbl").html($("#vinNumberLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleYearLbl").html($("#vehicleYearLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleMakeLbl").html($("#vehicleMakeLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleModelLbl").html($("#vehicleModelLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleLicenseNumberLbl").html($("#vehicleLicenseNumberLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleLicenseStateCodeLbl").html($("#vehicleLicenseStateCodeLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#vehicleColorLbl").html($("#vehicleColorLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#estimatedDropOffDateLbl").html($("#estimatedDropOffDateLbl").text()+"<span class=\"mandatory\">*</span>");
	
	$("#weight").addClass("validate[required]");
	$("#vinNumber").addClass("validate[required]");
	$("#vehicleYear").addClass("validate[required]");
	$("#vehicleMake").addClass("validate[required]");
	$("#vehicleModel").addClass("validate[required]");
	$("#vehicleLicenseNumber").addClass("validate[required]");
	$("#vehicleLicenseStateCode").addClass("validate[required]");
	$("#vehicleColor").addClass("validate[required]");
	//$("#estimatedDropOffDate").removeClass("validate[funcCall[validateAutoEstDropOffDate1]]");
	//$("#estimatedDropOffDate").addClass("validate[required,funcCall[validateAutoEstDropOffDate1]]");
}

function resetMandatoryPOV(){
	// Weight
	if($('#unitOfMeasureSourceCode').val()=="M"){
		$("#freightWeightLbl").html("Wgt-Kgs");
	}
	else if($('#unitOfMeasureSourceCode').val()=="I"){
		$("#freightWeightLbl").html("Wgt-Lbs");
	}	
	
	$("#vinNumberLbl").html("VIN");
	$("#vehicleYearLbl").html("Year");
	$("#vehicleMakeLbl").html("Make");
	$("#vehicleModelLbl").html("Model");
	$("#vehicleLicenseNumberLbl").html("LIC #");
	$("#vehicleLicenseStateCodeLbl").html("State");
	$("#vehicleColorLbl").html("Color");
	$("#estimatedDropOffDateLbl").html("Est Drop Off");	
	
	$("#weight").removeClass("validate[required]");
	$("#vinNumber").removeClass("validate[required]");
	$("#vehicleYear").removeClass("validate[required]");
	$("#vehicleMake").removeClass("validate[required]");
	$("#vehicleModel").removeClass("validate[required]");
	$("#vehicleLicenseNumber").removeClass("validate[required]");
	$("#vehicleLicenseStateCode").removeClass("validate[required]");
	$("#vehicleColor").removeClass("validate[required]");
	//$("#estimatedDropOffDate").removeClass("validate[required,funcCall[validateAutoEstDropOffDate1]]");
	//$("#estimatedDropOffDate").addClass("validate[funcCall[validateAutoEstDropOffDate1]]");
}

function resetMandatoryCustDesc(){
	// Customer Commodity Description
	$("#commodityDescription").removeClass("validate[required]");
}

function resetMandatory(){
	 resetMandatoryTariffCmdDesc();
	 resetMandatoryPOV();
	 resetMandatoryCustDesc();
	 resetPiecesMandatory();
	 clearErrMsg();
	 // Reset last user provided VinNumber
	 $("#lastUserProvidedVinNumber").val("");
}

function clearErrMsg(){
	$("#freightForm").validationEngine('hideAll');
}


function formatWeight(cellvalue, options, rowObject){
	// alert("cellvalue: " + cellvalue);
	if(cellvalue!=null && !isNaN(cellvalue)){
		var measurementSource = $('#unitOfMeasureSourceCode').val();
		if(measurementSource=="I"){
			cellvalue = parseFloat(cellvalue).toFixed(0);
		}
		else if(measurementSource=="M"){
			var regExp = /^([0-9]{0,7}\.{1}[0-9]{3,})$/;
			// alert(reg1.test(cellvalue));
			if(regExp.test(cellvalue)){
				cellvalue = parseFloat(cellvalue).toFixed(3);
			}
		}
	}
	else{
		cellvalue="";
	}

return cellvalue;
}

function formatCube(cellvalue, options, rowObject){
	// alert("cellvalue: " + cellvalue);
	if(cellvalue!=null && !isNaN(cellvalue)){
		var measurementSource = $('#unitOfMeasureSourceCode').val();
		if(measurementSource=="I"){
			cellvalue = parseFloat(cellvalue).toFixed(0);
		}
		else if(measurementSource=="M"){
			var regExp = /^([0-9]{0,6}\.{1}[0-9]{4,})$/;
			// alert(reg1.test(cellvalue));
			if(regExp.test(cellvalue)){
				cellvalue = parseFloat(cellvalue).toFixed(3);
			}
		}
	}
	else{
		cellvalue="";
	}

return cellvalue;
}

function commPopupSearch() {
	var dscr = $("#tariffCommodityDescription").val();
	var tariffNo = $("#tariff").val();
	var itemNo = $("#tariffItemNumber").val();
	var trade = $("#tradeCode").val();
	var loadSrvc = $("#loadServiceCode").val();
	var dischargeSrvc = $("#dischargeServiceCode").val();
	
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; // January is 0!
	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd;
	} 
	if(mm<10){
		mm='0'+mm;
	} 
	var today = mm+'-'+dd+'-'+yyyy;
	var estShipDate = today;
	var blOriginCityCode = $('#blOriginCityCode').val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var blDestinationCityCode = $('#blDestinationCityCode').val();
	
	var actionUrl = _context+'/cas/searchCommodityLookup.do?filterValue1=' +encodeURIComponent(dscr + '|' + tariffNo + '|' + itemNo + '|' + trade +
			'|' + loadSrvc + '|' + dischargeSrvc + '|' + estShipDate + '|' + blOriginCityCode + '|' + originPortCityCode + 
			'|' + destinationPortCityCode + '|' + blDestinationCityCode);
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);		
}

function commodityUpdate(id){
	var values = id.split("|");
	if(values[1] != null && values[1] == "**NPC**"){
		alert("NO PRIMARY COMMODITY FOUND");
	}else{
		// D026883
		if($("#tariffCommodityDescription").val() != values[1]) 
		{
			isBookingChanged = 'Y';
		} 
		
		$("#tariffCommodityDescription").val(values[1]);
		$("#tariffCommodityDescriptionHidden").val(values[1]);	
	}
	
	if($("#tariff").val() != values[3]) {isBookingChanged = 'Y'}
	$("#tariff").val(values[3]);
	
	if($("#frtGrpId").val() != values[10]) {isBookingChanged = 'Y';}
	$("#frtGrpId").val(values[10]);
	
	//D029181

	$('#tariffCheck').val(values[3]);		
	
	
	if($("#tariffItemNumber").val() != values[4]) {isBookingChanged = 'Y';}
	$("#tariffItemNumber").val(values[4]);
	
	if($("#frtItemId").val() != values[11]) {isBookingChanged = 'Y';}
	$("#frtItemId").val(values[11]);
	
	var primaryTariffItemCmdtyDescId = values[9];
	getCommodityCodes(primaryTariffItemCmdtyDescId, true);
	
	var secondaryTariffItemCmdtyDescId = values[12];
	if(primaryTariffItemCmdtyDescId!=secondaryTariffItemCmdtyDescId){
		$('#tariffItemCmdtyDescId').val(secondaryTariffItemCmdtyDescId);
	}
	
	$("#primaryFreightPresent").val("Y");
	setMandatoryTariffCmdDesc();
	resetMandatoryCustDesc();
	$('#commodityDescription').validationEngine('hidePrompt');
	
	// Reset message div- msgDivFrt
	$('#msgDivFrt').html("");
	$('#msgDivFrt').hide();
}

function getCommodityCodes(tariffItemCmdtyDescId, asyncCall){
	if (tariffItemCmdtyDescId!=null && tariffItemCmdtyDescId!=''){
		if (asyncCall) blockUI();
		$('#tariffItemCmdtyDescId').val(tariffItemCmdtyDescId);
		
		function callBack(responseText) { // cheetah
			if(responseText.success){
				populateCommodityCodeList(responseText.data);
			}
			if(asyncCall){
				$.unblockUI();
			}			
		}		
		var frtItemId = $('#frtItemId').val();
		getCommodityCodesRequest(callBack, asyncCall, tariffItemCmdtyDescId, frtItemId);
	}
}

function getCommodityCodesRequest(callBack, asyncCall, _tariffItemCmdtyDescId, _frtItemId) { // cheetah
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var tariffItemCmdtyDescId = ('tariffItemCmdtyDescId' in bookingInitData) ? bookingInitData.tariffItemCmdtyDescId : '';
	var frtItemId = ('frtItemId' in bookingInitData) ? bookingInitData.frtItemId : '';
	var commodityCodes = ('getCommodityCodes' in bookingInitData) ? bookingInitData.getCommodityCodes : {};
	console.log('Cheetah: getCommodityCodesRequest: ' + tariffItemCmdtyDescId + ' || ' + _tariffItemCmdtyDescId + ' && ' + frtItemId + ' || ' + _frtItemId);
	if (tariffItemCmdtyDescId == _tariffItemCmdtyDescId && frtItemId == _frtItemId)  {
		console.log('Cheetah: getCommodityCodesRequest from cache');
		callBack(commodityCodes);
		return;
	}
	console.log('Cheetah: getCommodityCodesRequest from Ajax');
	$.ajax({
		url: _context+'/booking/freight/getCommodityCodes',
		data: {commodityDescId:_tariffItemCmdtyDescId, frtItemId: _frtItemId},
		async: asyncCall,
		success: callBack
	});
}

function notePopupSearch() {
	var tariffNo = $("#tariff").val();
	var itemNo = $("#tariffItemNumber").val();
	// Need to set it
	var estShipDate = $('#estShip').text();
	if(estShipDate == null || estShipDate == ''){//D032739
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; // January is 0!
		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		var today = mm+'-'+dd+'-'+yyyy;
		estShipDate = today;
	}
	/*if($("#vvdRoutingGrid").getGridParam("reccount")>0){
		var rowData = jQuery("#vvdRoutingGrid").getRowData("1");
		estShipDate = rowData.sailDate;
	}*/
	var trade = $("#tradeCode").val();
	var loadSrvc = $("#loadServiceCode").val();
	var dischargeSrvc = $("#dischargeServiceCode").val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var eqType = "";
	var eqLength= "";
	var eqHeight= "";
	var origin = $('#blOriginCityCode').val();
	var destination = $('#blDestinationCityCode').val();
	//alert('shipment date ' + estShipDate);
	var actionUrl = _context+'/cas/searchNoteNoLookup.do?filterValue1=' + tariffNo + '|' + itemNo + '|' + estShipDate + '|' + eqType + 
		'|' + eqLength + '|' + eqHeight + '|' + origin + '|' + destination +
		'|' + originPortCityCode + '|' + destinationPortCityCode + '|' + loadSrvc + '|' + dischargeSrvc + '|' + trade ;
		;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'NoteSearch', windowStyle);
}

function noteNoUpdate(id){
	var values= id.split("|");
	$("#tariffItemNoteNumber").val(values[0]);
}

function populateCommodityCodeList(list){
	$('select#commodityCode').children().remove().end().append('<option selected value="">Select</option>');
	if(list != null)
	{
		for ( var i = 0; i < list.length; i++) {
			$('select#commodityCode').append($("<option/>", {
				value : list[i].code,
				text : list[i].code + " - " +list[i].description
			}));
		}
		
		if(list.length==1){
			$('#commodityCode').val($.trim(list[0].code));
		}
	}
}

function clearCommodityCodeList(){
	$('#tariffItemCmdtyDescId').val(null);
	$('#commodityCode option').remove();
	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
}

function enableDisableNextPreviousButtons(rowCount, freightSeqNo){
	if(rowCount==0 || rowCount==1){
		// alert("1");
		$('#previousFreight').attr('disabled','disabled');
		$('#nextFreight').attr('disabled','disabled');
	}
	else if(freightSeqNo==1 && rowCount > freightSeqNo){
		// alert("2");
		$('#previousFreight').attr('disabled','disabled');
		$('#nextFreight').removeAttr('disabled');
	}
	else if(freightSeqNo>1 && rowCount!=freightSeqNo){
		// alert("3");
		$('#previousFreight').removeAttr('disabled');
		$('#nextFreight').removeAttr('disabled');
	}
	else if(rowCount==freightSeqNo){
		// alert("4");
		$('#previousFreight').removeAttr('disabled');
		$('#nextFreight').attr('disabled','disabled');
	}
	// TODO: to be replaced when save will validate all validations
	/*
	 * if(rowCount == 0 || rowCount == 1){ $('#previousFreight').attr({style:
	 * 'visibility : hidden'}); $('#nextFreight').attr({style: 'visibility :
	 * hidden'}); } else if(freightSeqNo==1 && rowCount > freightSeqNo){
	 * $('#previousFreight').attr({style: 'visibility : visible'});
	 * $('#previousFreight').attr('disabled', true);
	 * $('#nextFreight').attr({style: 'visibility : visible'});
	 * $('#nextFreight').attr('disabled', false); } else if(freightSeqNo>1 &&
	 * rowCount!=freightSeqNo){ $('#previousFreight').attr({style: 'visibility :
	 * visible'}); $('#previousFreight').attr('disabled', false);
	 * $('#nextFreight').attr({style: 'visibility : visible'});
	 * $('#nextFreight').attr('disabled', false); } else
	 * if(rowCount==freightSeqNo){ $('#previousFreight').attr({style:
	 * 'visibility : visible'}); $('#previousFreight').attr('disabled', false);
	 * $('#nextFreight').attr({style: 'visibility : visible'});
	 * $('#nextFreight').attr('disabled', true); }
	 */
}

function validateTrfCmdDesc(){
	if($.trim($('#tariffCommodityDescription').val())==''){
		$('#tariffCommodityDescription').val($.trim($('#tariffCommodityDescription').val()));
	}
	else if($("#tariffCommodityDescription").val().length > 30) {
		 return "* Commodity Desc can't be more than 30. At present, the length is "+ $("#tariffCommodityDescription").val().length +".";
	}
}

function validateTariff(){
	 if($("#tariff").val().length > 6) {
		 return "* Tariff can't be more than 6 in length. At present, the length is "+ $("#tariff").val().length + ".";
	}
}

function validateItem(){
	 if($("#tariffItemNumber").val().length > 8) {
		 return "* Tariff Item can't be more than 8 in length. At present, the length is "+ $("#tariffItemNumber").val().length + ".";
	}
}

function validateNote(){
	if($.trim($('#tariffItemNoteNumber').val())==''){
		$('#tariffItemNoteNumber').val($.trim($('#tariffItemNoteNumber').val()));
		$('#msgDivFrt').html("");
		$('#msgDivFrt').hide();
	}
}

/*
 * function validateCommodityDesc(){
 * if($.trim($('#commodityDescription').val())==''){
 * $('#commodityDescription').val($.trim($('#commodityDescription').val())); }
 * else if($('#commodityDescription').val().length > 30) { return "* Customer
 * Commodity Description can't be more than 30 in length. At present, the length
 * is "+ $('#commodityDescription').val().length +"."; } }
 */

/*function validateCommodityDesc(){
	if($.trim($('#commodityDescription').val())==''){
		$('#commodityDescription').val($.trim($('#commodityDescription').val()));
	} else {
		lines = $('#commodityDescription').val().split("\n");
		var isError = false;
		var errorMsg = '';
		for(var i = 0; i <lines.length; i++) {
			if(lines[i].length > 30) {
				errorMsg = "* Customer Commodity Description cannot have more than 30 characters in one line. At present, the length is " + lines[i].length + " at line no." + (i + 1);
				isError = true;
				break;
			}
		}
		if(isError) {
			return errorMsg;
		}
	}
}*/

function validateWeight(){
	var reg7Number3DecimalPlaces = /^[0-9]{0,7}(\.[0-9]{1,3})?$/;
	var reg7Number = /^[0-9]{1,7}$/;
	
	if($.trim($("#weight").val())==''){
		$("#weight").val(($.trim($("#weight").val())));
	}
	else{
		 //pov
		 //D029596: MAINTAIN BKG: WEIGHT = ZERO ALLOWED TO BE SAVED
		 //if($('#bookingTypeCode').val()=="B" && $.trim($('#loadDschServiceGroupCode').val())=="AU" && $.trim($('#customerGroupId :selected').text())==POV_NAME) {
		 //}
		 switch($('#unitOfMeasureSourceCode').val()){
	         case "M": 
	        	 if(!reg7Number3DecimalPlaces.test($("#weight").val())) {
	        		 return "* Only 7 numbers before decimal and 3 numbers after decimal are allowed. No blank spaces allowed.";
	        	}
	         break;
	         case "I": 
	        	 if(!reg7Number.test($("#weight").val())) {
	        		 return "* Max 7 numbers are allowed. * No blank spaces allowed.";
	        	}
	         break;
	     }
	     //D029724: 	Prod Maintain Booking : Error: Zero is not a valid weight 
		$("#weight").val(parseFloat($("#weight").val()));
		if($('#bookingTypeCode').val()=="B" && $("#weight").val()==0){
			$("#weight").val('');
		}
	}
}

function validateCube(){
	var reg6Number4DecimalPlaces = /^[0-9]{0,6}(\.[0-9]{1,4})?$/;
	var reg8Number = /^[0-9]{1,8}$/;
	
	if($.trim($("#cube").val())==''){
		$("#cube").val(($.trim($("#cube").val())));
	}
	else{
		 switch($('#unitOfMeasureSourceCode').val())
	     {
	         case "M": 
	        	 if(!reg6Number4DecimalPlaces.test($("#cube").val())) {
	        		 return "* Only 6 numbers before decimal and 4 numbers after decimal are allowed. No blank spaces allowed.";
	        	}
	        	 else{
	        		 var reg4DecimalPlaces = /^\d+(?:\.\d{4})?$/;
	        		 
	        		 if(reg4DecimalPlaces.test($("#cube").val())) {
	        			 $("#cube").val(Math.round(parseFloat($("#cube").val())*Math.pow(10,3))/Math.pow(10,3));
	            	}
	        	 }
	        	 
	         break;
	         case "I": 
	        	 if(!reg8Number.test($("#cube").val())) {
	        		 return "* Max 8 numbers are allowed. * No blank spaces allowed.";
	        	}
	         break;
	     }
	}
}

function validateLengthWidthHeight(field, rules, i, options){
	var fieldName = field.attr("name");
	var reg3Number3DecimalPlaces = /^[0-9]{0,3}(\.[0-9]{1,3})?$/;
	var reg3Number = /^[0-9]{1,3}$/;
	var reg5Number = /^([0-9]{1,5})$/;
	if($.trim(field.val())==''){
		field.val($.trim(field.val()));
	}
	else{
        if($.trim($('#unitOfMeasureSourceCode').val())=="M"){
        	if(!reg3Number3DecimalPlaces.test(field.val())) {
	       		return "* Max 3 numbers and 3 decimal places are allowed. * No blank spaces allowed.";
	       	}
        } 
        else if($.trim($('#unitOfMeasureSourceCode').val())=="I"){
        	if(fieldName=='freight.feetLength' || fieldName=='freight.feetWidth' || fieldName=='freight.feetHeight'){
        		if(!reg3Number.test(field.val())) {
    	       		return "* Max 3 numbers are allowed. * No blank spaces allowed.";
    	       	}
        	}
        	else if(fieldName=='freight.inchesLength' || fieldName=='freight.inchesWidth' || fieldName=='freight.inchesHeight'){
        		if(!reg5Number.test(field.val()) || field.val()<0 ) {
    	       		return "* Numbers only. * No blank spaces allowed.";
    	       	}
        	}
        }
	}
}

function validatePieces(){
	var pcs = $.trim($('#pieceCount').val());
	/*
	 * if(pcs==''){ $('#pieceCount').val("0"); } else
	 */if(pcs=='' || pcs==0){
		if($('#freight\\.isRoRo1').is(':checked')==true){
				return "* Pieces count must be greater than zero for Rolling Stock.";
		}
		else if($('#bookingTypeCode').val()=='B' && $('#customerGroupId :selected').text()==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL' )&& $('#isAllowBookingUnit').val()=="Y"){
			return "* Pieces count must be greater than zero.";
		}
	}
	else if(pcs>999999){
		return "* Pieces count can't be greater than 999999. Decrease the no by "+(parseInt(pcs) - parseInt(999999));
	}
	else if(/^[\S]+$/.test(pcs)){
		$('#pieceCount').val(pcs);
	}
}

function validateKind(){
	if($.trim($('#pieceUnitOfMeasureCode').val())==''){
		$('#pieceUnitOfMeasureCode').val($.trim($('#pieceUnitOfMeasureCode').val()));
	}
	else if($('#pieceUnitOfMeasureCode').val().length>4){
		return "* Kind can't be more than 4 in length. The current length is "+ $('#pieceUnitOfMeasureCode').val().length + ".";
	}
}

function validateVinNumber(){
	if($('#vinNumber').val().length>17){
		return "* Vin Number can't be more than 17 in length. The current length is "+ $('#vinNumber').val().length + ".";
	}
}

function validateAutoYear(){
	if($.trim($('#vehicleYear').val())==''){
		$('#vehicleYear').val($.trim($('#vehicleYear').val()));
	}
	else if($('#vehicleYear').val().length>4){
		return "* Year can't be more than 4 in length. The current length is "+ $('#vehicleYear').val().length + ".";
	}
}

function validateAutoMake(){
	if($.trim($('#vehicleMake').val())==''){
		$('#vehicleMake').val($.trim($('#vehicleMake').val()));
	}
	else if($('#vehicleMake').val().length>20){
		return "* Make can't be more than 20 in length. The current length is "+ $('#vehicleMake').val().length + ".";
	}
}

function validateAutoModel(){
	if($.trim($('#vehicleModel').val())==''){
		$('#vehicleModel').val($.trim($('#vehicleModel').val()));
	}
	else if($('#vehicleModel').val().length>20){
		return "* Model can't be more than 20 in length. The current length is "+ $('#vehicleModel').val().length + ".";
	}
}

function validateAutoLicNo(){
	if($.trim($('#vehicleLicenseNumber').val())==''){
		$('#vehicleLicenseNumber').val($.trim($('#vehicleLicenseNumber').val()));
	}
	else if($('#vehicleLicenseNumber').val().length>10){
		return "* LIC # can't be more than 10 in length. The current length is "+ $('#vehicleLicenseNumber').val().length + ".";
	}
}

function validateAutoColor(){
	if($.trim($('#vehicleColor').val())==''){
		$('#vehicleColor').val($.trim($('#vehicleColor').val()));
	}
	else if($('#vehicleColor').val().length>20){
		return "* Color can't be more than 10 in length. The current length is "+ $('#vehicleColor').val().length + ".";
	}
}

function validateAutoDesc(){
	if($.trim($('#vehicleDescription').val())==''){
		$('#vehicleDescription').val($.trim($('#vehicleDescription').val()));
	}
	else if($('#vehicleDescription').val().length>25){
		return "* Description can't be more than 25 in length. The current length is "+ $('#vehicleDescription').val().length + ".";
	}
}

function validateAutoEstDropOffDate(){
	if($('#bookingTypeCode').val()=='B'){
		if($('#estimatedDropOffDate').val()==undefined || $('#estimatedDropOffDate').val()==null || $('#estimatedDropOffDate').val()=='')
		{
			if($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($('#customerGroupId :selected').text()==POV_NAME ||$('#customerGroupId :selected').text()==ALASKA_POV_NAME))
			{
				$('#estimatedDropOffDate').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
				return false;
			}
			else{
				return true;
			}
		}
		else
		{
			var fullDate = new Date();
			// convert month to 2 digits
			var twoDigitMonth = ((fullDate.getMonth()+1) < 10)? '0' + (fullDate.getMonth()+1) : (fullDate.getMonth()+1); 
			var twoDigitDate = ((fullDate.getDate()) < 10)? '0' + (fullDate.getDate()) : (fullDate.getDate());
			// mm-dd-yy
			var currentDate = twoDigitMonth + "-" + twoDigitDate + "-" + fullDate.getFullYear(); 
			if(!validateDate('estimatedDropOffDate', false)){
				$('#estimatedDropOffDate').validationEngine('showPrompt', '* Enter date in Format (mm-dd-yyyy)', 'error', 'topRight', true);
				return false;
			}
			else if(estimatedDropOffDateModified && new Date($('#estimatedDropOffDate').val()).getTime() < new Date(currentDate).getTime()){
				$('#estimatedDropOffDate').validationEngine('showPrompt', '* Est drop off date can not be less than current date.', 'error', 'topRight', true);
				return false;
			}
			else{
				return true;
			}
		}
	}
	else{
		return true;
	}
}

function validateAutoEstDropOffDate1(){
	if($('#bookingTypeCode').val()=='B' && $('#estimatedDropOffDate').val()!='undefined' && $('#estimatedDropOffDate').val()!=null && $('#estimatedDropOffDate').val()!=''){
		var fullDate = new Date();
		// convert month to 2 digits
		var twoDigitMonth = ((fullDate.getMonth()+1) < 10)? '0' + (fullDate.getMonth()+1) : (fullDate.getMonth()+1); 
		var twoDigitDate = ((fullDate.getDate()) < 10)? '0' + (fullDate.getDate()) : (fullDate.getDate());
		// mm-dd-yy
		var currentDate = twoDigitMonth + "-" + twoDigitDate + "-" + fullDate.getFullYear(); 
		if(!validateDate('estimatedDropOffDate', false)){
			return '* Enter date in Format (mm-dd-yyyy)';
		}
		else if(estimatedDropOffDateModified && new Date($('#estimatedDropOffDate').val()).getTime() < new Date(currentDate).getTime()){
			return '* Est drop off date can not be less than current date.';
		}
	}
}

function validateAutoSplInstrcs(){
	if($.trim($('#specialInstruction').val())==''){
		$('#specialInstruction').val($.trim($('#specialInstruction').val()));
	}
	else if($('#specialInstruction').val().length>50){
		return "* Special Instructions can't be more than 50 in length. The current length is "+ $('#specialInstruction').val().length + ".";
	}
}

function saveFreight(dataUrl, ratingAttrChangeConfirmed,isSaveBooking){
	$.ajax({
		type: "POST",
		url: dataUrl,
		data: serializeFreight() + "&measurementSource=" + $('#unitOfMeasureSourceCode').val() +"&customerGroup="+$('#customerGroupId :selected').text()+"&ratingAttrChangeConfirmed="+ratingAttrChangeConfirmed+"&trade="+$('#tradeCode').val()+"&loadServiceCode="+$("#loadServiceCode").val()+"&dischargeServiceCode="+$("#dischargeServiceCode").val()+"&blOriginCityCode="+$('#blOriginCityCode').val()+"&originPortCityCode="+$('#originPortCityCode').val()+"&destinationPortCityCode="+$('#destinationPortCityCode').val()+"&blDestinationCityCode="+$('#blDestinationCityCode').val(),
		success: function(responseText){
			var showMsgDivFrt = true;
			if(responseText.success){
				if(dataUrl.search('addFreight')>0){
					if(isSaveBooking==null){
						$('#msgDivFrt').html('<div class="message_info">Successfully Added.</div>');
					}
					$('#freightSeqNo').val(responseText.data.freightSeqNo);
					populateCommodityLines(responseText.data.commodityLines, responseText.data.currentCommodityLine);
					loadHazGrid();
					enableDisableFreightButtons(responseText.data.commodityLines.length, responseText.data.freightSeqNo);
				}
				else if(dataUrl.search('updateFreight')>0){
					if($('div.message_error', '#msgDivFrt').is(':visible')){
						showMsgDivFrt = false;
						$('#msgDivFrt').hide();
					}
					if(isSaveBooking==null){
						$('#msgDivFrt').html('<div class="message_info">Successfully Updated.</div>');
					}
				}
				afterFreightLoadComplete(responseText.data.commodityLines.length, responseText.data.tariff, responseText.data.tariffItemNumber, responseText.data.commodityDescription, responseText.data.tariffCommodityDescription);
				isBookingChanged = "Y";
				enableEquipmentAddDelete();
				equipmentUpdated = false;
				freightModified = false;
				$('#tariff').focus();
				
				// Changes vvd in routing to selected vvd by user in vehicle
				changeVVD($("#bookedForVVDSeqNo").val());
				// Calling save booking after freight save
				if(isSaveBooking==true){
					checkRatingAttributes();
					//saveBooking();
				}
				loadTCNGrid();
				//changed for D025138
				loadEquipmentGrid();
			}
			else{
				$.unblockUI();
				if(isSaveBooking==true){
					$('#bookingSave').attr("disabled", false);
				}
				var messages = responseText.messages;
				var messageContent = '';
				if (messages.error.length > 0) {
					var array = messages.error;
					for (var i=0; i<messages.error.length; i++) {
						messageContent = array[i];
						if(messageContent=='Validation error(s) in equipment lines.'){
							showMsgDivFrt = false;
							if(!$('#equipmentGrid').is(':visible')){
								$(".HeaderButton", ("#gview_equipmentGrid")).click();
							}
							waitForEquipmentToLoadRows();
						}
					}
				}
		    		
				scrollToCommodity();
				if(showMsgDivFrt){
					
					$('#msgDivFrt').show();
					showResponseMessages('msgDivFrt', responseText);
				}
			}
			$("#okAlreadyPressed").val(false);
			if(showMsgDivFrt){
				$('#msgDivFrt').show();
			}
		}
	});
}

function waitForEquipmentToLoadRows(){
	if($("#equipmentGrid").getGridParam("reccount") == undefined){
	    	setTimeout(function(){
	    		waitForEquipmentToLoadRows();
	        },500);
    }
    else{
    	saveAllEquipments();
    }
}

function resetVinNumberDetails(){
	$('#vehicleYear').val("");
	$('#vehicleMake').val("");
	$('#vehicleModel').val("");
	$('#weight').val("");
	$('#pieceCount').val("");
	
	if($('#unitOfMeasureSourceCode').val()=="M"){
		$('#width').val("");
		$('#length').val("");
		$('#height').val("");
	}
	else if($('#unitOfMeasureSourceCode').val()=="I"){
		$('#feetWidth').val("");
		$('#feetLength').val("");
		$('#feetHeight').val("");
		$('#inchesWidth').val("");
		$('#inchesLength').val("");
		$('#inchesHeight').val("");
	}
}

function setFreightAccordianTabDetails(freightCount, tariffNumber, tariffItemNumber, commodityDescription, tariffCommodityDescription){
	if(freightCount==0){
		setAccordianTabDetails('maintainBookingCommodityId', "");
	}
	else if(freightCount>0){
		var commodityDisplayText = " - ";
		if(tariffNumber!='undefined' && tariffNumber!=null && $.trim(tariffNumber)!=''){
			commodityDisplayText = commodityDisplayText + tariffNumber + " | ";
		}
		
		if(tariffItemNumber!='undefined' && tariffItemNumber!=null && $.trim(tariffItemNumber)!=''){
			commodityDisplayText = commodityDisplayText + tariffItemNumber + " | ";
		}
		//D024321
		if(tariffCommodityDescription!='undefined' && tariffCommodityDescription!=null && $.trim(tariffCommodityDescription)!=''){
			commodityDisplayText = commodityDisplayText + tariffCommodityDescription + " | ";
		}			
		commodityDisplayText = commodityDisplayText + (commodityDescription!=''&& commodityDescription!=null?((commodityDescription.split("\n")[0]).toUpperCase()):'');	
		setAccordianTabDetails('maintainBookingCommodityId', commodityDisplayText);
	}
}

function changeVVD(bookedForVVDSeqNo){
	if($('#freightVVDModified').val()=='Y' && ($('#bkdVessel').val()!=$('#vessel').val() || $('#bkdVoyage').val()!=$('#voyage').val() || $('#bkdDirection').val()!=$('#direction').val())){
		$.ajax({
			url : _context +"/booking/routing/populateVVDForFreight",
			data: {blOrigin: $('#blOriginCityCode').val()},
			success : function(responseText) {
				if(responseText.success){
					selectTripSuccessFunction(responseText);
					$('#freightVVDModified').val('N');
				}
				else{
					showResponseMessages('msgDiv', responseText);
				}
			}
		});
	}
}

function resetTariffDetails(){
	resetMandatoryTariffItem();
	$("#tariffCommodityDescriptionHidden").val('');
	$('#tariffCommodityDescription').val('');
	$('#tariff').val('');
	$('#tariffHidden').val('');
	$("#frtGrpId").val('');
	$("#frtItemId").val('');
	$('#tariffItemNumber').val('');
	$('#tariffItemNumberHidden').val('');
	$('#tariffItemNoteNumber').val('');
	clearCommodityCodeList();
}

/*function validatePlannedArrivalDate(){
	if(!validateDate('plannedArrivalDate', false)){
		return "* Enter date in Format (mm-dd-yyyy)";
	}
}*/

function removeCommodities(){
	resetMandatory();
	var urlString= _context+'/booking/freight/deleteFreight?id=-1';
	$.ajax({
		url: urlString,
		async:false,
		success: function(responseText){
			if(responseText.success){
				$('#freightSeqNo').val('');
				$('select#currentCommodityLine').children().remove().end().append('<option selected value="0">0</option>');
				$('#totalCommodityLines').text(0);
				clearFreight();
				//$('#showAlertTCGLDSP').val("false");
				loadFreightGrids();
				$('#showAlertTCGLDSP').val("true");
				setAccordianTabDetails('maintainBookingCommodityId', "");
				
				enableDisableNote();
			}
			resetIBSCode();
			resetCargoPickup();
			resetCargoDelivery();
		}
	});
}

function removeCurrentCommodity(){
	resetMandatory();
	var urlString= _context+'/booking/freight/deleteFreight?id=-1';
	$.ajax({
		url: urlString,
		async:false,
		success: function(responseText){
			if(responseText.success){
				$('#freightSeqNo').val('');
				$('select#currentCommodityLine').children().remove().end().append('<option selected value="0">0</option>');
				$('#totalCommodityLines').text(0);
				clearFreight();
				loadFreightGrids();
			}
		}
	});
}

function getPrimaryCommodity(tariffNo, itemNo){
	var blOriginCityCode = $('#blOriginCityCode').val();
	var blDestinationCityCode = $('#blDestinationCityCode').val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var loadSrvc = $("#loadServiceCode").val();
	var dischargeSrvc = $("#dischargeServiceCode").val();
	var trade = $('#tradeCode').val();
	
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo;
	
	$.ajax({
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();
					$("#tariffCommodityDescription").val(responseText[0].desc);
					$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						blockUI();
						
						function callBack(responseText) { // cheetah
							if(responseText.success){
								populateCommodityCodeList(responseText.data);
							}
							$.unblockUI();
						}		
						var _tariffItemCmdtyDescId = responseText[0].descid;
						var _frtItemId = $('#frtItemId').val();
						getCommodityCodesRequest(callBack, true, _tariffItemCmdtyDescId, _frtItemId); // cheetah

					}
					setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");
				}
				else{
					$('#msgDivFrt').show();
					if (responseText[0].commodityNotFound =="Y"){
						$.ajax({
							url:  _context+'/booking/freight/validateEffTariffItemDetails',
							data: serializeFreight(),
							type: "POST",
							async: false,
							success: function(responseText){
								if(responseText.success){
									$('#msgDivFrt').html('<div class="message_error">Place of delivery is not valid for Tariff/Item.</div>');
								}
								else{
									$('#msgDivFrt').html('<div class="message_error">'+responseText.messages.error[0]+'</div>');
									/*$('#msgDiv').html('<div class="message_error">'+responseText.messages.error[0]+'</div>');*/
									triggerErrorMessageAlert('msgDivFrt');
								}
							}
							});
						
						resetMandatoryTariffCmdDesc();
						setMandatoryTariffItem();
						$("#tariffCommodityDescription").val("");
						$("#tariffCommodityDescriptionHidden").val("");
						clearCommodityCodeList();
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivFrt').html('<div class="message_error">'+responseText[0].errmsg+'</div>');
						resetMandatoryTariffCmdDesc();
						//resetTariffDetails();
					}
					
					//resetMandatoryTariffCmdDesc();
					//setMandatoryTariffItem();
					//resetTariffDetails();
					
					//$("#tariffCommodityDescription").val("");
					//$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					//clearCommodityCodeList();
					triggerErrorMessageAlert('msgDivFrt');
				}
			}
		}
	});
}

function validateNote1(itemId, tariffItemNoteNumber){
	$.ajax({
		url: _context+'/booking/freight/validateNote',
		data: {tariffItemId:itemId, note:tariffItemNoteNumber},
		success: function(responseText){
			if(!responseText.success){
				$('#tariffItemNoteNumber').val('');
			}
		}
	});
}

function showFreight(customerGroup){
	if(addFreightEnabled()){
		// resetMandatory();
		// Set Cube & Weight according to Measurement Source
		setCubeWeightLengthWidthHeight($('#unitOfMeasureSourceCode').val());
		var loadDschGroup = $.trim($('#loadDschServiceGroupCode').val());
		
		//D026848: 	Maintain Booking / AU - AU / Expand Dimension section in Commodity section
		if(loadDschGroup=="AU" || loadDschGroup=="CON" || loadDschGroup=="LCL"){
			$("#dimensionDiv").show();
		} else {
			$("#dimensionDiv").hide();
		}
		
		// Containerized
		if(loadDschGroup=="CY"){
			// alert("Containerized");
			showContainerized();
		}
		// POV
		else if(loadDschGroup=="AU" && (customerGroup==POV_NAME || customerGroup==ALASKA_POV_NAME)){
			showPOV();
			if($('#bookingTypeCode').val()=='B'){
				setMandatoryPOV();
			}
		}
		// Conventional- Commercial Auto
		else if(loadDschGroup=="AU" && (customerGroup!=POV_NAME || customerGroup!=ALASKA_POV_NAME)){
			// alert("Conventional- Commercial Auto");
			showConventionalCommercialAuto();
		}
		// Conventional- MBU
		else if((customerGroup==GOVERNMENT_NAME) && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $('#isAllowBookingUnit').val()=="Y"){
			// alert("Conventional- MBU");
			showConventionalMBU();
		}
		// Conventional
		else if(loadDschGroup=="CON" || loadDschGroup=="LCL"){
			// alert("Conventional");
			showConventional();
		}
		
		$("#maintainBookingCommodity").validationEngine('detach');
		
		// Set mandatory fields for different freight overlays
		/*
		 * if($('#bookingTypeCode').val()=='B'){
		 * if($("#isAutobill").val()=="true"){ setMandatoryTariffCmdDesc(); } }
		 */
		
		$("#maintainBookingCommodity").validationEngine('attach');
		
		//Changed after defect D024046
		/*if($("#bookingStatusCode :selected").val()!='' && $("#bookingStatusCode :selected").val()!='INCP'){
			$("a.bookedForVVDUrl").attr("href", "javascript:void(0)");
			$("#bkdVessel").attr("readonly", true);
			$("#bkdVoyage").attr("readonly", true);
			$("#bkdDirection").attr("readonly", true);
		}
		else{*/
			$("a.bookedForVVDUrl").attr("href", "javascript:openSearchVVD('freight');");
			$("#bkdVessel").attr("readonly", false);
			$("#bkdVoyage").attr("readonly", false);
			$("#bkdDirection").attr("readonly", false);
		/*}*/
		
		createHazGrid();
		createTCNGrid();
		loadTCNGrid(); //D030580
		if($('#vinNumber').val()!=null && $('#vinNumber').val()!=''){
			if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL'){
				$("#freightWeightLbl").html($("#freightWeightLbl").text()+"<span class=\"mandatory\">*</span>");
				$("#weight").addClass("validate[required]");
			}
			else if(!($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME))){
				$("#freightWeightLbl").html($("#freightWeightLbl").text());
				$("#weight").removeClass("validate[required]");
			}
		}
		
		if(!($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME))){
			resetMandatoryPOV();
		}
		
		if($('#shipmentNumber').val()!=''){
			/*
			 * if($('#pieceCount').val()==''){ $('#pieceCount').val(0); }
			 */
			
			enableDisableFreightButtons($('#totalCommodityLines').text(),($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"?$('select#currentCommodityLine').val():0));
		}
		
		if($('#shipmentNumber').val()==''){
			$('#msgDivFrt').hide();
			$('#msgDivFrtEqp').hide();
			$('#msgDivFrtTcn').hide();
			
			// Set default the first VVD chosen on the VVD section of booking.
			setFirstVVD();
			
			if(($.trim($('#quoteNumberLabel').text())=='') && ($.trim($('#bookingTemplateId').val())=='')){
				
				if($.trim($('#tariff').val())=='' && $.trim($('#tariffItemNumber').val())=='' && $.trim($('#tariffCommodityDescription').val())==''){
					// Default Select- Commodity Code List
					$('#commodityCode').val("");
					// Clear Commodity Code List
					clearCommodityCodeList();
				}
				if($('#totalCommodityLines').text()=='' || $('#totalCommodityLines').text()=='0'){
					enableDisableFreightButtons(0,0);
				}
				else{
					enableDisableFreightButtons($('#totalCommodityLines').text(),($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"?$('select#currentCommodityLine').val():0));
				}
			}
		}
		
		setMandatoryPieces();
		setAutoBillMandatory();
	}
}

function serializeFreight(){
	if($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME)){
		if($.trim($('#pieceCount').val())==""){
			$('#pieceCount').val("1");
		}
		
		if($.trim($('#pieceUnitOfMeasureCode').val())==""){
			$('#pieceUnitOfMeasureCode').val("UNIT");
		}
	}
	
	var freight = 'tariff='+$('#tariff').val();
	freight+='&frtGrpId='+$('#frtGrpId').val();
	
	freight+='&freightSeqNo='+$('#freightSeqNo').val();
	freight+='&bookingFreightId='+$('#bookingFreightId').val();
	freight+='&tariffCommodityDescription='+encodeURIComponent($('#tariffCommodityDescription').val());
	freight+='&frtItemId='+$('#frtItemId').val();
	freight+='&tariffItemNumber='+$('#tariffItemNumber').val();
	freight+='&pieceCount='+$('#pieceCount').val();
	freight+='&tariffItemNoteNumber='+$('#tariffItemNoteNumber').val();
	freight+='&pieceUnitOfMeasureCode='+$('#pieceUnitOfMeasureCode').val();
	freight+='&tariffItemCmdtyDescId='+$('#tariffItemCmdtyDescId').val();
	freight+='&commodityCode='+$('#commodityCode').val();
	freight+='&weight='+$('#weight').val();
	freight+='&cube='+$('#cube').val();
	freight+='&commodityDescription='+encodeURIComponent($('#commodityDescription').val());
	
	freight+='&length='+$('#length').val();
	freight+='&feetLength='+$('#feetLength').val();
	freight+='&inchesLength='+$('#inchesLength').val();
	freight+='&isOversize='+$('#freight\\.isOversize1').is(':checked');
	//freight+='&plannedArrivalDate='+$('#plannedArrivalDate').val();
	freight+='&width='+$('#width').val();
	freight+='&feetWidth='+$('#feetWidth').val();
	freight+='&inchesWidth='+$('#inchesWidth').val();
	freight+='&isRoRo='+$('#freight\\.isRoRo1').is(':checked');
	freight+='&height='+$('#height').val();
	freight+='&feetHeight='+$('#feetHeight').val();
	freight+='&inchesHeight='+$('#inchesHeight').val();
	
	freight+='&bookingAuto.vinNumber='+$('#vinNumber').val();
	freight+='&bookingAuto.vehicleYear='+$('#vehicleYear').val();
	freight+='&bookingAuto.vehicleMake='+$('#vehicleMake').val();
	freight+='&bookingAuto.vehicleModel='+$('#vehicleModel').val();
	freight+='&bookingAuto.vehicleLicenseNumber='+$('#vehicleLicenseNumber').val();
	freight+='&bookingAuto.vehicleLicenseStateCode='+$('#vehicleLicenseStateCode').val();
	freight+='&bookingAuto.vehicleColor='+$('#vehicleColor').val();
	freight+='&bookingAuto.description='+$('#vehicleDescription').val();
	freight+='&bookingAuto.estimatedDropOffDate='+$('#estimatedDropOffDate').val();
	freight+='&bookingAuto.bkdVessel='+$('#bkdVessel').val();
	freight+='&bookingAuto.bkdVoyage='+$('#bkdVoyage').val();
	freight+='&bookingAuto.bkdDirection='+$('#bkdDirection').val();
	freight+='&bookingAuto.recdVessel='+$('#recdVessel').val();
	freight+='&bookingAuto.recdVoyage='+$('#recdVoyage').val();
	freight+='&bookingAuto.recdDirection='+$('#recdDirection').val();
	freight+='&bookingAuto.specialInstruction='+encodeURIComponent($('#specialInstruction').val());
	
	return freight;
}

function populateCommodityLines(list, currentCommodityLine){
	$('select#currentCommodityLine').children().remove();
	for ( var i = 0; i < list.length; i++) {
		$('select#currentCommodityLine').append($("<option/>", {
			value : list[i].code,
			text : list[i].description
		}));
	}
	$('select#currentCommodityLine').val(currentCommodityLine);
	$('#totalCommodityLines').text(list.length==0?0:list.length);
	if(list.length==0){
		$('select#currentCommodityLine').children().remove().end().append('<option selected value="0">0</option>');
	}
}

function getFreight(freightSeqNo){

	// Resetting if error occured
	$("#okAlreadyPressed").val(false);
	var dataUrl = _context +"/booking/freight/getFreight?freightSeqNo="+freightSeqNo+"&measurementSource="+$('#unitOfMeasureSourceCode').val();
	$.ajax({
		url: dataUrl,
		success: function(responseText){
			clearFreight();
			getFreightJSONresponse(responseText);
			setFirstVVD();
			freightModified = false;
			$('#tariff').focus();
		}
	});
}
	
function afterFreightLoadComplete(freightCount, tariffNumber, tariffItemNumber, commodityDescription, tariffCommodityDescription){
	if(freightCount==0){
		// Reset total charges
		$('#actualTotalChargeAmount').text("");
	}
	if($("#tariff").val()!=""){
		$('#tariffHidden').val($("#tariff").val());
	}
	$('#tariffCheck').val($("#tariff").val());
	// Set description according to first commodity added in the frieght grid.
	setFreightAccordianTabDetails(freightCount, tariffNumber, tariffItemNumber, commodityDescription, tariffCommodityDescription);
	loadSpecialServiceGrid();
	loadHazGrid();//Defect-25636
	// D016178
	// validateTCNExists();
}

function addFreightEnabled(){
	var trade = $('#tradeCode option:selected').text();
	var customerGroup = $.trim($('#customerGroupId :selected').text());
	var loadService= $('#loadServiceCode :selected').val();
	var dischargeService = $('#dischargeServiceCode :selected').val();
	var isAddFreight = (trade!=null && trade!="" && customerGroup!=null && customerGroup!="" && customerGroup!='Select' && loadService!=null && loadService!="" && dischargeService!=null && dischargeService!="");
	if($('#bookingTypeCode').val()=='T' && trade!=null && trade!="" && (customerGroup==null || customerGroup=="" || customerGroup=='Select') && loadService!=null && loadService!="" && dischargeService!=null && dischargeService!="" && $.trim($('#loadDschServiceGroupCode').val())=="CY"){
		isAddFreight = true;
	}
	if(!isAddFreight){
		iterated = false;
	}
	return isAddFreight;
}

function clearFreight(){
	$('#msgDivFrt').html('');
	$('#msgDivFrtEqp').html('');
	$('#msgDivFrtTcn').html('');
	$('#msgDivFrt').hide();
	$('#msgDivFrtEqp').hide();
	$('#msgDivFrtTcn').hide();
	//D024526
	//$('#tariff').val('');
	$('#frtGrpId').val('');
	
	// $('#freightSeqNo').val('');
	// $('#bookingFreightId').val('');
	$('#tariffCommodityDescription').val('');
	$('#frtItemId').val('');
	$('#tariffItemNumber').val('');
	$('#pieceCount').val("");
	$('#tariffItemNoteNumber').val('');
	$('#pieceUnitOfMeasureCode').val('');
	$('#tariffItemCmdtyDescId').val('');
	$('select#commodityCode').children().remove().end().append('<option selected value="">Select</option>');
	$('#weight').val('');
	$('#cube').val('');
	$('#commodityDescription').val('');
		
	$('#length').val('');
	$('#feetLength').val('');
	$('#inchesLength').val('');
	$('#freight\\.isOversize1').attr('checked', false);
	//$('#plannedArrivalDate').val('');
	$('#width').val('');
	$('#feetWidth').val('');
	$('#inchesWidth').val('');
	$('#freight\\.isRoRo1').attr('checked', false);
	$('#height').val('');
	$('#feetHeight').val('');
	$('#inchesHeight').val('');
		
	if($.trim($('#vinNumber').val())!=''){
		$('#vinNumber').val('');
		$.ajax({
	 		 url: _context+'/booking/freight/getVehicleDetails',
	 		 data:{vinNumber:$('#vinNumber').val(), measurementSource:$('#unitOfMeasureSourceCode').val()},
	 		 success: function(responseText) {
	 		 }
		});
	}
	$('#vehicleYear').val('');
	$('#vehicleMake').val('');
	$('#vehicleModel').val('');
	$('#vehicleLicenseNumber').val('');
	$('#vehicleLicenseStateCode').val('');
	$('#vehicleColor').val('');
	$('#vehicleDescription').val('');
	$('#estimatedDropOffDate').val('');
	$('#bkdVessel').val('');
	$('#bkdVoyage').val('');
	$('#bkdDirection').val('');
	$('#recdVessel').val('');
	$('#recdVoyage').val('');
	$('#recdDirection').val('');
	$('#specialInstruction').val('');
	
	$("#primaryFreightPresent").val('N');
	
	
}

function loadNewFreight(freightSeqNo,bookingFreightId){
	// Clearing grid
	$('#equipmentGrid').jqGrid("clearGridData");
	equipmentUpdated = false;
	if((isCommodityDisplayOnly && !isCommodityModifiable) || $("#bookingStatusCode").val()=='CANC'){
		$("#maintainBookingCommodity").gatesDisable();
		$('#tr_equipmentSeqNo').hide();
		$('#del_equipmentGrid').hide();
		$('#gview_equipmentGrid input').attr("disabled", true);
		$('#gview_equipmentGrid select').attr("disabled", true);
	}else{
		$('#gview_equipmentGrid input').attr("disabled", false);
		$('#gview_equipmentGrid select').attr("disabled", false);
		enableEquipmentAddDelete();
	}
	resetEquipmentAddRow();
	$('#hazGrid').jqGrid("clearGridData");
	$('#tcnGrid').jqGrid("clearGridData");
	blockUI();
	$.ajax({
		type: "POST",
		url: _context +"/booking/freight/clearFreightForm",
		data: {
			freightSeqNo:freightSeqNo, 
			bookingFreightId:bookingFreightId
		},
		success: function(responseText){
			$.unblockUI();
			freightModified = true;
			isBookingChanged = "Y";
			$('#tariff').focus();
		}
	});
}

function addUpdateFreight(dataUrl, isSaveBooking){
	/* Booking Security */
	//Removed other permissions for D030668
	if( $('#bookingStatusCode').val()=='CANC'){
		return false;
	}
	
	/*
	 * if(isSaveBooking && $('#totalCommodityLines').text()=='0' &&
	 * !checkIfAnyFreightFieldHasValue()){ return true; }
	 */
	
	if($("#okAlreadyPressed").val()=="false"){
		
		
		if(isSaveBooking==true || freightModified==true){
    		if(!$('#tariff').is(':visible') && addFreightEnabled()){
				$($('.booking-section')[4]).accordion("enable");
				$('#commodityHeader').attr('aria-expanded', "true");
				$('#commodityHeader').attr('aria-selected', "true");
				$('#commodityHeader').attr('tabindex', "0");
				$('#commodityHeader').removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top");
				$('#commodityHeader span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
				$('#maintainBookingCommodity').removeClass('ui-accordion-disabled ui-state-disabled');
				$('#maintainBookingCommodity').addClass('ui-accordion-content-active');
				$('#maintainBookingCommodity').css('display', 'block');
				var status = $($('.booking-section')[4]).accordion('option', 'active');
				if (typeof status == "boolean" && !status) {
					$($('.booking-section')[4]).accordion('option', 'active', 0);
				}
				//loadEquipmentGrid();
				/*if($("#equipmentGrid").is(':visible')){
					hideEquipmentInlineEditDelete();
					//showSelectedCharacteristics();
    			}*/
    		}
    	}
		
		if($('#tariff').is(':visible') && !$('#equipmentGrid').is(':visible')){
			$(".HeaderButton", ("#gview_equipmentGrid")).click();
		}
		
		if($('#tariff').is(':visible') && $('#equipmentGrid').is(':visible')){
			saveAllEquipments();
			if(updateEquipmentErrorOccurred){
				return false;
			}
		}
		
		$("#okAlreadyPressed").val(true);
		
		if($.trim($('#shipmentNumber').val())!='' && $('#bookingTypeCode').val()=='B' && $("#isAutobill").val()=="true" && 
				($.trim($('#quoteVNConcat').val())=='' || ($.trim($('#quoteVNConcat').val())!='' &&  
						$("#isConstructedQuote").val()!='Y'))){
			setMandatoryTariffCmdDesc();
		}
		
    	/*
		 * if(($('#bookingTypeCode').val()=='B' &&
		 * $("#isAutobill").val()=="false") ||
		 * $('#bookingTypeCode').val()=='T'){
		 */
        	if($("#primaryFreightPresent").val()=='N' && $("#tariff").val()!='' && $("#tariffItemNumber").val()==''){
        		setMandatoryTariffItem();
				resetMandatoryCmdDesc();
        	}
    		else if($("#commodityDescription").val()=='' && $("#primaryFreightPresent").val()=='N'){
        		resetMandatoryTariffCmdDesc();
    			$("#commodityDescription").addClass("validate[required]");
        	}
        	/*
			 * else if($("#commodityDescription").val()!='' &&
			 * $("#primaryFreightPresent").val()=='N'){ resetTariffDetails(); }
			 */
        	
        	if($("#primaryFreightPresent").val()=='Y'){
        		if($("#tariffCommodityDescription").val()=='' || $("#tariff").val()=='' || $("#tariffItemNumber").val()=='' || $("#commodityCode").val()==''){
        			setMandatoryTariffCmdDesc();
        			resetMandatoryCustDesc();
        		}
        	}
    	/* } */
		
    	
    	
    	if (!$("#maintainBookingCommodity").validationEngine('validate')) {
    		validateAutoEstDropOffDate();
    		$("#okAlreadyPressed").val(false);
    		return false;
    	}
    	else{
    		if(!validateAutoEstDropOffDate()){
        		$("#okAlreadyPressed").val(false);
        		return false;
    		}
    	}
    	
    	
    	//D026005: 	FW: Maintain Booking - recvd no warning when i changed tariff item on an AUTOBILL booking 
    	if($("#isAutobill").val()=="true" && $.trim($("#bookingFreightId").val())!=''){
        	$.ajax({
				type: "POST",
				url: _context +"/booking/freight/validateRatingAttributesChanged",
				data: {tariff:$('#tariff').val(), tariffItemNumber:$('#tariffItemNumber').val(), tariffItemNoteNumber:$('#tariffItemNoteNumber').val(), commodityCode:$('#commodityCode').val()},
				success: function(responseText){
					if(responseText.success){
						var isConfirm = confirm("The change(s) to this Autobill could affect rating.  Override? (Y/N)");
						if (isConfirm) {
							$("#ratingAttributesChanged").val(true);
							saveFreight(dataUrl, true,isSaveBooking);
							return true;
						}
						else{
							$("#okAlreadyPressed").val(false);
							return false;
						}
					}
					else{
						saveFreight(dataUrl, false,isSaveBooking);
						return true;
					}
				}
        	
			});
    	}
    	else{
			saveFreight(dataUrl, false,isSaveBooking);
			return true;
		}
	}
}

function setPrimaryFreightPresent(tariff, frtGrpId, item, frtItemId, commodityCode, tariffItemCmdtyDescId){
	if($.trim(tariff)!=undefined && $.trim(tariff)!=null && $.trim(tariff)!='' && $.trim(frtGrpId)!=undefined && $.trim(frtGrpId)!=null && $.trim(frtGrpId)!='' && $.trim(item)!=undefined && $.trim(item)!=null && $.trim(item)!='' && $.trim(frtItemId)!=undefined && $.trim(frtItemId)!=null && $.trim(frtItemId)!='' && (($.trim(commodityCode)!=undefined && $.trim(commodityCode)!=null && $.trim(commodityCode)!='') || ($.trim(tariffItemCmdtyDescId)!=undefined && $.trim(tariffItemCmdtyDescId)!=null && $.trim(tariffItemCmdtyDescId)!=''))){
		$("#primaryFreightPresent").val('Y');
	}
	else{
		$("#primaryFreightPresent").val('N');
	}
}

function getFreightJSONresponse(responseText){
	equipmentUpdated = false;
	resetMandatory();
	
	if(responseText.tariffCommodityDescription!=null && responseText.tariffCommodityDescription!=''){
		$('#tariffCommodityDescriptionHidden').val(responseText.tariffCommodityDescription);
	}
	else{
		$('#tariffCommodityDescriptionHidden').val("");
	}
	
	$("#maintainBookingCommodity").loadJSON(responseText);
	$("#vehicleDescription").val(((responseText.bookingAuto!=null && responseText.bookingAuto.description!=null && responseText.bookingAuto.description!="")?responseText.bookingAuto.description:""));
	
	populateCommodityLines(responseText.commodityLines, responseText.currentCommodityLine);
	loadHazGrid();
	// Set Commodity Code List
	getCommodityCodes(responseText.tariffItemCmdtyDescId, false);
	$('#commodityCode').val(responseText.commodityCode==null?"":($('#commodityCode').val()!=''?$('#commodityCode').val():$.trim(responseText.commodityCode)));
	setPrimaryFreightPresent(responseText.tariff, responseText.frtGrpId, responseText.tariffItemNumber, responseText.frtItemId, $('#commodityCode').val(), responseText.tariffItemCmdtyDescId);
	enableDisableFreightButtons($('#totalCommodityLines').text(), responseText.freightSeqNo);
	
	if($('#isAutobill :selected').val()=="true" && $('#shipmentNumber').val() != '' && $('#bookingTypeCode').val()=='B'){
		setAutoBillMandatory();
	}
	else{
		if(responseText.tariff!=null && responseText.tariff!='' && responseText.tariffItemNumber!=null && responseText.tariffItemNumber!=''){
			// $("#tariff").val($("#tariffNumber").val());
			setMandatoryTariffItem();
		}
		else{
			/* $("#tariff").val(""); */
			resetMandatoryTariffCmdDesc();
		}
	}
	
	if(responseText.bookingAuto.vinsightNumber!=null && responseText.bookingAuto.vinsightNumber!=''){
		$("a.vinsightUnitIdUrl").attr("href", responseText.bookingAuto.vinsightWebUrl);
		$("a.vinsightUnitIdUrl").html(responseText.bookingAuto.vinsightNumber);
		
	}
	
	if(responseText.bookingAuto.vinNumber!=null && responseText.bookingAuto.vinNumber!=''){
		if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL'){
			$("#freightWeightLbl").html($("#freightWeightLbl").text()+"<span class=\"mandatory\">*</span>");
			$("#weight").addClass("validate[required]");
		}
		else if(!($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME))){
			$("#freightWeightLbl").html($("#freightWeightLbl").text());
			$("#weight").removeClass("validate[required]");
		}
	}
	
	if(responseText.bookingFreightId==null){
		$("#bookingFreightId").val("");
	}
	
	if(responseText.bookingAuto.estimatedAvailDate!=null && $.trim(responseText.bookingAuto.estimatedAvailDate)!=''){
		$("#estAvail").html(responseText.bookingAuto.estimatedAvailDate);
	}
	
	(responseText.isOversize)?$('#freight\\.isOversize1').attr('checked', true):$('#freight\\.isOversize1').attr('checked', false);
	(responseText.isRoRo)?$('#freight\\.isRoRo1').attr('checked', true):$('#freight\\.isRoRo1').attr('checked', false);
	
	/* Booking Security */
	/*
	 * if(isCommodityDisplayOnly && !isCommodityModifiable){
	 * disableDialogButton('conventionalDialog', 'Ok'); }
	 */

	afterFreightLoadComplete($('#totalCommodityLines').text(), responseText.tariff, responseText.tariffItemNumber, responseText.commodityDescription, responseText.tariffCommodityDescription);
	
	$('#msgDivFrt').html('');
	$('#msgDivFrt').hide();
	
	setMandatoryPieces();
	loadFreightGrids();
}

function enableDisableFreightButtons(freightCount, freightSeqNo){
	/*
	 * if(freightCount==0){ $('#updateFreight').attr('disabled', true);
	 * $('#deleteFreight').attr('disabled', true); } else if(freightCount>=1){
	 * $('#updateFreight').attr('disabled', false);
	 * $('#deleteFreight').attr('disabled', false); }
	 */
	
	// TODO: to be replaced when save will validate all validations
	if(freightCount == 0){
		$('#previousFreight').attr({style: 'visibility : hidden'});
		$('#nextFreight').attr({style: 'visibility : hidden'});
		$('#updateFreight').attr({style: 'visibility : hidden'});
		$('#deleteFreight').attr('disabled', true);
	} else if(freightCount == 1){
		$('#previousFreight').attr({style: 'visibility : hidden'});
		$('#nextFreight').attr({style: 'visibility : hidden'});
		$('#updateFreight').attr({style: 'visibility : hidden'});
		//Added for Defect D027295
		if(isCommodityModifiable)
		  $('#deleteFreight').attr('disabled', false);
	} else if(freightCount > 1){
		$('#previousFreight').attr({style: 'visibility : visible'});
		$('#nextFreight').attr({style: 'visibility : visible'});
		$('#updateFreight').attr({style: 'visibility : visible'});
		$('#updateFreight').attr('disabled', false);
		//Added for Defect D027295
		if(isCommodityModifiable)
		$('#deleteFreight').attr('disabled', false);
	}
	enableDisableNextPreviousButtons(freightCount, freightSeqNo);
}
function setMandatoryPieces(){
	if($('#bookingTypeCode').val()=='B' && ( $.trim($('#loadDschServiceGroupCode').val())=="CON" || $.trim($('#loadDschServiceGroupCode').val())=="LCL" ) && $('#freight\\.isRoRo1').is(':checked')==true){
		if($('span', $('#pieceCountLbl')).hasClass('mandatory')==false){
			setPiecesMandatory();
		}
	}
	else if($('#bookingTypeCode').val()=='B' && $('#customerGroupId :selected').text()==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $('#isAllowBookingUnit').val()=="Y"){
		if($('span', $('#pieceCountLbl')).hasClass('mandatory')==false){
			setPiecesMandatory();
		}
	}
	else{
		resetPiecesMandatory();
	}
}

function setPiecesMandatory(){
	$("#pieceCountLbl").html($("#pieceCountLbl").text()+"<span class=\"mandatory\">*</span>");
	$("#pieceCount").addClass("validate[required]");
}

function resetPiecesMandatory(){
	$("#pieceCountLbl").html("Pieces");
	$("#pieceCount").removeClass("validate[required]");
}

function setFirstVVD(){
	$("#bkdVessel").val($("#vessel").val());
	$("#bkdVoyage").val($("#voyage").val());
	$("#bkdDirection").val($("#direction").val());
	$("#estShip").html($('#sailDate').val());
}


function splitCommodity()
{ 
	
	var i=0;j=0,k=0;
	var commDesc = $("#commodityDescription").val();
	var newCommDesc ="";
	var splittedString;
	var finalcommDesc="";
	newCommDesc = commDesc.split('\n')
	for(k=0;k<newCommDesc.length;k++)
	{
		if(k ==0) // first line can only be 30 characters
		{
			if(newCommDesc[k].length <= 30) {
				console.log("do nothing");
				finalcommDesc = finalcommDesc + newCommDesc[k] + '\n';
			} else {
				var firstline = wordwrapfirstline(newCommDesc[k],30,30);
				console.log("firstline= "+firstline);
				finalcommDesc = finalcommDesc + firstline+ '\n';
			}
		} else 
		{
			console.log("original="+newCommDesc[k]);
			console.log("original="+newCommDesc[k].length);
			if(newCommDesc[k].length <= 30) {
				console.log("do nothing");
				finalcommDesc = finalcommDesc + newCommDesc[k] + '\n';
			} else {
				console.log("wordwrap "+wordwrap2Columns(newCommDesc[k],30));
				finalcommDesc = finalcommDesc + wordwrap2Columns(newCommDesc[k],30)+ '\n';
			}
		}
	}
	// remove trailing '\n'
	finalcommDesc = finalcommDesc.substring(0,finalcommDesc.length-1);
	//Added for D029259
	if($("#commodityDescription").val() != finalcommDesc)
		isBookingChanged ="Y";
	$("#commodityDescription").val(finalcommDesc);
}


function wordwrap2Columns( str, width ) {
	 
    var brk =  '\n';
    width = width || 75;
    var  cut = true;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
    var result = str.match( RegExp(regex, 'g') );
    var output = "";
    for(var i=0;i<result.length;i++) {
    	console.log("i"+i+" ="+ result[i]+";");
    	result[i] = result[i].trim();
    	output += result[i];
    	if(i == (result.length-1)) {
    		// do nothing
    	} else if(i%2 == 0) {
    		output += " ";
    	} else {
    		output += "\n";
    	}
    	
    }
    
    return output;
}

// First line can only be width other lines can be second width.
function wordwrapfirstline( str, width, secondwidth) {
	 
    var brk =  '\n';
    width = width || 75;
    var  cut = true;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
    var result = str.match( RegExp(regex, '') )[0];
    console.log(str.substring(result.length));
    
    return result.trim() + brk + wordwrap2Columns(str.substring(result.length),secondwidth);
 
}

function wordwrap( str, width ) {
	 
    var brk =  '\n';
    width = width || 75;
    var  cut = true;
 
    if (!str) { return str; }
 
    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
 
    var result = str.match( RegExp(regex, 'g') );
    for(var i=0;i<result.length;i++) {
    	result[i] = result[i].trim();
    }
    
    return result.join( brk );
 
}


function calculateCube(){
 var reg3Number3DecimalPlaces = /^[0-9]{0,3}(\.[0-9]{1,3})?$/;
 var reg3Number = /^[0-9]{1,3}$/;
 var reg2Number = /^([0-9]{1,2})$/;
 if($.trim($('#unitOfMeasureSourceCode').val())=="M"){
	var length = $.trim($('#length').val());
    var width = $.trim($('#width').val());
    var height = $.trim($('#height').val());
 	if((length!="" && !reg3Number3DecimalPlaces.test(length)) || (width!="" && !reg3Number3DecimalPlaces.test(width)) || (height!="" && !reg3Number3DecimalPlaces.test(height))) {
       		return;
       	}
 } 
 else if($.trim($('#unitOfMeasureSourceCode').val())=="I"){
    var feetLength = $.trim($('#feetLength').val());
    var feetWidth = $.trim($('#feetWidth').val());
    var feetHeight = $.trim($('#feetHeight').val());
	if((feetLength!="" && !reg3Number.test(feetLength)) || (feetWidth!="" && !reg3Number.test(feetWidth)) || (feetHeight!="" && !reg3Number.test(feetHeight))) {
   		return;
   	}
	
	var inchesLength = $.trim($('#inchesLength').val());
    var inchesWidth = $.trim($('#inchesWidth').val());
    var inchesHeight = $.trim($('#inchesHeight').val());
	if(((inchesLength!="" && !reg2Number.test(inchesLength)) || (inchesWidth!="" && !reg2Number.test(inchesWidth)) || (inchesHeight!="" && !reg2Number.test(inchesHeight))) || ((inchesLength!="" && inchesLength<0) || (inchesWidth!="" && inchesWidth<0) || (inchesHeight!="" && inchesHeight<0)) || ((inchesLength!="" && inchesLength>11) || (inchesWidth!="" && inchesWidth>11) || (inchesHeight!="" && inchesHeight>11))) {
   		return;
   	}
 }
//added for	D025466
 $.ajax({
	url: _context+'/booking/freight/calculateCube?measurementSource='+$('#unitOfMeasureSourceCode').val()+'&length='+$('#length').val()+'&width='+$('#width').val()+'&height='+$('#height').val()+'&feetLength='+$('#feetLength').val()+'&inchesLength='+$('#inchesLength').val()+'&feetWidth='+$('#feetWidth').val()+'&inchesWidth='+$('#inchesWidth').val()+'&feetHeight='+$('#feetHeight').val()+'&inchesHeight='+$('#inchesHeight').val()+'&pieceCount='+$('#pieceCount').val(), 
	success: function(responseText){
		if(responseText.success){
			$('#cube').val(responseText.data);
		}
		else{
			$('#cube').val("");
		}
	}
 });
}

function scrollToCommodity(){
	var offset = accordianPostionCoordinates(4);
	window.scrollTo(offset.left, offset.top);
}

function addfreightEnabledAlertMessage(){
	var trade = $('#tradeCode option:selected').text();
	var customerGroup = $.trim($('#customerGroupId :selected').text());
	var loadService= $('#loadServiceCode :selected').val();
	var dischargeService = $('#dischargeServiceCode :selected').val();
	
	var message='';
	if(trade==null || trade==""){
		message+='Trade';
	}
	
	if(customerGroup==null || customerGroup=='' || customerGroup=='Select'){
		message+=(message==''?'Customer Group':', Customer Group');
	}
	
	if(loadService==null || loadService==""){
		message+=(message==''?'Load Service':' and Load Service');
	}
	
	if(dischargeService==null || dischargeService==""){
		if(message==''){
			message+='Discharge Service';
		}
		else if(message!=''){
			if(message.search('Load')>0){
				message = message.replace("Load Service", "Load");
				message+=' & Discharge Service';
			}
			else{
				if(message=='Load Service'){
					message=' Load & Discharge Service';
				}
				else{
					message+=' and Discharge Service';
				}
			}
		}
	}
	alert(message+" is required to add freight.");
}

function enableDisableCommodityIfTradeCustGrpLDGrpPresent(){
	commodityShowHide();
}

function commodityShowHide()
{
	if(!addFreightEnabled()){
		if($('#tariff').is(':visible'))
			$($('.booking-section')[4]).accordion('option', 'active', false);
		disableAccordian(4);
	}
	else
	{
		var status = $($('.booking-section')[4]).accordion('option', 'active');
		if ((typeof status == "boolean" && !status) || (status=="0" && !$('#tariff').is(':visible'))) {
			var xCoordinate = window.pageXOffset;
			var yCoordinate = window.pageYOffset;
			$($('.booking-section')[4]).accordion("enable");
			/*var disabled = $($('.booking-section')[4]).accordion("option", "disabled");
			if(disabled)
			{
				$($('.booking-section')[4]).accordion("enable");
				loadTCNGrid();			
				loadHazGrid();
				if(!equipmentUpdated)
				loadEquipmentGrid();
			}*/
			$($('.booking-section')[4]).accordion('option', 'active', 0);
			showFreight($.trim($('#customerGroupId :selected').text()));
			
			setTimeout(function(){
				if($('#tariff').is(':visible'))
				{
					if(!$("#equipmentGrid").is(':visible'))
					{
						if(!defaultHidden || 
							($("#equipmentGrid").getGridParam("reccount")!=undefined &&
									$("#equipmentGrid").getGridParam("reccount")>0))
						{
							$(".HeaderButton", ("#gview_equipmentGrid")).click();
							//hideEquipmentInlineEditDelete();
							//showSelectedCharacteristics();
						}
					}
					else if($("#equipmentGrid").is(':visible'))
					{
						if(defaultHidden && ($("#equipmentGrid").getGridParam("reccount")==undefined || 
								$("#equipmentGrid").getGridParam("reccount")==0))
							$(".HeaderButton", ("#gview_equipmentGrid")).click();
						/*else
						{
							//hideEquipmentInlineEditDelete();
							//showSelectedCharacteristics();
						}*/
					}
				}
				window.scrollTo(xCoordinate, yCoordinate);
			}, 250);
		}
	}
}

function loadFreightGrids()
{
	var xCoordinate = window.pageXOffset;
	var yCoordinate = window.pageYOffset;
	
	loadEquipmentGrid();
	loadTCNGrid();			
	loadHazGrid();
	
	setTimeout(function(){
		if($('#tariff').is(':visible'))
		{
			if(!$("#equipmentGrid").is(':visible'))
			{
				if(!defaultHidden || 
					($("#equipmentGrid").getGridParam("reccount")!=undefined &&
							$("#equipmentGrid").getGridParam("reccount")>0))
				{
					$(".HeaderButton", ("#gview_equipmentGrid")).click();
					//hideEquipmentInlineEditDelete();
					//showSelectedCharacteristics();
				}
			}
			else if($("#equipmentGrid").is(':visible'))
			{
				if(defaultHidden && ($("#equipmentGrid").getGridParam("reccount")==undefined || 
						$("#equipmentGrid").getGridParam("reccount")==0))
					$(".HeaderButton", ("#gview_equipmentGrid")).click();
				/*else
				{
					hideEquipmentInlineEditDelete();
					//showSelectedCharacteristics();
				}*/
			}
		}
		window.scrollTo(xCoordinate, yCoordinate);
	}, 250);
}

function validateFreightFieldsOnSave(){
	// Commodity Accordion has already been expanded in booking save section
	if($('#estimatedDropOffDate').is(':visible')){
		var estShipDate = $('#estShip').text();
		if(estShipDate!='' && new Date($('#estimatedDropOffDate').val()).getTime() > new Date(estShipDate).getTime()){
			$('#maintainBookingRouting').hide();
			$('#estimatedDropOffDate').validationEngine('showPrompt', '* Est Drop Off date cannot be greater than Est Ship date.', 'error', 'topRight', true);
			return false;
		}
	}
	
	if($('#tariff').val() != $('#tariffCheck').val() && $("#isAutobill").val()=="true") {
		$('#tariff').validationEngine('showPrompt', 'Tariff did not load correctly, please re-enter', 'error', 'topRight', true);
		return false;
	}
	
	return true;
}
 
function freightTabSequence()			
{
	
	$('#tariff').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(evt.shiftKey && (key == 9 || key=='9')){
			  $('#loadServiceCode').focus();
		  }
		  else if(key == '9'){
			  if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
					$('#tariffItemNoteNumber').attr('disabled', true);
				} else {
					$('#tariffItemNoteNumber').attr('disabled', false);
					//$('#tariff').trigger('change');
				}
				  $('#tariffCommodityDescription').focus();
				  return false;			  				 
		  }
		  return true;
	});
	$('#tariffCommodityDescription').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#tariff').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#tariffItemNumber').focus();
			  return false;
		  }
		  return true;
	});
	
	$('#tariffItemNumber').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#tariffCommodityDescription').focus();
			  return false;
		  }
		  else if(key == '9'){
			  if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
					$('#tariffItemNoteNumber').attr('disabled', true);
				} else {
					$('#tariffItemNoteNumber').attr('disabled', false);
				}
			  if($('#tariffItemNoteNumber').is('disabled') || $('#tariffItemNoteNumber').attr('disabled')==true  || $('#tariffItemNoteNumber').attr('disabled') == 'disabled')
				  $('#commodityCode').focus();
			  else
				  $('#tariffItemNoteNumber').focus();
			  return false;
		  }
		  return true;
	});
	
	$('#tariffItemNoteNumber').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#tariffItemNumber').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#commodityCode').focus();
			  return false;
		  }
		  return true;
	});
	$('#commodityCode').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  if($('#tariffItemNoteNumber').is('disabled') || $('#tariffItemNoteNumber').attr('disabled')==true  || $('#tariffItemNoteNumber').attr('disabled') == 'disabled')
				  $('#tariffItemNumber').focus();
			  else
				  $('#tariffItemNoteNumber').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#pieceCount').focus();
			  return false;
		  }
		  return true;
	});
	$('#pieceCount').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#commodityCode').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#pieceUnitOfMeasureCode').focus();
			  return false;			  				 
		  }
		  return true;
	});
	$('#pieceUnitOfMeasureCode').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#pieceCount').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#weight').focus();
			  return false;			  				 
		  }
		  return true;
	});
	$('#weight').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#pieceUnitOfMeasureCode').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#cube').focus();
			  return false;			  				 
		  }
		  return true;
	});
	$('#cube').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#weight').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#commodityDescription').focus();
			  return false;			  				 
		  }
		  return true;
	});
	$('#commodityDescription').bind('keydown', function(evt) {
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#cube').focus();
			  return false;
		  }
		  else if(key == '9'){
			  $('#unitOfMeasureSourceCode').focus();
			  return false;			  				 
		  }
		  return true;
	});
	$('#currentCommodityLine').bind('keydown', function(evt){		
		var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(theEvent.shiftKey && key == '9'){
			  $('#unitOfMeasureSourceCode').focus();
			  return false;			  				 
		  }
		  else if(key == '9') {
			   if($('#totalCommodityLines').text() > 1) {
					  $('#previousFreight').focus();
				  } else {
					  $('#clearFreight').focus();
				  }
			  return false;
		  }
		  
		 return true;
	});
	$('#clearFreight').bind('keydown', function(evt) {			
		var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(evt.shiftKey && (key == 9 || key=='9')){			
			  if($('#totalCommodityLines').text() > 1) {
				  $('#updateFreight').focus();
			  } else {
				  $('#currentCommodityLine').focus();
			  }
			  return false;
		  }
		 return true;
	});
	$('#deleteFreight').bind('keydown', function(evt) {			
		var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(evt.shiftKey && (key == 9 || key=='9')){			
			  $('#addFreight').focus();
			  return false;
		  }
		  else if(key == '9'){
			  if($('#equipmentGrid').is(':visible')){
				  $('#cb_equipmentGrid').focus();
			  }
			  else{
				 /* $('#equipmentGrid').focus();*/
				  $(".ui-jqgrid-titlebar-close",$("#equipmentGrid")[0].grid.cDiv).focus();
			  }
			  return false;			  				 
		  }
		 return true;
	});
}

function openRateBase(){
	window.open('https://matson.ratebase.net/rateBASE/servlet/loginServlet?user_id=matspass&password=mats01');
}

function enableDisableNote() {
	
	if($.trim($('#tariff').val()) == '' || $.trim($('#tariffItemNumber').val()) == '') {
		$('#tariffItemNoteNumber').attr('disabled', true);
	} else {
		$('#tariffItemNoteNumber').attr('disabled', false);
	}
}

function checkIfAnyFreightFieldHasValue(){
	
	if($("#equipmentGrid").getGridParam("reccount")>0){
		return true;
	}
	
	if($("#tcnGrid").getGridParam("reccount")>0){
		return true;
	}
	
	if($("#hazGrid").getGridParam("reccount")>0){
		return true;
	}
	
	if($.trim($('#tariff').val())!=''){
		return true;
	}
	
	if($.trim($('#tariffCommodityDescription').val())!=''){
		return true;
	}
	
	if($.trim($('#tariffItemNumber').val())!=''){
		return true;
	}
	
	if($.trim($('#tariffItemNumber').val())!=''){
		return true;
	}
	
	if($.trim($('#tariffItemNoteNumber').val())!=''){
		return true;
	}
	
	if($.trim($('#commodityCode').val())!=''){
		return true;
	}
	
	if($.trim($('#pieceCount').val())!=''){
		return true;
	}
	
	if($.trim($('#pieceUnitOfMeasureCode').val())!=''){
		return true;
	}
	
	if($.trim($('#weight').val())!=''){
		return true;
	}
	
	if($.trim($('#cube').val())!=''){
		return true;
	}
	
	if($.trim($('#commodityDescription').val())!=''){
		return true;
	}
	
	if($.trim($('#unitOfMeasureSourceCode').val())=='I'){
		if($.trim($('#feetLength').val())!=''){
			return true;
		}
		
		if($.trim($('#inchesLength').val())!=''){
			return true;
		}
		
		if($.trim($('#feetWidth').val())!=''){
			return true;
		}
		
		if($.trim($('#inchesWidth').val())!=''){
			return true;
		}
		
		if($.trim($('#feetHeight').val())!=''){
			return true;
		}
		
		if($.trim($('#inchesHeight').val())!=''){
			return true;
		}
	}
	else if($.trim($('#unitOfMeasureSourceCode').val())=='M'){
		if($.trim($('#length').val())!=''){
			return true;
		}
		
		if($.trim($('#width').val())!=''){
			return true;
		}
		
		if($.trim($('#height').val())!=''){
			return true;
		}
	}
	
	if($('#freight\\.isOversize1').is(':checked')){
		return true;
	}
	
	if($('#freight\\.isRoRo1').is(':checked')){
		return true;
	}
	
	/*if($.trim($('#plannedArrivalDate').val())!=''){
		return true;
	}*/
	
	if($.trim($('#vinNumber').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleYear').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleMake').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleModel').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleLicenseNumber').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleLicenseStateCode').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleColor').val())!=''){
		return true;
	}
	
	if($.trim($('#vehicleDescription').val())!=''){
		return true;
	}
	
	if($.trim($('#estimatedDropOffDate').val())!=''){
		return true;
	}
	
	/*if($.trim($('#bkdVessel').val())!=''){
		return true;
	}
	
	if($.trim($('#bkdVoyage').val())!=''){
		return true;
	}
	
	if($.trim($('#bkdDirection').val())!=''){
		return true;
	}*/
	
	if($.trim($('#specialInstruction').val())!=''){
		return true;
	}
	
	return false;
}

function setAutoBillMandatory(){
	if($('#shipmentNumber').val() != '' && $('#bookingTypeCode').val()=='B' && 
			($.trim($('#quoteVNConcat').val())=='' || ($.trim($('#quoteVNConcat').val())!='' &&  
					$("#isConstructedQuote").val()!='Y'))){
		if($('#isAutobill :selected').val()=="true"){
			if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"){
				setMandatoryTariffCmdDesc();
			}
			/*else{
				resetMandatoryTariffCmdDesc();
				resetTariffDetails();
			}*/
			
		}
	}
}

function modifyFrtOnCstmrGrpLoadDschGrpCodeChange(changeSource, lastCustomerGroup, currentCustomerGroup, lastLoadDschGroup, currentLoadDschGroup, isAllowBookingUnit){
	if(commodityTypeChanged(changeSource, lastCustomerGroup, currentCustomerGroup, lastLoadDschGroup, currentLoadDschGroup, isAllowBookingUnit) && (($('#totalCommodityLines').text()!='' 
		&& $('#totalCommodityLines').text()!='0') || (($('#totalCommodityLines').text()=='' || $('#totalCommodityLines').text()=='0') && checkIfAnyFreightFieldHasValue()))){
		if(!addFreightEnabled()){
			if ($('#tariff').is(':visible')) {
				$($('.booking-section')[4]).accordion('option', 'active', false);
			}
			//var disabled = $($('.booking-section')[4]).accordion("option", "disabled");
			//if (!disabled) {
				disableAccordian(4);
			//}
			return;
		}
		else{
			if ($('#tariff').is(':visible')) {
				$($('.booking-section')[4]).accordion('option', 'active', false);
			}
		}
		blockUI();
		$.ajax({
			url: _context +"/booking/freight/modifyFrtOnCstmrGrpLoadDschGrpCodeChange?customerGroup="+$('#customerGroupId :selected').text()+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val())+"&isAllowBookingUnit="+$('#isAllowBookingUnit').val(),
			success: function(responseText){
				if(responseText.success){
					if(povChanged=="Y"){//Defect-25516
						clearFreight();
						$('#hazGrid').html('');
						$('#maintainBookingCommodityId').html('');
						$('#actualTotalChargeAmount').html('');
						$('#actualTotalChargeAmount').html('');
						}
					$('#equipmentGrid').trigger("reloadGrid");
					$('#hazGrid').trigger("reloadGrid");
					$('#tcnGrid').trigger("reloadGrid");
					
					var isPOV = (($('#customerGroupId :selected').text()==POV_NAME ||$('#customerGroupId :selected').text()==ALASKA_POV_NAME )&& $.trim($('#loadDschServiceGroupCode').val())=="AU");
					var isConventional = ($.trim($('#loadDschServiceGroupCode').val())=="CON" || $.trim($('#loadDschServiceGroupCode').val())=="LCL");
					if(!isPOV && !isConventional){
						$('#vinNumber').val('');
						$('#vehicleYear').val('');
						$('#vehicleMake').val('');
						$('#vehicleModel').val('');
						$('#vehicleLicenseNumber').val('');
						$('#vehicleLicenseStateCode').val('');
						$('#vehicleColor').val('');
						$('#vehicleDescription').val('');
						$('#estimatedDropOffDate').val('');
						$('#bkdVessel').val('');
						$('#bkdVoyage').val('');
						$('#bkdDirection').val('');
						$('#recdVessel').val('');
						$('#recdVoyage').val('');
						$('#recdDirection').val('');
						$('#specialInstruction').val('');
					}
				}
				else{
					//iterated = true;
					//$($('.booking-section')[4]).accordion("enable");
					$('#msgDiv').html('<div class="message_error">'+responseText.messages.error[0]+'</div>');
					triggerErrorMessageAlert('msgDiv');
				}
				iterated = false;
				$.unblockUI();
			}
		});
	}
	else{
		var status = checkIfAnyFreightFieldHasValue();
		//alert("Status: " + status);
		if (!status) {
			if ($('#tariff').is(':visible')) {
				if (!addFreightEnabled()) {
					$($('.booking-section')[4]).accordion('option', 'active', false);
					disableAccordian(4);
				} else {
					showFreight($.trim($('#customerGroupId :selected').text()));
				}
			}
			if (!$('#tariff').is(':visible')) {
				commodityShowHide();
			}
		}
	}
	$('#lastCustomerGroupId').val($('#customerGroupId').val());
	
	if((currentCustomerGroup==GOVERNMENT_NAME) && (currentLoadDschGroup=='CON' || currentLoadDschGroup=='LCL') && isAllowBookingUnit=="Y"){
		if($("#tcnGrid").getGridParam("records")!=0)
		setIBSCodeMandatory();
	}
	else{
		resetIBSCode();
	}
}

function commodityTypeChanged(changeSource, lastCustomerGroup, currentCustomerGroup, lastLoadDschGroup, currentLoadDschGroup, isAllowBookingUnit){
	if(changeSource=='customerGroup'){
		if(lastCustomerGroup!='Select' && currentCustomerGroup=='Select'){
			return true;
		}
		if((lastCustomerGroup!=POV_NAME && currentCustomerGroup==POV_NAME && currentLoadDschGroup=="AU")
		|| (lastCustomerGroup!=ALASKA_POV_NAME && currentCustomerGroup==ALASKA_POV_NAME && currentLoadDschGroup=="AU")){
			povChanged="Y";//Defect-25516
			return true;
		}
		if((lastCustomerGroup==POV_NAME && currentCustomerGroup!=POV_NAME && currentLoadDschGroup=="AU")
		|| (lastCustomerGroup==ALASKA_POV_NAME && currentCustomerGroup!=ALASKA_POV_NAME && currentLoadDschGroup=="AU")){
			povChanged="Y";
			return true;
		}
		if(lastCustomerGroup!=GOVERNMENT_NAME && currentCustomerGroup==GOVERNMENT_NAME && (currentLoadDschGroup=='CON'||currentLoadDschGroup=='LCL' ) && isAllowBookingUnit=="Y"){
			return true;
		}
		if(lastCustomerGroup==GOVERNMENT_NAME && currentCustomerGroup!=GOVERNMENT_NAME && (currentLoadDschGroup=='CON'||currentLoadDschGroup=='LCL') && isAllowBookingUnit=="Y"){
			return true;
		}
	}
	else if(changeSource=='loadDschGroup'){
		if(lastLoadDschGroup!='' && currentLoadDschGroup==''){
			return true;
		}
		if(lastLoadDschGroup!='' && lastLoadDschGroup!='CY' && currentLoadDschGroup=='CY'){
			return true;
		}
		if(lastLoadDschGroup!='' && lastLoadDschGroup!='CON' && currentLoadDschGroup=='CON'){
			return true;
		}
		if(lastLoadDschGroup!='' && lastLoadDschGroup!='LCL' && currentLoadDschGroup=='LCL'){
			return true;
		}
		if(lastLoadDschGroup!='' && lastLoadDschGroup!='AU' && currentLoadDschGroup=='AU' && (currentCustomerGroup==POV_NAME || currentCustomerGroup==ALASKA_POV_NAME )){
			//Defect-25528-to clear commodity grid vlaues on changing the booking to POV booking
			povChanged="Y";
			return true;
		}
		if(lastLoadDschGroup!='' && lastLoadDschGroup!='AU' && currentLoadDschGroup=='AU' && (currentCustomerGroup!=POV_NAME ||currentCustomerGroup!=ALASKA_POV_NAME  )){
			return true;
		}
	}
	return false;
}

function freightDeleteCheckOnBookingSave(){
	
	if(povCheckOnBookingSave()=='failure'){
		return 'failure';
	}
	
	var freightDeleteCheckStatus = 'success';
	var isCustomerGroupValueSelect = $('#customerGroupId option[value='+$('#customerGroupId').val()+']').text()=='Select'?true:false;
	var isLoadDschGroupBlank = $.trim($('#loadDschServiceGroupCode').val())==''?true:false;
	if(((isCustomerGroupValueSelect)||(isLoadDschGroupBlank)) && $('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0'){
	var confirmMessage = '';
	if(isCustomerGroupValueSelect){
		confirmMessage = "Commodity(s) will be deleted as no customer group is present. Please confirm to proceed!";
	}
	else if(isLoadDschGroupBlank){
		confirmMessage = "Commodity(s) will be deleted as no load dischargde group is present. Please confirm to proceed!";
	}
	var isConfirm = confirm(confirmMessage);
	if(isConfirm){
		removeCommodities();
		if (!$('#tariff').is(':visible')) {
			disableAccordian(4);
		}
	}
	else{
		freightDeleteCheckStatus = 'failure';
	}
	return freightDeleteCheckStatus;
	}
}

function povCheckOnBookingSave(){
	var status = 'success';
	if($.trim($('#loadDschServiceGroupCode').val())=="AU"
	&& ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME)){
		if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0' && parseInt($.trim($('#totalCommodityLines').text()))>1){
			$('#msgDiv').html('<div class="message_error">Adding more than one commodity for customer group- POV is not allowed.</div>');
			triggerErrorMessageAlert('msgDiv');
			status = 'failure';
		}
	}
	return status;
}

function getFeetFromInches(inches) {
	if (inches == "") {
		inches = 0;
	}

	var extraFeet = 0;
	if (inches >=12) {
		remainingInches = inches % 12;
		extraFeet = Math.round((inches-remainingInches)/ 12);
	}
	return extraFeet;
}

function getModInches(inches) {
	if (inches == "") {
		inches = 0;
	}

	if (inches >=12) {
		inches = Math.round(inches % 12);
	}
	return inches;
}
var domesticForeignIndicator = "none";



$(function() {

	var assignOrCreate="";
	//$('#shipmentForm').validationEngine('attach');	// it has been used on Go button click for removing PopUp on page load
	//$('#shipmentNumber').val('');
	
	
	$('#shipmentSequenceNumber').attr('disabled', false);
	$('#shipmentCorrectionNumber').attr('disabled', true);
	setDefaultForShipmentStatus();

	shipmentNumberPredictive();
	
	sequenceNumberPredictive();
	
	holdPredictive();	
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		//$('#shipmentSequenceNumber').attr('disabled', true);
		$('#shipmentCorrectionNumber').attr('disabled', true);
		$('#anyChangesDone').val("Y");
		dirtyData=false;
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
		$('#anyChangesDone').val("Y");
		dirtyData=false;
	});
	$('#shipmentCorrectionNumber').change(function() {
		$('#anyChangesDone').val("Y");
		dirtyData=false;
	});
	
	// validate address roles based on trade
	$('#tradeCode').change(function() {
		if($('tradeCode').val()!=''){
			validateShipmentTrade();
		}
		
		setDomesticForeignIndicator();
	});
	
	// validate address roles based on trade
	$('#shipmentStatusCode').change(function() {
		checkIfTemplateToBeDisabled();
		isShipmentDeletable();
		if($('#shipmentStatusCode').val()!=''){
			var valid = validateShipmentStatusForActor();
			if(valid == true){
				$('#msgDiv').html("");
				$('#msgDiv').hide();
				validateShipmentStatusForActorOnServer();
			}else{
				$('#msgDiv').html("<div class=\"message_error\">New shipment status not valid for previous status.</div>");
				$('#msgDiv').show();
			}
		}
	});
	$('#rateDate').change(function() {
		updateFreightRateDate();
	});
	
	enableEnterEvent();
	//D026991,Fix for calendar date, which should show latest date instead of future date.
	//$("#rateDate").datepicker({ maxDate: getCurrentDate()});
	 $('#rateDate').datepicker({ dateFormat: 'mm-dd-yy',maxDate:"+0" });
});

var obj;
var TAB = 9;
function catchTAB(evt,elem)
{
	obj = elem;
	var keyCode;
	if ("keyCode" in evt){
		keyCode=evt.keyCode;
	}

	if (keyCode == TAB){
		$('#shipmentCorrectionNumber').attr('disabled', false);
		$.ajax({
			type : "POST",
			url : _context +"/shipment/header/shipmentCorrectionNumberList",
			data : {
				shipmentNumber : $("#shipmentNumber").val(),
				shipmentSequenceNumber : $("#shipmentSequenceNumber").val()
			},
			success : function(responseText) {
				var list= responseText.data.shipmentCorrectionNumberList;
				$('#shipmentCorrectionNumber option').remove();								
				$.each(list, function(index,codeDescription) {
					$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				});								
				document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
				//$('#anyChangesDone').val("Y");
				$("#shipmentGoBtn").click();
			}
		});
 
	}
}

function setDefaultForShipmentStatus(){
	//if($("#shipmentNumber").val() == '' || $("#shipmentNumber").val() == null){
	if($("#shipmentId").val() == '' || $("#shipmentId").val() == null){
		$("#shipmentStatusCode").attr("disabled",true);
	}else{
		$("#shipmentStatusCode").attr("disabled",false);
	}
}

function validateShipmentStatusForActor(){
	var savedBKNGStatus = $('#savedShipmentStatusCode').val();
	var requestedBKNGStatus = $('#shipmentStatusCode').val();
	var valid = false;

	if(requestedBKNGStatus=='CANC' ){
		$('#shipmentStatusCode').val(savedBKNGStatus);
		return false;
	}
	
	//CANC to INCP
	if(requestedBKNGStatus=='INCP' ){
		return true;
	}
	
	if(savedBKNGStatus!=''){
		switch(savedBKNGStatus){
		case 'INCP':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
			}
			break;
		case 'PEND':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
			}
			break;
		case 'APPR':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
			}
			break;
		case 'OFFR':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
				case 'APPR':
					return true;
			}
			break;
		case 'CANC':
			switch(requestedBKNGStatus){
				case 'APPR':
					return true;
			}
			break;
		case 'ASGN':
			break;
		}
	}else{
		return true;
	}

	if(valid==false)
		$('#shipmentStatusCode').val(savedBKNGStatus);
	return valid;

}

function validateShipmentStatusForActorOnServer(){
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		type : "POST",
		url : _context +"/shipment/header/status",
		data : queryString + "&requestedShipmentStatus="+ $('#shipmentStatusCode').val(),
		success : function(responseText) {
			showResponseMessages("msgDiv",responseText);
			
		}
	});
}


function validateShipmentTrade(){
	$.ajax({
		type : "POST",
		url : _context +"/shipment/header/trade",
		data : {
			tradeCode : $('#tradeCode').val(),
			shipperAroleId : $('input[name="shipper\\.addressRoleId"]').val(),
			consigneeAroleId : $('input[name="consignee\\.addressRoleId"]').val(),
			pol : $('#originPortCityCode').val(),
			pod : $('#destinationPortCityCode').val()
		},
		success : function(responseText) {
			showResponseMessages("msgDiv",responseText);
		}
	});
}

function removePopUps(){
	$("#shipmentForm").validationEngine('hideAll');
}

function enableDisableBillType() {
	var loadDischargeServiceGroup = $('#loadDischargeServiceGroup').val();
	if (loadDischargeServiceGroup == 'CY' || loadDischargeServiceGroup == 'cy') {
		//Modified for Defect D028864
		 if(isHeaderModifiable){
		   $('#billType').attr('disabled', false);
		 }
	} else {
		$('#billType').attr('disabled', true);
	}
}

function enableDisableActionButtons() {
	var status = $('#statusCode').text();
	if($.trim(status) =='' || status==null){
		disableActionButtons();
	}else{
	if (status == 'ISSUED' || status == 'CORRECTED') {
		
		$('#shipmentSaveBtn').attr('disabled', true);
		//$('#shipmentCustomizeBtn').attr('disabled', true); ////against D022376 to enable button on the screen
		$('#shipmentHoldReleaseBtn').attr('disabled', true);
		$('#shipmentBillBtn').attr('disabled', true);
		$('#shipmentChargesBtn').attr('disabled', false);
		$('#shipmentPayablesBtn').attr('disabled', false);
		$('#shipmentCorrectionsBtn').attr('disabled', false);
		//$('#shipmentSendDocBtn').attr('disabled', true);	// for 22735
		$('#shipmentStatusBtn').attr('disabled', false);
		$('#shipmentDeleteBtn').attr('disabled', true);
		$('#shipmentTraceBtn').attr('disabled', false);
		$('#auditRelease').attr('disabled', true);
	} else {
		var unReleaseCount = $("#holdUnreleasedGrid").getGridParam("reccount");
		$('#shipmentSaveBtn').attr('disabled', false);
		//$('#shipmentCustomizeBtn').attr('disabled', false);  //against D022376 to enable button on the screen
		if(unReleaseCount>0){
			$('#shipmentHoldReleaseBtn').attr('disabled', false);
		}else{
			$('#shipmentHoldReleaseBtn').attr('disabled', true);
		}
		
		$('#shipmentBillBtn').attr('disabled', false);
		$('#shipmentChargesBtn').attr('disabled', false);
		$('#shipmentPayablesBtn').attr('disabled', false);
		$('#shipmentCorrectionsBtn').attr('disabled', false);
		//$('#shipmentSendDocBtn').attr('disabled', false);
		$('#shipmentStatusBtn').attr('disabled', false);
		 if (status == 'PENDING' || status == 'DESCRIBED' || status == 'RATED' || status == 'IN AUDIT') {
			$('#shipmentDeleteBtn').attr('disabled', false);
		} else {
			$('#shipmentDeleteBtn').attr('disabled', true);
		}
		$('#shipmentTraceBtn').attr('disabled', false);
		if( status == "IN AUDIT" || status == "F/C AUDIT")
		{
			$('#auditRelease').attr('disabled', false);
			$('#auditRelease').attr('title', $('#auditDesc').val());
		}else
		{
			$('#auditRelease').attr('disabled', true);
		}
	}
	}
}

function disableActionButtons() {		
		$('#shipmentSaveBtn').attr('disabled', true);
		$('#shipmentCustomizeBtn').attr('disabled', true);
		$('#shipmentHoldReleaseBtn').attr('disabled', true);
		$('#shipmentBillBtn').attr('disabled', true);
		$('#shipmentChargesBtn').attr('disabled', true);
		$('#shipmentPayablesBtn').attr('disabled', true);
		$('#shipmentCorrectionsBtn').attr('disabled', true);
		$('#shipmentSendDocBtn').attr('disabled', true);
		$('#shipmentStatusBtn').attr('disabled', true);
		$('#shipmentDeleteBtn').attr('disabled', true);
		$('#shipmentTraceBtn').attr('disabled', true);
		$('#auditRelease').attr('disabled',true);
	}

function updateFreightRateDate() {

	var rateDateOriginal = $('#rateDateOriginal').val();
	var rateDate = $('#rateDate').val();
	var receivedDate = $('#freightReceivedDate').val();
	var freightReceivedDateOriginal=$('#freightReceivedDateOriginal').val();
	if (((rateDateOriginal != rateDate) && ((freightReceivedDateOriginal == null) ||( freightReceivedDateOriginal == '')))) {
	    // D025429, receivedFreightDate needs to be in MM-dd-yyyy format
		$('#freightReceivedDate').val(isValidDate(rateDate));
	}
}
function enableDisableRateDate(){
	if(isRateDateModifiable==true && isRateDateDisplayOnly==true){
		$("#rateDate").css('visibility','visible');
		$("#rateDate").attr('disabled',false);
	}else if (isRateDateModifiable==false && isRateDateDisplayOnly==true){
		$("#rateDate").css('visibility','visible');
		$("#rateDate").attr('disabled',true);
	}else if (isRateDateModifiable==false && isRateDateDisplayOnly==false){
		$("#rateDate").css('visibility','hidden');
	}
} 

function clearDefaultDate(){
	
	if($('#freightReceivedDate').val()=='01-01-0001'){
		$('#freightReceivedDate').val("");
	}
	if($('#rateDate').val()=='01-01-0001'){
		$('#rateDate').val("");
	}
}

function clearHeaderData() {
	document.getElementById("tradeCodeDesc").innerText ="";
	$('#freightReceivedDate').val("");
	document.getElementById("shipmentTemplateNumber").innerText ="";
	document.getElementById("statusCode").innerText ="";
	$('#customerGroupId option').remove();	
	document.getElementById("billType").selectedIndex=0;
}
function checkForChangeInShipment(templateNumber)
{
	if($('#anyChangesDone').val()=='Y'){
		var isConfirm = confirm("All the unsaved Changes will be discarded. Continue?");
		if(isConfirm)
			document.location.href= _context + "/booking/template/showTemplateForm?templateNumber="+templateNumber;
	}
	else
		document.location.href= _context + "/booking/template/showTemplateForm?templateNumber="+templateNumber;
}
function sequenceNumberPredictive(){
	//var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354&parentSearch='+ $('#shipmentNumber').val();
	 $('#shipmentSequenceNumber').gatesAutocomplete({
		 	source:_context+'/cas/autocomplete.do',
		 	extraParams: {
		 		method: 'searchShpmntSeqNo',
		 		searchType: '354',
		 		parentSearch: function(){return  $('#shipmentNumber').val();}
		 	},
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipmentSequenceNumber').val(data.sequenceNo);
				$('#shipmentCorrectionNumber').attr('disabled', false);
				$.ajax({
					type : "POST",
					url : _context +"/shipment/header/shipmentCorrectionNumberList",
					data : {
						shipmentNumber : $("#shipmentNumber").val(),
						shipmentSequenceNumber : $("#shipmentSequenceNumber").val()
					},
					success : function(responseText) {
						var list= responseText.data.shipmentCorrectionNumberList;
						$('#shipmentCorrectionNumber option').remove();								
						$.each(list, function(index,codeDescription) {
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						});								
						document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
						//$('#anyChangesDone').val("Y");
						$("#shipmentGoBtn").click();
					}
				});
			}
		});
}

function shipmentNumberPredictive(){
	//Shipment# Predictive Search
	//var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355'
	$('#shipmentNumber').gatesAutocomplete({
		minLength: 7,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 		method: 'searchShpmntNoForHeader',
	 		searchType: '355'
	 	},
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			//if($('#shipmentSequenceNumber').val() == null	|| $('#shipmentSequenceNumber').val() == ""){
			//populate seq number and correction number default on shipment number change start
				$.ajax({
					async: false,
					type : "POST",
					url : _context + "/shipment/defaultShipmentSequenceNumber",
					data : {				
						shipment_number :$('#shipmentNumber').val()
					},
					success : function(responseText) {
						var shipmentSequenceNumber=responseText.data;
						$('#shipmentSequenceNumber').val(shipmentSequenceNumber);
						$('#shipmentCorrectionNumber').attr('disabled', false);
						$.ajax({
							type : "POST",
							url : _context +"/shipment/header/shipmentCorrectionNumberList",
							data : {
								shipmentNumber : $("#shipmentNumber").val(),
								shipmentSequenceNumber : $("#shipmentSequenceNumber").val()
							},
							success : function(responseText) {
								var list= responseText.data.shipmentCorrectionNumberList;
								$('#shipmentCorrectionNumber option').remove();								
								$.each(list, function(index,codeDescription) {
									$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								});								
								document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
								//$('#anyChangesDone').val("Y");
							}
						});
					}			
				});
		}
	});
}
function checkActionValidation(){
	if($('#anyChangesDone').val()=='Y'){
		alert("Search filter has been modified.Please search again for the new parameters.");
		//showDisplayAgainBeforeAction();
		return false;
	}
	return true;
}
function showDisplayAgainBeforeAction() {
	$('#msgDiv').html("<div class=\"message_error\">Search filter has been modified.Please search again for the new parameters. </div>");
	$('#msgDiv').show();
}


function enableEnterEvent() {
	$("#shipmentCorrectionNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$("#shipmentGoBtn").click();
			$('#anyChangesDone').val("N");
		}
	});
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$("#shipmentGoBtn").click();
			$('#anyChangesDone').val("N");
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$("#shipmentGoBtn").click();
			$('#anyChangesDone').val("N");
		}
	});
}

function makeFormReadOnly(responseText,formId){
	if(responseText.data.header !=null){
	if(responseText.data.header.statusCode=='ISSUED' || responseText.data.header.statusCode=='CORRECTED'){		
		$('#partiesDialog').gatesDisable();
		$('#partiesAdd').gatesDisable();		
		$('#holdAdd').gatesDisable();
		$('#clausesAdd').gatesDisable();
		$('#specialSerivceAdd').gatesDisable();
		$('#marksAndNumbers').attr("readOnly", true);
		$('#loadServiceCode').attr("readOnly", true);
		$('#dischargeServiceCode').attr("readOnly", true);
		/*$('#marksAndNumbers').attr('readOnly', true);
		$('#marksAndNumbers').attr('readOnly', true);*/
		
		
		/*$("div.ui-pg-div.ui-inline-del").hide();
		$("div.ui-pg-div.ui-inline-edit").hide();*/
		
		$('#del_specialServiceGrid').hide();
		$('#del_holdGrid').hide();
		
		$("#shipperOneTimeCustDiv").html("<img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer");
		$("#consigneeOneTimeCustDiv").html("<img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer");
		
	}else{
		$('#partiesDialog').gatesEnable();
		if(isPartyAdd){
			$('#partiesAdd').gatesEnable();
		}
		if(isHoldManualAdd){
			$('#holdAdd').gatesEnable();
		}
		if(isClausesAdd){
			$('#clausesAdd').gatesEnable();
		}
		if(isSpecialServiceAdd){
			$('#specialSerivceAdd').gatesEnable();
		}
		if(isReferenceNumberMarksUpdate){
			$('#marksAndNumbers').attr("readOnly", false);
		}
		
		$('#loadServiceCode').attr("readOnly", false);
		$('#dischargeServiceCode').attr("readOnly", false);
		/*$('#marksAndNumbers').attr('readonly', false);
		$('#marksAndNumbers').attr('readonly', false);*/
		
	/*	$("div.ui-pg-div.ui-inline-del").show();
		$("div.ui-pg-div.ui-inline-edit").show();*/
		
		
		
		$('#del_specialServiceGrid').show();
		$('#del_holdGrid').show();
		if(isShipperConsigneeModifiable){
			$("#shipperOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('shipper');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");
			$("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");
		}else{
			$("#shipperOneTimeCustDiv").html("<img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer");
			$("#consigneeOneTimeCustDiv").html("<img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer");
		}
	}
	$("#shipmentNumber").attr('disabled', false);
	$("#shipmentGoBtn").attr('disabled', false);
	}
}

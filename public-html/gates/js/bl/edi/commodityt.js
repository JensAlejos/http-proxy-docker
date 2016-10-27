$(function() {
	$('#shipmentForm').validationEngine('attach');

	tabSequence('#shipmentForm');

	setScreenDetails();
	$('#msgDivBill').hide();

	$('#shipmentGoBtn').click(function() {
		showLoadingMessage();
		displayShipment();
	});
   alert ("cpmmpdity");
	// Shipment Save
	$('#shipmentSaveBtn').click(
			function() {
//				if (!$("#shipmentForm").validationEngine('validate')
//						|| !validateShipmentUIFields()) {
//					return;
//				} else {
//					 validateShipment();
					saveShipment();
//				}
			});

	// Exit
	$('#shipmentExitBtn')
			.click(
					function() {
						var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
						if (isConfirm) {
							document.location.href = _context
									+ '/shipment/exit';
						}
					});
	$('#shipmentExitBtn')
	.click(
			function() {
				var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
				if (isConfirm) {
					document.location.href = _context
							+ '/shipment/exit';
				}
			});
	// Shipment Payment
	$('#shipmentChargesBtn').click(function() {
		shipmentHeaderLink('updatepayment/showForm');
	});

	// Customize Name and Address
	$('#shipmentCustomizeBtn').click(function() {
		if ($('#partiesExists').val() == 'true') {
			shipmentHeaderLink("customizednameandaddress/showForm");
		} else {
			alert("No Parties exists.");
		}
	});

	// Shipment Delete
	$('#shipmentDeleteBtn').click(function() {
		deleteShipment();
	});

	$("#ShipmentSendDocBtn").click(
			function() {
				document.location.href = _context
						+ "/shipment/senddocument/create?shipmentNumber="
						+ $("#shipmentNumber").val();
			});
	$("#Commodity").click(
			function() {
				document.location.href = "jsp/bl/edi/edi_commodity_detail.jsp";
			});

	// Enables-disables button- Send Doc
	enableDisableSendDoc();
	//setCustomerGroup();
});

function displayShipment() {
	$.ajax({
		type : "POST",
		url : _context + "/shipment/populateShipment",
		data : {
			shipment_number : $("#shipmentNumber").val(),
			shipment_sequence_number : $("#shipmentSequenceNumber").val(),
			shipment_correction_number : $("#shipmentCorrectionNumber").val(),
		},
		success : function(responseText) {
			// Clear fields of Shipment form and reset the defaults
			clearShipmentForm();
			if (responseText.messages.error.length == 0) {
				// clearing page or setting to default.
				clearPageOnLoad();
				// loading data
				showJSON(responseText);
				// Reloading shipment grids after changing data.
				reloadShipmentGrids();
				// BR - enabling disable Bill Type
				 enableDisableBillType();
				// BR enable disable Action button
				 enableDisableActionButtons();
				 
				// reloadShipmentGrids();
				//				
				// $('#shipmentNumber').val(responseText.data.header.shipmentNumber);
				//				
				// $('#shipmentCustomizeBtn').removeAttr("disabled");
				//				
				// //$('#billOfLadingLink').html("<a
				// href=\"javascript:shipmentHeaderLink('bpOverride/showBPOForm');\">Bill
				// Of Lading</a>");
				//				
				// //TODO - readonly call removed
				// if($('#shipmentStatusCode').val()=='ISSD'||
				// $('#shipmentStatusCode').val()=='CORR'){
				// //update shipment BR-02 [Canceled Shipment cannot be updated.]
				// makeFormReadOnly('shipmentForm',true);
				// }else{
				// makeFormReadOnly('shipmentForm',false);
				// }
				// if(responseText.data.header.billExists=="Y"){
				// collapseAll();
				// createAndLoadBilledFreightGrid();
				// createAndLoadBilledUnitGrid();
				// $("#billStartedButton").show();
				// $("#billOverlayContent").hide();
				// $("#billShipmentDialog" ).dialog( "option", "title", 'Billing'
				// );
				// prepareHeaderDataForBillingOverlay(responseText);
				// $("#billShipmentDialog").dialog('open');
				// }
				//
				// if(responseText.data.shipperNameAddressCustomized){
				// $('input[name="shipper\\.organizationName"]').css('color',
				// 'green');
				// }
				// if(responseText.data.consigneeNameAddressCustomized){
				// $('input[name="consignee\\.organizationName"]').css('color',
				// 'green');
				// }
				// //checkIfQuoteShowLinkToBeShown();
				// }else{
				// clearPageOnLoad();
				// //Set shipment title to default if shipment doesn't exists
				// setShipmentTitle(null);
				// }
				// $("#shipmentNumber").attr("disabled",false);
				// //Messages
				// showResponseMessages("msgDiv", responseText);
				// $('#commentsDiv').show();
				//			
				// $("#updatepayment").removeAttr("disabled");
				//			
				// //Enables-disables button- Send Doc
				enableDisableSendDoc();

				// Display Unreleased Holds Grid on initial display
				 openUnreleasedHoldGridOnIntialDisplay("shipment");
			}
		}
	});
}

function clearPageOnLoad() {
	$('#shipmentForm').clearForm();
	clearShipperConsignee();
	resetDivNames();
	reloadShipmentGrids;
	resetDefault();
	//$("#shipmentStatusCode").attr("disabled", true);
}

function clearShipperConsignee() {
	$('input[name="shipper\\.addressRoleId"]').val("");
	$('input[name="consignee\\.addressRoleId"]').val("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
}

function resetDivNames() {
	// $("#shipperConsigneeNameDiv").html("<b>Shipper Consignee</b>");
	 setAccordianTabDetails("shipperNameDiv", "Shipper");
	 setAccordianTabDetails("consigneeNameDiv", "Consignee");
	 setAccordianTabDetails("partiesHeader", "Parties");
	 setAccordianTabDetails("refAndMarksId", "Reference Numbers/Marks");
	 setAccordianTabDetails("routingHeader", "Routing VVD");
	// setAccordianTabDetails("maintainShipmentCommodityId", "Commodity");
	// setAccordianTabDetails("maintainShipmentMilitaryId", "Military");
	 setAccordianTabDetails("splServicesHeader", "Special Services");
	// setAccordianTabDetails("clauseHeader", "Clauses");
	// setAccordianTabDetails("maintainShipmentHoldId", "Hold");
	 setAccordianTabDetails("ShipmentOverridesText", "Shipment Overrides");
}

function prepareHeaderDataForBillingOverlay(responseText) {
	$("#billShipmentNumber").text($("#shipmentNumber").val());
	$("#billShipper").text($('input[name="shipper\\.organizationName"]').val());
	$("#billConsignee").text($('input[name="consignee\\.organizationName"]').val());
	$("#billPlaceOfReceipt").text($("#blOriginCityCode").val());
	$("#billPlaceOfDelivery").text($("#blDestinationCityCode").val());
	$("#billPortOfLoading").text($("#originPortCityCode").val());
	$("#billPortOfDischarge").text($("#destinationPortCityCode").val());
	$("#billLDSP").text($("#loadServiceCode").val() +" "+ $("#dischargeServiceCode").val());
	$("#billBooked").text(responseText.data.header.booked);
	$("#billReceived").text(responseText.data.header.received);
	$("#billPreReceived").text(responseText.data.header.preReceived);
	$("#billBilled").text(responseText.data.header.billed);
}

function showLoadingMessage() {
	$('#msgDiv').html("<div class=\"message_info\">Loading shipment "+ $("#shipmentNumber").val()+"-"+$("#shipmentSequenceNumber").val()+"-"+$("#shipmentCorrectionNumber").val() +" ...</div>");
	$('#msgDiv').show();
}

function showSavingMessage() {
	$("#shipmentSaveBtn").attr("disabled", true);
	var entity="Shipment";
		$('#msgDiv').html("<div class=\"message_info\">Please wait while "+ entity +" is updated...</div>");
	window.scrollTo(0, 0);
	$('#msgDiv').show();
}

// common method for all UI fields...
function validateShipmentUIFields() {
	var uiFieldsValidationStatus = true;

	uiFieldsValidationStatus = validateShipmentNumber();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;

	uiFieldsValidationStatus = validateContactForShipperConsignee('shipper');
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;

	uiFieldsValidationStatus = validateContactForShipperConsignee('consignee');
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;

	uiFieldsValidationStatus = validatePartiesSectionOnSave();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;

	uiFieldsValidationStatus = validateRoutingFieldsOnSave();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
	
	uiFieldsValidationStatus = validateOverridesFieldsOnSave();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	
	return uiFieldsValidationStatus;
}
function validateShipmentNumber() {
	// if($('#shipmentNumberHidden').val()!= $('#shipmentNumber').val() &&
	// $('#BillTypeCode').val()=='B'){
	// $('#shipmentNumber').validationEngine('showPrompt', 'Shipment must be
	// saved/loaded first.', 'error', 'topRight', true);
	// return false;
	// }
}
function validateShipment() {
	// if($('input[name="shipper\\.addressRoleId"]').val()=="" &&
	// $('input[name="consignee\\.addressRoleId"]').val()==""){
	// saveShipment();
	// }else{
	// if($('#refNumOverRideForShipper').val()=="N" ||
	// $('#refNumOverRideForShipper').val()==""
	// || $('#refNumOverRideForConsignee').val()=="N" ||
	// $('#refNumOverRideForConsignee').val()==""){
	// validateShipmentReferenceNumber();
	// }else{
	// saveShipment();
	// }
	// }
}

function validateShipmentReferenceNumber() {
	var shipment = $('#shipmentForm').formSerialize();
	var urlStr = _context + "/Shipment/validate";
	$
			.ajax({
				type : "POST",
				url : urlStr,
				data : shipment,
				success : function(responseText) {
					if (responseText.messages.error.length > 0) {
						for ( var i = 0; i < responseText.messages.error.length; i++) {
							if (responseText.messages.error[i] == 'shipper.ref.error') {
								var overRide = confirm("Shipper requires reference number. Confirm override (Y or N)");
								if (overRide == true) {
									$('#refNumOverRideForShipper').val("Y");
									saveShipment();
								} else {
									$('#refNumOverRideForShipper').val("N");
								}
							} else if (responseText.messages.error[i] == 'consignee.ref.error') {
								var overRide = confirm("Consignee requires reference number. Confirm override (Y or N)");
								if (overRide == true) {
									$('#refNumOverRideForConsignee').val("Y");
									saveShipment();
								} else {
									$('#refNumOverRideForConsignee').val("N");
								}
							}
						}
					} else {
						saveShipment();
					}
				}
			});
}

function saveShipment(){
	showSavingMessage();
	var shipment = $('#shipmentForm').formSerialize();
	var urlStr = '';
	//if($('#shipmentTypeCode').val()=='B'){
		urlStr = _context +"/shipment/save";
	//}else if($('#shipmentTypeCode').val()=='T'){
		//urlStr = _context +"/shipment/saveTemplate";
	//}
	
		alert("Save..........");
	$.ajax({
		type: "POST",
		url: urlStr,
		data: shipment,
		success: function(responseText){
			alert("In Save success")
				$("#shipmentSaveBtn").attr("disabled",false);
				if(responseText.success==true){
		
					//Complete If commented by Mangesh
					/*
					$("#shipmentStatusCode").attr("disabled",false);
					if($("#shipmentStatusCode").val()=='CANC'){
						//TODO - readonly call removed
						makeFormReadOnly('shipmentForm',true);
						$('#msgDiv').show();
					}else{
						//TODO - readonly call removed
						makeFormReadOnly('shipmentForm',false);//TODO
					}
					$("#shipmentId").val(responseText.data.shipmentId);
					if($('#shipmentTypeCode').val()=='T'){
						$("#shipmentTemplateId").val(responseText.data.shipmentTemplate.shipmentTemplateId);
						$('#templateDelete').attr('disabled',false);
					}//Block Commented by Mangesh it is no use. 
					// Comment ID
					$("#commentId").val(responseText.data.commentId);
					if(undefined != responseText.data.header.shipmentNumber && null!=responseText.data.header.shipmentNumber){
						$("#shipmentNumber").val(responseText.data.header.shipmentNumber);
						setShipmentTitle(responseText.data.header.shipmentNumber);
					}
					//Setting Booked Date, Time & user and Last Update Date, Time & user
					if(responseText.data.header.createDateTime!=null){
						$("#bookedDateTimeUser").html(responseText.data.header.createDateTime+ " &nbsp;&nbsp;&nbsp;$" + responseText.data.createUser);
					}
					if(responseText.data.header.lastUpdateDateTime!=null){
						$("#lastUpdateDateTimeUser").html(responseText.data.header.lastUpdateDateTime+ " &nbsp;&nbsp;&nbsp;$" + responseText.data.lastUpdateUser);
					}
					$("#savedShipmentStatusCode").val(responseText.data.header.savedShipmentStatusCode);
					
					$("#marksAndNumbers").val(responseText.data.header.marksAndNumbers);
					$('#commentsDiv').show();
					if(responseText.data.header.quoteNumber!=null && (responseText.data.header.quoteNumber == responseText.data.header.shipmentNumber)){
						$('#quoteVNConcat').val(responseText.data.header.quoteNumber);//+"."+responseText.data.header.quoteVersion);
						$('#quotePopUpSearch').hide();
					}else{
						$('#quotePopUpSearch').show();
					}
					//set assign quote link
					if(responseText.data.header.shipmentNumber == '' || responseText.data.header.shipmentNumber == null || responseText.data.header.shipmentNumber==responseText.data.header.quoteNumber){
						$('#assignLink').html("Assign Quote");
					}else{
						if(responseText.data.header.quoteNumber =='' || responseText.data.header.quoteId ==''){
							$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
						}else{
							$('#assignLink').html("<a href=\"javascript:removeAssignQuote();\">Remove Quote</a>");
						}
						// enable link for BKPO when shipment has saved.
						if(responseText.data.header.shipmentNumber != '' || responseText.data.header.shipmentNumber != null){
							$('#billOfLadingLink').html("<a href=\"javascript:shipmentHeaderLink('bpOverride/showBPOForm');\">Bill Of Lading</a>");
						}
					}
					$("#shipmentStatusCode").val(responseText.data.header.shipmentStatusCode);
					
					if ((responseText.data.header.shipmentNumber != "")
							&& (responseText.data.header.shipmentNumber != null))
						$('#customizeNameAddress').removeAttr("disabled");
					isShipmentDeletable();
					$("#updatepaymentBtn").removeAttr("disabled");
					// Reload hold Grid
					loadHoldGrid('D');
					$('#partiesExists').val(responseText.data.partiesExists);
					$('#shipmentNumberHidden').val(responseText.data.header.shipmentNumberHidden);
					$('#quoteVNConcatHidden').val(responseText.data.header.quoteVNConcatHidden);

					if(responseText.data.shipper.organizationName!='' && responseText.data.shipper.organizationName!=null)
						setShipperDivName(" - " +responseText.data.shipper.organizationName);
					if(responseText.data.consignee.organizationName!='' && responseText.data.consignee.organizationName!=null)
						setConsigneeDivName(" - " +responseText.data.consignee.organizationName);

					//Enables-disables button- Send Doc
					enableDisableSendDoc();
					processChangeSource();
					
					//Sets lastOriginPortCityCode and lastDestinationPortCityCode
					$("#lastOriginPortCityCode").val(responseText.data.routing.lastOriginPortCityCode);
					$("#lastDestinationPortCityCode").val(responseText.data.routing.lastDestinationPortCityCode);
					disableCreateShipmentFromQuote();
				*/}else{
					$("#shipmentStatusCode").attr("disabled",true);
				}
				showResponseMessages("msgDiv",responseText);
		}
	});
}

function setShipmentTitle(shipmentNumber) {
	// Workaround to fix dynamic setting of page title
	window.location = _context + "/shipment/showForm#" + new Date().getTime();

	var shipmentTitle = $('title').text().split("-");
	if (shipmentNumber != null && shipmentNumber != '') {
		var shipmentSequenceNumber = $("#shipmentSequenceNumber").val();
		var shipmentCorrectionNumber = $("#shipmentCorrectionNumber").val();
		document.title = shipmentTitle[0] + " - " + shipmentNumber + "-"
				+ shipmentSequenceNumber + "-" + shipmentCorrectionNumber;
	} else {
		document.title = shipmentTitle[0];
	}
}

function removePopUps() {
	$("#shipmentForm").validationEngine('hideAll');
}

function showJSON(responseText) {
	setShipmentTitle(responseText.data.header.shipmentNumber);

	//Shipment Id
	$("#shipmentId").val(responseText.data.shipmentId);
	
	//Header
	$("#shipmentHeaderDiv").loadJSON(responseText.data.header);
	loadShipmentHeader(responseText);
	
	 //Shipper
	$("#shipper").loadJSON(responseText.data.shipper);
	loadAdditionalShipperDetails(responseText);
	
	//Consignee
	$("#consignee").loadJSON(responseText.data.consignee);
	loadAdditionalConsigneeDetails(responseText);
		
	//Parties
	$("#maintainShipmentParties").loadJSON(responseText.data.parties);
	debtorCode = $('#prepaidCollectCode :selected').val();
	
	setPartiesHeader();
	setRefAndMarks();
	$("#ratedDate").val(responseText.data.header.ratedDate);
		 
	//MarksNumbers
	$("#marksAndNumbers").val(responseText.data.header.markNumberString);
		
	//Routing
	$("#maintainShipmentRouting").loadJSON(responseText.data.routing);
	$("#maintainShipmentOverrides").loadJSON(responseText.data.routing);//Commented By Mangesh:test
	setGlobalVariableValues();
	changeTextColour();
	setOverridesHeader();
	populateLoadDischargeLists(responseText.data.routing);
	processChangeSource();
	$('#isInBond').trigger('change');
	if(responseText.data.header.requiredDeliveryDate!=null && responseText.data.header.requiredDeliveryDate!=''){
		$("#requiredDeliveryDate").val(responseText.data.header.requiredDeliveryDate);
	}
	else{
		$("#requiredDeliveryDate").val('');
	}
	//	
	// //Commodity
	// $("#maintainShipmentCommodity").loadJSON(responseText.data.header);
	//	
	// //Military
	// $("#maintainShipmentMilitary").loadJSON(responseText.data.header);
	// $("#maintainShipmentMilitary").loadJSON(responseText.data.militaryShipment);
	// $('#militaryIbsStatusCode').trigger('change');
	// $('#militaryPortCallFileNumber').trigger('change');
	// //RDD
	// if(responseText.data.militaryShipment.requiredDeliveryDate!=null &&
	// responseText.data.militaryShipment.requiredDeliveryDate!=''){
	// $("#milRequiredDeliveryDate").val(responseText.data.militaryShipment.requiredDeliveryDate);
	// }
	// else{
	// $("#milRequiredDeliveryDate").val('');
	// }
	// /*if(responseText.data.tcnExists){
	// setIBSCodeMandatory();
	// }
	// else{
	// resetIBSCode();
	// }*/
	//	
	// //Shipment Overrides
	 $("#maintainShipmentOverrides").loadJSON(responseText.data.routing);
	//	
	// $('#commentsDiv').show();
	// if($("#shipmentStatusCode").val()=='APPR' &&
	// responseText.data.header.billExists=="N")
	// expandAll();
	// else
	// collapseAll();
	//
	// if(responseText.data.shipper.organizationName==null)
	// responseText.data.shipper.organizationName ='';
	// if(responseText.data.consignee.organizationName==null)
	// responseText.data.consignee.organizationName='';
	//
	// //$("#shipperConsigneeNameDiv").html("<div style=\"float:left;\"
	// id=\"shipperDiv\"><b>Shipper "+
	// responseText.data.shipper.organizationName +" </div><div
	// id=\"consigneeDiv\" >&nbsp;&nbsp;&nbsp;&nbsp;Consignee "+
	// responseText.data.consignee.organizationName +"</div></b>");
	// updateShipperConsigneeNames(responseText);
	// isShipmentDeletable();
	//
	// $('#partiesExists').val(responseText.data.partiesExists);
	// $('#shipmentNumberHidden').val(responseText.data.header.shipmentNumberHidden);
	//	
	// if(responseText.data.shipper.organizationName!='')
	// setShipperDivName(" - " +responseText.data.shipper.organizationName);
	// if(responseText.data.consignee.organizationName!='')
	// setConsigneeDivName(" - " +responseText.data.consignee.organizationName);
	//	
	// //Added method for Marks Header Checkbox
	// if(responseText.data.marksAndNumbers=='' ||
	// responseText.data.marksAndNumbers==null){
	// $('#marksHeaderCheckBox').attr('checked', false);
	// }else{
	// $('#marksHeaderCheckBox').attr('checked', true);
	// }
	//	
	// enableScreenForDealer();
}

function setShipperCommMethodValue(shipper) {
	 if(shipper.communicationMethodCode=='P'){
	 $('#shipperComm1').attr('checked', true);
	 $('#shipperComm1').val("P");
	 }
	 else if(shipper.communicationMethodCode=='C'){
	 $('#shipperComm2').attr('checked', true);
	 $('#shipperComm2').val("C");
	 }
	 else if(shipper.communicationMethodCode=='F'){
	 $('#shipperComm3').attr('checked', true);
	 $('#shipperComm3').val("F");
	 }
	 else if(shipper.communicationMethodCode=='E'){
	 $('#shipperComm4').attr('checked', true);
	 $('#shipperComm4').val("E");
	 }
}

function setConsigneeCommMethodValue(consignee) {
	 if(consignee.communicationMethodCode=='P'){
	 $('#consigneeComm1').attr('checked', true);
	 $('#consigneeComm1').val("P");
	 }
	 else if(consignee.communicationMethodCode=='C'){
	 $('#consigneeComm2').attr('checked', true);
	 $('#consigneeComm2').val("C");
	 }
	 else if(consignee.communicationMethodCode=='F'){
	 $('#consigneeComm3').attr('checked', true);
	 $('#consigneeComm3').val("F");
	 }
	 else if(consignee.communicationMethodCode=='E'){
	 $('#consigneeComm4').attr('checked', true);
	 $('#consigneeComm4').val("E");
	 }
}

// post-submit callback
function showResponseMessages(msgDivId, responseText) {
	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {

				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
	}
}

function selectForFormSerialize(radioButtonObj, value) {
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}

// function to reset default values in form (in case clearForm() is called)
function resetDefault() {
	$('select').attr('selectedIndex', 0);

}

function populateLoadDischargeLists(routingData)
{
	lastLoadService = routingData.loadServiceCode;
	lastDischargeService = routingData.dischargeServiceCode;
	
	if(routingData.loadServiceCode!=null && routingData.loadServiceCode!='' && routingData.dischargeServiceCode!=null && routingData.dischargeServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getDischargeServices?loadService="+routingData.loadServiceCode,
			success: function(responseTextDischageList){
				setLoadDischargeValues(responseTextDischageList.data, '#dischargeServiceCode', routingData.dischargeServiceCode);
				$.ajax({
					url: _context +"/shipment/routing/getLoadServices?dischargeService="+routingData.dischargeServiceCode,
					success: function(responseTextLoadList){
						setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', routingData.loadServiceCode);
						//Set Load Discharge group Code
						setLoadDischargeGroupCode(routingData.loadServiceCode, routingData.dischargeServiceCode);
						setRoutingHeader();
					}
				});
			}
		});
	}
	else if(routingData.loadServiceCode!=null && routingData.loadServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getDischargeServices?loadService="+routingData.loadServiceCode,
			success: function(responseTextDischageList){
				setLoadDischargeValues(responseTextDischageList.data, '#dischargeServiceCode', routingData.dischargeServiceCode);
				$.ajax({
					url: _context +"/shipment/routing/getAllLoadServices",
					success: function(responseTextLoadList){
						setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', routingData.loadServiceCode);
						setRoutingHeader();
					}
				});
			}
		});
	}
	else if(routingData.dischargeServiceCode!=null && routingData.dischargeServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getLoadServices?dischargeService="+routingData.dischargeServiceCode,
			success: function(responseTextLoadList){
				setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', routingData.loadServiceCode);
				$.ajax({
					url: _context +"/shipment/routing/getAllDischargeServices",
					success: function(responseTextDischargeList){
						setLoadDischargeValues(responseTextDischargeList.data, '#dischargeServiceCode', routingData.dischargeServiceCode);
						setRoutingHeader();
					}
				});
			}
		});
	}
	else
	{
		$.ajax({
			url: _context +"/shipment/routing/getAllLoadServices",
			success: function(responseTextLoadList){
				setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', routingData.loadServiceCode);
				setRoutingHeader();
			}
		});
		
		$.ajax({
			url: _context +"/shipment/routing/getAllDischargeServices",
			success: function(responseTextDischargeList){
				setLoadDischargeValues(responseTextDischargeList.data, '#dischargeServiceCode', routingData.dischargeServiceCode);
				setRoutingHeader();
			}
		});
	}
}


function isShipmentDeletable() {
	if ($('#shipmentId').val() != null && $('#shipmentId').val() != ''
			&& $('#savedShipmentStatusCode').val() == 'CANC') {
		$("#shipmentDeleteBtn").attr("disabled", true);
	}
}

function deleteShipment() {
	$.ajax({
		type : "POST",
		url : _context + "/shipment/delete",
		data : {
			shipmentNumber : $("#shipmentNumber").val(),
			shipmentId : $('#shipmentId').val(),
		},
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
				clearAndResetShipmentScreen();
				$('#shipmentCustomizeBtn').removeAttr("disabled");
				// we have to call it seperately bcoz we do not want it to
				// execute everytime showJSON runs.
				// getTemplateNumberForId();
				reloadShipmentGrids();
				clearHeaderData();
				$('#commentsDiv').hide();
				// $("#shipperConsigneeNameDiv").html("<b>Shipper
				// Consignee</b>");
				// setShipmentTitle("");
				$("#shipmentDeleteBtn").attr("disabled", true);
				resetDivNames();
				// TODO - readonly call removed
				makeFormReadOnly('shipmentForm', false);
			}
			// Messages
			showResponseMessages("msgDiv", responseText);
			$('#msgDivBill').show();
		}
	});
}

// common method for reloading all grids for shipment
function reloadShipmentGrids() {
	$("#gridIdForParties").trigger('reloadGrid');
	$("#vvdRoutingGrid").trigger("reloadGrid");
	$("#referenceNumberGrid").trigger('reloadGrid');
	// $("#freightGrid").trigger('reloadGrid');
	// $("#dodaacGrid").trigger('reloadGrid');
	$("#specialServiceGrid").trigger('reloadGrid');
	// $("#gridIdForClauses").trigger('reloadGrid');
	// loadHoldGrid('D');
}

function clearHeaderData() {
}

// common method for making form read only [in case of opening cancelled
// shipment]
function makeFormReadOnly(formId, readOnly) {
	$("#shipmentNumber").attr('readonly', false);
}

// if your form has read only fields at time of load, declare them here [ as
// readOnly true]
function resetReadOnly() {
	// shipper fields
	$('input[name="shipper\\.city"]').attr('readonly', true);
	$('input[name="shipper\\.state"]').attr('readonly', true);
	$('input[name="shipper\\.zip"]').attr('readonly', true);
	// consignee fields
	$('input[name="consignee\\.city"]').attr('readonly', true);
	$('input[name="consignee\\.state"]').attr('readonly', true);
	$('input[name="consignee\\.zip"]').attr('readonly', true);
}
/*
 * function checkIfQuoteShowLinkToBeShown(){
 * if($("#shipmentTemplateId").val()!='' &&
 * $('input[name="consignee\\.addressRoleId"]').val()!=''){ $.ajax({ type :
 * "POST", url : _context +"/shipment/getQuoteCount", data : { aroleId :
 * $('input[name="consignee\\.addressRoleId"]').val() }, success :
 * function(responseText) { quoteCount = responseText.data; if(quoteCount<=0){
 * $("#quoteExistsDiv").hide(); }else if(quoteCount>0){
 * $("#quoteExistsDiv").show(); } } }); }else{ $("#quoteExistsDiv").hide(); } }
 */

function setAccordianTabDetails(id, displayText) {
	$("#" + id).text(displayText);
}

function setScreenDetails() {
	$("#ratedDate").datepicker({dateFormat: 'mm-dd-yy'});

	// // VVD and routing
	 $('#shipmentVVDRoutingDiv').show();
	 //$('#isAutoInlandMove').attr('disabled', false);
	// $('#dealerAuctionLocationCode').attr('disabled', false);
	 //$('#militaryIbsStatusCode').attr('disabled', false);
	 $('#freightMBU').show();
	
	 $('#overrideInitialVesselName').attr('readonly', false);
	 $('#overrideCustomsVesselName').attr('readonly', false);
	 $('#overrideVoyageDirectionSeq').attr('readonly', false);
	 $('#overrideInitialLtvDate').attr('readonly', false);
	
	 $('#overrideInitialLtvDate').datepicker({
	 dateFormat : 'mm-dd-yy'
	 });
}

function expandAll() {
	$('.ui-accordion-content').attr('style', 'display:block');
}
function collapseAll() {
	$('.ui-accordion-content').attr('style', 'display:none');
}

function enableDisableSendDoc() {
	if ($("#shipmentNumber").val() != null && $("#shipmentNumber").val() != "") {
		$("#shipmentSendDocBtn").removeAttr("disabled");
	}
}

function setGlobalVariableValues() {
	 lastOriginPortCode = $('#originPortCityCode').val();
	 lastOriginPortDescription = $('#originPortCityDescription').val();
	 lastOriginPortCodeDescription =
	 $('#originPortCityCodeDescription').val();
	 lastDestinationPortCode = $('#destinationPortCityCode').val();
	 lastDestinationPortDescription =
	 $('#destinationPortCityDescription').val();
	 lastDestinationPortCodeDescription = $(
	 '#destinationPortCityCodeDescription').val();
	
	 if ($('#tradeCode').val() != '') {
	 $('#overridePlaceOfIssue').attr("disabled", true);
	 if ($('#tradeCode').val() == 'G' || $('#tradeCode').val() == 'M')
	 domesticForeignIndicator = "international";
	 else if ($('#tradeCode').val() == 'F') {
	 if ($('#originPortCityCode').val() == '')
	 domesticForeignIndicator = 'none';
	 else {
	 $
	 .ajax({
	 url : "/gates/shipment/routing/validateChinaTrade?cityCode="
	 + $('#originPortCityCode').val(),
	 success : function(responseText) {
	 if (responseText.data == "Y") {
	 domesticForeignIndicator = "china";
	 if ($('#direction').val() == 'E')
	 $('#overridePlaceOfIssue').attr(
	 "disabled", false);
	 } else
	 domesticForeignIndicator = "international";
	 }
	 });
	 }
	 } else
	 domesticForeignIndicator = "domestic";
	 } else
	 domesticForeignIndicator = 'none';
}

function setDivNames() {
	if ($('input[name="shipper\\.organizationName"]').val() != ''
			&& $('input[name="shipper\\.organizationName"]').val() != null)
		setAccordianTabDetails("shipperNameDiv", "Shipper - "
				+ $('input[name="shipper\\.organizationName"]').val());
	else
		setAccordianTabDetails("shipperNameDiv", "Shipper");

	if ($('input[name="consignee\\.organizationName"]').val() != ''
			&& $('input[name="consignee\\.organizationName"]').val() != null)
		setAccordianTabDetails("consigneeNameDiv", "Consignee - "
				+ $('input[name="consignee\\.organizationName"]').val());
	else
		setAccordianTabDetails("consigneeNameDiv", "Consignee");

	 setPartiesHeader();

	 setRefAndMarks();
	setRoutingDiv();
	setOverridesHeader();
	setSpecialServicesDiv();
	// All commented by Mangesh
	/*
	 * setMilitaryDiv();  setClauseDiv();
	 setShipmentHold(); 
	 */
}

function setRoutingDiv() {
	var displayText = "Routing VVD";

	var loadService = "";
	if ($('#loadServiceCode :selected').val() != '')
		loadService = " - " + $('#loadServiceCode option:selected').text();
	var dischargeService = "";
	if ($('#dischargeServiceCode :selected').val() != '')
		dischargeService = " - "
				+ $('#dischargeServiceCode option:selected').text();

	var cities = "";
	if ($('#blOriginCityCodeDescription').val() != '')
		cities = $('#blOriginCityCode').val();
	if ($('#originPortCityCodeDescription').val() != '') {
		if (cities == '')
			cities = $('#originPortCityCode').val();
		else
			cities = cities + " - " + $('#originPortCityCode').val();
	}
	if ($('#destinationPortCityCodeDescription').val() != '') {
		if (cities == '')
			cities = $('#destinationPortCityCode').val();
		else
			cities = cities + " - " + $('#destinationPortCityCode').val();
	}
	if ($('#blDestinationCityCodeDescription').val() != '') {
		if (cities == '')
			cities = $('#blDestinationCityCode').val();
		else
			cities = cities + " - " + $('#blDestinationCityCode').val();
	}
	if (cities != '')
		cities = " | " + cities;

	var vvd = "";
	if ($('#vessel').val() != '')
		vvd = " | " + $('#vessel').val() + " " + $('#voyage').val() + " "
				+ $('#direction').val();

	displayText = displayText + loadService + dischargeService + cities + vvd;
	setAccordianTabDetails('routingHeader', displayText);
}

function setRefAndMarks() {
	var referenceNumberCount = $("#referenceNumberGrid").getGridParam(
			"reccount");
	if (referenceNumberCount > 0) {
		$('#referenceHeaderCheckBox').attr('checked', true);
	} else {
		$('#referenceHeaderCheckBox').attr('checked', false);
	}
	if ($('#marksAndNumbers').val() == ''
			|| $('#marksAndNumbers').val() == null) {
		$('#marksHeaderCheckBox').attr('checked', false);
	} else {
		$('#marksHeaderCheckBox').attr('checked', true);
	}
}

function setPartiesHeader() {
	if ($('#prepaidCollectCode :selected').val() != '')
		setAccordianTabDetails('partiesHeader', 'Parties - '
				+ $("#prepaidCollectCode option:selected").text());
	else
		setAccordianTabDetails('partiesHeader', 'Parties');
}

function setMilitaryDiv() {
	var divText = $('#militaryPortCallFileNumber').val();
	if ($.trim(divText) == '') {
		setAccordianTabDetails('maintainShipmentMilitaryId', 'Military');
	} else {
		setAccordianTabDetails('maintainShipmentMilitaryId', 'Military - '
				+ $.trim(divText));
	}
	$.trim(divText);
}

//function setCustomerGroup() {
//	// for shipper
//	 url:
//	 _context+'/cas/autocomplete.do?method=getCustGrp&searchType=250&parentSearch='+$('input[name="shipper\\.addressRoleId"]').val(),
//	$
//			.ajax({
//				type : "GET",
//				url : _context
//						+ '/cas/autocomplete.do?method=getCustGrp&searchType=250&parentSearch=OT',// +$('input[name="shipper\\.addressRoleId"]').val(),
//				success : function(custGRP) {
//					// $('#customerGroupId').children().remove();
//					$(custGRP).each(function() {
//						var option = $('<option />');
//						option.attr('value', this.value).text(this.label);
//						$('#customerGroupId').append(option);
//					});
//					$('#customerGroupId').attr('selectedIndex', 0);
//				}
//			});
//}

function validateDate(dateControl) {
	var date = $('#' + dateControl + '').val();
	var dateSize = date.length;
	var newDate = date;
	var dt1;
	var mon1;
	var year1;

	if (dateSize == 6) {
		dt1 = date.substring(2, 4);
		mon1 = date.substring(0, 2);
		year1 = date.substring(4, 6);
		newDate = mon1 + "-" + dt1 + "-20" + year1;
	} else if (dateSize == 8) {
		dt1 = date.substring(2, 4);
		mon1 = date.substring(0, 2);
		year1 = date.substring(4, 8);
		newDate = mon1 + "-" + dt1 + "-" + year1;
	}
	var valid = false;
	if (isValidDate(newDate)) {
		$('#' + dateControl + '').val(newDate);
		valid = true;
	} else {
		$('#' + dateControl + '').val("");
		$('#' + dateControl + '')
				.validationEngine(
						'showPrompt',
						'Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
						'error', 'topRight', true);
	}
	return valid;
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
	var len1 = date.length;
	if (matches == null) {
		if (len1 < '8' && len1 > '10') {
			return false;
		}
		if (len1 == '8') {
			var dt1 = date.substring(2, 4);
			var mon1 = date.substring(0, 2);
			var mn = mon1 - 1;
			var yr1 = date.substring(4, 8);
			var composedDate = new Date(yr1, mn, dt1);
			validDate = composedDate.getDate() == dt1
					&& composedDate.getMonth() == mn
					&& composedDate.getFullYear() == yr1;
			if (validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
				return newDate;
			} else {
				return null;
			}
		}
	} else {
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		validDate = composedDate.getDate() == d && composedDate.getMonth() == m
				&& composedDate.getFullYear() == y;
		if (validDate) {
			var newDate = matches[1] + "-" + d + "-" + y;
			return newDate;
		} else {
			return null;
		}
	}
}

	function loadShipmentHeader(responseText) {
		if (null != responseText.data.header) {
			$("#shipmentId").val(responseText.data.shipmentId);
			$("#shipmentHeaderDiv").loadJSON(responseText.data.header);
			
			//Shipper
			$("#shipper").loadJSON(responseText.data.shipper);
			loadAdditionalShipperDetails(responseText);

			//Consignee
			$("#consignee").loadJSON(responseText.data.consignee);
			loadAdditionalConsigneeDetails(responseText);
			
			checkCopyButtons();

			//Parties
			$("#maintainShipmentParties").loadJSON(responseText.data.header);
			debtorCode = $('#prepaidCollectCode :selected').val();
			//autoBillOnchangeEventFunction();
			//setPartiesHeader();
			//Debtor Code
			
			//MarksNumbers
			$("#marksAndNumbers").val(responseText.data.header.markNumberString);

		}
	}

function setSpecialServicesDiv() {
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam("reccount");
	var specialServiceDisplayText = "Special Service ";
	if(specialServiceNumberCount>0){
		for(var i=1;i<=specialServiceNumberCount;i++){
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i , "specialServiceCode" );
			if(i==1){
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+' - '+specialService;
				}
			}else{
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+', '+specialService;
				}
			}
		}
	}
	setAccordianTabDetails('splServicesHeader',specialServiceDisplayText);
}

function setClauseDiv() {
	var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
	var headerStr = "";
    for (var i=0;i<rowIDs.length;i=i+1) {
      var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
      
      if(rowData.standardClauseCode!=null && rowData.standardClauseCode!='') {
    	  if(headerStr=='')
    		  headerStr = rowData.standardClauseCode;
    	  else
    		  headerStr = headerStr + ", "+rowData.standardClauseCode;
      }
   }
    if(headerStr!="")
 	   headerStr = "Clauses - " + headerStr;
    else
 	   headerStr = "Clauses";
    setAccordianTabDetails('clauseHeader', headerStr);
}

function setShipmentHold() {
	var holdCount = $("#holdGrid").getGridParam("reccount");
	if (holdCount == 0) {
		setAccordianTabDetails('maintainShipmentHoldId', "Hold");
	} else if (holdCount > 0) {
		var holdDisplayText = "Hold - "
				+ jQuery("#holdGrid").getRowData(1).holdCode;
		setAccordianTabDetails('maintainShipmentHoldId', holdDisplayText);
	}
}

function setOverridesHeader()
{
	if(checkIfDefault())
		$('#overrideHeaderCheckBox').attr('checked', false);
	else
		$('#overrideHeaderCheckBox').attr('checked', true);
}

function checkIfDefault()
{
	if($('#isOverrideBlOrigin').attr("checked") || 
	$('#isOverrideCountryOfOrigin').attr("checked") || 
	$('#isOverrideOriginPort').attr("checked") || 
	$('#isOverrideInitialVesselName').attr("checked") || 
	$('#isOverridePlaceOfIssue').attr("checked") || 
	$('#isOverrideBlDestination').attr("checked") || 
	$('#isOverrideCustomsVesselName').attr("checked") || 
	$('#isOverrideVoyageDirectionSeq').attr("checked") || 
	$('#isOverrideDestinationPort').attr("checked"))
		return false;
	else
		return true;
}

function clearShipmentForm(){
	var webPageSectionIds = ['maintainShipmentHeader','maintainShipmentShipperConsignee', 'maintainShipmentParties', 'referenceMarks', 'marksAndNumbersSection', 'maintainShipmentRouting','maintainShipmentOverrides'];//, 'maintainShipmentCommodity', 'militarySection', 
	for (var i=0; i<webPageSectionIds.length; i++) {
		clearWebPageSection(webPageSectionIds[i]);
	}
	clearDisplayFields();
	resetShipmentForm();
}

function clearWebPageSection(webPageSectionId){
	var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week|hidden)$/i;
	$("#"+webPageSectionId+" :input").each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (re.test(t) || tag == 'textarea') {
			this.value = '';
		}
		else if (t == 'checkbox' || t == 'radio') {
			this.checked = false;
		}
		else if (tag == 'select') {
			this.selectedIndex = 0;
		}
	});
}

function clearDisplayFields(){
	$("#tradeCode").text="";
	$("#freightReceivedDate").text="";
	$("#template").text="";
	$("#status").text="";
	$("#statusCode").text="";
}

function resetShipmentForm(){
	resetDivNames();
	reloadShipmentGrids();
	$("#shipmentStatusCode").attr("disabled",true);
	$("#createDate").html("");
	$("#lastUpdateDate").html("");
	$("#lastUpdateDateTimeUser").html("");
	$("#createUser").html("");
	cleanShipperConsignee();
	clearHeaderData();
}


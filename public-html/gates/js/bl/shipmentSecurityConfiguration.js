/**
 * Booking Security Implementation
 */
$(function() {
	enforceUserSecurityRolesAndPermissions();
	
	/* Always disabled on page load*/
	$('#shipperRepeatContact').attr('disabled', true);
	$('#consigneeRepeatContact').attr('disabled', true);
	$('#partiesRepeatContact').attr('disabled', true);
});

function enforceUserSecurityRolesAndPermissions(){
	
	/*Header*/
	
	_enforceSecurityHeader();
	
	/* Expand All-Collapse All */
	if(isShipperConsigneeDisplayOnly || isShipperConsigneeModifiable || isPartiesDisplayOnly || isPartiesModifiable || isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksModifiable || isRoutingDisplayOnly || isRoutingModifiable /*|| isCommodityDisplayOnly || isCommodityModifiable*/ || isMilitaryDisplayOnly || isMilitaryModifiable || isSpecialServiceDisplayOnly || isSpecialServiceModifiable || isClauseDisplayOnly || isClauseModifiable || isHoldManualDisplayOnly || isHoldManualModifiable || isRoutingOverrideDisplayOnly || isRoutingOverrideModifiable){
		$('#expandAllCollapseAll').show();
	}
	else{
		$('#expandAllCollapseAll').hide();
	}
	
	/*Shipper|Consignee*/
	_enforceSecuritySection('maintainShipmentShipperConsignee', 0, isShipperConsigneeDisplayOnly, isShipperConsigneeModifiable);
	
	/*Parties*/
	_enforceSecuritySection('maintainShipmentParties', 1, isPartiesDisplayOnly, isPartiesModifiable);
	
	/*Reference Numbers*/
	_enforceSecuritySection('maintainShipmentRefNumberMarks', 2, (isReferenceNumberMarksDisplayOnly || isMarksDisplayOnly), (isReferenceNumberMarksModifiable || isMarksModifiable));
	
	/*Routing*/
	_enforceSecuritySection('maintainShipmentRouting', 3, isRoutingDisplayOnly, isRoutingModifiable);
	
	/*Commodity*/
	var isCommodityDisplay= isCommodityBLCNDisplayOnly || isCommodityBLMXDisplayOnly ||isCommodityBLAUDisplayOnly ||isCommodityBLCVDisplayOnly;
	var isCommodityModifiable= isCommodityBLCNModifiable || isCommodityBLMXModifiable ||isCommodityBLAUModifiable ||isCommodityBLCVModifiable;
	
	//_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityDisplay, isCommodityModifiable);
	
	// D034263: 	Maintain Bill - Haz S
	if($('#tradeCode').val()=='A'){
		_enforceSecuritySection('maintainShipmentHazards', 5, isRoutingOverrideDisplayOnly, isRoutingOverrideModifiable);
		_enforceSecuritySection('maintainShipmentStopOffs', 6, isRoutingOverrideDisplayOnly, isRoutingOverrideModifiable);	
	}
	
	/*Military*/
	_enforceSecuritySection('militarySection', 7, isMilitaryDisplayOnly, isMilitaryModifiable);
	
	/*Special Services*/
	_enforceSecuritySection('maintainShipmentSpecialServices', 8, isSpecialServiceDisplayOnly, isSpecialServiceModifiable);
	
	/*Clauses*/
	_enforceSecuritySection('maintainBookingClauses', 9, isClauseDisplayOnly, isClauseModifiable);
	
	/*Holds*/
	_enforceSecuritySection('maintainShipmentHold', 10, isHoldManualDisplayOnly, isHoldManualModifiable);
		
	/*Booking Overrides*/
	_enforceSecuritySection('maintainShipmentOverrides', 11, isRoutingOverrideDisplayOnly, isRoutingOverrideModifiable);
	
	
	/*Buttons*/
	//Release/UndoRelease
	enforceSecurityDivAndButtons('releaseHold', holdManualReleaseButtonEnabled);
	enforceSecurityDivAndButtons('undoReleaseHold', holdManualReleaseButtonEnabled);
	
	//Save
	if(shipmentSaveUpdateEnabled && $.trim($('#shipmentId').val())==''){
		enforceSecurityDivAndButtons('shipmentSaveBtn', true);
		$('#shipmentSaveBtn').attr("disabled", true);
	}
	else if(!shipmentSaveUpdateEnabled){
		enforceSecurityDivAndButtons('shipmentSaveBtn', false);
	}
	else if(shipmentSaveUpdateEnabled && $.trim($('#shipmentId').val())!=''){
		enforceSecurityDivAndButtons('shipmentSaveBtn', true);
	}
	
	//Customize
	enforceSecurityDivAndButtons('shipmentCustomizeBtn', custAddressEnabled);
	
	//Hold Release
	enforceSecurityDivAndButtons('shipmentHoldReleaseBtn', holdReleaseEnabled);
	
	//Bill
	enforceSecurityDivAndButtons('shipmentBillBtn', isBillDisplayOnly);
	
	//Charges
	//alert("isChargesDisplayOnly="+isChargesDisplayOnly);
	enforceSecurityDivAndButtons('shipmentChargesBtn', isChargesDisplayOnly);
	
	//Payables
	enforceSecurityDivAndButtons('shipmentPayablesBtn', isPayablesDisplayOnly);
	
	//Corrections
	enforceSecurityDivAndButtons('shipmentCorrectionsBtn', isCorrectionDisplayOnly);
	
	//Secd Doc
	enforceSecurityDivAndButtons('shipmentSendDocBtn', sendDocEnabled);
	
	//status
	enforceSecurityDivAndButtons('shipmentStatusBtn', isStatusButtonEnable);
	
	//Delete
	enforceSecurityDivAndButtons('shipmentDeleteBtn', shipmentDeleteEnabled);
	
	//Trace
	enforceSecurityDivAndButtons('shipmentTraceBtn', isTraceDisplayOnly);
	
	//Alerts
	enforceSecurityDivAndButtons('shipmentAlertsBtn', sendAlert);	
	
}

/*function _enforceSecurityOnShipperConsignee(){
	if(isShipperDisplayOnly && isShipperConsigneeModifiable){
		enableSection('shipperconsignee');
	}else if(isShipperDisplayOnly && !isShipperConsigneeModifiable){
		disableSection('shipperconsignee');
	}else if(!isShipperDisplayOnly && isShipperConsigneeModifiable){
		enableSection('shipperconsignee');
	}
	if(!isShipperDisplayOnly && !isConsigneeDisplayOnly && !isShipperModifiable && !isConsigneeModifiable){
		//TODO: Check the name
		hideSection('Shipper');
	}
}*/

function _enforceSecurityHeader(){
	if(isRateDateDisplayOnly && !isRateDateModifiable){
		disableSection('rateDateDiv');
	}else if(isRateDateDisplayOnly && isRateDateModifiable){
		enableSection('rateDateDiv');
	}else{
		enforceSecurityDivAndButtons('rateDateDiv', false);
		$('#rateDate').addClass('noTab');
	}
	//Added isHeaderModifiable for Defect D029134 
	if(isHeaderDisplayOnly && !isHeaderModifiable){
		$("#customerGroupId").attr("disabled",true);
		$("#billType").attr("disabled",true);
		//Quote can not apply if Booking is loaded on screen. [So disable the Quote apply section]
		if($.trim($('#shipmentId').val())==''){
			enableSection('shipmentHeaderDetailDiv');
		}else{
			
			disableSection('shipmentHeaderDetailDiv');
		}
	}
	//Added for D028864
	else if(!isHeaderDisplayOnly && !isHeaderModifiable)
		{
		  $("#customerGroupId").attr("disabled",true);
		  $("#billType").attr("disabled",true);
		}
	else{
		enforceSecurityDivAndButtons('shipmentHeaderDetailDiv', false);
	}
	
}


/*function hideGridsEditDeleteIcons(gridId){
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-pencil"]').hide();
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-trash"]').hide();
}*/

function enforceSecurityTitleDisplay(){
	if(isShipperConsigneeTitleDisplay && !isShipperConsigneeDisplayOnly && !isShipperConsigneeModifiable){
		disableAccordian(0);
	}
	if(isPartiesTitleDisplay && !isPartiesDisplayOnly && !isPartiesModifiable){
		disableAccordian(1);
	}
	if(isReferenceNumberTitleDisplay && !isReferenceNumberMarksDisplayOnly && !isReferenceNumberMarksModifiable && !isMarksModifiable && !isMarksDisplayOnly){
		disableAccordian(2);
	}
	if(isRoutingVVDTitleDisplay && !isRoutingDisplayOnly && !isRoutingModifiable){
		disableAccordian(3);
	}
	/*if(isCommodityTitleDisplay && !isCommodityDisplayOnly && !isCommodityModifiable){
		disableAccordian(4);
	}*/
	if(isMilitaryTitleDisplay && !isMilitaryDisplayOnly && !isMilitaryModifiable){
		disableAccordian(5);
	}
	if(isSpecialServiceTitleDisplay && !isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		disableAccordian(6);
	}
	if(isClauseTitleDisplay && !isClauseDisplayOnly && !isClauseModifiable){
		disableAccordian(7);
	}
	if(isHoldTitleDisplay && !isHoldManualDisplayOnly && !isHoldManualModifiable){
		disableAccordian(8);
	}

	if(isOverrideTitleDisplay && !isRoutingOverrideDisplayOnly && !isRoutingOverrideModifiable){
		disableAccordian(9);
	}
}
function disableAccordian(accordionIndex){
	$($('.shipment-section')[accordionIndex]).accordion("disable").removeClass("ui-accordion-disabled ui-state-disabled");
	$('h3', $($('.shipment-section')[accordionIndex])).removeClass("ui-accordion-disabled ui-state-disabled");
}

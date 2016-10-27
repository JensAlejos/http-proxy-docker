/**
 * Template Security Implementation
 */
$(function() {
	enforceUserSecurityRolesAndPermissions();
	
	//$('#shipperRepeatContact').attr('disabled', true);
	//$('select[name="shipper\\.contactId"]').attr("disabled",true);
	$("#copyShipper").attr("disabled", true);
	//$('#consigneeRepeatContact').attr('disabled', true);
	//$('select[name="consignee\\.contactId"]').attr("disabled",true);
	$("#copyConsignee").attr("disabled", true);
	checkCopyButtons();
	//$('#partiesRepeatContact').attr('disabled', true);
	//$('#autobillOptionCode').attr('disabled', true);
	$('#autobillTriggerCode').attr('disabled', true);
	$('#dealerAuctionLocationCode').attr('disabled', true);
	$('#inbondNumber').attr('disabled', true);
	$('#overridePickupCarrierCode').attr('disabled', true);
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	$('#premiumRDD').attr('disabled', true);
	//$('#milRequiredDeliveryDate').attr('disabled', true);
	/*if(isMilitaryModifiable)
		$('#milRequiredDeliveryDate').val('01-01-0001');*/
	$('#overridePlaceOfIssue').attr('disabled', true);
});

function enforceUserSecurityRolesAndPermissions(){
	
	/*Header*/
	_enforceSecurityHeader();
	
	/*Shipper|Consignee*/
	_enforceSecuritySection('shipperconsignee', 0, isShipperConsgineeDisplayOnly, isShipperConsgineeModifiable);
	
	/*Parties*/
	_enforceSecuritySection('maintainBookingParties', 1, isPartiesDisplayOnly, isPartiesModifiable);
	
	/*Reference Numbers*/
	_enforceSecuritySection('maintainBookingRefNumbersMarks', 2, isReferenceNumberMarksDisplayOnly, isReferenceNumberMarksModifiable);
	
	/*Routing*/
	_enforceSecuritySection('maintainBookingRouting', 3, isRoutingDisplayOnly, isRoutingModifiable);
	
	/*Commodity*/
	_enforceSecuritySection('maintainBookingCommodity', 4, isCommodityDisplayOnly, isCommodityModifiable);
	
	/*Military*/
	_enforceSecuritySection('militarySection', 5, isMilitaryDisplayOnly, isMilitaryModifiable);
	
	/*Special Services*/
	_enforceSecuritySection('maintainBookingSpecialServices', 6, isSpecialServiceDisplayOnly, isSpecialServiceModifiable);
	
	/*Clauses*/
	_enforceSecuritySection('maintainBookingClauses', 7, isClauseDisplayOnly, isClauseModifiable);
	
	/*Holds*/
	_enforceSecuritySection('maintainBookingHold', 8, isHoldManualDisplayOnly, isHoldManualModifiable);
		
	/*Booking Overrides*/
	_enforceSecuritySection('maintainBookingOverrides', 9, isRoutingOverrideDisplayOnly, isRoutingOverrideModifiable);
	
	
	/*Buttons*/
	//Release/UndoRelease
	enforceSecurityDivAndButtons('releaseHold', holdManualReleaseButtonEnabled);
	enforceSecurityDivAndButtons('undoReleaseHold', holdManualReleaseButtonEnabled);
	
	//Save
	if(!templateSaveAddEnabled && templateSaveUpdateEnabled && $.trim($('#shipmentNumber').val())==''){
		$('#templateSave').attr("disabled", true);
	}
	else if(!templateSaveAddEnabled && !templateSaveUpdateEnabled){
		enforceSecurityDivAndButtons('templateSave', false);
	}
	else if(templateSaveAddEnabled || templateSaveUpdateEnabled){
		enforceSecurityDivAndButtons('templateSave', true);
	}
	
	//Dispatch
	enforceSecurityDivAndButtons('dispatchBtn', dispatchEnabled);
	
	//Payment
	enforceSecurityDivAndButtons('updatepaymentT', paymentEnabled);
	
	//Send Doc
	enforceSecurityDivAndButtons('sendDocBtn', sendDocEnabled);
	
	//Send EDI
	enforceSecurityDivAndButtons('sendEDI', sendEDIEnabled);
	
	//Alert
	enforceSecurityDivAndButtons('alert', sendAlert);
	
	//Cust Address
	enforceSecurityDivAndButtons('customizeNameAddress', custAddressEnabled);
	
	//Delete
	enforceSecurityDivAndButtons('templateDelete', templateDeleteEnabled);
	
	//Hold Release
	enforceSecurityDivAndButtons('holdRelease', holdReleaseEnabled);
	
	// History
	enforceSecurityDivAndButtons('historyDiv', isHistoryDisplayOnly);
}

/*function _enforceSecurityOnShipperConsignee(){
	if(isShipperDisplayOnly && isShipperConsgineeModifiable){
		enableSection('shipperconsignee');
	}else if(isShipperDisplayOnly && !isShipperConsgineeModifiable){
		disableSection('shipperconsignee');
	}else if(!isShipperDisplayOnly && isShipperConsgineeModifiable){
		enableSection('shipperconsignee');
	}
	if(!isShipperDisplayOnly && !isConsigneeDisplayOnly && !isShipperModifiable && !isConsigneeModifiable){
		//TODO: Check the name
		hideSection('Shipper');
	}
}*/

function _enforceSecurityHeader(){
	if(isHeaderDescDisplay && !isHeaderDescUpdate){
		disableSection('headerDescription');
	}
	else if(isHeaderDescDisplay && isHeaderDescUpdate){
		enableSection('headerDescription');
	}
	else{
		enforceSecurityDivAndButtons('headerDescription', false);
	}
	
	if(isHeaderTradeDisplay && !isHeaderTradeUpdate){
		disableSection('headerTrade');
	}
	else if(isHeaderTradeDisplay && isHeaderTradeUpdate){
		enableSection('headerTrade');
	}
	else{
		enforceSecurityDivAndButtons('headerTrade', false);
	}
	
	if(isHeaderEffDateDisplay && !isHeaderEffDateUpdate){
		disableSection('headerEffectiveDate');
	}
	else if(isHeaderEffDateDisplay && isHeaderEffDateUpdate){
		enableSection('headerEffectiveDate');
	}
	else{
		enforceSecurityDivAndButtons('headerEffectiveDate', false);
	}
	
	if(isHeaderEdiTemplateDisplay && !isHeaderEdiTemplateUpdate){
		disableSection('headerEdiTemplate');
	}
	else if(isHeaderEdiTemplateDisplay && isHeaderEdiTemplateUpdate){
		enableSection('headerEdiTemplate');
	}
	else{
		enforceSecurityDivAndButtons('headerEdiTemplate', false);
	}
	
	if(isHeaderCustgrpDisplay && !isHeaderCustgrpUpdate){
		disableSection('headerCustomerGroup');
	}
	else if(isHeaderCustgrpDisplay && isHeaderCustgrpUpdate){
		enableSection('headerCustomerGroup');
	}
	else{
		enforceSecurityDivAndButtons('headerCustomerGroup', false);
	}
	
	if(isHeaderExpDateDisplay && !isHeaderExpDateUpdate){
		disableSection('headerExpirationDate');
	}
	else if(isHeaderExpDateDisplay && isHeaderExpDateUpdate){
		enableSection('headerExpirationDate');
	}
	else{
		enforceSecurityDivAndButtons('headerExpirationDate', false);
	}
	
	if(isHeaderEdiQualifierDisplay && !isHeaderEdiQualifierUpdate){
		disableSection('headerEDIQualifier');
	}
	else if(isHeaderEdiQualifierDisplay && isHeaderEdiQualifierUpdate){
		enableSection('headerEDIQualifier');
	}
	else{
		enforceSecurityDivAndButtons('headerEDIQualifier', false);
	}
	
	if(isHeaderDealerCodeDisplay && !isHeaderDealerCodeUpdate){
		disableSection('headerDealerCode');
	}
	else if(isHeaderDealerCodeDisplay && isHeaderDealerCodeUpdate){
		enableSection('headerDealerCode');
	}
	else{
		enforceSecurityDivAndButtons('headerDealerCode', false);
	}
	
	if(isHeaderGmcSellDisplay && !isHeaderGmcSellUpdate){
		disableSection('headerGmcSellDivisionCode');
	}
	else if(isHeaderGmcSellDisplay && isHeaderGmcSellUpdate){
		enableSection('headerGmcSellDivisionCode');
	}
	else{
		enforceSecurityDivAndButtons('headerGmcSellDivisionCode', false);
	}
	
	if(isHeaderShipperClassDisplay && !isHeaderShipperClassUpdate){
		disableSection('headerShipperClass');
	}
	else if(isHeaderShipperClassDisplay && isHeaderShipperClassUpdate){
		enableSection('headerShipperClass');
	}
	else{
		enforceSecurityDivAndButtons('headerShipperClass', false);
	}
	
	if(isHeaderTempOwnerDisplay && !isHeaderTempOwnerUpdate){
		disableSection('headerTemplateOwner');
	}
	else if(isHeaderTempOwnerDisplay && isHeaderTempOwnerUpdate){
		enableSection('headerTemplateOwner');
	}
	else{
		enforceSecurityDivAndButtons('headerTemplateOwner', false);
	}
	
	if(isHeaderReviewWebBookingDisplay && !isHeaderReviewWebBookingUpdate){
		disableSection('headerReviewWebBooking');
	}
	else if(isHeaderReviewWebBookingDisplay && isHeaderReviewWebBookingUpdate){
		enableSection('headerReviewWebBooking');
	}
	else{
		enforceSecurityDivAndButtons('headerReviewWebBooking', false);
	}
	
	if(isHeaderLastUpdatedDisplay){
		disableSection('headerLastUpdated');
	}
	else{
		enforceSecurityDivAndButtons('headerLastUpdated', false);
	}
}

function _enforceSecuritySection(sectionId, accordian, _displayOnly, _modifiableOnly){
	if(_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(_displayOnly && !_modifiableOnly){
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(!_displayOnly && !_modifiableOnly){
		hideSection(accordian);
	}
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
		//$("#"+buttonId).attr("disabled", false);
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}

function hideSection(accordian){
	$($('.booking-section')[accordian]).hide();
}

function disableSection(sectionId){
	$('#'+sectionId).gatesDisable();
}

function enableSection(sectionId){
	$('#'+sectionId).gatesEnable();
}

function disableDialogButton(dialogId, buttonName){
	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
}

function disableAccordian(accordionIndex){
	$($('.booking-section')[accordionIndex]).accordion("disable").removeClass("ui-accordion-disabled ui-state-disabled");
	$('h3', $($('.booking-section')[accordionIndex])).removeClass("ui-accordion-disabled ui-state-disabled");
	$($('.booking-section')[accordionIndex]).children('div').removeClass("ui-accordion-disabled ui-state-disabled");
}

/*function hideGridsEditDeleteIcons(gridId){
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-pencil"]').hide();
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-trash"]').hide();
}*/

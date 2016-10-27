/**
 * Booking Security Implementation
 */
$(function() {
	enforceUserSecurityRolesAndPermissions();
	
	/* Always disabled on page load*/
	if($('#shipmentNumber').val()==''){
		$("#bookingStatusCode").attr("disabled",true);
	}
	//$('#shipperRepeatContact').attr('disabled', true);
	//$('select[name="shipper\\.contactId"]').attr("disabled",true);
	//$('#consigneeRepeatContact').attr('disabled', true);
	//$('select[name="consignee\\.contactId"]').attr("disabled",true);
	$("#copyShipper").attr("disabled", true);
	$("#copyConsignee").attr("disabled", true);
	//$('#partiesRepeatContact').attr('disabled', true);
	$('#autobillOptionCode').attr('disabled', true);
	$('#autobillTriggerCode').attr('disabled', true);
	$('#dealerAuctionLocationCode').attr('disabled', true);
	$('#inbondNumber').attr('disabled', true);
	$('#overridePickupCarrierCode').attr('disabled', true);
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	$('#vvdChangeAuthPartyCode').attr('disabled', true);
	$('#vvd_conventional').hide();
	$('#convCgoApptCutoffDate').attr('disabled', true);
	$('#convCgoApptCutoffTime').attr('disabled', true);
	$('#convCgoEstArrivalDate').attr('disabled', true);
	$('#convCgoEstArrivalTime').attr('disabled', true);
	$('#requiredDeliveryDate').attr('disabled', true);
	$('#premiumRDD').attr('disabled', true);
	//$('#milRequiredDeliveryDate').attr('disabled', true);
	/*if(isMilitaryModifiable)
		$('#milRequiredDeliveryDate').val('01-01-0001');*/
	$('#cargoPickupCityCodeDesc').attr("disabled", true);
	$('#cargoDeliveryCityCodeDesc').attr("disabled", true);
	$('#overridePlaceOfIssue').attr('disabled', true);
});

function enforceUserSecurityRolesAndPermissions(){
	
	/*Header*/
	_enforceSecurityHeader();
	
	/* Expand All-Collapse All */
	if(isShipperConsgineeDisplayOnly || isShipperConsgineeModifiable || isPartiesDisplayOnly || isPartiesModifiable || isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksModifiable || isRoutingDisplayOnly || isRoutingModifiable || isCommodityDisplayOnly || isCommodityModifiable || isMilitaryDisplayOnly || isMilitaryModifiable || isSpecialServiceDisplayOnly || isSpecialServiceModifiable || isClauseDisplayOnly || isClauseModifiable || isHoldManualDisplayOnly || isHoldManualModifiable || isRoutingOverrideDisplayOnly || isRoutingOverrideModifiable){
		$('#expandAllCollapseAll').show();
	}
	else{
		$('#expandAllCollapseAll').hide();
	}
	
	/*Shipper|Consignee*/
	_enforceSecuritySection('shipperconsignee', 0, isShipperConsgineeDisplayOnly, isShipperConsgineeModifiable, isShipperConsgineeTitleDisplay);
	
	/*Parties*/
	_enforceSecuritySection('maintainBookingParties', 1, isPartiesDisplayOnly, isPartiesModifiable, isPartiesTitleDisplay);
	//D032770: 	New Port Editor permission Port Editor access : K&L Beer Bookings
	/*Reference Numbers*/
	_enforceSecuritySection('maintainBookingRefNumbersMarks', 2, isReferenceNumberMarksDisplayOnly, isReferenceNumberMarksModifiable, isReferenceNumberMarksTitleDisplay);
	
	/*Routing*/
	_enforceSecuritySection('maintainBookingRouting', 3, isRoutingDisplayOnly, isRoutingModifiable, isRoutingTitleDisplay);
	
	/*Commodity*/
	_enforceSecuritySection('maintainBookingCommodity', 4, isCommodityDisplayOnly, false, isCommodityTitleDisplay);
	
	/*Special Services*/
	_enforceSecuritySection('maintainBookingSpecialServices', 6, isSpecialServiceDisplayOnly, isSpecialServiceModifiable, isSpecialServiceTitleDisplay);
	
	
	//Save
	if(!bookingSaveAddEnabled && bookingSaveUpdateEnabled && $.trim($('#shipmentNumber').val())==''){
		$('#bookingSave').attr("disabled", true);
	}
	else if(!bookingSaveAddEnabled && !bookingSaveUpdateEnabled){
		enforceSecurityDivAndButtons('bookingSave', false);
		enforceSecurityDivAndButtons("billingStartedHyperlink", false);
	}
	else if(bookingSaveAddEnabled || bookingSaveUpdateEnabled){
		enforceSecurityDivAndButtons('bookingSave', true);
		enforceSecurityDivAndButtons("billingStartedHyperlink", true);
	}
	

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
	if(isHeaderQuoteDisplay && !isHeaderQuoteApply){
		//disableSection('headerCreateBookingFromQuote'); -- commented for d030658
		//Added as part of Defect D030658
		enableSection('headerCreateBookingFromQuote');
		enforceSecurityDivAndButtons('quoteDiv', true);
		$("#quoteNumberLabel").each(function(){
			var aTxt = $(this).text();
		 	$(this).html(aTxt);  
		 });
		
	}
	else if(isHeaderQuoteDisplay && isHeaderQuoteApply){
		//Quote can not apply if Booking is loaded on screen. [So disable the Quote apply section]
		if($.trim($('#shipmentNumberHidden').val())==''){
			enableSection('headerCreateBookingFromQuote');
		}else{
			disableSection('headerCreateBookingFromQuote');
		}
	}
	else{
		enforceSecurityDivAndButtons('headerCreateBookingFromQuote', false);
		//added for D030657
		enforceSecurityDivAndButtons('quoteDiv', false);
		
	}
	
	
	if(isHeaderTemplateDisplay && !isHeaderTemplateApply){
		disableSection('headerTemplate');
	}
	else if(isHeaderTemplateDisplay && isHeaderTemplateApply){
		enableSection('headerTemplate');
	}
	else{
		enforceSecurityDivAndButtons('headerTemplate', false);
	}
	
	if(isHeaderTradeDisplay && !isHeaderTradeUpdate){
		disableSection('headerTradeCode');
	}
	else if(isHeaderTradeDisplay && isHeaderTradeUpdate){
		enableSection('headerTradeCode');
	}
	else{
		enforceSecurityDivAndButtons('headerTradeCode', false);
	}
	
	if(isHeaderStatusDisplay && !isHeaderStatusUpdate){
		disableSection('headerStatusCode');
	}
	else if(isHeaderStatusDisplay && isHeaderStatusUpdate){
		enableSection('headerStatusCode');
	}
	else{
		enforceSecurityDivAndButtons('headerStatusCode', false);
	}
	
	if(isHeaderBookedDisplay){
		disableSection('headerBooked');
	}
	else{
		enforceSecurityDivAndButtons('headerBooked', false);
	}
	
	if(isHeaderCustgrpDisplay && !isHeaderCustgrpUpdate){
		disableSection('headerCustomerGroup');
	}
	else if(isHeaderTradeDisplay && isHeaderTradeUpdate){
		enableSection('headerCustomerGroup');
	}
	else{
		enforceSecurityDivAndButtons('headerCustomerGroup', false);
	}
	
	if(isHeaderUpdatedDisplay){
		disableSection('headerUpdated');
	}
	else{
		enforceSecurityDivAndButtons('headerUpdated', false);
	}
	
	if(isHeaderQuoteLink){
		enforceSecurityDivAndButtons('assignLink', true);
	}
	else{
		//D030658
		enforceSecurityDivAndButtons('assignLink', false);
		//enforceSecurityDivAndButtons('quoteDiv', false);
	}
	if(!isBkngsummDisplay)
	{
	  $('#bkngsummdiv').hide();	
	}
		
	
	// TODO EDI or WEB
	if(isHeaderChannelDisplay){
		disableSection('');
	}
	else{
		enforceSecurityDivAndButtons('', false);
	}
}

function _enforceSecuritySection(sectionId, accordian, _displayOnly, _modifiableOnly, _titleOnly){
	if(_titleOnly && !_displayOnly && !_modifiableOnly){
		return;
	}
	else if(_displayOnly && _modifiableOnly){
		enableSection(sectionId);
		checkCopyButtons();
	}else if(_displayOnly && !_modifiableOnly){
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		enableSection(sectionId);
		checkCopyButtons();
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
	$('#'+sectionId).gatesDisable({exclude:['sData']});
}

function enableSection(sectionId){
	$('#'+sectionId).gatesEnable();
}

function disableDialogButton(dialogId, buttonName){
	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
}

function enforceSecurityTitleDisplay(){
	if(isShipperConsgineeTitleDisplay && !isShipperConsgineeDisplayOnly && !isShipperConsgineeModifiable){
		disableAccordian(0);
	}
	if(isPartiesTitleDisplay && !isPartiesDisplayOnly && !isPartiesModifiable){
		disableAccordian(1);
	}
	if(isReferenceNumberMarksTitleDisplay && !isReferenceNumberMarksDisplayOnly && !isReferenceNumberMarksModifiable){
		disableAccordian(2);
	}
	if(isRoutingTitleDisplay && !isRoutingDisplayOnly && !isRoutingModifiable){
		disableAccordian(3);
	}
	if(isCommodityTitleDisplay && !isCommodityDisplayOnly && !isCommodityModifiable){
		disableAccordian(4);
	}
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
	if(isRoutingOverrideTitleDisplay && !isRoutingOverrideDisplayOnly && !isRoutingOverrideModifiable){
		disableAccordian(9);
	}
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

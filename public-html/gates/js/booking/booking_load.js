// START - booking_load.js // Part of Cheetah changes.
// Below are functions only used when Booking is loaded for first time at Maintain Booking screen.

function _getFreightJSONresponse(responseText){
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
	//loadHazGrid(); // cheetah
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
	//D029724: 	Prod Maintain Booking : Error: Zero is not a valid weight 
	if($("#weight").val()==0){
		$("#weight").val('');
	}
	if(responseText.bookingAuto.vinNumber!=null && responseText.bookingAuto.vinNumber!=''){
		if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL'){
			$("#freightWeightLbl").html($("#freightWeightLbl").text()+"<span class=\"mandatory\">*</span>");
			$("#weight").addClass("validate[required]");
		}
		else if(!($.trim($('#loadDschServiceGroupCode').val())=="AU"
		          && ($.trim($('#customerGroupId :selected').text())==POV_NAME || $.trim($('#customerGroupId :selected').text())==ALASKA_POV_NAME))){
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

	_afterFreightLoadComplete($('#totalCommodityLines').text(), responseText.tariff, responseText.tariffItemNumber, responseText.commodityDescription, responseText.tariffCommodityDescription);
	
	$('#msgDivFrt').html('');
	$('#msgDivFrt').hide();
	
	setMandatoryPieces();
	_loadFreightGrids();
}


function _afterFreightLoadComplete(freightCount, tariffNumber, tariffItemNumber, commodityDescription, tariffCommodityDescription){
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
	//loadSpecialServiceGrid(); // cheetah
	//loadHazGrid();//Defect-25636 // cheetah
	// D016178
	// validateTCNExists();
}

//gatesData.emptyContactDetails = function(source) {
function _emptyContactDetails(source) {	
	$('select[name="'+ source +'\\.contactId"]').children().remove();
	$('select[name="'+ source +'\\.contactId"]').append("<option value='' label='Select'></option>");

	//// emptyContactDetailsOnContactChange(source);
	// start of emptyContactDetailsOnContactChange
	$('input[name="'+ source +'\\.contact"]').val("");
	$('input[name="'+ source +'\\.addressRoleContactCode"]').val("");
	
	$('input[name="'+ source +'\\.contactFaxCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxExchange"]').val("");
	$('input[name="'+ source +'\\.contactFaxStation"]').val("");
	$('input[name="'+ source +'\\.contactFaxExtension"]').val("");
	
	$('input[name="'+ source +'\\.contactCellCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactCellAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactCellExchange"]').val("");
	$('input[name="'+ source +'\\.contactCellStation"]').val("");
	$('input[name="'+ source +'\\.contactCellExtension"]').val("");

	$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExchange"]').val("");
	$('input[name="'+ source +'\\.contactPhoneStation"]').val("");
	$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExtension"]').val("");

	$('input[name="'+ source +'\\.contactEmailAddress"]').val("");
	//$('input[name="'+ source +'\\.communicationMethodCode"]').val("");
	
	//// setDefaultPrefMethod(source);
	// start of setDefaultPrefMethod
	/*$('#'+source+'Comm1').attr('checked',true);
	$('#'+source+'Comm1').val('P');
	$('#'+source+'Comm1').trigger('click');*/
	//$('#shipperComm1').trigger('click');
	$('#'+ source +'Comm1').attr('checked',true);
	$('#'+ source +'Comm2').attr('checked',false);
	$('#'+ source +'Comm3').attr('checked',false);
	$('#'+ source +'Comm4').attr('checked',false);
	//$('#'+ source +'Comm1').trigger('change');	
	// end of setDefaultPrefMethod
	
	//if(source=='consignee')
	//	loadHazGrid(); // cheetah - commenting out this and moving to reloadBookingGrids
	
	// end of emptyContactDetailsOnContactChange
}

function _loadGrid($grid, gridName) {
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var gatesCheetah = window.gatesCheetah || {};
	if (gatesCheetah && (gridName in bookingInitData))  {
		console.log('Cheetah: setting Grid data from response:' + gridName);
		$grid.jqGrid('setGridParam', {
			datatype : 'gates-jsonstring',
			datastr : bookingInitData[gridName]
		}).trigger("reloadGrid");
	} else {
		console.log('Cheetah: setting Grid data from Ajax:' + gridName);
		$grid.trigger("reloadGrid");
	}
}

//gatesData.reloadBookingGrids = function(){
function _loadBookingGrids(){
	//$("#gridIdForParties").trigger('reloadGrid');

	_loadGrid( $("#equipmentGrid") , 'equipmentGrid');
	_loadGrid( $("#tcnGrid") , 'tcnGrid');	
	_loadGrid( $("#vvdRoutingGrid") , 'loadVVDGrid');
	_loadGrid( $("#referenceNumberGrid") , 'referenceNumberGrid');
	_loadGrid( $("#dodaacGrid") , 'dodaacGrid'); // fix for D027740 fix
	_loadGrid( $("#specialServiceGrid") , 'specialServiceGrid');
	//Fix for D031861 - Grid is already loaded during create grid. This duplicate call is causing issue. 
	//_loadGrid( $("#hazGrid") , 'hazGrid');
	_loadGrid( $("#gridIdForClauses") , 'gridIdForClauses');
	_loadGrid( $("#holdGrid") , 'holdGrid');
	_loadGrid( $("#gridIdForParties") , 'gridIdForParties');
	//Reloaded special service grid for D028389
	$("#specialServiceGrid").trigger('reloadGrid'); 
	
	//_loadGrid( $("#dodaacGrid") , 'dodaacGrid');
	
	// setting this for D027740, let Jose look at it.
	//$("#dodaacGrid").trigger('reloadGrid'); // commenting out for D027740 fix
	
	/*
	$('#equipmentGrid').trigger("reloadGrid");
	$('#tcnGrid').trigger("reloadGrid");
	$("#vvdRoutingGrid").trigger("reloadGrid");
	$("#referenceNumberGrid").trigger('reloadGrid');
	$("#dodaacGrid").trigger('reloadGrid');
	$("#specialServiceGrid").trigger('reloadGrid');
	$('#hazGrid').trigger("reloadGrid");
	$("#gridIdForClauses").trigger('reloadGrid');
	$('#holdGrid').trigger("reloadGrid"); // loadHoldGrid('D');
	setTimeout(function(){
		$("#gridIdForParties").trigger('reloadGrid');
		//$("#equipmentGrid").trigger('reloadGrid');
	}, 500);
	*/
}

//gatesData.loadFreightGrids = function() {
function _loadFreightGrids() {
	var xCoordinate = window.pageXOffset;
	var yCoordinate = window.pageYOffset;
	
	// loadEquipmentGrid(); // Cheetah - commenting out and moving to reloadBookingGrids
	// loadTCNGrid();		// Cheetah - commenting out and moving to reloadBookingGrids
	// loadHazGrid();// Cheetah - commenting out and moving to reloadBookingGrids
	
	setTimeout(
		function() {
			if ($('#tariff').is(':visible')) {
				if (!$("#equipmentGrid").is(':visible')) {
					if (!defaultHidden
							|| ($("#equipmentGrid")
									.getGridParam("reccount") != undefined && $(
									"#equipmentGrid").getGridParam(
									"reccount") > 0)) {
						$(".HeaderButton", ("#gview_equipmentGrid"))
								.click();
						// hideEquipmentInlineEditDelete();
						// showSelectedCharacteristics();
					}
				} else if ($("#equipmentGrid").is(':visible')) {
					if (defaultHidden
							&& ($("#equipmentGrid")
									.getGridParam("reccount") == undefined || $(
									"#equipmentGrid").getGridParam(
									"reccount") == 0))
						$(".HeaderButton", ("#gview_equipmentGrid"))
								.click();
					/*
					 * else { hideEquipmentInlineEditDelete();
					 * //showSelectedCharacteristics(); }
					 */
				}
			}
			window.scrollTo(xCoordinate, yCoordinate);
		}, 250);
};

//gatesData.clearBookingForm = function() {
function _clearBookingForm() {
	// start of clearBookingForm();
	var webPageSectionIds = ['bookingHeaderDiv','maintainBookingShipperConsignee', 'maintainBookingParties', 'referenceMarks', 'marksAndNumbersSection', 'maintainBookingRouting', 'maintainBookingCommodity', 'militarySection', 'maintainBookingOverrides','bookingOverridesHeaderDiv'];
	for (var i=0; i<webPageSectionIds.length; i++) {
		clearWebPageSection(webPageSectionIds[i]);
	}	
	// end of clearBookingForm();
	
	// start of resetBookingForm();
	removeErrorPointers();
	resetDivNames();
	setDefaultForAssignLink();
	$("#bookingStatusCode").attr("disabled",true);
	$("#createDate").html("");
	$("#lastUpdateDate").html("");
	$("#lastUpdateDateTimeUser").html("");
	$("#bookedDateTimeUser").html("");
	
	// cleanShipperConsignee();
	// start of cleanShipperConsignee();
	$("#shipperNameDiv").html("");
	$("#consigneeNameDiv").html("");
	$("#copyShipper").attr("disabled", true);
	$("#copyConsignee").attr("disabled", true);
	enableScreenForDealer();
	$('#msgDiv').html("");
	_emptyContactDetails("shipper");//gatesData.emptyContactDetails("shipper");
	_emptyContactDetails("consignee");//gatesData.emptyContactDetails("consignee");
	//enableDisableContactId('shipper',true);
	//enableDisableContactId('consignee',true);
	resetDefault();	
	// end of cleanShipperConsignee();
	
	
	
	changeShipperConsigneeColor("shipper", "N");
	changeShipperConsigneeColor("consignee", "N");
	$('input[name="shipper\\.address"]').attr("readonly",false);
	$('input[name="consignee\\.address"]').attr("readonly",false);
	clearHeaderData();
	$('#changeSourceLabel').html("Change Source");
	$('#originalVVD .cutOff').text('');
	$('#vvdCutOff .cutOff').text('');
	$('#pickupZoneDisplay').html('');
	$('#deliveryZoneDisplay').html('');
	/*$('#shipperRepeatContact').attr('disabled', true);
	$('#consigneeRepeatContact').attr('disabled', true);
	$('#partiesRepeatContact').attr('disabled', true);*/
	//$('#autobillOptionCode').attr('disabled', true);
	$('#autobillTriggerCode').attr('disabled', true);
	$('#inbondNumber').attr('disabled', true);
	$('#overridePickupCarrierCode').attr('disabled', true);
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	$('#dealerAuctionLocationCode').attr('disabled', true);
	$('#vvdChangeAuthPartyCode').attr("disabled", true);
	$('#vvd_conventional').hide();
	$('#vvd_premium').hide();
	$('#vvdCutOff').show();
	$('#convCgoApptCutoffDate').attr('disabled', true);
	$('#convCgoApptCutoffTime').attr('disabled', true);
	$('#convCgoEstArrivalDate').attr('disabled', true);
	$('#convCgoEstArrivalTime').attr('disabled', true);
	$('#requiredDeliveryDate').attr('disabled', true);
	$('#premiumRDD').attr('disabled', true);
	clearCommodityCodeList();
	/*removeCurrentCommodity();*/
	$("#estShip").html('');
	$("#estAvail").html('');
	$("a.vinsightUnitIdUrl").html('');
	//$('#milRequiredDeliveryDate').attr('disabled', true);
	/*if(isMilitaryModifiable)
		$('#milRequiredDeliveryDate').val('01-01-0001');*/
	resetIBSCode();
	resetCargoPickup();
	resetCargoDelivery();
	$('#overridePlaceOfIssue').attr('disabled', true);
	
	if(isRoutingModifiable)
	{
		$('#blOriginCityCodeDescription').attr('disabled', false);
		$('#blDestinationCityCodeDescription').attr('disabled', false);
		$('#pickupZipCode').attr('disabled', false);
		$('#deliveryZipCode').attr('disabled', false);
		$('#overridePickupCarrierCode').attr('disabled', false);
		$('#overrideDeliveryCarrierCode').attr('disabled', false);
	}
	
	$('#billExists').val('');
	$('#commentId').val('');
	$('#commentsDiv').hide();
	$('#historyDiv').hide();
	clearGlobalVariables();
	changeTextColour();
	//reloadBookingGrids(); // Cheetah - commented out - duplicate
	_loadFreightGrids();//gatesData.loadFreightGrids();	// Cheetah - move to reloadBookinGrids
	
	// end of resetBookingForm();
};

//gatesData.showJSON = function(responseText) {
function _showJSON(responseText) {
	setBookingTitle(responseText.data.header.shipmentNumber);	
	
	// Booking Id
	$("#bookingId").val(responseText.data.bookingId);
	
	//Comment Id
	$("#commentId").val(responseText.data.commentId);
	

	//Entity Versiod Id
	$("#entityVersion").val(responseText.data.entityVersion);

	//Header
	$("#bookingStatusCode").attr("disabled",false);
	$("#header").loadJSON(responseText.data.header);
	if(responseText.data.header.tradeCode!=null && responseText.data.header.tradeCode!=''){
		$('#previousTradeCode').val(responseText.data.header.tradeCode);
	}
	else{
		$('#previousTradeCode').val("");
	}

	$('#isRequireCustomerVerifyAdd').val(responseText.data.header.isRequireCustomerVerifyAdd);
	$('#isRequireCustomerVerifyChg').val(responseText.data.header.isRequireCustomerVerifyChg);
	
	if(responseText.data.header.bookingTemplateNumber != undefined && responseText.data.header.bookingTemplateNumber!=null){
		$("#bookingTemplateNumber").html("<a href='#' onclick=\"checkForChangeInBooking('" + responseText.data.header.bookingTemplateNumber +"');\" style=\"color: blue\">"+ responseText.data.header.bookingTemplateNumber +"</a>");
	}
	if(responseText.data.header.quoteNumber!=null && (responseText.data.header.quoteNumber == responseText.data.header.shipmentNumber))
		$('#quoteVNConcat').val(responseText.data.header.quoteNumber);//+"."+responseText.data.header.quoteVersion);
	
	if(responseText.data.header.quoteNumber !=null){
		var quoteText = responseText.data.header.quoteNumber;
		if(responseText.data.header.quoteVersion!=null && responseText.data.header.quoteVersion!=''){
			quoteText = quoteText + "-"+responseText.data.header.quoteVersion;
		}
		$('#quoteNumberLabel').html("<a style=\"color: blue\" href= " + _context + "/quote/getQuote?quoteId="+ responseText.data.header.appliedQuoteId +">"+quoteText+"</a>");//quoteText);
	}
	
	if(responseText.data.header.quoteAmount!=null)
		$('#quoteAmountDiv').text('$'+responseText.data.header.quoteAmount);
	
	$('#createBkngTmplSeqNbrDs').val(responseText.data.header.createBkngTmplSeqNbrDs);

	//Setting Booked Date, Time & user and Last Update Date, Time & user
	if(responseText.data.header.bookedDate!=null){
		//$("#bookedDateTimeUser").html(getTimeWithoutSeconds(responseText.data.header.createDateTime)+ " &nbsp;&nbsp;&nbsp;" + responseText.data.createUser);
		$("#bookedDateTimeUser").html(responseText.data.header.bookedDate+ " &nbsp;&nbsp;&nbsp;" + responseText.data.header.bookingCsr);
	}
	if(responseText.data.header.lastUpdateDateTime!=null){
		$("#lastUpdateDateTimeUser").html(getTimeWithoutSeconds(responseText.data.header.lastUpdateDateTime)+ " &nbsp;&nbsp;&nbsp;" + responseText.data.lastUpdateUser);
	}
	
	$("#bookingTemplate").loadJSON(responseText.data.bookingTemplate);
	$('#templateDelete').attr('disabled',false);
	//allow Assign Quote only in case of empty booking #
	if(responseText.data.header.shipmentNumber == '' || responseText.data.header.shipmentNumber == null/*|| responseText.data.header.shipmentNumber==responseText.data.header.quoteNumber*/){
		$('#assignLink').html("Assign Quote");
	}else{
		if(responseText.data.header.quoteNumber =='' /*|| responseText.data.header.quoteId ==''*/){
			$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
		}else{
			$('#assignLink').html("<a href=\"javascript:removeAssignQuote();\">Remove Quote</a>");
		}
	}

	// Setting lastCustomerGroupId
	if(responseText.data.header.customerGroupId!=null){
		$("#lastCustomerGroupId").val(responseText.data.header.customerGroupId);
	}
	else{
		$("#lastCustomerGroupId").val("");
	}

	//Shipper
	shipperAddress = responseText.data.shipper.address;
	$("#shipper").loadJSON(responseText.data.shipper);
	$('#shipperName').val($('input[name="shipper\\.organizationName"]').val());
	loadAdditionalShipperDetails(responseText);
	
	processShipperConsigneeColor("shipper");

	//Consignee
	consigneeAddress = responseText.data.consignee.address;
	$("#consignee").loadJSON(responseText.data.consignee);
	$('#consigneeName').val($('input[name="consignee\\.organizationName"]').val());
	loadAdditionalConsigneeDetails(responseText);
	
	processShipperConsigneeColor("consignee");
	checkCopyButtons();

	//Parties
	$("#maintainBookingParties").loadJSON(responseText.data.header);
	debtorCode = $('#prepaidCollectCode :selected').val();
	
	autoBillOnchangeEventFunction();
	setPartiesHeader();
	
	//MarksNumbers
	$("#marksAndNumbers").val(responseText.data.header.marksAndNumbers);
	
	//Routing
	
	
	$("#maintainBookingRouting").loadJSON(responseText.data.routing);
	if($.trim($('#loadDschServiceGroupCode').val()) == "AU"
	    && ($.trim($('#customerGroupId :selected').text()) == POV_NAME || $.trim($('#customerGroupId :selected').text())== ALASKA_POV_NAME))
		$('#premiumRDD').val(responseText.data.header.requiredDeliveryDate);
	$('#pickupZoneDisplay').html(responseText.data.routing.pickupZone);
	$('#deliveryZoneDisplay').html(responseText.data.routing.deliveryZone);
	$("#maintainBookingOverrides").loadJSON(responseText.data.routing);
	
	$("#isVgmRequiredDefault").html(responseText.data.routing.defaultVGMDisplay);
	console.log("_defaultVGM="+responseText.data.routing.defaultVGMDisplay);
	
	populateLoadDischargeLists(responseText.data.routing);
	setGlobalVariableValues();
	changeTextColour();
	setOverridesHeader();
	if($('#isInBond :selected').val()==true || $('#isInBond :selected').val()=='true' && isRoutingModifiable)
		$('#inbondNumber').attr("disabled", false);
	else
		$('#inbondNumber').attr("disabled", true);
	checkPickupCarrier();
	checkDeliveryCarrier();
	if($('#isAutoInlandMove :selected').val()==true || $('#isAutoInlandMove :selected').val()=='true' && isRoutingModifiable)
		$('#dealerAuctionLocationCode').attr("disabled", false);
	else
		$('#dealerAuctionLocationCode').attr("disabled", true);
	if(responseText.data.header.requiredDeliveryDate!=null && responseText.data.header.requiredDeliveryDate!=''){
		$("#requiredDeliveryDate").val(responseText.data.header.requiredDeliveryDate);
	}
	else{
		$("#requiredDeliveryDate").val('');
	}
	
	
	
	//Commodity
	$("#okAlreadyPressed").val("false");
	$('#unitOfMeasureSourceCode').val(responseText.data.header.unitOfMeasureSourceCode);
	_getFreightJSONresponse(responseText.data.freight);
	showFreight($.trim($('#customerGroupId :selected').text()));
	setFirstVVD();
	$('#previousTradeCode').val($('#tradeCode :selected').val());
	$('#lastCustomerGroupId').val($('#customerGroupId :selected').val());
	$('#showAlertTCGLDSP').val("true");
	
	//Military
	$("#maintainBookingMilitary").loadJSON(responseText.data.header);
	$("#maintainBookingMilitary").loadJSON(responseText.data.militaryBooking);
	$('#militaryPortCallFileNumber').trigger('change');
	//RDD
	if(responseText.data.militaryBooking.requiredDeliveryDate!=null && responseText.data.militaryBooking.requiredDeliveryDate!=''){
		$("#milRequiredDeliveryDate").val(responseText.data.militaryBooking.requiredDeliveryDate);
	}
	/*else if(isMilitaryModifiable){
		$("#milRequiredDeliveryDate").val('01-01-0001');
	}*/
	else
		$("#milRequiredDeliveryDate").val('');
	
	//D016178
	if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $.trim($('#isAllowBookingUnit').val())=="Y"){
		if(responseText.data.tcnExists)
		setIBSCodeMandatory();
		if($('#militaryIbsStatusCode option:selected').text()!=''){
			setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
		}
	}
	else{
		resetIBSCode();
		resetCargoPickup();
		resetCargoDelivery();
	}
	
	//Booking Overrides
	$("#maintainBookingOverrides").loadJSON(responseText.data.routing);
	
	$('#commentsDiv').show();
	if(isHistoryDisplayOnly) $('#historyDiv').show();
	//collapseAll();

	if(responseText.data.shipper.organizationName==null)
		responseText.data.shipper.organizationName ='';
	if(responseText.data.consignee.organizationName==null)
		responseText.data.consignee.organizationName='';

	updateShipperConsigneeNames(responseText);
	isBookingDeletable();
	
	$('#bookingTemplateOwnerPartyType').val(responseText.data.bookingTemplate.bookingTemplateOwnerPartyType);
	$('#partiesExists').val(responseText.data.partiesExists);
	$('#shipmentNumberHidden').val(responseText.data.header.shipmentNumberHidden);
	$('#quoteVNConcatHidden').val(responseText.data.header.quoteVNConcatHidden);
	$('#hiddenBookedDate').val(responseText.data.hiddenBookedDate);
	if(responseText.data.shipper.organizationName!='')
		setShipperDivName(" " +responseText.data.shipper.organizationName);
	if(responseText.data.consignee.organizationName!='')
		setConsigneeDivName(" " +responseText.data.consignee.organizationName);
	
	//Added method for Marks Header Checkbox
	if(responseText.data.header.marksAndNumbers=='' || responseText.data.header.marksAndNumbers==null){
		$('#marksHeaderCheckBox').attr('checked', false);
	}else{
		$('#marksHeaderCheckBox').attr('checked', true);
	}
	if(responseText.data.header.quoteNumber!=null && (responseText.data.header.quoteNumber == responseText.data.header.shipmentNumber)){
		$('#quotePopUpSearch').hide();
	}else{
		$('#quotePopUpSearch').show();
	}
	disableCreateBookingFromQuote();
	
	/*if($('#shipmentNumber').val()!='')
	{
		$('#shipperRepeatContact').attr('disabled', false);
		$('#consigneeRepeatContact').attr('disabled', false);
		$('#partiesRepeatContact').attr('disabled', false);
	}*/
	
	if($("#bookingStatusCode").val()=='APPR' || $("#bookingStatusCode").val()=='OFFR'){
		var amount=responseText.data.header.actualTotalChargeAmount;
		if(amount!=null && amount!='' && ! isNaN(amount)){
			amount = parseFloat(amount); 
			$('#chargeCurrency').text('$');
			$('#actualTotalChargeAmount').text(amount.toFixed(2));
		}
	}else{
		$('#chargeCurrency').text('');
		$('#actualTotalChargeAmount').text('');
	}
	$('#bookingCsr').val(responseText.data.header.bookingCsr);
	$('#checkRequiredDispatch').val(responseText.data.checkRequiredDispatch);
	isBookingChanged = "N";
	$('#freightCommentId').val(responseText.data.freight.commentId);
	$('#ediTypeCode').val(responseText.data.header.ediTypeCode);
	$('#isRequirePrePayment').val(responseText.data.header.isRequirePrePayment);
	$('#createUser').val(responseText.data.createUser);
	
	createCommentFunc();	
	setHazCount(responseText.data.header.hazardCount);
	

	// D032440
	var ediService = "";
	if(responseText.data.ediLoadService) {
		ediService += responseText.data.ediLoadService
	}
	if(responseText.data.ediLoadService || responseText.data.ediDischargeService ) {
		ediService += " / ";
	}
	if(responseText.data.ediDischargeService) {
		ediService += responseText.data.ediDischargeService
	}
	$('#ediServiceType').html(ediService);
	
	if(responseText.data.chinaEdi) {
		$('#ediServiceTypeHeader').show();
		console.log('is chinaEDI');
	} else {
		$('#ediServiceTypeHeader').hide();
		console.log('not chinaEDI');
	}
	
};

//cheetah - function to load a booking when first server call is made
function displayInitialBookingCallBack(responseText) {
	
	var gatesCheetah = window.gatesCheetah || {};
	
	if (gatesCheetah)  {
		console.log('Cheetah: setting booking data from response');
		gatesCheetah.isLoading = true;
		gatesCheetah.bookingInitData = responseText.initData;
	}
	
	_clearBookingForm();
	
	if (responseText.messages.error.length == 0) {
		$('#billingStartedHyperlink').hide();
		/*if(responseText.data.header.billExists=="Y"){
			$('#receivedFreightGridDiv').hide();
			$('#receivedUnitsGridDiv').hide();
			loadBillStartedGrids();
		}*/
		_showJSON(responseText);
		// collapseAll();
		$('#billExists').val(responseText.data.header.billExists);
		var billTypeFlag = responseText.data.parties.partyTypeFlag;
		if(null == billTypeFlag || billTypeFlag == ''){
			billTypeFlag = "NO BL";
		}
		//	D026349: 	FW: Maintain Booking: Hyperlink in Parties section is flowing to Billing Doc Distribution but it should be flowing to Booking Doc Distribution
//		if(responseText.data.header.billExists=="Y"){
//			$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('shipmentPrntOptnsOverride/getPrintOptionOverride?navigationFrom=BK',true);\">"+billTypeFlag+"</a>");
//		}else{
			$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+billTypeFlag+"</a>");
//		}
		setPartyTypeFlag(responseText.data.header.billExists, responseText.data.header.isToOrderParty);
		//D031169: 	Priority Stow to have a new selection list only for Alaska
		if(responseText.data.header.tradeCode!=null && responseText.data.header.tradeCode=='A'){
			setStowDataForAlaska();
		}
		// D028769: 	Maintain booking - on hold in parties section shows but not on maintain bill 
		// Commented this display out, left all the logic in place
		/*	
		if(responseText.data.holdEqpExists) {
			$('#holdEqpExists').text('-On Hold');
		} else {
			$('#holdEqpExists').text('');
		}
		*/
		//we have to call it seperately bcoz we do not want it to execute everytime showJSON runs.
		if(responseText.data.header.billExists=="Y"){
			prepareHeaderDataForBillingOverlay(responseText);
			$('#billingStartedHyperlink').show();
		}
		else{
			$('#billingStartedHyperlink').hide();
		}
		//checkIfTemplateToBeDisabled();
		/*Booking Security*/
		if(isHoldOverlayBottomEnabled){
			//Display Unreleased Holds Grid on initial display
			openUnreleasedHoldGridOnIntialDisplay("booking");
		}
		
		if(responseText.data.shipperNameAddressCustomized){
			$('input[name="shipper\\.organizationName"]').css('color', 'green');
		}
		if(responseText.data.consigneeNameAddressCustomized){
			$('input[name="consignee\\.organizationName"]').css('color', 'green');
		}
		//checkIfQuoteShowLinkToBeShown();
		
		console.log("booking="+responseText.data.header.ediTypeCode);
		//D025919: 	Maintain Booking: Make the EDI label a hyperlink to the EDI Booking Detail
		var ediLink = "<div style=\"height:20px;padding-top: 7px;\"><a href=\"javascript:onEdiClick();\">EDI</a><div>";
		if(responseText.data.isBookingOnEDIReviewQueue=='Y'){
			if(responseText.data.header.bookingCsr=='EDIBKG'){
				$('#ediOrWebIndicator').html(ediLink);
			} else {
				$('#ediOrWebIndicator').text('WEB');
			}
		}
		else if(responseText.data.header.bookingCsr=='EDIBKG'){
			$('#ediOrWebIndicator').html(ediLink);
		}
		else if(responseText.data.header.bookingCsr=='WEBBKG'){
			$('#ediOrWebIndicator').text('WEB');
		} else if(responseText.data.header.ediTypeCode=='Y') {
			$('#ediOrWebIndicator').html(ediLink);
		}
		else {
			$('#ediOrWebIndicator').text('');
		}
		 
		if(responseText.data.isBookingOnEDIReviewQueue=='Y'){
			//Defect - D019815 - 018501
			var fromMenu = $("#userFromMenu").val();
			var fromEdi = false;
			if(fromMenu.lastIndexOf("ediBookingDetail_", 0) === 0 ) {
				fromEdi = true;
			}
			
			// D029837: Add Cancel
			if(responseText.data.header.bookingStatusCode!='CANC' && responseText.data.header.bookingStatusCode!='APPR' && responseText.data.header.bookingStatusCode!='OFFR' && $("#userFromMenu").val() != 'webBookingReviewQueue' && !fromEdi){
				otherAlert("","Booking is on web/edi review queue.  Press ok to edit booking.");
			}
		}
		
		if(responseText.data.header.bookingStatusCode=='APPR'){
			$('#billBooking').attr("disabled", false);
		}else{
			$('#billBooking').attr("disabled", true);
		}
		
		$('#templateAppliedOnBookingFromScreen').val('N');
		disableCreateBookingFromQuote();
		if(responseText.data.header.bookingTemplateNumber != undefined && responseText.data.header.bookingTemplateNumber!=null){
			tempShipperAddress= responseText.data.shipper.addressRoleId;
				tempConsigneeAddress=responseText.data.consignee.addressRoleId;
				//D029999:For consignee/Shipper it needs to look at the template type and only remove if it is that type of template. 
				tempPartyTypeCode=responseText.data.bookingTemplate.partyTypeCode;
				}
		
		//TODO - readonly call removed
		if(responseText.data.header.bookingStatusCode=='CANC'){
			//update booking BR-02 [Canceled Booking cannot be updated.]
			makeFormReadOnly(responseText,'bookingForm',true);
		}else{
			makeFormReadOnly(responseText,'bookingForm',false);
		}
		$('#commentsDiv').show();
		if(isHistoryDisplayOnly) $('#historyDiv').show();
		//getTemplateNumberForId();
		//Grid reload calls
		_loadBookingGrids();
		//	D021215: 	Session Variable clear/change shortcut
		getSearchFieldValue(500);
		//enables or opens commodity section
		/*if($('input[name="shipper\\.organizationName"]').is(':visible') && $('select[name="header\\.prepaidCollectCode"]').is(':visible') && $('#referenceNumberGrid').is(':visible') && $('select[name="routing\\.loadServiceCode"]').is(':visible') && $("#militaryConsignorCode").is(':visible') && $('#specialServiceGrid').is(':visible') && $('#gridIdForClauses').is(':visible') && $('#holdGrid').is(':visible') && $('#overrideBlOrigin').is(':visible')){
			if(!$('#tariff').is(':visible')){
    			var disabled = $($('.booking-section')[4]).accordion( "option", "disabled" );
    			if(disabled){
    				$($('.booking-section')[4]).click();
    			}
    			else{
    				$($('.booking-section')[4]).accordion('option', 'active', 0);
    			}
    		}
		}
		else if(!$('input[name="shipper\\.organizationName"]').is(':visible') && !$('select[name="header\\.prepaidCollectCode"]').is(':visible') && !$('#referenceNumberGrid').is(':visible') && !$('select[name="routing\\.loadServiceCode"]').is(':visible') && !$("#militaryConsignorCode").is(':visible') && !$('#specialServiceGrid').is(':visible') && !$('#gridIdForClauses').is(':visible') && !$('#holdGrid').is(':visible') && !$('#overrideBlOrigin').is(':visible')){
			if($('#tariff').is(':visible')){
    			$($('.booking-section')[4]).accordion('option', 'active', 0);
    		}
		}
		else{
			if(!$('#tariff').is(':visible')){
    			var disabled = $($('.booking-section')[4]).accordion( "option", "disabled" );
    			if(disabled){
    				$($('.booking-section')[4]).click();
    			}
    			else{
    				$($('.booking-section')[4]).accordion('option', 'active', 0);
    			}
    		}
		}*/
	}else{
		//Set booking title to default if booking doesn't exist
		setBookingTitle(null);
		$("#bookingSave").attr("disabled",false);
		$('#shipmentNumberHidden').val("");
		
		resetHoldUnreleasedGrid();
	}
	piece=$('#pieceCount').val();//Defect-24921
	weightOriginal=$('#weight').val();//Defect-25136
	cubeOriginal=$('#cube').val();
	$("#shipmentNumber").attr("disabled",false);
	$("#bookingStatusCode").attr("disabled", false);
	//Messages
	showResponseMessages("msgDiv", responseText);
	//enableDisableClearButton();
	
	//Security Implementations
	enforceUserSecurityRolesAndPermissions();
	
	//Enables-disables footer buttons if booking exists
	enableDisableFooterButtons();
	//[Manjeet/Vivek/Saif]after security roles, Please dont change unless you know impact.
	if (responseText.messages.error.length == 0) {
		//TODO - readonly call removed
		if(responseText.data.header.bookingStatusCode=='CANC'){
			//update booking BR-02 [Canceled Booking cannot be updated.]
			makeFormReadOnly(responseText,'bookingForm',true);
		}else{
			makeFormReadOnly(responseText,'bookingForm',false);
		}
		$('#quoteVNConcat').attr("disabled", true);
		//if(responseText.data.header.bookingStatusCode=='APPR' || responseText.data.header.bookingStatusCode=='OFFR'){
		if($('#checkRequiredDispatch').val()=='Y'){
			$("#dispatchBtn").attr("disabled", false);
		}
		else{
			$("#dispatchBtn").attr("disabled", true);
		}
	}
	
	if(responseText.messages.error.length == 0)
	{
		if(responseText.data.header.bookingStatusCode!='CANC')
		{
			/*Booking Security*/
			if(isHeaderStatusUpdate){
				$("#bookingStatusCode").attr("disabled",false);
			}
			/*Booking Security*/
			/*if(isShipperConsgineeModifiable){
				$('#shipperRepeatContact').attr('disabled', false);
				$('#consigneeRepeatContact').attr('disabled', false);
			}*/
			checkCopyButtons();
			processShipperConsigneeColor("shipper");
			processShipperConsigneeColor("consignee");
			/*if(isPartiesModifiable)
				$('#partiesRepeatContact').attr('disabled', false);*/
			autoBillOnchangeEventFunction();
			if($('#isInBond :selected').val()==true || $('#isInBond :selected').val()=='true' && isRoutingModifiable)
				$('#inbondNumber').attr("disabled", false);
			else
				$('#inbondNumber').attr("disabled", true);
			checkPickupCarrier();
			checkDeliveryCarrier();
			if($('#isAutoInlandMove :selected').val()==true || $('#isAutoInlandMove :selected').val()=='true' && isRoutingModifiable)
				$('#dealerAuctionLocationCode').attr("disabled", false);
			else
				$('#dealerAuctionLocationCode').attr("disabled", true);
			processChangeSource();
			if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL')
			{
				$('#vvd_conventional').show();
				if(isRoutingModifiable)
				{
					$('#convCgoApptCutoffDate').attr('disabled', false);
					$('#convCgoApptCutoffTime').attr('disabled', false);
					$('#convCgoEstArrivalDate').attr('disabled', false);
					$('#convCgoEstArrivalTime').attr('disabled', false);
					$('#requiredDeliveryDate').attr('disabled', false);
				}
				/*if(isMilitaryModifiable)
					$('#milRequiredDeliveryDate').attr('disabled', false);*/
			}
			else
			{

				$('#vvd_conventional').hide();
				$('#convCgoApptCutoffDate').attr('disabled', true);
				$('#convCgoApptCutoffTime').attr('disabled', true);
				$('#convCgoEstArrivalDate').attr('disabled', true);
				$('#convCgoEstArrivalTime').attr('disabled', true);
				$('#requiredDeliveryDate').attr('disabled', true);
				//$('#milRequiredDeliveryDate').attr('disabled', true);
			}
			setRoutingLoadDischargeDetails();
			setDefaultOverrides();
		}
	}
	
	/*if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && $.trim($('#loadDschServiceGroupCode').val())=='CON' && $.trim($('#isAllowBookingUnit').val())=="Y"){
		if($("#tcnGrid").getGridParam("records")!=$('#pieceCount').val()){
			var messageContent = $('#msgDiv').html();
				messageContent += '<div class="message_warning">Pieces Count does not equal number of TCNs</div>';
				$('#msgDiv').html(messageContent);
		}
	}*/
	
	
	/*Dirty Check*/
	isBookingChanged = "N";
	$('#displayingBookingEvent').val("N");
	
	//$("#gridIdForParties").trigger('reloadGrid'); // Cheetah
	enableDisableNote();

	if (gatesCheetah) {
		gatesCheetah.isLoading = false;
	}
}

//END - booking_load.js
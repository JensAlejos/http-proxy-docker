$(function() {
    disableAllButtons();
	$('#commentsDiv').hide();
	
	$('#receivedUnitId')
			.bind(
					'keypress',
					function(event) {
						// keyCode for enter key is 13
						if (event.keyCode == 13) {
							fetchUnitLinkageDetails();	
						}
					});

	// Booking# Predictive Search
	// D031148: add templates, removed parentType=B
	var url = _context
			+ '/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch=';
	$('#moveToBkg')
			.gatesAutocomplete(
					{
						source : url,
						name: 'Booking Number',
						minLength : 7,
						formatItem : function(data) {
							return data.shno;
						},
						formatResult : function(data) {
							return data.shno;
						},
						select : function(data) {
							
							clearMoveToBooking();
							
							$('#moveToBkg').val(data.shno);
							
							$("#moveToBkgHidden").attr("value",$("#moveToBkg").val());

							showInfoMessage('msgDiv', 'Loading Booking '
									+ $('#moveToBkg').val() + ' ...');
							
							$("#moveToBkg").attr("disabled", "disabled");
							$("#receivedUnitId").attr("disabled", "disabled");
							disableAllButtons();

							$
									.ajax({
										type : "POST",
										url : _context +"/unit_variance_and_vvd/unit_linkage/getBookingDetails",
										data : {
											shipmentNumber : $("#moveToBkg")
													.val()
										},
										success : function(responseText) {
											
											$("#receivedUnitId").removeAttr("disabled");

											getMoveToDetails(responseText);

											if(!(startsWith('T',$("#moveToBkg").val())) &&
													($("#moveToBookingStatus").html() != 'APPR') && ($("#moveToBookingStatus").html() != 'OFFR')) {
												disableAllButtons();
												$("#moveToBkgHidden").attr("value",$("#moveToBkg").val());
												$("#moveToBkg").removeAttr("disabled");
												showErrorMessage('msgDiv','Booking Status must be Approved or Offer.');
											}
											else {
												if (($("#curShipmentNo").html() == null)
														|| ($("#curShipmentNo")
																.html() == '')) {
													
													if(isUnitLinkageLinkable == true){
														enableLink();
													}
													else {
														disableLink();
													}
													
													disableTransferUnLink();
												} else {
													disableLinkUnLink();
													
													if(isUnitLinkageTransferable == true) {
														enableTransfer();
													}
													else {
														disableTransfer();
													}
												}
												$("#moveToBkgHidden").attr("value",$("#moveToBkg").val());
												$("#moveToBkg").removeAttr("disabled");
												showInfoMessage('msgDiv',
												'Successfully Loaded.');
											}
										}
									});

						}
					});
	
	$('#moveToBkg').change(function() {
		
		if($("#moveToBkgHidden").attr("value") != $("#moveToBkg").val()) 
		{
			clearMoveToBooking();
			$("#moveToBkgHidden").attr("value","");
			clearResponseMessages('msgDiv');
			
			if(($("#curShipmentNo").html() == undefined)
			|| ($("#curShipmentNo").html() == null)
			|| ($("#curShipmentNo").html() == '')){
				disableAllButtons();
			}
			else{
				disableLink();
				disableTransfer();
				enableUnLink();
			}
			
		}
		
	});

	$('#uLinkExit').click(function() {
		document.location.href = _context +"/cas/receivedUnitsSearch.do";
	});

	$('#uLink').click(function() {
		
		if($("#vinSightHidden").attr("value") != $("#receivedUnitId").val())
		{
			showErrorMessage('msgDiv','VINSight# must not be changed.');
			return;
		}
		else
		{
			clearResponseMessages('msgDiv');
		}
		
		if($("#moveToBkgHidden").attr("value") != $("#moveToBkg").val())
		{
			showErrorMessage('msgDiv','Booking# must not be changed.');
			return;
		}
		else
		{
			clearResponseMessages('msgDiv');
		}
		
		showInfoMessage('msgDiv', 'Linking ...');
		disableAllButtons();
		disableMoveToBkg();
		$("#receivedUnitId").attr("disabled", "disabled");
		
		$.ajax({
			type : "POST",
			url : _context +"/unit_variance_and_vvd/unit_linkage/validateLDServicePair",
			data : { ldServicePair : $("#moveToLDSvc").html() },
			success : function(responseText) {
				
				if (responseText.messages.error.length > 0){
					disableAllButtons();
					
					if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
						enableMoveToBkg();
					}
					else {
						disableMoveToBkg();
					}
					
					$("#receivedUnitId").removeAttr("disabled");
					showResponseMessages("msgDiv", responseText);
				}
				else{
					
					$.ajax({
						type : "POST",
						url : _context +"/unit_variance_and_vvd/unit_linkage/link",
						data : {
							vinSightNumber : $("#receivedUnitId").val(),
							moveToShipmentNumber : $('#moveToBkg').val(),
							currentShipmentNumber : $("#curShipmentNo").html(),
							moveToConsigneeOrganizationId : $('#moveToConsigneeOrganizationId').attr("value"),
							moveToConsigneeContactName : $('#moveToConsigneeContactName').attr("value")
						},
						success : function(responseText) {
							copyMoveToBookingToCurrentBooking();
							clearMoveToBooking();
							disableLinkTransfer();
							
							if(isUnitLinkageUnLinkable == true) {
								enableUnLink();
							}
							else {
								disableUnLink();
							}
							
							if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
								enableMoveToBkg();
							}
							else {
								disableMoveToBkg();
							}
							
							$("#receivedUnitId").removeAttr("disabled");
							showResponseMessages("msgDiv", responseText);
						}
					});
				}
			}
		});

	});

	$('#uUnLink').click(function() {
		
		if($("#vinSightHidden").attr("value") != $("#receivedUnitId").val())
		{
			showErrorMessage('msgDiv','VINSight# must not be changed.');
			return;
		}
		else
		{
			clearResponseMessages('msgDiv');
		}
		//D030578: 	Unable to unlink unit - incorrect error that billing has started since unit is not linked to a bill
		if($("#billLinked").val() == 'true') {
			showInfoMessage('msgDiv',
					'Billing is started. Unlink cannot be performed.');
			return;
		}
		
		showInfoMessage('msgDiv', 'Un-Linking ...');
		disableAllButtons();
		disableMoveToBkg();
		$("#receivedUnitId").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context +"/unit_variance_and_vvd/unit_linkage/unlink",
			data : {
				vinSightNumber : $("#receivedUnitId").val(),
				currentShipmentNumber : $("#curShipmentNo").html()
			},
			success : function(responseText) {
				clearCurrentBooking();
				clearMoveToBooking();
				disableAllButtons();
				
				if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
					enableMoveToBkg();
				}
				else {
					disableMoveToBkg();
				}
				
				$("#receivedUnitId").removeAttr("disabled");
				showResponseMessages("msgDiv", responseText);
			}
		});
	});

	$('#uLinkTransfer')
			.click(
					function() {
						
						if($("#vinSightHidden").attr("value") != $("#receivedUnitId").val())
						{
							showErrorMessage('msgDiv','VINSight# must not be changed.');
							return;
						}
						else
						{
							clearResponseMessages('msgDiv');
						}
						
						
						if($("#moveToBkgHidden").attr("value") != $("#moveToBkg").val())
						{
							showErrorMessage('msgDiv','Booking# must not be changed.');
							return;
						}
						else
						{
							clearResponseMessages('msgDiv');
						}
						
						//D026255: 	FW: Unit Linkage Defect -  The rule should be 'is it linked to a billing' and not 'is billing started'. 

						//if($("#curBillingStarted").html() == 'Y') {
						//	showInfoMessage('msgDiv',
						//			'Billing is started. Transfer cannot be performed.');
						//	return;
						//}
						
						if($("#billLinked").val() == 'true') {
							showErrorMessage('msgDiv','Unit linked to a Bill. Transfer cannot be performed.');
							return;
						}
						

						if ($("#curShipmentNo").html() == $('#moveToBkg').val()) {
							showErrorMessage('msgDiv',
									'Current and Move To Booking must be different.');
							return false;
						}

						if ($("#curPortOfLoading").html() != $(
								'#moveToPortOfLoading').html()) {
							showErrorMessage('msgDiv',
									'POL for Current and Move To Booking must be same.');
							return false;
						}

						if ($("#curLDSvc").html() != $('#moveToLDSvc').html()) {
							showErrorMessage('msgDiv',
									'Load and Discharge Service for Current and Move To Booking must be same.');
							return false;
						}
						
						showInfoMessage('msgDiv', 'Transferring ...');
						disableAllButtons();
						disableMoveToBkg();
						$("#receivedUnitId").attr("disabled", "disabled");
						
						$.ajax({
							type : "POST",
							url : _context +"/unit_variance_and_vvd/unit_linkage/validateLDServicePair",
							data : { ldServicePair : $("#moveToLDSvc").html() },
							success : function(responseText) {

								if (responseText.messages.error.length > 0){
									disableAllButtons();
									
									if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
										enableMoveToBkg();
									}
									else {
										disableMoveToBkg();
									}
									
									$("#receivedUnitId").removeAttr("disabled");
									showResponseMessages("msgDiv", responseText);
								}
								else{
									
									$.ajax({
										type : "POST",
										url : _context +"/unit_variance_and_vvd/unit_linkage/transfer",
										data : {
											vinSightNumber : $("#receivedUnitId").val(),
											moveToShipmentNumber : $('#moveToBkg').val(),
											currentShipmentNumber : $("#curShipmentNo").html(),
											moveToConsigneeOrganizationId : $('#moveToConsigneeOrganizationId').attr("value"),
											moveToConsigneeContactName : $('#moveToConsigneeContactName').attr("value")
										},
										success : function(responseText) {
											copyMoveToBookingToCurrentBooking();
											clearMoveToBooking();
											disableLinkTransfer();
											
											if(isUnitLinkageUnLinkable == true) {
												enableUnLink();
											}
											else {
												disableUnLink();
											}
											
											if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
												enableMoveToBkg();
											}
											else {
												disableMoveToBkg();
											}
											
											$("#receivedUnitId").removeAttr("disabled");
											//D025975: 	Booking: Unit linkage - GATES missing "Billing already started for booking" message
											if($("#curBillingStarted").html() == "Y"){
												showWarnMessage("msgDiv", "Successfully Transferred. Billing already started for Booking.");
											} else {
												showResponseMessages("msgDiv", responseText);
											}
											$("#receivedUnitId").focus();
										}
									});
								}
							}
						});

					});
	
	
	if($("#receivedUnitId").val() != ''){
		fetchUnitLinkageDetails();
	}
	
	/*var args = {
			entityType: 'RCUT',
			entityId: $('#receivedUnitId').val(),
			commentId: 'receivedUnit\\.commentId',
			displayCommentTypes: ''
		   };
	getCommentTypes(args);*/
	if($.trim($('#receivedUnitId').val()) != '') {
		createCommentFunc();
	}
	
	$('#receivedUnitId').focus();
	tabSequence('#unitLinkageFormId',false,false);
});


function fetchUnitLinkageDetails() {
	
	clearAllFields();
	disableAllButtons();
	disableMoveToBkg();

	if (!$("#unitLinkageFormId").validationEngine(
			'validate')) {
		return;
	}

	showInfoMessage('msgDiv', 'Loading VINSight# '
			+ $("#receivedUnitId").val() + ' ...');
	
	$("#receivedUnitId").attr("disabled", "disabled");

	$
			.ajax({
				type : "POST",
				url : _context +"/unit_variance_and_vvd/unit_linkage/display",
				data : {
					vinSightNumber : $("#receivedUnitId").val()
				},
				success : function(responseText) {

					if (responseText.messages.error.length == 0) {

						getHeaderDetails(responseText);

						if (((responseText.data.receivedUnit.bookingId == undefined) || (responseText.data.receivedUnit.bookingId == null) || (responseText.data.receivedUnit.bookingId == ''))) {
							clearCurrentBooking();
							disableAllButtons();
						} else {
							getCurrentBookingDetails(responseText);
							disableLinkTransfer();
							
							if(isUnitLinkageUnLinkable == true) {
								enableUnLink();
							}
							else {
								disableUnLink();
							}
						}

						if((isUnitLinkageLinkable == true) || (isUnitLinkageTransferable == true)){
							enableMoveToBkg();
						}
						else {
							disableMoveToBkg();
						}
						
						clearMoveToBooking();
						// D034090: allow unlink of canceled units.
						$("#vinSightHidden").attr("value",$("#receivedUnitId").val());
						
						if (responseText.data.receivedUnit.isCancelInVinsight == 'Y') {
							disableAllButtons1();
							disableMoveToBkg();
							showInfoMessage('msgDiv','Unit is cancelled.');
						}
						else {
							showInfoMessage('msgDiv',
									'Successfully Loaded.');
						}						
						
						//Comment Id
						$('#receivedUnit\\.commentId').val(responseText.data.receivedUnit.commentId);
						$('#commentsDiv').show();

					} else {
						clearAllFields();
						disableAllButtons();
						disableMoveToBkg();
						showResponseMessages("msgDiv",responseText);
						$('#commentsDiv').hide();
					}
					
					$("#receivedUnitId").removeAttr("disabled");
					createCommentFunc();
					forBillingStrted();
				}
				
			});
}

function copyMoveToBookingToCurrentBooking() {
	$("#curShipmentNo").html($('#moveToBkg').val());
	$("#curShipper").html($("#moveToShipper").html());
	$("#shipper").html($("#moveToShipper").html());
	$("#curBookingStatus").html($("#moveToBookingStatus").html());
	$("#curShipperAdd").html($("#moveToShipperAdd").html());
	$("#curBillingStarted").html($("#moveToBillingStarted").html());
	$("#curConsignee").html($("#moveToConsignee").html());
	$("#consignee").html($("#moveToConsignee").html());
	$("#curPortOfLoading").html($("#moveToPortOfLoading").html());
	$("#curConsigneeAdd").html($("#moveToConsigneeAdd").html());
	$("#consigneeAdd").html($("#moveToConsigneeAdd").html());
	$("#curPortOfDischarge").html($("#moveToPortOfDischarge").html());
	$("#curVVD").html($("#moveToVVD").html());
	$("#curLDSvc").html($("#moveToLDSvc").html());
	$("#consigneeContactName").html($('#moveToConsigneeContactName').attr("value"));
}

function getCurrentBookingDetails(responseText) {
	var oVesselCode,oVoyage,oDirection,lServiceCode,dServiceCode;
	$("#curShipmentNo").html(responseText.data.booking.header.shipmentNumber);
	$("#curShipper").html(responseText.data.booking.shipper.organizationName);
	$("#shipper").html(responseText.data.booking.shipper.organizationName);
	$("#curBookingStatus").html(
			responseText.data.booking.header.bookingStatusCode);
	$("#curShipperAdd").html(responseText.data.booking.shipper.address);
	
	//D025975: 	Booking: Unit linkage - GATES missing "Billing already started for booking" message
	/*if ((responseText.data.receivedUnit.shipmentId == undefined) || (responseText.data.receivedUnit.shipmentId == null) || (responseText.data.receivedUnit.shipmentId == '')) {
		$("#curBillingStarted").html("N");
	}
	else
	{
		$("#curBillingStarted").html("Y");
	}*/
	$("#curBillingStarted").html(responseText.data.booking.header.billExists);
	
	$("#billLinked").val(responseText.data.receivedUnit.billLinked);
	$("#curConsignee").html(
			responseText.data.booking.consignee.organizationName);
	$("#consignee").html(responseText.data.booking.consignee.organizationName);
	$("#curPortOfLoading").html(
			responseText.data.booking.routing.originPortCityCode);
	$("#curConsigneeAdd").html(responseText.data.booking.consignee.address);
	$("#consigneeAdd").html(responseText.data.booking.consignee.address);
	$("#curPortOfDischarge").html(
			responseText.data.booking.routing.destinationPortCityCode);
	
	if(responseText.data.booking.routing.originalVesselCode == null)
		oVesselCode = "";
	else
		oVesselCode = responseText.data.booking.routing.originalVesselCode;
	
	if(responseText.data.booking.routing.originalVoyage == null)
		oVoyage = "";
	else
		oVoyage = responseText.data.booking.routing.originalVoyage;
	
	if(responseText.data.booking.routing.originalDirectionSeq == null)
		oDirection = "";
	else
		oDirection = responseText.data.booking.routing.originalDirectionSeq;
	
	$("#curVVD").html(oVesselCode + " "+ oVoyage + " "+ oDirection);
	
	
	if(responseText.data.booking.routing.loadServiceCode == null)
		lServiceCode = "";
	else
		lServiceCode = responseText.data.booking.routing.loadServiceCode;
	
	
	if(responseText.data.booking.routing.dischargeServiceCode == null)
		dServiceCode = "";
	else
		dServiceCode = responseText.data.booking.routing.dischargeServiceCode;
	
	
	$("#curLDSvc").html(lServiceCode + " "+ dServiceCode);
	
	if ((responseText.data.booking.consignee.contact == undefined) || (responseText.data.booking.consignee.contact == null) || (responseText.data.booking.consignee.contact == '')) {
		$("#consigneeContactName").html("");
	}
	else{
		$("#consigneeContactName").html(responseText.data.booking.consignee.contact);
	}
	
	
}

function getHeaderDetails(responseText) {
	var rVesselCode,rVoyage,rDirection;
	$("#vin").html(responseText.data.receivedUnit.vinNumber);
	$("#vehicleWeight").html(responseText.data.receivedUnit.weight);
	$("#description").html(responseText.data.receivedUnit.description);
	$("#vehicleYear").html(responseText.data.receivedUnit.vehicleYear);
	$("#vehicleMake").html(responseText.data.receivedUnit.vehicleMake);
	$("#vehicleModel").html(responseText.data.receivedUnit.vehicleModel);
	$("#portOfLoading").html(responseText.data.receivedUnit.originPortCityCode);
	$("#portOfDischarge").html(responseText.data.receivedUnit.destinationPortCityCode);
	
	if(responseText.data.receivedUnit.receivedForVesselCode == null)
		rVesselCode = "";
	else
		rVesselCode = responseText.data.receivedUnit.receivedForVesselCode;
	
	if(responseText.data.receivedUnit.receivedForVoyage == null)
		rVoyage = "";
	else
		rVoyage = responseText.data.receivedUnit.receivedForVoyage;
	
	if(responseText.data.receivedUnit.receivedForDirectionSeq == null)
		rDirection = "";
	else
		rDirection = responseText.data.receivedUnit.receivedForDirectionSeq;
	
	$("#receivedForVVD").html(rVesselCode + " "+ rVoyage + " "+ rDirection);
}

function getMoveToDetails(responseText) {
	var oVesselCode,oVoyage,oDirection,lServiceCode,dServiceCode;
	$("#moveToShipper").html(responseText.data.shipper.organizationName);
	$("#moveToBookingStatus").html(responseText.data.header.bookingStatusCode);
	$("#moveToShipperAdd").html(responseText.data.shipper.address);
	//D025975: 	Booking: Unit linkage - GATES missing "Billing already started for booking" message
	$("#moveToBillingStarted").html(responseText.data.header.billExists);
	$("#moveToConsignee").html(responseText.data.consignee.organizationName);

	$("#moveToPortOfLoading")
			.html(responseText.data.routing.originPortCityCode);
	$("#moveToConsigneeAdd").html(responseText.data.consignee.address);

	$("#moveToPortOfDischarge").html(
			responseText.data.routing.destinationPortCityCode);
	
	if(responseText.data.routing.originalVesselCode == null)
		oVesselCode = "";
	else
		oVesselCode = responseText.data.routing.originalVesselCode;
	
	if(responseText.data.routing.originalVoyage == null)
		oVoyage = "";
	else
		oVoyage = responseText.data.routing.originalVoyage;
	
	if(responseText.data.routing.originalDirectionSeq == null)
		oDirection = "";
	else
		oDirection = responseText.data.routing.originalDirectionSeq;
	
	$("#moveToVVD").html(oVesselCode + " "+ oVoyage + " "+ oDirection);
	
	if(responseText.data.routing.loadServiceCode == null)
		lServiceCode = "";
	else
		lServiceCode = responseText.data.routing.loadServiceCode;
	
	
	if(responseText.data.routing.dischargeServiceCode == null)
		dServiceCode = "";
	else
		dServiceCode = responseText.data.routing.dischargeServiceCode;
	
	$("#moveToLDSvc").html(lServiceCode + " "+ dServiceCode);
	
	$('#moveToConsigneeOrganizationId').attr("value",responseText.data.consignee.addressRoleId);
	
	if ((responseText.data.consignee.contact == undefined) || (responseText.data.consignee.contact == null) || (responseText.data.consignee.contact == '')) {
		$('#moveToConsigneeContactName').attr("value","");
	}
	else{
		$('#moveToConsigneeContactName').attr("value",responseText.data.consignee.contact);	
	}
}

function disableMoveToBkg() {
	$("#moveToBkg").attr("disabled", "disabled");
}

function disableLinkTransfer() {
	$("#uLink").attr("disabled", "disabled");
	$("#uLinkTransfer").attr("disabled", "disabled");
}

function disableTransferUnLink() {
	$("#uLinkTransfer").attr("disabled", "disabled");
	$("#uUnLink").attr("disabled", "disabled");
}

function disableLinkUnLink() {
	$("#uLink").attr("disabled", "disabled");
	$("#uUnLink").attr("disabled", "disabled");
}

function enableMoveToBkg() {
	$("#moveToBkg").removeAttr("disabled");
}

function enableLink() {
	$("#uLink").removeAttr("disabled");
	$("#uLink").css('visibility','visible');
}

function disableLink() {
	//$("#uLink").attr("disabled", "disabled");
	$("#uLink").css('visibility','hidden');
}

function enableTransfer() {
	$("#uLinkTransfer").removeAttr("disabled");
	 //$("#uLinkTransfer").css('visibility','visible');
}

function disableTransfer() {
	$("#uLinkTransfer").attr("disabled", "disabled");
	// $("#uLinkTransfer").css('visibility','hidden');
}

function enableUnLink() {
	$("#uUnLink").removeAttr("disabled");
	 //$("#uUnLink").css('visibility','visible');
}

function disableUnLink() {
	$("#uUnLink").attr("disabled", "disabled");
	//$("#uUnLink").css('visibility','hidden');
}

function disableAllButtons() {
	if(!isUnitLinkageLinkable)
	  disableLink();
	if(!isUnitLinkageUnLinkable)
	   disableUnLink();
	if(!isUnitLinkageTransferable)
	   disableTransfer();
	$("#uLink").attr("disabled", "disabled");
	$("#uLinkTransfer").attr("disabled", "disabled");
	$("#uUnLink").attr("disabled", "disabled");
}

function disableAllButtons1() {
	if(!isUnitLinkageLinkable)
	  disableLink();
	//Disabled uUnLink button for the Defect fix #D031157 - As confirmed by Chris Davison to disable uUnlink button even If is_cancel_in_vinsight is set to ‘Y’ in ‘gbb_received_unit_mt’ table
	//if(!isUnitLinkageUnLinkable)
	   //disableUnLink();
	if(!isUnitLinkageTransferable)
	   disableTransfer();
	$("#uLink").attr("disabled", "disabled");
	$("#uLinkTransfer").attr("disabled", "disabled");
	//Disabled uUnLink button for the Defect fix #D031157 - As confirmed by Chris Davison to disable uUnlink button even If is_cancel_in_vinsight is set to ‘Y’ in ‘gbb_received_unit_mt’ table
	//$("#uUnLink").attr("disabled", "disabled");
}

function clearHeader() {
	$("#vin").html("");
	$("#vehicleWeight").html("");
	$("#description").html(""); 
	$("#vehicleYear").html("");
	$("#vehicleMake").html("");
	$("#vehicleModel").html("");
	$("#portOfLoading").html("");
	$("#portOfDischarge").html("");
	$("#receivedForVVD").html("");
}

function clearCurrentBooking() {
	$("#curShipmentNo").html("");
	$("#curShipper").html("");
	$("#shipper").html("");
	$("#curBookingStatus").html("");
	$("#curShipperAdd").html("");
	$("#curBillingStarted").html("");
	$("#curConsignee").html("");
	$("#consignee").html("");
	$("#curPortOfLoading").html("");
	$("#curConsigneeAdd").html("");
	$("#consigneeAdd").html("");
	$("#curPortOfDischarge").html("");
	$("#curVVD").html("");
	$("#curLDSvc").html("");
	$("#consigneeContactName").html("");
}

function clearMoveToBooking() {
	$('#moveToBkg').val("");
	$("#moveToShipper").html("");
	$("#moveToBookingStatus").html("");
	$("#moveToShipperAdd").html("");
	$("#moveToBillingStarted").html("");
	$("#moveToConsignee").html("");
	$("#moveToPortOfLoading").html("");
	$("#moveToConsigneeAdd").html("");
	$("#moveToPortOfDischarge").html("");
	$("#moveToVVD").html("");
	$("#moveToLDSvc").html("");
	$('#moveToConsigneeOrganizationId').attr("value","");
	$('#moveToConsigneeContactName').attr("value","");
}

function clearAllFields() {
	clearHeader();
	clearCurrentBooking();
	clearMoveToBooking();
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
}

function showErrorMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_error">' + text + '</div>');
}

function showWarnMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_warning">' + text + '</div>');
}

function clearResponseMessages(msgDivId) {
	$('#' + msgDivId).html("");
}

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

		$('#' + msgDivId).html(messageContent);
	}
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'RCUT',
			contextScreen: ''
		},
		success: function(responseText){
			if(responseText.success==true){
				var commentTypes=responseText.data;
				var string="";
				for(var i=0;i<commentTypes.length;i++){
					if(i<commentTypes.length-1){
						string=string+commentTypes[i]+",";
					}else{
						string=string+commentTypes[i];
					}
				}
				args.displayCommentTypes=string;
				$("#comment_link").comments(args);
				
			}
		}
	});
}

function createCommentFunc() {
	var args = {
			entityType: 'RCUT',
			entityId: $('#receivedUnitId').val(),
			commentId: 'receivedUnit\\.commentId',
			displayCommentTypes: ''
		   };
	getCommentTypes(args);
}

function forBillingStrted()
{
	//D030578: 	Unable to unlink unit - incorrect error that billing has started since unit is not linked to a bill
	if($("#billLinked").val() == 'true') 
	{
		$('#billingStrtedHyperlink').show();
	} else {
		$('#billingStrtedHyperlink').hide();
	}
}

function callCurrtBooking(){
	
	currentShippmentNumber = $("#curShipmentNo").html();
	window.open("/gates/billingSetup/loadShipmentDetail?shipmentNumber="+currentShippmentNumber+"&source=ULKG","_self");
	
	
}


function startsWith(expr, value) {
	if(value===undefined || value===null) return false;
	return (value.substr(0, expr.length) == expr);
}
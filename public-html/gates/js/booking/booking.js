var isBookingChanged = "N";
var isOverrideReset = "N";
var piece=" ";
var weightOriginal=" ";
var cubeOriginal=" ";
var POV_NAME = "PERSONAL AUTO";
var ALASKA_POV_NAME = "ALASKA AUTO";
var GOVERNMENT_NAME = "GOVERNMENT";
var tempShipperAddress='';
var tempConsigneeAddress='';
var tempPartyTypeCode="";




$(function() {

	setGlobalVariableValues(); // D029605 not getting called for new bookings.
	elRTE.prototype.options.panels.web2pyPanel = [ 'bold', 'italic',
			'underline', 'forecolor', 'hilitecolor', 'justifyleft',
			'justifyright', 'justifycenter', 'justifyfull', 'formatblock',
			'fontsize', 'fontname', 'insertorderedlist', 'insertunorderedlist',
			'link', 'image', ];

	elRTE.prototype.options.toolbars.web2pyToolbar = [ 'web2pyPanel', 'tables' ];
	                                           	
	isBookingChanged = "N";
	$('#bookingForm').validationEngine('attach');
	
	$('#bookingForm :input').change(function()
	{
		//D026018
		if($(this).attr('id') != "shipmentNumber"){
			isBookingChanged = "Y";
		}
	});
	
	$('#bookingForm select').change(function()
	{
		isBookingChanged = "Y";
	});
	
	$('.autoTabbedField').keypress(function(event){
		if(event.keyCode != 13 && $(this).val().length == ($(this).attr('maxlength')-1))
			$(this).next().focus();
	});

	
	if($('#bookingTypeCode').val()=='B'){
		//setDefaultCustomerGroup();
	}
	setScreenDetails();

	$('#commentsDiv').hide();
	$('#historyDiv').hide();
	$('#msgDivBill').hide();
	
	$("#quoteExistsDiv").hide();
	
	//enableDisableClearButton();
	
	//$("#shipperConsigneeNameDiv").html("<b>Shipper Consignee</b>");

	isBookingDeletable();
	//Display existing booking

	//Display existing booking
	/*$('#shipmentNumber').blur(function(){
		invokeBookingDisplayCall();
    });*/
	if($('#callFromQuote').val() != undefined && $('#callFromQuote').val() != '' && $('#callFromQuote').val() == 'Y'){		
		getQuote($('#quoteId').val());
	}
	if($('#shipmentNumber').val()!='') {
		$("#updatepayment").removeAttr("disabled");
	}
	
	// Booking Save
	$('#bookingSave').click(function(){
		checkTCNIBS();
		if(isBookingChanged == "Y")
			bookingSaveButtonClick();
		else
			alert("No fields have been changed. Cannot save");
	});
	
	/*if($('#userFromMenu').val()=='Y'){
		$('#bookingExit').hide();
	}else{
		$('#bookingExit').show();
	}*/
	
	// Exit
	var exitFlag = false;
	$('#bookingExit').click(function(){
		exitFlag = true;
		if($("#bookingStatusCode").val()!='CANC' && isBookingChanged=='Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				exitFromBooking();
			} else {
				exitFlag = false;
			}
		}else{
			exitFromBooking();
		}
    });
	
	//D018135: 	Did not receive msg "you have unsaved changes" 	
	$(window).bind('beforeunload', function(event){
		 if(isBookingChanged=='Y' && !exitFlag) {
			 exitFlag = false;
			 event.stopImmediatePropagation();
			 return 'You have unsaved changes!';
		 }
		 exitFlag = false;
	});
	
	//	Booking Payment
	$('#updatepayment').click(function() {
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				bookingHeaderLink('updatepayment/showForm',false);
			}
		} else {
			bookingHeaderLink('updatepayment/showForm',false);
		}
	});
	

	// Customize Name and Address
	$('#customizeNameAddress').click(function() {
		
		if(isBookingChanged == 'Y'){
			$('#isCustomizeNameAddress').val('true');
			bookingSaveButtonClick();
		}
		else{
			$('#isCustomizeNameAddress').val('false');

			if($('#partiesExists').val()=='true'){
				bookingHeaderLink("customizednameandaddress/showForm",false);
			}else{
				alert("No Parties exists.");
			}
		}
		
		/*if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				$('#isCustomizeNameAddress').val('true');
				saveBooking();
			}
		} else {
			$('#isCustomizeNameAddress').val('true');
			saveBooking();
		}*/
	});
	
	var isDeleteAllowed = false;
	var isEditAllowed = false;
	if($('#bookingTypeCode').val()=="T")
	{
		isDeleteAllowed = true;
		isEditAllowed = true;
	}
	/*var args = {
			entityType: 'BKNG',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'',
			isDeleteAllowed:isDeleteAllowed,
			isEditAllowed:isEditAllowed
		   };
	
	getCommentTypes(args);*/
	//$("#comment_link").comments(args);
		
	// Booking Delete
	$('#bookingDelete').click(function(){
		var ok = confirm("Do you really want to delete this Booking? (Ok/Cancel)");
		if(ok == true){
			deleteBooking();
		}					
    });	
	
	// create bill booking dialog at body on-load
	$("#billBookingDialog").dialog({
		//dialogClass:'transparent',
		autoOpen : false,
		width : 1000,
		height : 650,
		modal : true,
		close : function() {
			//Saif added this piece of code, but this is not required now as customer has asked to show Bill Started overlay on user click, not on booking load.
/*			Booking Security
			if(isHoldOverlayBottomEnabled){
				//Display Unreleased Holds Grid on initial display
				openUnreleasedHoldGridOnIntialDisplay("booking");
			}
*/		
			$('#msgDivBill').html("<div class=\"message_info\">Successfully Displayed.</div>");
		}
	});
	
	// create quote exists show dialog at body on-load
	$("#quoteShowDialog").dialog({
		autoOpen : false,
		width : 930,
		height : 300,
		modal : true,
		close : function() {
			unloadQuoteShowGrid();
			//$("#quoteShowDialog").dialog("close");
		}
	});

	//quoteExistsDiv present in create_booking.jsp
	$('#quoteExistsDiv').click(function(){
		showQuotesGrid();
    });	
	
	$("#tradeCode").blur(function(){
	/*	shipperOrgPredictive();
		shipperAddressPredictive();
		consigneeOrgPredictive();
		consigneeAddPredictive();
		partiesOrgPredictive();
		partiesAddPredictive();
		//Setting request params for hold predictive search
		holdPredictive();*/
	});

	createSpecialServiceGrid("booking");
		
	$("#sendDoc").click(function(){
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				if($('#bookingTypeCode').val()=='B')
					document.location.href = _context+"/booking/senddocument/create?nav=booking&bookingId=" + $("#shipmentNumber").val();
				else if($('#bookingTypeCode').val()=='T')
					document.location.href = _context+"/booking/senddocument/create?nav=template&bookingId=" + $("#shipmentNumber").val();
			}
		} else {
			if($('#bookingTypeCode').val()=='B')
				document.location.href = _context+"/booking/senddocument/create?nav=booking&bookingId=" + $("#shipmentNumber").val();
			else if($('#bookingTypeCode').val()=='T')
				document.location.href = _context+"/booking/senddocument/create?nav=template&bookingId=" + $("#shipmentNumber").val();
		}
	});

	/*$('#shipmentNumber').change(function() {
		if($('#shipmentNumberHidden').val()!=$('#shipmentNumber').val()){
			$('#shipmentNumber').val("");
		}
	});*/
	
	//Dispatch
	$('#dispatchBtn').click(function() {
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				document.location.href=_context +"/createdispatch/loadDispatchRequestByShipmentTemplateID?userFromMenu=booking&id="+$('#shipmentNumberHidden').val()+"&shipmentTemplateId="+null;
			}
		} else {
			document.location.href=_context +"/createdispatch/loadDispatchRequestByShipmentTemplateID?userFromMenu=booking&id="+$('#shipmentNumberHidden').val()+"&shipmentTemplateId="+null;
		}
		//window.open(_context +"/createdispatch/loadDispatchRequestByShipmentTemplateID?id="+$('#shipmentNumberHidden').val()+"&shipmentTemplateId="+null);
	});
	
	/*if($('#shipmentNumber').val()!='') {
		var event = jQuery.Event("keypress");
		event.keyCode = 13;
		$('#shipmentNumber').trigger(event);
	}*/
	
	//moved to create_booking.jsp
	/*if(null!=$('#shipmentNumber').val() && $('#shipmentNumber').val()!='' && $('#bookingTypeCode').val()=='B'){
		displayBooking();
	}*/

	// Booking Clear, clear button is clicked
	$('#bookingClear').click(function() {
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				tempShipperAddress='';
				tempConsigneeAddress='';
				tempPartyTypeCode="";
				clearBookingDataOnClearBtnClick();
			}
		} else {
			tempShipperAddress='';
			tempConsigneeAddress='';
			tempPartyTypeCode="";
			clearBookingDataOnClearBtnClick();
		}
    });
	
	$('#billBooking').click(function() {
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				billBooking();
			}
		} else {
			billBooking();
		}
	});

	if(null!=$('#templateNumberOnLoad').val() && $('#templateNumberOnLoad').val()!='' && $('#bookingTypeCode').val()=='B'){
		templateUpdate($('#templateNumberOnLoad').val(),'MaintainBooking');
	}

	
	//makeGridForReError("booking");
		
		/*$('#msgDiv').change(function(){
			//$("#msgDivDialog" ).show();
			$("#msgDivDialog" ).html($("#msgDiv").html());
		      $("#msgDivDialog" ).dialog({autoResize : true, minHeight: 0, modal: true, width: 543, 
		    	  close : function(event, ui) {
		    		  $("#msgDivDialog" ).hide();
		    	  }
		      });
		});*/
	
	$("#bookingStatusCode").change(function(){
		$("#bookingSave").attr("disabled",false);
		if($('#savedBookingStatusCode').val()=='CANC'){
			makeFormReadOnly('','bookingForm',false);
		}
	});

	/*$('#billingStartedHyperlink').click(function(){
		$('#receivedFreightGridDiv').hide();
		$('#receivedUnitsGridDiv').hide();
		loadBillStartedGrids();
		collapseAll();
		invokeBillingStartedOverlayScreen();
	});*/
	
	$('#sendEDI').click(function() {
		$('#msgDiv').html("<div class=\"message_info\">Sending EDI Confirmation...</div>");
		sendEDIConfirmation('sendEDI');
	});
	
	$("#msgDivDialog" ).dialog({autoOpen: false, autoResize : true, minHeight: 0, modal: true, width: 543,
		close : function(event, ui) {
			var errorText = $('#msgDivFrt').text();
			if(errorText!='' && ((errorText.search('tariff')>0 && errorText.search('item')>0) || (errorText.search('tariff')>0))){
				$('#tariff').focus();
			}
			else if(errorText.search('item')>0){
				$('#tariffItemNumber').focus();
			}
  	  }
	});
	tabSequence('#bookingForm',false,false);
	//Hitsory
	$("#changeLog").dialog({
		//dialogClass:'transparent',
		autoOpen : false,
		width : 900,
		height : 850,
		modal : true,
		/*position:{
			my: "left center",
			at: "left+100 center",
			of: window
		},*/
		buttons: {
	         Exit: function(){
	        	 $( this ).dialog( "close" );
	         }
	    }
	});
	
	$("#kickerTemplatesDivDialog").dialog({
		title: 'Alert Email Templates',
		autoOpen: false, 
		autoResize : true, 
		minHeight: 0, 
		modal: true, 
		width: 850,
		buttons : [ {
			text : "Exit",
			click : function() {
				$(this).dialog("close");
			}
		}, {
			text : "Print",
			click : function() {
			    var myGrid = $('#sendKickerGrid');
			    var selRowId = myGrid.jqGrid ('getGridParam', 'selrow');
			    if (null == selRowId) {
			    	alert('Please select a template');
			    	return;
			    }
			    var templateId = myGrid.jqGrid ('getCell', selRowId, 'templateId');
				applyAndPrintKicker(templateId);
			}
		},{
			text : "Send",
			click : function() {
			    var myGrid = $('#sendKickerGrid');
			    var selRowId = myGrid.jqGrid ('getGridParam', 'selrow');
			    if (null == selRowId) {
			    	alert('Please select a template');
			    	return;
			    }
			    var templateId = myGrid.jqGrid ('getCell', selRowId, 'templateId');
				applyAndSendKicker(templateId);
			}
		} ]
	});
	
	$("#sendKickerDivDialog-isHtml").val('false'); // initial state for SendEmail overlay
	
	$("#sendKickerDivDialog").dialog({ // initializing overlay for SendEmail
		title : 'Send Alert Email',
		autoOpen : false,
		autoResize : true,
		minHeight : 0,
		modal : true,
		width : 1024,
		buttons : {
			Exit : function() {
				$(this).dialog("close");
			},
			Send : function() {
				console.log('Sending alert .. isHtml?' + $('#sendKickerDivDialog-isHtml').val());
				var urlStr = _context +"/booking/sendBookingKicker";
				var to = $('#sendKickerDivDialog-emailTo').val();
				var subject = $('#sendKickerDivDialog-emailSubject').val();
				if ($.trim(to) == '' ) {
					alert("Email is required");
					return false;
				}
				if ($.trim(subject) == '' ) {
					alert("Subject is required");
					return false;
				}
				blockUI();
				var data = {
					emailBody : ($('#sendKickerDivDialog-isHtml').val() == 'true') ? $('#sendKickerDivDialog-emailBody').elrte('val'):$('#sendKickerDivDialog-emailBody').val() ,
					emailTo : $('#sendKickerDivDialog-emailTo').val(),
					emailCc : $('#sendKickerDivDialog-emailCc').val(),
					emailSubject : $('#sendKickerDivDialog-emailSubject').val(),
					bookingNumber : $('#sendKickerDivDialog-bookingNumber').val(),
					templateId : $('#sendKickerDivDialog-templateId').val()
				}
				$.ajax({
					type: "POST",
					url: urlStr,
					data: data,
					dataType:'json',
					success: function(responseData){
						console.log('Sending alert ... Success');
						$.unblockUI();
						alert("Email Alert sent successfully");
						$(this).dialog("close");
					},
					error: function(jqXHR,textStatus,errorThrown) {
						console.log('Sending alert ... Error');
						$.unblockUI();
						alert("Email Alert could not be sent");
						$(this).dialog("close");
					}
				});
			}
		}
	});
	
});

function checkTCNIBS(){
	if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $.trim($('#isAllowBookingUnit').val())=="Y"){
		   if($("#tcnGrid").getGridParam("records")==0 && $('#militaryIbsStatusCode option:selected').text()==''){
	              
               $("#militaryIbsStatusCode").removeClass("validate\[required\]");
               $("#militaryTcn").removeClass("validate\[required\]");
        }else {
        
               if($("#tcnGrid").getGridParam("records")==0){
            	   //If the IBS is present and not the tcn should expand the commodity section
          	     	 expandSection(4);
                     $("#militaryTcn").addClass("validate\[required\]");
               } else {
                     $("#militaryTcn").removeClass("validate\[required\]");
               }
               
               if($('#militaryIbsStatusCode option:selected').text()==''){
                     expandSection(5);
                     $("#militaryIbsStatusCode").addClass("validate\[required\]");
               } else {            	  
                     $("#militaryIbsStatusCode").removeClass("validate\[required\]");
               }
               
        }	
	}
}
function createCommentFunc(){
	var isDeleteAllowed = false;
	var isEditAllowed = false;
	if($('#bookingTypeCode').val()=="T")
	{
		isDeleteAllowed = true;
		isEditAllowed = true;
	}
	var args = {
			entityType: 'BKNG',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'',
			isDeleteAllowed:isDeleteAllowed,
			isEditAllowed:isEditAllowed
		   };
	
	getCommentTypes(args);
}


function cancelBooking(){
	$('#msgDiv').html("<div class=\"message_info\">Please wait while booking is cancelled...</div>");
	$('#msgDiv').show();
	$.ajax({
		url: _context +"/booking/cancelBooking",
		data: {
			bookingId: $("#bookingId").val(),
			shipmentNumber: $("#shipmentNumber").val()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				$('#bookingStatusCode').val('CANC');
				$('#savedBookingStatusCode').val('CANC');
				makeFormReadOnly('','bookingForm',true);
				$('#shipmentNumber').focus();
				isBookingDeletable();
				isBookingChanged = "N";
			}
			showResponseMessages('msgDiv', responseText);
			$.unblockUI();
		}
	});
}	

function removeGridValuesOfsDataRow(){
	//Ref-number section
	$('#referenceNumberNotation').val("");
	$('#typeCode').val(0);
	//dodaac
	$('#dodaacCode').val("");
}

function bookingSaveButtonClick(){
	//change for D025317
	if($('#bookingStatusCode').val()!='PEND' && $('#bookingStatusCode').val()!='INCP'){
	var status = freightDeleteCheckOnBookingSave();
	if(status=='failure'){
		return;
	}
	}
	
	var loadServiceCode = $('#loadServiceCode :selected').val();
	var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
	
	if(loadServiceCode=="RO" && dischargeServiceCode=="RO" && $('#freight\\.isRoRo1').is(':checked')==false){
		alert("Rolling Stock Ind must be checked for selected Load/Discharge service. Please check it and save again.");
		//$('#freight\\.isRoRo1').attr('checked', true);
		return;
	}
	
	//D026820
	var pickupZipCode = $('#pickupZipCode').val();
	var deliveryZipCode = $('#deliveryZipCode').val();
	if(loadServiceCode=="P" && pickupZipCode=='')
	{
	alert(" PickUp Zip required");
	return;
	}
	else if(loadServiceCode=="P"){
		if(!validateZip('pickup')){
			return;
		}
	}
	if(dischargeServiceCode=="P" && deliveryZipCode=='')
	{
	alert(" DeliveryZip required");
	return;
	}
	else if(dischargeServiceCode=="P"){
		if(!validateZip('delivery')){
			return;
		}
	}
	
	$('#bookingSave').attr("disabled", true);
	blockUI();
	removeErrorPointers();
	removeGridValuesOfsDataRow();
	//user wants to cancel booking
	if($('#bookingStatusCode').val()=='CANC' && $("#bookingId").val()!=''){
		//D026010
			//var overRide = confirm("Do you really want to Cancel the "+ $('#shipmentNumberHidden').val() +" booking? ");
			//if(overRide == true){
				cancelBooking();
			//}else{
			//	$('#bookingSave').attr("disabled", false);
			//	$.unblockUI();
			//}
		}else{
		if(!checkIfAnyFreightFieldHasValue()){
			resetMandatoryCmdDesc();
		}
		else{
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
			}
			if($("#primaryFreightPresent").val()=='Y'){
        		if($("#tariffCommodityDescription").val()=='' || $("#tariff").val()=='' || $("#tariffItemNumber").val()=='' || $("#commodityCode").val()==''){
        			setMandatoryTariffCmdDesc();
        			resetMandatoryCustDesc();
        		}
        		else{
        			resetMandatoryCmdDesc();
        		}
        	}
			else{
				if($("#tariff").val().trim()!='' && $("#tariffItemNumber").val().trim()==''){
					setMandatoryTariffItem();
					resetMandatoryCmdDesc();
				}
				else{
					resetMandatoryTariffCmdDesc();
					setMandatoryCmdDesc();
				}
			}
		}
		if(!$("#bookingForm").validationEngine('validate') || !validateBookingUIFields()){
			$('#bookingSave').attr("disabled", false);
			$.unblockUI();
			return;
		}else{
			/*if($('#shipmentNumberHidden').val() !='' && $('#quoteNumber').val()==$('#shipmentNumberHidden').val()){
				checkRatingAttributes();
			}else */if($('#bookingStatusCode').val()=='CANC'){
				var overRide = confirm("Do you really want to Cancel the "+ $('#shipmentNumberHidden').val() +" booking? ");
				if(overRide == true){
					checkDebtors();
				}else{
					$('#bookingSave').attr("disabled", false);
					$.unblockUI();
				}
			}else{
				checkDebtors();
			}
		}
	}
	$('#primaryCarrierCode').val(($('#primaryCarrierCode').val()).toUpperCase()); 
}

function checkRatingAttributes(){
	if("Y"==isBookingFromQuote()){
		var booking = $('#bookingForm').formSerialize();
		var urlStr = _context +"/booking/checkRatingAttributes";
		$.ajax({
			type: "POST",
			url: urlStr,
			data: booking,
			success: function(responseText){
				if(responseText.messages.error.length>0){
					var overRide = confirm(responseText.messages.error);
					if(overRide == true){
						saveBooking();
					}else{
						$('#bookingSave').attr("disabled", false);
						$.unblockUI();
					}
				}else{
					saveBooking();
				}
			}
		});
	}else{
		saveBooking();
	}
}

function invokeBookingDisplayCall(){
	//&& $('#shipmentNumber').val() != $('#shipmentNumberHidden').val()
	if($('#shipmentNumber').val()!='' && $('#shipmentNumber').val().length==7){
		//$('#shipmentNumberHidden').val($('#shipmentNumber').val());
		if($('#bookingTypeCode').val()=='B'){
			if($('#shipmentNumber').val().toUpperCase().indexOf('T')==-1){
				showLoadingMessage();
				displayBooking();
			}else{
				$('#shipmentNumber').validationEngine('showPrompt', 'Booking entity not valid.', 'error', 'topRight', true);
			}
		}else if($('#bookingTypeCode').val()=='T'){
			if($('#shipmentNumber').val().toUpperCase().indexOf('T')==0){
				showLoadingMessage();
				displayTemplate($('#shipmentNumber').val());
			}else{
				$('#shipmentNumber').validationEngine('showPrompt', 'Template booking not valid.', 'error', 'topRight', true);
			}
		}
	}
}

/*function enableDisableClearButton(){
	if($('#shipmentNumberHidden').val()==''){
		$("#bookingClear").attr("disabled",false);
	}else{
		$("#bookingClear").attr("disabled",true);
	}
}
*/

function billBooking(){
	makeGridForReError("booking");
	// Bill Booking
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/booking/checkbill",
		data: {
			bookingId: $("#bookingId").val(),
			shipmentNumber: $("#shipmentNumber").val(),
			loadServiceCode: $("#loadServiceCode").val(),
			dischargeServiceCode: $("#dischargeServiceCode").val()
		},
		success: function(responseText){
			$.unblockUI();
			if(responseText.success==false){
				showResponseMessages("msgDiv", responseText);
				return;
			}
			if (responseText.messages.error.length == 0) {
				
				if(responseText.data.rateView == "showError"){
					$("#bookingForm").loadJSON(responseText.data);
					loadErrorOverLay(responseText);							
					$('#re_error_dialog').dialog( "open" );
					$("#reErrorGrid").trigger('reloadGrid');
					displayBooking();
				}else if(responseText.data.rateView == "showChoices"){
					$("#bookingForm").loadJSON(responseText.data);
					loadChoiceOverLay(responseText);
					$('#reUseSelection').val('S');
					$('#re_choice_dialog').dialog( "open" );
					$("#reChoiceGrid").trigger('reloadGrid');
					displayBooking();
				}
				else if (responseText.data.rateView == "hold"){
					if(responseText.data.flow == true){
						navigateToTargetPageForFurtherFlow('Maintain Booking',responseText.data.targetPage, 
							$("#shipmentNumber").val(), responseText.data.sequenceNumber,"000",
							"2");
						return;
					}
					
					if(responseText.data.targetPage == null ||
							responseText.data.targetPage == "Maintain Booking"){
						openHoldsUnreleasedDialog('booking');
						displayBooking();
						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
					}else{
						var sequenceNumber = "";
						if(responseText.data.sequenceNumber != null)
							sequenceNumber = responseText.data.sequenceNumber;
						navigateToTargetPage('Maintain Booking',responseText.data.targetPage, 
								$("#shipmentNumber").val(), sequenceNumber,"000",
								"2");
					}
//						$("#holdDialog").dialog("close");
					
//						$("#holdsUnreleased").attr("style","visibilty:visible");
//						$('#holdUnreleasedGrid').trigger('reloadGrid');
				}else if(responseText.data.rateView == "exception"){
					$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
					window.scrollTo(0, 0);
					triggerErrorMessageAlert();
					return;
				}else if(responseText.data.rateView == "blank"){
					openHoldsUnreleasedDialog('shipment');
				}
				else if(responseText.data.rateView == "Success"){
						if(responseText.data.targetScreen == 'BK01'){
							displayBooking();
						}else if(responseText.data.targetScreen == 'BLRT'){
							document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
							$("#shipmentNumber").val()+'&shipmentSequenceNumber='+responseText.data.shipmentSequenceNumber
							+'&shipmentCorrectionNumber=000&navigationUrl=2';
						}
//						showResponseMessages("msgDiv", responseText);
//						displayBooking();
					}
				}else{
					displayBooking();
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				if(null != textStatus){
						$.unblockUI();
						$('#msgDiv').html("<div class=\"message_error\">An error has occured calling Bill Manager.</div>");
						window.scrollTo(0, 0);
						return;
				}
			}
		}
    );
}

function isBookingFromQuote(){
	var quoteNumber = $('#quoteVNConcat').val();
	var bookingNumber = $('#shipmentNumber').val();
	if(null == quoteNumber || quoteNumber == ''){
		return "N";
	}
	if(null == bookingNumber || bookingNumber == ''){
		return "N";
	}
	if(bookingNumber == quoteNumber){
		return "Y";
	}
}

function clearBookingDataOnClearBtnClick(){
	$('#msgDiv').html("<div class=\"message_info\">Please wait while screen is refreshed...</div>");
	$('#msgDiv').show();
	$.ajax({
		url: _context +"/booking/clear",
		data : {
			bookingFromQuote : isBookingFromQuote()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				/*Freight*/
				resetMandatory();
				responseText.data.header.bookingCsr="";
				$('#shipmentNumberHidden').val("");
				setBookingTitle(null);
				makeFormReadOnly(responseText,'bookingForm',false);
				clearBookingForm();
				/*Reset load discharge service*/
				getAllLoadServices();
				getAllDischargeServices();
				expandAll();
				//expandAllNew();
				/*Reset hold bottom overlay*/
				resetHoldUnreleasedGrid();
				handleButtonOnCLearClick();
				collapseSection(4);
				reInitOnClear();
				enableDisableNote();				
				
				setGlobalVariableValues(); // D029605
				setHazCount("-");
				$('#shipmentNumber').focus();
			}
			showResponseMessages('msgDiv', responseText);
			window.scrollTo(0, 0);
		}
	});
}	

function reInitOnClear(){
	//refresh
	$('#previousTradeCode').val("");
	$('#customerGroupId').val("");
	$('#lastLoadDschServiceGroupCode').val("");
	$('#displayingBookingEvent').val("N");
	$('#displayingTemplateEvent').val("N");
	$("#entityVersion").val('');
	$('#commentId').val('');
	$('#ratingAttributesChanged').val('');
	$('#bookingTemplateOwner').val('');
	$('#showQuoteForAroleOnTemplatePull').val('');
	$('#bookingTemplateOwnerPartyType').val('');
	$('#bookingStatusCodeHidden').val('');
	$('#quoteIsLoadedOnScreen').val('');
	$('#isCustomizeNameAddress').val('');
	$('#billExists').val('');
	$('#displayingBookingEvent').val('N');
	$('input[name="shipper\\.organizationName"]').css('color', 'black');			//for defect D020335
	$('input[name="consignee\\.organizationName"]').css('color', 'black');
	$('#refNumOverRideForShipper').val('');
	$('#refNumOverRideForConsignee').val('');
	$('#hiddenBookedDate').val('');
	$('#isInBond').val("false");
	$('#dealerAuctionLocationCode').attr("disabled", true);
	$('#inbondNumber').attr("disabled", true);
	$('#overridePickupCarrierCode').attr('disabled', true);
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	$('#bookingStatusCode').val('');
	$('#customerGroupId').val('');
	$('#militaryIbsStatusCode').val("");
	//$("#overrideInitialLtvDate").val("01-01-0001");
	$('#billingStartedHyperlink').hide();
	$('#vvdChangeAuthPartyCode').attr("disabled", true);
	$('#partiesExists').val("false");
	//$('#shipmentNumberHidden').val("");
	$('#refNumOverRideForShipper').val("N");
	$('#refNumOverRideForConsignee').val("N");
	/*$('#consigneeZipOverride').val("");
	$('#dealerCode').val("");
	$('#templateNumberOnLoad').val("");
	$('#templateAppliedOnBookingFromScreen').val("");
	$('#userFromMenu').val("");*/
	$('#checkRequiredDispatch').val("N");
	//Freight
	iterated = false;
	$("#okAlreadyPressed").val("false");
	$('#showAlertTCGLDSP').val("true");
	$('#selectTCGLDSPChange').val("N");
	$('#freightSeqNo').val('');
	$('select#currentCommodityLine').children().remove().end().append('<option selected value="0">0</option>');
	$('#totalCommodityLines').text(0);
	disableAccordian(4);
	$('#freightVVDModified').val('N');
	$('#billOfLadingLink').text('Bill Of Lading');
	$('#holdEqpExists').text('');
	$('#createBkngTmplSeqNbrDs').val("");
	
	$('#chargeCurrency').text('');
	$('#actualTotalChargeAmount').text('');
	//D031804: bkg# 6317125 cntr# CHVU070920 error on container variance page
	$('#ediTypeCode').val('');
	$('#isRequireCustomerVerifyAdd').val('');
	$('#isRequireCustomerVerifyChg').val('');
	
	$('#isVgmRequiredDefault').text('');
	
}

function handleButtonOnCLearClick(){
	$("#dispatchBtn").attr("disabled", true);
	$("#updatepayment").attr("disabled", true);
	$("#sendDoc").attr("disabled", true);
	$("#sendEDI").attr("disabled", true);
	$("#alert").attr("disabled", true);
	$("#billBooking").attr("disabled", true);
	$("#customizeNameAddress").attr("disabled", true);
	$("#bookingDelete").attr("disabled", true);
	$("#holdRelease").attr("disabled", true);
	
	//handle URL/Hyperlinks
	var aHtml = ""
		+"<a href=\"javascript:templatePopupSearch();\">"
		+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images/search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
		+"</a>"
		+"";
	$('#templateDiv').html(aHtml);
}

function displayBookingRequest(callBack) { // Cheetah 
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/booking/display",
		data: { bookingNumber: $("#shipmentNumber").val(), userFromMenu: $("#userFromMenu").val() },
		success: function(responseText) {
			callBack.call(this, responseText);
			$.unblockUI();
		}
	});
}

var oldBkNbr;
function displayBooking(){
	oldBkNbr = $("#shipmentNumber").val();
	if($('#displayingBookingEvent').val()=="N"){
		
		function displayBookingCallBack(responseText){ // Cheetah
			// Clear fields of booking form and reset the defaults
			clearBookingForm();
			if (responseText.messages.error.length == 0) {
				$('#billingStartedHyperlink').hide();
				/*if(responseText.data.header.billExists=="Y"){
					$('#receivedFreightGridDiv').hide();
					$('#receivedUnitsGridDiv').hide();
					loadBillStartedGrids();
				}*/
				showJSON(responseText);
				collapseAll();
				$('#billExists').val(responseText.data.header.billExists);
				var billTypeFlag = responseText.data.parties.partyTypeFlag;
				if(null == billTypeFlag || billTypeFlag == ''){
					billTypeFlag = "NO BL";
				}
				//	D026349: 	FW: Maintain Booking: Hyperlink in Parties section is flowing to Billing Doc Distribution but it should be flowing to Booking Doc Distribution
//					if(responseText.data.header.billExists=="Y"){
//						$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('shipmentPrntOptnsOverride/getPrintOptionOverride?navigationFrom=BK',true);\">"+billTypeFlag+"</a>");
//					}else{
					$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+billTypeFlag+"</a>");
//					}
				
				// 	D028769: 	Maintain booking - on hold in parties section shows but not on maintain bill 
					/*
				if(responseText.data.holdEqpExists) {
					$('#holdEqpExists').text('-On Hold');
				} else {
					$('#holdEqpExists').text('');
				}
				*/
				//D031169: 	Priority Stow to have a new selection list only for Alaska
				if(responseText.data.header.tradeCode!=null && responseText.data.header.tradeCode=='A'){
					setStowDataForAlaska();
				} else {
					$("#stowSelect").hide();
				}
			
				setPartyTypeFlag(responseText.data.header.billExists, responseText.data.header.isToOrderParty);
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
				
				console.log("userfrom="+$("#userFromMenu").val());
				if(responseText.data.isBookingOnEDIReviewQueue=='Y'){
					var fromMenu = $("#userFromMenu").val();
					var fromEdi = false;
					if(fromMenu.lastIndexOf("ediBookingDetail_", 0) === 0 ) {
						fromEdi = true;
					}
					
					//Defect - D019815 - 018501
					// D029837: add canc
					if(responseText.data.header.bookingStatusCode!='CANC'  && responseText.data.header.bookingStatusCode!='APPR' && responseText.data.header.bookingStatusCode!='OFFR' && $("#userFromMenu").val() != 'webBookingReviewQueue' && !fromEdi ){
						//ediBookingDetail_
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
				reloadBookingGrids();
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
			//D029724: 	Prod Maintain Booking : Error: Zero is not a valid weight 
			if($("#weight").val()==0){
				$("#weight").val('');
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
			
			$("#gridIdForParties").trigger('reloadGrid');
			enableDisableNote();
			
		}
		
		displayBookingRequest(displayBookingCallBack); // Cheetah
	}
}

function setDefaultCustomerGroup(){
	$.getJSON(_context+'/cas/autocomplete.do?method=getCustGrp&searchType=250&parentSearch=OT',
			function(contacts){
				$(contacts).each(function() {										
					//Highlight these Groups
					var toBeHighlighted = this.value;
					$("#customerGroupId option").each(function() {
						if (this.value == toBeHighlighted) { 
							$(this).attr('selected', 'selected');
						}
					});				
				});
				if($("#customerGroupId :selected").val()=="")
				{
					$("#customerGroupId option").each(function() {
						  if($(this).text() == "GENERAL GROUP") {
						    $(this).attr('selected', 'selected');            
						  }                        
					});
				}
			}
		);
	}

function resetDivNames(){
	//$("#shipperConsigneeNameDiv").html("<b>Shipper Consignee</b>");
	//setAccordianTabDetails("shipperNameDiv", "Shipper");
	//setAccordianTabDetails("consigneeNameDiv", "Consignee");
	$("#shipperNameDiv").html("");
	$("#consigneeNameDiv").html("");
	setAccordianTabDetails("partiesHeader", "");
	setAccordianTabDetails("refAndMarksId", "Reference Numbers");
	setAccordianTabDetails("routingHeader", "");
	setAccordianTabDetails("maintainBookingCommodityId", "");
	setAccordianTabDetails("maintainBookingMilitaryId", "");
	setAccordianTabDetails("splServicesHeader", "");
	setAccordianTabDetails("clauseHeader", "");
	setAccordianTabDetails("maintainBookingHoldId", "");
	setAccordianTabDetails("bookingOverridesText", "Booking Overrides");
}

function prepareHeaderDataForBillingOverlay(responseText){
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

function showLoadingMessage(){
	$("#shipmentNumber").attr("disabled",true);
	if($('#bookingTypeCode').val()=='B'){
		$('#msgDiv').html("<div class=\"message_info\">Loading booking "+ $("#shipmentNumber").val() +" ...</div>");
	}else{
		$('#msgDiv').html("<div class=\"message_info\">Loading template "+ $("#shipmentNumber").val() +" ...</div>");
	}
	$('#msgDiv').show();
}

function showSavingMessage(){
	$("#bookingSave").attr("disabled",true);
	var entity="";
	if($('#bookingTypeCode').val()=='B'){
		entity = "Booking";
	}else if($('#bookingTypeCode').val()=='T'){
		entity = "Template";
	}
	if($('#bookingId').val()==''){
		$('#msgDiv').html("<div class=\"message_info\">Please wait while "+ entity +" is saved...</div>");
	}else{
		$('#msgDiv').html("<div class=\"message_info\">Please wait while "+ entity +" is updated...</div>");
	}
	window.scrollTo(0, 0);
	$('#msgDiv').show();
}

//common method for all UI fields...
function validateBookingUIFields(){
	var uiFieldsValidationStatus = true;

	uiFieldsValidationStatus = validateShipmentNumber();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	//if($('#tradeCode').val() == 'F'){//for tradedefect
	uiFieldsValidationStatus = validateContactForShipperConsignee('shipper');
	if(uiFieldsValidationStatus==false){
		return uiFieldsValidationStatus;
	}
	
	uiFieldsValidationStatus = validateContactForShipperConsignee('consignee');
	if(uiFieldsValidationStatus==false){
		return uiFieldsValidationStatus;
	}
	//}	

	uiFieldsValidationStatus = validatePartiesSectionOnSave();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	
	uiFieldsValidationStatus = validateRoutingFieldsOnSave();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	
	uiFieldsValidationStatus = validateFreightFieldsOnSave();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	
	uiFieldsValidationStatus = validateMilitaryFieldsOnSave();
	if(uiFieldsValidationStatus==false){
		return uiFieldsValidationStatus;
	}
	
	uiFieldsValidationStatus = validateOverridesFieldsOnSave();
	if(uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
	
	return uiFieldsValidationStatus;
}

function validateShipmentNumber(){
	if($('#shipmentNumberHidden').val()!= $('#shipmentNumber').val() && $('#bookingTypeCode').val()=='B'){
		$('#shipmentNumber').validationEngine('showPrompt', 'Booking must be saved/loaded first.', 'error', 'topRight', true);
		return false;
	}
}

function validateBooking(){
	if($('input[name="shipper\\.addressRoleId"]').val()=="" && $('input[name="consignee\\.addressRoleId"]').val()==""){
		var freightExists=checkFreightExists();
		if(freightExists==true){
			addUpdateCommodityOnBKSave();
		}else{
			saveBooking();
		}
	}else if(checkForTemplate()){
		if($('input[name="shipper\\.addressRoleId"]').val()!="" && ($('#refNumOverRideForShipper').val()=="N" || $('#refNumOverRideForShipper').val()=="") 
			|| $('input[name="consignee\\.addressRoleId"]').val()!="" && ($('#refNumOverRideForConsignee').val()=="N" || $('#refNumOverRideForConsignee').val()=="")){
			validateBookingReferenceNumber();
		}else if($('#consigneeZipOverride').val()=="N" || $('#consigneeZipOverride').val()==""){
			var trade = $("#tradeCode").val();
			var cneeZip = $('input[name="consignee\\.zip"]').val();
			if(trade!=null && (trade=='H' || trade =='G') && cneeZip != ''){
				validateConsigneeZip();
			}else{
				isChangesValidAfterUnitsReceived();
			}
		}else if($('#isChangeAcceptedAfterUnitsReceived').val()=="N" || $('#isChangeAcceptedAfterUnitsReceived').val()==""){
			isChangesValidAfterUnitsReceived();
		}else{
			var freightExists=checkFreightExists();
			if(freightExists==true){
				addUpdateCommodityOnBKSave();
			}else{
				saveBooking();
			}
		}
	}
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function checkFreightExists(){
	var commodityLines=$('#currentCommodityLine').val();
	if(commodityLines=='0'){
		if($("#tariff").val()=='' && $("#tariffItemNumber").val()=='' && $("#commodityDescription").val()==''){
			var rowIDs = jQuery("#equipmentGrid").getDataIDs();
			// If equipment is filled out force creation of freight.
			if(isEmpty(rowIDs)) {
				return false;
			}
		}
	}
	return true;
}

function addUpdateCommodityOnBKSave(){
	
	/*var status=$('#bookingStatusCode').val();
	if(status=='APPR')
	{
		 if(!bookingApprovalEnabled)
		  {
			$('#msgDiv').html("<div class=\"message_error\">"+"No Enough Permission to Approve Booking"+"</div>");
			window.scrollTo(0, 0);
			triggerErrorMessageAlert();
			return;
		  }
	}*/
	var isFreightUpdate = checkForAddOrUpdate();
	if(isFreightUpdate==false){
		var dataUrl = _context +"/booking/freight/addFreight";
		var freightValidationFlag = addUpdateFreight(dataUrl, true);
		if(freightValidationFlag == undefined || freightValidationFlag==false){
			//check whether accordian is closed : if yes open the accordian
			//collapseAll();
			if(!$('#tariff').is(':visible')){
	    		var status = $($('.booking-section')[4]).accordion('option', 'active');
	    		if (typeof status == "boolean" && !status) {
	    			$($('.booking-section')[4]).accordion('option', 'active', 0);
	    		}
    		}
			var equipmentGridCollapsed = $('#equipmentGrid').is(':visible');
			if(!equipmentGridCollapsed){
				if($('#tariff').is(':visible')){
					$(".HeaderButton", ("#gview_equipmentGrid")).click();
				}
			}
			
			setTimeout(function(){
				if(updateEquipmentErrorOccurred)
				{
					if(!$($('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td')[0]).is(':visible') || 
							$($('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td')[0]).html()=='')
						saveAllEquipments();
				}
				scrollToCommodity();
				$.unblockUI();
				$('#bookingSave').attr("disabled", false);
			}, 250);
			
			return;
		}
	}else if(isFreightUpdate==true){
		var dataUrl = _context +"/booking/freight/updateFreight";
		var freightValidationFlag = addUpdateFreight(dataUrl,true);
		if(freightValidationFlag == undefined || freightValidationFlag==false){
			//check whether accordian is closed : if yes open the accordian
			/*$($('.booking-section')[4]).accordion("enable");
			$($('.booking-section')[4]).accordion('option', 'active', 0);*/
			//collapseAll();
			if(!$('#tariff').is(':visible')){
	    		var status = $($('.booking-section')[4]).accordion('option', 'active');
	    		if (typeof status == "boolean" && !status) {
	    			$($('.booking-section')[4]).accordion('option', 'active', 0);
	    		}
	    		
    		}
			
			var equipmentGridCollapsed = $('#equipmentGrid').is(':visible');
			if(!equipmentGridCollapsed){
				if($('#tariff').is(':visible')){
					$(".HeaderButton", ("#gview_equipmentGrid")).click();
				}
			}
			
			setTimeout(function(){
				if(updateEquipmentErrorOccurred)
				{
					if(!$($('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td')[0]).is(':visible') || 
							$($('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td')[0]).html()=='')
						saveAllEquipments();
				}
				scrollToCommodity();
				$.unblockUI();
				$('#bookingSave').attr("disabled", false);
			}, 250);
			
			return;
		}
	}
	//saveBooking();
}
//D034303
function checkForTemplate(){
	var returnFlag = true;
	if($('#bookingTypeCode').val()=='B'){
		var booking = $('#bookingForm').formSerialize();
		var urlStr = _context +"/booking/checkForTemplates";
		$.ajax({
			type: "POST",
			url: urlStr,
			data: booking,
			async: false,
			success: function(responseText){
				if(responseText.messages.error.length>0){
					if ($('#shipmentNumber').val() == ""){
						showResponseMessages("msgDiv", responseText);
						$.unblockUI();
						$('#bookingSave').attr("disabled", false);
						returnFlag =  false;
					} else {
						var overRide = confirm("Templates exist for this AROL, do you want to override template use ?");
						if(overRide == true){
							returnFlag =  true;
						}else{
							//showResponseMessages("msgDiv", responseText);
							$.unblockUI();
							$('#bookingSave').attr("disabled", false);
							returnFlag =  false;
						}
					}
				}
			}
		});
	}
	return returnFlag;
}

function validateBookingReferenceNumber(){
	var booking = $('#bookingForm').formSerialize();
	var urlStr = _context +"/booking/validate";
	$.ajax({
		type: "POST",
		url: urlStr,
		data: booking,
		success: function(responseText){
			if(responseText.messages.error.length>0){
				if (responseText.messages.error[0]=='shipper.ref.error') {
					var overRide = confirm("Shipper requires reference number. Confirm override.(Ok/Cancel)");
					if(overRide == true){
						$('#refNumOverRideForShipper').val("Y");
						if($('#refNumOverRideForConsignee').val()=="N" || $('#refNumOverRideForConsignee').val()==""){
							validateBookingReferenceNumber();
						}
					}else{
						$('#refNumOverRideForShipper').val("N");
						$.unblockUI();
						$('#bookingSave').attr("disabled", false);
					}
				}else if (responseText.messages.error[0]=='consignee.ref.error') {
					var overRide = confirm("Consignee requires reference number. Confirm override.(Ok/Cancel)");
					if(overRide == true){
						$('#refNumOverRideForConsignee').val("Y");
						validateConsigneeZip();
					}else{
						$('#refNumOverRideForConsignee').val("N");
						$.unblockUI();
						$('#bookingSave').attr("disabled", false);
					}
				}else if (responseText.messages.error[0]=='cnee.invalid.zip') {
					var overRide = confirm("Consignee zip is invalid for Dest. Confirm override.(Ok/Cancel)");
					if(overRide == true){
						$('#consigneeZipOverride').val("Y");
						isChangesValidAfterUnitsReceived();
					}else{
						$('#consigneeZipOverride').val("N");
						$.unblockUI();
						$('#bookingSave').attr("disabled", false);
					}
				}
			}else{
				validateConsigneeZip();
			}
		}
	});
}

function validateConsigneeZip(){
	if($('#consigneeZipOverride').val() != "Y"){
		var trade = $("#tradeCode").val();
		var cneeZip = $('input[name="consignee\\.zip"]').val();
		var cneeArole = $('input[name="consignee\\.addressRoleId"]').val();
		if(trade!=null && (trade=='H' || trade =='G') && cneeZip != '' && cneeArole!=''){
			var urlStr = _context +"/booking/validateConsizneeZip";
			$.ajax({
				type: "POST",
				url: urlStr,
				data: {
					zipCode: $('input[name="consignee\\.zip"]').val(),
					pod: $('#destinationPortCityCode').val(),
					cneeAroleId : $('input[name="consignee\\.addressRoleId"]').val(),
					bookingId : $('#bookingId').val()
				},
				success: function(responseText){
					if(responseText.messages.error.length>0){
						if (responseText.messages.error[0]=='cnee.invalid.zip') {
							var overRide = confirm("Consignee zip is invalid for Dest. Confirm override (Ok/Cancel)");
							if(overRide == true){
								$('#consigneeZipOverride').val("Y");
								isChangesValidAfterUnitsReceived();
							}else{
								$('#consigneeZipOverride').val("N");
								$('#bookingSave').attr("disabled", false);
								$.unblockUI();
							}
						}
					}else{
						isChangesValidAfterUnitsReceived();
					}
					$('#bookingSave').attr("disabled", false);
				}
			});
		}else{
			isChangesValidAfterUnitsReceived();
		}
	}else{
		isChangesValidAfterUnitsReceived();
	}
}

function isChangesValidAfterUnitsReceived(){
	if($('#consigneeZipOverride').val()!="Y"){
		var booking = $('#bookingForm').formSerialize();
		var urlStr = _context +"/booking/validateRCUT";
		$.ajax({
			type: "POST",
			url: urlStr,
			data: booking,
			success: function(responseText){
				if(responseText.messages.error.length>0){
					if (responseText.messages.error[0]=='updates.invalid.after.units.received') {
						var overRide = confirm("Change requires Received Unit update on BK63. Confirm override (Ok/Cancel)");
						if(overRide == true){
							$('#isChangeAcceptedAfterUnitsReceived').val("Y");
							var freightExists=checkFreightExists();
							if(freightExists==true){
								addUpdateCommodityOnBKSave();
							}else{
								saveBooking();
							}
						}else{
							$('#isChangeAcceptedAfterUnitsReceived').val("N");
							$('#bookingSave').attr("disabled", false);
							$.unblockUI();
						}
					}
				}else{
					var freightExists=checkFreightExists();
					if(freightExists==true){
						addUpdateCommodityOnBKSave();
					}else{
						saveBooking();
					}
				}
			}
		});
	}else{
		var freightExists=checkFreightExists();
		if(freightExists==true){
			addUpdateCommodityOnBKSave();
		}else{
			saveBooking();
		}
	}
}

function saveBooking(){
	blockUI();
	showSavingMessage();
	var isChangeSourceDisabled = false;
	var changeCondition=true;
	if(isRoutingModifiable && $('#vvdChangeAuthPartyCode :selected').val()!='' && 
		$('#vvdChangeAuthPartyCode').attr("disabled")=="disabled")
	{
		isChangeSourceDisabled = true;
		$('#vvdChangeAuthPartyCode').attr("disabled", false);
	}
	var booking = $('#bookingForm').formSerialize();
	if(isChangeSourceDisabled)
		$('#vvdChangeAuthPartyCode').attr("disabled", true);
	var urlStr = '';
	if($('#bookingTypeCode').val()=='B'){
		urlStr = _context +"/booking/save";
	}else if($('#bookingTypeCode').val()=='T'){
		urlStr = _context +"/booking/saveTemplate";
		//Defect-25136 & 24921
	}if("Y"==isBookingFromQuote() && (piece!=$('#pieceCount').val()||weightOriginal!=$('#weight').val()||cubeOriginal!=$('#cube').val())){
		var rateChange=confirm("Booking created from quote,update may affect rating");
		if(rateChange){
			changeCondition=true;
			piece=$('#pieceCount').val();
			weightOriginal=$('#weight').val();
			cubeOriginal=$('#cube').val();
			
			}else{
				changeCondition=false;
				$('#pieceCount').val(piece);
				$('#weight').val(weightOriginal);
				$('#cube').val(cubeOriginal);
				$('#msgDiv').html("<div class=\"message_info\">Booking not updated.</div>");
			}
		}
	if(changeCondition==true){
	$.ajax({
		type: "POST",
		url: urlStr,
		data: booking,
		success: function(responseText){
				$("#bookingSave").attr("disabled",false);
				if(responseText.success==true){
					/*$('#commodityHeader').removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all");
					$('#commodityHeader span').removeClass('ui-icon-triangle-1-s').addClass('ui-icon-triangle-1-e');
					$('#maintainBookingCommodity').removeClass('ui-accordion-content-active');
					$('#maintainBookingCommodity').css('display', 'none');*/
					collapseAll();
					// Performance Changes - added async call to get party type flag value on save
					//set assign quote link
					setAssignLinkValue(responseText);
					if(responseText.data.header.shipmentNumber != '' || responseText.data.header.shipmentNumber != null){
						var billTypeFlag = responseText.data.parties.partyTypeFlag;
						if(null == billTypeFlag || billTypeFlag == ''){
							billTypeFlag = "NO BL";
						}
						$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+billTypeFlag+"</a>");
					}
					setPartyTypeFlag(responseText.data.header.billExists, responseText.data.header.isToOrderParty);
					//D031169: 	Priority Stow to have a new selection list only for Alaska
					if(responseText.data.header.tradeCode!=null && responseText.data.header.tradeCode=='A'){
						setStowDataForAlaska();
					} else {
						$("#stowSelect").hide();
					}
					
					refreshVVDInfo();
					isTemplateFirstLoad = false;
					$("#bookingId").val(responseText.data.bookingId);
					if($('#bookingTypeCode').val()=='T'){
						$("#bookingTemplateId").val(responseText.data.bookingTemplate.bookingTemplateId);
						$("#bookingTemplateSeqNbrDs").val(responseText.data.bookingTemplate.bookingTemplateSeqNbrDs);
						$('#templateDelete').attr('disabled',false);
					}
					// Comment ID
					$("#commentId").val(responseText.data.commentId);
					$('#freightCommentId').val(responseText.data.freight.commentId);
					// Entity Version ID
					//Hibernate returns the entity version before update, on insert.
					if(responseText.data.entityVersion==0)
						$("#entityVersion").val('1');
					else
						$("#entityVersion").val(responseText.data.entityVersion);
					$("#templateEntityVersion").val(responseText.data.bookingTemplate.entityVersion);
					/*if($('#bookingTypeCode').val()=='T'){
						if(responseText.data.bookingTemplate.entityVersion==0)
							$("#templateEntityVersion").val('1');
						else
							$("#templateEntityVersion").val(responseText.data.bookingTemplate.entityVersion);
					}*/
					if(undefined != responseText.data.header.shipmentNumber && null!=responseText.data.header.shipmentNumber){
						$("#shipmentNumber").val(responseText.data.header.shipmentNumber);
						setBookingTitle(responseText.data.header.shipmentNumber);
					}
					
					//Setting Booked Date, Time & user and Last Update Date, Time & user
					if(responseText.data.header.bookedDate!=null){
						$("#bookedDateTimeUser").html(responseText.data.header.bookedDate + " &nbsp;&nbsp;&nbsp;" + responseText.data.header.bookingCsr);
					}
					if(responseText.data.header.lastUpdateDateTime!=null){
						$("#lastUpdateDateTimeUser").html(getTimeWithoutSeconds(responseText.data.header.lastUpdateDateTime)+ " &nbsp;&nbsp;&nbsp;" + responseText.data.lastUpdateUser);
					}
					$("#savedBookingStatusCode").val(responseText.data.header.savedBookingStatusCode);
					
					$("#marksAndNumbers").val(responseText.data.header.marksAndNumbers);
					$('#commentsDiv').show();
					if(responseText.data.header.quoteNumber!=null && (responseText.data.header.quoteNumber == responseText.data.header.shipmentNumber)){
						$('#quoteVNConcat').val(responseText.data.header.quoteNumber);//+"."+responseText.data.header.quoteVersion);
						$('#quotePopUpSearch').hide();
					}else{
						$('#quotePopUpSearch').show();
					}
					
					$("#bookingStatusCode").val(responseText.data.header.bookingStatusCode);
					
					
					reloadBookingGrids();
					loadFreightGrids();
					// Reload hold Grid
					loadHoldGrid('D');
					$('#partiesExists').val(responseText.data.partiesExists);
					$('#shipmentNumberHidden').val(responseText.data.header.shipmentNumberHidden);
					$('#quoteVNConcatHidden').val(responseText.data.header.quoteVNConcatHidden);
					$('#hiddenBookedDate').val(responseText.data.hiddenBookedDate);
					
					//Refreshing Shipper/Consignee Details in Case One Time Customer has been changed
					shipperAddress = responseText.data.shipper.address;
					$("#shipper").loadJSON(responseText.data.shipper);
					loadAdditionalShipperDetails(responseText);
					
					consigneeAddress = responseText.data.consignee.address;
					$("#consignee").loadJSON(responseText.data.consignee);
					loadAdditionalConsigneeDetails(responseText);
					
					if(responseText.data.shipper.organizationName!='' && responseText.data.shipper.organizationName!=null)
					{
						setShipperDivName(" " +responseText.data.shipper.organizationName);
						$('#shipperName').val(responseText.data.shipper.organizationName);
					}
					else
					{
						$('#shipperName').val('');
					}
					if(responseText.data.consignee.organizationName!='' && responseText.data.consignee.organizationName!=null)
					{
						setConsigneeDivName(" " +responseText.data.consignee.organizationName);
						$('#consigneeName').val(responseText.data.consignee.organizationName);
					}
					else
					{
						$('#consigneeName').val('');
					}
					
					//Sets lastOriginPortCityCode and lastDestinationPortCityCode
					$("#lastOriginPortCityCode").val(responseText.data.routing.lastOriginPortCityCode);
					$("#lastDestinationPortCityCode").val(responseText.data.routing.lastDestinationPortCityCode);
					disableCreateBookingFromQuote();
					$("#quoteExistsDiv").hide();
					if(responseText.data.shipperNameAddressCustomized){
						$('input[name="shipper\\.organizationName"]').css('color', 'green');
					}else{
						$('input[name="shipper\\.organizationName"]').css('color', 'black');
					}
					if(responseText.data.consigneeNameAddressCustomized){
						$('input[name="consignee\\.organizationName"]').css('color', 'green');
					}else{
						$('input[name="consignee\\.organizationName"]').css('color', 'black');
					}
					$('#templateAppliedOnBookingFromScreen').val('N');
					
					if($("#bookingStatusCode").val()=='CANC'){
						//TODO - readonly call removed
						makeFormReadOnly(responseText,'bookingForm',true);
						//$("#bookingStatusCode").attr("disabled",true);
						$('#msgDiv').show();
						isBookingDeletable();
					}else{
						//TODO - readonly call removed
						makeFormReadOnly(responseText,'bookingForm',false);//TODO
						/*Booking Security*/
						if($('#bookingTypeCode').val()=='B' && isHeaderStatusUpdate){
							$("#bookingStatusCode").attr("disabled",false);
						}
						//Booking Security
						/*if(isShipperConsgineeModifiable){
							$('#shipperRepeatContact').attr('disabled', false);
							$('#consigneeRepeatContact').attr('disabled', false);
						}*/
						checkCopyButtons();
						processShipperConsigneeColor("shipper");
						processShipperConsigneeColor("consignee");
						/*if(isPartiesModifiable)
							$('#partiesRepeatContact').attr('disabled', false);*/
						
						processChangeSource();
						autoBillOnchangeEventFunction();
						setRoutingLoadDischargeDetails();
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
						if(($('#loadDschServiceGroupCode').val()!='CON' && $('#loadDschServiceGroupCode').val()!='LCL') || !isRoutingModifiable)
						{
							$('#convCgoApptCutoffDate').attr('disabled', true);
							$('#convCgoApptCutoffTime').attr('disabled', true);
							$('#convCgoEstArrivalDate').attr('disabled', true);
							$('#convCgoEstArrivalTime').attr('disabled', true);
							$('#requiredDeliveryDate').attr('disabled', true);
							//$('#milRequiredDeliveryDate').attr('disabled', true);
						}
						checkIssuePtDefaultValue();
					}
					$('#bookingCsr').val(responseText.data.header.bookingCsr);
					if(responseText.data.header.customerGroupId!=null){
						$("#customerGroupId").val(responseText.data.header.customerGroupId);
					}
					if(responseText.data.header.quoteNumber !=null){
						var quoteText = responseText.data.header.quoteNumber;
						if(responseText.data.header.quoteVersion!=null && responseText.data.header.quoteVersion!=''){
							quoteText = quoteText + "-"+responseText.data.header.quoteVersion;
						}
						$('#quoteNumberLabel').html("<a style=\"color: blue\" href= " + _context + "/quote/getQuote?quoteId="+ responseText.data.header.appliedQuoteId +">"+quoteText+"</a>");//quoteText);
					}
					checkIfBookingFromQuote();
					isBookingChanged = "N";
					$('#quoteVNConcat').attr("disabled", true);
					$("#bookingStatusCode").attr("disabled", false);
					$('#checkRequiredDispatch').val(responseText.data.checkRequiredDispatch);
					if($('#bookingTypeCode').val()=='B'){
						//if(responseText.data.header.bookingStatusCode=='APPR' || responseText.data.header.bookingStatusCode=='OFFR'){
						if($('#checkRequiredDispatch').val()=='Y'){
							$("#dispatchBtn").attr("disabled", false);
						}else{
							$("#dispatchBtn").attr("disabled", true);
						}
					}else{
						$("#dispatchBtn").attr("disabled", false);
					}
					enableDisableFreightButtons(responseText.data.freight.commodityLines.length, $('select#currentCommodityLine').val());
					if($("#bookingStatusCode").val()=='APPR'){
						$('#billBooking').attr("disabled", false);
					}else{
						$('#billBooking').attr("disabled", true);
					}
					$('#createUser').val(responseText.data.createUser);
					
					if(($.trim($('#bookingCsr').val()) == 'EDIBKG' && $('#bookingStatusCode').val()=='APPR') 
							|| ($.trim($('#bookingCsr').val()) != 'EDIBKG' && ($('#bookingStatusCode').val()=='APPR' || $('#bookingStatusCode').val()=='OFFR'))) {
						
						//Send EDI Confirmation
						sendEDIConfirmation('saveBkng');
					}
					
					$('#isRequirePrePayment').val(responseText.data.header.isRequirePrePayment);
					createCommentFunc();
					
					setAutoBillMandatory();
					
					if(isHistoryDisplayOnly) $('#historyDiv').show();
					//D031149: 	on initial new issued booking, lose booking number going to dispatch screen
					var searchText=$("#textfield5").val();
					if(searchText== null || searchText=='' || searchText!=$("#shipmentNumber").val()){
					searchText=$("#shipmentNumber").val();
					$.ajax({
					url: "/gates/workingContext/setContext",
					type: "POST",
					data: {key:"BK_BOOKING",value:searchText},
					success: function(responseText){
						$("#textfield5").removeAttr('style');
					}
				});
				}
					
				}else{
					if($("#bookingId").val() == undefined || $("#bookingId").val()=='' || $("#bookingId").val() == null){
						$("#bookingStatusCode").attr("disabled",true);
					}
				}
				//enableDisableClearButton()
				showResponseMessages("msgDiv", responseText);
				
				if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $.trim($('#isAllowBookingUnit').val())=="Y"){
					if($("#tcnGrid").getGridParam("records")!=0 && $("#tcnGrid").getGridParam("records")!=$('#pieceCount').val()){
						var messageContent = $('#msgDiv').html();
							messageContent += '<div class="message_warning">Pieces Count does not equal number of TCNs</div>';
							$('#msgDiv').html(messageContent);
					}
				}
				
				//Enables-disables footer buttons if booking exists
				enableDisableFooterButtons();
				
				// Set total charges incase of POV commodity
				if($("#bookingStatusCode").val()=='APPR' || $("#bookingStatusCode").val()=='OFFR'){
					var amount=responseText.data.header.actualTotalChargeAmount;
					if(amount!=null && amount!='' && ! isNaN(amount)){
						amount = parseFloat(amount); 
						$('#chargeCurrency').text('$');
						$('#actualTotalChargeAmount').text(amount.toFixed(2));
					}else if(amount==null || amount==''){
						$('#chargeCurrency').text('');
						$('#actualTotalChargeAmount').text('');
					}
				}else{
					$('#chargeCurrency').text('');
					$('#actualTotalChargeAmount').text('');
				}
				
				if($('#isCustomizeNameAddress').val() == 'true') {

					$('#isCustomizeNameAddress').val('false');

					if($('#partiesExists').val()=='true'){
						bookingHeaderLink("customizednameandaddress/showForm",false);
					}else{
						alert("No Parties exists.");
					}
				}
				
				if($('div.message_error', '#msgDivFrt').html()!=''){
					$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();
		 		}
				//D027551: 	HOLDS - AUTOBILL - XBK62 - didnt pop up in GATES 
				if(isHoldOverlayBottomEnabled){
					openUnreleasedHoldGridOnIntialDisplay("booking");
				}
				
				$.unblockUI();
		}
	});
}else{
	$.unblockUI();
	$('#bookingSave').attr("disabled", false);
	
}
}

function setStowDataForAlaska(){
	if($('#bookingTypeCode').val()=='B'){
		$("#stowSelect").show();
		if($("#stowCharAlaska").get(0).options.length == 1){
			var urlStr = _context +"/booking/freight/getPriorityStowForAlaska";
			$.ajax({
				type: "GET", 
				url: urlStr,
				async: false,
				dataType:'json',
				success: function(responseData){			
					if(responseData.success==true){
						var stowList = responseData.data;
						$('#stowCharAlaska option').remove();
						$("#stowCharAlaska").get(0).options[0] = new Option("Select", "");
						$.each(stowList, function(index,codeDescription) {
							$("#stowCharAlaska").get(0).options[$("#stowCharAlaska").get(0).options.length] = new Option(codeDescription.description, codeDescription.description);
						});
					} 
				}
			});
		}
	}
}

function setPartyTypeFlag(billExists, isToOrderParty) {
	var urlStr = _context +"/booking/getPartyTypeFlag?bookingNumber="+$('#shipmentNumber').val()+"&billExists="+billExists+"&isToOrderParty="+isToOrderParty;
	var deaultBillTypeFlag = "NO BL";
	$.ajax({
		type: "GET", 
		url: urlStr,
		dataType:'json',
		success: function(responseData){			
			if(responseData.success==true){
				var billTypeFlag = responseData.data;
				if(null == billTypeFlag || billTypeFlag == ''){
					billTypeFlag = deaultBillTypeFlag;
				}
				$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+billTypeFlag+"</a>");
			} else {
				$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+deaultBillTypeFlag+"</a>");
			}
		},
		error: function(jqXHR,textStatus,errorThrown) {
			$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm',false);\">"+deaultBillTypeFlag+"</a>");
		}
	});
}
function getTimeWithoutSeconds(timeWithSeconds){
	var retValue ="";
	if(timeWithSeconds!= null && timeWithSeconds != ''){
		retValue = timeWithSeconds.substring(0,timeWithSeconds.lastIndexOf(":"));
		return retValue;
	}else{
		return timeWithSeconds;
	}
}
function setAssignLinkValue(responseText){
	if(responseText.data.header == undefined || responseText.data.header.shipmentNumber == '' || responseText.data.header.shipmentNumber == null /*|| responseText.data.header.shipmentNumber==responseText.data.header.quoteNumber*/){
		$('#assignLink').html("Assign Quote");
	}else{
		if(responseText.data.header.quoteNumber == '' || responseText.data.header.quoteNumber ==null/* || responseText.data.header.quoteId ==null*/){
			$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
		}else{
			$('#assignLink').html("<a href=\"javascript:removeAssignQuote();\">Remove Quote</a>");
		}
		// enable link for BKPO when booking has saved.
	}
}

function setBookingTitle(shipmentNumber){
	//Workaround to fix dynamic setting of page title
	if($('#bookingTypeCode').val()=='B')
		window.location.hash = ""+new Date().getTime();
	
	var bookingTitle = $('title').text().split("-");
	if(shipmentNumber!=null && shipmentNumber!=''){
		document.title = bookingTitle[0]+" - "+shipmentNumber;
	}
	else{
		document.title = bookingTitle[0];
	}
}

function removePopUps(){
	$("#bookingForm").validationEngine('hideAll');
}

function showJSON(responseText)  {
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
		tempShipperAddress= responseText.data.shipper.addressRoleId;
		tempConsigneeAddress=responseText.data.consignee.addressRoleId;
		//D029999:For consignee/Shipper it needs to look at the template type and only remove if it is that type of template. 
		tempPartyTypeCode=responseText.data.bookingTemplate.partyTypeCode;
	}
	else
		{
		tempShipperAddress= '';
		tempConsigneeAddress='';
		tempPartyTypeCode="";
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
	$("#vessel").val(responseText.data.routing.vessel);
	$("#voyage").val(responseText.data.routing.voyage) ;
	$("#direction").val(responseText.data.routing.direction);
	if($.trim($('#loadDschServiceGroupCode').val()) == "AU"
	    && ($.trim($('#customerGroupId :selected').text()) == POV_NAME || $.trim($('#customerGroupId :selected').text()) == ALASKA_POV_NAME ))
		$('#premiumRDD').val(responseText.data.header.requiredDeliveryDate);
	$('#pickupZoneDisplay').html(responseText.data.routing.pickupZone);
	$('#deliveryZoneDisplay').html(responseText.data.routing.deliveryZone);
	$("#maintainBookingOverrides").loadJSON(responseText.data.routing);
	
	$("#isVgmRequiredDefault").html(responseText.data.routing.defaultVGMDisplay);
	console.log("defaultVGM="+responseText.data.routing.defaultVGMDisplay);
	
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
	getFreightJSONresponse(responseText.data.freight);
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
	if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON'||$.trim($('#loadDschServiceGroupCode').val())=='LCL') && $.trim($('#isAllowBookingUnit').val())=="Y"){
		if(responseText.data.tcnExists){
		setIBSCodeMandatory();
		if($('#militaryIbsStatusCode option:selected').text()!=''){
			setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
		}
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
	
}

function setHazCount(cnt) {
	console.log("Set haz count "+cnt);
	$('#hazmat').text("Hazmat("+cnt+")");
}

function disableCreateBookingFromQuote(){
	if($('#shipmentNumberHidden').val()==''){
		$('#quoteVNConcat').attr("disabled",false);
		$('#quoteLinkDiv').gatesEnable();
		$('#quoteLinkDiv').html("<a id=\"quotePopUpSearch\" href=\"javascript:quotePopupSearch('create');\">\<img src=\""+_context+"/resources/images/search.png\" alt=\"search\" style=\"vertical-align: middle;margin-bottom:6px;\"/></a>");
	}else{
		$('#quoteVNConcat').attr("disabled",true);
		$('#quoteLinkDiv').gatesDisable();
	}
}

function setShipperCommMethodValue(shipper){
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
	}else{
		$('#shipperComm1').attr('checked',true);
		$('#shipperComm2').attr('checked',false);
		$('#shipperComm3').attr('checked',false);
		$('#shipperComm4').attr('checked',false);
	}
}

function setConsigneeCommMethodValue(consignee){
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
	}else{
		$('#consigneeComm1').attr('checked',true);
		$('#consigneeComm2').attr('checked',false);
		$('#consigneeComm3').attr('checked',false);
		$('#consigneeComm4').attr('checked',false);
	}
}

//post-submit callback 
function showResponseMessages(msgDivId, responseText, oldText)  {
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if(oldText) {
			messageContent = oldText;
		}
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_error">' + array[i] + '</div>';
				//D026921: 	Maintain Booking to Assignment Maintenance
				if(array[i] != undefined && array[i].match("^Booking Assignment Maintenance required")){
					var msg = array[i].split("|");
					messageContent = '<div class="message_error">'+ msg[0] + "<a href="+_context + "/bookingMaintenance/showScreen?containerNo="+msg[1]+">Click Here</a>"+'</div>';
				}
				//D026482: 	Maintain Booking - error message address role must be active. It turned out to be the consignee however the message should tell you what party needs updated
				if(array[i] != undefined && array[i] != null && array[i].match("^Address Role must be active for ")){
					expandAll();
					if(array[i].match("Shipper.$")){
						//$('input[name="shipper\\.organizationName"]').css('color', 'red');
						$('input[name="shipper\\.organizationName"]').css('backgroundColor', "#FFBABA");
					} else if(array[i].match("Consignee.$")){
						//$('input[name="consignee\\.organizationName"]').css('color', 'red');
						$('input[name="consignee\\.organizationName"]').css('backgroundColor', "#FFBABA");
					} else {
						 var rowIDs = jQuery("#gridIdForParties").getDataIDs();
						 for (var j=0;j<rowIDs.length;j=j+1)
					     { 
							 var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[j]);
							 if(rowData.partyTypeDescription != undefined && rowData.partyTypeDescription != null &&
									  array[i].match(rowData.partyTypeDescription)){
								 $('#gridIdForParties').jqGrid('setCell', j+1, 'organizationName','','',{style: 'background : #FFBABA'},'');
							 }
					     }
					}
				}
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
				//D026921: 	Maintain Booking to Assignment Maintenance
				if(array[i] != undefined && array[i].match("^Booking Assignment Maintenance required")){
					var msg = array[i].split("|");
					messageContent = '<div class="message_warning">'+ msg[0] + "<a href="+_context + "/bookingMaintenance/showScreen?containerNo="+msg[1]+">Click Here</a>"+'</div>';
				}
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}

		$('#'+msgDivId).html(messageContent);
		
		if(messageContent!='')
		{
			if(msgDivId=='msgDiv')
				window.scrollTo(0, 0);
			/*else
			{
				var offset = $('#'+msgDivId).offset();
				window.scrollTo(offset.left, offset.top);
			}*/
		}
		
		if (messages.error.length > 0) {
			triggerErrorMessageAlert(msgDivId);
		}
  	}
}

function selectForFormSerialize(radioButtonObj, value)
{
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}

//function to reset default values in form (in case clearForm() is called)
function resetDefault(){
	//$('select').attr('selectedIndex',0);
	$('select option:first-child').attr("selected", "selected");
	setDefaultForAssignLink();
	//$('#overrideInitialLtvDate').val('01-01-0001');
	$('#overrideInitialLtvDate').css('color','black');
}

function populateLoadDischargeLists(routingData)
{
	lastLoadService = $.trim(routingData.loadServiceCode);
	lastDischargeService = $.trim(routingData.dischargeServiceCode);
	
	if(routingData.loadServiceCode!=null && $.trim(routingData.loadServiceCode)!='' && 
			routingData.dischargeServiceCode!=null && $.trim(routingData.dischargeServiceCode)!='')
	{
		
		function callBackA(responseTextDischageList) {
			setLoadDischargeValues(responseTextDischageList.data, '#dischargeServiceCode', $.trim(routingData.dischargeServiceCode));
			function callBack2(responseTextLoadList){
				setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', $.trim(routingData.loadServiceCode));
				//Set Load Discharge group Code
				//setLoadDischargeGroupCode(routingData.loadServiceCode, routingData.dischargeServiceCode);
				setRoutingLoadDischargeDetails();
				setRoutingHeader();
			}
			getLoadServicesRequest(callBack2, $.trim(routingData.dischargeServiceCode));
		}
		getDischargeServicesRequest(callBackA, $.trim(routingData.loadServiceCode));

	}
	else if(routingData.loadServiceCode!=null && $.trim(routingData.loadServiceCode)!='')
	{

		function callBackB(responseTextDischageList) { // cheetah
			setLoadDischargeValues(responseTextDischageList.data, '#dischargeServiceCode', $.trim(routingData.dischargeServiceCode));
			function callBack2(responseTextLoadList) { // cheetah
				setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', $.trim(routingData.loadServiceCode));
				setRoutingLoadDischargeDetails();
				setRoutingHeader();
			}
			getAllLoadServicesRequest(callBack2); // cheetah
		}
		getDischargeServicesRequest(callBackB, $.trim(routingData.loadServiceCode));
		
	}
	else if(routingData.dischargeServiceCode!=null && $.trim(routingData.dischargeServiceCode)!='')
	{
		
		function callBackC(responseTextLoadList) { // cheetah
			setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', $.trim(routingData.loadServiceCode));
			function callBack2(responseTextDischargeList) { // cheetah
				setLoadDischargeValues(responseTextDischargeList.data, '#dischargeServiceCode', $.trim(routingData.dischargeServiceCode));
				setRoutingLoadDischargeDetails();
				setRoutingHeader();
			}
			getAllDischargeServicesRequest(callBack2); // cheetah				
		}
		getLoadServicesRequest(callBackC, $.trim(routingData.dischargeServiceCode));
		
	}
	else
	{
		
		function callBackD(responseTextLoadList) { // cheetah
			setLoadDischargeValues(responseTextLoadList.data, '#loadServiceCode', $.trim(routingData.loadServiceCode));
			function callBack2(responseTextDischargeList) { // cheetah
				setLoadDischargeValues(responseTextDischargeList.data, '#dischargeServiceCode', $.trim(routingData.dischargeServiceCode));
				setRoutingLoadDischargeDetails();
				setRoutingHeader();
			}
			getAllDischargeServicesRequest(callBack2); // cheetah				
		}
		getAllLoadServicesRequest(callBackD); // cheetah		

	}
}

function bookingHeaderLink(url,billStarted){
	var bookingEntityVersion = $("#entityVersion").val();
	var bookingIdHeader = $("#bookingId").val();
	var shippingIdHeader = $("#shipmentNumber").val();
	var originPortCityCode = $("#originPortCityCode").val();
	var destinationPortCityCode = $("#destinationPortCityCode").val();
	
	
	var tradeCodeHeader = $("#tradeCode").val();
	var tradeCodeValueHeader = $("#tradeCode option:selected").text();
	var bookingStatusHeader = $("#bookingStatusCode option:selected").text();
	var customerGroupHeader = $("#customerGroupId option:selected").text();
	if(customerGroupHeader == 'Select') {
		customerGroupHeader = '';
	}
	
	var placeOfRecieptHeader = $("#blOriginCityCodeDescription").val();
	var portOfLoadingHeader = $('#originPortCityCodeDescription').val();
	var portOfDischargeHeader = $("#destinationPortCityCodeDescription").val();
	var placeOfDelevieryHeader = $("#blDestinationCityCodeDescription").val();
	
	var shipperHeader = $('input[name="shipper\\.organizationName"]').val();
	var consigneeHeader = $('input[name="consignee\\.organizationName"]').val();
	
	var vvdHeader = $("#vessel").val() + ' ' + $("#voyage").val() + ' ' + $("#direction").val();
	var ldSVCHeader = '';
	
	if($("#loadServiceCode").val() != '' && $("#dischargeServiceCode").val() != '') {
		ldSVCHeader = $("#loadServiceCode").val() + ' ' + $("#dischargeServiceCode").val();	 
	} else if($("#loadServiceCode").val() == '' && $("#dischargeServiceCode").val() != '') {
		ldSVCHeader = $("#dischargeServiceCode").val();
	} else if($("#loadServiceCode").val() != '' && $("#dischargeServiceCode").val() == '') {
		ldSVCHeader = $("#loadServiceCode").val();
	}
	
	var debtorHeader =$("#prepaidCollectCode option:selected").val();
	var debtorValueHeader = $("#prepaidCollectCode option:selected").text();
	
	var bookingHeaderParam= "?bookingIdHeader="+encodeURIComponent(bookingIdHeader)+"&tradeCodeHeader="+encodeURIComponent(tradeCodeHeader)+"&bookingStatusHeader="+encodeURIComponent(bookingStatusHeader)+"&customerGroupHeader="+encodeURIComponent(customerGroupHeader)+"&placeOfRecieptHeader="+encodeURIComponent(placeOfRecieptHeader)+"&portOfLoadingHeader="+encodeURIComponent(portOfLoadingHeader)+"&portOfDischargeHeader="+encodeURIComponent(portOfDischargeHeader)+"&placeOfDelevieryHeader="+encodeURIComponent(placeOfDelevieryHeader)+"&shipperHeader="+encodeURIComponent(shipperHeader)+"&consigneeHeader="+encodeURIComponent(consigneeHeader)+"&vvdHeader="+encodeURIComponent(vvdHeader)+"&ldSVCHeader="+encodeURIComponent(ldSVCHeader)+"&debtorHeader="+encodeURIComponent(debtorHeader)+"&debtorValueHeader="+encodeURIComponent(debtorValueHeader)+"&tradeCodeValueHeader="+encodeURIComponent(tradeCodeValueHeader)+"&shippingIdHeader="+encodeURIComponent(shippingIdHeader)+"&originPortCityCode="+encodeURIComponent(originPortCityCode)+"&destinationPortCityCode="+encodeURIComponent(destinationPortCityCode)+"&bookingEntityVersion="+encodeURIComponent(bookingEntityVersion)+"&isNavigationFromMenu=N";

	 
	if(billStarted == true){
		document.location.href= _context +"/"+url;
	}else{
		document.location.href= _context +"/booking/"+url+bookingHeaderParam;
	}

	//window.open(_context +"/booking/"+url+bookingHeaderParam);

	
}

function isBookingDeletable(){
	if($('#bookingId').val()!=null && $('#bookingId').val()!='' && $('#savedBookingStatusCode').val()=='CANC'){
		if($('#quoteVNConcat').val()!='' && $('#shipmentNumber').val() == $('#quoteVNConcat').val() && $('#bookingStatusCode').val()=='CANC'){
			$("#bookingDelete").attr("disabled", false);
		}else{
			$("#bookingDelete").attr("disabled", true);
		}
	}
}

function deleteBooking(){
	$.ajax({
		type: "POST",
		url: _context +"/booking/delete",
		data: {
			shipmentNumber: $("#shipmentNumber").val(),
			bookingId: $('#bookingId').val(),
			quoteId: $('#quoteId').val()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				clearAndResetBookingScreen();
				//we have to call it seperately bcoz we do not want it to execute everytime showJSON runs.
				//getTemplateNumberForId();
				checkIfTemplateToBeDisabled();
				$("#bookingStatusCode").val("");
				$("#savedBookingStatusCode").val("");
				//reloadBookingGrids();
				setDefaultForBookingStatus();
				setDefaultForAssignLink();
				clearHeaderData();
				$('#commentsDiv').hide();
				$('#historyDiv').hide();
				//$("#shipperConsigneeNameDiv").html("<b>Shipper Consignee</b>");
				//setBookingTitle("");
				$("#bookingDelete").attr("disabled", true);
				resetDivNames();
				$("#bookedDateTimeUser").html("");
				$("#lastUpdateDateTimeUser").html("");
				$('#quotePopUpSearch').show();
				//TODO - readonly call removed
				makeFormReadOnly(responseText,'bookingForm',false);
				$('#quoteVNConcat').attr("disabled",false);
				$('#quoteLinkDiv').gatesEnable();
				$('#bookingSave').attr("disabled",false);
				$("#bookingStatusCode").val("");
				resetBookingForm();
				clearHiddenFieldsOnDelete();
				enableDisableButtonOnDelete();
				isBookingChanged = "N";
				reInitOnClear();
				enableDisableNote();	
				expandAll();
			}
			//Messages
			showResponseMessages("msgDiv", responseText);
			$('#msgDiv').show();
			$('#commentsDiv').show();
			//enableDisableClearButton();
		}
	});
}

function enableDisableButtonOnDelete(){
	$('#bookingSave').attr("disabled",false);
	
	$('#dispatchBtn').attr("disabled",true);
	$('#sendDoc').attr("disabled",true);
	$('#customizeNameAddress').attr("disabled",true);
	$('#updatepayment').attr("disabled",true);
	$('#dispatchBtn').attr("disabled",true);
	$('#sendDocsendDoc').attr("disabled",true);
	$('#customizeNameAddress').attr("disabled",true);
	
	$('#bookingStatusCode').attr("disabled",true);
	
	$('#maintainBookingRouting').gatesEnable();
	$('#bookingVVDRoutingDiv').gatesEnable();

}

function clearHiddenFieldsOnDelete(){
	 $("#bookingId").val("");
	 $("#commentId").val(null);
	 $("#entityVersion").val(null);
	 $("#shipmentNumberHidden").val("");
	 $("#refNumOverRideForShipper").val("");
	 $("#refNumOverRideForConsignee").val("");
	 $("#consigneeZipOverride").val("");
	 $("#userFromMenu").val(null);
	 
	 $("#ratingAttributesChanged").val(null);
	 $("#bookingTemplateOwner").val(null);
	 $("#showQuoteForAroleOnTemplatePull").val(null);
	 $("#bookingTemplateOwnerPartyType").val(null);
	 $("#bookingStatusCodeHidden").val(null);
	 $("#quoteIsLoadedOnScreen").val('');
	 $("#isCustomizeNameAddress").val(null);
	 $("#billExists").val(null);
	 $('#shipmentNumberHidden').val(null);
}

//common method for reloading all grids for booking
function reloadBookingGrids(){
	//$("#gridIdForParties").trigger('reloadGrid');
	$("#vvdRoutingGrid").trigger("reloadGrid");
	$("#referenceNumberGrid").trigger('reloadGrid');
	$("#dodaacGrid").trigger('reloadGrid');
	$("#specialServiceGrid").trigger('reloadGrid');
	$('#hazGrid').trigger("reloadGrid");
	$("#gridIdForClauses").trigger('reloadGrid');
	loadHoldGrid('D');
	setTimeout(function(){
		$("#gridIdForParties").trigger('reloadGrid');
		//$("#equipmentGrid").trigger('reloadGrid');
	}, 500);
}

function clearHeaderData(){
	$("#bookingStatusCode").attr("disabled",true);
	$("#createDate").html("");
	$("#lastUpdateDate").html("");
	$("#bookingTemplateNumber").html("");
	$('#quoteVNConcat').attr("disabled",false);
	$('#quoteLinkDiv').gatesEnable();
	$('#quoteLinkDiv').html("<a id=\"quotePopUpSearch\" href=\"javascript:quotePopupSearch('create');\">\<img src=\""+_context+"/resources/images/search.png\" alt=\"search\" style=\"vertical-align: middle;margin-bottom:6px;\"/></a>");
	removeAssignQuote();
	setDefaultForAssignLink();
	$("#quoteExistsDiv").hide();
}

//common method for making form read only [in case of opening cancelled booking]
function makeFormReadOnly(responseText, formId,readOnly){
	if(readOnly==true){
		$('#header').gatesDisable({exclude: ["hazmat"]});
		$('#maintainBookingShipperConsignee').gatesDisable();
		$('#maintainBookingParties').gatesDisable();
		$('#jqgrid').gatesEnable();
		$('#marksAndNumbers').attr('readonly',true);
		$('#maintainBookingRouting').gatesDisable();
		$('#maintainBookingCommodity').gatesDisable();
		$('#gview_freightGrid').gatesEnable();
		$('#militarySection').gatesDisable();
		$('#gview_dodaacGrid').gatesEnable();
		$('#maintainBookingSpecialServices').gatesDisable();
		
		$('#gview_specialServiceGrid').gatesEnable();
		//$('#maintainBookingClauses').gatesDisable();
		$('#gview_holdGrid').gatesEnable();
		$('#maintainBookingHold').gatesDisable();
		$('#maintainBookingOverrides').gatesDisable();
		$('#bookingVVDRoutingDiv').gatesDisable();
		
		$("div.ui-pg-div.ui-inline-del").hide();
		$("div.ui-pg-div.ui-inline-edit").hide();
		
		$('#del_freightGrid').hide();
		$('#del_referenceNumberGrid').hide();
		$('#del_equipmentGrid').hide();
		$('#del_hazGrid').hide();
		$('#del_dodaacGrid').hide();
		$('#del_specialServiceGrid').hide();
		$('#del_holdGrid').hide();
		
		//grids
		/*$("#lui_referenceNumberGrid").show();
		$("#lui_gridIdForParties").show();
		$("#lui_vvdRoutingGrid").show();
		$("#lui_referenceNumberGrid").show();
		$("#lui_freightGrid").show();
		$("#lui_dodaacGrid").show();
		$("#lui_specialServiceGrid").show();
		$("#lui_gridIdForClauses").show();*/
		
		$('#bookingSave').attr("disabled",true);
		$('#dispatchBtn').attr("disabled",true);
		$('#sendDoc').attr("disabled",true);
		$('#customizeNameAddress').attr("disabled",true);
		$('#updatepayment').attr("disabled",true);
		$('#dispatchBtn').attr("disabled",true);
		$('#sendDocsendDoc').attr("disabled",true);
		$('#customizeNameAddress').attr("disabled",true);
		//link
		$('#assignLink').html("Assign Quote");
		
	}else{
		$('#header').gatesEnable();
		//Added Security for Defect Start D027291
		if(isHeaderTradeDisplay && !isHeaderTradeUpdate){
			disableSection('headerTradeCode');
		}
		else if(isHeaderTradeDisplay && isHeaderTradeUpdate){
			enableSection('headerTradeCode');
		}
		else{
			enforceSecurityDivAndButtons('headerTradeCode', false);
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
		//Added Security for Defect End D027291
		if(isShipperConsgineeModifiable){
			$('#maintainBookingShipperConsignee').gatesEnable();
		}
		if(isPartiesModifiable){
			$('#maintainBookingParties').gatesEnable();
		}
		//Security added for Defect D027297
		if(!isReferenceNumberMarksDeletable)
		{
		   $('#del_referenceNumberGrid').hide();
		}
		if(!isHoldDelete)
		{
		   $('#del_holdGrid').hide();
		}
		$('#marksAndNumbers').attr('readonly',false);
		if(isRoutingModifiable){
			$('#maintainBookingRouting').gatesEnable();
			if($('#isInBond :selected').val()==false || $('#isInBond :selected').val()=='false')
				$('#inbondNumber').attr("disabled", true);
			checkPickupCarrier();
			checkDeliveryCarrier();
			$('#bookingVVDRoutingDiv').gatesEnable();
			if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) == 
				($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text())
				&& $("#vvdChangeAuthPartyCode :selected").val()=='')
			{
				$('#vvdChangeAuthPartyCode').attr('disabled', true);
				$('#changeSourceLabel').html("Change Source");
			}
		}
		if(isCommodityModifiable){
			$('#maintainBookingCommodity').gatesEnable();
			enableDisableFreightButtons($('#totalCommodityLines').text(),($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"?$('select#currentCommodityLine').val():0));
		}
		//D027295
		if(isCommodityModifiable && !isCommodityAddDelete && isHeaderUpdate && !isCommodityDisplayOnly)
		{
			$('#maintainBookingCommodity').gatesDisable();
			$('#del_equipmentGrid').hide();
			$('#del_hazGrid').hide();
		}
		if(isMilitaryModifiable){
			$('#maintainBookingMilitary').gatesEnable();
			if(responseText.data.tcnExists){
				//setIBSCodeMandatory();
				if($('#militaryIbsStatusCode option:selected').text()!=''){
					setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
				}
			}
			else{
				//resetIBSCode();
				resetCargoPickup();
				resetCargoDelivery();
			}
		}
		if(isSpecialServiceModifiable){
			$('#maintainBookingSpecialServices').gatesEnable();
		}
		if(isClauseModifiable){
			$('#maintainBookingClauses').gatesEnable();
		}
		if(isHoldManualModifiable){
			$('#maintainBookingHold').gatesEnable();
		}
		if(isRoutingOverrideModifiable){
			$('#maintainBookingOverrides').gatesEnable();
		}
		
		//grids
		/*$("#lui_referenceNumberGrid").hide();
		$("#lui_referenceNumberGrid").hide();
		$("#lui_gridIdForParties").hide();
		$("#lui_vvdRoutingGrid").hide();
		$("#lui_referenceNumberGrid").hide();
		$("#lui_freightGrid").hide();
		$("#lui_dodaacGrid").hide();
		$("#lui_specialServiceGrid").hide();
		$("#lui_gridIdForClauses").hide();*/
        //Added for Security  D028931	
		if(isShipperConsgineeModifiable)
		{	
	   	  $("#shipperOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('shipper');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");
		  $("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");
		}
		if(responseText!= undefined && responseText!='')
			setAssignLinkValue(responseText);
		$("#divOfRoutingVVD").html("<a href=\"javascript:openSearchVVD('routing');\"><img src=\""+_context+"/resources/images/search.png\" alt=\"search\" style=\"vertical-align: middle;margin-bottom:6px;\"/></a>");

		$('#bookingSave').attr("disabled",false);
		$('#dispatchBtn').attr("disabled",false);
		$('#sendDoc').attr("disabled",false);
		$('#customizeNameAddress').attr("disabled",false);
		
		if($('#shipmentNumber').val() !='' && $.trim($('#isRequirePrePayment').val()) != 'false' && $.trim($('#isRequirePrePayment').val()) != false)
			$('#updatepayment').attr("disabled", false);
		else
			$('#updatepayment').attr("disabled", true);
		
		$('#dispatchBtn').attr("disabled",false);
		$('#sendDocsendDoc').attr("disabled",false);
		$('#customizeNameAddress').attr("disabled",false);
	}
	
	$("#shipmentNumber").attr('disabled', false);
	if(isHeaderStatusDisplay && !isHeaderStatusUpdate){
		disableSection('headerStatusCode');
	}
	else if(isHeaderStatusDisplay && isHeaderStatusUpdate){
		enableSection('headerStatusCode');
	}
	else{
		enforceSecurityDivAndButtons('headerStatusCode', false);
	}
	//$("#bookingStatusCode").attr("disabled", false);
	/*
	if(readOnly==true){
		$('#'+formId+' :input').attr('disabled', true);
		$('select').attr("disabled",true);
		$("#bookingSave").attr("disabled",true);
	}else{
		$('#'+formId+' :input').attr('disabled', false);
		//$('#'+ formId +' :input').removeAttr('readOnly');
		$('select').removeAttr('disabled');
		$("#bookingSave").attr("disabled",false);
		//reset to read only
		resetReadOnly();
	}*/
	
}

//if your form has read only fields at time of load, declare them here [ as readOnly true]
function resetReadOnly(){
	//shipper fields
	$('input[name="shipper\\.city"]').attr('readonly', true);
	$('input[name="shipper\\.state"]').attr('readonly', true);
	$('input[name="shipper\\.zip"]').attr('readonly', true);
	//consignee fields
	$('input[name="consignee\\.city"]').attr('readonly', true);
	$('input[name="consignee\\.state"]').attr('readonly', true);
	$('input[name="consignee\\.zip"]').attr('readonly', true);
}
/*
function checkIfQuoteShowLinkToBeShown(){
	if($("#bookingTemplateId").val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!=''){
		$.ajax({
			type : "POST",
			url : _context +"/booking/getQuoteCount",
			data : {
				aroleId : $('input[name="consignee\\.addressRoleId"]').val()
			},
			success : function(responseText) {
				quoteCount = responseText.data;
				if(quoteCount<=0){
					$("#quoteExistsDiv").hide();
				}else if(quoteCount>0){
					$("#quoteExistsDiv").show();
				}
			}
		});
	}else{
		$("#quoteExistsDiv").hide();
	}
}
*/

function setAccordianTabDetails(id, displayText){
	$("#"+id).text(displayText);
}

function setScreenDetails(){
	if($('#bookingTypeCode').val()=='B'){

		//VVD and routing
		$('#bookingVVDRoutingDiv').show();
		$('#isAutoInlandMove').attr('disabled',false);
		$('#dealerAuctionLocationCode').attr('disabled',false);
		$('#militaryIbsStatusCode').attr('disabled',false);
		$('#freightMBU').show();

		$('#overrideInitialVesselName').attr('readonly',false);
		$('#overrideCustomsVesselName').attr('readonly',false);
		$('#overrideVoyageDirectionSeq').attr('readonly',false);
		$('#overrideInitialLtvDate').attr('readonly',false);
		
		$('#overrideInitialLtvDate').datepicker({
			dateFormat : 'mm-dd-yy',
			onSelect : function(dateText, elem)
			{
				isBookingChanged = "Y";
				
				if($('#overrideInitialLtvDate').val() =='')
				{
					//$('#overrideInitialLtvDate').val('01-01-0001');
					$('#overrideInitialLtvDate').css('color','black');
					$('#isOverrideInitialLtvDate').attr("checked", false);
				}
				else if($('#overrideInitialLtvDate').val() =='01-01-0001')
				{
					$('#overrideInitialLtvDate').css('color','black');
					$('#isOverrideInitialLtvDate').attr("checked", false);
				}
				else
				{
					$('#overrideInitialLtvDate').css('color','green');
					$('#isOverrideInitialLtvDate').attr("checked", true);
				}
				setOverridesHeader();
			}
		});

	}else if($('#bookingTypeCode').val()=='T'){

		//VVD and routing
		$('#bookingVVDRoutingDiv').hide();
		$('#isAutoInlandMove').attr('disabled',true);
		$('#dealerAuctionLocationCode').attr('disabled',true);
		$('#militaryIbsStatusCode').attr('disabled',true);
		$('#freightMBU').hide();

		$('#overrideInitialVesselName').attr('readonly',true);
		$('#overrideCustomsVesselName').attr('readonly',true);
		$('#overrideVoyageDirectionSeq').attr('readonly',true);
		$('#overrideInitialLtvDate').attr('readonly',true);
		$('#vvdDetailsOnCommodity').hide();
		$('#estShipLbl').css("margin-left", "250px");
	}
	
	enableDisableNote();
}

function expandAll(){
	// $('.booking-section').accordion('option', 'active', false);
	// $('.booking-section').accordion('option', 'active', 0);
	window.scrollTo(0, 0);
	$('.booking-section').each(function(index) {
		var status = $(this).accordion('option', 'active');
		if (typeof status == "boolean" && !status && index!=4) {
			$(this).accordion('option', 'active', 0);
		}
		else if(index==4){
			if(!addFreightEnabled()){
				if($('#tariff').is(':visible'))
					$($('.booking-section')[4]).accordion('option', 'active', false);
				disableAccordian(4);
			}
			else
			{
				var status = $($('.booking-section')[4]).accordion('option', 'active');
				if ((typeof status == "boolean" && !status) || (status=="0" && !$('#tariff').is(':visible'))) {
					var disabled = $($('.booking-section')[4]).accordion("option", "disabled");
					if(disabled)
					{
						$($('.booking-section')[4]).accordion("enable");
					}
					$($('.booking-section')[4]).accordion('option', 'active', 0);
				}
			}
		}
	});
	animatedcollapse.show('inland');
	if($('#bookingTypeCode').val()=='B'){
		animatedcollapse.show('routingMainDiv');
		animatedcollapse.show('cuttOffDiv');
	}
	removeErrorPointers();
	setTimeout(function(){
		window.scrollTo(0, 0);}, 500);
}

function collapseAll(){
	$('.booking-section').each(function(index) {
		$(this).accordion('option', 'active', false);
	});
	//$('.booking-section').accordion('option', 'active', false);
	//$('.booking-section').accordion('option', 'collapsible', true);
	removeErrorPointers();
	/*animatedcollapse.hide('inland');
	if($('#bookingTypeCode').val()=='B')
	{
		animatedcollapse.hide('routingMainDiv');
		animatedcollapse.hide('cuttOffDiv');
	}*/
}

function setGlobalVariableValues()
{
	lastBlOriginCode = $('#blOriginCityCode').val();
	lastBlOriginDescription = $('#blOriginCityDescription').val();
	lastBlOriginCodeDescription = $('#blOriginCityCodeDescription').val();
	
	lastOriginPortCode = $('#originPortCityCode').val();
	lastOriginPortDescription = $('#originPortCityDescription').val();
	lastOriginPortCodeDescription = $('#originPortCityCodeDescription').val();
	
	lastDestinationPortCode = $('#destinationPortCityCode').val();
	lastDestinationPortDescription = $('#destinationPortCityDescription').val();
	lastDestinationPortCodeDescription = $('#destinationPortCityCodeDescription').val();
	
	lastBlDestinationCode = $('#blDestinationCityCode').val();
	lastBlDestinationDescription = $('#blDestinationCityDescription').val();
	lastBlDestinationCodeDescription = $('#blDestinationCityCodeDescription').val();
	
	$('#lastLoadDschServiceGroupCode').val($.trim($('#loadDschServiceGroupCode').val()));
	
	if($.trim($('#lastLoadDschServiceGroupCode').val())=="CON" || $.trim($('#lastLoadDschServiceGroupCode').val())=="LCL")
		defaultHidden = true;
	else
		defaultHidden = false;
	
	//setRoutingLoadDischargeDetails();
	
	if($('#loadDschServiceGroupCode').val()=='AU')
		$('#vvdCutOff').hide();
	else
		$('#vvdCutOff').show();
	
	if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL')
	{
		$('#vvd_conventional').show();
		if(isRoutingModifiable && $("#bookingStatusCode").val()!='CANC')
		{
			$('#convCgoApptCutoffDate').attr('disabled', false);
			$('#convCgoApptCutoffTime').attr('disabled', false);
			$('#convCgoEstArrivalDate').attr('disabled', false);
			$('#convCgoEstArrivalTime').attr('disabled', false);
			$('#requiredDeliveryDate').attr('disabled', false);
		}
		if(isMilitaryModifiable && $("#bookingStatusCode").val()!='CANC')
			$('#milRequiredDeliveryDate').attr('disabled', false);
	}
	else
	{

		$('#vvd_conventional').hide();
		$('#convCgoApptCutoffDate').val('');
		$('#convCgoApptCutoffTime').val('');
		$('#convCgoEstArrivalDate').val('');
		$('#convCgoEstArrivalTime').val('');
		$('#requiredDeliveryDate').val('');
		$('#milRequiredDeliveryDate').val('');
		
		$('#convCgoApptCutoffDate').attr('disabled', true);
		$('#convCgoApptCutoffTime').attr('disabled', true);
		$('#convCgoEstArrivalDate').attr('disabled', true);
		$('#convCgoEstArrivalTime').attr('disabled', true);
		$('#requiredDeliveryDate').attr('disabled', true);
		//$('#milRequiredDeliveryDate').attr('disabled', true);
	}

	if($('#tradeCode').val()!='')
	{
		$('#overridePlaceOfIssue').attr("disabled", true);
		if($('#tradeCode').val()=='G' || $('#tradeCode').val()=='M')
		{
			domesticForeignIndicator =  "international";
			setDefaultOverrides();
		}
		else if($('#tradeCode').val()=='F')
		{
			if($('#originPortCityCode').val()=='')
			{
				domesticForeignIndicator =  'none';
				setDefaultOverrides();
			}
			else
			{
				$.ajax({
					url: "/gates/booking/routing/validateChinaTrade?cityCode="+$('#originPortCityCode').val(),
					success: function(responseText){
						if(responseText.data=="Y")
						{
							domesticForeignIndicator =  "china";
							setDefaultOverrides();
							if($('#bookingTypeCode').val()=='B' && $('#direction').val()=='E' && $("#bookingStatusCode").val()!='CANC')
								$('#overridePlaceOfIssue').attr("disabled", false);
						}
						else
						{
							domesticForeignIndicator = "international";
							setDefaultOverrides();
						}
					}
				});
			}
		}
		else if($('#tradeCode').val()=='A') {
			$("#hazmatdiv").show();
			domesticForeignIndicator = "domestic";
			setDefaultOverrides();
		}
		else
		{
			domesticForeignIndicator = "domestic";
			setDefaultOverrides();
		}
	}
	else
	{
		domesticForeignIndicator = 'none';
		setDefaultOverrides();
	}
}

function setDefaultOverrides()
{
	//Setting overrides values if they are not overridden
	checkPlaceOfReceiptDefaultValue("check");
	checkOriginPortDefaultValue("check");
	checkDestinationPortDefaultValue("check");
	checkPlaceOfDeliveryDefaultValue("check");
	checkOriginPtDefaultValue("check");
	
	/*if(!$('#isOverrideBlOrigin').attr("checked"))
		setPlaceOfReceiptDefaultValue();
	if(!$('#isOverrideOriginPort').attr("checked"))
		setOriginPortDefaultValue();
	if(!$('#isOverrideDestinationPort').attr("checked"))
		setDestinationPortDefaultValue();
	if(!$('#isOverrideBlDestination').attr("checked"))
		setPlaceOfDeliveryDefaultValue();
	if(!$('#isOverrideCountryOfOrigin').attr("checked"))
		setOriginPtDefaultValue();*/
	
	//Setting overrides values for VVD if they are not overridden
	if($('#bookingTypeCode').val()=='B')
	{
		checkVVDVesselDefaultValue("check");
		checkVVDVoyageDefaultValue("check");
		checkIssuePtDefaultValue("check");
		/*if(!$('#isOverrideCustomsVesselName').attr("checked"))
				setVVDVesselDefaultValue();
		if(!$('#isOverrideVoyageDirectionSeq').attr("checked"))
			setVVDVoyageDefaultValue();
		if(domesticForeignIndicator=='china' && $('#direction').val()=='E')
		{
			if(isRoutingOverrideModifiable){
				$('#overridePlaceOfIssue').attr("disabled", false);
				if(!$('#isOverridePlaceOfIssue').attr("checked"))
					setIssuePtDefaultValue();
			}
		}
		else
		{
			$('#overridePlaceOfIssue').val('');
			$('#isOverridePlaceOfIssue').attr("checked", false);
			$('#overridePlaceOfIssue').attr("disabled", true);
		}
		setOverridesHeader();*/
	}
}

function validateDate(dateId, showPrompt) {
	var date = $('#'+dateId).val();
	var dateSize = date.length;
	var day;
	var month;
	var fullYear;
	var newDate;
	if(dateSize == 6){
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(2,4), 10);
		fullYear = parseInt("20"+date.substring(4,6), 10);
		newDate = date.substring(0,2)+"-"+date.substring(2,4)+"-20"+date.substring(4,6);
	}
	else if(dateSize == 8)
	{
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(2,4), 10);
		fullYear = parseInt(date.substring(4,8), 10);
		newDate = date.substring(0,2)+"-"+date.substring(2,4)+"-"+
			date.substring(4,8);
	}
	else if(dateSize == 10)
	{
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(3,5), 10);
		fullYear = parseInt(date.substring(6,10), 10);
		newDate = date.substring(0,2)+"-"+date.substring(3,5)+"-"+
			date.substring(6,10);
	}
	else
	{
		if(showPrompt){
			$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
		}
		return false;
	}
	
	if(isNaN(day) || isNaN(month) || isNaN(fullYear))
	{
		if(showPrompt){
			$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
		}
		return false;
	}
	else
	{
		if(fullYear<1 || fullYear>9999)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else if(month<1 || month>12)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else if(day<1 || day>31)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else
		{
			var isLeapYear = false;
			if((fullYear%4)==0)
				isLeapYear = true;
			
			if(month==2 && isLeapYear && day>29)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mmm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if(month==2 && !isLeapYear && day>28)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if((month==4 || month==6 || month==9 || month==11)	&& day>30)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else
			{
				$('#'+dateId).val(newDate);
				return true;
			}
		}
	}
}

function clearBookingForm(){
	var webPageSectionIds = ['bookingHeaderDiv','maintainBookingShipperConsignee', 'maintainBookingParties', 'referenceMarks', 'marksAndNumbersSection', 'maintainBookingRouting', 'maintainBookingCommodity', 'militarySection', 'maintainBookingOverrides','bookingOverridesHeaderDiv'];
	for (var i=0; i<webPageSectionIds.length; i++) {
		clearWebPageSection(webPageSectionIds[i]);
	}
	$('#ediOrWebIndicator').text('');
	resetBookingForm();
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

function resetBookingForm(){
	removeErrorPointers();
	resetDivNames();
	setDefaultForAssignLink();
	$("#bookingStatusCode").attr("disabled",true);
	$("#createDate").html("");
	$("#lastUpdateDate").html("");
	$("#lastUpdateDateTimeUser").html("");
	$("#bookedDateTimeUser").html("");
	cleanShipperConsignee();
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
	reloadBookingGrids();
	loadFreightGrids();
}

function clearGlobalVariables()
{
	isBookingChanged = "N";
	domesticForeignIndicator = "none";
	shipNo=0;
	
	shipperAddress = "";
	templateCaller ="";
	isTemplateFirstLoad = false;
	consigneeAddress = "";
	isOneTimerChanged = "";
	isCustomerOverridden = false;
	//savedCommMethodValue = "";
	debtorCode = "";
	isPartyChanged = "";
	partyOrg = "";
	partyAddr = "";
	repeatCaller ="";
	repeatOrgName = "";
	repeatAddress = "";
	
	lastLoadService = "";
	lastDischargeService = "";

	lastOriginPortCode = "";
	lastOriginPortDescription = "";
	lastOriginPortCodeDescription = "";

	lastDestinationPortCode = "";
	lastDestinationPortDescription = "";
	lastDestinationPortCodeDescription = "";

	lastBlOriginCode = "";
	lastBlOriginDescription = "";
	lastBlOriginCodeDescription = "";

	lastBlDestinationCode = "";
	lastBlDestinationDescription = "";
	lastBlDestinationCodeDescription = "";
	
	lastChangeSource = "";
	
	iterated = false;
	freightModified = false;
	estimatedDropOffDateModified = false;
	
	currentRowId='';
	updateEquipmentErrorOccurred = false;
	equipmentUpdated = false;
	defaultHidden = false;
	
	//countryPhoneCodes = null;
	emergencyPhoneCountryCode="";
	isSpecialServiceChanged=false;
	_SpecialServiceGridCount = -1;
	isOperDoneOnce = false;
	
	isClauseChanged = "";
	clauseCode = "";
}

function enableDisableFooterButtons(){
	var footerButtonIds = ['updatepayment', 'sendDoc', 'customizeNameAddress'];
	var showEnabled = true;
	if($("#shipmentNumber").val()!="" && $('#bookingStatusCode').val()!='CANC'){
		showEnabled = false;
	}
	
	for (var i=0; i<footerButtonIds.length; i++) {
		enableDisableFooterButton(footerButtonIds[i], showEnabled);
	}
	
	if($('#shipmentNumber').val() !='' && $.trim($('#isRequirePrePayment').val()) != 'false' && $.trim($('#isRequirePrePayment').val()) != false)
		$('#updatepayment').attr("disabled", false);
	else
		$('#updatepayment').attr("disabled", true);

	if(($.trim($('#bookingCsr').val()) == 'EDIBKG' && $('#bookingStatusCode').val()=='APPR') 
		|| ($.trim($('#bookingCsr').val()) != 'EDIBKG' && ($('#bookingStatusCode').val()=='APPR' || $('#bookingStatusCode').val()=='OFFR'))) {
		$("#sendEDI").attr("disabled", false);
	} else 
		$("#sendEDI").attr("disabled", true);
}

function enableDisableFooterButton(footerButtonId, showEnabled){
		$("#"+footerButtonId).attr("disabled", showEnabled);
}

function hideGridsEditDelete(){
	if((isReferenceNumberMarksDisplayOnly && !isReferenceNumberMarksModifiable && !isReferenceNumberMarksDeletable ) || $('#bookingStatusCode').val()=='CANC'){
		$("div.ui-pg-div.ui-inline-del").hide();
		$("div.ui-pg-div.ui-inline-edit").hide();
		$('#sData','#gbox_referenceNumberGrid').hide();
		$('#gview_referenceNumberGrid input').attr("disabled", true);
		$('#gview_referenceNumberGrid select').attr("disabled", true);
	}else if (isReferenceNumberMarksModifiable && !isReferenceNumberMarksDeletable) {
		$("div.ui-pg-div.ui-inline-del").hide();
		$("div.ui-pg-div.ui-inline-edit").show();
		$('#sData','#gbox_referenceNumberGrid').show();
		$('#gview_referenceNumberGrid input').attr("disabled", false);
		$('#gview_referenceNumberGrid select').attr("disabled", false);
	}
	else {
		$("div.ui-pg-div.ui-inline-del").show();
		$("div.ui-pg-div.ui-inline-edit").show();
		$('#sData','#gbox_referenceNumberGrid').show();
		$('#gview_referenceNumberGrid input').attr("disabled", false);
		$('#gview_referenceNumberGrid select').attr("disabled", false);
	}
}

function getCommentTypes(args){
	/*if($('#bookingId').val()==null || $('#bookingId').val()==''){
		return;
	}*/
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'BKNG',
			contextScreen: 'maintainbooking'
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
				// For template overriden the values.
				if($('#bookingTypeCode').val()=="T"){
					args.displayCommentTypes='CSS,DOC,OPS';
					args.commentTypesForGrid='CSS,DOC,OPS';
				}else{
					args.commentTypesForGrid=string;
				}
				$("#comment_link").comments(args);
			}
		}
	});

}


function concludeRatingForBooking(id)
{		
	$('#re_choice_dialog').dialog( "close" );
	
	var url = "";
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/booking/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		url =  "/booking/concludeRating?id="+id;
	}
	blockUI();
	$.ajax({
		   type: "POST",				   							   
		   url: _context +  url,
		   success: function(responseText){		
			   $.unblockUI();
			   if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
					loadErrorOverLay(responseText);		
					$("#reErrorGrid").trigger('reloadGrid');
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
					displayBooking();
				}else if (responseText.data.rateView == "hold"){
					if(responseText.data.flow == true){
						navigateToTargetPageForFurtherFlow('Maintain Booking',responseText.data.targetPage, 
							$("#shipmentNumber").val(), responseText.data.sequenceNumber,"000",
							"2");
					}
					//D025294
					else
					{					
					navigateToTargetPageForFurtherFlow('',responseText.data.targetPage, 
							$("#shipmentNumber").val(), responseText.data.sequenceNumber,'000',"2");
					}
				}
			   else if(responseText.data.rateView == "showChoices"){
					loadChoiceOverLay(responseText);
					$('#re_choice_dialog').dialog('open');
					$("#ratingChoiceForm").loadJSON(responseText.data);
					$("#reChoiceGrid").trigger('reloadGrid');
//					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
//					if(responseText.data.isAllChoicesUnSelectable != null 
//							&& responseText.data.isAllChoicesUnSelectable == "Y"){
//						$('#reChoiceCloseBtn').hide();	
//						$('#reChoiceContinueBtn').show();
//					}else{
//						$('#reChoiceCloseBtn').show();	
//						$('#reChoiceContinueBtn').hide();	
//					}											
				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#shipmentForm').loadJSON(responseText.data);
					showResponseMessages("msgDiv", responseText);
				}else if(responseText.data.rateView == "Success"){
					if(responseText.data.targetScreen == 'BK01'){
						displayBooking();
					}else if(responseText.data.targetScreen == 'BLRT'){
						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
						$("#shipmentNumber").val()+'&shipmentSequenceNumber='+responseText.data.shipmentSequenceNumber
						+'&shipmentCorrectionNumber=000&navigationUrl=2';
					}
//					showResponseMessages("msgDiv", responseText);
//					displayBooking();
				}
				else {
					$('#shipmentForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					showResponseMessages("msgDiv", responseText);
				}	
			   
		   }
	});	

}

function exitFromBooking() {
	$.ajax({
		type: "POST",
		url: _context+'/booking/exit',
		success: function(responseText) {
			if($('#userFromMenu').val() == 'Y') {
				document.location.href = _context + '/';
			}else if($('#userFromMenu').val() == 'approveOfferBooking') {
				document.location.href = _context + '/cas/approveOfferBkSearch.do';
			}else if($('#userFromMenu').val() == 'ediBookingQueue') {
				document.location.href = _context + '/cas/ediBookingQueueSearch.do';
			}else if($('#userFromMenu').val() == 'webBookingReviewQueue') {
				document.location.href = _context + '/cas/bkEDIReviewSearch.do';
			}else if($('#userFromMenu').val() == 'bkWireDown') {
				document.location.href = _context + '/cas/bkWireDownSearch.do';
			}else if($('#userFromMenu').val() == 'billingQueue') {
				document.location.href = _context + '/cas/bookBillWorkQueueSearch.do';
			}else if($('#userFromMenu').val().indexOf('_') > -1) {
				var values = $('#userFromMenu').val().split('_');
				if(values[0] == 'ediBookingDetail') {
					if($.trim(values[1]) == '') {
						values[1] = null;
					}
					document.location.href = _context + '/booking/edi/showForm?ediBkngRefNum=' + values[1] + '&ediShmtReqId=' + values[2];					
				}
				else if(values[0] == 'variance') {
					var bookingNo = $('#shipmentNumber').val();
					document.location.href = _context + '/containerVariance/showForm?bookingId=' + bookingNo + '&containerNumbers=' + values[1] +'&source=B';					
				}
				else
					document.location.href = _context + '/';
			}
			else
			{
				/*if($('#userFromMenu').val() == 'Y') {
					document.location.href = _context + '/cas/approveOfferBkSearch.do';
				}
				else if($.trim($('#userFromMenu').val()) != 'Y') {
					document.location.href = _context + '/cas/approveOfferBkSearch.do';
				}*/
				document.location.href = _context + '/';
			}
			
		}
	});
}

function removeErrorPointers()
{
	$('.formError').remove();
	$("#bookingForm").validationEngine('hideAll');
}

//this function checks if Booking is created from Quote. If it is so, then applies the business rules.
function checkIfBookingFromQuote(){
	/*var aHtml = "";
	if($('#shipmentNumberHidden').val() !='' && $('#quoteNumber').val()==$('#shipmentNumberHidden').val()){
		aHtml = ""
			+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images//search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
			+"";
		$('#quoteVNConcat').attr('disabled',true);
	}else{
		aHtml = ""
			+"<a href=\"javascript:templatePopupSearch();\">"
			+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images/search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
			+"</a>"
			+"";
		$('#quoteVNConcat').attr('disabled',false);
	}*/
	//$('#templateDiv').html(aHtml);
}

function setRoutingLoadDischargeDetails()
{
	if($('#loadServiceCode :selected').val()!='' && $('#dischargeServiceCode :selected').val()!='')
	{
		
		function callBack(responseText) { // cheetah
			if(isRoutingModifiable && responseText.data.isRequireBlOrigin!='N')
				$('#blOriginCityCodeDescription').attr('disabled', false);
			else if($('#blOriginCityCode').val()=='' && responseText.data.isRequireBlOrigin=='N')
				$('#blOriginCityCodeDescription').attr('disabled', true);
			
			if(isRoutingModifiable && responseText.data.isRequireBlDestination!='N')
				$('#blDestinationCityCodeDescription').attr('disabled', false);
			else if($('#blDestinationCityCode').val()=='' && responseText.data.isRequireBlDestination=='N')
				$('#blDestinationCityCodeDescription').attr('disabled', true);
			
			if(isRoutingModifiable && responseText.data.isRequirePickupZipCode!='N')
				$('#pickupZipCode').attr('disabled', false);
			else if($('#pickupZipCode').val()=='' && responseText.data.isRequirePickupZipCode=='N')
				$('#pickupZipCode').attr('disabled', true);
			
			if(isRoutingModifiable && responseText.data.isRequireDeliveryZipCode!='N')
				$('#deliveryZipCode').attr('disabled', false);
			else if($('#deliveryZipCode').val()=='' && responseText.data.isRequireDeliveryZipCode=='N')
				$('#deliveryZipCode').attr('disabled', true);
		}
		
		getLoadDischargePairRequest(callBack, $('#loadServiceCode :selected').val(), $('#dischargeServiceCode :selected').val()); // cheetah

	}
	else
	{
		if(isRoutingModifiable)
		{
			$('#blOriginCityCodeDescription').attr('disabled', false);
			$('#blDestinationCityCodeDescription').attr('disabled', false);
			$('#pickupZipCode').attr('disabled', false);
			$('#deliveryZipCode').attr('disabled', false);
		}
	}
	checkPickupCarrier();
	checkDeliveryCarrier();
}

function expandDefaultSections(){
	//Freight
	disableAccordian(4);
}

function expandSection(accordionIndex){
	var status = $($('.booking-section')[accordionIndex]).accordion('option', 'active');
	if (typeof status == "boolean" && !status) {
		$($('.booking-section')[accordionIndex]).accordion('option', 'active', 0);
	}
}

function collapseSection(accordionIndex){
	$($('.booking-section')[accordionIndex]).accordion('option', 'active', false);
}

function invokeBillingStartedOverlayScreen(){
	$("#billOverlayContent").show();
	$("#billBookingDialog" ).dialog( "option", "title", 'Billing Started' );
	$("#billBookingDialog").dialog('open');
}

function checkForAddOrUpdate(){
	var isUpdate = false;
	if($('#freightSeqNo').val()!=undefined && $('#freightSeqNo').val()!=null && $('#freightSeqNo').val()!=''){
		isUpdate = true;
	}
	return isUpdate;
}

function autoTabBooking(CurrentElementID, NextElementID, FieldLength) {
    //Get a reference to the two elements in the tab sequence.
    var CurrentElement = $('#' + CurrentElementID);
    var NextElement = $('#' + NextElementID);
 
    CurrentElement.keyup(function(e) {
        //Retrieve which key was pressed.
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence.   
        if (CurrentElement.val().length >= FieldLength
            && ((KeyID >= 48 && KeyID <= 90) ||
            (KeyID >= 96 && KeyID <= 105)))
            NextElement.focus();
    });
}

function autoTabBookingNameSelector(source, CurrentElementID, NextElementID, FieldLength) {
    //Get a reference to the two elements in the tab sequence.
    //var CurrentElement = $('#' + CurrentElementID);
    var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
    //var NextElement = $('#' + NextElementID);
 
    CurrentElement.keyup(function(e) {
        //Retrieve which key was pressed.
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence.   
        if (CurrentElement.val().length >= FieldLength
            && ((KeyID >= 48 && KeyID <= 90) ||
            (KeyID >= 96 && KeyID <= 105)))
            NextElement.focus();
    });
}

//D021198
function focusBookingNoCustomerGroupOnTemplatePull(){
	var str = $('#msgDiv').text().toLowerCase();
	if(str.search('successfully')>=0 && str.search('loaded')>0){
		window.scroll(0, 0);
		if($('#customerGroupId :selected').text()=="Select"){
			$('#customerGroupId').focus();
		}
		else{
			$('#shipmentNumber').focus();
		}
}
}

function sendEDIConfirmation(source) {
	$.ajax({
		url: _context +"/booking/sendEDI",
		data: {shipmentNumber: $("#shipmentNumber").val(), 
			   source: source},
		success: function(responseText) {
			if(source == 'sendEDI') {
				showResponseMessages('msgDiv', responseText);
			}
		}
	});
}

function expandAllNew(){
	 $('.ui-accordion-content').attr('style','display:block');
}

function applyQuoteCommonCodeForQuote(){
	//$('#bookingForm').clearForm();
	//resetDefault();
	/*if(data!=''){
		$('#quoteNumber').val(data.number);
		$('#quoteId').val(data.id);
		$('#quoteVersion').val(data.version.substr(1,4));
		$('#quoteVNConcat').val(data.number);//+'.'+data.version);
	}*/
	getQuote('');
}

function triggerErrorMessageAlert(errorMsgDivId){
	if(errorMsgDivId==undefined || errorMsgDivId==null || errorMsgDivId==''){
		errorMsgDivId = 'msgDiv';
	}
	if(!$('#msgDivDialog').is(':visible'))
	{
		var xErrorCoordinate = window.pageXOffset;
		var yErrorCoordinate = window.pageYOffset;
		$("#msgDivDialog" ).html($('#'+errorMsgDivId).html());
		$.unblockUI();
		$("#msgDivDialog").dialog('open'); 
		if(yErrorCoordinate != 0 || xErrorCoordinate !=0)
		{
			setTimeout(function(){
				window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
		}
	}
}

//Hitsory
function openHistory(){
	$('#changeLog').html('<h3>History</h3><div class="span-24"><div class="span-24"><table id="changeLogGrid"></table><div id="changeLogPager"></div></div></div>');
	createChangeLogGrid($('#bookingId'),'bookingmaintenance');
	$("#changeLog" ).dialog( "option", "title", 'Change Log' );
	$("#changeLog").dialog('open');
	
}

function openSendAlerts() {
	console.log("openSendAlerts");

	var kickerColNames = ['Id', 'Category', 'Customer Group', 'Name', 'Description', 'Subject Line', 'From', 'To', 'isHtml', 'CC', 'Create User', 'Create Date', 'User', 'Update Date'];

	var kickerColModel = [
	     	       {name:'templateId', hidden:true, width:25},
	     	       {name:'category', hidden:true, width:88},
	     	       {name:'customerGroups', hidden:false, width:100},
	     	       {name:'name', hidden:false},
	     	       {name:'description', hidden:false},
	     	       {name:'emailSubject', hidden:false},
	     	       {name:'emailFrom', hidden:true},
	     	       {name:'emailTo', hidden:false},
	     	       {name:'isHtml', hidden:true},
	     	       {name:'emailCC', hidden:true},
	     	       {name:'createUser', hidden:true},
	     	       {name:'createDate', hidden:true},
	     	       {name:'lastUpdateUser', hidden:true},
	     	       {name:'lastUpdateDate', hidden:true, "formatter":"date"}
				];
	
	var jsonReaderReference = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"templateId"
		};
	
	$('#sendKickerGrid').jqGrid({        
	   	url:_context+'/booking/loadEmailTemplates?module=Booking',
		datatype: "json",
	   	colNames:kickerColNames,
	   	colModel:kickerColModel,
	   	rowNum:10,
	   	pager: '#sendKickerPager',
	    viewrecords: true,
	    caption:'Templates',
	    sortName: 'templateId',
	    sortorder: "desc",
	    loadonce: true,
	    jsonReader : jsonReaderReference,
	    height: "100%",
	    multiselect: true,
	    beforeSelectRow: function(rowid, e){
	        jQuery("#sendKickerGrid").jqGrid('resetSelection');
	        return(true);
	    }
	}).navGrid("#sendKickerPager",{edit:false,add:false,del:false});
	
	$("#kickerTemplatesDivDialog").dialog('open');
}

function startsWith(expr, value) {
	return (value.substr(0, expr.length) == expr);
}

function onEdiClick(){
	document.location.href= _context + '/booking/edi/showForm?ediBkngRefNum=&ediShmtReqId=&shipmentNumber=' + $("#shipmentNumber").val();
}

function applyAndPrintKicker(templateId) {
	blockUI();
	var urlStr = _context +"/booking/getBookingKickerSource?bookingNumber="+$('#shipmentNumber').val()+"&templateId="+templateId;
	
	var params = ['height='+window.height,'width='+window.width].join(',');        
	var popup = window.open('', 'popup_window', params); 

	popup.document.title = 'Print Alert Email';	
	popup.document.write("<div id='body'>Please wait</div>");	
	
	$.ajax({
		type: "GET", 
		url: urlStr,
		dataType:'json',
		success: function(responseData){			
			if (responseData.data) {
				popup.document.getElementById('body').innerHTML = responseData.data.emailBody;
				setTimeout(function (){
					popup.print();      
         		}, 1000); 
				$.unblockUI();
			} else {
				if (popup) popup.close();
				$.unblockUI();
				alert("An error occurred while calling printing function");
			}
		},
		error: function(jqXHR,textStatus,errorThrown) {
			if (popup) popup.close();
			$.unblockUI();
			alert("An error occurred while calling printing function:" + textStatus);
		}
	});
}

function applyAndSendKicker(templateId) {
	
	blockUI();
	var urlStr = _context +"/booking/getBookingKickerSource?bookingNumber="+$('#shipmentNumber').val()+"&templateId="+templateId;
	$.ajax({
		type: "GET",
		url: urlStr,
		dataType:'json',
		success: function(responseData){
			
			//var length = responseData.data.length ? parseInt(responseData.data.length) : 9999;
			
			var key = "body=";
			var start = responseData.data.mailto.indexOf(key) + key.length;
			var toEncode = responseData.data.mailto.substring(start);
			var noEncode = responseData.data.mailto.substring(0,start);
			var fullMailTo = noEncode + encodeURIComponent(toEncode);
			
			var length = fullMailTo.length;
			
			if (responseData.data.isHtml == 'true' || length > 1500) {

				console.log ('openSendBookingKicker called. templateId:' + templateId);
				$("#kickerTemplatesDivDialog").dialog('close'); // close templates grid
				$("#sendKickerDivDialog").dialog('open'); // opens SendEmail overlay
				
				if ($('#sendKickerDivDialog-isHtml').val() == 'true') { // if previous email was HTML, then reset Body
					$('#sendKickerDivDialog-emailBody').elrte('destroy');
					$('#sendKickerDivDialog-bodyContainer').html("<textarea id='sendKickerDivDialog-emailBody' style='width:950px;height:400px;'></textarea>");	
				} else {
					$('#sendKickerDivDialog-emailBody').val(''); // clear out	
				}
				
				//D026512: 	*corr* MB: after an alert is sent, Maintain Booking loses the bkg cmmt and starts behaving oddly
				//Following line is clearing out the values for all form fields in page. So commented it and set blanks on each field
				//$('#sendKickerDivDialog-form input[type=text],input[type=hidden]').val(''); // clear out form fields
				
				$('#sendKickerDivDialog-form input[type=text]').val(''); // clear out form fields
				$('#sendKickerDivDialog-form input[type=hidden]').val(''); // clear out form fields
				
				$('#sendKickerDivDialog-emailTo').val('');
				$('#sendKickerDivDialog-emailSubject').val('');
				$('#sendKickerDivDialog-emailCc').val('');
				$('#sendKickerDivDialog-bookingNumber').val('');
				$('#sendKickerDivDialog-templateId').val('');
				$('#sendKickerDivDialog-isHtml').val('');
				
				if (responseData.data.isHtml == 'true') {
					var opts = {
							cssClass : 'el-rte',
							height : 400,
							width : 900,
							toolbar : 'web2pyToolbar',
							cssfiles : [ 'elrte-1.3/css/elrte-inner.css' ]
						}
					$("#sendKickerDivDialog-emailBody").elrte(opts).elrte('val', responseData.data.emailBody);	
				} else {
					$("#sendKickerDivDialog-emailBody").val(responseData.data.emailBody);
				}
				
				$('#sendKickerDivDialog-emailTo').val(responseData.data.emailTo);
				$('#sendKickerDivDialog-emailSubject').val(responseData.data.emailSubject);
				$('#sendKickerDivDialog-emailCc').val(responseData.data.emailCc);
				$('#sendKickerDivDialog-bookingNumber').val(responseData.data.bookingNumber);
				$('#sendKickerDivDialog-templateId').val(responseData.data.templateId);
				$('#sendKickerDivDialog-isHtml').val(responseData.data.isHtml);
				
			} else {

 				$('#sendKickerHref').attr("href",noEncode + encodeURIComponent(toEncode));
				$('#sendKickerHref')[0].click();	
			}

			$.unblockUI();
		},
		error: function(jqXHR,textStatus,errorThrown) {
			$.unblockUI();
			alert("Error getting template "+textStatus);
		}
	});
}

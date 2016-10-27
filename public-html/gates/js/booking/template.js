$(document).ready(function () {


	$("#isRequireCustomerVerifyAdd").attr('checked', true);
	$('#isRequireCustomerVerifyChg').attr('checked', true);
	
	$("#effectiveDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
		}
	});
	
	//$('#effectiveDate').datepicker('setDate', new Date()); 
	$("#expirationDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
		}
	});
	//$("#expirationDate").val("12-31-9999");
	$('#isShipperOnlyY').attr('checked',true);
	$('#isShipperOnlyY').val('Y');
	$('#bookingEdiTemplateQualifier').attr('readonly',true);

	if($('#shipmentNumberHidden').val()!=''){
		$('#templateDelete').attr('disabled',false);
	}else{
		$('#templateDelete').attr('disabled',true);
	}
	
		$('#description').change(function(){
		$('#description').val(($('#description').val()).toUpperCase()); 
	});
	
	$('#templateSave').click(function(){
		$('#primaryCarrierCode').val(($('#primaryCarrierCode').val()).toUpperCase()); 
		window.scrollTo(0,0);
		if(!$("#bookingForm").validationEngine('validate') || !validateBookingUIFields() || !validateTemplateHeader()){
			return;
		}else{
		    //this method will call saveBooking of booking.js where type code is checked: 'T' or 'B'. 
			validateBooking();			
		}
    });	
	
	$('#templateDelete').click(function(){
			if($('#shipmentNumberHidden').val()!=''){
				var ok = confirm("Do you really want to delete this Template? (Y or N)");
				if(ok == true){
					deleteTemplate();
				}
			}
    });	
	
	$('#templateExit').click(function(){
		if(isBookingChanged=='Y')
		{
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				if(document.referrer != '' && (document.referrer.split("/gates")[1]).split("?")[0] == '/booking/showForm')
					document.location.href = document.referrer;
				else
					document.location.href = _context+ '/cas/listTemplateSearch.do?isRefresh=true';
			}
		}
		else
		{
			if(document.referrer != '' && (document.referrer.split("/gates")[1]).split("?")[0] == '/booking/showForm')
				document.location.href = document.referrer;
			if(document.referrer != '' && (document.referrer.split("/gates")[1]).split("?")[0] == '/shipment/showForm')
				document.location.href = document.referrer;
			else
				document.location.href = _context+ '/cas/listTemplateSearch.do?isRefresh=true';
		}
	});	

	$('#isShipperOnlyY').click(function(){
		$('#isShipperOnlyN').attr('checked',false);
		$('#isShipperOnlyN').val('');
		
		$('#isShipperOnlyY').attr('checked',true);
		$('#isShipperOnlyY').val('Y');
		
	});

	$('#isShipperOnlyN').click(function(){
		$('#isShipperOnlyY').attr('checked',false);
		$('#isShipperOnlyY').val('');

		$('#isShipperOnlyN').attr('checked',true);
		$('#isShipperOnlyN').val('N');
	});

	/*setPartiesHeader();
	setAccordianTabDetails("shipperNameDiv", "Shipper - "+$('input[name="shipper\\.organizationName"]').val());
	setAccordianTabDetails("consigneeNameDiv", "Consignee - "+$('input[name="consignee\\.organizationName"]').val());*/
	
	/*if($('input[name="shipper\\.addressRoleId"]').val()!=''){
		enableDisableContactId("shipper",false);
	}
	if($('input[name="consignee\\.addressRoleId"]').val()!=''){
		enableDisableContactId("consignee",false);
	}*/

	if($('#isEdiTemplate').val()=='Y'){
		$('#isEdiTemplate').selected().val("Y");
	}else{
		$('#isEdiTemplate').selected().val("N");
	}
	
	if(null!=$('#shipmentNumber').val() && $('#shipmentNumber').val()!=''){
		if($('#bookingTypeCode').val()=='T'){
			displayTemplate($('#shipmentNumber').val());
		}else{
			$('#msgDiv').html("<div class=\"message_error\">Invalid Template Number.</div>");
			$('#msgDiv').show();
			window.scrollTo(0, 0);
			triggerErrorMessageAlert();
		}
	}
	
	//create Hold grid
	createHoldGrid("template");
	
	$('#isEdiTemplate').change(function(){
		setEDIQualifier();
	});

	$("#sendDocBtn").click(function(){
		document.location.href = _context+"/booking/senddocument/create?nav=template&bookingId="
		+$("#shipmentNumber").val();
	});

	//	Template Payment
	$('#updatepaymentT').click(function(){
		bookingHeaderLink('updatepayment/showForm');
	});

	$("#effectiveDate").change(function(){
		$('#effectiveDate').validationEngine('hide');
	});

	$("#expirationDate").change(function(){
		$('#expirationDate').validationEngine('hide');
	});
	
	$('#shipmentNumber').focus();
	
	$('#bookingEdiTemplateQualifier').change(function(){
		removeErrorPointers();
		$('#expirationDate').validationEngine('hide');
	});

	$('#templateClear').click(function(){
		//document.location.href = _context+"/booking/template/showTemplateForm?templateNumber=";
		if(isBookingChanged == 'Y'){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				clearTemplate();
				/*
				reloadBookingGrids();
				$('#commentsDiv').hide();
				$('#historyDiv').hide();
				resetDivNames();
				resetTemplateScreenAfterDelete(); */
			}
		} else {
			clearTemplate();
			/*
			reloadBookingGrids();
			$('#commentsDiv').hide();
			$('#historyDiv').hide();
			resetDivNames();
			resetTemplateScreenAfterDelete(); */
		}
		
		
	});
	
	if($('#isAgeSelected').attr('checked')) {
	    $("#txtAge").show();
	} else {
	    $("#txtAge").hide();
	}
	
	$("#isRequireCustomerVerifyAdd").click(function(){
		if($("#isRequireCustomerVerifyAdd").is(":checked")){
			$('#isRequireCustomerVerifyAdd').val(true);
		}else{
			$('#isRequireCustomerVerifyAdd').val(false);
		}
	});
	
	$('#isRequireCustomerVerifyChg').click(function(){
		if($('#isRequireCustomerVerifyChg').is(":checked")){
			$('#isRequireCustomerVerifyChg').val(true);
		}else{
			$('#isRequireCustomerVerifyChg').val(false);
		}
	});
	
	//Hitsory
	$("#changeLog").dialog({
		//dialogClass:'transparent',
		autoOpen : false,
		width : 900,
		height : 850,
		modal : true,
		buttons: {
	         Exit: function(){
	        	 $( this ).dialog( "close" );
	         }
	    }
	});

});

function setEDIQualifier(){
	if($('#isEdiTemplate').val()=='Y'){
		$("#bookingEdiTemplateQualifier").addClass("validate[required]");
		$('#bookingEdiTemplateQualifier').attr('readonly',false);
	}else{
		$("#bookingEdiTemplateQualifier").removeClass("validate[required]");
		$('#bookingEdiTemplateQualifier').attr('readonly',true);
	}
}

function deleteTemplate(){
	$.ajax({
		type: "POST",
		url: _context +"/booking/deleteTemplate",
		data: {
			shipmentNumber: $("#shipmentNumber").val(),
			bookingTemplateId: $("#bookingTemplateId").val(),
			bookingId: $('#bookingId').val()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				clearAndResetBookingScreen();
				reloadBookingGrids();
				$('#commentsDiv').hide();
				$('#historyDiv').hide();
				resetDivNames();
				resetTemplateScreenAfterDelete();
			}
			//Messages
			showResponseMessages("msgDiv", responseText);
			$('#msgDiv').show();
			$('#commentsDiv').show();
			if(isHistoryDisplayOnly) $('#historyDiv').show();
		}
	});
}

function clearTemplate() {
	$('#msgDiv').html("<div class=\"message_info\">Please wait while screen is refreshed...</div>");
	$('#msgDiv').show();
	$.ajax({
		url: _context +"/booking/clear",
		data : {
			bookingFromQuote : false
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {		
				document.location.href = _context+"/booking/template/showTemplateForm?templateNumber="
			}
			showResponseMessages('msgDiv', responseText);
			window.scrollTo(0, 0);
		}
	});
}

function resetTemplateScreenAfterDelete(){
	$('#bookingId').val('');
	$('#entityVersion').val('');
	$('#templateEntityVersion').val('');
	$("#bookingTemplateId").val('');
	$('#shipmentNumberHidden').val('');
	$('#bookingTemplateOwner').val('');
	$('#displayingTemplateEvent').val('N');
	$('#isShipperOnlyY').attr('checked',true);
	$('#isShipperOnlyY').val('Y');
	$('#dispatchBtn').attr('disabled',true);
	$('#sendDocBtn').attr('disabled',true);
	$('#customizeNameAddress').attr('disabled',true);
	$('#templateDelete').attr('disabled',true);
}

function displayTemplate(templateNumber){
	if($('#displayingTemplateEvent').val()=="N"){
		blockUI();
		$.ajax({
			type: "GET",
			url: _context +"/booking/displayTemplate",
			data: {templateNumber: templateNumber},
			success: function(responseText){
				clearBookingForm();
				if (responseText.messages.error.length == 0) {
					$('#customerGroupId').val("");
					showJSON(responseText);
					collapseAll();
					$("#templateEntityVersion").val(responseText.data.bookingTemplate.entityVersion);
					$("#bookingTemplateSeqNbrDs").val(responseText.data.bookingTemplate.bookingTemplateSeqNbrDs);
					//Grid reload calls
					reloadBookingGrids();
					$('#customizeNameAddress').removeAttr("disabled");
					$('#billOfLadingLink').html("<a href=\"javascript:bookingHeaderLink('bpOverride/showBPOForm');\">Bill Of Lading</a>");
					if(responseText.data.shipperNameAddressCustomized){
						$('input[name="shipper\\.organizationName"]').css('color', 'green');
					}
					if(responseText.data.consigneeNameAddressCustomized){
						$('input[name="consignee\\.organizationName"]').css('color', 'green');
					}
					/*if(null!=responseText.data.shipper.addressRoleId){
						enableDisableContactId('shipper',false);
					}
					if(null!=responseText.data.consignee.addressRoleId){
						enableDisableContactId('consignee',false);
					}*/
					if(null!= responseText.data.bookingTemplate.partyTypeCode && (
							responseText.data.bookingTemplate.partyTypeCode=='02' || 
							responseText.data.bookingTemplate.partyTypeCode=='' || 
							responseText.data.bookingTemplate.partyTypeCode=='0')){
						$('#isShipperOnlyY').attr('checked',true);
						$('#isShipperOnlyY').val('Y');

						$('#isShipperOnlyN').attr('checked',false);
						$('#isShipperOnlyN').val('');
					}else{
						$('#isShipperOnlyY').attr('checked',false);
						$('#isShipperOnlyY').val('');

						$('#isShipperOnlyN').attr('checked',true);
						$('#isShipperOnlyN').val('N');
					}
					if(responseText.data.bookingTemplate.isEdiTemplate=='N' || responseText.data.bookingTemplate.isEdiTemplate==''){
						$('#isEdiTemplate').val("N");
					}else{
						$('#isEdiTemplate').val("Y");
					}
					
					setEDIQualifier();
					$('#isEdiTemplate').trigger("change");
					$('#sendDocBtn').attr('disabled',false);
					//$('#updatepaymentT').attr('disabled',false);
					$('#dispatchBtn').attr('disabled',false);
					
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
					if(responseText.data.header.isRequireCustomerVerifyAdd==true){
						$("#isRequireCustomerVerifyAdd").attr('checked', true);
					}else{
						$("#isRequireCustomerVerifyAdd").attr('checked', false);
					}
					if(responseText.data.header.isRequireCustomerVerifyChg==true){
						$("#isRequireCustomerVerifyChg").attr('checked', true);
					}else{
						$("#isRequireCustomerVerifyChg").attr('checked', false);
					}
				}else{
					$('#bookingForm').clearForm();
					//clearShipperConsignee();
					resetDivNames();
					reloadBookingGrids();
					$('select').attr('selectedIndex',0);
					$("#createDate").html("");
					$("#lastUpdateDate").html("");
					$('#sendDocBtn').attr('disabled',true);
					//$('#updatepaymentT').attr('disabled',true);
					$('#dispatchBtn').attr('disabled',true);
				}
				$("#shipmentNumber").attr("disabled",false);
				//Messages
				showResponseMessages("msgDiv", responseText);
				$('#commentsDiv').show();
				$('#historyDiv').show();
				$("#shipmentNumber").attr("disabled",false);
				
				//Display Unreleased Holds Grid on initial display
				/*openUnreleasedHoldGridOnIntialDisplay("template");*/
				isBookingChanged = "N";
				$.unblockUI();
				$('#displayingTemplateEvent').val("N");
			}
		});
	}
	//D27290
	if(!isRoutingModifiable)
	{
	$('#loadServiceCode').attr('disabled',true);
	$('#dischargeServiceCode').attr('disabled',true);
	}
	
	if(!isReferenceNumberMarksModifiable)
		{
		$('#typeCode').attr('disabled',true);
		}
}


function validateTemplateHeader(){
	var isValid = true;
	var ef = new Date($("#effectiveDate").val());
	var ex = new Date($("#expirationDate").val());
	var currDate = new Date($('#currentSystemDate').val());
	if($('#bookingTypeCode').val()=='T'){
		if($('#description').val()==''){
			$('#description').validationEngine('showPrompt', 'Description is required.', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#isEdiTemplate').val()==''){
			$('#isEdiTemplate').validationEngine('showPrompt', 'EDI Template is required.', 'error', 'topRight', true);
			isValid = false;
		}
		/*if($('#effectiveDate').val()==''){
			$('#effectiveDate').validationEngine('showPrompt', 'Effective Date is required.', 'error', 'topRight', true);
			isValid = false;
		}else */if(!validateDate('effectiveDate', false)){
			$('#effectiveDate').validationEngine('showPrompt', 'Effective Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
			isValid = false;
		}
		/*if($('#expirationDate').val()==''){
			$('#expirationDate').validationEngine('showPrompt', 'Expiration Date is required.', 'error', 'topRight', true);
			isValid = false;
		}else*/ if(!validateDate('expirationDate'), false){
			$('#expirationDate').validationEngine('showPrompt', 'Expiration Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
			isValid = false;
		}
		if(ex < ef){
			$('#expirationDate').validationEngine('showPrompt', 'Expiration Date must be greater than Effective Date.', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#bookingId').val()=='' && ef < currDate){
			$('#effectiveDate').validationEngine('showPrompt', 'Effective Date must be greater than Current Date.', 'error', 'topRight', true);
			isValid = false;
		}
		/*if($('#isEdiTemplate').val()=='Y' && $('#bookingEdiTemplateQualifier').val()==''){
			$('#bookingEdiTemplateQualifier').validationEngine('showPrompt', 'EDI Qualifier is required for EDI template.', 'error', 'topRight', true);
			isValid = false;
		}*/
		if($('#isShipperOnlyY').val()=='' && $('#isShipperOnlyN').val()==''){
			$('#isShipperOnlyY').validationEngine('showPrompt', 'Please select Shipper Only flag.', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#isShipperOnlyY').val()!='' && $('input[name="shipper\\.addressRoleId"]').val()==''){
			document.getElementById('maintainBookingShipperConsignee').style.display = 'block';
			//$('#isShipperOnlyY').validationEngine('showPrompt', 'Shipper information must be present for shipper template.', 'error', 'topRight', true);
			$('input[name="shipper\\.organizationName"]').validationEngine('showPrompt', 'Shipper information must be present for shipper template.', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#isShipperOnlyN').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()==''){
			document.getElementById('maintainBookingShipperConsignee').style.display = 'block';
			//$('#isShipperOnlyN').validationEngine('showPrompt', 'Consignee information must be present for consignee template.', 'error', 'topRight', true);
			$('input[name="consignee\\.organizationName"]').validationEngine('showPrompt', 'Consignee information must be present for consignee template.', 'error', 'topRight', true);
			isValid = false;
		}
	}
	return isValid;
}

function removeTemplatePopUps(){
	$("#bookingForm").validationEngine('hideAll');
}
//Hitsory
function openHistory(){
	$('#changeLog').html('<h3>History</h3><div class="span-24"><div class="span-24"><table id="changeLogGrid"></table><div id="changeLogPager"></div></div></div>');
	createChangeLogGrid($('#bookingId'),'templatemaintenance');
	$("#changeLog" ).dialog( "option", "title", 'Change Log' );
	$("#changeLog").dialog('open');
	
}
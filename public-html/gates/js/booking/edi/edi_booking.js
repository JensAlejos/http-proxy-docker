var printBookingNoticeEnabled = ''; 
$(document).ready(function () {
	
	enforceSecurityDivAndButtons("clearTemplate", _isTemplateClearPresent);
	enforceSecurityDivAndButtons("maintainTemplate", _isTemplateMaintainPresent);
	enforceSecurityDivAndButtons("printBookingNotice", _isPrintPresent);
	enforceSecurityDivAndButtons("holdEDI", _isHoldPresent);
	enforceSecurityDivAndButtons("sendBookingNumberConf", _isConfirmationPresent);
	enforceSecurityDivAndButtons("approveEDI", _isApprovePresent);
	enforceSecurityDivAndButtons("rejectEDI", _isRejectPresent);
	enforceSecurityDivAndButtons("reValidateEDI", _isRevalidatePresent);
	enforceSecurityDivAndButtons("createBooking", _isCreatePresent);
	enforceSecurityDivAndButtons("partiesButton", _isPartiesDisplay);
	
	if(_isPartiesDisplay)
		createMainPartiesGrid();
	if(_isProblemsDisplay)
		createProblemLogGrid();
	
	if($.trim($('#shipmentNumber').val()) == '') {
		$('#bookingStatusCode').text('');
	}
	
//	validateRevalidateButton();
	setUnResolvedProblem();
	
	if(!_isTemplateApply) {
		console.log("template disable by permission");
		$('#ediTemplateHeader').gatesDisable();
	} 
	/*if(_isCommentsDisplay && _isCommentsAdd)
	{
		var args = {
			entityType: 'ESRQ',
			entityId: $('#ediShmtRequestId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'EDIBKOUT,FACTHOLD',
			commentTypesForGrid: 'EDIBKOUT,FACTHOLD,EDIBKIN,EDIBKSYS'
		   };
		$("#comment_link").comments(args);
	}
	else if(_isCommentsDisplay && !_isCommentsAdd)
	{
		var args = {
			entityType: 'ESRQ',
			entityId: $('#ediShmtRequestId').val(),
			commentId: 'commentId',
			displayCommentTypes: ''
		   };
		$("#comment_link").comments(args);
	}*/
	
	

	$('#showUnResolvedProblem').click(function(){
		showUnResolvedProblem();
	});
	
	if(_isTemplateClearPresent)
	{
		$('#clearTemplate').click(function(){
			//if($('#bookingTemplateCodeHidden').val()!='') {
				clearTemplate();
				/*var canClearTemplate = false;
				//alert("isCurrentRecord->"+$('#isCurrentRecord').text() + " billExists:->" + $('#billExists').text() + " statusCode:->" + $('#statusCode').text());
				if($('#isCurrentRecord').text()=='Y'){
					if($('#billExists').text()!='Y'){
						if($('#statusCode').text()!='Rejected' &&
								$('#statusCode').text()!='SYS ERR'){
							canClearTemplate = true;
						}else{
							alert("Cannot cleart template, EDI status is "+ $('#statusCode').text() +"");
						}
					}else{
						alert("Bill exists for EDI.");
					}
				}else{
					alert("EDI is not current record.");
				}
				if(canClearTemplate){
					clearTemplate();
				}
			}else{
				alert("There is no template assigned to EDI Shipment request.");
			}*/
		});
	}
	
	/*if(_isRevalidatePresent)
	{
		$('#reValidateEDI').click(function(){
			enableDisableAllButtons(true);
			$('#msgDiv').show();
			showLoadingMessage('Revalidating EDI Request');
			$.ajax({
				url : _context +"/booking/edi/revalidateEDI",
				data : {ediShmtRequestId:$("#ediShmtRequestId").val(),
					statusCode : $('#statusCode').text(),
					commentId : $('#commentId').val()},
				success : function(responseText) {
					showResponseMessages("msgDiv", responseText);
					if(responseText.success)
					{
						if($('#statusCode').text()!='RECEIVED')
							$('#statusCode').text('RECEIVED');
						
						if($('#holdEdiTypeCode').val()!='')
							$('#holdEdiTypeCode').val('');
						
						if($('#isShowLink').val()=='N' && $('#bookingStatusCode').text()=='' || 
								$('#bookingStatusCode').text()=='CANCEL' ||
								$('#bookingStatusCode').text()=='INCOMPLETE')
						{
							$('#isShowLink').val('Y');
							enableDisableAcceptAll(0);
						}
						reloadEDIGrids();
						//$("#ediProblemLogGrid").trigger("reloadGrid");
						
						$.ajax({
							type: "GET",
							url: _context +"/booking/edi/displayEDIRequest",
							data: {ediBkngRefNum: $.trim($("#bookingReferenceNumber").text())},
							success: function(responseTextNew){
								if (responseTextNew.messages.error.length == 0) {
									showJSON(responseText);
									reloadEDIGrids();
								}else{
									$("#ediShmtRequestId").text("");
									setEDIPageTitle(null);	
								}
								enableDisableAllButtons();
							}
						});
					}
					enableDisableAllButtons(false);
					validateAllButtons();
				}
			});
		});
	}*/
	
	if(_isRevalidatePresent) {
		$('#reValidateEDI').click(function(){
			enableDisableAllButtons(true);
			showLoadingMessage('Revalidating EDI Request');
			$('#msgDiv').show();
			$.ajax({
				url : _context +"/booking/edi/revalidateEDI",
				data : {ediShmtRequestId:$("#ediShmtRequestId").val(),
					statusCode : $('#statusCode').text(),
					commentId : $('#commentId').val()},
				success : function(responseText) {
					showResponseMessages("msgDiv", responseText);
					if(responseText.success == true){
						showJSON(responseText);
					}
					reloadEDIGrids();
					showResponseMessages("msgDiv", responseText);
					enableDisableAllButtons(false);
					validateAllButtons();
				}
			});
		});
	}
	
	if(_isTemplateMaintainPresent)
	{
		$('#maintainTemplate').click(function(){
			document.location.href=_context+'/booking/template/showTemplateForm?templateNumber=' + $('#bookingTemplateCodeHidden').val();
		});
	}

	if($('#bookingTemplateCodeHidden').val()==''){
		if(_isTemplateMaintainPresent)
			$('#maintainTemplate').attr("disabled",true);
		if(_isTemplateClearPresent)
			$('#clearTemplate').attr("disabled",true);
	}
	
	$('#bookingTemplateCode').change(function(){
		if($('#bookingTemplateCodeHidden').val()!=''){
			/*$('#bookingTemplateCode').val(""); */
			$('#bookingTemplateCodeHidden').val("");
			$('#shipperAbbr').val("");
			$('#templateDesc').text("");
			$('#routingInfo').text("");
			$('#templateEDIQualifier').text("");
		}
		
		if(_isTemplateMaintainPresent)
			$('#maintainTemplate').attr("disabled",false);
		if(_isTemplateClearPresent)
			$('#clearTemplate').attr("disabled",false);
		
		 validateAssignAndClearTemplate();
		
	});
	
	
	
	/*$('#ediAssignTemplate').click(function(){
		enableDisableAllButtons(true);
		if($('#bookingTemplateCodeHidden').val()!=''){
			assignTemplate();
			var canAssignTemplate = false;
			//alert("isCurrentRecord->"+$('#isCurrentRecord').text() + " billExists:->" + $('#billExists').text() + " statusCode:->" + $('#statusCode').text());
			if($('#isCurrentRecord').text()=='Y'){
				if($('#billExists').text()!='Y'){
					if($('#statusCode').text()!='Rejected' &&
							$('#statusCode').text()!='SYS ERR'){
						canAssignTemplate = true;
					}else{
						alert("EDI status code not valid for assigning template.");
					}
				}else{
					alert("Bill Exists for EDI record, cannot assign template.");
				}
			}else{
				alert("EDI current record in not Y, cannot assign template.");
			}
			if(canAssignTemplate){
				assignTemplate();
			}else{
				
				alert("Cannot assign template.");
			}
		}else{
			alert("Please select template to assign.");
		}
	});*/

	/*if($.trim($('#ediShmtRequestId').text())!=''){
		showLoadingMessage('Loading EDI Shipment request');
		displayByEdiID();
	}*/
	
	if($.trim($('#bookingReferenceNumber').text())!=''){
		var bookingRefNo = '';
		if($.trim($("#bookingReferenceNumber").text()) != undefined && $.trim($("#bookingReferenceNumber").text()) != null && $.trim($("#bookingReferenceNumber").text()) != 'null') {
			bookingRefNo = $.trim($("#bookingReferenceNumber").text());
		} else {
			bookingRefNo = '';
		}
		showLoadingMessage('Loading EDI Shipment request '+ bookingRefNo);
		enableDisableAllButtons(true);
		displayEDIShipmentRequest();
	}
	
	if(_isPrintPresent)
	{
		$('#printBookingNotice').click(function() {
			window.open(_context +"/booking/edi/print?print=selected&ediShmtRequestNumber=" + encodeURIComponent($.trim($('#ediShmtRequestId').text())));
			printBookingNoticeEnabled = 'Y';
			$('#isBookingNoticePrint').text(printBookingNoticeEnabled);
			$('#isBookingNoticePrint').css('color', 'black');
		});
	}
	
	if(_isApprovePresent)
	{
		$('#approveEDI').click(function() {
			showLoadingMessage('Approving EDI Booking Reservation');
			enableDisableAllButtons(true);
			$.ajax({
				type: "GET",
				url: _context +"/booking/edi/approve",
				data: {ediShmtRequestId: $.trim($("#ediShmtRequestId").text())},
				success: function(responseText) {
					/*$("#ediProblemLogGrid").trigger('reloadGrid');
					$('#statusCode').text('APPROVED');
					$("#ediProblemLogGrid").trigger('reloadGrid');
					showResponseMessages("msgDiv", responseText);
	
					enableDisableAllButtons(false);
					validateAllButtons();*/
					
					showResponseMessages("msgDiv", responseText);
					if(responseText.success == true){
						showJSON(responseText);
					}
					reloadEDIGrids();
					showResponseMessages("msgDiv", responseText);
					enableDisableAllButtons(false);
					validateAllButtons();
				}
			});
		});
	}
	
	if(_isRejectPresent)
	{
		$('#rejectEDI').click(function() {
			var ediShmtRequestId = $.trim($("#ediShmtRequestId").text());
			showLoadingMessage('Rejecting EDI Booking Reservation');
			enableDisableAllButtons(true);
			$.ajax({
				type: "GET",
				url: _context +"/booking/edi/validateReject",
				data: {ediShmtRequestId: ediShmtRequestId},
				success: function(responseText) {
					if (responseText.messages.success.length > 0) {
						rejectEDI(ediShmtRequestId, '');
					} else if(responseText.messages.error.length > 0) {
						var isConfirm = false;
						isConfirm = confirm("Do you want to enter reason for rejecting EDI Booking Reservation?");
						if (isConfirm == 'true' || isConfirm == true) {
							promptForRejection();
						} else {
							enableDisableAllButtons(true);
							rejectEDI(ediShmtRequestId, '');
						}
					}
				}
			});
		});
	}
	
	if(_isHoldPresent)
	{
		$('#holdEDI').click(function() {
			$('#msgDiv').html('');
			createHoldEDIDialog();
			$('#holdTypeMsg').html('');
			$('#holdTypeMsg').hide();
			$("#holdEDIDialog").dialog('open');
			showEDIHold();
		});
	}
	
	$('#exitEDI').click(function() {
		document.location.href = _context+'/cas/ediBookingQueueSearch.do';
	});
	
	$('#refreshEDI').click(function() {
		enableDisableAllButtons(true);
		showLoadingMessage('Refreshing EDI Shipment request');
		displayEDIShipmentRequest();
	});
	
	if(_isCreatePresent)
	{
		$('#createBooking').click(function() {
			createBooking();
		});
	}
	
	$('#ediShmtRequestId').click(function() {
		document.location.href = _context + "/booking/edi/transmission/showForm?userFrom=ediDetail|" + $.trim($('#bookingReferenceNumber').text()) + "&shmtRequestId=" + $("#ediShmtRequestId").val();
	});
	
	$('#sendBookingNumberConf').click(function() {
		blockUI();
		$.ajax({
			type: "GET",
			url: _context +"/booking/edi/sendIndividualConfirmation",
			data: {ediShipmentRequestId: $('#ediShmtRequestId').text()},
			success: function(responseText){
				if (responseText.messages.error.length == 0) {
					showJSON(responseText);
				//	$('#shipmentNumber').text(responseText.data.);
					showResponseMessages("msgDiv", responseText);
					if(_isConfirmationPresent)
						$('#sendBookingNumberConf').attr("disabled",true);
				}else{
					showResponseMessages("msgDiv", responseText);
					if(_isConfirmationPresent)
						$('#sendBookingNumberConf').attr("disabled",false);
				}
				$.unblockUI();
			}
		});
	});
	
	$('#shipmentNumber').click(function() {
		loadBooking()
	});
	
	
	
	$('#templateSearch').click(function() {
		var actionUrl = _context + '/cas/ediTemplateSearch.do?filterValue1=&data='+$('#templateEDIQualifier').text()+'|'+$('#tradeCode').text() +'|'+$("#templateQualifier").val()+'|'+$('#ediFormat').val()+'|'+$('#tradingPartnerCode').text();
		var windowStyle = 'top=0,left=0,height='+$(window).height()+',width='+$(window).width()+',scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'EDI Template Search', windowStyle);
	});
	/*$('#edi301').click(function(){
		blockUI();
		$.ajax({
			type: "GET",
			url: _context +"/booking/edi/301",
			success: function(responseText){
				$.unblockUI();
			}
		});
	});*/
});		

function loadBooking() {
	document.location.href = _context + '/booking/showForm?userFromMenu=ediBookingDetail_' + $.trim($('#bookingReferenceNumber').text()) + '_' + $.trim($('#ediShmtRequestIdDiv').text()) + '&bookingNumber='+ $('#shipmentNumber').val();
}

function canBookingBeCreatedFromEDIShipment(){
	if($('#ediRequestValidToCreateBooking').val()=='Y'){
		if(_isCreatePresent)
			$('#createBooking').attr("disabled",false);
	}else{
		if(_isCreatePresent)
			$('#createBooking').attr("disabled",true);
	}
}
function showCreateBookingMessage(){
	window.scrollTo(0, 0);
	if($("#shipmentNumber").val()!=''){
		$('#msgDiv').html("<div class=\"message_info\">Updating Booking from EDI Booking Reservation ... </div>");
	}else{
		$('#msgDiv').html("<div class=\"message_info\">Creating Booking from EDI Booking Reservation ... </div>");
	}
	
	$('#msgDiv').show();
}

function createBooking(){
	showCreateBookingMessage();
	blockUI();
	enableDisableAllButtons(true);
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/createBooking",
		data: {
			ediShmtRequestId: $('#ediShmtRequestId').val()
		},
		success: function(responseText){
			if(responseText.success==true){
				showJSON(responseText);
				reloadEDIGrids();
				
				// Send to Booking
				if($('#tradingPartnerCode').text() == 'MTMI') {
					loadBooking();
				}
			}
			showResponseMessages("msgDiv", responseText);
			enableDisableAllButtons(false);
			validateAllButtons();
			$.unblockUI();
		}
	});
}

function rejectEDI(ediShmtRequestId, comments) {
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/reject",
		data: {ediShmtRequestId: ediShmtRequestId, 
				comments: comments,
				commentId: $('#commentId').val()
			  },
		success: function(responseText) {
			if(responseText.messages.success.length > 0) {
				$('#msgDiv').html("<div class=\"message_success\">EDI Booking Reservation rejected successfully</div>");
				$('#msgDiv').show();
				
				$('#statusCode').text('REJECTED');
				enableDisableAllButtons(false);
				validateAllButtons();
			}
			reloadEDIGrids();
		}
	});
}

function promptForRejection() {
	createRejectionMsgDialog();
	$('#rejectErrorMsg').html('');
	$('#rejectErrorMsg').hide();
	$("#rejectMsgDialog").dialog('open');
}

function createRejectionMsgDialog() {
	$("#rejectMsgDialog").dialog({
		autoOpen : false,
		width : 430,
		modal : true,
		title: "Reject Message",
		position: ['center','10'], 
		open : function() {
			$("#rejectMsgDialog").dialog({height: 200});
		},
		close : function() {
			$('#msgDiv').html('');
			$('#msgDiv').hide();
			//$("#rejectMsgDialog").dialog('close');
		},
		buttons:{
			Save:function() {
				isCommentPresent();
			}, 
			Cancel:function() {
				enableDisableAllButtons(false);
				validateAllButtons();
				$("#rejectMsgDialog").dialog('close');
			}
		}
	});
}

function isCommentPresent() {
	var comment = $('#rejectMsg').val();
	if(comment == undefined || $.trim(comment) == '') {
		$('#rejectErrorMsg').html("<div class=\"message_error\">Please enter comments</div>");
		$('#rejectErrorMsg').show();
		$('#rejectMsg').validationEngine('required', true);
	} else {
		$('#rejectErrorMsg').html('');
		$('#rejectErrorMsg').hide();
		rejectEDI($.trim($("#ediShmtRequestId").text()), comment);
		$("#rejectMsgDialog").dialog('close');
	}
}

function createHoldEDIDialog() {
	$("#holdEDIDialog").dialog({
		autoOpen : false,
		width : 450,
		modal : true,
		title: $.trim($('#bookingReferenceNumber').text()) + " EDI BKNG HOLD",
		position: ['center','80'], 
		open : function() {
			$("#holdEDIDialog").dialog({height: 'auto'});
		},
		close : function() {
			$('#holdTypeMsg').html('');
			$('#holdTypeMsg').hide();
			//$("#holdEDIDialog").dialog('close');
		},
		buttons:{
			OK: function() {
				validateEDIHold();
			}, 
			Close: function() {
				$("#holdEDIDialog").dialog('close');
			}
		}
	});
}

function applyHold() {
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/hold",
		data: {ediShmtRequestId: $.trim($("#ediShmtRequestId").text()), 
			holdEdiTypeCode: $("input[name=holdEdiTypeCode]:checked").val()
			  },
		success: function(responseText) {
			if(responseText.messages.success.length > 0) { 
				$('#holdEdiTypeCode').val($("input[name=holdEdiTypeCode]:checked").val());
				if($('#holdEdiTypeCode').val() != undefined && ($.trim($('#holdEdiTypeCode').val()) == 'B' || $.trim($('#holdEdiTypeCode').val()) == 'S')) {
					$('#statusCode').text('HOLD EDI');
				} else {
					$('#statusCode').text('RECEIVED');
				}
			}
			showResponseMessages("msgDiv", responseText);
			validateAllButtons();
		}
	});
	$("#holdEDIDialog").dialog('close');
}

function assignTemplate(){
	showAssigningTemplateMessage();
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/assignTemplate",
		data: {
			ediBkngRefNum: $.trim($('#bookingReferenceNumber').text()),
			templateNumber: $('#bookingTemplateCode').val(),
			statusCode: $('#statusCode').text(),
			ediShipReqId: $('#ediShmtRequestId').val(),
			commentId: $('#commentId').val(),
			isCurrentRecord: $('#isCurrentRecord').text(),
			shipmentNumber: $('#shipmentNumber').text()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
			}
			reloadEDIGrids();
			showResponseMessages("msgDiv", responseText);
			if(responseText.messages.success.length > 0) 
				changeTextColorForTemplateSection('black');
			enableDisableAllButtons(false);
			validateAllButtons();
			//validateCreateBooking();
			canBookingBeCreatedFromEDIShipment();
			$.unblockUI();
		}
	});
}

function clearTemplate(){
	showClearTemplateMessage();
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/clearTemplate",
		data: {
			ediBkngRefNum: $.trim($('#bookingReferenceNumber').text()),
			templateNumber: $('#bookingTemplateCode').val(),
			statusCode: $('#statusCode').text(),
			ediShipReqId: $('#ediShmtRequestId').val(),
			commentId: $('#commentId').val(),
			isCurrentRecord: $('#isCurrentRecord').text(),
			shipmentNumber: $('#shipmentNumber').text()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
				clearTemplateSection();
			}
			reloadEDIGrids();
			showResponseMessages("msgDiv", responseText);
			$.unblockUI();
		}
	});
}

function clearTemplateSection(){
	$('#bookingTemplateCode').val("");
	$('#bookingTemplateCodeHidden').val("");
	$('#shipperAbbr').text("");
	$('#templateDesc').text("");
	$('#routingInfo').text("");
	$('#templateEDIQualifier').text("");
	if(_isTemplateMaintainPresent)
		$('#maintainTemplate').attr("disabled",true);
	if(_isTemplateClearPresent)
		$('#clearTemplate').attr("disabled",true);
}
function showLoadingMessage(message) {
	window.scrollTo(0, 0);
	$('#msgDiv').html("<div class=\"message_info\">" + message +" ...</div>");
	$('#msgDiv').show();
}

function showAssigningTemplateMessage(){
	window.scrollTo(0, 0);
	$('#msgDiv').html("<div class=\"message_info\">Assigning Template to EDI Shipment request "+ $("#bookingReferenceNumber").text() +" ...</div>");
	$('#msgDiv').show();
}

/*function displayByEdiID() {
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/displayEDIShmtRequest",
		data: {ediRequestNumber: $.trim($("#ediShmtRequestId").text()), 
			   showUnResolvedProblem: $('#showUnResolvedProblem').val()},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
				reloadEDIGrids();
			}else{
				$("#ediShmtRequestId").text("");
				setEDIPageTitle(null);	
			}
			showResponseMessages("msgDiv", responseText);
			enableDisableAllButtons(false);
			validatePrintBookingNotice();
			validateApproveEDIEnable();
			validateRejectEDI();
			validateHoldEDI();
		}
	});
}*/

function showClearTemplateMessage(){
	window.scrollTo(0, 0);
	$('#msgDiv').html("<div class=\"message_info\">Clearing Template to EDI Shipment request "+ $("#bookingReferenceNumber").text() +" ...</div>");
	$('#msgDiv').show();
}

function displayEDIShipmentRequest(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/edi/displayEDIRequest",
		data: {ediBkngRefNum: $.trim($("#bookingReferenceNumber").text()),
			   ediShmtRequestId: encodeURIComponent($.trim($('#ediShmtRequestId').text())),
			   showUnResolvedProblem: $('#showUnResolvedProblem').val()},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				printBookingNoticeEnabled = responseText.data.bookingNoticeEnabled; 
				showJSON(responseText);
				reloadEDIGrids();
				createCommentFunc();
			}else{
				$("#ediShmtRequestId").text("");
				setEDIPageTitle(null);	
			}
			showResponseMessages("msgDiv", responseText);
			enableDisableAllButtons(false);
			validateAllButtons();
			canBookingBeCreatedFromEDIShipment();
		}
	});
}

function showJSON(responseText)  {
	if(responseText.data.bookingReferenceNumber != undefined && bookingReferenceNumber != null)
		setEDIPageTitle(responseText.data.bookingReferenceNumber);
	else
		$('#bookingReferenceNumber').text('');
	$("#ediHeaderInfo").loadJSON(responseText.data);
	$('#bookingReferenceNumber').text(responseText.data.bookingReferenceNumber);
	$("#vvd").text(vvd);//responseText.data.vesselCode + responseText.data.voyage + responseText.data.directionSeq);
	$("#ediTemplateHeader").loadJSON(responseText.data);
	
	//Manjeet Sir- please dont delete
	$("#partiesFixedInfo").loadJSON(responseText.data);
	$("#partiesFixedInfo #partiesStatusCode").text(responseText.data.statusCode);
	$('#isShowLink').val(responseText.data.isShowLink);
	
	$('#bookingTemplateCodeHidden').val(responseText.data.bookingTemplateCode);
	$('#printBookingNoticeEnabled').val(printBookingNoticeEnabled);
	$('#isOriginRequireBill').val(responseText.data.isOriginRequireBill);
	$('#holdEdiTypeCode').val(responseText.data.holdEdiTypeCode);
	$('#ediRequestValidToCreateBooking').val(responseText.data.ediRequestValidToCreateBooking);
	//Comment Id
	$("#commentId").val(responseText.data.commentId);
	if($("#bookingTemplateCode").val()!='') {
		if(_isTemplateMaintainPresent)
			$('#maintainTemplate').attr("disabled",false);
		if(_isTemplateClearPresent)
			$('#clearTemplate').attr("disabled",false);
	}
	$("#ediShmtRequestId").val(responseText.data.ediShmtRequestId);
	$("#ediShmtRequestId").text(responseText.data.ediShmtRequestId);
	$("#holdEdiTypeCode").val(responseText.data.holdEdiTypeCode);
	$("#recordTypeCode").val(responseText.data.recordTypeCode);
	$("#shipmentNumber").text(responseText.data.shipmentNumber);
	$("#shipmentNumber").val(responseText.data.shipmentNumber);
//	validateRevalidateButton();
	
	if($.trim($('#shipmentNumber').val()) == '') {
		$('#bookingStatusCode').text('');
	}
	
	if($('#isOriginRequireBill').val() == 'Y' && $('#isBookingNoticePrint').text() != 'Y') {
		$('#isBookingNoticePrint').css('color', 'red');
	} else {
		$('#isBookingNoticePrint').css('color', 'black');
	}
	
	if($.trim($('#bookingStatusCode').text()) != '' &&  $.trim($('#bookingStatusCode').text()) != 'APPR' && $.trim($('#bookingStatusCode').text()) != 'APPROVED') {
		$('#bookingStatusCode').css('color', 'red');
	} else {
		$('#bookingStatusCode').css('color', 'black');
	}

	$("#templateQualifier").val(responseText.data.templateQualifier);
	$("#ediFormat").val(responseText.data.ediFormat);

}

function reloadEDIGrids(){
	$("#ediProblemLogGrid").trigger('reloadGrid');
	$("#ediPartiesGrid").trigger('reloadGrid');
}



function ediTemplateUpdate(id){
	var splitTemplateData = id.split("|");
	var templateShipmentNumber = splitTemplateData[0];
	var description = splitTemplateData[7];
	var blOrigin = splitTemplateData[8];
	var blDest = splitTemplateData[11];
	var origin = splitTemplateData[9];
	var dest = splitTemplateData[10];
	
	if(blOrigin == 'null' || blOrigin == origin) {
		
	} else {
		origin = blOrigin+"-"+origin;
	}
	
	if(blDest == 'null' || blDest == dest) {
		
	} else {
		dest = blDest+"-"+dest;
	}
	
	var routing =  origin+"-"+dest;
	var ediTemplateQualifier = splitTemplateData[12];
	var shipperOrgId = splitTemplateData[13];
	var shipperOrgName = splitTemplateData[14];
	
	$('#bookingTemplateCode').val(templateShipmentNumber);
	$('#bookingTemplateCodeHidden').val(templateShipmentNumber);
	$('#templateDesc').text(description);
	$('#routingInfo').text(routing);
	$('#templateEDIQualifier').text(ediTemplateQualifier);
	$('#shipperAbbr').val(shipperOrgName);
	if(_isTemplateMaintainPresent)
		$('#maintainTemplate').attr("disabled",false);
	
	changeTextColorForTemplateSection('blue');
	validateAssignAndClearTemplate();
	assignTemplate();
}

function formatRouting(id){
	var routing = "";
	var splitTemplateData = id.split("|");
	routing = splitTemplateData[8];
	if(splitTemplateData[9]!="")
		routing = routing +"-"+ splitTemplateData[9];
	if(splitTemplateData[10]!="")
		routing = routing +"-"+splitTemplateData[10];
	if(splitTemplateData[11]!="")
		routing = routing + "-" + splitTemplateData[11];
	return routing;
}

function orgSearchUpdate(id) {
	var values = id.split("|");
	$('#shipperAbbr').val(values[0] +"-"+ values[1]);
}

function shipperPopupSearch() {
	var shipperName = $('#shipperAbbr').val();
	var splitShipperName = "";
	var actionUrl = "";
	if(shipperName.indexOf("-") > 0){
		splitShipperName = shipperName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=||BK|||'+ encodeURIComponent(splitShipperName[1]);
	}else{
		splitShipperName = shipperName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+ shipperName + '||BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function templatePredictive(){/*
	var url =	_context+'/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch=T';
	$('#bookingTemplateCode').gatesAutocomplete({
		source: url,
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			$('#bookingTemplateCode').val(data.shno);
			$('#bookingTemplateCodeHidden').val(data.shno);
			$('#maintainTemplate').attr("disabled",false);
			$('#clearTemplate').attr("disabled",false);
		}
	});*/
}

function createMainPartiesGrid() {
	
	var colNames = ['Id','Accept','Party','Template','EDI','Action'];
	
	var colModel = [
	                {name:'partySeqNo', hidden:true},
	                {name:'isAccept', hidden:true},
			    	{name:'partyDesc',index:'partyDesc', width:150},
			    	{name:'template',index:'template', width:295},
			    	{name:'edi',index:'edi', width:295},
			    	{name:'link', sortable:false, width:150, align : 'center',
			    		formatter:'enableDisableMainFormatter'
			    	},
	               ];
	
	jQuery.extend($.fn.fmatter,
			{
				enableDisableMainFormatter : function(cellvalue, options, rowdata) {
					if(cellvalue!=null)
					{
						if(_isPartiesUpdate && $('#isShowLink').val()=='Y')
							return "<a href='javascript:changePartyStatusFunction("
								+ rowdata.partySeqNo + ", 0);' style='color:black; font-weight:bold;' >"+cellvalue+"</a>";
						else
							return "<div style='color:grey; text-decoration:underline; font-weight:normal;' >"+cellvalue+"</div>";
					}
					else
						return "";
				}
			});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "partySeqNo"
		};

		createGrid("ediPartiesGrid", // grid id for party
		"ediPartiesPager", // page id for party
		_context+'/booking/edi/parties/loadParties', // geturl
		'', // addurl
		'', // edit url
		'',
		'',// delete selected URL
		colNames, colModel, "Parties",// caption
		138,// height
		6,// row num
		[ 6, 12, 18 ],// row list
		false,// multiselect
		false,// multidelete
		false,// load once
		true, // read only grid
		jsonReader, // json reader
		true, // hide edit
		true, // hide delete
		true, // autowidth
		false, // rownumbers
		true, // hide custom add row
		false,// hide pager row
		null,// custom edit method
		partiesMainGridComplete,// custom grid complete
		null,// custom load complete
		false,// default hidden
		true);// row color based on status
		
}

var partiesMainGridComplete = function() {
	$('#gbox_ediPartiesGrid .ui-pg-input').attr("readonly", true);
	 
	 /*var rowIDs = jQuery("#ediPartiesGrid").getDataIDs();
	 for (var i=0;i<rowIDs.length;i=i+1)
    { 
      var rowData=jQuery("#ediPartiesGrid").getRowData(rowIDs[i]);
      if (rowData.isAccept=='Y')
      {
   	   $("div.accept", "#gbox_ediPartiesGrid #"+rowIDs[i]).attr("disabled", true);
   	   $("div.undoAccept", "#gbox_ediPartiesGrid #"+rowIDs[i]).attr("disabled", false);
      }
      else
	   {
   	   	$("div.accept", "#gbox_ediPartiesGrid #"+rowIDs[i]).attr("disabled", false);
   	   	$("div.undoAccept", "#gbox_ediPartiesGrid #"+rowIDs[i]).attr("disabled", true);
	   }
    }*/
	 
};

function createProblemLogGrid() {

	var colNames = ['Id', 'Type', 'Discrepancy', 'Template Value', 'EDI Value', 'Problem', ''];
	var colModel = [
	                {name:'id.sequenceNumber', index:'id.sequenceNumber', hidden:true},
	                {name:'ediProblemTypeCode',index:'ediProblemTypeCode', width:33},
	                {name:'dataElement',index:'dataElement', width:90},
	                {name:'bookingDataElementValue',index:'bookingDataElementValue', width:100},
	                {name:'ediDataElementValue',index:'ediDataElementValue', width:80},
	                {name:'description',index:'description', width:400}, 
	                {name:'resolveUser',index:'resolveUser', hidden:true}
	               ];
	
	createGrid(
			"ediProblemLogGrid",
			"ediProblemLogPager",
			_context+'/booking/edi/loadProblemLog', 
			'', 
			'', 
			'', 
			'',
			colNames, 
			colModel, 
			'Problem Log For EDI',
			115, 
			'5',
			[5,10,15],
			false, false, false, false,
			jsonProblemLogReader,
			false,true,true,false,true,false,false,false,
			problemLogLoadComplete,false,true);
}

var jsonProblemLogReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "id.sequenceNumber"
};

var problemLogLoadComplete = function() {
	$('table[aria-labelledby="gbox_ediProblemLogGrid"] thead tr[id="tr_id.sequenceNumber"]').hide();
		var dataIDs = jQuery('#ediProblemLogGrid').getDataIDs();
		for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
			var resolve_user = $.trim(jQuery("#ediProblemLogGrid").getRowData(dataIDs[rowId]).resolveUser);
			var problem_type = $("#ediProblemLogGrid").jqGrid('getCell', dataIDs[rowId], 'ediProblemTypeCode');
			if(problem_type == 'R' && resolve_user != '') { 
				jQuery('#ediProblemLogGrid tr#' + dataIDs[rowId] + ' td').css('color', 'blue');
			} else {
				jQuery('#ediProblemLogGrid tr#' + dataIDs[rowId] + ' td').css('color', 'black');
			}
			enableDisableAllButtons(false);
			validateAllButtons();
		}
	
};

function setEDIPageTitle(ediShmtNumber){
	window.location.hash = ""+new Date().getTime();
	var title = $('title').text().split("-");
	if(ediShmtNumber!=null && ediShmtNumber!=''){
		document.title = title[0]+" - "+ediShmtNumber;
	}
	else{
		document.title = title[0];
	}
}

function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
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
			window.scrollTo(0, 0);
  	}
}

function enableDisableAllButtons(showDisabled) {
	var footerButtonIds = ['printBookingNotice', 'holdEDI', 'sendBookingNumberConf', 'approveEDI', 'rejectEDI', 'reValidateEDI', 'createBooking', 'partiesButton', 'clearTemplate'];
	
	for (var i=0; i<footerButtonIds.length; i++) {
		
		var isPresent = false;
		
		if((footerButtonIds[i] == 'printBookingNotice' && _isPrintPresent) || 
		(footerButtonIds[i] == 'holdEDI' && _isHoldPresent) || 
		(footerButtonIds[i] == 'sendBookingNumberConf' && _isConfirmationPresent) || 
		(footerButtonIds[i] == 'approveEDI' && _isApprovePresent) || 
		(footerButtonIds[i] == 'rejectEDI' && _isRejectPresent) || 
		(footerButtonIds[i] == 'reValidateEDI' && _isRevalidatePresent) || 
		(footerButtonIds[i] == 'createBooking' && _isCreatePresent) || 
		(footerButtonIds[i] == 'partiesButton' && _isPartiesDisplay) || 
		(footerButtonIds[i] == 'clearTemplate' && _isTemplateClearPresent))
			isPresent = true;
			
		if(isPresent)
			$("#" + footerButtonIds[i]).attr("disabled", showDisabled);
	}
}	

function validateAllButtons() {
	validateAssignAndClearTemplate();
	validateClearTemplate();
	validateApproveEDIEnable();
	validateRejectEDI();
	validateRevalidateButton();
	validateHoldEDI();
	validateSendBkngConfirm();
	validatePrintBookingNotice();
	validateCreateBooking();
	createCommentFunc();
	validateAssignTemplate();
}

function showEDIHold() {
	var holdTypeCode = $.trim($('#holdEdiTypeCode').val());
	if(holdTypeCode != undefined) {
		if(holdTypeCode == 'S') {
			$('#holdEdiTypeCode1').attr('checked', 'checked');
		} else if(holdTypeCode == 'B') {
			$('#holdEdiTypeCode2').attr('checked', 'checked');
		} else {
			$('#holdEdiTypeCode3').attr('checked', 'checked');
		}
	}
}

function validateEDIHold() {
	var existingHoldType = $.trim($('#holdEdiTypeCode').val());
	var newHoldType = $.trim($("input[name=holdEdiTypeCode]:checked").val());
	if(existingHoldType == newHoldType && (existingHoldType == 'B' || existingHoldType == 'S')) {
		$('#holdTypeMsg').html("<div class=\"message_error\">You cannot apply same hold on the Booking. <BR>Please choose another Hold Type</div>");
		$('#holdTypeMsg').show();
	} else if(existingHoldType == newHoldType && existingHoldType == '') {
		$('#holdTypeMsg').html("<div class=\"message_error\">This booking is already having no hold.<BR>Please click Cancel to Exit</div>");
		$('#holdTypeMsg').show();
	} else {
		$('#holdTypeMsg').html('');
		$('#holdTypeMsg').hide();
		applyHold();
	}
}

/*function sendConfirmation(){
	if($('#shipmentNumber').val()==null || $('#shipmentNumber').val()==''){
		if($('#statusCode').text()=='RECEIVED'||('#statusCode').text()=='APPROVED'){
			var billReqd=$('#isOriginRequireBill').val();
			if(billReqd=='Y' && $('#isBookingNoticePrint').text()=='Y'){
				sendConfirmationforRequestId();
			}else if(billReqd=='N'){
				sendConfirmationforRequestId();
			}else{
				showInfoMessage('nsgDiv','Bill Print is Required.');
				//alert("Bill Print is Required.");
				return false;
			}
		}else{
			showInfoMessage('msgDiv','Status should be either Approved or Received.');
			//alert("Status should be either Approved or Received.");
			return false;
		}
	}else{
		showInfoMessage('msgDiv','Booking Confirmation has already been assigned to the EDI request.');
		//alert("Booking Confirmation already attached.");
		return false;
	}
}*/


function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
}

function validateRevalidateButton() {
	
	if($("#isCurrentRecord").text() != 'Y' 
		|| $("#billExists").text() == 'Y' 
		|| ($.trim($('#shipmentNumber').val()) != ''  
			&& ($('#recordTypeCode').val() == 'W' 
				&& ($('#bookingStatusCode').text() != 'CANCEL' 
					&& $('#bookingStatusCode').text() != 'INCOMPLETE'
					&& $('#bookingStatusCode').text() != 'ASSIGN')	
				|| ($('#recordTypeCode').val() != 'W' 
					&& $('#bookingStatusCode').text() != 'INCOMPLETE'
					&& $('#bookingStatusCode').text() != 'CANCEL')))) {
		if(_isRevalidatePresent)		
			$('#reValidateEDI').attr("disabled",true);
	} else {
		if(_isRevalidatePresent)
			$('#reValidateEDI').attr("disabled",false);
	}
}

function validateApproveEDIEnable() {
	var disableButton = true;
	if($('#ediFormat').val() == '301') {
		disableButton = true; // D028673
	
	} else if($('#statusCode').text() != 'RECEIVED' 
		|| $('#isCurrentRecord').text() != 'Y' 
		|| $('#billExists').text() == 'Y' 
		|| ($('#isOriginRequireBill').val() == 'Y' 
			&& $('#isBookingNoticePrint').text() != 'Y')
		|| ($('#shipmentNumber').val() != '' 
			&& (($('#recordTypeCode').val() == 'W' 
			&& ($('#bookingStatusCode').text() != 'CANCEL' 
				&& $('#bookingStatusCode').text() != 'INCOMPLETE'
				&& $('#bookingStatusCode').text() != 'ASSIGN'))	
			|| ($('#recordTypeCode').val() != 'W'  
				&& $('#bookingStatusCode').text() != 'INCOMPLETE'
				&& $('#bookingStatusCode').text() != 'CANCEL')))) {
		
		disableButton = true;
	} else {
		disableButton = false;
	}
	if(disableButton != true)
		disableButton = isErrorAndUnResolvedReviewProblemExists();
	if(_isApprovePresent)
		$('#approveEDI').attr("disabled", disableButton);
	
	if(_isCreatePresent)
		$('#createBooking').attr("disabled", disableButton);
}

function validateRejectEDI() {
	if($('#ediFormat').val() == '301') {
		$('#rejectEDI').attr("disabled", true); // D028673
	
	} else if($('#statusCode').text() == 'REJECTED'
		|| $('#isCurrentRecord').text() != 'Y' 
		|| ($('#shipmentNumber').val() != '' 
			&& (($('#recordTypeCode').val() == 'W' 
				&& ($('#bookingStatusCode').text() != 'CANCEL' 
					&& $('#bookingStatusCode').text() != 'INCOMPLETE'
					&& $('#bookingStatusCode').text() != 'ASSIGN'))	
				|| ($('#recordTypeCode').val() != 'W'  
					&& $('#bookingStatusCode').text() != 'INCOMPLETE'
					&& $('#bookingStatusCode').text() != 'CANCEL')))) {
		if(_isRejectPresent)
			$('#rejectEDI').attr("disabled", true);
	} else {
		if(_isRejectPresent)
			$('#rejectEDI').attr("disabled", false);
	}
}

function validatePrintBookingNotice() {
	if(_isPrintPresent)
	{
		if($('#printBookingNoticeEnabled').val() != undefined && $('#printBookingNoticeEnabled').val() == "Y")
			$('#printBookingNotice').attr("disabled", false);
		else
			$('#printBookingNotice').attr("disabled", true);	
	}
}


function validateAssignTemplate() {
	/*
	1. EDI_SHIPMENT_REQUEST.STATUS = "REJECTED" or "SYSERR" 
	2.EDI_SHIPMENT_REQUEST.STATUS = "BOOKED" and booking status is not equal
	to CANC
	3. If bill already exist (Bill_Exists = 'Y')
	4.  If EDI record is not the current record.
	*/
	
	

	 if( $('#statusCode').text() == 'REJECTED' 
		|| $('#statusCode').text() == 'SYS ERR'
		|| ( $('#statusCode').text() == 'BOOKED' && $('#bookingStatusCode').text() == 'APPROVED')
		|| $('#isCurrentRecord').text() != 'Y' 
		|| $('#billExists').text() == 'Y' ) {

		 console.log("template disabled by status");
		 $('#ediTemplateHeader').gatesDisable();
	 } else if(_isTemplateApply) {
		 console.log("template enabled by status");
		 $('#ediTemplateHeader').gatesEnable();
		 // Need to handle the hyperlink
		 if($("#templateSearch").length == 0) {
			 $( "#templateSerachImage" ).wrap( "<a href=\"#\" id=\"templateSearch\" ></a>" );
			 $('#templateSearch').click(function() {
					var actionUrl = _context + '/cas/ediTemplateSearch.do?filterValue1=&data='+$('#templateEDIQualifier').text()+'|'+$('#tradeCode').text() +'|'+$("#templateQualifier").val()+'|'+$('#ediFormat').val()+'|'+$('#tradingPartnerCode').text();
					var windowStyle = 'top=0,left=0,height='+$(window).height()+',width='+$(window).width()+',scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
					window.open(actionUrl, 'EDI Template Search', windowStyle);
			});
		 }
	 }
	
	
}

function validateHoldEDI() {
	if($('#ediFormat').val() == '301') {
		$('#holdEDI').attr("disabled", true); // D028673
	}else if(($('#statusCode').text() != 'APPROVED' 
		&& $('#statusCode').text() != 'RECEIVED'
		&& ($('#statusCode').text() == 'REJECTED' 
			|| $('#statusCode').text() == 'SYS ERR')  
		|| ($('#statusCode').text() == 'BOOKED'
			&& $('#bookingStatusCode').text() != 'CANCEL'))
		|| $('#isCurrentRecord').text() != 'Y' 
		|| $('#billExists').text() == 'Y'
		|| ($('#isOriginRequireBill').val() == 'Y' 
			&& $('#isBookingNoticePrint').text() != 'Y')) {
		
		if(_isHoldPresent)
			$('#holdEDI').attr("disabled", true);
	} else {
		if(_isHoldPresent)
			$('#holdEDI').attr("disabled", false);
	}
}

function validateSendBkngConfirm() {

	
	if($.trim($('#shipmentNumber').val()) != ''  
		|| $('#isCurrentRecord').text() != 'Y' 
		|| $('#statusCode').text() == 'ASSIGNED'
		|| $('#statusCode').text() == 'HOLD EDI'
		|| $('#statusCode').text() == 'SYS ERR'
		|| $('#statusCode').text() == 'REJECTED' 
		|| $('#statusCode').text() == 'FAILED' 
		|| $('#statusCode').text() == 'BOOKED'
		|| $('#tradeCode').text() == ''
		|| ($('#isOriginRequireBill').val() == 'Y' 
			&& $('#isBookingNoticePrint').text() != 'Y')) {
		
		$('#sendBookingNumberConf').attr("disabled", true);
	} else {
		$('#sendBookingNumberConf').attr("disabled", false);
	}
}

function validateAssignAndClearTemplate() {
	if(($('#statusCode').text() == 'BOOKED' && $('#bookingStatusCode').text() != 'CANCEL') 
		|| $('#billExists').text() == 'Y'
		|| $("#isCurrentRecord").text() != 'Y') {
		
			$('#ediAssignTemplate').html('Assign Template');
			$('#ediAssignTemplate').css('color', 'grey');
			$('#ediAssignTemplate').css('text-decoration', 'underline');
			$('#ediAssignTemplate').css('font-weight', 'normal');
			$('#clearTemplate').attr("disabled", true);
	} else {
		if($.trim($("#bookingTemplateCode").val()) != '') {
			$('#ediAssignTemplate').html('<a href="javascript:assignTemplate();">Assign Template</a>');
			$('#clearTemplate').attr("disabled", false);
		} else {
			$('#ediAssignTemplate').html('Assign Template');
			$('#ediAssignTemplate').css('color', 'grey');
			$('#ediAssignTemplate').css('text-decoration', 'underline');
			$('#ediAssignTemplate').css('font-weight', 'normal');
			$('#clearTemplate').attr("disabled", true);
		}
	}
}

function validateClearTemplate() {
	if(_isTemplateClearPresent)
	{
		validateAssignAndClearTemplate();
		/*if($('#bookingTemplateCodeHidden').val()!='' && $('#isCurrentRecord').text()=='Y' && $('#billExists').text()!='Y' 
			&& $('#statusCode').text()!='Rejected' && $('#statusCode').text()!='SYS ERR') {
			$('#clearTemplate').attr("disabled", false);
		} else {
			$('#clearTemplate').attr("disabled", true);
		}*/
	}
}

function validateSendBkngConfirmOld() {
	if($('#shipmentNumber').val() != undefined && $.trim($('#shipmentNumber').val()) != '' 
		|| ($('#statusCode').text() == 'ASSIGNED' 
			||$('#statusCode').text() == 'HOLD EDI'
			||$('#statusCode').text() == 'REJECTED'
			||$('#statusCode').text() == 'FAILED'
			||$('#statusCode').text() == 'BOOKED'	
			||$('#statusCode').text() == 'SYS ERR') 
		|| $("#isCurrentRecord").text() != 'Y'  
		|| $.trim($('#tradeCode').text()) == ''  
		|| ($('#isOriginRequireBill').val() == 'Y' 
			&& $('#isBookingNoticePrint').text() != 'Y')) {
		
		if(_isConfirmationPresent)
			$('#sendBookingNumberConf').attr("disabled", true);
	} else {
		if(_isConfirmationPresent)
			$('#sendBookingNumberConf').attr("disabled", false);
	}
}
			
function validateCreateBooking() {
	var disableButton = true;
	if(($('#statusCode').text() != 'RECEIVED' && $('#statusCode').text() != 'APPROVED') 
		|| $('#isCurrentRecord').text() != 'Y' 
		|| $('#billExists').text() == 'Y' 
		|| ($('#isOriginRequireBill').val() == 'Y' 
			&& $('#isBookingNoticePrint').text() != 'Y')
		|| ($('#shipmentNumber').val() != '' 
			&& (($('#recordTypeCode').val() == 'W' 
			&& ($('#bookingStatusCode').text() != 'CANCEL' 
				&& $('#bookingStatusCode').text() != 'INCOMPLETE'
				&& $('#bookingStatusCode').text() != 'ASSIGN'))	
			|| ($('#recordTypeCode').val() != 'W'  
				&& $('#bookingStatusCode').text() != 'INCOMPLETE'
				&& $('#bookingStatusCode').text() != 'CANCEL')))) {
		
		disableButton = true;
	} else {
		disableButton = false;
	}
	if(disableButton != true)
		disableButton = isErrorAndUnResolvedReviewProblemExists();
	
	if(_isCreatePresent)
		$('#createBooking').attr("disabled", disableButton);
}

function isErrorAndUnResolvedReviewProblemExists() {
	var problemExist = false;
	var dataIDs = jQuery('#ediProblemLogGrid').getDataIDs();
	for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
		var resolve_user = $.trim(jQuery("#ediProblemLogGrid").getRowData(dataIDs[rowId]).resolveUser);
		var problem_type = $("#ediProblemLogGrid").jqGrid('getCell', dataIDs[rowId], 'ediProblemTypeCode');
		if(problem_type == 'E' || (problem_type == 'R' && resolve_user == '')) { 
			problemExist = true;
			break;
		} else {
			problemExist = false;
		}
	}
	return problemExist;
}

function setUnResolvedProblem() {
	if($('#showUnResolvedProblem').val() == 'Y') {
		$('#showUnResolvedProblem').attr('checked', true);
	} else {
		$('#showUnResolvedProblem').attr('checked', false);
	}
}

function showUnResolvedProblem() {
	if ($('#showUnResolvedProblem').is(':checked')) {
		$('#showUnResolvedProblem').val('Y');
	} else {
		$('#showUnResolvedProblem').val('N');
	}
}

function changeTextColorForTemplateSection(color) {
	$('#bookingTemplateCode').css('color', color);
	$('#shipperAbbr').css('color', color);
	$('#templateEDIQualifier').css('color', color);
	$('#routingInfo').css('color', color);
	$('#templateDesc').css('color', color);
	$('#ediShipperName').css('color', color);
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}

function createCommentFunc() {
	if(_isCommentsDisplay && _isCommentsAdd)
	{
		var args = {
			entityType: 'ESRQ',
			entityId: $('#ediShmtRequestId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'EDIBKOUT,FACTHOLD',
			commentTypesForGrid: 'EDIBKOUT,FACTHOLD,EDIBKIN,EDIBKSYS'
		   };
		getCommentTypes(args);
	}
	else if(_isCommentsDisplay && !_isCommentsAdd)
	{
		var args = {
			entityType: 'ESRQ',
			entityId: $('#ediShmtRequestId').val(),
			commentId: 'commentId',
			displayCommentTypes: ''
		   };
		getCommentTypes(args);
	}
	/*var args = {
			entityType: 'ESRQ',
			entityId: $('#ediShmtRequestId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'EDIBKOUT,FACTHOLD',
			commentTypesForGrid: 'EDIBKOUT,FACTHOLD,EDIBKIN,EDIBKSYS'
		   };
		$("#comment_link").comments(args);*/
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'ESRQ',
			contextScreen: 'ediBookingDetail'
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
				args.commentTypesForGrid=string;
				$("#comment_link").comments(args);
		
			}
		}
	});
}
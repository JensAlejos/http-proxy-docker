var hasChanged = "N";
var lastChangeSource = "";
var firstLoad;

$(document).ready(function () {
	
	//$('#selectButtonDiv').hide();
	
	$("#convCgoApptCutoffDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			hasChanged = "Y";
		}
	});

	$("#convCgoEstArrivalDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			hasChanged = "Y";
		}
	});
	
	$("#requiredDeliveryDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			hasChanged = "Y";
		}
	});
	
	var bookingIndex = $.trim($('#bookingIndex').val());
	if(bookingIndex != undefined && bookingIndex != '') {
		$('#bookingIndex').val(bookingIndex);
	} else {
		$('#bookingIndex').val(0);
	}
	enableDisableButtons();	

	showMsg();
	
	createEastContainerisedGrid();
	createWestContainerisedGrid();
	createNonContainerisedGrid();
	
	$('#shipmentIdHeader').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  function() { return 'B'; }
	 	},
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			showLoadingMessage('Loading Booking Wiredown  ...');
			displayWiredown();
		}
	});
	
	$('#shipmentIdHeader').bind('keydown', function(event) {
		//keyCode for enter key is 13 and for tab out is 9
		if(event.keyCode == 13 || event.keyCode == 9) {
			if($('#shipmentIdHeader').val()!=''){
				$('#shipmentNumber').val($('#shipmentIdHeader').val());
				clearForm();
				showLoadingMessage('Loading Booking Wiredown  ...');
					displayWiredown();
			} 
		}
    });
	
	$('#shipmentIdHeader').bind('blur', function(event) {
			if($.trim($('#shipmentIdHeader').val()) == '') {
				clearForm();
				onclickButtonDisable();
			} 
    });
	
	createRollVVDGrid();
	createRollVVDRoutingDialog();
	
	//Display Unreleased Holds Grid on initial display
	openUnreleasedHoldGridOnIntialDisplay("wiredown");
	
	//Dispatch
	$('#dispatchRequest').click(function() {
		$.ajax({
			url: _context +"/wiredownMaintenance/dispatchRequest",
			data: {prevURL: $.trim($('#prevURL').val())},
			success: function(responseText){
				document.location.href = '../createdispatch/loadDispatchRequestByShipmentTemplateID?userFromMenu=wiredown&id=' + $('#shipmentNumber').val() + '&shipmentTemplateId=null';
			}
		});
		
		// window.open(_context + "/createdispatch/loadDispatchRequestByShipmentTemplateID?id=" + shipmentNumber + "&shipmentTemplateId=null");
	});

	//SendDoc
	$('#sendDoc').click(function() {
		document.location.href = _context+"/booking/senddocument/create?nav=wiredown&bookingId="+$("#shipmentNumber").val();
	});

	//Previous Wiredown
	$('#prevWiredown').click(function() {
		showLoadingMessage('Loading previous Booking Wiredown  ...');
		$("#prevWiredown").attr("disabled", true);
		$("#nextWiredown").attr("disabled", true);
		onclickButtonDisable();
		
		//enableDisableButtons();
		var index = $('#bookingIndex').val();
		var bookingIndex = parseInt(index) - 1;
		
		document.location.href = '../wiredownMaintenance/prevWiredown?bookingIndex=' + bookingIndex;
	});

	//Next Wiredown
	$('#nextWiredown').click(function() {
		showLoadingMessage('Loading next Booking Wiredown  ...');
		$("#prevWiredown").attr("disabled", true);
		$("#nextWiredown").attr("disabled", true);
		onclickButtonDisable();
		
		var index = $('#bookingIndex').val();
		var bookingIndex = parseInt(index) + 1;
		//enableDisableButtons();
		document.location.href = '../wiredownMaintenance/nextWiredown?bookingIndex=' + bookingIndex;
	});
	
	//Roll VVD
	$('#rollVVD').click(function() {
		
		$.ajax({
			url: _context +"/wiredownMaintenance/showVVDDetails",
			success: function(responseText){
				if(responseText.success)
				{
					$("#vvdWiredownRouting").loadJSON(responseText.data.routing);
					$("#requiredDeliveryDate").val(responseText.data.requiredDeliveryDate);
					if($('#loadDschServiceGroupCode').val() == 'CON' || $('#loadDschServiceGroupCode').val() == 'LCL') {
						$('#vvd_conventional').show();
					} else {
						$('#vvd_conventional').hide();
					}
					$("#vvdWiredownRouting").dialog('open');
				}
				else
					$('#msgDiv').html('<div class="message_error">An error has occurred while loading VVD Details</div>');
			}
		});
	});
	
	$('#vvdChangeAuthPartyCode').change(
	   function()
	   {
		  /*if($('#status').text() == 'INCP' || lastChangeSource=='')
		  {*/
			   if(($('#vessel').val()=='' || $('#voyage').val()=='' || $('#direction').val()=='')
					   && $('#vvdChangeAuthPartyCode :selected').val()!='')
			   {
				   $('#vvdChangeAuthPartyCode').val('');
				   $('#rollVVDMsgDiv').html('<div class="message_error">Change Source not allowed</div>');
			   }
			   else if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) == 
						($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text()))
			   {
					$('#vvdChangeAuthPartyCode').val('');
					$('#rollVVDMsgDiv').html('<div class="message_error">Change Source not allowed</div>');
			   }
		 /* }
		  else
		  {
			  $('#vvdChangeAuthPartyCode').val(lastChangeSource);
			  $('#rollVVDMsgDiv').html('<div class="message_error">Change Source cannot be changed</div>');
		  }*/
	   });
	
	// Cancel Booking
	$('#cancelBooking').click(function() {
		showLoadingMessage('Booking cancellation in progress ...');
		var wiredownForm = $('#wiredownForm').formSerialize();
		var urlStr = _context + "/wiredownMaintenance/cancelBooking";
		$.ajax({
			type: "POST",
			url: urlStr,
			data: wiredownForm,
			success: function(responseText){
				if(responseText.success){
					$('#status').text('CANC');
				}
				enableDisableButtons();
				onclickButtonEnable();
				showResponseMessages("msgDiv", responseText);
			}
		});
	});

	//Exit Wiredown
	$('#exitWiredown').click(function() {
		
		var eastGridVal = dataUpdated('containerizedEastGrid');
		var westGridVal = dataUpdated('containerizedWestGrid');
		var nonContainerizedVal = dataUpdated('nonContainerizedGrid');
		
		if(eastGridVal == 'true' || westGridVal == 'true' || nonContainerizedVal == 'true') {
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				exitFromWiredown();
			}
		} else {
			exitFromWiredown();
		}
		
	});
		
	// adding comment code
	$('#commentsDiv').show();
	
	
	if(isHistoryDisplayOnly) 
	{
		$('#historyDiv').show();
	}
	else 
	{
		$('#historyDiv').hide();
	}
	
	/*var args = {
			entityType: 'BKNG',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:''
		   };
	getCommentTypes(args);*/
	
	if($.trim($('#shipmentIdHeader').val()) != '') {
		createCommentFunc();
	}
	
	$('.dataChanged').change(function() {
		hasChanged = "Y";
	});
	
	if($.trim($('#shipmentIdHeader').val()) == '') {
		onclickButtonDisable();
	}
	
	manageGridvisibility($("#containerizedEastGridSize").val(), $("#containerizedWestGridSize").val(), $("#nonContainerizedGridSize").val());
	
	enforceUserSecurityRolesAndPermissions();
	$('#shipmentIdHeader').focus();
	
	$('#prevURL').val(document.location.href);
	if($('#displayDispatch').val() == 'true'){
		$('#dispatchRequest').attr('disabled', false);
	}else{
		$('#dispatchRequest').attr('disabled', true);
	}
	
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

	function clearForm() {
		$('#bookingId').val('');
		$('#placeOfReceipt').text('');
		$('#shipper').text('');
		$('#consignee').text('');
		$('#status').text('');
		$('#portOfLoading').text('');
		$('#careOfShipper').text('');
		$('#careOfConsignee').text('');
		$('#wiredownVVD').text('');
		$('#portOfDischarge').text('');
		$('#shipperAddress').text('');
		$('#consigneeAddress').text('');
		$('#trade').text('');
		$('#placeOfDelivery').text('');
		$('#shipperContact').text('');
		$('#consgneeContact').text('');
		$('#customerGroup').text('');
		$('#loadDischarge').text('');

		$('#msgDiv').hide();
		$('#msgDiv').html('');
		
		$('#eastGridTitle').hide();
		jQuery('#eastGrid').jqGrid('clearGridData');
		$('#eastGrid').hide();
		
		$('#westGridTitle').hide();
		jQuery('#nonContainerisedGrid').jqGrid('clearGridData');
		$('#westGrid').hide();
		
		$('#nonContainerisedTitle').hide();
		jQuery('#nonContainerisedGrid').jqGrid('clearGridData');
		$('#nonContainerisedGrid').hide();
		
	}

	var customloadLoad = function(){
		//$('.ui-inline-edit').show();
		$('.ui-inline-del').hide();
		$('tr#tr_seqNo').hide();
		if($("#containerizedEastGridSize").val() > 0) {  
			manageInlineEditVisibility('containerizedEastGrid', 'equipmentType','bookingFrtEqpRqmtId');
		} else if($("#containerizedWestGridSize").val() > 0) {
			manageInlineEditVisibility('containerizedWestGrid', 'equipmentType','bookingFrtEqpRqmtId');
		} 
		if($("#nonContainerizedGridSize").val() > 0) {
			manageInlineEditVisibility1('nonContainerizedGrid', 'commodityNo');
		}
		
		enforceSecurityOnWiredownGrid(); 
	};
	
	function manageInlineEditVisibility(gridId, colName,colName1) {
		//var colName1 ='bookingFrtEqpRqmtId';
		var count=0;
		var count1=0;
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var rowId = 1; rowId <= dataIDs.length ; rowId++) {
			var colValue1 = $('#' + gridId).jqGrid('getCell', rowId, colName1);
			var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
			if(colValue == '' || colValue == ' ' || colValue1 == '' || colValue1 == ' '){
				//$("tr#"+$.jgrid.jqID(rowId)+ " div.ui-inline-edit").hide();	
				$('#'+gridId +' tbody tr#'+rowId+' div.ui-inline-edit').hide();
			}else {
				//$("tr#"+$.jgrid.jqID(rowId)+ " div.ui-inline-edit").show();
				$('#'+gridId +' tbody tr#'+rowId+' div.ui-inline-edit').show();
			}
			var colValuecount=0;			
			var colValueContainer =$('#' + gridId).jqGrid('getCell', rowId, 'containerNumber');
			colValuecount =$('#' + gridId).jqGrid('getCell', rowId, 'bookedContainer');
			///if(colValuecount!='' && colValuecount!=0 && colValueContainer!='' && colValueContainer!='* Not Rec *' )
			if(colValuecount!='' && colValuecount!=0 && colValueContainer!='')
			{
			count= parseInt(colValuecount)+parseInt(count);
			}
			colValuecount =$('#' + gridId).jqGrid('getCell', rowId, 'receivedContainer');
			if(colValuecount!=''&& colValuecount!=0 && colValueContainer!='' && colValueContainer!='* Not Rec *')
			{
			count1= parseInt(colValuecount)+parseInt(count1);
			}
		}
		var caption='';
		if(gridId!='' && gridId=='containerizedEastGrid')
		{
		caption= "Eastbound container receipts- BKD::"+count+" /RCVD::"+count1;
		}
		if(gridId!='' && gridId=='containerizedWestGrid')
		{
		caption= "Westbound container receipts- BKD::"+count+" /RCVD::"+count1;
		}
	
		$('#'+ gridId).jqGrid('setCaption', caption);
		
	}
	
	
	function manageInlineEditVisibility1(gridId, colName) {
		var count=0;
		var count1=0;
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var rowId = 1; rowId <= dataIDs.length ; rowId++) {
			var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
			if(colValue == '' || colValue == ' ' ){ 
				$('#'+gridId +' tbody tr#'+rowId+' div.ui-inline-edit').hide();
				//$("tr#"+$.jgrid.jqID(rowId)+ " div.ui-inline-edit").hide();	
			}else {
				//$("tr#"+$.jgrid.jqID(rowId)+ " div.ui-inline-edit").show();
				$('#'+gridId +' tbody tr#'+rowId+' div.ui-inline-edit').show();
			}
			var colValuecount=0;
			colValuecount =$('#' + gridId).jqGrid('getCell', rowId, 'bookedContainer');
			if(colValuecount!='' && colValuecount!=0  )
			{
			count= parseInt(colValuecount)+parseInt(count);
			}
			colValuecount =$('#' + gridId).jqGrid('getCell', rowId, 'receivedUnit');
			if(colValuecount!=''&& colValuecount!=0 )
			{
			count1= parseInt(colValuecount)+parseInt(count1);
			}
		}
		var caption='';
		if(gridId!='' && gridId=='nonContainerizedGrid')
		{
		caption= "Conventional units- BKD::"+count+" /RCVD::"+count1;
		$('#'+ gridId).jqGrid('setCaption', caption);
		}
		
	}
	

	// Wiredown save 
	function saveWiredown(){
		var urlStr = _context +"/wiredownMaintenance/saveWiredownMaintenance";
		showLoadingMessage('Updating booking  ...');
		 $.ajax({
			type: "POST",
			url: urlStr,
		
			success: function(responseText){
				showResponseMessages('msgDiv',responseText);
				$('#msgDiv').show();
				$("#containerizedEastGrid").trigger('reloadGrid');
				$("#containerizedWestGrid").trigger('reloadGrid');
				$("#nonContainerizedGrid").trigger('reloadGrid');
				onclickButtonEnable();
				enableDisableButtons();
			}
		 
		 
		}); 

	};
	
	function showResponseMessages(msgDivId, responseText)  {
		window.scrollTo(0, 0);
	  	if (responseText.messages) {

			var messages = responseText.messages;
			var messageContent = '';
			
			if (messages.error.length > 0) {
				var array = messages.error;
				var length = messages.error.length;
				for (var i = 0 ; i < length ; i++) {
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
			if(messageContent != '') {
				window.scrollTo(0, 0);
			}
	  	}
	}

	function enableDisableButtons() {
		if($('#fromMenu').val() == true || $('#fromMenu').val() == 'true') {
			$("#prevWiredown").attr("disabled", true);
			$("#nextWiredown").attr("disabled", true);
		} else {
			var bookingIndex = $.trim($('#bookingIndex').val());
			var listSize = $('#bookingListSize').val();
			if(bookingIndex != undefined && bookingIndex != '' && bookingIndex <= 0) {
				$("#prevWiredown").attr("disabled", true);
			} else {
				$("#prevWiredown").removeAttr("disabled");
			}
			if(bookingIndex >= listSize - 1) {
				$("#nextWiredown").attr("disabled", true);
			} else {
				$("#nextWiredown").removeAttr("disabled");
			}
		}
	}
	
	
	function onclickButtonDisable(){
		$("#exitWiredown").attr("disabled",true);
		$("#cancelBooking").attr("disabled",true);
		$("#dispatchRequest").attr("disabled",true);
		$("#sendDoc").attr("disabled",true);
		$("#rollVVD").attr("disabled",true);
		$("#prevWiredown").attr("disabled",true);
		$("#nextWiredown").attr("disabled",true);
		$("#saveWiredownId").attr("disabled",true);
	}
	
	function onclickButtonEnable(){
		$("#exitWiredown").attr("disabled",false);
		$("#cancelBooking").attr("disabled",false);
		$("#dispatchRequest").attr("disabled",false);
		$("#sendDoc").attr("disabled",false);
		$("#rollVVD").attr("disabled",false);
		$("#saveWiredownId").attr("disabled",false);
	}
	
	function showLoadingMessage(message){
		onclickButtonDisable();
		$('#msgDiv').html("<div class=\"message_info\">" + message + "</div>");
		$('#msgDiv').show();
	}

	function showMsg() {
		var warnMsg = $.trim($("#wiredownWarnMsg").val());
		if(warnMsg != undefined && warnMsg != '') {
			warnMsg = warnMsg.replace('[', '');
			warnMsg = warnMsg.replace(']', '');
		}
		
		var errorMsg = $.trim($("#wiredownErrorMsg").val());
		if(errorMsg != undefined && errorMsg != '') {
			errorMsg = errorMsg.replace('[', '');
			errorMsg = errorMsg.replace(']', '');
		}
		
		showMessages(warnMsg, 'message_warning');
		showMessages(errorMsg, 'message_error');
	}

	function showMessages(message, divClass) {
		
		message = message.replace(']', '');
		var array = message.split(',');
		var length = array.length;
		if(array == '' || array == ' ') {
			length = 0;
		}
		if (length > 0) {
			var messageContent = '';
				for (var i = 0; i < length; i++) {
					messageContent += '<div class="' + divClass + '">' + array[i] + '</div>';
				}
			$('#msgDiv').html(messageContent);

			if(messageContent != '') {
				window.scrollTo(0, 0);
			}
		}
	}
	
	function dataUpdated(gridId) {
		
		var isDataUpdated = 'false';
		
		 var rowIDs = jQuery("#" + gridId).getDataIDs();
		 for(var i = 0 ; i < rowIDs.length ; i = i+1) {
	       var rowData = jQuery("#" + gridId).getRowData(rowIDs[i]);
	       if(rowData.update == 'true' || rowData.update == true) { 
	    	   isDataUpdated = 'true';
	    	   break;
	       } else {
	    	   isDataUpdated = 'false';
	       }
	     }
		return isDataUpdated;
	}
	
	function exitFromWiredown() {
		$.ajax({
			url: _context+"/wiredownMaintenance/exit",
			success: function(responseText){
				if(responseText.success){
						document.location.href = _context + '/cas/bkWireDownSearch.do';
				}
			}
		});
	}
	
	function displayWiredown() {
		$.ajax({
			type: "GET",
			url: _context+"/wiredownMaintenance/loadWiredown",
			data:{shipmentNumber:$('#shipmentIdHeader').val()},
			success: function(responseText) {
				if(responseText.messages.success.length > 0) {
					$('#bookingId').val(responseText.data.bookingHeaderDetailForm.bookingIdHeader);
					$('#shipmentIdHeader').text(responseText.data.bookingHeaderDetailForm.shipmentIdHeader);
					$('#placeOfReceipt').text(responseText.data.bookingHeaderDetailForm.placeOfRecieptHeader);
					$('#shipper').text(responseText.data.bookingHeaderDetailForm.shipper.organizationName);
					$('#consignee').text(responseText.data.bookingHeaderDetailForm.consignee.organizationName);
					$('#status').text(responseText.data.bookingHeaderDetailForm.bookingStatusHeader);
					$('#portOfLoading').text(responseText.data.bookingHeaderDetailForm.portOfLoadingHeader);
					$('#careOfShipper').text(responseText.data.bookingHeaderDetailForm.shipperCareOf);
					$('#careOfConsignee').text(responseText.data.bookingHeaderDetailForm.consigneeCareOf);
					$('#wiredownVVD').text(responseText.data.bookingHeaderDetailForm.vvdHeader);
					$('#portOfDischarge').text(responseText.data.bookingHeaderDetailForm.portOfDischargeHeader);
					$('#shipperAddress').text(responseText.data.bookingHeaderDetailForm.shipper.address);
					$('#consigneeAddress').text(responseText.data.bookingHeaderDetailForm.consignee.address);
					if(responseText.data.bookingHeaderDetailForm.tradeCodeHeader=='' || responseText.data.bookingHeaderDetailForm.tradeCodeHeader==null){
						$('#trade').text("");
					}else{
						$('#trade').text(responseText.data.bookingHeaderDetailForm.tradeCodeHeader + "-" + responseText.data.bookingHeaderDetailForm.tradeCodeValueHeader);
					}
					$('#placeOfDelivery').text(responseText.data.bookingHeaderDetailForm.placeOfDelevieryHeader);
					$('#shipperContact').text(responseText.data.bookingHeaderDetailForm.shipper.contact);
					$('#consgneeContact').text(responseText.data.bookingHeaderDetailForm.consignee.contact);
					$('#customerGroup').text(responseText.data.bookingHeaderDetailForm.customerGroupHeader);
					$('#loadDischarge').text(responseText.data.bookingHeaderDetailForm.ldSVCHeader);
					$('#loadDschServiceGroupCode').val(responseText.data.routing.loadDschServiceGroupCode);
					//028327: 	WIREDOWN MAINTENANCE - INCORRECT PHONE# 
					var shipperPhone = "";
					var consigneePhone = "";
					//if(responseText.data.bookingHeaderDetailForm.shipper.communicationMethodCode == "P"){
						shipperPhone = responseText.data.bookingHeaderDetailForm.shipper.contactPhoneCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactPhoneAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactPhoneExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactPhoneStation  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactPhoneExtension;
					/*} else if(responseText.data.bookingHeaderDetailForm.shipper.communicationMethodCode == "C"){
						shipperPhone = responseText.data.bookingHeaderDetailForm.shipper.contactCellCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactCellAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactCellExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactCellStation  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactCellExtension;
					} else if(responseText.data.bookingHeaderDetailForm.shipper.communicationMethodCode == "F"){
						shipperPhone = responseText.data.bookingHeaderDetailForm.shipper.contactFaxCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactFaxAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactFaxExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactFaxStation  + " " + 
								responseText.data.bookingHeaderDetailForm.shipper.contactFaxExtension;
					}*/
					shipperPhone = shipperPhone.replace(/null/g, "");
					$('#shipperPhone').text(shipperPhone);
					
					//if(responseText.data.bookingHeaderDetailForm.consignee.communicationMethodCode == "P"){
						consigneePhone = responseText.data.bookingHeaderDetailForm.consignee.contactPhoneCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactPhoneAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactPhoneExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactPhoneStation  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactPhoneExtension;
					/*} else if(responseText.data.bookingHeaderDetailForm.consignee.communicationMethodCode == "C"){
						consigneePhone = responseText.data.bookingHeaderDetailForm.consignee.contactCellCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactCellAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactCellExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactCellStation  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactCellExtension;
					} else if(responseText.data.bookingHeaderDetailForm.consignee.communicationMethodCode == "F"){
						consigneePhone = responseText.data.bookingHeaderDetailForm.consignee.contactFaxCountryCode + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactFaxAreaCode  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactFaxExchange  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactFaxStation  + " " + 
								responseText.data.bookingHeaderDetailForm.consignee.contactFaxExtension;
					}*/
					consigneePhone = consigneePhone.replace(/null/g, "");
					$('#consigneePhone').text(consigneePhone);

					$('#containerizedEastGridSize').val(responseText.data.containerizedUnitFormEastBound.length);
					$('#containerizedWestGridSize').val(responseText.data.containerizedUnitFormWestBound.length );
					$('#nonContainerizedGridSize').val(responseText.data.nonContainerizedUnitForm.length);
					manageGridvisibility(responseText.data.containerizedUnitFormEastBound.length, responseText.data.containerizedUnitFormWestBound.length, responseText.data.nonContainerizedUnitForm.length);
					$("#containerizedEastGrid").trigger('reloadGrid');
					$("#containerizedWestGrid").trigger('reloadGrid');
					$("#nonContainerizedGrid").trigger('reloadGrid');
					$("#wiredownRoutingGrid").trigger('reloadGrid');
					
					$('#commentId').val(responseText.data.commentId);
					$('#commentsDiv').show();
					
					
					
					if(isHistoryDisplayOnly) 
					{
						$('#historyDiv').show();
					}
					else 
					{
						$('#historyDiv').hide();
					}
					/*var args = {
							entityType: 'BKNG',
							entityId: $('#bookingId').val(),
							commentId: 'commentId',
							displayCommentTypes: ''
						   };
					getCommentTypes(args);*/
					
					createCommentFunc();
					onclickButtonEnable();
					enableDisableButtons();
					$('#nextWiredown').attr('disabled', 'disabled');
					$('#prevWiredown').attr('disabled', 'disabled');
					if(responseText.data.displayDipatch == true){
						$('#dispatchRequest').attr('disabled', false);
					}else{
						$('#dispatchRequest').attr('disabled', true);
					}
					
				} else if(responseText.messages.error.length > 0) {
					clearForm();
					onclickButtonDisable();
				}
				
				//Display Unreleased Holds Grid on initial display
				openUnreleasedHoldGridOnIntialDisplay("wiredown");
				$('#msgDiv').show();
				showResponseMessages('msgDiv', responseText);
				
				enforceUserSecurityRolesAndPermissions();
			}
		});
		
	}
	
	function createEastContainerisedGrid() {
			var size=500;
			var list=[5, 10, 20,50,100,200,500 ];
		var colNamesForEastGrid = ['Id','FERQ','Equipment Type','Bkd','Rcvd','Container','Status','Loc','Date/Time','Weight','Haz','Dispatch Type','Dispatch Status','Rail Bill','Cash hold','','Actions'];
		var colModelForEastGrid= [
		   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
		   		{name:'bookingFrtEqpRqmtId', index:'bookingFrtEqpRqmtId',hidden:true},
		 		{name:'equipmentType', index:'equipmentType', width:125, editable:false},
		   		{name:'bookedContainer', index:'bookedContainer', width:75, editable:true,editoptions: {maxlength: 4},  
		   			editrules:{
		   				required:true,
                		custom:true,
			   		    custom_func:function (value, colname) {
	            			if(!/^[0-9]+$/.test($.trim(value))){
	            				return [false,colname+ ": Only numerics allowed."];
	            			}else{
								return [true,""];
							}
			   		    }
		   			}
		   		},
		   		{name:'receivedContainer', index:'receivedContainer', width:70, editable:false},
		   		{name:'containerNumber', index:'containerNumber', width:190, editable:false},
		   		{name:'contatinerStatus', index:'contatinerStatus', width:90, editable:false},
		   		{name:'containerLocation', index:'containerLocation', width:75, editable:false},
		   		{name:'containerLastEventDate', index:'containerLastEventDate', width:150, editable:false},
		   		{name:'containerWeight', index:'containerWeight', width:150, editable:false},
		   		{name:'hazardousIndicator', index:'hazardousIndicator', width:100, editable:false},
		   		{name:'dispatchType', index:'dispatchType', width:150, editable:false},
		   		{name:'dispatchStatus', index:'dispatchStatus', width:150, editable:false},
		   		{name:'railBill', index:'railBill', width:100, editable:false},
		   		{name:'cashHold', index:'cashHold', width:100, editable:false},
		   		{name:'update', index:'update', hidden:true},
		   		
		   		{name:'actions', index:'actions', width:100, align:"center", formatter:'actions', formatoptions:{
		   			keys:true,
		   			url: _context+'/wiredownMaintenance/editContainerizedEastGrid', 
		   			afterSave: function() {
						$("#containerizedEastGrid").trigger('reloadGrid');
						return true;
					}
		   		}}
	   		];
		
		var jsonReaderContEast = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
		
		createGrid(
				"containerizedEastGrid", 
				"containerizedPagerEastGrid", 
				_context+'/wiredownMaintenance/loadContainerizedEastGrid', 
				'', _context+'/wiredownMaintenance/editContainerizedEastGrid', 
				'', '',colNamesForEastGrid,colModelForEastGrid,"Eastbound container receipts",
			    'auto',size,list,false,false,
				false,false, jsonReaderContEast,  false, true, 
				true, true, true, false,
				null,null,customloadLoad,false,true);
		//D029838: 	PROD - Export option needed for received containers
		$("#containerizedEastGrid").jqGrid('navButtonAdd','#pg_containerizedPagerEastGrid',{
		    id:'ExportToExcel',
		    caption:'Export To Excel',
		    title:'Export To Excel',
		    onClickButton : function(e)
		    {
				var link = document.createElement("a");    
				link.id="containerizedEastGridExport";
				document.body.appendChild(link);
				jQuery("#containerizedEastGridExport").attr({
				    'download': "Wiredown_Eastbound_Containers_"+$('#shipmentIdHeader').val(),
				    'href': _context+ "/wiredownMaintenance/containerizedEastGridExport"
				}); 
				jQuery('#containerizedEastGridExport')[0].click();    
				document.body.removeChild(link);
				$.unblockUI();
		    },
		    buttonicon: 'ui-icon ui-icon-document',
		});	
	}
	
	function createWestContainerisedGrid() {
		var size=500;
		var list=[5, 10, 20,50,100,200,500 ];
		var colNamesForWestGrid  = ['Id','FERQ','EQ Type','Bkd','Rcvd','Container','Status','Loc','Date/Time','Weight','Haz','pend/ open','Sent','Ack','Sent','Ack','Cash hold','',''];
		var colModelForWestGrid = [
		   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
		   		{name:'bookingFrtEqpRqmtId', index:'bookingFrtEqpRqmtId',hidden:true},
		   		{name:'equipmentType', index:'equipmentType', width:100, editable:false},
		   		{name:'bookedContainer', index:'bookedContainer', width:75, editable:true, editoptions: {maxlength: 4},
		   			editrules:{
		   				required:true,
                		custom:true,
			   		    custom_func:function (value, colname) {
	            			if(!/^[0-9]+$/.test($.trim(value))){
	            				return [false,colname+ ": Only numerics allowed."];
	            			}else{
								return [true,""];
							}
			   		    }
		   			}
		   		},
		   		{name:'receivedContainer', index:'receivedContainer', width:70, editable:false},
		   		{name:'containerNumber', index:'containerNumber', width:190, editable:false},
		   		{name:'contatinerStatus', index:'contatinerStatus', width:90, editable:false},
		   		{name:'containerLocation', index:'containerLocation', width:75, editable:false},
		   		{name:'containerLastEventDate', index:'containerLastEventDate', width:150, editable:false},
		   		{name:'containerWeight', index:'containerWeight', width:150, editable:false},
		   		{name:'hazardousIndicator', index:'hazardousIndicator', width:75, editable:false},
		   		
		   		{name:'dispatchPendOpenCount', index:'dispatchPendOpenCount', width:100, editable:false},
		   		{name:'dispatchSentCount', index:'dispatchSentCount', width:100, editable:false},
		   		{name:'dispatchACKCount', index:'dispatchACKCount', width:100, editable:false},
		   		{name:'railBillSentCount', index:'railBillSentCount', width:100, editable:false},
				{name:'railBillAckCount', index:'railBillAckCount', width:100, editable:false},
		   		{name:'cashHold', index:'cashHold', width:100, editable:false},
		   		{name:'update', index:'update', hidden:true},
		   		
		   		{name:'actions', index:'actions', width:50, align:"center", formatter:'actions', formatoptions:{
		   			keys:true,
		   			url: _context+'/wiredownMaintenance/editContainerizedWestGrid', 
		   			afterSave: function() {
						$("#containerizedWestGrid").trigger('reloadGrid');
						return true;
					}
		   		}}
		   	];
		
		var jsonReaderContWest = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
		
		createGrid(
				"containerizedWestGrid", 
				"containerizedPagerWestGrid", 
				_context+'/wiredownMaintenance/loadContainerizedWestGrid', 
				'', _context+'/wiredownMaintenance/editContainerizedWestGrid', 
				'', '',colNamesForWestGrid,colModelForWestGrid,"Westbound container receipts",
				'auto',size,list,false,false,
				false,false, jsonReaderContWest,  false, true, 
				true, true, true, false,
				null,null,customloadLoad,false,true);
		//D029838: 	PROD - Export option needed for received containers
		$("#containerizedWestGrid").jqGrid('navButtonAdd','#pg_containerizedPagerWestGrid',{
		    id:'ExportToExcel',
		    caption:'Export To Excel',
		    title:'Export To Excel',
		    onClickButton : function(e)
		    {
				var link = document.createElement("a");    
				link.id="containerizedWestGridExport";
				document.body.appendChild(link);
				jQuery("#containerizedWestGridExport").attr({
				    'download': "Wiredown_Westbound_Containers_"+$('#shipmentIdHeader').val(),
				    'href': _context+ "/wiredownMaintenance/containerizedWestGridExport"
				}); 
				jQuery('#containerizedWestGridExport')[0].click();    
				document.body.removeChild(link);
				$.unblockUI();
		    },
		    buttonicon: 'ui-icon ui-icon-document',
		}); 
		jQuery("#containerizedWestGrid").jqGrid('setGroupHeaders', {
        useColSpanStyle: false,
        groupHeaders: [
			{
            startColumnName: 'dispatchPendOpenCount',
            numberOfColumns: 3,
            titleText: '<center>P,L,D,LU,E </center>'},
            {
            startColumnName: 'railBillSentCount',
            numberOfColumns: 2,
            titleText: '<center>Rail</center>'},
            ]
    });
	}

	function createNonContainerisedGrid() {
		var size=500;
		var list=[5, 10, 20,50,100,200,500 ];
		var colNamesGrid = ['Id','#Comdty','Tariff Item Description','Bkd','Rcvd','VINsight#','Make','Model','Status','Loc','Date/Time','Haz','Cash Hold','','Actions'];
		var colModelGrid = [
	   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
	   		 		
	   		{name:'commodityNo', index:'commodityNo', width:115, editable:false},
	   		{name:'commodityDesc', index:'commodityDesc', width:250, editable:false},
	   		{name:'bookedContainer', index:'bookedContainer', width:65, editable:true, editoptions: {maxlength: 4},
	   			editrules:{
	   				required:true,
            		custom:true,
		   		    custom_func:function (value, colname) {
            			if(!/^[0-9]+$/.test($.trim(value))){
            				return [false,colname+ ": Only numerics allowed."];
            			}else{
							return [true,""];
						}
		   		    }
	   			}
	   		},
	   		{name:'receivedUnit', index:'receivedUnit', width:70, editable:false},
	   		{name:'vinsightUnitId', index:'vinsightUnitId', width:120, editable:false},
	   		
	   		{name:'makeVechicle', index:'makeVechicle', width:100, editable:false},
	   		{name:'modelOfVechicle', index:'modelOfVechicle', width:130, editable:false},
	   		{name:'contatinerStatus', index:'contatinerStatus', width:100, editable:false},
	   		{name:'containerLocation', index:'containerLocation', width:60, editable:false},
	   		{name:'containerLastEventDate', index:'containerLastEventDate', width:240, editable:false},
	   		{name:'hazardousIndicator', index:'hazardousIndicator', width:70, editable:false},
	   		{name:'cashHold', index:'cashHold', width:100, editable:false},
	   		{name:'update', index:'update', hidden:true},
	   		
	   		{name:'actions', index:'actions', width:100, align:"center", formatter:'actions', formatoptions:{
	   			keys:true,
	   			url: _context+'/wiredownMaintenance/editNonContainerizedGrid', 
	   			afterSave: function() {
					$("#nonContainerizedGrid").trigger('reloadGrid');
					return true;
				}
	   		}}
	   	];
	
		var jsonReaderNonCont = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
		
		createGrid(
				"nonContainerizedGrid", 
				"nonContainerizedPagerGrid", 
				_context+'/wiredownMaintenance/loadNonContainerizedGrid', 
				'',
				_context+'/wiredownMaintenance/editNonContainerizedGrid', 
				'', '',colNamesGrid,colModelGrid,"Conventional units",
				'auto',size,list,false,false,
				false, false, jsonReaderNonCont, false, true, 
				true, true, true, false,
				null, null, customloadLoad, false, true);
		//D029838: 	PROD - Export option needed for received containers
		$("#nonContainerizedGrid").jqGrid('navButtonAdd','#pg_nonContainerizedPagerGrid',{
		    id:'ExportToExcel',
		    caption:'Export To Excel',
		    title:'Export To Excel',
		    onClickButton : function(e)
		    {
				var link = document.createElement("a");    
				link.id="nonContainerizedGridExport";
				document.body.appendChild(link);
				jQuery("#nonContainerizedGridExport").attr({
				    'download': "Wiredown_Conventional_Units_"+$('#shipmentIdHeader').val(),
				    'href': _context+ "/wiredownMaintenance/nonContainerizedGridExport"
				}); 
				jQuery('#nonContainerizedGridExport')[0].click();    
				document.body.removeChild(link);
				$.unblockUI();
		    },
		    buttonicon: 'ui-icon ui-icon-document',
		});	
		
	}
	
	/*function createVVDGrid() {
		var colNamesVVDGrid = [ 'Booking Voyage Seq No', 'Sequence No', 'Vessel Voyage Direction', 'Port of Loading', 'Port of Discharge', 'Sail Date', 'Arrival Date'];
		
		var colModelVVDGrid = [ 
            {name : 'bookingVoyageSeqNo',hidden : true}, 
            {name : 'routeSequenceNumber', width : 70}, 
            {name : 'vesselVoyageDirection', width : 170}, 
            {name : 'loadPortCode', width : 130}, 
            {name : 'dischargePortCode', width : 130},
            {name : 'sailDate', width : 100}, 
            {name : 'arrivalDate', width : 100}
        ];
		
		var jsonReaderVVDGrid = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "bookingVoyageSeqNo"
		};
		
		createGrid("wiredownRoutingGrid", "vvdPager", 
			_context+'/wiredownMaintenance/loadVVD', 
			'', '', '', '',
			colNamesVVDGrid, colModelVVDGrid, 
			"",
			83, 3, [ 3, 6, 9 ],
			false, false, false, true, 
			jsonReaderVVDGrid, true, true, true, 
			false, true, false,
			null, null, null, false, true);
	}*/
	
	function manageGridvisibility(eastGridSize, westGridSize, nonContainerizedGridSize) {
		if(eastGridSize > 0) {
			$('#eastGridTitle').show();
			$('#eastGrid').show();
			$("#dispatchRequest").attr("disabled",false);
		} else {
			$('#eastGridTitle').hide();
			$('#eastGrid').hide();
		}
		
		if(westGridSize > 0) {
			$('#westGridTitle').show();
			$('#westGrid').show();
			$("#dispatchRequest").attr("disabled",false);
		} else {
			$('#westGridTitle').hide();
			$('#westGrid').hide();
		}
		
		if(nonContainerizedGridSize > 0) {
			$('#nonContainerisedTitle').show();
			$('#nonContainerisedGrid').show();
		} else {
			$('#nonContainerisedTitle').hide();
			$('#nonContainerisedGrid').hide();
		}
	}
	
	// add function for comment
	function getCommentTypes(args){
			$.ajax({
				url: _context +"/comments/commentTypes",
				data: {
				entity: 'BKNG',
				contextScreen: 'wiredownbooking'
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

	function createRollVVDRoutingDialog() {
		$("#vvdWiredownRouting").dialog({
			autoOpen : false,
			width : 970,
			modal : true,
			open: function()
			{
				hasChanged = "N";
				lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
				$('#vvdChangeAuthPartyCode').attr('disabled', false);
				$("#wiredownRoutingGrid").trigger("reloadGrid");
				processChangeSource();
				if($.trim($('#loadDschServiceGroupCode').val()) == 'CON' || $.trim($('#loadDschServiceGroupCode').val()) == 'LCL') {
					$('#convCgoApptCutoffDate').attr('disabled', false);
					$('#convCgoApptCutoffTime').attr('disabled', false);
					$('#convCgoEstArrivalDate').attr('disabled', false);
					$('#convCgoEstArrivalTime').attr('disabled', false);
					$('#requiredDeliveryDate').attr('disabled', false);
				} else {
					$('#convCgoApptCutoffDate').attr('disabled', true);
					$('#convCgoApptCutoffTime').attr('disabled', true);
					$('#convCgoEstArrivalDate').attr('disabled', true);
					$('#convCgoEstArrivalTime').attr('disabled', true);
					$('#requiredDeliveryDate').val("");
					$('#requiredDeliveryDate').attr('disabled', true);
				}
				$('#rollVvdForm').validationEngine('attach');
			},
			close: function()
			{
				clearRollVVdForm();
				$('#rollVVDMsgDiv').html('');
				removeErrorPointers();
				$('#rollVvdForm').validationEngine('detach');
			},
			buttons: {
				"Cancel" : function() {
					if(hasChanged == "Y") {
						var response = confirm("All unsaved changes will be discarded.Continue?");
						if(response) {
							$("#vvdWiredownRouting").dialog("close");
						} else
							return;
					} else {
						$("#vvdWiredownRouting").dialog("close");
					}
				}, 
				"Save" :  function() {
					if(hasChanged == "N") {
						alert("No fields have changed to Save.");
					} else {
						$('#rollVVDMsgDiv').html('');
						if(validateConventionalFieldsOnSave()) {
							$('#rollVVDMsgDiv').html("<div class=\"message_info\">Please wait while booking is updated...</div>");
							var urlStr = _context + "/wiredownMaintenance/updateBookingVVD";
							var isChangeSourceDisabled = false;
							if($('#vvdChangeAuthPartyCode :selected').val()!='' && 
								$('#vvdChangeAuthPartyCode').attr("disabled")=="disabled")
							{
								isChangeSourceDisabled = true;
								$('#vvdChangeAuthPartyCode').attr("disabled", false);
							}
							var queryString = $('#rollVvdForm').formSerialize();
							if(isChangeSourceDisabled)
								$('#vvdChangeAuthPartyCode').attr("disabled", true);
							$.ajax({
								type: "POST",
								url: urlStr,
								data: queryString, 
								success: function(responseText) {
									if(responseText.messages.success.length > 0) {
										$('#wiredownVVD').text($('#vessel').val() + " " + $('#voyage').val() + " " + $('#direction').val());
										$('#status').text(responseText.data.bookingHeaderDetailForm.bookingStatusHeader);
										refreshVVDInfo();
										processChangeSource();
										$("#wiredownRoutingGrid").trigger("reloadGrid");
										hasChanged = "N";
									} 
									showResponseMessages("rollVVDMsgDiv", responseText);
								}
							});
						}
					}
				},
				"Send Doc" : function() {
					if(hasChanged == "Y") {
						var response = confirm("All unsaved changes will be discarded.Continue?");
						if(response) {
							window.open(_context + "/booking/senddocument/create?nav=rollVVD&bookingId=" + $('#shipmentNumber').val());
							$("#vvdWiredownRouting").dialog("close");
						} else
							return;
					} else {
						window.open(_context + "/booking/senddocument/create?nav=rollVVD&bookingId=" + $('#shipmentNumber').val());
						$("#vvdWiredownRouting").dialog("close");
					}
				}
			},
			title: "Roll VVD"
		});
		
		$("#vvdSearchDialog").dialog({
			autoOpen : false,
			width : 990,
			height: 400,
			modal : true
		});
	}
	
	function clearRollVVdForm()
	{
		$('#vvdWiredownRouting input').val('');
		lastChangeSource = '';
		$("#vvdChangeAuthPartyCode").val('');
		$('#wiredownCutOff .cutOff').text('');
		$('#originalVVD .cutOff').text('');
	}
	
	function processChangeSource()
	{
		$('#vvdChangeAuthPartyCode').attr('disabled', true);
		if($('#bookingId').val()!='' && $('#vvdChangeAuthPartyCode :selected').val()!='')
		{
			lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
			$('#changeSourceLabel').html("Change Source<span class='mandatory'>*</span>");
		}
		else
		{
			lastChangeSource = "";
			$('#changeSourceLabel').html("Change Source");
		}
	}
	
	function createRollVVDGrid() {
		var colNames = [ 'Sequence No', 'Route Sequence No', 'Vessel Voyage Direction', 'Port of Loading', 'Port of Discharge', 'Sail Date', 'Arrival Date','extensionType'];
		
		var colModel = [ {
			name : 'bookingVoyageSeqNo',
			width : 70
		}, {
			name : 'routeSequenceNumber',
			hidden : true
		}, {
			name : 'vesselVoyageDirection',
			width : 170
		}, {
			name : 'loadPortCode',
			width : 130
		}, {
			name : 'dischargePortCode',
			width : 130
		},
		{
			name : 'sailDate',
			width : 100
		}, {
			name : 'arrivalDate',
			width : 100
		}, {
			name : 'extensionType',
			hidden : true
		}];
		

		var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "bookingVoyageSeqNo"
		};

		createGrid("wiredownRoutingGrid", // grid id for party
		"wiredownRoutingPager", // page id for party
		_context+'/wiredownMaintenance/loadVVD', // geturl
		'', // addurl
		'', // edit url
		'', //delete url
		'',// delete selected URL
		colNames, colModel, "",// caption
		83,// height
		3,// row num
		[ 3, 6, 9 ],// row list
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
		null,// custom grid complete
		null,// custom load complete
		false,// default hidden
		true);// row Color Based On status
	}

	function createVVDSearchGrid(filter)
	{
		var colNames = [ 'Trip Seq No', 'Voyage', 'Sail Date', 'Arrival Date', 'Cutoff Date'];
		
		var colModel = [ {
			name : 'tripSeqNo',
			hidden : true
		}, {
			name : 'voyageString',
			width : 300,
			align : 'center',
			formatter : 'showlink',
			formatoptions : {
				baseLinkUrl : "javascript:",
				showAction : "selectTrip('",
				addParam : ", filter="+filter+"');",
			}
		}, {
			name : 'dateOfDeparture',
			align : 'center',
			width : 200
		}, {
			name : 'dateOfArrival',
			align : 'center',
			width : 200
		}, {
			name : 'cutOffdate',
			align : 'center',
			width : 200
		}];
		

		var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "tripSeqNo"
		};

		createGrid("vvdResultGrid", // grid id for vvd Results
		"vvdResultPager", // page id for party
		_context+'/booking/routing/loadSearchResults', // geturl
		'', // addurl
		'', // edit url
		'', //delete url
		'',// delete selected URL
		colNames, colModel, "Search Results",// caption
		232,// height
		500,// row num
		[ 10, 20, 30 ],// row list
		false,// multiselect
		false,// multidelete
		false,// load once
		true, // read only grid
		jsonReader, // json reader
		true, // hide edit
		true, // hide delete
		false, // autowidth
		false, // rownumbers
		true, // hide custom add row
		false,// hide pager row
		null,// custom edit method
		null,// custom grid complete
		vvdSearchLoadComplete,// custom load complete
		false,// default hidden
		true);// row Color Based On status

	}
	
	var vvdSearchLoadComplete = function()
	{
		if(firstLoad == "Y")
		{
			$('#searchVVDButton').trigger('click');
			firstLoad = "N";
			$('#vvdResultPager .ui-pg-input').attr("readonly", true);
		}
		else
			$.unblockUI();
	};

	function selectTrip(params)
	{
		var seqNo = params.split(',')[0].split('=')[1];
		var filter = params.split(',')[1].split('=')[1];
		
		$.ajax({
			url : _context +"/booking/routing/selectTripFromGrid",
			data :{
				tripSeqNo:seqNo,
				callingParty : filter,
				blOrigin: $('#blOriginCityCode').val()
			},
			success : function(responseText) {
				if(responseText.success)
				{
					selectTripSuccessFunction(responseText);
					$("#vvdSearchDialog").dialog('close');
				}
				else
				{
					if(responseText.data=='Sail')
					{
						var r = confirm("Sail Date for this VVD has Already Passed. Select?");
						if(r){
							selectTripAfterDateConfirmation('lookUp', filter);
						}
					}
					else
					{
						alert("An error has occurred while selecting vvd");
					}
				}
			}
		});
	}

	function selectTripAfterDateConfirmation(callingType, filter){
		$('#rollVVDMsgDiv').html('');
		$.ajax({
			url : _context +"/booking/routing/selectTripAfterDateConfirmation",
			data: {
				callingParty:filter,
				blOrigin: $('#blOriginCityCode').val()
				},
			success : function(responseText) {
				if(responseText.success)
				{
					selectTripSuccessFunction(responseText);
					
					if(callingType == 'lookUp')
						$("#vvdSearchDialog").dialog('close');
					else if(callingType == 'manual')
						$.unblockUI();
				}
				else
				{
					if(callingType == 'lookUp')
						alert("An error has occurred while selecting vvd");
					else if(callingType == 'manual')
					{
						$.unblockUI();
						showResponseMessages('rollVVDMsgDiv', responseText);
					}
				}
			}
		});
	}
	
	function validateVVD()
	{
		var vesselSelector = '#newVessel';
		var voyageSelector = '#newVoyage';
		var directionSelector = '#newDirection';
		
		$(vesselSelector).val(($(vesselSelector).val()).toUpperCase()); 
		$(directionSelector).val(($(directionSelector).val()).toUpperCase()); 
		 
		if($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()=='')
		{
			alert("Port of Loading and Port of Discharge both must be present for entering VVD");
		}
		else if($(vesselSelector).val()!='' && $(voyageSelector).val()!='' && $(directionSelector).val()!='')
		{
			if($(vesselSelector).val()==$('#vessel').val() && handleVoyage($(voyageSelector).val())==handleVoyage($('#voyage').val()) && $(directionSelector).val()==$('#direction').val())
			{
				alert("VVD same as already present on booking");
			}
			else
			{
				$('#rollVVDMsgDiv').html('');
				blockUI();
				$.ajax({
					url: _context +"/booking/routing/validateVVDManual",
					data: { vessel: $(vesselSelector).val(),
							voyage: handleVoyage($(voyageSelector).val()), 
							direction: $(directionSelector).val(),
							originPort: $('#originPortCityCode').val(),
							destinationPort: $('#destinationPortCityCode').val(),
							callingParty : "wiredown",
							blOrigin: $('#blOriginCityCode').val()
					  	},
					success: function(responseText){
						if(responseText.success)
						{
							selectTripSuccessFunction(responseText);
							showResponseMessages('rollVVDMsgDiv', responseText);
							$.unblockUI();
						}
						else
						{
							if(responseText.data=='Sail')
							{
								var r = confirm("Sail Date for this VVD has Already Passed. Select?");
								if(r)
									selectTripAfterDateConfirmation('manual', 'wiredown');
								else
									$.unblockUI();
							}
							else
							{
								showResponseMessages('rollVVDMsgDiv', responseText);
								$.unblockUI();
							}
						}
					}
				});
			}
		}
	}

	function selectTripSuccessFunction(responseText)
	{
		$('#wiredownCutOff .cutOff').text('');
		$('#wiredownCutOff input').val('');
		$("#vvdRouting").loadJSON(responseText.data);
		$("#vvdChangeAuthPartyCode").val(lastChangeSource);
		$("#wiredownCutOff").loadJSON(responseText.data);
		$("#wiredownRoutingGrid").trigger("reloadGrid");
		$('#rollVVDMsgDiv').html('');
		if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) != 
			($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text()) )
		{
			$('#vvdChangeAuthPartyCode').attr('disabled', false);
			$('#changeSourceLabel').html("Change Source<span class='mandatory'>*</span>");
		}
		else if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) == 
			($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text())
			&& $("#vvdChangeAuthPartyCode :selected").val()=='')
		{
			$('#vvdChangeAuthPartyCode').attr('disabled', true);
			$('#changeSourceLabel').html("Change Source");
		}
		
		hasChanged = "Y";
		$(".ui-dialog-buttonpane button:contains('Save')").attr("disabled", false).removeClass('ui-state-disabled');
	}
	
	function handleVoyage(voyage)
	{
		if(voyage.length==1)
			voyage = "00" + voyage;
		else if(voyage.length==2)
			voyage = "0" + voyage;
		
		return voyage;
	}
	
	function refreshVVDInfo()
	{
		/*$.ajax({
			url: _context +"/booking/routing/refreshVVDInfoAfterSave",
			success: function(responseText){
				$('#originalVVD').loadJSON(responseText);*/
				$('#newVessel').val('');
				$('#newVoyage').val('');
				$('#newDirection').val('');
			/*}
		});*/
	}

	function autotab(event, object)
	{
		var keyCode = event.keyCode;
		
		if(keyCode==32 || (48<=keyCode && keyCode<=57)
				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
				|| (109<=keyCode && keyCode<=111))
		{
			if(object.value.length >= object.getAttribute("maxlength"))
					$(object).next().focus();
		}
		return true;
	}
	
	function validateOnFocus(selector)
	{
		if($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()=='')
		{
			$(selector).blur();
			alert("Port of Loading and Port of Discharge both must be present for entering VVD");
		}
	}
	
	function validateConventionalFieldsOnSave() {
		removeErrorPointers();
		var isValid = true;
		
		if(($('#newVessel').val()!='' || $('#newVoyage').val()!='' || $('#newDirection').val()!='')
				&& ($('#newVessel').val()=='' || $('#newVoyage').val()=='' || $('#newDirection').val()==''))
		{
			//$('#vvdLabel').validationEngine('showPrompt', 'VVD is invalid', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">VVD is invalid</div>');
			isValid = false;
		}
		else if(($('#newVessel').val()!='' && $('#newVoyage').val()!='' && $('#newDirection').val()!='')
				&& ($('#newVessel').val()!=$('#vessel').val() || handleVoyage($('#newVoyage').val())!=handleVoyage($('#voyage').val())
						|| $('#newDirection').val()!=$('#direction').val()))
		{
			//$('#vvdLabel').validationEngine('showPrompt', 'VVD is invalid', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">VVD is invalid</div>');
			isValid = false;
		}
		
		if(!$('#vvdChangeAuthPartyCode').attr("disabled") && $('#vvdChangeAuthPartyCode').attr("disabled")!="disabled"
			&& $('#vvdChangeAuthPartyCode :selected').val()=='')
		{
			//$('#vvdChangeAuthPartyCode').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Change Source is required</div>');
			isValid = false;
		}
		
		if($('#convCgoApptCutoffDate').val()!='' && !validateDate('convCgoApptCutoffDate', false)) {
			//validateDate('convCgoApptCutoffDate', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Appt Cut Off Date not in MM-dd-yyyy format</div>');
			isValid = false;
		}
		if($('#convCgoEstArrivalDate').val()!='' && !validateDate('convCgoEstArrivalDate', false)) {
			//validateDate('convCgoEstArrivalDate', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Est Arrival Date not in MM-dd-yyyy format</div>');
			isValid = false;
		}
		if($('#requiredDeliveryDate').val()!='' && !validateDate('requiredDeliveryDate', false)) {
			//validateDate('requiredDeliveryDate', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Required Delivery Date not in MM-dd-yyyy format</div>');
			isValid = false;
		}
		if(!validateTime('convCgoApptCutoffTime')) {
			//$('#convCgoApptCutoffTime').validationEngine('showPrompt', 'Time should be in HH:mm format', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Appt Cut Off time not in 24-hr HH:mm format</div>');
			isValid = false;
		}
		if(!validateTime('convCgoEstArrivalTime')) {
			//$('#convCgoEstArrivalTime').validationEngine('showPrompt', 'Time should be in HH:mm format', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Est Arrival time not in 24-hr HH:mm format</div>');
			isValid = false;
		}
		/*if($('#convCgoApptCutoffDate').val()!='' && $('#convCgoApptCutoffTime').val()=='') {
			$('#convCgoApptCutoffTime').validationEngine('showPrompt', 'Conv Appt cutoff time required', 'error', 'topRight', true);
			isValid = false;
		} else */if($.trim($('#convCgoApptCutoffDate').val())=='' && $('#convCgoApptCutoffTime').val()!='') {
			//$('#convCgoApptCutoffDate').validationEngine('showPrompt', 'Conv Appt cutoff date required required', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Appt Cut Off Date required</div>');
			isValid = false;
		}
		/*if($('#convCgoEstArrivalDate').val()!='' && $('#convCgoEstArrivalTime').val()=='') {
			$('#convCgoEstArrivalTime').validationEngine('showPrompt', 'Conv Cargo estimated time required', 'error', 'topRight', true);
			isValid = false;
		} else */if($.trim($('#convCgoEstArrivalDate').val())=='' && $('#convCgoEstArrivalTime').val()!='') {
			//$('#convCgoEstArrivalDate').validationEngine('showPrompt', 'Conv Cargo estimated date required', 'error', 'topRight', true);
			$('#rollVVDMsgDiv').html($('#rollVVDMsgDiv').html()+'<div class="message_error">Conventional Est Date required</div>');
			isValid = false;
		}
		
		if($.trim($('#status').text()) == 'APPR') {
			if($('#vessel').val()=='' && $('#voyage').val()=='' && $('#direction').val()=='') {
				$('#vvdLabel').validationEngine('showPrompt', 'VVD is required', 'error', 'topRight', true);
				isValid = false;
			}
		}
		return isValid;
	}
	
	function validateConvArrTime()
	{
		if($('#convCgoApptCutoffDate').val()=='' && $('#convCgoApptCutoffTime').val()!='')
			return "Conv Appt cutoff date required required";
		else if($('#convCgoApptCutoffTime').val()!='' && !validateTime('convCgoApptCutoffTime'))
			return "Time should be in HH:mm format";
	}
	
	function validateConvEstTime()
	{
		if($('#convCgoEstArrivalDate').val()=='' && $('#convCgoEstArrivalTime').val()!='')
			return "Conv Cargo estimated date required";
		else if($('#convCgoEstArrivalTime').val()!='' && !validateTime('convCgoEstArrivalTime'))
			return "Time should be in HH:mm format";
	}
	
	function removeErrorPointers()
	{
		$('#rollVvdForm').validationEngine('hideAll');
	}
	
	function validateTime(timeControl)
	{
		if($('#'+timeControl).val()!='')
		{
			var time = $('#'+timeControl).val();
			if(time.length==4 && time.indexOf(':')==1)
			{
				time = "0"+time;
				return checkTime(time, timeControl);
			}
			else if(time.length==5 && time.indexOf(':')==2)
			{
				return checkTime(time, timeControl);
			}
			else
				return false;
		}
		else
			return true;
	}

	function validateForNonNegativeIntegers(value) {
		var re = new RegExp("^[0-9]+$");
		if (value<0) {
			return false;
		} else if (!re.test(value)) {
			return false;
		} else {
			return true;
		}
	}

	function checkTime(time, timeControl)
	{
		var hourInt = time.split(":")[0];
		var timeInt = time.split(":")[1];
		var isValid = false;
		
		if(validateForNonNegativeIntegers(hourInt) && hourInt>=0 && hourInt<=23 && 
				validateForNonNegativeIntegers(timeInt) && timeInt>=0 && timeInt<=59)
		{
			isValid = true;
			$('#'+timeControl).val(time);
		}
			
		return isValid;
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
				//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		
		if(isNaN(day) || isNaN(month) || isNaN(fullYear))
		{
			if(showPrompt){
				//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else
		{
			if(fullYear<1 || fullYear>9999)
			{
				if(showPrompt){
					//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if(month<1 || month>12)
			{
				if(showPrompt){
					//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if(day<1 || day>31)
			{
				if(showPrompt){
					//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
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
						//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mmm-dd-yyyy)', 'error', 'topRight', true);
					}
					return false;
				}
				else if(month==2 && !isLeapYear && day>28)
				{
					if(showPrompt){
						//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
					}
					return false;
				}
				else if((month==4 || month==6 || month==9 || month==11)	&& day>30)
				{
					if(showPrompt){
						//$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
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
	
	function enforceUserSecurityRolesAndPermissions() {
		enforceSecurityOnWiredownGrid();
		enforceSecurityOnCancelBooking();
		enforceSecurityOnWiredownRollVVD();
		enforceSecurityOnDispatch();
		enforceSecurityOnSendDoc();
		enforceSecurityOnWiredownHoldRelease();
		enforceSecurityOnWiredownHoldPopup();
		enforceSecurityOnComments();
	}
	
	function enforceSecurityOnWiredownGrid() {
		if(isWiredownModifiable == false) {
			$('.ui-icon-pencil').hide();
			$('#saveWiredownId').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnCancelBooking() {
		if(isWiredownCancelBookingBtnEnabled == false) {
			$('#cancelBooking').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnWiredownRollVVD() {
		if(isWiredownRollVVDBtnEnabled == false) {
			$('#rollVVD').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnSendDoc() {
		if(isSendDocBtnEnabled == false) {
			$('#sendDoc').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnDispatch() {
		if(isDispatchBtnEnabled == false) {
			$('#dispatchRequest').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnWiredownHoldRelease() {
		if(!holdReleaseEnabled) {
			$('#holdRelease').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnWiredownHoldPopup() {
		if(!isHoldOverlayBottomEnabled) {
			$('#holdsDiv').css('display', 'none');
		}
	}
	
	function enforceSecurityOnComments() {
		if(isWiredownCommentsDisplay == false) {
			$('#commentsDiv').css('visibility','hidden');
			//$('#historyDiv').css('visibility','hidden');
		}
	}
	
	function resetPermissions() {
		isWiredownModifiable=false;
		isWiredownCancelBookingBtnEnabled=false;
		isWiredownRollVVDBtnEnabled=false;
		isSendDocBtnEnabled=false;
		isDispatchBtnEnabled=false;
		isWiredownHoldReleaseBtnEnabled=false;
		isHoldOverlayBottomEnabled=false;
		isWiredownCommentsDisplay=false;
		isWiredownCommentsModifiable=false;
	}
	
	function createCommentFunc() {
		var args = {
				entityType: 'BKNG',
				entityId: $('#bookingId').val(),
				commentId: 'commentId',
				displayCommentTypes: 'ALL',
				commentTypesForGrid:''
			   };
		getCommentTypes(args);
	}
	
	//Hitsory
	function openHistory(){
		$('#changeLog').html('<h3>History</h3><div class="span-24"><div class="span-24"><table id="changeLogGrid"></table><div id="changeLogPager"></div></div></div>');
		createChangeLogGrid($('#bookingId'),'wiredownmaintenance');
		$("#changeLog" ).dialog( "option", "title", 'Change Log' );
		$("#changeLog").dialog('open');
		
	}
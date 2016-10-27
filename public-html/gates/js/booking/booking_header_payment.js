$(function() {

	$('#bookingNumberId').bind('keypress', function(event){
		if(event.keyCode == 13 || event.keyCode == 9) {
			if($('#bookingNumberId').val()!=''){
				clearForm();
				showLoadingMessage();
				//load the summary first, to get the data for GRIDs [if any on page]
				loadBookingSummary();
			}
		}
	});

	$('#bookingNumberId').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: "Booking Number",
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
			showLoadingMessage();
			clearForm();
			loadBookingSummary();
		}
	});

});

function loadBookingSummary(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/loadBookingForCommomModules",
		data:{
			shipmentNumber: $('#bookingNumberId').val()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				//load the payment details 
				loadPaymentDetails();
			}else{
				showResponseMessages('msgDiv', responseText);
				$("#bookingNumberId").attr("disabled",false);
				$("#paymentSave").attr("disabled",true);
			}
		}
	});
}

function loadPaymentDetails(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/updatepayment/showFormAjax",
		data: {
			bookingNumber: $('#bookingNumberId').val()
		},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
				$('#paymentSave').attr("disabled",false);
				$("#bookingPaymentGrid").trigger('reloadGrid');
				
				//Display Unreleased Holds Grid on initial display
				openUnreleasedHoldGridOnIntialDisplay("payment");
			}
			showResponseMessages("msgDiv",responseText);
			$("#bookingNumberId").attr("disabled",false);
		}
	});
}

function showJSON(responseText)  {
	$("#bookingNumberId").text(responseText.data.paymentHeader.shippingIdHeader);
	$("#bookingNumberId").val(responseText.data.paymentHeader.shippingIdHeader);
	if(responseText.data.paymentHeader.tradeCodeHeader =='' || responseText.data.paymentHeader.tradeCodeHeader==null){
		$("#tradeCode1").text("");
	}else{
		$("#tradeCode1").text(responseText.data.paymentHeader.tradeCodeHeader+"-"+responseText.data.paymentHeader.tradeCodeValueHeader);
	}
	$("#status").text(responseText.data.paymentHeader.bookingStatusHeader); 
	$("#customerGrp").text(responseText.data.paymentHeader.customerGroupHeader); 
	$("#placeOfReceipt").text(responseText.data.paymentHeader.placeOfRecieptHeader); 
	$("#placeOfLoading").text(responseText.data.paymentHeader.portOfLoadingHeader); 
	$("#portOfDischarge").text(responseText.data.paymentHeader.portOfDischargeHeader); 
	$("#placeOfDelivery").text(responseText.data.paymentHeader.placeOfDelevieryHeader); 
	$("#shipper").text(responseText.data.paymentHeader.shipperHeader); 
	$("#consignee").text(responseText.data.paymentHeader.consigneeHeader); 
	$("#vvd").text(responseText.data.paymentHeader.vvdHeader);
	$("#ldsvc").text(responseText.data.paymentHeader.ldSVCHeader);
	$("#commonHeaderDiv").loadJSON(responseText.data);
	$("#bookingStatusHeader").text(responseText.data.paymentHeader.bookingStatusHeader);
	//below sounds bad...do change once functional reason known for repetation of code [only ID of controls r diff. dont know why???]
	loadPaymentForm(responseText);
	
	createCommentFunc();
}

function loadPaymentForm(responseText){
	if(responseText.data.paymentHeader.tradeCodeHeader =='' || responseText.data.paymentHeader.tradeCodeHeader==null){
		$("#tradeCodeHeader").text("");
	}else{
		$("#tradeCodeHeader").text(responseText.data.paymentHeader.tradeCodeHeader+"-"+responseText.data.paymentHeader.tradeCodeValueHeader);
	}
	
	$("#customerGroupHeader").text(responseText.data.paymentHeader.customerGroupHeader); 
	$("#placeOfRecieptHeader").text(responseText.data.paymentHeader.placeOfRecieptHeader); 
	$("#portOfLoadingHeader").text(responseText.data.paymentHeader.portOfLoadingHeader); 
	$("#portOfDischargeHeader").text(responseText.data.paymentHeader.portOfDischargeHeader); 
	$("#placeOfDelevieryHeader").text(responseText.data.paymentHeader.placeOfDelevieryHeader); 

	$("#vvdHeader").text(responseText.data.paymentHeader.vvdHeader);
	$("#ldSVCHeader").text(responseText.data.paymentHeader.ldSVCHeader);
	$("#shipperHeader").text(responseText.data.paymentHeader.shipperHeader);
	$("#consigneeHeader").text(responseText.data.paymentHeader.consigneeHeader);

	$("#debtorHeader").text(responseText.data.paymentInfo.debtor);
	$("#shipperHeaderInfo").text(responseText.data.paymentInfo.shipper);
	$("#consigneeHeaderInfo").text(responseText.data.paymentInfo.consignee);
	$("#debtorHeader").text(responseText.data.paymentInfo.debtorHeader);
	$("#billTo").text(responseText.data.paymentInfo.billTo);

	if(null == responseText.data.paymentInfo.totalCharges || undefined == responseText.data.paymentInfo.totalCharges || responseText.data.paymentInfo.totalCharges == '') 
		$("#totalCharges").text('$0.00');
	else 
		$("#totalCharges").text('$' + responseText.data.paymentInfo.totalCharges.toFixed(2));
	
	if(null == responseText.data.paymentInfo.totalPaid || undefined == responseText.data.paymentInfo.totalPaid || responseText.data.paymentInfo.totalPaid == '')
		$("#totalPaid").text('$0.00');
	else
		$("#totalPaid").text('$' + responseText.data.paymentInfo.totalPaid.toFixed(2));
	
	if(null == responseText.data.paymentInfo.balanceDue || undefined == responseText.data.paymentInfo.balanceDue || responseText.data.paymentInfo.balanceDue == '')
		$("#balanceDue").text('$0.00');
	else
		$("#balanceDue").text('$' + responseText.data.paymentInfo.balanceDue.toFixed(2));

}

function showLoadingMessage(){
	$("#bookingNumberId").attr("disabled",true);
	$('#msgDiv').html("<div class=\"message_info\">Loading payment details for "+ $("#bookingNumberId").val() +" ...</div>");
	$('#msgDiv').show();
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

function clearForm() {
	$("#tradeCodeHeader").text('');
	$("#customerGroupHeader").text(''); 
	$("#placeOfRecieptHeader").text(''); 
	$("#portOfLoadingHeader").text(''); 
	$("#portOfDischargeHeader").text(''); 
	$("#placeOfDelevieryHeader").text(''); 
	$("#bookingStatusHeader").text('');
	$("#vvdHeader").text('');
	$("#ldSVCHeader").text('');
	$("#shipperHeader").text('');
	$("#consigneeHeader").text('');
	$("#debtorHeader").text('');
	$("#shipperHeaderInfo").text('');
	$("#consigneeHeaderInfo").text('');
	$("#debtorHeader").text('');
	$("#totalCharges").text('');
	$("#totalPaid").text('');
	$("#billTo").text('');
	$("#balanceDue").text('');
	
	$("#bookingPaymentGrid").jqGrid("clearGridData", true);
	$('#paymentSave').attr('disabled', true);
	$('#holdRelease').attr('disabled', true);
	$('#msgDiv').html('');
}
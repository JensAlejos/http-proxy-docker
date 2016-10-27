$(function() {
	$('#bookingNumber').bind('keydown', function(event){
		if(event.keyCode == 13 || event.keyCode == 9 || event.which == 13 || event.which == 9) {
			if($('#bookingNumber').val()!=''){
				loadCustomizedNameAdnAddressDetails();
			}
		}
	});
	
	$('#bookingNumber').gatesAutocomplete({
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
			loadCustomizedNameAdnAddressDetails();
		}
	});
});

function loadCustomizedNameAdnAddressDetails(){
	var url = _context + "/booking/customizednameandaddress/showFormMenu?bookingNumberId=2478752";
	//alert(document.location.href);
	var finalURL=  url.indexOf("?");
	//alert(finalURL);
	var _final = url.substring(0,finalURL);
	//alert(_final);
	_final = _final + "?bookingNumberId="+$('#bookingNumber').val();
	//alert(_final);
	document.location.href = _final;;
	//alert(document.location.href);
}

function loadBookingForCommomModules(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/loadBookingForCommomModules",
		data: {
			shipmentNumber: $('#bookingNumber').val(),
		},
		success: function(responseText){
			//alert(responseText);
			if (responseText.messages.error.length == 0) {
				var url = _context +
				"/booking/customizednameandaddress/showFormMenu?bookingNumberId=2478752";
				//alert(document.location.href);
				var finalURL=  document.location.href .indexOf("?");
				//alert(finalURL);
				var _final = document.location.href .substring(0,finalURL);
				//alert(_final);
				_final = _final + "?bookingNumberId=2478752";
				//alert(_final);
				document.location.href = _final;;
				//alert(document.location.href);
				loadHeader();
			}
		}
	});
}

function loadBooking(){
	$('#bookingNumber').gatesAutocomplete({
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
			$('#bookingNumber').val(data.shno);
			showLoadingMessage();
			loadBookingForCommomModules();
		}
	});
}

function showLoadingMessage(){
	$('#msgDiv').html("<div class=\"message_info\">Loading booking " + $('#bookingNumber').val() + " ...</div>");
	$('#msgDiv').show();
}

function loadHeader(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/loadCommonHeader",
		success: function(responseText){
			//alert("locading common header...");
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
			}
		}
	});
}

function showJSON(responseText)  {
	$("#bookingNumber").text(responseText.data.shippingIdHeader);
	$("#bookingNumber").val(responseText.data.shippingIdHeader);
	var split = "-";
	if(responseText.data.tradeCodeHeader==null){
		responseText.data.tradeCodeHeader="";
		responseText.data.tradeCodeValueHeader="";
		split="";
	}
	$("#tradeCode1").text(responseText.data.tradeCodeHeader+split+responseText.data.tradeCodeValueHeader);
	$("#status").text(responseText.data.bookingStatusHeader); 
	$("#customerGrp").text(responseText.data.customerGroupHeader); 
	$("#placeOfReceipt").text(responseText.data.placeOfRecieptHeader); 
	$("#placeOfLoading").text(responseText.data.portOfLoadingHeader); 
	$("#portOfDischarge").text(responseText.data.portOfDischargeHeader); 
	$("#placeOfDelivery").text(responseText.data.placeOfDelevieryHeader); 
	$("#shipper").text(responseText.data.shipperHeader); 
	$("#consignee").text(responseText.data.consigneeHeader); 
	$("#vvd").text(responseText.data.vvdHeader);
	$("#ldsvc").text(responseText.data.ldSVCHeader);
	$("#entityVersion").val(responseText.data.bookingEntityVersion);
	$("#isNavigationFromMenu").val(responseText.data.isNavigationFromMenu);
	$("#commonHeaderDiv").loadJSON(responseText.data);
}

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



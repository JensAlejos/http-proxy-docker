$(function() {
	$('#advancedShipmentReportForm').validationEngine('attach');
	
	$('#hd').hide();

	$('#tabSearchBox').hide();

	$('#runReportButton').click(function(){
		if(!$("#advancedShipmentReportForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N.', 'error', 'topRight', true);
		}else{
			runReport();
		}
    });
	
	$('#exit').click(function(){
		
		window.close();
	});
	
	$('#bookingSummaryReportButton').click(function(){
		if(!$("#bookingSummaryReportForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N.', 'error', 'topRight', true);
		}else{
			var inputData = $('#bookingSummaryReportForm').formSerialize();
			var url = _context + '/booking/report/bookingSummary/runReport?' + inputData;
            $.ajax({
                url : url,
                success : function(responseText) {
                    showResponseMessages("msgDiv", responseText);
                }
            });
//			window.open(_context + '/booking/report/bookingSummary/runReport?' + inputData);
//			window.close();
		}
		
		
	});
	//Changes for Alaska started
	$('#bookingSummaryReportToComeButton').click(function(){
		if(!$("#bookingSummaryToComeReportForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N.', 'error', 'topRight', true);
		}else{
			var inputData = $('#bookingSummaryToComeReportForm').formSerialize();
			window.open(_context + '/booking/report/bookingSummaryToCome/runReport?' + inputData);
			//commented for D032101
		//	window.close();
		}
		
	});
	
	$('#bookingSummaryVGMIButton').click(function(){
		if(!$("#bookingSummaryVGMIForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N.', 'error', 'topRight', true);
		}else{
			var inputData = $('#bookingSummaryVGMIForm').formSerialize();
			window.open(_context + '/booking/report/bookingSummaryVGMI/runReport?' + inputData);
			//commented for D032101
		//	window.close();
		}
		
	});
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';	
	$('#customerOrg').gatesAutocomplete({
			source: url,
			mustMatch:false,
			formatItem: function(data) {
				return data.name;
			},
			formatResult: function(data) {
				return data.name;
			}, 
			select: function(data) {
				//$('#ORGANIZATION_ID').val(data.id);
				$('#customerOrg').val(data.id);
			}
		})
		.change(function() {
			if($('#customerOrg').val()=='' || $('#customerOrg').val()=='ALL')
				{
					$('#customerOrg').val('');
				}
		});	
   //Changed for Alaska Ended
	// Auto Booking
	$('#clearButton').click(function(){
		$('#vessel').val("");
		$('#voyage').val("");
		$('#direction').val("");
		$('#pol').val("");
    });
	
	$('#autoBookingButtonCancel').click(function(){
		document.location.href = _context+'/booking/exit';
	});
	
	$("#vessel").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#vessel').val().length == 3){
	    	 $('#vessel').val($('#vessel').val().toUpperCase());
		    	$('#voyage').focus();
	     }
		});
	$("#voyage").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#voyage').val().length == 3){
	    	 $('#voyage').val($('#voyage').val().toUpperCase());
		    	$('#direction').focus();
	     }
		});
	
	$("#direction").keyup(function(evt) {
		if($('#direction').val().length == 1){
	    	 $('#direction').val($('#direction').val().toUpperCase());
	    	 $('#pol').focus();
	     }
	});
	
	$('#pol').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityWithParameter',
		extraParams: {
			param: 'withPort'
			},
		mustMatch: true,
			formatItem: function(item) {
					return item.cityCode+"-"+item.cityName;
			},
			formatResult: function(item) {
					return item.cityCode+"-"+item.cityName;
			},
			select: function(item) {
				
				$('#pol').val(item.cityCode);
			}	
	});
	$('#pol').gatesPopUpSearch({
		func : function() {
			polPopupSearch();
		}
	});
	

});

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
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
	}
}
function polPopupSearch() {
	_callingFunc='3';
	var values= $('#pol').val().split("-");
	var param=values[0];
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param+"|"+"Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
   }

function cityUpdate(id){
	var end= id.indexOf(",");
	var values=id.substr(0,end);
	end = values.indexOf(" ");
	var len=values.length;
	var cityCode=values.substr(0,end);
	var cityName=values.substr(end+1,len);
	var value=cityCode+"-"+cityName;
	
	if(_callingFunc=='3') {
		$('#pol').val(value);
	}
	
}


function isVVDDirectionValid(){
	var direction = $('#direction').val();
	if(direction=='E' || direction=='W' || direction=='N' || direction=='S'){
		return true;
	}
	return false;
}

function runReport() {
	var inputData = $('#advancedShipmentReportForm').formSerialize();
	window.open(_context + '/booking/report/shipment/runReport?' + inputData);
	window.close();
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

		if(messageContent!=''){
			$('#'+msgDivId).html(messageContent);
			$('#'+msgDivId).show();
			window.scrollTo(0, 0);
		}
  	}
}
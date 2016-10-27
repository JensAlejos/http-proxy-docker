$(function() {
	$('#autoBookingForm').validationEngine('attach');
	$('#autoBookingMsgDiv').hide();
	$('#hd').hide();

	$('#tabSearchBox').hide();

	// Auto Booking
	$('#autoBookingButton').click(function(){
		if(!$("#autoBookingForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N, A, B, C.', 'error', 'topRight', true);
		}else{
			createAutoBooking();
		}
    });

	// Auto Booking
	$('#autoBookingButtonClear').click(function(){
		$('#vessel').val("");
		$('#voyage').val("");
		$('#direction').val("");
    });
	
	$('#autoBookingButtonCancel').click(function(){
		//document.location.href = _context+'/booking/exit';
		window.close();
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
	    		$('#autoBookingButton').focus();
	     }
	});

});


function isVVDDirectionValid(){
	var direction = $('#direction').val();
	//D020158 A,B,C are valid dir
	if(direction=='E' || direction=='W' || direction=='N' || direction=='S' || direction=='A' || direction=='B' || direction=='C'
		|| direction=='e' || direction=='w' || direction=='n' || direction=='s' || direction=='a' || direction=='b' || direction=='c'){
		return true;
	}
	return false;
}
function createAutoBooking(){
	var inputData = $('#autoBookingForm').formSerialize();
	$.ajax({
		type: "GET",
		url: _context +"/booking/autoBook/createAutoBooking",
		data: inputData,
		success: function(responseText){
			showResponseMessages("autoBookingMsgDiv", responseText);
		}
	});
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
$(function() {
	$('#militaryLoadListReportForm').validationEngine('attach');
	$('#hd').hide();

	$('#tabSearchBox').hide();

	$('#runReportButton').click(function(){
		if(!$("#militaryLoadListReportForm").validationEngine('validate')){
			return;
		}else if(isVVDDirectionValid()==false){
			$('#direction').validationEngine('showPrompt', 'Only valid values include - E, W, S, N.', 'error', 'topRight', true);
		}else if(isHistoryValid()==false){
			$('#history').validationEngine('showPrompt', 'Only valid values include - Y, N.', 'error', 'topRight', true);
		}else{
			runReport();
		}
    });
	
	$('#laxrunReportButton').click(function(){
		showInfoMessage('msgDiv', 'Running Batch Job ...');
		$("#laxrunReportButton").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context+"/booking/report/militaryload/runlaxReport",
			data : $('#militaryLoadListReportForm').formSerialize(),
			success : function(responseText) {
				$("#laxrunReportButton").removeAttr("disabled");
				showSuccessMessage('msgDiv', 'Batch Job run successfully.');
			}
		});
    });
	
	$('#exit').click(function(){
		
		window.close();
	});
	
	$('#createVesselrunReportButton').click(function(){
		showInfoMessage('msgDiv', 'Running Batch Job ...');
		$("#createVesselrunReportButton").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context+"/booking/report/militaryload/runVesselReport",
			data : $('#militaryLoadListReportForm').formSerialize(),
			success : function(responseText) {
				$("#createVesselrunReportButton").removeAttr("disabled");
				showSuccessMessage('msgDiv', 'Batch Job run successfully.');
			}
		});
    });
	

	// Auto Booking
	$('#clearButton').click(function(){
		$('#vessel').val("");
		$('#voyage').val("");
		$('#direction').val("");
		$('#history').val("");
		$('#msgDiv').html('');
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
	    	 $('#history').focus();
	     }
	});
	
	

});



function isHistoryValid(){
	 $('#history').val($('#history').val().toUpperCase());
	var history = $('#history').val();
	if(history=='Y' || history=='N' ){
		return true;
	}
	return false;
}

function isVVDDirectionValid(){
	var direction = $('#direction').val();
	if(direction=='E' || direction=='W' || direction=='N' || direction=='S' || direction=='A' || direction=='B' || direction=='C'){
		return true;
	}
	return false;
}

function runReport() {
		
	showInfoMessage('msgDiv', 'Running Batch Job ...');
	$("#runReportButton").attr("disabled", "disabled");

	$.ajax({
		type : "POST",
		url : _context+"/booking/report/militaryload/runReport",
		data : $('#militaryLoadListReportForm').formSerialize(),
		success : function(responseText) {
			$("#runReportButton").removeAttr("disabled");
			showSuccessMessage('msgDiv', 'Batch Job run successfully.');
		}
	});
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
}
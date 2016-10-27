$(function() {
	
	$('#exit').click(function(){
		window.close();
	});
	
	$('#runJob').click(function(){
		showInfoMessage('msgDiv', 'Running Batch Job ...');
		//var queryString = $('#freightCorrectionCustomerReportForm').formSerialize();
		//window.open(_context+'/rds/frrCorrCustReport/runJob?'+queryString);
		$("#runJob").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context+"/rds/generateBillBatch/runJob",
			success : function(responseText) {
				$("#runJob").removeAttr("disabled");
				showSuccessMessage('msgDiv', 'Batch Job run successfully.');
			}
		});

	});
	
});

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
}
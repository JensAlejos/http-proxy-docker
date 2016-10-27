$(document).ready(function() {
	
	//code to close revision history screen
	
	$('#close').click(function(){
		document.location.href=_context+'/detentionBilling/editForm?invoice='+$('#invoice').text();
	});
	
	 enforceSecurityTitle(isDTBRevisionHistoryDisplay);
	 enforceSecurityDivAndButtons('contentDiv', isDTBRevisionHistoryDisplay);
	 enforceSecurityDivAndButtons('revisionDiv', isDTBRevisionHistoryDisplay);
	 tabSequence('#dtBillingRevisionHistoryForm',false,false);
});



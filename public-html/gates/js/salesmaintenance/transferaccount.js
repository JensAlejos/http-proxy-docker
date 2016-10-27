

$(document).ready(function() {
	
	tabSequence('#transferAccountsForm');
	
			if($("#action").val() == "success")
	{
		//alert($("#affectedRowCount").val());
		var $dialog = $('<div></div>')
		.html('<div class="prepend-1 span-10 section-header last" >'+
				' <div class="span-10">'+
				$("#affectedRowCount").val()+' accounts (address roles) transferred successfully.'+
				'</div>'+
				'<div class="prepend-top span-9"></div>'+
				'<div  class="clear prepend-1 span-6">'+
				'<input id="successButton" name="button" type="submit" class="buttonNoFloat" value="Ok" onclick="">'+
				'</div>')
		.dialog({
		  		autoOpen: true,
		        title: 'Accounts Transferred Succesfully',
		        width: 510,
		        modal: true
		        
		  });
	}
	
	$('#cancel').click(function(){
		document.location.href =_context+'/sales/salesMaintenance/get?regionCode='+$("#fromSalesRegionCode").val();
	});
	
	if($("#fromSalesRegionCode").val() == null || $("#fromSalesRegionCode").val()=="" ||
			$("#fromTerritoryCode").val() == null || $("#fromTerritoryCode").val()=="")
		{
			$('#save').attr('disabled',true);
		}
	else
		{
		if(isSaveAllowed) {
			$('#save').attr('disabled',false);
		}
		}
	
	$("#transferAccountsForm").validationEngine('attach'); 	
	
	$('#toSalesRegionCode').change(function(){
		document.location.href =_context+'/sales/transferAccounts/get?'
					+ 'regionCode='+ document.transferAccountsForm.fromSalesRegionCode.value
					+ '&territoryCode='+ document.transferAccountsForm.fromTerritoryCode.value
					+ '&toRegionCode=' + $("#toSalesRegionCode").val();
    });
	   
	// Dialog Link
	$('#save').click(function(){
		$("#toTerritoryCode").val($("#territoryCode:checked").val());
		if($("#affectedRowCount").val()=="0")
		{
			$("#toSalesRegionCode").validationEngine('showPrompt', 'Selected Region/Territory do not have associated accounts. No record to transfer.', 'error', true);
		}
		else
		{
			if($("#transferAccountsForm").validationEngine('validate')){
				$('#affectedCount').dialog('open');
	    	}
		}
		return false;
	});
	// Dialog			
	$('#affectedCount').dialog({
		autoOpen: false,
		width: 510,
		modal: true
	});
	
	// Dialog Link
	$('#updateAccounts').click(function(){
		$('#affectedCount').dialog("close"); 
		$("#toTerritoryCode").val($("#territoryCode:checked").val());
		$("#transferAccountsForm").submit();
		return false;
	});
	
	// Dialog Link
	$('#updateCancel').click(function(){
		$('#affectedCount').dialog("close"); 
		return false;
	});
	// Success Dialog Link
	$('#successButton').click(function(){
		$('#successDiv').dialog("close"); 
		document.location.href =_context+'/sales/salesMaintenance/viewAdd?';
		return false;
	});	
	
});

function removeErrorPointers(){
	   $('#transferAccountsForm').validationEngine('hideAll');
}

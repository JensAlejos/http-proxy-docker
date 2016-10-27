$(document).ready(function() { 
	
	tabSequence('#reassignAccountsForm');
		if($("#action").val() == "success")
	{
		var $dialog = $('<div></div>')
		.html('<div class="prepend-1 span-10 section-header last" >'+
				' <div class="span-10">'+
				$("#affectedRowCount").val()+' accounts (address roles) reassigned successfully.'+
				'</div>'+
				'<div class="prepend-top span-9"></div>'+
				'<div  class="clear prepend-1 span-6">'+
				'<input id="successButton" name="button" type="submit" class="buttonNoFloat" value="Ok" onclick="">'+
				'</div>')
		.dialog({
		  		autoOpen: true,
		  		title: 'Accounts Reassigned Succesfully',
		        width: 510,
		        modal: true
		        
		  });
	}
	
	$('#cancel').click(function(){
		document.location.href =_context+'/sales/salesMaintenance/get?regionCode='+$("#fromSalesRegionCode").val();
	});	
	
	$("#toTerritoryCode").blur(function(){
		if($("#toTerritoryCode").val().length == 1)
		{
			$("#toTerritoryCode").val("0"+$("#toTerritoryCode").val());
		}
	});	
	
	$("#reassignAccountsForm").validationEngine('attach'); 	
	
	if($("#fromSalesRegionCode").val() == null || $("#fromSalesRegionCode").val()=="" ||
			$("#fromTerritoryCode").val() == null || $("#fromTerritoryCode").val()=="")
		{
			$('#save').attr('disabled',true);
		}
	else{
			if(isSaveAllowed)	{
				$('#save').attr('disabled',false);
			}
		}
	
	$('#save').click(function(){
		
		if($("#fromSalesRegionCode").val() == $("#toSalesRegionCode").val() &&
				$("#fromTerritoryCode").val() == $("#toTerritoryCode").val())
		{
			$("#toSalesRegionCode").validationEngine('showPrompt', 'Cannot reassign accounts to same region and territory.', 'error', true);
		}
		else if($("#affectedRowCount").val()=="0")
		{
			$("#toSalesRegionCode").validationEngine('showPrompt', 'Selected Region/Territory do not have associated accounts. No record to reassign.', 'error', true);
		}
		else 
		{
			if($("#reassignAccountsForm").validationEngine('validate')){
	        	//$("#reassignAccountsForm").submit();
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
		$("#reassignAccountsForm").submit();
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
	   $('#reassignAccountsForm').validationEngine('hideAll');
}

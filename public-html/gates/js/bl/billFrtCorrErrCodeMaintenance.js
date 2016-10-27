$(document).ready(function() {
	
	$("#saveErrorCode").click(function(){
		saveErrorCode();
	});
	
	/*Permission Shipment security*/				
	 enforceSecurityDivAndButtons("mainDiv", isFcerrorcodemaintenanceDisplayOnly);
	 enforceSecurityDivAndButtons("cancelErrorCode", isFcerrorcodemaintenanceModifiable);
	 enforceSecurityDivAndButtons("saveErrorCode", isFcerrorcodemaintenanceModifiable);
	 enforceSecurityTitle(isFcerrorcodemaintenanceDisplayOnly); 
	 if(isFcerrorcodemaintenanceUpdate){
	    $("div.ui-pg-div.ui-inline-edit", "#gbox_BLFCErrorCodeMaintenanceGrid").hide();
	 }
	 if(isFcerrorcodemaintenanceAdd){
		$('#gview_BLFCErrorCodeMaintenanceGrid input').attr("disabled", true);
		$('#gview_BLFCErrorCodeMaintenanceGrid select').attr("disabled", true);
	 }
		tabSequence('#blfcErrorCodeMaintainForm',false,false);
});

function saveErrorCode()
{	
	$("#blfcErrorCodeMaintainForm").attr("action", "saveUpdateErrorCodes");
	$("#blfcErrorCodeMaintainForm").submit();
}
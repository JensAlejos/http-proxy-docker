
$(document).ready(function() { 
	if (_readonly) {
		$('#salesRegionInfo').gatesDisable();
	}
	$("#updateRegionForm").validationEngine('attach'); 	
	

	$('#saveRegion').click(function(){
		if($("#updateRegionForm").validationEngine('validate')){
			$("#updateRegionForm").submit(); 
		}else{
			return false;
		}
	});
	$('#cancelRegion').click(function(){
		 document.location.href =_context+'/sales/salesMaintenance/viewAdd';
	});
	
});

function removeErrorPointers(){
	   $('#updateRegionForm').validationEngine('hideAll');
}

//predictive search 
$(document).ready(function() {
	
	
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
    
			$('#organizationName').gatesAutocomplete({
				
				source: url,
				mustMatch:true,
				formatItem: function(data) {
					return data.name;// + "-" + data.code;
				},
				formatResult: function(data) {
					return data.name;// + "-" + data.code;
				},
				select: function(data) {
					$('#organizationName').val(data.name);
					$('#organizationId').val(data.id);
				}
				
			});
			
		

	 

	// code to bind pop up search
	$('#organizationName').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});

	
	//to blur Organization name 
	$('#organizationName').blur(function(){
		if($('#organizationName').val().trim().length==0)
		{
			$('#organizationId').val('');
		}
		if($("#organizationId").val()==null || $("#organizationId").val()==""){
        	$("#organizationName").val(""); 
    	}
    });
	

	
	

});

//lookup window 
function organizationPopupSearch() {
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function organizationNameSearchUpdate(id){
  	//$('#organizationName').val(values);
	var values = id.split("|");
  	$('#organizationName').val(values[0]);
  	$('#organizationId').val(values[1]);
}


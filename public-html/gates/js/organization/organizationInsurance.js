$(document).ready(function() {
	
	$("#effectiveDate").datepicker({
		dateFormat: 'mm-dd-yy'
	});
	$("#expirationDate").datepicker({
		dateFormat: 'mm-dd-yy'
	});
	
	$('#saveOrgInsurance').click(function(){
		if($("#orgInsuranceForm").validationEngine('validate')){
			$("#orgInsuranceForm").attr("action", "createUpdateOrgInsurance");
			$("#saveOrgInsurance").attr("enabled", true);
			$("#organizationNameAndCode").attr("enabled", true);
        	$("#orgInsuranceForm").submit(); 
    	}else{
    		return false;
    	}
    });
	
	$('#organizationNameAndCode').blur(function(){
		if($("#organizationId").val()==null || $("#organizationId").val()==""){
        	$("#organizationNameAndCode").val(""); 
    	}
    });
	
    if($("#organizationId").val()==null || $("#organizationId").val()=="" || !$('#isActive').is(":checked")){
    	$("#saveOrgInsurance").attr("disabled", true);
    	$("#effectiveDate").attr("disabled", true);
    	$("#expirationDate").attr("disabled", true);
	}
    
    $('#searchOrganization').click(function(){
    	if(!$("#orgInsuranceForm").validationEngine('validateField','#organizationNameAndCode')){
    		document.location.href =_context+'/organization/insurance/findOrgInsurance?orgId='+
    								$("#organizationId").val()+"&orgName="+
    								$('#organizationName').sanitizeRequest().val();
    	}else{
    		return false;
    	}
    });
	
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
	$('#organizationNameAndCode').gatesAutocomplete({
		source: url,
		mustMatch:true,
		formatItem: function(data) {
			return data.name;// + "-" + data.code;
		},
		formatResult: function(data) {
			return data.name;// + "-" + data.code;
		},
		select: function(data) {
			$('#organizationNameAndCode').val(data.name);
			$('#organizationId').val(data.id);
			$('#organizationName').val(data.name);
		}
	})
	.change(function() {
		if($('#organizationNameAndCode').val()=='')
		{
			$('#organizationId').val('');
			$('#organizationName').val('');
		}
	});
	// code to bind pop up search

	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	$('#organizationNameAndCode').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});
	
	//validations
	//$("#orgInsuranceForm").validationEngine('attach');
});

$.fn.sanitizeRequest = function() {
    this.each(function() {
        $(this).val(
            $(this).val()
                .replace(/&/g,'%26')
              	.replace(/!/g,'%21')
                .replace(/#/g,'%23')
                .replace(/\+/g,'%2B')
                .replace(/-/g,'%2D')                
                .replace(/_/g,'%5F') 
        );
    });
    return $(this);
};



$(function(){
	
	tabSequence('#orgInsuranceForm');
	//Comments
	var args = {
			entityType: 'ORGN',
			entityId: $('#organizationId').val(),
			commentId:  'commentId'
		};
	$("#comment_link").comments(args);
  
	//History
	var historyArgs = {
		entityId: $('#organizationId').val(),
		entity: 'com.matson.gates.cp.organization.domain.OrganizationInsurance'
	};
	$("#history_link").history(historyArgs);
	
});

//lookup window 
function organizationPopupSearch() {
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function organizationNameSearchUpdate(id){
	var values = id.split("|");
  	$('#organizationName').val(values[0]);
  	$('#organizationId').val(values[1]); 
  	$('#organizationNameAndCode').val(values[0]);
}
//hide all inline validation error messages
function removeErrorPointers(){
	   $('#orgInsuranceForm').validationEngine('hideAll');
}


function cancel() {
	document.location.href =_context+'/cas/organizationSearch.do';
}

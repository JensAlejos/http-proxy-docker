$(document).ready(function() {
	
	
	$('#saveCreditProfile').click(function(){
		if($("#creditProfileForm").validationEngine('validate')){
			$("#creditProfileForm").attr("action", "createUpdateCreditProfile");
			$("#saveCreditProfile").attr("enabled", true);
			$("#organizationNameAndCode").attr("enabled", true);
        	$("#creditProfileForm").submit(); 
    	}else{
    		return false;
    	}
    });
	
	$('#organizationNameAndCode').blur(function(){
		if($("#organizationId").val()==null || $("#organizationId").val()==""){
        	$("#organizationNameAndCode").val(""); 
    	}
    });
	
    if($("#organizationId").val()==null || $("#organizationId").val()==""){
    	$("#saveCreditProfile").attr("disabled", true);
	}
    /*else
	{
		$("#organizationNameAndCode").attr("disabled", true);
	}*/
    
    $('#searchOrganization').click(function(){
    	if(!$("#creditProfileForm").validationEngine('validateField','#organizationNameAndCode')){
    		document.location.href =_context+'/organization/creditprofile/findCreditProfile?orgId='+
    								$("#organizationId").val()+"&orgName="+
    								$('#organizationName').sanitizeRequest().val(); 
    	}else{
    		return false;
    	}
    });
	
    
	//predictive search for organization
	 //autoComplete('organizationNameAndCode', 'searchOrganization', '4', _context);
    
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
	$("#creditProfileForm").validationEngine('attach');
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
	
	tabSequence('#creditProfileForm');
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
		entity: 'com.matson.gates.cp.organization.domain.OrganizationCreditProfile'
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
	   $('#creditProfileForm').validationEngine('hideAll');
}


function cancel() {
	document.location.href =_context+'/cas/organizationSearch.do'
	//document.location.href =_context+'/organization/creditprofile/addCreditProfile?actionPerformed=cancel';
}

///*  <!--  JS FOR COLLAPSE/EXPAND -->  */
//
////Add Organization Authorization 
//animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1')
//
//animatedcollapse.ontoggle=function($, divobj, state){ 
//	}
//
////INITIALIZT COLLAPSE/EXPAND
//animatedcollapse.init()
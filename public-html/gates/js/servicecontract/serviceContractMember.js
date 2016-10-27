//For validation engine set default event to null
$.validationEngine.defaults.validationEventTrigger = null;

$(document).ready(function() {
	
	tabSequence('#serviceContractMemberForm');
	
	if (_readonly) {
		$('#authorization').gatesDisable();
	}
	
	//predictive search for organization
	var url = _context+'/cas/autocomplete.do?method=searchServiceContract&searchType=7';
	 $('#serviceContractNumber').gatesAutocomplete({
			source: url,
			mustMatch: true,
			formatItem: function(data) {
				return data.name + " (id: " + data.id + ")";
			},
			formatResult: function(data) {
				return data.name;
			},
			select: function(data) {
				$('#serviceContractId').val(data.id);
				$('#serviceContractNumber').val(data.name);
			}
		});
	
	 
	//Blurr the data for invalid Contract Number
		/*$('#serviceContractNumber').blur(function(){
			if($("#serviceContractId").val()==null || $("#serviceContractId").val()==""){
	        	$("#serviceContractNumber").val(""); 
	    	}
			if($("#serviceContractNumber").val()==null || $("#serviceContractNumber").val()==""){
				$("#serviceContractId").val(""); 
			}
	    });*/

	// code to bind pop up search
	$('#serviceContractNumber').gatesPopUpSearch({
		func : function() {
			serviceContractPopupSearch();
		}
	});


	//on load disabling save button
	if($('#searchOn').val()=='false'){
		$('#org_save').attr('disabled', true);
	}
	
	
	//on change of parent organization disabling save button
	$('#serviceContractNumber').change(function(){
		$('#org_save').attr('disabled', true);
	});
	
	//after search of parent organization enabling save button
	$('#searchMembers').click(function(){
		$('#org_save').attr('disabled', false);
		var memberNameTrim=$('#memberName').val().trim();
		$('#memberName').val(memberNameTrim);
		overrideAction('searchForMember');
		$('#serviceContractMemberForm').submit();
	});
	
	
	//clear the service member
	$('#clearMember').click(function(){
		document.location.href = _context+'/serviceContract/member/viewAddMember?actionPerformed=cancel';
	});
	
	//validations
	$("#serviceContractMemberForm").validationEngine('attach');
	

	

});

//lookup window 
function serviceContractPopupSearch() {
	var actionUrl = _context + "/cas/serviceContractLookUp.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}



/** ************************************************** */
//COMMON METHODS
function removeErrorPointers() {
	$('#serviceContractMemberForm').validationEngine('hideAll');
}

function overrideAction(action) {
	$("#serviceContractMemberForm").attr("action", action);
	$("#serviceContractMemberForm").submit();
}

//

function cancel(){
	if($("#sourcePage").val()=='serviceContract'){
		document.location.href=_context+'/serviceContract/edit?serviceContractId=' + $("#serviceContractId").val();
	}else{
		document.location.href = _context+'/cas/serviceContractSearch.do';
	}
	
}
/** ************************************************** */

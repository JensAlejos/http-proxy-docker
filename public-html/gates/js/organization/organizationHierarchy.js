//For validation engine set default event to null
$.validationEngine.defaults.validationEventTrigger = null;

/*  <!--  JS FOR COLLAPSE/EXPAND -->  */

//Add Organization Authorization 
/*animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1')

animatedcollapse.ontoggle=function($, divobj, state){ 
	}

//INITIALIZT COLLAPSE/EXPAND
animatedcollapse.init()*/

$(document).ready(function() {
	
	//By default focus on organization
	$('#parentOrganizationName').focus();
	
	if (_readonly) {
		$('#authorization').gatesDisable();
	}
		
	if($('#actionPerformed').val()=='add'){
		$('#aliasWrapper').hide();
		$('#subsidiaryWrapper').hide();
		$('#divisionWrapper').hide();
		$('#affiliateWrapper').hide();
	}
		
	
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
	//predictive search for parent organization
	 //autoComplete('parentOrganizationName', 'searchOrganization', '4', _context);
	 $('#parentOrganizationName').gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.name;
			},
			formatResult: function(data) {
				return data.name;
			},
			select: function(data) {
				$('#parentOrganizationId').val(data.id);
				$('#parentOrganizationName').val(data.name+"-"+data.code);
			}
		})
		.change(function() {
			if($('#parentOrganizationName').val()=='')
			{
				$('#parentOrganizationId').val('');
			}
		});

	// code to bind pop up search
	$('#parentOrganizationName').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});
	//on load disabling save button
	if($('#searchOn').val()=='false'){
		$('#org_save').attr('disabled', true);
	}
	
	//for defect 14201
	 $('#org_save').click(function(){ 
		   if($("#organizationHierarchyForm").validationEngine('validate')){
			   
				$("#organizationHierarchyForm").submit(); 
		  	}else{
		  		return false;
		  	}   
	   });
	
	
	
	
	//on change of parent organization disabling save button
	$('#parentOrganizationName').change(function(){
		$('#org_save').attr('disabled', true);
	});
	
	//after search of parent organization enabling save button
	$('#searchOrganization').click(function(){
		if($('#searchOn').val()=='true'){
			$('#aliasWrapper').show();
			$('#subsidiaryWrapper').show();
			$('#divisionWrapper').show();
			$('#affiliateWrapper').show();
		}
		$('#org_save').attr('disabled', false);
	});
	//clear the Organzation
	$('#clearOrganization').click(function(){
		 document.location.href = _context+'/organization/hierarchy/viewAdd?actionPerformed=clear';	
	});
	
	//validations
	//$("#organizationHierarchyForm").validationEngine('attach');
});

//lookup window 
function organizationPopupSearch() {
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

//lookup set value
function organizationNameSearchUpdate(id){
	var values = id.split("|");
  	$('#parentOrganizationName').val(values[0]);
	$('#parentOrganizationId').val(values[1]);
}

/* <!-- JS FOR OVERLAY --> */
var flag = 0;
$(function() {

	// Dialog HISTORY Link
/*	$('#history_link').click(function() {
		flag = 4;
		var organizationId = $('#parentOrganizationId').val();
		var url ="/gates/history/revisions?entityId=" + organizationId
		+"&entity=com.matson.gates.cp.organization.domain.Organization"
		+ "&propertyName=relationsAsParent";
		window.open (url, "historyWin","status=0,toolbar=0,width=900,height=600,scrollbars=1,titlebar=0");
		//$('#org_history').dialog('open');
		return false;
	});*/
	
	//Comments dialog

	tabSequence('#organizationHierarchyForm');
		var args = {
					entityType: 'ORGN',
					entityId: $('#parentOrganizationId').val(),
					commentId:  'commentId'
				};
		$("#comment_link").comments(args);


    //History Dialog
	var historyArgs = {
			entityId:$('#parentOrganizationId').val()+";",
			entity: 'com.matson.gates.cp.organization.domain.OrganizationHierarchy',
			property:'parent'+";",
			type:'hierarchy',
		};
	$("#history_link").history(historyArgs);
	
	// Dialog HISTORY
	$('#history').dialog({
		autoOpen : false,
		width : 820,
		modal : true
	});
	// Dialog HISTORY Close
	$('#history_close').click(function() {
		flag = 0;
		$('#history').dialog("close");
		return false;
	});

	// Dialog COMMENT Link
	$('#comment_link').click(function() {
		flag = 3;
		$('#comments').dialog('open');
		return false;
	});
	// Dialog COMMENT
	$('#comments').dialog({
		autoOpen : false,
		width : 800,
		modal : true
	});
	// Dialog COMMENT Close
	$('#comments_close').click(function() {
		flag = 0;
		$('#comments').dialog("close");
		return false;
	});

	// Dialog NAVIGATION
	$('#navigation_workflow').dialog({
		autoOpen : false,
		width : 510,
		modal : true,
	});
	// Dialog NAVIGATION Close
	$('#workflow_close').click(function() {
		flag = 0;
		$('#navigation_workflow').dialog("close");
		return false;
	});

});

/* <!-- JS FOR COMMON FUNCTIONS --> */
/*
 * function navigation(){ }
 */
function showSussessMessage() {
	var ele = document.getElementById("cancel_warning_message");
	ele.style.display = "none";
	var eles = document.getElementById("save_success_message");
	eles.style.display = "block";
}
function showCancelWarning() {
	var ele = document.getElementById("save_success_message");
	ele.style.display = "none";
	var eles = document.getElementById("cancel_warning_message");
	eles.style.display = "block";
}
function closeComment() {
	$('#comments_close').click();
}

/* <!-- JS FOR COLLAPSE/EXPAND --> */

// Add Organization Authorization
animatedcollapse.addDiv('add_org_authorization', 'fade=0,speed=1,hide=1');
// History Details
animatedcollapse.addDiv('history_details_frame', 'fade=0,speed=1,hide=1');
animatedcollapse.ontoggle = function($, divobj, state) {
}

// INITIALIZT COLLAPSE/EXPAND
animatedcollapse.init();

//hide all inline validation error messages
function removeErrorPointers(){
	   $('#organizationHierarchyForm').validationEngine('hideAll');
}

//change the form action attribute
function overrideAction(actionName){
	$("#organizationHierarchyForm").attr("action", actionName);
}

function clear(){
	document.location.href = _context+'/organization/hierarchy/viewAdd?actionPerformed=cancel';
}

function cancel(){
	document.location.href = _context+'/cas/organizationSearch.do';
}

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
	//alert()
	/*if($('#status').val()=='')
	{
		alert($('#status').val());
		$('#popupSearchorganizationName').hide();
		
	}*/
	
	tabSequence('#addressRoleBillPrintOptionsForm');
	var args = {
			entityType: 'AROL',
			entityId: $('#addressRoleId').val(),
			commentId:  'commentId'
		};
		$("#comment_link").comments(args);
	
	if (_readonly) {
		$('#authorization').gatesDisable();
	}
	
	//disable search button if validation fails
	if($('#disableSearch').val() == 'true'){
		$('#searchOrganization').attr('disabled',true);
	}
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";	 
	 $('#organizationNamePopUp').gatesAutocomplete({
			source: url,
			formatItem: function(data) {
				return data.name; // + "-" + data.code;
			},
			formatResult: function(data) {
				return data.name; // + "-" + data.code;
			},
			select: function(data) {
				clearFormFields();
				$('#organizationId').val(data.id);
				$('#organizationName').val(data.name);
				$('#organizationNamePopUp').val(data.name);
			}
		});	
	 
	 $('#organizationNamePopUp').gatesPopUpSearch({
			func : function() {
				organizationPopupSearch();
			}
		});
	
	 $('#AROLE_POPUP').click(				
				function(){				
				    if ($('#organizationId').val()) {	
						var url = _context+'/cas/addressRolemainlookup.do?filterValue1='+$('#organizationId').val();
						winBRopen(url,'winpops','700','500','no','no');
						
				    } else {
				    	$("#organizationNamePopUp").validationEngine('showPrompt', 'Please select an organization', 'error', true);
				    }
				}
		
		);
	 
	//on load disabling save button
	if($('#searchOn').val()=='false'){
		$('#org_save').attr('disabled', true);
	}
	 
	if($('#nextFlag').val()=='false'){
			$('#org_next').attr('disabled', true);
		}
	
	
	//validations
	$("#addressRoleBillPrintOptionsForm").validationEngine('attach');
	
	$('#organizationNamePopUp').change(function(){
			clearFormFields();
	 });
});



//lookup window 
function organizationPopupSearch() {
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function winBRopen(theURL, Name, popW, popH, scroll, loc) {
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
	Win = window.open(theURL, Name, winProp);
	if (parseInt(navigator.appVersion) >= 4) {
		Win.window.focus();
	}
}

function organizationNameSearchUpdate(id)
{
	 //alert(id);
		var values = id.split("|");
		clearFormFields();
	  	$('#organizationName').val(values[0]);
	  	$('#organizationNamePopUp').val(values[0]);
		//$('#organizationNameHolder').val(values[0]);
	  	$('#organizationId').val(values[1]);
	  	/*if(values[3]=='Y' || values[3]=='y')
	  	{
	  		$('#organizationActive').attr('checked',true); 
	  	}*/
}
function addressRoleSearchUpdate(id){
	var values = id.split("|");
  	//$('#ORG_NAME').val(values);
	
	  	//$('#sourceOrganizationId').val(values[0]);
		document.location.href="/gates/addressRole/billPrint/edit?id="+values[0]+"&status=maintain&org="+$('#organizationNamePopUp').val()+"&organizationId="+$('#organizationId').val();
	  	
	  	
	  	
	  	
	  	//$('#isSourceArolActive').text(values[11]); 	

	  //self.opener.document.getElementById('aroleId').value = values[1];
}

/* <!-- JS FOR OVERLAY --> */
var flag = 0;
$(function() {

	var historyArgs = {

			entityId: $('#addressRoleId').val()+';',
			entity:  'com.matson.gates.cp.addressrole.domain.AddressRolePrintOptions',
			property: 'addressRole'+';'
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
	   $('#addressRoleBillPrintOptionsForm').validationEngine('hideAll');
}

//change the form action attribute
function overrideAction(actionName){
	$("#addressRoleBillPrintOptionsForm").attr("action", actionName);
}

function clear(){
	document.location.href = _context+'/organization/hierarchy/viewAdd?actionPerformed=cancel';
}

function cancel(){
	document.location.href = _context+'/cas/addressRoleSearch.do';
}

function openCustPaperPrintCharSearch() {
	var actionUrl = _context + "/cas/custPaperPrintCharSearch.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerPaperPrintCharSearch', windowStyle);
}

function clearFormFields()
{
	$('#organizationNamePopUp').attr('titel',"");
	document.getElementById('organizationNameQualifier').innerHTML = "";
	document.getElementById('owningOrgName').innerHTML = "";
	document.getElementById('addressLine1').innerHTML = "";
	document.getElementById('selectedTrade').innerHTML = "";
	document.getElementById('suite').innerHTML = "";
	document.getElementById('cityName').innerHTML = "";
	document.getElementById('stateCode').innerHTML = "";
	document.getElementById('countryName').innerHTML = "";
	document.getElementById('addressRoleTypeCode').innerHTML = "";
	document.getElementById('zipCode').innerHTML = "";
	$('#organizationId').val("");
	$('#addressRoleId').val("");
	$('#billingOptions').hide();
}

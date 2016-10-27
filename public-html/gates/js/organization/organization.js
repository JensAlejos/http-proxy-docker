//For validation engine set default event to null
$.validationEngine.defaults.validationEventTrigger = null;

//// Add Organization Authorization
//animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1');
//animatedcollapse.ontoggle = function($, divobj, state) {
//}
//
//// INITIALIZT COLLAPSE/EXPAND
//animatedcollapse.init();

// FOR SHORTCUT KEYS
var flag = 0;
// for validation of mutual exclusive org types
var orgTypeMutualExclusiveCheck = true;

$(document).ready(function() {
	
	var id = $('#organizationId').val();
	
   /* if($('#isSuccessfull').val().toLowerCase()=="true")
	{
		$('#org_address').attr('disabled', false);
	}*/
	if(id == null || id=="")
	{
		var ele = document.getElementById("maintainOrganization");
		ele.style.display = "none";
		var ele1 = document.getElementById("addOrganization");
		ele1.style.display = "block";
		
		/*var ele2 = document.getElementById("updateField");
		ele2.style.display = "none";
		var ele3 = document.getElementById("addField");
		ele3.style.display = "block";*/
		$('#org_address').attr('disabled', true);
		
	}
	else
	{
		var ele = document.getElementById("addOrganization");
		ele.style.display = "none";
		var ele1 = document.getElementById("maintainOrganization");
		ele1.style.display = "block";
		
		/*var ele2 = document.getElementById("addField");
		ele2.style.display = "none";
		var ele3 = document.getElementById("updateField");
		ele3.style.display = "block";*/
	}
	
	// attach validation engine with form
	$("#organizationForm").validationEngine('attach');
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false
	});

	// apply security rules
	if (_readonly) {
		$('#organizationForm').gatesDisable({exclude: ['org_workflow_link', 'org_address']});
	}
	
	tabSequence('#organizationForm');
});

var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};

/** ************************************************** */

// methods for selecting all values from multi select menu
function submitAllSelect() {
	selectAll(getControl('box2View'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}// closing Select All Function
/** ************************************************** */

function openAuthorizingParty() {
	$('#org_auth_party').dialog('open');
	return false;
}

function save() {
	// document.getElementById('bg_ap_ok').style.display = 'block';
	if ($("#formID").validationEngine('validate')) {
		$('#authorizingParty').val($('#authorizingParty2').val());
		$('#remarks').val($('#remarks2').val());
		$("#organizationForm").submit();
	}
	return false;
}

function cancel() {
	//document.location.href = _context + '/organization/add?actionPerformed=cancel';
	document.location.href = _context + '/cas/organizationSearch.do';
}

function addAddress()
{
	document.location.href=_context+
				'/organization/address/add?actionPerformed=add&orgId='+$('#organizationId').val()+"&navigation=maintainOrg";
}
/** ************************************************** */
// SHORTCUST KEYS
shortcut.add("Ctrl+S", function() {
	if (flag == 0) {
		save();
		$('#org_ap_workflow_link').click();
	} else if (flag == 3) {
		saveComment();
		$('#dialog_close1').click();
	}

});
shortcut.add("Ctrl+D", function() {
	if (flag == 0) {
		cancel();
		$('#org_workflow_link').click();
	} else if (flag == 3) {
		$('#dialog_close2').click();
	}

});
shortcut.add("esc", function() {
	if (flag == 0) {
		cancel();
		$('#org_workflow_link').click();
	}
	/*
	 * else if(flag==1) { $('#dialog_close').click(); }
	 */
	else if (flag == 2) {
		$('#workflow_close').click();
	} else if (flag == 3) {
		$('#dialog_close1').click();
	} else if (flag == 4) {
		$('#history_close').click();
	} else if (flag == 5) {
		$('#compare_close').click();
	}
});
/** ************************************************** */

/** ************************************************** */
// COMMON METHODS
function overrideAction(action) {
	$("#organizationForm").attr("action", action);
}

function enableFields() {
	getControl("isActive").disabled = false;
}

function disableFields() {
	getControl("isActive").disabled = true;
}

function removeErrorPointers() {
	$('#organizationForm').validationEngine('hideAll');
}

/** ************************************************** */

/** ************************************************** */
// Validations
function validateAdd() {
	/*orgTypeMutualExclusive = $('#box1View option:selected').text().substring(
			eval(eval($('#box1View option:selected').text().indexOf(',')) + 1),
			$('#box1View option:selected').text().length);
	orgTypeMutualExclusive = jQuery.trim(orgTypeMutualExclusive);*/
	orgTypeMutualExclusive = $('#box1View option:selected').val();
	if (orgTypeMutualExclusive == '04'
			|| orgTypeMutualExclusive == '05'
			|| orgTypeMutualExclusive == '06'
			) {
		if (orgTypeMutualExclusiveCheck) {
			orgTypeMutualExclusiveCheck = false;

		} else {
			alert('Please select one of Motor, Rail, Ocean , Air ');
			return false;
		}
	}
	oneTimeOrgText = $('#box1View option:selected').text();
	oneTimeOrgVal = $('#box1View option:selected').val();
	if((oneTimeOrgText.toUpperCase()=='ONE-TIME')||(oneTimeOrgVal=="99")){
		alert('One Time organization cannot be created ');
		return false;
	}
	return true;
}

function validateRemove() {
	/*orgTypeMutualExclusive = $('#box2View option:selected').text().substring(
			eval(eval($('#box2View option:selected').text().indexOf(',')) + 1),
			$('#box2View option:selected').text().length);
	orgTypeMutualExclusive = jQuery.trim(orgTypeMutualExclusive);
	if (orgTypeMutualExclusive.toUpperCase() == 'MOTOR'
			|| orgTypeMutualExclusive.toUpperCase() == 'RAIL'
			|| orgTypeMutualExclusive.toUpperCase() == 'WATER'
			|| orgTypeMutualExclusive.toUpperCase() == 'AIR') {
		orgTypeMutualExclusiveCheck = true;
	}*/
	
	orgTypeMutualExclusive = $('#box1View option:selected').val();
	if (orgTypeMutualExclusive == '04'
			|| orgTypeMutualExclusive == '05'
			|| orgTypeMutualExclusive == '06'
			) {
		orgTypeMutualExclusiveCheck = true;
		}
	return true;
}
/** ************************************************** */

$(function() {
	$('#org_auth_party').dialog({
		autoOpen : false,
		width : 510,
		modal : true
	});
	// Dialog Link
	

		var args = {
					entityType: 'ORGN',
					entityId: $('#organizationId').val(),
					commentId:  'commentId'
				};
		$("#comment_link").comments(args);


   //History popup	
	var historyArgs = {
			entityId: $('#organizationId').val(),
			entity: 'com.matson.gates.cp.organization.domain.Organization'
		};
	$("#history_link").history(historyArgs);


	// Dialog
	$('#org_history').dialog({
		autoOpen : false,
		width : 800,
		modal : true
	});
	// Dialog Close
	$('#history_close').click(function() {
		flag = 0;
		$('#org_history').dialog("close");
		return false;
	});

	// Dialog Link
	$('#history_detals').click(function() {
		flag = 5;
		$('#org_history').dialog("close");
		$('#org_compare').dialog('open');
		return false;
	});
	// Dialog
	$('#org_compare').dialog({
		autoOpen : false,
		width : 800,
		modal : true
	});
	// Dialog Close
	$('#compare_close').click(function() {
		flag = 0;
		$('#org_compare').dialog("close");
		return false;
	});

	// Dialog Link
	/*
	 * $('#org_save').click(function(){ flag = 1;
	 * $('#org_auth_party').dialog('open'); return false; }); // Dialog
	 * $('#org_auth_party').dialog({ autoOpen: false, width: 510, modal: true
	 * });
	 */
	// Dialog Link
	// changes made
	/*$('#org_ap_workflow_link').click(function() {
		flag = 2;
		if ($("#organizationForm").validationEngine('validate')) {
			return true;
		} else {
			return false;
		}
		// $('#org_auth_party').dialog("close");
		// $('#org_workflow').dialog('open');
		// $('#bg_ap_ok').dialog('open');
	});*/

	// Dialog Link
	$('#org_workflow_link').click(function() {
		flag = 2;
		$('#org_workflow').dialog('open');
		return false;
	});
	// Dialog
	$('#org_workflow').dialog({
		autoOpen : false,
		width : 510,
		modal : true
	});

	/*
	 * // Dialog Link $('#org_comment_link').click(function(){ flag=3;
	 * $('#org_comments').dialog('open'); return false; }); // Dialog
	 * $('#org_comments').dialog({ autoOpen: false, width: 800, modal: true });
	 */

	/*--
	$('a', '#org_comment_link').live('click', function() {
	    var url = this.href;
	    var dialog = $("#commentsDialog");
	    if ($("#commentsDialog").length == 0) {
	        dialog = $('<div id="commentsDialog" style="display:hidden"></div>').appendTo('body');
	    } 

	    // load remote content
	    dialog.load(
	            url,
	            {},
	            function(responseText, textStatus, XMLHttpRequest) {
	                dialog.dialog();
	            }
	        );
	    //prevent the browser to follow the link
	    return false;
	});
	 */
/*	$('a', '#org_comment_link').live('click', function() {
		var url = this.href;
		$('<iframe id="commentsFrame" src="' + url + '"></iframe>').dialog({
			width : 1100,
			height : 620,
			title : 'Comments',
			autoResize : true
			//close: function(event, ui) { $(this).dialog('close');}
		}).width(1100 - 10).height(620 - 10);
		$('#commentsFrame')
			.attr('src', this.href)
			.dialog({
				width : 1100,
				height : 620,
				title : 'Comments',
				autoResize : true
			})
			.width(1100 - 10)
			.height(620 - 10);
		
		return false;
	});*/

	// Dialog Close
	/*
	 * $('#dialog_close').click(function(){ flag = 0;
	 * $('#org_auth_party').dialog("close"); return false; });
	 */
	// Dialog Close
	$('#dialog_close1').click(function() {
		flag = 0;
		$('#org_comments').dialog("close");
		return false;
	});

	// Dialog Close
	$('#dialog_close2').click(function() {
		flag = 0;
		$('#org_comments').dialog("close");
		return false;
	});
	// Dialog Close
	$('#workflow_close').click(function() {
		flag = 0;
		$('#org_workflow').dialog("close");
		return false;
	});

	$('#dialog_close').click(function() {
		$('#formID').validationEngine('hideAll');
		$('#org_auth_party').dialog("close");
		return false;
	});
});

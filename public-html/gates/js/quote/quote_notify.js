/**
 *  Javascript File for Send Internal / Send Customer
 */

var mailId = "";
var faxNo = "";

$(function() {

	$('#notifyCustomerDialog').dialog({
		autoOpen : false,
		width : 400,
		modal : true,
		open : function() {
			onNotifyCustomerDialogOpen();
		},
		close : function() {			
		},
		buttons : {
	        Close: function(){
	        	$("#notifyCustomerDialog").dialog("close");
	        	$('#notifyExtAdditional').val("");
	        },
	        Send: function() {
	        	notifyCustomer();
	        }
		}
	});
	
	$("#isEmail").click(function() {
		if($("#notifyMailId").val() != ""){
			mailId = $("#notifyMailId").val();	
		}		
		if ($("#isEmail").is(':checked')==true) {			
			$("#notifyMailId").removeAttr("disabled");
			if($("#notifyMailId").val() == ""){
				$("#notifyMailId").val(mailId);
			}
		} else {
			$("#notifyMailId").val("");
			$("#notifyMailId").attr("disabled", true);
		}	
	});	
	
	$("#isFax").click(function() {
		if($("#notifyFax").val() != ""){
			faxNo = $("#notifyFax").val();
		}
		if ($("#isFax").is(':checked')==true) {
			$("#notifyFax").removeAttr("disabled");
			if($("#notifyFax").val() == ""){
				$("#notifyFax").val(faxNo);
			}
		} else {
			$("#notifyFax").val("");
			$("#notifyFax").attr("disabled", true);
		}	
	});

	$('#sendCustomer').click(function() {
		var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
		if(quoteString == newQuoteString){
			var statusCodeVal = $('#statusCode').val();			
			if(statusCodeVal == "PEND" || statusCodeVal == "APPR" || statusCodeVal == "CNCL" || statusCodeVal == "") {
				alert ("Only ISSD (issued) or BKGD (booked) quotes may be faxed or e-mailed");
				return;
			}
	
			$('#notifyCustomerDialog').dialog('open');
		}else{
			alert("Quote No./version has been changed. Please reload the page.");
		}
	});
	
	$("#closeNotifyCustomer").click(function() {
		$('#notifyCustomerDialog').dialog('close');
		$('#notifyExtAdditional').val("");
	});

	$("#notifyCustomer").click(function() {
		notifyCustomer();
	});

	/*************************************************************/
	
	$("#notifyInternal").click(function() {
		notifyInternal();
	});
	
	$('#notifyInternalDialog').dialog({
		autoOpen : false,
		width : 400,
		modal : true,
		open : function() {
			onNotifyInternalDialogOpen();
		},
		close : function() {
			onNotifyInternalDialogClose();
		},
		buttons : {
	        Close: function(){
	        	$("#notifyInternalDialog").dialog("close");
	        },
	        Send: function() {
	        	notifyInternal();
	        }
		}
	});
	
	$("#sendInternal").click(function() {
		var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
		if(quoteString == newQuoteString){
			var statusCodeVal = $('#statusCode').val();			
			if(statusCodeVal == "PEND" || statusCodeVal == "APPR" || statusCodeVal == "CNCL" || statusCodeVal == "") {
				alert ("Only ISSD (issued) or BKGD (booked) quotes may be faxed or e-mailed");
				return;
			}
	
			$('#notifyInternalDialog').dialog('open');
		}else{
			alert("Quote No./version has been changed. Please reload the page.");
		}
	});
	
	$("#isNotifyIntEmail").click(function() {
		if ($("#isNotifyIntEmail").is(':checked')==true) {
			$("#notifyExtMailId").removeAttr("disabled");
		} else {
			$("#notifyExtMailId").val("");
			$("#notifyExtMailId").attr("disabled", true);
		}
	});
	
	$("#closeNotifyInternal").click(function() {
		$('#notifyInternalDialog').dialog('close');
	});
	
	$("#notifyIntChargeSummary").click(function() {
		verifyIfConstructedQuote();
	});
	
	$("#isNotifyIntPricing").change(function() {
		if ($('#isConstructed').is(':checked')) {
			$("#notifyIntChargeDetail").attr("checked", true);
			$("#notifyIntChargeSummary").removeAttr("checked");
			if ($("#isNotifyIntPricing").is(":checked") ){
				$("#notifyIntChargeSummary").attr("readonly", true);
			} else {
				$("#notifyIntChargeSummary").removeAttr("readonly");
			}
		}
	});

	if(_readonly){
		//Commented for Defect D026522
		//$('#quoteModify').gatesDisable();
		$('#commentsNHistoryDiv').gatesDisable({exclude:['DocumentHistory']});
		
	}
	//Written dochistory permission for Defect D026727
	if(!isDocHistory)
		{
		  //$('#commentsNHistoryDiv').gatesDisable();
		  $('#DocumentHistory').css('visibility','hidden');
		}
		
	if(isCommodityDisplayOnly && !isCommodityModifiable){
		$('#commodityDivGrid').gatesDisable();
			}
	
	if(isChargeDisplay && !isChargeModifiable){
		$('#chargeDivGrid').gatesDisable();
	}

});

function notifyCustomer() {
	$("#notifyMailId").val($.trim($("#notifyMailId").val()));
	var isValid = validateNotifyCustomerSend();
	if (!isValid) {
		return;
	}
	
	var isReference = "N";
		if($('#isReference').is(":checked")){
			isReference = "Y";
		}
		var isFax = false;
		if($('#isFax').is(":checked")){
			isFax =true;
		}
		
		var isEmail = false;
		if($('#isEmail').is(":checked")){
			isEmail =true;
		}
		//D030341: 	Error Quote
		// var params = "notifyMailId=" + $('#notifyMailId').val() +"&isReference=" + isReference +"&notifyFax=" + $('#notifyFax').val() +"&isEmail=" + isEmail + "&isFax=" +isFax;
		/*var params = 
			"notifyMailId=" + $('#notifyMailId').val() +
			"&notifyContact=" + $('#notifyContactName').val() +
			"&isReference=" + isReference +
			"&notifyFax=" + $('#notifyFax').val() +
			"&isEmail= "+ isEmail + 
			"&notifyExtAdditional=" + $('#notifyExtAdditional').val()+ 
			"&customerGroupSelected=" + $("#customerGroup :selected").text()+
			"&isFax= "+isFax;*/
	blockUI();
	$.ajax({
		type : "POST",
		url : _context + "/quote/notifyCustomer",
		//data : params,
		data : {
			notifyMailId : $('#notifyMailId').val(),
			notifyContact : $('#notifyContactName').val(),
			isReference : isReference,
			notifyFax : $('#notifyFax').val(),
			isEmail : isEmail,
			notifyExtAdditional : $('#notifyExtAdditional').val(),
			customerGroupSelected : $("#customerGroup :selected").text(),
			isFax : isFax
		},
		success : function(responseText) {
			showResponseMessages(responseText.messages);
			_isQuoteChanged = false;
			$.unblockUI();
		}
	});

	$('#notifyCustomerDialog').dialog('close');
	$('#notifyExtAdditional').val("");
}

function notifyInternal() {
	
	if($("#isNotifyIntEmail").is(":checked")){
		if($("#notifyExtMailId").val() == ""){
			alert("Please provide valid Email Id.");
			return false;
		}
	}
	if(!($("#isNotifyIntEmail").is(":checked")) && !($("#isNotifyIntAS").is(":checked"))){
		alert("Please Select Either Self or E-mail ");
		return false;
	}
	var validate= false;
	
    var param1 = "";
    if($('#notifyIntChargeDetail').attr("checked")=="checked"){
    	param1="checked";
    }
    
    var isNotifyIntPricing = "N";
    var isNotifyIntAS = "N";
    var isNotifyIntASTeam = "N";
    var isNotifyIntComments = "N";
    var isNotifyIntReference = "N";
  
    if($("#isNotifyIntReference").is(":checked")){
    	isNotifyIntReference = "Y";
    }

    if ($("#isNotifyIntAS").is(":checked")) {
    	isNotifyIntAS = "Y";
    }

    if ($("#isNotifyIntComments").is(":checked")) {
    	isNotifyIntComments = "Y";
    }
    
    //D030341: 	Error Quote
   /* var params =  "&isNotifyIntAS=" + isNotifyIntAS + "&notifyContact=" + $('#notifyContactName').val() +"&isNotifyIntComments=" + isNotifyIntComments + 
					"&notifyIntAdditional=" + $('#notifyIntAdditional').val()+"&radioNotifyCharges=" + param1 +
					"&notifyIntMailId=" + $("#notifyExtMailId").val() + "&notifyReference=" + isNotifyIntReference +
					"&customerGroupSelected=" + $("#customerGroup :selected").text();*/
	blockUI();
	$.ajax({
		type : "POST",
		url : _context + "/quote/notifyInternal",
		//data : params,
		data : {
			isNotifyIntAS : isNotifyIntAS,
			notifyContact : $('#notifyContactName').val(),
			isNotifyIntComments : isNotifyIntComments,
			notifyIntAdditional : $('#notifyIntAdditional').val(),
			radioNotifyCharges : param1,
			notifyIntMailId : $("#notifyExtMailId").val(),
			notifyReference : isNotifyIntReference,
			customerGroupSelected : $("#customerGroup :selected").text()
		},
		success : function(responseText) {
			showResponseMessages(responseText.messages);
			_isQuoteChanged = false;
			$('#notifyInternalDialog').dialog('close');
			$.unblockUI();
		}
	});

	$('#notifyInternalDialog').dialog('close');
}

function validateNotifyCustomerSend() {
	if ($("#isEmail").is(':checked') && $.trim($("#notifyMailId").val()) == "") {
		alert("Please enter customer's E-Mail ID!");
		return false;
	} else if ($("#isFax").is(':checked') && $.trim($("#notifyFax").val()) == "") {
		alert("Please enter customer's Fax Number!");
		return false;
	} else if (!$("#isEmail").is(':checked') && !$("#isFax").is(':checked')) {
		alert("Please select method to send the Quote!");
		return false;
	}
	var re = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	var reFax = new RegExp(/^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/);
	
	if ($("#notifyMailId").val()!="" && !re.test($("#notifyMailId").val())) {
		alert("* Invalid email address");
		return false;
	}
	
	var value = $("#notifyFax").val();
	if ($("#notifyFax").val()!="") {
		if(value.length<10 || value.length>20) {
			alert('Fax number has to be numeric and should be of 10 digits (Minimum)');
			return false;
		}
		if ($("#notifyFax").val()!="" && !reFax.test($("#notifyFax").val())) {
			alert('Fax number has to be numeric and should be of 10 digits (Minimum)');
			return false;
		}
	}
	
	return true;
}

function onNotifyCustomerDialogOpen() {	
	var isEmailPresent = false;
	var isFaxPresent = false;
	
	if($("#notifyMailId").val() != "" && $("#notifyMailId").val().trim().length > 0){
		isEmailPresent = true;
		
	}else if($("#notifyMailHidden").val() != "" && $("#notifyMailHidden").val().trim().length > 0){
		isEmailPresent = true;
		$("#notifyMailId").val($("#notifyMailHidden").val());
		
	}

	/*   A new check for isFax should be that on initial load,
	 * if the email is already enabled, we do not want to have fax also.
	 * 
	 * So the final rule is:
	 * 1. If neither email/fax are present, then both should be unchecked/disabled.
	 * 2. If email present & fax not present, then just email should be checked/enabled.
	 * 3. If fax present & email not present, then just fax should be checked/enabled.
	 * 4. If both fax & email are present, then just email should be checked/enabled.
	 * 
	 * #4 is the new/updated rule, based on defect 21784.
	 */
	if(!isEmailPresent && $("#notifyFax").val() != "" && $("#notifyFax").val().trim().length > 0){
		isFaxPresent = true;
	}else if(!isEmailPresent && $("#notifyFaxHidden").val() != "" && $("#notifyFaxHidden").val().trim().length > 0){
		isFaxPresent = true;		
		$("#notifyFax").val($("#notifyFaxHidden").val());
		
	}

	if(isEmailPresent ){
		$("#isEmail").attr("checked", true);
		$("#notifyMailId").removeAttr("disabled");
	}else if (isFaxPresent ){
		$("#isFax").attr("checked", true);
		$("#notifyFax").removeAttr("disabled");
	}else{
		$("#notifyMailId").attr("disabled", true);
		$("##notifyFax").attr("disabled", true);
	}
	
	if($('#referenceNumber').val() != "" && $("#referenceNumber").val().trim().length > 0){
		$("#isReference").attr("checked", true);
	}
	$("#notifyMailId").removeAttr("disabled");
}

function onNotifyCustomerDialogClose() {
	
}

function onNotifyInternalDialogOpen() {
	
	$("#isNotifyIntReference").attr("checked", true);
	$("#isNotifyIntEmail").attr("checked", true);
	$("#isNotifyIntEmail").attr("readonly", true);
	$("#isNotifyIntAS").removeAttr("checked");
	$("#isNotifyIntASTeam").attr("checked", true);
	$("#isNotifyIntPricing").removeAttr("checked");
	$("#isNotifyIntComments").attr("checked", true);
	$("#notifyIntChargeDetail").attr("checked", true);
	$("#notifyIntChargeSummary").removeAttr("checked");
	
	$("#notifyIntAdditional").val("");
	verifyIfConstructedQuote();
}

function onNotifyInternalDialogClose() {
}

function verifyIfConstructedQuote() {
	if (!$('#isConstructed').is(':checked')) {
		$("#notifyIntChargeDetail").attr("checked", true);
		$("#notifyIntChargeSummary").removeAttr("checked");
		$("#notifyIntChargeSummary").attr("readonly", true);
	} else {
		if ($("#isNotifyIntPricing").is(":checked") ){
			$("#notifyIntChargeDetail").attr("checked", true);
			$("#notifyIntChargeSummary").removeAttr("checked");
			$("#notifyIntChargeSummary").attr("readonly", true);
		} else {
			$("#notifyIntChargeSummary").removeAttr("readonly");
		}
	}
}

var digits = "0123456789";
//non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
//characters which are allowed in international phone numbers
//(a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
//Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

function isInteger(s) {
	var i;
	for (i = 0; i < s.length; i++) {   
		// Check that current character is number.
		var c = s.charAt(i);
		if (((c < "0") || (c > "9"))) return false;
	}
	// All characters are numbers.
	return true;
}

function trim(s) {
	var i;
	var returnString = "";
	// Search through string's characters one by one.
	// If character is not a whitespace, append to returnString.
	for (i = 0; i < s.length; i++) {   
		// Check that current character isn't whitespace.
		var c = s.charAt(i);
		if (c != " ") returnString += c;
	}
	return returnString;
}

function stripCharsInBag(s, bag) {
	var i;
	var returnString = "";
	// Search through string's characters one by one.
	// If character is not in bag, append to returnString.
	for (i = 0; i < s.length; i++) {
		// Check that current character isn't whitespace.
		var c = s.charAt(i);
		if (bag.indexOf(c) == -1) returnString += c;
	}
	return returnString;
}

function checkInternationalPhone(strPhone){
	var bracket=4;
	strPhone=trim(strPhone);
	var brchr=strPhone.indexOf("(");
	if(strPhone.indexOf("+")>1){
		return false;
	}
	
	if(brchr!=-1 && brchr>bracket){
		return false;
	}
	
	if(brchr!=-1 && strPhone.charAt(brchr+4)!=")"){
		return false;
	}
	if(strPhone.indexOf("(")==-1 && strPhone.indexOf(")")!=-1){
		return false;
	}
	s = stripCharsInBag(strPhone, validWorldPhoneChars);
	return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}
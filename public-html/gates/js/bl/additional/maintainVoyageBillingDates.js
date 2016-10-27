/**
 * Maintain Voyage Billing Dates
 */

$(function() {
	
	vvdChange=false;
	$('#vesselCode').focus(function() {
		$('form').validationEngine('hideAll');
	});

	$("input:text").focus(function() {
		$(this).select();
	});

	$('#voyageNumber').focus(function() {
		$('form').validationEngine('hideAll');
	});

	$('#directionSeq').focus(function() {
		$('form').validationEngine('hideAll');
	});
	
	$('#voyDocNumber').change(function(){
		$('#voyDocNumber').val($('#voyDocNumber').val().toUpperCase());
	});
	

	$('#blitVoyageForm').validationEngine('attach');
	tabSequence('#blitVoyageForm');
	$('#msgDiv').hide();
	setScreenDetails();
	validateDateOnTabOut();
	makeInternatonalBillingDateRequired(false);
	
	$('#updateBtn').attr("disabled","true");
	
	
	$('#billingTriggerDateInitial').change(
			function() {
				$('#billingTriggerDateFinal').val(
						$('#billingTriggerDateInitial').val());
			});

	$('#goBtn').click(function() {
		$('#msgDiv').hide();
		/*
		 * added for Defect D019517, need to open this code and remove custom
		 * validation required from JSP if(!validateSearchParameter()){ return; }
		 */
		makeInternatonalBillingDateRequired(false);
		if (!$("#blitVoyageForm").validationEngine('validate')) {
			return;
		} else {
			if (validateVVD() == true){
				vvdChange=false;
				$('#updateBtn').attr('disabled', false);
				displayVoyageBillingDates();
			}
		}

	});

	// Shipment Save
	$('#updateBtn').click(
			function() {
				if(vvdChange){
					$('#msgDiv').html("<div class=\"message_error\">A search filter has been modified.Please search again for the new parameters.</div>");
				}else{
				if ($('#voyageId').val() == ''
						|| $('#voyageId').val() == undefined) {
					$('#goBtn').validationEngine('showPrompt',
							'Search VVD first to update', 'error', 'topRight',
							true);
					return;
				}
				if (!$("#blitVoyageForm").validationEngine('validate')) {
					return;
				} else {
					if ($("#anyChangesDone").val() == '') {
						showNoChangeMessage();
					} else {
						if (validateVoyage()) {
							showSavingMessage();
							saveVoyage();
							$("#anyChangesDone").val('');
						}
					}
				}
				}
			});

	// Reset fields by Clear Button
	$('#clearBtn').click(function() {
		$("#vesselCode").val('');
		$("#voyageNumber").val('');
		$("#directionSeq").val('');
		$('div[id=vesselRouteSegmentDepartDate]').html("");
		$("#voyDocNumber").val('');
		$("#billingReportCloseDate").val('');
		$("#billingTriggerDateInitial").val('');
		$('div[id=isCsr_manual_update]').html("");
		$("#usflTriggerDate").val('');
		$('#msgDiv').hide();
		$('#updateBtn').attr("disabled","true");
	});

	$('input').change(function() {
		$("#anyChangesDone").val('Y');
	});
	$('#vesselCode,#voyageNumber,#directionSeq').change(function() {
		if($('#updateBtn').attr("disabled")==undefined){
			vvdChange=true;
		}
		$("#anyChangesDone").val('');
	});
	/* Security Shipment */
	enforceSecurityDivAndButtons('maintainVoyageBillingDatesMainDiv',
			isBLITDisplayOnly);
	enforceSecurityDivAndButtons('updateBtn', isBLITModifiable);
	
	 $('#vesselCode').keypress(function(){
		 setTimeout(function(){
			 var len=$('#vesselCode').val().length;
			 if(len>2)
				 {				 	 
					 $('#voyageNumber').focus();	
					 $('#voyageNumber').select();
				 }	 
		 },100);
		 			
	 });
	 $('#voyageNumber').keypress(function(){
		 setTimeout(function(){
			 var len=$('#voyageNumber').val().length;
			 if(len>2)
				 {
				 	$('#directionSeq').focus();
				 	$('#directionSeq').select();
				 }
		 },100);
	 });
	  $('#directionSeq').keypress(function(){
		  setTimeout(function(){
			 var len=$('#directionSeq').val().length;
			 if(len>0)
				 {
				 	$('#goBtn').focus();
				 }
		  },100);
	 }); 
	
});

// Method to set screen details
function setScreenDetails() {
	$("#billingReportCloseDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#billingTriggerDateInitial").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#usflTriggerDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
}

// method to show loading message
function showLoadingMessage() {

	var voyage_Number = $("#voyageNumber").val();
	var vessel_Code = $("#vesselCode").val();
	var direction_Seq = $("#directionSeq").val();

	$('#msgDiv').html(
			"<div class=\"message_info\">Loading VVD " + voyage_Number + "-"
					+ vessel_Code + "-" + direction_Seq + " ...</div>");
	$('#msgDiv').show();
}

// method to show NO changes message
function showNoChangeMessage() {
	$('#msgDiv')
			.html(
					"<div class=\"message_info\">Please make some changes before updating.</div>");
	$('#msgDiv').show();
}

// method to show saving message
function showSavingMessage() {
	$("#updateBtn").attr("disabled", true);
	var entity = "Voyage";
	$('#msgDiv').html(
			"<div class=\"message_info\">Please wait while " + entity
					+ " is updated...</div>");
	window.scrollTo(0, 0);
	$('#msgDiv').show();
}
// method to show successful saving message
function showSuccessSavingMessage() {
	$("#updateBtn").attr("disabled", false);
	var entity = "Voyage";
	$('#msgDiv').html(
			"<div class=\"message_success\">" + entity
					+ " updated successfully</div>");
	window.scrollTo(0, 0);
	$('#msgDiv').show();
}
// Method to show non existing bill message
function showNonExistingMessage() {
	$('#msgDiv')
			.html(
					"<div class=\"message_error\">Vessel/Voyage specified is invalid..</div>");
	$('#msgDiv').show();

}
// To show success loading message
function showSuccessLoadingMessage() {
	$('#msgDiv').html(
			"<div class=\"message_info\"> VVD loaded successfully</div>");
	$('#msgDiv').show();
}

/*
 * Method to display Voyage Detail
 */
function displayVoyageBillingDates() {
	var vessel_code = $("#vesselCode").val().toUpperCase();
	var voyage_number = $("#voyageNumber").val().toUpperCase();
	var direction_seq = $("#directionSeq").val().toUpperCase();

	$.ajax({
		async : false,
		type : "POST",
		url : _context + "/voyage/populateVoyage",
		data : {
			vessel_code : vessel_code,
			voyage_number : voyage_number,
			direction_seq : direction_seq,
		},
		success : function(responseText) {
			// Clear fields of Shipment form and reset the defaults
			if (responseText.data == null || responseText.data == undefined
					|| responseText.data == 'null') {
				clearPageOnLoad();
				$('#updateBtn').attr("disabled","true");
				// showNonExistingMessage();
				showResponseMessages("msgDiv", responseText);
				$('#vesselCode').focus();
			} else {
				clearPageOnLoad();
				refreshScreenFields(responseText);
				showSuccessLoadingMessage();
				// showResponseMessages("msgDiv", responseText);
				makeInternatonalBillingDateRequired(true);
				$('#vesselCode').focus();
				$('#voyDocNumber').val($('#voyDocNumber').val().toUpperCase());
			}
			if(responseText.success==false){
				$('#updateBtn').attr("disabled","true");
			}
		}
	});
}

/**
 * Method to clear screen fields
 */
function clearPageOnLoad() {
	// $('#blitVoyageForm').clearForm();
	$("#voyDocNumber").val("");// defect no. 19517
	$("#voyageId").val("");
	$("#billingReportCloseDate").val("");
	$("#billingTriggerDateInitial").val("");
	$("#billingTriggerDateFinal").val("");
	$("#usflTriggerDate").val("");
	$("#vesselRouteSegmentDepartDate").val("");
	$("#pacNumber").val("");
	$("#isCsr_manual_update").val("");
	$("#anyChangesDone").val("");
	$('div[id=vesselRouteSegmentDepartDate]').html("");
	$('div[id=isCsr_manual_update]').html("");

}
/**
 * Method to refresh screen fields after success of go button
 * 
 * @param responseText
 */
function refreshScreenFields(responseText) {
	$("#maintainVoyageBillingDates").loadJSON(responseText.data);
	if (responseText.data.isCsr_manual_update == 'Y') {
		$("#isCsr_manual_update").val("Yes");
	} else {
		$("#isCsr_manual_update").val("No");
	}
}

/**
 * Meyhod to save voyage.
 */
function saveVoyage() {
	var blitVoyageForm = $('#blitVoyageForm').formSerialize();
	urlStr = _context + "/voyage/save";
	$.ajax({
		type : "POST",
		url : urlStr,
		data : blitVoyageForm,
		success : function(responseText) {
			$("#updateBtn").attr("disabled", false);
			if (responseText.success == true) {
				showSuccessSavingMessage();
				refreshScreenFields(responseText);
			}
			if (responseText.success == false) {
				showResponseMessages("msgDiv", responseText);
			}
		}
	});

}

// Method to show response message.
function showResponseMessages(msgDivId, responseText) {
	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {

				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			$('#' + msgDivId).css('display', 'block');
			window.scrollTo(0, 0);
		}
	}
}
// Method to validate Voyage fileds
function validateVoyage() {
	var isvalid = validateDateOnUpdate();
	return isvalid;
}

// Method to validate date entered
function validateDate(dateId, showPrompt) {
	var date = $('#' + dateId).val();
	if ($.trim(date) == "") {
		return true;
	} else {
		var dateSize = date.length;
		var day;
		var month;
		var fullYear;
		var newDate;
		if (dateSize == 6) {
			month = parseInt(date.substring(0, 2), 10);
			day = parseInt(date.substring(2, 4), 10);
			fullYear = parseInt("20" + date.substring(4, 6), 10);
			newDate = date.substring(0, 2) + "-" + date.substring(2, 4) + "-20"
					+ date.substring(4, 6);
		} else if (dateSize == 8) {
			month = parseInt(date.substring(0, 2), 10);
			day = parseInt(date.substring(2, 4), 10);
			fullYear = parseInt(date.substring(4, 8), 10);
			newDate = date.substring(0, 2) + "-" + date.substring(2, 4) + "-"
					+ date.substring(4, 8);
		} else if (dateSize == 10) {
			month = parseInt(date.substring(0, 2), 10);
			day = parseInt(date.substring(3, 5), 10);
			fullYear = parseInt(date.substring(6, 10), 10);
			newDate = date.substring(0, 2) + "-" + date.substring(3, 5) + "-"
					+ date.substring(6, 10);
		} else {
			if (showPrompt) {
				$('#' + dateId).validationEngine('showPrompt',
						'* Enter date in Format(mm-dd-yyyy)', 'error',
						'topRight', true);
			}
			return false;
		}

		if (isNaN(day) || isNaN(month) || isNaN(fullYear)) {
			if (showPrompt) {
				$('#' + dateId).validationEngine('showPrompt',
						'* Enter date in Format(mm-dd-yyyy)', 'error',
						'topRight', true);
			}
			return false;
		} else {
			if (fullYear < 1 || fullYear > 9999) {
				if (showPrompt) {
					$('#' + dateId).validationEngine('showPrompt',
							'* Enter date in Format(mm-dd-yyyy)', 'error',
							'topRight', true);
				}
				return false;
			} else if (month < 1 || month > 12) {
				if (showPrompt) {
					$('#' + dateId).validationEngine('showPrompt',
							'* Enter date in Format(mm-dd-yyyy)', 'error',
							'topRight', true);
				}
				return false;
			} else if (day < 1 || day > 31) {
				if (showPrompt) {
					$('#' + dateId).validationEngine('showPrompt',
							'* Enter date in Format(mm-dd-yyyy)', 'error',
							'topRight', true);
				}
				return false;
			} else {
				var isLeapYear = false;
				if ((fullYear % 4) == 0)
					isLeapYear = true;

				if (month == 2 && isLeapYear && day > 29) {
					if (showPrompt) {
						$('#' + dateId).validationEngine('showPrompt',
								'* Enter date in Format(mmm-dd-yyyy)', 'error',
								'topRight', true);
					}
					return false;
				} else if (month == 2 && !isLeapYear && day > 28) {
					if (showPrompt) {
						$('#' + dateId).validationEngine('showPrompt',
								'* Enter date in Format(mm-dd-yyyy)', 'error',
								'topRight', true);
					}
					return false;
				} else if ((month == 4 || month == 6 || month == 9 || month == 11)
						&& day > 30) {
					if (showPrompt) {
						$('#' + dateId).validationEngine('showPrompt',
								'* Enter date in Format(mm-dd-yyyy)', 'error',
								'topRight', true);
					}
					return false;
				} else {
					$('#' + dateId).val(newDate);
					return true;
				}
			}
		}
	}
}
// Method to validate Date fields available on tabOut
function validateDateOnTabOut() {
	var isValid = true;
	$('#billingTriggerDateInitial')
			.blur(
					function() {
						if (!validateDate('billingTriggerDateInitial')) {
							$('#billingTriggerDateInitial')
									.validationEngine(
											'showPrompt',
											'Domestic Billing Trigger Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
											'error', 'topRight', true);
							isValid = false;
						}
					});
	$('#usflTriggerDate')
			.blur(
					function() {
						if (!validateDate('usflTriggerDate')) {
							$('#usflTriggerDate')
									.validationEngine(
											'showPrompt',
											'International Billing Trigger Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
											'error', 'topRight', true);
							isValid = false;
						}
					});
	$('#billingReportCloseDate')
			.blur(
					function() {
						if (!validateDate('billingReportCloseDate')) {
							$('#billingReportCloseDate')
									.validationEngine(
											'showPrompt',
											'Accounting Billing Reports Closed Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
											'error', 'topRight', true);
							isValid = false;
						}
					});
}

// Method to validate Date fields while saving
function validateDateOnUpdate() {
	var isValid = true;

	if (!validateDate('billingTriggerDateInitial')) {
		$('#billingTriggerDateInitial')
				.validationEngine(
						'showPrompt',
						'Domestic Billing Trigger Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
						'error', 'topRight', true);
		isValid = false;
	}

	if (!validateDate('usflTriggerDate')) {
		$('#usflTriggerDate')
				.validationEngine(
						'showPrompt',
						'International Billing Trigger Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
						'error', 'topRight', true);
		isValid = false;
	}
	;

	if (!validateDate('billingReportCloseDate')) {
		$('#billingReportCloseDate')
				.validationEngine(
						'showPrompt',
						'Accounting Billing Reports Closed Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
						'error', 'topRight', true);
		isValid = false;
	}
	return isValid;
}

// Method to make InternatonalBillingDate required or not as per parameter
// passed.
function makeInternatonalBillingDateRequired(make) {
	if (make == true) {
		$('#usflTriggerDate').attr("class", "validate[required]");
	} else {
		$('#usflTriggerDate').attr("class", "");
	}
}
/* new method added for Defect D019517 */
function validateSearchParameter() {
	var vessel_code = $("#vesselCode").val();
	var voyage_number = $("#voyageNumber").val();
	var direction_seq = $("#directionSeq").val();

	if (vessel_code == null || vessel_code == '') {
		$('#vesselCode').validationEngine('showPrompt', 'Vessel code required',
				'error', 'topRight', true);
		$('#vesselCode').focus();
		return false;
	}
	if (voyage_number == null || voyage_number == '') {
		$('#voyageNumber').validationEngine('showPrompt',
				'Voyage code required', 'error', 'topRight', true);
		$('#voyageNumber').focus();
		return false;
	}
	if (direction_seq == null || direction_seq == '') {
		$('#directionSeq').validationEngine('showPrompt',
				'Direction sequence required', 'error', 'topRight', true);
		$('#directionSeq').focus();
		return false;
	}
	return true;
}

// defect no. 19517

function validateVVD() {
	var letters = /^[A-Za-z]+$/;
	var numbers = /^[0-9]+$/;
	var isValid = true;
	if (($('#vesselCode').val() == '' || $('#vesselCode').val() == null)
			&& !$('#vesselCode').val().match(letters)) {
		$('#vesselCode').validationEngine('showPrompt',
				'*This field is required<br>*Letters only', 'error',
				'topRight', true);
		isValid = false;
	} else if (!$('#vesselCode').val().match(letters)) {
		$('#vesselCode').validationEngine('showPrompt', '*Letters only',
				'error', 'topRight', true);
		isValid = false;

	} else if (($('#vesselCode').val() == '' || $('#vesselCode').val() == null)) {
		$('#vesselCode').validationEngine('showPrompt',
				'*This field is required', 'error', 'topRight', true);
		isValid = false;
	}

	else {

		if (($('#voyageNumber').val() == '' || $('#voyageNumber').val() == null)
				&& !$('#voyageNumber').val().match(numbers)) {
			$('#voyageNumber').validationEngine('showPrompt',
					'*This field is required<br>*Only digits are allowed',
					'error', 'topRight', true);
			isValid = false;
		} else if (!$('#voyageNumber').val().match(numbers)) {
			$('#voyageNumber').validationEngine('showPrompt',
					'*Only digits are allowed', 'error', 'topRight', true);
			isValid = false;
		} else if (($('#voyageNumber').val() == '' || $('#voyageNumber').val() == null)) {
			$('#voyageNumber').validationEngine('showPrompt',
					'*This field is required', 'error', 'topRight', true);
			isValid = false;
		} else {

			if (($('#directionSeq').val() == '' || $('#directionSeq').val() == null)
					&& !$('#directionSeq').val().match(letters)) {
				$('#directionSeq').validationEngine('showPrompt',
						'*This field is required<br>*Letters only', 'error',
						'topRight', true);
				isValid = false;
			} else if (!$('#directionSeq').val().match(letters)) {
				$('#directionSeq').validationEngine('showPrompt',
						'*Letters only', 'error', 'topRight', true);
				isValid = false;
			} else if (($('#directionSeq').val() == '' || $('#directionSeq')
					.val() == null)) {
				$('#directionSeq').validationEngine('showPrompt',
						'*This field is required', 'error', 'topRight', true);
				isValid = false;
			}

		}
	}
	return isValid;
}

function convertUpper() {
	$("#vesselCode").val(($("#vesselCode").val()).toUpperCase());
	$("#voyageNumber").val(($("#voyageNumber").val()).toUpperCase());
	$("#directionSeq").val(($("#directionSeq").val()).toUpperCase());
}
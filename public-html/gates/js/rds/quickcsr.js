/**
 *
 */
$(document).ready(function() {


    if ($('#BRD47OR').val() == "BRD48OR")
    {
        $("#vesselCode").keyup(function(evt) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            if (key == '16' || key == '9' || key == '8' || key == '46')
                return;
            if ($('#vesselCode').val().length == 3) {
                $('#vesselCode').val($('#vesselCode').val().toUpperCase());
                $('#voyageNumber').focus();
            }
        });
        $("#voyageNumber").keyup(function(evt) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            if (key == '16' || key == '9' || key == '8' || key == '46')
                return;
            if ($('#voyageNumber').val().length == 3) {
                $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
                $('#direction').focus();
            }
        });

        $("#direction").keyup(function(evt) {
            if ($('#direction').val().length == 1) {
                $('#direction').val($('#direction').val().toUpperCase());
                $('#BRD47OR').focus();
            }
        });
    }
    else
    if ($('#BRD48OR').val() == "BRD47OR")
    {
        $("#vesselCode").keyup(function(evt) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            if (key == '16' || key == '9' || key == '8' || key == '46')
                return;
            if ($('#vesselCode').val().length == 3) {
                $('#vesselCode').val($('#vesselCode').val().toUpperCase());
                $('#voyageNumber').focus();
            }
        });
        $("#voyageNumber").keyup(function(evt) {
            var theEvent = evt || window.event;
            var key = theEvent.keyCode || theEvent.which;
            if (key == '16' || key == '9' || key == '8' || key == '46')
                return;
            if ($('#voyageNumber').val().length == 3) {
                $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
                $('#direction').focus();
            }
        });

        $("#direction").keyup(function(evt) {
            if ($('#direction').val().length == 1) {
                $('#direction').val($('#direction').val().toUpperCase());
                $('#BRD48OR').focus();
            }
        });
    }
    //D026970 - adding default value initially
    $('#passegdt').val('12-31-9999');
});
$(function() {

    $('#BRD47OR').click(function() {
        quickCSRSubmit('BRD47OR');
    });
    $('#BRD48OR').click(function() {
        quickCSRSubmit('BRD48OR');
    });


});

function quickCSRSubmit(buttonName) {
    var isValid = true;

    if ($('#vesselCode').val() == '')
    {
        $('#vesselCode').validationEngine('showPrompt', 'Vessel Code is required', 'error', 'topRight', true);
        isValid = false;
    }
    else if (!/^[a-zA-Z]+$/.test($.trim($('#vesselCode').val()))) {
        $('#vesselCode').validationEngine('showPrompt', 'Only Alphabetes allowed for Vessel Code', 'error', 'topRight', true);
        isValid = false;
    }

    var voyage = $.trim($('#voyageNumber').val());
    if ($('#voyageNumber').val() == '')
    {
        $('#voyageNumber').validationEngine('showPrompt', 'Voyage is required', 'error', 'topRight', true);
        isValid = false;
    }
    else if (!/^[0-9\ ]+$/.test(voyage)) {
        $('#voyageNumber').validationEngine('showPrompt', 'Voyage  must be numeric', 'error', 'topRight', true);
        isValid = false;
    }

    var direction = $.trim($('#direction').val());
    if ($('#direction').val() == '') {
        $('#direction').validationEngine('showPrompt', 'Direction is required', 'error', 'topRight', true);
        isValid = false;
    }
    else if (!/^[a-zA-Z]+$/.test($.trim($('#direction').val()))) {
        $('#direction').validationEngine('showPrompt', 'Only Alphabetes allowed for Direction', 'error', 'topRight', true);
        isValid = false;
    }

    var reInitialTriggerDate = validateDate($('#effectiveDate').val());
    $('#finaltrgdt').val($('#effectiveDate').val());
    var reFinalTriggerDate = validateDate($('#finaltrgdt').val());
    var rePassSegmentDate = validateDate($('#passegdt').val());
    var reRunDate = validateDate($('#rundate').val());

    if (reInitialTriggerDate == "false" || reInitialTriggerDate == false)
    {
        $('#effectiveDate').validationEngine('showPrompt', 'Date Not Valid', 'error', 'topRight', true);
        isValid = false;
    }
    else if (reInitialTriggerDate == "date_not_in_format" || reInitialTriggerDate == null || reInitialTriggerDate == "null")
    {
        $('#effectiveDate').validationEngine('showPrompt', 'Date Not Valid. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
        isValid = false;
    }

    if (reFinalTriggerDate == "false" || reFinalTriggerDate == false)
    {
        $('#finaltrgdt').validationEngine('showPrompt', 'Date Not Valid', 'error', 'topRight', true);
        isValid = false;
    }
    else if (reFinalTriggerDate == "date_not_in_format" || reFinalTriggerDate == null || reFinalTriggerDate == "null")
    {
        $('#finaltrgdt').validationEngine('showPrompt', 'Date Not Valid. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
        isValid = false;
    }

    if (rePassSegmentDate == "false" || rePassSegmentDate == false)
    {
        $('#passegdt').validationEngine('showPrompt', 'Date Not Valid', 'error', 'topRight', true);
        isValid = false;
    }
    else if (rePassSegmentDate == "date_not_in_format" || rePassSegmentDate == null || rePassSegmentDate == "null")
    {
        $('#passegdt').validationEngine('showPrompt', 'Date Not Valid. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
        isValid = false;
    }

    if (reRunDate == "false" || reRunDate == false)
    {
        $('#rundate').validationEngine('showPrompt', 'Date Not Valid', 'error', 'topRight', true);
        isValid = false;
    }
    else if (reRunDate == "date_not_in_format" || reRunDate == null || reRunDate == "null")
    {
        $('#rundate').validationEngine('showPrompt', 'Date Not Valid. Enter date in Format(MM-dd-yyyy)', 'error', 'topRight', true);
        isValid = false;
    }

    var valInitialTriggerDate = $('#effectiveDate').val();
    var valFinalTriggerDate = $('#finaltrgdt').val();
    var arrayInitialTriggerDateParts = valInitialTriggerDate.split("-");
    var arrayFinalTriggerDateParts = valFinalTriggerDate.split("-");
    var initialTriggerDate = new Date(arrayInitialTriggerDateParts[2], arrayInitialTriggerDateParts[0] - 1, arrayInitialTriggerDateParts[1]);
    var finalTriggerDate = new Date(arrayFinalTriggerDateParts[2], arrayFinalTriggerDateParts[0] - 1, arrayFinalTriggerDateParts[1]);

    if (initialTriggerDate > finalTriggerDate)
    {
        $("#effectiveDate").validationEngine('showPrompt', 'Initial Date cannot be greater than Final Date', 'error', 'topRight', true);
        isValid = false;
    }

    if (isValid){
        $.ajax({
            type: "GET",
            url: _context + "/bill_status_history/rdsCheck",
            data: {
                vessel: $("#vesselCode").val(),
                voyage: $("#voyageNumber").val(),
                direction: $("#direction").val()
            },
            success: function(responseText) {
            	var allowQuick = responseText.data;
                if (allowQuick) {
                	 $.ajax({
                         type: "GET",
                         url: _context + "/bill_status_history/validateVVD",
                         data: {
                             vessel: $("#vesselCode").val(),
                             voyage: $("#voyageNumber").val(),
                             direction: $("#direction").val(),
                             effectiveDate: $("#effectiveDate").val(),
                             finaltrgdt: $("#finaltrgdt").val(),
                             passegdt: $("#passegdt").val(),
                             rundate: $("#rundate").val()
                         },
                         success: function(responseText) {
                             var result = responseText.data;

                             if (result)
                             {
                                 $.ajax({
                                     type: "POST",
                                     url: _context + "/rds/batch/search",
                                     data: $('#quickCSRForm').formSerialize() + "&jobName=" + buttonName,
                                     success: function(responseText) {
                                         if (responseText.success == true) {
                                             removeErrorPointers();
                                             showResponseMessages("msgDiv", responseText);
                                             //alert("Job submitted successfully.");

                                         } else {
                                             //alert("Some error occured.");
                                         }
                                     }
                                 });
                                 return true;
                             }
                             else
                             {
                                 $('#direction').validationEngine('showPrompt', 'Vessel/Voyage/Direction specified is invalid', 'error', 'topRight', true);
                                 return false;
                             }
                         }
                     });
                }else {
                	$('#vesselCode').validationEngine('showPrompt', 'Another instance of this job is running. Please try later or contact 1GATESDevTeam@matson.com', 'error', 'topRight', true);
                	return false;
                }
            }
        });
    }
  
}



//functions to validate date
function validateDate(dateControl) {

    var valid = isGoodDate(dateControl);
    if (valid == null || valid == "null")
    {
        return null;
    }
    if (valid) {
        var r = dateControl.split("-");
        var month = r[0];
        var day = r[1];
        var year = r[2];

        if (day > 31)
        {
            return false;
        }
        if (month > 12)
        {
            return false;
        }
        if (day == "31" && (month == "4" || month == "6" || month == "9" || month == "11" || month == "04" || month == "06" || month == "09")) {
            return false;
        } else if (month == "2" || month == "02") {
            //leap year
            if (year % 4 == 0) {
                if (year % 100 == 0 && year % 400 == 0)
                {
                    if (day == "30" || day == "31") {

                        return false;
                    } else {
                        return true;
                    }
                } else {
                    if (day == "30" || day == "31" || day == "29") {

                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                if (day == "29" || day == "30" || day == "31") {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return true;
        }
    } else {
        var msg = date_not_in_format;
        return msg;
    }

    return valid;
}

function isGoodDate(dt) {
    var a = dt.match(/\d{2}-\d{2}-\d{4}/);
    return a;
}

$(function() {

    $("#effectiveDate").datepicker({dateFormat: 'mm-dd-yy'});
});
$(function() {
    $("#finaltrgdt").datepicker({dateFormat: 'mm-dd-yy'});
});
$(function() {
    $("#passegdt").datepicker({dateFormat: 'mm-dd-yy'});
});
$(function() {
    $("#rundate").datepicker({dateFormat: 'mm-dd-yy'});
});
function showResponseMessages(msgDivId, responseText) {
    if (responseText.messages) {

        var messages = responseText.messages;
        var messageContent = '';

        if (messages.error.length > 0) {
            var array = messages.error;
            var len = messages.error.length;
            for (var i = 0; i < len; i++) {
                messageContent += '<div class="message_error">' + array[i] + '</div>';
            }
        }

        if (messages.warn.length > 0) {
            var array = messages.warn;
            var len = messages.warn.length;
            for (var i = 0; i < len; i++) {
                messageContent += '<div class="message_warning">' + array[i] + '</div>';
            }
        }

        if (messages.info.length > 0) {
            var array = messages.info;
            var len = messages.info.length;
            for (var i = 0; i < len; i++) {
                messageContent += '<div class="message_info">' + array[i] + '</div>';
            }
        }


        if (messages.success.length > 0) {
            var array = messages.success;
            var len = messages.success.length;
            for (var i = 0; i < len; i++) {
                messageContent += '<div class="message_success">' + array[i] + '</div>';
            }
        }
        $('#' + msgDivId).html(messageContent);
        if (messageContent != '')
        {
            window.scrollTo(0, 0);
        }
    }
}

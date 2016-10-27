$(document).ready(function(){
	
	$('#cb_standingInstructionGrid').focus();
	
	var options={
	             beforesubmit:showRequest,
	             success:showResponse,
	             datatype:'json'
	             
	};
	$('#instructionSave').click(function(){
	$('#addressRoleStandingInstructionForm').attr("action","createUpdate");
	$('#addressRoleStandingInstructionForm').submit();	
	});
	
	$('#cancelButton').click(function(){
		document.location.href="/gates/addressRole/edit?addressRoleId="+$('#addressRoleId').val();
	});
});

function showRequest(formData, jqForm, options) { 
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData); 
 
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
    //alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
} 
 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
 
    //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
       // '\n\nThe output div should have already been updated with the responseText.');
	
	/*
	 * JSON Response Structure:
	 * {
	 *     status: true/false (ok/not-ok)
	 *     data: { //data used to update page content// },
	 *     messages: [ 
	 *                 {type: 'error', msg: 'actual message'},
	 *                 {type: 'error', msg: 'another error'} 
	 *               ]
	 * }
	 * 
	 * Processing:
	 *   - $('area').loadJSON(data)
	 *   - $('msgArea').loadMessages(messages)
	 */
	$('#addressRoleStandingInstructionForm').loadJSON(responseText.data);

	// msgDiv:
	// <div class="message_success" id="successMsgDiv">Successfully Loaded.</div>
	if (responseText.messages) {
		var messages = responseText.messages;
		var messageContent = '';
		
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}

		
		$('#msgDiv').html('').append(messageContent);
	}
	
	if(responseText.success){
			
		}
		
	
} 
// prepare the form when the DOM is ready
var somethingChanged = false;
var options = {
		// target: '#output2', // target element(s) to be updated with server
		// response
		beforeSubmit : showRequest, // pre-submit callback
		success : showResponse, // post-submit callback

		// other available options:
		// url: url // override for form's 'action' attribute
		// type: type // 'get' or 'post', override for form's 'method' attribute
		dataType : 'json' // 'xml', 'script', or 'json' (expected server
							// response type)
	// clearForm: true // clear all form fields after successful submit
	// resetForm: true // reset the form after successful submit

	// $.ajax options can be used here too, for example:
	// timeout: 3000
	};

$(function() {
	
	
	$('input').change(function() { 
		somethingChanged = true; 
	}); 

	$('input[type="checkbox"]').change(function() { 
		somethingChanged = true; 
	});

	$('textarea').change(function() { 
		somethingChanged = true; 
	}); 
//Modified to Saveclause function for D026145 
	$('#stdClsSave').click(function() {
		/*var isModeUpdate = $("#standardClauseCode").attr("readonly");*/
		if($('#isPrintOnBill').is(':checked')){
	        SaveClause(); 
		}
		else
		 {  			
			alert("Not a Clause");
		  }
		
	});
	$('#stdInstrSave').click(function(){
		if($('#isPrintOnBill').is(':checked'))
		 {
			alert("Not a Instruction");
		 }	
		else
		{
		  SaveClause();
		}
	});
	
});

// pre-submit callback
function showRequest(formData, jqForm, options) {
	// formData is an array; here we use $.param to convert it to a string to
	// display it
	// but the form plugin does this for you automatically when it submits the
	// data
	var queryString = $.param(formData);
	// $('#msgDiv').empty();
	// jqForm is a jQuery object encapsulating the form element. To access the
	// DOM element for the form do this:
	// var formElement = jqForm[0];

	// here we could return false to prevent the form from being submitted;
	// returning anything other than false will allow the form submit to
	// continue
	return true;
}
function SaveClause(){
	
	if($('#isEditable').is(':checked') && $('#isPrintOnBill').is(':checked')){
		blockUI();
		$.ajax({
			type: "GET",
			url: _context +"/quote/showAlertMessage?message=EditableAndBill",
			//data: queryString,
			success: function(responseText){
				showResponseMessages(responseText.messages);
				$.unblockUI();
			}
		});
	}else{
		if(_isModeUpdate == true && somethingChanged==false) {
			// No Fields are changed, hence return.
			 return;
		} else {
			if ($("#standardClauseForm").validationEngine('validate')) {

				if (_isModeUpdate == false) {
					$("#standardClauseForm").attr("action", "createStandardClause");
					_isModeUpdate = true;
				} else if (_isModeUpdate == true) {
					 $("#standardClauseForm").attr("action", "updateStandardClause");
				}

				$("#standardClauseForm").ajaxSubmit(options);
			} else {
				return false;
			}
		}
	}
}

// post-submit callback
function showResponse(responseText, statusText, xhr, $form) {

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

		$('#msgDiv').html(messageContent);
	}

	if (responseText.success) {
		if(_isDelCls)
			$('#stdClsDelete').attr("disabled", false);
		$('#standardClauseCode').attr("readonly", true);
		somethingChanged = false;
		
	} else {
		$('#stdClsDelete').attr("disabled", true);
	}
}
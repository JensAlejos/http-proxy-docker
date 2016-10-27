// prepare the form when the DOM is ready 
$(document).ready(function() { 
	
	
	
    var options = { 
        //target:        '#output2',   // target element(s) to be updated with server response 
        beforeSubmit:  showRequest,  // pre-submit callback 
        success:       showResponse,  // post-submit callback 
 
        // other available options: 
        //url:       url         // override for form's 'action' attribute 
        //type:      type        // 'get' or 'post', override for form's 'method' attribute 
        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
        //clearForm: true        // clear all form fields after successful submit 
        //resetForm: true        // reset the form after successful submit 
 
        // $.ajax options can be used here too, for example: 
        //timeout:   3000 
    }; 
    $('#searchOrganization').click(function(){
    	if(!$("#organizationHierarchyForm").validationEngine('validateField','#parentOrganizationName') && !$("#parentOrganizationId").val()==''){
    		$("#organizationHierarchyForm").attr("action", "findOrganizationHierachies");
        	$("#organizationHierarchyForm").submit(); 
    	}else{
    		//alert('Please select an organization');
			$("#parentOrganizationName").validationEngine('showPrompt', 'Please select a valid organization.', 'error', true);

    		//return false;
    	}
    	
    });
    
   
    // bind to the form's submit event 
  /*  $('#organizationHierarchyForm').submit(function() {
    		$(this).ajaxSubmit(options); 
        // inside event callbacks 'this' is the DOM element so we first 
        // wrap it in a jQuery object and then invoke ajaxSubmit 
        
 
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return true; 
    }); */
}); 
 

   
// pre-submit callback 
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
	$('#organizationHierarchyForm').loadJSON(responseText.data);

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



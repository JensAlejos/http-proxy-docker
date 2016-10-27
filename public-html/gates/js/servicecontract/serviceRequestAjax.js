//For validation engine set default event to null
$.validationEngine.defaults.validationEventTrigger = null;

function cancelService()
{
	var contractId = $("#serviceContractNumber").val();
	/*document.location.href =_context+'/organization/address/add?actionPerformed=cancel';*/
	/*if(contractId == null || contractId == "")
	{
		document.location.href =_context+'/cas/organizationSearch.do';
	}
	else
	{*/
		document.location.href =_context+'/cas/serviceContractSearch.do';
	/*}*/
}


function invokeServiceMember()
{
	var contractId = $("#serviceContractId").val();
	/*document.location.href =_context+'/organization/address/add?actionPerformed=cancel';*/
	document.location.href='member/findServiceContractMembers?id='+contractId+'&sourcePage=serviceContract';
}


function removeErrorPointers(){
	   $('#serviceContractForm').validationEngine('hideAll');
}

function setField()
{
	var contractId = $('#serviceContractId').val();
	
	if(contractId == null || contractId == "")
	{
		var ele2 = document.getElementById("addField");
		ele2.style.display = "block";
		var ele3 = document.getElementById("maintainField");
		ele3.style.display = "none";
		var ele3 = document.getElementById("saveField");
		ele3.style.display = "none";
		
	}
	else
	{
		var ele2 = document.getElementById("maintainField");
		ele2.style.display = "block";
		var ele3 = document.getElementById("addField");
		ele3.style.display = "none";
		var ele3 = document.getElementById("saveField");
		ele3.style.display = "none";
	}
}

function setForm()
{
	var contractId = $('#serviceContractNumber').val();
	if(contractId == null || contractId == "")
	{
		var ele = document.getElementById("addHeader");
		ele.style.display = "block";
		var ele1 = document.getElementById("maintainHeader");
		ele1.style.display = "none";
		
		$('#clearButton').attr('disabled',true);
		$('#serviceMember').attr('disabled',true);
	}
	else
	{
		var ele = document.getElementById("maintainHeader");
		ele.style.display = "block";
		var ele1 = document.getElementById("addHeader");
		ele1.style.display = "none";
		
		$('#clearButton').attr('disabled',false);
		$('#serviceMember').attr('disabled',false);
		
	}
}

// prepare the form when the DOM is ready 
$(document).ready(function() { 
	if($('#serviceContractId').val()!=null && $('#serviceContractId').val()!="")
	{
		$('#effectiveDate').focus();
	}
	else
		{	
				$('#serviceContractNumber').focus();
			
		}
	
	
	$("#serviceContractForm").validationEngine('attach'); 	
	
	setForm();
	setField();

   /* $('#org_save').click(function(){
    	
			$("#serviceContractForm").submit();
		
    });*/
	
	
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
    // bind to the form's submit event 
	/* $('#org_workflow_link').click(function() {
		 $('#organizationAddressForm').ajaxSubmit(options); 
		 
	 });*/
	 
   /* $('#serviceContractForm').submit(function() {
    		
    		$(this).ajaxSubmit(options); 
        // inside event callbacks 'this' is the DOM element so we first 
        // wrap it in a jQuery object and then invoke ajaxSubmit 
        
 
        // !!! Important !!! 
        // always return false to prevent standard browser submit and page navigation 
        return false; 
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
	$('#serviceContractForm').loadJSON(responseText.data);
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
		setForm();
		var ele2 = document.getElementById("maintainField");
		ele2.style.display = "none";
		var ele3 = document.getElementById("addField");
		ele3.style.display = "none";
		var ele3 = document.getElementById("saveField");
		ele3.style.display = "block";
			/*if($('#internalAjax').val()!='internal'){
				$('#org_workflow').dialog('open');
				
			}else{
				$('#org_auth_party').dialog("close"); 
			}
		//enableFields();
		}else{
			//disableFields();*/
		}
		
} 
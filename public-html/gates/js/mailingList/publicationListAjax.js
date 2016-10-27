$(document).ready(function(){
	
	//default focus on page load
	$('#startingPublication').focus();
	
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	$("#publicationForm").validationEngine('attach');
	// Dialog Link
	$('#searchPublication').click(function(){		
		//$('#org_auth_party').dialog('open');
//		$('#publicationForm').validationEngine('validate');
//		  var startingPublication = $.trim($("#startingPublication").val());
//		  var expirationDate = $.trim($("#expirationDate").val());
//		  var effectiveDate=$.trim($("#effectiveDate").val());
//		  if((startingPublication == null || startingPublication=="") && 
//			  (expirationDate == null || expirationDate=="")&& (effectiveDate==null || effectiveDate==""))
//		  {
//			  $("#startingPublication").validationEngine('showPrompt', 'One of Starting Publication or Expiration Date or Effective Date must be filled in.', 'error', true);
//			  return false;
//		  }
//		  else
//		  {
			    $('#publicationForm').attr("action","/gates/publicationList/search");
				$('#publicationForm').submit();	
				//return true;
//		  }
//		  
//		  return false;
	});
	
	
	//Blurr the data for invalid territory code
	$('#startingPublication').blur(function(){
		if($("#mailPublicationId").val()==null || $("#mailPublicationId").val()==""){
        	$("#startingPublication").val(""); 
    	}
    });
	
	$('#startingPublication').gatesPopUpSearch({
		func : function() {
			publicationListPopupSearch();
		}
	});
	
	
	$('#startingPublication').gatesAutocomplete({
		source: '<%= request.getContextPath ()%>/cas/autocomplete.do?method=searchPublication&searchType=29',
		select: function(item) {
			$('#startingPublication').val(item.name);
			//$('#mailPublicationId').val(item.mail_publication_id);
		}
	});	
	
	var options={
	             beforesubmit:showRequest,
	             success:showResponse,
	             datatype:'json'
	             
	};
	
	
	$('#cancel').click(function(){
	
	document.location.href="/gates/cas/organizationSearch.do";
	});
		
	
	$('#clear').click(function(){
		document.location.href="/gates/publicationList/viewAdd?clear=clear";
	});
	
	captureChanges();
	$('#publictionListSave').click(function(){
		$(window).unbind('beforeunload');
		$('#publicationForm').attr("action","/gates/publicationList/createUpdate");
		$('#publicationForm').submit();	
		});
	$("#publicationForm").validationEngine('attach');
	/*$('#cancelButton').click(function(){
		document.location.href="/gates/addressRole/edit?addressRoleId="+$('#addressRoleId').val();
	});*/
	
});
$(function() {
	$( "#expirationDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
});
$(function() {
	$( "#effectiveDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
});
function removeErrorPointers(){
	   $('#publicationForm').validationEngine('hideAll');
}
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
	$('#publicationForm').loadJSON(responseText.data);

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
	
} 

function isChanged() {
	$.ajax({
		   type: "GET",
		   async:false,
		   url: _context +"/publicationList/hasAnyGridChanged",
		   success: function(json){
         	console.log(json);
         }
	});
}

function publicationListPopupSearch() {
	var actionUrl = _context + "/cas/publicationListlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function publicationListSearchUpdate(publicationName,publicationId)
{
	$('#startingPublication').val(publicationName);
	$('#mailPublicationId').val(publicationId);
	}
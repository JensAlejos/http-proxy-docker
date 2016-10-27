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
  if($('#nextFlag').val()=='false'){
		$('#org_next').attr('disabled', true);
	}
  
  $('#org_save').click(function()
  {
	  if($('#addressRoleId').val()=="")
	  {
		  if($('#organizationId').val()=="")
		  {
			  $("#organizationNamePopUp").validationEngine('showPrompt', 'Please select an organization and addressrole.', 'error', true);
		  }
		  else
		  {
			  $("#AROLE_POPUP").validationEngine('showPrompt', 'Please select an addressrole.', 'error', true);
		  }
	  }
	  else
	  {
		  $('#addressRoleBillingOptionsForm').attr("action","createUpdate");
		  //$('#addressRoleBillingOptionsForm').submit();
		  $("#addressRoleBillingOptionsForm").submit();
		  //$("#remarks").val('');
	  }
  });
  
  $('#org_next').click(function(){
	 	$('#addressRoleBillingOptionsForm').attr("action","next");
		//$('#addressRoleBillingOptionsForm').submit();
		$("#addressRoleBillingOptionsForm").submit();
		//$("#remarks").val('');

	});
  $('#cancelBillingOptions').click(function(){
	  document.location.href =_context+'/cas/addressRoleSearch.do';		
	});

  if (_readonly) {
    $('#billingOptions').gatesDisable();
    $('#org_auth').gatesDisable();
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
				$('#addressRoleId').val("");
				
			}
		});	
	 
	 $('#organizationNamePopUp').gatesPopUpSearch({
			func : function() {
				organizationPopupSearch();
			}
		});
	
	 $('#AROLE_POPUP').click(				
				function(){	
					 $('#AROLE_POPUP').validationEngine('hideAll');
				    if ($('#organizationId').val()) {	
						var url = _context+'/cas/addressRolemainlookup.do?filterValue1='+$('#organizationId').val();
						winBRopen(url,'winpops','700','500','no','no');
						
				    } else {
				    	$("#organizationNamePopUp").validationEngine('showPrompt', 'Please select an organization', 'error', true);
				    }
				}
		
		);
	 $('#organizationNamePopUp').change(function(){
		 $('#organizationId').val("");
		 $('#addressRoleId').val("");
		 clearFormFields();
	 });
	
	 
	 $('#organizationNamePopUp').click(function(){
		
		$('#organizationNamePopUp').validationEngine('hideAll');
	 });
  
});

function clearFormFields()
{
	$('#organizationNamePopUp').attr('titel',"");
	document.getElementById('nameQualifier').innerHTML = "";
	document.getElementById('coorganization').innerHTML = "";
	document.getElementById('streetAddress').innerHTML = "";
	document.getElementById('suite').innerHTML = "";
	document.getElementById('city').innerHTML = "";
	document.getElementById('state').innerHTML = "";
	document.getElementById('zip').innerHTML = "";
	document.getElementById('country').innerHTML = "";
	document.getElementById('addrType').innerHTML = "";
	$('#organizationId').val("");
	$('#addressRoleId').val("");
	$('#billingOptions').hide();
}
//pre-submit callback 
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
//post-submit callback 
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
  	//$('#addressRoleBillingOptionsForm').loadJSON(responseText.data);

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
  			$("#remarks").val('');
  		}

  		
  		$('#msgDiv').html('').append(messageContent);
  	}
  	

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

	/*function organizationNameSearchUpdate(id)
	{
		 alert(id);
			var values = id.split("|");
			
		  	$('#organizationName').val(values[0]);
			//$('#organizationNameHolder').val(values[0]);
		  	$('#organizationId').val(values[1]);
		  	$('#addressRoleId').val("");
			clearFormFields();
		  	if(values[3]=='Y' || values[3]=='y')
		  	{
		  		$('#organizationActive').attr('checked',true); 
		  	}
	}*/
	function addressRoleSearchUpdate(id){
		var values = id.split("|");
	  	//$('#ORG_NAME').val(values);
		
		  	//$('#sourceOrganizationId').val(values[0]);
			document.location.href="/gates/addressRole/billingOptions/edit?addressRoleId="+values[0]+"&menu=maintain";
		  	
		  	
		  	
		  	
		  	//$('#isSourceArolActive').text(values[11]); 	

		  //self.opener.document.getElementById('aroleId').value = values[1];
	}
	
	function organizationPopupSearch() {
		var actionUrl = _context + "/cas/organizationlookup.do";
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);
	}

	

	function organizationNameSearchUpdate(id)
	{
		clearFormFields();
			var values = id.split("|");
			
		  	$('#organizationNamePopUp').val(values[0]);
			//$('#organizationNameHolder').val(values[0]);
		  	$('#organizationId').val(values[1]);
		  	
			
		  	/*if(values[3]=='Y' || values[3]=='y')
		  	{
		  		$('#organizationActive').attr('checked',true); 
		  	}*/
	}
	function removeErrorPointers(){
		
		   $('#organizationNamePopUp').validationEngine('hideAll');
	}
	
	
  
/*  <!--  JS FOR COLLAPSE/EXPAND -->  */




		
		
		
		
	

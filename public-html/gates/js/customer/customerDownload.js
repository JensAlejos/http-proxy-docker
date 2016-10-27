$(document).ready(function() {
	$('#msgDiv').hide();
  	$('#msgDivError').hide();
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

  $('#IN_CUSTOMER_NAME').gatesPopUpSearch({func:function() {organizationPopupSearch()}});
  $('#in_address_name').gatesPopUpSearch({func:function() {addressPopupSearch()}});

  $('#cancelBillingOptions').click(function(){
	  document.location.href =_context+'/cas/addressRoleSearch.do';		
	});
  
	  	$("#custdownloadsave").attr("disabled","disabled");	
	  $("#custdownloaddelete").attr("disabled","disabled");	
  
  $('#custdownloadsave').click(function(){
	 // $("#customerDownloadForm").attr("action","createCustDownload");
	  $.ajax({
			url : _context+'/customer/customerdownload/createCustDownload',
			type : "POST",
			success : function(responseText) {
	 				if (responseText.success == true) {
	 					$("#customerDownloadForm").loadJSON(responseText.data);
	 					$("#custaddressRoleId").html(responseText.data.addressRoleId);
	 					$("#orgQualifier").html(responseText.data.organizationNameQualifier);
	 					$("#custorgName1").html(responseText.data.owningOrganizationName);
	 					$("#streetAddres	s").html(responseText.data.addressForm.addressLine1);
	 					$("#streetAddress2").html(responseText.data.addressForm.addressLine2);
	 					$("#streetAddress3").html(responseText.data.addressForm.addressLine3);
	 					if(responseText.data.addressRoleTypeCode == "01")
	 						{
	 						$("#custAddType").html("ALL");
	 						
	 						}
	 					if(responseText.data.addressRoleTypeCode == "02")
						{
						$("#custAddType").html("SHPFRM");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "03")
						{
						$("#custAddType").html("SHP TO");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "04")
						{
						$("#custAddType").html("FREIGHT PAYABLE");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "05")
						{
						$("#custAddType").html("ADMINISTRATIVE");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "06")
						{
						$("#custAddType").html("TRAFFIC");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "07")
						{
						$("#custAddType").html("CLAIMS");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "08")
						{
						$("#custAddType").html("TRUCKER");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "09")
						{
						$("#custAddType").html("MAILING");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "10")
						{
						$("#custAddType").html("UNCLASSIFIED");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "11")
						{
						$("#custAddType").html("REFUND");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "12")
						{
						$("#custAddType").html("NOTIFY");
						
						}
	 					if(responseText.data.addressRoleTypeCode == "13")
						{
						$("#custAddType").html("FWDAGT");
						
						}
	 						
	 					
	 					$("#custdownloaddate").html(responseText.data.dnldRequest + " " + responseText.data.lastUpdateUser);
	 					if(responseText.data.downloadStatus=="C")
	 						{
	 							$("#custdownloadStatus").html("Yes");
	 						}
	 					else if(responseText.data.downloadStatus=="N")
	 						{
	 							$("#custdownloadStatus").html("No");	
	 						}
	 					  if($("#downloadStatus").val()=="N")
	 					  {
	 					  	$("#custdownloadsave").attr("disabled","disabled");	
	 					  }
	 					  else if($("#downloadStatus").val()=="C")
	 					  {
	 					  	$("#custdownloadsave").removeAttr("disabled");
	 					  }
	 					 else if($("#downloadStatus").val()!="N")
						  {
						 $("#custdownloadsave").removeAttr("disabled");
						  }
	 					 if($("#downloadStatus").val()=="C")
	 					  {
	 						  $("#custdownloaddelete").attr("disabled","disabled");	
	 					  }
	 					 else if ($("#downloadStatus").val()=="N")
 						 {
	 						 $("#custdownloaddelete").removeAttr("disabled");
 						 }
	 					 else if($("#downloadStatus").val()!="N")
						  {
	 						$("#custdownloaddelete").attr("disabled","disabled");	
						  }
	 					var messageContent= "Customer Download Request saved successfully.";
	 					$('#msgDiv').show();
		 				$('#msgDiv').html(messageContent)
	 				//	document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+frtPayableRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&showMessage=Y&action=EXIT';
	 				}
				}
		});
	});
  
  
  $('#cust_display').click(function(){
	  $('#msgDiv').hide();
	  if ($("#customerDownloadForm").validationEngine('validate')) {
		  showOneTimeCustomer
		  if($('#IN_CUSTOMER_NAME').val() == "")
			  {
			   $('#IN_CUSTOMER_NAME').validationEngine('showPrompt', 'This is field is required.', 'error', 'topRight', true);
			   return false;
			  }
		  else
			  { 
			  
			  $('#IN_CUSTOMER_NAME').validationEngine('hidePrompt');
	 	 		//return true;
			  }
		  if($('#in_address_name').val() == "")
		  {
		   $('#in_address_name').validationEngine('showPrompt', 'This is field is required.', 'error', 'topRight', true);
		   return false;
		  }
		  else
			  {
			  $('#in_address_name').validationEngine('hidePrompt');
			  }
		 
		  
		  var addressRoleId = $('#addressRoleId').val();
		  var custName = $('#IN_CUSTOMER_NAME').val();
		  var inaddressname = $('#in_address_name').val();
		
				$.ajax({
		 			url : _context+'/customer/customerdownload/displayCustDownload',
		 			type : "POST",
		 			
		 			data : "addressRoleId="+ addressRoleId+"&custName="+custName+"&orgName="+inaddressname,
		 			success : function(responseText) {
			 				if (responseText.success == true) {
			 					$("#customerDownloadForm").loadJSON(responseText.data);
			 					$("#custaddressRoleId").html(responseText.data.addressRoleId);
			 					$("#orgQualifier").html(responseText.data.organizationNameQualifier);
			 					$("#custorgName1").html(responseText.data.owningOrganizationName);
			 					$("#streetAddress").html(responseText.data.addressForm.addressLine1);
			 					$("#streetAddress2").html(responseText.data.addressForm.addressLine2);
			 					$("#streetAddress3").html(responseText.data.addressForm.addressLine3);
			 					$("#suite").html(responseText.data.addressForm.suite);
			 					$("#city").html(responseText.data.addressForm.cityName);
			 					$("#state").html(responseText.data.addressForm.stateCode);
			 					$("#country").html(responseText.data.addressForm.countryName);
			 					$("#zip").html(responseText.data.addressForm.zipCode);
			 					if(responseText.data.addressRoleTypeCode == "01")
			 						{
			 						$("#custAddType").html("ALL");
			 						
			 						}
			 					if(responseText.data.addressRoleTypeCode == "02")
		 						{
		 						$("#custAddType").html("SHPFRM");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "03")
		 						{
		 						$("#custAddType").html("SHP TO");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "04")
		 						{
		 						$("#custAddType").html("FREIGHT PAYABLE");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "05")
		 						{
		 						$("#custAddType").html("ADMINISTRATIVE");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "06")
		 						{
		 						$("#custAddType").html("TRAFFIC");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "07")
		 						{
		 						$("#custAddType").html("CLAIMS");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "08")
		 						{
		 						$("#custAddType").html("TRUCKER");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "09")
		 						{
		 						$("#custAddType").html("MAILING");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "10")
		 						{
		 						$("#custAddType").html("UNCLASSIFIED");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "11")
		 						{
		 						$("#custAddType").html("REFUND");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "12")
		 						{
		 						$("#custAddType").html("NOTIFY");
		 						
		 						}
			 					if(responseText.data.addressRoleTypeCode == "13")
		 						{
		 						$("#custAddType").html("FWDAGT");
		 						
		 						}
			 					$("#custdownloaddate").html(responseText.data.dnldRequest + " " + responseText.data.lastUpdateUser);
			 					if(responseText.data.downloadStatus=="C")
			 						{
			 							$("#custdownloadStatus").html("Yes");
			 						}
			 					else if(responseText.data.downloadStatus=="N") 
			 						{
			 							$("#custdownloadStatus").html("No");
			 						}
			 					  if($("#downloadStatus").val()=="N")
			 						  {
			 						  	$("#custdownloadsave").attr("disabled","disabled");	
			 						  }
			 					  else if($("#downloadStatus").val()=="C")
			 						  {
			 						  	$("#custdownloadsave").removeAttr("disabled");
			 						  }
			 					 else if($("#downloadStatus").val()!="N")
		 						  {
			 						if (!_readonly) {
			 							 $("#custdownloadsave").removeAttr("disabled");
			 						  }
		 						  }
			 					 if($("#downloadStatus").val()=="C")
			 					  {
			 						  $("#custdownloaddelete").attr("disabled","disabled");	
			 					  }
			 					 else if ($("#downloadStatus").val()=="N")
		 						 {
			 						if (!_readonly) {
			 							$("#custdownloaddelete").removeAttr("disabled");
			 						  }
		 						 }
			 					 else if($("#downloadStatus").val()!="N")
								  {
			 						$("#custdownloaddelete").attr("disabled","disabled");	
								  }
			 				//	document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+frtPayableRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&showMessage=Y&action=EXIT';
			 				}
		 				}
		 		});
			
	  }
	});
  if (_readonly) {
    $('#billingOptions').gatesDisable();
    $('#org_auth').gatesDisable();
    $('#custdownloadsave').attr("disabled","disabled");	
    $('#custdownloaddelete').attr("disabled","disabled");	
  }
  var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';	
  $('#IN_CUSTOMER_NAME').gatesAutocomplete({
		source: url,
		mustMatch:false,
		formatItem: function(data) {
			return data.name;
		},
		formatResult: function(data) {
			return data.name;
		}, 
		select: function(data) {
			//$('#ORGANIZATION_ID').val(data.id);
			$('#usingOrganizationId').val(data.id);
			addressPopupSearch();
		}
	})
	.change(function() {
		if($('#IN_CUSTOMER_NAME').val()=='' || $('#IN_CUSTOMER_NAME').val()=='ALL')
			{
				$('#in_organization_id').val('');
				
			}
	});	
  
  $('#IN_CUSTOMER_NAME').change(function(){
	  $("#custaddressRoleId").html("");
		$("#orgQualifier").html("");
		$("#custorgName1").html("");
		$("#streetAddress").html("");
		$("#streetAddress2").html("");
		$("#streetAddress3").html("");
		$("#custAddType").html("");
		$("#custdownloaddate").html("");
		$("#custdownloadStatus").html("");
	  if($('#IN_CUSTOMER_NAME').val()!="")
		  {
		  $('#IN_CUSTOMER_NAME').validationEngine('hidePrompt');
 	 		return true;
		  }
  });
  $('#IN_CUSTOMER_NAME').blur(function(){
	  $("#custaddressRoleId").html("");
		$("#orgQualifier").html("");
		$("#custorgName1").html("");
		$("#streetAddress").html("");
		$("#streetAddress2").html("");
		$("#streetAddress3").html("");
		$("#custAddType").html("");
		$("#custdownloaddate").html("");
		$("#custdownloadStatus").html("");
	  if($('#IN_CUSTOMER_NAME').val()!="")
		  {
		  $('#IN_CUSTOMER_NAME').validationEngine('hidePrompt');
 	 		return true;
		  }
  });
  $('#in_address_name').change(function(){
	  if($('#in_address_name').val()!="")
	  {
	  $('#in_address_name').validationEngine('hidePrompt');
	 		return true;
	  }
  });
});
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
  	$('#customerDownloadForm').loadJSON(responseText.data);
  	
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
  		 $('#IN_CUSTOMER_NAME').blur(function(){
  			if($('#IN_CUSTOMER_NAME').val() == '' || $('#IN_CUSTOMER_NAME').val() == 'ALL') {
  				//$('#in_organization_id').val('');
  				$('#IN_CUSTOMER_NAME').val('');
  			}
  		});
  		
  		$('#msgDiv').html('').append(messageContent);
  	}
  	

  }
 
  function openSearchOneTimerWindow(){
		var isDatePresent=true;
		var src="ALL";
		var partytype ="ALL";
		var url = _context + "/cas/onetimeCustomerForCPSearch.do?filterValue1=ALL|ALL|ALL|"+isDatePresent+"|CAS&source="+src;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(url, "One time Customer Search", windowStyle);
	}
  function organizationPopupSearch() {
	  
	    var actionUrl = _context + "/cas/customerDnldLookUp.do?filterValue1="+$('#IN_CUSTOMER_NAME').val();
	    var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);
	}
  function addressPopupSearch() {
	  var actionUrl = _context + "/cas/addressRolemainlookup.do?filterValue1="+$('#usingOrganizationId').val();
	  var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);	
	}
  function organizationNameSearchUpdate(id){
		var values = id.split("|");
		$('#IN_CUSTOMER_NAME').val(values[0]);
		//$('#ORGANIZATION_ID').val(values[1]);
		$('#usingOrganizationId').val(values[1]);
		addressPopupSearch();
	}

	function addressRoleSearchUpdate(id) {	
         var values = id.split("|");
			var address='';
			if(values[4]!=null && $.trim(values[4])!='' && values[4]!='null'){
				address= values[4];
			}
			
			if(values[6]!=null && $.trim(values[6])!=''&& values[6]!='null'){
				var address1= values[6]+",";
			} else{
					address1="";
				}
			if(values[7]!=null && $.trim(values[7])!=''&& values[7]!='null'){
				address1 ="-"+address1+values[7];
			}
			if(values[3]!=null && $.trim(values[3])!=''&& values[3]!='null'){
				address = values[3]+ "-"+address;
			}
			if(values[2]!=null && $.trim(values[2])!=''&& values[2]!='null' )
				address=values[2]+"-"+address+address1;
			else
				address=address+address1;
		
		$('#cpUpdateKeyId').val("");
		$("#in_address_name").val(address);
		$("#addressRoleId").val(values[0]);	
		 
}
	function oneTimeCustUpdate(id,src,party,frmDATE,toDATE)
	{ //CUSTOMER_NAME,CUSTOMER_CODE,ADDRESS,CITY,STATE,ZIP,CREATE_DATE,BOOKING_NUMBER,ADDRESS2,ADDRESS3,
		//first_name,last_name,qualifier,suite,province,country,PHONE,cell,EMAIL,ORGANIZATION_ID,contact_id,address_id,Address_role_id,FAX
		var values = id.split("|");
		var orgName = values[0];
		var orgCode = values[1];
		_orgId=values[19];
		$('#IN_CUSTOMER_NAME').val(orgName+'-'+orgCode);
		$('#usingOrganizationId').val(values[19]);
		$('#partytype').val(party);	
		var address='';
		var nameQualifier=values[12];
		var addressLine1=values[2];
		var city=values[3];
		var state=values[4];
		var shipmentNo=values[7];
		var party=values[24];
		
		if(nameQualifier!=null && $.trim(nameQualifier)!=''){
			address= nameQualifier+'-';
		}
		
		if(state!=null && $.trim(state)!='')
		{
			var address1= ","+state;
		} 
		else
		{
			address1="";
		}	
		address=address+addressLine1+"-"+city+address1;
		$("#in_address_name").val(address);
		$('#addressRoleId').val(values[22]);
		//$('#partytype').val(party);	
		
		
		 if ($("#customerDownloadForm").validationEngine('validate')) {
			  var addressRoleId = $('#addressRoleId').val();
			  var custName = $('#IN_CUSTOMER_NAME').val();
			  var inaddressname = $('#in_address_name').val();
					$.ajax({
			 			url : _context+'/customer/customerdownload/displayCustDownload',
			 			type : "POST",
			 			
			 			data : "addressRoleId="+ addressRoleId+"&custName="+custName+"&orgName="+inaddressname,
			 			success : function(responseText) {
				 				if (responseText.success == true) {
				 					$("#customerDownloadForm").loadJSON(responseText.data);
				 					$("#custaddressRoleId").html(responseText.data.addressRoleId);
				 					$("#orgQualifier").html(responseText.data.organizationNameQualifier);
				 					$("#custorgName1").html(responseText.data.owningOrganizationName);
				 					$("#streetAddress").html(responseText.data.addressForm.addressLine1);
				 					$("#streetAddress2").html(responseText.data.addressForm.addressLine2);
				 					$("#streetAddress3").html(responseText.data.addressForm.addressLine3);
				 					$("#suite").html(responseText.data.addressForm.suite);
				 					$("#city").html(responseText.data.addressForm.cityName);
				 					$("#state").html(responseText.data.addressForm.stateCode);
				 					$("#country").html(responseText.data.addressForm.countryName);
				 					$("#zip").html(responseText.data.addressForm.zipCode);
				 					if(responseText.data.addressRoleTypeCode == "01")
				 						{
				 							$("#custAddType").html("ALL");
				 						
				 						}
				 					if(responseText.data.addressRoleTypeCode == "02")
			 						{
			 						$("#custAddType").html("SHPFRM");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "03")
			 						{
			 						$("#custAddType").html("SHP TO");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "04")
			 						{
			 						$("#custAddType").html("FREIGHT PAYABLE");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "05")
			 						{
			 						$("#custAddType").html("ADMINISTRATIVE");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "06")
			 						{
			 						$("#custAddType").html("TRAFFIC");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "07")
			 						{
			 						$("#custAddType").html("CLAIMS");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "08")
			 						{
			 						$("#custAddType").html("TRUCKER");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "09")
			 						{
			 						$("#custAddType").html("MAILING");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "10")
			 						{
			 						$("#custAddType").html("UNCLASSIFIED");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "11")
			 						{
			 						$("#custAddType").html("REFUND");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "12")
			 						{
			 						$("#custAddType").html("NOTIFY");
			 						
			 						}
				 					if(responseText.data.addressRoleTypeCode == "13")
			 						{
			 						$("#custAddType").html("FWDAGT");
			 						
			 						}
				 						
				 					
				 					$("#custdownloaddate").html(responseText.data.dnldRequest + " " + responseText.data.lastUpdateUser);
				 					if(responseText.data.downloadStatus=="C")
			 						{
			 							$("#custdownloadStatus").html("Yes");
			 						}
				 					else if(responseText.data.downloadStatus=="N") 
			 						{
			 							$("#custdownloadStatus").html("No");
			 						}
			 					
				 				}
				 			
				 				  
				 				  if($("#downloadStatus").val()=="N")
				 					  {
				 					  	$("#custdownloadsave").attr("disabled","disabled");	
				 					  }
				 				  else if($("#downloadStatus").val()=="C")
				 					  {
				 					  	$("#custdownloadsave").removeAttr("disabled");
				 					  }
				 				 else if($("#downloadStatus").val()!="N")
		 						  {
		 						 $("#custdownloadsave").removeAttr("disabled");
		 						  }
				 				 if($("#downloadStatus").val()=="C")
				 				  {
				 					  $("#custdownloaddelete").attr("disabled","disabled");	
				 				  }
				 				 else if ($("#downloadStatus").val()=="N")
		 						 {
		 						$("#custdownloaddelete").removeAttr("disabled");
		 						 }
				 				 else if($("#downloadStatus").val()!="N")
								  {
			 						$("#custdownloaddelete").attr("disabled","disabled");	
								  }
		 				}
				 		});
				
		  }
	}
	function cancel()
	{
		$('#IN_CUSTOMER_NAME').val("");
		$("#in_address_name").val("");
		 document.getElementById('isActive').checked=false;
		 $('#isActive').val(true);
		$('#partytype').val("ALL");
		$('#isActive').removeAttr('checked');
		$("#custaddressRoleId").html("");
			$("#orgQualifier").html("");
			$("#custorgName1").html("");
			$("#streetAddress").html("");
			$("#streetAddress2").html("");
			$("#streetAddress3").html("");
			$("#custAddType").html("");
			$("#custdownloaddate").html("");
			$("#custdownloadStatus").html("");
			$('#cpUpdateKeyId').val("");
			$('#msgDiv').hide();
			$("#custdownloadsave").attr("disabled","disabled");	
			$("#custdownloaddelete").attr("disabled","disabled");	
	}
	function deleteCustomerDownload()
	{
			  var cpUpdateKeyId = $('#cpUpdateKeyId').val();
					$.ajax({
			 			url : _context+'/customer/customerdownload/deleteCustDownload',
			 			type : "POST",
			 			data : "cpUpdateKeyId="+ cpUpdateKeyId,
			 			success : function(responseText) {
				 				if (responseText.success == true) {

					 				if (responseText.success == true) {
					 					$("#customerDownloadForm").loadJSON(responseText.data);
					 					$("#custaddressRoleId").html(responseText.data.addressRoleId);
					 					$("#orgQualifier").html(responseText.data.organizationNameQualifier);
					 					$("#custorgName1").html(responseText.data.owningOrganizationName);
					 					$("#streetAddress").html(responseText.data.addressForm.addressLine1);
					 					$("#streetAddress2").html(responseText.data.addressForm.addressLine2);
					 					$("#streetAddress3").html(responseText.data.addressForm.addressLine3);
					 					if(responseText.data.addressRoleTypeCode == "01")
					 						{
					 						$("#custAddType").html("ALL");
					 						
					 						}
					 					if(responseText.data.addressRoleTypeCode == "02")
										{
										$("#custAddType").html("SHPFRM");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "03")
										{
										$("#custAddType").html("SHP TO");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "04")
										{
										$("#custAddType").html("FREIGHT PAYABLE");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "05")
										{
										$("#custAddType").html("ADMINISTRATIVE");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "06")
										{
										$("#custAddType").html("TRAFFIC");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "07")
										{
										$("#custAddType").html("CLAIMS");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "08")
										{
										$("#custAddType").html("TRUCKER");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "09")
										{
										$("#custAddType").html("MAILING");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "10")
										{
										$("#custAddType").html("UNCLASSIFIED");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "11")
										{
										$("#custAddType").html("REFUND");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "12")
										{
										$("#custAddType").html("NOTIFY");
										
										}
					 					if(responseText.data.addressRoleTypeCode == "13")
										{
										$("#custAddType").html("FWDAGT");
										
										}
					 						
					 					
					 					$("#custdownloaddate").html(responseText.data.dnldRequest + " " + responseText.data.lastUpdateUser);
					 					if(responseText.data.downloadStatus=="C")
				 						{
				 							$("#custdownloadStatus").html("Yes");
				 						}
				 					else if(responseText.data.downloadStatus=="N") 
				 						{
				 							$("#custdownloadStatus").html("No");
				 						}
				 					else
				 						{
				 						    $("#custdownloadStatus").html("");
				 						}
				 					
					 					var messageContent= "Customer Download Request deleted successfully.";
					 					$('#msgDiv').show();
						 				$('#msgDiv').html(messageContent)
						 			 if($("#downloadStatus").val()=="N")
			 						  {
			 						  	$("#custdownloadsave").attr("disabled","disabled");	
			 						  }
			 					  else if($("#downloadStatus").val()=="C")
			 						  {
			 						  	$("#custdownloadsave").removeAttr("disabled");
			 						  }
			 					  else if($("#downloadStatus").val()!="N")
			 						  {
			 						 $("#custdownloadsave").removeAttr("disabled");
			 						  }
			 					  
			 					 if($("#downloadStatus").val()=="C")
			 					  {
			 						  $("#custdownloaddelete").attr("disabled","disabled");	
			 					  }
			 					 else if ($("#downloadStatus").val()=="N")
			 						 {
			 						$("#custdownloaddelete").removeAttr("disabled");
			 						 }
			 					 else if($("#downloadStatus").val()!="N")
								  {
			 						$("#custdownloaddelete").attr("disabled","disabled");	
								  }
					 				//	document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+frtPayableRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&showMessage=Y&action=EXIT';
					 				}
								
				 				}
			 				}
			 		});
				
	}
/*  <!--  JS FOR COLLAPSE/EXPAND -->  */




		
		
		
		
	


$(document).ready(function() {
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';		 
	 $('#sourceOrganizationName').gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.name; // + "-" + data.code;
			},
			formatResult: function(data) {
				return data.name; // + "-" + data.code;
			},
			select: function(data) {
				$('#sourceOrganizationId').val(data.id);
				$('#sourceOrganizationName').attr('title',data.name);
				$('#sourceOrganizationName').val(data.name);
			}
		})
	 .change(function() {
			if($('#sourceOrganizationName').val()=='')
				{
					$('#sourceOrganizationId').val('');
				}
		})
		.keypress(function(e){
        if(e.which!=13) {
        	$('#sourceOrganizationId').val('');
        }
        });
	 
	 $('#destinationOrganizationName').gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.name; // + "-" + data.code;
			},
			formatResult: function(data) {
				return data.name; // + "-" + data.code;
			},
			select: function(data) {
				$('#destinationOrganizationId').val(data.id);
				$('#destinationOrganizationName').attr('title',data.name);
				$('#destinationOrganizationName').val(data.name);
			}
		})
		.change(function() {
			if($('#destinationOrganizationName').val()==''||(destinationOrganizationNameHidden!=$('#sourceOrganizationName').val()&&destinationOrganizationNameHidden!=''))
				{
					$('#destinationOrganizationId').val('');
				}
			})
			.keypress(function(e){
        if(e.which!=13) {
        	$('#destinationOrganizationId').val('');
        }
        });

	 // code to bind pop up search
		$('#sourceOrganizationName').gatesPopUpSearch({
			func : function() {
				organizationPopupSearch("source");
			}
		});
		
		// code to bind pop up search
		$('#destinationOrganizationName').gatesPopUpSearch({
			func : function() {
				organizationPopupSearch("destination");
			}
		});
	 
});

//lookup window 
function organizationPopupSearch(id) {
	if(id=="source"){
	this.usingPopUp='true';
	
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
	}
	
	if(id=="destination"){
		this.usingPopUp='false';
		
		var actionUrl = _context + "/cas/organizationlookup.do";
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);
		}
	
}

function organizationNameSearchUpdate(id){
	var values = id.split("|");
	 if(usingPopUp=="true")
	 {
		 $('#sourceOrganizationName').val(values[0]);
		 $('#sourceOrganizationName').attr('title',values[0]);
		 $('#sourceOrganizationId').val(values[1]);
		 $('#sourceOrganizationName').focus();
	 }
	 if(usingPopUp=="false")
	{
		 $('#destinationOrganizationName').val(values[0]);
		 $('#destinationOrganizationName').attr('title',values[0]);
		 $('#destinationOrganizationId').val(values[1]);
		 $('#destinationOrganizationName').focus();
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


$(function(){
	
	$('#AROLE_POPUP').click(
			
			function(){				
			    if ($('#sourceOrganizationId').val()) {	
					$('#action').val("source"); 
					var url = '../../cas/addressRolemainlookup.do?filterValue1='+$('#sourceOrganizationId').val();
					winBRopen(url,'winpops','700','500','no','no');
					
			    } else {
			    	alert('Please select organization.');
			    }
			}
	
	);	
});

$(function(){
	
	$('#AROLE_POPUP1').click(
			 
			function(){				
			    if ($('#destinationOrganizationId').val()) {
					$('#action').val("destination"); 
					var url = '../../cas/addressRolemainlookup.do?filterValue1='+$('#destinationOrganizationId').val();
					winBRopen(url,'winpops','700','500','no','no');
			    } else {
			    	alert('Please select organization.');
			    }
			}
	
	);	
});

function addressRoleSearchUpdate(id){
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
	var values = id.split("|");
  	//$('#ORG_NAME').val(values);
	if($('#action').val() == "source")
	{
		
	  	//$('#sourceOrganizationId').val(values[0]);
	  	$('#sourceAddressRoleId').val(values[0]);
	  	$('#sourceOrganizationId').val(values[1]);
	  	if(values[2]!="null")
	  	{
		  	$('#sourceOrganizationNameQualifier').val(values[2]);
		  	$('#sourceOrganizationNameQualifierVal').text(values[2]);
	  	}
	  	if(values[3]!="null")
  		{
		  	$('#sourceUsingOrganization').val(values[3]);
		  	$('div#sourceUsingOrganization').text(values[3]);
		  	$('#sourceUsingOrganizationVal').text(values[3]);
  		}
	  	else {
	  		$('#sourceUsingOrganizationVal').val('');
	  		$('div#sourceUsingOrganization').text('');
	  	}
	  	$('#sourceStreetAddress').val(values[4]);
	  	
	  	var addr=$('#sourceStreetAddress').val().split(',');
	  	
	  	if(addr[0]==null)
	   	   {
	   		   $('#sourceStreetAddress1').val("");
	   			document.getElementById('sourceStreetAddress1Val').innerHTML='';
	   	   }
	   	   else
	   	   {
	   		$('#sourceStreetAddress1').val(addr[0]);
	   		document.getElementById('sourceStreetAddress1Val').innerHTML=addr[0];
	   	   }
	   	if(addr[1]==null)
	   	   {
	   		   $('#sourceStreetAddress2').val("");
	   			document.getElementById('sourceStreetAddress2Val').innerHTML ='';
	   	   }
	   	   else
	   	   {
	   		$('#sourceStreetAddress2').val(addr[1]);
	   		document.getElementById('sourceStreetAddress2Val').innerHTML =addr[1];
	   	   }
	   	if(addr[2]==null)
	   	   {
	   		   $('#sourceStreetAddress3').val("");
	   		document.getElementById('sourceStreetAddress3Val').innerHTML ='';
	   	   }
	   	   else
	   	   {
	   		$('#sourceStreetAddress3').val(addr[2]);
	   		document.getElementById('sourceStreetAddress3Val').innerHTML =addr[2];
	   	   }
	  	
	  	
	  	
	  	
	  	
	  //	$('#sourceStreetAddressVal').text(values[4]);
	  	$('#sourceSuite').val(values[5]);
	  	$('#sourceSuiteVal').text(values[5]);
	  	$('#sourceCityName').val(values[6]);
	  	$('#sourceCityNameVal').text(values[6]);
	  	$('#sourceStateCode').val(values[7]);
	  	$('#sourceStateCodeVal').text(values[7]);
	  	$('#sourceZipCode').val(values[8]);
	  	$('#sourceZipCodeVal').text(values[8]);
	  	 /*if(values[8].length >5)
			{
				//alert(values[8]);
				var str=values[8];
				str = str.replace(/(\S{5})/g,"$1-");
				 document.getElementById('sourceZipCodeVal').innerHTML = (values[8]=='null'?'':str); 
				document.getElementById('sourceZipCode').value=str;
			}*/
	  	
	  	$('#sourceCountry').val(values[9]);
	  	$('#sourceCountryVal').text(values[9]);
	  	$('#sourceAddressRoleType').val(values[10]);	  	
	  	$('#sourceAddressRoleTypeVal').text(values[10]);
	  	document.getElementById('sourceAddressRoleTypeCode').value=(values[18]);
	  	if(values[11]=='Y')
		 {
	  		//alert(values[11]);
	  		//$('#isSourceArolActive').attr('disabled',false);
	  		$('#isSourceArolActive').val(true);
	  		$('#isSourceArolActive').attr('checked',true);
		 }
	  	else
  		{
	  		$('#isSourceArolActive').val(false);
  		}
	  	$('#action').val("sourceSelected");
	  	$('#isSourceArolActive').attr('disabled',false);
	  	$('#isDestinationArolActive').attr('disabled',false);
	  	blockUI();
	  	$('#addressRoleCrossReferenceForm').attr('action',"getArol");
		$("#addressRoleCrossReferenceForm").ajaxSubmit(options); 
	  	//$('#isSourceArolActive').text(values[11]); 	
	}
	else
	{
		//$('#destinationOrganizationId').val(values[0]);
		$('#destinationAddressRoleId').val(values[0]);
	  	$('#destinationOrganizationId').val(values[1]);
	  	if(values[2]!="null")
	  	{
	  		$('#destinationOrganizationNameQualifier').val(values[2]);
		  	$('#destinationOrganizationNameQualifierVal').text(values[2]);
	  	}
	  	if(values[3]!="null")
  		{
	  		$('#destinationUsingOrganization').val(values[3]);
	  		$('div#destinationUsingOrganization').text(values[3]);
		  	$('#destinationUsingOrganizationVal').text(values[3]);
		  	
  		}
	  	else {
	  		$('#destinationUsingOrganization').val('');
	  		$('div#destinationUsingOrganization').text('');
	  		$('#destinationUsingOrganizationVal').text('');
	  	}
	  	$('#destinationStreetAddress').val(values[4]);
	  	
	  	var addr=$('#destinationStreetAddress').val().split(',');
	  	
	  	if(addr[0]==null)
	   	   {
	   		   $('#destinationStreetAddress1').val("");
	   			document.getElementById('destinationStreetAddress1Val').innerHTML='';
	   	   }
	   	   else
	   	   {
	   		$('#destinationStreetAddress1').val(addr[0]);
	   		document.getElementById('destinationStreetAddress1Val').innerHTML=addr[0];
	   	   }
	   	if(addr[1]==null)
	   	   {
	   		   $('#destinationStreetAddress2').val("");
	   			document.getElementById('destinationStreetAddress2Val').innerHTML ='';
	   	   }
	   	   else
	   	   {
	   		$('#destinationStreetAddress2').val(addr[1]);
	   		document.getElementById('destinationStreetAddress2Val').innerHTML =addr[1];
	   	   }
	   	if(addr[2]==null)
	   	   {
	   		   $('#destinationStreetAddress3').val("");
	   		document.getElementById('destinationStreetAddress3Val').innerHTML ='';
	   	   }
	   	   else
	   	   {
	   		$('#destinationStreetAddress3').val(addr[2]);
	   		document.getElementById('destinationStreetAddress3Val').innerHTML =addr[2];
	   	   }	
	  	
	  	
	  	//$('#destinationStreetAddressVal').text(values[4]);
	  	if(values[5]==null || values[5]=="null" )
  		{
	  		values[5]="";
  		}
	  	$('#destinationSuite').val(values[5]);
	  	$('#destinationSuiteVal').text(values[5]);
	  	$('#destinationCityName').val(values[6]);
	  	$('#destinationCityNameVal').text(values[6]);
	  	$('#destinationStateCode').val(values[7]);
	  	$('#destinationStateCodeVal').text(values[7]);
	  	$('#destinationZipCode').val(values[8]);
	  	$('#destinationZipCodeVal').text(values[8]);
	  	/*if(values[8].length >5)
		{
			//alert(values[8]);
			var str=values[8];
			str = str.replace(/(\S{5})/g,"$1-");
			 document.getElementById('destinationZipCodeVal').innerHTML = (values[8]=='null'?'':str); 
			document.getElementById('destinationZipCode').value=str;
		}*/
	  	
	  	$('#destinationCountry').val(values[9]);
	  	$('#destinationCountryVal').text(values[9]);
	  	$('#destinationAddressRoleType').val(values[10]);
	  	$('#destinationAddressRoleTypeVal').text(values[10]);
	  	document.getElementById('destinationAddressRoleTypeCode').value=(values[18]);
	  	if(values[11]=='Y')
		 {
	  		//alert(values[11]);
	  		//$('#isDestinationArolActive').attr('disabled',false);
	  		$('#isDestinationArolActive').val(true);
	  		$('#isDestinationArolActive').attr('checked',true);
		 }
	  	else
  		{
  			$('#isDestinationArolActive').val(false);
  		}
	  	$('#action').val("destinationSelected");
	  	$('#isSourceArolActive').attr('disabled',false);
	  	$('#isDestinationArolActive').attr('disabled',false);
	  	$("#addressRoleCrossReferenceForm").validationEngine('detach');
	  	blockUI();
	  	$('#addressRoleCrossReferenceForm').attr('action',"getArol");
		$("#addressRoleCrossReferenceForm").ajaxSubmit(options); 
	}
	  //self.opener.document.getElementById('aroleId').value = values[1];
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
	$('#isSourceArolActive').attr('disabled','disabled');
  	$('#isDestinationArolActive').attr('disabled','disabled');
  	$("#addressRoleCrossReferenceForm").validationEngine('attach');
  	document.getElementById('sourceTradeList').innerHTML = (responseText.data.sourceTradeList==null?'':responseText.data.sourceTradeList);
	document.getElementById('destinationTradeList').innerHTML = (responseText.data.destinationTradeList==null?'':responseText.data.destinationTradeList);
	$('#addressRoleCrossReferenceForm').attr('action',"createUpdate");
	$.unblockUI();
} 


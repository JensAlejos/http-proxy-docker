$(function() {
	
	var partyOrg = "";
	var partyAddr = "";
	
	$('input[name="address"]').live('keydown', function(evt)
	{
		var keyCode = evt.keyCode;
		if(keyCode==32 || (48<=keyCode && keyCode<=57)
				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
				|| (109<=keyCode && keyCode<=111))
		{
			if($('#partyTypeCode :selected').val()=='')
			{
				$('input[name="address"]').blur();
				alert("Please select Party type first");
			}
			else
				return true;
		}
		else if(keyCode == '9')
		{
			$('select[name="contactId"]').focus();
			return false;
		}
		else
			return true;
	});
	
	$('#partyTypeCode').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="organizationName"]').focus();
			  return false;
		  }
		 return true;
	});
	$('select[name="contactId"]').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="contact"]').focus();
			  return false;
		  }
		 return true;
	});
	$('#partiesRepeatContact').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="contactPhoneCountryCode"]').focus();
			  return false;
		  }
		 return true;
	});
	$('#partyComm1').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="contactCellCountryCode"]').focus();
			  return false;
		  }
		 return true;
	});
	$('#partyComm2').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="contactFaxCountryCode"]').focus();
			  return false;
		  }
		 return true;
	});
	$('#partyComm3').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('input[name="contactEmailAddress"]').focus();
			  return false;
		  }
		 return true;
	});
	
	$('input[name="contactPhoneCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactPhoneCountryCode"]').val()=='1' || 
	    		 $('input[name="contactPhoneCountryCode"]').val()=='01' ||  
	    		 $('input[name="contactPhoneCountryCode"]').val().length == 3){
	    	 $('input[name="contactPhoneAreaCode"]').select();
	     }
	}); 
	
	$('input[name="contactPhoneAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactPhoneAreaCode"]').val().length == 3 && isAmericanParty('contactPhoneCountryCode')) || 
	    		 $('input[name="contactPhoneAreaCode"]').val().length == 4){
	    		$('input[name="contactPhoneExchange"]').select();
	     }
	}); 
	
	$('input[name="contactPhoneAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactPhoneAreaCode"]').val().length == 3 && isAmericanParty('contactPhoneCountryCode')) || 
	    		 $('input[name="contactPhoneAreaCode"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	}); 
	
	$('input[name="contactPhoneExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(($('input[name="contactPhoneExchange"]').val().length == 3 && isAmericanParty('contactPhoneCountryCode')) || 
	 		$('input[name="contactPhoneExchange"]').val().length == 4){
	    	 $('input[name="contactPhoneStation"]').select();
	     }
	}); 
	
	$('input[name="contactPhoneExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactPhoneExchange"]').val().length == 3 && isAmericanParty('contactPhoneCountryCode')) || 
	    		 $('input[name="contactPhoneExchange"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	});

	$('input[name="contactPhoneStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactPhoneStation"]').val().length == 7){
	    	 $('input[name="contactPhoneExtension"]').focus();
	     }
	}); 
	
	$('input[name="contactCellCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactCellCountryCode"]').val()=='1' || 
	    		 $('input[name="contactCellCountryCode"]').val()=='01' ||  
	    		 $('input[name="contactCellCountryCode"]').val().length == 3){
	    	 $('input[name="contactCellAreaCode"]').select();
	     }
	}); 
	
	$('input[name="contactCellAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(($('input[name="contactCellAreaCode"]').val().length == 3 && isAmericanParty('contactCellCountryCode')) || 
	    		 $('input[name="contactCellAreaCode"]').val().length == 4){
	    	 $('input[name="contactCellExchange"]').select();
	     }
	}); 
	
	$('input[name="contactCellAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactCellAreaCode"]').val().length == 3 && isAmericanParty('contactCellCountryCode')) || 
	    		 $('input[name="contactCellAreaCode"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	});
	
	$('input[name="contactCellExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(($('input[name="contactCellExchange"]').val().length == 3 && isAmericanParty('contactCellCountryCode')) || 
	    		 $('input[name="contactCellExchange"]').val().length == 4 ){
	    	 $('input[name="contactCellStation"]').select();
	     }
	}); 
	
	$('input[name="contactCellExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactCellExchange"]').val().length == 3 && isAmericanParty('contactCellCountryCode')) || 
	    		 $('input[name="contactCellExchange"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	});
	
	$('input[name="contactCellStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactCellStation"]').val().length == 4){
	    	 $('input[name="contactCellExtension"]').focus();
	     }
	}); 
	
	$('input[name="contactFaxCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactFaxCountryCode"]').val()=='1' || 
	    		 $('input[name="contactFaxCountryCode"]').val()=='01' ||  
	    		 $('input[name="contactFaxCountryCode"]').val().length == 3){
	    	 $('input[name="contactFaxAreaCode"]').select();
	     }
	}); 
	
	$('input[name="contactFaxAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(($('input[name="contactFaxAreaCode"]').val().length == 3 && isAmericanParty('contactFaxCountryCode')) || 
	    		 $('input[name="contactFaxAreaCode"]').val().length == 4){
	    	 $('input[name="contactFaxExchange"]').select();
	     }
	}); 
	
	$('input[name="contactFaxAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactFaxAreaCode"]').val().length == 3 && isAmericanParty('contactFaxCountryCode')) || 
	    		 $('input[name="contactFaxAreaCode"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	});
	
	$('input[name="contactFaxExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(($('input[name="contactFaxExchange"]').val().length == 3 && isAmericanParty('contactFaxCountryCode')) || 
	    		 $('input[name="contactFaxExchange"]').val().length == 4){
	    	 $('input[name="contactFaxStation"]').select();
	     }
	}); 
	
	$('input[name="contactFaxExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(( $('input[name="contactFaxExchange"]').val().length == 3 && isAmericanParty('contactFaxCountryCode')) || 
	    		 $('input[name="contactFaxExchange"]').val().length == 4){
	    	 evt.preventDefault();
	     }
	});
	
	$('input[name="contactFaxStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="contactFaxStation"]').val().length == 4){
	    		$('input[name="contactFaxExtension"]').focus();
	     }
	}); 

	partiesOrgPredictive();
	partiesAddPredictive();
	
	// Parties Pop-Up Search
	$('input[name="organizationName"]').gatesPopUpSearch({
		func : function() {
			partiesPopupSearch();
		}
	});

	// parties address Pop-Up Search
	$('input[name="address"]').gatesPopUpSearch({
		func : function() {
			if($('#partyTypeCode :selected').val()=='')
				alert("Please select a party type first");
			else
				partiesAddressPopupSearch();
		}
	});
	
	$('input[name="organizationName"]').change(function() {
		isPartyChanged ="Y";
		if($('input[name="organizationName"]').val()!=partyOrg)
		{
			$('input[name="organizationName"]').val('');
			$('input[name="organizationCode"]').val('');
			$('input[name="organizationId"]').val('');
			$('input[name="isOneTimeCustomer"]').val("false");
			//partiesAddPredictive();
		}
		if($('#partyTypeCode :selected').val()=='22'){
			$('#isChangeAcceptedAfterUnitsReceived').val("N");
		}
		$('input[name="address"]').val("");
		$('input[name="address"]').trigger('change');
	});

	$('input[name="address"]').change(function() {
		
		if($('input[name="address"]').val()!=partyAddr)
		{
			$('input[name="address"]').val('');
			$('input[name="addressRoleId"]').val('');
		}
		isPartyChanged ="Y";
		$('input[name="city"]').val('');
		$('input[name="state"]').val('');
		$('input[name="zip"]').val('');
		$('input[name="nameQualifier"]').val('');
		$('input[name="careOf"]').val('');
		$('select[name="contactId"]').children().remove();
		$('select[name="contactId"]').append("<option value=''>Select</option>");
		$('select[name="contactId"]').val('');
		$('select[name="contactId"]').trigger('change');
		$('input[name="countryName"]').val('');
		$('input[name="provinceName"]').val('');
	});

	$('select[name="contactId"]').change(function() {
		isPartyChanged = "Y";
		
		$('input[name="contact"]').val("");
		$('input[name="addressRoleContactCode"]').val("");

		$('input[name="contactPhoneAreaCode"]').val("");
		$('input[name="contactPhoneExchange"]').val("");
		$('input[name="contactPhoneStation"]').val("");
		$('input[name="contactPhoneCountryCode"]').val("");
		$('input[name="contactPhoneExtension"]').val("");
		
		$('input[name="contactCellCountryCode"]').val("");
		$('input[name="contactCellAreaCode"]').val("");
		$('input[name="contactCellExchange"]').val("");
		$('input[name="contactCellStation"]').val("");
		$('input[name="contactCellExtension"]').val("");

		$('input[name="contactFaxCountryCode"]').val("");
		$('input[name="contactFaxAreaCode"]').val("");
		$('input[name="contactFaxExchange"]').val("");
		$('input[name="contactFaxStation"]').val("");
		$('input[name="contactFaxExtension"]').val("");

		$('input[name="contactEmailAddress"]').val("");
		$('input[name="communicationMethodCode"]').val("");
		
		$('#partyComm1').attr("checked", false);
		$('#partyComm2').attr("checked", false);
		$('#partyComm3').attr("checked", false);
		$('#partyComm4').attr("checked", false);
		
		if ($('select[name="contactId"] option').length!=0 && $('select[name="contactId"] :selected').val()!='') {
			$.ajax({
				type : "POST",
				url : _context +"/booking/arole/contact",
				data : {
					addressRoleId : $('input[name="addressRoleId"]').val(),
					contactId : $('select[name="contactId"]').val()
				},
				success : function(responseText) {
					if(responseText.success)
						$("#parties").loadJSON(responseText.data);
				}
			});
		}
	});
	
	$('input[name="contact"]').change(function() {
		if($('select[name="contactId"] :selected').val()!="" && 
				$('select[name="contactId"] option:selected').text()!=$('input[name="contact"]').val())
		{
			var contactName = $('input[name="contact"]').val();
			$('select[name="contactId"]').val("");
			$('select[name="contactId"]').trigger('change');
			$('input[name="contact"]').val(contactName);
		}
	});

	$('#partiesRepeatContact').click(function(){
		if($("#bookingStatusCode :selected").val()=='CANC'){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		if($('input[name="addressRoleId"]').val()!='')
		{
			if($('select[name="contactId"] :selected').val()=='' && 
					$('input[name="contact"]').val()!='')
			{
				repeatCaller ="parties";
				
				$('#originalOrgName').val($('input[name="organizationName"]').val());
				//$('#originalOrgAddress').val($('input[name="address"]').val());
				$('#originalOrgAddress').val(formatAddRoleDscrForSC('', $('input[name="address"]').val(), 
						$('input[name="city"]').val(), $('input[name="state"]').val(), $('input[name="zip"]').val()));
				$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
				$("#repeatContactOriginalAroleId").val($('input[name="addressRoleId"]').val());
				$("#repeatContactNameLabel").html($('input[name="contact"]').val());
				$("#repeatContactId").html($('select[name="contactId"]').html());
				//$("#repeatContactId option[value='']").remove();
				$("#repeatContactId :selected").val('');
				
				$("#repeatContactOverlay").dialog('open');
			}
			else
			{
				$('#partiesRepeatContact').attr("checked", false);
				alert("Please enter a non-CP contact first");
			}
		}
		else
		{
			$('#partiesRepeatContact').attr("checked", false);
			alert("Please select party address role first");
		}
	});
});

function singleAddressPartiesCall(){
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('input[name="organizationId"]').val() + '|'+ $('#partyTypeCode :selected').val() +'|'+$('#tradeCode').val()),
		
		success : function(responseText) {
			if(responseText.length == 1){
				/*var nameQualifier = responseText[0].nameQual;
				var city = responseText[0].city;
				var state = responseText[0].state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);
				$('input[name="address"]').val( finalAddress);*/
				addressAutoCompleteFunction(responseText[0]);
			} else {
				partiesAddressPopupSearch();
			}
			
		}
	});
}

function partiesOrgPredictive()
{
	//var urlPartyOrg = _context + '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();
	$('input[name="organizationName"]').gatesAutocomplete(
	{
		//source : urlPartyOrg,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Name",
	 	extraParams: {
		 		 method: 'searchOrg',
		 		 searchType: '229',
		 		 parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
	 	},
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		formatItem : function(data) {
			$('input[name="organizationId"]').val("");
			return data.name + " - " + data.abbr;
		},
		formatResult : function(data) {
			return data.name + " - " + data.abbr;//data.abbr + "-" + data.name;
		}, 
		select : function(data) {
			$('input[name="organizationName"]').val(
					data.name + " - " + data.abbr);
			partyOrg = data.name + " - " + data.abbr;
			$('input[name="organizationId"]').val(data.id);
			$('input[name="organizationCode"]').val(data.abbr);
			$('input[name="isOneTimeCustomer"]').val('false');
			$('input[name="address"]').val('');
			$('input[name="address"]').trigger('change');
			//partiesAddPredictive();
			singleAddressPartiesCall();
			//partiesAddressPopupSearch();
		}
	});
}

function partiesAddPredictive()
{
	/*var urlPartyAdd = _context
	+ '/cas/autocomplete.do?method=searchAddRoleBK&searchType=234&parentSearch='
	+ $('input[name="organizationId"]').val()
	+ '|'+getAddressRoleTypeFromParty()+'|'+$('#tradeCode').val();*/

	$('input[name="address"]').gatesAutocomplete({
		//source : urlPartyAdd,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
		 		 method: 'searchAddRoleBK',
		 		 searchType: '234',
		 		 parentSearch:  function() { return $('input[name="organizationId"]').val() + '|'+getAddressRoleTypeFromParty()+'|'+$('#tradeCode').val(); }
	 	},
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		formatItem : function(data) {
			/*var partyTypeCode = $('#partyTypeCode :selected').val();
			var addressRoleType = data.addType;
			
			if((partyTypeCode=='20' || partyTypeCode=='21' || partyTypeCode=='31') && addressRoleType!='ALL' && addressRoleType!='FREIGHT PAYABLE')
			{
				return "";
			}
			else if((partyTypeCode=='22' || partyTypeCode=='29') && addressRoleType!='ALL' && addressRoleType!='SHP TO' && addressRoleType!='NOTIFY')
			{
				return "";
			}
			else if(partyTypeCode=='30' && addressRoleType!='ALL' && addressRoleType!='SHPFRM' && addressRoleType!='FWDAGT')
			{
				return "";
			}
			else{*/
				var nameQualifier = data.nameQual;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
				return finalAddress;
			/*}*/
		},
		formatResult : function(data) {
			/*var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);*/
			var nameQualifier = '';
			if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
				nameQualifier =data.nameQual+" - ";
			var finalAddress = nameQualifier+data.stAdd;
			return finalAddress;
		},
		select : function(data) {
			addressAutoCompleteFunction(data);
		}
	});
}

function partiesPopupSearch() {
	orgCaller = 'parties';
	var partiesName = $('input[name="organizationName"]').val();
	var splitpartiesName = "";
	var actionUrl = "";
	if (partiesName.indexOf("-") > 0) {
		splitpartiesName = partiesName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+ encodeURIComponent(splitpartiesName[0]) +'|'
		+ $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitpartiesName[1]);
	} else {
		splitpartiesName = partiesName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
				+ encodeURIComponent(partiesName) + '|'+$('#tradeCode').val() + '|BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function partiesAddressPopupSearch() {
	orgCaller = 'parties';
	
	if ($.trim($('input[name="organizationId"]').val())=='') { 
		alert("Please select organization first");
	}/*else if($('#tradeCode :selected').val()==''){
		alert("Please select Trade");
	}*/else {
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ $('input[name="organizationId"]').val() + '&filterValue2='+getAddressRoleTypeFromParty()+'&filterValue3='+$('#tradeCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}


function clearCityStateZip() {
	$('input[name="nameQualifier"]').val('');
	$('input[name="careOf"]').val('');
	$('input[name="city"]').val('');
	$('input[name="state"]').val('');
	$('input[name="zip"]').val('');
	$('input[name="countryName"]').val('');
	$('input[name="provinceName"]').val('');
}

function getAddressRoleTypeFromParty()
{
	var selectedParty = $('select[name="partyTypeCode"] :selected').val();
	var addressRoleTypeCode = "";
	
	if(selectedParty=='20' || selectedParty=='21' || selectedParty=='31')
		addressRoleTypeCode = "04";
	else if(selectedParty=='30')
		addressRoleTypeCode = "13";
	else if(selectedParty=='22' || selectedParty=='29')
		addressRoleTypeCode = "12";
	
	return addressRoleTypeCode;
}


function addressAutoCompleteFunction(data)
{
	/*var nameQualifier = data.nameQual;
	var city = data.city;
	var state = data.state;
	var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);*/
	var nameQualifier = '';
	if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
	{
		$('input[name="nameQualifier"]').val(data.nameQual);
		nameQualifier =data.nameQual+" - ";
	}
	else
		$('input[name="nameQualifier"]').val('');
	var finalAddress = nameQualifier+data.stAdd;
	partyAddr = finalAddress;
	$('input[name="address"]').val(finalAddress);
	
	$('input[name="addressRoleId"]')
			.val(data.addRole);
	$('input[name="city"]')
			.val(data.city);
	$('input[name="state"]')
			.val(data.state);
	$('input[name="zip"]').val(
			data.zip);
	if(data.coOrgName!=null && data.coOrgName!='null')
		$('input[name="careOf"]').val(data.coOrgName);
	else
		$('input[name="careOf"]').val('');
	$('input[name="countryName"]').val(data.cntry);
	$('input[name="provinceName"]').val(data.provnc);
	
	$('input[name="address"]').val(partyAddr);
	isPartyChanged = "";
	
	partiesContactUpdate();
}

function partiesAddressUpdate(data)
{
	var values = data.split("|");
	
	isPartyChanged = "Y";

	$('input[name="city"]').val(values[2]);
	$('input[name="state"]').val(values[6]);
	$('input[name="zip"]').val(values[8]);
	var nameQualifier = '';
	if(values[4]!=undefined && values[4]!=null && values[4]!='null' && values[4]!='')
	{
		$('input[name="nameQualifier"]').val(values[4]);
		nameQualifier =values[4]+" - ";
	}
	else
		$('input[name="nameQualifier"]').val('');
	if(values[3]!=null && values[3]!='null')
		$('input[name="careOf"]').val(values[3]);
	else
		$('input[name="careOf"]').val('');
	$('input[name="countryName"]').val(values[11]);
	$('input[name="provinceName"]').val(values[10]);
	//var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	var finalAddress = nameQualifier+values[7];
	$('input[name="address"]').val(finalAddress);
	partyAddr = finalAddress;
	$('input[name="addressRoleId"]').val(values[9]);

	partiesContactUpdate();
}

function partiesContactUpdate()
{
	$('select[name="contactId"]').children().remove();
	$('select[name="contactId"]').append("<option value=''>Select</option>");
	$('select[name="contactId"]').val('');
	$('select[name="contactId"]').trigger('change');
	$.ajax({
			type : "POST",
			url : _context +"/booking/arole/getContactList",
			data : {
				addressRoleId : $('input[name="addressRoleId"]').val()
			},
			success : function(responseText) {
				
				$.each(responseText.data.contactList,
					function(key, value) {
						$('select[name="contactId"]').append($("<option/>",
						{
							value : key,
							text : value
						}));
				});
			}
	});
}

function isAmericanParty(name)
{
	var val = $('input[name="'+name+'"]').val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}
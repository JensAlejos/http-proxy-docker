$(function() {

	//tabSequence('#parties'); // D020420
	var partyOrg = "";
	var partyAddr = "";
	
	$('input[name="address"]').focus(function()
	{
		if($('#partyTypeCode :selected').val()=='')
		{
			$('input[name="address"]').blur();
			alert("Please select Party type first");
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
			else{
				if($('input[name="isOneTimeCustomer"]').val()==false || $('input[name="isOneTimeCustomer"]').val()=='false'){ // for defect D019012 
					partiesAddressPopupSearch();
				}
			}
		}
	});
	
	$('input[name="contactEmailAddress"]').blur(function()
	{
		$('input[name="contactEmailAddress"]').attr('title',$('input[name="contactEmailAddress"]').val());
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
		$('input[name="careOf"]').val('');
		$('input[name="city"]').val('');
		$('input[name="state"]').val('');
		$('input[name="zip"]').val('');
		$('input[name="countryName"]').val('');
		$('input[name="provinceName"]').val('');
		$('select[name="contactId"]').val('');
		$('select[name="contactId"]').children().remove();
		$('select[name="contactId"]').append("<option value=''>Select</option>");
		$('select[name="contactId"]').attr('selected',0);
		$('select[name="contactId"]').trigger('change');
		
	});

	$('select[name="contactId"]').change(function() {
		isPartyChanged = "Y";
		var isOneTimerCustomer=$('input[name="isOneTimeCustomer"]').val();
		clearContactInfo(true);
		if ($.trim($('select[name="contactId"]').val()) != '' && $('select[name="contactId"]').val() !=null) { // for defect 18303
			$.ajax({
				type : "POST",
				url : _context +"/shipment/arole/contact",
				data : {
					contactId : $('select[name="contactId"]').val()
				},
				success : function(responseText) {
					
					$("#parties").loadJSON(responseText.data);
					$('input[name="isOneTimeCustomer"]').val(isOneTimerCustomer);
					checkForOneTimerCustomer(); //against defect 21191
					setPartyCommMethodValue(responseText.data);
					setphoneCountryCodeParties(); // to populate phone country code
					$('input[name="contactEmailAddress"]').attr('title',$('input[name="contactEmailAddress"]').val());
				}
			});
		}
		else
		{
			clearContactInfo(true);
			checkForOneTimerCustomer(); 
		}
		/*// For Defect start
		if (($('select[name="contactId"]').val() != null) && ($('select[name="contactId"]').val() !='')) {
			enableDisableContactIdParties(false);
		}else{
			enableDisableContactIdParties(true);
		}
		// For Defect End*/
	});

	$('#partiesRepeatContact').click(function(){
		if (($("#statusCode").text()=='ISSUED')|| ($("#statusCode").text()=='CORRECTED'))  {
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		var contact= $('input[name="contact"]').val();
		if(($('select[name="contactId"]').selected().val()!='') || ((contact!=null) && ($.trim(contact).length !=0)) )
		{
			
			repeatCaller ="parties";
			
			$('#originalOrgName').val($('input[name="organizationName"]').val());
			$('#originalOrgAddress').val($('input[name="address"]').val()/*+" - "+ $('input[name="city"]').val() +" , "+ $('input[name="state"]').val()*/);
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$('#repeatContactShipmentSeqNo').val($('#shipmentSequenceNumber').val());
			$('#repeatContactShipmentCorrNo').val($('#shipmentCorrectionNumber').val());
			$("#repeatContactOriginalAroleId").val($('input[name="addressRoleId"]').val());
			//$("#repeatContactNameLabel").html($('select[name="contactId"] option:selected').text());
			$("#repeatContactNameLabel").html($('input[name="contact"]').val());
			$("#repeatContactId").html($('select[name="contactId"]').html());
			$("#repeatContactId").selected().val($('select[name="contactId"]').selected().val());
			$('#repeatTrade').val($('#tradeCode').val());
			$('#repeatCaller').val(repeatCaller);
			$('#repeatCallerPartyType').val(getAddressRoleTypeFromParty());
			
			$("#repeatContactOverlay").dialog('open');
		}
		else
			alert("Please select a contact/contact name");
	});
	
	trimPartyContactOnChange(); //D018433
	
	/* $('form[id=parties] #contactPhoneCountryCode').keypress(function(){
		 var len=$('form[id=parties] #contactPhoneCountryCode').val().length;
		 if(len==1)
			 {
			 $('form[id=parties] #contactPhoneAreaCode').focus();
			 }
	 });
	 $('form[id=parties] #contactPhoneAreaCode').keypress(function(){
		 var len=$('form[id=parties] #contactPhoneAreaCode').val().length;
		 if(len==2)
			 {
			 $('form[id=parties] #contactPhoneExchange').focus();
			 }
	 }); 
	 $('form[id=parties] #contactPhoneExchange').keypress(function(){
		 var len=$('form[id=parties] #contactPhoneExchange').val().length;
		 if(len==2)
			 {
			 $('form[id=parties] #contactPhoneStation').focus();
			 }
	 });
	 $('form[id=parties] #contactPhoneStation').keypress(function(){
		 var len=$('form[id=parties] #contactPhoneStation').val().length;
		 if(len==3)
			 {
			 $('form[id=parties] #contactPhoneExtension').focus();
			 }
	 });
	 
	
	 
	*/
	/*
	  var phoneCountryCode="contactPhoneCountryCode";
      var cellCountryCode="contactCellCountryCode";
      var faxCountryCode="contactFaxCountryCode";*/
	
    autoTabOverlay('contactPhoneCountryCode','contactPhoneAreaCode', 1,'contactPhoneCountryCode');
    autoTabOverlay('contactPhoneAreaCode','contactPhoneExchange', 3,'contactPhoneCountryCode');	
    autoTabOverlay('contactPhoneExchange','contactPhoneStation', 3,'contactPhoneCountryCode');
	autoTabOverlay('contactPhoneStation','contactPhoneExtension', 4,'contactPhoneCountryCode');	
	
	 
	autoTabOverlay('contactCellCountryCode','contactCellAreaCode', 1,'contactCellCountryCode');
	autoTabOverlay('contactCellAreaCode','contactCellExchange', 3,'contactCellCountryCode');	
	autoTabOverlay('contactCellExchange','contactCellStation', 3,'contactCellCountryCode');
	autoTabOverlay('contactCellStation','contactCellExtension', 4,'contactCellCountryCode');	
	
	 
	autoTabOverlay('contactFaxCountryCode','contactFaxAreaCode', 1,'contactFaxCountryCode');
	autoTabOverlay('contactFaxAreaCode','contactFaxExchange', 3,'contactFaxCountryCode');	
	autoTabOverlay('contactFaxExchange','contactFaxStation', 3,'contactFaxCountryCode');
	autoTabOverlay('contactFaxStation','contactFaxExtension', 4,'contactFaxCountryCode');	

	
	
});

function isTextSelected(input) {
	if(input.value.length==0) {
		return false;
	}
    if (typeof input.selectionStart == "number") {
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    } else if (typeof document.selection != "undefined") {
        input.focus();
    }
}

function autoTabOverlay(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
    //Get a reference to the two elements in the tab sequence.
    var CurrentElement = $('form[id=parties] #' + CurrentElementID);
    var NextElement = $('form[id=parties] #' + NextElementID);
   
    
    CurrentElement.keydown(function(e) {
    	var thisElement=this;
    	setTimeout(function(){
        //Retrieve which key was pressed.
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence. 
        var phoneCountryCode="contactPhoneCountryCode";
        var cellCountryCode="contactCellCountryCode";
        var faxCountryCode="contactFaxCountryCode";
        
        if ((CurrentElementID == phoneCountryCode) || (CurrentElementID == cellCountryCode)	|| (CurrentElementID == faxCountryCode)) 
        {
        	if ((CurrentElement.val()=='1' || 
        	        CurrentElement.val()=='01' ||  CurrentElement.val()=='001' || 
        	        CurrentElement.val().length == 3)
				&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105)) && !isTextSelected(thisElement))
        		{
        			NextElement.select();
        		}
        	
        
		}
        else {
			if (((CurrentElement.val().length == FieldLength && isAmerican(CountryCodeID)) || 
					(CurrentElement.val().length == 4))
							&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105)) && !isTextSelected(thisElement))
				{	
						NextElement.select();
				}
					
			 }
        
      /*
		 * if (CurrentElement.val().length >= FieldLength && ((KeyID >= 48 &&
		 * KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))) NextElement.focus();
		 */
    	},5);
    });
}

function isAmerican(id)
{
	var val = $('form[id=parties]  #'+id).val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

function checkForOneTimerCustomer()
{
	if($('input[name="isOneTimeCustomer"]').val()=="false" || $('input[name="isOneTimeCustomer"]').val()==false)
	{
		if($('#contactId').val()!="")
 		{
 			$('#partiesRepeatContact').attr("disabled",true);	
 		}
		else
 		{
 			$('#partiesRepeatContact').attr("disabled",false);
 		}
	}
	$('input[name="contact"]').val("");
}
function contactNameChanged()
{
	clearContactInfo(false);
	$('#contactId').val('select'); 
	if($('input[name="isOneTimeCustomer"]').val()=="false")
	$('#partiesRepeatContact').attr("disabled",false); //21191	
}
function partiesOrgPredictive()
{
	//var urlPartyOrg = _context + '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();
	$('input[name="organizationName"]').gatesAutocomplete(
	{
		//source : urlPartyOrg,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'searchOrg',
		 		 searchType: '229',
		 		 parentSearch:  function() {
		 			//Code change Start -- DO17562
		 			 if(getAddressRoleTypeFromParty()=='12')
		 				 return "BL|"+$('#tradeCode').val();
		 			 else
		 				 return "BK|"+$('#tradeCode').val();
		 			 //Code change end -- DO17562
	 			 }
	 	},
		formatItem : function(data) {
			$('input[name="organizationId"]').val("");
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.name + "-" + data.abbr;
		}, 
		select : function(data) {
			$('input[name="organizationName"]').val(
					data.name + "-" + data.abbr);
			$('input[name="organizationName"]').attr('title',$('input[name="organizationName"]').val());
			partyOrg = data.name + "-" + data.abbr;
			$('input[name="organizationId"]').val(data.id);
			$('input[name="organizationCode"]').val(data.abbr);
			$('input[name="isOneTimeCustomer"]').val(false);
			$('input[name="address"]').trigger('change');
			//partiesAddPredictive();
			singleAddressSelect();
			//partiesAddressPopupSearch();
		}
	});
}

function singleAddressSelect(){
	if($('select[name="partyTypeCode"]').selected().val()=='')
	{	
		var addressRoleCode=null;
	}
	else
		{
		addressRoleCode=$('select[name="partyTypeCode"]').selected().val();
		}
	$.ajax({
		type : "POST",
	
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+ $('input[name="organizationId"]').val() +'|'+addressRoleCode+'|'+$('#tradeCode').val(),						
		
		success : function(responseText) {
			
			if(responseText.length == 1){
				if(responseText[0].coOrgName!=null&&responseText[0].coOrgName!='null')
				$('input[name="careOf"]').val(responseText[0].coOrgName);
				else
					$('input[name="careOf"]').val('');	
				$('input[name="city"]').val(responseText[0].city);
				$('input[name="state"]').val(responseText[0].state);
				$('input[name="zip"]').val(responseText[0].zip);
				if(responseText[0].cntry!=null&&responseText[0].cntry!='null')
					$('input[name="countryName"]').val(responseText[0].cntry);
				else
					$('input[name="countryName"]').val("US");	
				if(responseText[0].provnc!=null&&responseText[0].provnc!='null')
					$('input[name="provinceName"]').val(responseText[0].provnc);
				else
					$('input[name="provinceName"]').val("");
				var finalAddress = formatAddRoleDscrForSC(responseText[0].nameQual, responseText[0].stAdd,responseText[0].city,responseText[0].state);//nameQualifier, addressLine1, city, state)
				$('input[name="address"]').val(finalAddress);
				
				partyAddr = finalAddress;
				$('input[name="addressRoleId"]').val(responseText[0].addRole);

				clearContactInfo(true);

				// Get contact list for address. [commented for merge.]
				$.ajax({
					async:false,
					type : "POST",
					url : _context +"/shipment/arole/getContactList",
					data : {
						addressRoleId : $('input[name="addressRoleId"]').val()
					},
					success : function(responseText) {
						$('select[name="contactId"]').children().remove();
						$('select[name="contactId"]').append("<option value=''>Select</option>");
						$.each(responseText.data.contactList, function(key, value) {
							$('select[name="contactId"]').append($("<option/>", {
								value : key,
								text : value
							}));
						});
						$('select[name="contactId"]').attr('selected', 0);
						$('select[name="contactId"]').trigger('change'); //D017159	
					}
				});
			} else {
			
				partiesAddressPopupSearch();
			}
			
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
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
				return finalAddress;
			/*}*/
		},
		formatResult : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
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
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=|'+ $('#tradeCode').val() + '|BK|||'+splitpartiesName[1];
	} else {
		splitpartiesName = partiesName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
				+ partiesName + '|'+$('#tradeCode').val() + '|BK';
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
	$('input[name="careOf"]').val('');
	$('input[name="city"]').val('');
	$('input[name="state"]').val('');
	$('input[name="zip"]').val('');
	$('input[name="countryName"]').val('');
	$('input[name="provinceName"]').val('');
}

function getAddressRoleTypeFromParty()
{
	var selectedParty = $('select[name="partyTypeCode"]').selected().val();
	var addressRoleTypeCode = "";
	
	if(selectedParty=='20' || selectedParty=='21' || selectedParty=='31')
		addressRoleTypeCode = "04";
	else if(selectedParty=='30')
		addressRoleTypeCode = "13";
	else if(selectedParty=='22' || selectedParty=='29')
		addressRoleTypeCode = "12";
	else if(selectedParty=='42' )
		addressRoleTypeCode = "02";
	else if(selectedParty=='43' )
		addressRoleTypeCode = "03";
	
	return addressRoleTypeCode;
}

function partiesAddressUpdate(data)
{
	var values = data.split("|");
	
	isPartyChanged = "Y";
	if(values[3]!=null&&values[3]!='null')
	$('input[name="careOf"]').val(values[3]);
	else
		$('input[name="careOf"]').val('');
	$('input[name="city"]').val(values[2]);
	$('input[name="state"]').val(values[6]);
	$('input[name="zip"]').val(values[8]);
	$('input[name="countryName"]').val(values[11]);
	if(values[10]!=null && values[10]!='null')
		$('input[name="provinceName"]').val(values[10]);
	else
		$('input[name="provinceName"]').val('');
	
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('input[name="address"]').val(finalAddress);
	$('input[name="address"]').attr('title',$('input[name="address"]').val()+','+values[15]+','+values[16]);
	partyAddr = finalAddress;
	$('input[name="addressRoleId"]').val(values[9]);

	clearContactInfo(true);

	// Get contact list for address. [commented for merge.]
	$.ajax({
		async:false,
		type : "POST",
		url : _context +"/shipment/arole/getContactList",
		data : {
			addressRoleId : $('input[name="addressRoleId"]').val()
		},
		success : function(responseText) {
			$('select[name="contactId"]').children().remove();
			$('select[name="contactId"]').append("<option value=''>Select</option>");
			$.each(responseText.data.contactList, function(key, value) {
				$('select[name="contactId"]').append($("<option/>", {
					value : key,
					text : value
				}));
			});
			$('select[name="contactId"]').attr('selected', 0);
			$('select[name="contactId"]').trigger('change'); //D017159	
		}
	});
}

function addressAutoCompleteFunction(data)
{
	var nameQualifier = data.nameQual;
	var city = data.city;
	var state = data.state;
	var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
	$('input[name="address"]')
			.val(finalAddress);
	partyAddr = finalAddress;
	$('input[name="addressRoleId"]')
			.val(data.addRole);
	if(data.coOrgName!=null&&data.coOrgName!='null')
		$('input[name="careOf"]').val(data.coOrgName);
	else
		$('input[name="careOf"]').val('');
	$('input[name="city"]')
			.val(data.city);
	$('input[name="state"]')
			.val(data.state);
	$('input[name="zip"]').val(
			data.zip);
	if(data.cntry!=null&&data.cntry!='null')
		$('input[name="countryName"]').val(data.cntry);
	else
		$('input[name="countryName"]').val("US");
		if(data.provnc!=null&&data.provnc!='null')
		$('input[name="provinceName"]').val(data.provnc);
	else
		$('input[name="provinceName"]').val('');
	$('input[name="isOneTimeCustomer"]').val(false);
	isPartyChanged = "";

	$.ajax({
			type : "POST",
			url : _context +"/shipment/arole/getContactList",
			data : {
				addressRoleId : $('input[name="addressRoleId"]').val()
			},
			success : function(responseText) {
				
				$('select[name="contactId"]').children().remove();
				/* D017159 $('select[name="contactId"]').append("<option value=''></option>");*/
				$.each(responseText.data.contactList,
					function(key, value) {
						$('select[name="contactId"]').append($("<option/>",
						{
							value : key,
							text : value
						}));
				});
				clearContactInfo(true);
				$('select[name="contactId"]:first-child').attr("selected", "selected");
				$('select[name="contactId"]').trigger('change');
			}
	});

}

function clearContactInfo(contactClear){
	
	if(contactClear)
	$('input[name="contact"]').val("");

	$('input[name="contactFaxCountryCode"]').val("");
	$('input[name="contactFaxAreaCode"]').val("");
	$('input[name="contactFaxExchange"]').val("");
	$('input[name="contactFaxStation"]').val("");
	$('input[name="contactFaxExtension"]').val(""); // For Defect DD017016

	$('input[name="contactCellCountryCode"]').val("");
	$('input[name="contactCellAreaCode"]').val("");
	$('input[name="contactCellExchange"]').val("");
	$('input[name="contactCellStation"]').val("");
	$('input[name="contactCellExtension"]').val(""); // For Defect DD017016

	$('input[name="contactPhoneAreaCode"]').val("");
	$('input[name="contactPhoneExchange"]').val("");
	$('input[name="contactPhoneStation"]').val("");
	$('input[name="contactPhoneCountryCode"]').val("");
	$('input[name="contactPhoneExtension"]').val(""); // For Defect DD017016

	$('input[name="contactEmailAddress"]').val("");
//	$('input[name="communicationMethodCode"]').val("P");
	$('input[name="communicationMethodCode"]').val("");
	
	$('#partyComm1').attr("checked", false);
	$('#partyComm2').attr("checked", false);
	$('#partyComm3').attr("checked", false);
	$('#partyComm4').attr("checked", false);
	
	//setDefaultPrefMethod("party");
}

/*function enableDisableContactIdParties(set){
	if($("#statusCode").val()!='CANC')
		$('select[name="contactId"]').attr("disabled",set);
}*/

function setphoneCountryCodeParties(){
	$.ajax({
		async: false,
		type : "POST",
		url : _context +"/shipment/phoneCountryCode",
		data : {
			addressRoleId : $('input[name="addressRoleId"]').val()
		},
		success : function(responseText) {
			if($('input[name="contactPhoneCountryCode"]').val()==''){
				$('input[name="contactPhoneCountryCode"]').val(responseText.data);
			}
			//D022908: 	Maintain Bill - add party
			if($('input[name="contactFaxCountryCode"]').val()==''){
				$('input[name="contactFaxCountryCode"]').val(responseText.data);
			}
		}
	});
}
//Code Addition start for defect -D018433

function trimPartyContactOnChange(){
	$('input[name="contact"]').change(function() {
		$('input[name="contact"]').val($.trim($('input[name="contact"]').val()));
		contactNameChanged();
	});
	$('input[name="contactEmailAddress"]').change(function() {
		$('input[name="contactEmailAddress"]').val($.trim($('input[name="contactEmailAddress"]').val()));
	});
	$('input[name="contactFaxCountryCode"]').change(function() {
		$('input[name="contactFaxCountryCode"]').val($.trim($('input[name="contactFaxCountryCode"]').val()));
	});
	$('input[name="contactFaxAreaCode"]').change(function() {
		$('input[name="contactFaxAreaCode"]').val($.trim($('input[name="contactFaxAreaCode"]').val()));
	});
	$('input[name="contactFaxExchange"]').change(function() {
		$('input[name="contactFaxExchange"]').val($.trim($('input[name="contactFaxExchange"]').val()));
	});
	$('input[name="contactFaxStation"]').change(function() {		
		$('input[name="contactFaxStation"]').val($.trim($('input[name="contactFaxStation"]').val()));
	});
	$('input[name="contactFaxExtension"]').change(function() {
		$('input[name="contactFaxExtension"]').val($.trim($('input[name="contactFaxExtension"]').val()));
	});
	$('input[name="contactCellCountryCode"]').change(function() {
		$('input[name="contactCellCountryCode"]').val($.trim($('input[name="contactCellCountryCode"]').val()));
	});
	$('input[name="contactCellAreaCode"]').change(function() {
		$('input[name="contactCellAreaCode"]').val($.trim($('input[name="contactCellAreaCode"]').val()));
	});
	$('input[name="contactCellExchange"]').change(function() {
		$('input[name="contactCellExchange"]').val($.trim($('input[name="contactCellExchange"]').val()));
	});
	$('input[name="contactCellStation"]').change(function() {
		$('input[name="contactCellStation"]').val($.trim($('input[name="contactCellStation"]').val()));
	});
	$('input[name="contactCellExtension"]').change(function() {
		$('input[name="contactCellExtension"]').val($.trim($('input[name="contactCellExtension"]').val()));
	});
	$('input[name="contactPhoneAreaCode"]').change(function() {
		$('input[name="contactPhoneAreaCode"]').val($.trim($('input[name="contactPhoneAreaCode"]').val()));
	});
	$('input[name="contactPhoneExchange"]').change(function() {
		$('input[name="contactPhoneExchange"]').val($.trim($('input[name="contactPhoneExchange"]').val()));
	});
	$('input[name="contactPhoneStation"]').change(function() {
		$('input[name="contactPhoneStation"]').val($.trim($('input[name="contactPhoneStation"]').val()));
	});
	$('input[name="contactPhoneCountryCode"]').change(function() {
		$('input[name="contactPhoneCountryCode"]').val($.trim($('input[name="contactPhoneCountryCode"]').val()));
	});
	$('input[name="contactPhoneExtension"]').change(function() {
		$('input[name="contactPhoneExtension"]').val($.trim($('input[name="contactPhoneExtension"]').val()));
	});
}
//Code Addition end for defect -D018433
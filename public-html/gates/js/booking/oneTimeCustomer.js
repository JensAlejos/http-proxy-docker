var isOneTimerChanged = "";
var isCustomerOverridden = false;
/*var savedCommMethodValue = "";*/
var provinces = "";	
$(function() {
	
	clearOneTimeCustomerForm();
	$('#callingPartyCode').val("");
	
	$('.trimmedField').change(function()
	{
		$(this).val($.trim($(this).val()));
	});
	if($('#oneTimeCountry').val() != null && (new String($('#oneTimeCountry').val().toLowerCase())=="ca" || new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase=="canada")){
		provinces=$('#oneTimeState').val() + "-" + $('#oneTimeProvince').val();
	}
	
	$("#oneTimeCustomerDialog").dialog({
		autoOpen : false,
		width : 1000,
		modal : true,
		open : function()
		{
			tabSequence('#oneTimeCustomerDialog',false,false);
			bindTabEvents();
			$('#bkngNo').val($('#shipmentNumber').val());
			$('#bookingCommentId').val($('#commentId').val());
			$("#onetimecustomer").validationEngine('attach');
			isOneTimerChanged ="";
		},
		close : function()
		{
			removeOneTimeCustomerPopUps();
			$("#onetimecustomer").validationEngine('detach');
			clearOneTimeCustomerForm();
			$('#callingPartyCode').val("");
			tabSequence('#',true,false);
		}
	});
	
	$('#onetimecustomer :input').change(function()
	{
		if((this.type=='text' || this.type=='radio') && this.name!='dataAdminCode')
			isOneTimerChanged = "Y";
	});
	
	$('#oneTimeZip').blur(function()
	{
		usZipDisplay();
	});
	
	$('#oneTimeCountry').blur(function()
	{
		usZipDisplay();	
    });
	
	$('#oneTimeState').blur(function()
	{
		if($.trim($('#oneTimeState').val()) != '')
		{
			//$('#oneTimeCountry').val('US');
			if($('#callingParty').val() != 'party')
			{
				if($("#otCommunicationMethodCode:checked").val()=="P"
					&& $('#oneTimeContactPhoneCountryCode').val()=='')
					$('#oneTimeContactPhoneCountryCode').val('1');
				else if($("#otCommunicationMethodCode:checked").val()=="F"
					&& $('#oneTimeContactFaxCountryCode').val()=='')
					$('#oneTimeContactFaxCountryCode').val('1');
				else if($("#otCommunicationMethodCode:checked").val()=="C"
						&& $('#oneTimeContactCellCountryCode').val()=='')
						$('#oneTimeContactCellCountryCode').val('1');
			}
		}
    });
	
	/*$('#contactFirstName').blur(function()
	{
		if($.trim($('#contactFirstName').val())=='' && $('#custContactId').val()!='')
		{
			//if($('#dataAdminCode:checked').val()=="A")
			//	$('#dataAdminCode:checked').attr("checked", false);
			//$('#dataAdminCode').attr("disabled", true);
			
			$('#custContactId').val('');
			$('#contactLastName').val('');
			
			$('#oneTimeContactPhoneCountryCode').val('');
			$('#oneTimeContactPhoneAreaCode').val('');
			$('#oneTimeContactPhoneExchange').val('');
			$('#oneTimeContactPhoneStation').val('');
			$('#oneTimeContactPhoneExtension').val('');
			
			$('#oneTimeContactCellCountryCode').val('');
			$('#oneTimeContactCellAreaCode').val('');
			$('#oneTimeContactCellExchange').val('');
			$('#oneTimeContactCellStation').val('');
			$('#oneTimeContactCellExtension').val('');
			
			$('#oneTimeContactFaxCountryCode').val('');
			$('#oneTimeContactFaxAreaCode').val('');
			$('#oneTimeContactFaxExchange').val('');
			$('#oneTimeContactFaxStation').val('');
			$('#oneTimeContactFaxExtension').val('');
			
			$('#oneTimeContactEmailAddress').val('');
			
			$('.otCommunicationMethodCode').attr("checked", false);
			//$('#otCommunicationMethodCode').attr("checked", true);
		}	
    });*/

	$('#customerName').blur(function()
	{
		var defaultCustomerName = "";
		if($('#contactFirstName').val()!='' && $('#contactLastName').val()!='')
			defaultCustomerName = $('#contactFirstName').val()+ " " + $('#contactLastName').val();
		else if($('#contactFirstName').val()!='')
			defaultCustomerName = $('#contactFirstName').val();
		else if($('#contactLastName').val()!='')
			defaultCustomerName = $('#contactLastName').val();
		
		if($.trim($('#customerName').val()) != defaultCustomerName)
			isCustomerOverridden = true;
		else
			isCustomerOverridden = false;
		
		/*if($.trim($('#customerName').val())=='' && $('#customerId').val()!='')
		{
			var additionalInfo = $('#additionalInfo').val();
			clearOneTimeCustomerForm();
			$('#additionalInfo').val(additionalInfo);
		}
		if($.trim($('#customerName').val())=='')
		{
			if($('#dataAdminCode:checked').val()=="A")
				$('#dataAdminCode:checked').attr("checked", false);
			$('#dataAdminCode').attr("disabled", true);
		}
		else
			$('#dataAdminCode').attr("disabled", false);*/
    });
	
//Code changes start for Defect D028405	
/*	$('#addressLine1').change(function()
	{
	  //	if($.trim($('#addressLine1').val())=='' && $('#addressId').val()!='')
	    
		if($('#callingPartyCode').val()=='02'||$('#callingPartyCode').val()=='03'){
			$('#addressId').val('');
			$('#custAddressRoleId').val('');
			$('#customerNameQualifier').val('');
			$('#addressLine2').val('');
			$('#addressLine3').val('');
			$('#oneTimeCity').val('');
			$('#oneTimeState').val('');
			$('#oneTimeZip').val('');
			$('#oneTimeProvince').val('');
			$('#oneTimeCountry').val('');
	    }
    });*/
	//Code changes ended for D028405
	
	$('#existingOrganization').gatesAutocomplete(
	{
		source:_context+'/cas/autocomplete.do',
		name: "Customer Name",
	 	extraParams: {
	 		 method: 'searchOrg',
	 		 searchType: '229',
	 		parentSearch:  function() { return "BK|"; }
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
		//source : urlShipperOrg,
		formatItem : function(data) {
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.name + "-" + data.abbr;
		},
		select : function(data) {
			
			$('#replaceOrganizationId').val(data.id);
			if($("#dataAdminCode:checked").val()=="C")
			{
				$('#existingAddressLine1').val("");
				$('#existingAddressLine1').trigger('change');
				
				singleAddressOneTimerCall();
			}
		}
	});
	
	$('#existingOrganization').gatesPopUpSearch({
		func : function() {
			customerOrganizationPopupSearch();
		}
	});
	
	$('#existingOrganization').change(
		function() {
			if($('#existingOrganization').val()=='')
				$('#replaceOrganizationId').val('');
	});
	
$('#existingAddressLine1').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
	 		 method: 'searchAddRoleBK',
	 		 searchType: '234',
	 		 parentSearch:  function() { return $('#replaceOrganizationId').val(); }
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
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			return finalAddress;
		},
		formatResult : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			return finalAddress;
		},
		select : function(data) {
			$('#replaceAddressRoleId').val(data.addRole);
		}
	});	
	
	$('#existingAddressLine1').gatesPopUpSearch({
		func : function() {
			if($('#replaceOrganizationId').val()!='')
				customerAddressPopupSearch();
			else
				alert("Please select organization first");
		}
	});
	
	$('#existingAddressLine1').change(
		function() {
			if($('#existingAddressLine1').val()=='')
				$('#replaceAddressRoleId').val('');
	});
	
	$('#contactFirstName').change(function(){
		deriveOrganizationName();
	});
	$('#contactLastName').change(function(){
		deriveOrganizationName();
	});
	
	var url = _context +'/organization/address/autoComplete' 
	$('#oneTimeProvince').gatesAutocomplete({
		source: url ,
		autoSelectFirst:true,
		extraParams:{
			country: function () { return $('#oneTimeCountry').val(); }
		},
		formatItem: function(item) {
			provinces=""+item.code+"-"+item.name;
			return provinces;
			
		},
		formatResult: function(item) {
			return item.name;
		},
		select: function(item) {
			$('#oneTimeProvince').val(item.name);
			$('#oneTimeState').val(item.code);
			$('#oneTimeCountry').val("CA");
			provinces=""+item.code+"-"+item.name;
		}	
	});	
	$('#oneTimeCountry').gatesPopUpSearch({
		func : function() {
			oneTimeCountryPopupSearch();
		}
	});
	$('#oneTimeCountry').change(function(){
		if($('#oneTimeCountry').val() == null || (new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada")){
			provinces = "";
		}
		if($('#oneTimeCountry').val() != null){
			$('#oneTimeCountry').val( $.trim($('#oneTimeCountry').val().toUpperCase()));
		}
		else if($('#oneTimeCountry').val() == null || $('#oneTimeCountry').val() == ''){
			if($('#oneTimeState').val()!='' && $('#oneTimeProvince').val()==''){
				$('#oneTimeCountry').val('US');
			}
		}
	});
	$('#oneTimeState').change(function(){
		if($('#oneTimeCountry').val() != null && new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
	});
	$('#oneTimeProvince').change(function(){
		if($('#oneTimeCountry').val() != null && new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
	});
	
	
});

function oneTimeCountryPopupSearch() {
	removeOneTimeCustomerPopUps();	
	var oneTimeCountry = $('#oneTimeCountry').val();	
	var	actionUrl = _context + '/cas/countryNameLookup.do?filterValue1='+oneTimeCountry+'|';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function countryCodeUpdate(id){
	var values = id.split("|");
	$('#oneTimeCountry').val(values[0]);
}
function openOneTimeCustomer(callingParty) {
        
        var tradeCodeBooking = document.getElementById("tradeCode");
        var tradeCodeBilling = document.getElementById("tradeCodeDesc");
        var tradeCodeValue;
        if(tradeCodeBilling) {
            tradeCodeValue = tradeCodeBilling.textContent.slice(0, 1);
        } else if(tradeCodeBooking){
            var tradeCodeValue = tradeCodeBooking.value;
        }
        
        var customerGroup = document.getElementById('customerGroupId');
        var customerGroupText;
        if(customerGroup){
            customerGroupText = customerGroup.options[customerGroup.selectedIndex].textContent;
            if("Select" == customerGroupText) {
                customerGroupText = null;
            }
        }        
        
	var xErrorCoordinate = window.pageXOffset;
	var yErrorCoordinate = window.pageYOffset;
	$("#oneTimeCustomerDialog").dialog("option", "title", 'One Timer Customer');
	$("#oneTimeCustomerDialog").dialog("option", "buttons",
		[{
			text : "Cancel",
			click : function() {
				removeOneTimeCustomerPopUps();
				if(isOneTimerChanged!="")
				{
					var r = confirm("All unsaved changes will be discarded.Continue?");
					if(r)
						$("#oneTimeCustomerDialog").dialog("close");
					else
						return;
				}
				else
					$("#oneTimeCustomerDialog").dialog("close");
			}
		},
		{
			text : "Save",
			click : function() {
				$('#oneTimeCustMsgDiv').html('');
				if(callingParty=='spotPull')
					isOneTimerChanged = "Y";
				if(isOneTimerChanged!="")
				{
					removeOneTimeCustomerPopUps();
					if ($("#onetimecustomer").validationEngine('validate') & validateContactInfo(callingParty)){
							var queryString = $('#onetimecustomer').formSerialize();
							$.ajax({
								url : _context +"/booking/onetimecust/processOneTimeCustomer",
								type : "POST",
								data : queryString,
								success : function(responseText) {
									if(callingParty=='spotPull')
										showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
									else
										showResponseMessages('oneTimeCustMsgDiv', responseText);
									if(responseText.success)
									{
										$("#oneTimerDataForm").loadJSON(responseText.data);
										/*$('input[name="dataAdminCode"]').attr("disabled", false);
										if($('#otCommunicationMethodCode:checked').val() != undefined)
											savedCommMethodValue = $('#otCommunicationMethodCode:checked').val();
										else
											savedCommMethodValue = "";*/
										isOneTimerChanged = "";
									}
								}
							});
					} 
					else
						return false;
				}
				else
					alert("No fields have been changed. Can not save.");
			}
		},
		{
			text : "Save and Apply",
			click : function() {
				$('#oneTimeCustMsgDiv').html('');
				if(callingParty=='spotPull')
					isOneTimerChanged = "Y";
				if(isOneTimerChanged!="")
				{
					removeOneTimeCustomerPopUps();
					if ($("#onetimecustomer").validationEngine('validate') & validateContactInfo(callingParty)){
							var queryString = $('#onetimecustomer').formSerialize();
							$.ajax({
								url : _context +"/booking/onetimecust/processOneTimeCustomer",
								type : "POST",
								data : queryString,
								success : function(responseText) {
									if(callingParty=='spotPull')
										showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
									else
										showResponseMessages('oneTimeCustMsgDiv', responseText);
									if(responseText.success)
									{
										$("#oneTimerDataForm").loadJSON(responseText.data);
										/*$('input[name="dataAdminCode"]').attr("disabled", false);
										if($('#otCommunicationMethodCode:checked').val() != undefined)
											savedCommMethodValue = $('#otCommunicationMethodCode:checked').val();
										else
											savedCommMethodValue = "";*/
										isOneTimerChanged = "";
										oneTimeOkFunc(callingParty);
									}
								}
							});
					} 
					else
						return false;
				}
				else
				{
					if($('#custAddressRoleId').val()!='' & $("#onetimecustomer").validationEngine('validate') & validateContactInfo(callingParty))
						oneTimeOkFunc(callingParty);
					else
						alert("Cannot save. Use cancel to return to main page.");
				}
			}
		},
		{
			text : "Clear",
			click : function() {
				if(isOneTimerChanged=="")
				{
					var isChanged = false;
					var elements = $('#onetimecustomer :input');
					for(var i=0;i<elements.length;i++)
					{
						if(elements[i].type=='text' && elements[i].value!='')
						{
							isChanged = true;
							break;
						}
					}
					if(isChanged)
						isOneTimerChanged = "Y";
				}
				clearOneTimeCustomerForm();
			}
		}, {
			text : "Send To Data Admin",
			click : function() {
				var queryString = $('#onetimecustomer').formSerialize();                                
				$('#oneTimeCustMsgDiv').html('');
				removeOneTimeCustomerPopUps();
				if (validateDataAdmin() && $("#onetimecustomer").validationEngine('validate') && validateContactInfo(callingParty)) 
				{
					$.ajax({
						url : _context +"/booking/onetimecust/sendToDataAdmin",
						type : "POST",
						data : queryString,
						success : function(responseText) {
							if(callingParty=='spotPull')
								showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
							else
								showResponseMessages('oneTimeCustMsgDiv', responseText);
						}
					});
				}
				else 
					return false;
			}
		} ]);
	if(callingParty=='shipper')
		$('#callingPartyCode').val('02');
	else if(callingParty=='consignee')
		$('#callingPartyCode').val('03');
	else if(callingParty=='party')
	{
		if($('#partyTypeCode :selected').val()!='')
			$('#callingPartyCode').val($('#partyTypeCode :selected').val());
		else
			$('#callingPartyCode').val('ALL');
	}
	else
		$('#callingPartyCode').val('ALL');
	
        
        $('#oneTimerTradeCodes').val(tradeCodeValue);
        $('#customerGroup').val(customerGroupText);
        if(callingParty != 'shipper' && callingParty != 'consignee') {
            $('#oneTimerTradeCodesDiv').attr("hidden", true);
        }
        
	isCustomerOverridden = false;
	var addressRoleId = '';
/*	savedCommMethodValue = "";*/
	if(callingParty=='shipper' && 
			$('input[name="shipper\\.isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="shipper\\.addressRoleId"]').val();
	else if(callingParty=='consignee' && 
			$('input[name="consignee\\.isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="consignee\\.addressRoleId"]').val();
	else if(callingParty=='party' && 
			$('input[name="isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="addressRoleId"]').val();
	else if(callingParty=='spotPull' && $('input[name="addressRoleId"]').val()!='')
	{
		var nameArr = $('#contactName').val().split(" ");
		$('#contactFirstName').val(nameArr[0]);
		if(nameArr.length>1)
		{
			var lastName = nameArr[1];
			if(nameArr.length>2)
			{
				for(var i=1;i<nameArr.length;i++)
				{
					lastName = lastName + " " + nameArr[i];
				}
			}
			$('#contactLastName').val(lastName);
		}
		$('#customerName').val($('#organisations').val());
		
		var defaultCustomerName = "";
		if($('#contactFirstName').val()!='' && $('#contactLastName').val()!='')
			defaultCustomerName = $('#contactFirstName').val()+ " " + $('#contactLastName').val();
		else if($('#contactFirstName').val()!='')
			defaultCustomerName = $('#contactFirstName').val();
		else if($('#contactLastName').val()!='')
			defaultCustomerName = $('#contactLastName').val();
		
		if($.trim($('#customerName').val()) != defaultCustomerName)
			isCustomerOverridden = true;
		else
			isCustomerOverridden = false;
		//$('#addressLine1').val($('#addRolDesc').val());
		//D028385
		if($('#addressLine1').val()=='')
		{
			var str= $('#addRolDesc').val();
			if(str.length>40)
				{
				$('#addressLine1').val(str.substring(0,40));
				}
			else
				{
				$('#addressLine1').val($('#addRolDesc').val());
				}
		}
		$('#oneTimeCity').val($('#city').val());
		$('#oneTimeState').val($('#state').val());
		$('#oneTimeZip').val($('#zip').val());
		if($('#oneTimeState').val()!='' && $('#oneTimeProvince').val()=='')
			$('#oneTimeCountry').val('US');
		$('#oneTimeContactPhoneCountryCode').val($('#phone1').val());
		$('#oneTimeContactPhoneAreaCode').val($('#phone2').val());
		$('#oneTimeContactPhoneExchange').val($('#phone3').val());
		$('#oneTimeContactPhoneStation').val($('#phone4').val());
		$('#oneTimeContactPhoneExtension').val($('#phone5').val());
		
		$('#oneTimeContactCellCountryCode').val($('#cell1').val());
		$('#oneTimeContactCellAreaCode').val($('#cell2').val());
		$('#oneTimeContactCellExchange').val($('#cell3').val());
		$('#oneTimeContactCellStation').val($('#cell4').val());
		$('#oneTimeContactCellExtension').val($('#cell5').val());
		
		$('#oneTimeContactFaxCountryCode').val($('#fax1').val());
		$('#oneTimeContactFaxAreaCode').val($('#fax2').val());
		$('#oneTimeContactFaxExchange').val($('#fax3').val());
		$('#oneTimeContactFaxStation').val($('#fax4').val());
		$('#oneTimeContactFaxExtension').val($('#fax5').val());
		$('#oneTimeContactEmailAddress').val($('#email').val());
		
		
		// D028085: 	trim last name if needed.
		
		if($('#contactLastName').val().length > 32) {
			$('#contactLastName').val($('#contactLastName').val().substring(0,32));
		}
	}
	if(addressRoleId!='')
	{
		$.ajax({
			url : _context +"/booking/onetimecust/getOneTimer",
			data : {addressRoleId:addressRoleId},
			success : function(responseText) {
				$("#onetimecustomer").loadJSON(responseText);
				$("#custContactId").val(responseText.contactId);
				/*if($('#customerId').val()!='' && $('#addressId').val()!='' && $('#custAddressRoleId').val()!='')
					$('input[name="dataAdminCode"]').attr("disabled", false);*/
				var prefMethod = 0;
				for(var i=1;i<=4;i++)
				{
					if($('#'+callingParty+'Comm'+i.toString()).attr("checked"))
					{
						prefMethod = i;
						break;
					}
				}
				if(prefMethod!=0)
				{
					$('#otCommunicationMethodCode:checked').attr("checked", false);
					$('.otCommunicationMethodCode')[prefMethod-1].checked = true;
				}
				/*if($('#otCommunicationMethodCode:checked').val() != undefined)
					savedCommMethodValue = $('#otCommunicationMethodCode:checked').val();*/
				$("#oneTimeCustomerDialog").dialog('open');
			}
		});
	}
	else
		$("#oneTimeCustomerDialog").dialog('open');
	
	setTimeout(function(){
		window.scrollTo(xErrorCoordinate, yErrorCoordinate);
		}, 250);
	//return false;
}

function oneTimeOkFunc(callingParty)
{
	if(callingParty=='spotPull')
	{
		$.ajax({
			url : _context +"/booking/onetimecust/getOneTimerForSpotPull",
			data:{addressRoleId:$('#custAddressRoleId').val()},
			success : function(responseText) {
				if(responseText.success)
				{
					$("#dispatchLocationGridForm").loadJSON(responseText.data);
					$("#oneTimeCustomerDialog").dialog("close");
					$("#organisations").css('backgroundColor',"#ffffcc");
					$('#errorMsgLocationDiv').html('');
					document.getElementById('errorMsgLocationDiv').style.display = 'none';
				}
				else
					showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
			}
		});
	}
	else
	{
		$.ajax({
			url : _context +"/booking/onetimecust/getOneTimerForBooking",
			data:{addressRoleId:$('#custAddressRoleId').val()},
			success : function(responseText) {
				if(responseText.success)
				{
					//responseText.data.communicationMethodCode = savedCommMethodValue;
					responseText.data.communicationMethodCode = $("#otCommunicationMethodCode:checked").val();
					if (callingParty == 'shipper') {
						emptyCityStateZip("shipper");
						emptyContactDetails("shipper");
						$('select[name="shipper\\.contactId"]').children().remove();
						$('select[name="shipper\\.contactId"]').append("<option value=''>Select</option>");
						$.each(responseText.data.contactList,
						function(key, value) {
							$('select[name="shipper\\.contactId"]').append($("<option/>",
							{
								value : key,
								text : value
							}));
						});
						if($('input[name="shipper\\.addressRoleId"]').val() != $('#custAddressRoleId').val())
						{
							$("#shipper").loadJSON(responseText.data);
							handlePrepaidCollectIndicator('S');
						}
						else
							$("#shipper").loadJSON(responseText.data);
						setShipperCommMethodValue(responseText.data);
						//enableDisableContactId('shipper',false);
						changeShipperConsigneeColor("shipper", "Y");
						$('input[name="shipper\\.address"]').attr("readonly",true);
						$('#shipperName').val(responseText.data.organizationName);
						shipperAddress = responseText.data.address;
						
						$('#refNumOverRideForShipper').val("N");
						setAccordianTabDetails("shipperNameDiv", "- "+responseText.data.organizationName);
						checkCopyButtons();
						//addShipperAsDebtor();
						isBookingChanged = "Y";
					} else if (callingParty == 'consignee') {
						emptyCityStateZip("consignee");
						emptyContactDetails("consignee");
						
						$('select[name="consignee\\.contactId"]').children().remove();
						$('select[name="consignee\\.contactId"]').append("<option value=''>Select</option>");
						$.each(responseText.data.contactList,
						function(key, value) {
							$('select[name="consignee\\.contactId"]').append($("<option/>",
							{
								value : key,
								text : value
							}));
						});
						if($('input[name="consignee\\.addressRoleId"]').val() != $('#custAddressRoleId').val())
						{
							$("#consignee").loadJSON(responseText.data);
							handlePrepaidCollectIndicator('C');
						}
						else
							$("#consignee").loadJSON(responseText.data);
						setConsigneeCommMethodValue(responseText.data);
						changeShipperConsigneeColor("consignee", "Y");
						$('input[name="consignee\\.address"]').attr("readonly",true);
						$('#consigneeName').val(responseText.data.organizationName);
						consigneeAddress = responseText.data.address;
						
						$('#refNumOverRideForConsignee').val("N");
						$('#isChangeAcceptedAfterUnitsReceived').val("N");
						checkCopyButtons();
						setAccordianTabDetails("consigneeNameDiv", "- "+responseText.data.organizationName);
						//addConsigneeAsDebtor();
						loadHazGrid();
						isBookingChanged = "Y";
					} else if (callingParty == 'party') {
						$('input[name="organizationName"]').trigger('change');
						$('select[name="contactId"]').children().remove();
						$('select[name="contactId"]').append("<option value=''>Select</option>");
						$.each(responseText.data.contactList,
						function(key, value) {
							$('select[name="contactId"]').append($("<option/>",
							{
								value : key,
								text : value
							}));
						});
						$("#parties").loadJSON(responseText.data);
						setPartyCommMethodValue(responseText.data);
						isPartyChanged = "Y";
					}
					$("#oneTimeCustomerDialog").dialog("close");
				}
				else
					showResponseMessages('oneTimeCustMsgDiv', responseText);
			}
		});
	}
}

function deriveOrganizationName(){
	//alert("Inside oneTimeCustomer deriveOrganizationName, customerId:"+$('#customerId').val()+", isCustomerOverridden:"+isCustomerOverridden+", FirstName:"+$('#contactFirstName').val()+", lastName:"+$('#contactLastName').val());
	if( !isCustomerOverridden)
	{
		if($('#contactFirstName').val()!='' && $('#contactLastName').val()!='')
			$('#customerName').val($('#contactFirstName').val()+ " " + $('#contactLastName').val());
		else if($('#contactFirstName').val()!='')
			$('#customerName').val($('#contactFirstName').val());
		else if($('#contactLastName').val()!='')
			$('#customerName').val($('#contactLastName').val());
	}
	/*if($.trim($('#customerName').val())=='')
	{
		if($('#dataAdminCode:checked').val()=="A")
			$('#dataAdminCode:checked').attr("checked", false);
		$('#dataAdminCode').attr("disabled", true);
	}
	else
		$('#dataAdminCode').attr("disabled", false);*/
}

function removeOneTimeCustomerPopUps() {
	$("#onetimecustomer").validationEngine('hideAll');
}

//Added by for repeatContact popup.

function repeatContactPopUps() {
		
	var repeatEmail =  $("#repeatContactEmailAddress").val();	
	var repeatPhone =  $("#repeatContactPhone").val();
	var repeatCell =  $("#repeatContactCell").val();
	var repeatFax =  $("#repeatContactFax").val();	
	
	var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;	
	
	var phoneFilter = /^[0-9-+]+$/;
			
	if ( repeatPhone.length > 0 && !phoneFilter.test(repeatPhone)) {		
		$(".error-phonemessages").text("* Numbers only").css("color", "red").fadeIn();	        
	 }
	else{
		$(".error-phonemessages").empty().fadeOut();
	}
	
	if ( repeatCell.length > 0 && !phoneFilter.test(repeatCell)) {		
		$(".error-cellmessages").text("* Numbers only").css("color", "red").fadeIn();	        
	 }
	else{
		$(".error-cellmessages").empty().fadeOut();
	}
	
	if ( repeatFax.length > 0 && !phoneFilter.test(repeatFax)) {		
		$(".error-faxmessages").text("* Numbers only").css("color", "red").fadeIn();	        
	 }
	else{
		$(".error-faxmessages").empty().fadeOut();
	}
	
	
	if ( repeatEmail.length > 0 && !filter.test(repeatEmail)) {		
		$(".error-messages").text("* Invalid email address").css("color", "red").fadeIn();	        
	 }
	else{
		$(".error-messages").empty().fadeOut();
	}
}

function validateContactInfo(callingParty)
{
	var isValid = true;
	if(!validateCountryCode('phone') | !validateCountryCode('fax') | !validateCountryCode('cell'))
		isValid = false;
	if(!validatePhoneNo('customerPhone') | !validatePhoneNo('customerCell') | !validatePhoneNo('customerFax'))
		isValid = false;
	
	var isAnyContactInfoPresent = false;
	if(checkPhoneInfo('phone') || checkPhoneInfo('fax') || 
			checkPhoneInfo('cell') || $('#oneTimeContactEmailAddress').val()!='')
		isAnyContactInfoPresent = true;
	if($('#contactFirstName').val()=='' && (callingParty == 'party' || callingParty == 'spotPull') && isAnyContactInfoPresent)
	{
		$('#contactFirstName').validationEngine('showPrompt', '* This is required for contact for info to be saved', 'error', 'topLeft', true);
		isValid = false;
	}
	else if($('#contactFirstName').val()=='' && (callingParty == 'party' || callingParty == 'spotPull') && !isAnyContactInfoPresent)
	{
		$("#otCommunicationMethodCode:checked").attr("checked", false);
	}
	
	if($("#otCommunicationMethodCode:checked").val()=="P" && !checkPhoneInfo('phone'))
	{
		// Defect 25150
		if($("#tradeCode").val()=="F"){
			isValid = true;
		}
		else {
		isValid = false;
		$($('.otCommunicationMethodCode')[0]).validationEngine('showPrompt', 'Preferred communication (Phone) cannot be empty', 'error', true);
	}}
	else if($("#otCommunicationMethodCode:checked").val()=="C" && !checkPhoneInfo('cell'))
	{
		if($("#tradeCode").val()=="F"){
			isValid = true;
		}
		else {
		isValid = false;
		$($('.otCommunicationMethodCode')[1]).validationEngine('showPrompt', 'Preferred communication (Cell) cannot be empty', 'error', true);
	}}
	else if($("#otCommunicationMethodCode:checked").val()=="F" && !checkPhoneInfo('fax'))
	{if($("#tradeCode").val()=="F"){
		isValid = true;
	}
	else {
		isValid = false;
		$($('.otCommunicationMethodCode')[2]).validationEngine('showPrompt', 'Preferred communication (Fax) cannot be empty', 'error', true);
	}}
	else if($("#otCommunicationMethodCode:checked").val()=="E" && $("#oneTimeContactEmailAddress").val()=="")
	{if($("#tradeCode").val()=="F"){
		isValid = true;
	}
	else {
		isValid = false;
		$($('.otCommunicationMethodCode')[3]).validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
	}}
	
	if(callingParty == 'shipper' || callingParty == 'consignee')
	{
		if($('#contactFirstName').val()==''){
			//Defect 25151
			if($("#tradeCode").val()=="F"){
				isValid = true;
			}
			else{
		{
			$('#contactFirstName').validationEngine('showPrompt', '* This field is required', 'error', 'topLeft', true);
			isValid = false;
		}
			}
		}
		// D021674
		if($('#contactLastName').val()==''){
			if($("#tradeCode").val()=="F"){
				isValid = true;
			}
			else{
		{
			$('#contactLastName').validationEngine('showPrompt', '* This field is required', 'error', 'topLeft', true);
			isValid = false;
		}
			}
		}
/*		if(!checkPhoneInfo('phone'))
		{
			// Defect 25150
			if($("#tradeCode").val()=="F"){
				isValid = true;
			}
			else {
			$('#oneTimeContactPhoneAreaCode').validationEngine('showPrompt', 'Phone is required', 'error', 'topLeft', true); 
			isValid = false;  
		}}*/
		if($("#otCommunicationMethodCode:checked").val()==undefined)
		{
			// Defect 25150
			if($("#tradeCode").val()=="F"){
					isValid = true;
				}
				else{
			isValid = false;
			$("#otCommunicationMethodCode").validationEngine('showPrompt', 'Please select a preferred method', 'error', true);
		}
	}
	}
	
	return isValid;
}

function validateCountryCode(callingField)
{
	var isValid = true;
	var isUS = false;
	if($('#oneTimeCountry').val()!=null && new String($('#oneTimeCountry').val().toLowerCase())=='us')
		isUS = true;
	if(callingField == 'phone')
	{
		if(checkPhoneInfo(callingField) && $('#oneTimeContactPhoneCountryCode').val()=='')
		{
			if(isUS)
				$('#oneTimeContactPhoneCountryCode').val('1');
			else
			{
				$("#oneTimeContactPhoneCountryCode").validationEngine('showPrompt', 'Country code required if country not US', 'error', 'topRight', true);
				isValid = false;
			}
		}
	}
	else if(callingField == 'cell')
	{
		if(checkPhoneInfo(callingField) && $('#oneTimeContactCellCountryCode').val()=='')
		{
			if(isUS)
				$('#oneTimeContactCellCountryCode').val('1');
			else
			{
				$("#oneTimeContactCellCountryCode").validationEngine('showPrompt', 'Country code required if country not US', 'error', 'topRight', true);
				isValid = false;
			}
		}
	}
	else if(callingField == 'fax')
	{
		if(checkPhoneInfo(callingField) && $('#oneTimeContactFaxCountryCode').val()=='')
		{
			if(isUS)
				$('#oneTimeContactFaxCountryCode').val('1');
			else
			{
				$("#oneTimeContactFaxCountryCode").validationEngine('showPrompt', 'Country code required if country not US', 'error', 'topRight', true);
				isValid = false;
			}
		}
	}
	
	return isValid;
}

function checkPhoneInfo(callingField)
{
	if(callingField == 'phone')
	{
		if($('#oneTimeContactPhoneCountryCode').val()!='' || $('#oneTimeContactPhoneAreaCode').val()!=''
			|| $('#oneTimeContactPhoneExchange').val()!='' || $('#oneTimeContactPhoneStation').val()!='')
			return true;
		else
			return false;
	}
	else if(callingField == 'fax')
	{
		if($('#oneTimeContactFaxCountryCode').val()!='' || $('#oneTimeContactFaxAreaCode').val()!=''
			|| $('#oneTimeContactFaxExchange').val()!='' || $('#oneTimeContactFaxStation').val()!='')
			return true;
		else
			return false;
	}
	else if(callingField == 'cell')
	{
		if($('#oneTimeContactCellCountryCode').val()!='' || $('#oneTimeContactCellAreaCode').val()!=''
			|| $('#oneTimeContactCellExchange').val()!='' || $('#oneTimeContactCellStation').val()!='')
			return true;
		else
			return false;
	}
}

function validateCustomerZip(){
	var zipCode = $.trim($("#oneTimeZip").val());
	var countryName = $.trim($("#oneTimeCountry").val());
	var split = zipCode.split("-");
	if(new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states")
	{
		if(zipCode.length != 5 && zipCode.length != 10)
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		else if(zipCode.length == 5 && zipCode=="00000")
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		else if(split.length==2 && split[1]=="0000")
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		var zipRegEx = new RegExp(/^(([0-9]+)([\-]([0-9]+))?)$/);
        if (!zipRegEx.test($('#oneTimeZip').val())) {
            return "The ZIP CODE entered is not numeric (NNNNN or NNNNN-NNNN)";
        }
	}
	else
	{
		if(zipCode.length == 10)
		{
			return "10th position of postal code must be blank for non US countries";
		}
	}
}
	
function usZipDisplay()
{
	var countryName = $('#oneTimeCountry').val();
	if(new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states")
	{
		var zipCode = $.trim($("#oneTimeZip").val());
		var split = zipCode.split("-");
		
		if(split.length==1 && zipCode.length>5)
		{
			var  val = zipCode.replace(/(.{5})/g,"$1-");
			$('#oneTimeZip').val(val);
    	}
		if($('#oneTimeZip').val().length>10)
		{
			$('#oneTimeZip').val($('#oneTimeZip').val().substr(0,10));
		}
		else if($('#oneTimeZip').val().length==6)
		{
			$('#oneTimeZip').val($('#oneTimeZip').val().substr(0,5));
		}
	}
}

function validateCountryGroup() {
	  var stateCode = $.trim($("#oneTimeState").val());
	  var zipCode = $.trim($("#oneTimeZip").val());
	  var provinceName = $.trim($("#oneTimeProvince").val());
	  var countryName = $.trim($("#oneTimeCountry").val());
	  $("#oneTimeCountry").val($.trim($("#oneTimeCountry").val()));
	  
	  if(new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states")
	  {
		  if(stateCode.length == 0 || zipCode.length == 0)
		  {
			  return "State and Zip are required if Country is US";
		  }
		  else if(provinceName.length != 0)
		  {
			  return "Province not required if Country is US";
		  }
	  }
	  else if(new String(countryName.toLowerCase())=="ca" || new String(countryName.toLowerCase()).ignoreCase=="canada")
	  {
		  if(stateCode.length == 0)
		  {
			  return "State required if country is CA";
		  }
		  if(provinces == "" && (stateCode == "" || provinceName == "")){
			  return "Please select province from predictive list if country is CA ";
		  }
		 /* if(provinceName.length == 0)
		  {
			  return "Province required if Country is CA";
		  }*/
	  }
}

//This function is already present in clause.js
/*function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}*/

function openSearchOneTimerWindow()
{
	var url = _context + '/cas/onetimeCustomerSearch.do?source=Booking&callingParty='+$('#callingPartyCode').val();
	window.open(url, '', "top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0");
}

function oneTimeCustUpdate(id)
{
	var data = id.split("|");
	clearOneTimeCustomerForm();
	
	//$('#bkngNo').val(data[7]);
	$('#customerId').val(data[19]);
	$('#custContactId').val(nullCheck(data[20]));
	$('#addressId').val(data[21]);
	$('#custAddressRoleId').val(data[22]);
	$('#contactFirstName').val(nullCheck(data[10]));
	$('#contactLastName').val(nullCheck(data[11]));
	$('#customerName').val(data[0]);
	//$('#customerAbbr').val(nullCheck(data[1]));
	$('#customerNameQualifier').val(nullCheck(data[12]));
	$('#addressLine1').val(data[2]);
	$('#suite').val(nullCheck(data[13]));
	$('#addressLine2').val(nullCheck(data[8]));
	$('#addressLine3').val(nullCheck(data[9]));
	$('#oneTimeCity').val(data[3]);
	$('#oneTimeState').val(nullCheck(data[4]));
	$('#oneTimeZip').val(nullCheck(data[5]));
	$('#oneTimeProvince').val(nullCheck(data[14]));
	$('#oneTimeCountry').val(data[15]);
	$('#oneTimeContactEmailAddress').val(nullCheck(data[18]));
	
	if(data[16]!='null' && data[16]!='')
	{
		var tel = data[16].split("-");
		for(var i=0;i<tel.length;i++)
		{
			if(i==0)
				$('#oneTimeContactPhoneCountryCode').val(tel[0]);
			else if(i==1)
				$('#oneTimeContactPhoneAreaCode').val(tel[1]);
			else if(i==2)
				$('#oneTimeContactPhoneExchange').val(tel[2]);
			else if(i==3)
				$('#oneTimeContactPhoneStation').val(tel[3]);
			else if(i==4)
				$('#oneTimeContactPhoneExtension').val(tel[4]);
		}
	}
	
	if(data[17]!='null' && data[17]!='')
	{
		var tel = data[17].split("-");
		for(var i=0;i<tel.length;i++)
		{
			if(i==0)
				$('#oneTimeContactCellCountryCode').val(tel[0]);
			else if(i==1)
				$('#oneTimeContactCellAreaCode').val(tel[1]);
			else if(i==2)
				$('#oneTimeContactCellExchange').val(tel[2]);
			else if(i==3)
				$('#oneTimeContactCellStation').val(tel[3]);
			else if(i==4)
				$('#oneTimeContactCellExtension').val(tel[4]);
		}
	}
	
	if(data[23]!='null' && data[23]!='')
	{
		var tel = data[23].split("-");
		for(var i=0;i<tel.length;i++)
		{
			if(i==0)
				$('#oneTimeContactFaxCountryCode').val(tel[0]);
			else if(i==1)
				$('#oneTimeContactFaxAreaCode').val(tel[1]);
			else if(i==2)
				$('#oneTimeContactFaxExchange').val(tel[2]);
			else if(i==3)
				$('#oneTimeContactFaxStation').val(tel[3]);
			else if(i==4)
				$('#oneTimeContactFaxExtension').val(tel[4]);
		}
	}
	//$('input[name="dataAdminCode"]').attr("disabled", false);
	isOneTimerChanged = "Y";
	isCustomerOverridden = false;
}

function nullCheck(val)
{
	if(val=='null')
		return '';
	else
		return val;
}

function customerOrganizationPopupSearch() {
	removeOneTimeCustomerPopUps();
	orgCaller = 'dataAdmin';
	var orgName = $('#existingOrganization').val();
	var actionUrl = "";
	if(orgName.indexOf("-") > 0){
		splitOrgName = orgName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+encodeURIComponent(splitOrgName[0])+'||BK|||'+encodeURIComponent(splitOrgName[1]);
	}else{
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+ encodeURIComponent(orgName) + '||BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function customerAddressPopupSearch()
{
	removeOneTimeCustomerPopUps();
	orgCaller = 'dataAdmin';
	var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
			+ $('#replaceOrganizationId').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'AddressSearch', windowStyle);
}

function clearOneTimeCustomerForm()
{
	removeOneTimeCustomerPopUps();
	$("#onetimecustomer").clearForm();
	clearHiddenFields();
	//$('input[name="dataAdminCode"]').attr("disabled", true);
	$('#existingOrganization').attr("disabled", true);
	$('#existingAddressLine1').attr("disabled", true);
	//$('#otCommunicationMethodCode').attr("checked", true);
	$('#oneTimeCustMsgDiv').html('');
	isCustomerOverridden = false;
	//savedCommMethodValue = "";
}

function clearHiddenFields()
{
	$('#customerId').val('');
	$('#custContactId').val('');
	$('#custAddressRoleId').val('');
	$('#addressId').val('');
	$('#customerAbbr').val('');
	$('#replaceOrganizationId').val("");
	$('#replaceAddressRoleId').val("");
	$('#bkngNo').val("");
	$('#bookingCommentId').val("");
	$('#customerGroup').val("");
}

function validateDataAdmin()
{
	var isValid = true;
	
        if($("#dataAdminCode:checked").val()==undefined)
	{
		isValid = false;
		$("#dataAdminCode").validationEngine('showPrompt', 'Please select a Data Admin Mode.', 'error', true);
	}
	else if($("#dataAdminCode:checked").val()=="A")
	{
		if($('#customerName').val()=='')
		{
			isValid = false;
			$("#customerName").validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		}
		else
		{
			var regexp = '^[0-9a-zA-Z\ \'\&\(\)\.\/#-]+$';
			var re = new RegExp(regexp);
			if(!re.test($("#customerName").val()))
			{
				isValid = false;
				$("#customerName").validationEngine('showPrompt', '* No special characters allowed', 'error', 'topRight', true);
			}
		}
	}
	else if($("#dataAdminCode:checked").val()=="B")
	{
		if($("#replaceOrganizationId").val()=="")
		{
			isValid = false;
			$("#existingOrganization").validationEngine('showPrompt', 'Please select an existing Organization', 'error', true);
		}
		else if(!$("#dataAdminNewAddress").validationEngine('validate'))
			isValid = false;
	}
	else if($("#dataAdminCode:checked").val()=="C")
	{
		if($("#replaceOrganizationId").val()=="")
		{
			isValid = false;
			$("#existingOrganization").validationEngine('showPrompt', 'Please select an existing Organization', 'error', true);
		}
		if($("#replaceAddressRoleId").val()=="")
		{
			isValid = false;
			$("#existingAddressLine1").validationEngine('showPrompt', 'Please select an existing Address', 'error', true);
		}
		else if(!$("#dataAdminNewAddress").validationEngine('validate'))
			isValid = false;
	} 
        
        if($('#oneTimerTradeCodes') == null || $('#oneTimerTradeCodes').val() == "")
        {       
                isValid = false;
                $("#oneTimerTradeCodes").validationEngine('showPrompt', 'Please provide Trade Codes', 'error', true);
        }    
	
	return isValid;
}

function enableAddressSearch(radioObj)
{
	removeOneTimeCustomerPopUps();
	if($(radioObj).val()=="A")
	{
		$('#existingOrganization').val("");
		$('#existingOrganization').attr("disabled", true);
		$('#existingAddressLine1').val("");
		$('#existingAddressLine1').attr("disabled", true);
		/*if($('#customerName').val()=='')
		{
			alert("Please select a new or existing one time organization first");
			$(radioObj).attr("checked", false);
		}*/
	}
	else if($(radioObj).val()=="B")
	{
		$('#existingOrganization').attr("disabled", false);
		$('#existingAddressLine1').val("");
		$('#existingAddressLine1').attr("disabled", true);
		/*if($('#customerId').val()=='')
		{
			alert("Please select existing one time organization first");
			$(radioObj).attr("checked", false);
		}*/
	}
	else if($(radioObj).val()=="C")
	{
		/*if($('#customerId').val()=='')
		{
			alert("Please select existing one time organization first");
			$(radioObj).attr("checked", false);
		}
		else
		{*/
			$('#existingOrganization').attr("disabled", false);
			$('#existingAddressLine1').attr("disabled", false);
		/*}*/
	}
}

function changeShipperConsigneeColor(field, marker)
{
	var fieldArr = ['organizationName'/*, 'address', 'city', 'state', 'zip', 'contactId', 'contact',
	                'contactPhoneCountryCode', 'contactPhoneAreaCode', 'contactPhoneExchange', 'contactPhoneStation',
	                'contactCellCountryCode', 'contactCellAreaCode', 'contactCellExchange', 'contactCellStation',
	                'contactFaxCountryCode', 'contactFaxAreaCode', 'contactFaxExchange', 'contactFaxStation',
	                'contactEmailAddress'*/];
	
	for(var i=0;i<fieldArr.length;i++)
	{
		if(marker=='Y')
			$('input[name="'+field+'\\.'+fieldArr[i]+'"]').css('backgroundColor', "#ffffcc");
		else
			$('input[name="'+field+'\\.'+fieldArr[i]+'"]').css('backgroundColor', "#cfe2f3");
	}
}

function processShipperConsigneeColor(field)
{
	if($('input[name="'+field+'\\.isOneTimeCustomer"]').val()=="true"
		|| $('input[name="'+field+'\\.isOneTimeCustomer"]').val()==true)
	{
		/*Booking Security*/
		if(isShipperConsgineeModifiable){
			changeShipperConsigneeColor(field, "Y");
		}
		$('input[name="'+field+'\\.address"]').attr("readonly",true);
	}
	else
	{
		changeShipperConsigneeColor(field, "N");
		/*Booking Security*/
		if(isShipperConsgineeModifiable){
			$('input[name="'+field+'\\.address"]').attr("readonly",false);
		}
	}
}

//Use only for fields which are mandatory, otherwise for trimming use class trimmedField
function trimValue(field, rules, i, options)
{
	if(field.val()!='')
	{
		field.val($.trim(field.val()));
		var value  = field.val();
		if(value=='')
			return "* This field is required";
		//D025864
		/*else if(value.length < 5)
		{
			return "*  Invalid City";
		}*/
	}
}

function bindTabEvents()
{
	
	$('#searchOneTimer').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('#addressLine1').focus();
			  return false;
		  }
		 return true;
	});
	/*$('#oneTimeContactPhoneStation').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('#oneTimeContactCellCountryCode').focus();
			  return false;
		  }
		 return true;
	});
	$('#oneTimeContactCellStation').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('#oneTimeContactFaxCountryCode').focus();
			  return false;
		  }
		 return true;
	});
	$('#oneTimeContactFaxStation').live('keydown', function(evt){
		 var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9'){
			  $('#oneTimeContactEmailAddress').focus();
			  return false;
		  }
		 return true;
	});*/
	
	//code to tab out in Phone fields
	var chkPhoneCountry =true;
	var chkPhoneArea = true;
	var chkPhoneExchange = true;
	
	$('#oneTimeContactPhoneCountryCode').click(function() {
	     removeErrorPointers();
		});
	$('#oneTimeContactPhoneAreaCode').click(function() {
   	     removeErrorPointers();
   		});
	$('#oneTimeContactPhoneExchange').click(function() {
   	     removeErrorPointers();
   		});
	$("#oneTimeContactPhoneCountryCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneCountry){
	    	 this.select();
	    	 chkPhoneCountry = false;
	     }
		});
	
	$("#oneTimeContactPhoneCountryCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactPhoneCountryCode').val()=='1' || 
	    	$('#oneTimeContactPhoneCountryCode').val()=='01' ||  
	    	$('#oneTimeContactPhoneCountryCode').val().length == 3){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactPhoneAreaCode').select();
		    	chkPhoneCountry =true;
	     }
		}); 
	$("#oneTimeContactPhoneAreaCode").focus(function(evt) {
		chkPhoneArea = true;
	});
	
	$("#oneTimeContactPhoneAreaCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	 $("#oneTimeContactPhoneAreaCode").val('');
	     }
		});
	
	$("#oneTimeContactPhoneAreaCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	 $("#oneTimeContactPhoneAreaCode").val('');
	     }
	     if(($('#oneTimeContactPhoneAreaCode').val().length == 3 && isAmerican('oneTimeContactPhoneCountryCode')) || 
	    		 $('#oneTimeContactPhoneAreaCode').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactPhoneExchange').select();
		    	//chkvoy = true;
	     }
		}); 
	
	$("#oneTimeContactPhoneExchange").focus(function(evt) {
		chkPhoneExchange = true;
	});
	
	$("#oneTimeContactPhoneExchange").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $("#oneTimeContactPhoneExchange").val('');
	     }
		});
	
	$("#oneTimeContactPhoneExchange").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $("#oneTimeContactPhoneExchange").val('');
	     }
	     if(($('#oneTimeContactPhoneExchange').val().length == 3 && isAmerican('oneTimeContactPhoneCountryCode')) || 
	    		 $('#oneTimeContactPhoneExchange').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactPhoneStation').select();
		    	//chkvoy = true;
	     }
		}); 

	$("#oneTimeContactPhoneStation").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactPhoneStation').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactCellCountryCode').focus();
		    	//chkvessel =true;
	     }
		}); 
	
	//code to tab out in Cell fields
	var chkCellCountry =true;
	var chkCellArea = true;
	var chkCellExchange = true;
	
	$('#oneTimeContactCellCountryCode').click(function() {
	     removeErrorPointers();
		});
	$('#oneTimeContactCellAreaCode').click(function() {
   	     removeErrorPointers();
   		});
	$('#oneTimeContactCellExchange').click(function() {
   	     removeErrorPointers();
   		});
	$("#oneTimeContactCellCountryCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellCountry){
	    	 this.select();
	    	 chkCellCountry = false;
	     }
		});
	
	$("#oneTimeContactCellCountryCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactCellCountryCode').val()=='1' || 
	    	$('#oneTimeContactCellCountryCode').val()=='01' ||  
	    	$('#oneTimeContactCellCountryCode').val().length == 3){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactCellAreaCode').select();
		    	chkCellCountry =true;
	     }
		}); 
	$("#oneTimeContactCellAreaCode").focus(function(evt) {
		chkCellArea = true;
	});
	
	$("#oneTimeContactCellAreaCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	 $("#oneTimeContactCellAreaCode").val('');
	     }
		});
	
	$("#oneTimeContactCellAreaCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	 $("#oneTimeContactCellAreaCode").val('');
	     }
	     if(($('#oneTimeContactCellAreaCode').val().length == 3 && isAmerican('oneTimeContactCellCountryCode')) || 
	    		 $('#oneTimeContactCellAreaCode').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactCellExchange').select();
		    	//chkvoy = true;
	     }
		}); 
	
	$("#oneTimeContactCellExchange").focus(function(evt) {
		chkCellExchange = true;
	});
	
	$("#oneTimeContactCellExchange").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	 $("#oneTimeContactCellExchange").val('');
	     }
		});
	
	$("#oneTimeContactCellExchange").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	 $("#oneTimeContactCellExchange").val('');
	     }
	     if(($('#oneTimeContactCellExchange').val().length == 3 && isAmerican('oneTimeContactCellCountryCode')) || 
	    		 $('#oneTimeContactCellExchange').val().length == 4 ){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactCellStation').select();
		    	//chkvoy = true;
	     }
		}); 
	
	
	$("#oneTimeContactCellStation").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactCellStation').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactFaxCountryCode').focus();
		    	//chkvessel =true;
	     }
		}); 
	
	//code to tab out in Cell fields
	var chkFaxCountry =true;
	var chkFaxArea = true;
	var chkFaxExchange = true;
	
	$('#oneTimeContactFaxCountryCode').click(function() {
	     removeErrorPointers();
		});
	$('#oneTimeContactFaxAreaCode').click(function() {
   	     removeErrorPointers();
   		});
	$('#oneTimeContactFaxExchange').click(function() {
   	     removeErrorPointers();
   		});
	$("#oneTimeContactFaxCountryCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxCountry){
	    	 this.select();
	    	 chkFaxCountry = false;
	     }
		});
	
	$("#oneTimeContactFaxCountryCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactFaxCountryCode').val()=='1' || 
	 	    $('#oneTimeContactFaxCountryCode').val()=='01' ||  
	 	    $('#oneTimeContactFaxCountryCode').val().length == 3){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactFaxAreaCode').select();
		    	chkFaxCountry =true;
	     }
		}); 
	$("#oneTimeContactFaxAreaCode").focus(function(evt) {
		chkFaxArea = true;
	});
	
	$("#oneTimeContactFaxAreaCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $("#oneTimeContactFaxAreaCode").val('');
	     }
		});
	
	$("#oneTimeContactFaxAreaCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $("#oneTimeContactFaxAreaCode").val('');
	     }
	     if(($('#oneTimeContactFaxAreaCode').val().length == 3 && isAmerican('oneTimeContactFaxCountryCode')) || 
	    		 $('#oneTimeContactFaxAreaCode').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactFaxExchange').select();
		    	//chkvoy = true;
	     }
		}); 
	
	$("#oneTimeContactFaxExchange").focus(function(evt) {
		chkFaxExchange = true;
	});
	
	$("#oneTimeContactFaxExchange").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $("#oneTimeContactFaxExchange").val('');
	     }
		});
	
	$("#oneTimeContactFaxExchange").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $("#oneTimeContactFaxExchange").val('');
	     }
	     if(($('#oneTimeContactFaxExchange').val().length == 3 && isAmerican('oneTimeContactFaxCountryCode')) || 
	    		 $('#oneTimeContactFaxExchange').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactFaxStation').select();
		    	//chkvoy = true;
	     }
		}); 
	
	
	$("#oneTimeContactFaxStation").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#oneTimeContactFaxStation').val().length == 4){
		    	//$('#IN_VOY').focus();
		    	$('#oneTimeContactEmailAddress').focus();
		    	//chkvessel =true;
	     }
		}); 
	
}

function isAmerican(id)
{
	var val = $('#'+id).val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

function singleAddressOneTimerCall(){
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('#replaceOrganizationId').val()),
		
		success : function(responseText) {
			if(responseText.length == 1){
				var nameQualifier = responseText[0].nameQual;
				var city = responseText[0].city;
				var state = responseText[0].state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);
				$('#existingAddressLine1').val(finalAddress);
				$('#replaceAddressRoleId').val(responseText[0].addRole);
				
			} else {
				customerAddressPopupSearch();
			}
		}
	});
}
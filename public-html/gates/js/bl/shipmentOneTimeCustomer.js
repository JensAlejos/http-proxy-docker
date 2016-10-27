var isOneTimerChanged = "";
//added against 21739
var oneTimeCustomerAdded=false;
var isCustomerOverridden = false;
var provinces = "";	
$(function() {
	$("#shipmentonetimecustomer").clearForm();
	clearOneTimeCustomerForm();
	trimOnetimeContactOnChange(); //	D018433
	if($('#oneTimeCountry').val() != null && (new String($('#oneTimeCountry').val().toLowerCase())=="ca" || new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase=="canada")){
		provinces=$('#oneTimeState').val() + "-" + $('#oneTimeProvince').val();
	}
	$("#oneTimeCustomerDialog").dialog({
		autoOpen : false,
		width : 1010,
		modal : true,
		open : function()
		{
			$("#shipmentonetimecustomer").validationEngine('attach');
			isOneTimerChanged ="";
			tabSequence('#oneTimeCustomerDialog',false,false);
		},
		close : function()
		{
			removeOneTimeCustomerPopUps();
			$("#shipmentonetimecustomer").validationEngine('detach');			
			//clearOneTimeCustomerForm();
			/*This line is commented because it is calling clearContactInfo() of shipment_parties_overlay.js
			 and clear its contact info on save, that is not desirable. Hence I have manually called the thing 
			 except clearing contact info of parties overlay*/
			clearHiddenFields();
			$("#oneTimeCustomerDialog input[type=text]").val("");
//			$('input[name="dataAdminCode"]').attr("disabled", true);
			$('#existingAddressLine1').attr("disabled", true);
			//$('#otCommunicationMethodCode').attr("checked", true);
			//$('#otCommunicationMethodCode').val("P"); //addition start for defect DDO17159
			$('#oneTimeCustMsgDiv').html('');
			$('#oneTimeCity').val(''); //addition start for defect DDO17061
			$('#oneTimeState').val(''); //addition start for defect DDO17061
			$('#oneTimeZip').val('');
			$('#custContactId').val('');
			
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
			
			$('input[name="communicationMethodCode"]').attr("checked", false);
			$('#otCommunicationMethodCode').attr("checked", false);
			tabSequence('#shipmentForm',true,false);
			
			
		}
	});
	
	$('#shipmentonetimecustomer :input').change(function()
	{
		if((this.type=='text' || this.type=='radio') && this.name!='dataAdminCode')
			isOneTimerChanged = "Y";
	});
	
	$('#oneTimeZip').blur(function()
	{
		usZipDisplay();
	});
	$('#oneTimeContactEmailAddress').blur(function()
			{
		$('#oneTimeContactEmailAddress').attr('title',$('#oneTimeContactEmailAddress').val());
			});
	
	$('#oneTimeCountry').blur(function()
	{
		usZipDisplay();	
		//populateOneTimeContactPhoneCountryCode(); // New method added for BR.....
    });
	
	$('#contactFirstName').blur(function()
	{
		if($.trim($('#contactFirstName').val())=='' && $('#custContactId').val()!='')
		{
			/*if($('#dataAdminCode:checked').val()=="A")
				$('#dataAdminCode:checked').attr("checked", false);
			$('#dataAdminCode').attr("disabled", true);*/
			
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
			
			$('input[name="communicationMethodCode"]').attr("checked", false);
			$('#otCommunicationMethodCode').attr("checked", true);
		}	
    });
	$('#contactFirstName').change(function(){
		deriveOrganizationName();
	});
	$('#contactLastName').change(function(){
		deriveOrganizationName();
	});

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
			$('#dataAdminCode').attr("disabled", false); */
    });
	
	$('#addressLine1').blur(function()
	{
		if($.trim($('#addressLine1').val())=='' && $('#addressId').val()!='')
		{
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
    });	
	
	$('#existingAddressLine1').gatesPopUpSearch({
		func : function() {
			if($('#replaceOrganizationId').val()!='')
				customerAddressPopupSearch();
			else
				alert("Please select organization first");
		}
	});
	
	$('.trimmedField').change(function()
	{
		$(this).val($.trim($(this).val()));
	});
	
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
	$('#oneTimeCountry').gatesPopUpSearch({
		func : function() {
			oneTimeCountryPopupSearch();
		}
	});
	
	$('#existingOrganization').change(
			function() {
				if($('#existingOrganization').val()=='')
					$('#replaceOrganizationId').val('');
		});
	
	$('#existingAddressLine1').change(
			function() {
				if($('#existingAddressLine1').val()=='')
					$('#replaceAddressRoleId').val('');
		});
	
	var phoneCountryCode='oneTimeContactPhoneCountryCode';
	var cellCountryCode='oneTimeContactCellCountryCode';
	var faxCountryCode='oneTimeContactFaxCountryCode';
	
	autoTabOneTime('oneTimeContactPhoneCountryCode','oneTimeContactPhoneAreaCode', 1,'oneTimeContactPhoneCountryCode');
	autoTabOneTime('oneTimeContactPhoneAreaCode','oneTimeContactPhoneExchange', 3,'oneTimeContactPhoneCountryCode');	
	autoTabOneTime('oneTimeContactPhoneExchange','oneTimeContactPhoneStation', 3,'oneTimeContactPhoneCountryCode');
	autoTabOneTime('oneTimeContactPhoneStation','oneTimeContactPhoneExtension', 4,'oneTimeContactPhoneCountryCode');	
	autoTabOneTime('oneTimeContactPhoneExtension','oneTimeContactCellCountryCode', 4,'oneTimeContactPhoneCountryCode');
	 
	autoTabOneTime('oneTimeContactCellCountryCode','oneTimeContactCellAreaCode', 1,'oneTimeContactCellCountryCode');
	autoTabOneTime('oneTimeContactCellAreaCode','oneTimeContactCellExchange', 3,'oneTimeContactCellCountryCode');	
	autoTabOneTime('oneTimeContactCellExchange','oneTimeContactCellStation', 3,'oneTimeContactCellCountryCode');
	autoTabOneTime('oneTimeContactCellStation','oneTimeContactCellExtension', 4,'oneTimeContactCellCountryCode');	
	autoTabOneTime('oneTimeContactCellExtension','oneTimeContactFaxCountryCode', 4,'oneTimeContactCellCountryCode');
	 
	autoTabOneTime('oneTimeContactFaxCountryCode','oneTimeContactFaxAreaCode', 1,'oneTimeContactFaxCountryCode');
	autoTabOneTime('oneTimeContactFaxAreaCode','oneTimeContactFaxExchange', 3,'oneTimeContactFaxCountryCode');	
	autoTabOneTime('oneTimeContactFaxExchange','oneTimeContactFaxStation', 3,'oneTimeContactFaxCountryCode');
	autoTabOneTime('oneTimeContactFaxStation','oneTimeContactFaxExtension', 4,'oneTimeContactFaxCountryCode');	
	autoTabOneTime('oneTimeContactFaxExtension','oneTimeContactEmailAddress', 4,'oneTimeContactFaxCountryCode');
	
	
	
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

	$('#oneTimeCountry').change(function(){
		if($('#countryName').val() == null || (new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada")){
			provinces = "";
		}
		if($('#countryName').val() != null){
			$('#countryName').val( $.trim($('#countryName').val().toUpperCase()));
		}
	});
	$('#oneTimeState').change(function(){
		if($('#countryName').val() != null && (new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada")){
			provinces = "";
		}
	});
	$('#oneTimeProvince').change(function(){
		if($('#countryName').val() != null && (new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada")){
			provinces = "";
		}
	});	
});

function isAmericanOneTime(id)
{
	var val = $('#'+id).val();
	//confirm("inside isAmericanO "+val);
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

function deriveOrganizationName(){
	//alert("Inside shipmentOneTimeCustomer deriveOrganizationName, customerId:"+$('#customerId').val()+", isCustomerOverridden:"+isCustomerOverridden+", FirstName:"+$('#contactFirstName').val()+", lastName:"+$('#contactLastName').val());
	if(!isCustomerOverridden)
	{
		if($('#contactFirstName').val()!='' && $('#contactLastName').val()!='')
			$('#customerName').val($('#contactFirstName').val()+ " " + $('#contactLastName').val());
		else if($('#contactFirstName').val()!='')
			$('#customerName').val($('#contactFirstName').val());
		else if($('#contactLastName').val()!='')
			$('#customerName').val($('#contactLastName').val());
	}
	/*$('#customerName').val($('#contactFirstName').val()+ " " + $('#contactLastName').val());
	if($.trim($('#customerName').val())=='')
	{
		if($('#dataAdminCode:checked').val()=="A")
			$('#dataAdminCode:checked').attr("checked", false);
		$('#dataAdminCode').attr("disabled", true);
	}
	else
		$('#dataAdminCode').attr("disabled", false); */
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
        
	clearOneTimeCustomerForm(); //addition start for defect DDO17061
	$("#shipmentonetimecustomer").clearForm();
	
	$("#oneTimeCustomerDialog").dialog("option", "title", 'One Timer Customer');
	$("#oneTimeCustomerDialog").dialog("option", "buttons",
			
		[
                {
			text : "Cancel",
			click : function() {
				if(isOneTimerChanged!="")
				{
					var r = confirm("All unsaved changes will be discarded.Continue?");
					if(r){
						makeScreenFiledsReadOnly(false); /*Code Addition for defect -DD016962 */
						$("#oneTimeCustomerDialog").dialog("close");
					}else
						return;
				}
				else{
					makeScreenFiledsReadOnly(false); /*Code Addition for defect -DD016962 */
					$("#oneTimeCustomerDialog").dialog("close");
				}
			}
		},
		{
			text : "Save",
			click : function() {
				if(callingParty=='spotPull')
				{
					if ($("#shipmentonetimecustomer").validationEngine('validate') 
							& validateContactInfo()) {
						var queryString = $('#shipmentonetimecustomer')
								.formSerialize();
						$.ajax({
							url : _context +"/shipment/onetimecust/processOneTimeCustomerForSpotPull",
							type : "POST",
							data : queryString,
							success : function(
									responseText) {
								if(responseText.success)
									oneTimeSuccessFunc(responseText, callingParty);
								else
									showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
							}
						});
					} else
						return false;
				}
				else
				{
					//D018663: Contact not mandatory for billing
					if ($("#shipmentonetimecustomer").validationEngine('validate')) {
						if($('#oneTimeCity').val()=='')
						{
							$('#oneTimeCity').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
							return false;
						} else {
							var queryString = $('#shipmentonetimecustomer').formSerialize();
							$.ajax({
								url : _context +"/shipment/onetimecust/processOneTimeCustomer",
								type : "POST",
								data : queryString,
								success : function(
										responseText) {
									if(responseText.success)
										oneTimeSuccessFunc(responseText, callingParty);
									else
										showResponseMessages('oneTimeCustMsgDiv', responseText);
									//added against 21739
									oneTimeCustomerAdded=true;
								}
							});
						}
					} else
						return false;
				}
				$('input[name = "organizationName"]').attr('title',$('#customerName').val());
				$('input[name = "address"]').attr('title',$('input[name = "addressLine1"]').val()+','+
						$('input[name = "addressLine2"]').val()+','+
						$('input[name = "addressLine3"]').val());
			}
		},
		{
			text : "Clear",
			click : function() {
				if(isOneTimerChanged=="")
				{
					var isChanged = false;
					var elements = $('#shipmentonetimecustomer :input');
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
				var queryString = $('#shipmentonetimecustomer').formSerialize();
                                
				if (validateDataAdmin() && $("#shipmentonetimecustomer").validationEngine('validate') && validateContactInfo(callingParty)) 
				{
					$.ajax({
						url : _context +"/shipment/onetimecust/sendToDataAdmin",
						type : "POST",
						data : queryString,
						success : function(responseText) {
							showResponseMessages('oneTimeCustMsgDiv', responseText);
						}
					});
				}
				else 
					return false;
			}
		} ]);
            
        $('#oneTimerTradeCodes').val(tradeCodeValue);
        $('#customerGroup').val(customerGroupText);
        if(callingParty != 'shipper' && callingParty != 'consignee') {
            $('#oneTimerTradeCodesDiv').attr("hidden", true);
        }
            
	isCustomerOverridden = false;
	var addressRoleId = '';
	if(callingParty=='shipper' && 
			$('input[name="shipper\\.isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="shipper\\.addressRoleId"]').val();
	else if(callingParty=='consignee' && 
			$('input[name="consignee\\.isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="consignee\\.addressRoleId"]').val();
	else if(callingParty=='party' && 
			$('input[name="isOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="addressRoleId"]').val();
	if(addressRoleId!='')
	{
		makeScreenFiledsReadOnly(true); /*Code Addition for defect -DD016962 */
		$.ajax({
			url : _context +"/shipment/onetimecust/getOneTimer",
			data : {addressRoleId:addressRoleId},
			success : function(responseText) {
				$("#shipmentonetimecustomer").loadJSON(responseText);
				$("#custContactId").val(responseText.contactId);
				$('#bkngNo').val($('#shipmentNumber').val());
				$('#otcSequenceNumber').val($('#shipmentSequenceNumber').val());
				$('#otcCorrectionNumber').val($('#shipmentCorrectionNumber').val());
				if($('#bkngNo').val()!='')
					$('input[name="dataAdminCode"]').attr("disabled", false);
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
				}else{
					//addition start for defect DDO17159
					$('#otCommunicationMethodCode:checked').attr("checked", true);
					$('#otCommunicationMethodCode:checked').val("P");
					//addition end for defect DDO17159
				}
				$("#oneTimeCustomerDialog").dialog('open');
			}
		});
	}
	else
		makeScreenFiledsReadOnly(false)	; /*Code Addition for defect -DD016962 */
		$('#bkngNo').val($('#shipmentNumber').val()); 							// For Defect
		$('#otcSequenceNumber').val($('#shipmentSequenceNumber').val()); 		// For Defect
		$('#otcCorrectionNumber').val($('#shipmentCorrectionNumber').val()); 	// For Defect
		$('#otcCaller').val(callingParty); // D018663
		$("#oneTimeCustomerDialog").dialog('open');
		
		if(callingParty=='shipper'|| callingParty=='consignee'){
			$('#otcPreferredMethodSpan').css('visibility','visible');
		}else{
			$('#otcPreferredMethodSpan').css('visibility','hidden');
		}
	
}

function oneTimeSuccessFunc(responseText, callingParty)
{
	if (callingParty == 'shipper') {
		$('select[name="shipper\\.contactId"]').children().remove();
		$('select[name="shipper\\.contactId"]').append("<option value='' label='Select'></option>");
		$.each(responseText.data.contactList,
		function(key, value) {
			$('select[name="shipper\\.contactId"]').append($("<option/>",
			{
				value : key,
				text : value
			}));
		});
		$("#shipper").loadJSON(responseText.data);
		setShipperCommMethodValue(responseText.data);
		enableDisableContactId('shipper',false);
		changeShipperConsigneeColor("shipper", "Y");
		$('form[id="parties"] input[name="shipper\\.address"]').attr("disabled",true);
		$('form[id="parties"] input[name="shipper\\.city"]').attr("disabled",true);
		$('form[id="parties"] input[name="shipper\\.state"]').attr("disabled",true);
		$('form[id="parties"] input[name="shipper\\.zip"]').attr("disabled",true);
		$('form[id="parties"] input[name="organizationName"]').attr("disabled",true);
		
		$('#shipperName').val(responseText.data.organizationName);
		shipperAddress = responseText.data.address;
		setAccordianTabDetails("shipperNameDiv", "Shipper - "+$('input[name="shipper\\.organizationName"]').val());
		if($('#tradeCode :selected').val()=='')
		{
			$('#tradeCode').val('F');
			$('#tradeCode').trigger('change');
			$('#tradeCode').trigger('blur');
		}
		if($('input[name="consignee\\.organizationName"]').val()=='')
			$('#copyShipper').attr("disabled", false);
		
		
		if($('#prepaidCollectCode').val()=='P'||$('#prepaidCollectCode').val()=='B'){
			addShipperAsDebtor();
		}
		
		//shipperOrgPredictive();
		//shipperAddressPredictive();
	} else if (callingParty == 'consignee') {
		$('select[name="consignee\\.contactId"]').children().remove();
		$('select[name="consignee\\.contactId"]').append("<option value='' label='Select'></option>");
		$.each(responseText.data.contactList,
		function(key, value) {
			$('select[name="consignee\\.contactId"]').append($("<option/>",
			{
				value : key,
				text : value
			}));
		});
		$("#consignee").loadJSON(responseText.data);
		setConsigneeCommMethodValue(responseText.data);
		enableDisableContactId('consignee',false);
		changeShipperConsigneeColor("consignee", "Y");
		$('form[id="parties"] input[name="consignee\\.address"]').attr("disabled",true);
		$('form[id="parties"] input[name="consignee\\.city"]').attr("disabled",true);
		$('form[id="parties"] input[name="consignee\\.state"]').attr("disabled",true);
		$('form[id="parties"] input[name="consignee\\.zip"]').attr("disabled",true);
		$('form[id="parties"] input[name="organizationName"]').attr("disabled",true);
		
		$('#consigneeName').val(responseText.data.organizationName);
		consigneeAddress = responseText.data.address;
		if($('#tradeCode :selected').val()=='')
		{
			$('#tradeCode').val('F');
			$('#tradeCode').trigger('change');
			$('#tradeCode').trigger('blur');
		}
		setAccordianTabDetails("consigneeNameDiv", "Consignee - "+$('input[name="consignee\\.organizationName"]').val());
		if($('input[name="shipper\\.organizationName"]').val()=='')
			$('#copyConsignee').attr("disabled", false);
		
		if($('#prepaidCollectCode').val()=='C'||$('#prepaidCollectCode').val()=='B'){
			addConsigneeAsDebtor();
		}
		//consigneeOrgPredictive();
		//consigneeAddPredictive();
	} else if (callingParty == 'party') {
		$('select[name="contactId"]').children().remove();
		$('select[name="contactId"]').append("<option value='' label='Select'></option>");
		/*$('select[name="contactId"]').append(
		"<option value=''></option>");*/
		$.each(responseText.data.contactList,
		function(key, value) {
			$('select[name="contactId"]').append($("<option/>",
			{
				value : key,
				text : value
			}));
		});
		$("#parties").loadJSON(responseText.data);
		//$('form[id="parties"] input[name = "contactEmailAddress"]').val(responseText.data.contactEmailAddress);
		setPartyCommMethodValue(responseText.data);
		$('form[id="parties"] input[name="address"]').attr("disabled",true);
		$('form[id="parties"] input[name="city"]').attr("disabled",true);
		$('form[id="parties"] input[name="state"]').attr("disabled",true);
		$('form[id="parties"] input[name="zip"]').attr("disabled",true);
		$('form[id="parties"] input[name="organizationName"]').attr("disabled",true);
		$('#partiesRepeatContact').attr("disabled",true);
		$('input[name="contact"]').val("");
		isPartyChanged = "Y";
		//partiesAddPredictive();
	}else if (callingParty == 'spotPull') {
		$("#dispatchLocationGridForm").loadJSON(responseText.data);
	}
	$("#oneTimeCustomerDialog").dialog("close");
}

function removeOneTimeCustomerPopUps() {
	$("#shipmentonetimecustomer").validationEngine('hideAll');
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

function validateContactInfo()
{
	var isValid = true;
	$('#contactFirstName').val($.trim($('#contactFirstName').val()));
	//alert($("#otCommunicationMethodCode:checked").val());
	if($('#oneTimeCity').val()=='')
	{
		$('#oneTimeCity').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		isValid = false;
	}
	if($('#contactFirstName').val()=='')
	{
		// D026028,Commented contact firstname in OneTimeCustomer shipper and consignee. 
		// Defect 25151
	/*	if($("#tradeCode").val()=="F"){
			isValid = true;
		}else{
		$('#contactFirstName').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		isValid = false;
	}*/
	}
	var caller= $('#otcCaller').val();
	if(caller=='shipper' || caller=='consignee' || $("#otcPreferredMethodSpan").css('visibility')=='visible'){ //D018663
		
	/* if($("#otCommunicationMethodCode:checked").val()==undefined || $("#otCommunicationMethodCode:checked").val()=="")
	{
		isValid = false;
		$("#otCommunicationMethodCode").validationEngine('showPrompt', 'Please select a preferred method.', 'error', true);
	}*/
	 if(!validatePhoneNo('customerPhone') || !validatePhoneNo('customerCell') || !validatePhoneNo('customerFax')){
		isValid = false;
	 }
	
	if($("#otCommunicationMethodCode:checked").val()=="P" && $("#oneTimeContactPhoneAreaCode").val()=="")
	{
		// Defect 25150
		if($("#tradeCode").val()=="F"){
			isValid = true;
		}else{
		isValid = false;
		$($('.otCommunicationMethodCode')[0]).validationEngine('showPrompt', 'Preferred communication (Phone) cannot be empty', 'error', true);
		$('#oneTimeContactPhoneAreaCode').validationEngine('showPrompt', 'Phone is required', 'error', 'topLeft', true);
	}
	}
	if($("#otCommunicationMethodCode:checked").val()=="C" && $("#oneTimeContactCellAreaCode").val()=="")
	{if($("#tradeCode").val()=="F"){
		isValid = true;
	}else{
		isValid = false;
		$("#oneTimeContactCellAreaCode").validationEngine('showPrompt', 'Preferred communication (Cell) cannot be empty', 'error', true);
	}
	}
	if($("#otCommunicationMethodCode:checked").val()=="F" && $("#oneTimeContactFaxAreaCode").val()=="")
	{if($("#tradeCode").val()=="F"){
		isValid = true;
	}else{
		isValid = false;
		$("#oneTimeContactFaxAreaCode").validationEngine('showPrompt', 'Preferred communication (Fax) cannot be empty', 'error', true);
	}
	}
	 if($("#otCommunicationMethodCode:checked").val()=="E" && $("#oneTimeContactEmailAddress").val()=="")
	{if($("#tradeCode").val()=="F"){
		isValid = true;
	}else{
		isValid = false;
		$("#oneTimeContactEmailAddress").validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
	}
	}
	 }
	return isValid;
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
			  return "Please select province from predictive list if country is CA";
		  }
		  /*if(provinceName.length == 0)
		  {
			  return "Province required if Country is not US";
		  }
		  else if(stateCode.length != 0)
		  {
			  return "State not required if Country is not US";
		  }*/
	  }
}

//This function is already present in clause.js
/*function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}*/

function openSearchOneTimerWindow()
{
	var url = '../cas/onetimeCustomerForBillSearch.do?source=Billing';

	window.open(url, "", "top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0");		// one  Argument Removed
}

function oneTimeCustUpdate(id)
{
	var data = id.split("|");
	clearOneTimeCustomerForm();
	//$('#bkngNo').val(data[7]); //commented 18663
	$('#customerId').val(data[19]);
	$('#custContactId').val(data[20]);
	$('#addressId').val(data[21]);
	$('#custAddressRoleId').val(data[22]);
	$('#contactFirstName').val(data[10]);
	$('#contactLastName').val(data[11]);
	$('#customerName').val(data[0]);
	$('#customerAbbr').val(data[1]);
	$('#customerNameQualifier').val(data[12]);
	$('#addressLine1').val(data[2]);
	$('#suite').val(data[13]);
	
	if(data[8]!=null && data[8]!='null'){
		$('#addressLine2').val(data[8]);
	}
	
	$('#addressLine3').val(data[9]);
	$('#oneTimeCity').val(data[3]);
	$('#oneTimeState').val(data[4]);
	$('#oneTimeZip').val(data[5]);
	$('#oneTimeProvince').val(data[14]);
	$('#oneTimeCountry').val(data[15]);
	$('#oneTimeContactEmailAddress').val(data[18]);
	$('#oneTimeContactEmailAddress').attr('title',$('#oneTimeContactEmailAddress').val());
	$('input[name="dataAdminCode"]').attr("disabled", false);
	
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
	isOneTimerChanged = "Y";
	isCustomerOverridden = false;
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
	//$("#shipmentonetimecustomer").clearForm();  // commented for 18663
	clearContactInfo(); // added for 18663
	clearHiddenFields();
	$('#existingOrganization').attr("disabled", true);
	$("#oneTimeCustomerDialog input[type=text]").val("");
	//$('input[name="dataAdminCode"]').attr("disabled", true);
	$('#existingAddressLine1').attr("disabled", true);
	//$('#otCommunicationMethodCode').attr("checked", true);
	//$('#otCommunicationMethodCode').val("P"); //addition start for defect DDO17159
	$('#oneTimeCustMsgDiv').html('');
	$('#oneTimeCity').val(''); //addition start for defect DDO17061
	$('#oneTimeState').val(''); //addition start for defect DDO17061
	$('#oneTimeZip').val(''); //addition start for defect DDO17061
	isCustomerOverridden = false;
}

function clearHiddenFields()
{
	makeScreenFiledsReadOnly(false); //addition start for defect DDO16968
	$('#customerId').val('');
	$('#custContactId').val('');
	$('#custAddressRoleId').val('');
	$('#addressId').val('');
	$('#customerAbbr').val('');
	$('#replaceAddressRoleId').val("");
        $('#customerGroup').val("");

	//$('#bkngNo').val("");
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
		changeShipperConsigneeColor(field, "Y");
		$('input[name="'+field+'\\.address"]').attr("disabled",true);
		$('input[name="'+field+'\\.city"]').attr("disabled",true);
		$('input[name="'+field+'\\.state"]').attr("disabled",true);
		$('input[name="'+field+'\\.zip"]').attr("disabled",true);
		checkOneTimerCustomer(field);
	}
	else
	{
		//added for security
		changeShipperConsigneeColor(field, "N");
		var isModifiable=false;
		if(field=='shipper' || field=='consignee'){
			isModifiable=isShipperConsigneeModifiable;
		}else if(field=='parties'){
			isModifiable=isPartiesModifiable;
		}
		//added for security end
		$('input[name="'+field+'\\.address"]').attr("disabled",isModifiable?false:true);
		$('input[name="'+field+'\\.city"]').attr("disabled",isModifiable?false:true);
		$('input[name="'+field+'\\.state"]').attr("disabled",isModifiable?false:true);
		$('input[name="'+field+'\\.zip"]').attr("disabled",isModifiable?false:true);
		checkOneTimerCustomer(field);
	}
}

function trimValue(field, rules, i, options)
{
	if(field.val()!='')
	{
		field.val($.trim(field.val()));
		var value  = field.val();
		if(value=='')
			return "* This field is required";
	}
}

function populateOneTimeContactPhoneCountryCode(){
	var queryString = $('#shipmentonetimecustomer')
	.formSerialize();
		$.ajax({
			url : _context +"/shipment/onetimecust/phoneCountryCode",
			type : "POST",
			data : queryString,
			success : function(	responseText) {
				if(responseText.data !=null){
					if($('#oneTimeContactPhoneCountryCode').val()==''){
						$('#oneTimeContactPhoneCountryCode').val(responseText.data);
					}
				}
			}
		});	
	}

/*Code Addition Start for defect -DD016962 */
function makeScreenFiledsReadOnly(trueFalse){
/*	$('#customerNameQualifier').attr('readonly',trueFalse);
	$('#customerName').attr('readonly',trueFalse);
	$('#addressLine1').attr('readonly',trueFalse);
	$('#addressLine2').attr('readonly',trueFalse);
	$('#addressLine3').attr('readonly',trueFalse);
	$('#oneTimeCity').attr('readonly',trueFalse);
	$('#oneTimeState').attr('readonly',trueFalse);
	$('#oneTimeZip').attr('readonly',trueFalse);
	$('#oneTimeProvince').attr('readonly',trueFalse);
	$('#oneTimeCountry').attr('readonly',trueFalse);*/
}
/*Code Addition end for defect -DD016962 */
//Code Addition Start for defect -D018433

function trimOnetimeContactOnChange(){
	$("#oneTimeContactEmailAddress").change(function() {
		$("#oneTimeContactEmailAddress").val($.trim($("#oneTimeContactEmailAddress").val()));
	});
	$("#oneTimeContactEmailAddress").change(function() {
		$("#oneTimeContactEmailAddress").val($.trim($("#oneTimeContactEmailAddress").val()));
	});
	$("#oneTimeContactFaxCountryCode").change(function() {
		$("#oneTimeContactFaxCountryCode").val($.trim($("#oneTimeContactFaxCountryCode").val()));
	});
	$("#oneTimeContactFaxAreaCode").change(function() {
		$("#oneTimeContactFaxAreaCode").val($.trim($("#oneTimeContactFaxAreaCode").val()));
	});
	$("#oneTimeContactFaxExchange").change(function() {
		$("#oneTimeContactFaxExchange").val($.trim($("#oneTimeContactFaxExchange").val()));
	});
	$("#oneTimeContactFaxStation").change(function() {		
		$("#oneTimeContactFaxStation").val($.trim($("#oneTimeContactFaxStation").val()));
	});
	$("#oneTimeContactFaxExtension").change(function() {
		$("#oneTimeContactFaxExtension").val($.trim($("#oneTimeContactFaxExtension").val()));
	});
	$("#oneTimeContactCellCountryCode").change(function() {
		$("#oneTimeContactCellCountryCode").val($.trim($("#oneTimeContactCellCountryCode").val()));
	});
	$("#oneTimeContactCellAreaCode").change(function() {
		$("#oneTimeContactCellAreaCode").val($.trim($("#oneTimeContactCellAreaCode").val()));
	});
	$("#oneTimeContactCellExchange").change(function() {
		$("#oneTimeContactCellExchange").val($.trim($("#oneTimeContactCellExchange").val()));
	});
	$("#oneTimeContactCellStation").change(function() {
		$("#oneTimeContactCellStation").val($.trim($("#oneTimeContactCellStation").val()));
	});
	$("#oneTimeContactCellExtension").change(function() {
		$("#oneTimeContactCellExtension").val($.trim($("#oneTimeContactCellExtension").val()));
	});
	$("#oneTimeContactPhoneAreaCode").change(function() {
		$("#oneTimeContactPhoneAreaCode").val($.trim($("#oneTimeContactPhoneAreaCode").val()));
	});
	$("#oneTimeContactPhoneExchange").change(function() {
		$("#oneTimeContactPhoneExchange").val($.trim($("#oneTimeContactPhoneExchange").val()));
	});
	$("#oneTimeContactPhoneStation").change(function() {
		$("#oneTimeContactPhoneStation").val($.trim($("#oneTimeContactPhoneStation").val()));
	});
	$("#oneTimeContactPhoneCountryCode").change(function() {
		$("#oneTimeContactPhoneCountryCode").val($.trim($("#oneTimeContactPhoneCountryCode").val()));
	});
	$("#oneTimeContactPhoneExtension").change(function() {
		$("#oneTimeContactPhoneExtension").val($.trim($("#oneTimeContactPhoneExtension").val()));
	});
}

function clearContactInfo(){
	$('#custContactId').val('');
		
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
	
	$('input[name="communicationMethodCode"]').attr("checked", false);
	$('#otCommunicationMethodCode').attr("checked", false);
	
	
}
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

function oneTimeCountryPopupSearch() {
	removeOneTimeCustomerPopUps();	
	var oneTimeCountry = $('#oneTimeCountry').val();	
	var	actionUrl = _context + '/cas/countryNameLookup.do?filterValue1='+oneTimeCountry+'|';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
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

function countryCodeUpdate(id){
	var values = id.split("|");
	$('#oneTimeCountry').val(values[0]);
}
/*
 * code commented as it is not mentioned in
 * ui spec and approved wireframe's 
 * but code is working just need a unit testing
 * 29/08/2013
 * --puneet hasija
 */
/*function oneTimeOkFunc(callingParty)
{
	if(callingParty=='spotPull')
	{
		$.ajax({
			url : _context +"/shipment/onetimecust/getOneTimerForSpotPull",
			data:{addressRoleId:$('#custAddressRoleId').val()},
			success : function(responseText) {
				if(responseText.success)
				{
					$("#dispatchLocationGridForm").loadJSON(responseText.data);
					$("#oneTimeCustomerDialog").dialog("close");
				}
				else
					showResponseMessagesSpot('oneTimeCustMsgDiv', responseText);
			}
		});
	}
	else
	{
		$.ajax({
			url : _context +"/shipment/onetimecust/getOneTimerForBilling",
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
						setAccordianTabDetails("shipperNameDiv", "Shipper - "+responseText.data.organizationName);
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
						setAccordianTabDetails("consigneeNameDiv", "Consignee - "+responseText.data.organizationName);
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
}*/

function autoTabOneTime(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
    //Get a reference to the two elements in the tab sequence.
    var CurrentElement = $('#' + CurrentElementID);
    var NextElement = $('#' + NextElementID);
   
    
    CurrentElement.keydown(function(e) {
        //Retrieve which key was pressed.
    	var thisElement=this;
    	setTimeout(function(){
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence. 
        var phoneCountryCode="oneTimeContactPhoneCountryCode";
        var cellCountryCode="oneTimeContactCellCountryCode";
        var faxCountryCode="oneTimeContactFaxCountryCode";
        
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
			if (((CurrentElement.val().length == FieldLength && isAmericanOneTime(CountryCodeID)) || 
					(CurrentElement.val().length == 4))
							&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105)) && !isTextSelected(thisElement))
				{	
				//confirm("testing isAm"+isAmericanOneTime(CountryCodeID)+" value "+$('#oneTimeContactPhoneCountryCode').val()+" ends //")
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
//Code Addition end for defect -D018433
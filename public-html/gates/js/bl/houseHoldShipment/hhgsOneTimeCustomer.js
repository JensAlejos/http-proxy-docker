var isOneTimerChanged = "";
var provinces = "";	
$(function() {
	
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
		},
		close : function()
		{
			removeOneTimeCustomerPopUps();
			$("#shipmentonetimecustomer").validationEngine('detach');
			clearOneTimeCustomerForm();
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

	$('#customerName').blur(function()
	{
		if($.trim($('#customerName').val())=='' && $('#customerId').val()!='')
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
			$('#dataAdminCode').attr("disabled", false);
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
			customerAddressPopupSearch();
		}
	});
	
	$('.trimmedField').change(function()
	{
		$(this).val($.trim($(this).val()));
	});
	
	
	var url = _context +'/organization/address/autoComplete' ; 
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
		if($('#countryName').val() != null && new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
	});
	$('#oneTimeProvince').change(function(){
		if($('#countryName').val() != null && new String($('#oneTimeCountry').val().toLowerCase())!="ca" && new String($('#oneTimeCountry').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
	});
	
	
	////Auto tab on phone fields
	
	autoTabOneTimeHHGS('oneTimeContactPhoneCountryCode','oneTimeContactPhoneAreaCode', 1,'oneTimeContactPhoneCountryCode');
	autoTabOneTimeHHGS('oneTimeContactPhoneAreaCode','oneTimeContactPhoneExchange', 3,'oneTimeContactPhoneCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactPhoneExchange','oneTimeContactPhoneStation', 3,'oneTimeContactPhoneCountryCode');
	autoTabOneTimeHHGS('oneTimeContactPhoneStation','oneTimeContactPhoneExtension', 4,'oneTimeContactPhoneCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactPhoneExtension','oneTimeContactCellCountryCode', 4,'oneTimeContactPhoneCountryCode');
	 
	autoTabOneTimeHHGS('oneTimeContactCellCountryCode','oneTimeContactCellAreaCode', 1,'oneTimeContactCellCountryCode');
	autoTabOneTimeHHGS('oneTimeContactCellAreaCode','oneTimeContactCellExchange', 3,'oneTimeContactCellCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactCellExchange','oneTimeContactCellStation', 3,'oneTimeContactCellCountryCode');
	autoTabOneTimeHHGS('oneTimeContactCellStation','oneTimeContactCellExtension', 4,'oneTimeContactCellCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactCellExtension','oneTimeContactFaxCountryCode', 4,'oneTimeContactCellCountryCode');
	 
	autoTabOneTimeHHGS('oneTimeContactFaxCountryCode','oneTimeContactFaxAreaCode', 1,'oneTimeContactFaxCountryCode');
	autoTabOneTimeHHGS('oneTimeContactFaxAreaCode','oneTimeContactFaxExchange', 3,'oneTimeContactFaxCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactFaxExchange','oneTimeContactFaxStation', 3,'oneTimeContactFaxCountryCode');
	autoTabOneTimeHHGS('oneTimeContactFaxStation','oneTimeContactFaxExtension', 4,'oneTimeContactFaxCountryCode');	
	autoTabOneTimeHHGS('oneTimeContactFaxExtension','oneTimeContactEmailAddress', 4,'oneTimeContactFaxCountryCode');
	
	
	 
});

function openOneTimeCustomer(callingParty) {
	clearOneTimeCustomerForm(); //addition start for defect DDO17061
	$("#oneTimeCustomerDialog").dialog("option", "title", 'One Timer Customer');
	$("#oneTimeCustomerDialog").dialog("option", "buttons",
			
		[{
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
					if ($("#shipmentonetimecustomer").validationEngine('validate') 
							& validateContactInfo()) {
						var queryString = $('#shipmentonetimecustomer')
								.formSerialize();
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
							}
						});
					} else
						return false;
					
				}
			}
		}, {
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
				if (validateDataAdmin()) 
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
	else if(callingParty=='commodityCustomer'  &&
			$('input[name="shipmentBillToIsOneTimeCustomer"]').val()=='true')
		addressRoleId = $('input[name="shipmentAddressRoleId"]').val();
	
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
		$("#oneTimeCustomerDialog").dialog('open');
}

function oneTimeSuccessFunc(responseText, callingParty)
{
	if (callingParty == 'shipper') {
		$('select[name="shipper\\.contactId"]').children().remove();
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
		$('input[name="shipper\\.address"]').attr("disabled",true);
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
		//addShipperAsDebtor(); HHGS
		//shipperOrgPredictive();
		//shipperAddressPredictive();
	} else if (callingParty == 'consignee') {
		$('select[name="consignee\\.contactId"]').children().remove();
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
		$('input[name="consignee\\.address"]').attr("disabled",true);
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
		//addConsigneeAsDebtor();  HHGDS
		//consigneeOrgPredictive();
		//consigneeAddPredictive();
	} else if (callingParty == 'party') {
		$('select[name="contactId"]').children().remove();
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
		setPartyCommMethodValue(responseText.data);
		isPartyChanged = "Y";
		//partiesAddPredictive();
	}else if (callingParty == 'spotPull') {
		$("#dispatchLocationGridForm").loadJSON(responseText.data);
	}else if(callingParty == 'commodityCustomer'){
		
		//dynamically making another input because we can't unbind the image form actual input field
		$('#billToDiv').html('<label class="span-3 label">Bill To<span class="mandatory">*</span></label>'+
		'<input id="shipmentAddressRoleName" name="shipmentAddressRoleName" class="validate[required] ui-autocomplete-input" type="text" value="" size="20" maxlength="50" autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">');
		
		$('input[name="shipmentAddressRoleName"]').gatesAutocomplete(
				{
					source:_context+'/cas/autocomplete.do',
				 	extraParams: {
		 		 		 method: 'searchOrg',
		 		 		 searchType: '229',
		 		 		parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
				 	},
					//source : urlShipperOrg,
					formatItem : function(data) {
						$('input[name="shipmentBillToOrganizationId"]').val("");
						return data.name + "-" + data.abbr;
					},
					formatResult : function(data) {
						return data.abbr + "-" + data.name;
					},
					select : function(data) {
						$('input[name="shipmentAddressRoleName"]').val(data.abbr + "-" + data.name);
						$('#shipmentBillToName').val($('input[name="shipmentAddressRoleName"]').val());
						$('input[name="shipmentBillToOrganizationCode"]').val(data.abbr);
						$('input[name="shipmentBillToOrganizationId"]').val(data.id);

						shipperId = data.id;
						$('#shipmentAddressLine1').text("");
						$('#shipmentAddressLine2').text("");
						$("#shipperAddressRoleName").val("");

						
						$('input[name="shipmentBillToIsOneTimeCustomer"]').val("false");
						//shipperAddressPredictive();
						shipperHHGSAddressPopupSearch();
						$('input[name="shipmentAddressRoleName"]').gatesPopUpSearch({
							
							func : function() {
								//shipperPopupSearch();
								shipperHHGSAddressPopupSearch();
							}
						});
						
					}
				});
		
		
		$('input[name="shipmentAddressRoleName"]').val(responseText.data.organizationName);
		$('#shipmentBillToName').val($('input[name="shipmentAddressRoleName"]').val());
		$('input[name="shipmentBillToOrganizationId"]').val(responseText.data.organizationId);
		$('#shipmentCityStateZip').text(responseText.data.city+" "+responseText.data.state+" "+responseText.data.zip);
		
		
		$('#shipmentAddressLine1').text(responseText.data.address);
		
		$('input[name="shipmentAddressRoleId"]').val(responseText.data.addressRoleId);
		$('input[name="shipmentBillToIsOneTimeCustomer"]').val(true);
		
	}
	$("#oneTimeCustomerDialog").dialog("close");
}

function removeOneTimeCustomerPopUps() {
	$("#shipmentonetimecustomer").validationEngine('hideAll');
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
		$('#contactFirstName').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		isValid = false;
	}
	 if($("#otCommunicationMethodCode:checked").val()==undefined || $("#otCommunicationMethodCode:checked").val()=="")
	{
		isValid = false;
		$("#otCommunicationMethodCode").validationEngine('showPrompt', 'Please select a preferred method.', 'error', true);
	}
	 if(!validatePhoneNo('customerPhone') || !validatePhoneNo('customerCell') || !validatePhoneNo('customerFax')){
		isValid = false;
	 }
	
	if($("#otCommunicationMethodCode:checked").val()=="P" && $("#oneTimeContactPhoneAreaCode").val()=="")
	{
		isValid = false;
		$("#oneTimeContactPhoneAreaCode").validationEngine('showPrompt', 'Preferred communication (Phone) cannot be empty', 'error', true);
	}
	if($("#otCommunicationMethodCode:checked").val()=="C" && $("#oneTimeContactCellAreaCode").val()=="")
	{
		isValid = false;
		$("#oneTimeContactCellAreaCode").validationEngine('showPrompt', 'Preferred communication (Cell) cannot be empty', 'error', true);
	}
	if($("#otCommunicationMethodCode:checked").val()=="F" && $("#oneTimeContactFaxAreaCode").val()=="")
	{
		isValid = false;
		$("#oneTimeContactFaxAreaCode").validationEngine('showPrompt', 'Preferred communication (Fax) cannot be empty', 'error', true);
	}
	 if($("#otCommunicationMethodCode:checked").val()=="E" && $("#oneTimeContactEmailAddress").val()=="")
	{
		isValid = false;
		$("#oneTimeContactEmailAddress").validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
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
		 /* if(provinceName.length == 0)
		  {
			  return "Province is required if Country is CA";
		  }*/
		  if(stateCode.length == 0)
		  {
			  return "State required if country is CA";
		  }
		  if(provinces == "" && (stateCode == "" || provinceName == "")){
			  return "Please select province from predictive list if country is CA";
		  }
	  }
	 /* else
	  {
		  if(provinceName.length == 0)
		  {
			  return "Province required if Country is not US";
		  }
		  else if(stateCode.length != 0)
		  {
			  return "State not required if Country is not US";
		  }
	  }*/
}

//This function is already present in clause.js
/*function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}*/

function openSearchOneTimerWindow()
{
	var url = '../cas/onetimeCustomerForBillSearch.do?source=Billing';
	window.open(url, "One time Customer Search", "top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0");
}

function oneTimeCustUpdate(id)
{
	var data = id.split("|");
	clearOneTimeCustomerForm();
	
	$('#bkngNo').val(data[7]);
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
}

function customerAddressPopupSearch()
{
	orgCaller = 'dataAdmin';
	var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
			+ $('#customerId').val() + '&filterValue2=02';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'AddressSearch', windowStyle);
}

function clearOneTimeCustomerForm()
{
	$("#shipmentonetimecustomer").clearForm();
	clearHiddenFields();
	$('input[name="dataAdminCode"]').attr("disabled", true);
	$('#existingAddressLine1').attr("disabled", true);
	$('#otCommunicationMethodCode').attr("checked", true);
	$('#otCommunicationMethodCode').val("P"); //addition start for defect DDO17159
	$('#oneTimeCustMsgDiv').html('');
	$('#oneTimeCity').val(''); //addition start for defect DDO17061
	$('#oneTimeState').val(''); //addition start for defect DDO17061
	$('#oneTimeZip').val(''); //addition start for defect DDO17061
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
	$('#bkngNo').val("");
}

function validateDataAdmin()
{
	var isValid = true;
	
	if($('input[name="dataAdminCode"]').attr("disabled"))
	{
		isValid = false;
		$("#dataAdminCode").validationEngine('showPrompt', 'Please enter mandatory information', 'error', true);
	}
	else if($("#dataAdminCode:checked").val()==undefined)
	{
		isValid = false;
		$("#dataAdminCode").validationEngine('showPrompt', 'Please select a Data Admin Mode.', 'error', true);
	}
	else if($("#dataAdminCode:checked").val()=="A")
	{
		/*if($("#custContactId").val()=="")
		{
			isValid = false;
			$("#contactFirstName").validationEngine('showPrompt', 'Please select an existing Contact', 'error', true);
		}
		else */if($('#customerName').val()=='')
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
		/*else if(!validateContactInfo())
			isValid = false;*/
	}
	else if($("#dataAdminCode:checked").val()=="B")
	{
		if($("#customerId").val()=="")
		{
			isValid = false;
			$("#customerName").validationEngine('showPrompt', 'Please select an existing Organization', 'error', true);
		}
		else if(!$("#shipmentonetimecustomer").validationEngine('validate'))
			isValid = false;
	}
	else if($("#dataAdminCode:checked").val()=="C")
	{
		if($("#replaceAddressRoleId").val()=="")
		{
			isValid = false;
			$("#existingAddressLine1").validationEngine('showPrompt', 'Please select an existing Address', 'error', true);
		}
		else if(!$("#shipmentonetimecustomer").validationEngine('validate'))
			isValid = false;
	}
	
	return isValid;
}

function enableAddressSearch(radioObj)
{
	if($(radioObj).val()=="A")
	{
		$('#existingAddressLine1').val("");
		$('#existingAddressLine1').attr("disabled", true);
		if($('#customerName').val()=='')
		{
			alert("Please select a new or existing one time organization first");
			$(radioObj).attr("checked", false);
		}
	}
	else if($(radioObj).val()=="B")
	{
		$('#existingAddressLine1').val("");
		$('#existingAddressLine1').attr("disabled", true);
		if($('#customerId').val()=='')
		{
			alert("Please select existing one time organization first");
			$(radioObj).attr("checked", false);
		}
	}
	else if($(radioObj).val()=="C")
	{
		if($('#customerId').val()=='')
		{
			alert("Please select existing one time organization first");
			$(radioObj).attr("checked", false);
		}
		else
		{
			$('#existingAddressLine1').attr("disabled", false);
			$('#existingAddressLine1').attr("readonly", true);
		}
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
		//$('input[name="'+field+'\\.address"]').attr("disabled",true);
	}
	else
	{
		changeShipperConsigneeColor(field, "N");
		//$('input[name="'+field+'\\.address"]').attr("disabled",false);
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
				alert("in success");
				alert("responseText.data="+responseText.data);
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
//Code Addition end for defect -D018433


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

function isAmericanOneTimeHHGS(id)
{
	var val = $('#'+id).val();
	//confirm("inside isAmericanO "+val);
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

function autoTabOneTimeHHGS(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
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
			if (((CurrentElement.val().length == FieldLength && isAmericanOneTimeHHGS(CountryCodeID)) || 
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


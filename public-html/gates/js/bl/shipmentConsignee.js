var consigneeAddress = "";

$(function() {

	$('#shipmentForm').validationEngine('attach');
	//commented for defect #D021764
	/*$('#consigneeComm1').attr('checked',true);
	$('#consigneeComm1').val('P');*/

	//enableDisableContactId('consignee',true);

	$('input[name="consignee\\.city"]').attr("readonly", true);
	$('input[name="consignee\\.state"]').attr("readonly", true);
	$('input[name="consignee\\.zip"]').attr("readonly", true);
	$("#copyConsignee").attr("disabled", true);
	
	consigneeOrgPredictive();
	consigneeAddPredictive();

	// consignee Pop-Up Search
	$('input[name="consignee\\.organizationName"]').gatesPopUpSearch({
		func : function() {
			consigneePopupSearch();
			/*if($('input[name="consignee\\.isOneTimeCustomer"]').val()==false || $('input[name="consignee\\.isOneTimeCustomer"]').val()=='false'){ // for defect D019012 
			consigneeAddressPopupSearch();
			}*/
		}
	});

	// consignee address Pop-Up Search
	$('input[name="consignee\\.address"]').gatesPopUpSearch({
		func : function() {
			if($('input[name="consignee\\.isOneTimeCustomer"]').val()==false || $('input[name="consignee\\.isOneTimeCustomer"]').val()=='false'){ // for defect D019012 
				consigneeAddressPopupSearch();
				}
		}
	});

	// Clear consignee details on change of consignee
	$('input[name="consignee\\.organizationName"]').change(
			function() {
				if ($('input[name="consignee\\.organizationName"]').val()=='' 
					|| $('input[name="consignee\\.organizationName"]').val() != $('#consigneeName').val()) {
					
					setConsigneeDivName("");
					if($('input[name="shipper\\.organizationName"]').val()!=''){
						$("#copyShipper").attr("disabled", false);
					}
					emptyCityStateZip("consignee");
					emptyContactDetails("consignee");
					$("#copyConsignee").attr("disabled", true);
					$('input[name="consignee\\.organizationId"]').val("");
					$('input[name="consignee\\.organizationCode"]').val('');
					$('input[name="consignee\\.organizationName"]').val('');
					//$('input[name="consignee\\.addressRoleId"]').val("");
					$('input[name="consignee\\.isOneTimeCustomer"]').val("false");
					//removeConsigneeAsDebtor();
					//resetTrade();
					enableDisableContactId('consignee', true);
					//consigneeAddPredictive();
				}
				
				$('input[name="consignee\\.address"]').val("");
				processShipperConsigneeColor("consignee");
				$('input[name="consignee\\.address"]').trigger('change');
	});

	$('input[name="consignee\\.address"]').change(function() {
		if(consigneeAddress!=$('input[name="consignee\\.address"]').val())
		{
			$('input[name="consignee\\.address"]').val('');
			consigneeAddress = '';
			emptyCityStateZip("consignee");
			emptyContactDetails("consignee");
			$("#copyConsignee").attr("disabled", true);
			processShipperConsigneeColor("consignee");
			$('input[name="consignee\\.addressRoleId"]').val("");
			removeConsigneeAsDebtor();
		}
		
		if($('input[name="shipper\\.organizationName"]').val()!='' 
			&& $('input[name="consignee\\.organizationName"]').val()==''){
			$("#copyShipper").attr("disabled", false);
		}
	});

	// get contact details for selected contact id[commented for merge.]
	$('select[name="consignee\\.contactId"]').change(function() {
	/*	if($('select[name="consignee\\.contactId"]').val()!=null && 
				$('select[name="consignee\\.contactId"]').val()!=''){*/
			requestForContactDetails("consignee", "N");
			$('#isChangeAcceptedAfterUnitsReceived').val("N");
		/*}*/
	});

	/**
	 * Copy Consignee to Shipper 
	 * */
	$('#copyConsignee').click(function() {
		if ($('input[name="consignee\\.organizationName"]').val() != '' && $('input[name="shipper\\.organizationName"]').val() == '') {
			$('input[name="shipper\\.organizationName"]').val($('input[name="consignee\\.organizationName"]').val());
			$('#shipperName').val($('input[name="consignee\\.organizationName"]').val());
			$('input[name="shipper\\.address"]').val($('input[name="consignee\\.address"]').val());
			shipperAddress = $('input[name="consignee\\.address"]').val();
			$('input[name="shipper\\.careOf"]').val($('input[name="consignee\\.careOf"]').val());
			$('input[name="shipper\\.city"]').val($('input[name="consignee\\.city"]').val());
			$('input[name="shipper\\.state"]').val($('input[name="consignee\\.state"]').val());
			$('input[name="shipper\\.zip"]').val($('input[name="consignee\\.zip"]').val());

			$('select[name="shipper\\.contactId"]').html($('select[name="consignee\\.contactId"]').html());

			$('select[name="shipper\\.contactId"]').selected().val($('select[name="consignee\\.contactId"]').selected().val());

			$('input[name="shipper\\.contact"]').val($('input[name="consignee\\.contact"]').val());
			$('input[name="shipper\\.contactPhoneCountryCode"]').val($('input[name="consignee\\.contactPhoneCountryCode"]').val());
			$('input[name="shipper\\.contactPhoneAreaCode"]').val($('input[name="consignee\\.contactPhoneAreaCode"]').val());
			$('input[name="shipper\\.contactPhoneExchange"]').val($('input[name="consignee\\.contactPhoneExchange"]').val());
			$('input[name="shipper\\.contactPhoneStation"]').val($('input[name="consignee\\.contactPhoneStation"]').val());

			$('input[name="shipper\\.contactCellCountryCode"]').val($('input[name="consignee\\.contactCellCountryCode"]').val());
			$('input[name="shipper\\.contactCellAreaCode"]').val($('input[name="consignee\\.contactCellAreaCode"]').val());
			$('input[name="shipper\\.contactCellExchange"]').val($('input[name="consignee\\.contactCellExchange"]').val());
			$('input[name="shipper\\.contactCellStation"]').val($('input[name="consignee\\.contactCellStation"]').val());

			$('input[name="shipper\\.contactFaxCountryCode"]').val($('input[name="consignee\\.contactFaxCountryCode"]').val());
			$('input[name="shipper\\.contactFaxAreaCode"]').val($('input[name="consignee\\.contactFaxAreaCode"]').val());
			$('input[name="shipper\\.contactFaxExchange"]').val($('input[name="consignee\\.contactFaxExchange"]').val());
			$('input[name="shipper\\.contactFaxStation"]').val($('input[name="consignee\\.contactFaxStation"]').val());

			$('input[name="shipper\\.contactEmailAddress"]').val($('input[name="consignee\\.contactEmailAddress"]').val());
			$("#copyConsignee").attr("disabled", true);
			
			//copy the internal ID's
			$('input[name="shipper\\.addressRoleId"]').val($('input[name="consignee\\.addressRoleId"]').val());
			$('input[name="shipper\\.organizationId"]').val($('input[name="consignee\\.organizationId"]').val());
			$('input[name="shipper\\.isOneTimeCustomer"]').val($('input[name="consignee\\.isOneTimeCustomer"]').val());
			$('input[name="shipper\\.organizationCode').val($('input[name="consignee\\.organizationCode').val());
			
			processShipperConsigneeColor("shipper");

			var preMethod = getPrefCommMethod('consignee');
			if(preMethod=='P'){
				$('#shipperComm1').attr('checked',true);
				$('#shipperComm1').val(preMethod);
			}else if(preMethod=='C'){
				$('#shipperComm2').attr('checked',true);
				$('#shipperComm2').val(preMethod);
			}else if(preMethod=='F'){
				$('#shipperComm3').attr('checked',true);
				$('#shipperComm3').val(preMethod);
			}else if(preMethod=='E'){
				$('#shipperComm4').attr('checked',true);
				$('#shipperComm4').val(preMethod);
			}
			enableDisableContactId('shipper',false);
			
			setShipperDivName(" " + $('input[name="consignee\\.organizationName"]').val());
			$('#refNumOverRideForShipper').val("N");
			
			if($('#prepaidCollectCode').val()=='P'||$('#prepaidCollectCode').val()=='B'){
				addShipperAsDebtor();
			}
			//shipperOrgPredictive();
			//shipperAddressPredictive();
		}
	});

	$('#consigneeRepeatContact').click(function(){
		if($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED'){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		var contact= $('input[name="consignee\\.contact"]').val();
		if(($('select[name="consignee\\.contactId"]').selected().val()!='') || ((contact!=null) && ($.trim(contact).length !=0)) )
		{
			repeatCaller ="consignee";
			
			$('#originalOrgName').val($('input[name="consignee\\.organizationName"]').val());
			$('#originalOrgAddress').val($('input[name="consignee\\.address"]').val() /* Defect 17655  +" - "+ $('input[name="consignee\\.city"]').val() +" , "+ $('input[name="consignee\\.state"]').val()*/);
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$('#repeatContactShipmentSeqNo').val($('#shipmentSequenceNumber').val());
			$('#repeatContactShipmentCorrNo').val($('#shipmentCorrectionNumber').val());			
			$("#repeatContactOriginalAroleId").val($('input[name="consignee\\.addressRoleId"]').val());
			//$("#repeatContactNameLabel").html($("select[name='consignee\\.contactId'] option:selected").text());
			$("#repeatContactNameLabel").html($('input[name="consignee\\.contact"]').val());
			$("#repeatContactName").val($('input[name="consignee\\.contact"]').val());
			$("#repeatContactId").html($('select[name="consignee\\.contactId"]').html());
			$("#repeatContactId").selected().val($('select[name="consignee\\.contactId"]').selected().val());
			$('#repeatTrade').val($('#tradeCode').val());
			$('#repeatCaller').val(repeatCaller);
			$('#repeatCallerPartyType').val("03");	
			
			$('#repeatCustomerGroupId').val($('#customerGroupId').val());
			$('#repeatPortOfLoad').val($('#originPortCityCode').val());
			$('#repeatPortOfDischarge').val($('#destinationPortCityCode').val());
		
			var p1 =  $('input[name="consignee\\.contactPhoneCountryCode"]').val();
			var p2 =  $('input[name="consignee\\.contactPhoneAreaCode"]').val();
			var p3 =  $('input[name="consignee\\.contactPhoneExchange"]').val();
			var p4 =  $('input[name="consignee\\.contactPhoneStation"]').val();
			var p5 =  $('input[name="consignee\\.contactPhoneExtension"]').val();
					
			var Phonearray = [p1,p2,p3,p4,p5];			
			var Phone = Phonearray.join("-");
			
			
			var c1 =  $('input[name="consignee\\.contactCellCountryCode"]').val();
			var c2 =  $('input[name="consignee\\.contactCellAreaCode"]').val();
			var c3 =  $('input[name="consignee\\.contactCellExchange"]').val();
			var c4 =  $('input[name="consignee\\.contactCellStation"]').val();
			var c5 =  $('input[name="consignee\\.contactCellExtension"]').val();					
			
			var cellarray = [c1,c2,c3,c4,c5];
			var cell = cellarray.join("-");
			
			var f1 =  $('input[name="consignee\\.contactFaxCountryCode"]').val();
			var f2 =  $('input[name="consignee\\.contactFaxAreaCode"]').val();
			var f3 =  $('input[name="consignee\\.contactFaxExchange"]').val();
			var f4 =  $('input[name="consignee\\.contactFaxStation"]').val();
			var f5 =  $('input[name="consignee\\.contactFaxExtension"]').val();
			
			var faxarray = [f1,f2,f3,f4,f5];			
			var fax = faxarray.join("-");
			
			$("#repeatContactPhone").val(Phone);			
			$("#repeatContactCell").val(cell);
			$("#repeatContactFax").val(fax);			
			$("#repeatContactEmailAddress").val($('input[name="consignee\\.contactEmailAddress"]').val());			
			
			$("#repeatContactOverlay").dialog('open');
		}
		else
			alert("Please select a contact/contact Name first");
	});

	
	
	/*$('input[name="consignee\\.organizationName"]').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
	
	$("#consignee input").change(function() {
		if ($(this).is("#contactId") || $(this).is("#contactPhoneAreaCode") || 
				$(this).is("#contactPhoneExchange") || $(this).is("#contactPhoneStation")){
			$('#isChangeAcceptedAfterUnitsReceived').val("N");
		}
	});
	trimContactOnChange('consignee'); //D018433
	if(isShipperConsigneeModifiable==false){
		$("#consigneeRepeatContact").attr("disabled",true);
		$("#shipperRepeatContact").attr("disabled",true);
		$("#consigneeOneTimeCustDiv").attr("disabled",true);
		$("#shipperOneTimeCustDiv").attr("disabled",true);
	}
	
	
	
    autoTabConsignee('contactPhoneCountryCode','contactPhoneAreaCode', 1,'contactPhoneCountryCode');
    autoTabConsignee('contactPhoneAreaCode','contactPhoneExchange', 3,'contactPhoneCountryCode');
    autoTabConsignee('contactPhoneExchange','contactPhoneStation', 3,'contactPhoneCountryCode');
    autoTabConsignee('contactPhoneStation','contactPhoneExtension', 4,'contactPhoneCountryCode');
	
	
    autoTabConsignee('contactCellCountryCode','contactCellAreaCode', 1,'contactCellCountryCode');
    autoTabConsignee('contactCellAreaCode','contactCellExchange', 3,'contactCellCountryCode');
    autoTabConsignee('contactCellExchange','contactCellStation', 3,'contactCellCountryCode');
    autoTabConsignee('contactCellStation','contactCellExtension', 4,'contactCellCountryCode');
	
    autoTabConsignee('contactFaxCountryCode','contactFaxAreaCode', 1,'contactFaxCountryCode');
    autoTabConsignee('contactFaxAreaCode','contactFaxExchange', 3,'contactFaxCountryCode');
    autoTabConsignee('contactFaxExchange','contactFaxStation', 3,'contactFaxCountryCode');
    autoTabConsignee('contactFaxStation','contactFaxExtension', 4,'contactFaxCountryCode');
    
    

});

function consigneeOrgPredictive()
{
	//var urlConsigneeOrg = _context + '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();
	$('input[name="consignee\\.organizationName"]').gatesAutocomplete({
		//source : urlConsigneeOrg,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'searchOrg',
		 		 searchType: '229',
		 		 parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
	 	},
		formatItem : function(data) {
			$('input[name="consignee\\.organizationId"]').val("");
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.name + "-" + data.abbr;
		},
		select : function(data) {
			$('input[name="consignee\\.organizationName"]').val(
					data.name + "-" + data.abbr);
			$('#consigneeName').val(data.name);
			$('input[name="consignee\\.organizationId"]').val(data.id);
			$('input[name="consignee\\.isOneTimeCustomer"]').val(false);
			processShipperConsigneeColor("consignee");
			$('input[name="consignee\\.organizationCode"]').val(data.abbr);
			consigneeId = data.id;
			//populateTrade(data.trade);
			$('select[name="consignee\\.contactId"]').children().remove();
			$('select[name="consignee\\.contactId"]').append("<option value='' label='Select'></option>");
			$("#consigneeAddressRoleName").val("");
		
			if($('#shipperName').val()!=''){
				$("#copyShipper").attr("disabled", true);
			}
		
			$('input[name="consignee\\.address"]').val("");
			emptyCityStateZip("consignee");
			emptyContactDetails("consignee");
			//consigneeAddPredictive();
			
			singleConsAddressSelect();
			
			
			setSaveBillBeforeBillButton();
		}
	});
}

function singleConsAddressSelect(){
	// 032362: 	MAINTAIN BILING - CONSIGNEE PARTY - Allows adding AROL that is not All/Shipto type
	// type and trade were missing
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+$('input[name="consignee\\.organizationId"]').val()+'|03|'+$('#tradeCode').val(),						
		      
		success : function(responseText) {
		
			if(responseText.length == 1){
				handlePrepaidCollectIndicator('C');
				emptyContactDetails("consignee");
				emptyCityStateZip("consignee");
				
				var nameQualifier = responseText[0].nameQual;
				var city = responseText[0].city;
				var state = responseText[0].state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);
				consigneeAddress = finalAddress;
				emptyCityStateZip("consignee");
				$('input[name="consignee\\.addressRoleId"]').val(responseText[0].addRole);
				if(responseText[0].coOrgName!=null && responseText[0].coOrgName!='null'){
					$('input[name="consignee\\.careOf"]').val(responseText[0].coOrgName);
				}else{
				$('input[name="consignee\\.careOf"]').val("");
				}
				$('input[name="consignee\\.city"]').val(responseText[0].city);
				$('input[name="consignee\\.state"]').val(responseText[0].state);
				$('input[name="consignee\\.zip"]').val(responseText[0].zip);
				$('input[name="consignee\\.address"]').val(consigneeAddress);
				$("#shipperAddressRoleName").val($('input[name="consignee\\.address"]').val());
				$('#refNumOverRideForConsignee').val("N");
				//$('#isChangeAcceptedAfterUnitsReceived').val("N");
				
				if(responseText[0].cntry!=null && responseText[0].cntry!='null'){
					$('input[name="consignee\\.countryName"]').val(responseText[0].cntry);
				}else{
				$('input[name="consignee\\.countryName"]').val("");
				}
				if(responseText[0].provnc!=null && responseText[0].provnc!='null'){
					$('input[name="consignee\\.provinceName"]').val(responseText[0].provnc);
				}else{
				$('input[name="consignee\\.provinceName"]').val("");
				}
				
				processShipperConsigneeColor("consignee");
				checkAccordionHeaderForConsignee();
			
				requestForContactList("consignee");
				
				if($('#prepaidCollectCode').val()=='C'||$('#prepaidCollectCode').val()=='B'){
					addConsigneeAsDebtor();
				}
				removeShipmentErrorPointers();
				
				setSaveBillBeforeBillButton();
				
			} else {
			
				consigneeAddressPopupSearch();
		}
			
		}
	});
}

function consigneeAddPredictive()
{
	//var urlConsigneeAdd = _context + '/cas/autocomplete.do?method=searchAddRoleBK&searchType=234&parentSearch='+ $('input[name="consignee\\.organizationId"]').val() + '|03|'+$('#tradeCode').val();
	
	$('input[name="consignee\\.address"]').gatesAutocomplete(
	{
		//source : urlConsigneeAdd,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
		 		 method: 'searchAddRoleBK',
		 		 searchType: '234',
		 		 parentSearch:  function() { return $('input[name="consignee\\.organizationId"]').val() + '|03|'+$('#tradeCode').val(); }
	 	},
		formatItem : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
			return finalAddress;
		},
		formatResult : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
			return finalAddress;
		},
		select : function(data) {
			
			handlePrepaidCollectIndicator('C');
			emptyContactDetails("consignee");
			emptyCityStateZip("consignee");
			
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
			consigneeAddress = finalAddress;
			emptyCityStateZip("consignee");
			$('input[name="consignee\\.addressRoleId"]').val(data.addRole);
			if(data.coOrgName!=null && data.coOrgName!='null'){
				$('input[name="consignee\\.careOf"]').val(data.coOrgName);
			}else{
			$('input[name="consignee\\.careOf"]').val("");
			}
			
			if(data.cntry!=null && data.cntry!='null'){
				$('input[name="consignee\\.countryName"]').val(data.cntry);
			}else{
			$('input[name="consignee\\.countryName"]').val("");
			}
			if(data.provnc!=null && data.provnc!='null'){
				$('input[name="consignee\\.provinceName"]').val(data.provnc);
			}else{
			$('input[name="consignee\\.provinceName"]').val("");
			}
			$('input[name="consignee\\.city"]').val(data.city);
			$('input[name="consignee\\.state"]').val(data.state);
			$('input[name="consignee\\.zip"]').val(data.zip);
			
			$('#refNumOverRideForConsignee').val("N");
			//$('#isChangeAcceptedAfterUnitsReceived').val("N");
			
			
			processShipperConsigneeColor("consignee");
			checkAccordionHeaderForConsignee();
		
			requestForContactList("consignee");
			
			if($('#prepaidCollectCode').val()=='C'||$('#prepaidCollectCode').val()=='B'){
				addConsigneeAsDebtor();
			}
			removeShipmentErrorPointers();
			
			setSaveBillBeforeBillButton();
		}
	});
}

function checkForConsigneeTemplate(){
	if($("#shipmentStatusCode").val()=='INCP' || $("#shipmentStatusCode").val()==''){
		if($('input[name="consignee\\.address"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!=''){
			if($('#shipmentTemplateOwnerPartyType').val()=='03' || ($('#shipmentTemplateId').val()=='' || $('#shipmentTemplateId').val()==null)){
				var data = prepareInputForCASTemplateScreen();
				$.ajax({
					type : "POST",
					//url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="consignee\\.addressRoleId"]').val()+'|03|'+filterParamsForCASForTemplateValidation(),
					url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="consignee\\.addressRoleId"]').val()+'|03|',
					success : function(responseText) {
						var templateCount = responseText[0].totrec;
						//$("#shipmentTemplateOwner").val("N");//get it from CAS
						//means template owner is not shipper
						//if($("#shipmentTemplateOwner").val()!='Y' && $("#shipmentTemplateOwner").val()!=''){
							if(templateCount==1){
								templateUpdate(responseText[0].id,'consignee');
							}else if(templateCount>1){
								templatePopupSearch();
								requestForContactList("consignee");
							}else{
								requestForContactList("consignee");
								//addConsigneeAsDebtor();
							}
						/*}else{
							requestForContactList("consignee");
							//addConsigneeAsDebtor();
						}*/
					}
				});
			}
			else
				requestForContactList("consignee");
		}
	}
	else
		requestForContactList("consignee");
}

function clearCityStateZip() {
	$('input[name="consignee\\.city"]').val('');
	$('input[name="consignee\\.state"]').val('');
	$('input[name="consignee\\.zip"]').val('');
}

/**
 * This method calls consignee lookup and passes it necessary arguments.
 * */
function consigneePopupSearch() {
	orgCaller = 'consignee';
	var consigneeName = $('input[name="consignee\\.organizationName"]').val();
	var splitconsigneeName = "";
	var actionUrl = "";
	if(consigneeName.indexOf("-") > 0){
		splitconsigneeName = consigneeName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=|' + $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitconsigneeName[1]);
	}else{
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ consigneeName + '|' + $('#tradeCode').val() + '|BK'/*+'|'+$('#customerGroupId').val()*/;
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

/**
 * consignee address pop-up search
 * */
function consigneeAddressPopupSearch() {
	orgCaller = 'consignee';
	
	if ($.trim($('input[name="consignee\\.organizationId"]').val())=='') { 
		alert("Please select organization first");
	}/*else if($('#tradeCode :selected').val()==''){
		alert("Please select Trade");
	}*/else {
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('input[name="consignee\\.organizationId"]').val()) + '&filterValue2=03'+'&filterValue3='+$('#tradeCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}

/**
 * consignee address method called by CAS, after look-up.
 * */
//function addroleUpdate(data) {}


function loadAdditionalConsigneeDetails(responseText){
	$("#consigneeId").val(responseText.data.consignee.organizationId);
	$('#consignee\\.addressRoleId').val(responseText.data.consignee.addressRoleId);
	
	if(null!=responseText.data.consignee.addressRoleId){
		enableDisableContactId('consignee',false);
	}

	setConsigneeCommMethodValue(responseText.data.consignee);
	//first clear the drop down
	$('select[name="consignee\\.contactId"]').children().remove();
	$('select[name="consignee\\.contactId"]').append("<option value='' label='Select'></option>");
	$.each(responseText.data.consignee.contactList, function(key, value) {
		$('select[name="consignee\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	
	$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
	
	//$('select[name="consignee\\.contactId"]').attr('selectedIndex', 0);
	if(responseText.data.consignee.isCustomerOneTimeCust==true){
		formatColorForOneTime('consignee');
	}
}

function emptyCityStateZip(source){
	$('input[name="'+ source +'\\.careOf"]').val("");
	$('input[name="'+ source +'\\.city"]').val("");
	$('input[name="'+ source +'\\.state"]').val("");
	$('input[name="'+ source +'\\.zip"]').val("");
}

function emptyContactDetails(source){
	$('select[name="'+ source +'\\.contactId"]').children().remove();
	emptyContactDetailsOnContactChange(source);
	enableDisableContactId(source, true);
	//$('input[name="'+ source +'\\.communicationMethodCode"]').val("");
	setDefaultPrefMethod(source);
}

function emptyContactDetailsOnContactChange(source){
	$('input[name="'+ source +'\\.contact"]').val("");
	$('input[name="'+ source +'\\.contactFaxCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxExchange"]').val("");
	$('input[name="'+ source +'\\.contactFaxStation"]').val("");

	$('input[name="'+ source +'\\.contactCellCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactCellAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactCellExchange"]').val("");
	$('input[name="'+ source +'\\.contactCellStation"]').val("");

	$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExchange"]').val("");
	$('input[name="'+ source +'\\.contactPhoneStation"]').val("");
	$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val("");

	$('input[name="'+ source +'\\.contactEmailAddress"]').val("");
	//$('input[name="'+ source +'\\.communicationMethodCode"]').val("");
	setDefaultPrefMethod(source);
}
function addConsigneeAsDebtor(){
	
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		url : _context +"/shipment/party/setDefaults",
		type : "POST",
		data : queryString+"&type=consignee&oper=add",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			/*
			if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('B');//both
			else if($('input[name="shipper\\.addressRoleId"]').val()=='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('C');//consignee
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
}

function removeConsigneeAsDebtor(){
	
	var queryString = $('#shipmentForm').formSerialize();
	/*$.ajax({
		url : _context +"/shipment/party/setDefaults",
		type : "POST",
		data : queryString+"&type=consignee&oper=remove",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			if($('input[name="shipper\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('P');
			else
				$('#prepaidCollectCode').val('');
				
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});*/
	$("#gridIdForParties").trigger("reloadGrid");
}

function setConsigneeDivName(name){
	setAccordianTabDetails("consigneeNameDiv", " - " + name);
}


function setConsigneeCommMethodValue(consignee) {
	if (consignee.communicationMethodCode == 'P') {
		$('#consigneeComm1').attr('checked', true);
		$('#consigneeComm1').val("P");
	} else if (consignee.communicationMethodCode == 'C') {
		$('#consigneeComm2').attr('checked', true);
		$('#consigneeComm2').val("C");
	} else if (consignee.communicationMethodCode == 'F') {
		$('#consigneeComm3').attr('checked', true);
		$('#consigneeComm3').val("F");
	} else if (consignee.communicationMethodCode == 'E') {
		$('#consigneeComm4').attr('checked', true);
		$('#consigneeComm4').val("E");
	}
}

function showWarningIfAroleChangeAndRefNumberRequiredConsignee() {
	var isRefNumberRequired= $('input[name="consignee\\.isReferenceNumberRequired"]').val();
	if (isRefNumberRequired == 'Y') {
		var refExist = validateRefNumberRequiredConsignee();
		if (refExist == false) {
			$.unblockUI();
			alert("Consignee requires reference number");
		}	
	}
}

function setIsRefNumberRequiredConsignee(){
	$.ajax({
		async: false,
		type : "GET",
		url : _context +"/shipment/referenceNumberRequiredOnAddressRoleChange",
		data : {
			addressRoleId : $('input[name="consignee\\.addressRoleId"]').val(),
			shipperConsignee:'C',
			trade: $('#tradeCode').val()
		},
		success : function(responseText) {
			$('input[name="consignee\\.isReferenceNumberRequired"]').val(responseText.data);
		},
		error : function(responseText){
			$('input[name="consignee\\.isReferenceNumberRequired"]').val('N');
		}
	});
}


function enableDisableContactId(source,set){	
	if(($("#statusCode").text()!='ISSUED') && ($("#statusCode").text()!='CORRECTED'))
		if(isShipperConsigneeModifiable){
			$('select[name="'+source+'\\.contactId"]').attr("disabled",false);
		}
	else{
		$('select[name="'+source+'\\.contactId"]').attr("disabled",true);
	}
}

function setDefaultPrefMethod(source){
	$('#'+source+'Comm1').attr('checked',true);
	$('#'+source+'Comm1').val('P');
	$('#'+source+'Comm1').trigger('click');
}

function checkAccordionHeaderForConsignee()
{
	if($('input[name="consignee\\.addressRoleId"]').val()!='')
		setAccordianTabDetails("consigneeNameDiv", " - "+$('input[name="consignee\\.organizationName"]').val());
	else
		setAccordianTabDetails("consigneeNameDiv", "");
}
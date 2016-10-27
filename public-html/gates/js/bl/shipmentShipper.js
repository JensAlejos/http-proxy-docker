var shipperAddress = "";
var templateCaller ="";

$(function() {
	
	$('#shipmentForm').validationEngine('attach');
	$("#copyShipper").attr("disabled", true);
	//enableDisableContactId('shipper',true);
	//setDefaultPrefMethod('shipper');
	
	shipperOrgPredictive();
	shipperAddressPredictive();
	
	// Shipper Pop-Up Search
	$('input[name="shipper\\.organizationName"]').gatesPopUpSearch({
		func : function() {
			shipperPopupSearch();
			/*if($('input[name="shipper\\.isOneTimeCustomer"]').val()==false || $('input[name="shipper\\.isOneTimeCustomer"]').val()=='false'){
				shipperAddressPopupSearch();
			}*/
		}
	});

	// Shipper address Pop-Up Search
	$('input[name="shipper\\.address"]').gatesPopUpSearch({
		func : function() {
			if($('input[name="shipper\\.isOneTimeCustomer"]').val()==false || $('input[name="shipper\\.isOneTimeCustomer"]').val()=='false'){
				shipperAddressPopupSearch();
			}
		}
	});
	
	
	// Clear shipper details on change of Shipper
	$('input[name="shipper\\.organizationName"]').change(function() {
		if ($('input[name="shipper\\.organizationName"]').val()=='' 
			|| $('input[name="shipper\\.organizationName"]').val() != $('#shipperName').val()) {
			
			//removeShipperAsDebtor();
			setShipperDivName("");
			
			$("#copyShipper").attr("disabled", true);
			if($('input[name="consignee\\.organizationName"]').val()!=''){
				$("#copyConsignee").attr("disabled", false);
			}
			emptyCityStateZip("shipper");
			emptyContactDetails("shipper");
			$('input[name="shipper\\.organizationId"]').val("");
			$('input[name="shipper\\.organizationName"]').val("");
			$('input[name="shipper\\.organizationCode"]').val("");
			$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
			//$('input[name="shipper\\.addressRoleId"]').val("");
			//resetTrade();
			//shipperAddressPredictive();
		}
		
		$('input[name="shipper\\.address"]').val("");
		processShipperConsigneeColor("shipper");
		$('input[name="shipper\\.address"]').trigger('change');
		checkOneTimerCustomer("shipper");
	});
	
	$('input[name="consignee\\.organizationName"]').change(function() {
		checkOneTimerCustomer("consignee");
	});
	$('input[name="shipper\\.address"]').change(function() {
		if(shipperAddress!=$('input[name="shipper\\.address"]').val())
		{
			$('input[name="shipper\\.address"]').val('');
			shipperAddress = '';
			$('input[name="shipper\\.addressRoleId"]').val("");
			$('#refNumOverRideForShipper').val("");
		}
		
		emptyCityStateZip("shipper");
		emptyContactDetails("shipper");
		//handlePrepaidCollectIndicator('S');
		removeShipperAsDebtor();
		checkAccordionHeaderForShipper();
		//checkCopyButtons();
	});

	// get contact details for selected contact id
	$('select[name="shipper\\.contactId"]').change(function() {
		/*if($('select[name="shipper\\.contactId"]').val()!=null 
			&& $('select[name="shipper\\.contactId"]').val()!=''){*/
			requestForContactDetails("shipper", "N");
			//check for one timer customer
			checkOneTimerCustomer("shipper");
		/*}*/
	});
	
	
	$('select[name="consignee\\.contactId"]').change(function() {
		//check for one timer customer
		checkOneTimerCustomer("consignee");
	});

	//Copy Shipper to Consignee
	$('#copyShipper').click(function() {
		if ($('input[name="shipper\\.organizationName"]').val() != '' && $('input[name="consignee\\.organizationName"]').val() == '') {
			$('input[name="consignee\\.organizationName"]').val($('input[name="shipper\\.organizationName"]').val());
			$('#consigneeName').val($('input[name="shipper\\.organizationName"]').val());
			$('input[name="consignee\\.address"]').val($('input[name="shipper\\.address"]').val());
			consigneeAddress = $('input[name="shipper\\.address"]').val();
			$('input[name="consignee\\.careOf"]').val($('input[name="shipper\\.careOf"]').val());
			$('input[name="consignee\\.city"]').val($('input[name="shipper\\.city"]').val());
			$('input[name="consignee\\.state"]').val($('input[name="shipper\\.state"]').val());
			$('input[name="consignee\\.zip"]').val($('input[name="shipper\\.zip"]').val());
			$('input[name="consignee\\.countryName"]').val($('input[name="shipper\\.countryName"]').val());
			$('input[name="consignee\\.provinceName"]').val($('input[name="shipper\\.provinceName"]').val());
			$('select[name="consignee\\.contactId"]').html($('select[name="shipper\\.contactId"]').html());
			
			$('select[name="consignee\\.contactId"]').selected().val($('select[name="shipper\\.contactId"]').selected().val());//html($('select[name="shipper\\.contactId"]').html());
			
			$('input[name="consignee\\.contact"]').val($('input[name="shipper\\.contact"]').val());

			$('input[name="consignee\\.contactPhoneCountryCode"]').val($('input[name="shipper\\.contactPhoneCountryCode"]').val());
			$('input[name="consignee\\.contactPhoneAreaCode"]').val($('input[name="shipper\\.contactPhoneAreaCode"]').val());
			$('input[name="consignee\\.contactPhoneExchange"]').val($('input[name="shipper\\.contactPhoneExchange"]').val());
			$('input[name="consignee\\.contactPhoneStation"]').val($('input[name="shipper\\.contactPhoneStation"]').val());

			$('input[name="consignee\\.contactCellCountryCode"]').val($('input[name="shipper\\.contactCellCountryCode"]').val());
			$('input[name="consignee\\.contactCellAreaCode"]').val($('input[name="shipper\\.contactCellAreaCode"]').val());
			$('input[name="consignee\\.contactCellExchange"]').val($('input[name="shipper\\.contactCellExchange"]').val());
			$('input[name="consignee\\.contactCellStation"]').val($('input[name="shipper\\.contactCellStation"]').val());

			$('input[name="consignee\\.contactFaxCountryCode"]').val($('input[name="shipper\\.contactFaxCountryCode"]').val());
			$('input[name="consignee\\.contactFaxAreaCode"]').val($('input[name="shipper\\.contactFaxAreaCode"]').val());
			$('input[name="consignee\\.contactFaxExchange"]').val($('input[name="shipper\\.contactFaxExchange"]').val());
			$('input[name="consignee\\.contactFaxStation"]').val($('input[name="shipper\\.contactFaxStation"]').val());

			$('input[name="consignee\\.contactEmailAddress"]').val($('input[name="shipper\\.contactEmailAddress"]').val());
			$('input[name="consignee\\.contactEmailAddress"]').attr('title',$('input[name="consignee\\.contactEmailAddress"]').val());
			$("#copyShipper").attr("disabled", true);
			//copy the internal ID's
			$('input[name="consignee\\.addressRoleId"]').val($('input[name="shipper\\.addressRoleId"]').val());
			$('input[name="consignee\\.organizationId"]').val($('input[name="shipper\\.organizationId"]').val());
			$('input[name="consignee\\.isOneTimeCustomer"]').val($('input[name="shipper\\.isOneTimeCustomer"]').val());
			$('input[name="consignee\\.organizationCode').val($('input[name="shipper\\.organizationCode').val());
			
			processShipperConsigneeColor("consignee");
			
			var preMethod = getPrefCommMethod('shipper');
			if(preMethod=='P'){
				$('#consigneeComm1').attr('checked',true);
				$('#consigneeComm1').val(preMethod);
			}else if(preMethod=='C'){
				$('#consigneeComm2').attr('checked',true);
				$('#consigneeComm2').val(preMethod);
			}else if(preMethod=='F'){
				$('#consigneeComm3').attr('checked',true);
				$('#consigneeComm3').val(preMethod);
			}else if(preMethod=='E'){
				$('#consigneeComm4').attr('checked',true);
				$('#consigneeComm4').val(preMethod);
			}
			
			enableDisableContactId('consignee',false);
			setConsigneeDivName(" " + $('input[name="shipper\\.organizationName"]').val());
			$('#refNumOverRideForconsignee').val("N");
			
			if($('#prepaidCollectCode').val()=='C'||$('#prepaidCollectCode').val()=='B'){
				addConsigneeAsDebtor();
			}
			//consigneeOrgPredictive();
			//consigneeAddPredictive();
		
		}
	});

	$('#shipperRepeatContact').click(function(){	
		if($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isShipperConsigneeModifiable==false){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		var contact= $('input[name="shipper\\.contact"]').val();
		if(($('select[name="shipper\\.contactId"]').selected().val()!='') || ((contact!=null) && ($.trim(contact).length !=0)) )
		{
			repeatCaller ="shipper";
			
			$('#originalOrgName').val($('input[name="shipper\\.organizationName"]').val());
			$('#originalOrgAddress').val($('input[name="shipper\\.address"]').val()/* Defect 17655 +" - "+ $('input[name="shipper\\.city"]').val() +" , "+ $('input[name="shipper\\.state"]').val()*/);
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$('#repeatContactShipmentSeqNo').val($('#shipmentSequenceNumber').val());
			$('#repeatContactShipmentCorrNo').val($('#shipmentCorrectionNumber').val());
			
			
			
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$("#repeatContactOriginalAroleId").val($('input[name="shipper\\.addressRoleId"]').val());
			//$("#repeatContactNameLabel").html($("select[name='shipper\\.contactId'] option:selected").text());
			$("#repeatContactNameLabel").html($('input[name="shipper\\.contact"]').val());
			$("#repeatContactName").val($('input[name="shipper\\.contact"]').val());

			var p1 =  $('input[name="shipper\\.contactPhoneCountryCode"]').val();
			var p2 =  $('input[name="shipper\\.contactPhoneAreaCode"]').val();
			var p3 =  $('input[name="shipper\\.contactPhoneExchange"]').val();
			var p4 =  $('input[name="shipper\\.contactPhoneStation"]').val();
			var p5 =  $('input[name="shipper\\.contactPhoneExtension"]').val();
			var Phonearray = [p1,p2,p3,p4,p5];
			
			var Phone = Phonearray.join("-");
			
			var c1 =  $('input[name="shipper\\.contactCellCountryCode"]').val();
			var c2 =  $('input[name="shipper\\.contactCellAreaCode"]').val();
			var c3 =  $('input[name="shipper\\.contactCellExchange"]').val();
			var c4 =  $('input[name="shipper\\.contactCellStation"]').val();
			var c5 =  $('input[name="shipper\\.contactCellExtension"]').val();
			
			var cellarray = [c1,c2,c3,c4,c5];
			
			var cell = cellarray.join("-");
			
			
			var f1 =  $('input[name="shipper\\.contactFaxCountryCode"]').val();
			var f2 =  $('input[name="shipper\\.contactFaxAreaCode"]').val();
			var f3 =  $('input[name="shipper\\.contactFaxExchange"]').val();
			var f4 =  $('input[name="shipper\\.contactFaxStation"]').val();
			var f5 =  $('input[name="shipper\\.contactFaxExtension"]').val();
			
			var faxarray = [f1,f2,f3,f4,f5];
			
			var fax = faxarray.join("-");
			
			$("#repeatContactPhone").val(Phone);			
			$("#repeatContactCell").val(cell);
			$("#repeatContactFax").val(fax);			
			$("#repeatContactEmailAddress").val($('input[name="shipper\\.contactEmailAddress"]').val());
			$("#repeatContactId").html($('select[name="shipper\\.contactId"]').html());
			$("#repeatContactId").selected().val($('select[name="shipper\\.contactId"]').selected().val());
			$('#repeatTrade').val($('#tradeCode').val());
			$('#repeatCaller').val(repeatCaller);
			$('#repeatCallerPartyType').val("02");
						
			$('#repeatCustomerGroupId').val($('#customerGroupId').val());
			$('#repeatPortOfLoad').val($('#originPortCityCode').val());
			$('#repeatPortOfDischarge').val($('#destinationPortCityCode').val());
			
			$("#repeatContactOverlay").dialog('open');
		}
		else
			alert("Please select a contact/contact Name first");
	});
	
	/*$('#shiConTestDiv').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
	
	/*$('input[name="shipper\\.organizationName"]').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
	trimContactOnChange('shipper'); //D018433

	
		
    autoTabShipper('contactPhoneCountryCode','contactPhoneAreaCode', 1,'contactPhoneCountryCode');
    autoTabShipper('contactPhoneAreaCode','contactPhoneExchange', 3,'contactPhoneCountryCode');
    autoTabShipper('contactPhoneExchange','contactPhoneStation', 3,'contactPhoneCountryCode');
    autoTabShipper('contactPhoneStation','contactPhoneExtension', 4,'contactPhoneCountryCode');
	
	
    autoTabShipper('contactCellCountryCode','contactCellAreaCode', 1,'contactCellCountryCode');
    autoTabShipper('contactCellAreaCode','contactCellExchange', 3,'contactCellCountryCode');
    autoTabShipper('contactCellExchange','contactCellStation', 3,'contactCellCountryCode');
    autoTabShipper('contactCellStation','contactCellExtension', 4,'contactCellCountryCode');
	
    autoTabShipper('contactFaxCountryCode','contactFaxAreaCode', 1,'contactFaxCountryCode');
    autoTabShipper('contactFaxAreaCode','contactFaxExchange', 3,'contactFaxCountryCode');
	autoTabShipper('contactFaxExchange','contactFaxStation', 3,'contactFaxCountryCode');
	autoTabShipper('contactFaxStation','contactFaxExtension', 4,'contactFaxCountryCode');

	checkOneTimerCustomer("shipper");
	checkOneTimerCustomer("consignee");
	


});

function shipperOrgPredictive()
{
	/*var urlShipperOrg = _context
			+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();*/
	
	$('input[name="shipper\\.organizationName"]').gatesAutocomplete(
		{
			source:_context+'/cas/autocomplete.do',
		 	extraParams: {
 		 		 method: 'searchOrg',
 		 		 searchType: '229',
 		 		parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
		 	},
			//source : urlShipperOrg,
			formatItem : function(data) {
				$('input[name="shipper\\.organizationId"]').val("");
				return data.name + "-" + data.abbr;
			},
			formatResult : function(data) {
				return data.name + "-" + data.abbr;
			},
			autoSelectWhenSingle:true,
			autoSelectFirst:true,
			select : function(data) {
				$('input[name="shipper\\.organizationName"]').val(data.name + "-" + data.abbr);
				$('#shipperName').val($('input[name="shipper\\.organizationName"]').val());
				$('input[name="shipper\\.organizationCode"]').val(data.abbr);
				$('input[name="shipper\\.organizationId"]').val(data.id);

				shipperId = data.id;
				$('select[name="shipper\\.contactId"]').children().remove();
				$('select[name="shipper\\.contactId"]').append("<option value='' label='Select'></option>");
				$("#shipperAddressRoleName").val("");

				$('input[name="shipper\\.address"]').val("");
				$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
				processShipperConsigneeColor("shipper");
				emptyCityStateZip("shipper");
				emptyContactDetails("shipper");

				if($('#consigneeName').val()!=''){
					$("#copyConsignee").attr("disabled", true);
				}
				$('input[name="shipper\\.organizationName"]').attr('title',$('input[name="shipper\\.organizationName"]').val());
				//populateTrade(data.trade);
				//shipperAddressPredictive();
				
				singleShipperAddressSelect();
				
				//setSaveBillBeforeBillButton();
			}
		});
}

function singleShipperAddressSelect(){
	
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+$('input[name="shipper\\.organizationId"]').val()+'|02|'+$('#tradeCode').val(),						
		      
		success : function(responseText) {
		
			if(responseText.length == 1){
			
				
				var nameQualifier = responseText[0].nameQual;
				var city = responseText[0].city;
				var state = responseText[0].state;
				
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);
				shipperAddress = finalAddress;
				$('input[name="shipper\\.addressRoleId"]').val(responseText[0].addRole);
				
				if(responseText[0].coOrgName!=null && responseText[0].coOrgName!='null')
					$('input[name="shipper\\.careOf"]').val(responseText[0].coOrgName);
				else
					$('input[name="shipper\\.careOf"]').val('');
				
				if(responseText[0].cntry!=null && responseText[0].cntry!='null')
					$('input[name="shipper\\.countryName"]').val(responseText[0].cntry);
				else
					$('input[name="shipper\\.countryName"]').val("US");
				if(responseText[0].provnc!=null && responseText[0].provnc!='null')
					$('input[name="shipper\\.provinceName"]').val(responseText[0].provnc);
				else
					$('input[name="shipper\\.provinceName"]').val("");
				$('input[name="shipper\\.city"]').val(responseText[0].city);
				$('input[name="shipper\\.state"]').val(responseText[0].state);
				$('input[name="shipper\\.zip"]').val(responseText[0].zip);
				$('input[name="shipper\\.address"]').val(shipperAddress);
				$("#shipperAddressRoleName").val($('input[name="shipper\\.address"]').val());
				$('#refNumOverRideForShipper').val("N");
				
				processShipperConsigneeColor("shipper");
				checkAccordionHeaderForShipper();
				//checkCopyButtons();

					requestForContactList("shipper");
				
				if($('#prepaidCollectCode').val()=='P'||$('#prepaidCollectCode').val()=='B'){
					addShipperAsDebtor();
				}
				setAccordianTabDetails("shipperNameDiv", " - "+$('input[name="shipper\\.organizationName"]').val());
				removeShipmentErrorPointers();
				
				setSaveBillBeforeBillButton();
				
				/*var nameQualifier = responseText[0].nameQual;
				var city = responseText[0].city;
				var state = responseText[0].state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);
				$('input[name="shipper\\.address"]').val( finalAddress);
				
				shipperAddressPopulate(responseText[0]);*/
			} else {
			
				shipperAddressPopupSearch();
		}
			
		}
	});
}

function shipperAddressPredictive()
{
	//address role predictive search.
	/*var urlShipperAdd = _context
	+ '/cas/autocomplete.do?method=searchAddRoleBK&searchType=234&parentSearch='
	+ $('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val();*/
	
	$('input[name="shipper\\.address"]').gatesAutocomplete({
			//source : urlShipperAdd,
			source:_context+'/cas/autocomplete.do',
			name: "Customer Address",
		 	extraParams: {
 		 		 method: 'searchAddRoleBK',
 		 		 searchType: '234',
 		 		 parentSearch:  function() { return $('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val(); }
		 	},
			formatItem : function(data) {
				$('input[name="shipper\\.addressRoleId"]').val("");
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
				
				emptyCityStateZip("shipper");
				emptyContactDetails("shipper");
				
				var nameQualifier = data.nameQual;
				var city = data.city;
				var state = data.state;
				
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
				shipperAddress = finalAddress;
				$('input[name="shipper\\.addressRoleId"]').val(data.addRole);
				
				if(data.coOrgName!=null && data.coOrgName!='null')
					$('input[name="shipper\\.careOf"]').val(data.coOrgName);
				else
					$('input[name="shipper\\.careOf"]').val('');
			
				if(data.cntry!=null && data.cntry!='null')
					$('input[name="shipper\\.countryName"]').val(data.cntry);
				else
					$('input[name="shipper\\.countryName"]').val("US");
				if(data.provnc!=null && data.provnc!='null')
					$('input[name="shipper\\.provinceName"]').val(data.provnc);
				else
					$('input[name="shipper\\.provinceName"]').val("");
				$('input[name="shipper\\.city"]').val(data.city);
				$('input[name="shipper\\.state"]').val(data.state);
				$('input[name="shipper\\.zip"]').val(data.zip);
				$("#shipperAddressRoleName").val($('input[name="shipper\\.address"]').val());
				$('#refNumOverRideForShipper').val("N");
				
				processShipperConsigneeColor("shipper");
				checkAccordionHeaderForShipper();
				handlePrepaidCollectIndicator('S');
				//checkCopyButtons();

					requestForContactList("shipper");
				
				if($('#prepaidCollectCode').val()=='P'||$('#prepaidCollectCode').val()=='B'){
					addShipperAsDebtor();
				}
				setAccordianTabDetails("shipperNameDiv", " - "+$('input[name="shipper\\.organizationName"]').val());
				removeShipmentErrorPointers();
				
				setSaveBillBeforeBillButton();
			}
		});	
}

function shipperPopupSearch() {
	orgCaller = 'shipper';
	var shipperName = $('input[name="shipper\\.organizationName"]').val();
	var splitShipperName = "";
	var actionUrl = "";
	if(shipperName.indexOf("-") > 0){
		splitShipperName = shipperName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=|'+ $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitShipperName[1]) ;
	}else{
		splitShipperName = shipperName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ shipperName + '|'+ $('#tradeCode').val() + '|BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function shipperAddressPopupSearch() {
	orgCaller = 'shipper';
	
	if ($.trim($('input[name="shipper\\.organizationId"]').val())=='') { 
		alert("Please select organization first");
	}/*else if($('#tradeCode :selected').val()==''){
		alert("Please select Trade");
	}*/else {
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('input[name="shipper\\.organizationId"]').val()) + '&filterValue2=02'+'&filterValue3='+$('#tradeCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}

function cleanShipperConsignee(){
	$("#shipperNameDiv").html("");
	$("#consigneeNameDiv").html("");
	$("#copyShipper").attr("disabled", true);
	enableScreenForDealer();
	$('#msgDiv').html("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
	enableDisableContactId('shipper',true);
	enableDisableContactId('consignee',true);
	$('input[name="shipper\\.organizationName"]').css('color', 'black');
	$('input[name="consignee\\.organizationName"]').css('color', 'black');
	resetDefault();
}

function goToMaintainTemplatePage(templateNumber){
	var url = _context +"/shipment/template/loadTemplateForm?templateNumber=" + templateNumber;
	window.open(url);
}

function setDefaultPrefMethod(source){
		/*$('#'+source+'Comm1').attr('checked',true);
		$('#'+source+'Comm1').val('P');
		$('#'+source+'Comm1').trigger('click');*/
		//$('#shipperComm1').trigger('click');
		$('#'+ source +'Comm1').attr('checked',false);
		$('#'+ source +'Comm2').attr('checked',false);
		$('#'+ source +'Comm3').attr('checked',false);
		$('#'+ source +'Comm4').attr('checked',false);
		//$('#'+ source +'Comm1').trigger('change');
	}

/*function populateTrade(trades){
	if($('#tradeCode').val()==''){
		var splitTrades = trades.split(",");
		$('#tradeCode').selected().val(splitTrades[0]);
		$('#tradeCode').trigger('change');
		$('#tradeCode').trigger('blur');
	}
}*/

/*function resetTrade(){
	if($('input[name="shipper\\.organizationId"]').val()=='' && $('input[name="consignee\\.organizationId"]').val()==''){
		if($('#shipmentNumber').val()==''){
			$('#tradeCode').val('');
			$('#tradeCode').trigger('change');
			$('#tradeCode').trigger('blur');	
		}
	}
}*/

function filterParamsForCASForTemplateValidation(){
	var data="";
	data = $('#blOriginCityCode').val()+"|"+	$('#blDestinationCityCode').val()+"|"+$('#originPortCityCode').val()+"|"+$('#destinationPortCityCode').val()+"|"+$('#loadServiceCode').val()+"|"+$('#dischargeServiceCode').val();
	return data;
}

//check if template available for shipper
function checkForShipperTemplate(){
	if($("#shipmentStatusCode").val()=='INCP' || $("#shipmentStatusCode").val()==''){
		if($('input[name="shipper\\.address"]').val()!='' && $('input[name="shipper\\.addressRoleId"]').val()!=''){
			templateCaller ="shipper";
			//var data = prepareInputForCASTemplateScreen();
			//call to cas to get template count
			$.ajax({
				type : "POST",
				//url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="shipper\\.addressRoleId"]').val()+'|02|'+filterParamsForCASForTemplateValidation(),
				url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="shipper\\.addressRoleId"]').val()+'|02|',
				success : function(responseText) {
					var templateCount = responseText[0].totrec;
					if(templateCount==1){
						templateUpdate(responseText[0].id,'shipper');
					}else if(templateCount>1){
						templatePopupSearch();
						requestForContactList("shipper");
					}else{
						requestForContactList("shipper");
					}
				}
			});
		}
	}
	else
		requestForContactList("shipper");
}

//TRADE|CUSTOMERGROUP|TARIFF|ITEM|DESCRIPTION|DEALERCODE|SHIPPERNAME|SHIPPERADDRESS|SHIPPERAROLEID|CONSIGNEENAME|CONSIGNEEADDRESS|CONSIGNEEAROLEID|
//LS|DS|PLR|POL|POD|PLD|EQUIPMENT
function prepareInputForCASTemplateScreen(){
	var data="";
	data = $('#tradeCode').val() + '-' + $('#tradeCode option:selected').text() +'|';
	data = data + $('#customerGroupId').val() + '-' + $('#customerGroupId option:selected').text() +'|';

	data = data + $('#tariffNumber').val()+'|';
	data = data + $('#tariffItemNumber').val()+'|';

	data = data + $('#tariffCommodityDescription').val()+'|';
	data = data + $('#dealerAuctionLocationCode').val()+'|';

	data = data + $('input[name="shipper\\.organizationName"]').val()+'|';
	data = data + $('input[name="shipper\\.address"]').val()+'|';
	data = data + $('input[name="shipper\\.addressRoleId"]').val()+'|';
	data = data + $('input[name="shipper\\.organizationId"]').val() +'|';

	data = data + $('input[name="consignee\\.organizationName"]').val()+'|';
	data = data + $('input[name="consignee\\.address"]').val()+'|';
	data = data + $('input[name="consignee\\.addressRoleId"]').val()+'|';
	data = data + $('input[name="consignee\\.organizationId"]').val() +'|';

	data = data + $('#loadServiceCode').val() +'|';
	data = data + $('#dischargeServiceCode').val() +'|';

	data = data + $('#blOriginCityCodeDescription').val()+'|';
	data = data + $('#originPortCityCodeDescription').val()+'|';

	data = data + $('#destinationPortCityCodeDescription').val()+'|';
	data = data + $('#blDestinationCityCodeDescription').val()+'|';
	data = data + $('#contactId').val()+'|';
	
	

	return data;
}

function pullCASTemplateScreenInfoToMB(data){
}

function clearCityStateZip() {
	$('input[name="shipper\\.city"]').val('');
	$('input[name="shipper\\.state"]').val('');
	$('input[name="shipper\\.zip"]').val('');
	$("#copyShipper").attr("disabled", true);
}

function orgSearchUpdate(id) {
	//console.log('orgSearchUpdate '+id+" orgCaller="+orgCaller);
	if (orgCaller == 'shipper') {
		var values = id.split("|");
		$('input[name="shipper\\.organizationName"]').val(values[0] +"-"+ values[1]);
		$('input[name="shipper\\.organizationName"]').attr('title',$('input[name="shipper\\.organizationName"]').val());
		$('input[name="shipper\\.organizationCode"]').val(values[1]);
		$('input[name="shipper\\.organizationId"]').val(values[2]);
		$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
		processShipperConsigneeColor("shipper");
		$('#shipperName').val(values[0]);
		//populateTrade(values[3]);
		$('input[name="shipper\\.address"]').val("");
		emptyCityStateZip("shipper");
		emptyContactDetails("shipper");
		if($('#consigneeName').val()!=''){
			$("#copyConsignee").attr("disabled", true);
		}
		//shipperAddressPredictive();
	}else if (orgCaller == 'consignee') {
			var values = id.split("|");
			$('input[name="consignee\\.organizationName"]').val(values[0] +"-"+ values[1]);
			$('input[name="consignee\\.organizationName"]').attr('title',$('input[name="consignee\\.organizationName"]').val());
			$('input[name="consignee\\.organizationCode"]').val(values[1]);
			$('input[name="consignee\\.organizationId"]').val(values[2]);
			$('#consigneeName').val(values[0]);
			$('input[name="consignee\\.isOneTimeCustomer"]').val("false");
			processShipperConsigneeColor("consignee");
			$('input[name="consignee\\.address"]').val("");
			//populateTrade(values[3]);
			emptyCityStateZip("consignee");
			emptyContactDetails("consignee");
			if($('#shipperName').val()!=''){
				$("#copyShipper").attr("disabled", true);
			}
			//consigneeAddPredictive();
		}else if (orgCaller == 'parties') {
			
			var values = id.split("|");
			$('input[name="organizationName"]').val(values[0] +"-"+ values[1]);//updated for defect D020421
			partyOrg = values[1] +"-"+ values[0];
			$('input[name="organizationName"]').attr('title',$('input[name="organizationName"]').val());
			$('input[name="organizationCode"]').val(values[1]);
			$('input[name="organizationId"]').val(values[2]);
			$('input[name="isOneTimeCustomer"]').val("false");
			$('input[name="addressRoleId"]').val("");
			$('input[name="address"]').trigger('change');
			
			isPartyChanged = "Y";
			//partiesAddPredictive();
		}else if (orgCaller == 'repeat') {
			var values = id.split("|");

			$('#repeatContactOrgName').val(values[0] +"-"+ values[1]);
			repeatOrgName = values[1] +"-"+ values[0];
			$('#repeatContactOrgName').attr('title',$('#repeatContactOrgName').val());
			$('#repeatContactOrgId').val(values[2]);
			$("#repeatContactOrgAddress").val("");
			//repeatContactAddressPredictive();
			orgAddressPopupSearch();
		} // D023315, made the org search work, may still have other issues.
		else if (orgCaller == 'dataAdmin') {
			var values = id.split("|");

			$('#existingOrganization').val(values[0] +"-"+ values[1]);
			$('#replaceOrganizationId').val(values[2]);
			if($("#dataAdminCode:checked").val()=="C")
			{
				$('#existingAddressLine1').val("");
				$('#existingAddressLine1').trigger('change');
				singleAddressOneTimerCall();
			}
		}
}

function setShipperDivName(name){
	setAccordianTabDetails("shipperNameDiv", " - "+name);
}

function addroleUpdate(data) {
	if (orgCaller == 'shipper') {
		var values = data.split("|");
		if(values[0]=='ALL'&& $('input[name="consignee\\.organizationName"]').val()=='')
			$("#copyShipper").attr("disabled", false);
		else
			$("#copyShipper").attr("disabled", true);
		
		if(values[3]!=null && values[3]!='null')
			$('input[name="shipper\\.careOf"]').val(values[3]);
		else
			$('input[name="shipper\\.careOf"]').val('');
		
		$('input[name="shipper\\.city"]').val(values[2]);
		$('input[name="shipper\\.state"]').val(values[6]);
		$('input[name="shipper\\.zip"]').val(values[8]);
		$('input[name="shipper\\.countryName"]').val(values[11]);
		$('input[name="shipper\\.provinceName"]').val(values[10]);
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
		$('input[name="shipper\\.address"]').val(finalAddress);
		$('input[name="shipper\\.address"]').attr('title',$('input[name="shipper\\.address"]').val()+','+values[15]+','+values[16]);
		shipperAddress = finalAddress;
		$('input[name="shipper\\.addressRoleId"]').val(values[9]);
		emptyContactDetails("shipper");
		if($('#shipmentTypeCode').val()=='B'){
			checkForShipperTemplate();
		}else{
			requestForContactList("shipper");
		}
		setShipperDivName(" - "+$('input[name="shipper\\.organizationName"]').val());
		if($('#prepaidCollectCode').val()=='P'||$('#prepaidCollectCode').val()=='B'){
			addShipperAsDebtor();
		}
	}else if (orgCaller == 'consignee') {
		var values = data.split("|");
		if(values[0]=='ALL'&& $('input[name="shipper\\.organizationName"]').val()==''){
			$("#copyConsignee").attr("disabled", false);
		}
		else
			$("#copyConsignee").attr("disabled", true);
		
		if(values[3]!=null && values[3]!='null')
			$('input[name="consignee\\.careOf"]').val(values[3]);
		else
			$('input[name="consignee\\.careOf"]').val('');

		$('input[name="consignee\\.city"]').val(values[2]);
		$('input[name="consignee\\.state"]').val(values[6]);
		$('input[name="consignee\\.zip"]').val(values[8]);
		$('input[name="consignee\\.countryName"]').val(values[11]);
		$('input[name="consignee\\.provinceName"]').val(values[10]);
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
		$('input[name="consignee\\.address"]').val(finalAddress);
		$('input[name="consignee\\.address"]').attr('title',$('input[name="consignee\\.address"]').val()+','+values[15]+','+values[16]);
		consigneeAddress = finalAddress;
		$('input[name="consignee\\.addressRoleId"]').val(values[9]);
		emptyContactDetails("consignee");
		if($('#shipmentTypeCode').val()=='B'){
			checkForConsigneeTemplate();
		}else{
			requestForContactList("consignee");
		}
		setConsigneeDivName(" - "+$('input[name="consignee\\.organizationName"]').val());
		if($('#prepaidCollectCode').val()=='C'||$('#prepaidCollectCode').val()=='B'){
			addConsigneeAsDebtor();
		}
	}else if (orgCaller == 'parties') {
		/*var partyTypeCode = $('#partyTypeCode :selected').val();
		var addressRoleType = data.split("|")[0];
		if((partyTypeCode=='20' || partyTypeCode=='21' || partyTypeCode=='31') && addressRoleType!='ALL' && addressRoleType!='FREIGHT PAYABLE')
		{
			alert("Address Role selected must be of type ALL or FREIGHT PAYABLE");
		}
		else if((partyTypeCode=='22' || partyTypeCode=='29') && addressRoleType!='ALL' && addressRoleType!='SHP TO' && addressRoleType!='NOTIFY')
		{
			alert("Address Role selected must be of type ALL or SHP TO or NOTIFY");
		}
		else if(partyTypeCode=='30' && addressRoleType!='ALL' && addressRoleType!='SHPFRM' && addressRoleType!='FWDAGT')
		{
			alert("Address Role selected must be of type ALL or SHPFRM or FWDAGT");
		}
		else*/
			partiesAddressUpdate(data);
	}else if (orgCaller == 'repeat') {
		var values = data.split("|");
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);
		$("#repeatContactOrgAddress").val(finalAddress);
		$("#repeatContactOrgAddress").attr('title',$("#repeatContactOrgAddress").val()+','+values[15]+','+values[16]);
		$("#repeatContactAddressRoleId").val(values[9]);
		repeatAddress = finalAddress;
	}
	else if(orgCaller == 'dataAdmin')
	{
		var values = data.split("|");
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);
		$("#existingAddressLine1").val(finalAddress);
		$("#existingAddressLine1").attr('title',$("#existingAddressLine1").val()+','+values[15]+','+values[16]);
		$("#replaceAddressRoleId").val(values[9]);
	} else if(orgCaller == 'commodityBillTo'){
		
		
		
	}
	
}

function templatePopupSearch() {
	var actionUrl = _context +'/cas/templateSearch.do?templateValue1='+prepareInputForCASTemplateScreen();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'TemplateSearch', windowStyle);
}

function templateUpdate(id,methodCaller){
	var templateNumber;
	if(id.indexOf("|") != -1){
		var splitTemplateData = id.split("|");
		templateNumber = splitTemplateData[0];
	}else{
		templateNumber = id;
	}
	var shipmentId = $('#shipmentId').val();
	var shipmentNumber = $('#shipmentNumber').val();
	$('#msgDiv').html("<div class=\"message_info\">Loading "+ templateNumber +" template...</div>");
	$('#msgDiv').show();
	if(templateNumber != undefined){
		$.ajax({
			type : "POST",
			url : _context +"/shipment/applyTemplate",
			data : {
				templateNumber : templateNumber,
				shipmentId : shipmentId,
				shipmentNumber : shipmentNumber
			},
			success : function(responseText) {
				if (responseText.messages.error.length == 0) {
					clearAndResetShipmentScreen();
					var tempEntityVersion = $("#entityVersion").val();
					var tempCommentId = $("#commentId").val();
					showJSON(responseText);
					$("#entityVersion").val(tempEntityVersion);
					$("#commentId").val(tempCommentId);
					if(methodCaller=="" || methodCaller=='shipper'){
						$('input[name="shipper\\.addressRoleId"]').val(responseText.data.shipper.addressRoleId);
						shipperAddress = responseText.data.consignee.address;
					}else{
						$('input[name="consignee\\.addressRoleId"]').val(responseText.data.consignee.addressRoleId);
						consigneeAddress = responseText.data.consignee.address;
					}
					removeAssignedQuoteOnTemplatePull();
					reloadShipmentGrids();
					//Moved to show Json method
					//requestForContactDetails("shipper", "N");
					//requestForContactDetails("consignee", "N");
					//checkCopyButtons();->already called in showJSON
					templateOwner="shipper";
					expandAll();
					//checkQuotesForPulledTemplate(id);
					setDefaultForShipmentStatus();
					var aHtml = "<div id=\"shipmentTemplateNumber\" class=\"span-2 last\"><a href=" + _context + "/shipment/template/showTemplateForm?templateNumber="+templateNumber+">" + templateNumber + "</a></div>";
					$('#shipmentTemplateNumber').html(aHtml);
					//Defect - D015881
					$('#dealerCode').val(responseText.data.shipmentTemplate.dealerCode);
					if($('#dealerCode').val()!=''){
						disableScreenForDealer();
					}else{
						enableScreenForDealer();
					}
					if($.trim($('#shipmentNumber').val()) == '') {
						$('#billOfLadingLink').html("Bill Of Lading");
						
					}
				}else{
					$("#quoteExistsDiv").hide();
					clearAndResetShipmentScreen();
					$('#customizeNameAddress').removeAttr("disabled");
					reloadShipmentGrids();
					setDefaultForShipmentStatus();
					setDefaultForAssignLink();
					clearHeaderData();
					$('#commentsDiv').hide();
					$("#shipmentDelete").attr("disabled", true);
					resetDivNames();
					$("#lastUpdateDateTimeUser").html("");
					var aHtml = "<div id=\"shipmentTemplateNumber\" class=\"span-2 last\"></div>";
					$('#shipmentTemplateNumber').html(aHtml);
				}
				//Messages
				showResponseMessages("msgDiv",responseText);
				$('#msgDiv').show();
				
				processShipperConsigneeColor("shipper");
				processShipperConsigneeColor("consignee");
			}
		});
	}
}

function disableScreenForDealer(){
/*	$('#originPortCityCodeDescription').attr('disabled',true);
	$('#destinationPortCityCodeDescription').attr('disabled',true);
	$("#consignee").gatesDisable();*/
}

function enableScreenForDealer(){
	/*$('#originPortCityCodeDescription').attr('disabled',false);
	$('#destinationPortCityCodeDescription').attr('disabled',false);
	$("#consignee").gatesEnable();
	if($('input[name="shipper\\.addressRoleId"]').val()!=''){
		$("#copyConsignee").attr("disabled", true);
	}
	$("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>"); // for defect D018789
*/}

function quoteFilterParams(){
	/*var queryString="";
	queryString = "&trade="+$('#tradeCode').val()+"&placeOfReceipt="+$('#blOriginCityCode').val() +"&placeOfDelivery="+$('#blDestinationCityCode').val()+"&pol="+$('#originPortCityCode').val()+"&pod="+$('#destinationPortCityCode').val();
	queryString = queryString + "&loadService="+$('#loadServiceCode').val()+"&dischargeService="+$('#dischargeServiceCode').val()+"&tariffNumber="+$('#tariffNumber').val();
	return queryString;*/
}

function checkQuotesForPulledTemplate(casResponse){
	/*//get owner from CAS
	var splitCASStr = casResponse.split("|");
	var templateOwner = splitCASStr[3];//casResponse[0].templateOwner;;
	//declare variable for holding AROLE id 
	var aroleIdForQuotes = "";
	var quoteShowHtml="";
	if(templateOwner=='Y' || templateOwner==''){//template owner shipper, get quote count for consignee
		//$("#shipmentTemplateOwner").val('02');
		aroleIdForQuotes = $('input[name="consignee\\.addressRoleId"]').val();
		$("#showQuoteForAroleOnTemplatePull").val($('input[name="consignee\\.addressRoleId"]').val());
		quoteShowHtml="Consignee Quote Exists(Show)";
	}else if(templateOwner=='N'){//template owner consignee, get quote count for shipper
		//$("#shipmentTemplateOwner").val('03');
		aroleIdForQuotes = $('input[name="shipper\\.addressRoleId"]').val();
		$("#showQuoteForAroleOnTemplatePull").val($('input[name="shipper\\.addressRoleId"]').val());
		quoteShowHtml="Shipper Quote Exists(Show)";
	}
	if(aroleIdForQuotes!=''){
		var quoteCount = 0;//get quote count from CS response [responseText[0]]
		//call to shipment controller to get quote count
		$.ajax({
			type : "POST",
			url : _context +"/shipment/getQuoteCount?"+quoteFilterParams(),
			data : {
				aroleId : aroleIdForQuotes
			},
			success : function(responseText) {
				quoteCount = responseText.data;
				if(quoteCount==0){
					$("#quoteExistsDiv").hide();
				}else if(quoteCount>0){
					$("#quoteExistsDiv").html(quoteShowHtml);
					$("#quoteExistsDiv").show();
				}
			}
		});
	}*/
}

function clearAndResetShipmentScreen(){
	$('#msgDiv').html("");
	//$('#shipmentForm').clearForm();
	$('input[name="shipper\\.addressRoleId"]').val("");
	$('input[name="consignee\\.addressRoleId"]').val("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
	resetDefault();
	$("#bookedDateTimeUser").html("");
	$("#lastUpdateDateTimeUser").html("");
	$('#ediServiceTypeHeader').hide();
	$('#ediServiceType').html("");
	
}
function removeAssignedQuoteOnTemplatePull(){
	/*$('#quoteId').val("");
	$('#quoteNumber').val("");
	$('#quoteVersion').val("");
	$('#quoteNumberLabel').text("");
	$('#quoteAmount').val("");
	$('#quoteAmountDiv').text("");
	if($("#shipmentNumber").val() == '' || $("#shipmentNumber").val() == null){
		$('#assignLink').html("Assign Quote");
	}else{
		$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
	}*/
}

function loadAdditionalShipperDetails(responseText){
	$("#shipperId").val(responseText.data.shipper.organizationId);
	$('#shipper\\.addressRoleId').val(responseText.data.shipper.addressRoleId);
	if(null!=responseText.data.shipper.addressRoleId){
		enableDisableContactId('shipper',false);
		//enableDisableAddress('shipper');
	}
	setShipperCommMethodValue(responseText.data.shipper);
	//first clear the drop down
	$('select[name="shipper\\.contactId"]').children().remove();
	$('select[name="shipper\\.contactId"]').append("<option value='' label='Select'></option>");
	$.each(responseText.data.shipper.contactList, function(key, value) {
		$('select[name="shipper\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
	$('input[name="shipper\\.organizationName"]').attr('title',responseText.data.shipper.organizationName);
	
	/*if(responseText.data.shipper.isCustomerOneTimeCust==true){
		formatColorForOneTime('shipper');
	}*/
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	// we are getting null as String('null') from AddressRoleLookup , so we are also checking && nameQualifier != 'null'  for defect --16831 
	if (nameQualifier != "" && nameQualifier != 'null') { 
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "" ) {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "" && city != 'null') {
		cityTemp = " - " + city;
	}
	if (state != "" && state != 'null') {
		stateTemp = ", " + state;
	} 
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

/*function formatColorForOneTime(source){
	//$('input[name="'+source+'\\.organizationName"]').css('background-color', 'yellow');
	$('input[name="'+source+'\\.address"]').attr("disabled",true);
}*/

function addShipperAsDebtor(){
	
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		url : _context +"/shipment/party/setDefaults",
		type : "POST",
		data : queryString+"&type=shipper&oper=add",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			/*if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('B');//both
			else if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()=='')
				$('#prepaidCollectCode').val('P');//shipper
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
}

function removeShipperAsDebtor(){
	var queryString = $('#shipmentForm').formSerialize();
	/*$.ajax({
		url : _context +"/shipment/party/setDefaults",
		type : "POST",
		data : queryString+"&type=shipper&oper=remove",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			if($('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('C');//collect
			else
				$('#prepaidCollectCode').val('');//none
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});*/
	$("#gridIdForParties").trigger("reloadGrid");
}



function requestForContactList(source){
	enableDisableContactId(source,false);
	if(null!=$('input[name="'+source+'\\.addressRoleId"]').val() && $('input[name="'+source+'\\.addressRoleId"]').val()!=''){
		$.ajax({
			type : "POST",
			url : _context +"/shipment/arole/getContactList",
			data : {
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val()
			},
			success : function(responseText) {
				$('select[name="'+source+'\\.contactId"]').children().remove();
				$('select[name="'+source+'\\.contactId"]').append("<option value='' label='Select'></option>");
				$.each(responseText.data.contactList, function(key,
						value) {
					$('select[name="'+source+'\\.contactId"]')
							.append($("<option/>", {
								value : key,
								text : value
							}));
				});
				//$('select[name="'+source+'\\.contactId"]').attr('selectedIndex', 0);
				requestForContactDetails(source);
				setIsRefNumberRequiredShipper();
				setIsRefNumberRequiredConsignee();
			}
		});
	}
}

function requestForContactDetails(source, change){
	emptyContactDetailsOnContactChange(source);
	enableDisableContactId(source,false);
	if($('select[name="'+source+'\\.contactId"]').val()!='')
	{
		$.ajax({
			type : "POST",
			url : _context +"/shipment/arole/contact",
			data : {
				contactId : $('select[name="'+source+'\\.contactId"]').val()
			},
			success : function(responseText) {
				var oneTimeCustomer = $('input[name="'+source+'\\.isOneTimeCustomer"]').val();
				//$('select[name="'+source+'\\.contact"]').val($('select[name="'+source+'\\.contactId"]').selected().val());
				$("#"+source+"").loadJSON(responseText.data);
				setCommMethodValue(responseText.data, source);
				setphoneCountryCode(source); // for populationg phone country code.
				$('input[name="shipper\\.contactEmailAddress"]').attr('title',$('input[name="shipper\\.contactEmailAddress"]').val());
				$('input[name="consignee\\.contactEmailAddress"]').attr('title',$('input[name="consignee\\.contactEmailAddress"]').val());				
				$('input[name="'+source+'\\.isOneTimeCustomer"]').val(oneTimeCustomer);
				$('input[name="'+source+'\\.contact"]').val('');
				if(change!="N")
				{
					/*if(source=='shipper')
						addShipperAsDebtor();
					else if(source=='consignee')
						addConsigneeAsDebtor();*/
				}
			}
		});
		
	}
	else if($('select[name="'+source+'\\.contactId"]').attr("disabled")== true
			|| $('select[name="'+source+'\\.contactId"]').attr("disabled")== 'true')
	{
		if(change!="N")
		{
			/*if(source=='shipper')
				addShipperAsDebtor();
			else if(source=='consignee')
				addConsigneeAsDebtor();*/
		}
	}
	$('input[name="contact"]').validationEngine('hidePrompt');
	
	
}

function emptyCityStateZip(source){
	$('input[name="'+ source +'\\.careOf"]').val("");
	$('input[name="'+ source +'\\.city"]').val("");
	$('input[name="'+ source +'\\.state"]').val("");
	$('input[name="'+ source +'\\.zip"]').val("");
	$('input[name="'+ source +'\\.countryName"]').val("");
	$('input[name="'+ source +'\\.provinceName"]').val("");
}

function emptyContactDetails(source){
	$('select[name="'+ source +'\\.contactId"]').children().remove();
	$('select[name="'+ source +'\\.contactId"]').append("<option value='' label='Select'></option>");
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
	$('input[name="'+ source +'\\.contactFaxExtension"]').val("");

	$('input[name="'+ source +'\\.contactCellCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactCellAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactCellExchange"]').val("");
	$('input[name="'+ source +'\\.contactCellStation"]').val("");
	$('input[name="'+ source +'\\.contactCellExtension"]').val("");

	$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExchange"]').val("");
	$('input[name="'+ source +'\\.contactPhoneStation"]').val("");
	$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExtension"]').val("");

	$('input[name="'+ source +'\\.contactEmailAddress"]').val("");
	//$('input[name="'+ source +'\\.communicationMethodCode"]').val("");
	setDefaultPrefMethod(source);
}

function getPrefCommMethod(fieldOwner){
	var prefCommMethod = '';
	if($('#'+fieldOwner+'Comm1').attr('checked')){
		prefCommMethod = $('#'+fieldOwner+'Comm1').val();
	}else if($('#'+fieldOwner+'Comm2').attr('checked')){
		prefCommMethod = $('#'+fieldOwner+'Comm2').val();
	}else if($('#'+fieldOwner+'Comm3').attr('checked')){
		prefCommMethod = $('#'+fieldOwner+'Comm3').val();
	}else if($('#'+fieldOwner+'Comm4').attr('checked')){
		prefCommMethod = $('#'+fieldOwner+'Comm4').val();
		$('input[name="'+fieldOwner+'\\.contactEmailAddress"]').addClass("validate[custom[email]] text-input");
	}else{
		prefCommMethod = '';
	}
	return prefCommMethod;
}

function openDivBlock(){
	document.getElementById('maintainShipmentShipperConsignee').style.display = 'block';
	window.scrollTo(0, 180);
}

function validateContactForShipperConsignee(source){
	var isValid = true;
	// Defect 25151
	if($("#tradeCode").val()=="F")
		return isValid;
	
	if($('input[name="'+source+'\\.addressRoleId"]').val()!=''){
		// D026028, Commented for making contact non-mandatory for shipper and consignee.
		/*if(($('input[name="'+source+'\\.contact"]').val()=='' || $('input[name="'+source+'\\.contact"]').val()==null)){
			if(source=='shipper' && $('#shipperContactId').val()=='')
			{
				openDivBlock();
				isValid = false;
				$('input[name="'+source+'\\.contact"]').validationEngine('showPrompt', 'Please provide contact name.', 'error', 'topRight', true);
				return isValid;
			}
			else if(source=='consignee'&& $('#consigneeContactId').val()=='' )
			{
				openDivBlock();
				isValid = false;
				$('input[name="'+source+'\\.contact"]').validationEngine('showPrompt', 'Please provide contact name.', 'error', 'topRight', true);
				return isValid;
			}
	
		}*/
		var prefMethod = getPrefCommMethod(source);
		
		/*
		 * code commented as per defect 21928
		 * In which second point of customer states that nothing is necessary when user 
		 * provides customer name on its own.
		 * puneet hasija
		 */
		/*if(!isContactSelectedFromDropDown(source) && $('input[name="'+source+'\\.contact"]').val()!='' && prefMethod==''){
			openDivBlock();
			$('#'+source+'Comm1').validationEngine('showPrompt', 'Please select preferred method.', 'error', 'topRight', true);
			isValid = false;
			if(!isValid)
				return isValid;
		}*/
		
		/*phone is neither default */
		/*isValid = validateContactLine('P',source,'Phone');
		if(!isValid)
			return isValid;*/
		
		if(prefMethod=='P'){
			isValid = validateContactLine(prefMethod,source,'Phone');
			if(!isValid)
				return isValid;
		}else if(prefMethod=='C'){
			isValid = validateContactLine(prefMethod,source,'Cell');
			if(!isValid)
				return isValid;
		}else if(prefMethod=='F'){
			isValid = validateContactLine(prefMethod,source,'Fax');
			if(!isValid)
				return isValid;
		}else if(prefMethod=='E' && $('input[name="'+source+'\\.contactEmailAddress"]').val()==''){
			openDivBlock();
			//$('#'+source+'Comm4').validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
			$('input[name="'+source+'\\.contactEmailAddress"]').validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
			isValid = false;
			if(!isValid)
				return isValid;
		}
		if(isValid){
			isValid = validateUnPref(source);
		}
	}else{
		$('#'+source+'OrganizationName').validationEngine('showPrompt', 'Customer is required', 'error', 'topRight', true);
		openDivBlock();
		isValid=false;
	}
	return isValid;
}

function validateOrganisationAndAddressForShipperConsignee(source){
	var isValid = true;
	if($('input[name="'+source+'\\.organizationName"]').val()=='' || $('input[name="'+source+'\\.organizationName"]').val()==null){
		$('input[name="'+source+'\\.organizationName"]').validationEngine('showPrompt', 'Customer is required', 'error', 'topRight', true);
		openDivBlock();
		isValid=false;
	}
	if($('input[name="'+source+'\\.address"]').val()=='' || $('input[name="'+source+'\\.address"]').val()==null){
		$('input[name="'+source+'\\.address"]').validationEngine('showPrompt', 'Address is required', 'error', 'topRight', true);
		openDivBlock();
		isValid=false;
	}
	return isValid;
}

function isContactSelectedFromDropDown(source){
	if($('select[name="'+source+'\\.contactId"] option').length==0 || $('select[name="'+source+'\\.contactId"] :selected').val()=='' || $('select[name="'+source+'\\.contactId"] :selected').val()=='Select'){
		return false;
	}
	return true;
}

function validateContactLine(prefMethod,source,contactField){
	var isValid = true;
	var areaCode = '', exchange='',station='',countryCode='';
	var isFieldPrefMethod=false;
	if(prefMethod=='P' && contactField=='Phone'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactPhoneAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactPhoneExchange"]').val();
		station = $('input[name="'+source+'\\.contactPhoneStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactPhoneCountryCode"]').val();
		if(countryCode=="")
		{
			var defaultCountryCode=getDefaultValueforCountrycode(source);
			$('input[name="'+source+'\\.contactPhoneCountryCode"]').val(defaultCountryCode);
			countryCode=$('input[name="'+source+'\\.contactPhoneCountryCode"]').val();
		}
		isValid = validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, source, contactField);
	}else if(prefMethod=='C' && contactField=='Cell'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactCellAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactCellExchange"]').val();
		station = $('input[name="'+source+'\\.contactCellStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactCellCountryCode"]').val();
		if(countryCode=="")
		{
			var defaultCountryCode=getDefaultValueforCountrycode(source);
			$('input[name="'+source+'\\.contactCellCountryCode"]').val(defaultCountryCode);
			countryCode=$('input[name="'+source+'\\.contactCellCountryCode"]').val();
		}
		isValid = validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, source, contactField);
	}else if(prefMethod=='F' && contactField=='Fax'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactFaxAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactFaxExchange"]').val();
		station = $('input[name="'+source+'\\.contactFaxStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactFaxCountryCode"]').val();
		if(countryCode=="")
		{
			var defaultCountryCode=getDefaultValueforCountrycode(source);
			$('input[name="'+source+'\\.contactFaxCountryCode"]').val(defaultCountryCode);
			countryCode=$('input[name="'+source+'\\.contactFaxCountryCode"]').val();
		}
		isValid= validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, source, contactField);
	}
	return isValid;
}

function getDefaultValueforCountrycode(source)
{
	var defaultCountryCode="";
	$.ajax({
		async: false,
		type : "POST",
		url : _context +"/shipment/phoneCountryCode",
		data : {
			addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val()
		},
		success : function(responseText) {
			defaultCountryCode=responseText.data;
		}
	});
	return defaultCountryCode;
}

function validateFieldData(isFieldPrefMethod,areaCode,exchange,station,countryCode,source,contactField){
	var isValid = true;
	

		// Defect 24095
	    // Changed code to skip validation for trade code F
	
	if($("#tradeCode").val()=="F"){
		return isValid;
	}


	if(countryCode=='' || (countryCode =='1' | countryCode=='01' || countryCode=='us' || countryCode=='united states')){
		//for Defect -- D016968 -- start
			isValid= validateCountryCodeData(source,contactField,countryCode );
		//for Defect -- D016968 -- end
		if(areaCode == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		} 
		else if(areaCode.length!=3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is always a 3 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		
		if(exchange == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		} 
		else if(exchange.length!=3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is always a 3 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		
		if(station == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}
		else if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		//for Defect -- D016968 -- start
			isValid= validateCountryCodeData(source,contactField,countryCode );
		//for Defect -- D016968 -- end
		if(areaCode == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}else if(areaCode.length < 2 || areaCode.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		if(exchange == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}else if(exchange.length < 3 || exchange.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number', 'error', 'topRight', true);
			isValid = false;
		}
		if(station == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}
		else if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
	}
	return isValid;
}

function isUnPrefDetailsEmpty(source,field){
	var isEmpty = true;
	var areaCode = $('input[name="'+source+'\\.contact'+field+'AreaCode"]').val();
	var exchange = $('input[name="'+source+'\\.contact'+field+'Exchange"]').val();
	var station = $('input[name="'+source+'\\.contact'+field+'Station"]').val();
	var countryCode = $('input[name="'+source+'\\.contact'+field+'CountryCode"]').val();
	
	//setting default value for country code -- puneet hasija
	if(countryCode==""&&(station!=""||exchange!=""||areaCode!=""))
	{
		var defaultCountryCode=getDefaultValueforCountrycode(source);
		$('input[name="'+source+'\\.contact'+field+'CountryCode"]').val(defaultCountryCode);
		countryCode=defaultCountryCode;
	}
	// Changes Done for Defect -- D016968 -- start
	if(field!="Phone"){
	if(areaCode!='' || exchange!='' || station!='' || countryCode!=''){
		isEmpty = false;
		return isEmpty;
	}
	}else{
		if(areaCode!='' || exchange!='' || station!=''){
			isEmpty = false;
			return isEmpty;
		}
	}
	// Changes Done for Defect -- D016968 -- End
	return isEmpty;
}

function validateUnPref(source){
	var isValid = true;
	var pref = getPrefCommMethod(source);
	if(pref=='P'){
		var isEmpty = isUnPrefDetailsEmpty(source, 'Cell');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Cell');
			if(!isValid)
				return isValid;
		}
		var isEmpty = isUnPrefDetailsEmpty(source, 'Fax');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Fax');
			if(!isValid)
				return isValid;
		}
	}else if(pref=='C'){
		var isEmpty = isUnPrefDetailsEmpty(source, 'Phone');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Phone');
			if(!isValid)
				return isValid;
		}
		var isEmpty = isUnPrefDetailsEmpty(source, 'Fax');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Fax');
			if(!isValid)
				return isValid;
		}
	}else if(pref=='F'){
		var isEmpty = isUnPrefDetailsEmpty(source, 'Phone');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Phone');
			if(!isValid)
				return isValid;
		}
		var isEmpty = isUnPrefDetailsEmpty(source, 'Cell');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Cell');
			if(!isValid)
				return isValid;
		}
	}else if(pref=='E'){
		var isEmpty = isUnPrefDetailsEmpty(source, 'Phone');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Phone');
			if(!isValid)
				return isValid;
		}
		var isEmpty = isUnPrefDetailsEmpty(source, 'Cell');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Cell');
			if(!isValid)
				return isValid;
		}
		var isEmpty = isUnPrefDetailsEmpty(source, 'Fax');
		if(!isEmpty){
			isValid = validateFieldDataUnPref(source, 'Fax');
			if(!isValid)
				return isValid;
		}
	}
	return isValid;
}

function validateFieldDataUnPref(source,contactField){
	var isValid = true;
	var areaCode = $('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').val();
	var exchange = $('input[name="'+source+'\\.contact'+contactField+'Exchange"]').val();
	var station = $('input[name="'+source+'\\.contact'+contactField+'Station"]').val();
	var countryCode = $('input[name="'+source+'\\.contact'+contactField+'CountryCode"]').val();
	
	if(countryCode=='' || (countryCode =='1' | countryCode=='01' || countryCode=='us' || countryCode=='united states')){
		//for Defect -- D016968 -- start
			isValid= validateCountryCodeData(source,contactField,countryCode );
		//for Defect -- D016968 -- end
		if(areaCode.length!=3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is always a 3 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		if(exchange.length!=3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is always a 3 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		//for Defect -- D016968 -- start
			isValid = validateCountryCodeData(source,contactField,countryCode );
		//for Defect -- D016968 -- end
		if(areaCode.length < 2 || areaCode.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		if(exchange.length < 3 || exchange.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number', 'error', 'topRight', true);
			isValid = false;
		}
		if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
	}
	return isValid;
}

function updateShipperConsigneeNames(responseText){
	if(null==responseText.data.shipper.organizationName)
		responseText.data.shipper.organizationName="";
	if(null==responseText.data.consignee.organizationName)
		responseText.data.consignee.organizationName="";
	$("#shipperConsigneeNameDiv").html("<div style=\"float:left;\" id=\"shipperDiv\"><b>Shipper "+ responseText.data.shipper.organizationName +" </div><div id=\"consigneeDiv\" >&nbsp;&nbsp;&nbsp;&nbsp;Consignee "+ responseText.data.consignee.organizationName +"</div></b>");
}

function clearShipperConsignee() {
	$('input[name="shipper\\.addressRoleId"]').val("");
	$('input[name="consignee\\.addressRoleId"]').val("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
}

function setShipperCommMethodValue(shipper) {
	if (shipper.communicationMethodCode == 'P') {
		$('#shipperComm1').attr('checked', true);
		$('#shipperComm1').val("P");
	} else if (shipper.communicationMethodCode == 'C') {
		$('#shipperComm2').attr('checked', true);
		$('#shipperComm2').val("C");
	} else if (shipper.communicationMethodCode == 'F') {
		$('#shipperComm3').attr('checked', true);
		$('#shipperComm3').val("F");
	} else if (shipper.communicationMethodCode == 'E') {
		$('#shipperComm4').attr('checked', true);
		$('#shipperComm4').val("E");
	}
}

function setCommMethodValue(source, caller) {
	if (source.communicationMethodCode == 'P') {
		$('#'+caller+'Comm1').attr('checked', true);
		$('#'+caller+'Comm1').val("P");
	} else if (source.communicationMethodCode == 'C') {
		$('#'+caller+'Comm2').attr('checked', true);
		$('#'+caller+'Comm2').val("C");
	} else if (source.communicationMethodCode == 'F') {
		$('#'+caller+'Comm3').attr('checked', true);
		$('#'+caller+'Comm3').val("F");
	} else if (source.communicationMethodCode == 'E') {
		$('#'+caller+'Comm4').attr('checked', true);
		$('#'+caller+'Comm4').val("E");
	}
}

function showWarningIfAroleChangeAndRefNumberRequiredShipper(){
	var isRefNumberRequired = $('input[name="shipper\\.isReferenceNumberRequired"]').val();
	if (isRefNumberRequired=='Y') {
		var refExist =validateRefNumberRequiredShipper();
		if (refExist==false) {
			$.unblockUI();
			alert("Shipper requires reference number.");
		}
	}
}

function setIsRefNumberRequiredShipper(){
	$.ajax({
		async: false,
		type : "GET",
		url : _context +"/shipment/referenceNumberRequiredOnAddressRoleChange",
		data : {
			addressRoleId : $('input[name="shipper\\.addressRoleId"]').val(),
			shipperConsignee:'S',
			trade: $('#tradeCode').val()
		},
		success : function(responseText) {
			$('input[name="shipper\\.isReferenceNumberRequired"]').val(responseText.data);
		},
		error : function(responseText){
			$('input[name="shipper\\.isReferenceNumberRequired"]').val('N');
		}
	});
}
	// for Defect -- D016968 -- Start
	function validateCountryCodeData(source,contactField,countryCode){
		var isValid=true;
		if(countryCode.length==0){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'CountryCode"]').validationEngine('showPrompt', 'Country Code is Required.', 'error', 'topRight', true);
			isValid = false;
		}
		if(countryCode.length>3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'CountryCode"]').validationEngine('showPrompt', 'Country Code should be 3 digit max', 'error', 'topRight', true);
			isValid = false;
		}
		if( parseInt(countryCode)==0){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'CountryCode"]').validationEngine('showPrompt', 'Country Code should not be 0', 'error', 'topRight', true);
			isValid = false;
		}
		return  isValid;
	}
	// for Defect -- D016968 -- End

	function setphoneCountryCode(source){
		$.ajax({
			async: false,
			type : "POST",
			url : _context +"/shipment/phoneCountryCode",
			data : {
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val()
			},
			success : function(responseText) {
				if($('input[name="'+source+'\\.contactPhoneCountryCode"]').val()==''){
					$('input[name="'+source+'\\.contactPhoneCountryCode"]').val(responseText.data);
				}
			}
		});
	}
	
	//Code Addition start for defect -D018433

	function trimContactOnChange(source){
		$('input[name="'+ source +'\\.contact"]').change(function() {
			$('input[name="'+ source +'\\.contact"]').val($.trim($('input[name="'+ source +'\\.contact"]').val()));
			checkOneTimerCustomer(source);
		});
		$('input[name="'+ source +'\\.contactEmailAddress"]').change(function() {
			$('input[name="'+ source +'\\.contactEmailAddress"]').val($.trim($('input[name="'+ source +'\\.contactEmailAddress"]').val()));
			$('input[name="'+ source +'\\.contactEmailAddress"]').attr('title',$('input[name="'+ source +'\\.contactEmailAddress"]').val());
		});
		$('input[name="'+ source +'\\.contactFaxCountryCode"]').change(function() {
			$('input[name="'+ source +'\\.contactFaxCountryCode"]').val($.trim($('input[name="'+ source +'\\.contactFaxCountryCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactFaxAreaCode"]').change(function() {
			$('input[name="'+ source +'\\.contactFaxAreaCode"]').val($.trim($('input[name="'+ source +'\\.contactFaxAreaCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactFaxExchange"]').change(function() {
			$('input[name="'+ source +'\\.contactFaxExchange"]').val($.trim($('input[name="'+ source +'\\.contactFaxExchange"]').val()));
		});
		$('input[name="'+ source +'\\.contactFaxStation"]').change(function() {		
			$('input[name="'+ source +'\\.contactFaxStation"]').val($.trim($('input[name="'+ source +'\\.contactFaxStation"]').val()));
		});
		$('input[name="'+ source +'\\.contactFaxExtension"]').change(function() {
			$('input[name="'+ source +'\\.contactFaxExtension"]').val($.trim($('input[name="'+ source +'\\.contactFaxExtension"]').val()));
		});
		$('input[name="'+ source +'\\.contactCellCountryCode"]').change(function() {
			$('input[name="'+ source +'\\.contactCellCountryCode"]').val($.trim($('input[name="'+ source +'\\.contactCellCountryCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactCellAreaCode"]').change(function() {
			$('input[name="'+ source +'\\.contactCellAreaCode"]').val($.trim($('input[name="'+ source +'\\.contactCellAreaCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactCellExchange"]').change(function() {
			$('input[name="'+ source +'\\.contactCellExchange"]').val($.trim($('input[name="'+ source +'\\.contactCellExchange"]').val()));
		});
		$('input[name="'+ source +'\\.contactCellStation"]').change(function() {
			$('input[name="'+ source +'\\.contactCellStation"]').val($.trim($('input[name="'+ source +'\\.contactCellStation"]').val()));
		});
		$('input[name="'+ source +'\\.contactCellExtension"]').change(function() {
			$('input[name="'+ source +'\\.contactCellExtension"]').val($.trim($('input[name="'+ source +'\\.contactCellExtension"]').val()));
		});
		$('input[name="'+ source +'\\.contactPhoneAreaCode"]').change(function() {
			$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val($.trim($('input[name="'+ source +'\\.contactPhoneAreaCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactPhoneExchange"]').change(function() {
			$('input[name="'+ source +'\\.contactPhoneExchange"]').val($.trim($('input[name="'+ source +'\\.contactPhoneExchange"]').val()));
		});
		$('input[name="'+ source +'\\.contactPhoneStation"]').change(function() {
			$('input[name="'+ source +'\\.contactPhoneStation"]').val($.trim($('input[name="'+ source +'\\.contactPhoneStation"]').val()));
		});
		$('input[name="'+ source +'\\.contactPhoneCountryCode"]').change(function() {
			$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val($.trim($('input[name="'+ source +'\\.contactPhoneCountryCode"]').val()));
		});
		$('input[name="'+ source +'\\.contactPhoneExtension"]').change(function() {
			$('input[name="'+ source +'\\.contactPhoneExtension"]').val($.trim($('input[name="'+ source +'\\.contactPhoneExtension"]').val()));
		});
		
	}
	//Code Addition end for defect -D018433
	//code addition start for defect --D018373
	function hidePromptForUiFields(source){
		if((source=='shipper')|| (source=='consignee')){
		$('input[name="'+ source +'\\.contact"]').validationEngine('hidePrompt');
/*		$('input[name="'+ source +'\\.contactEmailAddress"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactFaxCountryCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactFaxAreaCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactFaxExchange"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactFaxStation"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactFaxExtension"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactCellCountryCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactCellAreaCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactCellExchange"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactCellStation"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactCellExtension"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactPhoneAreaCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactPhoneExchange"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactPhoneStation"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactPhoneCountryCode"]').validationEngine('hidePrompt');
		$('input[name="'+ source +'\\.contactPhoneExtension"]').validationEngine('hidePrompt');*/
		}
		else if(source=='parties'){
		$('input[name="contact"]').validationEngine('hidePrompt');
		/*$('input[name="contactEmailAddress"]').validationEngine('hidePrompt');
		$('input[name="contactFaxCountryCode"]').validationEngine('hidePrompt');
		$('input[name="contactFaxAreaCode"]').validationEngine('hidePrompt');
		$('input[name="contactFaxExchange"]').validationEngine('hidePrompt');
		$('input[name="contactFaxStation"]').validationEngine('hidePrompt');
		$('input[name="contactFaxExtension"]').validationEngine('hidePrompt');
		$('input[name="contactCellCountryCode"]').validationEngine('hidePrompt');
		$('input[name="contactCellAreaCode"]').validationEngine('hidePrompt');
		$('input[name="contactCellExchange"]').validationEngine('hidePrompt');
		$('input[name="contactCellStation"]').validationEngine('hidePrompt');
		$('input[name="contactCellExtension"]').validationEngine('hidePrompt');
		$('input[name="contactPhoneAreaCode"]').validationEngine('hidePrompt');
		$('input[name="contactPhoneExchange"]').validationEngine('hidePrompt');
		$('input[name="contactPhoneStation"]').validationEngine('hidePrompt');
		$('input[name="contactPhoneCountryCode"]').validationEngine('hidePrompt');
		$('input[name="contactPhoneExtension"]').validationEngine('hidePrompt');*/
		}
	}
	//code addition end for defect --D018373
	function handlePrepaidCollectIndicator(caller){
/*	switch(caller){
		case 'S':
			if($('#prepaidCollectCode').val()=='P'){
				$('#prepaidCollectCode').val('');
				$('#prepaidCollectCode').trigger('change');
			}
			else if($('#prepaidCollectCode').val()=='B'){
				$('#prepaidCollectCode').val('C');
				$('#prepaidCollectCode').trigger('change');
			}
			break;
		case 'C':
			if($('#prepaidCollectCode').val()=='C'){
				$('#prepaidCollectCode').val('');
				$('#prepaidCollectCode').trigger('change');
			}
			else if($('#prepaidCollectCode').val()=='B'){
				$('#prepaidCollectCode').val('P');
				$('#prepaidCollectCode').trigger('change');
			}
			break;
		default:
			break;
	}*/
	}
	
	function checkAccordionHeaderForShipper()
	{
		if($('input[name="shipper\\.addressRoleId"]').val()!='')
			setAccordianTabDetails("shipperNameDiv", " - "+$('input[name="shipper\\.organizationName"]').val());
		else
			setAccordianTabDetails("shipperNameDiv", "");
	}
	function removeShipmentErrorPointers(){
		$("#shipmentForm").validationEngine('hideAll');
	}
	
	function checkOneTimerCustomer(field)
	{
		var isOneTimerCustomer=false;
		if($('input[name="'+field+'\\.isOneTimeCustomer"]').val()=="true"|| $('input[name="'+field+'\\.isOneTimeCustomer"]').val()==true)
		{
			isOneTimerCustomer=true;
		}
		else
		{
			isOneTimerCustomer=false;
		}
		if(!isOneTimerCustomer)
		{
			if(field=="consignee")
			{
				//regular customer and non cp contact = enable
				if($('#consigneeContactId').val()==''||$('#consigneeContactId').val()==undefined)
				{
					$('input[name="'+field+'\\.repeatContact"]').attr("disabled",false);
				}
				else
				{
					$('input[name="'+field+'\\.repeatContact"]').attr("disabled",true);
				}
			}
			else
			{
				//regular customer and non cp contact = enable
				if($('#shipperContactId').val()==''||$('#shipperContactId').val()==undefined)
				{
					$('input[name="'+field+'\\.repeatContact"]').attr("disabled",false);
				}
				else
				{
					$('input[name="'+field+'\\.repeatContact"]').attr("disabled",true);
				}
			}
		}
		//one timer customer no need to check always disable
		else
		{
			$('input[name="'+field+'\\.repeatContact"]').attr("disabled",true);
		}
		
	}
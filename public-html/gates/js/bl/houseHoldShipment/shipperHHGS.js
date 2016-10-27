var shipperAddress = "";
var templateCaller ="";

$(function() {
	
	//$('#shipmentForm').validationEngine('attach');
	$("#copyShipper").attr("disabled", true);
	//enableDisableContactId('shipper',true);
	setDefaultPrefMethod('shipper');
	
	shipperOrgPredictive();
	shipperAddressPredictive();
	
	// Shipper Pop-Up Search
	$('input[name="shipper\\.organizationName"]').gatesPopUpSearch({
		func : function() {
			//shipperPopupSearch();
			shipperAddressPopupSearch();
		}
	});

	// Shipper address Pop-Up Search
	/*$('input[name="shipper\\.address"]').gatesPopUpSearch({
		func : function() {
			shipperAddressPopupSearch();
		}
	});*/
	
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
			$('input[name="shipper\\.addressRoleId"]').val("");
			resetTrade();
			
			var source = "shipper";
			$('input[name="'+source+'\\.isOneTimeCustomer"]').val("");
			//shipperAddressPredictive();
		}
		
		$('input[name="shipper\\.address"]').val("");
		processShipperConsigneeColor("shipper");
		$('input[name="shipper\\.address"]').trigger('change');
	});

	$('input[name="shipper\\.address"]').change(function() {
		//alert("sa->"+shipperAddress + " field->" + $('input[name="shipper\\.address"]').val());
		if(shipperAddress!=$('input[name="shipper\\.address"]').val())
		{
			$('input[name="shipper\\.address"]').val('');
			shipperAddress = '';
			emptyCityStateZip("shipper");
			emptyContactDetails("shipper");
			processShipperConsigneeColor("shipper");
			$('input[name="shipper\\.addressRoleId"]').val("");
			$("#copyShipper").attr("disabled", true);
			removeShipperAsDebtor();
			
		}
		
		if($('input[name="consignee\\.organizationName"]').val()!='' 
			&& $('input[name="shipper\\.organizationName"]').val()==''){
			$("#copyConsignee").attr("disabled", false);
		}
		
	});

	// get contact details for selected contact id
	$('select[name="shipper\\.contactId"]').change(function() {
		if($('select[name="shipper\\.contactId"]').val()!=null 
			&& $('select[name="shipper\\.contactId"]').val()!=''){
			requestForContactDetails("shipper", "N");
		}
	});

	//Copy Shipper to Consignee
	$('#copyShipper').click(function() {
		if ($('input[name="shipper\\.organizationName"]').val() != '' && $('input[name="consignee\\.organizationName"]').val() == '') {
			$('input[name="consignee\\.organizationName"]').val($('input[name="shipper\\.organizationName"]').val());
			$('#consigneeName').val($('input[name="shipper\\.organizationName"]').val());
			$('input[name="consignee\\.address"]').val($('input[name="shipper\\.address"]').val());
			consigneeAddress = $('input[name="shipper\\.address"]').val();
			$('input[name="consignee\\.city"]').val($('input[name="shipper\\.city"]').val());
			$('input[name="consignee\\.state"]').val($('input[name="shipper\\.state"]').val());
			$('input[name="consignee\\.zip"]').val($('input[name="shipper\\.zip"]').val());
			
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
			
			addConsigneeAsDebtor();
			//consigneeOrgPredictive();
			//consigneeAddPredictive();
		}
	});

	$('#shipperRepeatContact').click(function(){
		if($("#shipmentStatusCode").val()=='CANC'){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		if($('select[name="shipper\\.contactId"]').selected().val()!='')
		{
			repeatCaller ="shipper";
			
			$('#originalOrgName').val($('input[name="shipper\\.organizationName"]').val());
			$('#originalOrgAddress').val($('input[name="shipper\\.address"]').val()/* Defect 17655 +" - "+ $('input[name="shipper\\.city"]').val() +" , "+ $('input[name="shipper\\.state"]').val()*/);
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$('#repeatContactShipmentSeqNo').val($('#shipmentSequenceNumber').val());
			$('#repeatContactShipmentCorrNo').val($('#shipmentCorrectionNumber').val());
			$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
			$("#repeatContactOriginalAroleId").val($('input[name="shipper\\.addressRoleId"]').val());
			$("#repeatContactNameLabel").html($("select[name='shipper\\.contactId'] option:selected").text());
			$("#repeatContactId").html($('select[name="shipper\\.contactId"]').html());
			$("#repeatContactId").selected().val($('select[name="shipper\\.contactId"]').selected().val());
			
			$("#repeatContactOverlay").dialog('open');
		}
		else
			alert("Please select a contact first");
	});
	
	/*$('#shiConTestDiv').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
	
	/*$('input[name="shipper\\.organizationName"]').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
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
			select : function(data) {
				$('input[name="shipper\\.organizationName"]').val(data.name + "-" + data.abbr);
				$('#shipperName').val($('input[name="shipper\\.organizationName"]').val());
				$('input[name="shipper\\.organizationCode"]').val(data.abbr);
				$('input[name="shipper\\.organizationId"]').val(data.id);

				shipperId = data.id;
				$('select[name="shipper\\.contactId"]').children().remove();
				$("#shipperAddressRoleName").val("");

				$('input[name="shipper\\.address"]').val("");
				$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
				processShipperConsigneeColor("shipper");
				emptyCityStateZip("shipper");
				emptyContactDetails("shipper");

				if($('#consigneeName').val()!=''){
					$("#copyConsignee").attr("disabled", true);
				}
				populateTrade(data.trade);
				
				singleAddressSelect();
				//shipperAddressPredictive();
				//shipperAddressPopupSearch();
			}
		});
}

function singleAddressSelect(){
	
	$.ajax({
		type : "POST",
	
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+$('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val(),						
		
		success : function(responseText) {
			
			if(responseText.length == 1){
				
				$('input[name="shipper\\.city"]').val(responseText[0].city);
				$('input[name="shipper\\.state"]').val(responseText[0].state);
				$('input[name="shipper\\.zip"]').val(responseText[0].zip);
				var finalAddress = formatAddRoleDscrForSC(responseText[0].nameQual,responseText[0].stAdd,"","");//nameQualifier, addressLine1, city, state)
				$('input[name="shipper\\.address"]').val(finalAddress);
				shipperAddress = finalAddress;
				$('input[name="shipper\\.addressRoleId"]').val(responseText[0].addRole);
				emptyContactDetails("shipper");
				if($('#shipmentTypeCode').val()=='B'){
					checkForShipperTemplate();
				}else{
					requestForContactList("shipper");
				}
				
				setShipperDivName(" - "+$('input[name="shipper\\.organizationName"]').val());
				
				
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
				var nameQualifier = data.nameQual;
				var city = data.city;
				var state = data.state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, "", "");
				shipperAddress = finalAddress;
				$('input[name="shipper\\.addressRoleId"]').val(data.addRole);
				$('input[name="shipper\\.city"]').val(data.city);
				$('input[name="shipper\\.state"]').val(data.state);
				$('input[name="shipper\\.zip"]').val(data.zip);
				
				$("#shipperAddressRoleName").val($('input[name="shipper\\.address"]').val());

				if(data.addType=='ALL' && $('input[name="consignee\\.organizationName"]').val()=='')
					$("#copyShipper").attr("disabled", false);
				else
					$("#copyShipper").attr("disabled", true);
				
				if($('#shipmentTypeCode').val()=='B')
					checkForShipperTemplate();
				else
					requestForContactList("shipper");
				
				setAccordianTabDetails("shipperNameDiv", " - "+$('input[name="shipper\\.organizationName"]').val());
				$('#refNumOverRideForShipper').val("N");
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
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ '|'+ $('#tradeCode').val() + '|BK|||'+ encodeURIComponent(splitShipperName[1]) ;
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
	$('#msgOverLayDiv').html("");
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
	$('#'+source+'Comm1').attr('checked',true);
	$('#'+source+'Comm1').val('P');
	$('#'+source+'Comm1').trigger('click');
}
function populateTrade(trades){
	if($('#tradeCode').val()==''){
		var splitTrades = trades.split(",");
		$('#tradeCode').selected().val(splitTrades[0]);
		$('#tradeCode').trigger('change');
		$('#tradeCode').trigger('blur');
	}
}

function resetTrade(){
	if($('input[name="shipper\\.organizationId"]').val()=='' && $('input[name="consignee\\.organizationId"]').val()==''){
		if($('#shipmentNumber').val()==''){
			$('#tradeCode').val('');
			$('#tradeCode').trigger('change');
			$('#tradeCode').trigger('blur');	
		}
	}
}

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
	if (orgCaller == 'shipper') {
		var values = id.split("|");
		$('input[name="shipper\\.organizationName"]').val(values[0] +"-"+ values[1]);
		$('input[name="shipper\\.organizationCode"]').val(values[1]);
		$('input[name="shipper\\.organizationId"]').val(values[2]);
		$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
		processShipperConsigneeColor("shipper");
		$('#shipperName').val(values[0]);
		populateTrade(values[3]);
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
			$('input[name="consignee\\.organizationCode"]').val(values[1]);
			$('input[name="consignee\\.organizationId"]').val(values[2]);
			$('#consigneeName').val(values[0]);
			$('input[name="consignee\\.isOneTimeCustomer"]').val("false");
			processShipperConsigneeColor("consignee");
			$('input[name="consignee\\.address"]').val("");
			populateTrade(values[3]);
			emptyCityStateZip("consignee");
			emptyContactDetails("consignee");
			if($('#shipperName').val()!=''){
				$("#copyShipper").attr("disabled", true);
			}
			//consigneeAddPredictive();
		}else if (orgCaller == 'parties') {
			var values = id.split("|");
			$('input[name="organizationName"]').val(values[1] +"-"+ values[0]);
			partyOrg = values[1] +"-"+ values[0];
			$('input[name="organizationCode"]').val(values[1]);
			$('input[name="organizationId"]').val(values[2]);
			$('input[name="isOneTimeCustomer"]').val("false");
			$('input[name="addressRoleId"]').val("");
			$('input[name="address"]').trigger('change');
			
			isPartyChanged = "Y";
			//partiesAddPredictive();
		}else if (orgCaller == 'repeat') {
			var values = id.split("|");

			$('#repeatContactOrgName').val(values[1] +"-"+ values[0]);
			repeatOrgName = values[1] +"-"+ values[0];
			$('#repeatContactOrgId').val(values[2]);
			$("#repeatContactOrgAddress").val("");
			//repeatContactAddressPredictive();
			orgAddressPopupSearch();
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
		
		$('input[name="shipper\\.city"]').val(values[2]);
		$('input[name="shipper\\.state"]').val(values[6]);
		$('input[name="shipper\\.zip"]').val(values[8]);
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],"","");//nameQualifier, addressLine1, city, state)
		$('input[name="shipper\\.address"]').val(finalAddress);
		shipperAddress = finalAddress;
		$('input[name="shipper\\.addressRoleId"]').val(values[9]);
		emptyContactDetails("shipper");
		if($('#shipmentTypeCode').val()=='B'){
			checkForShipperTemplate();
		}else{
			requestForContactList("shipper");
		}
		setShipperDivName(" - "+$('input[name="shipper\\.organizationName"]').val());
	}else if (orgCaller == 'consignee') {
		var values = data.split("|");
		if(values[0]=='ALL'&& $('input[name="shipper\\.organizationName"]').val()==''){
			$("#copyConsignee").attr("disabled", false);
		}
		else
			$("#copyConsignee").attr("disabled", true);

		$('input[name="consignee\\.city"]').val(values[2]);
		$('input[name="consignee\\.state"]').val(values[6]);
		$('input[name="consignee\\.zip"]').val(values[8]);
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],"","");//nameQualifier, addressLine1, city, state)
		$('input[name="consignee\\.address"]').val(finalAddress);
		consigneeAddress = finalAddress;
		$('input[name="consignee\\.addressRoleId"]').val(values[9]);
		emptyContactDetails("consignee");
		if($('#shipmentTypeCode').val()=='B'){
			checkForConsigneeTemplate();
		}else{
			requestForContactList("consignee");
		}
		setConsigneeDivName(" - "+$('input[name="consignee\\.organizationName"]').val());
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
		$("#repeatContactAddressRoleId").val(values[9]);
		repeatAddress = finalAddress;
	}
	else if(orgCaller == 'dataAdmin')
	{
		var values = data.split("|");
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);
		$("#existingAddressLine1").val(finalAddress);
		$("#replaceAddressRoleId").val(values[9]);
	}else if(orgCaller == 'commodityBillTo'){
			var values = data.split("|");
			
			$('#shipmentCityStateZip').text(values[2]+" "+values[6]+" "+values[8]);
			
			var finalAddress = formatAddRoleDscrForCommodityHHGS(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
			$('#shipmentAddressLine1').text(finalAddress);
			
			$('input[name="shipmentAddressRoleId"]').val(values[9]);
		
			
			
		
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
	$('#msgOverLayDiv').html("<div class=\"message_info\">Loading "+ templateNumber +" template...</div>");
	$('#msgOverLayDiv').show();
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
				showResponseMessages("msgOverLayDiv",responseText);
				$('#msgOverLayDiv').show();
				
				processShipperConsigneeColor("shipper");
				processShipperConsigneeColor("consignee");
			}
		});
	}
}

function disableScreenForDealer(){
	$('#originPortCityCodeDescription').attr('disabled',true);
	$('#destinationPortCityCodeDescription').attr('disabled',true);
	$("#consignee").gatesDisable();
}

function enableScreenForDealer(){
	$('#originPortCityCodeDescription').attr('disabled',false);
	$('#destinationPortCityCodeDescription').attr('disabled',false);
	$("#consignee").gatesEnable();
	if($('input[name="shipper\\.addressRoleId"]').val()!=''){
		$("#copyConsignee").attr("disabled", true);
	}
	$("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");
}

function quoteFilterParams(){
	var queryString="";
	queryString = "&trade="+$('#tradeCode').val()+"&placeOfReceipt="+$('#blOriginCityCode').val() +"&placeOfDelivery="+$('#blDestinationCityCode').val()+"&pol="+$('#originPortCityCode').val()+"&pod="+$('#destinationPortCityCode').val();
	queryString = queryString + "&loadService="+$('#loadServiceCode').val()+"&dischargeService="+$('#dischargeServiceCode').val()+"&tariffNumber="+$('#tariffNumber').val();
	return queryString;
}

function checkQuotesForPulledTemplate(casResponse){
	//get owner from CAS
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
	}
}

function clearAndResetShipmentScreen(){
	$('#msgOverLayDiv').html("");
	//$('#shipmentForm').clearForm();
	$('input[name="shipper\\.addressRoleId"]').val("");
	$('input[name="consignee\\.addressRoleId"]').val("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
	resetDefault();
	$("#bookedDateTimeUser").html("");
	$("#lastUpdateDateTimeUser").html("");
}
function removeAssignedQuoteOnTemplatePull(){
	$('#quoteId').val("");
	$('#quoteNumber').val("");
	$('#quoteVersion').val("");
	$('#quoteNumberLabel').text("");
	$('#quoteAmount').val("");
	$('#quoteAmountDiv').text("");
	if($("#shipmentNumber").val() == '' || $("#shipmentNumber").val() == null){
		$('#assignLink').html("Assign Quote");
	}else{
		$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
	}
}

function loadAdditionalShipperDetails(responseText){
	$("#shipperId").val(responseText.data.shipper.organizationId);
	$('#shipper\\.addressRoleId').val(responseText.data.shipper.addressRoleId);
	if(null!=responseText.data.shipper.addressRoleId){
		enableDisableContactId('shipper',false);
	}
	setShipperCommMethodValue(responseText.data.shipper);
	//first clear the drop down
	$('select[name="shipper\\.contactId"]').children().remove();
	$.each(responseText.data.shipper.contactList, function(key, value) {
		$('select[name="shipper\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
	
	if(responseText.data.shipper.isCustomerOneTimeCust==true){
		formatColorForOneTime('shipper');
	}
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
function formatAddRoleDscrForCommodityHHGS(nameQualifier, addressLine1, city, state){
	
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	
	
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
	
	 return nameQualifierTemp + addressLine1Temp ;
	
}

function formatColorForOneTime(source){
	$('input[name="'+source+'\\.organizationName"]').css('backgroundColor', "#ffffcc");
	$('input[name="'+source+'\\.address"]').attr("disabled",true);
}




//HHGS
function addShipperAsDebtor(){
	var source = "shipper";
	$('input[name="'+source+'\\.isOneTimeCustomer"]').val(true);
	
}

function removeShipperAsDebtor(){
	var queryString = $('#shipmentHouseHoldBasicDetailForm').formSerialize();
	$.ajax({
		url : _context +"/shipment/party/setDefaults",
		type : "POST",
		data : queryString+"&type=shipper&oper=remove",
		success : function(responseText) {
			showResponseMessages('msgOverLayDiv', responseText);
			if($('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('C');//collect
			else
				$('#prepaidCollectCode').val('');//none
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
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
				//$('select[name="'+source+'\\.contactId"]').append("<option value=''></option>");
				$.each(responseText.data.contactList, function(key,
						value) {
					$('select[name="'+source+'\\.contactId"]')
							.append($("<option/>", {
								value : key,
								text : value
							}));
				});
				$('select[name="'+source+'\\.contactId"]').attr('selectedIndex', 0);
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
				$('select[name="'+source+'\\.contact"]').val($('select[name="'+source+'\\.contactId"]').selected().val());
				$("#"+source+"").loadJSON(responseText.data);
				
				setphoneCountryCode(source); // for populationg phone country code.
				
				$('input[name="'+source+'\\.isOneTimeCustomer"]').val(oneTimeCustomer);
				
				if(change!="N")
				{
					/*if(source=='shipper')
						//addShipperAsDebtor(); //HHGS 
					else if(source=='consignee')
						//addConsigneeAsDebtor(); // HHGS
*/				}
			}
		});
	}
	else if($('select[name="'+source+'\\.contactId"]').attr("disabled")== true
			|| $('select[name="'+source+'\\.contactId"]').attr("disabled")== 'true')
	{
		if(change!="N")
		{
			/*if(source=='shipper')
				//addShipperAsDebtor(); //HHGS
			else if(source=='consignee')
				//addConsigneeAsDebtor(); //HHGS
*/		}
	}
}

function emptyCityStateZip(source){
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
	document.getElementById('shipperConsigneeRoutingDialog').style.display = 'block';
	window.scrollTo(0, 180);
}

function validateContactForShipperConsignee(source){
	var isValid = true;
	if($('input[name="'+source+'\\.addressRoleId"]').val()!=''){
		if($('select[name="'+source+'\\.contactId"]').val()=='' || $('select[name="'+source+'\\.contactId"]').val()==null){
			openDivBlock();
			isValid = false;
			$('select[name="'+source+'\\.contactId"]').validationEngine('showPrompt', 'Please select contact.', 'error', 'topRight', true);
			return isValid;
		}
		var prefMethod = getPrefCommMethod(source);

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
			addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val(),
		},
		success : function(responseText) {
			defaultCountryCode=responseText.data;
		}
	});
	return defaultCountryCode;
}
function validateFieldData(isFieldPrefMethod,areaCode,exchange,station,countryCode,source,contactField){
	var isValid = true;

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

function showWarningIfAroleChangeAndRefNumberRequiredShipper(){
	var isRefNumberRequired = $('input[name="shipper\\.isReferenceNumberRequired"]').val();
	if (isRefNumberRequired=='Y') {
		var refExist =isReferenceNumberForShipperExist();
		if (refExist==false) {
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
		/*if(countryCode.length==0){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'CountryCode"]').validationEngine('showPrompt', 'Country Code is Required.', 'error', 'topRight', true);
			isValid = false;
		}*/
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
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val(),
			},
			success : function(responseText) {
				if($('input[name="'+source+'\\.contactPhoneCountryCode"]').val()==''){
					$('input[name="'+source+'\\.contactPhoneCountryCode"]').val(responseText.data);
				}
			}
		});
	}

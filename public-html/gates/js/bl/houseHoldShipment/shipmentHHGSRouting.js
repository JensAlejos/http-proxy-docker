var lastLoadService = "";
var lastDischargeService = "";
var lastOriginPortCode = "";
var lastOriginPortDescription = "";
var lastOriginPortCodeDescription = "";
var lastDestinationPortCode = "";
var lastDestinationPortDescription = "";
var lastDestinationPortCodeDescription = "";

var lastBlOriginCode = "";
var lastBlOriginDescription = "";
var lastBlOriginCodeDescription = "";

var lastBlDestinationCode = "";
var lastBlDestinationDescription = "";
var lastBlDestinationCodeDescription = "";

$(function() {
	
	
	$('#requiredDeliveryDate').attr('disabled', true);
	//$('#milRequiredDeliveryDate').attr('disabled', true);
	
	$("#convCgoApptCutoffDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});

	$("#convCgoEstArrivalDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});

	$("#intermodalDepartureDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	
	$("#requiredDeliveryDate").datepicker({dateFormat: 'mm-dd-yy'});
	
	$('#requiredDeliveryDate').change(function(){
		//$('#milRequiredDeliveryDate').val($(this).val());
	});

	// Autocompleter and lookup for BL Origin
	$('#blOriginCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			
			$('#blOriginCityCodeDescription').val(item.cityCode+"-"+item.cityName);
			$('#blOriginCityCode').val(item.cityCode);
			$('#blOriginCityDescription').val(item.cityName);
			validateCity('blOriginCity');
		},
		autoSelectFirst:true,
		onChange:function() {
			if ($('#blOriginCityCode').val() == "")
			{
				$('#blOriginCityDescription').val('');
				$('#blOriginCityCodeDescription').val('');
			}
			else if($('#blOriginCityCodeDescription').val() == '')
			{
				$('#blOriginCityCode').val('');
				$('#blOriginCityDescription').val('');
			}
			/*else if($('#blOriginCityCodeDescription').val()+"-"+$('#blOriginCityDescription').val()!=$('#blOriginCityCodeDescription').val())
			{
				$('#blOriginCityCode').val('');
				$('#blOriginCityDescription').val('');
				$('#blOriginCityCodeDescription').val('');
			}*/
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
			setRoutingHeader();
		}
	});

	$('#blOriginCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#blOriginCityCode').val(), 2);
		}
	});

	/*$('#blOriginCityCodeDescription').change(function() {
		if ($('#blOriginCityCode').val() == "")
		{
			$('#blOriginCityDescription').val('');
			$('#blOriginCityCodeDescription').val('');
		}
		else if($('#blOriginCityCodeDescription').val() == '')
		{
			$('#blOriginCityCode').val('');
			//$('#blOriginCityDescription').val('');
		}
		else if($('#blOriginCityCodeDescription').val()+"-"+$('#blOriginCityDescription').val()!=$('#blOriginCityCodeDescription').val())
		{
			$('#blOriginCityCode').val('');
			$('#blOriginCityDescription').val('');
			$('#blOriginCityCodeDescription').val('');
		}
		checkPlaceOfReceiptDefaultValue();
		checkOriginPtDefaultValue();
		setRoutingHeader();
	});*/

	// Autocompleter and lookup for Origin Port
	$('#originPortCityCodeDescription')
			.gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
								formatItem : function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										//return item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
								formatResult: function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										//return item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
						select : function(item) {
							$('#originPortCityCodeDescription').val(item.cityCode+"-"+item.cityName);
							$('#originPortCityCode').val(item.cityCode);
							$('#originPortCityDescription').val(item.cityName);
							originPortCityChangeFunction(item.cityCode);
						},
						autoSelectFirst:true,
						onChange:function() {
							if ($('#originPortCityCode').val() == "")
							{
								$('#originPortCityCodeDescription').val('');
								$('#originPortCityDescription').val('');
								resetOriginalOrgValues();
							}
							else if($('#originPortCityCodeDescription').val() == '')
							{
								$('#originPortCityCode').val('');
								$('#originPortCityDescription').val('');
								resetOriginalOrgValues();
							}
							/*else if($('#originPortCityCode').val()+"-"+$('#originPortCityDescription').val()!=$('#originPortCityCodeDescription').val())
							{
								$('#originPortCityCode').val('');
								$('#originPortCityDescription').val('');
								$('#originPortCityCodeDescription').val('');
								resetOriginalOrgValues();
							}*/
						}
					});

	$('#originPortCityCodeDescription').gatesPopUpSearch({
		func : function() {
			/*if($('#tradeCode').val()=='')
				alert("Please enter a valid trade");
			else*/
				portPopupSearch($('#originPortCityCodeDescription').val(), 3);
		}
	});

	/*$('#originPortCityCodeDescription').change(function() {
		if ($('#originPortCityCode').val() == "")
		{
			$('#originPortCityCodeDescription').val('');
			$('#originPortCityDescription').val('');
			resetOriginalOrgValues();
		}
		else if($('#originPortCityCodeDescription').val() == '')
		{
			$('#originPortCityCode').val('');
			$('#originPortCityDescription').val('');
			resetOriginalOrgValues();
		}
		else if($('#originPortCityCode').val()+"-"+$('#originPortCityDescription').val()!=$('#originPortCityCodeDescription').val())
		{
			$('#originPortCityCode').val('');
			$('#originPortCityDescription').val('');
			$('#originPortCityCodeDescription').val('');
			resetOriginalOrgValues();
		}
	});*/

	// Autocompleter and lookup for Destination Port
	$('#destinationPortCityCodeDescription')
			.gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
								formatItem : function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										//return item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
								formatResult: function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										//return item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
						select : function(item) {
							$('#destinationPortCityCodeDescription').val(item.cityCode+"-"+item.cityName);
							$('#destinationPortCityCode').val(item.cityCode);
							$('#destinationPortCityDescription').val(item.cityName);
							destinationPortCityChangeFunction(item.cityCode);
						},
						autoSelectFirst:true,
						onChange:function() {
							if ($('#destinationPortCityCode').val() == "")
							{
								$('#destinationPortCityCodeDescription').val('');
								$('#destinationPortCityDescription').val('');
								resetOriginalDestValues();
							}
							else if($('#destinationPortCityCodeDescription').val() == '')
							{
								$('#destinationPortCityCode').val('');
								$('#destinationPortCityDescription').val('');
								resetOriginalDestValues();
							}
							/*else if($('#destinationPortCityCode').val()+"-"+$('#destinationPortCityDescription').val()!=$('#destinationPortCityCodeDescription').val())
							{
								$('#destinationPortCityCode').val('');
								$('#destinationPortCityDescription').val('');
								$('#destinationPortCityCodeDescription').val('');
								resetOriginalDestValues();
							}*/
						}
					});

	$('#destinationPortCityCodeDescription').gatesPopUpSearch({
		func : function() {
			if($('#tradeCode').val()=='')
				alert("Please enter a valid trade");
			else
				portPopupSearch($('#destinationPortCityCodeDescription').val(), 4);
		}
	});
/*
	$('#destinationPortCityCodeDescription').change(function() {
		if ($('#destinationPortCityCode').val() == "")
		{
			$('#destinationPortCityCodeDescription').val('');
			$('#destinationPortCityDescription').val('');
			resetOriginalDestValues();
		}
		else if($('#destinationPortCityCodeDescription').val() == '')
		{
			$('#destinationPortCityCode').val('');
			$('#destinationPortCityDescription').val('');
			resetOriginalDestValues();
		}
		else if($('#destinationPortCityCode').val()+"-"+$('#destinationPortCityDescription').val()!=$('#destinationPortCityCodeDescription').val())
		{
			$('#destinationPortCityCode').val('');
			$('#destinationPortCityDescription').val('');
			$('#destinationPortCityCodeDescription').val('');
			resetOriginalDestValues();
		}
	});*/

	// Autocompleter and lookup for BL Destination
	$('#blDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			$('#blDestinationCityCodeDescription').val(item.cityCode+"-"+item.cityName);
			$('#blDestinationCityCode').val(item.cityCode);
			$('#blDestinationCityDescription').val(item.cityName);
			validateCity('blDestinationCity');
		},
		autoSelectFirst:true,
		onChange:function() {
			if ($('#blDestinationCityCode').val() == "")
			{
				$('#blDestinationCityCodeDescription').val('');
			}
			else if($('#blDestinationCityCodeDescription').val() == '')
			{
				$('#blDestinationCityCode').val('');
				$('#blDestinationCityDescription').val('');
			}
			/*else if($('#blDestinationCityCode').val()+"-"+$('#blDestinationCityDescription').val()!=$('#blDestinationCityCodeDescription').val())
			{
				$('#blDestinationCityCode').val('');
				$('#blDestinationCityDescription').val('');
				$('#blDestinationCityCodeDescription').val('');
			}*/
			checkPlaceOfDeliveryDefaultValue();
			setRoutingHeader();
		}
	});

	$('#blDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#blDestinationCityCodeDescription').val(), 5);
		}
	});

	/*$('#blDestinationCityCodeDescription').change(function() {
		
		if ($('#blDestinationCityCode').val() == "")
		{
			$('#blDestinationCityCodeDescription').val('');
		}
		else if($('#blDestinationCityCodeDescription').val() == '')
		{
			$('#blDestinationCityCode').val('');
			$('#blDestinationCityDescription').val('');
		}
		else if($('#blDestinationCityCode').val()+"-"+$('#blDestinationCityDescription').val()!=$('#blDestinationCityCodeDescription').val())
		{
			$('#blDestinationCityCode').val('');
			$('#blDestinationCityDescription').val('');
			$('#blDestinationCityCodeDescription').val('');
		}
		checkPlaceOfDeliveryDefaultValue();
		setRoutingHeader();
	});*/
	
	// Autocompleter and lookup for Cargo Pickup
	$('#freightOriginCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			$('#freightOriginCityCode').val(item.cityCode);
			$('#freightOriginCityDescription').val(item.cityName);
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
		}
	});

	$('#freightOriginCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#freightOriginCityCodeDescription').val(), 6);
		}
	});

	$('#freightOriginCityCodeDescription').change(function() {
		if ($('#freightOriginCityCode').val() == "")
		{
			$('#freightOriginCityCodeDescription').val('');
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
		}
		else if($('#freightOriginCityCodeDescription').val() == '')
		{
			$('#freightOriginCityCode').val('');
			$('#freightOriginCityDescription').val('');
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
		}
		else if($('#freightOriginCityCode').val()+"-"+$('#freightOriginCityDescription').val()!=$('#freightOriginCityCodeDescription').val())
		{
			$('#freightOriginCityCode').val('');
			$('#freightOriginCityDescription').val('');
			$('#freightOriginCityCodeDescription').val('');
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
		}
	});
	
	// Autocompleter and lookup for Cargo Destination
	$('#freightDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				//return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			$('#freightDestinationCityCode').val(item.cityCode);
			$('#freightDestinationCityDescription').val(item.cityName);
		}
	});

	$('#freightDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#freightDestinationCityCodeDescription').val(), 7);
		}
	});

	$('#freightDestinationCityCodeDescription').change(function() {
		if ($('#freightDestinationCityCode').val() == "")
			$('#freightDestinationCityCodeDescription').val('');
		else if($('#freightDestinationCityCodeDescription').val() == '')
		{
			$('#freightDestinationCityCode').val('');
			$('#freightDestinationCityDescription').val('');
		}
		else if($('#freightDestinationCityCode').val()+"-"+$('#freightDestinationCityDescription').val()!=$('#freightDestinationCityCodeDescription').val())
		{
			$('#freightDestinationCityCode').val('');
			$('#freightDestinationCityDescription').val('');
			$('#freightDestinationCityCodeDescription').val('');
		}
	});
	
	$('#loadServiceCode').change(function() {
		var loadServiceCode = $('#loadServiceCode :selected').val();
		var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
		var marker = "load";
		$('#dischargeServiceCode').attr("disabled", true);
		clearOverlayMessage(); //HHGDS
		if(/*$('#shipmentId').val()!='' &&*/ loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/beforeServiceUpdate",
				data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode, marker:marker},
				success: function(responseTextFirst){
					if(responseTextFirst.success)
					{
						beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode);
						showResponseMessages('msgOverLayDiv', responseTextFirst); //HHGDS
					}
					else
					{
						showResponseMessages('msgOverLayDiv', responseTextFirst); //HHGDS
						$('#loadServiceCode').val(lastLoadService);
						$('#dischargeServiceCode').attr("disabled", false);
					}
				}
			});
		}
		else
			beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode);
	});
	
	$('#dischargeServiceCode').change(function() {
		var loadServiceCode = $('#loadServiceCode :selected').val();
		var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
		var marker = "discharge";
		$('#loadServiceCode').attr("disabled", true);
		clearOverlayMessage();  //HHGDS
		if(/*$('#shipmentId').val()!='' &&*/ dischargeServiceCode!='' && loadServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/beforeServiceUpdate",
				data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode, marker:marker},
				success: function(responseTextFirst){
					if(responseTextFirst.success)
					{
						showResponseMessages('msgOverLayDiv', responseTextFirst); //HHGDS
						beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode);
					}
					else
					{
						showResponseMessages('msgOverLayDiv', responseTextFirst);  //HHGDS
						$('#dischargeServiceCode').val(lastDischargeService);
						$('#loadServiceCode').attr("disabled", false);
					}
				}
			});
		}
		else
			beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode);
	});

	/*$('#isInBond').change(function()
	{
		if($('#loadServiceCode').val()!='' && $('#dischargeServiceCode').val()!=''){
			$.ajax({
				url: _context +"/shipment/routing/isInbondAllowed?inBond="+$("#isInBond option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
				success: function(responseText){
					//if(responseText.success==false)
						showResponseMessages('msgDiv', responseText);
				}
			});
		}
		
		if($('#isInBond :selected').val()==true || $('#isInBond :selected').val()=='true')
		{
			$('#inbondNumber').attr("disabled", false);
			//add bond clause code
			$.ajax({
				url: _context +"/booking/clause/addBondClause",
				success: function(responseText){
					$("#gridIdForClauses").setGridParam({rowNum : 3, datatype : "json"}).trigger("reloadGrid");
				}
			});
		}
		else
		{
			$('#inbondNumber').val("");
			$('#inbondNumber').attr("disabled", true);
			//remove bond clause code
			$.ajax({
				url: _context +"/booking/clause/removeBondClause",
				success: function(responseText){
					$("#gridIdForClauses").setGridParam({rowNum : 3, datatype : "json"}).trigger("reloadGrid");
				}
			});
		 }
	});*/
	
	/*$('#inbondNumber').change(function()
	{
		if($('#inbondNumber').val()!='')
		{
			if(!validateForPositiveIntegers($('#inbondNumber').val()))
			{
				$('#inbondNumber').val('');
				alert("Please enter only positive integers for Inbond Number");
			}
		}
	});*/
	
	/*$('#isOverland').change(function()
	{
		$.ajax({
			url: _context +"/shipment/routing/getOverland?overland="+$("#isOverland option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
			success: function(responseText){
				//if(responseText.success==false)
					showResponseMessages('msgDiv', responseText);
			}
		});
	});*/

	$('#overridePickupCarrierCode').change(function(){
		if($('#overridePickupCarrierCode').val()!='')
		{
			var carr = 'pickUp';
			$.ajax({
				url: _context +"/shipment/routing/validateCarrier",
				data :{
					carrierCode :$('#overridePickupCarrierCode').val(),
					carrier : carr
				},
				success: function(responseText){
					if(responseText.success==false)
					{
						$('#overridePickupCarrierCode').val('');
						//showResponseMessages('msgDiv', responseText);
					}
					showResponseMessages('msgOverLayDiv', responseText); //HHGDS
				}
			});
		}
	});

	$('#overrideDeliveryCarrierCode').change(function(){
		if($('#overrideDeliveryCarrierCode').val()!='')
		{
			var carr = 'delivery';
			$.ajax({
				url: _context +"/shipment/routing/validateCarrier",
				data :{
					carrierCode :$('#overrideDeliveryCarrierCode').val(),
					carrier : carr
				},
				success: function(responseText){
					if(responseText.success==false)
					{
						$('#overrideDeliveryCarrierCode').val('');
						//showResponseMessages('msgDiv', responseText);
					}
					showResponseMessages('msgOverLayDiv', responseText);  //HHGDS
				}
			});
		}
	});

});

/** ******** Supporting functions ********* */
function beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode)
{//alert("In side beforeLoadServiceUpdate");
	/*if($("#commodityGrid").getGridParam("reccount")>0)
	{//alert("In side commodityGrid"); HHGDS
*/		if(loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
				success: function(responseText){
					var oldLDSGroup = $('#loadDschServiceGroupCode').val();
					var newLDSGroup = responseText.data.loadDschServiceGroupCode;
					if($.trim(oldLDSGroup)!=$.trim(newLDSGroup))
					{
						//var r = confirm("Load discharge group code is being changed. Delete commodities?");
						//if(r)
						//{
						//	removeCommodities();
							setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
							loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						//}
						/*else
						{
							$('#dischargeServiceCode').attr("disabled", false);
							$('#loadServiceCode').val(lastLoadService);
						}*/
					}
					else{ //HHGDS
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
					}
						
				}
			});
		}
		else
		{
			/*var r = confirm("Load discharge group code is being changed. Delete commodities?");
			if(r)
			{
				removeCommodities();*/
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
				loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*}
			else
			{
				$('#dischargeServiceCode').attr("disabled", false);
				$('#loadServiceCode').val(lastLoadService);
			}*/
		}
	/*}HHGDS
	else{
		setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
		loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
	}*/
		
}

function beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode)
{
	/*if($("#commodityGrid").getGridParam("reccount")>0)
	{*/// HHGDS
		if(loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
				success: function(responseText){
					if($('#loadDschServiceGroupCode').val()!=responseText.data.loadDschServiceGroupCode)
					{
						//var r = confirm("Load discharge group code is being changed. Delete commodities?");
						//if(r)
						//{
						//	removeCommodities();
							setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
							dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
						/*}
						else
						{
							$('#loadServiceCode').attr("disabled", false);
							$('#dischargeServiceCode').val(lastDischargeService);
						}*/
					}
					else{// HHGDS
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
					}
						
				}
			});
		}
		else
		{
			/*var r = confirm("Load discharge group code is being changed. Delete commodities?");
			if(r)
			{
				removeCommodities();*/
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
				dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*}
			else
			{
				$('#loadServiceCode').attr("disabled", false);
				$('#dischargeServiceCode').val(lastDischargeService);
			}*/
		}
	/*} HHGDS
	else{
		setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
		dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
	}*/
		
}

function loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode)
{
	lastLoadService = loadServiceCode;
	
	if(loadServiceCode!=null && loadServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getDischargeServices?loadService="+loadServiceCode,
			success: function(responseText){
					$('#dischargeServiceCode').attr("disabled", false);
					setLoadDischargeValues(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
					//setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode,responseText);//HHGDS
					setRoutingHeader();
					
					var queryString = $('#shipmentHouseHoldBasicDetailForm').formSerialize(); //HHGS
					$.ajax({
						url: _context +"/shipment/routing/validateUpdateService",
						type: "POST",
						data: queryString,
						success: function(responseTextNew){
							/*if(responseTextNew.success==false)
							{*/
								showResponseMessages('msgOverLayDiv', responseTextNew);
							/*}*/
						}
					});
				}
			});
		}
		else
		{
			$.ajax({
				url: _context +"/shipment/routing/getAllDischargeServices",
				success: function(responseText){
					$('#dischargeServiceCode').attr("disabled", false);
					setLoadDischargeValues(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
					//setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode,null); ///////HHGDS
					setRoutingHeader();
				}
			});
		}
	}

function dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode)
{
	lastDischargeService = dischargeServiceCode;
	
	if(dischargeServiceCode!=null && dischargeServiceCode!=''){
		$.ajax({
			url: _context +"/shipment/routing/getLoadServices?dischargeService="+dischargeServiceCode,
			success: function(responseText){
				$('#loadServiceCode').attr("disabled", false);
				setLoadDischargeValues(responseText.data, '#loadServiceCode', loadServiceCode);
				//setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode,responseText);//HHGDS
				setRoutingHeader();
				
				var queryString = $('#shipmentHouseHoldBasicDetailForm').formSerialize(); // HHGS
				$.ajax({
					url: _context +"/shipment/routing/validateUpdateService",
					type: "POST",
					data: queryString,
					success: function(responseTextNew){
						/*if(responseTextNew.success==false)
						{*/
							showResponseMessages('msgOverLayDiv', responseTextNew);
						/*}*/
					}
				});
			}
		});
	}
	else
	{
		$.ajax({
			url: _context +"/shipment/routing/getAllLoadServices",
			success: function(responseText){
				$('#loadServiceCode').attr("disabled", false);
				setLoadDischargeValues(responseText.data, '#loadServiceCode', loadServiceCode);
				//setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode,responseText);
				setRoutingHeader();
			}
		});
	}
}

function portPopupSearch(place, id) {
	// if(!($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isRoutingModifiable==false)){  // HHGDS
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param
			+ "|" + "Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
	// HHGDS}
}

function placePopupSearch(place, id) {
	//// HHGDSif(!($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isRoutingModifiable==false)){
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param;
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
	// HHGDS}
}

function cityUpdate(id) {
	var values = id.split(",");
	var cityCode = values[0];
	var cityName = values[1];
	var stateName = values[2];
	var value = '';
	if(stateName!=''){
		value=cityCode + "-" + cityName+","+stateName;	
	}else{
		value=cityCode + "-" + cityName;
	}
	if (_callingFunc == '2') {
		/*$('#blOriginCityCodeDescription').val(value);
		$('#blOriginCityDescription').val(cityName);
		$('#blOriginCityCode').val(cityCode);
		validateCity('blOriginCity');*/
		
		$('#placeOfReceiptCommodityHHGS').val(cityCode); //HHGDS
	}
	if (_callingFunc == '3') {
		$('#originPortCityCodeDescription').val(value);
		$('#originPortCityDescription').val(cityName);
		$('#originPortCityCode').val(cityCode);
		originPortCityChangeFunction(cityCode);
	}
	if (_callingFunc == '4') {
		$('#destinationPortCityCodeDescription').val(value);
		$('#destinationPortCityDescription').val(cityName);
		$('#destinationPortCityCode').val(cityCode);
		destinationPortCityChangeFunction(cityCode);
	}
	if (_callingFunc == '5') {
		/*$('#blDestinationCityCodeDescription').val(value);
		$('#blDestinationCityDescription').val(cityName);
		$('#blDestinationCityCode').val(cityCode);
		validateCity('blDestinationCity');*/
		
		$('#placeOfDeliveryCommodityHHGS').val(cityCode); //HHGDS
	}
	if (_callingFunc == '6') {
		$('#freightOriginCityCodeDescription').val(value);
		$('#freightOriginCityDescription').val(cityName);
		$('#freightOriginCityCode').val(cityCode);
		checkPlaceOfReceiptDefaultValue();
		checkOriginPtDefaultValue();
	}
	if (_callingFunc == '7') {
		$('#freightDestinationCityCodeDescription').val(value);
		$('#freightDestinationCityDescription').val(cityName);
		$('#freightDestinationCityCode').val(cityCode);
	}
	if (_callingFunc == '8') {
		$('#cargoPickupCityCodeDesc').val(value);
		$('#cargoPickupCityCode').val(cityCode);
	}
	if (_callingFunc == '9') {
		$('#cargoDeliveryCityCodeDesc').val(value);
		$('#cargoDeliveryCityCode').val(cityCode);
	}
}

/*function setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode)
{
	if(loadServiceCode!=null && loadServiceCode!='' && dischargeServiceCode!=null && dischargeServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
			success: function(responseText){
				$('#loadDschServiceGroupCode').val(responseText.data.loadDschServiceGroupCode);
				//Block commented by Mangesh
				$('#isAllowBookingUnit').val(responseText.data.isAllowBookingUnit);
				if($('#loadDschServiceGroupCode').val()=='CON')
				{
					$('#convCgoApptCutoffDate').attr('disabled', false);
					$('#convCgoApptCutoffTime').attr('disabled', false);
					$('#convCgoEstArrivalDate').attr('disabled', false);
					$('#convCgoEstArrivalTime').attr('disabled', false);
					$('#requiredDeliveryDate').attr('disabled', false);
					$('#milRequiredDeliveryDate').attr('disabled', false);
					$('#requiredDeliveryDate').val('01-01-0001');
					$('#milRequiredDeliveryDate').val('01-01-0001');
				}
				else
				{
					$('#convCgoApptCutoffDate').val('');
					$('#convCgoApptCutoffTime').val('');
					$('#convCgoEstArrivalDate').val('');
					$('#convCgoEstArrivalTime').val('');
					$('#requiredDeliveryDate').val('');
					$('#milRequiredDeliveryDate').val('');
					
					$('#convCgoApptCutoffDate').attr('disabled', true);
					$('#convCgoApptCutoffTime').attr('disabled', true);
					$('#convCgoEstArrivalDate').attr('disabled', true);
					$('#convCgoEstArrivalTime').attr('disabled', true);
					$('#requiredDeliveryDate').attr('disabled', true);
					$('#milRequiredDeliveryDate').attr('disabled', true);
				}
				//Setting request params for hold predictive search
				//holdPredictive();//Commented by Mangesh
				
				// Setting IBS Code as mandatory incase of MBU
				//$('#militaryIbsStatusCode').trigger("change");
			}
		});
	}
	else
	{
		//$('#loadDschServiceGroupCode').val('');
		
		//Setting request params for hold predictive search
		//holdPredictive();//Commented by Mangesh
		
		// Setting IBS Code as mandatory incase of MBU
		//$('#militaryIbsStatusCode').trigger("change");
	}
}
*/
function setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText)
{
	if(responseText!=null && responseText!=undefined && loadServiceCode!=null && 
			loadServiceCode!='' && dischargeServiceCode!=null && dischargeServiceCode!='')
	{
		$('#loadDschServiceGroupCode').val($.trim(responseText.data.loadDschServiceGroupCode));
		$('#isAllowBookingUnit').val(responseText.data.isAllowBookingUnit);
		$('#isRequireReceivedUnit').val(responseText.data.isRequireReceivedUnit);
		
		
		if(isRoutingModifiable && responseText.data.isRequireBlOrigin!='N')
			{
				$('#blOriginCityCodeDescription').attr('disabled', false);
				$('#plcofReceiptLabel').text("*");
				$('#blOriginCityCodeDescription').addClass("validate[required]");
			}
		/*else if($('#blOriginCityCode').val()=='' && responseText.data.isRequireBlOrigin=='N')*/
		else if( responseText.data.isRequireBlOrigin=='N')
			{
				$('#blOriginCityCode').val('');
				$('#blOriginCityCodeDescription').val('');
				$('#blOriginCityCodeDescription').attr('disabled', true);
				$('#blOriginCityCodeDescription').removeClass("validate[required]");
				$('#plcofReceiptLabel').text('');
			}
		if(isRoutingModifiable && responseText.data.isRequireBlDestination!='N')
			{
				$('#blDestinationCityCodeDescription').attr('disabled', false);
				$('#plcofDeliveryLabel').text("*");
				$('#blDestinationCityCodeDescription').addClass("validate[required]");
			}
		/*else if($('#blDestinationCityCode').val()=='' && responseText.data.isRequireBlDestination=='N')*/
		else if( responseText.data.isRequireBlDestination=='N')
			{
				$('#blDestinationCityCode').val('');
				$('#blDestinationCityCodeDescription').val('');
				$('#blDestinationCityCodeDescription').attr('disabled', true);
				$('#blDestinationCityCodeDescription').removeClass("validate[required]");
				$('#plcofDeliveryLabel').text('');
			}
		
		if(isRoutingModifiable && responseText.data.isRequirePickupZipCode!='N')
			$('#pickupZipCode').attr('disabled', false);
		/*else if($('#pickupZipCode').val()=='' && responseText.data.isRequirePickupZipCode=='N')*/
		else if(responseText.data.isRequirePickupZipCode=='N')
			{
				$('#pickupZipCode').val('');
				 $('#pickupZone').val('');
				$('#pickupZipCode').attr('disabled', true);
			}
		
		if(isRoutingModifiable && responseText.data.isRequireDeliveryZipCode!='N')
			$('#deliveryZipCode').attr('disabled', false);
		/*else if($('#deliveryZipCode').val()=='' && responseText.data.isRequireDeliveryZipCode=='N')*/
		else if( responseText.data.isRequireDeliveryZipCode=='N')
			{
				$('#deliveryZipCode').val('');
				$('#deliveryZone').val('');
				$('#deliveryZipCode').attr('disabled', true);
			}
		
		
	}
	else
	{
		/*$('#loadDschServiceGroupCode').val('');
		$('#isAllowBookingUnit').val('');
		
		if(isRoutingModifiable)
		{
			$('#blOriginCityCodeDescription').attr('disabled', false);
			$('#blDestinationCityCodeDescription').attr('disabled', false);
			$('#pickupZipCode').attr('disabled', false);
			$('#deliveryZipCode').attr('disabled', false);
		}*/
		
		// Disable freight
		//Freight
		/*disableAccordian(4);
		removeCurrentCommodity();*/
	}
}
function checkPickupCarrier()
{
	if($('#overridePickupCarrierCode').val()=='' && $('#loadServiceCode :selected').val()!='DCY' 
		&& $('#blOriginCityCode').val()=='' && $('#pickupZipCode').val()=='')
		$('#overridePickupCarrierCode').attr('disabled', true);
	else if(isRoutingModifiable && ($('#loadServiceCode :selected').val()=='DCY' 
		|| $('#blOriginCityCode').val()!='' || $('#pickupZipCode').val()!=''))
		$('#overridePickupCarrierCode').attr('disabled', false);
}

function checkDeliveryCarrier()
{
	if($('#overrideDeliveryCarrierCode').val()=='' && $('#dischargeServiceCode :selected').val()!='DCY' 
		&& $('#blDestinationCityCode').val()=='' && $('#deliveryZipCode').val()=='')
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	else if(isRoutingModifiable && ($('#dischargeServiceCode :selected').val()=='DCY' 
		|| $('#blDestinationCityCode').val()!='' || $('#deliveryZipCode').val()!=''))
		$('#overrideDeliveryCarrierCode').attr('disabled', false);
}
function removeCommodities()
{//alert("URL:  "+_context+"/shipment/deleteFreight?id=-1");
	 var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/deleteShipmentCommoditySection",
		 data :queryString,
		success: function(responseText){
			reloadShipmentCommodityData(responseText);
			enableCommoditySectionButtons("All");
			checkClearButton = true;
			$('#statusCode').text(responseText.data.header.statusCode);
			$("#povGrid").trigger('reloadGrid');
			$("#commodityGrid").trigger('reloadGrid');
			$("#convGrid").trigger('reloadGrid');
		}	        
	 });
}
function validateCity(selector){
	
	setRoutingHeader();
	if(selector=='blOriginCity')
	{
		lastBlOriginCode = $('#blOriginCityCode').val();
		lastBlOriginDescription = $('#blOriginCityDescription').val();
		lastBlOriginCodeDescription = $('#blOriginCityCodeDescription').val();
		
		checkPickupCarrier();
		checkPlaceOfReceiptDefaultValue();
		checkOriginPtDefaultValue();
	}
	else if(selector=='originPortCity')
	{
		lastOriginPortCode = $('#originPortCityCode').val();
		lastOriginPortDescription = $('#originPortCityDescription').val();
		lastOriginPortCodeDescription = $('#originPortCityCodeDescription').val();
		
		if($.trim($('#pickupZipCode').val())!='')
			deriveZone('pickup');
		//fetchTradeValue();
		checkOriginPortDefaultValue();
		setDomesticForeignIndicator();
	}
	else if(selector=='destinationPortCity')
	{
		lastDestinationPortCode = $('#destinationPortCityCode').val();
		lastDestinationPortDescription = $('#destinationPortCityDescription').val();
		lastDestinationPortCodeDescription = $('#destinationPortCityCodeDescription').val();
		
		if($.trim($('#deliveryZipCode').val())!='')
			deriveZone('delivery');
		//fetchTradeValue();
		checkDestinationPortDefaultValue();
		checkPlaceOfDeliveryDefaultValue();
	}
	else if(selector=='blDestinationCity')
	{
		lastBlDestinationCode = $('#blDestinationCityCode').val();
		lastBlDestinationDescription = $('#blDestinationCityDescription').val();
		lastBlDestinationCodeDescription = $('#blDestinationCityCodeDescription').val();
		
		checkDeliveryCarrier();
		checkPlaceOfDeliveryDefaultValue();
	}
	
	var queryString = $('#shipmentHouseHoldBasicDetailForm').formSerialize();
	$.ajax({
		url: _context +"/shipment/routing/validateCity?city="+selector,
		type : "POST",
		data : queryString,
		success: function(responseText){
				showResponseMessages('msgOverLayDiv', responseText);
				if(responseText.success && selector == 'destinationPortCity'){
					deriveValidateVVD();
				}
					
			}
	});

}
function deriveValidateVVD()
{
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		url: _context +"/shipment/routing/deriveValidateVVD",
		type : "POST",
		data : queryString,
		success: function(responseText){
			$("#vvdRoutingGrid").trigger("reloadGrid");
			showResponseMessages('msgOverLayDiv', responseText);
		}
	});
}
function deriveZone(selector)
{
	var portCode = "";
	var zipcode = "";
	
	if(selector=='pickup')
	{
		portCode = $('#originPortCityCode').val();
		zipcode = $('#pickupZipCode').val();
	}
	else if(selector=='delivery')
	{
		portCode = $('#destinationPortCityCode').val();
		zipcode = $('#deliveryZipCode').val();
	}
	$.ajax({
		url: _context +"/shipment/routing/deriveZone",
		data : {portCode:portCode, zipcode:zipcode, selector:selector},
		success: function(responseText){
			if(selector=='pickup')
			{
				$('#pickupZone').val(responseText.data);
				$('#pickupZoneDisplay').html(responseText.data);
			}
			else if(selector=='delivery')
			{
				$('#deliveryZone').val(responseText.data);
				$('#deliveryZoneDisplay').html(responseText.data);
			}
		}
	});
}
/*function validateCity(selector)
{
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		url: _context +"/shipment/routing/validateCity?city="+selector,
		type : "POST",
		data : queryString,
		success: function(responseText){
				showResponseMessages('msgDiv', responseText);
				setRoutingHeader();
				
				if(selector=='blOriginCity')
				{
					lastBlOriginCode = $('#blOriginCityCode').val();
					lastBlOriginDescription = $('#blOriginCityDescription').val();
					lastBlOriginCodeDescription = $('#blOriginCityCodeDescription').val();
					
					checkPickupCarrier();
					checkPlaceOfReceiptDefaultValue();
					checkOriginPtDefaultValue();
				}
				else if(selector=='originPortCity')
				{
					lastOriginPortCode = $('#originPortCityCode').val();
					lastOriginPortDescription = $('#originPortCityDescription').val();
					lastOriginPortCodeDescription = $('#originPortCityCodeDescription').val();
					
					checkOriginPortDefaultValue();
					setDomesticForeignIndicator();
				}
				else if(selector=='destinationPortCity')
				{
					lastDestinationPortCode = $('#destinationPortCityCode').val();
					lastDestinationPortDescription = $('#destinationPortCityDescription').val();
					lastDestinationPortCodeDescription = $('#destinationPortCityCodeDescription').val();
					
					checkDestinationPortDefaultValue();
					checkPlaceOfDeliveryDefaultValue();
				}
				else if(selector=='blDestinationCity')
					checkPlaceOfDeliveryDefaultValue();
			}
		});
}*/

function validateZip(selector)
{
	if($.trim($('#'+selector+"ZipCode").val())!='')
	{
		var portCode = "";
		var zipcode = "";
		
		if(selector=='pickup')
		{
			portCode = $('#originPortCityCode').val();
			zipcode = $('#pickupZipCode').val();
			checkPickupCarrier();
		}
		else if(selector=='delivery')
		{
			portCode = $('#destinationPortCityCode').val();
			zipcode = $('#deliveryZipCode').val();
			checkDeliveryCarrier();
		}
		$.ajax({
			url: _context +"/shipment/routing/deriveZone",
			data : {portCode:portCode, zipcode:zipcode, selector:selector},
			success: function(responseText){
				showResponseMessages('msgOverLayDiv', responseText);  //HHGDS
				if(selector=='pickup')
				{
					$('#pickupZone').val(responseText.data);
					$('#pickupZoneDisplay').html(responseText.data);
				}
				else if(selector=='delivery')
				{
					$('#deliveryZone').val(responseText.data);
					$('#deliveryZoneDisplay').html(responseText.data);
				}
				if(responseText.success)
				{
					var queryString = $('#shipmentHouseHoldBasicDetailForm').formSerialize();
					$.ajax({
						url: _context +"/shipment/routing/validateZip?zip="+selector,
						type : "POST",
						data : queryString,
						success: function(responseTextNew){
							showResponseMessages('msgOverLayDiv', responseTextNew); //HHGDS
						}
					});
				}
			}
		});
	}
	else
	{
		if(selector=='pickup')
		{
			$('#pickupZone').val('');
			$('#pickupZoneDisplay').html('');
			checkPickupCarrier();
		}
		else if(selector=='delivery')
		{
			$('#deliveryZone').val('');
			$('#deliveryZoneDisplay').html('');
			checkDeliveryCarrier();
		}
	}
}

function setLoadDischargeValues(listData, selector, value)
{
	$(selector).children().remove();
	$(selector).append(
			"<option value=''></option>");
	var flag = false;
	$.each(listData, function(intIndex, objValue) {
		if(objValue==value)
			flag = true;
		$(selector).append($("<option/>", {
			value : objValue,
			text : objValue
		}));
	});
	if(flag == true)
		$(selector).val(value);
}

function checkLoadDischargeService(selector)
{
	if(selector=='#originPortCityCodeDescription' && $('#tradeCode').val()=="")
	{
		$(selector).blur();
		alert("Please enter a valid trade");
	}
	else if(selector=='#destinationPortCityCodeDescription' && $('#tradeCode').val()=="")
	{
		$(selector).blur();
		alert("Please enter a valid trade");
	}
	else if(selector=='#pickupZipCode' && $('#originPortCityDescription').val()=='')
	{
		$(selector).blur();
		alert("Please enter port of loading first");
	}
	else if(selector=='#deliveryZipCode' && $('#destinationPortCityDescription').val()=='')
	{
		$(selector).blur();
		alert("Please enter port of discharge first");
	}
}


/*function validateOverride(selector)
{alert($('#loadServiceCode :selected').val());
alert($('#pickupZipCode').val());
	if(selector=='overridePickupCarrierCode' && ($('#loadServiceCode :selected').val()!='DCY' || $('#pickupZipCode').val()==''))
	{
		$("#"+selector).blur();
		alert("Override not allowed for pickup");
	}
	else if(selector=='overrideDeliveryCarrierCode' && ($('#dischargeServiceCode :selected').val()!='DCY' || $('#deliveryZipCode').val()==''))
	{
		$("#"+selector).blur();
		alert("Override not allowed for delivery");
	}
}*/

function validateOnFocus(selector)
{
	if((selector=='#originPortCityCodeDescription' || selector=='#destinationPortCityCodeDescription') && $('#tradeCode').val()=="")
	{
		$(selector).blur();
		alert("Please enter a valid trade");
	}
	else if(selector=='#pickupZipCode' && $('#originPortCityDescription').val()=='')
	{
		$(selector).blur();
		alert("Please enter port of loading first");
	}
	else if(selector=='#deliveryZipCode' && $('#destinationPortCityDescription').val()=='')
	{
		$(selector).blur();
		alert("Please enter port of discharge first");
	}
	else if(selector=='#overridePickupCarrierCode' && $(selector).val()=='' && $('#blOriginCityCode').val()=='' 
		&& $('#loadServiceCode :selected').val()!='DCY' && $('#pickupZone').val()=='')
	{
		$(selector).blur();
		alert("Override not allowed for pickup");
	}
	else if(selector=='#overrideDeliveryCarrierCode' && $(selector).val()=='' && $('#blDestinationCityCode').val()=='' 
		&& $('#dischargeServiceCode :selected').val()!='DCY' && $('#deliveryZone').val()=='')
	{
		$(selector).blur();
		alert("Override not allowed for delivery");
	}
	/*if(selector=='#destinationPortCityCodeDescription')
	{
		var r = confirm("Do you wish to override existing destination port?");
		if(!r){
			$(selector).blur();
		}
	}*/
	/*else if(selector=='blOrigin' || selector=='blDestination')
	{
		if($("#"+selector+"CityCode").val()!='' && $('#shipmentId').val()!='')
		{
			$("#"+selector+'CityCodeDescription').attr("readonly", true);
			//alert("done");
			$.ajax({
				url: _context +"/shipment/routing/validateSpotPull",
				data : {cityCode:$("#"+selector+"CityCode").val(), bookingId:$('#shipmentId').val(), marker:selector},
				success: function(responseText){
					showResponseMessages('msgDiv', responseText);
					if(responseText.success==false)
					{
						$("#"+selector+'CityCodeDescription').blur();
						if(selector=='blOrigin')
							$("#"+selector+'CityCodeDescription').val(lastBlOriginCodeDescription);
						else if(selector=='blDestination')
							$("#"+selector+'CityCodeDescription').val(lastBlDestinationCodeDescription);
					}
					
					$("#"+selector+'CityCodeDescription').attr("readonly", false);
				}
			});
		}
	}*/
}
function validateOnClick(selector){
	if(selector=='#destinationPortCityCodeDescription' && $('#destinationPortCityCodeDescription').val()!='')
	{
		var r = confirm("Do you wish to override existing destination port?");
		if(!r){
			$(selector).blur();
		}
	}
}
function originPortCityChangeFunction(loadPortCode)
{	
	if($('#shipmentId')!='')
	{
		var tradeCode = $('#tradeCode').val();
		var direction = $('#direction').val();
		$.ajax({
			url: _context +"/shipment/routing/validateUpdateOriginPort",
			data : {originPortCityCode:loadPortCode, tradeCode:tradeCode, direction:direction},
			success: function(responseText){
				showResponseMessages('msgOverLayDiv', responseText);
				if(responseText.success==false)
				{
					//showResponseMessages('msgDiv', responseText);
					$('#originPortCityCode').val(lastOriginPortCode);
					$('#originPortCityDescription').val(lastOriginPortDescription);
					$('#originPortCityCodeDescription').val(lastOriginPortCodeDescription);
				}
				else
					validateCity('originPortCity');
			}
		});
	}
	else
		validateCity('originPortCity');
}

function destinationPortCityChangeFunction(dischargePortCode)
{
	if($('#shipmentId').val()!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/validateUpdateDestinationPort?dischargePortCode="+dischargePortCode,
			success: function(responseText){
				if(responseText.success)
					validateCity('destinationPortCity');
				else
				{
					var r = confirm("Received units exist for shipment. Override existing destination port?");
					if(r)
						validateCity('destinationPortCity');
					else
						setOrginalDestValues();
				}
			}
		});
	}
	else
		validateCity('destinationPortCity');
}


function setOrginalDestValues()
{
	$('#destinationPortCityCode').val(lastDestinationPortCode);
	$('#destinationPortCityDescription').val(lastDestinationPortDescription);
	$('#destinationPortCityCodeDescription').val(lastDestinationPortCodeDescription);
	$('#destinationPortCityCodeDescription').blur();
}

function resetOriginalOrgValues()
{
	lastOriginPortCode = "";
	lastOriginPortDescription = "";
	lastOriginPortCodeDescription = "";
	
	checkOriginPortDefaultValue();
	setDomesticForeignIndicator();
	
	setRoutingHeader();
}

function resetOriginalDestValues()
{
	if($('#shipmentId').val()!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/validateUpdateDestinationPort?dischargePortCode="+item.cityCode,
			success: function(responseText){
				if(responseText.success)
				{
					$('#msgOverLayDiv').html('');
					lastDestinationPortCode = "";
					lastDestinationPortDescription = "";
					lastDestinationPortCodeDescription = "";
				}
				else
				{
					$('#msgOverLayDiv').html('<div class="message_error">Destination Port cannot be updated as received units exist for shipment</div>');
					window.scrollTo(0, 0);
					setOrginalDestValues();
				}
				checkDestinationPortDefaultValue();
				checkPlaceOfDeliveryDefaultValue();
				
				setRoutingHeader();
			}
		});
	}
	else
	{
		lastDestinationPortCode = "";
		lastDestinationPortDescription = "";
		lastDestinationPortCodeDescription = "";
		
		checkDestinationPortDefaultValue();
		checkPlaceOfDeliveryDefaultValue();
		
		setRoutingHeader();
	}
}

function validateForPositiveIntegers(value) {
	var re = new RegExp("^[0-9]+$");
	if (value<=0) {
		return false;
	} else if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

function setRoutingHeader()
{
	var displayText = "";
	
	var loadService = "";
	if($('#loadServiceCode :selected').val()!='')
		loadService = " - " + $('#loadServiceCode option:selected').text();
	var dischargeService = "";
	if($('#dischargeServiceCode :selected').val()!='')
		dischargeService = " - " + $('#dischargeServiceCode option:selected').text();
	
	var cities = "";
	if($('#blOriginCityCodeDescription').val()!='')
		cities = $('#blOriginCityCode').val();
	if($('#originPortCityCodeDescription').val()!='')
	{
		if(cities=='')
			cities = $('#originPortCityCode').val();
		else
			cities = cities + " - " + $('#originPortCityCode').val();
	}
	if($('#destinationPortCityCodeDescription').val()!='')
	{
		if(cities=='')
			cities = $('#destinationPortCityCode').val();
		else
			cities = cities + " - " + $('#destinationPortCityCode').val();
	}
	if($('#blDestinationCityCodeDescription').val()!='')
	{
		if(cities=='')
			cities = $('#blDestinationCityCode').val();
		else
			cities = cities + " - " + $('#blDestinationCityCode').val();
	}
	if(cities!='')
		cities = " | " + cities;
	
	var vvd = "";
	if($('#vessel').val()!='')
		vvd = " | " + $('#vessel').val() + " " + $('#voyage').val() + " " + $('#direction').val();
	
	displayText = loadService + dischargeService + cities + vvd;
	setAccordianTabDetails('routingHeader', displayText);	
}

function validateRoutingFieldsOnSave()
{
	var isValid = true;
	
	/*if($('#bookingStatusCode :selected').val()=='APPR')
	{*/
		if($('#loadServiceCode :selected').val()=='')
		{
			if(!$('#maintainShipmentRouting').is(':visible'))
				expandRoutingDiv();
			$('#loadServiceCode').validationEngine('showPrompt', 'Load Service is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#dischargeServiceCode :selected').val()=='')
		{
			if(!$('#maintainShipmentRouting').is(':visible'))
				expandRoutingDiv();
			$('#dischargeServiceCode').validationEngine('showPrompt', 'Discharge service is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#originPortCityCode').val()=='' || $('#originPortCityCodeDescription').val()=='')
		{
			if(!$('#maintainShipmentRouting').is(':visible'))
				expandRoutingDiv();
			$('#originPortCityCodeDescription').validationEngine('showPrompt', 'Origin Port is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#destinationPortCityCode').val()=='' || $('#destinationPortCityCodeDescription').val()=='')
		{
			if(!$('#maintainShipmentRouting').is(':visible'))
				expandRoutingDiv();
			$('#destinationPortCityCodeDescription').validationEngine('showPrompt', 'Destination Port is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#vessel').val()=='' && $('#voyage').val()=='' && $('#direction').val()=='')
		{
			if(!$('#maintainShipmentRouting').is(':visible'))
				expandRoutingDiv();
			$('#vvdLabel').validationEngine('showPrompt', 'VVD is required', 'error', 'topRight', true);
			isValid = false;
		}
	//}
	
	if(($('#vessel').val()=='' || $('#voyage').val()=='' || $('#direction').val()=='')
			&& ($('#vessel').val()!='' || $('#voyage').val()!='' || $('#direction').val()!=''))
	{
		if(!$('#maintainShipmentRouting').is(':visible'))
			expandRoutingDiv();
		$('#vvdLabel').validationEngine('showPrompt', 'VVD is invalid', 'error', 'topRight', true);
		isValid = false;
	}
	return isValid;
}

function expandRoutingDiv()
{
	collapseAll();
	window.scrollTo(0, 0);
	$('#maintainShipmentRouting').css('display', 'block');
	//$('#routingLink').trigger('click');
}

function setDomesticForeignIndicator()
{
	if($('#tradeCode').val()!='')
	{
		if($('#tradeCode').val()=='G' || $('#tradeCode').val()=='M')
		{
			domesticForeignIndicator =  "international";
			
			checkDestinationPortDefaultValue();
			checkPlaceOfDeliveryDefaultValue();
			checkOriginPtDefaultValue();
			checkIssuePtDefaultValue();
		}
		else if($('#tradeCode').val()=='F')
		{
			if($('#originPortCityCode').val()=='')
			{
				domesticForeignIndicator =  'none';
				
				checkDestinationPortDefaultValue();
				checkPlaceOfDeliveryDefaultValue();
				checkOriginPtDefaultValue();
				checkIssuePtDefaultValue();
			}
			else
			{
				$.ajax({
					url: "/gates/shipment/routing/validateChinaTrade?cityCode="+$('#originPortCityCode').val(),
					success: function(responseText){
						if(responseText.data=="Y")
							domesticForeignIndicator =  "china";
						else
							domesticForeignIndicator = "international";
						
						checkDestinationPortDefaultValue();
						checkPlaceOfDeliveryDefaultValue();
						checkOriginPtDefaultValue();
						checkIssuePtDefaultValue();
					}
				});
			}
		}
		else
		{
			domesticForeignIndicator = "domestic";
			
			checkDestinationPortDefaultValue();
			checkPlaceOfDeliveryDefaultValue();
			checkOriginPtDefaultValue();
			checkIssuePtDefaultValue();
		}
	}
	else
	{
		domesticForeignIndicator = 'none';
		
		checkDestinationPortDefaultValue();
		checkPlaceOfDeliveryDefaultValue();
		checkOriginPtDefaultValue();
		checkIssuePtDefaultValue();
	}
}
	function setRoutingDiv() {
		var displayText = "Routing VVD";

		var loadService = "";
		if ($('#loadServiceCode :selected').val() != '')
			loadService = " - " + $('#loadServiceCode option:selected').text();
		var dischargeService = "";
		if ($('#dischargeServiceCode :selected').val() != '')
			dischargeService = " - "
					+ $('#dischargeServiceCode option:selected').text();

		var cities = "";
		if ($('#blOriginCityCodeDescription').val() != '')
			cities = $('#blOriginCityCode').val();
		if ($('#originPortCityCodeDescription').val() != '') {
			if (cities == '')
				cities = $('#originPortCityCode').val();
			else
				cities = cities + " - " + $('#originPortCityCode').val();
		}
		if ($('#destinationPortCityCodeDescription').val() != '') {
			if (cities == '')
				cities = $('#destinationPortCityCode').val();
			else
				cities = cities + " - " + $('#destinationPortCityCode').val();
		}
		if ($('#blDestinationCityCodeDescription').val() != '') {
			if (cities == '')
				cities = $('#blDestinationCityCode').val();
			else
				cities = cities + " - " + $('#blDestinationCityCode').val();
		}
		if (cities != '')
			cities = " | " + cities;

		var vvd = "";
		if ($('#vessel').val() != '')
			vvd = " | " + $('#vessel').val() + " " + $('#voyage').val() + " "
					+ $('#direction').val();

		displayText = displayText + loadService + dischargeService + cities + vvd;
		setAccordianTabDetails('routingHeader', displayText);
	}

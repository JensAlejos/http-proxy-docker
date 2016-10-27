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
var isBillingVoyageVVD="";//for accordian of vvd

$(function() {

	if("true" == $("#isInBond").val() ) {
		$("#inbondNumber").attr('disabled', false);
	} else {
		$("#inbondNumber").attr('disabled', true);
	}
	
	$('#requiredDeliveryDate').attr('disabled', true);
	// $('#milRequiredDeliveryDate').attr('disabled', true);
	
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
		// $('#milRequiredDeliveryDate').val($(this).val());
	});
	
	$('#isInBond').change(function(){
		if("true" == $("#isInBond").val() ) {
			$("#inbondNumber").attr('disabled', false);
		} else {
			$("#inbondNumber").val('');
			$("#inbondNumber").attr('disabled', true);
			
		}
	});
	

	// AutoComplete and lookup for BL Origin
	$('#blOriginCityCodeDescription')
	.gatesAutocomplete(
			{
				source : _context
						+ '/tm/Autocomplete/autoCompCityPredictive',
						formatItem : function(item) {
							if(item.stateCode != " " && item.stateCode != undefined){
								return item.cityCode+"-"+item.cityName+","+item.stateCode;	
							}
							else{
								return item.cityCode+"-"+item.cityName;
							}
								// return
								// item.cityCode+"-"+item.cityName+","+item.stateCode;
						},
						formatResult: function(item) {
							if(item.stateCode != " " && item.stateCode != undefined){
								return item.cityCode+"-"+item.cityName+","+item.stateCode;	
							}
							else{
								return item.cityCode+"-"+item.cityName;
							}
								// return
								// item.cityCode+"-"+item.cityName+","+item.stateCode;
						},
				select : function(item) {
					$('#blOriginCityCode').val(item.cityCode);
					var desc="";
					if(item.stateCode!=""  && item.stateCode!= undefined )
					{
						desc=item.cityName+","+item.stateCode;
					}
					else
					{
						desc=item.cityName;
					}
					$('#blOriginCityDescription').val(desc);
					setPlaceOfReceiptDefaultValue();
					$("#isOverrideBlOrigin").attr("checked", false);
					$('#overrideBlOrigin').css('color','black');
					// $('#originPortCityCodeDescription').val(item.cityCode+"-"+item.cityName);
					originPortCityChangeFunction(item.cityCode);
					setSaveBillBeforeBillButton();
				},
				autoSelectFirst:true,
				autoSelectCriteria:function(item){
					if(item.cityCode.toUpperCase()==$('#blOriginCityCodeDescription').val().toUpperCase())
						{
						return true;
						}
					else
						{
						return false;
						}
				}
			});

$('#blOriginCityCodeDescription').gatesPopUpSearch({
func : function() {
	placePopupSearch($('#blOriginCityCode').val(), 2);
	
}
});


$('#blOriginCityCodeDescription').blur(function() { 
	var tempDesc = $('#blOriginCityCodeDescription').val();
/*	if(tempDesc!="" && tempDesc.indexOf(",")>0){
		var tempArr = tempDesc.split(",");	
		tempDesc = tempArr[0];
	} */
	if($('#blOriginCityCode').val() == "") {
				$('#blOriginCityCodeDescription').val('');
				$('#blOriginCityDescription').val(''); resetOriginalOrgValues(); } else
				if($('#blOriginCityCodeDescription').val() == '') {
				$('#blOriginCityCode').val('');
				$('#blOriginCityDescription').val(''); resetOriginalOrgValues(); } else
				if($('#blOriginCityCode').val()+"-"+$('#blOriginCityDescription').val()!=tempDesc) {
				$('#blOriginCityCode').val('');
				$('#blOriginCityDescription').val('');
				$('#blOriginCityCodeDescription').val(''); resetOriginalOrgValues(); }
});
/////////////////Temp////////////////

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
										// return
										// item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
								formatResult: function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										// return
										// item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
						select : function(item) {
							var desc="";
							$('#originPortCityCode').val(item.cityCode);
							if(item.stateCode != " " && item.stateCode != undefined)
							{
								desc =  item.cityName+","+item.stateCode;	
							}
							else
							{
								desc = item.cityName;
							}
							$('#originPortCityDescription').val(desc);
							// $('#originPortCityCodeDescription').val(item.cityCode+"-"+item.cityName);
							setOriginPortDefaultValue();
							$('#isOverrideOriginPort').attr("checked", false);
							$('#overrideOriginPort').css('color','black');
							originPortCityChangeFunction(item.cityCode);
							setSaveBillBeforeBillButton();
						},
						autoSelectFirst:true,
						autoSelectCriteria:function(item){
							if(item.cityCode.toUpperCase()==$('#originPortCityCodeDescription').val().toUpperCase())
								{
								return true;
								}
							else
								{
								return false;
								}
						}
					});

	$('#originPortCityCodeDescription').gatesPopUpSearch({
		func : function() {
			/*
			 * if($('#tradeCode').val()=='') alert("Please enter a valid
			 * trade"); else
			 */
				portPopupSearch($('#originPortCityCodeDescription').val(), 3);
		}
	});

	
	 $('#originPortCityCodeDescription').blur(function() { 
		 var tempDesc = $('#originPortCityCodeDescription').val();
		 //Commented below lines as part of Defect D025769
			/*if(tempDesc!="" && tempDesc.indexOf(",")>0){
				var tempArr = tempDesc.split(",");	
				tempDesc = tempArr[0];
			} */
		 if($('#originPortCityCode').val() == "") {
			  $('#originPortCityCodeDescription').val('');
			 $('#originPortCityDescription').val(''); resetOriginalOrgValues(); } else
			 if($('#originPortCityCodeDescription').val() == '') {
			  $('#originPortCityCode').val('');
			  $('#originPortCityDescription').val(''); resetOriginalOrgValues(); } else
			  if($('#originPortCityCode').val()+"-"+$('#originPortCityDescription').val()!=tempDesc) {
			  $('#originPortCityCode').val('');
			  $('#originPortCityDescription').val('');
			  $('#originPortCityCodeDescription').val(''); resetOriginalOrgValues(); }
	 });
	 
	
	
	

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
										// return
										// item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
								formatResult: function(item) {
									if(item.stateCode != " " && item.stateCode != undefined){
										return item.cityCode+"-"+item.cityName+","+item.stateCode;	
									}
									else{
										return item.cityCode+"-"+item.cityName;
									}
										// return
										// item.cityCode+"-"+item.cityName+","+item.stateCode;
								},
						select : function(item) {
							var desc="";
							$('#destinationPortCityCode').val(item.cityCode);
							if(item.stateCode!="" && item.stateCode!=undefined)
							{
								desc=item.cityName+","+item.stateCode;
							}
							else
							{
							    desc=item.cityName;
							}
							$('#destinationPortCityDescription').val(desc);
						//	$('#destinationPortCityCodeDescription').val(item.cityCode+"-"+item.cityName);
							//D026523
							if(!$('#isOverrideDestinationPort').attr("checked"))
							{
							setDestinationPortDefaultValue();
							$('#isOverrideDestinationPort').attr("checked", false);
							$('#overrideDestinationPort').css('color','black');
							}
							destinationPortCityChangeFunction(item.cityCode);
							
							setSaveBillBeforeBillButton();
						},
						autoSelectFirst:true,
						autoSelectCriteria:function(item){
							if(item.cityCode.toUpperCase()==$('#destinationPortCityCodeDescription').val().toUpperCase())
								{
								return true;
								}
							else
								{
								return false;
								}
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

	$('#destinationPortCityCodeDescription').blur(function() {
		var tempDesc = $('#destinationPortCityCodeDescription').val();
		//Commented below lines of code as part of defect D025769
		/*if(tempDesc!="" && tempDesc.indexOf(",")>0){
			var tempArr = tempDesc.split(",");	
			tempDesc = tempArr[0];
		} */
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
		else if($('#destinationPortCityCode').val()+"-"+$('#destinationPortCityDescription').val()!=tempDesc)
		{
			$('#destinationPortCityCode').val('');
			$('#destinationPortCityDescription').val('');
			$('#destinationPortCityCodeDescription').val('');
			resetOriginalDestValues();
		}
	});

	// Autocompleter and lookup for BL Destination
	$('#blDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		mustMatch:true,
		formatItem : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			var desc="";
			$('#blDestinationCityCode').val(item.cityCode);
			if(item.stateCode!="" && item.stateCode!=undefined)
			{
				desc=item.cityName+","+item.stateCode;
			}
			else
			{
				desc=item.cityName;
			}
			$('#blDestinationCityDescription').val(desc);
		//	$('#blDestinationCityCodeDescription').val(item.cityCode+"-"+item.cityName);
			destinationPortCityChangeFunction(item.cityCode);
			setPlaceOfDeliveryDefaultValue();
			$('#isOverrideBlDestination').attr("checked", false);
			$('#overrideBlDestination').css('color','black');
			validateCity('blDestinationCity');
			setSaveBillBeforeBillButton();
		},
		autoSelectFirst:true,
		autoSelectCriteria:function(item){
			if(item.cityCode.toUpperCase()==$('#blDestinationCityCodeDescription').val().toUpperCase())
				{
				return true;
				}
			else
				{
				return false;
				}
		},
		onBlur:function(){
			var tempDesc = $('#blDestinationCityCodeDescription').val();
			/*if(tempDesc!="" && tempDesc.indexOf(",")>0){
				var tempArr = tempDesc.split(",");	
				tempDesc = tempArr[0];
			}  */
			
			if ($('#blDestinationCityCode').val() == "")
			{
				$('#blDestinationCityCodeDescription').val('');
			}
			else if($('#blDestinationCityCodeDescription').val() == '')
			{
				$('#blDestinationCityCode').val('');
				$('#blDestinationCityDescription').val('');
			}
			else if($('#blDestinationCityCode').val()+"-"+$('#blDestinationCityDescription').val()!=tempDesc)
			{
				$('#blDestinationCityCode').val('');
				$('#blDestinationCityDescription').val('');
				$('#blDestinationCityCodeDescription').val('');
			}
		}
	});

	$('#blDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#blDestinationCityCodeDescription').val(), 5);
		}
	});

	/*$('#blDestinationCityCodeDescription').blur(function() {
		
		var tempDesc = $('#blDestinationCityCodeDescription').val();
		if(tempDesc!="" && tempDesc.indexOf(",")>0){
			var tempArr = tempDesc.split(",");	
			tempDesc = tempArr[0];
		}
		
		if ($('#blDestinationCityCode').val() == "")
		{
			$('#blDestinationCityCodeDescription').val('');
		}
		else if($('#blDestinationCityCodeDescription').val() == '')
		{
			$('#blDestinationCityCode').val('');
			$('#blDestinationCityDescription').val('');
		}
		else if($('#blDestinationCityCode').val()+"-"+$('#blDestinationCityDescription').val()!=tempDesc)
		{
			$('#blDestinationCityCode').val('');
			$('#blDestinationCityDescription').val('');
			$('#blDestinationCityCodeDescription').val('');
		}
//		checkPlaceOfDeliveryDefaultValue();
//		setRoutingHeader();
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
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		select : function(item) {
			$('#freightOriginCityCode').val(item.cityCode);
			$('#freightOriginCityDescription').val(item.cityName);
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
			setSaveBillBeforeBillButton();
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
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
				// return item.cityCode+"-"+item.cityName+","+item.stateCode;
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
		clearAllMessage();
		if($('#shipmentId').val()!='' && loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/beforeServiceUpdate",
				data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode, marker:marker},
				success: function(responseTextFirst){
					if(responseTextFirst.success)
					{
						beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode,responseTextFirst);
						showResponseMessages('msgDiv', responseTextFirst);
					}
					else
					{
						showResponseMessages('msgDiv', responseTextFirst);
						$('#loadServiceCode').val(lastLoadService);
						$('#dischargeServiceCode').attr("disabled", false);
					}
				}
			});
		}
		else
			beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode,null);
	});
	
	$('#dischargeServiceCode').change(function() {
		var loadServiceCode = $('#loadServiceCode :selected').val();
		var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
		var marker = "discharge";
		$('#loadServiceCode').attr("disabled", true);
		clearAllMessage();
		if($('#shipmentId').val()!='' && dischargeServiceCode!='' && loadServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/beforeServiceUpdate",
				data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode, marker:marker},
				success: function(responseTextFirst){
					if(responseTextFirst.success)
					{
						showResponseMessages('msgDiv', responseTextFirst);
						beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode,responseTextFirst);
					}
					else
					{
						showResponseMessages('msgDiv', responseTextFirst);
						$('#dischargeServiceCode').val(lastDischargeService);
						$('#loadServiceCode').attr("disabled", false);
					}
				}
			});
		}
		else
			beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode,null);
	});

	/*
	 * $('#isInBond').change(function() { if($('#loadServiceCode').val()!='' &&
	 * $('#dischargeServiceCode').val()!=''){ $.ajax({ url: _context
	 * +"/shipment/routing/isInbondAllowed?inBond="+$("#isInBond
	 * option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
	 * success: function(responseText){ //if(responseText.success==false)
	 * showResponseMessages('msgDiv', responseText); } }); }
	 * 
	 * if($('#isInBond :selected').val()==true || $('#isInBond
	 * :selected').val()=='true') { $('#inbondNumber').attr("disabled", false);
	 * //add bond clause code $.ajax({ url: _context
	 * +"/booking/clause/addBondClause", success: function(responseText){
	 * $("#gridIdForClauses").setGridParam({rowNum : 3, datatype :
	 * "json"}).trigger("reloadGrid"); } }); } else {
	 * $('#inbondNumber').val(""); $('#inbondNumber').attr("disabled", true);
	 * //remove bond clause code $.ajax({ url: _context
	 * +"/booking/clause/removeBondClause", success: function(responseText){
	 * $("#gridIdForClauses").setGridParam({rowNum : 3, datatype :
	 * "json"}).trigger("reloadGrid"); } }); } });
	 */
	
	/*
	 * $('#inbondNumber').change(function() { if($('#inbondNumber').val()!='') {
	 * if(!validateForPositiveIntegers($('#inbondNumber').val())) {
	 * $('#inbondNumber').val(''); alert("Please enter only positive integers
	 * for Inbond Number"); } } });
	 */
	
	/*
	 * $('#isOverland').change(function() { $.ajax({ url: _context
	 * +"/shipment/routing/getOverland?overland="+$("#isOverland
	 * option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
	 * success: function(responseText){ //if(responseText.success==false)
	 * showResponseMessages('msgDiv', responseText); } }); });
	 */

	$('#overridePickupCarrierCode').change(function(){
		//D027141
		if($('#overridePickupCarrierCode').val()!='' && $('#blOriginCityCode').val()=='' && $('#loadServiceCode :selected').val()!='DCY' && $('#pickupZone').val()=='')
		{
		$('#overridePickupCarrierCode').val('');
		alert("Override not allowed for pickup");
		}
		
		else if($('#overridePickupCarrierCode').val()!='')
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
						// showResponseMessages('msgDiv', responseText);
					}
					showResponseMessages('msgDiv', responseText);
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
						// showResponseMessages('msgDiv', responseText);
					}
					showResponseMessages('msgDiv', responseText);
				}
			});
		}
	});
	//D024236: 	Maintain Bill: TSRC
	$('#actualPickupCarrierCode').gatesPopUpSearch({
		func : function() {
			var tariff = $("#tariffNumber").val();
			var item = $("#itemNumber").val();
			var type = '';
			var size = '';
			var height = '';
			var city = $("#blOriginCityCodeDescription").val();
			var port = $("#originPortCityCodeDescription").val();
			var rateDate = $("#rateDate").val();
			var frtRcvdDate = $("#freightReceivedDate").val();
			
			carrierPopupSearch(rateDate, frtRcvdDate, $('#overridePickupCarrierCode').val(), 
					tariff, item, type,  size, height, city, "O", port);
		}
	});
	
	$('#actualDeliveryCarrierCode').gatesPopUpSearch({
		func : function() {
			var tariff = $("#tariffNumber").val();
			var item = $("#itemNumber").val();
			var type = '';
			var size = '';
			var height = '';
			var city = $("#blDestinationCityCodeDescription").val();
			var port = $("#destinationPortCityCodeDescription").val();
			var rateDate = $("#rateDate").val();
			var frtRcvdDate = $("#freightReceivedDate").val();
			
			carrierPopupSearch(rateDate, frtRcvdDate, $('#overrideDeliveryCarrierCode').val(), 
					tariff, item, type,  size, height, city, "D", port);
		}
	});

});

/** ******** Supporting functions ********* */
function beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode,response)
{// alert("In side beforeLoadServiceUpdate");
	if(($("#commodityGrid").getGridParam("reccount")!='undefined' && $("#commodityGrid").getGridParam("reccount")>0)
			|| ($("#povGrid").getGridParam("reccount")!='undefined' && $("#povGrid").getGridParam("reccount")>0))
	{// alert("In side commodityGrid");
		if(loadServiceCode!='' && dischargeServiceCode!='' && null!=response)
		{

			var oldLDSGroup = $('#loadDschServiceGroupCode').val();
			var newLDSGroup = response.data.loadDschServiceGroupCode;
			if($.trim(oldLDSGroup)!=$.trim(newLDSGroup))
			{
				
					//removeCommodities();
					if( $.trim(newLDSGroup)!="CON" || $.trim(newLDSGroup)!="LCL"){	
						var r = confirm("load discharge group type is being changed.  Units/containers will be unlinked from the bill.");
						if(r){
						removeShipmentFreight();
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						$('#shipmentSaveBtn').trigger("click");
						}else{
							$('#dischargeServiceCode').attr("disabled", false);
							$('#loadServiceCode').val(lastLoadService);
						}
					}else{
						var r = confirm("Load discharge group type is being changed");
						if(r){
						removeShipmentReceivedFreight();
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						$('#shipmentSaveBtn').trigger("click");
						}else{
							$('#dischargeServiceCode').attr("disabled", false);
							$('#loadServiceCode').val(lastLoadService);
						}
					}			
			}
			else{
				setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
				loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
				//Commented for D024063
				/* $('#tariffNumber').val("");
				   $('#tariffCheck').val(""); */
			}
				
		
		}else if(loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
				success: function(responseText){
					var oldLDSGroup = $('#loadDschServiceGroupCode').val();
					var newLDSGroup = responseText.data.loadDschServiceGroupCode;
					if($.trim(oldLDSGroup)!=$.trim(newLDSGroup))
					{
						
							//removeCommodities();
							if($.trim(newLDSGroup) != "CON" || $.trim(newLDSGroup) != "LCL"){
								var r = confirm("load discharge group type is being changed.  Units/containers will be unlinked from the bill.");
								if(r)
								{
								removeShipmentFreight();
								setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
								loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
								$('#shipmentSaveBtn').trigger("click");
								}
								else
								{
									$('#dischargeServiceCode').attr("disabled", false);
									$('#loadServiceCode').val(lastLoadService);
								}
							}else{
								var r = confirm("Load discharge group type is being changed");
								if(r)
								{							
								removeShipmentReceivedFreight();
								setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
								loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
								$('#shipmentSaveBtn').trigger("click");
								}
								else
								{
									$('#dischargeServiceCode').attr("disabled", false);
									$('#loadServiceCode').val(lastLoadService);
								}
							}							
					}
					else{
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						//Commented for D024063
						/* $('#tariffNumber').val("");
						   $('#tariffCheck').val(""); */
					}
						
				}
			});
		}
		else
		{
			/*
			 * var r = confirm("Load discharge group code is being changed.
			 * Delete commodities?"); if(r) { removeCommodities();
			 */
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
				loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
				
			/*
			 * } else { $('#dischargeServiceCode').attr("disabled", false);
			 * $('#loadServiceCode').val(lastLoadService); }
			 */
		}
	}
	else{
	//D024735, Fix for place of receipt not available although the error mssg says it needs it.
		setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
		loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
		//Commented for D024063
		/* $('#tariffNumber').val("");
		   $('#tariffCheck').val(""); */
	}
		
}

function beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode,response)
{
	if(($("#commodityGrid").getGridParam("reccount")!='undefined' && $("#commodityGrid").getGridParam("reccount")>0)
			|| ($("#povGrid").getGridParam("reccount")!='undefined' && $("#povGrid").getGridParam("reccount")>0))
	{
		if(loadServiceCode!='' && dischargeServiceCode!='' && null!=response)
		{

			if($.trim($('#loadDschServiceGroupCode').val())!=$.trim(response.data.loadDschServiceGroupCode))
			{
				
					//removeCommodities();
					if($.trim(newLDSGroup) != "CON" || $.trim(newLDSGroup) != "LCL"){
						var r = confirm("load discharge group type is being changed.  Units/containers will be unlinked from the bill.");
						if(r)
						{
						removeShipmentFreight();
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
						dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
						$('#shipmentSaveBtn').trigger("click");
						}
						else
						{
							$('#loadServiceCode').attr("disabled", false);
							$('#dischargeServiceCode').val(lastDischargeService);
						}
					}else{
						var r = confirm("Load discharge group type is being changed.");
						if(r)
						{
						removeShipmentReceivedFreight();
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
						dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
						$('#shipmentSaveBtn').trigger("click");
						}
						else
						{
							$('#loadServiceCode').attr("disabled", false);
							$('#dischargeServiceCode').val(lastDischargeService);
						}
					}				
			}
			else{
				setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
				dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
				//Commented for D024063
				/* $('#tariffNumber').val("");
				   $('#tariffCheck').val(""); */
			}
				
		}else if(loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
				success: function(responseText){
					if($.trim($('#loadDschServiceGroupCode').val())!=$.trim(responseText.data.loadDschServiceGroupCode))
					{
						
							//removeCommodities();
							if($.trim(newLDSGroup) != "CON" || $.trim(newLDSGroup) != "LCL"){
								var r = confirm("load discharge group type is being changed.  Units/containers will be unlinked from the bill.");
								if(r)
								{
									removeShipmentFreight();
									setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
									dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
									$('#shipmentSaveBtn').trigger("click");
								}
								else
								{
									$('#loadServiceCode').attr("disabled", false);
									$('#dischargeServiceCode').val(lastDischargeService);
								}
							}else{
								var r = confirm("Load discharge group type is being changed");
								if(r)
								{
									removeShipmentReceivedFreight();
									setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
									dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
									$('#shipmentSaveBtn').trigger("click");
								}
								else
								{
									$('#loadServiceCode').attr("disabled", false);
									$('#dischargeServiceCode').val(lastDischargeService);
								}
							}							
					}
					else{
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
						//Commented for D024063
						/* $('#tariffNumber').val("");
						   $('#tariffCheck').val("");  */
					}
						
				}
			});
		}
		else
		{
			/*
			 * var r = confirm("Load discharge group code is being changed.
			 * Delete commodities?"); if(r) { removeCommodities();
			 */
			//Defect-24735 Modified to enable place of receipt field.
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);
				dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*
			 * } else { $('#loadServiceCode').attr("disabled", false);
			 * $('#dischargeServiceCode').val(lastDischargeService); }
			 */
		}
	}
	else{
		setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, response);//Defect-24735 Modified to enable place of receipt field.
		dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
		// Commented for D024063
		/* $('#tariffNumber').val("");
		   $('#tariffCheck').val("");  */
	}
		
}

function loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode)
{
	lastLoadService = loadServiceCode;
	
	if(loadServiceCode!=null && loadServiceCode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getDischargeServicesWithDesc?loadService="+loadServiceCode,
			success: function(responseText){
					$('#dischargeServiceCode').attr("disabled", false);
					setLoadDischargeValuesWithDesc(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
					// setLoadDischargeGroupCode(loadServiceCode,
					// dischargeServiceCode);
					setRoutingHeader();
					
					var queryString = $('#shipmentForm').formSerialize();
					$.ajax({
						url: _context +"/shipment/routing/validateUpdateService",
						type: "POST",
						data: queryString,
						success: function(responseTextNew){
							/*
							 * if(responseTextNew.success==false) {
							 */
								showResponseMessages('msgDiv', responseTextNew);
							/* } */
						}
					});
					
					//D026685
					if(loadServiceCode=='P')
					{
					$('#pickupZipCode').val($('input[name="shipper\\.zip"]').val());
					validateZip('pickup');
					}
				}
			});
		}
		else
		{
			$.ajax({
				url: _context +"/shipment/routing/getAllDischargeServicesWithDesc",
				success: function(responseText){
					$('#dischargeServiceCode').attr("disabled", false);
					setLoadDischargeValuesWithDesc(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
					// setLoadDischargeGroupCode(loadServiceCode,
					// dischargeServiceCode);
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
			url: _context +"/shipment/routing/getLoadServicesWithDesc?dischargeService="+dischargeServiceCode,
			success: function(responseText){
				$('#loadServiceCode').attr("disabled", false);
				//setLoadDischargeValuesWithDesc(responseText.data, '#loadServiceCode', loadServiceCode);
				// setLoadDischargeGroupCode(loadServiceCode,
				// dischargeServiceCode);
				setRoutingHeader();
				
				var queryString = $('#shipmentForm').formSerialize();
				$.ajax({
					url: _context +"/shipment/routing/validateUpdateService",
					type: "POST",
					data: queryString,
					success: function(responseTextNew){
						/*
						 * if(responseTextNew.success==false) {
						 */
							showResponseMessages('msgDiv', responseTextNew);
						/* } */
					}
				});
				//D026291
				if(dischargeServiceCode=='P')
				{
				//$('#deliveryZipCode').val($('input[name="consignee\\.zip"]').val());
				$('#deliveryZipCode').val($('input[name="consignee\\.zip"]').val().substring(0,5));
				validateZip('delivery');
				}
			
			}
		});
	}
	else
	{
		$.ajax({
			url: _context +"/shipment/routing/getAllLoadServicesWithDesc",
			success: function(responseText){
				$('#loadServiceCode').attr("disabled", false);
				setLoadDischargeValuesWithDesc(responseText.data, '#loadServiceCode', loadServiceCode);
				// setLoadDischargeGroupCode(loadServiceCode,
				// dischargeServiceCode);
				setRoutingHeader();
			}
		});
	}
}

function clearItemCustomerCommodityLSDSChange(){
	// D029821, clear customer Commodity
	//window.itemList = null;
	$.ajax({
		async:false,
		 type:"GET",
		 url:_context+"/shipmentCommodity/clearCommodity",
		success: function(responseText){
		}
	
		});
}

function portPopupSearch(place, id) {
	if(!($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isRoutingModifiable==false)){
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param
			+ "|" + "Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
	}
}

function placePopupSearch(place, id) {
	if(!($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isRoutingModifiable==false)){
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param;
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
	}
}

function carrierPopupSearch(rateDate, recievedDate, value, tariff, item, type,  size, height, city, source, port){
	var param =  rateDate + '|' + recievedDate + '|' + value + '|' + tariff + '|' + item + '|' + type 
				+ '|'+ size + '|' + height + '|' + city + '|' + source + '|' + port;
	var actionUrl = _context + "/cas/carrierCodeSearch.do?params=" + param + "&frtRcvdDt=" + recievedDate;
	var windowStyle = 'top=0,left=0,height=600,width=1100,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CarrierCodeSearch', windowStyle);
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
		$('#blOriginCityCodeDescription').val(value);
		$('#blOriginCityDescription').val(cityName);
		$('#blOriginCityCode').val(cityCode);
		$('#blOriginCityDescription').val(item.cityName);
		setPlaceOfReceiptDefaultValue();
		$("#isOverrideBlOrigin").attr("checked", false);
		$('#overrideBlOrigin').css('color','black');
		validateCity('blOriginCity');
	}
	if (_callingFunc == '3') {
		$('#originPortCityCodeDescription').val(value);
		$('#originPortCityDescription').val(cityName);
		$('#originPortCityCode').val(cityCode);
		setOriginPortDefaultValue();
		$('#isOverrideOriginPort').attr("checked", false);
		$('#overrideOriginPort').css('color','black');
		originPortCityChangeFunction(cityCode);
	}
	if (_callingFunc == '4') {
		$('#destinationPortCityCodeDescription').val(value);
		$('#destinationPortCityDescription').val(cityName);
		$('#destinationPortCityCode').val(cityCode);
		destinationPortCityChangeFunction(cityCode);
		setDestinationPortDefaultValue();
		$('#isOverrideDestinationPort').attr("checked", false);
		$('#overrideDestinationPort').css('color','black');
	}
	if (_callingFunc == '5') {
		$('#blDestinationCityCodeDescription').val(value);
		$('#blDestinationCityDescription').val(cityName);
		$('#blDestinationCityCode').val(cityCode);
		setPlaceOfDeliveryDefaultValue();
		$('#isOverrideBlDestination').attr("checked", false);
		$('#overrideBlDestination').css('color','black');
		validateCity('blDestinationCity');
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

/*
 * function setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode) {
 * if(loadServiceCode!=null && loadServiceCode!='' && dischargeServiceCode!=null &&
 * dischargeServiceCode!='') { $.ajax({ url: _context
 * +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
 * success: function(responseText){
 * $('#loadDschServiceGroupCode').val(responseText.data.loadDschServiceGroupCode);
 * //Block commented by Mangesh
 * $('#isAllowBookingUnit').val(responseText.data.isAllowBookingUnit);
 * if($('#loadDschServiceGroupCode').val()=='CON') {
 * $('#convCgoApptCutoffDate').attr('disabled', false);
 * $('#convCgoApptCutoffTime').attr('disabled', false);
 * $('#convCgoEstArrivalDate').attr('disabled', false);
 * $('#convCgoEstArrivalTime').attr('disabled', false);
 * $('#requiredDeliveryDate').attr('disabled', false);
 * $('#milRequiredDeliveryDate').attr('disabled', false);
 * $('#requiredDeliveryDate').val('01-01-0001');
 * $('#milRequiredDeliveryDate').val('01-01-0001'); } else {
 * $('#convCgoApptCutoffDate').val(''); $('#convCgoApptCutoffTime').val('');
 * $('#convCgoEstArrivalDate').val(''); $('#convCgoEstArrivalTime').val('');
 * $('#requiredDeliveryDate').val(''); $('#milRequiredDeliveryDate').val('');
 * 
 * $('#convCgoApptCutoffDate').attr('disabled', true);
 * $('#convCgoApptCutoffTime').attr('disabled', true);
 * $('#convCgoEstArrivalDate').attr('disabled', true);
 * $('#convCgoEstArrivalTime').attr('disabled', true);
 * $('#requiredDeliveryDate').attr('disabled', true);
 * $('#milRequiredDeliveryDate').attr('disabled', true); } //Setting request
 * params for hold predictive search //holdPredictive();//Commented by Mangesh //
 * Setting IBS Code as mandatory incase of MBU
 * //$('#militaryIbsStatusCode').trigger("change"); } }); } else {
 * //$('#loadDschServiceGroupCode').val('');
 * 
 * //Setting request params for hold predictive search
 * //holdPredictive();//Commented by Mangesh // Setting IBS Code as mandatory
 * incase of MBU //$('#militaryIbsStatusCode').trigger("change"); } }
 */
function setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText)
{
	if(responseText!=null && responseText!=undefined && loadServiceCode!=null && 
			loadServiceCode!='' && dischargeServiceCode!=null && dischargeServiceCode!='')
	{
		$('#loadDschServiceGroupCode').val($.trim(responseText.data.loadDschServiceGroupCode));
		enableDisableActualTrucker();
		$('#isAllowBookingUnit').val(responseText.data.isAllowBookingUnit);
		$('#isRequireReceivedUnit').val(responseText.data.isRequireReceivedUnit);
		
		
		if(isRoutingModifiable && responseText.data.isRequireBlOrigin!='N')
			$('#blOriginCityCodeDescription').attr('disabled', false);
		else if(responseText.data.isRequireBlOrigin=='N'){
			$('#blOriginCityCode').val("");
			$('#blOriginCityDescription').val("");
			$('#blOriginCityCodeDescription').val("");
			$('#blOriginCityCodeDescription').attr('disabled', true);
		}
			
		
		if(isRoutingModifiable && responseText.data.isRequireBlDestination!='N')
			$('#blDestinationCityCodeDescription').attr('disabled', false);
		else if(responseText.data.isRequireBlDestination=='N'){
			$('#blDestinationCityCode').val("");
			$('#blDestinationCityDescription').val("");
			$('#blDestinationCityCodeDescription').val("");
			$('#blDestinationCityCodeDescription').attr('disabled', true);
		}
			
		
		if(isRoutingModifiable && responseText.data.isRequirePickupZipCode!='N')
			$('#pickupZipCode').attr('disabled', false);
		else if(responseText.data.isRequirePickupZipCode=='N'){
			$('#pickupZipCode').val("");
			$('#pickupZone').val("");
			$('#pickupZipCode').attr('disabled', true);
		}
			
		
		if(isRoutingModifiable && responseText.data.isRequireDeliveryZipCode!='N')
			$('#deliveryZipCode').attr('disabled', false);
		else if(responseText.data.isRequireDeliveryZipCode=='N'){
			$('#deliveryZipCode').val("");
			$('#deliveryZone').val("");
			$('#deliveryZipCode').attr('disabled', true);
		}
			
		
		
	}
	else
	{
		/*
		 * $('#loadDschServiceGroupCode').val('');
		 * $('#isAllowBookingUnit').val('');
		 * 
		 * if(isRoutingModifiable) {
		 * $('#blOriginCityCodeDescription').attr('disabled', false);
		 * $('#blDestinationCityCodeDescription').attr('disabled', false);
		 * $('#pickupZipCode').attr('disabled', false);
		 * $('#deliveryZipCode').attr('disabled', false); }
		 */
		
		// Disable freight
		// Freight
		/*
		 * disableAccordian(4); removeCurrentCommodity();
		 */
	}

	checkPlaceOfReceiptDefaultValue(); // adjust override
	checkPlaceOfDeliveryDefaultValue();

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
{// alert("URL: "+_context+"/shipment/deleteFreight?id=-1");
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
			// Defect 24735
			// Added code to remove "Shipment cannot be verified" error.
			$("#specialServiceGrid").trigger('reloadGrid');
		}	        
	 });
}
function removeShipmentFreight(){
	var rowIDs = jQuery("#commodityGrid").getDataIDs();
		if(rowIDs == undefined || rowIDs == 'undefined' || rowIDs.length < 1){
		rowIDs = jQuery("#convGrid").getDataIDs();
	}
	
	if(rowIDs != undefined || rowIDs != 'undefined' || rowIDs.length > 0){
		
		for (var i=0;i<rowIDs.length;i=i+1){ 
			$.ajax({
		url : _context +"/shipmentCommodity/actionDelete",
		type : "GET",
		data : {			
			shipmentFreightId: i+1
		},
		success : function(responseText) {
			if(responseText.success==true){
				$("#tariffNumber").val("");
				clearItemCustomerCommodityLSDSChange();
					$('#itemNumber').val("");
					$('#mixCommItem').val("");
					$('#note').val("");
			}
		}
		});
		}
	}
}
function removeShipmentReceivedFreight(){
	var rowIDs = jQuery("#commodityGrid").getDataIDs();
		if(rowIDs == undefined || rowIDs == 'undefined' || rowIDs.length < 1){
		rowIDs = jQuery("#convGrid").getDataIDs();
	}
	
	if(rowIDs != undefined || rowIDs != 'undefined' || rowIDs.length > 0){
		
		 
			$.ajax({
		url : _context +"/shipmentCommodity/removeRecievedFreight",
		type : "GET",
		data : {			
			shipmentFreightId: 1
		},
		success : function(responseText) {
			if(responseText.success==true){
				$("#tariffNumber").val("");
				clearItemCustomerCommodityLSDSChange();
				 $('#commodityDesc').val("");
				 $('#commodityCode').val("");
					$('#itemNumber').val("");
					$('#mixCommItem').val("");
					$('#note').val("");
				$("#containerCommodityDesc").val("");
				//$("#piece").val("");
			}
		}
		});
		
	}
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
		// fetchTradeValue();
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
		// fetchTradeValue();
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
	
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		url: _context +"/shipment/routing/validateCity?city="+selector,
		type : "POST",
		data : queryString,
		success: function(responseText){
			// D027074
			var trade = responseText.data.trade;
			if(trade && $("#tradeCode").val()!= trade) 
			{
				
				$("#tradeCode").val(trade);
				$("#tradeCodeDesc").html(trade+" - "+responseText.data.tradeDesc);
			}
			
			//changes for D024986
			$("#vvdRoutingGrid").trigger("reloadGrid");
				showResponseMessages('msgDiv', responseText);
				
				if(responseText.success && selector == 'destinationPortCity'){
					//deriveValidateVVD();
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
			showResponseMessages('msgDiv', responseText);
		}
	});
}
function deriveZone(selector)
{
	var portCode = "";
	var zipcode = "";
	var rateDate = isValidDate($('#rateDate').val());
	
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
		data : {portCode:portCode, zipcode:zipcode, rateDate: rateDate, selector:selector},
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
/*
 * function validateCity(selector) { var queryString =
 * $('#shipmentForm').formSerialize(); $.ajax({ url: _context
 * +"/shipment/routing/validateCity?city="+selector, type : "POST", data :
 * queryString, success: function(responseText){ showResponseMessages('msgDiv',
 * responseText); setRoutingHeader();
 * 
 * if(selector=='blOriginCity') { lastBlOriginCode =
 * $('#blOriginCityCode').val(); lastBlOriginDescription =
 * $('#blOriginCityDescription').val(); lastBlOriginCodeDescription =
 * $('#blOriginCityCodeDescription').val();
 * 
 * checkPickupCarrier(); checkPlaceOfReceiptDefaultValue();
 * checkOriginPtDefaultValue(); } else if(selector=='originPortCity') {
 * lastOriginPortCode = $('#originPortCityCode').val();
 * lastOriginPortDescription = $('#originPortCityDescription').val();
 * lastOriginPortCodeDescription = $('#originPortCityCodeDescription').val();
 * 
 * checkOriginPortDefaultValue(); setDomesticForeignIndicator(); } else
 * if(selector=='destinationPortCity') { lastDestinationPortCode =
 * $('#destinationPortCityCode').val(); lastDestinationPortDescription =
 * $('#destinationPortCityDescription').val();
 * lastDestinationPortCodeDescription =
 * $('#destinationPortCityCodeDescription').val();
 * 
 * checkDestinationPortDefaultValue(); checkPlaceOfDeliveryDefaultValue(); }
 * else if(selector=='blDestinationCity') checkPlaceOfDeliveryDefaultValue(); }
 * }); }
 */

function validateZip(selector)
{
	if($.trim($('#'+selector+"ZipCode").val())!='')
	{
		var portCode = "";
		var zipcode = "";
		var rateDate = isValidDate($('#rateDate').val());
		
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
			data : {portCode:portCode, zipcode:zipcode, rateDate: rateDate, selector:selector},
			success: function(responseText){
				showResponseMessages('msgDiv', responseText);
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
					var queryString = $('#shipmentForm').formSerialize();
					$.ajax({
						url: _context +"/shipment/routing/validateZip?zip="+selector,
						type : "POST",
						data : queryString,
						success: function(responseTextNew){
							showResponseMessages('msgDiv', responseTextNew);
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

function setLoadDischargeValuesWithDesc(listData, selector, value)
{
	value = $.trim(value);
	$(selector).children().remove();
	$(selector).append(
			"<option value='' title=''></option>");
	var flag = false;
	$.each(listData, function(intIndex, objValue) {
		if($.trim(objValue.code)==value)
			flag = true;
		$(selector).append($("<option/>", {
			value : $.trim(objValue.code),
			text : $.trim(objValue.code),
			title : $.trim(objValue.code)+"-"+$.trim(objValue.description)
		}));
	});
	if(flag == true)
		$(selector).val(value);
	
	if($(selector+' option:selected').attr("title")!=undefined)
		$(selector).attr("title", $(selector+' option:selected').attr("title"));
	else
		$(selector).attr("title", '');
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


/*
 * function validateOverride(selector) {alert($('#loadServiceCode
 * :selected').val()); alert($('#pickupZipCode').val());
 * if(selector=='overridePickupCarrierCode' && ($('#loadServiceCode
 * :selected').val()!='DCY' || $('#pickupZipCode').val()=='')) {
 * $("#"+selector).blur(); alert("Override not allowed for pickup"); } else
 * if(selector=='overrideDeliveryCarrierCode' && ($('#dischargeServiceCode
 * :selected').val()!='DCY' || $('#deliveryZipCode').val()=='')) {
 * $("#"+selector).blur(); alert("Override not allowed for delivery"); } }
 */

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
	/*
	 * if(selector=='#destinationPortCityCodeDescription') { var r = confirm("Do
	 * you wish to override existing destination port?"); if(!r){
	 * $(selector).blur(); } }
	 */
	/*
	 * else if(selector=='blOrigin' || selector=='blDestination') {
	 * if($("#"+selector+"CityCode").val()!='' && $('#shipmentId').val()!='') {
	 * $("#"+selector+'CityCodeDescription').attr("readonly", true);
	 * //alert("done"); $.ajax({ url: _context
	 * +"/shipment/routing/validateSpotPull", data :
	 * {cityCode:$("#"+selector+"CityCode").val(),
	 * bookingId:$('#shipmentId').val(), marker:selector}, success:
	 * function(responseText){ showResponseMessages('msgDiv', responseText);
	 * if(responseText.success==false) {
	 * $("#"+selector+'CityCodeDescription').blur(); if(selector=='blOrigin')
	 * $("#"+selector+'CityCodeDescription').val(lastBlOriginCodeDescription);
	 * else if(selector=='blDestination')
	 * $("#"+selector+'CityCodeDescription').val(lastBlDestinationCodeDescription); }
	 * 
	 * $("#"+selector+'CityCodeDescription').attr("readonly", false); } }); } }
	 */
}

//D027141
/*function validateOnKeyDown(evt, selector)
{
	var keyCode = event.keyCode;
	
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
		if(selector=='#overridePickupCarrierCode' && $(selector).val()=='' && $('#blOriginCityCode').val()=='' 
			&& $('#loadServiceCode :selected').val()!='DCY' && $('#pickupZone').val()=='')
		{
			$(selector).blur();
			alert("Override not allowed for pickup");
		}
	}
}*/
//D026558
function validateOnKeyDown(evt, selector)
{
var keyCode = event.keyCode;
	
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
	if(selector=='#vessel')
	{
	$('#voyage').val('') ;
	$('#direction').val('');
	}
	}
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
				showResponseMessages('msgDiv', responseText);
				if(responseText.success==false)
				{
					// showResponseMessages('msgDiv', responseText);
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
	checkPlaceOfReceiptDefaultValue();
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
					$('#msgDiv').html('');
					lastDestinationPortCode = "";
					lastDestinationPortDescription = "";
					lastDestinationPortCodeDescription = "";
				}
				else
				{
					$('#msgDiv').html('<div class="message_error">Destination Port cannot be updated as received units exist for shipment</div>');
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
	if($('#vessel').val()!=''){
			getIsBillingVoyage();
			if(isBillingVoyageVVD!="" && isBillingVoyageVVD!=null){
				vvd=" | "+isBillingVoyageVVD;
			}else{
				vvd = " | " + $('#vessel').val() + " " + $('#voyage').val() + " " + $('#direction').val();
			}
		
	}
	
	var sailDate = "";
	if($('#sailDate').val()!="")
		sailDate = " | " + $('#sailDate').val();
	
	var truckerInfo = "";//D028625
	if($('#overridePickupCarrierCode').val()!=""){
		truckerInfo = " | "+$('#overridePickupCarrierCode').val();
		if($('#overrideDeliveryCarrierCode').val()!="")
			truckerInfo = truckerInfo+" - "+$('#overrideDeliveryCarrierCode').val();
	}else{
		if($('#overrideDeliveryCarrierCode').val()!="")
			truckerInfo = " | - "+$('#overrideDeliveryCarrierCode').val();
	}
	
	displayText = loadService + dischargeService + cities + vvd+ sailDate+ truckerInfo;
	setAccordianTabDetails('routingHeader', displayText);	
}

function validateRoutingFieldsOnSave()
{
	var isValid = true;
	
	/*
	 * if($('#bookingStatusCode :selected').val()=='APPR') {
	 */
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
	// }
	
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
	// $('#routingLink').trigger('click');
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
	
	// edi load/discharge service only for china
	if(domesticForeignIndicator == 'china' ){
		$('#ediServiceTypeHeader').show();
	} else {
		$('#ediServiceTypeHeader').hide();
	}
	
}
	function setRoutingDiv() {
		//var displayText = "Routing VVD";
		var displayText = "";
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
		
		//added for Defect D017889
		var sailDate = "";
		if($('#sailDate').val()!="")
		sailDate = " | " + $('#sailDate').val();
		
		var truckerInfo = "";//D028625
		if($('#overridePickupCarrierCode').val()!=""){
			truckerInfo = " | "+$('#overridePickupCarrierCode').val();
			if($('#overrideDeliveryCarrierCode').val()!="")
				truckerInfo = truckerInfo+ " - "+$('#overrideDeliveryCarrierCode').val();
		}else{
			if($('#overrideDeliveryCarrierCode').val()!="")
				truckerInfo = " | - "+$('#overrideDeliveryCarrierCode').val();
		}
		
		
		displayText = loadService + dischargeService + cities + vvd+ sailDate+ truckerInfo;
		setAccordianTabDetails('routingHeader', displayText);
	}

	function getIsBillingVoyage(){
		shipmentId=$('#shipmentId').val();
				
		$.ajax({
			
			async: false,
			url: _context +"/shipment/routing/getIsBillingVoyage",
			type: "GET",
			data:{shipmentId:shipmentId},
			success: function(responseText){
				if(responseText.data!=null || responseText.data!="")
				{
					isBillingVoyageVVD=responseText.data;
				}
				else
				{
					isBillingVoyageVVD="";
				}
			}
		});
	}
	
function carrierCodeSearchUpdate(id){
	var values = id.split("|");
	if(values[1] == 'O' && $('#overridePickupCarrierCode').attr('disabled') != 'disabled'){
		$('#overridePickupCarrierCode').val(values[0]);
	} else if($('#overrideDeliveryCarrierCode').attr('disabled') != 'disabled') {
		$('#overrideDeliveryCarrierCode').val(values[0]);
	}
}
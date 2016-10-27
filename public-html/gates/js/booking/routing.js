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
var zip=" ";
var zone=" ";

$(function() {
	
	getAllLoadServices();
	getAllDischargeServices();
	
	$("#convCgoApptCutoffDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
		}
	});

	$("#convCgoEstArrivalDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
		}
	});

	$("#intermodalDepartureDate").datepicker({
		dateFormat : 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
		}
	});
	
	$("#requiredDeliveryDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
			if(isMilitaryModifiable)
				$('#milRequiredDeliveryDate').val($("#requiredDeliveryDate").val());
		}
	});
	
	$("#premiumRDD").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			isBookingChanged = "Y";
			/*if(isMilitaryModifiable)
				$('#milRequiredDeliveryDate').val($("#premiumRDD").val());*/
		}
	});
	
	$('#isVGMRequired').change(function(){
		setRoutingHeader();
	});
	
	$('#requiredDeliveryDate').change(function(){
		if($(this).val()=='' && isMilitaryModifiable){
			$('#milRequiredDeliveryDate').val($(this).val());
		} else if(!validateDate('requiredDeliveryDate', false)){
			$(this).validationEngine('showPrompt', '* Enter date in Format (mm-dd-yyyy)', 'error', 'topRight', true);
		} else if(isMilitaryModifiable){
			$('#milRequiredDeliveryDate').val($(this).val());
		}
	});
	
	$('#premiumRDD').change(function(){
		if(!validateDate('premiumRDD', false)){
			$(this).validationEngine('showPrompt', '* Enter date in Format (mm-dd-yyyy)', 'error', 'topRight', true);
		} /*else if(isMilitaryModifiable){
			$('#milRequiredDeliveryDate').val($(this).val());
		}*/
	});

	// Autocompleter and lookup for BL Origin
	$('#blOriginCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		name: "Origin City Code",
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
			var desc = "";
			if(item.stateCode != " " && item.stateCode != undefined){
				desc =  item.cityName+","+item.stateCode;	
			}
			else{
				desc = item.cityName;
			}
			
			$('#blOriginCityCode').val(item.cityCode);
			$('#blOriginCityDescription').val(desc);
			blOriginCityChangeFunction();
			isBookingChanged = "Y";
		}
	});

	$('#blOriginCityCodeDescription').gatesPopUpSearch({
		func : function() {
			if($('#blOriginCityCode').val()!='' && $('#bookingId').val()!='')
			{
				$.ajax({
					url: _context +"/booking/routing/validateSpotPull",
					data : {cityCode:$('#blOriginCityCode').val(), bookingId:$('#bookingId').val(), marker:'blOrigin'},
					success: function(responseText){
						showResponseMessages('msgDiv', responseText);
						if(responseText.success)
							placePopupSearch($('#blOriginCityCodeDescription').val(), 2);
					}
				});
			}
			else
				placePopupSearch($('#blOriginCityCodeDescription').val(), 2);
		}
	});

	$('#blOriginCityCodeDescription').blur(function() {
		if($('.ui-active-menuitem').length == 0 && !$('.ui-menu-item').is(':visible'))
		{
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
			else if($('#blOriginCityCode').val()+"-"+$('#blOriginCityDescription').val()!=$('#blOriginCityCodeDescription').val())
			{
				$('#blOriginCityCode').val('');
				$('#blOriginCityDescription').val('');
				$('#blOriginCityCodeDescription').val('');
			}
			checkPickupCarrier();
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
			setRoutingHeader();
		}
		return true;
	});

	// Autocompleter and lookup for Origin Port
	$('#originPortCityCodeDescription')
			.gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
						name: "Origin Port City Code",
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
							var desc = "";
							if(item.stateCode != " " && item.stateCode != undefined){
								desc =  item.cityName+","+item.stateCode;	
							}
							else{
								desc = item.cityName;
							}
							
							$('#originPortCityCode').val(item.cityCode);
							$('#originPortCityDescription').val(desc);
							originPortCityChangeFunction(item.cityCode);
							isBookingChanged = "Y";
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

	$('#originPortCityCodeDescription').blur(function() {
		if($('.ui-active-menuitem').length == 0 && !$('.ui-menu-item').is(':visible'))
		{
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
		}
		return true;
	});

	// Autocompleter and lookup for Destination Port
	$('#destinationPortCityCodeDescription')
			.gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
						name: "Destination Port City Code",
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
							var desc = "";
							if(item.stateCode != " " && item.stateCode != undefined){
								desc =  item.cityName+","+item.stateCode;	
							}
							else{
								desc = item.cityName;
							}
							
							$('#destinationPortCityCode').val(item.cityCode);
							$('#destinationPortCityDescription').val(desc);
							destinationPortCityChangeFunction(item.cityCode);
							isBookingChanged = "Y";
						}
					});

	$('#destinationPortCityCodeDescription').gatesPopUpSearch({
		func : function() {
			/*if($('#tradeCode').val()=='')
				alert("Please enter a valid trade");
			else*/
				portPopupSearch($('#destinationPortCityCodeDescription').val(), 4);
		}
	});
	//D024236: 	Maintain Bill: TSRC
	$('#overridePickupCarrierCode').gatesPopUpSearch({
		func : function() {
			var tariff = $("#tariff").val();
			var item = $("#tariffItemNumber").val();
			if($('#1_eqpType').length)
				var type = $('#1_eqpType').val();
			if($('#1_eqpSize').length)
				var size = $('#1_eqpSize').val();
			if($('#1_eqpHeight').length)
				var height = $('#1_eqpHeight').val();
			var city = $("#blOriginCityCodeDescription").val();
			var port = $("#originPortCityCodeDescription").val();
			var currentDate = setFormattedDate($.datepicker.formatDate('mm-dd-yy',new Date()));
			
			carrierPopupSearch(currentDate, '', $('#overridePickupCarrierCode').val(), 
					tariff, item, type,  size, height, city, "O", port);
		}
	});
	
	$('#overrideDeliveryCarrierCode').gatesPopUpSearch({
		func : function() {
			var tariff = $("#tariff").val();
			var item = $("#tariffItemNumber").val();
			if($('#1_eqpType').length)
				var type = $('#1_eqpType').val();
			if($('#1_eqpSize').length)
				var size = $('#1_eqpSize').val();
			if($('#1_eqpHeight').length)
				var height = $('#1_eqpHeight').val();
			var city = $("#blDestinationCityCodeDescription").val();
			var port = $("#destinationPortCityCodeDescription").val();
			var currentDate = setFormattedDate($.datepicker.formatDate('mm-dd-yy',new Date()));
			
			carrierPopupSearch(currentDate, '', $('#overrideDeliveryCarrierCode').val(), 
					tariff, item, type,  size, height, city, "D", port);
		}
	});
	
	function setFormattedDate(fromDate){
		var d = $.datepicker.parseDate('mm-dd-yy',  fromDate);
		return $.datepicker.formatDate( "mm-dd-yy", d);
	}

	$('#destinationPortCityCodeDescription').blur(function() {
		if($('.ui-active-menuitem').length == 0 && !$('.ui-menu-item').is(':visible'))
		{
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
		}
		return true;
	});

	// Autocompleter and lookup for BL Destination
	$('#blDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		name: "Destination City Code",
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
			var desc = "";
			if(item.stateCode != " " && item.stateCode != undefined){
				desc =  item.cityName+","+item.stateCode;	
			}
			else{
				desc = item.cityName;
			}
			
			$('#blDestinationCityCode').val(item.cityCode);
			$('#blDestinationCityDescription').val(desc);
			blDestinationCityChangeFunction();
			isBookingChanged = "Y";
		}
	});

	$('#blDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
			
			if($('#blDestinationCityCode').val()!='' && $('#bookingId').val()!='')
			{
				$.ajax({
					url: _context +"/booking/routing/validateSpotPull",
					data : {cityCode:$('#blDestinationCityCode').val(), bookingId:$('#bookingId').val(), marker:'blDestination'},
					success: function(responseText){
						showResponseMessages('msgDiv', responseText);
						if(responseText.success)
							placePopupSearch($('#blDestinationCityCodeDescription').val(), 5);
					}
				});
			}
			else
				placePopupSearch($('#blDestinationCityCodeDescription').val(), 5);
		}
	});

	$('#blDestinationCityCodeDescription').blur(function() {
		
		if($('.ui-active-menuitem').length == 0 && !$('.ui-menu-item').is(':visible'))
		{
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
			checkDeliveryCarrier();
			checkPlaceOfDeliveryDefaultValue();
			setRoutingHeader();
		}
		return true;
	});
	
	// Autocompleter and lookup for Cargo Pickup
	$('#freightOriginCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		name: "Origin City Code",
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
			var desc = "";
			if(item.stateCode != " " && item.stateCode != undefined){
				desc =  item.cityName+","+item.stateCode;	
			}
			else{
				desc = item.cityName;
			}
			
			$('#freightOriginCityCode').val(item.cityCode);
			$('#freightOriginCityDescription').val(desc);
			checkPlaceOfReceiptDefaultValue();
			checkOriginPtDefaultValue();
			isBookingChanged = "Y";
		}
	});

	$('#freightOriginCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#freightOriginCityCodeDescription').val(), 6);
		}
	});

	$('#freightOriginCityCodeDescription').blur(function() {
		if($('.ui-active-menuitem').length == 0)
		{
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
		}
		return true;
	});
	
	// Autocompleter and lookup for Cargo Destination
	$('#freightDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		name: "Destination City Code",
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
			var desc = "";
			if(item.stateCode != " " && item.stateCode != undefined){
				desc =  item.cityName+","+item.stateCode;	
			}
			else{
				desc = item.cityName;
			}
			
			$('#freightDestinationCityCode').val(item.cityCode);
			$('#freightDestinationCityDescription').val(desc);
			isBookingChanged = "Y";
		}
	});

	$('#freightDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#freightDestinationCityCodeDescription').val(), 7);
		}
	});

	$('#freightDestinationCityCodeDescription').blur(function() {
		if($('.ui-active-menuitem').length == 0)
		{
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
		}
		return true;
	});
	
	$('#loadServiceCode').change(function() {
		var loadServiceCode = $('#loadServiceCode :selected').val();
		var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
		var marker = "load";
		//D027456
		if($('#pickupZipCode').val()!=null && $('#pickupZipCode').val()!=" "){
			zip=$('#pickupZipCode').val();
			zone=$('#pickupZoneDisplay').html();
			}
		$('#dischargeServiceCode').attr("disabled", true);
		blockUI();
		
		if($('#bookingId').val()!='')
		{
			if(loadServiceCode!='' && dischargeServiceCode!='')
			{
				$.ajax({
					url: _context +"/booking/routing/beforeServiceUpdate",
					data:{
							loadService:loadServiceCode,
							dischargeService:dischargeServiceCode,
							marker:marker
						},
					success: function(responseTextFirst){
						showResponseMessages('msgDiv', responseTextFirst);
						//D027456
						if(responseTextFirst.success){
							if(loadServiceCode!="P"){
								$('#pickupZipCode').val(" ");
								$('#pickupZipCode').attr("disabled", "disabled");
								$('#pickupZoneDisplay').html(" ");
								}else{
								$('#pickupZipCode').attr("disabled",false);
								$('#pickupZipCode').val(zip);
								$('#pickupZoneDisplay').html(zone);
								}
							beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode);
					}
						else
						{
							$('#loadServiceCode').val(lastLoadService);
							$('#dischargeServiceCode').attr("disabled", false);
							$.unblockUI();
						}
					}
				});
				
				//alert("load service ro?"+($('#loadServiceCode :selected').val()=="RO")+",discharge svr ro?"+($('#dischargeServiceCode :selected').val()=="RO")+",rolling checked?"+$('#freight\\.isRoRo1').is(':checked'));
				
				if($('#loadServiceCode :selected').val()=="RO" && $('#dischargeServiceCode :selected').val()=="RO"){
					if($('#freight\\.isRoRo1').is(':checked')==false){
						alert("Rolling Stock Ind must be checked for selected Load/Discharge service.");
						//$('#freight\\.isRoRo1').attr('checked', true);
					}
				}
			}
			/*else if(loadServiceCode=='' && dischargeServiceCode=='')
			{
				$('#loadServiceCode').val(lastLoadService);
				$('#dischargeServiceCode').attr("disabled", false);
				$('#msgDiv').html('<div class="message_error">'+'Both Load and Discharge service cannot be updated to blank'+'</div>');
				window.scroll(0, 0);
			}*/
			else
				beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode); 
		}
		else
			beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode);
		
		setMandatoryPieces();
		enableDisableNote();
	});
	
	$('#dischargeServiceCode').change(function() {
		var loadServiceCode = $('#loadServiceCode :selected').val();
		var dischargeServiceCode = $('#dischargeServiceCode :selected').val();
		var marker = "discharge";
		if($('#deliveryZipCode').val()!=null && $('#deliveryZipCode').val()!=" "){
			zip=$('#deliveryZipCode').val();
			zone=$('#deliveryZoneDisplay').html();
			}
		$('#loadServiceCode').attr("disabled", true);
		blockUI();
		
		if($('#bookingId').val()!='')
		{
			if(loadServiceCode!='' && dischargeServiceCode!='')
			{
				$.ajax({
					url: _context +"/booking/routing/beforeServiceUpdate",
					data:{
							loadService:loadServiceCode,
							dischargeService:dischargeServiceCode,
							marker:marker
						},
					success: function(responseTextFirst){
						showResponseMessages('msgDiv', responseTextFirst);
						if(responseTextFirst.success)
							{
							if(loadServiceCode!="P"){
								$('#deliveryZipCode').val("");
								$('#deliveryZipCode').attr("disabled", "disabled");
								$('#deliveryZoneDisplay').html(" ");
								}else{
								$('#deliveryZipCode').attr("disabled",false);
								$('#deliveryZipCode').val(zip);
								$('#deliveryZoneDisplay').html(zone);
								}
							beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode);
							}
						else
						{
							$('#dischargeServiceCode').val(lastDischargeService);
							$('#loadServiceCode').attr("disabled", false);
							$.unblockUI();
						}
					}
				});
				
				//alert("load service ro?"+($('#loadServiceCode :selected').val()=="RO")+",discharge svr ro?"+($('#dischargeServiceCode :selected').val()=="RO")+",rolling checked?"+$('#freight\\.isRoRo1').is(':checked'));
				
				if($('#loadServiceCode :selected').val()=="RO" && $('#dischargeServiceCode :selected').val()=="RO"){
					if($('#freight\\.isRoRo1').is(':checked')==false){
						alert("Rolling Stock Ind must be checked for selected Load/Discharge service.");
						//$('#freight\\.isRoRo1').attr('checked', true);
					}
				}
			}
			/*else if(loadServiceCode=='' && dischargeServiceCode=='')
			{
				$('#dischargeServiceCode').val(lastDischargeService);
				$('#loadServiceCode').attr("disabled", false);
				$('#msgDiv').html('<div class="message_error">'+'Both Load and Discharge service cannot be updated to blank'+'</div>');
				window.scroll(0, 0);
			}*/
			else
				beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode);
		}
		else
			beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode);
		
		setMandatoryPieces();
		enableDisableNote();
	});

	$('#isInBond').change(function()
	{
		if($('#loadServiceCode').val()!='' && $('#dischargeServiceCode').val()!=''){
			$.ajax({
				url: _context +"/booking/routing/isInbondAllowed?inBond="+$("#isInBond option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
				success: function(responseText){
					//if(responseText.success==false)
						showResponseMessages('msgDiv', responseText);
				}
			});
		}
		
		if($('#isInBond :selected').val()==true || $('#isInBond :selected').val()=='true')
		{
			/*Booking Security*/
			if(isRoutingModifiable){
				$('#inbondNumber').attr("disabled", false);
				//add bond clause code
				$.ajax({
					url: _context +"/booking/clause/addBondClause",
					success: function(responseText){
						$("#gridIdForClauses").trigger("reloadGrid");
					}
				});
			}
		}
		else
		{
			$('#inbondNumber').val("");
			$('#inbondNumber').attr("disabled", true);
			//remove bond clause code
			$.ajax({
				url: _context +"/booking/clause/removeBondClause",
				success: function(responseText){
					$('#msgDiv').html('<div class="message_warning">BOND Clause has been deleted</div>');
					window.scroll(0, 0);
					$("#gridIdForClauses").trigger("reloadGrid");
				}
			});
		 }
	});
	
	//D026261: 	FW: Maintain booking : SIT flag to VVD Routing 
	$('#isSIT').change(function()
	{
		var data;
		var dataUrl;
		if($('#isSIT :selected').val()==true || $('#isSIT :selected').val()=='true')
		{
			$("#specialServiceMasterForm").clearForm();
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val('SIT');
			$('select[name="specialServiceFormLine1\\.isApplyToAll"]').selected().val('Y');
			$('input[name="specialServiceFormLine1\\.source"]').val('Manual');
			$('input[name="specialServiceFormLine1\\.processLevelCode"]').val('E');
			$('input[name="specialServiceFormLine1\\.isMilTruckerRateCustomized"]').val('N');
			$('input[name="specialServiceFormLine1\\.chargeCodeExpected"]').val('SIT');
			$('input[name="specialServiceFormLine1\\.isRequireQuantity"]').val('N');
			$('input[name="specialServiceFormLine1\\.isManualCharge"]').val('N');
			data = $('#specialServiceMasterForm').formSerialize();
	    	dataUrl = _context +"/booking/specialservice/add?entityName="+$("#spSvcEntityName").val();
		} else {
			data = "";
			dataUrl = _context +"/booking/specialservice/deleteSIT?entityName="+$("#spSvcEntityName").val();
		}
		$.ajax({
    		type: "POST",
    		url: dataUrl,
    		data: data,
    		success: function(responseText){
    			if(responseText.success){
    				isBookingChanged = "Y";
    				$("#specialServiceGrid").trigger('reloadGrid');
    			}else{
    				showResponseMessages("msgDiv", responseText);
    			}
    		}
    	});
		
	});

	$('#isOverland').change(function()
	{
		$.ajax({
			url: _context +"/booking/routing/getOverland?overland="+$("#isOverland option:selected").text()+"&loadServiceCode="+$('#loadServiceCode').val()+"&dischargeServiceCode="+$('#dischargeServiceCode').val(),
			success: function(responseText){
				//if(responseText.success==false)
					showResponseMessages('msgDiv', responseText);
			}
		});
	});

	$('#overridePickupCarrierCode').change(function(){
		if($('#overridePickupCarrierCode').val()!='')
		{
			$("#overridePickupCarrierCode").val(($("#overridePickupCarrierCode").val()).toUpperCase()); 
			var carr = 'pickUp';
			$.ajax({
				url: _context +"/booking/routing/validateCarrier",
				data :{
					carrierCode :$('#overridePickupCarrierCode').val(),
					carrier : carr
				},
				success: function(responseText){
					
					showResponseMessages('msgDiv', responseText);
				}
			});
		}
	});

	$('#overrideDeliveryCarrierCode').change(function(){
		if($('#overrideDeliveryCarrierCode').val()!='')
		{
			$("#overrideDeliveryCarrierCode").val(($("#overrideDeliveryCarrierCode").val()).toUpperCase()); 
			var carr = 'delivery';
			$.ajax({
				url: _context +"/booking/routing/validateCarrier",
				data :{
					carrierCode :$('#overrideDeliveryCarrierCode').val(),
					carrier : carr
				},
				success: function(responseText){
					
					showResponseMessages('msgDiv', responseText);
				}
			});
		}
	});
	
	$('#isAutoInlandMove').change(function(){
		if($('#isAutoInlandMove :selected').val()=="true")
		{
			if($('#customerGroupId option:selected').text()!="COMMERCIAL AUTO GROUP")
			{
				$('#isAutoInlandMove').val('false');
				$('#msgDiv').html('<div class="message_error">'+'Cannot update Auto Inland Move Flag as Customer Group is not Commercial Auto Group'+'</div>');
				window.scrollTo(0, 0);
				triggerErrorMessageAlert();
			}
			else
			{
				$('#dealerAuctionLocationCode').attr("disabled", false);
				$('#msgDiv').html('');
			}
		}
		else
		{
			$('#dealerAuctionLocationCode').val("");
			$('#dealerAuctionLocationCode').attr("disabled", true);
			$('#msgDiv').html('');
		}
	});

});

/** ******** Supporting functions ********* */
function beforeLoadServiceUpdate(loadServiceCode, dischargeServiceCode)
{
	if(loadServiceCode!='' && dischargeServiceCode!='')
	{
		$.ajax({
			url: _context +"/booking/routing/getLoadDschPair",
			data:{
				loadServiceCode:loadServiceCode,
				dischargeServiceCode:dischargeServiceCode,
				customerGroup:$('#customerGroupId option:selected').text(),
				marker:"load"
			},
			success: function(responseText){
				if(responseText.success)
				{
					/*if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0')
					{
						if($('#loadDschServiceGroupCode').val()!=$.trim(responseText.data.loadDschServiceGroupCode))
						{
							var r = confirm("Load discharge group code is being changed. Delete commodities?");
							if(r)
							{
								removeCommodities();
								setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
								loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
								showFreight($.trim($('#customerGroupId :selected').text()));
							}
							else
							{
								$('#dischargeServiceCode').attr("disabled", false);
								$('#loadServiceCode').val(lastLoadService);
							}
						}
						else
						{
							setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
							loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						}
					}
					else
					{*/
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						/*iterated = true;
						removeCurrentCommodity();
						showFreight($.trim($('#customerGroupId :selected').text()));
						iterated = false;
					}*/
				}
				else
				{
					showResponseMessages('msgDiv', responseText);
					$('#dischargeServiceCode').attr("disabled", false);
					$.unblockUI();
					$('#loadServiceCode').val(lastLoadService);
				}
			}
		});
	}
	else
	{
		/*if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0')
		{
			var r = confirm("Load discharge group code is being changed. Delete commodities?");
			if(r)
			{
				removeCommodities();
				setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
				loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
			}
			else
			{
				$('#dischargeServiceCode').attr("disabled", false);
				$('#loadServiceCode').val(lastLoadService);
			}
		}
		else
		{*/
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
			loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*iterated = true;
			removeCurrentCommodity();
			showFreight($.trim($('#customerGroupId :selected').text()));
			iterated = false;
		}*/
	}
}

function beforeDischargeSeviceUpdate(loadServiceCode, dischargeServiceCode)
{
	if(loadServiceCode!='' && dischargeServiceCode!='')
	{
		$.ajax({
			url: _context +"/booking/routing/getLoadDschPair",
			data:{
				loadServiceCode:loadServiceCode,
				dischargeServiceCode:dischargeServiceCode,
				customerGroup:$('#customerGroupId option:selected').text(),
				marker:"discharge"
			},
			success: function(responseText){
				if(responseText.success)
				{
					if($('#loadDschServiceGroupCode').val()!=$.trim(responseText.data.loadDschServiceGroupCode))
					{
						/*if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0')
						{
							var r = confirm("Load discharge group code is being changed. Delete commodities?");
							if(r)
							{
								removeCommodities();
								setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
								dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
								showFreight($.trim($('#customerGroupId :selected').text()));
							}
							else
							{
								$('#loadServiceCode').attr("disabled", false);
								$('#dischargeServiceCode').val(lastDischargeService);
							}
						}
						else
						{*/
							/*removeCurrentCommodity();*/
							setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
							dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
							//iterated = true;
							/*showFreight($.trim($('#customerGroupId :selected').text()));*/
							//iterated = false;
						/*}*/
					}
					else
					{
						setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText);
						dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
					}
				}
				else
				{
					showResponseMessages('msgDiv', responseText);
					$('#loadServiceCode').attr("disabled", false);
					$.unblockUI();
					$('#dischargeServiceCode').val(lastDischargeService);
				}
			}
		});
	}
	else
	{
		/*if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0')
		{
			var r = confirm("Load discharge group code is being changed. Delete commodities?");
			if(r)
			{
				removeCommodities();
				setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
				dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
			}
			else
			{
				$('#loadServiceCode').attr("disabled", false);
				$('#dischargeServiceCode').val(lastDischargeService);
			}
		}
		else
		{*/
			setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, null);
			dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*iterated = true;
			removeCurrentCommodity();
			showFreight($.trim($('#customerGroupId :selected').text()));
			iterated = false;
		}*/
	}
}

function loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode)
{
	lastLoadService = loadServiceCode;
	checkPickupCarrier();
	if(loadServiceCode!=null && loadServiceCode!='')
	{
		function callBack(responseText){
			setLoadDischargeValues(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
			$('#dischargeServiceCode').attr("disabled", false);
			$.unblockUI();
			if($('#loadServiceCode option:selected').attr("title")!=undefined)
				$("#loadServiceCode").attr("title", $('#loadServiceCode option:selected').attr("title"));
			else
				$("#loadServiceCode").attr("title", '');
			setRoutingHeader();
			
			var queryString = $('#bookingForm').formSerialize();
			$.ajax({
				url: _context +"/booking/routing/validateUpdateService",
				type: "POST",
				data: queryString+"&marker=load",
				success: function(responseTextNew){
					/*if(responseTextNew.success==false)
					{*/
						showResponseMessages('msgDiv', responseTextNew);
					/*}*/
				}
			});
		}
		if(loadServiceCode=='P'){
		$('#pickupZipCode').val($('input[name="shipper\\.zip"]').val().substring(0,5));
		validateZip('pickup');
		}
		else{
		$('#pickupZipCode').val(" ");
		$('#pickupZipCode').attr("disabled", "disabled");
		$('#pickupZoneDisplay').html(" ");
		}
		
		getDischargeServicesRequest(callBack, $.trim(loadServiceCode));
	}
		else
		{
			
			function callBack(responseText) { // cheetah
				setLoadDischargeValues(responseText.data, '#dischargeServiceCode', dischargeServiceCode);
				$('#dischargeServiceCode').attr("disabled", false);
				$.unblockUI();
				if($('#loadServiceCode option:selected').attr("title")!=undefined)
					$("#loadServiceCode").attr("title", $('#loadServiceCode option:selected').attr("title"));
				else
					$("#loadServiceCode").attr("title", '');
				setRoutingHeader();
			}
			
			getAllDischargeServicesRequest(callBack); // cheetah	
			
		}
	}

function dischargeSeviceUpdateFunction(loadServiceCode, dischargeServiceCode)
{
	lastDischargeService = dischargeServiceCode;
	checkDeliveryCarrier();
	if(dischargeServiceCode!=null && dischargeServiceCode!=''){
		
		function callBack(responseText) { // cheetah
			//setLoadDischargeValues(responseText.data, '#loadServiceCode', loadServiceCode);
			$('#loadServiceCode').attr("disabled", false);
			$.unblockUI();
			if($('#dischargeServiceCode option:selected').attr("title")!=undefined)
				$("#dischargeServiceCode").attr("title", $('#dischargeServiceCode option:selected').attr("title"));
			else
				$("#dischargeServiceCode").attr("title", '');
			setRoutingHeader();
			
			var queryString = $('#bookingForm').formSerialize();
			$.ajax({
				url: _context +"/booking/routing/validateUpdateService",
				type: "POST",
				data: queryString+"&marker=discharge",
				success: function(responseTextNew){
					/*if(responseTextNew.success==false)
					{*/
						showResponseMessages('msgDiv', responseTextNew);
					/*}*/
				}
			});
		}
		if(dischargeServiceCode=='P'){
		$('#deliveryZipCode').val($('input[name="consignee\\.zip"]').val().substring(0,5));
		validateZip('delivery');
		}
		else{
		$('#deliveryZipCode').val(" ");
		$('#deliveryZipCode').attr("disabled", "disabled");
		$('#deliveryZoneDisplay').html(" ");
		}
		getLoadServicesRequest(callBack, $.trim(dischargeServiceCode));		
		
	}
	else
	{
		
		function callBack(responseText) { // cheetah
			setLoadDischargeValues(responseText.data, '#loadServiceCode', loadServiceCode);
			$('#loadServiceCode').attr("disabled", false);
			$.unblockUI();
			if($('#dischargeServiceCode option:selected').attr("title")!=undefined)
				$("#dischargeServiceCode").attr("title", $('#dischargeServiceCode option:selected').attr("title"));
			else
				$("#dischargeServiceCode").attr("title", '');
			setRoutingHeader();
		}
		
		getAllLoadServicesRequest(callBack); // cheetah	
		
	}
}

function carrierPopupSearch(rateDate, recievedDate, value, tariff, item, type,  size, height, city, source, port){
	var param =  rateDate + '|' + recievedDate + '|' + value + '|' + tariff + '|' + item + '|' + type 
				+ '|'+ size + '|' + height + '|' + city + '|' + source + '|' + port;
	var actionUrl = _context + "/cas/carrierCodeSearch.do?params=" + param + "&frtRcvdDt=" + recievedDate;
	var windowStyle = 'top=0,left=0,height=600,width=1100,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CarrierCodeSearch', windowStyle);
}

function portPopupSearch(place, id) {
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param
			+ "|" + "Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function placePopupSearch(place, id) {
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param;
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function cityUpdate(id) {
	var values = id.split(",");
	var cityCode = values[0];
	var cityName = values[1];
	var stateName = values[2];
	var value = '';
	if(stateName!=''){
		value=cityName+","+stateName;	
	}else{
		value=cityName;
	}
	isBookingChanged = "Y";
	if (_callingFunc == '2') {
		$('#blOriginCityCodeDescription').val(cityCode + "-" + value);
		$('#blOriginCityDescription').val(value);
		$('#blOriginCityCode').val(cityCode);
		blOriginCityChangeFunction();
	}
	if (_callingFunc == '3') {
		$('#originPortCityCodeDescription').val(cityCode + "-" + value);
		$('#originPortCityDescription').val(value);
		$('#originPortCityCode').val(cityCode);
		originPortCityChangeFunction(cityCode);
	}
	if (_callingFunc == '4') {
		$('#destinationPortCityCodeDescription').val(cityCode + "-" + value);
		$('#destinationPortCityDescription').val(value);
		$('#destinationPortCityCode').val(cityCode);
		destinationPortCityChangeFunction(cityCode);
	}
	if (_callingFunc == '5') {
		$('#blDestinationCityCodeDescription').val(cityCode + "-" + value);
		$('#blDestinationCityDescription').val(value);
		$('#blDestinationCityCode').val(cityCode);
		blDestinationCityChangeFunction();
	}
	if (_callingFunc == '6') {
		$('#freightOriginCityCodeDescription').val(cityCode + "-" + value);
		$('#freightOriginCityDescription').val(value);
		$('#freightOriginCityCode').val(cityCode);
		checkPlaceOfReceiptDefaultValue();
		checkOriginPtDefaultValue();
	}
	if (_callingFunc == '7') {
		$('#freightDestinationCityCodeDescription').val(cityCode + "-" + value);
		$('#freightDestinationCityDescription').val(value);
		$('#freightDestinationCityCode').val(cityCode);
	}
	if (_callingFunc == '8') {
		$('#cargoPickupCityCodeDesc').val(cityCode + "-" + value);
		$('#cargoPickupCityCode').val(cityCode);
	}
	if (_callingFunc == '9') {
		$('#cargoDeliveryCityCodeDesc').val(cityCode + "-" + value);
		$('#cargoDeliveryCityCode').val(cityCode);
	}
}

function setLoadDischargeGroupCode(loadServiceCode, dischargeServiceCode, responseText)
{
	if(loadServiceCode!=null && loadServiceCode!='' && dischargeServiceCode!=null && dischargeServiceCode!='')
	{
		$('#loadDschServiceGroupCode').val($.trim(responseText.data.loadDschServiceGroupCode));
		$('#isAllowBookingUnit').val(responseText.data.isAllowBookingUnit);
		$('#isRequireReceivedUnit').val(responseText.data.isRequireReceivedUnit);
		$("#specialServiceGrid").trigger("reloadGrid");
		
		if(responseText.data.defaultOverlandValue=="Y" && $('#isOverland :selected').val()=='false')
			$('#isOverland').val("true");
		else if(responseText.data.defaultOverlandValue=="N" && $('#isOverland :selected').val()=='false')
			$('#isOverland').val("false");
		
		//D033741: 	maintain booking: please match logic on maintain bill when loa/discharge servcie is changed to automatically remove place of receipt/place of delivery if no longer applicable.
		if(isRoutingModifiable && responseText.data.isRequireBlOrigin!='N'){
			$('#blOriginCityCodeDescription').attr('disabled', false);
		} else if(responseText.data.isRequireBlOrigin=='N'){
			$('#blOriginCityCode').val("");
			$('#blOriginCityDescription').val("");
			$('#blOriginCityCodeDescription').val("");
			$('#blOriginCityCodeDescription').attr('disabled', true);
		}

		if (isRoutingModifiable && responseText.data.isRequireBlDestination != 'N') {
			$('#blDestinationCityCodeDescription').attr('disabled', false);
		} else if (responseText.data.isRequireBlDestination == 'N') {
			$('#blDestinationCityCode').val("");
			$('#blDestinationCityDescription').val("");
			$('#blDestinationCityCodeDescription').val("");
			$('#blDestinationCityCodeDescription').attr('disabled', true);
		}
			
		if(isRoutingModifiable && responseText.data.isRequirePickupZipCode!='N'){
			$('#pickupZipCode').attr('disabled', false);
		} else if(responseText.data.isRequirePickupZipCode=='N'){
			$('#pickupZipCode').val("");
			$('#pickupZone').val("");
			$('#pickupZipCode').attr('disabled', true);
		}
			
		if(isRoutingModifiable && responseText.data.isRequireDeliveryZipCode!='N'){
			$('#deliveryZipCode').attr('disabled', false);
		} else if(responseText.data.isRequireDeliveryZipCode=='N'){
			$('#deliveryZipCode').val("");
			$('#deliveryZone').val("");
			$('#deliveryZipCode').attr('disabled', true);
		}
			
		
		if($('#loadDschServiceGroupCode').val()=='AU')
			$('#vvdCutOff').hide();
		else
			$('#vvdCutOff').show();
		
		if($('#loadDschServiceGroupCode').val()=='CON' || $('#loadDschServiceGroupCode').val()=='LCL')
		{
			$('#premiumRDD').val('');
			$('#premiumRDD').attr("disabled", true);
			$('#vvd_premium').hide();
			$('#vvd_conventional').show();
			if(isRoutingModifiable)
			{
				$('#convCgoApptCutoffDate').attr('disabled', false);
				$('#convCgoApptCutoffTime').attr('disabled', false);
				$('#convCgoEstArrivalDate').attr('disabled', false);
				$('#convCgoEstArrivalTime').attr('disabled', false);
				$('#requiredDeliveryDate').attr('disabled', false);
				$('#milRequiredDeliveryDate').attr('disabled', false);
			}
			/*if($('#milRequiredDeliveryDate').val()=='')
				$('#requiredDeliveryDate').val('01-01-0001');
			else*/
				$('#requiredDeliveryDate').val($('#milRequiredDeliveryDate').val());
		} 
		else
		{
			
			
			$('#vvd_conventional').hide();
			$('#convCgoApptCutoffDate').val('');
			$('#convCgoApptCutoffTime').val('');
			$('#convCgoEstArrivalDate').val('');
			$('#convCgoEstArrivalTime').val('');
			$('#requiredDeliveryDate').val('');
			//$('#milRequiredDeliveryDate').val('');
			
			$('#convCgoApptCutoffDate').attr('disabled', true);
			$('#convCgoApptCutoffTime').attr('disabled', true);
			$('#convCgoEstArrivalDate').attr('disabled', true);
			$('#convCgoEstArrivalTime').attr('disabled', true);
			$('#requiredDeliveryDate').attr('disabled', true);
			//$('#milRequiredDeliveryDate').attr('disabled', true);
		}
		
		// Setting IBS Code as mandatory incase of MBU Commenting out as per D016178
		//$('#militaryIbsStatusCode').trigger("change");
	}
	else
	{
		$('#loadDschServiceGroupCode').val('');
		$('#isAllowBookingUnit').val('');
		
		$('#vvd_conventional').hide();
		//$('#vvd_premium').hide();
		
		$('#convCgoApptCutoffDate').val('');
		$('#convCgoApptCutoffTime').val('');
		$('#convCgoEstArrivalDate').val('');
		$('#convCgoEstArrivalTime').val('');
		$('#requiredDeliveryDate').val('');
		//$('#premiumRDD').val('');
		
		$('#convCgoApptCutoffDate').attr('disabled', true);
		$('#convCgoApptCutoffTime').attr('disabled', true);
		$('#convCgoEstArrivalDate').attr('disabled', true);
		$('#convCgoEstArrivalTime').attr('disabled', true);
		$('#requiredDeliveryDate').attr('disabled', true);
		//$('#premiumRDD').attr("disabled", true);
		
		$('#vvdCutOff').show();
		
		if(isRoutingModifiable)
		{
			$('#blOriginCityCodeDescription').attr('disabled', false);
			$('#blDestinationCityCodeDescription').attr('disabled', false);
			$('#pickupZipCode').attr('disabled', false);
			$('#deliveryZipCode').attr('disabled', false);
		}
		
		// Disable freight
		/*$('#showAlertTCGLDSP').val("false");
		$($('.booking-section')[4]).accordion('option', 'active', false);*/
		//Freight
		/*disableAccordian(4);
		removeCurrentCommodity();
		$('#showAlertTCGLDSP').val("true");*/
	}
	//enableDisableCommodityIfTradeCustGrpLDGrpPresent();
	var lastCustomerGroup = $('#customerGroupId option[value='+$('#lastCustomerGroupId').val()+']').text();
	var currentCustomerGroup = $('#customerGroupId option[value='+$('#customerGroupId').val()+']').text();
	var lastLoadDschGroup = $.trim($('#lastLoadDschServiceGroupCode').val());
	var currentLoadDschGroup = $.trim($('#loadDschServiceGroupCode').val());
	
	modifyFrtOnCstmrGrpLoadDschGrpCodeChange('loadDschGroup', lastCustomerGroup, currentCustomerGroup, lastLoadDschGroup, currentLoadDschGroup, $('#isAllowBookingUnit').val());
	if(responseText!=null && responseText.data!=null && responseText.data.loadDschServiceGroupCode!=null && responseText.data.loadDschServiceGroupCode!=''){
		$('#lastLoadDschServiceGroupCode').val($.trim(responseText.data.loadDschServiceGroupCode));
	}
	if($.trim($('#lastLoadDschServiceGroupCode').val())=="CON" || $.trim($('#lastLoadDschServiceGroupCode').val())=="LCL")
		defaultHidden = true;
	else
		defaultHidden = false;
	if($('#tariff').is(':visible'))
	{
		if(!$("#equipmentGrid").is(':visible'))
		{
			if(!defaultHidden || 
				($("#equipmentGrid").getGridParam("reccount")!=undefined &&
						$("#equipmentGrid").getGridParam("reccount")>0))
			{
				$(".HeaderButton", ("#gview_equipmentGrid")).click();
			}
		}
		else if($("#equipmentGrid").is(':visible'))
		{
			if(defaultHidden && ($("#equipmentGrid").getGridParam("reccount")==undefined || 
			   $("#equipmentGrid").getGridParam("reccount")==0))
				$(".HeaderButton", ("#gview_equipmentGrid")).click();
		}
	}
}

function checkPickupCarrier()
{
	if(!isRoutingModifiable || ($('#overridePickupCarrierCode').val()=='' && $('#loadServiceCode :selected').val()!='DCY' 
		&& $('#blOriginCityCode').val()=='' && $('#pickupZone').val()==''))
		$('#overridePickupCarrierCode').attr('disabled', true);
	else if(isRoutingModifiable && ($('#loadServiceCode :selected').val()=='DCY' 
		|| $('#blOriginCityCode').val()!='' || $('#pickupZone').val()!=''))
		$('#overridePickupCarrierCode').attr('disabled', false);
}

function checkDeliveryCarrier()
{
	if(!isRoutingModifiable || ($('#overrideDeliveryCarrierCode').val()=='' && $('#dischargeServiceCode :selected').val()!='DCY' 
		&& $('#blDestinationCityCode').val()=='' && $('#deliveryZone').val()==''))
	$('#overrideDeliveryCarrierCode').attr('disabled', true);
	else if(isRoutingModifiable && $('#dischargeServiceCode :selected').val()=='DCY' 
		|| $('#blDestinationCityCode').val()!='' || $('#deliveryZone').val()!='')
		$('#overrideDeliveryCarrierCode').attr('disabled', false);
}

function validateCity(selector)
{
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
		fetchTradeValue(selector);
		checkOriginPortDefaultValue();
		//setDomesticForeignIndicator();
	}
	else if(selector=='destinationPortCity')
	{
		lastDestinationPortCode = $('#destinationPortCityCode').val();
		lastDestinationPortDescription = $('#destinationPortCityDescription').val();
		lastDestinationPortCodeDescription = $('#destinationPortCityCodeDescription').val();
		
		if($.trim($('#deliveryZipCode').val())!='')
			deriveZone('delivery');
		fetchTradeValue(selector);
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
	
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url: _context +"/booking/routing/validateCity?city="+selector,
		type : "POST",
		data : queryString,
		success: function(responseText){
				showResponseMessages('msgDiv', responseText,$('#msgDiv').html());
				if((selector == 'originPortCity' 
					|| selector == 'destinationPortCity') && $("#vvdRoutingGrid").getGridParam("reccount")!=0)
					deriveValidateVVD(selector);
			}
	});
}

function validateZip(selector)
{
	var validateZipFlag= true;
	if($.trim($('#'+selector+"ZipCode").val())!='')
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
			url: _context +"/booking/routing/deriveZone",
			data : {portCode:portCode, zipcode:zipcode, selector:selector},
			async: false,
			success: function(responseText){
				showResponseMessages('msgDiv', responseText);
				if(selector=='pickup')
				{
					$('#pickupZone').val(responseText.data);
					$('#pickupZoneDisplay').html(responseText.data);
					checkPickupCarrier();
				}
				else if(selector=='delivery')
				{
					$('#deliveryZone').val(responseText.data);
					$('#deliveryZoneDisplay').html(responseText.data);
					checkDeliveryCarrier();
				}
				if(responseText.success)
				{
					var queryString = $('#bookingForm').formSerialize();
					$.ajax({
						url: _context +"/booking/routing/validateZip?zip="+selector,
						type : "POST",
						async: false,
						data : queryString,
						success: function(responseTextNew){
							setRoutingHeader();   //D030791	Maintain booking: Storedoor zip not updating in routing grid
							showResponseMessages('msgDiv', responseTextNew);
						}
					});
				}
				else{
					validateZipFlag= false;
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
	return validateZipFlag;
}

function setLoadDischargeValues(listData, selector, value)
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

function validateOnFocus(selector)
{
	/*if((selector=='#originPortCityCodeDescription' || selector=='#destinationPortCityCodeDescription') && $('#tradeCode').val()=="")
	{
		$(selector).blur();
		alert("Please enter a valid trade");
	}
	else */ if(selector=='blOrigin' || selector=='blDestination')
	{
		if($("#"+selector+"CityCode").val()!='' && $('#bookingId').val()!='')
		{
			$("#"+selector+'CityCodeDescription').attr("readonly", true);
			//alert("done");
			$.ajax({
				url: _context +"/booking/routing/validateSpotPull",
				data : {cityCode:$("#"+selector+"CityCode").val(), bookingId:$('#bookingId').val(), marker:selector},
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
	}
}

function validateOnKeyDown(evt, selector)
{
	var keyCode = event.keyCode;
	
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
		if(selector=='#pickupZipCode' && $('#originPortCityDescription').val()=='')
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Please enter port of loading first");
		}
		else if(selector=='#deliveryZipCode' && $('#destinationPortCityDescription').val()=='')
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Please enter port of discharge first");
		}
		else if(selector=='#overridePickupCarrierCode' && $(selector).val()=='' && $('#blOriginCityCode').val()=='' 
			&& $('#loadServiceCode :selected').val()!='DCY' && $('#pickupZone').val()=='')
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Override not allowed for pickup");
		}
		else if(selector=='#overrideDeliveryCarrierCode' && $(selector).val()=='' && $('#blDestinationCityCode').val()=='' 
			&& $('#dischargeServiceCode :selected').val()!='DCY' && $('#deliveryZone').val()=='')
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Override not allowed for delivery");
		}
		else if(selector=='#dealerAuctionLocationCode' && $("#isAutoInlandMove :selected").val()=="false")
		{
			$("#dealerAuctionLocationCode").blur();
			evt.preventDefault();
			alert("Dealer Auction Code not allowed as Auto Inland Move Flag set to false");
		}
		else if((selector=='#newVessel' || selector=='#newVoyage' || selector=='#newDirection') && 
				($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()==''))
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Please select Port of Loading and Port of Discharge first");
		}
		else if((selector=='#bkdVessel' || selector=='#bkdVoyage' || selector=='#bkdDirection') && 
				($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()==''))
		{
			$(selector).blur();
			evt.preventDefault();
			alert("Both- Port of Loading and Port of Discharge must be present to provide Booked For VVD");
		}
	}
}

function originPortCityChangeFunction(loadPortCode)
{	
	$('#msgDiv').html('');
	if($('#bookingId')!='')
	{
		var tradeCode = $('#tradeCode').val();
		var direction = $('#direction').val();
		$.ajax({
			url: _context +"/booking/routing/validateUpdateOriginPort",
			data : {originPortCityCode:loadPortCode, tradeCode:tradeCode, direction:direction},
			success: function(responseText){
				showResponseMessages('msgDiv', responseText,$('#msgDiv').html());
				if(responseText.success==false)
				{
					setOrginalOrgValues();
				}
				else
				{
					validateCity('originPortCity');
				}
			}
		});
	}
	else
	{
		
		validateCity('originPortCity');
	}
	 checkVGM();
}

function destinationPortCityChangeFunction(dischargePortCode)
{
	$('#msgDiv').html('');
	if($('#bookingId').val()!='')
	{
		$.ajax({
			url: _context +"/booking/routing/validateUpdateDestinationPort?dischargePortCode="+dischargePortCode,
			success: function(responseText){
				if(responseText.success)
				{
					validateCity('destinationPortCity');
				}
				else
				{
					var r = confirm("Received units exist for booking. Override existing destination port?");
					if(r)
					{
						validateCity('destinationPortCity');
					}
					else
						setOrginalDestValues();
				}
				//$('#isChangeAcceptedAfterUnitsReceived').val("N");
			}
		});
	}
	else
	{
		validateCity('destinationPortCity');
	}
	
	 checkVGM();
}

function blOriginCityChangeFunction()
{
	$('#msgDiv').html('');
	if($('#bookingId').val()!='')
	{
		$.ajax({
			url: _context +"/booking/routing/validateSpotPull",
			data : {cityCode:$('#blOriginCityCode').val(), bookingId:$('#bookingId').val(), marker:'blOrigin'},
			success: function(responseText){
				showResponseMessages('msgDiv', responseText);
				if(responseText.success==false)
				{
					$('#blOriginCityCode').val(lastBlOriginCode);
					$('#blOriginCityDescription').val(lastBlOriginDescription);
					$('#blOriginCityCodeDescription').val(lastBlOriginCodeDescription);
				}
				else
					validateCity('blOriginCity');
			}
		});
	}
	else
		validateCity('blOriginCity');
}

function blDestinationCityChangeFunction()
{
	$('#msgDiv').html('');
	if($('#bookingId').val()!='')
	{
		$.ajax({
			url: _context +"/booking/routing/validateSpotPull",
			data : {cityCode:$('#blDestinationCityCode').val(), bookingId:$('#bookingId').val(), marker:'blDestination'},
			success: function(responseText){
				showResponseMessages('msgDiv', responseText,$('#msgDiv').html());
				if(responseText.success==false)
				{
					$('#blDestinationCityCode').val(lastBlDestinationCode);
					$('#blDestinationCityDescription').val(lastBlDestinationDescription);
					$('#blDestinationCityCodeDescription').val(lastBlDestinationCodeDescription);
				}
				else
					validateCity('blDestinationCity');
			}
		});
	}
	else
		validateCity('blDestinationCity');
}

function setOrginalOrgValues()
{
	$('#originPortCityCode').val(lastOriginPortCode);
	$('#originPortCityDescription').val(lastOriginPortDescription);
	$('#originPortCityCodeDescription').val(lastOriginPortCodeDescription);
	$('#originPortCityCodeDescription').blur();
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
	$('#pickupZone').val('');
	$('#pickupZoneDisplay').html('');
	checkPickupCarrier();
	lastOriginPortCode = "";
	lastOriginPortDescription = "";
	lastOriginPortCodeDescription = "";
	
	checkOriginPortDefaultValue();
	setDomesticForeignIndicator();
	
	setRoutingHeader();
}

function resetOriginalDestValues()
{
	if($('#bookingId').val()!='')
	{
		$.ajax({
			url: _context +"/booking/routing/validateUpdateDestinationPort?dischargePortCode="
			+ $('#destinationPortCityCode').val(),
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
					$('#msgDiv').html('<div class="message_error">Destination Port cannot be updated as received units exist for booking</div>');
					window.scrollTo(0, 0);
					setOrginalDestValues();
					triggerErrorMessageAlert();
				}
				$('#deliveryZone').val('');
				$('#deliveryZoneDisplay').html('');
				checkDeliveryCarrier();
				
				checkDestinationPortDefaultValue();
				checkPlaceOfDeliveryDefaultValue();
				
				setRoutingHeader();
			}
		});
	}
	else
	{
		$('#deliveryZone').val('');
		$('#deliveryZoneDisplay').html('');
		checkDeliveryCarrier();
		lastDestinationPortCode = "";
		lastDestinationPortDescription = "";
		lastDestinationPortCodeDescription = "";
		
		checkDestinationPortDefaultValue();
		checkPlaceOfDeliveryDefaultValue();
		
		setRoutingHeader();
	}
}

function setRoutingHeader()
{
	var displayText = " ";
	
	var loadService = "";
	if($('#loadServiceCode :selected').val()!='')
		loadService = " - " + $('#loadServiceCode option:selected').text();
	var dischargeService = "";
	if($('#dischargeServiceCode :selected').val()!='')
		dischargeService = " - " + $('#dischargeServiceCode option:selected').text();
	//18644
	if(loadService==' - P'|| loadService==' - DCY' || dischargeService==' - P' ||dischargeService==' - DCY' )
	{
	if($('#deliveryZipCode').val()!='')
		//D031430:zip shown in accordian for both load/discharge service 'P' type
		if($('#deliveryZipCode').val()!='' && $('#deliveryZipCode').val()!=' '){
			dischargeService=dischargeService+"("+$('#deliveryZipCode').val()+")";
			}
		if($('#pickupZipCode').val()!='' && $('#pickupZipCode').val()!=' '){
			loadService=loadService+"("+$('#pickupZipCode').val()+")";
			}
	}
	var cities = "";
	if($('#blOriginCityCodeDescription').val()!='')
		cities = $('#blOriginCityCode').val();
	if($('#originPortCityCode').val()!='')
	{
		if(cities=='')
			cities = $('#originPortCityCode').val();
		else
			cities = cities + " - " + $('#originPortCityCode').val();
	}
	if($('#destinationPortCityCode').val()!='')
	{
		if(cities=='')
			cities = $('#destinationPortCityCode').val();
		else
			cities = cities + " - " + $('#destinationPortCityCode').val();
	}
	if($('#blDestinationCityCode').val()!='')
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
		vvd = " | " + $('#vessel').val() + " " + handleVoyage($('#voyage').val()) + " " + $('#direction').val();
	
	var sailDate = "";
	if($('#sailDate').val()!="")
		sailDate = " | " + $('#sailDate').val();
	
	var vgm = "";
	if($('#isVGMRequired').val() == 'true') {
		vgm = " | VGM-Y";
	} else if($('#isVGMRequired').val() == 'false') {
		vgm = "";
	} else if($('#isVgmRequiredDefault').text() == 'Yes') {
		vgm = " | VGM-Y";
	} else {
		vgm = "";
	}
	console.log("VGM header="+vgm);
	
	
	displayText = displayText + loadService + dischargeService + cities + vvd + sailDate+vgm;
	setAccordianTabDetails('routingHeader', displayText);	
}

function validateRoutingFieldsOnSave()
{
	var isValid = true;
	
	if($('#bookingTypeCode').val()=='B' && 
			$('#bookingStatusCode :selected').val()=='APPR')
	{
		if($('#loadServiceCode :selected').val()=='')
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			$('#loadServiceCode').validationEngine('showPrompt', 'Load Service is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#dischargeServiceCode :selected').val()=='')
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			$('#dischargeServiceCode').validationEngine('showPrompt', 'Discharge service is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#originPortCityCode').val()=='' || $('#originPortCityCodeDescription').val()=='')
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			$('#originPortCityCodeDescription').validationEngine('showPrompt', 'Origin Port is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#destinationPortCityCode').val()=='' || $('#destinationPortCityCodeDescription').val()=='')
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			$('#destinationPortCityCodeDescription').validationEngine('showPrompt', 'Destination Port is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#vessel').val()=='' && $('#voyage').val()=='' && $('#direction').val()=='')
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			if(!$('#routingMainDiv').is(':visible'))
				animatedcollapse.show('routingMainDiv');
			$('#vvdLabel').validationEngine('showPrompt', 'VVD is required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	/*if($('#isInBond :selected').val()=='true' && $('#inbondNumber').val()=='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
		expandRoutingDiv(isValid);
		$('#inbondNumber').validationEngine('showPrompt', 'Inbond number is required', 'error', 'topRight', true);
		isValid = false;
	}*/
	if($('#bookingTypeCode').val()=='B')
	{
		if(($('#newVessel').val()!='' || $('#newVoyage').val()!='' || $('#newDirection').val()!='')
				&& ($('#newVessel').val()=='' || $('#newVoyage').val()=='' || $('#newDirection').val()==''))
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			if(!$('#routingMainDiv').is(':visible'))
				animatedcollapse.show('routingMainDiv');
			$('#vvdLabel').validationEngine('showPrompt', 'VVD is invalid', 'error', 'topRight', true);
			isValid = false;
		}
		else if(($('#newVessel').val()!='' && $('#newVoyage').val()!='' && $('#newDirection').val()!='')
				&& ($('#newVessel').val()!=$('#vessel').val() || handleVoyage($('#newVoyage').val())!=handleVoyage($('#voyage').val())
						|| $('#newDirection').val()!=$('#direction').val()))
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			if(!$('#routingMainDiv').is(':visible'))
				animatedcollapse.show('routingMainDiv');
			$('#vvdLabel').validationEngine('showPrompt', 'VVD is invalid', 'error', 'topRight', true);
			isValid = false;
		}
		if(!$('#vvdChangeAuthPartyCode').attr("disabled") && $('#vvdChangeAuthPartyCode').attr("disabled")!="disabled"
			&& $('#vvdChangeAuthPartyCode :selected').val()=='' /*&& $('#vessel').val() !='' && 
			($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) != 
				($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text())*/)
		{
			//if(!$('#maintainBookingRouting').is(':visible'))
				expandRoutingDiv(isValid);
			if(!$('#routingMainDiv').is(':visible'))
				animatedcollapse.show('routingMainDiv');
			$('#vvdChangeAuthPartyCode').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#convCgoApptCutoffDate').val()!='' && !validateDate('convCgoApptCutoffDate', false))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		validateDate('convCgoApptCutoffDate', true);
		isValid = false;
	}
	if($('#convCgoEstArrivalDate').val()!='' && !validateDate('convCgoEstArrivalDate', false))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		validateDate('convCgoEstArrivalDate', true);
		isValid = false;
	}
	if($('#requiredDeliveryDate').val()!='' && !validateDate('requiredDeliveryDate', false))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		validateDate('requiredDeliveryDate', true);
		isValid = false;
	}
	if($('#premiumRDD').is(':visible') && 
			$('#premiumRDD').attr("disabled") != 'disabled' && $('#premiumRDD').val()=='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#premiumRDD').validationEngine('showPrompt', 'Premium RDD is required', 'error', 'topRight', true);
		isValid = false;
	}
	else if($('#premiumRDD').val()!='' && !validateDate('premiumRDD', false))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		validateDate('premiumRDD', true);
		isValid = false;
	}
	if(!validateTime('convCgoApptCutoffTime'))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#convCgoApptCutoffTime').validationEngine('showPrompt', 'Time should be in 24-hr HH:mm format', 'error', 'topRight', true);
		isValid = false;
	}
	if(!validateTime('convCgoEstArrivalTime'))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#convCgoEstArrivalTime').validationEngine('showPrompt', 'Time should be in 24-hr HH:mm format', 'error', 'topRight', true);
		isValid = false;
	}
	
	/*if($('#convCgoApptCutoffDate').val()!='' && $('#convCgoApptCutoffTime').val()=='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#convCgoApptCutoffTime').validationEngine('showPrompt', 'Conv Appt cutoff time required', 'error', 'topRight', true);
		isValid = false;
	}
	else */if($('#convCgoApptCutoffDate').val()=='' && $('#convCgoApptCutoffTime').val()!='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#convCgoApptCutoffDate').validationEngine('showPrompt', 'Conv Appt cutoff date required required', 'error', 'topRight', true);
		isValid = false;
	}
	
	/*if($('#convCgoEstArrivalDate').val()!='' && $('#convCgoEstArrivalTime').val()=='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#routingMainDiv').is(':visible'))
			animatedcollapse.show('routingMainDiv');
		$('#convCgoEstArrivalTime').validationEngine('showPrompt', 'Conv Cargo estimated time required', 'error', 'topRight', true);
		isValid = false;
	}
	else */if($('#convCgoEstArrivalDate').val()=='' && $('#convCgoEstArrivalTime').val()!='')
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		animatedcollapse.show('routingMainDiv');
		$('#convCgoEstArrivalDate').validationEngine('showPrompt', 'Conv Cargo estimated date required', 'error', 'topRight', true);
		isValid = false;
	}
	if($('#isAutoInlandMove :selected').val()=="true"
		&& $('#customerGroupId option:selected').text()!="COMMERCIAL AUTO GROUP")
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#inland').is(':visible'))
			animatedcollapse.show('inland');
		//window.scrollTo(0, 850);
		$('#isAutoInlandMove').validationEngine('showPrompt', 'Cannot be set to Y as Customer Group is not Commercial Auto Group', 'error', 'topRight', true);
		isValid = false;
	}
	if($('#intermodalDepartureDate').val()!='' && !validateDate('intermodalDepartureDate', false))
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#inland').is(':visible'))
			animatedcollapse.show('inland');
		//window.scrollTo(0, 850);
		validateDate('intermodalDepartureDate', true);
		isValid = false;
	}
	if($('#dealerAuctionLocationCode').val()!="" && $("#isAutoInlandMove :selected").val()=="false")
	{
		//if(!$('#maintainBookingRouting').is(':visible'))
			expandRoutingDiv(isValid);
		if(!$('#inland').is(':visible'))
			animatedcollapse.show('inland');
		//window.scrollTo(0, 850);
		$('#dealerAuctionLocationCode').validationEngine('showPrompt', 'Value not permitted as Auto Inland Move Flag = Y', 'error', 'topRight', true);
		isValid = false;
	}
	
	return isValid;
}

function expandRoutingDiv(isValid)
{
	if(isValid)
	{
		if(!$('#maintainBookingRouting').is(':visible'))
		{
			$('#routingAccordionHeader').removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top");
			$('#routingAccordionHeader span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
			$('#maintainBookingRouting').addClass('ui-accordion-content-active');
			$('#maintainBookingRouting').css('display', 'block');
			var status = $($('.booking-section')[3]).accordion('option', 'active');
			if (typeof status == "boolean" && !status) {
				$($('.booking-section')[3]).accordion('option', 'active', 0);
			}
		}
		var offset = accordianPostionCoordinates(3);
		window.scrollTo(offset.left, offset.top);
		//window.scrollTo(0, 400);
		//$('#routingLink').trigger('click');
	}
}

function setDomesticForeignIndicator()
{
	
	
	
	if($('#tradeCode').val()!='')
	{
		if($('#tradeCode').val()=='A') {
			$("#hazmatdiv").show();
		} else {
			$("#hazmatdiv").hide();
		}
		
		
		if($('#tradeCode').val()=='G' || $('#tradeCode').val()=='M')
		{
			domesticForeignIndicator =  "international";
			indicatorChangeEvents();
		}
		else if($('#tradeCode').val()=='F')
		{
			if($('#originPortCityCode').val()=='')
			{
				domesticForeignIndicator =  'none';
				indicatorChangeEvents();
			}
			else
			{
				$.ajax({
					url: "/gates/booking/routing/validateChinaTrade?cityCode="+$('#originPortCityCode').val(),
					success: function(responseText){
						if(responseText.data=="Y")
							domesticForeignIndicator =  "china";
						else
							domesticForeignIndicator = "international";
						
						indicatorChangeEvents();
					}
				});
			}
		}
		else
		{
			domesticForeignIndicator = "domestic";
			indicatorChangeEvents();
		}
	}
	else
	{
		domesticForeignIndicator = 'none';
		indicatorChangeEvents();
		$("#hazmatdiv").hide();
	}
}

function populateConsigneeNotify()
{
	if($('input[name="consignee\\.addressRoleId"]').val()!='')
	{
		$.ajax({
			url: _context +"/booking/party/getConsigneeNotify",
			data:{consigneeAroleId:$('input[name="consignee\\.addressRoleId"]').val(), domesticForeignIndicator:domesticForeignIndicator},
			success: function(){
				$("#gridIdForParties").trigger("reloadGrid");
			}
		});
	}
}

function indicatorChangeEvents()
{
	populateConsigneeNotify();
	checkMeasurementUnit();
	
	checkDestinationPortDefaultValue();
	checkPlaceOfDeliveryDefaultValue();
	checkOriginPtDefaultValue();
	checkIssuePtDefaultValue();
}

function checkMeasurementUnit()
{
	var isChanged = false;
	
	if(domesticForeignIndicator=="china")
	{
		//D030152
		if( $("#tradeCode").val()!='' && $("#tradeCode").val()=='F'){
			//D030789
			if($('#unitOfMeasureSourceCode').val()!='M')
			{
				$('#unitOfMeasureSourceCode').val('M');
				isChanged = true;
			}
		}else if($('#unitOfMeasureSourceCode :selected').val()=="I")
		{
			isChanged = true;
			$('#unitOfMeasureSourceCode').val('M');
		}
	}
	else
	{
		//D030152
		if( $("#tradeCode").val()!='' && $("#tradeCode").val()=='F'){
			//D030789
			if($('#unitOfMeasureSourceCode').val()!='M')
			{
				$('#unitOfMeasureSourceCode').val('M');
				isChanged = true;
			}
		}else if($('#unitOfMeasureSourceCode :selected').val()=="M")
		{
			isChanged = true;
			$('#unitOfMeasureSourceCode').val('M');
		}else{
			$('#unitOfMeasureSourceCode').val('I');
		}
	}
	
	if(isChanged)
		measurementUnitChange();
}

function validateTime(timeControl)
{
	if($('#'+timeControl).val()!='')
	{
		var time = $('#'+timeControl).val();
		if(time.length==4 && time.indexOf(':')==1)
		{
			time = "0"+time;
			return checkTime(time, timeControl);
		}
		else if(time.length==5 && time.indexOf(':')==2)
		{
			return checkTime(time, timeControl);
		}
		else
			return false;
	}
	else
		return true;
}

function validateForNonNegativeIntegers(value) {
	var re = new RegExp("^[0-9]+$");
	if (value<0) {
		return false;
	} else if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

function checkTime(time, timeControl)
{
	var hourInt = time.split(":")[0];
	var timeInt = time.split(":")[1];
	var isValid = false;
	
	if(validateForNonNegativeIntegers(hourInt) && hourInt>=0 && hourInt<=23 && 
			validateForNonNegativeIntegers(timeInt) && timeInt>=0 && timeInt<=59)
	{
		isValid = true;
		$('#'+timeControl).val(time);
	}
		
	return isValid;
}

function fetchTradeValue(marker){
	var originPortCode = $('#originPortCityCode').val();
	var destPortCode = $('#destinationPortCityCode').val();
	if(originPortCode!='' && destPortCode!='' && originPortCode!=destPortCode){
		$.ajax({
			   type: "POST",
			   data: {
				   originPortCode : originPortCode,
				   destPortCode : destPortCode
			   },
			   url: _context + "/booking/fetchTrade?originPortCode=" + originPortCode + "&destPortCode=" + destPortCode,
			   success: function(responseText){
				   if(responseText.success)
				   {
					    $("#tradeCode").val(responseText.data);
					    var previousTradeCode = $('#previousTradeCode').val();
					    var tradeCode = $('#tradeCode :selected').val();
					    var id = $(this).attr("id");
					    
					    if(previousTradeCode != tradeCode)
					    {
							if(previousTradeCode=='' && tradeCode!=''){
								$('#previousTradeCode').val($('#tradeCode').val());
								 /*  var xCoordinate = window.pageXOffset;
								   var yCoordinate = window.pageYOffset;*/
								   enableDisableCommodityIfTradeCustGrpLDGrpPresent();
								   setTimeout(function(){
									   $('#'+id).focus();
									   //window.scrollTo(xCoordinate, yCoordinate);
									}, 1000);
							}
							else if((previousTradeCode!='G' && tradeCode=='G') || (previousTradeCode!='F' && tradeCode=='F')){
								var showMessage = false;
								if(marker == 'destinationPortCity')
									showMessage = true;
								if(validateEquipmentOnTradeAndPODChange(showMessage)){
									$('#previousTradeCode').val($('#tradeCode').val());
								}
								else{
									$('#tradeCode').val($('#previousTradeCode').val());
								}
							}
							else
								$('#previousTradeCode').val($('#tradeCode').val());
					    }
					    setDomesticForeignIndicator();
				   }
				   else
					   setDomesticForeignIndicator();
			   }
		});	
	}else{
		// $("#tradeCode").val('');
		 setDomesticForeignIndicator();
	}
}

function showToolTip(evt) {
	if($("#inbondNumber").val()!='')
	{
		$('#toolTipDiv').html($("#inbondNumber").val()); 
		//popUp(event,'toolTipDiv');
		var wp = pw(); 
		dm = document.getElementById('toolTipDiv'); 
		ds = dm.style;
		st = ds.visibility; 
		if (dm.offsetWidth)
			ew = dm.offsetWidth; 
		else if (dm.clip.width) 
			ew = dm.clip.width; 
		tv = mouseY(evt) + 20;
		lv = mouseX(evt) - (ew/4);
		if (lv < 2) 
			lv = 2;
		else if (lv + ew > wp) 
			lv = lv - (ew/2);
		lv += 'px';
		tv += 'px';
		ds.left = lv;
		ds.top = tv;
		ds.visibility = "visible";
	}
}

function hideToolTip(event) {
	/*if($("#inbondNumber").val()!='')
	{
		popUp(event,'toolTipDiv');
	}*/
	dm = document.getElementById('toolTipDiv'); 
	ds = dm.style;
	st = ds.visibility; 
	if (dm.offsetWidth)
		ew = dm.offsetWidth; 
	else if (dm.clip.width) 
		ew = dm.clip.width; 
	if (st == "visible" || st == "show") 
	{ 
		ds.visibility = "hidden"; 
	}
}

function deriveValidateVVD(selector)
{
	$.ajax({
		url: _context +"/booking/routing/deriveValidateVVD",
		type : "POST",
		data : {
			selector :selector, 
			originPort : $('#originPortCityCode').val(), 
			destinationPort : $('#destinationPortCityCode').val(), 
			vessel: $('#vessel').val(), 
			voyage : $('#voyage').val(), 
			direction : $('#direction').val(), 
			sailDate : $('#sailDate').val()
		},
		success: function(responseText){
			$("#vvdRoutingGrid").trigger("reloadGrid");
			var messageContent = '';
			if (responseText.messages) {
				var messages = responseText.messages;
				
				if (messages.error.length > 0) {
					var array = messages.error;
					var len = messages.error.length;
					for (var i=0; i<len; i++) {
						messageContent += '<div class="message_error">' + array[i] + '</div>';
						if(array[i] != undefined && $.trim(array[i]) == 'Booking Assignment Maintenance required,'){
							messageContent = '<div class="message_error">'+ array[i] + "<a href="+_context + "/bookingMaintenance/showScreen>Click Here</a>"+'</div>';;
						}
					}
				}

				if (messages.warn.length > 0) {
					var array = messages.warn;
					var len = messages.warn.length;
					for (var i=0; i<len; i++) {
						messageContent += '<div class="message_warning">' + array[i] + '</div>';
						if(array[i] != undefined && $.trim(array[i]) == 'Booking Assignment Maintenance required,'){
							messageContent = '<div class="message_warning">'+ array[i] + "<a href="+_context + "/bookingMaintenance/showScreen>Click Here</a>"+'</div>';;
						}
					}
				}
			}

			$('#msgDiv').html($('#msgDiv').html()+messageContent);
			if(messageContent!='')
				window.scrollTo(0, 0);
			
			//Dialog not opened in case of Link and validate City already opening a dialog
			/*if(responseText.messages.error.length>0)
				triggerErrorMessageAlert('msgDiv');*/
		}
	});
}

function autotab(event, object)
{
	var keyCode = event.keyCode;
	
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
		if(object.value.length >= object.getAttribute("maxlength"))
		{
			if($(object).attr("id")=="newDirection" || $(object).attr("id")=="bkdDirection")
				$(object).blur();
			else if($(object).next().val()=='')
				$(object).next().focus();
		}
	}
	return true;
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
		url: _context +"/booking/routing/deriveZone",
		data : {portCode:portCode, zipcode:zipcode, selector:selector},
		success: function(responseText){
			if(selector=='pickup')
			{
				$('#pickupZone').val(responseText.data);
				$('#pickupZoneDisplay').html(responseText.data);
				checkPickupCarrier();
			}
			else if(selector=='delivery')
			{
				$('#deliveryZone').val(responseText.data);
				$('#deliveryZoneDisplay').html(responseText.data);
				checkDeliveryCarrier();
			}
		}
	});
}

function getAllLoadServices(){
	$('#loadServiceCode').attr("disabled", true);
	
	function callBack(responseText) { // cheetah
		setLoadDischargeValues(responseText.data, '#loadServiceCode', "");
		$('#loadServiceCode').attr("disabled", false);

		/*D028991** Re enforce security after DOM update Routing*/
        _enforceSecuritySection('maintainBookingRouting', 3, isRoutingDisplayOnly, isRoutingModifiable);
	}
	
	getAllLoadServicesRequest(callBack); // cheetah
}

function getAllLoadServicesRequest(callBack) { // cheetah
	var gatesCheetah = window.gatesCheetah || {};
	if (gatesCheetah && gatesCheetah.allLoadServices && gatesCheetah.allLoadServices !== null)  {
		console.log('Cheetah: getAllLoadServicesRequest from cache');
		callBack(gatesCheetah.allLoadServices);
		return;
	}
	console.log('Cheetah: getAllLoadServicesRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getAllLoadServices",
		success: callBack
	});
}

function getAllDischargeServices(){
	$('#dischargeServiceCode').attr("disabled", true);
	
	function callBack(responseText) { // cheetah
		setLoadDischargeValues(responseText.data, '#dischargeServiceCode', "");
		$('#dischargeServiceCode').attr("disabled", false);

		/*D028991** Re enforce security after DOM update Routing*/
        _enforceSecuritySection('maintainBookingRouting', 3, isRoutingDisplayOnly, isRoutingModifiable);
	}
	
	getAllDischargeServicesRequest(callBack); // cheetah
	
}

function getAllDischargeServicesRequest(callBack) { // cheetah
	var gatesCheetah = window.gatesCheetah || {};
	if (gatesCheetah && gatesCheetah.allDischargeServices && gatesCheetah.allDischargeServices !== null)  {
		console.log('Cheetah: getAllDischargeServicesRequest from cache');
		callBack(gatesCheetah.allDischargeServices);
		return;
	}
	console.log('Cheetah: getAllDischargeServicesRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getAllDischargeServices",
		success: callBack
	});
}

function getDischargeServicesRequest(callBack, serviceCode) { // cheetah
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var loadServiceCode = ('loadServiceCode' in bookingInitData) ? bookingInitData.loadServiceCode : '';
	var dischargeServices = ('dischargeServices' in bookingInitData) ? bookingInitData.dischargeServices : {};
	console.log('Cheetah: getDischargeServicesRequest: ' + serviceCode + ' || ' + loadServiceCode);
	if (serviceCode == loadServiceCode) {
		console.log('Cheetah: getDischargeServicesRequest from cache');
		callBack(dischargeServices);
		return;
	}
	console.log('Cheetah: getDischargeServicesRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getDischargeServices?loadService="+serviceCode,
		success: callBack
	});
}

function getLoadServicesRequest(callBack, serviceCode) { // cheetah
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var dischargeServiceCode = ('dischargeServiceCode' in bookingInitData) ? bookingInitData.dischargeServiceCode : '';
	var loadServices = ('loadServices' in bookingInitData) ? bookingInitData.loadServices : {};
	console.log('Cheetah: getLoadServicesRequest: ' + serviceCode + ' || ' + dischargeServiceCode);
	if (serviceCode == dischargeServiceCode)  {
		console.log('Cheetah: getLoadServicesRequest from cache');
		callBack(loadServices);
		return;
	}
	console.log('Cheetah: getLoadServicesRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getLoadServices?dischargeService="+serviceCode,
		success: callBack
	});	
}

function getLoadDischargePairRequest(callBack, loadCode, dischargeCode) { // cheetah
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var dischargeServiceCode = ('dischargeServiceCode' in bookingInitData) ? bookingInitData.dischargeServiceCode : '';
	var loadServiceCode = ('loadServiceCode' in bookingInitData) ? bookingInitData.loadServiceCode : '';
	var loadDischargePair = ('loadDischargePair' in bookingInitData) ? bookingInitData.loadDischargePair : {};
	console.log('Cheetah: getLoadDischargePairRequest: ' + loadCode + ' || ' + loadServiceCode + ' && ' + dischargeCode + ' || ' + dischargeServiceCode);
	if (loadCode == loadServiceCode && dischargeCode == dischargeServiceCode)  {
		console.log('Cheetah: getLoadDischargePairRequest from cache');
		callBack(loadDischargePair);
		return;
	}
	console.log('Cheetah: getLoadDischargePairRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getLoadDischargePair",
		data:{
			loadServiceCode : loadCode,
			dischargeServiceCode : dischargeCode
		},
		success: callBack
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

function checkVGM() {
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url: _context +"/booking/routing/getVGM",
		type : "POST",
		data : queryString,
		success: function(responseText){
				console.log(responseText.data.toString());
				if(responseText.data.toString() == 'true') {
					$('#isVgmRequiredDefault').html("Yes");
				} else {
					$('#isVgmRequiredDefault').html("No");
				}
				setRoutingHeader();
			}
	});
}

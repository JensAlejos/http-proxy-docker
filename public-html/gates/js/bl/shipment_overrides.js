$(function() {

	$('#overrideReset').click(
			function(){
				resetBookingOverrides();
			});
	
	$('.unchangeable').change(function()
	{
		if($(this).attr("checked"))
			$(this).attr("checked", false);
		else
			$(this).attr("checked", true);
	});
	
	
	/*Blur functions*/
	
	$('#overrideBlOrigin').change(
			function ()
			{
				if($('#overrideBlOrigin').val()!='')
					validateDefaults('blOrigin');
				else
				{
					setPlaceOfReceiptDefaultValue();
					$('#isOverrideBlOrigin').attr("checked", false);
					$('#overrideBlOrigin').css('color','black');
					checkOriginPtDefaultValue();
					setOverridesHeader();
				}
			});
	
	$('#overrideOriginPort').change(
			function ()
			{
				if($('#overrideOriginPort').val()!='')
					validateDefaults('originPort');
				else
				{
					setOriginPortDefaultValue();
					$('#isOverrideOriginPort').attr("checked", false);
					$('#overrideOriginPort').css('color','black');
					checkOriginPtDefaultValue();
					setOverridesHeader();
				}
			});
	
	$('#overrideDestinationPort').change(
			function ()
			{
				if($('#overrideDestinationPort').val()!='')
					validateDefaults('destinationPort');
				else
				{
					setDestinationPortDefaultValue();
					$('#isOverrideDestinationPort').attr("checked", false);
					$('#overrideDestinationPort').css('color','black');
					checkPlaceOfDeliveryDefaultValue();
					setOverridesHeader();
				}
			});
	
	$('#overrideBlDestination').change(
			function ()
			{
				if($('#overrideBlDestination').val()!='')
					validateDefaults('blDestination');
				else
				{
					setPlaceOfDeliveryDefaultValue();
					//D030250
					var isHawaiiTrade = '';
					if(domesticForeignIndicator == 'china' ){
						$.ajax({
							url: _context +"/shipment/routing/checkIfHawaiiTrade?cityCode="+$('#destinationPortCityCode').val(),
							async: false,
							success: function(responseText){
								isHawaiiTrade = responseText;
							}
						});
					}
					
					if(domesticForeignIndicator == 'china' && isHawaiiTrade == 'Y'){
						if(!$('#isOverrideDestinationPort').attr("checked")){
							$('#isOverrideBlDestination').attr("checked", false);
							$('#overrideBlDestination').css('color','black');
						}
					} else {
						$('#isOverrideBlDestination').attr("checked", false);
						$('#overrideBlDestination').css('color','black');
					}
					setOverridesHeader();
				}
				
			});
	
	$('#overrideCustomsVesselName').change(
			function ()
			{
				if($('#overrideCustomsVesselName').val()!='')
					validateDefaults('vessel');
				else
				{
					setVVDVesselDefaultValue();
					$('#isOverrideCustomsVesselName').attr("checked", false);
					$('#overrideCustomsVesselName').css('color','black');
					setOverridesHeader();
				}
				
			});
	
	$('#overrideVoyageDirectionSeq').change(
			function ()
			{
				if($('#overrideVoyageDirectionSeq').val()!='')
					validateDefaults('voyageDir');
				else
				{
					setVVDVoyageDefaultValue();
					$('#isOverrideVoyageDirectionSeq').attr("checked", false);
					$('#overrideVoyageDirectionSeq').css('color','black');
					setOverridesHeader();
				}
				
			});
	
	$('#countryOfOrigin').change(
			function ()
			{
				if($('#countryOfOrigin').val()!=''){
					var upperCountry=$('#countryOfOrigin').val();
					$('#countryOfOrigin').val(upperCountry.toUpperCase());
					validateDefaults('originCountry');
					}
				else
				{
					setOriginPtDefaultValue();
					$('#isOverrideCountryOfOrigin').attr("checked", false);
					$('#countryOfOrigin').css('color','black');
					setOverridesHeader();
				}
			});
	
	
	$('#overrideInitialVesselName').change(
			function ()
			{
				if($('#overrideInitialVesselName').val() !='')
				{
					$('#isOverrideInitialVesselName').attr("checked", true);
					$('#overrideInitialVesselName').css('color','green');
					setOverridesHeader();
					
				}
				else
				{
					$('#isOverrideInitialVesselName').attr("checked", false);
					$('#overrideInitialVesselName').css('color','black');
					setOverridesHeader();
				}
			});
	
	$('#overridePlaceOfIssue').change(
			function ()
			{
				if($('#overridePlaceOfIssue').val()!='')
					validateDefaults('issuePlace');
				else
				{
					setIssuePtDefaultValue();
					$('#isOverridePlaceOfIssue').attr("checked", false);
					$('#overridePlaceOfIssue').css('color','black');
					setOverridesHeader();
				}
				
			});
	
	$('#overrideInitialLtvDate').change(
			function ()
			{
				if($('#overrideInitialLtvDate').val() == $('#overrideInitialLtvDateDefaultvalue').val())
				{
					$('#isOverrideInitialLtvDate').attr("checked", false);
					//$('#overrideInitialLtvDate').val('01-01-0001');
					$('#overrideInitialLtvDate').css('color','black');
				}
				else if($('#overrideInitialLtvDate').val() =='01-01-0001'){
					$('#isOverrideInitialLtvDate').attr("checked", false);
					$('#overrideInitialLtvDate').css('color','black');
				}
				else{
					if($('#overrideInitialLtvDate').val() !='')
					$('#isOverrideInitialLtvDate').attr("checked", true);
					$('#overrideInitialLtvDate').css('color','green');
				}
					
				setOverridesHeader();
			});
	
	$('#overrideRouteInstruction').change(
			function ()
			{
				if($('#overrideRouteInstruction').val()!='')
					changeTextColour();
				else
					$('#overrideRouteInstruction').css('color','black');
				setOverridesHeader();
			});
	if(!$('#isOverrideInitialLtvDate').attr("checked")){
	if($('#overrideInitialLtvDateDefaultvalue').val()!=""){
	$('#overrideInitialLtvDate').val($('#overrideInitialLtvDateDefaultvalue').val());
	}
	}
	//$('#overrideInitialLtvDate').val('01-01-0001');
	$('#overridePlaceOfIssue').attr('disabled', true);
	 /*     setOriginPortDefaultValue();
	 $('#overrideOriginPort').trigger('blur');
	$('#overrideDestinationPort').trigger('blur');*/
	
});

function resetBookingOverrides()
{
	$('#isOverrideBlOrigin').attr("checked", false);
	$('#isOverrideOriginPort').attr("checked", false);
	$('#isOverrideDestinationPort').attr("checked", false);
	$('#isOverrideBlDestination').attr("checked", false);
	$('#isOverrideCustomsVesselName').attr("checked", false);
	$('#isOverrideVoyageDirectionSeq').attr("checked", false);
	$('#isOverrideCountryOfOrigin').attr("checked", false);
	$('#isOverridePlaceOfIssue').attr("checked", false);
	$('#isOverrideInitialVesselName').attr("checked", false);
	setPlaceOfReceiptDefaultValue();
	setOriginPortDefaultValue();
	setDestinationPortDefaultValue();
	setPlaceOfDeliveryDefaultValue();
	setVVDVesselDefaultValue();
	setVVDVoyageDefaultValue();
	setOriginPtDefaultValue();
	setIssuePtDefaultValue();
	$('#overrideInitialVesselName').val('');
	$('#overrideInitialLtvDate').val($('#overrideInitialLtvDateDefaultvalue').val());
	//$('#overrideInitialLtvDate').val('01-01-0001');
	populateDomesticRoutingExportInstructions();
	setOverridesHeader();
	changeTextColour();
	$('#isOverrideInitialLtvDate').attr("checked", false);
}

function setPlaceOfReceiptDefaultValue()
{
	var cityCode = "";
	if($('#freightOriginCityCode').val()!='' && $('#freightOriginCityCode').val()!= undefined)
		cityCode = $('#freightOriginCityCode').val();
	else if($('#blOriginCityCode').val()!='' && $('#blOriginCityCode').val()!=undefined)
		cityCode = $('#blOriginCityCode').val();
	//alert(cityCode);
	
	if(cityCode!='')
	{
		var shipment = $('#shipmentForm').formSerialize();
		
		$.ajax({
			async:false,
			type : "POST",
			data : shipment,
			url: _context +"/shipment/routing/getBlOriginDefaultValue",
			success: function(responseText){
				$('#overrideBlOrigin').val(responseText);
			}
		});
	}
	else
		$('#overrideBlOrigin').val('');
}

function setOriginPortDefaultValue()
{
	if($('#originPortCityCode').val()!='')
	{
		var shipment = $('#shipmentForm').formSerialize();
		$.ajax({
			async:false,
			type : "POST",
			data : shipment,
			url: _context +"/shipment/routing/getOriginDefaultValue",
			success: function(responseText){
				var overrideOriginPort = responseText; 
				$('#overrideOriginPort').val(overrideOriginPort);	
			}
		});
	}
	else
	{
		$('#overrideOriginPort').val('');
	}
}

function setDestinationPortDefaultValue()
{
	if($('#destinationPortCityCode').val()!='')
	{
		var shipment = $('#shipmentForm').formSerialize();
		$.ajax({
			async:false,
			type : "POST",
			url: _context +"/shipment/routing/getDestinationPortDefaultValue",
			data : shipment,
			success: function(responseText){
			var overrideDestPort = responseText; 
			//var splittedvalue = overrideOriginPort.split(",");
			$('#overrideDestinationPort').val(overrideDestPort);
		}
	});
	}
	else
	$('#overrideDestinationPort').val('');
}

function setPlaceOfDeliveryDefaultValue()
{
	var shipment = $('#shipmentForm').formSerialize();
	$.ajax({
		async:false,
		type : "POST",
		data : shipment,
		url: _context +"/shipment/routing/getBlDestinationDefaultValue",
		success: function(responseText){
			var overrideBlDestination = responseText; 
			$('#overrideBlDestination').val(overrideBlDestination);	
		}
	});
	
}

function setVVDVesselDefaultValue()
{
	//$('#overrideCustomsVesselName').val($('#vessel').val());
	var vesselcode = $('#vessel').val();
	if(vesselcode!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/getVesselName?vesselcode="+vesselcode,
			success: function(responseText){
				$('#overrideCustomsVesselName').val(responseText.data);
			}
		});
	}
	else
		$('#OverrideCustomsVesselName').val('');
}

function setVVDVoyageDefaultValue()
{
	if($('#voyage').val()!='' && $('#direction').val())
		$('#overrideVoyageDirectionSeq').val($('#voyage').val()+" "+$('#direction').val());
	else
		$('#overrideVoyageDirectionSeq').val('');
}

function setOriginPtDefaultValue()
{
	if(domesticForeignIndicator=='international')
	{
		if($('#isOverrideBlOrigin').attr("checked"))
			$('#countryOfOrigin').val($('#overrideBlOrigin').val());
		else if($('#isOverrideOriginPort').attr("checked"))
			$('#countryOfOrigin').val($('#overrideOriginPort').val());
		else 
		{
			var cityCode = "";
			/*if($('#freightOriginCityCode').val()!='')
				cityCode = $('#freightOriginCityCode').val();
			else */if($('#blOriginCityCode').val()!='')
				cityCode = $('#blOriginCityCode').val();
			else if($('#originPortCityCode').val()!='')
				cityCode = $('#originPortCityCode').val();
			if(cityCode!='')
			{
				$.ajax({
					url: _context +"/shipment/routing/getCityDataWithStateCountry?cityCode="+cityCode+"&tradeCode="+domesticForeignIndicator,
					success: function(responseText){
						$('#countryOfOrigin').val(responseText);
					}
				});
			}
			else
			{
				if($('#isOverrideBlOrigin').attr("checked"))
					$('#countryOfOrigin').val($('#overrideBlOrigin').val());
				else if($('#isOverrideOriginPort').attr("checked"))
					$('#countryOfOrigin').val($('#overrideOriginPort').val());
				else $('#countryOfOrigin').val('');
			}
				
		}
	}
	else if(domesticForeignIndicator=='china')
	{
		if($('#isOverrideBlOrigin').attr("checked"))
			$('#countryOfOrigin').val($('#overrideBlOrigin').val());
		else if($('#isOverrideOriginPort').attr("checked"))
			$('#countryOfOrigin').val($('#overrideOriginPort').val());
		else 
		{
			var cityCode = "";
			//alert("$('#freightOriginCityCode').val()="+$('#freightOriginCityCode').val());
			if($('#freightOriginCityCode').val()!=undefined &&$('#freightOriginCityCode').val()!='')
				cityCode = $('#freightOriginCityCode').val();
			else if($('#blOriginCityCode').val()!='')
				cityCode = $('#blOriginCityCode').val();
			else if($('#originPortCityCode').val()!='')
				cityCode = $('#originPortCityCode').val();
			if(cityCode!='')
			{//alert("cityCode"+cityCode);
				$.ajax({
					url: _context +"/shipment/routing/getCityDataWithCountry?cityCode="+cityCode+"&tradeCode="+domesticForeignIndicator,
					success: function(responseText){
						$('#countryOfOrigin').val(responseText);
					}
				});
			}
			else
			{
				if($('#isOverrideBlOrigin').attr("checked"))
					$('#countryOfOrigin').val($('#overrideBlOrigin').val());
				else if($('#isOverrideOriginPort').attr("checked"))
					$('#countryOfOrigin').val($('#overrideOriginPort').val());
				else $('#countryOfOrigin').val('');
			}
		}
	}
	else
	{
		if($('#isOverrideBlOrigin').attr("checked"))
			$('#countryOfOrigin').val($('#overrideBlOrigin').val());
		else if($('#isOverrideOriginPort').attr("checked"))
			$('#countryOfOrigin').val($('#overrideOriginPort').val());
		else $('#countryOfOrigin').val('');
	}
}

function setIssuePtDefaultValue()
{
	if(domesticForeignIndicator=='china' && $('#direction').val()=='E')
	{
		if($('#originPortCityCode').val()!='')
			$('#overridePlaceOfIssue').val($('#originPortCityCode').val());
		else
			$('#overridePlaceOfIssue').val('');
	}
	else
	{
		$('#overridePlaceOfIssue').val('');
		$('#overridePlaceOfIssue').attr('disabled', true);
	}
}

function populateDomesticRoutingExportInstructions()
{
	var vvdGridSize=0;
	$.ajax({
		url: _context +"/shipment/routing/vvdGridSize",
		async: false,
		success: function(responseText){
			
			vvdGridSize = responseText;
			if(vvdGridSize>1)
			{
				$.ajax({
					url: _context +"/shipment/routing/getRoutingInstructions",
					success: function(responseText){
						$("#overrideRouteInstruction").val(responseText);
						$('#overrideRouteInstruction').css('color','black');
					}
				});
			}
			else
				$('#overrideRouteInstruction').val('');
		}
	});
	
}

function checkIfDefault()
{
	if($('#isOverrideBlOrigin').is(':checked') || 
	$('#isOverrideCountryOfOrigin').is(':checked') || 
	$('#isOverrideOriginPort').is(':checked') || 
	$('#isOverrideInitialVesselName').is(':checked') || 
	$('#isOverridePlaceOfIssue').is(':checked') || 
	$('#isOverrideBlDestination').is(':checked') || 
	$('#isOverrideCustomsVesselName').is(':checked') || 
	$('#isOverrideVoyageDirectionSeq').is(':checked') || 
	$('#isOverrideDestinationPort').is(':checked'))
		return false;
	else
		return true;
}

function validateDefaults(identifier)
{
	var queryString = $('#shipmentForm').formSerialize();
	$.ajax({
		type: 'POST',
		url: _context +"/shipment/routing/validateDefaults?identifier="+identifier,
		data: queryString,
		success: function(responseText){
			
			$("#maintainShipmentOverrides").loadJSON(responseText);
			if(!responseText.isOverrideBlOrigin)
				$("#isOverrideBlOrigin").attr("checked", false);
			if(!responseText.isOverrideOriginPort)
				$("#isOverrideOriginPort").attr("checked", false);
			if(!responseText.isOverrideDestinationPort)
				$("#isOverrideDestinationPort").attr("checked", false);
			if(!responseText.isOverrideBlDestination)
				$("#isOverrideBlDestination").attr("checked", false);
			if(!responseText.isOverrideInitialVesselName)
				$("#isOverrideInitialVesselName").attr("checked", false);
			if(!responseText.isOverrideCountryOfOrigin)
				$("#isOverrideCountryOfOrigin").attr("checked", false);
			if(!responseText.isOverridePlaceOfIssue)
				$("#isOverridePlaceOfIssue").attr("checked", false);
			if(!responseText.isOverrideCustomsVesselName)
				$("#isOverrideCustomsVesselName").attr("checked", false);
			if(!responseText.isOverrideVoyageDirectionSeq)
				$("#isOverrideVoyageDirectionSeq").attr("checked", false);
			if(!responseText.isOverrideInitialLtvDate)
				$('#isOverrideInitialLtvDate').attr("checked", false);
			
			
			changeTextColour();
			checkOriginPtDefaultValue();
			checkPlaceOfDeliveryDefaultValue();
			setOverridesHeader();
			
			
		}
	});
}

function checkPlaceOfReceiptDefaultValue()
{
	if(!$('#isOverrideBlOrigin').attr("checked"))
		setPlaceOfReceiptDefaultValue();
}
function checkOriginPortDefaultValue(){
	if(!$('#isOverrideOriginPort').attr("checked"))
		setOriginPortDefaultValue();
}
function checkDestinationPortDefaultValue(){
	if(!$('#isOverrideDestinationPort').attr("checked"))
		setDestinationPortDefaultValue();
}
function checkPlaceOfDeliveryDefaultValue(){
	if(!$('#isOverrideBlDestination').attr("checked"))
		setPlaceOfDeliveryDefaultValue();
}
function checkVVDVesselDefaultValue(){
	if(($('#shipmentId').val()=='' && !$('#isOverrideCustomsVesselName').attr("checked")) || ($('#shipmentId').val()!='' && checkIfDefault()))
		setVVDVesselDefaultValue();
}
function checkVVDVoyageDefaultValue(){
	if(($('#shipmentId').val()=='' && !$('#isOverrideVoyageDirectionSeq').attr("checked")) || ($('#shipmentId').val()!='' && checkIfDefault()))
	setVVDVoyageDefaultValue();
}
function checkOriginPtDefaultValue(){
	if(!$('#isOverrideCountryOfOrigin').attr("checked"))
		setOriginPtDefaultValue();
}
function checkIssuePtDefaultValue(){
	if(domesticForeignIndicator=='china' && $('#direction').val()=='E')
	{	if(isRoutingOverrideModifiable){
			
		if($('#statusCode').text()!="CORRECTED" && $('#statusCode').text()!="ISSUED")
		$('#overridePlaceOfIssue').attr("disabled",false);
		}
		if(!$('#isOverridePlaceOfIssue').attr("checked"))
			setIssuePtDefaultValue();
	}
	else
	{
		$('#overridePlaceOfIssue').val('');
		$('#isOverridePlaceOfIssue').attr("checked", false);
		$('#overridePlaceOfIssue').attr("disabled", true);
	}
}

function changeTextColour()
{
	if($('#isOverrideBlOrigin').attr("checked"))
		$('#overrideBlOrigin').css('color','green');
	else
		$('#overrideBlOrigin').css('color','black');
	
	if($('#isOverrideOriginPort').attr("checked"))
		$('#overrideOriginPort').css('color','green');
	else
		$('#overrideOriginPort').css('color','black');
	
	if($('#isOverrideDestinationPort').attr("checked"))
		$('#overrideDestinationPort').css('color','green');
	else
		$('#overrideDestinationPort').css('color','black');
	
	if($('#isOverrideBlDestination').attr("checked"))
		$('#overrideBlDestination').css('color','green');
	else
		$('#overrideBlDestination').css('color','black');
	
	if($('#isOverrideCustomsVesselName').attr("checked"))
		$('#overrideCustomsVesselName').css('color','green');
	else
		$('#overrideCustomsVesselName').css('color','black');
	
	if($('#isOverrideVoyageDirectionSeq').attr("checked"))
		$('#overrideVoyageDirectionSeq').css('color','green');
	else
		$('#overrideVoyageDirectionSeq').css('color','black');
	
	if($('#isOverrideCountryOfOrigin').attr("checked"))
		$('#countryOfOrigin').css('color','green');
	else
		$('#countryOfOrigin').css('color','black');
	
	if($('#isOverridePlaceOfIssue').attr("checked"))
		$('#overridePlaceOfIssue').css('color','green');
	else
		$('#overridePlaceOfIssue').css('color','black');
	
	if($('#overrideInitialVesselName').val() !='')
		$('#overrideInitialVesselName').css('color','green');
	else
		$('#overrideInitialVesselName').css('color','black');
	
	if($('#overrideInitialLtvDate').val()!="01-01-0001" &&
			$('#overrideInitialLtvDate').val()!=$('#overrideInitialLtvDateDefaultvalue').val()){
		$('#isOverrideInitialLtvDate').attr("checked", true);
		if($('#overrideInitialLtvDate').val()=="01-01-0001"){
			$('#overrideInitialLtvDate').val("");
			$('#isOverrideInitialLtvDate').attr("checked", false);
		}else if($('#overrideInitialLtvDate').val()!=$('#overrideInitialLtvDateDefaultvalue').val()){
			$('#isOverrideInitialLtvDate').attr("checked", true);
		}
		else{
			$('#isOverrideInitialLtvDate').attr("checked", false);
		}
			
		$('#overrideInitialLtvDate').css('color','green');
		
	}
	else{
		if($('#overrideInitialLtvDate').val()=="01-01-0001"){
			$('#overrideInitialLtvDate').val("");
		}
		$('#overrideInitialLtvDate').css('color','black');
		$('#isOverrideInitialLtvDate').attr("checked", false);
	}
		
	
	
	
	
	
	var vvdGridSize=0;
	$.ajax({
		url: _context +"/shipment/routing/vvdGridSize",
		async: false,
		success: function(responseText){
			
			vvdGridSize = responseText;
			if($('#overrideRouteInstruction').val()!="")
			{
				if(vvdGridSize>1)
				{
					$.ajax({
						url: _context +"/shipment/routing/getRoutingInstructions",
						success: function(responseText){
							if($("#overrideRouteInstruction").val()==responseText)
								$('#overrideRouteInstruction').css('color','black');
							else
								$('#overrideRouteInstruction').css('color','green');
						}
					});
				}
				else
					$('#overrideRouteInstruction').css('color','green');
			}
			else
				$('#overrideRouteInstruction').css('color','black');
		}
	});
	
	
}
function setOverridesHeader()
{
    setShipmentOverridesHeader();
	$('#overrideHeaderCheckBox').addClass('noTab');
	if(!checkIfDefault())
	{
		$('#overrideHeaderCheckBox').attr('checked', true);
	}
	else
	{
		if($('#overrideInitialLtvDate').val()!=$('#overrideInitialLtvDateDefaultvalue').val()){
			if($('#overrideInitialLtvDate').val() =="01-01-0001"){
				$('#isOverrideInitialLtvDate').attr('checked', false);
			}else{
				$('#isOverrideInitialLtvDate').attr('checked', true);
			}
			
			$('#overrideHeaderCheckBox').attr('checked', true);
		}
		else
		{
			if($('#overrideRouteInstruction').val()!="")
			{
				var vvdGridSize=0;
				$.ajax({
					url: _context +"/shipment/routing/vvdGridSize",
					async: false,
					success: function(responseText){
						
						vvdGridSize = responseText;
					}
				});
				if(vvdGridSize>1){
					$.ajax({
						url: _context +"/shipment/routing/getRoutingInstructions",
						success: function(responseText){
							if($("#overrideRouteInstruction").val()==responseText)
								$('#overrideHeaderCheckBox').attr('checked', false);
							else
								$('#overrideHeaderCheckBox').attr('checked', true);
						}
					});
				}
				else
					$('#overrideHeaderCheckBox').attr('checked', true);
			}
			else
				$('#overrideHeaderCheckBox').attr('checked', false);
		}
	}
}
function validateOverridesFieldsOnSave()
{
	var isValid = true;
	
	if($('#overrideInitialLtvDate').val()!=$('#overrideInitialLtvDateDefaultvalue').val() && !validateDate('overrideInitialLtvDate', false))
	{
		if(!$('#maintainShipmentOverrides').is(':visible'))
			expandOverridesDiv();
		validateDate('overrideInitialLtvDate', true);
		isValid = false;
	}
	
	return isValid;
}

function setShipmentOverridesHeader(){
	var header='';
	if($('#blOriginCityCodeDescription').val()!=null && $('#blOriginCityCodeDescription').val()!='' && $('#isOverrideBlOrigin').attr("checked"))
		{
		header=header+'| PLR- '+$('#overrideBlOrigin').val();
		}
	if($('#blDestinationCityCodeDescription').val()!=null && $('#blDestinationCityCodeDescription').val()!='' &&  $('#isOverrideBlDestination').attr("checked"))
		{
		header=header+' | PLD- '+$('#overrideBlDestination').val();
		}
	if(header==''){
		setAccordianTabDetails('shipmentOverridesHeader', '');
		}
	else{
		setAccordianTabDetails('shipmentOverridesHeader', ' - '+header);
		}
}

function expandOverridesDiv()
{
	collapseAll();
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all')[9].className
	= "ui-accordion-header ui-helper-reset ui-state-active ui-corner-top";
	$('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	$('#maintainBookingOverrides').css('display', 'block');
	//$('#conditionAccordians').accordion('activate', 9);
	window.scrollTo(0, 0);
}

function populateOverrideFields(){
	if($('#overrideBlOrigin').val()!='')
		validateDefaults('blOrigin');
	else
	{
		setPlaceOfReceiptDefaultValue();
		$('#isOverrideBlOrigin').attr("checked", false);
		$('#overrideBlOrigin').css('color','black');
		checkOriginPtDefaultValue();
		//setOverridesHeader();
	}

	if($('#overrideOriginPort').val()!='')
		validateDefaults('originPort');
	else
	{
		setOriginPortDefaultValue();
		$('#isOverrideOriginPort').attr("checked", false);
		$('#overrideOriginPort').css('color','black');
		checkOriginPtDefaultValue();
		//setOverridesHeader();
	}

	if($('#overrideDestinationPort').val()!='')
		validateDefaults('destinationPort');
	else
	{
		setDestinationPortDefaultValue();
		$('#isOverrideDestinationPort').attr("checked", false);
		$('#overrideDestinationPort').css('color','black');
		checkPlaceOfDeliveryDefaultValue();
		//setOverridesHeader();
	}

	if($('#overrideBlDestination').val()!='')
		validateDefaults('blDestination');
	else
	{
		setPlaceOfDeliveryDefaultValue();
		//$('#isOverrideBlDestination').attr("checked", false);
		$('#overrideBlDestination').css('color','black');
		//setOverridesHeader();
	}

	if($('#overrideCustomsVesselName').val()!='')
		validateDefaults('vessel');
	else
	{
		setVVDVesselDefaultValue();
		$('#isOverrideCustomsVesselName').attr("checked", false);
		$('#overrideCustomsVesselName').css('color','black');
		//setOverridesHeader();
	}

	if($('#overrideVoyageDirectionSeq').val()!='')
		validateDefaults('voyageDir');
	else
	{
		setVVDVoyageDefaultValue();
		$('#isOverrideVoyageDirectionSeq').attr("checked", false);
		$('#overrideVoyageDirectionSeq').css('color','black');
		//setOverridesHeader();
	}

	if($('#countryOfOrigin').val()!='')
		validateDefaults('originCountry');
	else
	{
		setOriginPtDefaultValue();
		$('#isOverrideCountryOfOrigin').attr("checked", false);
		$('#countryOfOrigin').css('color','black');
		//setOverridesHeader();
	}

	if($('#overrideInitialVesselName').val() !='')
	{
		$('#isOverrideInitialVesselName').attr("checked", true);
		$('#overrideInitialVesselName').css('color','green');
		//setOverridesHeader();
		
	}
	else
	{
		$('#isOverrideInitialVesselName').attr("checked", false);
		$('#overrideInitialVesselName').css('color','black');
		//setOverridesHeader();
	}

	if($('#overridePlaceOfIssue').val()!='')
		validateDefaults('issuePlace');
	else
	{
		setIssuePtDefaultValue();
		$('#isOverridePlaceOfIssue').attr("checked", false);
		$('#overridePlaceOfIssue').css('color','black');
		//setOverridesHeader();
	}
	if($('#overrideInitialLtvDate').val() ==$('#overrideInitialLtvDateDefaultvalue').val())
	{//$('#overrideInitialLtvDate').val('01-01-0001');
		$('#isOverrideInitialLtvDate').attr("checked", false);
		$('#overrideInitialLtvDate').css('color','black');
	}
	else if($('#overrideInitialLtvDate').val() =="01-01-0001"){
		$('#overrideInitialLtvDate').val("");
		$('#isOverrideInitialLtvDate').attr("checked", false);
		$('#overrideInitialLtvDate').css('color','black');
	}
	else{
		if($('#overrideInitialLtvDate').val()=="01-01-0001"){
			$('#overrideInitialLtvDate').val("");
			$('#isOverrideInitialLtvDate').attr("checked", false);
		}else{
			$('#isOverrideInitialLtvDate').attr("checked", true);
		}
			
		$('#overrideInitialLtvDate').css('color','green');
		}
	//setOverridesHeader();

	if($('#overrideRouteInstruction').val()!='')
		changeTextColour();
	else
		$('#overrideRouteInstruction').css('color','black');
	//setOverridesHeader();

}

/*function setOverridesHeader() {
	if (checkIfDefault())
		$('#overrideHeaderCheckBox').attr('checked', false);
	else
		$('#overrideHeaderCheckBox').attr('checked', true);
}*/

/*function checkIfDefault() {
	if ($('#isOverrideBlOrigin').attr("checked")
			|| $('#isOverrideCountryOfOrigin').attr("checked")
			|| $('#isOverrideOriginPort').attr("checked")
			|| $('#isOverrideInitialVesselName').attr("checked")
			|| $('#isOverridePlaceOfIssue').attr("checked")
			|| $('#isOverrideBlDestination').attr("checked")
			|| $('#isOverrideCustomsVesselName').attr("checked")
			|| $('#isOverrideVoyageDirectionSeq').attr("checked")
			|| $('#isOverrideDestinationPort').attr("checked"))
		return false;
	else
		return true;
}*/
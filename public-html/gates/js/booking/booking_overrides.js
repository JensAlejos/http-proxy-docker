$(function() {

	$('#overrideReset').click(
			function(){
				isOverrideReset = "Y";
				resetBookingOverrides();
			});
	
	$('.unchangeable').change(function()
	{
		if($(this).attr("checked"))
			$(this).attr("checked", false);
		else
			$(this).attr("checked", true);
	});
	
	
	/*Change functions*/
	
	$('#overrideBlOrigin').change(
			function ()
			{
				bookingOverridesHeader();
				if($('#overrideBlOrigin').val()!='')
					validateDefaults('blOrigin');
				else
					setPlaceOfReceiptDefaultValue();
			});
	
	$('#overrideOriginPort').change(
			function ()
			{
				if($('#overrideOriginPort').val()!='')
					validateDefaults('originPort');
				else
					setOriginPortDefaultValue();
			});
	
	$('#overrideDestinationPort').change(
			function ()
			{
				if($('#overrideDestinationPort').val()!='')
					validateDefaults('destinationPort');
				else
					setDestinationPortDefaultValue();
			});
	
	$('#overrideBlDestination').change(
			function ()
			{
				bookingOverridesHeader();
				if($('#overrideBlDestination').val()!='')
					validateDefaults('blDestination');
				else
					setPlaceOfDeliveryDefaultValue();
			});
	
	$('#countryOfOrigin').change(
			function ()
			{
				if($('#countryOfOrigin').val()!=''){
					var upperCountry=$('#countryOfOrigin').val();//D026600
					$('#countryOfOrigin').val(upperCountry.toUpperCase());
					validateDefaults('originCountry');
					}
				   
				else
					setOriginPtDefaultValue();
			});
	
	$('#overridePlaceOfIssue').change(
			function ()
			{
				if($('#overridePlaceOfIssue').val()!='')
					validateDefaults('issuePlace');
				else
					setIssuePtDefaultValue();
			});
	

	$('#overrideCustomsVesselName').change(
			function ()
			{
				if($('#overrideCustomsVesselName').val()!='')
					validateDefaults('vessel');
				else
					setVVDVesselDefaultValue();
			});
	
	$('#overrideVoyageDirectionSeq').change(
			function ()
			{
				if($('#overrideVoyageDirectionSeq').val()!='')
					validateDefaults('voyageDir');
				else
					setVVDVoyageDefaultValue();
			});
	
	$('#overrideInitialVesselName').change(
			function ()
			{
				if($('#overrideInitialVesselName').val() !='')
				{
					$('#isOverrideInitialVesselName').attr("checked", true);
					$('#overrideInitialVesselName').css('color','green');
					$('#overrideHeaderCheckBox').attr('checked', true);
				}
				else
				{
					$('#isOverrideInitialVesselName').attr("checked", false);
					$('#overrideInitialVesselName').css('color','black');
					setOverridesHeader();
				}
			});
	
	$('#overrideInitialLtvDate').change(
			function ()
			{
				if($('#overrideInitialLtvDate').val() =='')
				{
					//$('#overrideInitialLtvDate').val('01-01-0001');
					$('#overrideInitialLtvDate').css('color','black');
					$('#isOverrideInitialLtvDate').attr("checked", false);
					setOverridesHeader();
				}
				else if($('#overrideInitialLtvDate').val() =='01-01-0001')
				{
					$('#overrideInitialLtvDate').css('color','black');
					$('#isOverrideInitialLtvDate').attr("checked", false);
					setOverridesHeader();
				}
				else
				{
					$('#overrideInitialLtvDate').css('color','green');
					$('#isOverrideInitialLtvDate').attr("checked", true);
					$('#overrideHeaderCheckBox').attr('checked', true);
				}
			});
	
	$('#overrideRouteInstruction').change(
			function ()
			{
				$.ajax({
					url: _context +"/booking/routing/getRoutingInstructions",
					success: function(responseText){
						if($("#overrideRouteInstruction").val()==responseText)
						{
							$('#overrideRouteInstruction').css('color','black');
							setOverridesHeader();
						}
						else
						{
							if($('#overrideRouteInstruction').val()!='')
							{
								$('#overrideRouteInstruction').css('color','green');
								$('#overrideHeaderCheckBox').attr('checked', true);
							}
							else
							{
								$("#overrideRouteInstruction").val(responseText);
								$('#overrideRouteInstruction').css('color','black');
								setOverridesHeader();
							}
						}
					}
				});
			});
	
	
	/*Focus functions*/
	
	/*$('#countryOfOrigin').focus(function()
	{
		if(domesticForeignIndicator!='international' && domesticForeignIndicator!='china')
		{
			$('#countryOfOrigin').blur();
			alert("Point and Country of Origin Override value not permitted for this trade");
		}
	});*/
	
	/*$('#overridePlaceOfIssue').focus(function()
	{
		$('#overridePlaceOfIssue').blur();
		alert("Place of issue Override value not permitted as booking is not China East bound");
	});*/
	
	//resetBookingOverrides();
	//$('#overrideInitialLtvDate').val('01-01-0001');
	
});


//18644
function bookingOverridesHeader(){
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
		setAccordianTabDetails('bookingOverridesHeader', '');
		}
	else{
		setAccordianTabDetails('bookingOverridesHeader', ' - '+header);
		}
}
function resetBookingOverrides()
{
	/*$('#isOverrideBlOrigin').attr("checked", false);
	$('#isOverrideOriginPort').attr("checked", false);
	$('#isOverrideDestinationPort').attr("checked", false);
	$('#isOverrideBlDestination').attr("checked", false);
	$('#isOverrideCustomsVesselName').attr("checked", false);
	$('#isOverrideVoyageDirectionSeq').attr("checked", false);
	$('#isOverrideCountryOfOrigin').attr("checked", false);
	$('#isOverridePlaceOfIssue').attr("checked", false);
	$('#isOverrideInitialVesselName').attr("checked", false);
	$('#isOverrideInitialLtvDate').attr("checked", false);*/
	
	setPlaceOfReceiptDefaultValue();
	setOriginPortDefaultValue();
	setDestinationPortDefaultValue();
	setPlaceOfDeliveryDefaultValue();
	setVVDVesselDefaultValue();
	setVVDVoyageDefaultValue();
	setOriginPtDefaultValue();
	setIssuePtDefaultValue();
	setOverrideInitialVesselNameDefaultValue();
	setInitialLtvDateDefaultValue();
	setDomesticRoutingExportInstructionsDefaultValue();
	
	setOverridesHeader();
	bookingOverridesHeader();
	changeTextColour();
}

function setPlaceOfReceiptDefaultValue(status)
{
	var cityCode = "";
	if($('#freightOriginCityCode').val()!='')
		cityCode = $('#freightOriginCityCode').val();
	else if($('#blOriginCityCode').val()!='')
		cityCode = $('#blOriginCityCode').val();
	
	if(cityCode!='')
	{
		$.ajax({
			url: _context +"/booking/routing/getCityData?cityCode="+cityCode,
			success: function(responseText){
				if($('#overrideBlOrigin').val()!=responseText && isOverrideReset == "Y")
					isBookingChanged ='Y';
				$('#overrideBlOrigin').val(responseText);
				$('#isOverrideBlOrigin').attr("checked", false);
				$('#overrideBlOrigin').css('color','black');
				checkOriginPtDefaultValue(status);
				setOverridesHeader();
			}
		});
	}
	else
	{
		if($("#overrideBlOrigin").val()!='' && isOverrideReset == "Y")
			isBookingChanged ='Y';
		$('#overrideBlOrigin').val('');
		$('#isOverrideBlOrigin').attr("checked", false);
		$('#overrideBlOrigin').css('color','black');
		checkOriginPtDefaultValue(status);
		setOverridesHeader();
	}
}

function setOriginPortDefaultValue(status)
{
	if($('#originPortCityCode').val()!='')
	{
		function callBack1(responseText) { // cheetah
			if($('#overrideOriginPort').val()!=responseText && isOverrideReset == "Y")
				isBookingChanged ='Y';
			$('#overrideOriginPort').val(responseText);
			$('#isOverrideOriginPort').attr("checked", false);
			$('#overrideOriginPort').css('color','black');
			checkOriginPtDefaultValue(status);
			setOverridesHeader();			
		}
		
		getOriginCityNameRequest(callBack1, $('#originPortCityCode').val());
		
	}
	else
	{
		if($("#overrideOriginPort").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideOriginPort').val('');
		$('#isOverrideOriginPort').attr("checked", false);
		$('#overrideOriginPort').css('color','black');
		checkOriginPtDefaultValue(status);
		setOverridesHeader();
	}
}

//D030250
function setDestinationPortDefaultValue(status)
{
	if($('#destinationPortCityCode').val()!='')
	{
		$.ajax({
			type : "GET",
			async:false,
			data:{	
				cityCode : $('#destinationPortCityCode').val(),
				tradeType : domesticForeignIndicator 
			 },
			url: _context +"/booking/routing/getDestinationPortDefaultValue",
			success: function(responseText){
				var overrideDestPort = responseText.data; 
				if($('#overrideDestinationPort').val()!=overrideDestPort && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overrideDestinationPort').val(overrideDestPort);
				$('#isOverrideDestinationPort').attr("checked", false);
				$('#overrideDestinationPort').css('color','black');
				checkPlaceOfDeliveryDefaultValue(status);
				setOverridesHeader();
			}
		});
	}
	else
	{
		if($("#overrideDestinationPort").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideDestinationPort').val('');
		$('#isOverrideDestinationPort').attr("checked", false);
		$('#overrideDestinationPort').css('color','black');
		checkPlaceOfDeliveryDefaultValue(status);
		setOverridesHeader();
	}
}

/*function setDestinationPortDefaultValue(status)
{
	if($('#destinationPortCityCode').val()!='')
	{
		if(domesticForeignIndicator=='china')
		{
			$.ajax({
				url: _context +"/booking/routing/getChineseTranslation?cityCode="+$('#destinationPortCityCode').val(),
				success: function(responseTextNew){
					if(responseTextNew.success)
					{
						if(responseTextNew.data != null && responseTextNew.data != 'null' && responseTextNew.data !='')
						{
							if($('#overrideDestinationPort').val()!=responseTextNew.data && isOverrideReset == "Y"){
								isBookingChanged ='Y';
							}
							$('#overrideDestinationPort').val(responseTextNew.data);
							$('#isOverrideDestinationPort').attr("checked", false);
							$('#overrideDestinationPort').css('color','black');
							checkPlaceOfDeliveryDefaultValue(status);
							setOverridesHeader();
						}
						else
						{
							
							function callBack2(responseText) { // cheetah
								if($('#overrideDestinationPort').val()!=responseText && isOverrideReset == "Y"){
									isBookingChanged ='Y';
								}
								$('#overrideDestinationPort').val(responseText);
								$('#isOverrideDestinationPort').attr("checked", false);
								$('#overrideDestinationPort').css('color','black');
								checkPlaceOfDeliveryDefaultValue(status);
								setOverridesHeader();		
							}
							
							getDestinationCityNameRequest(callBack2, $('#destinationPortCityCode').val());
							
						}
					}
				}
			});
		}
		else
		{
			function callBack3(responseText) {
				if($("#overrideDestinationPort").val()!=responseText && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overrideDestinationPort').val(responseText);
				$('#isOverrideDestinationPort').attr("checked", false);
				$('#overrideDestinationPort').css('color','black');
				checkPlaceOfDeliveryDefaultValue(status);
				setOverridesHeader();				
			}
			
			getDestinationCityNameRequest(callBack3, $('#destinationPortCityCode').val());

		}
	}
	else
	{
		if($("#overrideDestinationPort").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideDestinationPort').val('');
		$('#isOverrideDestinationPort').attr("checked", false);
		$('#overrideDestinationPort').css('color','black');
		checkPlaceOfDeliveryDefaultValue(status);
		setOverridesHeader();
	}
}*/

function getOriginCityNameRequest(callBack, cityCode) {
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var originCityPortCode = ('originPortCityCode' in bookingInitData) ? bookingInitData.originPortCityCode : '';
	var originCityPortName = ('originPortCityName' in bookingInitData) ? bookingInitData.originPortCityName : '';
	console.log('Cheetah: getOriginCityNameRequest' + originCityPortCode + ' || ' + cityCode);
	if (originCityPortCode == cityCode)  {
		console.log('Cheetah: getOriginCityNameRequest from cache');
		callBack(originCityPortName);
		return;
	}
	console.log('Cheetah: getOriginCityNameRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getCityName?cityCode="+cityCode,
		success: callBack
	});	
}

function getDestinationCityNameRequest(callBack, cityCode) {
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var destinationCityPortCode = ('destinationPortCityCode' in bookingInitData) ? bookingInitData.destinationPortCityCode : '';
	var destinationCityPortName = ('destinationPortCityName' in bookingInitData) ? bookingInitData.destinationPortCityName : '';
	console.log('Cheetah: getDestinationCityNameRequest' + destinationCityPortCode + ' || ' + cityCode);
	if (destinationCityPortCode == cityCode)  {
		console.log('Cheetah: getDestinationCityNameRequest from cache');
		callBack(destinationCityPortName);
		return;
	}
	console.log('Cheetah: getDestinationCityNameRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getCityName?cityCode="+cityCode,
		success: callBack
	});	
}

//D030250
function setPlaceOfDeliveryDefaultValue()
{
	if($('#destinationPortCityCode').val()!='')
	{
		$.ajax({
			type : "GET",
			async:false,
			data:{	
				blDestCityCode : $('#blDestinationCityCode').val(), 
				destCityCode : $('#destinationPortCityCode').val(),
				tradeType : domesticForeignIndicator 
			 },
			url : _context + "/booking/routing/getBlDestinationDefaultValue",
			success: function(responseText){
				var overrideDestPort = responseText.data; 
				if($('#overrideBlDestination').val()!=overrideDestPort && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overrideBlDestination').val(overrideDestPort);
				var isHawaiiTrade = '';
				if(domesticForeignIndicator == 'china' ){
					$.ajax({
						url: _context +"/booking/routing/checkIfHawaiiTrade?cityCode="+$('#destinationPortCityCode').val(),
						async: false,
						success: function(responseText){
							isHawaiiTrade = responseText;
						}
					});
				}
				if(domesticForeignIndicator=='china' && isHawaiiTrade == 'Y'){
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
	}
	else
	{
		if($("#overrideBlDestination").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideBlDestination').val('');
		$('#isOverrideBlDestination').attr("checked", false);
		$('#overrideBlDestination').css('color','black');
		setOverridesHeader();
	}
}

/*function setPlaceOfDeliveryDefaultValue() {
	
	if($('#blDestinationCityCode').val()!='')
	{
		$.ajax({
			url: _context +"/booking/routing/getCityData?cityCode="+$('#blDestinationCityCode').val(),
			success: function(responseText){
				if($('#overrideBlDestination').val()!=responseText && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overrideBlDestination').val(responseText);
				$('#isOverrideBlDestination').attr("checked", false);
				$('#overrideBlDestination').css('color','black');
				setOverridesHeader();
			}
		});
	}
	//Changed for D023005
	else if(domesticForeignIndicator=='domestic' && $('#destinationPortCityCode').val()!='' && $('#tradeCode :selected').val()!='H')	
	{
		$.ajax({
			url: _context +"/booking/routing/getCityData?cityCode="+$('#destinationPortCityCode').val(),
			success: function(responseText){
				if($('#overrideBlDestination').val()!=responseText && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overrideBlDestination').val(responseText);
				$('#isOverrideBlDestination').attr("checked", false);
				$('#overrideBlDestination').css('color','black');
				setOverridesHeader();
			}
		});
	}
	else if(domesticForeignIndicator=='china')
	{
		if($('#isOverrideDestinationPort').attr("checked") && $('#destinationPortCityCode').val()!='HON' && $('#destinationPortCityCode').val()!='NI')
		{
			if($("#overrideBlDestination").val()!=$('#overrideDestinationPort').val() && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#overrideBlDestination').val($('#overrideDestinationPort').val());
			$('#isOverrideBlDestination').attr("checked", false);
			$('#overrideBlDestination').css('color','black');
			setOverridesHeader();
		}
		else if($('#destinationPortCityCode').val()!='')
		{
			$.ajax({
				url: _context +"/booking/routing/getCityData?cityCode="+$('#destinationPortCityCode').val(),
				success: function(responseText){
					var myArr = responseText.split(",");
					$.ajax({
						url: _context +"/booking/routing/getChineseTranslation?cityCode="+$('#destinationPortCityCode').val(),
						success: function(responseTextNew){
							if(responseTextNew.success)
							{
								var resStr = responseTextNew.data;
								for (var i=1; i<myArr.length; i++) {
									resStr += ',' + myArr[i];
								}
								if($('#overrideBlDestination').val()!=resStr && isOverrideReset == "Y"){
									isBookingChanged ='Y';
								}
								$('#overrideBlDestination').val(resStr);
								$('#isOverrideBlDestination').attr("checked", false);
								$('#overrideBlDestination').css('color','black');
								setOverridesHeader();
							}
							else
							{
								if($('#overrideBlDestination').val()!=responseText && isOverrideReset == "Y"){
									isBookingChanged ='Y';
								}
								$('#overrideBlDestination').val(responseText);
								$('#isOverrideBlDestination').attr("checked", false);
								$('#overrideBlDestination').css('color','black');
								setOverridesHeader();
							}
						}
					});
				}
			});
		}
		else
		{
			if($("#overrideBlDestination").val()!='' && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#overrideBlDestination').val('');
			$('#isOverrideBlDestination').attr("checked", false);
			$('#overrideBlDestination').css('color','black');
			setOverridesHeader();
		}
	}
	else
	{
		if($("#overrideBlDestination").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideBlDestination').val('');
		$('#isOverrideBlDestination').attr("checked", false);
		$('#overrideBlDestination').css('color','black');
		setOverridesHeader();
	}
}*/



function setVVDVesselDefaultValue()
{
	if($('#vessel').val() != '')
	{
		function callBack(responseText) { //cheetah
			if($('#overrideCustomsVesselName').val()!=responseText && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#overrideCustomsVesselName').val(responseText);
			$('#isOverrideCustomsVesselName').attr("checked", false);
			$('#overrideCustomsVesselName').css('color','black');
			setOverridesHeader();
		}
			
		getVesselNameRequest(callBack, $('#vessel').val());

	}
	else
	{
		if($("#overrideCustomsVesselName").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideCustomsVesselName').val('');
		$('#isOverrideCustomsVesselName').attr("checked", false);
		$('#overrideCustomsVesselName').css('color','black');
		setOverridesHeader();
	}
}

function getVesselNameRequest(callBack, vessel) {
	var bookingInitData = ('bookingInitData' in (window.gatesCheetah || {}))? window.gatesCheetah.bookingInitData : {};
	var vesselCode = ('vesselCode' in bookingInitData) ? bookingInitData.vesselCode : '';
	var vesselName = ('vesselName' in bookingInitData) ? bookingInitData.vesselName : '';
	console.log('Cheetah: getVesselNameRequest' + vessel + ' || ' + vesselName);
	if (vessel == vesselCode) {
		console.log('Cheetah: getVesselNameRequest from cache');
		callBack(vesselName);
		return;
	}
	console.log('Cheetah: getVesselNameRequest from Ajax');
	$.ajax({
		url: _context +"/booking/routing/getVesselName?vesselCode="+vessel,
		success: callBack
	});	
}

function setVVDVoyageDefaultValue()
{
	
	if($('#voyage').val()!='' && $('#direction').val()!=''){
		var voyageDirection = handleVoyage($('#voyage').val())+" "+$('#direction').val();
		if($('#overrideVoyageDirectionSeq').val()!=voyageDirection && isOverrideReset == "Y")
			isBookingChanged ='Y';
		$('#overrideVoyageDirectionSeq').val(voyageDirection);
	}
	else{
		if($("#overrideVoyageDirectionSeq").val()!='' && isOverrideReset == "Y")
			isBookingChanged ='Y';
		$('#overrideVoyageDirectionSeq').val('');
	}
	$('#isOverrideVoyageDirectionSeq').attr("checked", false);
	$('#overrideVoyageDirectionSeq').css('color','black');
	setOverridesHeader();
	//isBookingChanged ='Y';
}

function setOriginPtDefaultValue()
{
	if(domesticForeignIndicator=='international')
	{
		if($('#isOverrideBlOrigin').attr("checked"))
		{
			if($("#countryOfOrigin").val()!=$('#overrideBlOrigin').val() && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#countryOfOrigin').val($('#overrideBlOrigin').val());
			$('#isOverrideCountryOfOrigin').attr("checked", false);
			$('#countryOfOrigin').css('color','black');
			setOverridesHeader();
		}
		else if($('#isOverrideOriginPort').attr("checked"))
		{
			if($("#countryOfOrigin").val()!=$('#overrideOriginPort').val() && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#countryOfOrigin').val($('#overrideOriginPort').val());
			$('#isOverrideCountryOfOrigin').attr("checked", false);
			$('#countryOfOrigin').css('color','black');
			setOverridesHeader();
		}
		else 
		{
			var cityCode = "";
			if($('#freightOriginCityCode').val()!='')
				cityCode = $('#freightOriginCityCode').val();
			else if($('#blOriginCityCode').val()!='')
				cityCode = $('#blOriginCityCode').val();
			else if($('#originPortCityCode').val()!='')
				cityCode = $('#originPortCityCode').val();
			if(cityCode!='')
			{
				$.ajax({
					url: _context +"/booking/routing/getCityDataWithStateCountry?cityCode="+cityCode,
					success: function(responseText){
						if($('#countryOfOrigin').val()!=responseText && isOverrideReset == "Y"){
							isBookingChanged ='Y';
						}
						$('#countryOfOrigin').val(responseText);
						$('#isOverrideCountryOfOrigin').attr("checked", false);
						$('#countryOfOrigin').css('color','black');
						setOverridesHeader();
					}
				});
			}
			else
			{
				if($("#countryOfOrigin").val()!='' && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#countryOfOrigin').val('');
				$('#isOverrideCountryOfOrigin').attr("checked", false);
				$('#countryOfOrigin').css('color','black');
				setOverridesHeader();
			}
		}
	}
	else if(domesticForeignIndicator=='china')
	{
		if($('#isOverrideBlOrigin').attr("checked"))
		{
			if($("#countryOfOrigin").val()!=$('#overrideBlOrigin').val() && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#countryOfOrigin').val($('#overrideBlOrigin').val());
			$('#isOverrideCountryOfOrigin').attr("checked", false);
			$('#countryOfOrigin').css('color','black');
			setOverridesHeader();
		}
		else if($('#isOverrideOriginPort').attr("checked"))
		{
			if($("#countryOfOrigin").val()!=$('#overrideOriginPort').val() && isOverrideReset == "Y"){
				isBookingChanged ='Y';
			}
			$('#countryOfOrigin').val($('#overrideOriginPort').val());
			$('#isOverrideCountryOfOrigin').attr("checked", false);
			$('#countryOfOrigin').css('color','black');
			setOverridesHeader();
		}
		else 
		{
			var cityCode = "";
			if($('#freightOriginCityCode').val()!='')
				cityCode = $('#freightOriginCityCode').val();
			else if($('#blOriginCityCode').val()!='')
				cityCode = $('#blOriginCityCode').val();
			else if($('#originPortCityCode').val()!='')
				cityCode = $('#originPortCityCode').val();
			if(cityCode!='')
			{
				$.ajax({
					url: _context +"/booking/routing/getCityDataWithCountry?cityCode="+cityCode,
					success: function(responseText){
						if($('#countryOfOrigin').val()!=responseText && isOverrideReset == "Y"){
							isBookingChanged ='Y';
						}
						$('#countryOfOrigin').val(responseText);
						$('#isOverrideCountryOfOrigin').attr("checked", false);
						$('#countryOfOrigin').css('color','black');
						setOverridesHeader();
					}
				});
			}
			else
			{
				if($("#countryOfOrigin").val()!='' && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#countryOfOrigin').val('');
				$('#isOverrideCountryOfOrigin').attr("checked", false);
				$('#countryOfOrigin').css('color','black');
				setOverridesHeader();
			}
		}
	}
	else
	{
		if($("#countryOfOrigin").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#countryOfOrigin').val('');
		$('#isOverrideCountryOfOrigin').attr("checked", false);
		$('#countryOfOrigin').css('color','black');
		setOverridesHeader();
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
		
		$.ajax({
			url: _context +"/booking/routing/getOverridePlOfIss?cityCode="+$('#originPortCityCode').val(),
			success: function(responseText){
				if($('#overridePlaceOfIssue').val()!=responseText && isOverrideReset == "Y"){
					isBookingChanged ='Y';
				}
				$('#overridePlaceOfIssue').val(responseText);
				$('#isOverridePlaceOfIssue').attr("checked", false);
				$('#overridePlaceOfIssue').css('color','black');
				setOverridesHeader();
			}
		});
	}
	else
	{
		if($("#overridePlaceOfIssue").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overridePlaceOfIssue').val('');
		$('#overridePlaceOfIssue').attr('disabled', true);
	}
	if($('#originPortCityCode').val()==$('#overridePlaceOfIssue').val()){
	$('#isOverridePlaceOfIssue').attr("checked", false);
	$('#overridePlaceOfIssue').css('color','black');
	}
	setOverridesHeader();
}

function setOverrideInitialVesselNameDefaultValue()
{
	if($("#overrideInitialVesselName").val()!='' && isOverrideReset == "Y"){
		isBookingChanged ='Y';
	}
	$('#overrideInitialVesselName').val('');
	$('#isOverrideInitialVesselName').attr("checked", false);
	$('#overrideInitialVesselName').css('color','black');
	setOverridesHeader();
}

function setInitialLtvDateDefaultValue()
{
	if($("#overrideInitialLtvDate").val()!='' && isOverrideReset == "Y"){
		isBookingChanged ='Y';
	}
	$('#overrideInitialLtvDate').val('');
	$('#isOverrideInitialLtvDate').attr("checked", false);
	$('#overrideInitialLtvDate').css('color','black');
	setOverridesHeader();
}

function setDomesticRoutingExportInstructionsDefaultValue()
{
	if($("#vvdRoutingGrid").getGridParam("reccount")>1)
	{
		$.ajax({
			url: _context +"/booking/routing/getRoutingInstructions",
			success: function(responseText){
				if($("#overrideRouteInstruction").val()!=responseText){
					isBookingChanged ='Y';
				}
				$("#overrideRouteInstruction").val(responseText);
				$('#overrideRouteInstruction').css('color','black');
				setOverridesHeader();
			}
		});
	}
	else
	{
		if($("#overrideRouteInstruction").val()!='' && isOverrideReset == "Y"){
			isBookingChanged ='Y';
		}
		$('#overrideRouteInstruction').val('');
		$('#overrideRouteInstruction').css('color','black');
		setOverridesHeader();
	}
}

function checkPlaceOfReceiptDefaultValue(status)
{
	if(status=="check")
	{
		if(!$('#isOverrideBlOrigin').attr("checked"))
			setPlaceOfReceiptDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideBlOrigin').attr("checked")))
		setPlaceOfReceiptDefaultValue();
}
function checkOriginPortDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideOriginPort').attr("checked"))
			setOriginPortDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideOriginPort').attr("checked")))
		setOriginPortDefaultValue();
}
function checkDestinationPortDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideDestinationPort').attr("checked"))
			setDestinationPortDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideDestinationPort').attr("checked")))
		setDestinationPortDefaultValue();
}
function checkPlaceOfDeliveryDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideBlDestination').attr("checked"))
			setPlaceOfDeliveryDefaultValue(status);
	}
	//028741
	else if(!$('#isOverrideBlDestination').attr("checked"))
		setPlaceOfDeliveryDefaultValue();
}
function checkVVDVesselDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideCustomsVesselName').attr("checked"))
			setVVDVesselDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideCustomsVesselName').attr("checked")))
		setVVDVesselDefaultValue();
}
function checkVVDVoyageDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideVoyageDirectionSeq').attr("checked"))
			setVVDVoyageDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideVoyageDirectionSeq').attr("checked")))
		setVVDVoyageDefaultValue();
}
function checkOriginPtDefaultValue(status){
	if(status=="check")
	{
		if(!$('#isOverrideCountryOfOrigin').attr("checked"))
			setOriginPtDefaultValue(status);
	}
	else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverrideCountryOfOrigin').attr("checked")))
		setOriginPtDefaultValue();
}
function checkIssuePtDefaultValue(status){
	if(domesticForeignIndicator=='china' && $('#direction').val()=='E')
	{
		/*Booking Security*/
		if(isRoutingOverrideModifiable){
			$('#overridePlaceOfIssue').attr("disabled", false);
			if(status=="check")
			{
				if(!$('#isOverridePlaceOfIssue').attr("checked"))
					setIssuePtDefaultValue(status);
			}
			else if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && !$('#isOverridePlaceOfIssue').attr("checked")))
				setIssuePtDefaultValue();
		}
	}
	else
	{
		$('#overridePlaceOfIssue').val('');
		$('#isOverridePlaceOfIssue').attr("checked", false);
		$('#overridePlaceOfIssue').attr("disabled", true);
	}
	setOverridesHeader();
}
function checkDomesticRoutingInstructions()
{
	if($('#bookingId').val()=='' || ($('#bookingId').val()!='' && $('#overrideRouteInstruction').css('color')=='rgb(0, 0, 0)'))
		setDomesticRoutingExportInstructionsDefaultValue();
}

function validateDefaults(identifier)
{
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		type: 'POST',
		url: _context +"/booking/routing/validateDefaults?identifier="+identifier,
		data: queryString,
		success: function(responseText){
			
			$("#maintainBookingOverrides").loadJSON(responseText);
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
			{
				$('#overrideVoyageDirectionSeq').val(responseText.overrideVoyageDirectionSeq);
				$("#isOverrideVoyageDirectionSeq").attr("checked", false);
			}
			
			if(identifier == 'blOrigin' || identifier == 'originPort')
				checkOriginPtDefaultValue();
			if(identifier == 'destinationPort')
				checkPlaceOfDeliveryDefaultValue();
			
			changeTextColour();
			setOverridesHeader();
		}
	});
}

function checkIfDefault()
{
	if($('#isOverrideBlOrigin').attr("checked") || 
	$('#isOverrideCountryOfOrigin').attr("checked") || 
	$('#isOverrideOriginPort').attr("checked") || 
	$('#isOverrideInitialVesselName').attr("checked") || 
	$('#isOverridePlaceOfIssue').attr("checked") || 
	$('#isOverrideBlDestination').attr("checked") || 
	$('#isOverrideCustomsVesselName').attr("checked") || 
	$('#isOverrideVoyageDirectionSeq').attr("checked") || 
	$('#isOverrideDestinationPort').attr("checked") ||
	$('#isOverrideInitialLtvDate').attr("checked"))
		return false;
	else
		return true;
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
	
	if($('#overrideInitialLtvDate').val() !='' && $('#overrideInitialLtvDate').val()!="01-01-0001")
		$('#overrideInitialLtvDate').css('color','green');
	else
		$('#overrideInitialLtvDate').css('color','black');
	
	if($("#vvdRoutingGrid").getGridParam("reccount")==3)
	{
		$.ajax({
			url: _context +"/booking/routing/getRoutingInstructions",
			success: function(responseText){
				if($("#overrideRouteInstruction").val()==responseText)
					$('#overrideRouteInstruction').css('color','black');
				else
					$('#overrideRouteInstruction').css('color','green');
			}
		});
	}
	else
	{
		if($("#overrideRouteInstruction").val()=='')
			$('#overrideRouteInstruction').css('color','black');
		else
			$('#overrideRouteInstruction').css('color','green');
	}
}

function setOverridesHeader()
{
	bookingOverridesHeader();
	if(!checkIfDefault() || $('#overrideRouteInstruction').css('color')!='rgb(0, 0, 0)')
		$('#overrideHeaderCheckBox').attr('checked', true);
	else
		$('#overrideHeaderCheckBox').attr('checked', false);
}

function validateOverridesFieldsOnSave()
{
	var isValid = true;
	if($('#overrideInitialLtvDate').val()!='')
	{
		if(!validateDate('overrideInitialLtvDate', false))
		{
			//if(!$('#maintainBookingOverrides').is(':visible'))
				expandOverridesDiv(isValid);
			validateDate('overrideInitialLtvDate', true);
			isValid = false;
		}
	}
	if($("#overrideRouteInstruction").val().length > 46) {
		expandOverridesDiv(isValid);
		$("#overrideRouteInstruction").validationEngine('showPrompt', "Instructions can't be more than 46 in length", 'error', true);
		isValid = false;
	}
	return isValid;
}

function expandOverridesDiv(isValid)
{
	if(isValid)
	{
		if(!$('#maintainBookingOverrides').is(':visible'))
		{
			$('#overridesAccordionHeader').removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top");
			$('#overridesAccordionHeader span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
			$('#maintainBookingOverrides').css('display', 'block');
		}
		var offset = accordianPostionCoordinates(9);
		window.scrollTo(offset.left, offset.top);
		//$('#conditionAccordians').accordion('activate', 9);
		//window.scrollTo(0, 622);
	}
}
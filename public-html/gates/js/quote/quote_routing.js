/**
 *  Javascript File for Maintaining routing section
 */

var executeCodeSrvcCdeHidden = true;
var _callingFunc = 0;
var domesticForeignIndicator = "none";

$(function() {	
	var statusCodeVal = $('#statusCode').val();
	
		
	$("input:radio[name=unitOfMeasureSourceCode]").click(function(){
		var unitOfMeasure = $("input:radio[name=unitOfMeasureSourceCode]").val();
    	$('#msgDiv').html('');
    	if($("#quoteCommodityGrid").getGridParam("reccount")>0)
    	{
			var isConfirm = confirm("Measurement System is being changed. Press Ok to confirm!");
			if (!isConfirm){
				if(unitOfMeasure=="I"){
					$("input:radio[name=unitOfMeasureSourceCode]").val("M");
					$("#metric").attr('checked', 'checked');	
					$("#jqgh_quoteCommodityGrid_weightPound").text("Wgt KG");
					$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cubic Meter");
					var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
					if (commodityRecords >0){
						for (var i=1;i<=commodityRecords; i++) {
							var weightLBS = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
							var weightKG = convertPoundToKG(weightLBS);
							$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightKG );
							
							var volumeImp = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
							var volumeMetric = convertToMetricVolume(volumeImp);
							$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeMetric );
						}
					}
				}
				else{
					$("input:radio[name=unitOfMeasureSourceCode]").val("I");
					$("#imperial").attr('checked', 'checked');		
					$("#jqgh_quoteCommodityGrid_weightPound").text("Weight");
					$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cube");
					var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
					if (commodityRecords >0){
						for (var i=1;i<=commodityRecords; i++) {
							var weightKG = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
							var weightLBS = convertKGToPound(weightKG);
							$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightLBS );
							
							var volumeMetric = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
							var volumeImp = convertToImperialVolume(volumeMetric);
							$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeImp );
						}
					}
				}
				return;
			}
    	}
		
    });
	
	/*
	 * 1. Predictive Search for "Place Of Receipt"
	 */
	var porData="";
	$('#blOriginCityCode').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		name: 'Bl Origin',
		autoSelectFirst : true,
		formatItem : function(item) {
			$(item).each(function(){
				porData+="-"+item.cityCode+"|"+item.cityName+"|"+item.stateCode;								     	    	
			});
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
			//return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		select : function(item) {			
			$('#blOriginCityCodeHidden').val(item.cityCode);
			_isQuoteChanged = true;
			_isRatingAttributeChanged = true;
			setRoutingHeader();
		}
	});
	
	$('#blOriginCityCode').gatesPopUpSearch({
		func : function() {
			placePopupSearch($('#blOriginCityCode').val(), 2);
		}
	});
	
	$("#blOriginCityCode").change(function() {
		var por=$("#blOriginCityCode").val();
		var arr=por.split("-");
		por=arr[0];
		var flag=true;
		if(por!='' && por!='ALL' && $.trim(porData)!=''){
			var values=porData.split("-");
			for(var i=1;i<values.length;i++){
				var val=values[i].split("|");
				if(por.toUpperCase()==val[0].toUpperCase()){
					if(val[2]!=''){
						$("#blOriginCityCode").val(val[0]+"-"+val[1]+","+val[2]);	
					}else{
						$("#blOriginCityCode").val(val[0]+"-"+val[1]);
					}
					
					flag=false;
					break;
				}
			}
			
		}
		if(flag && $.trim(porData)!=''){
			$("#blOriginCityCode").val("");
		}
		setRoutingHeader();
	});
	
	

	/*
	 * 2. Predictive Search for "Place Of Delivery"
	 */
	var poDelData="";
	$('#blDestinationCityCode').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		name: 'Bl Destination',		
		autoSelectFirst : true,
		formatItem : function(item) {			
			$(item).each(function(){
				poDelData+="-"+item.cityCode+"|"+item.cityName+"|"+item.stateCode;								     	    	
			});
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		formatResult : function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		select : function(item) {
			$('#blDestinationCityCodeHidden').val(item.cityCode);
			_isQuoteChanged = true;
			_isRatingAttributeChanged = true;
			setRoutingHeader();
		}
	});

	$('#blDestinationCityCode').gatesPopUpSearch({
		
		func : function() {
			placePopupSearch($('#blDestinationCityCode').val(), 5);
		}
	});
	
	$("#blDestinationCityCode").change(function() {
		var poDel=$("#blDestinationCityCode").val();
		var arr=poDel.split("-");
		poDel=arr[0];
		var flag=true;
		if(poDel!='' && poDel!='ALL' && $.trim(poDelData)!=''){
			var values=poDelData.split("-");
			for(var i=1;i<values.length;i++){
				var val=values[i].split("|");
				if(poDel.toUpperCase()==val[0].toUpperCase()){
					if(val[2]!=''){
						$("#blDestinationCityCode").val(val[0]+"-"+val[1]+","+val[2]);	
					}else{
						$("#blDestinationCityCode").val(val[0]+"-"+val[1]);
					}
					
					flag=false;
					break;
				}
			}
			
		}
		if(flag && $.trim(poDelData)!=''){
			$("#blDestinationCityCode").val("");
		}
		setRoutingHeader();
	});

	
	/*
	 * 3. Predictive Search for "Port of Loading"
	 */
	var polData="";
	$('#originPortCityCode').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
		name: 'Port of Loading',		
		autoSelectFirst : true,
		formatItem: function(item) {			
			$(item).each(function(){
				polData+="-"+item.cityCode+"|"+item.cityName+"|"+item.stateCode;								     	    	
			});
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		select: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				$('#originPortCityCode').val( item.cityCode+"-"+item.cityName+","+item.stateCode);	
			}
			else{
				$('#originPortCityCode').val( item.cityCode+"-"+item.cityName );
			}
			$('#originPortCityCodeHidden').val(item.cityCode);
			//$('#originPortCityCode').val(item);
			_isQuoteChanged = true;			
			_isRatingAttributeChanged = true;
			fetchTradeValue();
			$("#drayagePickupZipCode").val("");
			$("#drayagePickupZoneCode").val("");
			setRoutingHeader();
		}
	});

	$('#originPortCityCode').gatesPopUpSearch({//Added the popup Search ipcon for Defect D025578
		
		func : function() {
			portPopupSearch($('#originPortCityCode').val(), 3);
		}
	});
	
	
	/*
	 * 4. Predictive Search for "Port of Discharge"
	 */
	var podisData="";

	$('#destinationPortCityCode').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
		name: 'Port of Discharge',		
		autoSelectFirst : true,
		formatItem: function(item) {			
			$(item).each(function(){
				podisData+="-"+item.cityCode+"|"+item.cityName+"|"+item.stateCode;								     	    	
			});
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		formatResult: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				return item.cityCode+"-"+item.cityName+","+item.stateCode;	
			}
			else{
				return item.cityCode+"-"+item.cityName;
			}
		},
		select: function(item) {
			if(item.stateCode != " " && item.stateCode != undefined){
				$('#destinationPortCityCode').val(item.cityCode+"-"+item.cityName+","+item.stateCode);
				if(item.geography == "MAINLAND"){
					$('#isMainLand').val(true);
				}
			}
			else{
				$('#destinationPortCityCode').val(item.cityCode+"-"+item.cityName);
			}
			var destVal = "";
			if($('#destinationPortCityCode').val().indexOf("-") != -1){
				destVal = $('#destinationPortCityCode').val().split("-")[0];
			}else{
				destVal = item.cityCode;
			}
			/*$('#destinationPortCityCodeHidden').val(item.cityCode);*/
			$('#destinationPortCityCodeHidden').val(destVal);
			_isQuoteChanged = true;
			_isRatingAttributeChanged = true;
			fetchTradeValue();
			$("#drayageDeliveryZipCode").val("");
			$("#drayageDeliveryZoneCode").val("");
			setRoutingHeader();
		}
	});
	

	
	$('#destinationPortCityCode').gatesPopUpSearch({
		func : function() {
			portPopupSearch($('#destinationPortCityCode').val(),4);			
		}
	});
	
	$('#destinationPortCityCode').change(
			function(){
				var destinationPortCode = $('#destinationPortCityCode').val();
				if(destinationPortCode =='' ){
					fetchTradeValue();
					setRoutingHeader();
				}
			});
	
	$('#originPortCityCode').change(
			function(){
				var OriginPortCode = $('#originPortCityCode').val();
				if(OriginPortCode ==''  ){
					fetchTradeValue();
					setRoutingHeader();
				}
			});
	
	/*$('#destinationPortCityCode').keyup(function() {
		var poDis=$("#destinationPortCityCode").val();
		var arr=poDis.split("-");
		poDis=arr[0];
		var flag=true;
		if(poDis!='' && poDis!='ALL' && $.trim(podisData)!=''){
			var values=podisData.split("-");
			for(var i=1;i<values.length;i++){
				var val=values[i].split("|");
				if(poDis.toUpperCase()==val[0].toUpperCase()){
					if(val[2]!=''){
						$("#destinationPortCityCode").val(val[0]+"-"+val[1]+","+val[2]);	
					}else{
						$("#destinationPortCityCode").val(val[0]+"-"+val[1]);
					}
					
					flag=false;
					break;
				}
			}
			
		}
		if(flag && $.trim(podisData)!=''){
			$("#destinationPortCityCode").val("");
		}
		fetchTradeValue();
		if($('#destinationPortCityCode').val() == ""){
			$("#drayageDeliveryZipCode").val("");
			$("#drayageDeliveryZoneCode").val("");	
		}
		setRoutingHeader();
	});
	
	$('#originPortCityCode').keyup(function() {
		var pol=$("#originPortCityCode").val();
		var arr=pol.split("-");
		pol=arr[0];
		var flag=true;
		if(pol!='' && pol!='ALL' && $.trim(polData)!=''){
			var values=polData.split("-");
			for(var i=1;i<values.length;i++){
				var val=values[i].split("|");
				if(pol.toUpperCase()==val[0].toUpperCase()){
					if(val[2]!=''){
						$("#originPortCityCode").val(val[0]+"-"+val[1]+","+val[2]);	
					}else{
						$("#originPortCityCode").val(val[0]+"-"+val[1]);
					}
					
					flag=false;
					break;
				}
			}
			
		}
		if(flag && $.trim(polData)!=''){
			$("#originPortCityCode").val("");
		}
		
		fetchTradeValue();	
		if($('#originPortCityCode').val() == ""){
			$("#drayagePickupZipCode").val("");
			$("#drayagePickupZoneCode").val("");	
		}
		setRoutingHeader();
	});*/
	
	$('#drayagePickupZipCode').change(function() {
		if ($.trim($('#drayagePickupZipCode').val()) != "") {
			blockUI();
			var queryString = $('#quoteForm').formSerialize();
			var pickupZip = $.trim($('#drayagePickupZipCode').val());
			$('#drayagePickupZipCode').val(pickupZip);
			var originCityCode = getCodes( $('#blOriginCityCode').val() );
			var originPortCode = getCodes( $('#originPortCityCode').val() );
			var shipDate = $('#estimatedShipDate').val();
			_isQuoteChanged = true;
			_isRatingAttributeChanged = true;
			$.ajax({
				   type: "POST",
				   data: queryString,
				   url: _context + "/quote/fetchZoneVal?pickupZipCode=" + pickupZip + "&cityCode=" + originCityCode + "&portCode=" + originPortCode+"&shipDate="+shipDate,
				   success: function(responseText){
					   if(responseText.data.length > 0){
						   $("#drayagePickupZoneCode").val(responseText.data);
						   _isQuoteChanged = true;   
					   }else{
						   $("#drayagePickupZoneCode").val("");
					   }
					   showResponseMessages(responseText.messages);
					   $.unblockUI();
				   }
			});
		}else if ($('#drayagePickupZipCode').val() == ""){
			$("#drayagePickupZoneCode").val("");
		}
		setRoutingHeader();
	});
	
	$('#drayageDeliveryZipCode').change(function() {
		if ($.trim($('#drayageDeliveryZipCode').val()) != "") {
			blockUI();
			var queryString = $('#quoteForm').formSerialize();
			var dlvryZip = $.trim($('#drayageDeliveryZipCode').val());
			$('#drayageDeliveryZipCode').val(dlvryZip);
			var dstnCityCode = getCodes( $('#blDestinationCityCode').val() );
			var dstnPortCode = getCodes( $('#destinationPortCityCode').val() );
			var shipDate = $('#estimatedShipDate').val();
			_isQuoteChanged = true;
			_isRatingAttributeChanged = true;
			$.ajax({
				   type: "POST",
				   data: queryString,
				   url: _context +"/quote/fetchZoneVal?dlvryZipCode=" + dlvryZip + "&cityCode=" + dstnCityCode + "&portCode=" + dstnPortCode+ "&shipDate="+shipDate,
				   success: function(responseText){					   
					   if(responseText.data.length > 0){
						   $("#drayageDeliveryZoneCode").val(responseText.data);
						   _isQuoteChanged = true;   
					   }else{
						   $("#drayageDeliveryZoneCode").val("");
					   }
					   showResponseMessages(responseText.messages);
					   $.unblockUI();
				   }
			});
		}else if ($('#drayageDeliveryZipCode').val() == ""){
			$("#drayageDeliveryZoneCode").val("");
		}
		setRoutingHeader();
	});
	
	/*
	 * 5. Lookup Search of Service Code: 
	 * a. Input -> "LoadServiceCode"
	 *    Output-> "DischargeServiceCode" 
	 */

	$('#loadServiceCode').change(function() {
		
		var selectedDschrgServiceCode = $('#dischargeServiceCode :selected').val();
		var selectedLoadServiceCode = $('#loadServiceCode :selected').val();
		var litralString = "";
			document.getElementById("dischargeServiceCode").options.length = 0;
			$('#dischargeServiceCode')
		      .append($('<option>', { value : ""})
		      .text(""));
			
			$('#loadDschPairsListHidden option').each(function(){
				var loadService = this.text.split(",")[1];
				if(selectedLoadServiceCode != ""){
					if(loadService.split("=")[1] == selectedLoadServiceCode){
						$('#dischargeServiceCode')
					      .append($('<option>', { value : this.text.split(",")[2].split("=")[1] })
					      .text(this.text.split(",")[2].split("=")[1]));
					}
				}else if(litralString.indexOf("~!@"+this.text.split(",")[2].split("=")[1].trim()+"#$^")==-1)
				{
					litralString=litralString+"~!@"+this.text.split(",")[2].split("=")[1].trim()+"#$^";					
					$('#dischargeServiceCode')
				      .append($('<option>', { 
				    	  value : this.text.split(",")[2].split("=")[1]
				      })
				      .text(this.text.split(",")[2].split("=")[1]));
				}
			});
			$('#dischargeServiceCode option').sort(AssendingSort).appendTo('#dischargeServiceCode');
			$("#dischargeServiceCode option[value='" + selectedDschrgServiceCode + "']").attr("selected", "selected");
		
		if (selectedLoadServiceCode != "" && selectedDschrgServiceCode != "") {
			checkRoutingControlsStatus(selectedLoadServiceCode, selectedDschrgServiceCode);
		} else if (selectedLoadServiceCode == "" || selectedDschrgServiceCode == "") {
			enableRoutingControls();
		}
		_isQuoteChanged = true;
		_isRatingAttributeChanged = true;
		setRoutingHeader();		
		setServiceDescriptionTitle();
	});
	
/* 
 * b. Input -> "DischargeServiceCode"
 *    Output-> "LoadServiceCode" 
 */

	$("#dischargeServiceCode").change(function() {
		
		var selectedLoadServiceCode = $('#loadServiceCode :selected').val();
		var selectedDschrgServiceCode = $('#dischargeServiceCode :selected').val();
		var litralString = "";
			document.getElementById("loadServiceCode").options.length = 0;
			$('#loadServiceCode').append($('<option>', {value : ""}).text(""));
			$('#loadDschPairsListHidden option').each(function() {
				var loadService = this.text.split(",")[2];
				if (selectedDschrgServiceCode != "") {
					if (loadService.split("=")[1] == selectedDschrgServiceCode) {
						$('#loadServiceCode')
							.append($('<option>', {value : this.text.split(",")[1].split("=")[1] })
							.text(this.text.split(",")[1].split("=")[1]));
					}
				}else if(litralString.indexOf("~!@"+this.text.split(",")[1].split("=")[1]+"#$^")==-1)
				{
					litralString=litralString+"~!@"+this.text.split(",")[1].split("=")[1]+"#$^";
					$('#loadServiceCode')
					.append($('<option>', {
						value : this.text.split(",")[1].split("=")[1] 
					})
					.text(this.text.split(",")[1].split("=")[1]));
				}
			});
			$('#loadServiceCode option').sort(AssendingSort).appendTo('#loadServiceCode');
			$("#loadServiceCode option[value='" + selectedLoadServiceCode + "']").attr("selected", "selected");
		
			
		if (selectedLoadServiceCode != "" && selectedDschrgServiceCode != "") {
			checkRoutingControlsStatus(selectedLoadServiceCode, selectedDschrgServiceCode);
		} else if (selectedLoadServiceCode == "" || selectedDschrgServiceCode == "") {
			enableRoutingControls();
		}
		
		_isQuoteChanged = true;
		_isRatingAttributeChanged = true;
		setRoutingHeader();
		setServiceDescriptionTitle();
	});
	if ($("#loadServiceCodeTemp").val() != null && $("#loadServiceCodeTemp").val() != "") {
		$('#loadServiceCode').val($("#loadServiceCodeTemp").val().trim());
		$('#loadServiceCode').trigger("change");
		_isQuoteChanged = false;
		_isRatingAttributeChanged = false;
	}
	if ($("#dischargeServiceCodeTemp").val() != null && $("#dischargeServiceCodeTemp").val() != "") {
		$("#dischargeServiceCode").val($("#dischargeServiceCodeTemp").val().trim());
		$("#dischargeServiceCode").trigger("change");
		_isQuoteChanged = false;
		_isRatingAttributeChanged = false;
	}
	
	
});

function AssendingSort(a, b) {    
    if (a.innerHTML == 'Z') {
        return 1;   
    }
    else if (b.innerHTML == 'Z') {
        return -1;   
    }       
    return (a.innerHTML > b.innerHTML) ? 1 : -1;
};


/********** Supporting functions **********/

function portPopupSearch(place, id) {
	var values=place.split("-");
	var param=values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param + "|" + "Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);	
}

function placePopupSearch(place, id) {
	var values=place.split("-");
	var param=values[0];
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
		value=cityCode + "-" + cityName+","+stateName;	
	}else{
		value=cityCode + "-" + cityName;
	}
	if (_callingFunc == '2') {
		$('#blOriginCityCode').val(value);
		$('#blOriginCityCodeHidden').val(cityCode);
	}
	if (_callingFunc == '3') {
		$('#originPortCityCode').val(value);
		$('#originPortCityCodeHidden').val(cityCode);
		fetchTradeValue();		
		$("#drayagePickupZipCode").val("");
		$("#drayagePickupZoneCode").val("");
	}
	if (_callingFunc == '4') {
		$('#destinationPortCityCode').val(value);
		$('#destinationPortCityCodeHidden').val(cityCode);
		fetchTradeValue();
		$("#drayageDeliveryZipCode").val("");
		$("#drayageDeliveryZoneCode").val("");
	}
	if (_callingFunc == '5') {
		$('#blDestinationCityCode').val(value);
		$('#blDestinationCityCodeHidden').val(cityCode);		
	}
	_isQuoteChanged = true;
	_isRatingAttributeChanged = true;
	setRoutingHeader();
}

function checkRoutingControlsStatus(selectedLoadServiceCode, selectedDschrgServiceCode) {
	enableRoutingControls();

	$('#loadDschPairsListHidden option').each(function() {
		var ldspRowArray = this.text.split(",");
		var loadService = ldspRowArray[1];
		var dschrgService = ldspRowArray[2];

		if ((loadService.split("=")[1] == selectedLoadServiceCode)
				&& (dschrgService.split("=")[1] == selectedDschrgServiceCode)) {

			var blOriginInd = ldspRowArray[12];
			var blDstnInd = ldspRowArray[13];
			var pickupZip = ldspRowArray[14];
			var dlvryZip = ldspRowArray[15];

			if (blOriginInd.split("=")[1] == "N") {
				$('#blOriginCityCode').val("");
				$('#blOriginCityCodeHidden').val("");
				$('#blOriginCityCode').attr("disabled", true);
			} else {
				$('#blOriginCityCode').removeAttr("disabled");
			}
			if (blDstnInd.split("=")[1] == "N") {
				$('#blDestinationCityCode').val("");
				$('#blDestinationCityCodeHidden').val("");
				$('#blDestinationCityCode').attr("disabled", true);
			} else {
				$('#blDestinationCityCode').removeAttr("disabled");
			}
			if (pickupZip.split("=")[1] == "N") {
				$('#drayagePickupZipCode').val("");
				$('#drayagePickupZoneCode').val("");
				$('#drayagePickupZipCode').attr("disabled", true);
				$('#drayagePickupZoneCode').attr("disabled", true);
			} else {
				$('#drayagePickupZipCode').removeAttr("disabled");
				$('#drayagePickupZoneCode').removeAttr("disabled");
			}
			if (dlvryZip.split("=")[1] == "N") {
				$('#drayageDeliveryZipCode').val("");
				$('#drayageDeliveryZoneCode').val("");
				$('#drayageDeliveryZipCode').attr("disabled", true);
				$('#drayageDeliveryZoneCode').attr("disabled", true);
			} else {
				$('#drayageDeliveryZipCode').removeAttr("disabled");
				$('#drayageDeliveryZoneCode').removeAttr("disabled");
			}
			ldspGroupCode = ldspRowArray[6];
			$("#ldspGroupCode").val(ldspGroupCode.split("=")[1]);
		}
	});
}

function enableRoutingControls() {
	if (!($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD")) {
		$('#blOriginCityCode').attr("disabled", false);
		$('#blDestinationCityCode').attr("disabled", false);
		$('#drayagePickupZipCode').attr("disabled", false);
		$('#drayageDeliveryZipCode').attr("disabled", false);	
		$('#drayagePickupZoneCode').attr("disabled", false);
		$('#drayageDeliveryZoneCode').attr("disabled", false);
	}
}

function validateEstShipDate() {	
	var date = $('#estimatedShipDate').val();
	var dateSize = date.length;
	var newDate = date;
	var dt1 ;
	var mon1;
	var year1;
	
	if(dateSize == 6){
		dt1  = date.substring(2,4); 
		mon1 = date.substring(0,2);
		year1 = date.substring(4,6);
		newDate=mon1+"-"+dt1+"-20"+year1;
	} else if(dateSize == 8){
		if(date.indexOf("/")){
			dt1  = date.substring(3,5); 
			mon1 = date.substring(0,2);
			year1 = date.substring(6,8);	
			newDate=mon1+"-"+dt1+"-"+year1;
		}else{
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;	
		}
	}
	var valid = false;	
	if(isValidDate(newDate))
	{
		valid = true;
	}    
	
    if(!valid) {
		$('#estimatedShipDate').val("");
		return 'Shipment Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
	}			
    setRoutingHeader();
}

function fetchTradeValue(){
	var queryString = $('#quoteForm').formSerialize();
	var destPortCode = $('#destinationPortCityCode').val();		
	var originPortCode = $('#originPortCityCode').val();
	
	/*if(destPortCode != null && destPortCode != ""){
		if(destPortCode.indexOf("-") == -1){
			$('#msgDiv').html("<div class=\"message_error\">Port of Discharge refers to an invalid Port code. Please re-enter</div>");
			$('#msgDiv').show();
			return false;
		}
	}
	if(originPortCode != null && originPortCode != ""){
		if(originPortCode.indexOf("-") == -1){
			$('#msgDiv').html("<div class=\"message_error\">Port of Loading refers to an invalid Port code. Please re-enter</div>");
			$('#msgDiv').show();
			return false;
		}
	}*/
	
	destPortCode = getCodes( $('#destinationPortCityCode').val() );		
	originPortCode = getCodes( $('#originPortCityCode').val() );
	
	if(destPortCode != null && destPortCode != "" && originPortCode != null && originPortCode != ""){
		blockUI();
		$.ajax({
			   type: "POST",
			   data: queryString,
			   url: _context + "/quote/fetchTrade?originPortCode=" + originPortCode + "&destPortCode=" + destPortCode,
			   success: function(responseText){
				   if(responseText.data.success != "error"){
					   $("#tradeCode").val(responseText.data);   
				   }else{
					   $("#tradeCode").val("");
				   }
				   _isQuoteChanged = true;
				   setDomesticForeignIndicator();
				   $.unblockUI();
				   showResponseMessages(responseText.messages);
			   }
		});	
	}else if(destPortCode != null || destPortCode == "" || 
				originPortCode != null || originPortCode != ""){
		$("#tradeCode").val("");
		setDomesticForeignIndicator();
	}
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
	var len1 = date.length;
	if (matches == null) {
		if(len1<'8' || len1>'10') {
			return false;
		}
		if(len1=='8') {
			var dt1  = "";
			var mon1 = "";
			var yr1  = "";
			
			if(date.indexOf("/") || date.indexOf("-")){
				dt1  = date.substring(3,5);
			    mon1 = date.substring(0,2);
			    yr1  = date.substring(6,8);
			}else{
				dt1  = date.substring(2,4);
			    mon1 = date.substring(0,2);
			    yr1  = date.substring(4,8);
			}
			
		    var mn = mon1-1;
		    
			var composedDate = new Date(yr1, mn,dt1 );
			validDate = composedDate.getDate() == dt1 && 
				composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
			if(validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
				$('#estimatedShipDate').val(newDate);
				return newDate;
			} else {
				return null;
			}
		}
	} else {
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		validDate=composedDate.getDate() == d && 
			composedDate.getMonth() == m && composedDate.getFullYear() == y;
		if(validDate) {
			var newDate = matches[1] + "-" + d + "-" + y;
			$('#estimatedShipDate').val(newDate);
			return newDate;
		} else {
			return null;
		}
	}
}

function setDomesticForeignIndicator()
{
	if($('#tradeCode').val()!='')
	{
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
					url: "/gates/quote/validateChinaTrade?cityCode="+$('#originPortCityCode').val(),
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
	}
}

function indicatorChangeEvents(){
	 var tradeCode = $("#tradeCode").val();
	   
	   if(/*tradeCode=="F" && */domesticForeignIndicator=="china" && $("input:radio[name=unitOfMeasureSourceCode]").val()=="I")
		{
		    isChanged = true;
			$("input:radio[name=unitOfMeasureSourceCode]").val('M');
			$("#metric").attr('checked', 'checked');
			$("#jqgh_quoteCommodityGrid_weightPound").text("Wgt KG");
			$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cubic Meter");
			var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
			if (commodityRecords >0){
				for (var i=1;i<=commodityRecords; i++) {
					var weightLBS = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
					var weightKG = convertPoundToKG(weightLBS);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightKG );
					
					var volumeImp = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
					var volumeMetric = convertToMetricVolume(volumeImp);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeMetric );
				}
			}
		}
		else if(domesticForeignIndicator !="china" && $("input:radio[name=unitOfMeasureSourceCode]").val()=="M")
		{						
			$("input:radio[name=unitOfMeasureSourceCode]").val('I');
			$("#imperial").attr('checked', 'checked');
			$("#jqgh_quoteCommodityGrid_weightPound").text("Weight");
			$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cube");
			var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
			if (commodityRecords >0){
				for (var i=1;i<=commodityRecords; i++) {
					var weightKG = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
					var weightLBS = convertKGToPound(weightKG);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightLBS );
					
					var volumeMetric = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
					var volumeImp = convertToImperialVolume(volumeMetric);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeImp );
				}
			}
			isChanged = true;
		}
}
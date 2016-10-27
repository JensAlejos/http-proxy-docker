var _pageMode;
var _truckerRateIndex = 0;
var _isLastRecord = false;
var freeTimeValue = "";
var overTimeValue = "";

var changeFreeTime = false;
var changeOverTime = false;

var oldEffDate="";
var orgId="";
$(document).ready( function() {
	
	if($("#truckerName").val() != ""){
		$("#orgId").val($("#truckerName").val());
	}
	
	if($("#freeTimeRate").val() != ""){		
		$("#freeTimeRate").val($("#freeTimeRate").val().split(".")[0]);
	}
	if($("#overRegTimeHourlyRate").val() != ""){		
		overTimeValue = parseFloat($("#overRegTimeHourlyRate").val());
	}
	tabSequence('#maintainTruckerRateForm');
	
	$("#maintainTruckerRateForm").validationEngine('attach');
	
	animatedcollapse.init();
	animatedcollapse.addDiv('truckerDiv', 'fade=0,speed=1,hide=1');
	animatedcollapse.ontoggle=function($, divobj, state){};

	$( "#conditionAccordians" ).accordion({
		autoHeight: false,
		collapsible: false
	});
	
	if ($("#milTruckerRateId").val() == "") {
		$("#directionSeq option[value='B']").attr('selected', 'selected');
		$("#isDropPull option[value='N']").attr('selected', 'selected');
	} 

	$("#effectiveDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});	
	
	$("#expirationDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});		
	
	$('#truckerName').focusout(function() {		
		$('#trAccord').focus();
	});	
	
	$('#overRegTimeHourlyRate').focusout(function() {		
		$('#surchargeDescription').focus();
	});
	
	console.log("effectiveDate:"+$('#effectiveDate').val()+", expirationDate:"+$('#expirationDate').val());
	if ($('#effectiveDate').val() == "") {
		$('#effectiveDate').val(getCurrentEffecDate());
	}
	
	if ($('#expirationDate').val() == "") {
		$('#expirationDate').val(getDefaultExpirationDate());
	}
	
	$('#freightLocationCity').change(function(){
		$('#freightLocationCode').val("");
		$('#freightLocationState').val("");
		$('#freightLocationZipCode').val("");
	});
	$('#freightLocationCity').focusout(function(){
		if($('#freightLocationCode').val()=="")
		{
			$('#freightLocationCity').val("");
			$('#freightLocationCode').val("");
			$('#freightLocationState').val("");
			$('#freightLocationZipCode').val("");
		}
	});
	
	$('#rsdollar').change(function(){////D033743
		var milTrkerRateId = $("#milTruckerRateId").val();
		var milTrkerId = $("#milTruckerId").val();
		var rd = $("#rsdollar").val();
		
		if ((milTrkerRateId != null) && (milTrkerRateId != '')
				||(milTrkerId != null) && (milTrkerId != '')) {
			var defRsdollar = $("#defaultRsDollarVal").val();
			if(defRsdollar != null && defRsdollar != ''){
				if((milTrkerRateId == null) || (milTrkerRateId == '')){
						if(rd != null){
							if(rd != defRsdollar ){
								$("#rsdollar").css({
									"background-color" : "#cfe2f3"
								});
							} else {
								$("#rsdollar").css({
									"background-color" : "yellow"
								});
							}
						}
				} else {
					var defRsdollarpresent = $("#defaultRsDollar").val();
					if(defRsdollarpresent != null && defRsdollarpresent == 'Y'){
						if(rd != null){
							if(rd != defRsdollar ){
								$("#rsdollar").css({
									"background-color" : "#cfe2f3"
								});
							} else {
								$("#rsdollar").css({
									"background-color" : "yellow"
								});
							}
						}
					}
				}
			}
			
		}
		
		if(rd == null || rd == ''){
			$("#isAllowHouseholdGoodsMove").attr("disabled", false);
		} else {
			$("#isAllowHouseholdGoodsMove").attr("disabled", true);
		}
	});
	$('#rsdollar').focusout(function(){
		
	});
	
	$('#freeTimeRate').change(function(){
		changeFreeTime = true;
	});
	
	$('#overRegTimeHourlyRate').change(function(){
		changeOverTime = true;		
	});
	
	$('#rampCity').change(function(){
		$('#rampCityCode').val("");
		$('#rampState').val("");
	});
	$('#rampCity').focusout(function(){
		if($('#rampCityCode').val()=="")
		{
			$('#rampCity').val("");
			$('#rampCityCode').val("");
			$('#rampState').val("");
		}
	});
	
	var milTruckerRateId = $("#milTruckerRateId").val();
	var milTruckerId = $("#milTruckerId").val();

	if ((milTruckerRateId == null) || (milTruckerRateId == '')) {
		_pageMode = "Add";
		if ((milTruckerId == null) || (milTruckerId == '')) {//D033743
			$("#isAllowHouseholdGoodsMove").attr("checked", true);
		} else {
			var defaultRsInd = $("#defaultRsInd").val();
			if(defaultRsInd == 'Y'){//D033743
				$("#isAllowHouseholdGoodsMove").attr("checked", true);
			} else {
				$("#isAllowHouseholdGoodsMove").attr("checked", false);
			}
		}
		$("#truckerRateDelete").attr("disabled", true);
	} else {
		_pageMode = "Update";
	}
	
	var isEquipSizeType = $("#equipSizeType").val();
	var isChassisRate = $("#chassisRate").val();
	var isHaz = $("#haz").val();
	var isFreeTime = $("#freeTime").val();
	var isOverTime = $("#overTime").val();
	var _callingFunc = '1';

	if (isEquipSizeType == "true") {
		$("#equipmentTypeSize").css({
			"color" : "red"
		});
	} else {
		$("#equipmentTypeSize").css({
			"color" : "black"
		});
	}

	if (isChassisRate == "true") {
		$("#chaseRate").css({
			"color" : "red"
		});
	} else {
		$("#chaseRate").css({
			"color" : "black"
		});
	}
	
	if (isHaz == "true") {
		$("#hazardousFeeRate").css({
			"color" : "red"
		});
	}
	
	if (isFreeTime == "true") {
		$("#freeTimeRate").css({
			"color" : "red"
		});
	}
	
	if (isOverTime == "true") {
		$("#overRegTimeHourlyRate").css({
			"color" : "red"
		});
	}

	$('#truckerName').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do',
		name:'Trucker',
		extraParams: {
			  method: 'getTrucker',
			  searchType: '219',
			  from: 'truckerScac'
			},
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
		formatItem: function(data) {			
			if (data.nameqlf!=null && data.nameqlf!=''){
				return data.name+"-"+data.nameqlf;	
			}else{
				return data.name;
			}
			
		},
		formatResult: function(data) {
			if (data.nameqlf!=null && data.nameqlf!=''){
				return data.name+"-"+data.nameqlf;	
			}else{
				return data.name;
			}
		}, 
		select: function(data) {
			orgId=data.name;
			var id=data.id+"|"+data.name+"|"+data.nameqlf+"|"+data.address+"|"+data.city+"|"+data.state+"|"+data.zip+"|"+data.addroleid+"|"+data.orgid;			
			if ($("#milTruckerRateId").val() != "") {
				if($('#defaultRsDollar').val() != null && $('#defaultRsDollar').val() == 'Y'){ // // D033743 : This is to reset rsdollar so that in the controller method 'updateTrucker' the searched trucker rsdollar be returned
					$("#rsdollar").val('');
					$("#defaultRsDollar").val('');
					$("#defaultRsDollar").val('');
				}
				updateTruckerUrl =  _context + '/quote/truckerRate/updateTrucker?truckerData='+ encodeURIComponent(id);
				var queryString = $('#maintainTruckerRateForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: updateTruckerUrl,
					data: queryString,
					success: function(responseText){
						if(responseText.data.truckerName.charAt(responseText.data.truckerName.length - 1) == "-"){
							responseText.data.truckerName = responseText.data.truckerName.substring(0,responseText.data.truckerName.length - 2); 
						}
						$("#maintainTruckerRateForm").loadJSON(responseText.data);
						setResponseDataInTruckerFields(responseText.data);
						somethingChanged = true;
						$.unblockUI();
					}
				});
			}else{
				updateTruckerUrl =  _context + '/quote/truckerRate/showForm?truckerData='+ encodeURIComponent(id);
				document.location.href = updateTruckerUrl;		
				somethingChanged = true;
			}	
			
		}
	});	
	$('#truckerName').gatesPopUpSearch({
		func : function() {
			truckerPopupSearch();
		}
	});
	$('#freightLocationCity').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityPredictive',
		name:'Freight Location City',
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
		formatItem: function(item) {
				return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
				return item.cityName;
		},
		select: function(item) {
			$('#freightLocationCity').val(item.cityName);
			$('#freightLocationCode').val(item.cityCode);
			$('#freightLocationState').val(item.stateCode);
			somethingChanged = true;
		}	
	});
	$('#freightLocationZipCode').gatesPopUpSearch({
		func : function() {
			frieghtCityPopupSearch();
		}
	});
	$('#rampCity').gatesAutocomplete({
		source: _context+'/tm/Autocomplete/autoCompCityPredictive',
		name:'Ramp City',
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
		formatItem: function(item) {
				return item.cityCode+"-"+item.cityName+","+item.stateCode;
		},
		formatResult: function(item) {
				return item.cityName;
		},
		select: function(item) {
			$('#rampCity').val(item.cityName);
			$('#rampState').val(item.stateCode);
			$('#rampCityCode').val(item.cityCode);
			somethingChanged = true;
		}	
	});
	$('#rampState').gatesPopUpSearch({
		func : function() {
			rampCityPopupSearch();
		}
	});

	$('#truckerCost').change(function(){
		var truckerCostdec = parseFloat($('#truckerCost').val()).toFixed(2);
		if (truckerCostdec != "NaN") {
			$('#truckerCost').val(truckerCostdec);
		}
	});
	
	$('#truckerRateNew').click(function() {
		clearTruckerRateFields();
		//setDefaultValuesInRateFields();
	});
	
	$('#fuelSurchargeTypeCodePercentage').click(function() {
		var fuelSurchargeTypeCodePercentage = $("#fuelSurchargeTypeCodePercentage").attr('checked');

		if (fuelSurchargeTypeCodePercentage == true) {
			$("#fuelSurchargeTypeCodePercentage").val('P');				
		}
	});
	
	$('#fuelSurchargeTypeCodeAmount').click(function() {
		var fuelSurchargeTypeCodeAmount = $("#fuelSurchargeTypeCodeAmount").attr('checked');

		if (fuelSurchargeTypeCodeAmount == true) {
			$("#fuelSurchargeTypeCodeAmount").val('A');
		}
	});

	var dropPull = $("#isDropPull").val();
	if (dropPull == 'Y') {
		disableDropPullFields();
	} else {
		enableDropPullFields(false);
	}

	$('#isDropPull').change(function() {
		var dropPull = $("#isDropPull").val();
		if (dropPull == 'Y') {
			disableDropPullFields();
		}
		if (dropPull == 'N') {
			enableDropPullFields(true);		
		}
	});		
	
	$('#truckerRateSave').click(function() {
		console.log("Inside truckerRateSave");
		validateEffectiveDate();
		validateExpirationDate();
		validateFuelSurchargeAmount();
		
	});
	$('#truckerRateDelete').click(function() {
		$("#maintainTruckerRateForm").validationEngine('detach');
		var r = confirm("Are you sure you want to delete Trucker Rate?");
		if (r == true) {
			if (_pageMode == "Update") {
				$("#maintainTruckerRateForm").attr("action", "deleteTruckerRate");
				$("#maintainTruckerRateForm").submit();
			}
		}
	});

	$('#truckerRateCancel').click(function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				document.location.href = _context + '/cas/truckerRateSearch.do?isRefresh=true';
			}
		} else {
			document.location.href = _context + '/cas/truckerRateSearch.do?isRefresh=true';
		}		
	});
		
	$("#fuelSurchargeAmount").blur(function() {
		if($("#fuelSurchargeAmount").val().trim() != ""){
			getNumberFormat(this);	
		}		
	});
	
	$("#chaseRate").blur(function() {
		if($("#chaseRate").val() != ""){
			getNumberFormat(this);		
		}		
	});
	
	$("#hazardousFeeRate").blur(function() {
		if($("#hazardousFeeRate").val() != ""){
			getNumberFormat(this);		
		}
	});
	
	$("#overRegTimeHourlyRate").blur(function() {
		if($("#overRegTimeHourlyRate").val() != ""){
			getNumberFormat(this);		
		}
	});
	
	$('#truckerRateClear').click(function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				document.location.href=_context+'/quote/truckerRate/clearTruckerRate';
			}
		} else {
			document.location.href=_context+'/quote/truckerRate/clearTruckerRate';
		}
	});
	
	$("#truckerRatePrev").attr("disabled", true);
	_isLastRecord = $("#isLastRate").val();
	if(_isLastRecord){
		$("#truckerRateNext").attr("disabled", true);	
	}
	$('.ui-icon-triangle-1-s').hide();
	
	if (!$('#isAllowHouseholdGoodsMove').is(":checked")){//D033743
		$("#rsdollar").attr("disabled", true);
		document.getElementById("rsdollar").style.backgroundColor = "#cfe2f3";
		//var rs = $('#rsdollar').val();
		//if(rs != null || rs != ''){
			//$("#rsdollar").attr("disabled", false); // enable it as this is header value and not saved in truker rate table
		//}
		//$("#rsdollar").val('');
		//var drs = $('#defaultRsDollar').val();
		//if(drs == null || (drs != null && drs == 'N')){
			//$("#rsdollar").attr("disabled", true);
		//}
	} else {
		$("#rsdollar").attr("disabled", false);
	}
	
	if($('#rsdollar').val() != null && $('#rsdollar').val() != ''){
		$("#isAllowHouseholdGoodsMove").attr("disabled", true);
	} else {
		$("#isAllowHouseholdGoodsMove").attr("disabled", false);
	}
	
	if($('#defaultRsDollar').val() != null && $('#defaultRsDollar').val() == 'Y'){
		document.getElementById("rsdollar").style.backgroundColor = "yellow";
	}
	
	$('#isAllowHouseholdGoodsMove').click(function() {
		if (!$('#isAllowHouseholdGoodsMove').is(":checked")){
			document.getElementById("rsdollar").style.backgroundColor = "#cfe2f3";
			$("#rsdollar").attr("disabled", true);
			$("#rsdollar").val(null);
		} else {
			$("#rsdollar").attr("disabled", false);
		}
	});
	
});


function truckerPopupSearch(){
	param=$('#truckerName').val();
	param1=$('#organizationId').val();
	var actionUrl = _context + "/cas/truckerSearchLookup.do?filterValue1=" + encodeURIComponent(param) + "&orgId=" + encodeURIComponent(param1);
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'TruckerSearch', windowStyle);
}

function frieghtCityPopupSearch() {
	_callingFunc='2';
	var actionUrl = _context + "/city/manualLookup/showForm?term=" + $('#freightLocationCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function rampCityPopupSearch() {
	_callingFunc='3';
	var actionUrl = _context + "/city/manualLookup/showForm?term=" + $('#rampCityCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function cityUpdate(id){	
	var values = id.split(",");
	var cityCode = values[0];
	var cityCodeValues = cityCode.split(" ");
	var cityName = "";
	for (var i= 1; i < cityCodeValues.length; i++) {
		cityName += " " + cityCodeValues[i];
	}
	
	if(_callingFunc=='2') {		
		$('#freightLocationCity').val($.trim(cityName));
		$('#freightLocationCode').val(cityCodeValues[0]);
		$('#freightLocationState').val(values[1]);
		somethingChanged = true;
	}	
	if(_callingFunc=='3') {		
		$('#rampCity').val($.trim(cityName));
		$('#rampCityCode').val(cityCodeValues[0]);
		$('#rampState').val(values[1]);
		somethingChanged = true;
	}	
}

function removeErrorPointers() {
	$('#maintainTruckerRateForm').validationEngine('hideAll');
}

function truckerUpdate(id){
	// TRUCKER_ID,NAME,NAME_QUALIFIER,ADDRESS,
	// TRUCKER_CITY,STATE,ZIP,ADDROLE_ID	
	var values = id.split("|");
	var milTruckerRateId = $("#milTruckerRateId").val();
	orgId = values[1];
	if ($("#milTruckerRateId").val() != "") {
		updateTruckerUrl =  _context + '/quote/truckerRate/updateTrucker?truckerData=' + encodeURIComponent(id);		 
		var queryString = $('#maintainTruckerRateForm').formSerialize();
		blockUI();
		$.ajax({
			type: "POST",
			url: updateTruckerUrl,
			data: queryString,
			success: function(responseText){
				if(responseText.data.truckerName.charAt(responseText.data.truckerName.length - 1) == "-"){
					responseText.data.truckerName = responseText.data.truckerName.substring(0,responseText.data.truckerName.length - 2); 
				}
				$("#maintainTruckerRateForm").loadJSON(responseText.data);
				setResponseDataInTruckerFields(responseText.data);
				$.unblockUI();
			}
		});
	}else{
		updateTruckerUrl =  _context + '/quote/truckerRate/showForm?truckerData='+ encodeURIComponent(id);
		document.location.href = updateTruckerUrl;
	}
	somethingChanged = true;
}

function validateFuelSurchargeAmount(){
	var fuelSurchargePercentage =  $("#fuelSurchargeTypeCodePercentage").attr('checked');
	if(fuelSurchargePercentage==true || fuelSurchargePercentage=='checked'){
		var amount = $("#fuelSurchargeAmount").val();
		if(amount > 100){
			return "Trucker Surcharge cannot be greater than 100%.";
		}
	}
	var fuelSurchargeAmountdec = parseFloat($('#fuelSurchargeAmount').val()).toFixed(2);
	if (fuelSurchargeAmountdec != "NaN") {
		$('#fuelSurchargeAmount').val(fuelSurchargeAmountdec);
	}
}


function getCurrentEffecDate() {
	var fullDate = new Date();
	var dat = fullDate.getDate();
	var mon = fullDate.getMonth() + 1;
	var year = fullDate.getFullYear();
	if (dat < 10){
		dat = '0' + dat;
	}
	if (mon < 10) {
		mon = '0' + mon;
	} 
	var currentDate = mon + "-" + dat + "-" + year;
	return currentDate;
}

function getDefaultExpirationDate() {
	var dat = "31";
	var mon = "12";
	var year = "9999";

	var currentDate = mon + "-" + dat + "-" + year;
	console.log("Inside method getDefaultExpirationDate, expDate:"+$("#expirationDate").val()+", currentDate:"+currentDate);
	return currentDate;
}

function validateEffectiveDate() {
	console.log("At the start of method validateEffectiveDate, effDate:"+$("#effectiveDate").val());
	var effectiveDate = $("#effectiveDate").val();
	effectiveDate = effectiveDate.replace(/[^0-9]/g,'');
	var currentDate = new Date();
	var dd = currentDate.getDate();
	var mm = currentDate.getMonth()+1;
	var yyyy = currentDate.getFullYear();
	if (dd < 10){
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	} 
	var today = mm+'-'+dd+'-'+yyyy;
	if(effectiveDate.indexOf("/") != -1){
		$("#effectiveDate").val(today);
		return 'Effective Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
	}
	if (effectiveDate != null && effectiveDate != "") {
		//case1
		var date = effectiveDate;
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
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;
		}

		var valid = false;	
		if(isValidDate(newDate))
		{
			valid = true;
		}	
  		
		if(!valid) {
			$("#effectiveDate").val(today);
			return 'Effective Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
		}else{
			$('#effectiveDate').val(newDate);
		}		
	}
	else
	{
		$("#effectiveDate").val(today);
	}
	console.log("At the end of method validateEffectiveDate, effDate:"+$("#effectiveDate").val());
}

function validateExpirationDate() {
	console.log("At the start of method validateExpirationDate, expDate:"+$("#expirationDate").val());
	var expirationDate = $("#expirationDate").val();
	expirationDate = expirationDate.replace(/[^0-9]/g,'');
	/*var currentDate = new Date();
	var dd = currentDate.getDate();
	var mm = currentDate.getMonth()+1;
	var yyyy = currentDate.getFullYear();
	if (dd < 10){
		dd = '0' + dd;
	}
	if (mm < 10) {
		mm = '0' + mm;
	} */
	var today = '12-31-9999';
	if(expirationDate.indexOf("/") != -1){
		$("#expirationDate").val(today);
		return 'Expiration Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
	}
	if (expirationDate != null && expirationDate != "") {
		//case1
		var date = expirationDate;
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
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;
		}

		var valid = false;	
		if(isValidDate(newDate))
		{
			valid = true;
		}	
  		
		if(!valid) {
			$("#expirationDate").val(today);
			return 'Expiration Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
		}else{
			$('#expirationDate').val(newDate);
		}		
	}
	else
	{
		$("#expirationDate").val(today);
	}
	console.log("At the end of method validateExpirationDate, expDate:"+$("#expirationDate").val());
}

function validateFreeTimeAndOverTime() {
	var dropPull = $("#isDropPull").val();
	var freeTimeTrucker = $("#truckerFreeTime").val();
	var truckerOverTime = $("#truckerOverTime").val();
	var freeTimeRate = $("#freeTimeRate").val();
	var overTimeRate = $("#overRegTimeHourlyRate").val();
	if (dropPull == 'N') {
		if (freeTimeRate == '') {
			if (freeTimeTrucker == '') {
				$('#freeTimeRate').validationEngine('showPrompt', 
						'Free Time required when Drop Pull is N',
						'error', true);
				return 'false';
				//return "Free Time required when Drop Pull is N";
			}
			else{
				 $("#freeTimeRate").val(freeTimeTrucker);
			}
		}
		if (overTimeRate == '') {
			if (truckerOverTime == '') {
				$('#overRegTimeHourlyRate').validationEngine('showPrompt', 
						'Over Time required when Drop Pull is N',
						'error', true);
				return 'false';
				//return "Over Time required when Drop Pull is N";
			}
			else{
				 $("#overRegTimeHourlyRate").val(truckerOverTime);
			}
		}
	}
	return 'true';
}

function validateOverTime(field, rules, i, options) {
	var dropPull = $("#isDropPull").val();
	var overTimeRate = $("#overRegTimeHourlyRate").val();
	if ((dropPull == 'N') && (overTimeRate=='')) {
		return "Over Time required when Drop Pull is N";
	}
}

function imposeMaxLength(obj, maxLength) {
	return (obj.value.length <= maxLength-1);	
}

function isExpirationBeforeEffective(date1,date2) {
	console.log("Inside method isExpirationBeforeEffective, date1:"+date1+", date2:"+date2);
	var effDate = parseToDate(date1);
	var expDate = parseToDate(date2);
	console.log("Inside method isExpirationBeforeEffective, effDate:"+effDate+", expDate:"+expDate);
	if(effDate!=null && expDate!=null){
		if(expDate.getTime()>=effDate.getTime()){
			return true;
		}
		else{
			return false;
		}
	}
	return true;
}
function isExpirationBeforeToday(date1) {
	console.log("Inside method isExpirationBeforeToday, date1:"+date1);
	var today = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
	var expDate = parseToDate(date1);
	console.log("Inside method isExpirationBeforeToday, today:"+today+", expDate:"+expDate);
	if(today!=null && expDate!=null){
		if(expDate.getTime()>=today.getTime()){
			return true;
		}
		else{
			return false;
		}
	}
	return true;
}

function parseToDate(dateStr){
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(dateStr);
	if(matches!=null){
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		return composedDate;
	}

	return null;
}
function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;

    var len1 = date.length;
	if (matches == null) {
		if(len1 < '8' && len1>'10') {
			return false;
		}
		if(len1 == '8') {
			var dt1 = date.substring(2,4);
		    var mon1 = date.substring(0,2);
		    var mn = mon1-1;
		    var yr1 = date.substring(4,8);
			var composedDate = new Date(yr1, mn,dt1 );
			validDate = composedDate.getDate() == dt1 && composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
			if(validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
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

		validDate = composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
		
		if(validDate) {	
			var newDate = matches[1] + "-" + d + "-" + y;
			return newDate;
		} else {
			return null;
		}
	}
}

function clearTruckerRateFields(){
	// changes as per D025344 - retain most of the screen data.
	$("#milTruckerRateId").val("");
	//$("#freightLocationCity").val("");
	//$("#freightLocationState").val("");
	//$("#freightLocationZipCode").val("");
	//$("#rampCity").val("");
	//$("#rampState").val("");
	//$("#ramp").val("");
	$("#equipmentTypeSize").val($("#truckerEquipType").val());
	$("#truckerCost").val("");
	$("#fuelSurchargeAmount").val($("#truckerFuelSurcharge").val());
	$("#chaseRate").val($("#truckerChassisRate").val());
	$("#hazardousFeeRate").val($("#truckerHazRate").val());
	$("#freeTimeRate").val($("#truckerFreeTime").val());
	$("#overRegTimeHourlyRate").val($("#truckerOverTime").val());
	$("#totalCharge").val("");
	//$("#surchargeDescription").val("");
	
	$('#effectiveDate').val(getCurrentEffecDate());
	$('#expirationDate').val(getDefaultExpirationDate());
	//$("#directionSeq option[value='B']").attr('selected', 'selected');
	//$("#isAllowHouseholdGoodsMove").attr("checked", true);
	$("#fuelSurchargeTypeCodePercentage").val('P');
	$("#isDropPull option[value='N']").attr('selected', 'selected');
}

function setDefaultValuesInRateFields(){
	/* commented out as per D025345
	$("#equipmentTypeSize").val($("#truckerEquipType").val());	
	$("#fuelSurchargeAmount").val($("#truckerFuelSurcharge").val());
	$("#chaseRate").val($("#truckerChassisRate").val());
	$("#hazardousFeeRate").val($("#truckerHazRate").val());
	$("#isDropPull option[value='N']").attr('selected', 'selected');
	//disableDropPullFields();	commented out as per D025345
	*/
}

function disableDropPullFields(){
	$("#freeTimeRate").val('');			
	$("#overRegTimeHourlyRate").val('');
	$("#freeTimeRate").attr("disabled", "disabled");
	$("#overRegTimeHourlyRate").attr("disabled", "disabled");
	$("#liveloadLabel").hide();
}

function enableDropPullFields(override){
	//if (!override) override = true;
	$("#liveloadLabel").show();
	$('#freeTimeRate').removeAttr('disabled');
	$('#overRegTimeHourlyRate').removeAttr('disabled');	
	if (override && $("#truckerFreeTime").val() != "" ){
		if ($("#truckerFreeTime").val().indexOf(".") != -1){		
			$("#freeTimeRate").val($("#truckerFreeTime").val().split(".")[0]);
		} else {
		    $("#freeTimeRate").val($("#truckerFreeTime").val());
		}
	}
	if (override) {
		overTimeValue = parseFloat($("#truckerOverTime").val()).toFixed(2);
		if (overTimeValue != "NaN"){
			$("#overRegTimeHourlyRate").val(overTimeValue);	
		} else {
			$("#overRegTimeHourlyRate").val("");	
		}
	}
}

function getNumberFormat(field) {
	var x = Number($(field).val());
	if (!isNaN(x)) {
		$(field).val(x.toFixed(2));
	}
}
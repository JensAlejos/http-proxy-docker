$(function() {
	
	// Autocompleter and lookup for Destination Port
	$('#containerPod')
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
							return item.cityCode + " " + item.cityName;
						},
						formatResult : function(item) {
							return item.cityCode + "-" + item.cityName;
						},
						select : function(item) {
							$('#containerPod').val(item.cityCode+ "-" + item.cityName);
							
						}
					});

	$('#containerPod').gatesPopUpSearch({
		func : function() {
			/*if($('#tradeCode').val()=='')
				alert("Please enter a valid trade");
			else*/
			if(!$('#containerPod').is('[readonly]') )
				portPopupSearch($('#containerPod').val(), 4);
		}
	});
	
	// Autocompleter and lookup for BL Destination
	//D030611 - Disable PLD edit
	/*$('#containerPld').gatesAutocomplete({
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
			return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode + "-" + item.cityName;
		},
		select : function(item) {
			$('#containerPld').val(item.cityCode);
			
		}
	});*/

	/*$('#containerPld').gatesPopUpSearch({
		func : function() {
			if(!$('#containerPld').is('[readonly]') )
				placePopupSearch($('#containerPld').val(), 5);
			
		}
	});*/

	
	// create add clause dialog at body onload
	$("#containerDialog").dialog({
		autoOpen : false,
		width :1000,
		height:510,
		modal : true,
		buttons:{
			Add:function()
			{
				if($("#containerForm").validationEngine('validate'))
				{
					var queryString = $('#containerForm')
					.formSerialize();
					$.ajax({						
						url : _context+"/containerBilling/addContainer",
						type : "POST",
						data : queryString,
						success : function(
								responseText) {
							$("#containerDialog").dialog('close');
							showResponseMessages("msgDiv", responseText);
						}
					});
				}
				else
					return false;
			},
			Clear:function()
			{
				resetFunction();
			},
			Cancel:function(){
				$("#containerDialog").dialog('close');
			}
		},
		open : function(){
			tabSequence('#containerDialog',false,false);
			resetFunction();
			$("#containerForm").validationEngine('attach');
		},
		close : function() {
			$("#containerForm").validationEngine('hideAll');
			$("#containerForm").validationEngine('detach');
			$("#conatinerGrid").trigger("reloadGrid");
			tabSequence('#',true,false);
		}
	});
	
	var organizationId ="";
	var url = _context+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|';
	$('#consignee').gatesAutocomplete({
		source : url,
		name: 'Customer Name',
		formatItem : function(data) {
			$('#consigneeOrganizationId').val("");
			$('#consigneeAddress').val("");
			return data.name + "-" + data.abbr;
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
		
		formatResult : function(data) {
			return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
		},
		select : function(data) {
			$('#consigneeAddress').val("");
			$('#consignee').val(data.name + "-" + data.abbr);
			organizationId = data.id;
			$('#consigneeOrganizationId').val(organizationId);
			$('#consigneeName').val($('#consignee').val());
			consigneeAroleLookUpSearch();
		}
	});

		// Shipper address Pop-Up Search
		$('#addressLookUpImage').gatesPopUpSearch({
			func : function() {
				consigneeAroleLookUpSearch();
			}
		});
	

	$('#consignee').change(function() {
		if ($('#consignee').val() != $('#consigneeName').val()) {
			$('#consignee').val("");
			$('#consigneeAddress').val("");
		}
		//D030078--Make address as empty if there is a change in consignee field
		else
			{
			$('#consigneeAddress').val("");
			}
	});
	
	$('#prorateCode').change(function() {
		var weightLbl = "";
		var cubeLbl = "";
		if($('#unitOfMeasureSourceCode').val() === "M"){
			weightLbl = "Weight(kgs)";
			cubeLbl = "Cube(m)";
		} else {
			weightLbl = "Weight(lbs)";
			cubeLbl = "Cube(ft)";
		}
		if ($(this).val()=='') {
			$("#weightLbl").html(weightLbl);
			$("#cubeLbl").html(cubeLbl);
			$("#weight").removeClass("validate[required]");
			$("#cube").removeClass("validate[required]");
		}
		var isAutoBill = $('#isAutoBill').val();
		var  isOverFlow = $('#isOverflowContainer').val();
		
		if(isAutoBill && isOverFlow == 'Y'){
			$("#weightLbl").html(weightLbl + "<span class=\"mandatory\">*</span>");
			$("#weight").addClass("validate[required]");
			
			$("#cubeLbl").html(cubeLbl + "<span class=\"mandatory\">*</span>");
			$("#cube").addClass("validate[required]");
			
		}else{
			if ($(this).val()=='W') {
				$("#weightLbl").html(weightLbl + "<span class=\"mandatory\">*</span>");
				$("#weight").addClass("validate[required]");
				
				$("#cubeLbl").html(cubeLbl);
				$("#cube").removeClass("validate[required]");
			}
			else if($(this).val()=='C'){
				$("#weightLbl").html(weightLbl);
				$("#weight").removeClass("validate[required]");
				
				$("#cubeLbl").html(cubeLbl + "<span class=\"mandatory\">*</span>");
				$("#cube").addClass("validate[required]");
			}
			
		}
		
	});
	
	$('#isOverflowContainer').change(function(){
		var isAutoBill = $('#isAutoBill').val();
		var  isOverFlow =$(this).val();
		var prorateCode =$('#prorateCode').val();
		//Fix for - D024642
		var weightLbl = "";
		var cubeLbl = "";
		if($('#unitOfMeasureSourceCode').val() === "M"){
			weightLbl = "Weight(kgs)";
			cubeLbl = "Cube(m)";
		} else {
			weightLbl = "Weight(lbs)";
			cubeLbl = "Cube(ft)";
		}
		
		if(isAutoBill && isOverFlow == 'Y'){
			$("#weightLbl").html(weightLbl + "<span class=\"mandatory\">*</span>");
			$("#weight").addClass("validate[required]");
			
			$("#cubeLbl").html(cubeLbl + "<span class=\"mandatory\">*</span>");
			$("#cube").addClass("validate[required]");
			
		}else{
			if (prorateCode == 'W') {
				$("#weightLbl").html(weightLbl + "<span class=\"mandatory\">*</span>");
				$("#weight").addClass("validate[required]");
				
				$("#cubeLbl").html(cubeLbl);
				$("#cube").removeClass("validate[required]");
			}
			else if(prorateCode == 'C'){
				$("#weightLbl").html(weightLbl);
				$("#weight").removeClass("validate[required]");
				
				$("#cubeLbl").html(cubeLbl + "<span class=\"mandatory\">*</span>");
				$("#cube").addClass("validate[required]");
			}else{
				$("#cubeLbl").html(cubeLbl);
				$("#cube").removeClass("validate[required]");
				$("#weightLbl").html(weightLbl);
				$("#weight").removeClass("validate[required]");
			}
			
		}
		
	});
	
	$('#temperature').change(function() {
		if($.trim($("#planEquipType").val())!='R' && $(this).val()==''){
			$("#temperatureUnitOfMeasureCd").val("");
		}	
	});
	
	
	
	setContainerDefaults();
	
	var args = {
			entityType: 'RCFT',
			entityId: $('#receivedFreightId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'ALL'
		   };
	getCommentTypes(args);
	
//	Security Implementation
	enforceSecurityOnContainer();
});

function resetFunction()
{
	selectForFormSerialize($('#custom'), 'C');

}

function consigneeAroleLookUpSearch(){
	//	Security Implementation
	if(isCtrMaintenanceModifiable == true) {
		var trade = $('#tradeCode').val();
		if(trade) trade = trade.substring(0,1);
		console.log("trade="+trade);
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='+ $('#consigneeOrganizationId').val() + '&filterValue2=03'+'&filterValue3='+trade;
		if($.trim($("#containerStatus").val())=='Received'){
			if($.trim($("#consignee").val())!=''){
				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'Address Role Search', windowStyle);
			}
			else{
				alert("Select Consignee first.");
			}
		}
	}
}
function addroleUpdate(data) {
	var values = data.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('#consigneeAddress').val(finalAddress);
	$('#addressRoleId').val(values[9]);
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	if (nameQualifier != "") {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
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
	var value = cityCode + "-" + cityName;
	
	if (_callingFunc == '4') {
		$('#containerPod').val(value);
	}
	if (_callingFunc == '5') {
		$('#containerPld').val(value);
	}
	
}


function validateSeal(){
	if($.trim($('#sealNumber').val())==''){
		$('#sealNumber').val($.trim($('#sealNumber').val()));
	}
	else if($("#sealNumber").val().length > 15) {
		 return "* Seal# can't be more than 15 in length. At present, the length is "+ $("#sealNumber").val().length +".";
	}
}

function validatePieces(){
	var pcs = $.trim($('#pieceCount').val());
	
	if(pcs!=''){
		$("#pieceUnitOfMeasureCodeLbl").html("Kind<span class=\"mandatory\">*</span>");
		$("#pieceUnitOfMeasureCode").addClass("validate[required]");
	}
	else{
		$("#pieceUnitOfMeasureCodeLbl").html("Kind");
		$("#pieceUnitOfMeasureCode").removeClass("validate[required]");
	}
	
	if(pcs<0){
		return "* Pieces must be greater than zero.";
	}
	else if(pcs>999999){
		return "* Pieces can't be greater than 999999. Decrease the no by "+(parseInt(pcs) - parseInt(999999));
	}
	else if(!/^[0-9\ ]+$/.test(pcs)){
		return "* Pieces must be numerics.";
	}
}

function validateKind(){
	var kind = $('#pieceUnitOfMeasureCode').val();
	if(kind!=''){
		$("#pieceCountLbl").html("Pieces<span class=\"mandatory\">*</span>");
		$("#pieceCount").addClass("validate[required]");
	}
	else{
		$("#pieceCountLbl").html("Pieces");
		$("#pieceCount").removeClass("validate[required]");
	}
	
	if($.trim($('#pieceUnitOfMeasureCode').val())==''){
		$('#pieceUnitOfMeasureCode').val($.trim($('#pieceUnitOfMeasureCode').val()));
	}
	else if($('#pieceUnitOfMeasureCode').val().length>4){
		return "* Kind can't be more than 4 in length. The current length is "+ $('#pieceUnitOfMeasureCode').val().length + ".";
	}
}

function validateWeight(){
	var reg7Number3DecimalPlaces = /^[0-9]{0,7}(\.[0-9]{1,3})?$/;
	//var reg7Number = /^[0-9]{1,7}$/;
	var reg7Number =/^[0-9]{0,7}(\.[0-9]{1,6})?$/;
	var weight = $("#weight").val();
	//$('#weight').val(weight.replace(/^0+/, ''));
	
	weight=$("#weight").val($.trim(weight)).val();
	weight=$('#weight').val(weight.replace(/^0+/, '')).val();
	
	if($.trim($("#weight").val())==''){
		$("#weight").val(($.trim($("#weight").val())));
	}
	else{
		 switch($('#unitOfMeasureSourceCode').val())
	     {
	         case "M": 
	        	 if(!reg7Number3DecimalPlaces.test(weight)) {
	        		 return "* Only 7 numbers before decimal and 3 numbers after decimal are allowed. * No blank spaces are allowed.";
	        	 }
	        	 //Fix for - D024642
	        	 $("#weight").val(parseFloat($.trim($("#weight").val())).toFixed(3));
	        	 /*if(!isNaN(parseFloat(weight)) && $.trim(parseFloat(weight))>parseFloat($("#metricWeightLimit").val())) {
	        		 return "* Weight can't exceed "+$("#metricWeightLimit").val()+".";
	        	 }*/
	         break;
	         case "I": 
	        	 if(!reg7Number.test(weight)) {
	        		 return "* Max 7 numbers are allowed. No blank spaces are allowed.";
	        	 }
	        	 
	        	 /*if(!isNaN(parseFloat(weight)) && $.trim(parseFloat(weight))>parseFloat($("#imperialWeightLimit").val())) {
	        		 return "* Weight can't exceed "+$("#imperialWeightLimit").val()+".";
	        	 }*/
	         break;
	         default: 
	        	 if(!reg7Number3DecimalPlaces.test(weight)) {
	        		 return "* Only 7 numbers before decimal and 3 numbers after decimal are allowed. No blank spaces are allowed.";
	        	}
	     }
	}
}

function validateCube(){
	var reg6Number4DecimalPlaces = /^[0-9]{0,6}(\.[0-9]{1,4})?$/;
	//var reg8Number = /^[0-9]{1,8}$/;
	var reg8Number = /^[0-9]{0,6}(\.[0-9]{1,6})?$/;
	$("#cube").val($.trim($("#cube").val()));
	$('#cube').val($('#cube').val().replace(/^0+/, ''));
	//alert(reg6Number4DecimalPlaces.test($("#cube").val()));
	if($.trim($("#cube").val())==''){
		$("#cube").val($.trim($("#cube").val()));
	}
	else{
		 switch($('#unitOfMeasureSourceCode').val())
	     {
	         case "M": 
	        	 if(!reg6Number4DecimalPlaces.test($("#cube").val())) {
	        		 return "* Only 6 numbers before decimal and 4 numbers after decimal are allowed. No blank spaces allowed.";
	        	}
	        	 else{
	        		 var reg4DecimalPlaces = /^\d+(?:\.\d{4})?$/;
	        		 //alert("reg4DecimalPlaces: " + reg4DecimalPlaces.test($("#cube").val()));
	        		 
	        		 if(reg4DecimalPlaces.test($("#cube").val())) {
	        			 $("#cube").val(Math.round(parseFloat($("#cube").val())*Math.pow(10,3))/Math.pow(10,3));
	        			 //$("#cube").val(parseFloat(result).toFixed(3));
	            	}
	        		 //Fix for - D024642
	        		$("#cube").val(parseFloat($.trim($("#cube").val())).toFixed(3));
	        	 }
	        	 
	         break;
	         case "I": 
	        	 if(!reg8Number.test($("#cube").val())) {
	        		 return "* Max 8 numbers are allowed. * No blank spaces allowed.";
	        	}
	         break;
	         default: 
	        	 if(!reg6Number4DecimalPlaces.test($("#cube").val())) {
	        		 return "* Only 6 numbers before decimal and 4 numbers after decimal are allowed. No blank spaces allowed.";
	        	}
	     }
	}
}

function validateTemperature(){
	var planEquipType = $("#planEquipType").val();
	var temperature = $("#temperature").val();
	temperature=$("#temperature").val($.trim(temperature)).val();
	temperature=$('#temperature').val(temperature.replace(/^0+/, '')).val();
	
	
	if(temperature !='' && $.trim(planEquipType)!='R'){
		return "* Temperature is valid only for refrigerated equipment.";
	}
	
	var invalidTempMsg = "Temperature is invalid.";
	var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
	var isTempFirstLetterPlusDot = /^[+-](\.)$/;
	var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
	if(isTempFirstLetterPlusMinusDot.test(temperature)){
		return invalidTempMsg;
	}
	if(isTempFirstLetterPlusDot.test(temperature)){
		return invalidTempMsg;
	}
	if(!regTemp.test(temperature)){
		return invalidTempMsg;
	}
	
	if($('#temperatureHidden').val() == '' && temperature !='' && $("#temperatureUnitOfMeasureCd").val() == ''){
		if($('#unitOfMeasureSourceCode').val()=='I'){
			$("#temperatureUnitOfMeasureCd").val("F");
		}
		else if($('#unitOfMeasureSourceCode').val()=='M'){
			$("#temperatureUnitOfMeasureCd").val("C");
		}
	}
	
	$('#temperatureHidden').val(temperature);
}

function setContainerDefaults(){
	$('#consigneeAddress').attr("readonly",true);
	
	if($.trim($("#planEquipType").val()) == 'R' && ($('#shipmentStatus').val()=='' || $('#shipmentStatus').val()==null)){
		$("#temperatureLbl").html("Temperature/Scale<span class=\"mandatory\">*</span>");
		$("#temperature").addClass("validate[required]");
		$("#temperatureUnitOfMeasureCd").addClass("validate[required]");
		var temperature = $("#temperature").val();
		if($('#temperatureHidden').val() == '' && temperature != '' && $("#temperatureUnitOfMeasureCd").val() == ''){
			if($('#unitOfMeasureSourceCode').val()=='I'){
				$("#temperatureUnitOfMeasureCd").val("F");
			}
			else if($('#unitOfMeasureSourceCode').val()=='M'){
				$("#temperatureUnitOfMeasureCd").val("C");
			}
		}
	}
	else{
		$("#temperatureLbl").html("Temperature/Scale");
		$("#temperature").removeClass("validate[required]");
		$("#temperatureUnitOfMeasureCd").removeClass("validate[required]");
	}
	
	if($.trim($("#containerStatus").val())=='Pre-Received'){
		$('#containerPod').attr("readonly", true);
		$('#containerPld').attr("readonly", true);
		$('#consignee').attr("readonly", true);
		$('#tosReleasePartyOverride').attr("readonly", true);
		$('#isOverflowContainer').attr('disabled', true);
		
		$('#containerPod').css("background-color","lightgray");
		$('#containerPld').css("background-color","lightgray");
		$('#consignee').css("background-color","lightgray");
		$('#tosReleasePartyOverride').css("background-color","lightgray");
		
		$('#bill').attr("disabled", true);
	}
	else if($.trim($("#containerStatus").val())=='Received'){
		$('#containerPod').attr("readonly", false);
		//D030611 - Disable PLD editing
		$('#containerPld').attr("readonly", true);
		$('#consignee').attr("readonly", false);
		
		$('#containerPod').css("background-color","");
		$('#containerPld').css("background-color","lightgray");
		$('#consignee').css("background-color","");
		$('#tosReleasePartyOverride').css("background-color","");
		
		$('#tosReleasePartyOverride').attr("readonly", false);
		$('#isOverflowContainer').attr('disabled', false);
		if($('#stsDiv').text() == 'APPR' && ($('#shipmentId').val()==null || $('#shipmentId').val()=="" || $('#shipmentId').val()==0)){
			$('#bill').attr("disabled", false);
		}else{
			$('#bill').attr("disabled", true);
		}
	}
	
	//Set/Reset Pieces/Kind
	var pcs = $.trim($('#pieceCount').val());
	if(pcs!=''){
		$("#pieceUnitOfMeasureCodeLbl").html("Kind<span class=\"mandatory\">*</span>");
		$("#pieceUnitOfMeasureCode").addClass("validate[required]");
	}
	else{
		$("#pieceUnitOfMeasureCodeLbl").html("Kind");
		$("#pieceUnitOfMeasureCode").removeClass("validate[required]");
	}
	
	var kind = $('#pieceUnitOfMeasureCode').val();
	if(kind!=''){
		$("#pieceCountLbl").html("Pieces<span class=\"mandatory\">*</span>");
		$("#pieceCount").addClass("validate[required]");
	}
	else{
		$("#pieceCountLbl").html("Pieces");
		$("#pieceCount").removeClass("validate[required]");
	}
	
	//Set scale to deafault if temperature is not present.
	/*if($("#temperature").val()==''){
		$("#temperatureUnitOfMeasureCd").val("");
	}*/
	$("#isDownloaded").attr("disabled", true);
	$('#prorateCode').trigger('change');
	
	showReferenceGrid($("#containerStatus").val());
}

function validateScale(){
	if($.trim($("#planEquipType").val())!='R' && $("#temperature").val()==''){
		return "* Scale is valid only for refrigerated equipment.";
	}	
}

function validateTOSReleasePartyOverride(){
	if($.trim($('#tosReleasePartyOverride').val())==''){
		$('#tosReleasePartyOverride').val($.trim($('#tosReleasePartyOverride').val()));
	}
	else if($("#tosReleasePartyOverride").val().length > 80) {
		 return "* TOS Release Party can't be more than 80 in length. At present, the length is "+ $("#tosReleasePartyOverride").val().length +".";
	}
}

function showReferenceGrid(containerStatus){
	if(containerStatus=='' || containerStatus=='Pre-Received'){
		$("#containerRefGrid").hide();
		//Added Code for Special Service
		$("#containerSpecialServices").hide();
		$('#commentsDiv').hide();
	}
	else if(containerStatus=='Received'){
		$("#containerRefGrid").show();
		//Added Code for Special Service
		$("#containerSpecialServices").show();
		$('#commentsDiv').show();
	}
}

function cancelContainer(){
	$.ajax({
		url: _context+"/containerBilling/validateContainerModified",
		type: "POST",
		data: $('#containerForm').formSerialize(),
		success: function(responseText){
			if(responseText.success){
				var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
				if (isConfirm) {
					$("#containerForm").validationEngine('detach');
					$("#containerDialog").dialog("close");
				}
				else{
					return;
				}
			}
			else{
				$("#containerForm").validationEngine('detach');
				$("#containerDialog").dialog("close");
			}
		}
	});
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'RCFT',
			contextScreen: ''
		},
		success: function(responseText){
			if(responseText.success==true){
				var commentTypes=responseText.data;
				var string="";
				for(var i=0;i<commentTypes.length;i++){
					if(i<commentTypes.length-1){
						string=string+commentTypes[i]+",";
					}else{
						string=string+commentTypes[i];
					}
				}
				args.commentTypesForGrid=string;
				$("#comment_link").comments(args);
				
			}
		}
	});
}
var somethingChanged = false;
var dataName =  null;
var grpId = null;
var itemId = null;
$(function() {
	
	// $("#detentionDaysForm").validationEngine('attach'); 
	 if($('#numberOfFreeDays').val() == "") {
		 $('#numberOfFreeDays').val("0");
	 }
	 $('#xCopyButtondiv').hide(); 
	 $('#copyButtondiv').hide();
	 var _pageMode='';
	 var detentionDayId = $("#detentionDayId").val();
	 if((detentionDayId == null)||(detentionDayId == '')){
		 _pageMode='add';
	 }
	 else{
		 _pageMode='edit';
	 }
	 if(_pageMode=='add'){			
			$('#detentionDaysXCopy').attr("disabled","disabled");
			$('#detentionDaysCopy').attr("disabled","disabled");
			$('#detentionDaysDelete').attr("disabled","disabled");
			$('#detentionDaysNew').attr("disabled","disabled");
			
			document.getElementById("tariffCode").focus();
			$('#detentionDaysxCopyCancel').attr("disabled","disabled");
			$('#detentionDaysxCopySave').attr("disabled","disabled");
			$('#detentionDaysCopyCancel').attr("disabled","disabled");
			$('#detentionDaysCopySave').attr("disabled","disabled");
			
			$('#equipmentFunctionCode').val('*');
			$('#equipmentLength').val('**');
			$('#equipmentHeight').val('*');
			$('#directionSeq').val('*');
		}
	 else
		 {
		 	document.getElementById("tariffCode").focus();
		 	$('#detentionDaysxCopyCancel').attr("disabled","disabled");
			$('#detentionDaysxCopySave').attr("disabled","disabled");
			$('#detentionDaysCopyCancel').attr("disabled","disabled");
			$('#detentionDaysCopySave').attr("disabled","disabled");
		 
			 $('#detentionDaysXCopy').removeAttr("disabled");
			 $('#detentionDaysCopy').removeAttr("disabled");
			 $('#detentionDaysDelete').removeAttr("disabled");
			 $('#detentionDaysNew').removeAttr("disabled");
		 }
	setScreenDetails();
	
	$('#tariffCode').gatesPopUpSearch({
		func : function() {
			tarrifCodePopupSearch();
		}
	});
	
	// Tariff Item
	
	$('#tariffItemNumber').gatesPopUpSearch({
		func:function() {
			ItemPopupSearch();
			}
	});
	
	// code for source tariff predictive search		
	$('#tariffCode').gatesAutocomplete({
		
		 source:  _context+'/cas/autocomplete.do',
		 name: 'Tariff',
		 extraParams: {
		 		 		 		 method: 'searchTariffSource',
		 		 		 		 searchType: '11',
		 		 		 		 groupType:  '01'
		 		 		 },
		 formatItem: function(data) {
			 dataName=data.name;
		 	 grpId=data.id;
		 		 return data.name;
		 },
		 formatResult: function(data) {
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#tariffCode').val(data.id);
		 		 // reset tariff item when tariff code is changed
		 		 $("#tariffItemNumber").val(""); 
		 		 grpId=data.id;
		 		if($('#in_group_type_code').val()=="01"){
		 			 $('#in_group_code').val(data.name);
			    		$("input[type=button][value=Search]").removeAttr("disabled");
			    		if(!_displayonly){
			    			$('#item_add').removeAttr("disabled");
			    		}
		 		 }
		 }		 
	});
	
	$('#tariffCode').change(function(){
	if(grpId==null ||grpId==""){
    	$("#tariffCode").val(""); 
	}
	else{
		$("#tariffCode").val(dataName);
		$('#tariffItemNumber').val("");
			//$('#in_item').removeAttr("disabled");
		grpId="";
	}	
	});
	
	// tariif code blur
	$('#tariffCode').blur(function(){
		/*if ($("#detentionDaysForm").validationEngine('validate')) {	
			
		}*/
	});
	
	// trade blur
	
	$('#tradeCode').blur(function(){
		/*if ($("#detentionDaysForm").validationEngine('validate')) {	
			
		}*/
	});
	
	
	
	
	// Free days validation
	$('#numberOfFreeDays').blur(function(){
		/*if ($("#detentionDaysForm").validationEngine('validate')) {	
			
		}*/
	});
	
	
	var freeDaysOldval=$('#numberOfFreeDays').val();
	$('#numberOfFreeDays').blur(function(){
	var success= true;
	
	if($('#numberOfFreeDays').val().trim() != "") {
		   var value = $('#numberOfFreeDays').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		   var intRegex = /^([0-9]*)$/;
		   if(!intRegex.test(value)) {
		       //alert('Only Numeric value allowed');
		       $('#numberOfFreeDays').val("");
		       success = false;
		   }
		}else{
			$('#numberOfFreeDays').val("0");
		}
	  }); 
	
	$('#expirationDate').blur(function(){
		if($('#expirationDate').val().trim() == ""){
			$('#expirationDate').val("12-31-9999");
		}
	  }); 
	
	// Equipment Length validation
	
	var equipmentLengthOldVal=$('#equipmentLength').val();
	$('#equipmentLength').blur(function(){
		if($('#equipmentLength').val()=="*"){
			$('#equipmentLength').val("**");
		}
	var success= true;
	
	if($('#equipmentLength').val() != "" && $('#equipmentLength').val() != "**" && $('#equipmentLength').val() != "*") {
		   var value = $('#equipmentLength').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		   var intRegex = /^([0-9]*)$/;
		   if(!intRegex.test(value)) {
		       //alert('Only Numeric value allowed');
		       $('#equipmentLength').val("");
		       success = false;
		   }
		}
	  }); 
	
	
	// Equipment Function Code Validation
	var equipmentFunctionCodeOldVal=$('#equipmentFunctionCode').val();
	$('#equipmentFunctionCode').blur(function(){
	var success= true;
	
	if($('#equipmentFunctionCode').val() != "" && $('#equipmentFunctionCode').val() != "*") {
		
		   var value = $('#equipmentFunctionCode').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		   var intRegex = /^([a-z,A-Z]*)$/;
		   if(!intRegex.test(value)) {
		       //alert('Only Numeric value allowed');
		       $('#equipmentFunctionCode').val("");
		       success = false;
		   }
		}
	
	
	  }); 
	
	
	// Equipment Height validation 
	var equipmentHeightOldVal=$('#equipmentHeight').val();
	$('#equipmentHeight').blur(function(){
	var success= true;
	
	if($('#equipmentHeight').val() != "" && $('#equipmentHeight').val() != "*" ) {
		   var value = $('#equipmentHeight').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		   var intRegex = /^([a-z,A-Z]*)$/;
		   if(!intRegex.test(value)) {
		       //alert('Only Numeric value allowed');
		       $('#equipmentHeight').val("");
		       success = false;
		   }
		}
	  });
	
	
	
	//Blurr the data for invalid group Id
	// $('#tariffCode').blur(function(){
		 //	 $("#tariffItemNumber").val(""); 
	  //  }); 
	

		//code for item predictive
		$('#tariffItemNumber').gatesAutocomplete({
			
					 source:  _context+'/cas/autocomplete.do',
					 name: 'Item',
					 minLength: 1,
					 extraParams: {
				 					 method: 'searchItemName',
			 		 		 		 searchType: '43',
			 		 		 		 groupType:  '01',
			 		 		 		 sourceTariff: function () { return $('#tariffCode').val(); }, 		
			 		 		 		 groupName: function () { return $('#tariffCode').val(); } 	 
				 		 		 },
			 //mustMatch: true,
			 formatItem: function(data) {
				 dataName=data.name;
				 itemId=data.id;
				     return data.name;
			 },
			 formatResult: function(data) {
			 		 return data.name;
			 },
			 select: function(data) {
			 		$('#tariffItemNumber').val(data.name);	
			 		itemId=data.id;
			 }		 
		});	
		
		$('#tariffItemNumber').change(function(){
			if(itemId==null ||itemId==""){
		    	$("#tariffItemNumber").val(""); 
			}
			else{
				$("#tariffItemNumber").val(dataName);
				itemId="";
			}	
			});
	
	// Detention Days Save
	$('#detentionDaysSave').click(function() {
		 if (!$("#detentionDaysForm").validationEngine('validate') ) {
			 return;
		 } else {
			    $('#msgDiv').show();
				var detentionDays = $('#detentionDaysForm').formSerialize();
				var urlStr = '';
				urlStr = _context + "/dt/detentionDays/save";
				$.ajax({
					type : "POST",
					url : urlStr,
					data : detentionDays,
					success : function(responseText) {
						
						if (responseText.success == true) {
							if($('#blDestinationCityCodeDescription').val().trim()=="" ){
								$('#blDestinationCityCodeDescription').val("****");
							}
							if($('#destinationPortCityCodeDescription').val().trim()=="" ){
								$('#destinationPortCityCodeDescription').val("****");
							}
							if($('#originPortCityCodeDescription').val().trim()=="" ){
								$('#originPortCityCodeDescription').val("****");
							}
							if($('#blOriginCityCodeDescription').val().trim()=="" ){
								$('#blOriginCityCodeDescription').val("****");
							}
							
							
							$('#detentionDaysXCopy').removeAttr("disabled");
							$('#detentionDaysCopy').removeAttr("disabled");
							$('#detentionDaysDelete').removeAttr("disabled");
							$('#detentionDaysNew').removeAttr("disabled");
							} else {
						}
						showResponseMessages("msgDiv", responseText);
					   $('#detentionDayId').val(responseText.data.detentionDayId);
						//$('#msgDiv').show();
					}
				});
				captureChanges();
		 }
	});
	
	
	
	
	
	$('#detentionDaysxCopySave').click(function() {
		 if (!$("#detentionDaysForm").validationEngine('validate') ) {
			 return;
		 } else {
					var detentionxCopyDays = $('#detentionDaysForm').formSerialize();
					$('#msgDiv').show();
					var urlStr = '';
					urlStr = _context + "/dt/detentionDays/xCopySave";
					$.ajax({
						type : "POST",
						url : urlStr,
						data : detentionxCopyDays,
						success : function(responseText) {
							if (responseText.success == true) {
								if($('#blDestinationCityCodeDescription').val().trim()=="" ){
									$('#blDestinationCityCodeDescription').val("****");
								}
								if($('#destinationPortCityCodeDescription').val().trim()=="" ){
									$('#destinationPortCityCodeDescription').val("****");
								}
								if($('#originPortCityCodeDescription').val().trim()=="" ){
									$('#originPortCityCodeDescription').val("****");
								}
								if($('#blOriginCityCodeDescription').val().trim()=="" ){
									$('#blOriginCityCodeDescription').val("****");
								}
								//$('#detentionDayId').val(responseText.data.detentionDayId);
								} else {
									if($('#blDestinationCityCodeDescription').val().trim()=="" ){
										$('#blDestinationCityCodeDescription').val("****");
									}
									if($('#destinationPortCityCodeDescription').val().trim()=="" ){
										$('#destinationPortCityCodeDescription').val("****");
									}
									if($('#originPortCityCodeDescription').val().trim()=="" ){
										$('#originPortCityCodeDescription').val("****");
									}
									if($('#blOriginCityCodeDescription').val().trim()=="" ){
										$('#blOriginCityCodeDescription').val("****");
									}
							
							}
							showResponseMessages("msgDiv", responseText);
							
						}
					});
		 }
	});
	
	
	$('#detentionDaysCopySave').click(function() {
		 if (!$("#detentionDaysForm").validationEngine('validate') ) {
			 return;
		 } else {
					var detentionxCopyDays = $('#detentionDaysForm').formSerialize();
					$('#msgDiv').html("");
					$('#msgDiv').show();
					var urlStr = '';
					urlStr = _context + "/dt/detentionDays/copySave";
					$.ajax({
						type : "POST",
						url : urlStr,
						data : detentionxCopyDays,
						success : function(responseText) {
							if (responseText.success == true) {
								if($('#blDestinationCityCodeDescription').val().trim()=="" ){
									$('#blDestinationCityCodeDescription').val("****");
								}
								if($('#destinationPortCityCodeDescription').val().trim()=="" ){
									$('#destinationPortCityCodeDescription').val("****");
								}
								if($('#originPortCityCodeDescription').val().trim()=="" ){
									$('#originPortCityCodeDescription').val("****");
								}
								if($('#blOriginCityCodeDescription').val().trim()=="" ){
									$('#blOriginCityCodeDescription').val("****");
								}
								//$('#detentionDayId').val(responseText.data.detentionDayId);
								} else {
							
							}
							showResponseMessages("msgDiv", responseText);
							
						}
					});
		 }
	});
	
	$('#detentionDaysxCopyCancel').click(function() {

		var detentionDays = $('#detentionDaysForm').formSerialize();
		$('#buttondiv').show();
    	$('#xCopyButtondiv').hide(); 
    	$('#tariffCode').attr("readonly",false);
    	$('#msgDiv').hide();
     	$('#tariffCode').attr("readonly",false);
   	    $("#tariffCode").attr("disabled", false);
   	    $("#popupSearchtariffCode").attr("disabled", false); 
   	    var code=   $('#detentionDayId').val();
    	var urlStr = '';
    	
    	urlStr = _context + "/dt/detentionDays/editForm?detentionDayId="+code;
    	document.location.href = urlStr ;
    	//urlStr = _context + "/dt/detentionDays/showForm";
	/*	$.ajax({
			type : "POST",
			url : urlStr,
			data : detentionDays,
			success : function(responseText) {
				if (responseText.success) {
					//showJSON(responseText);
				}
				$('#screenNameDiv').text('Detention Days Maintenance');
			}
		});*/
    	
	
	});
	
	$('#detentionDaysCopyCancel').click(function() {
		var detentionDays = $('#detentionDaysForm').formSerialize();
		$('#buttondiv').show();
    	$('#xCopyButtondiv').hide();
    	$('#copyButtondiv').hide(); 
    	$('#tariffCode').attr("readonly",false);
    	$('#msgDiv').hide();
     	$('#tariffCode').attr("readonly",false);
   	    $("#tariffCode").attr("disabled", false);
   	    $("#popupSearchtariffCode").attr("disabled", false); 
   	    var code=   $('#detentionDayId').val();
    	var urlStr = '';
    	
    	urlStr = _context + "/dt/detentionDays/editForm?detentionDayId="+code;
    	document.location.href = urlStr ;
		//urlStr = _context + "/dt/detentionDays/showForm";
	/*	$.ajax({
			type : "POST",
			url : urlStr,
			data : detentionDays,
			success : function(responseText) {
				if (responseText.success) {
					//showJSON(responseText);
				}
				$('#screenNameDiv').text('Detention Days Maintenance');
			}
		});*/
	
	});
	
	$('#containerExit').click(function() {
		var urlStr = '';
		urlStr = _context + "/cas/detentionDaysSearch.do";
		document.location.href = urlStr ;
	});
	
	$('#detentionDaysNew').click(function() {
		var detentionDays = $('#detentionDaysForm').formSerialize();
		//alert("1");
		$("#detentionDayId").val('');
		document.getElementById("tariffCode").focus();
		$('#detentionDaysxCopyCancel').attr("disabled","disabled");
		$('#detentionDaysxCopySave').attr("disabled","disabled");
		$('#detentionDaysCopyCancel').attr("disabled","disabled");
		$('#detentionDaysCopySave').attr("disabled","disabled");
		
		clearDetentionForm();
		var detentionDays = "";
		$('#msgDiv').hide();
    	var urlStr = '';
		urlStr = _context + "/dt/detentionDays/newForm";
		
		$.ajax({
			type : "POST",
			url : urlStr,
			data : detentionDays,
			success : function(responseText) {
				if (responseText.success) {
					showJSONText(responseText);
				} else {
					
				}
				 $('#screenNameDiv').text('New Detention Days Maintenance');
			}
		});
	});
	
	// DetentionDays Delete
	$('#detentionDaysDelete').click(function() {
		if($("#detentionDayId").val()!="" && $("#detentionDayId").val()!=null)
		{
			deleteDetentionDays();
		}
	});

	//Click on DetentionDays XCopy button
	$('#detentionDaysXCopy').click(function() {
		var detentionDays = $('#detentionDaysForm').formSerialize();
		//$("#detentionDayId").val('');
		$('#buttondiv').hide();
    	$('#xCopyButtondiv').show(); 
    	$('#tariffCode').attr("readonly",true);
    	document.getElementById("tariffItemNumber").focus();
    	
    	$('#detentionDaysxCopyCancel').removeAttr("disabled");
		$('#detentionDaysxCopySave').removeAttr("disabled");
    	
		$('#detentionDaysCopyCancel').attr("disabled","disabled");
		$('#detentionDaysCopySave').attr("disabled","disabled");
		
		var tariffCode =$("#tariffCode").val();
    	$('#tariffCode').attr("disabled","disabled");
    	$('#popupSearchtariffCode').attr("disabled","disabled");
    	$("#popupSearchtariffCode").hide();
    	$('#msgDiv').hide();
    	
		var urlStr = '';
		urlStr = _context + "/dt/detentionDays/showXcopy";
		$.ajax({
			type : "POST",
			url : urlStr,
			data : {detentionDays :detentionDays,
				    tariffCode :tariffCode},
			
			success : function(responseText) {
				if (responseText.success) {
					if($('#blDestinationCityCodeDescription').val().trim()=="" ){
						$('#blDestinationCityCodeDescription').val("****");
					}
					if($('#destinationPortCityCodeDescription').val().trim()=="" ){
						$('#destinationPortCityCodeDescription').val("****");
					}
					if($('#originPortCityCodeDescription').val().trim()=="" ){
						$('#originPortCityCodeDescription').val("****");
					}
					if($('#blOriginCityCodeDescription').val().trim()=="" ){
						$('#blOriginCityCodeDescription').val("****");
					}
					showJSON(responseText);
				}
			}
		});
	});
	

	// DetentionDays copy
	$('#detentionDaysCopy').click(function() {

		var detentionDays = $('#detentionDaysForm').formSerialize();
		//$("#detentionDayId").val('');
		$('#buttondiv').hide();
    	$('#xCopyButtondiv').hide(); 
    	$('#copyButtondiv').show();
    	
    	
    	document.getElementById("tariffCode").focus();
    	$('#detentionDaysCopyCancel').removeAttr("disabled");
		$('#detentionDaysCopySave').removeAttr("disabled");
    	
		$('#detentionDaysxCopyCancel').attr("disabled","disabled");
		$('#detentionDaysxCopySave').attr("disabled","disabled");
    	
		
		
    	
    	$('#msgDiv').hide();
		var urlStr = '';
		urlStr = _context + "/dt/detentionDays/copy";
		$.ajax({
			type : "POST",
			url : urlStr,
			data : detentionDays,
			success : function(responseText) {
				if (responseText.success) {
					if($('#blDestinationCityCodeDescription').val().trim()=="" ){
						$('#blDestinationCityCodeDescription').val("****");
					}
					if($('#destinationPortCityCodeDescription').val().trim()=="" ){
						$('#destinationPortCityCodeDescription').val("****");
					}
					if($('#originPortCityCodeDescription').val().trim()=="" ){
						$('#originPortCityCodeDescription').val("****");
					}
					if($('#blOriginCityCodeDescription').val().trim()=="" ){
						$('#blOriginCityCodeDescription').val("****");
					}
					showCopyJSON(responseText);
				}
			}
		});
	});
	 function showJSONText(responseText)  {
    	// $('#screenNameDiv').text('X Copy Detention Days');
    	 //$('#tariffCodehidden').val(responseText.data.tariffCode);
			$('#blOriginCityCodeDescription').val(responseText.data.blOriginCityCodeDescription);
			$('#originPortCityCodeDescription').val(responseText.data.originPortCityCodeDescription);
			$('#destinationPortCityCodeDescription').val(responseText.data.destinationPortCityCodeDescription);
			$('#blDestinationCityCodeDescription').val(responseText.data.blDestinationCityCodeDescription);
			$('#effectiveDate').val(responseText.data.effectiveDate);
			$('#expirationDate').val(responseText.data.expirationDate);
			
			
		 
     }
	
     function showJSON(responseText)  {
    	 $('#screenNameDiv').text('X Copy Detention Days');
    	 $('#tariffCodehidden').val(responseText.data.tariffCode);
     }
     function showCopyJSON(responseText)  {
    	 $('#screenNameDiv').text('Copy Detention Days');
     }
     function showNewDetentionJSON(responseText)  {
    	
     }

	// Autocompleter and lookup for BL Origin
	$('#blOriginCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			return item.cityCode + "-" + item.cityName+","+item.stateCode;
		},
		formatResult : function(item) {
			return item.cityCode + "-" + item.cityName+","+item.stateCode;
		},
		select: function(item) {
			$('#blOriginCityCodeDescription').val(item.cityCode+"-"+item.cityName+","+item.stateCode);
			$('#blOriginCityCode').val(item.cityCode);
			$('#blOriginCityDescription').val(item.cityName);
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
			if($('#blOriginCityCodeDescription').val()=="****"){
				placePopupSearch("All", 1);
			}else{
				placePopupSearch($('#blOriginCityCodeDescription').val(), 1);
			}
				
		}
	});

	$('#blOriginCityCodeDescription').blur(function() {
		if($('#blOriginCityCodeDescription').val()=="*" || $('#blOriginCityCodeDescription').val()=="**" || $('#blOriginCityCodeDescription').val()=="***"){
			$('#blOriginCityCodeDescription').val("****");
		}
		
		
		if ( $('#blOriginCityCode').val() == "" && $('#blOriginCityCodeDescription').val()!= '****')
		{
			$('#blOriginCityDescription').val('');
			$('#blOriginCityCodeDescription').val('');
		}
		else if( $('#blOriginCityCode').val() == "" && $('#blOriginCityCodeDescription').val() == '****'){
			$('#blOriginCityDescription').val('****');
			$('#blOriginCityCode').val("****");
			$('#blOriginCityCodeDescription').val('****');
			
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
	});
	
	
	// Autocompleter and lookup for Origin Port
	$('#originPortCityCodeDescription').gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
						formatItem : function(item) {
							return item.cityCode + "-" + item.cityName+","+item.stateCode;
						},
						formatResult : function(item) {
							return item.cityCode + "-" + item.cityName+","+item.stateCode;
						},
						select: function(item) {
							$('#originPortCityCodeDescription').val(item.cityCode+"-"+item.cityName+","+item.stateCode);
							$('#originPortCityCode').val(item.cityCode);
							$('#originPortCityDescription').val(item.cityName);
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
			if($('#originPortCityCodeDescription').val()=="****"){
				portPopupSearch("ALL", 2);
			}else{
				portPopupSearch($('#originPortCityCodeDescription').val(), 2);	
			}
			
		}
	});

	$('#originPortCityCodeDescription').blur(function() {
		if($('#originPortCityCodeDescription').val()=="*" || $('#originPortCityCodeDescription').val()=="**" || $('#originPortCityCodeDescription').val()=="***"){
			$('#originPortCityCodeDescription').val("****");
		}
		
		if ($('#originPortCityCode').val() == "" && $('#originPortCityCodeDescription').val()!= '****')
		{
			$('#originPortCityCodeDescription').val('');
			$('#originPortCityDescription').val('');
			
		}
		else if( $('#originPortCityCode').val() == "" && $('#originPortCityCodeDescription').val() == '****'){
			$('#originPortCityCode').val('****');
			$('#originPortCityCodeDescription').val('****');
			
		}
		else if($('#originPortCityCodeDescription').val() == '')
		{
			$('#originPortCityCode').val('');
			$('#originPortCityDescription').val('');
			
		}
		/*else if($('#originPortCityCode').val()+"-"+$('#originPortCityDescription').val()!=$('#originPortCityCodeDescription').val())
		{
			$('#originPortCityCode').val('');
			$('#originPortCityDescription').val('');
			$('#originPortCityCodeDescription').val('');
			
		}*/
	});
	
	// Autocompleter and lookup for Destination Port
	$('#destinationPortCityCodeDescription').gatesAutocomplete(
					{
						source : _context
								+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
						formatItem : function(item) {
							return item.cityCode + "-" + item.cityName+","+item.stateCode;
						},
						formatResult : function(item) {
							return item.cityCode + "-" + item.cityName+","+item.stateCode;
						},
						select: function(item) {
							$('#destinationPortCityCodeDescription').val(item.cityCode+"-"+item.cityName+","+item.stateCode);
							$('#destinationPortCityCode').val(item.cityCode);
							$('#destinationPortCityDescription').val(item.cityName);
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
		if($('#destinationPortCityCodeDescription').val()=="****"){
			portPopupSearch("All", 3);
		}else{
			portPopupSearch($('#destinationPortCityCodeDescription').val(), 3);
		}
			
		}
	});

	$('#destinationPortCityCodeDescription').blur(function() {
		if($('#destinationPortCityCodeDescription').val()=="*" || $('#destinationPortCityCodeDescription').val()=="**" || $('#destinationPortCityCodeDescription').val()=="***"){
			$('#destinationPortCityCodeDescription').val("****");
		}
		if ($('#destinationPortCityCode').val() == "" && $('#destinationPortCityCodeDescription').val()!= '****')
		{
			$('#destinationPortCityCodeDescription').val('');
			$('#destinationPortCityDescription').val('');
		}
		else if( $('#destinationPortCityCode').val() == "" && $('#destinationPortCityCodeDescription').val() == '****'){
			$('#destinationPortCityCode').val('****');
			$('#destinationPortCityCodeDescription').val('****');
			
		}
		else if($('#destinationPortCityCodeDescription').val() == '')
		{
			$('#destinationPortCityCode').val('');
			$('#destinationPortCityDescription').val('');
		}
//		else if($('#destinationPortCityCode').val()+"-"+$('#destinationPortCityDescription').val()!=$('#destinationPortCityCodeDescription').val())
//		{
//			$('#destinationPortCityCode').val('');
//			$('#destinationPortCityDescription').val('');
//			$('#destinationPortCityCodeDescription').val('');
//		}
	});
	
	// Autocompleter and lookup for BL Destination
	$('#blDestinationCityCodeDescription').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			return item.cityCode + "-" + item.cityName+","+item.stateCode;
		},
		formatResult : function(item) {
			return item.cityCode + "-" + item.cityName+","+item.stateCode;
		},
		select: function(item) {
			$('#blDestinationCityCodeDescription').val(item.cityCode+"-"+item.cityName+","+item.stateCode);
			$('#blDestinationCityCode').val(item.cityCode);
			$('#blDestinationCityDescription').val(item.cityName);
			
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
		}
	});

	$('#blDestinationCityCodeDescription').gatesPopUpSearch({
		func : function() {
			if($('#blDestinationCityCodeDescription').val()=="****"){
				placePopupSearch("All", 4);
			}else{
				placePopupSearch($('#blDestinationCityCodeDescription').val(), 4);
			}
		}
	});

	$('#blDestinationCityCodeDescription').blur(function() {
		if($('#blDestinationCityCodeDescription').val()=="*" || $('#blDestinationCityCodeDescription').val()=="**" || $('#blDestinationCityCodeDescription').val()=="***"){
			$('#blDestinationCityCodeDescription').val("****");
		}
		if ($('#blDestinationCityCode').val() == ""  && $('#blDestinationCityCodeDescription').val()!= '****')
		{
			$('#blDestinationCityCodeDescription').val('');
		}
		else if( $('#blDestinationCityCode').val() == "" && $('#blDestinationCityCodeDescription').val() == '****'){
			$('#blDestinationCityCode').val('****');
			$('#blDestinationCityCodeDescription').val('****');
			
		}
		else if($('#blDestinationCityCodeDescription').val() == '')
		{
			$('#blDestinationCityCode').val('');
			$('#blDestinationCityDescription').val('');
		}
//		else if($('#blDestinationCityCode').val()+"-"+$('#blDestinationCityDescription').val()!=$('#blDestinationCityCodeDescription').val())
//		{
//			$('#blDestinationCityCode').val('');
//			$('#blDestinationCityDescription').val('');
//			$('#blDestinationCityCodeDescription').val('');
//		}
		checkPlaceOfDeliveryDefaultValue();
		setRoutingHeader();
	});
	
	//Shipment Security
		var saveEnable=false;
	 enforceSecurityTitle(isMaintainDetentionDaysDisplayOnly);
	 enforceSecurityDivAndButtons('content', isMaintainDetentionDaysDisplayOnly);
	 enforceSecurityDivAndButtons('buttondiv', isMaintainDetentionDaysDisplayOnly);
	 enforceSecurityDivAndButtons('detentionDaysNew', isMaintainDetentionDaysAdd);
	 enforceSecurityDivAndButtons('detentionDaysDelete', isMaintainDetentionDaysDelete);
	 enforceSecurityDivAndButtons('detentionDaysCopy', isMaintainDetentionDaysUpdate);
	 enforceSecurityDivAndButtons('detentionDaysXCopy', (isMaintainDetentionDaysAdd==true && isMaintainDetentionDaysUpdate==true));
	 if(isMaintainDetentionDaysAdd || isMaintainDetentionDaysUpdate){
		 saveEnable=true; 
	 }
	 enforceSecurityDivAndButtons('detentionDaysSave', saveEnable);
	 
	 tabSequence('#detentionDaysForm',false,false);
	 
	 $("#equipmentFunctionCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		  
		     if($('#equipmentFunctionCode').val().length == 1){
		    	 $('#equipmentFunctionCode').val($('#equipmentFunctionCode').val().toUpperCase());
			    	$('#equipmentLength').focus().select();
		     
			  }
		});
		$("#equipmentLength").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		  
		     if($('#equipmentLength').val().length == 2){
			    	$('#equipmentHeight').focus().select();
		     
			  }
		});
		$("#equipmentHeight").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		  
		     if($('#equipmentHeight').val().length == 1){
		    	 $('#equipmentHeight').val($('#equipmentHeight').val().toUpperCase());
			    	$('#directionSeq').focus();
			    
		     
			  }
		});
		captureChanges();
});

function placePopupSearch(place, id) {
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param;
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function portPopupSearch(place, id) {
	var values = place.split("-");
	var param = values[0];
	_callingFunc = id;
	var actionUrl = _context + "/city/manualLookup/showFormForQT?term=" + param+ "|" + "Y";
				
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function tarrifCodePopupSearch() {
	
	var actionUrl =  _context+"/cas/sourcetarifflookup.do?grpTyp=01&sourceTariff="+$('#tariffCode').val();
			
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);
}

function ItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+'01'+"&sourceTariff="+$('#tariffCode').val()+"&grpName="+$('#tariffCode').val()+"&itemName="+$('#tariffItemNumber').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);   
	
	
	
	
}
function sourceTariffSearchUpdate(id){
	$('#tariffCode').val(id);
}

function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	$('#tariffItemNumber').val(values[0]); 
}
function cityUpdate(id) {
	var end = id.indexOf(",");
	var cityCode = id.substr(0, end);
	var len = cityCode.length;
	var totalLength=id.length;
	
	var remainingVal= id.substr(len+1,totalLength);
	end = remainingVal.indexOf(",");
	
	
	var cityName=remainingVal.substr(0, end);
	
	var value = cityCode + "-" + cityName;
	
	
	if (_callingFunc == '1') {
		$('#blOriginCityCodeDescription').val(value);
		$('#blOriginCityDescription').val(cityName);
		$('#blOriginCityCode').val(cityCode);
	}
	if (_callingFunc == '2') {
		$('#originPortCityCodeDescription').val(value);
		$('#originPortCityDescription').val(cityName);
		$('#originPortCityCode').val(cityCode);
		
	}
	if (_callingFunc == '3') {
		$('#destinationPortCityCodeDescription').val(value);
		$('#destinationPortCityDescription').val(cityName);
		$('#destinationPortCityCode').val(cityCode);
	
	}
	if (_callingFunc == '4') {
		$('#blDestinationCityCodeDescription').val(value);
		$('#blDestinationCityDescription').val(cityName);
		$('#blDestinationCityCode').val(cityCode);
	
	}
}

function setScreenDetails() {
	$("#effectiveDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#expirationDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
}


function deleteDetentionDays() {
	
	var r = confirm("Are you sure you want to delete the selected Detention Day(s)?");
	if (r == true) { 	 		 	
		
		//$('#detentionDaysXCopy').attr("disabled","disabled");
		//$('#detentionDaysCopy').attr("disabled","disabled");
		//$('#detentionDaysDelete').attr("disabled","disabled");
		//$('#detentionDaysNew').attr("disabled","disabled");
		//$('#detentionDaysSave').attr("disabled","disabled");

	$.ajax({
		type : "POST",
		url : _context + "/dt/detentionDays/singleDelete",
		data : {
			detentionDayId : $("#detentionDayId").val(),
		},
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
			}
			clearDetentionForm();
				$('#blDestinationCityCodeDescription').val("****");
				$('#destinationPortCityCodeDescription').val("****");
				$('#originPortCityCodeDescription').val("****");
				$('#blOriginCityCodeDescription').val("****");
				$('#detentionDayId').val("");
				$('#tariffCodehidden').val("");
				
				
			// Messages
			showResponseMessages("msgDiv", responseText);
			 $('#msgDiv').show();
			$('#msgDivBill').show();
			$('#detentionDaysDelete').attr("disabled",true);
		}
	});
	}else{
		return;
	}
	
}


function copyDetentionDays() {
	$.ajax({
		type : "POST",
		url : _context + "/dt/detentionDays/copy",
		data : {
			detentionDayId : $("#detentionDayId").val(),
		},
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
			}
			// Messages
			showResponseMessages("msgDiv", responseText);
			$('#msgDivBill').show();
		}
	});
}

//post-submit callback 
function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		
		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}
		$('#'+msgDivId).html(messageContent);
		if(messageContent!='')
		{
			window.scrollTo(0, 0);
		}
  	}
}
	function clearDetentionForm(){
		$('#tariffCode').val('');
		$('#tradeCode').val('');
		$('#tariffItemNumber').val('');
		$('#equipmentFunctionCode').val('*');
		$('#equipmentLength').val('**');
		$('#equipmentHeight').val('*');
		$('#blDestinationCityCode').val('');
		$('#numberOfFreeDays').val('0');
		$('#calendarWorkCode').val('');
		//$('#effectiveDate').val('');
		//$('#expirationDate').val('');
		$('#blOriginCityCode').val('');
		$('#directionSeq').val('*');
		$('#tariffItemNumber').val('');
		document.getElementById("loadServiceCode").selectedIndex=0;
		document.getElementById("dischargeServiceCode").selectedIndex=0;
		/*$('#loadServiceCode').val('');
		$('#dischargeServiceCode').val('');*/
		$('#originPortCityCode').val('');
		$('#destinationPortCityCode').val('');
		
		//$('#blOriginCityCodeDescription').val('');
		//$('#originPortCityCodeDescription').val('');
		//$('#destinationPortCityCodeDescription').val('');
		//$('#blDestinationCityCodeDescription').val('');
		
		
		
		
		
		
		}
	//	21575- auto tab
	/*function autotab(event, object)
	{
		var keyCode = event.keyCode;
		
		if(keyCode==32 || (48<=keyCode && keyCode<=57)
				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
				|| (109<=keyCode && keyCode<=111))
		{
			if(object.value.length >= object.getAttribute("maxlength"))
			{
				$(object).next().focus().select();
			}
		}
		return true;
	}*/
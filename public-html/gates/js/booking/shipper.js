var shipperAddress = "";
var templateCaller ="";
var isTemplateFirstLoad = false;

$(function() {
	
	setDefaultPrefMethod('shipper');
	
	shipperOrgPredictive();
	shipperAddressPredictive();
	
	// Shipper Pop-Up Search
	$('input[name="shipper\\.organizationName"]').gatesPopUpSearch({
		func : function() {
			shipperPopupSearch();
		}
	});

	// Shipper address Pop-Up Search
	$('input[name="shipper\\.address"]').gatesPopUpSearch({
		func : function() {
			shipperAddressPopupSearch();
		}
	});
	
	// Clear shipper details on change of Shipper
	$('input[name="shipper\\.organizationName"]').change(function() {
		if ($('input[name="shipper\\.organizationName"]').val()=='' 
			|| $('input[name="shipper\\.organizationName"]').val() != $('#shipperName').val()) {
			$('input[name="shipper\\.organizationId"]').val("");
			$('input[name="shipper\\.organizationName"]').val("");
			$('input[name="shipper\\.organizationCode"]').val("");
			$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
		}
		
		processShipperConsigneeColor("shipper");
		$('input[name="shipper\\.address"]').val("");
		$('input[name="shipper\\.address"]').trigger('change');
	});

	$('input[name="shipper\\.address"]').change(function() {
		if(shipperAddress!=$('input[name="shipper\\.address"]').val())
		{
			$('input[name="shipper\\.address"]').val('');
			$('input[name="shipper\\.nameQualifier"]').val('');
			$('input[name="shipper\\.careOf"]').val('');
			$('input[name="shipper\\.countryName"]').val('');
			$('input[name="shipper\\.provinceName"]').val('');
			shipperAddress = '';
			$('input[name="shipper\\.addressRoleId"]').val("");
			$('#refNumOverRideForShipper').val("");
		}
		
		emptyCityStateZip("shipper");
		emptyContactDetails("shipper");
		handlePrepaidCollectIndicator('S');
		//removeShipperAsDebtor();
		checkAccordionHeaderForShipper();
		checkCopyButtons();
	});

	// get contact details for selected contact id
	$('select[name="shipper\\.contactId"]').change(function() {
		removeBookingErrorPointers();
		if($('select[name="shipper\\.contactId"] option').length!=0 
			&& $('select[name="shipper\\.contactId"] :selected').val()!=''){
			requestForContactDetails("shipper", "N");
		}else{
			emptyContactDetailsOnContactChange('shipper');
		}
	});

	// get contact details for selected contact id
	$('input[name="shipper\\.contact"]').change(function() {
		handleManualContact('shipper');
	});

	//Copy Shipper to Consignee
	$('#copyShipper').click(function() {
		if ($('input[name="shipper\\.organizationName"]').val() != '' && $('input[name="consignee\\.organizationName"]').val() == '') {
			$('input[name="consignee\\.organizationName"]').validationEngine('hidePrompt');
			$('input[name="consignee\\.organizationName"]').val($('input[name="shipper\\.organizationName"]').val());
			$('input[name="consignee\\.organizationCode"]').val($('input[name="shipper\\.organizationCode"]').val());
			$('#consigneeName').val($('input[name="shipper\\.organizationName"]').val());
			$('input[name="consignee\\.address"]').val($('input[name="shipper\\.address"]').val());
			consigneeAddress = $('input[name="shipper\\.address"]').val();
			$('input[name="consignee\\.nameQualifier"]').val($('input[name="shipper\\.nameQualifier"]').val());
			$('input[name="consignee\\.careOf"]').val($('input[name="shipper\\.careOf"]').val());
			$('input[name="consignee\\.countryName"]').val($('input[name="shipper\\.countryName"]').val());
			$('input[name="consignee\\.provinceName"]').val($('input[name="shipper\\.provinceName"]').val());
			$('input[name="consignee\\.city"]').val($('input[name="shipper\\.city"]').val());
			$('input[name="consignee\\.state"]').val($('input[name="shipper\\.state"]').val());
			$('input[name="consignee\\.zip"]').val($('input[name="shipper\\.zip"]').val());
			
			$('select[name="consignee\\.contactId"]').html($('select[name="shipper\\.contactId"]').html());
			
			$('select[name="consignee\\.contactId"]').val($('select[name="shipper\\.contactId"] :selected').val());//html($('select[name="shipper\\.contactId"]').html());
			$('input[name="consignee\\.addressRoleContactCode"]').val($('input[name="shipper\\.addressRoleContactCode"]').val());
			$('input[name="consignee\\.contact"]').val($('input[name="shipper\\.contact"]').val());

			$('input[name="consignee\\.contactPhoneCountryCode"]').val($('input[name="shipper\\.contactPhoneCountryCode"]').val());
			$('input[name="consignee\\.contactPhoneAreaCode"]').val($('input[name="shipper\\.contactPhoneAreaCode"]').val());
			$('input[name="consignee\\.contactPhoneExchange"]').val($('input[name="shipper\\.contactPhoneExchange"]').val());
			$('input[name="consignee\\.contactPhoneStation"]').val($('input[name="shipper\\.contactPhoneStation"]').val());
			$('input[name="consignee\\.contactPhoneExtension"]').val($('input[name="shipper\\.contactPhoneExtension"]').val());

			$('input[name="consignee\\.contactCellCountryCode"]').val($('input[name="shipper\\.contactCellCountryCode"]').val());
			$('input[name="consignee\\.contactCellAreaCode"]').val($('input[name="shipper\\.contactCellAreaCode"]').val());
			$('input[name="consignee\\.contactCellExchange"]').val($('input[name="shipper\\.contactCellExchange"]').val());
			$('input[name="consignee\\.contactCellStation"]').val($('input[name="shipper\\.contactCellStation"]').val());
			$('input[name="consignee\\.contactCellExtension"]').val($('input[name="shipper\\.contactCellExtension"]').val());

			$('input[name="consignee\\.contactFaxCountryCode"]').val($('input[name="shipper\\.contactFaxCountryCode"]').val());
			$('input[name="consignee\\.contactFaxAreaCode"]').val($('input[name="shipper\\.contactFaxAreaCode"]').val());
			$('input[name="consignee\\.contactFaxExchange"]').val($('input[name="shipper\\.contactFaxExchange"]').val());
			$('input[name="consignee\\.contactFaxStation"]').val($('input[name="shipper\\.contactFaxStation"]').val());
			$('input[name="consignee\\.contactFaxExtension"]').val($('input[name="shipper\\.contactFaxExtension"]').val());

			$('input[name="consignee\\.contactEmailAddress"]').val($('input[name="shipper\\.contactEmailAddress"]').val());
			$("#copyShipper").attr("disabled", true);
			$("#copyConsignee").attr("disabled", true);
			//copy the internal ID's
			$('input[name="consignee\\.addressRoleId"]').val($('input[name="shipper\\.addressRoleId"]').val());
			$('input[name="consignee\\.organizationId"]').val($('input[name="shipper\\.organizationId"]').val());
			$('input[name="consignee\\.isOneTimeCustomer"]').val($('input[name="shipper\\.isOneTimeCustomer"]').val());
			$('input[name="consignee\\.organizationCode').val($('input[name="shipper\\.organizationCode').val());
			
			processShipperConsigneeColor("consignee");
			
			isBookingChanged = "Y";
			
			var preMethod = getPrefCommMethod('shipper');
			$('#consigneeComm1').attr('checked',false);
			$('#consigneeComm2').attr('checked',false);
			$('#consigneeComm3').attr('checked',false);
			$('#consigneeComm4').attr('checked',false);
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
			}else{
				$('#consigneeComm1').attr('checked',true);
				$('#consigneeComm1').val(preMethod);
			}
			
			//enableDisableContactId('consignee',false);
			checkAccordionHeaderForConsignee();
			$('#refNumOverRideForconsignee').val("N");
			
			/*if($('input[name="consignee\\.addressRoleId"]').val()!='')
				addConsigneeAsDebtor();*/
			//consigneeOrgPredictive();
			//consigneeAddPredictive();
			handlePrepaidCollectIndicator('C');
			loadHazGrid();
		}
	});

	$('#shipperRepeatContact').click(function(){
		if($("#bookingStatusCode :selected").val()=='CANC'){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		if($('input[name="shipper\\.addressRoleId"]').val()!='')
		{
			if($('select[name="shipper\\.contactId"] :selected').val()=='' && 
				$('input[name="shipper\\.contact"]').val()!='')
			{
				repeatCaller ="shipper";
				
				$('#originalOrgName').val($('input[name="shipper\\.organizationName"]').val());
				
				$('#originalOrgAddress').val(formatAddRoleDscrForSC('', $('input[name="shipper\\.address"]').val(), 
						$('input[name="shipper\\.city"]').val(), $('input[name="shipper\\.state"]').val(), $('input[name="shipper\\.zip"]').val()));
				$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
				$("#repeatContactOriginalAroleId").val($('input[name="shipper\\.addressRoleId"]').val());
				$("#repeatContactNameLabel").html($('input[name="shipper\\.contact"]').val());
				
				//Added by Hrushikesh
				
				var p1 =  $('input[name="shipper\\.contactPhoneCountryCode"]').val();
				var p2 =  $('input[name="shipper\\.contactPhoneAreaCode"]').val();
				var p3 =  $('input[name="shipper\\.contactPhoneExchange"]').val();
				var p4 =  $('input[name="shipper\\.contactPhoneStation"]').val();
				var p5 =  $('input[name="shipper\\.contactPhoneExtension"]').val();
				var Phonearray = [p1,p2,p3,p4,p5];
				
				var Phone = Phonearray.join("-");				
				
				var c1 =  $('input[name="shipper\\.contactCellCountryCode"]').val();
				var c2 =  $('input[name="shipper\\.contactCellAreaCode"]').val();
				var c3 =  $('input[name="shipper\\.contactCellExchange"]').val();
				var c4 =  $('input[name="shipper\\.contactCellStation"]').val();
				var c5 =  $('input[name="shipper\\.contactCellExtension"]').val();
				
				var cellarray = [c1,c2,c3,c4,c5];
				
				var cell = cellarray.join("-");
				
				
				var f1 =  $('input[name="shipper\\.contactFaxCountryCode"]').val();
				var f2 =  $('input[name="shipper\\.contactFaxAreaCode"]').val();
				var f3 =  $('input[name="shipper\\.contactFaxExchange"]').val();
				var f4 =  $('input[name="shipper\\.contactFaxStation"]').val();
				var f5 =  $('input[name="shipper\\.contactFaxExtension"]').val();
				
				var faxarray = [f1,f2,f3,f4,f5];
				
				var fax = faxarray.join("-");
				
				$("#repeatContactPhone").val(Phone);			
				$("#repeatContactCell").val(cell);
				$("#repeatContactFax").val(fax);			
				$("#repeatContactEmailAddress").val($('input[name="shipper\\.contactEmailAddress"]').val());
				$("#repeatContactId").html($('select[name="shipper\\.contactId"]').html());
				$("#repeatContactId").val('');
				
				$("#repeatContactOverlay").dialog('open');
			}
			else
			{
				$('#shipperRepeatContact').attr("checked", false);
				alert("Please enter a non-CP contact first");
			}
		}
		else
		{
			$('#shipperRepeatContact').attr("checked", false);
			alert("Please select a shipper address role first");
		}
	});
	//code to tab out in Phone fields
	var chkPhoneCountry =true;
	var chkPhoneArea = true;
	var chkPhoneExchange = true;
	 
	$('input[name="shipper\\.contactPhoneCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneCountry){
	    	 this.select();
	    	 chkPhoneCountry = false;
	     }
		});
	$('input[name="shipper\\.contactPhoneCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactPhoneCountryCode"]').val()=='1' || 
	    		 $('input[name="shipper\\.contactPhoneCountryCode"]').val()=='01' ||  
	    		 $('input[name="shipper\\.contactPhoneCountryCode"]').val().length == 3){
	    	 $('input[name="shipper\\.contactPhoneAreaCode"]').focus();
			 chkPhoneCountry =true;
	     }
	}); 
	
	$('input[name="shipper\\.contactPhoneAreaCode"]').focus(function(evt) {
		chkPhoneArea = true;
	});
	$('input[name="shipper\\.contactPhoneAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('input[name="shipper\\.contactPhoneAreaCode"]').val('');
	     }
	     if(( $('input[name="shipper\\.contactPhoneAreaCode"]').val().length == 3 && isAmericanParty('shipper\\.contactPhoneCountryCode')) || 
	    		 $('input[name="shipper\\.contactPhoneAreaCode"]').val().length == 4){
	    		$('input[name="shipper\\.contactPhoneExchange"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactPhoneAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	      if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('input[name="shipper\\.contactPhoneAreaCode"]').val('');
	     }
	}); 
	$('input[name="shipper\\.contactPhoneExchange"]').focus(function(evt) {
		chkPhoneExchange = true;
	});
	
	$('input[name="shipper\\.contactPhoneExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
			if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	$('input[name="shipper\\.contactPhoneExchange"]').val('');
	     }
	     if(($('input[name="shipper\\.contactPhoneExchange"]').val().length == 3 && isAmericanParty('shipper\\.contactPhoneCountryCode')) || 
	 		$('input[name="shipper\\.contactPhoneExchange"]').val().length == 4){
	    	 $('input[name="shipper\\.contactPhoneStation"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactPhoneExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	    if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $('input[name="shipper\\.contactPhoneExchange"]').val('');
	     }
	});

	$('input[name="shipper\\.contactPhoneStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactPhoneStation"]').val().length == 4){
	    	 $('input[name="shipper\\.contactPhoneExtension"]').focus();
	     }
	}); 
	//code to tab out in Cell fields
	var chkCellCountry =true;
	var chkCellArea = true;
	var chkCellExchange = true;
	$('input[name="shipper\\.contactCellCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactCellCountryCode"]').val()=='1' || 
	    		 $('input[name="shipper\\.contactCellCountryCode"]').val()=='01' ||  
	    		 $('input[name="shipper\\.contactCellCountryCode"]').val().length == 3){
	    	 $('input[name="shipper\\.contactCellAreaCode"]').focus();
			 chkCellCountry =true;
	     }
	}); 
	$('input[name="shipper\\.contactCellCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellCountry){
	    	 this.select();
	    	 chkCellCountry = false;
	     }
		});
	
	$('input[name="shipper\\.contactCellAreaCode"]').focus(function(evt) {
		chkCellArea = true;
	});
	$('input[name="shipper\\.contactCellAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	  $('input[name="shipper\\.contactCellAreaCode"]').val('');
	     }
	     if(($('input[name="shipper\\.contactCellAreaCode"]').val().length == 3 && isAmericanParty('shipper\\.contactCellCountryCode')) || 
	    		 $('input[name="shipper\\.contactCellAreaCode"]').val().length == 4){
	    	 $('input[name="shipper\\.contactCellExchange"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactCellAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	 $('input[name="shipper\\.contactCellAreaCode"]').val('');
	     }
	}); 
	$('input[name="shipper\\.contactCellExchange"]').focus(function(evt) {
		chkCellExchange = true;
	});
	$('input[name="shipper\\.contactCellExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	$('input[name="shipper\\.contactCellExchange"]').val('');
	     }
	     if(($('input[name="shipper\\.contactCellExchange"]').val().length == 3 && isAmericanParty('shipper\\.contactCellCountryCode')) || 
	    		 $('input[name="shipper\\.contactCellExchange"]').val().length == 4 ){
	    	 $('input[name="shipper\\.contactCellStation"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactCellExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	$('input[name="shipper\\.contactCellExchange"]').val('');
	     }
	});
	
	$('input[name="shipper\\.contactCellStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactCellStation"]').val().length == 4){
	    	 $('input[name="shipper\\.contactCellExtension"]').focus();
	     }
	}); 
	//code to tab out in Cell fields
	var chkFaxCountry =true;
	var chkFaxArea = true;
	var chkFaxExchange = true;
	$('input[name="shipper\\.contactFaxCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxCountry){
	    	 this.select();
	    	 chkFaxCountry = false;
	     }
		});
	$('input[name="shipper\\.contactFaxCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactFaxCountryCode"]').val()=='1' || 
	    		 $('input[name="shipper\\.contactFaxCountryCode"]').val()=='01' ||  
	    		 $('input[name="shipper\\.contactFaxCountryCode"]').val().length == 3){
	    	 $('input[name="shipper\\.contactFaxAreaCode"]').focus();
			 chkFaxCountry =true;
	     }
	}); 
	$('input[name="shipper\\.contactFaxAreaCode"]').focus(function(evt) {
		chkFaxArea = true;
	});
	$('input[name="shipper\\.contactFaxAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $('input[name="shipper\\.contactFaxAreaCode"]').val('');
	     }
	     if(($('input[name="shipper\\.contactFaxAreaCode"]').val().length == 3 && isAmericanParty('shipper\\.contactFaxCountryCode')) || 
	    		 $('input[name="shipper\\.contactFaxAreaCode"]').val().length == 4){
	    	 $('input[name="shipper\\.contactFaxExchange"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactFaxAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $('input[name="shipper\\.contactFaxAreaCode"]').val('');
	     }
	}); 
	$('input[name="shipper\\.contactFaxExchange"]').focus(function(evt) {
		chkFaxExchange = true;
	});
	$('input[name="shipper\\.contactFaxExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $('input[name="shipper\\.contactFaxExchange"]').val('');
	     }
	     if(($('input[name="shipper\\.contactFaxExchange"]').val().length == 3 && isAmericanParty('shipper\\.contactFaxCountryCode')) || 
	    		 $('input[name="shipper\\.contactFaxExchange"]').val().length == 4){
	    	 $('input[name="shipper\\.contactFaxStation"]').focus();
	     }
	}); 
	
	$('input[name="shipper\\.contactFaxExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	    if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $('input[name="shipper\\.contactFaxExchange"]').val('');
	     }
	});
	
	$('input[name="shipper\\.contactFaxStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="shipper\\.contactFaxStation"]').val().length == 4){
	    		$('input[name="shipper\\.contactFaxExtension"]').focus();
	     }
	}); 
	
});

function handlePrepaidCollectIndicator(caller){
	var isOverridden = false;
	
	if((caller=='S' && $('input[name="shipper\\.addressRoleId"]').val()!='') || 
	   (caller=='C' && $('input[name="consignee\\.addressRoleId"]').val()!=''))
	{
		var rowIDs = jQuery("#gridIdForParties").getDataIDs();
		for (var i=0;i<rowIDs.length;i=i+1)
	    { 
	      var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
	      if (caller=='S' && rowData.partyTypeDescription=='Prepaid Bill To Party' && (rowData.isCpPartyOverridden=='true'
	    	  || rowData.isCpPartyOverridden == true || rowData.isCpPartyOverridden == 'Yes'))
	      {
	    	  isOverridden = true;
	    	  break;
	      }
	      else if (caller=='C' && rowData.partyTypeDescription=='Collect Bill To Party' && (rowData.isCpPartyOverridden=='true'
	    	  || rowData.isCpPartyOverridden == true || rowData.isCpPartyOverridden == 'Yes'))
	      {
	    	  isOverridden = true;
	    	  break;
	      }
	    }
		if(isOverridden && caller=='S')
		{
			$("#partiesOverrideDialogDiv").html("Prepaid Bill to Party not Default.");
			$("#partiesSaveDialog").dialog("option", "buttons", [ {
				text : "Override",
				click : function() {
					$("#partiesSaveDialog").dialog("close");
				}
			}, {
				text : "Default",
				click : function() {
					$.ajax({
						url : _context +"/booking/party/setDefault",
						data : {
									type:'prepaid', 
									tradeCode:$('#tradeCode :selected').val(), 
									shipperArolId:$('input[name="shipper\\.addressRoleId"]').val(), 
									consigneeArolId:$('input[name="consignee\\.addressRoleId"]').val()
								},
						success : function(responseText) {
							if (responseText.success == true) {
								$("#gridIdForParties").trigger("reloadGrid");
								$("#partiesSaveDialog").dialog("close");
								addShipperAsDebtor();
							}
							else 
							{
								alert("An error has occurred");
							}
						}
					});
				}
			}]);
			$("#partiesSaveDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").hide(); 
			var xErrorCoordinate = window.pageXOffset;
			var yErrorCoordinate = window.pageYOffset;
			$('#partiesSaveDialog').dialog('open');
			setTimeout(function(){
				window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
		}
		else if(isOverridden && caller=='C')
		{
			$("#partiesOverrideDialogDiv").html("Collect Bill to Party not Default.");
			$("#partiesSaveDialog").dialog("option", "buttons", [ {
				text : "Override",
				click : function() {
					$("#partiesSaveDialog").dialog("close");
				}
			}, {
				text : "Default",
				click : function() {
					$.ajax({
						url : _context +"/booking/party/setDefault",
						data : {
									type:'collect', 
									tradeCode:$('#tradeCode :selected').val(), 
									shipperArolId:$('input[name="shipper\\.addressRoleId"]').val(), 
									consigneeArolId:$('input[name="consignee\\.addressRoleId"]').val()
								},
						success : function(responseText) {
							if (responseText.success == true) {
								$("#gridIdForParties").trigger("reloadGrid");
								$("#partiesSaveDialog").dialog("close");
								addConsigneeAsDebtor();
							}
							else 
							{
								alert("An error has occurred");
							}
						}
					});
				}
			}]);
			$("#partiesSaveDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").hide(); 
			var xErrorCoordinate = window.pageXOffset;
			var yErrorCoordinate = window.pageYOffset;
			$('#partiesSaveDialog').dialog('open');
			setTimeout(function(){
				window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
		}
		else if(!isOverridden)
		{
			if(caller=='S')
				addShipperAsDebtor();
			else if(caller=='C')
				addConsigneeAsDebtor();
		}
	}
	/*if(!isOverridden)
	{
		switch(caller){
			case 'S':
				if("SHA"==$('#originPortCityCode'))
				{
					if($('#prepaidCollectCode').val()=='P' || 
					$('#prepaidCollectCode').val()=='B')
					{
						$.ajax({
							url : _context +"/booking/party/evaluateChinaBookingDebtors",
							data : {
										shipperArolId:$('input[name="shipper\\.addressRoleId"]').val(),
										tradeCode: $('#tradeCode :selected').val()
									},
							success : function(responseText) {
								if (responseText.success == true) {
									$("#gridIdForParties").trigger("reloadGrid");
								}
								else 
								{
									alert("An error has occurred");
								}
							}
						});
					}
				}
				else
				{
					if($('#prepaidCollectCode').val()=='P'){
						$('#prepaidCollectCode').val('');
						$('#prepaidCollectCode').trigger('change');
					}
					else if($('#prepaidCollectCode').val()=='B'){
						$('#prepaidCollectCode').val('C');
						$('#prepaidCollectCode').trigger('change');
					}
				}
				break;
			case 'C':
				if($('#prepaidCollectCode').val()=='C'){
					$('#prepaidCollectCode').val('');
					$('#prepaidCollectCode').trigger('change');
				}
				else if($('#prepaidCollectCode').val()=='B'){
					$('#prepaidCollectCode').val('P');
					$('#prepaidCollectCode').trigger('change');
				}
				break;
			default:
				break;
		}
	}*/
}

function shipperOrgPredictive()
{
	/*var urlShipperOrg = _context
			+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();*/
	
	$('input[name="shipper\\.organizationName"]').gatesAutocomplete(
		{
			source:_context+'/cas/autocomplete.do',
			name: "Customer Name",
		 	extraParams: {
 		 		 method: 'searchOrg',
 		 		 searchType: '229',
 		 		parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
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
			//source : urlShipperOrg,
			formatItem : function(data) {
				$('input[name="shipper\\.organizationName"]').validationEngine('hidePrompt');
				$('input[name="shipper\\.organizationId"]').val("");
				return data.name + "-" + data.abbr;
			},
			formatResult : function(data) {
				$('input[name="shipper\\.organizationName"]').validationEngine('hidePrompt');
				return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
			},
			select : function(data) {
				$('input[name="shipper\\.organizationName"]').validationEngine('hidePrompt');
				$('input[name="shipper\\.organizationName"]').val(data.name + "-" + data.abbr);
				$('#shipperName').val($('input[name="shipper\\.organizationName"]').val());
				$('input[name="shipper\\.organizationCode"]').val(data.abbr);
				$('input[name="shipper\\.organizationId"]').val(data.id);
				shipperId = data.id;
				
				isBookingChanged = "Y";
				
				$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
				processShipperConsigneeColor("shipper");
				
				$('input[name="shipper\\.address"]').val("");
				$('input[name="shipper\\.address"]').trigger('change');
				
				
				singleAddressShipperCall();
				//shipperAddressPopupSearch();
			}
		});
}

function singleAddressShipperCall(){
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val()),
		
		success : function(responseText) {
			if(responseText.length == 1){
				var nameQualifier = responseText[0].nameQual;
				/*var city = responseText[0].city;
				var state = responseText[0].state;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);*/
				if(nameQualifier != undefined && nameQualifier != '' && nameQualifier != 'null' && nameQualifier != null){
					nameQualifier += " - ";
				}else{
					nameQualifier = '';
				}
				var finalAddress =nameQualifier+responseText[0].stAdd;
				$('input[name="shipper\\.address"]').val( finalAddress);
				
				shipperAddressPopulate(responseText[0]);
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
			name: "Customer Address",
		 	extraParams: {
 		 		 method: 'searchAddRoleBK',
 		 		 searchType: '234',
 		 		 parentSearch:  function() { return $('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val(); }
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
			formatItem : function(data) {
				$('input[name="shipper\\.addressRoleId"]').val("");
				var nameQualifier = data.nameQual;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
				return finalAddress;
			},
			formatResult : function(data) {
				/*var nameQualifier = data.nameQual;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);*/
				var nameQualifier = '';
				if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
					nameQualifier =data.nameQual+" - ";
				var finalAddress = nameQualifier+data.stAdd;
				return finalAddress;
			},
			select : function(data) {
				
				shipperAddressPopulate(data);
			}
		});	
}

function shipperAddressPopulate(data){
	
	emptyCityStateZip("shipper");
	emptyContactDetails("shipper");
	
	/*var nameQualifier = data.nameQual;
	var city = data.city;
	var state = data.state;
	
	var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);*/
	var nameQualifier = '';
	if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
	{
		$('input[name="shipper\\.nameQualifier"]').val(data.nameQual);
		nameQualifier =data.nameQual+" - ";
	}
	else
		$('input[name="shipper\\.nameQualifier"]').val('');
	shipperAddress = nameQualifier+data.stAdd;
	$('input[name="shipper\\.addressRoleId"]').val(data.addRole);
	$('input[name="shipper\\.city"]').val(data.city);
	$('input[name="shipper\\.state"]').val(data.state);
	$('input[name="shipper\\.zip"]').val(data.zip);
	$('input[name="shipper\\.countryName"]').val(data.cntry);
	$('input[name="shipper\\.provinceName"]').val(data.provnc);
	if(data.coOrgName!=null && data.coOrgName!='null')
		$('input[name="shipper\\.careOf"]').val(data.coOrgName);
	else
		$('input[name="shipper\\.careOf"]').val('');
	$('#refNumOverRideForShipper').val("N");
	
	processShipperConsigneeColor("shipper");
	checkAccordionHeaderForShipper();
	checkCopyButtons();
	
	isBookingChanged = "Y";
	
	if($('#bookingTypeCode').val()=='B')
		checkForShipperTemplate();
	else
		requestForContactList("shipper");
	
	//addShipperAsDebtor();// removes old and Adds New
	handlePrepaidCollectIndicator('S');
	removeBookingErrorPointers();
	
}

function shipperPopupSearch() {
	orgCaller = 'shipper';
	var shipperName = $('input[name="shipper\\.organizationName"]').val();
	var splitShipperName = "";
	var actionUrl = "";
	if(shipperName.indexOf("-") > 0){
		splitShipperName = shipperName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+encodeURIComponent(splitShipperName[0])
		+'|'+ $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitShipperName[1]);
	}else{
		splitShipperName = shipperName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ encodeURIComponent(shipperName) + '|'+ $('#tradeCode').val() + '|BK';
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
	$("#copyConsignee").attr("disabled", true);
	//For Defect 27290
	//enableScreenForDealer();
	$('#msgDiv').html("");
	emptyContactDetails("shipper");
	emptyContactDetails("consignee");
	//enableDisableContactId('shipper',true);
	//enableDisableContactId('consignee',true);
	resetDefault();
}

function goToMaintainTemplatePage(templateNumber){
	var url = _context +"/booking/template/loadTemplateForm?templateNumber=" + templateNumber;
	window.open(url);
}

function setDefaultPrefMethod(source){
	/*$('#'+source+'Comm1').attr('checked',true);
	$('#'+source+'Comm1').val('P');
	$('#'+source+'Comm1').trigger('click');*/
	//$('#shipperComm1').trigger('click');
	$('#'+ source +'Comm1').attr('checked',true);
	$('#'+ source +'Comm2').attr('checked',false);
	$('#'+ source +'Comm3').attr('checked',false);
	$('#'+ source +'Comm4').attr('checked',false);
	//$('#'+ source +'Comm1').trigger('change');
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
	//if($('input[name="shipper\\.organizationId"]').val()=='' && $('input[name="consignee\\.organizationId"]').val()==''){
	if($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()==''){
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

function getTradeForTemplate() {
	var data ="";
	console.log('trade='+$('#tradeCode').val());
	if($('#tradeCode').val() != '') {
		data = $('#tradeCode').val() + "|";
	}
	return data;
}

//check if template available for shipper
function checkForShipperTemplate(){
	var isEdi = false;
	var ediText = $('#ediOrWebIndicator').html();
	if(ediText != null && ediText.indexOf("EDI") > -1) {
		isEdi = true;
	}
	
	
	if($("#bookingStatusCode").val()=='INCP' || $("#bookingStatusCode").val()==''){
		if($('input[name="shipper\\.address"]').val()!='' && $('input[name="shipper\\.addressRoleId"]').val()!=''){
			templateCaller ="shipper";
			
			//do not show shipper templates if Consignee is present [ Defect - D020866 ] 
			if($('input[name="consignee\\.addressRoleId"]').val() != ''){
				requestForContactList("shipper");
				return;
			}
			//D031254 - make async : false - debtor was getting deleted due to async calls
			//call to cas to get template count
			$.ajax({
				type : "POST",
				async : false,
				//url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="shipper\\.addressRoleId"]').val()+'|02|'+filterParamsForCASForTemplateValidation(),
				url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="shipper\\.addressRoleId"]').val()+'|02|'+getTradeForTemplate(),
				success : function(responseText) {
					var templateCount = responseText[0].totrec;
					if(templateCount==1){
						//no quote details shoud be on page, even pulled quote should not be on page
						if($('#quoteId').val()==''){
							// D031918, don't apply template for EDI
							if(isEdi) {
								otherAlert("","Apply template on Edi Booking Details.");
							}
							else if($('#bookingId').val()=='')
								templateUpdate(responseText[0].id,'shipper');
							else{
								var overRide = confirm("Booking data exists on screen. Confirm override.(Ok/Cancel)");
								if(overRide == true){
									templateUpdate(responseText[0].id,'shipper');
								}
							}
						}
					}else if(templateCount>1){
						// D031918, don't apply template for EDI
						if(isEdi) {
							otherAlert("","Apply template on Edi Booking Details.");
						}
						//do not show template, if Quote details are present 
						else if($('#quoteId').val()==''){
							templatePopupSearch();
						}
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
	//changed for D25648
	//if($('#shipmentNumberHidden').val() !=''){
		data = data + $('#customerGroupId').val() + '-' + $('#customerGroupId option:selected').text() +'|';
	//}else{		data = data  + "|";	}

	data = data + $('#tariff').val()+'|';
	data = data + $('#tariffItemNumber').val()+'|';

	//data = data + $('#tariffCommodityDescription').val()+'|';
	data = data + '|';
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
	$('input[name="shipper\\.careOf"]').val('');
	$('input[name="shipper\\.nameQualifier"]').val('');
	$('input[name="shipper\\.city"]').val('');
	$('input[name="shipper\\.state"]').val('');
	$('input[name="shipper\\.zip"]').val('');
	$('input[name="shipper\\.countryName"]').val('');
	$('input[name="shipper\\.provinceName"]').val('');
	$("#copyShipper").attr("disabled", true);
}

function orgSearchUpdate(id) {
	if (orgCaller == 'shipper') {
		$('input[name="shipper\\.organizationName"]').validationEngine('hidePrompt');
		var values = id.split("|");
		$('input[name="shipper\\.organizationName"]').val(values[0] +"-"+ values[1]);
		$('input[name="shipper\\.organizationCode"]').val(values[1]);
		$('input[name="shipper\\.organizationId"]').val(values[2]);
		$('input[name="shipper\\.isOneTimeCustomer"]').val("false");
		$('#shipperName').val(values[0]);
		processShipperConsigneeColor("shipper");
		$('input[name="shipper\\.address"]').val("");
		$('input[name="shipper\\.address"]').trigger('change');
		isBookingChanged = "Y";
		
		singleAddressShipperCall();
		
		//shipperAddressPredictive();
	}else if (orgCaller == 'consignee') {
			$('input[name="consignee\\.organizationName"]').validationEngine('hidePrompt');
			var values = id.split("|");
			$('input[name="consignee\\.organizationName"]').val(values[0] +"-"+ values[1]);
			$('input[name="consignee\\.organizationCode"]').val(values[1]);
			$('input[name="consignee\\.organizationId"]').val(values[2]);
			$('input[name="consignee\\.isOneTimeCustomer"]').val("false");
			$('#consigneeName').val(values[0]);
			processShipperConsigneeColor("consignee");
			$('input[name="consignee\\.address"]').val("");
			$('input[name="consignee\\.address"]').trigger('change');
			isBookingChanged = "Y";
			//consigneeAddressPopupSearch();
			
			$.ajax({
				type : "POST",
				url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('input[name="consignee\\.organizationId"]').val() + '|03|'+$('#tradeCode').val()),
				
				success : function(responseText) {
					if(responseText.length == 1){
						var nameQualifier = responseText[0].nameQual;
						/*var city = responseText[0].city;
						var state = responseText[0].state;
						var finalAddress = formatAddRoleDscrForSC(nameQualifier, responseText[0].stAdd, city, state);*/
						if(nameQualifier != undefined && nameQualifier != '' && nameQualifier != 'null' && nameQualifier != null){
							nameQualifier += " - ";
						}else{
							nameQualifier = '';
						}
						$('input[name="consignee\\.address"]').val(nameQualifier + responseText[0].stAdd);
						consigneeAddressPopulate(responseText[0]);
					} else {
						consigneeAddressPopupSearch();
					}
				}
			});
			
			
			//consigneeAddPredictive();
		}else if (orgCaller == 'parties') {
			var values = id.split("|");
			$('input[name="organizationName"]').val(values[0] +"-"+ values[1]);
			partyOrg = values[1] +"-"+ values[0];
			$('input[name="organizationCode"]').val(values[1]);
			$('input[name="organizationId"]').val(values[2]);
			$('input[name="isOneTimeCustomer"]').val("false");
			$('input[name="address"]').val("");
			$('input[name="address"]').trigger('change');
			//partiesAddressPopupSearch();
			singleAddressPartiesCall();
			isPartyChanged = "Y";
			//partiesAddPredictive();
		}else if (orgCaller == 'repeat') {
			var values = id.split("|");

			$('#repeatContactOrgName').val(values[0] +"-"+ values[1]);
			repeatOrgName = values[1] +"-"+ values[0];
			$('#repeatContactOrgId').val(values[2]);
			$("#repeatContactOrgAddress").val("");
			//repeatContactAddressPredictive();
			orgAddressPopupSearch();
		}
		else if (orgCaller == 'dataAdmin') {
			var values = id.split("|");

			$('#existingOrganization').val(values[0] +"-"+ values[1]);
			$('#replaceOrganizationId').val(values[2]);
			if($("#dataAdminCode:checked").val()=="C")
			{
				$('#existingAddressLine1').val("");
				$('#existingAddressLine1').trigger('change');
				singleAddressOneTimerCall();
			}
		}
}

function setShipperDivName(name){
	//alert("name: = " + name);
	if(name != null && name != ''){
		setAccordianTabDetails("shipperNameDiv", " - "+name);
	}else{
		setAccordianTabDetails("shipperNameDiv", "");
	}
}

function addroleUpdate(data) {
	
	templateNumber=$('#bookingTemplateNumber').find('a').html();
	
	if (orgCaller == 'shipper') {
		var values = data.split("|");
		if(templateNumber!='' && tempShipperAddress!== undefined && tempShipperAddress !== null  && tempShipperAddress!='' && tempShipperAddress!=values[9])
	{
		var isConfirm = confirm("Data from Original template selection remains. Please review booking for necessary updates");
		if(!isConfirm)
		{
			return;
		}
	}	
		//D029999:For consignee/Shipper it needs to look at the template type and only remove if it is that type of template. 
		if(templateNumber!='' && tempShipperAddress!== undefined && tempShipperAddress !== null && tempShipperAddress!='' && tempShipperAddress!=values[9] && tempPartyTypeCode =='02')
		{
		$("#bookingTemplateNumber").html("");
		$('#bookingTemplateId').val('');
		}
		emptyContactDetails("shipper");
		emptyCityStateZip("shipper");
		
		//var values = data.split("|");
		var nameQualifier = '';
		if(values[4]!=undefined && values[4]!=null && values[4]!='null' && values[4]!='')
		{
			$('input[name="shipper\\.nameQualifier"]').val(values[4]);
			nameQualifier = values[4]+" - ";
		}
		else
			$('input[name="shipper\\.nameQualifier"]').val('');
		if(values[3]!=null && values[3]!='null')
			$('input[name="shipper\\.careOf"]').val(values[3]);
		else
			$('input[name="shipper\\.careOf"]').val('');
		$('input[name="shipper\\.city"]').val(values[2]);
		$('input[name="shipper\\.state"]').val(values[6]);
		$('input[name="shipper\\.zip"]').val(values[8]);
		$('input[name="shipper\\.countryName"]').val(values[11]);
		
		if(values[10]!=null && values[10]!='null')
			$('input[name="shipper\\.provinceName"]').val(values[10]);
		else 
			$('input[name="shipper\\.provinceName"]').val('');
		//var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state
		var finalAddress = nameQualifier+values[7];
		$('input[name="shipper\\.address"]').val(finalAddress);
		shipperAddress = finalAddress;
		$('input[name="shipper\\.addressRoleId"]').val(values[9]);
		
		$('#refNumOverRideForShipper').val("N");
		isBookingChanged = "Y";
		checkAccordionHeaderForShipper();
		checkCopyButtons();
		
		if($('#bookingTypeCode').val()=='B'){
			checkForShipperTemplate();
		}else{
			requestForContactList("shipper");
		}
		//addShipperAsDebtor();
		handlePrepaidCollectIndicator('S');
		removeBookingErrorPointers();
	}else if (orgCaller == 'consignee') {
		// D029377: added null check
		var values = data.split("|");
		if( templateNumber!='' && tempConsigneeAddress!== undefined && tempConsigneeAddress !== null && tempConsigneeAddress!='' && tempConsigneeAddress!=values[9])
		{
		var isConfirm = confirm("Data from Original template selection remains. Please review booking for necessary updates");
		if(!isConfirm)
		{
			return;
		}
		}
		if(templateNumber!='' && tempConsigneeAddress!== undefined && tempConsigneeAddress !== null && tempConsigneeAddress!='' && tempConsigneeAddress!=values[9] && tempPartyTypeCode =='03')
		{
			$("#bookingTemplateNumber").html("");
			$('#bookingTemplateId').val('');
		}
		emptyContactDetails("consignee");
		emptyCityStateZip("consignee");
		
		//var values = data.split("|");
		var nameQualifier = '';
		if(values[4]!=undefined && values[4]!=null && values[4]!='null' && values[4]!='')
		{
			$('input[name="consignee\\.nameQualifier"]').val(values[4]);
			nameQualifier = values[4] + " - ";
		}
		else
			$('input[name="consignee\\.nameQualifier"]').val('');
		if(values[3]!=null && values[3]!='null')
			$('input[name="consignee\\.careOf"]').val(values[3]);
		else
			$('input[name="consignee\\.careOf"]').val('');
		$('input[name="consignee\\.city"]').val(values[2]);
		$('input[name="consignee\\.state"]').val(values[6]);
		$('input[name="consignee\\.zip"]').val(values[8]);
		$('input[name="consignee\\.countryName"]').val(values[11]);
		if(values[10]!=null && values[10]!='null')
			$('input[name="consignee\\.provinceName"]').val(values[10]);
		else 
			$('input[name="consignee\\.provinceName"]').val('');
		//var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
		var finalAddress = nameQualifier+values[7];
		$('input[name="consignee\\.address"]').val(finalAddress);
		consigneeAddress = finalAddress;
		$('input[name="consignee\\.addressRoleId"]').val(values[9]);
		
		isBookingChanged = "Y";
		$('#refNumOverRideForConsignee').val("N");
		$('#isChangeAcceptedAfterUnitsReceived').val("N");
		
		checkAccordionHeaderForConsignee();
		checkCopyButtons();
		
		if($('#bookingTypeCode').val()=='B'){
			checkForConsigneeTemplate();
		}else{
			requestForContactList("consignee");
		}
		//addConsigneeAsDebtor();
		handlePrepaidCollectIndicator('C');
		removeBookingErrorPointers();
		$('#consigneeZipOverride').val("N");

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
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6],values[8]);
		$("#repeatContactOrgAddress").val(finalAddress);
		$("#repeatContactAddressRoleId").val(values[9]);
		repeatAddress = finalAddress;
	}
	else if(orgCaller == 'dataAdmin')
	{
		var values = data.split("|");
		var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6],values[8]);
		$("#existingAddressLine1").val(finalAddress);
		$("#replaceAddressRoleId").val(values[9]);
	}
}

function templatePopupSearch() {
	var ediText = $('#ediOrWebIndicator').html();
	if(ediText == null) edeiText = "";
	if(ediText.indexOf("EDI") > -1) {
		otherAlert("","Apply template on Edi Booking Details.");
	} else {

		var actionUrl = _context +'/cas/templateSearch.do?templateValue1='+encodeURIComponent(prepareInputForCASTemplateScreen());
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'TemplateSearch', windowStyle);
	}
}

function isQuoteIdPresent(){
	var quoteDetails = $('#quoteId').val();
	if(quoteDetails == null || quoteDetails == '' || quoteDetails == '0'){
		return false;
	}
	return true;
}

function templateUpdate(id,methodCaller){
	if(isQuoteIdPresent()){
		alert("Cannot overlay Quote Data. Please Refresh before prompt");
		return;
	}
	var templateNumber;
	if(id.indexOf("|") != -1){
		var splitTemplateData = id.split("|");
		templateNumber = splitTemplateData[0];
		// Fetching tradeCode from 4th Index - Interchanged tradeCode and description(In cas search DB table 'ref_column'), because of Pipe '|' limitation in CAS frame work
		var tradeCode = splitTemplateData[4];
		if(null != tradeCode && null != $('#tradeCode').val()){
			if($('#tradeCode').val() != ''){
				if(tradeCode != $('#tradeCode').val()){
					$('#msgDiv').html("<div class=\"message_error\">Template trade doesn't match Booking trade, select another template.</div>");
					$('#msgDiv').show();
					window.scrollTo(0, 0);
					triggerErrorMessageAlert();
					return;
				}
			}
		}
	}else{
		templateNumber = id;
	}
	var bookingId = $('#bookingId').val();
	var shipmentNumber = $('#shipmentNumber').val();
	$('#msgDiv').html("<div class=\"message_info\">Loading "+ templateNumber +" template...</div>");
	$('#msgDiv').show();
	//D031254 - make async : false - debtor was getting deleted due to async calls
	if(templateNumber != undefined){
		$.ajax({
			type : "POST",
			url : _context +"/booking/applyTemplate",
			async : false,
			data : {
				templateNumber : templateNumber,
				bookingId : bookingId,
				shipmentNumber : shipmentNumber
			},
			success : function(responseText) {
				
				if (responseText.messages.error.length == 0) {
					var hiddenBookDate = $('#hiddenBookedDate').val();
					clearAndResetBookingScreen();
					
					var tempEntityVersion = $("#entityVersion").val();
					var tempCommentId = $("#commentId").val();
					showJSON(responseText);
					$('#hiddenBookedDate').val(hiddenBookDate);
					$('#bookingStatusCode').val($('#savedBookingStatusCode').val());
					processChangeSource();
					$("#entityVersion").val(tempEntityVersion);
					$("#commentId").val(tempCommentId);
					if(methodCaller=="" || methodCaller=='shipper'){
						$('input[name="shipper\\.addressRoleId"]').val(responseText.data.shipper.addressRoleId);
						shipperAddress = responseText.data.consignee.address;
						//$('#shipperRepeatContact').attr('disabled', false);
					}else{
						$('input[name="consignee\\.addressRoleId"]').val(responseText.data.consignee.addressRoleId);
						consigneeAddress = responseText.data.consignee.address;
						//$('#consigneeRepeatContact').attr('disabled', false);
					}
					removeAssignedQuoteOnTemplatePull();
					
					//Moved to show Json method
					//requestForContactDetails("shipper", "N");
					//requestForContactDetails("consignee", "N");
					//updateParties(responseText);
					//checkCopyButtons();->already called in showJSON
					templateOwner="shipper";
					checkQuotesForPulledTemplate(id);
					setDefaultForBookingStatus();
					var aHtml = "<a style=\"color: blue\" href='#' " +
					"onclick=\"checkForChangeInBooking('" + templateNumber + "');\" >" + templateNumber + "</a>";
					$('#bookingTemplateNumber').html(aHtml);
					//Defect - D015881
					$('#dealerCode').val(responseText.data.bookingTemplate.dealerCode);
					if($.trim($("#dealerCode").val())!=''){
						if($('#loadServiceCode').val()=='AU' && $('#dischargeServiceCode').val()=='AU'){
							//disableScreenForDealer();
						}
					}else{
						enableScreenForDealer();
					}
					if($.trim($('#shipmentNumber').val()) == '') {
						$('#billOfLadingLink').html("Bill Of Lading");
						
					}
					$('#templateAppliedOnBookingFromScreen').val('Y');
					tempShipperAddress= responseText.data.shipper.addressRoleId;
					tempConsigneeAddress=responseText.data.consignee.addressRoleId;
					tempPartyTypeCode=responseText.data.bookingTemplate.partyTypeCode;
					$('#createBkngTmplSeqNbrDs').val(responseText.data.bookingTemplate.bookingTemplateSeqNbrDs);
					expandAll();
					reloadBookingGrids();
					/*if(addFreightEnabled()){
						showFreight($.trim($('#customerGroupId :selected').text()));
						$($('.booking-section')[4]).accordion("enable");
						$($('.booking-section')[4]).accordion('option', 'active', 0);
					}*/
					isTemplateFirstLoad = true;
					isBookingChanged = "Y";
				}else{
					$("#quoteExistsDiv").hide();
					var hiddenBookDate = $('#hiddenBookedDate').val();
					clearAndResetBookingScreen();
					$('#customizeNameAddress').removeAttr("disabled");
					reloadBookingGrids();
					setDefaultForBookingStatus();
					setDefaultForAssignLink();
					clearHeaderData();
					$('#commentsDiv').hide();
					$("#bookingDelete").attr("disabled", true);
					resetDivNames();
					$("#lastUpdateDateTimeUser").html("");
					var aHtml = "<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div>";
					$('#bookingTemplateNumber').html(aHtml);
					$('#templateAppliedOnBookingFromScreen').val('N');
					$('#hiddenBookedDate').val(hiddenBookDate);
					
				}
				//D029724: 	Prod Maintain Booking : Error: Zero is not a valid weight 
				if($("#weight").val()==0){
					$("#weight").val('');
				}
				//Messages
				showResponseMessages("msgDiv",responseText);
				$('#msgDiv').show();
				
				processShipperConsigneeColor("shipper");
				processShipperConsigneeColor("consignee");
				
				focusBookingNoCustomerGroupOnTemplatePull();
				
				/*Booking Security*/
				if(isHoldOverlayBottomEnabled){
					//Display Unreleased Holds Grid on initial display
					openUnreleasedHoldGridOnIntialDisplay("booking");
				}
				
				/*setTimeout(function(){
					hideEquipmentInlineEditDelete();
				}, 2000);*/
				enableDisableNote();
			}
		});
	}
}

function checkForChangeInBooking(templateNumber)
{
	if(isBookingChanged=='Y')
	{
		var isConfirm = confirm("All the unsaved Changes will be discarded. Continue?");
		if(isConfirm)
			document.location.href= _context + "/booking/template/showTemplateForm?templateNumber="+templateNumber;
	}
	else
		document.location.href= _context + "/booking/template/showTemplateForm?templateNumber="+templateNumber;
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
	if($('input[name="shipper\\.addressRoleId"]').val() =='' && $('input[name="consignee\\.addressRoleId"]').val()!='' && isShipperConsgineeModifiable){
		$("#copyConsignee").attr("disabled", false);
	}
	else
		$("#copyConsignee").attr("disabled", true);
	if($('input[name="shipper\\.addressRoleId"]').val()!=''){
		$("#copyConsignee").attr("disabled", true);
	}
	//$("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\">Add One Time Customer</a>");
	$("#consigneeOneTimeCustDiv").html("<a href=\"javascript:openOneTimeCustomer('consignee');\"><img height=\"16\" border=\"0\" align=\"absmiddle\" width=\"15\" height=\"15\" alt=\"search\" src=\""+_context+"/resources/images/u388_r.png\"></img>Add One Time Customer</a>");

}

function quoteFilterParams(){
	var queryString="";
	queryString = "&trade="+$('#tradeCode').val()+"&placeOfReceipt="+$('#blOriginCityCode').val() +"&placeOfDelivery="+$('#blDestinationCityCode').val()+"&pol="+$('#originPortCityCode').val()+"&pod="+$('#destinationPortCityCode').val();
	queryString = queryString + "&loadService="+$('#loadServiceCode').val()+"&dischargeService="+$('#dischargeServiceCode').val()+"&tariffNumber="+$('#tariff').val();
	return queryString;
}

function checkQuotesForPulledTemplate(casResponse){
	//Quotes to be checked only if Booking is not saved....
	if($('#bookingId').val()==''){
		//get owner from CAS
		var splitCASStr = casResponse.split("|");
		var templateOwner = splitCASStr[3];//casResponse[0].templateOwner;;
		//declare variable for holding AROLE id 
		var aroleIdForQuotes = "";
		var quoteShowHtml="";
		if(templateOwner=='Y' || templateOwner==''){//template owner shipper, get quote count for consignee
			//$("#bookingTemplateOwner").val('02');
			aroleIdForQuotes = $('input[name="consignee\\.addressRoleId"]').val();
			$("#showQuoteForAroleOnTemplatePull").val($('input[name="consignee\\.addressRoleId"]').val());
			quoteShowHtml="Consignee Quote Exists(Show)";
		}else if(templateOwner=='N'){//template owner consignee, get quote count for shipper
			//$("#bookingTemplateOwner").val('03');
			aroleIdForQuotes = $('input[name="shipper\\.addressRoleId"]').val();
			$("#showQuoteForAroleOnTemplatePull").val($('input[name="shipper\\.addressRoleId"]').val());
			quoteShowHtml="Shipper Quote Exists(Show)";
		}else{
			if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()==''){
				aroleIdForQuotes = $('input[name="shipper\\.addressRoleId"]').val();
				$("#showQuoteForAroleOnTemplatePull").val($('input[name="shipper\\.addressRoleId"]').val());
				quoteShowHtml="Shipper Quote Exists(Show)";
			}else if($('input[name="shipper\\.addressRoleId"]').val()=='' && $('input[name="consignee\\.addressRoleId"]').val()!=''){
				aroleIdForQuotes = $('input[name="consignee\\.addressRoleId"]').val();
				$("#showQuoteForAroleOnTemplatePull").val($('input[name="consignee\\.addressRoleId"]').val());
				quoteShowHtml="Consignee Quote Exists(Show)";
			}else{
				aroleIdForQuotes = $('input[name="shipper\\.addressRoleId"]').val();
				$("#showQuoteForAroleOnTemplatePull").val($('input[name="shipper\\.addressRoleId"]').val());
				quoteShowHtml="Shipper Quote Exists(Show)";
            }
		}
		if(aroleIdForQuotes!=''){
			var quoteCount = 0;//get quote count from CS response [responseText[0]]
			//call to booking controller to get quote count
			var quoteFilters = quoteFilterParams();
			$.ajax({
				type : "POST",
				url : _context +"/booking/getQuoteCount?"+quoteFilters,
				data : {
					aroleId : aroleIdForQuotes
				},
				success : function(responseText) {
					quoteCount = responseText.data;
					if(quoteCount==0){
						$("#quoteExistsDiv").hide();
					}else if(quoteCount>0){
						$("#quoteExistsDiv").html("<a href='#' class=\"span-5 last\" style=\"color: blue\">"+quoteShowHtml+"</a>");
						$("#quoteExistsDiv").show();
					}
				}
			});
		}
	}
}

function clearAndResetBookingScreen(){
	$('#msgDiv').html("");
	$('#bookingForm').clearForm();
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
function checkCopyButtons(){
	if($('input[name="shipper\\.addressRoleId"]').val() !='' && $('input[name="consignee\\.addressRoleId"]').val()!=''){
		$("#copyShipper").attr("disabled", true);
		$("#copyConsignee").attr("disabled", true);
		return;
	}
	
	if($('input[name="shipper\\.addressRoleId"]').val() !='' && $('input[name="consignee\\.addressRoleId"]').val()=='' && isShipperConsgineeModifiable){
		$("#copyShipper").attr("disabled", false);
		$("#copyConsignee").attr("disabled", true);
	}else if($('input[name="consignee\\.addressRoleId"]').val() !='' && $('input[name="shipper\\.addressRoleId"]').val()=='' && isShipperConsgineeModifiable){
		$("#copyShipper").attr("disabled", true);
		$("#copyConsignee").attr("disabled", false);
	}

	/*if($('input[name="consignee\\.addressRoleId"]').val() !='' && $('input[name="shipper\\.addressRoleId"]').val()==''){
		$("#copyConsignee").attr("disabled", false);
	}else{
		$("#copyConsignee").attr("disabled", true);
	}*/
}

function updateParties(responseText){

	/*if(responseText.data.shipper.organizationName==null)
		responseText.data.shipper.organizationName = '';
	if(responseText.data.consignee.organizationName==null)
		responseText.data.consignee.organizationName = '';

	if(responseText.data.shipper.organizationName!='' && responseText.data.consignee.organizationName==''){
		$('#prepaidCollectCode').attr('selectedIndex', 1);
	}
	else if(responseText.data.shipper.organizationName=='' && responseText.data.consignee.organizationName!=''){
		$('#prepaidCollectCode').attr('selectedIndex', 2);
	}
	else if(responseText.data.shipper.organizationName!='' && responseText.data.consignee.organizationName!=''){
		$('#prepaidCollectCode').attr('selectedIndex', 3);
	}else{
			$('#prepaidCollectCode').attr('selectedIndex', 1);
	}*/
	$('#prepaidCollectCode').selected().val(responseText.data.header.prepaidCollectCode);
	$('#prepaidCollectCode').trigger('change');
}

function loadAdditionalShipperDetails(responseText){
	$("#shipperId").val(responseText.data.shipper.organizationId);
	$('#shipper\\.addressRoleId').val(responseText.data.shipper.addressRoleId);
	/*if(null!=responseText.data.shipper.addressRoleId){
		enableDisableContactId('shipper',false);
	}*/
	setShipperCommMethodValue(responseText.data.shipper);
	//first clear the drop down
	$('select[name="shipper\\.contactId"]').children().remove();
	$('select[name="shipper\\.contactId"]').append("<option value='' label='Select'></option>");
	$.each(responseText.data.shipper.contactListForm, function(index, value) {
		$('select[name="shipper\\.contactId"]').append($("<option/>", {
					value : value.contactId,
					text : value.contactDesc
		}));
	});
	$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
	
	/*if(responseText.data.shipper.isCustomerOneTimeCust==true){
		formatColorForOneTime('shipper');
	}*/
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state, zip) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	var zipTemp = "";
	
	if (nameQualifier!=undefined && nameQualifier!=null && nameQualifier!='null' && nameQualifier != "") {
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
	if (state != null && state != "" && state!='null') {
		stateTemp = ", " + state;
	}
	if(zip!= null && zip !='' && zip!='null')
		zipTemp = " - " + zip;
	
	return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp + zipTemp;
}

/*function formatColorForOneTime(source){
	//$('input[name="'+source+'\\.organizationName"]').css('background-color', 'yellow');
	$('input[name="'+source+'\\.address"]').attr("disabled",true);
}*/

function addShipperAsDebtor(){
	
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url : _context +"/booking/party/setDefaults",
		async: false,
		type : "POST",
		data : queryString+"&type=shipper&oper=add&action=skip",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			/*if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('B');//both
			else if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()=='')
				$('#prepaidCollectCode').val('P');//shipper
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
}

function removeShipperAsDebtor(){
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url : _context +"/booking/party/setDefaults",
		type : "POST",
		data : queryString+"&type=shipper&oper=remove&action=skip",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			/*if($('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('C');//collect
			else
				$('#prepaidCollectCode').val('');//none
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
}

function enableDisableContactId(source,set){
	/*Booking Security*/
	if(!set)
		$('select[name="'+source+'\\.contactId"]').attr("disabled",set);
	else if($("#bookingStatusCode").val()!='CANC' && isShipperConsgineeModifiable)
		$('select[name="'+source+'\\.contactId"]').attr("disabled",set);
}

function requestForContactList(source){
	/*var contactNameDataList = "";
	$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + $('input[name="'+source+'\\.organizationId"]').val() + "|" + $('input[name="'+source+'\\.addressRoleId"]').val(),
		function(contacts) {
			$('select[name="'+source+'\\.contactId"]').children().remove();
			$('select[name="'+source+'\\.contactId"]').append("<option value=''>Select</option>");
			$(contacts).each(function() {
				var formattedName = getFormattedName(validateForUndefined(this.label), 
						validateForUndefined(this.dept), validateForUndefined(this.title));
				var option = $('<option />');
				option.attr('value', this.value).text(unescape(formattedName.replace(/ /g, "%A0")));
				$('select[name="'+source+'\\.contactId"]').append(option);
				contactNameDataList += this.value + "!?" + this.label + "!?"
						+ validateForUndefined(this.phcntry) + "!?" 
						+ validateForUndefined(this.pharea) + "!?" 
						+ validateForUndefined(this.phexch) + "!?" 
						+ validateForUndefined(this.phstcde) + "!?" 
						+ validateForUndefined(this.phextn) + "!?" 
						+ validateForUndefined(this.fxcntry) + "!?" 
						+ validateForUndefined(this.fxarea) + "!?" 
						+ validateForUndefined(this.fxexch) + "!?" 
						+ validateForUndefined(this.fxstcde) + "!?" 
						+ validateForUndefined(this.email) + "|"; 
			});
			//$("#contactNameDataList").val(contactNameDataList);
			$('select[name="'+source+'\\.contactId"]').trigger('blur');							
	});*/
	
	
	if(null!=$('input[name="'+source+'\\.addressRoleId"]').val() && $('input[name="'+source+'\\.addressRoleId"]').val()!=''){
		$.ajax({
			type : "POST",
			url : _context +"/booking/arole/getContactList",
			data : {
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val()
			},
			success : function(responseText) {
				$('select[name="'+source+'\\.contactId"]').children().remove();
				$('select[name="'+source+'\\.contactId"]').append("<option value='' label='Select'></option>");
				$.each(responseText.data.contactListForm, function(index, value) {
					$('select[name="'+source+'\\.contactId"]').append($("<option/>", {
								value : value.contactId,
								text : value.contactDesc
					}));
				});
				/*$.each(responseText.data.contactList, function(key,
						value) {
					$('select[name="'+source+'\\.contactId"]')
							.append($("<option/>", {
								value : key,
								text : value
							}));
				});*/
				if(responseText.data.primaryBookingContId!=undefined){
					$('select[name="'+source+'\\.contactId"]').val(responseText.data.primaryBookingContId);
				}else{
					$('select[name="'+source+'\\.contactId"]').val('');
				}
				requestForContactDetails(source);
			}
		});
	}
}

function getFormattedName(label, dept, title) {
	var names = label.split("-");
	var formattedName = "";
	var type = $.trim(names[0]);
	var fName = $.trim(names[1]);
	var lName = $.trim(names[2]);
	var lengthName=0;
	if(fName != "" || lName != "" ) {
		var name=fName+" "+lName;
		lengthName=name.length;
		if (type !="") {
			formattedName = fName + " " + lName+ "-" + type ;
		} else {
			formattedName = fName + " " + lName;
		}
	} else if(title != "" && dept != "") {
		var val=title + ', ' + dept;
		lengthName=val.length;
		if (type !="") {
			formattedName = title + ', ' + dept +"-" +type;
		} else {
			formattedName = title + ', ' + dept;
		}
	} else if(title != null && title != "") {
		var val=title;
		lengthName=val.length;
		if (type !="") {
			formattedName =   title+ "-" +type;
		} else {
			formattedName = title;
		}
	} else if(dept != null && dept != "") {
		var val=dept;
		lengthName=val.length;
		if (type !="") {
			formattedName =  dept+"-" +type;
		} else {
			formattedName = dept;
		}
	}
	var spaces='';
	var remLen=18-lengthName;
	if(remLen<14){
		spaces='%A0';
		for(var i=0;i<remLen;i++){
			spaces=spaces+'%A0';
		}	
	}
	var values=formattedName.split("-");
	var val=values[0].concat(spaces);
	formattedName=val.concat(values[1]);
	return formattedName;
}

function validateForUndefined(text) {
	if (text == undefined) {
		return "";
	} else {
		return text;
	}
}

function requestForContactDetails(source, change){
	emptyContactDetailsOnContactChange(source);
	//enableDisableContactId(source,false);
	if($('select[name="'+source+'\\.contactId"]').val()!='')
	{
		$.ajax({
			type : "POST",
			url : _context +"/booking/arole/contact",
			data : {
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val(),
				contactId : $('select[name="'+source+'\\.contactId"]').val()
			},
			success : function(responseText) {
				if(responseText.success)
				{
					var oneTimeCustomer = $('input[name="'+source+'\\.isOneTimeCustomer"]').val();
					//$('select[name="'+source+'\\.contact"]').val($('select[name="'+source+'\\.contactId"]').selected().val());
					$("#"+source+"").loadJSON(responseText.data);
					$('input[name="'+source+'\\.isOneTimeCustomer"]').val(oneTimeCustomer);
					if(source=='consignee')
						loadHazGrid();
					
					if(change!="N")
					{
						/*if(source=='shipper')
							addShipperAsDebtor();
						else if(source=='consignee')
							addConsigneeAsDebtor();*/
					}
				}
			}
		});
	}
	else if($('select[name="'+source+'\\.contactId"]').attr("disabled")== true
			|| $('select[name="'+source+'\\.contactId"]').attr("disabled")== 'true')
	{
		if(change!="N")
		{
			/*if(source=='shipper')
				addShipperAsDebtor();
			else if(source=='consignee')
				addConsigneeAsDebtor();*/
		}
	}
}

function emptyCityStateZip(source){
	$('input[name="'+ source +'\\.careOf"]').val('');
	$('input[name="'+ source +'\\.nameQualifier"]').val("");
	$('input[name="'+ source +'\\.city"]').val("");
	$('input[name="'+ source +'\\.state"]').val("");
	$('input[name="'+ source +'\\.zip"]').val("");
	$('input[name="'+ source +'\\.countryName"]').val("");
	$('input[name="'+ source +'\\.provinceName"]').val("");
}

function emptyContactDetails(source){
	$('select[name="'+ source +'\\.contactId"]').children().remove();
	$('select[name="'+ source +'\\.contactId"]').append("<option value='' label='Select'></option>");
	emptyContactDetailsOnContactChange(source);
}

function emptyContactDetailsOnContactChange(source){
	$('input[name="'+ source +'\\.contact"]').val("");
	$('input[name="'+ source +'\\.addressRoleContactCode"]').val("");
	
	$('input[name="'+ source +'\\.contactFaxCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxExchange"]').val("");
	$('input[name="'+ source +'\\.contactFaxStation"]').val("");
	$('input[name="'+ source +'\\.contactFaxExtension"]').val("");
	
	$('input[name="'+ source +'\\.contactCellCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactCellAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactCellExchange"]').val("");
	$('input[name="'+ source +'\\.contactCellStation"]').val("");
	$('input[name="'+ source +'\\.contactCellExtension"]').val("");

	$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExchange"]').val("");
	$('input[name="'+ source +'\\.contactPhoneStation"]').val("");
	$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExtension"]').val("");

	$('input[name="'+ source +'\\.contactEmailAddress"]').val("");
	//$('input[name="'+ source +'\\.communicationMethodCode"]').val("");
	setDefaultPrefMethod(source);
	
	if(source=='consignee')
		loadHazGrid();
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
function isAccordianOpen(index){
	var retValue = '';
	var status = $($('.booking-section')[index]).accordion('option', 'active');
	//alert("status:"+status);
	if(status==undefined)
		retValue ='false';// false;
	else if(status=='false' || status==false)
		retValue ='false';// false;
	else if(status=='0')
		retValue ='true';
	//alert("retValue:"+retValue);
	return retValue;
}
function openDivBlock(){
	/*var ok = isAccordianOpen(0);
	if(ok=='false'){
		$($('.booking-section')[0]).accordion("enable");
		$($('.booking-section')[0]).accordion('option', 'active', 0);
	}*/
	document.getElementById('maintainBookingShipperConsignee').style.display = 'block';
	window.scrollTo(0, 180);
}

function orgIsPOVAndUserOnTemplate(){
}

function isContactSelectedFromDropDown(source){
	if($('select[name="'+source+'\\.contactId"] option').length==0 || $('select[name="'+source+'\\.contactId"] :selected').val()=='' || $('select[name="'+source+'\\.contactId"] :selected').val()=='Select'){
		return false;
	}
	return true;
}

function validateContactForShipperConsignee(source){
	//Defect - D020445, So the expectation when making a template such as below that there would not be a required field when pulling in the POV AROL.
	//defect - D021668 [shipper/consignee both should not required contact at template level
	if($('#bookingTypeCode').val()=='T' && $('input[name="'+source+'\\.organizationCode"]').val()=='POV'){
		return true;
	}

	var isValid = true;
	if($('input[name="'+source+'\\.organizationId"]').val()!='' && $('input[name="'+source+'\\.addressRoleId"]').val()=='')
	{
		openDivBlock();
		isValid = false;
		$('input[name="'+source+'\\.address"]').validationEngine('showPrompt', 'Please select Address Role.', 'error', 'topRight', true);
		return isValid;
	}
	if($('input[name="'+source+'\\.addressRoleId"]').val()!=''){
		if(!isContactSelectedFromDropDown(source) && $('input[name="'+source+'\\.contact"]').val()==''/* && orgIsPOVAndUserOnTemplate()*/){
			openDivBlock(); 
			isValid = true;
			if($('select[name="'+source+'\\.contactId"] option').length>1){
				// Defect 25151
				if($("#tradeCode").val()=="F"){
					return isValid;
				}else{
					$('select[name="'+source+'\\.contactId"]').validationEngine('showPrompt', 'Please select contact.', 'error', 'topRight', true);
					//D027457
					return false;
				}
			}else if($("#tradeCode").val()=="F"){
				return isValid;
			}else{
				$('input[name="'+source+'\\.contact"]').validationEngine('showPrompt', 'Please enter contact.', 'error', 'topRight', true);
				return false;
			}
		  
	}
		var prefMethod = getPrefCommMethod(source);
		if(!isContactSelectedFromDropDown(source) && $('input[name="'+source+'\\.contact"]').val()!='' && prefMethod==''){
			openDivBlock();
			$('#'+source+'Comm1').validationEngine('showPrompt', 'Please select preferred method.', 'error', 'topRight', true);
			isValid = false;
			if(!isValid)
				return isValid;
		}
		isValid = validateContactLine('P',source,'Phone');
		if(!isValid)
			return isValid;
		/*if(prefMethod=='P'){
			isValid = validateContactLine(prefMethod,source,'Phone');
			if(!isValid)
				return isValid;
		}else*/ if(prefMethod=='C'){
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
	}
	return isValid;
}

function validateContactLine(prefMethod,source,contactField){
	var isValid = true;
	var areaCode = '', exchange='',station='',countryCode='', extension='';
	var isFieldPrefMethod=false;
	if(prefMethod=='P' && contactField=='Phone'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactPhoneAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactPhoneExchange"]').val();
		station = $('input[name="'+source+'\\.contactPhoneStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactPhoneCountryCode"]').val();
		extension = $('input[name="'+source+'\\.contactPhoneExtension"]').val();
		isValid = validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, extension, source, contactField);
	}else if(prefMethod=='C' && contactField=='Cell'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactCellAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactCellExchange"]').val();
		station = $('input[name="'+source+'\\.contactCellStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactCellCountryCode"]').val();
		extension = $('input[name="'+source+'\\.contactCellExtension"]').val();
		isValid = validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, extension, source, contactField);
	}else if(prefMethod=='F' && contactField=='Fax'){
		isFieldPrefMethod = true;
		areaCode = $('input[name="'+source+'\\.contactFaxAreaCode"]').val();
		exchange = $('input[name="'+source+'\\.contactFaxExchange"]').val();
		station = $('input[name="'+source+'\\.contactFaxStation"]').val();
		countryCode = $('input[name="'+source+'\\.contactFaxCountryCode"]').val();
		extension = $('input[name="'+source+'\\.contactFaxExtension"]').val();
		isValid= validateFieldData(isFieldPrefMethod, areaCode, exchange, station, countryCode, extension, source, contactField);
	}
	return isValid;
}

function validateFieldData(isFieldPrefMethod,areaCode,exchange,station,countryCode, extension, source,contactField){
	var isValid = true;
	
	// Defect 24095
    // Changed code to skip validation for trade code F
	
	if($("#tradeCode").val()=="F"){
		return isValid;
	}
	

	if(countryCode=='')
		countryCode='01';

	if(countryCode=='' || (countryCode =='1' || countryCode=='01' || countryCode=='001' || countryCode=='us' || countryCode=='united states')){

		if(areaCode == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		} 
		else if(areaCode.length!=3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is a 3 digit number.', 'error', 'topRight', true);
			isValid = false;
		}
		
		if(exchange == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		} 
		else if(exchange.length != 3){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is a 3 digit number', 'error', 'topRight', true);
			isValid = false;
		}
		
		if(station == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}
		else if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}

		if(extension.length>7){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Extension"]').validationEngine('showPrompt', '*Extension code cannot be more than 7 digits.', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		//D033813: 	SPX: MAINTAIN BKG - NEED TO RELAX THE PHONE# EDIT for NON-US
		if(areaCode == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}/*else if(areaCode.length < 2 || areaCode.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'AreaCode"]').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}*/
		if(exchange == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}/*else if(exchange.length < 3 || exchange.length > 4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Exchange"]').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number', 'error', 'topRight', true);
			isValid = false;
		}*/
		if(station == '' && isFieldPrefMethod){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			isValid = false;
		}
		/*else if(station.length!=4){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Station"]').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
			isValid = false;
		}*/
		
		if(extension.length>7){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Extension"]').validationEngine('showPrompt', '*Extension code cannot be more than 7 digits.', 'error', 'topRight', true);
			isValid = false;
		}

	}
	return isValid;
}

function isUnPrefDetailsEmpty(source,field){
	var isEmpty = true;
	var areaCode = $('input[name="'+source+'\\.contact'+field+'AreaCode"]').val();
	var exchange = $('input[name="'+source+'\\.contact'+field+'Exchange"]').val();
	var extension = $('input[name="'+source+'\\.contact'+field+'Extension"]').val();
	var station = $('input[name="'+source+'\\.contact'+field+'Station"]').val();
	var countryCode = $('input[name="'+source+'\\.contact'+field+'CountryCode"]').val();
	if(areaCode!='' || exchange!='' || station!='' || countryCode!=''){// || extension!=''
		isEmpty = false;
		return isEmpty;
	}
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
	var extension = $('input[name="'+source+'\\.contact'+contactField+'Extension"]').val();
	
	if(countryCode=='' || (countryCode =='1' || countryCode=='01' || countryCode=='001' || countryCode=='us' || countryCode=='united states')){
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
		if(extension.length>7){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Extension"]').validationEngine('showPrompt', '*Extension code cannot be more than 7 digits.', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		//D033813: 	SPX: MAINTAIN BKG - NEED TO RELAX THE PHONE# EDIT for NON-US
		/*if(areaCode.length < 2 || areaCode.length > 4){
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
		}*/
		if(extension.length>7){
			openDivBlock();
			$('input[name="'+source+'\\.contact'+contactField+'Extension"]').validationEngine('showPrompt', '*Extension code cannot be more than 7 digits.', 'error', 'topRight', true);
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


function handleManualContact(source){
	$('select[name="'+ source +'\\.contactId"]').val("");
	$('select[name="'+ source +'\\.addressRoleContactCode"]').val("");
	
	$('input[name="'+ source +'\\.contactFaxCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactFaxExchange"]').val("");
	$('input[name="'+ source +'\\.contactFaxStation"]').val("");
	$('input[name="'+ source +'\\.contactFaxExtension"]').val("");
	
	$('input[name="'+ source +'\\.contactCellCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactCellAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactCellExchange"]').val("");
	$('input[name="'+ source +'\\.contactCellStation"]').val("");
	$('input[name="'+ source +'\\.contactCellExtension"]').val("");

	$('input[name="'+ source +'\\.contactPhoneAreaCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExchange"]').val("");
	$('input[name="'+ source +'\\.contactPhoneStation"]').val("");
	$('input[name="'+ source +'\\.contactPhoneCountryCode"]').val("");
	$('input[name="'+ source +'\\.contactPhoneExtension"]').val("");

	$('input[name="'+ source +'\\.contactEmailAddress"]').val("");
	$('#'+source+'Comm1').trigger('click');
	$('#'+ source +'Comm1').attr('checked',true);
	$('#'+ source +'Comm2').attr('checked',false);
	$('#'+ source +'Comm3').attr('checked',false);
	$('#'+ source +'Comm4').attr('checked',false);
	$('#'+ source +'Comm1').trigger('change');
}

function checkAccordionHeaderForShipper()
{
	if($('input[name="shipper\\.addressRoleId"]').val()!='')
		setAccordianTabDetails("shipperNameDiv", " - "+$('input[name="shipper\\.organizationName"]').val());
	else
		setAccordianTabDetails("shipperNameDiv", "");
}

function removeBookingErrorPointers(){
	$("#bookingForm").validationEngine('hideAll');
}
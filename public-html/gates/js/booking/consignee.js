var consigneeAddress = "";

$(function() {

	setDefaultPrefMethod('consignee');

	// create parties override dialog at body onload
	$("#notifyPartyOverrideDialog").dialog({
		autoOpen : false,
		width : 500,
		modal : true
	});
	
	$('input[name="consignee\\.city"]').attr("readonly", true);
	$('input[name="consignee\\.state"]').attr("readonly", true);
	$('input[name="consignee\\.zip"]').attr("readonly", true);
	
	$('input[name="consignee\\.contactPhoneCountryCode"]').change(function(){
		loadHazGrid();
	});
	
	consigneeOrgPredictive();
	consigneeAddPredictive();

	// consignee Pop-Up Search
	$('input[name="consignee\\.organizationName"]').gatesPopUpSearch({
		func : function() {
			consigneePopupSearch();
		}
	});

	// consignee address Pop-Up Search
	$('input[name="consignee\\.address"]').gatesPopUpSearch({
		func : function() {
			consigneeAddressPopupSearch();
		}
	});

	// Clear consignee details on change of consignee
	$('input[name="consignee\\.organizationName"]').change(
			function() {
				if ($('input[name="consignee\\.organizationName"]').val()=='' 
					|| $('input[name="consignee\\.organizationName"]').val() != $('#consigneeName').val()) {
				
					$('input[name="consignee\\.organizationId"]').val("");
					$('input[name="consignee\\.organizationCode"]').val('');
					$('input[name="consignee\\.organizationName"]').val('');
					$('input[name="consignee\\.isOneTimeCustomer"]').val("false");
				}
				processShipperConsigneeColor("consignee");
				$('input[name="consignee\\.address"]').val("");
				$('input[name="consignee\\.address"]').trigger('change');
	});

	$('input[name="consignee\\.address"]').change(function() {
		if(consigneeAddress!=$('input[name="consignee\\.address"]').val())
		{
			$('input[name="consignee\\.address"]').val('');
			consigneeAddress = '';
			$('input[name="consignee\\.addressRoleId"]').val("");
			$('#refNumOverRideForConsignee').val("");
			$('#isChangeAcceptedAfterUnitsReceived').val("");
		}
		
		emptyCityStateZip("consignee");
		emptyContactDetails("consignee");
		handlePrepaidCollectIndicator('C');
		//removeConsigneeAsDebtor();
		checkAccordionHeaderForConsignee();
		checkCopyButtons();
		removeBookingErrorPointers();
	});

	// get contact details for selected contact id[commented for merge.]
	$('select[name="consignee\\.contactId"]').change(function() {
		removeBookingErrorPointers();
		if($('select[name="consignee\\.contactId"] option').length!=0 && 
				$('select[name="consignee\\.contactId"] :selected').val()!=''){
			requestForContactDetails("consignee", "N");
			$('#isChangeAcceptedAfterUnitsReceived').val("N");
		}else{
			emptyContactDetailsOnContactChange('consignee');
		}
	});

	// get contact details for selected contact id
	$('input[name="consignee\\.contact"]').change(function() {
		handleManualContact('consignee');
	});
	
	/**
	 * Copy Consignee to Shipper 
	 * */
	$('#copyConsignee').click(function() {
		if ($('input[name="consignee\\.organizationName"]').val() != '' && $('input[name="shipper\\.organizationName"]').val() == '') {
			$('input[name="shipper\\.organizationName"]').validationEngine('hidePrompt');
			$('input[name="shipper\\.organizationName"]').val($('input[name="consignee\\.organizationName"]').val());
			$('input[name="shipper\\.organizationCode"]').val($('input[name="consignee\\.organizationCode"]').val());
			$('#shipperName').val($('input[name="consignee\\.organizationName"]').val());
			$('input[name="shipper\\.address"]').val($('input[name="consignee\\.address"]').val());
			shipperAddress = $('input[name="consignee\\.address"]').val();
			$('input[name="shipper\\.nameQualifier"]').val($('input[name="consignee\\.nameQualifier"]').val());
			$('input[name="shipper\\.careOf"]').val($('input[name="consignee\\.careOf"]').val());
			$('input[name="shipper\\.city"]').val($('input[name="consignee\\.city"]').val());
			$('input[name="shipper\\.state"]').val($('input[name="consignee\\.state"]').val());
			$('input[name="shipper\\.zip"]').val($('input[name="consignee\\.zip"]').val());
			$('input[name="shipper\\.countryName"]').val($('input[name="consignee\\.countryName"]').val());
			$('input[name="shipper\\.provinceName"]').val($('input[name="consignee\\.provinceName"]').val());
			$('select[name="shipper\\.contactId"]').html($('select[name="consignee\\.contactId"]').html());

			$('select[name="shipper\\.contactId"]').val($('select[name="consignee\\.contactId"] :selected').val());
			$('input[name="shipper\\.addressRoleContactCode"]').val($('input[name="consignee\\.addressRoleContactCode"]').val());
			$('input[name="shipper\\.contact"]').val($('input[name="consignee\\.contact"]').val());
			$('input[name="shipper\\.contactPhoneCountryCode"]').val($('input[name="consignee\\.contactPhoneCountryCode"]').val());
			$('input[name="shipper\\.contactPhoneAreaCode"]').val($('input[name="consignee\\.contactPhoneAreaCode"]').val());
			$('input[name="shipper\\.contactPhoneExchange"]').val($('input[name="consignee\\.contactPhoneExchange"]').val());
			$('input[name="shipper\\.contactPhoneStation"]').val($('input[name="consignee\\.contactPhoneStation"]').val());
			$('input[name="shipper\\.contactPhoneExtension"]').val($('input[name="consignee\\.contactPhoneExtension"]').val());

			$('input[name="shipper\\.contactCellCountryCode"]').val($('input[name="consignee\\.contactCellCountryCode"]').val());
			$('input[name="shipper\\.contactCellAreaCode"]').val($('input[name="consignee\\.contactCellAreaCode"]').val());
			$('input[name="shipper\\.contactCellExchange"]').val($('input[name="consignee\\.contactCellExchange"]').val());
			$('input[name="shipper\\.contactCellStation"]').val($('input[name="consignee\\.contactCellStation"]').val());
			$('input[name="shipper\\.contactCellExtension"]').val($('input[name="consignee\\.contactCellExtension"]').val());

			$('input[name="shipper\\.contactFaxCountryCode"]').val($('input[name="consignee\\.contactFaxCountryCode"]').val());
			$('input[name="shipper\\.contactFaxAreaCode"]').val($('input[name="consignee\\.contactFaxAreaCode"]').val());
			$('input[name="shipper\\.contactFaxExchange"]').val($('input[name="consignee\\.contactFaxExchange"]').val());
			$('input[name="shipper\\.contactFaxStation"]').val($('input[name="consignee\\.contactFaxStation"]').val());
			$('input[name="shipper\\.contactFaxExtension"]').val($('input[name="consignee\\.contactFaxExtension"]').val());

			$('input[name="shipper\\.contactEmailAddress"]').val($('input[name="consignee\\.contactEmailAddress"]').val());
			$("#copyConsignee").attr("disabled", true);
			
			//copy the internal ID's
			$('input[name="shipper\\.addressRoleId"]').val($('input[name="consignee\\.addressRoleId"]').val());
			$('input[name="shipper\\.organizationId"]').val($('input[name="consignee\\.organizationId"]').val());
			$('input[name="shipper\\.isOneTimeCustomer"]').val($('input[name="consignee\\.isOneTimeCustomer"]').val());
			$('input[name="shipper\\.organizationCode').val($('input[name="consignee\\.organizationCode').val());
			
			processShipperConsigneeColor("shipper");
			
			isBookingChanged = "Y";

			var preMethod = getPrefCommMethod('consignee');
			$('#shipperComm1').attr('checked',false);
			$('#shipperComm2').attr('checked',false);
			$('#shipperComm3').attr('checked',false);
			$('#shipperComm4').attr('checked',false);
			if(preMethod=='P'){
				$('#shipperComm1').attr('checked',true);
				$('#shipperComm1').val(preMethod);
			}else if(preMethod=='C'){
				$('#shipperComm2').attr('checked',true);
				$('#shipperComm2').val(preMethod);
			}else if(preMethod=='F'){
				$('#shipperComm3').attr('checked',true);
				$('#shipperComm3').val(preMethod);
			}else if(preMethod=='E'){
				$('#shipperComm4').attr('checked',true);
				$('#shipperComm4').val(preMethod);
			}else{
				$('#shipperComm1').attr('checked',true);
				$('#shipperComm1').val(preMethod);
			}
			//enableDisableContactId('shipper',false);
			
			checkAccordionHeaderForShipper();
			$('#refNumOverRideForShipper').val("N");
			
			/*if($('input[name="shipper\\.addressRoleId"]').val()!='')
				addShipperAsDebtor();*/
			//shipperOrgPredictive();
			//shipperAddressPredictive();
			handlePrepaidCollectIndicator('S');
		}
	});

	$('#consigneeRepeatContact').click(function(){
		if($("#bookingStatusCode").val()=='CANC'){
			$("#repeatContactOverlay").gatesDisable();
		}else{
			$("#repeatContactOverlay").gatesEnable();
		}
		if($('input[name="consignee\\.addressRoleId"]').val()!='')
		{
			if($('select[name="consignee\\.contactId"] :selected').val()=='' && 
					$('input[name="consignee\\.contact"]').val()!='')
			{
				repeatCaller ="consignee";
				
				$('#originalOrgName').val($('input[name="consignee\\.organizationName"]').val());
				//$('#originalOrgAddress').val($('input[name="consignee\\.address"]').val());
				$('#originalOrgAddress').val(formatAddRoleDscrForSC('', $('input[name="consignee\\.address"]').val(), 
						$('input[name="consignee\\.city"]').val(), $('input[name="consignee\\.state"]').val(), $('input[name="consignee\\.zip"]').val()));
				$('#repeatContactShipmentNo').val($('#shipmentNumber').val());
				$("#repeatContactOriginalAroleId").val($('input[name="consignee\\.addressRoleId"]').val());
				$("#repeatContactNameLabel").html($('input[name="consignee\\.contact"]').val());

							
				//consignee.contactPhoneCountryCode
				
				var p1 =  $('input[name="consignee\\.contactPhoneCountryCode"]').val();
				var p2 =  $('input[name="consignee\\.contactPhoneAreaCode"]').val();
				var p3 =  $('input[name="consignee\\.contactPhoneExchange"]').val();
				var p4 =  $('input[name="consignee\\.contactPhoneStation"]').val();
				var p5 =  $('input[name="consignee\\.contactPhoneExtension"]').val();
						
				var Phonearray = [p1,p2,p3,p4,p5];			
				var Phone = Phonearray.join("-");			
				
				
				var c1 =  $('input[name="consignee\\.contactCellCountryCode"]').val();
				var c2 =  $('input[name="consignee\\.contactCellAreaCode"]').val();
				var c3 =  $('input[name="consignee\\.contactCellExchange"]').val();
				var c4 =  $('input[name="consignee\\.contactCellStation"]').val();
				var c5 =  $('input[name="consignee\\.contactCellExtension"]').val();					
				
				var cellarray = [c1,c2,c3,c4,c5];
				var cell = cellarray.join("-");
				
				var f1 =  $('input[name="consignee\\.contactFaxCountryCode"]').val();
				var f2 =  $('input[name="consignee\\.contactFaxAreaCode"]').val();
				var f3 =  $('input[name="consignee\\.contactFaxExchange"]').val();
				var f4 =  $('input[name="consignee\\.contactFaxStation"]').val();
				var f5 =  $('input[name="consignee\\.contactFaxExtension"]').val();
				
				var faxarray = [f1,f2,f3,f4,f5];			
				var fax = faxarray.join("-");
				
				$("#repeatContactPhone").val(Phone);			
				$("#repeatContactCell").val(cell);
				$("#repeatContactFax").val(fax);			
				$("#repeatContactEmailAddress").val($('input[name="consignee\\.contactEmailAddress"]').val());
				$("#repeatContactId").html($('select[name="consignee\\.contactId"]').html());
				$("#repeatContactId :selected").val('');
				
				$("#repeatContactOverlay").dialog('open');
			}
			else
			{
				$('#consigneeRepeatContact').attr("checked", false);
				alert("Please enter a non-CP contact first");
			}
		}
		else
		{
			$('#consigneeRepeatContact').attr("checked", false);
			alert("Please select consignee address role first");
		}
	});

	//setDefaultPrefMethod('consignee');
	
	/*$('input[name="consignee\\.organizationName"]').click(function(){
		shipperPredictiveSearch();
		consigneePredictiveSearch();
	});*/
	
	$("#consignee input").change(function() {
		if ($(this).is("#contactId") || $(this).is("#contactPhoneAreaCode") || 
				$(this).is("#contactPhoneExchange") || $(this).is("#contactPhoneStation")){
			$('#isChangeAcceptedAfterUnitsReceived').val("N");
		}
	});
		//code to tab out in Phone fields
	var chkPhoneCountry =true;
	var chkPhoneArea = true;
	var chkPhoneExchange = true;
	$('input[name="consignee\\.contactPhoneCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneCountry){
	    	 this.select();
	    	 chkPhoneCountry = false;
	     }
		});
	$('input[name="consignee\\.contactPhoneCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="consignee\\.contactPhoneCountryCode"]').val()=='1' || 
	    		 $('input[name="consignee\\.contactPhoneCountryCode"]').val()=='01' ||  
	    		 $('input[name="consignee\\.contactPhoneCountryCode"]').val().length == 3){
	    	 $('input[name="consignee\\.contactPhoneAreaCode"]').select();
			 chkPhoneCountry =true;
	     }
	}); 
	$('input[name="consignee\\.contactPhoneAreaCode"]').focus(function(evt) {
		chkPhoneArea = true;
	});
	$('input[name="consignee\\.contactPhoneAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('input[name="consignee\\.contactPhoneAreaCode"]').val('');
	     }
	     if(( $('input[name="consignee\\.contactPhoneAreaCode"]').val().length == 3 && isAmericanParty('consignee\\.contactPhoneCountryCode')) || 
	    		 $('input[name="consignee\\.contactPhoneAreaCode"]').val().length == 4){
	    		$('input[name="consignee\\.contactPhoneExchange"]').select();
	     }
	}); 
	
	$('input[name="consignee\\.contactPhoneAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	    if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('input[name="consignee\\.contactPhoneAreaCode"]').val('');
	     }
	}); 
	$('input[name="consignee\\.contactPhoneExchange"]').focus(function(evt) {
		chkPhoneExchange = true;
	});
	$('input[name="consignee\\.contactPhoneExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		 if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	$('input[name="consignee\\.contactPhoneExchange"]').val('');
	     }
	     if(($('input[name="consignee\\.contactPhoneExchange"]').val().length == 3 && isAmericanParty('consignee\\.contactPhoneCountryCode')) || 
	 		$('input[name="consignee\\.contactPhoneExchange"]').val().length == 4){
	    	 $('input[name="consignee\\.contactPhoneStation"]').select();
	     }
	}); 
	
	$('input[name="consignee\\.contactPhoneExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	$('input[name="consignee\\.contactPhoneExchange"]').val('');
	     }
	});

	$('input[name="consignee\\.contactPhoneStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="consignee\\.contactPhoneStation"]').val().length == 4){
	    	 $('input[name="consignee\\.contactPhoneExtension"]').focus();
	     }
	}); 
	
	//code to tab out in Cell fields
	var chkCellCountry =true;
	var chkCellArea = true;
	var chkCellExchange = true;
	$('input[name="consignee\\.contactPhoneCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkCellCountry){
	    	 this.select();
	    	 chkCellCountry = false;
	     }
		});
	$('input[name="consignee\\.contactCellCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="consignee\\.contactCellCountryCode"]').val()=='1' || 
	    		 $('input[name="consignee\\.contactCellCountryCode"]').val()=='01' ||  
	    		 $('input[name="consignee\\.contactCellCountryCode"]').val().length == 3){
	    	 $('input[name="consignee\\.contactCellAreaCode"]').select();
			  chkCellCountry =true;
	     }
	}); 
	$('input[name="consignee\\.contactCellAreaCode"]').focus(function(evt) {
		chkCellArea = true;
	});
	$('input[name="consignee\\.contactCellAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	$('input[name="consignee\\.contactCellAreaCode"]').val('');
	     }
	     if(($('input[name="consignee\\.contactCellAreaCode"]').val().length == 3 && isAmericanParty('consignee\\.contactCellCountryCode')) || 
	    		 $('input[name="consignee\\.contactCellAreaCode"]').val().length == 4){
	    	 $('input[name="consignee\\.contactCellExchange"]').select();
	     }
	}); 
	
	$('input[name="consignee\\.contactCellAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	      if(chkCellArea){
	    	 this.select();
	    	 chkCellArea = false;
	    	$('input[name="consignee\\.contactCellAreaCode"]').val('');
	     }
	});
	$('input[name="consignee\\.contactCellExchange"]').focus(function(evt) {
		chkCellExchange = true;
	});
	$('input[name="consignee\\.contactCellExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		 if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	$('input[name="consignee\\.contactCellExchange"]').val('');
	     }
	     if(($('input[name="consignee\\.contactCellExchange"]').val().length == 3 && isAmericanParty('consignee\\.contactCellCountryCode')) || 
	    		 $('input[name="consignee\\.contactCellExchange"]').val().length == 4 ){
	    	 $('input[name="consignee\\.contactCellStation"]').select();
	     }
	}); 
	
	$('input[name="consignee\\.contactCellExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	      if(chkCellExchange){
	    	 this.select();
	    	 chkCellExchange = false;
	    	$('input[name="consignee\\.contactCellExchange"]').val('');
	     }
	});
	
	$('input[name="consignee\\.contactCellStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="consignee\\.contactCellStation"]').val().length == 4){
	    	 $('input[name="consignee\\.contactCellExtension"]').focus();
	     }
	}); 
	//code to tab out in Cell fields
	var chkFaxCountry =true;
	var chkFaxArea = true;
	var chkFaxExchange = true;
	$('input[name="consignee\\.contactFaxCountryCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxCountry){
	    	 this.select();
	    	 chkFaxCountry = false;
	     }
		});
	$('input[name="consignee\\.contactFaxCountryCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('input[name="consignee\\.contactFaxCountryCode"]').val()=='1' || 
	    		 $('input[name="consignee\\.contactFaxCountryCode"]').val()=='01' ||  
	    		 $('input[name="consignee\\.contactFaxCountryCode"]').val().length == 3){
	    	 $('input[name="consignee\\.contactFaxAreaCode"]').select();
			 chkFaxCountry =true;
	     }
	}); 
	$('input[name="consignee\\.contactFaxAreaCode"]').focus(function(evt) {
		chkFaxArea = true;
	});
	$('input[name="consignee\\.contactFaxAreaCode"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $('input[name="shipper\\.contactFaxAreaCode"]').val('');
	     }
	     if(($('input[name="consignee\\.contactFaxAreaCode"]').val().length == 3 && isAmericanParty('consignee\\.contactFaxCountryCode')) || 
	    		 $('input[name="consignee\\.contactFaxAreaCode"]').val().length == 4){
	    	 $('input[name="consignee\\.contactFaxExchange"]').select();
	     }
	}); 
	
	$('input[name="consignee\\.contactFaxAreaCode"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $('input[name="consignee\\.contactFaxAreaCode"]').val('');
	     }
	});
	$('input[name="consignee\\.contactFaxExchange"]').focus(function(evt) {
		chkFaxExchange = true;
	});
	$('input[name="consignee\\.contactFaxExchange"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $('input[name="consignee\\.contactFaxExchange"]').val('');
	     }
	     if(($('input[name="consignee\\.contactFaxExchange"]').val().length == 3 && isAmericanParty('consignee\\.contactFaxCountryCode')) || 
	    		 $('input[name="consignee\\.contactFaxExchange"]').val().length == 4){
	    	 $('input[name="consignee\\.contactFaxStation"]').select();
	    }
	}); 
	
	$('input[name="consignee\\.contactFaxExchange"]').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $('input[name="consignee\\.contactFaxExchange"]').val('');
	     }
	});
	
	$('input[name="consignee\\.contactFaxStation"]').keyup(function(evt) {
		var theEvent = evt || window.event;
	 	var key = theEvent.keyCode || theEvent.which;
	 	if(key == '16' || key == '9' || key == '8' || key == '46')
	 		return;
	    if($('input[name="consignee\\.contactFaxStation"]').val().length == 4){
	   		$('input[name="consignee\\.contactFaxExtension"]').focus();
	    }
	}); 
	
});

function consigneeOrgPredictive()
{
	//var urlConsigneeOrg = _context + '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|'+$('#tradeCode').val();
	$('input[name="consignee\\.organizationName"]').gatesAutocomplete({
		//source : urlConsigneeOrg,
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
		formatItem : function(data) {
			$('input[name="consignee\\.organizationName"]').validationEngine('hidePrompt');
			$('input[name="consignee\\.organizationId"]').val("");
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			$('input[name="consignee\\.organizationName"]').validationEngine('hidePrompt');
			return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
		},
		select : function(data) {
			
			$('input[name="consignee\\.organizationName"]').validationEngine('hidePrompt');
			$('input[name="consignee\\.organizationName"]').val(
					data.name + "-" + data.abbr);
			$('#consigneeName').val(data.name);
			$('input[name="consignee\\.organizationId"]').val(data.id);
			$('input[name="consignee\\.organizationCode"]').val(data.abbr);
			consigneeId = data.id;
			
			
			$('input[name="consignee\\.isOneTimeCustomer"]').val(false);
			processShipperConsigneeColor("consignee");
		
			$('input[name="consignee\\.address"]').val("");
			$('input[name="consignee\\.address"]').trigger("change");
			
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
			$('#consigneeZipOverride').val("N");
		}
	});
}

function consigneeAddPredictive()
{
	//var urlConsigneeAdd = _context + '/cas/autocomplete.do?method=searchAddRoleBK&searchType=234&parentSearch='+ $('input[name="consignee\\.organizationId"]').val() + '|03|'+$('#tradeCode').val();
	
	$('input[name="consignee\\.address"]').gatesAutocomplete(
	{
		//source : urlConsigneeAdd,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
		 		 method: 'searchAddRoleBK',
		 		 searchType: '234',
		 		 parentSearch:  function() { return $('input[name="consignee\\.organizationId"]').val() + '|03|'+$('#tradeCode').val(); }
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
			var zip = data.zip;*/
			//var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			var nameQualifier = '';
			if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
				nameQualifier =data.nameQual+" - ";
			var finalAddress = nameQualifier+data.stAdd;
			return finalAddress;
		},
		select : function(data) {
			consigneeAddressPopulate(data);
		}
	});
}

function consigneeAddressPopulate(data){
	
	emptyContactDetails("consignee");
	emptyCityStateZip("consignee");
	
	/*var nameQualifier = data.nameQual;
	var city = data.city;
	var state = data.state;
	var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);*/
	var nameQualifier = '';
	if(data.nameQual!=undefined && data.nameQual!=null && data.nameQual!='null' && data.nameQual!='')
	{
		$('input[name="consignee\\.nameQualifier"]').val(data.nameQual);
		nameQualifier =data.nameQual+" - ";
	}
	else
		$('input[name="consignee\\.nameQualifier"]').val('');
	consigneeAddress = nameQualifier+data.stAdd;
	emptyCityStateZip("consignee");
	$('input[name="consignee\\.addressRoleId"]').val(data.addRole);
	if(data.coOrgName!=null && data.coOrgName!='null')
		$('input[name="consignee\\.careOf"]').val(data.coOrgName);
	else
		$('input[name="consignee\\.careOf"]').val('');
	$('input[name="consignee\\.countryName"]').val(data.cntry);
	$('input[name="consignee\\.provinceName"]').val(data.provnc);
	$('input[name="consignee\\.city"]').val(data.city);
	$('input[name="consignee\\.state"]').val(data.state);
	$('input[name="consignee\\.zip"]').val(data.zip);
	
	$('#refNumOverRideForConsignee').val("N");
	$('#isChangeAcceptedAfterUnitsReceived').val("N");
	
	isBookingChanged = "Y";
	
	processShipperConsigneeColor("consignee");
	checkAccordionHeaderForConsignee();
	checkCopyButtons();
	
	if($('#bookingTypeCode').val()=='B')
		checkForConsigneeTemplate();
	else
		requestForContactList("consignee");
	
	//addConsigneeAsDebtor();
	handlePrepaidCollectIndicator('C');
	removeBookingErrorPointers();
	$('#consigneeZipOverride').val("N");
}

function getTradeForTemplate() {
	var data ="";
	console.log('trade='+$('#tradeCode').val());
	if($('#tradeCode').val() != '') {
		data = $('#tradeCode').val() + "|";
	}
	return data;
}

function checkForConsigneeTemplate(){
	var isEdi = false;
	var ediText = $('#ediOrWebIndicator').html();
	if(ediText != null && ediText.indexOf("EDI") > -1) {
		isEdi = true;
	}
	
	if($("#bookingStatusCode").val()=='INCP' || $("#bookingStatusCode").val()==''){
		if($('input[name="consignee\\.address"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!=''){

			//do not show consignee templates if Shipper is present [ Defect - D023287 ] 
			if($('input[name="shipper\\.addressRoleId"]').val() != ''){
				requestForContactList("consignee");
				return;
			}
				

			if($('#bookingTemplateOwnerPartyType').val()=='03' || ($('#bookingTemplateId').val()=='' || $('#bookingTemplateId').val()==null)){
				//var data = prepareInputForCASTemplateScreen();
				//D031254 - make async : false - debtor was getting deleted due to async calls
				$.ajax({
					type : "POST",
					async : false,
					//url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="consignee\\.addressRoleId"]').val()+'|03|'+filterParamsForCASForTemplateValidation(),
					url : _context+'/cas/autocomplete.do?method=getTemplateCount&searchType=257&parentSearch='+$('input[name="consignee\\.addressRoleId"]').val()+'|03|'+getTradeForTemplate(),
					success : function(responseText) {
						var templateCount = responseText[0].totrec;
							if(templateCount==1){
								// D031918, don't apply template for EDI
								if(isEdi) {
									otherAlert("","Apply template on Edi Booking Details.");
								}
								//no quote details shoud be on page, even pulled quote should not be on page
								else if($('#quoteId').val()==''){
									if($('#bookingId').val()=='')
										templateUpdate(responseText[0].id,'consignee');
									else{
										var overRide = confirm("Booking data exists on screen. Confirm override.(Ok/Cancel)");
										if(overRide == true){
											templateUpdate(responseText[0].id,'consignee');
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
								requestForContactList("consignee");
							}else{
								requestForContactList("consignee");
							}
					}
				});
			}
			else{
				requestForContactList("consignee");
			}
		}
	}
	else{
		requestForContactList("consignee");
	}
}

function clearCityStateZip() {
	$('input[name="consignee\\.careOf"]').val('');
	$('input[name="consignee\\.nameQualifier"]').val('');
	$('input[name="consignee\\.city"]').val('');
	$('input[name="consignee\\.state"]').val('');
	$('input[name="consignee\\.zip"]').val('');
	$('input[name="consignee\\.countryName"]').val('');
	$('input[name="consignee\\.provinceName"]').val('');
}

/**
 * This method calls consignee lookup and passes it necessary arguments.
 * */
function consigneePopupSearch() {
	orgCaller = 'consignee';
	var consigneeName = $('input[name="consignee\\.organizationName"]').val();
	var splitconsigneeName = "";
	var actionUrl = "";
	if(consigneeName.indexOf("-") > 0){
		splitconsigneeName = consigneeName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+encodeURIComponent(splitconsigneeName[0])
		+'|' + $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitconsigneeName[1]);
	}else{
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ encodeURIComponent(consigneeName) + '|' + $('#tradeCode').val() + '|BK'/*+'|'+$('#customerGroupId').val()*/;
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

/**
 * consignee address pop-up search
 * */
function consigneeAddressPopupSearch() {
	orgCaller = 'consignee';
	
	if ($.trim($('input[name="consignee\\.organizationId"]').val())=='') { 
		alert("Please select organization first");
	}/*else if($('#tradeCode :selected').val()==''){
		alert("Please select Trade");
	}*/else {
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('input[name="consignee\\.organizationId"]').val()) + '&filterValue2=03'+'&filterValue3='+$('#tradeCode').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}

/**
 * consignee address method called by CAS, after look-up.
 * */
//function addroleUpdate(data) {}


function loadAdditionalConsigneeDetails(responseText){
	$("#consigneeId").val(responseText.data.consignee.organizationId);
	$('#consignee\\.addressRoleId').val(responseText.data.consignee.addressRoleId);
	
	/*if(null!=responseText.data.consignee.addressRoleId){
		enableDisableContactId('consignee',false);
	}*/

	setConsigneeCommMethodValue(responseText.data.consignee);
	//first clear the drop down
	$('select[name="consignee\\.contactId"]').children().remove();
	$('select[name="consignee\\.contactId"]').append("<option value='' label='Select'></option>");
	$.each(responseText.data.consignee.contactList, function(key, value) {
		$('select[name="consignee\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	
	$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
	
	//$('select[name="consignee\\.contactId"]').attr('selectedIndex', 0);

	/*if(responseText.data.consignee.isCustomerOneTimeCust==true){
		formatColorForOneTime('consignee');
	}*/
}

function addConsigneeAsDebtor(){
	blockUI();
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url : _context +"/booking/party/checkDefaultNotifyParty",
		type : "POST",
		data : queryString,
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			
			console.log("has default?"+responseText.data.hasDefault);
			var hasDefault = responseText.data.hasDefault;
			var hasNotifyParty = responseText.data.hasNotifyParty;
			
			if(hasDefault == 'skip' ) {
				setDefaults('skip', queryString);
			} else {
				var buttons = new Array();
				
				if(hasNotifyParty == 'true') {
					buttons.push({
						text : "Retain Notify",
						click : function() {
							setDefaults('retain',queryString);
							$("#notifyPartyOverrideDialog").dialog("close");
						}
					});
				}
				
				if(hasDefault == 'true') {
					buttons.push({
						text : "Use CP Default Notify",
						click : function() {
							setDefaults('cp',queryString);
							$("#notifyPartyOverrideDialog").dialog("close");
						}
					});
				}
				
				if(hasNotifyParty == 'true') {
					buttons.push({
						text : "Remove Notify",
						click : function() {
							setDefaults('remove', queryString);
							$("#notifyPartyOverrideDialog").dialog('close');
						}
					} );
				}
				
				if(hasNotifyParty == 'true') {
					$.unblockUI();
					
					$("#notifyPartyOverrideDialog").dialog("option", "buttons",buttons);
					$("#notifyPartyOverrideDialog").show();
					$("#notifyPartyOverrideDialog").dialog('open');
				} else {
					setDefaults('cp', queryString);
				}
			}
			
			
			
		}
	
	
		
	
	});
	
	
}

function setDefaults(action, queryString) {
	blockUI();
	$.ajax({
		url : _context +"/booking/party/setDefaults",
		async: false,
		type : "POST",
		data : queryString+"&type=consignee&oper=add&action="+action,
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			
			/*if($('input[name="shipper\\.addressRoleId"]').val()!='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('B');//both
			else if($('input[name="shipper\\.addressRoleId"]').val()=='' && $('input[name="consignee\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('C');//consignee
			
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
			$.unblockUI();
		}
	});
	
}

function removeConsigneeAsDebtor(){
	
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		url : _context +"/booking/party/setDefaults",
		type : "POST",
		data : queryString+"&type=consignee&oper=remove&action=skip",
		success : function(responseText) {
			showResponseMessages('msgDiv', responseText);
			/*if($('input[name="shipper\\.addressRoleId"]').val()!='')
				$('#prepaidCollectCode').val('P');
			else
				$('#prepaidCollectCode').val('');
				
			debtorCode = $('#prepaidCollectCode :selected').val();
			setPartiesHeader();*/
			$("#gridIdForParties").trigger("reloadGrid");
		}
	});
}

function setConsigneeDivName(name){
	if(name != null && name != ''){
		setAccordianTabDetails("consigneeNameDiv", " - " + name);
	}else{
		setAccordianTabDetails("consigneeNameDiv", "");
	}
}

function checkAccordionHeaderForConsignee()
{
	if($('input[name="consignee\\.addressRoleId"]').val()!='')
		setAccordianTabDetails("consigneeNameDiv", " - "+$('input[name="consignee\\.organizationName"]').val());
	else
		setAccordianTabDetails("consigneeNameDiv", "");
}

var somethingChanged =false;
var invoiceChanged = false;
$(document).ready(function() {
	 tabSequence('#detentionBillingForm');
	
	 var oldVal=$('#detentionBillingId').val();
	
	 if($('#trucker').val()!=""){
		 $('#truckerTemp').val($('#trucker').val());
		 var truckerAndCode=$('#trucker').val();
		 var tokens=truckerAndCode.split("-");
		// $('#trucker').val(tokens[1]+"-"+tokens[0]);
		
	 }
		
	 $('input').change(function() { 
			somethingChanged = true; 
	   }); 
	
	 $('textarea').change(function() { 
	        somethingChanged = true; 
	   }); 
	 
	 $('img').click(function() { 
	        somethingChanged = true; 
	   }); 
	 
	 $('select').change(function() { 
	        somethingChanged = true; 
	   });
	 document.getElementById("detentionBillingId").focus();
	 
	 $('#outgateEmpty').attr("disabled","disabled");
	 $('#outgateFull').attr("disabled","disabled");
	 
	 if( $("#issuedDateDiv").text()=='01-01-0001'){
		 $("#issuedDateDiv").text("");
	 }
		  
		 
		 
	 $('#cancelCorrection').attr("disabled","disabled");
	 $('#correctDetention').removeAttr("disabled");
	 //$('#detentionBillingSave').attr("disabled","disabled");//Defect-21222
	setDivNames();
	setScreenDetails();
	// disable bill to Shipment and bill to trucker is status is ISSD
	toggleShipmentTrucker($("#statusCode").val());

	var statusCode=$("#statusCode").val();
	var currVersion= $("#currentRevisionNumber").val();
	var selectedVersion= $("#versionCode").val();
	var selectedInvoicePosition = $("#detentionMaintInvoicePosition").val();
	var invoiceListSize = $("#detentionMaintInvoiceListSize").val();
	//alert("selectedInvoicePosition:"+selectedInvoicePosition+", invoiceListSize:"+invoiceListSize);
	
	// If current version is different then selected version then disable save button
	if(!(currVersion==selectedVersion)){
		$('#containerSave').attr("disabled","disabled");
	}

	// BR2.	Correction is only allowed for the latest revision of the invoice and the 
	// status of the latest revision must be ‘ISSD’
	toggleCorrectDetention(statusCode,selectedVersion,currVersion);
	
	// BR29 
	toggleCancelCorrection(statusCode,selectedVersion);
	
	//Maintain Status
	
	toggleReadyToIssue(statusCode);
	
	toggleRevertToPending(statusCode);

	toggleCancelBill(statusCode,selectedVersion);
	
	togglePrint(statusCode,selectedVersion,currVersion);
	
	togglePrintDetention(statusCode);
	
	//selectBillTO($("#partyToShipment").val(),$("#trucker").val());
	selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
	toggleEditableFields(statusCode);
	if(selectedInvoicePosition!=null && selectedInvoicePosition!='' && selectedInvoicePosition!='null'){
		if(selectedInvoicePosition==0){
			$('#fetchPrevDetentionInfo').attr("disabled","disabled");
			if(invoiceListSize!=null && selectedInvoicePosition==(invoiceListSize-1)){
				$('#fetchNextDetentionInfo').attr("disabled","disabled");
			}
		}
		else if(invoiceListSize!=null && selectedInvoicePosition==(invoiceListSize-1)){
			$('#fetchNextDetentionInfo').attr("disabled","disabled");
		}
		else{
			$('#fetchPrevDetentionInfo').removeAttr("disabled");
			$('#fetchNextDetentionInfo').removeAttr("disabled");
		}
	}
	else{
		$('#fetchPrevDetentionInfo').attr("disabled","disabled");
		$('#fetchNextDetentionInfo').attr("disabled","disabled");
	}
	
	 var partyToShiptChecked=$('#billTOshipment').is(':checked');
	
	 $('#isPartyToShipmentChecked').val(partyToShiptChecked);
	 $('#billTOshipment').click(function() {
		 getOrgAddress($('#partyToShipmentArolID').val());
		$('#detentionBillingSave').removeAttr("disabled");
	});
	$('#billTOtrucker').click(function() {
		var isPartyToShipmentChecked=$('#isPartyToShipmentChecked').val();
		//alert("billTOtrucker clicked, isPartyToShipmentChecked:"+isPartyToShipmentChecked+",trucker:"+$("#trucker").val());
		if($("#trucker").val()!=""){
			$('#detentionBillingSave').removeAttr("disabled");
			getOrgAddress($('#truckerOrgId').val());
		}else{
			 $('#billTOtrucker').attr('checked', false);	
			 $('#billTOshipment').attr('checked', isPartyToShipmentChecked);	 
		}
	
	});
	 $('#billTOother').click(function() {
		 getOrgAddress($('#otherPartyArolId').val());
		$('#detentionBillingSave').removeAttr("disabled");
	});	
	
	//// $('#truckerOrgId').val("");
	// Detention Billing Save
	$('#detentionBillingSave').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
			    
				var detentionBilling = $('#detentionBillingForm').formSerialize();
				var urlStr = '';
				urlStr = _context + "/detentionBilling/save";
				$.ajax({
					type : "POST",
					url : urlStr,
					data : detentionBilling,
					success : function(responseText) {
						
						showJSONContainerForSave(responseText);
						$('#msgDiv').show();
						showResponseMessages("msgDiv", responseText);
						$('#detentionBillingSave').removeAttr("disabled");
						$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
						$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
						var amt = parseFloat(responseText.data.billAmount);
						$("#amountChargesDiv").text(amt.toFixed(2));
						// if party to shipment has some value then enable the radio button.    
						//selectBillTO($("#partyToShipmentArolID").val(),$("#truckerOrgId").val());
						if(responseText.messages.success.length > 0){
							$('#detentionBillingSave').prop("disabled",false);//21222
						}
						if( responseText.data.billTO=='T'){
							 $("#partyToShipmentDiv").val("");
							 $("#partyToShipment").val("");
							 responseText.data.partyToShipment='';
							 responseText.data.partyToShipmentArolID='';
							 $("#otherParty").val("");
							 responseText.data.otherParty='';
							 responseText.data.otherPartyArolID='';
						}
						////$('#truckerOrgId').val("");
						$('#truckerFromArolLookup').val("");
						 somethingChanged = false; 
						 
						 if($('#detentionBillingId').val()==null) {
								$('#commentsDiv').hide();
							}
							else {
								if($('#detentionBillingId').val().trim()=='') {
									$('#commentsDiv').hide();
								}
								else {
									$('#commentsDiv').show();
									var args = {
											entityType: 'DTBL',
											entityId: $('#detentionBillingId').val(),
											commentId:  'commentId',
											displayCommentTypes:"DTBL"
										};
									$("#comment_link").comments(args);
								}
							}
					}
				});
				$('#msgDiv').show();
			}
	});
	
	// Ready to Issue
	$('#readyToIssueDetentionBill').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
			 $("#readyToIssue").val(true);
			 $("#cancelBill").val(false);
			 $("#revertToPending").val(false);
			//if ($('#detentionBillingSave').attr("disabled")=="disabled") {
					    $('#msgDiv').show();
						var detentionBilling = $('#detentionBillingForm').formSerialize();
						var urlStr = '';
						urlStr = _context + "/detentionBilling/updateStatus";
						$.ajax({
							type : "POST",
							url : urlStr,
							data : detentionBilling,
							success : function(responseText) {
								showResponseMessages("msgDiv", responseText);
								$("#statusCode").text(responseText.data.statusCode); 
								$("#statusCode").text(responseText.data.statusCode);
								$("#statusCode").val(responseText.data.statusCode);
								$("#statusCodeDescDiv").text(responseText.data.statusCodeDesc); 
								// success means status changed to RATD.Enable "Revert to pending" button 
								//and disable "Ready to Issue" button.
								selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
								toggleReadyToIssue(responseText.data.statusCode);
								toggleRevertToPending(responseText.data.statusCode);
								 somethingChanged = false;
								}
							});
				$('#msgDiv').show();
			 //}//else{21222
				 //alert("Data in the screen has changed. Please press calculate/Save button before issuing the bill.");
			 //}	
			}
	});
	
	// Cancel Bill
	$('#cancelDetentionBill').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
				 $("#readyToIssue").val(false);
				 $("#cancelBill").val(true);
				 $("#revertToPending").val(false);
				    $('#msgDiv').show();
					var detentionBilling = $('#detentionBillingForm').formSerialize();
					var urlStr = '';
					urlStr = _context + "/detentionBilling/updateStatus";
					$.ajax({
						type : "POST",
						url : urlStr,
						data : detentionBilling,
						success : function(responseText) {
							showResponseMessages("msgDiv", responseText);
							 $("#statusCode").text(responseText.data.statusCode);
							 $("#statusCode").val(responseText.data.statusCode);
							
							 $("#statusCodeDescDiv").text(responseText.data.statusCodeDesc);
							 $('#cancelCorrection').attr("disabled","disabled");
							 //$('#revertToPendingDetentionBill').attr("disabled","disabled");
							 $('#cancelDetentionBill').attr("disabled","disabled");
							 $('#readyToIssueDetentionBill').attr("disabled","disabled");
							 $('#revertToPendingDetentionBill').removeAttr("disabled");
							 toggleShipmentTrucker(responseText.data.statusCode);
							 selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
							 $('#detentionBillingSave').attr("disabled","disabled");
							 toggleEditableFields(responseText.data.statusCode);
							 
						}
					});
					$('#msgDiv').show();
			}
	});
	
	// Correct Bill
	$('#correctDetention').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
				    $('#msgDiv').show();
				    var count = 0;
				    var dropdownLength=0;
					var detentionBilling = $('#detentionBillingForm').formSerialize();
					var urlStr = '';
					urlStr = _context + "/detentionBilling/correctBill";
					$.ajax({
						type : "POST",
						url : urlStr,
						data : detentionBilling,
						success : function(responseText) {
							showJSONContainer(responseText);
							showResponseMessages("msgDiv", responseText);
							$("#versionCode").val(responseText.data.currentRevisionNumber);
							$("#versionCode").get(0).options.length = 0;
							// Set the new drop down list 
							dropdownLength=responseText.data.versionList.length;
							$.each(responseText.data.versionList, function() 
							{
								$("#versionCode").get(0).options[$("#versionCode").get(0).options.length] = new Option(responseText.data.versionList[count]);
								count++;
							});
							// Select the correct value in the drop down
							for (var i=0; i<document.getElementById('versionCode').options.length; i++)
						     {
						      if ( document.getElementById('versionCode').options[i].value == dropdownLength )
						      {
						    	  document.getElementById('versionCode').options[i].selected = true;
						       isFound = true;
						      }
						     }
							var statusCode=$("#statusCode").val();
							var currVersion= $("#currentRevisionNumber").val();
							var selectedVersion= $("#versionCode").val();
							toggleCancelBill(statusCode,selectedVersion);
							toggleCancelCorrection(statusCode,selectedVersion);
						}
					});
					$('#msgDiv').show();
			}
	});
	
	
	// revert To Pending
	$('#revertToPendingDetentionBill').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
			 $("#readyToIssue").val(false);
			 $("#cancelBill").val(false);
			 $("#revertToPending").val(true);
					    $('#msgDiv').show();
						var detentionBilling = $('#detentionBillingForm').formSerialize();
						var urlStr = '';
						urlStr = _context + "/detentionBilling/updateStatus";
						$.ajax({
							type : "POST",
							url : urlStr,
							data : detentionBilling,
							success : function(responseText) {
								showResponseMessages("msgDiv", responseText);
								$("#statusCode").text(responseText.data.statusCode); 
								$("#statusCode").val(responseText.data.statusCode); 
								$("#statusCodeDescDiv").text(responseText.data.statusCodeDesc);
								$("#pendingTimestampDiv").text(responseText.data.pendingTimestamp);
								
								// success means status changed to PEND.Disable "Revert to pending" button 
								// and enable "Ready to Issue" button.
								toggleReadyToIssue(responseText.data.statusCode);
								toggleRevertToPending(responseText.data.statusCode); 
								
								var selectedVersion= $("#versionCode").val();
								var statusCode=responseText.data.statusCode;
								toggleCancelBill(statusCode,selectedVersion);
								toggleShipmentTrucker(statusCode);
								toggleEditableFields(statusCode);
								selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
							}
						});
						$('#msgDiv').show();
			}
	});
		
	
	
	// Cancel Correction
	$('#cancelCorrection').click(function() {
		 if (!$("#detentionBillingForm").validationEngine('validate') ) {
			 return;
		 } else {
				 var r=confirm("Are you sure you want to delete the Revision ?");
				 if (r==true)
				  {
					    $('#msgDiv').show();
						var detentionBilling = $('#detentionBillingForm').formSerialize();
						var urlStr = '';
						 var count = 0;
						urlStr = _context + "/detentionBilling/cancelCorrection";
						$.ajax({
							type : "POST",
							url : urlStr,
							data : detentionBilling,
							success : function(responseText) {
								showResponseMessages("msgDiv", responseText);
								showJSONContainer(responseText);
								dropdownLength=responseText.data.versionList.length;
								// Set the new drop down list 
								$("#versionCode").get(0).options.length = 0;
								$.each(responseText.data.versionList, function() 
								{
									$("#versionCode").get(0).options[$("#versionCode").get(0).options.length] = new Option(responseText.data.versionList[count]);
									count++;
								});
								// Select the correct value in the drop down  
								for (var i=0; i<document.getElementById('versionCode').options.length; i++)
							     {
							      if ( document.getElementById('versionCode').options[i].value == dropdownLength )
							      {
							    	  document.getElementById('versionCode').options[i].selected = true;
							       isFound = true;
							      }
							     }
								var statusCode=$("#statusCode").val();
								var currVersion= $("#currentRevisionNumber").val();
								var selectedVersion= $("#versionCode").val();

								toggleCancelBill(statusCode,selectedVersion);
								toggleCancelCorrection(statusCode,selectedVersion);
							
							}
						});
						$('#msgDiv').show();
				  }
			}
	});
	
	if($("#partyToShipment").val()==""){
		$('#billTOshipment').attr("disabled","disabled");
	}
	
	if($("#trucker").val()==""){
		$('#billTOtrucker').attr("disabled","disabled");
	}
	if($("#otherParty").val()==""){
		$('#billTOother').attr("disabled","disabled");
	}
	
	// code to bind  address role pop up search
	 $("#partyToShipment").gatesPopUpSearch({func : function() {
		 addrsRolePopupSearch();
	 }
	 });

	
	$('#detentionExit').click(function(){
			if (somethingChanged) {
				 var r=confirm("Data in the screen has changed. Press OK if you want to exit. Press cancel if you do not want to exit.");
				 if (r==true)
				  {
					 document.location.href = _context + "/cas/detentionBillingSearch.do?source=OTHER";
				  }
			}
			else
			 {
				 document.location.href = _context + "/cas/detentionBillingSearch.do?source=OTHER";
			 }
	});
	
	//Display existing booking
	$('#fetchDetentionInfo').click(function(){
			displayDetentionDtls();
    });	
	$('#fetchPrevDetentionInfo').click(function(){
		//displayPrevNextDetentionDtlsTest("prev",invoiceListSize,selectedInvoicePosition-1);
		displayPrevNextDetentionDtls("prev");
	});
	$('#fetchNextDetentionInfo').click(function(){
		//displayPrevNextDetentionDtlsTest("next",invoiceListSize,selectedInvoicePosition+1);
		displayPrevNextDetentionDtls("next");
	});
	
	// Trucker
	/*$('#trucker').gatesAutocomplete({
		source: orgurl,
		source:_context+'/cas/autocomplete.do',
		name: 'Trucker',
	 	extraParams: {
		 		 method: 'searchOrgForQT',
		 		 searchType: '206'		 		
	 	},
		formatItem: function(data) {
			return data.code+"-"+data.name;
		},
		formatResult: function(data) {
			return data.name;
		},
		
			select: function(data) {
			$('#orgId').val(data.id);
		}
	});*/
	
	
	//code for Trucker name predictive
	$('#trucker').gatesAutocomplete({
		 source:  _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 		 method: 'searchVendor',
		 		 		 searchType: '313',
		 		 	 },		
		 formatItem: function(data) {
		 	return data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
			 // return data.orgn_name+"-"+data.orgn_code;
		 },
		 formatResult: function(data) {
			 $('#truckerTemp').val(data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode);
		 	  return data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
			 // return data.orgn_name+"-"+data.orgn_code; before changing seq
			// return data.orgn_code+"-"+data.orgn_name;
		 },
		 select: function(data) {	
			 $('#in_organization_id').val(data.orgn_Id);
		 	 $('#in_using_orgn_id').val(data.using_OrgnId);	
		 	 $('#IN_ADDRESS_INFO').removeAttr("disabled");
			 $('#IN_ADDRESS_INFO').val("");
			 $('#IN_ADDRESS_ROLE_ID').val('ALL');
			// Get Arol Lookup in Trucker Autocomplete
			// addressRolePopupSearch();
			 
			  //organizationPopupSearch();
			 if(data.carrierCode!='' && data.carrierCode!='undefined' && data.carrierCode!=undefined){		 			
				 $('#truckerOrgId').val(data.arol_Id);
				 enableSave();
		 		}
		 },
		 onBlur:function()
		 {
			if($('#trucker').val()=="") 
				{
					if($("#billTOtrucker").is(':checked')){
						$("#orgTextDiv").text('');
						$("#addressLine1TextDiv").text('');
						$("#addressLine2TextDiv").text('');
					}
					$('#truckerTemp').val('');
					$('#in_organization_id').val('');
					
					$('#detentionBillingSave').attr("disabled",true);
				}
		 }
	});	
	
	$('#trucker').gatesPopUpSearch({func:function() {
		// Get Trucker Lookup 
		organizationPopupSearch();
		}
	});
	//other party
	 $('#otherParty').gatesAutocomplete(
				{
					source : _context
					+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK',
					formatItem : function(data) {
						return data.name + "-" + data.abbr;
					},
					formatResult : function(data) {
						return data.name + "-" + data.abbr;
					},
					select : function(data) {

						//$('#in_debtor_name').attr("value",data.name + "-" + data.abbr);
						$('#otherPartyOrgId').attr("value", data.id);
					//	$('#organizationAddress').attr("value", "");
						//$('#in_debtor_address').removeAttr("disabled");
						
						singleFwdrAddressSelect();
					},
					 onBlur:function()
					 {
						if($('#otherParty').val()=="") 
							{
								$('#otherPartyArolId').val('');
								if($("#billTOother").is(':checked')){
									$("#orgTextDiv").text('');
									$("#addressLine1TextDiv").text('');
									$("#addressLine2TextDiv").text('');
								}	
								 $('#billTOother').attr("disabled","disabled");
								  $('#billTOother').attr('checked', false);
								$('#detentionBillingSave').attr("disabled",true);
							}
					 }
				});
	 
		function singleFwdrAddressSelect(){
			
			$.ajax({
				type : "POST",
				url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+$('#otherPartyOrgId').val(),						
			
				success : function(responseText) {
					
					if(responseText.length == 1){
						var finalAddress =responseText[0].orgName+"-"+responseText[0].city+"-"+responseText[0].nameQual+"-"+responseText[0].state+"-"+responseText[0].stAdd;
						$('#otherParty').attr("value",finalAddress);
						$('#otherPartyArolId').attr("value",responseText[0].addRole);
						
					} else {
						
						addressRolePopupSearchOther();
				}
					
				}
			});
			}		 
	
		// code to bind pop up search
		$('#otherParty').gatesPopUpSearch({func:function() {organizationPopupSearchOther()}});		
		
			
	// invoice
	$('#detentionBillingId').gatesAutocomplete({
		
		 source:  _context+'/cas/autocomplete.do',
		 name: 'Invoice',
		 extraParams: {
		 		 		 		 method: 'searchInvoiceNbr',
		 		 		 		 searchType: '361',
		 		 		 		
		 		 		 },
		 formatItem: function(data) {
			 dataName=data.nbr;
		 		 return data.nbr;
		 },
		 formatResult: function(data) {
		 		 return data.nbr;
		 },
		 select: function(data) {
			 	//alert("Invoice number has changed.");
		 		$('#detentionBillingId').val(data.nbr);
		 		getRevision(data.nbr);
		 }		 
	});
	
	$('#versionCode').change(function(){
		//alert("Version number has changed.");
	});
		// free days updated
	var freeDaysOldval=$('#freeDays').val();
	$('#freeDays').blur(function(){
		if( $('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== "" && $('#billingIngateDate').val() == "" && $('#rateAmount').val()==""){
			$("#freeTimeEndDateDiv").text("");
			$("#detentionDaysChargesDiv").text("");
			$("#amountChargesDiv").text("");
		}else if($('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== ""){
			$("#freeTimeEndDateDiv").text("");
		}
		else{
			var success= true;
			if($('#freeDays').val() != "") {
				   var value = $('#freeDays').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				   var intRegex = /^([0-9]*)$/;
				   if(!intRegex.test(value)) {
				       //alert('Only Numeric value allowed');
				       $('#freeDays').val(freeDaysOldval);
				       success = false;
				   }
				} else {
				   success = false;
				}
			 if(success!=false){	
						enableSave();
						//$(this).change();
						if ($('#freeDays').val() != ""){
							if ($("#detentionBillingForm").validationEngine('validate')) {	
							var detentionBilling = $('#detentionBillingForm').formSerialize();
							$.ajax({
								type : "POST",
								url : "/gates/detentionBilling/recalculate",
								data : detentionBilling,
							  	success : function(responseText) {
									
									if (responseText.success == true) {
									}
									showResponseMessages("msgDiv", responseText);
									$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
									$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
									   var amt = parseFloat(responseText.data.billAmount);
									    $("#amountChargesDiv").text(amt.toFixed(2));
								}
							});
						}	
					}
			 }
		}	 
}); 
	
	
	// detentionBillingId blur
	$('#detentionBillingId').blur(function(){
		var oldValues=$('#detentionBillingIdOld').val();
		//alert(oldValues);
		if($('#detentionBillingId').val() != ""){
			
		}else{
			if(oldValues!=""){
				document.location.href = _context + "/detentionBilling/showForm";
			}
			
		}
	}); 
	// Billing outgate date 
	$('#billingOutgateDate').blur(function(){
		if( $('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== "" && $('#billingIngateDate').val() == "" && $('#rateAmount').val()==""){
			$("#freeTimeEndDateDiv").text("");
			$("#detentionDaysChargesDiv").text("");
			$("#amountChargesDiv").text("");
		}else if($('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== ""){
			$("#freeTimeEndDateDiv").text("");
		}
		
		else{
			enableSave();
			$(this).change();
			if ($('#billingOutgateDate').val() != ""){
				if ($("#detentionBillingForm").validationEngine('validate')) {	
				var detentionBilling = $('#detentionBillingForm').formSerialize();
				$.ajax({
					type : "POST",
					url : "/gates/detentionBilling/recalculate",
					data : detentionBilling,
				  	success : function(responseText) {
						if (responseText.success == true) {
						}
						showResponseMessages("msgDiv", responseText);
						$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
						$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
						   var amt = parseFloat(responseText.data.billAmount);
						    $("#amountChargesDiv").text(amt.toFixed(2));
					}
				});
			}	
		}
	}		
}); 
	
	// calender radio clicked
	$('#calendar').click(function(){
		enableSave();
			if ($("#detentionBillingForm").validationEngine('validate')) {	
			var detentionBilling = $('#detentionBillingForm').formSerialize();
			$.ajax({
				type : "POST",
				url : "/gates/detentionBilling/recalculate",
				data : detentionBilling,
			  	success : function(responseText) {
					if (responseText.success == true) {
					}
					showResponseMessages("msgDiv", responseText);
					$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
					$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
					   var amt = parseFloat(responseText.data.billAmount);
					    $("#amountChargesDiv").text(amt.toFixed(2));
				}
			});
		}	
}); 
	
	// working radio clicked
	$('#working').click(function(){
		enableSave();
			if ($("#detentionBillingForm").validationEngine('validate')) {	
			var detentionBilling = $('#detentionBillingForm').formSerialize();
			$.ajax({
				type : "POST",
				url : "/gates/detentionBilling/recalculate",
				data : detentionBilling,
			  	success : function(responseText) {
					
					if (responseText.success == true) {
					}
					showResponseMessages("msgDiv", responseText);
					$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
					$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
					   var amt = parseFloat(responseText.data.billAmount);
					    $("#amountChargesDiv").text(amt.toFixed(2));
				}
			});
		}	
}); 	
	// Billing in gate date 
	$('#billingIngateDate').blur(function(){
		if( $('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== "" && $('#billingIngateDate').val() == "" && $('#rateAmount').val()==""){
			$("#freeTimeEndDateDiv").text("");
			$("#detentionDaysChargesDiv").text("");
			$("#amountChargesDiv").text("");
		}
		else if ($('#billingIngateDate').val() == ""){
			$("#detentionDaysChargesDiv").text("");
			$("#amountChargesDiv").text("");
		}
		
		else{
				enableSave();
				if ($('#billingIngateDate').val() != ""){
					if ($("#detentionBillingForm").validationEngine('validate')) {	
					var detentionBilling = $('#detentionBillingForm').formSerialize();
					$.ajax({
						type : "POST",
						url : "/gates/detentionBilling/recalculate",
						data : detentionBilling,
					  	success : function(responseText) {
							
							if (responseText.success == true) {
							}
							showResponseMessages("msgDiv", responseText);
							$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
							$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
							   var amt = parseFloat(responseText.data.billAmount);
							    $("#amountChargesDiv").text(amt.toFixed(2));
		
						}
					});
				}	
			}
		}			
}); 

	
	// Billing in rate
	//var oldamount=parseFloat(document.detentionBillingForm.rateAmount.value);
	var oldval=$('#rateAmount').val();
	$('#rateAmount').blur(function(){
		if( $('#freeDays').val()=="" &&  $('#billingOutgateDate').val()== "" && $('#billingIngateDate').val() == "" && $('#rateAmount').val()==""){
			$("#freeTimeEndDateDiv").text("");
			$("#detentionDaysChargesDiv").text("");
			$("#amountChargesDiv").text("");
		}else if ($('#rateAmount').val()==""){
			$("#amountChargesDiv").text("");
		}
		
		else{
			var success= true;
			if($('#rateAmount').val() != "") {
				   var value = $('#rateAmount').val().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
				   var intRegex = /^([0-9]*|\d*\.\d{1,2}?)$/;
				   if(!intRegex.test(value)) {
				     //  alert('Only Numeric value allowed');
				       $('#rateAmount').val(oldval);
				       success = false;
				   }
				} else {
				   success = false;
				}
			 var amt = parseFloat($('#rateAmount').val());
			    $("#rateAmount").text(amt.toFixed(2));
			 if(success!=false){
					enableSave();
					if ($('#rateAmount').val() != ""){
						if ($("#detentionBillingForm").validationEngine('validate')) {	
						var detentionBilling = $('#detentionBillingForm').formSerialize();
						$.ajax({
							type : "POST",
							url : "/gates/detentionBilling/recalculate",
							data : detentionBilling,
						  	success : function(responseText) {
								if (responseText.success == true) {
								}
								showResponseMessages("msgDiv", responseText);
								$("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
								$("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
								var amt = parseFloat(responseText.data.billAmount);
								$("#amountChargesDiv").text(amt.toFixed(2));
							}
						});
					}	
				}
			 }		
			
		}	
}); 
	
	
	$('#printDetention').click(function(){
		var queryString = $('#detentionBillingForm').formSerialize();
		window.open(_context+'/detentionBilling/printdocument?'+queryString);
});
	
	//Shipment Security


	
 enforceSecurityTitle(isMaintainDetentionBillingDisplayOnly);
 enforceSecurityDivAndButtons('content', isMaintainDetentionBillingDisplayOnly);
 enforceSecurityDivAndButtons('buttondiv', isMaintainDetentionBillingDisplayOnly);
 
 enforceSecurityDivAndButtons('detentionBillingSave', isMaintainDetentionBillingUpdate);
 enforceSecurityDivAndButtons('revisionHistory', isDetentionBillingRevisionHistory);
 enforceSecurityDivAndButtons('printDetention', isMaintainDetentionBillingPrint);
 enforceSecurityDivAndButtons('correctDetention', isMaintainDetentionBillingCorrect);
 enforceSecurityDivAndButtons('cancelCorrection', isMaintainDetentionBillingCancelCorrect);
 enforceSecurityDivAndButtons('cancelDetentionBill', isMaintainDetentionBillingCancelBill);
 enforceSecurityDivAndButtons('readyToIssueDetentionBill', isMaintainDetentionBillingReadyToIssue);

 enforceSecurityDivAndButtons('revertToPendingDetentionBill', isMaintainDetentionBillingRevertToPending);
 
});
popupName = null;
function addressRolePopupSearch() 
{
	// Get a list of Arols for the organization id received from Trucker Autocomplete.Fetch TruckerArol in addroleUpdate(id) function.
	popupName = "truckerPopup";
	if($('#in_organization_id').val()!=0){
		enableSave();
	
		$('#truckerFromArolLookup').val("true");
		$('#truckerOrgId').val("");
			var actionUrl =  _context + '/cas/addRoleBKLookup.do?filterValue1='+$('#in_organization_id').val()+ '&filterValue2=03';
			//var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='+ $('#organizationId').val() + '&filterValue2=03'+'&filterValue3=';
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'AddressSearch', windowStyle);		
		}
}
function setScreenDetails() {
	$("#billingOutgateDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#billingIngateDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
}

function organizationPopupSearch() {
	// Get a list of Arols for the organization id received from Trucker look up.Fetch TruckerArol in orgnSearchUpdateTo(id) function.
	// For prefilling the look up get the data from truckerTemp peoperty.
	
	setTimeout(function(){
	var vendor =$('#truckerTemp').val();
   // var orgnId ='ALL';
	var orgnId=$('#in_organization_id').val();
    if(vendor=='ALL')
    	{
    		vendor="";
    	}
    var actionUrl = _context+"/cas/detentionTrkrLookUp.do?vendor="+vendor+"|orgnId="+orgnId+'&triggerSearch=Y';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'VendorSearch', windowStyle); 
	},100);

}

/*function truckerUpdate(id){
	var values = id.split("|");
	if(values[2]!=''){
		$('#trucker').val(values[2] + "-" + values[1]);	
	}else{
		$('#trucker').val(values[1]);
	}
	$("#truckerOrgId").val(values[8]);
	$('#billTOtrucker').removeAttr("disabled");
	 if($("#partyToShipment").val()==""){
		 $('#billTOtrucker').attr('checked', true);
	 }
	enableSave();
}*/

function orgnSearchUpdateTo(id){
	
	var values = id.split("|");	
	var orgnID=values[0];
	var code = values[1].split("-");
	var truckerValue="";
	orgnName = code[0];
	orgnCode = code[1];
	if(values[2]!="null")
		{
			carrierCode = values[2];
		}
	else
		{
		carrierCode ="";
		}
	arolid = values[3];
	$('#in_organization_id').val(orgnID);
	// Get trucker code, name and carrier code in truckerTemp property .
	// This will be later used in Trucker lookup to prefill the lookup
	$('#truckerTemp').val(values[1] + "-" + values[2]);
	$('#trucker').val(values[1]);
	var truckerAndCode=$('#trucker').val();
	var tokens=truckerAndCode.split("-");
	/*if(tokens[1].length < tokens[0].length){
		$('#trucker').val(tokens[1]+"-"+tokens[0]);
	}*/
	if(carrierCode!="")
		{
			truckerValue=$('#trucker').val() + "-" +carrierCode;
		}
	else
		{
			truckerValue=$('#trucker').val();
		}
	$('#trucker').val(truckerValue);
	$("#truckerOrgId").val(values[3]);
	//$('#in_organization_id').val(orgnID);
	//$('#in_organization_code').val(values[1]+"-"+carrierCode); 
	getOrgAddress($('#truckerOrgId').val());
	enableSave();
	somethingChanged=true;
	 $('#msgDiv').hide();
}


function addroleUpdate(id){
	if(popupName!=null && popupName=="truckerPopup"){
		// addressRolePopupSearch() is called from Trucker autocomplete .addressRolePopupSearch() fetches Arol corresponding to 
		// the organization id.Arol is stored in aRolvalues[9].
		var aRolvalues = id.split("|");	
		// set Arol to truckerOrgId
		$("#truckerOrgId").val(aRolvalues[9]);
		// Enable save button as now we have Arol Id .
		 $('#msgDiv').hide();
		 getOrgAddress($('#truckerOrgId').val());
		 somethingChanged=true;
		enableSave();
	}
	else if(popupName=="otherParty"){
		//ADDRESS_ROLE_ID,ORGANIZATION_ID,NAME_QUALIFIER,C_O_ABBREV,ADDRESS,SUITE,CITY,STATE,ZIP,COUNTRY,ADDRESS_TYPE_DESC,ACTIVE
		var values = id.split("|");
	    //var address=values[7];
	    $("#otherParty").val(values[5]+"-"+values[2]+"-"+values[4]+"-"+values[6]+"-"+values[7]);
		$("#otherPartyArolId").val(values[9]);
		$('#billTOother').removeAttr("disabled");
		$('#billTOother').attr('checked', true);
		getOrgAddress($('#otherPartyArolId').val());
		somethingChanged=true;
 		enableSave();
	}
}
/*function orgnSearchUpdate(id){
	alert("10");
	var values = id.split("|");
	alert(values);
	if(values[2]!=''){
		$('#trucker').val(values[2] + "-" + values[1]);	
	}else{
		$('#trucker').val(values[1]);
	}
	$("#truckerOrgId").val(values[8]);
	$('#billTOtrucker').removeAttr("disabled");
	 if($("#partyToShipment").val()==""){
		 $('#billTOtrucker').attr('checked', true);
	 }
	enableSave();
}*/


function setDivNames(){
	setDetentionBillDiv();
}

function setDetentionBillDiv() {
	headerStr = "Detention";
	setAccordianTabDetails('detentionBilling', headerStr);
}
function setAccordianTabDetails(id, displayText){
		$("#"+id).text(displayText);
}

function partyToShipmentUpdate(id) {
	$('#partyToShipment').val(id);
}

function displayDetentionDtls(){
		$.ajax({
			type: "POST",
			url: "/gates/detentionBilling/display",
			data: {invoiceNumber: $("#detentionBillingId").val(), revisionNumber: $("#versionCode").val()},
			success: function(responseText){
				if(responseText.data==null){
					showResponseMessages("msgDiv", responseText);
					clearPageOnLoad();
					return;
				}
				else{
					showJSONContainer(responseText);
					enableSave();//21222
					$('#msgDiv').show();
					var partyToToShipmentChecked=$('#billTOshipment').is(':checked');
					$('#isPartyToShipmentChecked').val(partyToToShipmentChecked);
					var truckerAndCode=$('#trucker').val();
					if(truckerAndCode==""){
						$('#in_organization_id').val("");
					 	 $('#in_using_orgn_id').val("");
					 	$('#truckerTemp').val("");
						//var tokens=truckerAndCode.split("-");
						//if(tokens[1].length < tokens[0].length){
						//	$('#trucker').val(tokens[1]+"-"+tokens[0]);
						//}
					}
					
					////$('#truckerOrgId').val("");

					var oldVal=$('#detentionBillingId').val();
					$('#detentionBillingIdOld').val(oldVal);
					
					if($('#detentionBillingId').val()==null) {
						$('#commentsDiv').hide();
					}
					else {
						if($('#detentionBillingId').val().trim()=='') {
							$('#commentsDiv').hide();
						}
						else {
							$('#commentsDiv').show();
							var args = {
									entityType: 'DTBL',
									entityId: $('#detentionBillingId').val(),
									commentId:  'commentId',
									displayCommentTypes:"DTBL"
								};
							$("#comment_link").comments(args);
						}
					}
				}
				//Messages
				somethingChanged=false;
				showResponseMessages("msgDiv", responseText);
                                ifPhxUsers();
			}
		});
}

function displayPrevNextDetentionDtls(prevNext){
	if (somethingChanged) {
		 var r=confirm("Data in the screen has changed but not saved. Press OK if you want to continue, else press Cancel.");
		 if (r==true)
		  {
			 var currentInvoiceStr =  $("#detentionBillingId").val()+"|"+$("#versionCode").val();
				var urlStr = _context + "/detentionBilling/getPrevNext?currentInvoice="+currentInvoiceStr+"&prevNextInd="+prevNext;
				document.location.href = urlStr ;
		  }
	}
	else
	 {
		 var currentInvoiceStr =  $("#detentionBillingId").val()+"|"+$("#versionCode").val();
			var urlStr = _context + "/detentionBilling/getPrevNext?currentInvoice="+currentInvoiceStr+"&prevNextInd="+prevNext;
			document.location.href = urlStr ;
	 }
	
}
/*function displayPrevNextDetentionDtlsTest(prevNext, invoiceListSize, nextInvoicePosition){
	var currentInvoiceStr =  $("#detentionBillingId").val()+"|"+$("#versionCode").val();
	$.ajax({
		type: "POST",
		url: "/gates/detentionBilling/getPrevNext",
		data: {currentInvoice: currentInvoiceStr, prevNextInd: prevNext},
		success: function(responseText){
			if(responseText.data==null){
				showResponseMessages("msgDiv", responseText);
				clearPageOnLoad();
				return;
			}
			else{
				showJSONContainer(responseText);
				enableSave();//21222
				$('#msgDiv').show();
				var partyToToShipmentChecked=$('#billTOshipment').is(':checked');
				$('#isPartyToShipmentChecked').val(partyToToShipmentChecked);
				var truckerAndCode=$('#trucker').val();
				if(truckerAndCode==""){
					$('#in_organization_id').val("");
				 	 $('#in_using_orgn_id').val("");
				 	$('#truckerTemp').val("");
					//var tokens=truckerAndCode.split("-");
					//if(tokens[1].length < tokens[0].length){
					//	$('#trucker').val(tokens[1]+"-"+tokens[0]);
					//}
				}
				
				////$('#truckerOrgId').val("");

				var oldVal=$('#detentionBillingId').val();
				$('#detentionBillingIdOld').val(oldVal);
				
				if($('#detentionBillingId').val()==null) {
					$('#commentsDiv').hide();
				}
				else {
					if($('#detentionBillingId').val().trim()=='') {
						$('#commentsDiv').hide();
					}
					else {
						$('#commentsDiv').show();
						var args = {
								entityType: 'DTBL',
								entityId: $('#detentionBillingId').val(),
								commentId:  'commentId',
								displayCommentTypes:"DTBL"
							};
						$("#comment_link").comments(args);
					}
				}
			}
			//Messages
			somethingChanged=false;
			showResponseMessages("msgDiv", responseText);
			if(nextInvoicePosition!=null && nextInvoicePosition!=''){
				if(nextInvoicePosition==0){
					$('#fetchPrevDetentionInfo').attr("disabled","disabled");
				}
				else if(invoiceListSize!=null && nextInvoicePosition==(invoiceListSize-1)){
					$('#fetchNextDetentionInfo').attr("disabled","disabled");
				}
				else{
					$('#fetchPrevDetentionInfo').removeAttr("disabled");
					$('#fetchNextDetentionInfo').removeAttr("disabled");
				}
			}
			else{
				$('#fetchPrevDetentionInfo').attr("disabled","disabled");
				$('#fetchNextDetentionInfo').attr("disabled","disabled");
			}
			//$('#detentionMaintInvoicePosition').val(<%= session.getAttribute("detentionMaintInvoicePosition") %>);
		}
	});
}*/
function showJSONContainerForSave(responseText){
	  $("#trucker").val(responseText.data.trucker);
	  $("#partyToShipment").val(responseText.data.partyToShipment);
      $("#partyToShipmentArolID").val(responseText.data.partyToShipmentArolID);
      $("#truckerOrgId").val(responseText.data.truckerOrgId);
      $("#otherParty").val(responseText.data.otherParty);
      $("#otherPartyArolId").val(responseText.data.otherPartyArolId);
    if(responseText.data.calendarWorkCode=="C"){
    	document.getElementById("calendar").checked=true;
    	document.getElementById("working").checked=false;
    }
    if(responseText.data.calendarWorkCode=="W"){
    	document.getElementById("working").checked=true;
    	document.getElementById("calendar").checked=false;
    }
    
    if(responseText.data.outgateEmptyFullCode=="E"){
    	document.getElementById("outgateEmpty").checked=true;
    	document.getElementById("outgateFull").checked=false;
    }
    if(responseText.data.outgateEmptyFullCode=="F"){
    	document.getElementById("outgateFull").checked=true;
    	document.getElementById("outgateEmpty").checked=false;
    }
    
    // set data to form 
    $("#statusCode").val(responseText.data.statusCode);
    $("#versionCode").val(responseText.data.revisionNumber);
	$("#currentRevisionNumber").val(responseText.data.currentRevisionNumber);
	var currVersion= $("#currentRevisionNumber").val();
	var selectedVersion= $("#versionCode").val();
	var statusCode=$("#statusCode").val();
	if(!(currVersion==selectedVersion)){
		$('#containerSave').attr("disabled","disabled");
	}

	// BR2.	Correction is only allowed for the latest revision of the invoice and the 
	// status of the latest revision must be ‘ISSD’
	toggleCorrectDetention(statusCode,selectedVersion,currVersion);

	// enable revision history
	$('#revisionHistory').removeAttr("disabled");
	
	//selectBillTO($("#partyToShipment").val(),$("#trucker").val());
	selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
	toggleEditableFields(statusCode);
	
	// set default version number to highest value
	var count = 0;
	var dropdownLength=0;
	$("#versionCode").get(0).options.length = 0;
	$.each(responseText.data.versionList, function() {
		$("#versionCode").get(0).options[$("#versionCode").get(0).options.length] = new Option(responseText.data.versionList[count]);
		count++;
	});
	dropdownLength=responseText.data.versionList.length;
	for (var i=0; i<document.getElementById('versionCode').options.length; i++)
     {
      if ( document.getElementById('versionCode').options[i].value == dropdownLength )
      {
    	  document.getElementById('versionCode').options[i].selected = true;
       isFound = true;
      }
     }
	   // set data to form 
    $("#statusCode").val(responseText.data.statusCode);
	$("#currentRevisionNumber").val(responseText.data.currentRevisionNumber);
	
	var currVersion= $("#currentRevisionNumber").val();
	var selectedVersion= $("#versionCode").val();
	var statusCode=$("#statusCode").val();
	if(!(currVersion==selectedVersion)){
		$('#containerSave').attr("disabled","disabled");
	}

// Enable disable cancel correction
	if((statusCode != "ISSD") || (statusCode == "")){
		if( selectedVersion == '1' || selectedVersion == '' || selectedVersion==null){
			$('#cancelCorrection').attr("disabled","disabled");
		}else{
				$('#cancelCorrection').removeAttr("disabled");
		}
	}
	else{
		$('#cancelCorrection').attr("disabled","disabled");
	}
	
// Enable disable ready to issue.
	if((statusCode != "PEND") || (statusCode == "")){
			$('#readyToIssueDetentionBill').attr("disabled","disabled");
		}else{
			// If the data is saved then enable Ready to Issue button.
			if( $("#trucker").val()!="" && $("#partyToShipment").val()!="" ){
				$('#readyToIssueDetentionBill').removeAttr("disabled");
			}
			
			if( $("#trucker").val()=="" && $("#partyToShipment").val()=="" ){
				// Both shipment and trucker should be present in database .
				$('#readyToIssueDetentionBill').attr("disabled","disabled");
			}
			if( $("#trucker").val()!="" && $("#partyToShipment").val()=="" ){
				// Both shipment and trucker should be present in database .
				if($("#partyToShipmentArolID").val()!=""){
					$('#readyToIssueDetentionBill').removeAttr("disabled");	
				}else{
					$('#readyToIssueDetentionBill').attr("disabled","disabled");	
				}
				
			}
			if($("#otherParty").val()!=""){
				$('#readyToIssueDetentionBill').removeAttr("disabled");
			}
			
		}
	
	toggleRevertToPending(statusCode);

	toggleCancelBill(statusCode,selectedVersion);
	
	togglePrint(statusCode,selectedVersion,currVersion);
	
	togglePrintDetention(statusCode);
	   if( $("#issuedDateDiv").text()=='01-01-0001'){
	 		 $("#issuedDateDiv").text("");
	 	 }

}

function showJSONContainer(responseText)  {
	
	 //alert("showJSONContainer called");
	    $("#commentId").val(responseText.data.commentId);
	    $("#statusCode").text(responseText.data.statusCode);
	    $("#statusCode").val(responseText.data.statusCode);
	    $("#statusCodeDescDiv").text(responseText.data.statusCodeDesc);
	    $("#isTruckerRequired").val(responseText.data.isTruckerRequired);
	    toggleShipmentTrucker(responseText.data.statusCode);
	    
	    $("#pendingTimestampDiv").text(responseText.data.pendingTimestamp);
	    $("#issuedDateDiv").text(responseText.data.issuedDate);
	    $("#loadServiceCodeDiv").text(responseText.data.loadServiceCode);
	    $("#blOriginCityCodeDiv").text(responseText.data.blOriginCityCode);
	    $("#tradeCodeDiv").text(responseText.data.tradeCode);
	    $("#tradeCodeDescDiv").text(responseText.data.tradeCodeDesc);
	    
	    $("#dischargeServiceCodeDiv").text(responseText.data.dischargeServiceCode);
	    $("#originPortCityCodeDiv").text(responseText.data.originPortCityCode);
	    $("#tariffNumberDiv").text(responseText.data.tariffNumber);
	    $("#freightReceivedDateDiv").text(responseText.data.freightReceivedDate);
	    $("#destinationPortCityCodeDiv").text(responseText.data.destinationPortCityCode);
	    $("#blDestinationCityCodeDiv").text(responseText.data.blDestinationCityCode);
	    $("#outgate").val(responseText.data.outgate);
	    $("#containerDiv").text(responseText.data.equipmentId);
	    $("#equipmentDiv").text(responseText.data.equipment);
	    $("#outgate").text(responseText.data.outgate);
	    $("#outgateDateDiv").text(responseText.data.outgateDate);
	    $("#ingateDateDiv").text(responseText.data.ingateDate);
	    $("#processingStatusDiv").text(responseText.data.processLevelCode);
	    $("#processingStatusDiv").val(responseText.data.processLevelCode);
	    $("#processingStatusDescDiv").text(responseText.data.processLevelCodeDesc);
	    
	    $("#detentionDaysDiv").text(responseText.data.detentionDays);
	    $("#rateDiv").text(parseFloat(responseText.data.rateAmount).toFixed(2));
	    var amt = parseFloat(responseText.data.billAmount);
	    $("#amountChargesDiv").text(amt.toFixed(2));
	    $("#vvdDiv").text(responseText.data.vvd);
	    $("#shipmentIdDiv").text(responseText.data.shipmentNumber);
	    $("#shipperDiv").text(responseText.data.shipper);
	    $("#consigneeDiv").text(responseText.data.consignee);
	    $("#detentionDaysChargesDiv").text(responseText.data.detentionDays);
	    $("#freeTimeEndDateDiv").text(responseText.data.freeTimeEndDate);
	    $("#partyToShipmentDiv").val(responseText.data.partyToShipment);
	    
	    
	    $("#outgateEmptyFullCode").val(responseText.data.outgateEmptyFullCode);
	    $("#billingOutgateDate").val(responseText.data.billingOutgateDate);
	    $("#billingIngateDate").val(responseText.data.billingIngateDate);
	    $("#freeDays").val(responseText.data.freeDays);
	    $("#freeTimeEndDate").val(responseText.data.freeTimeEndDate);
	    $("#rateAmount").val(parseFloat(responseText.data.rateAmount).toFixed(2));
	    $("#detentionBillingRevsnId").val(responseText.data.detentionBillingRevsnId);
	    $("#calendarWorkCode").val(responseText.data.calendarWorkCode);
	    $("#equipmentId").val($("#containerDiv").val());
	    $("#partyToShipmentArolID").val(responseText.data.partyToShipmentArolID);
	    $("#truckerOrgId").val(responseText.data.truckerOrgId)   ;
	    $("#otherPartyArolId").val(responseText.data.otherPartyArolId)   ;
	    
	    if(responseText.data.calendarWorkCode=="C"){
	    	document.getElementById("calendar").checked=true;
	    	document.getElementById("working").checked=false;
	    }
	    if(responseText.data.calendarWorkCode=="W"){
	    	document.getElementById("working").checked=true;
	    	document.getElementById("calendar").checked=false;
	    }
	    
	    if(responseText.data.outgateEmptyFullCode=="E"){
	    	document.getElementById("outgateEmpty").checked=true;
	    	document.getElementById("outgateFull").checked=false;
	    }
	    if(responseText.data.outgateEmptyFullCode=="F"){
	    	document.getElementById("outgateFull").checked=true;
	    	document.getElementById("outgateEmpty").checked=false;
	    }
	    
	    // set data to form 
	    $("#statusCode").val(responseText.data.statusCode);
	    $("#shipper").val(responseText.data.shipper);
	    $("#consignee").val(responseText.data.consignee);
	    $("#trucker").val(responseText.data.trucker);
	    $("#partyToShipment").val(responseText.data.partyToShipment);
	    $("#otherParty").val(responseText.data.otherParty);
	    $("#versionCode").val(responseText.data.revisionNumber);
		$("#currentRevisionNumber").val(responseText.data.currentRevisionNumber);
		$("#in_organization_id").val(responseText.data.in_organization_id);
		 $('#truckerTemp').val(responseText.data.trucker);
		
		var currVersion= $("#currentRevisionNumber").val();
		var selectedVersion= $("#versionCode").val();
		var statusCode=$("#statusCode").val();
		if(!(currVersion==selectedVersion)){
			$('#containerSave').attr("disabled","disabled");
		}

	
		// BR2.	Correction is only allowed for the latest revision of the invoice and the 
		// status of the latest revision must be ‘ISSD’
		toggleCorrectDetention(statusCode,selectedVersion,currVersion);
	
		// BR29 
		toggleCancelCorrection(statusCode,selectedVersion);

		toggleReadyToIssue(statusCode);
		
		toggleRevertToPending(statusCode);

		toggleCancelBill(statusCode,selectedVersion);
		
		togglePrint(statusCode,selectedVersion,currVersion);
		
		togglePrintDetention(statusCode);
		
		// enable revision history
		$('#revisionHistory').removeAttr("disabled");
		
		//selectBillTO($("#partyToShipment").val(),$("#trucker").val());
		selectBillTOParty($("#partyToShipmentArolID").val(),$("#truckerOrgId").val(),$("#otherPartyArolId").val());
		toggleEditableFields(statusCode);
		if( $("#issuedDateDiv").text()=='01-01-0001'){
			 $("#issuedDateDiv").text("");
		 }
	}

function selectBillTOParty(partyToShipment,trucker,otherParty){
	//alert("Inside method selectBillTOParty, partyToShipment:"+partyToShipment+",trucker:"+trucker+',otherPartyArol:'+otherParty+",OtherParty:"+$("#otherParty").val());
	var statusCode=$("#statusCode").val();
	if(partyToShipment=="" || partyToShipment==0){
		//alert("partyToShipment blank");
		// If party to shipment Arol NOT available.
		if(trucker=="" || trucker==0){
			//If trucker Arol is also NOT available diable bot radio button.
			  $('#billTOtrucker').attr("disabled","disabled");
			  $('#billTOshipment').attr("disabled","disabled");
		}else{
			// If trucker is available then enable trucker.Disable Party to shipment.
			$('#billTOtrucker').removeAttr("disabled");
			$('#billTOshipment').attr("disabled","disabled");
			//getOrgAddress($('#truckerOrgId').val());
			
		}
		// Trucker radio button will not be marked as checked unless party with 21 type is in database.
		$('#billTOtrucker').attr('checked', false);
		$('#billTOshipment').attr('checked', false);
		if(otherParty=="" || otherParty==0){
			//If other party Arol is also NOT available disable all radio button.
			  $('#billTOother').attr("disabled","disabled");
			  $('#billTOother').attr('checked', false);
		}else{
			// If other party is available then enable trucker.Disable Party to shipment and trucker.
			$('#billTOother').removeAttr("disabled");
			$('#billTOother').attr('checked', true);
			getOrgAddress($('#otherPartyArolId').val());
			//$('#billTOtrucker').attr("disabled","disabled");
			//$('#billTOshipment').attr("disabled","disabled");
			
		}
	}else{
		// If party to shipment Arol is  available.
		//alert("partyToShipment not blank");
		if(otherParty=="" || otherParty==0){
			//If other party Arol is also NOT available disable all radio button.
			  $('#billTOother').attr("disabled","disabled");
			  $('#billTOother').attr('checked', false);
		
			if(trucker=="" || trucker==0){
				//If trucker Arol is also NOT available.enable Party to shipment and select its radio button.
				// Disable Trucker and deselect trucker is already selected.
				$('#billTOshipment').attr('checked', true);
				$('#billTOshipment').removeAttr("disabled");
				$('#billTOtrucker').attr('checked', false);
				$('#billTOtrucker').attr("disabled","disabled");
			}
			if(trucker!="" && trucker!=0){
				// If both Party to shipment and trucker exists.
				if(partyToShipment==trucker){
					//If both Trucker and Party to shipment Arols are the same then select Trucker radio button and 
					// disable party to shipment and deselect Party to shipment if it was previously selected.
					$('#billTOtrucker').attr('checked', true);
					getOrgAddress($('#truckerOrgId').val());
					$('#billTOshipment').attr('checked', false);
					$('#billTOtrucker').removeAttr("disabled");
					$('#billTOshipment').attr("disabled","disabled");
					$("#partyToShipment").val("");
				}else{
					//If Trucker value differs with Party to shipment value then select Party to shipment radio button..
					// Enable both radio buttons.
					$('#billTOtrucker').attr('checked', false);
					$('#billTOshipment').attr('checked', true);
					getOrgAddress($('#partyToShipmentArolID').val());
					$('#billTOtrucker').removeAttr("disabled");
					$('#billTOshipment').removeAttr("disabled");
				}
			}	
		}
		else{
			$('#billTOother').removeAttr("disabled");
			$('#billTOother').attr('checked', true);
			getOrgAddress($('#otherPartyArolId').val());
			$('#billTOshipment').attr('checked', false);
			$('#billTOtrucker').attr('checked', false);
			
			$('#billTOshipment').removeAttr("disabled");
			
			if(trucker=="" || trucker==0){
				//If trucker Arol is also NOT available.enable Party to shipment and select its radio button.
				// Disable Trucker and deselect trucker is already selected.
				$('#billTOtrucker').attr("disabled","disabled");
			}
			if(trucker!="" && trucker!=0){
				// If both Party to shipment and trucker exists.
				$('#billTOtrucker').removeAttr("disabled");
			}	
		}
	}
	 if(statusCode=='ISSD' || statusCode=='CANC'){
		  $('#billTOshipment').attr("disabled","disabled");
		  $('#billTOtrucker').attr("disabled","disabled");
	  }	
	 

	 
}

function selectBillTO(partyToShipment,trucker){
	var statusCode=$("#statusCode").val();
	if(partyToShipment==""){
		// If party to shipment Arol NOT available.
		if(trucker==""){
			//If trucker Arol is also NOT available diable bot radio button.
			  $('#billTOtrucker').attr("disabled","disabled");
			  $('#billTOshipment').attr("disabled","disabled");
		}else{
			// If trucker is available then enable trucker.Disable Party to shipment.
			$('#billTOtrucker').removeAttr("disabled");
			$('#billTOshipment').attr("disabled","disabled");
			
		}
		// Trucker radio button will not be marked as checked unless party with 21 type is in database.
		$('#billTOtrucker').attr('checked', false);
		$('#billTOshipment').attr('checked', false);
	}else{
		// If party to shipment Arol is  available.
		if(trucker==""){
			//If trucker Arol is also NOT available.enable Party to shipment and select its radio button.
			// Disable Trucker and deselect trucker is already selected.
			$('#billTOshipment').attr('checked', true);
			$('#billTOshipment').removeAttr("disabled");
			$('#billTOtrucker').attr('checked', false);
			$('#billTOtrucker').attr("disabled","disabled");
		}
		if(trucker!=""){
			// If both Party to shipment and trucker exists.
			if(partyToShipment==trucker){
				//If both Trucker and Party to shipment Arols are the same then select Trucker radio button and 
				// disable party to shipment and deselect Party to shipment if it was previously selected.
				$('#billTOtrucker').attr('checked', true);
				$('#billTOshipment').attr('checked', false);
				$('#billTOtrucker').removeAttr("disabled");
				$('#billTOshipment').attr("disabled","disabled");
				$("#partyToShipment").val("");
			}else{
				//If Trucker value differs with Party to shipment value then select Party to shipment radio button..
				// Enable both radio buttons.
				$('#billTOtrucker').attr('checked', false);
				$('#billTOshipment').attr('checked', true);
				$('#billTOtrucker').removeAttr("disabled");
				$('#billTOshipment').removeAttr("disabled");
			}
		}	
	}
	 if(statusCode=='ISSD' || statusCode=='CANC'){
		  $('#billTOshipment').attr("disabled","disabled");
		  $('#billTOtrucker').attr("disabled","disabled");
	  }		
}
function togglePrint(statusCode,selectedVersion,currVersion){
	// Print is disabled when status is not ISSD or displayed revision is not the latest revision.
	if((statusCode != "ISSD") || (currVersion != selectedVersion) || (statusCode == "")){
		$('#printDetention').attr("disabled","disabled");
	}else{
		if ($('#detentionBillingSave').attr("disabled")=="disabled") {
			// If the data is saved then enable Print button.
			$('#printDetention').removeAttr("disabled");
		}else{
			//When the screen displays the corrected revision data which is not yet saved then disable print button
			$('#printDetention').attr("disabled","disabled");
		}
	}
}

function toggleCancelBill(statusCode,selectedVersion){
	// Cancel Bill must be enable only if the status is pending(PEND)
	if((statusCode == "ISSD") || (statusCode == "CANC")  || (selectedVersion != '1') || (statusCode == "")){
		$('#cancelDetentionBill').attr("disabled","disabled");
	}else{
		$('#cancelDetentionBill').removeAttr("disabled");
	}
}

function toggleRevertToPending(statusCode){
	// Ready to issue must be enable only if the status is pending(PEND)
	if((statusCode != "RATD" && statusCode != "CANC") || (statusCode == "")){
		$('#revertToPendingDetentionBill').attr("disabled","disabled");
	}else{
		//if ($('#detentionBillingSave').attr("disabled")=="disabled") {
			// If the data is saved then enable Revert to Pending button.
			$('#revertToPendingDetentionBill').removeAttr("disabled");
		/*} else{
			//When the screen displays the corrected revision data which is not yet saved then disable Revert to Pending button
			$('#revertToPendingDetentionBill').attr("disabled","disabled");
		}*/
	}
}

function toggleReadyToIssue(statusCode){
	
	// Ready to issue must be enable only if the status is pending(PEND)
	if((statusCode != "PEND") || (statusCode == "")){
		
		$('#readyToIssueDetentionBill').attr("disabled","disabled");
	}else{
		//if ($('#detentionBillingSave').attr("disabled")=="disabled") {21222
			
			if( $("#trucker").val()!="" && $("#partyToShipment").val()!="" ){
				$('#readyToIssueDetentionBill').removeAttr("disabled");
			}
			
			if( $("#trucker").val()=="" && $("#partyToShipment").val()=="" ){
				// Both shipment and trucker should be present in database .
				$('#readyToIssueDetentionBill').attr("disabled","disabled");
			}
			if( $("#trucker").val()!="" && $("#partyToShipment").val()=="" ){
				// Both shipment and trucker should be present in database .
				if($("#partyToShipmentArolID").val()!=""){
					$('#readyToIssueDetentionBill').removeAttr("disabled");	
				}else{
					$('#readyToIssueDetentionBill').attr("disabled","disabled");	
				}
			}
			if( $("#trucker").val()=="" && $("#partyToShipment").val()!="" ){
				if($('#isTruckerRequired').val()!=="false"){//21222
				$('#readyToIssueDetentionBill').attr("disabled","disabled");	
			}else{$('#readyToIssueDetentionBill').removeAttr("disabled");	}}
			
			if($("#otherParty").val()!=""){
				$('#readyToIssueDetentionBill').removeAttr("disabled");
			}
		//}else{21222
			//When the screen displays the corrected revision data which is not yet saved then disable Ready to Issue button
			//$('#readyToIssueDetentionBill').attr("disabled","disabled");
		//}
	}
}

function toggleCorrectDetention(statusCode,selectedVersion,currVersion){
// If status code is not ISSD or current version is not equal to the selected version
	// then disable correct button.
	if((statusCode != "ISSD") || (currVersion != selectedVersion) || (statusCode == "")){
		$('#correctDetention').attr("disabled","disabled");
	}else{
		$('#correctDetention').removeAttr("disabled");
		/*if ($('#detentionBillingSave').attr("disabled")=="disabled") {
			// If the data is saved then enable correct button.
			$('#correctDetention').removeAttr("disabled");
		}else{
			//When the screen displays the corrected revision data which is not yet saved then disable correct button
			$('#correctDetention').attr("disabled","disabled");
		}*/
	}
}

function togglePrintDetention(statusCode){
	if((statusCode != "ISSD") || (statusCode == "")){
		$('#printDetention').attr("disabled","disabled");
	}else{
		$('#printDetention').removeAttr("disabled");
	}
	
}

function toggleCancelCorrection(statusCode,selectedVersion){
// BR 29 Cancel correction is not allowed for Version 1
	// Cancel correction is not allowed for status ISSD
	if((statusCode != "ISSD") || (statusCode == "")){
		if( selectedVersion == '1' || selectedVersion == '' || selectedVersion==null){
			$('#cancelCorrection').attr("disabled","disabled");
		}else{
			//D025784
			//if ($('#detentionBillingSave').attr("disabled")=="disabled") {
				// If the data is saved then enable cancel button.
				$('#cancelCorrection').removeAttr("disabled");
			//}else{
				//When the screen displays the corrected revision data which is not yet saved then disable cancel button
				//$('#cancelCorrection').attr("disabled","disabled");
			//}
		}
	}
	else{
		$('#cancelCorrection').attr("disabled","disabled");
	}
}
function clearPageOnLoad() {
	$('#detentionBillingForm').clearForm();
	 $("#pendingTimestampDiv").text("");
	    $("#issuedDateDiv").text("");
	    $("#loadServiceCodeDiv").text("");
	    $("#blOriginCityCodeDiv").text("");
	    $("#tradeCodeDiv").text("");
	    $("#tradeCodeDescDiv").text("");
	    $("#statusCode").text("");
	    $("#statusCodeDescDiv").text("");
	    
	    $("#dischargeServiceCodeDiv").text("");
	    $("#originPortCityCodeDiv").text("");
	    $("#tariffNumberDiv").text("");
	    $("#freightReceivedDateDiv").text("");
	    $("#destinationPortCityCodeDiv").text("");
	    $("#blDestinationCityCodeDiv").text("");
	    $("#outgate").val("");
	    $("#containerDiv").text("");
	    $("#equipmentDiv").text("");
	    $("#outgate").text("");
	    $("#outgateDateDiv").text("");
	    $("#ingateDateDiv").text("");
	    $("#processingStatusDiv").text("");
	    $("#detentionDaysDiv").text("");
	    $("#rateDiv").text("");
	    $("#amountDiv").text("");
	    $("#vvdDiv").text("");
	    $("#amountDiv").text("");
	    $("#shipmentIdDiv").text("");
	    $("#shipperDiv").text("");
	    $("#consigneeDiv").text("");
	    $("#detentionDaysChargesDiv").text("");
	    $("#amountChargesDiv").text("");
	    
	    $("#statusCode").val("");
	    $("#shipper").val("");
	    $("#consignee").val("");
	    $("#trucker").val("");
	    $("#partyToShipment").val("");
	    $("#otherParty").val("");
	    $("#versionCode").val("");
		$("#currentRevisionNumber").val("");
	
}

function loadRevisionHistory(){
	var revisionNo = $('#detentionBillingId').val();	
	var containerNo = $('#containerDiv').text();		
	document.location.href  = _context + '/dt/revisionHistory/getRevisionDetail?revisionNo='+revisionNo+'&containerNo='+containerNo;
}

function addrsRolePopupSearch(){
	var detentionRevisionNo = $('#detentionBillingRevsnId').val();
	var actionUrl =  _context + '/cas/detentionBillArollookup.do?filterValue1='+detentionRevisionNo;
	var windowStyle = 'top=0,left=0,height=500,width=750,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);	
}

function loadArolData(data){
	// Party to shipment data
	//NAME,CITY,NAME_QUALIFIER,STATE,ADDRESS,AROLE_ID
	var values = data.split("|");
	var address='';
	address = values[0]+'-';
		if(values[1]!=null && $.trim(values[1])!=''){
			address= address+values[1]+'-';
		}
		address=address+values[2]+"-"+values[3]+"-"+values[4];
		
	
	$("#partyToShipment").val(address);
	$("#partyToShipment").val(address);
	$("#partyToShipmentArolID").val(values[5]);
	 $('#billTOshipment').removeAttr("disabled");
	 $('#billTOshipment').attr('checked', true);
	 somethingChanged=true;
	 getOrgAddress($('#partyToShipmentArolID').val());
	 enableSave();
}

function addressRolePopupSearchOther() 
{
	popupName = "otherParty";
	 var orgCode=$('#otherPartyOrgId').val();
	if ( (orgCode==null) ||($.trim(orgCode)=='' || orgCode=='ALL') ) { 
		{
	      	//$("#in_debtor_name").validationEngine('showPrompt', 'Please enter  a valid Debtor name', 'error', true);
				return false;	
	    }
	} 
	else 
	{ 
		
		var actionUrl =  _context + '/cas/addRoleBKLookup.do?filterValue1='+$('#otherPartyOrgId').val()+'&srcScreen=CAS';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);		
		
	}
}	

function organizationPopupSearchOther() {
	//popup = "debtorOrg";
	var values=$('#otherParty').val().split("-");
	var param;
	if(values[0]!=null){
		param=values[0];
	}else{
		param=values[1];
	}	
	
	var actionUrl =  _context+'/cas/orgSearchLookup.do?filterValue1='+param+'||QT';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function orgSearchUpdate(id){
	var values = id.split("|");
	var orgName = values[0];
	var orgCode = values[1];
	var orgId=values[2];
	//$('#in_debtor_name').val(orgName+'-'+orgCode);
	$('#otherPartyOrgId').val(values[2]);
	//alert($('#otherPartyOrgId').val());
	//$('#in_debtor_address').removeAttr("disabled");
	addressRolePopupSearchOther();
	popup=null;
}
	
/*	function addroleUpdate(id){
	//ADDRESS_ROLE_ID,ORGANIZATION_ID,NAME_QUALIFIER,C_O_ABBREV,ADDRESS,SUITE,CITY,STATE,ZIP,COUNTRY,ADDRESS_TYPE_DESC,ACTIVE
	var values = id.split("|");
    //var address=values[7];
    $("#otherParty").val(values[5]+"-"+values[2]+"-"+values[4]+"-"+values[6]+"-"+values[7]);
	$("#otherPartyArolId").val(values[9]);
	}*/	

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

function getOrgAddress(detentionArolId) {
	if (detentionArolId != undefined && detentionArolId != "" && detentionArolId != 0) {

		$.ajax({
			type : "POST",
			url : "/gates/detentionBilling/getOrgAddress",
			data : {addressRoleId : detentionArolId},
			success : function(responseText) {
				var addressLine1="";
				$("#orgTextDiv").text(responseText.data.owningOrganizationName);
				if(responseText.data.careOfOrganizationName!=null && responseText.data.careOfOrganizationName!=''){
					addressLine1 = "C/O "+responseText.data.careOfOrganizationName+", ";
				}
				if(responseText.data.nameQualifier!=null && responseText.data.nameQualifier!=''){
					addressLine1 = addressLine1 + responseText.data.nameQualifier+", ";
				}
				if(responseText.data.streetAddress!=null && responseText.data.streetAddress!=''){
					addressLine1 = addressLine1 + responseText.data.streetAddress+", ";
				}
				if(responseText.data.streetAddress2!=null && responseText.data.streetAddress2!=''){
					addressLine1 = addressLine1 + responseText.data.streetAddress2+", ";
				}
				if(responseText.data.suite!=null && responseText.data.suite!=''){
					addressLine1 = addressLine1 +"Suite "+ responseText.data.suite;
				}
				$("#addressLine1TextDiv").text(addressLine1);
				
				var addressLine2="";
				if(responseText.data.city!=null && responseText.data.city!=''){
					addressLine2 = responseText.data.city+", ";
				}
				if(responseText.data.state!=null && responseText.data.state!=''){
					addressLine2 = addressLine2 +responseText.data.state+", ";
				}
				if(responseText.data.zip!=null && responseText.data.zip!=''){
					addressLine2 = addressLine2 +responseText.data.zip;
				}
				$("#addressLine2TextDiv").text(addressLine2);
			}
		});
	}
}

function getRevision(invoiceNo) {
	if (invoiceNo != undefined && invoiceNo != "") {
		var count = 0;
		var dropdownLength=0;
		$.ajax({
			type : "POST",
			url : "/gates/detentionBilling/getRevision",
			data : {invoice : invoiceNo},
			success : function(responseText) {
				$("#versionCode").get(0).options.length = 0;
				$.each(responseText.data.versionList, function() {
					$("#versionCode").get(0).options[$("#versionCode").get(0).options.length] = new Option(responseText.data.versionList[count]);
					count++;
				});
				dropdownLength=responseText.data.versionList.length;
				for (var i=0; i<document.getElementById('versionCode').options.length; i++)
			     {
			      if ( document.getElementById('versionCode').options[i].value == dropdownLength )
			      {
			    	  document.getElementById('versionCode').options[i].selected = true;
			       isFound = true;
			      }
			     }
				
			}
		});
	}
}
function enableSave(){
	if($("#statusCode").val()!='ISSD'){
		$('#detentionBillingSave').removeAttr("disabled");	
	}else{
		// for ISSD save is never enabled and all editable fields are disabled too.
		$('#detentionBillingSave').attr("disabled","disabled");
	}
}

function toggleEditableFields(status){
	if(status=='ISSD' || status=='CANC'){
		$('#billingOutgateDate').attr("disabled","disabled");
		$('#billingIngateDate').attr("disabled","disabled");
		$('#freeDays').attr("disabled","disabled");
		$('#rateAmount').attr("disabled","disabled");
		$('#freeTimeEndDate').attr("disabled","disabled");
		$('#calendar').attr("disabled","disabled");
		$('#working').attr("disabled","disabled");
	}else{
		$('#billingOutgateDate').removeAttr("disabled");	
		$('#billingIngateDate').removeAttr("disabled");	
		$('#freeDays').removeAttr("disabled");	
		$('#rateAmount').removeAttr("disabled");	
		$('#freeTimeEndDate').removeAttr("disabled");	
		$('#calendar').removeAttr("disabled");
		$('#working').removeAttr("disabled");
	}
}

function toggleShipmentTrucker(status){
	if(status=="ISSD" || status=="CANC"){
		$('#billTOshipment').attr("disabled","disabled");
		$('#billTOtrucker').attr("disabled","disabled");
		$('#billTOother').attr("disabled","disabled");
		$('#partyToShipment').attr("disabled","disabled");
		$('#trucker').attr("disabled","disabled");
		$('#otherParty').attr("disabled","disabled");
		$('#containerSave').attr("disabled","disabled");
	}
	else{
		$('#billTOshipment').removeAttr("disabled");
		$('#billTOtrucker').removeAttr("disabled");
		$('#billTOother').removeAttr("disabled");
		$('#partyToShipment').removeAttr("disabled");
		$('#trucker').removeAttr("disabled");
		$('#otherParty').removeAttr("disabled");
		$('#containerSave').removeAttr("disabled");
	}
}

function expandAll(){
	
	$('.containerAccordians').each(function(index) {
		var status = $(this).accordion('option', 'active');
		if (typeof status == "boolean" && !status) {
			$(this).accordion('option', 'active', 0);
		}
	});
	window.scrollTo(0, 0);
}
function collapseAll(){
	
	$('.containerAccordians').accordion('option', 'active', false);
}
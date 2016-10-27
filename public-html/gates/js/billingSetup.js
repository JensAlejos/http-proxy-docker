$(function() {
	$('#billingSetupForm').validationEngine('attach');

	tabSequence('#billingSetupForm');	
	var keyCode="";
	/* //Blurr the data for shpmnt no	
	 $('#shipmentNumber').blur(function(){
		   if($("#shipmentNumber").val()!=''){
			   $('#shipmentSequenceNumber').attr('disabled', false);
			}
    }); */ 
	 
	 
	 //added on click of enter key 
	 
	 $('#billingSetupForm').keypress(function(event) {
		    keyCode = (event.keyCode ? event.keyCode : event.which);
		    if (keyCode == '13') {
		    	//to hide auto complete result when not selected
		    	$('#shipmentNumber').autocomplete('close');
		    	$('#shipmentSequenceNumber').autocomplete('close');
		    	$('#billSetupGoBtn').trigger("click");
		    }
		});
	 
	 //added because of security
	 $('#billType').change(function(){
		    applySecurityforLinkandUnlink();
		    if($('#billType').val() == "HHGDS"){
		    	if( $('#responsiblePartyCode').val() == undefined || $('#responsiblePartyCode').val()== null || $('#responsiblePartyCode').val() == ""){
		    		$('#responsiblePartyCode').val("P");
		    	}
		    }
	 });
	 //addition end
	 //D028311
	 /*
	enforceSecurityDivAndButtons("billingSave",isbillsetupLink);
	enforceSecurityDivAndButtons("billingDelete",isbillsetupUnlink); */
	enforceSecurityDivAndButtons("holdRelease",isbillsetupHoldRelease);
	enforceSecurityDivAndButtons("shipmentDeleteBtn",isbillsetupDelete);
	buttonDisableAll();
	//clearPageOnLoad();
	
	// warning dialog
	 $( "#billingSetUpWarningDialog" ).dialog({
			autoOpen: false, 
			width: 450,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			},
			close : function() {
			
			},
			buttons : {
				
			"Continue": function(){
				saveBilling();
				  },
		       
		        Cancel: function() {

		        	 $("#billingSetUpWarningDialog").dialog('close');
		        }
			}
		});
	 
	$('#msgDiv').hide();

	$('#billSetupGoBtn').click(			
			function() {
				if(	$("#checkForLoadShipment").validationEngine('validate')){
					var shipment_number = $("#shipmentNumber").val();
		
					if (shipment_number == null || shipment_number == "") {
						showMadatoryBillMessage();
						return;
					}		
					
					showLoadingMessage();	
					//added to block UI
					blockUI();
				}
				removeErrorPointers();
				clearReplicateDialog();
				var shipment_number = $("#shipmentNumber").val();					 		
		 		
				$('#setupBillBtn').attr("disabled",true);
				$('#billingDelete').attr("disabled",true);
				$('#billingSave').attr("disabled",true);
				$('#setup').attr("disabled",true);
				$('#replicate').attr("disabled",true);
				$('#shipmentDeleteBtn').attr("disabled",true);
				$('#maintainBilling').attr("disabled",true);
				$('#charges').attr("disabled",true);
				$('#correction').attr("disabled",true);
				$('#proRateTotals').attr("disabled",true);
				$('#responsiblePartyCode').attr("disabled",true);
				$('#billType').attr("disabled",true);
				$('#manualSeqNo').attr("disabled",true);
				$('#dealerAuctionLocationCode').attr("disabled",true);
				$('#pod').attr("disabled",true);
				$('#clearPage').attr("disabled",true);
				$('#holdRelease').attr("disabled",true);
				$('#msgDiv').hide();				
				if (shipment_number == null || shipment_number == "") {
					//showMadatoryBillMessage();
					return;
				}	
				//reloadGrids();
				showLoadingMessage();				
				displayShipment();
				//enableDisableDebtorCode();
				$('#isChangedToGo').val("false");
				if($("#shipmentCorrectionNumber").val()!= '000' )
					$('#setupBillBtn').attr('disabled', true);
				else
					$('#setupBillBtn').attr('disabled', false);
				
			});
	var shpmtNbr = $(document).getUrlParam("shipmentNumber");
	
	if($('#shipmentNumber').val()=='' && shpmtNbr==''){
	
		clearPageOnLoad();
		
		}else{
			
		if(shpmtNbr==null){
			$('#billSetupGoBtn').trigger("click");
		}
		else{
			$('#shipmentNumber').val(shpmtNbr);
			$('#billSetupGoBtn').trigger("click");
		}
		
	}
	$('#shipmentSequenceNumber').change(function(){
		if($('#shipmentSequenceNumber').val()==null || 
				$('#shipmentSequenceNumber').val()=="" ||
				$('#shipmentSequenceNumber').val()== undefined){
			$("#shipmentCorrectionNumber").get(0).options.length = 0;
		//	$('#shipmentCorrectionNumber').attr('disabled', true);		
		}
					
		
	});
	
	$("#customerCommodityDesc").blur(function()
			{
				splitCommodity();
			});
	//code for port of discharge predictive search
	/*$('#pod')
	.gatesAutocomplete(
			{
				source : _context
						+ '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
				formatItem : function(item) {
					return item.cityCode + " " + item.cityName;
				},
				formatResult : function(item) {
					return item.cityCode + "-" + item.cityName;
				},
				select : function(item) {
					$('#portOfDischarge').val(item.cityCode);
					$('#pod').val(item.cityCode + "-" + item.cityName);
					$('#isChangedToGo').val("true");
				}
				
			});*/
	

	 $('#pod').gatesAutocomplete({
			source: _context+'/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
			formatItem: function(item) {
					return item.cityCode+"-"+item.cityName;
			},
			formatResult: function(item) {
					return item.cityCode+"-"+item.cityName;
			},
			select: function(item) {
				$('#pod').val(item.cityCode+"-"+item.cityName);
				$('#isChangedToGo').val("true");//to display error if this parameter is changed
			},
			autoSelectFirst:true,
			autoSelectCriteria:function(item){
				if(item.cityCode.toUpperCase()==$('#pod').val().toUpperCase())
					{
					return true;
					}
				else
					{
					return false;
					}
			}
	}); 
	
	/*$('#pod').change(function(){
		if($('#portOfDischarge').val()=="") {
			$('#pod').val("");
		}	
		});*/
		/*$('#pod').change(function(){
	if($('#portOfDischarge').val()=="" || $('#pod').val()=="" ||$('#pod').val()==null
			|| $('#pod').val()==undefined){
		
		$('#pod').val("");
		$('#portOfDischarge').val("");
	}	
	});*/
	
	
	clickMaintainBillBtn();
	clickCorrectionBtn();
	clickProRateTotalsBtn();
	clickChargesBtn();

	$('#shipmentSequenceNumber').val('');
	/*$('#shipmentSequenceNumber').attr('disabled', true);
	$('#shipmentCorrectionNumber').attr('disabled', true);*/
	
	var url =	_context+'/cas/autocomplete.do?method=searchApprovedShpmntNo&searchType=349'
	$('#shipmentNumber').gatesAutocomplete({
		source: url,
		minLength: 7,
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			//$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			$('#shipmentCorrectionNumber option').remove();
			$("#shipmentCorrectionNumber").get(0).options.length = 0;
			//$('#shipmentCorrectionNumber').attr('disabled', true);
			//written here to capture latest value for $('#shpmntNo').val()
			//code for shipment sequence no predictive search
					
			 }
	});
		
	 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354';
	 $('#shipmentSequenceNumber').gatesAutocomplete({
			source: url1,
			extraParams:{
				parentSearch:function() { return $('#shipmentNumber').val(); }
			},
			//minLength: 7,
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipmentSequenceNumber').val(data.sequenceNo);
				//$('#shipmentCorrectionNumber').attr('disabled', false);
			$.ajax({					
					type : "POST",
					url : _context +"/shipment/header/shipmentCorrectionNumberList",
					data : {
						shipmentNumber : $("#shipmentNumber").val(),
						shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
					},
					success : function(responseText) {
						var list= responseText.data.shipmentCorrectionNumberList;
						$('#shipmentCorrectionNumber option').remove();								
						$.each(list, function(index,codeDescription) {
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						});								
						document.getElementById("shipmentCorrectionNumber").selectedIndex=0;								
					}
				});
			}
		});

	 $('#shipmentNumber').change(function() {
		 if($('#shipmentNumberHidden').val()!=$('#shipmentNumber').val()){
			$('#shipmentSequenceNumber').val('');
			$('#shipmentCorrectionNumber option').remove();
			$("#shipmentCorrectionNumber").get(0).options.length = 0;
			/*$('#shipmentCorrectionNumber').attr('disabled', true);*/
			$('#responsiblePartyCode').attr("disabled",true);
			$('#billType').attr("disabled",true);
			$('#manualSeqNo').attr("disabled",true);
		 	}
		});
	 
	 

		$('#setupBillBtn').click(function() {
			blockUI();
				rateBill();
		});
		
		makeGridForReError("billingSetup");
		
		//code transferred from jsp to js 
		
		
		$('form input').change(function(){
			
			if(keyCode!=13) {
				if($(this).attr('id')!='manualSeqNo' &&  $(this).attr('id')!='isChangedToGo') {
				 	$('#isChanged').val("true");
				}
				
				if($(this).attr('id')!='manualSeqNo') {
				 	$('#isChangedToGo').val("true");
				}
			}
			keyCode="";
			});
		$('form select').change(function(){
			if(keyCode!=13) {
				$('#isChanged').val("true");
			}
			keyCode="";
		});
		$("input[type=checkbox]").click(function() {
			if(keyCode!=13)
				{
				$('#isChangedToGo').val("false");	
				}
			keyCode="";
		});
		$('#replicate').click(function()
				{
					if($('#isChanged').val() == "false") {
						if($('#shipmentSequenceNumber').val()=="" || $('#shipmentSequenceNumber').val()==null){
							 $('#shipmentSequenceNumber').validationEngine('showPrompt', 'This is Required', 'error', true);
							   return ;
						}
						if($('#shipmentCorrectionNumber').val()=="" || $('#shipmentCorrectionNumber').val()==null){
							 $('#shipmentSequenceNumber').validationEngine('showPrompt', 'This is Required', 'error', true);
							   return ;
						}
						if($('#highSeqNo').val()=="999")
							{
								if($('#manualSeqNo').val()=="")
									{
										$('#manualSeqNo').validationEngine('showPrompt', 'Highest bill seq# 999 already exists, please specify bill seq# manually ', 'error', true);
									  	 return ;
									}
							}
						$('#replicate_options').dialog('open');
					}
					else
						{
							alert('A search filter has been modified.Please search again for the new parameters');						
						}
				});
		//Dialog			
		$('#replicate_options').dialog({
			autoOpen: false,
			width: 900,
			modal: true,
			open : function() {
				tabSequenceCustom('#replicate_options',false,false);
			},
			close : function()
			{
				$('#isChanged').val("false");
				tabSequence('#billingSetupForm');	
				$('#shipmentNumber').focus();
			}
		});
		
		
		$('#clearReplicate').click(function() {
			clearReplicateDialog();
		});
		
		$('#cancelReplicate').click(function() {
			$('#isChanged').val("false");
			$('#replicate_options').dialog('close');
		});
		
		$('#okReplicate').click(function() {
			var RegEx = /^[0-9]+$/ ;
			var RegEx1=/^\d+(?:\.\d{1,2})?$/ ;
			
			if($('#pieceCount').val()!="")
				{
					if(!RegEx.test($('#pieceCount').val())) {
						alert("Please enter digits only in PC Count Field.");
						return false;
					} 
				}
			if($('#weight').val()!="")
				{
					if(!RegEx1.test($('#weight').val())) {
						alert("* Only positive numbers upto two Decimal allowed in Weight");
						return false;
					} 
				}
			if($('#cube').val()!="")
				{
					if(!RegEx1.test($('#cube').val())) {
						alert("* Only positive numbers upto two Decimal allowed in Cube");
						return false;
					}
				}
			if($('#responsiblePartyCode').val()!=$('#responsiblePartyCodeForRplct').val())
				{
					var con = confirm("Booking P/C Indicator is different. Continue (Y/N)?");
					if (con ==false)
					{
						return ;
					}
					else
					{
						continueReplicate();
					}
				}
			else{
					continueReplicate();
			    }
		});
		
		$('#shipmentSequenceNumber').change(function(){ removeErrorPointers();});
		
		applySecurity();
		
		$('#shipmentDeleteBtn').click(function() {		
			$("#deleteShipmentDialog").dialog('open');
		});
		
		$("#deleteShipmentDialog").dialog({
			autoOpen : false,
			width : 450,
			modal : true,
			title: "Delete bill",
			position: ['center','80'], 
			open : function() {
				$("#deleteShipmentDialog").dialog({height: 'auto'});
			},
			buttons:{
				OK: function() {
					blockUI();
					deleteShipment();
					$("#deleteShipmentDialog").dialog('close');
				}, 
				Close: function() {
				    $('#msgDiv').html('');
                    $('#msgDiv').hide();
					$("#deleteShipmentDialog").dialog('close');
				}
			}
		});

});

//Added for defect P2 - 19829 - Prarit
$(function() {
	$('#clearPage').click(function(){
		$('#shipmentNumber').val('');
		$('#shipmentSequenceNumber').val('');
		//$('#shipmentSequenceNumber').attr("disabled",true);
		$('#shipmentCorrectionNumber').text("");
		//$('#shipmentCorrectionNumber').attr("disabled",true);
		$('#dealerAuctionLocationCode').val('');
		$('#pod').val('');
		$('#responsiblePartyCode').text("");
		$('#responsiblePartyCode').attr("disabled",true);
		$('#manualSeqNo').val('');
		$('#manualSeqNo').attr("disabled",true);
		$('#highSeqNoSpan').text("");
		$('#organizationId').text("");
		$('#customerGroupName').text("");
		$('#organizationName').text("");
		$('#routingDetail').text(""); 
		$('#vvd').text("");
		$('#tradeDescription').text("");
		$('#statusCodeHeader').text("");
		$('#equipmentDetails').text("");
		$('#blOriginCityCode').text("");
		$('#customerGroupId').text("");
		$('#ldServiceCode').text("");
		$('#tradeCode').text("");
		$('#isAutobill').text("");
		$('#billType').text("");
		$('#billType').attr("disabled",true);
		$('#totalQuatityRequested').text("");
		$('#releaseByUser').text("");
		$('#vesselCode').text("");
		$('#setupBillBtn').attr("disabled",true);
		$('#billingDelete').attr("disabled",true);
		$('#billingSave').attr("disabled",true);
		$('#setup').attr("disabled",true);
		$('#replicate').attr("disabled",true);
		$('#shipmentDeleteBtn').attr("disabled",true);
		$('#maintainBilling').attr("disabled",true);
		$('#charges').attr("disabled",true);
		$('#correction').attr("disabled",true);
		$('#proRateTotals').attr("disabled",true);
		hideGrids();
		showClearedMessage();
		//document.getElementById("containerGridMain").style.display="hidden";
		/*$('#billType').attr("disabled",true);
		$('#manualSeqNo').attr("disabled",true);
		$('#setupBillBtn').attr("disabled",true);
		$('#billingDelete').attr("disabled",true);
		$('#billingSave').attr("disabled",true);
		$('#setup').attr("disabled",true);
		$('#replicate').attr("disabled",true);
		$('#maintainBilling').attr("disabled",true);
		$('#correction').attr("disabled",true);
		$('#proRateTotals').attr("disabled",true);
		$('#highSeqNoSpan').attr("disabled",true);*/
	});
});

function displayShipment(){
	
	$.ajax({
		type : "POST",
		url : _context + "/billingSetup/loadBookingDetails",
		data : {
			shipment_number : $("#shipmentNumber").val(),
			shipment_sequence_number :$("#shipmentSequenceNumber").val(),
			shipment_correction_number :$("#shipmentCorrectionNumber").val(),
			dalcCode:$("#dealerAuctionLocationCode").val(),
			portOfDischarge:$('#portOfDischarge').val(),
			pod:$('#pod').val()
		},
		success : function(responseText) {
			//	D021215: 	Session Variable clear/change shortcut
			getSearchFieldValue(500);
			// Clear fields of Shipment form and reset the defaults
			if(responseText.success==false){				
				
				clearPageOnLoad();
				reloadGrids();
				hideGrids();
				showResponseMessages("msgDiv", responseText);
				document.getElementById("containerGridMain").style.display="hidden";
				
				//added for unblocking UI
				$.unblockUI();
				
				resetHoldUnreleasedGrid();
				return;
			}
			if (responseText.success==true) {
				loadBillOfladdingDetails(responseText);
				createUnitGrid();
				createContainerGrid1();
				loadBLSUGrid(responseText);
				showResponseMessages("msgDiv", responseText);
				//showLoadedMessage();
				document.getElementById("containerGridMain").style.display="block";
				
				$('#responsiblePartyCode').attr("disabled",false);
				$('#billType').attr("disabled",false);
				$('#manualSeqNo').attr("disabled",false);
				$('#dealerAuctionLocationCode').attr("disabled",false);
				$('#pod').attr("disabled",false);
				$('#clearPage').attr("disabled",false);
				buttonEnableAll();
				enableBillSetupButton();
				enableReplicateButton();
				enableDeleteButton(responseText.data.shipmentNumber, responseText.data.shipmentSequenceNumber);
				disableBillSetupButton();
				openUnreleasedHoldGridOnIntialDisplay("billSetup");
				//openHoldsUnreleasedDialog('booking');
				 //added because of security
				// enforceSecurityDivAndButtons("billingSave",((isbillsetupMixedLink && ($('#billType').val()=='MIXED')) || (isbillsetupLink && ($('#billType').val()=='STANDARD')) || (isbillsetupHHGDSLink && ($('#billType').val()=='HHGDS'))));
				 //enforceSecurityDivAndButtons("billingDelete",((isbillsetupMixedUnlink && ($('#billType').val()=='MIXED')) || (isbillsetupUnlink && ($('#billType').val()=='STANDARD')) || (isbillsetupHHGDSUnlink && ($('#billType').val()=='HHGDS'))));
				 //addition end
				$('#shipmentNumberHidden').val($('#shipmentNumber').val());			
				//added to unblock UI
				$.unblockUI();
			}
			if($("#shipmentCorrectionNumber").val()!= '000' )
				$('#setupBillBtn').attr('disabled', true);
			else
				$('#setupBillBtn').attr('disabled', false);
				$('#isChanged').val('false');
			
			}
	});
}
 
function showNonExistBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Booking located, but requested B/L not found.</div>");
	$('#msgDiv').show();
}
function resetBillingSetupForm(billingSetupForm) {
    $('#billingSetupForm').each(function(){
    	this.reset();       
    });
   }

function clearPageOnLoad() {
	//$('#billingSetupForm').clearForm();
	$('#shipmentCorrectionNumber').val('');
	$('#dealerAuctionLocationCode').val('');
	$('#pod').val('');
	//$('#responsiblePartyCode').val('');
	$('#responsiblePartyCode').text("");
	//$('#billType').val('');
	$('#billType').text("");
	$('#highSeqNoSpan').text("");
	$('#organizationId').text("");
	$('#customerGroupName').text("");
	$('#organizationName').text("");
	$('#routingDetail').text(""); 
	$('#vvd').text("");
	$('#tradeDescription').text("");
	$('#equipmentDetails').text("");
	$('#blOriginCityCode').text("");
	$('#customerGroupId').text("");
	$('#ldServiceCode').text("");
	$('#tradeCode').text("");
	$('#highSeqNo').text("");
	$('highSeqNoSpan').text("");
	$('#isAutobill').text("");
	$('#totalQuatityRequested').text("");
	$('#releaseByUser').text("");
	$('#vesselCode').text("");
	$('#statusCodeHeader').text("");
}
/*
function resetBillingSetupForm() {
	document.getElementById('billingSetupForm').reset();
	$('#billingSetupForm').clearForm();
	resetDefault();
}
*/function resetDefault() {
	$('select').attr('selectedIndex', 0);
}

function showMadatoryBillMessage() {
			$('#msgDiv').html("<div class=\"message_error\">Please Provide Shipment Number </div>");
			$('#msgDiv').show();
		}

function showLoadedMessage() {
	$('#msgDiv').html(
	"<div class=\"message_info\">Successfully Loaded </div>");
$('#msgDiv').show();
}

function showClearedMessage() {
	$('#msgDiv').html(
	"<div class=\"message_info\">Successfully Cleared </div>");
$('#msgDiv').show();
}

function showSuccessFullyLinkUnlinkMessage() {
	$('#msgDiv').html(
	"<div class=\"message_success\">Successfully updated. </div>");
$('#msgDiv').show();
}



function showLoadingMessage() {
	
	/*var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
	if(shipment_sequence_number == null	|| shipment_sequence_number == "" || shipment_sequence_number==undefined){
		shipment_sequence_number="000";
	}
	if(shipment_correction_number == ""	|| shipment_correction_number == null ||shipment_correction_number==undefined){
		shipment_correction_number="000";
	}*/
	$('#msgDiv').html(
			"<div class=\"message_info\">Loading shipment </div>");
	$('#msgDiv').show();
}

$(function() {
	$('#setup').click(function(){
		setUpActionWarning();
		});
	});
$(function() {
	$('#billingSave').click(function(){
		if($('#isChangedToGo').val() == "false") {
			linkActionWarning();
			}
			else{
				$('#msgDiv').html("<div class=\"message_error\">A search filter has been modified.Please search again for the new parameters.</div>");
				//alert('A search filter has been modified.Please search again for the new parameters');
			}
		//linkActionWarning();
		});
});

$(function() {
	$('#billingDelete').click(function(){
		if($('#isChangedToGo').val() == "false") {
		deleteBilling();
		}
		else{
			$('#msgDiv').html("<div class=\"message_error\">A search filter has been modified.Please search again for the new parameters.</div>");
			//alert('A search filter has been modified.Please search again for the new parameters');
		}
		});
	});
function showSavingMessage(){
	var entity="";
	if($('#shipmentId').val()==''){
		$('#msgDiv').html("<div class=\"message_info\">Please wait while "+ entity +" is saved...</div>");
	}else{
		$('#msgDiv').html("<div class=\"message_info\">Please wait while "+ entity +" is updated...</div>");
	}
	window.scrollTo(0, 0);
	$('#msgDiv').show();
}

function linkActionWarning(){	
	var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	var length = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow').length;
	var unitlength = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow').length;
	var containerArrString="";	
	var loadDischargeServicePair = $('#loadDischargeServicePair').val();
	// Defect 25023
	// Added code to link the container automatically when clicked on link button in B/L SETUP
	var reccountConvGrid = $('#containerGrid').jqGrid('getDataIDs');
	if (reccountConvGrid.length == 1 && loadDischargeServicePair!=null && (loadDischargeServicePair.trim()=="CY" ||		
																loadDischargeServicePair.trim()=="AU" ||
																loadDischargeServicePair.trim()=="CON" || loadDischargeServicePair.trim()=="LCL")){		
		containerArrString = containerArrString+reccountConvGrid[0]+",";
	}
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="CY"){
		if(length<1){
			alert("Please select at least one Container");
			return ;
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}
		if($('#billType').val()!=null && $('#billType').val()=="HHGDS"){
			if(Math.abs(length)>1){
				alert(" Only One container can be selected ");
				return ;
			}
		}
		
	}
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="AU") {
		if(unitlength<1){
			alert("Please select at least one Unit");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
	}
	else if(loadDischargeServicePair!=null && (loadDischargeServicePair.trim()=="CON" || loadDischargeServicePair.trim()=="LCL")){
		if(unitlength<1 && length<1){
			alert("Please select items either from Containers or Unit Grids");
			return ;	
		}
		if(unitlength==0 && length==0){
			alert("Please select items either from Containers or Unit Grids");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}	
		
	}

	
	 $.ajax({
    	 
			type: "GET",
			url: _context +"/billingSetup/linkActionWarning",
			data:{
				containerArrString:containerArrString,
				linkageWarning:$('#warning').val(),
				linkageError:$('#error').val(),
				linkageSuccess:$('#success').val(),
				responsiblePartyCode:$('#responsiblePartyCode').val(),
				billTypeCode:$('#billType').val(),
				manualSeqNo:$('#manualSeqNo').val()
			},
			success: function(responseText){
				if(responseText.success==true){
				if(responseText.messages.warn.length>0){
					 $("#billingSetUpWarningDialog").dialog( "option", "title", 'Billing Set Up warning' );
			         $("#billingSetUpWarningDialog").dialog('open');
			         resetWarningMessageDiv();
			         loadBillOfladdingDetails(responseText);
			         setWarningMessage(responseText);
			      
  }
				else{
					saveBilling();
				}
				}
	 }});}




function setUpActionWarning(){
	 $.ajax({
    	 
			type: "GET",
			url: _context +"/billingSetup/setUpActionWarning",
			data:{
				
				linkageWarning:$('#warning').val(),
				linkageError:$('#error').val(),
				linkageSuccess:$('#success').val(),
				responsiblePartyCode:$('#responsiblePartyCode').val(),
				billTypeCode:$('#billType').val(),
				manualSeqNo:$('#manualSeqNo').val()
			},
			success: function(responseText){
				if(responseText.success==true){
				if(responseText.messages.warn.length>0){
					 $("#billingSetUpWarningDialog").dialog( "option", "title", 'Billing Set Up warning' );
			         $("#billingSetUpWarningDialog").dialog('open');
			         resetWarningMessageDiv();
			         loadBillOfladdingDetails(responseText);
			         setWarningMessage(responseText);
			      
}
				else{
					saveBillingWarning();
				}
			}
	 }});
}
	
function showRequest(formData, jqForm, options) { 
     
    var queryString = $.param(formData); 
  
    return true; 
} 
function showError(responseText, statusText, xhr, $form){
	
	$('#msgDiv').html("<div class=\"message_error\">Shipment Not saved...</div>");
} 
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
	
	$('#msgDiv').html("<div class=\"message_success\">Successfully Saved Data...</div>");
	reloadGrids();
   } 

/*function enableDisableDebtorCode(){
	var shipment_number= $.trim($("#shipmentNumber").val());
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	if ((( shipment_number!= null )&& ( shipment_number !="") && ( shipment_sequence_number!= null )&&
			( shipment_sequence_number !="") && ( shipment_correction_number!= null )&&
			( shipment_correction_number !=""))){
		$("#responsiblePartyCode").attr("disabled",true);
	}else{
		$("#responsiblePartyCode").attr("disabled",false);
		}
}*/
function disableBillSetupButton(){
var shipment_number= $.trim($("#shipmentNumber").val());
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	if ((( shipment_number!= null )&& ( shipment_number !="") && ( shipment_sequence_number!= null )&&
			( shipment_sequence_number !="") && ( shipment_correction_number!= null )&&
			( shipment_correction_number !=""))){
		 $('#setup').attr("disabled",true);		
 }
}

function deleteBilling(){
	if($('#shipmentSequenceNumber').val()=="" || $('#shipmentSequenceNumber').val()==null){
		 $('#shipmentSequenceNumber').validationEngine('showPrompt', 'This is Required', 'error', true);
		   return ;
	}
	if($('#shipmentCorrectionNumber').val()=="" || $('#shipmentCorrectionNumber').val()==null){
		 $('#shipmentSequenceNumber').validationEngine('showPrompt', 'This is Required', 'error', true);
		   return ;
	}
	
	var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	var length = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow').length;
	var unitlength = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow').length;
	var containerArrString="";
	var loadDischargeServicePair = $('#loadDischargeServicePair').val();
	if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="CY"){
		if(length<1){
			alert("Please select at least one Container");
			return ;
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}
	}
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="AU") {
		if(unitlength<1){
			alert("Please select at least one Unit");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
	}
	else if(loadDischargeServicePair!=null && (loadDischargeServicePair.trim()=="CON" || loadDischargeServicePair.trim()=="LCL" )){
		if(unitlength<1 && length<1){
			alert("Please select items either from Containers or Unit Grids");
			return ;	
		}
		if(unitlength==0 && length==0){
			alert("Please select items either from Containers or Unit Grids");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}	
		
	}
	blockUI();
	 $.ajax({
    	 
			type: "GET",
			url: _context +"/billingSetup/delete",
			data:{
				containerArrString:containerArrString
				
			},
		success: function(responseText){
			$.unblockUI()
			if(responseText.success==true){	
				displayShipment();
			 $.unblockUI();
			}
		//	 showSuccessFullyLinkUnlink();
			if (responseText.messages.error.length == 0) {
				//clearAndResetBillingScreen();
			//		a	
			
				//makeFormReadOnly('billingSetupForm',false);
							}
			//Messages
			showResponseMessages("msgDiv", responseText);
			
			//reloadGrids();
			$('#msgDiv').show();
			
			}
	});
}

function clearAndResetBillingScreen(){
	$('#msgDiv').html("");
	$('#billingSetupForm').clearForm();
	resetDefault();
	
}
function resetDefault(){
	$('select').attr('selectedIndex',0);	
}
function reloadGrids(){
	jQuery("#containerGrid").trigger('reloadGrid');
	jQuery("#unitGrid").trigger('reloadGrid');
}

function buttonDisableAll(){
	$('#setupBillBtn').attr("disabled",true);
	$('#billingDelete').attr("disabled",true);
	$('#billingSave').attr("disabled",true);
	$('#replicate').attr("disabled",true);
	$('#shipmentDeleteBtn').attr("disabled",true);	
	$('#setup').attr("disabled",true);
	$('#maintainBilling').attr("disabled",true);
	$('#charges').attr("disabled",true);
	$('#correction').attr("disabled",true);
	$('#proRateTotals').attr("disabled",true);
	$('#holdRelease').attr("disabled",true);

}
function buttonEnableAll(){	
	$('#setupBillBtn').attr("disabled",false);
	$('#billingSave').attr("disabled",false);
	//$('#replicate').attr("disabled",false);	
	$('#maintainBilling').attr("disabled",false);
	$('#charges').attr("disabled",false);
	$('#correction').attr("disabled",false);
	$('#proRateTotals').attr("disabled",false);
	//D024858: Unlink action is not valid when booking is displayed
	if($('#shipmentNumber').val()!="" && $('#shipmentNumber').val()!=null &&
		 $('#shipmentSequenceNumber').val()!="" && $('#shipmentSequenceNumber').val()!=null  && 
		 	$('#shipmentCorrectionNumber').val()!=null){
		$('#billingDelete').attr("disabled",false);
	}
}

function hideGrids(){
	
	document.getElementById("unitGridMain").style.display="none";
	document.getElementById("containerGridMain").style.display="none";
	
}
function loadBillOfladdingDetails(responseText){

	$("#billingSetupForm").loadJSON(responseText.data);
	$('#shipmentId').val(responseText.data.shipmentId);
	$('#entityVersion').val(responseText.data.entityVersion);
	$('#bookingId').val(responseText.data.bookingId);
	$('#organizationId').val(responseText.data.organizationId);
	$('#customerGroupId').val(responseText.data.customerGroupId);
	$('#vesselCode').val(responseText.data.vesselCode);
	$('#voyage').val(responseText.data.voyage);
	$('#directionSeq').val(responseText.data.directionSeq);
	$('#loadServiceCode').val(responseText.data.loadServiceCode);
	$('#dischargeServiceCode').val(responseText.data.dischargeServiceCode);
	$('#tradeCode').val(responseText.data.tradeCode);
	$('#responsiblePartyCodeHidden').val(responseText.data.responsiblePartyCodeHidden);
	$('#responsiblePartyCode').val(responseText.data.responsiblePartyCode);
	if(responseText.data.billType==null || responseText.data.billType==""){
		$('#billType').val("STANDARD");
	}else{
		$('#billType').val(responseText.data.billType);
	}
	$('#billTypeHidden').val(responseText.data.gridCount);
	$('#gridCount').val(responseText.data.gridCount);
	$('#shipmentNumber').val(responseText.data.shipmentNumber);
	$('#shipmentSequenceNumber').val(responseText.data.shipmentSequenceNumber);
	$('#shipmentCorrectionNumber').val(responseText.data.shipmentCorrectionNumber);
	$('#statusCode').val(responseText.data.statusCode);
	if(responseText.data.statusCode == null){
		$('#statusCodeHeader').text(responseText.data.bookingStatusCode);
	}else{
		$('#statusCodeHeader').text(responseText.data.statusCode);
	}
	$('#dealerAuctionLocationCode').val(responseText.data.dealerAuctionLocationCode);
	$('#portOfDischarge').val(responseText.data.portOfDischarge);
	$('#manualSeqNo').val(responseText.data.manualSeqNo);
	$('#organizationName').text(responseText.data.organizationName);
	$('#routingDetail').text(responseText.data.routingDetail);
	$('#customerGroupName').text(responseText.data.customerGroupName);
	$('#vvd').text(responseText.data.vvd);
	$('#ldServiceCode').text(responseText.data.ldServiceCode);
	$('#tradeDescription').text(responseText.data.tradeDescription);
	$('#highSeqNoSpan').text('/ '+responseText.data.highSeqNo);
	$('#isAutobill').text(responseText.data.isAutobill);
	$('#totalQuantityRequested').text(responseText.data.totalQuantityRequested);
	$('#bookingFreightCount').text(responseText.data.bookingFreightCount);
	$('#shipmentFreightCount').text(responseText.data.shipmentFreightCount);
	$('#equipmentDetails').text(responseText.data.equipmentDetails);
	$('#releaseByUser').text(responseText.data.releaseByUser);
	$('#warning').val(responseText.data.warning);
	$('#error').val(responseText.data.error);
	$('#success').val(responseText.data.success);
	$('#pieceCount').val(responseText.data.pieceCount);
	$('#kind').val(responseText.data.kind);
	$('#governmentBillOfLadingNbr').val(responseText.data.governmentBillOfLadingNbr);
	
	
	$('#weight').val(responseText.data.weight);
	$('#cube').val(responseText.data.cube);
	$('#customerCommodityDesc').val(responseText.data.customerCommodityDesc);
	$('#loadDischargeServicePair').val(responseText.data.loadDischargeServicePair);
	loadResponsiblePartyCode(responseText);
	
	var list= responseText.data.shipmentCorrectionNumberList;
	if(list !=  undefined){
		$('#shipmentCorrectionNumber option').remove();
		var shipmentCorrectionNumberOption='';
		$.each(list, function(index,codeDescription) {
			$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
			shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
		});
		$("#shipmentCorrectionNumber").val(responseText.data.shipmentCorrectionNumber);
		$('#shipmentCorrectionNumber').attr('disabled', false);
	}
	
	//enableDisableDebtorCode();
	
	loadBillType(responseText);

	}
function loadResponsiblePartyCode(responseText){
	  $("#responsiblePartyCode").get(0).options.length = 0;
	  $.each(responseText.data.responsiblePartyCodeList, function(index, responsiblePartyCodeList) {
            $("#responsiblePartyCode").get(0).options[$("#responsiblePartyCode").get(0).options.length] = new Option(responsiblePartyCodeList.description, responsiblePartyCodeList.code);
        });
	  var responsiblePartyCode = responseText.data.responsiblePartyCode;
	  $("#responsiblePartyCode").val( responsiblePartyCode );
	  
	  //this field in used in replicate overlay
	  $("#responsiblePartyCodeForRplct").val( responsiblePartyCode );

}

function loadResponsiblePartyCodeRplct(responseText){
	  $("#responsiblePartyCodeForRplct").get(0).options.length = 0;
	  $.each(responseText.data.responsiblePartyCodeList, function(index, responsiblePartyCodeList) {
          $("#responsiblePartyCodeForRplct").get(0).options[$("#responsiblePartyCodeForRplct").get(0).options.length] = new Option(responsiblePartyCodeList.description, responsiblePartyCodeList.code);
      });
	  var responsiblePartyCode = responseText.data.responsiblePartyCode;
	  $("#responsiblePartyCodeForRplct").val( responsiblePartyCode );

}

function loadBillType(responseText){
	  $("#billType").get(0).options.length = 0;
	  $.each(responseText.data.billTypeList, function(index, billTypeList) {
            $("#billType").get(0).options[$("#billType").get(0).options.length] = new Option(billTypeList.description, billTypeList.code);
        });
	  var billType = responseText.data.billType;
	  if(responseText.data.billType==null || responseText.data.billType==""){
			$('#billType').val("STANDARD");
		}else{
			$("#billType").val( billType );
		}
	  

}
function loadBLSUGrid(responseText){
	var loadServiceCodeVal = responseText.data.loadServiceCode;
	var shipmentSeqNumber = responseText.data.shipmentSequenceNumber;
	var shipmentCorrectionNumber = responseText.data.shipmentCorrectionNumber;
	
	var dischargeServiceCodeVal = responseText.data.dischargeServiceCode;
	$.ajax({
	url: _context +"/billingSetup/getLoadDschPair?loadServiceCode="+loadServiceCodeVal+"&dischargeServiceCode="+dischargeServiceCodeVal,
	success: function(responseText){
		var gridData = responseText.data.loadDschServiceGroupCode;
		var isRequireReceivedFreight = responseText.data.isRequireReceivedFreight;
		var isRequireReceivedUnit = responseText.data.isRequireReceivedUnit;
		//alert("isRequireReceivedUnit="+isRequireReceivedUnit);
		$("#isRequireReceivedUnit").val(isRequireReceivedUnit);
		//alert($("#isRequireReceivedUnit").val());
		$("#isRequireReceivedFreight").val(isRequireReceivedFreight);
		if(gridData !=null ){
			if($.trim(gridData) == "CY"){
				
				$("#containerGrid").trigger('reloadGrid');
				document.getElementById("containerGridMain").style.display="block";
				document.getElementById("unitGridMain").style.display="none";
			}else if($.trim(gridData) == "AU" || $.trim(gridData)=="LCL"){
				
				$("#unitGrid").trigger('reloadGrid');
				document.getElementById("containerGridMain").style.display="none";
				document.getElementById("unitGridMain").style.display="block";			
			}else if ($.trim(gridData)=="CON"  ){
				/*if(isRequireReceivedUnit == "N" && shipmentSeqNumber==null && shipmentCorrectionNumber==null){
					$('#setup').attr("disabled",false);
				}else{
					$('#setup').attr("disabled",true);
				}*/
				
				$("#containerGrid").trigger('reloadGrid');
				$("#unitGrid").trigger('reloadGrid');
				document.getElementById("containerGridMain").style.display="block";
				document.getElementById("unitGridMain").style.display="block";
			}
		}
			}
		
});
}
function showResponseMessages(msgDivId, responseText) {
	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {

				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
	}
}

function setWarningMessage(responseText){
	var length = responseText.messages.warn.length;
	for(var i=0; i<length;i++){
		if(responseText.messages.warn[i]=="This is an Autobill Booking."){
			$('#autoBillingWarning').text(responseText.messages.warn[i]);
			document.getElementById("autoBillingDiv").style.display="block";
		}
		if(responseText.messages.warn[i]=="Destination Ports are not the same. OVERRIDE ?"){
			$('#diffDestinationPortWarning').text(responseText.messages.warn[i]);
			document.getElementById("diffDestinationPortDiv").style.display="block";
		}
		if(responseText.messages.warn[i]=="Selected freight is oversized."){
			$('#overSizedWarning').text(responseText.messages.warn[i]);
			document.getElementById("overSizedDiv").style.display="block";
		}
		if(responseText.messages.warn[i]=="Booking P/C Indicator is different."){
			$('#debtorTypeWarning').text(responseText.messages.warn[i]);
			document.getElementById("debtorTypeDiv").style.display="block";
		}
		
		if(responseText.messages.warn[i]=="Bill to party does not match CP."){
			$('#billToPartyChangeWarning').text(responseText.messages.warn[i]);
			document.getElementById("billToPartyChangeDiv").style.display="block";
		}
		
	}
}
function resetWarningMessageDiv(){
	document.getElementById("autoBillingDiv").style.display="none";
	document.getElementById("diffDestinationPortDiv").style.display="none";
	document.getElementById("overSizedDiv").style.display="none";
	document.getElementById("debtorTypeDiv").style.display="none";
	document.getElementById("billToPartyChangeDiv").style.display="none";
	$('#autoBillingWarning').text("");
	$('#diffDestinationPortWarning').text("");
	$('#overSizedWarning').text("");
	$('#debtorTypeWarning').text("");
	$('#billToPartyChangeWarning').text("");
}
function saveBilling(){
	var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	var length = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow').length;
	var unitlength = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow').length;
	var containerGridLength = $("#containerGrid").getGridParam("reccount");
	 var autoGridLength = $("#unitGrid").getGridParam("reccount");	
	var containerArrString="";
	var loadDischargeServicePair = $('#loadDischargeServicePair').val();	
	// Defect 25023
	// Added code to link the container automatically when clicked on link button in B/L SETUP
	var reccountConvGrid = $('#containerGrid').jqGrid('getDataIDs');
	if (reccountConvGrid.length == 1 && loadDischargeServicePair!=null && (loadDischargeServicePair.trim()=="CY" ||		
																loadDischargeServicePair.trim()=="AU" ||
																loadDischargeServicePair.trim()=="CON" || loadDischargeServicePair.trim()=="LCL")){		
		containerArrString = containerArrString+reccountConvGrid[0]+",";
	}
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="CY"){
		if(length<1){
			alert("Please select at least one Container");
			return ;
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}
	}
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="AU") {
		if(unitlength<1){
			alert("Please select at least one Unit");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
	}/*
	else if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="CON" &&
			(Math.abs(containerGridLength))==0 && (Math.abs(autoGridLength))==0 ){
		saveBillingWarning();
	}*/	
	else if(loadDischargeServicePair!=null && ( loadDischargeServicePair.trim()=="CON" || loadDischargeServicePair.trim()=="LCL" ) && ((Math.abs(containerGridLength))!= 0 
			|| (Math.abs(autoGridLength))!= 0 )){
				
		if(unitlength<1 && length<1){
			alert("Please select items either from Containers or Unit Grids");
			return ;	
		}
		if(unitlength==0 && length==0){
			alert("Please select items either from Containers or Unit Grids");
			return ;
		}
		for(var x=0; x<unitlength;x++){
			containerArrString = containerArrString+unitArr[x]+",";
			
		}
		for(var x=0; x<length;x++){
			containerArrString = containerArrString+containerArr[x]+",";
			
		}	
		
	}

		blockUI();
	$.ajax({
	type: "GET",
	url: _context +"/billingSetup/save",
	data:{
		containerArrString:containerArrString,
		responsiblePartyCode:$('#responsiblePartyCode').val(),
		billTypeCode:$('#billType').val(),
		manualSeqNo:$('#manualSeqNo').val()
		},
		success: function(responseText){
			$.unblockUI()
			if(responseText.success==true){
				if (responseText.data.rateView == "hold"){
					navigateToTargetPage('',responseText.data.targetPage, 
							responseText.data.shipmentNumber, responseText.data.shipmentSequenceNumber,
							responseText.data.shipmentCorrectionNumber,"BLSP");
				} else {
					loadBillOfladdingDetails(responseText);
					loadBLSUGrid(responseText);
					disableBillSetupButton();
					enableReplicateButton();
					enableDeleteButton(responseText.data.shipmentNumber, responseText.data.shipmentSequenceNumber);
					showSuccessFullyLinkUnlinkMessage();
					//showLoadedMessage();
					document.getElementById("containerGridMain").style.display="block";
					buttonEnableAll();
					$("#containerGrid").trigger('reloadGrid');	
					displayShipment();
					//$("#containerGrid").trigger('reloadGrid');
					 $("#billingSetUpWarningDialog").dialog('close');
				}
			}else{
				 $("#billingSetUpWarningDialog").dialog('close');
				showResponseMessages("msgDiv",responseText);
			}
			
		}
		});
}

function removeErrorPointers() {
	$('form[name="billingSetupForm"]').validationEngine('hideAll');
}

function validateMandatoryFields(){
	
	
}

/*function enableBillSetupButton(){
 var containerGridLength = $("#containerGrid").getGridParam("reccount");
 var autoGridLength = $("#unitGrid").getGridParam("reccount");
 var enableSetup ="false";
 if((Math.abs(containerGridLength))==0 && (Math.abs(autoGridLength))==0 ){
	 enableSetup= "true";
 }
 if(enableSetup=="true"){
	 if($('#loadDischargeServicePair').val()!=null && $('#loadDischargeServicePair').val().trim()=="CON"){
		 enableSetup = "true"; 
	 } else{
	
		 enableSetup = "false";
	 }
 }
 if(enableSetup=="true"){
	 $('#setup').attr("disabled",false);
	}

}*/
function enableBillSetupButton(){
	 if($('#loadDischargeServicePair').val()!=null && ($('#loadDischargeServicePair').val().trim()=="CON" || $('#loadDischargeServicePair').val().trim()=="LCL")){
	if($('#gridCount').val()== true || $('#gridCount').val()== "true" ){
		$('#setup').attr("disabled",false);
		$('#billingDelete').attr("disabled",true);
		$('#billingSave').attr("disabled",true);
		
	}else{
		$('#setup').attr("disabled",true);
	} 
  }
}
//D030627: 	BLSU more friendly: session variable
 function clickMaintainBillBtn(){
	
 	$("#maintainBilling").click(function() {
 		
 		var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
 		var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
 		var shipment_number = $("#shipmentNumber").val();
 		var shipment_sequence_number = null;
 		var shipment_correction_number = null;
 		var shpFlag = true;
 		
 		if(containerArr.length > 0){
 			for (var i = 0; i < containerArr.length; i++) {
 	 			shipment_sequence_number = jQuery("#containerGrid").getRowData(containerArr[i]).seq;
 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
 	 				break;
 	 			}
 			}
 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
 				$('#msgDiv').html("<div class=\"message_error\">Selected container is not linked to any Bill</div>");
 				$('#msgDiv').show();
 				return;
 			}
 		} else if (unitArr.length > 0){
 			for (var i = 0; i < unitArr.length; i++) {
 	 			shipment_sequence_number = jQuery("#unitGrid").getRowData(unitArr[i]).seq;
 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
 	 				break;
 	 			}
 			}
 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
 				$('#msgDiv').html("<div class=\"message_error\">Selected unit is not linked to any Bill</div>");
 				$('#msgDiv').show();
 				return;
 			}
 		} else {
 			shipment_sequence_number = $("#shipmentSequenceNumber").val();
 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
 	 			shipment_sequence_number="000";
 	 			shpFlag = false;
 	 		}
 			shipment_correction_number = $("#shipmentCorrectionNumber").val();
 		}
 		if(shipment_correction_number == ""	|| shipment_correction_number == null){
 			shipment_correction_number="000";
 		}
 		
 		var url = "";
 		if($('#billType').val()!="HHGDS"){
 			if(!shpFlag){
 				url = "/shipment/showForm?firstPage=BLSP";
 			}else{		
 				url = "/shipment/showForm?shipment_number="+shipment_number+"&shipment_sequence_number="+shipment_sequence_number+
 				"&shipment_correction_number="+shipment_correction_number+"&src=FTWQ&firstPage=BLSP";
 			}
 			
 		}else{
 			var equipmentId = "";
			var reccountConvGrid = $('#containerGrid').jqGrid('getDataIDs');
			for (var i = 0; i < reccountConvGrid.length; i++) {
				if(jQuery("#containerGrid").getRowData( $('#containerGrid').jqGrid('getDataIDs')[i]).billLinked == "Yes"){
					
					equipmentId = jQuery("#containerGrid").getRowData( $('#containerGrid').jqGrid('getDataIDs')[i]).equipmentId;
					break;
				}
			} 			
 			url = "/houseHoldShipment/showForm?equipmentId="+equipmentId+"&firstPage=BLSP";
 			
 		}
 		window.location = _context + url;
 			
 	}	);
 	
 	}
 
 function clickChargesBtn(){
		
	 	$("#charges").click(function() {
	 		
	 		var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	 		var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	 		var shipment_number = $("#shipmentNumber").val();
	 		var shipment_sequence_number = null;
	 		var shipment_correction_number = null;
	 		var shpFlag = true;
	 		
	 		if(containerArr.length > 0){
	 			for (var i = 0; i < containerArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#containerGrid").getRowData(containerArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected container is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else if (unitArr.length > 0){
	 			for (var i = 0; i < unitArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#unitGrid").getRowData(unitArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected unit is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else {
	 			shipment_sequence_number = $("#shipmentSequenceNumber").val();
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 	 			shipment_sequence_number="000";
	 	 			shpFlag = false;
	 	 		}
	 			shipment_correction_number = $("#shipmentCorrectionNumber").val();
	 		}
	 		if(shipment_correction_number == ""	|| shipment_correction_number == null){
	 			shipment_correction_number="000";
	 		}
	 		
	 		var url = "";

 			if(!shpFlag){
 				url = "/maintainRate/showform?navigationUrl=billingSetup&firstPage=BLSP";
 			}else{		
 				url = "/maintainRate/loadShipmentDetails?shipmentNumber="+shipment_number+"&shipmentSequenceNumber="+shipment_sequence_number+
 				"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=billingSetup&firstPage=BLSP";
 			}
	 			
	 		
	 		window.location = _context + url;
	 			
	 	});
	 	
}
	 
 
 
 function clickCorrectionBtn(){
	 $('#correction').click(function(){
		 var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	 		var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	 		var shipment_number = $("#shipmentNumber").val();
	 		var shipment_sequence_number = null;
	 		var shipment_correction_number = null;
	 		
	 		if(containerArr.length > 0){
	 			for (var i = 0; i < containerArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#containerGrid").getRowData(containerArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected container is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else if (unitArr.length > 0){
	 			for (var i = 0; i < unitArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#unitGrid").getRowData(unitArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected unit is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else {
	 			shipment_sequence_number = $("#shipmentSequenceNumber").val();
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 	 			shipment_sequence_number="000";
	 	 		}
	 			shipment_correction_number = $("#shipmentCorrectionNumber").val();
	 		}
	 		if(shipment_correction_number == ""	|| shipment_correction_number == null){
	 			shipment_correction_number="000";
	 		}
	 		
	 		var url = "/bill/frtcorrection/find?shipmentNumber="+shipment_number+"&shipmentSequenceNumber="+shipment_sequence_number+
	 			"&shipmentCorrectionNumber="+shipment_correction_number+"&source=SETUP";
	 		window.location = _context + url;
	 			
	 	}	);
	 	
		}
	 

 function clickProRateTotalsBtn(){
	 $('#proRateTotals').click(function(){
	 		
		 var containerArr = jQuery("#containerGrid").jqGrid('getGridParam','selarrrow');
	 		var unitArr = jQuery("#unitGrid").jqGrid('getGridParam','selarrrow');
	 		var shipment_number = $("#shipmentNumber").val();
	 		var shipment_sequence_number = null;
	 		var shipment_correction_number = null;
	 		
	 		if(containerArr.length > 0){
	 			for (var i = 0; i < containerArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#containerGrid").getRowData(containerArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected container is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else if (unitArr.length > 0){
	 			for (var i = 0; i < unitArr.length; i++) {
	 	 			shipment_sequence_number = jQuery("#unitGrid").getRowData(unitArr[i]).seq;
	 	 			if(shipment_sequence_number != null && shipment_sequence_number != ""){
	 	 				break;
	 	 			}
	 			}
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 				$('#msgDiv').html("<div class=\"message_error\">Selected unit is not linked to any Bill</div>");
	 				$('#msgDiv').show();
	 				return;
	 			}
	 		} else {
	 			shipment_sequence_number = $("#shipmentSequenceNumber").val();
	 			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
	 	 			shipment_sequence_number="000";
	 	 		}
	 			shipment_correction_number = $("#shipmentCorrectionNumber").val();
	 		}
	 		if(shipment_correction_number == ""	|| shipment_correction_number == null){
	 			shipment_correction_number="000";
	 		}
	 		
	 		var url = "/cas/proRateWtCubeSearch.do?shipmentNumber="+shipment_number+"&filterValue2="+shipment_sequence_number+
	 			"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2&reset=true";
	 		window.location = _context + url;
	 			
	 	}	);
	 	
		}
 
 
 function saveBillingWarning(){
		
		var containerArrString="";
		
			blockUI();
		$.ajax({
		type: "GET",
		url: _context +"/billingSetup/save",
		data:{
			containerArrString:containerArrString,
			responsiblePartyCode:$('#responsiblePartyCode').val(),
			billTypeCode:$('#billType').val(),
			manualSeqNo:$('#manualSeqNo').val()
			},
			success: function(responseText){
				$.unblockUI();
				if(responseText.success==true){
					//displayShipment();
					loadBillOfladdingDetails(responseText);
					loadBLSUGrid(responseText);
					showLoadedMessage();
					document.getElementById("containerGridMain").style.display="block";
					buttonEnableAll();
					enableBillSetupButton();
					enableReplicateButton();
					enableDeleteButton(responseText.data.shipmentNumber, responseText.data.shipmentSequenceNumber);
					disableBillSetupButton();
					
					
					$("#containerGrid").trigger('reloadGrid');
					 $("#billingSetUpWarningDialog").dialog('close');
					
				}else{
					 $("#billingSetUpWarningDialog").dialog('close');
					showResponseMessages("msgDiv",responseText);
				}
				
			}
			});
	}
 
 /*function clickShipmentGoBtn(){
	 $('#billSetupGoBtn').trigger('click');
		$('#billSetupGoBtn').click(
				
				function() {
					if(	$("#checkForLoadShipment").validationEngine('validate')){
					var shipment_number = $("#shipmentNumber").val();
		
					if (shipment_number == null || shipment_number == "") {
						showMadatoryBillMessage();
						return;
					}		
					showLoadingMessage();
					displayShipment();
				}});
	}*/
 function enableReplicateButton(){
	 var loadDischargeServicePair = $('#loadDischargeServicePair').val();
	 
		if(loadDischargeServicePair!=null && loadDischargeServicePair.trim()=="CY"){
		
	 if($('#shipmentSequenceNumber').val()!="" && $('#shipmentSequenceNumber').val()!=null){
		 $('#replicate').attr("disabled",false);
	 }	
   }
 }
	function wordwrapfirstline( str, width, secondwidth) {
		 
	    var brk =  '\n';
	    width = width || 75;
	    var  cut = true;
	 
	    if (!str) { return str; }
	 
	    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
	 
	    var result = str.match( RegExp(regex, '') )[0];
	    console.log(str.substring(result.length));
	    
	    return result.trim() + brk + wordwrap2Columns(str.substring(result.length),secondwidth);
	 
	}
	function wordwrap( str, width ) {
		 
	    var brk =  '\n';
	    width = width || 75;
	    var  cut = true;
	 
	    if (!str) { return str; }
	 
	    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
	 
	    var result = str.match( RegExp(regex, 'g') );
	    for(var i=0;i<result.length;i++) {
	    	result[i] = result[i].trim();
	    }
	    
	    return result.join( brk );
	 
	}
	
	
	function wordwrap2Columns( str, width ) {
		 
	    var brk =  '\n';
	    width = width || 75;
	    var  cut = true;
	 
	    if (!str) { return str; }
	 
	    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
	 
	    var result = str.match( RegExp(regex, 'g') );
	    var output = "";
	    for(var i=0;i<result.length;i++) {
	    	console.log("i"+i+" ="+ result[i]+";");
	    	result[i] = result[i].trim();
	    	output += result[i];
	    	if(i == (result.length-1)) {
	    		// do nothing
	    	} else if(i%2 == 0) {
	    		output += " ";
	    	} else {
	    		output += "\n";
	    	}
	    	
	    }
	    
	    return output;
	 
	}
	function splitCommodity()
	{ 
		
		var i=0;j=0,k=0;
		var commDesc = $("#customerCommodityDesc").val();
		var newCommDesc ="";
		var splittedString;
		var finalcommDesc="";
		newCommDesc = commDesc.split('\n')
		for(k=0;k<newCommDesc.length;k++)
		{
			if(k ==0) // first line can only be 30 characters
			{
				if(newCommDesc[k].length <= 30) {
					console.log("do nothing");
					finalcommDesc = finalcommDesc + newCommDesc[k] + '\n';
				} else {
					var firstline = wordwrapfirstline(newCommDesc[k],30,30);
					console.log("firstline= "+firstline);
					finalcommDesc = finalcommDesc + firstline+ '\n';
				}
			} else 
			{
				console.log("original="+newCommDesc[k]);
				console.log("original="+newCommDesc[k].length);
				if(newCommDesc[k].length <= 30) {
					console.log("do nothing");
					finalcommDesc = finalcommDesc + newCommDesc[k] + '\n';
				} else {
					console.log("wordwrap "+wordwrap2Columns(newCommDesc[k],30));
					finalcommDesc = finalcommDesc + wordwrap2Columns(newCommDesc[k],30)+ '\n';
				}
			}
		}
		// remove trailing '\n'
		finalcommDesc = finalcommDesc.substring(0,finalcommDesc.length-1);
		$("#customerCommodityDesc").val(finalcommDesc);
	}
	
 function enableDeleteButton(shipmentNumber, shipmentSequenceNumber){
     $('#deleteMsg').text('Do you really want to delete bill ' + shipmentNumber + '-' + (shipmentSequenceNumber ? shipmentSequenceNumber : '000'));

	 if($('#shipmentNumber').val()!="" && $('#shipmentNumber').val()!=null &&
			 $('#shipmentSequenceNumber').val()!="" && $('#shipmentSequenceNumber').val()!=null  && 
			 	$('#shipmentCorrectionNumber').val()!=null)
	 {
		 $('#shipmentDeleteBtn').attr("disabled",false);
	 }	
 }
 
 function rateBill(){
		
		var queryString = $("#billingSetupForm").formSerialize();
		$.ajax({
			type : "POST",
			url : _context + "/billingSetup/rateBill",
			data : queryString,
			success : function(responseText) {
				$.unblockUI();
				if(responseText.success==false){
					showResponseMessages("msgDiv", responseText);
					return;
				}
				if (responseText.messages.error.length == 0) {
					
					if(responseText.data.rateView == "showError"){
						$("#billingSetupForm").loadJSON(responseText.data);
						loadErrorOverLay(responseText);						
						$('#re_error_dialog').dialog( "open" );
						$("#reErrorGrid").trigger('reloadGrid');
					}else if(responseText.data.rateView == "showChoices"){
						$("#billingSetupForm").loadJSON(responseText.data);
						loadChoiceOverLay(responseText);
						$('#reUseSelection').val('S');
						$('#re_choice_dialog').dialog( "open" );
//						createChoiceGrid('/billLadingPayable');
						$("#reChoiceGrid").trigger('reloadGrid');
					}else if (responseText.data.rateView == "hold"){
//						if(responseText.data.targetPage == "Bill SetUp"){
//							openHoldsUnreleasedDialog('shipment','/billingSetup/loadUnreleasedHolds');
//							$("#holdsUnreleased").attr("style","visibilty:visible");
//							$('#holdUnreleasedGrid').trigger('reloadGrid');
//							$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");							
//						}else{
							navigateToTargetPage('',responseText.data.targetPage, 
									$("#shipmentNumber").val(), $("#shipmentSequenceNumber").val(),$("#shipmentCorrectionNumber").val(),
									"BLFP");

//						}
					}if(responseText.data.rateView == "exception"){
						$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
						return;
					}else if(responseText.data.rateView == "blank"){
						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//						openHoldsUnreleasedDialog('shipment');
					}
					else if(responseText.data.rateView == "Success"){
						showResponseMessages("msgDiv", responseText);
						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
						$("#shipmentNumber").val()+'&shipmentSequenceNumber='+$("#shipmentSequenceNumber").val()
						+'&shipmentCorrectionNumber=000&navigationUrl=billingSetup&commodityDisplay=last';
					}
					
				}
			}
		});
 }
 
 
 //code transferred from jsp to js
 // D026302 disable checkbox for status P or X
 
 function disableIncompleteAssignments() {
		var rowIDs = jQuery("#containerGrid").getDataIDs();
		for (var i=0;i<rowIDs.length;i=i+1) {
			var trElement = jQuery("#"+ rowIDs[i],jQuery('#containerGrid'));
			// [7] is equipmentStatusType
			if($(trElement.children()[7]).text()=='P' || $(trElement.children()[7]).text()=='X'){
				// [0] is the checkbox
				$(trElement.children()[0]).html("");
				$(trElement).addClass("ui-state-disabled");
				
				//$(trElement.children()[0].children[0]).attr("disabled","disabled");
			}
		}
	 
 }
 
 
 function ButtonDisableOnLoad(){
		$("input[type=checkbox]").click(function() {
			 var elements = $("input[type=checkbox]");
			 var anyOneChecked=false;
			 jQuery.each(elements, function(element) {
			     var checked = $(this).attr('checked');
			 if(checked){
			 anyOneChecked=true; 
			 }
			 });
			 var yesPresent=false;
			 var rowIDs = jQuery("#containerGrid").getDataIDs();
			 for (var i=0;i<rowIDs.length;i=i+1)
				{ 
					var trElement = jQuery("#"+ rowIDs[i],jQuery('#containerGrid'));
					
					if($(trElement.children()[2]).text()=='Yes'){
						yesPresent=true;
					}
				} 
			 if(anyOneChecked){
			 $('#setupBillBtn').attr("disabled","disabled");  
			 }else{
				 if(yesPresent){
			    $('#setupBillBtn').removeAttr("disabled");  
				 }
			  }
		});
//		D032205
		/*var isBillProrate = false;
		 var rowIDs = jQuery("#containerGrid").getDataIDs();
		 for (var i=0;i<rowIDs.length;i=i+1)
			{ 
				var trElement1 = jQuery("#"+ rowIDs[i],jQuery('#containerGrid'));				
				if($(trElement.children()[2]).text()=="Yes" && $(trElement1.children()[5]).text() != undefined && $(trElement1.children()[5]).text() != null && 
						( $(trElement1.children()[5]).text().trim()=="W" || $(trElement1.children()[5]).text().trim()=="C")){
					isBillProrate = true;
				}
			} 
		 if(isBillProrate){
			// $('#replicate').attr("disabled",false);
		 }else{
			 //if none of containers linked to Bill are prorated then disable replicate 
			 $('#replicate').attr("disabled",true);
		 }*/
	}


	function continueReplicate()
	{
		$('#replicate_options').dialog('close');
		
		blockUI();
		
		$.ajax({
			type: "GET",
			url: _context +"/billingSetup/replicateBill",
			data:{
				responsiblePartyCodeForRplct:$('#responsiblePartyCodeForRplct').val(),
				pieceCount:$('#pieceCount').val(),
				weight:$('#weight').val(),
				cube:$('#cube').val(),
				commodityDesc:$('#customerCommodityDesc').val(),
				manualSeqNo:$('#manualSeqNo').val(),
				dealerAuctionLocationCode:$('#dealerAuctionLocationCode').val(),
				pod:$('#pod').val(),
				kind:$('#kind').val(),
				governmentBillOfLadingNbr:$('#governmentBillOfLadingNbr').val()
				},
				success: function(responseText){
					$.unblockUI()
					
					if (responseText.success==true) {
					loadBillOfladdingDetails(responseText);
					loadBLSUGrid(responseText);
					showResponseMessages("msgDiv", responseText);
					document.getElementById("containerGridMain").style.display="block";
					buttonEnableAll();
					}
					if (responseText.success==false) {
					showResponseMessages("msgDiv", responseText);
					}
					/* if(responseText.success==true){
						displayShipment();
						$("#containerGrid").trigger('reloadGrid');
						 $("#billingSetUpWarningDialog").dialog('close');
						
					}else{
						 $("#billingSetUpWarningDialog").dialog('close');
						showResponseMessages("msgDiv",responseText);
					} */
					
				}
				});
		$('#isChanged').val("false");
	}

	function clearReplicateDialog() 
	{
		$('#pieceCount').val('');
		$('#weight').val('');
		$('#cube').val('');
		$('#customerCommodityDesc').val('');
		$('#kind').val('');
		$('#governmentBillOfLadingNbr').val('');
	}

	function applySecurity(){
		enforceSecurityTitle(isbillsetupHeaderDisplay);
		enforceSecurityDivAndButtons("headerDiv", isbillsetupHeaderDisplay);
		enforceSecurityDivAndButtons("headerFieldsetDiv",isbillsetupHeaderDisplay);	
		enforceSecurityDivAndButtons("containerGridMain",isbillsetupcontainergridDisplay);
		enforceSecurityDivAndButtons("unitGridMain",isbillsetupunitgridDisplay);
		enforceSecurityDivAndButtons("setup",isbillsetupSetup);
		enforceSecurityDivAndButtons("replicate",isbillsetupReplicate);
		/* enforceSecurityDivAndButtons("billingSave",((isbillsetupMixedLink && ($("#billType").val()=='MIXED')) || (isbillsetupLink && ($("#billType").val()=='STANDARD')) || (isbillsetupHHGDSLink && ($("#billType").val()=='HHGDS')))); */
		//enforceSecurityDivAndButtons("billingDelete",((isbillsetupMixedUnlink && ($("#billType").val()=='MIXED')) || (isbillsetupUnlink && ($("#billType").val()=='STANDARD')) || (isbillsetupHHGDSUnlink && ($("#billType").val()=='HHGDS'))));
		enforceSecurityDivAndButtons("setupBillBtn",isbillsetupBill);
		enforceSecurityDivAndButtons("maintainBilling",isbillsetupMaintainBill);
		enforceSecurityDivAndButtons("charges",isbillsetupMaintainBill);
		enforceSecurityDivAndButtons("correction",isbillsetupCorrections);
		enforceSecurityDivAndButtons("proRateTotals",isbillsetupProrateTotal);
		enforceSecurityDivAndButtons("cancelBtn",isbillsetupHeaderDisplay);
		applySecurityforLinkandUnlink();
			
	}
	//Added function for defect D028799
	function applySecurityforLinkandUnlink(){
		
		if($('#billType').val() == 'STANDARD')
		{
			enforceSecurityDivAndButtons("billingSave",isbillsetupLink);
			enforceSecurityDivAndButtons("billingDelete",isbillsetupUnlink);
		}
		else if($('#billType').val() == 'MIXED')
		{
			enforceSecurityDivAndButtons("billingSave",isbillsetupMixedLink);
			enforceSecurityDivAndButtons("billingDelete",isbillsetupMixedUnlink);
			
		}
		else if($('#billType').val() == 'HHGDS')
		{
			enforceSecurityDivAndButtons("billingSave",isbillsetupHHGDSLink);
			enforceSecurityDivAndButtons("billingDelete",isbillsetupHHGDSUnlink);
			
		}
	}
 
// function concludeRating(id)
// {		
//// 	$('#re_choice_dialog').dialog( "close" );
// 	
// 	blockUI();
// 	$.ajax({
// 		   type: "POST",				   							   
// 		   url: _context +  "/billingSetup/concludeRating?id="+id,
// 		   success: function(responseText){		
// 			   $.unblockUI();
// 			   if (responseText.data.rateView == "showError") {						
// 					$('#re_error_dialog').dialog('open');
// 					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 					$("#ratingErrorForm").loadJSON(responseText.data);
// 					$("#reErrorGrid").trigger('reloadGrid');
//// 					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
// 				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 					$('#reErrContinueBtn').hide();
// 				}else if(responseText.data.rateView == "showChoices"){
// 					$('#re_choice_dialog').dialog('open');
// 					$("#ratingChoiceForm").loadJSON(responseText.data);
// 					$("#reChoiceGrid").trigger('reloadGrid');
//// 					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
//// 					if(responseText.data.isAllChoicesUnSelectable != null 
//// 							&& responseText.data.isAllChoicesUnSelectable == "Y"){
//// 						$('#reChoiceCloseBtn').hide();	
//// 						$('#reChoiceContinueBtn').show();
//// 					}else{
//// 						$('#reChoiceCloseBtn').show();	
//// 						$('#reChoiceContinueBtn').hide();	
//// 					}											
// 				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 				}else if(responseText.data.rateView == "showWarning"){
// 											
// 					$('#re_error_dialog').dialog('open');
// 					$("#ratingErrorForm").loadJSON(responseText.data);
//// 					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
// 					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 					$('#reErrCloseBtn').hide();
// 					$('#shipmentForm').loadJSON(responseText.data);
// 					showResponseMessages("msgDiv", responseText);
// 				}
// 				else {
// 					$('#shipmentForm').loadJSON(responseText.data);
// 					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
// 					showResponseMessages("msgDiv", responseText);
// 				}	
// 			   
// 		   }
// 	});	
// }
 

	function deleteShipment() {
		blockUI();
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		$.ajax({
			type : "POST",
			url : _context + "/shipment/delete",
			data : {
				shipment_number :shipment_number,
				shipment_sequence_number : shipment_sequence_number,
				shipment_correction_number : shipment_correction_number,
				shipmentId : $('#shipmentId').val(),
			},
			success : function(responseText) {
				//D026474
				$.unblockUI();
				if (responseText.messages.error.length == 0) {
				
					$("#shipmentDeleteBtn").attr("disabled", true); 
					//clearPageOnLoad();
					$("#shipmentNumber").val(shipment_number);
					$('#shipmentSequenceNumber').val('');
					$('#shipmentCorrectionNumber').html('');					
					displayShipmentAfterDelete();
					//reloadGrids();  // Defect 24819
					//hideGrids();
					//$("#containerGrid").trigger('reloadGrid');
				}
				// Messages
				showResponseMessages("msgDiv", responseText);				
			}
		});		
	}
	
	//Defcet 24819
	//Added code to re-display using available booking number on hitting bill button in bill setup. 
	function displayShipmentAfterDelete(){
		
		$.ajax({
			type : "POST",
			url : _context + "/billingSetup/loadBookingDetails",
			data : {
				shipment_number : $("#shipmentNumber").val(),
				shipment_sequence_number :$("#shipmentSequenceNumber").val(),
				shipment_correction_number :$("#shipmentCorrectionNumber").val(),
				dalcCode:$("#dealerAuctionLocationCode").val(),
				portOfDischarge:$('#portOfDischarge').val(),
				pod:$('#pod').val()
			},
			success : function(responseText) {				
				if (responseText.success==true) {
					loadBillOfladdingDetails(responseText);
					createUnitGrid();
					createContainerGrid1();
					loadBLSUGrid(responseText);
					//showResponseMessages("msgDiv", responseText);
					//showLoadedMessage();
					document.getElementById("containerGridMain").style.display="block";
										
				}
				$('#msgDiv').show();
				
			}
		});
		$.unblockUI();
	}
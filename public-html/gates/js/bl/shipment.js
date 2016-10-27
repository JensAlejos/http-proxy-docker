    var dirtyData=false;
	var saveBillBeforeBillButton = false;
	var callBillActionAfterSave = false;
	var hideCustomizeField = false;	
	var isAutoBillVal=" ";
	var createUser="";
	var sessionId = $.cookie("JSESSIONID");
	var accordionIndex = 0;
	//added against 21739
/*	var changeInShipperConsignee=false;
	var changeInParties=false;
	var changeInRefNumberMarks=false;
	var changeInRoutingVVD=false;
	var changeInCommodity=false;
	var changeInMilitary=false;
	var changeInSpecialServices=false;
	var changeInClauses=false;
	var changeInShipmentHold=false;
	var changeInShipmentOverride=false;
	
	var changeInSpecialServiceGrid=false;
	var changeInHoldGrid=false;
	var changeInClausesGrid=false;
	
	var counterPartiesGridReloaded=0;
	var counterClausesGridReloaded=0;
	var counterRefNumberGridReloaded= 0;
	var counterConvGridReloaded=0;
	var counterSplServicesReloaded=0;
	var counterHoldGridReloaded=0;
	
	var numberOfInitialRowsHold=null;
	var numberOfInitialRowsSplServices=null;
	var numberOfInitialRowsConv=null;
	var numberOfInitialRowsRefNumberGrid=null;
	var numberOfInitialRowsClausesGrid=null;
	var numberOfInitialRowsParties=null;*/
	var shipmentNotFound = false;
	var ratedatesearch="";
	
	
	
	
	
$(function() {
	//$('#shipmentForm').validationEngine('attach');	// it has been used on Go button click for removing PopUp on page load 

	elRTE.prototype.options.panels.web2pyPanel = [ 'bold', 'italic',
	                                   			'underline', 'forecolor', 'hilitecolor', 'justifyleft',
	                                   			'justifyright', 'justifycenter', 'justifyfull', 'formatblock',
	                                   			'fontsize', 'fontname', 'insertorderedlist', 'insertunorderedlist',
	                                   			'link', 'image', ];

   	elRTE.prototype.options.toolbars.web2pyToolbar = [ 'web2pyPanel', 'tables' ];
		
	 setDefaultPrefMethod('consignee');
	 setDefaultPrefMethod('shipper');
	//Adding security Permissions Check for proratebill & auditrelease buttons as part of Defect D026555 
	 enforceSecurityDivAndButtons("prorateBill",isproratebilldisplay);
	 enforceSecurityDivAndButtons("auditRelease",isauditreleasedisplay);
	tabSequence('#shipmentForm');
	$('#msgDiv').hide();
	createDeleteShipmentConfirmDialog();  // can be moved
	//applycheckDirtyData();
	// Save Failed Issue added check for save before Bill Process
	$('input[type="text"],input[type="checkbox"]:not(:disabled),select,input[type="radio"]:not(:disabled),textarea:not(:disabled)').change(function(){ 
		saveBillBeforeBillButton=true;
		
	});
	$('.ui-inline-delete').click(function(){ saveBillBeforeBillButton=true;});
	$('.ui-inline-edit').click(function(){ saveBillBeforeBillButton=true;});
	

	
	disableActionButtons();
	setScreenDetails();
	clickShipmentChargesBtn();
	clickShipmentPayablesBtn();
	clickShipmentGoBtn();
	if (console) console.log('before calling clickShipmentSaveBtn()');
	clickShipmentSaveBtn();
	clickShipmentExitBtn();
	clickShipmentCustomizeBtn();
	clickShipmentDeleteBtn();	
	clickShipmentCorrectionsBtn();
	clickShipmentStatusBtn();
	clickShipmentSendDocBtn();
	enableDisableActualTrucker();

	
	//enableDisableSendDoc();
	
	//added against 21739
	//checkForChanges();
	
	//Fix for D026048: 	Bill Maintenance-commodity description: Word wrapping (word separation) failed
	$("#containerCommodityDesc").blur(function()
	{
		splitCommodity();
	});
	
	
	$('#shipmentTraceBtn').click(function(){
		$( "#trace_options_dialog" ).dialog("open");
		$('#lowTrace').attr('checked',true);
		$('#mediumTrace').attr('checked',false);
		$('#highTrace').attr('checked',false);
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("3");
	});
	
	$('#auditRelease').click(function(){
		if($('#auditId').val()!=''){
			var id=$('#auditId').val();
			$.ajax({
				   type: "GET",
				   url: _context +"/shipment/releaseAudit",
				   data: "id="+ id,
				   success: function(responseText, statusText, xhr, $form){		
					   showResponseMessages('msgDiv',responseText);
					   var messages = responseText.messages;
					   if (messages.success.length > 0 ) 
					   {
						   //D032052: 	When i release audit it refreshes to a different booking
						    window.location = _context + "/shipment/showForm";
					   }
						   
					 }
				 });
				
		}
		});
	
	$('#shipmentClearBtn').click(function(){
		/*if(somethingChanged == true){
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				clearShipmentDataOnClearBtnClick();
			}
		}*/
		if(isAnyChangeOnPage()) {
			if(confirm('You have unsaved changes! \nContinue?')) {
				clearShipmentDataOnClearBtnClick();
				captureChanges();
			}else{
				return;
			}
		}else {
			clearShipmentDataOnClearBtnClick();
		}
	});
	
	$('#lowTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("3");		
	});
	
	$('#mediumTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("5");
	});
	
	$('#highTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("7");
	});
	
	
	
	$('#cancelRating')
	.click(
		function() {
			$('#trace_options_dialog').dialog('close');
		});
	
	$('#startRating')
	.click(function(){
		
		$('#trace_options_dialog').dialog('close');
		blockUI();
		rateBill();
	});
	$('#HHGDSCommodity').click(function() {
        var reccountContainerGrid = $('#commodityGrid').jqGrid('getDataIDs');
	    var containerNumber = jQuery("#commodityGrid").getRowData(reccountContainerGrid[0]).equipmentId;
	    $.ajax({
            url: "/gates/workingContext/setContext",
            type: "POST",
            data: {key:"CONTAINER_NUMBER",value:containerNumber},
            success: function(responseText){
                $("#textfield5").removeAttr('style');
            }
    	});
    	var url = "/houseHoldShipment/showForm?";
    	if (containerNumber == null || containerNumber == undefined || containerNumber == "")
    	    url = url+"navigationUrl=2";
    	else
		    url = url+"equipmentId="+containerNumber+"&navigationUrl=2";
		window.location = _context + url;
	});
	
	
	if(null!=$('#shipmentNumber').val() && $.trim($('#shipmentNumber').val())!=''){
		displayShipment();
		setScreenFieldPropertiesforScreenFromFTWQ();
	}else{
		//createHoldGrid("shipment");	
		setScreenOnLoad();

	}
	
	$('#shipmentBillBtn').click(function() {
		//Defect-25031-Added to validate seal number before bill.
		//27472
		if($('#tradeCode').val()!='F' && $('#tradeCode').val()!='M' && $('#tradeCode').val()!='H'){
			//As per Atanus change 27472 seal is not required for H trade
			/*if($('#tradeCode').val()=='H'){
			if(isAutoBillVal=='N'){
		if(validateSealNumber()){ 
			if( $('#loadDschServiceGroupCode').val()=='CY'|| $('#loadDschServiceGroupCode').val()=='cy'){
				alert("Seal Number is required to Bill");
				return false;
			}
			}
			}
			}*/
			//D027041
			if($('#tradeCode').val()=='G'){
				if( $('#loadDschServiceGroupCode').val()=='CY'|| $('#loadDschServiceGroupCode').val()=='cy'){
					if(validateSealNumber()){
					alert("Seal Number is required to Bill");
					return false;
					}
				}
			}
		}
		//D032557
		if(!validateInvoiceNumbers()){
			$.unblockUI();
			return false;
		}
		 
		 callBillActionAfterSave = false;
		if(!checkActionValidation()){return; }
		//D026903: 	MAINTAIN BILL: AUTOBILL RATED "TO ORDER" B/L W/O NAME NOR TO ORDER B/L PARTY
		if(!validateShipmentUIFields()){return;}
		blockUI();
		if(saveBillBeforeBillButton !=null && saveBillBeforeBillButton ==true){
			validateShipmentForBillButton();
			//rateBill() method moved to saveShipmentForBillButton()on the path of validateShip method- for UnblockUI to load image before ajax calls
			/*if(callBillActionAfterSave){
				captureChanges();
				//setTimeout('rateBill()',500);
		   rateBill();
		    
			}*/
		}else{
			captureChanges();
			//setTimeout('rateBill()',500);
			$('#optionToRate').val("0");
			//rateBill(); D027069
			//D032676: 	GATES Performance - Maintain Bill - Bill Button - Merge save and rateBill transactions into one server call 
			//saveShipmentForBillButton();
			rateBill();
		}
	});
	
	
	 $( "#trace_options_dialog" ).dialog({
			autoOpen: false, 
			width: 200,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			}
		});
	 

	 	dirtyData=false;

	 	
	 	$('.ui-inline-save').click(function(){ saveBillBeforeBillButton=true;});
	 	$('#releaseHold').click(function(){ saveBillBeforeBillButton=true;});

	 	//added against 21739
	 	//resetChangeInInputBooleans();
	 	
	 	document.onreadystatechange = function () {
	 		
	 	    if (document.readyState == "complete") {
	 	       $.unblockUI();
	 	      var args = {
	 	 			entityType: 'SHMT',
	 	 			entityId: $('#shipmentId').val(),
	 	 			commentId:  'commentId',
	 	 			displayCommentTypes: 'CDBTR,DISPUTE,HZRD,OPS,PCCOL,PDBTR,WEBE,WIRE,CSS,DOC,KICK,PCACTY,PCCSS,SYS,WEBS'
	 	 		};
	 	      $("#comment_link").comments(args);
	 	       windowLocationAccordion();
	 	       accordionIndex = 0;
	 	    }
	 	    else if (document.readyState == "interactive"){
	 	    	blockUI();
	 	    	 
	 	    }
	 	};
	 	
	 	
	 	$('input[name="shipper\\.contact"]').change(function(){
	 		if($.trim($('input[name="shipper\\.contact"]').val())!=''){
	 			var name=$.trim($('input[name="shipper\\.contact"]').val());
	 			$('select[name="shipper\\.contactId"]').val('');
	 			$('select[name="shipper\\.contactId"]').trigger('change');	
	 			$('input[name="shipper\\.contact"]').val(name);
	 		}
	 	});
	 	$('input[name="consignee\\.contact"]').change(function(){
	 		if($.trim($('input[name="consignee\\.contact"]').val())!=''){
	 			var name=$.trim($('input[name="consignee\\.contact"]').val());
	 			$('select[name="consignee\\.contactId"]').val('');
	 			$('select[name="consignee\\.contactId"]').trigger('change');	
	 			$('input[name="consignee\\.contact"]').val(name);
	 		}
	 	});
	 	//for unsaved changes
	 	captureChanges();
	 	
	 	var oldRateDate ="";
	 	//D026991
	 	var currentDate= new Date();
	 	oldRateDate = $('#rateDate').val();
	 	 $('#rateDate').mouseover(function(){
	 		oldRateDate = $('#rateDate').val();
	 	 });

		$('#rateDate').change(function() {
		
		var newRateDate=$('#rateDate').val();			
		var isValidateDate= isValidDate(newRateDate);

		if(isValidateDate!=null )	
		{
		//D026991, For not to accept manual entry of future date.
			if(Date.parse(isValidateDate) > currentDate){
				alert(' Future date cannot be entered in rate date ');
				$('#rateDate').val(oldRateDate);
				ratedatesearch=$('#rateDate').val();
				if($('#freightReceivedDate').val() == "" || $('#freightReceivedDate').val() == null
				|| $('#freightReceivedDate').val() == undefined || newRateDate==$('#freightReceivedDate').val() )
				 $('#freightReceivedDate').val(oldRateDate);
			}
			else{
			$('#rateDate').val(isValidateDate);
			ratedatesearch=$('#rateDate').val();
			return true;	
			}
		}		
		else		
		{		
			if(newRateDate!=null && newRateDate!='')	
			{		
			alert('Effective/Expiration Date entered is not a valid Date.Enter date in Format(MM-dd-yyyy)');
			//D026991		
			if(!(Date.parse(oldRateDate) > currentDate)){
				if(isValidDate(oldRateDate)){	
			$('#rateDate').val(oldRateDate);
			ratedatesearch=$('#rateDate').val();
			if($('#freightReceivedDate').val() == "" || $('#freightReceivedDate').val() == null
            				|| $('#freightReceivedDate').val() == undefined || newRateDate==$('#freightReceivedDate').val() )
            				 $('#freightReceivedDate').val(oldRateDate);
			//D026991
			}else{
			    $('#rateDate').val("");
			  ratedatesearch=$('#rateDate').val();
			//$('#freightReceivedDate').val("");
			}}
			else{
				alert("Entered date greater than current date");
			  $('#rateDate').val("");
			  ratedatesearch=$('#rateDate').val();
			//$('#freightReceivedDate').val("");
			}	}
			else		
			{		
			$('#rateDate').val(oldRateDate);
			ratedatesearch=$('#rateDate').val();
			if($('#freightReceivedDate').val() == "" || $('#freightReceivedDate').val() == null
            				|| $('#freightReceivedDate').val() == undefined || newRateDate==$('#freightReceivedDate').val() )
            				 $('#freightReceivedDate').val(oldRateDate);
		    }
		}				
		});
	
		 $( "#hazardDialog" ).dialog({
				autoOpen: false, 
				width: 1050,
				modal: true,
				closeOnEscape: false,
				beforeClose: function() {
					
					
				},
				
			});
		  
		 checkSourcePageExpandGrid();
});


function clearShipmentDataOnClearBtnClick(){

	$('#msgDiv').html("<div class=\"message_info\">Please wait while screen is refreshed...</div>");
	$('#msgDiv').show();
	$.ajax({
		url: _context +"/shipment/clear",
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				clearAndResetShipmentScreen();
				collapseAll();
				reloadShipmentGrids();
				clearPageOnLoad();
				setShipmentTitle("");
				$('#overrideInitialLtvDate').val('');
				$('#unitOfCommodity').empty();
				$('#commodityLine').text('');
				$('.unchangeable').removeAttr("checked");
				$('#shipmentCorrectionNumber').empty();
				$('#shipmentCorrectionNumber').attr("disabled",true);
				$('#shipmentNumber').focus();
				ratedatesearch="";
			}
			showResponseMessages('msgDiv', responseText);
			window.scrollTo(0, 0);
		}
	});

}

function onCompletion(){
	var reccountContainerGrid = $('#reChoiceGrid').jqGrid('getDataIDs');
	for (var i = 0; i < reccountContainerGrid.length; i++) {
		if(jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]). selectable
				 == 'false'){
			var id = jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]). reRatingChoiceId;
			id= id.substring(0,id.indexOf("."));
			$("#jqg_reChoiceGrid_" + id).attr("disabled", true);	
//			$("div.ui-pg-div.ui-inline-edit", "#"+$('#commodityGrid').jqGrid('getDataIDs')[i]).hide();
//			jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]).style.di
//        	$("#jqg_reChoiceGrid_" + rowdata.reRatingChoiceId).attr("disabled", true);
		}
	}
}

function displayShipment() {
	
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
	/** Populating Shipment sequence number from database*/
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		$.ajax({
			async: false,
			type : "POST",
			url : _context + "/shipment/defaultShipmentSequenceNumber",
			data : {				
				shipment_number :shipment_number
			},
			success : function(responseText) {
				var shipmentSequenceNumber=responseText.data;
				shipment_sequence_number=shipmentSequenceNumber;
				$('#anyChangesDone').val("N");
			}			
		});
	}
	if(shipment_sequence_number!=null){
	$("#shipmentSequenceNumber").val(shipment_sequence_number);
	
	/** Populating Shipment Correction Number number Hard coded*/
	//if(shipment_correction_number == ""	|| shipment_correction_number == null){
		// start for defect 019028
		$.ajax({
			async: false,
			type : "POST",
			url : _context +"/shipment/header/shipmentCorrectionNumberList",
			data : {
				shipmentNumber : shipment_number,
				shipmentSequenceNumber : shipment_sequence_number
			},
			success : function(responseText) {
				var list= responseText.data.shipmentCorrectionNumberList;
				$('#shipmentCorrectionNumber option').remove();								
				$.each(list, function(index,codeDescription) {
					$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				});
				if(shipment_correction_number == ""	|| shipment_correction_number == null){
					document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
				}else{
					document.getElementById("shipmentCorrectionNumber").value=shipment_correction_number;
				}
				
				$('#anyChangesDone').val("N");
			}
		});
/*		$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option("000", "000");
		$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
		shipment_correction_number="000";*/
		shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
		// end for defect 019028
	//}
	if(shipment_correction_number!= '000' ){
		$('#shipmentBillBtn').attr('disabled', true);
		$('#shipmentTraceBtn').attr('disabled', true);
	}
	else{
		$('#shipmentBillBtn').attr('disabled', false);
		$('#shipmentTraceBtn').attr('disabled', false);
	}
	disableRepeatContact(true);
	if(document.getElementById("commentsDIV") != null)
		document.getElementById("commentsDIV").innerHTML='';
	/** Going to populate Shipment */
	
	$.ajax({
		async: false,
		type : "POST",
		url : _context + "/shipment/populateShipment",
		data : {
			shipment_number :shipment_number,
			shipment_sequence_number : shipment_sequence_number,
			shipment_correction_number : shipment_correction_number
		},
		success : function(responseText) {
			//	D021215: 	Session Variable clear/change shortcut
			getSearchFieldValue(500);
			// Clear fields of Shipment form and reset the defaults
			createHoldGrid("shipment");
			//openUnreleasedHoldGridOnIntialDisplay("shipment");
			if(responseText.data==null){
				$.unblockUI();
				// Clearing Page
				clearPageOnLoad();
				$('#anyChangesDone').val("N");
				$('#shipmentCorrectionNumber option').remove();	
				eanableDisableSectionsOnScreen(false);// D019870
				// loading data
				showJSON(responseText);
				showResponseMessages("msgDiv", responseText);
				// reload grids
				reloadShipmentGrids();
				shipmentNotFound = true;
				if(sessionId ==  $.cookie("JSESSIONID"))
					showNonExistBillMessage();
				else{
					 location.reload();
				}
				$('#maintain_commodity_shipment').gatesDisable();
				$('#updateCommodity').attr("disabled",true);
				$('#clearCommodity').attr("disabled",true);
				$('#addCommodity').attr("disabled",true);
				$('#deleteCommodity').attr("disabled",true);
				$('#marksAndNumbers').attr("disabled",true);
				hideCustomizeField = true;
				clearAllShipmentGrids();
				$("#shipmentNumber").val(shipment_number);
				disableActionButtons();
				setShipmentTitle("");
				return;
			}
			
			var shipmentId = responseText.data.shipmentId;
			//D030066
			createUser = responseText.data.createUser;
			if (shipmentId == null || shipmentId == undefined || shipmentId == "") {
				// loading data
				$.unblockUI();
				clearPageOnLoad();
				eanableDisableSectionsOnScreen(false); // D019870
				setScreenOnLoad();
				shipmentNotFound = true;
				if(sessionId ==  $.cookie("JSESSIONID"))
					showNonExistBillMessage();
				else{
					 location.reload();
				}
				$('#maintain_commodity_shipment').gatesDisable();
				$('#updateCommodity').attr("disabled",true);
				$('#clearCommodity').attr("disabled",true);
				$('#addCommodity').attr("disabled",true);
				$('#deleteCommodity').attr("disabled",true);
				$('#marksAndNumbers').attr("disabled",true);
				hideCustomizeField = true;
				clearAllShipmentGrids();
				setShipmentTitle("");
				return;
			} else {
				hideCustomizeField = false;
				shipmentNotFound = false;
				$('#maintain_commodity_shipment').gatesEnable();
				$('#updateCommodity').attr("disabled",false);
				$('#clearCommodity').attr("disabled",false);
				$('#addCommodity').attr("disabled",false);
				$('#deleteCommodity').attr("disabled",false);
				$('#marksAndNumbers').attr("disabled",false);
				eanableDisableSectionsOnScreen(true);
				$('#overridePlaceOfIssue').attr("disabled",false);
				if (responseText.messages.error.length == 0) {
					$.unblockUI();
					$('#shipmentForm').gatesEnable();
					//D026105: 	Rate Engine: RE Choice Messages Display - Can fields be grayed out, not enterable? 
					$('#re_choice_dialog').gatesDisable();
					$('#reChoiceCloseBtn').attr("disabled",false);
					$('#reChoiceListRateBtn').attr("disabled",false);
					$('#reChoiceContinueBtn').attr("disabled",false);
					$('#reUseSelection').removeAttr("disabled");
					$('#re_error_dialog').gatesDisable();
					$('#reErrCloseBtn').attr("disabled",false);
					$('#reErrorListRateBtn').attr("disabled",false);
					clearPageOnLoad();
					eanableDisableSectionsOnScreen(true); // D019870
					showJSON(responseText);
					$('#auditId').val(responseText.data.header.auditId);
					$('#auditDesc').val(responseText.data.header.auditDesc);
					setScreenOnLoad();
					//Performance Changes - Added asyc call to get BillTypePrintOverride value
					displayBillOfLading('loading...');
					displayInvoiceLinks(true);
					setBillTypePrintOverride(responseText.data);
					setDivNames();
					if($('#splServicesHeader').text()==""){
						setSpecialServiceHeader(responseText);
					}
					if($('#clauseHeader').text()==""){
						setClauseHeader(responseText);
					}
					if(domesticForeignIndicator!='china' || domesticForeignIndicator != "china")
					{
						$('#overrideInitialLtvDateDefaultvalue').val('');
					}
					else
					{
						$('#overrideInitialLtvDateDefaultvalue').val(responseText.data.routing.defaultSailDate);
					}
					if(!$('#isOverrideInitialLtvDate').attr("checked"))
					{
						$('#overrideInitialLtvDate').val($('#overrideInitialLtvDateDefaultvalue').val());
						$('#overrideInitialLtvDate').css('color','black');
						$('#isOverrideInitialLtvDate').attr("checked", false);
					}
					
					
					populateLoadDschPairValues(responseText.data.shipmentLDSPairForm);
					setIsRefNumberField(responseText.data.referenceNumber.refNumberExistForShipment);
					// Display Unreleased Holds Grid on initial display
					openUnreleasedHoldGridOnIntialDisplay("shipment");
					if ($('#shipmentId').val() != null && $('#shipmentId').val() != ''
						&& ($('#statusCode').text() == 'ISSUED' || $('#statusCode').text() == 'CORRECTED')) {
						$('#shipmentBillBtn').attr('disabled', true);
						$('#shipmentTraceBtn').attr('disabled', true);
					}else{
						$('#shipmentBillBtn').attr('disabled', false);
						$('#shipmentTraceBtn').attr('disabled', false);
						
					}
					makeFormReadOnly(responseText,'shipmentForm',true);
					if($('#statusCode').text()=="CORRECTED" || $('#statusCode').text()=="ISSUED")
					{
							eanableDisableSectionsOnScreen(false);
							//displayBillOfLading(responseText.data.header.billOfLadingLink);
							$('#maintain_commodity_shipment').gatesDisable();
							//$('#overridePlaceOfIssue').attr("disabled",true);
							enableDisableCommosityButtons();
					}
					dirtyData=false;
					
					
					populateCommodityCodeListBilling(responseText.data.shipmentItemForm.commodityCodeList);
				}
				createShipmentCommodityGrid();//Defect-25031
				collapseAll();//Defect-25031
				$.unblockUI();
			}
		
			setShipmentTitle();
			showSuccessLoadingBillMessage();
			tempImperialCubeValue=0;
			tempImperialWeightValue=0;
			tempMetricCubeValue=0;
			tempMetricWeightValue=0;
			changeCountForCube=0;
			changeCountForWeight=0;
			
			if($('#cube').val()!="" ){
				
				if($('#unitOfMeasureSourceCode').val()=="I" ){
					tempImperialCubeValue=$('#cube').val();
				}else{
					tempMetricCubeValue=$('#cube').val();
				}
				/*//D026553
				if( $('#piece').val()!=''&& $('#piece').val()!=0)
				{
					$('#cube').val($('#cube').val()*$('#piece').val());
				}*/
			}
			if($('#netWeight').val()!=""){
				
				if($('#unitOfMeasureSourceCode').val()=="I" ){
					tempImperialWeightValue=$('#netWeight').val();
				}else{
					tempMetricWeightValue=$('#netWeight').val();
				}
			}
			/*setCommunicationMethodCodeForShipper(responseText.data.shipper.communicationMethodCode);
			setCommunicationMethodCodeForConsignee(responseText.data.consignee.communicationMethodCode);*/
		},
		error : function(responseText) {
			//$.unblockUI();
			shipmentNotFound = true;
			if(sessionId ==  $.cookie("JSESSIONID"))
				showNonExistBillMessage();
			else{
				 location.reload();
			}
			$('#maintain_commodity_shipment').gatesDisable();
			$('#updateCommodity').attr("disabled",true);
			$('#clearCommodity').attr("disabled",true);
			$('#addCommodity').attr("disabled",true);
			$('#deleteCommodity').attr("disabled",true);
			clearAllShipmentGrids();
			setShipmentTitle("");
			//$.unblockUI();
		}
	});
	dirtyData=false;
	}else{
		$.unblockUI();
		
		var searchText = $("#shipmentNumber").val();
		if(searchText != '' && searchText.length == 7 && isNumeric(searchText)){
		$.ajax({
			url: _context + "/booking/bookingExists",
			type: "POST",
			data : {bookingString:searchText},
			
			success: function(responseText){
				if(responseText.success=="true"){
				$.ajax({
					url: "/gates/workingContext/setContext",
					type: "POST",
					data: {key:"BK_BOOKING",value:searchText},
					success: function(responseText){
						$("#textfield5").removeAttr('style');
					}
				});
				}
			}
		});
	    }
		clearPageOnLoad();
		eanableDisableSectionsOnScreen(false); // D019870
		setScreenOnLoad();
		shipmentNotFound = true;
		if(sessionId ==  $.cookie("JSESSIONID"))
			showNonExistBillMessage();
		else{
			 location.reload();
		}
		$('#maintain_commodity_shipment').gatesDisable();
		$('#updateCommodity').attr("disabled",true);
		$('#clearCommodity').attr("disabled",true);
		$('#addCommodity').attr("disabled",true);
		$('#deleteCommodity').attr("disabled",true);
		$('#marksAndNumbers').attr("disabled",true);
		hideCustomizeField = true;
		clearAllShipmentGrids();
		setShipmentTitle("");
	}
	
}

function populateCommodityCodeListBilling(list){
//	alert("Inside populateCommodityCodeListBilling, list length:"+list.length);
	var shmtCommCode = $('#shipmentCommodityCode').val();
//	alert("Inside populateCommodityCodeListBilling, shipment Commodity code:"+shmtCommCode);
	$('select#commodityCode').children().remove().end().append('<option selected value="">Select</option>');
	if(list != null)
	{
		for ( var i = 0; i < list.length; i++) {
			if((list[i].code!=""||list[i].description!=null)&&(list[i].code!=null||list[i].description!="")
					&& (list[i].code!=null||list[i].description!=null)&&(list[i].code!=""||list[i].description!="")){
			$('select#commodityCode').append($("<option/>", {
				value : list[i].code,
				text : list[i].code + " - " +list[i].description
			}));
//			alert("value:"+list[i].code+",text:"+list[i].code + " - " +list[i].description);
			if(shmtCommCode.length>0 && shmtCommCode==list[i].code){
				$('#commodityCode').val($.trim(list[i].code));
//				alert("Dropdown code set to:"+$('#commodityCode').val());
			}
			}
		}
		
		if(list.length==1){
//			alert("List length 1, code:"+$.trim(list[0].code));
			$('#commodityCode').val($.trim(list[0].code));
			$('#shipmentCommodityCode').val($.trim(list[0].code));
	
		}
		
	}
	
}

function clearCommodityCodeList(){
	$('#tariffItemCmdtyDescId').val(null);
	$('#commodityCode option').remove();
	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
}

function clearPageOnLoad() {
	clearShipmentForm();
	clearShipperConsignee();
	resetDivNames();
	reloadShipmentGrids();
	resetDefault();
	$("#statusCode").attr("disabled", true);
}


function resetDivNames() {

	 $("#shipperConsigneeNameDiv").html("");
	 setAccordianTabDetails("shipperNameDiv", "");
	 setAccordianTabDetails("consigneeNameDiv", "");
	 setAccordianTabDetails("partiesHeader", "");
	 setAccordianTabDetails("refAndMarksId", "");
	 setAccordianTabDetails("routingHeader", "");
	 setAccordianTabDetails("shipmentCommodityHeader", "");
	 setAccordianTabDetails("shipmentHazardHeader", "");
	 setAccordianTabDetails("militaryHeader", "");
	 setAccordianTabDetails("splServicesHeader", "");
	 setAccordianTabDetails("clauseHeader", "");
	 setAccordianTabDetails("maintainShipmentHoldId", "");
	 setAccordianTabDetails("ShipmentOverridesText", "");
}

function prepareHeaderDataForBillingOverlay(responseText) {
	$("#billShipmentNumber").text($("#shipmentNumber").val());
	$("#billShipper").text($('input[name="shipper\\.organizationName"]').val());
	$("#billConsignee").text($('input[name="consignee\\.organizationName"]').val());
	$("#billPlaceOfReceipt").text($("#blOriginCityCode").val());
	$("#billPlaceOfDelivery").text($("#blDestinationCityCode").val());
	$("#billPortOfLoading").text($("#originPortCityCode").val());
	$("#billPortOfDischarge").text($("#destinationPortCityCode").val());
	$("#billLDSP").text($("#loadServiceCode").val() +" "+ $("#dischargeServiceCode").val());
	
	$("#billBooked").text(responseText.data.header.booked);
	$("#billReceived").text(responseText.data.header.received);
	$("#billPreReceived").text(responseText.data.header.preReceived);
	$("#billBilled").text(responseText.data.header.billed);
}

function setIsRefNumberField(isreferenceNumberRef){
	
	if(isreferenceNumberRef=="Y"){
		$('#referenceHeaderCheckBox').attr("checked","checked");
	}else{
		$('#referenceHeaderCheckBox').removeAttr("checked");
	}
}
function showLoadingMessage() {
	
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		shipment_sequence_number="000";
	}
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		shipment_correction_number="000";
	}
	$('#msgDiv').html("<div class=\"message_info\">Loading shipment "	+ shipment_number + "-"	+ shipment_sequence_number + "-"+ shipment_correction_number + " ...</div>");
	$('#msgDiv').show();
}

function showSavingMessage() {
	$("#shipmentSaveBtn").attr("disabled", true);
	var entity = "Shipment";
	$('#msgDiv').html("<div class=\"message_info\">Please wait while " + entity	+ " is updated...</div>");
	//window.scrollTo(0, 0);
	$('#msgDiv').show();
}

// common method for all UI fields...
function validateShipmentUIFields() {
	var uiFieldsValidationStatus = true;
/* commented while testing security
 * 	uiFieldsValidationStatus = validateShipmentNumber();
if (uiFieldsValidationStatus == false){
		return uiFieldsValidationStatus;
}*/
	/*commented for " Behavior of shipper, consignee and additional
parties should be same as additional parties on maintain booking screen".*/
	
if( isShipperConsigneeModifiable){
	uiFieldsValidationStatus = validateOrganisationAndAddressForShipperConsignee('shipper');
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
	//D018663: 	GATES : Customer field behaviour
	//Contact details are not mandatory for billing
	/*if(uiFieldsValidationStatus)
		{
		uiFieldsValidationStatus = validateContactForShipperConsignee('shipper');
		if (uiFieldsValidationStatus == false)
			return uiFieldsValidationStatus;
		}*/

	/*not required as handled in validateContactForShipperConsignee method only
	 * puneet hasija*/
	/*	
	if($('#shipperComm1').attr('checked') ||
			$('#shipperComm2').attr('checked') ||
			$('#shipperComm3').attr('checked') ||
			$('#shipperComm4').attr('checked') ){
		uiFieldsValidationStatus = validateOrganisationAndAddressForShipperConsignee('shipper');
	}	
	*/
	uiFieldsValidationStatus = validateOrganisationAndAddressForShipperConsignee('consignee');
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
	//D018663: 	GATES : Customer field behaviour
	//Contact details are not mandatory for billing
	/*if(uiFieldsValidationStatus)
		{
		uiFieldsValidationStatus = validateContactForShipperConsignee('consignee');
		if (uiFieldsValidationStatus == false)
			return uiFieldsValidationStatus;
		}*/

/*	uiFieldsValidationStatus = validateContactForShipperConsignee('consignee');
	if($('#consigneeComm1').attr('checked') ||
			$('#consigneeComm2').attr('checked') ||
			$('#consigneeComm3').attr('checked') ||
			$('#consigneeComm4').attr('checked') ){
		uiFieldsValidationStatus = validateOrganisationAndAddressForShipperConsignee('consignee');
	}
		
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
*/}
if(isPartiesModifiable){
	uiFieldsValidationStatus = validatePartiesSectionOnSave();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
}
if(isRoutingModifiable){
	uiFieldsValidationStatus = validateRoutingFieldsOnSave();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;
}
if(isRoutingOverrideModifiable){
	uiFieldsValidationStatus = validateOverridesFieldsOnSave();
	if (uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;
}
//D024736: Fields are not mandatory when tariffNumber and itemNumber are not present
if($('#unitOfCommodity').val()!=null && $('#unitOfCommodity').val()!=0 && ($('#tariffNumber').val() !="" || $('#itemNumber').val() !=""))
{
	
	uiFieldsValidationStatus = validateShipmentCommodityFieldsOnSave();
}
else
{
	$('#netWeight').removeClass("validate[required]");	
	$('#netWeight').removeClass("validate[custom[number]]");
	$('#netWeight').removeClass("validate[funcCall[validateNetWeight]]");
	$('#netWeight').removeClass("custom[max[9999999.999]]]");
	$('#netWeight').removeClass("custom[min[0000000.001]]]");
	$('#commodityDesc').removeClass("validate[required]");
	$('#commodityDesc').removeClass("validate[funcCall[validateTrfCmdDesc]]");	   
	
}

if(uiFieldsValidationStatus==false){
	return uiFieldsValidationStatus;
}
	return uiFieldsValidationStatus;
}
function validateShipmentNumber() {
}
function validateShipment() {
	if( isShipperConsigneeModifiable){
		if ($('input[name="shipper\\.addressRoleId"]').val() == ""
			|| $('input[name="consignee\\.addressRoleId"]').val() == "") {
			return false;
		}
	}
	 var length = $($('.ui-state-error',"#commodityGridDiv")).length;
	 for(i=0;i<length; i++){
		if(($($('.ui-state-error',"#commodityGridDiv"))[i]).innerHTML!=""){
			$($($('.ui-state-error',"#commodityGridDiv"))[i]).parent().remove();
			
		}
		 
	 }
	
	//checkForNoteValidation(); //for 21832 note validation
	//if(isNoteValid==true){
		updateCommodityBeforeSave();
	//}else 
	//$.unblockUI();
	// save shipment from here is moved to maintainContainerCommodity for CR : to save Shipment Commodity Section data before save
}
//Defect-25031-Added to validate seal number before bill.
function validateSealNumber() {
	var emptySeal = false;
	var reccountContainerGrid = $('#commodityGrid').jqGrid('getDataIDs');
	for ( var i = 0; i < reccountContainerGrid.length; i++) {
		var equiptype=jQuery("#commodityGrid").getRowData(
				$('#commodityGrid').jqGrid('getDataIDs')[i]).eqptType;
		var empty=jQuery("#commodityGrid").getRowData(
				$('#commodityGrid').jqGrid('getDataIDs')[i]).isEmpty;
		if ((jQuery("#commodityGrid").getRowData(
				$('#commodityGrid').jqGrid('getDataIDs')[i]).sealNumber).trim() == "") {//Defect-25437
			if(equiptype !="F" && equiptype !="T" && equiptype!="A" && equiptype!="B" && empty!="E"){			
			emptySeal = true;
			}
		}
	}
	return emptySeal;
}
function validateShipmentForBillButton() {
	if( isShipperConsigneeModifiable){
		if ($('input[name="shipper\\.addressRoleId"]').val() == ""
			|| $('input[name="consignee\\.addressRoleId"]').val() == "") {
			return false;
		}
	}
	updateCommodityBeforeSaveForBillButton(); 
	// save shipment from here is moved to maintainContainerCommodity for CR : to save Shipment Commodity Section data before save
}

function saveShipment() {
	
	showSavingMessage();
	//if(changeInCommodity){
	validateHHGSCheck();
	//}else{
	//	saveShipmentAfterValidation();
	//}
	
	
}
function saveShipmentAfterValidation(){
	//D028800
	$('#shipmentForm').gatesEnable();
	var shipment = $('#shipmentForm').formSerialize();
	var urlStr = '';
	urlStr = _context + "/shipment/save";
	$.ajax({
		//async:false,
		type : "POST",
		url : urlStr,
		data : shipment,
		success : function(responseText) {
			$("#shipmentSaveBtn").attr("disabled", false);
			if (responseText.success == true) {
				clearPageOnLoad();
				eanableDisableSectionsOnScreen(true);
				showJSON(responseText);
				setScreenOnLoad();
				//Performance Changes - Added asyc call to get BillTypePrintOverride value
				displayBillOfLading("updating...");
				setBillTypePrintOverride(responseText.data);
				displayInvoiceLinks(true);
				setDivNames();
				if($('#splServicesHeader').text()==""){
					setSpecialServiceHeader(responseText);
				}
				if($('#clauseHeader').text()==""){
					setClauseHeader(responseText);
				}
				dirtyData=false;
			} else {
				$("#shipmentStatusCode").attr("disabled", true);
			}
			if(domesticForeignIndicator!='china' || domesticForeignIndicator != "china")
			{
				$('#overrideInitialLtvDateDefaultvalue').val('');
			}
			else
			{
				$('#overrideInitialLtvDateDefaultvalue').val(responseText.data.routing.defaultSailDate);
			}
			if(!$('#isOverrideInitialLtvDate').attr("checked"))
			{
				$('#overrideInitialLtvDate').val($('#overrideInitialLtvDateDefaultvalue').val());
				$('#overrideInitialLtvDate').css('color','black');
				$('#isOverrideInitialLtvDate').attr("checked", false);
			}
			/*//D026553
			if( $('#piece').val()!=''&& $('#piece').val()!=0)
			{
				$('#cube').val($('#cube').val()*$('#piece').val());
			}*/
			showResponseMessages("msgDiv", responseText);
			//D028800
			enforceUserSecurityRolesAndPermissions();
			if (responseText.success == true) {
			    populateLoadDschPairValues(responseText.data.shipmentLDSPairForm);
			}
			//D033651 - Disable invoice field which is not applicable
			if($('#prepaidCollectCode :selected').val() == "P"){
				$('#fpInvoiceNbr').attr('disabled', false);
				$('#fcInvoiceNbr').attr('disabled', true);
			} else if($('#prepaidCollectCode :selected').val() == "C"){
				$('#fpInvoiceNbr').attr('disabled', true);
				$('#fcInvoiceNbr').attr('disabled', false);
			} else {
				$('#fpInvoiceNbr').attr('disabled', false);
				$('#fcInvoiceNbr').attr('disabled', false);
			}
			
			if($.trim($("#fpInvoiceNbr").val()) != "" || $.trim($("#fcInvoiceNbr").val()) != ""){
				$('#prepaidCollectCode').attr('disabled', true);
			} 

			//added against D21739
			//Commented for D032210
			//collapseAll();
			$.unblockUI();
			//resetChangeInInputBooleans();
			var args = {
					entityType: 'SHMT',
					entityId: $('#shipmentId').val(),
					commentId:  'commentId',
					displayCommentTypes: 'CDBTR,DISPUTE,HZRD,OPS,PCCOL,PDBTR,WEBE,WIRE,CSS,DOC,KICK,PCACTY,PCCSS,SYS,WEBS'
				};
			$("#comment_link").comments(args);
		}
	});
}

function setBillTypePrintOverride(data){
	
	var urlStr = _context +"/shipment/getBillTypePrintOverride";
	$.ajax({
		type: "GET", 
		url: urlStr,
		data : {
			originPortCityCode :data.routing.originPortCityCode,
			destinationPortCityCode :data.routing.destinationPortCityCode
		},
		success: function(responseData){			
			if(responseData.success==true){
				displayBillOfLading(responseData.data.header.billOfLadingLink);
				$('#hiddenonHoldLink').val(responseData.data.isHoldExist);
				displayOnHoldOrNot();
			} else {
				displayBillOfLading("");
			}
		},
		error: function(jqXHR,textStatus,errorThrown) {
			displayBillOfLading("");
		}
	});
	
}
function validateHHGSCheck(){
	
	
	var shipment = $('#shipmentForm').formSerialize();
	var urlStr = '';
	urlStr = _context + "/shipment/validateHHGSCheck";
	$.ajax({
		
		type : "POST",
		url : urlStr,
		data : shipment,
		success : function(responseText) {
			if (responseText.success == true) {
				if(responseText.data=="true"){
					var confirmCommodityChange= confirm('This bill is a member of a Household Goods set.'+
							      'The changes made will prevent the set being maintained on the Household Goods screen.'+
							                 'Continue with Save?"');
					if(confirmCommodityChange == true){
						saveShipmentAfterValidation();						
					}else{
						$('#msgDiv').attr("style","display:none");
						//D027228, Save btn disabled when clicked on cancel on warning message.
						$("#shipmentSaveBtn").attr("disabled", false);
						collapseAll();
						$.unblockUI();
						return false;
						
					}
				}else{saveShipmentAfterValidation();}
		}else{
			saveShipmentAfterValidation();
			}
		}
	});
}
function saveShipmentForBillButton(){
	//Added for D028800
	$('#shipmentForm').gatesEnable();
	var shipment = $('#shipmentForm').formSerialize();
	var urlStr = '';
	urlStr = _context + "/shipment/save";
	$.ajax({
		//async:false,//removed for blockUI image to load before the ajax call
		type : "POST",
		url : urlStr,
		data : shipment,
		success : function(responseText) {
			if (responseText.success == true) {
				callBillActionAfterSave = true;
				rateBill();//rateBill() is moved here
			} else {
				$("#shipmentStatusCode").attr("disabled", true);
				callBillActionAfterSave = false;
				showResponseMessages("msgDiv", responseText);
				$.unblockUI();
			}
			//Added for D028800
			enforceUserSecurityRolesAndPermissions();
			captureChanges();//to capture unsaved changes
		}
});
}
function setShipmentTitle() {
	// Workaround to fix dynamic setting of page title
if (($(document).getUrlParam("src")) != 'FTWQ'){
	window.location.hash = ""+new Date().getTime();
	//window.location = _context + "/shipment/showForm#" + new Date().getTime();
	
	var shipmentNumber= $("#shipmentNumber").val();
	var shipmentTitle = $('title').text().split("-");
	if (shipmentNumber != null && shipmentNumber != '') {
		var shipmentSequenceNumber = $("#shipmentSequenceNumber").val();
		var shipmentCorrectionNumber = $("#shipmentCorrectionNumber").val();
		if(shipmentCorrectionNumber!=null)
			document.title = shipmentTitle[0] + " - " + shipmentNumber + "-"+ shipmentSequenceNumber + "-" + shipmentCorrectionNumber;
		else
			document.title = shipmentTitle[0] + " - " + shipmentNumber;
	}else {
			document.title = shipmentTitle[0];
	}
}
}

function removePopUps() {
	$("#shipmentForm").validationEngine('hideAll');
}

function showJSON(responseText) {
	//alert("responseText.data="+responseText.data);
	if(responseText.data!=null){
		
	//Comment Id
	$('#commentId').val(responseText.data.commentId);
	
	// Shipment Id
	$("#shipmentId").val(responseText.data.shipmentId);
	
	$('#isOrderBlPartiesPresent').val(responseText.data.isOrderBlPartiesPresent);

	
	$('#hiddenonHoldLink').val(responseText.data.isHoldExist);
	//entityVersion
	$("#entityVersion").val(responseText.data.entityVersion);

	// Header
	$("#shipmentHeaderDiv").loadJSON(responseText.data.header);
	loadShipmentHeader(responseText);

	//Shipper
	shipperAddress = responseText.data.shipper.address;
	$('input[name="shipper\\.address"]').attr('title',shipperAddress);
	$("#shipper").loadJSON(responseText.data.shipper);
	$('input[name="shipper\\.contactEmailAddress"]').attr('title',$('input[name="shipper\\.contactEmailAddress"]').val());
	loadAdditionalShipperDetails(responseText);
	
	

	//Consignee
	consigneeAddress = responseText.data.consignee.address;
	$("#consignee").loadJSON(responseText.data.consignee);
	$('input[name="consignee\\.address"]').attr('title',consigneeAddress);
	$('input[name="consignee\\.organizationName"]').attr('title',responseText.data.consignee.organizationName);
	$('input[name="consignee\\.contactEmailAddress"]').attr('title',$('input[name="consignee\\.contactEmailAddress"]').val());
	loadAdditionalConsigneeDetails(responseText);
	
	//triming value of contact of shipper and consignee
	trimShipperAndConsignee();

	// Parties
	$("#maintainShipmentParties").loadJSON(responseText.data.parties);
	if($('#tradeCode').val() == 'A') {
		$('#invoiceDiv').show();
	} else {
		$('#invoiceDiv').hide();
	}

	$("#rateDate").val(responseText.data.header.rateDate);
	ratedatesearch=$('#rateDate').val();
	$("#totalWeight").val(responseText.data.header.totalWeight);
	$("#totalCube").val(responseText.data.header.totalCube);
	isAutoBillVal=(responseText.data.header.isAutobill);//Defect-25437
	// MarksNumbers
	$("#marksAndNumbers").val(responseText.data.header.markNumberString);
	
	//statusCode
	$("shipmentStatusCode").val(responseText.data.header.statusCode);
	

	// Routing
	$("#maintainShipmentRouting").loadJSON(responseText.data.routing);
	$("#maintainShipmentOverrides").loadJSON(responseText.data.routing);// Commented
	$('#routingTradeCode').val(responseText.data.routing.tradeCode);
	$("#maintainShipmentMilitary").loadJSON(responseText.data.militaryShipment);
	$("#maintainShipmentMilitary").loadJSON(responseText.data.routing);
	$("#maintainShipmentMilitary").loadJSON(responseText.data.header);
	updateMilitaryData(responseText);
	// By
																		// Mangesh:test
	populateLoadDischargeLists(responseText.data.routing);
	
	$('#isInBond').trigger('change');
	if (responseText.data.header.requiredDeliveryDate != null
			&& responseText.data.header.requiredDeliveryDate != '') {
		$("#requiredDeliveryDate").val(
				responseText.data.header.requiredDeliveryDate);
	} else {
		$("#requiredDeliveryDate").val('');
	}
	
	$("#maintainShipmentOverrides").loadJSON(responseText.data.routing);
	displayHideCommoditySection(responseText); // Shipment Security
	reloadShipmentCommodityData(responseText);
	
	setShipperConsigneeCustomized(responseText);
	document.getElementById("commentsDIV").innerHTML='<div class="span-2" id=comment_link>'+
				'<a class="comments" href="#"></a>'+
	 				'<input id="commentId" name="commentId" type="hidden" value="">'+
					'<span id ="count"></span>'+
				'</div>'+
				'<div class="comments" style="display: none">'+
		'<iframe id="commentsFrame" frameborder="0" marginheight="0" marginwidth="0" src=""></iframe>'+
	'</div>';
	
	//Comment Id
	$('#commentId').val(responseText.data.commentId);
	var commentReadOnly=true;
	/*var args = {
			entityType: 'SHMT',
			entityId: $('#shipmentId').val(),
			commentId:  'commentId',
			displayCommentTypes: 'CDBTR,DISPUTE,HZRD,OPS,PCCOL,PDBTR,WEBE,WIRE,CSS,DOC,KICK,PCACTY,PCCSS,SYS,WEBS'
		};
	$("#comment_link").comments(args);*/
	
	}
	
	if($('#tradeCode').val()!='A') {
		enableDisableSection('maintainShipmentHazards', 5, false, false,false); 
	} else {
		enableDisableSection('maintainShipmentHazards', 5, isRoutingDisplayOnly, isRoutingModifiable,true); 
	}
	if($('#tradeCode').val()!='A') {
		enableDisableSection('maintainShipmentStopOffs', 6, false, false,false); 
	} else {
		enableDisableSection('maintainShipmentStopOffs', 6, isRoutingDisplayOnly, isRoutingModifiable,true); 
	}
	
	// edi load/discharge
	// D032440
	var ediService = "";
	
	console.log("load type="+responseText.data.routing.ediLoadServiceCode);
	
	if(responseText.data.routing.ediLoadServiceCode) {
		ediService += responseText.data.routing.ediLoadServiceCode;
	}
	if(responseText.data.routing.ediLoadServiceCode || responseText.data.routing.ediDischargeServiceCode ) {
		ediService += " / ";
	}
	if(responseText.data.routing.ediDischargeServiceCode) {
		ediService += responseText.data.routing.ediDischargeServiceCode;
	}
	$('#ediServiceType').html(ediService);

}



function setClauseHeader(responseText){
	setAccordianTabDetails("clauseHeader", responseText.data.header.clauseHeader);
}

function setSpecialServiceHeader(responseText){
	setAccordianTabDetails("splServicesHeader", responseText.data.header.specialServiceHeader);
}
// post-submit callback
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
		//D032210 - Do not show success message on commodity update
		if (messages.success.length > 0 && msgDivId != 'msgDivCommodity') {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		//D032210 - Scroll to the top only if there is any error
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			if (messages.error.length > 0 || messages.warn.length > 0){
				window.scrollTo(0, 0);
			}
		}
	}
}

function selectForFormSerialize(radioButtonObj, value) {
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}

// function to reset default values in form (in case clearForm() is called)
function resetDefault() {
	//$('select').attr('selectedIndex', 0);
	$('select option:first-child').attr("selected", "selected");
	$('#FormError').hide();
	//setDefaultForAssignLink();
	$('#overrideInitialLtvDate').val('01-01-0001');
	$('#overrideInitialLtvDate').css('color','black');
}

function populateLoadDischargeLists(routingData) {
	
	setLoadDischargeValuesWithDesc(routingData.dschServiceList,'#dischargeServiceCode',	routingData.dischargeServiceCode);
	setLoadDischargeValuesWithDesc(	routingData.loadServiceList,'#loadServiceCode', routingData.loadServiceCode);

}

function isShipmentDeletable() {
	if ($('#shipmentId').val() != null && $('#shipmentId').val() != ''
			&& ($('#statusCode').text() == 'ISSUED' || $('#statusCode').text() == 'CORRECTED')) {
		$("#shipmentDeleteBtn").attr("disabled", true);
	}
}

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
			shipmentId : $('#shipmentId').val()
		},
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
				//$.unblockUI();
				clearPageOnLoad();
				$('#overrideInitialLtvDate').val('');
				eanableDisableSectionsOnScreen(false);
				//showJSON(responseText);
				clearAndResetShipmentScreen();
				$("#shipmentNumber").val(shipment_number);
				$("#shipmentSequenceNumber").val(shipment_sequence_number);
				//$("#shipmentHeaderDiv").loadJSON(responseText.data.header);
				$('#shipmentCustomizeBtn').removeAttr("disabled");
				//showJSON(responseText);
				$('#overrideHeaderCheckBox').attr('checked', false);
				reloadShipmentGrids();
				clearHeaderData();
				$('#commentsDiv').hide();
				setShipmentTitle("");
				$("#shipmentDeleteBtn").attr("disabled", true);
				resetDivNames();
				setScreenOnLoad();
				
				//displayBillOfLading(responseText.data.header.billOfLadingLink);
				// TODO - readonly call removed
				disableBillingFields();
				//makeFormReadOnly(responseText,'shipmentForm', false);
				
			}
			// Messages
			showResponseMessages("msgDiv", responseText);
			$('#msgDiv').show();
			//D027046, For spin when clicked on delete btn in MBill.
			$.unblockUI();
		}
	});
	//$.unblockUI();
}

// common method for reloading all grids for shipment
function reloadShipmentGrids() {
	$("#gridIdForParties").setGridParam({'rowNum':3}); // FOR DEFECT MANUALLY SET
	$("#gridIdForParties").trigger('reloadGrid');
	
	$("#vvdRoutingGrid").setGridParam({'rowNum':3}); // FOR DEFECT MANUALLY SET
	$("#vvdRoutingGrid").trigger('reloadGrid');
	
	$("#referenceNumberGrid").setGridParam({'rowNum':10}); // FOR DEFECT MANUALLY SET
	$("#referenceNumberGrid").trigger('reloadGrid');
	
	$("#specialServiceGrid").setGridParam({'rowNum':10}); // FOR DEFECT MANUALLY SET
	$("#specialServiceGrid").trigger('reloadGrid');
	
	$("#gridIdForClauses").setGridParam({'rowNum':3}); // FOR DEFECT MANUALLY SET
	$("#gridIdForClauses").trigger('reloadGrid');
	
	$("#holdGrid").setGridParam({'rowNum':6}); // FOR DEFECT MANUALLY SET
	$("#holdGrid").trigger('reloadGrid');
	
	$("#commodityGrid").setGridParam({'rowNum':10}); // FOR DEFECT MANUALLY SET(Talib:updated for defect no. 18290)
	$("#commodityGrid").trigger('reloadGrid');
	
	$('#mixcommodityGrid').setGridParam({'rowNum':10}); 
	$("#mixcommodityGrid").trigger('reloadGrid');
	
	$('#povGrid').setGridParam({'rowNum':10}); 
	$("#povGrid").trigger('reloadGrid');
	
	$('#convGrid').setGridParam({'rowNum':10}); 
	$("#convGrid").trigger('reloadGrid');
	loadHoldGrid('D');
	
	//$('#hazardGrid').setGridParam({'rowNum':10}); 
	$("#hazardGrid").trigger('reloadGrid');
	$("#hazardDialogGrid").trigger('reloadGrid');
	
	if($('#tradeCode').val()=='A'){
		$('#stopOffsGrid').setGridParam({'rowNum':6}); 
		$("#stopOffsGrid").trigger('reloadGrid');
	}
	// $("#freightGrid").trigger('reloadGrid');
	// $("#dodaacGrid").trigger('reloadGrid');
}

// common method for making form read only [in case of opening cancelled
// shipment]

function setAccordianTabDetails(id, displayText) {
	// D026341, change to html
	$("#" + id).html(displayText);
}

function setScreenDetails() {
	$("#rateDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});

	// // VVD and routing
	$('#shipmentVVDRoutingDiv').show();
	// $('#isAutoInlandMove').attr('disabled', false);
	// $('#dealerAuctionLocationCode').attr('disabled', false);
	// $('#militaryIbsStatusCode').attr('disabled', false);
	$('#freightMBU').show();

	$('#overrideInitialVesselName').attr('readonly', false);
	$('#overrideCustomsVesselName').attr('readonly', false);
	$('#overrideVoyageDirectionSeq').attr('readonly', false);
	//$('#overrideInitialLtvDate').attr('readonly', false);

	$('#overrideInitialLtvDate').datepicker({
		dateFormat : 'mm-dd-yy',defaultDate:''
	});
	$('#overrideInitialLtvDate').val("");
	
	disableRepeatContact(true);
}



//modified for 22735-- alredy handled at shipmentHeader.js
/*function enableDisableSendDoc() {
	if ($("#shipmentNumber").val() != null && $("#shipmentNumber").val() != "" && $('#statusCode').text()!="CORRECTED" && $('#statusCode').text()!="ISSUED") {
		$("#shipmentSendDocBtn").removeAttr("disabled");
	}
}*/

function setGlobalVariableValues() {
	lastBlOriginCode = $('#blOriginCityCode').val();
	lastBlOriginDescription = $('#blOriginCityDescription').val();
	lastBlOriginCodeDescription = $('#blOriginCityCodeDescription').val();
	
	lastOriginPortCode = $('#originPortCityCode').val();
	lastOriginPortDescription = $('#originPortCityDescription').val();
	lastOriginPortCodeDescription = $('#originPortCityCodeDescription').val();
	
	lastDestinationPortCode = $('#destinationPortCityCode').val();
	lastDestinationPortDescription = $('#destinationPortCityDescription').val();
	lastDestinationPortCodeDescription = $(
			'#destinationPortCityCodeDescription').val();
	
	lastBlDestinationCode = $('#blDestinationCityCode').val();
	lastBlDestinationDescription = $('#blDestinationCityDescription').val();
	lastBlDestinationCodeDescription = $('#blDestinationCityCodeDescription').val();

	if ($('#tradeCode').val() != '') {
		$('#overridePlaceOfIssue').attr("disabled", true);
		if ($('#tradeCode').val() == 'G' || $('#tradeCode').val() == 'M')
			domesticForeignIndicator = "international";
		else if ($('#tradeCode').val() == 'F') {
			if ($('#originPortCityCode').val() == '')
				domesticForeignIndicator = 'none';
			else {
				$
						.ajax({
							url : "/gates/shipment/routing/validateChinaTrade?cityCode="
									+ $('#originPortCityCode').val(),
							success : function(responseText) {
								if (responseText.data == "Y") {
									domesticForeignIndicator = "china";
									if ($('#direction').val() == 'E'){
										if(isRoutingOverrideModifiable){																				
										$('#overridePlaceOfIssue').attr("disabled", false);
										//validateDefaults('issuePlace');
										var queryString = $('#shipmentForm').formSerialize();
										$.ajax({
											type: 'POST',
											url: _context +"/shipment/routing/validateDefaults?identifier=issuePlace",
											data: queryString,
											success: function(responseText){
												
												$('#overridePlaceOfIssue').val(responseText.overridePlaceOfIssue);
												if(!responseText.isOverridePlaceOfIssue)
													$("#isOverridePlaceOfIssue").attr("checked", false);
												else
													$("#isOverridePlaceOfIssue").attr("checked", true);
												changeTextColour();
												setOverridesHeader();
											}
										});
										if($('#statusCode').text()=="CORRECTED" || $('#statusCode').text()=="ISSUED")										
											$('#overridePlaceOfIssue').attr("disabled", true);
															
										}
									}
								} else
									domesticForeignIndicator = "international";
							}
						});
			}
		} else
			domesticForeignIndicator = "domestic";
	} else
		domesticForeignIndicator = 'none';
	
}

function setDivNames() {
	if ($('input[name="shipper\\.organizationName"]').val() != ''
			&& $('input[name="shipper\\.organizationName"]').val() != null)
		setAccordianTabDetails("shipperNameDiv","-"+
				$('input[name="shipper\\.organizationName"]').val());
	else
		setAccordianTabDetails("shipperNameDiv", "");

	if ($('input[name="consignee\\.organizationName"]').val() != ''
			&& $('input[name="consignee\\.organizationName"]').val() != null)
		setAccordianTabDetails("consigneeNameDiv","-"+
				 $('input[name="consignee\\.organizationName"]').val());
	else
		setAccordianTabDetails("consigneeNameDiv", "");

	setPartiesHeader();
	setRefAndMarks();
	setRoutingDiv();
	setOverridesHeader();
	setSpecialServicesDiv();
	setMilitaryDiv(); 
	setClauseDiv(); 
	setShipmentHold();
	setShipmentHazards();
	if($('#tradeCode').val()=='A'){
		setShipmentStopOffs();
	}
	 
}




function validateDate(dateControl) {
	var date = $('#' + dateControl + '').val();
	var dateSize = date.length;
	var newDate = date;
	var dt1;
	var mon1;
	var year1;

	if (dateSize == 6) {
		dt1 = date.substring(2, 4);
		mon1 = date.substring(0, 2);
		year1 = date.substring(4, 6);
		newDate = mon1 + "-" + dt1 + "-20" + year1;
	} else if (dateSize == 8) {
		dt1 = date.substring(2, 4);
		mon1 = date.substring(0, 2);
		year1 = date.substring(4, 8);
		newDate = mon1 + "-" + dt1 + "-" + year1;
	}
	var valid = false;
	if (isValidDate(newDate)) {
		$('#' + dateControl + '').val(newDate);
		valid = true;
	} else {
		$('#' + dateControl + '').val("");
		$('#' + dateControl + '')
				.validationEngine(
						'showPrompt',
						'Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)',
						'error', 'topRight', true);
	}
	return valid;
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
	var len1 = date.length;
	if (matches == null) {
		if (len1 < '8' && len1 > '10') {
			return false;
		}
		if (len1 == '8') {
			var dt1 = date.substring(2, 4);
			var mon1 = date.substring(0, 2);
			var mn = mon1 - 1;
			var yr1 = date.substring(4, 8);
			var composedDate = new Date(yr1, mn, dt1);
			validDate = composedDate.getDate() == dt1
					&& composedDate.getMonth() == mn
					&& composedDate.getFullYear() == yr1;
			if (validDate) {
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
		validDate = composedDate.getDate() == d && composedDate.getMonth() == m
				&& composedDate.getFullYear() == y;
		if (validDate) {
			var newDate = matches[1] + "-" + d + "-" + y;
			return newDate;
		} else {
			return null;
		}
	}
}

function loadShipmentHeader(responseText) {
	if (null != responseText.data.header) {
		$("#shipmentId").val(responseText.data.shipmentId);
		$("#shipmentHeaderDiv").loadJSON(responseText.data.header);
		$("#shipmentTemplateNumber").html("<a href='#' onclick=\"checkForChangeInShipment('" + responseText.data.header.template +"');\" style=\"color: blue\">"+ responseText.data.header.template +"</a>");
        $("#rateDateOriginal").val(responseText.data.header.rateDate);
        $('#domesticForeignIndicator').val(responseText.data.header.tradeType);
        domesticForeignIndicator = $('#domesticForeignIndicator').val(); 
        $("#freightReceivedDateOriginal").val(responseText.data.header.freightReceivedDate);                      
       // $('#overrideInitialLtvDateDefaultvalue').val(responseText.data.header.overrideInitialLtvDateDefaultvalue);
        var list= responseText.data.header.customerGroupList;
        var selectedCustomer= responseText.data.header.customerGroupId;
        var selectedCustomerIndex=0;
		$('#customerGroupId option').remove();								
		$.each(list, function(index,customerGroup) {
			if(customerGroup.customerGroupId==selectedCustomer && selectedCustomerIndex==0){
				selectedCustomerIndex=index;
			}
			$("#customerGroupId").get(0).options[$("#customerGroupId").get(0).options.length] = new Option(customerGroup.customerGroupName, customerGroup.customerGroupId);
		});
		document.getElementById("customerGroupId").selectedIndex=selectedCustomerIndex;
		
		// Shipper
		$("#shipper").loadJSON(responseText.data.shipper);
		loadAdditionalShipperDetails(responseText);

		// Consignee
		$("#consignee").loadJSON(responseText.data.consignee);
		loadAdditionalConsigneeDetails(responseText);

		// Parties
		$("#maintainShipmentParties").loadJSON(responseText.data.header);
		
		// MarksNumbers
		$("#marksAndNumbers").val(responseText.data.header.markNumberString);
	}
}




function clearShipmentForm() {
	var webPageSectionIds = [ 'maintainShipmentHeader',
			'maintainShipmentShipperConsignee', 'maintainShipmentParties',
			'maintainShipmentRefNumberMarks', 'marksAndNumbersSection',
			'maintainShipmentRouting', 'maintainShipmentOverrides',
			'maintain_commodity_shipment','maintainShipmentMilitary',
			'maintainShipmentSpecialServices','maintainBookingClauses',
			'maintainShipmentHold','maintainShipmentOverrides' ];// ,
																		// 'maintainShipmentCommodity',
																		// 'militarySection',
	for ( var i = 0; i < webPageSectionIds.length; i++) {
		clearWebPageSection(webPageSectionIds[i]);
	}
	resetShipmentForm();
}

function clearWebPageSection(webPageSectionId){
	var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week|hidden)$/i;
	$("#" + webPageSectionId+" :input").each(function() {
		var t = this.type, tag = this.tagName.toLowerCase();
		if (re.test(t) || tag == 'textarea') {
			this.value = '';
		} else if (t == 'checkbox' || t == 'radio') {
			this.checked = false;
		} else if (tag == 'select') {
			this.selectedIndex = 0;
		}
	});
}

function resetShipmentForm(){
	resetDivNames();
	reloadShipmentGrids();
	$("#shipmentStatusCode").attr("disabled",true);
	$("#createDate").html("");
	$("#lastUpdateDate").html("");
	$("#lastUpdateDateTimeUser").html("");
	$("#createUser").html("");
	clearHeaderData();
	cleanShipperConsignee();
	$('#typeCode option:first-child').attr("selected", "selected");
	$('#referenceNumberNotation').val('');
	resetShipmentParties();
	
}

function showMadatoryBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Please Provide Shipment Number </div>");
	$('#msgDiv').show();
}
function showNonExistBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Shipment not found.</div>");
	$('#msgDiv').show();
}

function showSaveBillManagerMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Error occured while saving changes for Bill Manager.</div>");
	$('#msgDiv').show();
}

function setSaveBillBeforeBillButton(){
	saveBillBeforeBillButton = true;
}
function showSuccessLoadingBillMessage() {
	//Added the shipment number to display message for DD024533
	$('#msgDiv').html("<div class=\"message_info\">Shipment "+document.getElementById('shipmentNumber').value+" successfully loaded.</div>");
	$('#msgDiv').show();
}

function clearAllMessage(){
	$('#msgDiv').html("");
	$('#msgDiv').show();
}

function expandAll(){
	 $('.ui-accordion-content').attr('style','display:block');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').removeClass('ui-state-default').
	 removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	 window.scrollTo(0, 0);
	/* $('.shipment-section').each(function(index) {
			$(this).accordion('option', 'active', true);
		});*/
	 createShipmentPartieGrid();
	 createShipmentReferenceNumberGrid();
		createShipmentRoutingGrid();
		createShipmentCommodityGrid();
		createShipmentSpecialServiceGrid();
		createShipmentClauseGrid();
		createShipmentHazardGrid();
		if($('#tradeCode').val()=='A'){
			createShipmentStopOffsGrid();
		} 
}

/*function collapseAll() {
	$('.ui-accordion-content').attr('style', 'display:none');
}*/

function collapseAll(){
	 $('.ui-accordion-content').attr('style','display:none');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top').removeClass('ui-state-active').
	 removeClass('ui-corner-top').addClass('ui-state-default').addClass('ui-corner-all');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all span').removeClass('ui-icon-triangle-1-s')
	 .addClass('ui-icon-triangle-1-e');
	 //$('#conditionAccordians').accordion('activate', false);
	 //window.scrollTo(0, 0);
	 
	/* $('.shipment-section').each(function(index) {
			$(this).accordion('option', 'active', false);
		});*/
}

function shipmentHeaderLink(url){
	
	var shipmentIdHeader = $("#shipmentId").val();
	var shipmentNumberHeader = $("#shipmentNumber").val();
	
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		shipment_sequence_number="000";
	}
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		shipment_correction_number="000";
	}
	
	var originPortCityCode = $("#originPortCityCode").val();
	var destinationPortCityCode = $("#destinationPortCityCode").val();
	
	
	var tradeCodeHeader = $("#tradeCode").val();
	var tradeCodeValueHeader = $("#tradeCodeDesc").text();
	var shipmentStatusHeader = $("#statusCode").text();
	var customerGroupHeader = $("#customerGroupId option:selected").text();
	if(customerGroupHeader == 'Select') {
		customerGroupHeader = '';
	}
	var placeOfRecieptHeader = $("#blOriginCityCode").val();
	var portOfLoadingHeader = $('#originPortCityCode').val();
	var portOfDischargeHeader = $("#destinationPortCityCode").val();
	var placeOfDelevieryHeader = $("#blDestinationCityCode").val();
	
	var shipperHeader = $('input[name="shipper\\.organizationName"]').val();
	var consigneeHeader = $('input[name="consignee\\.organizationName"]').val();
	
	var vvdHeader = $("#vessel").val() + ' ' + $("#voyage").val() + ' ' + $("#direction").val();
	var ldSVCHeader = '';
	
	if($("#loadServiceCode").val() != '' && $("#dischargeServiceCode").val() != '') {
		ldSVCHeader = $("#loadServiceCode").val() + ' - ' + $("#dischargeServiceCode").val();	 
	} else if($("#loadServiceCode").val() == '' && $("#dischargeServiceCode").val() != '') {
		ldSVCHeader = $("#dischargeServiceCode").val();
	} else if($("#loadServiceCode").val() != '' && $("#dischargeServiceCode").val() == '') {
		ldSVCHeader = $("#loadServiceCode").val();
	}
	
	var debtorHeader =$("#prepaidCollectCode option:selected").val();
	var debtorValueHeader = $("#prepaidCollectCode option:selected").text();
	var firstPage = $(document).getUrlParam("firstPage");
	var shipmentHeaderParam= "?shipmentIdHeader="+shipmentIdHeader
			+ "&tradeCodeHeader=" + tradeCodeHeader 
			+ "&shipmentStatusHeader="+ shipmentStatusHeader 
			+ "&customerGroupHeader="+ customerGroupHeader 
			+ "&placeOfRecieptHeader="+ placeOfRecieptHeader 
			+ "&portOfLoadingHeader="+ portOfLoadingHeader 
			+ "&portOfDischargeHeader="	+ portOfDischargeHeader 
			+ "&placeOfDelevieryHeader="+ placeOfDelevieryHeader 
			+ "&shipperHeader=" + shipperHeader
			+ "&consigneeHeader=" + consigneeHeader 
			+ "&vvdHeader=" + vvdHeader
			+ "&ldSVCHeader=" + ldSVCHeader 
			+ "&debtorHeader=" + debtorHeader
			+ "&debtorValueHeader=" + debtorValueHeader
			+ "&tradeCodeValueHeader=" + tradeCodeValueHeader
			+ "&shipmentNumberHeader=" + shipmentNumberHeader 
			+ "&shipmentNumber=" + shipmentNumberHeader 
			+ "&originPortCityCode=" + originPortCityCode 
			+ "&destinationPortCityCode="+ destinationPortCityCode
			+ "&shipmentSequenceNumber=" + shipment_sequence_number 
			+ "&shipmentCorrectionNumber="+ shipment_correction_number
			+ "&firstPage="+ firstPage;

	//document.location.href= _context +"/booking/"+url+bookingHeaderParam; 
	//alert(shipmentHeaderParam);
	
	//window.open(_context + url+shipmentHeaderParam);
	document.location.href=_context + url+shipmentHeaderParam;
	
}

function reloadShipmentCommodityData( responseText){
	$('#shipmentCommodityHeader').text(responseText.data.commoditySectionHeader);
	//setFreightAccordianTabDetails(responseText.data.shipmentItemForm.commodityLine, responseText.data.header.tariffNumber, responseText.data.shipmentItemForm.itemNumber, responseText.data.shipmentItemForm.customerCommodityDescription, responseText.data.shipmentItemForm.commodityDesc);
	
	//$('#shipmentCommodityHeader').text($('#shipmentCommodityHeader').text()+" | "+$('#containerCommodityDesc').val().trim());
	$('#tariffNumber').val(responseText.data.header.tariffNumber);
	$('#tariffCheck').val(responseText.data.header.tariffNumber);
	$("#shipmentItemId").val(responseText.data.shipmentItemForm.shipmentItemId);
	$("#unitOfCommodity").val(responseText.data.shipmentItemForm.unitOfCommodity);
	$("#commodityLine").text(responseText.data.shipmentItemForm.commodityLine);
	$("#commodityDesc").val(responseText.data.shipmentItemForm.commodityDesc);
	$("#itemNumber").val(responseText.data.shipmentItemForm.itemNumber);
	$("#piece").val(responseText.data.shipmentItemForm.piece);
	$("#note").val(responseText.data.shipmentItemForm.note);
	$("#kind").val(responseText.data.shipmentItemForm.kind);
	
	setTimeout(function(){
		if($('#billType').val()=="HHGDS" && $("#kind").val().trim()=="")
			$("#kind").val("PCS");
		},3000);
	
	//D028093: Set Unit Of Measure Sourece Code
	$('#unitOfMeasureSourceCode').val(responseText.data.header.unitOfMeasureSourceCode);	
	if(responseText.data.header.unitOfMeasureSourceCode=="I"){
		$("#netWeight").val(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
		$("#cube").val(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
	}else{
	$("#netWeight").val(responseText.data.shipmentItemForm.netWeight);
	$("#cube").val(responseText.data.shipmentItemForm.cube);
	}
	$('#shipmentCommodityCode').val(responseText.data.shipmentItemForm.commodityCode);
	populateCommodityCodeListBilling(responseText.data.shipmentItemForm.commodityCodeList);
	$("#shipmentCommoditycommentId").val(responseText.data.shipmentItemForm.commentId);
	//$("#containerCommodityDesc").val(responseText.data.shipmentItemForm.ContainerCommodityDesc);
	if(responseText.data.shipmentItemForm.cmdLineLink!=null){
	$("#cmdLineLink").text(responseText.data.shipmentItemForm.cmdLineLink+"/");
	$("#pieceValue").text(responseText.data.shipmentItemForm.cmdLineLink);
	}else{
		$("#cmdLineLink").text("0"+"/");
	}
	if(responseText.data.shipmentItemForm.cmdLineLink!=null){
	    $("#cmdLineLinkPov").text(responseText.data.shipmentItemForm.cmdLineLink+"/");
	}else{
		$("#cmdLineLinkPov").text("0"+"/");
	}
	if(responseText.data.shipmentItemForm.totalEqpts!=null){
	    $("#totalEqptsPov").text(responseText.data.shipmentItemForm.totalEqpts);
	}else{
		
	}
	if(responseText.data.shipmentItemForm.cmdLinks!=null){
	$("#cmdLinks").text(responseText.data.shipmentItemForm.cmdLinks+"/");
	}else{
		$("#cmdLinks").text("0"+"/");
	}
	if(responseText.data.shipmentItemForm.totalEqpts!=null){
	$("#totalEqpts").text(responseText.data.shipmentItemForm.totalEqpts);
	}else{
		
	}
	$("#shipmentCommodityHeader").text(responseText.data.commoditySectionHeader);
	setFreightAccordianTabDetails(responseText.data.shipmentItemForm.commodityLine, responseText.data.header.tariffNumber, responseText.data.shipmentItemForm.itemNumber, responseText.data.shipmentItemForm.customerCommodityDescription, responseText.data.shipmentItemForm.commodityDesc);
	//$('#shipmentCommodityHeader').text($('#shipmentCommodityHeader').text()+" | "+$('#containerCommodityDesc').val().trim());
	
	$("#containerCommodityDesc").val(responseText.data.shipmentItemForm.customerCommodityDescription);
	$("#loadDschServiceGroupCode").val(responseText.data.routing.loadDschServiceGroupCode);
	enableDisableActualTrucker();
	$("#routingLoadDischargePair").val(responseText.data.routing.routingLoadDischargePair);
	 $("#statusCode").text(responseText.data.header.statusCode);
	// setting of mixed Commodity Details
	 $('.ui-state-error').parent().hide();
	 
	 $('#tr_shipmentFreightId').hide();
	 somethingChanged = false;
	updateKindList(responseText);
	updateCommodityLine(responseText);
	changeCommodtiySectionOnLdsDscBasis(responseText);
	enableCommoditySectionButtons("ALL");
	$('#msgDivCommodity').html("");
	dimensionFieldSetUp(responseText);
	reloadCommoditySectionButtons(responseText);
	if(responseText.data.header.tariffNumber!=null || responseText.data.header.tariffNumber!=""){
		$('#itemNumber').removeAttr("readOnly");
	}

	 removeMandatoryCheck();
	 
	
	}

//Method to get Parameter from request URL. Parameter to be fetchd should be passed as parameter.
function getSRC(name){
	   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
	      return decodeURIComponent(name[1]);
	}


function disableRepeatContact(enableDisable){
	if(isShipperConsigneeModifiable){
		$('#shipperRepeatContact').attr('disabled', enableDisable);
		$('#consigneeRepeatContact').attr('disabled', enableDisable);
	}
	if(isPartyUpdate || isPartyAdd){
		$('#partiesRepeatContact').attr('disabled', enableDisable);
	}
}

function setScreenOnLoad(){
	clearDefaultDate();

	// Reloading shipment grids after changing data.
	reloadShipmentGrids();
	// BR - enabling disable Bill Type
	enableDisableBillType();
	enableDisableRateDate();
	// BR enable disable Action button
	enableDisableActionButtons();
	
	disableRepeatContact(false);
	
	//changeLabelTotalWeightAndQube();
	showHideLableAsPerValues();
						 
	//enableDisableSendDoc();
	// Display Unreleased Holds Grid on initial display
	//openUnreleasedHoldGridOnIntialDisplay("shipment");
	enableDisableTotalWeightAndQube();
	setGlobalVariableValues();
	setDomesticForeignIndicator();
	changeTextColour();
	processChangeSource();
	//populateOverrideFields();
	processShipperConsigneeColor("consignee");
	processShipperConsigneeColor("shipper");
	//createHoldGrid("shipment");
	
	/*if($.trim($('input[name="shipper\\.address"]').val())!='' &&
		$.trim($('select[name="shipper\\.contactId"]').val()) == '') {
		$('select[name="shipper\\.contactId"]').trigger('change');
	}
	if($.trim($('input[name="consignee\\.address"]').val())!='' && 
			$.trim($('select[name="consignee\\.contactId"]').val()) == '') {
		$('select[name="consignee\\.contactId"]').trigger('change');
	}*/

	
	 
	//To Display Hold Link
	displayOnHoldOrNot();
	
	if($.trim($('select[name="consignee\\.contactId"]').val())!=''){
		$('input[name="consignee\\.contact"]').val('');
	}
	if($.trim($('select[name="shipper\\.contactId"]').val())!=''){
		$('input[name="shipper\\.contact"]').val('');
	}
	
}

//D022276
function checkSourcePageExpandGrid(){
	var gridId = parent.location.hash;
	if(gridId == '#SpclSvc'){
		parent.location.hash="";
		createShipmentSpecialServiceGrid();
		accordionIndex=6;
		expandRelatedDivForSrc('#maintainShipmentSpecialServices');
	}else if(gridId == '#Hold'){
		parent.location.hash="";
		accordionIndex=8;
		expandRelatedDivForSrc('#maintainShipmentHold');
	}	
}
function expandRelatedDivForSrc(divId)
{
	collapseAll();
	window.scrollTo(0, 0);
	$(divId).css('display', 'block');
	$(divId).addClass('ui-accordion-content-active');
	$(divId).parent().find('h3')
		      .removeClass('ui-state-default').removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top')
		 	.find('span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
	windowLocationAccordion();
}
function windowLocationAccordion(){
	if(accordionIndex!=''){		
		var offset = accordianPostionCoordinates(accordionIndex);
		window.scrollTo(offset.left, offset.top);
	}
} 

function accordianPostionCoordinates(accordionIndex){
	return $($('.shipment-section')[accordionIndex]).offset();
}

function enableDisableActualTrucker(){
	var loadDischargeGrpCd = $('#loadDschServiceGroupCode').val().trim();
	if(loadDischargeGrpCd=="CY"){

		$('#actualDeliveryCarrierCode').show();
		$('#actualDeliveryCarrierCodeLabel').show();
		$('#actualPickupCarrierCode').show();
		//$('#actualPickupCarrierCode').show().attr("disabled", true);
		$('#actualPickupCarrierCodeLabel').show();
		
	}
	else{
		
		$('#actualDeliveryCarrierCode').hide();
		$('#actualDeliveryCarrierCodeLabel').hide();
		$('#actualPickupCarrierCode').hide();
		$('#actualPickupCarrierCodeLabel').hide();

	}
}

function  clickShipmentChargesBtn(){
	
	$("#shipmentChargesBtn").click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var shipmentNumberHeader = $("#shipmentNumber").val();
		
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}
		/*if((changeInShipperConsignee==true || changeInParties==true || changeInRefNumberMarks==true || changeInRoutingVVD==true ||
				changeInCommodity==true || changeInMilitary==true || changeInSpecialServices==true || changeInClauses==true ||
				changeInShipmentHold==true || changeInShipmentOverride==true ||
				changeInPartiesGrid==true || changeInSpecialServiceGrid==true || changeInClausesGrid==true || changeInHoldGrid==true || oneTimeCustomerAdded==true) 
				&& ($('#statusCode').text() != 'ISSUED') && ($('#statusCode').text() != 'CORRECTED') && ($('#statusCode').text() != "")){
					
					var conf= confirm('All unsaved changes will be discarded. Continue?');
			   		if(conf== true ){
			   			var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
						shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
						"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2";
					window.location = _context + url;
			   		}
		}else{*/
			var firstPage = $(document).getUrlParam("firstPage");
			var previousPage =  $(document).getUrlParam("src");
			if(previousPage == "BillAQ"){
				firstPage = "BillAQ";
			}
			var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
			shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2"+"&firstPage="+firstPage;
			window.location = _context + url;
		//}
		
			
	}	);	
}
function clickShipmentPayablesBtn(){
	$("#shipmentPayablesBtn").click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var shipmentNumberHeader = $("#shipmentNumber").val();
		
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}
		var firstPage = $(document).getUrlParam("firstPage");
		var url = "/billLadingPayable/find?shipmentNumber="+
			shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2"+"&firstPage="+firstPage;
		window.location = _context + url;
			
	}	);
	}

function clickShipmentStatusBtn(){
	$("#shipmentStatusBtn").click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var shipmentNumberHeader = $("#shipmentNumber").val();
		
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}
		var firstPage = $(document).getUrlParam("firstPage");
		var url = "/bill_status_history/find?shipmentNumber="+
			shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number;
		if(firstPage == "BLSP"){
			url = url + "&navigationUrl=BLSP";
		} else{
			url = url + "&navigationUrl=2";
		}
			
		window.location = _context + url;
			
	}	);
	
	}
	
function clickShipmentGoBtn(){
	$('#shipmentGoBtn').click(
			
			function() {
				
				if(isAnyChangeOnPage()) {
					if(!confirm('You have unsaved changes! \nContinue?')) {
						return;
					}
				}
				
				window.itemList = null;
				
				$('#shipmentForm').validationEngine('attach');	// for removing PopUp on page Load,it is used here
				if(	$("#checkForLoadShipment").validationEngine('validate')){
				var shipment_number = $("#shipmentNumber").val();
	
				if (shipment_number == null || shipment_number == "") {
					showMadatoryBillMessage();
					return;
				}
				 var length = $($('.ui-state-error',"#commodityGridDiv")).length;
				 for(i=0;i<length; i++){
					if(($($('.ui-state-error',"#commodityGridDiv"))[i]).innerHTML!=""){
						$($($('.ui-state-error',"#commodityGridDiv"))[i]).parent().remove();
						
					}
					 
				 }
				 blockUI();
				showLoadingMessage();
				setTimeout('displayShipment()',200); 
				//displayShipment();
				collapseAll();
				//$.unblockUI();
				//added against 21739
				//resetChangeInInputBooleans();
				captureChanges();
			}});
	$('#anyChangesDone').val("N");
	dirtyData=false;
}

function clickShipmentSaveBtn() {
	
	if (console) console.log('clickShipmentSaveBtn click called');
	
	$('#shipmentSaveBtn').click(function() {
		
		if (console) console.log('shipmentSaveBtn click called');

		if(($('#tradeCode').val()=='F' || $('#tradeCode').val()=='M' || $('#tradeCode').val()=='G')
		    && $('#loadDschServiceGroupCode').val()=='CY'|| $('#loadDschServiceGroupCode').val()=='cy'){
        	if($('#statusCode').text() == "IN AUDIT" || $('#statusCode').text() ==  "F/C AUDIT"
        	    || $('#statusCode').text() == "RATED" || $('#statusCode').text() == "F/C RATED"){
        	   if( validateSealNumber() ){
        			alert("Seal Number is required to Bill");
        			return false;
        	    }
        	}
        }


		if(!checkActionValidation()){return; }
		//D024736: Fields are not mandatory when tariffNumber and itemNumber are not present
		if($('#unitOfCommodity').val()==null || $('#unitOfCommodity').val()==0 || ($('#tariffNumber').val() =="" && $('#itemNumber').val() ==""))
		{
			$('#netWeight').removeClass("validate[required]");	
			$('#netWeight').removeClass("validate[custom[number]]");
			$('#netWeight').removeClass("validate[funcCall[validateNetWeight]]");
			$('#netWeight').removeClass("custom[max[9999999.999]]]");
			$('#netWeight').removeClass("custom[min[0000000.001]]]");
			$('#commodityDesc').removeClass("validate[required]");
			$('#commodityDesc').removeClass("validate[funcCall[validateTrfCmdDesc]]");
		}
		
		 if (!$("#shipmentForm").validationEngine('validate') || !validateShipmentUIFields()) {
			 return;
		 }else{
			 hidePromptForUiFieldsAllSections(); // for defect D018373
		 }
		 dirtyData=false;
		 blockUI();
	 showWarningIfAroleChangeAndRefNumberRequiredShipper();
	 showWarningIfAroleChangeAndRefNumberRequiredConsignee();
	 
	//D032557
	if(!validateInvoiceNumbers()){
		$.unblockUI();
		return false;
	}
	 
	validateShipment();
	 //added for 21739
	// resetChangeInInputBooleans();
	 captureChanges();
	});
	}

function clickShipmentExitBtn() {
	$('#shipmentExitBtn')
			.click(
					function() {
						
						//added against 21739
						
						/*if((changeInShipperConsignee==true || changeInParties==true || changeInRefNumberMarks==true || changeInRoutingVVD==true ||
						changeInCommodity==true || changeInMilitary==true || changeInSpecialServices==true || changeInClauses==true ||
						changeInShipmentHold==true || changeInShipmentOverride==true ||
						changeInPartiesGrid==true || changeInSpecialServiceGrid==true || changeInClausesGrid==true || changeInHoldGrid==true || oneTimeCustomerAdded==true) 
						&& ($('#statusCode').text() != 'ISSUED') && ($('#statusCode').text() != 'CORRECTED') && ($('#statusCode').text() != "")){
							
							var conf= confirm('All unsaved changes will be discarded. Continue?');
					   		if(conf== true ){*/
								// D024515 - Fix for exit function
								var firstPage = $(document).getUrlParam("firstPage");
								var previousPage =  $(document).getUrlParam("src");
								if(firstPage=="BLSP"){
									document.location.href = _context+"/billingSetup/loadShipmentDetail";
								} else if (firstPage == "BillAQ"){
									document.location.href = _context+"/cas/auditApprovalSearch.do?reset=true";
								} else if (previousPage == "FTWQ"){
									document.location.href = _context+"/cas/bookBillWorkQueueSearch.do";
								} else if (previousPage == "BLSC"){
									document.location.href = _context+"/cas/shmtSelectionDeletionSearch.do";
								} else if (previousPage == "BillAQ"){
									document.location.href = _context+"/cas/auditApprovalSearch.do?reset=true";
								}
								else if (previousPage == "FIAQ"){
									document.location.href = _context+"/cas/freightInvoiceAssignmentQueueSearch.do?searchAgain=true";
								}
								else {								
										 var currentURL = document.location.href;
										 var urlIndex = currentURL.lastIndexOf('?');
										 if(urlIndex>0){
											 if(document.referrer.indexOf("/auditApprovalSearch") > 0)
											 {
												document.location.href = _context+"/cas/auditApprovalSearch.do?reset=true";
											 }
											else{		
											 document.location.href = _context;
											}
										 }else{
											 document.location.href = _context;
										 }
									 
									 }
					   			
					   			/*}
					   		else{}
						}
						else{
							
						
						
						var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
						if (isConfirm) {
						
						//to go to Bill of lading setup if came from there on click of exit button
						previouspage = document.referrer;
						previouspage2 = document.referrer;
						 n = previouspage.lastIndexOf('/');
						 m=previouspage.lastIndexOf('=');
						 if (n >= 0) {
							 previouspage = previouspage.substring(n + 1);
						 }
						 if (m >= 0) {
							 previouspage2 = previouspage2.substring(m+1);
						 }
						 var s="loadShipmentDetail";
						 var t="BLFP";
						 
						if(s==previouspage)
							 document.location.href = _context+"/billingSetup/loadShipmentDetail";
							 
						
						else if(t==previouspage2){
							document.location.href = _context+"/billingSetup/loadShipmentDetail";
						}
						 else
							 {
							 document.location.href = _context
								+ '/shipment/exit';
							 var currentURL = document.location.href;
							 var urlIndex = currentURL.lastIndexOf('?');
							 if(urlIndex>0){
								 //window.history.back();
								 if(document.referrer.indexOf("/auditApprovalSearch") > 0)
								 {
									document.location.href = _context+"/cas/auditApprovalSearch.do?useCache=no&method=show";
								 }
								else{		
								 document.location.href = document.referrer;
								}
							 }else{
								 document.location.href = _context;
							}
							 
							 }
						}	*/
						//}
					});
}
function clickShipmentCustomizeBtn(){
	$('#shipmentCustomizeBtn').click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
			shipmentHeaderLink("/shipment/customizednameandaddress/showForm");
	});
	}

function clickShipmentDeleteBtn(){
	$('#shipmentDeleteBtn').click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		$("#deleteShipmentDialog").dialog('open');
		captureChanges();
	});
}	

function clickShipmentCorrectionsBtn(){
	$("#shipmentCorrectionsBtn").click(	function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var firstPage = $(document).getUrlParam("firstPage");
				document.location.href = _context+ "/bill/frtcorrection/find?shipmentNumber="+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber=000&source=BILL&firstPage='+firstPage;
			});
	}
function clickShipmentSendDocBtn(){
	$("#shipmentSendDocBtn").click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var shipmentNumberHeader = $("#shipmentNumber").val();
		
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		//D032364
		var shipment_correction_number = "000";
		
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		
		var firstPage = $(document).getUrlParam("firstPage");
		var url = "/printFreightBill/go?shipmentNumber="+
			shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number+"&source=maintainBill&firstPage="+firstPage;
		window.location = _context + url;
			
	}	);
	}
function clickShipmentStatusBtnBtn(){
	$("#shipmentStatusBtn").click(function() {
		if(!checkActionValidation()){return; }
		//if(checkDirtyData()==false){return; }
		var shipmentNumberHeader = $("#shipmentNumber").val();
		
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}
		var firstPage = $(document).getUrlParam("firstPage");
		var url = "/bill_status_history/find?" +
				"shipmentNumber="+shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2&firstPage="+firstPage;
		window.location = _context + url;
			
	});
	}

function createDeleteShipmentConfirmDialog() {
	$("#deleteShipmentDialog").dialog({
		autoOpen : false,
		width : 450,
		modal : true,
		title: "Delete Shipment",
		position: ['center','80'], 
		open : function() {
			$("#deleteShipmentDialog").dialog({height: 'auto'});
		},
		close : function() {
			$('#msgDiv').html('');
			$('#msgDiv').hide();
			$("#deleteShipmentDialog").dialog('close');
		},
		buttons:{
			OK: function() {
				blockUI();
				deleteShipment();
				$("#deleteShipmentDialog").dialog('close');
			}, 
			Close: function() {
				$("#deleteShipmentDialog").dialog('close');
			}
		}
	});
}

function setShipperConsigneeCustomized(responseText){
	if(responseText.data.shipperNameAddressCustomized){
		$('input[name="shipper\\.organizationName"]').css('color', 'green');
	}else{
		$('input[name="shipper\\.organizationName"]').css('color', 'black');
	}
	if(responseText.data.consigneeNameAddressCustomized){
		$('input[name="consignee\\.organizationName"]').css('color', 'green');
	}else{
		$('input[name="consignee\\.organizationName"]').css('color', 'black');
	}
}

function rateBill(){
	
//	if(dirtyData==true && checkActionValidation()){
//		 if (!$("#shipmentForm").validationEngine('validate') || !validateShipmentUIFields()) {
//			 return;
//		 }else{
//			 hidePromptForUiFieldsAllSections(); // for defect D018373
//		 }
//	 showWarningIfAroleChangeAndRefNumberRequiredShipper();
//	 showWarningIfAroleChangeAndRefNumberRequiredConsignee();
//	 validateShipment();
//	}
	 makeGridForReError("shipment");
	$('#shipmentForm').gatesEnable();
	var queryString = $("#shipmentForm").formSerialize();
	$.ajax({
		type : "POST",
		url : _context + "/shipment/rateBill",
		data : queryString,
		success : function(responseText) {
			//$.unblockUI();
			if(responseText.success==false){
			//D032676: 	GATES Performance - Maintain Bill - Bill Button - Merge save and rateBill transactions into one server call 
				$("#shipmentStatusCode").attr("disabled", true);
				showResponseMessages("msgDiv", responseText);			
				enforceUserSecurityRolesAndPermissions();
				$.unblockUI();
				return;
			}
			if (responseText.messages.error.length == 0) {
				somethingChanged= false;
				captureChanges();
				if(responseText.data.rateView != null) {
					if(responseText.data.rateView == "showError"){
						$("#shipmentForm").loadJSON(responseText.data);
						loadErrorOverLay(responseText);			
						$.unblockUI();
						$('#re_error_dialog').dialog( "open" );
						$("#reErrorGrid").trigger('reloadGrid');
						reloadShipmentGrids();
						openHoldsUnreleasedDialog('shipment');
						$("#holdDialog").dialog("close");
					}else if(responseText.data.rateView == "showChoices"){
						$("#shipmentForm").loadJSON(responseText.data);
						loadChoiceOverLay(responseText);
						$('#reUseSelection').val('S');
						$.unblockUI();
						$('#re_choice_dialog').dialog( "open" );
						$("#reChoiceGrid").trigger('reloadGrid');
					}else if(responseText.data.rateView == "hold"){
						$.unblockUI();
						if(responseText.data.flow == true){
							navigateToTargetPageForFurtherFlow('Maintain Booking',responseText.data.targetPage, 
								$("#shipmentNumber").val(), responseText.data.header.shipmentSequenceNumber,"000",
								"2");
							return;
						}
//						if(responseText.data.targetPage == "Maintain Bill"){
////							displayShipment();
//							reloadShipmentGrids();
//							openHoldsUnreleasedDialog('shipment');
//							$("#holdsUnreleased").attr("style","visibilty:visible");
//							$('#holdUnreleasedGrid').trigger('reloadGrid');
//							conculde
//							$("#holdDialog").dialog("close");
//							$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//						}else{
							navigateToTargetPage('',responseText.data.targetPage, 
									$("#shipmentNumber").val(), responseText.data.header.shipmentSequenceNumber,
									$("#shipmentCorrectionNumber").val(),
									"2");
							
//						}
						
					}else if(responseText.data.rateView == "exception"){
						$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
						$.unblockUI();
						return;
					}
					else if(responseText.data.rateView == "blank"){
						$.unblockUI();
						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
						openHoldsUnreleasedDialog('shipment');
					}
					else if(responseText.data.rateView == "Success"){
						$.unblockUI();
						$("#statusCode").html(responseText.data.header.statusCode);
						showResponseMessages("msgDiv", responseText);
						var firstPage = $(document).getUrlParam("firstPage");
						//Changed for defect D025006 
						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
						$("#shipmentNumber").val()+'&shipmentSequenceNumber='+responseText.data.header.shipmentSequenceNumber
						+'&shipmentCorrectionNumber=000&navigationUrl=2&firstPage='+firstPage+'&commodityDisplay=last';
						//console.log("Navigating to BL charges");

					}
				}else{
					showResponseMessages("msgDiv", responseText);
					$.unblockUI();
					return;
				}
				$.unblockUI();
			}
		}
	});

	
}


function setScreenFieldPropertiesforScreenFromFTWQ(){
	$('#shipmentCorrectionNumber').attr('disabled', false);
	$('#shipmentSequenceNumber').attr('disabled', false);
	enableDisableContactId('shipper',false);
	enableDisableContactId('consignee',false);
}


//code addition start for defect --D018373
	function hidePromptForUiFieldsAllSections(){
		hidePromptForUiFields('shipper');
		hidePromptForUiFields('consignee');
		hidePromptForUiFields('parties');
		
	}
//code addition end for defect --D018373

	

	
	//*Added for Shipment Security*/
	function displayHideCommoditySection(responseText){
		if(responseText.data.routing.routingLoadDischargePair!=null && responseText.data.routing.routingLoadDischargePair!="" 
			&& responseText.data.routing.routingLoadDischargePair!="null"){
		if(responseText.data.routing.routingLoadDischargePair.trim() =="AU"){
			//Automotive
			_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityBLAUDisplayOnly, (isCommodityBLAUAdd || isCommodityBLAUUpdate || isCommodityBLAUDelete || isCommodityBLAULink));
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="CY"){
			if(responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="STANDARD" ||
					responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="HHGDS"){
				//container
				_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityBLCNDisplayOnly, (isCommodityBLCNAdd || isCommodityBLCNUpdate || isCommodityBLCNDelete || isCommodityBLCNLink));
			}
			else if(responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="MIXED"){
				//mixed
				_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityBLMXDisplayOnly, (isCommodityBLMXAdd || isCommodityBLMXUpdate || isCommodityBLMXDelete || isCommodityBLMXLink));
			}
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="CON"){
			//conventional
			_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityBLCVDisplayOnly, (isCommodityBLCVAdd || isCommodityBLCVUpdate || isCommodityBLCVDelete || isCommodityBLCVLink));
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="LCL"){
			//conventional
			_enforceSecuritySection('maintain_commodity_shipment', 4, isCommodityBLCVDisplayOnly, (isCommodityBLCVAdd || isCommodityBLCVUpdate || isCommodityBLCVDelete || isCommodityBLCVLink));
		}
		}
	}

	// D019870 code addition start
	function eanableDisableSectionsOnScreen(source)	{
		
		//Added for D029134
		_enforceSecurityHeader();
		/*Shipper|Consignee*/
		enableDisableSection('maintainShipmentShipperConsignee', 0, isShipperConsigneeDisplayOnly, isShipperConsigneeModifiable,source);
		
		/*Parties*/
		enableDisableSection('maintainShipmentParties', 1, isPartiesDisplayOnly, isPartiesModifiable,source);
		
		/*Reference Numbers*/
		enableDisableSection('maintainShipmentRefNumberMarks', 2, (isReferenceNumberMarksDisplayOnly || isMarksDisplayOnly), (isReferenceNumberMarksModifiable || isMarksModifiable),source);
		
		/*Routing*/
		enableDisableSection('maintainShipmentRouting', 3, isRoutingDisplayOnly, isRoutingModifiable,source);
		
		/*Commodity*/
		//enableDisableSection('maintain_commodity_shipment', 4, isCommodityDisplay, isCommodityModifiable,source);
		
		if($('#tradeCode').val()!='A') {
			enableDisableSection('maintainShipmentHazards', 5, false, false,source); 
			enableDisableSection('maintainShipmentStopOffs', 6, false, false,source);
		} else {
			enableDisableSection('maintainShipmentHazards', 5, isRoutingDisplayOnly, isRoutingModifiable,source); 
			enableDisableSection('maintainShipmentStopOffs', 6, isRoutingDisplayOnly, isRoutingModifiable,source);
			//D031445
			displayInvoiceLinks(true);
		}
		if(!isRoutingModifiable) {
			$("#hazardAddATag").contents().unwrap();
			$("#hazardAddPlus").remove();
		}
		
		
		/*Military*/
		enableDisableSection('militarySection', 7, isMilitaryDisplayOnly, isMilitaryModifiable,source);
		
		/*Special Services*/
		enableDisableSection('maintainShipmentSpecialServices', 8, isSpecialServiceDisplayOnly, isSpecialServiceModifiable ,source);
		
		/*Clauses*/
		enableDisableSection('maintainBookingClauses', 9, isClauseDisplayOnly, isClauseModifiable ,source);
		
		/*Holds*/
		enableDisableSection('maintainShipmentHold', 10, isHoldManualDisplayOnly, isHoldManualModifiable ,source);
			
		/*Booking Overrides*/
		enableDisableSection('maintainShipmentOverrides', 11, isRoutingOverrideDisplayOnly, isRoutingOverrideModifiable ,source);
		
	}

	function enableDisableSection(sectionId, accordian, _displayOnly, _modifiableOnly, source){
		console.log("Section="+sectionId+" dis="+ _displayOnly+" mod="+_modifiableOnly);
		
		if(_displayOnly && _modifiableOnly){
			//Commented all header fileds for defect D029134
			$($('.shipment-section')[accordian]).show();
			if(source){
				enableSection(sectionId);
			/*	$("#rateDate").attr("false",false);
				$("#customerGroupId").attr("false",false);
				$("#billType").attr("false",false); */
			}else{
				disableSection(sectionId);
				/*$("#rateDate").attr("disabled",true);
				$("#customerGroupId").attr("disabled",true);
				$("#billType").attr("disabled",true); */
			}
			//checkCopyButtons();
		}else if(_displayOnly && !_modifiableOnly){
			$($('.shipment-section')[accordian]).show();
			disableSection(sectionId);
		/*	$("#rateDate").attr("disabled",true);
			$("#customerGroupId").attr("disabled",true);
			$("#billType").attr("disabled",true); */
		}else if(!_displayOnly && _modifiableOnly ){
			$($('.shipment-section')[accordian]).show();
				if(source){
				enableSection(sectionId);
				/*$("#rateDate").attr("disabled",false);
				$("#customerGroupId").attr("disabled",false);
				$("#billType").attr("disabled",false); */
			}else{
				disableSection(sectionId);
			/*	$("#rateDate").attr("disabled",true);
				$("#customerGroupId").attr("disabled",true);
				$("#billType").attr("disabled",true); */
			}
			//checkCopyButtons();
		}else if(!_displayOnly && !_modifiableOnly){
			hideSectionAccordion(accordian);
			//Added for D028864
		/*	$("#customerGroupId").attr("disabled",true);
			$("#billType").attr("disabled",true); */
		}
	}
	
	// D019870 end
	
	function setRoutingLoadDischargeDetails()
	{
		if($('#loadServiceCode :selected').val()!='' && $('#dischargeServiceCode :selected').val()!='')
		{
			$.ajax({
				async: false,
				type : "GET",
				url: _context +"/shipment/routing/getLoadDschPair",
				data:{
					loadServiceCode:$('#loadServiceCode :selected').val(),
					dischargeServiceCode:$('#dischargeServiceCode :selected').val()
				},
				success: function(responseText)
				{
					populateLoadDschPairValues(data);
				}
			});
		}
		else
		{
			if(isRoutingModifiable)
			{
				$('#blOriginCityCodeDescription').attr('disabled', false);
				$('#blDestinationCityCodeDescription').attr('disabled', false);
				$('#pickupZipCode').attr('disabled', false);
				$('#deliveryZipCode').attr('disabled', false);
			}
		}
		checkPickupCarrier();
		checkDeliveryCarrier();
	}
	
	
	function populateLoadDschPairValues(data){
		if(isRoutingModifiable && data.isRequireBlOrigin!='N')
			$('#blOriginCityCodeDescription').attr('disabled', false);
		else if($('#blOriginCityCode').val()=='' && data.isRequireBlOrigin=='N')
			$('#blOriginCityCodeDescription').attr('disabled', true);
		
		if(isRoutingModifiable && data.isRequireBlDestination!='N')
			$('#blDestinationCityCodeDescription').attr('disabled', false);
		else if($('#blDestinationCityCode').val()=='' && data.isRequireBlDestination=='N')
			$('#blDestinationCityCodeDescription').attr('disabled', true);
		
		if(isRoutingModifiable && data.isRequirePickupZipCode!='N')
			$('#pickupZipCode').attr('disabled', false);
		else if($('#pickupZipCode').val()=='' && data.isRequirePickupZipCode=='N')
			$('#pickupZipCode').attr('disabled', true);
		
		if(isRoutingModifiable && data.isRequireDeliveryZipCode!='N')
			$('#deliveryZipCode').attr('disabled', false);
		else if($('#deliveryZipCode').val()=='' && data.isRequireDeliveryZipCode=='N')
			$('#deliveryZipCode').attr('disabled', true);
	}
	function applycheckDirtyData(){
				$("input").change(function() {
					dirtyData=true;
				});
				$("select").change(function() {
					dirtyData=true;
				});
				$("check").change(function() {
					dirtyData=true;
				});
				
				$('input[type="text"],input[type="checkbox"]:not(:disabled),select,input[type="radio"]:not(:disabled),textarea:not(:disabled)').change(function(){ 
					saveBillBeforeBillButton=true;
					
				});
				$('.ui-inline-delete,.ui-inline-delete, ').click(function(){ saveBillBeforeBillButton=true;});
				}
	
	function checkDirtyData(){
		if(dirtyData==true){
			var r=confirm("Data has been changed. Do you really want to proceed?");
			if (r==true) {
				return true;
			}
			else{
				return false;
			}
		}
		return true;
		}
	
	/*function setCommunicationMethodCodeForShipper(shipperCommunicationMethodCode){
		if(shipperCommunicationMethodCode =='P'){
			$('#shipperComm1').attr("checked",true);
		}else if(shipperCommunicationMethodCode =='C'){
			$('#shipperComm2').attr("checked",true);
		}else if (shipperCommunicationMethodCode =='F'){
			$('#shipperComm3').attr("checked",true);
		}else
			if(shipperCommunicationMethodCode =='E'){
				$('#shipperComm4').attr("checked",true);
			}
		
	}
	function setCommunicationMethodCodeForConsignee(consigneeCommunicationMethodCode){
		if(consigneeCommunicationMethodCode =='P'){
			$('#consigneeComm1').attr("checked",true);
		}else if(consigneeCommunicationMethodCode =='C'){
			$('#consigneeComm2').attr("checked",true);
		}else if (consigneeCommunicationMethodCode =='F'){
			$('#consigneeComm3').attr("checked",true);
		}else
			if(consigneeCommunicationMethodCode =='E'){
				$('#consigneeComm4').attr("checked",true);
			}
		
	}*/
	function disableBillingFields(){
		$('#maintain_commodity_shipment').gatesDisable();
		$('#partiesDialog').gatesDisable();
				$('#partiesAdd').gatesDisable();		
				$('#holdAdd').gatesDisable();
				$('#clausesAdd').gatesDisable();
				$('#specialSerivceAdd').gatesDisable();
				$('#marksAndNumbers').attr("readOnly", true);
				$('#loadServiceCode').attr("readOnly", true);
				$('#dischargeServiceCode').attr("readOnly", true);
		$('#partiesDialog').gatesDisable();
				$('#partiesAdd').gatesDisable();		
				$('#holdAdd').gatesDisable();
				$('#clausesAdd').gatesDisable();
				$('#specialSerivceAdd').gatesDisable();
				$('#marksAndNumbers').attr("readOnly", true);
				$('#loadServiceCode').attr("readOnly", true);
				$('#dischargeServiceCode').attr("readOnly", true);
		}
	function clearAllShipmentGrids()
	{
		$("#referenceNumberGrid").jqGrid("clearGridData", true);
		$("#specialServiceGrid").jqGrid("clearGridData", true);
		$("#vvdRoutingGrid").jqGrid("clearGridData", true);
		$("#mixcommodityGrid").jqGrid("clearGridData", true);
		$("#commodityGrid").jqGrid("clearGridData", true);
		$("#povGrid").jqGrid("clearGridData", true);
		$("#convGrid").jqGrid("clearGridData", true);
		$("#gridIdForClauses").jqGrid("clearGridData", true);
		$("#gridIdForParties").jqGrid("clearGridData", true);
		$("#holdGrid").jqGrid("clearGridData", true);	
		$("#stopOffsGrid").jqGrid("clearGridData", true);

	}
	
	//added against 21739
	/*function checkForChanges(){
		$('#maintainShipmentShipperConsignee').change(function(){
			changeInShipperConsignee=true;
		});
		$('#maintainShipmentParties').change(function(){
			changeInParties=true;
		});
		$('#maintainShipmentRefNumberMarks').change(function(){
			changeInRefNumberMarks=true;
		});
		$('#maintainShipmentRouting').change(function(){
			changeInRoutingVVD=true;
		});
		$('#maintain_commodity_shipment').change(function(){
			changeInCommodity=true;
		});
		$('#maintainShipmentMilitary').change(function(){
			changeInMilitary=true;
		});
		//$('#maintainShipmentSpecialServices').change(function(){
		//	changeInSpecialServices=true;
		//});
		$('#maintainBookingClauses').change(function(){
			changeInClauses=true;
		});
		//$('#maintainShipmentHold').change(function(){
		//	changeInShipmentHold=true;
		//});
		$('#maintainShipmentOverrides').change(function(){
			changeInShipmentOverride=true;
		});
		
		//changes in grids are handled as follows
		
		//handled in shipmentparties.js
		//handled with changeInRefNumberMarks
		//no grid as such for VVD Routing
		//handled with changeInCommodity
		//handled in shipmentSpecialService.js
		//handled at ShipmentClause.js
		//handled at shipmenthold.js
		//handled at shipmentReferencenumber.js
		//handled at convGrid.js
		
		
	}
	//added against 21739
	function resetChangeInInputBooleans(){
		changeInShipperConsignee=false;
		changeInParties=false;
		changeInRefNumberMarks=false;
		changeInRoutingVVD=false;
		changeInCommodity=false;
		changeInMilitary=false;
		changeInSpecialServices=false;
		changeInClauses=false;
		changeInShipmentHold=false;
		changeInShipmentOverride=false;
		changeInPartiesGrid=false;
		changeInSpecialServiceGrid=false;
		changeInClausesGrid=false;
		changeInHoldGrid=false;
		oneTimeCustomerAdded=false;
		counterPartiesGridReloaded=0;
		counterClausesGridReloaded=0;
		counterRefNumberGridReloaded= 0;
		counterConvGridReloaded=0;
		counterSplServicesReloaded=0;
		counterHoldGridReloaded=0;
	}*/
	
	//for defect D022184
	function trimShipperAndConsignee(){
		for(var i=0;i<$('.number').length;i++){
			$($('.number')[i]).val($($('.number')[i]).val().trim()); 
			}
	}
	
	
	function setFreightAccordianTabDetails(freightCount, tariffNumber, tariffItemNumber, commodityDescription, tariffCommodityDescription){
		if(freightCount==0){
			setAccordianTabDetails('shipmentCommodityHeader', "");
		}
		else if(freightCount>0){
			var currentRecord = parseInt($("#unitOfCommodity option:selected").text());
			if(!currentRecord)  currentRecord = 1;
			var commodityDisplayText = " ("+currentRecord+" of "+freightCount+") - ";
			if(tariffNumber!='undefined' && tariffNumber!=null && $.trim(tariffNumber)!=''){
				commodityDisplayText = commodityDisplayText + tariffNumber + " | ";
			}
			
			if(tariffItemNumber!='undefined' && tariffItemNumber!=null && $.trim(tariffItemNumber)!=''){
				commodityDisplayText = commodityDisplayText + tariffItemNumber + " | ";
			}
			
			commodityDisplayText = commodityDisplayText + (commodityDescription!=''&& commodityDescription!=null?commodityDescription.substring(0,30):tariffCommodityDescription);
			if(commodityDisplayText.indexOf("null")>0){ 
				commodityDisplayText=commodityDisplayText.substring(0,commodityDisplayText.indexOf("null"));
			}
			
			/*
			if(equipmentId!='undefined' && equipmentId!=null && $.trim(equipmentId)!=''){
				commodityDisplayText = commodityDisplayText + " | "+equipmentId;
			}*/
			
			// Adding commodity line total
			//commodityDisplayText += " | of "+$('#commodityLine').html();
				
			
			setAccordianTabDetails('shipmentCommodityHeader', commodityDisplayText);
		}
	}
	//21575- auto tab
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
	
	/*function autoTabBillingNameSelector(source, CurrentElementID, NextElementID, FieldLength) {
	    //Get a reference to the two elements in the tab sequence.
	    //var CurrentElement = $('#' + CurrentElementID);
	    var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
	    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
	    //var NextElement = $('#' + NextElementID);
	 
	    CurrentElement.keyup(function(e) {
	        //Retrieve which key was pressed.
	        var KeyID = (window.event) ? event.keyCode : e.keyCode;
	 
	        //If the user has filled the textbox to the given length and the user just pressed 
	        // a number or letter, then move the cursor to the next element in the tab sequence.   
	        if (CurrentElement.val().length >= FieldLength
	            && ((KeyID >= 48 && KeyID <= 90) ||
	            (KeyID >= 96 && KeyID <= 105)))
	            NextElement.focus();
	    });
	}*/
	function isTextSelected(input) {
		if(input.value.length==0) {
			return false;
		}
	    if (typeof input.selectionStart == "number") {
	        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
	    } else if (typeof document.selection != "undefined") {
	        input.focus();
	    }
	}
	function autoTabShipper(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
 	    //Get a reference to the two elements in the tab sequence.
 		var source='shipper';
 		var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
 	    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
 	    
 	
 	    CurrentElement.keydown(function(e) {
 	    	var thisElement=this;
 	    	setTimeout(function(){
 	        //Retrieve which key was pressed.
 	        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 	       //console.log(isTextSelected(this));
 	 
 	        //If the user has filled the textbox to the given length and the user just pressed 
 	        // a number or letter, then move the cursor to the next element in the tab sequence. 
 	        var phoneCountryCode="contactPhoneCountryCode";
 	        var cellCountryCode="contactCellCountryCode";
 	        var faxCountryCode="contactFaxCountryCode";
 	        
 	        if ((CurrentElementID == phoneCountryCode) || (CurrentElementID == cellCountryCode)	|| (CurrentElementID == faxCountryCode)) 
 	        {
 	        	if ((CurrentElement.val()=='1' || 
 	        	        CurrentElement.val()=='01' ||  CurrentElement.val()=='001' || 
 	        	        CurrentElement.val().length == 3)
 					&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105)) && !isTextSelected(thisElement))
 	        		{
 	        			NextElement.select();
 	        		}
 	        	
 	        
 			}
 	        else {
 	        	
 	        	 
 	        	
 				if (((CurrentElement.val().length == FieldLength && isAmericanShip(CountryCodeID)) || 
 						(CurrentElement.val().length == 4))
 								&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(thisElement))
 					{	
 					var value=$('#contactPhoneCountryCode').val();
 							NextElement.select();
 					}
 						
 				 }
 	        
 	      
 			/* * if (CurrentElement.val().length >= FieldLength && ((KeyID >= 48 &&
 			 * KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))) NextElement.focus();*/
 	    	},5);
 	    });
 	}
	
	
	function autoTabConsignee(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
 	    //Get a reference to the two elements in the tab sequence.
 		var source='consignee';
 		var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
 	    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
 	   
 	    
 	    CurrentElement.keydown(function(e) {
 	        //Retrieve which key was pressed.
 	        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 	 
 	        //If the user has filled the textbox to the given length and the user just pressed 
 	        // a number or letter, then move the cursor to the next element in the tab sequence. 
 	        var phoneCountryCode="contactPhoneCountryCode";
 	        var cellCountryCode="contactCellCountryCode";
 	        var faxCountryCode="contactFaxCountryCode";
 	        
 	        if ((CurrentElementID == phoneCountryCode) || (CurrentElementID == cellCountryCode)	|| (CurrentElementID == faxCountryCode)) 
 	        {
 	        	if ((CurrentElement.val()=='1' || 
 	        	        CurrentElement.val()=='01' ||  CurrentElement.val()=='001' || 
 	        	        CurrentElement.val().length == 3)
 					&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(this))
 	        		{
 	        		
 	        			NextElement.select();
 	        		}
 	        	
 	        
 			}
 	        else {
 	        	
 				if (((CurrentElement.val().length == FieldLength && isAmericanCons(CountryCodeID)) || 
 						(CurrentElement.val().length == 4))
 								&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(this))
 					{	
 			
 							NextElement.select();
 					}
 						
 				 }
 	      
 	    });
 	}
	
	function isAmericanShip(id)
	{
		var source= 'shipper';
		var val = $('input[name="'+source+'\\.'+id+'"]').val();
		if(val=='' || val=='1' || val=='01' || val=='001')
			return true;
		else
			return false;
	}
	
	function isAmericanCons(id)
	{
		var source= 'consignee';
		var val = $('input[name="'+source+'\\.'+id+'"]').val();
		if(val=='' || val=='1' || val=='01' || val=='001')
			return true;
		else
			return false;
	}
	
	function isValidDate(date)
	{
			var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
			var validDate=false;
			

		    var len1=date.length;

		 //   alert('matches:'+matches);

			if (matches == null) 		
			{			
				if(len1<'8' && len1>'10')
				{
					return false;
				}
				if(len1=='0'){
					return date;
				}
				if(len1=='8')
				{	
					var dt1  = date.substring(2,4); 
				    var mon1 = date.substring(0,2); 
				    var mn=mon1-1;
				    var yr1  = date.substring(4,8);
					var composedDate = new Date(yr1, mn,dt1 );		
					validDate=composedDate.getDate() == dt1 &&
					
					composedDate.getMonth() == mn &&
					
					composedDate.getFullYear() == yr1;

					if(validDate)		
					{	var newDate=mon1+"-"+dt1+"-"+yr1;
						
						return newDate;		
					}				
					else		
					{
						return null;				
					}				
				}
		
			}
			else
			{
				var d = matches[2];
				var m = matches[1] - 1;
				var y = matches[3];
				
				var composedDate = new Date(y, m, d);			
				  
				validDate=composedDate.getDate() == d &&
				
				composedDate.getMonth() == m &&
				
				composedDate.getFullYear() == y;
				
				if(validDate)		
				{	
					var newDate=matches[1]+"-"+d+"-"+y;
					return newDate;		
				}
				
				else		
				{
					return null;
				
				}
			}



	}

	function trim(stringToTrim) {
		return stringToTrim.replace(/^\s+|\s+$/g,"");
	}


	function startsWith(expr, value) {
		return (value.substr(0, expr.length) == expr);
	}
	
	function mailtoKicker(id) {
		blockUI();
		if (console) console.log("mailtoKicker() shipment#:" + $('#shipmentId').val()+"&templateId="+id);
		var urlStr = _context +"/shipment/getMailto?shipmentId="+$('#shipmentId').val()+"&templateId="+id;
		$.ajax({
			type: "GET",
			url: urlStr,
			success: function(responseText){
				if(startsWith("mailto:",responseText)) {
					var key = "&body=";
					var start = responseText.indexOf(key) + key.length;
					var toEncode = responseText.substring(start);
					var noEncode = responseText.substring(0,start);
					var url = noEncode + encodeURIComponent(toEncode);
					if (console) console.log("mailTo url:" + url);
					$.unblockUI();
					window.location.href = url;
	 				//$('#sendKickerHref').attr("href",);
					//$('#sendKickerHref')[0].click();
				}  else {
					alert("Error getting template "+responseText);
					$.unblockUI();
				}
				
			},
			error: function(jqXHR,textStatus,errorThrown) {
				$.unblockUI();
				alert("Error getting template "+textStatus);
			}
		});
		
		
		
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
	
	// First line can only be width other lines can be second width.
	function wordwrapfirstline( str, width, secondwidth) {
		 
	    var brk =  '\n';
	    width = width || 75;
	    var  cut = true;
	 
	    if (!str) { return str; }
	 
	    var regex = '.{1,' +width+ '}(\\s|$)' + (cut ? '|.{' +width+ '}|.+$' : '|\\S+?(\\s|$)');
	 
	    var result = str.match( RegExp(regex, '') )[0];
	    
	    return result.trim() + brk + wordwrap2Columns(str.substring(result.length),secondwidth);
	 
	}
	
	
	function splitCommodity()
	{ 
		
		var i=0;j=0,k=0;
		var commDesc = $("#containerCommodityDesc").val();
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
		$("#containerCommodityDesc").val(finalcommDesc);
	}
	
	
	
	/*
	function applyAndSendKicker(templateId) {
		$("#kickerTemplatesDivDialog").dialog('close'); // close templates grid
		console.log ('mailtoKicker called. templateId:' + templateId);
		blockUI();
		var urlStr = _context +"/shipment/getMailto?shipmentId="+$('#shipmentId').val()+"&templateId="+templateId;
		$.ajax({
			type: "GET",
			url: urlStr,
			success: function(responseText){
				if(startsWith("mailto:",responseText)) {
					var key = "&body=";
					var start = responseText.indexOf(key) + key.length;
					var toEncode = responseText.substring(start);
					var noEncode = responseText.substring(0,start);
	 				$('#sendKickerHref').attr("href",noEncode + encodeURIComponent(toEncode));
					$('#sendKickerHref')[0].click();
				}  else {
					alert("Error getting template "+responseText);
				}
				$.unblockUI();
			},
			error: function(jqXHR,textStatus,errorThrown) {
				$.unblockUI();
				alert("Error getting template "+textStatus);
			}
		});
	}
	*/
	

	function setShipmentStopOffs() {
		createShipmentStopOffsGrid();
	}
	
	var hazardGridComplete = function() {
		console.log("hazardGridComplete");
		
		
		
	}
	
	var hazardLoadComplete = function() {
		console.log("hazardLoadComplete");
		
		var userData = $("#hazardGrid").getGridParam('userData');
		var hazardText = "?"
		var sum = "";
		
		if(userData && userData.hazardText) { 
			hazardText = userData.hazardText
			$("#hazardAddHref").text(hazardText);
		
		}
		
		if(userData) {
			sum = userData.sum;
		}
		
		//console.log("accordian="+userData.accordianText+" sum="+userData.sum);
		setAccordianTabDetails('shipmentHazardHeader', userData.accordianText);
		jQuery("#hazardGrid").footerData('set',{hazPiecesUomCode:'Total',hazWeight:sum});
		
		
	}
	
	var hazardEditorGridComplete = function() {
		console.log("hazardEditorGridComplete");
	}
	
	var hazardEditorLoadComplete = function() {
		console.log("hazardEditorLoadComplete");
		var grid = jQuery("#hazardDialogGrid"),
		ids = grid.jqGrid("getDataIDs");
		

		for (var i = 0; i < ids.length; i++) {
			 var hazardId =   jQuery("#hazardDialogGrid").getRowData( ids[i]).shipmentHazardId;
			 var unitId =   jQuery("#hazardDialogGrid").getRowData( ids[i]).unitId;
			 var seq = jQuery("#hazardDialogGrid").getRowData( ids[i]).seqNumber;
			 
			 if(hazardId) {
				 grid.jqGrid("setSelection", ids[i]);
			 }
			 var rowId = grid.getCell(ids[i], 'gridId');
			 
			 
			 if( !seq || 0 === seq.length) {
				 grid.jqGrid('editRow', rowId, false, HazardOnEdit);
			 } else { 
				 // disbale checkbox
				 $("#jqg_hazardDialogGrid_"+ids[i]).attr("disabled",true);
			 }
			 
			
		}
		
	}
	
	var HazardOnEdit=function(rowId) {
		
		
	}
	
	
	function setShipmentHazards() {
		createShipmentHazardGrid();
	}
	
	function sleep(milliseconds) {
		  var start = new Date().getTime();
		  for (var i = 0; i < 1e7; i++) {
		    if ((new Date().getTime() - start) > milliseconds){
		      break;
		    }
		  }
		}
	
	var isHazardChange = false;
	
	function openHazDialog() {
		var urlStr = _context +"/shipment/hazard/saveHazard";
		console.log('openHazDialog');
		createShipmentHazardDialogGrid();
		
		$("#hazardDialog").dialog("option", "title", 'Unassigned Hazards');
		$("#hazardDialog").dialog("option", "buttons",
				
			[{
				text : "Cancel",
				click : function() {
					if(isHazardChange)
					{
						var r = confirm("All unsaved changes will be discarded.Continue?");
						if(r){
							$("#hazardDialog").dialog("close");
						}else
							return;
					}
					else{
						$("#hazardDialog").dialog("close");
					}
				}
			},
			{
				text : "Ok",
				click : function() {
					blockUI();
					var data = [];
				    var grid = $('#hazardDialogGrid');
				    var selected = grid.jqGrid('getGridParam','selarrrow');
				    
				    for(i=0; i < selected.length;i++) {
				    	 
				    	 var item = {};
				    	 item['id'] =  selected[i];
				    	 item['unitId'] = $('#' + selected[i] + '_unitId').val(); 
				    	 data.push(item);
				    	
				    }
				    
				    
				    var jsonString = JSON.stringify(data);
				    //console.log("data="+jsonString);
				    
				    $.ajax({
						type: "POST",
						url: urlStr,
						data: jsonString,
						dataType:'json',
						beforeSend: function(xhr) {
		                    xhr.setRequestHeader("Accept", "application/json");
		                    xhr.setRequestHeader("Content-Type", "application/json");
		                },
						success: function(responseData){
							dirtyData = true;
							console.log('Sending alert ... Success');
							$.unblockUI();
							$("#hazardDialog").dialog("close");
							$("#hazardGrid").trigger('reloadGrid');
						},
						error: function(jqXHR,textStatus,errorThrown) {
							console.log('Sending alert ... Error');
							$.unblockUI();
							alert("Hazards could not be update");
							$("#hazardDialog").dialog("close");
						}
					});
					
				}
			} ]);
			
			$("#hazardDialog").dialog("open");
	}

	
	function validateInvoiceNumbers(){
		var validInvoice  = true;
		if($('#tradeCode').val()=='A'){
			if($.trim($("#fpInvoiceNbr").val()) != ""){
				$.ajax({
					type : "GET",
					url : _context +"/cas/autocomplete.do?method=searchInvoiceNoForParty&searchType=6652&term="+$('#fpInvoiceNbr').val(),						
					async : false,
					success : function(responseText) {			
						if(responseText!= null && responseText.length==1){
							if(responseText[0].invoiceArol != prepaidArol){
								if(!$('#maintainShipmentParties').is(':visible')) {
									expandPartiesDiv();
								}
								$('#fpInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', true);
								var position = $('#fpInvoiceNbr').position();
								window.scrollTo(position.left, position.top);
								validInvoice = false;
							}
						} 
					}
				});
			} 
			if ($.trim($("#fcInvoiceNbr").val()) != ""){
				$.ajax({
					type : "GET",
					url : _context +"/cas/autocomplete.do?method=searchInvoiceNoForParty&searchType=6652&term="+$('#fcInvoiceNbr').val(),						
					async : false,
					success : function(responseText) {			
						if(responseText!= null && responseText.length==1){
							if(responseText[0].invoiceArol != collectArol){
								if(!$('#maintainShipmentParties').is(':visible')) {
									expandPartiesDiv();
								}
								$('#fcInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', true);
								var position = $('#fcInvoiceNbr').position();
								window.scrollTo(position.left, position.top);
								validInvoice = false;
							}
						} 
					}
				});
			}
		}
		return validInvoice;
	}
	
	
	
	
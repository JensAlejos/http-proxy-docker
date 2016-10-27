var oldForm;
var billExists="N";
var tempEquip="";
$(document).ready(function() {
	$('#receivedContainerForm').validationEngine('attach');
	tempEquip=$(document).getUrlParam("equipmentId");
	if($('#shipmentNumber').val()!=null || $.trim($('#shipmentNumber').val()!='')){
		displayContainerDtls("false");
		//getContainerDetails();
	}
	
	/*$('#shipmentNumber').change(function(){	
		clearWebPageSection("maintainReceivedContainer");
		clearWebPageSection("maintainBookingClauses");
		clearWebPageSection("maintainBookingHoldId");
		clearWebPageSection("maintainReceivedContainer");
	});*/
	
	$('#prorateBillBtn').click(function() {
		
		var shipment_number = $("#shipmentNumber").val();
			
			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();
			
			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
				shipment_sequence_number="000";
			}
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				shipment_correction_number="000";
			}
			var url = "/cas/proRateWtCubeSearch.do?shipmentNumber="+shipment_number+"&shipmentSequenceNumber="+shipment_sequence_number+
				"&shipmentCorrectionNumber="+shipment_correction_number+"&containNo="+$("#equipmentId").val()+"&reset=true";
			window.location = _context + url;
				
		});
	
	$('#shipmentNumber').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: 'Booking Number',
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  'B'
	 	},
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			displayContainerDtls("true");
		}
	});
	
	//Display existing booking
	$('#shipmentNumber').bind('keydown', function(event){
		//keyCode for enter key is 13 and for tab out is 9
		if(event.keyCode == 13 || event.keyCode == 9) {
			//D022815
			displayContainerIfValidShipment();
		}
    });	
	//D022815
	$('#shipmentNumber').blur(function(){
		displayContainerIfValidShipment();
	});
	//D028596: 	Container Maintenance - No Warning message of unsaved changes when user selects from dropdown list 
	var currentEquipId = "";
	$('#equipmentId').focus(function() {
		currentEquipId = $(this).val();
	}).change(function(){
		var newEquipId = $(this).val();
		$(this).val(currentEquipId);
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/validateScreenModified",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if(responseText.success){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						$("#equipmentId option[value='" + newEquipId + "']").attr("selected", "selected");
						currentEquipId = newEquipId;
						getContainerDetails();
					}else{
						$("#equipmentId option[value='" + currentEquipId + "']").attr("selected", "selected");
					}
				}else{
					$("#equipmentId option[value='" + newEquipId + "']").attr("selected", "selected");
					currentEquipId = newEquipId;
					getContainerDetails();
				}
			}
		});
	});
	//create Hold grid
	createHoldGrid("container");
	//CreateSpecialServiceGrid
	createSpecialServiceGrid("container");
	
	setDivNames();
	$('#containerSave').click(function(){
		//keyCode for enter key is 13 and for tab out is 9
		saveContainerDtls();
    });
	
	$('#containerExit').click(function(){
	var newForm = $('#receivedContainerForm').formSerialize();
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/validateScreenModified",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if(responseText.success){
					// D024676 : Fix for unsaved pop up shown on exit
					if(newForm != oldForm){
						var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
						if (isConfirm) {
							exit();
						}
						else{
							return;
						}
					} else {
						exit();
					}
				}
				else{
					exit();
				}
			}
		});
	});
	
	$('#containerVariance').click(function(){
		var bookingNum=$('#shipmentNumber').val();
		var containerNumber = $('#equipmentId').val();
		if(bookingNum!='' && bookingNum.length==7){
			document.location.href = _context +'/containerVariance/showForm?bookingId='+bookingNum+'&containerNumbers='+containerNumber+'&source=B';
		}
		//D022815
		else{
			$('#msgDiv').html("<div class=\"message_warning\">Booking number must be 7 in length. No spaces are allowed.</div>");
			window.scrollTo(0, 0);
		}
	});
	
	
	
	$('#prevRcvdContainer').click(function(){
		//D026546
		$('#prevRcvdContainer').attr("disabled", true);
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/validateScreenModified",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if(responseText.success){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						prev();
					}else{
						$('#prevRcvdContainer').attr("disabled", false);
						return;
					}
				}else{
					prev();
				}
			}
		});
	});
	
	$('#nextRcvdContainer').click(function(){
		//D026546
		$('#nextRcvdContainer').attr("disabled", true);
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/validateScreenModified",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if(responseText.success){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						next();
					}else{
						$('#nextRcvdContainer').attr("disabled", false);
						return;
					}
				}else{
					next();
				}
			}
		});
	});
	
	function prev(){
		var selectedOption = $('#equipmentId option:selected').prev('option').attr('selected', 'selected');
  		if(selectedOption != undefined || $.trim(selectedOption) != '') {
	  		getContainerDetails();
  		}
		
	}
	
	function next(){
		var selectedOption = $('#equipmentId option:selected').next('option').attr('selected', 'selected');
  		if(selectedOption != undefined || $.trim(selectedOption) != '') {
	  		getContainerDetails();
  		}
		
	}
  	
  	//D026459: 	Add 'Billed on' bill seq number hyperlink in Container section for billed container 
	$('#billedOn').click(function(){
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/validateScreenModified",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if(responseText.success){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						navToMaintainBill();
					}else{
						return;
					}
				}else{
					navToMaintainBill();
				}
			}
		});
		
	});
	
	//D027248: 	Booking/ Container Maintenance-Container level reference numbers: cannot see booked values when the container is billed
	$('#bkRefLink').click(function(){
		$('#referenceNumberGrid').jqGrid('setGridParam', { url: _context+'/receivedContainer/loadBookingReferenceNo' ,datatype:"json"}).trigger("reloadGrid");
		$(this).attr("style","color: gray");
		$('#billRefLink').attr("style","color: blue");
	});
	
	$('#billRefLink').click(function(){
		$('#referenceNumberGrid').trigger("reloadGrid");
		$(this).attr("style","color: gray");
		$('#bkRefLink').attr("style","color: blue");
	});
	
	function navToMaintainBill(){
		var shipmentSequenceNumber = $('#billedOn').text();
		var shipment_number = $("#billShipmentNumber").text();
		var shipmentCorrectionNumber ="000";
		
		var url ="";
		url = "/shipment/showForm?shipment_number="+shipment_number+"&shipment_sequence_number="+shipmentSequenceNumber+
		"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ";
		window.location = _context + url;
	}
	
  	//Disabling Prev-Next buttons
  	$('#prevRcvdContainer').attr("disabled", true);
	$('#nextRcvdContainer').attr("disabled", true);
	$('#bill').attr("disabled", true);
	$('#hold').attr("disabled", true);
	
	makeReadOnly();
	
	$('#commentsDiv').hide();
	var args = {
			entityType: 'RCFT',
			entityId: $('#currentContainer.receivedFreightId').val(),
			commentId:'commentId' ,
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'ALL'
		   };
	getCommentTypes(args);
	
//	Security Implementation
	enforceCtrMaintenanceUserSecurityRolesAndPermissions();

	
	
	$('#bill').click(function(){
		var bookingNo = $.trim($('#shipmentNumber').val());
		if(bookingNo!='' && bookingNo.length==7){
			
			var savedChanges = true;
			$.ajax({
				type: "POST",
				url: "/gates/receivedContainer/validateScreenModified",
				data: $('#receivedContainerForm').formSerialize(),
				success: function(responseText){
					if(responseText.success){
						var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
						if (isConfirm) {
							
						}else{
							savedChanges = false;
						}
							}else{
								
								}
						}
			});
         if(savedChanges){
			var isAutoBill = $('#isAutoBill').val();
			if(isAutoBill == 'true'){
				$.ajax({
					type: "GET",
					url: _context +"/booking/createBatchBillForBookings",
					data: {
						bookingId: $("#bookingId").val(),
						receivedFreightIds: $("#receivedFreightId").val()+"|",
						callingModule: "BOOKING",
						callingPage: "CMAINT",
						processMode: "BK"
					},
					success: function(responseText){
						showResponseMessages("msgDiv", responseText);
						//D027662
						//var doesHoldsExist = responseText.data;
						//if(doesHoldsExist!="" && doesHoldsExist == "holdsExists"){
						//	alert("Booking holds exist.  Please resolve booking holds or initiate billing from maintain booking");
						//}
					}
				});
				/*$.ajax({
					type: "GET",
					url: _context +"/booking/batchbill/requestBill",
					data: {
						bookingIds: $("#bookingId").val(),
					},
					success: function(responseText){
						showResponseMessages("msgDiv", responseText);
					}
				});*/
			}else{
				$('#msgDiv').html("<div class=\"message_warning\">This is not an AutoBill Container.</div>");
				window.scrollTo(0, 0);
			}
		
		
		

//		blockUI();
//		$.ajax({
//			type: "GET",
//			url: _context +"/receivedContainer/checkbill",
//			data: {
//				bookingId: $("#bookingId").val(),
//				shipmentNumber: $("#shipmentNumber").val()
//			},
//			success: function(responseText){
//				$.unblockUI();
//				if (responseText.messages.error.length == 0) {
//					
//					if(responseText.data.rateView == "showError"){
//						$("#receivedContainerForm").loadJSON(responseText.data);
//						$('#shipmentNumOverLay').val(responseText.data.ratingError.shipmentNumber);
//						$('#statusCodeOverlay').val(responseText.data.ratingError.statusCode);
//						
//						$('#unitOfMeasureSourceOverLay').val(responseText.data.ratingError.unitOfMeasureSourceCode);
//						$('#loadServicesOverLay').val(responseText.data.ratingError.loadServiceCodeRE);
//						$('#routingDetOverLay').val(responseText.data.ratingError.routingDetailsRE);
//						$('#dischargeServicesOverlay').val(responseText.data.ratingError.dischargeServiceCodeRE);
//						
//						$('#re_error_dialog').dialog( "open" );
//						$("#reErrorGrid").trigger('reloadGrid');
//					}else if(responseText.data.rateView == "showChoices"){
//						$("#receivedContainerForm").loadJSON(responseText.data);
//						$('#shipmentNumOverLayChoice').val(responseText.data.ratingChoice.shipmentNumber);
//						$('#statusCodeOverlayChoice').val(responseText.data.ratingChoice.statusCode);
//						
//						$('#unitOfMeasureSourceOverLayChoice').val(responseText.data.ratingChoice.unitOfMeasureSourceCode);
//						$('#loadServicesOverLayChoice').val(responseText.data.ratingChoice.loadServiceCodeRE);
//						$('#routingDetOverLayChoice').val(responseText.data.ratingChoice.routingDetailsRE);
//						$('#dischargeServicesOverlayChoice').val(responseText.data.ratingChoice.dischargeServiceCodeRE);
//						$('#re_choice_dialog').dialog( "open" );
//						$("#reChoiceGrid").trigger('reloadGrid');
//					}
//					else if (responseText.data.rateView == "hold"){
//						openHoldsUnreleasedDialog('booking');
////						$("#holdsUnreleased").attr("style","visibilty:visible");
////						$('#holdUnreleasedGrid').trigger('reloadGrid');
//					}
//					if(responseText.data.rateView == "exception"){
//						alert(responseText.data.billManagerException);
//						return;
//					}
//			}
//		}
//		});
	}
	}
		//D022815
		else{
			$('#msgDiv').html("<div class=\"message_error\">Please enter a valid booking number.</div>");
			window.scrollTo(0, 0);
		}
	});

	var choiceGridColNames= ['Choice Id', 'Choice Seq No', 'Selectable', 'Choices Text'];
	var choiceGridColModel= [ 
	                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true, formatter:'number'},
	          				{name:'choiceSeqNum',index:'choiceSeqNum', width:100, editable:false, formatter:'choiceFormatter'},
	                        {name:'selectable',index:'selectable', width:50, editable:false},
	        				{name:'messageTextValue',index:'messageTextValue', width:700, editable:false}			        				
	                       ];
	var jsonReaderChoice = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "reRatingChoiceId"
	};

	createGrid("reChoiceGrid", "pagerReChoiceGrid",
			'/gates/receivedContainer/loadReChoiceGrid',
			'', '', '', '',
			choiceGridColNames, choiceGridColModel,
			"List Of Choice Messages", 70, 5, [ 5, 10, 15 ], true, false, false, true,
			jsonReaderChoice,true,true,true,false,false,false,false,false,false,false,true);


	var errorGridColNames= ['Error Id', 'Cmdy Line', 'Sev', 'Error Text','YP','Source Tariff','Group Name','Item','Rate'];
	var errorGridColModel= [ 
	                        {name:'reErrorMessageId',index:'reErrorMessageId', hidden:true, formatter:'number'},
	          				{name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:false },
	        				{name:'messageSeverity',index:'messageSeverity', width:50, sorttype:'date', editable:false },
	        				{name:'messageTextValue',index:'messageTextValue', width:260, editable:false },
	        				{name:'typeValue',index:'typeValue', width:50, editable:false },
	        				{name:'courceTariffId',index:'sourceTariffId', width:127, editable:false },
	        				{name:'groupName',index:'groupName', width:127, editable:false },
	        				{name:'item',index:'item', width:80, editable:false },
	        				{name:'rate',index:'rate', width:80, editable:false },
	                         ];

	var jsonReaderError = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "reErrorMessageId"
	};

	createGrid("reErrorGrid", "pagerReErrorGrid",
			'/gates/receivedContainer/loadReErrorGrid',
			'', '', '', '',
			errorGridColNames, errorGridColModel,
			"List Of Error/Warning Messages", 70, 5, [ 5, 10, 15 ], false, false, false, true,
			jsonReaderError,true,true,true,false,false,false,false,false,false,false,true);


	$( "#re_choice_dialog" ).dialog({
		autoOpen: false, 
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		},
	});



	$( "#re_error_dialog" ).dialog({
		autoOpen: false, 
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		},
	});


	$('#reErrCloseBtn').click(function(){
		$("#re_error_dialog").dialog('close');
	});

	$('#reErrContinueBtn').click(function(){
		$("#re_error_dialog").dialog('close');
	});

	$('#reChoiceCloseBtn').click(function(){
		$("#re_choice_dialog").dialog('close');
	});

	$('#reChoiceContinueBtn').click(function() {
		//TODO: Handle this scenario here. Call to RE should pursue from here.		
		
		var length = jQuery("#reChoiceGrid").jqGrid('getGridParam','selarrrow').length;
		if( length > 1){
			alert(" Please Select only one Rating Choice");
			return false;
		}else{
			$('#re_choice_dialog').dialog( "close" );
			var containerArr = jQuery("#reChoiceGrid").jqGrid('getGridParam','selarrrow');
			var idArray = "";
			 for(var i=0; i<length;i++){
					concludeRating(containerArr[i]);
			 }

		}
				
	});
	

	$('#containerSpecialServicesAdd').click(function (){
		var shipmentStatus=$('#shipmentStatus').val();
		if( shipmentStatus==undefined || shipmentStatus==null || shipmentStatus=='' || (shipmentStatus !='ISSD' && shipmentStatus!='CORR')) {
			openSpecialServices();
		}else{
			alert("Special Services cannot be added as Container has been ISSD or CORR.");
		}
	});
	
	$('#shipmentNumber').focus();
	$('#msgDivBill').hide();
	// create bill booking dialog at body on-load
	$("#billBookingDialog").dialog({
		//dialogClass:'transparent',
		autoOpen : false,
		width : 1000,
		height : 650,
		modal : true,
		close : function() {
			/*$('#msgDivBill').html("<div class=\"message_info\">Successfully Displayed.</div>");*/
		}
	});
	/*$('#billingStartedHyperlink').click(function(){
		$('#receivedFreightGridDiv').hide();
		$('#receivedUnitsGridDiv').hide();
		loadBillStartedGrids();
		invokeBillingStartedOverlayScreen();
	});*/
	tabSequence('#receivedContainerForm',false,false);
	oldForm = $('#receivedContainerForm').formSerialize();
	captureUIChangesWithGrid();
});

function saveContainerDtls(){
	if ($("#receivedContainerForm").validationEngine('validate')) {
		$('#msgDiv').html("<div class=\"message_info\">Saving ...</div>");
		blockUI();
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/saveContainerDetails",
			data: $('#receivedContainerForm').formSerialize(),
			success: function(responseText){
				if (responseText.messages.error.length == 0) {
					//Grid reload calls
					$('#oldSealNumber').val(responseText.data.currentContainer.oldSealNumber);
					reloadContainerGrids();
				}
				//D026476
				if(responseText.data.updateCharges){
					//D027730 - Show success message after clear charges call is success
					$('#msgDiv').html("<div class=\"message_info\">Clearing Charges ...</div>");
					$.ajax({
						type: "POST",
						url: "/gates/receivedContainer/updateContainerCharges",
						data: $('#receivedContainerForm').formSerialize(),
						success: function(newResponseText){
							$.unblockUI();
							showResponseMessages("msgDiv", responseText);
							$("#entityVersion").val(newResponseText.data.currentContainer.entityVersion);
							oldForm = $('#receivedContainerForm').formSerialize();
						}
					});
				} else {
					$.unblockUI();
					//Messages
					showResponseMessages("msgDiv", responseText);
					//Updating entityVersion of the current container after save
					$("#entityVersion").val(responseText.data.currentContainer.entityVersion);
					oldForm = $('#receivedContainerForm').formSerialize();
				}
				
			}
		});
	}
	captureUIChangesWithGrid();
}
//D022815
function displayContainerIfValidShipment(){
	var bookingNo = $.trim($('#shipmentNumber').val());
	if(bookingNo!=''){
		if(bookingNo.length>=7){
			displayContainerDtls("true");
			//D022815
			$('#bill').attr("disabled", false);
			$('#containerVariance').attr("disabled", false);
		}
		else{
			//D022815
			$('#bill').attr("disabled", true);
			$('#containerVariance').attr("disabled", true);
			$('#msgDiv').html("<div class=\"message_warning\">Booking number must be 7 in length. No spaces are allowed.</div>");
		}
	}
	else{
		//D022815
		$('#bill').attr("disabled", true);
		$('#containerVariance').attr("disabled", true);
		$('#msgDiv').html("<div class=\"message_warning\">Booking number must be present.</div>");
	}
}

function displayContainerDtls(fromMenu){
	
	if ($.trim($("#shipmentNumber").val())!='') {
		$("#shipmentNumber").attr("disabled", true);
		/*$("#fetchBookingInfo").attr("disabled", true);*/
		$("#containerExit").attr("disabled", true);
		$("#containerSave").attr("disabled", true);
		$('#bill').attr("disabled", true);
		$('#msgDiv').html("<div class=\"message_info\">Loading booking "+ $("#shipmentNumber").val() +" ...</div>");
		$('#msgDiv').show();
		
		$.ajax({
			type: "POST",
			url: "/gates/receivedContainer/display",
			data: {bookingNumber: $("#shipmentNumber").val(),fromMenu:fromMenu},
			success: function(responseText){
				clearContainerForm();
				if (responseText.messages.error.length == 0) {
					$('#billingStartedHyperlink').hide();
					//$( '#conditionAccordians' ).accordion( "option", "active", 2 );
					$('#maintainReceivedContainer').attr('style','display:block');
					showJSONConatiner(responseText);
					//Grid reload calls
					reloadContainerGrids();
					
					setDivNames();
					//Next/Prev buttons
					enableDisableButtons();
					$("#shipmentNumber").attr("disabled", false);
					/*$("#fetchBookingInfo").attr("disabled", false);*/
					$("#containerExit").attr("disabled", false);
					$('#containerSave').attr("disabled", false);
					$('div#currentContainer input').attr('readonly', false);
			  		$('div#currentContainer select').attr('disabled', false);
			  		
			  		if(responseText.data.currentContainer.shipmentSequenceNumber != null){
  						$("#billedOn").text(responseText.data.currentContainer.shipmentSequenceNumber);
  						//D027248: 	Booking/ Container Maintenance-Container level reference numbers: cannot see booked values when the container is billed
  						$('#billRefLink').attr("style","color: gray");
						$('#bkRefLink').attr("style","color: blue");
						$('#refNumberLinks').show();
						$('#refNumberBkText').hide();
  					} else {
  						$("#billedOn").text("");
  						$('#refNumberLinks').hide();
  						$('#refNumberBkText').show();
  					}
			  		
			  		$('#commentId').val(responseText.data.currentContainer.commentId);
  					$('#receivedFreightId').val(responseText.data.currentContainer.receivedFreightId);
  					if(responseText.data.header.billExists=="Y"){
  						//change
  						billExists="Y";
  					}
  					else
  						{ billExists="N";
  						}
  					enforceSecurityOnContainer();
  					createCommentFunc();
  					
  					if(responseText.data.header.billExists=="Y"){
  						
  						prepareHeaderDataForBillingOverlay(responseText);
  						$('#billingStartedHyperlink').show();
  						$('#prorateBillBtn').attr("disabled",false);
  					}
					/*var args = {
							entityType: 'RCFT',
							entityId: $('#receivedFreightId').val(),
							commentId: 'commentId',
							displayCommentTypes: ''
						   };
					getCommentTypes(args);*/
				}
				else{
					$("#success").val("false");
					$("#shipmentNumber").attr("disabled", false);
					//clearContainerForm();
					reloadContainerGrids();
					makeReadOnly();
					$("#containerExit").attr("disabled", false);
					
				}
				if($("#containerStatus").val() != 'Pre-Received'){
					$("#containerVariance").removeAttr("disabled");
				}else{
						$("#containerVariance").attr("disabled", true);
					}
				setContainerDefaults();
				loadContainerReferenceNoGrid();
				loadSpecialServiceGrid();
				enforceSecurityOnContainer();
				if($('#stsDiv').text() == 'APPR'){
					$('#bill').attr("disabled",false);
				}else{
					$('#bill').attr("disabled",true);
				}
					
				
				
				
				var shipmentStatus = responseText.data.currentContainer.shipmentStatus;
				
				if(shipmentStatus != null && shipmentStatus != ''){
  					$('#sealNumber').attr("readonly", true);
  					$('#sealNumber').css("background-color","lightgray");
  					//$('#temperature').attr("readonly", true);
  					//$('#temperature').css("background-color","lightgray");
  					//$('#temperatureUnitOfMeasureCd').attr('disabled',true);
  					//$('#temperature').attr('disabled',true);
  					if(shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'){
  						responseText.messages.warn.push("Container has been ISSD or CORR,Freight Correction is required.");
  						//$('#msgDiv').html("<div class=\"message_warning\">Container has been ISSD or CORR,Freight Correction is required.</div>");
						window.scrollTo(0, 0);
						$('#containerSave').attr("disabled", true);
  					}else{
  						$('#containerSave').attr("disabled", false);
  					}
  					
  				}else{
  					if($('#equipemntLogId').val() =='' && $("#containerStatus").val() != 'Pre-Received' && $("#containerStatus").val() != 'Received') {
  						//$('#sealNumber').attr("disabled", true);
  						$('#sealNumber').attr("readonly", true);
  	  					$('#sealNumber').css("background-color","lightgray");
  	  					//Changed for D025229
  	  					responseText.messages.warn.push('No Linked Containers found for the booking or an error has occured');
  	  					//$('#msgDiv').html("<div class=\"message_warning\">No Linked Containers found for the booking</div>");
  						//$('#msgDiv').html("<div class=\"message_warning\">Seal number is unavailable: GEMS equipment log entry is not found.</div>");
						//$('#msgDiv').show();
  					}else{
  						//$('#sealNumber').attr("disabled", false);
  						$('#sealNumber').attr("readonly", false);
  	  					$('#sealNumber').css("background-color","");
  					}
  				//	$('#temperature').attr("readonly", false);
  				//	$('#temperature').css("background-color","");
  					
  				//	$('#temperatureUnitOfMeasureCd').attr('disabled',false);
  					//$('#temperature').attr('disabled',false);
  					$('#containerSave').attr("disabled", false);
  				}
  				//Fix for - D024642
				if($('#unitOfMeasureSourceCode').val() === "M"){
					if($("#weight").val() != null && $.trim($("#weight").val()) != ''){
						 $("#weight").val(parseFloat($.trim($("#weight").val())).toFixed(3));
					}
					if($("#cube").val() != null && $.trim($("#cube").val()) != ''){
						$("#cube").val(parseFloat($.trim($("#cube").val())).toFixed(3));
					}
				} 
				
				// D025229, append rather than replace errors.
				
				showResponseMessages("msgDiv", responseText);
				$('#msgDiv').show();
				
  				//Display Unreleased Holds Grid on initial display
				openUnreleasedHoldGridOnIntialDisplay("container");
				oldForm = $('#receivedContainerForm').formSerialize();
				captureUIChangesWithGrid();
			}
		});
	}
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

		//alert("msg length: "+messages.success.length);
		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				//alert("msg" + i + " : " + array[i]);
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}
		//alert("msgDivId : " + msgDivId);
		$('#'+msgDivId).html(messageContent);
		if(messageContent!='')
		{
			window.scrollTo(0, 0);
		}
  	}
}
  //common method for reloading all grids for booking
  	function reloadContainerGrids(){
  		$("#gridIdForClauses").trigger('reloadGrid');
  		$("#holdGrid").trigger('reloadGrid');
  	}
  	
  	function showJSONConatiner(responseText)  {
  		//Header
  		$("#header").loadJSON(responseText.data.header);
  		$("#isAutoBill").val(responseText.data.header.isAutoBill);
  		$("#commentId").val(responseText.data.commentId);
  		// Booking Id
  		$("#bookingId").val(responseText.data.header.bookingId);
  		$('#stsDiv').text(responseText.data.header.bookingStatus);
  		$('#shipperDiv').text(responseText.data.header.shipperOrg);
  		$('#porDiv').text(responseText.data.header.placeOfReceipt);
  		$('#consigneeDiv').text(responseText.data.header.consigneeOrg);
  		$('#consigneeAddrDiv').text(responseText.data.header.consigneeAddress);
  		$('#polDiv').text(responseText.data.header.portOfLoading);
  		$('#tradeDiv').text(responseText.data.header.tradeCode);
  		$('#podDiv').text(responseText.data.header.portOfDischarge);
  		$('#poDeDiv').text(responseText.data.header.placeOfDelivery);
  		$('#VVDDiv').text(responseText.data.header.vesselVoyageDirection);
  		$('#ldsDiv').text(responseText.data.header.loadDischargeCode);
  		$('#custDiv').text(responseText.data.header.customerGroup);
  		$('#measSourceCodeDiv').text(responseText.data.header.measureSourceCode);
  		$("#maintainReceivedContainer").loadJSON(responseText.data.currentContainer);
  		/*
  		if(responseText.data.currentContainer.temperature!=null && responseText.data.currentContainer.temperature!=''){
  			$("#temperatureHidden").val(responseText.data.currentContainer.temperature);
  		}
  		else{
  			$("#temperatureHidden").val("");
  		}
  		*/
  		$('#equipmentId').children().remove();
  			
  		var count=0;
	    $.each(responseText.data.containers,function(){
		   $('#equipmentId').append($('<option>', { value : responseText.data.containers[count].equipmentId}).text(responseText.data.containers[count].containerNum));
		  // $("#equipmentId option[value='" + $('#equipmentId').val() + "']").attr("selected", true);
		   if(responseText.data.containers[count].containerNum == responseText.data.currentContainer.containerNum){
			   $("#equipmentId option[value='" + responseText.data.containers[count].equipmentId + "']").attr("selected", true);
		   }
		   count++;
	    });
	    
	    if(tempEquip!=null){
	    	$('#equipmentId').val(tempEquip);
	    }	
  			
		//Setting hidden variables- tradeCode and loadDschServiceGroupCode
		$("#tradeCode").val(responseText.data.header.tradeCode);
		$("#loadDschServiceGroupCode").val(responseText.data.header.loadDschServiceGroupCode);
		
		//Setting container count
		var indexCount =$("#equipmentId").get(0).selectedIndex +1;
		
		$("#indexCount").html(indexCount);
		$("#containerCount").html(responseText.data.containers.length);
		$("#planEquipTypeCode").text(responseText.data.currentContainer.planEquipTypeCode);
  	}
  	
  	function setAccordianTabDetails(id, displayText){
  		$("#"+id).text(displayText);
  	}
  	
  	function setDivNames(){
  		setClauseDiv();
  		setBookingHold();
  	}

  	function setClauseDiv() {
  		var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
  		var headerStr = "";
  	    for (var i=0;i<rowIDs.length;i=i+1) {
  	      var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
  	      
  	      if(rowData.standardClauseCode!=null && rowData.standardClauseCode!='') {
  	    	  if(headerStr=='')
  	    		  headerStr = rowData.standardClauseCode;
  	    	  else
  	    		  headerStr = headerStr + ", "+rowData.standardClauseCode;
  	      }
  	   }
  	    if(headerStr!="")
  	 	   headerStr = "Clauses - " + headerStr;
  	    else
  	 	   headerStr = "Clauses";
  	    setAccordianTabDetails('clauseHeader', headerStr);
  	}

  	function setBookingHold() {
  		var holdCount = $("#holdGrid").getGridParam("reccount");
  		if(holdCount==0){
  			setAccordianTabDetails('maintainBookingHoldId', "Hold");
  		}
  		else if(holdCount>0){
  			var holdDisplayText = "Hold - "+jQuery("#holdGrid").getRowData(1).holdCode;
  			setAccordianTabDetails('maintainBookingHoldId', holdDisplayText);
  		}
  	}
  	
  	function getContainerDetails() {   
  		// D030184
  		$('#maintainReceivedContainer').gatesEnable();
  		$.ajax({
  			type: "POST",
  			url: "/gates/receivedContainer/getContainerDtls",
  			data: $('#receivedContainerForm').formSerialize(),
  			success: function(responseText){
  				clearWebPageSection('currentContainer');
  				if (responseText.messages.error.length == 0) {
  					/*$('#billingStartedHyperlink').hide();*/
  					$("#maintainReceivedContainer").loadJSON(responseText.data);
  					var indexCount =$("#equipmentId").get(0).selectedIndex +1;
  					$("#indexCount").html(indexCount);
  					$('#maintainReceivedContainer').attr('style','display:block');
  					/*
  					if(responseText.data.temperature!=null && responseText.data.temperature!=''){
  			  			$("#temperatureHidden").val(responseText.data.temperature);
  			  		}
  			  		else{
  			  			$("#temperatureHidden").val("");
  			  		} */
  					$("#equipmentId option[value='" + responseText.data.equipmentId + "']").attr("selected", true);
  					
  					
  					
  					setContainerDefaults();
  					loadContainerReferenceNoGrid();
  					loadSpecialServiceGrid();
  				    // D030184
  					enforceCtrMaintenanceUserSecurityRolesAndPermissions();
   				    //Next/Prev buttons
  					enableDisableButtons();
  					if(responseText.data.shipmentSequenceNumber != null){
  						$("#billedOn").text(responseText.data.shipmentSequenceNumber);
						//D027248: 	Booking/ Container Maintenance-Container level reference numbers: cannot see booked values when the container is billed
						$('#billRefLink').attr("style","color: gray");
						$('#bkRefLink').attr("style","color: blue");
						$('#refNumberLinks').show();
						$('#refNumberBkText').hide();
  					} else {
  						$("#billedOn").text("");
  						$('#refNumberLinks').hide();
  						$('#refNumberBkText').show();
  					}
  					
  					if($("#containerStatus").val() != 'Pre-Received'){
  						$("#containerVariance").removeAttr("disabled");
  					}else{
  						$("#containerVariance").attr("disabled", true);
  					}
  					$('#commentId').val(responseText.data.commentId);
  					$('#receivedFreightId').val(responseText.data.receivedFreightId);
  					/*if(responseText.data.header.billExists=="Y"){
  						prepareHeaderDataForBillingOverlay(responseText);
  						$('#billingStartedHyperlink').show();
  					}*/
					/*var args = {
							entityType: 'RCFT',
							entityId: $('#receivedFreightId').val(),
							commentId: 'commentId',
							displayCommentTypes: ''
						   };
					getCommentTypes(args);*/
  					createCommentFunc();
				}
  				//Messages
  				showResponseMessages("msgDiv", responseText);
  				var shipmentStatus = responseText.data.shipmentStatus;
  				if(shipmentStatus != null && shipmentStatus != ''){
  					$('#sealNumber').attr("readonly", true);
  					$('#sealNumber').css("background-color","lightgray");
  					
  					//$('#temperature').attr("readonly", true);
  					//$('#temperature').css("background-color","lightgray");
  					//$('#temperatureUnitOfMeasureCd').attr('disabled',true);
  					//$('#temperature').attr('disabled',true);
  					if(shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'){
  						$('#msgDiv').html("<div class=\"message_warning\">Container has been ISSD or CORR,Freight Correction is required.</div>");
						window.scrollTo(0, 0);
						$('#containerSave').attr("disabled", true);
  					}else{
  						$('#containerSave').attr("disabled", false);
  					}
  				}else{
  					if($('#equipemntLogId').val() =='' && $("#containerStatus").val() != 'Pre-Received' && $("#containerStatus").val() != 'Received') {
  						//$('#sealNumber').attr("disabled", true);
  						$('#sealNumber').attr("readonly", true);
  	  					$('#sealNumber').css("background-color","lightgray");
  						$('#msgDiv').html("<div class=\"message_warning\">Seal number can't be provided as equipment log for container not exist in Gems.</div>");
						$('#msgDiv').show();
  					}else{
  						//$('#sealNumber').attr("disabled", false);
  						$('#sealNumber').attr("readonly", false);
  	  					$('#sealNumber').css("background-color","");
  					}
  					//$('#temperature').attr("readonly", false);
  				//	$('#temperature').css("background-color","");
  					
  					//$('#temperatureUnitOfMeasureCd').attr('disabled',false);
  					//$('#temperature').attr('disabled',false);
  					$('#containerSave').attr("disabled", false);
  				}
  				//Fix for - D024642
  				if($('#unitOfMeasureSourceCode').val() === "M"){
					if($("#weight").val() != null && $.trim($("#weight").val()) != ''){
						 $("#weight").val(parseFloat($.trim($("#weight").val())).toFixed(3));
					}
					if($("#cube").val() != null && $.trim($("#cube").val()) != ''){
						$("#cube").val(parseFloat($.trim($("#cube").val())).toFixed(3));
					}
				}
  				captureUIChangesWithGrid();
			}
  		});
  		captureUIChangesWithGrid();
  	}
  	
  	function enableDisableButtons() {
  		var selectedIndex = $('option:selected', '#equipmentId').index() + 1;
  		var totalOptions = $("#equipmentId option").length;
  		
  		if (totalOptions == 1 && selectedIndex == totalOptions) {
  		    $('#prevRcvdContainer').attr("disabled", true);
  		    $('#nextRcvdContainer').attr("disabled", true);
  		} else if(totalOptions > 1) {
  			if(selectedIndex == 1) {
  				$('#prevRcvdContainer').attr("disabled", true);
  	  		    $('#nextRcvdContainer').attr("disabled", false);
  			} else if(selectedIndex == totalOptions) {
  				$('#prevRcvdContainer').attr("disabled", false);
  	  		    $('#nextRcvdContainer').attr("disabled", true);
  			} else {
  				$('#prevRcvdContainer').attr("disabled", false);
  	  		    $('#nextRcvdContainer').attr("disabled", false);
  			}
  		} 
  	}
  	
  	function clearContainerForm(){
  		resetHeader();
  		$('#receivedFreightId').val("");
  		var webPageSectionIds = ['currentContainer'];
  		for (var i=0; i<webPageSectionIds.length; i++) {
  			clearWebPageSection(webPageSectionIds[i]);
  		}
  		
  		$('#equipmentId').children().remove();
  		$("#containerCount").html("0");
  		$("#indexCount").html("0");
  		$("#planEquipTypeCode").text("");
  		$('#prevRcvdContainer').attr("disabled", true);
  		$('#nextRcvdContainer').attr("disabled", true);
  	}
  	
  	function clearWebPageSection(webPageSectionId){
  		var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week|hidden)$/i;
  		$("#"+webPageSectionId+" :input").each(function() {
  			var t = this.type, tag = this.tagName.toLowerCase();
  			if (re.test(t) || tag == 'textarea') {
  				this.value = '';
  			}
  			else if (t == 'checkbox' || t == 'radio') {
  				this.checked = false;
  			}
  			else if (tag == 'select') {
  				this.selectedIndex = 0;
  			}
  		});
  	}
  	
  	function resetHeader(){
  		$("#bookingId").val("");
  		$("#unitOfMeasureSourceCode").val("");
  		$("#metricWeightLimit").val("");
  		$("#imperialWeightLimit").val("");
  		$("#shipperDiv").html("");
  		$("#porDiv").html("");
  		$("#porDiv").html("");
  		$("#stsDiv").html("");
  		$("#consigneeDiv").html("");
  		$('#consigneeAddrDiv').html("");
  		$("#polDiv").html("");
  		$("#tradeDiv").html("");
  		$("#VVDDiv").html("");
  		$("#podDiv").html("");
  		$("#custDiv").html("");
  		$("#measSourceCodeDiv").html("");
  		$("#ldsDiv").html("");
  		$("#poDeDiv").html("");
  		$('#billingStartedHyperlink').hide();
  		$('#prorateBillBtn').attr("disabled",true);
  		$("#isAutoBill").val("");

  		$("#billShipmentNumber").text("");
  		$("#billShipper").text("");
  		$("#billConsignee").text("");
  		$("#billPlaceOfReceipt").text("");
  		$("#billPlaceOfDelivery").text("");
  		$("#billPortOfLoading").text("");
  		$("#billPortOfDischarge").text("");
  		$("#billLDSP").text("");
  		/*$("#billBooked").text("");
  		$("#billReceived").text("");
  		$("#billPreReceived").text("");
  		$("#billBilled").text("");*/
  	}
  	
  	function prepareHeaderDataForBillingOverlay(responseText){
  		$("#billShipmentNumber").text(responseText.data.header.shipmentNumber);
  		$("#billShipper").text(responseText.data.header.shipperOrg);
  		$("#billConsignee").text(responseText.data.header.consigneeOrg);
  		$("#billPlaceOfReceipt").text(responseText.data.header.placeOfReceipt);
  		$("#billPlaceOfDelivery").text(responseText.data.header.placeOfDelivery);
  		$("#billPortOfLoading").text(responseText.data.header.portOfLoading);
  		$("#billPortOfDischarge").text(responseText.data.header.portOfDischarge);
  		$("#billLDSP").text(responseText.data.header.loadDischargeCode);
  		$("#billBooked").text(responseText.data.header.booked);
  		$("#billReceived").text(responseText.data.header.received);
  		$("#billPreReceived").text(responseText.data.header.preReceived);
  		$("#billBilled").text(responseText.data.header.billed);
  	}
  	
  	function invokeBillingStartedOverlayScreen(){
  		$("#billOverlayContent").show();
  		$("#billBookingDialog" ).dialog( "option", "title", 'Billing Started' );
  		$("#billBookingDialog").dialog('open');
  	}
 
  	
  	function makeReadOnly(){
  		$('div#currentContainer input').attr('readonly', true);
  		$('div#currentContainer select').attr('disabled', true);
  		$('div#currentContainer input').removeClass("validate[required]");
  		$('div#currentContainer select').removeClass("validate[required]");
  		$('#containerSave').attr("disabled", true);
  	}
  	
  	function exit(){
  		
  		 var s="loadShipmentDetail";
		 var t="proRateWtCubeSearch.do?shipmentNumber";
		 var prevPage = document.referrer; //$("#prevPage").val();
		 prevPage = prevPage.split("/");
		 prevPage = prevPage[prevPage.length - 2] + "." + prevPage[prevPage.length - 1];
     
		 $.ajax({
			url: _context+"/receivedContainer/exit",
			success: function(responseText){
				if(responseText.success){
					var bookingNo=$('#shipmentNumber').val();
					if(bookingNo=="undefined"){
						bookingNo="";
					}
					     if(prevPage == "shipment.showForm"){
			 				 document.location.href = _context+"/shipment/showForm";
			 				 
			 			 }else{
					
					document.location.href = _context+ '/cas/containerListbyBookingSearch.do?bookingId='+bookingNo;
					}
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
  					$('#commentsDiv').show();
  				}
  			}
  		});
  		
  	}
  	
  	

  	function expandAll(){
  		 $('.ui-accordion-content').attr('style','display:block');
  		 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').removeClass('ui-state-default').
  		 removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top');
  		 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
  		 .addClass('ui-icon-triangle-1-s');
  		 window.scrollTo(0, 0);
  	}

  	function collapseAll(){
  		 $('.ui-accordion-content').attr('style','display:none');
  		 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top').removeClass('ui-state-active').
  		 removeClass('ui-corner-top').addClass('ui-state-default').addClass('ui-corner-all');
  		 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all span').removeClass('ui-icon-triangle-1-s')
  		 .addClass('ui-icon-triangle-1-e');
  		 //$('#conditionAccordians').accordion('activate', false);
  		 //window.scrollTo(0, 0);
  	}

  	function enforceCtrMaintenanceUserSecurityRolesAndPermissions() {
  		enforceSecurityOnClauses();
  		enforceSecurityOnHold();
  		enforceSecurityOnContainer();
  		enforceSecurityOnSave();
  		enforceSecurityOnHoldRelease();
  		//Added Below 3 function for Bill,ProrateBill and Container Variance buttons for defect D27285
  		enforceSecurityOnBill();
  		enforceSecurityOnProrateBill();
  		enforceSecurityContainerVariance();
  	}
  	
  	function enforceSecurityOnClauses() {
  		if(isCtrClauseDisplay == false && isCtrClauseModifiable == false) {
  			hideSection('Clauses');
  		}
  		if(isCtrClauseModifiable == false) {
  			$('#clausesAdd').unbind('click');
  			$('#gridIdForClauses tbody tr td div.ui-inline-edit').hide();
  			$('#gridIdForClauses tbody tr td div.ui-inline-del').hide();
  		}
  	}
  	function enforceSecurityOnBill(){
  		if(!isBillDisplay)
  			{
  			  $('#bill').css('visibility','hidden');  
  			}
  	} 
  	function enforceSecurityOnProrateBill()
  	{
  		if(!isProrateDisplay)
  			{
  			   $('#prorateBillBtn').css('visibility','hidden');
  			 } 
  		
  	}
  	function enforceSecurityContainerVariance()
  	{	
  		if(!isContainerVarianceDisplay)
  			{
  			  $('#containerVariance').css('visibility','hidden');
  			} 
  		
  	}
	function enforceSecurityOnContainer() {
		if(isCtrMaintenanceModifiable == false) {
			$('#maintainReceivedContainer').gatesDisable();
			$('#equipmentId').removeAttr('disabled');
			$('#prevRcvdContainer').removeAttr('disabled');
			$('#nextRcvdContainer').removeAttr('disabled');
			$('select[name^="currentContainer"]').attr('disabled', true);
			$('#addressLookUpImage').unbind('click');
		}
		enforceSecurityOnReferenceNumbers();
	}
	
	function enforceSecurityOnSpecialServices() {
		if(isSpecialServiceDisplayOnly == false && isSpecialServiceModifiable == false) {
			$('#containerSpecialServices').hide();
		}
		if(isSpecialServiceModifiable == false) {
			$('#specialSerivceAdd').unbind('click');
  			$('#specialServiceGrid tbody tr td div.ui-inline-edit').hide();
  			$('#specialServiceGrid tbody tr td div.ui-inline-del').hide();
  			
  			
		}
	}
	
	function enforceSecurityOnReferenceNumbers() {
		//change
		//D026443: Disable isCopyBillToHeader only when container is billed 
		 if($('#billedOn').text() != ''){
			 $('select[name^="isCopyBillToHeader"]').val("N");
			 $('select[name^="isCopyBillToHeader"]').attr('disabled', true);
         }
		 else
         {
             $('select[name^="isCopyBillToHeader"]').attr('disabled', false);
             $('select[name^="isCopyBillToHeader"]').val("Y");
         }
		if(isCtrReferenceNumberDisplay == false && isCtrReferenceNumberModifiable == false) {
			$('#containerRefGrid').hide();
		}
		if(isCtrReferenceNumberModifiable == false) {
			$('#gview_referenceNumberGrid div table thead tr#tr_seqNo').hide();
			$('.ui-icon-pencil').hide();
			$('.ui-icon-trash').hide();
		}
	}
	
	function enforceSecurityOnHold() {
		if(isHoldManualDisplayOnly == false && isHoldManualModifiable == false) {
			hideSection('Hold');
		}
	} 
	
	function hideSection(section) {
		$("#conditionAccordians").find('h3').filter(':contains(' + section + ')').hide();
	}
	
	function enforceSecurityOnSave() {
		if(isCtrMaintenanceModifiable == false && isCtrClauseModifiable == false && isHoldManualModifiable == false && isSpecialServiceModifiable == false && isCtrReferenceNumberModifiable == false) {
			$('#containerSave').css('visibility','hidden');
		}
	}
	
	function enforceSecurityOnHoldRelease() {
		if(holdReleaseEnabled == false) {
			$('#holdRelease').css('visibility','hidden');
		}
	}
	
	function disableDialogButton(dialogId, buttonName){
		$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
	}
	
	
	function concludeRating(id)
	{		
//		$('#re_choice_dialog').dialog( "close" );
		var url = "";
		if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
			url = "/receivedContainer/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
		}else{
			url = "/receivedContainer/concludeRating?id="+id;
		}
		blockUI();
		$.ajax({
			   type: "POST",				   							   
			   url: _context +  url,
			   success: function(responseText){		
				   $.unblockUI();
				   if (responseText.data.rateView == "showError") {						
						$('#re_error_dialog').dialog('open');
						jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						$("#ratingErrorForm").loadJSON(responseText.data);
						$("#reErrorGrid").trigger('reloadGrid');
//						$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						$('#reErrContinueBtn').hide();
					}else if(responseText.data.rateView == "showChoices"){
						$('#re_choice_dialog').dialog('open');
						$("#ratingChoiceForm").loadJSON(responseText.data);
						$("#reChoiceGrid").trigger('reloadGrid');
//						$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
//						if(responseText.data.isAllChoicesUnSelectable != null 
//								&& responseText.data.isAllChoicesUnSelectable == "Y"){
//							$('#reChoiceCloseBtn').hide();	
//							$('#reChoiceContinueBtn').show();
//						}else{
//							$('#reChoiceCloseBtn').show();	
//							$('#reChoiceContinueBtn').hide();	
//						}											
					    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					}else if(responseText.data.rateView == "showWarning"){
												
						$('#re_error_dialog').dialog('open');
						$("#ratingErrorForm").loadJSON(responseText.data);
//						$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
						jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						$('#reErrCloseBtn').hide();
						$('#shipmentForm').loadJSON(responseText.data);
						showResponseMessages("msgDiv", responseText);
					}
					else {
						$('#shipmentForm').loadJSON(responseText.data);
						jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						showResponseMessages("msgDiv", responseText);
					}	
				   
			   }
		});	
	}
	
	function createCommentFunc() {
		var args = {
				entityType: 'RCFT',
				entityId: $('#receivedFreightId').val(),
				commentId: 'commentId',
				displayCommentTypes: 'ALL',
				commentTypesForGrid:'ALL'
				
			   };
		getCommentTypes(args);
	}
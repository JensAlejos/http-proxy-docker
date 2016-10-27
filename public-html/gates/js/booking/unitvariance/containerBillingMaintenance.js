var oldForm;
var exitClicked = false;
var somethingChanged; // Added this to remove reference error I think from container grid.
$(document).ready(function() {
	// D024761: cannot move to different page when unsaved changes present
	$(window).bind('beforeunload', function(event){
		var str = 'You have unsaved changes!';
		var err = false;
		if (!exitClicked){
			$.ajax({
				url: "/gates/containerBilling/validateScreenModified",
				async: false,
				success: function(responseText){
					if(responseText.success){
						err = true;					
					}
				}
			});
			if (err) {
				event.stopImmediatePropagation(); //to prevent UIblock
				return str;
			}
		}
	});
	
	$('#containerBillingForm').validationEngine('attach');

	setDivNames();

	var bookingNo = $.trim($('#shipmentNumber').val());
	if(bookingNo != null && $.trim(bookingNo!='')){
		if(bookingNo.length>=7){
			displayConatinerDtls();
		}
	}

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
		displayConatinerDtls();
	}
});
// Display existing booking
$('#shipmentNumber').bind('keydown', function(event){
	//keyCode for enter key is 13 and for tab out is 9
	if(event.keyCode == 13 || event.keyCode == 9) {
		displayContainerIfValidShipment();
	}
});
//D022815
$('#shipmentNumber').blur(function(){
	displayContainerIfValidShipment();
});

$('#containerSave').click(function() {
	// keyCode for enter key is 13 and for tab out is 9
	saveConatinerDtls();
});

$('#prorateBillBtn').click(function() {
		
	var shipment_number = $("#shipmentNumber").val();
	var containerNumber = jQuery("#containerGrid").getGridParam('selarrrow');
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		shipment_sequence_number="000";
	}
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		shipment_correction_number="000";
	}
	var url="";
	if(containerNumber.length!=0){
	url = "/cas/proRateWtCubeSearch.do?shipmentNumber="+shipment_number+"&shipmentSequenceNumber="+shipment_sequence_number+
		"&shipmentCorrectionNumber="+shipment_correction_number+"&containNo="+containerNumber[0]+"&reset=true";
	}else{
	url = "/cas/proRateWtCubeSearch.do?shipmentNumber="+shipment_number+"&shipmentSequenceNumber="+shipment_sequence_number+
		"&shipmentCorrectionNumber="+shipment_correction_number+"&reset=true";	
	}
	window.location = _context + url;
			
	});

reloadContainerGrids();
// create Hold grid
createHoldGrid("containerBilling");
//D024761: cannot move to different page when unsaved changes present
$('#containerExit').click(	function() {
	
exitClicked = true;
	
	$.ajax({
		url: "/gates/containerBilling/validateScreenModified",
		success: function(responseText){
			if(responseText.success){
				// D024676 : Fix for unsaved pop up shown on exit
				//var newForm = $('#containerBillingForm').formSerialize();
				//if(newForm != oldForm){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						return exit();
					}
					else{
						exitClicked = false;
						return false;
					}
				} //else {
					//return exit();
				//}
			//}
			else{
				return exit();
			}
		}
	});
});



$('#containerVariance').click(function(){
	var bookingNum=$('#shipmentNumber').val();
	var containerNumber = jQuery("#containerGrid").getGridParam('selarrrow');
	if(bookingNum!='' && bookingNum.length==7){
		document.location.href = _context +'/containerVariance/showForm?bookingId='+bookingNum+'&containerNumbers='+containerNumber+'&source=B';
	}
	//D022815
	else{
		$('#msgDiv').html("<div class=\"message_warning\">Booking number must be 7 in length. No spaces are allowed.</div>");
		window.scrollTo(0, 0);
	}
});

$('#clearButton').click(function(){
	document.location.href = _context +'/containerBilling/showForm?source=clear';
});


$('#containerSave').attr("disabled", true);
$('#bill').attr("disabled", "disabled");
$('#hold').attr("disabled", "disabled");

//Security Implementation
enforceCtrMaintenanceUserSecurityRolesAndPermissions();

function getSelectedReceivedFreightsIds(){
	var selectedRCFTIds = "";
	var selectedRows=jQuery("#containerGrid").jqGrid('getGridParam', 'selarrrow'); 
	for(var i=0;i<selectedRows.length;i++){
		var currentRow=$("#containerGrid").jqGrid('getRowData',selectedRows[i]); 
		selectedRCFTIds = selectedRCFTIds + currentRow.recFreightId + "|";
	}
	return selectedRCFTIds;
}

$('#bill').click(function(){
	var bookingNo = $.trim($('#shipmentNumber').val());
	if(bookingNo!='' && bookingNo.length==7){
		var isAutoBill = $('#isAutoBill').val();
		if(isAutoBill == 'true'){
			var selectedRCFTIds = getSelectedReceivedFreightsIds();
			$.ajax({
				type: "GET",
				url: _context +"/booking/createBatchBillForBookings",
				data: {
					bookingId: $("#bookingId").val(),
					receivedFreightIds: selectedRCFTIds,
					callingModule: "BOOKING",
					callingPage: "CBMAINT",
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
		}else{
			$('#msgDiv').html("<div class=\"message_error\">This is not an Autobill Container</div>");
			window.scrollTo(0, 0);
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
		'/gates/containerBilling/loadReChoiceGrid',
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
		'/gates/containerBilling/loadReErrorGrid',
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
$('#msgDivBill').hide();
//create bill booking dialog at body on-load
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

$('#shipmentNumber').focus();
/*$('#billingStartedHyperlink').click(function(){
	$('#receivedFreightGridDiv').hide();
	$('#receivedUnitsGridDiv').hide();
	loadBillStartedGrids();
	//collapseAll();
	invokeBillingStartedOverlayScreen();
});*/

tabSequence('#containerBillingForm',false,false);
oldForm = $('#containerBillingForm').formSerialize();
});


//D022815
function displayContainerIfValidShipment(){
	var bookingNo = $.trim($('#shipmentNumber').val());
	if(bookingNo!=''){
		if(bookingNo.length>=7){
			displayConatinerDtls();
			//D022815
			$('#bill').attr("disabled", false);
			//$('#containerVariance').attr("disabled", false);
		}
		else{
			//D022815
			$('#bill').attr("disabled", true);
			//$('#containerVariance').attr("disabled", true);
			$('#msgDiv').html("<div class=\"message_warning\">Booking number must be 7 in length. No spaces are allowed.</div>");
		}
	}
	else{
		//D022815
		$('#bill').attr("disabled", true);
		//$('#containerVariance').attr("disabled", true);
		$('#msgDiv').html("<div class=\"message_warning\">Booking number must be present.</div>");
	}
}

function saveConatinerDtls() {
    //D029954: 	Duplicate container is accepted in GATES
	blockUI();
	if ($("#containerBillingForm").validationEngine('validate')) {
	//changed for D023317
	updateContainerGrid();
	
		if(containerUpdateSuccess)
		{
		var billingStarted =$('#shipmentStatus').val();
		var isConfirm = true;
		if(billingStarted){
			//$.unblockUI();
			isConfirm = confirm("Billing has started, Please confirm to proceed!");
		}
		if (isConfirm) {
			//$('#msgDiv').show();
			$('#msgDiv').html("<div class=\"message_info\">Saving ...</div>");
			$.ajax({
				type : "POST",
				url : _context + "/containerBilling/saveContainerDetails",
				data : $('#containerBillingForm').formSerialize(),
				async : false, 
				success : function(responseText) {
					if (responseText.messages.error.length == 0) {
	
						showJSON(responseText);
						// Grid reload calls
						reloadContainerGrids();
						setDivNames();
					}
					// Messages
					showResponseMessages("msgDiv", responseText);
					$('#commentsDiv').show();
					// Booking Id
					$("#commentId").val(responseText.data.header.commentId);
					oldForm = $('#containerBillingForm').formSerialize();
					reloadContainerGrids();
				}
				
			});
			$.unblockUI();
		}else {
			 $.unblockUI();
		}
		
		}else{
		//reloadContainerGrids();
			 $.unblockUI();
			return;
		}
	}
}

function displayConatinerDtls() {
	showLoadingMessage('L');
	if ($("#containerBillingForm").validationEngine('validate')) {
		$.ajax({
			type : "POST",
			url : _context + "/containerBilling/display",
			data : {
				bookingNumber : $("#shipmentNumber").val()
			},
			success : function(responseText) {
				resetHeader();
				if (responseText.messages.error.length == 0) {
					$('#maintainContainer').attr('style','display:block');
					showJSON(responseText);
					onclickButtonEnable();
				}
				else{
					$("#success").val("false");
					$('#containerExit').attr("disabled", false);
					$('#containerSave').attr("disabled", true);
					$('#clearButton').attr("disabled", false);
				}
				// Grid reload calls
				reloadContainerGrids();
				setDivNames();
				// Messages
				$('#commentsDiv').show();
				
				$('#commentId').val(responseText.data.commentId);
				$('#receivedFreightId').val(responseText.data.receivedFreightId);
				
				/*var args = {
						entityType: 'RCFT',
						entityId: $('#receivedFreightId').val(),
						commentId: 'commentId',
						displayCommentTypes: ''
					   };
				getCommentTypes(args);*/
				
				if(responseText.data.header.billExists=="Y"){
					prepareHeaderDataForBillingOverlay(responseText);
					$('#billingStartedHyperlink').show();
					$('#prorateBillBtn').attr("disabled",false);
				}
				showResponseMessages("msgDiv", responseText);
				// $('#commentsDiv').show();
				/*$('#fetchBookingInfo').attr("disabled", false);*/
				
				//Display Unreleased Holds Grid on initial display
				openUnreleasedHoldGridOnIntialDisplay("containerBilling");
				// security
				enforceSecurityOnContainer();
				
				if($('#stsDiv').text() == 'APPR'){
					$('#bill').attr("disabled",false);
				}else{
					$('#bill').attr("disabled",true);
				}
				oldForm = $('#containerBillingForm').formSerialize();
			}
			
		});
	}
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

// post-submit callback
function showResponseMessages(msgDivId, responseText) {
	$('#msgDiv').show();
	// alert("responseText: " + responseText);
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

		// alert("msg length: "+messages.success.length);
		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				// alert("msg" + i + " : " + array[i]);
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		// alert("msgDivId : " + msgDivId);
		$('#' + msgDivId).html(messageContent);
		if (messageContent != '') {
			window.scrollTo(0, 0);
		}
	}
}
// common method for reloading all grids for booking
function reloadContainerGrids() {
	$("#containerGrid").trigger('reloadGrid');
	$("#gridIdForClauses").trigger('reloadGrid');
	$("#holdGrid").trigger('reloadGrid');

}

function showJSON(responseText) {

	// Booking Id

	// Comment Id
	$("#commentId").val(responseText.data.commentId);
	
	// Header
	// Header
	$("#header").loadJSON(responseText.data.header);
	$("#isAutoBill").val(responseText.data.header.isAutoBill);
	$("#commentId").val(responseText.data.commentId);
	// Booking Id
	$("#bookingId").val(responseText.data.header.bookingId);

	$('#stsDiv').text(responseText.data.header.bookingStatus);

	$('#shipperDiv').text(responseText.data.header.shipperOrg);

	$('#porDiv').text(responseText.data.header.placeOfReceipt);
	$('#consigneeDiv').text(responseText.data.header.consigneeOrg);
	$('#polDiv').text(responseText.data.header.portOfLoading);
	$('#tradeDiv').text(responseText.data.header.tradeCode);
	$('#podDiv').text(responseText.data.header.portOfDischarge);
	$('#poDeDiv').text(responseText.data.header.placeOfDelivery);
	$('#VVDDiv').text(responseText.data.header.vesselVoyageDirection);
	$('#ldsDiv').text(responseText.data.header.loadDischargeCode);
	$('#custDiv').text(responseText.data.header.customerGroup);
	$('#measSourceCodeDiv').text(responseText.data.header.measureSourceCode);

	createCommentFunc();
}
function setAccordianTabDetails(id, displayText) {
	$("#" + id).text(displayText);
}
function populateCountryPhoneCodes() {
	$.ajax({
		url : "/gates/booking/freight/getCountryPhoneCodes",
		success : function(responseText) {
			if (responseText.success) {
				countryPhoneCodes = responseText.data;
				// alert("countryPhoneCodes: " + countryPhoneCodes);
			}
		}
	});
}

function setDivNames() {

	setClauseDiv();
	setBookingHold();

}

function setClauseDiv() {
	var rowIDs = jQuery("#gridIdForClauses").getDataIDs();
	var headerStr = "";
	for ( var i = 0; i < rowIDs.length; i = i + 1) {
		var rowData = jQuery("#gridIdForClauses").getRowData(rowIDs[i]);

		if (rowData.standardClauseCode != null
				&& rowData.standardClauseCode != '') {
			if (headerStr == '')
				headerStr = rowData.standardClauseCode;
			else
				headerStr = headerStr + ", " + rowData.standardClauseCode;
		}
	}
	if (headerStr != "")
		headerStr = "Clauses - " + headerStr;
	else
		headerStr = "Clauses";
	setAccordianTabDetails('clauseHeader', headerStr);
}

function setBookingHold() {
	var holdCount = $("#holdGrid").getGridParam("reccount");
	if (holdCount == 0) {
		setAccordianTabDetails('maintainBookingHoldId', "Hold");
	} else if (holdCount > 0) {
		var holdDisplayText = "Hold - "
				+ jQuery("#holdGrid").getRowData(1).holdCode;
		setAccordianTabDetails('maintainBookingHoldId', holdDisplayText);
	}
}

function clearContainerForm() {
	var webPageSectionIds = [ 'containerForm' ];
	for ( var i = 0; i < webPageSectionIds.length; i++) {
		clearWebPageSection(webPageSectionIds[i]);
	}
}

function clearWebPageSection(webPageSectionId) {
	var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week|hidden)$/i;
	$("#" + webPageSectionId + " :input").each(function() {
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

function onclickButtonDisable() {
	$('#containerExit').attr("disabled", true);
	$('#containerSave').attr("disabled", true);
	$('#clearButton').attr("disabled", true);
}

function onclickButtonEnable() {
	$('#containerExit').attr("disabled", false);
	$('#containerSave').attr("disabled", false);
	$('#clearButton').attr("disabled", false);
}

function showLoadingMessage(type) {
	/*$('#fetchBookingInfo').attr("disabled", true);*/
	onclickButtonDisable();
	if (type == 'L') {
		$('#msgDiv').html(
				"<div class=\"message_info\">Loading Booking "
						+ $("#shipmentNumber").val() + " ...</div>");
	}
	$('#msgDiv').show();
}

function resetHeader(){
		$("#bookingId").val("");
		$("#isAutoBill").val("");
		
		$("#unitOfMeasureSourceCode").val("");
		$("#metricWeightLimit").val("");
		$("#imperialWeightLimit").val("");
		$("#shipperDiv").html("");
		$("#porDiv").html("");
		$("#porDiv").html("");
		$("#stsDiv").html("");
		$("#consigneeDiv").html("");
		$("#polDiv").html("");
		$("#tradeDiv").html("");
		$("#VVDDiv").html("");
		$("#podDiv").html("");
		$("#custDiv").html("");
		$("#measSourceCodeDiv").html("");
		$("#ldsDiv").html("");
		$("#poDeDiv").html("");
		$('#billingStartedHyperlink').hide();
		$('#shipmentStatus').val("");
		$('#prorateBillBtn').attr("disabled",true);
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

function exit(){
	 //alert(previouspage);
	 
	 var s="loadShipmentDetail";
	 var t="proRateWtCubeSearch.do?shipmentNumber";
	 var prevPage = document.referrer; //$("#prevPage").val();
	 prevPage = prevPage.split("/");
	 prevPage = prevPage[prevPage.length - 2] + "." + prevPage[prevPage.length - 1];
	 
		$.ajax({
		url: _context+"/containerBilling/exit",
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
	enforceSecurityOnContainer();
	enforceSecurityOnClauses();
	enforceSecurityOnReferenceNumbers();
	enforceSecurityOnSpecialServices();
	enforceSecurityOnHold();
	enforceSecurityOnSave();
	enforceSecurityOnHoldRelease();
	enforceSecurityOnBill();
	enforceSecurityOnProrateBill();
	enforceSecurityContainerVariance();
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

function enforceSecurityOnClauses() {
	if(isCtrBillingClauseDisplay == false && isCtrBillingClauseModifiable == false) {
		hideSection('Clauses');
	}
	if(isCtrBillingClauseModifiable == false) {
		$('#clausesAdd').unbind('click');
		$('#gridIdForClauses tbody tr td div.ui-inline-edit').hide();
		$('#gridIdForClauses tbody tr td div.ui-inline-del').hide();
	}
}

function enforceSecurityOnContainer() {
	if(isCtrBillMaintenanceModifiable == false) {
		$('#gview_containerGrid div table thead tr#tr_equipmentId').hide();
		$('#containerGrid tbody tr td div.ui-inline-edit').hide();
		$('#containerGrid tbody tr td div.ui-inline-del').hide();
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
	if(isCtrBillingClauseModifiable == false && isHoldManualModifiable == false && isCtrBillMaintenanceModifiable == false) {
		$('#containerSave').css('visibility','hidden');
	}
}

function enforceSecurityOnHoldRelease() {
	if(isCtrBillingHoldReleaseEnabled == false) {
		$('#holdRelease').css('visibility','hidden');
	}
}

function enforceSecurityOnReferenceNumbers() {
	if(isCtrReferenceNumberDisplay == false && isCtrReferenceNumberModifiable == false) {
		$('#containerRefGrid').hide();
	}
	if(isCtrReferenceNumberModifiable == false) {
		$('#gview_referenceNumberGrid div table thead tr#tr_seqNo').hide();
		$('#referenceNumberGrid tbody tr td div.ui-inline-edit').hide();
		$('#referenceNumberGrid tbody tr td div.ui-inline-del').hide();
		$('#del_referenceNumberGrid').hide();
	}
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

function concludeRating(id)
{		
//	$('#re_choice_dialog').dialog( "close" );
	var url = "";
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/containerBilling/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		url = "/containerBilling/concludeRating?id="+id;
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
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
				}else if(responseText.data.rateView == "showChoices"){
					$('#re_choice_dialog').dialog('open');
					$("#ratingChoiceForm").loadJSON(responseText.data);
					$("#reChoiceGrid").trigger('reloadGrid');
//					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
//					if(responseText.data.isAllChoicesUnSelectable != null 
//							&& responseText.data.isAllChoicesUnSelectable == "Y"){
//						$('#reChoiceCloseBtn').hide();	
//						$('#reChoiceContinueBtn').show();
//					}else{
//						$('#reChoiceCloseBtn').show();	
//						$('#reChoiceContinueBtn').hide();	
//					}											
				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
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
			displayCommentTypes: ''
		   };
	getCommentTypes(args);
}
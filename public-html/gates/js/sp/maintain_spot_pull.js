var isSpotPullChanged = "N";
$.validationEngine.defaults.validationEventTrigger = null;

function removeErrorPointers(){
	   $('#spotPullForm').validationEngine('hideAll');
}


function checkDocumentAvlToPrint(){
	$.ajax({
		url: _context + "/spotpull/checkDocumentAvlToPrint/",
		type: 'GET',
		dataType: 'html',
		cache: false,		
		beforeSend: function () { 
		},
		error: function () { 
		},
		success: function (data) { 
		},
		complete: function (response, textStatus) { 
			
			var result = eval('(' + response.responseText + ')');
			var errMsg = result.messages.error;
			var finalMessage = '';
			for (var i = 0; i < errMsg.length; i++) {
				 finalMessage = finalMessage +'\n'+errMsg[i];
			}
			var responseStatus = result.success;
			checkResponse(responseStatus);
		}
	}); 
}

function checkResponse(responseStatus){
	if(responseStatus==true){
		var url='../spotpull/printSpotPullRequest';
     	var newWindow = window.open(url,'name','height=500,width=500');
     	newWindow.print();
     	return false;
	}else{			
//		$('#msgErrorDiv').show();
	}
}

var alfrescoURL = "";

$(document).ready(function () { 

//	$.unblockUI();
	//D028629: 	Dispatch - key passing 
	var searchText=$("#textfield5").val();
	if(searchText== null || searchText=='' || searchText!=$("#bookingNumber").html()){
	searchText=$("#bookingNumber").html();
	$.ajax({
	url: "/gates/workingContext/setContext",
	type: "POST",
	data: {key:"BK_BOOKING",value:searchText},
	success: function(responseText){
		$("#textfield5").removeAttr('style');
	}
	});
	}
	if($("#dispatchRequestId").val()!="")
		alfrescoURL = "/documentHistory/?doctype=gspDispatch&identifier="+$('#dispatchRequestId').val();

	$('#spotPullForm').validationEngine('attach');
	
	var dispatchType = $("#spotRequirementTypeCode").val();
	
/*	if (dispatchType == 'S' || dispatchType == 'L') 
	{
		$("#containerNumber").attr("disabled", "disabled");
	}
*/	
	$("#appointmentTimeAm").attr("disabled", "disabled");
	$("#appointmentTimePm").attr("disabled", "disabled");
	$('#printInternalComments').val(false);	
	$('#printInternalComments').click(function() {
			if ($(this).is(':checked')) {
				$(this).val(true);
			} else {
				$(this).val(false);
			}

		});
	$('#saveBtn').click(function(){
		// blockUI();
		$("#spotPullForm").attr("action", "updateMaintainSpotAndPull");
     	$("#spotPullForm").submit(); 
	});
	
	$('#acceptBtn').click(function(){
		// blockUI();
		$("#spotPullForm").attr("action", "acceptSpotPullChanges");
     	$("#spotPullForm").submit(); 
     	
     	// -- 25368 --
     	isSpotPullChangeAcceptable = false;
	});
		
	$('#requiredDateDiv').html($('#requiredDate').val());
	
	var multipleRatesFound = $("#multipleRatesFound").val();
	if(multipleRatesFound == 'true')
	{
		truckerPopupSearch();
	}

	if(isAnotherRequestAvl=='true')
	{			
		$('#nextBtn').removeAttr("disabled");			
	}
	
	else if (isAnotherRequestAvl=='false')
		{
		$("#nextBtn").attr("disabled", "disabled");
		}

//	$('#msgErrorDiv').hide();
	
	$('#nextBtn').click(function(){
		$("#spotPullForm").attr("action", "nextSpotPullRequest");
     	$("#spotPullForm").submit(); 
	});
	
	$('#printBtn').click(function(){
		if( $('#truckerName').val()== null ||  $('#truckerName').val()=='' ) {
			$('#msgDiv').html('<div class="message_error">'+' Select Trucker to send'+'</div>');
					window.scroll(0, 0);
					return;
		}
		var url='../spotpull/printSpotPullRequest?printInternalComments='+$('#printInternalComments').val();
	 	var newWindow = window.open(url,'name','height=500,width=500');
     	newWindow.print();
//		checkDocumentAvlToPrint();
//		var url='../spotpull/printSpotPullRequest';
//     	var newWindow = window.open(url,'name','height=500,width=500');
//     	newWindow.print();
     	return false;

	});

	$('#sendBtn').click(function(){
		$('#printInternalComments').val(false);
		if( $('#truckerName').val()== null ||  $('#truckerName').val()=='' ) {
			$('#msgDiv').html('<div class="message_error">'+' Select Trucker to send'+'</div>');
					window.scroll(0, 0);
					return;
		}
		var isSendingSectionVisible = $('#sendContactMethodDiv').is(':visible');
		
		if(isSendingSectionVisible == true || $('#isContact').is(':checked'))
		{	
			var rowIDs = '';
			rowIDs=jQuery("#contactGrid").getDataIDs();
			
			if ($('#isEdi').is(':checked')) 
			{
				//do nothing  allow to send					
			}
			else
			{
				setSelectedDocumentContacts();
				
				var selContacts = $('#selectedContacts').val();
				if(Boolean(selContacts))
				{
					//do nothing  allow to send		
				}else
				{
					$('#msgDiv').html('<div class="message_error">'+'Select contact(s) to send'+'</div>');
					window.scroll(0, 0);
					return;
				}
			}
		}
		
		var status =  $("#statusCode").val();
		var isSetMail= $("#isAddContact").val();
		if(status == 'SENT')
		{
			var r=confirm("This request has already been sent. Are you sure you want to resend the request?");
			if (r==true)
			  {
//				blockUI();
				var queryString = $('#spotPullForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/spotpull/sendSpotPullRequest",
					data: queryString,
					success: function(responseText){
						$.unblockUI();
						if(isSetMail=='Y'){
							responseText.data.isAddContact='Y';
							responseText.data.isEdiCapable='N';
						}else
						{
							responseText.data.isAddContact='N';
							responseText.data.isEdiCapable='Y';
							$("#addDocumentContact").hide();
						}
						$("#availableContactList").val(responseText.data.availableContactList);
						responseText.data.availableContactList =null;
						showResponseMessages(responseText.messages);
						$("#spotPullForm").loadJSON(responseText.data);	
						if (responseText.messages) {
							if(responseText.messages.success.length > 0){
								sendDispatchRequest();
							}
						}
					
					}
				});
			  }
		}
		else
		{
//			blockUI();
			var queryString = $('#spotPullForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/spotpull/sendSpotPullRequest",
					data: queryString,
					success: function(responseText){
						$.unblockUI();
						if(isSetMail=='Y'){
							responseText.data.isAddContact='Y';
							responseText.data.isEdiCapable='N';
						}else
						{
							responseText.data.isAddContact='N';
							responseText.data.isEdiCapable='Y';
							$("#addDocumentContact").hide();
						}
						showResponseMessages(responseText.messages);
						$("#availableContactList").val(responseText.data.availableContactList);
						responseText.data.availableContactList =null;
						$("#spotPullForm").loadJSON(responseText.data);
						if (responseText.messages) {
							if(responseText.messages.success.length > 0){
								sendDispatchRequest();
							}
						}
					
					}
				});
		}
	});

	/*
	 * 12. Code for Comments Section
	 */
/*		var args = {
				entityType: 'SPRQ',
				entityId: $('#dispatchRequestId').val(),
				commentId:  'commentId',
				displayCommentTypes: 'CSS,OPSINTNL,TRK-OVER'
			};
	$("#comment_link").comments(args);
*/	
	//Modified entity type to 'SPDT' for D028648
	var args = {
			entityType: 'SPDT',
			entityId: $('#dispatchRequestId').val(),
			commentId:  'commentId',
			displayCommentTypes: ''
		};
	getCommentTypes(args);

	
	// code to bind pop up search on trucker text box
	 $('#truckerCode').gatesPopUpSearch({func:function() {truckerPopupSearch()}});
	 
	 var portCode='';

	 var filterValue3 = $("#spotRequirementTypeCode").val();
	
	 if (filterValue3 == 'S' || filterValue3 == 'P' || filterValue3 == 'L') 
	 {			
		portCode = $('#originPortCityCode').val();
     }
	 else
	 {
		portCode = $('#destPortCityCode').val();
	 }

	 $('#truckerCode').gatesAutocomplete({
			source : _context + '/cas/autocomplete.do?method=searchTrucker&searchType=241&parentSearch='+portCode,
			formatItem : function(item) {
				$('#truckerArolId').val(item.ADDRESS_ROLE_ID);
				return item.TRUCKER_CODE + "-" + item.TRUCKER_NAME;
			},
			formatResult : function(item) {
				$('#truckerArolId').val(item.ADDRESS_ROLE_ID);
				$('#truckerName').val(item.TRUCKER_NAME);
				$('#rate').val('');
				return item.TRUCKER_CODE;// + "-" + item.cityName;
			},
			select : function(item) {
			}
	 });
 
	 
    // code to bind pop up search on rate text box
//	 $('#rate').gatesPopUpSearch({func:function() {ratePopupSearch()}});
	 
	 
	 $('#cancelDispatch').click(function() {
		 if(isSpotPullChanged == 'Y'){
				var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
				if (isConfirm) {
					document.location.href = _context + '/cas/spotAndPullRequestSearch.do?isRefresh=true';
				}
			} else {
				document.location.href = _context + '/cas/spotAndPullRequestSearch.do?isRefresh=true';
			} 
	 });
	
	$('#depot').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode;// + "-" + item.cityName;
		},
		select : function(item) {
			$('#depot').val(item.cityCode);				
		}
	});
	
	$('#depot').gatesPopUpSearch({
		func : function() {
			placePopupSearch($('#depot').val(), 2);
		}
	});
	
	$('#rampCode').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCityPredictive',
		formatItem : function(item) {
			return item.cityCode + " " + item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode;// + "-" + item.cityName;
		},
		select : function(item) {
			$('#rampCodeHidden').val(item.cityCode);
							
			somethingChanged = true;
		}
	});
	
	$('#rampCode').gatesPopUpSearch({
		func : function() {
			placePopupSearch($('#rampCode').val(), 5);
		}
	});

	//vaibhav
	$('#truckerCode').focusout(function(){
		if($('#truckerCode').val().trim()!='' && $('#truckerArolId').val().trim()!='')
		{
			loadDocumentContactDetails();
		}
	});
	
	enforceSecurity();
	tabSequence('#spotPullForm',false,false);
	
});  // document ready function end
function sendDispatchRequest() {
	/*var queryString = $('#spotPullForm').formSerialize();
	$.ajax({
		type : "POST",
		url : _context + "/spotpull/sendDispatchRequest",
		data : queryString,
		success : function(responseText) {
			$("#availableContactList").val(responseText.data.availableContactList);
			responseText.data.availableContactList =null;
			showResponseMessages(responseText.messages);
			$("#spotPullForm").loadJSON(responseText.data);
			if(responseText.data.isAddContact=='N'){
				$("#addDocumentContact").hide();
			}
			else{$("#addDocumentContact").show();}
		}
	});*/
	$("#spotPullForm").attr("action", "sendDispatchRequest");
 	$("#spotPullForm").submit();
}
$(function() {
	isSpotPullChanged = "N";
	$('#spotPullForm').validationEngine('attach');
	
	$('#spotPullForm :input').change(function()
	{
		isSpotPullChanged = "Y";
	});
	
	$('#spotPullForm select').change(function()
	{
		isSpotPullChanged = "Y";
	});
	$( "#vesselCutOffDate" ).datepicker({ dateFormat: 'mm-dd-yy' });	
	}); 


function validateSpotOnPull()
{
	if($('#isSpotOnPull').val() != "Y" && $('#isSpotOnPull').val() != "N" && $('#isSpotOnPull').val() != "EMPTY DECLINED")
	{
		return "Please enter a valid Spot On Pull (Y/N)";
	}
}

function validateRate()
{
	if($('#isRequestOutZone').val() == "true")
	{
		if($('#rate').val() == "" || $('#rate').val()=="0")
		{
			return "Rate amount may not be zero.";
		}
	}
}
function showResponseMessages(messages){
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
	$('#msgDiv').html(messageContent);
	
	if(messageContent!='')
		window.scrollTo(0, 0);
}

function truckerPopupSearch() {

	var isRequestOutZone = $('#isRequestOutZone').val();


/*		 
filterValue1        IN IN_TRUCKER_CODE              varchar(30),
filterValue2        IN IN_PORT_CODE                 varchar(10),
filterValue3		IN  IN_SPOT_REQUIREMENT_TYPE_CODE char(1),
filterValue4		IN  IN_BOOKING_ID               BIGINT  ,
filterValue5		IN  IN_SERVICE_ITEM_CODE        VARCHAR(8),
filterValue6		IN  IN_ZIP_CODE                 VARCHAR(9),
filterValue7		IN  IN_REQUIRED_DATE            DATETIME,
filterValue8        IN  in_eq_type                varchar(1),
filterValue9		IN  in_eq_ht                varchar(1),
filterValue10		IN  in_eq_len                 varchar(2),
filterValue11		IN  IN_SHC_FLAG                 char(1),
filterValue12		IN  IN_STATE_CODE               VARCHAR(9),

*/
	var filterValue1 = $('#truckerCode').val();
	
	var filterValue2='';
	var filterValue6=''; // zip code needed for zone calculation
	
	var filterValue3 = $("#spotRequirementTypeCode").val();
	
	if (filterValue3 == 'S' || filterValue3 == 'P' || filterValue3 == 'L') 
	{			
		filterValue6 =$('#bookingPickUpZipCode').val(); 
		filterValue2 = $('#originPortCityCode').val();
	}
	else
	{
		filterValue6 =$('#bookingDeliveryZipCode').val();
		filterValue2 = $('#destPortCityCode').val();
	}
	
	filterValue4 = $("#bookingId").val();
	filterValue5 =''; // zone..needs to be calculated in stored proc itself.
	
	filterValue7 = $("#requiredDate").val();
	filterValue8 = $("#equipmentType").val();
	filterValue9 = $("#equipmentHeight").val();
	filterValue10 = $("#equipmentSize").val();
	
	var filterValue11 = 'N'; // 'N' for 1 location 'Y' for multiple locations.	
	var locationList = jQuery("#dispatchLocationGridTable").getDataIDs();
	if(locationList.length>1)
		filterValue11 = 'Y'; // 'N' for 1 location 'Y' for multiple locations.

	var state='';
	for(var j=0;j<locationList.length;j++)
	{ 				 
		rowData=jQuery("#dispatchLocationGridTable").getRowData(locationList[j]);		
		state=rowData.state;
		break;
	}
	
	var filterValue12 = state;

	if(isRequestOutZone == 'false')
	{
		var actionUrl = '../cas/truckerSearchSpotAndPullLookup.do?filterValue1='+ filterValue1 + '&filterValue2='+ filterValue2 + '&autoSearch=true';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressPopSearch', windowStyle);	
	}
	else
	{
		var actionUrl = '../cas/truckerRateSelectionSearch.do?filterValue1='+ filterValue1  
						+ '&filterValue2='+ filterValue2 
						+ '&filterValue3='+ filterValue3
						+ '&filterValue4='+ filterValue4
						+ '&filterValue5='+ filterValue5
						+ '&filterValue6='+ filterValue6
						+ '&filterValue7='+ filterValue7
						+ '&filterValue8='+ filterValue8
						+ '&filterValue9='+ filterValue9
						+ '&filterValue10='+ filterValue10
						+ '&filterValue11='+ filterValue11
						+ '&filterValue12='+ filterValue12
						+ '&autoSearch=true'
						;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressPopSearch', windowStyle);
	}
}			

	function truckerSearchRateUpdate(id){
		var values = id.split("|");
		$('#truckerCode').val(values[0]);
		$('#truckerName').val(values[1]);
		$('#rate').val(values[2]);
		$('#truckerArolId').val(values[7]);
		loadDocumentContactDetails();
	}
	
	function truckerSearchUpdate(id)
	{
		var values = id.split("|");
		$('#truckerCode').val(values[0]);
		$('#truckerName').val(values[1]);
		$('#truckerArolId').val(values[2]);
		loadDocumentContactDetails();
	}
	
	function truckerSearchOverrideUpdate(id){
		var values = id.split("|");
		$('#truckerCode').val('');
		$('#truckerName').val(values[0]);
		$('#truckerArolId').val(values[1]);
		$('#rate').val('');
		loadDocumentContactDetails();
	}

	//Vaibhav
	function loadDocumentContactDetails()
	{  
		var queryString = $('#spotPullForm').formSerialize();
		
		$.ajax({
			type: "POST",
			url: _context +"/spotpull/loadDocumentContactDetails",
			data: queryString,
			success: function(responseText){
				$("#spotPullForm").loadJSON(responseText.data);
				//showResponseMessages(responseText.messages);
				$("#truckerArolId").val(responseText.data.truckerArolId);
				$("#selectedContactId").get(0).options.length = 0;
		        $.each(responseText.data.contactList, function(index, contactList) {
		            $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
		        });
				$("#availableContactList").val(responseText.data.availableContactList);
				jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				//alert("loadTemplateDetails "+$("#truckerCode").val());
				document.getElementById('sendContactMethodDiv').style.display = 'block';
			}
		});
		
	}

/*function truckerPopupSearch() {
	//var actionUrl = '../cas/orgtruckerlookup.do?filterValue1='+ $('#truckercode').val();
	
	var isRequestOutZone = $('#isRequestOutZone').val;
	//if(isRequestOutZone == "N")
		//var actionUrl = "../cas/truckerSearchSpotAndPull.do";
	//else
		//var actionUrl = "../cas/truckerRateSelection.do";
	
	//var actionUrl = "../cas/truckerSearchSpotAndPull.do";
	var actionUrl = '../cas/truckerSearchSpotAndPullLookup.do?filterValue1='+ $('#truckerCode').val() + '&filterValue2='+ $('#originCityCode').val() ;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'AddressPopSearch', windowStyle);	
}

function ratePopupSearch() {
	var actionUrl = '../cas/truckerRateSelection.do?filterValue1='+ $('#truckerCode').val() + '&filterValue2='+ $('#originCityCode').val() ;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'AddressPopSearch', windowStyle);	
}


function cityPopupSearch() {   
	var actionUrl = _context+"/city/search/showForm?term="+$('#rampCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);    
}


function truckerSearchUpdate(id){
	var values = id.split("|");
	$('#truckerCode').val(values[0]);
	$('#truckerName').val(values[1]);
	$('#truckerArolId').val(values[2]);
}

function truckerSearchRateUpdate(id){
	var values = id.split("|");
	$('#truckerCode').val(values[0]);
	$('#truckerName').val(values[1]);
	$('#truckerArolId').val(values[2]);
	$('#rate').val(values[3]);
}

function truckerSearchOverrideUpdate(id){
	var values = id.split("|");
	$('#truckerCode').val('');
	$('#truckerName').val(values[0]);
	$('#truckerArolId').val(values[1]);
	$('#rate').val('');
}*/

    function disableDialogButton(dialogId, buttonName){
    	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
    	$("#locationDialog").gatesDisable();
    }
	function enforceSecurity()
	{
		if(!isSpotPullSendable)
			{ // Defect D027289
			 // $("#sendBtn").attr("disabled", "disabled");
			$("#sendBtn").css('visibility','hidden');
			}
		if(!isSpotPullPrintable)
			{
			$("#printBtn").attr("disabled", "disabled");
			}
		if(!isSpotPullChangeAcceptable)
			{
			//Added for defect D027298 
			//$("#acceptBtn").attr("disabled", "disabled");
			$("#acceptBtn").css('visibility','hidden');
			}
		if(!isSpotPullUpdatable)
			{
			$('#saveBtn').attr("disabled", "disabled");
			//$('#truckerCode').attr("disabled", "disabled");
			//$('#depot').attr("disabled","disabled");
			//$('#rampCode').attr("disabled","disabled");

			    $("#truckingDiv").gatesDisable();
			    $("#sendContactMethodDiv").gatesDisable();
			    $("#instructionDiv").gatesDisable();
			    $("#truckingDetails").gatesDisable();
			    setTimeout(function(){
			        $("#del_contactGrid").children(0).hide();
			    },500);
			}
	}

	function getCommentTypes(args){
		$.ajax({
			url: _context +"/comments/commentTypes",
			data: {
				entity: 'SPRQ',
				contextScreen: 'spotpull'
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
					args.displayCommentTypes=string;
					$("#comment_link").comments(args);
					
				}
			}
		});
	}

	function setSelectedDocumentContacts(){
		/*if($('#truckerArolId').val() != null && 
				$('#truckerArolId').val().trim() != "" && 
				$('#truckerArolId').val().trim() != "0")
		{*/
			$('#selectedContacts').val("");
			var rowIDs = jQuery("#contactGrid").getDataIDs(); 
			var selection = "";
			for (var i=0;i<rowIDs.length;i=i+1)
			{ 
				var id = $('#contactGrid').getCell(rowIDs[i], 'id');
				var value= $('#contactGrid').getCell(rowIDs[i], 'valueGrid');
				var isSelected =$('#jqg_contactGrid_'+id).attr("checked");
				if(isSelected=="checked")
				{
				selection = selection+value+"|";
				}
			}
			$('#selectedContacts').val(selection);
		//} commented incase trucker arole is null and user add a new contact in grid.
	}

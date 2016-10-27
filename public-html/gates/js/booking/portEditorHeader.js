var domesticForeignIndicator = "none";
var shipNo=0;
var POV_NAME = "PERSONAL AUTO";
var ALASKA_POV_NAME = "ALASKA AUTO";

$(function() {

	//defect - D019763 [Autocomplete visible on wrong place due to window re-size
	$(window).resize(function() {
		$('.ui-autocomplete').hide();
		changePosOfDialog('billBookingDialog', 'center');
	});

	var assignOrCreate="";
	$('#bookingForm').validationEngine('attach');

	setDefaultForBookingStatus();
	setDefaultForAssignLink();
	disableCreateBookingFromQuote();

	//Display existing booking
	//Booking# Predictive Search
	
	$('#shipmentNumber').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Booking Number",
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  function() { return $('#bookingTypeCode').val(); }
	 	},
		minLength: 7,
		formatItem: function(data) {
			shipNo=0;
			shipNo=data.shno;
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			if(null != data && null != data.shno){
				if(data.shno.indexOf('T')<0){
				//D026018
					if(isBookingChanged == 'Y'){
						var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
						if (isConfirm) {
							showLoadingMessage();
							$('#shipmentNumber').val(data.shno);
							$('#shipmentNumberHidden').val($('#shipmentNumber').val());
							if($('#bookingTypeCode').val()=='B'){
								$('.ui-autocomplete').hide();
								displayBooking();
								$('#displayingBookingEvent').val("Y");
							}
						} else {
							$('#shipmentNumber').val(oldBkNbr);
						}
					} else {
						showLoadingMessage();
						$('#shipmentNumber').val(data.shno);
						$('#shipmentNumberHidden').val($('#shipmentNumber').val());
						if($('#bookingTypeCode').val()=='B'){
							$('.ui-autocomplete').hide();
							displayBooking();
							$('#displayingBookingEvent').val("Y");
						}
					}
				}else if(data.shno.indexOf('T')>=0){
					showLoadingMessage();
					$('#shipmentNumber').val(data.shno);
					$('#shipmentNumberHidden').val($('#shipmentNumber').val());
					if($('#bookingTypeCode').val()=='T'){
						$('.ui-autocomplete').hide();
						displayTemplate($('#shipmentNumber').val());
						$('#displayingTemplateEvent').val("Y");
					}
				}
			}
		}
	});
	
	$('#shipmentNumber').keydown(function(evt) { 
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '13'){
			  checksBeforeDisplayBooking();
		  }
	}); 
	
	$('#shipmentNumber').change(function(evt) { 
		  checksBeforeDisplayBooking();
	}); 
	
	$('#containerNumber').bind('keydown',function(event) {
		// keyCode for enter key is 13
		if (event.keyCode == 13 ) {
			$("#containerNumber").val(($("#containerNumber").val()).toUpperCase()); 
			getBookingForContainer();
		}
	});		
	
	$('#containerNumber').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: 'Container Number',
	 	extraParams: {
	 		method: 'searchContainer',
		 		 searchType: '288',
	 	},
		minLength: 10,
		formatItem: function(data) {
			return data.contNo.trim();
		},
		formatResult: function(data) {
			return data.contNo.trim();
		}, 
		select: function(data) {
			$("#containerNumber").val(($("#containerNumber").val().trim()).toUpperCase());
			getBookingForContainer();
		}
	});
	

	//D031169: 	Priority Stow to have a new selection list only for Alaska
	$("#stowSelect").change(function(){
		var rows = $('#equipmentGrid').jqGrid('getDataIDs');
		var selectedStow = $('#stowSelect :selected').val()
		for(var index=0;index<rows.length;index++) {
			var charArray = $("#"+rows[index]+"_characteristics").val().split(", ");
			var newChar = "";
			for (var i = 0; i < charArray.length; i++) {
				if (!$.trim(charArray[i]).match("STOW")) {
					if(newChar == ""){
						newChar = charArray[i];
					} else {
						newChar = newChar + ", " + charArray[i];
					}
				}
			}
			if(selectedStow != ""){
				if(newChar == ""){
					newChar = selectedStow;
				} else {
					newChar = newChar + ", " + selectedStow;
				}	
			}
			$("#"+rows[index]+"_characteristics").val(newChar);
		}
	});
	
	// validate address roles based on trade
	$('#bookingStatusCode').change(function() {
		checkIfTemplateToBeDisabled();
		isBookingDeletable();
		if($('#bookingStatusCode').val()!=''){
			var valid = validateBookingStatusForActor();
			if(valid == true){
				$('#msgDiv').html("");
				$('#msgDiv').hide();
				//validateBookingStatusForActorOnServer();
			}else{
				$('#msgDiv').html("<div class=\"message_error\">New booking status not valid for previous status.</div>");
				$('#msgDiv').show();
				window.scrollTo(0, 0);
				triggerErrorMessageAlert();
			}
		}
	});


});

function getBookingForContainer(){
	blockUI();
	var containerNumber = $('#containerNumber').val();
	equipId = containerNumber;
	if(containerNumber != undefined &&  containerNumber != ''){
		$.ajax({
			type : "POST",
			url : _context +"/booking/header/getBookingForContainer",
			data : {
				containerNumber : containerNumber
			},
			success : function(responseText) {
				$("#shipmentNumber").val(responseText.data);
				$.unblockUI();
				checksBeforeDisplayBooking();
			}
		});
	}
}

function checksBeforeDisplayBooking(){
	if($('#shipmentNumber').val()!='' && $('#shipmentNumber').val().length==7)
	{
		if($('#bookingTypeCode').val() =='B'){
			if($('#shipmentNumber').val().toUpperCase().indexOf('T')>=0)
			{
				$('#msgDiv').html('<div class="message_error">'+'Booking not found..'+'</div>');
				$('#shipmentNumberHidden').val("");
				window.scrollTo(0, 0);
				//triggerErrorMessageAlert();
			}
			else
			{
			//D026018
				if(isBookingChanged == 'Y'){
					var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
					if (isConfirm) {
						showLoadingMessage();
						if(shipNo!=$('#shipmentNumber').val()){
							shipNo=$('#shipmentNumber').val();
						}
						$('#shipmentNumber').val(shipNo);
						shipNo=0;
						$('#shipmentNumberHidden').val($('#shipmentNumber').val());
						$('.ui-autocomplete').hide();
						displayBooking();
						$('#displayingBookingEvent').val("Y");
					} else {
						$('#shipmentNumber').val(oldBkNbr);
					}
				} else {
					showLoadingMessage();
					if(shipNo!=$('#shipmentNumber').val()){
						shipNo=$('#shipmentNumber').val();
					}
					$('#shipmentNumber').val(shipNo);
					shipNo=0;
					$('#shipmentNumberHidden').val($('#shipmentNumber').val());
					$('.ui-autocomplete').hide();
					displayBooking();
					$('#displayingBookingEvent').val("Y");
				}
			}
		  }else{
			  if($('#bookingTypeCode').val()=='T' && $('#shipmentNumber').val().toUpperCase().indexOf('T')>=0){
				  $('#shipmentNumber').val($('#shipmentNumber').val().toUpperCase());
				  showLoadingMessage();
				if(shipNo!=$('#shipmentNumber').val()){
					shipNo=$('#shipmentNumber').val();
				}
				$('#shipmentNumber').val(shipNo);
				shipNo=0;
				$('#shipmentNumberHidden').val($('#shipmentNumber').val());
				$('.ui-autocomplete').hide();
				displayTemplate($('#shipmentNumber').val());
				$('#displayingTemplateEvent').val("Y");
			  }else{
				$('#msgDiv').html('<div class="message_error">'+'Template not found..'+'</div>');
				$('#shipmentNumberHidden').val("");
				window.scrollTo(0, 0);
				//triggerErrorMessageAlert();
			  }
		  }
		  
			
	}
	//change D024687
	else
		{
		if($('#bookingTypeCode').val()=='T')
			{
				$('#msgDiv').html('<div class="message_error">'+'Template not found..'+'</div>');
				$('#shipmentNumberHidden').val("");
				window.scrollTo(0, 0);
			
		  }else{
			$('#msgDiv').html('<div class="message_error">'+'Booking not found..'+'</div>');
			$('#shipmentNumberHidden').val("");
			window.scrollTo(0, 0);
			//triggerErrorMessageAlert();
		  }
		
		}
}

function applyQuoteCommonCode(data){
	//$('#bookingForm').clearForm();
	//resetDefault();
	if(data!=''){
		$('#quoteNumber').val(data.number);
		$('#quoteId').val(data.id);
		$('#quoteVersion').val(data.version.substr(1,4));
		$('#quoteVNConcat').val(data.number);//+'.'+data.version);
	}
	getQuote('');
}

function cleanHeader(){
	setDefaultForAssignLink();
	setDefaultForBookingStatus();
	disableCreateBookingFromQuote();
}
function setDefaultForBookingStatus(){
	//if($("#shipmentNumber").val() == '' || $("#shipmentNumber").val() == null){
	if($("#bookingId").val() == '' || $("#bookingId").val() == null){
		$("#bookingStatusCode").attr("disabled",true);
	}else{
		$("#bookingStatusCode").attr("disabled",false);
	}
}

function setDefaultForAssignLink(){
	if($("#shipmentNumber").val() == '' || $("#shipmentNumber").val() == null /*|| $("#shipmentNumber").val()==$('#quoteNumber').val()*/){
		$('#assignLink').html("Assign Quote");
	}else{
		if(/*$('#quoteId').val()=='' || */$('#quoteNumber').val() ==''){
			$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
		}
		else{
			$('#assignLink').html("<a href=\"javascript:removeAssignQuote();\">Remove Quote</a>");
		}
	}
}


function quotePopupSearch(data){
	assignOrCreate = data;
	var actionUrl = null;
	
	actionUrl = _context + '/cas/quoteLookup.do?bkFilters='+prepareInputForCASTemplateScreen() ;
	
/*	if(data=='create')
		actionUrl = actionUrl+'&quoteNo='+$('#quoteVNConcat').val();
	else 
		actionUrl = actionUrl+'&quoteNo='+$('#quoteVNConcat').val();*/
	actionUrl = actionUrl+'&quoteNo='+$('#quoteVNConcat').val();
	actionUrl = actionUrl + "&data=" + data;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function loadHazMat(url){
	
	var actionUrl = url+'?bookingNumber='+$('#shipmentNumber').val() ;
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function loadGems(url){
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(url, '', windowStyle);
}

function removeAssignQuote(){
	isBookingChanged = "Y";
	$('#quoteNumber').val("");
//	$('#quoteId').val("");
	$('#quoteVersion').val("");
	$('#quoteNumberLabel').text("");
	$('#quoteAmount').val("");
	$('#quoteAmountDiv').text("");
	$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
}

function validateBookingStatusForActor(){
	var savedBKNGStatus = $('#savedBookingStatusCode').val();
	var requestedBKNGStatus = $('#bookingStatusCode').val();
	var valid = false;

	//only booking created from quote can be cancelled
	//commented after defect - > [D016083]
	/*
	if(requestedBKNGStatus=='CANC' && (($('#shipmentNumber').val() != $('#quoteNumber').val()))){
		$('#bookingStatusCode').val(savedBKNGStatus);
		return false;
	}
	//CANC to INCP
	if(requestedBKNGStatus=='INCP' && (($('#shipmentNumber').val() == $('#quoteNumber').val()))){
		return true;
	}
	*/
	
	if(savedBKNGStatus!=''){
		switch(savedBKNGStatus){
		case 'INCP':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
			}
			break;
		case 'PEND':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
				case 'APPR':
					return true;
				case 'OFFR':
					return true;
			}
			break;
		case 'APPR':
			switch(requestedBKNGStatus){
			case 'CANC':
				return true;
			case 'OFFR':
				return true;
			}
			break;
		case 'OFFR':
			switch(requestedBKNGStatus){
				case 'CANC':
					return true;
				case 'APPR':
					return true;
			}
			break;
		case 'CANC':
			switch(requestedBKNGStatus){
				case 'APPR':
					return true;
			}
			break;
		case 'ASGN':
			break;
		}
	}else{
		return true;
	}

	if(valid==false)
		$('#bookingStatusCode').val(savedBKNGStatus);
	return valid;

}

function checkIfTemplateToBeDisabled(){
	/*var aHtml = "";
	if($('#bookingStatusCode').val()=='APPR' || $('#bookingStatusCode').val()=='OFFR'){
		aHtml = ""
			+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images//search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
			+"";
	}else{
		aHtml = ""
			+"<a href=\"javascript:templatePopupSearch();\">"
			+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images/search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
			+"</a>"
			+"";
	}
	$('#templateDiv').html(aHtml);*/
}

function validateBookingStatusForActorOnServer(){
	/*if($('#bookingStatusCode').val()=='CANC'){
		var overRide = confirm("Do you really want to Cancel the "+ $('#shipmentNumberHidden').val() +" booking? (Y/N)");
		if(overRide == true){
			validateStatusOnServer();
		}else{
			$('#bookingStatusCode').val($('#savedBookingStatusCode').val());
		}
	}else{*/
		validateStatusOnServer();
	//}
}

function validateStatusOnServer(){
	var queryString = $('#bookingForm').formSerialize();
	$.ajax({
		type : "POST",
		url : _context +"/booking/header/status",
		data : queryString + "&requestedBookingStatus="+ $('#bookingStatusCode').val(),
		success : function(responseText) {
			showResponseMessages("msgDiv",responseText);
			
		}
	});
}

function getTemplateNumberForId(){/*
	var templateId = $('#bookingTemplateId').val();
	if(templateId != undefined &&  $('#bookingTemplateId').val()!=''){
		$.ajax({
			type : "POST",
			url : _context +"/booking/header/getTemplateNumber",
			data : {
				templateId : templateId
			},
			success : function(responseText) {
				//$("#bookingTemplateNumber").text(responseText.data);
				$("#bookingTemplateNumber").html("<a href="+_context +"/booking/template/showTemplateForm?templateNumber=" +responseText.data+" style=\"color: blue\">"+ responseText.data +"</a>");
			}
		});
	}
*/}

function templatePopupSearch(){
	var ediText = $('#ediOrWebIndicator').html();
	if(ediText == null) edeiText = "";
	if(ediText.indexOf("EDI") > -1) {
		otherAlert("","Apply template on Edi Booking Details.");
	} else {
		var actionUrl = _context + '/cas/templateSearch.do?templateValue1='+prepareInputForCASTemplateScreen();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'Template Search', windowStyle);
	}
}

function getQuote(id){
	var quoteNumberForRetain = $('#quoteVNConcat').val();
	var quoteId = '' ;
	if(id!='' && id.indexOf("=")>0){
		quoteId = id.split('=')[1];
		$("#quoteShowDialog").dialog('close');
	}else{
		quoteId = $('#quoteId').val();
		if(quoteId == null || quoteId == ''){
			quoteId = id;
		}
	}
	showQuoteLoadingMessage();
	$.ajax({
		type: "POST",
		url: _context +"/booking/applyQuote",
		data: {
			quoteId : quoteId,
			quoteNumber : $('#quoteVNConcat').val()
		},
		success: function(responseText){
			$('#bookingForm').clearForm();
			resetDefault();
			resetDivNames();
			if (responseText.messages.error.length == 0) {
				//clearAndResetBookingScreen();
				$('input[name="shipper\\.addressRoleId"]').val("");
				$('input[name="consignee\\.addressRoleId"]').val("");
				emptyContactDetails("shipper");
				emptyContactDetails("consignee");
				//resetDefault();
				//resetDivNames();
				$('#quoteIsLoadedOnScreen').val('Y');
				$('#bookingTemplateNumber').val("");
				$('#bookingTemplateId').val("");
				var aHtml = ""
					+"<a href=\"javascript:templatePopupSearch();\">"
					+"<div id=\"bookingTemplateNumber\" class=\"span-2 last\"></div><img id=\"templateSearch\" src=\""+_context+"/resources/images/search.png\" border=\"0\" style=\"vertical-align: text-bottom; cursor: pointer;\" name=\"popupSearchtemplateSearch\" alt=\"Search\"/>"
					+"</a>"
					+"";
				$('#templateDiv').html(aHtml);
				showJSON(responseText);
				if(responseText.data.shipper.addressRoleId != null){
					$('#prepaidCollectCode').attr('selectedIndex', 1);
				}else
					$('#prepaidCollectCode').attr('selectedIndex', 2);
				//Grid reload calls
				$('#prepaidCollectCode').trigger('change');
				reloadBookingGrids();
				processChangeSource();
				
				if(null != responseText.data.freight)
					populateCommodityCodeList(responseText.data.freight.commodityCodeList);
				//requestForContactList("shipper");
				/*if(responseText.data.shipper.contactId!=null && responseText.data.shipper.contactId!='')
					$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
				else if(responseText.data.consignee.contactId!=null && responseText.data.consignee.contactId!='')
					$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);*/

				setDefaultForBookingStatus();
				$('#bookingSave').attr("disabled",false);
				if(null != responseText.data.shipper && responseText.data.shipper.contactId!=null && responseText.data.shipper.contactId!=''){
					$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
					setShipperCommMethodValue(responseText.data.shipper);
				}else if(null != responseText.data.consignee && responseText.data.consignee.contactId!=null && responseText.data.consignee.contactId!=''){
					$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
					setConsigneeCommMethodValue(responseText.data.consignee);
				}
				//getContactListOnQuotePull('shipper');
				//getContactListOnQuotePull('consignee');
				
				/*if(addFreightEnabled()){
					showFreight($.trim($('#customerGroupId :selected').text()));
					$($('.booking-section')[4]).accordion("enable");
					$($('.booking-section')[4]).accordion('option', 'active', 0);
				}*/
				
				//D026348 : Get description if it is blank and Item numbe exists
				if($.trim($("tariffCommodityDescription").val()) == '' && $.trim($('#tariffItemNumber').val())!=''){
					getPrimaryCommodity($('#tariff').val(), $('#tariffItemNumber').val());
				}
				
				$('#isAutobill').val('true');
				$('#autobillOptionCode').attr('disabled', false);
				$('#autobillTriggerCode').attr('disabled', false);
				isBookingChanged = "Y";
				isTemplateFirstLoad = false;
				expandAll();
				
			}
			else
				$('#quoteIsLoadedOnScreen').val('');
			//Messages
			setTimeout(function(){
				showResponseMessages("msgDiv",responseText);
				var quoteNumber = $('#quoteNumberLabel').text().split("-")[0].split("-")[0];
				$('#quoteVNConcat').val(quoteNumber);
				//hideEquipmentInlineEditDelete();
			}, 1000);
			$('#quoteVNConcat').val(quoteNumberForRetain);
		}
	});
}

function getContactListOnQuotePull(source, responseText){
	if($('input[name="'+source+'\\.addressRoleId"]').val() != "")
	{
		$.ajax({
			type : "POST",
			url : _context +"/booking/arole/getContactList",
			data : {
				addressRoleId : $('input[name="'+source+'\\.addressRoleId"]').val()
			},
			success : function(responseText) {
				$('select[name="'+source+'\\.contactId"]').children().remove();
				$('select[name="'+source+'\\.contactId"]').append("<option val='0' label='Select'></option>");
				$.each(responseText.data.contactList, function(key,
						value) {
					$('select[name="'+source+'\\.contactId"]')
							.append($("<option/>", {
								value : key,
								text : value
							}));
					if(source == 'shipper' && responseText.data.shipper.contactId!=null && responseText.data.shipper.contactId!='')
					{
						$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
						requestForContactDetails(source);
					}
					else if(source == 'consignee' && responseText.data.consignee.contactId!=null && responseText.data.consignee.contactId!='')
					{
						$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
						requestForContactDetails(source);
					}
				});
				if(source == 'shipper' && responseText.data.shipper.contactId!=null && responseText.data.shipper.contactId!='')
				{
					$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
				}else{
					$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
				}
			}
		});
	}
}

function validateBookingTrade(){
	var tradeCode = $('#tradeCode').val();
	var shipperAroleId = $('input[name="shipper\\.addressRoleId"]').val();
	var consigneeAroleId = $('input[name="consignee\\.addressRoleId"]').val();
	var pol = $('#originPortCityCode').val();
	var pod = $('#destinationPortCityCode').val();
	if((shipperAroleId == null || shipperAroleId=='') && (consigneeAroleId == null || consigneeAroleId=='') 
			&& (pol == null || pol == '') && (pod == null || pod == '')){
		return;
	}
	$.ajax({
		type : "POST",
		url : _context +"/booking/header/trade",
		data : {
			tradeCode : tradeCode,
			shipperAroleId : shipperAroleId,
			consigneeAroleId : consigneeAroleId,
			pol : pol,
			pod : pod
		},
		success : function(responseText) {
			showResponseMessages("msgDiv",responseText);
		}
	});
}

function removePopUps(){
	$("#bookingForm").validationEngine('hideAll');
}

function getBooking(){
	$.ajax({
		type: "POST",
		url: _context +"/booking/display",
		data: {bookingNumber: $("#shipmentNumber").val()},
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
				/*
				 * [ Grid reload calls ]
				 * */
				//Parties Grid
				$("#gridIdForParties").trigger('reloadGrid');
				// Reference Number grid
				$("#referenceNumberGrid").trigger('reloadGrid');
				// DODAAC
				$("#dodaacGrid").trigger('reloadGrid');
				//getTemplateNumberForId();
				checkIfTemplateToBeDisabled();
	
				if ((responseText.data.header.shipmentNumber != "")
						&& (responseText.data.header.shipmentNumber != null))
					$('#customizeNameAddress').removeAttr("disabled");
			}
			//Messages
			showResponseMessages("msgDiv",responseText);
			$('#commentsDiv').show();
		}
	});
}

function showQuoteLoadingMessage(){
	$('#msgDiv').html("<div class=\"message_info\">Loading quote "+ $('#quoteVNConcat').val() +" ...</div>");
	$('#msgDiv').show();
}

function changePosOfDialog(dialogName, pos){
	$("#"+ dialogName +"").dialog({ position: pos });
}

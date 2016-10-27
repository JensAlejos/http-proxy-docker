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
	$('#quoteVNConcat').bind('keypress', function(event){
		if(event.keyCode == 13 || event.keyCode == 9) {
			$('#quoteId').val("");
			if($('#bookingTemplateId').val()!=''){
				var overRide = confirm("Quote Data will overlay Template Data, please confirm. Continue (Ok/Cancel)?");
				if(overRide == true){
					$('#bookingForm').clearForm();
					$('#quoteVNConcatHidden').val($('#quoteVNConcat').val());
					resetDefault();
					applyQuoteCommonCode('');
				}else{
					$('#quoteVNConcatHidden').val($('#quoteVNConcat').val());
					//$('#quoteVNConcatHidden').val("");
					//$('#quoteVNConcat').val("");
				}
			}else{
				applyQuoteCommonCode('');
			}
		}
    });

	//Booking# Predictive Search
	//var url =	_context+'/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch='+$('#bookingTypeCode').val();
	
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
	//D034039: Partial Booking number not retaining when moving from GATES, does not clear the booking number regardless of the browser version
	var isshipmentNumberChanged = false;
	$('#shipmentNumber').change(function(evt) {
		isshipmentNumberChanged = true;
		if(document.hasFocus()){
			checksBeforeDisplayBooking();
			isshipmentNumberChanged = false;
		}
	}); 
	
	$('#shipmentNumber').blur(function(evt) { 
		if(document.hasFocus() && isshipmentNumberChanged){
			checksBeforeDisplayBooking();
			isshipmentNumberChanged = false;
		} 
	});
	
	//var url =	_context+'/cas/autocomplete.do?method=searchQuoteNumberBK&searchType=232';
	$('#quoteVNConcat').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Quote Number",
	 	extraParams: {
		 		 method: 'searchQuoteNumberBK',
		 		 searchType: '232'
	 	},
		minLength: 7,
		formatItem: function(data) {
			$('#quoteId').val("");
			return data.number+"-"+data.version;
		},
		formatResult: function(data) {
			$('#quoteId').val("");
			return data.number+"-"+data.version;
		},
		select: function(data) {
			$('#quoteId').val("");
			if($('#bookingTemplateId').val()!=''){
				var overRide = confirm("Quote Data will overlay Template Data, please confirm. Continue (Ok/Cancel)?");
				if(overRide == true){
					applyQuoteCommonCode(data);
				}else{
					$('#quoteVNConcatHidden').val("");
					$('#quoteVNConcat').val("");
				}
			}else{
				applyQuoteCommonCode(data);
			}
		},
		mustMatch:true,
		noMatchHandler: function() {				
			$('#quoteVNConcat').validationEngine('showPrompt', 'Quote is expired/Booked or Does not exist', 'error', true);
			$('#quoteVNConcatHidden').val("");
			$('#quoteVNConcat').val("");
		} 
	});	
	
	// validate address roles based on trade
	$('#tradeCode').change(function() {
		var previousTradeCode = $('#previousTradeCode').val();
		var tradeCode = $('#tradeCode :selected').val();
		var id = $(this).attr("id");
		//D031125: 	Implement design for KFF Temperature and Dual Temperature Refers for the Alaska trade
		if((previousTradeCode!='A' && tradeCode=='A') || (previousTradeCode=='A' && tradeCode!='A')){
			//D031169: 	Priority Stow to have a new selection list only for Alaska
			if(tradeCode == 'A'){
				$("#stowSelect").show();
				setStowDataForAlaska();
			} else{
				$("#stowSelect").hide();
			}
			$('#equipmentGrid').trigger("reloadGrid");
		}
		if(previousTradeCode=='' && tradeCode!=''){
			$('#previousTradeCode').val($('#tradeCode').val());
			/*var xCoordinate = window.pageXOffset;
			var yCoordinate = window.pageYOffset;*/
			enableDisableCommodityIfTradeCustGrpLDGrpPresent();
			setTimeout(function(){
				   $('#'+id).focus();
				//   window.scrollTo(xCoordinate, yCoordinate);
			}, 1000);
		}
		else if((previousTradeCode!='G' && tradeCode=='G') || (previousTradeCode!='F' && tradeCode=='F')){
			if(validateEquipmentOnTradeAndPODChange(true)){
				$('#previousTradeCode').val($('#tradeCode').val());
			}
			else{
				$('#tradeCode').val($('#previousTradeCode').val());
				return;
			}
		}
		else if(previousTradeCode!='' && tradeCode==''){
			if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0')
			{
				var r = confirm("Trade has been reset to none. Delete commodities?");
				if(r){
					removeCommodities();
					collapseSection(4);
					disableAccordian(4);
					$('#previousTradeCode').val($('#tradeCode').val());
				}
				else{
					$('#tradeCode').val($('#previousTradeCode').val());
				}
			}
			else
			{
				$('#previousTradeCode').val($('#tradeCode').val());
				/*var xCoordinate = window.pageXOffset;
				var yCoordinate = window.pageYOffset;*/
				enableDisableCommodityIfTradeCustGrpLDGrpPresent();
				setTimeout(function(){
					  // window.scrollTo(xCoordinate, yCoordinate);
					   $('#'+id).focus();
				}, 1000);
			}
		}
		else{
			$('#previousTradeCode').val($('#tradeCode').val());
		}
		
		if(tradeCode!=''){
			validateBookingTrade();
		}
				
		setDomesticForeignIndicator();
		//Measurement Unit Change Function moved to 
		//after setting domestic Foreign Indicator
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

	$('#customerGroupId').change(function(){
		var lastCustomerGroup = $('#customerGroupId option[value='+$('#lastCustomerGroupId').val()+']').text();
		var currentCustomerGroup = $('#customerGroupId option[value='+$('#customerGroupId').val()+']').text();
		var lastLoadDschGroup = $.trim($('#lastLoadDschServiceGroupCode').val());
		var currentLoadDschGroup = $.trim($('#loadDschServiceGroupCode').val());
		
		modifyFrtOnCstmrGrpLoadDschGrpCodeChange('customerGroup', lastCustomerGroup, currentCustomerGroup, lastLoadDschGroup, currentLoadDschGroup, $('#isAllowBookingUnit').val());
		
		if($('#customerGroupId option:selected').text()!="COMMERCIAL AUTO GROUP" && 
				$('#isAutoInlandMove :selected').val()=="true")
		{
			$('#msgDiv').html('<div class="message_error">'+'AutoInland Flag cannot be true as Customer Group is not Commercial Auto Group'+'</div>');
			window.scroll(0, 0);
			triggerErrorMessageAlert();
		}
		else
			$('#msgDiv').html('');
	
		$("#specialServiceGrid").trigger("reloadGrid");
		
		setMandatoryPieces();
		if($.trim($('#loadDschServiceGroupCode').val())=="AU" && ($('#customerGroupId :selected').text()==POV_NAME|| $('#customerGroupId :selected').text()==ALASKA_POV_NAME) ){
			$("#gridIdForParties").trigger("reloadGrid");
		} else {
			$('#isRequirePrePayment').val(false);
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

	/*$('#quoteVNConcat').change(function() {
		if($('#quoteVNConcatHidden').val()!=$('#quoteVNConcat').val()){
			$('#quoteVNConcat').val("");
		}
	});*/

});

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
		  
			/*if($('#shipmentNumber').val().indexOf('T')<0){
				if($('#bookingTypeCode').val()=='B'){
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
			}else if($('#shipmentNumber').val().indexOf('T')>=0){
				if($('#bookingTypeCode').val()=='T'){
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
				}
			}*/
	}
	//change D024687
	else
		{
		if($('#bookingTypeCode').val()=='T')
			{
				$('#msgDiv').html('<div class="message_error">'+'Template not found..'+'</div>');
				$('#shipmentNumberHidden').val("");
				tempShipperAddress='';
				tempConsigneeAddress='';
				tempPartyTypeCode="";
				clearBookingDataOnClearBtnClick();
				window.scrollTo(0, 0);
			
		  }else{
			$('#msgDiv').html('<div class="message_error">'+'Booking not found..'+'</div>');
			$('#shipmentNumberHidden').val("");
			tempShipperAddress='';
			tempConsigneeAddress='';
			tempPartyTypeCode="";
			clearBookingDataOnClearBtnClick();
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
//assign quote
function quoteUpdate(id){
	if(assignOrCreate=='create'){
		var values = id.split("|");
		$('#quoteId').val(values[0]);
		if($('#bookingTemplateId').val()!=''){
			var overRide = confirm("Quote Data will overlay Template Data, please confirm. Continue (Ok/Cancel)?");
			if(overRide == true){
				getQuote(values[0]);
				isBookingChanged = "Y";
			}else{
				$('#quoteVNConcatHidden').val("");
				$('#quoteVNConcat').val("");
			}
		}else{
			getQuote(values[0]);
			isBookingChanged = "Y";
		}
	}else{
		if(id!=''){
			isBookingChanged = "Y";
			//assign quote [copy quote num/version/amount]
			var values = id.split("|");
			//hidden
			//$('#quoteId').val(values[0]);
			$('#quoteNumber').val(values[1]);
			$('#quoteVersion').val(values[2]);
			$('#quoteNumberLabel').html("<a style=\"color: blue\" href= " + _context + "/quote/getQuote?quoteId="+ $('#quoteId').val()+">"+values[1] + "-" +values[2]+"</a>");
			$('#quoteAmount').val(values[3]);
			$('#quoteAmountDiv').text('$'+values[3]);

			$('#assignLink').html("<a href=\"javascript:removeAssignQuote();\">Remove Quote</a>");
		}else{
			$('#assignLink').html("<a href=\"javascript:quotePopupSearch('assign');\">Assign Quote</a>");
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
	if(ediText == null) ediText = "";
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
				//$('#autobillOptionCode').attr('disabled', false);
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

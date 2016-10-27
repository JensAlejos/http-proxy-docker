var count =0;
var isRoutingModifiable=true;	// added to open VVD lookup on edit Shipper/consignee section
$(document).ready(function () {
	$('#totalWeight').bind('paste',function(event) {
		if($("#unitOfMeasureSourceCode").val()=="I") {
			setTimeout(function() {
			
			var a=$('#totalWeight').val().indexOf(".");
			 if(a>=0) {
			  var finalValue=$('#totalWeight').val().substring(0,a);
			  $('#totalWeight').val(finalValue);
			}
			 if(isNaN($('#totalWeight').val())) {
					$('#totalWeight').val('');
				}
			},100);
		}
		else {
			setTimeout(function() {
				
				var firstIndex=$('#totalWeight').val().indexOf(".");
				var lastIndex=$('#totalWeight').val().lastIndexOf(".");
				 if(firstIndex>=0 && (firstIndex!=lastIndex)) {
					 var secondString=$('#totalWeight').val().substring(firstIndex+1,$('#totalWeight').val().length);
					 var finalIndex=secondString.indexOf(".");
					 $('#totalWeight').val( $('#totalWeight').val().substring(0,firstIndex+finalIndex+1));
				}
				 if(isNaN($('#totalWeight').val())) {
						$('#totalWeight').val('');
					}
				},100);
		}
		}).keypress(function(event) {
			if((event.which>=48 && event.which<=57) || event.which==46) {
				if($("#unitOfMeasureSourceCode").val()=="I") {
					if(event.which==46) {
					 event.preventDefault();
					}
				}
				else {
					if(event.which==46) {
						var a=$('#totalWeight').val().indexOf(".");
						if(a>=0) {
							 event.preventDefault();
							}
					}
				}
			}
			else {
				event.preventDefault();
			}
		}).focus(function (event){	
			if($("#unitOfMeasureSourceCode").val()=="I") {
				$("#totalWeight").removeClass('custom[max[9999999.999]]]');
				$("#totalWeight").removeClass('custom[min[0000000.001]]]');
				$("#totalWeight").addClass('custom[max[9999999]]]');
				$("#totalWeight").addClass('custom[min[0000000]]]');
				$("#totalWeight").attr('maxlength',7);
			}
			else {
				$("#totalWeight").removeClass('custom[max[9999999]]]');
				$("#totalWeight").removeClass('custom[min[0000000]]]');
				$("#totalWeight").addClass('custom[max[9999999.999]]]');
				$("#totalWeight").addClass('custom[min[0000000.001]]]');
				$("#totalWeight").attr('maxlength',11);
			}
		
		});
	$('#totalCube').bind('paste',function(event) {
		if($("#unitOfMeasureSourceCode").val()=="I") {
		setTimeout(function() {
		var a=$('#totalCube').val().indexOf(".");
		 if(a>=0) {
		  var finalValue=$('#totalCube').val().substring(0,a);
		  $('#totalCube').val(finalValue);
		}
		 if(isNaN($('#totalCube').val())) {
				$('#totalCube').val('');
			}
		},100);
		}
		else {
			setTimeout(function() {
				
				var firstIndex=$('#totalCube').val().indexOf(".");
				var lastIndex=$('#totalCube').val().lastIndexOf(".");
				 if(firstIndex>=0 && (firstIndex!=lastIndex)) {
					 var secondString=$('#totalCube').val().substring(firstIndex+1,$('#totalCube').val().length);
					 var finalIndex=secondString.indexOf(".");
					 $('#totalCube').val( $('#totalCube').val().substring(0,firstIndex+finalIndex+1));
				}
				 if(isNaN($('#totalCube').val())) {
						$('#totalCube').val('');
					}
				},100);
		}
		}).keypress(function(event) {
			if((event.which>=48 && event.which<=57) || event.which==46) {
				if($("#unitOfMeasureSourceCode").val()=="I") {
					if(event.which==46) {
					 event.preventDefault();
					}
				}
				else {
					if(event.which==46) {
						var a=$('#totalCube').val().indexOf(".");
						if(a>=0) {
							 event.preventDefault();
							}
					}
				}
			}
			else {
				event.preventDefault();
			}
		});
	
		
	createCommodityHHGSGrid();
	createSpecialServiceHHGSGrid();
	createClauseHHGSGrid();
	
	
$('#shipmentNumber').focus();
$('#shipmentHouseHoldForm').validationEngine('attach');

	$('#totalWeight').change(function(){
		commodityHHGSLoadComplete();
	});

	$('#totalCube').change(function(){
		commodityHHGSLoadComplete();
	});

	
	$('#rate').click(function(){
		if ($('#commodityHHGS').jqGrid('getDataIDs').length>0){
		if($('#shipmentHouseHoldForm').validationEngine('validate'))
		{
			blockUI();		
			var shipment = $('#shipmentHouseHoldForm').formSerialize();
			
			var saveUrl='';
			saveUrl=_context+'/houseHoldShipment/saveHHGSShipment';
			$.ajax({
				type:"POST",
				url: saveUrl,
				data: shipment,
				success : function(responseText) 
					{
						//$("#shipmentSaveBtn").attr("disabled", false);
						if (responseText.success) {
							clearPageOnLoad();
							$('#shipmentHouseHoldForm').loadJSON(responseText.data);
						 $("#containerListHHGS").editableDropdown("selectOption", {value: responseText.data.equipmentId, text: responseText.data.equipmentId});
							setShipmentCorrectionNumber(responseText);
							populateContainerDetails(responseText);
							setHeaderSectionData(responseText);
							
							setShipperConsigneeEditOverlayData(responseText);
							
							
							setContainerSectionDetails(responseText);
							setShipmentSequenceNumberList();
							setShipmentHold();
							reloadCommodityGrid();
							reloadClauseGrid();
							reloadSpecialServiceGrid();
							
							
						} else {
							//$("#shipmentStatusCode").attr("disabled", true);
						}
						showResponseMessages("msgDiv",responseText);
						$.unblockUI();

						if(responseText.messages.error.length == 0){
						    captureChanges();
						    count = 1;
						    rateBill(count);
						}else{
						    window.scrollTo(0, 0);
						}
					}			
				});	
		}
		}
		else {
			$('#msgDiv').html("<div class=\"message_error\">Householdgoods should have atleast one commodity to rate succesfully</div>");
			window.scrollTo(0, 0);
		}
	});
	
	$('#rate').attr("disabled",true);

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
				 concludeRatingForHHGS(containerArr[i]);
			 }

		}
				
	});
	
	
	makeGridForReError("houseHoldShipment");

	$('#save').click(function(){
		
		if ($('#commodityHHGS').jqGrid('getDataIDs').length>0){
		if($('#shipmentHouseHoldForm').validationEngine('validate'))
			{
		blockUI();		
		showWarningIfAroleChangeAndRefNumberRequiredConsignee();
		var shipment = $('#shipmentHouseHoldForm').formSerialize();
		
		var saveUrl='';
		saveUrl=_context+'/houseHoldShipment/saveHHGSShipment';
		$.ajax({
			type:"POST",
			url: saveUrl,
			data: shipment,
			success : function(responseText) 
				{
					//$("#shipmentSaveBtn").attr("disabled", false);
					if (responseText.success) {
						clearPageOnLoad();
						$('#shipmentHouseHoldForm').loadJSON(responseText.data);
					 $("#containerListHHGS").editableDropdown("selectOption", {value: responseText.data.equipmentId, text: responseText.data.equipmentId});
						setShipmentCorrectionNumber(responseText);
						populateContainerDetails(responseText);
						setHeaderSectionData(responseText);
						
						setShipperConsigneeEditOverlayData(responseText);
						
						setShipmentHold();
						
						setContainerSectionDetails(responseText);
						setShipmentSequenceNumberList();
						reloadCommodityGrid();
						reloadClauseGrid();
						reloadSpecialServiceGrid();
						
					} else {
						if(responseText.data!=null && responseText.data == "Deleted")
							clearPageOnLoad();
						//$("#shipmentStatusCode").attr("disabled", true);
					}
					showResponseMessages("msgDiv",responseText);
					$.unblockUI();
					captureChanges();
				}			
			});	
			}
		}else {
			$('#msgDiv').html("<div class=\"message_error\">Householdgoods should have atleast one commodity to save succesfully</div>");
			window.scrollTo(0, 0);
		}
	});
	
	$('#cancel').click(function(){
		previouspage = document.URL;
		 m=previouspage.lastIndexOf('=');
		 if (m >= 0) {
			 previouspage = previouspage.substring(m + 1);
		 }
		 var s="2";
		 if(s==previouspage){
			 document.location.href = _context+"/shipment/showForm";;
		 }else{
			 document.location.href=_context+'/welcome.html';
		 }
	 });

	$("#shipmentCorrectionsBtn").click(	function() {
		//if(!checkActionValidation()){return; }		
		var shipment_sequence_number = '000';
        if($("#shipmentSeqNumberSpcServ").get(0)!=undefined && $("#shipmentSeqNumberSpcServ").get(0).options[1] != undefined)
                shipment_sequence_number =$("#shipmentSeqNumberSpcServ").get(0).options[1].value;
        if(shipment_sequence_number == null	|| shipment_sequence_number == "" || shipment_sequence_number == "ALL"){
                shipment_sequence_number="000";
        }
        document.location.href = _context+ "/bill/frtcorrection/find?shipmentNumber="
                				+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+shipment_sequence_number+'&shipmentCorrectionNumber=000&source=HHGS';
	});

	$("#shipmentPayablesBtn").click(function() {
		//if(!checkActionValidation()){return; }		
		var shipmentNumberHeader = $("#shipmentNumber").val();		
		var shipment_sequence_number = '000';
        if($("#shipmentSeqNumberSpcServ").get(0)!=undefined && $("#shipmentSeqNumberSpcServ").get(0).options[1] != undefined)
             shipment_sequence_number =$("#shipmentSeqNumberSpcServ").get(0).options[1].value;
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();		
		if(shipment_sequence_number == null	|| shipment_sequence_number == "" || shipment_sequence_number == "ALL"){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}		
		var url = "/billLadingPayable/find?shipmentNumber="+shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=HHGS";
		window.location = _context + url;			
	});
	
	$("#shipmentChargesBtn").click(function() {
		//if(!checkActionValidation()){return; }	
		var shipmentNumberHeader = $("#shipmentNumber").val();		
        var shipment_sequence_number = '000';
        if($("#shipmentSeqNumberSpcServ").get(0)!=undefined && $("#shipmentSeqNumberSpcServ").get(0).options[1] != undefined)
             shipment_sequence_number =$("#shipmentSeqNumberSpcServ").get(0).options[1].value;
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();		
		if(shipment_sequence_number == null	|| shipment_sequence_number == "" || shipment_sequence_number == "ALL"){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}		
			var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
			shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
			"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=HHGS";
			window.location = _context + url;					
	});	
	
	$("#BLSetupBtn").click(function() {
		var shipmentNumberHeader = $("#shipmentNumber").val();
		document.location.href = _context+ "/billingSetup/loadBillSetUpDetail?shipmentNumber="+ shipmentNumberHeader;
	});	
	captureChanges();
});


function clearPageOnLoad() {
	
	$('#shipmentHouseHoldForm').clearForm();
	$('#houseHoldClauseForm').clearForm();
	$('#shipmentHouseHoldBasicDetailForm').clearForm();
	$('#shipmentHouseHoldItemForm').clearForm();
	$('#shipmentHouseHoldSpecialServiceForm').clearForm();
	$('#holdForm').clearForm();
	
	}
function setShipmentNumberDropDown(responseText){
	
	 $("#seq").get(0).options.length = 0;
	 $('#shipmentSeqNumberSpcServ').get(0).options.length = 0;
   $.each(responseText.data.shipmentNumbers, function(index, shipmentNumbers) {
       $("#seq").get(0).options[$("#seq").get(0).options.length] = new Option(shipmentNumbers.description, shipmentNumbers.code);
       $("#shipmentSeqNumberSpcServ").get(0).options[$("#shipmentSeqNumberSpcServ").get(0).options.length] = new Option(shipmentNumbers.description, shipmentNumbers.code);
   });
	
   var seqNumbers = responseText.data.holdClauseForm.clauseHHGSSeqNo; //$("#containerNumberForDispatch").val();
   $("#seq").val(seqNumbers);
   $("#shipmentSeqNumberSpcServ").val(seqNumbers);
   
}

function selectForFormSerialize(radioButtonObj, value) {
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}

function setPartiesHeader()
{
	if($('#prepaidCollectCode :selected').val()!='')
		setAccordianTabDetails('partiesHeader', ' - '+$("#prepaidCollectCode option:selected").text());
	/*else
		setAccordianTabDetails('partiesHeader', 'Parties');*/
}

function setAccordianTabDetails(id, displayText) {
	$("#" + id).text(displayText);
}

function clearAllMessage(){
	$('#msgDiv').html("");
	$('#msgDiv').show();
}

function clearOverlayMessage(){
	$('#msgOverLayDiv').html("");
	$('#msgOverLayDiv').show();
}

function expandAll() {
	$('.ui-accordion-content').attr('style', 'display:block');
}
function collapseAll() {
	$('.ui-accordion-content').attr('style', 'display:none');
}



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
			window.scrollTo(0, 0);
  	}
}

function format_number_long(){
	if($("#unitOfMeasureSourceCode").val()=="M") {
	pnumber = $('#totalWeight').val();
	decimals=3;
	    if (isNaN(pnumber)) { return 0};
	    if (pnumber=='') { return 0};
	     
	    var snum = new String(pnumber);
	    var sec = snum.split('.');
	    var whole = parseFloat(sec[0]);
	    var result = '';
	     
	    if(sec.length > 1){
	        var dec = new String(sec[1]);
	        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
	        dec = String(whole + Math.round(parseFloat(dec))/Math.pow(10,decimals));
	        var dot = dec.indexOf('.');
	        if(dot == -1){
	            dec += '.'; 
	            dot = dec.indexOf('.');
	        }
	        while(dec.length <= dot + decimals) { dec += '0'; }
	        result = dec;
	    } else{
	        var dot;
	        var dec = new String(whole);
	        dec += '.';
	        dot = dec.indexOf('.');     
	        while(dec.length <= dot + decimals) { dec += '0'; }
	        result = dec;
	    }   
	    $('#totalWeight').val(result);
	}
	
}
function format_number_long_Cube(){
	
	if($("#unitOfMeasureSourceCode").val()=="M") {
	pnumber = $('#totalCube').val();
	decimals=3;
	    if (isNaN(pnumber)) { return 0};
	    if (pnumber=='') { return 0};
	     
	    var snum = new String(pnumber);
	    var sec = snum.split('.');
	    var whole = parseFloat(sec[0]);
	    var result = '';
	     
	    if(sec.length > 1){
	        var dec = new String(sec[1]);
	        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
	        dec = String(whole + Math.round(parseFloat(dec))/Math.pow(10,decimals));
	        var dot = dec.indexOf('.');
	        if(dot == -1){
	            dec += '.'; 
	            dot = dec.indexOf('.');
	        }
	        while(dec.length <= dot + decimals) { dec += '0'; }
	        result = dec;
	    } else{
	        var dot;
	        var dec = new String(whole);
	        dec += '.';
	        dot = dec.indexOf('.');     
	        while(dec.length <= dot + decimals) { dec += '0'; }
	        result = dec;
	    }   
	    $('#totalCube').val(result);
	}
	
}

function rateBill(value){
	blockUI();
	var queryString = $("#shipmentHouseHoldForm").formSerialize();
	$.ajax({
		type : "POST",
		url : _context + "/houseHoldShipment/rateBill?count="+value,
		data : queryString,

		success : function(responseText) {
			$.unblockUI();
			 $('#entityVersion').val(responseText.data.entityVersion);
			if(responseText.success==false){
				showResponseMessages("msgDiv", responseText);
				return;
			}
			if(responseText.data != undefined && responseText.data == 'break'){
				
				$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
				var isRated="true";
				setScreenDetails(isRated);
				return;
			}
			if (responseText.messages.error.length == 0) {
				
				if(responseText.data.rateView != null) {
					if(responseText.data.rateView == "showError"){
						$("#shipmentHouseHoldForm").loadJSON(responseText.data);
						loadErrorOverLay(responseText);						
						$('#re_error_dialog').dialog( "open" );
						$("#reErrorGrid").trigger('reloadGrid');
//						reloadShipmentGrids();
//						openHoldsUnreleasedDialog('shipment');
						$("#holdDialog").dialog("close");
					}else if(responseText.data.rateView == "showChoices"){
						$("#shipmentHouseHoldForm").loadJSON(responseText.data);
						loadChoiceOverLay(responseText);
						$('#re_choice_dialog').dialog( "open" );
						$("#reChoiceGrid").trigger('reloadGrid');
					}else if(responseText.data.rateView == "hold"){
						$('#msgDiv').html("<div class=\"message_error\">Hold Applied:"+ 
								responseText.data.holdDesc +" </div>");
//						if(responseText.data.targetPage == "Maintain Bill"){
//							openHoldsUnreleasedDialog('shipment');
//							$("#holdsUnreleased").attr("style","visibilty:visible");
//							$('#holdUnreleasedGrid').trigger('reloadGrid');
//							reloadShipmentGrids();
//							$("#holdDialog").dialog("close");
//						}

//						else{
//							navigateToTargetPage('Maintain Bill',responseText.data.targetPage, 
//									$("#shipmentNumber").val(), $("#shipmentSequenceNumber").val(),$("#shipmentCorrectionmNumber").val(),
//									"Bill");
//							
//						}
						
					}else if(responseText.data.rateView == "exception"){
						$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
						return;
					}
					else if(responseText.data.rateView == "blank"){
						count = count +1;
						rateBill(count);
//						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//						openHoldsUnreleasedDialog('shipment');
					}
					else if(responseText.data.rateView == "Success"){
						$("#statusCode").html(responseText.data.header.statusCode);
						showResponseMessages("msgDiv", responseText);
						count = count +1;
						rateBill(count);
//						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
//						$("#shipmentNumber").val()+'&shipmentSequenceNumber='+$("#shipmentSequenceNumber").val()
//						+'&shipmentCorrectionNumber=000&navigationUrl=1';

					}
				}else{
					showResponseMessages("msgDiv", responseText);
				}
			}
			
		}
	});

}

function concludeRatingForHHGS(id)
{		
	$('#re_choice_dialog').dialog( "close" );
	
	blockUI();
	var url = "";
	
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/houseHoldShipment/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		url = "/houseHoldShipment/concludeRating?id="+id;
	}
	
	$.ajax({
		   type: "POST",				   							   
		   url: _context +  url,
		   success: function(responseText){		
			   $.unblockUI();
			   if (responseText.data.rateView == "showError") {	
				   loadErrorOverLay(responseText);
					$('#re_error_dialog').dialog('open');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
					$("#reErrorGrid").trigger('reloadGrid');
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
				}else if(responseText.data.rateView == "showChoices"){
					loadChoiceOverLay(responseText);
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
					displayResponseMessages("msgDiv", responseText);
				}else if(responseText.data.rateView == "hold"){
					$('#msgDiv').html("<div class=\"message_info\">Hold Applied:"+ 
							responseText.data.holdDesc +" </div>");

				}	
				else if(responseText.data.rateView == "Success"){
					displayResponseMessages("msgDiv", responseText);
					count = count+1;
					rateBill(count);
//					if(responseText.data.shipmentSequenceNumber == null ||
//							responseText.data.shipmentSequenceNumber == "")
//						responseText.data.shipmentSequenceNumber ="000"
//					document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
//					responseText.data.shipmentNumber+'&shipmentSequenceNumber='+responseText.data.shipmentSequenceNumber
//					+'&shipmentCorrectionNumber=000&navigationUrl=1';
				}
				else {
					$('#shipmentForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					displayResponseMessages("msgDiv", responseText);
				}	
			   
		   }
	});	
}
//21575- auto tab
function autotab(event, object)
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
}
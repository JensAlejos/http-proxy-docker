
var isRejectEdiConfirm = false;
$(function() {
	$("#ediShipmentDetailForm").validationEngine('attach');
	
	refreshChecked();
	
	$('#shipmentNumber').change(function(){
		$("#ediShipmentDetailForm").validationEngine('hideAll');
	});
	
	//error generated when there is no shipment number present
	if($('#shipperShipmentNumber').val().trim().length>0){
		if($('#shipmentNumber').val().trim().length==0){
			showShippmentErrorMessage();
			 $('#approveEdiBtnabc').attr("disabled",true);
		     $('#rejectEdiBtn').attr("disabled",true);
		     $('#RevalidateBtn').attr("disabled",true);
		     $('#createEdIBillBtn').attr("disabled",true);
		     $('#Commodity').attr("disabled",true);
		     $('#acceptAllParties').attr("disabled",true);
		}
	}
	//error generated when this is not a current record
	if($('#isCurrentRecord').val().trim()=="N")
		{
		$('#currentRecord').text("");
		showCurrentRecordErrorMessage();
		 $('#approveEdiBtnabc').attr("disabled",true);
	     $('#rejectEdiBtn').attr("disabled",true);
	     $('#RevalidateBtn').attr("disabled",true);
	     $('#createEdIBillBtn').attr("disabled",true);
	     $('#Commodity').attr("disabled",true);
	     $('#acceptAllParties').attr("disabled",true);
		
		}
	//error generated when recordTypeCode equal to "B" or "W"
	if($('#recordTypeCode').val().trim()=="B"||$('#recordTypeCode').val().trim()=="W"){
		showRecordTypeCodeErrorMessage();
		 $('#approveEdiBtnabc').attr("disabled",true);
	     $('#rejectEdiBtn').attr("disabled",true);
	     $('#RevalidateBtn').attr("disabled",true);
	     $('#createEdIBillBtn').attr("disabled",true);
	     $('#Commodity').attr("disabled",true);
	     $('#acceptAllParties').attr("disabled",true);
	}
	
	
	//Shipment# Predictive Search
	var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForEDI&searchType=375'
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
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			
			$.ajax({						//select default seq num on select
            	async: false,
            	type : "POST",
            	url : _context + "/shipment/defaultShipmentSequenceNumberForEDI",
            	data : {
            		shipment_number:$('#shipmentNumber').val(),
            		},
            		success : function(responseText){
            			shipmentSequenceNumber=responseText.data;
            			 $('#shipmentSequenceNumber').val(shipmentSequenceNumber); 
            		}
            });
			//written here to capture latest value for $('#shpmntNo').val()
			//code for shipment sequence no predictive search
			
		}
	});
	
	 $('#shipmentSequenceNumber').gatesAutocomplete({
			source: _context+'/cas/autocomplete.do',
			extraParams: {
							method : "searchShpmntSeqNoForEDI",
							searchType : "376",
							parentSearch : function() {return $('#shipmentNumber').val();}
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
			}
		});
	
	
	/*alert(document.getElementById('isAcceptHddn').value);*/
	//loadEnableDisable();
	
	 $(function(){
			$('#fetchShipmentInfo').click(
					function(){
						   if (validateShipmentNumber())
						       displayEDIShipment();
					});
			
		});
	revalidateEnableDisable();
	createEnableDisable();
	rejectEnableDisable();
	//approveEnableDisable();
	validateAcceptAllPartiesButton();
	enableDisableAcceptAll();
	 var ediShipmentId = document.getElementById('ediShipmentId').value;
	 var commentShmnt = $.trim(document.getElementById('commentShmnt').value);
	 
	 var args = {
				entityType: 'ESRQ',
				entityId:$.trim(ediShipmentId),
				commentId:'commentId',
				commentTypesForGrid:'EDIBLOUT,EDIBLIN,EDIBLSYS',
				displayCommentTypes: 'EDIBLOUT'
			   };
	 $("#comment_link").comments(args);
		
	$('#Commodity').click(function() {
		var shpNum = document.getElementById('shipmentNumber').value;
		var shpSeqNum = document.getElementById('shipmentSequenceNumber').value;
		var  buttonAction = checkBookingNumberAgainstEdiShipmentNumber("Commodity");
		 if(buttonAction == true){
		 checkBookingNumberAgainstEdiShipmentNumber("Commodity"); 
		 //checkSequenceNumber(buttonAction);
		 
		var shipmentHeaderParam= "?shipmentNumber="+shpNum
		+ "&shipmentSeqNumber=" + shpSeqNum ;
		document.location.href=_context + '/edi/commodity/showForm'+shipmentHeaderParam;
		 }
	});
	$('#refresh').click(function(){
		var ref = document.getElementById('resolvedUser').value;
		 var queryString = $('#ediShipmentDetailForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/ediShipment/refreshResolvedUser",
			 data :queryString,
			success: function(responseText){
				$("#problmLogForEdi").trigger('reloadGrid');
			}	        
		 });

		 
	 });
	$('#createEdIBillBtn').click(function() {
		createBilling();
	});
/*	$('#createEdIBillBtn').click(function(){
		//var  buttonAction = createBillErrorMessage("createEdIBillBtn");
		 var ediShmtRequestId = document.getElementById('ediShipmentId').value;
		 alert("Inside bill Button"+ediShmtRequestId);
		// if(buttonAction == true){
		$.ajax({
				 type:"POST",
				 url:_context+"/edi/createBill",
				 data :{ediShmtRequestId:ediShmtRequestId},
				success: function(responseText){
					showResponseMessages("msgDiv", responseText);
				}	        
			 });
		   // }
		 });*/
	
	
	$('#approveEdiBtnabc').click(function(){
		showLoadingMessage('Approving EDI Booking Reservation');
		blockUI();
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var shipmentHeaderParam= "?ediShmtRefNum="+shpReqID;
		 /*alert("path context  "+_context+shipmentHeaderParam);*/
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			$.ajax({
				 type:"POST",
				 url:_context+"/ediShipment/approve"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){
					$("#problmLogForEdi").trigger('reloadGrid');
					if(responseText.messages.success.length > 0){
					document.getElementById("statusCode").innerHTML="APPROVED";
					}
					showResponseMessages("msgDiv", responseText);
					$('#approveEdiBtnabc').attr("disabled",true);
					$('#RevalidateBtn').attr("disabled",false);
					$('#createEdIBillBtn').attr("disabled",false);
					$('#rejectEdiBtn').attr("disabled",false);
					/*revalidateEnableDisable();
					createEnableDisable();
					rejectEnableDisable();*/
					$.unblockUI();
				}	        
			 });
		 });
	$( "#confirmEdiRejectionDialog" ).dialog({
		autoOpen: false, 
		width: 600,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		},
		close : function() {		
		},
		buttons : {			
		"Continue": function(){
			 
			$("#confirmEdiRejectionDialog").dialog('close');
			proceesRejectEDI();
		
			  			
			 },
	       
	        Cancel: function() {

	        	//rejectEDI(shpReqID, ''); 
	        	$("#ediRejectionDialog").dialog('close');
	        	$("#confirmEdiRejectionDialog").dialog('close');
	        }
		}
	});
	$( "#ediRejectionDialog" ).dialog({
		autoOpen: false, 
		width: 600,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		},
		close : function() {
		
		},
		buttons : {
			
		"Continue": function(){	   
			$("#confirmEdiRejectionDialog").dialog('close');
			promptForRejection();
			
			  },
	       
	        Cancel: function() {

	        	//rejectEDI(shpReqID, ''); 
	        	$('#msgDiv').html('');
				$('#msgDiv').hide();
	        	$('#rejectErrorMsg').html('');
	        	$('#rejectErrorMsg').hide();
	        	$("#ediRejectionDialog").dialog('close');
	        }
		}
	});
	
	$('#rejectEdiBtn').click(function(){
	
		
		$("#confirmEdiRejectionDialog").dialog( "option", "title", 'Confirm Reject Massege' );
		$('#confirmRejectEdiWarning').text('Proceed with Rejecting the EDI?');
		 $("#confirmEdiRejectionDialog").dialog('open');
		document.getElementById("confirmRejectEdiDiv").style.display="block";
		
		/*var r= confirm("Proceed with Rejecting the EDI?");
			if(r ==  true){
				return true;
			}else{
				return false;
			}*/
	});

	$('#acceptAllParties').click(function(){
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var shipmentHeaderParam= "?ediShmtRequestId="+shpReqID;
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			 blockUI();
			$.ajax({
				 type:"POST",
				 url:_context+"/ediShipment/acceptAllParties"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){
					showResponseMessages("msgDiv", responseText);
					 loadHeader(responseText);
					 $("#problmLogForEdi").trigger('reloadGrid');
					 createAllUndoLink();
					 $.unblockUI();
				}	        
			 });
		 });
	
	/*$('#acceptEdiParties').click(function(){
		alert("In approve all");
		 var ediNameAddID = document.getElementById('ediShipmentId').value;
		 alert("ediShipmentId"+shpReqID);
		 
		 var shipmentHeaderParam= "?ediShmtRequestId="+shpReqID;
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			$.ajax({
				 type:"POST",
				 url:_context+"/edi/acceptAllParties"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){
					showResponseMessages("msgDiv", responseText);
					
				}	        
			 });
		 });*/
	
	$('#RevalidateBtn').click(function(){
		var  buttonAction = revalidateErrorMessage("RevalidateBtn");
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var statuscode =document.getElementById('statusCode').innerText;
		 var commentId =document.getElementById('commentShmnt').value;
		 blockUI();
		 //alert("EDI Shipment has been successfully revalidated. Status has been set back to RECEIVED. Reviews of parties and commodities were not affected.");
		 if(buttonAction == true){
		$.ajax({
				url : _context +"/ediShipment/revalidateEDI",
				data : {ediShmtRequestId:shpReqID,
					statusCode : statuscode,
					commentId :commentId },
				    success: function(responseText){
				    	showResponseMessages("msgDiv", responseText);
				    	$("#problmLogForEdi").trigger('reloadGrid');
				    	if(responseText.messages.success.length > 0){
				    	document.getElementById("statusCode").innerHTML="RECEIVED";
				    	}
				    	$('#approveEdiBtnabc').attr("disabled",false);
						$('#RevalidateBtn').attr("disabled",false);
						$('#createEdIBillBtn').attr("disabled",true);
						$('#rejectEdiBtn').attr("disabled",false);
				    	/*rejectEnableDisable();
				    	approveEnableDisable();*/
				    	$.unblockUI();
				}	        
			 });
		 }
		 });
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentSequenceNumber').val('');
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#fetchShipmentInfo').click();
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#fetchShipmentInfo').click();
		}
	});
	
	loadEnableDisable();
	tabSequence('#ediShipmentDetailForm',false,false);
	
});

function rejectEDI(ediShmtRefNum, comments) {
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/reject",
		data: {ediShmtRefNum: ediShmtRefNum, 
				comments: comments 
			  },
		success: function(responseText) {
			document.getElementById("statusCode").innerHTML="REJECTED";
			/*revalidateEnableDisable();
			approveEnableDisable();*/
			$('#approveEdiBtnabc').attr("disabled",false);
			$('#RevalidateBtn').attr("disabled",false);
			$('#createEdIBillBtn').attr("disabled",true);
			$('#rejectEdiBtn').attr("disabled",true);
			$('#msgDiv').html("<div class=\"message_success\">EDI Shipment Reservation rejected successfully</div>");
			$('#msgDiv').show();
			$.unblockUI();
		}
	});
}

function promptForRejection() {
	createRejectionMsgDialog();
	$('#rejectErrorMsg').html('');
	$('#rejectErrorMsg').hide();
	$("#rejectMsgDialog").dialog('open');
	$("#ediRejectionDialog").dialog('close');
	
}
function createRejectionMsgDialog() {
	$("#rejectMsgDialog").dialog({
		autoOpen : false,
		width : 430,
		modal : true,
		title: "Reject Message",
		position: ['center','10'], 
		open : function() {
			$("#rejectMsgDialog").dialog({height: 200});
		},
		close : function() {
			$('#msgDiv').html('');
			$('#msgDiv').hide();
			$("#rejectMsgDialog").dialog('close');
		},
		buttons:{
			Save:function() {
				isCommentPresent();
			}, 
			Cancel:function() {
				$("#rejectMsgDialog").dialog('close');
			}
		}
	});
}
	
function isCommentPresent() {
	var comment = $('#rejectMsg').val();
	var shpReqID = document.getElementById('ediShipmentId').value;
	if(comment == undefined || $.trim(comment) == '') {
		$('#rejectErrorMsg').html("<div class=\"message_error\">Please enter comments</div>");
		$('#rejectErrorMsg').show();
		$('#rejectMsg').validationEngine('required', true);
	} else {
		$('#rejectErrorMsg').html('');
		$('#rejectErrorMsg').hide();
		rejectEDI($.trim(shpReqID), comment);
		$("#rejectMsgDialog").dialog('close');
	}
}
function expandAll() {
	$('.ui-accordion-content').attr('style', 'display:block');
}
function collapseAll() {
	$('.ui-accordion-content').attr('style', 'display:none');
}
function revalidateEnableDisable()
{  var statuscode =document.getElementById('statusCode').innerText;
   var isCurrent =document.getElementById('isCurrentRecord').value;
   	if( $.trim(statuscode)=='BILLED' ||$.trim(statuscode)=='SUBMIT'||$.trim(isCurrent)=='N')
			$('#RevalidateBtn').attr("disabled",true);
		else
			$('#RevalidateBtn').attr("disabled",false);
}


function revalidateErrorMessage(Strng) {
	var isCurrent =document.getElementById('isCurrentRecord').value	;
	if (Strng == "RevalidateBtn") {
		if($.trim(isCurrent)=='N'){
			showRevalidateErrorMessage();
			  return false;
		} else {
			return true;
		}
	}
}
/*function createBillErrorMessage(Strng) {
	var isCurrent =document.getElementById('isCurrentRecord').value	;
	if (Strng == "createEdIBillBtn") {
		if($.trim(isCurrent)=='N'){
			showRevalidateErrorMessage();
			  return false;
		} else {
			return true;
		}
	}
}*/
function refreshChecked(){
	$('#resolvedUser').attr("checked","checked");
	 var queryString = $('#ediShipmentDetailForm').formSerialize();
	 $.ajax({
		 type:"POST",
		 url:_context+"/ediShipment/refreshResolvedUser",
		 data :queryString,
		success: function(responseText){
			$("#problmLogForEdi").trigger('reloadGrid');
		}	        
	 });
}

function rejectEnableDisable(){
	var statuscode =document.getElementById('statusCode').innerText;
	 var isCurrent =document.getElementById('isCurrentRecord').value.trim();
	 var billExist=document.getElementById('billExists').value.trim();
	if(statuscode =='REJECTED'|| isCurrent=='N'|| billExist=='Y')
		$('#rejectEdiBtn').attr("disabled",true);
	else
		$('#rejectEdiBtn').attr("disabled",false);	
	
}
function createEnableDisable(){
	var statuscode =document.getElementById('statusCode').innerText;
	 var isCurrent =document.getElementById('isCurrentRecord').value.trim();
	 var billExist=document.getElementById('billExists').value.trim();
	if(statuscode !='APPROVED'|| isCurrent=='N'|| billExist=='Y')
		$('#createEdIBillBtn').attr("disabled",true);
	else
		$('#createEdIBillBtn').attr("disabled",false);	
	 if($('#approveEnableDisable').val()==true)
	 {
		 $('#createEdIBillBtn').attr("disabled",true);
	 }
	
}

function checkBookingNumberAgainstEdiShipmentNumber(Strng){
	var bookingNumber =document.getElementById('bookingShipmentNumber').value;
	var ediShipmentNumber=document.getElementById('shipmentNumber').value;
	if(Strng=="Commodity"){
		if (bookingNumber=="" ){
			showNonCommodityMessage();
		return false;
		}
		else{
			return true;
			
			}
		}	
	//return true;
}

/*function checkSequenceNumber(Strng){
	var sequenceNumberDs =document.getElementById('sequenceNumberDs').value;	
	alert("sequenceNumberDs"+sequenceNumberDs);
	if(Strng=="Commodity"){
		if ( sequenceNumberDs > 0 ){
			alert("true message");
		return true;
		}
		else{
			alert("false message");
			return false;
			
			}
		}
	
	}*/

function acceptFunction(acceptId){
	//alert("acceptId:::"+acceptId);
	var shpReqID = document.getElementById('ediShipmentId').value;
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/acceptParty",
		data: {ediNameAddId: acceptId, shipmentRequestId:shpReqID},
		success: function(responseText) {
			$("#problmLogForEdi").trigger('reloadGrid');
			showResponseMessages("msgDiv", responseText);
			//alert("In accept ");
			enableDisableAcceptAll();
			//createUndoLink(acceptId,divVal);
			
		}
	});
	createUndoLink(acceptId);
	enableDisableAcceptAll();
	
}
function undoFunction(UndoAcceptId){
	 var shpReqID = document.getElementById('ediShipmentId').value;
	 var  buttonAction = revalidateUndofunction("UndoAccept")
	  if(buttonAction == true){
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/undoAcceptParty",
		data: {ediNameAddId: UndoAcceptId,
			ediShmtRequestId:shpReqID},
		success: function(responseText) {
			showResponseMessages("msgDiv", responseText);
			 $("#problmLogForEdi").trigger('reloadGrid');
			 loadHeader(responseText);
			 document.getElementById("statusCode").innerHTML="RECEIVED";
			//createAcceptLink(UndoAcceptId,divVal);
			 
			
			
			/*$('#msgDiv').html("<div class=\"message_success\">EDI Shipment Reservation rejected successfully</div>");
			$('#msgDiv').show();*/
		}
	});
  }
	 document.getElementById("statusCode").innerHTML="RECEIVED";
	 $('#acceptAllParties').attr("disabled", false);
	 createAcceptLink(UndoAcceptId); 
	 
}

function revalidateUndofunction(Strng) {
	var statuscode =$.trim(document.getElementById('statusCode').innerText);
	if (Strng == "UndoAccept") {
		if($.trim(statuscode)=='BILLED'){
			showRevalidateUndoMessage();
			  return false;
		} else {
			return true;
		}
	}
}

function createAllUndoLink(){
	//alert($($($('#displaytagholder').children().children().children().children().children()[1]).children()).length);
	for(i=0;i<$($($('#displaytagholder').children().children().children().children().children()[1]).children()).length;i++)
	{
		//alert($($($($('#displaytagholder').children().children().children().children().children()[1]).children()[i]).children()[4]).children().children().children().attr('name'));
	if($($($($('#displaytagholder').children().children().children().children().children()[1]).children()[i]).children()[4]).children().children().children().attr('name')=="acceptLink")
	{//alert("3");
	var addrId=$($($($('#displaytagholder').children().children().children().children().children()[1]).children()[i]).children()[4]).children().children().attr('id');
	var link="<a href='#' onclick='javascript:undoFunction("+addrId+")' style ='color:#009;text-decoration:underline;'>Undo Accept</a>";
	var parentTag = document.getElementById(addrId);
	parentTag.innerHTML=link;
	}
	}
	$('#acceptAllParties').attr("disabled", true);
}


function createUndoLink(addrId){
	var link="<a href='#' onclick='javascript:undoFunction("+addrId+")' style ='color:#009;text-decoration:underline;'>Undo Accept</a>";
	var parentTag = document.getElementById(addrId);
	parentTag.innerHTML=link;
}

function createAcceptLink(addrId){
	var link="<a href='#' onclick='javascript:acceptFunction("+addrId+")'  style ='color:#009;text-decoration:underline;'  name='acceptLink'>Accept</a>";
	var parentTag = document.getElementById(addrId);
	parentTag.innerHTML=link;
	
}
function showNonCommodityMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Booking record not found; cannot proceed.</div>");
	$('#msgDiv').show();
}
function showRevalidateErrorMessage() {
	$('#msgDiv').html("<div class=\"message_error\">The selected record is not the current record.</div>");
	$('#msgDiv').show();
}
function showShippmentErrorMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Shipment not found.</div>");
	$('#msgDiv').show();
}
function showRecordTypeCodeErrorMessage() {
	$('#msgDiv').html("<div class=\"message_error\">This is not EDI Shipment or Shipping Instruction.</div>");
	$('#msgDiv').show();
}
function showCurrentRecordErrorMessage() {
	$('#msgDiv').html("<div class=\"message_error\">This is not a current Record.</div>");
	$('#msgDiv').show();
}

function showRevalidateUndoMessage() {
	$('#msgDiv').html("<div class=\"message_error\">The selected record is already Billed.</div>");
	$('#msgDiv').show();
}
//For Approve EDI

function showLoadingMessage(message) {
	$('#msgDiv').html("<div class=\"message_info\">" + message +" ...</div>");
	$('#msgDiv').show();
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
function displayEDIShipment() {
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		$.ajax({
			async: false,
			type : "POST",
			url : _context + "/shipment/defaultShipmentSequenceNumberForEDI",
			data : {				
				shipment_number :shipment_number,
			},
			success : function(responseText) {
				var shipmentSequenceNumber=responseText.data;
				shipment_sequence_number=shipmentSequenceNumber;
			}			
		});
	}
	$("#shipmentSequenceNumber").val(shipment_sequence_number);
	
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/isShmtNumberExist",
		data: {shipmentNumber: shipment_number,
			shipmentSeqNumber:shipment_sequence_number},
		success: function(responseText) {
			if(responseText.success){
				window.location = _context+"/ediShipment/showForm?edi_bill_number="+shipment_number+shipment_sequence_number;
				/*alert(ediShipmentDetailForm.ediShmtRequestProblemForm.ediProblemTypeCode);*/
			}
			else {
			showResponseMessages("msgDiv", responseText);
			return false;
			}
		}
	});
	
}

function loadEnableDisable() {
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	 if(shipment_number=='' && shipment_sequence_number =='')
	 {
		 //$('#shipmentDetailCancelBtn').attr("disabled",true);
		 $('#approveEdiBtnabc').attr("disabled",true);
	     $('#rejectEdiBtn').attr("disabled",true);
	     $('#RevalidateBtn').attr("disabled",true);
	     $('#createEdIBillBtn').attr("disabled",true);
	     $('#Commodity').attr("disabled",true);
	     $('#acceptAllParties').attr("disabled",true);
	   }  
}
function validateShipmentNumber(){
	var isValid = true;
	if( $("#shipmentNumber").val()=='')		
	   {
		$('#shipmentNumber').validationEngine('showPrompt', 'Shipment Number is required', 'error', 'topRight', true);
		isValid = false;
	   }
	/*else if( $("#shipmentSequenceNumber").val()=='')		
	   {
		$('#shipmentSequenceNumber').validationEngine('showPrompt', 'Shipment Number is required', 'error', 'topRight', true);
		isValid = false;
	   }*/
	return isValid;
}
function validateAcceptAllPartiesButton()
{  var statuscode =document.getElementById('statusCode').innerText;
   	if( $.trim(statuscode)=='BILLED')
			$('#acceptAllParties').attr("disabled",true);
		else
			$('#acceptAllParties').attr("disabled",false);
}

function loadHeader(responseText) {
	document.getElementById("organisationCode").innerText =responseText.data.header.organisationName;
	document.getElementById("bkgstatus").innerText =responseText.data.header.bookingStatusCode;
	document.getElementById("bkgRouting").innerText =responseText.data.header.routingDetail;
	document.getElementById("billExist").innerText =responseText.data.header.billExists;
	document.getElementById("billTypeCode").innerText =responseText.data.header.billTypeCode;
	//document.getElementById("nonNeg").innerText =responseText.data.header.nonNeotiableRequestCount;
	document.getElementById("statusCode").innerText =responseText.data.header.statusCode;
	document.getElementById("version").innerText =responseText.data.header.versionNumber;
	document.getElementById("recieveDate").innerText =responseText.data.header.createDateStringTyp;
	document.getElementById("currentRecord").innerText =responseText.data.header.isCurrentRecord;
	document.getElementById("ediTradePartner").innerText =responseText.data.header.tradingPartnerCode;
}
function enableDisableAcceptAll()
{
	//if($('#isShowLink').val()=='Y')
	//{
		$.ajax({
			url : _context +"/ediShipment/reviewPartiesStatus",
			data :{ediShipReqId : $('#ediShipmentId').val()},
			success : function(responseText) {
				/*alert("accept all");
				alert("value "+responseText.success);*/
				
				if(!responseText.success)
				$('#acceptAllParties').attr("disabled", false);
				else
					$('#acceptAllParties').attr("disabled", true);
				
			}
		});
	
}


function showCreateBillMessage(){
	$('#msgDiv').html("<div class=\"message_info\">Creating Bill for EDI  ... </div>");
	$('#msgDiv').show();
}

function createBilling(){
	//alert("$('#ediShipmentId').val()"+$('#ediShipmentId').val());
	showCreateBillMessage();
	 blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/createBill",
		data: {
			ediShmtRequestId: $('#ediShipmentId').val()
		},
		success: function(responseText){
			if(responseText.success==true){
				document.getElementById("billExist").innerHTML="Y - PENDING";
				document.getElementById("statusCode").innerHTML="BILLED";
				$('#approveEdiBtnabc').attr("disabled",true);
				$('#RevalidateBtn').attr("disabled",true);
				$('#createEdIBillBtn').attr("disabled",true);
				$('#rejectEdiBtn').attr("disabled",false);
			}else{
				document.getElementById("statusCode").innerHTML="FAILED";
				$("#problmLogForEdi").trigger('reloadGrid');
				rejectEnableDisable();
			}
			showResponseMessages("msgDiv", responseText);
			$.unblockUI();
		}
	});
}

function removeErrorPointers() {	
	$("#ediShipmentDetailForm").validationEngine('hideAll');
}
function proceesRejectEDI(){
	showLoadingMessage('Rejecting EDI Booking Reservation');
	 var shpReqID = document.getElementById('ediShipmentId').value;
	$.ajax({
		type: "GET",
		url: _context +"/ediShipment/validateReject",
		data: {ediShmtRefNum:$("#ediShipmentId").val()},
		success: function(responseText) {
		if(responseText.messages.success.length > 0){
			rejectEDI(shpReqID, '');
		}else if(responseText.messages.error.length > 0){
			$("#ediRejectionDialog").dialog('open');
			$("#ediRejectionDialog").dialog( "option", "title", 'Comment For Rejecting EDI' );
			$('#rejectEdiWarning').text('Do you want to enter reason for rejecting EDI Booking Reservation?');
			document.getElementById("rejectEdiDiv").style.display="block";
			/*isConfirm = confirm("Do you want to enter reason for rejecting EDI Booking Reservation?");
			if(isConfirm == 'true' || isConfirm == true){
				promptForRejection();
			}else{
				rejectEDI(shpReqID, '');	
			}	*/
		}
	}
});
}






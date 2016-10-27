$(document).ready(function () {
	$('#billExists').text($('#billExists1').val());
	if($('#commodityLineEdiSeq option').length==0){
		$('#ediFieldSet').attr("style","padding: 14px; padding-top:32px;");
	}
	var selectmenu=1;
	 $.ajax({
		 url:_context+"/edi/commodity/dropdownChange",
		 data :{index :selectmenu},
		success: function(responseText){
			reloadEdiCommodityData(responseText);
		}	        
	 }); 
	 
	$.ajax({
		url:_context+"/edi/commodity/dropdownChangeBooking",
		data :{index :selectmenu},
		success: function(responseText){
				reloadShipmentCommodityData(responseText);
		}	        
	});  

	 if($('#documentFormatCode').val().trim()=='M'){
		 $('#attachCommodity').attr("checked","checked");
		 }else{
			 $('#attachCommodity').removeAttr("checked");
		 }
	 
	 enabledisableCommodityAttachmentbtn();
	 if($('#sizeEdi').text().trim()=="1"){
			$('#nextEdiCommodity').attr('disabled',true);
			$('#previousEdiCommodity').attr('disabled',true);
		}
		if($('#sizeEdi').text().trim()==""||$('#sizeEdi').text().trim()==null){
			$('#nextEdiCommodity').attr('disabled',true);
			$('#previousEdiCommodity').attr('disabled',true);
			$('#acceptAllBtn').attr('disabled',true);
			$('#acceptCommoditBtn').attr("disabled",true);
			$('#commodityDetailUndoAcceptBtn').attr("disabled",true);
		}
		if($('#sizeBookingSeq').text().trim()=="1"){
			$('#previousCommodity').attr('disabled',true);
			$('#nextCommodity').attr('disabled',true);
		}
		if($('#sizeBookingSeq').text().trim()==""||$('#sizeBookingSeq').text().trim()==null){
			$('#previousCommodity').attr('disabled',true);
			$('#nextCommodity').attr('disabled',true);
		}
		if($('#billExists').text().trim()=="Y"||$('#isCurrentRecord').val().trim()=="N"){
			$('#acceptCommoditBtn').attr("disabled",true);
			$('#acceptAllBtn').attr('disabled',true);
			
		}
		if($('#billExists').text().trim()=="Y"){
			$('#commodityDetailUndoAcceptBtn').attr("disabled",true);
		}
}
);	
function enabledisableCommodityAttachmentbtn(){
	if($('#bkgstatus').val()=="APPROVED"||$('#bkgstatus').val()=="RECEIVED"){
		$('#attachCommodity').attr("disabled",false);
	}else{
		$('#attachCommodity').attr("disabled",true);
	}
	if($('#attachCommodity').attr("checked")!="checked")
	{
		$('#printCommodityAttachment').attr("disabled",true);
	}else{
		$('#printCommodityAttachment').attr("disabled",false);
	}
}

//method called on click of check box
function enabledisableprintCommodityAttachment(){
	
	if($('#documentFormatCode').val().trim()=='M'){
		$('#documentFormatCode').attr("value","");
		 $('#attachCommodity').removeAttr("checked");
		 }else{
			 $('#documentFormatCode').attr("value",'M');
			 $('#attachCommodity').attr("checked","checked");
		 }
	if($('#attachCommodity').attr("checked")!="checked")
	{
		$('#printCommodityAttachment').attr("disabled",true);
	}else{
		$('#printCommodityAttachment').attr("disabled",false);
	}
	//alert($('#documentFormatCode').val());
		 $.ajax({
			type:"POST",				
			 url:_context+"/edi/commodity/documentFormatCode",
			 data :{ediShmtRequestId:$('#ediShipmentId').val().trim(),documentFormatCodeValue:$('#documentFormatCode').val().trim()},
			success: function(responseText){
				if($('#documentFormatCode').val().trim()=='M')
					showSuccessAttachCommodityMessage();
				else
					showSuccessUnattachCommodityMessage();	
				//alert("success");
			}
		 });
	}

function showSuccessAcceptMessage() {
	
	$('#msgDiv').html("<div class=\"message_success\">EDI Shipment commodity accepted successfully.</div>");
	$('#msgDiv').show();
}

function showSuccessAttachCommodityMessage() {
	
	$('#msgDiv').html("<div class=\"message_success\">Doc Format Changed To MACY Doc Format successfully.</div>");
	$('#msgDiv').show();
}

function showSuccessUnattachCommodityMessage() {
	
	$('#msgDiv').html("<div class=\"message_success\">Doc Format Changed To Non-MACY Doc Format successfully.</div>");
	$('#msgDiv').show();
}

function showSuccessUndoAcceptMessage() {
	$('#msgDiv').html("<div class=\"message_success\">EDI Shipment commodity undo accepted successfully.</div>");
	$('#msgDiv').show();
}

function showNonCommodityMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Cannot update. Status of EDI Request are BILLED or SUBMIT.</div>");
	$('#msgDiv').show();
}
function showNonUndoCommodityMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Cannot update. Status of EDI Request are BILLED or SUBMIT.</div>");
	$('#msgDiv').show();
}

function reloadShipmentCommodityData( responseText){
	document.getElementById("commodityLine").value =responseText.data.commodityLine;
	document.getElementById("piece").innerText =responseText.data.bookingCurrentCmd.pieceCount;					
	document.getElementById("cube").innerText =responseText.data.bookingCurrentCmd.cube;
	document.getElementById("kind").innerText =responseText.data.bookingCurrentCmd.pieceUnitOfMeasureCode;
	document.getElementById("weight").innerText =responseText.data.bookingCurrentCmd.weight;
	/*document.getElementById("billExists").innerText =responseText.data.bookingCurrentCmd.billExists;*/
	document.getElementById("trf").innerText =responseText.data.bookingCurrentCmd.tariffnumber;
	document.getElementById("itm").innerText =responseText.data.bookingCurrentCmd.tariffItemNumber;
	document.getElementById("containerCommodityDesc").innerText =responseText.data.bookingCurrentCmd.commodityDescription;
	/*document.getElementById("lastUpdateDate").innerText =responseText.data.bookingCurrentCmd.lastUpdateDate;
    document.getElementById("lastUpdateUser").innerText =responseText.data.bookingCurrentCmd.lastUpdateDate;*/
	if($('#commodityLine').val()==$('#sizeBookingSeq').text().trim()){
		$('#nextCommodity').attr('disabled',true);
		$('#previousCommodity').attr('disabled',false);
	}
	else if($('#commodityLine').val()=="1"){
		$('#previousCommodity').attr('disabled',true);
		$('#nextCommodity').attr('disabled',false);
	}
	else{
		$('#nextCommodity').attr('disabled',false);
		$('#previousCommodity').attr('disabled',false);
	}
	if($('#sizeBookingSeq').text().trim()=="1"){
		$('#previousCommodity').attr('disabled',true);
		$('#nextCommodity').attr('disabled',true);
	}
}
//For Edi commodity List Load
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

function validateButtonAction(Strng){
	var size =$('#size').val(); 
		//document.getElementById('size').innerText;
	var line=document.getElementById("commodityLine").value;
	if(Strng=="nextCommodity"){
	if(line ==size){
		$('#nextCommodity').attr("disabled",true);
		return false;
	}
	else{
		$('#nextCommodity').attr("disabled",false);
		return true;
		}
	}	
	/*else if(Strng=="previous"){
		if($('#commodityLine').val()<=1){
			$('#previousCommodity').attr("disabled",true);
			return false;
		}
		else{
			return true;	
		}
		
	}
	else  return true;*/
	
}


$(function(){
		$('#nextCommodity').click(function(){
			//var current = $(current).next();
			var line=document.getElementById("commodityLine").value;
			//enableNextButton();
			// var  buttonAction =  validateButtonAction("nextCommodity");
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			 //if(buttonAction == true){
			 $.ajax({
				type:"POST",				
				 url : _context + "/edi/commodity/populateShipment",					
				 data :queryString,
				success: function(responseText){					
					reloadShipmentCommodityData(responseText);					
				    
				}	
			 });
			//}
		
			 
		 });
		
		 $('#previousCommodity').click(function(){
				//var  buttonAction =  validateButtonAction("previous");
				 var queryString = $('#ediCommodityDetailForm').formSerialize();
				// if(buttonAction == true){
				 $.ajax({
					 type:"POST",
					 url:_context+"/edi/commodity/populateShipmentPrevious",
					 data :queryString,
					success: function(responseText){
						reloadShipmentCommodityData(responseText);
					}	        
				 });
		 });
		 
		 $('#printCommodityAttachment').click(function(){
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
				
				window.open(_context+'/edi/commodity/printdocument?'+queryString);
		 });

		
});
//for EDI Commodity List Start 

$(function(){
	if($('#billExists').text().trim()=="N"&&$('#isCurrentRecord').val().trim()=="Y"){
		enableDisableAcceptAll();
	}
	$('#nextEdiCommodity').click(function(){
		
		 var queryString = $('#ediCommodityDetailForm').formSerialize();
		 $.ajax({
			type:"POST",				
			 url : _context + "/edi/commodity/populateShipmentEdiNext",					
			 data :queryString,
			success: function(responseText){
				reloadEdiCommodityData(responseText);
						    
			}	
		 });
	 });
	 $('#previousEdiCommodity').click(function(){
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			 $.ajax({
				 type:"POST",
				 url:_context+"/edi/commodity/populateShipmentEdiPrevious",
				 data :queryString,
				success: function(responseText){
					reloadEdiCommodityData(responseText);
				}	        
			 });
		 });
	 
		//for EDI
		$('#commodityLineEdiSeq').change(function(){
			var selectmenu=document.getElementById("commodityLineEdiSeq").value;
				 $.ajax({
					 url:_context+"/edi/commodity/dropdownChange",
					 data :{index :selectmenu},
					success: function(responseText){
						reloadEdiCommodityData(responseText);
					}	        
				 });  
		 });
		//for Booking drop down
		$('#commodityLine').change(function(){
			var selectmenu=document.getElementById("commodityLine").value;
				 $.ajax({
					 url:_context+"/edi/commodity/dropdownChangeBooking",
					 data :{index :selectmenu},
					success: function(responseText){
						reloadShipmentCommodityData(responseText);
					}	        
				 });  
		 });
		
	 $('#commodityDetailCancelBtn').click(function() {
		 
		 document.location.href=_context+"/ediShipment/showForm?edi_bill_number="+shipmentNumber.innerText.trim()+shipmentSeqNumber.innerText.trim();
		});
	 
	 $('#acceptCommoditBtn').click(function(){
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var shipmentHeaderParam= "?ediShmtRequestId="+shpReqID;
		 var  buttonAction =  validateOnAccept("acceptCommoditBtn");
		 var queryString = $('#ediCommodityDetailForm').formSerialize();
		if(buttonAction == true){
			$.ajax({
				 type:"POST",
				 url:_context+"/edi/commodity/approvedDataForEdiCommodity"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){					
					showSuccessAcceptMessage();
					reloadEdiCommodityData( responseText);
					}
				    
			 });
		}	
			
		 });
	 $('#commodityDetailUndoAcceptBtn').click(function(){
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var shipmentHeaderParam= "?ediShmtRequestId="+shpReqID;
		 var  buttonAction =  validateOnUndoAccept("commodityDetailUndoAcceptBtn");
		 var queryString = $('#ediCommodityDetailForm').formSerialize();
			if(buttonAction == true){
			$.ajax({
				 type:"POST",
				 url:_context+"/edi/commodity/undoAcceptDataForEdiCommodity"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){
					showSuccessUndoAcceptMessage();
					reloadEdiCommodityData( responseText);
				}	        
			 });
			}
		 });
	 
	 $('#acceptAllBtn').click(function(){
		 ("acceptAllBtn");
		var  buttonAction = validateOnAcceptALL("acceptAllBtn");
		 var shpReqID = document.getElementById('ediShipmentId').value;
		 var shipmentHeaderParam= "?ediShmtRequestId="+shpReqID;
			 var queryString = $('#ediCommodityDetailForm').formSerialize();
			if(buttonAction == true){
	     $.ajax({
				 type:"POST",
				 url:_context+"/edi/commodity/acceptAllCommodities"+shipmentHeaderParam,
				 data :queryString,
				success: function(responseText){
					if( responseText.success==true){
					showResponseMessages("msgDiv", responseText);
					reloadEdiCommodityData( responseText);
					}
				}	        
			 });
			}
		 });
	 
});


function reloadEdiCommodityData( responseText){
	
document.getElementById("commodityLineEdiSeq").value =responseText.data.commodityLineEdiSeq;
document.getElementById("pieceEdi").innerText =responseText.data.shipmentCurrentCmd.pieceCount;					
document.getElementById("cubeEdi").innerText =responseText.data.shipmentCurrentCmd.volume;
document.getElementById("volumeUnitOfMeasureCodeEdi").innerText =responseText.data.shipmentCurrentCmd.volumeUnitOfMeasureCode;
document.getElementById("kindEdi").innerText =responseText.data.shipmentCurrentCmd.pieceUnitOfMeasureCode;
document.getElementById("weightEdi").innerText =responseText.data.shipmentCurrentCmd.weight;
document.getElementById("weightUnitOfMeasureCodeEdi").innerText =responseText.data.shipmentCurrentCmd.weightUnitOfMeasureCode;
document.getElementById("containerEdiCommodityDesc").innerText =responseText.data.shipmentCurrentCmd.commodityDescription;
document.getElementById("isAcceptedAll").value =responseText.data.isAcceptedAll;
if($('#commodityLineEdiSeq').val()==$('#sizeEdi').text().trim()){
	$('#nextEdiCommodity').attr('disabled',true);
	$('#previousEdiCommodity').attr('disabled',false);
	//alert("1");
}
else if($('#commodityLineEdiSeq').val()=="1"){
	$('#previousEdiCommodity').attr('disabled',true);
	$('#nextEdiCommodity').attr('disabled',false);
}
else{
	$('#nextEdiCommodity').attr('disabled',false);
	$('#previousEdiCommodity').attr('disabled',false);
}
if(responseText.data.shipmentCurrentCmd.isAccept=='Y')
{
	$('#commodityDetailUndoAcceptBtn').attr("disabled",false);
	$('#acceptCommoditBtn').attr("disabled",true);
}
else{
	$('#commodityDetailUndoAcceptBtn').attr("disabled",true);
	$('#acceptCommoditBtn').attr("disabled",false);
}

if($('#isAcceptedAll').val()=="Y"	)
{
$('#acceptAllBtn').attr('disabled',true);
}
else
{
$('#acceptAllBtn').attr('disabled',false);
}
if($('#sizeEdi').text().trim()=="1"){
	$('#nextEdiCommodity').attr('disabled',true);
	$('#previousEdiCommodity').attr('disabled',true);
}
if($('#sizeEdi').text().trim()==""||$('#sizeEdi').text().trim()==null){
	$('#nextEdiCommodity').attr('disabled',true);
	$('#previousEdiCommodity').attr('disabled',true);
	$('#acceptAllBtn').attr('disabled',true);
	$('#acceptCommoditBtn').attr("disabled",true);
	$('#commodityDetailUndoAcceptBtn').attr("disabled",true);
}
if($('#billExists').text().trim()=="Y"){
	$('#acceptCommoditBtn').attr("disabled",true);
	$('#acceptAllBtn').attr("disabled",true);
	$('#commodityDetailUndoAcceptBtn').attr("disabled",true);
}
if($('#isCurrentRecord').val().trim()=="N"){
	$('#acceptCommoditBtn').attr("disabled",true);
	$('#acceptAllBtn').attr('disabled',true);
}
}

//validate Button for EdiCommodity detail 

function validateButtonEdiAction(Strng) {
	var size = document.getElementById('sizeEdi').innerText;
	var line = $('#commodityLineEdiSeq').val();
	if (Strng == "next") {
		if ($('#commodityLineEdiSeq').val() >= size) {
			$('#nextEdiCommodity').attr("disabled", true);
			return false;
		} else {
			return true;
		}
	} else if (Strng == "previous") {
		if ($('#commodityLineEdiSeq').val() <= 1) {
			$('#previousEdiCommodity').attr("disabled", true);
			return false;
		} else {
			return true;
		}

	} else
		return true;

}
function validateOnAcceptALL(Strng) {
	var ediStatus = $('#statusCode').val();
	if (Strng == "acceptAllBtn") {
		  if ($.trim(ediStatus) == "BILLED" || $.trim(ediStatus) == "SUBMIT") {
			  showNonCommodityMessage();
			  return false;
		} else {
			return true;
		}
	}
}
function validateOnAccept(Strng){
	var ediStatus = $('#statusCode').val();
	("ediStatus"+ediStatus);
	if (Strng == "acceptCommoditBtn") {
		if ($.trim(ediStatus) == "BILLED" || $.trim(ediStatus) == "SUBMIT") {
			showNonCommodityMessage();
			return false;
		} else {
			return true;
		}
	}
}

function validateOnUndoAccept(Strng){
	var ediStatus = $('#statusCode').val();
	("ediStatus"+ediStatus);
	if (Strng == "commodityDetailUndoAcceptBtn") {
		if ($.trim(ediStatus) == "BILLED" || $.trim(ediStatus) == "SUBMIT") {
			showNonCommodityMessage();
			return false;
		} else {
			return true;
		}
	}
}


function enableDisableAcceptAll()
{
		$.ajax({
			url : _context +"/edi/commodity/reviewCommodityStatus",
			data :{ediShipReqId : $('#ediShipmentId').val()},
			success : function(responseText) {
				if(responseText.success)
				$('#acceptAllBtn').attr("disabled", false);
				else
					$('#acceptAllBtn').attr("disabled", true);
				
			}
		});
	
}

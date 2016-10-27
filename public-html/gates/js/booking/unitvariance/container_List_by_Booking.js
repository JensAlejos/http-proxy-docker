$(function() {
	
	var bookingId=$(document).getUrlParam("bookingId");
	
	var variance=$(document).getUrlParam("variance");

	if(bookingId!=null && bookingId!=""){
		$('#IN_BOOKING').val(bookingId);
		$('input[name="booking_Id"]').val(bookingId);
		if(variance!=null && variance!=""){
			$('#IN_VARIANCE').val(variance);
			if($('#IN_VARIANCE').val()=='Y')
				$('#variance').attr('checked','checked');
			else
				$('#variance').removeAttr('checked');
		}
		getBookingData();
	}
	
	/*$('#containerMaintenance').click(function(){
		var bookingNo=$('#IN_BOOKING').val();
		
		if($('#IN_BOOKING').val()== null || $('#IN_BOOKING').val()== "ALL" || $('#IN_BOOKING').val().length !=7) {
        	$("#IN_BOOKING").validationEngine('showPrompt', 'Please enter a valid booking number', 'error', true);
			return false;	
        }	
		else{
				document.location.href = _context+ '/receivedContainer/showForm?header.shipmentNumber='+bookingNo;
		}
	});*/
	$('#bill').attr("disabled","disabled");
	$('#hold').attr("disabled","disabled");
	$('#containerVariance').attr("disabled","disabled");
	$('#containerMaintenance').attr("disabled","disabled");
	var received= $('#received').val();
	if(received!=null && received!=0){
		$('#approveBooking').removeAttr("disabled");
	}
	
	if(!_contMaint){
		$("#containerMaintenance").css('visibility','hidden');
	}
	if(!_contVar){
		$("#containerVariance").css('visibility','hidden');
	}
	if(!_bill){
		$("#bill").css('visibility','hidden');
	}
	if(!holdReleaseEnabled){
		$("#holdRelease").css('visibility','hidden');
	}
	


	//Enabling of Container Variance Button on checkbox checked
	 $("input[type=checkbox][name=searchInput]").click(function() {
		 var checkedStatus = this.checked;
     	if(checkedStatus == false)
     		$("#chkbox").removeAttr("checked");
			chkbox();
	 });
	 
	//Display Unreleased Holds Grid on initial display
	 openUnreleasedHoldGridOnIntialDisplay("variance");
});

function chkbox(){
	var searchLength = document.containerListbyBookingForm.searchInput.length;
	var containers = "";
	var tempVarFlag = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var selCount = 0;
	var selSts="";
	var isbill="";
	var check=false;
	var pre = false;
	
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.containerListbyBookingForm.searchInput[i].checked;
   			searchInp = document.containerListbyBookingForm.searchInput[i].value;
		} else {
			checked = document.containerListbyBookingForm.searchInput.checked;
   			searchInp = document.containerListbyBookingForm.searchInput.value;
		}

		if (checked) {
			$('#containerMaintenance').removeAttr("disabled");
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			
			temp = searchInp.split(',');
			selItem = temp[2];
			var varFlag="";
			
			varFlag=temp[0];
			isbill=temp[1];
			selSts=temp[9];
			if(selSts == 'Pre')
				pre = true;
			
			containers = containers + selItem + "-" + varFlag+ ",";
			tempVarFlag=tempVarFlag + varFlag +",";
			if((tempVarFlag.indexOf("Y")!=-1 || tempVarFlag.indexOf("N")!=-1) ){
				$('#containerVariance').removeAttr("disabled");
			}
			else{
				$('#containerVariance').attr("disabled","disabled");
			}
			if((isbill=="null" || isbill=="") && selSts!="Pre"){
				check=true;
			}
		}
		else{
			if(tempVarFlag.indexOf("Y")!=-1 || tempVarFlag.indexOf("N")!=-1){
				$('#containerVariance').removeAttr("disabled");
			}
			else{
				$('#containerVariance').attr("disabled","disabled");
			}
		}//Defect-To enable bill button when more than one container are selected.
		if(selCount >= 1 && check && $('#bkstatus').text() == 'APPR'){
			$('#bill').removeAttr("disabled");
		}
		else{
			$('#bill').attr("disabled","disabled");
		}
		if(selCount >= 1 ){
			$('#containerMaintenance').removeAttr("disabled");
		}
		else if(!($('#IN_TRADE').val()!=null && $('#IN_TRADE').val().split('-')[0]=='F')){
			$('#containerMaintenance').attr("disabled","disabled");
		}
		if(pre)
			$('#containerVariance').attr("disabled","disabled");
			
	}
	return true;
}

function containerVarianceClick(maintainBooking)
{
	var bookingNum=$('#IN_BOOKING').val();
	var searchLength = document.containerListbyBookingForm.searchInput.length;
	var maintain_contArr = new Array();
	var maintain_cont = "";
	var containers_contArr = new Array();
	var containers = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.containerListbyBookingForm.searchInput[i].checked;
   			searchInp = document.containerListbyBookingForm.searchInput[i].value;
		} else {
			checked = document.containerListbyBookingForm.searchInput.checked;
   			searchInp = document.containerListbyBookingForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			
			temp = searchInp.split(',');
			selItem = temp[2];
			var varFlag="";
			varFlag=temp[0];
			if($.inArray(selItem, maintain_contArr) == -1){
				maintain_cont = maintain_cont + selItem + ",";
				maintain_contArr.push(selItem);
			}
			//if(varFlag=='Y'){
			if($.inArray(selItem, containers_contArr) == -1){
				containers = containers + selItem + ",";
				containers_contArr.push(selItem);
			}
			//}
		}
	}
	//document.location.href = _context +'/containerVariance/showForm';
	//document.location.href = _context +'/containerVariance/showForm?bookingId='+bookingNum+'&containerNumbers='+containers+'&source=B';
	if(maintainBooking == 'true'){
		if($('#trade').text().split('-')[0] == 'F')
			document.location.href = _context+ '/containerBilling/showForm?header.shipmentNumber='+bookingNum+'&containerNumbers='+maintain_cont.split('-')[0];
		else
			document.location.href = _context+ '/receivedContainer/showForm?header.shipmentNumber='+bookingNum+'&containerNumbers='+maintain_cont.split('-')[0];
	}else{
		document.location.href = _context +'/containerVariance/showForm?bookingId='+bookingNum+'&containerNumbers='+containers+'&source=B';
	}
	blockUI();
}
function generateBill(){
$('#msgDiv').html('');
var rcftIds = '';
var shipment_number=$('#IN_BOOKING').val();
	if(shipment_number != null && shipment_number != ""){
		//Billing Started
		var rcftId = '', bookingID ='';
		$("#casQuickSearch td:nth-child(1) :checkbox:checked").each(function(index) { 
			 var values = $(this).val().split(",");
			 rcftId = values[12];
			 bookingID = values[11];
			 if(rcftId != null && rcftId != ''){
			  if(rcftIds != null && rcftIds != '')
				  rcftIds += "|";
			  rcftIds += rcftId;  
			}
			  
		});
		blockUI();
		
		 $.ajax({
				type: "GET",
				datatype: "json",
				url: _context +"/booking/createBatchBillForBookings",
				data: {
					bookingId: bookingID,
					receivedFreightIds: rcftIds,
					callingModule: "BOOKING",
					callingPage: "BVSEARCH",
					processMode: "BK"
				},
				success: function(responseText){
					showMessages(responseText);
					//D027662
					//var doesHoldsExist = responseText.data;
					//if(doesHoldsExist!="" && doesHoldsExist == "holdsExists"){
					//	alert("Booking holds exist.  Please resolve booking holds or initiate billing from maintain booking");
					//}
				}
			});
		/*	
		$.ajax({
				type: "GET",
				datatype: "json", 
				url: _context + '/booking/batchbill/requestBill?bookingIds=' + bookingIDs,  
				success: function(responseText){
					showMessages(responseText);
				}
			});*/
		$.unblockUI();
		//Billing End
	 }
	return true;
}

function showMessages(responseText)  {
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

		$('#msgDiv').html(messageContent);
		//$("input[name='msg_Div']").val($('#msg').html());
		if(messageContent!='')
		{
			window.scrollTo(0, 0);
		}
		$.unblockUI();
		//searchValueDefault();
  	}
}
function clickBill(){
	var bookingNum=$('#IN_BOOKING').val();
	var searchLength = document.containerListbyBookingForm.searchInput.length;
	var containers = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.containerListbyBookingForm.searchInput[i].checked;
   			searchInp = document.containerListbyBookingForm.searchInput[i].value;
		} else {
			checked = document.containerListbyBookingForm.searchInput.checked;
   			searchInp = document.containerListbyBookingForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			
			temp = searchInp.split(',');
			selItem = temp[2];
			var varFlag="";
			varFlag=temp[0];
			if(varFlag=='Y'){
				containers = containers + selItem + ",";
			}
		}
	}
	if(selCount>0){
		
	}
}

var options = {
		//beforeSubmit:showRequest,
		success : showResponse,
		datatype : 'json'
	};
//pre-submit callback 
function showRequest(formData, jqForm, options) {
	var queryString = $.param(formData);
	return true;
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
}
// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {

	if (responseText.messages) {
		var messages = responseText.messages;
		showResponseMessages(messages);
	}
	
	if(responseText.success)
	{
		jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
	}

}
//hide all inline validation error messages
function removeErrorPointers(){
	   $('#creditProfileForm').validationEngine('hideAll');
}
function validateShipmentNo(){
	if($('#shipmentId').val()==null || $('#shipmentId').val()=="" || $('#shipmentId').val().length!=7){
		return 'Please provide a valid 7 digit Shipment Number';
	}
}

$(document).ready(function() {
	//validations
	$("#sendDocumentForm").validationEngine('attach');
	if($('#isSendAllowed').val()=='true')
	{
		$('#sndDocSave').removeAttr('disabled');
	}
	
	if($('#isPOV').val()=='true')
	{
		$('#sndDocPrint').removeAttr('disabled');
	}
	$('#sndDocExit').click(function(){
		//document.location.href = _context+"/booking/showForm";
		$.ajax({
			url: _context+"/booking/senddocument/exit",
			success: function(responseText){
				if(responseText.success){
					window.opener.loadHoldGrid("D");
					window.close();
				}
			}
		});
	});
	
	$('#sndDocPrint').click(function(){
		$('#sendDocumentForm').attr('action','printdocument');
		$('#sendDocumentForm').submit(); 
	});
	
	$('#sndDocSave').click(function(){
		
		$('#selectedContacts').val("");

		var rowIDs = jQuery("#contactGrid").getDataIDs(); 
		var selection = "";
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
			var id = $('#contactGrid').getCell(rowIDs[i], 'id');
			var isSelected =$('#jqg_contactGrid_'+id).attr("checked");
			if(isSelected=="checked")
			{
				selection = selection+id+"|";
			}
		}
		$('#selectedContacts').val(selection);
		
		//window.opener.loadHoldGrid("D");
	    $('#sendDocumentForm').attr('action','savensend');
		//$('#sendDocumentForm').submit();
	    $('#sendDocumentForm').ajaxSubmit(options);
    });
	
	$('#selectedDocType').change(function(){
		if($('#selectedDocType').val()!=null && $('#selectedDocType').val()!="")
		{
			document.location.href = _context+"/booking/senddocument/create?bookingId="+$('#shipmentId').val()+"&docType="+$('#selectedDocType').val();
		}
    });
	$('#shipmentId').change(function(){
		$('#shipmentId').change(function(){
			if($('#shipmentId').val()!=null && $('#shipmentId').val()!="" && $('#shipmentId').val().length==7)
			{
				document.location.href = _context+"/booking/senddocument/create?bookingId="+$('#shipmentId').val();
			}
			/*else{
				alert("Please provide a valid 7 digit Shipment Number");
			}*/
	    });
    });
	$('#selectedPartyType').change(function(){
		if($('#selectedPartyType').val()=='-1')
		{
			$('#customerId').val("");
			$('#aroleId').val("");
			$('#customerName').val("");
			$('#aroleName').val("");
		}
		else
		{
			//document.location.href = "?bookingId="+$('#shipmentId').val();
			updateContactList();
		}
    });
	
	
	
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';		 
	 $('#customerName').gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.name; // + "-" + data.code;
			},
			formatResult: function(data) {
				return data.name; // + "-" + data.code;
			},
			select: function(data) {
				$('#selectedPartyType').val('-1');
				$('#customerId').val(data.id);
				$('#customerName').attr('title',data.name);
				$('#customerName').val(data.name);
				$('#aroleId').val("");
				$('#aroleName').val("");
			}
		})
	 .change(function() {
		 	if($('#customerName').val()=='')
			{
				$('#selectedPartyType').val('-1');
				$('#customerId').val("");
				$('#aroleId').val("");
				$('#aroleName').val("");
			}
		});
	 // code to bind pop up search
		$('#customerName').gatesPopUpSearch({
			func : function() {
				
				 if ($('#customerId').val()) {	
					var url = '../../cas/addressRolemainlookup.do?filterValue1='+$('#customerId').val();
					winBRopen(url,'winpops','700','500','no','no'); 
					
			    } else {
			    	alert('Please select organization.');
			    } 
			}
		});
		function winBRopen(theURL, Name, popW, popH, scroll, loc) {
			var winleft = (screen.width - popW) / 2;
			var winUp = (screen.height - popH) / 2;
			winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
			Win = window.open(theURL, Name, winProp);
			if (parseInt(navigator.appVersion) >= 4) {
				Win.window.focus();
			}
		}
		
/* 		$('#customerName').change(function(){
		if($('#customerName').val()=='')
		{
			$('#selectedPartyType').val('-1');
			$('#customerId').val("");
			$('#aroleId').val("");
			$('#aroleName').val("");
		}
    }); */
	$('#selectedContactId').change(function(){
		if($('#selectedContactId').val()!='-1')
		{
			$('#sendDocumentForm').attr('action','addToGrid/addPrimary');
			$('#sendDocumentForm').ajaxSubmit(options);
		}
    });
	
	//Display Unreleased Holds Grid on initial display
	openUnreleasedHoldGridOnIntialDisplay("sendDocument");
});

function addressRoleSearchUpdate(id){
	
	var values = id.split("|");
	
	$('#aroleId').val(values[0]);
	 var address="";
	if(values[2]!=null)
	{
		address=address+values[2]+" ";
	}
	if(values[4]!=null)
	{
		var addr=values[4].split(',');
		if(addr!=null && addr[0]!=null)
		{
			address=address+addr[0]+",";
		}
	}
	if(values[6]!=null)
	{
		address=address+values[6]+",";
	}
	if(values[7]!=null)
	{
		address=address+values[7]+"-";
	}
	if(values[8]!=null)
	{
		address=address+values[8]+" ";
	}
	if(values[9]!=null)
	{
		address=address+values[9];
	}
	$('#aroleName').val(address.trim()); 
	$('#selectedPartyType').val('-1');
	updateContactList();
}
function updateContactList(){
	/*$('#sendDocumentForm').attr('action','update');
	$('#sendDocumentForm').submit();*/
	
	var queryString = $('#sendDocumentForm').formSerialize();
	
	$.ajax({
		type: "POST",
		url: _context +"/booking/senddocument/update",
		data: queryString,
		success: function(responseText){
			$("#sendDocumentForm").loadJSON(responseText.data);
			showResponseMessages(responseText.messages);
			$("#selectedContactId").get(0).options.length = 0;
	        $.each(responseText.data.contactList, function(index, contactList) {
	            $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
	        });
	        jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
			$("#availableContactList").val(responseText.data.availableContactList);
		}
	});
}

var digits = "0123456789";
//non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
//characters which are allowed in international phone numbers
//(a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
//Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

function isInteger(s)
{   var i;
 for (i = 0; i < s.length; i++)
 {   
     // Check that current character is number.
     var c = s.charAt(i);
     if (((c < "0") || (c > "9"))) return false;
 }
 // All characters are numbers.
 return true;
}
function trim(s)
{   var i;
 var returnString = "";
 // Search through string's characters one by one.
 // If character is not a whitespace, append to returnString.
 for (i = 0; i < s.length; i++)
 {   
     // Check that current character isn't whitespace.
     var c = s.charAt(i);
     if (c != " ") returnString += c;
 }
 return returnString;
}
function stripCharsInBag(s, bag)
{   var i;
 var returnString = "";
 // Search through string's characters one by one.
 // If character is not in bag, append to returnString.
 for (i = 0; i < s.length; i++)
 {   
     // Check that current character isn't whitespace.
     var c = s.charAt(i);
     if (bag.indexOf(c) == -1) returnString += c;
 }
 return returnString;
}

function checkInternationalPhone(strPhone){
	var bracket=4;
	strPhone=trim(strPhone);
	var brchr=strPhone.indexOf("(");
	if(strPhone.indexOf("+")>1){
		return false;
	}
	
	if(brchr!=-1 && brchr>bracket){
		return false;
	}
	
	if(brchr!=-1 && strPhone.charAt(brchr+4)!=")"){
		return false;
	}
	if(strPhone.indexOf("(")==-1 && strPhone.indexOf(")")!=-1){
		return false;
	}
	s=stripCharsInBag(strPhone,validWorldPhoneChars);
	return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}
var methodCode="00";
function checkForDefaultValue(value, colname) {
	if (colname ='communicationMethod' && value == 'default'){
	   return [false,'Please select Type'];	
	}
	else 
	{	
    	return [true,""];
	}
}
function checkForMethodValue(value, colname) {
	if(methodCode==3)
	{
		if(value.length<10 || value.length>20)
		{
			return [false,'Please enter a valid fax number'];
		}
		if (checkInternationalPhone(value)==false)
		{
			return [false,'Please enter a valid fax number'];
		}		
	}
	else if(methodCode==1 || methodCode==2)
	{
		if(value.length>50)
		{
			return [false,'Please enter a valid email address'];	
		}
		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		if(filter.test(value)==false)
		{
		   return [false,'Please enter a valid email address'];	
		} 
	}
	return [true,""];
}
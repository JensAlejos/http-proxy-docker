var options = {
	//beforeSubmit:showRequest,
	success : showResponseContact,
	datatype : 'json'
};
/************************ Document Ready Start *************************************************/
$(document).ready(function() {
	
	

/******************************** Security Block ******************************************************/

enforceSecurityDivAndButtons( "printFreightBillMainDiv", isprintfreightbillDisplayOnly);
enforceSecurityDivAndButtons( "saveandsend", isprintfreightbillSavensend);
enforceSecurityDivAndButtons( "shipmentHoldReleaseBtn",  isprintfreightbillHoldrelease);
enforceSecurityDivAndButtons( "print", isprintfreightbillPrint);
enforceSecurityDivAndButtons( "ediButton", isprintfreightbillEdi);
enforceSecurityDivAndButtons( "web", isprintfreightbillWeb);
enforceSecurityDivAndButtons( "statusButton", isprintfreightbillStatus);
enforceSecurityDivAndButtons( "issueBill", isprintfreightbillIssuebill);
enforceSecurityDivAndButtons( "cancel", isprintfreightbillDisplayOnly);
enforceSecurityDivAndButtons( "bill", isBillDisplayOnly);
enforceSecurityTitle(isprintfreightbillDisplayOnly);

enableDisableButtons();



	
/******************************** Security Block End *************************************************/

/******************************** Event Block Start **************************************************/

$('input[type=text]').keydown(function(event) {
   if(event.which==13) {
      event.preventDefault();
   }
});
		
/******************************** Event Block End ****************************************************/




/************************************ Autocomplete Block Start********************************************/

$('#copySendBillDocForm').validationEngine('attach');

$('.span-8').wrap('<div class="new" />');

var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355'
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
		$('#shipmentNumberHidden').val($('#shipmentNumber').val());
		
		
		$.ajax({
			async: false,
			type : "POST",
			url : _context + "/shipment/defaultShipmentSequenceNumber",
			data : {				
				shipment_number :$('#shipmentNumber').val(),
			},
			success : function(responseText) {
				var shipmentSequenceNumber=responseText.data;
				$('#shipmentSequenceNumber').val(shipmentSequenceNumber);
			}			
		});
		
	}
});



$('#shipmentSequenceNumber').gatesAutocomplete({
		source: 	_context+'/cas/autocomplete.do',
		extraParams: {
			method		:	'searchShpmntSeqNo',
			searchType	:	'354',
			parentSearch : function() { return $('#shipmentNumber').val();}
		},
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
			
			//$('#selectedPartyType').val('-1');
			$('#customerId').val(data.id);
			$('#customerName').attr('title',data.name);
			$('#customerName').val(data.name);
			$('#aroleId').val("");
			$('#aroleName').val("");
			singleAddressSelect();
			//addressRolePopupSearch();
		}
	});
	
	
	$('#selectedPrinterId').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do?method=printerNamePsearch&searchType=373' ,
		formatItem: function(data) {
			return  data.name;
		},
		formatResult: function(data) {
			return  data.name;
		}, 
		select: function(data) {
			$('#selectedPrinterId').val(data.name);					
			$('#selectedPrinterId').val(data.id); // gives Printer ID
		}
	});
	
	
	/*********************************Autocomplete Block End *************************************/
	
	
	/******************************** Popup Block ************************************************/
	 $("#customerName").gatesPopUpSearch({
		func : function() {
			addressRolePopupSearch()
		}
	});
	
	$('#selectedPrinterId').gatesPopUpSearch({
		func:function() {
			printeNamePopupSearch()
		}
	});
	
	/********************************* Change Block **********************************************/
	
	$('#selectedSC').change(function(){
		/*if($('#selectedSC').val()=="P") {
			if($('#webEmailIdForShipper').val()=="Not Found") {
				$('#web').attr("disabled","disabled");
			}
			else if($('#webEmailIdForShipper').val().trim()!=""){
				$('#web').removeAttr("disabled");
			}
		}
		else if($('#selectedSC').val()=="C") {
			if($('#webEmailIdForConsingee').val()=="Not Found") {
				$('#web').attr("disabled","disabled");
			}
			else if($('#webEmailIdForConsingee').val().trim()!=""){
				$('#web').removeAttr("disabled");
			}
		}
		else if($('#selectedSC').val()=="-1") {
				$('#web').attr("disabled","disabled");
		}*/
		enableDisableButtons();
	});
	
	$('#shipmentNumber').change(function(){
		$('#shipmentSequenceNumber').val("");
	});
	
	
	$('#selectedPartyType').change(function(){
		$("#contactGrid").jqGrid("clearGridData", true);
		if($('#selectedPartyType').val()=='-1')
		{  
			$("#selectedPartyType").val("-1");
			$("#selectedContactId").val("-1");
			$("#selectedContactId").attr("disabled",true);
			
			$('#aroleId').val("");
			$('#customerName').val("");
			$('#aroleName').val("");
			
			clearContactList();
			
			jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');		
			
		}
		else
		{
			$('#selectedPartyType').validationEngine('hideAll');
			$("#selectedContactId").attr("disabled",false);
			updateContactList();
		}
	});
	
	
	$('#selectedDocType').change(function(){
		$('#printOption').text('');
		$('#noOfCopies').val("");
		if($('#selectedDocType').val()=='-1')
		{
			
			$("#contactGrid").jqGrid("clearGridData", true);
			$("#selectedPartyType").val("-1");
			$("#selectedPartyType").attr("disabled",true);
				   
			$("#selectedContactId").val("-1");
			$("#selectedContactId").attr("disabled",true);
					
			$('#noOfCopies').val("");
			resetRatedUnrated();
			
			$('#customerId').val("");
			$('#aroleId').val("");
			$('#customerName').val("");
			$('#aroleName').val("");
			
			$("#Override").attr("checked",false);
			$("Override").attr("disabled",true);
			
			$('#webEmailIdForShipper').val('');
			$('#webEmailIdForShipper').val('');
			$('#webIds').val('');
			 document.getElementById("printOption").innerHTML="";
			clearContactList();
			enableDisableButtons()
			
		}
		else
		{ 
			$('#selectedDocType').validationEngine('hideAll');
				$("#contactGrid").jqGrid("clearGridData", true);
				updateDefaults();
			
			if($('#selectedDocType').val()!="NA"){
				$("#Override").attr("disabled",true);
				$("#Override").attr("checked",false);
			}
			if($('#selectedDocType').val()=="NA"){
				$("#Override").attr("disabled",false);
				$("#Override").attr("checked",false);
			}
			
			$("#selectedPartyType").attr("disabled",false);
			
			if($("#selectedPartyType").val()=="-1"){
				$("#selectedContactId").val("-1");
				$("#selectedContactId").attr("disabled",true);
			}
			
		}
	});
	
	$('#customerName').change(function() {
	 	if($('#customerName').val()=='')
		{
	 		
		//	$('#selectedPartyType').val('');
			$('#customerId').val("");
			$('#aroleId').val("");
			$('#aroleName').val("");
		}
	});
	
	$('#selectedContactId').change(function(){
	
		if($('#selectedContactId').val()=="-1"){
			
		}
		if($('#selectedContactId').val()!='-1')
		{
			//$("#saveandsend").attr("disabled","disabled");
			$('#copySendBillDocForm').attr('action','addToGrid/addPrimary');
			$('#copySendBillDocForm').ajaxSubmit(options);
		}
	});
	
	$('#ratedRadio').change(function(){

		$('#ratedRadio').validationEngine('hideAll');
		$('#isRated').val(true);
		if($('#selectedDocType').val()!=-1) {
			blockUI();
			$.ajax({
				async: true,
				type : "GET",
				url : _context + "/copySendBillDoc/getRatedAndCopies",
				data : {
					rated :'true'
				},
				success : function(responseText) {
					$('#noOfCopies').val(responseText.data.noOfCopies);
					$('#printOption').text(responseText.data.printOption);
					if($('#noOfCopies').val().trim()=='') {
						//$('#print').attr('disabled','disabled');
					}
					else {
						if($('#noOfCopies').val().trim()=="-32768") { 
							/*
							 * -32768 value is minimum short value which has been used in no of copies 
							 * when no print options are found but the print has to be allowed
							*/
							$('#noOfCopies').val('');
						}
						$('#print').removeAttr('disabled');
					}
					$.unblockUI();
				},
			});
		}
	});

$('#unRatedRadio').change(function(){
		$('#ratedRadio').validationEngine('hideAll');
		$('#isRated').val(false);
		if($('#selectedDocType').val()!=-1) {
			blockUI();
			$.ajax({
				async: true,
				type : "GET",
				url : _context + "/copySendBillDoc/getRatedAndCopies",
				data : {
					rated :'false'
				},
				success : function(responseText) {
					$('#noOfCopies').val(responseText.data.noOfCopies);
					$('#printOption').text(responseText.data.printOption);
					if($('#noOfCopies').val().trim()=='') {
						//$('#print').attr('disabled','disabled');
					}
					else {
						if($('#noOfCopies').val().trim()=="-32768") { 
							/*
							 * -32768 value is minimum short value which has been used in no of copies 
							 * when no print options are found but the print has to be allowed
							*/
							$('#noOfCopies').val('');
						}
						$('#print').removeAttr('disabled');
					}
						$.unblockUI();
				},
			});
		}
	});
	
	/********************************* Change Block End ******************************************/
	if($('#selectedDocType').val()!="-1" && $('#selectedDocType').val()!=null && $('#selectedDocType').val()!=undefined
			&& $("#selectedPartyType").val()!="-1" && $("#selectedPartyType").val()!=null && $("#selectedPartyType").val()!=undefined
			&& $("#selectedPartyType").get(0).options.length>1){
		
		
		if($('#defaultContactRequired').val().trim()=="true" || $('#defaultContactRequired').val()==true) {
			$('#selectedContactId').val($('#selectedContactId option:eq(1)').attr('value'));
			$('#selectedContactId').trigger('change');
		}
	}

	/*********************************  Click Block **********************************************/
	
	
	$('#saveandsend').click(function(){		
		saveandsend();
	});
	
	$('#bill').click(function() {
		blockUI();
		makeGridForReError("copySendBillDoc");
		rateBill();
	});
	
	$('#issueBill').click(function(){		
		issueBill();
	});
	
	$('#statusButton').click(function(){		
		document.location.href=_context+'/bill_status_history/find?shipmentNumber='+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber='+$('#shipmentCorrectionNumber').val()+'&navigationUrl=1';
	});
	
	$('#print').click(function(){	
		// document.location.href='${pageContext.servletContext.contextPath}/copySendBillDoc/go?shipmentNumber='+
		//$('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()
		//+'&shipmentCorrectionNumber='+$('#shipmentCorrectionNumber').val();	
		
		if($("#ratedRadio").is(':checked')==false && $("#unRatedRadio").is(':checked')==false){
			$("#ratedRadio").validationEngine('showPrompt', 'Please select rated/unrated', 'error', 'topRight', true);
			return;
		}
		
		$("#isRated").val(false);
		if($("#ratedRadio").is(':checked')){
			$("#isRated").val(true);
			}
		
		if($('#selectedDocType').val()=="FB"){
			$("#isRated").val(true);
		}
		/*var noOfCopies=0;
		if($("#noOfCopies").val()!=""||$("#noOfCopies").val()!=null){
			noOfCopies=$("#noOfCopies").val();
		}*/
		if($('#noOfCopies').val().trim()=="") {
			$("#noOfCopies").validationEngine('showPrompt', 'Please enter no. of copies for print', 'error', 'topRight', true);
			return;
		}
		if($('#noOfCopies').val()<=0) {
			$("#noOfCopies").validationEngine('showPrompt', 'No. of copies should be greater than zero for print', 'error', 'topRight', true);
			return;
		}
		if($('#selectedPrinterId').val().trim()=="") {
			$("#selectedPrinterId").validationEngine('showPrompt', 'Please Select Printer To Print', 'error', 'topRight', true);
			return;
		}
		if($('#selectedDocType').val()!="-1"){
			if($('#selectedPartyType').val()!="-1"){
			$('#selectedDocType').validationEngine('hideAll');
			$('#selectedPartyType').validationEngine('hideAll');
			
			if($('#Override').attr('checked')=='checked') {
				$('#isOverride').val(true);
			}
			else{
				$('#isOverride').val(false);
			}
				
			
			
			/*var url='../copySendBillDoc/printPDF/?docType='+$('#selectedDocType').val()+'&partyCode='+$('#selectedPartyType').val()
			+'&ratecode='+rated+'&copies='+copies;
     	    var newWindow = window.open(url,'name','height=500,width=500');
     	    newWindow.print();*/
	     	
			var optionsForAjax = { 
					beforeSubmit:  queryRequest,  // pre-submit callback 
					success:       successResponse,  // post-submit callback 
					dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
				}; 
				
			$('#copySendBillDocForm').attr('action','printPDF');
			$('#copySendBillDocForm').attr('method','POST');
			blockUI();
			$('#copySendBillDocForm').ajaxSubmit(optionsForAjax);
			
			function queryRequest(formData, jqForm, options) {  
				var queryString = $.param(formData); 
				return true; 
			} 
			
			function successResponse(responseText, statusText, xhr, $form)  { 
				$.unblockUI();
				if (responseText.messages) {
					var messages = responseText.messages;
					showResponseMessages(messages)
				}
			} 
			}
			else{
	     		$("#selectedPartyType").validationEngine('showPrompt', 'Please Select Party Type To Print', 'error', 'topRight', true);
	     		return;
	     	}
			
		}
		else{
			$("#selectedDocType").validationEngine('showPrompt', 'Please Select Document Type To Print', 'error', 'topRight', true);
			return;
		}
	});
	
	
	$('#web').click(function(){	
		// document.location.href='${pageContext.servletContext.contextPath}/copySendBillDoc/go?shipmentNumber='+
		//$('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()
		//+'&shipmentCorrectionNumber='+$('#shipmentCorrectionNumber').val();	
		
		if($("#ratedRadio").is(':checked')==false && $("#unRatedRadio").is(':checked')==false){
			$("#ratedRadio").validationEngine('showPrompt', 'Please select rated/unrated', 'error', 'topRight', true);
			return;
		}
		
		
		$("#isRated").val(false);
		if($("#ratedRadio").is(':checked')){
			$("#isRated").val(true);
			}
		/*var copies=0;
		if($("#copies").val()!=""||$("#copies").val()!=null){
			copies=$("#copies").val();
		}*/
		if($('#selectedSC').val()=="-1"){
			$('#selectedSC').validationEngine('showPrompt', 'Please select shipper/consignee', 'error', 'topRight', true);
			return;
		}
		
		if($('#selectedDocType').val()!="-1"){
			$('#selectedDocType').validationEngine('hideAll');
			var optionsForAjax = { 
					beforeSubmit:  webRequest,  // pre-submit callback 
					success:       webResponse,  // post-submit callback 
					dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
				}; 
				
			$('#copySendBillDocForm').attr('action','web');
			$('#copySendBillDocForm').attr('method','POST');
			blockUI()
			$('#copySendBillDocForm').ajaxSubmit(optionsForAjax);
			
			function webRequest(formData, jqForm, options) {  
				var queryString = $.param(formData); 
				return true; 
			} 
			
			function webResponse(responseText, statusText, xhr, $form)  { 
				$.unblockUI();
				if (responseText.messages) {
					var messages = responseText.messages;
					showResponseMessages(messages)
				}	
			} 
			
		}
		else{
			$("#selectedDocType").validationEngine('showPrompt', 'Please Select Document Type', 'error', 'topRight', true);
			return;
		}
	});
	
	$('#cancel').click(function(){
		if($('#source').val()=="FC")
			{
			  document.location.href=_context+"/bill/frtcorrection/find?shipmentNumber="+$('#shipmentNumber').val()+"&shipmentSequenceNumber="+$('#shipmentSequenceNumber').val()+"&shipmentCorrectionNumber=000";
			}
		else if($('#source').val()=="maintainBill")
			{
				document.location.href=_context+"/shipment/showForm";
			}
		else if($('#source').val()=="maintainRate")
		{
			document.location.href=_context+"/maintainRate/showform";
		}			
		else
		{
				document.location.href=_context+"/welcome.html";
		}
	});
	
	$("#ediButton").click(function(){
		
		
		blockUI();
		$.ajax({
			type : "POST",
			url : _context + "/copySendBillDoc/edi",
			data : {				
				selectedSC :$('#selectedSC').val(),
			},
			success : function(responseText) {
				if (responseText.messages) {
					var messages = responseText.messages;
					showResponseMessages(messages)
				}
				$.unblockUI();
			},
			error:function(){
				$.unblockUI();
			}
		});
	});
	
	
	
	$('#Override').click(function(){
		if($('#Override').attr('checked')=="checked") {
			 $('#saveandsend').attr('disabled','disabled');
		}
		else {
			if($('#shipment').val()!="DOMESTIC" && $('#statusCode').val()!="RATD") {
				 var selectedRows=$("#contactGrid").jqGrid('getGridParam','selarrrow');
				 if(selectedRows.length>=1 && $('#selectedDocType').val()!="-1") {
				 	$('#saveandsend').removeAttr('disabled');
				 }
				 else {
					 $('#saveandsend').attr('disabled','disabled');
				 }
			 }
			 else {
				 if($('#statusCode').val()=="RATD") {
					 $('#saveandsend').attr('disabled','disabled');
				 }
				 else {
					 var selectedRows=$("#contactGrid").jqGrid('getGridParam','selarrrow');
					 if(selectedRows.length>=1 && $('#selectedDocType').val()!="-1") {
					 	$('#saveandsend').removeAttr('disabled');
					 }
					 else {
						 $('#saveandsend').attr('disabled','disabled');
					 }
				 }
			 }
		}
	});
	/********************************* Click Block End *******************************************/
	resetRatedUnrated();
	
	enableEnterEvent();
	tabSequence('#copySendBillDocForm',false,false);
	});

/************************ Document Ready End *************************************************/
	
	
	/*****************************************  Function Block Start ********************************/
	
function singleAddressSelect(){
	
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+$('#customerId').val(),						
	
		success : function(responseText) {
			
			if(responseText.length == 1){
				var finalAddress =responseText[0].stAdd+","+responseText[0].city+","+responseText[0].state+"-"+responseText[0].zip+" "+responseText[0].cntry;
				$('#aroleName').val(finalAddress);
				$('#aroleId').val(responseText[0].addRole);
				searchAndPopulateAllContacts(responseText[0].addRole);
				
			} else {
				addressRolePopupSearch();
		}
			
		}
	});
}

function enableEnterEvent() {
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$("#shipmentSequenceNumber").val('');
			$('#go').click();
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#go').click();
		}
	});
}


function printeNamePopupSearch() {
	var actionUrl = _context+'/cas/printerNamelookup.do?filterValue1='+$('#selectedPrinterId').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'PrinterNameSearch', windowStyle);
}

function printerNameSearchUpdate(id) {
	var values = id.split("|");
	var printerName = values[0];
	var printerId = values[1];
	$('#selectedPrinterId').val(printerName);					
}

function addressRolePopupSearch() {
	if($('#customerName').val()!=""){
		 if ($('#customerId').val()) {	
			var url = '../../gates/cas/addressRolemainlookup.do?filterValue1='+$('#customerId').val();
			winBRopen(url,'winpops','700','500','no','no'); 
		}	
	}
	else {
		alert('Please select organization.');
	} 
}
function winBRopen(theURL, Name, popW, popH, scroll, loc) {
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
	Win = window.open(theURL, Name, winProp);
	if (parseInt(navigator.appVersion) >= 4) {
		Win.window.focus();
	}
}

function addressRoleSearchUpdate(id){
	var values = id.split("|");
	$('#aroleId').val(values[0]);
	searchAndPopulateAllContacts(values[0]);
	var address="";
	if(values[2]!=null && values[2]!="null")	{
		address=address+values[2]+" ";
	}
	if(values[4]!=null) {
		var addr=values[4].split(',');
		if(addr!=null && addr!="null" && addr[0]!=null && addr[0]!="null") {
			address=address+addr[0]+",";
		}
	}
	if(values[6]!=null && values[6]!="null") {
		address=address+values[6]+",";
	}
	if(values[7]!=null && values[7]!="null") {
		address=address+values[7]+"-";
	}
	if(values[8]!=null && values[7]!="null") {
		address=address+values[8]+" ";
	}
	if(values[9]!=null && values[9]!="null") {
		address=address+values[9];
	}
	$('#aroleName').val(address.trim()); 
}

function showRequest(formData, jqForm, options) { 
    var queryString = $.param(formData); 
    return true; 
}

function showResponse(responseText, statusText, xhr, $form)  { 
	$('#customerId').val(responseText.data.customerId);
	$('#customerName').val(responseText.data.customerName);
	$('#aroleName').val(responseText.data.aroleName);
	$("#selectedContactId").get(0).options.length = 0;
	$("#selectedContactId").val(responseText.data.selectedContactId);
	$('#noOfCopies').val(responseText.data.noOfCopies);
    $.each(responseText.data.contactList, function(index, contactList) {
        $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
    });
    
    resetRatedUnrated();
    
    if($('#selectedDocType').val()!="-1" && $('#selectedDocType').val()!=null 
    		&& $("#selectedPartyType").val()!="-1" && $("#selectedPartyType").val()!=null
    		&& $("#selectedPartyType").get(0).options.length>1){
	    setTimeout(function(){
			var noOfRecords=jQuery("#contactGrid").jqGrid('getGridParam', 'records');
			if(noOfRecords==0) {
				$('#selectedContactId').val($('#selectedContactId option:eq(1)').attr('value'));
				$('#selectedContactId').trigger('change');
			}
		},10);
    }
    
	//jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
    
} 



function updateParty(responseText, statusText, xhr, $form)  { 
	$("#selectedPartyType").get(0).options.length = 0;
	$('#customerId').val(responseText.data.customerId);
	document.getElementById("printOption").innerHTML=responseText.data.printOption;
	 
	$.each(responseText.data.partyTypeList, function(index, partyTypeList) {
		$("#selectedPartyType").get(0).options[$("#selectedPartyType").get(0).options.length] = new Option(partyTypeList.description, partyTypeList.code);
	});
	$("#selectedPartyType").val(responseText.data.defaultPartyType);
	$("#selectedContactId").get(0).options.length = 0;
	$("#selectedContactId").val(responseText.data.selectedContactId);
	$('#noOfCopies').val(responseText.data.noOfCopies);
	$.each(responseText.data.contactList, function(index, contactList) {
	    $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
	});
	if( $("#selectedPartyType").val()=="-1"){
		$('#customerName').val("");
		$('#aroleName').val("");
		$('#noOfCopies').val("");
		$("#selectedContactId").val("-1");
		$("#selectedContactId").attr("disabled",true);
		$('#printOption').val("");
		document.getElementById("printOption").innerHTML="";
	 }
	 else {
			$("#selectedContactId").attr("disabled",false);
			$('#customerName').val(responseText.data.customerName);
			$('#aroleName').val(responseText.data.aroleName);
			
			document.getElementById("printOption").innerHTML=responseText.data.printOption;
	}
		
	
    
} 


function updateContactList(){
	var queryString = $('#selectedPartyType').val();
	
	var options = { 
	        beforeSubmit:  showRequest,  // pre-submit callback 
	        success:       showResponse,  // post-submit callback 
	        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
	    };
	
	$("#copySendBillDocForm").attr('action','update');
	$("#copySendBillDocForm").attr('method','post');
	$("#copySendBillDocForm").ajaxSubmit(options);
	
}


function showDefaults(responseText, statusText, xhr, $form)  { 
	
	resetRatedUnrated();
	document.getElementById("printOption").innerHTML="";
	
	 $("#selectedPartyType").get(0).options.length = 0;
	 
	 $('#customerName').val("");
		$('#aroleName').val("");
		$('#noOfCopies').val("");
		
		$("#selectedContactId").val("-1");
		
		$('#printOption').val("");
		$('#webIds').val("");
	 
	 
	 $('#customerId').val(responseText.data.customerId);
	 $('#webIds').val(responseText.data.webIds);
	 
	 document.getElementById("printOption").innerHTML=responseText.data.printOption;
	
		//$("#selectedPartyType").val(responseText.data.selectedPartyType);
	 $.each(responseText.data.partyTypeList, function(index, partyTypeList) {
	        $("#selectedPartyType").get(0).options[$("#selectedPartyType").get(0).options.length] = new Option(partyTypeList.description, partyTypeList.code);
	    });
	    $("#selectedPartyType").val(responseText.data.defaultPartyType);
		$("#selectedContactId").get(0).options.length = 0;
		$("#selectedContactId").val(responseText.data.selectedContactId);
		
	    $.each(responseText.data.contactList, function(index, contactList) {
	        $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
	    });
	    if($("#selectedPartyType").val()=="-1"){
	    	$("#selectedContactId").attr("disabled","disabled");
		}
		else{
		 	document.getElementById("printOption").innerHTML=responseText.data.printOption;
			$('#customerName').val(responseText.data.customerName);
			$('#aroleName').val(responseText.data.aroleName);
			$('#noOfCopies').val(responseText.data.noOfCopies);
			$("#selectedContactId").removeAttr("disabled");
			if($('#selectedDocType').val()!="-1" && $('#selectedDocType').val()!=null 
		    		&& $("#selectedPartyType").val()!="-1" && $("#selectedPartyType").val()!=null
		    		&& $("#selectedPartyType").get(0).options.length>1){
				setTimeout(function(){
					if(responseText.data.defaultContactRequired=="true" || responseText.data.defaultContactRequired==true) {
						$('#selectedContactId').val($('#selectedContactId option:eq(1)').attr('value'));
						$('#selectedContactId').trigger('change');
					}
				},10);
			}
		}
		

	$('#webEmailIdForConsingee').val(responseText.data.webEmailIdForConsingee);
	$('#webEmailIdForShipper').val(responseText.data.webEmailIdForShipper);
	checkForEnableDisableButtons(responseText);
	//selectedDocDefaultValue(responseText);
	//selectPartyDefault(responseText);
	//selectedContactIdDefault(responseText);
	//ratedEnableDisable(responseText);
	
	overrideEnableDisable(responseText);
	
	
	jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');

	$.unblockUI();
	

} 

function updateDefaults(){
	var queryString = $('#selectedPartyType').val();
	
	var options = { 
			
	        beforeSubmit:  showRequest,  // pre-submit callback 
	        success:      showDefaults,  // post-submit callback 
	        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
	    };
	$('#copySendBillDocForm').attr('action','getDefaultValues');
	blockUI();
	$("#copySendBillDocForm").attr('method','post');
	$("#copySendBillDocForm").ajaxSubmit(options);
	
}


function updatePartyList(){
	var queryString = $('#selectedPartyType').val();
	
	var options = { 
			
	        beforeSubmit:  showRequest,  // pre-submit callback 
	        success:      updateParty,  // post-submit callback 
	        dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
	    };
	$('#copySendBillDocForm').attr('action','updatePartyList');
	$("#copySendBillDocForm").attr('method','post');
	$("#copySendBillDocForm").ajaxSubmit(options);
	
}

function showNonExistBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Shipment not found.</div>");
	$('#msgDiv').show();
}

function showSuccessLoadingBillMessage() {
	$('#msgDiv').html("<div class=\"message_info\">Bill successfully loaded.</div>");
	$('#msgDiv').show();
}

function callAllDefaultFunction(responseText){
	checkForEnableDisableButtons(responseText);
	selectedDocDefaultValue(responseText);
	selectPartyDefault(responseText);
	selectedContactIdDefault(responseText);
	ratedEnableDisable(responseText);
	overrideEnableDisable(responseText);
}

function checkForEnableDisableButtons(responseText){
	
	$('#emailAllowed').val(responseText.data.emailAllowed);
	$('#printAllowed').val(responseText.data.printAllowed);
	$('#faxAllowed').val(responseText.data.faxAllowed);
	$('#webAllowed').val(responseText.data.webAllowed);
	//$('#ediBtn').val(responseText.data.ediAllowed);
	enableDisableButtons();
}

function enableDisableButtons(){
	
	/**************************************** Save and Send Enable/Disable *******************************/
	if($('#shipment').val()!="DOMESTIC" && $('#statusCode').val()!="RATD") {
		 var selectedRows=$("#contactGrid").jqGrid('getGridParam','selarrrow');
		 if(selectedRows!=undefined && selectedRows.length>=1 && $('#Override').attr('checked')!="checked") {
			 if($('#selectedDocType').val()!="-1") {
				 $('#saveandsend').removeAttr('disabled');
				 return;
			 }
		 	
		 }
		 else {
			 $('#saveandsend').attr('disabled','disabled');
		 }
	 }
	 else {
			 if($('#Override').attr('checked')!="checked") {
				 var selectedRows=$("#contactGrid").jqGrid('getGridParam','selarrrow');
				 if(selectedRows!=undefined && selectedRows.length>=1) {
					 if($('#selectedDocType').val()!="-1") {
				 		$('#saveandsend').removeAttr('disabled');
					 }
				 }
				 else {
					 $('#saveandsend').attr('disabled','disabled');
				 }
			 }
	 }
	/**************************************** Save and Send Enable/Disable End*******************************/
	
	if($('#shipmentNumber').val().trim()=='' || $('#shipmentSequenceNumber').val().trim()=='') {
		$('#print').attr("disabled","disabled");
		$('#web').attr("disabled","disabled");
		$('#saveandsend').attr("disabled","disabled");
		$('#ediButton').attr("disabled","disabled");
		$('#statusButton').attr("disabled","disabled");
	}
	else if($('#selectedDocType').val()==null || $('#selectedDocType').val()=="-1" || $('#selectedDocType').val().trim()==""){
		
		$('#print').attr("disabled","disabled");
		$('#web').attr("disabled","disabled");
		$('#saveandsend').attr("disabled","disabled");
		//$('#ediButton').attr("disabled","disabled");
		
		if($('#ediBtn').val()=="false"){
			//$("#ediButton").attr("disabled","disabled");
		}
		else{
			$("#ediButton").removeAttr('disabled');
		}
		
	}
	else {
		$('#statusButton').removeAttr("disabled");
		
		/***************************** Print Button Enable/Disable ******************************/
		
		if($('#printAllowed').val()=="true" && $('#noOfCopies').val().trim()!=''){
			$("#print").removeAttr("disabled");
		}
		else{
			$("#print").attr("disabled","disabled");
		}
		
		/***************************** Print Button Enable/Disable ******************************/
		
		
		/***************************** Web Button Enable/Disable ******************************/
		/*if($('#selectedSC').val()=="-1"){
			$('#web').attr("disabled","disabled");
		}
		else */
		if($('#webAllowed').val()=="true"){
			if($('#webIds').val()=="Not Found") {
				$('#web').attr("disabled","disabled");
			}
			else if($('#webIds').val().trim()!=""){
				$('#web').removeAttr("disabled");
			}
		}
		else{
			$("#web").attr("disabled","disabled");
		}
		/***************************** Web Button Enable/Disable End******************************/
		
		if($('#ediBtn').val()=="false"){
			//$("#ediButton").attr("disabled","disabled");
		}
		else{
			$("#ediButton").removeAttr('disabled');
		}
	}
	
	
	
	if($('#holdReleaseBtn').val()=="false"){
		$("#holdrelease").attr("disabled","disabled");
	}
	else{
		$("#holdrelease").removeAttr('disabled');
	}
	
	if($('#statusCode').val()=="ISSD" || $('#statusCode').val()=="CORR" || $('#statusCode').val()=='') {
		$(" #bill").attr("disabled","disabled");
		$("#shipmentHoldReleaseBtn").attr("disabled","disabled");
	}
	else {
		 $("#bill").removeAttr("disabled");
		 $("#shipmentHoldReleaseBtn").removeAttr("disabled");
	}
	
	$("#issueBill").attr("disabled","disabled");
	if($('#statusCode').val()=="RATD") {
		$("#issueBill").removeAttr("disabled");
	}
}


function selectedDocDefaultValue(responseText) {
	if(responseText.data.defaultDocType=="-1") {
		$("#selectedDocType").val(responseText.data.defaultDocType);
		selectedDocType=responseText.data.defaultDocType;
		$("#contactGrid").jqGrid("clearGridData", true);
		$("#selectedPartyType").val("-1");
		$("#selectedPartyType").attr("disabled",true);
		$('#noOfCopies').val("");
		$('#customerName').val("");
		$('#aroleName').val("");   
		$("#selectedContactId").val("-1");
		$("#selectedContactId").attr("disabled",true);
			
		$('#noOfCopies').val("");
		
		resetRatedUnrated();
	}    	
	else {
		$("#selectedDocType").val(responseText.data.defaultDocType);
		$('#noOfCopies').val(responseText.data.noOfCopies);
		resetRatedUnrated();
	 
		
		if($('#selectedDocType').val()!="NA"){
			$("#Override").attr("disabled",true);
			$("#Override").attr("checked",false);
		}
	}
}

function selectPartyDefault(responseText){
	if($("#selectedDocType").val() !="-1"){
		$("#selectedPartyType").val(responseText.data.defaultPartyType);
	}
	else{
		$("#selectedPartyType").val("-1");
	}
}


function selectedContactIdDefault(responseText){
	if(responseText.data.defaultContactId=="99"){
		$("#selectedContactId").val("99");
		$("#selectedContactId").attr("disabled",true);
	}
	else {
		if(responseText.data.defaultPartyType=="-1"){
			$("#selectedContactId").val("-1");
	     	$("#selectedContactId").attr("disabled",true);
		}	
		else{
			if(responseText.data.selectedContactId==null&&responseText.data.defaultContactId!="-1"){
				$("#selectedContactId").val(responseText.data.defaultContactId);
				$("#selectedContactId").attr("disabled",false);
			}
			else{
				if(responseText.data.selectedContactId=="-1"&&responseText.data.defaultContactId=="-1"){
					$("#selectedContactId").val("-1");
					$("#selectedContactId").attr("disabled",true);
				}
				else{
					if(responseText.data.selectedContactId=="-1"){
						$("#selectedContactId").val("-1");
						$("#selectedContactId").attr("disabled",true);
					}
					else{
						$("#selectedContactId").val(responseText.data.selectedContactId);
						$("#selectedContactId").attr("disabled",false);
					}		
				}
			}
		}
	 }			
}

function ratedEnableDisable(responseText){
	if(responseText.data.selectedDocType=="-1"){
		$("#ratedRadio").removeAttr("disabled");
		$("#unRatedRadio").removeAttr("disabled");
		    	
		$("#ratedRadio").removeAttr("checked");
		$("#unRatedRadio").removeAttr("checked");
				
	}
	else{
		if(responseText.data.rated==true){
			if(responseText.data.selectedDocType=="FB"){
				$("#ratedRadio").removeAttr("disabled");
				$("#ratedRadio").attr("checked","checked");
				$("#ratedRadio").trigger('change');
				$("#ratedRadio").attr("disabled",true);
				$("#unRatedRadio").attr("disabled",true);
					
				
				$("#unRatedRadio").removeAttr("checked");
			}
		}
		else if (responseText.shipment=="INTERNATIONAL"
				&& (responseText.statusCode=="RATD" || 
						responseText.statusCode=="AUDT") &&
						responseText.selectedDocType=="NN") {
			$("#ratedRadio").removeAttr("disabled");
			$("#unRatedRadio").removeAttr("checked");
			$("#ratedRadio").attr("checked","checked");
			$("#ratedRadio").trigger('change');
			
		}
		else {
				$("#ratedRadio").removeAttr("checked");
				$("#unRatedRadio").removeAttr("checked");
				$("#ratedRadio").removeAttr("disabled");
				$("#unRatedRadio").removeAttr("disabled");
			}
		 
	}
}

function overrideEnableDisable(responseText){
	if(responseText.data.override=='true'){
		$("#Override").attr("disabled",true);
	}
	else{
		if(responseText.data.selectedDocType!="NA"){
			$("#Override").attr("checked",false);
			$("#Override").attr("disabled",true);
		}
				
	}
			
}

function saveandsend(){
	if($("#ratedRadio").is(':checked')==false && $("#unRatedRadio").is(':checked')==false){
		$("#ratedRadio").validationEngine('showPrompt', 'Please select rated/unrated', 'error', 'topRight', true);
		return;
	}
		 
	if($('#selectedDocType').val()=="-1") {
		 $('#selectedDocType').validationEngine('showPrompt', 'Please Select Document Type', 'error', 'topRight', true);
		 return;
	 }
		 
		 
	if($('#selectedSC').val()=="-1") {
		$("#selectedSC").validationEngine('showPrompt', 'Please Select Shipper/Consignee', 'error', 'topRight', true);
	}
	else {
		$("#isRated").val(false);
		if($("#ratedRadio").is(':checked')){
			$("#isRated").val(true);
		}
	
		var selectedContacts = jQuery("#contactGrid").jqGrid('getGridParam','selarrrow');
		var alreadySelectedContacts=$("#alreadySelectedContacts").val();
		var alreadySelectedId="";
		var  alreadySelectedContactArray = alreadySelectedContacts.split(",");
		var anySelected=false;
		for(var i=0;i<alreadySelectedContactArray.length;i=i+1)
		{
			alreadySelectedId=alreadySelectedContactArray[i];
			if($(alreadySelectedId).is(':checked')){
				anySelected=true;
			}
		}
		if(!anySelected){
			alert("Please Select atleast one contact");
			return;
		}
		else {
			for(var i=0;i<alreadySelectedContactArray.length;i=i+1){
				alreadySelectedId=alreadySelectedContactArray[i];
				var selID =alreadySelectedId.replace("#jqg_contactGrid_","");
				var isAlreadyPresent=false;
				if($(alreadySelectedId).is(':checked')){
					isAlreadyPresent=checkForAlreadypresent(selID);
					if(!isAlreadyPresent){
						selectedContacts.push(selID);
					}
				}
			}
			$("#selectedContacts").val(selectedContacts);
			var communicationMethodGrid = jQuery("#contactGrid").jqGrid('getCell', selectedContacts, 'communicationMethodGrid');
			var options = { 
						beforeSubmit:  showRequest,  // pre-submit callback 
						success:      saved,  // post-submit callback 
						dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
					};
			$('#copySendBillDocForm').attr('action','savensend');
			$("#copySendBillDocForm").attr('method','post');
			blockUI();
			$("#copySendBillDocForm").ajaxSubmit(options);
			
		}
	}
}


function  	checkForAlreadypresent(id){
	var selID=id;
	var isAlreadyPresent=false;
	for(var i=0;i<selectedContacts.length;i=i+1){
		if(selectedContacts[i]==selID){
			isAlreadyPresent=true;
			break;
		}
	}
	return isAlreadyPresent;
}

function issueBill(){
	// D032686: 	New Issue in Gates at billing level. 
	// remove doc type check.
	blockUI();
	$.ajax({
		async: true,
		type : "POST",
		url : _context + "/copySendBillDoc/issuebill",
		data : {
			shipment_number :$('#shipmentNumber').val(),
			shipment_sequence_number :$('#shipmentSequenceNumber').val(),
		},
		success : function(responseText) {
			$.unblockUI();
			var messages = responseText.messages;
			if(messages.success.length > 0){
				document.getElementById('status').innerHTML='ISSUED';
				$('#statusCode').val('ISSD');
				$('#issueBill').attr('disabled','disabled');
				$('#bill').attr('disabled','disabled')
			}
			showResponseMessages(messages);
		},
		error:function(responseText) {
			$.unblockUI();
			var messages = responseText.messages;
			showResponseMessages(messages);
			
		}
	});
	
}

function clearContactList(){			
    var options = { 
			    beforeSubmit:  showRequest,  // pre-submit callback 
			    success:      clearList,  // post-submit callback 
			    dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
			    };
	$('#copySendBillDocForm').attr('action','clearList');
	$("#copySendBillDocForm").attr('method','get');
	$("#copySendBillDocForm").ajaxSubmit(options);	    
}

function saved(responseText, statusText, xhr, $form)  { 
	$.unblockUI();
	if (responseText.messages) {
		var messages = responseText.messages;
		showResponseMessages(messages)
	}
	jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
} 

function issuedBill(responseText, statusText, xhr, $form)  { 
	$('#msgDiv').html("<div class=\"message_info\"> Successfully Issued</div>");
	$('#msgDiv').show();	
}

function clearContactList(){			
	var options = { 
			    beforeSubmit:  showRequest,  // pre-submit callback 
			    success:      clearList,  // post-submit callback 
			    dataType:  'json'        // 'xml', 'script', or 'json' (expected server response type) 
		    };
	$('#copySendBillDocForm').attr('action','clearList');
	$("#copySendBillDocForm").attr('method','get');
	$("#copySendBillDocForm").ajaxSubmit(options);
}
		
function clearList(responseText, statusText, xhr, $form)  { 
	jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
}

function searchAndPopulateAllContacts(aroleid){		
	$.ajax({
			async: true,
			type : "POST",
			url : _context + "/copySendBillDoc/searchAndPopulateAllContacts",
			data : {
				aroleid :aroleid,
			},
			success : function(responseText) {
				var messages = responseText.messages;
				$("#contactGrid").jqGrid("clearGridData", true);
				$("#selectedPartyType").val("-1");
				$("#selectedContactId").val("-1");
				$("#selectedContactId").get(0).options.length = 0;
			    $.each(responseText.data.contactList, function(index, contactList) {
			        $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
			    });

				    
			    $("#selectedContactId").attr("disabled",false);
			    $("#selectedPartyType").attr("disabled",false);
			    jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
			},
			error:function(responseText) {
					var messages = responseText.messages;
					showResponseMessages(messages);
					
			}
	});
}


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
	if (messageContent != '') {
		$('#msgDiv').html(messageContent);
		window.scrollTo(0, 0);
	}
}
// post-submit callback 
function showResponseContact(responseText, statusText, xhr, $form) {

	if (responseText.messages) {
		var messages = responseText.messages;
		showResponseMessages(messages);
	}
	
	if(responseText.success)
	{
		
		jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
	}

}

function rateBill(){
	
	var queryString = $("#copySendBillDocForm").formSerialize();
	$.ajax({
		type : "POST",
		url : _context + "/copySendBillDoc/rateBill",
		data : queryString,
		success : function(responseText) {
			$.unblockUI();
			if (responseText.messages.error.length == 0) {
				
				if(responseText.data.rateView == "showError"){
					$("#copySendBillDocForm").loadJSON(responseText.data);
					loadErrorOverLay(responseText);		

					
					$('#re_error_dialog').dialog( "open" );
					$("#reErrorGrid").trigger('reloadGrid');
				}else if(responseText.data.rateView == "showChoices"){
					$("#copySendBillDocForm").loadJSON(responseText.data);
					loadChoiceOverLay(responseText);
					$('#re_choice_dialog').dialog( "open" );
//					createChoiceGrid('/billLadingPayable');
					$("#reChoiceGrid").trigger('reloadGrid');
				}if(responseText.data.rateView == "hold"){
//					if(responseText.data.targetPage == "Print Bill"){
//						openHoldsUnreleasedDialog('rateBill');
//						$('#holdUnreleasedGrid').trigger('reloadGrid');
//						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//					}
//					else{
						navigateToTargetPage('',responseText.data.targetPage, 
								$("#shipmentNumber").val(), $("#shipmentSequenceNumber").val(),$("#shipmentCorrectionNumber").val(),
								"BLRT");
//					}
				}if(responseText.data.rateView == "exception"){
					$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
					return;
				}else if(responseText.data.rateView == "blank"){
					$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
					openHoldsUnreleasedDialog('shipment');
				}
				else if(responseText.data.rateView == "Success"){
					showResponseMessages(responseText.messages);
					document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
					$("#shipmentNumber").val()+'&shipmentSequenceNumber='+$("#shipmentSequenceNumber").val()
					+'&shipmentCorrectionNumber=000&navigationUrl=copySendBillDoc&commodityDisplay=last';
				}
				
			}
		}
	});
}


function concludeRating(id){		
	$('#re_choice_dialog').dialog( "close" );
	
	var url = "";
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/copySendBillDoc/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		url = "/copySendBillDoc/concludeRating?id="+id;
	}
	
	$.ajax({
		   type: "POST",				   							   
		   url: _context + url,
		   success: function(responseText){			   
			   if (responseText.data.rateView == "showError") {
					loadErrorOverLay(responseText);		

					$('#re_error_dialog').dialog('open');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
				}else if(responseText.data.rateView == "showChoices"){
					loadChoiceOverLay(responseText)
					$('#re_choice_dialog').dialog('open');
					$("#ratingChoiceForm").loadJSON(responseText.data);
//					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
					if(responseText.data.isAllChoicesUnSelectable != null 
							&& responseText.data.isAllChoicesUnSelectable == "Y"){
						$('#reChoiceCloseBtn').hide();	
						$('#reChoiceContinueBtn').show();
					}else{
						$('#reChoiceCloseBtn').show();	
						$('#reChoiceContinueBtn').hide();	
					}											
				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#copySendBillDocForm').loadJSON(responseText.data);
					showResponseMessages(responseText.messages);
				}
				else {
					$('#copySendBillDocForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					showResponseMessages(responseText.messages);
				}	
			   
		   }
	});	
}

function resetRatedUnrated() {
	$("#ratedRadio").attr("disabled",true);
	$("#unRatedRadio").attr("disabled",true);
	$("#ratedRadio").removeAttr("checked");
	$("#unRatedRadio").removeAttr("checked");
	if($('#selectedDocType').val()!="-1" && $('#selectedDocType').val()!=null && 
			$('#selectedDocType').val()!=undefined && $('#selectedDocType').val().trim()!="") {
		$("#ratedRadio").removeAttr("disabled");
		$("#unRatedRadio").removeAttr("disabled");
		$("#ratedRadio").removeAttr("checked");
		$("#unRatedRadio").removeAttr("checked");
	}
	
	if($('#selectedDocType').val()=="FB"){
		$("#ratedRadio").attr("checked","checked");
		$("#ratedRadio").trigger('change');
		$("#ratedRadio").attr("disabled",true);
		$("#unRatedRadio").attr("disabled",true);
	}
	else 
		if($('#shipment').val().trim()=="INTERNATIONAL"
			&& ($('#statusCode').val().trim()=="RATD" || 
					$('#statusCode').val().trim()=="AUDT") &&
					$('#selectedDocType').val().trim()=="NN") {
		$("#ratedRadio").attr("checked","checked");
		$("#ratedRadio").trigger('change');
	}
}


/***************************************** Function Block End ***********************************/
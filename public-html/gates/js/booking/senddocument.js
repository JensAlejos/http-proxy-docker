var options = {
		beforeSubmit:showRequest,
		success : showResponse,
		datatype : 'json'
	};

//pre-submit callback 
function showRequest(formData, jqForm, options) {
	//var queryString = $.param(formData);
	if($('#shipmentId').val().indexOf('T')!=-1 || $('#isSaveOnly').val()=='Y'){
		$('#msgDiv').html('<div class="message_info">Saving Booking Contacts.....</div>');
	}else{
		$('#msgDiv').html('<div class="message_info">Sending Booking Confirmation.....</div>');
	}
	window.scrollTo(0, 0);
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
	
	if(messageContent!='')
		window.scrollTo(0, 0);
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {

	if (responseText.messages) {
		var messages = responseText.messages;
		showResponseMessages(messages);
	}
	
	if(responseText.success)
	{
		$('#notes').val('');
		$('#availableContactList').val(responseText.data.availableContactList);
		$('#commentId').val(responseText.data.commentId);
		if($('#commentId').val()==''){
			$('#commentsDiv').hide();
		}
		else{
			$('#commentsDiv').show();
		}
		jQuery("#contactGrid").trigger('reloadGrid');
		jQuery("#gridIdForClauses").trigger('reloadGrid');
		openUnreleasedHoldGridOnIntialDisplay("sendDocument");
	}
}

//hide all inline validation error messages
function removeErrorPointers(){
	   $('#creditProfileForm').validationEngine('hideAll');
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function validateShipmentNo(){
	if($('#shipmentId').val()==null || $('#shipmentId').val()=="" || $('#shipmentId').val().length!=7){
		return 'Please provide a valid 7 digit Shipment Number';
	}
}

$(document).ready(function() {

	setBtnCaption();
	
	if($('#shipmentId').val().indexOf('T')!=-1){
		$('#btnContactSaveHide').hide();
	}
	else{
		$('#btnContactSaveHide').show();
	}
	
	if($('#tarde').val().split(" - ")[0]=="F")
	{
		$('#chinaPickUpDiv').show();
		$('#chinaDropOffDiv').show();
	}
	else
	{
		$('#chinaPickUpDiv').hide();
		$('#chinaDropOffDiv').hide();
	}
	
	//validations
	$("#sendDocumentForm").validationEngine('attach');

	if($('#fromMenu').val()=='menu' || $('#fromMenu').val()=='rollVVD' || $('#fromMenu').val()=='self'){
		enforceSecurityDivAndButtons("sndDocExit", false);
	}else if($('#fromMenu').val()=='booking' || $('#fromMenu').val()=='template' || $('#fromMenu').val()=='wiredown' || $('#fromMenu').val()=='bookingSearch'){
		enforceSecurityDivAndButtons("sndDocExit", true);
	}else{
		enforceSecurityDivAndButtons("sndDocExit", false);
	}
	
	if(!_isContactAdd)
		$('#contactDiv').gatesDisable();
	
	if(!_isSavePresent)
		$('#notesDiv').gatesDisable();
	
	enforceSecurityDivAndButtons("sndDocSave", _isSavePresent);
	enforceSecurityDivAndButtons("sndDocContactSave", _isSavePresent);
	enforceSecurityDivAndButtons("sndDocPrint", _isPrintPresent);
	enforceSecurityDivAndButtons("holdRelease", holdReleaseEnabled);
	enforceSecurityDivAndButtons("searchBooking", searchBookingEnabled);
	
	/*if(_isSavePresent && $('#isSendAllowed').val()=='true')
	{
		$('#sndDocSave').removeAttr('disabled');
	}*/
	
	
	// D030764: 	Booking Confirmation (JMS) - Application Exception: http://www.matson.com -  .. Added validation
	$('#sndDocSave').attr('disabled','disabled'); 
	
	var enableDisableButtons =	function(){ 
		//console.info("#contactGrid input:checked"+$("#contactGrid input:checked").length);
		if($("#contactGrid input:checked").length){
			if(_isSavePresent && $('#isSendAllowed').val()=='true')
			{
				$('#sndDocSave').removeAttr('disabled');
			}
		}else{
			$('#sndDocSave').attr('disabled','disabled'); 
		}
		if(_isSavePresent && $('#isSendAllowed').val()=='true')
		{
			$('#sndDocContactSave').removeAttr('disabled');
		}
		else{
			$('#sndDocContactSave').attr('disabled','disabled'); 
		}
			
	};
	
	setInterval(enableDisableButtons,500);
	
	//End D030764
	
	if(_isPrintPresent && $('#isTemplate').val()=='N' && $('#isPOV').val()=='true' && $('#isSendAllowed').val()=='true')
	{
		$('#sndDocPrint').removeAttr('disabled');
	}
	$('#sndDocExit').click(function(){
		//document.location.href = _context+"/booking/showForm";
		$.ajax({
			url: _context+"/booking/senddocument/exit",
			success: function(responseText){
				if(responseText.success){
					if($('#fromMenu').val()=='booking')
						document.location.href = _context + "/booking/showForm?checkLastBookingLoaded=true&userFromMenu=N&bookingNumber=";
					else if($('#fromMenu').val()=='template')
						document.location.href = _context + "/booking/template/showTemplateForm?templateNumber="
						+ $('#shipmentId').val();
					else if($('#fromMenu').val()=='wiredown')
						document.location.href = _context + "/wiredownMaintenance/showFormMenu";
					else if($('#fromMenu').val()=='bookingSearch')
						document.location.href = _context + "/cas/approveOfferBkSearch.do";
				}
			}
		});
	});
	
	$('#searchBooking').click(function(){
		document.location.href = _context+"/cas/approveOfferBkSearch.do";
	});
	
	if(_isPrintPresent)
	{
		$('#sndDocPrint').click(function(){
			//$('#sendDocumentForm').attr('action','printdocument');
			//$('#sendDocumentForm').submit(); 
			var queryString = $('#sendDocumentForm').formSerialize();
			window.open(_context+'/booking/senddocument/printdocument?'+queryString);
		});
	}
	
	if(_isSavePresent)
	{
		$('#sndDocSave').click(function()
		{
			if($('#shipmentId').val()==''){
				$('#shipmentId').validationEngine('showPrompt', 'Please re-enter Booking Number to continue.', 'error', 'topRight', true);
				return;
			}
			
			//Added to get selected clauses
			var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
			var selectedClauseIDs="";
			  
			   
			  
	        for (var i=0;i<rowIDs.length;i=i+1){ 
	        	var id = $('#gridIdForClauses').getCell(rowIDs[i], 'clauseSeqNo');
	        	if($('#jqg_gridIdForClauses_'+id).attr("checked")=="checked"){
	        		selectedClauseIDs = selectedClauseIDs+ jQuery("#gridIdForClauses").getRowData(rowIDs[i]).clauseId + "|";
	        		console.log("Clause id selected:"+jQuery("#gridIdForClauses").getRowData(rowIDs[i]).clauseId);
	        	}
	        
	        
	        }
		   $('#selectedClauseIdsDelimited').val(selectedClauseIDs);
		   
		    console.log("Selected clauses:"+$('#selectedClauseIdsDelimited').val()); 
			        
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
			if(selection!='' || $('#isTemplate').val()=="Y")
			{
				$('#selectedContacts').val(selection);
				$('#isSaveOnly').val("N");
				//window.opener.loadHoldGrid("D");
			    $('#sendDocumentForm').attr('action','savensend');
				//$('#sendDocumentForm').submit();
			    $('#sendDocumentForm').ajaxSubmit(options);
			}
			else
			{
				$('#msgDiv').html('<div class="message_error">'+'Select contact(s)'+'</div>');
				window.scroll(0, 0);
			}
	    });
		
		$('#sndDocContactSave').click(function()
				{
					if($('#shipmentId').val()==''){
						$('#shipmentId').validationEngine('showPrompt', 'Please re-enter Booking Number to continue.', 'error', 'topRight', true);
						return;
					}
					
					//Added to get selected clauses
					var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
					var selectedClauseIDs="";
					  
					   
					  
			        for (var i=0;i<rowIDs.length;i=i+1){ 
			        	var id = $('#gridIdForClauses').getCell(rowIDs[i], 'clauseSeqNo');
			        	if($('#jqg_gridIdForClauses_'+id).attr("checked")=="checked"){
			        		selectedClauseIDs = selectedClauseIDs+ jQuery("#gridIdForClauses").getRowData(rowIDs[i]).clauseId + "|";
			        		console.log("Clause id selected:"+jQuery("#gridIdForClauses").getRowData(rowIDs[i]).clauseId);
			        	}
			        
			        
			        }
				   $('#selectedClauseIdsDelimited').val(selectedClauseIDs);
				   
				    console.log("Selected clauses:"+$('#selectedClauseIdsDelimited').val()); 
					        
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
					if(selection!='' || $('#isTemplate').val()=="Y")
					{
						$('#selectedContacts').val(selection);
						//window.opener.loadHoldGrid("D");
					}
					$('#isSaveOnly').val("Y");
					 $('#sendDocumentForm').attr('action','savensend');
					//$('#sendDocumentForm').submit();
				    $('#sendDocumentForm').ajaxSubmit(options);
					
			    });
	}
	
	$('#selectedDocType').change(function(){
		if($('#selectedDocType').val()!=null && $('#selectedDocType').val()!="")
		{
			document.location.href = _context+"/booking/senddocument/create?bookingId="+$('#shipmentId').val()
			+"&docType="+$('#selectedDocType :selected').val()+"&nav=" + $('#fromMenu').val();
		}
    });
	
	$('#shipmentId').change(function(){
		loadShipment();
    });
	
	$('#shipmentId').keyup(function(evt) { 
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '13'){
			  loadShipment();
		  }
	});
	
	$('#selectedPartyType').change(function(){
		
		$("#selectedContactId").children().remove();
		if($('#selectedPartyType :selected').val()=='-1') {
			
			
			$('#customerId').val("");
			$('#aroleId').val("");
			$('#customerName').val("");
			$('#aroleName').val("");
		} else {
			updateContactList();
		}
    });
	
	 $('#customerName').gatesAutocomplete({
		 	source:_context+'/cas/autocomplete.do',
		 	name: "Customer Name",
		 	extraParams: {
		 		 method: 'searchOrganization',
		 		 searchType: '4'
		 	},
		//	mustMatch:true,
		 	autoSelectWhenSingle:true,
			autoSelectFirst:true,
				autoSelectCriteria:function(item) {
				   if(item != null){
				     return 'true';
				  }
				  else {
				     return 'false';
				  }
				},
			
			formatItem: function(data) {
				return data.name; // + "-" + data.code;
			},
			formatResult: function(data) {
				return data.name; // + "-" + data.code;
			},
			select: function(data) {
				$('#selectedPartyType').val('-1');
				$('#selectedContactId').children().remove();
				$('#customerId').val(data.id);
				$('#customerName').attr('title',data.name);
				$('#customerName').val(data.name);
				$('#aroleId').val("");
				$('#aroleName').val("");
				var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('#customerId').val());
				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'AddressSearch', windowStyle);
			}
		});
	 
	// code to bind pop up search
		$('#customerName').gatesPopUpSearch({
			func : function() {
				
				 if ($.trim($('#customerId').val())=='')
					alert("Please select organization first");
				 else 
				{
					var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
							+ encodeURIComponent($('#customerId').val());
					var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
					window.open(actionUrl, 'AddressSearch', windowStyle);
				}
			}
		});
	 
	 $('#customerName').change(function() {
		 	if($('#customerName').val()=='')
			{
				$('#selectedPartyType').val('-1');
				$('#selectedContactId').children().remove();
				$('#customerId').val("");
				$('#aroleId').val("");
				$('#aroleName').val("");
			}
		});
	 
	$('#selectedContactId').change(function(){
		console.log($('#selectedContactId :selected').text()+"xxx");
		if($('#selectedContactId :selected').val()!='-1' || endsWith($('#selectedContactId :selected').text(),"[CUSTOM]"))
		{
			var queryString = $('#sendDocumentForm').formSerialize();
			$.ajax({
				url : _context +"/booking/senddocument/addToGrid/addPrimary",
				type : "POST",
				data : queryString,
				success : function(responseText) {
					showResponseMessages(responseText.messages);
					if(responseText.success)
					{
						if(responseText.data=='D')
						{
							$('#organizationName').val($('#customerName').val().split("-")[0]);
							$('#orgnContactName').val($('#selectedContactId :selected').text().split(" [")[0]);
							$('#selectedContactId').val('-1');
						}
						else if(responseText.data=='S')
						{
							$('#selectedContactId').val('-1');
							jQuery("#contactGrid").trigger('reloadGrid');
						}
					}
				}
			});
		}
    });
	
	//Display Unreleased Holds Grid on initial display
	openUnreleasedHoldGridOnIntialDisplay("sendDocument");
	
	
	$('#shipmentId').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Booking Number",
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  function() { return ''; }
	 	},
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		
		
		select: function(data) {
			if($('#shipmentId').val()!=null && $('#shipmentId').val()!="" && $('#shipmentId').val().length==7)
			{
				document.location.href = _context+"/booking/senddocument/create?bookingId="+$('#shipmentId').val()
				+"&docType="/*+$('#selectedDocType :selected').val()*/+"&nav=" + $('#fromMenu').val();
			}
		}
	});
	
	if($('#shipmentId').val() != undefined && $.trim($('#shipmentId').val()) != '') {
		bindComments();
	}
	
	if($('#commentId').val()==''){
		$('#commentsDiv').hide();
	}
	else{
		$('#commentsDiv').show();
	}
	
	$('#shipmentId').focus();
	tabSequence('#sendDocumentForm',false,false);

});

function loadShipment()
{
	if($('#shipmentId').val()!=null && $('#shipmentId').val()!="" && $('#shipmentId').val().length==7)
	{
		document.location.href = _context+"/booking/senddocument/create?bookingId="+$('#shipmentId').val()
		+"&docType="/*+$('#selectedDocType :selected').val()*/+"&nav=" + $('#fromMenu').val();
		setBtnCaption();
	}
	/*else{
		alert("Please provide a valid 7 digit Shipment Number");
	}*/
}

function addroleUpdate(data)
{
	var values = data.split("|");
	$('#aroleId').val(values[9]);
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6],values[8]);//nameQualifier, addressLine1, city, state)
	$('#aroleName').val(finalAddress);
	$('#selectedPartyType').val('-1');
	$('#selectedContactId').children().remove();
	updateContactList();
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state, zip) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	var zipTemp = "";
	
	if (nameQualifier!=null && nameQualifier != "" && nameQualifier!='null') {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != null && state != "" && state!='null') {
		stateTemp = ", " + state;
	}
	if(zip!= null && zip !='' && zip!='null')
		zipTemp = " - " + zip;
	
	return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp + zipTemp;
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
			//$("#sendDocumentForm").loadJSON(responseText.data);
			showResponseMessages(responseText.messages);
			
			if(responseText.success)
			{
		        $.each(responseText.data.contactList, function(index, contactList) {
		        	$('#selectedContactId').append($("<option/>", {
						value : contactList.code,
						text : contactList.description
					}));
		        });
		        jQuery("#contactGrid").trigger('reloadGrid');
				$("#availableContactList").val(responseText.data.availableContactList);
				if($('#selectedPartyType :selected').val()!='-1')
				{
					$("#customerId").val(responseText.data.customerId);
					$("#customerName").val(responseText.data.customerName);
					$("#aroleName").val(responseText.data.aroleName);
					$("#aroleId").val(responseText.data.aroleId);
				}
			}
		}
	});
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'BKNG',
			contextScreen: 'maintainbooking'
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
				args.commentTypesForGrid=string;
				$("#comment_link").comments(args);
			}
		}
	});
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
		$("#"+selector).addClass('noTab');
	}
}

function setBtnCaption(){
	if($('#shipmentId').val()!=''){
		if($('#shipmentId').val().indexOf('T')!=-1){
			$('#btnCaption').text("Save");
		}else{
			$('#btnCaption').text("Save & Send");
		}
	}else{
		$('#btnCaption').text("Save & Send");
	}
}

function bindComments()
{
	var isDeleteAllowed = false;
	var isEditAllowed = false;
	if($('#shipmentId').val() !='' && $('#shipmentId').val().toUpperCase().indexOf('T')==0)
	{
		isDeleteAllowed = true;
		isEditAllowed = true;
	}
	var args = {
			entityType: 'BKNG',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'',
			isDeleteAllowed:isDeleteAllowed,
			isEditAllowed:isEditAllowed
		   };
	getCommentTypes(args);
}
var debtorCode = "";
var isPartyChanged = "";
var prepaidArol = "ALL";
var collectArol = "ALL";

//added against 21739
//var changeInPartiesGrid=false;

$(document).ready(
function() {
	
	debtorCode = $('#prepaidCollectCode :selected').val();

	
	$('#parties :input').change(function()
	{
		if(this.type!='checkbox')
			console.log('change');
			isPartyChanged = "Y";
	});

	/*if($("#shipmentStatusCode").val()!='CANC')
		autoBillOnchangeEventFunction();
	
	$('#isAutobill').change(function(){
		if($('#isAutobill :selected').val()=="true"){
			if($('#loadDschServiceGroupCode').val()=="CON"){
				$('#msgDiv').html('<div class="message_error">'+'Auto Bill cannot be true for the provided load and discharge service'+'</div>');
				window.scrollTo(0, 0);
				$('#isAutobill').val(false);
			}
			else if($("#freightGrid").getGridParam("reccount")==1){
				var rowData = jQuery("#freightGrid").getRowData("1");
				if($.trim($("#tariffNumber").val())=='' || rowData.tariffCommodityDescription=='' || rowData.tariffItemNumber=='' || rowData.commodityCode==''){
					$('#msgDiv').html('<div class="message_error">Tariff, Tariff Commodity Description, Item and Commodity Code are mandatory for commodity if Auto Bill indicator is Y</div>');
					window.scrollTo(0, 0);
					$('#isAutobill').val(false);
				}
				else{
					$('#msgDiv').html("");
					autoBillOnchangeEventFunction();
				}
			}
			else if($("#freightGrid").getGridParam("reccount")>1){
				$('#msgDiv').html('<div class="message_error">'+'Cannot update Auto Bill Indicator as multiple commodity lines exist'+'</div>');
				window.scrollTo(0, 0);
				$('#isAutobill').val(false);
			}
			else{
				autoBillOnchangeEventFunction();
			}
		}
		else{
			autoBillOnchangeEventFunction();
		}
	});
	
	//--------------changed after discussion with nitin----------------
	$('#autobillOptionCode').change(function()
	{
		if($('#autobillOptionCode :selected').val()=='C')
			$('#autobillTriggerCode').val('I');
	});
	
	$('#autobillTriggerCode').change(function()
	{
		if($('#autobillTriggerCode :selected').val()=='I')
			$('#autobillOptionCode').val('C');
	});*/

	
	$('#isProrate').change(function(){
				enableDisableTotalWeightAndQube();
	});
	
	$('#unitOfMeasureSourceCode').change(function(){
		//changeLabelTotalWeightAndQube();
	});
	// create parties dialog at body onload
	$("#partiesDialog").dialog({
		autoOpen : false,
		width : 587,
		modal : true,
		close : function() {
			removePartiesPopUps();
			clearPartiesForm();
			$("#parties").validationEngine('detach');
			partyOrg = "";
			partyAddr = "";
			tabSequence('#shipmentForm',true,false);
		},
		open: function()
		{
			isPartyChanged = "";
			tabSequence('#partiesDialog',false,false);
		}
	});
	
	// create parties override dialog at body onload
	$("#partiesOverrideDialog").dialog({
		autoOpen : false,
		/*open: function()
		{
			var length = $('.ui-widget-overlay').length - 1;
			$('.ui-widget-overlay').css("background", "transparent");
		},
		close: function()
		{
			var length = $('.ui-widget-overlay').length - 1;
			$('.ui-widget-overlay').css("background", "");
		},*/
		width : 300,
		modal : true
	});
	
	//
	$('#partiesAdd').click(function() {
		if (!(($("#statusCode").text()=='ISSUED')|| ($("#statusCode").text()=='CORRECTED' || isPartyAdd==false)))  {
			clearPartiesForm(); //for defect --D018588
			if(shipmentNotFound!=true)
			showAddPartyDialog();
			return false;
		}
	});
	//D026112
	$('#del_gridIdForParties').click(function(){ 

	    var checkDelFlag= true;
		var rowIDs = jQuery("#gridIdForParties").getDataIDs();
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
	    // You'll get a pop-up confirmation dialog, and if you say yes,

		/// only show the message if only last party and thats Prepaid type and not override , which only happen user
		// checked "checked all" checked box
	    if (rowIDs.length ==1 && (rowData.partyTypeDescription =='Prepaid Bill To Party' || rowData.partyTypeDescription =='Collect Bill To Party')
	    	&& rowData.isCpPartyOverridden !='Yes')
			{
				checkDelFlag=false;
			}
		}
		
		if(!checkDelFlag)
		{
			$('#delmodgridIdForParties').hide();
			$('#eData').trigger('click');
			alert("No parties have been selected for removal. If no check box is available,you may only update this bill-to party.");
		}
	});
	//change D026341
	
	//console.log("No to order " + $('#isToOrderParty').attr('checked'));
	if($('#isToOrderParty').attr('checked')) {
		// do nothing
	} else {
		$('#toOrderPartyName').attr('readonly','readonly');
		console.log("readonly");
	} 
	
	$('#isToOrderParty').change(function(){
		changeEvent($('#isToOrderParty'));
		
		if($('#isToOrderParty').attr('checked')) {
			
			
			$('#toOrderPartyName').removeAttr('readonly');
		} else {
			if(toOrderPartyPopulated) {
				alert('To Order B/L Party must be deleted first');
				$('#isToOrderParty').attr('checked', true);
			} else {
				$('#toOrderPartyName').attr('readonly','readonly');
				$('#toOrderPartyName').val('');
			}
			
			
		}
		
		setPartiesHeader();
	});
	
	
	
	
	$('#partiesClear').click(function() {
		clearPartiesForm();
	});
	
	$('#prepaidCollectCode').change(function() {
				var defaultDebtor = $('#prepaidCollectCode :selected').val();
				
				if (defaultDebtor == "P"
					&& ( $('input[name="shipper\\.organizationId"]').val() == '' || 
						 $('input[name="shipper\\.addressRoleId"]').val()=='') ) {
					$('#msgDiv').html('<div class="message_error">Shipper must be specified for Prepaid payment</div>');
					window.scrollTo(0, 0);
					$('#prepaidCollectCode').val(debtorCode);
					return;
				} else if (defaultDebtor == "C"
					&& ( $('input[name="consignee\\.organizationId"]').val() == '' ||
						 $('input[name="consignee\\.addressRoleId"]').val()== '') ) {
					$('#msgDiv').html('<div class="message_error">Consignee must be specified for Collect payment</div>');
					window.scrollTo(0, 0);
					$('#prepaidCollectCode').val(debtorCode);
					return;
				} else if (defaultDebtor == "B"
					&& ( $('input[name="shipper\\.organizationId"]').val() == '' || 
						 $('input[name="consignee\\.organizationId"]').val() == '' || 
						 $('input[name="shipper\\.addressRoleId"]').val()=='' ||
						 $('input[name="consignee\\.addressRoleId"]').val()== '') ) {
					$('#msgDiv').html('<div class="message_error">Shipper and Consignee must be specified for Both payment</div>');
					window.scrollTo(0, 0);
					$('#prepaidCollectCode').val(debtorCode);
					return;
				}
				
				var queryString = $('#shipmentForm').formSerialize();
				$.ajax({
						url : _context +"/shipment/party/defaultDebtors",
						type : "POST",
						data : queryString,
						success : function(responseText) {
							showResponseMessages('msgDiv', responseText);	
							$("#gridIdForParties").trigger("reloadGrid");
						}
				});
				
				debtorCode = defaultDebtor;
				//D033651 - Disable invoice field which is not applicable
				if(defaultDebtor == "P"){
					$('#fpInvoiceNbr').attr('disabled', false);
					$('#fcInvoiceNbr').attr('disabled', true);
				} else if(defaultDebtor == "C"){
					$('#fpInvoiceNbr').attr('disabled', true);
					$('#fcInvoiceNbr').attr('disabled', false);
				} else {
					$('#fpInvoiceNbr').attr('disabled', false);
					$('#fcInvoiceNbr').attr('disabled', false);
				}
				setPartiesHeader();
			});
	//D031201: 	Alaska - Prepaid and Collect Invoice # on Maintain Billing - Parties section
	var invoiceNo = null;
	var invoiceArol = null;
	$('#fpInvoiceNbr').gatesAutocomplete({
		//minLength: 8,
		minLength: 1,
		source:_context+'/cas/autocomplete.do',
		autoSelectFirst:true,
		mustMatch:true,
	 	extraParams: {
	 		method: 'searchInvoiceNoForParty',
	 		searchType: '6652'
	 	},
		formatItem: function(data) {
			return data.invoiceNbr;
		},
		formatResult: function(data) {
			invoiceNo = data.invoiceNbr;
			invoiceArol = data.invoiceArol;
			return data.invoiceNbr;
		}, 
		select: function(data) {
			//$(this).val(data.invoiceNbr);
		},
		onBlur:function(){
			invoiceNo = null;
			invoiceArol = null;
		},
		onChange:function(){
			if(invoiceNo != null){
				$('#fpInvoiceNbr').val(invoiceNo);
				if(invoiceArol != prepaidArol){
					$('#fpInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', true);
					$('#fpInvoiceNbr').val("");
				}
				invoiceNo = null;
				invoiceArol = null;
			} 
			displayInvoiceLinks(false);
		}
	});
	
	$('#fcInvoiceNbr').gatesAutocomplete({
		//minLength: 8,
		minLength: 1,
		source:_context+'/cas/autocomplete.do',
		autoSelectFirst:true,
		mustMatch:true,
	 	extraParams: {
	 		method: 'searchInvoiceNoForParty',
	 		searchType: '6652'
	 	},
		formatItem: function(data) {
			return data.invoiceNbr;
		},
		formatResult: function(data) {
			invoiceNo = data.invoiceNbr;
			invoiceArol = data.invoiceArol;
			return data.invoiceNbr;
		}, 
		select: function(data) {
			//$(this).val(data.invoiceNbr);
		},
		onBlur:function(){
			invoiceNo = null;
			invoiceArol = null;
		},
		onChange:function(){
			if(invoiceNo != null){
				$('#fcInvoiceNbr').val(invoiceNo);
				if(invoiceArol != collectArol){
					$('#fcInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', true);
					$('#fcInvoiceNbr').val("");
				}
				invoiceNo = null;
				invoiceArol = null;
			}
			displayInvoiceLinks(false);
		}
	});
	
	$("#fpInvoiceNbr, #fcInvoiceNbr").keyup(function() {
		$(this).validationEngine('hideAll');
		if($.trim($("#fpInvoiceNbr").val()) != "" || $.trim($("#fcInvoiceNbr").val()) != ""){
			$('#prepaidCollectCode').attr('disabled', true);
		} else {
			$('#prepaidCollectCode').attr('disabled', false);
		}
	});
	
	//D031201: 	Alaska - Prepaid and Collect Invoice # on Maintain Billing - Parties section 
	/*$("#fpInvoiceNbr, #fcInvoiceNbr").change(function() {
		if(invoiceNo != null && $(this).val() == invoiceNo){
			$(this).val(invoiceNo);
			if(this.id == 'fpInvoiceNbr'){
				if(invoiceArol != prepaidArol){
					$('#fpInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', true);
					//alert("");
					$('#fpInvoiceNbr').val("");
				}
			} else {
				if(invoiceArol != collectArol){
					$('#fcInvoiceNbr').validationEngine('showPrompt', 'Address role of selected invoice does not match debtor address role on bill.', 'error', false);
					//alert("");
					$('#fcInvoiceNbr').val("");
				}
			}
			invoiceNo = null;
			invoiceArol = null;
		} else {
			$(this).val("");
		}
		displayInvoiceLinks(false);
	});*/
});


//--------Supporting Functions-----------------
var partiesGridComplete = function()
{
	 $('#pagerIdForParties .ui-pg-input').attr("readonly", true);
	 
	 var rowIDs = jQuery("#gridIdForParties").getDataIDs();
	 prepaidArol = "ALL";
	 collectArol = "ALL";
	 for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
       if(!($("#statusCode").text()=="ISSUED" || $("#statusCode").text()=="CORRECTED" ) ){
    	   if(isPartyDelete==false){
    		   $("div.ui-pg-div.ui-inline-del", "#gbox_gridIdForParties #"+rowIDs[i]).hide();
    	   }
    	   if ((rowData.partyTypeDescription=='Prepaid Bill To Party' || rowData.partyTypeDescription=='Collect Bill To Party') && 
    			   (rowData.isCpPartyOverridden == false || rowData.isCpPartyOverridden == 'false' || rowData.isCpPartyOverridden == '')) 	{
    		   $("div.ui-pg-div.ui-inline-del", "#gbox_gridIdForParties #"+rowIDs[i]).hide();
    		   $("input.cbox", "#gbox_gridIdForParties #"+rowIDs[i]).hide();
    	   	}
    	   
       }else{
    	   $("div.ui-pg-div.ui-inline-del", "#gbox_gridIdForParties #"+rowIDs[i]).hide();   
       }
      // alert("rowData.partyAddressCustomized="+rowData.partyAddressCustomized+ "   rowData.partyTypeDescription="+rowData.partyTypeDescription);
       if(((rowData.partyAddressCustomized == 'true') || (rowData.partyAddressCustomized == true))  ) { 
    	   $('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'organizationName','','',{style: 'color : green'},'');
       } else {
    	   $('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'organizationName','','',{style: 'color : black'},'');
       }
       if(rowData.orgCreditStatus== 'CASH')
	   {
	   $('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'orgCreditStatus','','',{style: 'color : red'},'');
	   }else {
    	   $('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'orgCreditStatus','','',{style: 'color : black'},'');
       }
       //D033925: 	MAINTAIN BILL: DEBTOR - ONE TIMER DEBTOR'S DETAIL 
       /*if($.trim($("#fpInvoiceNbr").val()) != "" || $.trim($("#fcInvoiceNbr").val()) != ""){
    	   if (rowData.partyTypeDescription=='Prepaid Bill To Party') {
    		   $("a", "#gbox_gridIdForParties #"+rowIDs[i]).parent().html("Prepaid Bill To Party");
    	   }
    	   if(rowData.partyTypeDescription=='Collect Bill To Party'){
    		   $("a", "#gbox_gridIdForParties #"+rowIDs[i]).parent().html("Collect Bill To Party");
    	   }
       }*/
       
       if (rowData.partyTypeDescription=='Prepaid Bill To Party') {
    	   prepaidArol = rowData.addressRoleId;
       } else if(rowData.partyTypeDescription=='Collect Bill To Party'){
    	   collectArol = rowData.addressRoleId;
       }
       // debtor one timer ...change background to yellow
       if (rowData.isOneTimeCustomer=='Yes') {
    	   $('#gridIdForParties').jqGrid('setRowData',rowIDs[i],false, {background:'#ffffcc'});
       }
     }
	 	//added against 21739
	 	/*if(counterPartiesGridReloaded==0){
	 		numberOfInitialRowsParties=jQuery("#gridIdForParties").jqGrid('getGridParam', 'records');
	 		counterPartiesGridReloaded++;
	 	}
	 	if(numberOfInitialRowsParties != jQuery("#gridIdForParties").jqGrid('getGridParam', 'records')){
	 		changeInParties=true;
	 	}*/
	 	//22735
	 	disablePartiesCheckBoxes();
	 	var rowStpIDs=jQuery("#stopOffsGrid").getDataIDs();
		for (var j=0;j<rowStpIDs.length;j=j+1) {
			var rowStpData=jQuery("#stopOffsGrid").getRowData(rowStpIDs[j]);
			var rowIDs = jQuery("#gridIdForParties").getDataIDs();
				for (var i=0;i<rowIDs.length;i=i+1)
				 { 
				   var id = $('#gridIdForParties').getCell(rowIDs[i], 'partySeqNo');
				   var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
				   if(rowStpData.addressRoleId==rowData.addressRoleId){
					  
				   $(".ui-inline-del", "#gbox_gridIdForParties #"+rowIDs[i]).hide();
					   $('#jqg_gridIdForParties_'+id).attr("checked",false);
					   $('#jqg_gridIdForParties_'+id).hide();
					    $('#jqg_gridIdForParties_'+id).attr('disabled','disabled');
					   $('table[aria-labelledby="gbox_gridIdForParties"] tbody tr#' + rowIDs[i]).removeClass('ui-state-highlight');
				   }
				 } 
		}
	 	
	 	// D026341
	 	setToOrderPartyDisplay();
};

var toOrderPartyPopulated = false;
//D026341
//D026341: reeval, remove uncheck
function setToOrderPartyDisplay() {
	
	 
	var userData = $("#gridIdForParties").getGridParam('userData');
	
	if(userData && userData.TOORDERNAME) { 
		  toOrderPartyPopulated = true;
		  $('#toOrderPartyDisplay').html(userData.TOORDERNAME); 
		  $('#isToOrderParty').attr('checked',true);
		  $('#toOrderPartyName').attr('readonly','readonly');
		  $('#toOrderPartyName').val('');
//	} else if(toOrderPartyPopulated) {
		// It was populated so uncheck it
		//toOrderPartyPopulated = false;
		//$('#isToOrderParty').removeAttr('checked');
	//	$('#toOrderPartyName').attr('readonly','readonly');
	//	$('#toOrderPartyName').val('');
	//	$('#toOderPartyDisplay').html(''); 
	} else {
		toOrderPartyPopulated = false;
		$('#toOrderPartyDisplay').html(""); 
		
		if($('#isToOrderParty').attr('checked')) {
			$('#toOrderPartyName').removeAttr('readonly');
		} else {
			$('#toOrderPartyName').attr('readonly','readonly');
		} 

		
		
	}
	
	setPartiesHeader();
	
}

// clears the parties form
function clearPartiesForm() {
	//$("#parties").clearForm();
	$('input[name="partySeqNo"]').val('');
	$('input[name="organizationId"]').val('');
	$('input[name="organizationCode"]').val('');
	$('input[name="isOneTimeCustomer"]').val('');
	$('input[name="addressRoleId"]').val('');
	$('select[name="partyTypeCode"]').children().remove();
	$('select[name="partyTypeCode"]').append(
			"<option value=''></option>");
	$('select[name="contactId"]').children().remove();
	$('select[name="contactId"]').append("<option value=''>Select</option>");
	$('input[name="careOf"]').val('');
	$('input[name="city"]').val('');
	$('input[name="state"]').val('');
	$('input[name="zip"]').val('');
	$('input[name="countryName"]').val('');
	$('input[name="provinceName"]').val('');
	// code added start for defect --D018588
	$('input[name="organizationName"]').val('');
	$('input[name="organizationName"]').removeAttr('title');
	$('input[name="address"]').val('');
	$('input[name="address"]').removeAttr('title');
	clearContactInfo(true);
	// code added end for defect --D018588
}


function countryCodeDetailsPopulate(){
	var source= ["contactFax","contactPhone","contactCell"];
	for(var i=0;i<source.length;i++){
		var areaCode = $('input[name="'+source[i]+'AreaCode"]').val();
		var exchange =$('input[name="'+source[i]+'Exchange"]').val();
		var station = $('input[name="'+source[i]+'Station"]').val();
		var countryCode = $('input[name="'+source[i]+'CountryCode"]').val();
		if(countryCode==""&&(station!=""||exchange!=""||areaCode!=""))
		{
			var defaultCountryCode="";
			$.ajax({
				async: false,
				type : "POST",
				url : _context +"/shipment/phoneCountryCode",
				data : {
					addressRoleId : $('#addressRoleId').val()
				},
				success : function(responseText) {
					defaultCountryCode=responseText.data;
				}
			});
			$('input[name="'+source[i]+'CountryCode"]').val(defaultCountryCode);
			countryCode=defaultCountryCode;
		}
	}
}


function showAddPartyDialog() {

	if(($("#statusCode").text()=='CANC') || ($("#statusCode").text()=='ISSUED') || ($("#statusCode").text()=='CORRECTED')|| isPartyAdd==false){
		$("#partiesDialog").gatesDisable();
	}else{
		$("#partiesDialog").gatesEnable();
	$.ajax({
		url : _context +"/shipment/party/showFormAdd",
		success : function(responseText) {
			clearPartiesForm();
			$.each(responseText.partyTypeList, function(key, value) {
				$('select[name="partyTypeCode"]').append($("<option/>", {
					value : key,
					text : value
				}));
			});
			$("#partiesDialog").dialog("option", "title", 'Add Party');
			$("#partiesDialog").dialog("option", "buttons", [ {
				text : "Cancel",
				click : function() {
					if(isPartyChanged!="")
					{
						var r = confirm("All unsaved changes will be discarded.Continue?");
						if(r){
							$('#partiesMsgDiv').hide();
							$(this).dialog("close");
						}else
							return;
					}
					else{
						$('#partiesMsgDiv').hide();
						$(this).dialog("close");
					}
				}
			}, {
				text : "Ok",
				click : function() {
					if($("#statusCode").text()!='ISSD' && $("#statusCode").text()!='CORR' && (isPartyAdd)){
						countryCodeDetailsPopulate();
						addParty();
						setPartiesHeader();
					}else{
						$("#partiesDialog").dialog('close');
					}
					//added against 21739
					//changeInPartiesGrid=true;
				}
			} ]);
			
			$('#parties').validationEngine('attach');
			$("#partiesDialog").dialog('open');
			//addition start for defect DDO17159
			//$('#partyComm1').attr('checked', true);
			//$('#partyComm1').val("P");
			//addition end for defect DDO17159
		}
	});
	}
}

function showEditPartyDialog(id) {
	if( $("#statusCode").text()=='CORRECTED' || $("#statusCode").text()=='ISSUED' || isPartyUpdate==false){
		$("#partiesDialog").gatesDisable();
	}
	else{
		$("#partiesDialog").gatesEnable();
	}
	var seqNo = id.split('=')[1];
	$.ajax({
		url : _context +"/shipment/party/showPartyFormEdit",
		type : "GET",
		data : {
			partySeqNo : seqNo
		},
		success : function(responseText) {
			if(responseText.success)
			{
				clearPartiesForm();
				$.each(responseText.data.partyTypeList, function(key, value) {
					$('select[name="partyTypeCode"]').append($("<option/>", {
						value : key,
						text : value
					}));
				});
				
				$.each(responseText.data.contactList, function(key, value) {
					$('select[name="contactId"]').append($("<option/>", {
						value : key,
						text : value
					}));
				});
						
				$("#parties").loadJSON(responseText.data);
				partyOrg = responseText.data.organizationName;
				partyAddr = responseText.data.address;				
				setPartyCommMethodValue(responseText.data);
				$("#partiesDialog").dialog("option", "title", 'Edit Party');
				$("#partiesDialog").dialog("option", "buttons", [ {
					text : "Cancel",
					click : function() {
						if(isPartyChanged!="")
						{
							var r = confirm("All unsaved changes will be discarded.Continue?");
							if(r){
								$('#partiesMsgDiv').hide();
								$(this).dialog("close");
							}else
								return;
						}
						else{
							$('#partiesMsgDiv').hide();
							$(this).dialog("close");
						}
					}
				}, {
					text : "Ok",
					click : function() {
						if($("#statusCode").text()!='ISSUED' && $("#statusCode").text()!='CORRECTED' && (isPartyUpdate)){
							countryCodeDetailsPopulate();
							updateParty();
						}else{
							$("#partiesDialog").dialog('close');
						}
						//added against 21739
						//changeInPartiesGrid=true;
					}
				} ]);
				partyOrg = $('input[name="organizationName"]').val();
				partyAddr = $('input[name="address"]').val();
				$('#parties').validationEngine('attach');
				//$("#partiesDialog").dialog('open');
				//D033925: 	MAINTAIN BILL: DEBTOR - ONE TIMER DEBTOR'S DETAIL 
				var disablePartyEdit = false;
				if($.trim($("#fpInvoiceNbr").val()) != "" || $.trim($("#fcInvoiceNbr").val()) != ""){
		    	   if ($.trim($('#partyTypeCode').text())=='Prepaid Bill To Party' || $.trim($('#partyTypeCode').text())=='Collect Bill To Party') {
		    		   disablePartyEdit = true;
		    	   }
				}
				
				//D029864
				if(($("#statusCode").text()=='CANC') ){
					$("#partiesDialog").gatesDisable();
					$("#partiesDialog").dialog('open');
				}
				else if(($("#statusCode").text()=='ISSUED') || ($("#statusCode").text()=='CORRECTED') || isPartyUpdate==false || disablePartyEdit){
					$("#partiesDialog").gatesDisable();
					$("#partiesDialog").dialog('open');
				}
				else
					{
						$("#partiesDialog").gatesEnable();
						$("#partiesDialog").dialog('open');
					}
				
			
			}
		}
	});
}

function addParty() {
		var validateFields= $("#parties").validationEngine('validate') ; // added For Defect D017161
		//D018663: 	Contact not mandatory for billing
		//var validateFields1= validateContactDetails(); 					// added For Defect D017161
		
		if(validateFields){ // Changes done for Defect D017161
			$('form[id="parties"] input[name="address"]').attr("disabled",false);
			$('form[id="parties"] input[name="city"]').attr("disabled",false);
			$('form[id="parties"] input[name="state"]').attr("disabled",false);
			$('form[id="parties"] input[name="zip"]').attr("disabled",false);
			$('form[id="parties"] input[name="organizationName"]').attr("disabled",false);
		var queryString = $('#parties').formSerialize();
		$.ajax({
			url : _context +"/shipment/party/addParty",
			type : "POST",
			data : queryString,
			success : function(responseText) {
				if (responseText.success == true) {
					$("#gridIdForParties").trigger("reloadGrid");
					$("#partiesDialog").dialog('close');
					$('form[id="parties"] input[name="address"]').attr("disabled",true);
					$('form[id="parties"] input[name="city"]').attr("disabled",true);
					$('form[id="parties"] input[name="state"]').attr("disabled",true);
					$('form[id="parties"] input[name="zip"]').attr("disabled",true);
					$('form[id="parties"] input[name="organizationName"]').attr("disabled",true);
				} else 
					//alert(responseText.messages.error[0]);
					showResponseMessages("partiesMsgDiv", responseText);
			}
		});
	} else
		return;
}

function updateParty() {
	
	var validateFields= $("#parties").validationEngine('validate') ;
	//D018663: 	Contact not mandatory for billing
	//var validateFields1= validateContactDetails();
	
	if(validateFields){ // Changes done for Defect D017161
		
		var queryString = $('#parties').formSerialize();
		var selectedParty = $('select[name="partyTypeCode"]').selected().val();
		var relationshipTypeCode = "";
		var orgAroleId = "";
		
		if(selectedParty=='20')
		{
			relationshipTypeCode = "04";
			orgAroleId = $('input[name="shipper\\.addressRoleId"]').val();
		}
		else if(selectedParty=='30')
		{
			relationshipTypeCode = "12";
			orgAroleId = $('input[name="shipper\\.addressRoleId"]').val();
		}
		else if(selectedParty=='21')
		{
			relationshipTypeCode = "04";
			orgAroleId = $('input[name="consignee\\.addressRoleId"]').val();
		}
		else if(selectedParty=='22')
		{
			relationshipTypeCode = "02";
			orgAroleId = $('input[name="consignee\\.addressRoleId"]').val();
		}
		
		if(relationshipTypeCode!="")
		{
			$.ajax({
				url : _context +"/shipment/party/validateOverrideUpdate?relationshipTypeCode="
						+relationshipTypeCode+"&orgAroleId="+orgAroleId
						+"&tradeCode="+$('#tradeCode').val()+"&tradeType="+domesticForeignIndicator,
				data : queryString,
				type : "POST",
				success : function(responseTextValidate) {
					
					if(responseTextValidate=="N")
					{
						updatePartyConfirm(queryString, "N", relationshipTypeCode, orgAroleId);
					}
					else
					{
						if(responseTextValidate=="OD")
							$("#partiesOverrideDialog").dialog("option", "buttons", [ {
								text : "Override",
								click : function() {
									updatePartyConfirm(queryString, "O", relationshipTypeCode, orgAroleId);
									$("#partiesOverrideDialog").dialog("close");
								}
							}, {
								text : "Default",
								click : function() {
									updatePartyConfirm(queryString, "D", relationshipTypeCode, orgAroleId);
									$("#partiesOverrideDialog").dialog("close");
								}
							},{
								text : "Cancel",
								click : function() {
									$("#partiesOverrideDialog").dialog('close');
								}
							} ]);
						else if(responseTextValidate=="O")
							$("#partiesOverrideDialog").dialog("option", "buttons", [ {
								text : "Override",
								click : function() {
									updatePartyConfirm(queryString, "O", relationshipTypeCode, orgAroleId);
									$("#partiesOverrideDialog").dialog("close");
									$('#partiesMsgDiv').hide();
								}
							}, {
								text : "Cancel",
								click : function() {
									$("#partiesOverrideDialog").dialog('close');
								}
							} ]);
						
						$("#partiesOverrideDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").hide(); 
						$("#partiesOverrideDialog").dialog('open');
					}
				}
			});
		}
		else
			updatePartyConfirm(queryString, "N", relationshipTypeCode, orgAroleId);
	}
	else
		return false;
}

function updatePartyConfirm(queryString, confirm, relationshipTypeCode, orgAroleId)
{
	$.ajax({
		url : _context +"/shipment/party/updateParty",
		type : "POST",
		data : queryString+"&confirm="+confirm+"&relationshipTypeCode="+relationshipTypeCode+"&orgAroleId="+orgAroleId+"&tradeCode="+$('#tradeCode').val(),
		success : function(responseText) {
			if (responseText.success == true) {
				$("#gridIdForParties").trigger("reloadGrid");
				$("#partiesDialog").dialog('close');
				showResponseMessages("msgDiv", responseText);
				$('#partiesMsgDiv').hide();
			}
			else 
				//alert(responseText.messages.error[0]);
				showResponseMessages("partiesMsgDiv", responseText);
		}
	});
}

function validateContactDetails()
{
	var isValid = true;
/*	if($('input[name="contact"]').val()==''){
		$('input[name="contact"]').validationEngine('showPrompt', 'Please provide a contact name', 'error', true);
		isValid = false;
	}
	if(!$('#partyComm1').attr('checked') && !$('#partyComm2').attr('checked') && !$('#partyComm3').attr('checked') && !$('#partyComm4').attr('checked'))
		{
			$("#partyComm1").validationEngine('showPrompt', 'Please select a communication mode', 'error', true);
			isValid = false;
		}*/
	if($('input[name="contact"]').val()!='' && $('select[name="contactId"] :selected').val()=='' && 
			!$('#partyComm1').attr('checked') && !$('#partyComm2').attr('checked') && !$('#partyComm3').attr('checked') && !$('#partyComm4').attr('checked'))
	{
		//$("#partyComm1").validationEngine('showPrompt', 'Please select a communication mode', 'error', true);
		isValid = true;
	}
	/*if($('input[name="contact"]').val()!='')
	{*/ // Changes done for Defect D017161
	
		else if($('#partyComm1').attr('checked') && $('input[name="contactPhoneCountryCode"]').val()=='' && $('input[name="contactPhoneAreaCode"]').val()=='' && $('input[name="contactPhoneExchange"]').val()=='' && $('input[name="contactPhoneStation"]').val()=='' && $('input[name="contactPhoneExtension"]').val()=='')
		{
			$('#partyComm1').validationEngine('showPrompt', 'Preferred communication (Phone) cannot be empty', 'error', true);
			isValid = false;
		}
		else if($('#partyComm2').attr('checked') && $('input[name="contactCellCountryCode"]').val()=='' && $('input[name="contactCellAreaCode"]').val()=='' && $('input[name="contactCellExchange"]').val()=='' && $('input[name="contactCellStation"]').val()=='' && $('input[name="contactCellExtension"]').val()=='')
		{
			$('#partyComm2').validationEngine('showPrompt', 'Preferred communication (Cell) cannot be empty', 'error', true);
			isValid = false;
		}
		else if($('#partyComm3').attr('checked') && $('input[name="contactFaxCountryCode"]').val()=='' && $('input[name="contactFaxAreaCode"]').val()=='' && $('input[name="contactFaxExchange"]').val()=='' && $('input[name="contactFaxStation"]').val()=='' && $('input[name="contactFaxExtension"]').val()=='')
		{
			$('#partyComm3').validationEngine('showPrompt', 'Preferred communication (Fax) cannot be empty', 'error', true);
			isValid = false;
		}
		else if($('#partyComm4').attr('checked') && $('input[name="contactEmailAddress"]').val()=='')
		{
			$('#partyComm4').validationEngine('showPrompt', 'Preferred communication (Email) cannot be empty', 'error', 'topRight', true);
			isValid = false;
		}
		
		if(!validatePhoneNo('contactPhone'))
			isValid = false;
		if(!validatePhoneNo('contactCell'))
			isValid = false;
		if(!validatePhoneNo('contactFax'))
			isValid = false;
	/*}*/ // Changes done for Defect D017161
	
	return isValid;
}

function validatePhoneNo(namePrefix)
{
	if($('input[name="'+namePrefix+'CountryCode"]').val()=='' && $('input[name="'+namePrefix+'AreaCode"]').val()=='' && $('input[name="'+namePrefix+'Exchange"]').val()=='' && $('input[name="'+namePrefix+'Station"]').val()=='' && $('input[name="'+namePrefix+'Extension"]').val()=='')
		return true;
	else
	{
		if(!validateForPositiveIntegers($('input[name="'+namePrefix+'CountryCode"]').val()))
		{
			$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'AreaCode"]').val()))
		{
			$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Station"]').val()))
		{
			$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Exchange"]').val()))
		{
			$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
			return false;
		}
		else if($('input[name="'+namePrefix+'Extension"]').val()!='' && 
				!validateForPositiveIntegers($('input[name="'+namePrefix+'Extension"]').val()))
		{
			$('input[name="'+namePrefix+'Extension"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
		}
		else if($('input[name="'+namePrefix+'CountryCode"]').val()=='')
		{
			$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', 'Please enter country code', 'error', 'topRight', true);
			return false;
		}
		else if($('input[name="'+namePrefix+'AreaCode"]').val()=='')
		{
			$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Please enter area code', 'error', 'topRight', true);
			return false;
		}
		else if($('input[name="'+namePrefix+'Exchange"]').val()=='')
		{
			$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Please enter exchange code', 'error', 'topRight', true);
			return false;
		}
		else if($('input[name="'+namePrefix+'Station"]').val()=='')
		{
			$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Please enter station code', 'error', 'topRight', true);
			return false;
		}
		
		if($('input[name="'+namePrefix+'CountryCode"]').val()=='01' || $('input[name="'+namePrefix+'CountryCode"]').val()=='1')
		{
			if($('input[name="'+namePrefix+'AreaCode"]').val().length!=3)
			{
				$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Area code must be of 3 digits', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Exchange"]').val().length!=3)
			{
				$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Exchange must be of 3 digits', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Station"]').val().length!=4)
			{
				$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
				return false;
			}
			else
				return true;
		}
		else
		{
			if($('input[name="'+namePrefix+'AreaCode"]').val().length<2)
			{
				$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Area code must be of 2-4 digits', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Exchange"]').val().length<3)
			{
				$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Exchange must be of 3-4 digits', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Station"]').val().length!=4)
			{
				$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
				return false;
			}
			else
				return true;
		}
	}
}

function removePartiesPopUps() {
	$("#parties").validationEngine('hideAll');
}

function setPartyCommMethodValue(party){
	if(party.communicationMethodCode=='P'){
		$('#partyComm1').attr('checked', true);
		$('#partyComm1').val("P");
	}
	else if(party.communicationMethodCode=='C'){
		$('#partyComm2').attr('checked', true);
		$('#partyComm2').val("C");
	}
	else if(party.communicationMethodCode=='F'){
		$('#partyComm3').attr('checked', true);
		$('#partyComm3').val("F");
	}
	else if(party.communicationMethodCode=='E'){
		$('#partyComm4').attr('checked', true);
		$('#partyComm4').val("E");
	}
}

function autoBillOnchangeEventFunction()
{
	if($('#isAutobill :selected').val()==false || $('#isAutobill :selected').val()=='false')
	{
		//$('#autobillOptionCode').val('');
		//$('#autobillOptionCode').attr("disabled", true);
		$('#autobillTriggerCode').val('');
		$('#autobillTriggerCode').attr("disabled", true);
	}
	else
	{
		$('#autobillOptionCode').attr("disabled", false);
		$('#autobillTriggerCode').attr("disabled", false);
	}
}

function setAutobill(){
	$.ajax({
		url : _context +"/shipment/party/setAutobill",
		data : {
			isAutoBill : $('#isAutobill :selected').val()
		}
	});
}

function setPartiesHeader()
{
	var orderBLPresent = false;
	
	var partyHeader='';
	
	if($('#isToOrderParty').attr('checked')) 
	{
		//setAccordianTabDetails('partiesHeader', ' - '+$("#prepaidCollectCode option:selected").text()+ ' | ' + 'To Order B/L' );
		partyHeader =' | <font color="red">To Order B/L</font>';
	}
	createShipmentPartieGrid();
	//$("#gridIdForParties").trigger("reloadGrid");
	var rowIDs = jQuery("#gridIdForParties").getDataIDs();
	var cash=false;
	var deliveryPartyCount = 0;
	for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
		 if(rowData.orgCreditStatus=='CASH')
			  {
			  cash=true;
			  }
		 if(rowData.totalDeliveryPartyCount != null && rowData.totalDeliveryPartyCount != 0){
			 deliveryPartyCount = rowData.totalDeliveryPartyCount;
		 }
		}
		
	if(cash)
		{
			var status='<font color="red">CASH</font>';
			partyHeader=partyHeader+' | '+status;
		}
	if(deliveryPartyCount != 0){
		partyHeader = ' | Delivery ('+deliveryPartyCount+') '+partyHeader;
	}
	if($('#prepaidCollectCode :selected').val()!='')
			setAccordianTabDetails('partiesHeader', ' - '+$("#prepaidCollectCode option:selected").text()+ partyHeader);
		else
			setAccordianTabDetails('partiesHeader', ''+ partyHeader);
			
		
}

function validatePartiesSectionOnSave()
{
	var isValid = true;
		if($('#prepaidCollectCode :selected').val()=='' || $('#prepaidCollectCode :selected').val()==null )
		{
			if(!$('#maintainShipmentParties').is(':visible'))
				expandPartiesDiv();
			$('#prepaidCollectCode').validationEngine('showPrompt', 'Debtor is required', 'error', 'topRight', true);
			isValid = false;
		}

		if($('#isToOrderParty').attr('checked')) {
			if($('#toOrderPartyName').val() == '' && !toOrderPartyPopulated) {
				if(!$('#maintainShipmentParties').is(':visible')) {
					expandPartiesDiv();
				}
				$('#isToOrderParty').validationEngine('showPrompt', 'To Order B/L Party is required for a To Order B/L. Enter name or select a To Order B/L Party address role.', 'error', 'topRight', true);
				isValid = false; 
			}
			
		}
		
/*	if($('#totalWeight').val()=='' || $('#totalWeight').val()==null )
	{
		if($('#isProrate :selected').val()=='Y'){
			if(!$('#maintainShipmentParties').is(':visible'))
				expandPartiesDiv();
			$('#totalWeight').validationEngine('showPrompt', 'Total Weight is required', 'error', 'topRight', true);
			isValid = false;
		}
		
	}else{
		if(parseFloat($('#totalWeight').val())<=0.0){
			if($('#isProrate :selected').val()=='Y'){
			if(!$('#maintainShipmentParties').is(':visible'))
				expandPartiesDiv();
		$('#totalWeight').validationEngine('showPrompt', 'Total Weight should be greater than 0', 'error', 'topRight', true);
		isValid = false;
		}
		}
	}
		if($('#totalCube').val()=='' || $('#totalCube').val()==null )
		{
			if($('#isProrate :selected').val()=='Y'){
				if(!$('#maintainShipmentParties').is(':visible'))
					expandPartiesDiv();
			$('#totalCube').validationEngine('showPrompt', 'Total Cube is required', 'error', 'topRight', true);
			isValid = false;
		}
		}else{
			if(parseFloat($('#totalCube').val())<=0.0){
				if($('#isProrate :selected').val()=='Y'){
				if(!$('#maintainShipmentParties').is(':visible'))
					expandPartiesDiv();
			$('#totalCube').validationEngine('showPrompt', 'Total Cube should be greater than 0', 'error', 'topRight', true);
			isValid = false;
			}
			}
		}*/
	
	
	//-------------- Changed after discussion with nitin not according to UI specs-------
	/*if($('#autobillOptionCode :selected').val()=='C' && $('#autobillTriggerCode :selected').val()!='I')
	{
		expandPartiesDiv();
		$('#autobillTriggerCode').validationEngine('showPrompt', 'Trigger event must be Ingated when Autobill option is Container', 'error', 'topRight', true);
		isValid = false;
	}
	else if($('#autobillOptionCode :selected').val()!='C' && $('#autobillTriggerCode :selected').val()=='I')
	{
		if(!$('#maintainShipmentParties').is(':visible'))
			expandPartiesDiv();
		$('#autobillOptionCode').validationEngine('showPrompt', 'Autobill option must be container when trigger event is Ingated', 'error', 'topRight', true);
		isValid = false;
	}
	
	var regexp = '^[a-zA-z0-9]+$';
	var re = new RegExp(regexp);
	
	if($('#secondaryNotifyScacCode1').val()!='')
	{
		if(!re.test($('#secondaryNotifyScacCode1').val()))
		{
			if(!$('#maintainShipmentParties').is(':visible'))
				expandPartiesDiv();
			$('#secondaryNotifyScacCode1').validationEngine('showPrompt', 'Only alphanumeric characters allowed', 'error', 'topRight', true);
			isValid = false;
		}
	}
	
	if($('#secondaryNotifyScacCode2').val()!='')
	{
		if(!re.test($('#secondaryNotifyScacCode2').val()))
		{
			if(!$('#maintainShipmentParties').is(':visible'))
				expandPartiesDiv();
			$('#secondaryNotifyScacCode2').validationEngine('showPrompt', 'Only alphanumeric characters allowed', 'error', 'topRight', true);
			isValid = false;
		}
	}
	*/
	return isValid;
}

function validateForPositiveIntegers(value) {
	var re = new RegExp("^[0-9]+$");
	if (value<=0) {
		return false;
	} else if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

function expandPartiesDiv()
{
	collapseAll();
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all')[1].className
	= "ui-accordion-header ui-helper-reset ui-state-active ui-corner-top";
	$('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	$('#maintainShipmentParties').css('display', 'block');
	window.scrollTo(0, 0);
}

function enableDisableTotalWeightAndQube(){	
	var prorateValue= $('#isProrate :selected').val();
	if(prorateValue=='N'){
		$('#totalWeight').attr('disabled', true);
		$('#totalCube').attr('disabled', true);
	}else{
		$('#totalWeight').attr('disabled', false);
		$('#totalCube').attr('disabled', false);
	}
}

function changeLabelTotalWeightAndQube(){
	var measureSource= $('#unitOfMeasureSourceCode :selected').val();
	var totalWeightValue= $('#totalWeight').val();
	var totalCubeValue= $('#totalCube').val();
	if(totalWeightValue!="" &&totalCubeValue!="")
		{
		//Defect# D026701...Begin
		//$('#totalWeight').val($('#netWeight').val());
		//$('#totalCube').val($('#cube').val());
		//Defect# D026701...End
	if(measureSource=='M'){
		document.getElementById("totalWeightLBS").style.display = "none";
		document.getElementById("totalWeightKGS").style.display = "inline";
		document.getElementById("totalCubeFT").style.display = "none";
		document.getElementById("totalCubeM").style.display = "inline";
		//$('#totalWeightLBS').attr('hidden', true);
		//$('#totalWeightKGS').attr('hidden', false);
		//$('#totalCubeFT').attr('hidden', true);
		//$('#totalCubeM').attr('hidden', false);
		$('#totalCube').attr('maxlength', '6');
	}else if(measureSource=='I'){
		document.getElementById("totalWeightLBS").style.display = "inline";
		document.getElementById("totalWeightKGS").style.display = "none";
		document.getElementById("totalCubeFT").style.display = "inline";
		document.getElementById("totalCubeM").style.display = "none";
		/*$('#totalWeightLBS').attr('hidden', false);
		$('#totalWeightKGS').attr('hidden', true);
		$('#totalCubeFT').attr('hidden', false);
		$('#totalCubeM').attr('hidden', true);*/
		$('#totalCube').attr('maxlength', '7');
	}
	//add else block if measurement source is other then M or I in future
		}
	//this else block get executed when no value is present
	else
		{
		document.getElementById("totalWeight").style.display = "none";
		document.getElementById("totalWeightLBS").style.display = "none";
		document.getElementById("totalWeightKGS").style.display = "none";
		document.getElementById("totalCube").style.display = "none";
		document.getElementById("totalCubeFT").style.display = "none";
		document.getElementById("totalCubeM").style.display = "none";
		}
		
}

function displayOnHoldOrNot(holdCount){	
	var holdCount = $("#holdGrid").getGridParam("reccount"); // for Defect -- DD017560
	if(holdCount > 0){
		if($('#hiddenonHoldLink').val()=="true")
			$('#onHoldLink').html(" - ON hold ");
	}else{
		$('#onHoldLink').html("");
	}
}

function displayBillOfLading(billOfLading1){
	if(billOfLading1!="" || billOfLading1!=undefined){
		billOfLading = billOfLading1;
	}else{
	  billOfLading="Bill Of Lading";
	}
	 var tradeTypeCode=$("#tradeTypeCode").val();
	 if(tradeTypeCode!=''){
		
					
				
					$('#billOfLadingLink').html("<a href=\"javascript:shipmentHeaderLink('/shipmentPrntOptnsOverride/getPrintOptionOverride');\">"+billOfLading+"</a>");
					 $('#billOfLadingLink').css('color','blue');	
					 $('#billOfLadingLink').css('text-decoration','underline');
					 $('#billOfLadingLink').css('font-size','8');
					$("#gridIdForParties").trigger("reloadGrid");
				
	
	 //if( $('#statusCode').text() !='ISSUED' && $('#statusCode').text() !='CORRECTED' && isPrintoverrideButtonEnable==true){
		 
	 /*}else{
		 $('#billOfLadingLink').html(billOfLading);
	 }*/
	 
	 }else{
		 clearBillOfLadingHyperlink();
	 }
}
//D031201: 	Alaska - Prepaid and Collect Invoice # on Maintain Billing - Parties section 
function displayInvoiceLinks(enable){
	if($('#tradeCode').val() == 'A') {
		var prepaidInvoiceLabel = "Prepaid Invoice #";
		var collectInvoiceLabel = "Collect Invoice #";
		if(enable && $.trim($("#fpInvoiceNbr").val()) != ""){
			$('#prepaidInvoiceNbrLbl').html("<a style=\"font-size: 8pt;font-weight: bold;color: #0202FF;text-decoration: underline;text-align: right;line-height:25px;height: 29px;\" href=\"javascript:openInvoiceScreen('prepaid');\">"+prepaidInvoiceLabel+"</a>");
		} else{
			$('#prepaidInvoiceNbrLbl').html(prepaidInvoiceLabel);
		}
		if(enable && $.trim($("#fcInvoiceNbr").val()) != ""){
			$('#collectInvoiceNbrLbl').html("<a style=\"font-size: 8pt;font-weight: bold;color: #0202FF;text-decoration: underline;text-align: right;line-height:25px;height: 29px;\" href=\"javascript:openInvoiceScreen('collect');\">"+collectInvoiceLabel+"</a>");
		} else {
			$('#collectInvoiceNbrLbl').html(collectInvoiceLabel);
		}
		//D031445
		if($('#statusCode').text()!="CORRECTED" && $('#statusCode').text()!="ISSUED"){
			//D033651 - Disable invoice field which is not applicable
			if($('#prepaidCollectCode :selected').val() == "P"){
				$('#fpInvoiceNbr').attr('disabled', false);
				$('#fcInvoiceNbr').attr('disabled', true);
			} else if($('#prepaidCollectCode :selected').val() == "C"){
				$('#fpInvoiceNbr').attr('disabled', true);
				$('#fcInvoiceNbr').attr('disabled', false);
			} else {
				$('#fpInvoiceNbr').attr('disabled', false);
				$('#fcInvoiceNbr').attr('disabled', false);
			}
			if($.trim($("#fpInvoiceNbr").val()) != "" || $.trim($("#fcInvoiceNbr").val()) != ""){
				$('#prepaidCollectCode').attr('disabled', true);
			} else {
				$('#prepaidCollectCode').attr('disabled', false);
			}
		}
	}
}

function openInvoiceScreen(pc){
    //D031445
	var url = "/cas/freightInvoiceAssignmentQueueSearch.do";
	if(pc == "prepaid"){
		url = url +"?invoiceNbr=" + $("#fpInvoiceNbr").val();
	} else if (pc == "collect"){
		url = url +"?invoiceNbr=" + $("#fcInvoiceNbr").val();
	}
	document.location.href=_context + url;
}

function clearBillOfLadingHyperlink(){
	var billOfLading="Bill Of Lading";
	 $('#billOfLadingLink').html(billOfLading);
	 $('#billOfLadingLink').css('color','Black');	
	 $('#billOfLadingLink').css('text-decoration','none');
	 $('#billOfLadingLink').css('font-size','8');
}
function hideLablesForTotalWeightAndCube(){
	$('#totalWeightLBS').attr('hidden', true);
	$('#totalWeightKGS').attr('hidden', true);
	$('#totalCubeFT').attr('hidden', true);
	$('#totalCubeM').attr('hidden', true);
}

function showHideLableAsPerValues(){
	hideLablesForTotalWeightAndCube();
	var totalWeightValue= $('#totalWeight').val();
	var totalCubeValue= $('#totalCube').val();
	
	var valueExistWeight=true;
	var valueExistCube=true;
	if((totalWeightValue ==null || totalWeightValue=='' || totalWeightValue=='0' || totalWeightValue=='0.0' || totalWeightValue=='0.00' || totalWeightValue=='0.000')) {
		valueExistWeight=false;
		//$('#totalWeight').attr('hidden', true);
		document.getElementById("totalWeight").style.display = "none";
		document.getElementById("totalWeightLBS").style.display = "none";
		document.getElementById("totalWeightKGS").style.display = "none";
	}else{
		//$('#totalWeight').attr('hidden', false);
		document.getElementById("totalWeight").style.display = "inline";
		
	}
	if((totalCubeValue==null || totalCubeValue=='' || totalCubeValue=='0' || totalCubeValue=='0.0' || totalCubeValue=='0.00' || totalCubeValue=='0.000')){
		valueExistCube=false;
		//$('#totalCube').attr('hidden', true);
		document.getElementById("totalCube").style.display = "none";
		document.getElementById("totalCubeFT").style.display = "none";
		document.getElementById("totalCubeM").style.display = "none";
	}else{
		//$('#totalCube').attr('hidden', false);
		document.getElementById("totalCube").style.display = "inline";
	}
	if(valueExistCube || valueExistWeight){
		changeLabelTotalWeightAndQube();
	}
		
}
function resetShipmentParties(){
	hideLablesForTotalWeightAndCube();
	clearBillOfLadingHyperlink();
}
//22735
function disablePartiesCheckBoxes(){
	if($("#statusCode").text()=="ISSUED" || $("#statusCode").text()=="CORRECTED" ){
	   //disable checkboxes
	   $("#cb_gridIdForParties").attr('disabled',true);
	   $("[id^=jqg_gridIdForParties]").attr('disabled',true);
	}
}
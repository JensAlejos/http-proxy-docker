var debtorCode = "";
var isPartyChanged = "";
var toOrderParty = false;
var toOrderFound = false;
var toOrderPartyPopulated = false;

$(document).ready(
function() {
	
	debtorCode = $('#prepaidCollectCode :selected').val();
	
	$('#parties :input').change(function()
	{
		if(this.type!='checkbox')
			isPartyChanged = "Y";
	});
	//change 18644
	$('#isToOrderParty').change(function(){
		if($('#isToOrderParty').attr('checked')) {
			setPartiesHeader();
		} else {
			if(toOrderParty) {
				alert('To Order B/L Party must be deleted first');
				$('#isToOrderParty').attr('checked', true);
			} else {
				setPartiesHeader();
			}
			
			
		}
		
	});
	//autoBillOnchangeEventFunction();
	
	$('#isAutobill').change(function(){
		if($('#billExists').val() == 'Y'){
			if($('#isAutobill :selected').val()=="true")
				$('#isAutobill').val('false');
			else
				$('#isAutobill').val('true');
			$('#msgDiv').html('<div class="message_error">Autobill cannot be changed as Bill exists</div>');
			window.scrollTo(0, 0);
			triggerErrorMessageAlert();
		}
		else {
			if($('#isAutobill :selected').val()=="true"){
				//-------------BR1 nullified because of client comments---------------
				/*if($('#loadDschServiceGroupCode').val()=="CON"){
					$('#msgDiv').html('<div class="message_error">'+'Auto Bill cannot be true for the provided load and discharge service'+'</div>');
					window.scrollTo(0, 0);
					$('#isAutobill').val(false);
				}
				//Nullified due to defect id D020081
				else if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()=='1'){
					if($.trim($("#tariff").val())=='' || $.trim($("#tariffCommodityDescription").val())=='' || $.trim($("#tariffItemNumber").val())=='' || $.trim($("#commodityCode").val())==''){
						$('#msgDiv').html('<div class="message_error">Tariff, Tariff Commodity Description, Item and Commodity Code are mandatory for commodity if Auto Bill indicator is Yes</div>');
						window.scrollTo(0, 0);
						$('#isAutobill').val(false);
					}
					else{
						$('#msgDiv').html("");
						setMandatoryTariffCmdDesc();
						autoBillOnchangeEventFunction();
					}
				}
				// Changed due to defect id D020446
				else */if($('#bookingTypeCode').val()=='B' /*&& $.trim($('#quoteVNConcat').val())=='' */
					&& $('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()>1){
						$('#msgDiv').html('<div class="message_error">'+'Cannot update Auto Bill Indicator as multiple commodity lines exist'+'</div>');
						window.scrollTo(0, 0);
						$('#isAutobill').val(false);
						triggerErrorMessageAlert();
				}
				// Changed due to defect id D020873
				else if($('#shipmentNumber').val() != '' && $('#bookingTypeCode').val()=='B' && 
						($.trim($('#quoteVNConcat').val())=='' || ($.trim($('#quoteVNConcat').val())!='' &&  
								$("#isConstructedQuote").val()!='Y'))){
					setMandatoryTariffCmdDesc();
					autoBillOnchangeEventFunction();
					$('#msgDiv').html('');
				}
				else{
					autoBillOnchangeEventFunction();
					$('#msgDiv').html('');
				}
			}
			else{
				resetMandatoryTariffCmdDesc();
				autoBillOnchangeEventFunction();
				$('#msgDiv').html('');
			}
			//autoBillOnchangeEventFunction();
		}
		//change 18644
		setPartiesHeader();
	});
	
	//--------------changed after discussion with nitin----------------
	/*$('#autobillOptionCode').change(function()
	{
		if($('#autobillOptionCode :selected').val()=='C')
			$('#autobillTriggerCode').val('I');
	});*/
	
	$('#autobillTriggerCode').change(function()
	{
		if($('#autobillTriggerCode :selected').val()=='I')
			$('#autobillOptionCode').val('C');
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
			tabSequence('#',true,false);
		},
		open: function()
		{
			tabSequence('#partiesDialog',false,false);
			$("#parties").validationEngine('attach');
			$("#parties").validationEngine('attach');
			isPartyChanged = "";
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
	
	$("#partiesSaveDialog").dialog({
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
		/*Booking Security*/
		if(isPartiesDisplayOnly && isPartiesModifiable){
			if($('#bookingStatusCode :selected').val()!='CANC'){
				showAddPartyDialog();
			}
		}
		return false;
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
					triggerErrorMessageAlert();
					return;
				} else if (defaultDebtor == "C"
					&& ( $('input[name="consignee\\.organizationId"]').val() == '' ||
						 $('input[name="consignee\\.addressRoleId"]').val()== '') ) {
					$('#msgDiv').html('<div class="message_error">Consignee must be specified for Collect payment</div>');
					window.scrollTo(0, 0);
					$('#prepaidCollectCode').val(debtorCode);
					triggerErrorMessageAlert();
					return;
				} else if (defaultDebtor == "B"
					&& ( $('input[name="shipper\\.organizationId"]').val() == '' || 
						 $('input[name="consignee\\.organizationId"]').val() == '' || 
						 $('input[name="shipper\\.addressRoleId"]').val()=='' ||
						 $('input[name="consignee\\.addressRoleId"]').val()== '') ) {
					$('#msgDiv').html('<div class="message_error">Shipper and Consignee must be specified for Both payment</div>');
					window.scrollTo(0, 0);
					$('#prepaidCollectCode').val(debtorCode);
					triggerErrorMessageAlert();
					return;
				}
				
				var queryString = $('#bookingForm').formSerialize();
				$.ajax({
						url : _context +"/booking/party/defaultDebtors",
						type : "POST",
						data : queryString,
						success : function(responseText) {
							showResponseMessages('msgDiv', responseText);	
							$("#gridIdForParties").trigger("reloadGrid");
						}
				});
				
				debtorCode = defaultDebtor;
				setPartiesHeader();
			});
	
			/*Booking Security*/
			var hideDelbutton = true;
			if(isPartiesDisplayOnly && !isPartiesModifiable){
				hideDelbutton = false;
			}

			// party grid config
			var colNames = [ 'Id', 'Type', '', 'One Time Customer','Organization Name', 
			                 'Address', 'City', 'State', 'Zip','Country', 'Name Qualifier', 
			                 'Override', 'Cash', 'Customized', '' ];
			var colModel = [ {
				name : 'partySeqNo',
				index : 'partySeqNo',
				hidden : true
			}, {
				name : 'partyTypeDescription',
				index : 'partyTypeDescription',
				width : 200,
				formatter : 'showlink',
				formatoptions : {
					baseLinkUrl : "javascript:",
					showAction : "showEditPartyDialog('",
					addParam : "');"
				}
			}, {
				name : 'totalDeliveryParty',
				index : 'totalDeliveryParty',
				hidden : true
			},{
				name : 'isOneTimeCustomer',
				index : 'isOneTimeCustomer',
				width : 100,
				formatter : 'oneTimeViewFormatter'
			}, {
				name : 'organizationName',
				index : 'organizationName',
				width : 300
			}, {
				name : 'address',
				index : 'address',
				width : 350,
				formatter : 'addressFormatter'
			}, {
				name : 'city',
				index : 'city',
				hidden : true
			}, {
				name : 'state',
				index : 'state',
				hidden : true
			}, {
				name : 'zip',
				index : 'zip',
				hidden : true
			},{
				name : 'countryName',
				index : 'countryName',
				width : 80
			},
			{
				name : 'nameQualifier',
				index : 'nameQualifier',
				hidden : true
			}, {
				name : 'isCpPartyOverridden',
				index : 'isCpPartyOverridden',
				align : 'center',
				width : 100,
				formatter : 'overrideViewFormatter'
			}, {
				name : 'orgCreditStatus',
				index : 'orgCreditStatus',
				width : 100
			}, {
				name : 'partyAddressCustomized',
				index : 'partyAddressCustomized',
				hidden : true
			}, {
				name : 'actions',
				index : 'actions',
				width : 80,
				formatter : 'actions',
				formatoptions : {
					keys : true,
					editbutton : false,
					delbutton : hideDelbutton
					/*delOptions : {
						delData : {
							debtor : defaultDebtor
						}
					}*/
				}
			} ];
			
			jQuery.extend($.fn.fmatter,
					{
						overrideViewFormatter : function(cellvalue,
								options, rowdata) {
							if (cellvalue == true
									|| cellvalue == 'true')
								return "Yes";
							/*else if (rowdata.partyTypeDescription!='Also Notify Party'
								&& rowdata.partyTypeDescription!='To Order B/L Party' &&
									(cellvalue == false
									|| cellvalue == 'false'))
								return "No";*/
							else
								return "";
						},
						
						oneTimeViewFormatter : function(cellvalue,
								options, rowdata) {
							if (cellvalue == true
									|| cellvalue == 'true')
								return "Yes";
							else if (cellvalue == false
									|| cellvalue == 'false')
								return "No";
							else
								return "";
						},
						
						addressFormatter : function(cellvalue,
								options, rowdata) {
							
							var finalAddress = cellvalue + " - " + rowdata.city;
							
							if (rowdata.state != null && rowdata.state != "" && rowdata.state!='null') {
								finalAddress = finalAddress + ", " + rowdata.state;
							}
							if(rowdata.zip!= null && rowdata.zip !='' && rowdata.zip!='null')
								finalAddress = finalAddress + " - " + rowdata.zip;
							
							return finalAddress;
						}
					});

			var jsonReaderParties = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "partySeqNo"
			};
			
			var partiesDelData = { 
					shipperArolId : function() { return $('input[name="shipper\\.addressRoleId"]').val(); },
					consigneeArolId : function() { return $('input[name="consignee\\.addressRoleId"]').val(); },
					tradeCode : function() { return $('#tradeCode :selected').val(); }
			};
			
			/*Booking Security*/
			if(isPartiesDisplayOnly || isPartiesModifiable){
				createGrid("gridIdForParties", // grid id for party
				"pagerIdForParties", // page id for party
				_context+'/booking/party/load', // geturl
				'', // addurl
				'', // edit url
				_context+'/booking/party/deleteParty',
				_context+'/booking/party/deleteParty',// delete selected URL
				colNames, colModel, "Parties",// caption
				112,// height //113 for new Font
				4,// row num
				[ 4, 8, 12 ],// row list
				true,// multiselect
				true,// multidelete
				false,// load once
				false, // read only grid
				jsonReaderParties, // json reader
				true, // hide edit
				false, // hide delete
				true, // autowidth
				true, // rownumbers
				true, // hide custom add row
				false,// hide pager row
				null,// custom edit method
				partiesGridComplete,// custom grid complete
				partiesLoadComplete,// custom load complete
				false,// default hidden
				true,// row Color Based On status
				false,// celledit
				partiesAfterSubmit,
				false, // isSearch
				partiesDelData//delExtraParam
				);
				
				$("#gridIdForParties").jqGrid('setGridParam',{
					beforeSelectRow: function(rowId, e) {
						 var rowData = jQuery("#gridIdForParties").getRowData(rowId);
						 if((rowData.partyTypeDescription=='Prepaid Bill To Party' || rowData.partyTypeDescription=='Collect Bill To Party') 
							 && (rowData.isCpPartyOverridden==false|| rowData.isCpPartyOverridden=='false' || 
									 rowData.isCpPartyOverridden=='')) {
							 return false;
						 }
						 else
							 return true;
					 }
				});
				
				//D032363 - start
				
				// Autocompleter and lookup for PCC codes
				$('#primaryCarrierCode').gatesAutocomplete({
					source : _context + '/tm/Autocomplete/autoPccCodesPredictive',
					name: "Primary Carrier Code",
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
					formatItem : function(item) {
						return item.pccCode;	
						
					},
					formatResult: function(item) {
						return item.pccCode;	
													
					},
					select : function(item) {
												
						$('#primaryCarrierCode').val(item.pccCode);
						isBookingChanged = "Y";
						
					}
				});
				
				//D032363 - end
		}
});


//--------Supporting Functions-----------------

var partiesLoadComplete = function()
{
	//Hides add Row
	 $("#tr_partySeqNo", "#gbox_gridIdForParties").hide();
	 
	//Clears and hides error row
	$('table[aria-labelledby="gbox_gridIdForParties"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_gridIdForParties"] thead tr[id="FormError"]').hide();
};

var partiesGridComplete = function()
{
	 
	 $('#pagerIdForParties .ui-pg-input').attr("readonly", true);
	 
	 var rowIDs = jQuery("#gridIdForParties").getDataIDs();
	 toOrderFound = false;
	 /*var isPrepaidDebtorCash = false;
	 var isCollectDebtorCash = false;*/
	 for (var i=0;i<rowIDs.length;i=i+1)
     { 
	   var id = $('#gridIdForParties').getCell(rowIDs[i], 'partySeqNo');
       var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
       if (((rowData.partyTypeDescription=='Prepaid Bill To Party' || rowData.partyTypeDescription=='Collect Bill To Party') && 
    		   (rowData.isCpPartyOverridden == false || rowData.isCpPartyOverridden == 'false' || rowData.isCpPartyOverridden == '')) 
	    	  || $("#bookingStatusCode :selected").val()=='CANC' || !isPartiesModifiable) 
       {
    	   $(".ui-inline-del", "#gbox_gridIdForParties #"+rowIDs[i]).hide();
    	   $('#jqg_gridIdForParties_'+id).attr("checked",false);
    	   $('#jqg_gridIdForParties_'+id).hide();
    	   $('table[aria-labelledby="gbox_gridIdForParties"] tbody tr#' + rowIDs[i]).removeClass('ui-state-highlight');
       }
       if(rowData.partyAddressCustomized == 'true' || rowData.partyAddressCustomized == true) { 
    	   $('#gridIdForParties').jqGrid('setCell', i+1, 'organizationName','','',{style: 'color : green'},'');
       } else {
    	   $('#gridIdForParties').jqGrid('setCell', i+1, 'organizationName','','',{style: 'color : black'},'');
       }
       
    // debtor one timer ...change background to yellow
       if (rowData.isOneTimeCustomer=='Yes') {
    	   $('#gridIdForParties').jqGrid('setRowData',rowIDs[i],false, {background:'#ffffcc'});
       }      
       
       
       //18644
       if(rowData.orgCreditStatus== 'CASH')
	   {
	   $('#gridIdForParties').jqGrid('setCell', id, 'orgCreditStatus','','',{style: 'color : red'},'');
	   }else {
    	   $('#gridIdForParties').jqGrid('setCell', id, 'orgCreditStatus','','',{style: 'color : black'},'');
       }
       
      
     }
	
	// D026350 
	// I don't understand the delete API so I am using this.
	// Global variable if the toOrder party was ever seen:  toOrderParty
	// Local variable if it is still there now toOrderFound.
	//  if(toOrderParty && !toOrderFound) then it was just removed so uncheck the box
	// Otherwise it is checked without the party so leave it. 
	// D025889
	var userData = $("#gridIdForParties").getGridParam('userData');
		
	if(userData && userData.TOORDERFLAG) { 
	   $('#isToOrderParty').attr("checked",true);
  	   toOrderParty = true;
  	   toOrderFound = true;
	}
	 
	if(toOrderParty && !toOrderFound)  {
		// D026350 reeval, don't uncheck to order on removal.
		// Not sure all these flag make sense without this rule but should work.
		//console.log('to order party removed');
		//$('#isToOrderParty').attr("checked",false);
		toOrderParty = false;
	}
	 
	if($("#bookingStatusCode :selected").val()=='CANC' || !isPartiesModifiable)
	{
		$("#gbox_gridIdForParties .cbox").attr("disabled", true);
	}
	else
	{
		$('#jqgh_gridIdForParties_cb').html('<input type="checkbox" id="multiselect_gridIdForParties" />');
		$("#multiselect_gridIdForParties").click(function(){
			$("#gridIdForParties").resetSelection();
			
			if($("#multiselect_gridIdForParties").attr("checked")=="checked")
			{
				  var rowIDs = jQuery("#gridIdForParties").getDataIDs(); 
			      for (var i=0;i<rowIDs.length;i=i+1)
			      { 
			    	  var id = $('#gridIdForParties').getCell(rowIDs[i], 'partySeqNo');
			    	  var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
			    	  /*if(rowData.partyTypeDescription=='Prepaid Bill To Party' ||   
			    			rowData.partyTypeDescription=='Collect Bill To Party')
			    	  {*/
			    	  if(((rowData.partyTypeDescription=='Prepaid Bill To Party' || rowData.partyTypeDescription=='Collect Bill To Party') && 
			    			  (rowData.isCpPartyOverridden==false || rowData.isCpPartyOverridden == 'false' || rowData.isCpPartyOverridden == '')) 
				    	  || $("#bookingStatusCode :selected").val()=='CANC' || !isPartiesModifiable) 
			    	  {
			    		  $('#jqg_gridIdForParties_'+id).attr("checked",false);
			    	  }
			    	  else
			    	  {
			    		  $('#jqg_gridIdForParties_'+id).attr("checked",true);
		 		    	  $('#gridIdForParties').setSelection(rowIDs[i], true);
			    	  }
			      }
			}
			return true;
		});
	}
	//18644
	setPartiesHeader();
	
};

var partiesAfterSubmit = function(result)
{
	if(result.success)
		isBookingChanged = "Y";
};

// clears the parties form
function clearPartiesForm() {
	removePartiesPopUps();
	$("#parties").clearForm();
	$('input[name="partySeqNo"]').val('');
	$('input[name="organizationId"]').val('');
	$('input[name="organizationCode"]').val('');
	$('input[name="isOneTimeCustomer"]').val('');
	$('input[name="addressRoleId"]').val('');
	$('select[name="partyTypeCode"]').children().remove();
	$('select[name="partyTypeCode"]').append(
			"<option value=''></option>");
	$('select[name="contactId"]').children().remove();
	$('select[name="contactId"]').append(
			"<option value=''>Select</option>");
	$('#partyComm1').attr("checked", false);
	$('#partyComm2').attr("checked", false);
	$('#partyComm3').attr("checked", false);
	$('#partyComm4').attr("checked", false);
	
	$('#partiesMsgDiv').html('');
}

function showAddPartyDialog() {
	//Cleared city/state/zip for defect D031124
	$('input[name="city"]').val('');
	$('input[name="state"]').val('');
	$('input[name="zip"]').val('');
	urlString = "/booking/party/showFormAdd";
	if($('#isTemplate').val() == 'true'){
		urlString = urlString + "?isTemplate="+ $('#isTemplate').val();
	}
	$.ajax({
		url : _context + urlString ,
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
						if(r)
							$(this).dialog("close");
						else
							return;
					}
					else
						$(this).dialog("close");
				}
			}, {
				text : "Ok",
				click : function() {
					addParty();
				}
			} ]);
			var xErrorCoordinate = window.pageXOffset;
			var yErrorCoordinate = window.pageYOffset;
			$("#partiesDialog").dialog('open');
			setTimeout(function(){
				window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
		}
	});
}

function showEditPartyDialog(id) {
	urlString = "/booking/party/showPartyFormEdit";
	/*Booking Security*/
	if($('#isTemplate').val() == 'true'){
		urlString = urlString + "?isTemplate="+ $('#isTemplate').val();
	}
	if((isPartiesDisplayOnly && !isPartiesModifiable) || $("#bookingStatusCode :selected").val()=='CANC'){
		$("#partiesDialog").gatesDisable();
	}
	else{
		$("#partiesDialog").gatesEnable();
	}
	var seqNo = id.split('=')[1];
	$.ajax({
		url : _context +urlString,
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
						removePartiesPopUps();
						if(isPartyChanged!="")
						{
							var r = confirm("All unsaved changes will be discarded.Continue?");
							if(r)
								$(this).dialog("close");
							else
								return;
						}
						else
							$(this).dialog("close");
					}
				}, {
					text : "Ok",
					click : function() {
						if($("#bookingStatusCode").val()!='CANC'){
							updateParty();
						}else{
							$("#partiesDialog").dialog('close');
						}
					}
				} ]);
				partyOrg = $('input[name="organizationName"]').val();
				partyAddr = $('input[name="address"]').val();
				var xErrorCoordinate = window.pageXOffset;
				var yErrorCoordinate = window.pageYOffset;
				/*Booking Security*/
				if(isPartiesDisplayOnly && !isPartiesModifiable){
					disableDialogButton('partiesDialog', 'Ok');
				}
				$("#partiesDialog").dialog('open');
				setTimeout(function(){
					window.scrollTo(xErrorCoordinate, yErrorCoordinate);
				}, 250);
			}
		}
	});
	//return false;
}

function addParty() {
	removePartiesPopUps();
	if ($("#parties").validationEngine('validate') && validateContactDetails()) {
		
		var queryString = $('#parties').formSerialize();
		$.ajax({
			url : _context +"/booking/party/addParty",
			type : "POST",
			data : queryString,
			success : function(responseText) {
				if (responseText.success == true) {
					$("#gridIdForParties").trigger("reloadGrid");
					$("#partiesDialog").dialog('close');
					isBookingChanged = "Y";
				} else 
					//alert(responseText.messages.error[0]);
					showResponseMessages("partiesMsgDiv", responseText);
			}
		});
	} else
		return;
}

function updateParty() {
	removePartiesPopUps();
	if ($("#parties").validationEngine('validate') && validateContactDetails()) {
		
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
				url : _context +"/booking/party/validateOverrideUpdate?relationshipTypeCode="
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
								}
							}, {
								text : "Cancel",
								click : function() {
									$("#partiesOverrideDialog").dialog('close');
								}
							} ]);
						
						$("#partiesOverrideDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").hide(); 
						var xErrorCoordinate = window.pageXOffset;
						var yErrorCoordinate = window.pageYOffset;
						$("#partiesOverrideDialog").dialog('open');
						setTimeout(function(){
							window.scrollTo(xErrorCoordinate, yErrorCoordinate);
							}, 250);
						//return false;
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
		url : _context +"/booking/party/updateParty",
		type : "POST",
		data : queryString+"&confirm="+confirm+"&relationshipTypeCode="+relationshipTypeCode+"&orgAroleId="+orgAroleId+"&tradeCode="+$('#tradeCode').val(),
		success : function(responseText) {
			if (responseText.success == true) {
				$("#gridIdForParties").trigger("reloadGrid");
				$("#partiesDialog").dialog('close');
				showResponseMessages("msgDiv", responseText);
				isBookingChanged = "Y";
			}
			else {
				//alert(responseText.messages.error[0]);
				showResponseMessages("partiesMsgDiv", responseText);
			}
		}
	});
}

function checkDebtors()
{
	if(isTemplateFirstLoad && $("#bookingStatusCode :selected").val()!='CANC' && isPartiesModifiable)
	{
		var isShipperOverridden = false;
		var isConsigneeOverridden = false;
		var rowIDs = jQuery("#gridIdForParties").getDataIDs();
		for (var i=0;i<rowIDs.length;i=i+1)
	    { 
	      var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
	      if (rowData.partyTypeDescription=='Prepaid Bill To Party' && (rowData.isCpPartyOverridden=='true'
	    	  || rowData.isCpPartyOverridden == true || rowData.isCpPartyOverridden == 'Yes'))
	      {
	    	  isShipperOverridden = true;
	      }
	      else if (rowData.partyTypeDescription=='Collect Bill To Party' && (rowData.isCpPartyOverridden=='true'
	    	  || rowData.isCpPartyOverridden == true || rowData.isCpPartyOverridden == 'Yes'))
	      {
	    	  isConsigneeOverridden = true;
	      }
	    }
		if(isShipperOverridden && !isConsigneeOverridden)
		{
			openOverrideDialog('prepaid');
		}
		else if(!isShipperOverridden && isConsigneeOverridden)
		{
			openOverrideDialog('collect');
		}
		else if(isShipperOverridden && isConsigneeOverridden)
		{
			openOverrideDialog('both');
		}
		else
			validateBooking();
	}
	else
		validateBooking();
}

function openOverrideDialog(type)
{
	$("#partiesOverrideDialogDiv").html("Bill To not default. Permanent changes in CP.");
	$("#partiesSaveDialog").dialog("option", "buttons", [ {
		text : "Override",
		click : function() {
			$("#partiesSaveDialog").dialog("close");
			blockUI();
			validateBooking();
		}
	}, {
		text : "Default",
		click : function() {
			defaultParty(type);
		}
	},{
		text : "Cancel",
		click : function() {
			$('#bookingSave').attr("disabled", false);
			$("#partiesSaveDialog").dialog('close');
		}
	} ]);
	$("#partiesSaveDialog").dialog().parents(".ui-dialog").find(".ui-dialog-titlebar").hide(); 
	$.unblockUI();
	var xErrorCoordinate = window.pageXOffset;
	var yErrorCoordinate = window.pageYOffset;
	$('#partiesSaveDialog').dialog('open');
	setTimeout(function(){
		window.scrollTo(xErrorCoordinate, yErrorCoordinate);
		}, 250);
	//return false;
}

function defaultParty(type)
{
	$.ajax({
		url : _context +"/booking/party/setDefault",
		data : {
					type:type, 
					tradeCode:$('#tradeCode :selected').val(), 
					shipperArolId:$('input[name="shipper\\.addressRoleId"]').val(), 
					consigneeArolId:$('input[name="consignee\\.addressRoleId"]').val()
				},
		success : function(responseText) {
			if (responseText.success == true) {
				$("#gridIdForParties").trigger("reloadGrid");
				$("#partiesSaveDialog").dialog("close");
				blockUI();
				validateBooking();
			}
			else 
			{
				$('#bookingSave').attr("disabled", false);
				alert("An error has occurred");
			}
		}
	});
}

function validateContactDetails()
{
	var isValid = true;
	//D018663: 	GATES : Customer field behaviour
	if($("#tradeCode").val()=="F"){
		return isValid;
	}
	if($('input[name="contact"]').val()!='' && $('select[name="contactId"] :selected').val()=='' && 
			!$('#partyComm1').attr('checked') && !$('#partyComm2').attr('checked') && !$('#partyComm3').attr('checked') && !$('#partyComm4').attr('checked'))
	{
		//$("#partyComm1").validationEngine('showPrompt', 'Please select a communication mode', 'error', true);
		isValid = true;
	}
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
	/*else
	{
		$('input[name="contact"]').validationEngine('showPrompt', 'Contact is required', 'error', 'topRight', true);
		isValid = false;
	}*/	
	
	return isValid;
}

function validatePhoneNo(namePrefix)
{
	if($('input[name="'+namePrefix+'CountryCode"]').val()=='' && $('input[name="'+namePrefix+'AreaCode"]').val()=='' && $('input[name="'+namePrefix+'Exchange"]').val()=='' && $('input[name="'+namePrefix+'Station"]').val()=='' && $('input[name="'+namePrefix+'Extension"]').val()=='')
		return true;
	else
	{
		/*if(!validateForPositiveIntegers($('input[name="'+namePrefix+'CountryCode"]').val()))
		{
			$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', '* Only digits are allowed', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'AreaCode"]').val()))
		{
			$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', '* Only digits are allowed', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Station"]').val()))
		{
			$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', '* Only digits are allowed', 'error', 'topRight', true);
			return false;
		}
		else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Exchange"]').val()))
		{
			$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', '* Only digits are allowed', 'error', 'topRight', true);
			return false;
		}
		else if($('input[name="'+namePrefix+'Extension"]').val()!='' && 
				!validateForPositiveIntegers($('input[name="'+namePrefix+'Extension"]').val()))
		{
			$('input[name="'+namePrefix+'Extension"]').validationEngine('showPrompt', '* Only digits are allowed', 'error', 'topRight', true);
		}
		else if($('input[name="'+namePrefix+'CountryCode"]').val()=='')
		{
			$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', 'Please enter country code', 'error', 'topRight', true);
			return false;
		}
		else */if($('input[name="'+namePrefix+'AreaCode"]').val()=='')
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
		
		if($('input[name="'+namePrefix+'CountryCode"]').val()=='' || $('input[name="'+namePrefix+'CountryCode"]').val()=='1' 
			 || $('input[name="'+namePrefix+'CountryCode"]').val()=='01'  || $('input[name="'+namePrefix+'CountryCode"]').val()=='001')
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
			//D033813: 	SPX: MAINTAIN BKG - NEED TO RELAX THE PHONE# EDIT for NON-US
			/*if($('input[name="'+namePrefix+'AreaCode"]').val().length<2)
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
			else*/
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

function autoBillOnchangeEventFunction(){
	if($('#isAutobill :selected').val()==false || $('#isAutobill :selected').val()=='false'){
		//$('#autobillOptionCode').val('');
		//$('#autobillOptionCode').attr("disabled", true);
		$('#autobillTriggerCode').val('');
		$('#autobillTriggerCode').attr("disabled", true);
		$('#autobillCreateStatusCode').val('');
	}
	else{
		/*Booking Security*/
		if(isShipperConsgineeModifiable){
			$('#autobillOptionCode').attr("disabled", false);
			$('#autobillTriggerCode').attr("disabled", false);
			if($.trim($('#autobillCreateStatusCode').val())=='')
				$('#autobillCreateStatusCode').val('N');
		}
	}
	setAutobill();
}

function setAutobill(){
	/*$.ajax({
		url : _context +"/booking/party/setAutobill",
		data : {
			isAutoBill : $('#isAutobill :selected').val()
		}
	});*/
}

function setPartiesHeader()
{
		//18644
	//var string='';
	var rowIDs = jQuery("#gridIdForParties").getDataIDs();
	var  partyHeader='';
	var cash=false;
	 setPartyAccordianTabDetails("notifyPartyHeader","");
	 setPartyAccordianTabDetails("alsoNotifyPartyHeader","");
	 setPartyAccordianTabDetails("notifypartytext","");
	 setPartyAccordianTabDetails("alsonotifypartytext","");
	 setPartyAccordianTabDetails("fwdAgenttext","");
	 setPartyAccordianTabDetails("fwdAgentPartyHeader","");
	 if($('#isAutobill :selected').val()=='true'){
	 partyHeader=' | Auto Bill ';
	 }
	 var deliveryPartyCount = 0, count=0;
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		 // var id = $('#gridIdForParties').getCell(rowIDs[i], 'partySeqNo');
		  var rowData=jQuery("#gridIdForParties").getRowData(rowIDs[i]);
		  if(rowData.partyTypeDescription=='Notify Party')
			  
		  {
			  setPartyAccordianTabDetails('notifypartytext', '|  Notify Party  ');
			  //string=' | '+ partytype+'-'+rowData.organizationName;
			  setPartyAccordianTabDetails('notifyPartyHeader', ' - '+rowData.organizationName);
			 
		 
		  }
		  if(rowData.partyTypeDescription=='Also Notify Party')
			  {
			  if(count<1)
			  {
			  setPartyAccordianTabDetails('alsonotifypartytext', '|  Also Notify Party  ');
			  setPartyAccordianTabDetails('alsoNotifyPartyHeader', ' - '+rowData.organizationName);
			  count++;
			// add code to display Also Notify Party in Header
			  }
			  }
		  if(rowData.partyTypeDescription=='Forwarding Agent')
		  {
		  setPartyAccordianTabDetails('fwdAgenttext', '|  Fwd Agent ');
		  setPartyAccordianTabDetails('fwdAgentPartyHeader', ' - '+rowData.organizationName);

		  }
		  if(rowData.orgCreditStatus=='CASH')
			  {
			  cash=true;
			  }
		  if(rowData.totalDeliveryParty != null && rowData.totalDeliveryParty != 0){
			  deliveryPartyCount =  rowData.totalDeliveryParty;
		  }
		}
		if(cash)
		{
			var status='<font color="red">CASH</font>';
			partyHeader=partyHeader+' | '+status;
		 }
		if( $('#isToOrderParty').attr("checked"))
		{
			var label='<font color="red">To Order B/L</font>';
			partyHeader=partyHeader+' | '+label;
		}
		//partyHeader=partyHeader+string;
		if(deliveryPartyCount != 0){
			partyHeader = ' | Delivery ('+deliveryPartyCount+') '+partyHeader;
		}
		if($('#prepaidCollectCode :selected').val()!='')
			//setAccordianTabDetails('partiesHeader', ' - '+$("#prepaidCollectCode option:selected").text()+partyHeader);
			setPartyAccordianTabDetails('partiesHeader', ' - '+$("#prepaidCollectCode option:selected").text()+partyHeader);
		else
			setPartyAccordianTabDetails('partiesHeader', partyHeader);

}
//18644
function setPartyAccordianTabDetails(id,displayText)
{
$("#"+id).html(displayText);
}

function validatePartiesSectionOnSave()
{
	var isValid = true;
	if(($('#prepaidCollectCode :selected').val()=='P' || $('#prepaidCollectCode :selected').val()=='B')
			&& $('input[name="shipper\\.addressRoleId"]').val()=='')
	{
		//if(!$('#maintainBookingParties').is(':visible'))
			expandPartiesDiv(isValid);
		$('#prepaidCollectCode').validationEngine('showPrompt', 'Shipper is required for Debtor to be Prepaid or Both', 'error', 'topRight', true);
		isValid = false;
	}
	else if(($('#prepaidCollectCode :selected').val()=='C' || $('#prepaidCollectCode :selected').val()=='B')
			&& $('input[name="consignee\\.addressRoleId"]').val()=='')
	{
		//if(!$('#maintainBookingParties').is(':visible'))
			expandPartiesDiv(isValid);
		$('#prepaidCollectCode').validationEngine('showPrompt', 'Consignee is required for Debtor to be Prepaid or Both', 'error', 'topRight', true);
		isValid = false;
	}
	if($('#bookingTypeCode').val()=='B' && $('#bookingStatusCode :selected').val()=='APPR')
	{
		if($('#prepaidCollectCode :selected').val()=='')
		{
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#prepaidCollectCode').validationEngine('showPrompt', 'Debtor is required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	
	if($('#isAutobill :selected').val()=='true'){
		/*if($('#loadDschServiceGroupCode').val()=="CON"){
		$('#msgDiv').html('<div class="message_error">'+'Auto Bill cannot be true for the provided load and discharge service'+'</div>');
		window.scrollTo(0, 0);
		$('#isAutobill').val(false);
		}
		else if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()=='1'){
			if($.trim($("#tariff").val())=='' || $.trim($("#tariffCommodityDescription").val())=='' || $.trim($("#tariffItemNumber").val())=='' || $.trim($("#commodityCode").val())==''){
				//if(!$('#maintainBookingParties').is(':visible'))
					expandPartiesDiv(isValid);
				$('#isAutobill').validationEngine('showPrompt', 'Cannot be Yes as Tariff or Tariff Commodity Description or Item or Commodity Code not present', 'error', 'topRight', true);
				isValid = false;
			}
		}
		else if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()>1){
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#isAutobill').validationEngine('showPrompt', 'Cannot be Yes as multiple commodity lines exist', 'error', 'topRight', true);
			isValid = false;
		}*/
		if($('#autobillOptionCode :selected').val()==''){
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#autobillOptionCode').validationEngine('showPrompt', 'Autobill option is required', 'error', 'topRight', true);
			isValid = false;
		}
		
		if($('#autobillTriggerCode :selected').val()==''){
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#autobillTriggerCode').validationEngine('showPrompt', 'Autobill trigger event is required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	//Changed due to D023185
	/*else if($('#bookingTypeCode').val()=='B' && $.trim($('#quoteVNConcat').val())!='' 
					&& $('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()>1)
	{
		//if(!$('#maintainBookingParties').is(':visible'))
			expandPartiesDiv(isValid);
		$('#isAutobill').validationEngine('showPrompt', 'Autobill cannot be No as Multiple Commodity Lines exist for booking made from quote', 'error', 'topRight', true);
		isValid = false;
	}*/
	
	//-------------- Changed after discussion with nitin not according to UI specs-------
	/*if($('#autobillOptionCode :selected').val()=='C' && $('#autobillTriggerCode :selected').val()!='I')
	{
		//if(!$('#maintainBookingParties').is(':visible'))
			expandPartiesDiv(isValid);
		$('#autobillTriggerCode').validationEngine('showPrompt', 'Trigger event must be Ingated when Autobill option is Container', 'error', 'topRight', true);
		isValid = false;
	}
	else */if($('#autobillOptionCode :selected').val()!='C' && $('#autobillTriggerCode :selected').val()=='I')
	{
		//if(!$('#maintainBookingParties').is(':visible'))
			expandPartiesDiv(isValid);
		$('#autobillOptionCode').validationEngine('showPrompt', 'Autobill option must be container when trigger event is Ingated', 'error', 'topRight', true);
		isValid = false;
	}
	
	var regexp = '^[a-zA-z0-9]+$';
	var re = new RegExp(regexp);
	
	if($('#secondaryNotifyScacCode1').val()!='')
	{
		if(!re.test($('#secondaryNotifyScacCode1').val()))
		{
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#secondaryNotifyScacCode1').validationEngine('showPrompt', 'Only alphanumeric characters allowed', 'error', 'topRight', true);
			isValid = false;
		}
	}
	
	if($('#secondaryNotifyScacCode2').val()!='')
	{
		if(!re.test($('#secondaryNotifyScacCode2').val()))
		{
			//if(!$('#maintainBookingParties').is(':visible'))
				expandPartiesDiv(isValid);
			$('#secondaryNotifyScacCode2').validationEngine('showPrompt', 'Only alphanumeric characters allowed', 'error', 'topRight', true);
			isValid = false;
		}
	}
	
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

function expandPartiesDiv(isValid)
{
	if(isValid)
	{
		if(!$('#maintainBookingParties').is(':visible'))
		{
			$('#partiesAccordionHeader').removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top");
			$('#partiesAccordionHeader span').removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
			$('#maintainBookingParties').addClass('ui-accordion-content-active');
			$('#maintainBookingParties').css('display', 'block');
			var status = $($('.booking-section')[1]).accordion('option', 'active');
			if (typeof status == "boolean" && !status) {
				$($('.booking-section')[1]).accordion('option', 'active', 0);
			}
		}
		var offset = accordianPostionCoordinates(1);
		window.scrollTo(offset.left, offset.top);
	}
}
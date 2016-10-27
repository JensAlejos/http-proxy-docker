$(function() {
	
	//against D022376 to disable changes in the screen
	if($('#shipmentStatusHeader').text()=="ISSUED" || $('#shipmentStatusHeader').text()=="CORRECTED"){
		$("[id^=customta]").attr('disabled','disabled');
		$("[id^=custcb]").attr('disabled','disabled');
		$("[id^=resetcb]").attr('disabled','disabled');
		$('#custNameAddSave').attr('disabled', true);
	}
	
	$('#shipmentHeaderForm').validationEngine('attach');
    $("#ShipmentCustNameAddrForm").validationEngine('attach');
    
    if($('#shipmentNumber').val()!=null && $('#shipmentNumber').val().trim()!='') {
    	$('#shipmentSequenceNumber').removeAttr('disabled');
    	$('#shipmentCorrectionNumber').removeAttr('disabled');
    }
	$('#shipmentNumber').gatesAutocomplete({
		minLength: 7,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 		method: 'searchShpmntNoForHeader',
	 		searchType: '355',
	 	},
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			//if($('#shipmentSequenceNumber').val() == null	|| $('#shipmentSequenceNumber').val() == ""){
			//populate seq number and correction number default on shipment number change start
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
						$('#shipmentCorrectionNumber').removeAttr('disabled');
						$.ajax({
							type : "POST",
							url : _context +"/shipment/header/shipmentCorrectionNumberList",
							data : {
								shipmentNumber : $("#shipmentNumber").val(),
								shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
							},
							success : function(responseText) {
								var list= responseText.data.shipmentCorrectionNumberList;
								$('#shipmentCorrectionNumber option').remove();								
								$.each(list, function(index,codeDescription) {
									$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								});								
								document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
								$('#anyChangesDone').val("Y");
							}
						});
					}			
				});
		}
	});

	
	//code for shipment sequence no predictive search
	 //var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354';
	 $('#shipmentSequenceNumber').gatesAutocomplete({
		 	source:_context+'/cas/autocomplete.do',
		 	extraParams: {
		 		method: 'searchShpmntSeqNo',
		 		searchType: '354',
		 		parentSearch: function(){return  $('#shipmentNumber').val();}
		 	},
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipmentSequenceNumber').val(data.sequenceNo);
				$('#shipmentCorrectionNumber').removeAttr('disabled');
				$.ajax({
					type : "POST",
					url : _context +"/shipment/header/shipmentCorrectionNumberList",
					data : {
						shipmentNumber : $("#shipmentNumber").val(),
						shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
					},
					success : function(responseText) {
						var list= responseText.data.shipmentCorrectionNumberList;
						$('#shipmentCorrectionNumberList').val(list);
						$('#shipmentCorrectionNumber option').remove();								
						$.each(list, function(index,codeDescription) {
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						});								
						document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
						$('#anyChangesDone').val("Y");
					}
				});
			}
		});
	
	
	
	
	
	/*$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentSequenceNumber').attr('disabled', true);
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});*/
	
	//$(document).attr('title',document.title+' - '+$('#shipmentNumber').val()+' - '+$('#shipmentSequenceNumber').val());
	 //added against 18175 to lock screen
	 $.unblockUI(); 
	$(document).attr('title','GATES: Customize Name and Address');
	$("[id^=custcb]").each(function() {
		var idName = $(this).attr("id");
		var custcbNo = idName.substr(idName.length - 1);

		if ($(this).is(':checked')) {
			$("#customta" + custcbNo).css('color', 'green');
			//$("#customta" + custcbNo).removeAttr("disabled");
			
			//against D022376 to prevent changes in the screen
			if($('#shipmentStatusHeader').text()!="ISSUED" && $('#shipmentStatusHeader').text()!="CORRECTED"){
			$("#resetcb" + custcbNo).removeAttr("disabled");
			}
		} else {
			$("#customta" + custcbNo).css('color', 'black');
			//$("#customta" + custcbNo).attr("disabled", "disabled");
			$("#resetcb" + custcbNo).attr("disabled", "disabled");
		}
		//$("#custcb" + custcbNo).attr("disabled", "disabled");
	});
	
	
	$("[id^=default]").each(function() {
		var valToPrint = "";
		var i=0;
		var valArr = $(this).html().split("\n");
		for(i=0;i<valArr.length-1;i++){
			valToPrint+=valArr[i]+"<br>";
		}
		valToPrint+=valArr[i];
		$(this).html(valToPrint);
	});
	
	
	checkForEnableDisableSave();
	
	$('#custNameAddSave').click(function() {
						
						clearResponseMessages('msgDiv');
						var gridDiff = 0;
						
						var validationOK = true;
						var tradeType = $("#tradeType").val();
						$("[id^=customta]")
								.each(
										function() {
											var isValid = true;
											var noOfLines = $(this).attr("value").replace(/\s+$/,"").split("\n"); // D018511 -- .replace(/\s+$/,"") is attached
											var currentElement = $(this);
											var idName = $(this).attr("id");
											var index = idName.substr(idName.length - 1);
											
											if ($.trim($(this).attr("value")) == '') {
												
												isValid = false;
												validationOK = false;
												$(currentElement).validationEngine('showPrompt','Customize Name and Address should not be empty.','error','topRight',true);
											}
											else if(noOfLines.length > 8){
												
												isValid = false;
												validationOK = false;
												$(currentElement).validationEngine('showPrompt','Max. 8 lines can be entered.','error','topRight',true);
											}
											else{
												
												$.each(noOfLines,function(index,value){
													if(tradeType == 'domestic' && value.length > 40) {
														isValid = false;
														validationOK = false;
														$(currentElement).validationEngine('showPrompt','Max. 40 characters are allowed in a line.','error','topRight',true);
														return false;
													} else if(tradeType != 'domestic' && value.length > 50) {
														isValid = false;
														validationOK = false;
														$(currentElement).validationEngine('showPrompt','Max. 50 characters are allowed in a line.','error','topRight',true);
													}
												}
												);
											}
											
											if(isValid == true){
												
												$(currentElement).validationEngine('hide');
												if($('#party' + index).val() == 'Shipper') {
													if($('#custcb' + index).is(':checked')){
														//window.opener.$('input[name="shipper\\.organizationName"]').css('color', 'green');
													}
														
													else {
														//window.opener.$('input[name="shipper\\.organizationName"]').css('color', 'black');
													}
														
													
													gridDiff++;
												}
												
												if($('#party' + index).val() == 'Consignee') {
												
													if($('#custcb' + index).is(':checked')){
														//window.opener.$('input[name="consignee\\.organizationName"]').css('color', 'green');
													}
														
													else{
														//window.opener.$('input[name="consignee\\.organizationName"]').css('color', 'black');
													}
														
													
													gridDiff++;
												}
												//var rowIDs = window.opener.$('#gridIdForParties').getDataIDs();
												if($('#custcb' + index).is(':checked') && ($('#party' + index).val() != 'Shipper' || $('#party' + index).val() != 'Consignee')) {
													/*for (var i=0;i<rowIDs.length;i=i+1)  { 
														var rowData=window.opener.$('#gridIdForParties').getRowData(rowIDs[i]);
														if($('#partyCode' + index).val() == rowData.partyTypeCode){
															//window.opener.$('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'organizationName','','',{style: 'color : green'},'');
															break;
														}
													}*/
													
												} else {
													/*for (var i=0;i<rowIDs.length;i=i+1)  { 
														var rowData=window.opener.$('#gridIdForParties').getRowData(rowIDs[i]);
														if($('#partyCode' + index).val() == rowData.partyTypeCode){
															//window.opener.$('#gridIdForParties').jqGrid('setCell', rowIDs[i], 'organizationName','','',{style: 'color : black'},'');
															break;
														}
													}*/
													
												}
											}
										});

						if (validationOK == false){
							
							return false;
						}
							
						else{
							
							$("[id^=customta]").each(function() {
								$(this).validationEngine('hide');
							});
						}
						
						showInfoMessage('msgDiv','Saving Customized Information ...');

						var custNameAdd = $('#shipmentHeaderForm').formSerialize();

						$.ajax({
									type : "POST",
									url : _context +"/shipment/customizednameandaddress/save",
									data : custNameAdd,
									success : function(responseText) {
										
										$("[id^=custcb]").each(function() {
										
											var idName = $(this).attr("id");
											var custcbNo = idName.substr(idName.length - 1);

											if ($(this).is(':checked')) {
												$("#customta" + custcbNo).css('color', 'green');
												//$("#customta" + custcbNo).removeAttr("disabled");
											} else {
												$("#customta" + custcbNo).css('color', 'black');
												//$("#customta" + custcbNo).attr("disabled", "disabled");
											}
										});
										
										showSuccessMessage('msgDiv','Customized Information saved successfully.');
									}
								});
						
						captureChanges();

					});

	$('#custNameAddCancel').click(function() {
		//window.close();
		var firstPage = $(document).getUrlParam("firstPage");
		document.location.href=_context+"/shipment/showForm?firstPage="+firstPage;

	});

	$("[id^=resetcb]").click(function() {
		var idName = $(this).attr("id");
		var resetcbNo = idName.substr(idName.length - 1);
		$("#customta" + resetcbNo).css('color', 'black');
		$("#customta" + resetcbNo).validationEngine('hide');
		$("#custcb" + resetcbNo).attr('checked', false);

		if ($(this).is(':checked')) {
			var valToPrint = "";
			var i=0;
			var valArr = $("#default" + resetcbNo).html().split("<br>");
			for(i=0;i<valArr.length-1;i++){
				valToPrint+=valArr[i]+"\n";
			}
			valToPrint+=valArr[i];
			$("#customta" + resetcbNo).val(valToPrint);
			//resetFieldChanges("customta" + resetcbNo);
			//$("#customta" + resetcbNo).attr("disabled", "disabled");
		}
		else{
			//$("#customta" + resetcbNo).removeAttr("disabled");
			$(this).attr("disabled", "disabled");
		}
		
		checkForEnableDisableSave();
	});

	$("[id^=custcb]").click(function() {
		/*var idName = $(this).attr("id");
		var custcbNo = idName.substr(idName.length - 1);
		$("#customta" + custcbNo).css('color', 'black');
		$("#customta" + custcbNo).validationEngine('hide');
		$("#resetcb" + custcbNo).attr('checked', false);
		
		if ($(this).is(':checked')) {
			//$("#customta" + custcbNo).removeAttr("disabled");
			$("#resetcb" + custcbNo).removeAttr("disabled");
		} else {
			//$("#customta" + custcbNo).attr("disabled", "disabled");
			$("#resetcb" + custcbNo).attr("disabled", "disabled");		
			}*/
		
		checkForEnableDisableSave();
		
	});
	
	$("[id^=customta]").blur(function() {
		var idName = $(this).attr("id");
		var index = idName.substr(idName.length - 1);
		var customAddress = $('#' + idName).val();
		customAddress = $.trim(customAddress.replace(/\n/g, ""));
		
		if(customAddress == $.trim($('#default' + index).text())) {
			$("#custcb" + index).attr('checked', false);
			$("#resetcb" + index).attr("disabled", "true");
			$("#customta" + index).css('color', 'black');
		} else {
			$("#custcb" + index).attr('checked', true);
			$("#resetcb" + index).removeAttr("disabled");
			$("#customta" + index).css('color', 'green');
		}
		$("#resetcb" + index).attr('checked', false);
		checkForEnableDisableSave();
	});
	$('#shipmentNumber').blur(function(){
		
		if($('#shipmentNumber').val()==null || $('#shipmentNumber').val()=='' || $('#shipmentNumber').val().length < 7  )
			{
				$('#shipmentSequenceNumber').attr("disabled", "disabled");
				$('#shipmentCorrectionNumber').attr("disabled", "disabled");
				$('#shipmentCorrectionNumber option').remove();
				$('#custNameAddSave').attr("disabled", "disabled");
				
			}
	});
   $('#shipmentSequenceNumber').blur(function(){
		
		if($('#shipmentSequenceNumber').val()==null || $('#shipmentSequenceNumber').val()=='')
			{
				 $('#shipmentCorrectionNumber option').remove();
			     $('#shipmentCorrectionNumber').attr("disabled", "disabled");
				 $('#custNameAddSave').attr("disabled", "disabled");
			}
	});
	
	$('#shipmentCorrectionNumber').change(function(){
		if($('#shipmentCorrectionNumber').val()!=null && $('#shipmentCorrectionNumber').val()!=undefined && $('#shipmentCorrectionNumber').val().trim()!="") {
			$('#shipmentCorrectionNumberValue').val($('#shipmentCorrectionNumber').val());
		}
	});
	
	$('#fetchShipmentInfo').click(
			function(){
				
				/*if(isAnyChangeOnPage()) {
					if(!confirm('You have unsaved changes!\nContinue?')) {
						return;
					}
				}*/
				//$('#msgDivBkpo').hide();
				//blockUI();
				var count = 0;
				/*var e = document.getElementById("shipmentCorrectionNumber");
				var strUser = e.options[e.selectedIndex].value;
				alert(strUser);*/
				if($('#shipmentNumber').val()=='')
				{
					$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
					count++;
				}
				/*else if($('#shipmentSequenceNumber').val()=='')
				{
					$('#shipmentSequenceNumber').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
					count++;
				}
				else if($('#shipmentCorrectionNumber').val()=='')
				{
					//$('#shipmentCorrectionNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
					count++;
				}*/
				if(count==0) {
					//added against 18175 to lock screen
					if($('#shipmentSequenceNumber').val().length==3){
					//blockUI();
					}
				//alert("Inside Fun call");
				displayShipment();
				}else{
					$.unblockUI();
				}
				
			
			});
	if($('#shipmentNumber').val()!=''&& (getParamByName("shipmentIdHeader")==null||getParamByName("shipmentIdHeader")=='')){
		getDefaultShipSequeShipCorr();
		$('#fetchShipmentInfo').trigger("click");
	}

	
	/* permisssion Shipment  security*/
	enforceSecurityTitle(isCustomNameAddressDisplayOnly);
	enforceSecurityDivAndButtons("content",isCustomNameAddressDisplayOnly);
	enforceSecurityDivAndButtons("custNameAddSave", isCustomNameAddressUpdate);
	enforceSecurityDivAndButtons("custNameAddCancel", isCustomNameAddressDisplayOnly);
	corrNo=getParamByName("shipmentCorrectionNumber");
	/*if(corrNo!=null && corrNo!='null') {
		$('#shipmentCorrectionNumber option').remove();	
		$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(corrNo, corrNo);
		$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());	
	}*/
	
	
	/*var shipsequno = getParamByName("shipmentSequenceNumber");
	if(shipsequno!=null && shipsequno!='null')
	{
		$('#shipmentSequenceNumber').val(shipsequno);
	}
	corrNo=getParamByName("shipmentCorrectionNumber");
	if(corrNo!=null && corrNo!='null') {
		$('#shipmentCorrectionNumber option').remove();	
		$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(corrNo, corrNo);
		$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());	
	}
	
	/*$.ajax({
		type : "POST",
		url : _context +"/shipment/header/shipmentCorrectionNumberList",
		data : {
			shipmentNumber : $("#shipmentNumber").val(),
			shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
		},
		success : function(responseText) {
			var list= responseText.data.shipmentCorrectionNumberList;
			$('#shipmentCorrectionNumberList').val(list);
			$('#shipmentCorrectionNumber option').remove();								
			$.each(list, function(index,codeDescription) {
				$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
			});								
			$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());
			$('#anyChangesDone').val("Y");
		}
	});*/
	
	$("#shipmentCorrectionNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$("#fetchShipmentInfo").click();
		}
	});
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentSequenceNumber').val('');
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$("#fetchShipmentInfo").click();
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			$("#fetchShipmentInfo").click();
		}
	});
	tabSequence('#shipmentHeaderForm',false,false);
	
	captureChanges();//for unsaved changes
});


function checkForEnableDisableSave(){
	
	var isCustCBSelected = false;
	var isResetCBSelected = false;

	$("[id^=custcb]").each(function() {
		if ($(this).is(':checked')) {
			isCustCBSelected = true;
			return false;
		}
	});

	$("[id^=resetcb]").each(function() {
		if ($(this).is(':checked')) {
			isResetCBSelected = true;
			return false;
		}
	});
	
	if((isCustCBSelected == true)||(isResetCBSelected == true))
	{
		//against D022376 to prevent changes in the screen
		if($('#shipmentStatusHeader').text()!="ISSUED" && $('#shipmentStatusHeader').text()!="CORRECTED"){
		$('#custNameAddSave').removeAttr("disabled");
		}
	}
	else{
		$('#custNameAddSave').attr("disabled", "disabled");
	}
}


function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function clearResponseMessages(msgDivId) {
	$('#' + msgDivId).html("");
}

function displayShipment() {
	$('#shipmentSequenceNumber').removeAttr("disabled");
	$('#shipmentCorrectionNumber').removeAttr("disabled");
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
/*	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		shipment_sequence_number="000";
	}
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		shipment_correction_number="000";
	}
	//alert("Test1::"+_context);
*/	
	
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			$.ajax({
				async: false,
					type : "POST",
					url : _context + "/shipment/defaultShipmentSequenceNumber",
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
				
				/** Populating Shipment Correction Number number Hard coded*/
				
		if(shipment_correction_number == ""	|| shipment_correction_number == null)
			{
			$.ajax({
			type : "POST",
			url : _context +"/shipment/header/shipmentCorrectionNumberList",
			data : {
				shipmentNumber : shipment_number,
				shipmentSequenceNumber : shipment_sequence_number,
				},
				success : function(responseText) {
				var list= responseText.data.shipmentCorrectionNumberList;
						
						//alert(list);
				$('#shipmentCorrectionNumber option').remove();		
				$.each(list, function(index,codeDescription) {
				$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				});								
				document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
				//$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());
				//$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
				}
			});
		}
		if($('#shipmentCorrectionNumberValue').val()!="" && $('#shipmentCorrectionNumberValue').val()!=null)
			$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());
			shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
				
	
			$.ajax({
				type : "GET",
				url : _context + "/shipment/customizednameandaddress/displayCustAddr",
				data : {
					shipmentNumber :shipment_number,
					shipmentSequenceNumber :shipment_sequence_number,
					shipmentCorrectionNumber :shipment_correction_number,
				},
				success : function(responseText) {
					//alert("Test2");
					// Clear fields of Shipment form and reset the defaults
					var shipmentId = "";
					if(responseText!=null && responseText.data!=null &&responseText.data.header!=null){
						shipmentId = responseText.data.shipmentId;
						URLBuilider(responseText);
					}else{
						showNonExistBillMessage();
					}
					
					
					//alert(shipmentId);
					//$.unblockUI();
					if (shipmentId == null || shipmentId == undefined
							|| shipmentId == "") {
						//added against 18175 to lock screen
						$.unblockUI();
						//alert("Test3");
						
						if (responseText.messages.error.length == 0) {
							//alert("Success :No error");
							//clearPrintHeader(responseText); 
							
						}
					}
				},
				error : function(responseText) {
					//alert("Test4");
				}
			});
		}


function URLBuilider(responseText){
	var shipmentHeaderParam= "?shipmentIdHeader="+responseText.data.shipmentId
	+ "&tradeCodeHeader=" + responseText.data.header.tradeCode 
	+ "&shipmentStatusHeader="+ responseText.data.header.statusCode 
	+ "&customerGroupHeader="+ responseText.data.customerGroupName 
	+ "&placeOfRecieptHeader="+ responseText.data.routing.blOriginCityCode 
	+ "&portOfLoadingHeader="+ responseText.data.routing.originPortCityCode 
	+ "&portOfDischargeHeader="	+ responseText.data.routing.destinationPortCityCode 
	+ "&placeOfDelevieryHeader="+ responseText.data.routing.blDestinationCityCode 
	+ "&shipperHeader=" + responseText.data.shipper.organizationName
	+ "&consigneeHeader=" + responseText.data.consignee.organizationName 
	+ "&vvdHeader=" + responseText.data.routing.vessel+" "+responseText.data.routing.voyage+" "+responseText.data.routing.direction
	+ "&ldSVCHeader=" + responseText.data.routing.loadServiceCode+"-"+responseText.data.routing.dischargeServiceCode 
	+ "&debtorHeader=" + responseText.data.header.responsiblePartyCode
	+ "&debtorValueHeader=" + responseText.data.header.responsiblePartyCode
	+ "&tradeCodeValueHeader=" + responseText.data.header.tradeCodeDesc
	+ "&shipmentNumberHeader=" + responseText.data.header.shipmentNumber
	+ "&shipmentNumber=" + responseText.data.header.shipmentNumber 
	+ "&originPortCityCode=" + responseText.data.routing.originPortCityCode 
	+ "&destinationPortCityCode="+ responseText.data.routing.destinationPortCityCode
	+ "&shipmentSequenceNumber=" + responseText.data.header.shipmentSequenceNumber 
	+ "&shipmentCorrectionNumber="+ responseText.data.header.shipmentCorrectionNumber;
	document.location.href=_context + "/shipment/customizednameandaddress/showForm"+shipmentHeaderParam;
}

function getParamByName( name )
{
 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]"+name+"=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec( window.location.href );
 if( results == null )
  return "";
else
 return results[1];
}
function getDefaultShipSequeShipCorr()
{
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = getParamByName("shipmentSequenceNumber");
	var shipment_correction_number = getParamByName("shipmentCorrectionNumber");	
	/** Populating Shipment sequence number from database*/
	if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
		$.ajax({
			async: false,
			type : "POST",
			url : _context + "/shipment/defaultShipmentSequenceNumber",
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
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		$.ajax({
			type : "POST",
			url : _context +"/shipment/header/shipmentCorrectionNumberList",
			data : {
				shipmentNumber : shipment_number,
				shipmentSequenceNumber : shipment_sequence_number,
			},
			success : function(responseText) {
				var list= responseText.data.shipmentCorrectionNumberList;
				$('#shipmentCorrectionNumber option').remove();								
				$.each(list, function(index,codeDescription) {
					$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				});								
				document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
			}
		});
		shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
	}
	else
	{
		if(shipment_sequence_number!=null && shipment_sequence_number!='null') {
			$('#shipmentCorrectionNumber option').remove();	
			$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(shipment_sequence_number, shipment_sequence_number);
			$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());	
		}
	}
}

function showNonExistBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Shipment not found.</div>");
	$('#msgDiv').show();
}


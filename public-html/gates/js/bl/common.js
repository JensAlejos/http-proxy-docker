 var rowSequenceNumberForREChoices=0;
function navigateToTargetPage(currentPage, targetPage, shipmentNumber, shipmentSequenceNumber, 
		shipmentCorrectionNumber,src){
	if(currentPage == targetPage)
		return
	if(targetPage == 'Maintain Bill'){
		document.location.href = _context+ "/shipment/showForm?shipment_number="+shipmentNumber+"&shipment_sequence_number="+shipmentSequenceNumber+
		"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ";
	}else if (targetPage == 'Maintain Rate Bill'){
		if(shipmentSequenceNumber == null || shipmentSequenceNumber == "")
			shipmentSequenceNumber = "000";
		document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
		shipmentNumber+'&shipmentSequenceNumber='+shipmentSequenceNumber+'&shipmentCorrectionNumber=000&navigationUrl='+src;
		
	}else if (targetPage == 'Bill SetUp'){
		document.location.href = _context+ "/billingSetup/loadBillSetUpDetail?shipmentNumber="+ 
		shipmentNumber;
	}else if (targetPage == 'Maintain Booking'){
		document.location.href = _context+ "/booking/showForm?bookingNumber="+shipmentNumber;
	}else if (targetPage == 'Variance list by booking'){
		document.location.href = _context+ "/cas/containerListbyBookingSearch.do?bookingId="+shipmentNumber+"&variance=Y";
	}else if (targetPage == 'Wiredown Maintenance'){
		document.location.href = _context+ "/wiredownMaintenance/showForm?bookingIds="+shipmentNumber;
	}else if ( targetPage == 'Send Booking Document'){
		document.location.href = _context+ "/booking/senddocument/create?nav=booking&bookingId="+shipmentNumber;
	}else if (targetPage == 'Container Billing Maintenance'){
		document.location.href= _context+"/receivedContainer/showForm";
	}else if ( targetPage == 'Print Freight Bill'){
		document.location.href = _context+ "/printFreightBill/go?shipmentNumber="+ 
		shipmentNumber+'&shipmentSequenceNumber='+shipmentSequenceNumber+'&shipmentCorrectionNumber=000';
	}else if( targetPage == 'Billing Print Options Override'){
		document.location.href = _context+ "/shipmentPrntOptnsOverride/getPrintOptionOverride";	
	}
		
	
}


function navigateToTargetPageForFurtherFlow(currentPage, targetPage, shipmentNumber, shipmentSequenceNumber, 
		shipmentCorrectionNumber,src){
	if(currentPage == targetPage)
		return
	if(targetPage == 'Maintain Bill'){
		document.location.href = _context+ "/shipment/showForm?shipment_number="+shipmentNumber+"&shipment_sequence_number="+shipmentSequenceNumber+
		"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ&bookingFlow=true";
	}else if (targetPage == 'Maintain Rate Bill'){
		if(shipmentSequenceNumber == null || shipmentSequenceNumber == "")
			shipmentSequenceNumber = "000";
		document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
		shipmentNumber+'&shipmentSequenceNumber='+shipmentSequenceNumber+'&shipmentCorrectionNumber=000&bookingFlow=true&navigationUrl='+src;
		//D026361
	}else if( targetPage == 'Billing Print Options Override'){
		document.location.href = _context+ "/shipmentPrntOptnsOverride/getPrintOptionOverride";	
	}else if (targetPage == 'Bill SetUp'){
		document.location.href = _context+ "/billingSetup/loadBillSetUpDetail?shipmentNumber="+ 
		shipmentNumber+"&bookingFlow=true";
	}else if (targetPage == 'Maintain Booking'){
		document.location.href = _context+ "/booking/showForm?bookingNumber="+shipmentNumber+"&bookingFlow=true";
	}else if (targetPage == 'Variance list by booking'){
		document.location.href = _context+ "/cas/containerListbyBookingSearch.do?bookingId="+shipmentNumber+"&variance=Y";
	}else if (targetPage == 'Wiredown Maintenance'){
		document.location.href = _context+ "/wiredownMaintenance/showForm?bookingIds="+shipmentNumber;
	}else if ( targetPage == 'Send Booking Document'){
		document.location.href = _context+ "/booking/senddocument/create?nav=booking&bookingId="+shipmentNumber;
	}else if (targetPage == 'Container Billing Maintenance'){
		document.location.href= _context+"/receivedContainer/showForm";
	}else if ( targetPage == 'Print Freight Bill'){
		document.location.href = _context+ "/printFreightBill/go?shipmentNumber="+ 
		shipmentNumber+'&shipmentSequenceNumber='+shipmentSequenceNumber+'&shipmentCorrectionNumber=000';
	}
		
	
}

function makeErorNChoiceGrids(source){
	$('#reErrCloseBtn').click(function(){
		$("#re_error_dialog").dialog('close');
		location.reload(true);
	});

	
	$('#reErrorListRateBtn').click(function(){
		window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&sourceCode="+
				$('#tariffError').val()+"&groupCode="+$('#tariffError').val()
				+"&itemCode="+$('#itemError').val());
	});

	$('#reChoiceCloseBtn').click(function(){		
		$("#re_choice_dialog").dialog('close');
		location.reload(true);
	});
	
	$('#reChoiceListRateBtn').click(function() {
		var groupType = $('#groupTypeRE').val();
		var groupTypeCode = '';
		if(groupType != null){
			if("FRT" == groupType){
				groupTypeCode = "01";
			}
			else if("WFG" == groupType){
				groupTypeCode = "02";
			}
			else if("DRA" == groupType){
				groupTypeCode = "03";
			}
			else if("RDV" == groupType){
				groupTypeCode = "04";
			}
			else if("MSH" == groupType){
				groupTypeCode = "05";
			}
			else if("MEQ" == groupType){
				groupTypeCode = "06";
			}
			else if("ACC" == groupType){
				groupTypeCode = "07";
			}
		}
		window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&groupTypeCode="+ groupTypeCode + "&sourceCode="+
				$('#sourceCodeRE').val()+"&groupCode="+$('#groupCodeRE').val()
				+"&itemCode="+$('#itemCodeRE').val()+"&hideColumn=true");
	});
	
	$('#reChoiceContinueBtn').click(function() {
		//TODO: Handle this scenario here. Call to RE should pursue from here.		
		$('#re_choice_dialog').dialog( "close" );
		concludeRating(0, source);		
	});

	
	$( "#re_choice_dialog" ).dialog({
		autoOpen: false, 
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
		}
	});

 

 $( "#re_error_dialog" ).dialog({
		autoOpen: false, 
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		}
//		close : function() {
//			$("#re_error_dialog").validationEngine('hideAll');
//			$("#re_error_dialog").dialog('close');
//		//	$('#specialServicesGrid').jqGrid('GridUnload');
////			 $("#mixcommodityGrid").trigger('reloadGrid');  
//		}
	});


 var choiceGridColNames= ['Choice Id', 'Seq No', 'Selectable', 'Choices Text','Choice Assist Text'];
	var choiceGridColModel= [ 
	                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true},
	          				{name:'choiceSeqNum',index:'choiceSeqNum', width:50, editable:false, formatter:'choiceFormatter'},
	                        {name:'selectable',index:'selectable', width:50, editable:false,hidden:true},
	        				{name:'messageTextValue',index:'messageTextValue', width:770, editable:false},
	        				{name:'choiceAssistText',index:'choiceAssistText', hidden:true, width:700, editable:false}
	                       ];
	
	jQuery.extend($.fn.fmatter , {
		choiceFormatter : function(cellvalue, options, rowdata) {
			if(rowdata.selectable == true){
				var value= rowdata.reRatingChoiceId + ",'" + source + "'";
				return '<a href=javascript:concludeRating('+value+');>'+cellvalue+"</a>";
			}
			else
				return cellvalue;
		}
	});	var jsonReaderChoice = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "reRatingChoiceId"
	};

	createGrid("reChoiceGrid", "pagerReChoiceGrid",
			'/gates/'+source+'/loadReChoiceGrid',
			'', '', '', '',
			choiceGridColNames, choiceGridColModel,
			"List Of Choice Messages", 250, 10, [ 10, 20, 30 ], false, false, false, true,
			jsonReaderChoice,true,true,true,false,false,false,false,onGridComplete,onChoiceGridLoad,false,true);

	var errorGridColNames= ['Error Id', 'Cmdy Line', 'Sev', 'Error Text','Group Type','Source Tariff','Group Name','Item','Rate'];
	var errorGridColModel= [ 
	                        {name:'reErrorMessageId',index:'reErrorMessageId', hidden:true},
	          				{name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:false },
	        				{name:'messageSeverity',index:'messageSeverity', width:50, sorttype:'date', editable:false },
	        				{name:'messageTextValue',index:'messageTextValue', width:260, editable:false },
	        				{name:'typeValue',index:'rate', width:80, editable:false },
	        				{name:'sourceTariffId',index:'sourceTariffId', width:127, editable:false },
	        				{name:'groupName',index:'groupName', width:127, editable:false },
	        				{name:'item',index:'item', width:80, editable:false },
	        				{name:'rate',index:'rate', width:80, editable:false }
	                         ];

	var jsonReaderError = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "reErrorMessageId"
	};

	createGrid("reErrorGrid", null,
			'/gates/'+source+'/loadReErrorGrid',
			'', '', '', '',
			errorGridColNames, errorGridColModel,
			"List Of Error/Warning Messages", 70, 5, [ 5, 10, 15 ], false, false, false, true,
			jsonReaderError,true,true,true,false,false,false,false,false,false,false,true);
}

//Defect-24737:Modified below method to enable the "List Rate" functionality 
function makeGridForReError(source){
	$('#reErrCloseBtn').click(function(){
		$("#re_error_dialog").dialog('close');
		location.reload(true);
	});
	//Defect-24737:Modified below method to enable the "List Rate" functionality 
	$('#reErrorListRateBtn').click(function(){
		
		window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&sourceCode="+
				$('#tariffError').val()+"&groupCode="+$('#tariffError').val()
				+"&itemCode="+$('#itemError').val());
				
	});

	$('#reChoiceCloseBtn').click(function(){
		$("#re_choice_dialog").dialog('close');
		//Fix for D028587: 	Data related to this page has been updated since you have loaded the page. Please reload and try again.
		location.reload(true);
	});
	//Defect-24737:Modified below method to enable the "List Rate" functionality 
	$('#reChoiceListRateBtn').click(function() {
		
		var size=$('#size').val();
		var sizeEquipment= new Array();
		sizeEquipment=size.split("");
		var EquipFuncCode="";
		var EquipLength="";
		var EquipHeight="";
		if(sizeEquipment[0]!=undefined){
		EquipFuncCode=sizeEquipment[0];
		}
		if(sizeEquipment[1]!=undefined && sizeEquipment[2]!=undefined){
		EquipLength=sizeEquipment[1].concat(sizeEquipment[2]);
		}
		if(sizeEquipment[3]!=undefined){
		EquipHeight=sizeEquipment[3];
		}
		var freightReceivedDate=$('#statusCodeOverlayChoice').val();
		//change format of date
		if(freightReceivedDate!=null && freightReceivedDate!=""){
		freightReceivedDateArray= new Array();
		freightReceivedDateArray=freightReceivedDate.split("-");
		freightReceivedDate=freightReceivedDateArray[2].concat("-").concat(freightReceivedDateArray[1]).concat("-").concat(freightReceivedDateArray[0]);
		}
		
		var originCity=$('#blOriginCityCodeDescription').val();
		var originCityDesc="";
		if(originCity!=null && originCity!=""){
			var originCityArray=new Array();
			originCityArray=originCity.split("-");
			originCityDesc=originCityArray[0].concat(" ").concat(originCityArray[1]);
		}
		var groupType = $('#groupTypeRE').val();
		var groupTypeCode = '';
		if(groupType != null){
			if("FRT" == groupType){
				groupTypeCode = "01";
			}
			else if("WFG" == groupType){
				groupTypeCode = "02";
			}
			else if("DRA" == groupType){
				groupTypeCode = "03";
			}
			else if("RDV" == groupType){
				groupTypeCode = "04";
			}
			else if("MSH" == groupType){
				groupTypeCode = "05";
			}
			else if("MEQ" == groupType){
				groupTypeCode = "06";
			}
			else if("ACC" == groupType){
				groupTypeCode = "07";
			}
		}
		//modified for22214
		/*window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&sourceCode="+
				$('#tariff').val()+"&groupCode="+$('#tariff').val()
				+"&itemCode="+$('#item').val()+"&hideColumn=true"
				+"&sizeEquipFuncCode="+EquipFuncCode+"&sizeEquipLength="+EquipLength+"&sizeEquipHeight="+EquipHeight
				+"&freightReceivedDate="+freightReceivedDate+"&originCityDesc="+originCityDesc);*/
		
		window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&groupTypeCode="+ groupTypeCode + "&sourceCode="+
				$('#sourceCodeRE').val()+"&groupCode="+$('#groupCodeRE').val()
				+"&itemCode="+$('#itemCodeRE').val()+"&hideColumn=true"
								+"&sizeEquipFuncCode="+EquipFuncCode+"&sizeEquipLength="+EquipLength+"&sizeEquipHeight="+EquipHeight
								+"&freightReceivedDate="+freightReceivedDate+"&originCityDesc="+originCityDesc);
				
	});


	$('#reChoiceContinueBtn').click(function() {
		//TODO: Handle this scenario here. Call to RE should pursue from here.		
		$('#re_choice_dialog').dialog( "close" );
		concludeRating(0, source);		
	});
	
	
	 $( "#re_choice_dialog" ).dialog({
			autoOpen: false, 
			width: 1000,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
			}
		});
	
	 

	 $( "#re_error_dialog" ).dialog({
			autoOpen: false, 
			width: 1000,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			}
//			close : function() {
//				$("#re_error_dialog").validationEngine('hideAll');
//				$("#re_error_dialog").dialog('close');
//			//	$('#specialServicesGrid').jqGrid('GridUnload');
////				 $("#mixcommodityGrid").trigger('reloadGrid');  
//			}
		});

	
	 var choiceGridColNames= ['Choice Id', 'Seq No', 'Selectable', 'Choices Text','Choice Assist Text'];
		var choiceGridColModel= [ 
		                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true},
		          				{name:'choiceSeqNum',index:'choiceSeqNum', width:50, editable:false, formatter:'choiceFormatter'},
		                        {name:'selectable',index:'selectable', width:50, editable:false,hidden:true},
		        				{name:'messageTextValue',index:'messageTextValue', width:800, editable:false, formatter:lineFormatter},
		        				{name:'choiceAssistText',index:'choiceAssistText', editable:false,hidden:true,sortable:false}
		                       ];
		
		jQuery.extend($.fn.fmatter , {
			choiceFormatter : function(cellvalue, options, rowdata) {
				if(rowdata.selectable == true){
					
					var value= rowdata.reRatingChoiceId + ",'" + source + "'";
					if(source == "booking"){
						rowSequenceNumberForREChoices++;
						return "<a href='javascript:concludeRatingForBooking("+rowdata.reRatingChoiceId+");' >"+rowSequenceNumberForREChoices+"</a>";
					}else if(source == "houseHoldShipment"){
						rowSequenceNumberForREChoices++;
						return "<a href='javascript:concludeRatingForHHGS("+rowdata.reRatingChoiceId+");' >"+rowSequenceNumberForREChoices+"</a>";
						
					}else{
						rowSequenceNumberForREChoices++;
						return '<a href=javascript:concludeRating('+value+');>'+rowSequenceNumberForREChoices+"</a>";	
					}
				}
				else{
					rowSequenceNumberForREChoices++;
					return rowSequenceNumberForREChoices;
					//return cellvalue;
				}
			}
		});
		
		var jsonReaderChoice = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reRatingChoiceId"
		};

		createGrid("reChoiceGrid", "pagerReChoiceGrid",
				'/gates/'+source+'/loadReChoiceGrid',
				'', '', '', '',
				choiceGridColNames, choiceGridColModel,
				"List Of Choice Messages", 250, 10, [ 10, 20, 30 ], false, false, false, true,
				jsonReaderChoice,true,true,true,false,false,false,false,onGridComplete,onChoiceGridLoad,false,true);

		var errorGridColNames= ['Error Id', 'Cmdy Line', 'Sev', 'Error Text','Group Type','Source Tariff','Group Name','Item','Rate'];
		var errorGridColModel= [ 
		                        {name:'reErrorMessageId',index:'reErrorMessageId', hidden:true},
		          				{name:'commoditySeqNbr',index:'commoditySeqNbr', width:60, editable:false },
		        				{name:'messageSeverity',index:'messageSeverity', width:50, sorttype:'date', editable:false },
		        				{name:'messageTextValue',index:'messageTextValue', width:340, editable:false, formatter:lineFormatterREerror },
		        				{name:'typeValue',index:'rate', width:80, editable:false },
		        				{name:'sourceTariffId',index:'sourceTariffId', width:90, editable:false },
		        				{name:'groupName',index:'groupName', width:90, editable:false },
		        				{name:'item',index:'item', width:70, editable:false },
		        				{name:'rate',index:'rate', width:80, editable:false }
		                         ];

		var jsonReaderError = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reErrorMessageId"
		};

		createGrid("reErrorGrid", null,
				'/gates/'+source+'/loadReErrorGrid',
				'', '', '', '',
				errorGridColNames, errorGridColModel,
				"List Of Error/Warning Messages", 70, 5, [ 5, 10, 15 ], false, false, false, true,
				jsonReaderError,true,true,true,false,false,false,false,false,false,false,true);
}


function concludeRating(id, source)
{		
	$('#re_choice_dialog').dialog( "close" );
	//D027411
	captureChanges();
	blockUI();
	var url ="";
	
	if($('#optionToRate').val() != undefined && $('#optionToRate').val() != ""){
		url="/concludeRating?id="+id+"&optionToRate="+$('#optionToRate').val() ;
	}else{
		url="/concludeRating?id="+id;
	}
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = url+"&reUseSelection="+$('#reUseSelection').val();
	}
	
	$.ajax({
		   type: "POST",				   							   
//		   url: _context +  "/"+source+"/concludeRating?id="+id,
		   url: _context +  "/"+source+url,
		   success: function(responseText){		
			   $.unblockUI();
			   if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					loadErrorOverLay(responseText);
					$("#reErrorGrid").trigger('reloadGrid');
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
					//D026049: NOT IT LIVE DRILL: Bill charges: not refreshed on return from rate engine error screen. Therefore not showing correct unreleased error hold. 
					if(source == "shipment"){
						reloadShipmentGrids();
					} else if(source == "billLadingPayable"){
						$("#billLadingPayableForm").loadJSON(responseText.data);
					}
					//refersh Screen
//					if(source == "billManager"){
//						postMethod('search',document.bookBillWorkQueueSearchForm.method);		
//					}

				}else if(responseText.data.rateView == "showChoices"){
					loadChoiceOverLay(responseText);
					$('#re_choice_dialog').dialog( "open" );
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
					//D027490 - Pagination issue - removed rowNum:10 grid param which is causing pagination issue 
				    jQuery("#reChoiceGrid").setGridParam({datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#shipmentForm').loadJSON(responseText.data);
					displayResponseMessages("msgDiv", responseText);
				}else if(responseText.data.rateView == "hold" || 
						responseText.data.rateView == "Hold"){
						var shipmentNo =  "";	
						var shipmentSeqNo =  "";
						if(responseText.data.header == undefined){
							shipmentNo = responseText.data.shipmentNumber;
							shipmentSeqNo = responseText.data.shipmentSequenceNumber;
						}
						else{
							shipmentNo = responseText.data.header.shipmentNumber;
							shipmentSeqNo = responseText.data.header.shipmentSequenceNumber;
						}
						if(responseText.data.flow == true){
							navigateToTargetPageForFurtherFlow('',responseText.data.targetPage, 
									shipmentNo, shipmentSeqNo,
										'000',
										"2");
							
						}
						navigateToTargetPage('',responseText.data.targetPage, 
							shipmentNo, shipmentSeqNo,
								'000',
								"2");

					
				}
				else if(responseText.data.rateView == "Success"){
					displayResponseMessages("msgDiv", responseText);
					if(responseText.data.shipmentSequenceNumber ==  undefined){
						var shipmentNo =  "";	
						var shipmentSeqNo =  "";
						if(responseText.data.header == undefined){
							shipmentNo = responseText.data.shipmentNumber;
							shipmentSeqNo = "000";
						}
						else{
							shipmentNo = responseText.data.header.shipmentNumber;
							shipmentSeqNo = responseText.data.header.shipmentSequenceNumber;
						}
						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
						shipmentNo+'&shipmentSequenceNumber='+shipmentSeqNo
						+'&shipmentCorrectionNumber=000&navigationUrl='+source+'&commodityDisplay=last';
					}
					else if(responseText.data.shipmentSequenceNumber == null ||
							responseText.data.shipmentSequenceNumber == ""){
						responseText.data.shipmentSequenceNumber ="000"
							document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
							responseText.data.shipmentNumber+'&shipmentSequenceNumber='+responseText.data.shipmentSequenceNumber
							+'&shipmentCorrectionNumber=000&navigationUrl='+source+'&commodityDisplay=last';
					}else{
						document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
						responseText.data.shipmentNumber+'&shipmentSequenceNumber='+responseText.data.shipmentSequenceNumber
						+'&shipmentCorrectionNumber=000&navigationUrl='+source+'&commodityDisplay=last';
					}
				}
				else {
					$('#shipmentForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					displayResponseMessages("msgDiv", responseText);
				}	
			   
		   }
	});	
}

function displayResponseMessages(msgDivId, responseText)  { 
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

		if(messageContent!=''){
			$('#'+msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
  	}
}

function createGridsToDisplay(){
	var value =
	'<div id="re_error_dialog" title="RE Error Screen" class="span-24" style="display:none" ><div class="prepend-top span-21"></div><div class="span-23"><div class="span-22"><h3 class="content-title">RE Error and/or Warning Messages Display</h3></div></div><div class="span-24">	<fieldset class="span-23">		<div class="span-23"><div class="span-23">	<div class="span-7"><label for="shipment" class="span-3 label">Shipment No.</label>	<input type="text" id="shipmentNumOverLay" size="7" maxlength="7" disabled="true"/>	</div><div class="span-7"><label for="status" class="span-2 label">Status</label><input  id="statusCodeOverlay" type="text"  size="5" maxlength="5" disabled="true"/></div>	<div class="span-6 last"><label for="measureUnit" class="span-3 label">Measurement Unit</label>	<input  type="text" id="unitOfMeasureSourceOverLay" size="10" maxlength="10" disabled="true"/></div></div><div class="span-23"><div class="span-6"><label for="loadServices" class="span-3 label">Load Service</label><input  type="text" id="loadServicesOverLay" size="10" maxlength="10" disabled="true"/></div><div class="span-6"><label for="dischargeServices" class="span-3 label">Discharge Service</label><input  type="text" id="dischargeServicesOverlay" size="10" maxlength="10" disabled="true"/></div><div class="span-7"><label for="routing" class="span-3 label">Routing</label>'+
	'<input  type="text" id="routingDetOverLay" size="20" maxlength="20" disabled="true"/></div></div></div></fieldset></div><div class="span-24"><div id="jqgrid1" class="span-21"><table id="reErrorGrid"></table></div></div><div class="span-24"><div class="prepend-top span-24"></div><div id="buttondiv" class="buttonfooter" ><div Style=" width: 950px; margin: 0 auto; padding-top:8px;"><input  type="button" value="Close" class="buttonNoFloat" id="reErrCloseBtn"/><input  type="button" value="Continue" class="buttonNoFloat" id="reErrContinueBtn"/><form:input path="" type="button" value="Restore" class="buttonNoFloat" id="reErrRestoreBtn"/></div>'+
	'</div><div class="span-6 prepend-17"><label for="r" class="span-3 label">R</label><form:input path="reHeaderId" type="text" id="ratingId" size="12" maxlength="12" disabled="true"/></div><div class="span-24"><label for="shipmentId" class="span-20 label">Shipment Id</label><input  type="text" id="shipment" size="12" maxlength="12" disabled="true"/></div></div></div><div id="re_choice_dialog" title="RE Choices Screen" class="span-24" style="display:none">'+
	'<div class="prepend-top span-21"></div><div class="span-23"><div class="span-22"><h3 class="content-title">RE Choice Messages Display</h3>	</div></div><div class="span-24"><fieldset class="span-23"><div class="span-23"><div class="span-23"><div class="span-7"><label for="shipment" class="span-3 label">Shipment No.</label><input  type="text" id="shipmentNumOverLayChoice" size="7" maxlength="7" disabled="true"/></div><div class="span-7"><label for="status" class="span-2 label">Status</label><input  id="statusCodeOverlayChoice" type="text"  size="5" maxlength="5" disabled="true"/></div><div class="span-6"><label for="shipDate" class="span-3 label">Shipment Date</label><form:input path="reEstimatedShipDate" type="text" id="reErrEstShipDate" size="10" maxlength="10"  disabled="true"/><form:hidden path="itemCodeRE" id="itemCodeRE" /></div><div class="span-6 last">'+
	'<label for="measureUnit" class="span-3 label">Measurement Unit</label><input  type="text" id="unitOfMeasureSourceOverLayChoice" size="10" maxlength="10" disabled="true"/>	</div></div><div class="span-23"><div class="span-6"><label for="loadServices" class="span-3 label">Load Service</label><input  type="text" id="loadServicesOverLayChoice" size="10" maxlength="10" disabled="true"/></div><div class="span-6"><label for="dischargeServices" class="span-3 label">Discharge Service</label><input  type="text" id="dischargeServicesOverlayChoice" size="10" maxlength="10" disabled="true"/></div><div class="span-7"><label for="routing" class="span-3 label">Routing</label><input  type="text" id="routingDetOverLayChoice" size="20" maxlength="20" disabled="true"/></div>'+
	'</div></div></fieldset></div><div class="span-23"><div id="choiceGrid" class="span-21"><table id="reChoiceGrid"></table><div id="pagerReChoiceGrid"></div></div></div><div class="span-24"><div class="prepend-top span-24"></div>	<div id="buttondiv" class="buttonfooter" ><div Style=" width: 950px; margin: 0 auto; padding-top:8px;"><input  type="button" value="Close" class="buttonNoFloat" id="reChoiceCloseBtn"/><input  type="button" value="Continue" class="buttonNoFloat" id="reChoiceContinueBtn"/></div></div>	</div></div>'
	
	return value;
}

function loadChoiceOverLay(responseText){
	document.getElementById('choiceTypeSize').innerHTML = 'Type/Size';
	$('#shipmentNumOverLayChoice').val(responseText.data.ratingChoice.shipmentNumber);
	$('#shipmentSeqNumOverLayChoice').val(responseText.data.ratingChoice.shipmentSequenceNumber);
	
	////to change date format 022341
	if(responseText.data.ratingChoice.frtReceivedDate!=null){
		var initialDate=responseText.data.ratingChoice.frtReceivedDate.split(" ")[0];
		initialDate = initialDate.split("-");
	$('#statusCodeOverlayChoice').val( [ initialDate[1], initialDate[2], initialDate[0] ].join('-'));
	}
	//$('#statusCodeOverlayChoice').val(responseText.data.ratingChoice.frtReceivedDate);
	
	$('#reRateDate').val(responseText.data.ratingChoice.rateDate);
	$('#unitOfMeasureSourceOverLayChoice').val(responseText.data.ratingChoice.unitOfMeasureSourceCode);
	$('#loadServicesOverLayChoice').val(responseText.data.ratingChoice.loadServiceCodeRE);
	//D026902: 	CHOICE MESSAGE DISPLAY: DATES & ROUTING FIELDS TOO SHORT
	if(responseText.data.ratingChoice.routingDetailsRE!=null){
		$('#routingDetOverLayChoice').val(responseText.data.ratingChoice.routingDetailsRE.replace(/ /g, ""));
	}
	$('#dischargeServicesOverlayChoice').val(responseText.data.ratingChoice.dischargeServiceCodeRE);
	
	$('#cmdy').val(responseText.data.ratingChoice.commodityLineSeqNum);
	$('#cmdyDisplay').val(responseText.data.ratingChoice.commodityLineSeqNum);
	$('#commodityDescChoice').val(responseText.data.ratingChoice.commodityDesc);
	
	$('#commodityCode').val(responseText.data.ratingChoice.commodityCode);
	//if comm code id is duplicate
	$('.REChoiceCommCode').val(responseText.data.ratingChoice.commodityCode);
	
	$('#tariff').val(responseText.data.ratingChoice.tariffId);
	//if tariff id is duplicate
	$('.REChoiceTariff').val(responseText.data.ratingChoice.tariffId);
	
	$('#item').val(responseText.data.ratingChoice.itemNumber);
	$('#noteId').val(responseText.data.ratingChoice.note);
	$('#pieceChoice').val(responseText.data.ratingChoice.pieceCount);
	$('#kindChoice').val(responseText.data.ratingChoice.pieceKind);
	$('#itemCodeRE').val(responseText.data.ratingChoice.itemCodeRE);
	//$('#netWt').val(responseText.data.ratingChoice.weight);
	//$('#feet').val(responseText.data.ratingChoice.cubicFeet);
	
	var netWt=responseText.data.ratingChoice.weight;
	var feet=responseText.data.ratingChoice.cubicFeet;
	//for 022341
	//For D026643
	//if(responseText.data.ratingChoice.unitOfMeasureSourceCode=="I"){
		$('#netWt').val(Math.floor(netWt));
		$('#feet').val(Math.round(feet));
	/*}
	
	else{		
		$('#netWt').val((Math.round((parseFloat(netWt,3)*1000))/1000).toFixed(3));
		$('#feet').val((Math.round((parseFloat(feet,3)*1000))/1000).toFixed(3));
		
	}*/
	
	//$('#equipPc').val(responseText.data.ratingChoice.equipPiece);
	$('#size').val(responseText.data.ratingChoice.typeSize);
	$('#ef').val(responseText.data.ratingChoice.emptyFull);
	$('#frt').val(responseText.data.ratingChoice.frtCharges);

	$('#RtCdDelvChoice').val(responseText.data.ratingChoice.recDel);
	$('#RtCdPickUpChoice').val(responseText.data.ratingChoice.recPickup);
	$('#carrPkUpDelvChoice').val(responseText.data.ratingChoice.carrDelv);
	$('#carrPkUpChoice').val(responseText.data.ratingChoice.carrPickUp);
	$('#EqCubeChoice').val(responseText.data.ratingChoice.eqpCube);
	$('#EqWtChoice').val(responseText.data.ratingChoice.eqpWt);

	
	
	$('#chargeCodeRE').val(responseText.data.ratingChoice.chargeCodeRE);
	if(responseText.data.ratingChoice.levelRE=="C"){
		$('#processLevelRE').val("Commodity");
	}else if(responseText.data.ratingChoice.levelRE=="E"){
		$('#processLevelRE').val("Equipment");
	}else if(responseText.data.ratingChoice.levelRE=="S"){
		$('#processLevelRE').val("Shipment");
	}
	//$('#processLevelRE').val(responseText.data.ratingChoice.levelRE);
	$('#groupTypeRE').val(responseText.data.ratingChoice.groupTypeRE);
	$('#sourceCodeRE').val(responseText.data.ratingChoice.sourceCodeRE);
	$('#groupCodeRE').val(responseText.data.ratingChoice.groupCodeRE);
	
	//$('#ratingId').val(responseText.data.ratingChoice.reHeaderId);
	//D024328: 	Billing: GATES Rate Engine Choices Screen does not match FACTS
	$('#rateSetId').val(responseText.data.ratingChoice.reHeaderId);
	
	if(responseText.data.ratingChoice.isAllChoicesUnSelectable != null 
			&& responseText.data.ratingChoice.isAllChoicesUnSelectable == "Y"){
		$('#reChoiceContinueBtn').show();
	}else{
		$('#reChoiceContinueBtn').hide();	
	}											

	if(responseText.data.header!=undefined && responseText.data.shipmentItemForm != undefined 
			&& ((responseText.data.shipmentItemForm.imperialLengthFeet != null && responseText.data.shipmentItemForm.imperialLengthFeet > 0) || (responseText.data.shipmentItemForm.imperialLengthInches != null && responseText.data.shipmentItemForm.imperialLengthInches > 0) || (responseText.data.shipmentItemForm.metricLength != null && responseText.data.shipmentItemForm.metricLength > 0))
			&& ((responseText.data.shipmentItemForm.imperialBreathFeet != null && responseText.data.shipmentItemForm.imperialBreathFeet > 0) || (responseText.data.shipmentItemForm.imperialBreathInches != null && responseText.data.shipmentItemForm.imperialBreathInches > 0) || (responseText.data.shipmentItemForm.metricBreadth != null && responseText.data.shipmentItemForm.metricBreadth > 0))
			&& ((responseText.data.shipmentItemForm.imperialHeightFeet != null && responseText.data.shipmentItemForm.imperialHeightFeet > 0) || (responseText.data.shipmentItemForm.imperialHeightInches != null && responseText.data.shipmentItemForm.imperialHeightInches > 0) || (responseText.data.shipmentItemForm.metricHeight != null && responseText.data.shipmentItemForm.metricHeight > 0))){
		if(responseText.data.ratingChoice.unitOfMeasureSourceCode=="I"){
			$('#size').val("L: "+ responseText.data.shipmentItemForm.imperialLengthFeet+"' "+responseText.data.shipmentItemForm.imperialLengthInches+'"  W: '+ responseText.data.shipmentItemForm.imperialBreathFeet+"' "+responseText.data.shipmentItemForm.imperialBreathInches
					+'"  H: '+ responseText.data.shipmentItemForm.imperialHeightFeet+"' "+responseText.data.shipmentItemForm.imperialHeightInches+'"');
		}else{
			convertImperialIntoMetricAndDisplayREChoice(responseText.data.shipmentItemForm.metricLength, responseText.data.shipmentItemForm.metricBreadth, responseText.data.shipmentItemForm.metricHeight);
			}
		$('#size').addClass('typeSizeHasDimension');
		document.getElementById('choiceTypeSize').innerHTML = 'Dimension';
	}
	//for 24256
	if(responseText.data.ratingChoice.equipSubsScenario!=undefined &&
			responseText.data.ratingChoice.equipSubsScenario!=null && 
			responseText.data.ratingChoice.equipSubsScenario==true){
		document.getElementById('equipmentSubstitutionScenarioREChoice').innerHTML = 'EQP SUBS';
		$('#equipmentSubstitutionScenarioREChoice').attr('style','background:yellow');
		$('#cmdyDisplay').attr('style','background:yellow');
		$('#size').attr('style','background:yellow');
		$('#isEmptyFullREChoice').attr('style','background:yellow');
	}
	else{
		document.getElementById('equipmentSubstitutionScenarioREChoice').innerHTML = ' ';
		$('#cmdyDisplay').removeAttr('style','background');
		$('#size').removeAttr('style','background');
		$('#isEmptyFullREChoice').removeAttr('style','background');

	}
	//24328 start//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//for empty full special service
	if(responseText.data.ratingChoice.emptyFull!=null){
		if(responseText.data.ratingChoice.emptyFull=="FULL"){
			document.getElementById('isEmptyFullREChoice').innerHTML = 'FULL  ';
		}else if(responseText.data.ratingChoice.emptyFull=="EMPTY") {
			document.getElementById('isEmptyFullREChoice').innerHTML = 'EMPTY  ';
		}
	}
	if(responseText.data.sizeOfItem!=undefined)
	$('#totalCmdyLines').val(responseText.data.sizeOfItem);
	else
	$('#totalCmdyLines').val(responseText.data.ratingChoice.commodityLineCount);
	
	//$('#totalFreightCount').val(responseText.data.shipmentFreightCount);
	
	if(responseText.data.freightForm!=undefined){
		$('#equipPc').val(responseText.data.freightForm.shipmentFreightSeqNumber);
		$('#totalFreightCount').val(responseText.data.freightForm.totalEquipment);
		$('#equipmentIdChoice').val(responseText.data.freightForm.equipmentId);
	
	
		
		if(responseText.data.freightForm.temperature!=null){
			document.getElementById('temperatureREChoice').innerHTML = responseText.data.freightForm.temperature+"  ";
			if(responseText.data.freightForm.temperatureCode!=null){
				document.getElementById('temperatureREChoice').innerHTML = responseText.data.freightForm.temperature+" "+ responseText.data.freightForm.temperatureCode+"  ";
			}
		}
		if(responseText.data.freightForm.overflow!=null){
			if(responseText.data.freightForm.overflow=="Y")
				document.getElementById('isOverFlowREChoice').innerHTML = 'Oflow:Y';
			//D025163
			//else if(responseText.data.freightForm.overflow=="N")
			//	document.getElementById('isOverFlowREChoice').innerHTML = 'Oflow:N';
		}
	}else if(responseText.data.shipmentFreightForm!=undefined){
		$('#equipmentIdChoice').val(responseText.data.shipmentFreightForm.equipmentId);
		$('#totalFreightCount').val(responseText.data.shipmentFreightForm.totalEquipment);
		$('#equipPc').val(responseText.data.shipmentFreightForm.shipmentFreightSeqNumber);
		
		if(responseText.data.shipmentFreightForm.isEmpty!=null){
			if(responseText.data.shipmentFreightForm.isEmpty=="F"){
				document.getElementById('isEmptyFullREChoice').innerHTML = 'FULL  ';
			}else{
				document.getElementById('isEmptyFullREChoice').innerHTML = 'EMPTY  ';
			}
		}
		if(responseText.data.shipmentFreightForm.temperature!=null){
			document.getElementById('temperatureREChoice').innerHTML = responseText.data.shipmentFreightForm.temperature+"  ";
			if(responseText.data.shipmentFreightForm.temperatureCode!=null){
				document.getElementById('temperatureREChoice').innerHTML = responseText.data.shipmentFreightForm.temperature+" "+ responseText.data.shipmentFreightForm.temperatureCode+"  ";
			}
		}
		if(responseText.data.shipmentFreightForm.overflow!=null){
			if(responseText.data.shipmentFreightForm.overflow=="Y")
				document.getElementById('isOverFlowREChoice').innerHTML = 'Oflow:Y';
			//D025163
			//else if(responseText.data.shipmentFreightForm.overflow=="N")
				//document.getElementById('isOverFlowREChoice').innerHTML = 'Oflow:N';
		}
	}
	
	//24328 end//////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//22179- to display commodity decription on mouse hover
	hoverChoicesDesc();
}


function loadErrorOverLay(responseText){
	document.getElementById('errorTypeSize').innerHTML = 'Type/Size';
	$('#shipmentNumOverLay').val(responseText.data.ratingError.shipmentNumber);
	$('#shipmentSeqNumOverLayError').val(responseText.data.ratingError.shipmentSequenceNumber);
	
	//to change date format 022341
	if(responseText.data.ratingError.frtReceivedDate!=null){
		var initialDate=responseText.data.ratingError.frtReceivedDate.split(" ")[0];
		initialDate = initialDate.split("-");
	$('#statusCodeOverlay').val( [ initialDate[1], initialDate[2], initialDate[0] ].join('-'));
	}
	
	$('#reErrRateDate').val(responseText.data.ratingError.rateDate);
	//$('#statusCodeOverlay').val(responseText.data.ratingError.frtReceivedDate);
	$('#commodityCodeError').val(responseText.data.ratingError.commodityCode);
	$('#unitOfMeasureSourceOverLay').val(responseText.data.ratingError.unitOfMeasureSourceCode);
	$('#loadServicesOverLay').val(responseText.data.ratingError.loadServiceCodeRE);
	//D026902: 	CHOICE MESSAGE DISPLAY: DATES & ROUTING FIELDS TOO SHORT
	if(responseText.data.ratingError.routingDetailsRE!=null){
		$('#routingDetOverLay').val(responseText.data.ratingError.routingDetailsRE.replace(/ /g, ""));
	}
	$('#dischargeServicesOverlay').val(responseText.data.ratingError.dischargeServiceCodeRE);
	
	$('#cmdyError').val(responseText.data.ratingError.commodityLineSeqNum);
	$('#commodityDescError').val(responseText.data.ratingError.commodityDesc);
	$('#tariffError').val(responseText.data.ratingError.tariffId);
	$('#itemError').val(responseText.data.ratingError.itemNumber);
	$('#noteError').val(responseText.data.ratingError.note);
	$('#pieceError').val(responseText.data.ratingError.pieceCount);
	$('#kindError').val(responseText.data.ratingError.pieceKind);
	
	
	//$('#netWtError').val(responseText.data.ratingError.weight);
	//$('#feetError').val(responseText.data.ratingError.cubicFeet);
	var netWtError=responseText.data.ratingError.weight;
	var feetError=responseText.data.ratingError.cubicFeet;
	//for 022341
	//For D026643
	//if(responseText.data.ratingError.unitOfMeasureSourceCode=="I"){
		$('#netWtError').val(Math.floor(netWtError));
		$('#feetError').val(Math.floor(feetError));
	/*}
	
	else{		
		$('#netWtError').val((Math.round((parseFloat(netWtError,3)*1000))/1000).toFixed(3));
		$('#feetError').val((Math.round((parseFloat(feetError,3)*1000))/1000).toFixed(3));
		
	}*/

	
	$('#RtCdDelvError').val(responseText.data.ratingError.recDel);
	$('#RtCdPickUpError').val(responseText.data.ratingError.recPickup);
	$('#carrPkUpDelvError').val(responseText.data.ratingError.carrDelv);
	$('#carrPkUpError').val(responseText.data.ratingError.carrPickUp);
	$('#EqCubeError').val(responseText.data.ratingError.eqpCube);
	$('#EqWtError').val(responseText.data.ratingError.eqpWt);

	
	//$('#equipPcError').val(responseText.data.ratingError.equipPiece);
	$('#sizeError').val(responseText.data.ratingError.typeSize);
	$('#efError').val(responseText.data.ratingError.emptyFull);
	$('#frtError').val(responseText.data.ratingError.frtCharges);
	//$('#ratingIdER').val(responseText.data.ratingError.reHeaderId);
	//D024328: 	Billing: GATES Rate Engine Choices Screen does not match FACTS
	$('#rateSetIdErr').val(responseText.data.ratingError.reHeaderId);
	
	
	if(responseText.data.header!=undefined && responseText.data.shipmentItemForm != undefined 
			&& ((responseText.data.shipmentItemForm.imperialLengthFeet != null && responseText.data.shipmentItemForm.imperialLengthFeet > 0) || (responseText.data.shipmentItemForm.imperialLengthInches != null && responseText.data.shipmentItemForm.imperialLengthInches > 0) || (responseText.data.shipmentItemForm.metricLength != null && responseText.data.shipmentItemForm.metricLength > 0))
			&& ((responseText.data.shipmentItemForm.imperialBreathFeet != null && responseText.data.shipmentItemForm.imperialBreathFeet > 0) || (responseText.data.shipmentItemForm.imperialBreathInches != null && responseText.data.shipmentItemForm.imperialBreathInches > 0) || (responseText.data.shipmentItemForm.metricBreadth != null && responseText.data.shipmentItemForm.metricBreadth > 0))
			&& ((responseText.data.shipmentItemForm.imperialHeightFeet != null && responseText.data.shipmentItemForm.imperialHeightFeet > 0) || (responseText.data.shipmentItemForm.imperialHeightInches != null && responseText.data.shipmentItemForm.imperialHeightInches > 0) || (responseText.data.shipmentItemForm.metricHeight != null && responseText.data.shipmentItemForm.metricHeight > 0))){
				if(responseText.data.ratingError.unitOfMeasureSourceCode=="I"){
					$('#sizeError').val("L: "+ responseText.data.shipmentItemForm.imperialLengthFeet+"' "+responseText.data.shipmentItemForm.imperialLengthInches+'"  W: '+ responseText.data.shipmentItemForm.imperialBreathFeet+"' "+responseText.data.shipmentItemForm.imperialBreathInches
							+'"  H: '+ responseText.data.shipmentItemForm.imperialHeightFeet+"' "+responseText.data.shipmentItemForm.imperialHeightInches+'"');
				}else{
					convertImperialIntoMetricAndDisplayREError(responseText.data.shipmentItemForm.metricLength, responseText.data.shipmentItemForm.metricBreadth,	responseText.data.shipmentItemForm.metricHeight);
					
				}
				$('#sizeError').addClass('typeSizeHasDimension');
				document.getElementById('errorTypeSize').innerHTML = 'Dimension';
	}
	
	//for 24256
	if(responseText.data.ratingError.equipSubsScenario!=undefined &&
			responseText.data.ratingError.equipSubsScenario!=null && 
			responseText.data.ratingError.equipSubsScenario==true){
		document.getElementById('equipmentSubstitutionScenarioREError').innerHTML = 'EQP SUBS';
		$('#equipmentSubstitutionScenarioREError').attr('style','background:yellow');
		$('#cmdyError').attr('style','background:yellow');
		$('#sizeError').attr('style','background:yellow');
		$('#isEmptyFullREError').attr('style','background:yellow');

	}
	else{
		document.getElementById('equipmentSubstitutionScenarioREError').innerHTML = ' ';
		$('#cmdyError').removeAttr('style','background');
		$('#sizeError').removeAttr('style','background');
		$('#isEmptyFullREError').removeAttr('style','background');

	}
	
	//24328 start//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//for empty full special service
	if(responseText.data.ratingError.emptyFull!=null){
		if(responseText.data.ratingError.emptyFull=="FULL"){
			document.getElementById('isEmptyFullREChoice').innerHTML = 'FULL  ';
		}else if(responseText.data.ratingError.emptyFull=="EMPTY") {
			document.getElementById('isEmptyFullREChoice').innerHTML = 'EMPTY  ';
		}
	}
	if(responseText.data.sizeOfItem!=undefined)
	$('#totalCmdyLinesError').val(responseText.data.sizeOfItem);
	else
	$('#totalCmdyLinesError').val(responseText.data.ratingError.commodityLineCount);
	
	if(responseText.data.freightForm!=undefined){
		$('#equipmentIdError').val(responseText.data.freightForm.equipmentId);
		$('#totalFreightCountError').val(responseText.data.freightForm.totalEquipment);
		$('#equipPcError').val(responseText.data.freightForm.shipmentFreightSeqNumber);
	
		
		if(responseText.data.freightForm.temperature!=null){
			document.getElementById('temperatureREError').innerHTML = responseText.data.freightForm.temperature+"  ";
			if(responseText.data.freightForm.temperatureCode!=null){
				document.getElementById('temperatureREError').innerHTML = responseText.data.freightForm.temperature+" "+ responseText.data.freightForm.temperatureCode+"  ";
			}
		}
		if(responseText.data.freightForm.overflow!=null){
			if(responseText.data.freightForm.overflow=="Y")
				document.getElementById('isOverFlowREError').innerHTML = 'Oflow:Y';
			//D025163
			//else if(responseText.data.freightForm.overflow=="N")
				//document.getElementById('isOverFlowREError').innerHTML = 'Oflow:N';
		}
	}else if(responseText.data.shipmentFreightForm!=undefined){
		$('#equipmentIdError').val(responseText.data.shipmentFreightForm.equipmentId);
		$('#totalFreightCountError').val(responseText.data.shipmentFreightForm.totalEquipment);
		$('#equipPcError').val(responseText.data.shipmentFreightForm.shipmentFreightSeqNumber);
		
		if(responseText.data.shipmentFreightForm.isEmpty!=null){
			if(responseText.data.shipmentFreightForm.isEmpty=="F"){
				document.getElementById('isEmptyFullREError').innerHTML = 'FULL  ';
			}else{
				document.getElementById('isEmptyFullREError').innerHTML = 'EMPTY  ';
			}
		}
		if(responseText.data.shipmentFreightForm.temperature!=null){
			document.getElementById('temperatureREError').innerHTML = responseText.data.shipmentFreightForm.temperature+"  ";
			if(responseText.data.shipmentFreightForm.temperatureCode!=null){
				document.getElementById('temperatureREError').innerHTML = responseText.data.shipmentFreightForm.temperature+" "+ responseText.data.shipmentFreightForm.temperatureCode+"  ";
			}
		}
		if(responseText.data.shipmentFreightForm.overflow!=null){
			if(responseText.data.shipmentFreightForm.overflow=="Y")
				document.getElementById('isOverFlowREError').innerHTML = 'Oflow:Y';
			//D025163
			//else if(responseText.data.shipmentFreightForm.overflow=="N")
			//	document.getElementById('isOverFlowREError').innerHTML = 'Oflow:N';
		}
	}
	//24328 end//////////////////////////////////////////////////////////////////////////////////////////////////////////
	//22179- to display commodity decription on mouse hover
	hoverErrorDesc();
}

function onChoiceGridLoad(){
	var reccountContainerGrid = $('#reChoiceGrid').jqGrid('getDataIDs');
	for (var i = 0; i < reccountContainerGrid.length; i++) {
		if(jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]). selectable
				 == 'false'){
			var id = jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]). reRatingChoiceId;
			id= id.substring(0,id.indexOf("."));
			$("#jqg_reChoiceGrid_" + id).attr("disabled", true);	
//			$("div.ui-pg-div.ui-inline-edit", "#"+$('#commodityGrid').jqGrid('getDataIDs')[i]).hide();
//			jQuery("#reChoiceGrid").getRowData( $('#reChoiceGrid').jqGrid('getDataIDs')[i]).style.di
//        	$("#jqg_reChoiceGrid_" + rowdata.reRatingChoiceId).attr("disabled", true);
		}
	}
	rowSequenceNumberForREChoices=0;
}

function onGridComplete (){
	var rowIDs = jQuery("#reChoiceGrid").getDataIDs(); 
    for (var i=0;i<rowIDs.length;i=i+1){ 
      var rowData=jQuery("#reChoiceGrid").getRowData(rowIDs[i]);
      var trElement = jQuery("#"+ rowIDs[i],jQuery('#reChoiceGrid'));
      $(trElement.children()[3]).attr('title',rowData.choiceAssistText);
    }
}
//22179- to display commodity decription on mouse hover
function hoverErrorDesc(){
	var txtTool=document.getElementById('commodityDescError'); 
	txtTool.title=txtTool.value; 
}
function hoverChoicesDesc(){
	var txtTool=document.getElementById('commodityDescChoice'); 
	txtTool.title=txtTool.value; 
}
//for 22658
//changed because the font has been changed to courier new which takes more space. Also modified the formattter
function lineFormatter( input, options, rowObject )
{	
	if(input.length>95){
			var finalString="";
			var text1= input.substr(0, 95);
			//finalSting=text1;
			firstText="";
			var lengthFirstText=0;
			var array=[];
			var count=0;
			
			while(text1!=""){
				
		
				indexOfSpace= text1.lastIndexOf(" ");
				//indexOfSpace=text1.length-indexOfSpace;
				if(text1.length>=95){
					if(indexOfSpace>0){
					firstText= text1.substring(0, indexOfSpace+1);
					}else{
					firstText= text1.substring(0, 95);	
					}
				}else{
					firstText=text1;
				}
				lengthFirstText= firstText.length + lengthFirstText;
				finalString=finalString+firstText;
				
				text1=input.substr(lengthFirstText,95);
				
				//if(text1.indexOf(' ') >= 0){
				if(firstText.match(/^\s+$/) === null && firstText!="") {
				array[count]=firstText;
				count++;
				}
	
			}
			
			 //i=count;
			 var lineInGrid="";
			 for(var i=(count-1); i>=0;i--){
				 if(i==count-1){
					 lineInGrid=  array[i].trim() + lineInGrid;
				 }else{
				 lineInGrid= array[i].trim() + "</br>" +lineInGrid;
				 }
			 }
			 return lineInGrid;
	}
	else{
			return input;
	}
}

function lineFormatterREerror( input, options, rowObject )
{
	if(input.length>40){
			var finalString="";
			var text1= input.substr(0, 40);
			//finalSting=text1;
			firstText="";
			var lengthFirstText=0;
			var array=[];
			var count=0;
			
			while(text1!=""){
				
		
				indexOfSpace= text1.lastIndexOf(" ");
				//indexOfSpace=text1.length-indexOfSpace;
				if(text1.length>=40){
					if(indexOfSpace>0){
					firstText= text1.substring(0, indexOfSpace+1);
					}else{
					firstText= text1.substring(0, 40);	
					}
				}else{
					firstText= text1;
				}
				lengthFirstText= firstText.length + lengthFirstText;
				finalString=finalString+firstText;
				
				text1=input.substr(lengthFirstText,40);
				
				//if(text1.indexOf(' ') >= 0){
				if(firstText.match(/^\s+$/) === null && firstText!="") {
				array[count]=firstText;
				count++;
				}
	
			}
			
			 //i=count;
			 var lineInGrid="";
			 for(var i=(count-1); i>=0;i--){
				 if(i==count-1){
					 lineInGrid=  array[i] + lineInGrid;
				 }else{
				 lineInGrid=  array[i] + "</br>" +lineInGrid;
				 }
			 }
			 return lineInGrid;
	}
	else{
			return input;
	}
}

function convertImperialIntoMetricAndDisplayREError(imperialTotalLengthInInches, imperialTotalBreadthInInch, imperialTotalHeightInInch){
	var metricLength=0;
	var metricBreadth=0;
	var metricHeight=0;
	metricLength=(Math.round((imperialTotalLengthInInches)*0.0254)).toFixed(3);
	metricBreadth=(Math.round((imperialTotalBreadthInInch)*0.0254)).toFixed(3);
	metricHeight=(Math.round((imperialTotalHeightInInch)*0.0254)).toFixed(3);
	
	$('#sizeError').val("L: "+metricLength+"m  W: "+metricBreadth+"m  H: "+metricHeight+"m");
}
function convertImperialIntoMetricAndDisplayREChoice(imperialTotalLengthInInches, imperialTotalBreadthInInch, imperialTotalHeightInInch){
	var metricLength=0;
	var metricBreadth=0;
	var metricHeight=0;
	metricLength=(Math.round((imperialTotalLengthInInches)*0.0254)).toFixed(3);
	metricBreadth=(Math.round((imperialTotalBreadthInInch)*0.0254)).toFixed(3);
	metricHeight=(Math.round((imperialTotalHeightInInch)*0.0254)).toFixed(3);
	
	$('#size').val("L: "+metricLength+"m  W: "+metricBreadth+"m  H: "+metricHeight+"m");
}

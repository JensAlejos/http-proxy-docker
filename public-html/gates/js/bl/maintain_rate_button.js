var doesChange = false;
var doesTariffOverlay =false;
var doesItemOverlay =false;
var isGridReloaded=false;
var dataName =  null;
var grpId = null;
var itemId = null;
var primaryTariffItemCommodityDescriptionId=0;
//var firstAuditDetailsToolTipText="";
var primaryCommodityDescription="";
var deleteChargesBeforeSaving=false;
var initialItemNumber="";





$(document).ready(function () { 

	if(null!=$('#shipmentNumber').val() && $.trim($('#shipmentNumber').val())!=''){
		displayShipment1();
	}
	
	function displayShipment1() {
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
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
					$("#shipmentSequenceNumber").val(shipmentSequenceNumber);
				}			
			});
		}
	}
	
	 $( "#trace_options_dialog" ).dialog({
			autoOpen: false, 
			width: 200,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			},
		});
	
	$('#shpChargeTraceBtn').click(function(){
		
					   		$( "#trace_options_dialog" ).dialog("open");
					   		$('#lowTrace').attr('checked',true);
							$('#mediumTrace').attr('checked',false);
							$('#highTrace').attr('checked',false);
							$('#startRating').attr("disabled", false);
							$('#optionToRate').val("3");
							
	});

	$('#lowTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("3");		
	});
	
	$('#mediumTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("5");
	});
	
	$('#highTrace').click(function(){
		$('#startRating').attr("disabled", false);
		$('#optionToRate').val("7");
	});
	
	
	
	
	
	$('#cancelRating')
	.click(
		function() {
			$('#trace_options_dialog').dialog('close');
		});
	
	$('#startRating')
	.click(function(){
		$('#trace_options_dialog').dialog('close');
		blockUI();
		rateBill();
	});
	
	
	$('#itemNumber').attr("readOnly",false);
	if($("#shipmentCorrectionNumber").val()!=null)
	{
	$('#shipmentSequenceNumber').attr('disabled', false);
	$('#shipmentCorrectionNumber').attr('disabled', false);
	}
	$('#holdsUnreleased').attr("style","visiblit:hidden");
	$("#holdsUnreleased").dialog("close");
	//changed to true against D019871 
	//for 22071
	if($('#msgDiv').text().trim() == "Shipment Saved Successfully"){
		makeChargeGrid(false);
	}else{
	makeChargeGrid(true);
	}
	
	$('#shpChargeSaveBtn').click(function() {
		callSave();
		captureChanges();
	});
	
	$('#shpChargeBillBtn').click(function() {
		
		
		if($('#tariffNumber').val() == null || $('#tariffNumber').val() =='' ){
			$('#tariffNumber').validationEngine('showPrompt', 'Tariff Number is mandatory', 
						'error', 'topRight', true);
			return;
		}
		if ($('#commodityDesc').val() == null || $('#commodityDesc').val() =='' ){
			$('#commodityDesc').validationEngine('showPrompt', 'Commodity Description is mandatory', 
					'error', 'topRight', true);
			return;
		}
		if ($('#itemNumber').val() == null || $('#itemNumber').val() =='' ){
			$('#itemNumber').validationEngine('showPrompt', 'Item Number is mandatory', 
					'error', 'topRight', true);
			return;
		}
		
		if($('#commodityCode option').length >= 3 && $('#commodityCode').val() == ''){
			$('#commodityCode').validationEngine('showPrompt', 'Please choose one Com. Code', 
					'error', 'topRight', true);
			return;
		}
		
		$("#holdsUnreleased").dialog("close");
		doesChange = false;
		blockUI();
		//call save only when unsaved changes are there
		if((changedArray!=undefined && changedArray.length>0) || $('#isAnyGridChanged').val()=="true"){
				var queryString = getQueryString();
				$.ajax({
					type : "POST",
					url : _context + "/maintainRate/save",
					data:queryString,
					success : function(responseText) {
						$.unblockUI();
						if(responseText.success==false){
							showResponseMessages("msgDiv", responseText);
							return false;
						}else{
		//					loadShipment(responseText);
							showResponseMessages("msgDiv", responseText);
							doesChange = false;
							
		//					$("#chargeGrid").trigger('reloadGrid');
							//against 22487- to remove error message on re rating
							//and to remove the data from text box of grid
		//					$("#FormError").hide();
		//					document.getElementById("chargeCode").value = "";
		//					$('#numberOfUnit').val("");
		//					$('#rate').val("");
		//					document.getElementById("rateBasisCode").value = "";
		//					document.getElementById("responsiblePartyCode").value = "";
							blockUI();
							captureChanges();
							$('#optionToRate').val("0");
							rateBill();
						}
					}
				});
		}else{
			blockUI();
			captureChanges();
			$('#optionToRate').val("0");
			rateBill();
		}
	});
	

	$('#OKBtn').click(function(){
    		if(document.getElementById("info_dialog") != null)
        			$('#info_dialog').attr("style","display:none");

		addAccesorialCharge() ;
	});
	
	
	$('#clearAsscBtn').click(function(){
		$('#ITEM_NAME').val("");
		$('#GROUP_NAME').val("");
		$('#SOURCE_TARIFF').val("");
		$('#RATE_DESCRIPTION').val("");
		$('#CHARGE_CODE').val("");
		clearOverlayGrid();
		
	});
	
	$('#overlayCancelBtn').click(function(){
		if(document.getElementById("info_dialog") != null)
			$('#info_dialog').attr("style","display:none");
        $("#commodityDescPage").dialog('close');

	});

	$("#shpChargeCorrectionsBtn").click(function() {
		
					   		document.location.href = _context+ "/bill/frtcorrection/find?shipmentNumber="+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber=000&source=CHARGES';
	});
	
	$('#shpChargeReleaseAuditBtn').click(function(){
		if($('#auditId').val()!=''){
			var id=$('#auditId').val();
			blockUI();
			$.ajax({
				   type: "GET",
				   url: _context +"/shipment/releaseAudit",
				   data: "id="+ id,
				   success: function(responseText, statusText, xhr, $form){
					   showResponseMessages('msgDiv',responseText);
					   $.unblockUI();
					   var messages = responseText.messages;
					   if (messages.success.length > 0 ) 
					   {
						   window.location = _context + "/maintainRate/showform"; 
					   }
				   }
				 });
				
		}
		});

	
	if($("#shipmentNumber").val() != null && $("#shipmentNumber").val() != '' &&
			$("#shipmentSequenceNumber").val() != null && $("#shipmentSequenceNumber").val() != '' &&
			$("#shipmentCorrectionNumber").val() != null && $("#shipmentCorrectionNumber").val() != ''){
		enableActionButtons();
	}else{
		disableActionButtons();
	}
	/*if($("#shipmentNumber").val() != ''){
		$('#shipmentGoBtn').trigger("click");
	}*/
	//openUnreleasedHoldGridOnIntialDisplay("rateBill");
	
	/*Security Shipment*/
	enforceSecurityTitle(isBLRTDisplayOnly);
	_enforceSecuritySectionWithoutAccordion('commodityContent',isBLRTDisplayOnly,isBLRTModifiable)
	enforceSecurityDivAndButtons('accessorialChargesDiv', isBLRT_BLAC_Display);
	enforceSecurityDivAndButtons('shpChargeSaveBtn', isBLRTModifiable);
	enforceSecurityDivAndButtons('shipmentHoldReleaseBtn', isBLRTHoldrelease);
	enforceSecurityDivAndButtons('shpChargeBillBtn', isBLRTBill);
	enforceSecurityDivAndButtons('shpChargeTraceBtn', isBLRTTrace);
	enforceSecurityDivAndButtons('shpChargeReleaseAuditBtn',isReleaseAuditButtonEnable);
	enforceSecurityDivAndButtons('shpChargeSendDocBtn',isSendDocEnabled);
	enforceSecurityDivAndButtons('shpChargePayablesBtn',isPayablesEnable);
	enforceSecurityDivAndButtons('shpChargeCorrectionsBtn',isCorrectionEnable);
	enforceSecurityDivAndButtons('shpChargeStatusBtn',isStatusButtonEnable);
	
	//added against D032209
	disableTextBoxes();
	
	//hold release button disable enable
	if($("#holdUnreleasedGrid").getGridParam("reccount")>0){
		$("#shipmentHoldReleaseBtn").attr("disabled", false);
	}
	else{
		$( "#holdsUnreleased" ).dialog('close'); 
		$("#shipmentHoldReleaseBtn").attr("disabled", true);
	}
	tabSequence('#shipmentForm',false,false);
	
	captureChanges();
	/*if(firstAuditDetailsToolTipText=="" || firstAuditDetailsToolTipText==null){
		getFirstAuditReleaseDetail();
	}

	$("#shpChargeReleaseAuditBtn").tooltip({
	    bodyHandler: function() { 
	    	if(firstAuditDetailsToolTipText!="")
	    		return firstAuditDetailsToolTipText;
	    	else
	    		return;
	    }
	});*/
	
	
});

function callSave(){
	if($('#tariffNumber').val() == null || $('#tariffNumber').val() =='' ){
		$('#tariffNumber').validationEngine('showPrompt', 'Tariff Number is mandatory', 
					'error', 'topRight', true);
		return;
	}
	if ($('#commodityDesc').val() == null || $('#commodityDesc').val() =='' ){
		$('#commodityDesc').validationEngine('showPrompt', 'Commodity Description is mandatory', 
				'error', 'topRight', true);
		return;
	}
	if ($('#itemNumber').val() == null || $('#itemNumber').val() =='' ){
		$('#itemNumber').validationEngine('showPrompt', 'Item Number is mandatory', 
				'error', 'topRight', true);
		return;
	}
		
	if($('#commodityCode option').length >= 3 && $('#commodityCode').val() == ''){
		$('#commodityCode').validationEngine('showPrompt', 'Please choose one Com. Code', 
				'error', 'topRight', true);
		return;
	}
	
//	if($('#containerCommodityDesc').val() == null || $('#containerCommodityDesc').val() =='' ){
//		$('#containerCommodityDesc').validationEngine('showPrompt', 'Customer Commodity Description is mandatory', 
//				'error', 'topRight', true);
//		return;
//	}
	if(deleteChargesBeforeSaving==true)
		deleteAllCharges($('#itemNumber'));
		deleteChargesBeforeSaving=false;
	saveShipment();
}

function deleteAllCharges(fieldName){
		doesChange = true;
		$.ajax({
			type : "POST",
			url : _context + "/maintainRate/deleteAllCharges",
			success : function(responseText) {
				if (responseText.messages.error.length == 0) {
					$("#chargeGrid").trigger('reloadGrid');
				}
			}
		});
} 


$(function() {
	$('#shipmentForm').validationEngine('attach');
	
	 $('#commodityDesc').change(function(){
			$('#itemNumber').val(""); 
			 $('#note').val("");
			 doesChange=true;
			 //makeChargeGrid(true);
			 deleteChargesBeforeSaving=true;
		 });

	
	/* On click of */
	$("#shpChargePayablesBtn").click(function() {
	
					   		var shipmentNumberHeader = $("#shipmentNumber").val();
					   		var firstPage = $(document).getUrlParam("firstPage");
							var shipment_sequence_number = $("#shipmentSequenceNumber").val();
							var shipment_correction_number = $("#shipmentCorrectionNumber").val();
							
							if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
								shipment_sequence_number="000";
							}
							if(shipment_correction_number == ""	|| shipment_correction_number == null){
								shipment_correction_number="000";
							}
							var url = "/billLadingPayable/find?shipmentNumber="+
								shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
								"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=maintainRate&firstPage="+firstPage;
							window.location = _context + url;
								
		
			
	}	);
	
	$("#shpChargeStatusBtn").click(function() {
		
					   		var shipmentNumberHeader = $("#shipmentNumber").val();
							
							var shipment_sequence_number = $("#shipmentSequenceNumber").val();
							var shipment_correction_number = $("#shipmentCorrectionNumber").val();
							
							if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
								shipment_sequence_number="000";
							}
							if(shipment_correction_number == ""	|| shipment_correction_number == null){
								shipment_correction_number="000";
							}
							var url = "/bill_status_history/find?shipmentNumber="+
								shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
								"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=maintainRate";
							window.location = _context + url;var shipmentNumberHeader = $("#shipmentNumber").val();
							
							var shipment_sequence_number = $("#shipmentSequenceNumber").val();
							var shipment_correction_number = $("#shipmentCorrectionNumber").val();
							
							if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
								shipment_sequence_number="000";
							}
							if(shipment_correction_number == ""	|| shipment_correction_number == null){
								shipment_correction_number="000";
							}
							var url = "/bill_status_history/find?shipmentNumber="+
								shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
								"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=maintainRate";
							window.location = _context + url;
								
		
			
	}	);
	
	$("#shpChargeSendDocBtn").click(function() {
		
					   		var shipmentNumberHeader = $("#shipmentNumber").val();
							
							var shipment_sequence_number = $("#shipmentSequenceNumber").val();
							//D032364
							var shipment_correction_number ="000";
							
							if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
								shipment_sequence_number="000";
							}
							
							var url = "/printFreightBill/go?shipmentNumber="+
								shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
								"&shipmentCorrectionNumber="+shipment_correction_number+"&source=maintainRate";
							window.location = _context + url;
								
		
			
	}	);
	
	
	
	
	/* overlay popup search */
	
	//code to bind pop up search
	$('#GROUP_NAME').gatesPopUpSearch({func:function() {groupNamePopupSearchOverlay()}});
	$('#SOURCE_TARIFF').gatesPopUpSearch({func:function() {SourceTariffPopupSearchOverlay()}});	
	$('#ITEM_NAME').gatesPopUpSearch({func:function() {ItemPopupSearchOverlay()}});
	
	$('#CHARGE_CODE').gatesAutocomplete({
		//mustMatch : true, 
		//autoSelectWhenSingle:true,
		/*source : url,*/
		minLength: 1,
		source:_context+'/cas/autocomplete.do?method=getChrgeLnDesc&searchType=266',
		formatItem : function(data) {
			return data.code + "-" + data.desc;
		},
		formatResult : function(data) {
			//return data.code + "-" + data.desc;
			return data.code ; //23534
		},
		select : function(data) {
			
			$('#CHARGE_CODE').val(data.code);
			return data.code ;
		}
	});
	
	$('#GROUP_NAME').gatesAutocomplete({
		 source: _context+'/cas/autocomplete.do',
		 //autoSelectWhenSingle:true,
		 extraParams: {
			 method: 'searchGroupName',
		 		 searchType: '10',
		 		 mustMatch:true,
		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
		 		 groupType:  function(){return '07'},//'01',
		 		 sourceTariff:  function(){return $('#SOURCE_TARIFF').val();},
		 },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 	dataname = data.name;
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#GROUP_NAME').val(data.id);		 		 		 
		 }		 
	});
	
	$('#GROUP_NAME').blur(function(){ 
		if(dataname)
			$('#GROUP_NAME').val(dataname);
		dataname=null;
	});
	
	


	$('#ITEM_NAME').gatesAutocomplete({
		 source: _context+'/cas/autocomplete.do',
		 //autoSelectWhenSingle:true,
		 minLength: 1,
		 extraParams: {
			 method: 'searchItemName',
		 		 searchType: '43',
		 		 mustMatch:true,
		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
		 		 groupType:  function(){return '07'},//'01',
		 		 sourceTariff:  function(){return $('#SOURCE_TARIFF').val();},
		 		 groupName:   function(){return $('#GROUP_NAME').val();}
		 },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#ITEM_NAME').val(data.id);	
		 }		 
	});		 
	
	
	$('#SOURCE_TARIFF').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do',
		//autoSelectWhenSingle:true,
		minLength: 1,
		extraParams: {
				method: 'searchTariffSource',
				searchType: '11',
				//mustMatch:true,
				groupType:  '07'
		},
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
				dataname = data.name;
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#SOURCE_TARIFF').val(data.name);	
		 		 
		 		 if($('#GroupType').html()=="01"){
		 			 $('#GROUP_NAME').val(data.name);	 			 
		 		 }
		 }		 
	});	
	$('#SOURCE_TARIFF').blur(function(){ 
		if(dataname)
			$('#SOURCE_TARIFF').val(dataname);
		dataname=null;
	});
	
	$("#overlay_cancel").click(function(){
		clearOverlayGrid();
	});
				
	/**  Grids */


				var colNamesForMaintainChargeGrid = ['shipmentChargeId','Charge','Units','Rate Amount', 'Rate Basis', 'Charge Amount','P/C','Level','User','Last Update','TXN',''];

				var colModelForMaintainChargeGrid = [
				                                        {name:'shipmentChargeId',index:'shipmentChargeId', editable:false, hidden:true},
	 			                                        {name:'chargeCode', index:'chargeCode', width:50,editable:true,edittype:'select',editoptions: {size:1,dataUrl:_context+'/maintainRate/loadChargeType'},
				                                        	editrules:{required:true},
				                                        	editable:true } ,
		 			                                        /*{name:'chargeCode', index:'chargeCode', width:50,editable:true,edittype:'select',editoptions: getChargeTypeCode,
					                                        	editrules:{required:true},
					                                        	editable:true,formatter:'select' } ,*/
				                                        {name:'numberOfUnit',index:'numberOfUnit',width:50, editable:true,
				                                        		},
				                                        {name:'rate', index:'rate', width:35, editable:true,required:true},
				                                        {name:'rateBasisCode', index:'rateBasisCode', width:75, edittype:'select', editoptions:{dataUrl:_context+'/maintainRate/loadRateBasis'},editrules:{required:true},editable:true},
				                                        {name:'shipmentChargeAmount', index:'shipmentChargeAmount', width:50, editable: false },
				                                        {name:'responsiblePartyCode', index:'responsiblePartyCode', width:50, editable: true,edittype:'select',editoptions:{ dataUrl:_context+'/maintainRate/loadPCIndicator' } },
				                                        {name:'processLevelCode', index:'processLevelCode', width:50, editable: false },
				                                        {name:'createUser', index:'createUser', width:50, editable: false },
				                                        {name:'showLastUpdateDateTime', index:'showLastUpdateDateTime', width:50, editable: false },
				                                        {name:'txnType', index:'txnType', width:100, editable: false },
				                                        {name:'actions', width:50, formatter:'actions',
				                                        		formatoptions:{keys:true,editbutton:true, delbutton:true,
				                                        			onEdit:function(rowid){
				                                        				doesChange=true;
				                                        				$("div.ui-pg-div.ui-inline-del","#gbox_chargeGrid").css("visibility", 'hidden');
				                                        			},afterSave:funcReload} 

				                                        		}
											   ];
				var jsonReaderSpSvc = {
						root : "rows",
						page : "page",
						total : "total",
						records : "records",
						repeatitems : false,
						cell : "cell",
						id : "shipmentChargeId"
					};

				createGrid(
						"chargeGrid", // grid id for user
						"pagerChargeGrid", // page id for user
						'/gates/maintainRate/loadCharges',  //get url
						'/gates/maintainRate/addCharge', //add url
						'/gates/maintainRate/editCharge', //edit url
						'/gates/maintainRate/deleteCharge', //delete url
						'/gates/maintainRate/deleteCharge', // delete multi select url
						colNamesForMaintainChargeGrid, 
						colModelForMaintainChargeGrid, 
						" ",
						110,
						3,
						[3,6,9],
						true,
						true,
						false, //load once
						false, jsonReaderSpSvc,false,true,true,true,true,false,false,false,onCompletion,false,false);
				
				
				var colNamesForAccessorialChargeGrid = ['id', '','Units','Rate','R/B', 'CHG', 'Level','Type/Size','Rate Description','Charge Amt','O/D','City','Sec Amt/Type','Src/Grp/Itm'];

				var colModelForAccessorialChargeGrid = [
				                                        {name:'id',index:'id',hidden:true},
				                                        {name:'descriptionOfChargeCode',index:'descriptionOfChargeCode',width:50, editable:false, hidden:true},
					                                     {name:'numberOfUnits',index:'numberOfUnits',width:50, editable:true, 
				                                        	editoptions: {maxlength: 10,

				                                        		 dataEvents: [
				                                        		{ type: 'change', fn: function (id) {
				                                        			var id = jQuery("#accesrialChargeGrid").jqGrid('getGridParam','selrow');
//						 			           	                    var fol = jQuery("#list").jqGrid('getRowData',id); 
				                                        			var noOfUnit = "#"+id+"_numberOfUnits";
				                                        			var value = $(noOfUnit).val();
						 			           	                		var idArray = id +":"+value + ",";
						 			           	                		calculateAccesorialChargeAmount(idArray);
						 			           	                		if(document.getElementById("info_dialog") != null)
						 			           	                			$('#info_dialog').attr("style","display:none");
						 			           	                		return [false,""];
				                                        		      }
				                                        		      }]
				                                        		},
				                                        	 editrules:{
				                                        		 number:true,
				 			           	                		custom:true,
				 			           	                		custom_func:function (value, colname, id) {
				 			           	                		var id = jQuery("#accesrialChargeGrid").jqGrid('getGridParam','selrow');
//				 			           	                    var fol = jQuery("#list").jqGrid('getRowData',id); 
				 			           	                		var idArray = id +":"+value + ",";
				 			           	                		calculateAccesorialChargeAmount(idArray);
				 			           	                		if(document.getElementById("info_dialog") != null)
				 			           	                			$('#info_dialog').attr("style","display:none");
				 			           	                		return [false,""];
				 			           	                		}
				                                        	 }
//				                                        	editoptions: {
//				                                        	    dataInit : function (elem) { $(elem).focus(function(){ this.select();}) },
//				                                        	    dataEvents: [
//				                                        	        { 
//				                                        	            type: 'keydown', 
//				                                        	            fn: function(e, row, colName) {
//				                                        	            	
//				                                        	                var key = e.charCode || e.keyCode;
//				                                        	                if(key == 9)   // tab
//				                                        	                {
//				                                        	                	alert('fjfhj');
//				                                        	                	idArray += id +":"+noOfUnit + ",";
//				                                        	                	jQuery("#accesrialChargeGrid").jqGrid('getCell', containerArr[i], 'numberOfUnits');
//				                                        	                	calculateAccesorialChargeAmount(idArray);
//				                                        	                }
//				                                        	                else if (key == 13)//enter
//				                                        	                {
//				                                        	                	alert('fjfhj');
//				                                        	                	calculateAccesorialChargeAmount(idArray);
//				                                        	                }
//				                                        	            }
//				                                        	        } 
//				                                        	    ]
//				                                        	}
					                                     
					                                     
					                                     },
				                                        {name:'strRate', index:'strRate', width:70, editable:false, editoptions: {maxlength: 10}
				                                        	,formatoptions:{decimalSeparator:".",decimalPlaces:2}, align:'right'},
				                                        {name:'rateConversion', index:'rateConversion', width:35, editable:false},
				                                        {name:'chargeCode', index:'chargeCode', width:40, editable: false, 
				                                        	
				                                        	
				                                        	cellattr: function (rowId, val, rawObj, cm, rdata)
				                                        	{
					                                    
					                                    
				                                        	return 'title="' +' ' + rawObj.descriptionOfChargeCode + '"';
				                                        	}
				                                        },
				                                        {name:'pl', index:'pl', width:35, editable: false,},
				                                        {name:'typeSize', index:'typeSize', width:70, editable: false },
				                                        {name:'rateDescription', index:'rateDescription', width:160, editable: false },
				                                        {name:'chargeAmount', index:'chargeAmount', width:80, editable: false,
				                                        	formatoptions:{decimalSeparator:".",decimalPlaces:2}, align:'right'},
				                                        {name:'directionCode', index:'directionCode', width:30, editable: false },
				                                        {name:'cityCode', index:'cityCode', width:40, editable: false },
				                                        {name:'type', index:'type', width:100, editable: false },
				                                        {name:'srcGrpItm', index:'srcGrpItm', width:145, editable: false }
//				                                        ,
//				                                        {name:'actions', width:40, formatter:'actions',
//			                                        		formatoptions:{keys:true,editbutton:true, delbutton:false}}

											   ];
				var jsonReaderSpSvc = {
						root : "rows",
						page : "page",
						total : "total",
						records : "records",
						repeatitems : false,
						cell : "cell",
						id : "id"
					};

				
				createGrid(
						"accesrialChargeGrid", // grid id for user
						"accesrialPagerChargeGrid", // page id for user
						'/gates/maintainRate/loadAccessorialCharges',  //get url
						'', //add url
						'', //edit url
						'', //delete url
						'', // delete multi select url
						colNamesForAccessorialChargeGrid, 
						colModelForAccessorialChargeGrid, 
						"Accessorial Charges",
						500,
						20,
						[20,40,60],
						true,
						false,
						false, //load once
						false, jsonReaderSpSvc,
						true,isBLRT_BLAC_Delete?false:true,true,true,true,false,false,false,false,false,false,isBLRT_BLAC_Update?true:true);
				
				
				
				makeGridForReError("maintainRate");
				

/* predictive search for Tariif Number */

				var tariffNumber = $('#tariffNumber').val();
				$('#tariffNumber').gatesAutocomplete({
				 source: _context+'/cas/autocomplete.do',
					 extraParams: {
					 		 method: 'searchTariffSource',
					 		 searchType: '11',
					 		 mustMatch:true,
					 		 groupType:  '01'
					 },
			     formatItem: function(data) {
			    	 dataName=data.name;
			    	 grpId=data.id;
				 return data.name;
				 },
				 formatResult: function(data) {
				 return data.name;
				 }, 
				 select: function(data) {
				 $('#tariffNumber').val(data.id);
				 $('#tariffCheck').val(data.id);
				 grpId=data.id;
				 clearDataForTariffNumber(data.name,tariffNumber);
				 clearCommodityCodeList();
				 tariffNumber =  $('#tariffNumber').val();
				 $('#itemNumber').attr("readOnly",false);
				 //makeChargeGrid(true);
				 deleteChargesBeforeSaving=true;
				 }
				 });
				  $('#tariffNumber').change(function(){
						$('#commodityCode option').remove();
						$('#commodityCode').val();
						 $('#commodityDesc').val("");
							$('#itemNumber').val("");
							$('#note').val("");
							$('#itemNumber').attr("readOnly",true);
							$('#note').attr("readOnly",true);
							doesChange =true;
							$.ajax({
								type : "POST",
								url : _context + "/maintainRate/deleteAllCharges",
								success : function(responseText) {
									if (responseText.messages.error.length == 0) {
										$("#chargeGrid").trigger('reloadGrid');
										
									}
								}
							});
							
							if(grpId==null ||grpId==""){
						    	$("#tariffNumber").val(""); 
						    	$("#tariffCheck").val(""); 
							}
							else{
								$("#tariffNumber").val(dataName);
								$("#tariffCheck").val(dataName); 
								$('#itemNumber').val("");
									//$('#in_item').removeAttr("disabled");
								grpId="";
							}		
				 });
	
	
				 $('#itemNumber').gatesAutocomplete({
					 source: _context+'/cas/autocomplete.do',
					 minLength: 1,
					 extraParams: {
			 			 method: 'searchItemName',
			 		 		 searchType: '43',
			 		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
			 		 		 groupType:  '01',
			 		 		 sourceTariff:  function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();},
			 		 		 groupName:   function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();}
			 		 },
				 formatItem: function(data) {
					 dataName=data.name;
				 	itemId=data.id;
				 		 return data.name;
				 },
				 formatResult: function(data) {
				 		 return data.name;
				 },
					 
					select: function(data) {
						 
						 $('#tariffItemId').val(data.id);
						 itemId=data.id;
								resetTariffDetails(data.id,data.name);

						if(initialItemNumber!=data.name)//if($('#itemNumber').val()!=data.name)
							deleteChargesBeforeSaving=true;
							//deleteAllCharges($('#itemNumber'));
						$('#itemNumber').val(data.name);
						clearCommodityCodeList();	 	
						getPrimaryCommodity($('#tariffNumber').val(), data.name);	
					 	//makeChargeGrid(true);	
					 }	 
				});		 
	
				 $('#itemNumber').change(function(){
					 $('#commodityCode option').remove();
					 $('#commodityCode').val();
					 if(itemId==null || itemId==""){				
					     	$("#itemNumber").val("");       	
					 	  }		
							else{
								$("#itemNumber").val(dataName); 
								itemId="";
							}
				 });
				 
	 $('#tariffNumber').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});
	 $('#itemNumber').gatesPopUpSearch({func:function() {ItemPopupSearch()}});
	 $('#note').gatesPopUpSearch({
			func : function() {
				if($('#tariffNumber').val()!=null && $('#tariffNumber').val().trim()!="" && 
						$('#itemNumber').val()!=null && $('#itemNumber').val().trim()!=""){
				notePopupSearch();
				}
			}
				
		});
	 
	 $('#commodityDesc').gatesPopUpSearch({
			func : function() {
				if(($('#commodityDesc').val()!="") || ($('#tariffNumber').val()!="" && $('#itemNumber').val()!="")){
					commPopupSearch();
				}
					else{
						alert("Please enter either Commodity Description or Tariff and Item");
					}
			}
		});
	 
	 function commPopupSearch() {
		 var dscr = $("#commodityDesc").val();
			var tariffNo = $("#tariffNumber").val();
			var itemNo =$("#itemNumber").val();
			var estShipDate = "";
			if($('#freightReceivedDateOriginal').val()!=null && $('#freightReceivedDateOriginal').val()!="null" && $('#freightReceivedDateOriginal').val()!=""){
				estShipDate = $('#freightReceivedDateOriginal').val();
			}
			var loadSrvc = $("#loadServiceCode").val();
			var dischargeSrvc =  $("#dischargeServiceCode").val();
			var trade = $('#tradeCode').val();
			var blOriginCityCode = $('#blOriginCityCode').val();
			var originPortCityCode =  $('#originPortCityCode').val();
			var destinationPortCityCode =  $('#destinationPortCityCode').val();
			var blDestinationCityCode =  $('#blDestinationCityCode').val();
			
			commDescSearchLocator = "commDesc";
			var actionUrl = _context+'/cas/searchShipmentCommodityLookup.do?filterValue1=' +encodeURIComponent(dscr + '|' + tariffNo + '|' + itemNo + '|' + trade +
					'|' + loadSrvc + '|' + dischargeSrvc + '|' + estShipDate + '|' + blOriginCityCode + '|' + originPortCityCode + 
					'|' + destinationPortCityCode + '|' + blDestinationCityCode);
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'CustomerSearch', windowStyle);	
		}
	 
	 
	 
	 $('#codeOfCommodity').live("change", (function(){
		 blockUI();
		 changeCommodity();
		// enableDisablePreviousAndNextButton();
		 captureChanges();
		 //$.unblockUI();//handled in function changeCommodity
	 }));

	$('#nextCommodity').click(function() {
		blockUI();
		/*$('#chargeGridDiv').html('<table id="chargeGrid"></table>'+
		'<div id="pagerChargeGrid"></div>');*/
		//makeChargeGrid(false);
		displayNextCommodity();
		//enableDisablePreviousAndNextButton();
		captureChanges();
		//$.unblockUI();//handled in function displayNextCommodity
		
	});
	
	$('#previousCommodity').click(function() {
		blockUI();
		/*$('#chargeGridDiv').html('<table id="chargeGrid"></table>'+
		'<div id="pagerChargeGrid"></div>');*/
		//makeChargeGrid(false);
		displayPreviousCommodity();
		//enableDisablePreviousAndNextButton();
		captureChanges();
		//$.unblockUI();//handled in function displayPreviousCommodity
		
	});
	
	$('#shipmentGoBtn').click(function() {
		if(isAnyChangeOnPage()) {
			if(!confirm('You have unsaved changes!')) {
				return;
			}
		}
		

		if($('#shipmentNumber').val() == null || $('#shipmentNumber').val() ==''){
			$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
		} else{
			blockUI();
			displayShipment();
			captureChanges();
		}
		$('#chargeGridDiv').html('<table id="chargeGrid"></table>'+
				'<div id="pagerChargeGrid"></div>');
		//commented against D019871
		//makeChargeGrid(false);}
		
	});

	$('#Search').click(function() {
		blockUI();
		searchAccesorialCharge();
	});

//	$('#CalculateBtn').click(function() {
//		calculateAccesorialChargeAmount();
//	});

	
	
	
	
	//<!--- Predictive Search --->
	//var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355'
	$('#shipmentNumber').gatesAutocomplete({			//code changed for defect 22269
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
			//written here to capture latest value for $('#shpmntNo').val()
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
					$('#shipmentCorrectionNumber').attr('disabled', false);
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
						}
					});
				}			
			});
		}
		});
	
			 $('#shipmentSequenceNumber').gatesAutocomplete({
					source: _context+'/cas/autocomplete.do',
					extraParams: {
									method : "searchShpmntSeqNo",
									searchType : "354",
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
						$('#shipmentCorrectionNumber').attr('disabled', false);
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
								var shipmentCorrectionNumberOption='';
								$.each(list, function(index,codeDescription) {
									$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
									shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
								});	
								$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
								$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
							}
						});
					}
				});
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		//$('#shipmentSequenceNumber').attr('disabled', true);
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});
	
	$("#shipmentCorrectionNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$("#shipmentGoBtn").click();
		}
	});
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentSequenceNumber').val('');
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$("#shipmentGoBtn").click();
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			$("#shipmentGoBtn").click();
		}
	});
	
	 $('#accChargesId').click(function() {
		 clearOverlayGrid();
		 showAddCommodityDialog();
	 });
	 
	
	 
	 $( "#re_choice_dialog" ).dialog({
			autoOpen: false, 
			width: 1000,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			},
//			close : function() {
//				$("#re_choice_dialog").validationEngine('hideAll');
//				$("#re_choice_dialog").dialog('close');
//			//	$('#specialServicesGrid').jqGrid('GridUnload');
////				 $("#mixcommodityGrid").trigger('reloadGrid');  
//			}
//			buttons : {
//				"Search" : function(){
//					
//				}
				
//			"Add & New": function(){
//			        	callComodityAddNew();
//			        },
//		        Ok: function(){
//		        	if(mixCommOverlayMode=="edit"){
//		        		callCommodityEdit();
//		        	}
//		        	else{
//		        					       
//		        	callComodityAdd();
//		        	}
//		        },
//		        Clear: function() {
//		        	clearCommodity();
//		        },
//		        Cancel: function() {
	//
//					var r = confirm("All the unsaved Changes will be discarded!");
//					if (r == false) {
//						return false;
//					}
//		        	 $("#commodityDescPage").dialog('close');
//		        }
//			}
		});
	
	 
//	 $( "#re_choice_dialog" ).dialog({
//			autoOpen: false, 
//			width: 1000,
//			modal: true,
//			closeOnEscape: false,
//			beforeClose: function() {
//				
//				
//			},
//			close : function() {
//				$("#re_choice_dialog").validationEngine('hideAll');
//				$("#re_choice_dialog").dialog('close');
//			}
//		});
//	
	 $( "#re_error_dialog" ).dialog({
			autoOpen: false, 
			width: 1000,
			modal: true,
			closeOnEscape: false,
			beforeClose: function() {
				
				
			},
			close : function() {
				$("#re_error_dialog").validationEngine('hideAll');
				$("#re_error_dialog").dialog('close');
			//	$('#specialServicesGrid').jqGrid('GridUnload');
//				 $("#mixcommodityGrid").trigger('reloadGrid');  
			}
//			buttons : {
//				"Search" : function(){
//					
//				}
				
//			"Add & New": function(){
//			        	callComodityAddNew();
//			        },
//		        Ok: function(){
//		        	if(mixCommOverlayMode=="edit"){
//		        		callCommodityEdit();
//		        	}
//		        	else{
//		        					       
//		        	callComodityAdd();
//		        	}
//		        },
//		        Clear: function() {
//		        	clearCommodity();
//		        },
//		        Cancel: function() {
	//
//					var r = confirm("All the unsaved Changes will be discarded!");
//					if (r == false) {
//						return false;
//					}
//		        	 $("#commodityDescPage").dialog('close');
//		        }
//			}
		});
		
	$('#re_error_dialog').bind('dialogclose', function(event) {
        if((location.href).indexOf("maintainRate")!=-1)
            location.reload();
    });

	$( "#commodityDescPage" ).dialog({
		autoOpen: false, 
		width: 1000,
		height:1000,
		modal: true,
		closeOnEscape: false,
		title:"Accessorial Charges",
		beforeClose: function() {
			
			
		},
		close : function() {
			$("#commodityDescPage").validationEngine('hideAll');
		//	$('#specialServicesGrid').jqGrid('GridUnload');
//			 $("#mixcommodityGrid").trigger('reloadGrid');  
		}
//		buttons : {
//			"Search" : function(){
//				
//			}
			
//		"Add & New": function(){
//		        	callComodityAddNew();
//		        },
//	        Ok: function(){
//	        	if(mixCommOverlayMode=="edit"){
//	        		callCommodityEdit();
//	        	}
//	        	else{
//	        					       
//	        	callComodityAdd();
//	        	}
//	        },
//	        Clear: function() {
//	        	clearCommodity();
//	        },
//	        Cancel: function() {
//
//				var r = confirm("All the unsaved Changes will be discarded!");
//				if (r == false) {
//					return false;
//				}
//	        	 $("#commodityDescPage").dialog('close');
//	        }
//		}
	});
	//changed for 22071- while saving, shipmentgobtn was overwriting sucessfully saved message
	if($("#shipmentNumber").val() != '' && $('#msgDiv').text().trim() != "Shipment Saved Successfully"){
		$('#shipmentGoBtn').trigger("click");
	}else if($('#msgDiv').text().trim() == "Shipment Saved Successfully"){
		enableTextBoxes();
		enableActionButtons() ;
		$("#accChargesId").attr("style","display:block");
	}
	//openUnreleasedHoldGridOnIntialDisplay("rateBill");
});


function dimensionFieldSetUp(responseText){
	if(responseText.data.routing.routingLoadDischargePair !=null &&
			(responseText.data.routing.routingLoadDischargePair.trim() =="CON" || responseText.data.routing.routingLoadDischargePair.trim() =="LCL")){
		$("#metricDimension").html(responseText.data.shipmentItemForm.metricDimension);
		$("#imperialDimension").html(responseText.data.shipmentItemForm.imperialDimension);
		document.getElementById("forConventional").style.display="block";
		if(responseText.data.header.unitOfMeasureSourceCode=="M"){
			document.getElementById("forMetric").style.display="block";
			document.getElementById("forImperial").style.display="none";
		}
		if(responseText.data.header.unitOfMeasureSourceCode=="I"){
			document.getElementById("forImperial").style.display="block";
			document.getElementById("forMetric").style.display="none";
		}
	}else{
		document.getElementById("forConventional").style.display="none";
	}
	
			
}


function showAddCommodityDialog(){
	$('#ITEM_NAME').val("");
	$('#GROUP_NAME').val("");
	$('#SOURCE_TARIFF').val("");
	$('#RATE_DESCRIPTION').val("");
	$('#CHARGE_CODE').val("");
           $("#commodityDescPage").dialog('open');
           $('#commodityDescPage').validationEngine('attach');
           $('#msgDivCommodityOverlay').html("");
}

function notePopupSearch() {
	var tariffNo = $("#tariffNumber").val();
	var itemNo = $("#itemNumber").val();
	// Need to set it
	var estShipDate = "";
	if($('#rateDate').val()!=null && $('#rateDate').val()!="null" && $('#rateDate').val()!=""){
		estShipDate = $('#rateDate').val();
	}
	var trade = $("#tradeCode").val();
	var loadSrvc = $("#loadServiceCode").val();
	var dischargeSrvc = $("#dischargeServiceCode").val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var eqType = "";
	var eqLength= "";
	var eqHeight= "";
	noteLookUp ="CONTRCOMM";
	var origin = $('#blOriginCityCode').val();
	var destination = $('#blDestinationCityCode').val();
	var actionUrl = _context+'/cas/searchNoteNoLookup.do?filterValue1=' + tariffNo + '|' + itemNo + '|' + estShipDate + '|' + eqType + 
		'|' + eqLength + '|' + eqHeight + '|' + origin + '|' + destination +
		'|' + originPortCityCode + '|' + destinationPortCityCode + '|' + loadSrvc + '|' + dischargeSrvc + '|' + trade ;
	
		
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'NoteSearch', windowStyle);
}

function noteNoUpdate(id){
	var values= id.split("|");
	if($("#note").val()!=$.trim(values[0]))
		deleteChargesBeforeSaving=true;
		 //deleteAllCharges($('#note'));
	$("#note").val($.trim(values[0]));
	// makeChargeGrid(true);
}

function ItemPopupSearch() {   
	doesItemOverlay =  false;
	var actionUrl = _context+"/cas/itemnamelookup.do?sourceTariff="+$('#tariffNumber').val()+"&grpName="+$('#tariffNumber').val()+"&grpTyp=01"+"&itemName="+$('#itemNumber').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
} 


function SourceTariffPopupSearch() {   
	doesTariffOverlay = false;
	
	 var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+01+"&sourceTariff="+$('#tariffNumber').val();
	 tariffNumber =$('#tariffNumber').val();
	 var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	 window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}


function clearDataForTariffNumber(id, olddata){
	
	 if(id.trim()!=olddata.trim() ){
		
			$('#commodityDesc').val("");
			$('#itemNumber').val("");
			$('#note').val("");
			$('#itemNumber').removeAttr("readOnly");
			//deleteAllCharges($('#itemNumber'));
			deleteChargesBeforeSaving=true;
	 }
}

function getQueryString() {
	enableTextBoxes();
	var queryString = $("#shipmentForm").formSerialize();
	disableTextBoxes();
	return queryString;
}

function saveShipment(){
	doesChange = false;
	blockUI();
	var queryString = getQueryString();
	$.ajax({
		type : "POST",
		url : _context + "/maintainRate/save",
		data:queryString,
		success : function(responseText) {
			$.unblockUI();
			if(responseText.success==false){
				showResponseMessages("msgDiv", responseText);
				return false;
			}else{
				loadShipment(responseText);
				showResponseMessages("msgDiv", responseText);
				doesChange = false;
				//	D025305: 	TRACE MODE DIFFERENCES BETWEEN GATES & FACTS-Inactive notify party
				captureChanges();
			}
		}
	})
//	$("#shipmentForm").attr("action","save");
//	var queryString = $("#shipmentForm").formSerialize();
//	$("#shipmentForm").submit();
	
	
	$("#chargeGrid").trigger('reloadGrid');
	//against 22487- to remove error message on re rating
	//and to remove the data from text box of grid
	$("#FormError").hide();
	document.getElementById("chargeCode").value = "";
	$('#numberOfUnit').val("");
	$('#rate').val("");
	document.getElementById("rateBasisCode").value = "";
	if(document.getElementById("responsiblePartyCode") != null) {
		document.getElementById("responsiblePartyCode").value = "";
	}
}


function rateBill(){
	
	enableTextBoxes();
	var queryString = $("#shipmentForm").formSerialize()+'&commodityDisplay=last';
	disableTextBoxes();
	console.log("Bill clicked, query string:"+queryString);
	$.ajax({
		type : "POST",
		url : _context + "/maintainRate/rateBill",
		data : queryString,
		success : function(responseText) {
			$.unblockUI();
			//D027411
			captureChanges();
			if(responseText.success==false){
				showResponseMessages("msgDiv", responseText);
				return;
			}
			if (responseText.messages.error.length == 0) {
				
				if(responseText.data.rateView != null) {
					if(responseText.data.rateView == "showError"){
						$("#shipmentForm").loadJSON(responseText.data);
						$("#statusCode").html(responseText.data.header.statusCode);
						loadErrorOverLay(responseText);
						$('#reErrContinueBtn').hide();
						$('#re_error_dialog').dialog( "open" );
						$("#reErrorGrid").trigger('reloadGrid');
					}else if(responseText.data.rateView == "showChoices"){
						$("#shipmentForm").loadJSON(responseText.data);
						loadChoiceOverLay(responseText);
						$('#reUseSelection').val('S');
						$('#re_choice_dialog').dialog( "open" );
						
						$("#reChoiceGrid").trigger('reloadGrid');
					}if(responseText.data.rateView == "hold"){
						if(responseText.data.flow == true){
							navigateToTargetPageForFurtherFlow('Maintain Booking',responseText.data.targetPage, 
								$("#shipmentNumber").val(), responseText.data.header.shipmentSequenceNumber,"000",
								"2");
							return;
						}

//						if(responseText.data.targetPage == "Maintain Rate Bill"){
//							openHoldsUnreleasedDialog('rateBill');
//							$('#holdUnreleasedGrid').trigger('reloadGrid');
//							$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//						}
//						else{
							if(responseText.data.targetPage!="Maintain Bill"){
							navigateToTargetPage('',responseText.data.targetPage, 
									$("#shipmentNumber").val(), $("#shipmentSequenceNumber").val(),$("#shipmentCorrectionNumber").val(),
									"BLRT");
							}else{
								document.location.href=_context+"/shipment/showForm";
							}
//						}
					}else if(responseText.data.rateView == "showWarning"){
						
						$('#re_error_dialog').dialog('open');					
						$("#ratingErrorForm").loadJSON(responseText.data);
						$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
						jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
						jQuery("#specialServiceGrid").trigger('reloadGrid');
					    jQuery("#reErrorGrid").trigger('reloadGrid');
						$('#reErrCloseBtn').hide();
						$('#quoteForm').loadJSON(responseText.data);
						$("#issueQuote").removeAttr("disabled");
						showResponseMessages(responseText.messages);
					}
					if(responseText.data.rateView == "exception"){
						$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
						return;
					}else if(responseText.data.rateView == "blank"){
						$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
						openHoldsUnreleasedDialog('shipment');
					}
					else if(responseText.data.rateView == "Success"){
						$("#shipmentForm").loadJSON(responseText.data);
						$("#statusCode").html(responseText.data.header.statusCode);
						$("#commodityCharges").html("$" + responseText.data.totalCommodityCharges);
						$("#shipmentCharges").html("$" +responseText.data.totalShipmentCharges);
						$("#payableCharges").html("$" +responseText.data.totalPayableCharges);

						// D024818 - Need to refresh Freight/Commodity information as well. 
						// Applied same logic as populatePrevious/NextCommodity
						
						refreshCommodity(responseText);
						
						// End of 
						
						showResponseMessages("msgDiv", responseText);
					}
				}
			}
			
			if($('#statusCode').text()=="IN AUDIT" || $('#statusCode').text()=="F/C AUDIT"){
				$('#shpChargeReleaseAuditBtn').attr('disabled', false);
				$('#auditId').val(responseText.data.header.auditId);
				$('#shpChargeReleaseAuditBtn').attr('title',responseText.data.header.auditDesc);
			}else{
				$('#shpChargeReleaseAuditBtn').attr('disabled', true);
			}
			
			$("#chargeGrid").trigger('reloadGrid');
			//against 22487- to remove error message on re rating
			//and to remove the data from text box of grid
			$("#FormError").hide();
			document.getElementById("chargeCode").value = "";
			$('#numberOfUnit').val("");
			$('#rate').val("");
			document.getElementById("rateBasisCode").value = "";
			if(document.getElementById("responsiblePartyCode") != null) {
				document.getElementById("responsiblePartyCode").value = "";
			}
		}
	});

}

function refreshCommodity(responseText) {
	billType = responseText.data.header.billType;
	$("#codeOfCommodity").val(responseText.data.shipmentItemForm.code);
	$("#commodityDesc").val(responseText.data.shipmentItemForm.commodityDesc);
	$("#shipmentItemPiece").html(responseText.data.shipmentItemForm.piece);
	$("#shipmentItemKind").html(responseText.data.shipmentItemForm.kind);
	setTimeout(function(){
		 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
				{  $("#shipmentItemKind").val("PCS");   }
	 },500);
	$("#itemNumber").val(responseText.data.shipmentItemForm.itemNumber);
	initialItemNumber=$('#itemNumber').val();
	$("#note").val(responseText.data.shipmentItemForm.note);
	$("#ItemTotalCount").html(responseText.data.shipmentItemForm.totalCount);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
	}else{
		$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
	}
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
	}else{
		$("#cube").html(responseText.data.shipmentItemForm.cube);
	}
	$("#totalEquip").html(responseText.data.shipmentItemForm.shipmentFreightCount);
	dimensionFieldSetUp(responseText);							
	var list= responseText.data.shipmentItemForm.commodityCodeList;
	//populateCommodityCode(list);
	//D026133
	populateCommodityCodeList(list);
	console.log("Loaded commodity line:"+responseText.data.shipmentItemForm.code);
	$('select[id*="commodityCode"]').attr("selectedIndex",responseText.data.shipmentItemForm.code);
	$("#overFlow").html(responseText.data.shipmentItemForm.isOverFlow);
	$("#proprateCode").html(responseText.data.shipmentItemForm.proprateCode);
	$("#containerCommodityDesc").val(responseText.data.shipmentItemForm.customerCommodityDescription);
	var codeValue = '';
	if($("#commodityCode").val() != null || $("#commodityCode").val() != undefined){
		codeValue = $("#commodityCode").val().trim();
	}
	setCommodityCode(responseText.data.shipmentItemForm.tariffCommodityDescId);
	if(codeValue != '' || codeValue != null){
		$("#commodityCode").val(codeValue);
	}
	$('#firstEquipment').val(responseText.data.shipmentItemForm.firstEquipment);	
	$('#firstEquipment').html(responseText.data.shipmentItemForm.firstEquipment);	
	$("#sizeOfItem").val(responseText.data.sizeOfItem);
	enableDisablePreviousAndNextButton();
}

function searchAccesorialCharge(){
	var queryString = getQueryString();
	$.ajax({
		type : "POST",
		url : _context + "/maintainRate/searchAccesorialCharges",
		data : {
			chargeCode:$('#CHARGE_CODE').val(),
			rateDesc : $("#RATE_DESCRIPTION").val(),
			sourceTariff : $("#SOURCE_TARIFF").val(),
			groupName : $("#GROUP_NAME").val(),
			itemName : $("#ITEM_NAME").val(),
		},
		success : function(responseText) {
			$.unblockUI();
			if (responseText.messages.error.length == 0) {
				$("#accesrialChargeGrid").trigger('reloadGrid');
			}
		}
	});
}


function loadShipment(responseText){

	
	$("#shipmentForm").loadJSON(responseText.data);
	if(responseText.data.header.overFlow == "Y"){
		$("#overFlowDiv").attr("style","display: block;");
		
	}else{
		$("#overFlowDiv").attr("style","display: none;");
		$('#totalCubeDiv').removeClass('prepend-1');
		$('#totalCubeDiv').addClass('prepend-7');
	}
//	$('#FormError').html("");
	
	$("#shipmentNumber").val(responseText.data.header.shipmentNumber);
	
	$("#shipmentSequenceNumber").val(responseText.data.header.shipmentSequenceNumber);
	
	$("#entityVersion").val(responseText.data.entityVersion);
	
	$("#ldService").html(responseText.data.routing.loadServiceCode + "-" + responseText.data.routing.dischargeServiceCode);
	$("#statusCode").html(responseText.data.header.statusCode);
	if(responseText.data.shipmentVoyage.vesselCode!=null && responseText.data.shipmentVoyage.voyage!=null && responseText.data.shipmentVoyage.directionSeq!=null){
		$("#vesselCode").html(responseText.data.shipmentVoyage.vesselCode + " " +
				responseText.data.shipmentVoyage.voyage + " " + responseText.data.shipmentVoyage.directionSeq);
	}else{
		$("#vesselCode").html("");
	}
	$("#routingDetails").html(responseText.data.routingDetail);
	
	
	//$("#quote").html(responseText.data.quoteNumber);
	//added to include version 022247
		if(responseText.data.quoteVersion!= null && responseText.data.quoteVersion.trim() != ""){
			$("#quote").html(responseText.data.quoteNumber + "." +responseText.data.quoteVersion);
			}
			else{
			$("#quote").html(responseText.data.quoteNumber);
			}
	$("#customerGroup").html(responseText.data.customerGroupName);
	$("#trade").html(responseText.data.header.tradeCode + "-" + responseText.data.tradeValue);
	
	//formatting of quote amount handled in ShipmentForm
	$("#quoteAmount").html(responseText.data.quoteAmount);
	
	$("#countSplService").html(responseText.data.countSplService);
	$("#countUnRlsdHold").html(responseText.data.countUnRlsdHold);

	console.log("rateDate="+responseText.data.header.rateDate+" frd="+responseText.data.header.freightReceivedDate);
	if(responseText.data.header.rateDate!="01-01-0001")
	{
		$("#rateDate").html(responseText.data.header.rateDate);
	}
	else
		{
		$("#rateDate").html("");
		}
	
	if(responseText.data.header.freightReceivedDate!="01-01-0001")
	{
		$("#freightReceivedDate").html(responseText.data.header.freightReceivedDate);
		console.log("frd="+$("#freightReceivedDate").html());
	}
	else
		{
		$("#freightReceivedDate").html("");
		}
	
	showResponseMessages("msgDiv", responseText);
	
	
	var list= responseText.data.header.shipmentCorrectionNumberList;
	$('#shipmentCorrectionNumber option').remove();
	$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = null;
	var shipmentCorrectionNumberOption='';
	$.each(list, function(index,codeDescription) {

		$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
		shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";

	});
	$("#shipmentCorrectionNumber").val(responseText.data.header.shipmentCorrectionNumber);
	
//	populateCommodityCodeList(responseText.data.shipmentItemForm.commodityCodeList);
	
	var list= responseText.data.shipmentItemForm.commodityCodeList;
	populateCommodityCode(list);
	
	
	
//	$('#correctionNumberList').val(commodityCodeOption);
	
	dimensionFieldSetUp(responseText);
	
	
	$("#codeOfCommodity option").remove();
	$("#codeOfCommodity").get(0).options[$("#codeOfCommodity").get(0).options.length] = null;
	var list= responseText.data.listOfShipmentItemForms;
	$.each(list, function(index,shipmentItemForm) {
		
		$("#codeOfCommodity").get(0).options[$("#codeOfCommodity").get(0).options.length] = new Option(shipmentItemForm.description, shipmentItemForm.code);
	});
	console.log("Loaded commodity line:"+responseText.data.shipmentItemForm.code);
	//Changed for defect D025006 
	$("#codeOfCommodity").val(responseText.data.shipmentItemForm.code);
	document.getElementById('codeOfCommodity').disabled=false;
	if(parseInt(responseText.data.sizeOfItem) <= 1){
		$('#nextCommodity').attr("disabled", true);
		$('#previousCommodity').attr("disabled", true);
	}else if($('#codeOfCommodity').val()==$('#sizeOfItem').val()){
		$('#nextCommodity').attr("disabled", true);
		$('#previousCommodity').attr("disabled", false);
	}else if($('#codeOfCommodity').val()==1){
		$('#nextCommodity').attr("disabled", false);
		$('#previousCommodity').attr("disabled", true);
	}
	
	//added against D019871
	//for 22735
	if($('#statusCode').text()=="CORRECTED" || $('#statusCode').text()=="ISSUED"){
		makeChargeGrid(true);
	}else{
	makeChargeGrid(false);
	}
	
	if($('#statusCode').text()=="IN AUDIT" || $('#statusCode').text()=="F/C AUDIT"){
		$('#shpChargeReleaseAuditBtn').attr('disabled', false);
		$('#auditId').val(responseText.data.header.auditId);
		$('#shpChargeReleaseAuditBtn').attr('title',responseText.data.header.auditDesc);
	}else{
		$('#shpChargeReleaseAuditBtn').attr('disabled', true);
	}
	
	//added to populate add accesorial charge link
	$("#accChargesId").attr("style","display:block");
				
	$("#shipmentItemId").val(responseText.data.shipmentItemForm.shipmentItemId);
	$("#sizeOfItem").val(responseText.data.sizeOfItem);
	
	$("#tariffNumber").val(responseText.data.header.tariffNumber);
	$("#tariffCheck").val(responseText.data.header.tariffNumber);
	$("#commodityDesc").val(responseText.data.shipmentItemForm.commodityDesc);
	$("#sizeOfItem").html(responseText.data.sizeOfItem);
	$("#measurementSource").html(responseText.data.header.unitOfMeasureSourceCode);
	$("#shipmentItemKind").html(responseText.data.shipmentItemForm.kind);
	billType = responseText.data.header.billType;
	setTimeout(function(){
		 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
				{  $("#shipmentItemKind").val("PCS");   }
	 },500);
	$("#itemNumber").val(responseText.data.shipmentItemForm.itemNumber);
	initialItemNumber=$('#itemNumber').val();
	$("#firstEquipment").html(responseText.data.shipmentItemForm.firstEquipment);
	$("#shipmentItemPiece")
	.html(
			responseText.data.shipmentItemForm.piece);
	//total cube and weight fields 
	//$("#totalWeight").html(responseText.data.shipmentItemForm.totalWeight);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#totalWeight").html(Math.round(responseText.data.shipmentItemForm.totalWeight).toFixed(0));
	}else{
		$("#totalWeight").html(responseText.data.shipmentItemForm.totalWeight);
	}
	//$("#totalCube").html(responseText.data.shipmentItemForm.totalCube);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#totalCube").html(Math.round(responseText.data.shipmentItemForm.totalCube).toFixed(0));
	}else{
		$("#totalCube").html(responseText.data.shipmentItemForm.totalCube);
	}
	
	$("#note").val(responseText.data.shipmentItemForm.note);
	$("#ItemTotalCount").html(responseText.data.shipmentItemForm.totalCount);
	//$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
	}else{
		$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
	}
	//$("#cube").html(responseText.data.shipmentItemForm.cube);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
	}else{
		$("#cube").html(responseText.data.shipmentItemForm.cube);
	}
	$("#totalEquip").html(responseText.data.shipmentFreightCount);
	$("#prepaid").html(responseText.data.prepaid);
	$("#collector").html(responseText.data.collector);

	//commented due to formatting issue
	//$("#commodityCharges").html("$" + responseText.data.totalCommodityCharges);
	//$("#shipmentCharges").html("$" +responseText.data.totalShipmentCharges);
	caluclateTotalCharges();
	
	//against D019888 for currency formatter
	var totalPayableCharges=responseText.data.totalPayableCharges;
	totalPayableCharges=currencyFmatter(totalPayableCharges);
	$("#payableCharges").html(totalPayableCharges);

	$("#netWeightlabel").html(responseText.data.netWeightLabel);
	$("#cubeLabel").html(responseText.data.cubeLabel);

	$("#totalWeightLabel").html(responseText.data.totalWeightLabel);
	$("#totalWeightlabel").html(responseText.data.totalWeightLabel);
	$("#totalCubeLabel").html(responseText.data.totalCubeLabel);
	
	$("#overFlow").html(responseText.data.shipmentItemForm.isOverFlow);
	$("#proprateCode").html(responseText.data.shipmentItemForm.prorateCode);
	$("#isProrate").val(responseText.data.header.isProrate);
	$("#totalWeightShipment").val(responseText.data.header.totalWeight);
	$("#totalCubeShipment").val(responseText.data.header.totalCube);
	
	
	if(responseText.data.shipmentItemForm.prorateCode!=null&&responseText.data.shipmentItemForm.prorateCode!="null"&&responseText.data.shipmentItemForm.prorateCode!=''){
		$("#totalWeightDiv").attr("style","display: block;");
		$("#prorateDiv").attr("style","display: block;");
		$("#totalCubeDiv").attr("style","display: block;");
	//condtion changed to check shipment prorate value	
	}else if($('#isProrate').val()=='N'||$('#isProrate').val()==''){
		$("#totalWeightDiv").attr("style","display: none;");
		$("#prorateDiv").attr("style","display: none;");
		$("#totalCubeDiv").attr("style","display: none;");
	}
	else
	{
		$("#prorateDiv").attr("style","display: none;");
		var totalWeightShipment=$('#totalWeightShipment').val();
		var totalCubeShipment=$('#totalCubeShipment').val();
		$('#totalWeightDiv').removeClass('span-7');
		$('#totalWeightDiv').addClass('span-14');
		$('#totalWeightlabel').removeClass('span-3 label prepend-2');
		$('#totalWeightlabel').addClass('span-10 label prepend-2');
		//$('#totalWeight').html(totalWeightShipment);
		if(responseText.data.header.unitOfMeasureSourceCode == "I"){
			$("#totalWeight").html(Math.round(totalWeightShipment).toFixed(0));
		}else{
			$("#totalWeight").html(totalWeightShipment);
		}
		//$('#totalCube').html(totalCubeShipment);
		if(responseText.data.header.unitOfMeasureSourceCode == "I"){
			$("#totalCube").html(Math.round(totalCubeShipment).toFixed(0));
		}else{
			$("#totalCube").html(totalCubeShipment);
		}
	}
	
	$("#containerCommodityDesc").val(responseText.data.shipmentItemForm.customerCommodityDescription);
	
	$("#tradeCode").val(responseText.data.header.tradeCode);
	$("#loadServiceCode").val(responseText.data.routing.loadServiceCode);
	$("#dischargeServiceCode").val(responseText.data.routing.dischargeServiceCode);
	$("#blOriginCityCode").val(responseText.data.routing.blOriginCityCode);
	$("#blDestinationCityCode").val(responseText.data.routing.blDestinationCityCode);
	$("#destinationPortCityCode").val(responseText.data.routing.destinationPortCityCode);
	$("#originPortCityCode").val(responseText.data.routing.originPortCityCode);
	$("#freightReceivedDateOriginal").val(responseText.data.header.freightReceivedDate);
	
	

	//reloadShipmentItem(responseText);
	
	reloadCommodityGridsForMaintainRate();
	//added against 19871
	enableTextBoxes();
	
	enableActionButtons() ;
	enableDisablePreviousAndNextButton();
	openUnreleasedHoldGridOnIntialDisplay("rateBill");
	if($("#statusCode").html() == "ISSUED" || $("#statusCode").html() == "CORRECTED" ){
		$('#shpChargeSaveBtn').attr('disabled', true);
		$('#shpChargeBillBtn').attr('disabled', true);
		$('#shpChargeTraceBtn').attr('disabled', true);
		$('#accChargesId').attr('disabled', true);
		
		//for 22735
		//$('#shpChargeReleaseAuditBtn').attr('disabled', true);
		//$('#shpChargeSendDocBtn').attr('disabled', true);
		disableTextBoxes();
		$("#accChargesId").attr("style","display:none");
		$('#chargeCode').attr('disabled', true);
		
		
	}
	if(responseText.data.header.shipmentCorrectionNumber != '000' ){
		$('#shpChargeBillBtn').attr('disabled', true);
		$('#shpChargeTraceBtn').attr('disabled', true);
	}
	
	if($('#shipmentSequenceNumber').val()!=''&&$('#shipmentSequenceNumber').val()!=null){
		$('#shipmentSequenceNumber').attr("disabled",false);
	}
	if($('#shipmentCorrectionNumber option').val()!=''&& $('#shipmentCorrectionNumber option').val()!=null){
		$('#shipmentCorrectionNumber').attr("disabled",false);
	}
	
	
//	alert($("#commodityCode").val());
	var codeValue = '';
	//D026133
	$("#commodityCode").val(responseText.data.shipmentItemForm.commodityCode);
	if($("#commodityCode").val() != null || $("#commodityCode").val() != undefined){
		codeValue = $("#commodityCode").val().trim();
	}
	setCommodityCode(responseText.data.shipmentItemForm.tariffCommodityDescId);
	if(codeValue != '' || codeValue != null){
		$("#commodityCode").val(codeValue);
	}
	
	//prepaidCollectIndicator in grid-23606
	$("#prepaidCollectIndicatorCode").val(responseText.data.header.responsiblePartyCode);
}

function displayShipment(){
	
	/*
	 * code added for populating default values of shipment sequence number
	 * and shipment correction number
	 */
	
	var shipment_number = $("#shipmentNumber").val();
	var shipment_sequence_number = $("#shipmentSequenceNumber").val();
	var shipment_correction_number = $("#shipmentCorrectionNumber").val();
	
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
	
	/** Populating Shipment Correction Number number Hard coded*/
	if(shipment_correction_number == ""	|| shipment_correction_number == null){
		$.ajax({
			async: false,
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
		
	var queryString = getQueryString();
	$.ajax({
		type : "POST",
		url : _context + "/maintainRate/loadShipment",
		data : queryString,
		success : function(responseText) {
			$.unblockUI();
			if (responseText.messages.error.length == 0) {
				
				loadShipment(responseText);
				
			}else{
				//added against D019871
				makeChargeGrid(true);
				
				$("#totalWeightDiv").attr("style","display: none;");
					$("#prorateDiv").attr("style","display: none;");
					$("#totalCubeDiv").attr("style","display: none;");
				
//				$('#FormError').html("");
				
				$("#shipmentNumber").val("");
				
				$("#shipmentSequenceNumber").val("");
				$("#shipmentCorrectionNumber").val("");

				
				$("#ldService").html("");
				$("#statusCode").html("");
				$("#vesselCode").html("");
				
				$("#routingDetails").html("");
				
				$("#quote").html("");
				$("#customerGroup").html("");
				$("#trade").html("");
				
				$("#quoteAmount").html("");
				$("#countSplService").html("SS:");
				$("#countUnRlsdHold").html("HD:");
				$("#rateDate").html("");
				$("#freightReceivedDate").html("");
				
				
				showResponseMessages("msgDiv", responseText);
				
				
				$('#shipmentCorrectionNumber option').remove();
				
				
//				populateCommodityCodeList(responseText.data.shipmentItemForm.commodityCodeList);
				
				$('#commodityCode option').remove();
				
				
				
//				$('#correctionNumberList').val(commodityCodeOption);
				
//				dimensionFieldSetUp(responseText);
				
				
				$("#codeOfCommodity option").remove();

				
				
				
				$("#shipmentItemId").val("");
				$("#sizeOfItem").val("");
				$("#sizeOfItem").html("");
				
				$("#tariffNumber").val("");
				$("#tariffCheck").val("");
				$("#commodityDesc").val("");
				$("#shipmentItemPiece").html("");
				$("#measurementSource").html("");
				$("#shipmentItemKind").html("");
				$("#itemNumber").val("");
				$("#firstEquipment").html("");
				
				$("#note").html("");
				$("#ItemTotalCount").html("");
				$("#netWeight").html("");
				$("#cube").html("");
				$("#totalEquip").html("");
				$("#prepaid").html("");
				$("#collector").html("");

				$("#commodityCharges").html("$ 0.0");
				$("#shipmentCharges").html("$ 0.0");
				$("#payableCharges").html("$ 0.00");

				$("#netWeightlabel").html("");
				$("#cubeLabel").html("");
				$("#totalWeightLabel").html("");
				$("#totalCubeLabel").html("");
				
				$("#overFlow").html("");
				$("#proprateCode").html("");
				
				
				$("#containerCommodityDesc").val("");
				
				$("#tradeCode").val("");
				$("#loadServiceCode").val("");
				$("#dischargeServiceCode").val("");
				$("#blOriginCityCode").val("");
				$("#blDestinationCityCode").val("");
				$("#destinationPortCityCode").val("");
				$("#originPortCityCode").val("");
				
				
				
				//reloadShipmentItem(responseText);
				
				//added against 19871
				disableTextBoxes();
				disableActionButtons();
				
				
				reloadCommodityGridsForMaintainRate();
				//enableActionButtons() ;
			}
		}	
	});
}

function reloadShipmentItem(responseText){
	$("#tariffNumber").val(responseText.data.header.tariffNumber);
	$("#tariffCheck").val(responseText.data.header.tariffNumber);
	$("#commodityDesc").val(responseText.data.shipmentItemForm.commodityDesc);
	$("#sizeOfItem").html(responseText.data.sizeOfItem);
	$("#shipmentItemPiece").html(responseText.data.shipmentItemForm.piece);
	$("#measurementSource").html(responseText.data.header.unitOfMeasureSourceCode);
	$("#shipmentItemKind").html(responseText.data.shipmentItemForm.kind);
	billType = responseText.data.header.billType;
	setTimeout(function(){
		 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
				{  $("#shipmentItemKind").val("PCS");   }
	 },500);
	$("#itemNumber").val(responseText.data.shipmentItemForm.itemNumber);
	initialItemNumber=$('#itemNumber').val();
	$("#note").val(responseText.data.shipmentItemForm.note);
	$("#ItemTotalCount").html(responseText.data.shipmentItemForm.totalCount);
	//$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
	}else{
		$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
	}
	//$("#cube").html(responseText.data.shipmentItemForm.cube);
	if(responseText.data.header.unitOfMeasureSourceCode == "I"){
		$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
	}else{
		$("#cube").html(responseText.data.shipmentItemForm.cube);
	}
	$("#totalEquip").html(responseText.data.shipmentItemForm.shipmentFreightCount);
	$("#prepaid").html(responseText.data.prepaid);
	$("#collector").html(responseText.data.collector);
	
	
	
	
	
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

		if(messageContent!=''){
			$('#'+msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
		
		$('#'+msgDivId).attr('style','display:block');
  	}
}
function onClickSpclSvc (){
	var shipmentNumber1=$('#shipmentNumber').val();
	var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
	var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
	document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ#SpclSvc";
}

function onClickHold (){
	var shipmentNumber1=$('#shipmentNumber').val();
	var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
	var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
	document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ#Hold";
}
function displayPreviousCommodity() {
	//if (confirmMessage()) {
		var queryString = getQueryString();
		$
				.ajax({
					//async: false,
					type : "POST",
					url : _context + "/maintainRate/populatePreviousCommodity",
					data : queryString,
					success : function(responseText) {
						if (responseText.messages.error.length == 0) {
							
							$("#shipmentForm").loadJSON(responseText.data);
							$("#codeOfCommodity").val(
									responseText.data.shipmentItemForm.code);
							$("#tariffNumber").val(
									responseText.data.header.tariffNumber);
							$("#tariffCheck").val(
									responseText.data.header.tariffNumber);
							$("#commodityDesc")
									.val(
											responseText.data.shipmentItemForm.commodityDesc);
							$("#shipmentItemPiece")
									.html(
											responseText.data.shipmentItemForm.piece);
							$("#measurementSource")
									.html(
											responseText.data.header.unitOfMeasureSourceCode);
							$("#shipmentItemKind").html(
									responseText.data.shipmentItemForm.kind);
							billType = responseText.data.header.billType;
							setTimeout(function(){
								 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
										{  $("#shipmentItemKind").val("PCS");   }
							 },500);
							$("#itemNumber")
									.val(
											responseText.data.shipmentItemForm.itemNumber);
							initialItemNumber=$('#itemNumber').val();
							$("#note").val(
									responseText.data.shipmentItemForm.note);
							$("#ItemTotalCount")
									.html(
											responseText.data.shipmentItemForm.totalCount);
							//$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
							if(responseText.data.header.unitOfMeasureSourceCode == "I"){
								$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
							}else{
								$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
							}
							//$("#cube").html(responseText.data.shipmentItemForm.cube);
							if(responseText.data.header.unitOfMeasureSourceCode == "I"){
								$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
							}else{
								$("#cube").html(responseText.data.shipmentItemForm.cube);
							}
							$("#totalEquip")
									.html(
											responseText.data.shipmentItemForm.shipmentFreightCount);
							$("#prepaid").html(responseText.data.prepaid);
							$("#collector").html(responseText.data.collector);

							dimensionFieldSetUp(responseText);
							
							var list= responseText.data.shipmentItemForm.commodityCodeList;
							populateCommodityCode(list);

							
							$('select[id*="commodityCode"]').attr("selectedIndex",0);

							$("#netWeightlabel").html(
									responseText.data.newWeightLabel);
							$("#cubeLabel").html(responseText.data.cubeLabel);
							$("#totalWeightLabel").html(
									responseText.data.totalWeightLabel);
							$("#totalCubeLabel").html(
									responseText.data.totalCubeLabel);

							$("#overFlow")
									.html(
											responseText.data.shipmentItemForm.isOverFlow);
							$("#proprateCode")
									.html(
											responseText.data.shipmentItemForm.proprateCode);

							$("#containerCommodityDesc")
									.val(
											responseText.data.shipmentItemForm.customerCommodityDescription);
							reloadCommodityGridsForMaintainRate();
							var codeValue = '';
							if($("#commodityCode").val() != null || $("#commodityCode").val() != undefined){
								codeValue = $("#commodityCode").val().trim();
							}
							setCommodityCode(responseText.data.shipmentItemForm.tariffCommodityDescId);
							if(codeValue != '' || codeValue != null){
								$("#commodityCode").val(codeValue);
							}

							$('#firstEquipment').val(responseText.data.shipmentItemForm.firstEquipment);	//for23654
							$('#firstEquipment').html(responseText.data.shipmentItemForm.firstEquipment);
//							$('#FormError').html("");

						}
						enableDisablePreviousAndNextButton();
						$.unblockUI();
					}
				});
	/*}else{
		return ;
	}*/
	
}

function changeCommodity(){
//	if (confirmMessage()) {
	var queryString = getQueryString();
	$.ajax({
		//async: false,
		type : "POST",
		url : _context + "/maintainRate/changeCommodity",
		data : 	queryString,
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
				$("#shipmentForm").loadJSON(responseText.data);
				$("#codeOfCommodity").val(responseText.data.shipmentItemForm.code);
				$("#tariffNumber").val(responseText.data.header.tariffNumber);
				$("#tariffCheck").val(responseText.data.header.tariffNumber);
				$("#commodityDesc").val(responseText.data.shipmentItemForm.commodityDesc);
				$("#shipmentItemPiece").html(responseText.data.shipmentItemForm.piece);
				$("#measurementSource").html(responseText.data.header.unitOfMeasureSourceCode);
				$("#shipmentItemKind").html(responseText.data.shipmentItemForm.kind);
				billType = responseText.data.header.billType;
				setTimeout(function(){
					 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
							{  $("#shipmentItemKind").val("PCS");   }
				 },500);
				$("#itemNumber").val(responseText.data.shipmentItemForm.itemNumber);
				initialItemNumber=$('#itemNumber').val();
				$("#note").val(responseText.data.shipmentItemForm.note);
				$("#ItemTotalCount").html(responseText.data.shipmentItemForm.totalCount);
				//$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
				if(responseText.data.header.unitOfMeasureSourceCode == "I"){
					$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
				}else{
					$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
				}
				//$("#cube").html(responseText.data.shipmentItemForm.cube);
				if(responseText.data.header.unitOfMeasureSourceCode == "I"){
					$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
				}else{
					$("#cube").html(responseText.data.shipmentItemForm.cube);
				}
				$("#totalEquip").html(responseText.data.shipmentItemForm.shipmentFreightCount);
				$("#prepaid").html(responseText.data.prepaid);
				$("#collector").html(responseText.data.collector);
				
				dimensionFieldSetUp(responseText);
				
				var list= responseText.data.shipmentItemForm.commodityCodeList;
				populateCommodityCode(list);
				
				$("#netWeightlabel").html(responseText.data.newWeightLabel);
				$("#cubeLabel").html(responseText.data.cubeLabel);
				$("#totalWeightLabel").html(responseText.data.totalWeightLabel);
				$("#totalCubeLabel").html(responseText.data.totalCubeLabel);

				$("#overFlow").html(responseText.data.shipmentItemForm.isOverFlow);
				$("#proprateCode").html(responseText.data.shipmentItemForm.proprateCode);

				$("#containerCommodityDesc").val(responseText.data.shipmentItemForm.customerCommodityDescription);
				
				reloadCommodityGridsForMaintainRate();
				var codeValue = '';
				if($("#commodityCode").val() != null || $("#commodityCode").val() != undefined){
					codeValue = $("#commodityCode").val().trim();
				}

				setCommodityCode(responseText.data.shipmentItemForm.tariffCommodityDescId);
				if(codeValue != '' || codeValue != null){
					$("#commodityCode").val(codeValue);
				}

				$('#firstEquipment').val(responseText.data.shipmentItemForm.firstEquipment);	//for23654
				$('#firstEquipment').html(responseText.data.shipmentItemForm.firstEquipment);
			}
			enableDisablePreviousAndNextButton();
			$.unblockUI();
		}
	});
	/*}else{
		return ;
	}*/
}


function displayNextCommodity() {
	
	//if (confirmMessage()) {
		var queryString = getQueryString();
		$
				.ajax({
					//async: false,
					type : "POST",
					url : _context + "/maintainRate/populateNextCommodity",
					data : queryString,
					success : function(responseText) {
						if (responseText.messages.error.length == 0) {
							
							$("#shipmentForm").loadJSON(responseText.data);
							$("#codeOfCommodity").val(
									responseText.data.shipmentItemForm.code);
							$("#tariffNumber").val(
									responseText.data.header.tariffNumber);
							$("#tariffCheck").val(
									responseText.data.header.tariffNumber);
							$("#commodityDesc")
									.val(
											responseText.data.shipmentItemForm.commodityDesc);
							$("#shipmentItemPiece")
									.html(
											responseText.data.shipmentItemForm.piece);
							$("#measurementSource")
									.html(
											responseText.data.header.unitOfMeasureSourceCode);
							billType = responseText.data.header.billType;
							setTimeout(function(){
								 if(billType=="HHGDS" && $("#shipmentItemKind").val().trim()=="")
										{  $("#shipmentItemKind").val("PCS");   }
							 },500);
							$("#shipmentItemKind").html(
									responseText.data.shipmentItemForm.kind);
							$("#itemNumber")
									.val(
											responseText.data.shipmentItemForm.itemNumber);
							initialItemNumber=$('#itemNumber').val();
							$("#note").val(
									responseText.data.shipmentItemForm.note);
							$("#ItemTotalCount")
									.html(
											responseText.data.shipmentItemForm.totalCount);
							//$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
							if(responseText.data.header.unitOfMeasureSourceCode == "I"){
								$("#netWeight").html(Math.round(responseText.data.shipmentItemForm.netWeight).toFixed(0));
							}else{
								$("#netWeight").html(responseText.data.shipmentItemForm.netWeight);
							}
							//$("#cube").html(responseText.data.shipmentItemForm.cube);
							if(responseText.data.header.unitOfMeasureSourceCode == "I"){
								$("#cube").html(Math.round(responseText.data.shipmentItemForm.cube).toFixed(0));
							}else{
								$("#cube").html(responseText.data.shipmentItemForm.cube);
							}
							$("#totalEquip")
									.html(
											responseText.data.shipmentItemForm.shipmentFreightCount);
							$("#prepaid").html(responseText.data.prepaid);
							$("#collector").html(responseText.data.collector);

							dimensionFieldSetUp(responseText);
							
							var list= responseText.data.shipmentItemForm.commodityCodeList;
							populateCommodityCode(list);

							
							$('select[id*="commodityCode"]').attr("selectedIndex",0);

							$("#netWeightlabel").html(
									responseText.data.newWeightLabel);
							$("#cubeLabel").html(responseText.data.cubeLabel);
							$("#totalWeightLabel").html(
									responseText.data.totalWeightLabel);
							$("#totalCubeLabel").html(
									responseText.data.totalCubeLabel);

							$("#overFlow")
									.html(
											responseText.data.shipmentItemForm.isOverFlow);
							$("#proprateCode")
									.html(
											responseText.data.shipmentItemForm.proprateCode);

							$("#containerCommodityDesc")
									.val(
											responseText.data.shipmentItemForm.customerCommodityDescription);

							reloadCommodityGridsForMaintainRate();
							var codeValue = '';
							if($("#commodityCode").val() != null || $("#commodityCode").val() != undefined){
								codeValue = $("#commodityCode").val().trim();
							}

							setCommodityCode(responseText.data.shipmentItemForm.tariffCommodityDescId);
							if(codeValue != '' || codeValue != null){
								$("#commodityCode").val(codeValue);
							}

							$('#firstEquipment').val(responseText.data.shipmentItemForm.firstEquipment);	//for23654
							$('#firstEquipment').html(responseText.data.shipmentItemForm.firstEquipment);
//							$('#FormError').html("");
						}
						enableDisablePreviousAndNextButton();
						$.unblockUI();
					}
				});
	/*}else{
		return ;
	}*/
	
}

function onCompletion(){
	// Fix for D017221
	// Made Ok Button disable
	/*if($("#responsiblePartyCode").val()==null){
		$("#responsiblePartyCode").val("P");
	}*/
	if($("#statusCode").html() == "PENDING" || $("#statusCode").html() == "F/C PENDING" ||
			$("#statusCode").html() == "ISSUED" ||
			$("#statusCode").html() == "CORRECTED"){
		if(isBLRT_BLAC_Add && isBLRTAdd){
			$('#OKBtn').attr("disabled", true);
		}
	}else{
		$('#OKBtn').attr("disabled", false);
	}
	//reloadCommodityGridsForMaintainRate();
	$("div.ui-pg-div.ui-inline-del", "#gbox_chargeGrid").hide();
	if(isBLRTDelete){
		$("#del_chargeGrid").show();
	}else{
		$("#del_chargeGrid").hide();
	}
	if(isBLRTUpdate){
		$("div.ui-pg-div.ui-inline-edit", "#gbox_chargeGrid").show();
	}else{
		$("div.ui-pg-div.ui-inline-edit", "#gbox_chargeGrid").hide();	
	}
	if(isBLRTAdd){
		$("div.ui-pg-div.ui-inline-add", "#gbox_chargeGrid").show();
		$('#gview_chargeGrid input').css("visibility", 'visible');
		$('#gview_chargeGrid select').css("visibility", 'visible');
		$("#sData", "#gbox_chargeGrid").show();
	}else{
		
		$("div.ui-pg-div.ui-inline-add", "#gbox_chargeGrid").hide();
		$('#gview_chargeGrid input').css("visibility", 'hidden');
		$('#gview_chargeGrid select').css("visibility", 'hidden');
		$("#sData", "#gbox_chargeGrid").hide();
	}
	
	
	//prepaidCollectIndicator in grid-23606
	//D023524 - commented out this code 
	/*if($('#prepaidCollectIndicatorCode').val()=="P" || $('#prepaidCollectIndicatorCode').val()=="C"){
		jQuery('#chargeGrid').setColProp('responsiblePartyCode',{editable:false});
			if($('#prepaidCollectIndicatorCode').val()=="P"){
				$("#responsiblePartyCode").val("P");
			}else{
				$("#responsiblePartyCode").val("C");
			}
			$("#responsiblePartyCode").attr('disabled',true);
	}else{
		jQuery('#chargeGrid').setColProp('responsiblePartyCode',{editable:true});
	}*/
	//D023524 - For add value is selectable
	//D026596
	if($('#prepaidCollectIndicatorCode').val()=="B"){
		var selectPC = $('<select id="responsiblePartyCode" name="responsiblePartyCode" class="FormElement"></select>');
		selectPC.append('<option value="P">P</option>');
		selectPC.append('<option value="C">C</option>');
		$("#tr_shipmentChargeId td:nth-child(10)").html(selectPC);
	} else {
		$("#tr_shipmentChargeId td:nth-child(10)").html($('#prepaidCollectIndicatorCode').val());
	}
	
	var rowIDs = jQuery("#chargeGrid").getDataIDs();
	for ( var i = 0; i < rowIDs.length; i = i + 1) {
		var trElement = jQuery("#"+ rowIDs[i],jQuery('#chargeGrid'));
		value = $('#chargeGrid').getCell(rowIDs[i],'rateBasisCode');
		if(value=='P'||value=='p')
			{
			$(trElement.children()[6]).text($(trElement.children()[6]).text().toString().replace("$",""));
			}
	}
	if($('#statusCode').text()=="CORRECTED" || $('#statusCode').text()=="ISSUED"){
		$("div.ui-pg-div.ui-inline-edit","#gbox_chargeGrid").hide();
	}
	
	if(!isGridReloaded) {
		caluclateTotalCharges();
	}
	else {
		isGridReloaded=false;
		//for 22735
		disableGridActionButtons();
		return;
	}
	
	var status = $('#statusCode').text();
	if (status == 'ISSUED' || status == 'CORRECTED') {
		$("[id^=jqg_chargeGrid]").attr('disabled',true);
		$('#cb_chargeGrid') .attr('disabled', true);
		$("[id^=jqg_chargeGrid]").css("visibility", 'hidden');
	}
}



function reloadCommodityGridsForMaintainRate(){
	
	$("#chargeGrid").trigger('reloadGrid');
}



/* pop search method for Overlay */

function SourceTariffPopupSearchOverlay() {   
	doesTariffOverlay = true;
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp=07&sourceTariff="+$('#SOURCE_TARIFF').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearchOverlay() {   
	var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp=07&sourceTariff="+$('#SOURCE_TARIFF').val()+"&grpName="+$('#GROUP_NAME').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}

function ItemPopupSearchOverlay() {
	doesItemOverlay =  true;
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp=07&sourceTariff="+$('#SOURCE_TARIFF').val()+"&grpName="+$('#GROUP_NAME').val()+"&itemName="+$('#ITEM_NAME').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}



/** callback method for Source/group and Item */
function sourceTariffSearchUpdate(id){
	var values = id.split("|");
	 if(doesTariffOverlay == false){
		   if($('#tariffNumber').val()!=values[0])
			   deleteChargesBeforeSaving=true;
			  // deleteAllCharges($('#tariffNumber'));
		   $('#tariffNumber').val(values[0]);
		   $('#tariffCheck').val(values[0]);
		   clearDataForTariffNumber(values[0],tariffNumber);
		   tariffNumber =  $('#tariffNumber').val();
		  // makeChargeGrid(true);
	 }else{
		  	$('#SOURCE_TARIFF').val(values[0]);
		  	
		  	$('#GROUP_NAME').val("");
		  	$('#ITEM_NAME').val("");
		  	
			if($('#GROUP_TYPE').val()=="01"){
				 $('#GROUP_NAME').val(values[0]);
			 }
	 }
	   
  	
}

function setItemName(val){
	$('#ITEM_NAME').val(val);
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#GROUP_NAME').val(values[0]);
  	
  	$('#ITEM_NAME').val("");
}
function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	if(doesItemOverlay == true){
		$('#ITEM_NAME').val(values[0]);	
	}else{
		if($('#itemNumber').val()!=values[0])
			deleteChargesBeforeSaving=true;
			//deleteAllCharges($('#itemNumber'));
		$('#itemNumber').val(values[0]);	
		//makeChargeGrid(true);
	}
	getPrimaryCommodity($('#tariffNumber').val(), $('#itemNumber').val().trim());		  	
  	$("#note").val("");
	 
	
/*//	var validComb= validateCombforMandatoryFiels();
//	if(! validComb){
//		$("input[type=button][value=Search]").attr("disabled","disabled");
//		$('#rate_add').attr("disabled","disabled");
//	}else{
//		$("input[type=button][value=Search]").removeAttr("disabled");
//		$('#rate_add').removeAttr("disabled");
//	}
*/	
	}


function addAccesorialCharge(){
	
	var id = 1;
	
	var length = jQuery("#accesrialChargeGrid input:checked").length;
	
	if( length > 1){
		alert(" Please Select only one Accesorial Charge");
		return false;
	}
	
	if(length == 0) {
		alert(" Please Select one Accesorial Charge");
		return false;
	}
	
	jQuery("#accesrialChargeGrid input:checked").each(function(  ) {
		 id =  $( this ).parent().parent().attr('id');
	});
	
	var noOfUnit = "#"+id+"_numberOfUnits";
	var value = $(noOfUnit).val();
    var idArray = id +":"+value + ",";
	
    console.log("acc selected id="+idArray);
    if(parseInt(value) == NaN || parseInt(value) < parseInt(0)){
   	 	alert(" Please enter valid number of units");
   	 	return false;
    }
    
	 
	 $.ajax({
			type : "POST",
			async:false,
			url : _context + "/maintainRate/calculateAccesorialCharges?idArray="+idArray,
			success : function(responseText) {
				//$("#accesrialChargeGrid").trigger('reloadGrid');	
				$.ajax({
					type : "POST",
					url : _context + "/maintainRate/addAccesorialCharges?selectedCharge="+id,
					success : function(responseText) {
						if (responseText.success == true) {
							reloadCommodityGridsForMaintainRate();
							$("#commodityDescPage").dialog('close');
						} else {
							showResponseMessages("msgDiv", responseText);
							$("#commodityDescPage").dialog('close');
						}
						
					}
				});
			}
		});
	 
	 
	 
     
	 
	
	
}

function calculateAccesorialChargeAmount(idArray){
//	var length = jQuery("#accesrialChargeGrid").jqGrid('getGridParam','selarrrow').length;
//	if( length == 0){
//		alert(" Please Select atleast one Accesorial Charge");
//		return false;
//	}
//	
//	var containerArr = jQuery("#accesrialChargeGrid").jqGrid('getGridParam','selarrrow');
//	var idArray = "";
//	 for(var i=0; i<length;i++){
//	     var id = jQuery("#accesrialChargeGrid").jqGrid('getCell', containerArr[i], 'id');
//	     var noOfUnit = jQuery("#accesrialChargeGrid").jqGrid('getCell', containerArr[i], 'numberOfUnits');
//	    idArray += id +":"+noOfUnit + ",";
//	 }
	
	//saving the selected rows ids
	var id = jQuery("#accesrialChargeGrid").jqGrid('getGridParam','selrow');
	if(isNumeric(id+""))
		selectedId = id;
	
	$.ajax({
		type : "POST",
		async:false,
		url : _context + "/maintainRate/calculateAccesorialCharges?idArray="+idArray,
		success : function(responseText) {
				
			if (responseText.messages.error.length == 0) {
				$("#accesrialChargeGrid").trigger('reloadGrid');
				return true;
			}
		}
	});
	
}

function clearOverlayGrid(){
	$.ajax({
		type : "POST",
		url : _context + "/maintainRate/clearAccesorialCharges",
		success : function(responseText) {
			if (responseText.success == true) {
				$("#accesrialChargeGrid").trigger('reloadGrid');
			}
		}
	});
}

function disableActionButtons() {	
	//against D019871
	//$('#shpChargeCancelBtn').attr('disabled', true);
	$('#shpChargeSaveBtn').attr('disabled', true);
	$('#shpChargeHoldReleaseBtn').attr('disabled', true);
	$('#shpChargeBillBtn').attr('disabled', true);
	$('#shpChargeReleaseAuditBtn').attr('disabled', true);
	$('#shpChargeCorrectionsBtn').attr('disabled', true);
	$('#shpChargePayablesBtn').attr('disabled', true);
	$('#shpChargeStatusBtn').attr('disabled', true);
	$('#shpChargeSendDocBtn').attr('disabled', true);
	$('#shpChargeTraceBtn').attr('disabled', true);
	$('#shipmentHoldReleaseBtn').attr('disabled', true);
	$('#maintainBill').attr('disabled', true);
}


function enableActionButtons() {	
	//against D019871
	//$('#shpChargeCancelBtn').attr('disabled', false);
	$('#shpChargeSaveBtn').attr('disabled', false);
	$('#shpChargeHoldReleaseBtn').attr('disabled', false);
	$('#shpChargeBillBtn').attr('disabled', false);
	//$('#shpChargeReleaseAuditBtn').attr('disabled', false);
	$('#shpChargeCorrectionsBtn').attr('disabled', false);
	$('#shpChargePayablesBtn').attr('disabled', false);
	$('#shpChargeStatusBtn').attr('disabled', false);
	$('#shpChargeSendDocBtn').attr('disabled', false);
	$('#shpChargeTraceBtn').attr('disabled', false);
	$('#maintainBill').attr('disabled', false);
}
//added against D032209
function disableTextBoxes(){
	document.getElementById('itemNumber').disabled=true;
	//for 23268 in case of multiple commodities lines
	if($('#sizeOfItem').val()<2 || $('#sizeOfItem').val()==""){
		document.getElementById('codeOfCommodity').disabled=true;
		document.getElementById('previousCommodity').disabled=true;
		document.getElementById('nextCommodity').disabled=true;
	}
	document.getElementById('containerCommodityDesc').disabled=true;
	document.getElementById('tariffNumber').disabled=true;
	document.getElementById('commodityDesc').disabled=true;
	document.getElementById('commodityCode').disabled=true;
	document.getElementById('note').disabled=true;
		
}
//added against D032209
function enableTextBoxes(){
	document.getElementById('itemNumber').disabled=false;
	document.getElementById('codeOfCommodity').disabled=false;
	document.getElementById('containerCommodityDesc').disabled=false;
	document.getElementById('tariffNumber').disabled=false;
	document.getElementById('commodityDesc').disabled=false;
	document.getElementById('commodityCode').disabled=false;
	document.getElementById('note').disabled=false;
	//document.getElementById('previousCommodity').disabled=false;
	//document.getElementById('nextCommodity').disabled=false;
	
}


function commodityUpdate(id){
	var values= id.split("|");
	if($("#commodityDesc").val()!=values[1])
		deleteChargesBeforeSaving=true;
		//deleteAllCharges($("#commodityDesc"));
	

	if(values[1] != null && values[1] == "**NPC**"){
		alert("NO PRIMARY COMMODITY FOUND");
	}else{
		$("#commodityDesc").val(values[1]);
		$("#commodityDesc").val(values[1]);	
	}
	
	$("#tariffNumber").val(values[3]);
	$("#tariffCheck").val(values[3]);
	$("#itemNumber").val(values[4]);
	
	returnCommodityCode(values);
	if ($.trim(values[6])!='undefined' && $.trim(values[6])!=null && $.trim(values[6])!='' && $.trim(values[6])!='null') {
		
		$('#note').removeAttr("disabled");
	} else {
		$('#note').attr("disabled", true);
	}
	//makeChargeGrid(true);
	somethingChanged= true;
//	var commodityCode = returnCommodityCode(values);
//	$("#commodityCode").val(commodityCode);
	
}	 

function returnCommodityCode(values){
	queryString = "descType="+values[0]+
	              "&commodityId="+values[9]+
	              "&itemId="+values[11];
	 $.ajax({
		 type:"GET",
		 url:_context+"/maintainRate/returnCommodityCode",
		 data: {descType:values[0], commodityId:values[9],itemId:values[11]},
		 success:function(responseText){
			 if (responseText.messages.error.length == 0) {
				 	$('#commodityCode option').remove();
				 	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
					$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = null;
					var commodityCodeOption='';
					$.each(responseText.data, function(index,codeDescription) {

						$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
						commodityCodeOption=commodityCodeOption+codeDescription.description+":"+codeDescription.code+";";

					});
					$('select[id*="commodityCode"]').attr("selectedIndex",0);

					if(responseText.data.length==0){
						getPrimaryCommodity($('#tariffNumber').val(), $('#itemNumber').val().trim());
					}else if(responseText.data.length==1){
						$('#commodityCode').val(responseText.data[0].code);
					}
					
					if(responseText.data.length > 1){
						alert(" Please Select One Commodity Code");
					}

			 }
		 }
		 
	 });
}


function populateCommodityCodeList(list){
	//alert("populateCommodityCodeList: "+ list.length);
	$('select[name="commodityCode"]').children().remove().end().append('<option selected value="">Select</option>');
	for ( var i = 0; i < list.length; i++) {
		$('select[name="commodityCode"]')
		.append($("<option/>", {
			value : list[i].code,
			text : list[i].code + " - " +list[i].description
		}));
	}
	
	if(list.length==1){
		$('#commodityCode').val(list[0].code);
	}
}


function confirmMessage(){
	if(doesChange == true){
		var r= confirm("Changes done have not been saved. Do you wish to continue Y or N ?");
		if(r ==  true){
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
	
}


function resetTariffDetails(itemId,itemName){
	$('#commodityDesc').val('');
	
	$('#note').val('');
	
}


function clearCommodityCodeList(){
	
	$('#commodityCode option').remove();
	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
}

function populateCommodityCode(list){
	$('#commodityCode option').remove();
	$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = null;
	var commodityCodeOption='';
	$.each(list, function(index,codeDescription) {

		$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
		commodityCodeOption=commodityCodeOption+codeDescription.description+":"+codeDescription.code+";";

	});
	
	//$('select[id*="commodityCode"]').attr("selectedIndex",0);
	
}


//function concludeRating(id)
//{		
////	$('#re_choice_dialog').dialog( "close" );
//	
//	blockUI();
//	$.ajax({
//		   type: "POST",				   							   
//		   url: _context +  "/maintainRate/concludeRating?id="+id,
//		   success: function(responseText){		
//			   $.unblockUI();
//			   if (responseText.data.rateView == "showError") {						
//					$('#re_error_dialog').dialog('open');
//					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//					$("#ratingErrorForm").loadJSON(responseText.data);
//					$('#shipmentNumOverLay').val(responseText.data.ratingError.shipmentNumber);
//					$('#statusCodeOverlay').val(responseText.data.ratingError.statusCode);
//					
//					$('#unitOfMeasureSourceOverLay').val(responseText.data.ratingError.unitOfMeasureSourceCode);
//					$('#loadServicesOverLay').val(responseText.data.ratingError.loadServiceCodeRE);
//					$('#routingDetOverLay').val(responseText.data.ratingError.routingDetailsRE);
//					$('#dischargeServicesOverlay').val(responseText.data.ratingError.dischargeServiceCodeRE);
//					$("#reErrorGrid").trigger('reloadGrid');
////					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
//				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//					$('#reErrContinueBtn').hide();
//				}else if(responseText.data.rateView == "showChoices"){
//					$('#re_choice_dialog').dialog('open');
//					$("#ratingChoiceForm").loadJSON(responseText.data);
//					$("#reChoiceGrid").trigger('reloadGrid');
////					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
////					if(responseText.data.isAllChoicesUnSelectable != null 
////							&& responseText.data.isAllChoicesUnSelectable == "Y"){
////						$('#reChoiceCloseBtn').hide();	
////						$('#reChoiceContinueBtn').show();
////					}else{
////						$('#reChoiceCloseBtn').show();	
////						$('#reChoiceContinueBtn').hide();	
////					}											
//				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//				}else if(responseText.data.rateView == "showWarning"){
//											
//					$('#re_error_dialog').dialog('open');
//					$("#ratingErrorForm").loadJSON(responseText.data);
////					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
//					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//					$('#reErrCloseBtn').hide();
//					$('#shipmentForm').loadJSON(responseText.data);
//					showResponseMessages("msgDiv", responseText);
//				}
//				else {
//					$('#shipmentForm').loadJSON(responseText.data);
//					$("#statusCode").html(responseText.data.header.statusCode);
//					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
//					showResponseMessages("msgDiv", responseText);
//				}	
//			   
//		   }
//	});	
//}

function getPrimaryCommodity(tariffNo, itemNo){
	var blOriginCityCode = $('#blOriginCityCode').val();
	var blDestinationCityCode = $('#blDestinationCityCode').val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var loadSrvc = $("#loadServiceCode").val();
	var dischargeSrvc = $("#dischargeServiceCode").val();
	var trade = $('#tradeCode').val();
	var estShipDate = "";
	/*if($('#freightReceivedDate').val()!="" && $('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null"){
		estShipDate = $('#freightReceivedDate').val();
	}*/
	if($('#rateDate').val()!="" && $('#rateDate').val()!=null && $('#rateDate').val()!="null"){
		estShipDate = $('#rateDate').val();
	}
	
	//var tariffNo = $("#tariff").val();
	//var itemNo = $("#tariffItemNumber").val();
	
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	
	$.ajax({
		url: urlComm,
		type: "POST",
		success: function(responseText){
			//alert("commodityNotFound: " + responseText[0].commodityNotFound);
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					$('#msgDiv').html('');
					$('#msgDiv').hide();
					$("#commodityDesc").val(responseText[0].desc);
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
									frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									$('#commodityCode option').remove();
								 	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
									$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = null;
									var commodityCodeOption='';
									$.each(responseText.data, function(index,codeDescription) {

										$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
										commodityCodeOption=commodityCodeOption+codeDescription.description+":"+codeDescription.code+";";

									});
									$('select[id*="commodityCode"]').attr("selectedIndex",0);

									if(commCode==1){

										//TODO
										$("#commodityCode").val(responseText.data[0].code);
									}
								}
							}
						});
					}
					
					if ($.trim(responseText[0].noterate)!=null && $.trim(responseText[0].noterate)!='') {
						
						$('#note').removeAttr("disabled");
					} else {
						$('#note').attr("disabled", true);
					}
					
					
				}
				else{
					$('#msgDivCommodity').show();
					//$('#msgDivCommodity').html('<div class="message_error">Commodity code description is not found.</div>');
					resetMandatoryTariffCmdDesc();
					/*setMandatoryTariffItem();*/
					$("#commodityDesc").val("");
					// displaying more specific error message if available as per D025670
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodity').html('<div class="message_error">Commodity Code/Description not found for Tariff Item.</div>');		
					}else
					if(responseText[0].errmsg)
						$('#msgDivCommodity').html('<div class="message_error">'+responseText[0].errmsg+'</div>');
					else
						$('#msgDivCommodity').html('<div class="message_error">Invalid combination of data to satisfy the Tariffs edit condition.</div>');

				}
			}
		}
	});
}

function resetMandatoryTariffCmdDesc(){
	// Tariff Commodity Desc
	$("#tariffCmdDescLbl").html("Tariff Commodity Desc");
	$("#tariffCommodityDescription").removeClass("validate[required]");
	
	resetMandatoryTariffItem();
	
	// Commodity Code
	//$("#commodityCodeLbl").html("Com. Code");
	//$("#commodityCode").removeClass("validate[required]");
}

function setMandatoryTariffItem(){
	// Tariff
	//$("#tariffLbl").html("Tariff<span class=\"mandatory\">*</span>");
	$("#tariffNumber").addClass("validate[required]");
	
	// Item
//	$("#itemLbl").html("Item<span class=\"mandatory\">*</span>");
	$("#itemNumber").addClass("validate[required]");
}

function resetMandatoryTariffItem(){
	// Tariff
//	$("#tariffLbl").html("Tariff");
	$("#tariffNumber").removeClass("validate[required]");
	
	// Item
	//$("#itemLbl").html("Item");
	$("#itemNumber").removeClass("validate[required]");
}
//on click of cancel button
function cancelFunc()
{
	
				   		var hyperLink=$('#navigationUrl').val();
				   		var shipmentNumber1=$('#shipmentNumber').val();
				   		var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
				   		var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
				   		var firstPage = $(document).getUrlParam("firstPage");
				   		
				   		if(hyperLink=="2"||hyperLink==2 || hyperLink=="shipment")
				   		{
				   			document.location.href=_context+"/shipment/showForm?firstPage="+firstPage;//?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=mrbl";
				   		}else if(hyperLink=="HHGS"){
				   			var url = "/houseHoldShipment/showForm?";
							window.location = _context + url;
				   		}
				   		else if(hyperLink=="maintainRate")
				   		{
				   			document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=mrbl&firstPage="+firstPage;
				   		}
				   		else if (hyperLink=="billLadingPayable"){
				   			
				   			document.location.href=_context+"/billLadingPayable/find?shipmentNumber="+shipmentNumber1+
				   											"&shipmentSequenceNumber="+shipmentSequenceNumber1+
				   											"&shipmentCorrectionNumber="+shipmentCorrectionNumber1+
				   											"&navigationUrl=maintainRate&firstPage="+firstPage;
				   			
				   		}else if (hyperLink=="billingSetup" || firstPage == "BLSP"){
				   			// D032389, added firstPage
				   			document.location.href = _context+ "/billingSetup/loadBillSetUpDetail?shipmentNumber="+ 
				   			shipmentNumber1+"&shipmentSequenceNumber="+shipmentSequenceNumber1;
			   			}else if (hyperLink=="printFreightBill"){
				   			document.location.href=_context+"/printFreightBill/go?shipmentNumber="+shipmentNumber1+
							"&shipmentSequenceNumber="+shipmentSequenceNumber1+
							"&shipmentCorrectionNumber="+shipmentCorrectionNumber1;
			   			}
				   		else if ( hyperLink=="FTWQ"){
			   				document.location.href=_context+"/cas/bookBillWorkQueueSearch.do";
			   			}
				   		else
				   		{
				   			document.location.href=_context;
				   		}
							
}var chargeCode=null;

//function on click of maintain bill button

function maintainBillScreen()
{
		var shipmentNumber1=$('#shipmentNumber').val();
		var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
		var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
	
				   		document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ";
							
}
function makeChargeGrid(doesEditable){
	var colNamesForMaintainChargeGrid = ['shipmentChargeId','','Charge','Units','Rate', 'Rate Basis', 'Amount','P/C','Level','User','Last Update','TXN',''];

	var colModelForMaintainChargeGrid = [
	                                        {name:'shipmentChargeId',index:'shipmentChargeId', editable:false, hidden:true},
	                                        {name:'descriptionOfChargeCode',index:'descriptionOfChargeCode',width:50, editable:false, hidden:true},
		                                    {name:'chargeCode', index:'chargeCode', width:40,editable:true,edittype:'select',editoptions: {size:1,dataUrl:_context+'/maintainRate/loadChargeType'},
	                                        	editrules:{required:true},
	                                        	editable:true,
	                                        	cellattr: function (rowId, val, rawObj, cm, rdata)
	                                        	{
		                                    
		                                    
	                                        	return 'title="' +' ' + rawObj.descriptionOfChargeCode + '"';
	                                        	}
		                                    } ,
		                                        
			                                        /*{name:'chargeCode', index:'chargeCode', width:50,editable:true,edittype:'select',editoptions: getChargeTypeCode,
		                                        	editrules:{required:true},
		                                        	editable:true,formatter:'select' } ,*/
	                                        {name:'numberOfUnit',index:'numberOfUnit',width:50, editable:true, formatter:'number',formatoptions: {thousandsSeparator:',', decimalPlaces: 0,defaultValue:''}},
	                                        {name:'rate', index:'rate', width:50, editable:true,required:true, align:'right', 
	                                        	formatter:'currency',
												editrules:{custom : true,
													custom_func : function (value, colname) {
                                                        $("#rate").val($("#rate").val().replace('$','').replace(/,/g , ""));                                                                                               
														console.info(value+" " +value);
														function isNumber(n) {
														  return !isNaN(parseFloat(n)) && isFinite(n);
														}
														if($("#rate").val()=='' || isNumber($("#rate").val()) ){
															if(value.indexOf('.') != -1 && value.length-value.indexOf('.') > 3){
																return [false,'More than 2 decimal places not allowed']
															}else{
																return [true,''];
															}
														}else
															return [false, 'Not a currency'];														
															
													}
												},
												editoptions: {
													dataEvents: [
													{  type: 'change',
							                         fn: function(e) {
							                        	 var val=e.target.value;
														 console.info("In change " +val);
							                        	 e.target.value=val.replace('$','').replace(/,/g , "").trim();
							                         }
							                      }
							                   ]},
                                    			formatoptions: { prefix: '$',thousandsSeparator:',', defaultValue:''}},
	                                        {name:'rateBasisCode', index:'rateBasisCode', width:75, edittype:'select', editoptions:{dataUrl:_context+'/maintainRate/loadRateBasis'},editrules:{required:true},editable:true},
	                                        {name:'shipmentChargeAmount', index:'shipmentChargeAmount', width:50, editable: false, align:'right', formatter:'currency',formatoptions: {prefix: '$', thousandsSeparator:',', defaultValue:''}},
	                                        //{name:'responsiblePartyCode', index:'responsiblePartyCode', width:30, editable: true,edittype:'select',editoptions:{value:"P:P;C:C"}},
	                     	                {name:'responsiblePartyCode', width:30, editable:false,
	                    	            	    formatter : 'showlink',
	                    		   					formatoptions : {
	                    			   					baseLinkUrl : "javascript:",
	                    			   					showAction : "responsiblePartyCodeClick('",
	                    			   					addParam: "');"
	                    		   					}
	                    	                },
	                                        {name:'processLevelCode', index:'processLevelCode', width:30, editable: false },
	                                        {name:'lastUpdateUser', index:'lastUpdateUser', width:55, editable: false },
	                                        {name:'showLastUpdateDateTime', index:'showLastUpdateDateTime', width:90, editable: false },
	                                        {name:'txnType', index:'txnType', width:55, editable: false },
	                                        {name:'actions', width:50, formatter:'actions',
	                                        		formatoptions:{keys:true,editbutton:true, delbutton:true,
	                                        			onEdit:function(rowid){
	                                        				$("div.ui-pg-div.ui-inline-del","#gbox_chargeGrid").css("visibility", 'hidden');
	                                        				doesChange=true;
	                                        				
	                                        				
	                                        			},
	                                        			afterSave:funcReload
	                                        		}}



	                                        							         			                            	   
								   ];
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "shipmentChargeId"
		};

	createGrid(
			"chargeGrid", // grid id for user
			"pagerChargeGrid", // page id for user
			'/gates/maintainRate/loadCharges',  //get url
			'/gates/maintainRate/addCharge', //add url
			'/gates/maintainRate/editCharge', //edit url
			'/gates/maintainRate/deleteCharge', //delete url
			'/gates/maintainRate/deleteCharge', // delete multi select url //for 22002 multidelete
			colNamesForMaintainChargeGrid, 
			colModelForMaintainChargeGrid, 
			"Shipment Item Charges",
			"auto",
			10,
			[10,20,30],
			true,
			!isBLRTDelete?false:true,

			false, //load once
			doesEditable, jsonReaderSpSvc,isBLRTUpdate?false:true,true,true,true,true,false,false,false,onCompletion,false,false);
	
	if(doesEditable){
		$("div.ui-pg-div.ui-inline-del","#gbox_chargeGrid").hide();
		$('#del_chargeGrid').hide();
		$("div.ui-pg-div.ui-inline-edit","#gbox_chargeGrid").hide();
		$("div.ui-pg-div.ui-inline-add","#gbox_chargeGrid").hide();
		$("#accChargesId").attr("style","display:none");
		$("#sData", "#gbox_chargeGrid").hide();
	}
}

function funcReload(){
	doesChange=true;
	//ajax call to calcualte charges at bottom and sort the list of charges
caluclateTotalCharges();
isAnyChangeInGrid();
//reloadGridFunc();
}

//D023524 - On click of link save the value to session 
//D026411
//D026596
function responsiblePartyCodeClick(id){
	if($('#prepaidCollectIndicatorCode').val()=="B" && $('#statusCode').text() != "CORRECTED" && $('#statusCode').text()!="ISSUED"){
		var rowId = id.split('=')[1];
		var responsiblePartyCode = $('#chargeGrid').getCell(rowId,'responsiblePartyCode');
		var newResponsiblePartyCode;
		if(responsiblePartyCode == 'C'){
			newResponsiblePartyCode = "P";
		} else{
			newResponsiblePartyCode = "C";
		}
		$.ajax({
			type : "POST",
			async:false,
			data:{responsiblePartyCode : newResponsiblePartyCode, rowId : rowId},
			url : _context + "/maintainRate/editResponsiblePartyCode",
			success : function(responseText) {
				$('#chargeGrid').setCell(rowId,'responsiblePartyCode',newResponsiblePartyCode);
				doesChange=true;
				//D026347
				isAnyChangeInGrid();
			}
		});
	}
}


//against D019888 for currency formatter
function currencyFmatter(cellvalue) {
	if(cellvalue!=undefined && cellvalue!=null){
	var DecimalSeparator = "."; //Number("1.2").toLocaleString().substr(1,1);

	var AmountWithCommas = cellvalue.toLocaleString();
	var arParts = String(AmountWithCommas).split(DecimalSeparator);
	var intPart = arParts[0];
	var decPart = (arParts.length > 1 ? arParts[1] : '');
	decPart = (decPart + '00').substr(0,2);

	return '$' + intPart + DecimalSeparator + decPart;
	}
	}

function reloadGridFunc()
{
	$("#chargeGrid").trigger('reloadGrid');
}
function caluclateTotalCharges()
{
	var queryString = getQueryString();
	$.ajax({
			type : "POST",
			url : _context + "/maintainRate/loadTotalCharges",
			data : 	queryString,
			success : function(responseText) {
				var totalCommodityCharges=responseText.data.totalCommodityCharges;
				totalCommodityCharges2=currencyFmatter(totalCommodityCharges);
				
				var totalShipmentCharges=responseText.data.totalShipmentCharges;
				totalShipmentCharges2=currencyFmatter(totalShipmentCharges);
				
				if(totalShipmentCharges!=null)
					$("#shipmentCharges").html(totalShipmentCharges2);
				else
					$('#shipmentCharges').html("$0.00");
				
				if(totalCommodityCharges!=null)
					$('#commodityCharges').html(totalCommodityCharges2);
				else
					$('#commodityCharges').html("$0.00");
				
				//$("#payableCharges").html("$" +responseText.data.totalPayableCharges);
				//added against D19888
				var payableCharges=responseText.data.totalPayableCharges;
				payableCharges2=currencyFmatter(payableCharges);
				if(payableCharges!=null)
					$("#payableCharges").html(payableCharges2);
				else
					$("#payableCharges").html("$0.00");
				//isGridReloaded=true;//for 24239 to prevent reload when editing multiple charges
				//reloadGridFunc();// for 24239 to prevent reload when editing multiple charges
			}
	});
}

function setCommodityCodeFinal(commDescId){
	
//	 var dscr = $("#commodityDesc").val();
//		var tariffNo = $("#tariffNumber").val();
//		var itemNo =$("#itemNumber").val();
//		var estShipDate = "";
//		if($('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null" && $('#freightReceivedDate').val()!=""){
//			estShipDate = $('#freightReceivedDate').val();
//		}
//		var loadSrvc = $("#loadServiceCode").val();
//		var dischargeSrvc =  $("#dischargeServiceCode").val();
//		var trade = $('#tradeCode').val();
//		var blOriginCityCode = $('#blOriginCityCode').val();
//		var originPortCityCode =  $('#originPortCityCode').val();
//		var destinationPortCityCode =  $('#destinationPortCityCode').val();
//		var blDestinationCityCode =  $('#blDestinationCityCode').val();
//
//	
//	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
//	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
//	+'|'+trade+'|'+tariffNo+'|'+itemNo;
//	//alert(urlComm);
//	$.ajax({
//		async: false,
//		url: urlComm,
//		type: "POST",
//		success: function(responseText){
//			if(responseText!=null){
//				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
//					/*$('#msgDivFrt').html('');
//					$('#msgDivFrt').hide();*/
////					$("#commodityDesc").val(responseText[0].desc);
//					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
//					/*$("#frtGrpId").val(responseText[0].grpid);
//					$("#frtItemId").val(responseText[0].itemid);*/
//					
//					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:commDescId},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									$('#commodityCode option').remove();
								 	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
									$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = null;
									var commodityCodeOption='';
									$.each(responseText.data, function(index,codeDescription) {

										$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
										commodityCodeOption=commodityCodeOption+codeDescription.description+":"+codeDescription.code+";";

									});
									$('select[id*="commodityCode"]').attr("selectedIndex",0);

//									if(commCode==1){
//
//										//TODO
//										$("#commodityCode").val(responseText.data[0].code);
//									}
								}
							}
						});
//					}
//				}
//					
//			}
//		}
//	});
}


function setCommodityCode(descId){
	
	 var dscr = $("#commodityDesc").val();
		var tariffNo = $("#tariffNumber").val();
		var itemNo =$("#itemNumber").val();
		var estShipDate = "";
		/*if($('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null" && $('#freightReceivedDate').val()!=""){
			estShipDate = $('#freightReceivedDate').val();
		}*/
		if($('#rateDate').val()!="" && $('#rateDate').val()!=null && $('#rateDate').val()!="null"){
			estShipDate = $('#rateDate').val();
		}
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc =  $("#dischargeServiceCode").val();
		var trade = $('#tradeCode').val();
		var blOriginCityCode = $('#blOriginCityCode').val();
		var originPortCityCode =  $('#originPortCityCode').val();
		var destinationPortCityCode =  $('#destinationPortCityCode').val();
		var blDestinationCityCode =  $('#blDestinationCityCode').val();

	
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
//				if(responseText[0].commodityNotFoud=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					
					primaryCommodityDescription=responseText[0].desc;
						//$("#commodityDesc").val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
//					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
					
					// 17614- to select primary comm code when secondary comm without comm code is selected
					if(descId==0 || descId==null || descId==""){
						getPrimaryTariffItemCommodityDescriptionId();
						descId= primaryTariffItemCommodityDescriptionId;
					}
					 
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:descId,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									$('#commodityCode option').remove();
								 	$('#commodityCode').append('<option value="" selected="selected">Select</option>');
									$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = null;
									var commodityCodeOption='';
									$.each(responseText.data, function(index,codeDescription) {

										$("#commodityCode").get(0).options[$("#commodityCode").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
										commodityCodeOption=commodityCodeOption+codeDescription.description+":"+codeDescription.code+";";

									});
									$('select[id*="commodityCode"]').attr("selectedIndex",0);

//									if(commCode==1){
//
//										//TODO
//										$("#commodityCode").val(responseText.data[0].code);
//									}
								}
							}
						});
//					}
//				}
					
			}
		}
	});
}
//for 22735
function disableGridActionButtons(){
	if($('#statusCode').text()=="CORRECTED" || $('#statusCode').text()=="ISSUED"){
		$("div[id=gbox_chargeGrid] #sData").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-del","#gbox_chargeGrid").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-edit","#gbox_chargeGrid").css("visibility", 'hidden');	
		$('#del_chargeGrid').hide();
		$("#cb_chargeGrid").attr('disabled',true);
		$("[id^=jqg_chargeGrid]").attr('disabled',true);
	}
}



//23418- accessorial charge grid- automatic selection of unit text box on row selection
$('.cbox','#accesrialChargeGrid').live('click', function(evt) {
	id=this.id;
	//alert("id is"+id);
	
	$("#"+id).parent().parent().children()[4].click();	
});


//
$('#accesrialChargeGrid input').live('mouseup', function(evt) {
	evt.preventDefault();
	    $(this).select();	    
});

$('#accesrialChargeGrid input').live('focus', function(evt) {
	//evt.preventDefault();
	    $(this).select();	    
});



	

// 17614-when there is no charge code associated with secondary commodity desc then commodity code to be displayed of primary
function getPrimaryTariffItemCommodityDescriptionId() {
	tariffNumber=$('#tariffNumber').val();
	itemNumber=$('#itemNumber').val();
	primaryCommodityDesc=primaryCommodityDescription;
	
		$.ajax({
			async: false,
			type : "POST",
			url :  _context + '/maintainRate/getPrimaryTariffItemCommodityDescriptionId',
			data : {	tariffNumber:tariffNumber,
				itemNumber:itemNumber,
				primaryCommodityDesc:primaryCommodityDesc
			},
			success : function(responseText) {
				primaryTariffItemCommodityDescriptionId=responseText.data;
			}			
		});
	}




/*function getFirstAuditReleaseDetail(){
	shipmentNumber=$('#shipmentNumber').val();
	shipmentSequenceNumber=$('#shipmentSequenceNumber').val();
	shipmentCorrectionNumber=$('#shipmentCorrectionNumber').val();
	if(shipmentCorrectionNumber==null || shipmentCorrectionNumber==""){
		shipmentCorrectionNumber="000";
	}
	$.ajax({
		url: _context+"/maintainRate/getFirstReleaseAuditDetail",
		async: false,
		type : "POST",
		data:{shipmentNumber:shipmentNumber,
			shipmentSequenceNumber:shipmentSequenceNumber,
			shipmentCorrectionNumber:shipmentCorrectionNumber
		},
		success: function(responseText){
			if(responseText!=null){
				if(responseText.data.length>0)
				firstAuditDetailsToolTipText=responseText.data[0][0]+"-"+responseText.data[0][1];
				else
				firstAuditDetailsToolTipText="";
			}else{
				firstAuditDetailsToolTipText="";
			}
		}
	});
}*/
function enableDisablePreviousAndNextButton(){
		document.getElementById('codeOfCommodity').disabled=false;
		if($('#sizeOfItem').val() <= 1){
			$('#nextCommodity').attr("disabled", true);
			$('#previousCommodity').attr("disabled", true);
		}else if($('#codeOfCommodity').val()==$('#sizeOfItem').val()){
			$('#nextCommodity').attr("disabled", true);
			$('#previousCommodity').attr("disabled", false);
		}else if($('#codeOfCommodity').val()==1){
			$('#nextCommodity').attr("disabled", false);
			$('#previousCommodity').attr("disabled", true);
		}else{
			$('#nextCommodity').attr("disabled", false);
			$('#previousCommodity').attr("disabled", false);
		}
	}
//post-submit callback
function showResponseMessages(msgDivId, responseText) {
	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {

				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		//D032210 - Scroll to the top only if there is any error
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			if (messages.error.length > 0 || messages.warn.length > 0){
				window.scrollTo(0, 0);
			}
		}
	}
}
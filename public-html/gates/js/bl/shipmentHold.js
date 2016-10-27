//added against 21739
//var changeInHoldGrid=false;
function createHoldGrid(entityName) {
	
	$("#entityName").val(entityName);
	//D023187
	if(entityName=='houseHoldShipment')
	{
	isHoldManualDelete=false;
	}
	var holdColNames = ['Id', 'Hold Code', 'Message', 'Placed','Released','Last Updated'];
	var holdColModels = [
	               {name:'holdSeqNo', index:'holdSeqNo', hidden:true},
	               {name:'holdCode', index:'holdCode', width:42, editable:true, formatter:(isHoldManualUpdate==true?'showlink': 'formatLink'), formatoptions : {
          				baseLinkUrl : "javascript:",
        				showAction: "editHold('",
        				addParam: "');" }
                    },
	               {name:'note', index:'note', width:200, editable:true},
	               {name:'placed', index:'placed', width:150, editable:false},
	               {name:'released', index:'released', width:150, editable:false},
	               {name:'lastUpdated', index:'lastUpdated', width:150, editable:false}
			   	];
			jQuery.extend($.fn.fmatter,
			{
				formatLink : function(cellvalue,
						options, rowdata) {
						return cellvalue;
				}
				});
				
	var holdHHGDSColNames = ['Id','Seq', 'Hold Code', 'Message', 'Placed','Released','Last Updated'];
	var holdHHGDSColModels = [
			               {name:'holdSeqNo', index:'holdSeqNo', hidden:true},
			               {name:'shipmentSeqNumberHHGDS', index:'shipmentSeqNumberHHGDS', width:42, editable:false},
			               {name:'holdCode', index:'holdCode', width:42, editable:true, formatter:(isHoldManualUpdate==true?'showlink': 'formatLink'), formatoptions : {
		          				baseLinkUrl : "javascript:",
		        				showAction: "editHold('",
		        				addParam: "');" }
		                    },
			               {name:'note', index:'note', width:200, editable:true},
			               {name:'placed', index:'placed', width:150, editable:false},
			               {name:'released', index:'released', width:150, editable:false},
			               {name:'lastUpdated', index:'lastUpdated', width:150, editable:false}
					   	];
					jQuery.extend($.fn.fmatter,
					{
						formatLink : function(cellvalue,
								options, rowdata) {
								return cellvalue;
						}
						});
	var jsonReaderHold = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"holdSeqNo"
		};
	if(entityName=='houseHoldShipment')
		{
		createGrid(
				"holdGrid", // grid id for user
				"holdPager", // page id for user
				_context+'/shipment/hold/load?entityName='+entityName, 
				'', 
				'', 
				'', 
				_context+'/shipment/hold/delete?entityName='+entityName,
				holdHHGDSColNames, 
				holdHHGDSColModels, 
				"Hold",

				"auto", 6, [ 6,  12,  18], true, isHoldManualDelete, false, false,
				jsonReaderHold, true, true, true, true, true, false, false, false, holdGridLoadComplete, false, true);
		}else{
			createGrid(
			"holdGrid", // grid id for user
			"holdPager", // page id for user
			_context+'/shipment/hold/load?entityName='+entityName, 
			'', 
			'', 
			'', 
			_context+'/shipment/hold/delete?entityName='+entityName,
			holdColNames, 
			holdColModels, 
			"Hold",

			"auto", 6, [ 6,  12,  18], true, isHoldManualDelete, false, false,
			jsonReaderHold, true, true, true, true, true, false, false, false, holdGridLoadComplete, false, true);
		}
	
	 $("#holdDialog").dialog({autoOpen: false ,width:970, height:200, modal: true
		    , buttons: {
		         Cancel:function(){
		            	$(this).dialog("close"); 
		            	tabSequence('#shipmentForm',true,false);
		          },
		          Ok:function(){
		        	  if (!$("#holdForm").validationEngine('validate')) {
			        		return;
		        	  }
		        	  
		        	  var dataUrl = _context+"/shipment/hold/add?entityName="+entityName;
			          if($("#isHoldAdd").val()=="false"){
			        	dataUrl = _context+"/shipment/hold/update?entityName="+entityName;
			          }
			          //alert(dataUrl+":::"+"&trade="+$('#tradeCode').val()+"&loadDschServiceGroupCode="+$('#loadDschServiceGroupCode').val());
			          $.ajax({
			      		type: "POST",
			      		url: dataUrl,
			      		data: $('#holdForm').formSerialize()+ "&trade="+$('#tradeCode').val()+"&loadDschServiceGroupCode="+$('#loadDschServiceGroupCode').val(),
			      		success: function(responseText){
			      			if(responseText.success){
			      				//resetMandatory();
			      				$("#holdDialog").dialog("close");
			      				if($("#isHoldAdd").val()=="false"){
			      					loadHoldGrid("U");
						        }
			      				else{
			      					loadHoldGrid("");
			      				}
			      				//added against 21739
			      				changeInHoldGrid=true;
			      			}
			      			else{
			      				showResponseMessages('msgDivHold', responseText);
			      				$('#msgDivHold').show();
			      			}
			      		}
			      	});
		          } 
	},
		open : function(){
			$("#holdForm").validationEngine('attach');
			tabSequence('#holdDialog',false,false);
		},
		close : function() {
			$("#holdForm").validationEngine('hideAll');
			$("#holdForm").validationEngine('detach');
		} 
	});
	
	 $("#holdAdd").click(function(){
		 if($('#statusCode').text()!='ISSUED' && $('#statusCode').text()!='CORRECTED' && isHoldManualAdd==true){
			 if($("#success").val()=='false'){
					$("div#msgDiv").html('<div class="message_error">Load shipment first.</div>');
			}
			else if($("#success").val()=='true' || $("#success").val()=='undefined' || $("#success").val()=='' || $("#success").val()==null){
				if(shipmentNotFound!=true) 
				openHold();
			}
		 }
		 return false;
	 });
	
	$('#holdCd').gatesPopUpSearch({
		func : function() {
				holdPopupSearch($('#holdCd').val());
		}
	});
	
	//Blurr the data for invalid item Id
	 $('#holdCd').change(function(){
		if($.trim($(this).val())==''){
			$(this).val(""); 
			$("#holdCdHidden").val("");
			$("#holdNote").val("");
			//$("#holdNoteHidden").val("");
		} 
		else if($("#holdCdHidden").val()=='undefined' || $("#holdCdHidden").val()==null || $("#holdCdHidden").val()==""){				
			$(this).val("");
			$("#holdNote").val("");
			//$("#holdNoteHidden").val("");
 	    }	
		else if($("#holdCdHidden").val()!=$.trim($(this).val())){
			$(this).val(""); 
			$("#holdCdHidden").val("");
			$("#holdNote").val("");
			//$("#holdNoteHidden").val("");
		}
		
		$(this).val($.trim($(this).val()));
		
		if($('#msgDivHold').is(':visible') && $(this).val()==''){
			$('#msgDivHold').html("");
			$('#msgDivHold').hide();
		}
   }); 	
	 
   $("#holdNote").change(function(){
	   /*if($.trim($(this).val())==''){
			$(this).val(""); 
			$("#holdNoteHidden").val("");
			$("#holdCd").val("");
			$("#holdCdHidden").val("");
		} 
		else if($("#holdNoteHidden").val()=='undefined' || $("#holdNoteHidden").val()==null || $("#holdNoteHidden").val()==""){				
			$(this).val(""); 
			$("#holdCd").val("");
			$("#holdCdHidden").val("");
	    }	
		else if($("#holdNoteHidden").val()!=$.trim($(this).val())){
			$(this).val(""); 
			$("#holdNoteHidden").val("");
			$("#holdCd").val("");
			$("#holdCdHidden").val("");
		}*/
	   $(this).val($.trim($(this).val()));
   });
   
   $("#releaseHold").click(function(){
	   var releasedHoldSeqNos = jQuery("#holdGrid").jqGrid('getGridParam','selarrrow');
	   if(releasedHoldSeqNos!='undefined' && releasedHoldSeqNos!=null && releasedHoldSeqNos!=''){
		   $.ajax({
				url: _context+"/shipment/hold/releaseHolds?entityName="+$("#entityName").val()+"&releasedHoldSeqNos="+releasedHoldSeqNos,
				success: function(responseText){
					if(responseText.success){
						loadHoldGrid("R");
						loadHoldUnreleasedGrid();
					}
					else{
					   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html(responseText.messages.error.toString());
					   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
					}
				}
			});
	   }
	   else{
		   if($("#holdGrid").getGridParam("reccount")==0){
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("There are no holds to be released.");
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
		   }
		   else{
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("Please select atleast one unreleased hold to be released.");
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
		   }
	   }
	 //added against 21739
	  // changeInShipmentHold=true;
   });
   
   $("#undoReleaseHold").click(function(){
	   var undoReleasedHoldSeqNos = jQuery("#holdGrid").jqGrid('getGridParam','selarrrow');
	   if(undoReleasedHoldSeqNos!='undefined' && undoReleasedHoldSeqNos!=null && undoReleasedHoldSeqNos!=''){
		   $.ajax({
				url: _context+"/shipment/hold/undoReleaseHolds?entityName="+$("#entityName").val()+"&undoReleasedHoldSeqNos="+undoReleasedHoldSeqNos,
				success: function(responseText){
					if(responseText.success){
						loadHoldGrid("UR");
						loadHoldUnreleasedGrid();
					}
					else{
					   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html(responseText.messages.error.toString());
					   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
					}
				}
			});
	   }
	   else{
		   if($("#holdGrid").getGridParam("reccount")==0){
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("There are no holds to be unreleased.");
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
		   }
		   else{
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("Please select atleast one released hold to be undone.");
			   $('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').show();
		   }
	   }
	 //added against 21739
	   //changeInShipmentHold=true;
   });
   
   //Button- Hold Release on create_shipment.jsp
   /*$("#shipmentHoldReleaseBtn").click(function(){
	   $.ajax({
			url: _context+"/shipment/hold/releaseHolds?entityName="+$("#entityName").val()+"&releasedHoldSeqNos="+$("#holdUnreleasedGrid").getDataIDs()[0],
			success: function(responseText){
				if(responseText.success){
					loadHoldGrid("R");
					loadHoldUnreleasedGrid();
				}
			}
		});
   });*/
	 
   /*$("#holdGrid").jqGrid('setGridParam',{
			afterInsertRow: function(rowid, rowdata, rowelem){
				alert("afterInsertRow");
				loadHoldGrid();
			}
    });*/
   //holdPredictive();
   $('#holdCd').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'search_hold_code',
		 		 searchType: '264',
		 		parentSearch: function(){return  "ALL" + '|'+ getTrade() + '|'+ getLdDschSrvcGroup();}
	 	},
		formatItem : function(item) {
			//alert("item.HOLD_CODE: " + item.HOLD_CODE);
			//alert("item.DESCRIPTION: " + item.DESCRIPTION);
			return item.HOLD_CODE/*+"-"+item.DESCRIPTION*/;
		},
		formatResult : function(item) {
			//alert("item: " + item);
			return item.HOLD_CODE/*+"-"+item.DESCRIPTION*/;
		},
		select : function(item) {
			$('#holdCd').val(item.HOLD_CODE);
			$("#holdCdHidden").val(item.HOLD_CODE);
			$('#holdNote').val(item.DESCRIPTION);
			//$("#holdNoteHidden").val(item.DESCRIPTION);
		}
	});
}

function openHold(){
	$("#holdDialog").dialog( "option", "title", 'Hold' );
	
	if($("#statusCode").text()!='ISSUED' && $("#statusCode").text()!='CORRECTED')
	{
		$("#holdDialog").dialog('open'); 
	} 
	$("#holdForm").clearForm();
	$("#isHoldAdd").val("true");
	$('#msgDivHold').hide();
	$("#holdCd").attr("readOnly", false);
	$("#holdNote").attr("readOnly", false);
}

function editHold(id) {
	var holdSeqNo = id.split('=')[1];
	//alert(seqNo);
	if(isHoldManualUpdate){
	showHoldDialog(holdSeqNo);
	}
}

function showHoldDialog(holdSeqNo){
	//alert("seqNo: " + seqNo);
	$.ajax({
		url: _context+"/shipment/hold/getHold?holdSeqNo="+holdSeqNo+"&entityName="+$("#entityName").val(),
		success: function(responseText){
			openHold();
			$("#isHoldAdd").val("false");
			$("#holdForm").loadJSON(responseText);
			$("#holdCdHidden").val(responseText.holdCd);
			//$("#holdNoteHidden").val(responseText.holdNote);
			$("#holdCd").attr("readOnly", true);
			$("#holdNote").attr("readOnly", false);
		}
	});
}

function holdPopupSearch(holdCd) {
	var actionUrl = _context + '/cas/maintainHoldSearch.do?filterValue1=' + $("#holdCd").val() + '&filterValue4=' + $("#holdNote").val() + '&filterValue5=' + $("#tradeCode").val() + '&filterValue6=' + $("#loadDschServiceGroupCode").val();
	var windowStyle = 'top=50,left=100,height=500,width=900,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function holdCodeUpdate(holdCodeMessageText){
	var holdCodeDetails = holdCodeMessageText.split("|");
	$('#holdCd').val(holdCodeDetails[0]);
	$("#holdCdHidden").val(holdCodeDetails[0]);
	$('#holdNote').val(holdCodeDetails[1]);
	//$("#holdNoteHidden").val(holdCodeDetails[1]);
	clearHoldErrMsg();
}

function holdCodesUpdate(holdCodes, messageTexts){
	$('#holdCd').val(holdCodes);
	$("#holdCdHidden").val(holdCodes);
	$('#holdNote').val(messageTexts);
	//$("#holdNoteHidden").val(messageTexts);
	clearHoldErrMsg();
}

var holdGridLoadComplete = function(){
	var holdCount = $("#holdGrid").getGridParam("reccount");
	if(holdCount==0){
		setAccordianTabDetails('maintainShipmentHoldId', "");
	}
	else if(holdCount>0){
		/*var holdDisplayText = " - "+jQuery("#holdGrid").getRowData($("#holdGrid").getDataIDs()[0]).holdCode;
		var releaseCol=jQuery("#holdGrid").getRowData($("#holdGrid").getDataIDs()[0]).released;
		if(releaseCol.trim()==""){
		setAccordianTabDetails('maintainShipmentHoldId', holdDisplayText);
		}else if(holdCount>0){*/
			var holdDisplayText = "";
			var rowIDs = jQuery("#holdGrid").getDataIDs(); 
	        for (var i=0;i<rowIDs.length;i=i+1){ 
		        rowData = jQuery("#holdGrid").getRowData(rowIDs[i]);
		        if ($.trim(rowData.released)==""){
		        	holdDisplayText+=$.trim(rowData.holdCode) + " , ";
		        }
		       //Commented for Defect D027261 
		        //D023187
		       /* if($("#entityName").val()=='houseHoldShipment')
				{
				$("#gbox_holdGrid .cbox").attr("disabled", true);
				$("input.cbox", "#gbox_holdGrid #"+rowIDs[i]).hide();
				} */ 
	        }
	        
	        if($.trim(holdDisplayText)!=""){
	        	holdDisplayText = " - " + holdDisplayText;
	        	holdDisplayText = holdDisplayText.substring(0, holdDisplayText.length - 3);
	        }
			setAccordianTabDetails('maintainShipmentHoldId', holdDisplayText);
		//}
	}
	// Hides blank row on grid creation as readonly parameter is false to include form error row 
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="tr_holdSeqNo"]').hide();
	//Hides Error row on grid reload
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').hide();
	
	
	if($("#holdGridCount").val()>holdCount){
		//alert("IN");
		//validateBillingStarted("Del");
	}
	$("#holdGridCount").val(holdCount);
	
	// Call for displaying unreleased holds
	getUnreleasedHoldCount($("#entityName").val());
	//Load holdUnreleasedGrid when user define hold grid is loaded
	loadHoldUnreleasedGrid();
	
	//added against 21739
 	/*if(counterHoldGridReloaded==0){
 		numberOfInitialRowsHold=jQuery("#holdGrid").jqGrid('getGridParam', 'records');
 		counterHoldGridReloaded++;
 	}
 	if(numberOfInitialRowsHold != jQuery("#holdGrid").jqGrid('getGridParam', 'records')){
 		changeInHoldGrid=true;
 	}*/
 	$('#holdGrid').jqGrid('setGridWidth', 870);
 	
 	//to disable checkbox of hold 22735
    var status = $('#statusCode').text();
	if (status == 'ISSUED' || status == 'CORRECTED') {
		$("[id^=jqg_holdGrid]").attr('disabled',true);
		$('#cb_holdGrid') .attr('disabled', true);
	}
};

function clearHoldErrMsg(){
	$("#holdForm").validationEngine('hideAll');
}

function unloadHoldGrid(){
	$('#holdGrid').jqGrid('GridUnload');
}

function loadHoldGrid(oper){
	//alert("oper: "+ oper);
	$('#holdGrid').trigger("reloadGrid");
	//validateBillingStarted(oper);
}

function holdPredictive(){
	$('#holdCd').gatesAutocomplete({
		source : _context + '/cas/autocomplete.do?method=search_hold_code&searchType=264&parentSearch=' + getHoldCodeMessage() + '|'+ getTrade() + '|'+ getLdDschSrvcGroup(),
		formatItem : function(item) {
			//alert("item.HOLD_CODE: " + item.HOLD_CODE);
			//alert("item.DESCRIPTION: " + item.DESCRIPTION);
			return item.HOLD_CODE/*+"-"+item.DESCRIPTION*/;
		},
		formatResult : function(item) {
			//alert("item: " + item);
			return item.HOLD_CODE/*+"-"+item.DESCRIPTION*/;
		},
		select : function(item) {
			$('#holdCd').val(item.HOLD_CODE);
			$("#holdCdHidden").val(item.HOLD_CODE);
			$('#holdNote').val(item.DESCRIPTION);
			//$("#holdNoteHidden").val(item.DESCRIPTION);
		}
	});
}

function getHoldCodeMessage(){
	if($("#holdNote").val()=='undefined' || $.trim($("#holdNote").val())=='' || $("#holdNote").val()==null){
		return "ALL";
	}
	else{
		return $("#holdNote").val();
	}
}

function getTrade(){
	if($("#tradeCode").val()=='undefined' || $.trim($("#tradeCode").val())=='' || $("#tradeCode").val()==null){
		return "ALL";
	}
	else{
		return $("#tradeCode").val();
	}
}

function getLdDschSrvcGroup(){
	var loadDschServiceGroup = $("#loadDschServiceGroupCode").val();
	//alert("loadDschServiceGroup: " + loadDschServiceGroup);
	if(loadDschServiceGroup=='undefined' || $.trim(loadDschServiceGroup)=='' || loadDschServiceGroup==null){
		return "ALL";
	}
	else{
		return loadDschServiceGroup;
	}
}

function validateBillingStarted(oper){
	//alert("seqNo: " + seqNo);
	var shipmentNumber = $.trim($("#shipmentNumber").val());
	if(shipmentNumber!='undefined' && shipmentNumber!=null && shipmentNumber!=''){
		$.ajax({
			url: _context+"/shipment/hold/validateBillingStarted?entityName="+$("#entityName").val()+"&shipmentNumber="+shipmentNumber+"&oper="+oper,
			success: function(responseText){
				if(responseText.success){
					showResponseMessages('msgDiv', responseText);
				}
				else{
					//alert("MsgDiv12: " + $('#msgDiv').html());
					if(oper!='D'){
						$('#msgDiv').html("");
					}
					//alert($('#msgDiv div[class="message_info"]').html());
				}
			}
		});
	}
}

function openHoldsUnreleasedDialog(entityName){
	$("#holdsUnreleased").dialog({
		width : 710,
		height : 100,
		title : 'Unreleased Holds',
		autoResize : true,
		modal: false,
		position: 'center',
		close : function(event, ui) {
			//commented for Defect D028950
			//$("#shipmentHoldReleaseBtn").attr("disabled", true);
			unloadHoldUnreleasedGrid();
			
			//On closing the holdUnreleasedGrid, change + to -
			$("#holdCount").html($("#holdCount").text().replace("-", "+"));
		}
	});
	
	/*$(window).resize(function() {
        $('body').css('height', $(this).height());
        $('#holdsUnreleased').dialog( "option", "position", [400, 660] );
    })
    .scroll(function(){
    		$(this).resize();
    	});	*/
	
	$(window).scroll(function() {
		$('body').css('height', $(this).height());
        $('#holdsUnreleased').dialog( "option", "position", "center" );
	});
	
	createHoldUnreleasedGrid(entityName);
}

function createHoldUnreleasedGrid(entityName) {
	var holdDisplayColNames = ['', '', '', '', ''];
	var holdDisplayColModels = [
	               {name:'holdSeqNo', index:'holdSeqNo', hidden:true},
	               {name:'holdCode', index:'holdCode', width:80, editable:false},
	               {name:'note', index:'note', width:320, editable:false, formatter:formatMessageText},
	               {name:'holdMz.targetWebPageSection', index:'holdMz.targetWebPageSection', width:80, editable:true, formatter:'showlink', formatoptions : {
         				baseLinkUrl : "javascript:",
       				showAction: "editHoldDisplay('",
       				addParam: "');" }
                   },
	               {name:'holdMz.highlightedAttributes', index:'holdMz.highlightedAttributes', width:160, editable:false}
			   	];

	var jsonReaderHoldDisplay = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"holdSeqNo"
		};

    /*createGrid(
			"holdUnreleasedGrid", // grid id for user
			"holdDisplayPager", // page id for user
			_context+'/shipment/hold/loadUnreleasedHolds?entityName='+entityName, 
			'', 
			'', 
			'', 
			'',
			holdDisplayColNames, 
			holdDisplayColModels, 
			"",
			160, 5, [5], true, true, false, true,
			jsonReaderHoldDisplay, true, true, false, true, true, false, false, false, holdUnreleasedGridLoadComplete, false, true);*/
	
	$('#holdUnreleasedGrid').gatesGrid({
		colNames: holdDisplayColNames,
		colModel: holdDisplayColModels,
		jsonReader: jsonReaderHoldDisplay,
		rowNum: 5,
		rowList: [5],
		height: 100,
		multiselect:true,
		gatesOptions: {
			urls: {load: _context+'/shipment/hold/loadUnreleasedHolds?entityName='+entityName},
			extraData: {
				customerGroup: function() {
					return $.trim($('#customerGroupId :selected').text());
				},
				loadDschGroup: function() {
					return  $.trim($('#loadDschServiceGroupCode').val());
				}
			},
			loadComplete: holdUnreleasedGridLoadComplete
		}
	});
    
    jQuery("#holdUnreleasedGrid").jqGrid('setGridParam',{
				onSelectRow:function(rowid, status){
				//alert("onSelectRow: " + rowid);
				var firstRowId = $("#holdUnreleasedGrid").getDataIDs()[0];
				// The first row of holdUnreleasedGrid is always selected and its checkbos is always checked.
				$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+firstRowId+'"] input[type=checkbox]').attr('checked', true);
				$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+firstRowId+'"]').addClass("ui-state-highlight");
			    if(firstRowId!=rowid){
			    	$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+rowid+'"] input[type=checkbox]').attr('checked', false);
			    	$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+rowid+'"]').removeClass("ui-state-highlight");
				}	
				
				return true;
			}
		});
	
	//Removing Header of holdUnreleasedGrid
	$("#holdUnreleasedGrid").parents("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();
	
	//On opening the holdUnreleasedGrid, change - to +
	$("#holdCount").html($("#holdCount").text().replace("+", "-"));
}

function editHoldDisplay(id) {
	var holdCode = id.split('=')[1];
	var colValue=$("#holdUnreleasedGrid").jqGrid('getCell', holdCode, 'holdMz.targetWebPageSection');
	
	
	// this code is added to load grids
	

	 createShipmentPartieGrid();
	 createShipmentReferenceNumberGrid();
		createShipmentRoutingGrid();
		createShipmentCommodityGrid();
		createShipmentSpecialServiceGrid();
		createShipmentClauseGrid();
		
		//
	//alert(colValue);
	var accordionIndex = '';
	if(colValue == 'Header'){
		window.scrollTo(0, 0);
		//expandRelatedDivForHold('');
	}
	else if(colValue == 'Shipper/Consignee'){
		accordionIndex = 0;
		expandRelatedDivForHold('#maintainShipmentShipperConsignee');
	}else if(colValue == 'Reference Numbers' ||colValue =='Marks'){
		accordionIndex = 2;
		expandRelatedDivForHold('#maintainShipmentRefNumberMarks');
	}else if(colValue == 'Routing VVD'){
		accordionIndex = 3;
		expandRelatedDivForHold('#maintainShipmentRouting');
	}else if(colValue == 'Commodity'){
		accordionIndex = 4;
		expandRelatedDivForHold('#maintain_commodity_shipment');
	}else if(colValue == 'Military'){
		accordionIndex = 5;
		expandRelatedDivForHold('#maintainShipmentMilitary');
	}else if(colValue == 'Special Services'){
		accordionIndex = 6;
		expandRelatedDivForHold('#maintainShipmentSpecialServices');
	} else if(colValue == 'Clause'){
		accordionIndex = 7;
		expandRelatedDivForHold('#maintainBookingClauses');
	}else if(colValue == 'Hold'){
		accordionIndex = 8;
		expandRelatedDivForHold('#maintainShipmentHold');
	}
	
	if(accordionIndex!=''){
		//openTargetAccordian(accordionIndex);
		var offset = accordianPostionCoordinates(accordionIndex);
		window.scrollTo(offset.left, offset.top);
	}
	
}

function accordianPostionCoordinates(accordionIndex){
	return $($('.shipment-section')[accordionIndex]).offset();
}

var holdUnreleasedGridLoadComplete = function(){
	//Default selection of first row
	jQuery("#holdUnreleasedGrid").setSelection($("#holdUnreleasedGrid").getDataIDs()[0], true);
	//Removes background colur from first row
	$('span', $($('td', $('#'+$("#holdUnreleasedGrid").getDataIDs()[0], $("#holdUnreleasedGrid")))[4])).css("background-color", "");
	//$("#holdUnreleasedGrid tr[id="+$("#holdUnreleasedGrid").getDataIDs()[0]+"] td").css("background-color", "#98BF21");
	
	//Setting content of  first td of every tr of holdUnreleasedGrid
	$('table[id="holdUnreleasedGrid"] tr td[aria-describedby="holdUnreleasedGrid_rn"]').html("");
	$('table[id="holdUnreleasedGrid"] tr td[aria-describedby="holdUnreleasedGrid_rn"]').attr("title", "");
	
	//Disabling all the checkboxes of all the displayed rows of the grid
	$('table#holdUnreleasedGrid input[type=checkbox]').attr('disabled', true);
	//Enabling the checkbox of the first row of the grid
	$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+$("#holdUnreleasedGrid").getDataIDs()[0]+'"] input[type=checkbox]').attr('disabled', false);
	
	if($("#holdUnreleasedGrid").getGridParam("reccount")==0){
		$( "#holdsUnreleased" ).dialog('close'); 
	}
	else{
		$("#shipmentHoldReleaseBtn").attr("disabled", false);
	}
	/*$('#holdsUnreleased').attr("style","width: auto; min-height: 10px; max-height:85px; height: auto;");
	$($('#holdsUnreleased').parent())[0].style.top="637px";
	if($('#gview_holdUnreleasedGrid') != undefined && $('#gview_holdUnreleasedGrid').children() != undefined){
		if($('#gview_holdUnreleasedGrid').children()[2] != undefined ){
			$('#gview_holdUnreleasedGrid').children()[2].style.height="auto";
		}
	}*/
	calculateUnreleasedHoldGridPosition();
};

function calculateUnreleasedHoldGridPosition(){
	if($("#hold_link").offset().top>100){
	var leftCoordinate = ($("#hold_link").offset().left + $("#hold_link").width()) - $('#holdsUnreleased').dialog( "option", "width") - 10;
	var topCoordinate = $("#hold_link").offset().top - $('#holdsUnreleased').outerHeight() - 45;
	$('#holdsUnreleased').dialog( "option", "position", "center" );
	$(window).scroll(function() {
		$('#holdsUnreleased').dialog( "option", "position", "center" );
	});
	}
}


function getUnreleasedHoldCount(entityName){
	//alert("getUnreleasedHoldCount: " + entityName);
	//alert("#shipmentId): " + $("#shipmentId").val());
	if($('#hiddenonHoldLink').val() == "true")
		$('#onHoldLink').html(" - ON hold "); 
	else 
		$('#onHoldLink').html(""); 
		
	if(($("#shipmentId").val()!='undefined' && $("#shipmentId").val()!=null && $.trim($("#shipmentId").val())!='') || (entityName!='undefined' && entityName!='' && entityName!=null && entityName!='shipment')){
		$.ajax({
			url: _context+"/shipment/hold/getUnreleasedHoldCount?entityName="+entityName+"&customerGroup="+$.trim($('#customerGroupId :selected').text())+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val()),
			success: function(responseText){
				if(responseText.success){
					if(responseText.data!=0){
						$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:openHoldsUnreleasedDialog('"+entityName+"');");
						//On opening/closing the holdUnreleasedGrid, toggle + and -
						if($('#holdUnreleasedGrid tr').length==0){
							$("#holdCount").html("("+responseText.data+")+");
						}
						else{
							$("#holdCount").html("("+responseText.data+")-");
						}
						// For Defect D17560 -- Praveen
						//$("#shipmentHoldReleaseBtn").attr("disabled", false);
						if(entityName=='rateBill' || entityName=='printFreight'){
							loadHoldUnreleasedGrid();
						}
						
					}
					else{
						$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:void(0)");
						$("#holdCount").html("(0)");
						//$("#shipmentHoldReleaseBtn").attr("disabled", true);
						//$('#onHoldLink').html(""); // For Defect D17560  --Praveen
					}
				}
			}
		});
	}
	if(entityName != "houseHoldShipment") {
		$("#shipmentHoldReleaseBtn").tooltip({ 
		    bodyHandler: function() { 
		    	var toolTipText = "";
		    	$.ajax({
		    		url: _context+"/shipment/hold/getFirstUnreleasedHold?entityName="+entityName+"&customerGroup="+$.trim($('#customerGroupId :selected').text())+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val()),
		    		async: false,
		    		success: function(responseText){
		    			if(responseText.success){
		    				toolTipText = responseText.data.holdCode + " - " + responseText.data.note;
		    			}
		    		}
		    	});
		        return toolTipText; 
		    }, 
		    showURL: false 
		});
	}
}

function openUnreleasedHoldGridOnIntialDisplay(entityName){
	//alert("openUnreleasedHoldGridOnIntialDisplay: " + entityName);
	if($('#hiddenonHoldLink').val()=="true")
		$('#onHoldLink').html(" - ON hold "); 
	else 
		$('#onHoldLink').html(""); 	
	$.ajax({
			url: _context+"/shipment/hold/getUnreleasedHoldCount?entityName="+entityName,
			success: function(responseText){
				if(responseText.success){
					if(responseText.data!=0){
						//getUnreleasedHoldCount(entityName);
						$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:openHoldsUnreleasedDialog('"+entityName+"');");
						if($('#holdUnreleasedGrid tr').length==0){
							$("#holdCount").html("("+responseText.data+")+");
						} else{
							$("#holdCount").html("("+responseText.data+")-");
						}
						if(entityName=='rateBill' || entityName=='printFreight'){
							loadHoldUnreleasedGrid();
						}
						openHoldsUnreleasedDialog(entityName);
						loadHoldUnreleasedGrid();
						if(entityName=="shipment"){
							$("#shipmentHoldReleaseBtn").attr("disabled", false);
						}
					}else{
						$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:void(0)");
						$("#holdCount").html("(0)");
						//$("#shipmentHoldReleaseBtn").attr("disabled", true);
						//$('#onHoldLink').html(""); // For Defect D17560  --Praveen
						$( "#holdsUnreleased" ).dialog('close');
					}
				}
			}
		});
}

/*function showHideUnreleasedHoldButton(){
	var loadDschServiceGroup = $("#loadDschServiceGroupCode").val();
	//alert("loadDschServiceGroup: " + loadDschServiceGroup);
	if(loadDschServiceGroup=='undefined' || $.trim(loadDschServiceGroup)=='' || loadDschServiceGroup==null){
		$("#holdsDiv").hide();
		$("#shipmentHoldReleaseBtn").attr("disabled", true);
	}
	else{
		getUnreleasedHoldCount();
	}
}*/

function loadHoldUnreleasedGrid(){
	$('#holdUnreleasedGrid').trigger("reloadGrid");
}

function unloadHoldUnreleasedGrid(){
	$('#holdUnreleasedGrid').jqGrid('GridUnload');
}

function formatMessageText(cellvalue, options, rowObject){
	//alert("cellvalue: " + cellvalue);
	if($.trim(rowObject.holdMz.isRequireDataReview)=='Y' && $.trim(rowObject.holdMz.isDataRqrdInTrgtAttribute)=='Y'){
		cellvalue = '<span style="background-color:red">'+cellvalue+'</span>';
	}
	else if($.trim(rowObject.holdMz.isRequireDataReview)=='Y'){
		//D028307
		//cellvalue = '<span style="background-color:yellow">'+cellvalue+'</span>';
	}

return cellvalue;
}

function selectedHoldRelease(entityName){
	//alert("selectedHoldRelease::"+entityName);
	
	
	if(entityName=="shipment"){
		urlString = _context+"/shipment/hold/releaseHolds?entityName="+entityName+"&releasedHoldSeqNos="+$("#holdUnreleasedGrid").getDataIDs()[0];
	}
	else if(jQuery("#holdUnreleasedGrid").getRowData( $('#holdUnreleasedGrid').jqGrid('getDataIDs')[0]).note
			=='Err: Invalid P/C indicator found on bill')
	{
		urlString = _context+"/shipment/hold/deleteETyoeHold?entityName="+entityName+"&releasedHoldSeqNo="+$("#holdUnreleasedGrid").getDataIDs()[0];
		//$("#holdsUnreleased").dialog('close');
	}
	else{
		urlString = _context+"/shipment/hold/selectedHoldRelease?entityName="+entityName+"&releasedHoldSeqNo="+$("#holdUnreleasedGrid").getDataIDs()[0];
	}
	
	 $.ajax({
			url: urlString,
			success: function(responseText){
				if(responseText.success){
					if(entityName=="shipment"){
						loadHoldGrid("");
						//$('#shipmentSaveBtn').trigger("click");
					}else if(entityName=="payment" || entityName=="sendDocument"){
						window.opener.loadHoldGrid("D");
					}
					else if(entityName=="containerBilling"){
						loadHoldGrid("D");
					}
					else if(entityName=="rateBill")
					{
						loadHoldGrid("D");
					}
					loadHoldUnreleasedGrid();
					// Call for displaying unreleased holds
					getUnreleasedHoldCount(entityName);
				}
			}
		});

}

function setShipmentHold() {
	var holdCount = $("#holdGrid").getGridParam("reccount");
	if (holdCount == 0) {
		setAccordianTabDetails('maintainShipmentHoldId', "");
	} else if (holdCount > 0) {
		/*var holdDisplayText = " - "
				+ jQuery("#holdGrid").getRowData(1).holdCode;
		var releaseCol=jQuery("#holdGrid").getRowData(1).released;
		if(releaseCol.trim()==""){
			setAccordianTabDetails('maintainShipmentHoldId', holdDisplayText);
		}else{
			setAccordianTabDetails('maintainShipmentHoldId', "");
		}*/
		var holdDisplayText = "";
		var rowIDs = jQuery("#holdGrid").getDataIDs(); 
        for (var i=0;i<rowIDs.length;i=i+1){ 
	        rowData = jQuery("#holdGrid").getRowData(rowIDs[i]);
	        if ($.trim(rowData.released)==""){
	        	holdDisplayText+=$.trim(rowData.holdCode) + " | ";
	        }
        }
        
        if($.trim(holdDisplayText)!=""){
        	holdDisplayText = " - " + holdDisplayText;
        	holdDisplayText = holdDisplayText.substring(0, holdDisplayText.length - 3);
        }
		setAccordianTabDetails('maintainShipmentHoldId', holdDisplayText);
		
	}
}

function expandRelatedDivForHold(divId)
{
	collapseAll();
	window.scrollTo(0, 0);
	$(divId).css('display', 'block');
}

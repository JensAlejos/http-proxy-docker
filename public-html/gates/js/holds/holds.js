function createHoldGrid(entityName) {
	$("#entityName").val(entityName);
	var holdColNames = ['Id', 'Hold Code', 'Message', 'Placed','Released','Last Updated'];
	var holdColModels = [
	               {name:'holdSeqNo', index:'holdSeqNo', hidden:true},
	               {name:'holdCode', index:'holdCode', width:60, editable:true, formatter:'showlink', formatoptions : {
          				baseLinkUrl : "javascript:",
        				showAction: "editHold('",
        				addParam: "');" }
                    },
	               {name:'note', index:'note', width:250, editable:true},
	               {name:'placed', index:'placed', width:165, editable:false},
	               {name:'released', index:'released', width:165, editable:false},
	               {name:'lastUpdated', index:'lastUpdated', width:165, editable:false}
			   	];

	var jsonReaderHold = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"holdSeqNo"
		};
	
	/*Booking Security*/
	var pagerMultiDelete = true;
	if(isHoldManualDisplayOnly && !isHoldManualModifiable){
		pagerMultiDelete = false;
	}
	
	/*Booking Security*/
	if(isHoldManualDisplayOnly || isHoldManualModifiable){
	createGrid(
			"holdGrid", // grid id for user
			"holdPager", // page id for user
			_context+'/hold/load?entityName='+entityName, 
			'', 
			'', 
			'', 
			_context+'/hold/delete?entityName='+entityName,
			holdColNames, 
			holdColModels, 
			"Hold",
			139, 6, [6, 12, 18, 24], true, pagerMultiDelete, false, false,
			jsonReaderHold, true, true, true, true, true, false, false, false, holdGridLoadComplete, false, true, false, holdPagerAfterSubmit);
	}
	
	 $("#holdDialog").dialog({autoOpen: false ,width:970, modal: true
		    , buttons: {
		         Cancel:function(){
		            	$(this).dialog("close"); 
		          },
		          Ok:function(){
		        	  if($('#bookingStatusCode')!=undefined && $('#bookingStatusCode').val()=='CANC'){
			        		$("#holdDialog").dialog("close"); 
			        		return;
			          }
		        	  if (!$("#holdForm").validationEngine('validate')) {
			        		return;
		        	  }
		        	  
		        	  var dataUrl = _context+"/hold/add?entityName="+entityName;
			          if($("#isHoldAdd").val()=="false"){
			        	dataUrl = _context+"/hold/update?entityName="+entityName;
			          }
			          
			          $.ajax({
			      		type: "POST",
			      		url: dataUrl,
			      		data: $('#holdForm').formSerialize()+ "&trade="+$('#tradeCode').val()+"&loadDschServiceGroupCode="+$.trim($('#loadDschServiceGroupCode').val()),
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
			      				if($("#entityName").val()=='booking')
									isBookingChanged = "Y";
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
			tabSequence('#holdDialog',false,false);
			$("#holdForm").validationEngine('attach');
		},
		close : function() {
			$("#holdForm").validationEngine('hideAll');
			$("#holdForm").validationEngine('detach');
			tabSequence('#',true,false);
		} 
	});
	
	 $("#holdAdd").click(function(){
		 /*Booking Security*/
		 if(isHoldManualDisplayOnly && !isHoldManualModifiable){
			 return;
		 }
		 if($('#bookingStatusCode').val()!='CANC'){
			 if($("#success").val()=='false'){
					$("div#msgDiv").html('<div class="message_error">Load booking first.</div>');
			}
			else if($("#success").val()=='true' || $("#success").val()=='undefined' || $("#success").val()=='' || $("#success").val()==null){
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
		$("#holdNote").attr("readOnly", false);
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
				url: _context+"/hold/releaseHolds?entityName="+$("#entityName").val()+"&releasedHoldSeqNos="+releasedHoldSeqNos+"&reEvaluationReqd=true",
				success: function(responseText){
					if(responseText.success){
						loadHoldGrid("R");
						loadHoldUnreleasedGrid();
						if($("#entityName").val()=='booking')
							isBookingChanged = "Y";
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
   });
   
   $("#undoReleaseHold").click(function(){
	   var undoReleasedHoldSeqNos = jQuery("#holdGrid").jqGrid('getGridParam','selarrrow');
	   if(undoReleasedHoldSeqNos!='undefined' && undoReleasedHoldSeqNos!=null && undoReleasedHoldSeqNos!=''){
		   $.ajax({
				url: _context+"/hold/undoReleaseHolds?entityName="+$("#entityName").val()+"&undoReleasedHoldSeqNos="+undoReleasedHoldSeqNos,
				success: function(responseText){
					if(responseText.success){
						loadHoldGrid("UR");
						loadHoldUnreleasedGrid();
						if($("#entityName").val()=='booking')
							isBookingChanged = "Y";
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
   });
   
   //Button- Hold Release on create_booking.jsp
   /*$("#holdRelease").click(function(){
	   $.ajax({
			url: _context+"/hold/releaseHolds?entityName="+$("#entityName").val()+"&releasedHoldSeqNos="+$("#holdUnreleasedGrid").getDataIDs()[0],
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
   
   $('#holdCd').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'search_hold_code',
		 		 searchType: '264',
		 		parentSearch: function(){return  "ALL" + '|'+ getTrade() + '|'+ getLdDschSrvcGroup();}
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
	$("#holdDialog").dialog('open'); 
	$("#holdForm").clearForm();
	$("#isHoldAdd").val("true");
	$('#msgDivHold').hide();
	$("#holdCd").attr("readOnly", false);
	$("#holdNote").attr("readOnly", false);
}

function editHold(id) {
	/*Booking Security*/
	if((isHoldManualDisplayOnly && !isHoldManualModifiable) || ($('#bookingStatusCode')!=undefined && $("#bookingStatusCode").val()=='CANC')){
		$("#holdDialog").gatesDisable();
	}else{
		$("#holdDialog").gatesEnable();
	}
	var holdSeqNo = id.split('=')[1];
	//alert(seqNo);
	showHoldDialog(holdSeqNo);
	
	return false;
}

function showHoldDialog(holdSeqNo){
	//alert("seqNo: " + seqNo);
	$.ajax({
		url: _context+"/hold/getHold?holdSeqNo="+holdSeqNo+"&entityName="+$("#entityName").val(),
		success: function(responseText){
			openHold();
			$("#isHoldAdd").val("false");
			$("#holdForm").loadJSON(responseText);
			$("#holdCdHidden").val(responseText.holdCd);
			//$("#holdNoteHidden").val(responseText.holdNote);
			$("#holdCd").attr("readOnly", true);
			$("#holdNote").attr("readOnly", false);
			
			/*Booking Security*/
			if(isHoldManualDisplayOnly && !isHoldManualModifiable){
				disableDialogButton('holdDialog', 'Ok');
			}
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
	$("#holdNote").attr("readOnly", false);
	clearHoldErrMsg();
}

function holdCodesUpdate(holdCodes, messageTexts){
	$('#holdCd').val(holdCodes);
	$("#holdCdHidden").val(holdCodes);
	$('#holdNote').val(messageTexts);
	//$("#holdNoteHidden").val(messageTexts);
	if(holdCodes.length==1){
		$("#holdNote").attr("readOnly", false);
	}
	else if(holdCodes.length>1){
		$("#holdNote").attr("readOnly", true);
	}
	clearHoldErrMsg();
}

var holdGridLoadComplete = function(){
	//alert("holdGridLoadComplete");
	//$('#holdPager .ui-pg-input').attr("readonly", true);
	var holdCount = $("#holdGrid").getGridParam("reccount");
	if(holdCount==0){
		setAccordianTabDetails('maintainBookingHoldId', "");
	}
	else if(holdCount>0){
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
		
		setAccordianTabDetails('maintainBookingHoldId', holdDisplayText);
	}
	
	// Hides blank row on grid creation as readonly parameter is false to include form error row 
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="tr_holdSeqNo"]').hide();
	//Hides Error row on grid reload
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_holdGrid"] thead tr[id="FormError"]').hide();
	
	
	//alert("Hidden Count: "+$("#holdGridCount").val());
	//alert("Current Count: "+holdCount);
	/*if($("#holdGridCount").val()>holdCount){
		validateBillingStarted("Del");
	}*/
	$("#holdGridCount").val(holdCount);
	
	/*Booking Security*/
	if(isHoldOverlayBottomEnabled){
		// Call for displaying unreleased holds
		//alert("entityName: " + $("#entityName").val());
		getUnreleasedHoldCount($("#entityName").val());
		//Load holdUnreleasedGrid when user define hold grid is loaded
		loadHoldUnreleasedGrid();
	}
};

var holdPagerAfterSubmit = function(result)
{
	if(result.success && $("#entityName").val()=='booking')
		isBookingChanged = "Y";
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
			url: _context+"/hold/validateBillingStarted?entityName="+$("#entityName").val()+"&shipmentNumber="+shipmentNumber+"&oper="+oper,
			success: function(responseText){
				if(responseText.success){
					if($("#holdGrid").getGridParam("reccount")>0){
						if($('#msgDiv').html()==""){
							showResponseMessages('msgDiv', responseText);
						}else{
							var messageContent = $('#msgDiv').html();
							if (responseText.messages.info.length > 0) {
								var array = responseText.messages.info;
								messageContent += '<div class="message_info">' + array[0] + '</div>';
								$('#msgDiv').html(messageContent);
							}
						}
					}
				}
				else{
					if(oper!='D'){
						$('#msgDiv').html("");
					}
				}
			}
		});
	}
}

function openHoldsUnreleasedDialog(entityName){
	$("#holdsUnreleased").dialog({
		width : 710,
		height : 'auto',
		title : 'Unreleased Holds',
		autoResize : true,
		modal: false,
		minHeight: 0,
		//position: [400, 660],
		close : function(event, ui) {
			//$("#holdRelease").attr("disabled", true);
			
			if($("#holdCount").text()[1]==0){
				$("#holdRelease").attr("disabled", true);
			}
			else{
				$("#holdRelease").attr("disabled", false);
			}
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
	
	createHoldUnreleasedGrid(entityName);
}

function createHoldUnreleasedGrid(entityName) {
	var holdDisplayColNames = ['', '', '', '', ''];
	var holdDisplayColModels = [
	               {name:'holdSeqNo', index:'holdSeqNo', hidden:true},
	               {name:'holdCode', index:'holdCode', width:80, editable:false},
	               {name:'note', index:'note', width:320, editable:false, formatter:formatMessageText},
	               {name:'holdMz.targetWebPageSection', index:'holdMz.targetWebPageSection', width:80, editable:true, formatter:formatTargetWebPageSection/*, formatoptions : {
         				baseLinkUrl : "javascript:",
       				showAction: "editHoldDisplay('",
       				addParam: "');" }*/
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
			_context+'/hold/loadUnreleasedHolds?entityName='+entityName, 
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
		height: "100%",
		multiselect:true,
		gatesOptions: {
			urls: {load: _context+'/hold/loadUnreleasedHolds?entityName='+entityName},
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
    			//change 20599
				/*onSelectRow:function(rowid, status){
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
			}*/
		});
	
	//Removing Header of holdUnreleasedGrid
	$("#holdUnreleasedGrid").parents("div.ui-jqgrid-view").children("div.ui-jqgrid-hdiv").hide();
	
	//On opening the holdUnreleasedGrid, change - to +
	$("#holdCount").html($("#holdCount").text().replace("+", "-"));
}

/*function editHoldDisplay(id) {
	var rowData = jQuery("#holdUnreleasedGrid").getRowData(id.split('=')[1]);
	openTargetSection(rowData.holdCode);
}*/

var holdUnreleasedGridLoadComplete = function(){
//change 20599
	//Default selection of first row
	jQuery("#holdUnreleasedGrid").setSelection($("#holdUnreleasedGrid").getDataIDs()[0], false);
	//Removes background colur from first row
	$('span', $($('td', $('#'+$("#holdUnreleasedGrid").getDataIDs()[0], $("#holdUnreleasedGrid")))[4])).css("background-color", "");
	//$("#holdUnreleasedGrid tr[id="+$("#holdUnreleasedGrid").getDataIDs()[0]+"] td").css("background-color", "#98BF21");
	
	//Setting content of  first td of every tr of holdUnreleasedGrid
	$('table[id="holdUnreleasedGrid"] tr td[aria-describedby="holdUnreleasedGrid_rn"]').html("");
	$('table[id="holdUnreleasedGrid"] tr td[aria-describedby="holdUnreleasedGrid_rn"]').attr("title", "");
	
	//Disabling all the checkboxes of all the displayed rows of the grid
	$('table#holdUnreleasedGrid input[type=checkbox]').attr('disabled', false);
	//Enabling the checkbox of the first row of the grid
	$('table[aria-labelledby="gbox_holdUnreleasedGrid"] tr[id="'+$("#holdUnreleasedGrid").getDataIDs()[0]+'"] input[type=checkbox]').attr('disabled', false);
	
	if($("#holdUnreleasedGrid").getGridParam("reccount")==0){
		$( "#holdsUnreleased" ).dialog('close'); 
	}
	
	calculateUnreleasedHoldGridPosition();
};

function getUnreleasedHoldCount(entityName){
	//alert("getUnreleasedHoldCount: " + entityName);
	if(/*($("#bookingId").val()!='undefined' && $("#bookingId").val()!=null && $.trim($("#bookingId").val())!='') || (*/entityName!='undefined' && entityName!='' && entityName!=null /*&& entityName!='booking')*/){
		$("#holdsDiv").show();
		$.ajax({
			url: _context+"/hold/getUnreleasedHoldCount?entityName="+entityName+"&customerGroup="+$.trim($('#customerGroupId :selected').text())+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val()),
			success: function(responseText){
				if(responseText.success){
					if(responseText.data!=0){
						//$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:openHoldsUnreleasedDialog('"+entityName+"');");
						//On opening/closing the holdUnreleasedGrid, toggle + and -
						if($('#holdUnreleasedGrid tr').length==0){
							$("#holdCount").html("("+responseText.data+")+");
						}
						else{
							$("#holdCount").html("("+responseText.data+")-");
						}
						$("#holdRelease").attr("disabled", false);
						if(entityName=='billSetup'){
							loadHoldUnreleasedGrid();
						}
					}
					else{
						//$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:void(0)");
						$("#holdCount").html("(0)");
						$("#holdRelease").attr("disabled", true);
					}
				}
			}
		});
	}
	
	$("#holdRelease").tooltip({ 
	    bodyHandler: function() { 
	    	var toolTipText = "";
	    	$.ajax({
	    		url: _context+"/hold/getFirstUnreleasedHold?entityName="+entityName+"&customerGroup="+$.trim($('#customerGroupId :selected').text())+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val()),
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

function openUnreleasedHoldGridOnIntialDisplay(entityName){
	//alert("openUnreleasedHoldGridOnIntialDisplay: " + entityName);
	/*Booking Security*/
	//D027551: 	HOLDS - AUTOBILL - XBK62 - didnt pop up in GATES
	var holdUrl;
	if(entityName == "booking"){
		holdUrl =  _context+"/hold/getUnreleasedHoldCount?entityName="+entityName+"&customerGroup="+$.trim($('#customerGroupId :selected').text())
					+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val());
	} else {
		holdUrl =  _context+"/hold/getUnreleasedHoldCount?entityName="+entityName;
	}
	if(isHoldOverlayBottomEnabled){
		$.ajax({
			url: holdUrl,
			success: function(responseText){
				if(responseText.success){
					if(responseText.data!=0){
						getUnreleasedHoldCount(entityName);
						if($("#holdsUnreleased").dialog("isOpen")==true){
							loadHoldUnreleasedGrid();
						}
						else{
							openHoldsUnreleasedDialog(entityName);
							loadHoldUnreleasedGrid();
						}
						$("#holdRelease").attr("disabled", false);
						calculateUnreleasedHoldGridPosition();
					}
					else{
						$("#holdsDiv").show();
						$("a.holds").attr("href", "javascript:void(0)");
						$("#holdCount").html("(0)");
						$("#holdRelease").attr("disabled", true);
						if($("#holdsUnreleased").dialog("isOpen")==true){
							$("#holdsUnreleased").dialog("close");
						}
					}
				}
			}
		});
	}
}

/*function showHideUnreleasedHoldButton(){
	var loadDschServiceGroup = $("#loadDschServiceGroupCode").val();
	//alert("loadDschServiceGroup: " + loadDschServiceGroup);
	if(loadDschServiceGroup=='undefined' || $.trim(loadDschServiceGroup)=='' || loadDschServiceGroup==null){
		$("#holdsDiv").hide();
		$("#holdRelease").attr("disabled", true);
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
	if(($.trim(rowObject.holdMz.isRequireDataReview)=='Y' && $.trim(rowObject.holdMz.isDataRqrdInTrgtAttribute)=='Y') || ($.trim(rowObject.holdMz.isDataRqrdInTrgtAttribute)=='Y')){
		cellvalue = '<span style="background-color:red">'+cellvalue+'</span>';
	}
	else if($.trim(rowObject.holdMz.isRequireDataReview)=='Y'){
		cellvalue = '<span style="background-color:yellow">'+cellvalue+'</span>';
	}

return cellvalue;
}

function formatTargetWebPageSection(cellvalue, options, rowObject){
	var targetWebPageSection = "'" + $.trim(rowObject.holdMz.targetWebPageSection) + "'";
	if(rowObject.holdMz.targetWebPageSection!=null && $.trim(rowObject.holdMz.targetWebPageSection)!=''){
		cellvalue = '<a href="javascript:openTargetSection('+targetWebPageSection+')" style="text-decoration:underline;" >'+cellvalue+'</a>';
	}
	else if(rowObject.holdMz.targetWebPageSection==null || $.trim(rowObject.holdMz.targetWebPageSection)==''){
		cellvalue = '';
	}
return cellvalue;
}

function selectedHoldRelease(entityName){
//change 20599
	//var rowData = jQuery("#holdUnreleasedGrid").getRowData($("#holdUnreleasedGrid").getDataIDs()[0]);
	//Variance list by booking
	
	var releasedHoldSeqNos = jQuery("#holdUnreleasedGrid").jqGrid('getGridParam','selarrrow');

	var selectedHoldsToBeReleasedSeqNos=null;
	if(releasedHoldSeqNos==undefined)
	{
	var releasedHoldSeqNos=["-1"];
	}
	for(var i=0;i<releasedHoldSeqNos.length;i++)
	{
	selectedHoldsToBeReleasedSeqNos=releasedHoldSeqNos[i];
	var rowData = jQuery("#holdUnreleasedGrid").getRowData($("#holdUnreleasedGrid").getDataIDs()[i]);
	if(entityName=="variance" && ((rowData.holdCode=="VAR" && $("#IS_VARIANCE").val()=="Y") || (rowData.holdCode=="CNEE" && $.trim($("#IN_CONSIGNEE").val())==''))){
		return;
	}
	
	//var selectedHoldsToBeReleasedSeqNos = $("#holdUnreleasedGrid").getDataIDs()[0];
	//if(selectedHoldsToBeReleasedSeqNos==undefined){
	//	selectedHoldsToBeReleasedSeqNos = -1;
	//}
		
	var urlString;
	if(entityName=="booking" || entityName=="template"){
		urlString = _context+"/hold/releaseHolds?entityName="+entityName+"&releasedHoldSeqNos="+selectedHoldsToBeReleasedSeqNos+"&reEvaluationReqd=false&customerGroup="+$.trim($('#customerGroupId :selected').text())+"&loadDschGroup="+$.trim($('#loadDschServiceGroupCode').val());
	}
	else{
		urlString = _context+"/hold/selectedHoldRelease?entityName="+entityName+"&releasedHoldSeqNo="+selectedHoldsToBeReleasedSeqNos;
	}
	
	 $.ajax({
			url: urlString,
			success: function(responseText){
				if(responseText.success){
					if(entityName=="booking"){
						isBookingChanged = "Y";
						$('#bookingSave').trigger("click");
					}
					else if(entityName=="template"){
						isBookingChanged = "Y";
						$('#templateSave').trigger("click");
					}
					else if(entityName=="payment" || entityName=="sendDocument"){
						//window.opener.loadHoldGrid("D");
					}
					else if(entityName=="container" || entityName=="containerBilling"){
						loadHoldGrid("D");
					}
					loadHoldUnreleasedGrid();
					// Call for displaying unreleased holds
					getUnreleasedHoldCount(entityName);
				}
			}
		});
	}
}

function calculateUnreleasedHoldGridPosition(){
	var leftCoordinate = ($("#hold_link").offset().left + $("#hold_link").width()) - $('#holdsUnreleased').dialog( "option", "width") - 10;
	/*var topCoordinate = offset.top - ($('#holdsUnreleased').outerHeight() + $("#buttondiv").height());*/
	var topCoordinate = $("#hold_link").offset().top - $('#holdsUnreleased').outerHeight() - 45;
	$('#holdsUnreleased').dialog( "option", "position", [leftCoordinate, topCoordinate] );
	
	$(window).scroll(function() {
		$('#holdsUnreleased').dialog( "option", "position", [leftCoordinate, topCoordinate] );
	});
}

function openTargetSection(targetWebPageSection){
	var accordionIndex = '';
	if($("#entityName").val()=="booking" || $("#entityName").val()=="template"){
		if(targetWebPageSection=='Header'){
			window.scrollTo(0, 0);
		}
		else if(targetWebPageSection=='Parties'){
			accordionIndex = 1;
		}
		else if(targetWebPageSection=='Reference' || targetWebPageSection=='Marks'){
			accordionIndex = 2;
		}
		else if(targetWebPageSection=='Commodity'){
			if(addFreightEnabled()){
				$($('.booking-section')[4]).accordion("enable");
				accordionIndex = 4;
			}
			else{
				var offset = accordianPostionCoordinates(accordionIndex);
				window.scrollTo(offset.left, offset.top);
			}
		}
		else if(targetWebPageSection=='Special Service'){
			accordionIndex = 6;
		}
	}
	
	if(accordionIndex!=''){
		openTargetAccordian(accordionIndex);
		var offset = accordianPostionCoordinates(accordionIndex);
		window.scrollTo(offset.left, offset.top);
	}
}

function openTargetAccordian(accordionIndex){
	var status = $($('.booking-section')[accordionIndex]).accordion('option', 'active');
	if (typeof status == "boolean" && !status) {
		$($('.booking-section')[accordionIndex]).accordion('option', 'active', 0);
	}
}

function accordianPostionCoordinates(accordionIndex){
	return $($('.booking-section')[accordionIndex]).offset();
}

function resetHoldUnreleasedGrid(){
	if($("#holdsUnreleased").dialog("isOpen")==true){
		$("#holdsUnreleased").dialog("close");
	}
	$("a.holds").attr("href", "javascript:void(0)");
	$("#holdCount").html("(0)");
	if($("#holdRelease").css('visibility')=='visible'){
		$("#holdRelease").attr("disabled", true);
	}
}
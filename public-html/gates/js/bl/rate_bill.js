function openHoldsUnreleasedDialog(entityName, fetchURL){
	
	 $("#holdsUnreleased").dialog({
			width : 710,
			height : 220,
			title : 'Unreleased Holds',
			autoResize : true,
			modal: false,
			position: [400, 660],
//			close : function(event, ui) {
//				$("#shipmentHoldReleaseBtn").attr("disabled", true);
//				unloadHoldUnreleasedGrid();
//				
//				//On closing the holdUnreleasedGrid, change + to -
//				$("#holdCount").html($("#holdCount").text().replace("-", "+"));
//			}
		});
	
	createHoldUnreleasedGrid(entityName, fetchURL);
	$('#holdUnreleasedGrid').trigger('reloadGrid');
	$("#holdsUnreleased").dialog('open');
	
	/*$(window).resize(function() {
        $('body').css('height', $(this).height());
        $('#holdsUnreleased').dialog( "option", "position", [400, 660] );
    })
    .scroll(function(){
    		$(this).resize();
    	});	*/
	
	$(window).scroll(function() {
		$('body').css('height', $(this).height());
        $('#holdsUnreleased').dialog( "option", "position", [400, 660] );
	});
	
	
}


function createHoldUnreleasedGrid(entityName, fetchURL) {
	var holdDisplayColNames = ['','', '', '', '', ''];
	var holdDisplayColModels = [
	               {name:'holdId', index:'holdId', hidden:true},
	               {name:'holdCode', index:'holdCode', width:80, editable:false},
	               {name:'targetWebPage', index:'targetWebPage', width:80, hidden:true},
	               {name:'holdMz.messageText', index:'holdMz.messageText', width:320, editable:false, formatter:formatMessageText},
	               {name:'holdMz.targetWebPageSection', index:'holdMz.targetWebPageSection', width:80, editable:true, formatter:'showlink', formatoptions : {
         				baseLinkUrl : "javascript:",
       				showAction: "editHoldDisplay('",
       				addParam: "');" }
                   },
	               {name:'holdMz.highlightedAttributes', index:'holdMz.highlightedAttributes', width:160, editable:false},
			   	];

	var jsonReaderHoldDisplay = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"holdId"
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
		height: 160,
		multiselect:true,
		gatesOptions: {
			urls: {load: _context+fetchURL+'?entityName=shipment'},
			extraData: {
				customerGroup: function() {
					return $.trim($('#customerGroupId :selected').text());
				},
				loadDschGroup: function() {
					return  $.trim($('#loadDschServiceGroupCode').val());
				}
			},
			loadComplete: holdUnreleasedGridLoadComplete
		},
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

function unloadHoldUnreleasedGrid(){
	$('#holdUnreleasedGrid').jqGrid('GridUnload');
}

var holdUnreleasedGridLoadComplete = function(){
	//Default selection of first row
	jQuery("#holdUnreleasedGrid").setSelection($("#holdUnreleasedGrid").getDataIDs()[0], true);
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
};

function formatMessageText(cellvalue, options, rowObject){
	//alert("cellvalue: " + cellvalue);
	if(cellvalue != null && cellvalue.substring(0,3).toLowerCase()=='rvw'){
		cellvalue = '<span style="background-color:yellow">'+cellvalue+'</span>';
	}
	else if(cellvalue != null && cellvalue.substring(0,3).toLowerCase()=='req'){
		cellvalue = '<span style="background-color:red">'+cellvalue+'</span>';
	}

return cellvalue;
}

function editHoldDisplay(id) {
	var holdId = id.split('=')[1];
	var value =  jQuery("#holdUnreleasedGrid").getRowData(holdId).targetWebPage;
	if(value == 'Maintain Bill'){
		document.location.href = _context+ "/shipment/loadShipmentDetails?shipment_number="+ 
				$('#shipmentNumber').val()+'&shipment_sequence_number='+$('#shipmentSequenceNumber').val()+'&shipment_correction_number='+'000';
	}else if (value == 'Maintain Rate Bill'){
		document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
		$('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber='+'000';
		
	}

	//alert(holdCode);
}
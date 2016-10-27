
var _cmdtyGridCount = -1;
var shipmentForm = $('#shipmentForm').formSerialize();
var mixCommOverlayMode= "add";
var currentRowId='';
$(document).ready(
		function() {
			
			var isDeletable = true;
			var linkFormatter = "";
			var EditLink ="";
			
		
		
		});

	


function loadComplete(){
	$('#tr_shipmentItemId').remove();//Defect-25329-To delete extra empty row added
	if($('#statusCode').text()=='ISSUED'|| $('#statusCode').text()=='CORRECTED'){
		$("div.ui-pg-div.ui-inline-edit", "#gbox_mixcommodityGrid").hide();
		$("div.ui-pg-div.ui-inline-del", "#gbox_mixcommodityGrid").hide();
	$('#maintain_commodity_shipment').gatesDisable();
	enableDisableCommosityButtons();
	}else {
		
	/*	$('#maintain_commodity_shipment').gatesEnable();*/
		
		if(isCommodityBLMXUpdate){
			$("div.ui-pg-div.ui-inline-edit", "#gbox_mixcommodityGrid").show();
		}else{
			$("div.ui-pg-div.ui-inline-edit", "#gbox_mixcommodityGrid").hide();
		}
		if(isCommodityBLMXDelete){
			$("div.ui-pg-div.ui-inline-del", "#gbox_mixcommodityGrid").show();
		}else{
			$("div.ui-pg-div.ui-inline-del", "#gbox_mixcommodityGrid").hide();
		}
	}
	if($('#unitOfMeasureSourceCode :selected').val()=="I")
	{
		$('#mixcommodityGrid').setLabel("cube", "Cube(ft)");
		$('#mixcommodityGrid').setLabel("netWeight", "Net Weight(lbs)");
		$('#mixcommodityGrid').setColProp("netWeight",{formatoptions: {decimalPlaces: 0, thousandsSeparator: ""}});
	}
	else if($('#unitOfMeasureSourceCode :selected').val()=="M")
	{
		$('#mixcommodityGrid').setLabel("cube", "Cube(m)");
		$('#mixcommodityGrid').setLabel("netWeight", "Net Weight(kgs)");
		$('#mixcommodityGrid').setColProp("netWeight",{formatoptions: {decimalPlaces: 3,thousandsSeparator: ""}});
	}
	/*var mixCommGrid = $('#mixcommodityGrid').jqGrid('getDataIDs');
	var netWeight="";
	var cube="";
	for (var i = 0; i < mixCommGrid.length; i++) {
	  netWeight = jQuery("#mixcommodityGrid").getRowData( $('#mixcommodityGrid').jqGrid('getDataIDs')[i]).netWeight;
	   cube = jQuery("#mixcommodityGrid").getRowData( $('#mixcommodityGrid').jqGrid('getDataIDs')[i]).cube;
	   
	   if($('#unitOfMeasureSourceCode :selected').val()=="I")
	   {
		   netWeight = +(+netWeight).toFixed(0); 
		   cube = +(+cube).toFixed(0);
		   
	   }
	   else  if($('#unitOfMeasureSourceCode :selected').val()=="M")
	   {
		   netWeight = +(+netWeight).toFixed(2); 
		   cube = +(+cube).toFixed(2);  
	   }
	   var rowData = $('#mixcommodityGrid').jqGrid('getRowData', i+1);
	   rowData.cube = cube;
	   rowData.netWeight = netWeight;
	   $('#mixcommodityGrid').jqGrid('setRowData', i+1, rowData);
	}*/
	
	// I left this in as I didn't want to deal with it all right now but I believe the change I made to 
	// the number formater make it unnecessary. D032235
	tableLength = jQuery("#mixcommodityGrid").jqGrid('getGridParam', 'records');//$($('#mixcommodityGrid')).length;
	for(var i=1;i<=tableLength;i++)
	{
		var netWeight ="";
		var cube ="";
		if($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]!= undefined &&
				$($('#gbox_mixcommodityGrid table')[1]).children().children()[i] !=null)
		{
			if($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[4]!=undefined)
			netWeight = $($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[4].innerHTML;
			if($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[5]!=undefined)
			cube = $($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[5].innerHTML;
			
			if($('#unitOfMeasureSourceCode :selected').val()=="I")
			{
				netWeight = (parseFloat(netWeight.replace(/\s/g, ''))).toFixed(0); 
				cube = parseFloat(cube.replace(/\s/g, '') ).toFixed(0);
			   
			}
			else  if($('#unitOfMeasureSourceCode :selected').val()=="M")
			{
				netWeight =(parseFloat(netWeight.replace(/\s/g, '') )).toFixed(3);
				cube = parseFloat(cube.replace(/\s/g, '') ).toFixed(3);
			}
			// = netWeight.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
			//cube = cube.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		
			if($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[4]!=undefined)
				{
					$($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[4].innerHTML=netWeight;
					$($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[4]).attr('title',netWeight);
				}
			if($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[5]!=undefined)	
				{
					$($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[5].innerHTML=cube;
					$($($($('#gbox_mixcommodityGrid table')[1]).children().children()[i]).children()[5]).attr('title',cube);
				}

		}
	}
	
	
	// Set footer
	var userData = $("#mixcommodityGrid").getGridParam('userData');
	var netWeightSum = "";
	if(userData) {
		netWeightSum = userData.netWeightSum;
	}
	jQuery("#mixcommodityGrid").footerData('set',{itemNumber:'Total',netWeight:netWeightSum});
	
	
	// jqGrid load complete are temporary methods that are called once!
	//console.log("Inside method loadComplete, mix commodity code value:"+$('#mixCommodityCommodityCode').val()+" tariff "+$('#tariffNumber').val() );
	
	if($('#mixcommodityGrid').attr('nextRowId') != null) {
		openUpdateComodityOverLay($('#mixcommodityGrid').attr('nextRowId') );
		$('#mixcommodityGrid').attr('nextRowId',null);
	}
	
	
	if( $('#mixcommodityGrid').attr('finishShowCommodity') != null ) {
		//console.log("show");
		$('#mixcommodityGrid').attr('finishShowCommodity',null);
		finishShowAddCommodityDialog();
	}
	
}


function openUpdateComodityOverLayWithChangeCheck(rowId) {
	if(somethingChangedMixComm == true ){
        var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
 		if(conf== true ){
 			 openUpdateComodityOverLay(rowId);
	    }
	} else{
		openUpdateComodityOverLay(rowId);
	}
}

function openUpdateComodityOverLay(rowId){
	
	params = 
		"rowId="+rowId;
		 $.ajax({
			 type:"GET",
			 url:_context+"/shipmentCommodity/editCommodity",
			 data :params,
			 success: function(responseText){
				 somethingChangedMixComm = false;
				 $('#msgDivCommodityOverlay').html("");
				 if(responseText.success==true) {
					 setValueInCommodityOverlayEdit(responseText.data);
				 }
				 $(":button:contains('Add & New')").prop("disabled", true).addClass("ui-state-disabled");
		     var position = loadPreviousAndNext(rowId);
		     $("#commodityDescPage").dialog( "option", "title", 'Edit Commodity row '+position+' for '+$('#equipmentNumber').val() );
		     mixCommOverlayMode ="edit";
		    
		     loadItemDataForMixCommodity();
		  //   updateMixCommKindList(responseText);
		   fetchCommodityCodeList($('#tariffNumber').val(),responseText.data.itemNumber,null,true,null);
		   $('#mixCommodityCommodityCode').val(responseText.data.commodityCode);

		     $("#commodityDescPage").dialog('open');
		     {
		    	 if($('#unitOfMeasureSourceCode :selected').val()=="I")
				   {
					var netWeight = (parseFloat($('#mixCommNetWgt').val().replace(/\s/g, '') )).toFixed(0);
					$('#mixCommNetWgt').val(netWeight);
					//Added not null verifying condition for Defect D026515
					if($('#mixCommCube').val()!="")
					{
					var cube = parseFloat($('#mixCommCube').val().replace(/\s/g, '')).toFixed(0);
					$('#mixCommCube').val(cube);
					}
					   
				   }
		     }
		     
	}
		 });
	}	
function setValueInCommodityOverlayEdit(data){
	$('#mixCommItem').removeClass("itemError");
	$('#mixCommCommDesc').attr('disabled', false);
	
	$('#mixCommItem').val(data.itemNumber);
	$('#mixCommItemId').val(data.itemNumber);
	$('#mixCommPieces').val(data.piece);
	$('#mixCommNetWgt').val(data.netWeight);
	if(data.kind!='' && data.kind!='null')
	$('#mixCommKind').val(data.kind);
	$('#mixCommCube').val(data.cube);
	$('#mixCommNote').val(data.note);
	$('#mixCommCommDesc').val(data.commodityDesc);
	$('#mixCommItemId').val(data.item);
	$('#mixCommShipmentItemId').val(data.shipmentItemId);
	$('#mixCommUnitOfCommodity').val(data.unitOfCommodity);
	
	  
		
     
      
      
	
	$('#mixCommodityCommoditycommentId').val(data.commentId);
	$('#mixCommodityCommodityCode').val(data.commodityCode);

	//console.log("Inside method setValueInCommodityOverlayEdit, mix commodity code value:"+$('#mixCommodityCommodityCode').val());
	
	populateMixCommodityCodeListBilling(data.commodityCodeList);
	$('#mixCommItem').focus();
	if($('#tariffNumber').val()=="" || $('#tariffNumber').val()==null){
		 // 026586: add an error if this happens
		 $('#msgDivCommodityOverlay').html("Tariff Item disabled, enter a tariff #");
		 $('#msgDivCommodityOverlay').addClass("itemError");
		 $('#mixCommItem').attr("readOnly",true);
		 
	 }else{
		 $('#mixCommItem').attr("readOnly",false);
	 }
	
}

function loadItemDataForMixCommodity() {
	if(window.itemList == null) {
		var tariff = $('#tariffNumber').val();
		if(tariff !="" && tariff !=null){
			loadTariffItems(tariff);
		}
	}
	
}

function populateTariffItems(data) {
	window.itemList = data;
	for (var i=0; i<window.itemList.length ; i++) {
   		 window.itemList[i].label = window.itemList[i].name+" - "+window.itemList[i].description;
   		 window.itemList[i].value = window.itemList[i].description;
   		 
	}
	
	 $("#mixCommCommDesc").autocomplete({
		  source: window.itemList,
		  select: function( event, ui ) {
			  $('#mixCommItem').val( ui.item.name);
			  $('#mixCommNote').val("");
			  $('#mixCommItem').removeClass("itemError");
			 // console.log("Inside mixCommCommDesc autocomplete select function");
			 fetchCommodityCodeList($("#tariffNumber").val(),$("#mixCommItem").val(),ui.item.description,true,ui.item.id);
		  },
	 	  change: function (event, ui) {
	 		var found = false;  
	 		var val = $('#mixCommItem').val();
	 		if(val != null) val = val.trim();
	 		
	 		if(window.itemList != null) {
	 			for (var i=0; i<window.itemList.length ; i++) {
	 				var item = window.itemList[i];
	 				if(item.name.trim() == val) {
	 					found = true;
	 				}
	 			}	
			}
	 		if(found) {
	 			$('#mixCommItem').removeClass("itemError");
	 		} else {
	 		    $('#mixCommItem').addClass("itemError");
	 		}
	 	//	console.log("Inside mixCommCommDesc autocomplete change function");
	 	  }
		});
}

function loadTariffItems(tariffNumber) {
	blockUI();
	
	// load kinds
	$.ajax({
		 async:false,
		 type:"GET",
		 timeout: 100000,
		 url: _context+'/cas/autocomplete.do?term='+tariffNumber+'&method=searchTariffSourceWithItemName&searchType=43&mustMatch=true&groupType=ALL',
		 dataType: "json",
		 success: function( data, status ) {
			 populateTariffItems(data[0].items);
			 $.unblockUI();
		 },
		 error: function(jqXHR, textStatus, errorThrown) {
			 $.achtung({
	                className: 'achtungFail',
	                timeout: 3000,
	                message: 'Reload Tariff'
	            }); 
			 $.unblockUI();
		 }
	 }); 	
	
	$.ajax({
		 async:false,
		 type:"GET",
		 timeout: 100000,
		 url: _context+'/cas/autocomplete.do?term='+tariffNumber+'&method=searchTariffSourceWithItemName&searchType=43&mustMatch=true&groupType=ALL',
		 dataType: "json",
		 success: function( data, status ) {
			 populateTariffItems(data[0].items);
			 $.unblockUI();
		 },
		 error: function(jqXHR, textStatus, errorThrown) {
			 $.achtung({
	                className: 'achtungFail',
	                timeout: 3000,
	                message: 'Reload Tariff'
	            }); 
			 $.unblockUI();
		 }
	 }); 
}	

function getNextRowId(currentRowId) {
	var rows = $('#mixcommodityGrid').jqGrid('getDataIDs');
	
	var position = 0;
	for (;position<rows.length;position++) {
		if(rows[position] == currentRowId) break;
	}
	position++;
	
	if(position < rows.length ) {
		return rows[position];
	} else { 
		return -1;
	}
}

function getLineNumber(id) {
	var dataFromTheRow = jQuery("#mixcommodityGrid").jqGrid ('getRowData', id);
	if(dataFromTheRow != null) return  parseInt(dataFromTheRow.unitOfCommodityDisplay);
	return -1;
}

function getMinLineNumber() {
	var id = $('#mixcommodityGrid').jqGrid('getDataIDs')[0];
	var dataFromTheRow = jQuery("#mixcommodityGrid").jqGrid ('getRowData', id);
	if(dataFromTheRow != null) {
		var pos =  parseInt(dataFromTheRow.unitOfCommodityDisplay);
		if(isNaN(pos)) return 1;
		return pos;
	}
	return 1;
}

function getMaxLineNumber() {
	var rows = $('#mixcommodityGrid').jqGrid('getDataIDs');
	var id = rows[rows.length-1];
	var dataFromTheRow = jQuery("#mixcommodityGrid").jqGrid ('getRowData', id);
	if(dataFromTheRow != null) {
		var pos = parseInt(dataFromTheRow.unitOfCommodityDisplay);
		if(isNaN(pos)) return -1;
		return pos;
	}
	return -1;
}

function getPosition(id) {
	var rows = $('#mixcommodityGrid').jqGrid('getDataIDs');
	var position = 0;
	for (;position<rows.length;position++) {
		if(rows[position] == id) return position;
	}
	return -1;
}

function getPositionPastEnd(lineNumber) {
	var rows = $('#mixcommodityGrid').jqGrid('getDataIDs');
	var lastId = rows[rows.length-1];
	var lastLineNumber = getLineNumber(lastId);
	return lineNumber - lastLineNumber + rows.length-1;
}



function loadNewRow() {
	return loadOverlayData(-1);
}

function loadPreviousAndNext(rowIdIn) {
	return loadOverlayData(rowIdIn);
}

// Global variables, 
var currentOverlayPosition = 0;
var currentOverlayCnt = 0;

function loadOverlayData(id) {
	currentOverlayPosition = 0;
	
	
	id = parseInt(id);
	
	var position = -1;
	var lineNumber = 0;
	var maxLoadedIndex= getMaxLineNumber();
	var minLoadedIndex = getMinLineNumber();
	//console.log(maxLoadedIndex+" "+minLoadedIndex);
	
	if(id == -1) {
		//lineNumber = total+1;
		lineNumber = maxLoadedIndex+1;
		position = getPositionPastEnd(lineNumber);
	} else {
		lineNumber = getLineNumber(id);
		position = getPosition(id);
	}
	lineNumber = parseInt(lineNumber);
	
	var index = lineNumber-7;
	var finalCnt = 2;
	
	
	if(index < minLoadedIndex) { 
		finalCnt = 9-lineNumber+minLoadedIndex ;
		index = minLoadedIndex;
	}
	
	var maxIndex = lineNumber+finalCnt;
	if(maxIndex > maxLoadedIndex)  {
		index +=  maxLoadedIndex - maxIndex;
		if(index < minLoadedIndex) index = minLoadedIndex;
		
		maxIndex = maxLoadedIndex;
	}
	
	if(index < lineNumber) {
		var top = getHeaderString();
		currentOverlayCnt = 0;
		for(;index<lineNumber;index++) 
		{
			var pos=position-lineNumber+index;
			if((pos>0)||(pos==0))
			{
		    top+= getRow(index,pos);			
			}
		}
			
		top += "</table>";
		
		$("#mixedCommPreviousItems").html(top);
	} else {
		$("#mixedCommPreviousItems").html("");
	}
	
	
	
	
    index = parseInt(lineNumber)+1;
    if(index<=maxIndex) {
	    var bottom = "<table class=\"ui-jqgrid-htable ui-jqgrid\" cellspacing=\"0\" cellpadding=\"1\" border=\"0\" width=\"98%\">";
	    bottom+= "<thead><tr class=\"ui-jqgrid-labels\" >";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Line</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Item</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Net Weight(lbs)</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Cube(ft)</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Pieces</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Kind</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Note</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Commodity Description</div></th>";
	    bottom+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">&nbsp;</div></th>";
	    bottom+= "</tr></thead>";
		
	    currentOverlayCnt = 0;
		for(;index<=maxIndex;index++) {
			bottom+= getRow(index,position-lineNumber+index);
		}
		bottom += "</table>";
		
		$("#mixedCommNextItems").html(bottom);
    } else {
    	$("#mixedCommNextItems").html("");
    }
    return lineNumber;
	
}



function getRow(lineNumber, position) {
	var displayLineNumber = parseInt(lineNumber);
	currentOverlayPosition = displayLineNumber;
	var result = "";
	var rows = $('#mixcommodityGrid').jqGrid('getDataIDs');
	if(position < 0 || position >= rows.length) {
		var classValue = "ui-widget-content jqgrow ui-row-ltr";
		if(currentOverlayCnt%2 == 1) classValue += " uiAltRowClass";
		result +="<tr  class=\""+classValue+"\"><td>"+displayLineNumber+"</td><td colspan=\"8\">-------------------------</td></tr>";
	} else {
		var id = rows[position];
		var dataFromTheRow = jQuery("#mixcommodityGrid").jqGrid ('getRowData', id);
		var classValue = "ui-widget-content jqgrow ui-row-ltr";
		if(currentOverlayCnt%2 == 1) classValue += " uiAltRowClass";
		result +="<tr class=\""+classValue+"\">";
		result += "<td>"+dataFromTheRow.unitOfCommodityDisplay+"</td>";
		result += "<td style=\"text-align:right;\" class=\"monotype\">"+dataFromTheRow.itemNumber+"</td>";
		result += "<td style=\"text-align:right;\">"+dataFromTheRow.netWeight+"</td>";
		result += "<td style=\"text-align:right;\">"+dataFromTheRow.cube+"</td>";
		result += "<td style=\"text-align:right;\">"+dataFromTheRow.piece+"</td>";
		result += "<td>"+dataFromTheRow.kind+"</td>";
		result += "<td>"+dataFromTheRow.note+"</td>";
		result += "<td>"+dataFromTheRow.commodityDesc+"</td>";
		result += "<td ><div style=\"cursor: pointer;\" class=\"ui-pg-div  \" onclick=\"openUpdateComodityOverLayWithChangeCheck("+id+")\" onmouseover=\"jQuery(this).parent().parent().addClass('ui-state-hover');\" onmouseout=\"jQuery(this).parent().parent().removeClass('ui-state-hover')\"><span class=\"ui-icon ui-icon-pencil\"></span></div></td>";
		result +="</tr>";
	}
	currentOverlayCnt++;
	return result;
}

function getHeaderString() {
	var top = "<table class=\"ui-jqgrid-htable ui-jqgrid\" cellspacing=\"0\" cellpadding=\"1\" border=\"0\" width=\"98%\">";
	top+= "<thead><tr class=\"ui-jqgrid-labels\">";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Line</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Item</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Net Weight(lbs)</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Cube(ft)</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Pieces</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Kind</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Note</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">Commodity Description</div></th>";
	top+= "<th class=\"ui-state-default ui-th-column ui-th-lt\"><div class=\"ui-jqgrid-sortable\">&nbsp;</div></th>";
	top+= "</tr></thead>";
	return top;
}

function addRowToMixCommodityGrid(position, itemNumber, netWeight, cube, piece, kind, note, commodityDesc) {
	var classValue = "ui-widget-content jqgrow ui-row-ltr";
	if(currentOverlayCnt%2 == 1) classValue += " uiAltRowClass";
	currentOverlayCnt++;
	currentOverlayPosition++;
	var result ="<tr class=\""+classValue+"\">";
	result += "<td>New</td>";
	result += "<td style=\"text-align:right;\" class=\"monotype\" >"+itemNumber+"</td>";
	result += "<td style=\"text-align:right;\">"+netWeight+"</td>";
	result += "<td style=\"text-align:right;\">"+cube+"</td>";
	result += "<td style=\"text-align:right;\">"+piece+"</td>";
	result += "<td>"+kind+"</td>";
	result += "<td>"+note+"</td>";
	result += "<td>"+commodityDesc+"</td>";
	result +="</tr>";
	
	var html = $("#mixedCommPreviousItems").html();
	//console.log("html="+html);
	if(html.length == 0) {
		html = getHeaderString()+result+"</table>";
	} else {
	
		html = html.substring(0,html.length-8)+result+"</table>";
    }
	$("#mixedCommPreviousItems").html(html);
	
}

function populateMixCommodityCodeListBilling(list){
	//console.log("Inside populateMixCommodityCodeListBilling, list length:"+list.length);
	//alert("ShipmentCommodityCd val:"+$('#shipmentCommodityCode').val()+", mix comm cd val:"+$('#mixCommodityCommodityCode').val());
	var shmtCommCode = $('#mixCommodityCommodityCode').val();
//	alert("Inside populateCommodityCodeListBilling, shipment Commodity code:"+shmtCommCode);
	$('select#mixCommCommodityCode').children().remove().end().append('<option selected value="">Select</option>');
	if(list != null)
	{
		for ( var i = 0; i < list.length; i++) {
	
			$('select#mixCommCommodityCode').append($("<option/>", {
				value : list[i].code,
				text : list[i].code + " - " +list[i].description
			}));
//			alert("value:"+list[i].code+",text:"+list[i].code + " - " +list[i].description);
			if(shmtCommCode.length>0 && shmtCommCode==list[i].code){
				$('#mixCommCommodityCode').val($.trim(list[i].code));
//				alert("Dropdown code set to:"+$('#commodityCode').val());
			}
		}
		
		if(list.length==1){
			//alert("List length 1, code:"+$.trim(list[0].code));
			$('#mixCommCommodityCode').val($.trim(list[0].code));
			$('#mixCommodityCommodityCode').val($.trim(list[0].code));
	
		}
		
	}
	
}

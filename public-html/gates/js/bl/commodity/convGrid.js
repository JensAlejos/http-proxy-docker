$(document).ready(
		function() {
			
			var isDeletable = true;
			var linkFormatter = "";
			var EditLink ="";
		
			 
	});

function lclGridLoadComplete(){
	$('.FormData' ).each(function() {
		if(( $('#statusCode').text()=='ISSUED') || ($('#statusCode').text()=='CORRECTED')){
        if($(this).attr('id') == "tr_shipmentConvFreightId" ){
               if(i != 0){
                     $(this).remove();
               }
               i++;
        }
	}
 });
	
	$('#tr_shipmentConvFreightId').show();
	if(isCommodityBLCVAdd==false){
	$('#tr_shipmentConvFreightId').hide();
	}
	$('#tr_shipmentConvFreightId td input').val("");

	var reccountConvGrid = $('#convGrid').jqGrid('getDataIDs');	
	for (var i = 0; i < reccountConvGrid.length; i++) {
		if(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]). isDeletable=="Delete"){
			 var data = $("#convGrid").jqGrid('getRowData', $('#convGrid').jqGrid('getDataIDs')[i]);
			 data.isDeletable ="<span class='ui-icon ui-icon-trash'></span>";
			 jQuery("#convGrid").jqGrid('setRowData', $('#convGrid').jqGrid('getDataIDs')[i], data);
		}		
		jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).edit
	}
	var grid = $("#convGrid");
	var pos=getColumnIndexByConvGridName(grid,'actionLinkUnlink');
	
	if($('#statusCode').text()=='ISSUED'|| $('#statusCode').text()=='CORRECTED'){
		$("div.ui-pg-div.ui-inline-edit" ,"#gbox_convGrid").hide();		
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);		
		$('#tr_shipmentConvFreightId').hide();
		enableDisableCommosityButtons();
	}
	else
	{	
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);	
		$('#tr_shipmentConvFreightId').show();
	}

	var conGridSize = $('#convGrid>tbody>tr').size();
	for(var j =1;j< conGridSize;j++){
		$($($('#convGrid>tbody>tr')[j]).children()[14]).find('.ui-inline-del').remove();
	}
	var j =1;
	for (var i = 0; i < reccountConvGrid.length; i++) {
		if(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).actionLinkUnlink=="LINK" || 
				(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).actionLinkUnlink).trim()==""){
			$($("div.ui-pg-div.ui-inline-edit")[i], "#"+$('#convGrid').jqGrid('getDataIDs')[i]).hide();
			j++;
		}
	}

	
}

function convGridLoadComplete(){
	// added for security
	/*$grid = jQuery("#convGrid");
	$grid.jqGrid('setGridWidth', 900);*/
	//D025042, Fix for Conventional grid duplication
/*	var i = 0;
	$('#tr_shipmentConvFreightId' ).each(function() {
		if(i != 0)
			$('#tr_shipmentConvFreightId').remove();
		i++;
	});*/
	$('.FormData' ).each(function() {
		if(( $('#statusCode').text()=='ISSUED') || ($('#statusCode').text()=='CORRECTED')){
        if($(this).attr('id') == "tr_shipmentConvFreightId" ){
               if(i != 0){
                     $(this).remove();
               }
               i++;
        }
	}
 });
	
	$('#tr_shipmentConvFreightId').show();
	if(isCommodityBLCVAdd==false){
	$('#tr_shipmentConvFreightId').hide();
	}
	/*if(($('#loadServiceCode').val()=="FI" && $('#dischargeServiceCode').val()=="FO")||($('#loadServiceCode').val()=="FO" && $('#dischargeServiceCode').val()=="FI")){*/
	$('#tr_shipmentConvFreightId td input').val("");
		// jQuery("#convGrid").hideCol('actionLinkUnlink');
	/*}
	if($('#loadServiceCode').val()=="FI"){
	 if($('#dischargeServiceCode').val()=="FO"){
		 $('#tr_shipmentConvFreightId').show();
	 }
	 else{
		 $('#tr_shipmentConvFreightId').hide();
	 }
	}
	else if($('#loadServiceCode').val()=="FO"){
	 if(!$('#dischargeServiceCode').val()=="FI"){
		 $('#tr_shipmentConvFreightId').show();
	 }else{
		 $('#tr_shipmentConvFreightId').hide();
	 }
	}
	else{
	 $('#tr_shipmentConvFreightId').hide();shipmen
	}*/


	var reccountConvGrid = $('#convGrid').jqGrid('getDataIDs');
	
	for (var i = 0; i < reccountConvGrid.length; i++) {
		if(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]). isDeletable=="Delete"){
			 var data = $("#convGrid").jqGrid('getRowData', $('#convGrid').jqGrid('getDataIDs')[i]);
			 data.isDeletable ="<span class='ui-icon ui-icon-trash'></span>";
			 jQuery("#convGrid").jqGrid('setRowData', $('#convGrid').jqGrid('getDataIDs')[i], data);
		}
		
		jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).edit
	}
	var grid = $("#convGrid");
	var pos=getColumnIndexByConvGridName(grid,'actionLinkUnlink');
	var deletepos=getColumnIndexByConvGridName(grid,'isDeletable');
	if($('#statusCode').text()=='ISSUED'|| $('#statusCode').text()=='CORRECTED'){
		$("div.ui-pg-div.ui-inline-edit" ,"#gbox_convGrid").hide();
		
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[deletepos].name);
		$('#tr_shipmentConvFreightId').hide();
		enableDisableCommosityButtons();
	}
	else
	{
	//$('#maintain_commodity_shipment').gatesEnable();
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);
		grid.jqGrid('showCol', grid.getGridParam("colModel")[deletepos].name);
		$('#tr_shipmentConvFreightId').show();
	}

	var conGridSize = $('#convGrid>tbody>tr').size();
	for(var j =1;j< conGridSize;j++){
		$($($('#convGrid>tbody>tr')[j]).children()[14]).find('.ui-inline-del').remove();
	}
	var j =1;
	for (var i = 0; i < reccountConvGrid.length; i++) {
		if(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).actionLinkUnlink=="LINK" || 
				(jQuery("#convGrid").getRowData( $('#convGrid').jqGrid('getDataIDs')[i]).actionLinkUnlink).trim()==""){
			$($("div.ui-pg-div.ui-inline-edit")[i], "#"+$('#convGrid').jqGrid('getDataIDs')[i]).hide();
			j++;
		}
	}
	//added against 21739
 	/*if(counterConvGridReloaded==0){
 		numberOfInitialRowsConv=jQuery("#convGrid").jqGrid('getGridParam', 'records');
 		counterConvGridReloaded++;
 	}
 	if(numberOfInitialRowsConv != jQuery("#convGrid").jqGrid('getGridParam', 'records')){
 		changeInCommodity=true;
 	}*/

 	//to set TCN as editable field or not-18593
 	rowId=$("#convGrid").getDataIDs();
 	if(rowId.length>0){
 		firstRowId = rowId[0];	//check LDSP data for only one row as same for all
 		var loadDischargeServPair = $('#convGrid').jqGrid('getCell',firstRowId,'loadDischargeServicePair');	//loadDischargeServPair is a hidden field in grid
	 		if(loadDischargeServPair!=null && loadDischargeServPair!=""){
	 			if(loadDischargeServPair=="CON-CON" || loadDischargeServPair=="CON-CY" || loadDischargeServPair=="RO-RO"){
		 			jQuery('#convGrid').setColProp('militaryTcn',{editable:true}); 
		 		}else{
		 			jQuery('#convGrid').setColProp('militaryTcn',{editable:false}); 
		 		}
	 		}
 	}

}

function actionToLinkUnLinkConv(id){
	
	var shipmentFreightId =id.split('=')[1];
		$.ajax({
			url : _context +"/shipmentCommodity/actionContainerToCommodityConv",
			type : "GET",
			data : {
				unitOfCommodity :  $("#unitOfCommodity").val(),
				shipmentFreightId: shipmentFreightId,
				unitOfMeasure: $('#unitOfMeasureSourceCode :selected').val()
			},
			success : function(responseText) {
				if(responseText.success==true){			
				$("#convGrid").trigger('reloadGrid');
				if($("#convGrid").getGridParam("reccount")>0){ 
					$('#tr_shipmentConvFreightId').hide();
				}
				$("#cmdLineLink").text(responseText.data.cmdLineLink+"/");
				$("#cmdLinks").text(responseText.data.cmdLinks+"/");
				$("#totalEqpts").text(responseText.data.totalEqpts);
				if($('#loadDschServiceGroupCode').val()!=null && $('#loadDschServiceGroupCode').val().trim()=="LCL"){
					$("#piece").val(responseText.data.piece);
					$("#kind").val(responseText.data.kind);
					if($('#unitOfMeasureSourceCode :selected').val()=="I") {
						$("#netWeight").val(Math.round(responseText.data.netWeight).toFixed(0));
						$("#cube").val(Math.round(responseText.data.cube).toFixed(0));
					}else{
						$("#netWeight").val(responseText.data.netWeight);
						$("#cube").val(responseText.data.cube);
					}
				}
				 $('#msgDivCommodity').html("");
			}
				else{
					showResponseMessages("msgDivCommodity", responseText);
				}
				}});
	}
function actionDelete(id){
	
	var shipmentFreightId =id.split('=')[1];
	$.ajax({
		url : _context +"/shipmentCommodity/actionDelete",
		type : "GET",
		data : {
			
			shipmentFreightId: shipmentFreightId
		},
		success : function(responseText) {
			if(responseText.success==true){
		
				 $("#convGrid").trigger('reloadGrid');
					if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
			$("#cmdLineLink").text(responseText.data.cmdLineLink+"/");
			$("#cmdLinks").text(responseText.data.cmdLinks+"/");
			$("#totalEqpts").text(responseText.data.totalEqpts);
			 $('#msgDivCommodity').html("");
		}
			else{
				showResponseMessages("msgDivCommodity", responseText);
			}
			}});
	
}

function validateTINConfirm(militaryTcn){
	// D030511: 	"TCN is not unique" pops up multiple times when adding tcns 
	// disable this method but doesn't look like it is being used.
	return true;
	
	/*
	if(militaryTcn!=null ){
	$.ajax({
		url : _context +"/shipmentCommodity/validateTIN",
		type : "GET",
		data : {
			
			validateTIN: militaryTcn
		},
		success : function(responseText) {
			if(responseText.success==true){
				return true;
		}
			else{
				var isConfirm = confirm("TCN is not unique. Exists on another Shipment. Override? (Y/N)");
				if (isConfirm) {
					return true;
			}else{
				return false;
			}
			}}});
	} */
	
}

var getColumnIndexByConvGridName = function(grid,columnName) {
	var cm = $("#convGrid").jqGrid('getGridParam','colModel');
	for (var i=0,l=cm.length; i<l; i++) {
	    if (cm[i].name===columnName) {
	        return i;
	    }
	}
	return -1;
	};



var _cmdtyGridCount = -1;
var shipmentForm = $('#shipmentForm').formSerialize();
var currentRowId='';
$(document).ready(
		function() {
			
			var isDeletable = true;
			var linkFormatter = "";
			var EditLink ="";
			
			currentRowId='';
			
	/*		$('#commodityGrid').gatesGrid({
				caption: "Container",
				colNames: colNamesForContainer,
				colModel: colModelForContainer,
				jsonReader: jsonReaderContainer,
				pager: '#pagerCommodityGrid',
				rowNum:6,
				rowList: [ 5, 10 ],
				gatesOptions: {
					urls: {
						load: '../shipmentCommodity/loadContainerGrid', 
						edit: '../shipmentCommodity/updateContainerGrid' 
					},
					controls: {
						navBar: true,
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete: false, //- multiDelete
						
						inlineAdd: true, //- hideCustomAddRow
						inlineEdit: true, //- hideEdit
						inlineDelete: false //- hideDelete
					}
				},
				beforeEditCell: function(rowid, cellname, value, iRow, iCol) {
				   // here identify row based on rowid
				   // if the row should not be editable than simply make the cells noneditable using
					jQuery('#commodityGrid').editCell(iRow, iCol, false);
					jQuery('#commodityGrid').jqGrid("restoreCell", iRow, iCol);
				},
                  
				beforeRowEdit: function(rowid){
					 alert ("edited"); 
				}
				
			});*/

		
	});



function containerGridLoad(){
	$('#tr_shipmentFreightId').remove();
	if($('#statusCode').text()=='ISSUED'|| $('#statusCode').text()=='CORRECTED' ||$('#statusCode').text()==""){
		$("div.ui-pg-div.ui-inline-edit","#gbox_commodityGrid").hide();
		var grid = $("#commodityGrid");
		var pos=getColumnIndexByName(grid,'actionLinkUnlink');
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);
		//$('#maintain_commodity_shipment').gatesDisable();
		enableDisableCommosityButtons();
	}else {
		
		//$('#maintain_commodity_shipment').gatesEnable();
		
		if(isCommodityBLCNUpdate){
		$("div.ui-pg-div.ui-inline-edit","#gbox_commodityGrid").show();
		}
		if(isCommodityBLCNLink){
		var grid = $("#commodityGrid");
		var pos=getColumnIndexByName(grid,'actionLinkUnlink');
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);
		}
	}
	
	var tradeCode = $('#tradeCode').val();
	var grid = $("#commodityGrid");
	var pos=getColumnIndexByName(grid,'temperatureDual');
	if(tradeCode != 'A'){	
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);
	} else {
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);
	}
	
	var reccountContainerGrid = $('#commodityGrid').jqGrid('getDataIDs');
	
	
	for (var i = 0; i < reccountContainerGrid.length; i++) {
		if(jQuery("#commodityGrid").getRowData(reccountContainerGrid[i]).isContainerLinked!="YES"){
			$($("#commodityGridDiv div.ui-pg-div.ui-inline-edit")[i], "#"+reccountContainerGrid[i]).hide();
		}
		
		if(jQuery("#commodityGrid").getRowData(reccountContainerGrid[i]).isPreReceivedContainer=="true"){
			
			 $('#commodityGrid').jqGrid('setCell', reccountContainerGrid[i], 'equipDesc','','',{style: 'background-color : yellow'},'');
		}else{


		}
	}
	callBillActionAfterSave = true;
	
	
}

function enableDisableCommosityButtons(){
	if($('#commodityLine').html()!='1'){
		$('#previousCommodity').attr("disabled",false);
		$('#nextCommodity').attr("disabled",false);
		$('#unitOfCommodity').attr("disabled",false);
		$('#mixedCommodityView').attr("disabled",false);
		
		$('#updateCommodity').attr("disabled",true);
		$('#clearCommodity').attr("disabled",true);
		$('#addCommodity').attr("disabled",true);
		$('#deleteCommodity').attr("disabled",true);
		
		buttons();
	}else{
		$('#previousCommodity').attr("disabled",true);
		$('#nextCommodity').attr("disabled",true);
		$('#unitOfCommodity').attr("disabled",true);
		$('#updateCommodity').attr("disabled",true);
		$('#clearCommodity').attr("disabled",true);
		$('#addCommodity').attr("disabled",true);
		$('#deleteCommodity').attr("disabled",true);
		$('#mixedCommodityView').attr("disabled",false);
		buttons();
	}
	$('#HHGDSCommodity').attr("disabled",false);
	if($('#totalEquipment').html()!='1'){
		
		
		$('#previousEquipment').attr("disabled",false);
		$('#nextEquipment').attr("disabled",false);
	}else{
		$('#previousEquipment').attr("disabled",true);
		$('#nextEquipment').attr("disabled",true);
		
		
	}
	
}

function buttons(){
	var unitOfCommodity = Number($("#unitOfCommodity option:selected").text());
	var commodityLine = Number($('#commodityLine').html());
	if((unitOfCommodity == commodityLine) && (commodityLine ==1)){
		$('#previousCommodity').attr("disabled","disabled");
		$('#nextCommodity').attr("disabled","disabled");
	}else if((unitOfCommodity == commodityLine) && (commodityLine ==0)){
		$('#previousCommodity').attr("disabled","disabled");
		$('#nextCommodity').attr("disabled","disabled");
		$('#clearCommodity').attr("disabled","disabled");
		$('#deleteCommodity').attr("disabled","disabled");
		$('#updateCommodity').attr("disabled","disabled");
		
	}else if(unitOfCommodity == commodityLine){
		$('#nextCommodity').attr("disabled","disabled");
		$('#previousCommodity').attr("disabled",false);
	}else if(unitOfCommodity==1){
		$('#previousCommodity').attr("disabled","disabled");
		$('#nextCommodity').attr("disabled",false);
	}else{
		$('#nextCommodity').attr("disabled",false);
		$('#previousCommodity').attr("disabled",false);
	}
}

function actionToLinkUnLink(id){
	
var shipmentFreightId =id.split('=')[1];
	$.ajax({
		url : _context +"/shipmentCommodity/actionContainerToCommodity",
		type : "GET",
		data : {
			unitOfCommodity :  $("#unitOfCommodity").val(),
			shipmentFreightId: shipmentFreightId,
			unitOfMeasure: $('#unitOfMeasureSourceCode :selected').val()
		},
		success : function(responseText) {
			if(responseText.success==true){
		
			$('#commodityGrid').trigger('reloadGrid');
			$("#cmdLineLink").text(responseText.data.cmdLineLink+"/");
			$("#cmdLinks").text(responseText.data.cmdLinks+"/");
			$("#totalEqpts").text(responseText.data.totalEqpts);
			
			if($('#unitOfMeasureSourceCode :selected').val()=="I") {
				$("#netWeight").val(Math.round(responseText.data.netWeight).toFixed(0));
				$('#cube').val(Math.round(responseText.data.cube).toFixed(0));
			}else{
				$("#netWeight").val(responseText.data.netWeight);
				$('#cube').val(responseText.data.cube);
			}

			$('#piece').val(responseText.data.piece);
			$('#kind').val(responseText.data.kind);
			 $('#msgDivCommodity').html("");
			 somethingChanged = true;
			 saveBillBeforeBillButton = true;
			 setTimeout(function(){ $('#isAnyGridChanged').val("true"); }, 1000); //D027692
		}
			else{
				showResponseMessages("msgDivCommodity", responseText);
			}
			}});
}


var getColumnIndexByName = function(grid,columnName) {
var cm = grid.jqGrid('getGridParam','colModel');
for (var i=0,l=cm.length; i<l; i++) {
    if (cm[i].name===columnName) {
        return i;
    }
}
return -1;
};
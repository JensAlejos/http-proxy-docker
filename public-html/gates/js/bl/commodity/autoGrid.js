$(document).ready(
		function() {
			
			var isDeletable = true;
			var linkFormatter = "";
			var EditLink ="";
				});

function actionToLinkUnLinkPov(id){
	
	var shipmentFreightId =id.split('=')[1];
		$.ajax({
			url : _context +"/shipmentCommodity/actionContainerToCommodityPov",
			type : "GET",
			data : {
				unitOfCommodity :  $("#unitOfCommodity").val(),
				shipmentFreightId: shipmentFreightId,
				unitOfMeasure: $('#unitOfMeasureSourceCode :selected').val()
			},
			success : function(responseText) {
				if(responseText.success==true){
			
				$('#povGrid').trigger('reloadGrid');
				$("#cmdLineLinkPov").text(responseText.data.cmdLineLink+"/");
				$("#pieceValue").text(responseText.data.cmdLineLink);	
				
				$("#totalEqptsPov").text(responseText.data.totalEqpts);
				 $('#msgDivCommodity').html("");
			}
				else{
					showResponseMessages("msgDivCommodity", responseText);
				}
				}});
	}

function callloadCompleteAuto(){
	
	
	//$('#commodityGrid').jqGrid('clearGridData');
	
	if($('#statusCode').text()=='ISSUED'|| $('#statusCode').text()=='CORRECTED'){
		$("div.ui-pg-div.ui-inline-edit" ,"#gbox_povGrid").hide();
		var grid = $("#povGrid");
		var pos=getColumnIndexByName(grid,'actionLinkUnlink');
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);
		enableDisableCommosityButtons();
		
	}/*else {
		if(isCommodityBLCNUpdate){
		$("div.ui-pg-div.ui-inline-edit #gbox_povGrid").show();
		}
		if(isCommodityBLCNLink){
		var grid = $("#gbox_povGrid");
		var pos=getColumnIndexByName(grid,'actionLinkUnlink');
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);
		}
	}*/
	else
		{
		//$('#maintain_commodity_shipment').gatesEnable();
		}
	var reccountAutoGrid = $('#povGrid').jqGrid('getDataIDs');
	
	for (var i = 0; i < reccountAutoGrid.length; i++) {
		if(jQuery("#povGrid").getRowData( $('#povGrid').jqGrid('getDataIDs')[i]). actionLinkUnlink=="LINK" ||
				(jQuery("#povGrid").getRowData( $('#povGrid').jqGrid('getDataIDs')[i]).actionLinkUnlink).trim()=="" ){
					$($("div.ui-pg-div.ui-inline-edit")[i], "#"+$('#povGrid').jqGrid('getDataIDs')[i]).hide();
		}
	}
	
	
	
	
};

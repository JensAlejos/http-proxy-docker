var _cmdtyGridCount = -1;
$(document).ready(
		function() {
			
			var isDeletable = true;
			var linkFormatter = "showlink";
			
			if($('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR"){
				/*Quote Security*/
				isDeletable = true;
			}
			
			if($('#statusCode').val()=="ISSD" || $('#statusCode').val()=="BKGD") {
				isDeletable = false;
				_isCommodityChanged = false;
				$('#del_specialServiceGrid').hide();
			}
			if(isCommodityDisplayOnly && !isCommodityModifiable){
				isDeletable = false;	
			}

			var colNamesForCommodities = ['id', 'Db Id', 'C#', 'EQ CT', 'QTY', 'Equip','E/F','CUST CMDY','TARIFF CMDY','Tariff','Item','Note','Weight','Cube'];
			var colModelForCommodities = [ {name:'commoditySeqNbrDs', index:'commoditySeqNbrDs', editable:false, hidden:true, formatter:'integer'},
			                               {name:'quoteCommodityLineId', index:'quoteCommodityLineId', editable:false, hidden:true, formatter:'integer', width:70},
			                               {name:'cmdyLineNo', index:'cmdyLineNo', width:23, editable:false, editrules:{ required:true}, hidden:false, sorttype:'int', formatter:linkFormatter, formatoptions : {
			                   				baseLinkUrl : "javascript:",
			                				showAction: "editCommodityGrid('",
			                				addParam: "');" }
			                               }, 
			                               {name:'equipmentCount', index:'equipmentCount', width:42, editable: false, editrules: { required:true }, editoptions:{size:20}, sorttype:"int", formatter : 'integer' },
			                               {name:'pieceCount', index:'pieceCount', width:32, editable: false, editrules: { required:true }, editoptions:{size:20}, sorttype:"int", formatter : 'integer' },
			                               {name:'planEquipTypeCode', index:'planEquipTypeCode', width:44, editable: false, editrules: { required:true }, editoptions:{size:20} },
			                               {name:'emptyFullCode', index:'emptyFullCode', width:28, editable:false, editrules:{ required:true }, editoptions:{size:20} },
			                               {name:'customerCommodityDescription', index:'customerCommodityDescription', width:187, editable:true, editrules:{ required:true }, editoptions:{size:20}},
			                               {name:'tariffCommodityDescription', index:'tariffCommodityDescription', width:140, editable:true, editrules:{ required:true }, editoptions:{size:20}},
			                               {name:'tariffNumber', index:'tariffNumber', width:55, editable:false, editrules:{ required:true }, editoptions:{size:20} },
			                               {name:'tariffServiceItemCode', index:'tariffServiceItemCode', width:60, editable:false, editrules:{ required:true }, editoptions:{size:20} }, 
			                               {name:'ratedNote', index:'ratedNote', width:34, editable:false, editrules:{ required:true }, editoptions:{size:20} },
			                               {name:'weightPound', index:'weightPound',width:55, editable:false, editrules:{ required:true }, editoptions:{size:20}, formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 0}},
			                               {name:'cubicFeet', index:'cubicFeet', width:80, editable:false, editrules:{ required:true }, editoptions:{size:20}, formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 0} }];
			var jsonReaderCommodity = {root:"rows", page:"page", total:"total", records:"records", cell:"cell", repeatitems:false, id:"commoditySeqNbrDs" };

			jQuery.extend($.fn.fmatter);
			
			createGrid("quoteCommodityGrid", "pagerQuoteCommodityGrid",
					'../quote/commodity/loadCommodityGrid', 
					'', '', 
					'',
					'/gates/quote/commodity/deleteSelectedCommodity',
					colNamesForCommodities, colModelForCommodities, "Commodity Line", 
					70, 3, [ 3, 6, 9 ], true, isDeletable, false, true,
					jsonReaderCommodity,true,true,true,false,true,false,false,setCmdtyLineChargeGrid,false,false,true);
			

		$("#quoteCommodityGrid").jqGrid('setGridParam',{
			loadComplete:function(data){
				if(!($("#quoteCommodityGrid").getGridParam("reccount") > 0)){
					$("#tariffNo").val("");
				}else{
					$("#tariffNo").val($('#quoteCommodityGrid').jqGrid('getRowData')[0].tariffNumber);
				}
				jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
				//Quote Special Services
				$('#specialServiceGrid').trigger("reloadGrid");
				
				if(document.getElementById('FormError') != null){
					document.getElementById('FormError').style.display = 'none';	
				}
				return true;
			}
		});
		
	});

function delayedUpdate() {
	var numOfCommodities = $("#quoteCommodityGrid").getGridParam("reccount");
	
	if(_cmdtyGridCount==-1){
		_cmdtyGridCount = numOfCommodities;
	}else if(_cmdtyGridCount > numOfCommodities){
		_isQuoteChanged = true;
	}
	_cmdtyGridCount = numOfCommodities;
	
	if (numOfCommodities == 1) {
		$("#chargeCmdyLineNo").val("1");
	} else {
		$("#chargeCmdyLineNo").val("");
	}	
}
			
var setCmdtyLineChargeGrid = function () {
	var allRows=$('#quoteCommodityGrid').children().children();
	for(var i=1;i<allRows.length;i++) {
		$($($('#quoteCommodityGrid').children().children()[i]).children()[3]).css('font-weight','bold');
	}
	if ($("#metric").is(":checked")) {
		$("#jqgh_quoteCommodityGrid_weightPound").text("Wgt KG");
		$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cubic Meter");
		var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
		if (commodityRecords >0){
			for (var i=1;i<=commodityRecords; i++) {
				var weightLBS = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
				var weightKG = convertPoundToKG(weightLBS);
				$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightKG );
				
				var volumeImp = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
				var volumeMetric = convertToMetricVolume(volumeImp);
				$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeMetric );
			}
		}
	} else {
		$("#jqgh_quoteCommodityGrid_weightPound").text("Weight");
		$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cube");
	}
	if(!(_commodityAction == "EDIT" || _commodityAction == "ADD")){
		setCommodityTabDetails($("#quoteCommodityGrid").getGridParam("reccount"));	
	}
	_commodityAction = "";

	//TODO: Need to identify a way to get reference of a cell of external grid
	setTimeout("delayedUpdate()", 250);
	return true;
};

function editCommodityGrid(id) {
	var seqNo = id.split('=')[1];
	showEditCommodityDialog(seqNo);
}

$(document).ready(function() {
			var colNamesForCommodityGrid = [ 'ID', 'Type','Description', 'Remarks', 'Status', 'Effective','Expiration'];
			var colModelForCommodityGrid = [ {
				name : 'commodityDescCmdyId',
				index : 'commodityDescCmdyId',
				editable : false,
				hidden : true,
				formatter : 'number'
			}, {name:'isPrimaryDescription', label : 'Type ',index:'typ', width:12, editable:false, editrules:{ required:true}, hidden:false, 
				formatter:'showlink', 
				formatoptions : {
   				baseLinkUrl : "javascript:",
				showAction: "editCommodityGrid('",
				addParam: "');" }
               }, {
				name : 'description',
				label : 'Description   ',
				index : 'desc',
				height : 100,
				width : 100,
				editable : false
			}, {
				name : 'note',
				label : 'Remarks   ',
				index : 'rmk',
				width : 85,
				editable : false
			}, {
				name : 'status',
				label : 'Status',
				index : 'status',
				width : 15,
				editable : false
			} , 
			{
				name : 'effectiveDate',
				label : 'Effective Date ',
				index : 'Eff',
				width : 25,
				formatter :'date',
				formatoptions :{
					srcformat:'Y-m-d', 
					newformat:'m-d-Y',
					}
			}, {
				name : 'expirationDate',
				label : 'Expiration Date ',
				index : 'Exp',
				width : 25,
				formatter :'date',
				formatoptions :{
					srcformat:'Y-m-d', 
					newformat:'m-d-Y',
					}
			}];
			
			var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "commodityDescCmdyId"
			};
			var multiSelect=true;
			var multidelete=true;
		    if(_displayonly)
			  {
			  multiSelect=false;
			  multidelete=false;
			  }
		    
		    $('#commodityGrid').gatesGrid({
				caption: "Commodities",
				colNames: colNamesForCommodityGrid,
				colModel: colModelForCommodityGrid,
				jsonReader: jsonReader,
				pager: '#pagerCommodityGrid',
				rowNum:30,
				rowList: [30,100,500],
				height: 250,
				width: 930,
				multiselect:multiSelect,
				autowidth: false,
				gatesOptions: {
					urls: {load: _context+'/tariff/itemFrtWrf/loadCommodities',del: _context+'/gates/tariff/itemFrtWrf/deleteSelectedCommodity',delMultiple: _context+'/tariff/itemFrtWrf/deleteSelectedCommodity'},
					rowColorBasedOnStatus:true,
					controls: {
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete: multidelete,
						inlineAdd: true, //- hideCustomAddRow
						inlineEdit: false, //- hideEdit
						inlineDelete: false, //- hideDelete
						hidePagerRow: false
					}
				}
			});
		    var selectedRow="";
		    $("#commodityGrid").jqGrid('setGridParam',{
			    	onSelectRow: function(rowId){
			    		selectedRow = jQuery("#commodityGrid").getGridParam('selarrrow');
			    		$('#selectedComodities').val(selectedRow);
					}
				}).trigger("reloadGrid");
			  $("#pg_pagerCommodityGrid").click(function() {
				  somethingChanged=false;
			  });
		});

//		    createGrid("commodityGrid", "pagerCommodityGrid",
//					'/gates/tariff/itemFrtWrf/loadCommodities', '', '', '/gates/tariff/itemFrtWrf/deleteSelectedCommodity', '/gates/tariff/itemFrtWrf/deleteSelectedCommodity',
//					colNamesForCommodityGrid, colModelForCommodityGrid,
//					"Commodities", 250, 10, [ 10, 20, 30 ], true, multiSelect, true, false,
//					jsonReader,true,true,true,false,false,false,false,false,false,false,true);
function editCommodityGrid(id) {
	var seqNo = id.split('=')[1];
	showEditCommodityDialog(seqNo);
}

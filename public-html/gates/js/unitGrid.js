
		
		
		function createUnitGrid() {
			
			$('#unitGridMain').html('<div id="unit">'+
					'<table id="unitGrid"></table>'+
					'<div id="unitPager"></div>'+
				'</div>');
			var size1=500;
			var list1=[5, 10, 20,50,100,200,500 ];
			if($('#loadDischargeServicePair').val()=="CON" ){
				size1=5;
				list1=[5, 10, 20,50,100,200,500 ];
			}
			var colNames=['No','This', 'Seq', 'UnitID', 'Vin#', 'Unit Description', 'DALC', 'POD', 'B/LCity', 'Consignee','','Status'];
			var colModel=[
			              {name:'seqNo',index:'seqNo', editable:false, hidden:true, formatter:'integer'},
			              {name:'billLinked',index:'billLinked', width:40, editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'seq',index:'seq', width:40, editable:false, editrules:{required:true}, editoptions:{size:20}, formatter: 'showlink', formatoptions: { baseLinkUrl: 'javascript:', showAction: "Link('", addParam: "');"}},
			              {name:'vinsightUnitId',index:'vinsightUnitId', width:70, editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'vinNumber',index:'vinNumber', width:140,editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'description',index:'description', width:190,editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'dealerAuctionLocationCode',index:'dealerAuctionLocationCode', width:45,editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'destinationPortCityCode',index:'destinationPortCityCode', width:45,editable:false, editrules:{required:true}, editoptions:{size:20}},
			              {name:'blDestinationPortCityCode',index:'blDestinationPortCityCode', width:45,editable:false, editrules:{required:true}, editoptions:{size:20}}, 
			              {name:'consignee',index:'consignee', width:120,editable:false,editrules:{required:true}, editoptions:{size:20}},
			              {name:'isCancelInVinSight',index:'isCancelInVinSight',hidden:true},
			              {name:'statusCode',index:'statusCode', width:100,editable:false, editrules:{required:true}, editoptions:{size:20}}
			        

		];
			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "vinsightUnitId"
				};
			var loadServiceCodeVal = $('#loadServiceCode').val();
			var dischargeServiceCodeVal = $('#dischargeServiceCode').val();
			var gridData="";
			createGrid("unitGrid", "unitPager",
					'/gates/billingSetup/loadUnitGrid', '', '', '', '',
					colNames, colModel,
					"Unit", "auto", size1,  list1,true, false, false,true,
					jsonReader,true,true,false,false,true,false,false,unitGridComplete,false,false);//D032091			
			//D029838: 	PROD - Export option needed for received containers
			$("#unitGrid").jqGrid('navButtonAdd','#pg_unitPager',{
			    id:'ExportToExcel',
			    caption:'Export To Excel',
			    title:'Export To Excel',
			    onClickButton : function(e)
			    {
					var link = document.createElement("a");    
					link.id="unitGridExport";
					document.body.appendChild(link);
					jQuery("#unitGridExport").attr({
					    'download': "BillSetup_Units_"+$('#shipmentNumber').val(),
					    'href': _context+ "/billingSetup/unitGridExport"
					}); 
					jQuery('#unitGridExport')[0].click();    
					document.body.removeChild(link);
					$.unblockUI();
			    },
			    buttonicon: 'ui-icon ui-icon-document',
			});	
			
		}


var unitGridComplete = function()
{
	$("input[type=checkbox]").click(function() {
		 
		 var elements = $("input[type=checkbox]");
		 var anyOneChecked=false;
		 jQuery.each(elements, function(element) {
		     var checked = $(this).attr('checked');
		 if(checked){
		 anyOneChecked=true; 
		 }
		 });
		 if(anyOneChecked){
		 $('#setupBillBtn').attr("disabled","disabled");  
		 }else{
		    $('#setupBillBtn').removeAttr("disabled");  
		  }
	});
	
	
	var rowIDs = jQuery("#unitGrid").getDataIDs(); 
	for (var i=0;i<rowIDs.length;i=i+1)
	{ 
		var rowData=jQuery("#unitGrid").getRowData(rowIDs[i]);
		var trElement = jQuery("#"+ rowIDs[i],jQuery('#unitGrid'));
		if(rowData.isCancelInVinSight=='Y' || rowData.isCancelInVinSight=='y')
		{
			$(trElement).css('color', 'red');
		}
		else
		{
			$(trElement).css('color', 'black');
		}
	} 
	return true;	
	
}

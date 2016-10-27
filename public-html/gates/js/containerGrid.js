
		function createContainerGrid1() {
			
			$('#containerGridMain').html('<div id="container">'+
					'<table id="containerGrid"></table>'+
					'<div id="containerPager"></div>'+
				'</div>');
			
			
			var size=500;
			var list=[5, 10, 20,50,100,200,500 ];
			if($('#loadDischargeServicePair').val()=="CON" || $('#loadDischargeServicePair').val()=="LCL"){
				size=5;
				list=[5, 10, 20,50,100,200,500 ];
			}
			var colNames=['No','This', 'Seq', 'More', 'W/C', 'Equipment #','equipmentStatusCode', '','','','Pre-Rcvd', 'Type/Size', 'E/F', 'POD', 'B/LCity', 'Consignee', 'Status',''];
			var colModel=[
			              {name:'frieghtId', editable:false, hidden:true, formatter:'integer'},
			              {name:'billLinked',index:'billLinked', width:40, editable:false },
			              {name:'seq',index:'seq', width:40, editable:false,formatter: 'showlink', formatoptions: { baseLinkUrl: 'javascript:', showAction: "Link('", addParam: "');"} },
			              {name:'linkedWithMoreBill',index:'linkedWithMoreBill', width:40, editable:false },
			              {name:'prorateCode',index:'prorateCode', width:30,editable:false},
			              {name:'equipmentId',index:'equipmentId', width:105,editable:false},
			              {name:'equipmentStatusCode',index:'equipmentStatusCode', hidden:true},
			              {name:'isVarianceAproved',index:'isVarianceAproved', hidden:true},
			              {name:'isRequireVarianceApproval',index:'isRequireVarianceApproval', hidden:true},
			              {name:'billTypeThroghSeqNo',index:'billTypeThroghSeqNo',hidden:true},
			              
			              {name:'prereceived',index:'prereceived', width:50,editable:false},
			              {name:'typeSize',index:'typeSize', width:70,editable:false},
			              {name:'emptyFull',index:'emptyFull', width:30,editable:false}, 
			              {name:'destinationPortCityCode',index:'destinationPortCityCode', width:50,editable:false},
			              {name:'blDestinationCityCode',index:'blDestinationCityCode', width:60,editable:false},
			              {name:'consignee',index:'consignee', width:200,editable:false},
			              {name:'statusCode',index:'statusCode', width:110,editable:false},
			              {name:'actions', index:'actions', width:30, align:"center", editable:false,hidden:true, search:false, sortable:false, formatter:'actions', formatoptions:{keys:false}}

		];
			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "frieghtId"
				};
			var loadServiceCodeVal = $('#loadServiceCode').val();
			var dischargeServiceCodeVal = $('#dischargeServiceCode').val();
			var gridData="";
			createGrid("containerGrid", "containerPager",
					'/gates/billingSetup/loadContainerGrid', '', '', '', '',
					colNames, colModel,
					"Container", "auto" , size , list,true, false, false,true,
					jsonReader,true,true,false,false,true,false,false,ButtonDisableOnLoad,disableIncompleteAssignments,false);
			//D029838: 	PROD - Export option needed for received containers
			$("#containerGrid").jqGrid('navButtonAdd','#pg_containerPager',{
			    id:'ExportToExcel',
			    caption:'Export To Excel',
			    title:'Export To Excel',
			    onClickButton : function(e)
			    {
					var link = document.createElement("a");    
					link.id="containerGridExport";
					document.body.appendChild(link);
					jQuery("#containerGridExport").attr({
					    'download': "BillSetup_Containers_"+$('#shipmentNumber').val(),
					    'href': _context+ "/billingSetup/containerGridExport"
					}); 
					jQuery('#containerGridExport')[0].click();    
					document.body.removeChild(link);
					$.unblockUI();
			    },
			    buttonicon: 'ui-icon ui-icon-document',
			});	
			
		}
	//Added function for setting seq number as hyper link -- Defect D027129
	function Link(id) {
    var row = id.split("=");
    var row_ID = row[1];
	var shipmentNo = $('#shipmentNumber').val();
    var sitename= $("#containerGrid").getCell(row_ID, 'seq');
    if(!sitename){
    	sitename = $("#unitGrid").getCell(row_ID, 'seq');
    }
    document.location.href = _context+"/shipment/showForm?shipment_number="+shipmentNo+"&shipment_sequence_number="+sitename+"&shipment_correction_number=000&src=FTWQ";;
    
    }


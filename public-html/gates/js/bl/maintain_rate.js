/*$(document).ready(
		
		
		
		function() {

			
			var colNamesForMaintainChargeGrid = ['shipmentChargeId','Charge','Units','Rate Amount', 'Rate Basis', 'Charge Amount','PL','P/C','User','Last Update','TXN',''];

			var colModelForMaintainChargeGrid = [
			                                        {name:'shipmentChargeId', editable:false, hidden:true},
 			                                        {name:'chargeCode', index:'chargeCode', width:50,editable:true,editoptions: {dataUrl:_context+'/maintainRate/loadChargeType'},editrules:{required:true},editable:true,formatter:'select' } ,
			                                        {name:'numberOfUnit',index:'numberOfUnit',width:50, editable:true},
			                                        {name:'rate', index:'rate', width:35, editable:true},
			                                        {name:'rateBasisCode', index:'rateBasisCode', width:50, edittype:'select', editoptions:{dataUrl:_context+'/maintainRate/loadRateBasis'},editrules:{required:true},editable:true,formatter:'select'  },
			                                        {name:'shipmentChargeAmount', index:'shipmentChargeAmount', width:50, editable: false },
			                                        {name:'responsiblePartyCode', index:'responsiblePartyCode', width:50, editable: false },
			                                        {name:'processLevelCode', index:'processLevelCode', width:50, editable: false },
			                                        {name:'createUser', index:'createUser', width:50, editable: false },
			                                        {name:'lastUpdateDate', index:'lastUpdateDate', width:50, editable: false },
			                                        {name:'isRateEngineAssessed', index:'isRateEngineAssessed', width:50, editable: false },
			                                        {name:'actions', width:50, formatter:'actions',
			                                        		formatoptions:{keys:true,editbutton:true, delbutton:true}}
										   ];
			var jsonReaderSpSvc = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "seqNo"
				};

			createGrid(
					"chargeGrid", // grid id for user
					"pagerChargeGrid", // page id for user
					'/gates/maintainRate/loadCharges',  //get url
					'/gates/maintainRate/addCharges', //add url
					'/gates/maintainRate/editCharges', //edit url
					'', //delete url
					'', // delete multi select url
					colNamesForMaintainChargeGrid, 
					colModelForMaintainChargeGrid, 
					"ShipmentItem Charges",
					70,
					3,
					[3,6,9],
					false,
					false,
					false, //load once
					false, jsonReaderSpSvc,false,false,true,true,true,false,false,false,onCompletion,false,true);
			
			
			
			var colNamesForMaintainChargeGrid = ['Charge'];

			var colModelForMaintainChargeGrid = [
			                                        {name:'numberOfUnit',index:'numberOfUnit',width:50, editable:true}
										   ];
			
			
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"shipmentChargeId" };

	
			createGrid(
					"chargeGrid", // grid id 
					"pagerChargeGrid", // pager id 
					'/gates/maintainRate/loadCharges',  //get url
					'/gates/maintainRate/addCharges', //add url
					'/gates/maintainRate/editCharges', //edit url
					'', //delete url
					'', // delete multi select url
					colNamesForMaintainChargeGrid, 
					colModelForMaintainChargeGrid, 
					"sddfs", //caption
					150, //height
					10 , //row num
					[10,20,30] , //row list
					false,  multiselect 
					false,  multidelete 
					false,  loadOnce 
					false,  readOnlyGrid 
					jsonReader,  jsonReader 
					false,  hideEdit 
					false,  hideDelete 
					true,  autowidth 
					false,  rownumbers 
					false,  hideCustomAddRow 
					false,  hidePagerRow 
					false,customEditMethod
					false,customGridComplete
					false,customLoadComplete
					true defaultHidden 
			);

		});


*/
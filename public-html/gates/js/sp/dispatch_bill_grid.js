$(document).ready(
		function() {
			var showLink = 'showlink';
			if(isDispatchSearchable && !isDispatchDisplayable)
			{
				showLink ='';
			}
			var colNamesForDispatchLocationGrid = ['id','Dispatch Request Id','Type', 'SOP', 'Date','Time', 'Equipment','Container','Port','Trucker','Status','Milo Order Id'];

			var colModelForDispatchLocationGrid = [ {name:'id',index:'id', editable:false,hidden:true, formatter:'number',cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			                                        {name:'dispatchRequestId',index:'dispatchRequestId', editable:false,hidden:true, formatter:'number', 
	               									cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			                                        {name:'type', index:'type', width:35, editable:false, 
				formatter : showLink,
				formatoptions : {
					baseLinkUrl : '../createdispatch/loadDispatchRequestByRequestID'
										
				}                          },
			                               {name:'sop', index:'sop', width:30, editable:false }, 
			                               {name:'date', index:'date', width:60, editable: false },
			                               {name:'time', index:'time', width:50, editable: false },
			                               {name:'equipment', index:'equipment', width:50, editable: false },
			                               {name:'container', index:'container', width:70, editable:false },
										   {name:'port', index:'port', width:50, editable:false },
										   {name:'trucker', index:'trucker', width:50, editable:false },
										   {name:'status', index:'status', width:50, editable:false } ,
										   {name:'miloOrderId', index:'miloOrderId', width:60, editable:false },
										   //{name:'actions', index:'actions', width:60, align:"center", editable:true, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}} 
										   ];
			
			
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"id" };

	
			createGrid(
					"dispatchBillGridTable", // grid id 
					"dispatchBillGridDiv", // pager id 
					'../createdispatch/loadDispatchBillGrid',  //get url
					'', //add url
					'', //edit url
					'', //delete url
					'', // delete multi select url
					colNamesForDispatchLocationGrid, 
					colModelForDispatchLocationGrid, 
					"Dispatch Bill List", //caption
					230, //height
					10 , //row num
					[10,20,30] , //row list
					true, /* multiselect */
					false, /* multidelete */
					true, /* loadOnce */
					false, /* readOnlyGrid */
					jsonReader, /* jsonReader */
					false, /* hideEdit */
					false, /* hideDelete */
					true, /* autowidth */
					false, /* rownumbers */
					true, /* hideCustomAddRow */
					false, /* hidePagerRow */
					false,/*customEditMethod*/
					false,/*customGridComplete*/
					dispatchBillLoadComplete,/*customLoadComplete*/
					false /*defaultHidden*/ 
			);

		});
var dispatchBillLoadComplete = function() {
	
	if(!isDispatchUpdatable)
		{
			$('#gview_dispatchBillGridTable input').attr("disabled", true);
			$('#gview_dispatchBillGridTable select').attr("disabled", true);
			
		}
};
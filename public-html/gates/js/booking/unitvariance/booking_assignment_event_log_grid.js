$(document).ready(
		function() {

			var colNamesForEventLogGrid = ['id','Event','Empty/Full', 'Location', 'Event Date/Time','Dray Chas/Container', 'MG','Haz','Booking','Vvd','Doer'];

			var colModelForEventLogGrid = [ {name:'id',index:'id', editable:false,hidden:true, formatter:'number',cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			                                        
			                                        {name:'event', index:'event', width:40, editable:false }, 
			                                        {name:'eOrF', index:'eOrF', width:50, editable: false },
			                                        {name:'location', index:'location', width:50, editable: false },
			                                        {name:'eventDateTime', index:'eventDateTime', width:100, editable: false },
			                                        {name:'container', index:'container', width:60, editable:false },
			                                        {name:'mg', index:'mg', width:30, editable:false },
			                                        {name:'hazardous', index:'hazardous', width:30, editable:false },
			                                        {name:'booking', index:'booking', width:50, editable:false } ,
			                                        {name:'vvd', index:'vvd', width:60, editable:false },
			                                        {name:'doer', index:'doer', width:60, editable:false },
										   //{name:'actions', index:'actions', width:60, align:"center", editable:true, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}} 
										   ];
			
			
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"id" };

	
			createGrid(
					"eventLogGridTable", // grid id 
					"eventLogGridDiv", // pager id
					'../bookingMaintenance/loadBookingAssignmentEventLogGrid',					
					'', //add url
					'', //edit url
					'', //delete url
					'', // delete multi select url
					colNamesForEventLogGrid, 
					colModelForEventLogGrid, 
					"Event Log", //caption
					100, //height
					10 , //row num
					[10,20,30] , //row list
					false, /* multiselect */
					false, /* multidelete */
					true, /* loadOnce */
					true, /* readOnlyGrid */
					jsonReader, /* jsonReader */
					true, /* hideEdit */
					true, /* hideDelete */
					true, /* autowidth */
					false, /* rownumbers */
					true, /* hideCustomAddRow */
					false, /* hidePagerRow */
					false,/*customEditMethod*/
					false,/*customGridComplete*/
					false,/*customLoadComplete*/
					false /*defaultHidden*/ 
			);

		});

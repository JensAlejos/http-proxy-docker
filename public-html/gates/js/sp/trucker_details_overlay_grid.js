$(document).ready(
		function() {

			var colNamesForTruckerDetailsGrid = ['Trucker', 'First Name', 'Last Name', 'Title','Department','PhoneNumber','Extension'];

			var colModelForTruckerDetailsGrid = [ 
			                               {name:'trucker', index:'trucker', width:110, editable:false },
			                               {name:'truckerFirstName', index:'truckerFirstName', width:120, editable:false }, 
			                               {name:'truckerLastName', index:'truckerLastName', width:120, editable: false },
			                               {name:'title', index:'title', width:120, editable: false },
			                               {name:'department', index:'department', width:120, editable:false },
			                               {name:'phoneNumber', index:'phoneNumber', width:120, editable: false },
			                               {name:'extension', index:'extension', width:120, editable: false },
			                                ];
			
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"id" };

	
			createGrid(
					"truckerDetailsGridTable", // grid id 
					"truckerDetailsGridDiv", // pager id 
					'../createdispatch/loadTruckerDetailsGrid',  //get url
					'', //add url
					'', //edit url
					'', //delete url
					'', // delete multi select url
					colNamesForTruckerDetailsGrid, 
					colModelForTruckerDetailsGrid, 
					"Trucker Details", //caption
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
					false /* hidePagerRow */
			);

		});

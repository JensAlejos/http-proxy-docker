$(document).ready(
		function() {
			var hideDelete = false;
			if(isDispatchSearchable && isDispatchDisplayable && !isDispatchUpdatable)
				{
				hideDelete = true;
				}
			var colNamesForDispatchLocationGrid = ['Id','Seq No.','Organizations', 'addRolDesc','isOneTimeCustomer','Zone', 'Contact','Phone Number', 'Open Time','Close Time','Pickup Number','addressRoleId','state', 'city','zip', ''];

			var colModelForDispatchLocationGrid = [ 
			                               
                                           {name:'id',index:'id', editable:false,hidden:true, formatter:'number', cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
                                           {name:'seqNo', index:'seqNo', width:55, editable:false },
                                           {name:'organisations', index:'organisations', width:120, editable:false, editrules:{ required:true}, hidden:false, sorttype:'int', formatter:'showlink', formatoptions : {
   			                   				baseLinkUrl : "javascript:",
   			                				showAction: "editLocationGrid('",
   			                				addParam: "');" },
											cellattr: function (rowId, val, rawObject, cm, rdata) {
												return 'title="' + rawObject.organisations + '--' + rawObject.addRolDesc + '--' + rawObject.city + '--' + rawObject.state +'--' + rawObject.zip +'"'; }
   			                               },
										   {name:'addRolDesc', index:'addRolDesc', width:100, editable:false,hidden:true},
   			                               {name:'isOneTimeCustomer', index:'isOneTimeCustomer', width:100, editable:false,hidden:true},
                                           {name:'zone', index:'zone', width:50, editable:false }, 
			                               {name:'contactName', index:'contactName', width:120, editable: false },
			                               {name:'phoneNumber', index:'phoneNumber', width:120, editable: false },
			                               {name:'openTime', index:'openTime', width:85, editable: false },			                               
			                               {name:'closeTime', index:'closeTime', width:85, editable:false },
			                               {name:'pickupNumber', index:'pickupNumber', width:130, editable: false },
			                               {name:'addressRoleId', index:'addressRoleId', width:100, editable:false,hidden:true},
			                               {name:'state', index:'state',hidden:true, width:50, editable:false },
			                               {name:'city', index:'city',hidden:true, width:50, editable:false },
										   {name:'zip', index:'zip',hidden:true, width:15, editable:false,hidden:true },
			                               {name:'actions', index:'actions', width:60, align:"center", search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}];
										  		  
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"id" };
			// 25363 -- Starts --
			var locationGridLoadComplete = function() {
				var locList = jQuery("#dispatchLocationGridTable").getDataIDs();
				if(locList.length > 1)
			 	{
					$("#createDispatchLocationHeader").text("	Multiple");
				}else if(locList.length == 1){
					var rowData=jQuery("#dispatchLocationGridTable").getRowData(locList[0]);		
					var locationDetail = "	" + rowData.organisations + " | " + rowData.city + " | " + rowData.contactName  + " | " + rowData.phoneNumber;
					$("#createDispatchLocationHeader").text(locationDetail);
				}
				 var rowIDs = jQuery("#dispatchLocationGridTable").getDataIDs();
				 for (var i=0;i<rowIDs.length;i=i+1){
					 var rowData=jQuery("#dispatchLocationGridTable").getRowData(rowIDs[i]); 
					 if(rowData.isOneTimeCustomer == 'true' || rowData.isOneTimeCustomer == true) { 
						 $('#dispatchLocationGridTable').jqGrid('setCell', i+1, 'organisations','','',{style: 'background: yellow'},'');
				       } else {
				    	 $('#dispatchLocationGridTable').jqGrid('setCell', i+1, 'organisations','','',{style: 'background: none'},'');
				       }
				 }
			};
			// 25363 -- Ends --

			createGrid(
					"dispatchLocationGridTable", // grid id 
					"dispatchLocationGridDiv", // pager id 
					'../createdispatch/loadDispatchLocationGrid',  //get url
					'', //add url
					'', //edit url
					'../createdispatch/deleteDispatchLocation', //delete url
					'', // delete multi select url
					colNamesForDispatchLocationGrid, 
					colModelForDispatchLocationGrid, 
					"Locations", //caption
					100, //height
					10 , //row num
					[10,20,30] , //row list
					false, /* multiselect */
					false, /* multidelete */
					false, /* loadOnce */
					false, /* readOnlyGrid */
					jsonReader, /* jsonReader */
					true, /* hideEdit */
					hideDelete, /* hideDelete */
					true, /* autowidth */
					false, /* rownumbers */
					false, /* hideCustomAddRow */
					// 25363 
					false, /* hidePagerRow */
					null,
					null,
					locationGridLoadComplete
			);			
			
			
		});

  
  
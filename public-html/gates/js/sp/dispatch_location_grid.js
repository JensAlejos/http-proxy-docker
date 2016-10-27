$(document).ready(
		function() {
				//D029176
			var colNamesForDispatchLocationGrid = ['Id','Seq No.','Organizations', 'addRolDesc','isOneTimeCustomer', 'Zone', 'Contact','Phone Number', 'Open Time','Close Time','Pickup Number', 'addressRoleId','state', 'city','zip','islocationChange','isHourOfOperationChange','isCustomerPickupNbrChange','isContactChange',' '];

			var colModelForDispatchLocationGrid = [ 
			                               
                                           {name:'id',index:'id', editable:false,hidden:true, formatter:'number', cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
                                           {name:'seqNo', index:'seqNo', width:60, editable:false },
                                           // 25368 -- Starts --
                                           {name:'organisations', index:'organisations', width:120, editable:false, formatter:'showlink', formatoptions : {
                                   			baseLinkUrl : "javascript:",
                            				showAction: "editLocationGrid('",
                            				addParam: "');" },
											cellattr: function (rowId, val, rawObject, cm, rdata) {
												return 'title="' + rawObject.organisations + '--' + rawObject.addRolDesc + '--' + rawObject.city + '--' + rawObject.state +'--' + rawObject.zip +'"'; }  
                                           }, 
										   {name:'addRolDesc', index:'addRolDesc', width:100, editable:false,hidden:true},
                                           {name:'isOneTimeCustomer', index:'isOneTimeCustomer', width:100, editable:false,hidden:true},
                                           // 25368 -- Ends --                                          
                                           {name:'zone', index:'zone', width:100, editable:false }, 
                                           {name:'contactName', index:'contactName', width:120, editable: false },
			                               {name:'phoneNumber', index:'phoneNumber', width:120, editable: false },
			                               {name:'openTime', index:'openTime', width:100, editable: false },
			                               {name:'closeTime', index:'closeTime', width:100, editable:false },
			                               {name:'pickupNumber', index:'pickupNumber', width:130, editable: false },
			                               {name:'addressRoleId', index:'addressRoleId', width:100, editable:false,hidden:true},
										   {name:'state', index:'state',hidden:true, width:50, editable:false },
			                               {name:'city', index:'city',hidden:true, width:50, editable:false },
										   {name:'zip', index:'zip',hidden:true, width:15, editable:false,hidden:true },
			                               {name:'isLocationChng', index:'isLocationChng', editable:false,hidden:true},
			                               {name:'isHourOfOperationChange', index:'isHourOfOperationChange', editable:false,hidden:true},
			                               {name:'isCustomerPickupNbrChange', index:'isCustomerPickupNbrChange', editable:false,hidden:true},
			                               {name:'isContactChange', index:'isContactChange', editable:false,hidden:true},
			                               {name:'actions', index:'actions', width:60, align:"center", search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}];
										  		  
			var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"id" };
			
			var locationGridLoadComplete = function() {
				 var rowIDs = jQuery("#dispatchLocationGridTable").getDataIDs();
				 for (var i=0;i<rowIDs.length;i=i+1)
			     { 
			       var rowData=jQuery("#dispatchLocationGridTable").getRowData(rowIDs[i]);
			       if(rowData.isHourOfOperationChange == 'Y') { 
			    	   $('#dispatchLocationGridTable').jqGrid('setCell', rowIDs[i], 'openTime','','',{style: 'color : red'},'');
			    	   $('#dispatchLocationGridTable').jqGrid('setCell', rowIDs[i], 'closeTime','','',{style: 'color : red'},'');
			       }
			       if(rowData.isCustomerPickupNbrChange == 'Y') { 
			    	   $('#dispatchLocationGridTable').jqGrid('setCell', rowIDs[i], 'pickupNumber','','',{style: 'color : red'},'');
			       }
			       if(rowData.isContactChange == 'Y'){
			    	   $('#dispatchLocationGridTable').jqGrid('setCell', rowIDs[i], 'contactName','','',{style: 'color : red'},'');
			       }
			       if(rowData.isHourOfOperationChange == 'Y' || rowData.isCustomerPickupNbrChange == 'Y' || rowData.isContactChange == 'Y') { 
			       var Location='<span style="color:red">'+'Locations'+'</span>';
				   $('#dispatchLocationGridTable').jqGrid('setCaption', Location);
			       }
			       if(rowData.isOneTimeCustomer == 'true' || rowData.isOneTimeCustomer == true) { 
					 $('#dispatchLocationGridTable').jqGrid('setCell', i+1, 'organisations','','',{style: 'background: yellow'},'');
				   } else {
				     $('#dispatchLocationGridTable').jqGrid('setCell', i+1, 'organisations','','',{style: 'background: none'},'');
				   }
			     }
			};

	
			createGrid(
					"dispatchLocationGridTable", // grid id 
					"dispatchLocationGridDiv", // pager id 
					'../spotpull/loadDispatchLocationGrid',  //get url
					'', //add url
					'', //edit url
					'', //delete url
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
					true, /* hideDelete */
					true, /* autowidth */
					false, /* rownumbers */
					false, /* hideCustomAddRow */
					false, /* hidePagerRow */
					null,
					null,
					locationGridLoadComplete, /* customLoadComplete */
					false, /* default */
					true, /* location coloring */
					false,
					false,
					false,
					true 
			);

		});
  
  
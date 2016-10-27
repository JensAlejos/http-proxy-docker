$(document).ready(function () {
	makeGrid();
});
function makeGrid() {
	var colNamesForTerritory = [ 'id','Region Name-Code', 'Territory', 'Sales Representative', ''];
	var colModelForTerritory = [ {name:'id',index:'id', width:50, editable:false,hidden:true, formatter:'number', 
	                            	cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;'}},
	                            	{name:'regionName',index:'regionName', width:43, editable:true, editrules:{required:true},editoptions:{readonly:true, defaultValue:$('#salesRegionNameAndCode').val()},
	                            		formatter:'showlink', formatoptions:{baseLinkUrl:'../updateRegion/get', addParam: '&regionCode='+$('#salesRegionCode').val()}},
	                            	{name:'teritory',index:'teritory',width:43, editable:true, editrules:{required:true},editoptions: {
	                            		size:8,maxlength:3,
	                            		dataEvents :[{ type: 'change', fn: function(e) {
											var territorySelected = e.target.value;
											if (territorySelected.length == 1){
												e.target.value = ("0"+territorySelected);
											}
											}//end fun 
											} // end type
										] // dataevents
	                            	
	                            	}
	                            	},   
	                            	{name:'salesRepresentative',index:'salesRepresentative', width:43, editable:true, editrules:{required:true},editoptions: {maxlength:22}}, 
	                           		{name:'actions', index:'actions', width:20, align:"center",  formatter:'actions', formatoptions:{keys:true}}
	                            ];
	var multiDelete = true;
	if($('#salesRegionCode').val() == null || 
			$('#salesRegionCode').val() == "" ||
			$('#salesRegionCode').val() == "00")
	{
		colNamesForTerritory = [ 'id','Region Name-Code', 'Territory', 'Sales Representative'];
		colModelForTerritory = [ {name:'id',index:'id', width:50, editable:false,hidden:true, formatter:'number', 
		                            	cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;'}},
		                            	{name:'regionName',index:'regionName', width:43, editable:false},
		                            	{name:'teritory',index:'teritory',width:43, editable:false},   
		                            	{name:'salesRepresentative',index:'salesRepresentative', width:43, editable:false},
		                            ];
		multiDelete = false;
		
	}
	
	createGrid(
			"gridIdForTerritory", // grid id for tariffs
			"pagerIdForTerritory", // page id for tariffs
			'/gates/sales/salesMaintenance/getTerritory', 
			'/gates/sales/salesMaintenance/addTerritory', 
			'/gates/sales/salesMaintenance/editTerritory', 
			'/gates/sales/salesMaintenance/deleteTerritory', 
			'/gates/sales/salesMaintenance/deleteSelectedTerritory',
			colNamesForTerritory, 
			colModelForTerritory, 
			'Territories',
			230
			,10 ,[10,20,30] ,
			true, /* multiselect */
			!_readonly && multiDelete, /* multidelete */
			true,
			_readonly,
			null, /* jsonReader */
			_readonly, /* hideEdit */
			_readonly, /* hideDelete */
			true, /* autowidth */
			true, /* rownumbers */
			_readonly /* hideCustomAddRow*/ 
			);
}
$(document).ready(function(){
	if($('#salesRegionCode').val() == null || 
			$('#salesRegionCode').val() == "" ||
			$('#salesRegionCode').val() == "00")
	{
		/*$('#reassignAccounts').attr('disabled',true);
		$('#transferAccounts').attr('disabled',true);*/
		$('#save').attr('disabled',true);
	}
	
	$('#reassignAccounts').click(
		function()
		{
			var selectedMulti = $('#gridIdForTerritory').getGridParam('selarrrow');
			var selected = $('#gridIdForTerritory').getGridParam('selrow');
			if(selected!=null && selectedMulti!=null)
				{
					if(selectedMulti.length==1)
					{
						var rowData = $('#gridIdForTerritory').getRowData(selected); 
						var region = rowData["regionName"];
						var regionCode = region.split("-");
						var teritory = rowData["teritory"];
						document.location.href =_context+'/sales/reassignAccounts/viewAdd?regionCode='+
						regionCode[1]+'&territoryCode='+teritory;
					}
					else
					{
						alert("Please select a single Territory to Reassign Accounts.");
						return false;
					}
				}
			
			else
				{
					alert("Please select atleast one Territory  to Reassign Accounts.");
					return false;
				}
			
		}	
	);
	$('#transferAccounts').click(
			function()
			
			{
				var selectedMulti = $('#gridIdForTerritory').getGridParam('selarrrow');
				var selected = $('#gridIdForTerritory').getGridParam('selrow');
				if(selected!=null && selectedMulti!=null)
					{
						if(selectedMulti.length == 1)
						{
							var rowData = $('#gridIdForTerritory').getRowData(selected); 
							var teritory = rowData["teritory"];
							var region = rowData["regionName"];
							var regionCode = region.split("-");
							document.location.href =_context+'/sales/transferAccounts/get?regionCode='+
							regionCode[1]+'&territoryCode='+teritory+'&toRegionCode=';
						}
						else
						{
							alert("Please select a single Territory to Transfer Accounts.");
							return false;
						}
					}
				else
				{
					alert("Please select atleast one Territory  to Transfer Accounts.");
					return false;
				}
				
			}	
		);
});

window.onload=function(){
	if($('#searchOn').val() == "true")
	{
		if($('#salesRegionNameAndCode').val()==00 || $('#salesRegionNameAndCode').val()==null)
			{
				$('#cb_gridIdForTerritory').focus();
			}
		$('#teritory').focus();
	}
};

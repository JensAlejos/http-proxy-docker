$(document).ready(
		function () {
			var colNames=['id','Code','Description', 'Cust', 'Admn', 'VIS','A/I',''];
			var colModel=[
						  {name:'id',index:'id', editable:false,hidden:true, formatter:'number', 
						   cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			              {name:'errorCode',index:'errorCode', width:50, edittype:'text',classes : 'toUpperCaseInGrid',editrules : {required:true}, editable:true, 
							   editoptions: {dataInit : function (elem) {
									var currLevelId = this.id;									
									if(currLevelId.indexOf("_")>0){										
										$(elem).attr("readOnly", true);
									}
							    },maxlength:4,
							    }
			              },			            	
			              {name:'errorDescription',index:'errorDescription', width:200, edittype:'text',classes : 'toUpperCaseInGrid', editrules:{required:true},editable:true, editoptions:{maxlength:45}},
			              {name:'isCustomerError',index:'isCustomerError', width:30, edittype:'text',editrules:{required:true}, formatter:'select', edittype: "select",
								editoptions: {value:'Y:Y;N:N', defaultValue:'Y' },editable:true},
			              {name:'isAdminError',index:'isAdminError', width:30, edittype:'text', editrules:{required:true},formatter:'select', edittype: "select",
									editoptions: {value:"Y:Y;N:N", defaultValue:'Y' },editable:true},
			              {name:'vis',index:'vis',  width:30, edittype:'text', editrules:{required:true},formatter:'select', edittype: "select",
										editoptions: {value:"Y:Y;N:N", defaultValue:'Y' },editable:true},
			              {name:'activeFlag',index:'activeFlag', width:30, edittype:'text', editrules:{required:true},formatter:'select', edittype: "select",
											editoptions: {value:"Y:A;N:I", defaultValue:'A' },editable:true},
			              {name:'actions', index:'actions', width:30, align:"center", editable:false, search:false, sortable:false,formatter:'actions',  formatoptions : {
								keys : true,
								editbutton:true,
								delbutton:false,
	            	  }}			              
								];
			
						createGrid(
								'BLFCErrorCodeMaintenanceGrid', // grid id for Standing Instruction
								'BLFCErrorCodeMaintenancePage', // page id for Standing Instruction
								'/gates/bl/errorCodeMaintenance/loadErrorCodeMGrid', 
								'/gates/bl/errorCodeMaintenance/addErrorCode', 
								'/gates/bl/errorCodeMaintenance/editErrorCode',
								'',
								'',
								colNames, 
								colModel, 
								'',
								275
								,20 ,[10,20,30] ,
								false,
								false, true, // load once hideEdit/Del
								false, false, isFcerrorcodemaintenanceUpdate?false:true, true, true,
								true, false, false, false, false,
								gridComplete, false, true );
		  
						
						
		/*Permission Shipment security*/				
			enforceSecurityDivAndButtons("mainDiv", isFcerrorcodemaintenanceDisplayOnly);
			enforceSecurityDivAndButtons("cancelErrorCode", isFcerrorcodemaintenanceModifiable);
			enforceSecurityDivAndButtons("saveErrorCode", isFcerrorcodemaintenanceModifiable);
			enforceSecurityTitle(isFcerrorcodemaintenanceDisplayOnly);
		}
);
function gridComplete()
{
	$("#BLFCErrorCodeMaintenanceGrid").trigger('reloadGrid');
	if(isFcerrorcodemaintenanceAdd){
		$('#sData').show();
		$('#gview_BLFCErrorCodeMaintenanceGrid input').css("visibility", 'visible');
		$('#gview_BLFCErrorCodeMaintenanceGrid select').css("visibility", 'visible');
	}else{
		$('#sData').hide();
		$('#gview_BLFCErrorCodeMaintenanceGrid input').css("visibility", 'hidden');
		$('#gview_BLFCErrorCodeMaintenanceGrid select').css("visibility", 'hidden');
	}
}
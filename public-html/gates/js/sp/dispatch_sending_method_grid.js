/*$(document).ready(
		function () {
			var colNames=['id', 'Organisation/Contact Name', 'Primary Communication Method','From CP', 'Value',''];
			var colModel=[
			              {name:'id',index:'id', editable:false,hidden:true, formatter:'number', cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			              {name:'orgName',index:'orgName', width:180, editable:true, editoptions:{size:50}},
			              {name:'primaryCommMethod',index:'primaryCommMethod', width:180, editable:true, editrules:{required:true},edittype: 'select',editoptions: { value:'P:Primary Email;F:Fax;A:Alternate Email;' }   	
			               },	   					 
			              {name:'fromCp',index:'fromCp', width:180, editable:false, editoptions:{size:50}},
			              {name:'value',index:'value', width:180, editable:true, editoptions:{size:20}},			       
			              {name:'actions', index:'actions', width:70, align:"center", editable:true, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
			              ];
						createGrid(
								'dispatchSendingMethodGridTable', // grid id for Standing Instruction
								'dispatchSendingMethodGridDiv', // page id for Standing Instruction
								'../createdispatch/loadDispatchSendingMethodGrid', 
								'../createdispatch/loadDispatchSendingMethodGrid', 
								'../createdispatch/loadDispatchSendingMethodGrid',
								'../createdispatch/loadDispatchSendingMethodGrid', 
								'',
								colNames, 
								colModel, 
								'Status',
								210
								,10 ,[10,20,30] ,
								false,  multiselect 
								false,  multidelete 
								true,
								false,
								null,  //jsonReader 
								false,  //hideEdit 
								false  hideDelete );					

	}
);


function setFormattedDate(){
	var todaysDate = new Date();
	
	var day = todaysDate.getDate();
	if(eval(day<10)){
		day = '0'+day;
	}
	var month = eval(eval(todaysDate.getMonth())+eval(1));
	if(eval(month<10)){
		month = '0'+month;
	}
	var year = todaysDate.getFullYear();
	return month + "-"+day+"-"+year;
	//return month+"-"+day+"-"+year;
}
*/
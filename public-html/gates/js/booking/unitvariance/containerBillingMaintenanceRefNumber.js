$(document).ready(function () {
	var isEdit = false;
	var rowNum = '';
	var colNamesReferenceNumber = ['Id', 'receivedFreightId','bookingID','shipmentId','shipmentFreightId', 'Process Level', 'Copy Bill To Header','Category Code', 'Reference Number', 'Type', 'Header', 'Actions'];
	var colModelReferenceNumber = [
	               {name : 'seqNo',index : 'seqNo',width : 55,hidden : true},
	               {name : 'receivedFreightId',index : 'receivedFreightId',hidden : true},
	               {name : 'bookingID',index : 'bookingID',hidden : true},
	               {name : 'shipmentId',index : 'shipmentId',hidden : true},
	               {name : 'shipmentFreightId',index : 'shipmentFreightId',hidden : true},
	               {name : 'processLevelCode',index : 'processLevelCode',width : 55,hidden : true},
	               {name : 'isCopyBillToHeader',index : 'isCopyBillToHeader',width : 55,hidden : true},
	               {name : 'categoryCode',index : 'categoryCode',width : 55,hidden : true},
			   	   {name:'referenceNumberNotation',index:'referenceNumberNotation', width:200, editable:true, 
						editrules:{
							maxlength :80,
							custom:true,
		            		custom_func:function (value, colname) {
		            			var result = true;
		            			var typeCode='';
		            			if(!isEdit){
									if (value.indexOf(',') != -1) {
										var patt = value.split(',');
										for ( var i = 0; i < patt.length; i++) {
											if ($.trim(patt[i]) == '') {
												result = false;
												break;
											}
										}
									}
								}
		            			if(rowNum==''){
									typeCode=$("#typeCode").val();
									
								}else{
									typeCode=$("#"+rowNum+"_typeCode").val();
								}
		            			if ((null == value || $.trim(value) == '') && ((null == typeCode || $.trim(typeCode) == ''))) {
									return [ false,"Reference Number and Type Code are required." ];
								}
		            			
								if (null == value || $.trim(value) == '') {
									return [ false,
											"Reference Number cannot be spaces when Reference Type is present." ];
								}
								if (!result) {
									return [ false,
											"Reference Number cannot be spaces when Reference Type is present." ];
								} else {
									return [ true, "" ];
								}
		            		}
		            	}
			   		},
			   		{name:'typeCode',index:'typeCode', width:200, editable:true, editrules:{required:true}, formatter:'select', edittype:"select", editoptions:{value:":Select;S:Shipper;C:Consignee;B:Both S&C;F:Forwarder;I:ITN;E:ITN Exempt;T:Military TCN"}},
			   		{name:'isCopyBillToHeader',index : 'isCopyBillToHeader',width: 55,editable:true,formatter:'select', edittype:"select",editoptions:{value:"Y:Y;N:N"}},
			   		{name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{
			   			keys:true,
			   			onEdit: function(rowId){
							isEdit = true;
							rowNum=rowId;
						},
						onSuccess:function(jqXHR){
							isEdit = false;
							return true;
						},
						afterRestore:function(){
							isEdit = false;
							return true;
						}
			   		}}
			   	];

	var jsonReaderReference = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};

	/*createGrid(
			"referenceNumberGrid", // grid id for user
			"pagerGrid", // page id for user 
			_context+'/containerBilling/loadReferenceNo', 
			_context+'/containerBilling/addReferenceNo', 
			_context+'/containerBilling/updateReferenceNo', 
			_context+'/containerBilling/loadReferenceNo',
			'',
			colNamesReferenceNumber, 
			colModelReferenceNumber, 
			"Reference Number(s)",
			90,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			false, jsonReaderReference, false, false, true, true, false, false,
			null, false);*/
	
	createGrid(
			"referenceNumberGrid",
			"pagerGrid",
			_context+'/containerBilling/loadReferenceNo', 
			_context+'/containerBilling/addReferenceNo', 
			_context+'/containerBilling/updateReferenceNo', 
			_context+'/containerBilling/deleteReferenceNo',
			_context+'/containerBilling/deleteReferenceNo',
			colNamesReferenceNumber, 
			colModelReferenceNumber, 
			"Reference Number(s)",
			83,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			false, jsonReaderReference, false, false, false, true, 
			false, false, false, false, referenceGridLoadComplete, false, true);
	
});
var referenceGridLoadComplete = function() {
	//$('#pagerGrid .ui-pg-input').attr("readonly", true);
	
//	Security Implementation
	enforceSecurityOnReferenceNumbers();
};
function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}
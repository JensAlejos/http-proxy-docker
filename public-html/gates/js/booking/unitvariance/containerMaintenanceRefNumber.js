$(document).ready(function () {
	var isEdit = false;
	var rowNum = '';
	var colNamesReferenceNumber = ['Id', 'receivedFreightId','bookingID','shipmentId','shipmentFreightId', 'Process Level', 'Copy Bill To Header', 'Type', 'Reference Number', 'Header', 'Actions'];
	var colModelReferenceNumber = [
	               {name : 'seqNo',index : 'seqNo',width : 55,hidden : true},
	               {name : 'receivedFreightId',index : 'receivedFreightId',hidden : true},
	               {name : 'bookingID',index : 'bookingID',hidden : true},
	               {name : 'shipmentId',index : 'shipmentId',hidden : true},
	               {name : 'shipmentFreightId',index : 'shipmentFreightId',hidden : true},
	               {name : 'processLevelCode',index : 'processLevelCode',width : 55,hidden : true},
	               {name : 'isCopyBillToHeader',index : 'isCopyBillToHeader',width : 55,hidden : true},
			   	   {name:'typeCode',index:'typeCode', width:200, editable:true, editrules:{required:true}, formatter:'select', edittype:"select",editoptions:{value:":Select;S:Shipper;C:Consignee;B:Both S&C;F:Forwarder;I:ITN;E:ITN Exempt;T:Military TCN"}},
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
								} 
								//change for D025316
								if(billExists=="Y"){
									var isConfirm = confirm("Billing already Started. Please confirm to proceed! ");
									if (isConfirm) {
										return [ true, "" ];
									}
									else	{									
										return [ false,
											"Billing already Started" ];
									}
								}
								//change
								 else {
										return [ true, "" ];
									}
		            		}
		            	}
			   		},
			   		{name:'isCopyBillToHeader', index : 'isCopyBillToHeader',width : 55,editable:true,formatter:'select', edittype:"select",editoptions:{value:"Y:Y;N:N", defaultValue:"Y"}},
			   		{name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{
			   			keys:true,
			   			onEdit: function(rowId){
							isEdit = true;
							/*if(rowNum!=''){
								var message='Please save/cancel row#'+rowNum+'before editing row#'+rowId;
								alert(message);
								$('table[aria-labelledby="gbox_referenceNumberGrid"] thead tr[id="FormError"] td').html(message);
								 jQuery('#referenceNumberGrid').saveRow(rowId);
								 //jQuery('#referenceNumberGrid').editRow(rowId,false);
							}else{
								$('table[aria-labelledby="gbox_referenceNumberGrid"] thead tr[id="FormError"] td').html("");
								$('table[aria-labelledby="gbox_referenceNumberGrid"] thead tr[id="FormError"] td').hide();
							}*/
							rowNum=rowId;
							//change for D025316
							//D026443: Disable isCopyBillToHeader only when container is billed 
							if($('#billedOn').text() != ''){
								$('select[name^="isCopyBillToHeader"]').val("N");
								$('select[name^="isCopyBillToHeader"]').attr('disabled', true);
							}

						},
						onSuccess:function(jqXHR){
							rowNum="";
							isEdit = false;
							return true;
						},
						afterSave:function(jqXHR){
							rowNum="";
							isEdit = false;
							return true;
						},
						afterRestore:function(){
							isEdit = false;
							rowNum="";
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
			_context+'/receivedContainer/loadReferenceNo', 
			_context+'/receivedContainer/addReferenceNo', 
			_context+'/receivedContainer/updateReferenceNo', 
			_context+'/receivedContainer/deleteReferenceNo',
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
			true, false);*/
	
	createGrid(
			"referenceNumberGrid",
			"pagerGrid",
			_context+'/receivedContainer/loadReferenceNo', 
			_context+'/receivedContainer/addReferenceNo', 
			_context+'/receivedContainer/updateReferenceNo', 
			_context+'/receivedContainer/deleteReferenceNo',
			_context+'/receivedContainer/deleteReferenceNo',
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
			false, false, false, false, customloadComplete, false, true);
	
});


//Security Implementation
var customloadComplete = function() {
//D027248: 	Booking/ Container Maintenance-Container level reference numbers: cannot see booked values when the container is billed
	if($("#referenceNumberGrid").getGridParam("url") == _context+'/receivedContainer/loadBookingReferenceNo'){
    	$('#gview_referenceNumberGrid div table thead tr#tr_seqNo').hide();
		$('#referenceNumberGrid tbody tr td div.ui-inline-edit').hide();
		$('#referenceNumberGrid tbody tr td div.ui-inline-del').hide();
		$('#del_referenceNumberGrid').hide();
    	$('#referenceNumberGrid').jqGrid('setGridParam', { url: _context+'/receivedContainer/loadReferenceNo' ,datatype:"json"});
	} else{
		$('#gview_referenceNumberGrid div table thead tr#tr_seqNo').show();
		$('#del_referenceNumberGrid').show();
	}
	enforceSecurityOnReferenceNumbers();
};

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}

function loadContainerReferenceNoGrid(){
	//$('#pagerGrid .ui-pg-input').attr("readonly", true);
	$('#referenceNumberGrid').trigger("reloadGrid");
}

function unloadContainerReferenceNoGrid(){
	$('#referenceNumberGrid').jqGrid('GridUnload');
}
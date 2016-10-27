
		function makeRemitGrid() {
			var colNames=['id','Payment Method ', 'Check Number', 'Amount($)', 'Issue Date','Actual Recipient','Payment Description','Status'];
			var colModel=[
			              {name:'id',index:'id', editable:false,hidden:true, formatter:'number', 
	                       cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			              {name:'paymentMethodCode',index:'paymentMethodCode', width:130,editable:true},
			              {name:'sapCheckNumber',index:'sapCheckNumber', width:120,editable:true},
			              {name:'apCheckAmount',index:'apCheckAmount', width:100,editable:true,  cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			              {name:'apCheckDate',index:'apCheckDate', width:100,editable:true},
			              {name:'actualRecipientName',index:'actualRecipientName', width:200,editable:true},
			              {name:'paymentDescription',index:'paymentDescription', width:140,editable:true},
			              {name:'isCheckVoid',index:'isCheckVoid', width:95,editable:true}
			              ];
			
			var jsonReaderSpSvc = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "PaymentInfoGrid"
				};
						createGrid(
								'PaymentInfoGrid', // grid id for Standing Instruction
								'PaymentInfoPage', // page id for Standing Instruction
								'/gates/fp/remitAdviceSummary/loadPaymentInfoGrid', 
								'', 
								'',
								'', 
								'',
								colNames, 
								colModel, 
								'Payment Information',
								150
								,10 ,[10,20,30] ,
								false, 
								false, 
								false,
								true,/* isReadOnly */
								jsonReaderSpSvc,/* JSON */
								false, /* hideEdit */
								false 
								/* hideDelete */
								);
		}

/*function highlight(cellvalue, options, rowObject ){
	if(cellvalue=="Voided"){
		$("#"+options.rowId).addClass('redclass');
	}
	
}*/
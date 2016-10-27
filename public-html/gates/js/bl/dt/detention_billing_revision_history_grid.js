$(document).ready(
		function () {
			var colNames=['Revision','Free Days', 'Detention Days', 'Rate', 'Amount','Status','Pending','Issued'];
			var colModel=[
			              {name:'revisionNumber',index:'revisionNumber', editable:false, 
	                       cellattr: function (rowId, val, rawObject, cm, rdata) { return '';}},
			              {name:'freedays',index:'freedays', width:100,editable:false},
			              {name:'detentionDays',index:'detentionDays', width:100,editable:false},
			              {name:'rateAmount',index:'rateAmount', formatter:'number', width:100,editable:false,  cellattr: function (rowId, val, rawObject, cm, rdata) { return '';}},
			              {name:'billAmount',index:'billAmount', formatter:'number', width:100,editable:false},
			              {name:'statusCode',index:'statusCode', width:95,editable:false},
			              {name:'pendingDate',index:'pendingDate', width:95,editable:false},
			              {name:'issuedDate',index:'issuedDate', width:95,editable:false}
			              ];
						createGrid(
								'RevisionHistoryGrid', // grid id for Standing Instruction
								'RevisionHistoryPage', // page id for Standing Instruction
								'/gates/dt/revisionHistory/loadRevisionHistoryGrid', 
								'', 
								'',
								'', 
								'',
								colNames, 
								colModel, 
								'',
								210
								,10 ,[10,20,30] ,
								false, /* multiselect */
								false, /* multidelete */
								true,
								true,/* isReadOnly */
								null,/* JSON */
								false, /* hideEdit */
								false /* hideDelete */
						);
		});
/*function highlight(cellvalue, options, rowObject ){
	if(cellvalue=="Voided"){
		$("#"+options.rowId).addClass('redclass');
	}
	
}*/
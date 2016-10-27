$(document).ready(function() {
	var overlayButtonAction = "";

		$('.FormData').remove();
});	//document ready function end


function createClauseHHGSGrid(){
	var colNames = ['Id','Seq','Clause Code', 'Is Editable', 'Clause Type','Text','Source','' ];
	  
	  var colModel = [
	       {name:'clauseSeqNo', hidden:true},
	       {name:'clauseHHGSSeqNo', index:'clauseHHGSSeqNo', width:50},
	       {name:'standardClauseCode', index:'standardClauseCode', width:80,editable:false,
	     	  formatter : (isMaintainbillhhgdsUpdate==true?'clauseHHGSShowLink': 'formatLink'),
	     	 
	        /*  formatoptions : {
					baseLinkUrl : "javascript:",
					showAction : "editClause('",
					addParam : "');"
				}*/},
	       {name:'isEditable', hidden:true},
	       {name:'clauseTypeCode', index:'clauseTypeCode', width:100,editable:false},
	       {name:'clauseText',index:'clauseText', width:300, editable:false, editrules : { required : true, custom:true}},
	       {name:'clauseSource',index:'clauseSource', width:150, editable:false},
	       {name:'actions', index:'actions', align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	       ];
		jQuery.extend($.fn.fmatter,
				{
			clauseHHGSShowLink : function(cellvalue,
							options, rowdata) {
				if(readOnlyCommodityHHGSGrid == false && readOnlyClauses == false){
					return '<a href="javascript:editClause('+rowdata.clauseSeqNo.toString()+
					')" style="text-decoration:underline;" >'+cellvalue+'</a>';
				}else{
					
					return cellvalue;
				}
					}
					});
	  var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "clauseSeqNo"
			};

			createGrid(
			"clauseGridHHGS", // grid id for party
			"clauseHHGSPager", // page id for party
			_context+'/houseHoldShipment/clause/loadClauseGrid', // load grid url
			'', // addurl
			'', // edit url		
			_context+'/houseHoldShipment/clause/deleteClause',// delete single
			'',
			colNames, colModel, "Clauses",// caption
			90,// height
			3,// row num
			[3,6,9],// row list
			false,// multiselect
			false,// multidelete
			false,// load once
			false, // read only grid
			jsonReader, // json reader
			true, // hide edit
			(isMaintainbillhhgdsDelete==true?false:true), // hide delete
			false, // autowidth
			false, // rownumbers
			false, // hide custom add row
			false,// hide pager row
			false,// custom edit method
			false,// custom grid complete
			setClauseDiv,// custom load complete
			false,// default hidden
			false);// row Color Based On status
			
}
function editClause(id) {
	var clauseSeqNo = id;
	showClauseDialog(clauseSeqNo);
}

function showClauseDialog(clauseSeqNo){
	var queryString = "clauseSeqNo="+clauseSeqNo;
		$.ajax({
		url: _context+"/houseHoldShipment/clause/getClause",
		data:queryString,
		success: function(responseText){
			overlayButtonAction = "editClause";
			var urlValue = _context +"/houseHoldShipment/clause/updateClause";
			createDialog('Edit Clause',urlValue);
			setShipmentNumberDropDown(responseText);
			$("#addHouseHoldClauseDialog").dialog('open');
			//tabSequence('#houseHoldClauseForm');
			somethingChangedClause="";
			$('#clauseSeqNo').val(responseText.data.holdClauseForm.clauseSeqNo);
			$("#standardClauseCode").val(responseText.data.holdClauseForm.standardClauseCode);
			$("#text").val(responseText.data.holdClauseForm.clauseText);
			$("#seq").val(responseText.data.holdClauseForm.clauseHHGSSeqNo);
			$("#isEditable").val(responseText.data.holdClauseForm.isEditabl);
		   
			$("#seq").attr("disabled","disabled");
			$("#custom").attr("disabled", true);
			$("#standardClauseCode").attr('readOnly',true);
			
			if($('#isEditable').val()=='Y')
				{
					$("#text").attr("readonly", false);
				}
			//jQuery("#clauseGridHHGS").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
			
		}
	});
}


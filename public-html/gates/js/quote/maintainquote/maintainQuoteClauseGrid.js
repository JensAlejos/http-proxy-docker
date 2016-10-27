var _clausesGridCount = -1;
$(document).ready(
		function() {
			
			var isRemovable = true;
			var isEditable;
			var link;
			
			/*Quote Security*/
			var showLink='showlink';
			var multiDelete=true;
			if(isClauseDisplayOnly && ! isClauseModifiable){
				showLink='';			
				multiDelete=false;
				isRemovable = false;
			}
			
			if($("#quoteStatusCD").val() == "ISSD" || $("#quoteStatusCD").val() == "BKGD"){
				isRemovable=false;
				isEditable="";
				link = "";
			} else {
				/*Quote Security*/
				isRemovable=true;
				/*isEditable=showLink;
				link = _context+'/quote/clause/showFormEdit';*/
				
				isEditable="";
				link = "";
			}
			
			
			var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "id"
			};
						
			var colNamesForQuoteClauseGrid = [ 'Id', 'Type', 'Code', 'Text','Date/Time','Source','IsEdit' ,'Action'];
			var colModelForQuoteClauseGrid = [
			   {name : 'id', label : 'id', index : 'id', editable : false, width : 20, hidden : true, formatter : 'number' 
			}, {name : 'clauseTypeCode', label : 'clauseTypeCode', index : 'clauseTypeCode', width : 85, editable : false,	editrules : {required : true}, hidden : false, formatter : isEditable,
				formatoptions : {
					baseLinkUrl : link,
					addParam : '&actionPerformed=edit'}
			}, {name : 'standardClauseCode', label : 'standardClauseCode', index : 'standardClauseCode', width : 100, editable:false, editrules:{required:true}, editoptions:{size:20}
			}, {name : 'clauseText', label : 'clauseText', index : 'clauseText', width : 450, editable:false, editrules:{required:true}, editoptions:{size:1800}
			}, {name : 'appliedDate', align:'center', label : 'Date/Time', index : 'appliedDate', width:145, sorttype:'date', datefmt:'mm-dd-YYYY'
			}, {name : 'clauseSource', label : 'clauseSource', index : 'clauseSource', width:110, editable:false, editrules:{required:true}, editoptions:{size:20}
			}, {name : 'isEditable', label : 'isEditable', index : 'isEditable', editable : false, width : 20, hidden : true
			}, {name:'act',index:'act', width:55,sortable:false
			}];
		
			createGrid("quoteClauseGrid", "pagerQuoteClauseGrid",
					_context+'/quote/clause/loadGrid'/*(geturl)*/, ''/*(addurl)*/, ''/*(editURL)*/, ''/*(deleteURL)*/, _context+'/quote/clause/deleteSelected'/*(deleteSelectedURL)*/,
					colNamesForQuoteClauseGrid, colModelForQuoteClauseGrid,
					"Instruction"/*(caption)*/, 210, 9, [ 9, 12 ], true/*(multiselect)*/, isRemovable/*(multidelete)*/, false/*(loadOnce)*/, true/*(readOnlyGrid)*/,
					jsonReader, true,true,true,false,true,false,null,custom,null,false,true);
			
			
			jQuery("#quoteClauseGrid").jqGrid(
				'setGridParam',{
					onSelectRow:function(rowid,
							status){
					$('#msgDiv').html('');
					return true;
				},
				onSelectAll:function(aRowids,
						status){
					$('#msgDiv').html('');
					return true;
				}
			});
		});
var custom = function customGridComplete()
{
 var rowIDs = jQuery("#quoteClauseGrid").getDataIDs(); 
  for (var i=0;i<rowIDs.length;i=i+1){ 
    var rowData=jQuery("#quoteClauseGrid").getRowData(rowIDs[i]);
    var trElement = jQuery("#"+ rowIDs[i],jQuery('#quoteClauseGrid'));
    if (!(rowData.clauseTypeCode=='C' || rowData.isEditable=='true')) {	
        $($(trElement.children()[2]).children()).removeAttr('href');
    }
    else
    {
    	var id = (rowData.id).split('.');
    	editLink = "";
    	if(!($("#quoteStatusCD").val() == "ISSD" || $("#quoteStatusCD").val() == "BKGD")){
    		editLink = "<a href='showFormEdit?id="+id[0]+"&actionPerformed=edit'> <img height='20' width='20' border='0' style='vertical-align: middle;' alt='Edit'  title='Edit' src='../../resources/images/ui-icons_pencil.png'></a>";	
    	}        	
		jQuery("#quoteClauseGrid").jqGrid('setRowData',rowIDs[i],{act:editLink});
    }
    if(rowData.clauseTypeCode=='C')
    {
    	$($(trElement.children()[2]).children()).attr('title','Custom');
    }
    else
    {
    	$($(trElement.children()[2]).children()).attr('title','Standard');
    }
    if(rowData.clauseTypeCode=='C'){
    	$("#quoteClauseGrid").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Custom');
    }else if(rowData.clauseTypeCode=='S'){
    	$("#quoteClauseGrid").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Instruction');
    }else{
    	$("#quoteClauseGrid").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Billing Clause');
    }
  }
  setTimeout("delayedDelete()", 250);
};	

function delayedDelete() {
	var numOfClauses = $("#quoteClauseGrid").getGridParam("reccount");
	
	if(_clausesGridCount==-1){
		_clausesGridCount = numOfClauses;
	}else if(_clausesGridCount > numOfClauses){
		_isQuoteClauseChanged = true;
	}
	_clausesGridCount = numOfClauses;		
}

$(function () {
	
	$( "#viewErrorDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true
        , buttons: {
            Save: function(){
                },
            Cancel: function(){
                $( this ).dialog( "close" );
            }
            }
        });
	
	
	
	
	var colNames=['id', 'Cmd', 'Eqp','Sev','Error Text', ''];
	var colModel=[
	              {name:'reErrorMessageId',index:'reErrorMessageId', width:100, editable:false,hidden:true},
	              {name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:true, editrules:{required:true},editoptions: {maxlength:25},formatter:'errorViewFormatter'},
		          {name:'equipmentSeqNbr',index:'equipmentSeqNbr', width:100, editable:true, editrules:{required:true},editoptions: {maxlength:25} },
		          {name:'errorSeverityCode',index:'errorSeverityCode', width:100, editable:true, editrules:{required:true},editoptions: {maxlength:25} },
		          {name:'errorDescription',index:'errorDescription', width:400, editable:true, editrules:{required:true},editoptions: {maxlength:25}},
	              {name:'actions', index:'actions', width:80, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	              ];
	
	jQuery.extend($.fn.fmatter , {
		errorViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewErrorDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "commoditySeqNbr"
		};
	
	
				createGrid(
						'rateErrorGrid', // grid id for Error Display
						'rateErrorPager', // page id for Error Display
						'/gates/rateEngineError/loadRateEngineErrorGrid', 
						'', 
						'',
						'', 
						'',
						colNames, 
						colModel, 
						'List Of Error Messages',
						100
						,10 ,[10,20,30] ,
						true, /* multiselect */
						false, /* multidelete */
						true,
						true,
						jsonReader,/* jsonReader */
						true,
						true)
						 

});


function showViewErrorDialog(id)
{
	//$("#rateEngineCommodityForm").clearForm();
	//clearCommodityHiddenFields();
	$.ajax({
		url: "../rateEngineError/loadErrorGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#viewErrorDialog" ).dialog( "option", "title", 'View RE Error' );
			$( "#viewErrorDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#viewErrorDialog").dialog('open');
			$("#rateEngineErrorMessageForm").loadJSON(responseText);
		}
	});
}
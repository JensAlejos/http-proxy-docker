$(function () {
	
	$( "#editChoiceDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true, buttons: {Save: function(){},
            Cancel: function(){
                				$( this ).dialog( "close" );
            				}
            }
        });
	
	
	
	var colNames=['id', 'Choice Seq No', 'Choice Text', ''];
	var colModel=[
	              {name:'gridID',index:'gridID', width:100, editable:false,hidden:true},
	              {name:'reRatingChoiceSeqNbr',index:'reRatingChoiceSeqNbr', width:200, editable:true, editrules:{required:true},editoptions: {maxlength:25},formatter:'choiceViewFormatter'},
		          {name:'description',index:'description', width:500, editable:true,editrules:{required:true},editoptions: {maxlength:25} },
	              {name:'actions', index:'actions', width:80, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	              ];
	
	
	jQuery.extend($.fn.fmatter , {
		choiceViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewChoiceDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reRatingChoiceSeqNbr"
		};
	
	
	
				createGrid(
						'rateChoiceGrid', // grid id for Choice Display
						'rateChoicePager', // page id for Choice Display
						'/gates/rateEngineChoice/loadRateEngineChoiceGrid', 
						'', 
						'../rateEngineChoice/updateChoice',
						'', 
						'',
						colNames, 
						colModel, 
						'Rate Choice',
						100
						,10 ,[10,20,30] ,
						true, /* multiselect */
						false, /* multidelete */
						true,
						true,
						jsonReader ,/* jsonReader */
						false, true, false, false, true, false,"showEditChoiceDialog") 
						
						//to hide multiselect checkbox in grid
						$("#cb_rateChoiceGrid").hide();

});

function showViewChoiceDialog(id){
	$("#rateEngineChoiceForm").clearForm();
	clearChoiceHiddenFields();
	$.ajax({
		url: "../rateEngineChoice/loadChoiceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			
			// $('#reRatingChoiceSeqNbr').attr("disabled",'disabled');
			// $('#ratingChoiceDescSetId').attr("title",responseText.ratingChoiceDescSetId);
			$( "#editChoiceDialog" ).dialog( "option", "title", 'View RE Choice' );
			$( "#editChoiceDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#editChoiceDialog").dialog('open');
			$("#rateEngineChoiceForm").loadJSON(responseText);
			
			//populateListBox(responseText);
			
		}
	});
	
}


function showEditChoiceDialog(id){
	//$("#rateEngineChoiceForm").clearForm();
	//clearCommodityHiddenFields();
	$.ajax({
		url: "../rateEngineChoice/loadChoiceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			if(responseText.isSelectable == "N" || responseText.isSelectable == "n" )
			{
				$('#isSelect').attr("disabled",'disabled');
			}
			$( "#editChoiceDialog" ).dialog( "option", "title", 'Edit RE Choice' );
			$( "#editChoiceDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Save",
			                                                   click: function() { updateChoice(); }
			                                               },
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#editChoiceDialog").dialog('open');
			$("#rateEngineChoiceForm").loadJSON(responseText);
		}
	});
	
}

function clearChoiceHiddenFields()
{
	$('#gridID').val('');
}

function updateChoice()
{
	//submitAllSelect();
	var queryString = $('#rateEngineChoiceForm').formSerialize();
	
	$.ajax({
			url: "../rateEngineChoice/updateChoice",
			type: "POST",
			data: queryString,
			success: function(responseText){
				jQuery("#rateChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				$("#editChoiceDialog").dialog('close');
			}
		});
}


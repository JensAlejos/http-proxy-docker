$(function() {
	
	$("#rateEngineChargePayableForm").validationEngine('attach');

	 $('.chargeValidation').click(function() { 
			callvalidation();
	   });
	 
	$( "#maintainChargePayableDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true
        , buttons: {
            Save: function(){
                },
            Cancel: function(){
                $( this ).dialog( "close" );
            }
            }
        });
	
	$("#effectiveDate").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#expirationDate").datepicker({ dateFormat: 'mm-dd-yy' });
	
	//Charge Payable Grid
	var colNamesForChargePayables = ['Charge Payable Id', 'Charge Seq Nbr', 'Commodity Line Seq Nbr', 'Equip Piece Seq Nbr', 'Charge Code', 'Process Level',  'Pass Through Ind', 'Charge Amount', 'Rate', 'Rate Basis', 'Actions'];
	
	var colModelForChargePayables = [
		    			   		{name:'reChargePayableId',index:'reChargePayableId', hidden:true, editable:false, formatter:'integer'},
		    			   		{name:'reChargeSeqNbr',index:'reChargeSeqNbr', width:100, editable:false, formatter:'chargeViewFormatter'},
		    			   		{name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:true, editrules:{required:true}},
		    			   		{name:'equipmentSeqNbr', index: 'equipmentSeqNbr', width:100, editable: true, editrules: { required: true }},
		    			   		{name:'chargeCode',index:'chargeCode', width:50, editable:true, editrules:{required:true}},
		    			   		{name:'processLevelCode',index:'processLevelCode', width:80, editable:true, editrules:{required:true}},
		    			   		{name:'isPassThrough',index:'isPassThrough', width:100, formatter:'checkbox',editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }},
		    			   		{name:'chargeAmount',index:'chargeAmount', width:75, formatter:'number', editable:true,  edittype:'text', editrules: { required: true }},
		    			   		{name:'rate',index:'rate', width:50, editable:true, editrules:{required:true}},
		    			   		{name:'rateBasisCode',index:'rateBasisCode', width:75, editable:true, editrules:{required:true}},
	    			   			{name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
		    			   	];
	
	jQuery.extend($.fn.fmatter , {
		chargeViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewChargePayableDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reChargeSeqNbr"
		};
	
	createGrid(
			"gridIdForChargesPayable", "pagerIdForChargesPayable", 
			'../rateengine/loadRateEngineChargePayableGrid', 
			'', '../rateengine/updateChargePayable', 
			'../rateengine/deleteChargePayable', 
			'',
			colNamesForChargePayables, colModelForChargePayables, "Charge Payables",  //Caption
			70, 3, [3,6,9],
			true, false, true, true, jsonReader, false, false, false, false, true, false,
			"showEditChargePayableDialog", false, false, false, true);
});

function showViewChargePayableDialog(id){
	$("#rateEngineChargePayableForm").clearForm();
	clearChargePayablesHiddenFields();
	$.ajax({
		url: "../rateengine/loadChargePayableGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainChargePayableDialog" ).dialog( "option", "title", 'View RE Charge Payables' );
			$( "#maintainChargePayableDialog" ).dialog( "option", "buttons", [
			   			                                               {
			   			                                                   text: "Cancel",
			   			                                                   click: function() { $(this).dialog("close"); }
			   			                                               }
			   			                                               ] );
			$("#maintainChargePayableDialog").dialog('open');
			$("#rateEngineChargePayableForm").loadJSON(responseText);
		}
	});
}



function showAddChargePayableDialog(){
	$("#rateEngineChargePayableForm").clearForm();
	clearChargePayablesHiddenFields();
	$( "#maintainChargePayableDialog" ).dialog( "option", "title", 'Add RE Charge Payable' );
	$( "#maintainChargePayableDialog" ).dialog( "option", "buttons", [
	   			                                               {text: "Save", click: function() { addChargePayable(); }},
	   			                                               {text: "Cancel", click: function() 
	   			                                            	   { 
		   			                                            	   $('.chargeValidation').validationEngine("hideAll");
		   			                                            	   $(this).dialog("close"); 
	   			                                            	   }}
	   			                                               ] );
	$("#chargeRatingSet").val($("#reHeaderId").val());
	$( "#maintainChargePayableDialog" ).dialog('open');
}

function addChargePayable(){
	if (callvalidation()==true && $("#rateEngineChargePayableForm").validationEngine('validate')) {
		$('.chargeValidation').validationEngine("hideAll");
	var queryString = $('#rateEngineChargePayableForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/addChargePayable",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForChargesPayable").setGridParam({rowNum:10,datatype:"json" }).trigger("reloadGrid");
				$("#maintainChargePayableDialog").dialog('close');
			}
		});
}
	return false;
}

function showEditChargePayableDialog(id){
	$("#rateEngineChargePayableForm").clearForm();
	clearChargePayablesHiddenFields();
	$.ajax({
		url: "../rateengine/loadChargePayableGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainChargePayableDialog" ).dialog( "option", "title", 'Edit RE Charge Payable' );
			$( "#maintainChargePayableDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Save",
			                                                   click: function() { updateChargePayable(); }
			                                               },
			                                               {
			                                                   text: "Cancel",
			                                                   click: function()
			                                                   {
			                                                	   $('.chargeValidation').validationEngine("hideAll");
			                                                	   $(this).dialog("close");
			                                                   }
			                                               }
			                                               ] );
			$("#maintainChargePayableDialog").dialog('open');
			$("#rateEngineChargePayableForm").loadJSON(responseText);
		}
	});
	
}

function updateChargePayable(){
	if (callvalidation()==true && $("#rateEngineChargePayableForm").validationEngine('validate')) {
		$('.chargeValidation').validationEngine("hideAll");
	var queryString = $('#rateEngineChargePayableForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/updateChargePayable",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForChargesPayable").setGridParam({rowNum:10,datatype:"json" }).trigger("reloadGrid");
				$("#maintainChargePayableDialog").dialog('close');
			}
		});
}
	return false;
}
function clearChargePayablesHiddenFields()
{
	$('#chargeGridId').val('');
	$('#reChargePayableId').val('');
	$('#rateCurrencyCode').val('');
	$('#unitUomCode').val('');
	$('#numericValueUomCode').val('');
}

function callvalidation(){
	
	var i=0;
	$('.chargeValidation').each(function(){
		if ($(this).val() == ""){
			i=i+1;
			$(this).validationEngine('showPrompt', 'This field is required.', 'error', true);
			return false;
		}
	});
	if(i==0){
		return true;
	}
}
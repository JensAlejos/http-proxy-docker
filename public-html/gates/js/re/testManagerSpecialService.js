$(function() {

    $( "#maintainSpecialServiceDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true
        , buttons: {
            Save: function(){ 
            	},
            Cancel: function(){ $( this ).dialog( "close" ); }
            }
        });
    
  //Special Services Grid
	var colNamesForSpecialServices = ['reSpecialServiceId', 'Special Services Seq Nbr', 'Commodity Line Seq Nbr','Eqip Piece Seq Nbr', 'Special Service Code', 'Special Service Numeric', 'Actions'];
	
	var colModelForSpecialServices = [
	    			   		{name:'reSpecialServiceId',index:'reSpecialServiceId', width:50, editable:false,hidden:true},
	    			   		{name:'reSpecialServiceSeqNbr',index:'reSpecialServiceSeqNbr', width:120, editable:true, editrules:{required:true}, formatter:'serviceViewFormatter'},
	    			   		{name:'commoditySeqNbr',index:'commoditySeqNbr', width:120, editable:true, editrules:{required:true}},
	    			   		{name:'equipmentSeqNbr', index: 'equipmentSeqNbr', width:120, editable: true, editrules: { required: true }, hidden:false},
	    			   		{name:'specialServiceCode',index:'specialServiceCode', width:150, editable:true, editrules:{required:true}},
	    			   		{name:'specialServiceNumeric',index:'specialServiceNumeric', width:150, editable:false, editrules:{required:true}},
    			   			{name:'actions', index:'actions', width:100, align:"center", search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	    			   	];
	
	jQuery.extend($.fn.fmatter , {
		serviceViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewSpecialServiceDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reSpecialServiceSeqNbr"
		};
	    	
	createGrid(
			"gridIdForSpecialServices", "pagerIdForSpecialServices", 
			'../rateengine/loadRateEngineSpecialServiceGrid', 
			'', '../rateengine/updateSpecialService', 
			'../rateengine/deleteSpecialService', 
			'',
			colNamesForSpecialServices, colModelForSpecialServices, "Special Services",  //Caption
			70, 3, [3,6,9],
			true, false, true, true, jsonReader, false, false, false, false, true, false,
			"showEditSpecialServiceDialog", false, false, false, true);

});

function showViewSpecialServiceDialog(id){
	$("#rateEngineSpecialServiceForm").clearForm();
	clearServicesHiddenFields();
	$.ajax({
		url: "../rateengine/loadSpecialServiceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainSpecialServiceDialog" ).dialog( "option", "title", 'View RE Special Service' );
			$( "#maintainSpecialServiceDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#maintainSpecialServiceDialog").dialog('open');
			$("#rateEngineSpecialServiceForm").loadJSON(responseText);
		}
	});
	
}

function showAddSpecialServiceDialog(){
	$("#rateEngineSpecialServiceForm").clearForm();
	clearServicesHiddenFields();
	$( "#maintainSpecialServiceDialog" ).dialog( "option", "title", 'Add RE Special Service' );
	$( "#maintainSpecialServiceDialog" ).dialog( "option", "buttons", [
	   			                                               {text: "Save", click: function() { addSpecialService(); }},
	   			                                               {text: "Cancel", click: function() { $(this).dialog("close"); }}
	   			                                               ] );
	$("#specialServicesRatingSet").val($("#reHeaderId").val());
	$( "#maintainSpecialServiceDialog" ).dialog('open');
}

function addSpecialService(){

	var queryString = $('#rateEngineSpecialServiceForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/addSpecialService",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForSpecialServices").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				$("#maintainSpecialServiceDialog").dialog('close');
			}
		});
}

function showEditSpecialServiceDialog(id){
	$("#rateEngineSpecialServiceForm").clearForm();
	clearServicesHiddenFields();
	$.ajax({
		url: "../rateengine/loadSpecialServiceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainSpecialServiceDialog" ).dialog( "option", "title", 'Edit RE Special Service' );
			$( "#maintainSpecialServiceDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Save",
			                                                   click: function() { updateSpecialService(); }
			                                               },
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#maintainSpecialServiceDialog").dialog('open');
			$("#rateEngineSpecialServiceForm").loadJSON(responseText);
		}
	});
	
}

function updateSpecialService(){

	var queryString = $('#rateEngineSpecialServiceForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/updateSpecialService",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForSpecialServices").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				$("#maintainSpecialServiceDialog").dialog('close');
			}
		});
}

function clearServicesHiddenFields()
{
	$('#serviceGridId').val('');
	$('#reSpecialServiceId').val('');
	$('#specialServiceNumericUomCd').val('');
}
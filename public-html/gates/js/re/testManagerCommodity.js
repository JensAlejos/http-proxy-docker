$(function() {
    $( "#maintainCommodityDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true
                                            , buttons: {
                                                Save: function(){
                                                    },
                                                Cancel: function(){
                                                    $( this ).dialog( "close" );
                                                }
                                                }
                                            });
    
  //Commodities Grid
	var colNamesForCommodities = ['reCommodityId', 'Commodity Line Seq Nbr','Item Code', 'User Note Nbr','Commodity Code', 'Commodity Description', 'Certification Indicator',  'Trade Code', 'Multiple Cmdy In Eqp', 'Multiple Trf Itm In Eqp', 'Last Line Cmdy In Eqp Nbr', 'Actions'];
	
	var colModelForCommodities = [
	    			   		{name:'reCommodityId',index:'reCommodityId', width:50, editable:false,hidden:true},
	    			   		{name:'reCommoditySeqNbr',index:'reCommoditySeqNbr', width:100, editable:true, editrules:{required:true}, formatter:'commodityViewFormatter'},
	    			   		{name:'tariffServiceItemCode',index:'tariffServiceItemCode', width:100, editable:true, editrules:{required:true}},
	    			   		{name:'userNoteCode',index:'userNoteCode', width:50, editable:true, editrules:{required:true}},
	    			   		{name:'commodityCode', index: 'commodityCode', width:50, editable: true, editrules: { required: true }, hidden:false},
	    			   		{name:'commodityDescription',index:'commodityDescription', width:200, editable:true, editrules:{required:true}},
	    			   		{name:'isRequireCertificate',index:'isRequireCertificate', width:80, formatter:'checkbox',editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }},
	    			   		{name:'tradeCode',index:'tradeCode', width:50, editable:false, editrules:{required:true}},
	    			   		{name:'isMultiCommodityEquipment',index:'isMultiCommodityEquipment', width:50, formatter:'checkbox', editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }, editrules:{required:true}},
	    			   		{name:'isMultiTariffItemEquipment',index:'isMultiTariffItemEquipment', width:50, formatter:'checkbox', editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }, editrules:{required:true}},
	    			   		{name:'lastLineCmdtyEquipmentNbr',index:'lastLineCmdtyEquipmentNbr', width:100, editable:true, editrules:{required:true}},
    			   			{name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	    			   	];
	
	jQuery.extend($.fn.fmatter , {
		commodityViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewCommodityDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reCommoditySeqNbr"
		};
	    	
	createGrid(
			"gridIdForCommodities", "pagerIdForCommodities", 
			'../rateengine/loadRateEngineCommodityGrid', 
			'', '../rateengine/updateCommodity', 
			'../rateengine/deleteCommodity', 
			'',
			colNamesForCommodities, colModelForCommodities, "Commodities",  //Caption
			70, 3, [3,6,9],
			true, false, true, true, jsonReader, false, true, false, false, true, false,
			"showEditCommodityDialog", false, false, false, true);
	
});

function showViewCommodityDialog(id){
	$("#rateEngineCommodityForm").clearForm();
	clearCommodityHiddenFields();
	$.ajax({
		url: "../rateengine/loadCommodityGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainCommodityDialog" ).dialog( "option", "title", 'View RE Commodity' );
			$( "#maintainCommodityDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#maintainCommodityDialog").dialog('open');
			//alert('responseText'+responseText.reCommoditySeqNbr);
			//setCommodityFormProperties(responseText);
			//$("#reCommoditySeqNbr").val(responseText.reCommoditySeqNbr);
			$("#rateEngineCommodityForm").loadJSON(responseText);
		}
	});
	
}

function showAddCommodityDialog(){
	$("#rateEngineCommodityForm").clearForm();
	clearCommodityHiddenFields();
	$( "#maintainCommodityDialog" ).dialog( "option", "title", 'Add RE Commodity' );
	$( "#maintainCommodityDialog" ).dialog( "option", "buttons", [
	   			                                               {text: "Save", click: function() { addCommodity(); }},
	   			                                               {text: "Cancel", click: function() { $(this).dialog("close"); }}
	   			                                               ] );
	$("#commodityRatingSet").val($("#reHeaderId").val());
	$( "#maintainCommodityDialog" ).dialog('open');
}

function addCommodity(){

	var queryString = $('#rateEngineCommodityForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/addCommodity",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForCommodities").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				$("#maintainCommodityDialog").dialog('close');
			}
		});
}

function showEditCommodityDialog(id){
	$("#rateEngineCommodityForm").clearForm();
	clearCommodityHiddenFields();
	$.ajax({
		url: "../rateengine/loadCommodityGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainCommodityDialog" ).dialog( "option", "title", 'Edit RE Commodity' );
			$( "#maintainCommodityDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Save",
			                                                   click: function() { updateCommodity(); }
			                                               },
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() { $(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#rateEngineCommodityForm").loadJSON(responseText);
			$("#maintainCommodityDialog").dialog('open');
			
			//setCommodityFormProperties(responseText);
		}
	});
	
}

function updateCommodity(){

	var queryString = $('#rateEngineCommodityForm').formSerialize();
	
	$.ajax({
			url: "../rateengine/updateCommodity",
			type: "POST",
			data: queryString,
			success: function(){
				$("#gridIdForCommodities").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				$("#maintainCommodityDialog").dialog('close');
			}
		});
}

function clearCommodityHiddenFields()
{
	$('#commodityGridId').val('');
	$('#reCommodityId').val('');
	$('#tariffServiceItemCode').val('');
}

function setCommodityFormProperties(responseText)
{
	
	$("#commodityRatingSet").val(responseText.reHeaderId);
	$("#reCommoditySeqNbr").val(responseText.reCommoditySeqNbr);
	$("#tariffServiceItemCode").val(responseText.tariffServiceItemCode);
	$("#commodityCode").val(responseText.commodityCode);
	$("#commodityDescription").val(responseText.commodityDescription);
	$("#isRequireCertificate").val(responseText.isRequireCertificate);
	$("#isMultiTariffItemEquipment").val(responseText.isMultiTariffItemEquipment);
	$("#isMultiCommodityEquipment").val(responseText.isMultiCommodityEquipment);
	$("#userNoteCode").val(responseText.userNoteCode);
	$("#isSpecialWfgCode").val(responseText.isSpecialWfgCode);
	$("#tradeCode").val(responseText.tradeCode);
	$("#isLastLineCmdtyEquipment").val(responseText.isLastLineCmdtyEquipment);
	$("#lastLineCmdtyEquipmentNbr").val(responseText.lastLineCmdtyEquipmentNbr);
	$("#commoditySeqNbr").val(responseText.commoditySeqNbr);
	
}

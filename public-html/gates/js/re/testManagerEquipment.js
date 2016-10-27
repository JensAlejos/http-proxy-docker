$(function() {
	
	$("#rateEngineEquipmentPieceForm").validationEngine('attach');
    
    $( "#maintainEquipmentDialog" ).dialog({ autoOpen: false , width: 1000 , modal: true
        , buttons: {
            Save: function(){
                },
            Cancel: function(){
                $( this ).dialog( "close" );
            }
            }
        });
    

	//Equipments Grid
	var colNamesForEquipments = ['reEquipmentPieceId', 'Equipment Piece Seq Nbr', 'Pleq Length','Pleq Height', 'Pleq Function Code', 'Vehicle',  'Track Cleated Veh', 'Self Propelled', 'Rout Code Pickup', 'Route Code Delivery', 'Actions'];
	
	var colModelForEquipments = [
		    			   		{name:'reEquipmentPieceId',index:'reEquipmentPieceId', width:50, editable:false,hidden:true},
		    			   		{name:'reEquipmentPieceSeqNbr',index:'reEquipmentPieceSeqNbr', width:100, editable:true, editrules:{required:true}, formatter:'equipmentViewFormatter'},
		    			   		{name:'equipmentLength',index:'equipmentLength', width:50, editable:true, editrules:{required:true}},
		    			   		{name:'equipmentHeight', index: 'equipmentHeight', width:50, editable: true, editrules: { required: true }},
		    			   		{name:'equipmentFunctionCode',index:'equipmentFunctionCode', width:200, editable:true, editrules:{required:true}},
		    			   		{name:'vehicleTypeCode',index:'vehicleTypeCode', width:80, editable:true, editrules:{required:true}},
		    			   		{name:'isTrackCleatVehicle',index:'isTrackCleatVehicle', width:50, formatter:'checkbox',editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }},
		    			   		{name:'isSelfPropel',index:'isSelfPropel', width:50, formatter:'checkbox', editable:true,  edittype:'checkbox', editoptions: { value:"true:false" }},
		    			   		{name:'pickupRouteCode',index:'pickupRouteCode', width:50, editable:true, editrules:{required:true}},
		    			   		{name:'deliveryRouteCode',index:'deliveryRouteCode', width:100, editable:true, editrules:{required:true}},
	    			   			{name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
		    			   	];
	
	jQuery.extend($.fn.fmatter , {
		equipmentViewFormatter : function(cellvalue, options, rowdata) {
			return "<a href='javascript:showViewEquipmentDialog("+cellvalue+");' ><u>"+cellvalue+"</u></a>";
		}
	});
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "reEquipmentPieceSeqNbr"
		};
	
	createGrid(
			"gridIdForEquipments", "pagerIdForEquipments", 
			'../rateengine/loadRateEngineEquipmentPieceGrid', 
			'', '../rateengine/updateEquipmentPiece', 
			'../rateengine/deleteEquipmentPiece', 
			'',
			colNamesForEquipments, colModelForEquipments, "Equipments",  //Caption
			70, 3, [3,6,9],
			true, false, true, true, jsonReader, false, false, false, false, true, false,
			"showEditEquipmentDialog", false, false, false, true);
	
});

function showViewEquipmentDialog(id){
	$("#rateEngineEquipmentPieceForm").clearForm();
	clearHiddenEquipmentFields();
	$.ajax({
		url: "../rateengine/loadEquipmentPieceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainEquipmentDialog" ).dialog( "option", "title", 'View RE Equipment' );
			$( "#maintainEquipmentDialog" ).dialog( "option", "buttons", [
			   			                                               {
			   			                                                   text: "Cancel",
			   			                                                   click: function() { $(this).dialog("close"); }
			   			                                               }
			   			                                               ] );
			$("#maintainEquipmentDialog").dialog('open');
			$("#rateEngineEquipmentPieceForm").loadJSON(responseText);
			populateListBox(responseText);
		}
	});
}

function showAddEquipmentDialog(){
	$("#rateEngineEquipmentPieceForm").clearForm();
	clearHiddenEquipmentFields();
	$.ajax({
		url: "../rateengine/showRateEngineEquipmentPieceForm",
		type: "POST",
		success: function(responseText){
		
			$( "#maintainEquipmentDialog" ).dialog( "option", "title", 'Add RE Equipment' );
			$( "#maintainEquipmentDialog" ).dialog( "option", "buttons", [
			   			                                               {text: "Save", click: function() { addEquipment(); }},
			   			                                               {text: "Cancel", click: function() { 
			   			                                            	   $("#rateEngineEquipmentPieceForm").validationEngine('hideAll');
			   			                                            	   $(this).dialog("close"); }}
			   			                                               ] );
			$("#equipmentRatingSet").val($("#reHeaderId").val());
			$( "#maintainEquipmentDialog" ).dialog('open');
			$("#rateEngineEquipmentPieceForm").loadJSON(responseText);
			populateListBox(responseText);
		}
	});
	
}

function addEquipment(){
	if($("#rateEngineEquipmentPieceForm").validationEngine('validate'))
		{
			submitAllSelect();
			var queryString = $('#rateEngineEquipmentPieceForm').formSerialize();
			
			$.ajax({
					url: "../rateengine/addEquipmentPiece",
					type: "POST",
					data: queryString,
					success: function(){
						jQuery("#gridIdForEquipments").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						$("#maintainEquipmentDialog").dialog('close');
					}
				});
		}
	else
		return false;
}

function showEditEquipmentDialog(id){
	$("#rateEngineEquipmentPieceForm").clearForm();
	clearHiddenEquipmentFields();
	$.ajax({
		url: "../rateengine/loadEquipmentPieceGridRowForEdit",
		type: "POST",
		data: {id : id},
		success: function(responseText){
			$( "#maintainEquipmentDialog" ).dialog( "option", "title", 'Edit RE Equipment' );
			$( "#maintainEquipmentDialog" ).dialog( "option", "buttons", [
			                                               {
			                                                   text: "Save",
			                                                   click: function() { updateEquipment(); }
			                                               },
			                                               {
			                                                   text: "Cancel",
			                                                   click: function() {
			                                                	    $("#rateEngineEquipmentPieceForm").validationEngine('hideAll');
			                                                	   	$(this).dialog("close"); }
			                                               }
			                                               ] );
			$("#maintainEquipmentDialog").dialog('open');
			$("#rateEngineEquipmentPieceForm").loadJSON(responseText);
			populateListBox(responseText);
		}
	});
}

function updateEquipment(){
	if($("#rateEngineEquipmentPieceForm").validationEngine('validate'))
	{
		submitAllSelect();
		var queryString = $('#rateEngineEquipmentPieceForm').formSerialize();
		
		$.ajax({
				url: "../rateengine/updateEquipmentPiece",
				type: "POST",
				data: queryString,
				success: function(responseText){
					jQuery("#gridIdForEquipments").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#maintainEquipmentDialog").dialog('close');
				}
			});
	}
	else
		return false;
}

function clearHiddenEquipmentFields()
{
	$('#equipmentGridId').val('');
	$('#reEquipmentPieceId').val('');
	$('#pickupDrayageZoneCode').val('');
	$('#deliveryDrayageZoneCode').val('');
	$('#othEqpFrtChrgAmtCrrncyCd').val('');
	$('#othEqpChrgAmtCurrencyCode').val('');
	$('#multiCommodityCntrWeight').val('');
	$('#multiCmdtyCntrWgtUomCode').val('');
	$('#weightUomCode').val('');
	$('#cubeUomCode').val('');
}

//List Box Scripts

var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};

/*//configuration for multi select boxes
$.configureBoxes({		
	useFilters : false,
	useCounters : false
});*/


function AddType() 
{
    $('#box1View option:selected').remove().appendTo('#box2View');
    var optionArray = $('#box2View option');
    if(optionArray!=null && optionArray.length>0)
	{
    	var optionValuesArray = new Array();
    	var optiontextArray = new Array();
    	for(var i=0; i<optionArray.length; i++)
    	{
    		optionValuesArray[i]= optionArray[i].value;
    		 optiontextArray[i]= optionArray[i].text;

    	}
    	optionValuesArray.sort();
    	$('#box2View').empty();
		var options = '';
		for(var i = 0; i < optionValuesArray.length; i++)
		{
			options += "<option value='" + optionValuesArray[i] + "' >" + optiontextArray[i] + "</option>";
		}
		$('#box2View').html(options);
	}
}
function RemoveType() 
{
    $('#box2View option:selected').remove().appendTo('#box1View');
    var optionArray = $('#box1View option');
    if(optionArray!=null && optionArray.length>0)
	{
    	var optionValuesArray = new Array();
    	var optiontextArray = new Array();
    	for(var i=0; i<optionArray.length; i++)
    	{
    		optionValuesArray[i]= optionArray[i].value;
    		optiontextArray[i] = optionArray[i].text;
    	}
    	optionValuesArray.sort();
    	$('#box1View').empty();
		var options = '';
		for(var i = 0; i < optionValuesArray.length; i++)
		{
			options += "<option value='" + optionValuesArray[i] + "' >" + optiontextArray[i] + "</option>";
		}
		$('#box1View').html(options);
	}
}

//methods for selecting all values from multi select menu
function submitAllSelect() {
	selectAll(getControl('box2View'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}// closing Select All Function

function populateListBox(responseText)
{
	$('#box1View').empty();
	if (responseText.equipmentFeatureList && responseText.equipmentFeatureList.length > 0) {
		var equipmentFeatureArray = responseText.equipmentFeatureList;
		var options = '';
		for(var i = 0; i < responseText.equipmentFeatureList.length; i++)
		{
			options += "<option value='" + equipmentFeatureArray[i].code + "' >" + equipmentFeatureArray[i].code+":" +equipmentFeatureArray[i].description + "</option>";
		}
		$('#box1View').html(options);
	}
	
	$('#box2View').empty();
	if (responseText.rateEngineEquipmentFeatures && responseText.rateEngineEquipmentFeatures.length > 0) {
	
			
		var options = '';
		var desc='';
		
		for(var i = 0; i < responseText.rateEngineEquipmentFeatures.length; i++)
			{
					for(var j = 0; j < responseText.equipmentFeatureList.length; j++)
						{
						
							if(responseText.rateEngineEquipmentFeatures[i].equipmentFeatureCode == responseText.equipmentFeatureList[j].code)
							{
								 desc=responseText.equipmentFeatureList[j].description;
								 options += "<option value='" + responseText.equipmentFeatureList[j].code + "' >"+ responseText.equipmentFeatureList[j].code +":" +desc+ "</option>";
							}
						}
					
				$('#box2View').html(options);
			}
	}
}

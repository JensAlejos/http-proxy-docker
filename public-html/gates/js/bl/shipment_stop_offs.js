var stopNumber="";
var hazStp="";
var hazStpLinked="";
var isStopChanged='';
$(document).ready(
function() {
	if($('#tradeCode').val()=='A'){
		createShipmentItemStopOffsGrid();
		createShipmentStopOffHazardGrid();
		createShipmentStpOffGrid();
	}
	
	$('#shipmentStopOffForm :input').change(function()
	{
		if(this.type!='checkbox')
			console.log('change');
			isStopChanged = "Y";
	});


	$("#shipmentStopOffDialog").dialog({
		autoOpen : false,
		width : 930,
		modal : true,
		close : function() {
			removePartiesPopUps();
			clearShipmentStopOffForm();
			$("#shipmentStopOffForm").validationEngine('detach');
			tabSequence('#shipmentForm',true,false);
		},
		open: function()
		{
			tabSequence('#shipmentStopOffDialog',false,false);
		}
	});
	
	$('#stopOffAdd').click(function() {
		if (!(($("#statusCode").text()=='ISSUED')|| ($("#statusCode").text()=='CORRECTED' || isPartyAdd==false)))  {
			clearPartiesForm(); //for defect --D018588
			if(shipmentNotFound!=true)
			showAddStopOffsDialog();
			return false;
		}
	});
	//D026112
	$('#del_stopOffsGrid').click(function(){ 

	    var checkDelFlag= false;
		var rowIDs = jQuery("#stopOffsGrid").getDataIDs();
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		var rowData=jQuery("#stopOffsGrid").getRowData(rowIDs[i]);
	    // You'll get a pop-up confirmation dialog, and if you say yes,
		}
	   		
		
	});
	
	$('#shipmentStopOffFormClear').click(function() {
		clearShipmentStopOffForm();
	});
	
	

});
//--------Supporting Functions-----------------
function float3DecimalFormat(cellvalue, options, rowObject){
	if(cellvalue != null && $.trim(cellvalue) != '' && $('#unitOfMeasureSourceCode').val() === "M"){
		return parseFloat(cellvalue).toFixed(3);
	}
	return $.trim(cellvalue);
}
var itemStopOffsGridComplete =function()
{
console.log("GridComplete");
$('table[aria-labelledby="gbox_itemstopOffsGrid"] thead tr[id="tr_itemStopOffSeqNumber"]').hide();
$('table[aria-labelledby="gbox_itemstopOffsGrid"] thead tr[id="FormError"] td').html("");
$('table[aria-labelledby="gbox_itemstopOffsGrid"] thead tr[id="FormError"]').hide();
//editAllItemStops();
};
var itemStopOffsGridLoadComplete =function()
{
console.log("GridComplete");
$('table[aria-labelledby="gbox_itemstopOffsGrid"] thead tr[id="ui-state-default"]').hide();
//editAllItemStops();
};
var stpoffHazardGridComplete = function() {
		console.log("stpoffHazardGridComplete");
		
		
	}
	
var stpoffHazardLoadComplete = function() {
		console.log("stpoffHazardLoadComplete");
		var rowIDs = jQuery("#StpOffHazardGrid").getDataIDs();	
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		var rowData=jQuery("#StpOffHazardGrid").getRowData(rowIDs[i]);
		
		for (var j=0;j<hazStp.length;j=j+1) {
		if(rowData.shipmentHazardId==hazStp[j])
			{
			 $("#jqg_StpOffHazardGrid_"+rowData.shipmentHazardId, "#StpOffHazardGrid").attr("disabled",false);
			 $("#jqg_StpOffHazardGrid_"+rowData.shipmentHazardId, "#StpOffHazardGrid").attr("checked",true);
			}
			}
		for (var j=0;j<hazStpLinked.length;j=j+1) {
		if(rowData.shipmentHazardId==hazStpLinked[j])
		{		
		$("#jqg_StpOffHazardGrid_"+rowData.shipmentHazardId, "#StpOffHazardGrid").attr("disabled",true);
		}
		}
		}
	
	}
function editAllItemStops()
{

	var rowIDs = jQuery("#itemstopOffsGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
		var rowId = $('#itemstopOffsGrid').getCell(rowIDs[i], 'itemStopOffSeqNumber');
		   $('#itemstopOffsGrid').jqGrid('editRow', rowId,false);
    }

}
function getCheckHazardGridRows()
{
		var selRowIds=[];
		var hazard='';
		$("#hazardLinkStp").val();
		var rowIDs = jQuery("#StpOffHazardGrid").getDataIDs();	
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
		var rowData=jQuery("#StpOffHazardGrid").getRowData(rowIDs[i]);
		var id=$("#jqg_StpOffHazardGrid_"+rowData.shipmentHazardId);
		if(id.is(':checked')) {
		selRowIds.push(rowData.shipmentHazardId);
		
		}
		}
		hazard=selRowIds.join(",");
		$("#hazard").val(hazard);
		
}

function saveAllItemStopOffs(){
	updateItemStopErrorOccurred = false;
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
	var rowIDs = jQuery("#itemstopOffsGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowId = $('#itemstopOffsGrid').getCell(rowIDs[i], 'itemStopOffSeqNumber');
	   currentRowId = rowId+'_';
	   var isSuccess = $('#itemstopOffsGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/shipment/stopoff/updateItemStopOff' //Url
	   );
	   
	   if(!isSuccess){
		   updateItemStopErrorOccurred = true;
		   //Store error record
		   currentRowId = '';
		  errorRowId = rowId;
		
		   break;
		}
	   else
		   $('#itemstopOffsGrid').jqGrid('editRow', rowId, false);
    }
	if(!updateItemStopErrorOccurred){
		equipmentUpdated = false;
	}
}
var stopOffsGridLoadComplete = function()
{
	setAccordianTabDetails('stopOffsHeader',"");
	$('#stopHeaderCheckBox').attr('checked', false);
	var specialCount = 0;
	$.ajax({
				url : _context +"/shipment/stopoff/getAddressCount",
				type : "GET",
				async:false,
				success : function(responseText) {
					if (responseText.success == true) {						
						specialCount=responseText.data;
					}
					}
					});
	var stopSize = jQuery("#stopOffsGrid").getGridParam("records");
	
	if(specialCount!='0' && stopSize==specialCount)
	{
	stopSize='<font color="black">'+stopSize+'</font>';
	specialCount='<font color="black">'+specialCount+'</font>';
	$('#stopHeaderCheckBox').attr('checked', true);
	}
	else
	{
	if(specialCount!='0'){
	stopSize='<font color="red">'+stopSize+'</font>';
	specialCount='<font color="red">'+specialCount+'</font>';
	}
	}
	if(specialCount!='0'){	
	setAccordianTabDetails('stopOffsHeader', stopSize+"/"+specialCount);
	}
};

var toOrderPartyPopulated = false;

// clears the stops form
function clearShipmentStopOffForm() {
	$("#shipmentStopOffForm").clearForm();
	$('input[name="shipmentStopOffSeqNo"]').val('');
	$('input[name="portCode"]').val('');
	$('input[name="tariffItem"]').val('');
	$('input[name="description"]').val('');
	$('input[name="weight"]').val('');
	$('select[name="quantity"]').val('');
	$('select[name="portCode"]').children().remove();
	$('select[name="portCode"]').append(
			"<option value=''></option>");
			$('select[name="partyListAddressRole"]').children().remove();
	$('select[name="partyListAddressRole"]').append(
			"<option value=''></option>");
			$('input[name="addressRoleId"]').val('');
}

function editStopOff(id) {
	var seqNo = id.split('=')[1];
	{
		var dataUrl = _context +"/shipment/stopoff/getItemStop?seqNo="+seqNo;
		$.ajax({
    		url: dataUrl,
    		success: function(responseText){
    			if(responseText.success){
				clearShipmentStopOffForm()
    				$.each(responseText.data.partyTypeList, function(key, value) {
    					$('select[name="partyListAddressRole"]').append($("<option/>", {
    						value : key,
    						text : value
    					}));
    				});
					
    				$.each(responseText.data.portCodeList, function(key, value) {
    					$('select[name="portCode"]').append($("<option/>", {
    						value : key,
    						text : value
    					}));
    				});
   				    if(shipmentNotFound!=true)
						hazStp=responseText.data.hazardLinkStp;
						hazStpLinked=responseText.data.hazardLinkAllStp;
						responseText.data.hazardLinkStp=null;
						responseText.data.hazardLinkAllStp=null;
   				    	$("#shipmentStopOffForm").loadJSON(responseText.data);
						stopNumber=responseText.data.positionInContainer;
						//hazStp=responseText.data.hazardLinkStp;
						//hazStpLinked=responseText.data.hazardLinkAllStp;
                $('#itemstopOffsGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/loadItemStopOff' ,datatype:"json"}).trigger('reloadGrid');
				$('#StpOffHazardGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/loadHazard' ,datatype:"json"}).trigger('reloadGrid');
				$('#stpOffGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/load' ,datatype:"json"}).trigger('reloadGrid');
				//editAllItemStops();
				$(".HeaderButton", ("#gview_itemstopOffsGrid")).click();
				$(".HeaderButton", ("#gview_StpOffHazardGrid")).click();
				$(".HeaderButton", ("#gview_stpOffGrid")).click();
   				 $("#shipmentStopOffDialog").dialog("option", "title", 'Edit StopOff');
 				$("#shipmentStopOffDialog").dialog("option", "buttons", [ {
 					text : "Cancel",
 					click : function() {
 						if(isStopChanged!="")
 						{
 							var r = confirm("All unsaved changes will be discarded.Continue?");
 							if(r){
 								restorePreShptSummary();
								isStopChanged='';
 								$('#shipmentStopOffMsgDiv').hide();
 								$(this).dialog("close");
 							}else
 								return;
 						}
 						else{
 							$('#shipmentStopOffMsgDiv').hide();
 							$(this).dialog("close");
 						}
 					}
 				}, {
 					text : "Save",
 					click : function() {
 						if($("#statusCode").text()!='ISSUED' && $("#statusCode").text()!='CORRECTED' && (isPartyUpdate)){
 							//saveAllItemStopOffs();
							getCheckHazardGridRows();
							updateStopOff();
 						}else{
 							$("#shipmentStopOffDialog").dialog('close');
 						}
 						
 					}
 				} ]);
 				
 				$('#shipmentStopOffForm').validationEngine('attach');
 				
 				if(($("#statusCode").text()=='CANC') ){
 					$("#shipmentStopOffDialog").gatesDisable();
 					$("#shipmentStopOffDialog").dialog('open');
 				}
 				else if(($("#statusCode").text()=='ISSUED') || ($("#statusCode").text()=='CORRECTED') || isPartyUpdate==false){
 					$("#shipmentStopOffDialog").gatesDisable();
 					$("#shipmentStopOffDialog").dialog('open');
 				}
 				else
 					{
 						$("#shipmentStopOffDialog").gatesEnable();
 						$("#shipmentStopOffDialog").dialog('open');
 					}
 			
 			}
 		}
 	});
	
			return false;
	}
}

function showAddStopOffsDialog() {
	
	if(($("#statusCode").text()=='CANC') || ($("#statusCode").text()=='ISSUED') || ($("#statusCode").text()=='CORRECTED')|| isPartyAdd==false){
		$("#shipmentStopOffDialog").gatesDisable();
	}else{
		$("#shipmentStopOffDialog").gatesEnable();
	$.ajax({
		url : _context +"/shipment/stopoff/showFormAdd",
		success : function(responseText) {
			console.log("inside showAddStopOffsDialog");
			clearShipmentStopOffForm();
			$.each(responseText.data.partyTypeList, function(key, value) {
				$('select[name="partyListAddressRole"]').append($("<option/>", {
					value : key,
					text : value
				}));
			});
			
			$.each(responseText.data.portCodeList, function(key, value) {
				$('select[name="portCode"]').append($("<option/>", {
					value : key,
					text : value
				}));
			});
			hazStp=responseText.data.hazardLinkStp;
			hazStpLinked=responseText.data.hazardLinkAllStp;
			responseText.data.hazardLinkStp=null;
			responseText.data.hazardLinkAllStp=null;
			$("#shipmentStopOffForm").loadJSON(responseText.data);
			$("#shipmentStopOffId").val(null);
			stopNumber=responseText.data.positionInContainer;
//			hazStp=responseText.data.hazardLinkStp;
//			hazStpLinked=responseText.data.hazardLinkAllStp;
			$('#itemstopOffsGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/loadItemStops' ,datatype:"json"}).trigger('reloadGrid');
			$('#StpOffHazardGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/loadHazard' ,datatype:"json"}).trigger('reloadGrid');
				  $('#stpOffGrid').jqGrid('setGridParam', { url: _context+'/shipment/stopoff/load' ,datatype:"json"}).trigger('reloadGrid');
			//editAllItemStops();
			$(".HeaderButton", ("#gview_itemstopOffsGrid")).click();
			$(".HeaderButton", ("#gview_StpOffHazardGrid")).click();
			$(".HeaderButton", ("#gview_stpOffGrid")).click();
			$("#shipmentStopOffDialog").dialog("option", "title", 'Add StopOff');
			$("#shipmentStopOffDialog").dialog("option", "buttons", [ {
				text : "Cancel",
				click : function() {
					if(isStopChanged!="")
					{
						var r = confirm("All unsaved changes will be discarded.Continue?");
						if(r){
							isStopChanged='';
							$('#shipmentStopOffMsgDiv').hide();
							$(this).dialog("close");
						}else
							return;
					}
					else{
					
						$('#shipmentStopOffMsgDiv').hide();
						$(this).dialog("close");
					}
				}
			}, {
				text : "Add",
				click : function() {
					if($("#statusCode").text()!='ISSD' && $("#statusCode").text()!='CORR' && (isPartyAdd)){
						getCheckHazardGridRows();
						addStopOff();
						//saveAllItemStopOffs();
						//setPartiesHeader();
					}else{
						$("#shipmentStopOffDialog").dialog('close');
					}
					
				}
			},
{				text : "Add New",
				click : function() {
					if($("#statusCode").text()!='ISSD' && $("#statusCode").text()!='CORR' && (isPartyAdd)){
						getCheckHazardGridRows();
						blockUI();
						console.log("before addStopOff");
						//addStopOff();
						var validateFields= $("#shipmentStopOffForm").validationEngine('validate') ; 
		
						if(validateFields){ 
						var queryString = $('#shipmentStopOffForm').formSerialize();
						$.ajax({
							url : _context +"/shipment/stopoff/addStopOff",
							type : "POST",
							asyn:false,
							data : queryString,
							success : function(responseText) {
							if (responseText.success == true) {
							console.log("inside addStopOff");
							$("#stopOffsGrid").trigger("reloadGrid");
							isStopChanged='';
							$("#shipmentStopOffDialog").dialog('close');
							console.log("before showAddStopOffsDialog");
							showAddStopOffsDialog();
							console.log("after showAddStopOffsDialog");
						} else 
							{
							showResponseMessages("shipmentStopOffMsgDiv", responseText);
							$('#shipmentStopOffMsgDiv').show();
							}
						}
					});
					}
						console.log("after addStopOff");
						$.unblockUI();
						//saveAllItemStopOffs();
						//setPartiesHeader();
					}else{
						$("#shipmentStopOffDialog").dialog('close');
					}
					
				}
			}			]);
			
			$('#shipmentStopOffForm').validationEngine('attach');
			console.log("open shipmentStopOffDialog ");
			$("#shipmentStopOffDialog").dialog('open');
			
		}
	});
	}
}

function addStopOff() {
		var validateFields= $("#shipmentStopOffForm").validationEngine('validate') ; 
		
		if(validateFields){ 
		var queryString = $('#shipmentStopOffForm').formSerialize();
		$.ajax({
			url : _context +"/shipment/stopoff/addStopOff",
			type : "POST",
			asyn:false,
			data : queryString,
			success : function(responseText) {
				if (responseText.success == true) {
					console.log("inside addStopOff");
					$("#stopOffsGrid").trigger("reloadGrid");
					isStopChanged='';
					$("#shipmentStopOffDialog").dialog('close');
					
				} else 
					{
					showResponseMessages("shipmentStopOffMsgDiv", responseText);
					$('#shipmentStopOffMsgDiv').show();
					}
			}
		});
	} else
		return;
}

function updateStopOff() {
	
	var validateFields= $("#shipmentStopOffForm").validationEngine('validate') ;

	
	if(validateFields){ // Changes done for Defect D017161
		
		var queryString = $('#shipmentStopOffForm').formSerialize();
		
		stopOffUpdate(queryString);
			
			
		}
		
	else
		return false;
}

function stopOffUpdate(queryString)
{
	$.ajax({
		url : _context +"/shipment/stopoff/stopOffUpdate",
		type : "POST",
		data : queryString,
		success : function(responseText) {
			if (responseText.success == true) {
				$("#stopOffsGrid").trigger("reloadGrid");
				$("#shipmentStopOffDialog").dialog('close');
				showResponseMessages("msgDiv", responseText);
				$('#shipmentStopOffMsgDiv').hide();
				isStopChanged='';
			}
			else 
				{
				showResponseMessages("shipmentStopOffMsgDiv", responseText);
				$('#shipmentStopOffMsgDiv').show();
				}
		}
	});
}

function restorePreShptSummary()
{
	var queryString = $('#shipmentStopOffForm').formSerialize();
	$.ajax({
		url : _context +"/shipment/stopoff/stopOffPrevUpdate",
		type : "POST",
		data : queryString,
		success : function(responseText) {
			if (responseText.success == true) {
				$("#stopOffsGrid").trigger("reloadGrid");
				$("#shipmentStopOffDialog").dialog('close');
				showResponseMessages("msgDiv", responseText);
				$('#shipmentStopOffMsgDiv').hide();
				isStopChanged='';
			}
			else 
				{
				showResponseMessages("shipmentStopOffMsgDiv", responseText);
				$('#shipmentStopOffMsgDiv').show();
				}
		}
	});
}


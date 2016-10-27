$(document).ready(
		function () {
			var hideAdd = false;
			if(!isSpotPullUpdatable)
				{
				hideAdd = true;
				}
			var colNames=['id', 'Status', 'Status Date','Update Date', 'User', 'Com Method', 'Recipient', 'Special Instructions', ''];
			var colModel=[
			              {name:'id',index:'id', editable:false,hidden:true, formatter:'number', 
			               cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			               {name:'spotRequirementStatusCode',index:'spotRequirementStatusCode', width:110,edittype:'select', editoptions: {value: statusDropdownForDispatchGrid},editrules:{required:true},editable:true,formatter:'select'},  					 
			               {name:'statusDate',index:'statusDate', width:150, editable:true, editoptions: {size:30, defaultValue:$('#currentTime').val()}},			              
				          {name:'updateDate',index:'updateDate', width:100, editable:true, editoptions: {readonly:true,size:20, defaultValue:$('#currentDate').val()}},			              
			              {name:'user',index:'user', width:110, editable:true, editrules:{required:true}, editoptions:{readonly:true,defaultValue:$('#updatedBy').val()}},
			              {name:'communicationMethod',index:'communicationMethod', width:90,edittype:'select', editoptions: {value: commMethodDropdownForDispatchGrid}, editable:true,formatter:'select'},
					      {name:'receipient',index:'receipient', width:90, editable:true, editoptions:{size:50}},
			              {name:'isInternalCommentSent',index:'isInternalCommentSent', width:100, editable:true, editoptions:{readonly:true, size:20}},			       
			              {name:'actions', index:'actions', width:60, align:"center", editable:true, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
			              ];
						createGrid(
								'dispatchStatusGridTable', // grid id for Standing Instruction
								'dispatchStatusGridDiv', // page id for Standing Instruction
								'../spotpull/loadDispatchStatusGrid', 
								'../spotpull/addDispatchStatus', 
								'../spotpull/addDispatchStatus',
								'../spotpull/deleteDispatchStatus', 
								'',
								colNames, 
								colModel, 
								'Status',
								210
								,10 ,[10,20,30] ,
								false, /* multiselect */
								false, /* multidelete */
								true,
								hideAdd,
								null,  //jsonReader 
								true,  //hideEdit 
								false, /*hideDelete */
								true, 
								true, 
								false, 
								false, 
								null, 
								customGridCompleteForSPQueue,
								statusQueueGridLoadComplete,
								false, //default hidden
								false, //row color based on status
								false, //cell edit
								refGridAfterSubmit // delete after submit
								);					

	}
);


function setFormattedDate(){
	var todaysDate = new Date();
	
	var day = todaysDate.getDate();
	if(eval(day<10)){
		day = '0'+day;
	}
	var month = eval(eval(todaysDate.getMonth())+eval(1));
	if(eval(month<10)){
		month = '0'+month;
	}
	var year = todaysDate.getFullYear();
	return month + "-"+day+"-"+year;
	//return month+"-"+day+"-"+year;
}

var statusQueueGridLoadComplete = function() {
	
	if(!isSpotPullUpdatable)
		{
			$("div.ui-pg-div.ui-inline-del").hide();
			$("div.ui-pg-div.ui-inline-edit").hide();
			$('#sData').hide();
			$('#gview_dispatchStatusGridTable input').attr("disabled", true);
			$('#gview_dispatchStatusGridTable select').attr("disabled", true);
			
		}
	
	$('#gbox_dispatchStatusGridTable #sData').click(function(){
		if($("#gbox_dispatchStatusGridTable #statusDate")
				.attr("readonly") == 'readonly')
			return false;
		else
		{
			isSpotPullChanged = "Y";
			return true;
		}
	});
};
function customGridCompleteForSPQueue (){
	
	var currentTime=$("#currentTime").val();
	$("#statusDate").val(currentTime);

	var dispatchType = $("#spotRequirementTypeCode").val();
	if(!Boolean(dispatchType))
		return;

	var ids = jQuery("#dispatchStatusGridTable").jqGrid('getDataIDs');
	var latestStatus=$("#statusCode").val();
//	var id;
//	for(var i=1;i < ids.length;i++){ 
//		latestStatus = $('#dispatchStatusGridTable').getCell(ids[i], 'spotRequirementStatusCode');
//		break;
////		if (value == '01'){
////			hasPrimaryPhone = true;
////			break;
////		}        
//	}

	
	$("select[id$='spotRequirementStatusCode']", "#gbox_dispatchStatusGridTable").live(
			'mouseover',
			function() { 
				
				var hasPrimaryPhone = false;
				
				if(!Boolean(latestStatus))
					return;
				
/* OPEN */		$("#spotRequirementStatusCode option:nth-child(2)", "#gbox_dispatchStatusGridTable").hide();
/* INGATED */	$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").hide();
/* COMPLETE*/	$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").hide();
/* CANACK */	$("#spotRequirementStatusCode option:nth-child(5)", "#gbox_dispatchStatusGridTable").hide();
/* CANCEL */	$("#spotRequirementStatusCode option:nth-child(6)", "#gbox_dispatchStatusGridTable").hide();
/* SENT */		$("#spotRequirementStatusCode option:nth-child(7)", "#gbox_dispatchStatusGridTable").hide();
/* ASSGND */	$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").hide();
/* CANSENT */	$("#spotRequirementStatusCode option:nth-child(9)", "#gbox_dispatchStatusGridTable").hide();
/* ACKNOWLD */	$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").hide();
/* DISPATCH */	$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").hide();
/* DECLINED */	$("#spotRequirementStatusCode option:nth-child(12)", "#gbox_dispatchStatusGridTable").hide();
/* TEMPLATE */	$("#spotRequirementStatusCode option:nth-child(13)", "#gbox_dispatchStatusGridTable").hide();
/* PENDING */	$("#spotRequirementStatusCode option:nth-child(14)", "#gbox_dispatchStatusGridTable").hide();

				if('COMPLETE'==latestStatus || 'INGATED'==latestStatus)
				{					
				}
				
				if (dispatchType == 'S' || dispatchType == 'D' || dispatchType == 'U') 
				{
					if('SENT'==latestStatus || 'OPEN'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();
					}
					if('ACKNOWLD'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();						
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();						
					}
					if('ASSIGNED'==latestStatus || 'DISPATCH'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}
					if('CANCEL'==latestStatus || 'CANSENT'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(5)", "#gbox_dispatchStatusGridTable").show();
					}
					if('DECLINED'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}
				}
				
				if (dispatchType == 'P' || dispatchType == 'E') 
				{
					if('OPEN'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").show();						
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();
					}
					if('SENT'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").show();						
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();						
					}
					if('ACKNOWLD'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();						
					}
					if('ASSIGNED'==latestStatus || 'DISPATCH'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
						//$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}
					if('CANCEL'==latestStatus || 'CANSENT'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(5)", "#gbox_dispatchStatusGridTable").show();
					}
					if('DECLINED'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}
				}
				if (dispatchType == 'L' ) 
				{
					if('OPEN'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();						
					}
					if('SENT'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(10)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
					}
					if('ACKNOWLD'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(8)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(11)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
					}
					if('ASSIGNED'==latestStatus || 'DISPATCH'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(3)", "#gbox_dispatchStatusGridTable").show();
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}
					if('CANCEL'==latestStatus || 'CANSENT'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(5)", "#gbox_dispatchStatusGridTable").show();
					}
					if('DECLINED'==latestStatus)
					{
						$("#spotRequirementStatusCode option:nth-child(4)", "#gbox_dispatchStatusGridTable").show();
					}

				}
//				hasPrimaryPhone=true;2
//				if (hasPrimaryPhone){
//					$("#spotRequirementStatusCode option:nth-child(2)", "#gbox_dispatchStatusGridTable").hide();
////    				for(var i = 0 ;i < ids.length;i++){
////    					id = $('#dispatchStatusGridTable').getCell(ids[i], 'id');
////    					$("#"+id+"_typeCode option:nth-child(2)", "#gbox_dispatchStatusGridTable").hide();
////    				}
//				}else{
//					$("#spotRequirementStatusCode option:nth-child(2)", "#gbox_dispatchStatusGridTable").show();
//    				for(var i = 0 ;i < ids.length;i++){
//    					id = $('#dispatchStatusGridTable').getCell(ids[i], 'id');
//    					$("#"+id+"_spotRequirementStatusCode option:nth-child(2)", "#gbox_dispatchStatusGridTable").show();
//    				}
//				}
			}
		);
}
var refGridAfterSubmit = function(result)
{
	if(result.success){
		isSpotPullChanged = "Y";
	}
};


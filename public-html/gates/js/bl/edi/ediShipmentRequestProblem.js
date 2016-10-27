$(document).ready(function () {
	var problemLogCol = [ 'Type','Discrepancy','BKG Value','EDI Value','Problem','Created By','Resolved By'];
	
	var problemLogMod = [
	                         //{name:'sequenceNumber',index:'sequenceNumber', width:55,editable:false,hidden:true},
	                         {name:'ediProblemTypeCode',index:'ediProblemTypeCode', width:80}, 
	                         {name:'dataElement',index:'dataElement', width:300,},
	                         {name:'bookingDataElementValue',index:'bookingDataElementValue', width:150,editable:false}, 
	                         {name:'ediDataElementValue',index:'ediDataElementValue', width:150}, 
	                         {name:'description',index:'description', width:600,editable:false}, 
	                         {name:'createUser',index:'createUser', width:400,editable:false}, 
	                         {name:'resolveUserCombine',index:'resolveUserCombine', width:400,editable:false /*, formatter:'enableDisableMainFormatter'*/},
	                        ];
	/*
	jQuery.extend($.fn.fmatter,
			{
				enableDisableMainFormatter : function(cellvalue, options, rowdata) {
					if(cellvalue!=null)
					{ 
						if($('#isShowLink').val()=='Y')
							return "<a href='javascript:changePartyStatusFunction("
								+ rowdata.partySeqNo + ", 0);' style='color:black; font-weight:bold;' >"+cellvalue+"</a>";
						else
							return "<div style='color:grey; text-decoration:underline; font-weight:normal;' >"+cellvalue+"</div>";
					}
					else
						return "";
				}
			});*/
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell"
		};

	createGrid(
			"problmLogForEdi", // grid id for user
			"problemLogPager", // page id for user
			_context+'/ediShipment/load', 
			"", 
			"", 
			"", 
			"",
			problemLogCol, 
			problemLogMod, 
			"Problem Log For EDI",
			115,
			5,
			[5,10,15],
			false,false,false, true,
			jsonReaderSpSvc,false,true,true,false,
			true,false,null,customGridComplete,false,false,true);
});

/* D032440 */
function isRedDiscrepancy(discrepancy) {
	if(discrepancy == 'Origin Port' || discrepancy == 'Destination Port' ||
	   discrepancy == 'B/L Origin' || discrepancy == 'B/L Destination' ||
	   discrepancy == 'Load Service' || discrepancy == 'Discharge Service' ) {
		return true;
	} else { 
		return false;
	}
}

function customGridComplete() {
	var rowIDs = jQuery("#problmLogForEdi").getDataIDs();
	var count=0;
	for (var i=0;i<rowIDs.length;i=i+1)
	{ 
		var trElement = jQuery("#"+ rowIDs[i],jQuery('#problmLogForEdi'));
		if($('#problmLogForEdi').getCell(rowIDs[i],'resolveUserCombine').length>27)
		{
			$(trElement).css('color', 'blue');
		}
		else if(isRedDiscrepancy($('#problmLogForEdi').getCell(rowIDs[i],'dataElement'))) {
			$(trElement.children()[6]).text('');
			$(trElement).css('color', 'red');
		}
		else
		{
			$(trElement.children()[6]).text('');
			$(trElement).css('color', 'black');
		}
	} 
	for ( var i = 0; i < rowIDs.length; i = i + 1) {
		value = $('#problmLogForEdi').getCell(rowIDs[i],'ediProblemTypeCode');
		if(value=='E'||value=='U'||value=='e'||value=='u')
			{
			count++;
			}
		if(value=="R"||value=='r'){
			if($('#problmLogForEdi').getCell(rowIDs[i],'resolveUserCombine').length<18)
				count++;
		}
	}
	if(count>0){
		document.getElementById('ratedCheck').value='N';
	}else{
		document.getElementById('ratedCheck').value='Y';
	}
	approveEnableDisable();
}
function approveEnableDisable(){
	var statuscode =document.getElementById('statusCode').innerText;
	 var isCurrent =document.getElementById('isCurrentRecord').value;
	 var billExist=document.getElementById('billExists').value;
	 var ratedCheck=$('#ratedCheck').val();
	 if((($.trim(statuscode)!="RECEIVED"&& $.trim(statuscode)!="REJECTED"))||($.trim(billExist)=='Y'|| $.trim(isCurrent)=='N')||$.trim(ratedCheck)=='N')
		 $('#approveEdiBtnabc').attr("disabled",true);
		else
	 $('#approveEdiBtnabc').attr("disabled",false);
	 if($('#approveEnableDisable').val() == true || $('#approveEnableDisable').val() == "true")
	 {
		 $('#approveEdiBtnabc').attr("disabled",true);
	 }
		
}
function unloadSpecialServiceGrid(){
	$('#specialServiceGrid').jqGrid('GridUnload');
}

function loadSpecialServiceGrid(){
	$('#specialServiceGrid').trigger("reloadGrid");
}
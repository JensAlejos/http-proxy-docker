$(document)
		.ready(
				function() {
					
					$('#marksAndNumbers')
							.change(
									function() {
										if ( $.trim($('#marksAndNumbers').val()) == ''
												|| $('#marksAndNumbers').val() == null) {
											$('#marksHeaderCheckBox').attr(
													'checked', false);
										} else {
											$('#marksHeaderCheckBox').attr(
													'checked', true);
											$('#marksAndNumbers').val($('#marksAndNumbers').val().toUpperCase());//change made
										}
									});
					
					createShipmentReferenceNumberGrid();
							
					/*Shipment Security*/
					_enforceSecuritySectionWithoutAccordion( "mainReferenceNumberDiv",isReferenceNumberMarksDisplayOnly,isReferenceNumberMarksModifiable);
					_enforceSecuritySectionWithoutAccordion( "mainMarkNumberDiv",isMarksDisplayOnly,isMarksModifiable);
					if(isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksModifiable){
						$('#referenceHeaderDiv').css('visibility','visible');
						$('#referenceHeaderCheckBox').attr('hidden', false);
					}else{
						$('#referenceHeaderDiv').css('visibility','hidden');
						$('#referenceHeaderCheckBox').attr('hidden', true);
					}
					if(isMarksDisplayOnly || isMarksModifiable){
						$('#marksHeaderDiv').css('visibility','visible');
						$('#marksHeaderCheckBox').attr("hidden",false);
					}else{
						$('#marksHeaderDiv').css('visibility','hidden');
						$('#marksHeaderCheckBox').attr("hidden",true);
					}
					
					$('#marksAndNumbers').blur(function(event){
						wrapTextArea('marksAndNumbers', 20);
						return true;
					});
					
				});

var referenceGridLoadComplete = function() {
	 
	$('#referenceNumberNotation').parent().html("<textarea multiple=\"multiple\" id=\"referenceNumberNotation\" name=\"referenceNumberNotation\" cols=\"20\" rows=\"2\" role=\"textbox\" multiline=\"true\" class=\"FormElement\" style=\"resize: none; width: 190px;\"></textarea>");	
	$('#referenceNumberNotation').val('');
	//Added below for Defect D028800
	if(!isReferenceNumberMarksAdd)
	{
	    $('#tr_seqNo').remove();
	}
	//D026682, Fix for Reference Number Grid Duplication
if(( $('#statusCode').text()=='ISSUED') || ($('#statusCode').text()=='CORRECTED')){
	$('#tr_seqNo').remove();
		}
	var referenceNumberCount = $("#referenceNumberGrid").getGridParam(
			"reccount");
	if (referenceNumberCount > 0) {
		$('#referenceHeaderCheckBox').attr('checked', true);
	} else {
		$('#referenceHeaderCheckBox').attr('checked', false);
	}
	$('#typeCode').val('S');
	var hideCustomRow = hideCustomizeField==true?true:false;
	if(hideCustomRow == true)
	{
		$('#typeCode').attr("disabled", true);
		$('#referenceNumberNotation').attr("disabled", true);
		$('#sData','#gbox_referenceNumberGrid').attr("disabled", true);
	}
	else
	{
		$('#typeCode').attr("disabled", false);
		$('#referenceNumberNotation').attr("disabled", false);
		$('#sData','#gbox_referenceNumberGrid').attr("disabled", false);
	}

	resetRefAddRow();
	hideGridsEditDelete();
	
	//added against 21739
 	/*if(counterRefNumberGridReloaded==0){
 	numberOfInitialRowsRefNumberGrid=jQuery("#referenceNumberGrid").jqGrid('getGridParam', 'records');
 	counterRefNumberGridReloaded++;
 	}
 	if(numberOfInitialRowsRefNumberGrid != jQuery("#referenceNumberGrid").jqGrid('getGridParam', 'records')){
 		changeInRefNumberMarks=true;
 	}*/
 	if(shipmentNotFound==true)
 	{
 		$('#marksAndNumbers').attr("disabled",true);
 		$("#referenceNumberGrid").jqGrid("clearGridData", true);
 	}
 	//$('#referenceNumberNotation').parent().html("<textarea multiple=\"multiple\" id=\"referenceNumberNotation\" name=\"referenceNumberNotation\" cols=\"20\" rows=\"2\" role=\"textbox\" multiline=\"true\" class=\"FormElement\" style=\"resize: none; width: 178px;\"></textarea>");	
 	
};

function resetRefAddRow(){
	//$("#gbox_referenceNumberGrid #referenceNumberNotation").val('');
	//$('#gbox_referenceNumberGrid #typeCode').selected().val('');
	//$("#gbox_referenceNumberGrid #referenceNumberNotation").attr("readonly", true);
	//$("#gbox_referenceNumberGrid #sData").css('background-color','#D8D8D8');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").css('resize','none');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").css('width','190px');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").attr('rows','2');
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen - 1);
}

function setRefAndMarks() {
	var referenceNumberCount = $("#referenceNumberGrid").getGridParam(
			"reccount");
	if (referenceNumberCount > 0) {
		$('#referenceHeaderCheckBox').attr('checked', true);
	} else {
		$('#referenceHeaderCheckBox').attr('checked', false);
	}
	if ($('#marksAndNumbers').val() == ''
			|| $('#marksAndNumbers').val() == null) {
		$('#marksHeaderCheckBox').attr('checked', false);
	} else {
		$('#marksHeaderCheckBox').attr('checked', true);
	}
}

function openRefNumberAndMarkDivBlock(){
	document.getElementById('maintainShipmentRefNumberMarks').style.display = 'block';
	window.scrollTo(0, 100);
}

function isReferenceNumberForShipperExist() {
	var refNumberExist = false;
	var rows = $("#referenceNumberGrid").getRowData();
	for ( var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var typeCode = row.typeCode;
		if (typeCode == 'S' || typeCode == 'B') {
			refNumberExist = true;
		}
	}
	return refNumberExist;
}
function validateRefNumberRequiredShipper(){
	
	var refNumberExist = false;
	$.ajax({
		async: false,
		type : "GET",
		url: _context +"/shipment/referenceNumber/validateRefNumberRequiredShipper",
		success: function(responseText)
		{
			if(responseText.data==true)
				refNumberExist = true;
			else refNumberExist = false;
		}

	});
	return refNumberExist;
}

function validateRefNumberRequiredConsignee(){
	
	var refNumberExist = false;
	$.ajax({
		async: false,
		type : "GET",
		url: _context +"/shipment/referenceNumber/validateRefNumberRequiredConsignee",
		success: function(responseText)
		{
			if(responseText.data==true)
				refNumberExist = true;
			else refNumberExist = false;
		}

	});
	return refNumberExist;
}


function isReferenceNumberForConsigneeExist() {
	var refNumberExist = false;
	var rows = $("#referenceNumberGrid").getRowData();
	for ( var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var typeCode = row.typeCode;
		if (typeCode == 'C' || typeCode == 'B') {
			refNumberExist = true;
		}
	}
	return refNumberExist;
}

function createReferenceNumberGrid(){


	
}

function hideGridsEditDelete(){
	if(( $('#statusCode').text()=='ISSUED') || ($('#statusCode').text()=='CORRECTED')){
		$("div.ui-pg-div.ui-inline-del","#gbox_referenceNumberGrid").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-edit","#gbox_referenceNumberGrid").css("visibility", 'hidden');
		$('#sData','#gbox_referenceNumberGrid').hide();
		$('#gview_referenceNumberGrid input').css("visibility", 'hidden');
		$('#gview_referenceNumberGrid select').css("visibility", 'hidden');
		$('#gview_commodityGrid input').css("visibility", 'hidden');

	}else{
		if(isReferenceNumberMarksDelete){
			$("div.ui-pg-div.ui-inline-del","#gbox_referenceNumberGrid").css("visibility", 'visible');
		}else{
			$("div.ui-pg-div.ui-inline-del","#gbox_referenceNumberGrid").css("visibility", 'hidden');
		}
		if(isReferenceNumberMarksUpdate){
			$("div.ui-pg-div.ui-inline-edit","#gbox_referenceNumberGrid").css("visibility", 'visible');
		}else{
			$("div.ui-pg-div.ui-inline-edit","#gbox_referenceNumberGrid").css("visibility", 'hidden');
		}
		if(isReferenceNumberMarksAdd){
			$('#sData','#gbox_referenceNumberGrid').show();
			$('#gview_referenceNumberGrid input').css("visibility", 'visible');
			$('#gview_referenceNumberGrid select').css("visibility", 'visible');
			$('#gview_commodityGrid input').css("visibility", 'visible');
		}else{
			$('#sData','#gbox_referenceNumberGrid').hide();
			$('#gview_referenceNumberGrid input').css("visibility", 'hidden');
			$('#gview_referenceNumberGrid select').css("visibility", 'hidden');
			$('#gview_commodityGrid input').css("visibility", 'hidden');
		}
	}
}


//code added against defect 021876

function wrapTextArea(textAreaId, maxLength)
{
	 var valToPrint = '';
	 var valArr = $('#'+textAreaId).val().split("\n");
	 var remainder = '';
	 for(var i = 0; i < valArr.length; i++) 
	 {
		 var lineLength = '';
		 if(remainder != '')
		 {
			valToPrint = valToPrint + "\n" + remainder;
			remainder = '';
		 }
		 if(valArr[i].length > maxLength)
		 {
			 var firstTime = true;
			 if(i != 0)
				 valToPrint = valToPrint + "\n";
			 var lineArr = valArr[i].split(" ");
			 for(var k=0;k<lineArr.length;k++)
			 {
				var word = remainder;
				if(lineLength != '' && word !='')
					word = lineLength + ' ' + word;
				else
					word = lineLength + word;
				
				if(word.length > maxLength)
				{
					if(firstTime)
						valToPrint = valToPrint + remainder;
					else
						valToPrint = valToPrint + "\n" + remainder;
					firstTime = false;
					remainder = '';
					lineLength = remainder;
					
					word = lineArr[k];
					if(lineLength != '' && word !='')
						word = lineLength + " " + word;
					else
						word = lineLength + word;
					
					if(word.length > maxLength)
					{
						if(lineArr[k].length > maxLength)
						{
							 var count = Math.floor(lineArr[k].length/maxLength);
							 for(var j=1; j<=count; j++)
							 {
								 if(firstTime)
									 valToPrint = valToPrint + lineArr[k].substr(0,maxLength);
								 else
									 valToPrint = valToPrint + "\n" + lineArr[k].substr(0,maxLength);
								 firstTime = false;
								 lineLength = lineArr[k].substr(0,maxLength);
								 lineArr[k] = lineArr[k].substr(maxLength);
							 }
							 remainder = lineArr[k];
						}
						else
						{
							if(firstTime)
								valToPrint = valToPrint + lineArr[k];
							else
								valToPrint = valToPrint + "\n" + lineArr[k];
							firstTime = false;
							lineLength = lineArr[k];
						}
					}
					else
					{
						if(lineLength!='' || k!=0)
						{
							valToPrint = valToPrint + " " + lineArr[k];
							lineLength = lineLength + " " + lineArr[k];
							firstTime = false;
						}
						else if(lineArr[k] != 0)
						{
							valToPrint = valToPrint + lineArr[k];
							lineLength = lineLength + lineArr[k];
							firstTime = false;
						}
					}
				}
				else
				{
					if(lineLength!='' && remainder !='')
					{
						valToPrint = valToPrint + " " + remainder;
						lineLength = lineLength + " " + remainder;
						firstTime = false;
					}
					else if(remainder !='')
					{
						valToPrint = valToPrint + remainder;
						lineLength = lineLength + remainder;
						firstTime = false;
					}
					
					word = lineArr[k];
					if(lineLength != '' && word!='')
						word = lineLength + " " + word;
					else
						word = lineLength + word;
					
					if(word.length > maxLength)
					{
						if(lineArr[k].length > maxLength)
						{
							 var count = Math.floor(lineArr[k].length/maxLength);
							 for(var j=1; j<=count; j++)
							 {
								 if(firstTime)
									 valToPrint = valToPrint + lineArr[k].substr(0,maxLength);
								 else
									 valToPrint = valToPrint + "\n" + lineArr[k].substr(0,maxLength);
								 firstTime = false;
								 lineLength = lineArr[k].substr(0,maxLength);
								 lineArr[k] = lineArr[k].substr(maxLength);
							 }
							 remainder = lineArr[k];
						}
						else
						{
							if(firstTime)
								valToPrint = valToPrint + lineArr[k];
							else
								valToPrint = valToPrint + "\n" + lineArr[k];
							firstTime = false;
							lineLength = lineArr[k];
						}
					}
					else
					{
						if(lineLength!='' || k!=0)
						{
							valToPrint = valToPrint + " " + lineArr[k];
							lineLength = lineLength + " " + lineArr[k];
							firstTime = false;
						}
						else if(lineArr[k] != '')
						{
							valToPrint = valToPrint + lineArr[k];
							lineLength = lineLength + lineArr[k];
							firstTime = false;
						}
					}
				}
			}
		 }
		 else
		 {
			if(i==0)
				valToPrint = valArr[i];
			else
				valToPrint = valToPrint + "\n" + valArr[i];
			lineLength = valArr[i];
		 }
	 }
	 if(remainder != '')
	 {
		 if(valToPrint !='')
			 valToPrint = valToPrint + "\n" + remainder;
		 else
			 valToPrint = valToPrint + remainder; 
	 }
		 
	 $('#'+textAreaId).val(valToPrint);
}
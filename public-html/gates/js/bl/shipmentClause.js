var isClauseChanged = "";
var clauseCode = "";



//added against 21739
//var changeInClausesGrid=false;

$(document).ready(function() {
	
	
	$('#clause :input').change(function()
	{isClauseChanged = "Y";
		if(this.type=='radio')
		{
			if($("#custom").attr("checked")==true || 
					$("#custom").attr("checked")=='true'||$("#custom").attr("checked")=='checked')
			{
				selectForFormSerialize(this, 'C');
				customClickFunction();
			}
			else if($("#standard").attr("checked")==true || 
					$("#standard").attr("checked")=='true'||$("#standard").attr("checked")=='checked')
			{//alert("Test::::2");
				selectForFormSerialize(this, 'S');
				standardClickFunction();
			}
		}
	});
	
	$("#standardClauseCode").change(function()
	{//alert("Test::::3");
		if($("#standardClauseCode").val()=="" || 
				$("#standardClauseCode").val()!=clauseCode)
		{
			clauseCode = "";
			$("#standardClauseCode").val('');
			$('#text').val("");
			$("#isEditable").val("");
			$("#text").attr("readonly", true);
		}
	});
	
	//Autocompleter and lookup for standard clause
 	$('#standardClauseCode').gatesAutocomplete({
		source: '../cas/autocomplete.do?method=getBkStandardClause&searchType=297',
		formatItem: function(data) {
			return data.Code;
		},
		formatResult: function(data) {
			return data.Code;
		}, 
		select: function(data) {
			isClauseChanged = "Y";
			$("#text").attr("readonly", true);
			$('#standardClauseCode').val(data.Code);
			clauseCode = data.Code;
			$('#text').val(data.FullClause);
			$('#isEditable').val(data.is_editable);
			if($('#isEditable').val()=='Y')
				$("#text").attr("readonly", false);
		}
	});	
 	
	$('#standardClauseCode').gatesPopUpSearch({func:function() {standardClausePopupSearch();}});
	
	
	// create add clause dialog at body onload
	$("#addClauseDialog").dialog({
		autoOpen : false,
		width :634,
		modal : true,
		title: 'Add Clause',
		buttons:{
			Cancel:function()
			{
				if(isClauseChanged!="")
				{
					var r = confirm("All unsaved changes will be discarded.Continue?");
					if(r)
						$("#addClauseDialog").dialog('close');
					else
						return;
				}
				else
					$("#addClauseDialog").dialog('close');
			},
			/*Clear:function()
			{
				resetFunction();
			},*/
			Ok:function()
			{

				    
					if($("#clause").validationEngine('validate'))
					{
						var standardClauseCodes = $('#standardClauseCode').val().split(",");
						var count = standardClauseCodes.length;
						var i=0;
						var j=0;
						var texts = $('#text').val().split(/\r\n|\r|\n/g);
						for(i=0;i<count;i++)
						{
							isClauseChanged = "Y";
							//$("#text").attr("readonly", true);
							//var values = id.split("|");	
							$('#standardClauseCode').val($.trim(standardClauseCodes[i]));
							//clauseCode = values[0];
							$('#text').val(texts[j]);
							//$('#isEditable').val(values[2]);
							/*if($('#isEditable').val()=='Y')
								$("#text").attr("readonly", false);*/
							
						var queryString = $('#clause').formSerialize();
							$.ajax({
								url : _context +"/shipment/clause/addClause",
								type : "POST",
								data : queryString,
								success : function(
										responseText) {
										if(responseText.success==true)
										{
												$("#gridIdForClauses").trigger("reloadGrid");
												/*if($('#isInBond :selected').val()=='false')
												showResponseMessages("msgDiv", responseText);*/
										}
										else	
											showResponseMessages("msgDiv", responseText);
										
										$("#addClauseDialog").dialog('close');
							
							//added against 21739
							//changeInClausesGrid=true;
								}
							});
							
							j = j + 2;
						}
					}
				else
					return false;
			},
			'Ok & Next':function() {
				if($("#clause").validationEngine('validate')) 
				{
					var standardClauseCodes = $('#standardClauseCode').val().split(",");
					var count = standardClauseCodes.length;
					var i=0;
					var j=0;
					var texts = $('#text').val().split(/\r\n|\r|\n/g);
					for(i=0;i<count;i++)
					{
						isClauseChanged = "Y";
						//$("#text").attr("readonly", true);
						//var values = id.split("|");	
						$('#standardClauseCode').val($.trim(standardClauseCodes[i]));
						//clauseCode = values[0];
						$('#text').val(texts[j]);
						//$('#isEditable').val(values[2]);
						/*if($('#isEditable').val()=='Y')
							$("#text").attr("readonly", false);*/
						
					var queryString = $('#clause').formSerialize();
						$.ajax({
							url : _context +"/shipment/clause/addClause",
							type : "POST",
							data : queryString,
							success : function(
									responseText) {
									if(responseText.success==true)
									{
											$("#gridIdForClauses").trigger("reloadGrid");
											/*if($('#isInBond :selected').val()=='false')
											showResponseMessages("msgDiv", responseText);*/
									}
									else {	
										showResponseMessages("msgDiv", responseText);
									}
									
									// clear grid for next use
									$('#standardClauseCode').val('');
									$('#text').val('');
									isClauseChanged = '';
						
						//added against 21739
						//changeInClausesGrid=true;
							}
						});
						
						j = j + 2;
					}
				}
			else
				return false;
			}
		},
		open : function(){
			resetFunction();
			isClauseChanged = "";
			$("#clause").validationEngine('attach');
			tabSequence('#addClauseDialog',false,false);
		},
		close : function() {
			$("#clause").validationEngine('hideAll');
			$("#clause").validationEngine('detach');
			tabSequence('#shipmentForm',true,false);
			//$("#gridIdForClauses").trigger("reloadGrid");
		}
	});
	
	//
	$('#clausesAdd').click(function() {
		//Modified for Defect D028950
		if(!(($('#statusCode').text()=='ISSUED') || $('#statusCode').text()=='CORRECTED') && (isClausesAdd==true)){
			if(shipmentNotFound!=true)
			$("#addClauseDialog").dialog('open');
		}
		return false;
	});
   
	
      
  });

function customClickFunction()
{//alert("customClickFunction1");
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("Y");
	$("#standardClauseCode").attr("disabled", true);
	$("#standardClauseCode").removeClass("validate[required]");
	$("#text").removeClass("validate[required]");
	//This will disable Add button while selecting custom radio button.
	$(":button:contains('Ok')").prop("disabled", true).addClass("ui-state-disabled");
	$("#text").attr("disabled", true);
}

function standardClickFunction()
{//alert("standardClickFunction");
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("");
	$("#standardClauseCode").focus();
	$("#standardClauseCode").attr("disabled", false);
	$("#standardClauseCode").addClass("validate[required]");
	$("#text").addClass("validate[required]");
	//This will enable Add button while selecting standard radio button.
	$(":button:contains('Ok')").prop("disabled", false).removeClass("ui-state-disabled");
	$("#text").attr("readonly", false);
	$("#text").attr("disabled", false);
}

function resetFunction()
{
	//selectForFormSerialize($('#standard'), 'S');
	standardClickFunction();
}

function removeClausesPointers()
{
	$("#clause").validationEngine('hideAll');
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}

function standardClausePopupSearch() {
	
	var code = $('#standardClauseCode').val();
	var actionUrl =  _context + '/cas/blngstandardClauseSearch.do?code='+code+'&ratedatesearch='+ratedatesearch;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'StandardClauseSearch', windowStyle);
}

function setStandardClause(id) {
	/*isClauseChanged = "Y";
	$("#text").attr("readonly", true);
	var values = id.split("|");	
	$('#standardClauseCode').val(values[0]);
	clauseCode = values[0];
	$('#text').val(values[1]);
	$('#isEditable').val(values[2]);
	if($('#isEditable').val()=='Y')
		$("#text").attr("readonly", false);*/
	
	var values = id.split("|");
	var i = 0;
	var linebreak = "\r\n";
	var clausesText = "";
	var actualCode = "";
	$('#isEditable').val(false);
	$("#text").attr("readonly", true);
	while(values[i] != null){
		if(values[i] == null){
			break;
		}		
		if(actualCode != ""){
			actualCode = actualCode + ", " + values[i].split(",")[0];	
			if(clausesText != ""){
				clausesText = clausesText + linebreak + linebreak + values[i].split(",")[4];	
			}else{
				clausesText = values[i].split(",")[4];
			}
		}else{
			actualCode = values[i].split(",")[0];
			if(clausesText != ""){
				clausesText = clausesText + linebreak + linebreak + values[i].split(",")[4];	
			}else{
				clausesText = values[i].split(",")[4];
			}
		}
		if(i == 0){
			if(values[i].split(",")[3] == 'Y' || values[i].split(",")[3] == 'y')
			{
				$('#isEditable').val(true);
				$("#text").attr("readonly", false);
			}
			else
			{
				$('#isEditable').val(false);
				$("#text").attr("readonly", true);
			}
		}else{
			$('#isEditable').val(false);
			$("#text").attr("readonly", true);
		}
		i = i + 1;
	}

	$('#standardClauseCode').val(actualCode);
	$('#text').val(clausesText);
	
	tempStandardClauseCode = $("#standardClauseCode").val();

}

var clauseGridComplete = function()
{
	 var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
	 var headerStr = "";
     for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
       //var trElement = jQuery("#"+ rowIDs[i],jQuery('#gridIdForClauses'));
   	   
       if (rowData.isEditable!='Y' || ($("#statusCode").text()=='CORRECTED')|| ($("#statusCode").text()=='ISSUED')|| isClausesUpdate==false){
    	   $('#gbox_gridIdForClauses tbody tr#'+rowIDs[i]+' td div.ui-inline-edit').hide();
       }
   	   if (($("#statusCode").text()=='ISSUED')|| ($("#statusCode").text()=='CORRECTED') || isClausesDelete==false)  {
   		   $('#gbox_gridIdForClauses tbody tr#'+rowIDs[i]+' td div.ui-inline-del').hide();
   		   
   	   }
   	   
       if(rowData.standardClauseCode!=null && rowData.standardClauseCode!='')
       {       if(headerStr=='')
    	   			headerStr = rowData.standardClauseCode;
       			else
       				headerStr = headerStr + ", "+rowData.standardClauseCode;
       }
       
       // D026181
       if(rowData.clauseTypeCode=='C'){
          	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Custom');
          }else if(rowData.clauseTypeCode=='I'){
          	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Instruction');
          }else{
          	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Billing Clause');
          }
    	 // jQuery('#gridIdForClauses tr #'+rowIDs[i]+' td:last div:first div.ui-inline-edit',jQuery(this)).hide();
    	   //$('.ui-icon-pencil').hide();
    	   //$("#gridIdForClauses").jqGrid('setCell', (i), 'actions', $("div.ui-pg-div.ui-inline-edit", "#"+"gbox_gridIdForClauses").show(), 'ui-icon-pencil', '');
    }
     if(headerStr!="")
  	  // headerStr = "Clauses - " + headerStr;
     headerStr = " - " + headerStr;
     else
  	   headerStr = "";
     //headerStr = "Clauses";
     setAccordianTabDetails('clauseHeader', headerStr);
     
     $('#pagerIdForClauses .ui-pg-input').attr("readonly", true);
     
   //added against 21739
 	/*if(counterClausesGridReloaded==0){
 	numberOfInitialRowsClausesGrid=jQuery("#gridIdForClauses").jqGrid('getGridParam', 'records');
 	counterClausesGridReloaded++;
 	}
 	if(numberOfInitialRowsClausesGrid != jQuery("#gridIdForClauses").jqGrid('getGridParam', 'records')){
 		changeInClauses=true;
 	}*/
 	//22735
 	disableClauseCheckBoxes(); 
    return true;
};

var clauseLoadComplete = function()
{
	//hides add row
	$("#tr_clauseSeqNo", "#"+"gbox_gridIdForClauses").hide();
	
	//Clears and hides error row
	$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
	
	return true;
};

function validateMaxlength(value, colname)
{
	if(value.length>1800)
		return [false, "Clause length cannot be greater than 1800 characters"];
	else
		return [true, ""];
}

function setClauseDiv() {
	var rowIDs = jQuery("#gridIdForClauses").getDataIDs();
	var headerStr = "";
	for ( var i = 0; i < rowIDs.length; i = i + 1) {
		var rowData = jQuery("#gridIdForClauses").getRowData(rowIDs[i]);

		if (rowData.standardClauseCode != null
				&& rowData.standardClauseCode != '') {
			if (headerStr == '')
				headerStr = rowData.standardClauseCode;
			else
				headerStr = headerStr + ", " + rowData.standardClauseCode;
		}
	}
	if (headerStr != "")
		headerStr = " - " + headerStr;
	else
		headerStr = "";
	//headerStr = "Clauses";
	setAccordianTabDetails('clauseHeader', headerStr);
}
//22735
function disableClauseCheckBoxes(){
	if($("#statusCode").text()=="ISSUED" || $("#statusCode").text()=="CORRECTED" ){
		   //disable checkboxes
		 $("#cb_gridIdForClauses").attr('disabled',true);
		 $("[id^=jqg_gridIdForClauses]").attr('disabled',true);
		}
}
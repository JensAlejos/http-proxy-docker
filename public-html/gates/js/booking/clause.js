var isClauseChanged = "";
var clauseCode = "";

$(function() {
	
	$('#clause :input').change(function()
	{
		isClauseChanged = "Y";
		if(this.type=='radio')
		{
			if($("#custom").prop("checked")==true || 
					$("#custom").prop("checked")=='true')
			{
				selectForFormSerialize(this, 'C');
				customClickFunction();
			}
			else if($("#standard").prop("checked")==true || 
					$("#standard").prop("checked")=='true')
			{
				selectForFormSerialize(this, 'S');
				standardClickFunction();
			}//D026182
			else if($("#instruction").prop("checked")==true || 
					$("#instruction").prop("checked")=='true')
			{
				selectForFormSerialize(this, 'I');
				standardClickFunction();
			}
		}
	});
	
	$("#standardClauseCode").change(function()
	{
		if($("#standardClauseCode").val()=="" || 
				$("#standardClauseCode").val()!=clauseCode)
		{
			clauseCode = "";
			$("#standardClauseCode").val('');
			$('#printOnBkngConfirm').val("");
			$('#printOnBilling').val("");
			$('#text').val("");
			$("#isEditable").val("");
			$("#text").attr("readonly", true);
		}
	});
	
	//Autocompleter and lookup for standard clause
 	$('#standardClauseCode').gatesAutocomplete({
		//source: _context+'/cas/autocomplete.do',
		source:_context+'/cas/autocomplete.do',
		name: "Clause Code",
	 	extraParams: {
		 		 method: 'getBkStandardClause',
		 		 searchType: '296',
				parentSearch:  function() { 
	 			if($('#standard').attr("checked"))
	 				return "S";
	 			else
	 				return "I";
	 		 }
	 	},
		autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
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
			$("#printOnBkngConfirm").val(data.bkngFlag);
			if($('#isEditable').val()=='Y')
				$("#text").attr("readonly", false);
			
			if(data.type=='Clause')
			{
				$('.clauseType').attr("checked", false);
				$('#standard').attr('checked', true);
				$('#printOnBilling').val("Y");
				selectForFormSerialize('#standard', 'S');
			}
			else if(data.type=='Instruction')
			{
				$('.clauseType').attr("checked", false);
				$('#instruction').attr('checked', true);
				$('#printOnBilling').val("N");
				//D026182
				selectForFormSerialize('#instruction', 'I');
			}
		}
	});	
	
	$('#standardClauseCode').gatesPopUpSearch({
		func:function() {
			if($('#standardClauseCode').attr("readonly") || $('#standardClauseCode').attr("readonly")=='readonly')
				return;
			else
				standardClausePopupSearch();
		}
	});
	
	// create add clause dialog at body onload
	$("#addClauseDialog").dialog({
		autoOpen : false,
		width :634,
		modal : true,
		title: 'Add Clause',
		buttons:{
			Cancel:function()
			{
				removeClausesPointers();
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
			Ok:function()
			{
				removeClausesPointers();
				if($("#clause").validationEngine('validate'))
				{
					var queryString = $('#clause').formSerialize();
					$.ajax({
						url : _context +"/booking/clause/addClause",
						type : "POST",
						data : queryString,
						success : function(
								responseText) {
							if(responseText.success==true)
							{
								isBookingChanged = "Y";
								$("#gridIdForClauses").trigger("reloadGrid");
								/*if($('#isInBond :selected').val()=='false')
									showResponseMessages("msgDiv", responseText);*/
							}
							else	
								showResponseMessages("msgDiv", responseText);
							
							$("#addClauseDialog").dialog('close');
						}
					});
				}
				else
					return false;
			},
			Clear:function()
			{
				resetFunction();
			}
		},
		open : function(){
			tabSequence('#addClauseDialog',false,false);
			resetFunction();
			$("#clause").validationEngine('attach');
		},
		close : function() {
			removeClausesPointers();
			$("#clause").validationEngine('detach');
			//$("#gridIdForClauses").trigger("reloadGrid");
			tabSequence('#',true,false);
		}
	});
	
	//
	$('#clausesAdd').click(function() {
		/*Booking Security*/
		if(isClauseDisplayOnly && isClauseModifiable){
			if($('#bookingStatusCode').val()!='CANC'){
				$("#addClauseDialog").dialog('open');
			}
		}
		return false;
	});
   
  var colNames = ['Id','Clause Code', 'Is Editable', 'Print On Booking', 'Clause Type','Text','Source','' ];
  
  var colModel = [
       {name:'clauseSeqNo', hidden:true},
       {name:'standardClauseCode', index:'standardClauseCode', width:100},
       {name:'isEditable', hidden:true},
       {name:'printOnBkngConfirm', hidden:true},
       {name:'clauseTypeCode', index:'clauseTypeCode', width:100},
       {name:'clauseText',index:'clauseText', width:350, editable:true, edittype:"textarea", editrules : { required : true, custom:true, custom_func:validateMaxlength}, editoptions : {rows : 2, cols : 44, style:'resize:none;'}},
       {name:'clauseSource',index:'clauseSource', width:150}, 
       {name:'actions', width:50, formatter:'actions',formatoptions:{keys:true, editbutton:true, delbutton:true, url:_context+'/booking/clause/updateClause', 
    	   afterRestore:function()
    	   {
    		 //Clears and hides error row
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
    	   },
    	   afterSave:function()
    	   {
    		   isBookingChanged = "Y";
    		   return true;
    	   }
       }}];
  
  
  var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "clauseSeqNo"
		};

  /*Booking Security*/
  if(isClauseDisplayOnly || isClauseModifiable){
		createGrid("gridIdForClauses", // grid id for party
		"pagerIdForClauses", // page id for party
		_context+'/booking/clause/load', // geturl
		'', // addurl
		_context+'/booking/clause/updateClause', // edit url
		_context+'/booking/clause/deleteClause',
		_context+'/booking/clause/deleteClause',// delete selected URL
		colNames, colModel, "Clauses",// caption
		85,// height //86 for new font
		3,// row num
		[ 3, 6, 9 ],// row list
		true,// multiselect
		true,// multidelete
		false,// load once
		false, // read only grid
		jsonReader, // json reader
		false, // hide edit
		false, // hide delete
		true, // autowidth
		true, // rownumbers
		true, // hide custom add row
		false,// hide pager row
		null,// custom edit method
		clauseGridComplete,// custom grid complete
		clauseLoadComplete,// custom load complete
		false,// default hidden
		true,// row Color Based On status
		false,//cell edit
		clauseAfterSubmit);
  }
		
		$("#gridIdForClauses").jqGrid('setGridParam',{
			delOptions: {
				beforeSubmit:function(postdata)
				{
					rowData=jQuery("#gridIdForClauses").getRowData(postdata);
					if(rowData.standardClauseCode=='BOND' && $('#isInBond :selected').val()=='true')
					{
						$('#msgDiv').html("<div class='message_error'>BOND clause cannot be deleted as Inbond flag is 'Y'</div>");
						window.scrollTo(0, 0);
						$('#eData').trigger('click');
						triggerErrorMessageAlert();
						return [false,""];
					}
					else
						return [true,""];
				},
				beforeSelectRow: function(rowId, e) {
					 var rowData = jQuery("#gridIdForClauses").getRowData(rowId);
					 if(rowData.standardClauseCode=='BOND' && $('#isInBond :selected').val()=='true') {
						 return false;
					 }
					 else
						 return true;
				 }
			}
		});
  });

var clauseAfterSubmit = function(result)
{
	if(result.success)
		isBookingChanged = "Y";
};

function customClickFunction()
{
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("Y");
	$("#printOnBkngConfirm").val("");
	$("#printOnBilling").val("");
	$("#standardClauseCode").attr("disabled", true);
	$("#text").attr("readonly", false);
}

function standardClickFunction()
{
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("");
	$("#printOnBkngConfirm").val("");
	$("#printOnBilling").val("");
	$("#standardClauseCode").attr("disabled", false);
	$("#standardClauseCode").attr("readonly", false);
	$("#text").attr("readonly", true);
}

function resetFunction()
{
	isClauseChanged = "";
	selectForFormSerialize($('#standard'), 'S');
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
	var flag = "";
	if($('#standard').attr("checked"))
		flag = "S";
	else if($('#instruction').attr("checked"))
		flag = "I";
	var code = $('#standardClauseCode').val();
	//D026129
	var estShipDate = $('#estShip').text();
	var actionUrl =  _context + '/cas/bkgstandardClauseSearch.do?flagType='+flag+'&code='+code+'&estShipDate='+estShipDate;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'StandardClauseSearch', windowStyle);
}

function setStandardClause(listOfClauses) {
	var clauses = listOfClauses.split("|");
	if(clauses.length==1)
	{
		isClauseChanged = "Y";
		$("#text").attr("readonly", true);
		var id = clauses[0];
		var values = id.split(",");	
		$('#standardClauseCode').val(values[0]);
		clauseCode = values[0];
		$('#text').val(getStandardText(values));
		$('#isEditable').val(values[3]);
		$("#printOnBkngConfirm").val(values[values.length-1]);
		if($('#isEditable').val()=='Y')
			$("#text").attr("readonly", false);
		if(values[2]=='Clause')
		{
			$('.clauseType').attr("checked", false);
			$('#standard').attr('checked', true);
			$('#printOnBilling').val("Y");
			selectForFormSerialize('#standard', 'S');
		}
		else if(values[2]=='Instruction')
		{
			$('.clauseType').attr("checked", false);
			$('#instruction').attr('checked', true);
			$('#printOnBilling').val("N");
			//D026182
			selectForFormSerialize('#instruction', 'I');
		}
	}
	else
	{
		var codeArr = "";
		var isEditableArr = "";
		var textArr = "";
		var bkngArr = "";
		var billArr = "";
		
		var areAllInstructions = true;
		var areAllClauses = true;
		
		for(var i=0;i<clauses.length;i++)
		{
			var id = clauses[i];
			var values = id.split(",");	
			
			var code = values[0];
			var editable = values[3];
			var bkng = values[values.length-1];
			var bill = "";
			if(values[2]=='Clause')
			{
				bill = "Y";
				areAllInstructions = false;
			}
			else if(values[2]=='Instruction')
			{
				bill = "N";
				areAllClauses = false;
			}
			var text = getStandardText(values);
			
			if(i==0)
			{
				codeArr = code;
				isEditableArr = editable;
				textArr = text;
				bkngArr = bkng;
				billArr = bill;
			}
			else
			{
				codeArr = codeArr+ "," + code;
				isEditableArr = isEditableArr + "," + editable;
				textArr = textArr +"\n\n" + text;
				bkngArr = bkngArr + "," + bkng;
				billArr = billArr + "," + bill;
			}
		}
		
		$('#standardClauseCode').val(codeArr);
		$('#text').val(textArr);
		$('#isEditable').val(isEditableArr);
		$("#printOnBkngConfirm").val(bkngArr);
		$('#printOnBilling').val(billArr);
		$("#text").attr("readonly", true);
		$('#standardClauseCode').attr("readonly", true);
		if(areAllClauses || (!areAllClauses && !areAllInstructions))
		{
			$('.clauseType').attr("checked", false);
			$('#standard').attr('checked', true);
			selectForFormSerialize('#standard', 'S');
		}
		else if(areAllInstructions)
		{
			$('.clauseType').attr("checked", false);
			$('#instruction').attr('checked', true);
			//D026182
			selectForFormSerialize('#instruction', 'I');
		}
	}
}

function getStandardText(standardTextArray)
{
	var standardText = "";
	for(var i=4;i<standardTextArray.length-1;i++)
	{
		if(i==4)
			standardText = standardText + standardTextArray[i];
		else
			standardText = standardText + "," + standardTextArray[i];
	}
	return standardText;
}

var clauseGridComplete = function()
{
	 var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
	 var headerStr = "";
     for (var i=0;i<rowIDs.length;i=i+1)
     {
       var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
       var id = $('#gridIdForClauses').getCell(rowIDs[i], 'clauseSeqNo');
       //var trElement = jQuery("#"+ rowIDs[i],jQuery('#gridIdForClauses'));
       if (rowData.isEditable!='Y' || $("#bookingStatusCode").val()=='CANC' || !isClauseModifiable)
       {
    	   //$("div.ui-pg-div.ui-inline-edit", "#"+"gbox_gridIdForClauses"+" #"+rowIDs[i]).hide();
    	   $("#gbox_gridIdForClauses #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
       }
       if(($("#bookingStatusCode").val()=='CANC' || !isClauseModifiable) || 
    		   (rowData.standardClauseCode=='BOND' && $('#isInBond :selected').val()=='true'))
       {
    	   $("#gbox_gridIdForClauses #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();
    	   $('#jqg_gridIdForClauses_'+id).attr("checked",false);
    	   $('#jqg_gridIdForClauses_'+id).hide();
       }
       
       // commented for D027776
       /*if(rowData.standardClauseCode!=null && rowData.standardClauseCode!='')
       {       if(headerStr=='')
    	   			headerStr = rowData.standardClauseCode;
       			else
       				headerStr = headerStr + ", "+rowData.standardClauseCode;
       }*/
       
    	 // jQuery('#gridIdForClauses tr #'+rowIDs[i]+' td:last div:first div.ui-inline-edit',jQuery(this)).hide();
    	   //$('.ui-icon-pencil').hide();
    	   //$("#gridIdForClauses").jqGrid('setCell', (i), 'actions', $("div.ui-pg-div.ui-inline-edit", "#"+"gbox_gridIdForClauses").show(), 'ui-icon-pencil', '');
       
       //D026182: FW: Maintain Booking: Booking Clause grid is not distinguishing between Standard Billing Clauses and Instructions
       if(rowData.clauseTypeCode=='C'){
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Custom');
       }else if(rowData.clauseTypeCode=='I'){
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Instruction');
       }else{
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Billing Clause');
       }
     }
     
     if($("#bookingStatusCode :selected").val()=='CANC' || !isClauseModifiable)
 	{
 		$("#gbox_gridIdForClauses .cbox").attr("disabled", true);
 	}
 	else
 	{
 		$('#jqgh_gridIdForClauses_cb').html('<input type="checkbox" id="multiselect_gridIdForClauses" />');
		$("#multiselect_gridIdForClauses").click(function(){
			$("#gridIdForClauses").resetSelection();
			
			if($("#multiselect_gridIdForClauses").attr("checked")=="checked")
			{
				  var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
			      for (var i=0;i<rowIDs.length;i=i+1)
			      { 
			    	  var id = $('#gridIdForClauses').getCell(rowIDs[i], 'clauseSeqNo');
			    	  var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
			    	  if(rowData.standardClauseCode=='BOND' && $('#isInBond :selected').val()=='true')
			    	  {
			    		  $('#jqg_gridIdForClauses_'+id).attr("checked",false);
			    	  }
			    	  else
			    	  {
			    		  $('#jqg_gridIdForClauses_'+id).attr("checked",true);
		 		    	  $('#gridIdForClauses').setSelection(rowIDs[i], true);
			    	  }
			      }
			}
			return true;
		});
 	 }
     
     // Added a new ajax call for populating Clause Accordian full data
     $.ajax({
			url : _context +"/booking/clause/loadClauseAccordian",
			type : "GET",
			success : function(responseText) {
				if(responseText.success==true) {
					for (var i=0; i<responseText.rows.length; i=i+1) {
						var clause = responseText.rows[i];
						if(clause.standardClauseCode != null && clause.standardClauseCode != '') {
							if(headerStr=='')
								headerStr = clause.standardClauseCode;
							else
								headerStr = headerStr + ", "+clause.standardClauseCode;
						}
					}
					if(headerStr!="")
						headerStr = " - " + headerStr;
					
					setAccordianTabDetails('clauseHeader', headerStr);
				}
			}
		});
     
     // commented for D027776
     /*if(headerStr!="")
  	   headerStr = " - " + headerStr;
     else
  	   headerStr = "Clauses";
     setAccordianTabDetails('clauseHeader', headerStr);*/
     
     $('#pagerIdForClauses .ui-pg-input').attr("readonly", true);
     
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
var isClauseChanged = "";
var clauseCode = "";
/*var currClauseRowId;*/

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
					$("#standard").prop("checked")=='true' || 
					$("#instruction").prop("checked")==true || 
					$("#instruction").prop("checked")=='true')
			{
				selectForFormSerialize(this, 'S');
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
			$('#text').val("");
			$("#isEditable").val("");
			$("#printOnBkngConfirm").val("");
			$('#printOnBilling').val("");
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
				selectForFormSerialize('#instruction', 'S');
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
				if($("#clause").validationEngine('validate'))
				{
					/*if($("#standardClauseCode").val()!='BOND')
					{*/
						var queryString = $('#clause').formSerialize();
						$.ajax({
							url : _context +"/booking/senddocument/addClause",
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
							}
						});
					/*}
					else
						alert("BOND clause cannot be added as INBOND Flag is set to false on booking");*/
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
			$("#clause").validationEngine('hideAll');
			$("#clause").validationEngine('detach');
			//$("#gridIdForClauses").trigger("reloadGrid");
			tabSequence('#sendDocumentForm',true,false);
		}
	});
	
	//
	$('#clausesAdd').click(function() {
		if(_isClauseAdd && $('#isSendAllowed').val()=='true')
			$("#addClauseDialog").dialog('open');
	});
   
  var colNames = ['Id','Clause Code','Clause Id', 'Is Editable', 'Print On Booking', 'Clause Type','Text','Source','' ];
  
  var colModel = [
       {name:'clauseSeqNo', hidden:true},
       {name:'standardClauseCode', index:'standardClauseCode', width:100},
       {name:'clauseId', hidden:true},
       {name:'isEditable', hidden:true},
       {name:'printOnBkngConfirm', hidden:true},
       {name:'clauseTypeCode', index:'clauseTypeCode', width:100},
       {name:'clauseText',index:'clauseText', width:350, editable:true, edittype:"textarea", editrules : { required : true, custom:true, custom_func:validateMaxlength}, editoptions : {rows : 2, cols : 42}},
       {name:'clauseSource',index:'clauseSource', width:150}, 
       {name:'actions', width:50, formatter:'actions',formatoptions:{keys:true, editbutton:true, delbutton:true, url:_context+'/booking/senddocument/updateClause', 
    	   afterRestore:function()
    	   {
    		 //Clears and hides error row
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
    	   }/*,
    	   onEdit : function(rowId)
			{
    		   currClauseRowId = rowId.toString();
				return true;
			},
    	   onSuccess: function()
			{
				var rowData=jQuery("#gridIdForClauses").getRowData(currClauseRowId);
				 if(rowData.clauseTypeCode== 'C' || rowData.printOnBkngConfirm=='Y')
					 jQuery("#gridIdForClauses").jqGrid('setSelection',currClauseRowId);
				 else
					 jQuery("#gridIdForClauses").jqGrid('resetSelection',currClauseRowId);
				return true;
			}, 
			onError: function()
			{
				var rowData=jQuery("#gridIdForClauses").getRowData(currClauseRowId);
				 if(rowData.clauseTypeCode== 'C' || rowData.printOnBkngConfirm=='Y')
					 jQuery("#gridIdForClauses").jqGrid('setSelection',currClauseRowId);
				 else
					 jQuery("#gridIdForClauses").jqGrid('resetSelection',currClauseRowId);
				return true;
			}*/
			
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

		createGrid("gridIdForClauses", // grid id for party
		"pagerIdForClauses", // page id for party
		_context+'/booking/senddocument/loadClause', // geturl
		'', // addurl
		_context+'/booking/senddocument/updateClause', // edit url
		_context+'/booking/senddocument/deleteClause',
		'',// delete selected URL
		colNames, colModel, "Clauses",// caption
		83,// height
		9,// row num
		[ 9, 18, 27 ],// row list
		true,// multiselect
		false,// multidelete
		false,// load once
		true, // read only grid
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
		true);// row Color Based On status
		
		
		
		$("#gridIdForClauses").jqGrid('setGridParam',{
			beforeSelectRow:function(rowId)
			{
				return false;
			},
			delOptions: {
				beforeSubmit:function(postdata)
				{
					rowData=jQuery("#gridIdForClauses").getRowData(postdata);
					if(rowData.standardClauseCode=='BOND' && $('#isInBond').val()=='true')
					{
						$('#msgDiv').html('<div class="message_error">'+'BOND clause cannot be deleted as INBOND Flag is set to true on Booking'+'</div>');
						window.scrollTo(0, 0);
						/*$('#eData').trigger('click');
						$('#jqg_gridIdForClauses_2').trigger('click');*/
						$('#jqg_gridIdForClauses_2').attr("checked", false);
						return [false,""];
					}
					else
						return [true,""];
				}/*,
				onClose : function()
				{
					var rowData=jQuery("#gridIdForClauses").getRowData(currClauseRowId);
					 if(rowData.clauseTypeCode== 'C' || rowData.printOnBkngConfirm=='Y')
						 jQuery("#gridIdForClauses").jqGrid('setSelection',currClauseRowId);
					 else
						 jQuery("#gridIdForClauses").jqGrid('resetSelection',currClauseRowId);
					return true;
				}*/
			}
		});
	});

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

function standardClausePopupSearch() {
	var actionUrl =  _context + '/cas/bkgstandardClauseSearch.do';
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
			selectForFormSerialize('#instruction', 'S');
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
			selectForFormSerialize('#instruction', 'S');
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
	 
	 if($("#multiselect_gridIdForClauses").length!=0)
		 $("#multiselect_gridIdForClauses").attr("checked",false);
	
     for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
       if (!_isClauseEdit || rowData.isEditable!='Y')
       {
    	   //$("div.ui-pg-div.ui-inline-edit", "#"+"gbox_gridIdForClauses"+" #"+rowIDs[i]).hide();
    	   $("#gbox_gridIdForClauses #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
       }
       if(!_isClauseDelete)
     		$("#gbox_gridIdForClauses #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();
       
       if(rowData.clauseTypeCode== 'C' || rowData.printOnBkngConfirm=='Y')
       {
    	   /* var trElement = jQuery("#"+ rowIDs[i],jQuery('#gridIdForClauses'));
    	   $(trElement).trigger('click');
    	   $(trElement).attr("aria-selected","true");
    	   $(trElement).attr("class","ui-widget-content jqgrow ui-row-ltr ui-state-highlight");*/
    	  $("#gbox_gridIdForClauses #"+rowIDs[i]+" 'input[type=checkbox]").prop("checked", true);
       }
       
    }
     
 	if(!_isSavePresent)
 	{
 		 $("#cb_gridIdForClauses").attr("disabled", true);
 		$("#gridIdForClauses .cbox").attr("disabled", true);
 	}
 	else
	{
		$("#cb_gridIdForClauses").hide();
		if($("#multiselect_gridIdForClauses").length==0)
			$('#jqgh_gridIdForClauses_cb').html('<input type="checkbox" id="multiselect_gridIdForClauses" />');
		$("#multiselect_gridIdForClauses").click(function(){
			var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
			var checked = false;
			if($("#multiselect_gridIdForClauses").attr("checked")=="checked")
				checked = "checked";
		      for (var i=0;i<rowIDs.length;i=i+1){ 
		    	  var id = $('#gridIdForClauses').getCell(rowIDs[i], 'clauseSeqNo');
		    	  $('#jqg_gridIdForClauses_'+id).attr("checked",checked);
		      }
			return true;
		});
	}
 	
 	$('#pagerIdForClauses .ui-pg-input').attr("readonly", true);
    
    return true;
};

var clauseLoadComplete = function()
{
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

function selectForFormSerialize(radioButtonObj, value)
{
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}
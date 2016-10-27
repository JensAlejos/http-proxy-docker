var isClauseChanged = "";
var clauseCode = "";

$(function() {
	$('#consigneeAddress').attr("readonly",true);
	
	$('#receivedContainerClause :input').change(function()
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
		width :1000,
		modal : true,
		buttons:{
			Cancel:function(){
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
			Ok:function(){
				if($("#receivedContainerClause").validationEngine('validate')){
					/*if($("#standardClauseCode").val()!='BOND')
					{*/
						var queryString = $('#receivedContainerClause').formSerialize();
						$.ajax({
							url : _context+"/receivedContainer/addClause",
							type : "POST",
							data : queryString,
							success : function(responseText) {
								if(responseText.success==true){
									$("#gridIdForClauses").trigger("reloadGrid");
									/*if($('#isInBond :selected').val()=='false')
										showResponseMessages("msgDiv", responseText);*/
								}else	
									showResponseMessages("msgDiv", responseText);
								$("#addClauseDialog").dialog('close');
							}
						});
					/*}
					else
						alert("BOND clause cannot be added as INBOND Flag is set to false on booking");*/
				}else
					return false;
			},
			Clear:function(){
				clauseResetFunction();
			}
		},
		open : function(){
			tabSequence('#addClauseDialog',false,false);
			clauseResetFunction();
			$("#clause").validationEngine('attach');
		},
		close : function() {
			$("#clause").validationEngine('hideAll');
			$("#clause").validationEngine('detach');
			$("#gridIdForClauses").trigger("reloadGrid");
			tabSequence('#receivedContainerForm',true,false);
		}
	});
	
	$('#clausesAdd').click(function() {
		if($("#success").val()=='false'){
			$("div#msgDiv").html('<div class="message_error">Load booking first.</div>');
		}
		else{
			$("#addClauseDialog").dialog('open');
		}
	});
   
  var colNames = ['Id','Clause Code', 'Is Editable', 'Clause Type','Text','Source','' ];
  
  var colModel = [
       {name:'clauseSeqNo', hidden:true},
       {name:'standardClauseCode', index:'standardClauseCode', width:100},
       {name:'isEditable', hidden:true},
       {name:'clauseTypeCode', index:'clauseTypeCode', width:100},
       {name:'clauseText',index:'clauseText', width:350, editable:true, edittype:"textarea", editrules : { required : true, custom:true, custom_func:validateMaxlength}, editoptions : {rows : 2, cols : 42}},
       {name:'clauseSource',index:'clauseSource', width:150}, 
       {name:'actions', width:50, formatter:'actions',formatoptions:{keys:true, editbutton:true, delbutton:true,
    	   afterRestore:function()
    	   {
    		 //Clears and hides error row
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
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

		createGrid("gridIdForClauses", // grid id for party
		"pagerIdForClauses", // page id for party
		_context+'/receivedContainer/loadClauses', // geturl
		'', // addurl
		_context+'/receivedContainer/updateClause', // edit url
		_context+'/receivedContainer/deleteClause',
		_context+'/receivedContainer/deleteClause', // delete selected URL
		colNames, colModel, "Clauses",// caption
		83,// height
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
		true);// row Color Based On status
		
		
		$("#gridIdForClauses").jqGrid('setGridParam',{
			delOptions: {url: _context+'/receivedContainer/deleteClause', caption: "Confirmation", msg: "Please CONFIRM request to DELETE",
				beforeSubmit:function(postdata)
				{
					rowData=jQuery("#gridIdForClauses").getRowData(postdata);
					if(rowData.standardClauseCode=='BOND' && $('#isInBond').val()=='true')
					{
						$('#msgDiv').html('<div class="message_error">'+'BOND clause cannot be deleted as INBOND Flag is set to true on Booking'+'</div>');
						window.scrollTo(0, 0);
						$('#eData').trigger('click');
						return [false,""];
					}
					else
						return [true,""];
				}
			}
		});

		var organizationId ="";
		var url = _context+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|';
		$('#consignee').gatesAutocomplete({
			source : url,
			name: 'Customer Name',
			formatItem : function(data) {
				$('#consigneeOrganizationId').val("");
				$('#consigneeAddress').val("");
				return data.name + "-" + data.abbr;
			},
			  autoSelectFirst:true,
				autoSelectCriteria:function(item) {
				   if(item != null){
				     return 'true';
				  }
				  else {
				     return 'false';
				  }
				},
			
			formatResult : function(data) {
				return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
			},
			select : function(data) {
				$('#consigneeAddress').val("");
				$('#consignee').val(data.name + "-" + data.abbr);
				organizationId = data.id;
				$('#consigneeOrganizationId').val(organizationId);
				$('#consigneeName').val($('#consignee').val());
			}
		});

		// Shipper address Pop-Up Search
		$('#addressLookUpImage').gatesPopUpSearch({
			func : function() {
				consigneeAroleLookUpSearch();
			}
		});

		$('#consignee').change(function() {
			if ($('#consignee').val() != $('#consigneeName').val()) {
				$('#consignee').val("");
				$('#consigneeAddress').val("");
			}
		});
});

function consigneeAroleLookUpSearch(){
	// Not sure where this is used but maybe needs the trade, see container_overlay.js
	var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='+ $('#consigneeOrganizationId').val() + '&filterValue2=02'+'&filterValue3=';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'Address Role Search', windowStyle);
}
function addroleUpdate(data) {
	var values = data.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('#consigneeAddress').val(finalAddress);
}

function customClickFunction()
{
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("Y");
	$("#printOnBkngConfirm").val("");
	$('#printOnBilling').val("");
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
	$('#printOnBilling').val("");
	$("#standardClauseCode").attr("disabled", false);
	$("#standardClauseCode").attr("readonly", false);
	$("#text").attr("readonly", true);
}

function clauseResetFunction()
{
	isClauseChanged = "";
	selectForFormSerialize($('#standard'), 'S');
	standardClickFunction();
}


function selectForFormSerialize(radioButtonObj, value)
{
	$(radioButtonObj).attr("checked", true);
	$(radioButtonObj).val(value);
}

function removeClausesPointers(){
	$("#clause").validationEngine('hideAll');
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
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

var clauseGridComplete = function(){
	 var rowIDs = jQuery("#gridIdForClauses").getDataIDs(); 
	 var headerStr = "";
     for (var i=0;i<rowIDs.length;i=i+1) { 
       var rowData=jQuery("#gridIdForClauses").getRowData(rowIDs[i]);
       //var trElement = jQuery("#"+ rowIDs[i],jQuery('#gridIdForClauses'));
       if (rowData.isEditable!='Y'){
    	   $("div.ui-pg-div.ui-inline-edit", "#"+"gbox_gridIdForClauses"+" #"+rowIDs[i]).hide();
       }
       if(rowData.standardClauseCode!=null && rowData.standardClauseCode!=''){
    	   if(headerStr=='')
    	   			headerStr = rowData.standardClauseCode;
       			else
       				headerStr = headerStr + ", "+rowData.standardClauseCode;
       }
       
       //D026182: FW: Maintain Booking: Booking Clause grid is not distinguishing between Standard Billing Clauses and Instructions
       if(rowData.clauseTypeCode=='C'){
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Custom');
       }else if(rowData.clauseTypeCode=='I'){
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Instruction');
       }else{
       	$("#gridIdForClauses").jqGrid('setCell',rowIDs[i],'clauseTypeCode', 'Billing Clause');
       }
    	
    }
     if(headerStr!="")
    	   headerStr = "Clauses - " + headerStr;
       else
    	   headerStr = "Clauses";
       setAccordianTabDetails('clauseHeader', headerStr);
       enforceSecurityOnClauses();
    return true;
};

var clauseLoadComplete = function(){
	//hides add row
	$("#tr_clauseSeqNo", "#"+"gbox_gridIdForClauses").hide();
	//Clears and hides error row
	$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
	
	enforceSecurityOnClauses();
	return true;
};

function validateMaxlength(value, colname){
	if(value.length>1800)
		return [false, "Clause length cannot be greater than 1800 characters"];
	else
		return [true, ""];
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	if (nameQualifier != "") {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

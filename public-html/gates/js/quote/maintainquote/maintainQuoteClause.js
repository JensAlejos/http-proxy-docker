var validateInstr = false;
var tempStandardClauseCode = "";
var _isQuoteClauseChanged;
var isAnyChangesToQuoteClause = false;

$(document).ready(function() {	
	var quoteStatus =  $("#quoteStatusCD").val();
	$(window).load(function() {		
		if(quoteStatus == "ISSD" || quoteStatus == "BKGD"){
			$("#addClauseDiv").gatesDisable();			
		}	
	});
	
	$(window).load(function() {
            if(quoteStatus != "ISSD" && quoteStatus != "BKGD") {
		if($('#text').val()=="") {
			$("#standard").attr("checked", true);
			$("#clauseTypeCode").val("S");
			$("#custom").val("");
			$("#standard").val("S");
			$("#standardClauseCode").attr("disabled", false);
			validateInstr = true;
			$("#custom").attr("disabled", false);
			$("#standard").attr("disabled", false);	
			$("#text").attr("readonly", true);
		} else {
			if($("#isEditable").val()) {			  
				  $("#text").attr("readonly", false);
				  $("#custom").attr("disabled", true);
				  $("#standard").attr("disabled", true);
			}
			else{ $("#text").attr("readonly", true);}
			if($("#standardClauseCode").val().trim()=="")
			{
				validateInstr = false;
			}
			else{
				validateInstr = true;
			}
			$("#standardClauseCode").attr("disabled", true);
		}
            }
            
            setQuoteTitleForClause($("#quoteNumberCD").val(),$("#quoteVersionCD").val());
            enforceSecurityOnClause();

	});
	
	
	$("#quoteClauseForm").validationEngine('attach');
	var estDt=document.getElementById("shipmentDT").innerHTML;
	$('#standardClauseCode').gatesPopUpSearch({func:function() {standardClausePopupSearch(estDt);}});
	
	
	$('#standardClauseCode').gatesAutocomplete({		
		source:_context+'/cas/autocomplete.do',
		name: "Clause Code",
	 	extraParams: {
		 		 method: 'getBkStandardClause',
		 		 searchType: '217',
				parentSearch:  function() { 
	 			if($('#standard').attr("checked"))//case of Instruction
	 				return ("I//"+$.trim($('#shipmentDT').html()) ); 
	 			else
	 				return ("S//"+$.trim($('#shipmentDT').html()) ); //case of Standard Clause
	 			
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
			return data.Code + ' - ' + data.Usage;
		},
		formatResult: function(data) {
			return data.Code ;
		}, 
		select: function(data) {
			$('#standardClauseCode').val(data.Code);
			tempStandardClauseCode = $('#standardClauseCode').val();
			$('#text').val(data.FullClause);
			$('#standardClauseText').val(data.FullClause);
			$('#isInstructionForUpdate').val(false);
			validateInstr = true;
			if(data.is_editable == 'Y' || data.is_editable == 'y')
			{
				$('#isEditable').val(true);
				$("#text").attr("readonly", false);
			}
			else
			{
				$('#isEditable').val(false);
				$("#text").attr("readonly", true);
			}	
		} 
	});	

	$('#custom').change(function () {
		removeErrorPointers();
		$("#custom").val("C");
		$("#standard").val("");
		$("#standardClauseCode").val("");
		tempStandardClauseCode = $("#standardClauseCode").val(); 
		validateInstr = false;
		$("#standardClauseCode").attr("disabled", true);
		$("#text").val("");
		$('#standardClauseText').val("");
		$("#clauseSource").attr("value", "");
		$("#clauseSourceTypeCode").attr("value", "");
		$('#isEditable').val(false);
		$("#text").attr("readonly", false);
	});
	
	$("#standardClauseCode").change(function () {
		if(!($("#standardClauseCode").val() == tempStandardClauseCode)){
			$("#standardClauseCode").val("");
			tempStandardClauseCode =$("#standardClauseCode").val();
			$("#text").val("");
		}
	});
	
	$('#standard').change(function () {
		removeErrorPointers();		
		$("#custom").val("");
		$("#standard").val("S");
		validateInstr = true;
		$("#standardClauseCode").val("");
		tempStandardClauseCode = $("#standardClauseCode").val();
		$('#standardClauseText').val("");
		$("#text").val("");
		$("#text").attr("readonly", true);
		$('#isEditable').val(false);
		$("#standardClauseCode").removeAttr("disabled");
	});
	
	$('#stClauseType').change(function () {
		removeErrorPointers();		
		$("#custom").val("");
		$("#standard").val("I");
		validateInstr = true;
		$("#standardClauseCode").val("");
		tempStandardClauseCode = $("#standardClauseCode").val();
		$('#standardClauseText').val("");
		$("#text").val("");
		$("#text").attr("readonly", true);
		$('#isEditable').val(false);
		$("#standardClauseCode").removeAttr("disabled");
	});
	
	$('#qtClsSave').click(function() {
		isAnyChangesToQuoteClause = false;
		if(_isQuoteClauseChanged == undefined){
			var _isQuoteModified = $("#isQuoteModified").val();
			document.location.href = _context + '/quote/returnClause?isQuoteChanged='+_isQuoteModified;
		}else{
			document.location.href = _context + '/quote/returnClause?isQuoteChanged='+_isQuoteClauseChanged +'&isQuoteClauseChanged='+_isQuoteClauseChanged;
		}
	});	
	
	$('#clauseRoutingHeaderDiv').text($('#clauseRoutingHeader').val());
	
	//D025077: Maintain Quote: standard clause = Port
	$('#standardClauseCode').bind('keypress keydown keyup', function(e){
		if(e.keyCode == 13) { e.preventDefault(); }
	});
	
	$('#addClause').click(function() {
		isAnyChangesToQuoteClause = true;		
		if($("#standard").is(":checked")){
		$("#standardClauseCode").attr("disabled", false);
		}
		
		$("#custom").attr("disabled", false);
		$("#standard").attr("disabled", false);
		var queryString = $('#quoteClauseForm').formSerialize();
		if ($("#quoteClauseForm").validationEngine('validate'))
			//$('#quoteClauseForm').ajaxSubmit(options);
			$.ajax({
				type: "POST",
				url: _context +"/quote/clause/addQuoteClause",
				data: queryString,
				success: function(responseText){
					editAfterSaveClause();
					$("#quoteClauseForm").loadJSON(responseText.data);
					jQuery("#quoteClauseGrid").trigger('reloadGrid');
					showResponse(responseText);
				}
			});
		else
			return false;
	});
	
	$(window).bind('beforeunload', function(event){
		 if(isAnyChangesToQuoteClause) {
			 event.stopImmediatePropagation();
			 return 'You have unsaved changes!';
		 }
	});	
});

function validateInstruction(){
	if(validateInstr && $("#standardClauseCode").val().trim()=="") {
		$("#text").val("");
		$('#standardClauseText').val("");
		return "Instruction Code is mandatory for adding an instruction.";
	}
}

function removeErrorPointers() {
	$('#quoteClauseForm').validationEngine('hideAll');
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}

function standardClausePopupSearch(estShipDt) {
	var flag = "";
	if($('#standard').attr("checked")){
		flag = "I";
	}else{ 
		flag = "S";
	}
	var code = $('#standardClauseCode').val();
	var actionUrl =  _context + '/cas/stdClForQuoteLookup.do?flagType='+flag+'&shipDT='+estShipDt+'&code='+code;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'StandardClauseSearch', windowStyle);

	//In case Standard Clause Code is re-selected
	$('#standardClauseCode').val("");
	tempStandardClauseCode = $("#standardClauseCode").val();
	$('#text').val("");
	$('#standardClauseText').val("");
	$("#clauseSource").attr("value", "");
	$("#clauseSourceTypeCode").attr("value", "");
	$('#isEditable').val(false);
	$('#isInstructionForUpdate').val(false);
}

function standardClauseSearchUpdate(id) {
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
		var txt = values[i].split(",");
		if(actualCode != ""){
			actualCode = actualCode +", "+ txt[0];	
			if(clausesText != ""){
				clausesText = clausesText + linebreak + linebreak + txt[4];
				for(j=5;j<=txt.length;j++){
					if( txt[j]!=null &&  txt[j] != undefined && txt[j]!='null')
				clausesText = clausesText +", "+ txt[j];	
				}
			}else{
				clausesText= txt[4];
				for(j=5;j<=txt.length;j++){
					if( txt[j]!=null &&  txt[j] != undefined && txt[j]!='null')
						clausesText = clausesText + ", " + txt[j];
				}
			}
		}else{
			actualCode = txt[0];
			if(clausesText != ""){
				clausesText = clausesText + linebreak + linebreak + txt[4];
				for(j=5;j<=txt.length;j++){
					if( txt[j]!=null &&  txt[j] != undefined && txt[j]!='null')
				clausesText = clausesText +", "+ txt[j];
				}
			}else{
				clausesText= txt[4];
				for(j=5;j<=txt.length;j++){
					if( txt[j]!=null &&  txt[j] != undefined && txt[j]!='null')
						clausesText = clausesText +", "+ txt[j];
				}
			}
		}
		if(i == 0){
			if(txt[3] == 'Y' || txt[3] == 'y')
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

function enforceSecurityOnClause(){
	//Customer
	_enforceSecuritySection('addClauseDiv', 'addClauseDivMain', isClauseDisplayOnly,isClauseModifiable);
}

function _enforceSecuritySection(sectionId, sectionName, _displayOnly, _modifiableOnly){
	if(_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(_displayOnly && !_modifiableOnly){
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(!_displayOnly && !_modifiableOnly){
		hideSection(sectionName);
	}
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}

function editAfterSaveClause(){
	_isQuoteClauseChanged = true;
	if(!($("#standardClauseCode").val() == tempStandardClauseCode)){
		$("#standardClauseCode").val("");
		tempStandardClauseCode =$("#standardClauseCode").val();
		$("#text").val("");
	}
}

function disableSection(sectionId){
	$('#'+sectionId).gatesDisable();
}

function enableSection(sectionId){
	$('#'+sectionId).gatesEnable();
}
function hideSection(sectionName){
	$('#'+sectionName).hide();
}
function setQuoteTitleForClause(quoteNumber, quoteVersion){
	
	var quoteTitle = $('title').text().split("-");
	var finalTitle = quoteTitle[0];
	if(quoteNumber!=null && quoteNumber!=''){
		finalTitle = finalTitle+" - "+quoteNumber;
		//document.title = quoteTitle[0]+" - "+quoteNumber;
	}
	else{
		finalTitle = finalTitle;
	}
	
	if(quoteVersion!=null && quoteVersion!=''){
		finalTitle = finalTitle+" - "+quoteVersion;
		//document.title = quoteTitle[0]+" - "+quoteNumber;
	}
	else{
		finalTitle = finalTitle;
	}
	document.title = finalTitle;
}
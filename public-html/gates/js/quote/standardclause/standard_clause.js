/**
 * Javascript File for maintain Standard Clause
 */
var _isModeUpdate = false;
$(document).ready(function() {
	//Code changes for D026145 start
	if(!_readonly && !__isAddCls && !_isDelCls && !_isDelInstr && !_isAddInstr)
		$('#content').gatesDisable();
	if(!_isAddCls)
		{
		  $('#stdClsSave').css('visibility','hidden');
		}
	if(!_isDelCls)
		$('#stdClsDelete').css('visibility','hidden');
	if(!_isAddInstr)
		$('#stdInstrSave').css('visibility','hidden');
	if(!_isDelInstr)
		$('#stdInstrDelete').css('visibility','hidden');
	if($('#standardClauseCode').val()== "" || $('#standardClauseCode').val() == null )
	{	
		if(_isAddCls && !_isAddInstr)
	     {
			  $('#isPrintOnBill').attr('checked','true');
	          $('#isPrintOnBill').prop('disabled','disabled');
		  }
		else if(_isAddInstr && !_isAddCls)
		 {
		   $('#isPrintOnBill').prop('disabled','disbled');
		 }
	}
	//Code changes for D026145 end
	tabSequence('#standardClauseForm');
	
	$("#standardClauseForm").validationEngine('attach');
	
	
	if($('#clauseCode').val()!="") {
		$('#standardClauseCode').attr("readonly", true);
		_isModeUpdate = true;
	} 
	/*
	if(!_isDelete || $('#clauseCode').val()==""){
		$('#stdClsDelete').attr("disabled", true); 	
	}
	
	/*if($('#isAlwaysUseOnQuote').val()=="Y")
		$("#use").attr("checked", true);*/
	
	$('#standardClauseCode').change(function() {
		var code=$.trim($('#standardClauseCode').val());
		$('#standardClauseCode').val(code);
	});

	$('#standardText').change(function() {
		var text = $.trim($('#standardText').val());
		if(text.length > 1800)
			text = text.substring(0, 1799);
		$('#standardText').val(text);
	});
	
	$("#effectiveDate").datepicker({ dateFormat: 'mm-dd-yy' });
	/*$("#effectiveDate").datepicker({
		minDate : new Date()
	});
	$("#effectiveDate").datepicker("option", "minDate", new Date());*/

	$("#expirationDate").datepicker({ dateFormat: 'mm-dd-yy' });
	
	//Modified for Defect D026145
	$('#stdClsDelete').click(function() {
		// Detach the validation engine in case of deleting the standard clause
		$("#standardClauseForm").validationEngine('detach');
		if($('#isPrintOnBill').is(':checked'))
		{
			var r=confirm("Do you want to delete this Standard Clause?");
			if(r==true) {
				$("#standardClauseForm").attr("action", "deleteStandardClause");
				$("#standardClauseForm").submit();
			}
		}
		else
		 {
			alert("Not a Clause");
		 }
		
	});
	
	//Added for Defect D026145
	
	$('#stdInstrDelete').click(function(){
		
		$("#standardClauseForm").validationEngine('detach');
		if($('#isPrintOnBill').is(':checked'))
			{
			  alert("Not an Instruction");
			}
		else
		{
		var r=confirm("Do you want to delete this Standard Instruction?");
		if(r==true) {
			$("#standardClauseForm").attr("action", "deleteStandardClause");
			$("#standardClauseForm").submit();
		}
		}
		
	});
	
	$('#stdClsCancel').click(function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				document.location.href = _context + '/cas/standardClauseSearch.do?isRefresh=true';
			}
		} else {
			document.location.href = _context + '/cas/standardClauseSearch.do?isRefresh=true';
		}
	});
	
});	

function removeErrorPointers() {
	$('#standardClauseForm').validationEngine('hideAll');
}

function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen-1);
}

function validateEffectiveDate() {
	var date = $("#effectiveDate").val();
	var newDate = getFormattedDate(date);
	
	var valid = false;	
	if(isValidDate(newDate)) {
		valid = true;
	}    
		
	/*valid = checkdate(newDate);*/
	if(!valid) {
		$('#effectiveDate').val("");
		return 'Enter date in Format(MM-dd-yyyy)';
	}else{
		$('#effectiveDate').val(newDate);
	}
	if(!$("#standardClauseCode").attr("readonly") && effectiveDate!=null && effectiveDate!="") {
		var effectiveDate = $("#effectiveDate").datepicker("getDate");		
		var todaysDate = new Date();
		if(effectiveDate < todaysDate) {
			return 'Effective Date must be greater or equal to Today Date.';
		}	
	}
}

function validateExpirationDate() {
	
	var date = $("#expirationDate").val();
	var newDate = getFormattedDate(date);
	var valid = false;	
	if(isValidDate(newDate)) {
		valid = true;
	}    
	
    /*valid = checkdate(newDate);*/
	if(!valid) {
		$('#expirationDate').val("");
		return 'Enter date in Format(MM-dd-yyyy)';
	}else{
		$('#expirationDate').val(newDate);
	}
	
	var effectiveDate = $("#effectiveDate").datepicker("getDate");
	var expirationDate = $("#expirationDate").datepicker("getDate");
	if(expirationDate < effectiveDate) {
		return "Expiration Date must be greater or equal to Effective Date.";
	}
}

function getFormattedDate(date) {
	var dateSize = date.length;
	var newDate = date;
	var dt1 ;
	var mon1;
	var year1;
	
	if(dateSize == 6){
		dt1  = date.substring(2,4); 
		mon1 = date.substring(0,2);
		year1 = date.substring(4,6);
		newDate=mon1+"-"+dt1+"-20"+year1;
	} else if(dateSize == 8){
		dt1  = date.substring(2,4); 
		mon1 = date.substring(0,2);
		year1 = date.substring(4,8);
		newDate=mon1+"-"+dt1+"-"+year1;
	}
	return newDate;
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
	var len1 = date.length;
	if (matches == null) {
		if(len1<'8' && len1>'10') {
			return false;
		}
		if(len1=='8') {
			var dt1  = date.substring(2,4);
		    var mon1 = date.substring(0,2);
		    var mn = mon1-1;
		    var yr1  = date.substring(4,8);
			var composedDate = new Date(yr1, mn,dt1 );
			validDate = composedDate.getDate() == dt1 && 
				composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
			if(validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
				return newDate;
			} else {
				return null;
			}
		}
	} else {
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		validDate=composedDate.getDate() == d && 
			composedDate.getMonth() == m && composedDate.getFullYear() == y;
		if(validDate) {
			var newDate = matches[1] + "-" + d + "-" + y;
			return newDate;
		} else {
			return null;
		}
	}
}
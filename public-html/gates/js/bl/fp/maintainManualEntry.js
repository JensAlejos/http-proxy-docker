$(document).ready(function() {
	// attach validation engine with form
	$("#manualEntryForm").validationEngine('attach');	
	// on click of search button
	
	// to get the calendar on the fields
	$("#workDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
		
	$('#deleteMEntry').click(function()
	{		
		removeErrorPointers();	
	});
	
	$('#manualEntryLastDialog').dialog({
		autoOpen : false,
		width :400,
		modal : true,
		title: 'Manual Entries Last Maintainance',
		buttons:{
			'Close':function()
			{
				$("#manualEntryLastDialog").dialog('close');
			}
		}
	});
	
	$('#StatusDialog').click(function()
			{		
	
		$("#manualEntryLastDialog").dialog('open');
			});
			
	
	$('#workDate').change(function(){
		if($('#workDate').val()==""||$('#workDate').val()==null)
			$('#workDate').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
	});
	
	//enable disable of search button
	if($("#manualEntryNo").val()==0)
	{			
		$("#searchMEntry").attr("disabled", "disabled");
		$("#clearMEntry").attr("disabled", "disabled");
		$("#deleteMEntry").attr("disabled", "disabled");
		$("#glCorporationCode").val('100');
		$("#locationSegmentCode").val('000');
		$("#functionSegmentCode").val('000');
		$("#serviceSegmentCode").val('00');
	}
	else
		{/*$("#manualEntryNo").attr("disabled", "disabled");*/}
	
	$("#searchMEntry").click(function(){
		
		//to check only if numbers are entered
		if($("#manualEntryNo").val().match(/^\s*(\+|-)?\d+\s*$/))
		{			
			$("#searchMEntry").removeAttr("disabled");
			$("#clearMEntry").removeAttr("disabled");
			$("#deleteMEntry").removeAttr("disabled");
				searchManualEntry();
		}
		else{		
			$('#manualEntryNo').validationEngine('showPrompt', 'Numbers Only', 'error', 'topRight', true);
			$("#searchMEntry").attr("disabled", "disabled");
			$("#clearMEntry").attr("disabled", "disabled");
			$("#deleteMEntry").attr("disabled", "disabled");
			return false;
		}		
	});	
	
	$('#manualEntryNo').change(function(){
				$("#deleteMEntry").attr("disabled", "disabled");
				clearFields();
		if($("#manualEntryNo").val().match(/^\s*(\+|-)?\d+\s*$/))
		{			
			$("#searchMEntry").removeAttr("disabled");
			$("#clearMEntry").removeAttr("disabled");
		}
		else
			{
			$("#deleteMEntry").attr("disabled", "disabled");
			$('#manualEntryNo').validationEngine('showPrompt', 'Numbers Only', 'error', 'topRight', true);
			}
	});
	$('#manualEntryNo').live("keyup",function(){
		if($("#manualEntryNo").val()!=0)
		{			
			$("#searchMEntry").removeAttr("disabled");
			$("#clearMEntry").removeAttr("disabled");
		}
		else{
			clearFields();
		}
	 });
	
	 $('#paymentAmountString').ForceNumericOnly();
	 $('#paymentAmountString').blur(function(){
	     var rateAmt = stripCommas($(this).val());
	     if(isNumber(rateAmt)){
            var temp1 = formatDollar(parseFloat(rateAmt));
            $('#paymentAmountString').val(temp1);
	     }else{
	    	 if(rateAmt != "")
    		 {
	    		 $('#paymentAmountString').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		 return false;
    		 }
	     }

	 });
	 
	 $('#manualEntryForm input:text').change(function(){  somethingChanged = true; });
	 
	 
	 
	 $('#paymentAmountString').change(function(){
	     var rateAmt = stripCommas($(this).val());
	     if(isNumber(rateAmt)){
            var temp1 = formatDollar(parseFloat(rateAmt));
            $('#paymentAmountString').val(temp1);
	     }else{
	    	 if(rateAmt != "")
    		 {
	    		 $('#paymentAmountString').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		 return false;
    		 }
	     }

	 });
    /*Save rules- Inactive:
	1. If Status is  closed or GL posting date is present or both
	2. If the manual entry is not created on that date
	3. If any of the Details fields are missing
	Save rules : Active:
	1. If the Manual entry create date is same as the date of update.
	2. Not of above three rules.*/
	//to get server side current date
	var curDate =$("#currentDate").val();

	if(
			($("#manualEntryNo").val()=='' || $("#workDate").val()=='' || $("#vendor").val()==''
			  || $("#glCorporationCode").val()=='' || $("#apAccountCode").val()=='' 
			    	|| $("#locationSegmentCode").val()=='' || $("#functionSegmentCode").val()==''
			    		|| $("#paymentAmountString").val()=='' || $("#glSubLedgerAccountCode").val()=='') 
			    		      || 
			    		      ($("#status").val() =='CLOSED' ||  $("#glPostingDt").val()!='')
			    		         || 
			    		           (!($("#createDate").val()==curDate))	
		)		
		if($("#savedEntryCheck").val()=="N"||$("#savedEntryCheck").val()=="")
		{		
				$("#saveMEntry").attr("disabled", "disabled");
				$("#deleteMEntry").attr("disabled", "disabled");		
		}
		else
		{
			$("#saveMEntry").removeAttr("disabled");
			$("#deleteMEntry").removeAttr("disabled");
			$("#saveMEntry").val("Update");
		}
	else
	{		
		$("#saveMEntry").removeAttr("disabled");
		$("#deleteMEntry").removeAttr("disabled");
		$("#saveMEntry").val("Update");
	}
	if($("#manualEntryNo").val()=='')
	{
		$("#saveMEntry").removeAttr("disabled");
	}
			
	//applying active/inactive rules	
	if($("#createDate").val()!='' && $("#createDate").val()!=curDate)
	{		
		$("#workDate").attr("disabled","disabled");
		$("#vendor").attr("disabled","disabled");
		$("#description").attr("disabled","disabled");
		$("#glCorporationCode").attr("disabled","disabled");
		$("#apAccountCode").attr("disabled","disabled");
		$("#locationSegmentCode").attr("disabled","disabled");
		$("#functionSegmentCode").attr("disabled","disabled");
		$("#serviceSegmentCode").attr("disabled","disabled");
		$("#paymentAmountString").attr("disabled","disabled");
		$("#glSubLedgerAccountCode").attr("disabled","disabled");
		$("#shipmentNo").attr("disabled","disabled");
		$("#shipmentSequenceNo").attr("disabled","disabled");
		$("#containerNo").attr("disabled","disabled");		
	}
	else if ($("#createDate").val()==curDate &&  $("#status").val()=='CLOSED')
	{
		$("#workDate").attr("disabled","disabled");
		$("#vendor").attr("disabled","disabled");
		$("#description").attr("disabled","disabled");
		$("#glCorporationCode").attr("disabled","disabled");
		$("#apAccountCode").attr("disabled","disabled");
		$("#locationSegmentCode").attr("disabled","disabled");
		$("#functionSegmentCode").attr("disabled","disabled");
		$("#serviceSegmentCode").attr("disabled","disabled");
		$("#paymentAmountString").attr("disabled","disabled");
		$("#glSubLedgerAccountCode").attr("disabled","disabled");
		$("#shipmentNo").attr("disabled","disabled");
		$("#shipmentSequenceNo").attr("disabled","disabled");
		$("#containerNo").attr("disabled","disabled");		
	}
	else if($("#createDate").val()==curDate &&  $("#status").val()!='CLOSED')
	{		
		$("#workDate").removeAttr("disabled");
		$("#vendor").removeAttr("disabled");
		$("#description").removeAttr("disabled");
		$("#glCorporationCode").removeAttr("disabled");
		$("#apAccountCode").removeAttr("disabled");
		$("#locationSegmentCode").removeAttr("disabled");
		$("#functionSegmentCode").removeAttr("disabled");
		$("#serviceSegmentCode").removeAttr("disabled");
		$("#paymentAmountString").removeAttr("disabled");
		$("#glSubLedgerAccountCode").removeAttr("disabled");
		$("#shipmentNo").removeAttr("disabled");
		$("#shipmentSequenceNo").removeAttr("disabled");
		$("#containerNo").removeAttr("disabled");
	}
	
	
		
	//code for group name predictive
	$('#vendor').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 		 method: 'searchVendor',
		 		 		 searchType: '313',
		 		 	 },		 
		 formatItem: function(data) {					 	 
		 	return  data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
		 },
		 formatResult: function(data) {
		 		 return data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
		 },
		 select: function(data) {	 
		 	 $('#usingOrgnId').val(data.orgn_Id);
		 	 $('#vendorAddressRoleId').val(data.arol_Id); 		 	
		 	 $('#usingOrgnId').val(data.using_OrgnId);	
		 	 changeOrgn(false);
		 },
		 autoSelectFirst:true,						// code added for autoselect on tab out
			autoSelectCriteria:function(data){
			 if(data.carrierCode.toUpperCase()==$('#vendor').val().toUpperCase())
				 return true;
			 else if(data.orgn_code.toUpperCase()==$('#vendor').val().toUpperCase())
				 return true;
			 else 
				 return false;
		 }
		 
	});		
	//to activate predictive when page is re-loaded
	var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354&parentSearch='+ $('#shipmentNo').val();
	 $('#shipmentSequenceNo').gatesAutocomplete({
			source: url1,
			minLength: 3,
			formatItem: function(data) {
				return data.sequenceNo;
			},
			noMatchHandler : function() {				
				$('#shipmentSequenceNo').validationEngine('showPrompt', 'Shipment not found', 'error', true);
				$('#shipmentSequenceNo').val('');
			} ,
			formatResult: function(data) {							
				return data.sequenceNo;
				
			}, 
			select: function(data) {							
				$('#shipmentSequenceNo').val(data.sequenceNo);								
			}
	});
	
	
	//shipment no predictive search	
		
	 
	 /*
	  * Predictive of booking on shipment number as per BR11 mentioned in BR rules is added 
	  * --puneet hasija
	  */
	 $('#shipmentNo').gatesAutocomplete({
		 			source:_context+'/cas/autocomplete.do',
		 			name: "Booking Number",
		 			extraParams: {
		 			method: 'searchBKNumber',
		 			searchType: '230',
		 			parentSearch:  function() { return 'B'; }
		 			},
		 		minLength: 7,
		 		formatItem: function(data) {
		 					return data.shno;
		 				},
		 		formatResult: function(data) {
		 					return data.shno;
		 				}, 
		 		noMatchHandler : function() {				
		 								$('#shipmentNo').validationEngine('showPrompt', 'Shipment not found', 'error', true);
		 								$('#shipmentSequenceNo').val('');
		 								$('#shipmentNo').val('');
		 			} ,
		 		select: function(data) {
				$('#shipmentNo').val(data.shno);
				$('#hiddenSrcForPrdctv').val(data.source);
				$('#shipmentSequenceNo').attr('disabled', false);
				$('#shipmentSequenceNo').val('');
				//(shipment sequence no predictive search)
				//code to get filtered shipment sequence no for selected shipment No				
				 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354&parentSearch='+ $('#shipmentNo').val();
				 $('#shipmentSequenceNo').gatesAutocomplete({
						source: url1,
						minLength: 3,
						formatItem: function(data) {
							return data.sequenceNo;
						},
						noMatchHandler : function() {				
							$('#shipmentSequenceNo').validationEngine('showPrompt', 'Shipment not found', 'error', true);
							$('#shipmentSequenceNo').val('');
						} ,
						formatResult: function(data) {							
							return data.sequenceNo;
							
						}, 
						select: function(data) {							
							$('#shipmentSequenceNo').val(data.sequenceNo);								
						}
				});
			}
		});
	 $('#shipmentNo').keydown(function(){
		 if($('#shipmentNo').val().trim().length!=7) {
		 //$('#shipmentSequenceNo').attr('disabled', true);
		 $('#shipmentSequenceNo').val('');
		 $('#hiddenSrcForPrdctv').val('changed');
		 }
	 });
	 $('#shipmentNo').click(function(){			
		 removeErrorPointers();		 
	 });
	 
	 $('#vendor').change(function(){
		 changeOrgn(true);
		});
	
	 // on change of organization name field resetting the values
	 function changeOrgn(condition)
	 {
		 if(condition)
			{
			 $('#usingOrgnId').val('ALL');
			 $('#vendor').val('');
			}
		 
	 }
	$('#vendor').gatesPopUpSearch({func:function() {vendorPopupSearch()}});
	var args = {
			entityType: 'FPME',
			entityId: $('#manualEntryId').val(),
			commentId:  'commentId',
			displayCommentTypes: 'MEMO',
			commentTypesForGrid:'MEMO,SYS'
		};
	$("#comment_link").comments(args);
	
	/*shipment security*/
	enforceSecurityTitle(isManualEntryDisplay);
	enforceSecurityDivAndButtons('searchDiv', isManualEntryDisplay);
	enforceSecurityDivAndButtons('searchBtnDiv', isManualEntryDisplay);
	enforceSecurityDivAndButtons('informationDiv', isManualEntryDisplay);
	enforceSecurityDivAndButtons('detailDiv', isManualEntryDisplay);
	
	enforceSecurityDivAndButtons('deleteMEntry', isManualEntryDelete);
	enforceSecurityDivAndButtons('saveMEntry', isManualEntrySave);
	enforceSecurityDivAndButtons('addNewEntry', isManualEntryAdd);
	enforceSecurityDivAndButtons('cancelMEntry', isManualEntryDisplay);
	tabSequence('#manualEntryForm',false,false);
	
	
	var select = document.getElementById("glCorporationCode");
	for (var i = 0; i < select.options.length; i++) {
	    if (select.options[i].value == document.getElementById('glCorporationCodeHidden').value) {
		select.options[i].selected = true;
	    }
	}
});
//document ready function ends here

//Format numbers to two decimals with commas
function formatDollar(num) {
    negative = 1;
    if(num < 0){
      negative = -1;
      num = (-1)*num;
    }
    var p = num.toFixed(2).split(".");
    var chars = p[0].split("").reverse();
    var newstr = '';
    var count = 0;
    for (x in chars) {
        count++;
        //if(count%3 == 1 && count != 1) {
          //  newstr = chars[x] + ',' + newstr;
        //} else {
            newstr = chars[x] + newstr;
        //}
    }
    finalStr = newstr + "." + p[1];
    if(negative < 0){
         finalStr = "-"+finalStr;
    }
    return finalStr;
}
function isNumber(n) {
  if(n !=null && n !=' '){
    var index = n.indexOf(".");
    if(index >0){
          var lastdigits=n.substring(index+1,n.length);
          if( lastdigits !='' && lastdigits.length >2 ) return false;
    }
  }


  return !isNaN(parseFloat(n)) && isFinite(n);
}

function stripCommas(str) {
  if(str=='' || str== null) return '';
  return str.replace(/,/g, '');
}
// Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function () {
                    $(this).keydown(function (e) {
                        var key = (e.which) ? e.which : e.keyCode;
                        //alert(key+".."+e.ctrlKey);
                        if (!e.shiftKey && !e.altKey &&
                        // numbers
                            (key >= 48 && key <= 57) ||
                        // Numeric keypad
                            (key >= 96 && key <= 105) ||
                        // comma, period and minus, . on keypad
                           key == 190 || key == 188|| key == 189 || key == 109 || key == 110 ||
                        // Backspace and Tab and Enter
                           key == 8 || key == 9 || key == 13 ||
                        // Home and End
                           key == 35 || key == 36 ||
                        // left and right arrows
                           key == 37 || key == 39 ||
                        // Del and Ins
                           key == 46 || key == 45 ||
                         //  a , v to use with ctrl
                           (e.ctrlKey &&  key >= 65))
                            return true;

                        return false;
                    });

             });
};

function validate(){
    var secAmnt=$('#paymentAmountString').val();
     if(!isNumber(secAmnt)){
          return false;
      }

      return true;
}

function searchManualEntry() {
	
	$('#manualEntryNo').validationEngine('validate');
	var transactionType = 'E';
	var prefix = 'PHX';
	var manualEntryNo = document.getElementById('manualEntryNo').value;	
		
	document.location.href = _context
							+ '/fp/manualEntry/getManualEntry?transactionType='
							+ transactionType + '&prefix=' + prefix + '&manualEntryNo='
							+ manualEntryNo;
}

function cancelManualEntry()
{
	var confirmation = true;
	if(somethingChanged)
		confirmation = confirm("Changes have been made that have not been saved. Do you wish to continue?");
		
	if(confirmation){
		var manEntNo = document.getElementById('manualEntryNo').value;		
		var prefix = document.getElementById('prefixHidden').value;		
		if(($(document).getUrlParam("flag"))=='ME'){
			document.location.href = _context + '/cas/payableDetailSearch.do';
		}
		else{		
			document.location.href = _context + '/cas/payableDetailSearch.do?manualEntryPrefix='+prefix
			+'&manualEntryNo='+manEntNo+'&Mflag='+'LPME';
		}
	}
}

function vendorPopupSearch() {	
    var vendor = $('#vendor').val();
    var orgnId = $('#usingOrgnId').val();
	var actionUrl = _context+"/cas//vendorLookup.do?vendor="+vendor+"|orgnId="+orgnId;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'VendorSearch', windowStyle); 
}

function orgnSearchUpdateTo(id){	
	var values = id.split("|");	
	var orgnID=values[0];
	var code = values[1].split("-");
	orgnName = code[0];
	orgnCode = code[1];
	carrierCode = values[2];
	if(carrierCode=="null"||carrierCode==null){
		carrierCode="";
	}
	else
		{
		carrierCode="-"+carrierCode;
		}
	arolid = values[3];
	$('#usingOrgnId').val(orgnID);
	$('#vendor').val(values[1]+carrierCode); 
  	$('#vendorAddressRoleId').val(arolid);    	
}


function clearManualEntry()
{
	document.location.href = _context + '/fp/manualEntry/show';	
}

function saveManualEntry() {
	
	if($('#workDate').val()!='')
	{
		var validateResult=validatePage();
		if(!validateResult)
			{
			return false;
			}
		//check for proper date
		var re=validateDate($('#workDate').val());
		if(re=="false"||re==false)
		{
			$('#workDate').validationEngine('showPrompt', 'Work Date Not Valid', 'error', 'topRight', true);
			return false;
		}
		else if(re=="date_not_in_format"||re==null||re=="null")
		{
			$('#workDate').validationEngine('showPrompt', 'Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
			return false;
		}
		
		//checking for amount field value entered it should be in format [9,2]
		var amountCheck=false;
		var payAmount = $("#paymentAmountString").val().replace('-','');
		var values = payAmount.split(".");
		if(values[0]!=null)
		{
		var length2=0;
		var length1=values[0].length;
		if(values[1]!=null)
			{
			length2=values[1].length;
			}
		if((length1<=7&&length2<=2))
			{
			amountCheck=true;
			}
		else
			{
			$('#paymentAmountString').validationEngine('showPrompt', 'Amount Entered is not in valid format,Only 7 numbers before decimal and 2 numbers after decimal are allowed', 'error', 'topRight', true);
			return false;
			}
		}
		if(amountCheck)
		{
			$("#manualEntryForm").attr("action", "addUpdateManualEntry");
			$("#manualEntryForm").submit();
		}
	}
	else
	{
		$('#workDate').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		return false;
	}
	
	somethingChanged = false;
}
function validatePage()
{
	var result=true;
	if($('#vendor').val()=='')
	{
		$('#vendor').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}
	else if($('#apAccountCode').val()=='')
	{
		$('#apAccountCode').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}
	else if($('#locationSegmentCode').val()=='')
	{
		$('#locationSegmentCode').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}
	else if($('#functionSegmentCode').val()=='')
	{
		$('#functionSegmentCode').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}
	else if($('#paymentAmountString').val()=='')
	{
		$('#paymentAmountString').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}
	else if($('#glSubLedgerAccountCode').val()=='')
	{
		$('#glSubLedgerAccountCode').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
		result= false;
	}	
	return result;
}
function deleteManualEntry() {
	var answer = confirm("Please confirm request to delete this manual entry");
	if (answer){
		$("#manualEntryForm").attr("action", "deleteManualEntry");
		$("#manualEntryForm").submit();
	}
	else{
		return false;
	}
}

function removeErrorPointers() {	
	$("#manualEntryForm").validationEngine('hideAll');
}

function validateDate(dateControl) {
	
	var valid = isGoodDate(dateControl);
	if(valid==null||valid=="null")
		{
		return null;
		}
	if (valid) {
		var r=dateControl.split("-");
		var month=r[0];
		var day=r[1];
		var year=r[2];
		
		if(day>31)
			{
			return false;
			}
		if(month>12)
			{
			return false;
			}
		 if (day=="31" && (month=="4" || month =="6" || month=="9" ||
				 				  month=="11" || month=="04" || month=="06" ||
				 				  month=="09")) {
			 							return false;
		 				} 
		 else if (month=="2" || month=="02"){
			    	 
			    	//leap year
					  if(year % 4==0){
						  if(year%100==0&&year%400==0)
							 {
							  	if(day=="30" || day=="31"){
									 
								  return false;
							  }
							  else{
								  return true;
							  }
							 }
						  else
							  {
							  if(day=="30" || day=="31"||day=="29"){
									 
								  return false;
							  }
							  else{
								  return true;
							  }
							  }
						
					  } else{
					         if(day=="29"||day=="30"||day=="31"){
					        	 return false;
						         }
					         else{
						        	 return true;
					         	}
						  }
			     }else
			    	 {
			    	 	return true;
			    	 }
	} 
	else {
		var msg=date_not_in_format;
		return msg;
	}
	
	return valid;
}



function isGoodDate(dt){
    var a = dt.match(/\d{2}-\d{2}-\d{4}/);
    return a;
}

function clearFields()
{
	$("#searchMEntry").attr("disabled", "disabled");
	$("#clearMEntry").attr("disabled", "disabled");
	$("#deleteMEntry").attr("disabled", "disabled");
	$("#saveMEntry").val("Save");
	//setting default values while entry no is blank
	$("#status").val('');
	$("#glPostingDt").val('');
	$("#workDate").val('');
	$("#vendor").val('');
	$("#description").val('');
	$("#glCorporationCode").val('100');
	$("#apAccountCode").val('206100');
	$("#locationSegmentCode").val('000');
	$("#functionSegmentCode").val('000');
	$("#serviceSegmentCode").val('00');
	$("#paymentAmountString").val('');
	$("#glSubLedgerAccountCode").val('');
	$("#shipmentNo").val('');
	$("#shipmentSequenceNo").val('');
	$("#containerNo").val('');
	
}



var somethingChanged = false;
var derivedrate = false;

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
        if(count%3 == 1 && count != 1) {
            newstr = chars[x] + ',' + newstr;
        } else {
            newstr = chars[x] + newstr;
        }
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
                        //alert(key);
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
	
    var secAmnt=stripCommas($('#baseRateAmount').val());
    var secAmnt1=$('#rateAdjustmentAmount').val();
     if( !isNumber(secAmnt) ){
          return false;
      }

      return true;
}
function validate1(){
    
    var secAmnt1=stripCommas($('#rateAdjustmentAmount').val());
     if( secAmnt1 != "" && !isNumber(secAmnt1)){
          return false;
      }

      return true;
}

$(function() {
	$("#frtPayableRateForm").validationEngine('attach');
//	$("#isWholeDollar").attr("disabled","disabled");
	var frtPayableRateAmountId = $('#frtPayableRateAmountId').val();
	
if($('#showMessage').val() == "Y")
	{
	alert("Source Rate Deleted Successfully");
	}
if(_readonlyFreightRate){
	$('mainContent').gatesDisable();
}
	$('input').change(function() {
		somethingChanged = true;
		$("#saveFlag").val("Y");
		derivedrate = true;
	});
	$('textarea').change(function() {
		somethingChanged = true;
		$("#saveFlag").val("Y");
		derivedrate = true;
	});
	$('img').click(function() {

		somethingChanged = true;
		$("#saveFlag").val("Y");
		derivedrate = true;
	});
	$('select').change(function() {
		somethingChanged = true;
		$("#saveFlag").val("Y");
		derivedrate = true;
	});
	
	//Disabling of Next Button
	$('#rateAmntNxtBtn').attr("disabled","disabled");
	var disableNext=$('#disableNextButton').val();
	if(disableNext=='true'){
		 $('#rateAmntNxtBtn').attr("disabled","disabled");
	 }else{
		 $('#rateAmntNxtBtn').removeAttr("disabled");
	 }
	//end disable
	
	 var secAmnt=$('#baseRateAmount').val();
	 
	 if(isNumber(secAmnt)){
	        $('#baseRateAmount').val(formatDollar(parseFloat(secAmnt)));
	     }
	 
	 $('#baseRateAmount').ForceNumericOnly();
	 
	 $('#baseRateAmount').blur(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#baseRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
    		  $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
    		  //return false;
    		 }
	     }

	 });

	 $('#baseRateAmount').change(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#baseRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
    		  $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
    		  //return false;
    		 }
	     }

	 });
	// $('#baseRateAmount').val(trim(secAmnt));
	 /*if($('#baseRateAmount').val()!=null && $('#baseRateAmount').val()!='')
	 {
		var values = $('#baseRateAmount').val().split(",");
	 	$("#baseRateAmount").val($("#baseRateAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 }
	 $('#baseRateAmount').keypress (function(event){
		    var charCode = (event.which) ? event.which : event.keyCode;
		    if(charCode == 45 || charCode<=31 ||  charCode==46 || (charCode>=48 && charCode<=57))
		    {
		       var amount=$('#baseRateAmount').val();
		       var present=0;
		       var count=0;
		       var amtNeg="";

		       do
		       {
		       present=amount.indexOf(".",present);
		       if(present!=-1) {
		         count++;
		         present++;
		         }
		       }
		       while(present!=-1);
		       
		       if(charCode==45 && amount.indexOf('-')!=-1){
		    	   event.keyCode=0;
		           return false;
		       }
		       if(charCode==45 && amount.length>0 && amount.indexOf('-')!=-1){
		    	   event.keyCode=0;
		           return false;
		       }
		       if(charCode==45 && amount.length>0 && amount.indexOf('-')==-1){
		    	   return true;
		       }
		       if(amount.indexOf('-')==0 && amount.indexOf('-')!=-1){
		    	var amt=   amount.split("-");
		    	amtNeg=amt[0];
		    	amount=amt[1];
		       }
		       if(amount.length>7 && amount.length==8 && charCode!=46){
		    	   if(count==0){
					   event.keyCode=0;
		               return false;
		    	   }
		       }            if(count>=1 && charCode == 46){
		            event.keyCode=0;
		            return false;
		       }
		      if(count==1) {
		                var lastdigits=amount.substring(amount.indexOf(".")+1,amount.length);
		                var firstDigits=amount.substring(0,amount.indexOf(".")-1);
		                if(lastdigits.length>=2)
		                {
		                  //alert("Two decimal places only allowed");
		                  event.keyCode=0;
		                  return false;
		                  }
		               if(firstDigits.length>=8)
		                {
		                  //alert("Two decimal places only allowed");
		                  event.keyCode=0;
		                  return false;
		                  }
		               }
		        return true;
		    }
		    else{
		            event.keyCode=0;
		            //alert("Only Numbers with dot allowed !!");
		            return false;
		    }
	 });
*/	 /*$('#baseRateAmount').change(function(){
		 var finalAmt=$('#baseRateAmount').val();
		 if(isNaN(finalAmt)){
			 $('#baseRateAmount').val("");
			 return false;
		 }
		 else{
			 $("#baseRateAmount").val(parseFloat(finalAmt).toFixed(2));
		 }
	 });*/
	 
	 var secAmnt1=$('#rateAdjustmentAmount').val();
	 
	 if(isNumber(secAmnt1)){
	        $('#rateAdjustmentAmount').val(formatDollar(parseFloat(secAmnt1)));
	     }
	 
	 $('#rateAdjustmentAmount').ForceNumericOnly();
	 
	 $('#rateAdjustmentAmount').blur(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
	         var temp1 = formatDollar(parseFloat(tariffRateAmt));
	         $('#rateAdjustmentAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
    		  $('#rateAdjustmentAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
    		  return false;
    		 }
	     }
	     var lastdigits=$('#rateAdjustmentAmount').val().substring($('#rateAdjustmentAmount').val().indexOf(".")+1,$('#rateAdjustmentAmount').val().length);
	     var firstDigits=$('#rateAdjustmentAmount').val().substring(0,$('#rateAdjustmentAmount').val().indexOf("."));
	     var split2=$("#rateAdjustmentAmount").val().substring($('#rateAdjustmentAmount').val().indexOf("-")+1, $('#rateAdjustmentAmount').val().indexOf("."));
	     if(firstDigits.length == 0)
	    	 {
	    	 firstDigits = $('#rateAdjustmentAmount').val();
	    	 }
	    
	     if(firstDigits.length >3 && split2.length != 3)
	    	 {
	    	 	
	    	 $('#rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	   return false;
	    	 }
	     else if(split2.length == 3 )
    	 {
    	 $('#rateAdjustmentAmount').validationEngine('hideAll');
    	 return true;
    	 }
	     else
	    	 {
	    	 $('#rateAdjustmentAmount').validationEngine('hideAll');
	    	 return true;
	    	 }
	     
	 });
	 $('#rateAdjustmentAmount').bind("keydown", function(){
		 if(event.keyCode != 8 && event.keyCode != 46 && event.keyCode != 9 && event.keyCode != 37 && event.keyCode != 39){
			 
			 var precision = $('#rateAdjustmentAmount').val().indexOf(".");
			 var lastdigits= "";
			 var firstDigits = "";
			 if(precision!=-1){
				 lastdigits= $('#rateAdjustmentAmount').val().substring(precision+1,$('#rateAdjustmentAmount').val().length);
				 firstDigits=$('#rateAdjustmentAmount').val().substring(0,precision);
			 }
			 else{
				 firstDigits=$('#rateAdjustmentAmount').val();
			 }
		     var split2=firstDigits.substring(firstDigits.indexOf("-")+1);
		     if($('#rateAdjustmentAmount').length >=7){
		    	   return false;
		     }
		     else if(split2.length >=3){
		    	 if(event.keyCode != 190 && event.keyCode != 110 && event.keyCode != 189 && event.keyCode != 109 ){	
		    		 var caret = $('#rateAdjustmentAmount').val();
					 if(! caret>precision || lastdigits.length >=2){
						 
						 return false;
					 }	 		    	  
		    	 }
		    }
		 }  
	 });
	 
	/* $('#rateAdjustmentAmount').val(trim(secAmnt1));
	 if($('#rateAdjustmentAmount').val()!=null && $('#rateAdjustmentAmount').val()!='')
	 {
		var values = $('#rateAdjustmentAmount').val().split(",");
	 	$("#rateAdjustmentAmount").val($("#rateAdjustmentAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 }
	 $('#rateAdjustmentAmount').keypress(function(event) {
		    var charCode = (event.which) ? event.which : event.keyCode;
		    if(charCode == 45 || charCode<=31 ||  charCode==46 || (charCode>=48 && charCode<=57))
		    {
		       var amount=$('#rateAdjustmentAmount').val();
		       var present=0;
		       var count=0;
		       var amtNeg="";

		       do
		       {
		       present=amount.indexOf(".",present);
		       if(present!=-1) {
		         count++;
		         present++;
		         }
		       }
		       while(present!=-1);
		       
		       if(charCode==45 && amount.indexOf('-')!=-1){
		    	   event.keyCode=0;
		           return false;
		       }
		       if(charCode==45 && amount.length>0 && amount.indexOf('-')!=-1){
		    	   event.keyCode=0;
		           return false;
		       }
		       if(charCode==45 && amount.length>0 && amount.indexOf('-')==-1){
		    	   return true;
		       }
		       if(amount.indexOf('-')==0 && amount.indexOf('-')!=-1){
		    	var amt=   amount.split("-");
		    	amtNeg=amt[0];
		    	amount=amt[1];
		       }
		       if(amount.length>2 && amount.length==3 && charCode!=46){
		    	   if(count==0){
					   event.keyCode=0;
		               return false;
		    	   }
		       }            if(count>=1 && charCode == 46){
		            event.keyCode=0;
		            return false;
		       }
		      if(count==1) {
		                var lastdigits=amount.substring(amount.indexOf(".")+1,amount.length);
		                var firstDigits=amount.substring(0,amount.indexOf(".")-1);
		                if(lastdigits.length>=2)
		                {
		                  //alert("Two decimal places only allowed");
		                  event.keyCode=0;
		                  return false;
		                  }
		               if(firstDigits.length>=3)
		                {
		                  //alert("Two decimal places only allowed");
		                  event.keyCode=0;
		                  return false;
		                  }
		               }
		        return true;
		    }
		    else{
		            event.keyCode=0;
		            //alert("Only Numbers with dot allowed !!");
		            return false;
		    }
	 
		 
	 });
	$('#rateAdjustmentAmount').blur(function() {
		 var finalAmt=$('#rateAdjustmentAmount').val();
		 if(isNaN(finalAmt)){
			 $('#rateAdjustmentAmount').val("");
			 return false;
		 }
		 else{
			 $("#rateAdjustmentAmount").val(parseFloat(finalAmt).toFixed(2));
		 }
	});
	*/
	if($('#frtPayRateAmt').val()!=null && $('#frtPayRateAmt').val()!=''){
		//var values = $('#frtPayRateAmt').val().split(",");
	 	//$("#frtPayRateAmt").val($("#frtPayRateAmt").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
		 var secAmnt = stripCommas($('#frtPayRateAmt').val());
		 $("#hiddenFreightPay").val(parseFloat(secAmnt));
	 }
	 	 
	var rateId = $("#tariffRateDescriptionId").val();

	//$("#frtPayableRateForm").validationEngine('attach');
	$("#effectiveDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#expirationDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#preferencedate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	var newDate = $('#effectiveDate').val();	
	$("#effectiveDate").datepicker('setDate',$('#effectiveDate').val());
	
	// Set Pref date & eff date value from Session Var or Current Date.
	
	var _prefDate = $("#prefDateSessionVar").val();
	
	var err = document.getElementById('errorMsgDiv');
//	var frtPayableRateAmountId = $("#frtPayableRateAmountId").val();
	var effDate=$("#effectiveDate").val();
	// Set Pref date & eff date value from Session Var or Current Date.
	//$("#prefDateSessionVar").val()
	if (frtPayableRateAmountId == null || frtPayableRateAmountId == '') {
		if ( $("#prefDateSessionVar").val() != null &&  $("#prefDateSessionVar").val() != ''  && err == null) {
			$("#effectiveDate").datepicker('setDate',  $("#prefDateSessionVar").val());
			$("#preferencedate").datepicker('setDate',  $("#prefDateSessionVar").val());
			
		} else {
			if(err == null){
			if($("#effectiveDate").val() == ""){
				$("#effectiveDate").datepicker('setDate', new Date);
				$("#preferencedate").datepicker('setDate', $("#prefDateSessionVar").val());
			}
			else{
				$("#effectiveDate").datepicker('setDate', $("#effectiveDate").val());
				$("#preferencedate").datepicker('setDate', $("#prefDateSessionVar").val());
			}
			}
			else{
				$("#effectiveDate").datepicker('setDate', $("#effectiveDate").val());
				$("#preferencedate").datepicker('setDate', $("#prefDateSessionVar").val());
			}
		}
	}
	else{
		$("#effectiveDate").datepicker('setDate', effDate);
		$("#preferencedate").datepicker('setDate', $("#prefDateSessionVar").val());
	}
	

	// Rate Description Save function- Button onclick function
	/*
	 * $('#frtPayableRateSave').click(function(){ var carrierCode =
	 * $("#carrierCode").val(); var hiddenCarrierCode =
	 * $("#hiddenCarrierCode").val();
	 * 
	 * if((carrierCode!=null && carrierCode!='' && hiddenCarrierCode!=null &&
	 * hiddenCarrierCode!='') || ((carrierCode==null || carrierCode=='') &&
	 * (hiddenCarrierCode==null || hiddenCarrierCode==''))){
	 * $("#carrierCode").val($("#hiddenCarrierCode").val()); }
	 * 
	 * if($("#frtPayableRateForm").validationEngine('validate')){
	 * $("#frtPayableRateForm").attr("action", "addUpdateFrtPayableRate");
	 * $("#frtPayableRateForm").submit(); }else{ return false; } });
	 */
	$('#deleteDerivedRate').attr("disabled","disabled");
	var derivedSrceRateDescId=$('#derivedSrceRateDescId').val();
	if(derivedSrceRateDescId!=null && derivedSrceRateDescId!="")
		{
		$('#deleteDerivedRate').removeAttr("disabled");
		}

	if( $('#derivedSrceRate').is(':visible') )
	{
		somethingChanged = true;
		derivedrate = false;
		$("#exitFlag").val("Y");
	}
	$('#deleteDerivedRate').click(function() {
		var tariffRateDescriptionId = $('#tariffRateDescriptionId').val();
		var frtPayableRateAmountId = $('#frtPayableRateAmountId').val();
		var tariffRatePayableAmountId = $('#tariffRatePayableAmountId').val();
		var r = confirm("Are you sure you want to delete the derived rate!");
		if (r == true) {
			$.ajax({
	 			url : _context+'/tm/frtPayable/deleteDerivedFrtPayableRates',
	 			type : "POST",
	 			
	 			data : "derivedSrcePayableSeqno="+ tariffRatePayableAmountId +"&tariffRateDescriptionId="+tariffRateDescriptionId,
	 			success : function(responseText) {
		 				if (responseText.success == true) {
		 					document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+frtPayableRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&showMessage=Y&action=EXIT';
		 				}
	 				}
	 		});
		}
	});

	$('#cancel').click(
			function() {
				var newDollarVal=document.getElementById('isWholeDollar').checked;
				var someChange=$('#somethingChanged').val();
				var currentFuture = $('#isCurrentFuture').val(); 
				if (somethingChanged) {
					// alert($("#tariffRateDescriptionId").val());
					if($("#exitFlag").val()=='Y'){
						if(derivedrate){
							var r = confirm("All the unsaved Changes will be discarded!");
							if (r == true) {
								document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
							}
						}else{
								if($("#exit").val() == 'Y')
								{
									var r = confirm("All the unsaved Changes will be discarded!");
									if (r == true) {
										document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
									}
								}
							else{
								document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
							}
						}
					}
					else{
							var r = confirm("All the unsaved Changes will be discarded!");
							if (r == true) {
									document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
							}
						}
				}
				else {
					if(someChange=="true" || someChange==true){
						var r = confirm("All the unsaved Changes will be discarded!");
						if (r == true) {
							document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
						}
					}
					else{
						document.location.href = _context+ '/tm/traiffRate/showForm?rateDescId=' + rateId+'&action=EXIT'+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
					}
				}
			});

	// jQuery UI Dialog
	$('#dialog').dialog({
		autoOpen : false,
		width : 400,
		modal : true,
		resizable : false,
		buttons : {
			"Submit Form" : function() {
				saveFrtPayableRate();
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});

	$('#frtPayableRateSave').click(function(e) {
		var wholeFlag = $('#wholeFlag').val();
		if ($('#isDeletedDerivedRate').val()) {
			/*e.preventDefault();
			$('#dialog').dialog('open');*/
		} else {
			 saveFrtPayableRate();
//			if($("#saveFlag").val()=="Y" || wholeFlag=='true' || wholeFlag==true){
//			 saveFrtPayableRate();
//			}
//			else{
//				var addFreightPayableFlag = $('#addFreightPayableFlag').val();
//				if( addFreightPayableFlag!='Add' && (wholeFlag=='false' ||  wholeFlag==false || wholeFlag=='')){
//					 alert("No fields have changed. Cannot update");
//					}
//				else{
//						saveFrtPayableRate();
//					}
//			}
		}
	});
	
	$('#calc').click(function() {
		
		 //$("#rateAdjustmentAmount").val(parseFloat(finalAmt).toFixed(2));
			var wholeDollar=document.getElementById('isWholeDollar').checked;
			var adjustType = $("#rateAdjustmentUnitCode").val();
			var finalAmount=$("#baseRateAmount").val();
			var split2=$("#baseRateAmount").val().split(",");
			var finalAmount="";
			flag= validate();
			var flag1= validate1();
			for(var index=0;index<split2.length;index++) {
				finalAmount=finalAmount+split2[index];
			}
			$("#baseRateAmount").val(finalAmount);
			var baseRate = parseFloat($("#baseRateAmount").val());
			var finalAmount1=$("#rateAdjustmentAmount").val();
			var split1=$("#rateAdjustmentAmount").val().split(",");
			var finalAmount1="";
			for(var index=0;index<split1.length;index++) {
				finalAmount1=finalAmount1+split1[index];
			}
			$("#rateAdjustmentAmount").val(finalAmount1);
			var adjustAmount = parseFloat($("#rateAdjustmentAmount").val());
			var freightPay;		
			if(baseRate==null || baseRate==""|| isNaN(baseRate))
			{
				return false;
			}
			if((adjustType=='D' || adjustType=='P') && (adjustAmount=='0.00' || isNaN(adjustAmount)))
			{
				alert('If Adjustment Factor is blank, Adjustment Type must be None.  If Adjustment Factor is specified, Adjustment Type must be Dollar or Percentage');
					return false;

			}
			else if((adjustType!='D' && adjustType!='P') && (!isNaN(adjustAmount) && adjustAmount!='0.00'))
			{
				alert('If Adjustment Factor is blank, Adjustment Type must be None.  If Adjustment Factor is specified, Adjustment Type must be Dollar or Percentage');
				return false;
			}
			else{
				if(flag == true && flag1==true ){
				if (isNaN(baseRate)) {
					baseRate='0';
					freightPay = baseRate;
				} else {
					freightPay = baseRate;
				}
				if (isNaN(adjustAmount)) {
					adjustAmount = '';
				}

				if (adjustAmount != null && adjustAmount != '' && adjustAmount != undefined) {
					if (adjustType == 'D') {
						freightPay = baseRate + adjustAmount;
					} else if (adjustType == 'P') {
						freightPay = baseRate+ (baseRate * adjustAmount / 100);
					}
				}
				if(wholeDollar){
					var result=Math.round(freightPay);
					$("#hiddenFreightPay").val(parseFloat(Math.abs(result)).toFixed(2));
					$('#frtPayRateAmt').val(formatDollar(parseFloat(Math.abs(result))));
				}
				else{
					$("#hiddenFreightPay").val(parseFloat(Math.abs(freightPay)).toFixed(2));
					$("#frtPayRateAmt").val(formatDollar(parseFloat(Math.abs(freightPay))));
				}
				}
				else
					{
					if(flag == false)
						{
					 $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
					    return false;
						}
					if(flag1 == false)
					{
						$('#rateAdjustmentAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
				    return false;
					}
					}
			}
			var secAmnt=$('#baseRateAmount').val();
			if(isNumber(secAmnt)){
		        $('#baseRateAmount').val(formatDollar(parseFloat(secAmnt)));
		     }
			var secAmnt1=$('#rateAdjustmentAmount').val();
			if(isNumber(secAmnt1)){
		        $('#rateAdjustmentAmount').val(formatDollar(parseFloat(secAmnt1)));
		     }
			
			/*$("#baseRateAmount").val($("#baseRateAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
			$("#rateAdjustmentAmount").val($("#rateAdjustmentAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
			$("#frtPayRateAmt").val($("#frtPayRateAmt").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
			*/
			somethingChanged=true;
		});
	
	//Code to check that carrier code is changed from predictive or pop up
	var oldCarrierVal= $('#carrierCode').val();
	 $('#carrierCode').blur(function() { 
		 var newCarrierVal= $('#carrierCode').val();
		 
		 if(oldCarrierVal!=newCarrierVal)
			 {
			 somethingChanged = true; 
			 $("#saveFlag").val("Y");
			 derivedrate = true;
			 }
	        
	   });
	 
	$('#carrierCode').gatesPopUpSearch({
		func : function() {
			carrierPopupSearch()
		}
	});
		var frtPayEffectiveDatePers = 	$('#frtPayEffectiveDatePers').val();
		var frtPayExpirationDatePers = 	$('#frtPayExpirationDatePers').val();
		var baseRateAmountPers = 		$('#baseRateAmountPers').val();
		var rateAdjustmentAmountPers = 	$('#rateAdjustmentAmountPers').val();
		var rateAdjustmentUnitCodePers = $('#rateAdjustmentUnitCodePers').val();
		var frtPayRateAmtPers = 		$('#frtPayRateAmtPers').val();	
		if(frtPayEffectiveDatePers!=null && frtPayEffectiveDatePers!=""){
			if($("#effectiveDate").val() != frtPayEffectiveDatePers)
				{
				derivedrate = true;
				somethingChanged = true;
				}
			
			$("#effectiveDate").datepicker('setDate', frtPayEffectiveDatePers);
		}
		if(frtPayExpirationDatePers!=null && frtPayExpirationDatePers!=""){
			if($("#expirationDate").val() != frtPayExpirationDatePers)
			{
				derivedrate = true;
				somethingChanged = true;
			}
			
			
			$("#expirationDate").datepicker('setDate', frtPayExpirationDatePers);
		}
		if(baseRateAmountPers!=null && baseRateAmountPers!=""){
			var amount1 = stripCommas(baseRateAmountPers);
			var amount2 = stripCommas($("#baseRateAmount").val());
			if(amount1 != amount2)
			{
				derivedrate = true;
				somethingChanged = true;
			}
			$("#baseRateAmount").val(formatDollar(parseFloat(amount1)));
		}
		if(rateAdjustmentAmountPers!=null && rateAdjustmentAmountPers!=""){
			var amount1 = stripCommas(rateAdjustmentAmountPers);
			var amount2 = stripCommas($("#rateAdjustmentAmount").val());
			if(amount1 != amount2)
			{
				derivedrate = true;
				somethingChanged = true;
			}
			$("#rateAdjustmentAmount").val(formatDollar(parseFloat(amount1)));
		}
		if(frtPayRateAmtPers!=null && frtPayRateAmtPers!=""){
			var amount1 = stripCommas(frtPayRateAmtPers);
			var amount2 = stripCommas($("#frtPayRateAmt").val());
			if(amount1 != amount2)
			{
				derivedrate = true;
				somethingChanged = true;
			}
			$("#frtPayRateAmt").val(formatDollar(parseFloat(amount1)));
		}
		if(rateAdjustmentUnitCodePers!=null && rateAdjustmentUnitCodePers!=""){
			if($("#rateAdjustmentUnitCode").val() != rateAdjustmentUnitCodePers)
			{
				derivedrate = true;
				somethingChanged = true;
			}
			
			$("#rateAdjustmentUnitCode").val(rateAdjustmentUnitCodePers);
		}

	//tabSequence('#frtPayableRateForm');
		document.getElementById("effectiveDate").focus();

	initializeNumericFields();
});

function removeErrorPointers() {
	$('#frtPayableRateForm').validationEngine('hideAll');
}

function focusSet(event){
	document.getElementById("effectiveDate").focus();
	  
}

function focusSetBack(event){	
	if(event.which == 16){
		 document.getElementById("cancel").focus();
	}
	  
}

function derivedRate() {
	
	$('#isDeletedDerivedRate').val('false');
	var tariffRateDescriptionId = $('#tariffRateDescriptionId').val();
	var frtPayableRateAmountId = $('#frtPayableRateAmountId').val();
	var tariffRatePayableAmountId = $('#tariffRatePayableAmountId').val();
	
	var tariffgrpType = $('#grpType').val();
	var tariffgrpName = $('#grpName').val();
	var tariffsrc = $('#srcTariff').val();
	var tariffitemCode = $('#itemCode').val();
	var rateDescription = "";
	var effectiveDate = $('#effectiveDate').val();
	var expirationDate = $('#expirationDate').val();
	/*var baseRateAmount = $('#baseRateAmount').val();*/
	
	var split=$("#baseRateAmount").val().split(",");
	var finalAmount="";
	for(var index=0;index<split.length;index++) {
		finalAmount=finalAmount+split[index];
	}
	$("#baseRateAmount").val(finalAmount);
	var baseRateAmount=$('#baseRateAmount').val();
	
	
	/*var rateAdjustmentAmount = $('#rateAdjustmentAmount').val();*/
	var split1=$("#rateAdjustmentAmount").val().split(",");
	var finalAmount1="";
	for(var index=0;index<split1.length;index++) {
		finalAmount1=finalAmount1+split1[index];
	}
	$("#rateAdjustmentAmount").val(finalAmount1);
	var rateAdjustmentAmount=$('#rateAdjustmentAmount').val();
	
/*	var frtPayableRateAmount = $('#frtPayRateAmt').val();*/
	var split2=$("#frtPayRateAmt").val().split(",");
	var finalAmount2="";
	for(var index=0;index<split2.length;index++) {
		finalAmount2=finalAmount2+split2[index];
	}
	$("#frtPayRateAmt").val(finalAmount2);
	var frtPayableRateAmount=$('#frtPayRateAmt').val();
	
	var carrierCode = $('#hiddenCarrierCode').val();
	var addFreightPayableFlag = $('#addFreightPayableFlag').val();
	var disableNextButton = $('#disableNextButton').val();
	var derivedSeqNo = $('#derivedSrcePayableSeqno').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	
	var grpType = $('#grpType').val();
	var srcTariff = $('#srcTariff').val();
	var grpName = $('#grpName').val();
	var itemCode = $('#itemCode').val();
	var description = $('#description').val();
	var effectiveDateStr = $('#effectiveDateStr').val();
	var expirationDateStr = $('#expirationDateStr').val();
	var planEquipFunctionCode = $('#planEquipFunctionCode').val();
	var planEquipLengthFeet = $('#planEquipLengthFeet').val();
	var planEquipHeightCode = $('#planEquipHeightCode').val();
	var directionCode = $('#directionCode').val();
	var cityCode = $('#cityCode').val();
	
 		$.ajax({
 			url : _context+'/tm/derivedRate/validateDerivedRate',
 			type : "POST",
 			
 			data : "derivedSrcePayableSeqno="+ tariffRatePayableAmountId +"&tariffRateDescriptionId="+tariffRateDescriptionId,
 			success : function(responseText) {
	 				if (responseText.success == true) {
	 					alert("This rate/payable can't be derived as it is source for other rate/payable.");
	 					}else{
			 					if (carrierCode == null || carrierCode == '') {
			 						carrierCode = $('#carrierCode').val();
			 					}
			 					var rateAdjustmentUnitCode = $('#rateAdjustmentUnitCode').val();
			 					
			 					submiturl = _context + "/tm/derivedRate/showForm?";
			 					submitdata = "frtPayableRateAmountId=" + frtPayableRateAmountId
			 							+ "&tariffRateDescriptionId=" + tariffRateDescriptionId
			 							+ "&grpType=" + tariffgrpType.substring(0,3) + "&srcTariff=" + tariffsrc
			 							+ "&grpName=" + tariffgrpName + "&itemCode=" + tariffitemCode
			 							+ "&description=" + rateDescription + "&effectiveDate="
			 							+ effectiveDate + "&expirationDate="
			 							+ expirationDate + "&baseRateAmount=" + baseRateAmount
			 							+ "&rateAdjustmentAmount=" + rateAdjustmentAmount + "&carrierCode="
			 							+ carrierCode + "&rateAdjustmentUnitCode=" + rateAdjustmentUnitCode
			 							+ "&frtPayableRateAmount=" + frtPayableRateAmount + "&derivedSeqNo=" + derivedSeqNo
			 							+ "&rateIndicator=F&tariffRatePayableAmountId="+tariffRatePayableAmountId+"&addFreightPayableFlag="+addFreightPayableFlag+"&disableNextButton="+disableNextButton+"&somethingChanged="+somethingChanged+"&isCurrentFuture="+currentFuture
			 							+ "&srcGrpType=" + grpType + "&srcSrcTariff=" + srcTariff + "&srcGrpName=" + grpName + "&srcItemCode=" + itemCode
			 							+ "&srcDescription=" + description + "&srcEffectiveDateStr=" + effectiveDateStr + "&srcExpirationDateStr=" + expirationDateStr
			 							+ "&srcPlanEquipFunctionCode=" + planEquipFunctionCode + "&srcPlanEquipLengthFeet=" + planEquipLengthFeet
			 							+ "&srcPlanEquipHeightCode=" + planEquipHeightCode + "&srcDirectionCode=" + directionCode + "&srcCityCode=" + cityCode;
			 					document.location.href = submiturl + submitdata;
	 					}
 				}
 		});
}

function xcopyRate() {
	var rateId = $('#tariffRateDescriptionId').val();
	var screenName = $('#screenName').val();
	// var rateId = 5066;
	var frtPayableRateAmountId = $('#frtPayableRateAmountId').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if (frtPayableRateAmountId != null && frtPayableRateAmountId != "") {
		document.location.href = _context
				+ '/copyFrtPayableRate/showForm?tariffRateDescriptionId='
				+ rateId + '&frtPayableRateAmountId=' + frtPayableRateAmountId
				+ '&screenName=' + screenName+'&isCurrentFuture='+currentFuture;
	} else {
		alert('Please save the Frt payable rate to XCOPY');
	}
	// alert('tariffRateDescriptionId'+tariffRateDescriptionId);
	// $.ajax({
	// type: "GET",
	// url: _context +"/copyCustomerRate/validateRateDescriptionCustomerRates?",
	// data: "tariffRateDescriptionId="+ tariffRateDescriptionId,
	// success: function(msg){
	// /*if(msg=="NotValid"){
	// alert('Not a valid combination to add items.');
	// return;
	// }else{
	//
	// document.location.href = _context
	// +'/copyCustomerRate/showForm?tariffRateDescriptionId='+
	// tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId;
	//			
	// }*/
	//					   
	// if(msg=="valid"){
	// document.location.href = _context
	// +'/copyFrtPayableRate/showForm?tariffRateDescriptionId='+
	// tariffRateDescriptionId+'&frtPayableRateAmountId='+
	// frtPayableRateAmountId;
	// }else{
	//
	// alert(msg);
	// return;
	//			
	// }
	// }
	// });
}

function saveFrtPayableRate() {
	
	var frtPayableRateAmountId = $('#frtPayableRateAmountId').val();
	
		var wholeDollar=document.getElementById('isWholeDollar').checked;
		var adjustType = $("#rateAdjustmentUnitCode").val();
		
		var split=$("#baseRateAmount").val().split(",");
		var finalAmount="";
		for(var index=0;index<split.length;index++) {
			finalAmount=finalAmount+split[index];
		}
		$("#baseRateAmount").val(finalAmount);
		var baseRate = parseFloat($("#baseRateAmount").val());
		
		
		var split1=$("#rateAdjustmentAmount").val().split(",");
		var finalAmount1="";
		for(var index=0;index<split1.length;index++) {
			finalAmount1=finalAmount1+split1[index];
		}
		$("#rateAdjustmentAmount").val(finalAmount1);
		var adjustAmount = parseFloat($("#rateAdjustmentAmount").val());
		flag = validate();
		var flag1 = validate1();
		
		var split2=$("#frtPayRateAmt").val().split(",");
		var finalAmount2="";
		for(var index=0;index<split2.length;index++) {
			finalAmount2=finalAmount2+split2[index];
		}
		$("#frtPayRateAmt").val(finalAmount2);
		var frtPayRateAmount = parseFloat($("#frtPayRateAmt").val());
		
		var lastdigits=$('#rateAdjustmentAmount').val().substring($('#rateAdjustmentAmount').val().indexOf(".")+1,$('#rateAdjustmentAmount').val().length);
	    var firstDigits=$('#rateAdjustmentAmount').val().substring(0,$('#rateAdjustmentAmount').val().indexOf("."));
	    var split2=$("#rateAdjustmentAmount").val().substring($('#rateAdjustmentAmount').val().indexOf("-")+1, $('#rateAdjustmentAmount').val().indexOf("."));
	    if(firstDigits.length == 0)
	   	 {
	   	 firstDigits = $('#rateAdjustmentAmount').val();
	   	 }
	   
	    if(firstDigits.length >3 && split2.length != 3)
   	 		{
   	 	
	    	$('#rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
   	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
   	  		return false;
   	 		}
	    else if(split2.length == 3 )
	      {
			 $('#rateAdjustmentAmount').validationEngine('hideAll');
			// return true;
	      }
	    else
	    	{
	    	 $('#rateAdjustmentAmount').validationEngine('hideAll');
			// return true;
	    	}
	          
		var hiddenFreightPay=$("#hiddenFreightPay").val();

		var freightPay;						
		if (isNaN(baseRate)) {
			freightPay = '';
		} else {
			freightPay = baseRate;
		}
		if (isNaN(adjustAmount)) {
			adjustAmount = '';
		}

		if (adjustAmount != null && adjustAmount != '' && adjustAmount != undefined) {
			if (adjustType == 'D') {
				freightPay = baseRate + adjustAmount;
				
			} else if (adjustType == 'P') {
				freightPay = baseRate + (baseRate * adjustAmount / 100);
			}
			else{
				alert('Resulting Rate must be calculated first. Please press "Calc" to calculate the new Freight Pay rate or EXIT to discard.');
				return false;
			}
		}
		if((adjustType!='' && adjustType!=null) && (adjustAmount == null || adjustAmount == '' || adjustAmount == undefined)){
			alert('Resulting Rate must be calculated first. Please press "Calc" to calculate the new Freight Pay rate or EXIT to discard.');
			return false;
		}
		if(wholeDollar){
			var result=Math.round(freightPay);
			freightPay=parseFloat(result).toFixed(2);
		}
		else{
			freightPay=parseFloat(freightPay).toFixed(2);
		}
		
		freightPay = Math.abs(freightPay);
		if(freightPay<0){
			alert("The Freight Payable total must be greater then zero.");
			return false;
		}
		freightPay=parseFloat(freightPay).toFixed(2);
		hiddenFreightPay=parseFloat(hiddenFreightPay).toFixed(2);
		if(hiddenFreightPay!=freightPay)
		{	
			
		alert(' Resulting Rate must be calculated first. Please press "Calc" to calculate the new Freight Pay rate or EXIT to discard. ');
		return false;
		}		
		if (somethingChanged == true || $('#addFreightPayableFlag').val()=='Add' || ($('#wholeFlag').val()=='true') ){
		var carrierCode = $("#carrierCode").val();
		var hiddenCarrierCode = $("#hiddenCarrierCode").val();
		{	if ((carrierCode != null && carrierCode != '' && hiddenCarrierCode != null && hiddenCarrierCode != '')
				|| ((carrierCode == null || carrierCode == '') && (hiddenCarrierCode == null || hiddenCarrierCode == ''))) {
			$("#carrierCode").val($("#hiddenCarrierCode").val());
		}
	    }
		if(flag == true ||  flag1 == true){
			if ($("#frtPayableRateForm").validationEngine('validate')) {
				$("#frtPayableRateForm").attr("action", "addUpdateFrtPayableRate");
				$("#frtPayableRateForm").submit();
			} else {
				
				return false;
			}	
		 }else{
			 if(flag == false)
				{
			 $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
			    return false;
				}
			if(flag1 == false)
			{
				$('#rateAdjustmentAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    return false;
			}
		 }
		
	}
	else{
		 alert("No fields have changed. Cannot update");
		}
		initializeNumericFields();
	     
	}

function initializeNumericFields(){
	if(isNumber($("#baseRateAmount").val())){
        var temp = formatDollar(parseFloat($("#baseRateAmount").val()));
        $('#baseRateAmount').val(temp);
	}
	if(isNumber($("#rateAdjustmentAmount").val())){
	    var temp1 = formatDollar(parseFloat($("#rateAdjustmentAmount").val()));
	    $('#rateAdjustmentAmount').val(temp1);
     }
	if(isNumber($("#frtPayRateAmt").val())){
	    var temp2 = formatDollar(parseFloat($("#frtPayRateAmt").val()));
	    $('#frtPayRateAmt').val(temp2);
     }
}

function carrierPopupSearch() {
	var actionUrl = _context + "/carrier/lookup/showForm?carrierCode="
			+ $('#carrierCode').val();
	var grpType=$('#grpType').val();
	var frtPayableRateAmountId = $("#frtPayableRateAmountId").val();
	if(grpType!='RDV-REV DIV' && (frtPayableRateAmountId==null || frtPayableRateAmountId==""))
	{
		var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CarrierSearch', windowStyle);
	}
}
function carrierUpdate(id) {
	
	var carrierCode = id;
	var oldCarrierCode=  $('#carrierCode').val();

	 if(oldCarrierCode!=carrierCode)
		 {
		 somethingChanged = true; 
		 $("#saveFlag").val("Y");
		 derivedrate = true;
		 }
	$('#hiddenCarrierCode').val(carrierCode);
	$('#carrierCode').val(carrierCode);
}
function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		
		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}
		$('#'+msgDivId).html(messageContent);
		if(messageContent!='')
		{
			window.scrollTo(0, 0);
		}
  	}
}
//Next Functionality
function loadNextTariffItemDetails() {
	var rateAmntIds = "NEXT";
	var tariffRateDescriptionId = $('#tariffRateDescriptionId').val();
	if (somethingChanged) {
		if(derivedrate)
		{
			var r = confirm("All the unsaved Changes will be discarded!");
			if (r == true) {
				document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
			}
		}
		else
			{
				if($("#exit").val() == 'Y')
				{
					var r = confirm("All the unsaved Changes will be discarded!");
					if (r == true) {
						document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
					}
				}
				else
					{
					document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
				}
			}
	}
	else
	{
		document.location.href = _context+ '/tm/frtPayable/showForm?frtPayableRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
	}
}
function keypressAmnt(amnt,length,event){

    var charCode = (event.which) ? event.which : event.keyCode;
    if(charCode == 45 || charCode<=31 ||  charCode==46 || (charCode>=48 && charCode<=57))
    {
       var amount=amnt;
       var present=0;
       var count=0;
       var amtNeg="";

       do
       {
       present=amount.indexOf(".",present);
       if(present!=-1) {
         count++;
         present++;
         }
       }
       while(present!=-1);
       
       if(charCode==45 && amount.indexOf('-')!=-1){
    	   event.keyCode=0;
           return false;
       }
       if(charCode==45 && amount.length>0 && amount.indexOf('-')!=-1){
    	   event.keyCode=0;
           return false;
       }
       if(charCode==45 && amount.length>0 && amount.indexOf('-')==-1){
    	   return true;
       }
       if(amount.indexOf('-')==0 && amount.indexOf('-')!=-1){
    	var amt=   amount.split("-");
    	amtNeg=amt[0];
    	amount=amt[1];
       }
       if(amount.length>length-1 && amount.length==length && charCode!=46){
    	   if(count==0){
			   event.keyCode=0;
               return false;
    	   }
       }            if(count>=1 && charCode == 46){
            event.keyCode=0;
            return false;
       }
      if(count==1) {
                var lastdigits=amount.substring(amount.indexOf(".")+1,amount.length);
                var firstDigits=amount.substring(0,amount.indexOf(".")-1);
                if(lastdigits.length>=2)
                {
                  //alert("Two decimal places only allowed");
                  event.keyCode=0;
                  return false;
                  }
               if(firstDigits.length>=length)
                {
                  //alert("Two decimal places only allowed");
                  event.keyCode=0;
                  return false;
                  }
               }
        return true;
    }
    else{
            event.keyCode=0;
            //alert("Only Numbers with dot allowed !!");
            return false;
    }

}

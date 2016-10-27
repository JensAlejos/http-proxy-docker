var somethingChanged = false;
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
    /*var index = n.indexOf(".");
    if(index >0){
          var lastdigits=n.substring(index+1,n.length);
          if( lastdigits !='' && lastdigits.length >2 ) return false;
    }*/
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
    var secAmnt1=$('#newAdjustFactor').val();
     if(!isNumber(secAmnt)){
          return false;
      }

      return true;
}
function validate1(){
    var secAmnt=$('#baseRateAmount').val();
    var secAmnt1=stripCommas($('#newAdjustFactor').val());
     if(secAmnt1 != "" && !isNumber(secAmnt1)){
          return false;
      }

      return true;
}



$(function() {
//	$("#isWholeDollar").attr("disabled","disabled");
	$('input').change(function() {
		somethingChanged = true;
	});
	$('textarea').change(function() {
		somethingChanged = true;
	});
	$('img').click(function() {
		somethingChanged = true;
	});
	$('select').change(function() {
		somethingChanged = true;
	});
	 $('table').click(function() { 
	        somethingChanged = true; 
	   });
	 
	 $('#newFrtPayableRateAmount').change(function(){
		/* var amt = parseFloat(this.value);
         $(this).val(amt.toFixed(2));*/
         somethingChanged = true; 
         
	}); 
	 if($('#newFrtPayableRateAmount').val()!=null && $('#newFrtPayableRateAmount').val()!='')
	 {
		var values = $('#newFrtPayableRateAmount').val().split(",");
	 	$("#newFrtPayableRateAmount").val($("#newFrtPayableRateAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 }
	 var secAmnt=$('#baseRateAmount').val();
	 
	 if(isNumber(secAmnt)){
	        $('#baseRateAmount').val(formatDollar(parseFloat(secAmnt)));
	     }
	 $('#baseRateAmount').ForceNumericOnly();
	 
	 $('#baseRateAmount').blur(function(){
		 /*
		 var amt = decimalPlaces($('#baseRateAmount').val());
		 if(amt>2)
     		{
		     	$('#baseRateAmount').validationEngine('showPrompt', 'Must have 2 decimal places.', 'error', 'topRight', true);
		     	$('#baseRateAmount').val($('#baseRateAmount').val());
		     	return false;
     		}*/
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#baseRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  
	    		  $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	     }

	 });
	 
	 $('#baseRateAmount').change(function(){
		 /*
		 var amt = decimalPlaces($('#baseRateAmount').val());
		 if(amt>2)
     		{
		     	$('#baseRateAmount').validationEngine('showPrompt', 'Must have 2 decimal places.', 'error', 'topRight', true);
		     	$('#baseRateAmount').val($('#baseRateAmount').val());
		     	return false;
     		}
     	*/
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#baseRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  
	    		  $('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	     }

	 });
	
	
	 var secAmnt1=$('#newAdjustFactor').val();
	 
	 if(isNumber(secAmnt1)){
	        $('#newAdjustFactor').val(formatDollar(parseFloat(secAmnt1)));
	     }
	 
	 $('#newAdjustFactor').ForceNumericOnly();
	 
	 $('#newAdjustFactor').blur(function(){
		 /*var amt = decimalPlaces($('#newAdjustFactor').val());
		 if(amt>2)
     		{
		     	$('#newAdjustFactor').validationEngine('showPrompt', 'Must have 2 decimal places.', 'error', 'topRight', true);
		     	$('#newAdjustFactor').val($('#newAdjustFactor').val());
		     	return false;
     		}
     	*/
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#newAdjustFactor').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
	    		 $('#newAdjustFactor').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 
    		 }
	     }
	     /*
	     var lastdigits=$('#newAdjustFactor').val().substring($('#newAdjustFactor').val().indexOf(".")+1,$('#newAdjustFactor').val().length);
	     var firstDigits=$('#newAdjustFactor').val().substring(0,$('#newAdjustFactor').val().indexOf("."));
	     var split2=$("#newAdjustFactor").val().substring($('#newAdjustFactor').val().indexOf("-")+1, $('#newAdjustFactor').val().indexOf("."));
	     if(firstDigits.length == 0)
	    	 {
	    	 firstDigits = $('#newAdjustFactor').val();
	    	 }
	    
	     if(firstDigits.length >3 && split2.length != 3)
	    	 {
	    	 	
	    	 $('#newAdjustFactor').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	   return false;
	    	 }
	     else if(split2.length == 3 )
    	 {
    	 $('#newAdjustFactor').validationEngine('hideAll');
    	 return true;
    	 }
	     else
	    	 {
	    	 $('#newAdjustFactor').validationEngine('hideAll');
	    	 return true;
	    	 }
	    */
	     
	 });
	 $('#newAdjustFactor').change(function(){
		 /*
		  var amt = decimalPlaces($('#newAdjustFactor').val());
		 if(amt>2)
     		{
		     	$('#newAdjustFactor').validationEngine('showPrompt', 'Data entered is longer than parameter length allowed.', 'error', 'topRight', true);
		     	$('#newAdjustFactor').val($('#newAdjustFactor').val());
		     	return false;
     		}
     	*/
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
             var temp1 = formatDollar(parseFloat(tariffRateAmt));
             $('#newAdjustFactor').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
	    		 $('#newAdjustFactor').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 
    		 }
	     }
	     /*
	     var lastdigits=$('#newAdjustFactor').val().substring($('#newAdjustFactor').val().indexOf(".")+1,$('#newAdjustFactor').val().length);
	     var firstDigits=$('#newAdjustFactor').val().substring(0,$('#newAdjustFactor').val().indexOf("."));
	     var split2=$("#newAdjustFactor").val().substring($('#newAdjustFactor').val().indexOf("-")+1, $('#newAdjustFactor').val().indexOf("."));
	     if(firstDigits.length == 0)
	    	 {
	    	 firstDigits = $('#newAdjustFactor').val();
	    	 }
	    
	     if(firstDigits.length >3 && split2.length != 3)
	    	 {
	    	 	
	    	 $('#newAdjustFactor').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	   return false;
	    	 }
	     else if(split2.length == 3 )
    	 {
	    	 $('#newAdjustFactor').validationEngine('hideAll');
	    	 return true;
    	 }
	     else
	    	 {
	    	 $('#newAdjustFactor').validationEngine('hideAll');
	    	 return true;
	    	 }
	      */
	 });

	 $("#hiddenFreightPay").val(parseFloat($("#newFrtPayableRateAmount").val()));
		var tariffRateDescriptionId =  $('#tariffRateDescriptionId').val();
		var xCopiedRateId =  $('#xCopiedRateId').val();
	
		if((xCopiedRateId.value == null)||(xCopiedRateId.value == '')){
		var _pageMode='Add';
		}

	 	$("#copyFreightPayableRateForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		$("#effectiveDate").datepicker('setDate',$('#effectiveDate').val());		
			
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= $('#prefDateSessionVar').val();
		var newDate=$('#effectiveDate').val();
		var err = document.getElementById('errorMsgDiv');
		if(xCopiedRateId==null || xCopiedRateId=='')
		{
			if(_prefDate!=null && _prefDate!='' && err == null){
				$("#effectiveDate").datepicker('setDate',_prefDate);
				$("#preferencedate").datepicker('setDate',_prefDate);
			}else{
				if(err == null){
					$("#effectiveDate").datepicker('setDate', new Date());
					$("#preferencedate").datepicker('setDate',new Date());
				}
			}
		}
		else{
			$("#effectiveDate").datepicker('setDate', newDate);
			$("#preferencedate").datepicker('setDate', $("#prefDateSessionVar").val());
		}
		// Rate Description Save function- Button onclick function
		$('#xCopy').click(function(){
			var wholeFlag = $('#wholeFlag').val();
			if (somethingChanged == true || wholeFlag=='true' ||wholeFlag==true) 
			{
				var wholeDollar=document.getElementById('isWholeDollar').checked;
				var adjustType = $("#rateAdjustmentUnitCode").val();
				var baseratesplit=$("#baseRateAmount").val().split(",");
				var finalAmount="";
				for(var index=0;index<baseratesplit.length;index++) {
					finalAmount=finalAmount+baseratesplit[index];
				}
				$("#baseRateAmount").val(finalAmount);
				var baseRate = parseFloat($("#baseRateAmount").val());
				var flag = validate();
				var flag1 = validate();
				var split1=$("#newAdjustFactor").val().split(",");
				var finalAmount1="";
				for(var index=0;index<split1.length;index++) {
					finalAmount1=finalAmount1+split1[index];
				}
				$("#newAdjustFactor").val(finalAmount1);
				var adjustAmount = parseFloat($("#newAdjustFactor")
						.val());

				var hiddenFreightPay=parseFloat($("#hiddenFreightPay").val());
				
				var frtPayRateAmtsplit=$("#newFrtPayableRateAmount").val().split(",");
				var finalfrtPayRateAmtsplitAmt="";
				for(var index=0;index<frtPayRateAmtsplit.length;index++) {
					finalfrtPayRateAmtsplitAmt=finalfrtPayRateAmtsplitAmt+frtPayRateAmtsplit[index];
				}
				$("#newFrtPayableRateAmount").val(finalfrtPayRateAmtsplitAmt);
				
				var lastdigits=$('#newAdjustFactor').val().substring($('#newAdjustFactor').val().indexOf(".")+1,$('#newAdjustFactor').val().length);
			    var firstDigits=$('#newAdjustFactor').val().substring(0,$('#newAdjustFactor').val().indexOf("."));
			    var split2=$("#newAdjustFactor").val().substring($('#newAdjustFactor').val().indexOf("-")+1, $('#newAdjustFactor').val().indexOf("."));
			    if(firstDigits.length == 0)
			   	 {
			   	 firstDigits = $('#newAdjustFactor').val();
			   	 }
			   
			    if(firstDigits.length >3 && split2.length != 3)
		   	 		{
		   	 	
			    	$('#newAdjustFactor').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
		   	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
		   	  		return false;
		   	 		}
			    else if(split2.length == 3 )
			      {
					 $('#newAdjustFactor').validationEngine('hideAll');
					// return true;
			      }
			    else
			    	{
			    	 $('#newAdjustFactor').validationEngine('hideAll');
					// return true;
			    	}
			    
				
				
				var freightPay;						
				if (isNaN(baseRate)) {
					freightPay = '';
				} else {
					freightPay = baseRate;
				}
				if (isNaN(adjustAmount)) {
					adjustAmount = '';
				}

				if (adjustAmount != null && adjustAmount != ''
						&& adjustAmount != undefined) {
					if (adjustType == 'D') {
						freightPay = baseRate + adjustAmount;
						
					} else if (adjustType == 'P') {
						freightPay = baseRate
								+ (baseRate * adjustAmount / 100);
						
					}
					
				}
				if(wholeDollar)
				{
					var result=Math.round(freightPay);
					freightPay=parseFloat(result).toFixed(2);

				}
				else
				{
					freightPay=parseFloat(freightPay).toFixed(2);
				}
				freightPay=parseFloat(freightPay).toFixed(2);
				hiddenFreightPay=parseFloat(hiddenFreightPay).toFixed(2);
				
				if(hiddenFreightPay!=freightPay)
					{			
					alert('Resulting Rate must be calculated first. Please press "Calc" to calculate the new Freight Pay rate or EXIT to discard.');
							return false;
					}		
				
				var carrierCode = $("#carrierCode").val();
				var hiddenCarrierCode = $("#hiddenCarrierCode").val();
				{	if ((carrierCode != null && carrierCode != '' && hiddenCarrierCode != null && hiddenCarrierCode != '')
						|| ((carrierCode == null || carrierCode == '') && (hiddenCarrierCode == null || hiddenCarrierCode == ''))) {
					$("#carrierCode").val($("#hiddenCarrierCode").val());
				}
			    }
				if(flag == true || flag1==true){
				if ($("#copyFreightPayableRateForm").validationEngine('validate')) {
					$("#copyFreightPayableRateForm").attr("action", "copyFreightPayableRate");
					$("#copyFreightPayableRateForm").submit();
				} else {
					return false;
				}	
				}
				else
					{
						if(flag == false)
						{
							var amt = decimalPlaces($('#baseRateAmount').val());
							 if(amt>2)
					     		{
							     	$('#baseRateAmount').validationEngine('showPrompt', 'Must have 2 decimal places.', 'error', 'topRight', true);
							     	$('#baseRateAmount').val($('#baseRateAmount').val());
							     	return false;
					     		}
							 else
								 {
								 	$('#baseRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
								 	return false;
								 }
						}
						if(flag1 == false)
						{
							var amt = decimalPlaces($('#rateAdjustmentAmount').val());
							 if(amt>2)
					     		{
							     	$('#rateAdjustmentAmount').validationEngine('showPrompt', 'Must have 2 decimal places.', 'error', 'topRight', true);
							     	$('#rateAdjustmentAmount').val($('#rateAdjustmentAmount').val());
							     	return false;
					     		}
							 else
								 {
								 	$('#rateAdjustmentAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
								 	return false;
								 }
						}
					}
			
			}
			else{
					
				alert("No fields have changed. Cannot update");
			}
	    });

		$('#calc').click(function() {
			
			var adjustType = $("#rateAdjustmentUnitCode").val();
			var split2=$("#baseRateAmount").val().split(",");
			var finalAmount="";
			for(var index=0;index<split2.length;index++) {
				finalAmount=finalAmount+split2[index];
			}
			 
			$("#baseRateAmount").val(finalAmount);
			var baseRate = parseFloat($("#baseRateAmount").val());
			var flag= validate();
			var flag1= validate1();
			
			var finalAmount1=$("#newAdjustFactor").val();
			var split1=$("#newAdjustFactor").val().split(",");
			var finalAmount1="";
			for(var index=0;index<split1.length;index++) {
				finalAmount1=finalAmount1+split1[index];
			}
			 
			$("#newAdjustFactor").val(finalAmount1);
			var adjustAmount = parseFloat($("#newAdjustFactor").val());
			
			var wholeDollar=document.getElementById('isWholeDollar').checked;
			var freightPay;
			 somethingChanged = true; 
			 if(baseRate==null || baseRate==""|| isNaN(baseRate))
				{
				 $("#copyFreightPayableRateForm").validationEngine('validate');
				 $("#baseRateAmount").val("");
					return false;
				}
			 else if((adjustAmount == "" || isNaN(adjustAmount)) && (adjustType == 'D' || adjustType == 'P') )
				 {
				 	alert("If Adjustment Factor is blank, Adjustment Type must be None.  If Adjustment Factor is specified, Adjustment Type must be Dollar or Percentage");
				 	$("#newAdjustFactor").val("");
				 	return false;
				 }
			 else if((adjustAmount!= "" && !isNaN(adjustAmount)) && adjustType == "" )
				 {
				 	alert("If Adjustment Factor is blank, Adjustment Type must be None.  If Adjustment Factor is specified, Adjustment Type must be Dollar or Percentage");
				 	//$("#newAdjustFactor").val("");
				 	return false;
				 }
			 else if((adjustAmount == "" || isNaN(adjustAmount)) && adjustType=="" )
			 {
				 $("#newAdjustFactor").val("");
			 }
			 else if((adjustAmount == "" &&  adjustType == "") || (isNaN(adjustAmount) ))
			 {
			 	return true;
			 }
	
				
			 if($("#copyFreightPayableRateForm").validationEngine('validate')){
				 if(flag == true && flag1==true){
				 
				 if(adjustType=='D'){
						freightPay = baseRate + adjustAmount;
					}
					else if(adjustType=='P'){
						freightPay = baseRate + (baseRate  * adjustAmount/100);
						
					}
					else
					{
						if(isNaN(adjustAmount))
							adjustAmount=0.00;
							freightPay = baseRate + adjustAmount;
					}
				 	
				 if(wholeDollar){
						var result=Math.round(freightPay);
						$("#hiddenFreightPay").val(parseFloat(Math.abs(result)).toFixed(2));
						$('#newFrtPayableRateAmount').val(parseFloat(Math.abs(result)).toFixed(2));
					}
					else{
						$("#hiddenFreightPay").val(parseFloat(Math.abs(freightPay)).toFixed(2));
						$("#newFrtPayableRateAmount").val(parseFloat(Math.abs(freightPay)).toFixed(2));
					}
				 	
					
					
					var secAmnt=$('#baseRateAmount').val();
					if(isNumber(secAmnt)){
				        $('#baseRateAmount').val(formatDollar(parseFloat(secAmnt)));
				     }
					var secAmnt1=$('#newAdjustFactor').val();
					if(isNumber(secAmnt1)){
				        $('#newAdjustFactor').val(formatDollar(parseFloat(secAmnt1)));
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
		    	}else{
		    		
		    		
		    		return false;
		    	}
		
			
		}
	);
		
		//Code to check that carrier code is changed from predictive or pop up
		var oldCarrierVal= $('#carrierCode').val();
		 $('#carrierCode').blur(function() { 
			 var newCarrierVal= $('#carrierCode').val();
			 
			 if(oldCarrierVal!=newCarrierVal)
				 {
				 somethingChanged = true; 
				 }
		   });
 });
function decimalPlaces(n) {
	
	var count = 0;
	for (var ndx = n.indexOf('.')+1; ndx < n.length; ndx++){
	   count++;	
	}
	return count;

}
function cancel() {
	var screenName=$('#screenName').val();
	var newDollarVal=document.getElementById('isWholeDollar').checked;
	var tariffRateDescriptionId =  $('#tariffRateDescriptionId').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
		currentFuture='Y';
	}
	else{
		currentFuture='N';
	}
	
	if (somethingChanged) {
		 var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {
			if(screenName=='1'){
				document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ tariffRateDescriptionId+"&action=EXIT"+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
			}
			else if(screenName=='2'){
				document.location.href=_context+'/tm/frtPayable/showForm?actionPerformed=showForm&tariffRateDescriptionId='+tariffRateDescriptionId+'&frtPayableRateAmountIds='+$('#frtPayableRateAmountId').val()+'&action=EXIT&currentFuture='+currentFuture;
			}
			else
			{
				document.location.href = _context + '/cas/rateDesriptionSearch.do?'+'&exitfrom='+'exit';
			}
		}
	}
	else{
		if(screenName=='1'){
			document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ tariffRateDescriptionId+"&action=EXIT"+'&wholeflag='+newDollarVal+'&currentFuture='+currentFuture;
		}
		else if(screenName=='2'){
			document.location.href=_context+'/tm/frtPayable/showForm?actionPerformed=showForm&tariffRateDescriptionId='+tariffRateDescriptionId+'&frtPayableRateAmountIds='+$('#frtPayableRateAmountId').val()+'&action=EXIT&currentFuture='+currentFuture;
		}
		else
		{
			document.location.href = _context + '/cas/rateDesriptionSearch.do?'+'&exitfrom='+'exit';
		}
	}
}
	function removeErrorPointers(){
		   $('#copyFreightPayableRateForm').validationEngine('hideAll');
	}

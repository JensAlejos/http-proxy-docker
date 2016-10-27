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
    var secAmnt=$('#amount').val();
     if(!isNumber(secAmnt)){
          return false;
      }

      return true;
}
$(function() {
	$('input').change(function() {
		somethingChanged = true;
		$("#exitflag").val("N");
	});
	$('textarea').change(function() {
		somethingChanged = true;
		$("#exitflag").val("N");
	});
	$('img').click(function() {
		somethingChanged = true;
		$("#exitflag").val("N");
	});
	$('select').change(function() {
		somethingChanged = true;
		$("#exitflag").val("N");
	});
	 $('table').click(function() { 
	        somethingChanged = true; 
	        $("#exitflag").val("N");
	   });
	 
	 var secAmnt=$('#amount').val();
	  if(isNumber(secAmnt)){
	        $('#amount').val(formatDollar(parseFloat(secAmnt)));
	     }
	  
	  $('#amount').ForceNumericOnly();
		 $('#amount').blur(function(){
		     var tariffRateAmt = stripCommas($(this).val());
		     if(isNumber(tariffRateAmt)){
	            var temp1 = formatDollar(parseFloat(tariffRateAmt));
	            $('#amount').val(temp1);
		     }else{
		    	 if(tariffRateAmt != "")
	    		 {
		    		 $('#amount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    		 return false;
	    		 }
		     }

		 });
	 /*if($('#amount').val()!=null && $('#amount').val()!='')
	 {
		var values = $('#amount').val().split(",");
	 	$("#amount").val($("#amount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 	var tarRateAmt=$("#amount").val();
	 	
	 	$("#amount").val(tarRateAmt);
	 }*/
	
	/*$('#amount').blur(function() {
		    var secAmnt=$('#amount').val();
		    $('#amount').val(trim(secAmnt));
			var values = $('#amount').val().split(",");
		 	$("#amount").val($("#amount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
		 	if(isNaN(secAmnt)){
		 		 if(secAmnt.indexOf('-') != 0 && secAmnt.indexOf('-') != -1){
		 			
		 	//}
		//}
		// 	somethingChanged = true;
		 
	// });*/
	 var oldamount=parseFloat(document.copyCustomerRateForm.amount.value);
		
	if(_readonlyCustomerRate){
		$('#mainContent').gatesDisable();
	}
		var tariffRateDescriptionId =  $('#tariffRateDescriptionId').val();
		var tariffRateAmountId=$('#tariffRateAmountId').val();
		
		if((tariffRateAmountId.value == null)||(tariffRateAmountId.value == '')){
			var _pageMode='Add';
			}
	
	 	$("#copyCustomerRateForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= $('#prefDateSessionVar').val();
		    if($( "#effectiveDate" ).val()!=''){

		    }else
			if($("#prefDateSessionVar").val()!=null && $("#prefDateSessionVar").val()!='') {
				$("#effectiveDate").datepicker('setDate',$("#prefDateSessionVar").val());
				$("#preferencedate").datepicker('setDate',$("#prefDateSessionVar").val());
			}
			else{
					$("#effectiveDate").datepicker('setDate', new Date());
					$("#preferencedate").datepicker('setDate',new Date());
					//somethingChanged = true;
			}
		var err = document.getElementById('errorMsgDiv');
		if(err!=null)
		{
			/* var amt = parseFloat($('#amount').val());
			 $('#amount').val(amt.toFixed(2));*/
		}
		// Rate Description Save function- Button onclick function
		$('#xCopy').click(function(){
			if($("#copyCustomerRateForm").validationEngine('validate')){
				var split=$("#amount").val().split(",");
				var finalAmount="";
				for(var index=0;index<split.length;index++) {
					finalAmount=finalAmount+split[index];
				}
				$("#amount").val(finalAmount);
			
				flag = validate();
				if(flag == true){
					$("#customerRateForm").attr("action", "addUpdateCustomerRate");
					$("#customerRateForm").submit();
					$("#copyCustomerRateForm").attr("action", "copyCustRate");
		        	$("#copyCustomerRateForm").submit(); 
				}
				else
				{
					 $('#amount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    		 return false;
				}
	    	}else{
	    		return false;
	    	}
	    });

		tabSequence('#copyCustomerRateForm');
		
 });

function removeErrorPointers() {
	$('#copyCustomerRateForm').validationEngine('hideAll');
}
function cancel() {
	var screenName=$('#screenName').val();
	var tariffRateDescriptionId =  $('#tariffRateDescriptionId').val();
	var tariffRateAmountId=$('#tariffRateAmountId').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
		currentFuture='Y';
	}
	else{
		currentFuture='N';
	}
	//Fix for Defect # D013405
	if (somethingChanged) {
		if($("#exitflag").val()!='Y'){
			var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {
			if(screenName=='1')
			{
				document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ tariffRateDescriptionId+"&action=EXIT&currentFuture="+currentFuture;
			}
			else if(screenName=='2')
				{
				document.location.href = _context +'/tm/customerRate/showForm?tariffRateAmountIds='+tariffRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+"&exitFlag=Y&action=EXIT&currentFuture="+currentFuture;
				}
			else
				{
				document.location.href = _context + '/cas/rateDesriptionSearch.do?'+'&exitfrom='+'exit';
				}
			}
		}
		else
			{
			document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ tariffRateDescriptionId+"&action=EXIT&currentFuture="+currentFuture;
			 	
			}
	}
	else
		{
		if(screenName=='1')
		{
			document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='+ tariffRateDescriptionId+"&action=EXIT&currentFuture="+currentFuture;
		}
		else if(screenName=='2')
			{
			document.location.href = _context +'/tm/customerRate/showForm?tariffRateAmountIds='+tariffRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+"&exitFlag=Y&action=EXIT&currentFuture="+currentFuture;
			}
		else
			{
			document.location.href = _context + '/cas/rateDesriptionSearch.do?'+'&exitfrom='+'exit';
			}
		}
}
animatedcollapse.init()
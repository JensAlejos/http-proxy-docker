var somethingChanged = false;
var derivedrate = false;

// Format numbers to two decimals with commas
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
    var secAmnt=$('#tariffRateAmount').val();
     if(!isNumber(secAmnt)){
          return false;
      }

      return true;
}


$(function() {
	
	if(_readonlyCustomerRate){
		$('#content').gatesDisable();
	}
	if(!_derivedratedelete)
	{
		$('#deleteDerivedRate').css('visibility','hidden');
	}
     var secAmnt=$('#tariffRateAmount').val();
     if(isNumber(secAmnt)){
        $('#tariffRateAmount').val(formatDollar(parseFloat(secAmnt)));
     }

	 $('#tariffRateAmount').ForceNumericOnly();
	 $('#tariffRateAmount').blur(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#tariffRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
	    		 $('#tariffRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		 return false;
    		 }
	     }

	 });
	 $('#tariffRateAmount').change(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#tariffRateAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
    		 {
	    		 $('#tariffRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		 return false;
    		 }
	     }

	 });
	 //var secAmnt=$('#tariffRateAmount').val();
	 /*
	 $('#tariffRateAmount').val(trim(secAmnt));
	 if($('#tariffRateAmount').val()!=null && $('#tariffRateAmount').val()!='')
	 {
		var values = $('#tariffRateAmount').val().split(",");
	 	$("#tariffRateAmount").val($("#tariffRateAmount").val().replace(/[^\d\.\-]/g, '').replace(/(\.\d{2})[\W\w]+/g, '$1').split('').reverse().join('').replace(/(\d{3})/g, '$1,').split('').reverse().join('').replace(/^([\-]{0,1}),/, '$1').replace(/(\.\d)$/, '$1'+'0').replace(/\.$/, '.00'));
	 	var tarRateAmt=$("#tariffRateAmount").val();
	 	
	 	$("#tariffRateAmount").val(tarRateAmt);
	 }
	 $('#tariffRateAmount').keypress(function(event) {
         var charCode = (event.which) ? event.which : event.keyCode;
         if(charCode == 45 || charCode<=31 ||  charCode==46 || (charCode>=48 && charCode<=57))
         {
            var amount=this.value;
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
	$('#tariffRateAmount').change(function() {
		$('#tariffRateAmount').val(parseFloat($('#tariffRateAmount').val()).toFixed(2));
	 });
	 */
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

if($('#showMessage').val() == "Y")
{
alert("Source Rate Deleted Successfully");
}
//Disabling of Next Button
$('#rateAmntNxtBtn').attr("disabled","disabled");
var disableNext=$('#disableNextButton').val();
if(disableNext=='true' || disableNext==true){
	 $('#rateAmntNxtBtn').attr("disabled","disabled");
 }else{
	 $('#rateAmntNxtBtn').removeAttr("disabled");
 }
//end disable

$('#deleteDerivedRate').attr("disabled","disabled");
var derivedSrceRateDescId=$('#derivedSrceRateDescId').val();
if(derivedSrceRateDescId!=null && derivedSrceRateDescId!="") {
	$('#deleteDerivedRate').removeAttr("disabled");
	}
if( $('#derivedSrceRate').is(':visible') ) {
	somethingChanged = true;
	$("#exitFlag").val("Y");
	derivedrate = false;
}
	

 	$("#customerRateForm").validationEngine('attach');
	$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
	$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
	$( "#preferencedate" ).datepicker({dateFormat: 'mm-dd-yy'});
	//$("#effectiveDate").datepicker('setDate',$('#effectiveDate').val());
	var _prefDate = $("#prefDateSessionVar").val();		
	
	var tariffRateAmountId = $("#tariffRateAmountId").val();
	// Set Pref date & eff date value from Session Var or Current Date.
	if(tariffRateAmountId==null || tariffRateAmountId==''){
		if($("#prefDateSessionVar").val()!=null && $("#prefDateSessionVar").val()!='') {
			$("#effectiveDate").datepicker('setDate',$("#prefDateSessionVar").val());
			$("#preferencedate").datepicker('setDate',$("#prefDateSessionVar").val());
		}
		else{
				$("#effectiveDate").datepicker('setDate', new Date());
				$("#preferencedate").datepicker('setDate',new Date());
				somethingChanged = true;
				derivedrate = true;
		}
	}
	$('#deleteDerivedRate').click(function(){
		var tariffRateDescriptionId = $('#tariffRateDescriptionId').val();
		var tariffRateAmountId = $('#tariffRateAmountId').val();
		var r = confirm("Are you sure you want to delete the derived rate!");
		if (r == true) {
			$.ajax({
	 			url : _context+'/tm/customerRate/deleteDerivedCustPayableRates',
	 			type : "POST",
	 			
	 			data : "&tariffRateDescriptionId="+tariffRateAmountId,
	 			success : function(responseText) {
		 				if (responseText.success == true) {
		 					document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+tariffRateAmountId+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&showMessage=Y&action=EXIT';
		 			}
	 			}
	 		});
		}
    });
	var customerRateEffectiveDate=$('#customerRateEffectiveDate').val();
	var customerRateExpirationDate=$('#customerRateExpirationDate').val();
	if(customerRateEffectiveDate!=null && customerRateEffectiveDate!=""){
		if($("#effectiveDate").val() != customerRateEffectiveDate  )
		{
		somethingChanged = true;
		derivedrate = true;
		}
		$("#effectiveDate").datepicker('setDate', customerRateEffectiveDate);
	}
	if(customerRateExpirationDate!=null && customerRateExpirationDate!=""){
		if( $("#expirationDate").val() != customerRateExpirationDate )
		{
		somethingChanged = true;
		derivedrate = true;
		}
		$("#expirationDate").datepicker('setDate', customerRateExpirationDate);
	}
	
	var	rateAmout=$('#rateAmout').val();
	if(rateAmout!=null && rateAmout!=""){
		var rateAmout = stripCommas(rateAmout);
		var tariffRateAmt = stripCommas( $("#tariffRateAmount").val());
		if(tariffRateAmt != rateAmout )
			{
				somethingChanged = true;
				derivedrate = true;
			}
		
           var temp1 = formatDollar(parseFloat(rateAmout));
           $("#tariffRateAmount").val(temp1);
	}
	$('#cancel').click(function() {
		if(customerRateEffectiveDate!=null && customerRateEffectiveDate!=""){
			if($("#effectiveDate").val() != customerRateEffectiveDate  )
			{
			somethingChanged = true;
			derivedrate = true;
			}
			$("#effectiveDate").datepicker('setDate', customerRateEffectiveDate);
		}
		if(customerRateExpirationDate!=null && customerRateExpirationDate!=""){
			if( $("#expirationDate").val() != customerRateExpirationDate )
			{
			somethingChanged = true;
			derivedrate = true;
			}
			$("#expirationDate").datepicker('setDate', customerRateExpirationDate);
		}
		
		var	rateAmout=$('#rateAmout').val();
		if(rateAmout!=null && rateAmout!=""){
			var rateAmout = stripCommas(rateAmout);
			var tariffRateAmt = stripCommas( $("#tariffRateAmount").val());
			if(tariffRateAmt != rateAmout )
				{
					somethingChanged = true;
					derivedrate = true;
				}
			
	           var temp1 = formatDollar(parseFloat(rateAmout));
	           $("#tariffRateAmount").val(temp1);
		}
		//alert($("#tariffRateDescriptionId").val());
		var rateDescId=$("#tariffRateDescriptionId").val();
		var msg=$("#grpPk").val();
		var grpType=$("#grpTypeHidden").val();
		var grpCode=$("#grpName").val();
		var sourceCode=$("#srcTariff").val();
		var itemCode=$("#itemCode").val();
		var currentFuture = $('#isCurrentFuture').val(); 
		if(rateDescId==null || rateDescId==""){
		 rateDescId = "DUMMY-TGSI"+","+msg+","+grpType+","+grpCode+","+sourceCode+","+itemCode;
		}
		if (somethingChanged) {
			if($("#exitFlag").val()=='Y'){
				if(derivedrate)
					{
						var r = confirm("All the unsaved Changes will be discarded!");
						if (r == true) {
							document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+rateDescId+'&action=EXIT&currentFuture='+currentFuture;
						}
					}
				else
					{
					if($("#exit").val() == 'Y')
					{
						var r = confirm("All the unsaved Changes will be discarded!");
						if (r == true) {
							document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+rateDescId+'&action=EXIT&currentFuture='+currentFuture;
						}
					}
					else
						{
						 document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+rateDescId+'&action=EXIT&currentFuture='+currentFuture;
						}
					}
			}
			else
			{
					var r = confirm("All the unsaved Changes will be discarded!");
					if (r == true) {
				       document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+rateDescId+'&action=EXIT&currentFuture='+currentFuture;
					}
			}
		}
		else{
			document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+rateDescId+'&action=EXIT&currentFuture='+currentFuture;
		}
	});
    // jQuery UI Dialog    
$('#dialog').dialog({
    autoOpen: false,
    width: 400,
    modal: true,
    resizable: false,
    buttons: {
        "Submit Form": function() {
        	saveCustomerRate();
        },
        "Cancel": function() {
            $(this).dialog("close");
        }
    }
});

$('#customerRateSave').click(function(e){
	if($('#isDeletedDerivedRate').val()){
    	e.preventDefault();
    	$('#dialog').dialog('open');
	}
	else{
		if (somethingChanged == true) 
		{
			if($("#saveFlag").val()=="Y"){
				var split=$("#tariffRateAmount").val().split(",");
				var finalAmount="";
				for(var index=0;index<split.length;index++) {
					finalAmount=finalAmount+split[index];
				}
				$("#tariffRateAmount").val(finalAmount);
				flag = validate();
				if(flag == true){
                    $("#customerRateForm").attr("action", "addUpdateCustomerRate");
                    $("#customerRateForm").submit();
				 }else{
					 $('#tariffRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    		 return false;
				 }
			}else
				{
				alert("No fields have changed. Cannot update");
				}
	}else{
		alert("No fields have changed. Cannot update");
    	}
    }
  });

	
    //History		
 var historyArgs = {
		entityId: $('#tariffRateAmountId').val(),
		entity: 'com.matson.gates.tm.rate.domain.TariffRateAmount'
	};
/*	$("#history_link").history(historyArgs);*/
	tabSequence('#customerRateForm');
});
function removeErrorPointers(){
		   $('#customerRateForm').validationEngine('hideAll');
}
function derivedRate(){
	$('#isDeletedDerivedRate').val('false');
	var tariffRateDescriptionId=$('#tariffRateDescriptionId').val();
	var tariffRatePayableAmountId = $('#tariffRateAmountId').val();
	var tariffRateAmountId=$('#tariffRateAmountId').val();
	var tariffgrpType=$('#grpType').val();
	var tariffgrpName=$('#grpName').val();
	var tariffsrc=$('#srcTariff').val();
	var tariffitemCode=$('#itemCode').val();
	var rateDescription='';
	var effectiveDate=$('#effectiveDate').val();
	var expirationDate=$('#expirationDate').val();
	var derivedSeqNo = $('#derivedSrcePayableSeqno').val();
	var disableNextButton = $('#disableNextButton').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	
	var split=$("#tariffRateAmount").val().split(",");
	var finalAmount="";
	for(var index=0;index<split.length;index++) {
		finalAmount=finalAmount+split[index];
	}
	$("#tariffRateAmount").val(finalAmount);
	var tariffRateAmount=$('#tariffRateAmount').val();
	
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
	
	tariffgrpType.substring(0,3);
	$.ajax({
			url : _context+'/tm/derivedRate/validateDerivedRate',
			type : "POST",
			data : "derivedSrcePayableSeqno="+ "C" +"&tariffRateDescriptionId="+tariffRateDescriptionId,
			success : function(responseText) {
 				if (responseText.success == true) {
 					alert("This rate/payable can't be derived as it is source for other rate/payable.");
 				}
 				else{
 						submiturl=_context +"/tm/derivedRate/showForm?";
 						submitdata="tariffRateAmountId="+tariffRateAmountId+"&tariffRateDescriptionId="+tariffRateDescriptionId+"&grpType="+ tariffgrpType.substring(0,3)+"&srcTariff="+tariffsrc+"&grpName="+tariffgrpName+"&itemCode="+tariffitemCode+"&description="+rateDescription+"&effectiveDate="+effectiveDate+"&expirationDate="+expirationDate+"&tariffRateAmount="+tariffRateAmount+"&rateIndicator=C&disableNextButton="+disableNextButton+"&isCurrentFuture="+currentFuture
			 						+ "&srcGrpType=" + grpType + "&srcSrcTariff=" + srcTariff + "&srcGrpName=" + grpName + "&srcItemCode=" + itemCode 
			 						+ "&srcDescription=" + escape(description) + "&srcEffectiveDateStr=" + effectiveDateStr + "&srcExpirationDateStr=" + expirationDateStr
									+ "&srcPlanEquipFunctionCode=" + planEquipFunctionCode + "&srcPlanEquipLengthFeet=" + planEquipLengthFeet
									+ "&srcPlanEquipHeightCode=" + planEquipHeightCode + "&srcDirectionCode=" + directionCode + "&srcCityCode=" + cityCode;
 						document.location.href = submiturl+submitdata;	
 					}
			}
		});
}

function xcopyRate(){
	var tariffRateDescriptionId=$('#tariffRateDescriptionId').val();
	var tariffRateAmountId=$('#tariffRateAmountId').val();
	var screenName=$('#screenName').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
		currentFuture='Y';
	}
	else{
		currentFuture='N';
	}
		$.ajax({
			   type: "GET",
			   url: _context +"/copyCustomerRate/validateRateDescriptionCustomerRates?",
			   data: "tariffRateDescriptionId="+ tariffRateDescriptionId,
			   success: function(msg){
				   if(msg=="valid"){
					   document.location.href = _context +'/copyCustomerRate/showForm?tariffRateDescriptionId='+ tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId+'&screenName='+screenName+'&currentFuture='+currentFuture;
					}else{
						 alert(msg); 
						 return;
					}
			   }
		 });
}
function saveCustomerRate(){
		$("#customerRateForm").validationEngine('validate');
		 $(this).dialog("close");
		 $("#customerRateForm").attr("action", "addUpdateCustomerRate");
	    	$("#customerRateForm").submit(); 
}
//Next Functionality
function loadNextTariffItemDetails() {
	var rateAmntIds = "NEXT";
	var tariffRateDescriptionId = $('#tariffRateDescriptionId').val();
	if (somethingChanged) {
		if($("#exitFlag").val()=='Y'){
			if(derivedrate)
				{
					var r = confirm("All the unsaved Changes will be discarded!");
					if (r == true) {
						document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
					}
				}
			else
				{
					if($("#exit").val() == 'Y')
					{
						var r = confirm("All the unsaved Changes will be discarded!");
						if (r == true) {
							document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
						}
					
					}
					else
						{
						document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
						}
			}
		}
		else
			{
				var r = confirm("All the unsaved Changes will be discarded!");
				if (r == true) {
					document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
				}
			}
	}
	else
	{
		document.location.href = _context+ '/tm/customerRate/showForm?tariffRateAmountIds='+rateAmntIds+'&tariffRateDescriptionId='+tariffRateDescriptionId;
	}
}

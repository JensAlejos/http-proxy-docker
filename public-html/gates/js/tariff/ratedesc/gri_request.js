
var somethingChanged = false;
var isInputChange="";

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
   /* if(index >0){
          var lastdigits=n.substring(index+1,n.length);
          alert(lastdigits);
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
    var secAmnt=stripCommas($('#incrementAmount').val());
    var secAmnt1=$('#incrementAmount').val();
     if(!isNumber(secAmnt)){
          return false;
      }

      return true;
}
function validate1(){
    var secAmnt=$('#adjustmentFactor').val();
    var secAmnt1=stripCommas($('#adjustmentFactor').val());
     if(secAmnt1 != "" && !isNumber(secAmnt1)){
          return false;
      }

      return true;
}

$(document).ready(function() { 
	var dataName=null;
	var statusCode =$('#state').val();
	var tariffGriRequestId=$('#tariffGriRequestId').val();
	var grpTyp =  document.getElementById('tariffServiceGroupTypeCodeHidden');
	
	//Auto-Tabbing
	autoTab('equipmentOne1','equipmentOne2', 1);//1st box
    autoTab('equipmentOne2','equipmentOne3', 2);//2nd box
    autoTab('equipmentOne3','isEmpty', 1);
	
	if (grpTyp.value == '01') {
		document.getElementById('griGroupType').selectedIndex = '00';		
	}
	if (grpTyp.value == '02') {
		document.getElementById('griGroupType').selectedIndex = '01';
	}
	if (grpTyp.value == '03') {		
		document.getElementById('griGroupType').selectedIndex = '02';
	}
	if (grpTyp.value == '04') {
		document.getElementById('griGroupType').selectedIndex = '03';
	}
	if (grpTyp.value == '05') {
		document.getElementById('griGroupType').selectedIndex = '04';
	}
	if (grpTyp.value == '06') {
		document.getElementById('griGroupType').selectedIndex = '05';
	}
	if (grpTyp.value == '07') {
		document.getElementById('griGroupType').selectedIndex = '06';
	}
	disableadjust();
	disableFields();
	$('input').change(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else {
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
				 if( $(this).attr('id') != 'scheduleDate' && somethingChanged == true){
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
				 }
		    }
		 
	});
	$('checkbox').change(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
						 	$('#runGriRequest').attr("disabled","disabled");
						 	$('#executeGriRequest').attr("disabled","disabled");
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
					 somethingChanged = true; 
				 }
		    }
	});
	$('textarea').change(function() {

		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
						 	$('#runGriRequest').attr("disabled","disabled");
						 	$('#executeGriRequest').attr("disabled","disabled");
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
					 somethingChanged = true; 
				 }
		    }
	});
	$('img').click(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
						 	$('#runGriRequest').attr("disabled","disabled");
						 	$('#executeGriRequest').attr("disabled","disabled");
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
					 somethingChanged = true; 
				 }
		    }
	});
	/*
	$('select').change(function() {

		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	});
	*/
   $('#griGroupType').change(function() {

   		 if($(this).is(':disabled, [readonly]')) {

   		    }else{
   				 if((isInputChange==true || isInputChange=="true")){
   					 if(somethingChanged==true || somethingChanged=='true'){
   						 $('#runGriRequest').attr("disabled","disabled");
   						$('#executeGriRequest').attr("disabled","disabled");
   							somethingChanged=true;
   						}
   						else{
   							somethingChanged=false;
   						}
   				 }
   				 else{
   					$('#runGriRequest').attr("disabled","disabled");
   					$('#executeGriRequest').attr("disabled","disabled");
   					 somethingChanged = true;
   				 }
   		    }
   	});
   	 $('#cpFlag').change(function() {

       		 if($(this).is(':disabled, [readonly]')) {

       		    }else{
       				 if((isInputChange==true || isInputChange=="true")){
       					 if(somethingChanged==true || somethingChanged=='true'){
       						 $('#runGriRequest').attr("disabled","disabled");
       						$('#executeGriRequest').attr("disabled","disabled");
       							somethingChanged=true;
       						}
       						else{
       							somethingChanged=false;
       						}
       				 }
       				 else{
       					 
       					$('#runGriRequest').attr("disabled","disabled");
       					$('#executeGriRequest').attr("disabled","disabled");
       					 somethingChanged = true;
       				 }
       		    }
       		 
       	});
   	 $('#incrementType').change(function() {

       		 if($(this).is(':disabled, [readonly]')) {

       		    }else{
       				 if((isInputChange==true || isInputChange=="true")){
       					 if(somethingChanged==true || somethingChanged=='true'){
       						 	$('#runGriRequest').attr("disabled","disabled");
       						 $('#executeGriRequest').attr("disabled","disabled");
       							somethingChanged=true;
       						}
       						else{
       							somethingChanged=false;
       						}
       				 }
       				 else{
       					$('#runGriRequest').attr("disabled","disabled");
       					$('#executeGriRequest').attr("disabled","disabled");
       					 somethingChanged = true;
       				 }
       		    }
       	});
$('#adjustmentType').change(function() {

       		 if($(this).is(':disabled, [readonly]')) {

       		    }else{
       				 if((isInputChange==true || isInputChange=="true")){
       					 if(somethingChanged==true || somethingChanged=='true'){
       						 	$('#runGriRequest').attr("disabled","disabled");
       						 	$('#executeGriRequest').attr("disabled","disabled");
       							somethingChanged=true;
       						}
       						else{
       							somethingChanged=false;
       						}
       				 }
       				 else{
       					 $('#runGriRequest').attr("disabled","disabled");
       					$('#executeGriRequest').attr("disabled","disabled");
       					 somethingChanged = true;
       				 }
       		    }
       	});
	$('#moveGriRequestRateBasisesToLeft').click(function() {
    		 if($(this).is(':disabled, [readonly]')) {

    		    }else{
    				 if((isInputChange==true || isInputChange=="true")){
    					 if(somethingChanged==true || somethingChanged=='true'){
    						    $('#runGriRequest').attr("disabled","disabled");
    						    $('#executeGriRequest').attr("disabled","disabled");
    							somethingChanged=true;
    						}
    						else{
    							somethingChanged=false;
    						}
    				 }
    				 else{
    					 $('#runGriRequest').attr("disabled","disabled");
    					 $('#executeGriRequest').attr("disabled","disabled");
    					 somethingChanged = true;
    				 }
    		    }
    });
    $('#moveGriRequestRateBasisesToRight').click(function() {
        		 if($(this).is(':disabled, [readonly]')) {

        		    }else{
        				 if((isInputChange==true || isInputChange=="true")){
        					 if(somethingChanged==true || somethingChanged=='true'){
        						 	$('#runGriRequest').attr("disabled","disabled");
        						 	$('#executeGriRequest').attr("disabled","disabled");
        							somethingChanged=true;
        						}
        						else{
        							somethingChanged=false;
        						}
        				 }
        				 else{
        					 $('#runGriRequest').attr("disabled","disabled");
        					 $('#executeGriRequest').attr("disabled","disabled");
        					 somethingChanged = true;
        				 }
        		    }
    });
    $('#moveGriRequestEquipmentsToRight').click(function() {
            		 if($(this).is(':disabled, [readonly]')) {

            		    }else{
            				 if((isInputChange==true || isInputChange=="true")){
            					 if(somethingChanged==true || somethingChanged=='true'){
            						 	$('#runGriRequest').attr("disabled","disabled");
            						 	$('#executeGriRequest').attr("disabled","disabled");
            							somethingChanged=true;
            						}
            						else{
            							somethingChanged=false;
            						}
            				 }
            				 else{
            					 $('#runGriRequest').attr("disabled","disabled");
            					 $('#executeGriRequest').attr("disabled","disabled");
            					 somethingChanged = true;
            				 }
            		    }
        });
      $('#moveGriRequestEquipmentsToLeft').click(function() {
                  		 if($(this).is(':disabled, [readonly]')) {

                  		    }else{
                  				 if((isInputChange==true || isInputChange=="true")){
                  					 if(somethingChanged==true || somethingChanged=='true'){
                  						 	$('#runGriRequest').attr("disabled","disabled");	
                  						 	$('#executeGriRequest').attr("disabled","disabled");
                  							somethingChanged=true;
                  						}
                  						else{
                  							somethingChanged=false;
                  						}
                  				 }
                  				 else{
                  					 $('#runGriRequest').attr("disabled","disabled");
                  					$('#executeGriRequest').attr("disabled","disabled");
                  					 somethingChanged = true;
                  				 }
                  		    }
              });
	$('table').click(function() {
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
						 	$('#runGriRequest').attr("disabled","disabled");
						 	$('#executeGriRequest').attr("disabled","disabled");
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
					 somethingChanged = true; 
				 }
		    }
	});
	$('#griGroupType').change(function(){
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
						 	$('#runGriRequest').attr("disabled","disabled");
						 	$('#executeGriRequest').attr("disabled","disabled");
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 $('#runGriRequest').attr("disabled","disabled");
					 $('#executeGriRequest').attr("disabled","disabled");
					 somethingChanged = true; 
				 }
		    }
	});
	
 var secAmnt=$('#incrementAmount').val();
	 
	 if(isNumber(secAmnt)){
	        $('#incrementAmount').val(formatDollar(parseFloat(secAmnt)));
	     }
	 $('#incrementAmount').ForceNumericOnly();
	 
	 $('#incrementAmount').blur(function(){
		 var amt = decimalPlaces($('#incrementAmount').val());
		 var tariffRateAmt = stripCommas($(this).val());
		 if(amt>2)
     	{
	     	$('#incrementAmount').validationEngine('showPrompt', 'maximum of 2 decimal places are allowed', 'error', 'topRight', true);
	     	$('#incrementAmount').val($('#incrementAmount').val());
	     	return false;
     	}
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
           
            $('#incrementAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  $('#incrementAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	    	
	     }
	    
	     if(tariffRateAmt > 999.99 || tariffRateAmt< -999.99)
	     {
	    	 $('#incrementAmount').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
	           return false;
	     }
	     else
    	 {
	    	 $('#incrementAmount').validationEngine('hidePrompt');
    	    return true;
    	 }

	     

	 });
	 
	 $('#incrementAmount').change(function(){
		 var amt = decimalPlaces($('#incrementAmount').val());
		 var tariffRateAmt = stripCommas($(this).val());
		 if(amt>2)
	     	{
			     	$('#incrementAmount').validationEngine('showPrompt', 'maximum of 2 decimal places are allowed', 'error', 'topRight', true);
			     	$('#incrementAmount').val($('#incrementAmount').val());
			     	return false;
			 	   
	     	}
	     
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#incrementAmount').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  $('#incrementAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	     }
	    if(tariffRateAmt > 999.99 || tariffRateAmt< -999.99)
        	     {
        	    	 $('#incrementAmount').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
        	           return false;
        	     }
        	     else
            	 {
        	    	 $('#incrementAmount').validationEngine('hidePrompt');
            	    return true;
            	 }
	     

	 });
	 
	 
 var secAmnt1=$('#adjustmentFactor').val();
	 
	 if(isNumber(secAmnt1)){
	        $('#adjustmentFactor').val(formatDollar(parseFloat(secAmnt1)));
	     }
	 $('#adjustmentFactor').ForceNumericOnly();
	 
	 $('#adjustmentFactor').blur(function(){
		 var amt = decimalPlaces($('#adjustmentFactor').val());
		 if(amt>2)
			 {
			  $('#adjustmentFactor').validationEngine('showPrompt', 'maximum of 2 decimal places are allowed', 'error', 'topRight', true);
			  $('#adjustmentFactor').val($('#adjustmentFactor').val());
			  return false;
			 }
	     var tariffRateAmt = stripCommas($(this).val());
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#adjustmentFactor').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  $('#adjustmentFactor').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	     }
	      if(tariffRateAmt > 999.99 || tariffRateAmt< -999.99)
                  {
                      $('#adjustmentFactor').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
                        return false;
                  }
                  else
                  {
                      $('#adjustmentFactor').validationEngine('hidePrompt');
                     return true;
                  }
	     /*
	     var lastdigits=$('#adjustmentFactor').val().substring($('#adjustmentFactor').val().indexOf(".")+1,$('#adjustmentFactor').val().length);
	     var firstDigits=$('#adjustmentFactor').val().substring(0,$('#adjustmentFactor').val().indexOf("."));
	     var split2=$("#adjustmentFactor").val().substring($('#adjustmentFactor').val().indexOf("-")+1, $('#adjustmentFactor').val().indexOf("."));
	     if(firstDigits.length == 0)
	    	 {
	    	 firstDigits = $('#adjustmentFactor').val();
	    	 }
	    
	     if(firstDigits.length >3 && split2.length != 3)
	    	 {
	    	 	
	    	 $('#adjustmentFactor').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	//('##rateAdjustmentAmount').validationEngine('showPrompt', 'Input must match this pattern:-ZZ9.99 or ZZ9.99', 'error', 'topRight', true);
	    	   return false;
	    	 }
		     else if(split2.length == 3 )
	    	 {
		    	 $('#adjustmentFactor').validationEngine('hidePrompt');
		    	 return true;
	    	 }
	         else
	    	 {
	        	 $('#adjustmentFactor').validationEngine('hidePrompt');
		    	 return true;
	    	 }
	    	 */
	 });
	
	 
	 $('#adjustmentFactor').change(function(){
	     var tariffRateAmt = stripCommas($(this).val());
	     var amt = decimalPlaces($('#adjustmentFactor').val());
		 if(amt>2)
			 {
			  $('#adjustmentFactor').validationEngine('showPrompt', 'maximum of 2 decimal places are allowed', 'error', 'topRight', true);
			  $('#adjustmentFactor').val($('#adjustmentFactor').val());
			  return false;
			 }
	     if(isNumber(tariffRateAmt)){
            var temp1 = formatDollar(parseFloat(tariffRateAmt));
            $('#adjustmentFactor').val(temp1);
	     }else{
	    	 if(tariffRateAmt != "")
	    		 {
	    		  
	    		  $('#adjustmentFactor').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
	    		  return false;
	    		 }
	     }

          if(tariffRateAmt > 999.99 || tariffRateAmt< -999.99)
         {
             $('#adjustmentFactor').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
               return false;
         }
         else
         {
             $('#adjustmentFactor').validationEngine('hidePrompt');
            return true;
         }
	     
	 });
	 $('#adjustmentFactor').focus(function() {
		 
			 $('#adjustmentFactor').validationEngine('hidePrompt');
			 return true;
		});
	 $('#incrementAmount').focus(function() {
		 
		   $('#incrementAmount').validationEngine('hidePrompt');
		   $('#adjustmentFactor').validationEngine('hidePrompt');
		   return true;
	
	});
	
	var oldCarrierVal= $('#carrierCode').val();
	 $('#carrierCode').blur(function() { 
		 var newCarrierVal= $('#carrierCode').val();
		 if(oldCarrierVal!=newCarrierVal){
			 $('#runGriRequest').attr("disabled","disabled");
			 $('#executeGriRequest').attr("disabled","disabled");
			 somethingChanged = true; 
		}
		if(newCarrierVal == ''){
			$('#hiddenCarrierCode').val('');
		} 
	   });

	$('#carrierCode').gatesPopUpSearch({
		func : function() {
			carrierPopupSearch()
		}
	});
	
	// code to bind pop up search
	 $('#griGroupCode').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#griSourceCode').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	 
		  
	/* For Rate Basis */
$('#moveGriRequestRateBasisesToRight').click(function() {
		var realvalues = [];
		var textvalues = [];
		var destvalues = [];
		var destTextvalues = [];
		var realvals = [];
		var textvals = [];
		var toAppend = false;
		$('#griRequestRateBasises :selected').each(function(i, selected) {
		    realvalues[i] = $(selected).val();
		    textvalues[i] = $(selected).text();
		   	});
		var destList = document.getElementById("griRequestRateBasisesSelected");
		var sourceList = document.getElementById("griRequestRateBasises");
		if(destList.options.length==0){
			realvals=realvalues;
			textvals=textvalues;
			toAppend = true;
		}
		else{
			selectAll(getControl('griRequestRateBasisesSelected'));
			$('#griRequestRateBasisesSelected :selected').each(function(i, selected) {
				destvalues[i] = $(selected).val();
				destTextvalues[i] = $(selected).text();
			   	});
			jQuery.grep(realvalues, function(el) {
			    if (jQuery.inArray(el, destvalues) == -1) {
			    	realvals.push(el);
			    	toAppend = true;
			    }
			});
			jQuery.grep(textvalues, function(el) {
			    if (jQuery.inArray(el, destTextvalues) == -1) {
			    	textvals.push(el);
			    	toAppend = true;
			    }
			});
		}
		if(toAppend){
			$('#griRequestRateBasises :selected').each(function(i, selected) {
			$('#griRequestRateBasisesSelected')
		      .append($('<option>', { value : realvals[i] })
		      .text(textvals[i] )); 
		});
	}
		deselectAll(getControl('griRequestRateBasisesSelected'));
});


    $('#moveGriRequestRateBasisesToLeft').click(function() {
            $('#griRequestRateBasisesSelected :selected').remove();
    });

     $("#equipmentOne1").focus(function() {
     		  $('#equipmentOne1').validationEngine('hidePrompt');
                $('#equipmentOne2').validationEngine('hidePrompt');
                $('#equipmentOne3').validationEngine('hidePrompt');
     		   return true;

    	});
    	$("#equipmentOne2").focus(function() {
             		  $('#equipmentOne1').validationEngine('hidePrompt');
                        $('#equipmentOne2').validationEngine('hidePrompt');
                        $('#equipmentOne3').validationEngine('hidePrompt');
             		   return true;

          });
    $("#equipmentOne3").focus(function() {
                  $('#equipmentOne1').validationEngine('hidePrompt');
                    $('#equipmentOne2').validationEngine('hidePrompt');
                    $('#equipmentOne3').validationEngine('hidePrompt');
                   return true;

            });
    
    $("#equipmentOne1").blur(function() {
    	var equipTypeCode = $('#equipmentOne1').val();		
		if(/^[a-zA-Z]$/.test(equipTypeCode)){
			$('#equipmentOne1').val(equipTypeCode.toUpperCase());			
		}
	});
	$("#equipmentOne3").blur(function() {
		var equipHeight = $('#equipmentOne3').val();		
		if(/^[a-zA-Z]$/.test(equipHeight)){
			$('#equipmentOne3').val(equipHeight.toUpperCase());			
		}
      });
    
    
/* For equipment */
	$('#moveGriRequestEquipmentsToRight').click(function() {
		var isEquipmentValidationRequired=false;
		if($('#equipmentOne1').val().trim().length!=0 || $('#equipmentOne2').val().trim().length!=0) {
			if($('#equipmentOne1').val().trim().length==0) {
				$("#equipmentOne1").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
			else if($('#equipmentOne2').val().trim().length==0) {
				$("#equipmentOne2").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
			isEquipmentValidationRequired=true;
		}
		if($('#equipmentOne3').val().trim().length!=0) {
			if($('#equipmentOne3').val().trim().length==0 || $('#equipmentOne3').val().trim().length==0) {
				$("#equipmentOne3").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
		}
		if(isEquipmentValidationRequired) {
			$.ajax({
				type : "GET",
				url : _context+ "/tm/traiffRate/isEquipmentValid?",
				data : "planEquipFunctionCode="+ escape($("#equipmentOne1").val())+ "&planEquipLengthFeet="+ escape($("#equipmentOne2").val())+ "&planEquipHeightCode="+ escape($("#equipmentOne3").val()),
				success : function(responseText) {
					var data = responseText.data;
					var isValid=true;
					if(data=='false'){
						$("#equipmentOne1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
						isValid=false;
						return false;
					}
					else {
						var optionValue=$('#equipmentOne1').val().trim()+":"+$('#equipmentOne2').val().trim()+":"+$('#equipmentOne3').val().trim();
						var optionText=$('#equipmentOne1').val()+$('#equipmentOne2').val()+$('#equipmentOne3').val();
						
						var isAlreadyExisting=false;
						$("#griRequestEquipmentsSelected").children().map(function() {
							if(optionText==$(this).text()) {
								isAlreadyExisting=true;
							}
						}).get();
						
						if(!isAlreadyExisting) {
							$('#griRequestEquipmentsSelected').append($('<option selected value= '+ optionValue+'>').text(optionText));
							$('#equipmentOne1').val('');
							$('#equipmentOne2').val('');
							$('#equipmentOne3').val('');
						}
						var selectedValues=$('#griRequestEquipments').val();
						if(selectedValues!=null) {
							for(var index=0;index<selectedValues.length;index++) {
								
								isAlreadyExisting=false;
								optionText=$("#griRequestEquipments option[value="+selectedValues[index]+"]").text();
								$("#griRequestEquipmentsSelected").children().map(function() {
									if(optionText==$(this).text()) {
										isAlreadyExisting=true;
									}
								}).get();
								if(!isAlreadyExisting) {
									$("#griRequestEquipments").children().map(function() {
										if(selectedValues[index]==$(this).val()) {
											
												$('#griRequestEquipmentsSelected').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
												$("#griRequestEquipments option[value="+$(this).val()+"]").remove();
										}
									}).get();
								}
							}
						}
					} 
					
				}
			}); 
		}
		else {
			var selectedValues=$('#griRequestEquipments').val();
			if(selectedValues!=null) {
				for(var index=0;index<selectedValues.length;index++) {
					
					isAlreadyExisting=false;
					optionText=$("#griRequestEquipments option[value="+selectedValues[index]+"]").text();
					$("#griRequestEquipmentsSelected").children().map(function() {
						if(optionText==$(this).text()) {
							isAlreadyExisting=true;
						}
					}).get();
					if(!isAlreadyExisting) {
						$("#griRequestEquipments").children().map(function() {
							if(selectedValues[index]==$(this).val()) {
								
									$('#griRequestEquipmentsSelected').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
									$("#griRequestEquipments option[value="+$(this).val()+"]").remove();
								
								
							}
						}).get();
						}
				}
			}
		}
		SortSubscribeFields("griRequestEquipmentsSelected");
	
		
/*			var realvalues = [];
			var textvalues = [];
			var toAppend = false;
			$('#griRequestEquipments :selected').each(function(i, selected) {
			    realvalues[i] = $(selected).val();
			    textvalues[i] = $(selected).text();
			   	});
			var destList = document.getElementById("griRequestEquipmentsSelected");
			if(destList.options.length==0){
				toAppend = true;
			}
			for (var j=0;j<realvalues.length;j++) {
				for (var m=0;m<destList.options.length;m++) {	
					if(realvalues[j]==destList.options[m].value){
						alert(" Same Equipment Cannot be added twice ");
						return ;
					}
					else{
							toAppend = true;
					}
				}
			}
		if(toAppend){
			$('#griRequestEquipments :selected').each(function(i, selected) {
			$('#griRequestEquipmentsSelected')
		      .append($('<option>', { value : realvalues[i] })
		      .text(textvalues[i] )); 
			});
		}*/
	});
	
	$('#moveGriRequestEquipmentsToLeft').click(function() {
		$('#griRequestEquipmentsSelected :selected').remove();
	});
	
	$('#griRequestEquipments').dblclick(function() {
		$("#griRequestEquipments option:selected").prop("selected", false);
		
	});
	
	//$('#griRequestRateBasises').dblclick(function() {
		//$("#griRequestRateBasises option:selected").prop("selected", false);
		
	//});
	
	// code for source tariff predictive search		
	$('#griSourceCode').gatesAutocomplete({
		 source:_context+'/cas/autocomplete.do',
		 	extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 groupType:  function() { return $('#griGroupType').val(); }
		 	 },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 	dataName=data.name;
			 	$('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#griSourceCode').val(data.id);		
		 		$('#grpId').val(data.id);
		 }		 
	});	
	//Blurr the data for invalid group Id
	 $('#griSourceCode').change(function(){
		if($('#grpId').val()==null || $('#grpId').val()==""){
       	$("#griSourceCode").val("ALL"); 
       	$("#griGroupCode").val("ALL"); 
   	}
		else
		{
			$("#griSourceCode").val(dataName); 
	 		 if($('#griGroupType').val()=="01"){
	 			 $('#griGroupCode').val(dataName);
	 		 }
	 		$('#grpId').val("");
		}
   }); 
		
	//code for group name predictive
	$('#griGroupCode').gatesAutocomplete({
		 source:  _context+'/cas/autocomplete.do',
		 extraParams: {
 		 		 		 method: 'searchGroupName',
 		 		 		 searchType: '10',
 		 		 		 groupType:  function () { return $('#griGroupType').val(); },
 		 		 		 sourceTariff:  function () { return $('#griSourceCode').val(); }				 		 		 		 
		 		 	  },
		 formatItem: function(data) {
				 		 return data.name;
				 },
		formatResult: function(data) {
					 	dataName=data.name;
					 	$('#grpId').val(data.id);
				 		 return data.name;
				 },
		 select: function(data) {
		 		 $('#griGroupCode').val(data.id);		
		 		$('#grpId').val(data.id);
		 }		 
	});		
	//Blurr the data for invalid group Id
	 $('#griGroupCode').change(function(){
			if($('#grpId').val()==null || $('#grpId').val()==""){
	        	$("#in_group_code").val("ALL"); 
	    	}
			else{
				$("#in_group_code").val(dataName); 
				$('#grpId').val("");
			}
	    }); 	
	
	$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});


    $('#scheduleDate').attr("disabled","disabled");
    if(statusCode=='V'||statusCode=='R'){
        $('#scheduleDate').removeAttr("disabled");       
        //$( "#scheduleDate" ).datepicker({dateFormat: 'mm-dd-yy'});			
		$("#scheduleDate").datepicker({			
			dateFormat: 'mm-dd-yy', minDate: "+1D"
		});
		 document.getElementById("scheduleDate").readOnly = true;  
		 //$('scheduleDate').addClass("validate[required]");
    }


	$('#saveGriRequest').click(function(){
		 var grpTyp = document.getElementById('griGroupType').value;
		 var grpCode =document.getElementById('griGroupCode').value;
		 var sourceCode=document.getElementById('griSourceCode').value;
		 var amt = decimalPlaces($('#adjustmentFactor').val());
		 var tariffRateAmt = stripCommas($('#adjustmentFactor').val());
		 if(amt>2)
			 {
			  $('#adjustmentFactor').validationEngine('showPrompt', 'Data entered is longer than parameter length allowed.', 'error', 'topRight', true);
			  $('#adjustmentFactor').val($('#adjustmentFactor').val());
			  return false;
			 }
		 if(isNumber(tariffRateAmt)){
	            var temp1 = formatDollar(parseFloat(tariffRateAmt));
	           
	            $('#adjustmentFactor').val(temp1);
		     }else{
		    	 if(tariffRateAmt != "")
		    		 {
		    		  $('#adjustmentFactor').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    		  return false;
		    		 }
		    	
		     }
		    if(tariffRateAmt > 999.99 || tariffRateAmt< -999.99)
              {
                  $('#adjustmentFactor').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
                    return false;
              }
              else
              {
                  $('#adjustmentFactor').validationEngine('hidePrompt');
              }
		 
		     
		     var tariffRateAmt1 = stripCommas($('#incrementAmount').val());  
		 var amt1 = decimalPlaces($('#incrementAmount').val());
		 if(amt1>2)
			 {
			  $('#incrementAmount').validationEngine('showPrompt', 'Data entered is longer than parameter length allowed.', 'error', 'topRight', true);
			  $('#incrementAmount').val($('#incrementAmount').val());
			  return false;
			 }
		 else
			 {
			 $('#incrementAmount').validationEngine('hidePrompt');
     			
			 }
		 if(isNumber(tariffRateAmt1)){
	            var temp1 = formatDollar(parseFloat(tariffRateAmt1));
	           
	            $('#incrementAmount').val(temp1);
		     }else{
		    	 if(tariffRateAmt1 != "")
		    		 {
		    		  $('#incrementAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
		    		  return false;
		    		 }
		    	
		     }
		    if(tariffRateAmt1 > 999.99 || tariffRateAmt1< -999.99)
             {
                 $('#incrementAmount').validationEngine('showPrompt', 'Input must be within the range -999.99 to 999.99', 'error', 'topRight', true);
                   return false;
             }
             else
             {
                 $('#incrementAmount').validationEngine('hidePrompt');
             }

		if($("#griRequestProcessingForm").validationEngine('validate')){
			if(tariffGriRequestId==null || tariffGriRequestId==''){
				if(somethingChanged){
					save();
				}
				else {
					alert("No fields have changed. Cannot update");
					}
				}
			else{
					if(somethingChanged){
						save();
					}
					else {
						alert("No fields have changed. Cannot update");
					}
				}
			}
	 	else{
	 		return false;
	 	}
    });
	$('#runGriRequest').click(function(){
		 var grpTyp = document.getElementById('griGroupType').value;
		 var grpCode =document.getElementById('griGroupCode').value;
		 var sourceCode=document.getElementById('griSourceCode').value;
		 var tariffGriRequestId=$('#tariffGriRequestId').val();
		if($("#griRequestProcessingForm").validationEngine('validate')){
			submitAllSelect();
			
			$.ajax({
				url : _context+'/tm/griRequestProcessing/updateGriRequest',
				type : "POST",
				
				data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&tariffGriRequestId="+ tariffGriRequestId,
				success : function(responseText) {
					
	 				if (responseText.success == true) {
	 					document.getElementById('executeGriRequest').disabled = false;
	 					$("#griRequestProcessingForm").attr("action", "runGRI");
	 		        	$("#griRequestProcessingForm").submit(); 

	 						 				}
				}
			});
		
    	}else{
    		return false;
    	}
    });
	
	$('#executeGriRequest').click(function(){
		
        var scheduleDate=$("#scheduleDate").val();
        if(scheduleDate ==null || scheduleDate==''){
          alert("Please enter schedule date.");
          return false;
        }       
      
        //var today = new Date();
       // var dd = today.getDate();
        //var mm = today.getMonth()+1; //January is 0!
        //var yyyy = today.getFullYear();
        //if(dd<10){
           // dd='0'+dd
       // } 
       // if(mm<10){
           // mm='0'+mm
        //} 
       // var today = mm+'-'+dd+'-'+yyyy;
        //alert("today****   "+ today);
        //alert("scheduleDate  "+ scheduleDate);
		//var diff = scheduleDate - today;		
		//alert("diff  "+ diff);	
		//if (diff <= 0){			
			//$("#scheduleDate").validationEngine('showPrompt', 'Shedule date should be greater than today date', 'error', false);
			//return false;
			//}
        
		if($("#griRequestProcessingForm").validationEngine('validate')){
			
			var r=confirm("Do you want to execute the GRI request!");
			 if (r==true)
			  {				 
			submitAllSelect();			
		
			$("#griRequestProcessingForm").attr("action", "executeGRI");
        	$("#griRequestProcessingForm").submit(); 
			  }			
        	
    	}else{
    		return false;
    	}
    });
    $('#executeGriRevert').click(function(){


    			var r=confirm("Do you want to revert the scheduled GRI Implemetation job!");
    			 if (r==true)
    			  {
        			submitAllSelect();
                    $("#griRequestProcessingForm").attr("action", "executeRevertGRI");
                    $("#griRequestProcessingForm").submit();
    			  }


        });
	var state=$("#state").val();
	
	if($("#tariffGriRequestId").val() == '' || $("#tariffGriRequestId").val() == null )
    {
		$('#runGriRequest').attr("disabled","disabled");
		$('#executeGriRequest').attr("disabled","disabled");
    }
	
	if(state=='R' || state=='E' )
    {
        document.getElementById('adjustmentFactor').disabled = true;
        document.getElementById('adjustmentType').disabled = true;
        //$('#saveGriRequest').attr("disabled","disabled");
        //$('#executeGriRequest').attr("disabled","disabled");
        $('#runGriRequest').attr("disabled","disabled");
    }
	else
    {
        //$('#saveGriRequest').removeAttr("disabled");
        //$("runGriRequest").removeAttr("disabled");
        //$('#executeGriRequest').removeAttr("disabled");
    }
    if(state=='E' ) {
        $('#saveGriRequest').attr("disabled","disabled");
    }else{
        $('#saveGriRequest').removeAttr("disabled");
    }

	 $("#griSourceCode").change(function(){						
		 chngetariff();
	 });
	
	 $("#adjustmentType").change(function(){
		 var adjustmentType=$("#adjustmentType").val();
		 if(adjustmentType=="Z"){
		  $('#adjustmentFactor').val("0.00");
		 }
	 });
	 
	
	 if (_displayonly) {
			$('#saveGriRequest').attr("disabled","disabled");
			//$('#runGriRequest').attr("disabled","disabled");
			//$('#executeGriRequest').attr("disabled","disabled");
			
		    }
	 
	//Filter ListBox Values using Testbox
/*	 $("#griRequestRateBasisesSelected option").each(function(index, item){
		 alert("item:: "+item.value+"  index::"+index);
		 $("#griRequestRateBasises option[value='"+item.value+"']").attr("selected","selected");
	 });
	 */
	 var options=$('#griRequestRateBasises option');
		 $('#griRequestRateBasises').change(function() {
			 	var selObj= getControl('griRequestRateBasises')
				if (selObj == null || selObj.options.length == 0)
					return false;
				var tmpOptObj;
				var temp=$('#rateBasis').val();;
				for ( var i = 0; i < selObj.options.length; i++) {
					tmpOptObj = selObj.options[i];
					if (tmpOptObj.selected){
						if(temp!="" && temp!=null){
							temp=temp+","+selObj.options[i].value;
						}
						else{
							temp=selObj.options[i].value;
							
						}
						tmpOptObj.selected = true;
					}
				}// end if
				var tempSplit=temp.split(",");
			    var tempUnique=unique(tempSplit);
			    var finalRateBasis=tempUnique.toString();
			    $('#rateBasis').val(finalRateBasis);
				if(tempUnique!=null && tempUnique!=""){
					$.each(options, function (index, item) {
						 for(j=0;j<tempUnique.length;j++){
							 $("#griRequestRateBasises option[value='"+tempUnique[j].toUpperCase()+"']").attr("selected","selected");
						 }
					});
				}
				else{
					$("#griRequestRateBasises option").removeAttr("selected");
				}
		 });

		$('#rateBasis').keyup(function() {
			var filter  = $(this).val();
			var filterSplit=filter.split(",");
		    var filterUnique=unique(filterSplit);
			if(filterUnique!=null && filterUnique!=""){
				$.each(options, function (index, item) {
					 for(j=0;j<filterUnique.length;j++){
						 $("#griRequestRateBasises option[value='"+filterUnique[j].toUpperCase()+"']").attr("selected","selected");
					 }
				});
			}
			else{
				$("#griRequestRateBasises option").removeAttr("selected");
			}
		});
		$('#rateBasis').keydown(function() {
			var filter  = $(this).val();
			var filterSplit=filter.split(",");
		    var filterUnique=unique(filterSplit);
			if(filterUnique!=null && filterUnique!=""){
				$.each(options, function (index, item) {
					 for(j=0;j<filterUnique.length;j++){
						 $("#griRequestRateBasises option[value='"+filterUnique[j].toUpperCase()+"']").attr("selected","selected");
					 }
				});
			}
			else{
				$("#griRequestRateBasises option").removeAttr("selected");
			}
		});
		$('#rateBasis').keypress(function() {
			var filter  = $(this).val();
			var filterSplit=filter.split(",");
		    var filterUnique=unique(filterSplit);
			if(filterUnique!=null && filterUnique!=""){
				$.each(options, function (index, item) {
					 for(j=0;j<filterUnique.length;j++){
						 $("#griRequestRateBasises option[value='"+filterUnique[j].toUpperCase()+"']").attr("selected","selected");
					 }
				});
			}
			else{
				$("#griRequestRateBasises option").removeAttr("selected");
			}
		});

}); 
function save() {
	 var grpTyp = document.getElementById('griGroupType').value;
	 var grpCode =document.getElementById('griGroupCode').value;
	 var sourceCode=document.getElementById('griSourceCode').value;
	 var tariffGriRequestId=$('#tariffGriRequestId').val();
	$.ajax({
		   type: "GET",
		   url: _context +"/tm/griRequestProcessing/validateItemCombination?",
		   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&tariffGriRequestId="+ tariffGriRequestId,
		   success: function(msg){
			   if(msg=="NotValid"){
				   alert('Not a valid combination to add items.'); 
				   return;
				}
			   else if(msg=="Available")
			   {
			   alert('Duplicate GRI Request for Tariff is not allowed'); 
			   }
			   else{
				submitAllSelect();
				var validFields=validateFields();
				if(validFields){
				        document.getElementById('runGriRequest').disabled = false;
						$("#griRequestProcessingForm").attr("action", "createUpdateRequest");
			        	$("#griRequestProcessingForm").submit(); 
			        	
				}
			}
		   }
	});
}

function submitAllSelect() {
	selectAll(getControl('griRequestRateBasisesSelected'));
	selectAll(getControl('griRequestEquipmentsSelected'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;

	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}
var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};

function cancel(){
	if (somethingChanged) {
	 var r=confirm("All the unsaved Changes will be discarded!");
	 if (r==true)
	  {
		 
	 document.location.href = _context + '/cas/griSearch.do?refresh=true';
	  }
	}
	else
		{
		document.location.href = _context + '/cas/griSearch.do?refresh=true';
		}
}

function populateGrpName()
{
	var tariffGrpTyp=$("#griGroupType").val();
//	alert('tariffGrpTyp'+tariffGrpTyp);
	 var tariffGrpName=$("#griSourceCode").val();
	 //alert('tariffGrpName:: '+tariffGrpName);
	 if(tariffGrpTyp=='01'){
		 if(tariffGrpName!=null && tariffGrpName!='')
		 {
			 $("#griGroupCode").val(tariffGrpName);
		 }
	}
}
function reset()
{
	$("#griSourceCode").val("");
	$("#griGroupCode").val("");
}

function validateFields()
{
	var incrementAmount=$("#incrementAmount").val();
	var incrementType=$("#incrementType").val();
	var adjustmentFactor=$("#adjustmentFactor").val();
	var adjustmentType=$("#adjustmentType").val();
	if((incrementAmount=='' && adjustmentFactor=='') || (incrementAmount=="0.00" && adjustmentFactor=="0.00")){
		alert('Please enter any of Increase Amount or Adjustment Factor');
		return false;
	}
	/*else if(incrementAmount!='' && adjustmentFactor!='' && incrementAmount!="0.00" && adjustmentFactor!="0.00"){
		alert('Please enter only of Increase Amount or Adjustment Factor');
		return false;
	}*/
	else if((incrementAmount=='' || incrementAmount=="0.00") && (incrementType=='D' || incrementType=='P')){
		alert('Select Increase Amount');
		return false;
	}
	else if((incrementType!='D' && incrementType!='P') && (incrementAmount!='' && incrementAmount!="0.00")){
		alert('Select Increase Type');
		return false;
	}
	else if((adjustmentFactor=='' || adjustmentFactor=="0.00") && (adjustmentType=='D' || adjustmentType=='P')){
		alert('Select Adjustment Factor');
		return false;
	}
	else if((adjustmentType!='D' && adjustmentType!='P' && adjustmentType!='Z') && (adjustmentFactor!='' && adjustmentFactor!="0.00")){
		alert('Select Adjustment Type');
		return false;
	}
	else{
		return true;
	}
}
function disableFields()
{
	var status=$('#statusCodeId').val();
	if(status=='R' || status=='E'){
		document.getElementById('adjustmentFactor').disabled = true;
		document.getElementById('adjustmentType').disabled = true;
	}
}

function chngetariff(){
		$("#griGroupCode").val("");
}

function disableadjust()
{
	var flg= document.getElementById('cpFlag').value;
	if(flg=='C'){
   		$('#adjustmentType').val('selected');
   		$('#adjustmentFactor').val('');
   		$('#carrierCode').val('');
   		$('#hiddenCarrierCode').val('');
		document.getElementById('adjustmentFactor').disabled=true;
		document.getElementById('adjustmentType').disabled=true;
		document.getElementById('carrierCode').disabled=true;
	}
	else{
		document.getElementById('adjustmentFactor').disabled=false;
		document.getElementById('adjustmentType').disabled=false;
		document.getElementById('carrierCode').disabled=false;
	}
}

function carrierPopupSearch() {
	var actionUrl = _context + "/carrier/lookup/showForm?carrierCode="+ $('#carrierCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CarrierSearch', windowStyle);
}
function carrierUpdate(id,type,name) {
	var carrierVar = id.split("(");
	var carrierID = carrierVar[0];
	var carrierName = carrierVar[1];	
	var carrierType=type;
	
	var oldCarrierCode=  $('#carrierCode').val();
		 if(oldCarrierCode!=carrierID){
			 $('#runGriRequest').attr("disabled","disabled");
			 somethingChanged = true; 
		}
	$('#hiddenCarrierCode').val(carrierID);
	$('#carrierCode').val(carrierID);
}
function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#griGroupType').val()+"&sourceTariff="+$('#griSourceCode').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#griGroupType').val()+"&sourceTariff="+$('#griSourceCode').val()+"&grpName="+$('#griGroupCode').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}
function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#griSourceCode').val(values[0]); 
  	
  	if($('#griGroupType').val()=="01"){
		 $('#griGroupCode').val(values[0]);
	 }
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#griGroupCode').val(values[0]);	 
}

//post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
 
    //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
       // '\n\nThe output div should have already been updated with the responseText.');
	
	/*
	 * JSON Response Structure:
	 * {
	 *     status: true/false (ok/not-ok)
	 *     data: { //data used to update page content// },
	 *     messages: [ 
	 *                 {type: 'error', msg: 'actual message'},
	 *                 {type: 'error', msg: 'another error'} 
	 *               ]
	 * }
	 * 
	 * Processing:
	 *   - $('area').loadJSON(data)
	 *   - $('msgArea').loadMessages(messages)
	 */

	// msgDiv:
	// <div class="message_success" id="successMsgDiv">Successfully Loaded.</div>
	
	var data = responseText.data;
	var split=data.split(",");
	var isValid=true;
	if(split[0]=='false'){
		$("#equipmentOne1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(split[1]=='false'){
		$("#equipmentTwo1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(split[2]=='false'){
		$("#equipmentThree1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(isValid){
		save();
	}
	
} 
function decimalPlaces(n) {
	
	var count = 0;
	for (var ndx = n.indexOf('.')+1; ndx > 0 & ndx < n.length; ndx++){
	   count++;	
	}
	return count;
}

//pre-submit callback 
function showRequest(formData, jqForm, options) { 
    // formData is an array; here we use $.param to convert it to a string to display it 
    // but the form plugin does this for you automatically when it submits the data 
    var queryString = $.param(formData); 
 
    // jqForm is a jQuery object encapsulating the form element.  To access the 
    // DOM element for the form do this: 
    // var formElement = jqForm[0]; 
 
    //alert('About to submit: \n\n' + queryString); 
 
    // here we could return false to prevent the form from being submitted; 
    // returning anything other than false will allow the form submit to continue 
    return true; 
}

//post-submit callback 
function showResponse(responseText, statusText, xhr, $form)  { 
    // for normal html responses, the first argument to the success callback 
    // is the XMLHttpRequest object's responseText property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'xml' then the first argument to the success callback 
    // is the XMLHttpRequest object's responseXML property 
 
    // if the ajaxSubmit method was passed an Options Object with the dataType 
    // property set to 'json' then the first argument to the success callback 
    // is the json data object returned by the server 
 
    //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText + 
       // '\n\nThe output div should have already been updated with the responseText.');
	
	/*
	 * JSON Response Structure:
	 * {
	 *     status: true/false (ok/not-ok)
	 *     data: { //data used to update page content// },
	 *     messages: [ 
	 *                 {type: 'error', msg: 'actual message'},
	 *                 {type: 'error', msg: 'another error'} 
	 *               ]
	 * }
	 * 
	 * Processing:
	 *   - $('area').loadJSON(data)
	 *   - $('msgArea').loadMessages(messages)
	 */

	// msgDiv:
	// <div class="message_success" id="successMsgDiv">Successfully Loaded.</div>
	
	var data = responseText.data;
	var split=data.split(",");
	var isValid=true;
	if(split[0]=='false'){
		$("#equipmentOne1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(split[1]=='false'){
		$("#equipmentTwo1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(split[2]=='false'){
		$("#equipmentThree1").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
		isValid=false;
	}
	
	if(isValid){
		save();
	}
	
} 
function decimalPlaces(n) {
	
	var count = 0;
	for (var ndx = n.indexOf('.')+1; ndx > 0 & ndx < n.length; ndx++){
	   count++;	
	}
	return count;

}
function unique(list) {
	  var result = [];
	  $.each(list, function(i, e) {
	    if ($.inArray(e, result) == -1) result.push(e);
	  });
	  return result;
}
function deselectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (tmpOptObj.selected){
			tmpOptObj.selected =false;
		}
	}// end if
}
function SortSubscribeFields(fieldname) {
	var listitems =  $("#"+fieldname+" option");
	 listitems.sort(function(a, b) {
	 var compA = $(a).text().toUpperCase();
	 var compB = $(b).text().toUpperCase();
	 return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	});
	$.each(listitems, function(idx, itm) {
		 $("#"+fieldname).append(itm);
	});
}

function autoTab(CurrentElementID, NextElementID, FieldLength) {
    //Get a reference to the two elements in the tab sequence.
    var CurrentElement = $('#' + CurrentElementID);
    var NextElement = $('#' + NextElementID);
 
    CurrentElement.keyup(function(e) {
        //Retrieve which key was pressed.
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence.   
        if (CurrentElement.val().length >= FieldLength
            && ((KeyID >= 48 && KeyID <= 90) ||
            (KeyID >= 96 && KeyID <= 105)))
            NextElement.focus();
    });
}

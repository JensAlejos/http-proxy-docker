$(document).ready(function() { 
	$("#derivedRateForm").validationEngine('attach');
     $('#search').click(function() {
    	 if ($("#derivedRateForm").validationEngine('validate')) {
    	 if($("#derivedItemCode").val()=="ALL" || $("#derivedItemCode").val()=="All")
			{
				$('#derivedItemCode').validationEngine('showPrompt', 'ALL is not valid Item', 'error', 'topRight', true);
				return false;
			}
    	 
    	 var directionCode= $('#derivedDirectionCode').val();
    	 var funCode = $('#derivedPlanEquipFunctionCode').val();
    	 var lenCode = $('#derivedPlanEquipLengthFeet').val();
    	 var heightCode = $('#derivedPlanEquipHeightCode').val();
    	 //var cityCode = $('#derivedCityCode').val();
    	 var rateDesc = $('#derivedRateDesc').val();
    	 var rateAmount = $('#derivedRateAmount').val();
    	
    	 var addFlag = $('#addFreightPayableFlag').val();
    	 var reg = new RegExp("[ ]+","g");
    	
         $('#derivedDirectionCode').val(directionCode.replace(reg,""));
         $('#derivedPlanEquipFunctionCode').val(funCode.replace(reg,""));
         
         $('#derivedPlanEquipLengthFeet').val(lenCode.replace(reg,""));
         $('#derivedPlanEquipHeightCode').val(heightCode.replace(reg,""));
         //$('#derivedCityCode').val(cityCode.replace(reg,""));
         $('#derivedRateDesc').val(rateDesc.replace(/\s+$/, ''));
         $('#derivedRateAmount').val(rateAmount.replace(reg,""));
    		 	$("#derivedRateForm").submit(); 
    	 }
    	 else{
    		 	return false;
    		 }
     }); 
     
     $('#derivedCurrentFutureInd').click(function() {
    		if($('#derivedCurrentFutureInd').attr('checked')){
    			document.getElementById('derivedCurrentFutureInd').value="Y";
    			document.getElementById('derivedCurrentFutureInd').checked = true;
    			$('#isCurrentFuture').val(true);
    		}else{
    			document.getElementById('derivedCurrentFutureInd').value="ALL";
    			document.getElementById('derivedCurrentFutureInd').checked = false;
    			$('#isCurrentFuture').val(false);
    		}
     });
     
     if(document.getElementById('derivedCurrentFutureInd').value=="Y" || document.getElementById('derivedCurrentFutureInd').value=="true" || document.getElementById('derivedCurrentFutureInd').value==true){
    	 	document.getElementById('derivedCurrentFutureInd').checked = true;
    	 	document.getElementById('derivedCurrentFutureInd').value="Y"
    	 }
     else{
    	 document.getElementById('derivedCurrentFutureInd').checked = "ALL";
    	 document.getElementById('derivedCurrentFutureInd').checked = false;
    	 $('#isCurrentFuture').val(false);
    	 }
     $("search").attr("disabled","disabled");
     var grpTyp =  document.getElementById('grpTypeHidden');
   
 	if (grpTyp.value == 'FRT') {
		document.getElementById('derivedGrpType').selectedIndex = '00';		
	}
 	 
	if (grpTyp.value == 'WFG') {
		document.getElementById('derivedGrpType').selectedIndex = '01';
	}
	if (grpTyp.value == 'DRA') {		
		document.getElementById('derivedGrpType').selectedIndex = '02';
	}
	if (grpTyp.value == 'RDV') {
		document.getElementById('derivedGrpType').selectedIndex = '03';
	}
	if (grpTyp.value == 'MSH') {
		document.getElementById('derivedGrpType').selectedIndex = '04';
	}
	if (grpTyp.value == 'MEQ') {
		document.getElementById('derivedGrpType').selectedIndex = '05';
	}
	if (grpTyp.value == 'ACC') {
		document.getElementById('derivedGrpType').selectedIndex = '06';
	}
	
	
	$('#derivedGrpType').change(function() {
		clearDerivedRateForm();
		var selectedValue = $('#derivedGrpType').val();
		$('#tariffServiceGroupTypeCodeHidden').val(selectedValue);
		
		//029331   
	 	if (selectedValue == '01') {
	 		$('#grpType').val("FRT");		
		}
	 	 
		if (selectedValue == '02') {
			$('#grpType').val("WFG");
		}
		if (selectedValue == '03') {		
			$('#grpType').val("DRA");
		}
		if (selectedValue == '04') {
			$('#grpType').val("RDV");
		}
		if (selectedValue == '05') {
			$('#grpType').val("MSH");
		}
		if (selectedValue == '06') {
			$('#grpType').val("MEQ");
		}
		if (selectedValue == '07') {
			$('#grpType').val("ACC");
		}
		
		$('#derivedGroupType').val("FRT");
	});
	$('#derivedRateAmount').blur(function() {
		var selectedValue = $('#derivedRateAmount').val().trim();
		$('#derivedRateAmount').val(selectedValue.trim());
	});
	
	$('#derivedSourceTariff').keyup(function() {	
		var validComb= validateCombforMandatoryFiels();	
		if(! validComb){
			$("#search").attr("disabled","disabled");
			
		}else{
			$("#search").removeAttr("disabled");
		
		}
	});

	$('#derivedGroupName').keyup(function() {
		var validComb= validateCombforMandatoryFiels();
	
		if(! validComb){
			
			$("#search").attr("disabled","disabled");
			
			
		}else{
			$("#search").removeAttr("disabled");
			
		}
	});

	$('#derivedItemCode').keyup(function() {
		
		var validComb= validateCombforMandatoryFiels();
		
		
			$("#search").removeAttr("disabled");
			
		
	});
	
    $('#clear').click(function() {
    	document.getElementById('derivedGrpType').selectedIndex = '00';
    	$('#tariffServiceGroupTypeCodeHidden').val("01");
    	 clearDerivedRateForm();
     }); 
     
    
   //Blurr the data for invalid item Id
   $('#derivedItemCode').change(function(){
	   if($("#derivedItemCode").val()=="ALL" || $("#derivedItemCode").val()=="All")
		{
			$('#derivedItemCode').validationEngine('showPrompt', 'ALL is not valid Item', 'error', 'topRight', true);
			return false;
		}
	  
	   
		
	    });
   $('#derivedCustomerTb tr').each(
           function()
           {
                   var rowId = $(this).attr("id");
                   $("#"+rowId+"td4").text($("#"+rowId+"td4").text().replace("null",""));
                   if($("#"+rowId+"td1").text()=="E")
                	   {
                	   $("#"+rowId+"td1").css("background-color","#FFBABA");
                	   $("#"+rowId+"td2").css("background-color","#FFBABA");
                	   $("#"+rowId+"td3").css("background-color","#FFBABA");
                	   $("#"+rowId+"td4").css("background-color","#FFBABA");
                	   $("#"+rowId+"td5").css("background-color","#FFBABA");
                	   $("#"+rowId+"td6").css("background-color","#FFBABA");
                	   $("#"+rowId+"td7").css("background-color","#FFBABA");
                	   $("#"+rowId+"td8").css("background-color","#FFBABA");
                	   $("#"+rowId+"td12").css("background-color","#FFBABA");
                	   $("#"+rowId+"td13").css("background-color","#FFBABA");
                	   $("#"+rowId+"td14").css("background-color","#FFBABA");
                	   $("#"+rowId+"td15").css("background-color","#FFBABA");
                	   $("#"+rowId+"td16").css("background-color","#FFBABA");
                	   }
                   if($("#"+rowId+"td1").text()=="F")
            	   {
		            	   $("#"+rowId+"td1").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td2").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td3").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td4").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td5").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td6").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td7").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td8").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td12").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td13").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td14").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td15").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td16").css("background-color","#F1EA00");
            	   }
                  
           }
   ); 
   
   $('#derivedFrtTb tr').each(
           function()
           {
                   var rowId = $(this).attr("id");
                   $("#"+rowId+"td4").text($("#"+rowId+"td4").text().replace("null",""));
                   if($("#"+rowId+"td1").text()=="E")
                	   {
                	   $("#"+rowId+"td1").css("background-color","#FFBABA");
                	   $("#"+rowId+"td2").css("background-color","#FFBABA");
                	   $("#"+rowId+"td3").css("background-color","#FFBABA");
                	   $("#"+rowId+"td4").css("background-color","#FFBABA");
                	   $("#"+rowId+"td5").css("background-color","#FFBABA");
                	   $("#"+rowId+"td6").css("background-color","#FFBABA");
                	   $("#"+rowId+"td7").css("background-color","#FFBABA");
                	   $("#"+rowId+"td8").css("background-color","#FFBABA");
                	   $("#"+rowId+"td9").css("background-color","#FFBABA");
                	   $("#"+rowId+"td10").css("background-color","#FFBABA");
                	   $("#"+rowId+"td11").css("background-color","#FFBABA");
                	   $("#"+rowId+"td12").css("background-color","#FFBABA");
                	   $("#"+rowId+"td13").css("background-color","#FFBABA");
                	   $("#"+rowId+"td14").css("background-color","#FFBABA");
                	   $("#"+rowId+"td15").css("background-color","#FFBABA");
                	   $("#"+rowId+"td16").css("background-color","#FFBABA");
                	   $("#"+rowId+"td17").css("background-color","#FFBABA");
                	   }
                   if($("#"+rowId+"td1").text()=="F")
            	   {
		            	   $("#"+rowId+"td1").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td2").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td3").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td4").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td5").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td6").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td7").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td8").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td9").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td10").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td11").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td12").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td13").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td14").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td15").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td16").css("background-color","#F1EA00");
		            	   $("#"+rowId+"td17").css("background-color","#F1EA00");
            	   }
                  
           }
   );
    
   
     
     $('#cancel').click(function() {
    	var tariffRateAmountId=$('#tariffRateAmountId').val();
    	var frtPayableRateAmountId=$('#frtPayableRateAmountId').val();
    	 
    	var tariffRateDescriptionId=$('#tariffRateDescriptionId').val();
    	var customerRateEffectiveDate=$('#effectiveDate').val();
    	var customerRateExpirationDate=$('#expirationDate').val();
    	var tariffRateAmount=$('#tariffRateAmount').val();
    	
    	var frtPayEffectiveDate=$('#effectiveDate').val();
    	var frtPayExpirationDate=$('#expirationDate').val();
    	var baseRateAmount=$('#baseRateAmount').val();
    	var rateAdjustmentAmount=$('#rateAdjustmentAmount').val();
    	var carrierCode=$('#carrierCode').val();
    	var rateAdjustmentUnitCode=$('#rateAdjustmentUnitCode').val();
    	var frtPayableRateAmount=$('#frtPayableRateAmount').val();
    	
    	var derivedSrceRateDescId=$('#derivedSrceRateDescId').val();
    	var derivedSrcePayableSeqno=$('#derivedSrcePayableSeqno').val();
    	
    	var rateIndicator=$('#rateIndicator').val();
    	 
    	var submiturl;
    	var submitdata;
    	var submitExistingData;
    	var addFreightPayableFlag = $('#addFreightPayableFlag').val();
    	var somethingChanged=$('#somethingChanged').val();
		var currentFuture = $('#isCurrentFuture').val(); 
		/*if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
			currentFuture='Y';
		}
		else{
			currentFuture='N';
		}*/
    	if(rateIndicator=='C'){
    		 submiturl=_context +"/tm/customerRate/showForm?";
    		 //alert("tariffRateDescriptionId="+ tariffRateDescriptionId+"&tariffRateAmountId="+tariffRateAmountId+"&derivedSrceRateDescId="+derivedSrceRateDescId+"&derivedSrcePayableSeqno="+derivedSrcePayableSeqno);
    		 submitdata="tariffRateDescriptionId="+ tariffRateDescriptionId+"&tariffRateAmountIds="+tariffRateAmountId+"&derivedSrceRateDescId="+derivedSrceRateDescId+"&derivedSrcePayableSeqno="+derivedSrcePayableSeqno;
    		 submitExistingData="&customerRateEffectiveDate="+customerRateEffectiveDate+"&customerRateExpirationDate="+customerRateExpirationDate+"&tariffRateAmount="+tariffRateAmount+"&exitFlag=Y&action=EXIT&somethingChanged="+somethingChanged+"&isCurrentFuture="+currentFuture;
    		
    		 document.location.href =submiturl+submitdata+submitExistingData;
    	 }
    	 else if(rateIndicator=='F'){
    		// alert(somethingChanged);
    		submiturl=_context +"/tm/frtPayable/showForm?";
    		submitdata="tariffRateDescriptionId="+tariffRateDescriptionId+"&frtPayableRateAmountIds="+frtPayableRateAmountId+"&derivedSrceRateDescId="+derivedSrceRateDescId+"&derivedSrcePayableSeqno="+derivedSrcePayableSeqno;
    		submitExistingData="&frtPayEffectiveDate="+frtPayEffectiveDate+"&frtPayExpirationDate="+frtPayExpirationDate+"&baseRateAmount="+baseRateAmount+"&rateAdjustmentAmount="+rateAdjustmentAmount+"&carrierCode="+carrierCode+"&rateAdjustmentUnitCode="+rateAdjustmentUnitCode+"&frtPayableRateAmount="+frtPayableRateAmount+"&exitFlag=Y&addFreightPayableFlag="+addFreightPayableFlag+"&action=EXIT&somethingChanged="+somethingChanged+"&isCurrentFuture="+currentFuture;
    		document.location.href =submiturl+submitdata+submitExistingData;
    	 }
		});
     
  // code to bind pop up search
	 $('#derivedGroupName').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#derivedSourceTariff').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
	 $('#derivedItemCode').gatesPopUpSearch({func:function() {ItemPopupSearch()}});	     
	 $('#derivedCityCode').gatesPopUpSearch({func:function() {cityPopupSearch()}});
	 
}); 



function validateCombforMandatoryFiels(){
    var grpCode = document.getElementById('derivedSourceTariff').value;
    var sourceCode = document.getElementById('derivedGroupName').value;   
    var itemCode=document.getElementById('derivedItemCode').value;
  //  alert(grpCode+sourceCode+itemCode);
    var validComb=false;
    
    if(grpCode!=null && grpCode!="" && grpCode!="ALL"
    	&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
    		&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
    	    
    	validComb=true;
    }
    return validComb;
}

//Start for manual lookup
function SourceTariffPopupSearch() {   
	var grpType= $('#tariffServiceGroupTypeCodeHidden').val();
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+grpType+"&sourceTariff="+$('#derivedSourceTariff').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {  
	var grpType= $('#tariffServiceGroupTypeCodeHidden').val();
	var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+grpType+"&sourceTariff="+$('#derivedSourceTariff').val()+"&grpName="+$('#derivedGroupName').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'GroupNameSearch', windowStyle); 	
}

function ItemPopupSearch() {
	var grpType= $('#tariffServiceGroupTypeCodeHidden').val();
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+grpType+"&sourceTariff="+$('#derivedSourceTariff').val()+"&grpName="+$('#derivedGroupName').val()+"&itemName="+$('#derivedItemCode').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function cityPopupSearch() {   
	var actionUrl = _context+"/city/manualLookup/showForm?term="+$('#derivedCityCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);    
}

function sourceTariffSearchUpdate(id){
	var values = id.split("|");
		$('#derivedSourceTariff').val(values[0]);
}

function groupNameSearchUpdate(id){
var values = id.split("|");
	$('#derivedGroupName').val(values[0]);
}

function itemNameSearchUpdate(id){
	var values = id.split("|");
		$('#derivedItemCode').val(values[0]);
}

function cityUpdate(id){
	$('#derivedCityCode').val(id);
}
// End for Manual Lookup

function selectRate(rateRow){
	
	var rateIndicator=$('#rateIndicator').val();
	var disableNextButton = $('#disableNextButton').val();
	var currentFuture = $('#isCurrentFuture').val(); 
/*	if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
		currentFuture='Y';
	}
	else{
		currentFuture='N';
	}*/
	if(rateIndicator=='C'){
		
		var customerRateId = rateRow.id;
		customerRateId = customerRateId.replace("td1","");
		
		var derivedSrceRateDescId = $("#"+customerRateId+"td14").text();
		var derivedSrcePayableSeqno = $("#"+customerRateId+"td17").text();
		var tariffRateDescriptionId=$('#tariffRateDescriptionId').val();
		var tariffRateAmountId=$('#tariffRateAmountId').val();
		var customerRateEffectiveDate = $('#customerRateEffectiveDate').val();
		var customerRateExpirationDate=$('#customerRateExpirationDate').val();
		var tariffRateAmount=$('#tariffRateAmount').val();
		submiturl=_context +"/tm/customerRate/showForm?";
		
		submitdata="tariffRateDescriptionId="+ tariffRateDescriptionId+"&tariffRateAmountIds="+tariffRateAmountId+"&derivedSrceRateDescId="+derivedSrceRateDescId+"&derivedSrcePayableSeqno="+derivedSrcePayableSeqno;
		submitExistingData="&customerRateEffectiveDate="+customerRateEffectiveDate+"&customerRateExpirationDate="+customerRateExpirationDate+"&tariffRateAmount="+tariffRateAmount+"&exit=Y&customerRateId="+customerRateId+"&saveFlag=Y&disableNextButton="+disableNextButton+"&action=EXIT&isCurrentFuture="+currentFuture;
		//alert("submitExistingData: " + submitExistingData);
		document.location.href =submiturl+submitdata+submitExistingData;
	}
	else if(rateIndicator=='F'){
		var frtRateId = rateRow.id;
		frtRateId = frtRateId.replace("td1","");
		var derivedSrceRateDescId = $("#"+frtRateId+"td14").text();
		var derivedSrcePayableSeqno = $("#"+frtRateId+"td17").text();
		var tariffRateDescriptionId=$('#tariffRateDescriptionId').val();
		var frtPayableRateAmountId=$('#frtPayableRateAmountId').val();
		var frtPayEffectiveDate = "";
		var frtPayExpirationDate = "";
		var isWholeDollar=$('#isWholeDollar').val();
		if($('#frtPayEffectiveDate').val()!=""){
			frtPayEffectiveDate=$('#frtPayEffectiveDate').val();
		}
		else
		{
			frtPayEffectiveDate=$('#effectiveDate1').val();
		}
		if($('#frtPayExpirationDate').val()!="")
			{
			frtPayExpirationDate=$('#frtPayExpirationDate').val();
			}
		else
			{
			frtPayExpirationDate=$('#expirationDate').val();
			}
		
		//alert($('#frtPayExpirationDate').val());
		var tariffRatePayableAmountId = $('#tariffRatePayableAmountId').val();
		var baseRateAmount=$('#baseRateAmount').val();
		var rateAdjustmentAmount=$('#rateAdjustmentAmount').val();
		var carrierCode=$('#carrierCode').val();
		var rateAdjustmentUnitCode=$('#rateAdjustmentUnitCode').val();
		var frtPayableRateAmount=$('#frtPayableRateAmount').val();
		
		submiturl=_context +"/tm/frtPayable/showForm?";
		submitdata="tariffRateDescriptionId="+tariffRateDescriptionId+"&frtPayableRateAmountIds="+frtPayableRateAmountId+"&derivedSrceRateDescId="+derivedSrceRateDescId+"&derivedSrcePayableSeqno="+derivedSrcePayableSeqno;
		submitExistingData="&frtPayEffectiveDate="+frtPayEffectiveDate+"&frtPayExpirationDate="+frtPayExpirationDate+"&baseRateAmount="+baseRateAmount+"&rateAdjustmentAmount="+rateAdjustmentAmount+"&carrierCode="+carrierCode+"&rateAdjustmentUnitCode="+rateAdjustmentUnitCode+"&frtPayableRateAmount="+frtPayableRateAmount+"&exit=Y&tariffRatePayableAmountId="+tariffRatePayableAmountId+"&frtRateId="+frtRateId+"&saveFlag=Y&disableNextButton="+disableNextButton+"&isWholeDollar="+isWholeDollar+"&action=EXIT&isCurrentFuture="+currentFuture;
		document.location.href =submiturl+submitdata+submitExistingData;
	}
}
function removeErrorPointers(){
	   $('#derivedRateForm').validationEngine('hideAll');
}
function clearDerivedRateForm(){
	 $('#derivedSourceTariff').val('');
	 $('#derivedGroupName').val('');
	 $('#derivedItemCode').val('');
	 $('#derivedDirectionCode').val('');
	 $('#derivedPlanEquipFunctionCode').val('');
	 $('#derivedPlanEquipLengthFeet').val('');
	 $('#derivedPlanEquipHeightCode').val('');
	 $('#derivedCityCode').val('');
	 $('#derivedCurrentFutureInd').attr('checked', true);
	 $('#derivedCurrentFutureInd').val("Y");
	 $('#derivedRateAmount').val('');
	 $('#derivedRateDesc').val('');
	 
	 $('#derivedCustomerTb').remove(); 
	 $('#derivedFrtTb').remove();
 
}

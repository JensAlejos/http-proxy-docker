var somethingChanged = false;
$(function() {
//alert($('#newValRatetoRate').val());
	
		if($('#rateToRateType').val() != "" &&  $('#rateToRateType').val() != "null"  )
			{
			var element = document.getElementById('tariffRateToRateTypeCode');
			if($('#newValRatetoRate').val()!="")
				{
				element.value = $('#newValRatetoRate').val();
			}
			else
				{
				element.value = $('#rateToRateType').val();
				}
			}
	
		var rateLinkPk =  $('#tariffRateToRateDsId').val();
	 	$("#rateToRateLinkForm").validationEngine('attach');
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		$( "#equipment" ).val($( "#equipment" ).val().replace("null",""));
		$('input').change(function() {
			somethingChanged = true;
		});
		$('checkbox').change(function() {
			somethingChanged = false;
		});
		$('textarea').change(function() {
			somethingChanged = true;
		});
		$('img').click(function() {
			somethingChanged = true;
		});
//		$('select').change(function() {
	//
//			somethingChanged = true;
//		});
		 $('table').click(function() { 
		        somethingChanged = true; 
		   });
		
		// Rate Link Save function- Button onclick function
		$('#rateLinkSave').click(function(){
			
			if($("#rateToRateLinkForm").validationEngine('validate')){
				if($("#expirationDate").val()=="")
				{
					var date1= $("#expirationParent").val();
					var from= date1.split("-");

					 var newdate = from[1]+"-"+from[2]+"-"+from[0];
					$("#expirationDate").val(date1);


				//	$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
				}
				if($("#effectiveDate").val()=="")
				{					
					var effectiveParent= $("#effectiveParent").val();
					var effectiveDateTemp= $("#effectiveDateTemp").val();
					
					if(new Date(effectiveDateTemp) > new Date(effectiveParent)){
						var date2= $("#effectiveDateTemp").val();										
						var effectiveDateTempFrom= date2.split("-");
						var effectiveDateTempNewdate = effectiveDateTempFrom[1]+"-"+effectiveDateTempFrom[2]+"-"+effectiveDateTempFrom[0];
						$("#effectiveDate").val(date2);
					} else {
						var date1= $("#effectiveParent").val();										
						var from= date1.split("-");
						var newdate = from[1]+"-"+from[2]+"-"+from[0];
						$("#effectiveDate").val(date1);
					}

				//	$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
				}
				var selVal = document.getElementById('tariffRateToRateTypeCode').value;
				if(selVal == "")
				{
					
						$('#tariffRateToRateTypeCode').validationEngine('showPrompt', 'Please select Rate to Rate Type', 'error', 'topRight', true);
						$("#expirationDate").val("");
					   
				     	return false;
					
					
				}

				$("#rateToRateLinkForm").attr("action", "createOrUpdateRateLinkage");
	        	$("#rateToRateLinkForm").submit();
	    	}else{
	    		return false;
	    	}
	    });
		$('#cancel').click(function() {
			 data="from=addLinkage";
			 document.location.href = _context + '/cas/rateToRateSearch.do?'+data;
		});
		var _prefDate = $('#prefDateSessionVar').val();
		var pageMode1=$('#mode').val();
		var rateEffDate = $('#effectiveDate').val();
		var tariffRateToRateId=$('#tariffRateToRateId').val()
		
		
		if (tariffRateToRateId == null || tariffRateToRateId == '') {
			if (_prefDate != null && _prefDate != '') {
				if (pageMode1 == 'Add' ) {
					$("#effectiveDate").datepicker('setDate', _prefDate);
				}
				$("#preferencedate").datepicker('setDate', _prefDate);
			} else {
				
				$("#preferencedate").datepicker('setDate', new Date());
			}
		}
		
 });

function removeErrorPointers(){
	   $('#rateToRateLinkForm').validationEngine('hideAll');
}

//Next Functionality
function loadNextRateLinkDetails() {
//	var rateLinkPk =  $('#tariffRateToRateDsId').val();
//	if((rateLinkPk == null)||(rateLinkPk == '')){
	var pageMode=$('#mode').val();
//	}
	var expDate= $("#expirationParent").val();
	var effDate= $("#effectiveParent").val();
	 var rateToRateType = $('#rateToRateType').val();
	var rateLinkToUpdate = "NEXT";
	var rateDescId= document.getElementById('tariffRateDescriptionIdHeader').value;
	if (somethingChanged) {
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
			 if(pageMode=="Add"){
				 document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkAdd?rateDescIdHdr='+ rateDescId +"&rateDescIdsSel="+rateLinkToUpdate+"&rateToRateType="+rateToRateType+"&mode="+pageMode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ; 
			 }else{		 
				 document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkUpdate?rateDescId='+ rateDescId +"&rateLinkIds="+rateLinkToUpdate+"&rateToRateType="+rateToRateType+"&mode="+pageMode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ;
			 }
		  }
	}
	else{
		 if(pageMode=="Add"){
			 document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkAdd?rateDescIdHdr='+ rateDescId +"&rateDescIdsSel="+rateLinkToUpdate+"&rateToRateType="+rateToRateType+"&mode="+pageMode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ; 
		 }else{		 
			 document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkUpdate?rateDescId='+ rateDescId +"&rateLinkIds="+rateLinkToUpdate+"&rateToRateType="+rateToRateType+"&mode="+pageMode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ;
		 }
	}
}
/**
 *  Javascript File for View Freight Bill Status details.
 *  
 **/

	$("#freightBillStatusForm").validationEngine('attach');
	
	tabSequence('#freightBillStatusForm');
	
	
	
	


function loadFreightBillStatus(shipmentDet, cntrNbr) {
	$("#freightBillStatusForm").validationEngine('detach');
	$('#freightBillStatusForm').attr("action","loadFreightBillStatus?'acion'");
	$('#freightBillStatusForm').submit();
}

$(document).ready(function() {

	/*if($('#nextFlag').val()=='false'){
		$('#next').attr('disabled', true);
	}*/
	
	/*alert("total-> " +$('#indexedShipmentIdListSize').val());
	alert("index-> " +$("#index").val());
	*/
	if($('#noOfCorrections').text() == null ||$('#noOfCorrections').text() =="" || $('#noOfCorrections').text() == 0 ){
		$('#frtBlSts').attr("disabled", true);
	} 
	
	if($('#indexedShipmentIdListSize').val()-1 == $("#index").val()){
		 $('#next').attr("disabled",true);
	 }
	 if($("#index").val() == 0 ){
		 $('#previous').attr("disabled",true);
	 }
	 
	 if($('#indexedShipmentIdListSize').val() == 0) {
		 $('#next').attr("disabled",true);
		 $('#previous').attr("disabled",true);
	 }
	
	 $('#next').click(function(){
		 	$('#freightBillStatusForm').attr("action","next");
			var index = $('#index').val();
			index= parseInt(index)+1;
		//	alert(index);
			var shipmentIdListSize = $('#indexedShipmentIdListSize').val();
			//alert(shipmentIdListSize);
			if(index < shipmentIdListSize ){
				 
				 $("#freightBillStatusForm").submit();
			}/*else {
				$('#next').attr('disabled','disabled');
			}
				*/
		});
	 
	 $('#previous').click(function(){
		 	$('#freightBillStatusForm').attr("action","previous");
		 	var index = $('#index').val();
		 	//alert(index);
			index= index-1;
			if(index >= 0){
				$("#freightBillStatusForm").submit();
			}/*else {
				 $('#previous').attr('disabled','disabled');
			}*/
			
		});
	 
	 
	// $('#shipper').text($('#shipper').text().substring(0,10));
	/* function formatFields(val){
			if("$('#"+val+"')".text().length()>10){
				"$('#"+val+"')".text("$('#"+val+"')".text().substring(0,10));
			}
			
		}*/
	/* var variableNameList=new Array ("shipper", "consignee" ,"freightBillStatusForm.prepaidFreightBillForm.debtor","freightBillStatusForm.prepaidFreightBillForm.debtor1","freightBillStatusForm.prepaidFreightBillForm.debtor2","freightBillStatusForm.prepaidFreightBillForm.debtor3", 
			 		"freightBillStatusForm.collectFreightBillForm.debtor","freightBillStatusForm.collectFreightBillForm.debtor1","freightBillStatusForm.collectFreightBillForm.debtor2","freightBillStatusForm.collectFreightBillForm.debtor3", 
			 		"freightBillStatusForm.referenceNumberNotationForShipperRef",  "freightBillStatusForm.referenceNumberNotationForConsigneePO",  "freightBillStatusForm.prepaidFreightBillForm.delqStatus"  , "freightBillStatusForm.collectFreightBillForm.delqStatus" ,
	                 "freightBillStatusForm.prepaidFreightForOriginalBillForm.debtor", "freightBillStatusForm.collectFreightForOriginalBillForm.debtor" ,  "freightBillStatusForm.currentReasonForCorrection", "freightBillStatusForm.previousReasonForCorrection" );  
	 
	
	 
	 //  as per discussed with ashish sir 20 nov --make comment
	 formatFields(variableNameList);	
	 var variableNameList=new Arrary ("shipper","consignee","freightBillStatusForm.prepaidFreightBillForm.debtor","freightBillStatusForm.collectFreightBillForm.debtor");
	*/ 
	 
	 // As per defect 20463 make change and again show values with Hover
	 
	 var variableNameListForHeader=new Array ("shipper", "consignee" ,"freightBillStatusForm.prepaidFreightBillForm.debtor","freightBillStatusForm.collectFreightBillForm.debtor");  
	 formatFieldsForHeader(variableNameListForHeader);
	 
	 var variableNameListForPrepaidCollectFrtDebtorAndOriginal=new Array ("freightBillStatusForm.prepaidFreightBillForm.debtor1","freightBillStatusForm.collectFreightBillForm.debtor1","freightBillStatusForm.prepaidFreightBillForm.debtor2", "freightBillStatusForm.collectFreightBillForm.debtor2");  
	 formatFieldsValueForPrepaidCollectFrtDebtorAndOriginal(variableNameListForPrepaidCollectFrtDebtorAndOriginal);
	
	 var variableNameListForCurrentPrepaidCollectDebtor=new Array ("freightBillStatusForm.prepaidFreightBillForm.debtor3","freightBillStatusForm.collectFreightBillForm.debtor3");  
	 formatFieldsValueForCurrentPrepaidCollectDebtor(variableNameListForCurrentPrepaidCollectDebtor);
	
	 var variableNameListForShipRefAndConsigneePO=new Array ("freightBillStatusForm.referenceNumberNotationForShipperRef",  "freightBillStatusForm.referenceNumberNotationForConsigneePO");  
	 formatFieldsValueForShipRefAndConsigneePO(variableNameListForShipRefAndConsigneePO);
	
	/* var variableNameForStatusCode=new Array ("freightBillStatusForm.statusCode");  
	 formatFieldsValueForStatusCode(variableNameForStatusCode);
	*/
	 
	 /*Shipment Security*/
	 	enforceSecurityTitle(isfreightbillstatusDisplay);
	 	enforceSecurityDivAndButtons("viewFrtBillCorrectionDivId",isfreightbillstatusDisplay);
		enforceSecurityDivAndButtons("buttondiv",isfreightbillstatusDisplay);
		enforceSecurityDivAndButtons("searchDiv",isfreightbillstatusDisplay);
		enforceSecurityDivAndButtons("containerDiv",isfreightbillstatusDisplay);
		enforceSecurityDivAndButtons("exit",isfreightbillstatusDisplay);
		var div = document.getElementById("freightBillStatusForm.prepaidFreightBillForm.creditStatus");
		if(div) {
			var ptr=div.innerText;
			
	        if(ptr=="CASH"){
			   var result=ptr.fontcolor("red");
			   div.innerHTML=result;
	          }			
		}

		div = document.getElementById("freightBillStatusForm.collectFreightBillForm.creditStatus");
		if(div) {
			var ptr=div.innerText;
	        if(ptr=="CASH"){
			   var result=ptr.fontcolor("red");
			   div.innerHTML=result;
	          	
	        }
		}
		
});


/*function formatFields(variableNameList){
	if(variableNameList.length > 0){
		for(var i=0; i<variableNameList.length; i++ ){
		if(variableNameList[i] !=null){
				var tempVal = document.getElementById(variableNameList[i]).innerHTML;
				alert(tempVal.length);
				if(tempVal.length>29){
					document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,29)+"..";
				}
			}
		}
	}
}*/

function formatFieldsForHeader(variableNameListForHeader){
	if(variableNameListForHeader.length > 0){
		for(var i=0; i<variableNameListForHeader.length; i++ ){
		if(variableNameListForHeader[i] !=null){
			    var field = document.getElementById(variableNameListForHeader[i]);
			    if(field) {
					var tempVal = field.innerHTML;
					if(tempVal.length>26){
						document.getElementById(variableNameListForHeader[i]).innerHTML = tempVal.substring(0,26);
					}
			    }
			}
		}
	}
}

function formatFieldsValueForPrepaidCollectFrtDebtorAndOriginal(variableNameList){
	if(variableNameList.length > 0){
		for(var i=0; i<variableNameList.length; i++ ){
		if(variableNameList[i] !=null){
				var field = document.getElementById(variableNameList[i]);
				if(field) {
					var tempVal = field.innerHTML;
					if(tempVal.length>18){
						document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,18);
					}
				}
			}
		}
	}
}

function formatFieldsValueForCurrentPrepaidCollectDebtor (variableNameList){
	if(variableNameList.length > 0){
		for(var i=0; i<variableNameList.length; i++ ){
		if(variableNameList[i] !=null){
			    var field =  document.getElementById(variableNameList[i]);
			    if(field) {
					var tempVal =field.innerHTML;
					if(tempVal.length>31){
						document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,31);
					}
			    }
			}
		}
	}
}


function formatFieldsValueForShipRefAndConsigneePO (variableNameList){
	if(variableNameList.length > 0){
		for(var i=0; i<variableNameList.length; i++ ){
		if(variableNameList[i] !=null){
				var field = document.getElementById(variableNameList[i]);
				if(field) {
					var tempVal = field.innerHTML;
					if(tempVal.length>17){
						document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,17);
					}
				}
			}
		}
	}
}


/*function formatFieldsValueForStatusCode (variableNameList){
	if(variableNameList.length > 0){
		for(var i=0; i<variableNameList.length; i++ ){
		if(variableNameList[i] !=null){
				var tempVal = document.getElementById(variableNameList[i]).innerHTML;
				if(tempVal.length>12){
					document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,12)+".";
				}
			}
		}
	}
}
*/




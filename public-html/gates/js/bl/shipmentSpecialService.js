//added against 21739
//var changeInSpecialServiceGrid=false;
$(document).ready(function () {
	$("#spSvcEntityName").val('shipment');
	
	
	//Updated for D025134: 	Maintain Bill: SPECIAL SERVICE: ADV saved without PAYEE
	 $( "#specialServiceDialog" ).dialog({ autoOpen: false , width: 950 ,height:600, modal: true
		    ,close : function() {
		    	tabSequence('#shipmentForm',true,false);
		    	$('#specialServiceMasterForm').validationEngine('hideAll');
			},
	 		open : function (){
	 			tabSequence('#specialServiceDialog',false,false);
	 		},
	 			 buttons: {
		    	Cancel: function(){
		        	 $('#specialServiceMasterForm').validationEngine('hideAll');
		            	$( this ).dialog( "close" ); 
		            	isSpecialServiceChanged=false;
		            	removeErrorPointersSPSV();
		          },
		          Ok: function(){
		        	  if(( $('#statusCode').text()=='ISSUED'||$('#statusCode').text()=='CORRECTED' || isSpecialServiceModifiable==false)){
		        		  $("#specialServiceDialog").dialog( "close" );
		        		  isSpecialServiceChanged=false;
			        		return;
		        	  }
		        	  
		        	  if(!isSpecialServiceChanged){
			        		if($("#isSpecialServiceAdd").val()=="true"){
			        			alert('Please add a Special Service before you Click Ok');
			        			isSpecialServiceChanged=false;
			        		}else{
			        			alert('Special Service cannot be updated since no fields have been changed');
			        			isSpecialServiceChanged=false;
			        		}
				        	return;
			        	}
		        	  
		        	  if(validateSpecialServiceFields()){
		        		$("#specialServiceMasterForm").validationEngine('detach');
	        			$("#specialServiceMasterForm").validationEngine('attach');
	        			if ($("#specialServiceMasterForm").validationEngine('validate')) {
	        				removeErrorPointersSPSV();
			        	var specialServiceData = $('#specialServiceMasterForm').formSerialize();
			        	var newDataUrl = _context +"/shipment/specialservice/add";//?entityName=shipment
			        	if($("#isSpecialServiceAdd").val()=="false"){
			        		newDataUrl = _context +"/shipment/specialservice/edit";//?entityName=shipment
			        	}
			        	$.ajax({
			        		type: "POST",
			        		url: newDataUrl,
			        		data: specialServiceData,
			        		success: function(responseText){
			        			if(responseText.success){
			        				$('#msgDivSplSrv').hide();
			        				$('#specialServiceMasterForm').validationEngine('hideAll');
			        				$("#specialServiceDialog").dialog( "close" );
			        				isSpecialServiceChanged=false;
			        				$("#specialServiceGrid").trigger('reloadGrid');
			        			}else{
			        				$('#msgDivSplSrv').hide();
			        				showResponseMessages('msgDivSplSrv', responseText);
									$('#msgDivSplSrv').show();
			        			}
			        		}
			        	});
	        		}
		          } else{
		        	  $("#specialServiceMasterForm").validationEngine('detach');
		        	  $("#specialServiceMasterForm").validationEngine('attach');
		        	  $("#specialServiceMasterForm").validationEngine('validate');
		          }
		        	  //added against 21739
		        	  //changeInSpecialServiceGrid=true;
	        }, 
      //Added More button and functionality for Defect D025391		          
            More:function(){
            	if(( $('#statusCode').text()=='ISSUED'||$('#statusCode').text()=='CORRECTED' || isSpecialServiceModifiable==false)){
	        		  $("#specialServiceDialog").dialog( "close" );
	        		  isSpecialServiceChanged=false;
		        		return;
	        	  }
	        	  
	        	  if(!isSpecialServiceChanged){
		        		if($("#isSpecialServiceAdd").val()=="true"){
		        			alert('Please add a Special Service before you Click Ok');
		        			isSpecialServiceChanged=false;
		        		}else{
		        			alert('Special Service cannot be updated since no fields have been changed');
		        			isSpecialServiceChanged=false;
		        		}
			        	return;
		        	}
	        	  
	        	  if(validateSpecialServiceFields()){
	        		$("#specialServiceMasterForm").validationEngine('detach');
      			$("#specialServiceMasterForm").validationEngine('attach');
      			if ($("#specialServiceMasterForm").validationEngine('validate')) {
      				removeErrorPointersSPSV();
		        	var specialServiceData = $('#specialServiceMasterForm').formSerialize();
		        	var newDataUrl = _context +"/shipment/specialservice/add";//?entityName=shipment
		        	if($("#isSpecialServiceAdd").val()=="false"){
		        		newDataUrl = _context +"/shipment/specialservice/edit";//?entityName=shipment
		        	}
		        	$.ajax({
		        		type: "POST",
		        		url: newDataUrl,
		        		data: specialServiceData,
		        		success: function(responseText){
		        			if(responseText.success){
		        				$('#msgDivSplSrv').hide();
		        				$('#specialServiceMasterForm').validationEngine('hideAll');
		        				$("#specialServiceDialog").dialog( "close" );
		        				isSpecialServiceChanged=false;
		        				$("#specialServiceGrid").trigger('reloadGrid');
		        				$('#equipmentVinsight1').show();
		       				    $('#equipmentVinsight2').show();
		       				    $('#equipmentVinsight3').show();
		       				    $('#equipmentVinsight4').show();
		       				    $('#equipmentVinsight5').show();
		       				    $('#msgDivSplSrv').hide();
		       				    if(shipmentNotFound!=true)
		       				     openSpecialServices();
		       				 
		        			}else{
		        				$('#msgDivSplSrv').hide();
		        				showResponseMessages('msgDivSplSrv', responseText);
								$('#msgDivSplSrv').show();
		        			}
		        		}
		        	});
      		}
	          } else{
	        	  $("#specialServiceMasterForm").validationEngine('detach');
	        	  $("#specialServiceMasterForm").validationEngine('attach');
	        	  $("#specialServiceMasterForm").validationEngine('validate');
	          }
            	
            }          
	}});
	 
	 function removeErrorPointersSPSV()
	 {
	 	$("#specialServiceMasterForm").validationEngine('hideAll');
	 }	 
	 
	 $("#specialSerivceAdd").click(function(){
		 if(!(($('#statusCode').text()=='ISSUED') ||($('#statusCode').text()=='CORRECTED')||  isSpecialServiceAdd==false)){
			 if($('#shipmentNumberHidden').val()==''){
				 $('#equipmentVinsight1').hide();
				 $('#equipmentVinsight2').hide();
				 $('#equipmentVinsight3').hide();
				 $('#equipmentVinsight4').hide();
				 $('#equipmentVinsight5').hide();
			 }else{
				 $('#equipmentVinsight1').show();
				 $('#equipmentVinsight2').show();
				 $('#equipmentVinsight3').show();
				 $('#equipmentVinsight4').show();
				 $('#equipmentVinsight5').show();
			 }
		
		 $('#msgDivSplSrv').hide();
		 if(shipmentNotFound!=true)
		 openSpecialServices();
		 }
		 return false;
	});
	 //tabSequence("#tabSequenceSPSV");
});
/*
function formatSpecialServiceHeader(param ){
	var formattedStr = "";
	if(param == null || param==" ") return param;
	var paramArray = param.split(",");
	if(paramArray==undefined || paramArray.length<1)
		return param;

	var hashtable = {};

	for(var i=0;i<paramArray.length;i++){
		var key = paramArray[i];

		if(hashtable[key]==undefined && paramArray[i]){
			hashtable[key]=1;
		}else if(paramArray[i]){
			hashtable[key]=hashtable[key]+1;
		}
	}

	for(var key in hashtable){
		if(hashtable[key] >1){
			formattedStr += key+"("+hashtable[key]+") | "
		}else{
			formattedStr += key+" | "
		}

    }
	if(formattedStr.length > 1){
		formattedStr = " - "+ formattedStr.substring(0,formattedStr.lastIndexOf("|"));
	}

    return formattedStr;
}
*/
var specialServiceGridLoadComplete = function(){

    var userData = $("#specialServiceGrid").getGridParam('userData');
    if(userData && userData.updateSpecialServiceHeader) {
		setAccordianTabDetails('splServicesHeader', userData.updateSpecialServiceHeader);
	}

	$("#clauseGridHHGS").trigger('reloadGrid');
	
	/*//added against 21739
 	if(counterSplServicesReloaded==0){
 		numberOfInitialRowsSplServices=jQuery("#specialServiceGrid").jqGrid('getGridParam', 'records');
 		counterSplServicesReloaded++;
 	}
 	if(numberOfInitialRowsSplServices != jQuery("#specialServiceGrid").jqGrid('getGridParam', 'records')){
 		changeInCommodity=true;
 	}*/
 	//to disable checkbox of hold 22735
 	var status = $('#statusCode').text();
	if (status == 'ISSUED' || status == 'CORRECTED') {
 	$("[id^=jqg_specialServiceGrid]").attr('disabled',true);
 	$('#cb_specialServiceGrid') .attr('disabled', true);
	}

};


function openSpecialServices(){
	getRateBasisList();
	$("#specialServiceDialog" ).dialog( "option", "title", 'Special Services' );
	$("#specialServiceDialog" ).dialog('open'); 
	$('input[name="specialServiceFormLine1.payee"]').css("color", "");
	$("#specialServiceFormLine2").show();
	$("#specialServiceFormLine3").show();
	$("#specialServiceFormLine4").show();
	$("#specialServiceFormLine5").show();
	// Defect 24939
	$("#useranddateHeader").hide();
	$("#useranddate").hide();
	$("#specialServiceDialog").height(550);
	$("#specialServiceMasterForm").clearForm();
	removeClassesForSpecialServiceForm();
	populateDefaultPageOptions();
	$('input[name*="commodityLineNumber"]').attr("disabled", true);
	var shipmentNumber=$('#shipmentNumberHidden').val();
	//alert("shipmentNumber:::"+shipmentNumber);
	if(null==shipmentNumber || shipmentNumber==''){
		$('input[name*="equipmentVinsight"]').removeClass("validate[required]");
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
	}
	$("#isSpecialServiceAdd").val("true");
	isSpecialServiceChanged=false;
}  

function editSpecialService(id) {
	var seqNo = id.split('=')[1];
	//alert(seqNo);
	var bookingStatusCode=$('#statusCode').text();
	/*Booking Security*/
	if( bookingStatusCode=='ISSUED' ||  bookingStatusCode=='CORRECTED' || isSpecialServiceModifiable==false){
		$("#specialServiceDialog").gatesDisable();
	}
	else if(bookingStatusCode==undefined || bookingStatusCode==null || bookingStatusCode=='' || ((bookingStatusCode!='ISSUED')&& (bookingStatusCode!='CORRECTED')) || isSpecialServiceUpdate==true){
		$("#specialServiceDialog").gatesEnable();
		showSpecialServiceDialog(seqNo);
	}
	
}

function showSpecialServiceDialog(seqNo){
	isSpecialServiceChanged=false;
	var dataUrl = _context +"/shipment/specialservice/getSpecialService?seqNo="+seqNo;
	$("#specialServiceMasterForm").clearForm();
	$.ajax({
		url: dataUrl,
		success: function(responseText){
			removeClassesForSpecialServiceForm();
			getRateBasisList();
		    $('#msgDivSplSrv').hide();
			$("#specialServiceDialog").dialog('open');
			$("#isSpecialServiceAdd").val("false");
			$("#specialServiceFormLine2").hide();
			$("#specialServiceFormLine3").hide();
			$("#specialServiceFormLine4").hide();
			$("#specialServiceFormLine5").hide();
			// Defect 24939
			$("#useranddateHeader").show();
			$("#useranddate").show();
			$("#specialServiceMasterForm").loadJSON(responseText);
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val(responseText.specialServiceFormLine1.specialServiceCode);
			$('input[name="specialServiceFormLine1\\.amount"]').val(responseText.specialServiceFormLine1.amount);
			var formattedVal="";
			var val = responseText.specialServiceFormLine1.amount;
			if(val !="" && val !=null )
			{
				val = parseFloat(val).toFixed(2);
				var splittedAtDot = val.toString().split(".");	
				var commaSepratedVal = splittedAtDot[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					
				if(splittedAtDot.length==1)
				{
					formattedVal = commaSepratedVal + ".00";
				}
				else
				{
					formattedVal = commaSepratedVal + "." + splittedAtDot[1];
				}
			}
			$('label[for="specialServiceFormLine1\\.amountReadOnly"]').text(formattedVal.toString());
			$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').val(responseText.specialServiceFormLine1.commodityLineNumber);
			$('input[name="specialServiceFormLine1\\.equipmentVinsight"]').val(responseText.specialServiceFormLine1.equipmentVinsight);
			$('input[name="specialServiceFormLine1\\.numberOfUnit"]').val(responseText.specialServiceFormLine1.numberOfUnit);
			//changed for D025232
			var val1=responseText.specialServiceFormLine1.manualUserRate;
			if(val1 !="" && val1 !=null )
			{
				$('input[name="specialServiceFormLine1\\.manualUserRate"]').val(parseFloat(responseText.specialServiceFormLine1.manualUserRate).toFixed(2));
				
			}
			else
			{
				$('input[name="specialServiceFormLine1\\.manualUserRate"]').val(responseText.specialServiceFormLine1.manualUserRate);
			}
			$('select[name="specialServiceFormLine1\\.rateBasisCode"]').val(responseText.specialServiceFormLine1.rateBasisCode);
			$('input[name="specialServiceFormLine1\\.payee"]').val(responseText.specialServiceFormLine1.payee);
			$('input[name="specialServiceFormLine1\\.careOf"]').val(responseText.specialServiceFormLine1.careOf);
			$('input[name="specialServiceFormLine1\\.routingText"]').val(responseText.specialServiceFormLine1.routingText);
			$('select[name="specialServiceFormLine1\\.isDropOrPull"]').selected().val(responseText.specialServiceFormLine1.isDropOrPull);
			$('input[name="specialServiceFormLine1\\.source"]').val(responseText.specialServiceFormLine1.source);
			$('label[for="specialServiceFormLine1\\.sourceReadOnly"]').text(responseText.specialServiceFormLine1.source);
			$('select[name="specialServiceFormLine1\\.isApplyToAll"]').selected().val(responseText.specialServiceFormLine1.isApplyToAll);
			$('label[for="specialServiceFormLine1\\.processLevelCodeReadOnly"]').text(responseText.specialServiceFormLine1.processLevelCode);
			$('#passThruPayable1').val(responseText.specialServiceFormLine1.passThruPayable);
			//$('input[name="specialServiceFormLine1\\.processLevelCode"]').text(responseText.specialServiceFormLine1.processLevelCode);
			$("#specialServiceDialog").height(225);
			//alert(responseText.specialServiceFormLine1.carrierCode);
			if(responseText.specialServiceFormLine1.carrierCode=='03'){
				$('input[name="specialServiceFormLine1\\.payee"]').css("color", "purple");
			}else{
				$('input[name="specialServiceFormLine1\\.payee"]').css("color", "");
			}
			//populateEditRow(responseText);
			populateHiddenFields(1);
			applyUIValidations(1);
			checkRateBasisRequired(1);
			removeErrorPointersSPSV();
			isSpecialServiceChanged=false;
		}
	});
}


function unloadSpecialServiceGrid(){
	$('#specialServiceGrid').jqGrid('GridUnload');
}

function loadSpecialServiceGrid(){
	$('#specialServiceGrid').trigger("reloadGrid");
}

function setSpecialServicesDiv() {
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam(
			"reccount");
	var specialServiceDisplayText = "";
	//var specialServiceDisplayText = "Special Service ";
	if (specialServiceNumberCount > 0) {
		for ( var i = 1; i <= specialServiceNumberCount; i++) {
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i,
					"specialServiceCode");
			if (i == 1) {
				if (null != specialService && specialService != undefined
						&& specialService != false) {
					specialServiceDisplayText = specialServiceDisplayText
							+ ' - ' + specialService;
				}
			} else {
				if (null != specialService && specialService != undefined
						&& specialService != false) {
					specialServiceDisplayText = specialServiceDisplayText
							+ ', ' + specialService;
				}
			}
		}
	}
	setAccordianTabDetails('splServicesHeader', specialServiceDisplayText);
}


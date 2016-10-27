/**
 *  Javascript File for View Freight Bill Status details.
 *  
 **/

	$("#containerMovementStatusForm").validationEngine('attach');
	
	tabSequence('#containerMovementStatusForm');
	
$(document).ready(function() {
	 
	 if($('#indexedListSize').val()-1 == $("#index").val()){
		 $('#next').attr("disabled",true);
	 }
	 if($("#index").val() == 0 ){
		 $('#previous').attr("disabled",true);
	 }
	
	 if($('#indexedListSize').val() == 0) {
		 $('#next').attr("disabled",true);
		 $('#previous').attr("disabled",true);
	 }
	
	 $('#next').click(function(){
		 	$('#containerMovementStatusForm').attr("action","next");
			var index = parseInt($('#index').val())+1;
			//	alert(index);
			var indexedShpListSize = $('#indexedListSize').val();
			//alert(shipmentIdListSize);
			if(index < indexedShpListSize ){
				 
				 $("#containerMovementStatusForm").submit();
			}
		});
	 
	 $('#previous').click(function(){
		 	$('#containerMovementStatusForm').attr("action","previous");
		 	var index = $('#index').val();
		 	//alert(index);
			index= index-1;
			if(index >= 0){
				$("#containerMovementStatusForm").submit();
			}
			
		});
	 
	 	var variableNameList=new Array ("shipper", "consignee" ,"prepaidDebtor", "referenceNumberNotationForShipperRef", "collectDebtor", "referenceNumberNotationForConsigneePO"); 
    	//formatFields(variableNameList);
	 
	 	
	 	var viewImMoveValue= document.getElementById("viewImMove");
		var userValue = viewImMoveValue.options[viewImMoveValue.selectedIndex].value;
		var formValue = document.getElementById("viewImMoveFormValue");
		if(formValue.value[0] == 'N' ){ 
			document.getElementById("searchGridDiv1").style.display = "block";
			document.getElementById("searchGridDiv").style.display = "none";
		
		}
		if(formValue.value[0] == 'Y' ){ 
			document.getElementById("searchGridDiv").style.display = "block";
			document.getElementById("searchGridDiv1").style.display = "none";
		
		}

		/*shipment Security*/
		enforceSecurityTitle(isContainerMovementDisplay);
		enforceSecurityDivAndButtons("content",isContainerMovementDisplay);
		enforceSecurityDivAndButtons("buttondiv",isContainerMovementDisplay);
		
	 	
});

	// br 13
	function doChange(){
		//alert ("start");
		var viewImMoveValue= document.getElementById("viewImMove");
		var userValue = viewImMoveValue.options[viewImMoveValue.selectedIndex].value;
		//alert("user value -" +userValue);
		var formValue = document.getElementById("viewImMoveFormValue");
		//alert("form vallue--"+formValue.value[0]);
		if(formValue.value[0] == 'N' ){ 
			if(userValue == 'Y' ){
				// donot use this alert msg due to defect   -- show error msg  as per below  
				//alert("There are no more IM events.  To view non-IM event, type 'N'");
					// we are using this msg as per discussed with ashsis sir 
				      //alert("Booking/shipment is not Intermodal.  View IM not allowed."); // make comment do not need to show alert -- show error message 
				
				//$('#msgDiv').html("<div class=\"message_error\">Booking/shipment is not Intermodal.  View IM not allowed.</div>");
				//window.scrollTo(0, 0);
				//$('#msgDiv').show();
				//viewImMoveValue.value=formValue.value[0];
				
				// as per discussed with Himanshu sir only show pop up for error msg
			    alert("Booking/Shipment is not Intermodal. View IM not allowed."); // make comment do not need to show alert -- show error message 
			    viewImMoveValue.value=formValue.value[0];
				
			}
			/*if(formValue.value[0] == 'N' ){ 
				if(userValue == 'N' ){
					//alert("while user  value N--"+formValue.value[0]);
					viewImMoveValue.value=userValue;
					$('#msgDiv').empty();
				}
			}*/	
			//alert(" after form value --"+ formValue);
			//viewImMoveValue.options[viewImMoveValue.selectedIndex].value = formValuevalue[0];
			//alert(" after user value  --"+viewImMoveValue);
			
		}	
		/*if(formValue.value[0] == 'Y' ){
			alert ("start 2");
			if(userValue == 'N' ){
				alert ("3");
				viewImMoveValue.value=formValue.value[0];
				alert ("start 2 end ");
			}
		}*/
		
		/*// correct running method response coming from controller 
		if(formValue.value[0] == 'Y' ){
			$.ajax({
				   type: "GET",
				   url: _context +"/containerMovement/loadGridValueOnChageOfIMMoveFlag?",
				   data: "userValue="+ userValue,
				   		
				   success: function(responseText, statusText, xhr, $form){
					   alert(responseText.messages);
					   $("#cntrmvmtloggrid1").trigger('reloadGrid');
					   
					   $('#msgDiv').html("<div class=\"message_error\">" +responseText.messages +"</div>");
					$('#msgDiv').html("<div class=\"message_error\">Booking/shipment is not Intermodal.  View IM not allowed.</div>");
					window.scrollTo(0, 0);
					$('#msgDiv').show();  
				   }
				 });
		}*/
		
		if(formValue.value[0] == 'Y' ){
			if(userValue == 'Y' ){
				//alert("user value for  div  -"+userValue);
				document.getElementById("searchGridDiv").style.display = "block";
				document.getElementById("searchGridDiv1").style.display = "none";
			}else if(userValue == 'N' ){
				//	alert("user value for  div 1-"+userValue);
					document.getElementById("searchGridDiv1").style.display = "block";
					document.getElementById("searchGridDiv").style.display = "none";
				//	alert("user value for  div 1 end -"+userValue);
				}
			}
		
		
	}


	function formatFields(variableNameList){
		if(variableNameList.length > 0){
			for(var i=0; i<variableNameList.length; i++ ){
			if(variableNameList[i] !=null){
					var tempVal = document.getElementById(variableNameList[i]).innerHTML;
					if(tempVal.length>12){
						document.getElementById(variableNameList[i]).innerHTML = tempVal.substring(0,12)+"..";
					}
				}
			}
		}
	}



var HHGSSpecialServiceOverlay = "";


var somethingChangedSpecialServiceHHGS = "";


$(document).ready(function(){
	
	
	
	
	
	$('#shipmentSeqNumberSpcServ').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	
	$('#specialServiceCode').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	
	$('#numberOfUnit').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	
	$('#manualUserRate').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	$('#rateBasisCode').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	$('#amount').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	$('#payee').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	$('#routingText').change(function(){
		somethingChangedSpecialServiceHHGS = true;
	});
	
	
	
	
	// create add clause dialog at body onload
	
	
	createSplServiceDialog('Add Special Service');
	
	
	$('#specialSerivceAdd').click(function(){
		 $(":button:contains('OK & New')").prop("disabled", false).removeClass("ui-state-disabled");
		 $(":button:contains('Ok')").prop("disabled", false).removeClass("ui-state-disabled");
		 $(":button:contains('Clear')").prop("disabled", false).removeClass("ui-state-disabled");
		 $(":button:contains('Cancel')").prop("disabled", false).removeClass("ui-state-disabled");
		 $('#addHouseHoldSplServiceDialog').gatesEnable();
		var urlValue =  _context +"/houseHoldShipment/specialService/openSplServiceAdd";
		$.ajax({
			url : urlValue,
			type : "GET",
			
			success : function(responseText) {
				
				if(responseText.success==true){
					createSplServiceDialog('Add Special Service');
					setShipmentNumberDropDown(responseText);
					getRateBasisList();
					$("#shipmentHouseHoldSpecialServiceForm").clearForm();
					$('#splSvcAddress').html("");
					$('#splSvcAddrInfo').html("");
					isSpecialServiceAdd ='true';
					HHGSSpecialServiceOverlay= "addSpecialService";
					$( "#addHouseHoldSplServiceDialog" ).dialog('open'); 
					$('#shipmentSeqNumberSpcServ').focus();
					//tabSequence('#shipmentHouseHoldSpecialServiceForm');
				}else{
					
				}
		
			}
	});
	
});

});
function createSplServiceDialog(titleValue) {
	$( "#addHouseHoldSplServiceDialog" ).dialog({
		autoOpen : false,
		width :970,
		modal : true,
		title: titleValue,
		close : function()
		{
			$('#shipmentHouseHoldSpecialServiceForm').validationEngine('hideAll');
			tabSequence('#shipmentHouseHoldForm',true,false);
		},
		open : function(){
			tabSequence('#addHouseHoldSplServiceDialog',false,false);
		},
		buttons:{
			"OK & New":function()
			{if(HHGSSpecialServiceOverlay== "addSpecialService"){
				addAndNewHHGSSpecialService();
				$('#shipmentSeqNumberSpcServ').focus();	//for 23307
			}
				$('#msgDivSplSrv').hide(); //for 23589
			},
			Ok:function()
			{if(HHGSSpecialServiceOverlay== "addSpecialService"){
				addHHGSSpecialService();
			}else{
				updateHHGSSpecialService();
			}
				
			},
			
			
			Clear:function()
			{
				clearSpecialServiceRow();
				$('#msgDivSplSrv').hide();	//for 23589
				
			},
			Cancel:function()
			{
				
				if(somethingChangedSpecialServiceHHGS == true )
				{
	        		var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
			   		if(conf== true )
			   		{
			   			
			   			$('#shipmentHouseHoldSpecialServiceForm').validationEngine('hideAll');
			   			$("#addHouseHoldSplServiceDialog").dialog('close');
			   			
			   			somethingChangedSpecialServiceHHGS = false;	   		
					}
			   		else
			   		{
					}
				}
				else
				{
					$('#shipmentHouseHoldSpecialServiceForm').validationEngine('hideAll');
					$("#addHouseHoldSplServiceDialog").dialog('close');
				}
		        
			}
	}});
	$('#msgDivSplSrv').hide();//for 23589
}


function addHHGSSpecialService(){
	 if(validateSpecialServiceFields()){
 		$("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
			$("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
			if ($("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate')) {
				
				if($('#shipmentSeqNumberSpcServ option').length == 2)
					{
						$('#noAllWhenSingleBill').val('Y');
					}
				else
					{
						$('#noAllWhenSingleBill').val('N');
					}
				
				
     	var specialServiceData = $('#shipmentHouseHoldSpecialServiceForm').formSerialize();
     	var newDataUrl = _context +"/houseHoldShipment/specialService/add";//?entityName=shipment
          	$.ajax({
     		type: "POST",
     		url: newDataUrl,
     		data: specialServiceData,
     		success: function(responseText){
     			if(responseText.success){
     				$('#msgDivSplSrv').hide();
     				$('#shipmentHouseHoldSpecialServiceForm').validationEngine('hideAll');
     				$("#addHouseHoldSplServiceDialog").dialog( "close" );
     				$("#specialServiceGrid").trigger('reloadGrid');
     				$("#clauseGridHHGS").trigger('reloadGrid');
     			}else{
     				$('#msgDivSplSrv').hide();
     				showResponseMessages('msgDivSplSrv', responseText);
						$('#msgDivSplSrv').show();
     			}
     		}
     	});
		}
   } else{
 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate');
   }
}



function addAndNewHHGSSpecialService(){
	 if(validateSpecialServiceFields()){
	 		$("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
				$("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
				if ($("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate')) {
	     	var specialServiceData = $('#shipmentHouseHoldSpecialServiceForm').formSerialize();
	     	var newDataUrl = _context +"/houseHoldShipment/specialService/add";//?entityName=shipment
	          	$.ajax({
	     		type: "POST",
	     		url: newDataUrl,
	     		data: specialServiceData,
	     		success: function(responseText){
	     			if(responseText.success){
	     				$("#shipmentHouseHoldSpecialServiceForm").clearForm();
	     				$('#splSvcAddrInfo').text("");
	     				$('#splSvcAddress').text("");
	     				$("#shipmentHouseHoldSpecialServiceForm").loadJSON(responseText.data);
	     				
	     				$("#specialServiceGrid").trigger('reloadGrid');
	     				$("#clauseGridHHGS").trigger('reloadGrid');
	     			}else{
	     				$('#msgDivSplSrv').hide();
	     				showResponseMessages('msgDivSplSrv', responseText);
							$('#msgDivSplSrv').show();
	     			}
	     		}
	     	});
			}
	   } else{
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate');
	   }
}





function updateHHGSSpecialService(){
	 if(validateSpecialServiceFields()){
	 		$("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
				$("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
				if ($("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate')) {
	     	var specialServiceData = $('#shipmentHouseHoldSpecialServiceForm').formSerialize();
	     	var newDataUrl = _context +"/houseHoldShipment/specialService/update";//?entityName=shipment
	          	$.ajax({
	     		type: "POST",
	     		url: newDataUrl,
	     		data: specialServiceData,
	     		success: function(responseText){
	     			if(responseText.success){
	     				$('#msgDivSplSrv').hide();
	     				$('#shipmentHouseHoldSpecialServiceForm').validationEngine('hideAll');
	     				$("#addHouseHoldSplServiceDialog").dialog( "close" );
	     				$("#specialServiceGrid").trigger('reloadGrid');
	     				$("#clauseGridHHGS").trigger('reloadGrid');
	     			}else{
	     				$('#msgDivSplSrv').hide();
	     				showResponseMessages('msgDivSplSrv', responseText);
							$('#msgDivSplSrv').show();
	     			}
	     		}
	     	});
			}
	   } else{
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('detach');
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('attach');
	 	  $("#shipmentHouseHoldSpecialServiceForm").validationEngine('validate');
	   }
	
	
	
}
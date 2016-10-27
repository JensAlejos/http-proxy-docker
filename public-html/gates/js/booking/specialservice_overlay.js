var isSpecialServiceChanged=false;
$(document).ready(function () {
		
	var spsvCodeLineNumber=0;
	var truckerLineNumber=0;
	var payeeLineNumber=0;
	var equipmentVinsightLineNumber=0;
	
	var entityName=$("#spSvcEntityName").val();	
	/*$('input[name="specialServiceFormLine1\\.specialServiceCode"]').change(function(){
		var index=1;
		checkForSpecialServiceCdChg(index);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});*/
	/*$('input[name="specialServiceFormLine2\\.specialServiceCode"]').change(function(){
		var index=2;
		checkForSpecialServiceCdChg(index);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	$('input[name="specialServiceFormLine3\\.specialServiceCode"]').change(function(){
		var index=3;
		checkForSpecialServiceCdChg(index);
		if(entityName=='quote'){
			_isQuoteChanged = true;		
		}
		isSpecialServiceChanged = true;
	});
	$('input[name="specialServiceFormLine4\\.specialServiceCode"]').change(function(){
		var index=4;
		checkForSpecialServiceCdChg(index);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	$('input[name="specialServiceFormLine5\\.specialServiceCode"]').change(function(){
		var index=5;
		checkForSpecialServiceCdChg(index);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});*/
	
	//your custom button is #bDelete
	$('#del_specialServiceGrid').click(function(){ 

	    // Get the currently selected rows
	    toDelete = $("#specialServiceGrid").jqGrid('getGridParam','selarrrow');
	    // You'll get a pop-up confirmation dialog, and if you say yes,
	    // it will call "delete.php" on your server.
	    if(entityName != undefined && entityName == 'quote'){
	    	$('#delmodspecialServiceGrid').hide();
	    	if (confirm('Are you sure you want to delete?')) {
	    		//D028494
				if(isRatingAssociated('delete',toDelete))
				{
					if(checkTargetProcessRating())
					{
				      $('#dData').trigger('click');
				    }
					else{
						$('#eData').trigger('click');
					}
		        }
				else
				{
				$('#dData').trigger('click');	
				} 
	    	}
	    	else{
	    		$('#eData').trigger('click');
	    	}
	    }else{
	    	
	    }
	});


	
	
	$("#specialServiceFormLine1 input").change(function() {
		checkForSpecialServiceCdChg(1);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine1 select").change(function() {
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine2 input").change(function() {
		checkForSpecialServiceCdChg(2);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine2 select").change(function() {
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine3 input").change(function() {
		checkForSpecialServiceCdChg(3);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine3 select").change(function() {
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine4 input").change(function() {
		checkForSpecialServiceCdChg(4);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine4 select").change(function() {
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine5 input").change(function() {
		checkForSpecialServiceCdChg(5);
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine5 select").change(function() {
		if(entityName=='quote'){
			_isQuoteChanged = true;
		}
		isSpecialServiceChanged = true;
	});
	
	
	
	$('#imgSpecialServiceCodeLine1').click(function(){
		var index=1;
		casSpSvcCodeLookup(index);
	});
	$('#imgSpecialServiceCodeLine2').click(function(){
		var index=2;
		casSpSvcCodeLookup(index);
	});
	$('#imgSpecialServiceCodeLine3').click(function(){
		var index=3;
		casSpSvcCodeLookup(index);
	});
	$('#imgSpecialServiceCodeLine4').click(function(){
		var index=4;
		casSpSvcCodeLookup(index);
	});
	$('#imgSpecialServiceCodeLine5').click(function(){
		var index=5;
		casSpSvcCodeLookup(index);
	});
	
	$('#imgTruckerRateLine1').click(function(){
		var index=1;
		casTruckerLookup(index);
	});
	$('#imgTruckerRateLine2').click(function(){
		var index=2;
		casTruckerLookup(index);
	});
	$('#imgTruckerRateLine3').click(function(){
		var index=3;
		casTruckerLookup(index);
	});
	$('#imgTruckerRateLine4').click(function(){
		var index=4;
		casTruckerLookup(index);
	});
	$('#imgTruckerRateLine5').click(function(){
		var index=5;
		casTruckerLookup(index);
	});
	
	$('#imgPayeeLine1').click(function(){
		var index=1;
		casPayeeLookup(index);
	});
	$('#imgPayeeLine2').click(function(){
		var index=2;
		casPayeeLookup(index);
	});
	$('#imgPayeeLine3').click(function(){
		var index=3;
		casPayeeLookup(index);
	});
	$('#imgPayeeLine4').click(function(){
		var index=4;
		casPayeeLookup(index);
	});
	$('#imgPayeeLine5').click(function(){
		var index=5;
		casPayeeLookup(index);
	});
	
	$('select[name="specialServiceFormLine1\\.rateBasisCode"]').change(function(){
		var index=1;
		processRateBasis(index);
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine2\\.rateBasisCode"]').change(function(){
		var index=2;
		processRateBasis(index);
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine3\\.rateBasisCode"]').change(function(){
		var index=3;
		processRateBasis(index);
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine4\\.rateBasisCode"]').change(function(){
		var index=4;
		processRateBasis(index);
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine5\\.rateBasisCode"]').change(function(){
		var index=5;
		processRateBasis(index);
		checkForAHCustomization(index);
	});
	
	$('select[name="specialServiceFormLine1\\.isDropOrPull"]').change(function(){
		var index=1;
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine2\\.isDropOrPull"]').change(function(){
		var index=2;
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine3\\.isDropOrPull"]').change(function(){
		var index=3;
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine4\\.isDropOrPull"]').change(function(){
		var index=4;
		checkForAHCustomization(index);
	});
	$('select[name="specialServiceFormLine5\\.isDropOrPull"]').change(function(){
		var index=5;
		checkForAHCustomization(index);
	});

	$('input[name="specialServiceFormLine1\\.manualUserRate"]').change(function(){
		var index=1;
		checkForAHCustomization(index);
	});
	$('input[name="specialServiceFormLine2\\.manualUserRate"]').change(function(){
		var index=2;
		checkForAHCustomization(index);
	});
	$('input[name="specialServiceFormLine3\\.manualUserRate"]').change(function(){
		var index=3;
		checkForAHCustomization(index);
	});
	$('input[name="specialServiceFormLine4\\.manualUserRate"]').change(function(){
		var index=4;
		checkForAHCustomization(index);
	});
	$('input[name="specialServiceFormLine5\\.manualUserRate"]').change(function(){
		var index=5;
		checkForAHCustomization(index);
	});
	
	//Cas search Integration
	casPredictiveSearchOnAllLines();
	casPredictiveSearchOnAllPayee();
	
	//BR 5 All indicator implementation
	$('select[name="specialServiceFormLine1\\.isApplyToAll"]').change(function(){
		var index=1;
		validateApplyToAllInd(index);
	});
	$('select[name="specialServiceFormLine2\\.isApplyToAll"]').change(function(){
		var index=2;
		validateApplyToAllInd(index);
	});
	$('select[name="specialServiceFormLine3\\.isApplyToAll"]').change(function(){
		var index=3;
		validateApplyToAllInd(index);
	});
	$('select[name="specialServiceFormLine4\\.isApplyToAll"]').change(function(){
		var index=4;
		validateApplyToAllInd(index);
	});
	$('select[name="specialServiceFormLine5\\.isApplyToAll"]').change(function(){
		var index=5;
		validateApplyToAllInd(index);
	});
	
	$('#equipmentVinsight1').click(function(){
		var index="1";
		casEquipmentVinsightLookup(index);
	});
	$('#equipmentVinsight2').click(function(){
		var index="2";
		casEquipmentVinsightLookup(index);
	});
	$('#equipmentVinsight3').click(function(){
		var index="3";
		casEquipmentVinsightLookup(index);
	});
	$('#equipmentVinsight4').click(function(){
		var index="4";
		casEquipmentVinsightLookup(index);
	});
	$('#equipmentVinsight5').click(function(){
		var index="5";
		casEquipmentVinsightLookup(index);
	});

	getRateBasisList();

	populateDefaultPageOptions();
	if($('#bookingStatusCode').val()!='CANC')
		removeClassesForSpecialServiceForm();
	$('#msgDivSpSv').hide();
	
	$("#specialServiceMasterForm").validationEngine('attach');
	
	$('input[name="specialServiceFormLine1\\.manualUserRate"]').change(function(){
		var index="1";
		checkRateBasisRequired(index);
		changeValueToDecimalFormat(index);
	});
	$('input[name="specialServiceFormLine2\\.manualUserRate"]').change(function(){
		var index="2";
		checkRateBasisRequired(index);
		changeValueToDecimalFormat(index);
	});
	$('input[name="specialServiceFormLine3\\.manualUserRate"]').change(function(){
		var index="3";
		checkRateBasisRequired(index);
		changeValueToDecimalFormat(index);
	});
	$('input[name="specialServiceFormLine4\\.manualUserRate"]').change(function(){
		var index="4";
		checkRateBasisRequired(index);
		changeValueToDecimalFormat(index);
	});
	$('input[name="specialServiceFormLine5\\.manualUserRate"]').change(function(){
		var index="5";
		checkRateBasisRequired(index);
		changeValueToDecimalFormat(index);
	});
	
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');

	
	$('input[name="specialServiceFormLine1\\.payee"]').change(function(){
		var index="1";
		validatePayee(index);
	});
	$('input[name="specialServiceFormLine2\\.payee"]').change(function(){
		var index="2";
		validatePayee(index);
	});
	$('input[name="specialServiceFormLine3\\.payee"]').change(function(){
		var index="3";
		validatePayee(index);
	});
	$('input[name="specialServiceFormLine4\\.payee"]').change(function(){
		var index="4";
		validatePayee(index);
	});
	$('input[name="specialServiceFormLine5\\.payee"]').change(function(){
		var index="5";
		validatePayee(index);
	});
	
	$('input[name="specialServiceFormLine1\\.equipmentVinsight"]').change(function(){
		var index="1";
		checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine2\\.equipmentVinsight"]').change(function(){
		var index="2";
		checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine3\\.equipmentVinsight"]').change(function(){
		var index="3";
		checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine4\\.equipmentVinsight"]').change(function(){
		var index="4";
		checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine5\\.equipmentVinsight"]').change(function(){
		var index="5";
		checkEquipmentContainer(index);
	});
	
	$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').change(function(){
		var index="1";
		validateCommodityLineNumber(index);
	});
	$('input[name="specialServiceFormLine2\\.commodityLineNumber"]').change(function(){
		var index="2";
		validateCommodityLineNumber(index);
	});
	$('input[name="specialServiceFormLine3\\.commodityLineNumber"]').change(function(){
		var index="3";
		validateCommodityLineNumber(index);
	});
	$('input[name="specialServiceFormLine4\\.commodityLineNumber"]').change(function(){
		var index="4";
		validateCommodityLineNumber(index);
	});
	$('input[name="specialServiceFormLine5\\.commodityLineNumber"]').change(function(){
		var index="5";
		validateCommodityLineNumber(index);
	});
	//tabSequence('#specialServiceMasterForm',false,false);
	
	
});


function checkEquipmentContainer(index){
	var entityName=$("#spSvcEntityName").val();
	if(entityName=='booking'){
		var isRequiredUnit=$('#isRequireReceivedUnit').val();
		var shipmentNumber=$('#shipmentNumberHidden').val();
		var bookingId=$('#bookingId').val();
		var equipmentVinsight=$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val();
		if(!(equipmentVinsight == undefined || equipmentVinsight=='' || equipmentVinsight==null)){
			$.ajax({
				type : "POST",
				url : _context +"/booking/specialservice/getUnitOrEquipment",
				data : {
					
					vinsightequipment: equipmentVinsight,
					isRequiredUnit: isRequiredUnit,
					bookingId: bookingId
				},
				success : function(responseText) {	
					if(responseText.success){
						$('#msgDivSplSrv').hide();
						if(isRequiredUnit=='Y'){
							if(null!=responseText.data && undefined!=responseText.data && ''!=responseText.data ){
								$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(responseText.data[0]); 
								$("#equipmentVinsightHidden"+index).val(responseText.data[0]);
								$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val(responseText.data[0]);
							}else{
								showErrorMessage('VINsight ID# '+equipmentVinsight+' was not found.  Please select from Received unit search');
							}
							
						}else{
							if(null!=responseText.data && undefined!=responseText.data && ''!=responseText.data ){
								$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(responseText.data[2]);
								$("#equipmentVinsightHidden"+index).val(responseText.data[2]);
								$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(responseText.data[2]);
								$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val(responseText.data[0]);
							}else{
								showErrorMessage('Equipment Nbr# '+equipmentVinsight+' is not found.  Please select from variance by booking');
								//showErrorMessage('Container '+equipmentVinsight+' either not associated to booking '+shipmentNumber+' or doesnt exist.');
							}
						}
					validateCommodityLineNumber(index);
					}else{
						if(responseText.messages.error.length>0){
							$('#msgDivSplSrv').hide();
	        				showSpSVMessages('msgDivSplSrv', responseText);
							$('#msgDivSplSrv').show();
							
						}else{
							if(isRequiredUnit=='Y'){
								showErrorMessage('VINsight ID# '+equipmentVinsight+' was not found.  Please select from Received unit search');
								//showErrorMessage('VinSight# '+equipmentVinsight+' doesnt exist.');
							}else{
								showErrorMessage('Equipment Nbr# '+equipmentVinsight+' is not found.  Please select from variance by booking');
								//showErrorMessage('Container '+equipmentVinsight+' either not associated to booking '+shipmentNumber+' or doesnt exist.');
							}
						}
						
						$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(""); 
						$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val("");
						$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val("");
						$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val("");
						$("#equipmentVinsightHidden"+index).val("");
						validateEquipmentVinsight(index);
					}
				}
			});
		}else{
			$('#msgDivSplSrv').hide();
		}
	}
}

function validateCommodityLineNumber(index){
	var entityName=$("#spSvcEntityName").val();
	if(entityName=='booking'){
		var freightCount = $('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"?parseInt($('#totalCommodityLines').text()):0;
		var applyToAllInd=$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text();
		if(applyToAllInd=='N'){
			if(freightCount!=null && freightCount!=undefined && freightCount!=''){
				if(freightCount==1){
					$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val(1);
				}
			}
		}
	}
}


function validateEquipmentVinsight(index){
	var equipmentVinsight=$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val();
	var equipmentVinsightHidden=$("#equipmentVinsightHidden"+index).val();
	var receivedUnitId=$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val();
	var equipmentId=$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val();
	if($.trim(equipmentVinsight)==''){
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(""); 
		$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val("");
	}else if(receivedUnitId=='undefined' || receivedUnitId==null || receivedUnitId==""){				
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");  
    }else if(equipmentId=='undefined' || equipmentId==null || equipmentId==""){				
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val("");
    }else if(equipmentVinsight!=equipmentVinsightHidden){
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(""); 
		$("#equipmentVinsightHidden"+index).val("");
		$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val("");
	}
}

function validatePayee(index){
	var payee=$('input[name="specialServiceFormLine'+index+'\\.payee"]').val();
	var payeeHidden=$("#payeeHidden"+index).val();
	var organisationId=$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val();
	if($.trim(payee)==''){
		$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val(""); 
		$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.note"]').val("");
		$("#payeeHidden"+index).val("");
	} 
	else if(organisationId=='undefined' || organisationId==null || organisationId==""){ 
		$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val("");
		$("#payeeHidden"+index).val("");
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val(""); 
		$('input[name="specialServiceFormLine'+index+'\\.note"]').val("");
	}
	else if(payee!=payeeHidden){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val(""); 
		$("#payeeHidden"+index).val("");
		$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.note"]').val("");
	}
}




function checkRateBasisRequired(index){
	var manualUserRate=$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val();
	var isManualCharge=$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val();
	if(manualUserRate!=''){
		if($('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"] option:selected').text()==''){
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').addClass('validate[required]');
		}else{
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass('validate[required]');
		}
	}else if(manualUserRate==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass('validate[required]');
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass('validate[required]');
		}
	}
	if($('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val()!='' && 
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"] option:selected').text()!=''){
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').addClass('validate[required]');
	}
	
	/* 
	// D025727, remove this code.  Does not seem to match requirments or be working.
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N' ){
		var truckerRateAmount=$('truckerAmount'+index).val();
		if(manualUserRate!=truckerRateAmount){
			console.log("AH "+manualUserRate+" "+truckerRateAmount);
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customized");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
			//Defect : D018102
			$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("AH Customized");
		}
	}
	*/
}

/*
 * Rules for Defaulting and Clearing Special Services
 */

function populateDefaultPageOptions(){
	var entityName=$("#spSvcEntityName").val();
	if(entityName=='container'){
		$('select[name*="isApplyToAll"]').selected().val('N');
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
		$('select[name*="isApplyToAll"]').attr("disabled", true);
		$('input[name*="commodityLineNumber"]').attr("disabled", true);
		//$('input[name*="equipmentVinsight"]').attr("readonly", true);
	}else if(entityName=='booking'){
		$('select[name*="isApplyToAll"]').selected().val('Y');
		$('select[name*="isDropOrPull"]').selected().val(' ');
		$('input[name*="commodityLineNumber"]').attr("disabled", true);
		var shipmentNumber=$('#shipmentNumberHidden').val();
		if(null==shipmentNumber || shipmentNumber==''){
			$('input[name*="equipmentVinsight"]').removeClass("validate[required]");
			$('input[name*="equipmentVinsight"]').attr("disabled", true);
			$('#equipmentVinsight1').hide();
			$('#equipmentVinsight2').hide();
			$('#equipmentVinsight3').hide();
			$('#equipmentVinsight4').hide();
			$('#equipmentVinsight5').hide();
		}
	}else if(entityName=='quote'){
		$('select[name*="isApplyToAll"]').selected().val('N');
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
		$('select[name*="isApplyToAll"]').attr("disabled", true);
		$('#equipmentVinsight1').hide();
		$('#equipmentVinsight2').hide();
		$('#equipmentVinsight3').hide();
		$('#equipmentVinsight4').hide();
		$('#equipmentVinsight5').hide();
	}
	
}

function removeClassesForSpecialServiceForm(){
	$('input[name*="manualUserRate"]').removeClass("validate[required]");
	$('select[name*="rateBasisCode"]').removeClass("validate[required]");
	$('input[name*="numberOfUnit"]').removeClass("validate[required]");
	$('input[name*="numberOfUnit"]').removeClass("validate[noZero]");
	$('input[name*="commodityLineNumber"]').removeClass("validate[required]");
	$('input[name*="payee"]').removeClass("validate[required]");
	//$('input[name*="specialServiceDate"]').removeClass("validate[required]");
	clearSpecialServiceRow(1);
	clearSpecialServiceRow(2);
	clearSpecialServiceRow(3);
	clearSpecialServiceRow(4);
	clearSpecialServiceRow(5);
}

function checkForSpecialServiceCdChg(index){
	if($("#bookingStatusCode").val()!='CANC'){
		if($('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()=='' || 
				$('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()!=$('#specialServiceCode'+index).val()){
			//D026787
			clearSpecialServiceRow(index);
		}else{
			if($("#isSpecialServiceAdd").val()=="true"){
				isSpecialServiceChanged = true;
			}
		}		
	}
}

// D025727
function checkForAHCustomization(index,id){
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	if(truckerRateId==null || truckerRateId=='' || truckerRateId==undefined){ 
		// no trucker rate, skip
	} else {
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customized");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
			//Defect : D018102
			$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("AH Customized");
	}
}



function clearSpecialServiceRow(index){
	// Hidden field
	$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.shipmentAddnlChrsticIdDs"]').val("");
	
	
	// Form Fields
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val("");
	//Process level code - Apply to All Indicator
	$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val("");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+index+'\\.processLevelCodeReadOnly"]').text("");
	
	//Equipment/Vinsight -- SpecialServiceDate
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");
	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').val("");
	//Number Of Unit - Drop Pull
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val("");
	//$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("selectedIndex",0);
	$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').selected().val(" ");
	//rate -- Amount
	$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.amount"]').val("");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+index+'\\.amountReadOnly"]').text("");
	
	//RateBasis -- Source
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val(" ");
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("");
	
	//Payee Routing Text
	$('input[name="specialServiceFormLine'+index+'\\.payee"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.note"]').val("");
	
	//Removing the classes
	$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass("validate[required]");
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[noZero]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').removeClass("validate[required]");
	
	//Remove the read only fields
	//$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", false);
	//$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", false);
	$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr("disabled", false);
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',false);
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',false);
	$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr("disabled", false);
	$('input[name="specialServiceFormLine'+index+'\\.note"]').attr('disabled',false);
	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').attr('disabled',false);
	
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
	// D028465 - Added to reset the value of ApplyToAll Flag.
	var entityName=$("#spSvcEntityName").val();
	//D028930: 	Booking Spcl Svc 'Apply-to-All' should default to Y
	if(entityName != 'booking'){
		$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"]').selected().val("N");
	}
	
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val('');

	$('#specialServiceCode'+index).val('');
	$('#truckerAmount'+index).val('');
	$('#payeeHidden'+index).val('');
	$('#equipmentVinsightHidden'+index).val('');
	
	$('#imgPayeeLine'+index).show();
	$('#imgTruckerRateLine'+index).show();
	$('#specialServiceFormLine'+index).validationEngine('hideAll');
	
	$('#passThruCharge'+index).val('');
	$('#passThruPayable'+index).val('');
	
}

/*
 * Rules for applied when Special Service Code is selected from Predictive or Lookup
 */

function applyUIValidations(index){
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var entityName=$("#spSvcEntityName").val();
	hideErrorMessage();
	if(entityName!='quote'){
		if(truckerRateId==null || truckerRateId=='' || truckerRateId==undefined){
			processPayeeRequired(index);
		}
	}
	processRateRateBasis(index);
	processUnits(index);
	//processSpecialServicedate(index);
	processProcessLevelCode(index);
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');
}

function processPayeeRequired(index){
	
	var passThruCharge=	$('#passThruCharge'+index).val();
	var passThruPayable=$('#passThruPayable'+index).val();
	var spSvChargeCode= $('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val();
	var milTruckerRateId= $('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isDefaultFrtPayableCharge='';
	var accessorialAllowanceCode='';
	//Added PassthruPayable=="null" condition for Defect D026932
	if(/*(passThruCharge=='' || passThruCharge==null || passThruCharge==undefined) 
		&&*/ passThruPayable=='' || passThruPayable=="null" || passThruPayable==undefined || passThruPayable==null){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.note"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
		$('#imgTruckerRateLine'+index).hide();
		$('#imgPayeeLine'+index).hide();
		return;
	}
	/*if(passThruCharge!='' && passThruCharge!=null){
		spSvChargeCode=passThruCharge;
	}else*/ if(passThruPayable!='' && passThruPayable!=null){
		spSvChargeCode=passThruPayable;
	}
	if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='N'){
	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getChargeCode",
		data : {
			// ChargeCode
			chargeCode: spSvChargeCode
		},
		success : function(responseText) {			
			isDefaultFrtPayableCharge = responseText.data.isDefaultFrtPayableCharge;
			accessorialAllowanceCode = responseText.data.accessorialAllowanceCode;
			if(isDefaultFrtPayableCharge=='Y' ){
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').addClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
				$('#imgPayeeLine'+index).show();
			}else if(isDefaultFrtPayableCharge=='N' && (milTruckerRateId=='')){
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.note"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
				$('#imgPayeeLine'+index).hide();
			}else{
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
				$('#imgPayeeLine'+index).show();
			}
			if(null==accessorialAllowanceCode && accessorialAllowanceCode!=''){
				if(accessorialAllowanceCode=='A'){
					$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val('');
					$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr("selectedIndex",0);
					$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr('disabled',true);
					$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',true);
					$('#imgTruckerRateLine'+index).hide();
				}else if(accessorialAllowanceCode=='C'){
					$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr('disabled',false);
					$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',false);
					$('#imgTruckerRateLine'+index).show();
				}
			}
			if(isDefaultFrtPayableCharge!='Y'){
				var rateBasis=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
				if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='Y' && 
						$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='N' && (rateBasis==null || rateBasis=='') ){
					
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
					$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',false);
					$('#imgPayeeLine'+index).show();
				}
			}
			
		}
	});
	}
}

function processRateRateBasis(index){
	//Rate Basis/Rate Check :BR 15, BR2, BR5
	if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()=='Y'){
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr('disabled',false);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',false);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').addClass("validate[required]");
		$('#imgTruckerRateLine'+index).show();
	}else if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()=='N') {
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val("");
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr('disabled',true);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',true);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass("validate[required]");
		$('#imgTruckerRateLine'+index).hide();
	}else {
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').attr('disabled',false);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr('disabled',false);
		$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass("validate[required]");
		$('#imgTruckerRateLine'+index).show();
	}
}

function processUnits(index){
	if($('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val()=='N'){
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',true);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[noZero]");
	}else if($('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val()=='Y'){
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',false);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').addClass("validate[noZero]");
	}else{
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',false);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').addClass("validate[noZero]");
	}
}


function processProcessLevelCode(index){
	var processLvlCode=$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val();
	var entityName=$("#spSvcEntityName").val();
	switch(processLvlCode){
		case "S":
				validateApplyToAllInd(index);
				break;
		case "C":
				validateApplyToAllInd(index);
				break;
		case "E":
				validateApplyToAllInd(index);
				break;
	}
}



function validateApplyToAllInd(index){
	var shipmentNumber=$('#shipmentNumberHidden').val();
	var entityName=$("#spSvcEntityName").val();
	if($('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text()=='N'){
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='S'){
			$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').removeClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
			$('#equipmentVinsight'+index).hide();
		}
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='C'){
			if('booking'==entityName){
				processLevelC(index,entityName);
			}else if('quote'==entityName){
				processLevelC(index,entityName);
			}
		}
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='E'){
			if('quote'==entityName){
				$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"]').selected().val("N");
				processLevelC(index,entityName);
			}else{
				processLevelE(index,shipmentNumber);
			}
		}
	}else if($('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text()=='Y'){
		if('booking'==entityName){
			processForBooking(index);
		}else if('container'==entityName){
			processForBooking(index);
		}
	}
}
function processForBooking(index){
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.bookingFreightId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val('');
	$("#equipmentVinsightHidden"+index).val('');
	$('#equipmentVinsight'+index).hide();
}

function processLevelC(index,entityName){
	if(entityName=='booking'){
		var freightCount = $('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!="0"?parseInt($('#totalCommodityLines').text()):0;
		if(freightCount!=null && freightCount!=undefined && freightCount!=''){
			if(freightCount==1){
				$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val(1);
			}
		}
		$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", false);
		$('#equipmentVinsight'+index).hide();
	}else if(entityName=='quote'){
		var freightCount = $("#quoteCommodityGrid").getGridParam("reccount");
		if(freightCount!=null && freightCount!=undefined && freightCount!=''){
			if(freightCount==1){
				$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val(1);
			}
		}
		$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", false);
		$('#equipmentVinsight'+index).hide();
	}
}

function processLevelE(index,shipmentNumber){
	
	var entityName=$("#spSvcEntityName").val();
	
	if('booking'==entityName){
		if(null==shipmentNumber || shipmentNumber==''){
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').removeClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
			$('#equipmentVinsight'+index).hide();
		}else{
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').removeClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", false);
			$('#equipmentVinsight'+index).show();
		}
	}else if('container'==entityName){
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", false);
		$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"]').selected().val("N");
		
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val(getReceivedFreightId());
	}
	
	
}

/*
 java object structure
special_service_code
process_level_code
is_manual_charge
is_available_on_picklist
charge_code_expected
is_require_quantity
description
is_require_date

CAS returned fields
data.level -- Process level code
data.userspcd -- Lookup screen concatenated values	
data.chgres -- Charge Code
data.desc -- special service description
data.clcode -- Clause Code
data.reqdt -- IS REQUIRED DATE
data.reqqty -- IS REQUIRED QTNY
data.manchrg -- is manual charge
*/



function processRateBasis(index){
	var rateBasisCd=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
	
	if(rateBasisCd!=''){
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').addClass('validate[required]');
	}else if(rateBasisCd==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass('validate[required]');
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass('validate[required]');
		}
	}
	
	/* not using this, going to look for changes
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N'){
		if(rateBasisCd!='E'){
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customized");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
			//Defect : D018102
			$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("AH Customized");
		}
	}
	*/
}

/*
 * Populate fields on Special Service Predictive Search
 */

function populateFields(data,index){
	var entityName = $("#spSvcEntityName").val();
	//Process level code
	$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val(data.level);
	//Defect : D018102
	$('label[for="specialServiceFormLine'+index+'\\.processLevelCodeReadOnly"]').text(data.level);
	
	// is manual charge
	$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val(data.manchrg);
	// Charge Code
	$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.rticmr);
	// is required qty
	$('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val(data.reqqty);
	// is required date
	$('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val(data.reqdt);
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("Manual");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("Manual");
	
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val("N");
	
	$('#passThruCharge'+index).val(data.chgres);
	$('#passThruPayable'+index).val(data.passpay);
	
	if(entityName=='container'){
		$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"]').selected().val("N");
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val(getReceivedFreightId());
	}
}

function getReceivedFreightId(){
	var receivedFrtId=$('input[name="currentContainer.receivedFreightId"]').val();
	if(receivedFrtId ==null || receivedFrtId==undefined || receivedFrtId==''){
		receivedFrtId=$('input[name="receivedFreightId"]').val();
	}
	return receivedFrtId;
}

function getEquipmentId(){
	var equipmentId=$('select[name="currentContainer.equipmentId"]').selected().val();
	if(equipmentId ==null || equipmentId==undefined || equipmentId==''){
		
		equipmentId=$('input[name="containerNum"]').val();
	}
	if(equipmentId.indexOf('-')>0){
		equipmentId = equipmentId.substring(0, equipmentId.indexOf('-'));
	}

	
	return equipmentId;
}

/*
 * populating Edit Row
 */
function populateHiddenFields(index){
	//Hidden fields population	
	$('#specialServiceCode'+index).val($('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val());
	$('#truckerAmount'+index).val($('input[name="specialServiceFormLine'+index+'\\.amount"]').val());
	$('#payeeHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.payee"]').val());
	$('#equipmentVinsightHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val());
}

function casPredictiveSearchOnAllPayee(){
	var orgId='';
	$('input[name="specialServiceFormLine1\\.payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	timeout: 20000,
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
		autoSelectCriteria:function(item) {
		   if(item != null){
			     return 'true';
		  }else{
			  return 'false';
		  }
		},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
				
	 	},
	 	formatResult: function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	select : function(item) {
	 		if(validateSelectedPayee(item)){
	 			hideErrorMessage();
	 			orgId=item.orgid;	
		 		$("#payeeHidden1").val($('input[name="specialServiceFormLine1\\.payee"]').val());
		 		$('input[name="specialServiceFormLine1.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,1);
		 		}else if(item.count>1){
		 			casPayeeLookup(1);
		 			//checkForPayableCarrier(orgId,1,item);
		 		}
	 		} else {
	 			showErrorMessage("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine1.organisationId"]').val('');
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine1\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});
	$('input[name="specialServiceFormLine2\\.payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	timeout: 20000,
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
		autoSelectCriteria:function(item) {
		   if(item != null){
			     return 'true';
		  }else{
			  return 'false';
		  }
		},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
				
	 	},
	 	formatResult: function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	select : function(item) {
	 		if(validateSelectedPayee(item)){
	 			hideErrorMessage();
	 			orgId=item.orgid;	
		 		$("#payeeHidden2").val($('input[name="specialServiceFormLine2\\.payee"]').val());
		 		$('input[name="specialServiceFormLine2.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,2);
		 		}else if(item.count>1){
		 			casPayeeLookup(2);
		 			//checkForPayableCarrier(orgId,2,item);
		 		}
	 		} else {
	 			showErrorMessage("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine2.organisationId"]').val('');
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine2\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});	
	$('input[name="specialServiceFormLine3\\.payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	timeout: 20000,
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
		autoSelectCriteria:function(item) {
		   if(item != null){
			     return 'true';
		  }else{
			  return 'false';
		  }
		},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
				
	 	},
	 	formatResult: function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	select : function(item) {
	 		if(validateSelectedPayee(item)){
	 			hideErrorMessage();
	 			orgId=item.orgid;
		 		$("#payeeHidden3").val($('input[name="specialServiceFormLine3\\.payee"]').val());
		 		$('input[name="specialServiceFormLine3.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,3);
		 		}else if(item.count>1){
		 			casPayeeLookup(3);
		 			//checkForPayableCarrier(orgId,3,item);
		 		}
	 		} else {
	 			showErrorMessage("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine3.organisationId"]').val('');
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine3\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});	
	$('input[name="specialServiceFormLine4\\.payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	timeout: 20000,
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
		autoSelectCriteria:function(item) {
		   if(item != null){
			     return 'true';
		  }else{
			  return 'false';
		  }
		},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
				
	 	},
	 	formatResult: function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	select : function(item) {
	 		if(validateSelectedPayee(item)){
	 			hideErrorMessage();
	 			orgId=item.orgid;
		 		$("#payeeHidden4").val($('input[name="specialServiceFormLine4\\.payee"]').val());
		 		$('input[name="specialServiceFormLine4.organisationId"]').val(orgId);
		 		if(item.count==4 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,4);
		 		}else if(item.count>1){
		 			casPayeeLookup(4);
		 			//checkForPayableCarrier(orgId,4,item);
		 		}
	 		} else {
	 			showErrorMessage("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine4.organisationId"]').val('');
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine4\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});	
	$('input[name="specialServiceFormLine5\\.payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	timeout: 20000,
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
		autoSelectCriteria:function(item) {
		   if(item != null){
			     return 'true';
		  }else{
			  return 'false';
		  }
		},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
				
	 	},
	 	formatResult: function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	select : function(item) {
	 		if(validateSelectedPayee(item)){
	 			hideErrorMessage();
	 			orgId=item.orgid;	
		 		$("#payeeHidden5").val($('input[name="specialServiceFormLine5\\.payee"]').val());
				$('input[name="specialServiceFormLine5.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,5);
		 		}else if(item.count>1){
		 			casPayeeLookup(5);
		 			//checkForPayableCarrier(orgId,5,item);
		 			
		 		}
	 		} else {
	 			showErrorMessage("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine5.organisationId"]').val('');
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine5\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});	
}

function casPredictiveSearchOnAllLines(){
	//var url = _context+'/cas/autocomplete.do?method=getSpclSrvcBK&searchType=256';
	var entityName=$('#spSvcEntityName').val();
	var procLvlCd='ALL';
	if(entityName=='container'){
		procLvlCd='E';
	}/*else if(entityName=='quote'){
		procLvlCd='C';
	}*/
	$('input[name="specialServiceFormLine1\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Special Service Code",
	 	extraParams: {
	 			 method: 'getSpclSrvcBK',
		 		 searchType: '256',
		 		 param : function(){return procLvlCd;}
	 	},
	 	timeout: 20000, 
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=1;
			//$('#specialServiceFormLine1\\.specialServiceDesc').val(data.id+'-'+data.desc);
			clearSpecialServiceRow(index);
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val(data.id);
			$('#specialServiceCode1').val(data.id);
			//clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			isSpecialServiceChanged = true;
		},
		onChange:function(){
			var index=1;
			checkForSpecialServiceCdChg(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			/*isSpecialServiceChanged = true;*/
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.id.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				return true;
			}
			else {
				return false;
			}
		}
	});	
	$('input[name="specialServiceFormLine2\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Special Service Code",
	 	extraParams: {
		 		 method: 'getSpclSrvcBK',
		 		 searchType: '256',
		 		param : function(){return procLvlCd;}
	 	},
	 	timeout: 20000,
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=2;
			clearSpecialServiceRow(index);
			$('input[name="specialServiceFormLine2\\.specialServiceCode"]').val(data.id);
			$('#specialServiceCode2').val(data.id);
			//clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			isSpecialServiceChanged = true;
		},
		onChange:function(){
			var index=2;
			checkForSpecialServiceCdChg(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			/*isSpecialServiceChanged = true;*/
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.id.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				return true;
			}
			else {
				return false;
			}
		}
	});	
	$('input[name="specialServiceFormLine3\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Special Service Code",
	 	extraParams: {
		 		 method: 'getSpclSrvcBK',
		 		 searchType: '256',
			     param : function(){return procLvlCd;}
	 	},
	 	timeout: 20000,
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=3;
			clearSpecialServiceRow(index);
			$('input[name="specialServiceFormLine3\\.specialServiceCode"]').val(data.id);
			$('#specialServiceCode3').val(data.id);
			//clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			isSpecialServiceChanged = true;
		},
		onChange:function(){
			var index=3;
			checkForSpecialServiceCdChg(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			/*isSpecialServiceChanged = true;*/
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.id.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				return true;
			}
			else {
				return false;
			}
		}
	});	
	$('input[name="specialServiceFormLine4\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Special Service Code",
	 	extraParams: {
		 		 method: 'getSpclSrvcBK',
		 		 searchType: '256',
			 	 param : function(){return procLvlCd;}
		 		
	 	},
	 	timeout: 20000,
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=4;
			clearSpecialServiceRow(index);
			$('input[name="specialServiceFormLine4\\.specialServiceCode"]').val(data.id);
			$('#specialServiceCode4').val(data.id);
			//clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			isSpecialServiceChanged = true;
		},
		onChange:function(){
			var index=4;
			checkForSpecialServiceCdChg(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			/*isSpecialServiceChanged = true;*/
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.id.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				return true;
			}
			else {
				return false;
			}
		}
	});	
	$('input[name="specialServiceFormLine5\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Special Service Code",
	 	extraParams: {
		 		 method: 'getSpclSrvcBK',
		 		 searchType: '256',
			     param : function(){return procLvlCd;}
	 	},
	 	timeout: 20000, 
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=5;
			clearSpecialServiceRow(index);
			$('input[name="specialServiceFormLine5\\.specialServiceCode"]').val(data.id);
			$('#specialServiceCode5').val(data.id);
			//clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			isSpecialServiceChanged = true;
		},
		onChange:function(){
			var index=5;
			checkForSpecialServiceCdChg(index);
			if(entityName=='quote'){
				_isQuoteChanged = true;
			}
			/*isSpecialServiceChanged = true;*/
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.id.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				//Commented for Defect D029266
				//specialServiceSelectFunction(item,5);
				return true;
			}
			else {
				return false;
			}
		}
	});	
}




function casEquipmentVinsightLookup(index){
	var entityName=$('#spSvcEntityName').val();
	/*Booking Security*/
	if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		return;
	}
	//Here we checking the Entity status for allowing update in Special Service
	if(!checkEntityStatusForDisplay()){
		return;
	}
	
	if(entityName!='container'){
		equipmentVinsightLineNumber=index;
		var isRequiredUnit=$('#isRequireReceivedUnit').val();
		var shipmentNumber=$('#shipmentNumberHidden').val();
		var actionUrl =null;
		var header='Recieved Unit List';
		 if(isRequiredUnit=='N' || isRequiredUnit==null || isRequiredUnit==undefined || isRequiredUnit==''){
			actionUrl = _context + '/cas/containerListbyBKPopUpSearch.do?bookingId='+shipmentNumber;
			header="Container List";
		}else if(isRequiredUnit=='Y'){
			actionUrl = _context + '/cas/receivedUnitsLookupSearch.do?bookingId='+shipmentNumber;	
			header="Recieved Unit List";
		}
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, '', windowStyle);
	}
}

function receivedUnits(id){
	var myData=id.split('|');
	var shipmentNumber=$('#shipmentNumberHidden').val();
	var errorMessageString="Unit is not linked to Booking "+ $("#shipmentNumberHidden").val();
	if(myData.length>1){
		if(shipmentNumber==myData[1]){
			$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(myData[0]); 
			$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(myData[0]);
			$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.receivedUnitId"]').val(myData[0]);
			checkEquipmentContainer(equipmentVinsightLineNumber);
		}else{
			
			showErrorMessage(errorMessageString);
		}	
	}else{
		showErrorMessage(errorMessageString);
	}
}
function setContFields(id){
	var myData=id.split('|');
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(myData[0]);
	$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(myData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(myData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.receivedFreightId"]').val(myData[1]);
	checkEquipmentContainer(equipmentVinsightLineNumber);
}


function casSpSvcCodeLookup(index) {
	var entityName=$('#spSvcEntityName').val();
	/*Booking Security*/
	if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		return ;
	}
	//Here we checking the Entity status for allowing update in Special Service
	if(!checkEntityStatusForDisplay()){
		return;
	}
	
	
	spsvCodeLineNumber=index;
	var proclvlCd='ALL';
	if(entityName=='container'){
		proclvlCd='E';
	}
	//Code commented as all special services are visible at quote.
	/*else if(entityName=='quote'){
		proclvlCd='C';
	}*/
	var specialServiceCode = $('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val();
	var actionUrl = _context + '/cas/spclSrvBKLookup.do?filterValue1='+encodeURIComponent(specialServiceCode)+'|'+proclvlCd+'|'+'&srcScreen=QT';
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}
//"CDE,PLC,UPLD,RTICMR,DESCRIPTION,CLCDE,PASSPAY,RTIPMR,PASSCHRG"
// 0    1   2     3     4           5      6       7        8
//ADMINFEE|S|N--Y|ACC|ADMINISTRATIVE FEE|null|||ACC
function spclServiceUpdate(id){
	var entityName=$('#spSvcEntityName').val();
	var values = id.split("|");
	var rateQuantityDate = values[2].split("-");
	clearSpecialServiceRow(spsvCodeLineNumber);
	$('#specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceDesc').val(values[0]+'-'+values[4]);
	$('#specialServiceCode'+spsvCodeLineNumber).val(values[0]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceCode"]').val(values[0]);
	//Process level code
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.processLevelCode"]').val(values[1]);
	//Defect : D018102
	$('label[for="specialServiceFormLine'+spsvCodeLineNumber+'\\.processLevelCodeReadOnly"]').text(values[1]);
	
	// is manual charge
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isManualCharge"]').val(rateQuantityDate[2]);
	// Charge Code
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.chargeCodeExpected"]').val(values[3]);
	// is required qty
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireQuantity"]').val(rateQuantityDate[1]);
	// is required date
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireDate"]').val(rateQuantityDate[0]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.source"]').val("Manual");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+spsvCodeLineNumber+'\\.sourceReadOnly"]').text("Manual");
	
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	
	//D025911: 	Maintain Billing: Adding special service HHAGTLH from pop-up protects the payee field 
	$('#passThruCharge'+spsvCodeLineNumber).val(values[8]);
	$('#passThruPayable'+spsvCodeLineNumber).val(values[6]);
	
	
	checkForSpecialServiceCdChg(spsvCodeLineNumber);
	if(entityName=='quote'){
		_isQuoteChanged = true;
	}
	isSpecialServiceChanged = true;
	applyUIValidations(spsvCodeLineNumber);
	
}

/*
 * QUOTE|TRUCKER|HHGM_ALL|PHONE|TRUCKER_ORIGIN|TRUCKER_RAMP|DIRECTION|RATE|ZIP|BASE_RATE|DROP_PULL|FREE_TIME|
 * OVER_TIME|CHASE_RATE|CITY|STATE|ZIP_CODE|FUEL_SURTY|FUEL_SUR
*/


function casTruckerLookup(index) {
	var entityName=$('#spSvcEntityName').val();
	/*Booking Security*/
	if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		return;
	}
	//Here we checking the Entity status for allowing update in Special Service
	if(!checkEntityStatusForDisplay()){
		return;
	}
	
	truckerLineNumber=index;
	var actionUrl = _context + '/cas/bookingtruckerRateSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function truckerRateUpdate(id){
	var values = id.split("|");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.payee"]').val(values[1]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.milTruckerRateId"]').val(values[0]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.manualUserRate"]').val(values[7]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.rateBasisCode"]').selected().val("E");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.source"]').val("AH");
	//Defect : D018102
	$('label[for="specialServiceFormLine'+truckerLineNumber+'\\.sourceReadOnly"]').text("AH");
	
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	// Adding Drop and Pull
	$('#truckerAmount'+truckerLineNumber).val(values[7]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.isDropOrPull"]').selected().val(values[10]);
	//Only Payee or Trucker can be associated with Special Service
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.addressRoleId"]').val(values[20]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.note"]').val('');
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.organisationId"]').val(values[21]);
	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getTruckerRoutingText",
		data : {
			// Ramp City Code
			truckerRampCityCode: values[5],
			//Ramp
			truckerRamp: values[19],
			// Freight Location Code
			truckerFreightLocationCode: values[4]
		},
		success : function(responseText) {
			$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.note"]').val(responseText.data);
		}
	});
	isSpecialServiceChanged=true;
}


function casPayeeLookup(index) {
	var entityName=$('#spSvcEntityName').val();
	payeeLineNumber=index;
	/*Booking Security*/
	if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		return;
	}
	
	//Here we are checking the Entity status for allowing update in Special Service
	if(!checkEntityStatusForDisplay()){
		return;
	}
	
	var org_id=$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val();
	if(org_id==undefined || org_id==null || org_id==''){
		alert("Please select organization first");
		return;
	}
	
	//$('input[id="organistionId"'+payeeLineNumber+']')
	//var org_id=$('input[id="organistionId'+payeeLineNumber+'"]').val();
	
//	var payee=$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val();
	//var actionUrl = _context + '/cas/addRoleBKPopUpSearch.do?filterValue1='+payee+'&filterValue2='+org_id;
	var actionUrl = _context + '/cas/addRoleSPSRLookup.do?filterValue1='+org_id+'&filterValue2=04';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

//ORG_ID,ADD_ROLE, ADDR_TYPE,ATTENTION_LINE,CITY, C_O_NAME,NAME_QUALIFIER,ORG_NAME,STATE,ADDRESS,ZIP, PROVINCE,COUNTRY,SUITE
function payeeLookupUpdate(id){
	/*var values = id.split("|");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val(values[7]);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val(values[0]);
	$("#payeeHidden"+payeeLineNumber).val(values[7]);
	//Name, Addr_Line1, Addr_line2, Suite, City
	if(values[1]!=null || values[1]!=''){
		var orgAddressId=values[1];
		note=fetchAddresssDetails(orgAddressId,payeeLineNumber);
	}*/
	
	/*$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val(note);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(values[1]);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
	checkRateBasisRequired(payeeLineNumber);
	isSpecialServiceChanged=true;*/
}

//D026319: Maintain Booking: (and Maintain Billing) For Military cargo, need to check that the payee/trucker on the special service is allowed 
function validateSelectedPayee(item){
	var payeeValid = true;
	var carrierCode = "";
	if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
		carrierCode = item.carr;
	}
	$.ajax({
		type : "GET",
		async:false,
		data:{	
				carrierCode : carrierCode, 
				orgAbbr : item.abbr,
				tariff : $("#tariff").val() 
			 },
		url : _context + "/booking/specialservice/validatePayee",
		success : function(responseText) {
			payeeValid = responseText.success;
		}
	});
	return payeeValid;
}

function fetchAddresssDetails(item,payeeLineNumber){
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val('');
	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getAddressDetails",
		data : {
			addressId: item.addid
		},
		success : function(responseText) {
			/*$("#payeeHidden"+payeeLineNumber).val(item.name);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val(item.name);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val(item.orgid);*/
			//Name, Addr_Line1, Addr_line2, Suite, City
			/*var note=values[7]+","+values[9]+","+values[13]+","+values[4];
			if(values[1]!=null || values[1]!=''){
				var orgAddressId=values[1];
				note=fetchAddresssDetails(orgAddressId,payeeLineNumber);
			}*/
			
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val(responseText.data);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(item.arolid);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
			//Defect : D018102
			$('label[for="specialServiceFormLine'+payeeLineNumber+'\\.sourceReadOnly"]').text("Manual");
			
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
			checkRateBasisRequired(payeeLineNumber);
			isSpecialServiceChanged=true;
		}
	});
}
/*
 * 	jsonObj.put("orgid", item.get("ORGID"));
				jsonObj.put("name", item.get("ORGNNAME"));
				jsonObj.put("abbr", item.get("ORGCODE"));
				jsonObj.put("carr", item.get("CARRCODE"));
				jsonObj.put("count", item.get("AROLCOUNT"));
				jsonObj.put("arolid", item.get("AROLID"));
				jsonObj.put("addid", item.get("ORGADDID"));
 */


function clearErrMsg(){
	$("#specialServiceMasterForm").validationEngine('hideAll');
}
/*
function validateFrtPayableRequired(fields, rules, i, options){
alert("validateFrtPayableRequired " + fields.context.value);
if(fields.context.value==null || fields.context.value==""){
	return "* Payee's Carrier Code or Abbreviation is required";
}
}
*/



function validateRateRequired(){
//alert("validateRateRequired "+fields.context.value);
//if(fields.context.value==null || fields.context.value==""){
	return "* Rate is required";
//}
}
/*
function validateUnitsRequired(fields, rules, i, options){
alert("validateUnitsRequired "+fields.context.value);
if(fields.context.value==null || fields.context.value==""){
	fields.context.value="1";
	return "* Units are required";
}	
}
*/

/*
 * Validate Fields on Special Services
 */

function specialServiceLineCheck(index){
	var rateBasisCode=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
	if(rateBasisCode==null || rateBasisCode==""){
		rateBasisCode=null;
	}
	if($('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val()!="" || 
	   $('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val()!="" ||
	   $('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val()!="" ||
	   $('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val()!="" ||
	   	rateBasisCode!=null ||
	   $('input[name="specialServiceFormLine'+index+'\\.payee"]').val()!=""){
		return false;
	}
	return true;
	
}

function validatePayeeRequired(index){
	
	
	var entityName=$('#spSvcEntityName').val();
	var rateBasisCode=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
	var rate = $('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val();
	var passThruPayable=$('#passThruPayable'+index).val();
	
	if( entityName !='quote' && entityName !='booking' && rateBasisCode != null && rateBasisCode != '' && rate != '' && rate != null && passThruPayable != null && passThruPayable != ''){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').addClass("validate[required]");
	}else{
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
	}	
}

function validateSpecialServiceFields(){
	var isValid = true;
	//alert("Test: " + $('input[name="specialServiceFormLine1\\.specialServiceCode"]').val());
	if($("#isSpecialServiceAdd").val()!='false'){
		if($('input[name="specialServiceFormLine1\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(1)){
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;			
		}else{
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').removeClass("validate[required]");
			validatePayeeRequired(1);
		}
		if(isValid && $('input[name="specialServiceFormLine2\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(2)){
			$('input[name="specialServiceFormLine2\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			$('input[name="specialServiceFormLine2\\.specialServiceCode"]').removeClass("validate[required]");
			validatePayeeRequired(2);
		}
		if(isValid && $('input[name="specialServiceFormLine3\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(3)){
			$('input[name="specialServiceFormLine3\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			$('input[name="specialServiceFormLine3\\.specialServiceCode"]').removeClass("validate[required]");
			validatePayeeRequired(3);
		}
		if(isValid && $('input[name="specialServiceFormLine4\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(4)){
			$('input[name="specialServiceFormLine4\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			$('input[name="specialServiceFormLine4\\.specialServiceCode"]').removeClass("validate[required]");
			validatePayeeRequired(4);
		}
		if(isValid && $('input[name="specialServiceFormLine5\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(5)){
			$('input[name="specialServiceFormLine5\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			$('input[name="specialServiceFormLine5\\.specialServiceCode"]').removeClass("validate[required]");
			validatePayeeRequired(5);
		}
	}else{
		if($('input[name="specialServiceFormLine1\\.specialServiceCode"]').val()==""){
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
		}else{
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').removeClass("validate[required]");
		}
	}
	return isValid;
}




function showErrorMessage(errorMessageString){
	
	$('#msgDivSplSrv').html("<div class=\"message_error\">"+ errorMessageString+"</div>");
	$('#msgDivSplSrv').show();
}

function hideErrorMessage(){
	$('#msgDivSplSrv').html("");
	$('#msgDivSplSrv').hide();
}

function getRateBasisList() {
	// Get contact list for address. [commented for merge.]specialServiceFormLine1.rateBasisCode
	
	function callBack(responseText) { // cheetah
		$('select[name="specialServiceFormLine1\\.rateBasisCode"]').children().remove();
		$('select[name="specialServiceFormLine1\\.rateBasisCode"]').append("<option value=''></option>");
		for ( var i = 0; i < responseText.data.length; i++) {
			$('select[name="specialServiceFormLine1\\.rateBasisCode"]')
			.append($("<option/>", {
				value : responseText.data[i].code,
				text : responseText.data[i].description
			}));
		}
		if($("#isSpecialServiceAdd").val()!='false'){
			for(var i=2;i<=5;i++){
				$('select[name="specialServiceFormLine'+i+'\\.rateBasisCode"]').html($('select[name="specialServiceFormLine1\\.rateBasisCode"]').html());
			}
		}
	}
	
	getRateBasisListRequest(callBack); // cheetah
	
}

function getRateBasisListRequest(callBack) { // cheetah
	var gatesCheetah = window.gatesCheetah || {};
	if (gatesCheetah && gatesCheetah.rateBasisList && gatesCheetah.rateBasisList !== null)  {
		console.log('Cheetah: getRateBasisListRequest from cache');
		callBack(gatesCheetah.rateBasisList);
		return;
	}
	console.log('Cheetah: getRateBasisListRequest from Ajax');
	// Get contact list for address. [commented for merge.]specialServiceFormLine1.rateBasisCode
	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getRateBasisList",
		data : {},
		success : callBack
	});
}

function addroleUpdateForSPSR(data) {
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val('');
		var values = data.split("|");
		var note = formatAddRoleDscrForSPSV(values[4],values[7],values[2],values[6]);
		//$("#payeeHidden"+payeeLineNumber).val(item.name);
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val(note);
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(values[9]);
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
		//Defect : D018102
		$('label[for="specialServiceFormLine'+payeeLineNumber+'\\.sourceReadOnly"]').text("Manual");
		
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
		checkRateBasisRequired(payeeLineNumber);
		isSpecialServiceChanged=true;
	
}

function formatAddRoleDscrForSPSV(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	if (nameQualifier != "") {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	/*if (city != "") {
		cityTemp = " - " + city;
	}*/
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

function checkEntityStatusForDisplay(){
	var entityName=$('#spSvcEntityName').val();
	if(entityName == 'quote'){
		if(!($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR")) {
			return false;
		}
	}else if(entityName == 'booking'){
		var bookingStatusCode=$('#bookingStatusCode').val();
		if(!(bookingStatusCode==undefined || bookingStatusCode==null || bookingStatusCode=='' || bookingStatusCode!='CANC')){
			return false;
		}
	}else if(entityName == 'container'){
		var shipmentStatus=$('#shipmentStatus').val();
		if(shipmentStatus =='ISSD' || shipmentStatus=='CORR') {
			return false;
		}
	}
	return true;
	
}

function checkForPayableCarrier(orgId,payeeLineNumber,item){
	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getPayableCarrier",
		data : {
			organizationId: orgId
		},
		success : function(responseText) {
			
			if(null!=responseText && null!=responseText.data){
				/*$("#payeeHidden"+payeeLineNumber).val(item.name);
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val(item.name);
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val(item.orgid);*/
				
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val(responseText.data[1]);
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(responseText.data[0]);
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
				//Defect : D018102
				$('label[for="specialServiceFormLine'+payeeLineNumber+'\\.sourceReadOnly"]').text("Manual");
				
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
				$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
				checkRateBasisRequired(payeeLineNumber);
				
			}else{
				casPayeeLookup(payeeLineNumber); 
			}
			isSpecialServiceChanged=true;
		}
	});
}

function changeValueToDecimalFormat(index){
	var manualUserRate=$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val();
	
	if(manualUserRate !=null && manualUserRate !='' && ! isNaN(manualUserRate) && manualUserRate != undefined){
		manualUserRate = parseFloat(manualUserRate);		
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val(manualUserRate.toFixed(2));
	}
}
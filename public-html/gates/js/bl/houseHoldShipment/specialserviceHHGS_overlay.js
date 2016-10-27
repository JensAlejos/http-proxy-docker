/*$(document).ready(function () {
	$("#spSvcEntityName").val('shipment');
	var spsvCodeLineNumber=0;
	var truckerLineNumber=0;
	var payeeLineNumber=0;
	var equipmentVinsightLineNumber=0;
	
	$('input[name="specialServiceCode"]').change(function(){
		var index=1;
		checkForSpecialServiceCdChg(index);
	});
	
	
	$('#imgSpecialServiceCodeLine1').click(function(){
		var index=1;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
	});
	
	
	$('#imgTruckerRateLine1').click(function(){
		var index=1;
		casTruckerLookup(index);
	});
	
	
	
	$('#imgPayeeLine1').click(function(){
		var index=1;
		casPayeeLookup(index);
	});
	
	
	$('select[name="specialServiceFormLine1\\.rateBasisCode"]').change(function(){
		var index=1;
		processRateBasis(index);
	});
	
	
	//Cas search Integration
	casPredictiveSearchOnAllLines();
	
	//BR 5 All indicator implementation
	$('select[name="specialServiceFormLine1\\.isApplyToAll"]').change(function(){
		var index=1;
		validateApplyToAllInd(index);
	});
	
	
	$('#equipmentVinsight1').click(function(){
		var index="1";
		casEquipmentVinsightLookup(index);
	});
		
	getRateBasisList();
	
	
	populateDefaultPageOptions();
	
	removeClassesForSpecialServiceForm();
	$('#msgDivSpSv').hide();
	
	$("#specialServiceMasterForm").validationEngine('attach');
	
	$('input[name="specialServiceFormLine1\\.manualUserRate"]').change(function(){
		var index="1";
		checkRateBasisRequired(index);
	});
	
	
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');

	$('input[name="specialServiceFormLine1\\.payee"]').change(function(){
		var index="1";
		validatePayee(index);
	});
	
	
	$('input[name="specialServiceFormLine1\\.equipmentVinsight"]').change(function(){
		var index="1";
		validateEquipmentVinsight(index);
	});
	
	
	$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').change(function(){
		var index="1";
		validateCommodityLineNumber(index);
	});
	
	
});

function validateCommodityLineNumber(index){
	//var freightCount = $("#freightGrid").getGridParam("reccount");
	var freightCount = $("#commodityGrid").getGridParam("reccount");
	//alert("freightCount"+freightCount);
	var applyToAllInd=$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text();
	if(applyToAllInd=='N'){
		if(freightCount!=null && freightCount!=undefined && freightCount!=''){
			if(freightCount==1){
				$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val(1);
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
	}//Block commented by Mangesh for testing purpose
}

function validatePayee(index){
	var payee=$('input[name="specialServiceFormLine'+index+'\\.payee"]').val();
	var payeeHidden=$("#payeeHidden"+index).val();
	var addressRoleId=$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val();
	if($.trim(payee)==''){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val(""); 
		$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val("");
	} 
	else if(addressRoleId=='undefined' || addressRoleId==null || addressRoleId==""){				
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val("");  
		$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val("");
    }
	else if(payee!=payeeHidden){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val(""); 
		$("#payeeHidden"+index).val("");
		$('input[name="specialServiceFormLine'+index+'\\.addressRoleId"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val("");
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
	
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N' ){
		var truckerRateAmount=$('truckerAmount'+index).val();
		if(manualUserRate!=truckerRateAmount){
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customised");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
			$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("disabled", false);
		}else{
			$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("disabled", true);
		}
	}
}


 * Rules for Defaulting and Clearing Special Services
 

function populateDefaultPageOptions(){
	var entity_name=$("#spSvcEntityName").val();
	if(entity_name=='container'){
		$('select[name*="isApplyToAll"]').selected().val('N');
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
		$('select[name*="isApplyToAll"]').attr("disabled", true);
		//$('input[name*="equipmentVinsight"]').attr("readonly", true);
	}else if(entity_name=='shipment'){
		$('select[name*="isApplyToAll"]').selected().val('Y');
		$('select[name*="isDropOrPull"]').selected().val(' ');
		$('input[name*="commodityLineNumber"]').attr("disabled", true);
		var shipmentNumber=$('#shipmentNumberHidden').val();
		if(null==shipmentNumber || shipmentNumber==''){
			$('input[name*="equipmentVinsight"]').removeClass("validate[required]");
			$('input[name*="equipmentVinsight"]').attr("disabled", true);
		}
	}
	
}
function populateDefaultSelectOptions(){
	$('select[name*="isApplyToAll"]').attr("selectedIndex",0);
	$('select[name*="isDropOrPull"]').attr("selectedIndex",0);
}

function removeClassesForSpecialServiceForm(){
	$('input[name*="manualUserRate"]').removeClass("validate[required]");
	$('select[name*="rateBasisCode"]').removeClass("validate[required]");
	$('input[name*="numberOfUnit"]').removeClass("validate[required]");
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
	if($('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()=='' || 
			$('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()!=$('#specialServiceCode'+index).val()){
		clearSpecialServiceRow(index);
	}
}

function clearSpecialServiceRow(index){
	//alert("Test1");
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
	//Equipment/Vinsight -- SpecialServiceDate
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");
	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').val("");
	//Number Of Unit - Drop Pull
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val("");
	//$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("selectedIndex",0);
	$('select[name="specialServiceFormLine1\\.isDropOrPull"]').selected().val(" ");
	//rate -- Amount
	$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.amount"]').val("");
	//RateBasis -- Source
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr("selectedIndex",0);
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("");
	//Payee Routing Text
	$('input[name="specialServiceFormLine'+index+'\\.payee"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val("");
	
	//Removing the classes
	$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass("validate[required]");
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
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
	$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr("disabled", false);
	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').attr('disabled',false);
	
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
	
	
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.organisationId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val('');

	$('#specialServiceCode'+index).val('');
	$('#truckerAmount'+index).val('');
	$('#payeeHidden'+index).val('');
	$('#equipmentVinsightHidden'+index).val('');
	$('#equipmentVinsight'+index).hide();
	$('#imgPayeeLine'+index).show();
	$('#imgTruckerRateLine'+index).show();
	$('input[name="specialServiceFormLine1\\.payee"]').css("background-color", "");
}


 * Rules for applied when Special Service Code is selected from Predictive or Lookup
 

function processUIValidations(index){
	processPayeeRequired(index);
	processRateRateBasis(index);
	processUnits(index);
	//processSpecialServicedate(index);
	processProcessLevelCode(index);
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');
}

 * Rules for applied when Special Service Code is selected from Predictive or Lookup
 

function applyUIValidations(index){
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	if(truckerRateId==null || truckerRateId=='' || truckerRateId==undefined){
		processPayeeRequired(index);
	}
	processRateRateBasis(index);
	processUnits(index);
	//processSpecialServicedate(index);
	processProcessLevelCode(index);
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');
}
function processPayeeRequired(index){
	var spSvChargeCode= $('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val();
	var milTruckerRateId= $('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isDefaultFrtPayableCharge='';
	var accessorialAllowanceCode='';
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getChargeCode",
		data : {
			// ChargeCode
			chargeCode: spSvChargeCode
		},
		success : function(responseText) {			
			isDefaultFrtPayableCharge = responseText.data.isDefaultFrtPayableCharge;
			accessorialAllowanceCode = responseText.data.accessorialAllowanceCode;
			if(isDefaultFrtPayableCharge=='Y'){
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').addClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',false);
				$('#imgPayeeLine'+index).show();
			}else if(isDefaultFrtPayableCharge=='N' && (milTruckerRateId=='')){
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',true);
				$('#imgPayeeLine'+index).hide();
			}else{
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',false);
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
			
		}
	});
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
		//$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',true);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
	}else if($('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val()=='Y'){
		//$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',false);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').addClass("validate[required]");
	}else{
		//$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').attr('disabled',false);
		$('input[name="specialServiceFormLine'+index+'\\.numberOfUnit"]').removeClass("validate[required]");
	}
}


function processProcessLevelCode(index){
	var processLvlCode=$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val();
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
	//alert("Test3");
	var shipmentNumber=$('#shipmentNumber').val();
	var entity_name=$("#spSvcEntityName").val();
	if($('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text()=='N'){
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='S'){
			$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').removeClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
			$('#equipmentVinsight'+index).hide();
		}
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='C'){
			processLevelC(index);
		}
		if($('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val()=='E'){
			
			processLevelE(index,shipmentNumber);
		}
	}else if($('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text()=='Y'){
		if('shipment'==entity_name){
			processForShipment(index);
		}else if('container'==entity_name){
			
			processForShipment(index);
		}
	}
}

function processForShipment(index){
	//alert("Test2");
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').removeClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", true);
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.receivedUnitId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.shipmentFreightId"]').val('');
	$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val('');
	$("#equipmentVinsightHidden"+index).val('');
	$('#equipmentVinsight'+index).hide();
}

function processLevelC(index){
	var freightCount = $("#commodityGrid").getGridParam("reccount");
	if(freightCount!=null && freightCount!=undefined && freightCount!=''){
		if(freightCount==1){
			$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').val(1);
		}
	}
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').addClass("validate[required]");
	$('input[name="specialServiceFormLine'+index+'\\.commodityLineNumber"]').attr("disabled", false);
	$('#equipmentVinsight'+index).hide();
}

function processLevelE(index,shipmentNumber){
	
	var entity_name=$("#spSvcEntityName").val();
	//alert("Test4"+entity_name);
	if('shipment'==entity_name){
		if(null==shipmentNumber || shipmentNumber==''){
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').removeClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", true);
			$('#equipmentVinsight'+index).hide();
		}else{
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').addClass("validate[required]");
			$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", false);
			$('#equipmentVinsight'+index).show();
		}
	}else if('container'==entity_name){
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').addClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').attr("disabled", false);
		$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"]').selected().val("N");
		
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(getEquipmentId());
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val(getReceivedFreightId());
	}
	
	
}


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
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N'){
		if(rateBasisCd!='E'){
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customized");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
		}
	}
}

function processCalculateAmount(index){
	var rateBasisCd=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
	
	if(rateBasisCd!=''){
		$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').addClass('validate[required]');
	}else if(rateBasisCd==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').removeClass('validate[required]');
			$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').removeClass('validate[required]');
		}
	}
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N'){
		if(rateBasisCd!='E'){
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH Customised");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
		}
	}
}

function populateEditRow(responseText){
	$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val(responseText.specialServiceFormLine1.specialServiceCode);
	$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').val(responseText.specialServiceFormLine1.commodityLineNumber);
	
	//SpecialService code - Apply to All Indicator
	$('select[name="specialServiceFormLine1\\.isApplyToAll"]').selected().val(responseText.specialServiceFormLine1.isApplyToAll);
	$('input[name="specialServiceFormLine1\\.processLevelCode"]').text(responseText.specialServiceFormLine1.processLevelCode);
	
	//Equipment/Vinsight-Date
	$('input[name="specialServiceFormLine1\\.equipmentVinsight"]').val(responseText.specialServiceFormLine1.equipmentVinsight);
	//$('input[name="specialServiceFormLine1\\.specialServiceDate"]').val(responseText.specialServiceFormLine1.specialServiceDate);
	//Units- Drop/Pull
	//Number Of Unit - Drop Pull
	$('input[name="specialServiceFormLine1\\.numberOfUnit"]').val(responseText.specialServiceFormLine1.numberOfUnit);
	$('select[name="specialServiceFormLine1\\.isDropOrPull"]').selected().val(responseText.specialServiceFormLine1.isDropOrPull);
	//Rate- Amount
	$('input[name="specialServiceFormLine1\\.manualUserRate"]').val(responseText.specialServiceFormLine1.manualUserRate);
	$('input[name="specialServiceFormLine1\\.amount"]').val(responseText.specialServiceFormLine1.amount);
	//Rate Basis - Source
	$('select[name="specialServiceFormLine1\\.rateBasisCode"]').val(responseText.specialServiceFormLine1.rateBasisCode);
	$('input[name="specialServiceFormLine1\\.source"]').text(responseText.specialServiceFormLine1.source);
	//Payee-Routing Text
	$('input[name="specialServiceFormLine1\\.payee"]').val(responseText.specialServiceFormLine1.payee);
	$('input[name="specialServiceFormLine1\\.routingText"]').val(responseText.specialServiceFormLine1.routingText);
	
	//Hidden fields population	
	$('input[name="specialServiceFormLine1\\.seqNo"]').val(responseText.specialServiceFormLine1.seqNo);
	$('input[name="specialServiceFormLine1\\.isManualCharge"]').val(responseText.specialServiceFormLine1.isManualCharge);
	$('input[name="specialServiceFormLine1\\.isRequireQuantity"]').val(responseText.specialServiceFormLine1.isRequireQuantity);
	$('input[name="specialServiceFormLine1\\.isRequireDate"]').val(responseText.specialServiceFormLine1.isRequireDate);
	$('input[name="specialServiceFormLine1\\.chargeCodeExpected"]').val(responseText.specialServiceFormLine1.chargeCodeExpected);
	$('input[id="specialServiceCode1"]').val(responseText.specialServiceFormLine1.specialServiceCode);
	$('input[name="specialServiceFormLine1\\.addressRoleId"]').val(responseText.specialServiceFormLine1.addressRoleId);
	$('input[name="specialServiceFormLine1\\.isMilTruckerRateCustomized"]').val(responseText.specialServiceFormLine1.isMilTruckerRateCustomized);
	$('input[id="truckerAmount1"]').val(responseText.specialServiceFormLine1.amount);
}

 * Populate fields on Special Service Predictive Search
 

function populateFields(data,index){
	var entity_name = $("#spSvcEntityName").val();
	//alert("data.chgres:::"+data.chgres);
	//Process level code
	$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val(data.level);
	// is manual charge
	$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val(data.manchrg);
	// Charge Code
	$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.chgres);
	// is required qty
	$('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val(data.reqqty);
	// is required date
	$('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val(data.reqdt);
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("Manual");
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val("N");

	
	if(entity_name=='container'){
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


 * populating Edit Row
 
function populateHiddenFields(index){
	//Hidden fields population	
	$('#specialServiceCode'+index).val($('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val());
	$('#truckerAmount'+index).val($('input[name="specialServiceFormLine'+index+'\\.amount"]').val());
	$('#payeeHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.payee"]').val());
	$('#equipmentVinsightHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val());
}


function casPredictiveSearchOnAllLines(){
	//var url = _context+'/cas/autocomplete.do?method=getSpclSrvcBK&searchType=256';
	var entity_name=$('#spSvcEntityName').val();
	var procLvlCd='ALL';
	if(entity_name=='container'){
		procLvlCd='E';
	}else if(entity_name=='quote'){
		procLvlCd='C';
	}
	$('input[name="specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 			 method: 'getSpclSrvcBK',
		 		 searchType: '256',
		 		 param : function(){return procLvlCd;}
	 	},
		formatItem: function(data) {
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			var index=1;
			//$('#specialServiceFormLine1\\.specialServiceDesc').val(data.id+'-'+data.desc);
			$('input[specialServiceCode"]').val(data.id);
			//$('#specialServiceCode1').val(data.id);
			clearSpecialServiceRow(index);
			populateFields(data,index);
			applyUIValidations(index);
		}
	});	
	
}


function casEquipmentVinsightLookup(index){
	equipmentVinsightLineNumber=index;
	var shipmentNum= $("#shipmentNumber").val();
	var seqNum= $("#shipmentSequenceNumber").val();
	var corrNum= $("#shipmentCorrectionNumber").val();
	var LDSGroupCode = $('#loadDschServiceGroupCode').val();
	var equpId="";
	///cas/billOfLadFrtListConvlookup.do?0795360,000,FFF,CON/CON,10-17-2008,ISSD,MORG000001-1,CON,9"
	///cas/billLadingUnitConvlookup.do?0795360,000,FFF,,,,,,9"
	var urlCY="/cas/billLadingFreightlookup.do?"+shipmentNum+","+seqNum+","+corrNum+",,,,"+equpId+",,,";	
	var urlAU="/cas/billLadingUnitlookup.do?"+shipmentNum+","+seqNum+","+corrNum+",,,,"+equpId+",,,";	
	var urlCON="/cas/billOfLadFrtListConvlookup.do?"+shipmentNum+","+seqNum+","+corrNum+",,,,,,9";
	var actionUrl="";
	if(LDSGroupCode=='AU'){
		actionUrl = _context+urlAU;
	}else if(LDSGroupCode=='CON'){
		actionUrl = _context+urlCON;
	}else{
		actionUrl = _context+urlCY;
	}
	//actionUrl = _context + '/cas/receivedUnitsLookupSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'Recieved Unit List', windowStyle);
}

function loadEquipmentNumber(id)
{
 //alert("loadEquipmentNumber"+id);
 var casData = id.split('|');
 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
	$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.shipmentFreightId"]').val(casData[1]);
 
}
function loadVinNumber(id)
{
 //alert("loadVinNumber"+id)	;
	var casData = id.split('|');
	 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
		$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
}

function loadConEquipmentNumber(id){
	//alert("loadVinNumber"+id);
	var casData = id.split('|');
	 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
		$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.shipmentFreightId"]').val(casData[1]);
}

function receivedUnits(id){
	var myData=id.split('|');
	var shipmentNumber=$('#shipmentNumber').val();
	if(myData.length>1){
		if(shipmentNumber==myData[1]){
			$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(myData[0]); 
			return;
		}else{
			showErrorMessage();
		}	
	}else{
		showErrorMessage();
	}
}



function casSpSvcCodeLookup(index) {
	var entity_name=$('#spSvcEntityName').val();
	spsvCodeLineNumber=index;
	var proclvlCd='ALL';
	if(entity_name=='container'){
		proclvlCd='E';
	}else if(entity_name=='quote'){
		proclvlCd='C';
	}
	var specialServiceCode = $('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val();
	var actionUrl = _context + '/cas/spclSrvBKLookup.do?filterValue1='+encodeURIComponent(specialServiceCode)+'|'+proclvlCd;
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SpecialService Search', windowStyle);
}

function spclServiceUpdate(id){
	var values = id.split("|");
	var rateQuantityDate = values[2].split("-");
	clearSpecialServiceRow(spsvCodeLineNumber);
	$('#specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceDesc').val(values[0]+'-'+values[4]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceCode"]').val(values[0]);
	//Process level code
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.processLevelCode"]').val(values[1]);
	// is manual charge
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isManualCharge"]').val(rateQuantityDate[2]);
	// Charge Code
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.chargeCodeExpected"]').val(values[3]);
	// is required qty
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireQuantity"]').val(rateQuantityDate[1]);
	// is required date
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireDate"]').val(rateQuantityDate[0]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.source"]').text("Manual");
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	applyUIValidations(spsvCodeLineNumber);
}



 * QUOTE|TRUCKER|HHGM_ALL|PHONE|TRUCKER_ORIGIN|TRUCKER_RAMP|DIRECTION|RATE|ZIP|BASE_RATE|DROP_PULL|FREE_TIME|
 * OVER_TIME|CHASE_RATE|CITY|STATE|ZIP_CODE|FUEL_SURTY|FUEL_SUR



function casTruckerLookup(index) {
	truckerLineNumber=index;
	var actionUrl = _context + '/cas/bookingtruckerRateSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'Trucker Rate Search', windowStyle);
}

function truckerRateUpdate(id){
	var values = id.split("|");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.payee"]').val(values[1]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.milTruckerRateId"]').val(values[0]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.manualUserRate"]').val(values[7]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.rateBasisCode"]').selected().val("E");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.source"]').val("AH");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	// Adding Drop and Pull
	$('#truckerAmount'+truckerLineNumber).val(values[7]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.isDropOrPull"]').selected().val(values[10]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.isDropOrPull"]').attr("disabled", true);
	//Only Payee or Trucker can be associated with Special Service
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.addressRoleId"]').val("");
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getTruckerRoutingText",
		data : {
			// Ramp City Code
			truckerRampCityCode: values[5],
			//Ramp
			truckerRamp: values[19],
			// Freight Location Code
			truckerFreightLocationCode: values[4]
		},
		success : function(responseText) {
			$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.routingText"]').val(responseText.data);
		}
	});
}


function casPayeeLookup(index) {
	payeeLineNumber=index;
	//$('input[id="organistionId"'+payeeLineNumber+']')
	//var org_id=$('input[id="organistionId'+payeeLineNumber+'"]').val();
	var org_id=$("#organistionId"+payeeLineNumber).val();
	var actionUrl = _context + '/cas/addRoleBKPopUpSearch.do?filterValue1='+$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val()+'&filterValue2='+org_id;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'Address Search', windowStyle);
}

//ORG_ID,ADD_ROLE, ADDR_TYPE,ATTENTION_LINE,CITY, C_O_NAME,NAME_QUALIFIER,ORG_NAME,STATE,ADDRESS,ZIP, PROVINCE,COUNTRY,SUITE
function payeeLookupUpdate(id){
	var values = id.split("|");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val(values[7]);
	$("#organistionId"+payeeLineNumber).val(values[0]);
	//Name, Addr_Line1, Addr_line2, Suite, City
	var routingText=values[7]+","+values[9]+","+values[13]+","+values[4];
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.routingText"]').val(routingText);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(values[1]);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.manualUserRate"]').val("");
}




*/
var ssCode = null;
var dataName =  null;
var prdctvData=[];
var counter=0;
var payeeHidden = '';
var serCodeHidden = '';
$(document).ready(function () {
	casPredictiveSearchOnAllPayee();
	
	$('#rateBasisCode').live('keydown', function(event) {
		if (event.keyCode == '16') {
			return;
		}
			
		if (event.keyCode == '9') {
			event.preventDefault();
			if (event.shiftKey) {
				$('#manualUserRate').focus();
			}else{
				$('#payee').focus();
			}
				}
			});
	var procLvlCd='ALL';
	$('#shipmentHouseHoldSpecialServiceForm').validationEngine('attach');
	$('#specialServiceCode').gatesAutocomplete({	
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 			 method: 'getSpclSrvcBK',
		 		 searchType: '256',
		 		 param : function(){counter=0; return procLvlCd;}
	 	},
	 	timeout: 20000, 
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
			     return 'false';
			  }
			},
		formatItem: function(data) {
		//for 22695
			$('#addHouseHoldSplServiceDialog').gatesEnable();
			ssCode=data.desc;
			dataName=data.id;
			counter++;
			return data.id+"-"+data.desc;
		},
		formatResult: function(data) {
			return data.id;
		}, 
		select: function(data) {
			if(data.level!=null && data.level=="C"){
				alert("Commodity Level Special Service cannot be added");
			}else{
			$('#specialServiceCode').val(data.id);
			ssCode=data.desc;
			prdctvData=data;
			var ShipSeqForSpecialService = $('#shipmentSeqNumberSpcServ').val();
			serCodeHidden = $('#specialServiceCode').val();
			clearSpecialServiceRow();
			$('#shipmentSeqNumberSpcServ').val(ShipSeqForSpecialService);
			populateFields(data);
			applyUIValidations();
			counter=0;
			}
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
	//Updated for D025134: 	Maintain Bill: SPECIAL SERVICE: ADV saved without PAYEE
	$('#specialServiceCode').change(function(){
			var serviceCode=$('#specialServiceCode').val();
			if($.trim(serviceCode)==''){
				$('#specialServiceCode').val(""); 
				serCodeHidden = '';
			} 
			else if(serviceCode!=serCodeHidden){
				$('#specialServiceCode').val(""); 
				serCodeHidden = '';
			}
	});
	
//code to bind spl service look up  search
$('#specialServiceCode').gatesPopUpSearch({func:function() {casSpSvcCodeLookupSearch();}});

//code to bind  look up  search
$('#rateBasisCode').gatesPopUpSearch({func:function() {casTruckerLookup();}});

//code to bind  look up  search
$('#payee').gatesPopUpSearch({func:function() {casPayeeLookup();}});

$('select[name="rateBasisCode"]').change(function(){
	
	processRateBasis();
});

$('#payee').change(function(){
	if($('#payee').val()=='')
		{
			$('#organisationId').val('');
		}
});

$('input[name="payee"]').change(function(){
	var payee=$('input[name="payee"]').val();
	if($.trim(payee)==''){
		$('input[name="payee"]').val(""); 
		$('#splSvcAddress').html("");
		payeeHidden = '';
	} 
	else if(payee!=payeeHidden){
		$('input[name="payee"]').val(""); 
		$('#splSvcAddress').html("");
		payeeHidden = '';
	}
});

});

function casSpSvcCodeLookupSearch(index) {
	var entity_name=$('#spSvcEntityName').val();
	
	var proclvlCd='ALL';
	
	var specialServiceCode = $('#specialServiceCode').val();
	var actionUrl = _context + '/cas//spclSrvHHGSKLookup.do?filterValue1='+encodeURIComponent(specialServiceCode)+'|'+proclvlCd;
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function clearErrMsg(){
	$("#specialServiceMasterForm").validationEngine('hideAll');
}
function spclServiceUpdate(id){
	var values = id.split("|");
	var rateQuantityDate = values[2].split("-");
	var ShipSeqForSpecialService = $('#shipmentSeqNumberSpcServ').val();
	clearSpecialServiceRow();
	$('#shipmentSeqNumberSpcServ').val(ShipSeqForSpecialService);
	$('#specialServiceDesc').val(values[0]+'-'+values[4]);
	$('input[name="specialServiceCode"]').val(values[0]);
	//Process level code
	$('input[name="processLevelCode"]').val(values[1]);
	// is manual charge
	$('input[name="isManualCharge"]').val(rateQuantityDate[2]);
	// Charge Code
	//$('input[name="chargeCodeExpected"]').val(values[3]);
	if(values[6]!=undefined && values[6]!=""){
		$('input[name="chargeCodeExpected"]').val(values[6]);	
	}else if(values[7]!=undefined && values[7]!=""){
		$('input[name="chargeCodeExpected"]').val(values[7]);
	}
	// is required qty
	$('input[name="isRequireQuantity"]').val(rateQuantityDate[1]);
	// is required date
	$('input[name="isRequireDate"]').val(rateQuantityDate[0]);
	$('input[name="source"]').text("Manual");
	$('input[name="isMilTruckerRateCustomized"]').val("N");
	applyUIValidations();
}

function processRateBasis(){
	var rateBasisCd=$('select[name="rateBasisCode"]').selected().val();
	var isManualCharge = $('input[name="isManualCharge"]').val();
	if(rateBasisCd!=''){
		$('input[name="manualUserRate"]').addClass('validate[required]');
	}else if(rateBasisCd==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="manualUserRate"]').removeClass('validate[required]');
			$('select[name="rateBasisCode"]').removeClass('validate[required]');
		}
	}
	
	var truckerRateId=$('input[name="milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N'){
		if(rateBasisCd!='E'){
			$('input[name="source"]').val("AH Customized");
			$('input[name="isMilTruckerRateCustomized"]').val('Y');
		}
	}
}

function casPayeeLookup(index) {
	payeeLineNumber=index;
	//$('input[id="organistionId"'+payeeLineNumber+']')
	//var org_id=$('input[id="organistionId'+payeeLineNumber+'"]').val();
	//var org_id=$("#organistionId"+payeeLineNumber).val();
	orgCaller = 'specialService';
	
	var org_id=$('input[name="organisationId"]').val();
	if(org_id==undefined || org_id==null || org_id==''){
		alert("Please select organization first");
		return;
	}
	//var actionUrl = _context + '/cas/addRoleBKPopUpSearch.do?filterValue1='+$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val()+'&filterValue2='+org_id;
	var actionUrl = _context + '/cas/addRoleSPSRLookup.do?filterValue1='+org_id+'&filterValue2=04';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

//ORG_ID,ADD_ROLE, ADDR_TYPE,ATTENTION_LINE,CITY, C_O_NAME,NAME_QUALIFIER,ORG_NAME,STATE,ADDRESS,ZIP, PROVINCE,COUNTRY,SUITE
function payeeLookupUpdate(id){
	var values = id.split("|");
	$('#payee').val(values[7]);
	$("#organisationId").val(values[0]);
	//Name, Addr_Line1, Addr_line2, Suite, City
	var routingText=values[7]+","+values[9]+","+values[13]+","+values[4];
	
	$('input[name="isMilTruckerRateCustomized"]').val("");
	$('input[name="milTruckerRateId"]').val("");
	$('input[name="addressRoleId"]').val(values[1]);
	$('input[name="source"]').val("Manual");
	$('input[name="manualUserRate"]').val("");
	var cityStateZip="";
	if(values[4]!=null && values[4]!="null"){
	cityStateZip=values[4];
	}
	if(values[8]!=null && values[8]!="null"){
		cityStateZip=cityStateZip+'/'+values[8];
		}
	if(values[11]!=null && values[11]!="null"){
		cityStateZip=cityStateZip+'/'+values[11];
		}
	
	$('#splSvcAddrInfo').html(cityStateZip);
	var address ="";
	if(values[9]!=null && values[9]!="null"){
		address=values[9];
		}
	
	$('#splSvcAddress').html(address);
	
	
}

function getRateBasisList() {
	// Get contact list for address. [commented for merge.]specialServiceFormLine1.rateBasisCode
	$.ajax({
		async:false,
		type : "POST",
		url : _context +"/shipment/specialservice/getRateBasisList",
		data : {
		},
		success : function(responseText) {
			$('select[name="rateBasisCode"]').children().remove();
			$('select[name="rateBasisCode"]').append("<option value=''></option>");
			for ( var i = 0; i < responseText.data.length; i++) {
				$('select[name="rateBasisCode"]')
				.append($("<option/>", {
					value : responseText.data[i].code,
					text : responseText.data[i].description
				}));
			}
			
		}
	});	
		
}

function removeClassesForSpecialServiceForm(){
	$('input[name="manualUserRate"]').removeClass("validate[required]");
	$('select[name="rateBasisCode"]').removeClass("validate[required]");
	$('input[name="numberOfUnit"]').removeClass("validate[required]");
	$('input[name="payee"]').removeClass("validate[required]");
	//$('input[name*="specialServiceDate"]').removeClass("validate[required]");
	clearSpecialServiceRow();
	

}
function clearSpecialServiceRow(){
	//alert("Test1");
	// Hidden field
	$('input[name="isManualCharge"]').val("");
	$('input[name="isRequireDate"]').val("");
	$('input[name="isRequireQuantity"]').val("");
	$('input[name="milTruckerRateId"]').val("");
	$('input[name="chargeCodeExpected"]').val("");
	$('input[name="isMilTruckerRateCustomized"]').val("");
	$('input[name="addressRoleId"]').val("");
	$('input[name="shipmentAddnlChrsticIdDs"]').val("");
	
	$('#splSvcAddrInfo').html("");
	$('#rateBasisCode').val("");
	$('#splSvcAddress').html("");
	
	
	//$('#shipmentSeqNumberSpcServ').val("");
	$('#shipmentSeqNumberSpcServ').prop('selectedIndex',-1);
	
	
	// Form Fields
	//$('input[name="specialServiceCode"]').val("");
	
	//Process level code - Apply to All Indicator
	$('input[name="processLevelCode"]').val("");
	//Equipment/Vinsight -- SpecialServiceDate

	//$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').val("");
	//Number Of Unit - Drop Pull
	$('input[name="numberOfUnit"]').val("");
	//$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("selectedIndex",0);
	
	//rate -- Amount
	$('input[name="manualUserRate"]').val("");
	$('input[name="amount"]').val("");
	//RateBasis -- Source
	$('select[name="rateBasisCode"]').attr("selectedIndex",0);
	$('input[name="source"]').val("");
	//Payee Routing Text
	$('input[name="payee"]').val("");
	$('textarea[name="routingText"]').val("");
	
	//Removing the classes
	$('input[name="manualUserRate"]').removeClass("validate[required]");
	$('select[name="rateBasisCode"]').removeClass("validate[required]");
	$('input[name="numberOfUnit"]').removeClass("validate[required]");
	$('input[name="commodityLineNumber"]').removeClass("validate[required]");
	$('input[name="payee"]').removeClass("validate[required]");
	
	//Remove the read only fields
	$('input[name="manualUserRate"]').attr("disabled", false);
	$('select[name="rateBasisCode"]').attr('disabled',false);
	$('input[name="numberOfUnit"]').attr('disabled',false);
	$('input[name="payee"]').attr("disabled", false);
	$('input[name="routingText"]').attr("disabled", false);
	
	
	
	
	$('input[name="isMilTruckerRateCustomized"]').val('');
	$('input[name="organisationId"]').val('');


	//$('#specialServiceCode').val('');
	$('#truckerAmount').val('');
	$('#payeeHidden').val('');
	$('#equipmentVinsightHidden').val('');
	$('#equipmentVinsight').hide();
	
	$('input[name="payee"]').css("background-color", "");
}

function populateFields(data){
	
	//Process level code
	$('input[name="processLevelCode"]').val(data.level);
	// is manual charge
	$('input[name="isManualCharge"]').val(data.manchrg);
	// Charge Code
	//$('input[name="chargeCodeExpected"]').val(data.chgres);
	//$('input[name="chargeCodeExpected"]').val(data.rticmr);
	if(data.passpay!=undefined && data.passpay!=""){
		$('input[name="chargeCodeExpected"]').val(data.passpay);
	}else if(data.rtipmr!=undefined && data.rtipmr!=""){
		$('input[name="chargeCodeExpected"]').val(data.rtipmr);
	}
	// is required qty
	$('input[name="isRequireQuantity"]').val(data.reqqty);
	// is required date
	$('input[name="isRequireDate"]').val(data.reqdt);
	$('input[name="source"]').val("Manual");
	$('input[name="isMilTruckerRateCustomized"]').val("N");

}

function applyUIValidations(){
	
	var truckerRateId=$('input[name="milTruckerRateId"]').val();
	if(truckerRateId==null || truckerRateId=='' || truckerRateId==undefined){
		processPayeeRequired();
	}
	processRateRateBasis();
	processUnits();
	processProcessLevelCode();
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');
}

function processUnits(){
	if($('input[name="isRequireQuantity"]').val()=='N'){
		$('input[name="numberOfUnit"]').attr('disabled',true);
		// Defect-26418
		$('input[name="manualUserRate"]').focus();
		$('input[name="numberOfUnit"]').removeClass("validate[required]");
	}else if($('input[name="isRequireQuantity"]').val()=='Y'){
		$('input[name="numberOfUnit"]').attr('disabled',false);
		$('input[name="numberOfUnit"]').addClass("validate[required]");
	}else{
		$('input[name="numberOfUnit"]').attr('disabled',false);
		$('input[name="numberOfUnit"]').removeClass("validate[required]");
	}
}



function processPayeeRequired(){
	var index=1;
	var spSvChargeCode= $('input[name="chargeCodeExpected"]').val();
	var passThruPayable=$('#passThruPayable'+index).val();//Defect-25175
	var milTruckerRateId= $('input[name="milTruckerRateId"]').val();
	var isDefaultFrtPayableCharge='';
	var accessorialAllowanceCode='';
	if(passThruPayable=='' || passThruPayable==null || passThruPayable==undefined){//Defect-25175
		//D027137
		//$('input[name="payee"]').val('');
		$('input[name="payee"]').removeClass("validate[required]");
		$('input[name="payee"]').attr('disabled',false);
		$('#imgPayeeLine').show();
		return;
	}else{
		spSvChargeCode=passThruPayable;//Defect-25175
	}
	if($('input[name="isManualCharge"]').val()!='N'){
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getChargeCode",
		data : {
			// ChargeCode
			chargeCode: spSvChargeCode
		},
		success : function(responseText) {
			if(responseText!=null && responseText.data!=null){
				isDefaultFrtPayableCharge = responseText.data.isDefaultFrtPayableCharge;
				accessorialAllowanceCode = responseText.data.accessorialAllowanceCode;
				if(isDefaultFrtPayableCharge=='Y'){
					$('input[name="payee"]').addClass("validate[required]");
					$('input[name="payee"]').attr('disabled',false);
					$('input[name="routingText"]').attr('disabled',false);
					$('#imgPayeeLine').show();
				}else if(isDefaultFrtPayableCharge=='N' && (milTruckerRateId=='')){
					$('input[name="payee"]').val('');
					$('input[name="routingText"]').val('');
					$('input[name="payee"]').removeClass("validate[required]");
					$('input[name="payee"]').attr('disabled',true);
					$('input[name="routingText"]').attr('disabled',true);
					$('#imgPayeeLine').hide();
				}else{
					$('input[name="payee"]').removeClass("validate[required]");
					$('input[name="payee"]').attr('disabled',false);
					$('input[name="routingText"]').attr('disabled',false);
					$('#imgPayeeLine').show();
				}
				if(null==accessorialAllowanceCode && accessorialAllowanceCode!=''){
					if(accessorialAllowanceCode=='A'){
						$('select[name="rateBasisCode"]').removeClass("validate[required]");
						$('input[name="manualUserRate"]').removeClass("validate[required]");
						$('input[name="manualUserRate"]').val('');
						$('select[name="rateBasisCode"]').attr("selectedIndex",0);
						$('input[name="manualUserRate"]').attr('disabled',true);
						$('select[name="rateBasisCode"]').attr('disabled',true);
						$('#imgTruckerRateLine').hide();
					}else if(accessorialAllowanceCode=='C'){
						$('input[name="manualUserRate"]').attr('disabled',false);
						$('select[name="rateBasisCode"]').attr('disabled',false);
						$('#imgTruckerRateLine').show();
					}
				}
				if(isDefaultFrtPayableCharge!='Y'){
				var rateBasis=$('select[name="rateBasisCode"]').selected().val();
				if($('input[name="isManualCharge"]').val()!='Y' && 
						$('input[name="isManualCharge"]').val()!='N' && (rateBasis==null || rateBasis=='') ){
					
					$('input[name="payee"]').removeClass("validate[required]");
					$('input[name="payee"]').attr('disabled',false);
					$('input[name="routingText"]').attr('disabled',false);
					$('#imgPayeeLine').show();
					}
				}
			}else{
				$('input[name="payee"]').val('');
				$('input[name="routingText"]').val('');
				$('input[name="payee"]').removeClass("validate[required]");
				$('input[name="payee"]').attr('disabled',true);
				$('input[name="routingText"]').attr('disabled',true);
				$('#imgPayeeLine').hide();
			}
			
			
		}
	});
	}
}


function processRateRateBasis(){
	//Rate Basis/Rate Check :BR 15, BR2, BR5
	if($('input[name="isManualCharge"]').val()=='Y'){
		$('input[name="manualUserRate"]').attr('disabled',false);
		$('select[name="rateBasisCode"]').attr('disabled',false);
		$('select[name="rateBasisCode"]').addClass("validate[required]");
		$('input[name="manualUserRate"]').addClass("validate[required]");
		$('#imgTruckerRateLine').show();
	}else if($('input[name="isManualCharge"]').val()=='N') {
		$('input[name="manualUserRate"]').attr('disabled',true);
		$('select[name="rateBasisCode"]').attr('disabled',true);
		$('select[name="rateBasisCode"]').removeClass("validate[required]");
		$('input[name="manualUserRate"]').removeClass("validate[required]");
		$('#imgTruckerRateLine').hide();
	}else {
		$('input[name="manualUserRate"]').attr('disabled',false);
		$('select[name="rateBasisCode"]').attr('disabled',false);
		$('select[name="rateBasisCode"]').removeClass("validate[required]");
		$('input[name="manualUserRate"]').removeClass("validate[required]");
		$('#imgTruckerRateLine').show();
	}
}

function processProcessLevelCode(){
	var processLvlCode=$('input[name="processLevelCode"]').val();
	switch(processLvlCode){
		case "S":
				validateApplyToAllInd();
				break;
		case "C":
				validateApplyToAllInd();
				break;
		case "E":
				validateApplyToAllInd();
				break;
	}
}

function validateApplyToAllInd(){
	//alert("Test3");
	var shipmentNumber=$('#shipmentNumber').val();
	var entity_name=$("#spSvcEntityName").val();
	if($('select[name="isApplyToAll"] option:selected').text()=='N'){
		if($('input[name="processLevelCode"]').val()=='S'){
			$('input[name="commodityLineNumber"]').removeClass("validate[required]");
			$('input[name="commodityLineNumber"]').attr("disabled", true);
			$('#equipmentVinsight').hide();
		}
		if($('input[name="processLevelCode"]').val()=='C'){
			
		}
		if($('input[name="processLevelCode"]').val()=='E'){
			
		
		}
	}else if($('select[name="isApplyToAll"] option:selected').text()=='Y'){
		if('shipment'==entity_name){
			//processForShipment();
		}else if('container'==entity_name){
			
		//	processForShipment();
		}
	}
}

function casTruckerLookup() {
	
	var actionUrl = _context + '/cas/bookingtruckerRateSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function truckerRateUpdate(id){
	var values = id.split("|");
	$('input[name="payee"]').val(values[1]);
	$('input[name="milTruckerRateId"]').val(values[0]);
	$('input[name="manualUserRate"]').val(values[7]);
	$('select[name="rateBasisCode"]').selected().val("E");
	$('input[name="source"]').val("AH");
	$('input[name="isMilTruckerRateCustomized"]').val("N");
	// Adding Drop and Pull
	$('#truckerAmount').val(values[7]);
	$('select[name="isDropOrPull"]').selected().val(values[10]);
	$('select[name="isDropOrPull"]').attr("disabled", true);
	
	var address ="";
	if(values[22]!=null && values[22]!="null"){
		address=values[22];
		}
	if(values[14]!=null && values[14]!="null"){
		address=address+'-'+values[14];
		}
	if(values[15]!=null && values[15]!="null" && values[15]!=""){
		address=address+','+values[15];
		}
	
	$('#splSvcAddress').html(address); //address-city-state
	
	
	var cityStateZip="";
	if(values[14]!=null && values[14]!="null"){
	cityStateZip=values[14];
	}
	if(values[15]!=null && values[15]!="null" && values[15]!=""){
		cityStateZip=cityStateZip+'/'+values[15];
		}
	if(values[16]!=null && values[16]!="null" && values[16]!=""){
		cityStateZip=cityStateZip+'/'+values[16];
		}
	
	$('#splSvcAddrInfo').html(cityStateZip);
	//Only Payee or Trucker can be associated with Special Service
	$('input[name="addressRoleId"]').val(values[20]);
	$('#organisationId').val(values[21]);
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getTruckerRoutingText",
		data : {
			// Ramp City Code
			truckerRampCityCode: values[5],
			//Ramp
			truckerRamp: values[19],
			// Freight Location Code
			truckerFreightLocationCode: values[4]
		},
		success : function(responseText) {
			$('textarea[name="routingText"]').val(responseText.data);
		}
	});
}


function validateSpecialServiceFields(){
	var isValid = true;
	var SSCode =$('input[name="specialServiceCode"]').val();
	
	if($("#isSpecialServiceAdd").val()!='false'){
		if(SSCode=="" && !specialServiceLineCheck()){
		
			$('input[name="specialServiceCode"]').addClass("validate[required]");
			isValid=false;
		}else{
			//alert("Inside else 1::");
			$('input[name="specialServiceCode"]').removeClass("validate[required]");
			if((SSCode=='HHAGTHI')||(SSCode=='HHAGTWC')||(SSCode=='HHAGTLH'))
			{
				if($('input[name="payee"]').val()==""){ 
					$('input[name="payee"]').addClass("validate[required]");
					isValid=false;
				}else{
					 $('input[name="payee"]').removeClass("validate[required]");
				}
			}
		}
	}else{
		if(SSCode==""){
			$('input[name="specialServiceCode"]').addClass("validate[required]");
			isValid=false;
		}else{
			$('input[name="specialServiceCode"]').removeClass("validate[required]");
			if((SSCode=='HHAGTHI')||(SSCode=='HHAGTWC')||(SSCode=='HHAGTLH'))
			{
				if($('input[name="payee"]').val()==""){ 
					$('input[name="payee"]').addClass("validate[required]");
					isValid=false;					
				}else{
					 $('input[name="payee"]').removeClass("validate[required]");
				}
			}
		}
	}
	return isValid;
}



function specialServiceLineCheck(){
	
	var rateBasisCode=$('select[name="rateBasisCode"]').selected().val();
	if(rateBasisCode==null || rateBasisCode==""){
		rateBasisCode=null;
	}
	if(
	   $('input[name="numberOfUnit"]').val()!="" ||
	   $('input[name="manualUserRate"]').val()!="" ||
	   	rateBasisCode!=null ||
	   $('input[name="payee"]').val()!=""){
		return false;
	}
	return true;
	
}

function fetchAddresssDetails(item){
	
	$.ajax({
		type : "POST",
		url : _context +"/houseHoldShipment/specialService/getAddressDetails", //HHGDS
		data : {
			addressId: item.addid
		},
		success : function(responseText) {
			$("#payeeHidden").val(item.name+"-"+item.abbr);
			$('input[name="payee"]').val(item.name+"-"+item.abbr);
			$('input[name="organisationId"]').val(item.orgid);
			
			$('input[name="addressRoleId"]').val(item.arolid);
			$('input[name="source"]').val("Manual");
			$('input[name="isMilTruckerRateCustomized"]').val("");
			$('input[name="milTruckerRateId"]').val("");
			checkRateBasisRequired();
			
			$('#splSvcAddress').html(responseText.data.split(":")[0]);
			$('#splSvcAddrInfo').html(responseText.data.split(":")[1]);	
		}
	});
}

function addroleUpdateForSPSR(data) {
	if(orgCaller == 'commodityBillTo'){
			var values = data.split("|");
			var cityStateZip="";
			if(values[2]!=null && values[2]!="null"){
			cityStateZip=values[2];
			}
			if(values[6]!=null && values[6]!="null" && values[6]!=""){
				cityStateZip=cityStateZip+'/'+values[6];
				}
			if(values[8]!=null && values[8]!="null" && values[8]!=""){
				cityStateZip=cityStateZip+'/'+values[8];
				}
			
			$('#shipmentCityStateZip').html(cityStateZip);
			
			var address ="";
			if(values[7]!=null && values[7]!="null"){
				address=values[7];
				}
			if(values[2]!=null && values[2]!="null"){
				address=address+'-'+values[2];
				}
			if(values[6]!=null && values[6]!="null" && values[6]!=""){
				address=address+','+values[6];
				}
			
			$('#shipmentAddressLine1').html(address);
			$('#shipmentAddressRoleId').val(values[9]);
			
	}else if(orgCaller == 'specialService'){
	var values = data.split("|");
	var routingText = formatAddRoleDscrForSPSV(values[4],values[7],values[2],values[6]);
	//$("#payeeHidden"+payeeLineNumber).val(item.name);
	//$('#routingText').val(routingText);
	$('input[name="addressRoleId"]').val(values[9]);
	$('input[name="source"]').val("Manual");
	$('input[name="isMilTruckerRateCustomized"]').val("");
	$('input[name="milTruckerRateId"]').val("");
	checkRateBasisRequired();
	isSpecialServiceChanged=true;
	var cityStateZip="";
	if(values[2]!=null && values[2]!="null"){
	cityStateZip=values[2];
	}
	if(values[6]!=null && values[6]!="null" && values[6]!=""){
		cityStateZip=cityStateZip+'/'+values[6];
		}
	if(values[8]!=null && values[8]!="null" && values[8]!=""){
		cityStateZip=cityStateZip+'/'+values[8];
		}
	
	$('#splSvcAddrInfo').html(cityStateZip);
	var address ="";
	if(values[7]!=null && values[7]!="null"){
		address=values[7];
		}
	if(values[2]!=null && values[2]!="null"){
		address=address+'-'+values[2];
		}
	if(values[6]!=null && values[6]!="null" && values[6]!=""){
		address=address+','+values[6];
		}
	
	$('#splSvcAddress').html(address); //address-city-state
	var dataUrl = _context +"/shipment/specialservice/changeBgColor?arolid="+values[9];
	$.ajax({
		type : "GET",
		url: dataUrl,
		success: function(responseText){
			if(responseText=='03'){
				$('input[name="payee"]').css("color", "purple");
			}else{
				$('input[name="payee"]').css("color", "");
			}
		}
	});
	}
}

//Payee predictive search is not working-- 
function casPredictiveSearchOnAllPayee(){
	var orgId='';
	$('input[name="payee"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	autoSelectWhenSingle:true,
		autoSelectFirst:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  }
			  else {
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
	 		$('input[name="payee"]').css("color", "");
	 		orgId=item.orgid;	
	 		payeeHidden = $('input[name="payee"]').val();
	 		$('#organisationId').val(orgId);
	 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
	 			console.log(item.arolid);
	 			console.log(item.addid);
	 			fetchAddresssDetails(item);
	 			checkBgColor(item.arolid);
	 		}
	 		else if(item.count>1){
	 			casPayeeLookup(); 
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});
}

function checkRateBasisRequired(){
	var manualUserRate=$('input[name="manualUserRate"]').val();
	var isManualCharge=$('input[name="isManualCharge"]').val();
	if(manualUserRate!=''){
		if($('select[name="rateBasisCode"] option:selected').text()==''){
			$('select[name="rateBasisCode"]').addClass('validate[required]');
		}else{
			$('select[name="rateBasisCode"]').removeClass('validate[required]');
		}
	}else if(manualUserRate==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="manualUserRate"]').removeClass('validate[required]');
			$('select[name="rateBasisCode"]').removeClass('validate[required]');
		}
	}
	if($('input[name="manualUserRate"]').val()!='' && 
			$('select[name="rateBasisCode"] option:selected').text()!=''){
		$('input[name="manualUserRate"]').addClass('validate[required]');
	}
	
	
	var truckerRateId=$('input[name="milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N' ){
		var truckerRateAmount=$('#truckerAmount').val();
		if(truckerRateAmount!="" && manualUserRate!=truckerRateAmount){
			$('input[name="source"]').val("AH CUSTOM");
			$('input[name="isMilTruckerRateCustomized"]').val('Y');
			$('select[name="isDropOrPull"]').attr("disabled", false);
		}else{
			$('select[name="isDropOrPull"]').attr("disabled", true);
		}
	}
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

function checkBgColor(arolid)
{
	var dataUrl = _context +"/shipment/specialservice/changeBgColor?arolid="+arolid;
		$.ajax({
			type : "GET",
			url: dataUrl,
			success: function(responseText){
				if(responseText=='03'){
					$('input[name="payee"]').css("color", "purple");
				}else{
					$('input[name="payee"]').css("color", "");
				}
			}
		});
}
var isSpecialServiceChanged=false;
$(document).ready(function () {
	$("#spSvcEntityName").val('shipment');
	var spsvCodeLineNumber=0;
	var truckerLineNumber=0;
	var payeeLineNumber=0;
	var equipmentVinsightLineNumber=0;
	
	/*$('input[name="specialServiceFormLine1\\.specialServiceCode"]').change(function(){
		var index=1;
		checkForSpecialServiceCdChg(index);
	});*/
	/*$('input[name="specialServiceFormLine2\\.specialServiceCode"]').change(function(){
		var index=2;
		checkForSpecialServiceCdChg(index);
	});
	$('input[name="specialServiceFormLine3\\.specialServiceCode"]').change(function(){
		var index=3;
		checkForSpecialServiceCdChg(index);
	});
	$('input[name="specialServiceFormLine4\\.specialServiceCode"]').change(function(){
		var index=4;
		checkForSpecialServiceCdChg(index);
	});
	$('input[name="specialServiceFormLine5\\.specialServiceCode"]').change(function(){
		var index=5;
		checkForSpecialServiceCdChg(index);
	});*/
	
	//D025134: 	Maintain Bill: SPECIAL SERVICE: ADV saved without PAYEE
	$("#specialServiceFormLine1 input").change(function() {
		checkForSpecialServiceCdChg(1);
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine1 select").change(function() {
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine2 input").change(function() {
		checkForSpecialServiceCdChg(2);
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine2 select").change(function() {
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine3 input").change(function() {
		checkForSpecialServiceCdChg(3);
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine3 select").change(function() {
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine4 input").change(function() {
		checkForSpecialServiceCdChg(4);
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine4 select").change(function() {
		isSpecialServiceChanged = true;
	});
	
	$("#specialServiceFormLine5 input").change(function() {
		checkForSpecialServiceCdChg(5);
		isSpecialServiceChanged = true;
	});

	$("#specialServiceFormLine5 select").change(function() {
		isSpecialServiceChanged = true;
	});
	
	/*
	 * for defect 21951
	 */
	$("form#specialServiceMasterForm input[type=text]").click(function() {
		clearErrMsg();
	});
	$("form#specialServiceMasterForm select").click(function() {
		clearErrMsg();
	});
	
	$('#imgSpecialServiceCodeLine1').click(function(){
		var index=1;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
	});
	$('#imgSpecialServiceCodeLine2').click(function(){
		var index=2;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
	});
	$('#imgSpecialServiceCodeLine3').click(function(){
		var index=3;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
	});
	$('#imgSpecialServiceCodeLine4').click(function(){
		var index=4;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
	});
	$('#imgSpecialServiceCodeLine5').click(function(){
		var index=5;
		casSpSvcCodeLookup(index);
		//processUIValidations(index);
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
	});
	$('select[name="specialServiceFormLine2\\.rateBasisCode"]').change(function(){
		var index=2;
		processRateBasis(index);
	});
	$('select[name="specialServiceFormLine3\\.rateBasisCode"]').change(function(){
		var index=3;
		processRateBasis(index);
	});
	$('select[name="specialServiceFormLine4\\.rateBasisCode"]').change(function(){
		var index=4;
		processRateBasis(index);
	});
	$('select[name="specialServiceFormLine5\\.rateBasisCode"]').change(function(){
		var index=5;
		processRateBasis(index);
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


	
	//getRateBasisList();
	
	
	populateDefaultPageOptions();
	if($('#statusCode').text()!='ISSUED' && $('#statusCode').text()!='CORRECTED' && isSpecialServiceModifiable==true){
		removeClassesForSpecialServiceForm();
	}
	$('#msgDivSpSv').hide();
	
	$("#specialServiceMasterForm").validationEngine('attach');
	
	$('input[name="specialServiceFormLine1\\.manualUserRate"]').change(function(){
		var index="1";
		validateFloatingNumber(index);
		checkRateBasisRequired(index);
	});
	$('input[name="specialServiceFormLine2\\.manualUserRate"]').change(function(){
		var index="2";
		validateFloatingNumber(index);
		checkRateBasisRequired(index);
	});
	$('input[name="specialServiceFormLine3\\.manualUserRate"]').change(function(){
		var index="3";
		validateFloatingNumber(index);
		checkRateBasisRequired(index);
	});
	$('input[name="specialServiceFormLine4\\.manualUserRate"]').change(function(){
		var index="4";
		validateFloatingNumber(index);
		checkRateBasisRequired(index);
	});
	$('input[name="specialServiceFormLine5\\.manualUserRate"]').change(function(){
		var index="5";
		validateFloatingNumber(index);
		checkRateBasisRequired(index);
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
		validateEquipmentVinsight(index);
		//checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine2\\.equipmentVinsight"]').change(function(){
		var index="2";
		validateEquipmentVinsight(index);
		//checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine3\\.equipmentVinsight"]').change(function(){
		var index="3";
		validateEquipmentVinsight(index);
		//checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine4\\.equipmentVinsight"]').change(function(){
		var index="4";
		validateEquipmentVinsight(index);
		//checkEquipmentContainer(index);
	});
	$('input[name="specialServiceFormLine5\\.equipmentVinsight"]').change(function(){
		var index="5";
		validateEquipmentVinsight(index);
		//checkEquipmentContainer(index);
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
	
	 $('input[name="specialServiceFormLine1.payee"]').change(function(){
		 if($('input[name="specialServiceFormLine1.payee"]').val()=="" || $('input[name="specialServiceFormLine1.routingText"]').val()=='')
		 {
			  $('input[name="specialServiceFormLine1.careOf"]').val("");
		      $('input[name="specialServiceFormLine1.routingText"]').val("");
		 }
	});
	 
	 $('input[name="specialServiceFormLine2.payee"]').change(function(){
		 if($('input[name="specialServiceFormLine2.payee"]').val()=="" || $('input[name="specialServiceFormLine2.routingText"]').val()=='')
		 {
			  $('input[name="specialServiceFormLine2.careOf"]').val("");
		      $('input[name="specialServiceFormLine2.routingText"]').val("");
		 }
	});
	 $('input[name="specialServiceFormLine3.payee"]').change(function(){
		 if($('input[name="specialServiceFormLine3.payee"]').val()=="" || $('input[name="specialServiceFormLine3.routingText"]').val()=='')
		 {
			  $('input[name="specialServiceFormLine3.careOf"]').val("");
		      $('input[name="specialServiceFormLine3.routingText"]').val("");
		 }
	});
	 $('input[name="specialServiceFormLine4.payee"]').change(function(){
		 if($('input[name="specialServiceFormLine4.payee"]').val()=="" || $('input[name="specialServiceFormLine4.routingText"]').val()=='')
		 {
			  $('input[name="specialServiceFormLine4.careOf"]').val("");
		      $('input[name="specialServiceFormLine4.routingText"]').val("");
		 }
	});
	 $('input[name="specialServiceFormLine5.payee"]').change(function(){
		 if($('input[name="specialServiceFormLine5.payee"]').val()=="" || $('input[name="specialServiceFormLine5.routingText"]').val()=='')
		 {
			  $('input[name="specialServiceFormLine5.careOf"]').val("");
		      $('input[name="specialServiceFormLine5.routingText"]').val("");
		 }
	});
	 
	 $('input[name*="numberOfUnit"]').change(function(){
		 var numberOfUnit = $(this).val();
		 $(this).val($.trim(numberOfUnit));
	 });
	 
	
});

function validateFloatingNumber(index){
     var finalRate ="";
     var rate = "";
     rate = $('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val();;
     rate= rate.split(",");
     for(i=0;i<rate.length;i++){
        finalRate = finalRate+rate[i];
     }
     if(finalRate != "")
        $('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val(finalRate);
}
function checkEquipmentContainer(index){
	//-TODO need to be implement this a t later stage
	/*
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
							
						}
						if(isRequiredUnit=='N'){
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
						if(isRequiredUnit=='Y'){
							showErrorMessage('VINsight ID# '+equipmentVinsight+' was not found.  Please select from Received unit search');
							//showErrorMessage('VinSight# '+equipmentVinsight+' doesnt exist.');
						}
						if(isRequiredUnit=='N'){
							showErrorMessage('Equipment Nbr# '+equipmentVinsight+' is not found.  Please select from variance by booking');
							//showErrorMessage('Container '+equipmentVinsight+' either not associated to booking '+shipmentNumber+' or doesnt exist.');
						}
					}
				}
			});
		}else{
			$('#msgDivSplSrv').hide();
		}
	}
*/}

function validateCommodityLineNumber(index){
	//var freightCount = $("#freightGrid").getGridParam("reccount");
	var freightCount = "";
	if($("#commodityGrid").getGridParam("reccount")!='undefined' && $("#commodityGrid").getGridParam("reccount")>0){
		freightCount = $("#commodityGrid").getGridParam("reccount");
	}else if($("#povGrid").getGridParam("reccount")!='undefined' && $("#povGrid").getGridParam("reccount")>0){
		freightCount = $("#povGrid").getGridParam("reccount");
	}else if($("#convGrid").getGridParam("reccount")!='undefined' && $("#convGrid").getGridParam("reccount")>0){
		freightCount = $("#convGrid").getGridParam("reccount");
	}
	//alert("freightCount"+freightCount);
	var applyToAllInd=$('select[name="specialServiceFormLine'+index+'\\.isApplyToAll"] option:selected').text();
	var commSize= $('#unitOfCommodity option');
	if(applyToAllInd=='N'){
		if(freightCount!=null && freightCount!=undefined && freightCount!=''){
			if(commSize!=null && commSize!=undefined && commSize.length==1){
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
	}/*else if(receivedUnitId=='undefined' || receivedUnitId==null || receivedUnitId==""){				
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");  
    }else if(equipmentId=='undefined' || equipmentId==null || equipmentId==""){				
		$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val("");
		$('input[name="specialServiceFormLine'+index+'\\.receivedFreightId"]').val("");
    }*/else if(equipmentVinsight!=equipmentVinsightHidden){
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
	
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val();
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N' ){
		var truckerRateAmount=$('#truckerAmount'+index).val();
		if(truckerRateAmount!="" && manualUserRate!=truckerRateAmount){
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH CUSTOM");
			$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("AH Customized");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
			$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("disabled", false);
		}else{
			$('select[name="specialServiceFormLine'+index+'\\.isDropOrPull"]').attr("disabled", true);
		}
	}
}

/*
 * Rules for Defaulting and Clearing Special Services
 */

function populateDefaultPageOptions(){
	var entity_name=$("#spSvcEntityName").val();
	if(entity_name=='container'){
		$('select[name*="isApplyToAll"]').selected().val('N');
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
		$('select[name*="isApplyToAll"]').attr("disabled", true);
		//$('input[name*="equipmentVinsight"]').attr("readonly", true);
	}else if(entity_name=='shipment'){
		$('select[name*="isApplyToAll"]').selected().val('N');
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
	if($("#statusCode").text()!='ISSUED' && $("#statusCode").text()!='CORRECTED' && isSpecialServiceModifiable==true){
		if($('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()=='' || 
			$('input[name=specialServiceFormLine'+index+'\\.specialServiceCode]').val()!=$('#specialServiceCode'+index).val()){
			clearSpecialServiceRow(index);
		}
	} else{
		if($("#isSpecialServiceAdd").val()=="true"){
			isSpecialServiceChanged = true;
		}
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
	$('label[for="specialServiceFormLine'+index+'\\.processLevelCodeReadOnly"]').text("");
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
	$('label[for="specialServiceFormLine'+index+'\\.amountReadOnly"]').text("");
	//RateBasis -- Source
	$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').attr("selectedIndex",0);
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("");
	$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("");
	//Payee Routing Text
	$('input[name="specialServiceFormLine'+index+'\\.payee"]').val("");
	$('input[name="specialServiceFormLine'+index+'\\.careOf"]').val("");
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
	$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr("disabled", false);
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
	$('#specialServiceFormLine'+index).validationEngine('hideAll');
	
	$('#passThruPayable'+index).val('');
}

/*
 * Rules for applied when Special Service Code is selected from Predictive or Lookup
 */

function processUIValidations(index){
	processPayeeRequired(index);
	processRateRateBasis(index);
	processUnits(index);
	//processSpecialServicedate(index);
	processProcessLevelCode(index);
	$("#specialServiceMasterForm").validationEngine('detach');
	$("#specialServiceMasterForm").validationEngine('attach');
}
/*
 * Rules for applied when Special Service Code is selected from Predictive or Lookup
 */

function applyUIValidations(index){
	
	var truckerRateId=$('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	hideErrorMessage();
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
	var passThruPayable=$('#passThruPayable'+index).val();
	var milTruckerRateId= $('input[name="specialServiceFormLine'+index+'\\.milTruckerRateId"]').val();
	var isDefaultFrtPayableCharge='';
	var accessorialAllowanceCode='';
	//Added PassthruPayable=="null" condition for Defect D026932
	if(passThruPayable=='' || passThruPayable==null || passThruPayable==undefined || passThruPayable=="null"){
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.note"]').val('');
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
		$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
		$('#imgPayeeLine'+index).hide();
		return;
	} else {
		spSvChargeCode=passThruPayable;
	}
	if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='N'){
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getChargeCode",
		data : {
			// ChargeCode
			chargeCode: spSvChargeCode
		},
		success : function(responseText) {
			//alert(responseText);
			if(responseText!=null && responseText.data!=null){
				isDefaultFrtPayableCharge = responseText.data.isDefaultFrtPayableCharge;
				accessorialAllowanceCode = responseText.data.accessorialAllowanceCode;
				if(isDefaultFrtPayableCharge=='Y'){
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').addClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
					$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr('disabled',true);
					$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',false);
					$('#imgPayeeLine'+index).show();
				}else if(isDefaultFrtPayableCharge=='N' && (milTruckerRateId=='')){
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
					$('input[name="specialServiceFormLine'+index+'\\.careOf"]').val('');
					$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val('');
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
					$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr('disabled',true);
					$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',true);
					$('#imgPayeeLine'+index).hide();
				}else{
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
					$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
					$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr('disabled',true);
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
				if(isDefaultFrtPayableCharge!='Y'){
					var rateBasis=$('select[name="specialServiceFormLine'+index+'\\.rateBasisCode"]').selected().val();
					if($('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='Y' && 
							$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val()!='N' && (rateBasis==null || rateBasis=='') ){
						
						$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
						$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',false);
						$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr('disabled',true);
						$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',false);
						$('#imgPayeeLine'+index).show();
					}
				}
			
			}else{
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.careOf"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').val('');
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').removeClass("validate[required]");
				$('input[name="specialServiceFormLine'+index+'\\.payee"]').attr('disabled',true);
				$('input[name="specialServiceFormLine'+index+'\\.careOf"]').attr('disabled',true);
				$('input[name="specialServiceFormLine'+index+'\\.routingText"]').attr('disabled',true);
				$('#imgPayeeLine'+index).hide();
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
	var freightCount = "";
	if($("#commodityGrid").getGridParam("reccount")!='undefined' && $("#commodityGrid").getGridParam("reccount")>0){
		freightCount = $("#commodityGrid").getGridParam("reccount");
	}else if($("#povGrid").getGridParam("reccount")!='undefined' && $("#povGrid").getGridParam("reccount")>0){
		freightCount = $("#povGrid").getGridParam("reccount");
	}else if($("#convGrid").getGridParam("reccount")!='undefined' && $("#convGrid").getGridParam("reccount")>0){
		freightCount = $("#convGrid").getGridParam("reccount");
	}
	var commSize= $('#unitOfCommodity option');
	if(freightCount!=null && freightCount!=undefined && freightCount!=''){
		if(commSize!=null && commSize!=undefined && commSize.length==1){
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
			var freightCount = $("#commodityGrid").getGridParam("reccount");
			var vinsightCount = $("#povGrid").getGridParam("reccount");
			var convCount = $("#convGrid").getGridParam("reccount");
			var ldsGroup = $('#loadDischargeServiceGroup').val();
			if(freightCount!=null && freightCount!=undefined && freightCount!=''&& freightCount==1 && ldsGroup=='CY'){
				var rowIDs = $('#commodityGrid').getDataIDs();
				for (var i=0;i<rowIDs.length;i=i+1)  { 
					//var rowData=$('#commodityGrid').getRowData(rowIDs[i]);
					var colValue=$("#commodityGrid").jqGrid('getCell', rowIDs[i], 'equipmentId');
					$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(colValue);
					$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(colValue);
					$("#equipmentVinsightHidden"+index).val(colValue);
				}
				
			}else if(vinsightCount!=null && vinsightCount!=undefined && vinsightCount!=''&& vinsightCount==1 && ldsGroup=='AU'){
				var rowIDs = $('#povGrid').getDataIDs();
				for (var i=0;i<rowIDs.length;i=i+1)  { 
					//var rowData=$('#commodityGrid').getRowData(rowIDs[i]);
					var colValue=$("#povGrid").jqGrid('getCell', rowIDs[i], 'receivedUnitId');
					$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(colValue);
					$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(colValue);
					$("#equipmentVinsightHidden"+index).val(colValue);
				}
			}else if(convCount!=null && convCount!=undefined && convCount!=''&& convCount==1 && (ldsGroup=='CON' || ldsGroup=='LCL')){
				var rowIDs = $('#convGrid').getDataIDs();
				for (var i=0;i<rowIDs.length;i=i+1)  { 
					//var rowData=$('#commodityGrid').getRowData(rowIDs[i]);
					var colValue=$("#convGrid").jqGrid('getCell', rowIDs[i], 'receivedUnitId');
					if(colValue==''){
						colValue=$("#convGrid").jqGrid('getCell', rowIDs[i], 'equipmentId');
					}
					$('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val(colValue);
					$('input[name="specialServiceFormLine'+index+'\\.equipmentId"]').val(colValue);
					$("#equipmentVinsightHidden"+index).val(colValue);
				}
			}
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
			$('input[name="specialServiceFormLine'+index+'\\.source"]').val("AH CUSTOM");
			$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val('Y');
		}
	}
}

/*
 * Populate fields on Special Service Predictive Search
 */

/*function populateFields(data,index){
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
	
}*/

/*
 * populating Edit Row
 */


function populateEditRow(responseText){
	$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val(responseText.specialServiceFormLine1.specialServiceCode);
	$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').val(responseText.specialServiceFormLine1.commodityLineNumber);
	
	//SpecialService code - Apply to All Indicator
	$('select[name="specialServiceFormLine1\\.isApplyToAll"]').selected().val(responseText.specialServiceFormLine1.isApplyToAll);
	$('input[name="specialServiceFormLine1\\.processLevelCode"]').text(responseText.specialServiceFormLine1.processLevelCode);
	$('label[for="specialServiceFormLine1\\.processLevelCodeReadOnly"]').text(responseText.specialServiceFormLine1.processLevelCode);
	
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
	//Rate Basis - Source
	$('select[name="specialServiceFormLine1\\.rateBasisCode"]').val(responseText.specialServiceFormLine1.rateBasisCode);
	$('input[name="specialServiceFormLine1\\.source"]').text(responseText.specialServiceFormLine1.source);
	//Payee-Routing Text
	$('input[name="specialServiceFormLine1\\.payee"]').val(responseText.specialServiceFormLine1.payee);
	$('input[name="specialServiceFormLine1\\.careOf"]').val(responseText.specialServiceFormLine1.careOf);
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
/*
 * Populate fields on Special Service Predictive Search
 */

function populateFields(data,index){
	var entity_name = $("#spSvcEntityName").val();
	//alert("data.chgres:::"+data.chgres);
	//Process level code
	$('input[name="specialServiceFormLine'+index+'\\.processLevelCode"]').val(data.level);
	$('label[for="specialServiceFormLine'+index+'\\.processLevelCodeReadOnly"]').text(data.level);
	// is manual charge
	$('input[name="specialServiceFormLine'+index+'\\.isManualCharge"]').val(data.manchrg);
	// Charge Code
	//$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.chgres);
	//$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.rticmr);
	
	if(data.passpay!=undefined && data.passpay!=""){
		$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.passpay);
	}else if(data.rtipmr!=undefined && data.rtipmr!=""){
		$('input[name="specialServiceFormLine'+index+'\\.chargeCodeExpected"]').val(data.rtipmr);
	}
	
	// is required qty
	$('input[name="specialServiceFormLine'+index+'\\.isRequireQuantity"]').val(data.reqqty);
	// is required date
	$('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val(data.reqdt);
	$('input[name="specialServiceFormLine'+index+'\\.source"]').val("Manual");
	$('label[for="specialServiceFormLine'+index+'\\.sourceReadOnly"]').text("Manual");
	$('input[name="specialServiceFormLine'+index+'\\.isMilTruckerRateCustomized"]').val("N");

	$('#passThruPayable'+index).val(data.passpay);
	
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
		 			checkBgColor(item.arolid);
		 		}
		 		else if(item.count>1){
		 			casPayeeLookup(1); 
		 		}
	 		} else {
	 			showError("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine1.organisationId"]').val("");
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
		 		$('input[name="specialServiceFormLine2.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,2);
		 			checkBgColor(item.arolid);
		 		}
		 		else if(item.count>1){
		 			casPayeeLookup(2); 
		 		}
		 		$("#payeeHidden2").val($('input[name="specialServiceFormLine2\\.payee"]').val());
	 		} else {
	 			showError("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine2.organisationId"]').val("");
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
		 		$('input[name="specialServiceFormLine3.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,3);
		 			checkBgColor(item.arolid);
		 		}
		 		else if(item.count>1){
		 			casPayeeLookup(3); 
		 		}
		 		$("#payeeHidden3").val($('input[name="specialServiceFormLine3\\.payee"]').val());
	 		} else {
	 			showError("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine3.organisationId"]').val("");
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
		 		$('input[name="specialServiceFormLine4.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,4);
		 			checkBgColor(item.arolid);
		 		}
		 		else if(item.count>1){
		 			casPayeeLookup(4); 
		 		}
		 		$("#payeeHidden4").val($('input[name="specialServiceFormLine4\\.payee"]').val());
	 		} else {
	 			showError("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine4.organisationId"]').val("");
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
		 		$('input[name="specialServiceFormLine5.organisationId"]').val(orgId);
		 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
		 			console.log(item.arolid);
		 			console.log(item.addid);
		 			fetchAddresssDetails(item,5);
		 			checkBgColor(item.arolid);
		 		}
		 		else if(item.count>1){
		 			casPayeeLookup(5); 
		 		}
		 		$("#payeeHidden5").val($('input[name="specialServiceFormLine5\\.payee"]').val());
	 		} else {
	 			showError("Trucker is not compliant for Military move");
	 			$('input[name="specialServiceFormLine5.organisationId"]').val("");
	 			window.setTimeout(function(){ $('input[name="specialServiceFormLine5\\.payee"]').val(''); }, 250);
	 		}
	 		isSpecialServiceChanged=true;
	 	}
	});	
}

/*
 * populating Edit Row
 */
function populateHiddenFields(index){
	//Hidden fields population	
	$('#specialServiceCode'+index).val($('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val());
	$('#truckerAmount'+index).val($('input[name="specialServiceFormLine'+index+'\\.manualUserRate"]').val());
	$('#payeeHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.payee"]').val());
	$('#equipmentVinsightHidden'+index).val($('input[name="specialServiceFormLine'+index+'\\.equipmentVinsight"]').val());
}


function casPredictiveSearchOnAllLines(){
	//var url = _context+'/cas/autocomplete.do?method=getSpclSrvcBK&searchType=256';
	var entity_name=$('#spSvcEntityName').val();
	var procLvlCd='ALL';
	/*if(entity_name=='container'){
		procLvlCd='E';
	}else if(entity_name=='quote'){
		procLvlCd='C';
	}*/
	$('input[name="specialServiceFormLine1\\.specialServiceCode"]').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
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
			populateFields(data,index);
			applyUIValidations(index);
			isSpecialServiceChanged=true;
		},
		onChange:function(){
			var index=1;
			checkForSpecialServiceCdChg(index);
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
			populateFields(data,index);
			applyUIValidations(index);
			isSpecialServiceChanged=true;
		},
		onChange:function(){
			var index=2;
			checkForSpecialServiceCdChg(index);
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
			populateFields(data,index);
			applyUIValidations(index);
			isSpecialServiceChanged=true;
		},
		onChange:function(){
			var index=3;
			checkForSpecialServiceCdChg(index);
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
			populateFields(data,index);
			applyUIValidations(index);
			isSpecialServiceChanged=true;
		},
		onChange:function(){
			var index=4;
			checkForSpecialServiceCdChg(index);
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
			populateFields(data,index);
			applyUIValidations(index);
			isSpecialServiceChanged=true;
		},
		onChange:function(){
			var index=5;
			checkForSpecialServiceCdChg(index);
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
}


function casEquipmentVinsightLookup(index){
	equipmentVinsightLineNumber=index;
	var shipmentNum= $("#shipmentNumber").val();
	var seqNum= $("#shipmentSequenceNumber").val();
	var corrNum= $("#shipmentCorrectionNumber").val();
	var LDSGroupCode = $('#loadDschServiceGroupCode').val();
	var equipPiece=$('#totalEqpts').html();
	var equpId= $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val();
	var status= $('#statusCode').html();
	var recDate = $('#rateDate').val();
	var ldServ=$('#loadServiceCode').val()+"-"+$('#dischargeServiceCode').val();
	//Defect-25770
	//cas/billOfLadFrtListConvlookup.do?0795360,000,FFF,CON/CON,10-17-2008,ISSD,MORG000001-1,CON,9"
	//cas/billLadingUnitConvlookup.do?0795360,000,FFF,,,,,,9"
	var urlCY="/cas/billLadingFreightlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ LDSGroupCode.trim()+","+recDate+","+status+","+equpId+","+ ldServ+","+equipPiece+","+"&reload=true";	
	//var urlAU="/cas/billLadingUnitlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ LDSGroupCode.trim()+","+recDate+","+status+","+equpId+","+ ldServ+","+equipPiece+","+"&reload=true";		
	//var urlCON="/cas/billOfLadFrtListConvlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ ldServ+","+recDate+","+status+","+equpId+","+ LDSGroupCode.trim()+","+equipPiece+","+"&reload=true";	
	var urlAU="/cas/billLadingUnitlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+LDSGroupCode.trim()+","+recDate+","+status+","+equpId+","+ldServ+","+equipPiece+","+"&reload=true";		
	var urlCON="/cas/billOfLadFrtListConvlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ldServ+","+recDate+","+status+","+equpId+","+LDSGroupCode.trim()+","+equipPiece+","+"&reload=true";
	var actionUrl="";
	if(LDSGroupCode=='AU'){
		actionUrl = _context+urlAU;
	}else if(LDSGroupCode=='CON' || LDSGroupCode =='LCL'){
		actionUrl = _context+urlCON;
	}else{
		actionUrl = _context+urlCY;
	}
	//actionUrl = _context + '/cas/receivedUnitsLookupSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);

	/*equipmentVinsightLineNumber=index;
	var isRequiredUnit=$('#isRequireReceivedUnit').val();
	var shipmentNumber=$('#shipmentNumber').val();
	alert("isRequireReceivedUnit"+isRequiredUnit);
	alert("shipmentNumber"+shipmentNumber);
	var actionUrl =null;
	var header='Recieved Unit List';
	if(isRequiredUnit!=null && isRequiredUnit!=undefined && $.trim(isRequiredUnit)!=''){
		if(isRequiredUnit=='Y'){
			actionUrl = _context + '/cas/receivedUnitsLookupSearch.do';	
			header="Recieved Unit List";
		}else if(isRequiredUnit=='N'){
			actionUrl = _context + '/cas/containerListbyBKPopUpSearch.do?filterValue1='+shipmentNumber;
			header="Container List";
		}
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, header, windowStyle);
	}*/

}

function loadEquipmentNumber(id)
{
 //alert("loadEquipmentNumber"+id);
 var casData = id.split('|');
 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
	$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
	$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.shipmentFreightId"]').val(casData[1]);
	isSpecialServiceChanged=true; 
}
function loadVinNumber(id)
{
 //alert("loadVinNumber"+id)	;
	var casData = id.split('|');
	 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
		$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
}
function loadConUnitDescription(id){
	//alert("loadVinNumber"+id);
	var casData = id.split('|');
	 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
		$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.shipmentFreightId"]').val(casData[1]);
}
function loadConEquipmentNumber(id){
	//alert("loadVinNumber"+id);
	var casData = id.split('|');
	 $('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentVinsight"]').val(casData[0]);
		$("#equipmentVinsightHidden"+equipmentVinsightLineNumber).val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.equipmentId"]').val(casData[0]);
		$('input[name="specialServiceFormLine'+equipmentVinsightLineNumber+'\\.shipmentFreightId"]').val(casData[1]);
}

function loadConVinNumber(id){
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
	/*if(entity_name=='container'){
		proclvlCd='E';
	}else if(entity_name=='quote'){
		proclvlCd='C';
	}*/
	var specialServiceCode = $('input[name="specialServiceFormLine'+index+'\\.specialServiceCode"]').val();
	var actionUrl = _context + '/cas/spclSrvBKLookup.do?filterValue1='+encodeURIComponent(specialServiceCode)+'|'+proclvlCd+'|'+'&srcScreen=QT';
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function spclServiceUpdate(id){
	var values = id.split("|");
	var rateQuantityDate = values[2].split("-");
	clearSpecialServiceRow(spsvCodeLineNumber);
	$('#specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceDesc').val(values[0]+'-'+values[4]);
	$('#specialServiceCode'+spsvCodeLineNumber).val(values[0]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.specialServiceCode"]').val(values[0]);
	//Process level code
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.processLevelCode"]').val(values[1]);
	$('label[for="specialServiceFormLine'+spsvCodeLineNumber+'\\.processLevelCodeReadOnly"]').text(values[1]);
	// is manual charge
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isManualCharge"]').val(rateQuantityDate[2]);
	// Charge Code
	//$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.chargeCodeExpected"]').val(values[3]);
	if(values[6]!=undefined && values[6]!=""){
		$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.chargeCodeExpected"]').val(values[6]);	
	}else if(values[7]!=undefined && values[7]!=""){
		$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.chargeCodeExpected"]').val(values[7]);
	}
	
	// is required qty
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireQuantity"]').val(rateQuantityDate[1]);
	// is required date
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isRequireDate"]').val(rateQuantityDate[0]);
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.source"]').val("Manual");
	$('label[for="specialServiceFormLine'+spsvCodeLineNumber+'\\.sourceReadOnly"]').text("Manual");
	$('input[name="specialServiceFormLine'+spsvCodeLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	
	//D025911: 	Maintain Billing: Adding special service HHAGTLH from pop-up protects the payee field
	$('#passThruPayable'+spsvCodeLineNumber).val(values[6]);
	
	checkForSpecialServiceCdChg(spsvCodeLineNumber);
	isSpecialServiceChanged = true;
	
	applyUIValidations(spsvCodeLineNumber);
}


/*
 * QUOTE|TRUCKER|HHGM_ALL|PHONE|TRUCKER_ORIGIN|TRUCKER_RAMP|DIRECTION|RATE|ZIP|BASE_RATE|DROP_PULL|FREE_TIME|
 * OVER_TIME|CHASE_RATE|CITY|STATE|ZIP_CODE|FUEL_SURTY|FUEL_SUR
*/


function casTruckerLookup(index) {
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
	$('label[for="specialServiceFormLine'+truckerLineNumber+'\\.sourceReadOnly"]').text("AH");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.isMilTruckerRateCustomized"]').val("N");
	// Adding Drop and Pull
	$('#truckerAmount'+truckerLineNumber).val(values[7]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.isDropOrPull"]').selected().val(values[10]);
	$('select[name="specialServiceFormLine'+truckerLineNumber+'\\.isDropOrPull"]').attr("disabled", true);
	//Only Payee or Trucker can be associated with Special Service
	//$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.addressRoleId"]').val("");
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.note"]').val('');
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.organisationId"]').val(values[21]);
	$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.addressRoleId"]').val(values[20]);
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
			$('input[name="specialServiceFormLine'+truckerLineNumber+'\\.careOf"]').val('');
		}
	});
}


function casPayeeLookup(index) {
	payeeLineNumber=index;
	//$('input[id="organistionId"'+payeeLineNumber+']')
	//var org_id=$('input[id="organistionId'+payeeLineNumber+'"]').val();
	//var org_id=$("#organistionId"+payeeLineNumber).val();
	var org_id=$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val();
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
function payeeLookupUpdate(id){/*
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
*/}

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
				tariff : $("#tariffNumber").val() 
			 },
		url : _context + "/shipment/specialservice/validatePayee",
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
		url : _context +"/shipment/specialservice/getAddressDetails",
		data : {
			addressId: item.addid
		},
		success : function(responseText) {
			$("#payeeHidden"+payeeLineNumber).val(item.name);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.payee"]').val(item.name);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.organisationId"]').val(item.orgid);
			//Name, Addr_Line1, Addr_line2, Suite, City
			/*var routingText=values[7]+","+values[9]+","+values[13]+","+values[4];
			if(values[1]!=null || values[1]!=''){
				var orgAddressId=values[1];
				routingText=fetchAddresssDetails(orgAddressId,payeeLineNumber);
			}*/
			$.ajax({
				type : "POST",
				url : _context +"/shipment/specialservice/getCareOfDetails",
				data : {
					addressId: item.arolid
				},
				success : function(responseText){
					$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.careOf"]').val(responseText.data);
				}
			});
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.routingText"]').val(responseText.data);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(item.arolid);
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
			$('label[for="specialServiceFormLine'+payeeLineNumber+'\\.sourceReadOnly"]').text("Manual");
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
			$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
			checkRateBasisRequired(payeeLineNumber);
			isSpecialServiceChanged=true;
		}
	});
}


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




function validateRateRequired(fields, rules, i, options){
alert("validateRateRequired "+fields.context.value);
if(fields.context.value==null || fields.context.value==""){
	return "* Rate is required";
}
}
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
function validateSpecialServiceFields(){
	var isValid = true;
	//Added code for D028272:BBFBHI speical service code does not require payee if user does not enter ratebasis and rate amount 
	var spSvCode="";
	//alert("Test: " + $('input[name="specialServiceFormLine1\\.specialServiceCode"]').val());
	//alert("isSpecialServiceAdd  1::::"+$("#isSpecialServiceAdd").val());
	if($("#isSpecialServiceAdd").val()!='false'){
		if($('input[name="specialServiceFormLine1\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(1)){
			//alert("Inside if 1::");
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
		}else{
			//alert("Inside else 1::");
			 spSvCode=$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine1\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine1\\.rateBasisCode"]').selected().val() ==null && $('input[name="specialServiceFormLine1\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine1\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine1\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine1').hide();
			  }
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').removeClass("validate[required]");
		}
		if(isValid && $('input[name="specialServiceFormLine2\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(2)){
			$('input[name="specialServiceFormLine2\\.specialServiceCode"]').addClass("validate[required]");
			//alert("Inside if 2::");
			isValid=false;
			
		}else{
			spSvCode=$('input[name="specialServiceFormLine2\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine2\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine2\\.rateBasisCode"]').selected().val() ==null && $('input[name="specialServiceFormLine2\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine2\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine2\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine2').hide();
			  }
			$('input[name="specialServiceFormLine2\\.specialServiceCode"]').removeClass("validate[required]");
			//alert("Inside else 2::");
		}
		if(isValid && $('input[name="specialServiceFormLine3\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(3)){
			$('input[name="specialServiceFormLine3\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			spSvCode=$('input[name="specialServiceFormLine3\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine3\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine3\\.rateBasisCode"]').selected().val() ==null && $('input[name="specialServiceFormLine3\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine3\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine3\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine3').hide();
			  }
			$('input[name="specialServiceFormLine3\\.specialServiceCode"]').removeClass("validate[required]");
		}
		if(isValid && $('input[name="specialServiceFormLine4\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(4)){
			$('input[name="specialServiceFormLine4\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			spSvCode=$('input[name="specialServiceFormLine4\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine4\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine4\\.rateBasisCode"]').selected().val() ==null && $('input[name="specialServiceFormLine4\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine4\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine4\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine4').hide();
			  }
			$('input[name="specialServiceFormLine4\\.specialServiceCode"]').removeClass("validate[required]");
		}
		if(isValid && $('input[name="specialServiceFormLine5\\.specialServiceCode"]').val()=="" && !specialServiceLineCheck(5)){
			$('input[name="specialServiceFormLine5\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
			
		}else{
			spSvCode=$('input[name="specialServiceFormLine5\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine5\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine5\\.rateBasisCode"]').selected().val() ==null && $('input[name="specialServiceFormLine5\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine5\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine5\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine5').hide();
			  }
			$('input[name="specialServiceFormLine5\\.specialServiceCode"]').removeClass("validate[required]");
		}
	}else{
		if($('input[name="specialServiceFormLine1\\.specialServiceCode"]').val()==""){
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').addClass("validate[required]");
			isValid=false;
		}else{
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').removeClass("validate[required]");
			spSvCode=$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val();
			if($('input[name="specialServiceFormLine1\\.payee"]').hasClass("validate[required]") && $('select[name="specialServiceFormLine1\\.rateBasisCode"]').selected().val() =="" && $('input[name="specialServiceFormLine1\\.manualUserRate"]').val()=="")
			  {
				 $('input[name="specialServiceFormLine1\\.payee"]').removeClass("validate[required]");
			     $('input[name="specialServiceFormLine1\\.payee"]').attr('disabled',true);
			     $('#imgPayeeLine1').hide();
			  }
		}
	}
	
	if( $('input[name="specialServiceFormLine1.organisationId"]').val()!="" &&  $('input[name="specialServiceFormLine1.organisationId"]').val()!=null)
			{ 
					if($('input[name="specialServiceFormLine1\\.addressRoleId"]').val()==null ||  $('input[name="specialServiceFormLine1\\.addressRoleId"]').val()=='')
						{
						 $('input[name="specialServiceFormLine1.routingText"]').validationEngine('showPrompt', ' * Please select adddress role for selected organization.', 'error', true);
							isValid=false;
						}
					else
						{
							$('input[name="specialServiceFormLine1\\.routingText"]').removeClass("validate[required]");
						}
			}
	if( $('input[name="specialServiceFormLine2.organisationId"]').val()!="" &&  $('input[name="specialServiceFormLine2.organisationId"]').val()!=null)
	{ 
			if($('input[name="specialServiceFormLine2\\.addressRoleId"]').val()==null ||  $('input[name="specialServiceFormLine2\\.addressRoleId"]').val()=='')
				{
				 $('input[name="specialServiceFormLine2.routingText"]').validationEngine('showPrompt', ' * Please select adddress role for selected organization.', 'error', true);
					isValid=false;
				}
			else
				{
					$('input[name="specialServiceFormLine2\\.routingText"]').removeClass("validate[required]");
				}
	}
	if( $('input[name="specialServiceFormLine3.organisationId"]').val()!="" &&  $('input[name="specialServiceFormLine3.organisationId"]').val()!=null)
	{ 
			if($('input[name="specialServiceFormLine3\\.addressRoleId"]').val()==null ||  $('input[name="specialServiceFormLine3\\.addressRoleId"]').val()=='')
				{
				 $('input[name="specialServiceFormLine3.routingText"]').validationEngine('showPrompt', ' * Please select adddress role for selected organization.', 'error', true);
					isValid=false;
				}
			else
				{
					$('input[name="specialServiceFormLine3\\.routingText"]').removeClass("validate[required]");
				}
	}
	if( $('input[name="specialServiceFormLine4.organisationId"]').val()!="" &&  $('input[name="specialServiceFormLine4.organisationId"]').val()!=null)
	{ 
			if($('input[name="specialServiceFormLine4\\.addressRoleId"]').val()==null ||  $('input[name="specialServiceFormLine4\\.addressRoleId"]').val()=='')
				{
				 $('input[name="specialServiceFormLine4.routingText"]').validationEngine('showPrompt', ' * Please select adddress role for selected organization.', 'error', true);
					isValid=false;
				}
			else
				{
					$('input[name="specialServiceFormLine4\\.routingText"]').removeClass("validate[required]");
				}
	}
	if( $('input[name="specialServiceFormLine5.organisationId"]').val()!="" &&  $('input[name="specialServiceFormLine5.organisationId"]').val()!=null)
	{ 
			if($('input[name="specialServiceFormLine5\\.addressRoleId"]').val()==null ||  $('input[name="specialServiceFormLine5\\.addressRoleId"]').val()=='')
				{
				 $('input[name="specialServiceFormLine5.routingText"]').validationEngine('showPrompt', ' * Please select adddress role for selected organization.', 'error', true);
					isValid=false;
				}
			else
				{
					$('input[name="specialServiceFormLine5\\.routingText"]').removeClass("validate[required]");
				}
	}
	return isValid;
}




function showErrorMessage(){
	$('#msgDivSplSrv').html("<div class=\"message_error\"> Unit is not linked to shipment "+ $("#shipmentNumber").val()+"</div>");
	$('#msgDivSplSrv').show();
}

function showError(errorMessageString){
	$('#msgDivSplSrv').html("<div class=\"message_error\">"+ errorMessageString+"</div>");
	$('#msgDivSplSrv').show();
}

function hideErrorMessage(){
	$('#msgDivSplSrv').html("");
	$('#msgDivSplSrv').hide();
}

/*function processSpecialServicedate(index){
//Date Check.
if($('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val()=='N'){
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').removeClass("validate[required] hasDatepicker");
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').attr('disabled',true);
}else	if($('input[name="specialServiceFormLine'+index+'\\.isRequireDate"]').val()=='Y'){
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').attr('disabled',false);
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').addClass("validate[required] hasDatepicker");
}else{
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').attr('disabled',false);
	$('input[name="specialServiceFormLine'+index+'\\.specialServiceDate"]').removeClass("validate[required] hasDatepicker");
}
}*/

function addroleUpdateForSPSR(data) {
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.note"]').val('');
	var values = data.split("|");
	var routingText = formatAddRoleDscrForSPSV(values[4],values[7],values[2],values[6]);
	//$("#payeeHidden"+payeeLineNumber).val(item.name);
	if(values[3]!='null')
	    $('input[name="specialServiceFormLine'+payeeLineNumber+'\\.careOf"]').val(values[3]);
	else
		$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.careOf"]').val('');	
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.routingText"]').val(routingText);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.addressRoleId"]').val(values[9]);
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.source"]').val("Manual");
	$('label[for="specialServiceFormLine'+payeeLineNumber+'\\.sourceReadOnly"]').text("Manual");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.isMilTruckerRateCustomized"]').val("");
	$('input[name="specialServiceFormLine'+payeeLineNumber+'\\.milTruckerRateId"]').val("");
	checkRateBasisRequired(payeeLineNumber);
	isSpecialServiceChanged=true;
	var dataUrl = _context +"/shipment/specialservice/changeBgColor?arolid="+values[9];
		$.ajax({
			type : "GET",
			url: dataUrl,
			success: function(responseText){
				if(responseText=='03'){
					$('input[name="specialServiceFormLine1.payee"]').css("color", "purple");
				}else{
					$('input[name="specialServiceFormLine1.payee"]').css("color", "");
				}
			}
		});

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
function getRateBasisList() {
	// Get contact list for address. [commented for merge.]specialServiceFormLine1.rateBasisCode
	$.ajax({
		async:false,
		type : "POST",
		url : _context +"/shipment/specialservice/getRateBasisList",
		data : {
		},
		success : function(responseText) {
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
	});	
		
}

function checkBgColor(arolid)
{
	var dataUrl = _context +"/shipment/specialservice/changeBgColor?arolid="+arolid;
		$.ajax({
			type : "GET",
			url: dataUrl,
			success: function(responseText){
				if(responseText=='03'){
					$('input[name="specialServiceFormLine1.payee"]').css("color", "purple");
				}else{
					$('input[name="specialServiceFormLine1.payee"]').css("color", "");
				}
			}
		});
}

function formatToTwoDecimalPlaces(val)
{
	var formattedVal="";
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
	return formattedVal;
}
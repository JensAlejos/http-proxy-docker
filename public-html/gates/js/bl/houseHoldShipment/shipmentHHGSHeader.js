var somethingChangedShipperConsigneeOverlay="";
var setContainerTroughPredictive = true;
var disableRateButtonWhenStdBillExist=true;
var oldratedt=" ";
$(function() {
	$('#shipmentHouseHoldForm').validationEngine('attach');
	$('#shipmentHouseHoldBasicDetailForm').validationEngine('attach');
	
	
	$('#shipmentHouseHoldBasicDetailForm input').change(function(){
		somethingChangedShipperConsigneeOverlay = true;
	});
	
	 $('#containerListHHGS').editableDropdown({
			mustMatch: false,
			change: function() {
				
				populateContainerDetails();
			}
			
		});	
	//Shipment# Predictive Search
	var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355';
	$('#shipmentNumber').gatesAutocomplete({
		source: url,
		minLength: 7,
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			setContainerTroughPredictive = false;
			$('#shipmentNumber').val(data.shpmntNo);
			blockUI();			
			populateEquipmentList($('#shipmentNumber').val());	
			$.unblockUI();
			captureChanges();
		}
			});
	$('#shipmentNumber').change(function(){
		if($('#shipmentNumber').val()!='' && $('#shipmentNumber').val().length!=7)
		{
			$('#shipmentNumber').validationEngine('showPrompt', 'Please enter a valid Shipment Number', 'error', 'topRight', true);
			clearHeaderSectionData();
			return ;
		}
		clearHeaderSectionData();
		//showContainerLoadingMessage();
		populateEquipmentList($('#shipmentNumber').val());	
		captureChanges();
	});
	
	$('input[name = "consignee.contactEmailAddress"]').blur(function(){
		var emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i ;
		if(!emailRegEx.test($('input[name = "consignee.contactEmailAddress"]').val())) {
			$('input[name = "consignee.contactEmailAddress"]').validationEngine('showPrompt', '* Invalid email address', 'error', true);
			return false;
		} 
	});
	
	$('input[name = "shipper.contactEmailAddress"]').blur(function(){
		var emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i ;
		if(!emailRegEx.test($('input[name = "shipper.contactEmailAddress"]').val())) {
			$('input[name = "shipper.contactEmailAddress"]').validationEngine('showPrompt', '* Invalid email address', 'error', true);
			return false;
		} 
	});
	
	
	
	
	$('#shipmentHHGSGoBtn').click(function(){
		/*if($('#containerListHHGS').val()==null)
		{
			alert("null");
		}*/
		if($('#shipmentNumber').val()=="")
			{
				$('#shipmentNumber').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
				return false;
			}
		if($('#shipmentNumber').val().length!=7)
			{
				$('#shipmentNumber').validationEngine('showPrompt', 'Please enter a valid Shipment Number', 'error', 'topRight', true);
				return false;
			}
		if($("#containerListHHGS").editableDropdown("getSelectedOption").val()==null ||
				$("#containerListHHGS").editableDropdown("getSelectedOption").val().trim()=="")
			{
				$('#containerSpanId').validationEngine('showPrompt', ' * This field is required ', 'error', 'topRight', true);
				return false;
			}
		
			$('#shipmentHouseHoldForm').validationEngine('hideAll');
				blockUI();
				showLoadingMessage();
				var isRated="false";
				setScreenDetails(isRated);

				commodityHHGSLoadComplete();
				$.unblockUI();
				commodityHHGSLoadComplete();
				captureChanges();

	});
	
	//Session tracking
	if($('#shipmentNumber').val()!=''){
		$('#shipmentNumber').trigger("change");
		 $('#shipmentHHGSGoBtn').trigger("click");
	} 	
	$('.FormData').remove();
	
	
	//overlay
	$( "#shipperConsigneeRoutingDialog" ).dialog({
		autoOpen : false,
		width :930,
		modal : true,
		close : function()
		{
			clearOverlayMessage();
			$('#shipmentHouseHoldBasicDetailForm').validationEngine('hideAll');
			//$("#shipperConsigneeRoutingDialog").dialog('close');
		},
		//title: titleValue,
		buttons:{			
			Cancel:function()
			{
				if(somethingChangedShipperConsigneeOverlay == true)
					{
					 var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
				   		if(conf== true )
				   		{
				   			$('#shipmentHouseHoldBasicDetailForm').validationEngine('hideAll');
				   			$("#shipperConsigneeRoutingDialog").dialog('close');
				   			somethingChangedShipperConsigneeOverlay = false;	   	
				   		}
					}
				else
					{
						clearOverlayMessage();
						$('#shipmentHouseHoldBasicDetailForm').validationEngine('hideAll');
						$("#shipperConsigneeRoutingDialog").dialog('close');
					}
			},
			
			Ok:function()
			{
				
				if($('#shipmentHouseHoldBasicDetailForm').validationEngine('validate') && validateShipmentUIFields())
				{
					var shipment = $('#shipmentHouseHoldBasicDetailForm').formSerialize();		
					var saveUrl='';
					saveUrl=_context+'/houseHoldShipment/addShprConRoutDetailToSummary';
					$.ajax({
						type:"POST",
						url: saveUrl,
						data: shipment,
						success : function(responseText) 
							{
								if (responseText.success == true) {
									setShipperConsigneeDetails();
									$("#commodityHHGS").trigger("reloadGrid");
									$("#shipperConsigneeRoutingDialog").dialog('close');
									setDivNames();
								} else {
									showResponseMessages("msgOverLayDiv", responseText);
								}
							}			
						});					
				}
				
			}				
	}});
	
	//on click of edit button
	$('#edit').click(function()
			{	
				clearOverlayMessage();
				$.ajax({				
					url: _context+'/houseHoldShipment/openEditHHGSDetails',
					success : function(responseText) 
						{
							if (responseText.success == true) {
								setShipperConsigneeEditOverlayData(responseText);
								$("#shipperConsigneeRoutingDialog").dialog('open');
								setRoutingLoadDischargeDetails();
								//tabSequence('#shipmentHouseHoldBasicDetailForm');
								$('#blOriginCityCodeDescription').focus();
							} else {
								//$("#shipmentStatusCode").attr("disabled", true);
							}
						}			
					});		
			});
});//ready function end

function setAccordianTabDetails(id, displayText) {
	$("#" + id).text(displayText);
}

function setDivNames() {
	if ($('div[id="shipperHHGS"]').text() != ''
			&& $('div[id="shipperHHGS"]').text() != null)
		setAccordianTabDetails("shipmentBasicDetails","-"+
				$('div[id="shipperHHGS"]').text());
	else
		setAccordianTabDetails("shipmentBasicDetails", "");

	if ($('div[id="consigneeHHGS"]').text() != ''
			&& $('div[id="consigneeHHGS"]').text() != null)
		setAccordianTabDetails("consignmentBasicDetails","-"+
				$('div[id="consigneeHHGS"]').text());
	else
		setAccordianTabDetails("consignmentBasicDetails", "");
	
	var total = "";
	if ($('div[id="loadServiceHHGS"]').text() != ''
		&& $('div[id="loadServiceHHGS"]').text() != null)
		total =  total + $('div[id="loadServiceHHGS"]').text() + "-";
	
	if ($('div[id="discServiceHHGS"]').text() != ''
		&& $('div[id="discServiceHHGS"]').text() != null)
		total =  total + $('div[id="discServiceHHGS"]').text() + "|";
	
	if ($('div[id="vvdHHGS"]').text() != ''
		&& $('div[id="vvdHHGS"]').text() != null)
		total =  total + $('div[id="vvdHHGS"]').text();
	
	setAccordianTabDetails("routingBasicDetails", total);
	
	//setCommodityHeader();
	
	setClauseDiv();
	if($('div[id="shipperHHGS"]').text()!="")
	{
		expandAll();
	}
}	
	


function setCommodityDiv() {
	var specialCommCount = $("#commodityHHGS").getGridParam(
			"reccount");
	var commDisplayText = "";
	var commDisplayText1 = "";
	//var commDisplayText = "Special Service ";
	var tariff = $("#commodityHHGS").jqGrid('getCell', 1,
	"tariff");
	var item = $("#commodityHHGS").jqGrid('getCell', 1,
	"item");
	if(tariff!=false){
		commDisplayText=tariff;
	}
	if(item!=false){
		commDisplayText1=item;
	}
	/*
	if (specialCommCount > 0) {
		for ( var i = 1; i =1; i++) {
			var tariff = $("#commodityHHGS").jqGrid('getCell', i,
					"tariff");
			
			if (i == 1) {
				if (null != tariff && tariff != undefined
						&& tariff != false) {
					commDisplayText = commDisplayText
							+ ' - ' + tariff;
				}
			} else {
				if (null != tariff && tariff != undefined
						&& tariff != false) {
					commDisplayText = commDisplayText
							+ ', ' + tariff;
				}
				
			}
			
			var item = $("#commodityHHGS").jqGrid('getCell', i,
			"item");
			if (i == 1) {
				if (null != item && item != undefined
						&& item != false) {
					commDisplayText1 = commDisplayText1
							+ ' - ' + item;
				}
			} else {
				if (null != item && item != undefined
						&& item != false) {
					commDisplayText1 = commDisplayText1
							+ ', ' + item;
				}
				
			}
			
		}
	}*/
	var variable="";
	if((commDisplayText+commDisplayText).trim().length==0){
		
	}else{
		variable = commDisplayText + " |" + commDisplayText1;
	}
	setAccordianTabDetails('shipmentCommodityHHGS', variable );
//	if($("#unitOfMeasureSourceCode").val()=="I") {
//		$('#totalWeight').val($('#totalWeight').val().substring(0,$('#totalWeight').val().indexOf(".")));
//		$('#totalCube').val($('#totalCube').val().substring(0,$('#totalCube').val().indexOf(".")));
//	}
}

/*function setspecialServiceGridDiv(){
	
	var specialCommCount = $("#specialServiceGrid").getGridParam(
	"reccount");
	var ssgDisplayText = "";
	//var commDisplayText = "Special Service ";
	if (specialCommCount > 0) {
		for ( var i = 1; i <= specialCommCount; i++) {
			var specialServiceCode = $("#specialServiceGrid").jqGrid('getCell', i,
				"specialServiceCode");
	
			if (i == 1) {
				if (null != specialServiceCode && specialServiceCode != undefined
						&& specialServiceCode != false) {
					ssgDisplayText = ssgDisplayText
						+ ' - ' + specialServiceCode;
				}
			} else {
				if (null != specialServiceCode && specialServiceCode != undefined
						&& specialServiceCode != false) {
					ssgDisplayText = ssgDisplayText
						+ ', ' + specialServiceCode;
				}
		
		}
		}
	}
	
	setAccordianTabDetails('houseHoldSplService', ssgDisplayText );
	
}*/

function setClauseDiv() {
	var specialCommCount = $("#clauseGridHHGS").getGridParam(
			"reccount");
	var clauseDisplayText = "";
	//var clauseDisplayText = "Special Service ";
	if (specialCommCount > 0) {
		for ( var i = 1; i <= specialCommCount; i++) {
			var standardClauseCode = $("#clauseGridHHGS").jqGrid('getCell', i,
					"standardClauseCode");
			
			if (i == 1) {
				if (null != standardClauseCode && standardClauseCode != undefined
						&& standardClauseCode != false) {
					clauseDisplayText = clauseDisplayText
							+ ' - ' + standardClauseCode;
				}
			} else {
				if (null != standardClauseCode && standardClauseCode != undefined
						&& standardClauseCode != false) {
					clauseDisplayText = clauseDisplayText
							+ ', ' + standardClauseCode;
				}
				
			}
				
		}
	}
	setAccordianTabDetails('shipmentClauseHHGS', clauseDisplayText );
	
}

function validateShipmentUIFields() {
	var uiFieldsValidationStatus = true;
	/*uiFieldsValidationStatus = validateShipmentNumber();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;*/   //HHGS
//D029863
	//uiFieldsValidationStatus = validateContactForShipperConsignee('shipper');
	//if (uiFieldsValidationStatus == false)
	//	return uiFieldsValidationStatus;
//D029863
	//uiFieldsValidationStatus = validateContactForShipperConsignee('consignee');
	//if (uiFieldsValidationStatus == false)
	//	return uiFieldsValidationStatus;

	/*uiFieldsValidationStatus = validatePartiesSectionOnSave(); //HHGS -start
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;

	uiFieldsValidationStatus = validateRoutingFieldsOnSave();
	if (uiFieldsValidationStatus == false)
		return uiFieldsValidationStatus;*/ //HHGS-END
	
	/*uiFieldsValidationStatus = validateOverridesFieldsOnSave();
	if (uiFieldsValidationStatus==false)
		return uiFieldsValidationStatus;*/
	if($('input[name = "shipper.contactEmailAddress"]').val()!='')
	{
		var emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i ;
		if(!emailRegEx.test($('input[name = "shipper.contactEmailAddress"]').val())) {
			$('input[name = "shipper.contactEmailAddress"]').validationEngine('showPrompt', '* Invalid email address', 'error', true);
			return false;
		} 
	}
	
	if($('input[name = "consignee.contactEmailAddress"]').val()!='')
	{
		var emailRegEx = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i ;
		if(!emailRegEx.test($('input[name = "consignee.contactEmailAddress"]').val())) {
			$('input[name = "consignee.contactEmailAddress"]').validationEngine('showPrompt', '* Invalid email address', 'error', true);
			return false;
		} 
	}
	
	return uiFieldsValidationStatus;
}

//ok in overlay click
function setShipperConsigneeDetails()
{
	$('#shipperHHGS').html($('input[name="shipper\\.organizationName"]').val());	
	$('#consigneeHHGS').html($('input[name="consignee\\.organizationName"]').val());		
	$('#rateDateHHGS').html($('#rateDate').val());		
	$('#shipperAddressHHGS').html($('input[name="shipper\\.address"]').val());		
	$('#consigneeAddressHHGS').html($('input[name="consignee\\.address"]').val());		
   // $('#tradeHHGS').html($('#tradeCodeDesc').text());    
    var shipperCityStateZipHHGS="";
	if($('input[name="shipper\\.city"]').val()!="" && $('input[name="shipper\\.city"]').val()!=null ){
		shipperCityStateZipHHGS=$('input[name="shipper\\.city"]').val();
	}
	if($('input[name="shipper\\.state"]').val()!="" && $('input[name="shipper\\.state"]').val()!=null){
		shipperCityStateZipHHGS=shipperCityStateZipHHGS+", "+$('input[name="shipper\\.state"]').val();
	}
	if($('input[name="shipper\\.zip"]').val()!="" && $('input[name="shipper\\.zip"]').val()!=null){
		shipperCityStateZipHHGS=shipperCityStateZipHHGS+" "+$('input[name="shipper\\.zip"]').val();	 
	}    
	$('#shipperCityStateZipHHGS').html(shipperCityStateZipHHGS);
	
	var consigneeCityStateZipHHGS="";
	if($('input[name="consignee\\.city"]').val()!="" && $('input[name="consignee\\.city"]').val()!=null ){
		consigneeCityStateZipHHGS=$('input[name="consignee\\.city"]').val();
	}
	if($('input[name="consignee\\.state"]').val()!="" && $('input[name="consignee\\.state"]').val()!=null){
		consigneeCityStateZipHHGS=consigneeCityStateZipHHGS+", "+$('input[name="consignee\\.state"]').val();
	}
	if($('input[name="consignee\\.zip"]').val()!="" && $('input[name="consignee\\.zip"]').val()!=null){
		consigneeCityStateZipHHGS=consigneeCityStateZipHHGS+" "+$('input[name="consignee\\.zip"]').val();	 
	}    
	$('#consigneeCityStateZipHHGS').html(consigneeCityStateZipHHGS);
	
	var vvdHHG="";
	if($('#vessel').val()!="" && $('#vessel').val()!=null){
		vvdHHG=$('#vessel').val();
	}
	if($('#voyage').val()!="" && $('#voyage').val()!=null){
		vvdHHG=vvdHHG+"  "+$('#voyage').val();
	}
	if($('#direction').val()!="" && $('#direction').val()!=null){
		vvdHHG=vvdHHG+"  "+$('#direction').val();
	}	
	$('#vvdHHGS').html(vvdHHG);
	
	$('#placeOfReceiptHHGS').html($('#blOriginCityCodeDescription').val());	
	$('#loadServiceHHGS').html($('#loadServiceCode').val());		
	$('#pickUpZipHHGS').html($('#pickupZipCode').val());		
	$('#pickUpZoneHHGS').html($('#pickupZone').val());		
	$('#portOfLoadingHHGS').html($('#originPortCityCodeDescription').val());		
	$('#discServiceHHGS').html($('#dischargeServiceCode').val());		
	$('#deliveryZipHHGS').html($('#deliveryZipCode').val());		
	$('#deliveryZoneHHGS').html($('#deliveryZone').val());		
	$('#portOdDischargeHHGS').html($('#destinationPortCityCodeDescription').val());		
	$('#measurementSourceHHGS').html($('#unitOfMeasureSourceCode').val());	
	
	//$('#shipmentTotalWgtCubeHHGS').html($('#loadServiceCode').val());	
	$('#placeOfDeliveryHHGS').html($('#blDestinationCityCodeDescription').val());
	
	var tariffItemHHGS="";
	if($('#tariffNumber').val()!="" && $('#tariffNumber').val()!=null){
		tariffItemHHGS=$('#tariffNumber').val();
	}
	if($('#shipmentItemNumber').val()!="" && $('#shipmentItemNumber').val()!=null){
		tariffItemHHGS=tariffItemHHGS+"/"+$('#shipmentItemNumber').val();
	}	
	$('#tariffItemHHGS').html(tariffItemHHGS);
	$('#frtReceivedDate').html($('#freightReceivedDate').val());
}

function populateContainerDetails(){
	 var queryString = $('#shipmentHouseHoldForm').formSerialize();
	 var tempEquipId = $('#containerListHHGS').val();
	// blockUI();
	$.ajax({
		type : "GET",
		url : _context + "/houseHoldShipment/populateContainerDetail",
		data : {
			shipmentForm :queryString,
			equipment_id:$('#containerListHHGS').val()
		},
	success : function(responseText) {
		$('#containerListHHGS').val(tempEquipId);
	//populateContainerList(responseText);
	//setShipmentCorrectionNumber(responseText); // AS PER UI SPEC
	populateEquipmentDetails(responseText);
	//$.unblockUI();
	}
	});
	
	
}
function populateEquipmentList(shipment_number){
	
	showContainerLoadingMessage();
	$('#containerListHHGS').empty(); // to clear the dropdown 
	$.ajax({
		async: false,
		type : "POST",
		url : _context + "/houseHoldShipment/populateShipment",
		data : {
			shipment_number :shipment_number
		},
	success : function(responseText) {
		
	populateContainerList(responseText);
	//setShipmentCorrectionNumber(responseText); // as per UI Spec
	populateContainerDetails(responseText);
	if($('#containerListHHGS').val()!=null && $('#containerListHHGS').val()!='null')
	showContainerLoadedMessage();
	else if($('#containerListHHGS').val()==null)
	{
		$('#msgDiv').html(
		"<div class=\"message_info\">No Container Found.</div>");
	$('#msgDiv').show();
	}

	}
	});
	
}


function setScreenDetails(isRated){
	
	//blockUI();
		$.ajax({
			
			type : "GET",
			url : _context + "/houseHoldShipment/loadShipment",
			data : {
				shipmentId :$('#shipmentNumber').val(),
				equipment_id:$('#containerListHHGS').val()
			},
		success : function(responseText) {
			
		//populateContainerList(responseText);
        $('#entityVersion').val(responseText.data.entityVersion);
		setShipmentCorrectionNumber(responseText);
		populateContainerDetails(responseText);
		setHeaderSectionData(responseText);
		
		setShipperConsigneeEditOverlayData(responseText);
		
		createHoldGrid("houseHoldShipment");
		setContainerSectionDetails(responseText);
		setShipmentSequenceNumberList();
		reloadCommodityGrid();
		reloadClauseGrid();
		reloadSpecialServiceGrid();
		setDivNames();
		reloadHoldGrid();
		if(responseText.messages.error.length == 0)
			{
			if(isRated=="false"){
				showLoadedMessage();
			}
			}else
				{
					showResponseMessages("msgDiv",responseText);
				}
		document.getElementById("commentsDIV").innerHTML='<div class="span-2" id=comment_link>'+
		'<a class="comments" href="#"></a>'+
				'<input id="commentId" name="commentId" type="hidden" value="">'+
			'<span id ="count"></span>'+
		'</div>'+
		'<div class="comments" style="display: none">'+
		'<iframe id="commentsFrame" frameborder="0" marginheight="0" marginwidth="0" src=""></iframe>'+
		'</div>';

		//Comment Id
		$('#commentId').val(responseText.data.commentId);
		var commentReadOnly=true;
		var args = {
				entityType: 'SHMT',
				entityId: $('#shipmentId').val(),
				commentId:  'commentId',
				displayCommentTypes: 'CDBTR,DISPUTE,HZRD,OPS,PCCOL,PDBTR,WEBE,WIRE,CSS,DOC,KICK,PCACTY,PCCSS,SYS,WEBS'
		};
		$("#comment_link").comments(args);

		$.unblockUI();
		disableHouseHoldShipmentIfStandardExist(responseText);
		
		createCommodityHHGSGrid();
		createSpecialServiceHHGSGrid();
		createClauseHHGSGrid();
		if ($('#measurementSourceHHGS').text()=="I" ){
		       var a=$('#totalWeight').val().indexOf(".");
					 if(a>=0) {
					  var finalValue1=$('#totalWeight').val().substring(0,a);
					  $('#totalWeight').val(finalValue1);
		                 }
			   var b=$('#totalCube').val().indexOf(".");
				     if(b>=0) {
					  var finalValue2=$('#totalCube').val().substring(0,b);
					  $('#totalCube').val(finalValue2);
		                 } 		 
		
		
		}
		
		var formattedCube  = formatNumber($('#shipmentTotalWgt').text());
		var formattedWeight = formatNumber($('#shipmentTotalCube').text());
		$('#shipmentTotalWgt').text(formattedWeight);
		$('#shipmentTotalCube').text(formattedCube);
		}
			
			
		});
	
}

function disableHouseHoldShipmentIfStandardExist(responseText)
{
	
if(responseText.data.isStandardBillExist!=null && responseText.data.isStandardBillExist=="true"){
	$('#shipmentHHGSContainerDetailDiv').gatesDisable();
	$('#shipmentBasicDetailsHHGS').gatesDisable();
	$('#shipmentHHGSCommodityDetails').gatesDisable();
	$('#shipmentHHGSClauseDetails').gatesDisable();
	$('#specialSerivceAdd').gatesDisable();
	$('#commodityHHGS').jqGrid('GridUnload');
	$('#specialServiceGrid').jqGrid('GridUnload');
	$('#clauseGridHHGS').jqGrid('GridUnload');
	readOnlyCommodityHHGSGrid = true;
	readOnlyClauses = true;
	isMaintainbillhhgdsDelete = false;
	$('#commodityHHGSAdd').attr("style","display:none");
	$('#specialSerivceAdd').attr("style","display:none");
	$('#clauseHHGSAdd').attr("style","display:none");
	$('#save').attr("disabled",true);
	$('#rate').attr("disabled",true);
	//Added Release And UndoRelease for D027261
	$('#releaseHold').css('visibility','hidden');
	$('#undoReleaseHold').css('visibility','hidden');
	showNonHouseHoldBillMessage();
	disableRateButtonWhenStdBillExist=false;
	
}else{
	$('#shipmentHHGSContainerDetailDiv').gatesEnable();
	$('#shipmentBasicDetailsHHGS').gatesEnable();
	$('#shipmentHHGSCommodityDetails').gatesEnable();
	$('#shipmentHHGSClauseDetails').gatesEnable();
	$('#specialSerivceAdd').gatesEnable();
	$('#commodityHHGS').jqGrid('GridUnload');		//23182-the grid was not able to display delete button once unloaded from above if condition
	$('#specialServiceGrid').jqGrid('GridUnload');
	$('#clauseGridHHGS').jqGrid('GridUnload');
	readOnlyCommodityHHGSGrid = false;
	isMaintainbillhhgdsDelete = true;
	$('#commodityHHGSAdd').attr("style","display:block");
	$('#specialSerivceAdd').attr("style","display:block");
	$('#clauseHHGSAdd').attr("style","display:block");
	$('#save').attr("disabled",false);
	//Added Release And UndoRelease for D027261
	$('#releaseHold').css('visibility','visible');
	$('#undoReleaseHold').css('visibility','visible');
	//$('#rate').attr("disabled",false);
	disableRateButtonWhenStdBillExist=true;
	if(responseText.data.isStatusHHGDS != null && responseText.data.isStatusHHGDS == "false"){
        $('#shipmentHHGSContainerDetailDiv').gatesDisable();
        $('#shipmentBasicDetailsHHGS').gatesDisable();
        $('#shipmentHHGSClauseDetails').gatesDisable();
        $('#specialSerivceAdd').gatesDisable();
        $('#specialServiceGrid').jqGrid('GridUnload');
        $('#clauseGridHHGS').jqGrid('GridUnload');
        isMaintainbillhhgdsDelete = false;
        readOnlyClauses = true;
        $('#commodityHHGSAdd').attr("style","display:none");
        $('#specialSerivceAdd').attr("style","display:none");
        $('#clauseHHGSAdd').attr("style","display:none");
	}
}

}
function formatNumber(number)
{
  
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

//go and edit (to open overlay)
function setShipperConsigneeEditOverlayData(responseText)
{	
	$("#basicDetails").loadJSON(responseText.data.routing);
	// clearing of Email Shipper fields
	$('#shipmentHouseHoldBasicDetailForm').clearForm();
	$("#shipper").loadJSON(responseText.data.shipper);
	loadAdditionalShipperDetails(responseText);
	
	$("#consignee").loadJSON(responseText.data.consignee);
	loadAdditionalConsigneeDetails(responseText);
	
	$("#frtReceivedDate").text(responseText.data.header.freightReceivedDate);
	$("#freightReceivedDate").val(responseText.data.header.freightReceivedDate);
	//D024831: BLHH: Frt Rcv Date looks updatable on Shipper Consignee Routing override, it should not be updatable	
	$("#freightReceivedDate").attr('disabled', true);
	$("#rateDate").val(responseText.data.header.rateDate);
	////D026991, Fix for RateDate should not allow future date.
	oldratedt=$("#rateDate").val();
	$("#tradeCode").val(responseText.data.header.tradeCode);
	$("#tradeCodeDesc").text(responseText.data.header.tradeCodeDesc);
	$("#vessel").val(responseText.data.shipmentVoyage.vesselCode);
	$("#voyage").val(responseText.data.shipmentVoyage.voyage);
	$("#direction").val(responseText.data.shipmentVoyage.directionSeq);
	$("#pickupZipCode").val(responseText.data.routing.pickupZipCode);
	$("#pickupZone").val(responseText.data.routing.pickupZone);
	$("#deliveryZipCode").val(responseText.data.routing.deliveryZipCode);
	$("#deliveryZone").val(responseText.data.routing.deliveryZone);
	$("#unitOfMeasureSourceCode").val(responseText.data.header.unitOfMeasureSourceCode);
	$("#blOriginCityCodeDescription").val(responseText.data.routing.blOriginCityCodeDescription);
    $("#originPortCityCodeDescription").val(responseText.data.routing.originPortCityCodeDescription);
    $("#destinationPortCityCodeDescription").val(responseText.data.routing.destinationPortCityCodeDescription);
    $("#blDestinationCityCodeDescription").val(responseText.data.routing.blDestinationCityCodeDescription);
    $("#loadServiceCode").val(responseText.data.routing.loadServiceCode);
    $("#dischargeServiceCode").val(responseText.data.routing.dischargeServiceCode);
    $("#tariffNumber").val(responseText.data.header.tariffNumber);
    $('#shipmentItemNumber').val(responseText.data.header.itemNumber);
    populateLoadServiceList(responseText);
    populateDischargeServiceList(responseText);
    if(responseText.data.shipper.isOneTimeCustomer==true){
    formatColorForOneTime("shipper");
    }else{
    	 changeShipperConsigneeColor("shipper","N");
    	 $('input[name="'+"shipper"+'\\.address"]').attr("disabled",false); 
    }
    
    if(responseText.data.consignee.isOneTimeCustomer==true){
        formatColorForOneTime("consignee");
        }else{
        	 changeShipperConsigneeColor("consignee","N");
        	 $('input[name="'+"consignee"+'\\.address"]').attr("disabled",false); 
        }
   
   
    //$.unblockUI();
    
	}


	function populateLoadServiceList(response){
		 $("#loadServiceCode").get(0).options.length = 0;
	   $.each(response.data.routing.loadServiceList, function(index, loadServicesList) {
	       $("#loadServiceCode").get(0).options[$("#loadServiceCode").get(0).options.length] = new Option(loadServicesList.code, loadServicesList.code);
	   });
	   $('#loadServiceCode').val(response.data.routing.loadServiceCode);
	}

	function populateDischargeServiceList(response){
		 $("#dischargeServiceCode").get(0).options.length = 0;
	   $.each(response.data.routing.dschServiceList, function(index, dschServicesList) {
	       $("#dischargeServiceCode").get(0).options[$("#dischargeServiceCode").get(0).options.length] = new Option(dschServicesList.code, dschServicesList.code);
	   });
	   $('#dischargeServiceCode').val(response.data.routing.dischargeServiceCode);
	}

function reloadSpecialServiceGrid(){
	$("#specialServiceGrid").trigger('reloadGrid');
}
function reloadCommodityGrid(){
	$("#commodityHHGS").trigger('reloadGrid');
}
function reloadClauseGrid(){
	$("#clauseGridHHGS").trigger('reloadGrid');
	
}
function reloadHoldGrid(){
	$("#holdGrid").setGridParam({'rowNum':6}); // FOR DEFECT MANUALLY SET
	$("#holdGrid").trigger('reloadGrid');
}
function setContainerSectionDetails(responseText){
	$('#prorationCode').val(responseText.data.freightForm.prorateCode);
	$('#prorationCodeOld').val(responseText.data.freightForm.prorateCodeOld);
	$('#totalWeightOld').val(responseText.data.freightForm.weightOld);
	$('#totalWeight').val(responseText.data.freightForm.weight);
	$('#totalCube').val(responseText.data.freightForm.cube);
	$('#totalCubeOld').val(responseText.data.freightForm.cubeOld);
	$('#sealNumber').val(responseText.data.freightForm.sealNumber);
	$('#sealNumberOld').val(responseText.data.freightForm.sealNumberOld);
	$('#eqpOverflow').val(responseText.data.freightForm.overflow);
	$('#eqpOverflowOld').val(responseText.data.freightForm.overflowOld);
	
	
}

//go click
function setHeaderSectionData(responseText){
	if(responseText.data.shipper.organizationName!=null){
	$('#shipperHHGS').html(responseText.data.shipper.organizationName);
	}else{
		$('#shipperHHGS').html("");
	}
	if(responseText.data.consignee.organizationName!=null){
		$('#consigneeHHGS').html(responseText.data.consignee.organizationName);
	}else{
			$('#consigneeHHGS').html("");
	}
	if(responseText.data.header.rateDate!=null){
		$('#rateDateHHGS').html(responseText.data.header.rateDate);
	}else{
			$('#rateDateHHGS').html("");
	}
	if(responseText.data.shipper.address!=null){
		$('#shipperAddressHHGS').html(responseText.data.shipper.address);
	}else{
			$('#shipperAddressHHGS').html("");
	}
	if(responseText.data.consignee.address!=null){
		$('#consigneeAddressHHGS').html(responseText.data.consignee.address);
	}else{
		$('#consigneeAddressHHGS').html("");
	}
	if(responseText.data.header.tradeCodeDesc!=null){
		$('#tradeHHGS').html(responseText.data.header.tradeCodeDesc);
	}else{
		$('#tradeHHGS').html("");
	}
	
	var shipperCityStateZipHHGS="";
	if(responseText.data.shipper.city!=null && responseText.data.shipper.city!=""){
		shipperCityStateZipHHGS=responseText.data.shipper.city;
	}
	if(responseText.data.shipper.state!=null && responseText.data.shipper.state!=""){
		shipperCityStateZipHHGS=shipperCityStateZipHHGS+", "+responseText.data.shipper.state;
	}
	if(responseText.data.shipper.zip!=null && responseText.data.shipper.zip!=""){
		shipperCityStateZipHHGS=shipperCityStateZipHHGS+" "+responseText.data.shipper.zip;
	
	}

	$('#shipperCityStateZipHHGS').html(shipperCityStateZipHHGS);
	var consigneeCityStateZipHHGS="";
	if(responseText.data.consignee.city!=null && responseText.data.consignee.city!=""){
		consigneeCityStateZipHHGS=responseText.data.consignee.city;
	}
	if(responseText.data.consignee.state!=null && responseText.data.consignee.state!=""){
		consigneeCityStateZipHHGS=consigneeCityStateZipHHGS+", "+responseText.data.consignee.state;
	}
	if(responseText.data.consignee.zip!=null && responseText.data.consignee.zip!=""){
		consigneeCityStateZipHHGS=consigneeCityStateZipHHGS+" "+responseText.data.consignee.zip;
	
	}
	$('#consigneeCityStateZipHHGS').html(consigneeCityStateZipHHGS);
	
	var vvdHHG="";
	if(responseText.data.shipmentVoyage.vesselCode!=null){
		vvdHHG=responseText.data.shipmentVoyage.vesselCode;
	}
	if(responseText.data.shipmentVoyage.voyage!=null){
		vvdHHG=vvdHHG+"  "+responseText.data.shipmentVoyage.voyage;
	}
	if(responseText.data.shipmentVoyage.directionSeq!=null){
		vvdHHG=vvdHHG+"  "+responseText.data.shipmentVoyage.directionSeq;
	}
	$('#vvdHHGS').html(vvdHHG);
	
	if(responseText.data.routing.blOriginCityCodeDescription!=null){
		$('#placeOfReceiptHHGS').html(responseText.data.routing.blOriginCityCodeDescription);
	}else{
		$('#placeOfReceiptHHGS').html("");
	}
	if(responseText.data.routing.loadServiceCode!=null){
		$('#loadServiceHHGS').html(responseText.data.routing.loadServiceCode);
	}else{
		$('#loadServiceHHGS').html("");
	}
	
	if(responseText.data.routing.pickupZipCode!=null){
		$('#pickUpZipHHGS').html(responseText.data.routing.pickupZipCode);
	}else{
		$('#pickUpZipHHGS').html("");
	}
	
	if(responseText.data.routing.pickupZone!=null){
		$('#pickUpZoneHHGS').html(responseText.data.routing.pickupZone);
	}else{
		$('#pickUpZoneHHGS').html("");
	}
	
	if(responseText.data.routing.originPortCityCodeDescription!=null){
		$('#portOfLoadingHHGS').html(responseText.data.routing.originPortCityCodeDescription);
	}else{
		$('#portOfLoadingHHGS').html("");
	}
	
	if(responseText.data.routing.dischargeServiceCode!=null){
		$('#discServiceHHGS').html(responseText.data.routing.dischargeServiceCode);
	}else{
		$('#discServiceHHGS').html("");
	}
	if(responseText.data.routing.deliveryZipCode!=null){
		$('#deliveryZipHHGS').html(responseText.data.routing.deliveryZipCode);
	}else{
		$('#deliveryZipHHGS').html("");
	}
	if(responseText.data.routing.deliveryZone!=null){
		$('#deliveryZoneHHGS').html(responseText.data.routing.deliveryZone);
	}else{
		$('#deliveryZoneHHGS').html("");
	}
	
	if(responseText.data.routing.destinationPortCityCodeDescription!=null){
		$('#portOdDischargeHHGS').html(responseText.data.routing.destinationPortCityCodeDescription);
	}else{
		$('#portOdDischargeHHGS').html("");
	}
	
	if(responseText.data.header.unitOfMeasureSourceCode!=null){
		$('#measurementSourceHHGS').html(responseText.data.header.unitOfMeasureSourceCode);
	}else{
		$('#measurementSourceHHGS').html("");
	}
	
	
	if(responseText.data.header.totalWeight!=null){
		$('#shipmentTotalWgt').html(responseText.data.header.totalWeight);
	}else{
		$('#shipmentTotalWgt').html("");
	}
	if(responseText.data.header.totalCube!=null){
		$('#shipmentTotalCube').html(responseText.data.header.totalCube);
	}else{
		$('#shipmentTotalCube').html("");
	}
		
	
	if(responseText.data.header.totalWeight=="" || responseText.data.header.totalWeight==null)
	{
		$('#shmtTotalWgt').hide();
	}
	else
	{
		$('#shmtTotalWgt').show();
	}
	
	if(responseText.data.header.totalCube=="" || responseText.data.header.totalCube==null)
	{
		$('#shmtTotalCube').hide();
	}
	else
	{
		$('#shmtTotalCube').show();
	}
	
	if(responseText.data.routing.blDestinationCityCodeDescription!=null){
		$('#placeOfDeliveryHHGS').html(responseText.data.routing.blDestinationCityCodeDescription);
	}else{
		$('#placeOfDeliveryHHGS').html("");
	}
	
	var tariffItemHHGS="";
	if(responseText.data.header.tariffNumber!=null){
		tariffItemHHGS=responseText.data.header.tariffNumber;
	}
	if(responseText.data.header.itemNumber!=null){
		tariffItemHHGS=tariffItemHHGS+"/"+responseText.data.header.itemNumber;
	}
	$('#tariffItemHHGS').html(tariffItemHHGS);	
	//setShmtTotalWeightCube(responseText);
	if ($('#measurementSourceHHGS').text()=="I" ){
	       var a=$('#shipmentTotalWgt').text().indexOf(".");
				 if(a>=0) {
				  var finalValue1=$('#shipmentTotalWgt').text().substring(0,a);
				  $('#shipmentTotalWgt').text(finalValue1);
	                 }
		   var b=$('#shipmentTotalCube').text().indexOf(".");
			     if(b>=0) {
				  var finalValue2=$('#shipmentTotalCube').text().substring(0,b);
				  $('#shipmentTotalCube').text(finalValue2);
	                 } 		 
	
	
	}
	
	var formattedCube  = formatNumber($('#shipmentTotalWgt').text());
	var formattedWeight = formatNumber($('#shipmentTotalCube').text());
	$('#shipmentTotalWgt').text(formattedWeight);
	$('#shipmentTotalCube').text(formattedCube);
}
function setShmtTotalWeightCube(responseText){
	
	if(responseText.data.header.unitOfMeasureSourceCode!=null && responseText.data.header.unitOfMeasureSourceCode=="I"){
		$('#shmtTotalWgtCube').text("Shmt Total Wgt(Lbs)/Cube(ft)");
	}
	else{
		$('#shmtTotalWgtCube').text("Shmt Total Wgt(Kgs)/Cube(M)");
	}
		
}
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function populateContainerList(responseText){
	
	var equipmentId = getUrlVars()["equipmentId"];
	var index = 0;
	equipmentSelected = false;;
	$("#containerListHHGS").editableDropdown("selectOption",{value:"",text:""});
	  $("#containerListHHGS").get(0).options.length = 0;
	  $.each(responseText.data.containerList, function(index, containerList) {
            $("#containerListHHGS").get(0).options[$("#containerListHHGS").get(0).options.length] = new Option(containerList.description, containerList.code);
            if(equipmentId !="" && equipmentId!=undefined && setContainerTroughPredictive!=false)
      	  {		  
      		  if(responseText.data.containerList.length>0 && equipmentId == responseText.data.containerList[index].code){		
      			
      			  $("#containerListHHGS").editableDropdown("selectOption", {value: responseText.data.containerList[index].code, text: responseText.data.containerList[index].description});
      			  equipmentSelected = true;
      			setContainerTroughPredictive = true;
      		  }
      		  else index++;
      	  }
        });
	  
	  if(equipmentSelected==false) 
	 {
			  	if(responseText.data.containerList.length>0){	
		
		  $("#containerListHHGS").editableDropdown("selectOption", {value: responseText.data.containerList[0].code, text: responseText.data.containerList[0].description});
		  setContainerTroughPredictive = true;
	  
			  	}
	 }
}

function setShipmentCorrectionNumber(responseText){
	$('#shipmentCorrectionNumberLabel').text('000');
}

function populateEquipmentDetails(responseText){
	if(responseText.data.freightForm.eqptType!=null){
	$('#eqpTypeHHGS').text(responseText.data.freightForm.eqptType);
	}else{
		$('#eqpTypeHHGS').text("");
	}
	if(responseText.data.freightForm.eqptLength!=null){
	$('#eqpSizeHHGS').text(responseText.data.freightForm.eqptLength);
	}
	else{
		$('#eqpSizeHHGS').text("");
	}
	if(responseText.data.freightForm.eqptHeight!=null){
		$('#eqpHeightHHGS').text(responseText.data.freightForm.eqptHeight);
	}
	else{
		$('#eqpHeightHHGS').text("");
	}
}

function clearHeaderSectionData()
{
	$('#shipmentCorrectionNumberLabel').text('');
	$('#eqpTypeHHGS').text('');
	$('#eqpSizeHHGS').text('');
	$('#eqpHeightHHGS').text('');	
	$('#containerListHHGS').empty();
}

function showContainerLoadingMessage() {
	
	$('#msgDiv').html(
			"<div class=\"message_info\">Loading containers... </div>");
	$('#msgDiv').show();
}

function showLoadingMessage() {
	
	$('#msgDiv').html(
			"<div class=\"message_info\">Loading shipment... </div>");
	$('#msgDiv').show();
}

function showLoadedMessage() {
	$('#msgDiv').html(
	"<div class=\"message_info\">Successfully Loaded </div>");
$('#msgDiv').show();
}

function showNonHouseHoldBillMessage() {
	$('#msgDiv').html(
	"<div class=\"message_info\">Bills can’t be updated on this page, use maintain bill page. </div>");
$('#msgDiv').show();
}

function showContainerLoadedMessage() {
	$('#msgDiv').html(
	"<div class=\"message_info\">Container Details Loaded Successfully.</div>");
	$('#msgDiv').show();
	if($('#containerListHHGS option').length==1){
		$($('.ui-menu-item').parent()).attr("style","z-index: 1; top: 220.0333251953125px; left: 252px; display: none; width: 84px;");
		blockUI();
		showLoadingMessage();	
		var isRated="false";
		setScreenDetails(isRated);
		commodityHHGSLoadComplete();
	}
}

function validateEstShipDate() {	
	var date = $('#estimatedShipDate').val();
	var dateSize = date.length;
	var newDate = date;
	var dt1 ;
	var mon1;
	var year1;
	
	if(dateSize == 6){
		dt1  = date.substring(2,4); 
		mon1 = date.substring(0,2);
		year1 = date.substring(4,6);
		newDate=mon1+"-"+dt1+"-20"+year1;
	} else if(dateSize == 8){
		if(date.indexOf("/")){
			dt1  = date.substring(3,5); 
			mon1 = date.substring(0,2);
			year1 = date.substring(6,8);	
			newDate=mon1+"-"+dt1+"-"+year1;
		}else{
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;	
		}
	}
	var valid = false;	
	if(isValidDate(newDate))
	{
		valid = true;
	}    
	
    if(!valid) {
		$('#estimatedShipDate').val("");
		return 'Shipment Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
	}			
    setRoutingHeader();
}

function validateDate() {	
//D026991, Fix for RateDate should not allow future date.
	var oldRateDate ="";
	oldRateDate=oldratedt;
 	//D026991
 	var currentDate= new Date();
 	//oldRateDate = $('#rateDate').val();
 	 //$('#rateDate').mouseover(function(){
 	//	oldRateDate = $('#rateDate').val();
 	 //});
	var date = $('#rateDate').val();
	var dateSize = date.length;
	var newDate = date;
	var dt1 ;
	var mon1;
	var year1;
	
	if(dateSize == 6){
		dt1  = date.substring(2,4); 
		mon1 = date.substring(0,2);
		year1 = date.substring(4,6);
		newDate=mon1+"-"+dt1+"-20"+year1;
	} else if(dateSize == 8){
		if(date.indexOf("/")!=(-1)){
			dt1  = date.substring(3,5); 
			mon1 = date.substring(0,2);
			year1 = date.substring(6,8);	
			newDate=mon1+"-"+dt1+"-"+year1;
		}else{
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;	
		}
	}
	var valid = false;	
	var newRateDate=$('#rateDate').val();
	if(isValidDate(newDate))
	{
		valid = true;
		//D026991, Fix for RateDate should not allow future date.
		if(Date.parse(newDate) > currentDate){
			alert('Rate cannot be after todays date');
			$('#rateDate').val(oldRateDate);
			ratedatesearch=$('#rateDate').val();
		}
	}    
	
    if(!valid) {
		$('#rateDate').val("");
		return 'Shipment Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)';
	}			
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
	var len1 = date.length;
	if (matches == null) {
		if(len1<'8' || len1>'10') {
			return false;
		}
		if(len1=='8') {
			var dt1  = "";
			var mon1 = "";
			var yr1  = "";
			
			if(date.indexOf("/") || date.indexOf("-")){
				dt1  = date.substring(3,5);
			    mon1 = date.substring(0,2);
			    yr1  = date.substring(6,8);
			}else{
				dt1  = date.substring(2,4);
			    mon1 = date.substring(0,2);
			    yr1  = date.substring(4,8);
			}
			
		    var mn = mon1-1;
		    
			var composedDate = new Date(yr1, mn,dt1 );
			validDate = composedDate.getDate() == dt1 && 
				composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
			if(validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
				$('#rateDate').val(newDate);
				return newDate;
			} else {
				return null;
			}
		}
	} else {
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		validDate=composedDate.getDate() == d && 
			composedDate.getMonth() == m && composedDate.getFullYear() == y;
		if(validDate) {
			var newDate = matches[1] + "-" + d + "-" + y;
			$('#rateDate').val(newDate);
			return newDate;
		} else {
			return null;
		}
	}
}
function trimShipperEmailSpace(){
	if($('input[name="shipper.contactEmailAddress"]').val()!=""){
		$('input[name="shipper.contactEmailAddress"]').val($('input[name="shipper.contactEmailAddress"]').val().trim());
	}
}

function trimConsigneeEmailSpace(){
	if($('input[name="consignee.contactEmailAddress"]').val()!=""){
		$('input[name="consignee.contactEmailAddress"]').val($('input[name="consignee.contactEmailAddress"]').val().trim());
	}
}

function setRoutingLoadDischargeDetails()
{
	if($('#loadServiceCode').val()!='' && $('#dischargeServiceCode').val()!='')
	{
		$.ajax({
			async: false,
			type : "GET",
			url: _context +"/shipment/routing/getLoadDschPair",
			data:{
				loadServiceCode:$('#loadServiceCode').val(),
				dischargeServiceCode:$('#dischargeServiceCode').val()
			},
			success: function(responseText)
			{
				if(isRoutingModifiable && responseText.data.isRequireBlOrigin!='N')
					{	
						$('#blOriginCityCodeDescription').attr('disabled', false);
						$('#plcofReceiptLabel').text("*");
						$('#blOriginCityCodeDescription').addClass("validate[required]");
					}
				else if($('#blOriginCityCode').val()=='' && responseText.data.isRequireBlOrigin=='N')
					{
						$('#blOriginCityCodeDescription').attr('disabled', true);
						$('#blOriginCityCodeDescription').removeClass("validate[required]");
						$('#plcofReceiptLabel').text('');
					}
				if(isRoutingModifiable && responseText.data.isRequireBlDestination!='N')
					{
						$('#blDestinationCityCodeDescription').attr('disabled', false);
						$('#plcofDeliveryLabel').text("*");
						$('#blDestinationCityCodeDescription').addClass("validate[required]");
					}
				
				else if($('#blDestinationCityCode').val()=='' && responseText.data.isRequireBlDestination=='N')
					{
						$('#blDestinationCityCodeDescription').attr('disabled', true);
						$('#blDestinationCityCodeDescription').removeClass("validate[required]");
						$('#plcofDeliveryLabel').text('');
					}
				if(isRoutingModifiable && responseText.data.isRequirePickupZipCode!='N')
					$('#pickupZipCode').attr('disabled', false);
				else if($('#pickupZipCode').val()=='' && responseText.data.isRequirePickupZipCode=='N')
					$('#pickupZipCode').attr('disabled', true);
				
				if(isRoutingModifiable && responseText.data.isRequireDeliveryZipCode!='N')
					$('#deliveryZipCode').attr('disabled', false);
				else if($('#deliveryZipCode').val()=='' && responseText.data.isRequireDeliveryZipCode=='N')
					$('#deliveryZipCode').attr('disabled', true);
			}
		});
	}
	else
	{
		if(isRoutingModifiable)
		{
			$('#blOriginCityCodeDescription').attr('disabled', false);
			$('#blDestinationCityCodeDescription').attr('disabled', false);
			$('#pickupZipCode').attr('disabled', false);
			$('#deliveryZipCode').attr('disabled', false);
		}
	}
	//checkPickupCarrier();
	//checkDeliveryCarrier();
}
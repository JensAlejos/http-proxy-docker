 $(function() {

		 $('#mixCommItem').click(function(){
			 $(this).select();
		 });
		 
	 	$('#mixCommItem').change(function(){
	 		var found = false;
	 		$('#mixCommCommDesc').val("");
	 		$('#mixCommNote').val('');
	 		if(window.itemList != null) {
	 			for (var i=0; i<window.itemList.length ; i++) {
	 				var item = window.itemList[i];
	 				$(this).val($(this).val().toUpperCase());
	 				if(item.name.trim() == $(this).val().trim()) {
	 					found = true;
	 					$(this).val(item.name);
	 					var tariffNo=$('#tariffNumber').val();
	 					var itemNo=$('#mixCommItem').val();	 					
	 					fetchCommodityCodeList(tariffNo, itemNo,null,true,null);
	 					$('#mixCommCommDesc').val(item.description);
	 					break;
	 				}
	 			}	
 			}
	 		
	 		if(found)  
	 		{
	 			$(this).removeClass("itemError");
	 			$('#mixCommCommDesc').attr('disabled', true);
	 			
	 		} else  
	 		{ 
	 			$(this).addClass("itemError");
	 			$('#mixCommCommDesc').attr('disabled', false);
	 		}
	 		
	 	}); 
	 	
	 	
	 	
	 	/*Permission Shipment Security*/
		if(isCommodityBLMXAdd){
			$('#commodityAddDiv').css('visibility', 'visible');
		}else{
			$('#commodityAddDiv').css('visibility', 'hidden');	
		}
		
		if(isCommodityBLMXUpdate){
			$('#updateEquipment').css('visibility', 'visible');
		}else{
			$('#updateEquipment').css('visibility', 'hidden');	
		}
		if(isCommodityBLMXDisplayOnly){
			 $('#mixedCommodityView').attr('disabled', false);
		}else{
			$('#mixedCommodityView').attr('disabled', true);
		}
 });
 
	function resetTariffDetailsForMixedCommodity(itemId){
		$('#mixCommCommDesc').val('');
		
		$('#mixCommNote').val('');
		setTariffCommodityDecriptionForMixedCommodity(itemId);
	}
	
	function setTariffCommodityDecriptionForMixedCommodity(itemId){
		
		if(itemId!=null ||itemId !=""){
			 var mixCommItemId = "mixCommItemId="+itemId;
			 $.ajax({
				 type:"GET",
				 url:_context+"/shipmentCommodity/setTariffCommodityDecriptionMixedComm",
				 data :mixCommItemId,
			 success:function(responseText){
					 if(responseText.success=true){
						 
						 $('#mixCommCommDesc').val(responseText.data);
						 }
					 }
				 
		});
		
	}
	}
	
	function notePopupSearchMixComm() {
		var tariffNo = $("#tariffNumber").val();
		var itemNo = $("#mixCommItem").val();
		
		
		var estShipDate = "";
		if($('#rateDate').val()!=null && $('#rateDate').val()!="null" && $('#rateDate').val()!=""){
			estShipDate = $('#rateDate').val();
		}
		var trade = $("#tradeCode").val();
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc = $("#dischargeServiceCode").val();
		var originPortCityCode = $('#originPortCityCode').val();
		var destinationPortCityCode = $('#destinationPortCityCode').val();
		var eqType = "";
		var eqLength= "";
		var eqHeight= "";
		noteLookUp ="MIXCOMM";
		var origin = $('#blOriginCityCode').val();
		var destination = $('#blDestinationCityCode').val();
		var actionUrl = _context+'/cas/searchNoteNoLookup.do?filterValue1=' + tariffNo + '|' + itemNo + '|' + estShipDate + '|' + eqType + 
			'|' + eqLength + '|' + eqHeight + '|' + origin + '|' + destination +
			'|' + originPortCityCode + '|' + destinationPortCityCode + '|' + loadSrvc + '|' + dischargeSrvc + '|' + trade ;
			
			
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'NoteSearch', windowStyle);
	
	}

	
	function getPrimaryCommodityForMixedComm(tariffNo, itemNo){
		var blOriginCityCode = $('#blOriginCityCode').val();
		var blDestinationCityCode = $('#blDestinationCityCode').val();
		var originPortCityCode = $('#originPortCityCode').val();
		var destinationPortCityCode = $('#destinationPortCityCode').val();
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc = $("#dischargeServiceCode").val();
		var trade = $('#tradeCode').val();
		var estShipDate = "";
		/*if($('#rateDate').val()!="" && $('#rateDate').val()!=null && $('#rateDate').val()!="null"){
			estShipDate = $('#rateDate').val();
		}else if($('#freightReceivedDate').val()!="" && $('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null"){
			estShipDate = $('#freightReceivedDate').val();
		}*/
		/*if($('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null" && $('#freightReceivedDate').val()!=""){
			estShipDate = $('#freightReceivedDate').val();
		}*/
		if($('#rateDate').val()!=null && $('#rateDate').val()!="null" && $('#rateDate').val()!=""){
			estShipDate = $('#rateDate').val();
		}
		
		var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
		+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
		+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
		
	
		
		$.ajax({
			url: urlComm,
			type: "POST",
			success: function(responseText){
				//alert("commodityNotFound: " + responseText[0].commodityNotFound);
				if(responseText!=null){
					if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
						$('#msgDivCommodityOverlay').html('');
						$('#msgDivCommodityOverlay').hide();
						$("#mixCommCommDesc").val(responseText[0].desc);
						/*$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);*/
						/*$("#frtGrpId").val(responseText[0].grpid);
						$("#frtItemId").val(responseText[0].itemid);*/
						//$("#commodityDescription").val(responseText[0].desc);
	if(responseText[0].descid!=null && responseText[0].descid!=''){
							
							$.ajax({
								url: _context+'/booking/freight/getCommodityCodes',
								async:false,
								data: {commodityDescId:responseText[0].descid,
									frtItemId:responseText[0].itemid},
								success: function(responseText){
									if(responseText.success){
										populateMixCommodityCodeList(responseText.data);
									}
								}
							});
						}
						
						if ($.trim(responseText[0].noterate)!=null && $.trim(responseText[0].noterate)!='') {
							
							$('#mixCommNote').val("");
							
						} else {
							
						}
						
						//alert("tariffItemCmdtyDescId: "+ responseText[0].descid);
						/*if(responseText[0].descid!=null && responseText[0].descid!=''){
							//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
							$.ajax({
								url: _context+'/booking/freight/getCommodityCodes',
								data: {commodityDescId:responseText[0].descid},
								success: function(responseText){
									if(responseText.success){
										populateCommodityCodeList(responseText.data);
									}
								}
							});
						}*/
					/*	setMandatoryTariffCmdDesc();
						$("#primaryFreightPresent").val("Y");*/
					}
					else{
						$('#msgDivCommodityOverlay').show();
						// displaying more specific error message if available as per D025670
						if (responseText[0].commodityNotFound =="Y"){
							$('#msgDivCommodity').html('<div class="message_error">Commodity Code/Description not found for Tariff Item.</div>');		
						}else
						if(responseText[0].errmsg)
							$('#msgDivCommodity').html('<div class="message_error">'+responseText[0].errmsg+'</div>');
						else
							$('#msgDivCommodity').html('<div class="message_error">Invalid combination of data to satisfy the Tariffs edit condition.</div>');
						
						resetMandatoryTariffCmdDescMixedComm();
						setMandatoryTariffItemMixedComm();
						
						/*$("#primaryFreightPresent").val("N");*/
					/*	clearCommodityCodeList();*/
					}
				}
			}
		});
	}
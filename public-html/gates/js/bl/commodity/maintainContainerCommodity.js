 var somethingChanged =false;
 var somethingChangedMixComm = false;
 var dataName =  null;
 var grpId = null;
 var itemId = null;
 var origWt=null;
 var origVol=null;
 var tempImperialCubeValue=0;
var tempImperialWeightValue=0;
var tempMetricCubeValue=0;
var tempMetricWeightValue=0;
var changeCountForCube=0;
var changeCountForWeight=0;
var shipmentLoadDschPair = "";
var isNoteValid=false;
//	D025042
var isAddNew=false;
var commoditySequenceNumber="";

 $(function() {
	 
	 if($('#tariffNumber').val()=="" || $('#tariffNumber').val()==null){
		 $('#itemNumber').attr("readOnly",true);
	 }
	 $('#tariffCheck').val($("#tariffNumber").val());
	 
	 /*This section is used to check if there is some change in form */
	 var tabbable = 'input[type="text"]:not(:disabled):not(:hidden):not([readonly="readonly"]),'+
		            'input[type="button"]:not(:disabled),'+
		            'input[type="password"]:not(:disabled),input[type="radio"]:not(:disabled),'+
		            'input[type="submit"]:not(:disabled),input[type="file"]:not(:disabled),'+
		            'input[type="reset"]:not(:disabled),input[type="image"]:not(:disabled),'+
		            'img,a,button:not(:disabled),textarea:not(:disabled)';
	 $(tabbable,'#maintain_commodity_shipment').change(function(){ 
		
			 somethingChanged =true; });
	 $(tabbable,'#blmx').change(function(){somethingChangedMixComm = true;});
	 
	 $('#netWeight').change(function(){
		 
		  somethingChanged = true;
	 });
	 $('#cube').change(function(){
		 	
		 //D025036
		 	var iLen = resolveSpaces("shipmentItemImperialLengthFeet") + resolveSpaces("shipmentItemImperialLengthInches");
		 	var iBre = resolveSpaces("shipmentItemImperialBreathFeet") + resolveSpaces("imperialBreathInches");
		 	var iHei = resolveSpaces("shipmentItemImperialHeightFeet") + resolveSpaces("shipmentItemImperialHeightInches");
			/*var iBre = parseInt( $.trim($('#shipmentItemImperialBreathFeet').val()))+parseInt( $.trim($('#imperialBreathInches').val())); 
			var iHei = parseInt( $.trim($('#shipmentItemImperialHeightFeet').val()))+parseInt( $.trim($('#shipmentItemImperialHeightInches').val()));*/
			if((iLen == 0 || iBre == 0 || iHei == 0)&&(iLen != 0 || iBre != 0 || iHei != 0)){
				alert("Please enter valid L B H for cube");
			}
			var metLen = resolveSpaces("shipmentItemMetricLength");
			var metBre = resolveSpaces("shipmentItemMetricBreadth");
			var metHei = resolveSpaces("shipmentItemMetricHeight");
			/*var metLen = $('#shipmentItemMetricLength').val();
			var metBre = $('#shipmentItemMetricBreadth').val();
			var metHei = $('#shipmentItemMetricHeight').val();*/
			if((metLen == 0 || metBre == 0 || metHei == 0)&&(metLen != 0 || metBre != 0 || metHei != 0)){
				alert("Please enter valid L B H for cube");
			}		 
		//D025404
		if($.trim($('#cube').val()) == "" ){
			if((iLen != 0 && iBre != 0 && iHei != null) || (metLen != 0 && metBre != 0 && metHei != 0) )
			recalculateCube();
		}
		somethingChanged = true;
	 });
	 $('#note').change(function(){
		
		  somethingChanged = true;
		  
		  $(this).val($(this).val().toUpperCase());
	 });
	 
	 $('#note').focusout(function(){
			//D030985: 	PROD Error Message 
			$(this).val($(this).val().toUpperCase());
		});
	 
	 $('#piece').change(function(){
		 //D026553
		 if($('#loadDschServiceGroupCode').val()=="CON" || $('#loadDschServiceGroupCode').val()=="LCL"){
			 recalculateCube();
			}
		  somethingChanged = true;
	 });
	 $('#commodityDesc').change(function(){
		
		  somethingChanged = true;
	 });
	 
	// D033656: 	Can't update Customer Commodity Description in [Maintain Bill] page
	// Seems like somethingChanged not being updated by pasting into customer commodity	 
	// the table change above always firing for me so seems redudant but will not hurt. 
	 
	 $("#containerCommodityDesc").change(function() {
		 somethingChanged = true;
		});
	 
	 $("#containerCommodityDesc").bind("paste",function() {
		 somethingChanged = true;
		});
	 
	 
	 $('#itemNumber').change(function(){
		
		
		 somethingChanged = true;
		 $('#note').val("");
		 $('#shipmentCommodityCode').val();
		 $('#commodityDesc').val("");	//for 22742
		 //if(itemId==null || itemId==""){				
		     	$("#itemNumber").val("");       	
		 /*	  }		
				else{
					$("#itemNumber").val(dataName); 
					itemId="";
				}*/
	 });
	 $('#shipmentItemImperialLengthFeet').change(function(){ recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemImperialLengthInches').change(function(){recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemImperialBreathFeet').change(function(){recalculateCube(); somethingChanged = true;});
	 $('#imperialBreathInches').change(function(){ recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemImperialHeightFeet').change(function(){recalculateCube();  somethingChanged = true;});
	 $('#shipmentItemImperialHeightInches').change(function(){ recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemMetricLength').change(function(){ recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemMetricBreadth').change(function(){ recalculateCube(); somethingChanged = true;});
	 $('#shipmentItemMetricHeight').change(function(){ recalculateCube(); somethingChanged = true;});
	 
	 $('#mixCommItem').change(function(){ somethingChangedMixComm = true;});
	 $('#mixCommPieces').change(function(){ somethingChangedMixComm = true;});
	 $('#mixCommNetWgt').change(function(){ somethingChangedMixComm = true;});
	 $('#mixCommCube').change(function(){ somethingChangedMixComm = true;});
	 $('#mixCommNote').change(function(){ somethingChangedMixComm = true;});
	 $('#mixCommCommDesc').change(function(){ somethingChangedMixComm = true;});
	
	 /* D025028 */
	 $('#sealNumber').change(function(){
			
		 somethingChanged = true;
		 somethingChangedMixComm = true;
	 });
	 $('#eqpOverflow').change(function(){
			
		 somethingChanged = true;
		 somethingChangedMixComm = true;
	 });
	 
	 $('#mixCommNote').focusout(function(){
		//D030985: 	PROD Error Message  
			$(this).val($(this).val().toUpperCase());
		});
	 
	 
	 
/**/
	 var checkClearButton = true;
	
	
	 var presentCommodityLine ='';
	 $('#unitOfCommodity').click(function(){
		 presentCommodityLine = $('#unitOfCommodity').val();
	 });
	 $('#unitOfCommodity').change(function(){
		
		 if(somethingChanged == true){
			 var con= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
		
		if(con== true ){
		commodityCallOnUnitChange();
		}else{
			$('#unitOfCommodity').val(presentCommodityLine);
		}
		 }
		 else{
			 commodityCallOnUnitChange();
		 }
	 });
	 $('#nextCommodity').click(function(){
		
		 if(somethingChanged == true ){
			  somethingChanged == false;
		  var con= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
		
		 if(con== true ){
			/* if($("#validateShipmentCommodityDiv").validationEngine('validate')){
				 if($("#shipmentCommodityHeader").validationEngine('validate')){
					 updateCommodityBeforeSave();
				 };
			 };*/
		commodityCallOnNext();
		 }
		 }
		 else{
			 /*if($("#validateShipmentCommodityDiv").validationEngine('validate')){
				 if($("#shipmentCommodityHeader").validationEngine('validate')){
					 updateCommodityBeforeSave();
				 };
			 };*/
			 commodityCallOnNext();
		 }
	 });
	 $('#previousCommodity').click(function(){
		
		 if(somethingChanged == true){
			  somethingChanged == false;
			 var con= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
				
			 if(con== true ){
				/* if($("#validateShipmentCommodityDiv").validationEngine('validate')){
					 if($("#shipmentCommodityHeader").validationEngine('validate')){
						 updateCommodityBeforeSave();
					 };
				 };*/
		commodityCallOnPrev();
		 
		 }
		 }
		 else{
			 /*if($("#validateShipmentCommodityDiv").validationEngine('validate')){
				 if($("#shipmentCommodityHeader").validationEngine('validate')){
					 updateCommodityBeforeSave();
				 };
			 };*/
			 commodityCallOnPrev();
		 }
	 
	 
	 });
	 
	 $('#updateCommodity').click(function(){
		var isValid = true;
		isValid = validateTariffCode(isValid);
		 if($("#validateShipmentCommodityDiv").validationEngine('validate') && isValid){
			 if($("#shipmentCommodityHeader").validationEngine('validate')){
		// var  buttonAction = validateButtonAction("update");
				 blockUI();
				 // D026052, merge update and validate
				noteValidationAndUpdateCommodity();
			 }
		 }
	 });
	 

	 
	 
	 $('#clearCommodity').click(function(){
		 
		 clearCommoditySection(checkClearButton);
		 checkClearButton = false;
		 
	 });
	 
	 $('#addCommodity').click(function(){
		 
		 var commodityLine = $('#commodityLine').text();
			if(Number(commodityLine)==0){
				if($('#netWeight').val()=="" || $('#netWeight').val()==null){
					$('input[name="shipmentItemForm.netWeight"]').validationEngine('showPrompt', '* This field is required', 'error', true);
					   return false;
				}
				if($('#commodityDesc').val()=="" || $('#commodityDesc').val()==null){
					$('input[name="shipmentItemForm.commodityDesc"]').validationEngine('showPrompt', '* This field is required', 'error', true);
					   return false;
				}
			}
			
			 commodityCallOnAdd(); 
	 }); 
	 $('#deleteCommodity').click(function(){
		 var condelete= confirm('Please confirm request to delete this commodity.');
		 if(condelete==true){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/deleteCommodity",
			 data :queryString,
			success: function(responseText){
				if(responseText.success==true){
				reloadShipmentCommodityData(responseText);
				alert("Successfully DELETED");
				$("#commodityGrid").trigger('reloadGrid');
				$("#povGrid").trigger('reloadGrid');
				 $("#convGrid").trigger('reloadGrid');
				 $("#specialServiceGrid").trigger('reloadGrid');
				checkClearButton = true;
				saveBillBeforeBillButton = true;
				// Needed to get the selected id correct, reload is running to soon I think.
				setFreightAccordianTabDetails(responseText.data.shipmentItemForm.commodityLine, responseText.data.header.tariffNumber, responseText.data.shipmentItemForm.itemNumber, responseText.data.shipmentItemForm.customerCommodityDescription, responseText.data.shipmentItemForm.commodityDesc);
				
				
			}
				else{
					showResponseMessages("msgDivCommodity", responseText);
					}
				}
		 }); 
		 }
		
	 });
	 
	 
	 
	 $('#commodityDesc').change(function(){
		$('#itemNumber').val(""); 
		$('#shipmentCommodityCode').val($('#commodityCode').val()); 
		 $('#note').val("");
		 //D024736: Fields are not mandatory when tariffNumber and itemNumber are not added yet
		 if($('#tariffNumber').val() ==""){
				$(this).removeClass("validate[required]");
				$(this).removeClass("validate[funcCall[validateTrfCmdDesc]]");	   
		 }
	 });
	 $('#mixCommCommDesc').change(function(){
		 	$('#mixCommItem').val(""); 
			$('#mixCommodityCommodityCode').val($('#mixCommCommodityCode').val());
			$('#mixCommNote').val("");
			////console.log("mixCommCommDesc change function called");
		 });
	 
	 $('#commodityCode').change(function(){
		    // D026052: somethingchanged not firing for commodity
		    somethingChanged = true;
			$('#shipmentCommodityCode').val($('#commodityCode').val()); 
			//console.log("After commodity code change, shipmentCommodityCode value:"+$('#shipmentCommodityCode').val());
		 });
	 //D026313
	 $('#kind').change(function(){			
			somethingChanged = true;
		 });
	 
	 $('#mixCommCommodityCode').change(function(){
			
			$('#mixCommodityCommodityCode').val($('#mixCommCommodityCode').val()); 
		 });
	 
	/* var url = _context+'/cas/autocomplete.do?method=searchTariffSource&searchType=11'; 
	 var tariffNumber = $('#tariffNumber').val();
	 $('#tariffNumber').gatesAutocomplete({
	 source:url ,
	 mustMatch:true,
	 
	*/
	var tariffNumber = $('#tariffNumber').val();
	grpId = null;
	
	$('#tariffNumber').gatesAutocomplete({
	 source: _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 mustMatch:true,
		 		 groupType:  '01'
		 },
		// mustMatch:true,
	     formatItem: function(data) {
			 return data.name;
		 },
		 formatResult: function(data) {
			 // Grab value as default
			 dataName=data.name;
			 grpId=data.id;
			 //console.log("format "+grpId);
			 return data.name;
		 }, 
		 select: function(data) {
			 $('#tariffNumber').val(data.id);
			 $('#tariffCheck').val(data.name);
			 grpId=data.id;
			// console.log('grpId '+grpId);
			 clearDataForTariffNumber(data.name,tariffNumber);
			 clearTariffItemOnChangeOfTariff();
			 tariffNumber =  $('#tariffNumber').val();
			 setSaveBillBeforeBillButton();
		 }
	 });
	
	 $('#tariffNumber').change(function(){	
		 somethingChanged = true;

		 clearTariffItemOnChangeOfTariff();
				$('#itemNumber').val("");
				$('#mixCommItem').val("");
				$('#note').val("");
				 if($('#tariffNumber').val()=="" || $('#tariffNumber').val()==null){
					 $('#itemNumber').attr("readOnly",true);
					 $('#mixCommItem').attr("readOnly",true);
					 
				 }else{
					 $('#itemNumber').attr("readOnly",false);
					 $('#mixCommItem').attr("readOnly",false);
				 }
				
		
				 console.log('use grpId '+grpId);
			if(grpId==null ||grpId==""){
				//Fix for defect# D025970 
				//If you tab out of the Tariff field before the result comes back the value should not get blanked out.
				// This was the wrong fix!
	        	$("#tariffNumber").val(""); 
	        	$("#tariffCheck").val("");
	    	}
			else{
				$("#tariffNumber").val(dataName);
				$("#tariffCheck").val(dataName);
				$('#itemNumber').val("");
 				//$('#in_item').removeAttr("disabled");
				grpId="";
			}
		 
	 });
	
	 $('#tariffNumber').gatesPopUpSearch({
		 func:function() {			
			 SourceTariffPopupSearch();
		 }
			 
	 });
	 $('#itemNumber').gatesPopUpSearch({
		 func:function() { 
			 
				 ItemPopupSearch();							 
			 }
	 });
	 
	 $('#commodityDesc').gatesPopUpSearch({
			func : function() {
				if(($('#commodityDesc').val()!="") || ($('#tariffNumber').val()!="" && $('#itemNumber').val().trim()!="")){
				commPopupSearch();
				 somethingChanged = true;
			}
				else{
					alert("Please enter either Commodity Description or Tariff and Item");
				}
					
				}
		});
	 $('#mixCommCommDesc').gatesPopUpSearch({
			
	 func : function() {
			if(($('#mixCommCommDesc').val()!="") || ($('#tariffNumber').val()!="" && $('#mixCommItem').val()!="")){
				mixCommCommDescPopupSearch();
				 somethingChangedMixComm = true;
		}
			else{		
				alert("Please enter either Commodity Description or Tariff and Item");
			}
				
			}
		});
	
	 
		$('#note').gatesPopUpSearch({
			
			func : function() {
				if($('#tariffNumber').val()!=null && $('#tariffNumber').val().trim()!="" && 
						$('#itemNumber').val()!=null && $('#itemNumber').val()!=""){
				notePopupSearch();
				 somethingChanged = true;
			}}
		});
		
		$('#mixCommNote').gatesPopUpSearch({
			func : function() {
				if($('#tariffNumber').val()!=null && $('#tariffNumber').val().trim()!="" && 
						$('#mixCommItem').val()!=null && $('#mixCommItem').val().trim()!=""){
				notePopupSearchMixComm();
				}}
		});
		/*var tempImperialCubeValue=0;
		var tempImperialWeightValue=0;
		var tempMetricCubeValue=0;
		var tempMetricWeightValue=0;
		var changeCountForCube=0;
		var changeCountForWeight=0;*/
		$('#cube').change(function(){ 
			changeCountForCube=0;
			if($('#unitOfMeasureSourceCode').val()=="I"){
				tempImperialCubeValue=$('#cube').val();
				tempMetricCubeValue=0;
			}else{
				tempImperialCubeValue=0;
				tempMetricCubeValue=$('#cube').val();
			}
			});
		$('#netWeight').change(function(){
			changeCountForWeight = 0;
			if($('#unitOfMeasureSourceCode').val()=="I"){
				tempImperialWeightValue=$('#netWeight').val();
				tempMetricWeightValue=0;
			}else{
				tempImperialWeightValue=0;
				tempMetricWeightValue=$('#netWeight').val();
			}
			});
		if($('#cube').val()!="" ){
			
			if($('#unitOfMeasureSourceCode').val()=="I" ){
				tempImperialCubeValue=$('#cube').val();
			}else{
				tempMetricCubeValue=$('#cube').val();
			}
		}
		if($('#netWeight').val()!=""){
			
			if($('#unitOfMeasureSourceCode').val()=="I" ){
				tempImperialWeightValue=$('#netWeight').val();
			}else{
				tempMetricWeightValue=$('#netWeight').val();
			}
		}
		
		$('#unitOfMeasureSourceCode').change(function(){
			changeCountForWeight=changeCountForWeight+1;
			changeCountForCube=changeCountForCube+1;
			origWt=$('#netWeight').val();
			origVol=$('#cube').val();
			if($('#unitOfMeasureSourceCode').val()=="M"){
			$('#netWeightlabel').html("Wgt-KGS");
			//for parties
			$('#totalWeightKGS').html("Total Weight (kgs)");
			
			//added for rounding off decimal places to 3 for metric units
			var modifiedWtMetric=parseFloat(origWt *  0.453592).toFixed(3);
			var modifiedVolMetric = parseFloat(origVol * 0.0283168).toFixed(3);
			if(changeCountForWeight>=2 && tempMetricWeightValue>0){
				$('#netWeight').val(tempMetricWeightValue);
				//for parties section
				$('#totalWeight').val(tempMetricWeightValue);
			}else{
				$('#netWeight').val(modifiedWtMetric);
				//for parties section
				$('#totalWeight').val(modifiedWtMetric);
			}
			$('#cubeLabel').html("Cube(Meters)");
			//for parties
			$('#totalCubeM').html("Total Cube(m)");
			
			//added for rounding off decimal places to 3 for metric units
			if(modifiedVolMetric=='0'){
				if(changeCountForCube>=2 && tempMetricCubeValue>0){
					$('#cube').val(tempMetricCubeValue);
					//for parties section
					$('#totalCube').val(tempMetricCubeValue);
				}else{
					$('#cube').val('');
				}
			}else{
				if(changeCountForCube>=2 && tempMetricCubeValue>0){
					$('#cube').val(tempMetricCubeValue);
					//for parties section
					$('#totalCube').val(tempMetricCubeValue);
				}else{
					$('#cube').val(modifiedVolMetric);
					//for parties section
					$('#totalCube').val(modifiedVolMetric);
				}
			}
			$('#netWeight').removeClass("integer");
			$('#cube').removeClass("integer");
			}
			else if($('#unitOfMeasureSourceCode').val()=="I"){
				 getLoadDschServicepairValue();
				
				$('#netWeightlabel').html("Wgt-LBS");
				//for parties
				$('#totalWeightKGS').html("Total Weight (lbs)");
				
				//added for rounding off decimal places to 0 for imperial units
				var modifiedWtImperial= parseInt(Math.round(origWt * 2.20462)); 
				if(changeCountForWeight>=2 && tempImperialWeightValue>0){
					$('#netWeight').val(tempImperialWeightValue);
					//for parties section
					$('#totalWeight').val(tempImperialWeightValue);
					
				}else{
					$('#netWeight').val(modifiedWtImperial);
					//for parties section
					$('#totalWeight').val(modifiedWtImperial);
				}
				//$('#netWeight').val(modifiedWtImperial);
				
				$('#netWeight').addClass("integer");
				$('#cube').addClass("integer");
				$('#cubeLabel').html("Cube(Ft)");
				//for parties
				$('#totalCubeM').html("Total Cube(ft)");
				
				
				var modifiedVolMetric = "";
				//added for rounding off decimal places to 0 for imperial units
				/*if($('#routingLoadDischargePair').val()!=null && $('#routingLoadDischargePair').val().trim()=="AU"){
					modifiedVolMetric =Math.floor(origVol * 35.314666);
				}else{
					modifiedVolMetric =Math.ceil(origVol * 35.314666);
				}*/
				modifiedVolMetric =parseInt(Math.round(origVol * 35.314666));
				if(modifiedVolMetric=='0' || isNaN(modifiedVolMetric)){
					if(changeCountForCube>=2 && tempImperialCubeValue>0){
						$('#cube').val(tempImperialCubeValue);
						//for parties section
						$('#totalCube').val(tempImperialCubeValue);
					}else{
						$('#cube').val('');
					}
				}else{
					if(changeCountForCube>=2 && tempImperialCubeValue>0){
						$('#cube').val(tempImperialCubeValue);
						//for parties section
						$('#totalCube').val(tempImperialCubeValue);
					}else{
						$('#cube').val(modifiedVolMetric);
						//for parties section
						$('#totalCube').val(modifiedVolMetric);
					}
				}
			}

			if($('#loadDschServiceGroupCode').val()=="CON" || $('#loadDschServiceGroupCode').val()=="LCL"){
				setLengthBreathHeight();
			}
			changedMeasurementSource($('#unitOfMeasureSourceCode').val());
			$('#cube').trigger("change");
			$('#netWeight').trigger("change");
		});
		
	/*	predictive for item*/
		
		
		$('#itemNumber').gatesAutocomplete({

			source: _context+'/cas/autocomplete.do',
			minLength: 1,
			 extraParams: {
	 			 method: 'searchItemName',
	 		 		 searchType: '43',
	 		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
	 		 		 groupType:  '01',
	 		 		 sourceTariff:  function(){return ($('#tariffNumber').val()==null || ($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();},
	 		 		 groupName:   function(){return ($('#tariffNumber').val()==null || ($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();}
	 		 },
	 	// mustMatch:true,
		 formatItem: function(data) {
			 dataName=data.name;
			 itemId=data.id ;
		 		 return data.name;
		 },
		 formatResult: function(data) {
		 		 return data.name;
		 },
			 select: function(data) {
				 somethingChanged = true;
				 $('#tariffItemId').val(data.id);
						resetTariffDetails(data.id,data.name);
				$('#itemNumber').val(data.name);
					 	
				getPrimaryCommodity($('#tariffNumber').val(), data.name);	
				//fetching commodity code list on change of item
				fetchCommodityCodeList($("#tariffNumber").val(),$("#itemNumber").val(),null,false,null);
				$("#note").val("");
				 itemId=data.id ;
				 setSaveBillBeforeBillButton();
			 },
			 autoSelectFirst:true, //for 22742 on tabbing
		});		 

		/*Ends Predctive for Item*/
		
		 $('#mixedCommodityView').click(function(){
			var changeView = true;
			if(somethingChanged == true){
				
				changeView = confirm('There are unsaved changes . Do you want to proceed ?');
				
			}
			
			if(changeView) {
				somethingChanged = false;
				if($('#mixedCommodityView').val()=="Mixed Commodity View")	
				{
				 
					reloadMixedCommodityData();
				}
				if($('#mixedCommodityView').val()=="Commodity View")
				{
					
					// D032310: Enable disabled field for submit.
					// Not a pretty solution but I think it works, if other fields are missing they need to be added.
					
					var tariffDisabled = $('#tariffNumber').attr("disabled");
					var uomDisabled = $('#unitOfMeasureSourceCode').attr("disabled");
					var netWeightDisabled = $('#netWeight').attr("disabled");
					var cubeDisabled = $('#cube').attr("disabled");
					
					if(tariffDisabled) $('#tariffNumber').removeAttr("disabled");
					if(uomDisabled)    $('#unitOfMeasureSourceCode').removeAttr("disabled");
					if(netWeightDisabled)    $('#netWeight').removeAttr("disabled");
					if(cubeDisabled)    $('#cube').removeAttr("disabled");
					
					var queryString = $('#shipmentForm').formSerialize();
					
					if(tariffDisabled) $('#tariffNumber').attr("disabled","disabled");
					if(uomDisabled)    $('#unitOfMeasureSourceCode').attr("disabled","disabled");
					if(netWeightDisabled)    $('#netWeight').attr("disabled","disabled");
					if(cubeDisabled)    $('#cube').attr("disabled","disabled");
					
					
					
					 $.ajax({
						 type:"POST",
						 url:_context+"/shipmentCommodity/loadCommodityDetails",
						 data :queryString,
						success: function(responseText){
							
							if(responseText.success== true){
		                                      reloadShipmentCommodityData(responseText);
	
								$("#commodityGrid").trigger('reloadGrid');
						document.getElementById("blcn").style.display="block";
						document.getElementById("blmx").style.display="none";
						document.getElementById("commodityGridDiv").style.display="block";
						
						 $('#mixedCommodityView').val("Mixed Commodity View");
						 $('#tr_shipmentFreightId').hide();
						}	
						}
					 });
				}
		 	}
		 }); 
		 
		 $('#equipmentNumber').change(function(){
			 
			 if(somethingChangedMixComm == true){
				
				 var conMixComm= confirm('There are unsaved changes . Do you want to proceed ?');
			
				if(conMixComm== true ){
					somethingChangedMixComm = false;
					equipmentCallOnEqpChangeChange();
				}
			 }
			 else{
				 equipmentCallOnEqpChangeChange();
			 }
			
		 
 });

		 $('#previousEquipment').click(function(){
			 
			 if(somethingChangedMixComm == true){
				 
				 var conMixComm= confirm('There are unsaved changes . Do you want to proceed ?');
			
			if(conMixComm== true ){
				somethingChangedMixComm = false;
				equipmentCallOnEqpPrevChange();
			}
			 }
			 else{
				 equipmentCallOnEqpPrevChange();
			 } 
		 
 });	 
		
		 $('#nextEquipment').click(function(){
			 if(somethingChangedMixComm == true){
				
				 var conMixComm= confirm('There are unsaved changes . Do you want to proceed ?');
			
			if(conMixComm== true ){
				 somethingChangedMixComm = false;
				equipmentCallOnEqpNextChange();
			}
			 }
			 else{
				 equipmentCallOnEqpNextChange();
			 } 
		 
 });	
		 $('#updateEquipment').click(function(){
			 updateEquipment();
		 });
		 
		 
		 if($('#billType').val()=="HHGDS" && $("#kind").val().trim()=="")
				$("#kind").val("PCS");
		 
		 var url1 = _context+'/cas/autocomplete.do?method=searchTariffTranslateCodeForTrade&searchType=379&parentSearch='+$('#tradeCode').val();
		 $("#kind").gatesAutocomplete({
		 source: url1,
		
		 formatItem: function(data) {
		 return data.TTCODE_DESC;
		 },
		 autoSelectFirst:true,
		 formatResult: function(data) {
			 somethingChanged = true;
		 return data.TTCODE;
		
		 }, 
		 select: function(data) {
		 $("#kind").val(data.TTCODE);
		 somethingChanged = true;
		 }
		 }); 
		 
		 
		 var url2 = _context+'/cas/autocomplete.do?method=searchTariffTranslateCodeForTrade&searchType=379&parentSearch='+$('#tradeCode').val();
		 $("#mixCommKind").gatesAutocomplete({
		 source: url2,
		
		 formatItem: function(data) {
		 return data.TTCODE_DESC;
		 },
		 autoSelectFirst:true,
		 formatResult: function(data) {
		 return data.TTCODE;
		 }, 
		 select: function(data) {
		 $("#mixCommKind").val(data.TTCODE);
		 somethingChangedMixComm = true;
		 }
		 }); 
		 
		 
		 
		 $( "#commodityDescPage" ).dialog({
				autoOpen: false, 
				width: 1000,
				modal: true,
				closeOnEscape: false,
				beforeClose: function() {
					
					
				},
				open:function(){
					tabSequence('#commodityDescPage',false,false);
				},
				close : function() {
					
				//	$('#specialServicesGrid').jqGrid('GridUnload');
					 $("#mixcommodityGrid").trigger('reloadGrid');  
					 tabSequence('#',true,false);
				},
				buttons : {
					
				"Add & New": function(){
				        	callComodityAddNew();
				        	$('#mixCommItem').focus();
				        },
			        Ok: function(){
			        	if(mixCommOverlayMode=="edit"){
			        		callCommodityEdit();
			        	}
			        	else{
			        					       
			        	callComodityAdd();
			        	}
			        },
			        Clear: function() {
			        	clearCommodity();
			        },
			        Cancel: function() {

			        	 if(somethingChangedMixComm == true ){

			   		  var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
			   		if(conf== true ){
			   			somethingChangedMixComm == false;
			   		 $("#commodityDescPage").dialog('close');
						}else{
							}
						}else{
							 $("#commodityDescPage").dialog('close');
						}
			        	
			        }
				}
			});
		 
		 $('#commodityAddDiv').click(function() {
			 if($('#statusCode').text()!="CORRECTED" && $('#statusCode').text()!="ISSUED")
				{
				 	showAddCommodityDialog();
				 	return true;
				}
			 return false;
		 });
		
		$('#shipmentItemImperialLengthFeet').change(function() {
			var totalMetersLength = convertInchesToMeter($('#shipmentItemImperialLengthFeet').val(), $('#shipmentItemImperialLengthInches').val());
			$('#shipmentItemMetricLength').val(totalMetersLength);
		});
		 
		$('#shipmentItemImperialLengthInches').change(function() {
			var totalMetersBreadth = convertInchesToMeter($('#shipmentItemImperialLengthFeet').val(), $('#shipmentItemImperialLengthInches').val());
			$('#shipmentItemMetricLength').val(totalMetersBreadth);
		});
		 
		 
		
		
		$('#shipmentItemImperialBreathFeet').change(function() {
			var totalMetersHeight = convertInchesToMeter($('#shipmentItemImperialBreathFeet').val(), $('#imperialBreathInches').val());
			$('#shipmentItemMetricBreadth').val(totalMetersHeight);
		});
		 
		$('#imperialBreathInches').change(function() {
			var totalMetersInches = convertInchesToMeter($('#shipmentItemImperialBreathFeet').val(), $('#imperialBreathInches').val());
			$('#shipmentItemMetricBreadth').val(totalMetersInches);
		});
		
		$('#shipmentItemImperialHeightFeet').change(function() {
			var totalMeters = convertInchesToMeter($('#shipmentItemImperialHeightFeet').val(), $('#shipmentItemImperialHeightInches').val());
			$('#shipmentItemMetricHeight').val(totalMeters);
		});
		 
		$('#shipmentItemImperialHeightInches').change(function() {
			var totalMeters = convertInchesToMeter($('#shipmentItemImperialHeightFeet').val(), $('#shipmentItemImperialHeightInches').val());
			$('#shipmentItemMetricHeight').val(totalMeters);
		});
		
		
		$('#shipmentItemMetricLength').change(function(){
			var convertedUnits = new imperialLength($('#shipmentItemMetricLength').val());
			$('#shipmentItemImperialLengthFeet').val(convertedUnits.feet);
			$('#shipmentItemImperialLengthInches').val(convertedUnits.inches);
		});
		$('#shipmentItemMetricBreadth').change(function(){
			var convertedUnits = new imperialLength($('#shipmentItemMetricBreadth').val());
			$('#shipmentItemImperialBreathFeet').val(convertedUnits.feet);
			$('#imperialBreathInches').val(convertedUnits.inches);
		});
		$('#shipmentItemMetricHeight').change(function(){
			var convertedUnits = new imperialLength($('#shipmentItemMetricHeight').val());
			$('#shipmentItemImperialHeightFeet').val(convertedUnits.feet);
			$('#shipmentItemImperialHeightInches').val(convertedUnits.inches);
		});
		
		
		 
		$('#unitOfMeasureSourceCode').change(function(){
			if($('#unitOfMeasureSourceCode').val()=="I"){
				document.getElementById("forImperial").style.display="block";
				document.getElementById("forMetric").style.display="none";	
			}else {
				document.getElementById("forImperial").style.display="none";
				document.getElementById("forMetric").style.display="block";	
			}
		});
		
		/*Security shipment*/
		if(shipmentNotFound==false)
		{
			if(isCommodityBLCNUpdate ||isCommodityBLAUUpdate ||isCommodityBLCVUpdate){
				$('#updateCommodity').attr('disabled', false);
				$('#clearCommodity').attr('disabled', false);
			}else{
				$('#updateCommodity').attr('disabled', true);
				$('#clearCommodity').attr('disabled', true);
			}
		
			if(isCommodityBLCNAdd ||isCommodityBLAUAdd ||isCommodityBLCVAdd){
				$('#addCommodity').attr('disabled', false);
			}else{
				$('#addCommodity').attr('disabled', true);
			}
			if(isCommodityBLCNDelete ||isCommodityBLAUDelete ||isCommodityBLCVDelete){
				$('#deleteCommodity').attr('disabled', false);
			}else{
				$('#deleteCommodity').attr('disabled', true);
			}
		}
		
		
		$('#tariffNumber').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#shipmentCommodityHeader').focus();
				}else{
					$('#itemNumber').focus();
				}
					}
				});
		
		$('#itemNumber').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#tariffNumber').focus();
				}else{
					$('#note').focus();
				}
					}
				});
		
		$('#note').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#itemNumber').focus();
				}else{
					$('#piece').focus();
				}
					}
				});
		
		$('#piece').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#note').focus();
				}else{
					$('#kind').focus();
				}
					}
				});
		
		$('#kind').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#piece').focus();
				}else{
					$('#netWeight').focus();
				}
					}
				});
		
		$('#netWeight').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				
				event.preventDefault();
				if (event.shiftKey) {
					$('#kind').focus();
				}else{
					$('#cube').focus();
				}
					}
				});
		

		$('#cube').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					$('#netWeight').focus();
				}else{
					$('#containerCommodityDesc').focus();
				}
					}
				});
		
		$('#commodityDesc').live('keydown', function(event) {
			if (event.keyCode == '16') {
				return;
			}
				
			if (event.keyCode == '9' && $('#mixedCommodityView').val()!="Commodity View") {
				event.preventDefault();
				if (event.shiftKey) {
					
				}else{
					$('#itemNumber').focus();
				}
					}
				});
		
	
		
 });
 
 function enableCommodityUpdate(){
		
 }
 var mixCommodityRecordCount =0;
function showAddCommodityDialog(){
	 //console.log("showAddCommodityDialog");
	 $('#mixCommCommDesc').attr('disabled', false);
	 
	 //console.log($('#mixcommodityGrid').getGridParam('lastpage')+"="+$('#mixcommodityGrid').getGridParam('page'));
	 if($('#mixcommodityGrid').getGridParam('lastpage') != $('#mixcommodityGrid').getGridParam('page') ) {
		 jQuery("#mixcommodityGrid").setGridParam({
			    page: $('#mixcommodityGrid').getGridParam('lastpage')
		 });
		 $("#mixcommodityGrid").attr("finishShowCommodity", true);
		 $("#mixcommodityGrid").trigger("reloadGrid");
	} else {
		finishShowAddCommodityDialog();
	}
}
	 
function finishShowAddCommodityDialog(){	 
	 var queryString = $('#shipmentForm').formSerialize();
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/newCommodity",
		 data :queryString,
		 success: function(responseText){
			 if(responseText.success==true)
		    
		     setValueInCommodityOverlay(responseText.data);
			 updateMixCommKindList(responseText);
	           $("#commodityDescPage").dialog( "option", "title", 'Add Commodity for '+$('#equipmentNumber').val() );
	           $("#commodityDescPage").dialog('open');
	           //$('#mixCommItem').val($('#itemNumber').val());
	           //if(responseText.data.itemNumber!=null)
	           //$('#mixCommItem').val(responseText.data.itemNumber);
	          // $('#mixCommItemId').val($('#itemNumber').val());
	           mixCommOverlayMode= "add";
	           $('#mixCommItem').removeAttr("readOnly");
	           $('#msgDivCommodityOverlay').html("");
	           if($('#tariffNumber').val()=="" || $('#tariffNumber').val()==null){
	        	     $('#msgDivCommodityOverlay').html("Tariff Item disabled, enter a tariff #");
	      		     $('#msgDivCommodityOverlay').addClass("itemError");
					 $('#mixCommItem').attr("readOnly",true);
					 
				 }
	           
	          
	           loadNewRow();
	           mixCommodityRecordCount = jQuery("#mixcommodityGrid").jqGrid('getGridParam', 'records');
	           loadItemDataForMixCommodity();
}
	 });
}


function setValueInCommodityOverlay(data){
	$('#mixCommItem').val(data.mixCommItem);
	$('#mixCommPieces').val(data.mixCommPieces);
	$('#mixCommNetWgt').val(data.mixCommNetWgt);
	$('#mixCommKind').val(data.mixCommKind);
	$('#mixCommCube').val(data.mixCommCube);
	$('#mixCommNote').val(data.mixCommNote);
	$('#mixCommCommDesc').val(data.mixCommCommDesc);
	//$('#mixCommItemId').val(data.mixCommItem);
	$('#mixCommItem').val(data.mixCommItem);
	
	$('#mixCommodityCommoditycommentId').val(data.mixCommodityCommoditycommentId);
	$('#mixCommodityCommodityCode').val(data.mixCommodityCommodityCode);
	populateMixCommodityCodeListBilling(data.commodityCodeList);
	 $(":button:contains('Add & New')").prop("disabled", false).removeClass("ui-state-disabled");
}

function clearCommodity(){
	
	$('#mixCommItem').val("");
	$('#mixCommPieces').val("");
	$('#mixCommNetWgt').val("");
	$('#mixCommKind').val("");
	$('#mixCommCube').val("");
	$('#mixCommNote').val("");
	$('#mixCommCommDesc').val("");
	$('#mixCommItemId').val("");
	$('#mixCommItem').val("");
	$('#mixCommodityCommoditycommentId').val("");
	$('#mixCommodityCommodityCode').val("");
	$('#mixCommCommodityCode').val("");
	 $('#msgDivCommodityOverlay').html("");
	 $("#mixCommKind").val("");
}
  function callComodityAddNew(){

	  var returnNetweight = checkForPositiveNumberNetWeight();
		 var returnNetCube = checkForPositiveNumberCube();
		 var returnPiece = checkForPositiveNumberPieces();
		 var returnTotalCube = checkForTotalCube();
		 var checkForNote = checkForNoteNumber();
		 var returnCheckKind = checkKind();
		 if(returnPiece && returnNetCube && returnNetweight && returnTotalCube && checkForNote && returnCheckKind){
	
	    callCommodityAddNewWithTimeOut();
		 }
 }
  
  function callCommodityAddNewWithTimeOut(){
	  
	  $(":button:contains('Add & New')").prop("disabled", true).addClass("ui-state-disabled");
	  var params = 
			"mixCommItem=" + $('#mixCommItem').val() +
			"&mixCommPieces=" + $('#mixCommPieces').val() +
			"&mixCommNetWgt=" + $('#mixCommNetWgt').val() +
			"&mixCommKind=" + $('#mixCommKind').val() +
			"&mixCommCube=" + $('#mixCommCube').val() +
			"&mixCommNote=" + $('#mixCommNote').val() +
			"&mixCommCommDesc="+ $('#mixCommCommDesc').val()+
			"&mixCommCommCode="+$('#mixCommodityCommodityCode').val();
			
			
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/commodityAddNew",
		 data :params,
		 success: function(responseText){
			
			 if(responseText.success==true){
				 somethingChangedMixComm = false;
				 mixCommodityRecordCount++;
				 addRowToMixCommodityGrid(mixCommodityRecordCount, $('#mixCommItem').val() , $('#mixCommNetWgt').val(),$('#mixCommCube').val() ,$('#mixCommPieces').val(), $('#mixCommKind').val() ,  $('#mixCommNote').val() , $('#mixCommCommDesc').val()  );
				
				 setValueInCommodityOverlay(responseText.data);
				
				 $("#mixcommodityGrid").trigger('reloadGrid');  
				 $('#msgDivCommodityOverlay').html("");
				 $('#mixCommCommDesc').attr('disabled', false);
			 } else{
				
				 if(responseText.success==false){
					 showResponseMessagesMixComm("msgDivCommodityOverlay",responseText);
					 document.getElementById("msgDivCommodityOverlay").style.display="block";
				 }
			 }	
			 $(":button:contains('Add & New')").prop("disabled", false).removeClass("ui-state-disabled");
		 }
	 }); 
  }
  function showResponseMessagesMixComm(msgDivId, responseText) {
		if (responseText.messages) {

			var messages = responseText.messages;
			var messageContent = '';
			if (messages.error.length > 0) {
				var array = messages.error;
				var len = messages.error.length;
				for ( var i = 0; i < len; i++) {

					messageContent += '<div class="message_error">' + array[i]
							+ '</div>';
				}
			}

			if (messages.warn.length > 0) {
				var array = messages.warn;
				var len = messages.warn.length;
				for ( var i = 0; i < len; i++) {
					messageContent += '<div class="message_warning">' + array[i]
							+ '</div>';
				}
			}

			if (messages.info.length > 0) {
				var array = messages.info;
				var len = messages.info.length;
				for ( var i = 0; i < len; i++) {
					messageContent += '<div class="message_info">' + array[i]
							+ '</div>';
				}
			}

			if (messages.success.length > 0) {
				var array = messages.success;
				var len = messages.success.length;
				for ( var i = 0; i < len; i++) {
					messageContent += '<div class="message_success">' + array[i]
							+ '</div>';
				}
			}
			if (messageContent != '') {
				$('#' + msgDivId).html(messageContent);
				window.scrollTo(0, 0);
			}
		}
	}

 function callComodityAdd(){
	 var returnNetweight = checkForPositiveNumberNetWeight();
	 var returnNetCube = checkForPositiveNumberCube();
	 var returnPiece = checkForPositiveNumberPieces();
	 var returnTotalCube = checkForTotalCube();
	 var checkForNote = checkForNoteNumber();
	 var returnCheckKind = checkKind();
	 if(returnPiece && returnNetCube && returnNetweight && returnTotalCube && checkForNote && returnCheckKind){
		 callComodityAddWithTimeOut();
	//window.setTimeout('callComodityAddWithTimeOut()',2000);
	 }
 }
 
 
 function checkForNoteNumber(){
	 var val = $('#mixCommNote').val(); 
	 var charRegex = /^[0-9a-zA-Z\ \'\&]+$/; 
	 if(val!=null && val!=""){
	 if(!charRegex.test($.trim(val))){ alert(" Please enter valid note , Only Number Character allowed"); 
	 return false;
	 }else{
		 return true;
	 };
	 
	 } return true;
	 
 }
 function callComodityAddWithTimeOut(){
	 var params = 
			"mixCommItem=" + $('#mixCommItem').val() +
			"&mixCommPieces=" + $('#mixCommPieces').val() +
			"&mixCommNetWgt=" + $('#mixCommNetWgt').val() +
			"&mixCommKind=" + $('#mixCommKind').val() +
			"&mixCommCube=" + $('#mixCommCube').val() +
			"&mixCommNote=" + $('#mixCommNote').val() +
			"&mixCommCommDesc="+ $('#mixCommCommDesc').val()+
			"&mixCommCommCode="+$('#mixCommodityCommodityCode').val();
			
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/commodityAddNew",
		 data :params,
		 success: function(responseText){
			 somethingChangedMixComm = false;
			 if(responseText.success==true){
				 setValueInCommodityOverlay(responseText.data);
	     $("#commodityDescPage").dialog( "option", "title", 'Add Commodity' );
	     $("#commodityDescPage").dialog('close');
	     $('#mixCommCommDesc').attr('disabled', false);
	   
	     $("#mixcommodityGrid").trigger('reloadGrid');  
	     $('#msgDivCommodityOverlay').html("");
			 }else{
				
				 if(responseText.success==false){
					 showResponseMessagesMixComm("msgDivCommodityOverlay",responseText);
					 document.getElementById("msgDivCommodityOverlay").style.display="block";
				 }
			 }	
	     
}
	 });
 }
 function callCommodityEdit(){
	 //console.log("EDIT Start "+new Date());
	 var returnNetweight = checkForPositiveNumberNetWeight();
	 var returnNetCube = checkForPositiveNumberCube();
	 var returnTotalCube = checkForTotalCube();
	 var checkForNote = checkForNoteNumber();
	 var returnPiece = checkForPositiveNumberPieces();
	 var returnCheckKind = checkKind();
	 if(returnPiece && returnNetCube && returnNetweight&&returnTotalCube&& checkForNote && returnCheckKind){
		 callCommodityEditWithTimeOut();
	 //window.setTimeout('callCommodityEditWithTimeOut()',2000); // why wait 2 seconds?
	 }
 }
 
 function callCommodityEditWithTimeOut(){
	 var params = 
			"mixCommItem=" + $('#mixCommItem').val() +
			"&mixCommPieces=" + $('#mixCommPieces').val() +
			"&mixCommNetWgt=" + $('#mixCommNetWgt').val() +
			"&mixCommKind=" + $('#mixCommKind').val() +
			"&mixCommCube=" + $('#mixCommCube').val() +
			"&mixCommNote=" + $('#mixCommNote').val() +
			"&mixCommCommDesc="+ $('#mixCommCommDesc').val()+
			"&mixCommUnitOfCommodity=" + $('#mixCommUnitOfCommodity').val() +
			"&mixCommShipmentItemId="+ $('#mixCommShipmentItemId').val()+
			"&mixCommoditycommentId=" +$('#mixCommodityCommoditycommentId').val()+
			"&mixCommoditycommodityCode="+$('#mixCommodityCommodityCode').val() +
			"&shipmentmixCommItemId=0" ;
			
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/commodityEditUpdate",
		 data :{mixCommItem:$('#mixCommItem').val(),  mixCommPieces: $('#mixCommPieces').val() 
			 ,mixCommNetWgt: $('#mixCommNetWgt').val() 
			 ,mixCommKind: $('#mixCommKind').val() 
			 ,mixCommCube: $('#mixCommCube').val() 
			 ,mixCommNote: $('#mixCommNote').val() 
			 ,mixCommCommDesc:$('#mixCommCommDesc').val()
			 ,mixCommUnitOfCommodity: $('#mixCommUnitOfCommodity').val() 
			 ,mixCommShipmentItemId:$('#mixCommShipmentItemId').val()
			 ,mixCommoditycommentId:$('#mixCommodityCommoditycommentId').val()
			 ,mixCommoditycommodityCode:$('#mixCommodityCommodityCode').val() 
			 ,shipmentmixCommItemId:0 },
		 success: function(responseText){
			 if(responseText.success==true){
				 //console.log("EDIT Done "+new Date());
				 somethingChangedMixComm = false;
				 var currentRowId = parseInt($('#mixCommUnitOfCommodity').val());
				 var nextRowId = getNextRowId(currentRowId);
				 if(nextRowId != -1) { 
					 //console.log("binding to loadComplete");
					 $('#mixCommCommDesc').attr('disabled', false);
					 $('#mixcommodityGrid').attr('nextRowId',nextRowId); 
				 } else {
					 $("#commodityDescPage").dialog('close'); 
				 }
				 
				
				 $("#mixcommodityGrid").trigger('reloadGrid');  
				 
				
			 }
			 else{
				 showResponseMessages("msgDivCommodityOverlay", responseText);
			 }
}
	 });
 }
 function SourceTariffPopupSearch() {   
	 var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+01+"&sourceTariff="+$('#tariffNumber').val();
	 tariffNumber =$('#tariffNumber').val();
	 var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	 window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
	 }
 
 function sourceTariffSearchUpdate(id){
	 var values = id.split("|");
	   $('#tariffNumber').val(values[0]);
	   $('#tariffCheck').val(values[0]);
	   clearDataForTariffNumber(values[0],tariffNumber);
	   clearTariffItemOnChangeOfTariff();
	   tariffNumber =  $('#tariffNumber').val();
	   // Lookup items
	   window.itemList = null;
	 }

 
 /*function loadTemplateDetails()
	{  
	 var queryString = $('#shipmentForm').formSerialize();
	
		$.ajax({
			type: "POST",
			url: _context +"/shipmentCommodity/loadTemplateDetails",
			data: queryString,
		    success: function(responseText) {
		    	
		  
		    	 $("#kind").get(0).options.length = 0;
			        $.each(responseText.data.kindList, function(index,kindList) {
			            $("#kind").get(0).options[$("#kind").get(0).options.length] = new Option(kindList.description, kindList.code);
			        });
					
			        var kindNo = responseText.data.kind; //$("#containerNumberForDispatch").val();
			        $("#kind").editableDropdown("selectOption", {value: kindNo, text: kindNo});
		 		 }
	});
	}
 */
 function clearDataForTariffNumber(id, olddata){
		
	 if(id!=olddata ){
		
			
			$('#itemNumber').val("");
			$('#note').val("");
			$('#itemNumber').removeAttr("readOnly");
	 }
 }
 function clearCommoditySection(checkClearButton){
	
	
	 $('#commodityDesc').val("");
	 $('#itemNumber').val("");
	 $('#note').val("");
	 $('#netWeight').val("");
	 $('#piece').val("");
	 $('#cube').val("");
	$('#containerCommodityDesc').val("");
	$('#commodityCode').val("");
	 $('#unitOfCommodity')
     .append($('<option>',{ value : "" })
     .text(""));
	 var size = $('#unitOfCommodity').size();
	
	 $('#previousCommodity').attr("disabled",true);
		$('#nextCommodity').attr("disabled",true);
		
		$('#deleteCommodity').attr("disabled",true);
		
		$("#kind").val("");
		 somethingChanged == false;
	
		 $("#shipmentItemImperialLengthFeet").val("");
			$("#shipmentItemImperialLengthInches").val("");
			$("#shipmentItemImperialBreathFeet").val("");
			$("#imperialBreathInches").val("");
			$("#shipmentItemImperialHeightFeet").val("");
			$("#shipmentItemImperialHeightInches").val("");
			$("#shipmentItemMetricLength").val("");
			$("#shipmentItemMetricBreadth").val("");
			$("#shipmentItemMetricHeight").val("");
 }
 
 function updateShipmentKindList(){
	 var queryString = $('#shipmentForm').formSerialize();
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/returnKindText",
		 data:queryString,
		 success:function(responseText){
			 if(responseText.success =="True"){
				 
				 return responseText.data;
			 }
		 }
		 
	 });
 }
 var commDescSearchLocator ="";
 function commPopupSearch() {
		var dscr = $("#commodityDesc").val();
		var tariffNo = $("#tariffNumber").val();
		var itemNo =$("#itemNumber").val();
		var estShipDate = "";
	/*	if($('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null" && $('#freightReceivedDate').val()!=""){
			estShipDate = $('#freightReceivedDate').val();
		} */
		//Assigned RateDate instead of ReceivedDate as part of defect D026648
		if($('#rateDate').val()!=null && $('#rateDate').val()!="null" && $('#rateDate').val()!=""){
			estShipDate = $('#rateDate').val();
		}
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc =  $("#dischargeServiceCode").val();
		var trade = $('#tradeCode').val();
		var blOriginCityCode = $('#blOriginCityCode').val();
		var originPortCityCode =  $('#originPortCityCode').val();
		var destinationPortCityCode =  $('#destinationPortCityCode').val();
		var blDestinationCityCode =  $('#blDestinationCityCode').val();
		
		commDescSearchLocator = "commDesc";
		var actionUrl = _context+'/cas/searchShipmentCommodityLookup.do?filterValue1=' +encodeURIComponent(dscr + '|' + tariffNo + '|' +itemNo+ '|' + trade +
				'|' + loadSrvc + '|' + dischargeSrvc + '|' + estShipDate + '|' + blOriginCityCode + '|' + originPortCityCode + 
				'|' + destinationPortCityCode + '|' + blDestinationCityCode);
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);		
	}

 function mixCommCommDescPopupSearch() {
	 var dscr = $("#mixCommCommDesc").val();
		var tariffNo = $("#tariffNumber").val();
		var itemNo =$("#mixCommItem").val();
		var estShipDate = "";
		if($('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null" && $('#freightReceivedDate').val()!=""){
			estShipDate = $('#freightReceivedDate').val();
		}
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc =  $("#dischargeServiceCode").val();
		var trade = $('#tradeCode').val();
		var blOriginCityCode = $('#blOriginCityCode').val();
		var originPortCityCode =  $('#originPortCityCode').val();
		var destinationPortCityCode =  $('#destinationPortCityCode').val();
		var blDestinationCityCode =  $('#blDestinationCityCode').val();
		commDescSearchLocator = "mixCommDesc";
		
		var actionUrl = _context+'/cas/searchShipmentCommodityLookup.do?filterValue1=' +encodeURIComponent(dscr + '|' + tariffNo + '|' +itemNo+ '|' + trade +
				'|' + loadSrvc + '|' + dischargeSrvc + '|' + estShipDate + '|' + blOriginCityCode + '|' + originPortCityCode + 
				'|' + destinationPortCityCode + '|' + blDestinationCityCode);
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);		
		
	}
 
	function commodityUpdate(id){
		var values= id.split("|");
		if(commDescSearchLocator=="commDesc"){
			
			if(values[1] != null && values[1] == "**NPC**"){
				alert("NO PRIMARY COMMODITY FOUND");
			}else{
				$("#commodityDesc").val(values[1]);
				$("#commodityDesc").val(values[1]);	
			}
		
		$("#tariffNumber").val(values[3]);
		$("#tariffCheck").val(values[3]);
		$("#itemNumber").val(values[4]);
		returnCommodityCode(values,commDescSearchLocator);
		
		fetchCommodityCodeList($("#tariffNumber").val(),$("#itemNumber").val(),values,false,null);
		
		
		somethingChanged= true;
	}
		else if(commDescSearchLocator=="mixCommDesc"){
			
			
			if(values[1] != null && values[1] == "**NPC**"){
				alert("NO PRIMARY COMMODITY FOUND");
			}else{
				$("#mixCommCommDesc").val(values[1]);
				$("#mixCommCommDesc").val(values[1]);	
			}
			
			$("#tariffNumber").val(values[3]);
			$("#tariffCheck").val(values[3]);
			$("#mixCommItem").val(values[4]);
			returnCommodityCode(values,commDescSearchLocator);
			//$("#mixCommodityCommodityCode").val(mixCommodityCommodityCode);
			
			fetchCommodityCodeList($("#tariffNumber").val(),$("#mixCommItem").val(),values[1],true,null);
			
			somethingChangedMixComm=true;
			}
		}

	function returnCommodityCode(values,commDescSearchLocator){
		queryString = "descType="+values[0]+
		              "commodityId="+values[9]+
		              "itemId="+values[11];
		 $.ajax({
			 type:"GET",
			 async:false,
			 url:_context+"/shipmentCommodity/returnCommodityCode",
			 data: {descType:values[0], commodityId:values[9],itemId:values[11]},
			 success:function(responseText){
				 if(responseText.success){
					 if(commDescSearchLocator=="commDesc"){
					 $("#shipmentCommodityCode").val(responseText.data);
					 }else if(commDescSearchLocator=="mixCommDesc"){
					 $("#mixCommodityCommodityCode").val(mixCommodityCommodityCode);
					 }
				 }
			 }
			 
		 });
	}
	
	function fetchCommodityCodeList(tariffNumber,itemNumber,values,isMixed,itemId){
		var selectedCommodityCode = 	$("#shipmentCommodityCode").val();
		//console.log("Inside method fetchCommodityCodeList, tariffNumber:"+tariffNumber+",itemNumber:"+itemNumber+",isMixed:"+isMixed);
//		var tariffNumber = $("#tariffNumber").val();
//		var itemNumber = $("#itemNumber").val();
		if(!isMixed){
		var commoditydescId='00000';
		if(values!=null){commoditydescId=values[9];}		 
			$.ajax({
			 type:"GET",
			 async:false,
			 url:_context+"/shipmentCommodity/returnCommodityCodeList",
			 data: {tariffNumber:tariffNumber,itemNumber:itemNumber,commodityDescId:commoditydescId},
			 success:function(responseText){				
				 if(responseText.success){				
					populateCommodityCodeListBilling(responseText.data);					
					setFreightAccordianTabDetails($('#commodityLine').text(),tariffNumber,itemNumber, $('#containerCommodityDesc').val(),$("#commodityDesc").val());
					$('#shipmentCommodityCode').val(selectedCommodityCode);
				 }
			 }			 
			});
		}else {
		//D032322
			if(itemId==null){itemId=0;}			 
			$.ajax({
				 type:"GET",
				 url:_context+"/shipmentCommodity/returnCommCodeListByCommDescName",
				 data: {tariffNumber:tariffNumber,itemNumber:itemNumber,commodityDesc:values,itemId:itemId},
				 success:function(responseText){					
					 if(responseText.success){						
						populateMixCommodityCodeListBilling(responseText.data);						
						setFreightAccordianTabDetails($('#commodityLine').text(),tariffNumber,itemNumber, $('#containerCommodityDesc').val(),$("#commodityDesc").val());
						$('#shipmentCommodityCode').val(selectedCommodityCode);
					 }
				 }
				 
			 });
		}
	}
	
	/*function populateCommodityCodeListChange(list){
		alert("Inside populaCommodityCodeListChange, list :"+list);
		$('select#commodityCode').children().remove().end().append('<option selected value="">Select</option>');
		if(list != null)
		{
			for ( var i = 0; i < list.length; i++) {
		
				$('select#commodityCode').append($("<option/>", {
					value : list[i].code,
					text : list[i].code + " - " +list[i].description
				}));
			alert("value:"+value+",text:"+text);
			}
			
			if(list.length==1){
				$('#commodityCode').val($.trim(list[0].code));
		
			}
		}
	}*/
	
	var noteLookUp="";
	function notePopupSearch() {
		
		var tariffNo = $("#tariffNumber").val();
		var itemNo = $("#itemNumber").val();
		// Need to set it
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
		noteLookUp ="CONTRCOMM";
		var origin = $('#blOriginCityCode').val();
		var destination = $('#blDestinationCityCode').val();
		var actionUrl = _context+'/cas/searchNoteNoLookup.do?filterValue1=' + tariffNo + '|' + itemNo + '|' + estShipDate + '|' + eqType + 
			'|' + eqLength + '|' + eqHeight + '|' + origin + '|' + destination +
			'|' + originPortCityCode + '|' + destinationPortCityCode + '|' + loadSrvc + '|' + dischargeSrvc + '|' + trade ;
		
			
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'NoteSearch', windowStyle);
	
	}

	function noteNoUpdate(id){
		var values= id.split("|");
		if(noteLookUp=="CONTRCOMM"){
		
		$("#note").val((values[0]));
		somethingChanged=true;
		}else{
			
			$("#mixCommNote").val((values[0]));
			somethingChangedMixComm = true;
		}
	
	}
	function ItemPopupSearch() { 
		if ($('#itemNumber').is('[readonly]') ) {}else{
		var actionUrl = _context+"/cas/itemnamelookup.do?sourceTariff="+$('#tariffNumber').val()+"&grpName="+$('#tariffNumber').val()+"&grpTyp=01"+"&itemName="+$('#itemNumber').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'ItemNameSearch', windowStyle);    
	} 
	}	
	
	function itemNameSearchUpdate(id){
		var values = id.split("|");
	  	$('#itemNumber').val(values[0]);
	  	somethingChanged = true;
	  	getPrimaryCommodity($('#tariffNumber').val(), $('#itemNumber').val());		  	
	  	$("#note").val("");
	  	fetchCommodityCodeList($('#tariffNumber').val(), $('#itemNumber').val(),null,false,null);
	}  
			
	
	function updateKindList(responseText){
		 /* $("#kind").get(0).options.length = 0;
	        $.each(responseText.data.shipmentItemForm.kindList, function(index, kindList) {
	            $("#kind").get(0).options[$("#kind").get(0).options.length] = new Option(kindList.description, kindList.code);
	        });*/
			
	        var kind = responseText.data.shipmentItemForm.kind; //$("#containerNumberForDispatch").val();
	        $("#kind").val(kind);
	       /* var kindText = responseText.data.shipmentItemForm.kindText; 
	        $("#kind").editableDropdown("selectOption", {value: kind, text: kindText});*/

	}
	
/*function updateEquipmentNumber(responseText){
	$("#equipmentNumber").get(0).options.length =0;
	  $.each(responseText.data.shipmentItemForm.kindList, function(index, kindList) {
          $("#kind").get(0).options[$("#kind").get(0).options.length] = new Option(kindList.description, kindList.code);
      });
		
      var kind = responseText.data.shipmentItemForm.kind; //$("#containerNumberForDispatch").val();
      var kindText = responseText.data.shipmentItemForm.kindText; 
      $("#kind").editableDropdown("selectOption", {value: kind, text: kindText});
	
	
}	*/
	function updateMixCommKindList(responseText){
		 /* $("#mixCommKind").get(0).options.length = 0;
	        $.each(responseText.data.mixCommkindList, function(index, kindList) {
	            $("#mixCommKind").get(0).options[$("#mixCommKind").get(0).options.length] = new Option(kindList.description, kindList.code);
	        });
			*/ 
	        var kind = responseText.data.mixCommKind; 
	       // var kindText = responseText.data.mixCommKind;
	        $("#mixCommKind").val(kind);

	}
	
	function updateCommodityLine(responseText){
		  $("#unitOfCommodity").get(0).options.length = 0;
		  $.each(responseText.data.shipmentItemForm.commodityLineList, function(index, commodityLineList) {
	            $("#unitOfCommodity").get(0).options[$("#unitOfCommodity").get(0).options.length] = new Option(commodityLineList.description, commodityLineList.code);
	        });
		  var unitOfCommodity = responseText.data.shipmentItemForm.unitOfCommodity;
		  $("#unitOfCommodity").val(unitOfCommodity);
	}
	
	function validateButtonAction(Strng){
		if(Strng=="next"){
		if($('#unitOfCommodity').val()>=$('#commodityLine').text()){
			alert("There is no Next Commodity");
			$('#nextCommodity').attr("disabled",true);
			return false;
		}
		else{
			return true;
			}
		}	
		else if(Strng=="previous"){
			if($('#unitOfCommodity').val()<="1"){
				alert("There is no Previous Commodity");
				$('#previousCommodity').attr("disabled",true);
				return false;
			}
			else{
				return true;	
			}
			
		}
		else  return true;
		
	}
	function enableCommoditySectionButtons(buttonStrng){
		if(buttonStrng =="ALL"){
			if(isCommodityBLCNUpdate ||isCommodityBLAUUpdate ||isCommodityBLCVUpdate){
			$('#clearCommodity').attr("disabled",false);
			$('#updateCommodity').attr("disabled",false);
			}
			if(isCommodityBLCNAdd ||isCommodityBLAUAdd ||isCommodityBLCVAdd){
			$('#addCommodity').attr("disabled",false);
			}
			if(isCommodityBLCNDelete ||isCommodityBLAUDelete ||isCommodityBLCVDelete){
			$('#deleteCommodity').attr("disabled",false);
			}
			
			
		}
	}
	function resetTariffDetails(itemId,itemName){
		$('#commodityDesc').val('');
		
		$('#note').val('');
		
	}
	
	function getPrimaryCommodity(tariffNo, itemNo){
		var blOriginCityCode = $('#blOriginCityCode').val();
		var blDestinationCityCode = $('#blDestinationCityCode').val();
		var originPortCityCode = $('#originPortCityCode').val();
		var destinationPortCityCode = $('#destinationPortCityCode').val();
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc = $("#dischargeServiceCode").val();
		var trade = $('#tradeCode').val();
		var estShipDate = "";
		if($('#rateDate').val()!="" && $('#rateDate').val()!=null && $('#rateDate').val()!="null"){
			estShipDate = $('#rateDate').val();
		}else if($('#freightReceivedDate').val()!="" && $('#freightReceivedDate').val()!=null && $('#freightReceivedDate').val()!="null"){
			estShipDate = $('#freightReceivedDate').val();
		}
		//var tariffNo = $("#tariff").val();
		//var itemNo = $("#tariffItemNumber").val();
		
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
						$('#msgDivCommodity').html('');
						$('#msgDivCommodity').hide();
						$("#commodityDesc").val(responseText[0].desc);

						if(responseText[0].descid!=null && responseText[0].descid!=''){
							
							$.ajax({
								url: _context+'/booking/freight/getCommodityCodes',
								async:false,
								data: {commodityDescId:responseText[0].descid,
									frtItemId:responseText[0].itemid},
								success: function(responseText){
									if(responseText.success){
										populateCommodityCodeList(responseText.data);
									}
								}
							});
						}
						
						if ($.trim(responseText[0].noterate)!=null && $.trim(responseText[0].noterate)!='') {
							
							$('#note').val("");
						} else {
							
						}
						
						
					}
					else{
						$('#msgDivCommodity').show();
						//$('#msgDivCommodity').html('<div class="message_error">Commodity code description is not found.</div>');
						resetMandatoryTariffCmdDesc();
						/*setMandatoryTariffItem();*/
						$("#commodityDesc").val("");
						$('#shipmentCommodityCode').val("");
						// displaying more specific error message if available as per D025670
						if (responseText[0].commodityNotFound =="Y"){
							$('#msgDivCommodity').html('<div class="message_error">Commodity Code/Description not found for Tariff Item.</div>'); //Defect 26684		
						}else
						if(responseText[0].errmsg)
							$('#msgDivCommodity').html('<div class="message_error">'+responseText[0].errmsg+'</div>');
						else
							$('#msgDivCommodity').html('<div class="message_error">Invalid combination of data to satisfy the Tariffs edit condition.</div>');
						

					}
				}
			}
		});
	}
	
	function populateCommodityCodeList(list){
		
		
		
		if(list.length>0){
			if(list.length==1){
			$('#shipmentCommodityCode').val(list[0].code);
			}else{
				$('#shipmentCommodityCode').val("");
			}
		}
	}

	function populateMixCommodityCodeList(list){
		
		
		
		if(list.length>0){
			$('#mixCommodityCommodityCode').val(list[0].code);
		}
		populateMixCommodityCodeListBilling(list);
	}
	
	function setTariffCommodityDecription(itemName){
		
		var blOriginCityCode = $('#blOriginCityCode').val();
		var blDestinationCityCode = $('#blDestinationCityCode').val();
		var originPortCityCode = $('#originPortCityCode').val();
		var destinationPortCityCode = $('#destinationPortCityCode').val();
		var loadSrvc = $("#loadServiceCode").val();
		var dischargeSrvc = $("#dischargeServiceCode").val();
		var trade = "";
		var tariffNo = $("#tariffNumber").val();
		var itemNo = itemName;
		
		var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
		+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
		+'|'+trade+'|'+tariffNo+'|'+itemNo;
		
		$.ajax({
			url: urlComm,
			type: "POST",
			success: function(responseText){
				if(responseText!=null){
					$("#commodityDesc").val(responseText[0].desc);
					
					
					
					if (responseText[0].note== "Y" && $.trim(responseText[0].noterate)!=null && $.trim(responseText[0].noterate)!='') {
						
						$('#note').val("");
					} else {
						
					}
					}}});
	}
	function loadMixedCommodityEquipmentData(responseText){
		 $("#equipmentNumber").get(0).options.length = 0;
		 $.each(responseText.data.freightForm.equipmentNumberList, function(index, equipmentNumberList) {
	            $("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(equipmentNumberList.description, equipmentNumberList.code);
	        });
			
	        var equipmentNumber = responseText.data.freightForm.equipmentId; //$("#containerNumberForDispatch").val();
	        
	        $("#equipmentNumber").val(equipmentNumber);
	        $('#totalEquipment').text(responseText.data.freightForm.totalEquipment);
	        $('#sealNumber').val(responseText.data.freightForm.sealNumber);
	        if(responseText.data.freightForm.overflow=="No" || responseText.data.freightForm.overflow=="N"){
	        	$('#eqpOverflow').val("N");
	        }
	        else if(responseText.data.freightForm.overflow=="Yes" || responseText.data.freightForm.overflow=="Y"){
	        	$('#eqpOverflow').val("Y");
	        }
	        //$('#eqpOverflow').val(responseText.data.freightForm.overflow);
	        $('#shipmentFreightSeqNumber').val(responseText.data.freightForm.shipmentFreightSeqNumber);
	        $('#temperatureEqp').val(responseText.data.freightForm.temperatureEqp);
	        $('#temperatureEqp').val(responseText.data.freightForm.temperature);
	        $('#temperatureCode ').val(responseText.data.freightForm.temperatureCode);
	        $('#eqptType').val(responseText.data.freightForm.eqptType);
	        $('#eqptHeight').text(responseText.data.freightForm.eqptHeight);
	        $('#eqptLength').text(responseText.data.freightForm.eqptLength);
	        $('#prorateCode').text(responseText.data.freightForm.prorateCode);
	        $('#freightEquipmemtDetail').text(responseText.data.freightForm.eqptDetail);
	        $('#shipmentFreightId').val(responseText.data.freightForm.shipmentFreightId);
	        if($('#eqptType').val()!="R" ){
	        	$('#temperatureEqp').attr("disabled",true);
	        	$('select[name="freightForm.temperatureCode"]').attr("disabled",true);
	        	
	        }
	        else{
	        	$('#temperatureEqp').removeAttr("disabled");
	        	$('select[name="freightForm.temperatureCode"]').attr("disabled",false);
	        }
	}
	
	function format_number_long(){
		pnumber = $('#netWeight').val();
		if($("#unitOfMeasureSourceCode").val()=="M") {
		
		decimals=3;
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
		     
		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';
		     
		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        var value = dec.split('.')[1]
		        if(value!=undefined && value != 'undefined' && value != null){
		        	dec = value;
		        }
		        dec = '.'+dec;
		        dec = String(whole + dec);
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		    $('#netWeight').val(result);
		}else{
			  $('#netWeight').val(parseInt(Math.round(pnumber)));
		}	
	}
	

	function format_number_MixCube(){
		pnumber = $('#mixCommCube').val();
		if($("#unitOfMeasureSourceCode").val()=="M") {
		decimals=3;
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
		     
		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';
		     
		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        dec = '.'+dec.split('.')[1];
		        dec = String(whole + dec);
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		    $('#mixCommCube').val(result);
		}else{
			
			getLoadDschServicepairValue();
			if($('#routingLoadDischargePair').val()!=null && $('#routingLoadDischargePair').val().trim()=="AU"){
			if(parseInt(Math.floor(pnumber))=='0'){
				 $('#mixCommCube').val('');
			}else{
			 $('#mixCommCube').val(Math.floor(pnumber));
			}}
			else{
				if(parseInt(Math.ceil(pnumber))=='0'){
					 $('#mixCommCube').val('');
				}else{
				 $('#mixCommCube').val(Math.ceil(pnumber));
				}	
			}
		}
		    
		    
		    
		    
		    
		
	}
	function format_number_MixNetWeight(){
		pnumber = $('#mixCommNetWgt').val();
		if($("#unitOfMeasureSourceCode").val()=="M") {
		decimals=3;
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
		     
		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';
		     
		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        dec = '.'+dec.split('.')[1];
		        dec = String(whole + dec);
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		    $('#mixCommNetWgt').val(result);
		}else{
			if(parseInt(Math.ceil(pnumber))=='0'){
				 $('#mixCommNetWgt').val('');
			}else{
			 $('#mixCommNetWgt').val(Math.ceil(pnumber));
			}	
		}
	}
	function format_number_cube(){
		pnumber = $('#cube').val();
		if($("#unitOfMeasureSourceCode").val()=="M") {
		
		decimals=3;
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
		     
		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';
		     
		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        dec = '.'+dec.split('.')[1];
		        dec = String(whole + dec);
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		    if(result=='0'){
		    	 $('#cube').val('');
		    }else{
		    $('#cube').val(result);
		    }
		}else{
			getLoadDschServicepairValue();
			if($('#routingLoadDischargePair').val()!=null && $('#routingLoadDischargePair').val().trim()=="AU"){
			if(parseInt(Math.floor(pnumber))=='0'){
				 $('#cube').val('');
			}else{
			 $('#cube').val(Math.floor(pnumber));
			}}
			else{
				if(parseInt(Math.ceil(pnumber))=='0'){
					 $('#cube').val('');
				}else{
				 $('#cube').val(Math.ceil(pnumber));
				}	
			}
		}
	}
	
	function commodityCallOnUnitChange(){
	 var queryString = $('#shipmentForm').formSerialize();
	 $.ajax({
		 type:"POST",
		 url:_context+"/shipmentCommodity/loadCommodityByUnit",
		 data :queryString,
		success: function(responseText){
			reloadShipmentCommodityData(responseText);
			$("#commodityGrid").trigger('reloadGrid');
			$("#povGrid").trigger('reloadGrid');
			 $("#convGrid").trigger('reloadGrid');
			 $('#tr_shipmentFreightId').hide();
				if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
			checkClearButton = true;
		}	      
	 });
	 somethingChanged = false;
	}
	
	
	function commodityCallOnAdd(){
		 if($("#validateShipmentCommodityDiv").validationEngine('validate')){
			 if($("#shipmentCommodityHeader").validationEngine('validate')){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/addCommodity",
			 data :queryString,
			success: function(responseText){
				if(responseText.success==true){
				reloadShipmentCommodityData(responseText);
				$("#commodityGrid").trigger('reloadGrid');
				 $('#tr_shipmentFreightId').hide();
				
				 $("#povGrid").trigger('reloadGrid');
				 $("#convGrid").trigger('reloadGrid');
					if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
				   checkClearButton = true;
				   $('#msgDivCommodity').html("");
				   saveBillBeforeBillButton = true;
				   somethingChanged= true;
				   //D025042, For emptying fields in commodity grid when clicked on add btn.
				   //D027432: 	Maintain Bill , commodity Grid multiple container linkage
				   // Commented below code - copy of the values should be avoided in Java where the form is set in session 
				  /* $('#commodityDesc').val("");
					 $('#itemNumber').val("");
					 $('#note').val("");
					 $('#netWeight').val("");
					 $('#piece').val("");
					 $('#kind').val("");
					 $('#cube').val("");
					 $('#containerCommodityDesc').val("");
					 $('#commodityCode').val("");
					 $('#unitOfCommodity')
				     .append($('<option>',{ value : "" })
				     .text(""));
				     	//D025042
					 isAddNew=true;
					 commoditySequenceNumber=$('#unitOfCommodity').val();*/
					 
			}
					showResponseMessages("msgDivCommodity", responseText);
					$('#msgDivCommodity').show();
				}
				
		 }); 
		 }
		 }
	}
	function commodityCallOnNext(){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/loadCommodityByNext",
			 data :queryString,
			success: function(responseText){
			//	D025042
				reloadShipmentCommodityData(responseText);
				//D027432: 	Maintain Bill , commodity Grid multiple container linkage
				 /*if(isAddNew==true && $('#unitOfCommodity').val()==commoditySequenceNumber){
					 $('#commodityDesc').val("");
					 $('#itemNumber').val("");
					 $('#note').val("");
					 $('#netWeight').val("");
					 $('#piece').val("");
					 $('#kind').val("");
					 $('#cube').val("");
					 $('#containerCommodityDesc').val("");
					 $('#commodityCode').val("");
					 
				 }*/
				$("#commodityGrid").trigger('reloadGrid');
				$("#povGrid").trigger('reloadGrid');
				 $("#convGrid").trigger('reloadGrid');
					if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
				 $('#tr_shipmentFreightId').hide();
				checkClearButton = true;
			}	        
		 });
		//}somethingChanged 
		 somethingChanged = false;
	}
	function commodityCallOnPrev(){
		 var queryString = $('#shipmentForm').formSerialize();
			
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/loadCommodityByPrevious",
			 data :queryString,
			success: function(responseText){
				reloadShipmentCommodityData(responseText);
				$("#commodityGrid").trigger('reloadGrid');
				$("#povGrid").trigger('reloadGrid');
				 $("#convGrid").trigger('reloadGrid');
				 $('#tr_shipmentFreightId').hide();
				checkClearButton = true;
				
			}	        
		 });
		 somethingChanged = false;
	}

	function changedMeasurementSource(uom){
	var seq = 0;
	    if($('#unitOfCommodity').val()!="0" || $('#unitOfCommodity').val()!="" || $('#unitOfCommodity').val()!=null){
	    seq = $('#unitOfCommodity').val();

	    }
	     if(seq!=0){
    		 $.ajax({
    			 type:"POST",
    			 async:false,
    			 url:_context+"/shipmentCommodity/convertFreightDimensions",
    			 data :{uom: uom,seq:seq},
    			    success: function(responseText){}


    		 });
    		 }
    	}

	function equipmentCallOnEqpChangeChange(){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/equipmentNumber",
			 data :queryString,
			 success: function(responseText){
				 if(responseText.success== true){
						document.getElementById("blcn").style.display="none";
						document.getElementById("blmx").style.display="block";
					loadMixedCommodityEquipmentData(responseText);
				        $('#mixedCommodityView').val("Commodity View");
				        $("#mixcommodityGrid").trigger('reloadGrid');  
				}	
			 }
	 });
	}
	
	function equipmentCallOnEqpPrevChange(){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/previousEquipment",
			 data :queryString,
			 success: function(responseText){
				 if(responseText.success== true){
						document.getElementById("blcn").style.display="none";
						document.getElementById("blmx").style.display="block";
					loadMixedCommodityEquipmentData(responseText);
					clearMsgDivCommodity();
				        $('#mixedCommodityView').val("Commodity View");
				        $("#mixcommodityGrid").trigger('reloadGrid');     
				}	
			 }
	 });
	}
	
	function equipmentCallOnEqpNextChange(){
		 var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/nextEquipment",
			 data :queryString,
			 success: function(responseText){
				 if(responseText.success== true){
						document.getElementById("blcn").style.display="none";
						document.getElementById("blmx").style.display="block";
				    	loadMixedCommodityEquipmentData(responseText);
				    	clearMsgDivCommodity();
				        $('#mixedCommodityView').val("Commodity View");
				        $("#mixcommodityGrid").trigger('reloadGrid');   
				}	
			 }
	 });
	}
	
	function clearMsgDivCommodity(){
		$('#msgDivCommodity').html("");
	}
	function changeCommodtiySectionOnLdsDscBasis(responseText){
		if(responseText.data.routing.routingLoadDischargePair!=null && responseText.data.routing.routingLoadDischargePair!="" 
			&& responseText.data.routing.routingLoadDischargePair!="null"){
		if(responseText.data.routing.routingLoadDischargePair.trim() =="AU"){
		document.getElementById("forCon2").style.display="none";
		document.getElementById("forCon3").style.display="none";
		document.getElementById("forCon1").style.display="none";
		document.getElementById("forPov1").style.display="block";
		document.getElementById("forPov2").style.display="block";
		document.getElementById("convGridDiv").style.display="none";
		document.getElementById("forPov3").style.display="block";
		document.getElementById("mixCommButton").style.display="none";
		document.getElementById("commodityGridDiv").style.display="none";
		document.getElementById("povGridDiv").style.display="block";
		document.getElementById("forConventional").style.display="none";
		$("#pieceValue").text(responseText.data.shipmentItemForm.cmdLineLink);
		$("#povGrid").trigger('reloadGrid');
		$('#tr_shipmentFreightAutoId').hide();
		
		
		$('#h3BookingPageTitle').html('<h3 class="content-title">Maintain Bill</h3>');
		
		////
		
		origWt=$('#netWeight').val();
		origVol=$('#cube').val();
		if(responseText.data.header.unitOfMeasureSourceCode=="M"){
			document.getElementById("forMetric").style.display="block";
			document.getElementById("forImperial").style.display="none";
			$('#netWeightlabel').html("Wgt-KGS");
			
			//added for rounding off decimal places to 3 for metric units
			var modifiedWtMetric=(Math.round(origWt*1000)/1000).toFixed(3);
			$('#netWeight').val(modifiedWtMetric);
			
			
			$('#cubeLabel').html("Cube(Meters)");
			
			//added for rounding off decimal places to 3 for metric units
			var modifiedVolMetric=(Math.round(origVol*1000)/1000).toFixed(3);
			if(modifiedVolMetric=='0'){
				$('#cube').val('');
			}else{
			$('#cube').val(modifiedVolMetric);
			}
			}
		 
		origWt=$('#netWeight').val();
		origVol=$('#cube').val();
			if(responseText.data.header.unitOfMeasureSourceCode=="I"){
			document.getElementById("forImperial").style.display="block";
			document.getElementById("forMetric").style.display="none";
			$('#netWeightlabel').html("Wgt-LBS");
			
			//added for rounding off decimal places to 0 for imperial units
			var modifiedWtImperial=(Math.round(origWt)).toFixed(0);
			$('#netWeight').val(modifiedWtImperial);
			
			
			$('#cubeLabel').html("Cube(Ft)");
			
			//added for rounding off decimal places to 0 for imperial units
			var modifiedVolImperial=(Math.floor(origVol));
			$('#cube').val(modifiedVolImperial);
			if(modifiedVolImperial=='0'){
				$('#cube').val('');
			}else{
			$('#cube').val(modifiedVolImperial);
			}
			
			}
		
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="CY"){
			if(responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="STANDARD" ||
					responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="HHGDS"){
			document.getElementById("forCon2").style.display="block";
			document.getElementById("forCon1").style.display="block";
			document.getElementById("forCon3").style.display="block";
			document.getElementById("forPov1").style.display="none";
			document.getElementById("forPov2").style.display="none";
			document.getElementById("forPov3").style.display="none";
			document.getElementById("convGridDiv").style.display="none";
			document.getElementById("forConventional").style.display="none";
			
			document.getElementById("mixCommButton").style.display="block";
			document.getElementById("commodityGridDiv").style.display="block";
			document.getElementById("povGridDiv").style.display="none";
			// this is used to hide and show on Basis of Bill type 
			document.getElementById("blcn").style.display="block";
			document.getElementById("blmx").style.display="none";
			$("#commodityGrid").trigger('reloadGrid');
			 $('#mixedCommodityView').val("Mixed Commodity View");
			 $('#tr_shipmentFreightId').hide();
			 $('#h3BookingPageTitle').html('<h3 class="content-title">Maintain Bill</h3>');
			
			}
			else if(responseText.data.header.billType!=null && responseText.data.header.billType.trim()=="MIXED"){
				document.getElementById("forCon2").style.display="none";
				document.getElementById("forCon1").style.display="none";
				document.getElementById("forCon3").style.display="none";
				document.getElementById("forPov1").style.display="none";
				document.getElementById("forPov2").style.display="none";
				document.getElementById("forPov3").style.display="none";
				document.getElementById("povGridDiv").style.display="none";
				document.getElementById("convGridDiv").style.display="none";
				document.getElementById("mixCommButton").style.display="block";
				document.getElementById("commodityGridDiv").style.display="none";
				document.getElementById("forConventional").style.display="none";
				document.getElementById("povGridDiv").style.display="none";
				 $('#mixedCommodityView').val("Commodity View");
				 document.getElementById("blcn").style.display="none";
					document.getElementById("blmx").style.display="block";
					$("#mixcommodityGrid").trigger('reloadGrid');
					$('#tr_unitOfCommodity').hide();
					 $('#h3BookingPageTitle').html('<h3 class="content-title">Maintain Bill</h3>');
					 loadMixedCommodityEquipmentData(responseText);
			}
			origWt=$('#netWeight').val();
			origVol=$('#cube').val();
			if(responseText.data.header.unitOfMeasureSourceCode=="M"){
				document.getElementById("forMetric").style.display="block";
				document.getElementById("forImperial").style.display="none";
				$('#netWeightlabel').html("Wgt-KGS");
				
				//added for rounding off decimal places to 3 for metric units
				var modifiedWtMetric=(Math.round(origWt*1000)/1000).toFixed(3);
				$('#netWeight').val(modifiedWtMetric);
				
				
				$('#cubeLabel').html("Cube(Meters)");
				
				//added for rounding off decimal places to 3 for metric units
				var modifiedVolMetric=(Math.round(origVol*1000)/1000).toFixed(3);
				if(modifiedVolMetric=='0'){
					$('#cube').val('');
				}else{
				$('#cube').val(modifiedVolMetric);
				}
				}
			 
			origWt=$('#netWeight').val();
			origVol=$('#cube').val();
				if(responseText.data.header.unitOfMeasureSourceCode=="I"){
				document.getElementById("forImperial").style.display="block";
				document.getElementById("forMetric").style.display="none";
				$('#netWeightlabel').html("Wgt-LBS");
				
				//added for rounding off decimal places to 0 for imperial units
				var modifiedWtImperial=(Math.round(origWt)).toFixed(0);
				$('#netWeight').val(modifiedWtImperial);
				
				
				$('#cubeLabel').html("Cube(Ft)");
				
				//added for rounding off decimal places to 0 for imperial units
				var modifiedVolImperial=(Math.ceil(origVol));
				$('#cube').val(modifiedVolImperial);
				if(modifiedVolImperial=='0'){
					$('#cube').val('');
				}else{
				$('#cube').val(modifiedVolImperial);
				}
				
				}
			
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="LCL"){
			document.getElementById("forCon2").style.display="block";
			document.getElementById("forCon1").style.display="block";
			document.getElementById("forCon3").style.display="block";
			document.getElementById("forPov1").style.display="none";
			document.getElementById("forPov2").style.display="none";
			document.getElementById("forPov3").style.display="none";
			document.getElementById("convGridDiv").style.display="block";
			
			document.getElementById("mixCommButton").style.display="none";
			document.getElementById("commodityGridDiv").style.display="none";
			document.getElementById("povGridDiv").style.display="none";
			// this is used to hide and show on Basis of Bill type 
			document.getElementById("blcn").style.display="block";
			document.getElementById("blmx").style.display="none";
			// $('#mixedCommodityView').val("Mixed Commodity View");
			document.getElementById("forConventional").style.display="block";
			
			$('#h3BookingPageTitle').html('<h3 class="content-title">Maintain Bill</h3>');
			
			 
			
			
			 if((!(responseText.data.routing.loadServiceCode=="FI" && responseText.data.routing.dischargeServiceCode=="FO"))
					 ||(!(responseText.data.routing.loadServiceCode=="FO" && responseText.data.routing.dischargeServiceCode=="FI"))){
				//document.getElementById("tr_shipmentConvFreightId").style.display="block";
			 }
			 $("#convGrid").trigger('reloadGrid');
			 origWt=$('#netWeight').val();
				origVol=$('#cube').val();
				if(responseText.data.header.unitOfMeasureSourceCode=="M"){
					document.getElementById("forMetric").style.display="block";
					document.getElementById("forImperial").style.display="none";
					$('#netWeightlabel').html("Wgt-KGS");
					
					//added for rounding off decimal places to 3 for metric units
					var modifiedWtMetric=(Math.round(origWt*1000)/1000).toFixed(3);
					$('#netWeight').val(modifiedWtMetric);
					
					
					$('#cubeLabel').html("Cube(Meters)");
					
					//added for rounding off decimal places to 3 for metric units
					var modifiedVolMetric=(Math.round(origVol*1000)/1000).toFixed(3);
					if(modifiedVolMetric=='0'){
						$('#cube').val('');
					}else{
					$('#cube').val(modifiedVolMetric);
					}
					}
				 
				origWt=$('#netWeight').val();
				origVol=$('#cube').val();
					if(responseText.data.header.unitOfMeasureSourceCode=="I"){
					document.getElementById("forImperial").style.display="block";
					document.getElementById("forMetric").style.display="none";
					$('#netWeightlabel').html("Wgt-LBS");
					
					//added for rounding off decimal places to 0 for imperial units
					var modifiedWtImperial=(Math.round(origWt)).toFixed(0);
					$('#netWeight').val(modifiedWtImperial);
					
					
					$('#cubeLabel').html("Cube(Ft)");
					
					//added for rounding off decimal places to 0 for imperial units
					var modifiedVolImperial=(Math.ceil(origVol));
					$('#cube').val(modifiedVolImperial);
					if(modifiedVolImperial=='0'){
						$('#cube').val('');
					}else{
					$('#cube').val(modifiedVolImperial);
					}
					
					}
		
			
		}
		if(responseText.data.routing.routingLoadDischargePair.trim() =="CON"){
			document.getElementById("forCon2").style.display="block";
			document.getElementById("forCon1").style.display="block";
			document.getElementById("forCon3").style.display="block";
			document.getElementById("forPov1").style.display="none";
			document.getElementById("forPov2").style.display="none";
			document.getElementById("forPov3").style.display="none";
			document.getElementById("convGridDiv").style.display="block";
			
			document.getElementById("mixCommButton").style.display="none";
			document.getElementById("commodityGridDiv").style.display="none";
			document.getElementById("povGridDiv").style.display="none";
			// this is used to hide and show on Basis of Bill type 
			document.getElementById("blcn").style.display="block";
			document.getElementById("blmx").style.display="none";
			// $('#mixedCommodityView').val("Mixed Commodity View");
			document.getElementById("forConventional").style.display="block";
			
			$('#h3BookingPageTitle').html('<h3 class="content-title">Maintain Bill</h3>');
			
			 
			
			
			 if((!(responseText.data.routing.loadServiceCode=="FI" && responseText.data.routing.dischargeServiceCode=="FO"))
					 ||(!(responseText.data.routing.loadServiceCode=="FO" && responseText.data.routing.dischargeServiceCode=="FI"))){
				//document.getElementById("tr_shipmentConvFreightId").style.display="block";
			 }
			 $("#convGrid").trigger('reloadGrid');
			 origWt=$('#netWeight').val();
				origVol=$('#cube').val();
				if(responseText.data.header.unitOfMeasureSourceCode=="M"){
					document.getElementById("forMetric").style.display="block";
					document.getElementById("forImperial").style.display="none";
					$('#netWeightlabel').html("Wgt-KGS");
					
					//added for rounding off decimal places to 3 for metric units
					var modifiedWtMetric=(Math.round(origWt*1000)/1000).toFixed(3);
					$('#netWeight').val(modifiedWtMetric);
					
					
					$('#cubeLabel').html("Cube(Meters)");
					
					//added for rounding off decimal places to 3 for metric units
					var modifiedVolMetric=(Math.round(origVol*1000)/1000).toFixed(3);
					if(modifiedVolMetric=='0'){
						$('#cube').val('');
					}else{
					$('#cube').val(modifiedVolMetric);
					}
					}
				 
				origWt=$('#netWeight').val();
				origVol=$('#cube').val();
					if(responseText.data.header.unitOfMeasureSourceCode=="I"){
					document.getElementById("forImperial").style.display="block";
					document.getElementById("forMetric").style.display="none";
					$('#netWeightlabel').html("Wgt-LBS");
					
					//added for rounding off decimal places to 0 for imperial units
					var modifiedWtImperial=(Math.round(origWt)).toFixed(0);
					$('#netWeight').val(modifiedWtImperial);
					
					
					$('#cubeLabel').html("Cube(Ft)");
					
					//added for rounding off decimal places to 0 for imperial units
					var modifiedVolImperial=(Math.ceil(origVol));
					$('#cube').val(modifiedVolImperial);
					if(modifiedVolImperial=='0'){
						$('#cube').val('');
					}else{
					$('#cube').val(modifiedVolImperial);
					}
					
					}
		}
		}
		
	}
	
	function checkKind(){
		var a = $('#mixCommKind').val();
		//console.log("checkKind "+a);
		if(a == null || a.length == 0 || a.match("^[a-zA-Z '].*$")) {
			return true;
			
		}
		alert("Letters only for Kind");
		return false;
	}	

	function checkForPositiveNumberNetWeight(){
		var a = $('#mixCommNetWgt').val();
		if(isNaN(a)){alert("Only Positive Number allowed for Net weight");return false;}
		a=Number(a);
		if(a<0){alert("Only Positive Number allowed for Net weight");return false;}
		return true;
	}	
	
	function checkForPositiveNumberCube(){
		var a = $('#mixCommCube').val();
		if(isNaN(a)){alert("Only Positive Number allowed for Cube");return false;}
		a=Number(a);
		if(a<0){alert("Only Positive Number allowed for Cube");return false;}
		return true;
	}
	
	function checkForTotalCube(){
	//D030066
		var isOldHHgds = "NO";
		if(createUser != null && createUser != 'undefined' && createUser.trim() != "" &&
			$("#billType").val()!=null && $("#billType").val()!="" && $("#billType").val()!='undefined' 
			&& $("#billType").val()=="HHGDS" && createUser.trim().charAt(0)=="$"){
			isOldHHgds = "YES";
		}
		if($('#totalCube').val()=="" || Number($('#totalCube').val())==0){
			return true;
		}else{
			if(isOldHHgds == "YES"){
			if(Number($('#mixCommCube').val())>Number($('#totalCube').val())){
				//alert( "Commodity line cubic feet exceeds total cube set on BLHD.");
				$('#msgDivCommodityOverlay').html('<div class="message_error">Commodity line cubic feet exceeds total cube set on Bill Header.</div>');
				return false;
			}
			}
		}
		return true;
	}
	function checkForPositiveNumberPieces(){
		var a = $('#mixCommPieces').val();
		if(isNaN(a)){alert("Only Positive Whole Number allowed for Pieces");return false;}
		a=Number(a);
		if(a<0){alert("Only Positive Whole Number allowed for Pieces");return false;}
		var snum = new String(a);
	    var sec = snum.split('.');
	    if(Number(sec.length)>1){
	    	alert("Only Positive Whole Number allowed for Pieces");return false;
	    }
		return true;
	}
	
	function dimensionFieldSetUp(responseText){
		$("#shipmentItemImperialLengthFeet").val(responseText.data.shipmentItemForm.imperialLengthFeet);
		$("#shipmentItemImperialLengthInches").val(responseText.data.shipmentItemForm.imperialLengthInches);
		$("#shipmentItemImperialBreathFeet").val(responseText.data.shipmentItemForm.imperialBreathFeet);
		$("#imperialBreathInches").val(responseText.data.shipmentItemForm.imperialBreathInches);
		$("#shipmentItemImperialHeightFeet").val(responseText.data.shipmentItemForm.imperialHeightFeet);
		$("#shipmentItemImperialHeightInches").val(responseText.data.shipmentItemForm.imperialHeightInches);
		$("#shipmentItemMetricLength").val(responseText.data.shipmentItemForm.metricLength);
		$("#shipmentItemMetricBreadth").val(responseText.data.shipmentItemForm.metricBreadth);
		$("#shipmentItemMetricHeight").val(responseText.data.shipmentItemForm.metricHeight);
				
	}
	function validateTrfCmdDesc(){
		if($.trim($('#commodityDesc').val())==''){
			$('#commodityDesc').val(($('#commodityDesc').val()));
		}
		else if($("#commodityDesc").val().length > 30) {
			 return "* Tariff Commodity Desc can't be more than 30. At present, the length is "+ $("#commodityDesc").val().length +".";
		}
	}
	function clearErrMsg(){
		$("#maintain_commodity_shipment").validationEngine('hideAll');
	}
	function validateItem(){
		 if($("#itemNumber").val().trim().length > 8) {
			 return "* Tariff Item can't be more than 8 in length. At present, the length is "+ $("#itemNumber").val().trim().length + ".";
		}
	}
	
	function validateTariffCode(isValid){
		
		 if(($("#tariffNumber").val()=="")&& ($('#itemNumber').val!="") && $('#mixedCommodityView').val()=="Mixed Commodity View") {
			 openCommodityDivBlock();
			 $('input[name="header.tariffNumber"]').validationEngine('showPrompt', '*Tariff is mandatory', 'error', 'topRight', true);
			 isValid = false;
				return isValid;
		} else  if($('#tariffNumber').val() != $('#tariffCheck').val()  ) {
			 openCommodityDivBlock();
			 $('input[name="header.tariffNumber"]').validationEngine('showPrompt', 'Tariff did not load correctly, please re-enter', 'error', 'topRight', true);
			 isValid = false;
			 return isValid;
		}else{
			
			return isValid;
		}
	}
	// Setting mandatory fields for Tariff Commodity Description
	function setMandatoryTariffCmdDesc(){
			// Tariff Commodity Desc
			//$("#tariffCmdDescLbl").html("Tariff Commodity Desc<span class=\"mandatory\">*</span>");
			$("#commodityDesc").addClass("validate[required]");
			
			setMandatoryTariffItem();
			
			// Commodity Code
			//$("#commodityCodeLbl").html("Com. Code<span class=\"mandatory\">*</span>");
		//	$("#commodityCode").addClass("validate[required]");
	}

	function resetMandatoryTariffCmdDesc(){
		// Tariff Commodity Desc
		$("#tariffCmdDescLbl").html("Tariff Commodity Desc");
		$("#tariffCommodityDescription").removeClass("validate[required]");
		
		resetMandatoryTariffItem();
		
		// Commodity Code
		//$("#commodityCodeLbl").html("Com. Code");
		//$("#commodityCode").removeClass("validate[required]");
	}
	function resetMandatoryTariffCmdDescMixedComm(){
		// Tariff Commodity Desc
		$("#mixedCommodityDescLabel").html("Tariff Commodity Desc");
		$("#mixedCommodityDescLabel").removeClass("validate[required]");
		
	//	resetMandatoryTariffItem();
	}
	function setMandatoryTariffItem(){
		// Tariff
		//$("#tariffLbl").html("Tariff<span class=\"mandatory\">*</span>");
		$("#tariffNumber").addClass("validate[required]");
		
		// Item
	//	$("#itemLbl").html("Item<span class=\"mandatory\">*</span>");
		$("#itemNumber").addClass("validate[required]");
	}
	function setMandatoryTariffItemMixedComm(){
		// Tariff
		//$("#tariffLbl").html("Tariff<span class=\"mandatory\">*</span>");
		$("#tariffNumber").addClass("validate[required]");
		
		// Item
	//	$("#itemLbl").html("Item<span class=\"mandatory\">*</span>");
		$("#mixedCommItemLabel").addClass("validate[required]");
	}
	
	function setMandatoryTariffItemForMixedComm(){
		// Tariff
		//$("#tariffLbl").html("Tariff<span class=\"mandatory\">*</span>");
		$("#tariffNumber").addClass("validate[required]");
		
		// Item
	//	$("#itemLbl").html("Item<span class=\"mandatory\">*</span>");
		$("#itemNumber").addClass("validate[required]");
	}

	function resetMandatoryTariffItem(){
		// Tariff
	//	$("#tariffLbl").html("Tariff");
		$("#tariffNumber").removeClass("validate[required]");
		
		// Item
		//$("#itemLbl").html("Item");
		$("#itemNumber").removeClass("validate[required]");
	}
	function validateTotalCube(){
		var isOldHHgds = "NO";
		if(createUser != null &&  createUser != 'undefined' && createUser.trim() != "" &&
			$("#billType").val()!=null && $("#billType").val()!="" && $("#billType").val()!='undefined' 
			&& $("#billType").val()=="HHGDS" && createUser.trim().charAt(0)=="$"){
			isOldHHgds = "YES";
		}
		if($('#totalCube').val()=="" || Number($('#totalCube').val())==0){
			
		}else{
			if(isOldHHgds == "YES" && Number($('#cube').val())>Number($('#totalCube').val())){
				 return "* Commodity line cubic feet exceeds total cube set on Bill Header ";
			}
		}
	}
	
	
	function validateNetWeight(){
		
	}
	
	function reloadCommoditySectionButtons(responseText){
		var unitOfCommodity = Number($("#unitOfCommodity option:selected").text());
		var commodityLine = Number(responseText.data.shipmentItemForm.commodityLine);
		if((unitOfCommodity == commodityLine) && (commodityLine ==1)){
			$('#previousCommodity').attr("disabled","disabled");
			$('#nextCommodity').attr("disabled","disabled");
		}else if((unitOfCommodity == commodityLine) && (commodityLine ==0)){
			$('#previousCommodity').attr("disabled","disabled");
			$('#nextCommodity').attr("disabled","disabled");
			$('#clearCommodity').attr("disabled","disabled");
			$('#deleteCommodity').attr("disabled","disabled");
			$('#updateCommodity').attr("disabled","disabled");
			
		}else if(unitOfCommodity == commodityLine){
			$('#nextCommodity').attr("disabled","disabled");
			$('#previousCommodity').attr("disabled",false);
		}else if(unitOfCommodity==1){
			$('#previousCommodity').attr("disabled","disabled");
			$('#nextCommodity').attr("disabled",false);
		}else{
			$('#nextCommodity').attr("disabled",false);
			$('#previousCommodity').attr("disabled",false);
		}
	
		
	}
	
	function reloadMixedCommodityData(){
		var queryString = $('#shipmentForm').formSerialize();
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/loadEquipmentDetail",
			 data :queryString,
			success: function(responseText){
				
				if(responseText.success== true){
					document.getElementById("blcn").style.display="none";
					document.getElementById("blmx").style.display="block";
				loadMixedCommodityEquipmentData(responseText);
			        $('#mixedCommodityView').val("Commodity View");
			        $("#mixcommodityGrid").trigger('reloadGrid'); 
			        $('#tr_shipmentItemId').hide();
			}	
			}
		 });
	}
	
	function removeMandatoryCheck(){
		var commodityLine = $('#commodityLine').text();
		//D024736: Fields are not mandatory when tariffNumber and itemNumber are not added
		if(Number(commodityLine)==0 || ($('#tariffNumber').val() =="" && $('#itemNumber').val() =="")){
			$('#commodityDesc').removeClass('validate[required]');
			$('#netWeight').removeClass('validate[required]');
			
		}else{
			$('#commodityDesc').addClass('validate[required]');
			$('#netWeight').addClass('validate[required]');	
		}
	}
	
	function clearTariffItemOnChangeOfTariff(){
		// D025030, clear items
		window.itemList = null;
		$.ajax({
			async:false,
			 type:"GET",
			 url:_context+"/shipmentCommodity/clearItem",
			success: function(responseText){
			}
		
			});
	}
	
	
	function validateShipmentCommodityFieldsOnSave(){
		var isValid = true;
		if($('#mixedCommodityView').val()=="Mixed Commodity View" || $('#mixedCommodityView').val() ==""){
			
			if($('input[name="shipmentItemForm.commodityDesc"]').val()=='' || $('input[name="shipmentItemForm.commodityDesc"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.commodityDesc"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}
			
			
			isValid = validateTariffCode(isValid);
			if(!isValid){
			
			return isValid;
			}
			if($('input[name="shipmentItemForm.note"]').val()!='' && $('input[name="shipmentItemForm.note"]').val()!=null){
				var val = $('#note').val();
				var charRegex = /^[0-9a-zA-Z\ \'\&]+$/; 
				if(!charRegex.test($.trim(val))){
			
				openCommodityDivBlock();
				isValid = false;
				$('input[name="shipmentItemForm.note"]').validationEngine('showPrompt', 'validNoteNumber.', 'error', 'topRight', true);
				return isValid;
				}
			}
			if($('input[name="shipmentItemForm.netWeight"]').val()=='' || $('input[name="shipmentItemForm.netWeight"]').val()==null){
				openCommodityDivBlock();
				isValid = false;
				$('input[name="shipmentItemForm.netWeight"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
				return isValid;
			}
			if($('input[name="shipmentItemForm.netWeight"]').val()!='' || $('input[name="shipmentItemForm.netWeight"]').val()!=null){
				if(isNaN($('input[name="shipmentItemForm.netWeight"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.netWeight"]').validationEngine('showPrompt', 'Only Decimal Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.netWeight"]').val()*1 <1){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.netWeight"]').validationEngine('showPrompt', 'Minimum allowed value is 1', 'error', 'topRight', true);
						return isValid;
						}else if($('input[name="shipmentItemForm.netWeight"]').val()*1 >9999999.999){
							openCommodityDivBlock();
							isValid = false;
							$('input[name="shipmentItemForm.netWeight"]').validationEngine('showPrompt', 'Maximum allowed value is 9999999.999', 'error', 'topRight', true);
							return isValid;
							}
					}
			
			if($('input[name="shipmentItemForm.cube"]').val()!='' || $('input[name="shipmentItemForm.cube"]').val()!=null || $('input[name="shipmentItemForm.cube"]').val()!='0'){
				if(isNaN($('input[name="shipmentItemForm.cube"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.cube"]').validationEngine('showPrompt', 'Only Decimal Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.cube"]').val()*1 >9999999.999){
						openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.cube"]').validationEngine('showPrompt', 'Maximum allowed value is 9999999.999', 'error', 'topRight', true);
					return isValid;
					}
				}
			
			if(($('#piece').val()!="" || $('#piece').val()!=null)){
				if(isNaN($('#piece').val())){
				openCommodityDivBlock();
				isValid = false;
				$('input[name="shipmentItemForm.piece"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
				return isValid;
			}
				else if($('#piece').val().split('.').length>1){
				isValid = false;
				openCommodityDivBlock();
				$('input[name="shipmentItemForm.piece"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
				return isValid;
			}else if($('#piece').val()<0){
				isValid = false;
				openCommodityDivBlock();
				$('input[name="shipmentItemForm.piece"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
				return isValid;
			}
			
		}
			
		if($('#loadDschServiceGroupCode').val()=="CON" || $('#loadDschServiceGroupCode').val()=="LCL"){
				
			if($('#unitOfMeasureSourceCode').val()=="I"){
				
				/*if($('input[name="shipmentItemForm.imperialLengthFeet"]').val()=='' || $('input[name="shipmentItemForm.imperialLengthFeet"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialLengthFeet"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else*/ if(isNaN($('input[name="shipmentItemForm.imperialLengthFeet"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialLengthFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialLengthFeet"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialLengthFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialLengthFeet"]').val()*1>100.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialLengthFeet"]').validationEngine('showPrompt', 'Maximum allowed value is 100', 'error', 'topRight', true);
						return isValid;
						
					}
				
				//commented against D021774
				/*if($('input[name="shipmentItemForm.imperialLengthInches"]').val()=='' || $('input[name="shipmentItemForm.imperialLengthInches"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialLengthInches"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else */if(isNaN($('input[name="shipmentItemForm.imperialLengthInches"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialLengthInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialLengthInches"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialLengthInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialLengthInches"]').val()*1>11.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialLengthInches"]').validationEngine('showPrompt', 'Maximum allowed value is 11', 'error', 'topRight', true);
						return isValid;
						
					}
				
				
			/*	if($('input[name="shipmentItemForm.imperialBreathFeet"]').val()=='' || $('input[name="shipmentItemForm.imperialBreathFeet"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialBreathFeet"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else*/ if(isNaN($('input[name="shipmentItemForm.imperialBreathFeet"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialBreathFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialBreathFeet"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialBreathFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialBreathFeet"]').val()*1>50.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialBreathFeet"]').validationEngine('showPrompt', 'Maximum allowed value is 50', 'error', 'topRight', true);
						return isValid;
						
					}
				
				
				//commented against D021774
				/*if($('input[name="shipmentItemForm.imperialBreathInches"]').val()=='' || $('input[name="shipmentItemForm.imperialBreathInches"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialBreathInches"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else*/ if(isNaN($('input[name="shipmentItemForm.imperialBreathInches"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialBreathInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialBreathInches"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialBreathInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialBreathInches"]').val()*1>11.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialBreathInches"]').validationEngine('showPrompt', 'Maximum allowed value is 11', 'error', 'topRight', true);
						return isValid;
						
					}
				
				
				/*if($('input[name="shipmentItemForm.imperialHeightFeet"]').val()=='' || $('input[name="shipmentItemForm.imperialHeightFeet"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialHeightFeet"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else*/ if(isNaN($('input[name="shipmentItemForm.imperialHeightFeet"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialHeightFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialHeightFeet"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialHeightFeet"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialHeightFeet"]').val()*1>30.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialHeightFeet"]').validationEngine('showPrompt', 'Maximum allowed value is 30', 'error', 'topRight', true);
						return isValid;
						
					}
				
				//commented against D021774
				/*if($('input[name="shipmentItemForm.imperialHeightInches"]').val()=='' || $('input[name="shipmentItemForm.imperialHeightInches"]').val()==null){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialHeightInches"]').validationEngine('showPrompt', 'This field is required.', 'error', 'topRight', true);
					return isValid;
				}else */if(isNaN($('input[name="shipmentItemForm.imperialHeightInches"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.imperialHeightInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.imperialHeightInches"]').val().split('.').length>1){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.imperialHeightInches"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
						return isValid;
					}else if($('input[name="shipmentItemForm.imperialHeightInches"]').val()*1>11.00){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.imperialHeightInches"]').validationEngine('showPrompt', 'Maximum allowed value is 11', 'error', 'topRight', true);
						return isValid;
						
					}
				
			}else if($('#unitOfMeasureSourceCode').val()=="M"){
				
			 if(isNaN($('input[name="shipmentItemForm.metricLength"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.metricLength"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.metricLength"]').val()<0){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.metricLength"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
						return isValid;
					}
					else if($('input[name="shipmentItemForm.metricLength"]').val()*1>30.480){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.metricLength"]').validationEngine('showPrompt', 'Maximum allowed value is 30.480', 'error', 'topRight', true);
						return isValid;
						
					}
				
			 if(isNaN($('input[name="shipmentItemForm.metricBreadth"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.metricBreadth"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.metricBreadth"]').val()<0){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.metricBreadth"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
						return isValid;
					}
					else if($('input[name="shipmentItemForm.metricBreadth"]').val()*1>15.240){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="sshipmentItemForm.metricBreadth"]').validationEngine('showPrompt', 'Maximum allowed value is 15.240', 'error', 'topRight', true);
						return isValid;
						
					}
			 
			 if(isNaN($('input[name="shipmentItemForm.metricHeight"]').val())){
					openCommodityDivBlock();
					isValid = false;
					$('input[name="shipmentItemForm.metricHeight"]').validationEngine('showPrompt', 'Only Number allowed.', 'error', 'topRight', true);
					return isValid;
					}else if($('input[name="shipmentItemForm.metricHeight"]').val()<0){
						isValid = false;
						openCommodityDivBlock();
						$('input[name="shipmentItemForm.metricHeight"]').validationEngine('showPrompt', 'Only Positve Number allowed.', 'error', 'topRight', true);
						return isValid;
					}
					else if($('input[name="shipmentItemForm.metricHeight"]').val()*1>9.144){
						openCommodityDivBlock();
						isValid = false;
						$('input[name="shipmentItemForm.metricHeight"]').validationEngine('showPrompt', 'Maximum allowed value is 9.144', 'error', 'topRight', true);
						return isValid;
						
					}
				
				
			}
				
				
				
			}
		return isValid;
		
	}
		return isValid;
	}
	
	
	function openCommodityDivBlock(){
		document.getElementById('maintain_commodity_shipment').style.display="block";
		var position = $('#maintain_commodity_shipment').position();
		
		window.scrollTo(position.left, position.top);
	}
	
	
	function expandShipmentCommoditySection(){
		var position = $($('#shipmentCommodityHeader').parent().parent()).position();
		 window.scrollTo(position.left, position.top);
		 $('#maintain_commodity_shipment').attr('style','display:block');
		 $('#maintain_commodity_shipment').addClass('ui-accordion-content-active');
		 
		 $('#maintain_commodity_shipment').parent()
		 	.find('h3')
		      .removeClass('ui-state-default').removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top')
		 	.find('span')
		 		.removeClass('ui-icon-triangle-1-e').addClass('ui-icon-triangle-1-s');
		 
		/* $('.shipment-section').click(function() {
				$(this).accordion('option', 'active', true);
			});*/
		 
		
	}
	
	function updateCommodityBeforeSave(){
		console.log('updateCommodtyBeforeSave')
		//console.log('update commodity before save');
		 var queryCommodityString = $('#shipmentForm').formSerialize();
			// if(buttonAction == true){
		 
		
		
				 
	     if($('#mixedCommodityView').val()=="Commodity View" && somethingChangedMixComm == true)
				 {
				 var queryString = $('#shipmentForm').formSerialize();
					
				 $.ajax({
					 type:"POST",
					 url:_context+"/shipmentCommodity/updateEquipment",
					 data :queryString,
					 success: function(responseText){
						 if(responseText.success== true){

						   saveShipment();
						   somethingChanged = false;
						   somethingChangedMixComm = false;
						   expandShipmentCommoditySection();
						}
						 else{
							 document.getElementById("msgDivCommodity").style.display="block";
							 showResponseMessages("msgDivCommodity",responseText);
							 }
						 $.unblockUI();
						 }
					 
			 });

			
				 }else if( somethingChanged== true){
			 
			 //console.log("somethingChanged" + somethingChanged);
						checkForNoteValidation();
						 
				 }else{
					 saveShipment(); 
					 somethingChanged = false;
					   somethingChangedMixComm = false;
					   
				 }
		 
		
	}
	
	
	
	function onNoteValidateSuccessShmtSave(){
		//console.log('onNoteValidateSuccessShmtSave');
		 var queryString = $('#shipmentForm').formSerialize();

		 if($('#unitOfCommodity').val()=="0" || $('#unitOfCommodity').val()=="" || $('#unitOfCommodity').val()==null){
			 
			
			 $.ajax({
				 type:"POST",
				 url:_context+"/shipmentCommodity/addCommodity",
				 data :queryString,
				success: function(responseText){
					if(responseText.success==true){
						
						 saveShipment();
						 somethingChanged = false;
						   somethingChangedMixComm = false;
						   expandShipmentCommoditySection();
				}
					else{
						showResponseMessages("msgDivCommodity", responseText);
						}
					//$.unblockUI();
					}
					
			 }); 
			 
		 }else{
		 $.ajax({
			// async:false,
			 type:"POST",
			 url:_context+"/shipmentCommodity/updateCommodity",
			 data :queryString,
			success: function(responseText){
				if(responseText.success==true){
				//reloadShipmentCommodityData(responseText);upadated against the defect 21244
				 saveShipment();
				 somethingChanged = false;
				   somethingChangedMixComm = false;
				   expandShipmentCommoditySection();
			}
				else{
					openCommodityDivBlock();
					showResponseMessages("msgDivCommodity", responseText);
				}
				//$.unblockUI();
			}	        
		 });
	 }

	}
	function updateCommodityBeforeSaveForBillButton(){
		
		//console.log('updateCommodityBeforeSaveForBillButton');
		 var queryCommodityString = $('#shipmentForm').formSerialize();
			// if(buttonAction == true){
		 
		 if($('#mixedCommodityView').val()=="Commodity View" && somethingChangedMixComm == true)
		 {
		 var queryString = $('#shipmentForm').formSerialize();
			
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/updateEquipment",
			 data :queryString,
			 success: function(responseText){
				 if(responseText.success== true){

					 saveShipment();
				   somethingChanged = false;
				        
				}
				 else{
					 document.getElementById("msgDivCommodity").style.display="block";
					 showResponseMessages("msgDivCommodity",responseText);
					 }
				 }
			 
	 });
		 
		 
		 
		 
		 
		 }else if(somethingChanged== true){
			 if($('#unitOfCommodity').val()=="0" || $('#unitOfCommodity').val()==""){
				 
				 var queryString = $('#shipmentForm').formSerialize();
				 $.ajax({
					 type:"POST",
					 url:_context+"/shipmentCommodity/addCommodity",
					 data :queryString,
					success: function(responseText){
						if(responseText.success==true){
							callBillActionAfterSave = true;
							//D032676: 	GATES Performance - Maintain Bill - Bill Button - Merge save and rateBill transactions into one server call 
							//saveShipmentForBillButton();
							rateBill();
							somethingChanged = false;
					}
						else{
							$.unblockUI();
							showResponseMessages("msgDivCommodity", responseText);
							
							}
						}
						
				 }); 
				 
			 }else{
			 $.ajax({
				 //async:false,//removed so that block UI image loads 1st(before this ajax call)
				 type:"POST",
				 url:_context+"/shipmentCommodity/updateCommodity",
				 data :queryCommodityString,
				success: function(responseText){
					if(responseText.success==true){
					//reloadShipmentCommodityData(responseText);upadated against the defect 21244
						callBillActionAfterSave = true;
					 //D032676: 	GATES Performance - Maintain Bill - Bill Button - Merge save and rateBill transactions into one server call 
					 //saveShipmentForBillButton();
						rateBill();
				}
					else{
						openCommodityDivBlock();
						$.unblockUI();
						showResponseMessages("msgDivCommodity", responseText);
					}
				}	        
			 });
		 }
		 }else{
			 callBillActionAfterSave = true;
			 //D032676: 	GATES Performance - Maintain Bill - Bill Button - Merge save and rateBill transactions into one server call 
			 //saveShipmentForBillButton();
			 rateBill();
			   somethingChanged = false;
		 }
		
		
	}
	
	
	function  updateCommodity(){
		//console.log('update commodity');
		 var queryString = $('#shipmentForm').formSerialize();
			// if(buttonAction == true){
			 $.ajax({
				 type:"POST",
				 url:_context+"/shipmentCommodity/updateCommodity",
				 data :queryString,
				success: function(responseText){
					if(responseText.success==true){
					reloadShipmentCommodityData(responseText);
					fetchCommodityCodeList($("#tariffNumber").val(),$("#itemNumber").val(),null,false,null);
					
					//updateUnitValues();
					//recalculateCube();
					//alert("Successfully Updated");
					showResponseMessages("msgDivCommodity", responseText);
					}
					else{
						showResponseMessages("msgDivCommodity", responseText);
					}
					$('#msgDivCommodity').show();
					$.unblockUI();
				}	        
			 });
			
	}
	function updateUnitValues(){
		 if($('#unitOfMeasureSourceCode').val()=="I"){
			 $('#cube').val(tempImperialCubeValue);
			 $('#netWeight').val(tempImperialWeightValue);
		 }
	}
	
	
	function recalculateCube(){
		cubeChanged=true;
		var oldCube = $('#cube').val();
		if($('#unitOfMeasureSourceCode').val()=="I"){
			
			var impLenFeet = resolveSpaces("shipmentItemImperialLengthFeet");
			var impLenInc =  resolveSpaces("shipmentItemImperialLengthInches");
				//against D021774
			var impLen  =  parseInt(impLenFeet*12) + parseInt(impLenInc);
			
			var impBreFeet = resolveSpaces("shipmentItemImperialBreathFeet");
			var impBreInc =  resolveSpaces("imperialBreathInches");

			var impBre  =  parseInt(impBreFeet*12) + parseInt(impBreInc);
			
			var impHeiFeet = resolveSpaces("shipmentItemImperialHeightFeet");
			var impHeiInc =  resolveSpaces("shipmentItemImperialHeightInches");
	
			var impHei  =  parseInt(impHeiFeet*12) + parseInt(impHeiInc);
			
			var cubeFeets  = impLen * impBre *  impHei;
			if(Math.round(cubeFeets/(12 * 12 * 12)) =='0'){
				$('#cube').val(oldCube); // removed inside quotes  for D026160 defect  //D025036
			}else{
				if(isNaN(Math.round(cubeFeets/(12 * 12 * 12)))){
					$('#cube').val(oldCube); // D025036
				}else{										
					var pieces = $('#piece').val();					
					var piecesInt = resolveSpaces("piece");//parseInt(pieces);
					if(piecesInt == 0){
						piecesInt = 1;
						 $('#piece').val("1");	
					}
					$('#cube').val(piecesInt*Math.round(cubeFeets/(12 * 12 * 12)));				
				}
			}
			
		}else if($('#unitOfMeasureSourceCode').val()=="M"){
			
			var metLen = $.trim($('#shipmentItemMetricLength').val());
			var metBre = $.trim($('#shipmentItemMetricBreadth').val());
			var metHei = $.trim($('#shipmentItemMetricHeight').val());
			var pieces = $.trim($('#piece').val());
			if(metLen == "")
				metLen = 0;
			if(metBre == "")
				metBre = 0;
			if(metHei == "")
				metHei = 0;
			if(pieces == "")
				pieces = 0;
			if(metLen != 0 && metBre != 0 && metHei != 0 & pieces != 0 ){
				if(parseFloat(pieces)* parseFloat(metLen)* parseFloat(metBre)* parseFloat(metHei)>0){
					$('#cube').val((Math.round((parseFloat(pieces)* parseFloat(metLen)* parseFloat(metBre)* parseFloat(metHei))*1000)/1000).toFixed(3));
				}
			}else
				$('#cube').val(oldCube);
		}
		
	}
	
	
	
	function getLoadDschServicepairValue(){
		
		var loadServiceCode = $('#loadServiceCode').val();
		var dschServiceCode = $('#dischargeServiceCode').val();
		
		$.ajax({
		    async:false,
			url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dschServiceCode,
			success: function(responseText){
				if(responseText.data.loadDschServiceGroupCode!=null){
				$('#routingLoadDischargePair').val(responseText.data.loadDschServiceGroupCode);
				
				};
		
	}
		});
		}
	function validateWeightUOM(){
		if($('#unitOfMeasureSourceCode').val()=="I"){
			if($('#netWeight').val()>9999999){
			 return "* Maximum Allowed value is 9999999";
			}
			/*else if($('#netWeight').val()<1){
				 return "* Minimum value is 1";
				}*/
		}else{
			if($('#netWeight').val()>9999999.999){
			return "* Maximum Allowed value is 9999999.999";
			}
			else if($('#netWeight').val()<0.001){
				 return "* Minimum value is 0.001";
			}
		}
		
		
	}
	function validateCubeUOM(){
			if($('#unitOfMeasureSourceCode').val()=="I"){
				if($('#cube').val()>99999999){
				 return "* Maximum Allowed value is 99999999";
				}
			}else if($('#cube').val()>99999999.999){
				return "* Maximum Allowed value is 99999999.999";
			}
		
	}
	
	var lengthInExcess=0;
	var breadthInExcess=0;
	var heightInExcess=0;
	function setLengthBreathHeight(){
		
		if($('#unitOfMeasureSourceCode').val()=="M"){
			/*var length = (resolveSpaces("shipmentItemImperialLengthFeet")*0.3048 + resolveSpaces("shipmentItemImperialLengthInches")*0.0254).toFixed(3);
			var breadth = (resolveSpaces("shipmentItemImperialBreathFeet")*0.3048 + resolveSpaces("imperialBreathInches")*0.0254).toFixed(3);
			var height = (resolveSpaces("shipmentItemImperialHeightFeet")*0.3048 + resolveSpaces("shipmentItemImperialHeightInches")*0.0254).toFixed(3);*/
			//alert("Length:"+$('#shipmentItemImperialLengthFeet').val()+"*0.3048+"+$('#shipmentItemImperialLengthInches').val()+"*0.0254 +"+lengthInExcess);
			console.log("For UOM=M Length:"+$('#shipmentItemImperialLengthFeet').val()+"*0.3048+"+$('#shipmentItemImperialLengthInches').val()+"*0.0254 +"+lengthInExcess);
			var length=((($('#shipmentItemImperialLengthFeet').val()*0.3048+  $('#shipmentItemImperialLengthInches').val()*0.0254 +lengthInExcess)*1000)/1000).toFixed(3);
			$('#shipmentItemMetricLength').val(length);
			console.log("breadth:"+$('#shipmentItemImperialBreathFeet').val()+"*0.3048+"+$('#imperialBreathInches').val()+"*0.0254 +"+breadthInExcess);
			var breadth=((($('#shipmentItemImperialBreathFeet').val()*0.3048+  $('#imperialBreathInches').val()*0.0254+ breadthInExcess)*1000)/1000).toFixed(3);
			$('#shipmentItemMetricBreadth').val(breadth);
			console.log("height:"+$('#shipmentItemImperialHeightFeet').val()+"*0.3048+"+$('#shipmentItemImperialHeightInches').val()+"*0.0254 +"+heightInExcess);
			var height=((($('#shipmentItemImperialHeightFeet').val()*0.3048+  $('#shipmentItemImperialHeightInches').val()*0.0254 +heightInExcess)*1000)/1000).toFixed(3);
			$('#shipmentItemMetricHeight').val(height);
			
		}
		if($('#unitOfMeasureSourceCode').val()=="I"){
			
			
			
			var length=$('#shipmentItemMetricLength').val();
			if(length>0){
			inches_totalLength = (39.3701 * length);
			feetLength = parseInt(inches_totalLength / 12);
			inchesLength = Math.round(inches_totalLength % 12);
			if(inchesLength==12){
				feetLength = feetLength+1;
				inchesLength=0;
			}
			$('#shipmentItemImperialLengthFeet').val(feetLength);
			$('#shipmentItemImperialLengthInches').val(inchesLength);
			lengthInExcess=length-(feetLength*0.3048 + inchesLength*0.0254);
			console.log("For UOM=I Length:"+$('#shipmentItemImperialLengthFeet').val()+"*0.3048+"+$('#shipmentItemImperialLengthInches').val()+"*0.0254 +"+lengthInExcess);
			}
		
			var breadth=$('#shipmentItemMetricBreadth').val();
			if(breadth>0){
			inches_totalBreadth = (39.3701 * breadth);
			feetBreadth = parseInt(inches_totalBreadth / 12);
			inchesBreadth = Math.round(inches_totalBreadth % 12);
			if(inchesBreadth==12){
				feetBreadth = feetBreadth+1;
				inchesBreadth=0;
			}
			$('#shipmentItemImperialBreathFeet').val(feetBreadth);
			$('#imperialBreathInches').val(inchesBreadth);
			
			breadthInExcess=breadth-(feetBreadth*0.3048 + inchesBreadth*0.0254);
			console.log("breadth:"+$('#shipmentItemImperialBreathFeet').val()+"*0.3048+"+$('#imperialBreathInches').val()+"*0.0254 +"+breadthInExcess);			
			}
			
			var height=$('#shipmentItemMetricHeight').val();
			if(height>0){
			inches_totalHeight = (39.3701 * height);
			feetHeight = parseInt(inches_totalHeight / 12);
			inchesHeight = Math.round(inches_totalHeight % 12);
			if(inchesHeight==12){
				feetHeight = feetHeight+1;
				inchesHeight=0;
			}
			$('#shipmentItemImperialHeightFeet').val(feetHeight);
			$('#shipmentItemImperialHeightInches').val(inchesHeight);
			
			heightInExcess=height-(feetHeight*0.3048 + inchesHeight*0.0254);
			console.log("height:"+$('#shipmentItemImperialHeightFeet').val()+"*0.3048+"+$('#shipmentItemImperialHeightInches').val()+"*0.0254 +"+heightInExcess);			
			}
		
		}
		recalculateCube();
	}	
	//for 21832 note validation
	function checkForNoteValidation(){
		
		 var note = $('#note').val();
		var itemNumber=$('#itemNumber').val();
		var tariffNumber=$('#tariffNumber').val();
		var tariffCommodityDescription=$('#commodityDesc').val();
		var queryString = $('#shipmentForm').formSerialize();
			
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/checkForNoteValidation",
			 data :{queryString:queryString,note:note, itemNumber:itemNumber, tariffNumber:tariffNumber,tariffCommodityDescription:tariffCommodityDescription},
			 success: function(responseText){
				 if(responseText.success== true){
					 isNoteValid=true;
					 onNoteValidateSuccessShmtSave();
					}
				 else{
					 isNoteValid=false;
					 showResponseMessages("msgDivCommodity", responseText);
					// alert("Please enter a valid note");
					 $.unblockUI();
					 }
				
			 }
			 
		 });
	}
	
	function resolveSpaces(obj){
		var value = $.trim($('#'+obj).val());
		if(value =="")
			return 0;
		else
			return parseInt(value);
	};
	
	// 
	function noteValidationAndUpdateCommodity(){
		
		 var note = $('#note').val();
		var itemNumber=$('#itemNumber').val();
		var tariffNumber=$('#tariffNumber').val();
		var tariffCommodityDescription=$('#commodityDesc').val();
		var queryString = $('#shipmentForm').formSerialize();
			
		 $.ajax({
			 type:"POST",
			 url:_context+"/shipmentCommodity/checkForNoteValidation",
			 data :{queryString:queryString,note:note, itemNumber:itemNumber, tariffNumber:tariffNumber,tariffCommodityDescription:tariffCommodityDescription},
			 success: function(responseText){
				 if(responseText.success== true){
					 isNoteValid=true;
					 updateCommodity(); 
					
					}
				 else{
					 isNoteValid=false;
					 showResponseMessages("msgDivCommodity", responseText);
					// alert("Please enter a valid note");
					 $.unblockUI();
					 }
				
			 }
			 
		 });
	}
	
	var equipmentUpdateComplete = false;
	function updateEquipment() {
			equipmentUpdateComplete = false;
			 blockUI();
			 var queryString = $('#shipmentForm').formSerialize();
			
			 $.ajax({
				 type:"POST",
				 url:_context+"/shipmentCommodity/updateEquipment",
				 data :queryString,
				 success: function(responseText){
					 if(responseText.success== true){
							document.getElementById("blcn").style.display="none";
							document.getElementById("blmx").style.display="block";
						    loadMixedCommodityEquipmentData(responseText);
						   
					        $('#mixedCommodityView').val("Commodity View");
					        $("#mixcommodityGrid").trigger('reloadGrid');  
					      $('#msgDivCommodity').html("");
					      showResponseMessages("msgDivCommodity", responseText);
					}
					 else{
						 document.getElementById("msgDivCommodity").style.display="block";
						 showResponseMessages("msgDivCommodity",responseText);
						 }
					 $.unblockUI();
					 equipmentUpdateComplete = true;
					 }
			
		 });
	}
	
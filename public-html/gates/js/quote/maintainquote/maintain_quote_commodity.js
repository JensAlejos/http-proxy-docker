var IMPERIAL = "I";
var METRIC = "M";
var _commodityAction="";
var _isCommodityChanged = false;
var _isCommodityRatingAttributeChanged = false;
var dialogPosition = 0;
var isCbFtChangeFlag = false;
var isWtImpChangeFlag = false;
var isMetricOff = true;
var isNoteNoPresent = false;
var _ldspServiceCode = "";
var dataName =  null;
var grpId = null;
var itemId = null;
var _isSOMChanged=false;
$(function() {	
	$( "#maintainCommodityDialog" ).dialog({
		autoOpen: false, 
		width: 1000,
		height:670,
		modal: true,
		scrollable: false,
		closeOnEscape: false,
		position: 'top',		
		beforeClose: function() {
			dialogPosition = $("#maintainCommodityDialog").position();
			if (_isCommodityChanged) {
				var r = confirm("All the unsaved changes will be discarded - Do you want to proceed?");
				if (r == false) {
					return false;
				}				
			}
			$(".ui-dialog-buttonpane button:contains('OK')").button("enable");
			_ldspServiceCode = "";
		},	
		open: function() {
			tabSequence('#maintainCommodityDialog',false,false);
			$('#msgDivCus').hide();
			/*tabSequence('#quoteCommodityForm');*/
			$('#maintainCommodityDialog').parent().attr('id', 'quoteCommodityTabSeq');
			tabSequence('#quoteCommodityTabSeq');
		},
		close : function() {
			//tabSequence('#quoteForm');
			$("#maintainCommodityDialog").validationEngine('hideAll');			
			$('html,body').animate({
				scrollTop: $("#showCommodityDscr").offset().top
				}, 200);
			tabSequence('#quoteForm',true,false);
		},
		buttons : {
	        OK: function() {	        	
	        	if (_isCommodityChanged) {
		        	saveUpdateCommodity();
	        	}else{	        		
	        		var r = confirm("No Changes to Save");
	        		if (r == false) {
	        			return false;	
	        		}else{
	        			$("#maintainCommodityDialog").dialog("close");
	        		}
	        	}
	        },
	        Cancel: function(){
	        	$(".ui-dialog-buttonpane button:contains('OK')").button("enable");
	        	$("#maintainCommodityDialog").dialog("close");
	        }
		}
	});	
	
	$("#isConstructedCmdy").click(function(){
		var numOfCommodities = $("#quoteCommodityGrid").getGridParam("reccount");
		if(numOfCommodities > 1){
			$('#isConstructed').removeAttr("checked");
			$('#isConstructedCmdy').removeAttr("checked");
			alert("Quote cannot be constructed as there are multiple commodity exists.");
			return;
		}
		var numOfCharges = $("#quoteChargeLineGrid").getGridParam("reccount");
		if (!$('#isConstructedCmdy').is(":checked") && numOfCharges > 0) {
			for (var i = 1; i<=numOfCharges; i++) {
				var chargeType = $("#quoteChargeLineGrid").jqGrid('getCell', i , "description" );
				chargeType = chargeType + " ";
				if(chargeType.indexOf("-") != -1){
					chargeType = chargeType.split("-")[0];
				}
				if (chargeType == "OVR" || chargeType == "OVR-ACI ZONE PICKUP") {
					$('#isConstructedCmdy').attr("checked", true);
					alert("To unselect, please delete the Overland charges from Charge Line");
					return;
				}
			}
		}		
	});
	
	
	
	$("#cmdtyImperial").click(function(){		
		if((_commodityAction == "EDIT" && $("#quoteCommodityGrid").getGridParam("reccount") > 1)
				|| (_commodityAction == "ADD" && $("#quoteCommodityGrid").getGridParam("reccount") > 0)){
			if($("#cmdtyMetric").is(":checked")){
				$("#cmdtyImperial").removeAttr("checked");
			}
			alert("Measurement Source cannot be modified. Other Commodities already exist for this Quote.");
			return false;
		}
		$("#cmdtyMetric").removeAttr("checked");
		$("#cmdtyImperial").attr("checked", true);	
		$("input:radio[name=unitOfMeasureSourceCode]").val("I");
		_isSOMChanged = true;
		unitOfMeasure();
	});
	$("#cmdtyMetric").click(function(){
		if((_commodityAction == "EDIT" && $("#quoteCommodityGrid").getGridParam("reccount") > 1)
				|| (_commodityAction == "ADD" && $("#quoteCommodityGrid").getGridParam("reccount") > 0)){
			if($("#cmdtyImperial").is(":checked")){
				$("#cmdtyMetric").removeAttr("checked");
			}
			alert("Measurement Source cannot be modified. Other Commodities already exist for this Quote.");
			return false;
		}
		$("#cmdtyImperial").removeAttr("checked");
		$("#cmdtyMetric").attr("checked", true);
		$("input:radio[name=unitOfMeasureSourceCode]").val("M");
		_isSOMChanged = true;
		unitOfMeasure();
	});	
	
	$("#quoteCommodityForm input").change(function() {
		_isCommodityChanged = true;
		_isCommodityRatingAttributeChanged = true;
	});

	$("#quoteCommodityForm select").change(function() {
		_isCommodityChanged = true;
		_isCommodityRatingAttributeChanged = true;
	});

	$("#quoteCommodityForm checkbox").change(function() {
		_isCommodityChanged = true;
		_isCommodityRatingAttributeChanged = true;
	});

	$("#quoteCommodityForm radio").change(function() {
		_isCommodityChanged = true;
		_isCommodityRatingAttributeChanged = true;
	});

	$('#noteNo').blur(function() {
		var noteNumber = $('#noteNo').val();
		var newNoteNo = "";
		for (var i = 0, len = noteNumber.length; i < len; i++) {
			if(/^[a-zA-Z]$/.test(noteNumber[i])){
				newNoteNo = newNoteNo + noteNumber[i].toUpperCase();						
			}else{
				newNoteNo = newNoteNo + noteNumber[i];
			}		
			$('#noteNo').val(newNoteNo);
		}
	});
	
	$('#equipmentCount').change(function() {
		var showAlert = true;
		$('#equipmentCount').val($.trim($('#equipmentCount').val()));
		if (isNaN($('#equipmentCount').val()) || $('#equipmentCount').val() < 1) {
			alert("Invalid Equip Count: "+$('#equipmentCount').val());
			$('#equipmentCount').val("");
			showAlert = false;
		}
		if( _ldspServiceCode == "CY"){
			if($('#equipmentCount').val() == "0" || $('#equipmentCount').val() == ""){
				if(showAlert){
					alert("Equip Count must be at least 1");
				}
				$('#equipmentCount').val("1");				
			}else if(Number($('#equipmentCount').val()) < 1 || isNaN(Number($('#equipmentCount').val())) 
					|| $('#equipmentCount').val().indexOf(".") != -1){
				if(showAlert){
					alert("Equip Count must be at least 1");
				}
				$('#equipmentCount').val("1");				
			}else if(Number($('#equipmentCount').val()) > 350){
				alert("Maximum allowed value is 350");
				$('#equipmentCount').val("1");
			}else if($('#equipmentCount').val() != ""){
				$('#equipmentCount').val(Number($('#equipmentCount').val()));
			}
		}else if($('#equipmentCount').val() != "" && Number($('#equipmentCount').val()) == 0){
			if(showAlert){
				alert("Invalid Equip Count: "+$('#equipmentCount').val() );
			}
			$('#equipmentCount').val("");			
		}else if(Number($('#equipmentCount').val()) > 350){
			alert("Maximum allowed value is 350");
			$('#equipmentCount').val("");
		}else if($('#equipmentCount').val() != ""){
			$('#equipmentCount').val(Number($('#equipmentCount').val()));
		}
		var equipCount = $('#equipmentCount').val();
		if ( Number(equipCount) > 0 ) {
			$("#isEmpty option[value='F']").attr("selected", "selected");
		}
		if(_ldspServiceCode != "CON" && _ldspServiceCode != "LCL" && _ldspServiceCode != "AU"){
			if((($('#weightImp').val() != "" && $('#weightImp').val() != "0")
					|| ($('#weightMt').val() != "" && $('#weightMt').val() != "0")) 
					&& $('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalWeight($('#equipmentCount').val());
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");
			}			
		}
		if(_ldspServiceCode != "CON" && _ldspServiceCode != "LCL" && _ldspServiceCode != "AU"){
			if((($('#cubicFt').val() != "" && $('#cubicFt').val() != "0")
					|| ($('#cubicMt').val() != "" && $('#cubicMt').val() != "0")) 
					&& $('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalVolume($('#equipmentCount').val());
			}else if($("#lengthMt").val() != "" && $("#lengthMt").val() != "0"
					&& $("#widthMt").val() != "" && $("#widthMt").val() != "0"
					&& $("#heightMt").val() != "" && $("#heightMt").val() != "0"){
				if ( $('#cmdtyImperial').val() == "I") {			
					calculateImperialVolume($('#equipmentCount').val());
				} else {
					isMetricOff = false;
					calculateMetricVolume($('#equipmentCount').val());
				}
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");
			}			
		}
	});

	$('#equipType').blur(function() {
		var equipTypeCode = $('#equipType').val();		
		if(/^[a-zA-Z]$/.test(equipTypeCode)){
			$('#equipType').val(equipTypeCode.toUpperCase());			
		}
	});
	
	$('#equipHeight').blur(function() {
		var equipTypeCode = $('#equipHeight').val();		
		if(/^[a-zA-Z]$/.test(equipTypeCode)){
			$('#equipHeight').val(equipTypeCode.toUpperCase());					
		}
	});
	
	$('#equipType').change(function() {
		var loadDschGroupCode = $("#ldspGroupCode").val();
		var equipTypeCode = $('#equipType').val();
		if(/^[a-zA-Z]$/.test(equipTypeCode)){
			equipTypeCode = equipTypeCode.toUpperCase();
			$('#equipType').val(equipTypeCode.toUpperCase());			
		}
		if (loadDschGroupCode != "CFS" && equipTypeCode != 'R' ) {
			$("#refEquipment").attr("disabled", true);
			$("#CFSRefrigY").attr("disabled", true);
			$("#CFSRefrigN").attr("disabled", true);
			$("#refEquipment").removeAttr("checked");
			$("#CFSRefrigY").removeAttr("checked");
			$("#CFSRefrigN").removeAttr("checked");
		}
		
		if (loadDschGroupCode != "CFS" && equipTypeCode == 'R' ) {
			$('#refEquipment').removeAttr("disabled");
			$("#CFSRefrigY").removeAttr("checked");
			$("#CFSRefrigN").removeAttr("checked");
			$("#CFSRefrigY").attr("disabled", true);
			$("#CFSRefrigN").attr("disabled", true);
		}
		
		if (loadDschGroupCode == "CFS" && (equipTypeCode == 'R' || equipTypeCode == '') ) {
			$('#refEquipment').removeAttr("disabled");
			$("#CFSRefrigY").removeAttr("disabled");
			$("#CFSRefrigN").removeAttr("disabled");
		}
		
		if (equipTypeCode !='' && equipTypeCode != null && loadDschGroupCode != "CFS") {
			$('#isOverflow').removeAttr("disabled");
		} else {
			$('#isOverflow').attr("disabled", true);
		}
	});
	
	$("#CFSRefrigY").change(function() {
		if ($("#CFSRefrigY").is(":checked")) {
			$("#refEquipment").removeAttr("checked");
		}
	});
	
	$("#CFSRefrigN").change(function() {
		if ($("#CFSRefrigN").is(":checked")) {
			$("#refEquipment").attr("checked", true);
		}
	});

	$("#refEquipment").change(function() {
		var loadDschGroupCode = $("#ldspGroupCode").val();
		if ($("#refEquipment").is(":checked")) {
			$("#CFSRefrigY").removeAttr("checked");
			$("#CFSRefrigN").removeAttr("checked");
		} else if (loadDschGroupCode == "CFS"){
			$("#CFSRefrigY").attr("checked", true);
			$("#CFSRefrigN").removeAttr("checked");
		}
	});	
	
	$('#itemNo').gatesAutocomplete({				
		source:_context+'/cas/autocomplete.do',
		name: 'Item',		
		autoSelectFirst : true,
		minLength: 1,
	 	extraParams: {
		 		 method: 'searchItemName',
		 		 searchType: '43',
		 		 groupType: '01',
		 		 sourceTariff: function() {return $('#tariffNo').val();}	 		 		 
	 	},
		formatItem: function(data) {
			dataName=data.name;
			itemId=data.id;
			return data.name;
		},
		formatResult: function(data) {
			dataName=data.name;
			//Added for D028627
			itemId=data.id;
			return data.name;
		},
		select: function(data) {
			$('#itemNo').val(data.name);
			$("#tarrCmdyDesc").val("");	
			itemId=data.id;
			
			var dscr = $("#custCmdyDesc").val();
			var tariffNo = $("#tariffNo").val();
			var itemNo = $("#itemNo").val();
			var estShipDate = $("#commHeadEstShipDateString").text();
			var loadSrvc = $("#commHeadLoadServiceCode").text();
			var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
			var trade = $("#tradeCode").val();
			var blOriginCityCode = $('#blOriginCityCode').val();
			var originPortCityCode = $('#originPortCityCode').val();
			var destinationPortCityCode = $('#destinationPortCityCode').val();
			var blDestinationCityCode = $('#blDestinationCityCode').val();
			if ($("#isConstructed").is(":checked")) {
				loadSrvc = "CY";
				dischargeSrvc = "CY";
				blOriginCityCode = "";
				blDestinationCityCode = "";
			}
			//Added for D028627
			itemId="";
			dataName="";
			
			var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
			+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
			+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
			blockUI();
			$.ajax({
				url: urlComm,
				type: "POST",
				success: function(responseText){
					$("#tarrCmdyDesc").val(responseText[0].desc);	
					if (trim(responseText[0].noterate).length > 0) {
						$('#noteNo').removeAttr("disabled");
						//$('#noteNo').val("$");
						$('#noteNo').validationEngine('showPrompt', 'A noted rate exists. To look it up press the Browser button next to the Note Nbr field.', 'info', true);		
						isNoteNoPresent = true;
					} else {
						$('#noteNo').val("");
						$('#noteNo').attr("disabled", true);
					}
					
					if (responseText[0].commodityNotFound =="Y"){
						alert("PRIMARY COMMODITY DOES NOT EXIST.");								
					}
					if (responseText[0].commodityNotFound =="TF"){
						alert(responseText[0].errmsg);								
					}
					if (responseText[0].commodityNotFound =="IF"){
						alert(responseText[0].errmsg);								
					}
					$.unblockUI();
					_isCommodityChanged = true;
					_isCommodityRatingAttributeChanged = true;							
				}
			});					
		}
	});
	
	$('#tariffNo').gatesAutocomplete({		
		source:_context+'/cas/autocomplete.do',
		name: 'Tariff Number',		
		autoSelectFirst : true,
 	 	extraParams: {
	 		 method: 'searchTariffSource',
	 		 searchType: '11',
	 		 groupType: '01'	 		 
	 	},
		//mustMatch: true,
		formatItem: function(data) {
			dataName=data.name;
			grpId=data.id;
			return data.name;
		},
		formatResult: function(data) {
			dataName=data.name;
			//Added for D028627
		    grpId=data.id;
			return data.name;
		},
		 
		select: function(data) {
			$('#tariffNo').val(data.name);
			$("#tarrCmdyDesc").val("");		
			grpId=data.id;
	    	$("#itemNo").val("");
	    	$('#itemNo').removeAttr("disabled");
	    	//026573 - PROD
	    	$('#itemNo').focus();
	    	//D028627
	    	grpId="";
			dataName="";
			/*$('#itemNo').gatesAutocomplete({				
				source:_context+'/cas/autocomplete.do',
				name: 'Item',
				autoSelectFirst : true,
				minLength: 1,
			 	extraParams: {
	 		 		 method: 'searchItemName',
	 		 		 searchType: '43',
	 		 		 groupType: '01',
	 		 		 sourceTariff: function() {return $('#tariffNo').val();}	 		 		 
			 	},
				formatItem: function(data) {
					dataName=data.name;
					itemId=data.id;
					return data.name;
				},
				formatResult: function(data) {
					return data.name;
				},
				select: function(data) {
					$('#itemNo').val(data.name);
					$("#tarrCmdyDesc").val("");	
					itemId=data.id;
					var dscr = $("#custCmdyDesc").val();
					var tariffNo = $("#tariffNo").val();
					var itemNo = $("#itemNo").val();
					var estShipDate = $("#commHeadEstShipDateString").text();
					var loadSrvc = $("#commHeadLoadServiceCode").text();
					var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
					var trade = $("#tradeCode").val();
					var blOriginCityCode = $('#blOriginCityCode').val();
					var originPortCityCode = $('#originPortCityCode').val();
					var destinationPortCityCode = $('#destinationPortCityCode').val();
					var blDestinationCityCode = $('#blDestinationCityCode').val();
					if ($("#isConstructed").is(":checked")) {
						loadSrvc = "CY";
						dischargeSrvc = "CY";
						blOriginCityCode = "";
						blDestinationCityCode = "";
					}
					
					
					var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
					+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
					+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
					
					$.ajax({
						url: urlComm,
						type: "POST",
						success: function(responseText){
							$("#tarrCmdyDesc").val(responseText[0].desc);							
							if (trim(responseText[0].noterate).length > 0) {								
								$('#noteNo').removeAttr("disabled");
								$('#noteNo').val("$");
								$('#noteNo').validationEngine('showPrompt', 'A noted rate exists. To look it up press the Browser button next to the Note Nbr field.', 'info', true);		
								isNoteNoPresent = true;
							} else {
								$('#noteNo').val("");
								$('#noteNo').attr("disabled", true);
							}
							
							if (responseText[0].commodityNotFound =="Y"){
								alert("NO PRIMARY RATE FOUND.");								
							}
							if (responseText[0].commodityNotFound =="TF"){
								alert(responseText[0].errmsg);								
							}
							if (responseText[0].commodityNotFound =="IF"){
								alert(responseText[0].errmsg);								
							}
							_isCommodityChanged = true;
							_isCommodityRatingAttributeChanged = true;							
						}
					});					
				}
			});*/
		}
	});
	
	$("#cmdtyImperial").focusout(function(){
		$('#cmdtyMetric').focus();
	});
	
	$("#custCmdyDesc").focusout(function(){
		$('#tariffNo').focus();
	});
	
	//D025263: 	Maintain quote - auto tab from tariff to item 
	$("#pieceCount").focusin(function(){
		if(itemNoFocus){
			$('#itemNo').focus();
			itemNoFocus = false;
		}
	});
	
	var itemNoFocus = false;
	$('#tariffNo').change(function(){
		if(grpId==null ||grpId==""){
	    	$("#tariffNo").val(""); 
		}
		else{
			$("#tariffNo").val(dataName);
			//Removed for D028627
			/*$('#itemNo').removeAttr("disabled");
			$('#itemNo').val("");
			$('#itemNo').focus();*/
			itemNoFocus = true;
			}
		//Added for D028627
		grpId="";
		dataName="";
		});
	$('#itemNo').change(function(){
		//somethingChangedCommodityHHGS = true;
		if(itemId==null || itemId==""){				
	     	$("#itemNo").val("");       	
	 	  }		
			else{
				$("#itemNo").val(dataName); 
				$("#tarrCmdyDesc").val("");	
				//itemId=data.id;
				
				var dscr = $("#custCmdyDesc").val();
				var tariffNo = $("#tariffNo").val();
				var itemNo = $("#itemNo").val();
				var estShipDate = $("#commHeadEstShipDateString").text();
				var loadSrvc = $("#commHeadLoadServiceCode").text();
				var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
				var trade = $("#tradeCode").val();
				var blOriginCityCode = $('#blOriginCityCode').val();
				var originPortCityCode = $('#originPortCityCode').val();
				var destinationPortCityCode = $('#destinationPortCityCode').val();
				var blDestinationCityCode = $('#blDestinationCityCode').val();
				if ($("#isConstructed").is(":checked")) {
					loadSrvc = "CY";
					dischargeSrvc = "CY";
					blOriginCityCode = "";
					blDestinationCityCode = "";
				}
				
				
				var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
				+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
				+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
				blockUI();
				$.ajax({
					url: urlComm,
					type: "POST",
					success: function(responseText){
						$("#tarrCmdyDesc").val(responseText[0].desc);							
						if (trim(responseText[0].noterate).length > 0) {
							//Removing this code as per client's instruction.							
							$('#noteNo').removeAttr("disabled");
							//$('#noteNo').val("$");
							$('#noteNo').validationEngine('showPrompt', 'A noted rate exists. To look it up press the Browser button next to the Note Nbr field.', 'info', true);		
							isNoteNoPresent = true;
						} else {
							$('#noteNo').val("");
							$('#noteNo').attr("disabled", true);
						}
						
						if (responseText[0].commodityNotFound =="Y"){
							alert("NO PRIMARY RATE FOUND.");								
						}
						if (responseText[0].commodityNotFound =="TF"){
							alert(responseText[0].errmsg);								
						}
						if (responseText[0].commodityNotFound =="IF"){
							alert(responseText[0].errmsg);								
						}
						$.unblockUI();
						_isCommodityChanged = true;
						_isCommodityRatingAttributeChanged = true;							
					}
				});			
				
			}
		itemId="";
		dataName="";
	});
	
	$('#equipHeight').gatesPopUpSearch({func:function() {
		equipPopupSearch();}
	});	
	
	$('#pieceCount').change(function() {
		var showAlert = true;
		$('#pieceCount').val($.trim($('#pieceCount').val()));	
		var pieceCount = Number($('#pieceCount').val());
		if (isNaN(pieceCount) || pieceCount < 1) {
			alert("Invalid Piece Count: "+$('#pieceCount').val() );
			$('#pieceCount').val("");
			showAlert = false;			
		}	
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() == "0" || $('#pieceCount').val() == ""){
				if(showAlert){
					alert("Piece Count must be at least 1");
				}
				$('#pieceCount').val("1");				
			}else if(Number($('#pieceCount').val()) < 1 || isNaN(Number($('#pieceCount').val()))
					|| $('#pieceCount').val().indexOf(".") != -1){
				if(showAlert){
					alert("Piece Count must be at least 1");
				}
				$('#pieceCount').val("1");				
			}else if($('#pieceCount').val() != ""){
				$('#pieceCount').val(Number($('#pieceCount').val()));
			}
		}else if($('#pieceCount').val() != "" && Number($('#pieceCount').val()) == 0){
			if(showAlert){
				alert("Invalid Piece Count: "+$('#pieceCount').val() );
			}
			$('#pieceCount').val("");			
		}else if($('#pieceCount').val() != ""){
			$('#pieceCount').val(Number($('#pieceCount').val()));
		}
		var loadDschGroupCode = $.trim($("#ldspGroupCode").val());
		if ( ($('#equipmentCount').val() == 0 || $('#equipmentCount').val() =="" ) && $.trim($('#pieceCount').val()) > 200 ) {
			alert("Piece count must be 200 or less if equipment count is zero");
			$('#pieceCount').val("1");
			$("#pieceCount").trigger('change');
		}
		isCbFtChangeFlag = false;
		isWtImpChangeFlag = false;
		unitOfMeasure();		
		if( _ldspServiceCode != "CY"){
			if((($('#cubicFt').val() != "" && $('#cubicFt').val() != "0") || 
					($('#cubicMt').val() != "" && $('#cubicMt').val() != "0")) 
					&& $('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalVolume($('#pieceCount').val());
			}else if($("#lengthMt").val() != "" && $("#lengthMt").val() != "0"
					&& $("#widthMt").val() != "" && $("#widthMt").val() != "0"
					&& $("#heightMt").val() != "" && $("#heightMt").val() != "0"){
				if ( $('#cmdtyImperial').val() == "I") {			
					calculateImperialVolume($('#pieceCount').val());
				} else {
					isMetricOff = false;
					calculateMetricVolume($('#pieceCount').val());
				}
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");				
			}				
		}
		if( _ldspServiceCode != "CY"){
			if((($('#weightImp').val() != "" && $('#weightImp').val() != "0") || 
					($('#weightMt').val() != "" && $('#weightMt').val() != "0")) 
					&& $('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalWeight($('#pieceCount').val());	
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");				
			}	
		}
	});
	
	$('#lengthMt').change(function() {		
		isMetricOff = true;
		var convertedUnits = new imperialLength($('#lengthMt').val());
		$('#lengthFt').val(convertedUnits.feet);
		$('#lengthIn').val(convertedUnits.inches);		
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
					/*calculateMetricVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
			/*	calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}
						
		}else{
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
				/*calculateMetricVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}			
		}/*else{
			calculateMetricVolume($('#pieceCount').val());
		}*/
	});
		
	$('#heightMt').change(function() {		
		isMetricOff = true;
		var convertedUnits = new imperialLength($('#heightMt').val());
		$('#heightFt').val(convertedUnits.feet);
		$('#heightIn').val(convertedUnits.inches);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});

	$('#widthMt').change(function() {		
		isMetricOff = true;
		var convertedUnits = new imperialLength($('#widthMt').val());
		$('#widthFt').val(convertedUnits.feet);
		$('#widthIn').val(convertedUnits.inches);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateMetricVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateMetricVolume($('#equipmentCount').val());	*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");	
			}		
		}
	});

	$('#lengthFt').change(function() {
		var totalMeters = convertInchesToMeter($('#lengthFt').val(), $('#lengthIn').val());
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#lengthMt').val(totalMeters);		
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");		
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}
						
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}			
		}
	});

	$('#lengthIn').change(function() {
		var feets = $('#lengthFt').val();
		var inches = $('#lengthIn').val();
		
		var totalMeters = convertInchesToMeter(feets, inches);
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#lengthMt').val(totalMeters);
		
		var extraFeets = getFeetFromInches(inches);
		var remInches = getModInches(inches);
		$('#lengthFt').val(Number(feets) + Number(extraFeets));
		$('#lengthIn').val(remInches);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());	*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});
	
	$('#heightFt').change(function() {
		var totalMeters = convertInchesToMeter($('#heightFt').val(), $('#heightIn').val());
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#heightMt').val(totalMeters);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}			
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});
	
	$('#heightIn').change(function() {
		var feets = $('#heightFt').val();
		var inches = $('#heightIn').val();
		
		var totalMeters = convertInchesToMeter(feets, inches);
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#heightMt').val(totalMeters);
		
		var extraFeets = getFeetFromInches(inches);
		var remInches = getModInches(inches);
		$('#heightFt').val(Number(feets) + Number(extraFeets));
		$('#heightIn').val(remInches);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
			/*	calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}	
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});
	
	$('#widthFt').change(function() {
		var totalMeters = convertInchesToMeter($('#widthFt').val(), $('#widthIn').val());
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#widthMt').val(totalMeters);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}				
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});
	
	$('#widthIn').change(function() {
		var feets = $('#widthFt').val();
		var inches = $('#widthIn').val();
		
		var totalMeters = convertInchesToMeter(feets, inches);
		if (isNaN(totalMeters)) {
			resetCubeFields();
			return;
		}
		$('#widthMt').val(totalMeters);
		
		var extraFeets = getFeetFromInches(inches);
		var remInches = getModInches(inches);
		$('#widthFt').val(Number(feets) + Number(extraFeets));
		$('#widthIn').val(remInches);
		if( _ldspServiceCode != "CY"){
			if($('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				/*calculateImperialVolume($('#pieceCount').val());*/
				calculatePerPieceVolumeForDimensions($('#pieceCount').val());
				/*calculateTotalVolume($('#pieceCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}				
		}else {
			if($('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				/*calculateImperialVolume($('#equipmentCount').val());*/
				calculatePerPieceVolumeForDimensions($('#equipmentCount').val());
				/*calculateTotalVolume($('#equipmentCount').val());*/
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}		
		}
	});
	
	$('#cubicFt').change(function() {
		var impVolume = $('#cubicFt').val();
		var metricVolume = convertToMetricVolume(impVolume);
		if (isNaN(metricVolume)) {
			resetCubeFields();
			$('#cubicFt').val(impVolume);
			return;
		} else {
			resetMeasurement();
		}

		$('#cubicMt').val(metricVolume);
		isCbFtChangeFlag = true;
		if( _ldspServiceCode != "CY"){
			if($('#cubicFt').val() != "" && $('#cubicFt').val() != "0" &&
					$('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalVolume($('#pieceCount').val());	
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");					
			}			
		}else {
			if($('#cubicMt').val() != "" && $('#cubicMt').val() != "0" &&
					$('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalVolume($('#equipmentCount').val());
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
				$('#cubicMt').val("");
				$('#cubicFt').val("");
			}			
		}
	});
	
	$('#totalCubicFt').change(function() {
		/*In any case, if user manually enters Total weight, then blank out Weight Per Piece*/
		blankOutDimensionsAndCbFtPc();		
		var total = $('#totalCubicFt').val();
		$('#totalCubicFt').val(total);
		var metricVol = convertToMetricVolume(total);
		if (isNaN(metricVol)) {
			$('#totalCubicMt').val("");
			return;
		}
		$('#totalCubicMt').val(metricVol);		
	});
	
	$('#cubicMt').change(function() {
		var metricVolume = $('#cubicMt').val();
		var impVolume = convertToImperialVolume(metricVolume);
		if (isNaN(impVolume)) {
			resetCubeFields();
			$('#cubicMt').val(metricVolume);
			return;
		} else {
			resetMeasurement();
		}
		$('#cubicFt').val(impVolume);
		if( _ldspServiceCode != "CY"){
			if($('#cubicMt').val() != "" && $('#cubicMt').val() != "0" &&
					$('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalVolume($('#pieceCount').val());	
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");				
			}			
		}else {
			if($('#cubicMt').val() != "" && $('#cubicMt').val() != "0" &&
					$('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalVolume($('#equipmentCount').val());
			}else{
				$("#totalCubicFt").val("");
				$("#totalCubicMt").val("");	
			}			
		}
	});
	
	$('#totalCubicMt').change(function() {
		/*In any case, if user manually enters Total weight, then blank out Weight Per Piece*/
		blankOutDimensionsAndCbFtPc();
		var total = $('#totalCubicMt').val();
		$('#totalCubicMt').val(total);
		var imperialVol = convertToImperialVolume(total);
		if (isNaN(imperialVol)) {
			$('#totalCubicFt').val("");
			return;
		}
		$('#totalCubicFt').val(imperialVol);		
	});

	$('#weightImp').change(function() {
		var impWeight = $('#weightImp').val();
		resetWeightFields();
		var metricWeight = convertToMetricWeight(impWeight);
		$('#weightImp').val(impWeight);
		if (isNaN(metricWeight)) {
			return;
		}
		$('#weightMt').val(metricWeight);
		isWtImpChangeFlag = true;			
		if( _ldspServiceCode != "CY"){
			if($('#weightImp').val() != "" && $('#weightImp').val() != "0" &&
					$('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalWeight($('#pieceCount').val());	
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");				
			}			
		}else {
			if($('#weightImp').val() != "" && $('#weightImp').val() != "0" &&
					$('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalWeight($('#equipmentCount').val());
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");
			}			
		}	
	});
	
	$('#weightMt').change(function() {
		var metricWeight = $('#weightMt').val();
		resetWeightFields();
		var impWeight = convertToImperialWeight(metricWeight);
		$('#weightMt').val(metricWeight);
		if (isNaN(impWeight)) {
			return;
		}
		$('#weightImp').val(impWeight);		
		if( _ldspServiceCode != "CY"){
			if($('#weightMt').val() != "" && $('#weightMt').val() != "0" &&
					$('#pieceCount').val() != "" && $('#pieceCount').val() != "0"){
				calculateTotalWeight($('#pieceCount').val());	
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");				
			}			
		}else {
			if($('#weightMt').val() != "" && $('#weightMt').val() != "0" &&
					$('#equipmentCount').val() != "" && $('#equipmentCount').val() != "0"){
				calculateTotalWeight($('#equipmentCount').val());
			}else{
				$("#totalWeightLb").val("");
				$("#totalWeightMt").val("");
			}			
		}
		
	});
	
	$('#totalWeightMt').change(function() {
		/*In any case, if user manually enters Total weight, then blank out Weight Per Piece*/
		$("#weightImp").val("");
		$("#weightMt").val("");
		var total = convertToImperialWeight($('#totalWeightMt').val());
		if (isNaN(total)) {
			$('#totalWeightLb').val("");
			return;
		}
		
		$('#totalWeightLb').val(total);
	});
	
	$('#totalWeightLb').change(function() {
		/*In any case, if user manually enters Total weight, then blank out Weight Per Piece*/
		$("#weightImp").val("");
		$("#weightMt").val("");
		var total = convertToMetricWeight($('#totalWeightLb').val());
		if (isNaN(total)) {
			$('#totalWeightMt').val("");
			return;
		}
		$('#totalWeightMt').val(total);		
	});
	
	disableRule20Fields();
	
	//disableVehicleFields();
	
	$('#rule20').change(function() {
		enableRule20Fields();
		disableVehicleFields();
	});
	
	$('#vehicle').change(function() {
		disableRule20Fields();
		enableVehicleFields();
	});
	
	$('#naVR').change(function() {
		disableRule20Fields();
		disableVehicleFields();
	});
	
	$('#custCmdyDesc').gatesPopUpSearch({
		func : function() {
			commPopupSearch();
		}
	});
	
	
	$('#noteNo').gatesPopUpSearch({
		func : function() {
			notePopupSearch();
		}
	}); 
	
	//Auto-Tabbing
	autoTab('equipType','equipLength', 1);//1st box
    autoTab('equipLength','equipHeight', 2);//2nd box
    autoTab('equipHeight','isEmpty', 1);

	
    $('#equipLength').change(function() {//Changing the value of equipmentlenght(2nd tab).
    	//if its empty or less then 1 then set the equipmentCount to 1
    	if($('#equipmentCount').val() == '' || $('#equipmentCount').val() < 1 ){
    		$('#equipmentCount').val(1);
    		$("#isEmpty option[value='F']").attr("selected", "selected");
    	}
    });
	
});

function saveUpdateCommodity() {
	if($('#isMainLand').val() != "true"){
		if(($('#weightImp').val() == "" || $('#weightImp').val() == "0") && 
			($('#totalWeightLb').val() == "" || $('#totalWeightLb').val() == "0") &&
			($('#weightMt').val() == "" || $('#weightMt').val() == "0") &&
			($('#totalWeightMt').val() == "" || $('#totalWeightMt').val() == "0")){
			
			$('#totalWeightLb').validationEngine('showPrompt', 'This is required', 'error', true);		
			return;
		}
	}
	
	if( $("#ldspGroupCode").val() != "" && $("#ldspGroupCode").val() == "CY"){
		if($('#equipType').val() == "" && $('#equipLength').val() == ""){
			$('#equipType').validationEngine('showPrompt', 'This is required', 'error', true);
			$('#equipLength').validationEngine('showPrompt', 'This is required', 'error', true);
			return;
		}
	}
	var seqNo = $('#commoditySeqNbrDs').val();
	if (seqNo == null || seqNo == "") {
		addCommodity();
	} else {
		updateCommodity();
	}
}

function commPopupSearch() {
	var dscr = $("#custCmdyDesc").val();
	var tariffNo = $("#tariffNo").val();
	var itemNo = $("#itemNo").val();
	var estShipDate = $("#commHeadEstShipDateString").text();
	var loadSrvc = $("#commHeadLoadServiceCode").text();
	var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
	var trade = $("#tradeCode").val();
	var values=$('#blOriginCityCode').val().split("-");
	var blOriginCityCode = values[0];
	values=$('#originPortCityCode').val().split("-");
	var originPortCityCode = values[0];
	values=$('#destinationPortCityCode').val().split("-");
	var destinationPortCityCode = values[0];
	values=$('#blDestinationCityCode').val().split("-");
	var blDestinationCityCode = values[0];
	var errLevelCode = '03';
	if ($("#isConstructed").is(":checked")) {
		loadSrvc = "CY";
		dischargeSrvc = "CY";
		blOriginCityCode = "";
		blDestinationCityCode = "";
	}
	
	var actionUrl = _context+'/cas/searchCommodityLookup.do?filterValue1=' + dscr + '|' + tariffNo + '|' + itemNo + '|' + trade +
			'|' + loadSrvc + '|' + dischargeSrvc + '|' + estShipDate + '|' + blOriginCityCode + '|' + originPortCityCode + 
			'|' + destinationPortCityCode + '|' + blDestinationCityCode + '|' + errLevelCode;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);		
}

function commodityUpdate(id){
	var values= id.split("|");
	if(values[1] != null && values[1] == "**NPC**"){
		alert("NO PRIMARY COMMODITY FOUND");
	}else{
		$("#tarrCmdyDesc").val(values[1]);	
	}
	$("#tariffNo").val(values[3]);
	$("#itemNo").val(values[4]);
	$("#itemNo").removeAttr("disabled");
	if (trim(values[6]).length > 0 && trim(values[6])!='null') {		
		$('#noteNo').removeAttr("disabled");
		//$('#noteNo').val("$");
		$('#noteNo').validationEngine('showPrompt', 'A noted rate exists. To look it up press the Browser button next to the Note Nbr field.', 'info', true);		
		isNoteNoPresent = true;
	} else {
		$('#noteNo').val("");
		$('#noteNo').attr("disabled", true);
	}
	_isCommodityChanged = true;
	_isCommodityRatingAttributeChanged = true;

	clearErrorPointers("tariffNo");
	clearErrorPointers("itemNo");
}

function notePopupSearch() {
	removeQuoteErrorPointers();
	var tariffNo = $("#tariffNo").val();
	var itemNo = $("#itemNo").val();
	var estShipDate = $("#commHeadEstShipDateString").text();
	var eqType = $("#equipType").val();
	var eqLength=$("#equipLength").val();
	var eqHeight=$("#equipHeight").val();
	var origin = getCodes( $('#blOriginCityCode').val() );
	var destination = getCodes( $('#blDestinationCityCode').val() );
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var loadSrvc = $("#commHeadLoadServiceCode").text();
	var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
	var trade = $("#tradeCode").val();
	var actionUrl = _context+'/cas/searchNoteNoLookup.do?filterValue1=' + tariffNo + '|' + itemNo 
	+'|' + estShipDate + '|' + eqType + '|' + eqLength + '|' + eqHeight + '|' 
	+ origin + '|' + destination+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'
	+loadSrvc+'|'+dischargeSrvc+'|'+trade;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'NoteSearch', windowStyle);
}

function noteNoUpdate(id){
	var values= id.split("|");
	$("#noteNo").val($.trim(values[0]));
	_isCommodityChanged = true;
	_isCommodityRatingAttributeChanged = true;
}

function showAddCommodityDialog(){
	blockUI();
	var queryString = $('#quoteForm').formSerialize();
	if($("#imperial").is(":checked")){
		$("input:radio[name=unitOfMeasureSourceCode]").val("I");
	}else if($("#metric").is(":checked")){
		$("input:radio[name=unitOfMeasureSourceCode]").val("M");
	}
	$("#commoditySetSize").val('');
	$("#tariffNo").attr("readonly", false);
	dialogPosition = $("#maintainCommodityDialog").position();
	$("#maintainCommodityDialog" ).dialog({ position: "top" });
	window.scrollTo(0,0);
	_commodityAction = "ADD";
	$.ajax({
		url: "../quote/commodity/showCommodityDscr",
		type: "POST",
		data: queryString,
		success: function(responseText){
			$("#maintainCommodityDialog").dialog( "option", "title", 'Add Commodity' );
			$("#maintainCommodityDialog").dialog('open');
			$("#maintainCommodityDialog" ).dialog({ position: "top" });
			dialogPosition = $("#maintainCommodityDialog").position();
			window.scrollTo(0,0);
			clearCommodityForm();
			$("#quoteCommodityForm").loadJSON(responseText);
			
			 if($("#ldspGroupCode").val() != "" && $.trim($("#ldspGroupCode").val()) == "CY"){	
				$("#pieceCount").val("");
				$('#equipmentCount').val("1");	
				$('#equipmentCount').trigger('change');
			}else{
				$("#pieceCount").val("1");
				$('#equipmentCount').val("");
			}
			onPageLoad();
			if($("#commoditySetSize").val()!="0" && $("#commoditySetSize").val()!=0) {
				$("#tariffNo").attr("readonly", true);
			}
			$("#quoteCommodityForm").validationEngine('attach');
			_isCommodityChanged = false;
			_isCommodityRatingAttributeChanged = false;
			if($("input:checkbox[id=isConstructed]").is(":checked")){
				$("#isConstructedCmdy").attr("checked", true);
			}
			if($("input:radio[id=metric]").is(":checked")){
				$("#cmdtyMetric").attr("checked", true);
			}else{
				$("#cmdtyImperial").attr("checked", true);
			}			
		}
	});
	var loadCode = $('#loadServiceCode :selected').val();
	var dschCode = $('#dischargeServiceCode :selected').val();	
	$.ajax({
		url: "../quote/identifyLoadDschGroup?loadCode="+loadCode +"&dschCode="+dschCode,
		type: "GET",
		//data: queryString,
		success: function(responseText){
			_ldspServiceCode = $.trim(responseText.data); 
			if(_ldspServiceCode == "CY"){
				$("#pieceCount").val("");
				$('#equipmentCount').val("1");
				$('#equipmentCount').trigger('change');
			}else{
				$("#pieceCount").val("1");
				$('#equipmentCount').val("");
			}
			unitOfMeasure();
			$.unblockUI();
		}
	});
	if($("#tariffNo").val() != ""){
		$('#itemNo').removeAttr("disabled");
		validateTariffCode();	
	}else{
		$('#itemNo').attr("disabled", true);
	}	
	if ($("#naVR").is(":checked")) {		
		disableRule20Fields();
		disableVehicleFields();
	}
	if($("#quoteCommodityGrid").getGridParam("reccount") > 0){
		$('#itemNo').removeAttr("disabled");
	}
}

function clearCommodityForm() {
	$("#quoteCommodityForm").clearForm(); // --This doesnot do clear hidden
											// fields---
	$('#commoditySeqNbrDs').val('');
	$("#planEquipTypeCode").val('');
	$("#lengthInch").val('');
	$("#heightInch").val('');
	$("#widthInch").val('');
	$("#cubicFeet").val('');
	$("#weightPound").val('');
}

function addCommodity(){
	var isValid = updateHiddenFields();
	if (!isValid) {
		return;	
	}
	
	if ( !$("#quoteCommodityForm").validationEngine('validate') ) {
		return;
	};	
	if(_ldspServiceCode == "CY" && ($("#equipmentCount").val() == "" || $("#equipmentCount").val() == "0")){
		$('#equipmentCount').validationEngine('showPrompt', 'This is required', 'error', true);
		return false;
	}else if((_ldspServiceCode == "CON" || _ldspServiceCode == "LCL" || _ldspServiceCode == "AU") && ($("#pieceCount").val() == "" || $("#pieceCount").val() == "0")){
		$('#pieceCount').validationEngine('showPrompt', 'This is required', 'error', true);
		return false;
	}		
	$(".ui-dialog-buttonpane button:contains('OK')").button("disable");
	var queryString = $('#quoteCommodityForm').formSerialize();
	blockUI();
	$.ajax({
		url: "../quote/commodity/addCommodity",
		type: "POST",
		data: queryString,
		success: function(responseText){
			$('#quoteCommodityForm').validationEngine('hideAll');
			
			
			_isQuoteChanged = true;
			_isCommodityRatingAttributeChanged = true;
			_isCommodityChanged = false;
			if(responseText.data == "InvalidEquip"){
				$('#msgDivCus').html("<div class=\"message_error\">Equipment Feature code, Length or/and Height is not valid.</div>");
				$('#msgDivCus').show();
						
			}
			else{
			$("#maintainCommodityDialog").dialog('close');
			$("#quoteCommodityGrid").trigger('reloadGrid');
			if($("input:checkbox[id=isConstructedCmdy]").is(":checked")){
				$("#isConstructed").attr("checked", true);
			}else{
				$("#isConstructed").removeAttr("checked");
			}
			if(!($("#quoteCommodityGrid").getGridParam("reccount") > 0)){
				if(_isSOMChanged){
					if($("input:radio[id=cmdtyMetric]").is(":checked")){
						$("input:radio[name=unitOfMeasureSourceCode]").val("M");		
						$("[id$=metric]").attr("checked", true);
						$("[id$=imperial]").removeAttr("checked");
						$("#metric").trigger('click');	
					}else{
						$("input:radio[name=unitOfMeasureSourceCode]").val("I");		
						$("[id$=imperial]").attr("checked", true);
						$("[id$=metric]").removeAttr("checked");
						$("#imperial").trigger('click');
					}	
				}					
			}
			
			
			
			}
			_isSOMChanged = false;
			$(".ui-dialog-buttonpane button:contains('OK')").button("enable");
			$.unblockUI();
		}
	});
	_commodityAction = "ADD";
	setCommodityTabDetailsOnAdd($("#quoteCommodityGrid").getGridParam("reccount"), 
			$("#custCmdyDesc").val(), $("#tarrCmdyDesc").val());
}

function showEditCommodityDialog(id){
	_commodityAction = "EDIT";
	$("#quoteCommodityForm").clearForm();
	if($("#imperial").is(":checked")){
		$("input:radio[name=unitOfMeasureSourceCode]").val("I");
	}else if($("#metric").is(":checked")){
		$("input:radio[name=unitOfMeasureSourceCode]").val("M");
	}
	$("#commoditySetSize").val('');
	$("#tariffNo").attr("readonly", false);
	var dataUrl = "../quote/commodity/loadCommodityGridRowForEdit?id="+id;
	var queryString = $('#quoteForm').formSerialize();
	$("#maintainCommodityDialog" ).dialog({ position: "top" });
	dialogPosition = $("#maintainCommodityDialog").position();
	window.scrollTo(0,0);
	blockUI();
	$.ajax({
		url: dataUrl,
		type: "POST",
		data: queryString,
		success: function(responseText){
			$( "#maintainCommodityDialog" ).dialog( "option", "title", 'Edit Commodity' );
			$("#maintainCommodityDialog").dialog('open');
			$("#maintainCommodityDialog" ).dialog({ position: "top" });
			dialogPosition = $("#maintainCommodityDialog").position();
			window.scrollTo(0,0);
			$("#quoteCommodityForm").loadJSON(responseText);
			onPageLoad();
			setConventionalCargoDetails();
			if($("#commoditySetSize").val()!="1" &&  $("#commoditySetSize").val()!=1) {
				$("#tariffNo").attr("readonly", true);
			}
			$("#quoteCommodityForm").validationEngine('attach');
			_isCommodityChanged = false;
			_isCommodityRatingAttributeChanged = false;
			/*Quote Security */ //Code present in quote.js
			if(isNoteNoPresent == true){
				$('#noteNo').removeAttr("disabled");
			} 
			if($("input:checkbox[id=isConstructed]").is(":checked")){
				$("#isConstructedCmdy").attr("checked", true);
			}
			if($("input:radio[id=metric]").is(":checked")){
				$("#cmdtyMetric").attr("checked", true);
			}else{
				$("#cmdtyImperial").attr("checked", true);
			}
			//D027970
			if(responseText.cubicFeet==null || responseText.cubicFeet =='null'){
				$("#totalCubicFt").val("");
				$("#cubicFt").val("");
				$("#totalCubicMt").val("");
				$("#cubicMt").val("");
			}
			// D25250, load note check if no note already there.
			if(!isNoteNoPresent || $('#noteNo').val() == "" ) {
				validateNote();
			}

			$.unblockUI();
		}
	});
	
	var loadCode = $('#loadServiceCode :selected').val();
	var dschCode = $('#dischargeServiceCode :selected').val();	
	$.ajax({
		url: "../quote/identifyLoadDschGroup?loadCode="+loadCode +"&dschCode="+dschCode,
		type: "GET",
		//data: queryString,
		success: function(responseText){
			_ldspServiceCode = $.trim(responseText.data);
		}
	});
	
	


}



function updateCommodity(){
	var isValid = updateHiddenFields();
	if (!isValid) {
		return;	
	}
	
	if ( !$("#quoteCommodityForm").validationEngine('validate') ) {
		return;
	};
	if(_ldspServiceCode == "CY" && ($("#equipmentCount").val() == "" || $("#equipmentCount").val() == "0")){
		$('#equipmentCount').validationEngine('showPrompt', 'This is required', 'error', true);
		return false;
	}else if((_ldspServiceCode == "CON" || _ldspServiceCode == "LCL" || _ldspServiceCode == "AU") && ($("#pieceCount").val() == "" || $("#pieceCount").val() == "0")){
		$('#pieceCount').validationEngine('showPrompt', 'This is required', 'error', true);
		return false;
	}
	var queryString = $('#quoteCommodityForm').formSerialize();
	blockUI();
	$(".ui-dialog-buttonpane button:contains('OK')").button("disable");
	$.ajax({
			url: "../quote/commodity/updateCommodity",
			type: "POST",
			data: queryString,
			success: function(responseText){
				_isQuoteChanged = true;
				_isCommodityRatingAttributeChanged = true;
				_isCommodityChanged = false;
				
				if(responseText.data == "InvalidEquip"){
					$('#msgDivCus').html("<div class=\"message_error\">Equipment Feature code, Length or/and Height is not valid.</div>");
					$('#msgDivCus').show();
							
				}
				else{
				$("#quoteCommodityGrid").trigger('reloadGrid');
				$("#maintainCommodityDialog").dialog('close');
				if($("input:checkbox[id=isConstructedCmdy]").is(":checked")){
					$("#isConstructed").attr("checked", true);
				}else{					
					$("#isConstructed").removeAttr("checked");
				}
				if(!($("#quoteCommodityGrid").getGridParam("reccount") > 1)){
					if(_isSOMChanged){
						if($("input:radio[id=cmdtyMetric]").is(":checked")){
							$("input:radio[name=unitOfMeasureSourceCode]").val("M");		
							$("[id$=metric]").attr("checked", true);
							$("[id$=imperial]").removeAttr("checked");
							$("#metric").trigger('click');	
						}else{
							$("input:radio[name=unitOfMeasureSourceCode]").val("I");		
							$("[id$=imperial]").attr("checked", true);
							$("[id$=metric]").removeAttr("checked");
							$("#imperial").trigger('click');
						}
					}
				}
				}
				_isSOMChanged = false;
				$(".ui-dialog-buttonpane button:contains('OK')").button("enable");
				$.unblockUI();
			}
		});
	_commodityAction = "EDIT";
	setCommodityTabDetailsOnEdit($("#quoteCommodityGrid").getGridParam("reccount"), 
			$("#custCmdyDesc").val(), $("#tarrCmdyDesc").val());
}
function openCommodityDivBlock(){
	document.getElementById('dimensionsDiv').style.display = 'block';	
}
function updateHiddenFields() {
	$('#planEquipTypeCode').val($.trim($('#equipType').val()) + $.trim($('#equipLength').val()) + $.trim($('#equipHeight').val()));
	$('#lengthInch').val(getTotalInches($('#lengthFt').val(), $('#lengthIn').val()));	
	$('#heightInch').val(getTotalInches($('#heightFt').val(), $('#heightIn').val()));
	$('#widthInch').val(getTotalInches($('#widthFt').val(), $('#widthIn').val()));
	if($('#lengthInch').val() != undefined && $('#lengthInch').val() > 32756){		
		$('#lengthIn').validationEngine('showPrompt', '*Value too long.', 'error', true);
		return false;		
	}
	if($('#heightInch').val() != undefined && $('#heightInch').val() > 32756){		
		$('#heightIn').validationEngine('showPrompt', '*Value too long.', 'error', true);
		return false;
	}
	if($('#widthInch').val() != undefined && $('#widthInch').val() > 32756){		
		$('#widthIn').validationEngine('showPrompt', '*Value too long.', 'error', true);
		return false;
	}
	$('#cubicFeet').val( $('#totalCubicFt').val() );
	$('#weightPound').val( $('#totalWeightLb').val() );

	var loadDschGroupCode = $("#ldspGroupCode").val();
	if (loadDschGroupCode == "CFS" && !$("#CFSRefrigY").is(":checked") && !$("#CFSRefrigN").is(":checked") ) {
		alert("Refrigerated Equipment Details (CFS Refrig Yes or No) must be supplied for the 'CFS' Load/Discharge Service Group");
		return false;
	}
	return true;
}

function onPageLoad() {
	disableCommodityHeader();
	$('#commoditySeqNbrDsLabel').text($('#commoditySeqNbrDs').val());
	if ($('#planEquipTypeCode').val()!= null ) {
		$('#equipType').val( $('#planEquipTypeCode').val().substr(0,1) );
		$('#equipLength').val( $('#planEquipTypeCode').val().substr(1,2) );
		$('#equipHeight').val( $('#planEquipTypeCode').val().substr(3) );
	}
	
	$('#isOverflow').attr("disabled", true);
	
	var calculatedVol = Number($("#totalCubicFt").val());

	if (!(calculatedVol > 0) || isNaN(calculatedVol)) {
		$("#totalCubicFt").val($("#cubicFeet").val());
		$('#totalCubicFt').trigger("change");
		if($("#ldspGroupCode").val() != "" && ($.trim($("#ldspGroupCode").val()) != "CY" )){
			calculatePerPieceVolume($('#pieceCount').val());			
		}else {
			calculatePerPieceVolume($('#equipmentCount').val());			
		}
		
	}
	//For defect D029471
	$("#totalWeightLb").val($("#weightPound").val());
	var totalWeightLBS = $('#totalWeightLb').val();	
	var metricWeight = convertToMetricWeight($('#totalWeightLb').val());
	$('#totalWeightMt').val(metricWeight);
	
	var feets = getFeetFromInches($('#lengthInch').val());
	var remInches = getModInches($('#lengthInch').val());
	$('#lengthFt').val(feets);
	$('#lengthIn').val(remInches);
	if (remInches > 0 || feets > 0) { 
		$('#lengthIn').trigger('change');
	}
	
	var feets = getFeetFromInches($('#heightInch').val());
	var remInches = getModInches($('#heightInch').val());
	$('#heightFt').val(feets);
	$('#heightIn').val(remInches);
	if (remInches > 0 || feets > 0) {
		$('#heightIn').trigger('change');
	}
	
	var feets = getFeetFromInches($('#widthInch').val());
	var remInches = getModInches($('#widthInch').val());
	$('#widthFt').val(feets);
	$('#widthIn').val(remInches);
	if (remInches > 0 || feets > 0) {
		$('#widthIn').trigger('change');
	}
	
	$('#equipType').trigger('change');
	
	showHideAdditionDetails();	
	
	
	if ($("#naVR").is(":checked")) {		
		disableRule20Fields();
		disableVehicleFields();
	}
	if($("#ldspGroupCode").val() != "" && $.trim($("#ldspGroupCode").val()) == "CY"){
		$('#equipmentCount').focus();
		if (!($('#equipmentCount').val() == "" || $('#equipmentCount').val() == 0 || $('#equipmentCount').val() == "0")) {
			
			var perPieceWeightLBS = Math.round(totalWeightLBS/$.trim($('#equipmentCount').val()));
			if (!isNaN(perPieceWeightLBS)) {
				$("#weightImp").val(perPieceWeightLBS);	
			}
			var perPieceWeightMt = convertToMetricWeight($("#weightImp").val());
			if (!isNaN(perPieceWeightMt)) {
				$("#weightMt").val(perPieceWeightMt);
			}
		}
	}else{
		$('#pieceCount').focus();
		if (!($('#pieceCount').val() == "" || $('#pieceCount').val() == 0 || $('#pieceCount').val() == "0")) {
			
			var perPieceWeightLBS = Math.round(totalWeightLBS/$.trim($('#pieceCount').val()));
			if (!isNaN(perPieceWeightLBS)) {
				$("#weightImp").val(perPieceWeightLBS);	
			}
			var perPieceWeightMt = convertToMetricWeight($("#weightImp").val());
			if (!isNaN(perPieceWeightMt)) {
				$("#weightMt").val(perPieceWeightMt);
			}
		}
	}
	unitOfMeasure();
	if($('#statusCode').val() == "ISSD" || $('#statusCode').val()== "BKGD"
		|| (isCommodityDisplayOnly && !isCommodityModifiable)){
		$('#equipmentDiv').gatesDisable();
		$('#commodityDiv').gatesDisable();
		$('#lengthMt').attr("disabled", true);
		$('#heightMt').attr("disabled", true);
		$('#widthMt').attr("disabled", true);
		$('#isConstructedCmdy').attr("disabled", true);
		$('#cubicMt').attr("disabled", true);
		$('#totalCubicMt').attr("disabled", true);
		$('#weightMt').attr("disabled", true);
		$('#totalWeightMt').attr("disabled", true);
	}
	
	if($("#pieceCount").val() == "0"){
		$("#pieceCount").val("");
	}
	if($("#equipmentCount").val() == "0"){
		$("#equipmentCount").val("");
	}
}


function equipPopupSearch() {   
	var actionUrl = _context+"/equipment/lookup/showForm?equipCode="+$('#equipType').val()+"&equipLen="+$('#equipLength').val()+"&equipHt="+$('#equipHeight').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'EquipmentSearch', windowStyle);    
}

function equipUpdate(id){
	var values = id.split(",");
	$('#equipType').val(values[0]);
	$('#equipLength').val(values[1]);
	$('#equipHeight').val(values[2]);
	$('#equipType').trigger('change');
	_isCommodityChanged = true;
	_isCommodityRatingAttributeChanged = true;
}

function disableCommodityHeader() {
	/*$('#quoteNumber', '#quote').attr("disabled", true);
	$('#quoteVersionNumber', '#quote').attr("disabled", true);*/
	$('#commHeadQuoteNumber').attr("disabled", true);
	/*$('#commHeadQuoteVersionNumber').attr("disabled", true);*/
	$('#commHeadStatusCode').attr("disabled", true);
	$('#commHeadUnitOfMeasureSourceCode').attr("disabled", true);
	$('#commHeadLoadServiceCode').attr("disabled", true);
	$('#commHeadDischargeServiceCode').attr("disabled", true);
	$('#routing', '#quote').attr("disabled", true);
	$('#commoditySeqNbrDs', '#quote').attr("disabled", true);
	
	if ($('#noteNo').val() == "") {
		$('#noteNo').val("");
		$('#noteNo').attr("disabled", true);
	} else {		
		$('#noteNo').removeAttr("disabled");
	}
}

function showHideAdditionDetails() {
	var loadDschGroupCode = $("#ldspGroupCode").val();
	if (loadDschGroupCode == "CON" || loadDschGroupCode == "LCL") {
		$("#additionalCargoDetails").show();
	} else {
		$("#additionalCargoDetails").hide();
	}
}

function unitOfMeasure() {
	if ( $("input:radio[name=unitOfMeasureSourceCode]").val() == "I" ) {
		$('#lengthFt').removeAttr("disabled");
		$('#lengthIn').removeAttr("disabled");
		$('#heightFt').removeAttr("disabled");
		$('#heightIn').removeAttr("disabled");
		$('#widthFt').removeAttr("disabled");
		$('#widthIn').removeAttr("disabled");
		
		$('#weightImp').removeAttr("disabled");
		$('#cubicFt').removeAttr("disabled");
		$('#totalCubicFt').removeAttr("disabled");		
		$('#totalWeightLb').removeAttr("disabled");
		
		$('#lengthMt').attr("disabled", true);
		$('#heightMt').attr("disabled", true);
		$('#widthMt').attr("disabled", true);
		$('#cubicMt').attr("disabled", true);
		$('#totalCubicMt').attr("disabled", true);
		$('#weightMt').attr("disabled", true);
		$('#totalWeightMt').attr("disabled", true);
	} else if ($("input:radio[name=unitOfMeasureSourceCode]").val() == "M" ){
		$('#lengthFt').attr("disabled", true);
		$('#lengthIn').attr("disabled", true);
		$('#heightFt').attr("disabled", true);
		$('#heightIn').attr("disabled", true);
		$('#widthFt').attr("disabled", true);
		$('#widthIn').attr("disabled", true);
		
		$('#cubicFt').attr("disabled", true);
		$('#totalCubicFt').attr("disabled", true);
		$('#weightImp').attr("disabled", true);
		$('#totalWeightLb').attr("disabled", true);
		
		$('#lengthMt').removeAttr("disabled");
		$('#heightMt').removeAttr("disabled");
		$('#widthMt').removeAttr("disabled");	
		$('#totalCubicMt').removeAttr("disabled");		
		$('#totalWeightMt').removeAttr("disabled");
		$('#cubicMt').removeAttr("disabled");
		$('#weightMt').removeAttr("disabled");
	}
}

function toggleNoteField() {
	if ($('#tariffNo').val() != "" && $('#itemNo').val() != "" ) {		
		$('#noteNo').removeAttr("disabled");
	} else {
		$('#noteNo').val("");
		$('#noteNo').attr("disabled", true);
	}
}

function getTotalFromPerPiece(perPieceVal, numberOfPieces) {
	return numberOfPieces * perPieceVal;
}

function getPerPieceFromTotal(totalValue, numberOfPieces) {
	return totalValue / numberOfPieces;
}

function validateTariffCode(){
	toggleNoteField();
	var tariffNo = $("#tariffNo").val();
	$.ajax({
		type: "GET",
		url: "/gates/tariff/itemFrtWrf/validateItemCombination?",
		data: "grpType=&grpName="+ tariffNo +"&srcTariff=",
		success: function(msg){
			if(msg=="NotValid"){
				$("#tarrCmdyDesc").val("");								
				$("#itemNo").val("");
				$('#itemNo').attr("disabled", true);
				//Added for D028627
				clearErrorPointers("itemNo");
			}
		}
	});
}

//
function validateNote() {
	var dscr = $("#custCmdyDesc").val();
	var tariffNo = $("#tariffNo").val();
	var itemNo = $("#itemNo").val();
	var estShipDate = $("#commHeadEstShipDateString").text();
	var loadSrvc = $("#commHeadLoadServiceCode").text();
	var dischargeSrvc = $("#commHeadDischargeServiceCode").text();
	var trade = $("#tradeCode").val();
	var blOriginCityCode = $('#blOriginCityCode').val();
	var originPortCityCode = $('#originPortCityCode').val();
	var destinationPortCityCode = $('#destinationPortCityCode').val();
	var blDestinationCityCode = $('#blDestinationCityCode').val();
	if ($("#isConstructed").is(":checked")) {
		loadSrvc = "CY";
		dischargeSrvc = "CY";
		blOriginCityCode = "";
		blDestinationCityCode = "";
	}
	
	
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	blockUI();
	$.ajax({
		url: urlComm,
		type: "POST",
		success: function(responseText){
			$("#tarrCmdyDesc").val(responseText[0].desc);	
			if (trim(responseText[0].noterate).length > 0) {
				$('#noteNo').removeAttr("disabled");
				//$('#noteNo').val("$");
				$('#noteNo').validationEngine('showPrompt', 'A noted rate exists. To look it up press the Browser button next to the Note Nbr field.', 'info', true);		
				isNoteNoPresent = true;
			} else {
				$('#noteNo').val("");
				$('#noteNo').attr("disabled", true);
			}
			
			$.unblockUI();						
		}
	});		
}

function validateItemCode(){ 
	toggleNoteField();
	var tariffNo = $("#tariffNo").val();	
	var itemCode = $("#itemNo").val();
	if($("#tariffNo").val() != ""){
		validateTariffCode();	
	}else{
		$('#itemNo').attr("disabled", true);
	}	
	$.ajax({
		   type: "GET",
		   url: _context +"/tm/traiffRate/validateGrpItmCombination?",
		   data: "grpType=&grpName="+ tariffNo +"&srcTariff=&itemCode="+ itemCode,
		   success: function(msg){
		    if(msg=="NotValid"){
		    	$("#tarrCmdyDesc").val("");				
		    	$("#itemNo").val("");		    	
			}
		 }
	 });	
}

function validatePieceCount(field, rules, i, options) {
	/*var pieceCount = Number($('#pieceCount').val());
	if (isNaN(pieceCount)) {
		return "Only digits are allowed!";		
		$('#pieceCount').validationEngine('showPrompt', 'Only digits are allowed!', 'error', true);
		return false;
	}
	var loadDschGroupCode = $.trim($("#ldspGroupCode").val());
	if ( ($('#equipmentCount').val() == 0 || $('#equipmentCount').val() =="" ) && $.trim($('#pieceCount').val()) > 200 ) {
		alert("Piece count must be 200 or less if equipment count is zero");
		$('#pieceCount').val("1");
		$("#pieceCount").trigger('change');
	}*/
	/*
	if (loadDschGroupCode == "CFS" || loadDschGroupCode == "CON" || loadDschGroupCode == "AU") {
		if ($('#pieceCount').val()=="") {
			var rulesLength = rules.length;
			rules[rulesLength] = "required";
			$('#pieceCount').validationEngine('showPrompt', 'Equipment Piece Count must be present for the CFS, CON and AU load and discharge services', 'error', true);
			return false;
			return "Equipment Piece Count must be present for the CFS, CON and AU load and discharge services";
		} else if ($('#pieceCount').val()=="0") {
			$('#pieceCount').val("1");
		}
	}
*/}

function validateAddnDetails(field, rules, i, options) {
	var loadDschGroupCode = $("#ldspGroupCode").val();
	
	if ( (loadDschGroupCode == "CON" || loadDschGroupCode == "LCL") && $("#placeOfReceiptLoadPort").val() == null) {
		var rulesLength = rules.length;
		rules[rulesLength] = "required";
		/*return "Conventional Cargo details must be present for the 'CON' Load & Discharge Service";*/
		$('#placeOfReceiptLoadPort').validationEngine('showPrompt', 'Conventional Cargo details must be present for the "CON/LCL" Load & Discharge Service', 'error', true);
		//return false; // commented for defect# 24871
	}
}

function validatePlReceiptDscr(field, rules, i, options) {
	if ( ($("#placeOfReceiptLoadPort").val() == "Others") && ($("#placeOfReceiptDescription").val() == "") ) {
		var rulesLength = rules.length;
		rules[rulesLength] = "required";
		/*return "This field is compulsary for the selected Received at value";*/
		$('#placeOfReceiptDescription').validationEngine('showPrompt', 'This field is compulsary for the selected Received at value', 'error', true);
		return false;
	}
}

function calculatePerPieceVolume(value) {
	var volumePerPiece = $('#lengthMt').val() * $('#heightMt').val() * $('#widthMt').val() ;
	$('#cubicMt').val(Math.round(volumePerPiece));	
	var lengthIn = Number($('#lengthFt').val() * 12) + Number($('#lengthIn').val());
	var heightIn = Number($('#heightFt').val() * 12) + Number($('#heightIn').val());
	var widthIn = Number($('#widthFt').val() * 12) + Number($('#widthIn').val());
	cubicFeet = Math.round((lengthIn * heightIn * widthIn)/1728);
	if (cubicFeet > 0) {
		$('#cubicFt').val(cubicFeet);
		//$('#cubicFt').trigger('change'); //MANISHB: DO NOT UNCOMMENT THIS
	} else {
		var pieceCount = $.trim(value);
		var totalVolume = $('#totalCubicFt').val();
		if ( (pieceCount != "" && pieceCount != "0") && ( totalVolume != "" ) ) {
			var pieceVolume = Math.round(totalVolume/pieceCount);
			if (isNaN(pieceVolume)) {
				return;
			}
			$('#cubicFt').val(pieceVolume);
			$('#cubicMt').val(convertToMetricVolume(pieceVolume));
		}
	}
}

function calculatePerPieceVolumeForDimensions(value) {
	var volumePerPiece = $('#lengthMt').val() * $('#heightMt').val() * $('#widthMt').val() ;
	$('#cubicMt').val(Math.round(volumePerPiece));	
	var lengthIn = Number($('#lengthFt').val() * 12) + Number($('#lengthIn').val());
	var heightIn = Number($('#heightFt').val() * 12) + Number($('#heightIn').val());
	var widthIn = Number($('#widthFt').val() * 12) + Number($('#widthIn').val());
	cubicFeet = Math.round((lengthIn * heightIn * widthIn)/1728);
	var pieceCount = $.trim(value);
	$('#cubicFt').val(cubicFeet);
	$('#totalCubicFt').val(Math.round(cubicFeet * pieceCount));
	$('#totalCubicMt').val(Math.round(volumePerPiece * pieceCount));
}

function calculateMetricVolume(value) {	
	var ifCbMt = false;	
	var lengthMt = $.trim($('#lengthMt').val());
	var heightMt = $.trim($('#heightMt').val());
	var widthMt =  $.trim($('#widthMt').val());
	var volumeMetric = Math.round((lengthMt * heightMt * widthMt));
	if (volumeMetric > 0) {
		$('#cubicMt').val(volumeMetric);
	}
	
	if ((lengthMt == 0 || lengthMt == "") && (heightMt == 0 || heightMt == "") && (widthMt == 0 || widthMt == "")) {
		if ($('#totalCubicMt').val() > 0) {
			volumeMetric = $('#totalCubicMt').val();
		}else if ($('#cubicMt').val() > 0) {
			volumeMetric = $('#cubicMt').val();
			ifCbMt = true;
		}
	}
	var volImperial = convertToImperialVolume(volumeMetric);
	
	/*var pieceCount = $.trim($('#pieceCount').val());*/
	var pieceCount = value;
	if (!validateMetricFields(value)) {
		return;
	}
	
	if (pieceCount == "" || pieceCount == 0) {
		/*$('#totalCubicMt').val(Math.round(volumeMetric));
		$('#totalCubicFt').val(volImperial);*/
		$('#totalCubicMt').val("");
		$('#totalCubicFt').val("");
		$('#cubicMt').val("");
		$('#cubicFt').val("");

	} else {
		if(!ifCbMt){			
			$('#totalCubicMt').val(Math.round(volumeMetric));
			$('#totalCubicFt').val(volImperial);
			$('#cubicMt').val(Math.round(volumeMetric/pieceCount));
			$('#cubicFt').val(Math.round(volImperial/pieceCount));
		}
		calculateTotalVolume(value);
	}	
}

function calculateImperialVolume(value) {
	var ifCbFt = false;
	var lengthIn = Number($('#lengthFt').val() * 12) + Number($('#lengthIn').val());
	var heightIn = Number($('#heightFt').val() * 12) + Number($('#heightIn').val());
	var widthIn = Number($('#widthFt').val() * 12) + Number($('#widthIn').val());
	var volImperial = Math.round((lengthIn * heightIn * widthIn)/1728);
	if (volImperial > 0) {
		$('#cubicFt').val(volImperial);
	}
	
	if (lengthIn == 0 && heightIn == 0 && widthIn == 0) {
		if ($('#totalCubicFt').val() > 0) {
			volImperial = $('#totalCubicFt').val();
		}else if ($('#cubicFt').val() > 0) {
			volImperial = $('#cubicFt').val();
			ifCbFt = true;
		}
	}
	var volumeMetric = convertToMetricVolume(volImperial);
	
	/*var pieceCount = $.trim($('#pieceCount').val());*/
	var pieceCount = value;
	
	if (!validateImperialFields(value)) {
		return;
	}
	
	if (pieceCount == "" || pieceCount == 0) {
		/*$('#totalCubicMt').val(Math.round(volumeMetric));
		$('#totalCubicFt').val(volImperial);*/
		$('#totalCubicMt').val("");
		$('#totalCubicFt').val("");
		$('#cubicMt').val("");
		$('#cubicFt').val("");

	} else {
		if(!ifCbFt){
			$('#totalCubicMt').val(Math.round(volumeMetric));
			$('#totalCubicFt').val(volImperial);
			$('#cubicMt').val(Math.round(volumeMetric/pieceCount));
			$('#cubicFt').val(Math.round(volImperial/pieceCount));
		}		
		calculateTotalVolume(value);
	}	
}

function validateImperialFields(value) {
	var isValidFields = true;
	var pieceCount = Number(value);
	var lengthFt = Number($('#lengthFt').val());
	var lengthIn = Number($('#lengthIn').val());
	var heightFt = Number($('#heightFt').val());
	var heightIn = Number($('#heightIn').val());
	var widthFt = Number($('#widthFt').val());
	var widthIn = Number($('#widthIn').val());
	if (isNaN(pieceCount)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(lengthFt)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(lengthIn)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(heightFt)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(heightIn)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(widthFt)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(widthIn)) {
		isValidFields = false;
		return isValidFields;
	}
	return isValidFields;
}

function validateMetricFields(value) {
	var isValidFields = true;
	var pieceCount = Number(value);
	var length = Number($('#lengthMt').val());
	var height = Number($('#heightMt').val());
	var width = Number($('#widthMt').val());
	if (isNaN(pieceCount)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(length)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(height)) {
		isValidFields = false;
		return isValidFields;
	}
	if (isNaN(width)) {
		isValidFields = false;
		return isValidFields;
	}
	return isValidFields;
}

function calculateTotalVolume(value) {
	var pieceCount = $.trim(value);
	var pieceVolume = $('#cubicFt').val();
	var pieceMetricVolume = $('#cubicMt').val();
	var totalVolume = 0;
	
	if ( (pieceCount != "") && ( pieceVolume != "" ) ) {
		
		if(!($("#lengthFt").val() == "" && $("#widthFt").val() == "" && $("#heightFt").val() == "" )
				|| isCbFtChangeFlag){
			totalVolume = pieceCount * pieceVolume;
			if (isNaN(totalVolume)) {
				return;
			}
			$('#totalCubicFt').val(totalVolume);
		}else{			
			totalVolume = pieceCount * pieceVolume;
			$('#totalCubicFt').val(totalVolume);
		}		
		if(isMetricOff){
			var metricVol = convertToMetricVolume(totalVolume);
			if (isNaN(metricVol)) {
				$('#totalCubicMt').val("");
				return;
			}
			$('#totalCubicMt').val(metricVol);
		}
		
		if (totalVolume > 4294967295) {
			alert("Total Volume exceeds maximum allowed value");
			return;
		}
	}
}

function calculateTotalWeight(value) {
	var pieceCount = $.trim(value);
	var pieceWeight = $('#weightImp').val();
	var poundWeight = $('#totalWeightLb').val();
	
	var totalWeight = 0 ;
	if ( (pieceCount != "") && ( pieceWeight != "" || totalWeightLb != "") ) {
		if(pieceWeight != "" && pieceWeight != ""){
			if(poundWeight % pieceCount == 0 || isWtImpChangeFlag){
				totalWeight = pieceCount * pieceWeight;
				if (isNaN(totalWeight)) {
					return;
				}
				$('#totalWeightLb').val(totalWeight);	
			}else{
				totalWeight = pieceCount * pieceWeight;
				$('#totalWeightLb').val(totalWeight);	
				var perPieceImpWt = poundWeight / pieceCount;
				if (isNaN(perPieceImpWt) || perPieceImpWt == "Infinity") {
					return;
				}
				//$('#weightImp').val(Math.round(perPieceImpWt));
				var metricWeight = convertToMetricWeight(perPieceImpWt);
				if (isNaN(metricWeight)) {
					return;
				}
				//$('#weightMt').val(metricWeight);
			}
			if(isMetricOff){
				var totalMetricWeight = convertToMetricWeight(totalWeight);
				if (isNaN(totalMetricWeight) || totalMetricWeight == "Infinity") {
					return;
				}
				$('#totalWeightMt').val(totalMetricWeight);	
			}			
			if (totalWeight > 4294967295) {
				alert("Total Weight exceeds maximum allowed value");
				return;
			}
		}else if(poundWeight != "" && poundWeight != ""){
			var perPieceImpWt = poundWeight / pieceCount;
			if (isNaN(perPieceImpWt) || perPieceImpWt == "Infinity") {
				return;
			}
			//$('#weightImp').val(Math.round(perPieceImpWt));
			var metricWeight = convertToMetricWeight(perPieceImpWt);
			if (isNaN(metricWeight)) {
				return;
			}
			//$('#weightMt').val(metricWeight);
		}
	}else if(pieceCount == "" || pieceCount == "0"){		
		$('#weightImp').val("");
		$('#weightMt').val("");		
	}
}

function enableRule20Fields() {
	$('#isRule20LoadCodeC').removeAttr("disabled");
	$('#isRule20LoadCodeS').removeAttr("disabled");
	$('#rule20WhoseEquipmentCodeC').removeAttr("disabled");
	$('#rule20WhoseEquipmentCodeS').removeAttr("disabled");
	$('#rule20WhoseEquipmentCodeN').removeAttr("disabled");
	$('#rule20EquipmentTypeCodeF').removeAttr("disabled");
	$('#rule20EquipmentTypeCodeT').removeAttr("disabled");
	$('#rule20EquipmentTypeCodeN').removeAttr("disabled");
}

function disableVehicleFields() {
	$('#isVehicle').attr("checked", false);
	$('#isTrackCleatedVehicle').attr("checked", false);
	$('#isSelfPropelled').attr("checked", false);
	$('#isVehicle').attr("disabled", true);
	$('#isTrackCleatedVehicle').attr("disabled", true);
	$('#isSelfPropelled').attr("disabled", true);
}

function disableRule20Fields() {
	
	$('#isRule20LoadCodeC').attr("checked", false);
	$('#isRule20LoadCodeS').attr("checked", false);
	$('#rule20WhoseEquipmentCodeC').attr("checked", false);
	$('#rule20WhoseEquipmentCodeS').attr("checked", false);
	$('#rule20WhoseEquipmentCodeN').attr("checked", false);
	$('#rule20EquipmentTypeCodeF').attr("checked", false);
	$('#rule20EquipmentTypeCodeT').attr("checked", false);
	$('#rule20EquipmentTypeCodeN').attr("checked", false);
	
	
	$('#isRule20LoadCodeC').attr("disabled", true);
	$('#isRule20LoadCodeS').attr("disabled", true);
	$('#rule20WhoseEquipmentCodeC').attr("disabled", true);
	$('#rule20WhoseEquipmentCodeS').attr("disabled", true);
	$('#rule20WhoseEquipmentCodeN').attr("disabled", true);
	$('#rule20EquipmentTypeCodeF').attr("disabled", true);
	$('#rule20EquipmentTypeCodeT').attr("disabled", true);
	$('#rule20EquipmentTypeCodeN').attr("disabled", true);
}

function enableVehicleFields() {
	$('#isVehicle').removeAttr("disabled");
	$('#isTrackCleatedVehicle').removeAttr("disabled");
	$('#isSelfPropelled').removeAttr("disabled");
}

function setConventionalCargoDetails()
{
	if($('#isRule20LoadCodeC').attr("checked")==true || 
			$('#isRule20LoadCodeS').attr("checked")==true || 
			$('#rule20WhoseEquipmentCodeC').attr("checked")==true || 
			$('#rule20WhoseEquipmentCodeS').attr("checked")==true || 
			$('#rule20WhoseEquipmentCodeN').attr("checked")==true || 
			$('#rule20EquipmentTypeCodeF').attr("checked")==true || 
			$('#rule20EquipmentTypeCodeT').attr("checked")==true || 
			$('#rule20EquipmentTypeCodeN').attr("checked")==true)
				$('#rule20').attr("checked", true);
	else if($('#isVehicle').attr("checked")==true || 
			$('#isTrackCleatedVehicle').attr("checked")==true || 
			$('#isSelfPropelled').attr("checked")==true)
				$('#vehicle').attr("checked", true);
}

function removeCommodityErrorPointers() {
 	$('#quoteCommodityForm').validationEngine('hideAll');
 }

/** clears the validation messages */
function clearErrorPointers(el) {
    if (el) {
        if (typeof el != 'string') {
            el = el.id
        }

        var elValue = $('#' + el).val()

        if (elValue != '' || elValue != null || elValue != 'undefined') {
            $('#' + el).validationEngine('hideAll');
        }
    }
}

function resetCubeFields() {
	$("#cubicFt").val("");
	$("#totalCubicFt").val("");
	
	$("#cubicMt").val("");
	$("#totalCubicMt").val("");
}

function resetWeightFields() {
	$("#weightImp").val("");
	$("#totalWeightLb").val("");
	
	$("#weightMt").val("");
	$("#totalWeightMt").val("");
}

function resetImperialLength() {
	$("#lengthFt").val("");
	$("#lengthIn").val("");
}

function resetImperialHeight() {
	$("#heightFt").val("");
	$("#heightIn").val("");
}

function resetImperialWidth(){
	$("#widthFt").val("");
	$("#widthIn").val("");
}

function autoTab(CurrentElementID, NextElementID, FieldLength) {
    //Get a reference to the two elements in the tab sequence.
    var CurrentElement = $('#' + CurrentElementID);
    var NextElement = $('#' + NextElementID);
 
    CurrentElement.keyup(function(e) {
        //Retrieve which key was pressed.
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
 
        //If the user has filled the textbox to the given length and the user just pressed 
        // a number or letter, then move the cursor to the next element in the tab sequence.   
        if (CurrentElement.val().length >= FieldLength
            && ((KeyID >= 48 && KeyID <= 90) ||
            (KeyID >= 96 && KeyID <= 105)))
            NextElement.focus();
    });
}

function resetMeasurement() {
	$("#lengthFt").val("");
	$("#lengthIn").val("");
	$("#heightFt").val("");
	$("#heightIn").val("");
	$("#widthFt").val("");
	$("#widthIn").val("");
	
	$('#lengthMt').val("");
	$('#heightMt').val("");
	$('#widthMt').val("");
}

function blankOutDimensionsAndCbFtPc(){
	resetMeasurement();
	$('#cubicFt').val("");
	$('#cubicMt').val("");
}
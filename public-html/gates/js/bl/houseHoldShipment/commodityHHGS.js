var src='';
var lastCommodityLoadService ="";
var lastCommodityDischargeService="";
var somethingChangedCommodityHHGS = "";
var commodityHHGSMode="";
var dataName =  null;
var grpId = null;
var itemId = null;
$(document).ready(function() {
	getAllLoadServiceOfCYtype();
	$('#houseHoldItemRespPartyCode').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#shipmentAddressRoleName').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#householdGoodsMarkForName').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#loadServiceCodeHHGS').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#dschServiceCodeHHGS').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#gblNumber').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	/*$('#placeOfReceiptCommodityHHGS').change(function(){
		somethingChangedCommodityHHGS = true;
	});*/
	/*$('#placeOfDeliveryCommodityHHGS').change(function(){
		somethingChangedCommodityHHGS = true;
	});*/
	
	
	$('#item').change(function(){
		somethingChangedCommodityHHGS = true;
		if(itemId==null || itemId==""){				
	     	 $('form input[name=item]').val('');
	     	 $("#item").val("");  	
	 	  }		
			else{
				$("#item").val(dataName); 
				itemId="";
			}
	});
	$('#shipmentItemPices').change(function(){
		somethingChangedCommodityHHGS = true;
	});
	$('#shipmentItemTotalPieceCount').change(function(){
         		somethingChangedCommodityHHGS = true;
         	});
	$('#pieceUnitOfMeasureCode').change(function(){
    		somethingChangedCommodityHHGS = true;
    	});
	$('#weight').change(function(){
		if ($('#measurementSourceHHGS').text()=="I" ){
			var impweight = $('#weight').val();
			$('#weight').val(parseInt(impweight));
		}
		somethingChangedCommodityHHGS = true;
	});
	$('#cube').change(function(){
		if ($('#measurementSourceHHGS').text()=="I" ){
			var impcube = $('#cube').val();
			$('#cube').val(parseInt(impcube));
		}
		somethingChangedCommodityHHGS = true;
	});
	
	
	
	$('#shipmentHouseHoldItemForm').validationEngine('attach');
	$( "#commodityHHGSOverlay" ).dialog({
		autoOpen: false, 
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			
			
		},
		close : function() {
			$('#shipmentHouseHoldItemForm').validationEngine('hideAll');
			tabSequence('#shipmentHouseHoldForm',true,false);
		},
		open : function() {
			getAllLoadServiceOfCYtype();
			tabSequence('#commodityHHGSOverlay',false,false);
		},
		buttons : {
			
			 
			
		"Ok & New": function(){
			
			if( $("#shipmentHouseHoldItemForm").validationEngine('validate')){
					if($("#shipmentHouseHoldItemForm").validationEngine('validate'))
		    		{
						src="OkAndNew";
						if($('#shipmentAddressRoleId').val()=="" || $('#shipmentAddressRoleId').val()==null || $('#shipmentAddressRoleId').val()==undefined){
							alert("Please Select Address Role for Organization first.");
							return false;
						}else{
							
						
						if(commodityHHGSMode =="addNewHHGSCommodity"){
							addHHGSCommodityOkandNew();
			        	}else if(commodityHHGSMode =="editHHGSCommodity"){
			        		updateHHGSCommodityOkNew();
			        	}
						
		    		}
		    		}
			}
		        },
		    	"Ok & Copy": function(){
		    		if( $("#shipmentHouseHoldItemForm").validationEngine('validate')){
						if($("#shipmentHouseHoldItemForm").validationEngine('validate'))
			    		{
							if($('#shipmentAddressRoleId').val()=="" || $('#shipmentAddressRoleId').val()==null || $('#shipmentAddressRoleId').val()==undefined){
								alert("Please Select Address Role for Organization first.");
								return false;
							}else{
							
								if(commodityHHGSMode =="addNewHHGSCommodity"){
									addHHGSCommodityNew();
					        	}else if(commodityHHGSMode =="editHHGSCommodity"){
					        		updateHHGSCommodityOkCopy();
					        	}
			    		}
					}
			    		}
				
				        },
	        Ok: function(){
	        	
	        	if( $("#shipmentHouseHoldItemForm").validationEngine('validate')){
	        	if($("#shipmentHouseHoldItemForm").validationEngine('validate'))
	        		{
	        		if($('#shipmentAddressRoleId').val()=="" || $('#shipmentAddressRoleId').val()==null || $('#shipmentAddressRoleId').val()==undefined){
						alert("Please Select Address Role for Organization first.");
						return false;
					}else{
			        	if(commodityHHGSMode =="addNewHHGSCommodity"){
			        		addHHGSCommodity();
			        	}else if(commodityHHGSMode =="editHHGSCommodity"){
			        		updateHHGSCommodity();
			        	}
	        		}
	        		}
	        	}
	        },
	        Clear: function() {
	        	$('#shipmentAddressLine1').text("");
	        	$('#shipmentCityStateZip').text("");
	        	
				$('#loadServiceCodeHHGS').val("");
				$('#dschServiceCodeHHGS').val("");
				$('input[name="shipmentBillToOrganizationId"]').val("");
	        	$("#shipmentHouseHoldItemForm").clearForm();
	        	$('#houseHoldItemRespPartyCode').val("P");
	        },
	        Cancel: function() {

	        	 if(somethingChangedCommodityHHGS == true ){
	        		 
	   		  var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
	   		if(conf== true ){
	   			$('#shipmentHouseHoldItemForm').validationEngine('hideAll');
	   		 $("#commodityHHGSOverlay").dialog('close');
	   		somethingChangedCommodityHHGS == false;	   		
				}else{
					}
				}else{
					$('#shipmentHouseHoldItemForm').validationEngine('hideAll');
					 $("#commodityHHGSOverlay").dialog('close');
				}
	        }
	       
		}
	});
	
	$('#item').live('keydown', function(event) {
		if (event.keyCode == '16') {
			return;
		}
			
		if (event.keyCode == '9' ) {
			event.preventDefault();
			if (event.shiftKey) {
				$('#tariffHHGS').focus();
			}else{
				$('#shipmentAddressRoleName').focus();
				
			}
				}
			});
	$('#commodityHHGSAdd').click(function(){
		
		$.ajax({
			 type:"POST",
			 url:_context+"/houseHoldShipment/AddNewCommodity",
			
			success: function(responseText){
				if(responseText.success==true){					
					$('#msgDivCommodityOverlay').text("");
					$('#shipmentAddressLine1').text("");
		        	$('#shipmentCityStateZip').text("");
		        	
					$('#loadServiceCodeHHGS').val("");
					$('#dschServiceCodeHHGS').val("");					
					$("#shipmentHouseHoldItemForm").clearForm();
					$('#houseHoldItemRespPartyCode').val("P");
					$(":button:contains('Ok & New')").prop("disabled", false).removeClass("ui-state-disabled");
					$('#shipmentHouseHoldItemForm').loadJSON(responseText.data);
					populateLoadServiceCommodity(responseText.data);
					populateDschServiceCommodity(responseText.data);
					setCommoditySectionData(responseText);
					enableDisableInputFields(responseText.data);
					  $("#commodityHHGSOverlay").dialog( "option", "title", 'Add Commodity' );
			           $("#commodityHHGSOverlay").dialog('open');	
			           commodityHHGSMode = "addNewHHGSCommodity";
			           $('#shipmentAddressRoleName').focus();
			          // tabSequence('#shipmentHouseHoldItemForm');
			           $('#separateBill').val("N");
			        	$('#separateBill').prop("disabled", false);
			}else{
				}
			}
		
	});
	
});
	
	
	/// 	Bill To predictive
	

	$('input[name="shipmentAddressRoleName"]').gatesAutocomplete(
		{
			source:_context+'/cas/autocomplete.do',
			name: "Payee",
		 	extraParams: {
		 		method: 'searchOrg',
		 		 searchType: '229',
		 		parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
		 	},
			//source : urlShipperOrg,
		
			formatItem : function(item) {
				$('input[name="shipmentBillToOrganizationId"]').val("");
		 			return item.name+"-"+item.abbr;
		 		},
					
		 	
			formatResult : function(item) {
				return item.name + "-" + item.abbr;
			},
			autoSelectWhenSingle:true,
			autoSelectFirst:true,
			/*select : function(data) {
				$('input[name="shipmentAddressRoleName"]').val(data.name + "-" + data.abbr);
				$('#shipmentBillToAddressRoleNamewthoutAbbr').val(data.name);
				$('#shipmentBillToName').val($('input[name="shipmentAddressRoleName"]').val());
				$('input[name="shipmentBillToOrganizationCode"]').val(data.abbr);
				$('input[name="shipmentBillToOrganizationId"]').val(data.id);

				shipperId = data.id;
				$('#shipmentAddressLine1').text("");
				$('#shipmentAddressLine2').text("");
				$("#shipperAddressRoleName").val("");

				
				$('input[name="shipmentBillToIsOneTimeCustomer"]').val("false");
				//shipperAddressPredictive();
				//against 21775- to pull address automatically if only one
				fetchAddresssDetailsIfOneOrgAddress(shipperId);
				
				//shipperHHGSAddressPopupSearch();
			}*/
			
			select : function(item) {
		 		orgId=item.orgid;	
		 		
		 		/*$('input[name="shipmentAddressRoleName"]').val(item.name + "-" + item.abbr);
				$('#shipmentBillToAddressRoleNamewthoutAbbr').val(item.name);
				$('#shipmentBillToName').val($('input[name="shipmentAddressRoleName"]').val());
				$('input[name="shipmentBillToOrganizationCode"]').val(item.abbr);
				$('input[name="shipmentBillToOrganizationId"]').val(item.orgid);
				$('input[name="shipmentAddressRoleId"]').val(item.arolid);
				$('#shipmentAddressLine1').text("");
				$('#shipmentAddressLine2').text("");
				$("#shipperAddressRoleName").val("");

				
				$('input[name="shipmentBillToIsOneTimeCustomer"]').val("false");*/
		 		$('input[name="shipmentAddressRoleName"]').val(item.name + "-" + item.abbr);
		 		$('#shipmentBillToAddressRoleNamewthoutAbbr').val(item.name );
		 		$('#shipmentBillToName').val($('input[name="shipmentAddressRoleName"]').val());
		 		$('input[name="shipmentBillToOrganizationCode"]').val(item.abbr);
		 		$('input[name="shipmentBillToOrganizationId"]').val(item.id);
		 		$('#shipmentAddressLine1').text("");
				$('#shipmentAddressLine2').text("");
				$("#shipperAddressRoleName").val("");
				
				$('input[name="shipmentBillToIsOneTimeCustomer"]').val("false");
		 		
		 		
				$.ajax({
					   type: "GET",
					   async:false,
					   url: _context +"/cas/autocomplete.do?method=searchSingleAroleForOrg&searchType=377",
					   data: "parentSearch="+ $('#shipmentBillToOrganizationId').val()+"&term=Y",
					   success: function(json)
			            {
			            	if(json!=null){ 
			            		populateAddressRole(json[0].id);              
			            	}      
			            else
			            	{  
			            	billTOHHGSArolPopupSearch();
			                }
			            }});
		 			/*
		 			fetchAddresssDetailsIfOneOrgAddress(item.addid);
		 		}else if(item.count>1){
		 			shipperHHGSAddressPopupSearch();
		 			//checkForPayableCarrier(orgId,1,item);
		 		}*/
		 		isSpecialServiceChanged=true;
		 	}
			
			
		});
	
	// Shipper Pop-Up Search
	$('input[name="shipmentAddressRoleName"]').gatesPopUpSearch({
		func : function() {
			//shipperPopupSearch();
			billTOHHGSArolPopupSearch();
		}
	});

	$('#shipmentAddressRoleName').change(function(){
		
		if($('#shipmentAddressRoleName').val()=="" ||$('#shipmentAddressRoleName').val()==undefined || $('#shipmentAddressRoleName').val().trim()=="" || 
				$('#shipmentAddressRoleName').val()==null){
			
			$('#shipmentAddressLine1').text("");
			$('#shipmentCityStateZip').text("");
			$('#shipmentBillToOrganizationId').val("");
			$('#shipmentAddressRoleId').val("");
			$('#shipmentBillToOrganizationCode').val("");
			$('#shipmentBillToAddressRoleName').val("");
		}
		
		
	});
	
	
	
	$('#loadServiceCodeHHGS').change(function() {
		var loadServiceCode = $('#loadServiceCodeHHGS :selected').val();
		var dischargeServiceCode = $('#dschServiceCodeHHGS :selected').val();
		
		$('#dschServiceCodeHHGS').attr("disabled", true);
		clearAllCommodityMessage();
		$.ajax({
			async:false,
			url: _context +"/houseHoldShipment/updateLoadDischargeList",
			data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode},
			success: function(responseTextFirst){
				if(responseTextFirst.success)
				{
					enableDisableInputFields(responseTextFirst.data);
					if(responseTextFirst.data.dschServices.length>1){
						populateDschServiceCommodity(responseTextFirst.data);
						}
					   if(responseTextFirst.data.loadServices.length>1){
						populateLoadServiceCommodity(responseTextFirst.data);
						}
					$('#loadServiceCodeHHGS').val(responseTextFirst.data.loadServiceCodeHHGS);
					$('#dschServiceCodeHHGS').val(responseTextFirst.data.dschServiceCodeHHGS);
				}
				else
				{
					
				}
				$('#dschServiceCodeHHGS').attr("disabled", false);
				}
			});
		});
		

	
	$('#dschServiceCodeHHGS').change(function() {
		var loadServiceCode = $('#loadServiceCodeHHGS :selected').val();
		var dischargeServiceCode = $('#dschServiceCodeHHGS :selected').val();
	
		$('#loadServiceCodeHHGS').attr("disabled", true);
		clearAllCommodityMessage();
		
			$.ajax({
				async:false,
				url: _context +"/houseHoldShipment/updateLoadDischargeList",
				data:{loadService:loadServiceCode, dischargeService:dischargeServiceCode},
				success: function(responseTextFirst){
					if(responseTextFirst.success)
					{ 
						enableDisableInputFields(responseTextFirst.data);
						if(responseTextFirst.data.dschServices.length>1){
						populateDschServiceCommodity(responseTextFirst.data);
						}
					   if(responseTextFirst.data.loadServices.length>1){
						populateLoadServiceCommodity(responseTextFirst.data);
						}
						$('#loadServiceCodeHHGS').val(responseTextFirst.data.loadServiceCodeHHGS);
						$('#dschServiceCodeHHGS').val(responseTextFirst.data.dschServiceCodeHHGS);
					}
					else
					{
						
					}
					$('#loadServiceCodeHHGS').attr("disabled", false);
				}
			});
		
		
	});
	
	// Autocompleter and lookup for BL Destination
	$('#placeOfDeliveryCommodityHHGS').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		formatItem : function(item) {
			return item.cityCode+"-"+item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode;
		},
		select : function(item) {
			$('#placeOfDeliveryCommodityHHGS').val(item.cityCode);
		},
		autoSelectFirst:true,
		autoSelectCriteria:function(item){
			if(item.cityCode.toUpperCase()==$('#placeOfDeliveryCommodityHHGS').val().toUpperCase())
				{
				return true;
				}
			else
				{
				return false;
				}
		},
		onChange:function() {
			somethingChangedCommodityHHGS = true;
		}
	});

	$('#placeOfDeliveryCommodityHHGS').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#placeOfDeliveryCommodityHHGS').val(), 5);
		}
	});
	
	
	
	// Autocompleter and lookup for BL Origin
	$('#placeOfReceiptCommodityHHGS').gatesAutocomplete({
		source : _context + '/tm/Autocomplete/autoCompCity',
		formatItem : function(item) {
			return item.cityCode+"-"+item.cityName;
		},
		formatResult : function(item) {
			return item.cityCode;
		},
		select : function(item) {
			$('#placeOfReceiptCommodityHHGS').val(item.cityCode);
			
		},
		autoSelectFirst:true,
		autoSelectCriteria:function(item){
			if(item.cityCode.toUpperCase()==$('#placeOfReceiptCommodityHHGS').val().toUpperCase())
				{
				return true;
				}
			else
				{
				return false;
				}
		},
		onChange:function() {
			somethingChangedCommodityHHGS = true;
		}
	});

	$('#placeOfReceiptCommodityHHGS').gatesPopUpSearch({
		func : function() {
				placePopupSearch($('#placeOfReceiptCommodityHHGS').val(), 2);
		}
	});
	
	 var urlKind = _context+'/cas/autocomplete.do?method=searchTariffTranslateCodeForTrade&searchType=379&parentSearch='+$('#tradeCode').val();
    		 $("#pieceUnitOfMeasureCode").gatesAutocomplete({
    		 source: urlKind,

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

	$('#tariffHHGS').gatesAutocomplete({
		 source: _context+'/cas/autocomplete.do',
			 extraParams: {
			 		 method: 'searchTariffSource',
			 		 searchType: '11',
			 		 mustMatch:true,
			 		 groupType:  '01'
			 },
			//Added autoselect for D028173
		  autoSelectFirst:true,
			// mustMatch:true,
	     formatItem: function(data) {
	    	 dataName=data.name;
			 grpId=data.id;
		 return data.name;
		 },
		 formatResult: function(data) {
			 //Added for D028173
				dataName=data.name;
				grpId=data.id;
		 return data.name;
		 }, 
		 select: function(data) {
		 $('#tariffHHGS').val(data.id);
		 tariffNumber =  $('#tariffHHGS').val();
		 }
		 });
	
	$('#tariffHHGS').change(function(){
		somethingChangedCommodityHHGS = true;
		$('#item[name="item"]').val("");
		if(grpId==null ||grpId==""){
	    	$("#tariffHHGS").val(""); 
		}
		else{
			$("#tariffHHGS").val(dataName);			
				//$('#in_item').removeAttr("disabled");
		}	
		//Added for D028173
		dataName = "";
		grpId="";
	});
	
	$('#tariffHHGS').gatesPopUpSearch({
		 func:function() {			
			 SourceTariffCommodityPopupSearch();
		 }
			 
	});
	$('form input[name=item]').gatesPopUpSearch({
		 func:function() {			
			 ItemCommodityPopupSearch();
		 }
			 
	});
	
	//$('#item').gatesAutocomplete({
	$('form input[name=item]').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do',
		minLength: 1,
		 extraParams: {
 			 method: 'searchItemName',
 		 		 searchType: '43',
 		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
 		 		 groupType:  '01',
 		 		 sourceTariff:  function(){return ($('#tariffHHGS').val()==null || $.trim($('#tariffHHGS').val())=='')?"ALL":$('#tariffHHGS').val();},
 		 		 groupName:   function(){return ($('#tariffHHGS').val()==null || $.trim($('#tariffHHGS').val())=='')?"ALL":$('#tariffHHGS').val();}
 		 },
	 formatItem: function(data) {
		 dataName=data.name;
		 itemId=data.id ;
	 		 return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 autoSelectWhenSingle : true,
		 select: function(data) {
			 somethingChanged = true;
			// $('#tariffItemId').val(data.id);
					//resetTariffDetails(data.id,data.name);
			 $('form input[name=item]').val(data.name);
			itemId=data.id ;
			//getPrimaryCommodity($('#tariffNumber').val(), data.name);	
			//$("#note").val("");
		 },
		 autoSelectFirst:true
	});		
	// $('#item').gatesPopUpSearch({func:function() { ItemCommodityPopupSearch();}});
});


function SourceTariffCommodityPopupSearch() {  
	tariffReferenceScreen ="CommodityDetailOverlay";
	 var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+01+"&sourceTariff="+$('#tariffHHGS').val();
	 tariffNumber =$('#tariffNumberHHGS').val();
	 var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	 window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
	 }

//D027252
function itemNameSearchUpdate(id){

	 var values = id.split("|");
     	if(itemReferenceScreen =="shipmentDetailItemValue"){
       	$('#shipmentItemNumber').val(values[0]);
     	}else{
     		$('#item').val(values[0]);
     	}
  	//somethingChanged = true;
  	//getPrimaryCommodity($('#tariffNumber').val(), $('#shipmentItemNumber').val());		  	
  	//$("#note").val("");
} 

function ItemCommodityPopupSearch() { 
	itemReferenceScreen ="CommodityDetailItemValue";
	if ($('#item').is('[readonly]') ) {}else{
	var actionUrl = _context+"/cas/itemnamelookup.do?sourceTariff="+$('#tariffHHGS').val()+"&grpName="+$('#tariffHHGS').val()+"&grpTyp=01"+"&itemName="+$('input[name="item"]').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
} 
}

function shipperHHGSAddressPopupSearch() {
	orgCaller = 'commodityBillTo';
	
	if ($.trim($('input[name="shipmentBillToOrganizationId"]').val())=='') { 
		alert("Please select organization first");
	}
	else {
		var org_id = $('input[name="shipmentBillToOrganizationId"]').val();
		var actionUrl = _context + '/cas/addRoleSPSRLookup.do?filterValue1='+org_id+'&filterValue2=04';
		
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}

function billTOHHGSArolPopupSearch() {
	orgCaller = 'commodityBillTo';	
	if ($.trim($('input[name="shipmentBillToOrganizationId"]').val())=='') { 
		alert("Please select organization first");
	}
	else {
		var org_id = $('input[name="shipmentBillToOrganizationId"]').val();
		//var actionUrl = _context + '/cas/addRoleSPSRLookup.do?filterValue1='+org_id+'&filterValue2=04';
		
		//ST means arole type cpde = 20-21
		var actionUrl =  _context + '/cas/addRoleBKLookup.do?filterValue1='+org_id+'&filterValue2=ST'+'&filterValue3='+$('#tradeCode').val();
		
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}


function setCommoditySectionData(responseText){
	$('#shipmentCommodityHHGSNos').html(responseText.data.commoditySeqNumber);
	$('#householdGoodsMarkForName').val(responseText.data.householdGoodsMarkForName);
	$('#houseHoldTariffNumber').val(responseText.data.tariffNumber);
	$('#houseHoldItemRespPartyCode').val(responseText.data.shipmentResponsiblePartyCode);
	$('#loadServiceCode').val(responseText.data.loadServiceCode);
	$('#dschServiceCode').val(responseText.data.dschServiceCode);
	$('#item').val(responseText.data.item);
	$('#shipmentAddressRoleName').val(responseText.data.shipmentAddressRoleName);
	$('#gblNumber').val(responseText.data.gblNumber);
	$('#shipmentItemPices').val(responseText.data.shipmentItemPices);
	$('#shipmentItemTotalPieceCount').val(responseText.data.shipmentItemTotalPieceCount);
	$('#pieceUnitOfMeasureCode').val(responseText.data.pieceUnitOfMeasureCode);
	$('#shipmentAddressLine1').html(responseText.data.shipmentAddressLine1);
	$('#placeOfReceipt').val(responseText.data.placeOfReceipt);
	$('#netWeight').val(responseText.data.weight);
	$('#placeOfDelivery').val(responseText.data.placeOfDelivery);
	$('#cube').val(responseText.data.cube);
	$('#shipmentItemId').val(responseText.data.shipmentItemId);
	$('#shmtItemSequenceNumberDs').val(responseText.data.shmtItemSequenceNumberDs);
	$('#shipmentId').val(responseText.data.shipmentId);
	$('#shipmentAddressRoleId').val(responseText.data.shipmentAddressRoleId);
		
	
	
}

function clearAllCommodityMessage(){
	
	$('#msgDivCommodityOverlay').html("");
	$('#msgDivCommodityOverlay').show();
}

function beforeLoadServiceCommodityUpdate(loadServiceCode, dischargeServiceCode)
{//alert("In side beforeLoadServiceUpdate");
	if($("#commodityGrid").getGridParam("reccount")>0)
	{//alert("In side commodityGrid");
		if(loadServiceCode!='' && dischargeServiceCode!='')
		{
			$.ajax({
				url: _context +"/shipment/routing/getLoadDschPair?loadServiceCode="+loadServiceCode+"&dischargeServiceCode="+dischargeServiceCode,
				success: function(responseText){
					var oldLDSGroup = $('#loadDschServiceGroupCode').val();
					var newLDSGroup = responseText.data.loadDschServiceGroupCode;
					if($.trim(oldLDSGroup)!=$.trim(newLDSGroup))
					{
						var r = confirm("Load discharge group code is being changed. Delete commodities?");
						if(r)
						{
							removeCommodities();
							loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
						}
						else
						{
							$('#dischargeServiceCode').attr("disabled", false);
							$('#loadServiceCode').val(lastLoadService);
						}
					}
					else
						loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
				}
			});
		}
		else
		{
			/*var r = confirm("Load discharge group code is being changed. Delete commodities?");
			if(r)
			{
				removeCommodities();*/
				loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
			/*}
			else
			{
				$('#dischargeServiceCode').attr("disabled", false);
				$('#loadServiceCode').val(lastLoadService);
			}*/
		}
	}
	else
		loadServiceUpdateFunction(loadServiceCode, dischargeServiceCode);
}

function getAllLoadServiceOfCYtype(){
	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	$.ajax({
		url: _context +"/houseHoldShipment/getALLLoadService",
		data:shipmentHouseHoldItemForm,
		success: function(responseText){
			if(responseText.success){
				
			populateLoadServiceCommodity(responseText.data);
			populateDschServiceCommodity(responseText.data);
			enableDisableInputFields(responseText.data);
			}else{
			}
		}});
	
}

function enableDisableInputFields(data){
    $.each(data.loaddschServicePairs, function(index, loaddschServicePairsList) {
        if(loaddschServicePairsList.loadServiceCode==($('#loadServiceCodeHHGS').val()) && loaddschServicePairsList.dschServiceCode==($('#dschServiceCodeHHGS').val()) ){
        	if(loaddschServicePairsList.isRequireBlOrigin=='N'){
        		$('#placeOfReceiptCommodityHHGS').removeClass("validate[required]");
        		$('#placeOfReceiptLabel').text('');
        		$('#placeOfReceiptCommodityHHGS').val('');
        		$('#placeOfReceiptCommodityHHGS').attr("disabled",true);
        	}else{
        		$('#placeOfReceiptCommodityHHGS').attr("disabled",false);
        		$('#placeOfReceiptLabel').text("*");
        		$('#placeOfReceiptCommodityHHGS').addClass("validate[required]");
        	}
        	if(loaddschServicePairsList.isRequireBlDestination=='N'){
        		$('#placeOfDeliveryCommodityHHGS').removeClass("validate[required]");
        		$('#placeOfDeliveryLabel').text('');
        		$('#placeOfDeliveryCommodityHHGS').val('');
        		$('#placeOfDeliveryCommodityHHGS').attr("disabled",true);
        	}else{
        		$('#placeOfDeliveryCommodityHHGS').attr("disabled",false);
        		$('#placeOfDeliveryLabel').text("*");
        		$('#placeOfDeliveryCommodityHHGS').addClass("validate[required]");
        	}
        	//alert(loaddschServicePairsList.isRequireBlOrigin+"-"+loaddschServicePairsList.isRequireBlDestination);
        }
    });
		
}



function populateDschServiceCommodity(data){
	 $("#dschServiceCodeHHGS").get(0).options.length = 0;
     $.each(data.dschServices, function(index, dschServicesList) {
         $("#dschServiceCodeHHGS").get(0).options[$("#dschServiceCodeHHGS").get(0).options.length] = new Option(dschServicesList, dschServicesList);
     });
		
    
     $('#dschServiceCodeHHGS').val(data.dschServiceCodeHHGS);
     lastCommodityDischargeService=  $('#dschServiceCodeHHGS').val();
}

function populateLoadServiceCommodity(data){
	 $("#loadServiceCodeHHGS").get(0).options.length = 0;
   $.each(data.loadServices, function(index, loadServicesList) {
       $("#loadServiceCodeHHGS").get(0).options[$("#loadServiceCodeHHGS").get(0).options.length] = new Option(loadServicesList, loadServicesList);
   });
   $('#loadServiceCodeHHGS').val(data.loadServiceCodeHHGS);
   
   lastCommodityLoadService = $('#loadServiceCodeHHGS').val();
}


function  updateHHGSCommodityOkNew(){
	

	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	//Added for fetching default tarrif/item.
	
	
	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var tariffNo=$('#tariffHHGS').val();
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate = $('#ratedate').val();
	}
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/updateCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								
								
								$('#shipmentCommodityHHGSNos').html(responseText.data.householdGoodsSequenceNbr);
								
								 commodityHHGSMode = "addNewHHGSCommodity";
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
					
					$.ajax({
						 type:"POST",
						 url:_context+"/houseHoldShipment/AddNewCommodity",
						
						success: function(responseText){
							if(responseText.success==true){
								$('#msgDivCommodityOverlay').text("");
								$('#shipmentAddressLine1').text("");
					        	$('#shipmentCityStateZip').text("");
					        	
								$('#loadServiceCodeHHGS').val("");
								$('#dschServiceCodeHHGS').val("");					
								$("#shipmentHouseHoldItemForm").clearForm();
								$('#houseHoldItemRespPartyCode').val("P");
								
								$('#shipmentHouseHoldItemForm').loadJSON(responseText.data);
								populateLoadServiceCommodity(responseText.data);
								populateDschServiceCommodity(responseText.data);
								setCommoditySectionData(responseText);
								enableDisableInputFields(responseText.data);
								  $("#commodityHHGSOverlay").dialog( "option", "title", 'Add Commodity' );
						           $("#commodityHHGSOverlay").dialog('open');	
						           commodityHHGSMode = "addNewHHGSCommodity";
						          // tabSequence('#shipmentHouseHoldItemForm');
						}else{
							}
						}
					
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
				}
			}
		}
	});
	//end
	
	 $.unblockUI();

	
	
}

function updateHHGSCommodity(){
	blockUI();
	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	//Added for fetching default tarrif/item.
	$.ajax({
		async: false,
		type : "POST",
		url: _context +"/houseHoldShipment/tarrifItem",
		data:shipmentHouseHoldItemForm,
		success: function(responseText){
			if(responseText.success){
				/*$("#commodityHHGS").trigger("reloadGrid");
				 $("#commodityHHGSOverlay").dialog('close');*/
				//alert(responseText.data);
				if(responseText.data!="Error:Error"){
					var tarrifArr=responseText.data.split(":");
					//alert(tarrifArr[0]);
					//alert(tarrifArr[1]);
					if($('#shipmentCommodityHHGSNos').text()!=null && 
							$('#shipmentCommodityHHGSNos').text()!="undefined" &&
							$('#shipmentCommodityHHGSNos').text().trim()!="" &&
							$('#shipmentCommodityHHGSNos').text().trim()=="1"){
						$('#tariffHHGS').val(tarrifArr[0]);
						//$('#item').val(tarrifArr[1]);
						$('#itemBlockDiv').find('input[name="item"]').val(tarrifArr[1]);
					}
					
					
				}
			}
			}
	});
	
	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var tariffNo=$('#tariffHHGS').val();
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate = $('#ratedate').val();
	}
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/updateCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								 $("#commodityHHGSOverlay").dialog('close');
								
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
					
				/*	resetMandatoryTariffCmdDesc();
					setMandatoryTariffItem();
					$("#tariffCommodityDescription").val("");
					$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					clearCommodityCodeList();*/
				}
			}
		}
	});
	//end
	
	 $.unblockUI();
	}


function addHHGSCommodity(){
	
	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	//Added for fetching default tarrif/item.
	/*$.ajax({
		async: false,
		type : "POST",
		url: _context +"/houseHoldShipment/tarrifItem",
		data:shipmentHouseHoldItemForm,
		success: function(responseText){
			if(responseText.success){
				$("#commodityHHGS").trigger("reloadGrid");
				 $("#commodityHHGSOverlay").dialog('close');
				//alert(responseText.data);
				if(responseText.data!="Error:Error"){
					var tarrifArr=responseText.data.split(":");
					//alert(tarrifArr[0]);
					//alert(tarrifArr[1]);
					if($('#shipmentCommodityHHGSNos').text()!=null && 
							$('#shipmentCommodityHHGSNos').text()!="undefined" &&
							$('#shipmentCommodityHHGSNos').text().trim()!="" &&
							$('#shipmentCommodityHHGSNos').text().trim()=="1"){
						$('#tariffHHGS').val(tarrifArr[0]);
						//$('#item').val(tarrifArr[1]);
						$('#itemBlockDiv').find('input[name="item"]').val(tarrifArr[1]);
					}
					
					
				}
			}
			}
	});*/
	
	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate = $('#ratedate').val();
	}
	var tariffNo=$('#tariffHHGS').val();
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/addCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								 $("#commodityHHGSOverlay").dialog('close');
								
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
					
					/*resetMandatoryTariffCmdDesc();
					setMandatoryTariffItem();
					$("#tariffCommodityDescription").val("");
					$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					clearCommodityCodeList();*/
				}
			}
		}
	});
	//end
	
	
}

function updateHHGSCommodityOkCopy(){
	
	
	
	
	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var tariffNo=$('#tariffHHGS').val();
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate =$('#ratedate').val();
	}
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/updateCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								
								
								$('#shipmentCommodityHHGSNos').html(responseText.data.householdGoodsSequenceNbr);
								$('#shipmentItemPices').val("");
								$('#shipmentItemTotalPieceCount').val("");
								$('#pieceUnitOfMeasureCode').val("");
								$('#gblNumber').val("");
								$('#householdGoodsMarkForName').val("");
								$('#weight').val("");
								$('#cube').val("");
								 commodityHHGSMode = "addNewHHGSCommodity";
								
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
					
					/*resetMandatoryTariffCmdDesc();
					setMandatoryTariffItem();
					$("#tariffCommodityDescription").val("");
					$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					clearCommodityCodeList();*/
				}
			}
		}
	});
	//end

	
	
}

function addHHGSCommodityNew(){
	
	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	//Added for fetching default tarrif/item.

	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var tariffNo=$('#tariffHHGS').val();
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate = $('#ratedate').val();
	}
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/addCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								
								
								$('#shipmentCommodityHHGSNos').html(responseText.data.householdGoodsSequenceNbr);
								/*if(src=="OkAndNew")
								{
									$('#commodityHHGSAdd').trigger('click');										
								}*/
								$('#shipmentItemPices').val("");
								$('#shipmentItemTotalPieceCount').val("");
								$('#pieceUnitOfMeasureCode').val("");
								$('#gblNumber').val("");
								$('#householdGoodsMarkForName').val("");
								$('#weight').val("");
								$('#cube').val("");
								
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
					
					/*resetMandatoryTariffCmdDesc();
					setMandatoryTariffItem();
					$("#tariffCommodityDescription").val("");
					$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					clearCommodityCodeList();*/
				}
			}
		}
	});
	//end
	
	
	
	
}


function addHHGSCommodityOkandNew(){
	var shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	//Added for fetching default tarrif/item.

	//Added for commodityCode and desc 
	shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
	var blOriginCityCode = $('#placeOfReceiptCommodityHHGS').val();
	var blDestinationCityCode = $('#placeOfDeliveryCommodityHHGS').val();
	var originPortCityCode = "";
	var destinationPortCityCode = "";
	var loadSrvc = $("#loadServiceCodeHHGS").val();
	var dischargeSrvc = $("#dschServiceCodeHHGS").val();
	var trade ="";
	if($('#tradeHHGS').text()!=null && $('#tradeHHGS').text()!=""){
		trade = $('#tradeHHGS').text().split('-')[0].trim();
	}
	if($('#portOfLoadingHHGS').text()!=null && $('#portOfLoadingHHGS').text()!=""){
		originPortCityCode = $('#portOfLoadingHHGS').text().split('-')[0].trim();
	}
	if($('#portOdDischargeHHGS').text()!=null && $('#portOdDischargeHHGS').text()!=""){
		destinationPortCityCode = $('#portOdDischargeHHGS').text().split('-')[0].trim();
	}
	var tariffNo=$('#tariffHHGS').val();
	var estShipDate = "";
	if($('#ratedate').val()!="" && $('#ratedate').val()!=null && $('#ratedate').val()!="null"){
		estShipDate = $('#ratedate').val();
	}
	//var itemNo=$('#item').val();
	var itemNo=$('#itemBlockDiv').find('input[name="item"]').val();
	var urlComm= _context+'/cas/autocomplete.do?method=getPrimaryCommodity&searchType=281&parentSearch='+blOriginCityCode
	+'|'+blDestinationCityCode+'|'+originPortCityCode+'|'+destinationPortCityCode+'|'+loadSrvc+'|'+dischargeSrvc
	+'|'+trade+'|'+tariffNo+'|'+itemNo+'|'+estShipDate;
	//alert(urlComm);
	$.ajax({
		async: false,
		url: urlComm,
		type: "POST",
		success: function(responseText){
			if(responseText!=null){
				if(responseText[0].commodityNotFound=='undefined' || responseText[0].commodityNotFound==null || responseText[0].commodityNotFound==''){
					/*$('#msgDivFrt').html('');
					$('#msgDivFrt').hide();*/
					//$("#commodityDesc").val(responseText[0].desc);
					$('#commodityHHGSOverlay').find('input[name="commodityDesc"]').val(responseText[0].desc);
					//$("#tariffCommodityDescriptionHidden").val(responseText[0].desc);
					/*$("#frtGrpId").val(responseText[0].grpid);
					$("#frtItemId").val(responseText[0].itemid);*/
					
					if(responseText[0].descid!=null && responseText[0].descid!=''){
						//$('#tariffItemCmdtyDescId').val(responseText[0].descid);
						$.ajax({
							async: false,
							url: _context+'/booking/freight/getCommodityCodes',
							data: {commodityDescId:responseText[0].descid,
								frtItemId:responseText[0].itemid},
							success: function(responseText){
								if(responseText.success){
									//populateCommodityCodeList(responseText.data);
									var commCode = responseText.data.length;
									if(commCode==1){
										//TODO
										$('input[name="commodityCode"]').val(responseText.data[0].code);
									}
								}
							}
						});
					}
					/*setMandatoryTariffCmdDesc();
					$("#commodityDescription").removeClass("validate[required]");
					$("#primaryFreightPresent").val("Y");*/
					shipmentHouseHoldItemForm = $('#shipmentHouseHoldItemForm').formSerialize();
					$.ajax({
						async: false,
						type : "POST",
						url: _context +"/houseHoldShipment/addCommodity",
						data:shipmentHouseHoldItemForm,
						success: function(responseText){
							if(responseText.success){
								$("#commodityHHGS").trigger("reloadGrid");
								
								
								$('#shipmentCommodityHHGSNos').html(responseText.data.householdGoodsSequenceNbr);
								
								
							}else{
								showResponseMessages("msgDivCommodityOverlay",responseText);
					}}
				});
					
					$.ajax({
						 type:"POST",
						 url:_context+"/houseHoldShipment/AddNewCommodity",
						
						success: function(responseText){
							if(responseText.success==true){
								$('#msgDivCommodityOverlay').text("");
								$('#shipmentAddressLine1').text("");
					        	$('#shipmentCityStateZip').text("");
					        	
								$('#loadServiceCodeHHGS').val("");
								$('#dschServiceCodeHHGS').val("");					
								$("#shipmentHouseHoldItemForm").clearForm();
								$('#houseHoldItemRespPartyCode').val("P");
								
								$('#shipmentHouseHoldItemForm').loadJSON(responseText.data);
								populateLoadServiceCommodity(responseText.data);
								populateDschServiceCommodity(responseText.data);
								setCommoditySectionData(responseText);
								enableDisableInputFields(responseText.data);
								  $("#commodityHHGSOverlay").dialog( "option", "title", 'Add Commodity' );
						           $("#commodityHHGSOverlay").dialog('open');	
						           commodityHHGSMode = "addNewHHGSCommodity";
						          // tabSequence('#shipmentHouseHoldItemForm');
						}else{
							}
						}
					
				});
				}
				else{
					$('#msgDivCommodityOverlay').show();
					if (responseText[0].commodityNotFound =="Y"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">Primary Commodity does not exist for this Tariff/Item combination.</div>');								
					}
					if (responseText[0].commodityNotFound =="TF" || responseText[0].commodityNotFound =="IF"){
						$('#msgDivCommodityOverlay').html('<div class="message_error">'+responseText[0].errmsg+'</div>');								
					}
					
					/*resetMandatoryTariffCmdDesc();
					setMandatoryTariffItem();
					$("#tariffCommodityDescription").val("");
					$("#tariffCommodityDescriptionHidden").val("");
					$("#primaryFreightPresent").val("N");
					clearCommodityCodeList();*/
				}
			}
		}
	});
	//end
	
}
//against 21775- to pull address automatically if only one
function fetchAddresssDetailsIfOneOrgAddress(orgId){

	$.ajax({
		type : "POST",
		url:_context+"/houseHoldShipment/fetchAddressDetails",
		data:{
		organizationId : orgId
		},
		success : function(responseText) {
			
			$('#shipmentAddressLine1').text("");
        	$('#shipmentCityStateZip').text("");
        	
        	if(responseText.success){
        		
				$('#shipmentAddressLine1').html(responseText.data.split(":")[0]);
				$('#shipmentCityStateZip').html(responseText.data.split(":")[1]);	
        	}
        	else{
        		
        		shipperHHGSAddressPopupSearch();
        		
        	}
		}
	});
}

function fetchAddresssDetailsForCOmmodity(item){

	$.ajax({
		type : "POST",
		url : _context +"/booking/specialservice/getAddressDetails",
		data : {
			addressId: item.orgid
		},
		success : function(responseText) {
			
			$('#shipmentAddressLine1').html(responseText.data.split(":")[0]);
			$('#shipmentCityStateZip').html(responseText.data.split(":")[1]);	
			
		
			
		}
	});
}

function populateAddressRole(id){    
	
	//alert("single arole");
    //name qualifier-ADDRESS-CITY-STATE-ADD_ROLE
    var values = id.split("|");    
	var address='';
	var nameQualifier=values[0];
	var addressLine1=values[1];
	var city=values[2];
	var state=values[3];
	var addressRoleId=values[4];
	var addressLine2="";
	var zip=values[5];
	/*if(nameQualifier!=null && $.trim(nameQualifier)!=''){
		address= nameQualifier+'-';
	}
	
	if(state!=null && $.trim(state)!='')
	{
		var address1= ","+state;
	} 
*/
	if(state!=null || city!=null){
		if(state==null){
			cityStateZip=city;
		}else if(city==null){
			cityStateZip=state;
		}else{
			cityStateZip=city+" "+state+" "+zip;
		}
	}
	if(state!=null || city!=null){
		if(state==null){
			addressLine2=" - "+city;
		}else if(city==null){
			addressLine2=" - "+state;
		}else{
			addressLine2=" - "+city+", "+state;
		}
	}
	$('#shipmentAddressLine1').text(addressLine1);
	//$('#shipmentAddressLine2').text(addressLine2);
	$('#shipmentCityStateZip').text(cityStateZip);
	$("#shipmentAddressRoleId").val(addressRoleId);    
}
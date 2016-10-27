//prepare the form when the DOM is ready
var somethingChanged = false;
var orgId=0;
var phoneFromServer='';


$(function() {
	var addressUrl = _context+'/cas/autocomplete.do?method=searchAddRolDesc&searchType=245&parentSearch='+ $('#orgId').val();

	phoneFromServer = $('#areaCode').val();
	console.log('areaCode:' + phoneFromServer + "|" +  $('#areaCode').val());

	$(window).load(function() {
		
		orgId = $("#orgId").val();
		console.log('activeTruckerRate ::' +$("#activeTruckerRate").val()+", isActiveChkbox:"+$("#isActive").is(":checked"));
		
		if($("#contactId").val() != null && $("#contactId").val() != ""){
			var queryString = $('#maintainTruckerForm').formSerialize();
			//queryString.concat('addressRoleId='+$('#addressRoleId').val()+'&truckerName='+ $('#truckerName').val()+'&organizationId='+$('#orgId').val()+'&address='+ ""+'&city='+ $('#city').val()+'&state='+ $('#state').val()+'&zipcode='+ $('#zipcode').val());
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/quote/trucker/getTruckerContacts?callFor=AllContacts",
				data: queryString,
				success: function(contacts){
					$('#contactName').find('option').remove().end().append("<option value=''>Select</option>");
					var maxTimes = 0;
					$(contacts.data).each(function(key, value) {
						var value1 = value.substring(0,value.length - 3);
						var value2 = value.substring(value.length - 2, value.length);
						$('#contactName').append($("<option/>", {
							value: value1,
							text: value1
						}));						
						if($("#truckerContactName").val() == value1){
							$("#contactName option[value='" + value1 + "']").attr("selected", "selected");
						}
					});					
					updateContactName();
					$.unblockUI();
				}
			});
		}
		
		if($("#freeTimeRate").val() != ""){		
			$("#freeTimeRate").val($("#freeTimeRate").val().split(".")[0]);
		}
		if ($('#truckerName').val()== ""){
			$('#address').attr("disabled",true);
			$('#contactName').attr("disabled",true);
			$('#city').attr("disabled",true);
			$('#state').attr("disabled",true);			
			$('#zipcode').attr("disabled",true);
			
		}else{
			_pageMode="Update";
		}
		
		if ($('#fuelSurchargeAmount').val() != "NaN") {
			var fscDotIndex = $('#fuelSurchargeAmount').val().indexOf(".");
			if(fscDotIndex == -1){
				var fuelSurchargeAmountdec = parseFloat($('#fuelSurchargeAmount').val()).toFixed(2);
				$('#fuelSurchargeAmount').val(fuelSurchargeAmountdec);	
			}
			if ($('#fuelSurchargeAmount').val() == "0.00") {
				$('#fuelSurchargeAmount').val("");
			}
		}
		
		if (!$('#isAllowHouseholdGoodsMove').is(":checked")){//D033743
			$("#rsdollar").attr("disabled", true);
			//$("#rsdollar").val('');
		} else {
			$("#rsdollar").attr("disabled", false);
		}
		
		if(($('#rsdollar').val() != null && $('#rsdollar').val() != '') || ($('#isRateRsDollar').val() != null && $('#isRateRsDollar').val() == 'Y')){//D033743
			$("#isAllowHouseholdGoodsMove").attr("disabled", true);
		} else {
			$("#isAllowHouseholdGoodsMove").attr("disabled", false);
		}
	});
	
	
	$('#isAllowHouseholdGoodsMove').click(function() {//D033743
		if (!$('#isAllowHouseholdGoodsMove').is(":checked")){
			document.getElementById("rsdollar").style.backgroundColor = "#cfe2f3";
			$("#rsdollar").attr("disabled", true);
			$("#rsdollar").val(null);
		} else {
			$("#rsdollar").attr("disabled", false);
		}
	});
	
	$('#rsdollar').change(function() {//D033743
		var rd = $("#rsdollar").val();
		var isRateRsDollar = $("#isRateRsDollar").val();
		if((rd == null || rd == '') && (isRateRsDollar == null || isRateRsDollar == '')){
			$("#isAllowHouseholdGoodsMove").attr("disabled", false);
		} else {
			$("#isAllowHouseholdGoodsMove").attr("disabled", true);
		}
	});
	var _pageMode;
	usZipDisplay();
	tabSequence('#maintainTruckerForm');
	$("#maintainTruckerForm").validationEngine('attach');
	var milTruckerId = $("#milTruckerId").val();
	if ( (milTruckerId == null)||(milTruckerId == '') ) {
		_pageMode="Add";
		$("#truckerDelete").attr("disabled", true);
		$("#isAllowHouseholdGoodsMove").attr("checked", true);
		$("#isActive").attr("checked", true);
	} else {
		_pageMode="Update";
	}	
	$('#truckerName').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name:'Trucker',
	 	extraParams: {
	 		method: 'orgSearchForTrucker',
		 	searchType: '205',
		 	from: 'trucker'
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
		formatItem: function(data) {
			return data.name +"-"+ data.code;
		},
		formatResult: function(data) {
			return data.name + "-" + data.code;
		},
		select: function(data) {
			$('#orgId').val(data.id);			
			resetAddressDetails();			
			$("#orgName").val(data.name + "-" + data.code);
			$('#orgId').val(data.id);
			$("#address").removeAttr("disabled");
			$("#city").removeAttr("disabled");
			$("#state").removeAttr("disabled");
			$("#zipcode").removeAttr("disabled");
			$("#contactName").removeAttr("disabled");			
			orgId=data.id;
			$('#orgId').val(orgId);
			addressUrl=_context+'/cas/autocomplete.do?method=searchAddRolDesc&searchType=245&parentSearch='+orgId;
		}
	});
	$('#zipcode').change(function()
	{
		usZipDisplay();
	});
	
	$('#address').gatesAutocomplete({
		//mustMatch: true,
		name:'Address',		 
		 source: _context+'/cas/autocomplete.do',
	 		 extraParams: {
	 		 		 method: 'searchAddRolDesc',
	 		 		 searchType: '245',	 		 		 		 		 	
		 		 	parentSearch:  function() { return $('#orgId').val(); }
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
		 
		 formatItem: function(data) {
				if (data.name!=null && $.trim(data.name)!='' && data.name!="null"){
					return data.name+"-"+data.address+"-"+data.city+"-"+data.state;
				}else{
					return data.address+"-"+data.city+"-"+data.state;
				}
			},
		 formatResult: function(data) {
			 if (data.name!=null && data.name!="null" && $.trim(data.name)!=''){
					return data.name+"-"+data.address/*+"-"+data.city+"-"+data.state*/;
				}else{
					return data.address/*+"-"+data.city+"-"+data.state*/;
				}
		 },
		
		select: function(data) {
			var addrRoleId = data.id;
			var nameQualifier = data.name;
			var addrLine1 = data.address;
			var city = data.city;
			var state = data.state;
			var zipCode = data.zip;
			var finalAddress = formatAddRoleDscr(nameQualifier, addrLine1, city, state);
			$('#addressRoleId').val(addrRoleId);
			$('#address').val(finalAddress);
			$('#city').val(city);
			$('#state').val(state);
			$('#zipcode').val(zipCode);
			usZipDisplay();
			$('#orgId').val(orgId);
			resetContactNameDetails();
			var queryString = $('#maintainTruckerForm').formSerialize();
			queryString.concat('addressRoleId='+addrRoleId+'&truckerName='+ $('#truckerName').val()+'&organizationId='+orgId+'&address='+ addrLine1+'&city='+ $('#city').val()+'&state='+ $('#state').val()+'&zipcode='+ $('#zipcode').val());
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/quote/trucker/getTruckerContacts?callFor=",
				data: queryString,
				success: function(contacts){
					$('#contactName').append("<option value=''>Select</option>");
					var maxTimes = 0;
					var triggerChange = false;
					$(contacts.data).each(function(key, value) {
						var value1 = value.substring(0,value.length - 3);
						var value2 = value.substring(value.length - 2, value.length);
						$('#contactName').append($("<option/>", {
							value: value1,
							text: value1
						}));
						if(value2 == "30"){
							triggerChange = true;
							maxTimes = maxTimes + 1;
							$("#contactName option[value='" + value1 + "']").attr("selected", "selected");
						}if(maxTimes != 1){
							triggerChange = false;
							$("#contactName option[value='']").attr("selected", "selected");
						}						
					});
					if(triggerChange){
						$('#contactName').trigger('change');
					}
					$.unblockUI();
				}
			});
			somethingChanged = true;
		}
	});
	$("#truckerAddress_POPUP").click(function(){
		var orgName = $('#truckerName').val();
		if ( (orgName==null) ||($.trim(orgName)=='') ) {
			alert("Please select Organization.");
		} else {
			var orgId =$('#orgId').val();
			if (orgId!=null) {
				$.ajax({
					type : "POST",
					url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+
					encodeURIComponent(orgId+'||'),					
					success : function(responseText) {
						if(responseText.length == 1){									
							addroleSingleTrucker(responseText[0]);
						} else {
							addressRolePopupSearch();
						}						
					}
				});		
			} else {
				$("#ORGANIZATION_NAME_ABBR").validationEngine('showPrompt', 'Please select Organization.', 'error', true);
			}
		}		
	});
	$('#truckerName').gatesPopUpSearch({func:function() {organizationPopupSearch();}});
	$('#truckerName').change(function() {		
		if($('#orgName').val() != $('#truckerName').val()){
			$('#truckerName').val("");
		}
		resetAddressDetails();;	
		if ($('#truckerName').val()== ""){
			
			$('#address').attr("disabled",true);
			$('#contactName').attr("disabled",true);
			
			$('#city').attr("disabled",true);
			$('#state').attr("disabled",true);			
			$('#zipcode').attr("disabled",true);
		}
	});
	$('#address').gatesPopUpSearch({func:function() {addressRolePopupSearch();}});
	$('#address').change(function(){
		var orgName = $('#truckerName').val();
		if ( (orgName==null) ||($.trim(orgName)=='') ) {
			alert("Please select Organization.");
		} else {
			$('#contactName option:selected').text('');
			emptyOutCityStateZip();
			emptyOutPhoneNumber();
		}
	});
	
	function updateContactName(){
		var contact = $("#contactName option:selected").text();	
		$('#truckerContactName').val(contact);
		var addressRoleId = "";
		if(!(contact == "Select")){
			addressRoleId = $('#addressRoleId').val();
			if((addressRoleId!=null)&&(addressRoleId!="")) {
				emptyOutPhoneNumber();
				var queryString = $('#maintainTruckerForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/trucker/getTruckerContactPhone",
					data: queryString,
					success: function(ph){

						$('#addressRoleContactId').val(ph.data[4]);
						$('#truckerContactName').val(ph.data[5]);
						$('#addressRoleId').val(ph.data[6]);

						var areaCode = $('#areaCode').val();
						if ($.trim(areaCode) == '') {
							$('#countryCode').val(ph.data[0]);
							$('#areaCode').val(ph.data[1]);
							$('#exchangeCode').val(ph.data[2]);
							$('#stationCode').val(ph.data[3]);
							$('#extension').val(ph.data[7]);							
						}

						var email = $('#email').val();
						if ($.trim(email) == '') {
							$('#email').val(ph.data[8]);
						}						
						$.unblockUI();
					}
				});
			}
		}else{
			$('#countryCode').val("");
			$('#areaCode').val("");
			$('#exchangeCode').val("");
			$('#stationCode').val("");
			$('#addressRoleContactId').val("");
			$('#extension').val("");
		}
	}
	
	$('#contactName').change(function() {
		var contact = $("#contactName option:selected").text();	
		$('#truckerContactName').val(contact);
		var addressRoleId = "";
		if(!(contact == "Select")){
			addressRoleId = $('#addressRoleId').val();
			if((addressRoleId!=null)&&(addressRoleId!="")) {
				emptyOutPhoneNumber();
				var queryString = $('#maintainTruckerForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/trucker/getTruckerContactPhone",
					data: queryString,
					success: function(ph){
						$('#addressRoleContactId').val(ph.data[4]);
						$('#truckerContactName').val(ph.data[5]);
						$('#addressRoleId').val(ph.data[6]);
						var areaCode = $('#areaCode').val();
						if ($.trim(areaCode) == '') {
							$('#countryCode').val(ph.data[0]);
							$('#areaCode').val(ph.data[1]);
							$('#exchangeCode').val(ph.data[2]);
							$('#stationCode').val(ph.data[3]);
							$('#extension').val(ph.data[7]);
						}												
						var email = $('#email').val();
						if ($.trim(email) == '') {
							$('#email').val(ph.data[8]);
						}						
						$.unblockUI();
					}
				});
			}
		}else{
			$('#countryCode').val("");
			$('#areaCode').val("");
			$('#exchangeCode').val("");
			$('#stationCode').val("");
			$('#addressRoleContactId').val("");
			$('#extension').val("");
		}
		somethingChanged = true;
	});
	$('#truckerDelete').click(function(){
		var r=confirm("Are you sure you want to delete Trucker?");
		if (r==true) {
			if(_pageMode=="Update" || _pageMode=="Add") {
				$("#maintainTruckerForm").attr("action", "deleteTrucker");
				$("#maintainTruckerForm").submit();
			}
		}
	});
	$('#truckerCancel').click(function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				document.location.href = _context + '/cas/truckerSearch.do?isRefresh=true';
			}
		} else {
			document.location.href = _context + '/cas/truckerSearch.do?isRefresh=true';
		}
	});
	$('#truckerClear').click(function() {
		if (somethingChanged==true) {
			var r=confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r==true) {
				document.location.href=_context+'/quote/trucker/clearTrucker';
			}
		} else {
			document.location.href=_context+'/quote/trucker/clearTrucker';
		}
	});
	
	$('#truckerRateSearch').click(function() {
		var name = $("#truckerName").val();
		var truckerId = $("#milTruckerId").val();
		var city = $("#city").val();
		var state = $("#state").val();
		var zip =  $("#zipcode").val();
		var orgId = $("#orgId").val(); 
		var address = $("#address").val(); 
		//alert(address);  
		console.log('ORG ID FROM MT ::' +$("#orgId").val());
		document.location.href=_context+'/cas/truckerRateSearch.do?truckerName='+encodeURIComponent(name)+'&truckerId='+truckerId+'&flag=Y&city='+encodeURIComponent(city)
					+'&state='+encodeURIComponent(state)
					+'&address='+encodeURIComponent(address)
					+'&zip='+encodeURIComponent(zip)
					+'&orgIdFromST='+encodeURIComponent(orgId)+'&flag=Y';
	});
	
	$("#chaseRate").blur(function() {
		if($("#chaseRate").val() != ""){
			getNumberFormat(this);	
		}		
	});
	$("#hazardousFeeRate").blur(function() {
		if($("#hazardousFeeRate").val() != ""){
			getNumberFormat(this);	
		}		
	});
	
	$("#overRegTimeHourlyRate").blur(function() {
		if($("#overRegTimeHourlyRate").val() != ""){
			getNumberFormat(this);	
		}		
	});
	$("#chaseRate").click(function() {
		removeErrorPointers();
	});
	$("#hazardousFeeRate").click(function() {
		removeErrorPointers();
	});
	$("#freeTimeRate").click(function() {
		removeErrorPointers();
	});
	$("#overRegTimeHourlyRate").click(function() {
		removeErrorPointers();
	});
});
//END - Document.ready function
//START - Search Related Functions
function organizationPopupSearch() {
	var param=$('#truckerName').val();
	var actionUrl = _context +'/cas/orgtruckerlookup.do?orgName='+encodeURIComponent(param);
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function organizationNameSearchUpdate(id){
	var values = id.split("|");
	$('#truckerName').val(values[0] + "-" + values[2]);
	$('#orgId').val(values[1]);
	orgId = values[1];
//	In case org is re-selected
	resetAddressDetails();
	if ($('#truckerName').val()!= ""){
		
		$("#address").removeAttr("disabled");
		$("#city").removeAttr("disabled");
		$("#state").removeAttr("disabled");
		$("#zipcode").removeAttr("disabled");
		$("#contactName").removeAttr("disabled");		
	}
	somethingChanged = true;	
	$('#address').gatesAutocomplete({
		
		source:_context+'/cas/autocomplete.do',
		name:'Address',
	 	extraParams: {
		 		 method: 'searchAddRolDesc',
		 		 searchType: '245',
		 		 parentSearch:  function() { return $('#orgId').val(); }
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
		formatItem: function(data) {
			if (data.name!=null && $.trim(data.name)!=''){
				return data.name+"-"+data.address+"-"+data.city+"-"+data.state;
			}else{
				return data.address+"-"+data.city+"-"+data.state;
			}
		},
		formatResult: function(data) {
			if (data.name!=null && data.name!="null" && $.trim(data.name)!=''){
				return data.name+"-"+data.address+"-"+data.city+"-"+data.state;
			}else{
				return data.address+"-"+data.city+"-"+data.state;
			}
		},
		select: function(data) {
			var addrRoleId = data.id;
			var nameQualifier = data.name;
			var addrLine1 = data.address;
			var city = data.city;
			var state = data.state;
			var zipCode = data.zip;
			var finalAddress = formatAddRoleDscr(nameQualifier, addrLine1, city, state);
			$('#addressRoleId').val(addrRoleId);
			$('#address').val(finalAddress);
			$('#city').val(city);
			$('#state').val(state);
			$('#zipcode').val(zipCode);
			$('#orgId').val(orgId);
			resetContactNameDetails();
			var queryString = $('#maintainTruckerForm').formSerialize();
			queryString.concat('addressRoleId='+addrRoleId+'&truckerName='+ $('#truckerName').val()+'&organizationId='+orgId+'&address='+ addrLine1+'&city='+ $('#city').val()+'&state='+ $('#state').val()+'&zipcode='+ $('#zipcode').val());
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/quote/trucker/getTruckerContacts?callFor=",
				data: queryString,
				success: function(contacts){
					$('#contactName').append("<option value=''>Select</option>");
					var maxTimes = 0;
					var triggerChange = false;
					$(contacts.data).each(function(key, value) {						
						var value1 = value.substring(0,value.length - 3);
						var value2 = value.substring(value.length - 2, value.length);
						$('#contactName').append($("<option/>", {
							value: value1,
							text: value1
						}));
						if(value2 == "30"){
							triggerChange = true;
							maxTimes = maxTimes + 1;
							$("#contactName option[value='" + value1 + "']").attr("selected", "selected");
						}if(maxTimes != 1){
							triggerChange = false;
							$("#contactName option[value='']").attr("selected", "selected");
						}	
					});
					if(triggerChange){
						$('#contactName').trigger('change');	
					}					
					$.unblockUI();
				}
			});
			somethingChanged = true;
		}
	});
}
function addressRolePopupSearch() {
	var orgName = $('#truckerName').val();
	if ( (orgName==null) ||($.trim(orgName)=='') ) {
		alert("Please select Organization.");
	} else {
		var orgId =$('#orgId').val();
		if (orgId!=null) {
			var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='+$('#orgId').val();
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'CustomerSearch', windowStyle);
		} else {
			$("#ORGANIZATION_NAME_ABBR").validationEngine('showPrompt', 'Please select Organization.', 'error', true);
		}
	}
}
function addroleUpdate(id){
//	ADDR_TYPE,ATTENTION_LINE,CITY, C_O_NAME,NAME_QUALIFIER,ORG_NAME,STATE,ADDRESS,ZIP, ADD_ROLE,PROVINCE,COUNTRY,SUITE,CUST_GRP,TRADE,ADDRESS2,ADDRESS3
	var values = id.split("|");
	var addrRoleId = values[9];
	var nameQualifier = values[4];
	var addrLine1 = values[7];
	var city = values[2];
	var state = values[6];
	var zipCode = values[8];
	var orgId = $('#orgId').val();
	var finalAddress = formatAddRoleDscr(nameQualifier, addrLine1, city, state);
	$('#addressRoleId').val(addrRoleId);
	$('#address').val(finalAddress);
	$('#city').val(city);
	$('#state').val(state);
	$('#zipcode').val(zipCode);
	usZipDisplay();
	$('#orgId').val(orgId);
	resetContactNameDetails();
	var queryString = $('#maintainTruckerForm').formSerialize();
	queryString.concat('addressRoleId='+addrRoleId+'&truckerName='+ $('#truckerName').val()+'&organizationId='+orgId+'&address='+ addrLine1+'&city='+ $('#city').val()+'&state='+ $('#state').val()+'&zipcode='+ $('#zipcode').val());
	blockUI();
	$.ajax({
		type: "POST",
		url: _context +"/quote/trucker/getTruckerContacts?callFor=",
		data: queryString,
		success: function(contacts){
			$('#contactName').append("<option value=''>Select</option>");
			var maxTimes = 0;
			var triggerChange = false;
			$(contacts.data).each(function(key, value) {				
				var value1 = value.substring(0,value.length - 3);
				var value2 = value.substring(value.length - 2, value.length);
				$('#contactName').append($("<option/>", {
					value: value1,
					text: value1
				}));
				if(value2 == "30"){
					triggerChange = true;
					maxTimes = maxTimes + 1;
					$("#contactName option[value='" + value1 + "']").attr("selected", "selected");
				}if(maxTimes != 1){
					triggerChange = false;
					$("#contactName option[value='']").attr("selected", "selected");
				}	
			});
			if(triggerChange){
				$('#contactName').trigger('change');	
			}			
			$.unblockUI();
		}
	});
	somethingChanged = true;
}

function addroleSingleTrucker(id){
//	ADDR_TYPE,ATTENTION_LINE,CITY, C_O_NAME,NAME_QUALIFIER,ORG_NAME,STATE,ADDRESS,ZIP, ADD_ROLE,PROVINCE,COUNTRY,SUITE,CUST_GRP,TRADE,ADDRESS2,ADDRESS3
	//var values = id.split("|");
	var addrRoleId = id.addRole;
	var nameQualifier = id.nameQual;
	var addrLine1 = id.stAdd;
	var city = id.city;
	var state = id.state;
	var zipCode = id.zip;
	var orgId = $('#orgId').val();
	var finalAddress = formatAddRoleDscr(nameQualifier, addrLine1, city, state);
	$('#addressRoleId').val(addrRoleId);
	$('#address').val(finalAddress);
	$('#city').val(city);
	$('#state').val(state);
	$('#zipcode').val(zipCode);
	usZipDisplay();
	$('#orgId').val(orgId);
	resetContactNameDetails();
	var queryString = $('#maintainTruckerForm').formSerialize();
	queryString.concat('addressRoleId='+addrRoleId+'&truckerName='+ $('#truckerName').val()+'&organizationId='+orgId+'&address='+ addrLine1+'&city='+ $('#city').val()+'&state='+ $('#state').val()+'&zipcode='+ $('#zipcode').val());
	blockUI();
	$.ajax({
		type: "POST",
		url: _context +"/quote/trucker/getTruckerContacts?callFor=",
		data: queryString,
		success: function(contacts){
			$('#contactName').append("<option value=''>Select</option>");
			var maxTimes = 0;
			var triggerChange = false;
			$(contacts.data).each(function(key, value) {				
				var value1 = value.substring(0,value.length - 3);
				var value2 = value.substring(value.length - 2, value.length);
				$('#contactName').append($("<option/>", {
					value: value1,
					text: value1
				}));
				if(value2 == "30"){
					triggerChange = true;
					maxTimes = maxTimes + 1;
					$("#contactName option[value='" + value1 + "']").attr("selected", "selected");
				}if(maxTimes != 1){
					triggerChange = false;
					$("#contactName option[value='']").attr("selected", "selected");
				}	
			});
			if(triggerChange){
				$('#contactName').trigger('change');	
			}			
			$.unblockUI();
		}
	});
	somethingChanged = true;
}
//END - Search Related Functions
function getNumberFormat(field) {
	var x = Number($(field).val());
	if (!isNaN(x)) {
		$(field).val(x.toFixed(2));
	}
}
function removeErrorPointers() {
	$('#maintainTruckerForm').validationEngine('hideAll');
}
function validateFuelSurchargeAmount(){
	var fuelSurchargePercentage = $("#fuelSurchargeTypeCodePercentage").attr('checked');
	if(fuelSurchargePercentage=="checked"){
		var amount = $("#fuelSurchargeAmount").val();
		if(amount > 100){
			return "Trucker Surcharge cannot be greater than 100%.";
		}
	}
	var fuelSurchargeAmountdec = parseFloat($('#fuelSurchargeAmount').val()).toFixed(2);
	if (fuelSurchargeAmountdec != "NaN") {
		$('#fuelSurchargeAmount').val(fuelSurchargeAmountdec);
	}
}
function formatAddRoleDscr(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	if (nameQualifier != null && nameQualifier != "null" &&  nameQualifier != "") {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "" && nameQualifierTemp != "null" && nameQualifierTemp != null && nameQualifierTemp != undefined && nameQualifierTemp != "undefined") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp = addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	return nameQualifierTemp + addressLine1Temp /*+ cityTemp + stateTemp*/;
}

function clearTruckerFields(){	
	$("#maintainTruckerForm").attr("action", "clearTrucker");
	$("#maintainTruckerForm").submit();	
	
}
function resetAddressDetails() {
	$("#addressRoleId").val("");
	$("#address").val("");
	$('#addressRoleCarrierId').val('');
	emptyOutCityStateZip();
	resetContactNameDetails();	
}
function resetContactNameDetails() {
	$('#contactName').empty();
	$('#addressRoleContactId').val('');
	emptyOutPhoneNumber();
}
function resetRateDetails() {
	$('#equipmentTypeSize').val('');
	$('#fuelSurchargeAmount').val('');
	$('#chaseRate').val('');
	$('#hazardousFeeRate').val('');
	$('#freeTimeRate').val('');
	$('#overRegTimeHourlyRate').val('');
}
function emptyOutCityStateZip() {
	$('#city').val('');
	$('#state').val('');
	$('#zipcode').val('');
}
function emptyOutPhoneNumber() {
	console.log('emptyOutPhoneNumber:areaCode:' + phoneFromServer + '|' + $('#areaCode').val());	
	if (phoneFromServer == '') {
		$('#countryCode').val('');
		$('#areaCode').val('');
		$('#exchangeCode').val('');
		$('#stationCode').val('');
		$('#extension').val('');
	}
}

function usZipDisplay()
{

		var zipCode = $.trim($("#zipcode").val());
		var split = zipCode.split("-");
		
		if(split.length==1 && zipCode.length>5)
		{
			var  val = zipCode.replace(/(.{5})/g,"$1-");
			$('#zipcode').val(val);
    	}
		if($('#zipcode').val().length>10)
		{
			$('#zipcode').val($('#zipcode').val().substr(0,10));
		}
		else if($('#zipcode').val().length==6)
		{
			$('#zipcode').val($('#zipcode').val().substr(0,5));
		}
}
	function isValidText(value) {
		if (value && typeof value != 'undefined' && value != 'null'
				&& value != 'undefined' && value != '')
			return true;
		return false;
	}

	$(document).ready(function() {
				   
		console.info('document.ready called()');
		
		$('#partyTypeCode').change(function(){
			$('#addressRole').val('');
		});
		
		$('#tariffNumber').change(function(){
			$('#tariffItem').val('');
		});		
		
		$('#organizationName').gatesAutocomplete({
			source: _context + '/cas/autocomplete.do',
			name: "Customer Name",
			extraParams: {
					 method: 'searchOrg',
					 searchType: '229',
					 parentSearch:  function() { return "BK|"; }
					 //parentSearch:  function() { return "BK|"+$('#tradeCode').val(); }
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
			formatItem : function(data) {
				console.info ("formatItem:" + data.name + " - " + data.id);
				return data.name + " - " + data.id;
			},
			formatResult : function(data) {
				console.info ("formatResult:" + data.name + " - " + data.id);
				return data.name + " - " + data.id;
			},
			select : function(data) {
				console.info ("select:" + data.name + " - " + data.id);
				$('#organizationName').val(data.name + " - " + data.id);
				$('#organizationId').val(data.id);
			}
		});		
		
		$('#organizationName').gatesPopUpSearch({
			func : function() {
				organizationPopupSearch();
			}
		});
		
		function organizationPopupSearch() {
			orgCaller = 'consignee';
			var orgName = $('#organizationName').val();
			var splitorgName = "";
			var actionUrl = "";
			if(orgName.indexOf(" - ") > 0){
				splitorgName = orgName.split(" - ");
				actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + encodeURIComponent(splitorgName[0]) + '|' + '|BK';
			}else{
				actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + orgName + '|' + '|BK';
			}
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'CustomerSearch', windowStyle);
		}
		
		$('#addressRole').gatesAutocomplete({
			source: _context + '/cas/autocomplete.do',
			name: "Customer Address",
			extraParams: {
					 method: 'searchAddRoleBK',
					 searchType: '234',
					 parentSearch:  function() { 
						 if ($('#partyTypeCode').val() != 'ALL') {
							 return $('#organizationId').val() + '|' + $('#partyTypeCode').val() + '|';
						 }
						 return $('#organizationId').val() + '|';						  
					}
					 //parentSearch:  function() { return $('#organizationId').val() + '||'; }
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
			formatItem : function(data) {
				var nameQualifier = data.nameQual;
				var coOrgName = data.coOrgName;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var id = data.addRole;
				var finalAddress = formatAddRoleForAutoComplete(nameQualifier, coOrgName, data.stAdd, city, state, zip, id);
				console.info ("formatItem:" + finalAddress);				
				return finalAddress;
			},
			formatResult : function(data) {
				var nameQualifier = data.nameQual;
				var coOrgName = data.coOrgName;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var id = data.addRole;
				var finalAddress = formatAddRoleForAutoComplete(nameQualifier, coOrgName, data.stAdd, city, state, zip, id);
				console.info ("formatResult:" + finalAddress);
				return finalAddress;
			},
			select : function(data) {
				var nameQualifier = data.nameQual;
				var coOrgName = data.coOrgName;
				var city = data.city;
				var state = data.state;
				var zip = data.zip;
				var id = data.addRole;
				var finalAddress = formatAddRoleForAutoComplete(nameQualifier, coOrgName, data.stAdd, city, state, zip, id);
				console.info ("select:" + finalAddress);
				$('#addressRole').val(finalAddress);
			}
		});		
		
		$('#addressRole').gatesPopUpSearch({
			func : function() {
				console.info('gatesPopUpSearch');
				addressRolePopupSearch();
			}
		});
		
		function addressRolePopupSearch() {
			orgCaller = 'consignee';
			
			if ($.trim($('#organizationName').val())=='') { 
				alert("Please select organization first");
			} else {
				var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
						+ encodeURIComponent($('#organizationId').val()) + '&filterValue2=' + $('#partyTypeCode').val() +'&filterValue3=';
						//+ encodeURIComponent($('#organizationId').val()) + '&filterValue2=&filterValue3=';
				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'AddressSearch', windowStyle);
			}
		}
				
		function formatAddRoleForAutoComplete(nameQualifier, coOrgName, addressLine1, city, state, zip, id) {
			var nameQualifierTemp = "";
			var addressLine1Temp = "";
			var coOrgNameTemp = "";
			var cityTemp = "";
			var stateTemp = "";
			if (isValidText(nameQualifier)) nameQualifierTemp = nameQualifier + " - ";
			if (isValidText(coOrgName)) coOrgNameTemp = coOrgName + " - ";
			if (isValidText(addressLine1)) addressLine1Temp = addressLine1;
			if (isValidText(city)) cityTemp = " - " + city;
			if (isValidText(state)) stateTemp = ", " + state;
			return nameQualifierTemp + coOrgNameTemp + addressLine1Temp + cityTemp + stateTemp + " - " + id;
		}
		
		function formatAddRoleForPopUp(nameQualifier, coOrgName, addressLine1, city, state, zip, id) {
			var nameQualifierTemp = "";
			var addressLine1Temp = "";
			var coOrgNameTemp = "";
			var cityTemp = "";
			var stateTemp = "";
			if (isValidText(nameQualifier)) nameQualifierTemp = nameQualifier + " - ";
			if (isValidText(coOrgName)) coOrgNameTemp = coOrgName + " - ";
			if (isValidText(addressLine1)) addressLine1Temp = addressLine1;
			if (isValidText(city)) cityTemp = " - " + city;
			if (isValidText(state)) stateTemp = ", " + state;
			return nameQualifierTemp + coOrgNameTemp + addressLine1Temp + cityTemp + stateTemp + " - " + id;
		}
		
		$('#tariffNumber').gatesAutocomplete({
			source: _context+'/cas/autocomplete.do',
			autoSelectWhenSingle:true,
			autoSelectFirst:true,
			autoSelectTextAfter:true,
			autoSelectCriteria:function(item) {
			   if(item != null){
			     return 'true';
			  } else {
			     return 'false';
			  }
			},
			name: "Tariff",
			extraParams: {
			 		 method: 'searchTariffSource',
			 		 searchType: '11',
			 		 groupType:  '01'
			 },
			 formatItem: function(data) {
				 data = data;
				 return data.name;
			 },
			 formatResult: function(data) {
				 data = data;
				 return data.name;
			 },
			 select: function(data) {
				 data = data;
				 $('#tariffNumber').val(data.name);			 		 
			 }		 
		});			
		
		$('#tariffItem').gatesAutocomplete({
			source: _context+'/cas/autocomplete.do',
			name: "Tariff Item",
			minLength: 1,
			autoSelectWhenSingle:true,
			autoSelectFirst:true,
			autoSelectTextAfter:true,
			autoSelectCriteria:function(item) {
				if(item != null){
				return 'true';
				  }
				  else {
				     return 'false';
				  }
			},
			extraParams: {
				method: 'searchItemName',
			 	searchType: '43',
			 	groupType:  '01',
			 	sourceTariff:  function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();},
			 	groupName:   function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();}
			 },
			 formatItem: function(data) {
				 data = data;
				 return data.name;
			 },
			 formatResult: function(data) {
				 data = data;
				 var value = $('#tariffNumber').val() + '-' + data.name;
				 return value;
			 },
			 select: function(data) {
				 data = data;
				 var value = $('#tariffNumber').val() + '-' + data.name;				 
				 $('#tariffItem').val(value);
			 }		 
		});			
		
	});

	function orgSearchUpdate(data) {
		data = data.split("|");
		console.info('orgSearchUpdate::' + data);
		console.info('orgSearchUpdate.name::' + data[0]);
		$('#organizationName').val(data[0] + " - " + data[2]);
		$('#organizationId').val(data[2]);
	}
	
	function addroleUpdate(data) {
		console.info('addroleUpdate::' + data);
		data = data.split("|");	
		var nameQualifier = data[4];
		var coOrgName = data[3];
		var addressLine1 = data[7];
		var city = data[2];
		var state = (data[6] || data[6] != "" || data[6] != "null")? data[6] : "";
		var zip = data[8];
		var id = data[9];
		var finalAddress = formatAddRoleForPopUp(nameQualifier, coOrgName, addressLine1, city, state, zip, id);	
		console.info('addroleUpdate.finalAddress::' + finalAddress);		
		$('#addressRole').val(finalAddress);		
	}
	
	function formatAddRoleForPopUp(nameQualifier, coOrgName, addressLine1, city, state, zip, id) {
		var nameQualifierTemp = "";
		var addressLine1Temp = "";
		var coOrgNameTemp = "";
		var cityTemp = "";
		var stateTemp = "";
		if (isValidText(nameQualifier)) nameQualifierTemp = nameQualifier + " - ";
		if (isValidText(coOrgName)) coOrgNameTemp = coOrgName + " - ";
		if (isValidText(addressLine1)) addressLine1Temp = addressLine1;
		if (isValidText(city)) cityTemp = " - " + city;
		if (isValidText(state)) stateTemp = ", " + state;		
		return nameQualifierTemp + coOrgNameTemp + addressLine1Temp + cityTemp + stateTemp + " - " + id;
	}	
	
	function clear($obj) {
		console.info ("clear:" + $obj);
		if ($obj) $obj.val('');
	}
	
	function refreshGuvnor() {
		var url = _guvnorUrl + "/cleancache";
		window.open(url, "", "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=300, height=200");
		
		if (true) return;
		 
		$.get(url, function() {
			alert("Guvnor successfully refreshed");
		}).fail(function() {
			alert("Error while refreshing Guvnor");
		});
	}	
	
$(function() {
	
	$('#updateTemplateForm').validationEngine('attach');
	$('#hd').hide();

	$('#tabSearchBox').hide();

	$('#organization').gatesAutocomplete(
		{
			source:_context+'/cas/autocomplete.do',
			name: "Customer Name",
		 	extraParams: {
 		 		 method: 'searchOrg',
 		 		 searchType: '229',
 		 		parentSearch:  function() { return "BK|"; }
		 	},
			formatItem : function(data) {
				return data.name + "-" + data.abbr;
			},
			formatResult : function(data) {
				return data.name + "-" + data.abbr;
			},
			select : function(data) {
				$('#organization').val(data.name + "-" + data.abbr);
				$('#organizationId').val(data.id);
				addressPopupSearch();
			}
		});
	
	$('#address').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
		 		 method: 'searchAddRoleBK',
		 		 searchType: '234',
		 		 parentSearch:  function() { return $('#organizationId').val() + '||'; }
	 	},
		formatItem : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
			return finalAddress;
		},
		formatResult : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state);
			return finalAddress;
		},
		select : function(data) {
			
			$('#addressRoleId').val(data.addRole);
		}
	});	
	
	// Organization Pop-Up Search
	$('#organization').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});

	// Address Pop-Up Search
	$('#address').gatesPopUpSearch({
		func : function() {
			addressPopupSearch();
		}
	});
	
	// Clear Organization details on change of Organization
	$('#organization').change(function() {
		if ($('#organization').val()=='' ) {
			$('#organizationId').val("");
			$('#address').val("");
			$('#address').trigger('change');
		}
		else if ($('#organizationId').val()=='' ) {
			$('#organization').val("");
			$('#address').val("");
			$('#address').trigger('change');
		}
	});
	
	// Clear address details on change of address
	$('#address').change(function() {
		if ($('#address').val()=='' ) {
			$('#addressRoleId').val('');
		}
		else if($('#addressRoleId').val()==''){
			$('#address').val('');
		}
	});
	
	$('#runReport').click(function(){
		$("#updateTemplateForm").validationEngine('hideAll');
		if($("#updateTemplateForm").validationEngine('validate'))
		{
			if($('#address').val() == '' || $('#addressRoleId').val() == '')
				alert("Address Role Id is required");
			else
			{
				var queryString = $('#updateTemplateForm').formSerialize();
				/*	window.open(_context+'/booking/report/' + 
							'updateTemplate/runReport?'+queryString);*/
				$.ajax({
					type : "POST",
					url : _context+"/booking/report/updateTemplate/runReport",
					data : queryString,
					success : function(responseText) {
						if(responseText.success)
							$('#msgDiv').html('<div class="message_success">Batch Job request submitted successfully</div>');
						else
							$('#msgDiv').html('<div class="message_error">An error occurred while triggerring the Batch Job</div>');
					}
				});
			}
		}
	});
	
	$('#reset').click(function(){
		$('#organization').val('');
		$('#organizationId').val('');
		$('#address').val("");
		$('#addressRoleId').val("");
		$('#contactUpdate').attr('checked', false);
		$('#debtorUpdate').attr('checked', false);
	});
	
	$('#exit').click(function(){
		
		//document.location.href = _context+"/welcome.html";
		window.close();
	});
	
});

function organizationPopupSearch() {
	var orgName = $('#organization').val();
	var splitOrgName = "";
	var actionUrl = "";
	if(orgName.indexOf("-") > 0){
		splitOrgName = orgName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=||BK|||'+encodeURIComponent(splitOrgName[1]);
	}else{
		splitOrgName = orgName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
		+ orgName + '||BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function addressPopupSearch() {
	
	if ($.trim($('#organizationId').val())=='') { 
		alert("Please select organization first");
	}
	else {
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('#organizationId').val()) + '&filterValue2='+'&filterValue3=';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}
	
function orgSearchUpdate(id) {
	var values = id.split("|");
	$('#organization').val(values[0] +"-"+ values[1]);
	$('#organizationId').val(values[2]);
	addressPopupSearch();
}

function addroleUpdate(data)
{
	var values = data.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('#address').val(finalAddress);
	$('#addressRoleId').val(values[9]);
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
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
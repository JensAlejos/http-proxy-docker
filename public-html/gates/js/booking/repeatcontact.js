var repeatCaller ="";
var repeatOrgName = "";
var repeatAddress = "";

$(function() {

	clearRepeatContactForm();
	
	repeatContactOrgPredictive();
	repeatContactAddressPredictive();

	$('#repeatContactOrgName').gatesPopUpSearch({
		func : function() {
			orgPopupSearch();
		}
	});

	$('#repeatContactOrgAddress').gatesPopUpSearch({
		func : function() {
			orgAddressPopupSearch();
		}
	});

	$('#repeatContactOrgName').change(function(){
		if($('#repeatContactOrgId').val()== null || $('#repeatContactOrgId').val()==""){
			$('#repeatContactOrgName').val(""); 
			$('#repeatContactAddressRoleId').val('');
			$('#repeatContactOrgAddress').val('');
			repeatContactAddressPredictive();
		}
		else if($('#repeatContactOrgName').val()!=repeatOrgName)
		{
			$('#repeatContactOrgName').val('');
			$('#repeatContactOrgId').val("");
			$('#repeatContactAddressRoleId').val('');
			$('#repeatContactOrgAddress').val('');
			repeatContactAddressPredictive();
		}
	});
	
	$('#repeatContactOrgAddress').change(function(){
		if($('#repeatContactAddressRoleId').val()== null 
				|| $('#repeatContactAddressRoleId').val()=="")
			$('#repeatContactOrgAddress').val(""); 
		else if($('#repeatContactOrgAddress').val()!=repeatAddress)
		{
			$('#repeatContactOrgAddress').val('');
			$('#repeatContactAddressRoleId').val('');
		}
	});

	$("#repeatContactOverlay").dialog({ 
		title: 'Repeat Contact', 
		autoOpen: false , 
		width: 470, 
		height: 550, 
		modal: true,
		open : function()
		{
			$('#repeatContactOrgName').attr('disabled', true);
			$('#repeatContactOrgAddress').attr('disabled', true);
			$('#popupSearchrepeatContactOrgName').hide();
			$('#popupSearchrepeatContactOrgAddress').hide();
			$('#repeatContactOrgYes').val("Y");
			$('#repeatContactYes').val("Y");
			$('#repeatContactOverlay').validationEngine('attach');
			$('#repeatContactOrgYes').focus();
		},
		close : function()
		{
			$('#repeatContactOverlay').validationEngine('hideAll');
			$('#repeatContactOverlay').validationEngine('detach');
			clearRepeatContactForm();
			if(repeatCaller=='shipper')
				$('#shipperRepeatContact').attr("checked", false);
			else if(repeatCaller=='consignee')
				$('#consigneeRepeatContact').attr("checked", false);
			else if(repeatCaller=='parties')
				$('#partiesRepeatContact').attr("checked", false);
		},
		buttons: {
		"Cancel": function(){
			$(this).dialog('close');
		},
        "Send to Data Admin": function() {
        	if($("#bookingStatusCode").val()=='CANC'){
        		$(this).dialog('close');
        		return;
        	}
			if($('#repeatContactOrgNo').attr('checked') && ($('#repeatContactOrgName').val()=='')){
				$('#repeatContactOrgName').validationEngine('showPrompt', 'Oranization name cannot be empty', 'error', 'topRight', true);
			}else if($('#repeatContactOrgNo').attr('checked') && $('#repeatContactOrgAddress').val()==''){
				$('#repeatContactOrgAddress').validationEngine('showPrompt', 'Oranization Address cannot be empty', 'error', 'topRight', true);}
			else if($('#repeatContactOrgNo').attr('checked') && $('#repeatContactAddressRoleId').val()==$('#repeatContactOriginalAroleId').val()){
				$('#repeatContactOrgAddress').validationEngine('showPrompt', 'Please select a different address role than original', 'error', 'topRight', true);
			}else if($('#repeatContactYes').attr('checked') && $('#repeatContactId').val()==''){
				$('#repeatContactId').validationEngine('showPrompt', 'Please select contact to replace', 'error', 'topRight', true);}
			else  if($('#repeatContactYes').attr('checked') && $('#repeatContactId option:selected').text()==$('#repeatContactNameLabel').html()){
				$('#repeatContactId').validationEngine('showPrompt', 'Please select different contact to replace existing contact', 'error', 'topRight', true); 
			}else{
				
				var queryString = $('#repeatcontact').formSerialize()+"&repeatContactNameLabel="+$('#repeatContactNameLabel').text()
				+"&repeatContactName="+$('#repeatContactId option:selected').text().split("-")[0].trim();
				blockUI();
				var found =document.querySelectorAll( ".ui-button" );
					found[9].setAttribute("disabled","disabled");
				$.ajax({
					url : _context +"/booking/repeatContact/sendMail",
					data: queryString ,
					success : function(responseText) {
						$.unblockUI();
						found[9].removeAttribute("disabled");
						if(responseText.success)
						{
							if(repeatCaller == 'parties')
								alert(responseText.messages.success[0]);
							else
								showResponseMessages("msgDiv", responseText);
							
							$("#repeatContactOverlay").dialog("close");
						}
						else
							//showResponseMessages("repeatCustMsgDiv", responseText);
							alert(responseText.messages.error[0]);
					}
				});
			}
		}
	}});
	
	//toggle radio
	$('#repeatContactOrgYes').click(function(){
		$('#repeatContactOrgNo').attr('checked', false);
		$('#repeatContactOrgName').val('');
		$('#repeatContactOrgAddress').val('');
		$('#repeatContactAddressRoleId').val('');
		$('#popupSearchrepeatContactOrgName').hide();
		$('#popupSearchrepeatContactOrgAddress').hide();
		$('#repeatContactOrgName').attr('disabled', true);
		$('#repeatContactOrgAddress').attr('disabled', true);
		$('#repeatContactOrgYes').val("Y");
	});

	//toggle radio
	$('#repeatContactOrgNo').click(function(){
		$('#repeatContactOrgYes').attr('checked', false);
		$('#popupSearchrepeatContactOrgName').show();
		$('#popupSearchrepeatContactOrgAddress').show();
		$('#repeatContactOrgName').attr('disabled', false);
		$('#repeatContactOrgAddress').attr('disabled', false);
		$('#repeatContactOrgNo').val("N");
	});

	//toggle radio
	$('#repeatContactYes').click(function(){
		$('#repeatContactNo').attr('checked', false);
		$("#repeatContactId").attr("disabled", false);
		$('#repeatContactYes').val("Y");
	});

	//toggle radio
	$('#repeatContactNo').click(function(){
		$('#repeatContactYes').attr('checked', false);
		$("#repeatContactId").attr("disabled", true);
		$('#repeatContactNo').val("N");
	});

});

function repeatContactOrgPredictive()
{
	/*var urlRepeatOrg = _context
	+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK';
	*/
	$('#repeatContactOrgName').gatesAutocomplete({
		//source : urlRepeatOrg,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Name",
	 	extraParams: {
		 		 method: 'searchOrg',
		 		 searchType: '229',
		 		 parentSearch:  function() { return 'BK'; }
	 	},
		formatItem : function(data) {
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
		},
		select : function(data) {
			$('#repeatContactOrgName').val(data.name + "-" + data.abbr);
			$('#repeatContactOrgId').val(data.id);
			$("#repeatContactOrgAddress").val("");
			repeatOrgName = data.name + "-" + data.abbr;
			//repeatContactAddressPredictive();
			orgAddressPopupSearch();
		}
	});
}

function repeatContactAddressPredictive()
{
	$('#repeatContactOrgAddress').gatesAutocomplete({
		//source : urlRepeatAdd,
		source:_context+'/cas/autocomplete.do',
		name: "Customer Address",
	 	extraParams: {
		 		 method: 'searchAddRoleBK',
		 		 searchType: '234',
		 		 parentSearch:  function() { return $('#repeatContactOrgId').val(); }
	 	},
		formatItem : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			return finalAddress;
		},
		formatResult : function(data) {
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			return finalAddress;
		},
		select : function(data) {
			$("#repeatContactAddressRoleId").val(data.addRole);
			var nameQualifier = data.nameQual;
			var city = data.city;
			var state = data.state;
			var zip = data.zip;
			var finalAddress = formatAddRoleDscrForSC(nameQualifier, data.stAdd, city, state, zip);
			repeatAddress = finalAddress;
		}
	});
}

function orgPopupSearch() {
	orgCaller = 'repeat';
	
	var orgName = $('#repeatContactOrgName').val();
	var splitOrgName = "";
	var actionUrl = "";
	
	if (orgName.indexOf("-") > 0){
		splitOrgName = orgName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+encodeURIComponent(splitOrgName[0])
		+'||BK|||'+encodeURIComponent(splitOrgName[1]);
	} else {
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + 
		encodeURIComponent(orgName) + '||BK';
	}
	
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function orgAddressPopupSearch() {
	orgCaller = 'repeat';
	
	if ($.trim($('#repeatContactOrgId').val())=='') { 
		alert("Please select organization first");
	}else {
		/*var filterVal2ForCAS = ""; 

		if(repeatCaller=='shipper')
			filterVal2ForCAS="02";
		else if(repeatCaller=='consignee')
			filterVal2ForCAS="03";*/

		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('#repeatContactOrgId').val()) /*+ '&filterValue2='+filterVal2ForCAS*/;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	}
}

function clearRepeatContactForm()
{
	$("#repeatcontact").clearForm();
	
	$("#repeatContactNameLabel").html('');
	
	$('#repeatContactOrgId').val('');
	$('#repeatContactAddressRoleId').val('');
	$('#originalOrgName').val('');
	$('#originalOrgAddress').val('');
	$('#repeatContactShipmentNo').val('');
	$('#repeatContactOriginalAroleId').val('');
	
	repeatOrgName = "";
	repeatAddress = "";
	
	$('#repeatContactOrgYes').attr('checked',true);
	$('#repeatContactOrgNo').attr('checked',false);

	$('#repeatContactOrgName').attr('disabled', true);
	$('#repeatContactOrgAddress').attr('disabled', true);
	$('#popupSearchrepeatContactOrgName').hide();
	$('#popupSearchrepeatContactOrgAddress').hide();
	$('#repeatContactOrgYes').val("Y");

	$('#repeatContactYes').attr('checked',true);
	$('#repeatContactNo').attr('checked',false);
	$('#repeatContactYes').val("Y");
}
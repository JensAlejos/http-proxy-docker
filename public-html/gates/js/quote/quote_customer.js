/**
 *  Javascript File for Customer and Some function of One time customer section
 *  Other files to be referred for quote screen are 
 *  quote.js
 *  quote_routing.js
 *  quote_notify.js
 *  add_one_time_customer.js  
 */

$(function() {
	
	loadCityStateZip();
	var statusCodeVal = $('#statusCode').val();			
	if(statusCodeVal == "ISSD" || statusCodeVal == "BKGD") {
		$("#contactName").attr("readonly", true);
	}
	
	$('#customerName').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});
	
	/*
	 * For Customer Predictive Search
	 */   
	var custData="";
	$('#customerName').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: 'Customer Name',
	 	extraParams: {
		 		 method: 'searchOrg',
		 		 searchType: '229',
		 	     parentSearch:  function() { return "QT|"+$('#tradeCode').val(); }
	 	},
		formatItem : function(data) {
			$(data).each(function(){
				custData=custData+"&"+data.abbr+"|"+data.name+"|"+data.id;								     	    	
			});
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.name + "-" + data.abbr;
		},
		select : function(data) {
			$("#orgName").val(data.name + "-" + data.abbr);
			$('#customerName').val($("#orgName").val());
			$("#organizationId").val(data.id);
			$("#addRolDesc").val("");
			$("#addressRoleId").val("");
			clearContactDetails();
			_isQuoteChanged = true;
			singleAddressCall();
			//addRolDescPopupSearch();
		},
		autoSelectWhenSingle : true,
		onChange:function() {		
			if ($("#organizationId").val() != "" && ($('#customerName').val() != $('#orgName').val() || 
					($('#organisationName').val() != undefined && $('#customerName').val() != $('#organisationName').val()))) {
				$('#addRolDesc').val("");
				$("#organizationId").val("");
				if($("#addRolDesc").val() == ""){
					$("#addressRoleId").val("");	
					clearContactDetails();
				}
				_isQuoteChanged = true;
			}
		},
		onBlur:function(){
			var cust=$("#customerName").val();
			var flag=true;
			if(cust!='' && cust!='ALL' && $.trim(custData)!='' && cust.indexOf("-")<=0){
				
				var values=custData.split("-");
				for(var i=1;i<values.length;i++){
					var val=values[i].split("|");
					if(cust.toUpperCase()==val[0].toUpperCase()
							|| cust.toUpperCase()==val[1].toUpperCase()){
						$("#organizationId").val(val[2]);
						$("#customerName").val(val[1]+"-"+val[0]);
						flag=false;
						break;
					}
				}
				addRolDescPopupSearch();
			}
			if(flag && cust.indexOf("-")<=0 &&  $.trim(custData)!=''){
				$("#customerName").val("");
				$("#organizationId").val("");
			}
			var isOTC = $('#showOneTimeCustomerCheck').is(':checked');
			if(($("#organizationId").val()== null || $("#organizationId").val()=="") && !isOTC ){
		    	$("#customerName").val("");  
			}
			setAccordianTabDetails("customerNameDiv", " - "+$("#customerName").val());
		}
	});
	
	
	$('#addRolDesc').gatesAutocomplete({		
		source:_context+'/cas/autocomplete.do',
		name: 'Address',
	 	extraParams: {
		 		 method: 'searchAddRolDesc',
		 		 searchType: '245',
		 		 parentSearch:  function() { return $("#organizationId").val()+'|QT'; }
	 	},
		mustMatch: true,
		formatItem: function(data) {
			return formatAddRoleDscr(data.name, data.address, data.city, data.state);
		},
		formatResult: function(data) {
			return formatAddRoleDscr(data.name, data.address, data.city, data.state);
		},
		select: function(data) {
			$("#contactName").empty();
			$("#addRolDesc").val(data.address);
			$("#addressRoleId").val(data.id);
			/*$("#addressLine1").val(data.address);*/
			/*$("#cityStateZip").val(data.city);*/
			$("#quoteSuite").val(validateNull(data.suite));
			$("#cityName").val(validateNull(data.city));
			$("#stateCode").val(validateNull(data.state));
			$("#zipCode").val(validateNull(data.zip));			
			$("#zipCustomer").val(validateNull(data.zip));			
			$("#country").val(validateNull(data.cntry));
			_isQuoteChanged = true;
			var contactNameDataList = "";
			$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + $("#organizationId").val() + "|" + data.id,
				function(contacts) {
					$('#contactName').append("<option value=''>Select</option>");
					$(contacts).each(function() {
						var formattedName = getFormattedName(validateForUndefined(this.label), 
								validateForUndefined(this.dept), validateForUndefined(this.title));
						var option = $('<option />');
						option.attr('value', this.value).text(unescape(formattedName.replace(/ /g, "%A0")));
						$('#contactName').append(option);
						contactNameDataList += this.value + "!?" + this.label + "!?"
								+ validateForUndefined(this.phcntry) + "!?" 
								+ validateForUndefined(this.pharea) + "!?" 
								+ validateForUndefined(this.phexch) + "!?" 
								+ validateForUndefined(this.phstcde) + "!?" 
								+ validateForUndefined(this.phextn) + "!?" 
								+ validateForUndefined(this.fxcntry) + "!?" 
								+ validateForUndefined(this.fxarea) + "!?" 
								+ validateForUndefined(this.fxexch) + "!?" 
								+ validateForUndefined(this.fxstcde) + "!?" 
								+ validateForUndefined(this.email) + "|"; 
					});
					$("#contactNameDataList").val(contactNameDataList);
					$('#contactName').trigger('blur');					
			});
		},
		autoSelectWhenSingle : true,
		onChange:function() {
			$('#addressId').val("");
			if($("#addRolDesc").val() == ""){
				$("#addressRoleId").val("");
				clearContactDetails();
			}		
			_isQuoteChanged = true;
		}
	});
	
	$('#addRolDesc').gatesPopUpSearch({
		func : function() {
			addRolDescPopupSearch();
		}
	});
	
	/*
	 * Code to blank all Maintain Customer Fields if "Customer" is Changed or
	 * left blank.
	 */	
	//Added for D028659
	$('#customerName').change(function(){
		_isQuoteChanged = true;
	});
	$('#contactFirstName').change(function() {		
		clearContactFieldsDetails();
		$("#contactName").val($("#contactName").selected(0));
		$("#contactId").val("");
	});
	
	$('#contactLastName').change(function() {		
		$("#contactName").val($("#contactName").selected(0));
		clearContactFieldsDetails();		
		$("#contactId").val("");
	});

	/*
	 * Code to blank all Maintain Customer Fields if "Address" is Changed or
	 * left blank.
	 */		
	
	$('#contactName').blur(function() {
		var selectedContact = "";
		if($("#contactName option:selected").val() != null){
			selectedContact = $("#contactName option:selected").val();
		}else{
			selectedContact = $("#contactId").val();	
		}
		if(selectedContact != "" && $("#organizationId").val() != ""){
			$("#contactFirstName").val("");
			$("#contactLastName").val("");
			var contactNameDataList = $("#contactNameDataList").val().split("|");
			for (var i=0; i<contactNameDataList.length; i++) {
				var contactId = contactNameDataList[i].split("!?")[0];
				if (contactId == selectedContact) {
					clearContactNameDetails();
					if($("#callingEntityMethod").val() != undefined 
							&& $("#callingEntityMethod").val() != "getQuote"
								&& $("#callingEntityMethod").val() != "returnClause"
								&& $("#callingEntityMethod").val() != "correctQuote"
								&& $("#callingEntityMethod").val() != "replicateQuote"){
						clearContactFieldsDetails();
					}
					var details = contactNameDataList[i].split("!?");
					var names = "";
					if(details[1] != null){
						names = details[1].split("-");	
					}
									
					$("#contactId").val(contactId);
					if($("#callingEntityMethod").val() != undefined 
							&& $("#callingEntityMethod").val() != "getQuote"
								&& $("#callingEntityMethod").val() != "returnClause"
								&& $("#callingEntityMethod").val() != "correctQuote"
								&& $("#callingEntityMethod").val() != "replicateQuote"){				
						$('#phoneCountryCode').val(details[2]);
						$('#phoneAreaCode').val(details[3]);
						$('#phoneExchange').val(details[4]);
						$('#phoneStation').val(details[5]);
						$('#phoneExtension').val(details[6]);
						
						$('#faxCountryCode').val(details[7]);
						$('#faxAreaCode').val(details[8]);
						$('#faxExchange').val(details[9]);
						$('#faxStation').val(details[10]);
						$('#emailAddress').val(details[11]);
					}
				}
			}
		}else{
			if($("#organizationId").val() != ""){
				$("#contactId").val(selectedContact);	
			}			
			if($("#callingEntityMethod").val() != undefined 
					&& $("#callingEntityMethod").val() != "getQuote"
						&& $("#callingEntityMethod").val() != "returnClause"
						&& $("#callingEntityMethod").val() != "correctQuote"
						&& $("#callingEntityMethod").val() != "replicateQuote"
						&& $("#callingEntityMethod").val() != "issueQuote" && $("#organizationId").val() != ""){
				clearContactFieldsDetails();
			}
		}
	});

	/*
	 * One Time Customer
	 */
	$('#showOneTimeCustomer').click(function() {
		if ($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD") {
			if(!($("#organizationId").val() != "")){
				showAddOneTimeCustomerDialog(); // Method is in add_one_time_cusomer.js	
			}else{
				return;
			}			
		}else{
			showAddOneTimeCustomerDialog(); // Method is in add_one_time_cusomer.js
		}
	});

	$('#showOneTimeCustomerCheck').change(function() {
		var isOTC = $('#showOneTimeCustomerCheck').is(':checked');
		if (isOTC == false) { // As the checkbox was checked before click
			var r= confirm("The existing one time customer will be erased. Do you want to continue?");
			if (r == false) {
				$('#showOneTimeCustomerCheck').attr("checked", true);
				return;
			}
			_isQuoteChanged = true;
			$('#customerName').val("");
			$('#addRolDesc').val("");
			$('#showOneTimeCustomerCheck').attr("disabled", true);
		}else{
			$('#showOneTimeCustomerCheck').removeAttr("disabled");
		}
		toggleOneTimeCustCheck();
		clearContactDetails();
		clearOneTimeCustomerForm(); // Method is in add_one_time_cusomer.js
	});
	
	//code to tab out in Phone fields
	var chkPhoneCountry =true;
	var chkPhoneArea = true;
	var chkPhoneExchange = true;
	 
	$('#phoneCountryCode').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneCountry){
	    	 this.select();
	    	 chkPhoneCountry = false;
	     }
	});
	$('#phoneCountryCode').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#phoneCountryCode').val()=='1' || 
	    		 $('#phoneCountryCode').val()=='01' ||  
	    		 $('#phoneCountryCode').val().length == 2){	    	 
	    	 $('#phoneAreaCode').focus();
			 chkPhoneCountry =true;
	     }
	}); 
	
	$('#phoneAreaCode').focus(function(evt) {
		chkPhoneArea = true;
	});
	$('#phoneAreaCode').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('#phoneAreaCode').val('');
	     }
	     if(( $('#phoneAreaCode').val().length == 3 && ($('#phoneCountryCode').val()=='1' || 
	    		 $('#phoneCountryCode').val()=='01')) || 
	    		 $('#phoneAreaCode').val().length == 4){
	    		$('#phoneExchange').focus();
	     }
	}); 
	
	$('#phoneAreaCode').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	      if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	$('#phoneAreaCode').val('');
	     }
	}); 
	$('#phoneExchange').focus(function(evt) {
		chkPhoneExchange = true;
	});
	
	$('#phoneExchange').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
			if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	$('#phoneExchange').val('');
	     }
	     if(($('#phoneExchange').val().length == 3 &&  ($('#phoneCountryCode').val()=='1' || 
	    		 $('#phoneCountryCode').val()=='01')) || 
	 		$('#phoneExchange').val().length == 4){
	    	 $('#phoneStation').focus();
	     }
	}); 
	
	$('#phoneExchange').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	    if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $('#phoneExchange').val('');
	     }
	});
	
	//code to tab out in Phone fields
	var chkFaxCountry =true;
	var chkFaxArea = true;
	var chkFaxExchange = true;

	
	$('#faxCountryCode').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxCountry){
	    	 this.select();
	    	 chkFaxCountry = false;
	     }
	});
	$('#faxCountryCode').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#faxCountryCode').val()=='1' || 
	    		 $('#faxCountryCode').val()=='01' ||  
	    		 $('#faxCountryCode').val().length == 3){
	    	 $('#faxAreaCode').focus();
	    	 chkFaxCountry =true;
	     }
	}); 
	
	
	$('#faxAreaCode').focus(function(evt) {
		chkFaxArea = true;
	});
	$('#faxAreaCode').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
		if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	$('#faxAreaCode').val('');
	     }
	     if(( $('#faxAreaCode').val().length == 3 && ($('#faxCountryCode').val()=='1' || 
	    		 $('#faxCountryCode').val()=='01')) || 
	    		 $('#faxAreaCode').val().length == 4){
	    		$('#faxExchange').focus();
	     }
	}); 
	
	$('#faxAreaCode').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	      if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	$('#faxAreaCode').val('');
	     }
	}); 
	$('#faxExchange').focus(function(evt) {
		chkFaxExchange = true;
	});
	
	$('#faxExchange').keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
			if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	$('#faxExchange').val('');
	     }
	     if(($('#faxExchange').val().length == 3 &&  ($('#faxCountryCode').val()=='1' || 
	    		 $('#faxCountryCode').val()=='01')) || 
	 		$('#faxExchange').val().length == 4){
	    	 $('#faxStation').focus();
	     }
	}); 
	
	$('#faxExchange').keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	    if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $('#faxExchange').val('');
	     }
	});
	setDefaultPrefMethod();
});

/********** Supporting functions **********/

function setDefaultPrefMethod(){
	if(!($('#preferFax').attr('checked') || $('#preferMail').attr('checked') )){
		$('#preferPhone').attr('checked',true);
		$('#preferFax').attr('checked',false);
		$('#preferMail').attr('checked',false);
	}
	
}


function organizationPopupSearch() {
	if ($('#showOneTimeCustomerCheck').is(":checked")) {
		return;
	}
	var values=$('#customerName').val().split("-");
	var param;
	var actionUrl ='';
	if(values[1]!=null){
		param=values[1];
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=||QT|||'+param;
	}else{
		param=values[0];
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + param+'||QT';
	}
    var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function orgSearchUpdate(id){
	var values = id.split("|");
	$("#organizationId").val(values[2]);
	var orgCode = values[1];
	var orgName= values[0];
	$('#customerName').val(orgName+'-'+orgCode);	
	$("#addRolDesc").val("");
	$("#addressRoleId").val("");
	clearContactDetails();	
	_isQuoteChanged = true;
	singleAddressCall();
	 //addRolDescPopupSearch();
}

function addRolDescPopupSearch() {
	if ($('#customerName').val()) {
		if ($("#organizationId").val()) {
			var actionUrl = _context
					+ '/cas/addRoleBKLookup.do?filterValue1='
					+ $("#organizationId").val();			
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'AddressSearch', windowStyle);
		} 
	}
}

function addroleUpdate(id) {
	// ADDRESS_ROLE_ID,ORGANIZATION_ID,NAME_QUALIFIER,C_O_ABBREV,ADDRESS,SUITE,CITY,STATE,ZIP,COUNTRY,ADDRESS_TYPE_DESC,ACTIVE
	clearContactDetails();
	var values = id.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	var city = formatCityStateZip(values[2], values[6], values[8]);
	
	$("#addressRoleId").val(values[9]);
	$("#addRolDesc").val(finalAddress);
	$("#quoteSuite").val(validateNull(values[12]));
	$("#cityName").val(validateNull(values[2]));
	$("#stateCode").val(validateNull(values[6]));
	$("#zipCode").val(validateNull(values[8]));
	$("#zipCustomer").val(validateNull(values[8]));
	$("#country").val(validateNull(values[11]));
	
	_isQuoteChanged = true;
	
	var inp1 = $("#addressRoleId").val();
	var inp2 = $("#organizationId").val();
	var contactNameDataList = "";
	$('#contactName').empty();
	$('#contactName').val('ALL');
	if((inp1!="" && inp1!="ALL")&&(inp2!="" && inp2!="ALL")){
		$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + inp2 + "|" + inp1,
			function(contacts){
				$('#contactName').append("<option value=''>Select</option>");
				$(contacts).each(function() {
					var formattedName = getFormattedName(validateForUndefined(this.label), 
														validateForUndefined(this.dept), validateForUndefined(this.title));
					var option = $('<option />');
					option.attr('value', this.value).text(unescape(formattedName.replace(/ /g, "%A0")));
					$('#contactName').append(option);
					contactNameDataList += this.value + "!?" + this.label + "!?" 
							+ validateForUndefined(this.phcntry) + "!?" 
							+ validateForUndefined(this.pharea) + "!?" 
							+ validateForUndefined(this.phexch) + "!?" 
							+ validateForUndefined(this.phstcde) + "!?" 
							+ validateForUndefined(this.phextn) + "!?" 
							+ validateForUndefined(this.fxcntry) + "!?" 
							+ validateForUndefined(this.fxarea) + "!?" 
							+ validateForUndefined(this.fxexch) + "!?" 
							+ validateForUndefined(this.fxstcde) + "!?" 
							+ validateForUndefined(this.email) + "|"; 
				});
				$("#contactNameDataList").val(contactNameDataList);
				$('#contactName').trigger('blur');				
			});
		_isQuoteChanged = true;
	}
}

function loadCityStateZip() {
	var cityName = $("#cityName").val();
	var stateCode = $("#stateCode").val();
	var zipCode = $("#zipCode").val();

	var cityStateZip = formatCityStateZip(cityName, stateCode, zipCode);
}

function validateForUndefined(text) {
	if (text == undefined) {
		return "";
	} else {
		return text;
	}
}

function loadOneTimeCustDetails() {// Changes should be made in this function
	if ($("#organizationId").val() == "" && 
			($("#contactFirstName").val() != "" || $("#contactLastName").val() != "") ) {
		$('#showOneTimeCustomerCheck').attr("checked", true);
		if (!($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD")) {
			$('#showOneTimeCustomerCheck').removeAttr("disabled");
		}
		setOTCValues(); // Method in add_one_time_customer.js
		$("#customerName").val($("#custContactName").val());
		var addRolDesc = "";
		var selected15 = $('#custAddressLine1').val();
		var selected16 = $('#custAddressLine2').val();
		var selected17 = $('#custAddressLine3').val();
		if(selected15.trim() != ""){
			addRolDesc = selected15;// Did changes here, removed the "," at the end
			//Defect number D025279
		}
		if(selected16.trim() != ""){
			addRolDesc = addRolDesc + ", " + selected16;//Added the , between 
		}
		if(selected17.trim() != ""){
			addRolDesc = addRolDesc + ", " + selected17;// Added the , between 
		}
		$("#addRolDesc").val(addRolDesc);
	}
	setContactName();
}

function onlyOneGroup(){
	if($("#selectedCustomerGroup").val() != undefined){
		$("#customerGroup option").each(function() {
			if ($("#selectedCustomerGroup").val() == this.value) { 
				$(this).attr('selected', 'selected');
			}
		});	
	}		
}

function toggleOneTimeCustCheck() {
	var isOTC = $('#showOneTimeCustomerCheck').is(':checked');
	if (isOTC == false ) {		
		if (!($('#quoteId').val()!= "" && ($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD"))) {
			$("#showOneTimeCustomerCheck").attr("disabled", true);		
			$("#customerName").removeAttr("readonly");
			$("#addRolDesc").removeAttr("readonly");	
		}
		
	} else {
		$("#showOneTimeCustomerCheck").removeAttr("disabled");
		$("#customerName").attr("readonly", true);
		$("#addRolDesc").attr("readonly", true);
	}	
}

function clearContactDetails() {
	$("#referenceNumber").val("");
	$("#referenceNumber").removeAttr("readOnly");
	$("#quoteSuite").val("");	
	$("#contactName").empty();
	$("#contactName").removeAttr("readOnly");
	$("#cityName").val("");	
	$("#customerName").removeAttr("readOnly");	
	$("#stateCode").val("");
	$("#stateCode").removeAttr("readOnly");
	$("#zipCode").val("");
	$("#zipCustomer").val("");
	$("#zipCode").removeAttr("readOnly");
	$("#zipCustomer").removeAttr("readOnly");
	$("#country").val("");
	$("#country").removeAttr("readOnly");
	$("#contactLastName").val("");
	$("#contactLastName").removeAttr("readOnly");
	$("#contactFirstName").val("");
	$("#contactFirstName").removeAttr("readOnly");
	clearContactNameDetails();
	clearContactFieldsDetails();
}

function clearContactFieldsDetails(){
	$("#phoneCountryCode").val("");
	$("#phoneCountryCode").removeAttr("readOnly");
	$("#phoneAreaCode").val("");
	$("#phoneAreaCode").removeAttr("readOnly");
	$("#phoneExchange").val("");
	$("#phoneExchange").removeAttr("readOnly");
	$("#phoneStation").val("");
	$("#phoneStation").removeAttr("readOnly");
	$("#phoneExtension").val("");
	$("#phoneExtension").removeAttr("readOnly");
	
	$("#faxCountryCode").val("");
	$("#faxCountryCode").removeAttr("readOnly");
	$("#faxAreaCode").val("");
	$("#faxAreaCode").removeAttr("readOnly");
	$("#faxExchange").val("");
	$("#faxExchange").removeAttr("readOnly");
	$("#faxStation").val("");
	$("#faxStation").removeAttr("readOnly");
	$("#emailAddress").val("");
	$("#emailAddress").removeAttr("readOnly");
}

function clearContactNameDetails() {
	$("#contactId").val("");
	$("#contactId").removeAttr("readOnly");	
    $("#customerName").removeAttr("readOnly");	
}

// ===============Formatters===============

function formatAddRoleDscr(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	nameQualifier = validateNull(nameQualifier);
	addressLine1 = validateNull(addressLine1);
	city = validateNull(city);
	state = validateNull(state);
	
	if (nameQualifier != "" && nameQualifier != "undefined" && nameQualifier != undefined) {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

function formatCityStateZip(city, state, zipcode) {
	var cityTemp = "";
	var stateTemp = "";
	var zipcodeTemp = "";
	
	city = validateNull(city);
	state = validateNull(state);
	zipcode = validateNull(zipcode);
	
	if (city != "") {
		cityTemp = city;
	}
	if (state != "") {
		if (cityTemp != "") {
			stateTemp = "," + state;
		} else {
			stateTemp =  state;
		}
	}
	if (zipcode != "") {
		zipcodeTemp = " - " + zipcode;
	}
	 return cityTemp + stateTemp + zipcodeTemp;
}

function getFormattedName(label, dept, title) {	
	
	label = validateNull(label);
	dept = validateNull(dept);
	title = validateNull(title);
	var names = label.split("-");
	var formattedName = "";
	var type = $.trim(names[0]);
	var fName = $.trim(names[1]);
	var lName = $.trim(names[2]);
	var lengthName=0;
	if(fName != "" || lName != "" ) {
		var name=fName+" "+lName;
		lengthName=name.length;
		if (type !="") {
			formattedName = fName + " " + lName+ "-" + type ;
		} else {
			formattedName = fName + " " + lName;
		}
	} else if(title != "" && dept != "") {
		var val=title + ', ' + dept;
		lengthName=val.length;
		if (type !="") {
			formattedName = title + ', ' + dept +"-" +type;
		} else {
			formattedName = title + ', ' + dept;
		}
	} else if(title != null && title != "") {
		var val=title;
		lengthName=val.length;
		if (type !="") {
			formattedName =   title+ "-" +type;
		} else {
			formattedName = title;
		}
	} else if(dept != null && dept != "") {
		var val=dept;
		lengthName=val.length;
		if (type !="") {
			formattedName =  dept+"-" +type;
		} else {
			formattedName = dept;
		}
	}
	var spaces='';
	var remLen=35-lengthName;
	if(remLen<35){
		spaces='%A0';
		for(i=0;i<remLen;i++){
			spaces=spaces+'%A0';
		}	
	}
	var values=formattedName.split("-");
	var val=values[0].concat(spaces);
	formattedName=val.concat(values[1]);
	return formattedName;
}

function setContactName() {
	$('#contactName').empty();
	var option = $('<option />');
	var firstName = $("#contactFirstName").val();
	if ($("#contactLastName").val() != "") {
		firstName = $("#contactFirstName").val() + " ";
	}
	option.attr('value', "1").text(firstName + $("#contactLastName").val());
	$('#contactName').append(option);
}

function triggerBlur(){
	$('#contactName').trigger('blur');	
}


function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	nameQualifier = validateNull(nameQualifier);
	addressLine1 = validateNull(addressLine1);
	city = validateNull(city);
	state = validateNull(state);
	
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
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

function validateNull(field){
	var validated = validateForUndefined(field);
	if(field != null && field != 'null' && 
			field != undefined && field != 'undefined' &&
			field != ''){
		validated = field;
	}else{
		validated = '';
	}
	return validated;
}


function singleAddressCall(){
	
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('#organizationId').val()),
		
		success : function(responseText) {
			
			if(responseText.length == 1){
				var Address = responseText[0].stAdd;
				var zipCode = responseText[0].zip;
				var City = responseText[0].city;
				var tempCity = " - " + City;
				var State = responseText[0].state;
				var tempState = ", " + State;
				var finalAddress = Address + tempCity + tempState;
				var addroleId = responseText[0].addRole;
				$("#addRolDesc").val(finalAddress);
				$("#zipCustomer").val(zipCode);
				$("#addressRoleId").val(addroleId);
			
				
				//Added address role id as parameter and organization as ALL for defect D028606 
				var inp2 = 'ALL';
				var inp1 = $("#addressRoleId").val();
				var contactNameDataList = "";
				$('#contactName').empty();
				$('#contactName').val('ALL');
				if((inp1!="" && inp1!="ALL")){
					$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + inp2 + "|" + inp1,
						function(contacts){
						$('#contactName').append("<option value=''>Select</option>");
							$(contacts).each(function() {
								var formattedName = getFormattedName(validateForUndefined(this.label), 
																	validateForUndefined(this.dept), validateForUndefined(this.title));
								var option = $('<option />');
								option.attr('value', this.value).text(unescape(formattedName.replace(/ /g, "%A0")));
								$('#contactName').append(option);
								contactNameDataList += this.value + "!?" + this.label + "!?" 
										+ validateForUndefined(this.phcntry) + "!?" 
										+ validateForUndefined(this.pharea) + "!?" 
										+ validateForUndefined(this.phexch) + "!?" 
										+ validateForUndefined(this.phstcde) + "!?" 
										+ validateForUndefined(this.phextn) + "!?" 
										+ validateForUndefined(this.fxcntry) + "!?" 
										+ validateForUndefined(this.fxarea) + "!?" 
										+ validateForUndefined(this.fxexch) + "!?" 
										+ validateForUndefined(this.fxstcde) + "!?" 
										+ validateForUndefined(this.email) + "|"; 
							});
							$("#contactNameDataList").val(contactNameDataList);
							$('#contactName').trigger('blur');				
						});
					
				}
				
				
			} 
			else{
				addRolDescPopupSearch();
			}
		}
	});
}

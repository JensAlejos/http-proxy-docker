
var _isOTCChanged = false;


$(function() {	
	$("#OneTimeCustomerDialog").dialog({
		autoOpen : false,
		width : 980,		
		modal: true,
		scrollable: false,
		closeOnEscape: false,
		position: 'top',	
		open : function() {
			//tabSequence('#OneTimeCustomerDialog',false,false);
			$('#msgDivOTC').hide();
		},
		close : function() {
			// This function is called every time the dialog is closed - Programatically, or Cancel button or esc.
			
			var isOTCEmpty = validateOTCDetails();
			if (isOTCEmpty == false) {
				$('#showOneTimeCustomerCheck').attr("checked", true);
				if (!($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD")) {
					$('#showOneTimeCustomerCheck').removeAttr("disabled");
				}
			} else {
				$('#showOneTimeCustomerCheck').attr("checked", false);
				$('#showOneTimeCustomerCheck').attr("disabled", true);
			}
			tabSequence('#quoteForm',true,false);
			_isOTCChanged = false;
			
		},
		buttons : {
	        Cancel: function(){
	        	if (!validateOTCDetails() && _isOTCChanged == true) {
					var r = confirm("All the unsaved changes will be discarded - Do you want to proceed?");
					if (r == false) {
						return false;
					} else {
						if ($("#organizationId").val() !="") {
							clearOneTimeCustomerForm();
						} else {
							setOTCValues();
						}
					}
				}
				$('#msgDivOTC').hide();
	        	$("#OneTimeCustomerDialog").dialog("close");
	        },
	        OK: function() {	
	        	saveUpdateOTC();
	        }	        
		}
	});

	$("#custContactFirstName").change(function() {		
		/*validateField('alphabetsAndSpecialChars' , $("#custContactFirstName").val().trim(), "First Name");*/
		
		var name = setOneTimeCustContactName();
		$("#custContactName").val(name);
		_isOTCChanged = true;
	});
	
	$("#custContactLastName").change(function() {
		/*validateField('alphabetsAndSpecialChars' , $("#custContactLastName").val().trim(), "Last Name");*/
		var name = setOneTimeCustContactName();
		$("#custContactName").val(name);
		_isOTCChanged = true;
	});
	
	$("#custContactName").change(function() {
		/*validateField('alphabetsAndSpecialChars' , $("#custContactName").val().trim(), "Contact Name");*/
		_isOTCChanged = true;
	});
	$("#custAddressLine1").change(function() {		
		_isOTCChanged = true;
	});
	$("#custAddressLine2").change(function() {
		_isOTCChanged = true;
	});
	$("#custAddressLine3").change(function() {
		_isOTCChanged = true;
	});
/*	$("#custSuite").change(function() {
		$("#custSuite").val($("#custSuite").val().trim());
		validateField('numbersOnly' , $("#custSuite").val().trim(), "Suite");
		_isOTCChanged = true;
	});*/
	$("#custCityName").change(function() {		
		validateField('lettersOnly' , $("#custCityName").val().trim(), "City Name");
		_isOTCChanged = true;
	});
	$("#custStateCode").change(function() {
		$("#custStateCode").val($("#custStateCode").val().trim());
		validateField('lettersOnly' , $("#custStateCode").val().trim(), "State Code");
		_isOTCChanged = true;
	});
	$("#custZipCode").change(function() {
		if($("#custCountry").val()=="US"){
			$("#custZipCode").val($("#custZipCode").val().trim());
			validateField('numbersOnly' , $("#custZipCode").val().trim(), "Zip Code");
		}
		_isOTCChanged = true;
	});
	
	$('#custCountry').gatesPopUpSearch({
		func : function() {
			oneTimeCountryPopupSearch();
		}
	});
	$("#custCountry").change(function() {		
		validateField('lettersOnly' , $("#custCountry").val().trim(), "Country");
		_isOTCChanged = true;
	});
	//code to tab out in phone fields
	function isAmerican(id)
	{
	var val = $('#'+id).val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
	}
	var chkPhoneCountry =true;
	var chkPhoneArea = true;
	var chkPhoneExchange = true;
	$('#custPhoneCountryCode').click(function() {
	     removeErrorPointers();
		});
	$('#custPhoneAreaCode').click(function() {
   	     removeErrorPointers();
   		});
	$('#custPhoneExchange').click(function() {
   	     removeErrorPointers();
   		});	
	$("#custPhoneCountryCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneCountry){
	    	 this.select();
	    	 chkPhoneCountry = false;
	     }
		});
	
	$("#custPhoneCountryCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#custPhoneCountryCode').val()=='1' || 
	    	$('#custPhoneCountryCode').val()=='01' ||  
	    	$('#custPhoneCountryCode').val().length == 2){
		    	$('#custPhoneAreaCode').select();
		    	chkPhoneCountry =true;
	     }
		}); 
$("#custPhoneAreaCode").focus(function(evt) {
		chkPhoneArea = true;
	});
	
	$("#custPhoneAreaCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	 $("#custPhoneAreaCode").val('');
	     }
		});
	
	$("#custPhoneAreaCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkPhoneArea){
	    	 this.select();
	    	 chkPhoneArea = false;
	    	 $("#custPhoneAreaCode").val('');
	     }
	     if(($('#custPhoneAreaCode').val().length == 3 && isAmerican('custPhoneCountryCode')) || 
	    		 $('#custPhoneAreaCode').val().length == 4){
		    	$('#custPhoneExchange').select();
	     }
		}); 
	
	$("#custPhoneExchange").focus(function(evt) {
		chkPhoneExchange = true;
	});
	
	$("#custPhoneExchange").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $("#custPhoneExchange").val('');
	     }
		});
	
	$("#custPhoneExchange").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkPhoneExchange){
	    	 this.select();
	    	 chkPhoneExchange = false;
	    	 $("#custPhoneExchange").val('');
	     }
	     if(($('#custPhoneExchange').val().length == 3 && isAmerican('custPhoneCountryCode')) || 
	    		 $('#custPhoneExchange').val().length == 4){
		    	$('#custPhoneStation').select();
	     }
		}); 

		$("#custPhoneStation").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#custPhoneStation').val().length == 4){
		    	$('#custFaxCountryCode').focus();
	     }
		}); 
	$("#custPhoneCountryCode").change(function() {
		$("#custPhoneCountryCode").val($("#custPhoneCountryCode").val().trim());
		validateField('numbersOnly' , $("#custPhoneCountryCode").val().trim(), "Phone Country Code");
		_isOTCChanged = true;
	});
	$("#custPhoneAreaCode").change(function() {
		$("#custPhoneAreaCode").val($("#custPhoneAreaCode").val().trim());
		validateField('numbersOnly' , $("#custPhoneAreaCode").val().trim(), "Phone Area Code");
		_isOTCChanged = true;
	});
	$("#custPhoneExchange").change(function() {
		$("#custPhoneExchange").val($("#custPhoneExchange").val().trim());
		validateField('numbersOnly' , $("#custPhoneExchange").val().trim(), "Phone Exchange");
		_isOTCChanged = true;
	});
	$("#custPhoneStation").change(function() {
		$("#custPhoneStation").val($("#custPhoneStation").val().trim());
		validateField('numbersOnly' , $("#custPhoneStation").val().trim(), "Phone Station");
		_isOTCChanged = true;
	});
	$("#custPhoneExtension").change(function() {
		$("#custPhoneExtension").val($("#custPhoneExtension").val().trim());
		validateField('numbersOnly' , $("#custPhoneExtension").val().trim(), "Phone Extension");
		_isOTCChanged = true;
	});
	//code to tab out in Fax fields
	var chkFaxCountry =true;
	var chkFaxArea = true;
	var chkFaxExchange = true;
	
	$('#custFaxCountryCode').click(function() {
	     removeErrorPointers();
		});
	$('#custFaxAreaCode').click(function() {
   	     removeErrorPointers();
   		});
	$('#custFaxExchange').click(function() {
   	     removeErrorPointers();
   		});
	$("#custFaxCountryCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxCountry){
	    	 this.select();
	    	 chkFaxCountry = false;
	     }
		});
	
	$("#custFaxCountryCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#custFaxCountryCode').val()=='1' || 
	 	    $('#custFaxCountryCode').val()=='01' ||  
	 	    $('#custFaxCountryCode').val().length == 2){
		    	$('#custFaxAreaCode').select();
		    	chkFaxCountry =true;
	     }
		}); 
	$("#custFaxAreaCode").focus(function(evt) {
		chkFaxArea = true;
	});
	
	$("#custFaxAreaCode").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $("#custFaxAreaCode").val('');
	     }
		});
	
	$("#custFaxAreaCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkFaxArea){
	    	 this.select();
	    	 chkFaxArea = false;
	    	 $("#custFaxAreaCode").val('');
	     }
	     if(($('#custFaxAreaCode').val().length == 3 && isAmerican('custFaxCountryCode')) || 
	    		 $('#custFaxAreaCode').val().length == 4){
		    	$('#custFaxExchange').select();
	     }
		}); 
	
	$("#custFaxExchange").focus(function(evt) {
		chkFaxExchange = true;
	});
	
	$("#custFaxExchange").keydown(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $("#custFaxExchange").val('');
	     }
		});
	
	$("#custFaxExchange").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	  	if(chkFaxExchange){
	    	 this.select();
	    	 chkFaxExchange = false;
	    	 $("#custFaxExchange").val('');
	     }
	     if(($('#custFaxExchange').val().length == 3 && isAmerican('custFaxCountryCode')) || 
	    		 $('#custFaxExchange').val().length == 4){
		    	$('#custFaxStation').select();
	     }
		}); 
	
	
	$("#custFaxStation").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#custFaxStation').val().length == 4){
		    	$('#custEmailAddress').focus();		    	
	     }
		}); 
	$("#custFaxCountryCode").change(function() {
		$("#custFaxCountryCode").val($("#custFaxCountryCode").val().trim());
		validateField('numbersOnly' , $("#custFaxCountryCode").val().trim(), "Fax Country Code");
		_isOTCChanged = true;
	});
	$("#custFaxAreaCode").change(function() {
		$("#custFaxAreaCode").val($("#custFaxAreaCode").val().trim());
		validateField('numbersOnly' , $("#custFaxAreaCode").val().trim(), "Fax Area Code");
		_isOTCChanged = true;
	});
	$("#custFaxExchange").change(function() {
		$("#custFaxExchange").val($("#custFaxExchange").val().trim());
		validateField('numbersOnly' , $("#custFaxExchange").val().trim(), "Fax Exchange");
		_isOTCChanged = true;
	});
	$("#custFaxStation").change(function() {
		$("#custFaxStation").val($("#custFaxStation").val().trim());
		validateField('numbersOnly' , $("#custFaxStation").val().trim(), "Fax Station");
		_isOTCChanged = true;
	});
	$("#custEmailAddress").change(function() {
		$("#custEmailAddress").val($("#custEmailAddress").val().trim());
		validateField('emailOnly' , $("#custEmailAddress").val().trim(), "Email");
		_isOTCChanged = true;
	});
});

function saveUpdateOTC() {
	
	if($('#custContactFirstName').val().trim()==""){
		alert("One Time Customer Cannot be Added without Complete Details");
		return;
	}	
	var isOTCEmpty = validateOTCDetails();
	isOTCEmpty = doMandatoryChecksForOTC();
	if (isOTCEmpty == true) {
		return;
	}
	if (_isOTCChanged == true) {
		
		
		if ($("#organizationId").val() !="") {
			var r= confirm("The existing CP customer will be erased. Do you want to continue?");
			if (r == false) {
				return;
			}
		}		
		clearContactDetails(); // Method is in quote_cusomer.js
		if($('#custContactFirstName').val().trim() !=""){
			$("#organizationId").val("");
			$('#orgName').val("");
			$("#addressRoleId").val("");
			$("#customerName").attr("readOnly", true);
			$("#addRolDesc").attr("readOnly", true);
			addOneTimeCustomerDetails();
			$('#showOneTimeCustomerCheck').attr("checked", true);
			if (!($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD")) {
				$('#showOneTimeCustomerCheck').removeAttr("disabled");
			}
			onlyOneGroup();
			_isOTCChanged = false;
			_isQuoteChanged = true;
		}else{
			$("#customerName").removeAttr("readOnly");
			$("#addRolDesc").removeAttr("readOnly");
			$('#showOneTimeCustomerCheck').removeAttr("checked");
			$('#showOneTimeCustomerCheck').attr("disabled", true);
		}
		$('#msgDivOTC').hide();
		setAccordianTabDetails("customerNameDiv", " - "+$("#customerName").val());
		$("#OneTimeCustomerDialog").dialog("close");		
	}else{
		if(!validateOTCDetails()){
			alert("No fields have changed. Cannot update");	
		}
	}
}
function oneTimeCountryPopupSearch() {		
	var oneTimeCountry = $('#custCountry').val();	
	var	actionUrl = _context + '/cas/countryNameLookup.do?filterValue1='+oneTimeCountry+'|';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function countryCodeUpdate(id){
	var values = id.split("|");
	$('#custCountry').val(values[0]);
}

function showAddOneTimeCustomerDialog() {
	$("#oneTimeCustomerForm").validationEngine('attach');
	$("#OneTimeCustomerDialog").dialog("option", "title", 'Add One Time Customer');	
	$("#OneTimeCustomerDialog").dialog();
	$("#OneTimeCustomerDialog").dialog("close");	
	$( "#OneTimeCustomerDialog" ).dialog('open'); 
	var isOTC = $('#showOneTimeCustomerCheck').is(':checked');
	if (isOTC == false ) {
		clearOneTimeCustomerForm();			
	}
	if($("#showOneTimeCustomerCheck").is(":checked")) {
		setOTCValues();	
	}
	setOneTimeCustomerHeader();
	checkDisabledFields();
}

function setOneTimeCustomerHeader() {
	var quoteNumberVersion = $("#quoteNumber").val();
	if ($('#quoteVersionNumber').val() != "" && $('#quoteVersionNumber').val() != null) {
		quoteNumberVersion = quoteNumberVersion + " - " + $('#quoteVersionNumber').val();
	}
	$("#custQuoteNumberVersion").text(quoteNumberVersion);
	$("#custStatusCode").text($("#statusCode").val());
	$("#custEstimatedShipDate").text($("#estimatedShipDate").val());
	if ($("#metric").is(":checked")) {
		$("#custUnitOfMeasureSourceCode").text("Metric");	
	} else {
		$("#custUnitOfMeasureSourceCode").text("Imperial");
	}
	$("#custLoadServiceCode").text($('#loadServiceCode :selected').val());
	$("#custDischargeServiceCode").text($('#dischargeServiceCode :selected').val());
	
	$("#custRoutingDetails").text(getFormattedRoute());
}

function getFormattedRoute() {
	var placeOfReceipt = $('#blOriginCityCodeHidden').val();
	var portOfLoading = $('#originPortCityCodeHidden').val();
	var portOfDischarge = $('#destinationPortCityCodeHidden').val();
	var placeOfDelivery = $('#blDestinationCityCodeHidden').val();
	var route = "";
	if (placeOfReceipt != "") {
		route = placeOfReceipt;
	}
	if (portOfLoading != "") {
		if (route != "") {
			route = route + " - ";
		}
		route = route + portOfLoading;
	}
	if (portOfDischarge != "") {
		if (route != "") {
			route = route + " - ";
		}
		route = route + portOfDischarge;
	}
	if (placeOfDelivery != "") {
		if (route != "") {
			route = route + " - ";
		}
		route = route + placeOfDelivery;
	}
	return route;
}

function addOneTimeCustomerDetails() {
	var selected1 = $('#custSuite').val();
	$("#quoteSuite").val(selected1);
	$("#quoteSuite").attr("readOnly",true);
	var selected2 = $('#custPhoneExtension').val();
	$("#phoneExtension").val(selected2);
	var selected3 = $('#custCityName').val();
	$("#cityName").val(selected3);
	$("#cityName").attr("readOnly",true);
	var selected4 = $('#custContactLastName').val();
	$("#contactLastName").val(selected4);
	$("#contactLastName").attr("readOnly",true);
	var selected5 = $('#custContactFirstName').val();
	$("#contactFirstName").val(selected5);
	$("#contactFirstName").attr("readOnly",true);
	
	var option = $('<option />');
	option.attr('value', $("#contactFirstName").val() ).text(setOneTimeCustContactName());
	$('#contactName').append(option);
	$("#customerName").attr("readOnly","true");
	
	var selected6 = $('#custEmailAddress').val();
	$("#emailAddress").val(selected6);
	$("#zipCustomer").val($("#custZipCode").val());
	var city = formatCityStateZip(selected3, $("#custStateCode").val(), $("#custZipCode").val());
	$("#cityStateZip").val(city);
	$("#cityStateZip").attr("readOnly",true);
	var stateCode = $("#custStateCode").val();
	$("#stateCode").val(stateCode);
	$("#stateCode").attr("readOnly",true);
	var zipCode = $("#custZipCode").val();
	$("#zipCode").val(zipCode);
	$("#zipCode").attr("readOnly",true);
	var country = $("#custCountry").val();
	$("#country").val(country);
	$("#country").attr("readOnly",true);
	
	var selected7 = $('#custPhoneAreaCode').val();
	$("#phoneAreaCode").val(selected7);
	var selected8 = $('#custPhoneExchange').val();
	$("#phoneExchange").val(selected8);
	var selected9 = $('#custPhoneStation').val();
	$("#phoneStation").val(selected9);
	var selected10 = $('#custPhoneCountryCode').val();
	$("#phoneCountryCode").val(selected10);
	
	var selected11 = $('#custFaxAreaCode').val();
	$("#faxAreaCode").val(selected11);
	var selected12 = $('#custFaxExchange').val();
	$("#faxExchange").val(selected12);
	var selected13 = $('#custFaxStation').val();
	$("#faxStation").val(selected13);
	var selected14 = $('#custFaxCountryCode').val();
	$("#faxCountryCode").val(selected14);

	var selected15 = $('#custAddressLine1').val();
	var selected16 = $('#custAddressLine2').val();
	var selected17 = $('#custAddressLine3').val();

	$("#addressLine1").val(selected15);
	$("#addressLine1").attr("readOnly",true);
	$("#addressLine2").val(selected16);
	$("#addressLine2").attr("readOnly",true);
	$("#addressLine3").val(selected17);
	$("#addressLine3").attr("readOnly",true);

	var addRolDesc = "";
	if(selected15.trim() != ""){
		addRolDesc = selected15;
	}
	if(selected16.trim() != ""){
		if(addRolDesc != ""){
			addRolDesc = addRolDesc + ", " + selected16;
		}else{
			addRolDesc = selected16;
		}
	}
	if(selected17.trim() != ""){
		if(addRolDesc != ""){
			addRolDesc = addRolDesc + ", " + selected17;
		}else{
			addRolDesc = selected17;
		}
	}
	$("#addRolDesc").val(addRolDesc);
	$("#addRolDesc").attr("readOnly",true);
	
	var selected18 = $("#custContactName").val();
	$("#customerName").val(selected18);
	$("#customerName").attr("readOnly",true);
}

function setOTCValues() {
	var selected1 = $('#quoteSuite').val();
	$("#custSuite").val(selected1);
	var selected4 = $('#contactLastName').val();
	$("#custContactLastName").val(selected4);
	var selected5 = $('#contactFirstName').val();
	$("#custContactFirstName").val(selected5);	
	$("#custContactName").val(selected5 +" "+ selected4);
	var selected6 = $('#emailAddress').val();
	$("#custEmailAddress").val(selected6);

	var selected3 = $('#cityName').val();
	$("#custCityName").val(selected3);
	var stateCode = $("#stateCode").val();
	$("#custStateCode").val(stateCode);
	var zipCode = $("#zipCode").val();
	$("#custZipCode").val(zipCode);
	var country = $("#country").val();
	$("#custCountry").val(country);

	var selected2 = $('#phoneExtension').val();
	$("#custPhoneExtension").val(selected2);
	var selected7 = $('#phoneAreaCode').val();
	$("#custPhoneAreaCode").val(selected7);
	var selected8 = $('#phoneExchange').val();
	$("#custPhoneExchange").val(selected8);
	var selected9 = $('#phoneStation').val();
	$("#custPhoneStation").val(selected9);
	var selected10 = $('#phoneCountryCode').val();
	$("#custPhoneCountryCode").val(selected10);
	
	var selected11 = $('#faxAreaCode').val();
	$("#custFaxAreaCode").val(selected11);
	var selected12 = $('#faxExchange').val();
	$("#custFaxExchange").val(selected12);
	var selected13 = $('#faxStation').val();
	$("#custFaxStation").val(selected13);
	var selected14 = $('#faxCountryCode').val();
	$("#custFaxCountryCode").val(selected14);

	var selected15 = $('#addressLine1').val();
	var selected16 = $('#addressLine2').val();
	var selected17 = $('#addressLine3').val();

	$("#custAddressLine1").val(selected15);
	$("#custAddressLine2").val(selected16);
	$("#custAddressLine3").val(selected17);
	
	var selected18 = $('#customerName').val();
	$("#custContactName").val(selected18);
}

function setOneTimeCustContactName() {
	var name = "";
	var custContactFName = $("#custContactFirstName").val();
	var custContactLName = $("#custContactLastName").val();
	if (custContactFName != "") {
		name = custContactFName + " ";
	}
	if (custContactLName != "") {
		name = name + custContactLName;
	}
	return name;
}

function clearOneTimeCustomerForm() {
	$("#custContactFirstName").val("");
	$("#custContactLastName").val("");
	$("#custContactName").val("");
	$("#custAddressLine1").val("");
	$("#custAddressLine2").val("");
	$("#custAddressLine3").val("");
	$("#custSuite").val("");
	$("#custCityName").val("");
	$("#custStateCode").val("");
	$("#custZipCode").val("");
	$("#custCountry").val("");
	$("#custPhoneAreaCode").val("");
	$("#custPhoneExchange").val("");
	$("#custPhoneStation").val("");
	$("#custPhoneCountryCode").val("");
	$("#custPhoneExtension").val("");
	$("#custFaxAreaCode").val("");
	$("#custFaxExchange").val("");
	$("#custFaxStation").val("");
	$("#custFaxCountryCode").val("");
	$("#custEmailAddress").val("");
}

function validateOTCDetails() {
	var isOTCEmpty = true;
	if ($("#custContactFirstName").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custContactLastName").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custContactName").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custAddressLine1").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custAddressLine2").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custAddressLine3").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custSuite").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custCityName").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custStateCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custZipCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custCountry").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custPhoneAreaCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custPhoneExchange").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custPhoneStation").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custPhoneCountryCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custPhoneExtension").val().trim() != "") {
		isOTCEmpty = false;
	}
	/*if ($("#custFaxAreaCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custFaxExchange").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custFaxStation").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custFaxCountryCode").val().trim() != "") {
		isOTCEmpty = false;
	}
	if ($("#custEmailAddress").val().trim() != "") {
		isOTCEmpty = false;
	}*/
	return isOTCEmpty;
}

function validateField(validationRule, value, fieldName,id){	
	var empty_string = "";
	var entityName = "";
	
	if(validationRule == 'lettersOnly'){
		empty_string = /^[a-zA-Z\ \']+$/;
		entityName = "Alphabets";
	}else if(validationRule == 'alphabetsAndSpecialChars'){
		empty_string = /^[a-zA-Z0-9._^ ()%&*`:;><{}[]|\"?$@#!~?,-]+$/;		
		entityName = "Alphabets Or Special Characters";	
	}else if(validationRule == 'numbersOnly'){
		empty_string = /^[0-9\ ]+$/;
		entityName = "Digits";
	}else if(validationRule == 'emailOnly'){
		empty_string = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
		entityName = "Email";
	}
	
	if (value != "" && !empty_string.test(value))
	{
		if(entityName == "Email"){
			$('#msgDivOTC').html("<div class=\"message_error\">Invalid Email Address.</div>");
			$('#msgDivOTC').show();
			isOTCEmpty = true;
			return isOTCEmpty;			
		}else{
			$('#msgDivOTC').html("<div class=\"message_error\">Invalid "+ fieldName +". Only "+ entityName +" are allowed.</div>");
			$('#msgDivOTC').show();
			isOTCEmpty = true;
			return isOTCEmpty;
		}
	  
	  return;
	}/*else if(empty_string.test(value)){
		$('#msgDivOTC').hide();
	}*/
}

function setOTCEntityProperties(){	
	$("#showOneTimeCustomerCheck").attr("checked", true);	
	$("#customerName").attr("readOnly", true);
	$("#addRolDesc").attr("readOnly", true);
	
	if ($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD") {
		$("#contactFirstName").attr("disabled", true);
		$("#contactLastName").attr("disabled", true);
	}else{
		$('#showOneTimeCustomerCheck').removeAttr("disabled");
	}
}

function checkDisabledFields(){
	if ($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD") {
		$("#custContactFirstName").attr("disabled", true);
		$("#custContactLastName").attr("disabled", true);
		$("#custContactName").attr("disabled", true);
		
		$("#custAddressLine1").attr("disabled", true);
		$("#custAddressLine2").attr("disabled", true);
		$("#custAddressLine3").attr("disabled", true);
		
		$("#custCityName").attr("disabled", true);
		$("#custStateCode").attr("disabled", true);
		$("#custZipCode").attr("disabled", true);
		$("#custSuite").attr("disabled", true);
		
		$("#custCountry").attr("disabled", true);
	}
}

function doMandatoryChecksForOTC(){
	if($("#custPhoneCountryCode").val().trim() == "" && $("#custPhoneAreaCode").val().trim() == ""
		&& $("#custPhoneExchange").val().trim() == "" && $("#custPhoneStation").val().trim() == ""){
		/*alert("Please Enter Phone Details");*/
		$('#msgDivOTC').html("<div class=\"message_error\">Please Enter Phone Details.</div>");
		$('#msgDivOTC').show();
		isOTCEmpty = true;
		return isOTCEmpty;			
	}
	
	if($("#custPhoneCountryCode").val().trim() == "" || $("#custPhoneCountryCode").val().trim() == "1"
		|| $("#custPhoneCountryCode").val().trim() == "01"){
		if($("#custPhoneAreaCode").val().trim() == "" || $("#custPhoneAreaCode").val().trim().length != 3){
			if($("#custPhoneAreaCode").val().trim() == ""){
				/*alert("Please Enter Phone Area Code");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please Enter Phone Area Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}else{				
				/*alert("Phone Area Code is always a 3-Digit number");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Phone Area Code is always a 3-Digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}
		}
		if($("#custPhoneExchange").val().trim() == "" || $("#custPhoneExchange").val().trim().length != 3){
			if($("#custPhoneExchange").val().trim() == ""){
				/*alert("Please enter Phone Exchange Code");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please enter Phone Exchange Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}else{
				/*alert("Phone Exchange Code is always a 3-Digit number");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Phone Exchange Code is always a 3-Digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}
			
		}
		if($("#custPhoneStation").val().trim() == "" || $("#custPhoneStation").val().trim().length != 4){
			if($("#custPhoneStation").val().trim() == ""){
				/*alert("Please enter Phone Station Code ");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please enter Phone Station Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;
			}else{
				/*alert("Phone Station Code is always a 3-Digit number");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Phone Station Code is always a 4-Digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}
			
		}
	}else{
		// D027530 - Allowing the Area code field 1 to 4 digit number.
		if($("#custPhoneAreaCode").val().trim() == "" || $("#custPhoneAreaCode").val().trim().length < 1 
				|| $("#custPhoneAreaCode").val().trim().length > 4){
			if($("#custPhoneAreaCode").val().trim() == ""){
				/*alert("Please enter Phone Area Code ");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please enter Phone Area Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;
			}else{
				/*alert("Area Code is a 2 to 4 digit number ");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Area Code is a 1 to 4 digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;				
			}
		}
		if($("#custPhoneExchange").val().trim() == "" || $("#custPhoneExchange").val().trim().length < 3 
				|| $("#custPhoneExchange").val().trim().length > 4 ){
			if($("#custPhoneExchange").val().trim() == ""){
				/*alert("Please enter Phone Exchange Code ");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please enter Phone Exchange Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}else{
				/*alert("Exchange Code is a 3 or 4 digit number.");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Exchange Code is a 3 or 4 digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;				
			}
		}
		if($("#custPhoneStation").val().trim() == "" || $("#custPhoneStation").val().trim().length != 4){
			if($("#custPhoneStation").val().trim() == ""){
				/*alert("Please enter Phone Station Code ");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Please enter Phone Station Code.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;	
			}else{
				/*alert("Station Code is always a 4 digit number.");*/
				$('#msgDivOTC').html("<div class=\"message_error\">Station Code is always a 4 digit number.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;				
			}
		}
	}
	
	/*if($("#custEmailAddress").val().trim() == ""){
		if($("#custFaxCountryCode").val().trim() == "" && $("#custFaxAreaCode").val().trim() == ""
			&& $("#custFaxExchange").val().trim() == "" && $("#custFaxStation").val().trim() == ""){
			if($("#ldspGroupCode").val().trim() == "CY"){
				$('#msgDivOTC').html("<div class=\"message_error\">Please Provide Either Fax Number or Email Details.</div>");
				$('#msgDivOTC').show();
				isOTCEmpty = true;
				return isOTCEmpty;				
			}
			else{
				return false;
			}
		}if($("#custFaxCountryCode").val().trim() == "" || $("#custFaxCountryCode").val().trim() == "1"
			|| $("#custFaxCountryCode").val().trim() == "01"){
			if($("#custFaxAreaCode").val().trim() == "" || $("#custFaxAreaCode").val().trim().length != 3){
				if($("#custFaxAreaCode").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Area Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Area Code is always a 3 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
			if($("#custFaxExchange").val().trim() == "" || $("#custFaxExchange").val().trim().length != 3){
				if($("#custFaxExchange").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Exchange Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;	
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Exchange Code is always a 3 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
			if($("#custFaxStation").val().trim() == "" || $("#custFaxStation").val().trim().length != 4){
				if($("#custFaxStation").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Station Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Station Code is always a 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
		}else{
			if($("#custFaxAreaCode").val().trim() == "" || $("#custFaxAreaCode").val().trim().length < 2 
					|| $("#custFaxAreaCode").val().trim().length > 4){
				if($("#custFaxAreaCode").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Area Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;	
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Area Code is a 2 to 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
			if($("#custFaxExchange").val().trim() == "" || $("#custFaxExchange").val().trim().length < 3 
					|| $("#custFaxExchange").val().trim().length > 4 ){
				if($("#custFaxExchange").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Exchange Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;	
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Exchange Code is a 3 or 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
			if($("#custFaxStation").val().trim() == "" || $("#custFaxStation").val().trim().length != 4){
				if($("#custFaxStation").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Station Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Station Code is always a 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
		}				
	}else if(!$("#custFaxCountryCode").val().trim() == "" && !$("#custFaxAreaCode").val().trim() == ""
		&& !$("#custFaxExchange").val().trim() == "" && !$("#custFaxStation").val().trim() == ""){
		if($("#custFaxCountryCode").val().trim() == "" || $("#custFaxCountryCode").val().trim() == "1"
			|| $("#custFaxCountryCode").val().trim() == "01"){
			if($("#custFaxAreaCode").val().trim() == "" || $("#custFaxAreaCode").val().trim().length != 3){
				if($("#custFaxAreaCode").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Area Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;	
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Area Code is always a 3 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
			if($("#custFaxExchange").val().trim() == "" || $("#custFaxExchange").val().trim().length != 3){
				if($("#custFaxExchange").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Exchange Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Exchange Code is always a 3 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
			if($("#custFaxStation").val().trim() == "" || $("#custFaxStation").val().trim().length != 4){
				if($("#custFaxStation").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Station Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Station Code is always a 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
		}else{
			if($("#custFaxAreaCode").val().trim() == "" || $("#custFaxAreaCode").val().trim().length < 2 
					|| $("#custFaxAreaCode").val().trim().length > 4){
				if($("#custFaxAreaCode").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Area Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Area Code is a 2 to 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
			if($("#custFaxExchange").val().trim() == "" || $("#custFaxExchange").val().trim().length < 3 
					|| $("#custFaxExchange").val().trim().length > 4 ){
				if($("#custFaxExchange").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Exchange Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Exchange Code is a 3 or 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
				
			}
			if($("#custFaxStation").val().trim() == "" || $("#custFaxStation").val().trim().length != 4){
				if($("#custFaxStation").val().trim() == ""){
					$('#msgDivOTC').html("<div class=\"message_error\">Please enter Fax Station Code.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}else{
					$('#msgDivOTC').html("<div class=\"message_error\">Station Code is always a 4 digit number.</div>");
					$('#msgDivOTC').show();
					isOTCEmpty = true;
					return isOTCEmpty;
				}
			}
		}
	}*/
}
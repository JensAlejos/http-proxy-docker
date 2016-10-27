var domesticForeignIndicator = "none";
var tariffReferenceScreen ="";
var dataName =  null;
var grpId = null;
var itemId = null;
$(document).ready(function(){
	
	$('#shipper input').addClass("noTab");
	$('#consignee input').addClass("noTab");
	
	$('#shipper input[type="radio"]').addClass("noTab");
	$('#consignee input[type="radio"]').addClass("noTab");
	
	//D026991, Fix for RateDate should not allow future date.
	//$('#rateDate').datepicker({dateFormat: 'mm-dd-yy' });	
	   $("#rateDate").datepicker({ maxDate: new Date});
	$('#freightReceivedDate').datepicker({dateFormat: 'mm-dd-yy' });	
	
	
	var tariffNumber = $('#tariffNumber').val();
	$('#tariffNumber').gatesAutocomplete({
	 source: _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 mustMatch:true,
		 		 groupType:  '01'
		 },
     formatItem: function(data) {
       dataName=data.name;
      grpId=data.id;
	 return data.name;
	 },
	 formatResult: function(data) {
	  dataName=data.name;
      grpId=data.id;
	 return data.name;
	 }, 
	 select: function(data) {
	 $('#tariffNumber').val(data.id);
	 grpId=data.id;
	// clearDataForTariffNumber(data.name,tariffNumber);
	// tariffNumber =  $('#tariffNumber').val();
	 }
	 });
	
	$('#tariffNumber').change(function(){		
	
	if(grpId==null ||grpId==""){
    	$("#tariffNumber").val(""); 
	}
	else{
		$("#tariffNumber").val(dataName);
		$('#shipmentItemNumber').val("");
			//$('#in_item').removeAttr("disabled");
		grpId="";
	}
 
});
	
	$('#shipmentItemNumber').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do',
		minLength: 1,
		 extraParams: {
 			 method: 'searchItemName',
 		 		 searchType: '43',
 		 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
 		 		 groupType:  '01',
 		 		 sourceTariff:  function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();},
 		 		 groupName:   function(){return ($('#tariffNumber').val()==null || $.trim($('#tariffNumber').val())=='')?"ALL":$('#tariffNumber').val();}
 		 },
	 formatItem: function(data) {

	 		 return data.name;
	 },
	 formatResult: function(data) {
	    dataName=data.name;
     	itemId=data.id ;
	 		 return data.name;
	 },
		 select: function(data) {
			 somethingChanged = true;
			// $('#tariffItemId').val(data.id);
					//resetTariffDetails(data.id,data.name);
			$('#shipmentItemNumber').val(data.name);
			 itemId=data.id ; 	
			//getPrimaryCommodity($('#tariffNumber').val(), data.name);	
			//$("#note").val("");
		 }		 
	});		
	
	 $('#shipmentItemNumber').change(function(){
			
		 if(itemId==null || itemId==""){				
		     	$("#shipmentItemNumber").val("");       	
		 	  }		
				else{
					$("#shipmentItemNumber").val(dataName); 
					itemId="";
				}
	 });
	
	 $('#tariffNumber').gatesPopUpSearch({func:function() {SourceTariffPopupSearch();}});
	 $('#shipmentItemNumber').gatesPopUpSearch({func:function() { ItemPopupSearch();}});
	 
	 
	 
	 $('#vessel').keypress(function(){
		 setTimeout(function(){
			 var len=$('#vessel').val().length;
			 if(len>2)
				 {				 	 
					 $('#voyage').focus();	
					 $('#voyage').select();
				 }	 
		 },100);
		 			
	 });
	 $('#voyage').keypress(function(){
		 setTimeout(function(){
			 var len=$('#voyage').val().length;
			 if(len>2)
				 {
				 	$('#direction').focus();
				 	$('#direction').select();
				 }
		 },100);
	 });
	  $('#direction').keypress(function(){
		  setTimeout(function(){
			 var len=$('#direction').val().length;
			 if(len>0)
				 {
				 	$('#rateDate').focus();
				 }
		  },100);
	 }); 
	
	  	$('#vessel').change(function(){
			$('#vessel').val( $('#vessel').val().toUpperCase());
		});
		$('#voyage').change(function(){
			$('#voyage').val( $('#voyage').val().toUpperCase());
		});
		$('#direction').change(function(){
			$('#direction').val( $('#direction').val().toUpperCase());
		});
	
		
		    autoTabShipperHHGS('contactPhoneCountryCode','contactPhoneAreaCode', 1,'contactPhoneCountryCode');
		    autoTabShipperHHGS('contactPhoneAreaCode','contactPhoneExchange', 3,'contactPhoneCountryCode');
		    autoTabShipperHHGS('contactPhoneExchange','contactPhoneStation', 3,'contactPhoneCountryCode');
		    autoTabShipperHHGS('contactPhoneStation','contactPhoneExtension', 4,'contactPhoneCountryCode');
			
			
		    autoTabShipperHHGS('contactCellCountryCode','contactCellAreaCode', 1,'contactCellCountryCode');
		    autoTabShipperHHGS('contactCellAreaCode','contactCellExchange', 3,'contactCellCountryCode');
		    autoTabShipperHHGS('contactCellExchange','contactCellStation', 3,'contactCellCountryCode');
		    autoTabShipperHHGS('contactCellStation','contactCellExtension', 4,'contactCellCountryCode');
			
		    autoTabShipperHHGS('contactFaxCountryCode','contactFaxAreaCode', 1,'contactFaxCountryCode');
		    autoTabShipperHHGS('contactFaxAreaCode','contactFaxExchange', 3,'contactFaxCountryCode');
			autoTabShipperHHGS('contactFaxExchange','contactFaxStation', 3,'contactFaxCountryCode');
			autoTabShipperHHGS('contactFaxStation','contactFaxExtension', 4,'contactFaxCountryCode');
			
			
			autoTabConsigneeHHGS('contactPhoneCountryCode','contactPhoneAreaCode', 1,'contactPhoneCountryCode');
		    autoTabConsigneeHHGS('contactPhoneAreaCode','contactPhoneExchange', 3,'contactPhoneCountryCode');
		    autoTabConsigneeHHGS('contactPhoneExchange','contactPhoneStation', 3,'contactPhoneCountryCode');
		    autoTabConsigneeHHGS('contactPhoneStation','contactPhoneExtension', 4,'contactPhoneCountryCode');
			
			
		    autoTabConsigneeHHGS('contactCellCountryCode','contactCellAreaCode', 1,'contactCellCountryCode');
		    autoTabConsigneeHHGS('contactCellAreaCode','contactCellExchange', 3,'contactCellCountryCode');
		    autoTabConsigneeHHGS('contactCellExchange','contactCellStation', 3,'contactCellCountryCode');
		    autoTabConsigneeHHGS('contactCellStation','contactCellExtension', 4,'contactCellCountryCode');
			
		    autoTabConsigneeHHGS('contactFaxCountryCode','contactFaxAreaCode', 1,'contactFaxCountryCode');
		    autoTabConsigneeHHGS('contactFaxAreaCode','contactFaxExchange', 3,'contactFaxCountryCode');
		    autoTabConsigneeHHGS('contactFaxExchange','contactFaxStation', 3,'contactFaxCountryCode');
		    autoTabConsigneeHHGS('contactFaxStation','contactFaxExtension', 4,'contactFaxCountryCode');

		
});




function SourceTariffPopupSearch() {  
	tariffReferenceScreen ="shipmentDetailOverlay";
	 var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+01+"&sourceTariff="+$('#tariffNumber').val();
	 tariffNumber =$('#tariffNumber').val();
	 var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	 window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
	 }

function sourceTariffSearchUpdate(id){
	
	 var values = id.split("|");
	 if(tariffReferenceScreen =="shipmentDetailOverlay"){
		 $('#tariffNumber').val(values[0]);
	 }else if(tariffReferenceScreen =="CommodityDetailOverlay"){
		 $('#tariffHHGS').val(values[0]);
	 }
	  
	  // clearDataForTariffNumber(values[0],tariffNumber);
	  // tariffNumber =  $('#tariffNumber').val();
	 }

function ItemPopupSearch() {
	itemReferenceScreen ="shipmentDetailItemValue";
	if ($('#shipmentItemNumber').is('[readonly]') ) {}else{
	var actionUrl = _context+"/cas/itemnamelookup.do?sourceTariff="+$('#tariffNumber').val()+"&grpName="+$('#tariffNumber').val()+"&grpTyp=01"+"&itemName="+$('#shipmentItemNumber').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
} 
}	

/*function itemNameSearchUpdate(id){
	var values = id.split("|");
	if(itemReferenceScreen =="shipmentDetailItemValue"){
  	$('#shipmentItemNumber').val(values[0]);
	}else{
		$('#item').val(values[0]);
	}
  	//somethingChanged = true;
  	//getPrimaryCommodity($('#tariffNumber').val(), $('#shipmentItemNumber').val());		  	
  	//$("#note").val("");
} */

/*function loadAdditionalShipperDetails(responseText){
	$("#shipperId").val(responseText.data.shipper.organizationId);
	$('#shipper\\.addressRoleId').val(responseText.data.shipper.addressRoleId);
	if(null!=responseText.data.shipper.addressRoleId){
		//enableDisableContactId('shipper',false);   TODO
	}
	setShipperCommMethodValue(responseText.data.shipper);
	//first clear the drop down
	$('select[name="shipper\\.contactId"]').children().remove();
	$.each(responseText.data.shipper.contactList, function(key, value) {
		$('select[name="shipper\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	$('select[name="shipper\\.contactId"]').val(responseText.data.shipper.contactId);
	
	if(responseText.data.shipper.isCustomerOneTimeCust==true){
		formatColorForOneTime('shipper');
	}
}
function setShipperCommMethodValue(shipper) {
	if (shipper.communicationMethodCode == 'P') {
		$('#shipperComm1').attr('checked', true);
		$('#shipperComm1').val("P");
	} else if (shipper.communicationMethodCode == 'C') {
		$('#shipperComm2').attr('checked', true);
		$('#shipperComm2').val("C");
	} else if (shipper.communicationMethodCode == 'F') {
		$('#shipperComm3').attr('checked', true);
		$('#shipperComm3').val("F");
	} else if (shipper.communicationMethodCode == 'E') {
		$('#shipperComm4').attr('checked', true);
		$('#shipperComm4').val("E");
	}
}

function loadAdditionalConsigneeDetails(responseText){
	$("#consigneeId").val(responseText.data.consignee.organizationId);
	$('#consignee\\.addressRoleId').val(responseText.data.consignee.addressRoleId);
	
	if(null!=responseText.data.consignee.addressRoleId){
		//enableDisableContactId('consignee',false);  TODO
	}

	setConsigneeCommMethodValue(responseText.data.consignee);
	//first clear the drop down
	$('select[name="consignee\\.contactId"]').children().remove();
	$.each(responseText.data.consignee.contactList, function(key, value) {
		$('select[name="consignee\\.contactId"]').append($("<option/>", {
					value : key,
					text : value
		}));
	});
	
	$('select[name="consignee\\.contactId"]').val(responseText.data.consignee.contactId);
	
	//$('select[name="consignee\\.contactId"]').attr('selectedIndex', 0);
	if(responseText.data.consignee.isCustomerOneTimeCust==true){
		formatColorForOneTime('consignee');
	}
}

function setConsigneeCommMethodValue(consignee) {
	if (consignee.communicationMethodCode == 'P') {
		$('#consigneeComm1').attr('checked', true);
		$('#consigneeComm1').val("P");
	} else if (consignee.communicationMethodCode == 'C') {
		$('#consigneeComm2').attr('checked', true);
		$('#consigneeComm2').val("C");
	} else if (consignee.communicationMethodCode == 'F') {
		$('#consigneeComm3').attr('checked', true);
		$('#consigneeComm3').val("F");
	} else if (consignee.communicationMethodCode == 'E') {
		$('#consigneeComm4').attr('checked', true);
		$('#consigneeComm4').val("E");
	}
}*/

function isTextSelected(input) {
	if(input.value.length==0) {
		return false;
	}
    if (typeof input.selectionStart == "number") {
        return input.selectionStart == 0 && input.selectionEnd == input.value.length;
    } else if (typeof document.selection != "undefined") {
        input.focus();
    }
}
function autoTabShipperHHGS(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
	    //Get a reference to the two elements in the tab sequence.
		var source='shipper';
		var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
	    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
	    
	
	    CurrentElement.keydown(function(e) {
	    	var thisElement=this;
	    	setTimeout(function(){
	        //Retrieve which key was pressed.
	        var KeyID = (window.event) ? event.keyCode : e.keyCode;
	       //console.log(isTextSelected(this));
	 
	        //If the user has filled the textbox to the given length and the user just pressed 
	        // a number or letter, then move the cursor to the next element in the tab sequence. 
	        var phoneCountryCode="contactPhoneCountryCode";
	        var cellCountryCode="contactCellCountryCode";
	        var faxCountryCode="contactFaxCountryCode";
	        
	        if ((CurrentElementID == phoneCountryCode) || (CurrentElementID == cellCountryCode)	|| (CurrentElementID == faxCountryCode)) 
	        {
	        	if ((CurrentElement.val()=='1' || 
	        	        CurrentElement.val()=='01' ||  CurrentElement.val()=='001' || 
	        	        CurrentElement.val().length == 3)
					&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105)) && !isTextSelected(thisElement))
	        		{
	        			NextElement.select();
	        		}
	        	
	        
			}
	        else {
	        	
	        	 
	        	
				if (((CurrentElement.val().length == FieldLength && isAmericanShipHHGS(CountryCodeID)) || 
						(CurrentElement.val().length == 4))
								&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(thisElement))
					{	
					var value=$('#contactPhoneCountryCode').val();
							NextElement.select();
					}
						
				 }
	        
	      
			/* * if (CurrentElement.val().length >= FieldLength && ((KeyID >= 48 &&
			 * KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))) NextElement.focus();*/
	    	},5);
	    });
	}


function autoTabConsigneeHHGS(CurrentElementID, NextElementID, FieldLength,CountryCodeID) {
	    //Get a reference to the two elements in the tab sequence.
		var source='consignee';
		var CurrentElement = $('input[name="'+source+'\\.'+CurrentElementID+'"]');
	    var NextElement = $('input[name="'+source+'\\.'+NextElementID+'"]');
	   
	    
	    CurrentElement.keydown(function(e) {
	    	var thisElement=this;
 	    	setTimeout(function(){
	        //Retrieve which key was pressed.
	        var KeyID = (window.event) ? event.keyCode : e.keyCode;
	 
	        //If the user has filled the textbox to the given length and the user just pressed 
	        // a number or letter, then move the cursor to the next element in the tab sequence. 
	        var phoneCountryCode="contactPhoneCountryCode";
	        var cellCountryCode="contactCellCountryCode";
	        var faxCountryCode="contactFaxCountryCode";
	        
	        if ((CurrentElementID == phoneCountryCode) || (CurrentElementID == cellCountryCode)	|| (CurrentElementID == faxCountryCode)) 
	        {
	        	if ((CurrentElement.val()=='1' || 
	        	        CurrentElement.val()=='01' ||  CurrentElement.val()=='001' || 
	        	        CurrentElement.val().length == 3)
					&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(thisElement))
	        		{
	        		
	        			NextElement.select();
	        		}
	        	
	        
			}
	        else {
	        	
				if (((CurrentElement.val().length == FieldLength && isAmericanConsHHGS(CountryCodeID)) || 
						(CurrentElement.val().length == 4))
								&& ((KeyID >= 48 && KeyID <= 90) || (KeyID >= 96 && KeyID <= 105))  && !isTextSelected(thisElement))
					{	
			
							NextElement.select();
					}
						
				 }
	    },5);
	    });
	}

function isAmericanShipHHGS(id)
{
	var source= 'shipper';
	var val = $('input[name="'+source+'\\.'+id+'"]').val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

function isAmericanConsHHGS(id)
{
	var source= 'consignee';
	var val = $('input[name="'+source+'\\.'+id+'"]').val();
	if(val=='' || val=='1' || val=='01' || val=='001')
		return true;
	else
		return false;
}

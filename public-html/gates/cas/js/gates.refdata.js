$(document).ready(function() {
	
    var addressType = "com.matson.gates.cp.refdata.domain.AddressType";
    var addressCrossReferenceType = "com.matson.gates.cp.refdata.domain.AddressCrossReferenceType";
    var addressContactType = "com.matson.gates.cp.refdata.domain.AddressContactType";
    var organizationType = "com.matson.gates.cp.refdata.domain.OrganizationType";
    var marketSegment = "com.matson.gates.cp.refdata.domain.MarketSegment";
    var trade = "com.matson.gates.refdata.domain.Trade";
    var tariffMessage = "com.matson.gates.tm.refdata.domain.TariffMessage";
    var tariffCommodityCode = "com.matson.gates.tm.refdata.domain.TariffCommodityCode";
    var tariffCity = "com.matson.gates.tm.refdata.domain.TariffCity";
    var tariffEquipment = "com.matson.gates.tm.refdata.domain.TariffEquipment";
    var depotLocation = "com.matson.gates.tm.refdata.domain.DepotLocation";
   
    //$($($($($($('.displaytagtable').children()[0]).children()[0])).children()[0]).children()).html()
    var index = 0;
    var foundIndex = 0;
    $($($($('.displaytagtable').children()[0]).children()[0])).children().each(function()
    		{
    			index = index+1;
    			if($($($(this)[0]).children()).html()=="IsActive")
				{
					foundIndex = index;
				}
    		});
    
    var child ='td:nth-child('+foundIndex+')';
    $($($('.displaytagtable').children()[1]).children().children(child)).each(function()
			{
				if($(this).html()=="true")
					{
						$(this).text('Y');
					}
				else
					{
						$(this).text('N');
					}
			});
    
 // code for TypeTranslate Start
    
    // D020433
	if ( $('input[name="object"]').val() == addressType || $('input[name="object"]').val() == addressCrossReferenceType || $('input[name="object"]').val() == addressContactType || $('input[name="object"]').val() == organizationType 
			|| $('input[name="object"]').val() == depotLocation ) {  
		
		
		
		$('input[name="subject"]')
	     .attr('id', 'subject')
	     .attr("readonly","readonly");
		
		$('input[name="longDescription"]')
		.attr('id', 'longDescription')
	    .attr("maxlength",40);
	   
	   $('input[name="shortDescription"]')
		.attr('id', 'shortDescription')
		.attr("maxlength",15);
		
		if ($('input[name="action"]').val() == "insert") {  
			
			   $('input[name="code"]')
			     .attr('id', 'code')
			     .attr("maxlength",2);
			   
			   
			 // to hide id field
				$('td.dataField').each(function(index) {
					var idField = $(this).html();
					if (idField == "id") {
						$(this).parent('tr').hide();
					}
				});
			   
			}
		
		if ($('input[name="action"]').val() == "edit") {  
			
			$('input[name="code"]')
		     .attr("readonly","readonly");
			
			//$('input[name="shortDescription"]')
		     //.attr("readonly","readonly");
		}
		
		  $('input[type="submit"]').click(function (){  
			   
			   if ($('input[name="isActive"]').val().trim() == ""){
				   alert("Active can not be blank");
				   return false;
			   }
			   else if ($('input[name="code"]').val().trim() == ""){
				   alert("Type Code can not be blank");
				   return false;
			   }
			   else if (!($('input[name="isActive"]').val() == "y" || $('input[name="isActive"]').val() == "Y"||$('input[name="isActive"]').val() == "n" || $('input[name="isActive"]').val() == "N" )){
				   alert("Permitted values for Active field are Y , N ");
				   return false;
			   }
			   else if ($('input[name="shortDescription"]').val().trim() == ""){
				   alert("Short Description can not be blank");
				   return false;
			   }
			  /* else if ($('input[name="longDescription"]').val().trim() == ""){
				   alert("LongDescription can not be blank");
				   return false;
			   }*/
			   
			   else if ($('input[name="subject"]').val().trim() == ""){
				   alert("Subject can not be blank");
				   return false;
			   }
			   else{
				   $('input[name="isActive"]').val($('input[name="isActive"]').val().trim());
				   $('input[name="code"]').val($('input[name="code"]').val().trim());
				   $('input[name="shortDescription"]').val($('input[name="shortDescription"]').val().trim());
				   $('input[name="longDescription"]').val($('input[name="longDescription"]').val().trim());
				   $('input[name="subject"]').val($('input[name="subject"]').val().trim());
				   return true;
			   }
		   });
	}
	
	// code for Market Segment Start
	else if ($('input[name="object"]').val() == marketSegment) {
		
		$('input[name="name"]')
		.attr('id', 'name')
		.attr("maxlength",25);
			
			   $('input[name="code"]')
			     .attr('id', 'code')
			     .attr("maxlength",2);
		
		$('input[type="submit"]').click(function (){  
			   
			   if ($('input[name="code"]').val().trim() == ""){
				   alert("Market Segment Code can not be blank");
				   return false;
			   }
			   else if ($('input[name="isActive"]').val().trim() == ""){
				   alert("Active can not be blank");
				   return false;
			   }
			   else if (!($('input[name="isActive"]').val() == "y" || $('input[name="isActive"]').val() == "Y"||$('input[name="isActive"]').val() == "n" || $('input[name="isActive"]').val() == "N" )){
				   alert("Permitted values for Active field are Y , N ");
				   return false;
			   }
			   else if ($('input[name="name"]').val().trim() == ""){
				   alert("Market Segment Name can not be blank");
				   return false;
			   }
			   else{
				   $('input[name="code"]').val($('input[name="code"]').val().trim());
				   $('input[name="isActive"]').val($('input[name="isActive"]').val().trim());
				   $('input[name="name"]').val($('input[name="name"]').val().trim());
				   return true;
			   }
		   });
	}
	
	
//code for Trade Start
	
	else if ($('input[name="object"]').val() == trade) {
 
		$('input[name="tradeCode"]')
		     .attr('id', 'tradeCode')
		     .attr("maxlength",1);
		
		$('input[name="triangleLogicTypeCode"]')
	     .attr('id', 'triangleLogicTypeCode')
	     .attr("maxlength",1);
		   
		   $('input[name="longDescription"]')
			.attr('id', 'longDescription')
		    .attr("maxlength",40);
		   
		   $('input[name="shortDescription"]')
			.attr('id', 'shortDescription')
			.attr("maxlength",15);
		
		$('input[type="submit"]').click(function (){  
		 
			if ($('input[name="tradeCode"]').val().trim() == ""){
				   alert("Trade Code can not be blank");
				   return false;
			   }
			else if ($('input[name="expirationDate"]').val() == ""){
				   alert("Expiration Date can not be blank");
				   return false;
			   }
			else if ($('input[name="isActive"]').val().trim() == ""){
				   alert("Active can not be blank");
				   return false;
			   }
			   else if (!($('input[name="isActive"]').val() == "y" || $('input[name="isActive"]').val() == "Y"||$('input[name="isActive"]').val() == "n" || $('input[name="isActive"]').val() == "N" )){
				   alert("Permitted values for Active field are Y , N ");
				   return false;
			   }
			   else if ($('input[name="triangleLogicTypeCode"]').val().trim() == ""){
				   alert("Triangle Logic Type Code can not be blank");
				   return false;
			   }
			   else if ($('input[name="shortDescription"]').val().trim() == ""){
				   alert("Short Description can not be blank");
				   return false;
			   }
			   else if ($('input[name="longDescription"]').val().trim() == ""){
				   alert("Long Description can not be blank");
				   return false;
			   }
			   else if ($('input[name="effectiveDate"]').val() == ""){
				   alert("Effective Date can not be blank");
				   return false;
			   }
			   else if ($('input[name="expirationDate"]').val() < $('input[name="effectiveDate"]').val()){
				   alert("Expiration date must be the same or later than the Effective Date");
				   return false;
			   }
			   else{
				   $('input[name="tradeCode"]').val($('input[name="tradeCode"]').val().trim());
				   $('input[name="isActive"]').val($('input[name="isActive"]').val().trim());
				   $('input[name="triangleLogicTypeCode"]').val($('input[name="triangleLogicTypeCode"]').val().trim());
				   $('input[name="shortDescription"]').val($('input[name="shortDescription"]').val().trim());
				   $('input[name="longDescription"]').val($('input[name="longDescription"]').val().trim());
				   return true;
			   }
		   });
	//}
	
}
	
	
//R1-TM-Tariff Ref data, Start, 09/05/2011
//TM01.TariffMessage	
	
else if ($('input[name="object"]').val() == tariffMessage) {
		
	$('input[name="errorMessageCode"]')
	.attr('id', 'errorMessageCode')
	.attr("maxlength",8);
   
    $('input[name="systemId"]')
	.attr('id', 'systemId')
	.attr("maxlength",8);
   
    $('input[name="severityLevel"]')
	.attr('id', 'severityLevel')
	.attr("maxlength",1);    
    
 // to hide id field
	$('td.dataField').each(function(index) {
		var idField = $(this).html();
		if (idField == "id") {
			$(this).parent('tr').hide();
		}
	});
		$('input[type="submit"]').click(function (){  
			   
			   if ($('input[name="messageText"]').val().trim() == ""){
				   alert("Message Text can not be blank");
				   return false;
			   }			  
			   else if ($('input[name="systemId"]').val().trim() == ""){
				   alert("System ID can not be blank");
				   return false;
			   }
			   else if ($('input[name="severityLevel"]').val().trim() == ""){
				   alert("Severity Level can not be blank");
				   return false;
			   }
		   });
	}
	
//TM02.TariffCommodityCode	
	
else if ($('input[name="object"]').val() == tariffCommodityCode) {
	
	$('input[name="commodityCode"]')
	.attr('id', 'commodityCode')
	.attr("maxlength",3);
	
    $('input[name="shortDesc"]')
	.attr('id', 'shortDesc')
	.attr("maxlength",13);
    
	$('input[name="densityFactor"]')
	.attr('id', 'densityFactor')
	.attr("maxlength",10,4);
   
    $('input[name="armyCorpEngCode"]')
	.attr('id', 'armyCorpEngCode')
	.attr("maxlength",5);
   
    $('input[name="isReqAggYardInspection"]')
	.attr('id', 'isReqAggYardInspection')
	.attr("maxlength",1);	
    
    $('input[name="hawaiiAggReportCode"]')
	.attr('id', 'hawaiiAggReportCode')
	.attr("maxlength",1);
    
    $('input[name="hawaiiEqualReportCode"]')
	.attr('id', 'hawaiiEqualReportCode')
	.attr("maxlength",1);
    
    $('input[name="isUscsHazardous"]')
	.attr('id', 'isUscsHazardous')
	.attr("maxlength",1);
    
    $('input[name="longDescription"]')
	.attr('id', 'longDescription')
	.attr("maxlength",10);
    
    $('input[name="isRequireAgcCneeInspection"]')
	.attr('id', 'isRequireAgcCneeInspection')
	.attr("maxlength",1);
    
    	$('input[type="submit"]').click(function (){  
			   
    		  if ($('input[name="commodityCode"]').val().trim() == ""){
    			  $('input[name="commodityCode"]').validationEngine('showPrompt', 'Commodity Code can not be blank', 'error', true);
				   return false;
			   }
    		  else if ($('input[name="expirationDate"]').val() == ""){
    			  $('input[name="expirationDate"]').validationEngine('showPrompt', 'ExpirationDate can not be blank', 'error', true);
				   return false;
			   }
			  else if ($('input[name="isReqAggYardInspection"]').val().trim() == ""){
				  $('input[name="isReqAggYardInspection"]').validationEngine('showPrompt', 'Is Reuired Agg Inspection can not be blank', 'error', true);
				   return false;
			   }	
			   else if ($('input[name="effectiveDate"]').val() == ""){
				   $('input[name="effectiveDate"]').validationEngine('showPrompt', 'EffectiveDate can not be blank', 'error', true);
				   return false;
			   }
			   else if ($('input[name="isRequireAgcCneeInspection"]').val().trim() == ""){
				   $('input[name="isRequireAgcCneeInspection"]').validationEngine('showPrompt', 'Is Require Agc Cnee Inspection can not be blank', 'error', true);
				   return false;
			   }	   
			   else if ($('input[name="expirationDate"]').val() < $('input[name="effectiveDate"]').val()){
				   $('input[name="isRequireAgcCneeInspection"]').validationEngine('showPrompt', 'Expiration date must be the same or later than the Effective Date', 'error', true);
				   return false;
			   }			   
		   });
	}	

//TM03.TariffCity	
	
else if ($('input[name="object"]').val() == tariffCity) {
		
	  $('input[name="cityCode"]')
	  .attr('id', 'cityCode')
	  .attr("maxlength",4);
	   
      $('input[name="condCityRoleCode"]')
	  .attr('id', 'condCityRoleCode')
	  .attr("maxlength",2);

   // to hide id field
	 $('td.dataField').each(function(index) {
		var idField = $(this).html();
		if (idField == "id") {
			$(this).parent('tr').hide();
		}
	 });
				
		$('input[type="submit"]').click(function (){  
			   
			   if($('input[name="conditionId"]').val().trim() == ""){
				   alert("Condition ID can not be blank");
				   return false;
			   }			  
			   else if ($('input[name="cityCode"]').val().trim() == ""){
				   alert("City Code can not be blank");
				   return false;
			   }			   
			   else if ($('input[name="condCityRoleCode"]').val().trim() == ""){
				   alert("Condition City Role Code can not be blank");
				   return false;
			   }			   

		   });
	}
	
//TM04.TariffEquipment	
	
else if ($('input[name="object"]').val() == tariffEquipment) {
		
	$('input[name="conditionId"]')
	.attr('id', 'conditionId')
	.attr("defaultValue",'');
	
	$('input[name="equipHeight"]')
	.attr('id', 'equipHeight')
	.attr("maxlength",1);
	
	$('input[name="equipFunctionCode"]')
	.attr('id', 'equipFunctionCode')
	.attr("maxlength",1);
	
	$('input[name="equipLength"]')
	.attr('id', 'equipLength')
	.attr("maxlength",2);

	// to hide id field
	$('td.dataField').each(function(index) {
		var idField = $(this).html();
		if (idField == "id") {
			$(this).parent('tr').hide();
		}
	});

		$('input[type="submit"]').click(function (){  
			   
			   if ($('input[name="conditionId"]').val().trim() == ""){
				   alert("Condition ID can not be blank");
				   return false;
			   }
			   else if ($('input[name="equipHeight"]').val().trim() == ""){
				   alert("Equipment Height can not be blank");
				   return false;
			   }
			   else if ($('input[name="condCityRoleCode"]').val().trim() == " "){
				   alert("Condition City Role Code can not be blank");
				   return false;
			   }			   
			   else if ($('input[name="equipFunctionCode"]').val().trim() == ""){
				   alert("Equipment Function Code can not be blank");
				   return false;
			   }
			   else if ($('input[name="equipLength"]').val().trim() == ""){
				   alert("Equipment Length can not be blank");
				   return false;
			   }
		   });
	}
//R1-TM-Tariff Ref data, End, 09/05/2011
	
	

$("form[name='lookupForm']")
.attr('id', 'lookupForm')
.validationEngine('attach');

	//- RefData Edit Form: Hide fields corresponding to codeDescription, activeBoolean, true, false
	$('td.dataField').each(function(index) {
		var field = $(this).html();
		if (field == "codeDescription" || field == "activeBoolean" || field == "true" || field == "false") {
			$(this).parent('tr').hide();
		}
	});
	$('input[name="commodityCode"]').click(function() {
	     removeErrorPointers();
	});
	$('input[name="expirationDate"]').click(function() {
	     removeErrorPointers();
	});
	$('input[name="isReqAggYardInspection"]').click(function() {
	     removeErrorPointers();
	});
	$('input[name="effectiveDate"]').click(function() {
	     removeErrorPointers();
	});
	$('input[name="isRequireAgcCneeInspection"]').click(function() {
	     removeErrorPointers();
	});

	
	
});  // ready method end
function removeErrorPointers(){
	   $('form[name="lookupForm"]').validationEngine('hideAll');
}



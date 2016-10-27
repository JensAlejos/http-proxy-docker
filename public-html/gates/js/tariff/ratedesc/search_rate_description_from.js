$(document).ready(

function() {
	// added function for conditon rate search //
	setDefaultForConditionSearch();
// Check combination value on page load for grp name /src tariff and Item Name
var grpCode = document.getElementById('GROUP_NAME').value;
var sourceCode = document.getElementById('SOURCE_TARIFF').value;
var itemCode=document.getElementById('ITEM_NAME').value;
var validComb=false;

if(grpCode!=null && grpCode!="" && grpCode!="ALL"
	&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
		&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
	    
	validComb=true;
}


if(! validComb){
$("input[type=button][value=Search]").attr("disabled","disabled");
$('#rate_add').attr("disabled","disabled");
}

// Disable the buttons by default
$('#rate_delete').attr("disabled","disabled");
$('#rate_xcopy').attr("disabled","disabled");
$('#rate_rtr').attr("disabled","disabled");
$('#rate_replicate').attr("disabled","disabled");


// Hiding the extra columns in CAS search results 
	
$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(13)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(13)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(14)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(14)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(15)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(15)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(16)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(16)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(17)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(17)').hide();

// Disable /Enable Search Button as per change in User Input


$('#GROUP_NAME').keyup(function() {
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
});

$('#SOURCE_TARIFF').keyup(function() {
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
});

$('#ITEM_NAME').keyup(function() {
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
});

$("input[type=checkbox][name=searchInput]").click(function() {
	 
	var elements = $("input[type=checkbox][name=searchInput]");
	var anyOneChecked=false;
	jQuery.each(elements, function(element) {
    	var checked = $(this).attr('checked');
		if(checked){
			anyOneChecked=true;	
		}
	});
	
	 if(anyOneChecked){
		 $('#rate_delete').removeAttr("disabled");
		 $('#rate_xcopy').removeAttr("disabled");
		 $('#rate_rtr').removeAttr("disabled");
		 $('#rate_replicate').removeAttr("disabled");
	 }else{
		 $('#rate_delete').attr("disabled","disabled");
		 $('#rate_xcopy').attr("disabled","disabled");
		 $('#rate_rtr').attr("disabled","disabled");
		 $('#rate_replicate').attr("disabled","disabled");
	 }
     
});





// Rate to Rate Click function
	
$('#rate_rtr').click(function(){
	 
		var searchLength = document.rateDesriptionForm.searchInput.length;
		
		if (typeof (searchLength) == "undefined") {
			searchLength = 1;
		}
		
		var selCount = 0;
		var selIdsList="";
		
		for ( var i = 0; i < searchLength; i++) {
			var checked = false;
			var selId="";
			if (searchLength != 1) {
				checked = document.rateDesriptionForm.searchInput[i].checked;
				if(checked){					
					selId = document.rateDesriptionForm.searchInput[i].value;
				}
			} else {
	
				checked = document.rateDesriptionForm.searchInput.checked;
				if(checked){
					selId = document.rateDesriptionForm.searchInput.value;
				}
			}
			
			if (checked) {
				selCount = selCount + 1;
				if(selIdsList==""){
					selIdsList=selId;
				}else{
					selIdsList=selIdsList+","+selId;
				}
			}
		}
	
		
		if(selCount==0){
			 alert('Please select atleast one Rate Description to define RTR Link!'); 
			 return;
		}
		
		if(selCount >1){
			 alert('Please select only one Rate Description to define RTR Link!'); 
			 return;
		}
	     
		
		//If  only one id selected get Row object from that ID and set the data elements.
		var rateDescId=selIdsList;
		var rowObject= $('input[name="searchInput"][value="'+selIdsList+'"]').parent().parent();
		
		var grpType=rowObject.children('td:nth-child(13)').html();
		var srcTariff=rowObject.children('td:nth-child(14)').html();
		var grpName=rowObject.children('td:nth-child(15)').html();
		var itemName=rowObject.children('td:nth-child(16)').html();
		var description=rowObject.children('td:nth-child(12)').html();
		var rateBasis=rowObject.children('td:nth-child(8)').html();
		var amount=""; //to be implemented
		var effDateRD=rowObject.children('td:nth-child(3)').html();
		var expDateRD=rowObject.children('td:nth-child(4)').html();
		var equipment=rowObject.children('td:nth-child(5)').html();
		var city=rowObject.children('td:nth-child(7)').html();	
		var rtrFlag=rowObject.children('td:nth-child(17)').html();	
		
		//Create DATA string for HTTP GET
	    data="rateDescId="+rateDescId+"&grpType="+grpType+"&srcTariff="+srcTariff+"&grpName="+grpName+"&itemName="+itemName+"&description="+description
	    +"&rateBasis="+rateBasis+"&amount="+amount+"&effDateRD="+effDateRD+"&expDateRD="+expDateRD+"&equipment="+equipment+
	    "&city="+city+"&rtrFlag="+rtrFlag;
	
	    //GET Request to RTR link search CAS page
	    document.location.href = _context +'/cas/rateToRateSearch.do?'+ data ;
	    
		
	 
	 
});
	

$('#SOURCE_TARIFF').gatesAutocomplete({
	 	source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 groupType:  function() { return $('#GROUP_TYPE').val(); }
	 	 },
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
	 		 $('#SOURCE_TARIFF').val(data.id);		 		 		 
	 }		 
});		 


$('#GROUP_NAME').gatesAutocomplete({
 	source:  _context+'/cas/autocomplete.do',
	 extraParams: {
	 		 		 method: 'searchGroupName',
	 		 		 searchType: '10',
	 		 		 groupType:  function () { return $('#GROUP_TYPE').val(); },
	 		 		 sourceTariff:  function () { return $('#SOURCE_TARIFF').val(); }				 		 		 		 
	 		 		 },
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
	 		 $('#GROUP_NAME').val(data.id);		 		 		 
	 }		 
});		


$('#ITEM_NAME').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	 extraParams: {
	 		 		 method: 'searchItemName',
	 		 		 searchType: '43',
	 		 		 groupType:  function () { return $('#GROUP_TYPE').val(); },
	 		 		 sourceTariff:  function () { return $('#SOURCE_TARIFF').val(); },				 		 		 		 
	 		 		 groupName:  function () { return $('#GROUP_NAME').val(); }
	 				},
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
	 		 $('#ITEM_NAME').val(data.id);	
	 }		 
});		 


// City Auto complete
$('#CITY_CODE').gatesAutocomplete({
	source: _context+'/tm/Autocomplete/autoCompCity',
	
	formatItem: function(item) {
		return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	formatResult: function(item) {
		return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	select: function(item) {
		$('#CITY_CODE').val(item.id);
	}	
});	

replaceWithCheckBox($("#RD_ID"),'Y');

$('form[name="rateDesriptionForm"]').formatCasSearchForm({ 
hasSavedSearchFeature: false, 
customActions: [ ]
});


});

//Add New rate Description
function addRateDesc() {
	var grpType = document.getElementById('GROUP_TYPE').value;
    var grpCode = document.getElementById('GROUP_NAME').value;
    var sourceCode = document.getElementById('SOURCE_TARIFF').value;
    var itemCode=document.getElementById('ITEM_NAME').value;
    
    

	// BR1. Selection of the ‘Tariff Group Type’, ‘Source Tariff’, ‘Group
	// Name’ & ‘Item Number’ are mandatory on the ‘Search Rate Description’
	// screen to create a Rate Description record.
    
    if(grpType==null || grpType=="" 
    	||grpCode==null || grpCode==""||grpCode=="ALL"
    	  || sourceCode==null || sourceCode==""||sourceCode=="ALL"
    		  || itemCode==null || itemCode=="" || itemCode=="ALL"){
    	    
    	   alert('Please Select valid Group and Item combination to add Rate Description!'); 
		   return;
    }
   

	// BR2. Group type, Source Tariff, Tariff Name and Item number should
	// represent the valid combination.
    
    $.ajax({
		   type: "GET",
		   url: _context +"/tm/traiffRate/validateGrpItmCombination?",
		   data: "grpType="+ grpType+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&itemCode="+itemCode,
		   success: function(msg){
			    if(msg=="NotValid"){
				   alert('Not a valid combination to add Rate Description.'); 
				   return;
				}else if (msg=="Error"){
					alert('Error in validating the Group and Item combination; please try again.'); 
					   return;
				}else{
					var grpPk = "";
					var itemPk = "";
					var temp = new Array();
					temp = msg.split(',');
					grpPk = temp[0];
					itemPk = temp[1];
					//alert('grpPk-'+grpPk+'itemPk-'+itemPk);
					
					var rateDescId = "DUMMY-TGSI"+","+msg+","+grpType+","+grpCode+","+sourceCode+","+itemCode;
					document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='
							+ rateDescId ;
				}
			 }
		 });
  
}

function submitFinalRequestForDelete(searchInp){
	$.ajax({
		   type: "POST",
		   url: _context +"/tm/traiffRate/deleteRateDescriptions?",
		   data: "rateIdstoDelete="+ searchInp,
		   success: function(msg){
				if(msg=="Success"){
				   alert('Selected Rate Descriptions Deleted SuccessFully.');
				   postMethod('search',document.forms["rateDesriptionForm"].method);
				}else{								
					alert('Error in Rate Descriptions Deletion.'); 
												
				}
			 }
		 });
	
}

//Delete Rate Descriptions
function deleteRateDesc() {

	var searchLength = document.rateDesriptionForm.searchInput.length;
	
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	
	var selCount = 0;
	var searchInp = "";
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;		
		var idTodel="";
		if (searchLength != 1) {
			checked = document.rateDesriptionForm.searchInput[i].checked;
			idTodel = document.rateDesriptionForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionForm.searchInput.checked;
			idTodel = document.rateDesriptionForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			searchInp=searchInp+","+idTodel;
		}
	}
	if (selCount == 0) {
		alert("Please select at least one Rate Description for deletion !!");
		return;
	} else {
			var r = confirm("Do you really want to delete the selected Rate Description(s)?");
			if (r == true) {
				//POST request to Struts Action
				
				//document.forms["rateDesriptionForm"].method.value = "deleteRateDescriptions";
				//document.forms["rateDesriptionForm"].rateDescTodelete.value = searchInp;
				//document.forms["rateDesriptionForm"].submit();
				
				//POST request to Spring Action
				
				 $.ajax({
					   type: "POST",
					   url: _context +"/tm/traiffRate/validateRateDescriptionsDeletion?",
					   data: "rateIdstoDelete="+ searchInp,
					   success: function(msg){
						   	     if(msg=="Error"){
										alert('Error in Rate Descriptions Business Validation please try again.'); 
										return;
								 }else{
										 if (msg =="Success"){
											 submitFinalRequestForDelete(searchInp);
										 }else{
										 	var r = confirm("Selected rate description-"+msg+" is the source of a new derived rate.Do you want to continue?");
											if (r == true) {
												submitFinalRequestForDelete(searchInp);
												
											}else{
												return;
											}
										 }
									  }
								 }
						
					 });
				 
				} else{
					return;
				}
			return;
		}
	
	
}

function loadRateDescDetails(rateDescId) {
	

		var ratedescId = rateDescId;	
		var rowObject= $('input[name="searchInput"][value="'+ratedescId+'"]').parent().parent();
		var grpType=rowObject.children('td:nth-child(13)').html();
		var srcTariff=rowObject.children('td:nth-child(14)').html();
		var grpName=rowObject.children('td:nth-child(15)').html();
		var itemName=rowObject.children('td:nth-child(16)').html();
		var description=rowObject.children('td:nth-child(12)').html();
		var rateBasis=rowObject.children('td:nth-child(8)').html();
		var amount=""; //to be implemented
		var effDateRD=rowObject.children('td:nth-child(3)').html();
		var expDateRD=rowObject.children('td:nth-child(4)').html();
		var equipment=rowObject.children('td:nth-child(5)').html();
		var city=rowObject.children('td:nth-child(7)').html();	
		var rtrFlag=rowObject.children('td:nth-child(17)').html();
		var listForCondition=new Array();
		listForCondition[0]=description;
		listForCondition[1]=equipment;
		listForCondition[2]=city;
		listForCondition[3]=ratedescId;
		listForCondition[4]=grpType;
		listForCondition[5]=srcTariff;
		listForCondition[6]=grpName;
		listForCondition[7]=itemName;
		listForCondition[8]=rtrFlag;
		self.opener.loadRateDescUpdate(listForCondition);
	     window.close();
	}

function replaceWithCheckBox($obj, checkedValue) {

	 if ($obj.length == 0) return; 
	 var $elemx = $(document.createElement("input"));
	 var name = $obj[0].name;
	 var id = $obj[0].id;
	 var value = $obj[0].value;
	 var val = (value == checkedValue);
	 $elemx.attr({type:'checkbox',id:id,name:name,checked:val,defaultChecked:val,value:checkedValue});
	 $obj.replaceWith($elemx); 
	}

function xcopyRate(){
	var tariffRateDescriptionId=$(":checkbox:checked").val();
	var tariffRateAmountId=null;
	var tariffRateAmountId = null;


		//alert('tariffRateDescriptionId'+tariffRateDescriptionId);
		$.ajax({
			   type: "GET",
			   url: _context +"/copyCustomerRate/validateRateDescriptionCustomerRates?",
			   data: "tariffRateDescriptionId="+ tariffRateDescriptionId,
			   success: function(msg){
				   /*if(msg=="NotValid"){
					   alert('Not a valid combination to add items.'); 
					   return;
					}else{

							document.location.href = _context +'/copyCustomerRate/showForm?tariffRateDescriptionId='+ tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId;
		
					}*/
				   
				   if(msg=="valid"){
					   document.location.href = _context +'/copyCustomerRate/showForm?tariffRateDescriptionId='+ tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId;
					}else{

						 alert(msg); 
						 return;
		
					}
			   }
       
		
		
		 });
		
		
		
		
		
		

	
}



function loadReplicate() {
	
	var tariffRateDescriptionId=$(":checkbox:checked").val();
	
	var searchLength = document.rateDesriptionForm.searchInput.length;
	var rateDescToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateDesriptionForm.searchInput[i].checked;
			searchInp = document.rateDesriptionForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionForm.searchInput.checked;
			searchInp = document.rateDesriptionForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			rateDescToUpdate = rateDescToUpdate  + ","+ searchInp;

		}
	}

	if (selCount == 0) {
		tariffRateDescriptionId = tariffRateDescriptionId;
	} else {
		tariffRateDescriptionId = rateDescToUpdate;
	}
//	alert("itemId : " + itemId);
	
	document.location.href = _context +'/RateDescription/replicate/showForm?rateDescriptionId='+ tariffRateDescriptionId;

}

function validateCombforMandatoryFiels(){
    var grpCode = document.getElementById('GROUP_NAME').value;
    var sourceCode = document.getElementById('SOURCE_TARIFF').value;
    var itemCode=document.getElementById('ITEM_NAME').value;
    var validComb=false;
    
    if(grpCode!=null && grpCode!="" && grpCode!="ALL"
    	&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
    		&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
    	    
    	validComb=true;
    }
    return validComb;
}



function setDefaultForConditionSearch(){
	
	
		$("#SOURCE_TARIFF").val($(document).getUrlParam("sourceCode"));
		$("#GROUP_NAME").val($(document).getUrlParam("groupCode"));
		$("#ITEM_NAME").val($(document).getUrlParam("itemCode"));

		
}





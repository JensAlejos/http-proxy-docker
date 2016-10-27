$(document).ready(

function() {
	


$('form[name="rateDesriptionForm"]').formatCasSearchForm({ 
hasSavedSearchFeature: false, 
customActions: [ ]
});
	
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




// Disable the buttons by default
$('#rate_delete').attr("disabled","disabled");
$('#rate_xcopy').attr("disabled","disabled");
$('#rate_rtr').attr("disabled","disabled");
$('#rate_replicate').attr("disabled","disabled");
$('#rateRevenueCondBtn').attr("disabled","disabled");


// Hiding the extra columns in CAS search results 


$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(14)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(14)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(15)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(15)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(16)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(16)').hide();

$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(17)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(17)').hide();


$('.displaytagtable').children('thead:nth-child(1)').children().children('th:nth-child(18)').hide();
$('.displaytagtable').children('tbody:nth-child(2)').children().children('td:nth-child(18)').hide();

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
		 activeRevenueBtn();
		 //$('#rateRevenueCondBtn').removeAttr("disabled");
	 }else{
		 $('#rate_delete').attr("disabled","disabled");
		 $('#rate_xcopy').attr("disabled","disabled");
		 $('#rate_rtr').attr("disabled","disabled");
		 $('#rate_replicate').attr("disabled","disabled");
		 activeRevenueBtn();
	 }
     
});





  



//div for custom "Search" and "Clear" buttons

$('.searchTable').after(
		'<div id="showCusButtons">' +	
		'<table>' +
		'<br></br>' +
		'<tr>' +
		  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"> </td>'+
		  '<td><input type="button" onclick="javascript:resetRDForm();" id="clrdummy" value="Clear" name="Clear" class="buttonNoFloat"></td>' +
		'</tr>' +
	  	'</table>' +
	  	'</div>'	
  	);

//Hide Cas Generated "Search" and "Clear" buttons

$('.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();




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
		
		var grpType=rowObject.children('td:nth-child(15)').html();
		var srcTariff=rowObject.children('td:nth-child(16)').html();
		var grpName=rowObject.children('td:nth-child(17)').html();
		var itemName=rowObject.children('td:nth-child(18)').html();
		var description=rowObject.children('td:nth-child(13)').html();
		var rateBasis=rowObject.children('td:nth-child(8)').html();
		var amount=rowObject.children('td:nth-child(9)').html();
		var effDateRD=rowObject.children('td:nth-child(3)').html();
		var expDateRD=rowObject.children('td:nth-child(4)').html();
		var equipment=rowObject.children('td:nth-child(5)').html();
		var city=rowObject.children('td:nth-child(7)').html();	
		var rtrFlag=rowObject.children('td:nth-child(14)').html();	
		
		//Create DATA string for HTTP GET
	    data="rateDescId="+rateDescId+"&grpType="+grpType+"&srcTariff="+srcTariff+"&grpName="+grpName+"&itemName="+itemName+"&description="+description
	    +"&rateBasis="+rateBasis+"&amount="+amount+"&effDateRD="+effDateRD+"&expDateRD="+expDateRD+"&equipment="+equipment+
	    "&city="+city+"&rtrFlag="+rtrFlag;
	
	    //GET Request to RTR link search CAS page
	    document.location.href = _context +'/cas/rateToRateSearch.do?'+ data ;
	    
		
	 
	 
});
	

$('#SOURCE_TARIFF').gatesAutocomplete({
	 /*source: function(request, response) {
	 		 $.ajax({
	 		 		 url: _context+'/cas/autocomplete.do',
	 		 		 data: {
	 		 		 		 method: 'searchTariffSource',
	 		 		 		 searchType: '11',
	 		 		 		 term: request.term,
	 		 		 		 groupType:  $('#GROUP_TYPE').val()
	 		 		 },
	 		 		 success: function(data) {
	 		 		 		 response(data);
	 		 		 }
	 		 });
	 },*/
	source: _context+'/cas/autocomplete.do',
	extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 //term: trf,
		 		 groupType:  function(){return $('#GROUP_TYPE').val();}//'01'
	},
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
	 		 return data.name;
	 },
	 select: function(data) {
	 		 $('#SOURCE_TARIFF').val(data.name);	
	 		 
	 		 
	 		 if($('#GROUP_TYPE').val()=="01"){
	 			 $('#GROUP_NAME').val(data.name);	 			 
	 		 }
	 	activeRevenueBtn();	 
	 }		 
});		 


$('#GROUP_NAME').gatesAutocomplete({
	 /*source: function(request, response) {
	 		 $.ajax({
	 		 		 url: _context+'/cas/autocomplete.do',
	 		 		 data: {
	 		 		 		 method: 'searchGroupName',
	 		 		 		 searchType: '10',
	 		 		 		 term: request.term,
	 		 		 		 groupType:  $('#GROUP_TYPE').val(),
	 		 		 		 sourceTariff:  $('#SOURCE_TARIFF').val()
	 		 		 },
	 		 		 success: function(data) {
	 		 		 		 response(data);
	 		 		 }
	 		 });
	 },*/
	 source: _context+'/cas/autocomplete.do',
	 extraParams: {
		 method: 'searchGroupName',
	 		 searchType: '10',
	 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
	 		 groupType:  function(){return $('#GROUP_TYPE').val();},//'01',
	 		 sourceTariff:  function(){return $('#SOURCE_TARIFF').val();},
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
	 /*source: function(request, response) {
	 		 $.ajax({
	 		 		 url: _context+'/cas/autocomplete.do',
	 		 		 data: {
	 		 		 		 method: 'searchItemName',
	 		 		 		 searchType: '43',
	 		 		 		 term: request.term,
	 		 		 		 groupType:  $('#GROUP_TYPE').val(),
	 		 		 		 sourceTariff:  $('#SOURCE_TARIFF').val(),
	 		 		 		 groupName:  $('#GROUP_NAME').val()
	 		 		 },
	 		 		 success: function(data) {
	 		 		 		 response(data);
	 		 		 }
	 		 });
	 },*/
	 source: _context+'/cas/autocomplete.do',
	 minLength: 1,
	 extraParams: {
		 method: 'searchItemName',
	 		 searchType: '43',
	 		 //term: function(){return (request.term==null || $.trim(request.term)=='')?"ALL":request.term;},
	 		 groupType:  function(){return $('#GROUP_TYPE').val();},//'01',
	 		 sourceTariff:  function(){return $('#SOURCE_TARIFF').val();},
	 		 groupName:   function(){return $('#GROUP_NAME').val();}
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
		if(item.stateCode != " "){
			return item.cityCode+" "+item.cityName+","+item.stateCode;	
		}
		else{
			return item.cityCode+" "+item.cityName;
		}
		//return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	formatResult: function(item) {
		if(item.stateCode != " "){
			return item.cityCode+" "+item.cityName+","+item.stateCode;	
		}
		else{
			return item.cityCode+" "+item.cityName;
		}
		//return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	select: function(item) {
		$('#CITY_CODE').val(item.id);
	}	
});	



//$('#showCusButtons').children('table:nth-child(3)').children().children().children('td:nth-child(2)').hide();

// Hide equipment fields generated by CAS.

$('td.dataField:contains("EqFun:")').hide();
$("#EQ_FUN_CD").parent("td").hide();

$('td.dataField:contains("EqLen:")').hide();
$("#EQ_LEN_FT").parent("td").hide();

$('td.dataField:contains("EqHt:")').hide();
$("#EQ_HT_CD").parent("td").hide();

// Append new custom fields for equipment

$('#OD_FLAG').parent().after(
		  '<td class="dataField">Equipment: </td>'+
		  '<td colspan="3"><input id="planEquipFunctionCode" class="formField ui-autocomplete-input" name="planEquipFunctionCode" type="text" size="1" maxlength="1"/>'+
			  '&nbsp;&nbsp;<input id="planEquipLengthFeet" class="formField ui-autocomplete-input" name="planEquipLengthFeet" type="text"  size="1" maxlength="2"/>'+
			  '&nbsp;&nbsp;<input id="planEquipHeightCode" class="formField ui-autocomplete-input" name="planEquipHeightCode" type="text"  size="1" maxlength="1"/></td>'
		   			
  	);

//$('td.dataField:contains("EqFun:")').text("Equipment:");



document.getElementById('planEquipFunctionCode').value =$('#EQ_FUN_CD').val();
document.getElementById('planEquipLengthFeet').value =$('#EQ_LEN_FT').val();
document.getElementById('planEquipHeightCode').value =$('#EQ_HT_CD').val();




//$("#CITY_CODE").parent().attr('colspan',3);

$("td.dataField:contains('Group Type')").attr("style","width: 100px");
$("td.dataField:contains('Source Tariff')").attr("style","width: 100px");
$("td.dataField:contains('Group Name')").attr("style","width: 100px");
$("td.dataField:contains('Item')").attr("style","width: 20px");
$("td.dataField:contains('Equipment')").attr("style","width: 100px");
$("td.dataField:contains('City')").attr("style","width: 100px");
$("td.dataField:contains('Current/Future Only')").attr("colspan","2");


$("#GROUP_TYPE").attr("style","width: 120px");
$("#SOURCE_TARIFF").attr('size',8);
$("#GROUP_NAME").attr('size',8);
$("#ITEM_NAME").attr('size',8);


$("#AMOUNT").attr('size',15);
$("#CITY_CODE").attr('size',8);
$("#DESCRIPTION").attr('size',15);




//Source Tariff and Group Name-user should not be able to enter more then 6 char.

$("#GROUP_NAME").get(0).setAttribute("maxlength", 6);

$("#SOURCE_TARIFF").get(0).setAttribute("maxlength", 6);

$("#ITEM_NAME").get(0).setAttribute("maxlength", 8);


replaceWithCheckBox($("#RD_ID"),$("#RD_ID").val());

//code to bind pop up search
$('#GROUP_NAME').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
$('#SOURCE_TARIFF').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
$('#ITEM_NAME').gatesPopUpSearch({func:function() {ItemPopupSearch()}});
$('#CITY_CODE').gatesPopUpSearch({func:function() {cityPopupSearch()}});
//uncomment to enable Equipment Manual Lookup
//$('#planEquipHeightCode').gatesPopUpSearch({func:function() {equipPopupSearch()}}); 

$("#RD_ID").click(function() {
	if($('#RD_ID').attr('checked')){
		 document.getElementById('RD_ID').value="Y";
	}else{
		document.getElementById('RD_ID').value="ALL";
	}

	
	 
	 
});

if(! validComb){

	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#rate_add').attr("disabled","disabled");
	$("#RD_ID").attr("checked", true);
	document.getElementById('RD_ID').value="Y";
}

//Remove CAS generated ALL label for Text fields.

removeDefTextForCASFields();


//reset page on change of group type
$("#GROUP_TYPE").change(function() {
	resetRDForm();

});


});
//Button for Revenue Division LInkages
function revnueLinkage(){
	var tariffgrpType=$('#GROUP_TYPE').val();
	var tariffgrpName=$('#GROUP_NAME').val();
	var tariffsrc=$('#SOURCE_TARIFF').val();
	var tariffItem=$('#ITEM_NAME').val(); 
	var rateId=$(":checkbox:checked").val();
	
	var searchLength = document.rateDesriptionForm.searchInput.length;

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";
			checked = document.rateDesriptionForm.searchInput[i].checked;
			searchInp = document.rateDesriptionForm.searchInput[i].value;
			if (checked) {
				selCount = selCount + 1;
				
			}
			
		}

		if (selCount > 1) {
			alert('Select only One Record');
			
		} 
	
		else
			{
			rateId = rateId;
			
	//var tariffgrpType = "01"
	var tariffTogrpType="04"
	submiturl=_context +"/cas//rateRevenueSearch.do?";
	submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+tariffItem+"&rateId="+rateId+"&groupToTypeCode="+ tariffTogrpType+"&screenName=revenue";
	document.location.href =submiturl+submitdata;	
			}
}

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
		//alert('rateDescId'+rateDescId);
		document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='
				+ rateDescId ;
	} else {
	//	alert('rateDescToUpdate'+rateDescToUpdate);
		document.location.href = _context +'/tm/traiffRate/showForm?rateDescId='
				+ rateDescToUpdate;
	}
}

function replaceWithCheckBox($obj, checkedValue) {

	var status=false;
	
	if(checkedValue=="Y" ){
		status=true;
	}else if (checkedValue=="N"||checkedValue=="ALL"){
		status=false;
	}
	
	 if ($obj.length == 0) return; 
	 var $elemx = $(document.createElement("input"));
	 var name = $obj[0].name;
	 var id = $obj[0].id;
	 var value = $obj[0].value;
	 var val = (value == checkedValue);
	 $elemx.attr({type:'checkbox',id:id,name:name,checked:val,defaultChecked:val,value:checkedValue});
	 $obj.replaceWith($elemx); 
	 
	 $("#RD_ID").attr("checked", status);//should be checked by default
}


function xcopyRate(){

	var tariffRateAmountId=null;
	var tariffRateAmountId = null;
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
			if(selCount==1){
				rateDescToUpdate = searchInp;
			}
			

		}
	}

	if (selCount == 1) {
		
		tariffRateDescriptionId = rateDescToUpdate;
	
	} else {
		alert('Select Single Record');
		
	}
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
				   document.location.href = _context +'/copyCustomerRate/showForm?tariffRateDescriptionId='+ tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId+'&screenName=0';
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

function resetRDForm(){
	$('#resultdiv').hide();
	document.getElementById('GROUP_NAME').value="ALL";
	document.getElementById('SOURCE_TARIFF').value="ALL";
	document.getElementById('ITEM_NAME').value="ALL";
	document.getElementById('OD_FLAG').value="ALL";
	document.getElementById('EQ_FUN_CD').value="";
	document.getElementById('EQ_LEN_FT').value="";
	document.getElementById('EQ_HT_CD').value="";
	document.getElementById('AMOUNT').value="ALL";
	document.getElementById('CITY_CODE').value="";
	document.getElementById('DESCRIPTION').value="";
	
	
	
	//disable all buttons after reset
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#rate_add').attr("disabled","disabled");
	$('#rate_delete').attr("disabled","disabled");
	$('#rate_xcopy').attr("disabled","disabled");
	$('#rate_rtr').attr("disabled","disabled");
	$('#rate_replicate').attr("disabled","disabled");
	$('#rateRevenueCondBtn').attr("disabled","disabled");
	
}

function removeDefTextForCASFields(){

	if($("#EQ_FUN_CD").val()=="ALL"){
		 document.getElementById('planEquipFunctionCode').value="";
	}

	if($("#EQ_LEN_FT").val()=="ALL"){
		 document.getElementById('planEquipLengthFeet').value="";
	}

	if($("#EQ_HT_CD").val()=="ALL"){
		 document.getElementById('planEquipHeightCode').value="";
	}
	
	if($("#AMOUNT").val()=="ALL"){
		 document.getElementById('AMOUNT').value="";
	}
	
	if($("#CITY_CODE").val()=="ALL"){
		 document.getElementById('CITY_CODE').value="";
	}
	
	if($("#DESCRIPTION").val()=="ALL"){
		 document.getElementById('DESCRIPTION').value="";
	}
	
	
}

function searchValue(){
	
	//Set the CAS generated fields for Equipment by custom fields for equipment
	document.getElementById('EQ_FUN_CD').value=document.getElementById('planEquipFunctionCode').value;
	document.getElementById('EQ_LEN_FT').value=document.getElementById('planEquipLengthFeet').value;
	document.getElementById('EQ_HT_CD').value=document.getElementById('planEquipHeightCode').value;
	
	
	//submit the form for CAS search to custom Action
	var frm = document.forms["rateDesriptionForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	return true;
	
}


function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#GROUP_TYPE').val()+"&sourceTariff="+$('#SOURCE_TARIFF').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#GROUP_TYPE').val()+"&sourceTariff="+$('#SOURCE_TARIFF').val()+"&grpName="+$('#GROUP_NAME').val();
var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}

function ItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#GROUP_TYPE').val()+"&sourceTariff="+$('#SOURCE_TARIFF').val()+"&grpName="+$('#GROUP_NAME').val()+"&itemName="+$('#ITEM_NAME').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function cityPopupSearch() {   
	var actionUrl = _context+"/city/manualLookup/showForm?term="+$('#CITY_CODE').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);    
}
function equipPopupSearch() {   
	var actionUrl = _context+"/equipment/lookup/showForm?equipCode="+$('#planEquipFunctionCode').val()+"&equipLen="+$('#planEquipLengthFeet').val()+"&equipHt="+$('#planEquipHeightCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'EquipmentSearch', windowStyle);    
}

function equipUpdate(id){
	var values = id.split(",");
	$('#planEquipFunctionCode').val(values[0]);
	$('#planEquipLengthFeet').val(values[1]);
	$('#planEquipHeightCode').val(values[2]);
}

function cityUpdate(id){
	$('#CITY_CODE').val(id);
}


function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#SOURCE_TARIFF').val(values[0]);
  	
  	$('#GROUP_NAME').val("");
  	$('#ITEM_NAME').val("");
  	
	if($('#GROUP_TYPE').val()=="01"){
		 $('#GROUP_NAME').val(values[0]);
	 }
  	
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#GROUP_NAME').val(values[0]);
  	
  	$('#ITEM_NAME').val("");
}
function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	$('#ITEM_NAME').val(values[0]); 
	
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
	
	}

function activeRevenueBtn(){
	
	var groupType = $('#GROUP_TYPE').val();
	var sourceTariff = $('#SOURCE_TARIFF').val();
	$.ajax({
		   type: "GET",
		   url: _context +"/tm/traiffRate/activeRevenueBtn?",
		   data: { 		 		 
			   groupType:  groupType,
			   sourceTariff: sourceTariff
		   },
		   success: function(msg){
			   if(msg=="true")				   
				   $('#rateRevenueCondBtn').removeAttr("disabled");
				   
		   }
	});
}

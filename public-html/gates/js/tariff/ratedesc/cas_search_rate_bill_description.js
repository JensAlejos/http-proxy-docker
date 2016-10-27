
var grpNameUse =null; 
var grpSrcUse =null; 
var itmNameUse =null; 
var dataName=null;
$(function() {
	tabSequence('#tabSequence');
});

$(document).ready(function() {
	$('form[name="rateDesriptionBillForm"]').formatCasSearchForm({ 
	hasSavedSearchFeature: false, 
	customActions: [ ]
	});
	$('#casQuickSearch').each(function(index) 
	    {		
	//alert($('#in_amount').val())
	   
	    	//alert($($('#casQuickSearch').children()[3].children).children()[8].innerHTML);
/*
	    	$('#conditionCityPortOriginPortToList')
		      .append($('<option>',{style:"color:blue" ,  value : realvalues[i] })
		      .text(textvalues[i] )); */
			
		
		});

// Check combination value on page load for grp name /src tariff and Item Name
var grpType=$('#in_group_type').val();
grpNameUse= document.getElementById('in_group_name').value;
var grpCode = document.getElementById('in_group_name').value;
grpSrcUse = document.getElementById('in_source_tariff').value;
var sourceCode = document.getElementById('in_source_tariff').value;
itmNameUse = document.getElementById('in_item_name').value;
var itemCode=document.getElementById('in_item_name').value;
var validComb=false;

if(grpCode!=null && grpCode!="" && grpCode!="ALL"
	&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
		&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
	    
	validComb=true;
}


setdefaults();

// Disable the buttons by default
$('#rate_delete').attr("disabled","disabled");
$('#rate_xcopy').attr("disabled","disabled");
$('#rate_rtr').attr("disabled","disabled");
$('#rate_replicate').attr("disabled","disabled");
$('#rateRevenueCondBtn').attr("disabled","disabled");

//code to hide extra input specific from R3(when called from R3 screen (in_frt_received_date)
$($('table')[3]).children().children('tr:nth-child(4)').hide();

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


$('#in_group_name').keyup(function() {	
	var validComb= validateCombforMandatoryFiels();	
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
});

$('#in_source_tariff').keyup(function() {
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		$('#rate_add').removeAttr("disabled");
	}
});

$('#in_item_name').keyup(function() {
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
		$('#rate_add').attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
		if (_displayonly) {
			$('#rate_add').gatesDisable();
	    }
		else
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
		 $('#rate_xcopy').removeAttr("disabled");
		 $('#rate_rtr').removeAttr("disabled");
		 $('#rate_replicate').removeAttr("disabled");
		 activeRevenueBtn();
		 if (_readonly) {
				$('#rate_delete').gatesDisable();   
				$('#authorization').gatesDisable();
		}
		 
		 else
			 {
			 $('#rate_delete').removeAttr("disabled");
			 }
		 if(_displayonly)
			 {
			 $('#rate_xcopy').attr("disabled","disabled");
			 $('#rate_replicate').attr("disabled","disabled");
			 }
		 else
			 {
			 $('#rate_xcopy').removeAttr("disabled");
			 $('#rate_replicate').removeAttr("disabled");
			 }

		 //$('#rateRevenueCondBtn').removeAttr("disabled");
	 }else{
		 $('#rate_delete').attr("disabled","disabled");
		 $('#rate_xcopy').attr("disabled","disabled");
		 $('#rate_rtr').attr("disabled","disabled");
		 $('#rate_replicate').attr("disabled","disabled");
		 $('#rateRevenueCondBtn').attr("disabled","disabled");
		 //$('#rateRevenueCondBtn').removeAttr("disabled");
	 }
     
});

$('#in_amount').change(function(){
	 var baseRateAmt=$('#in_amount').val();		
	 if(baseRateAmt!=null && baseRateAmt!="") {
		 $('#in_amount').val(parseFloat(baseRateAmt).toFixed(2));
	 }
	 else if(baseRateAmt=="" || baseRateAmt==null || isNaN(baseRateAmt)) {
		 $('#in_amount').val("");
	 }
	 else {
		 var amt = parseFloat(this.value);
        $(this).val(amt.toFixed(2));
	 }
}); 

//Hide Cas Generated "Search" and "Clear" buttons

$('.quickSearchBgColor').parent().parent().parent().children('tr:nth-child(3)').hide();


//div for custom "Search" and "Clear" buttons

$('.searchTable').after(
		'<div id="showCusButtons">' +	
		'<table>' +
		'<br></br>' +
		'<tr>' +
		  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"> </td>'+
		  '<td><input type="button" onclick="javascript:resetForm();" id="clrdummy" value="Clear" name="Clear" class="buttonNoFloat"></td>' +
		'</tr>' +
	  	'</table>' +
	  	'</div>'	
  	);



$('.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();





// Rate to Rate Click function
	
$('#rate_rtr').click(function(){
	 
		var searchLength = document.rateDesriptionBillForm.searchInput.length;
		
		if (typeof (searchLength) == "undefined") {
			searchLength = 1;
		}
		
		var selCount = 0;
		var selIdsList="";
		
		for ( var i = 0; i < searchLength; i++) {
			var checked = false;
			var selId="";
			if (searchLength != 1) {
				checked = document.rateDesriptionBillForm.searchInput[i].checked;
				if(checked){					
					selId = document.rateDesriptionBillForm.searchInput[i].value;
				}
			} else {
	
				checked = document.rateDesriptionBillForm.searchInput.checked;
				if(checked){
					selId = document.rateDesriptionBillForm.searchInput.value;
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
		var grpType=rowObject.children('td:nth-child(14)').html();		
		var srcTariff=rowObject.children('td:nth-child(15)').html();
		var grpName=rowObject.children('td:nth-child(16)').html();
		var itemName=rowObject.children('td:nth-child(17)').html();
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
	

$('#in_source_tariff').gatesAutocomplete({
	source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 		 		 method: 'searchTariffSource',
	 		 		 searchType: '11',
	 		 		 groupType:  function() { return $('#in_group_type').val(); }
		 		},
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
		 $('input[name="grpId"]').val(data.id);
	 		 return data.name;
	 },
	 select: function(data) {
	 		$('#in_source_tariff').val(data.name);	
	 		$('input[name="grpId"]').val(data.id);
	 		 if($('#in_group_type').val()=="01"){
	 			 $('#in_group_name').val(data.name);	 			 
	 		 }
	
	 	if (_displayonly) {
			$('#rate_add').gatesDisable();
	    }
	 }		 
});		 

//Blurr the data for invalid group Id
$('#in_source_tariff').change(function(){
	if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){		
  	$("#in_source_tariff").val("ALL"); 
  	$("#in_group_name").val("ALL"); 
	}
	else
	{
		$("#in_source_tariff").val(dataName); 
 		 if($('#in_group_type').val()=="01"){
 			 $('#in_group_name').val(dataName);
 		 }
		$('input[name="grpId"]').val("");
		$('input[name="itemId"]').val("");
	}
}); 


$('#in_group_name').gatesAutocomplete({
	 source:  _context+'/cas/autocomplete.do',
	 extraParams: {
 		 		 method: 'searchGroupName',
 		 		 searchType: '10',
 		 		 groupType:  function () { return $('#in_group_type').val(); },
 		 		 sourceTariff:  function () { return $('#in_source_tariff').val(); }				 		 		 		 
	 		 	},
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
		 $('input[name="grpId"]').val(data.id);
	 	 return data.name;
	 },
	 select: function(data) {
	 		$('#in_group_name').val(data.id);	
	 		$('input[name="grpId"]').val(data.id);
	 		if (_displayonly) {
				$('#rate_add').gatesDisable();
		    }
	 }		 
});

//Blurr the data for invalid group Id
$('#in_group_name').change(function(){
	if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){		
 	$("#in_group_name").val("ALL");       	
	  }
	else{
		$("#in_group_name").val(dataName);    
		$('input[name="grpId"]').val("");
		$('input[name="itemId"]').val("");
	}
}); 


$('#in_item_name').gatesAutocomplete({
	 source:  _context+'/cas/autocomplete.do',
	 extraParams: {
	 		 		 		 method: 'searchItemName',
	 		 		 		 searchType: '43',
	 		 		 		 groupType:  function () { return $('#in_group_type').val(); },
	 		 		 		 sourceTariff:  function () { return $('#in_source_tariff').val(); },				 		 		 		 
	 		 		 		 groupName:  function () { return $('#in_group_name').val(); }
	 				},
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
		 $('input[name="itemId"]').val(data.id);
	 		 return data.name;
	 },
	 select: function(data) {
	 		$('#in_item_name').val(data.id);
	 		$('input[name="itemId"]').val(data.id);
	 		if (_displayonly) {
				$('#rate_add').gatesDisable();
		    }
	 		else
	 			{
	 			$('#rate_add').removeAttr("disabled");
	 			}
	 		$("input[type=button][value=Search]").removeAttr("disabled");
	 }		 
});		 

//Blurr the data for invalid item Id
$('#in_item_name').change(function(){
	if($('input[name="itemId"]').val()==null || $('input[name="itemId"]').val()==""){
	$("#in_item_name").val("ALL");   
  }
	else{
		$("#in_item_name").val(dataName); 
		$('input[name="grpId"]').val("");
		$('input[name="itemId"]').val("");
	}	
	if($('#in_item_name').val()=="ALL")
	{
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#rate_add').attr("disabled","disabled");
	}
}); 	

// City Auto complete
$('#in_city_code').gatesAutocomplete({
	source: _context+'/tm/Autocomplete/autoCompCity',
	
	formatItem: function(item) {
		return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	formatResult: function(item) {
		return item.cityCode+" "+item.cityName+","+item.stateCode;
	},
	select: function(item) {		
		$('#in_city_code').val(item.cityCode);
		
		$('input[name="cityId"]').val(item.cityCode);
		if (_displayonly) {
			$('#rate_add').gatesDisable();
	    }
	}	
});

//Blurr the data for invalid city Id
$('#in_city_code').change(function(){
	if($('input[name="cityId"]').val()==null || $('input[name="cityId"]').val()==""){
	$("#in_city_code").val("ALL");       	
  }
	else{
		$('input[name="cityId"]').val("");
	}	
});

//$('#showCusButtons').children('table:nth-child(3)').children().children().children('td:nth-child(2)').hide();

// Hide equipment fields generated by CAS.

$('td.dataField:contains("EqFun:")').hide();
$("#in_eq_fun_cd").parent("td").hide();

$('td.dataField:contains("EqLen:")').hide();
$("#in_eq_len_ft").parent("td").hide();

$('td.dataField:contains("EqHt:")').hide();
$("#in_eq_ht_cd").parent("td").hide();

//Append new custom fields for equipment

$('#in_od_flag').parent().after(
		  '<td class="dataField">Equipment: </td>'+
		  '<td colspan="3"><input id="planEquipFunctionCode" class="formField ui-autocomplete-input" name="planEquipFunctionCode" type="text" size="1" maxlength="1"/>'+
			  '&nbsp;&nbsp;<input id="planEquipLengthFeet" class="formField ui-autocomplete-input" name="	" type="text"  size="2" maxlength="2"/>'+
			  '&nbsp;&nbsp;<input id="planEquipHeightCode" class="formField ui-autocomplete-input" name="planEquipHeightCode" type="text"  size="1" maxlength="1"/></td>'
		   			
  	);

//$('td.dataField:contains("EqFun:")').text("Equipment:");



document.getElementById('planEquipFunctionCode').value =$('#in_eq_fun_cd').val();
document.getElementById('planEquipLengthFeet').value =$('#in_eq_len_ft').val();
document.getElementById('planEquipHeightCode').value =$('#in_eq_ht_cd').val();



//$("#in_city_code").parent().attr('colspan',3);

$("td.dataField:contains('Group Type')").attr("style","width: 100px");
$("td.dataField:contains('Source Tariff')").attr("style","width: 100px");
$("td.dataField:contains('Group Name')").attr("style","width: 100px");
$("td.dataField:contains('Item')").attr("style","width: 20px");
$("td.dataField:contains('Equipment')").attr("style","width: 100px");
$("td.dataField:contains('City')").attr("style","width: 100px");
$("td.dataField:contains('Current/Future Only')").attr("colspan","2");


$("#in_group_type").attr("style","width: 120px");
$("#in_source_tariff").attr('size',8);
$("#in_group_name").attr('size',8);
$("#in_item_name").attr('size',8);


$("#in_amount").attr('size',15);
$("#in_city_code").attr('size',8);
$("#in_description").attr('size',15);


//Source Tariff and Group Name-user should not be able to enter more then 6 char.

$("#in_group_name").get(0).setAttribute("maxlength", 6);
$("#in_source_tariff").get(0).setAttribute("maxlength", 6);
$("#in_item_name").get(0).setAttribute("maxlength", 8);


replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());

//code to bind pop up search
$('#in_group_name').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
$('#in_source_tariff').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
$('#in_item_name').gatesPopUpSearch({func:function() {ItemPopupSearch()}});
$('#in_city_code').gatesPopUpSearch({func:function() {cityPopupSearch()}});


//uncomment to enable Equipment Manual Lookup
$('#planEquipHeightCode').gatesPopUpSearch({func:function() {equipPopupSearch()}}); 

$("#in_expiration_date_flag").click(function() {
	if($('#in_expiration_date_flag').attr('checked')){
		 document.getElementById('in_expiration_date_flag').value="Y";
	}else{
		document.getElementById('in_expiration_date_flag').value="ALL";
	}

	
	 
	 
});

if(! validComb){

	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#rate_add').attr("disabled","disabled");
	$("#in_expiration_date_flag").attr("checked", true);
	document.getElementById('in_expiration_date_flag').value="Y";
}

      //Remove CAS generated ALL label for Text fields.

       removeDefTextForCASFields();

      
       var groupTypeCode = document.rateDesriptionBillForm.groupTypeCode.value; 
	   var sourceCode = document.rateDesriptionBillForm.sourceCode.value;
	   var groupCode = document.rateDesriptionBillForm.groupCode.value;
	   var itemCode = document.rateDesriptionBillForm.itemCode.value;
	   var currentFuture = document.rateDesriptionBillForm.currentFuture.value;
		if(groupTypeCode!=null || groupTypeCode!='' )
				{
			    
				$('#in_group_type').val(groupTypeCode);
				}
		 if(sourceCode!=null && sourceCode!='')
				{
				$('#in_source_tariff').val(sourceCode);
				
		        }
		  if(groupCode!=null && groupCode!='')
			{
			$('#in_group_name').val(groupCode);
			}
		  if(itemCode!=null && itemCode!='')
			{
			$('#in_item_name').val(itemCode);
			if(itemCode!='ALL'){
				$("input[type=button][value=Search]").removeAttr("disabled");
			}
		  else
		   {
				$("input[type=button][value=Search]").attr("disabled","disabled");
				$('#rate_add').attr("disabled","disabled");
				$("input[type=button][value=Search]").attr("disabled","disabled");
				$('#resultdiv').hide();
			}
			} 
		    if(currentFuture=="Y" || currentFuture==""){
			    $("#in_expiration_date_flag").attr("checked", true);
		    }else{
				  $("#in_expiration_date_flag").attr("checked", false);
			} 
		   

//reset page on change of group type
$("#in_group_type").change(function() {
	if(groupTypeCode != $("#in_group_type").val()){
	resetRDForm();
	}
});

	 if(_displayonly){
		 $('#rate_add').attr("disabled","disabled");
	 }
	 var _prefDate= $('input[name="prefDateSessionVar"]').val();	
		
		if(_prefDate!=null && _prefDate!=''){
			$("#preferencedate").val(_prefDate);
			$("#preferencedate").datepicker('setDate',_prefDate);
		}
 

});
//Button for Revenue Division LInkages
function revnueLinkage(){
	var tariffgrpType=$('#in_group_type').val();
	var tariffgrpName=$('#in_group_name').val();
	var tariffsrc=$('#in_source_tariff').val();
	var tariffItem=$('#in_item_name').val(); 
	var rateId="";
	
	
	

	
	var searchLength = document.rateDesriptionBillForm.searchInput.length;
	var rateDescToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateDesriptionBillForm.searchInput[i].checked;
			searchInp = document.rateDesriptionBillForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionBillForm.searchInput.checked;
			searchInp = document.rateDesriptionBillForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			if(selCount==1){
				rateDescToUpdate = searchInp;
			}
			

		}
	}

	if (selCount == 1) {
		
		rateId = rateDescToUpdate;
	
	} else {
		alert('Select Single Record');
		
	}
	
	var rowObject= $('input[name="searchInput"][value="'+rateId+'"]').parent().parent();
	var rowObject1=rowObject.children('td:nth-child(5)').html();
	var rowObject2=rowObject.children('td:nth-child(6)').html();
	var rowObject3=rowObject.children('td:nth-child(7)').html();
	var rowObject4=rowObject.children('td:nth-child(13)').html();
	
	var rowVa =rowObject1+"-"+rowObject2+" " +rowObject3+"-"+rowObject4;
	
			
	//var tariffgrpType = "01"
	var tariffTogrpType="04"
	submiturl=_context +"/cas/rateRevenueSearch.do?";
	submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+grpSrcUse+"&groupCode="+grpNameUse+"&itemCode="+itmNameUse+"&rateId="+rateId+"&rate="+rowVa+"&groupToTypeCode="+ tariffTogrpType+"&screenName=revenue";
	document.location.href =submiturl+submitdata;	
			}


//Add New rate DESCRIPTION
function addRateDesc() {
	var grpType = document.getElementById('in_group_type').value;
    var grpCode = document.getElementById('in_group_name').value;
    var sourceCode = document.getElementById('in_source_tariff').value;
    var itemCode=document.getElementById('in_item_name').value;
    
    

	// BR1. Selection of the ‘Tariff Group Type’, ‘Source Tariff’, ‘Group
	// Name’ & ‘Item Number’ are mandatory on the ‘Search Rate in_description’
	// screen to create a Rate DESCRIPTION record.
    
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
				   alert('Record has been deleted successfully.');
				   postMethod('search',document.forms["rateDesriptionBillForm"].method);
				}else{								
					alert('Error in Rate Descriptions Deletion.'); 
												
				}
			 }
		 });
	
}

//Delete Rate Descriptions
function deleteRateDesc() {

	var searchLength = document.rateDesriptionBillForm.searchInput.length;
	
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	
	var selCount = 0;
	var searchInp = "";
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;		
		var idTodel="";
		if (searchLength != 1) {
			checked = document.rateDesriptionBillForm.searchInput[i].checked;
			idTodel = document.rateDesriptionBillForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionBillForm.searchInput.checked;
			idTodel = document.rateDesriptionBillForm.searchInput.value;
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
				
				//document.forms["rateDesriptionBillForm"].method.value = "deleteRateDescriptions";
				//document.forms["rateDesriptionBillForm"].rateDescTodelete.value = searchInp;
				//document.forms["rateDesriptionBillForm"].submit();
				
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

	var searchLength = document.rateDesriptionBillForm.searchInput.length;
	var rateDescToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateDesriptionBillForm.searchInput[i].checked;
			searchInp = document.rateDesriptionBillForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionBillForm.searchInput.checked;
			searchInp = document.rateDesriptionBillForm.searchInput.value;
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
	 
	 $("#in_expiration_date_flag").attr("checked", status);//should be checked by default
}


function xcopyRate(){

	var tariffRateAmountId=null;
	var tariffRateAmountId = null;
	var tariffRateDescriptionId=$(":checkbox:checked").val();
	
	var searchLength = document.rateDesriptionBillForm.searchInput.length;
	var rateDescToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateDesriptionBillForm.searchInput[i].checked;
			searchInp = document.rateDesriptionBillForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionBillForm.searchInput.checked;
			searchInp = document.rateDesriptionBillForm.searchInput.value;
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
				   document.location.href = _context +'/copyCustomerRate/showForm?tariffRateDescriptionId='+ tariffRateDescriptionId+'&tariffRateAmountId='+ tariffRateAmountId+'&screenName=3';
				}else{

					 alert(msg); 
					 return;
	
				}
		   }
	 });	

}

function loadReplicate() {
	
	var tariffRateDescriptionId=$(":checkbox:checked").val();
	var screen='01';
	var searchLength = document.rateDesriptionBillForm.searchInput.length;
	var rateDescToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateDesriptionBillForm.searchInput[i].checked;
			searchInp = document.rateDesriptionBillForm.searchInput[i].value;
		} else {
			checked = document.rateDesriptionBillForm.searchInput.checked;
			searchInp = document.rateDesriptionBillForm.searchInput.value;
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
	
	document.location.href = _context +'/RateDescription/replicate/showForm?rateDescriptionId='+ tariffRateDescriptionId+'&screen='+screen;

}

function validateCombforMandatoryFiels(){
    var grpCode = document.getElementById('in_group_name').value;
    var sourceCode = document.getElementById('in_source_tariff').value;   
    var itemCode=document.getElementById('in_item_name').value;
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
	//document.getElementById('in_group_type').value="01";
	document.getElementById('in_group_name').value="ALL";
	document.getElementById('in_source_tariff').value="ALL";
	document.getElementById('in_item_name').value="ALL";
	document.getElementById('in_od_flag').value="ALL";
	document.getElementById('in_eq_fun_cd').value="";
	document.getElementById('in_eq_len_ft').value="";
	document.getElementById('in_eq_ht_cd').value="";
	document.getElementById('in_amount').value="ALL";
	document.getElementById('in_city_code').value="";
	document.getElementById('in_description').value="";
	
	
	
	//disable all buttons after reset
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#rate_add').attr("disabled","disabled");
	$('#rate_delete').attr("disabled","disabled");
	$('#rate_xcopy').attr("disabled","disabled");
	$('#rate_rtr').attr("disabled","disabled");
	$('#rate_replicate').attr("disabled","disabled");
	$('#rateRevenueCondBtn').attr("disabled","disabled");
	$('input[name="grpId"]').val("");
	$('input[name="itemId"]').val("");
	
}
function resetForm(){
	$('#resultdiv').hide();
	document.getElementById('in_group_type').value="01";
	document.getElementById('in_group_name').value="ALL";
	document.getElementById('in_source_tariff').value="ALL";
	document.getElementById('in_item_name').value="ALL";
	document.getElementById('in_od_flag').value="ALL";
	document.getElementById('in_eq_fun_cd').value="";
	document.getElementById('in_eq_len_ft').value="";
	document.getElementById('in_eq_ht_cd').value="";
	document.getElementById('in_amount').value="ALL";
	document.getElementById('in_city_code').value="";
	document.getElementById('in_description').value="";
	document.getElementById('planEquipFunctionCode').value="";
	document.getElementById('planEquipLengthFeet').value="";
	document.getElementById('planEquipHeightCode').value="";
	
	$('input[name="grpId"]').val("");
	$('input[name="itemId"]').val("");
	
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

	if($("#in_eq_fun_cd").val()=="ALL"){
		 document.getElementById('planEquipFunctionCode').value="";
	}

	if($("#in_eq_len_ft").val()=="ALL"){
		 document.getElementById('planEquipLengthFeet').value="";
	}

	if($("#in_eq_ht_cd").val()=="ALL"){
		 document.getElementById('planEquipHeightCode').value="";
	}
	
	if($("#in_amount").val()=="ALL"){
		 document.getElementById('in_amount').value="";
	}
	
	if($("#in_city_code").val()=="ALL"){
		 document.getElementById('in_city_code').value="";
	}
	
	if($("#in_description").val()=="ALL"){
		 document.getElementById('in_description').value="";
	}
	
	
}

function searchValue(){
	
	
	//Set the CAS generated fields for Equipment by custom fields for equipment
	document.getElementById('in_eq_fun_cd').value=document.getElementById('planEquipFunctionCode').value;
	document.getElementById('in_eq_len_ft').value=document.getElementById('planEquipLengthFeet').value;
	document.getElementById('in_eq_ht_cd').value=document.getElementById('planEquipHeightCode').value;
	var frm = document.forms["rateDesriptionBillForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	
	
	return true;
	
	
	//submit the form for CAS search to custom Action
	
	
}

function searchValueDefault(){
	$('#in_group_type').val(document.rateDesriptionBillForm.groupTypeCode.value);
	$('#in_group_name').val(document.rateDesriptionBillForm.groupCode.value);
	$('#in_source_tariff').val(document.rateDesriptionBillForm.sourceCode.value);
	$('#in_item_name').val(document.rateDesriptionBillForm.itemCode.value);
	var paging =document.rateDesriptionBillForm.paging.value;
	var pagingStatus=is_int(paging);
	$('#in_expiration_date_flag').val(document.rateDesriptionBillForm.currentFuture.value);
	if(pagingStatus==false){
	if($('#in_item_name').val()!=null && $('#in_item_name').val()!='' && $('#in_item_name').val()!='ALL' ){
	var frm = document.forms["rateDesriptionBillForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	return true;
	}
	else
	{
	$('#resultdiv').hide();
	}
	}
	
}
function is_int(value){ 
	  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
	    return true;
	  } else { 
	    return false;
	  } 
	}

function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#in_group_type').val()+"&sourceTariff="+$('#in_source_tariff').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#in_group_type').val()+"&sourceTariff="+$('#in_source_tariff').val()+"&grpName="+$('#in_group_name').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}

function ItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#in_group_type').val()+"&sourceTariff="+$('#in_source_tariff').val()+"&grpName="+$('#in_group_name').val()+"&itemName="+$('#in_item_name').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function cityPopupSearch() {   
	var actionUrl = _context+"/city/manualLookup/showForm?term="+$('#in_city_code').val();
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
	$('#in_city_code').val(id);
}


function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#in_source_tariff').val(values[0]);
  	
  	$('#in_group_name').val("");
  	$('#in_item_name').val("");
  	
	if($('#in_group_type').val()=="01"){
		 $('#in_group_name').val(values[0]);
	 }
  	
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#in_group_name').val(values[0]);
  	
  	$('#in_item_name').val("");
}
function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	$('#in_item_name').val(values[0]); 
	
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
	
	var groupType = $('#in_group_type').val();
	var sourceTariff = $('#in_source_tariff').val();
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

//function for reset form
function setdefaults(){
	var validComb=false;
    if (($(document).getUrlParam("grpType")) != null) {
	    $("#in_group_type").val(unescape($(document).getUrlParam("grpType")));
    }
	if (($(document).getUrlParam("sourceCode")) != null){
	    $("#in_source_tariff").val(unescape($(document).getUrlParam("sourceCode")));
	}
	if (($(document).getUrlParam("groupCode")) != null){
	    $("#in_group_name").val(unescape($(document).getUrlParam("groupCode")));
	}
	if (($(document).getUrlParam("itemCode")) != null){
	    $("#in_item_name").val(unescape($(document).getUrlParam("itemCode")));
	}			
	
	if($("#in_group_name").val()!=null && $("#in_group_name").val()!="" && $("#in_group_name").val()!="ALL"
			&& $("#in_source_tariff").val()!=null && $("#in_source_tariff").val()!="" && $("#in_source_tariff").val()!="ALL"
				&&  $("#in_item_name").val()!=null &&  $("#in_item_name").val()!="" &&  $("#in_item_name").val()!="ALL"){		
		$("input[type=button][value=Search]").removeAttr("disabled");
		if (!_displayonly) {
			$('#rate_add').removeAttr("disabled");	
		}
		
	}   
	
	if (($(document).getUrlParam("grpType")) != null) {
	   if(document.getElementById("displaybase")!=null){
		  document.getElementById("displaybase").style.display="none";
	}	
	
    var frm = document.forms["rateDesriptionBillForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	}
}


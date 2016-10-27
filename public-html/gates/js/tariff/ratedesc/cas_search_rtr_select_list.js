$(document).ready(function() {
	
var dataName=null;
$('form[name="rateToRateSelListForm"]').formatCasSearchForm({ 
		hasSavedSearchFeature: false, 
		customActions: [ ]
});
	
$('#cancel').click(function() {
	 document.location.href = _context + '/cas/rateDesriptionSearch.do';
});

var fromPage="";

//Initial Request coming from Rate To Rate lending Screen
if(getParameterByName("grpType") !="" 
	&& getParameterByName("srcTariff") !="" 
		&& getParameterByName("grpName") !="" 
			&& getParameterByName("itemName") !=""
				&& getParameterByName("rateDescId") !=""){
	fromPage="rateToRate";
	
}
$("#GROUP_TYPE").attr('size',24);
$("#SOURCE_TARIFF").attr('size',8);
$("#GROUP_NAME").attr('size',8);
$("#DESCRIPTION").attr('size',134);
$("#RATE_BASIS").attr('size',15);
$("#RD_EFF_DATE").attr('size',8);
$("#RTR_TYPE").attr('size',12);


$("#RD_EXP_DATE").attr('size',3);
$("#EQUIP_RESULT").attr('size',10);

$("#ITEM_NAME").attr('size',8);



//Request coming After search performed for Rate to Rate links.i.e. values already set in scope

/*if(document.getElementById('GROUP_TYPE').value!=""
	&& document.getElementById('SOURCE_TARIFF').value!=""
		&&document.getElementById('GROUP_NAME').value!=""
			&&document.getElementById('ITEM_NAME').value!=""
				&&document.getElementById('RD_ID').value!=""){//Returned from search action
	fromPage="searchAction";
	
}*/

//Check for Valid URL
/*if(fromPage!="rateDescription" && fromPage!="searchAction"){	
	alert('UnAuthorized Access for Rate to Rate Link Page. Redirecting to Rate Description Screen !');	
	document.location.href = _context +'cas/rateDesriptionSearch.do';
}*/



//Setting Label fields value from initial request from rate to rate screen
if(fromPage=="rateToRate"){


document.getElementById('GROUP_TYPE').value=getParameterByName("grpType");
document.getElementById('SOURCE_TARIFF').value =getParameterByName("srcTariff");
document.getElementById('GROUP_NAME').value =getParameterByName("grpName");
document.getElementById('ITEM_NAME').value =getParameterByName("itemName");
document.getElementById('DESCRIPTION').value =getParameterByName("description");
document.getElementById('RATE_BASIS').value =getParameterByName("rateBasis");
document.getElementById('RD_ID').value =getParameterByName("rateDescId");
document.getElementById('AMOUNT').value =getParameterByName("amount");
document.getElementById('RD_EFF_DATE').value =getParameterByName("effDateRD");
document.getElementById('RD_EXP_DATE').value =getParameterByName("expDateRD");
document.getElementById('EQUIP_RESULT').value =getParameterByName("equipment");
document.getElementById('CITY_CODE').value = getParameterByName("city");
var rtr =getParameterByName("rtrFlag");
if(rtr == 'G') document.getElementById('RTR_TYPE').value='GREATER-OF';
else if(rtr == 'L') document.getElementById('RTR_TYPE').value='LESSER-OF';
else document.getElementById('RTR_TYPE').value='ALL';



	

	
}


//Set the RTR Type dropdown Value and disable it if RTR Links available.
	

//setting style for Disabled Fields.
setStyleForDisabledFields();



// additional fields

$('#displaydiv').after(
		'<br/>' +
		'<div class="span-24  " style="width:980px;" > <fieldset >'+
		'<legend class="content-title">Select Rates to be Linked </legend>'+
		'<div   id="showFields" >' +	
		'<table >' +		
		'<tr>' +
		 '<td><label class="span-3 label">Group Type*:</label>'
		+ '<input  size="3" id="grpTypeD" type="text" style="border-color: #ffffff;" value="" name="grpTypeD"  ></td>' +
		 '<td><label class="span-3 label">Source Tariff:</label><input size="6" id="srcTariffD" type="text" value="" name="srcTariffD" ></td>' +
		 '<td><label class="span-3 label">Group Name:</label><input size="6" id="grpNameD" type="text" value="" name="grpNameD" ></td>' +
		 '<td><label class="span-3 label">Item Name:</label><input size="8" id="itmNameD" type="text" value="" name="itmNameD" ></td>' +
		'</tr>' +		
	  	'</table>' +
	  	'</div>'+
	  	'</fieldset> </div>'
  	);

//div for "Search" and "Clear" buttons
$('#showFields').after(
		'<div  id="showCusButtons">' +	
		'<table>' +
		'<br></br>' +
		'<tr>' +
		  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
		  '<td><input type="button" onclick="javascript:resetForm();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
		'</tr>' +
	  	'</table>' +
	  	'</div>'	
  	);

// hide CAS generated "Search" and "Clear" Button
$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();



//set formating and values for search fields by using CAS dummy fields.
setDummyFieldsforSearchCriteria(fromPage);

//Autocomplete for search criterias.

var grpTypeCode= getGrpTypeCode($('#GROUP_TYPE').val());


$('#srcTariffD').gatesAutocomplete({
	source:_context+'/cas/autocomplete.do',
	extraParams: {
		 		 method: 'searchTariffSource',
		 		 searchType: '11',
		 		 groupType:  function() { return grpTypeCode; }
 }
,
	 formatItem: function(data) {
	 		 return data.name;
	 },
	 formatResult: function(data) {
		 dataName=data.name;
	 	 $('input[name="grpId"]').val(data.id);
	 		 return data.name;
	 },
	 select: function(data) {
	 		 $('#srcTariffD').val(data.id);	
	 		 $('input[name="grpId"]').val(data.id);
		 		if(grpTypeCode=="01"){
		 			 $('#grpNameD').val(data.name);
		 		 }
	 }		 
});		 
//Blurr the data for invalid group Id
$('#srcTariffD').change(function(){
		if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
       	$("#srcTariffD").val("ALL"); 
       	$("#grpNameD").val("ALL"); 
   	}
		else{
			$("#srcTariffD").val(dataName); 
	 		 if(grpTypeCode=="01"){
	 			 $('#grpNameD').val(dataName);
	 		 }
			$('input[name="grpId"]').val("");
		}
   }); 

$('#srcTariffD').focus(function() {
	 if($('#srcTariffD').val() == 'ALL')
		 {
		 $('#srcTariffD').val("");
		 }
	});
$('#srcTariffD').focusout(function() {
	 if($('#srcTariffD').val() == '')
	 {
		 $('#srcTariffD').val("ALL");
	 }
});
$('#grpNameD').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
			 		 		 method: 'searchGroupName',
			 		 		 searchType: '10',
			 		 		 groupType:  function () { return grpTypeCode; },
			 		 		 sourceTariff:  function () { return $('#srcTariffD').val(); }				 		 		 		 
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
		 $('#grpNameD').val(data.id);
	 		$('input[name="grpId"]').val(data.id);
	 }		 
});		

//Blurr the data for invalid group Id
$('#grpNameD').change(function(){
		if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
       	$("#grpNameD").val("ALL"); 
   	}
		else{
			$("#grpNameD").val(dataName); 
			$('input[name="grpId"]').val("");
		}
   }); 
$('#grpNameD').focus(function() {
	 if($('#grpNameD').val() == 'ALL')
		 {
		 $('#grpNameD').val("");
		 }
	});
$('#grpNameD').focusout(function() {
	 if($('#grpNameD').val() == '')
	 {
		 $('#grpNameD').val("ALL");
	 }
});
$('#itmNameD').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	extraParams: {
		 	 method: 'searchItemName',
		     searchType: '43',
		 	 groupType:  function () { return grpTypeCode; },
		 	 sourceTariff:  function () { return $('#srcTariffD').val(); },
		 	 groupName:  function () { return $('#grpNameD').val(); }		
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
	 		 $('#itmNameD').val(data.id);	
	 		$('input[name="itemId"]').val(data.id);		
	 }		 
});		 

//Blurr the data for invalid item Id
$('#itmNameD').change(function(){
	if($('input[name="itemId"]').val()==null || $('input[name="itemId"]').val()==""){				
	$("#itmNameD").val("ALL");       	
  }		
	else{
		$("#itmNameD").val(dataName); 
		$('input[name="itemId"]').val("");
	}
}); 	
$('#itmNameD').focus(function() {
	 if($('itmNameD').val() == 'ALL')
		 {
		 $('#itmNameD').val("");
		 }
	});
$('#itmNameD').focusout(function() {
	 if($('#itmNameD').val() == '')
	 {
		 $('#itmNameD').val("ALL");
	 }
});




//code to bind pop up search
$('#grpNameD').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
$('#srcTariffD').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
$('#itmNameD').gatesPopUpSearch({func:function() {ItemPopupSearch()}}); 
$('#casQuickSearch th:nth-child(1):nth-child(1)').append('<input type="checkbox" id="chkbox" name="chkbox" class="fieldText">'); 
$('#chkbox').bind('change', function () {
	var anyOneChecked=false;
	var checkedStatus = this.checked;
    $("#casQuickSearch td:nth-child(1) input:checkbox").each(function() {
        this.checked = checkedStatus;
    });
    
    var _bkid = '';
	 $("#casQuickSearch :checkbox:checked").each(function(index) {
		  var bookingId = $(this).val().split(',')[2];
			 if(_bkid!= '')
				 _bkid += ',';
			 else
				 _bkid = $(this).val();
			 if(bookingId!=null && bookingId != '' && bookingId !='undefined')
			 	_bkid +=bookingId;
			 anyOneChecked=true;				
		 
	 }); 
	 var grpTyp=$('#in_group_type_code').val();
	 
});  
$("#casQuickSearch td:nth-child(1) :checkbox").click(function() {
	
	var checkedStatus = this.checked;
	if(checkedStatus == false)
		$("#chkbox").removeAttr("checked");
	
	 var count = 0;
	 var _bkid = '';
	 $("#casQuickSearch td:nth-child(1) :checkbox:checked").each(function(index) {
		
		  var bookingId = $(this).val().split(',')[2];
			 if(_bkid!= '')
				 _bkid += ',';
			 if(bookingId!=null && bookingId != '' && bookingId !='undefined')
			 	_bkid +=bookingId;
			 count++;		
		 
	 });
	 if($('#casQuickSearch tbody tr').length == count)
		 {
		  $('#chkbox').attr('checked','checked');
		 }
	
}); 



});
	
//set formating and values for search fields by using CAS dummy fields.
function setDummyFieldsforSearchCriteria( fromPage){
	
	document.getElementById('grpTypeD').readOnly=true;
	document.getElementById("grpTypeD").style.borderColor = "#FFFFFF";
	document.getElementById("grpTypeD").style.background="#F3F3F3";
	document.getElementById("grpTypeD").style.fontWeight='bold';
	if(fromPage=="rateToRate"){
		document.getElementById("grpTypeD").value=getParameterByName("grpType");
		document.getElementById('srcTariffD').value =getParameterByName("srcTariff");
		document.getElementById('grpNameD').value =getParameterByName("grpName");
		document.getElementById('itmNameD').value =getParameterByName("itemName");
		
		//Call search with Default Parameters if request coming from RD page.

		searchValue();
		
	}else{		
		document.getElementById("grpTypeD").value=$('#GROUP_TYPE').val();
		document.getElementById('srcTariffD').value =$('#SRC_TARIFF_D').val();
		document.getElementById('grpNameD').value =$('#GRP_NAME_D').val();
		document.getElementById('itmNameD').value =$('#ITM_NAME_D').val();
	}
	
}
function setStyleForDisabledFields(){
	
	//Set Read Only attribute to format CAS generated components
	document.getElementById('GROUP_TYPE').readOnly=true;
	document.getElementById('SOURCE_TARIFF').readOnly=true;
	document.getElementById('GROUP_NAME').readOnly=true;
	document.getElementById('ITEM_NAME').readOnly=true;
	document.getElementById('DESCRIPTION').readOnly=true;
	document.getElementById('RATE_BASIS').readOnly=true;
	document.getElementById('RD_ID').readOnly=true;
	document.getElementById('AMOUNT').readOnly=true;
	document.getElementById('RD_EFF_DATE').readOnly=true;
	document.getElementById('RD_EXP_DATE').readOnly=true;
	document.getElementById('EQUIP_RESULT').readOnly=true;
	document.getElementById('CITY_CODE').readOnly=true;
	document.getElementById('RTR_TYPE').readOnly=true;
	
	
	//Set required Style attributes to format CAS generated components
	document.getElementById("GROUP_TYPE").style.borderColor = "#CFE2F3";
	document.getElementById("SOURCE_TARIFF").style.borderColor = "#CFE2F3";
	document.getElementById("GROUP_NAME").style.borderColor = "#CFE2F3";
	document.getElementById("ITEM_NAME").style.borderColor = "#CFE2F3";
	document.getElementById("DESCRIPTION").style.borderColor = "#CFE2F3";
	document.getElementById("RATE_BASIS").style.borderColor = "#CFE2F3";
	document.getElementById("RD_ID").style.borderColor = "#CFE2F3";
	document.getElementById("AMOUNT").style.borderColor = "#CFE2F3";
	document.getElementById("RD_EFF_DATE").style.borderColor = "#CFE2F3";
	document.getElementById("RD_EXP_DATE").style.borderColor = "#CFE2F3";
	document.getElementById("EQUIP_RESULT").style.borderColor = "#CFE2F3";
	document.getElementById("CITY_CODE").style.borderColor = "#CFE2F3";
	document.getElementById("RTR_TYPE").style.borderColor = "#CFE2F3";
		
		
	document.getElementById("GROUP_TYPE").style.background="#CFE2F3";
	document.getElementById("SOURCE_TARIFF").style.background="#CFE2F3";
	document.getElementById("GROUP_NAME").style.background="#CFE2F3";
	document.getElementById("ITEM_NAME").style.background="#CFE2F3";
	document.getElementById("DESCRIPTION").style.background="#CFE2F3";
	document.getElementById("RATE_BASIS").style.background="#CFE2F3";
	document.getElementById("RD_ID").style.background="#CFE2F3";
	document.getElementById("AMOUNT").style.background="#CFE2F3";
	document.getElementById("RD_EFF_DATE").style.background="#CFE2F3";
	document.getElementById("RD_EXP_DATE").style.background="#CFE2F3";
	document.getElementById("EQUIP_RESULT").style.background="#CFE2F3";
	document.getElementById("CITY_CODE").style.background="#CFE2F3";
	document.getElementById("RTR_TYPE").style.background="#CFE2F3";
		
	document.getElementById("GROUP_TYPE").style.fontWeight='normal';
	document.getElementById("SOURCE_TARIFF").style.fontWeight='normal';
	document.getElementById("GROUP_NAME").style.fontWeight='normal';
	document.getElementById("ITEM_NAME").style.fontWeight='normal';
	document.getElementById("DESCRIPTION").style.fontWeight='normal';
	document.getElementById("RATE_BASIS").style.fontWeight='normal';
	document.getElementById("RD_ID").style.fontWeight='normal';
	document.getElementById("AMOUNT").style.fontWeight='normal';
	document.getElementById("RD_EFF_DATE").style.fontWeight='normal';
	document.getElementById("RD_EXP_DATE").style.fontWeight='normal';
	document.getElementById("EQUIP_RESULT").style.fontWeight='normal';
	document.getElementById("CITY_CODE").style.fontWeight='normal';
	document.getElementById("RTR_TYPE").style.fontWeight='normal';
	
	//Hide the RD primary key CAS field
	
	$("#DESCRIPTION").parent("td").attr("colspan","10");
	$("#RATE_BASIS").parent("td").attr("colspan","4");
	$("#RD_EXP_DATE").parent("td").attr("colspan","2");
	$("#GROUP_NAME").parent("td").attr("colspan","4");
	$('td.dataField:contains("RD_ID")').css('display','none');
	$("#RD_ID").parent("td").hide();
	
	//hide dummy fields generated by CAS for search criteria.
	
	$('td.dataField:contains("SRC_TARIFF_D")').css('display','none');
	$("#SRC_TARIFF_D").parent("td").css('display','none');
	
	$('td.dataField:contains("GRP_NAME_D")').css('display','none');
	$("#GRP_NAME_D").parent("td").css('display','none');
	
	$('td.dataField:contains("ITM_NAME_D")').css('display','none');
	$("#ITM_NAME_D").parent("td").css('display','none');
	
	$('td.dataField:contains("Amount")').css('display','none');
	$('td.dataField:contains("RD_ID")').css('display','none');
	$("#RD_ID").parent("td").css('display','none');
	$('td.dataField:contains("Rate:")').css('display','none');
	$("#AMOUNT").parent("td").css('display','none');
	$('td.dataField:contains("Rate Expiration")').css('display','none');
	$("#RD_EXP_DATE").parent("td").css('display','none');
	$('td.dataField:contains("Expiration")').css('display','none');
	$("#RD_EXP_DATE").parent("td").css('display','none');
	//$('td.dataField:contains("RTR_EXP_DATE2")').hide();
	//$("#RTR_EXP_DATE").parent("td").hide();
	$('td.dataField:contains("City")').css('display','none');
	$("#CITY_CODE").parent("td").css('display','none');
	
}

function getGrpTypeCode(grpLabel){
	
	if(grpLabel=="FRT-FREIGHT"){
		return "01";
	}else if (grpLabel=="WFG-WHARFAGE"){
		return "02";
	}else if (grpLabel=="DRA-DRAYAGE"){
		return "03";
	}else if (grpLabel=="RDV-REV DIV"){
		return "04";
	}else if (grpLabel=="MSH-MIN SHMT"){
		return "05";
	}else if (grpLabel=="MEQ-MIN EQPT"){
		return "06";
	}else if (grpLabel=="ACC-ACCESSORIAL GROUP"){
		return "07";
	}
	
}	

function resetForm(){
	//$('#displaybase').remove();
	$('#resultdiv').hide();

	document.getElementById('srcTariffD').value ="ALL";
	document.getElementById('grpNameD').value ="ALL";
	document.getElementById('itmNameD').value ="ALL";
}

function searchValue(){
	
	//set the dummy CAS fields with the values defined by user in custom fields.
	document.getElementById('SRC_TARIFF_D').value=document.getElementById('srcTariffD').value;
	document.getElementById('GRP_NAME_D').value=document.getElementById('grpNameD').value;
	document.getElementById('ITM_NAME_D').value=document.getElementById('itmNameD').value;
	
		
	//submit the form for CAS search to custom Action
	var frm = document.forms["rateToRateSelListForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	return true;
	
}

function loadRateDescToDefineLinkage(){
	var searchLength = document.rateToRateSelListForm.searchInput.length;
	var rateDescIdHdr=document.getElementById('RD_ID').value;
	var rateDescsToDefLinkage="";
	
	var rtr = $("#RTR_TYPE").val();
	if(rtr == 'GREATER-OF') rtr='G';
	else if(rtr == 'LESSER-OF') rtr='L';
	else rtr='ALL';
	
	var rateToRateType = rtr;
	
	var effDate=$("#RD_EFF_DATE").val();
	var expDate=$("#RD_EXP_DATE").val();
	
	var mode="Add";
	var elements = $("input[type=checkbox][name=searchInput]");
	var anyOneChecked=false;
	var checkedCount=0;
		//alert(''+searchLength);
	jQuery.each(elements, function(element) {
    	var checked = $(this).attr('checked');
    	
		if(checked){
			checkedCount=checkedCount+1;
			
			//alert('element'+element==0 );
			
			if(rateDescsToDefLinkage==""){
				if(element==0 && typeof(searchLength)=="undefined"){
					//alert('inside');
					rateDescsToDefLinkage=document.rateToRateSelListForm.searchInput.value;
				}else{
					rateDescsToDefLinkage=document.rateToRateSelListForm.searchInput[element].value;
				}
			}else{
				if(element==0 && typeof(searchLength)=="undefined"){
					rateDescsToDefLinkage = rateDescsToDefLinkage  + ","+ document.rateToRateSelListForm.searchInput.value;
				}else{
					rateDescsToDefLinkage = rateDescsToDefLinkage  + ","+ document.rateToRateSelListForm.searchInput[element].value;
				}
			}
			anyOneChecked=true;	
		}
	});

	$.ajax({
		   type: "POST",
		   url: _context +"/tm/traiffRateToRate/isExistsRateLinks?", 
		   data: "rateDescIdHdr="+ rateDescIdHdr,
		   success: function(msg){				
			   if(! anyOneChecked ){
					 alert('Please select at least one Rate description from Select List to define Linkage with header record !');
					 return;
				}else if(msg=="Error") {
				   alert('Error Occured in Business Validation. Please try again !');
				   return;
				}else if(msg=="NotExists" ){
					if(checkedCount=="1"){
						  rateDescsToDefLinkage=rateDescsToDefLinkage;
						}
					else{
							rateDescsToDefLinkage=rateDescIdHdr+','+rateDescsToDefLinkage;
						}
					
					document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkAdd?rateDescIdHdr='+ rateDescIdHdr +"&rateDescIdsSel="+rateDescsToDefLinkage+"&rateToRateType="+rateToRateType+"&mode="+mode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ; 
					
					
				}else{//msg=="Exists" 
					if(checkedCount=="1"){
						  rateDescsToDefLinkage=rateDescsToDefLinkage;
						}
					else{
							rateDescsToDefLinkage=rateDescIdHdr+','+rateDescsToDefLinkage;
						}
					document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkAdd?rateDescIdHdr='+ rateDescIdHdr +"&rateDescIdsSel="+rateDescsToDefLinkage+"&rateToRateType="+rateToRateType+"&mode="+mode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate  ;				
					
				}
		   }
	 });
}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+getGrpTypeCode($('#GROUP_TYPE').val())+"&sourceTariff="+$('#srcTariffD').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+getGrpTypeCode($('#GROUP_TYPE').val())+"&sourceTariff="+$('#srcTariffD').val()+"&grpName="+$('#grpNameD').val();
var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}

function ItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+getGrpTypeCode($('#GROUP_TYPE').val())+"&sourceTariff="+$('#srcTariffD').val()+"&grpName="+$('#grpNameD').val()+"&itemName="+$('#itmNameD').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#srcTariffD').val(values[0]);
  	
  	$('#grpNameD').val("");
  	$('#itmNameD').val("");
  	
	if(getGrpTypeCode($('#GROUP_TYPE').val())=="01"){
		 $('#grpNameD').val(values[0]);
	 }
  	
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#grpNameD').val(values[0]);
  	
  	$('#itmNameD').val("");
}
function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	$('#itmNameD').val(values[0]); 
		
	}
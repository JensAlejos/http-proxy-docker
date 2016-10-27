$(document).ready(

function() {

replaceWithCheckBox($("#RTR_PK"),$("#RTR_PK").val());

$('form[name="rateToRateForm"]').formatCasSearchForm({ 
hasSavedSearchFeature: false, 
customActions: [ ]
});
$("#RTR_PK").click(function() {
	if($('#RTR_PK').attr('checked')){
		 document.getElementById('RTR_PK').value="Y";
	}else{
		document.getElementById('RTR_PK').value="ALL";
	}
});
var validComb=false;
var grpType = document.getElementById('GROUP_TYPE').value;
var grpName = document.getElementById('GROUP_NAME').value;
var srcTariff = document.getElementById('SOURCE_TARIFF').value;
var itemName=document.getElementById('ITEM_NAME').value;
if(grpType!=null && grpType!="" && grpType!="ALL"
	&& srcTariff!=null && srcTariff!="" && srcTariff!="ALL"
		&& itemName!=null && itemName!="" && itemName!="ALL"){
	    
	validComb=true;
}	

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
if(document.rateToRateForm.delete1.value != "delete1")
{
	$('#msgDiv').hide();
}
if(document.rateToRateForm.delete1.value == "delete1")
{
	//$("#delete_success").dialog("open");
var messageContent= "Selected Rate Link(s) Deleted SuccessFully.";
$('#msgDiv').html(messageContent)
	//alert("Record has been deleted successfully.");
}
if(!validComb ){//first page load
	
	$("#RTR_PK").attr("checked", true);
	document.getElementById('RTR_PK').value="Y";
}

if($("#RTR_PK").val()=="ALL"){
    $("#RTR_PK").attr("checked", false);
}
else{
    $("#RTR_PK").attr("checked", true);
}	
$('#cancel').click(function() {
	 document.location.href = _context + '/cas/rateDesriptionSearch.do?'+'&exitfrom='+'exit';
});

var fromPage="";

//Initial Request coming from Rate Description Screen
if(getParameterByName("grpType") !="" 
	&& getParameterByName("srcTariff") !="" 
		&& getParameterByName("grpName") !="" 
			&& getParameterByName("itemName") !=""
				&& getParameterByName("rateDescId") !=""){
	fromPage="rateDescription";
	
}
else if(($(document).getUrlParam("from")) != null && ($(document).getUrlParam("from")) == "addLinkage"){
	var frm = document.forms["rateToRateForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
}
$("#GROUP_TYPE").attr('size',24);
$("#SOURCE_TARIFF").attr('size',8);
$("#GROUP_NAME").attr('size',8);
$("#DESCRIPTION").attr('size',135);
$("#RATE_BASIS").attr('size',15);
$("#RD_EFF_DATE").attr('size',8);
$("#RTR_TYPE").attr("style","width: 150px");


$("#RD_EXP_DATE").attr('size',3);
$("#EQUIP_RESULT").attr('size',3);
//D026762
$("#ITEM_NAME").attr('size',8);

$("#RTR_TYPE").attr("disabled","disabled");

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


//Setting Label fields value from initial request from rate description screen
if(fromPage=="rateDescription"){

setGrpTypeLabel();
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
/*document.getElementById('RTR_PK').checked = true;*/
if (($(document).getUrlParam("currentFuture")) != null) {
	if(($(document).getUrlParam("currentFuture")) == "Y"){
		$("#RTR_PK").attr("checked", true);
		document.getElementById('RTR_PK').value="Y";
	}
	else{
		$("#RTR_PK").attr("checked", false);
		document.getElementById('RTR_PK').value="ALL";
	}
}

// Call search with Default Parameters if request coming from RD page.

var frm = document.forms["rateToRateForm"];
frm.method.value="show";
postMethod('search',frm.method);
}


//Set the RTR Type dropdown Value and disable it if RTR Links available.

var rowObject= $("#casQuickSearch").find("tr:gt(0)");

var rtrType=rowObject.children('td:nth-child(3)').html();

if(rtrType!="ALL" && rtrType!=null){

document.getElementById('RTR_TYPE').value=rtrType;//D033267
$("#RTR_TYPE").removeAttr("disabled");
$("#RTR_TYPE").attr("disabled","disabled");
}
else
{
	document.getElementById('RTR_TYPE').value=rtrType;
	$("#RTR_TYPE").removeAttr("disabled");
}

	

//setting style for Disabled Fields.
setStyleForDisabledFields();

//div for "Search" and "Clear" buttons
$('.searchTable').after(
		'<div id="showCusButtons">' +	
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
$('#showCusButtons').parent().parent().parent().children('tr:nth-child(4)').hide();

});
	

function setGrpTypeLabel(){
	var grpId=getParameterByName("grpType");
	if(grpId=="01"){
		document.getElementById('GROUP_TYPE').value ="FRT-FREIGHT";
	}else if (grpId=="02"){
		document.getElementById('GROUP_TYPE').value ="WFG-WHARFAGE";
	}else if (grpId=="03"){
		document.getElementById('GROUP_TYPE').value ="DRA-DRAYAGE";
	}else if (grpId=="04"){
		document.getElementById('GROUP_TYPE').value ="RDV-REV DIV";
	}else if (grpId=="05"){
		document.getElementById('GROUP_TYPE').value ="MSH-MIN SHMT";
	}else if (grpId=="06"){
		document.getElementById('GROUP_TYPE').value ="MEQ-MIN EQPT";
	}else if (grpId=="07"){
		document.getElementById('GROUP_TYPE').value ="ACC-ACCESSORIAL GROUP";
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
	
	//Hide the RD primary key CAS field
	$('td.dataField:contains("Description")').attr("colspan","0");
	$("#DESCRIPTION").parent("td").attr("colspan","9");
	$("#RATE_BASIS").parent("td").attr("colspan","0");
	$("#RD_EXP_DATE").parent("td").attr("colspan","1");
	$("#GROUP_NAME").parent("td").attr("colspan","0");
	
/*	$("#GROUP_TYPE").parent("td").attr("colspan","1");*/
	$('td.dataField:contains("RD_ID")').css('display','none');
	$("#RD_ID").parent("td").css('display','none');
	$('td.dataField:contains("Rate:")').css('display','none');
	$("#AMOUNT").parent("td").css('display','none');
	$('td.dataField:contains("Rate Expiration")').css('display','none');
	$("#RD_EXP_DATE").parent("td").css('display','none');
	//$('td.dataField:contains("RTR_EXP_DATE2")').hide();
	//$("#RTR_EXP_DATE").parent("td").hide();
	$('td.dataField:contains("City")').css('display','none');
	$("#CITY_CODE").parent("td").css('display','none');
	
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




//Delete Rate To rate Links
function deleteRateToRateLinks() {
	var searchLength = document.rateToRateForm.searchInput.length;
	var elements = $("input[type=checkbox][name=searchInput]");
	var anyOneChecked = false;
	var idTodel = "";
	var elemCount = 0;
	var checkedCount = 0;
	var rateDescId = document.getElementById('RD_ID').value;
	var grpType =document.getElementById('SOURCE_TARIFF').value;
	var srcTariff =document.getElementById('GROUP_NAME').value;
	var grpName =document.getElementById('GROUP_NAME').value;
	var itemName =document.getElementById('ITEM_NAME').value;
	var description =document.getElementById('DESCRIPTION').value;
	var rateBasis =document.getElementById('RATE_BASIS').value;
	var amount =document.getElementById('AMOUNT').value;
	var effDateRD =document.getElementById('RD_EFF_DATE').value;
	var expDateRD =document.getElementById('RD_EXP_DATE').value;
	var equipment =document.getElementById('EQUIP_RESULT').value;
	var city =document.getElementById('CITY_CODE').value ;
	var rtrFlag =document.getElementById('RTR_TYPE').value ;

	var currentFuture = document.getElementById('RTR_PK').value;
	jQuery.each(elements, function(element) {
		elemCount = elemCount + 1;
		var checked = $(this).attr('checked');

		if (checked) {
			checkedCount = checkedCount + 1;
			anyOneChecked = true;
			if(idTodel==""){
				if(element==0 && typeof(searchLength)=="undefined"){
					idTodel=document.rateToRateForm.searchInput.value;
				}else{
					idTodel=document.rateToRateForm.searchInput[element].value;
				}
			}else{
				if(element==0 && typeof(searchLength)=="undefined"){
					idTodel = idTodel  + ","+ document.rateToRateForm.searchInput.value;
				}else{
					idTodel = idTodel  + ","+ document.rateToRateForm.searchInput[element].value;
				}
			}
			
		}
	});

	/*alert('anyOneChecked' + anyOneChecked + 'elemCount' + elemCount
			+ 'checkedCount' + checkedCount + 'idTodel' + idTodel);*/

	if (!anyOneChecked) {
		alert("No Rate Links Selected for Deletion!!");
		return;
	}

	/*
	 * BR8. If a Rate-to-Rate set contains only two Rate-Descs, deleting one of
	 * those linkages will cause the linkages for both Rate-Descs to be deleted.
	 * 
	 */
	if (elemCount == 2 && checkedCount < 2) {
		alert('Only two Rate descriptions remaining in the set. Please select both Rate descriptions to remove linkage.');
		return;
	}

	var r = confirm("Do you really want to delete the selected Rate Link(s)?");
	if (r == true) {
		$.ajax({
			type : "POST",
			url : _context + "/tm/traiffRateToRate/deleteRateToRateLinks?",
			data : "rateLinkstoDelete=" + idTodel,
			success : function(msg) {
				if (msg == "Success") {
					//alert('Selected Rate Link(s) Deleted SuccessFully.');
					//postMethod('search',document.forms["rateToRateForm"].method);
					document.location.href =_context + "/cas/rateToRateSearch.do?delete1=delete1"+'&rateDescId='+rateDescId+'&grpType='+grpType+"&srcTariff="+srcTariff+"&grpName="+grpName+"&itemName="+itemName+"&description="+description
	    +"&rateBasis="+rateBasis+"&amount="+amount+"&effDateRD="+effDateRD+"&expDateRD="+expDateRD+"&equipment="+equipment+
	    "&city="+city+"&rtrFlag="+rtrFlag+"&currentFuture="+currentFuture;
				} else {
					alert('Error in Rate Link(s) Deletion.');
				}
			}
		});
	} else {
		return;
	}

}


// Add New rate Description
function addRateToRateLink() {
  var grpType = document.getElementById('GROUP_TYPE').value;
  var grpName = document.getElementById('GROUP_NAME').value;
  var srcTariff = document.getElementById('SOURCE_TARIFF').value;
  var itemName=document.getElementById('ITEM_NAME').value;
  var rateDescId = document.getElementById('RD_ID').value;
  var rtrType = document.getElementById('RTR_TYPE').value;
  
  if(grpType==null || grpType=="" 
  	||grpName==null || grpName==""||grpName=="ALL"
  	  || srcTariff==null || srcTariff==""||srcTariff=="ALL"
  		  || itemName==null || itemName=="" || itemName=="ALL"){  	    
  	   alert('Invalid Request. Not a valid Group and Item combination!'); 
		   return;
  }
 
  if(rateDescId==null ||rateDescId==""){
 	   alert('Invalid Request.Rate description id not available in context to define Rate Link!'); 
		   return;
  }

  if(rtrType=="ALL" ){
	  alert('Please select valid Rate to Rate type to define Rate Link!'); 
	   return;
  }
   

  // Encode added as % is not decoded in cas_search_rtr_select_list.js for Defect D030972
	var description = encodeURIComponent(document.getElementById('DESCRIPTION').value);
	var rateBasis = document.getElementById('RATE_BASIS').value;
	var amount = document.getElementById('AMOUNT').value;
	var effDateRD = document.getElementById('RD_EFF_DATE').value;
	var expDateRD = document.getElementById('RD_EXP_DATE').value;
	var equipment = document.getElementById('EQUIP_RESULT').value;
	var city = document.getElementById('CITY_CODE').value;
	var rtrFlag = document.getElementById('RTR_TYPE').value;	
	
	//Create DATA string for HTTP GET
  data="rateDescId="+rateDescId+"&grpType="+grpType+"&srcTariff="+srcTariff+"&grpName="+grpName+"&itemName="+itemName+"&description="+description
  +"&rateBasis="+rateBasis+"&amount="+amount+"&effDateRD="+effDateRD+"&expDateRD="+expDateRD+"&equipment="+equipment+
  "&city="+city+"&rtrFlag="+rtrFlag;

  //GET Request to RTR link search CAS page
  document.location.href = _context +'/cas/rateToRateSelectListSearch.do?'+ data ;
}

function resetForm(){
	//$('#displaybase').remove();
	$('#resultdiv').hide();
	//document.getElementById('RTR_TYPE').value ="ALL";
	$('#RTR_PK').attr("checked",true);
	 $('#RTR_PK').val('Y');
}

function searchValue(){
	//submit the form for CAS search to custom Action
	var frm = document.forms["rateToRateForm"];
	frm.method.value="show";
	postMethod('search',frm.method);
	return true;
	
}
function loadRateLinkageDetails(rateLinkId) {
	var rateDescId=document.getElementById('RD_ID').value;
	var searchLength = document.rateToRateForm.searchInput.length;
	var rateLinksToUpdate = "";
	var mode="Update";
	var effDate=$("#RD_EFF_DATE").val();
	var expDate=$("#RD_EXP_DATE").val();
	 var rateToRateType = $('#rateToRateType').val();
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.rateToRateForm.searchInput[i].checked;
			searchInp = document.rateToRateForm.searchInput[i].value;
		} else {
			checked = document.rateToRateForm.searchInput.checked;
			searchInp = document.rateToRateForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			rateLinksToUpdate = rateLinksToUpdate  + ","+ searchInp;

		}
	}
 
	if (selCount == 0) {
		//alert('rateDescId'+rateDescId);
		document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkUpdate?rateDescId='+ rateDescId +"&rateLinkIds="+rateLinkId+"&rateToRateType="+rateToRateType+"&mode="+mode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate  ;
	} else {
	//	alert('rateDescToUpdate'+rateDescToUpdate);
		document.location.href = _context +'/tm/traiffRateToRate/showFormRTRLinkUpdate?rateDescId='+ rateDescId +"&rateLinkIds="+rateLinksToUpdate +"&rateToRateType="+rateToRateType+"&mode="+mode+"&effectiveDateParent="+effDate+"&expirationDateParent="+expDate ;
	}
}


function replaceWithCheckBox($obj, checkedValue) {

	 if ($obj.length == 0) return; 
	 var $elemx = $(document.createElement("input"));
	 var name = $obj[0].name;
	 var id = $obj[0].id;
	 var value = $obj[0].value;
	 var val = (value == checkedValue);
	 $elemx.attr({type:'checkbox',id:id,name:name,checked:true,defaultChecked:val,value:checkedValue});
	 $obj.replaceWith($elemx); 
}





var provinces = "";	
$(document).ready(function() {

	if($('#organizationAddressId').val()=="")
	{
		//alert('if '+$('#organizationAddressId').val()==null);
		$('#isActive1').attr('disabled','disabled');
	}
	else
	{
		//alert('else ');
		$('#isActive1').removeAttr('disabled');
	}
	
	evaluateForm();
	
	if($('#countryName').val() !=null && (new String($('#countryName').val().toLowerCase())=="ca" || new String($('#countryName').val().toLowerCase()).ignoreCase=="canada")){
		provinces=$('#stateCode').val() + "-" + $('#provinceName').val();
	}
	
	$('#add_next_addr').click(
			function()
			{
				document.location.href=_context+
				'/organization/address/add?actionPerformed=add&orgId='+$('#organizationId').val()+"&navigation=addNextAdd";
			});

	
	$('#saveAddress').click(function(){
		if($("#organizationAddressForm").validationEngine('validate') && isValidPhoneFields()){
			
			$("#organizationAddressForm").attr('action','addUpdateOrganizationAddress');
			$('#organizationActive').removeAttr('disabled');
			$('#isActive1').removeAttr('disabled');
        	$("#organizationAddressForm").submit(); 
        	
    	}else{
    		return false;
    	}
    });
	
	$('#org_ap_delete').click(function(){
			$("#actionPerformed").val("delete");
			$("#remarks").removeClass('validate[required]');
			document.organizationAddressForm.action='delete';
			document.organizationAddressForm.submit();
    });
	
	$('#org_address').click(function(){
		if($("#organizationAddressId").val()!= null && $("#organizationAddressId").val()!= "")
		{
			document.location.href='../../addressRole/edit?addressId='+$("#organizationAddressId").val();
    	}else{
    		document.location.href='../../addressRole/viewAdd';
    	}
    });
	
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
	$('#organizationNameHolder').gatesAutocomplete({
		source: url,
		mustMatch:true,
		formatItem: function(data) {
			return data.name;
		},
		formatResult: function(data) {
			return data.name;
		},
		select: function(data) {
			$('#organizationNameHolder').val(data.name+ "-" + data.code);
			$('#organizationName').val(data.name+ "-" + data.code);
			
			$('#organizationId').val(data.id);
			if(data.active=='Y' || data.active=='y')
			{
				$('#organizationActive').attr('checked',true); 
			}
		}
	})
	.change(function() {
		if($('#organizationNameHolder').val()=='')
		{
			$('#organizationId').val('');
		}
	});

	
	// code to bind pop up search
	$('#organizationNameHolder').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch();
		}
	});
	
	$('#organizationNameHolder').blur(function(){
		if($("#organizationId").val()==null || $("#organizationId").val()==""){
        	$("#organizationName").val(""); 
        	$("#organizationNameHolder").val("");  	
    	}
		var split = $('#organizationNameHolder').val().split("-");
		var split1 = $('#organizationName').val().split("-");
		if(split[0]!=split1[0])
		{
			$("#organizationNameHolder").val("");
			$("#organizationId").val("");
			$("#organizationName").val(""); 
		}
    });
	
	$('#zipCode').change(function()
	{
		usZipDisplay();
		//D024850
		if($('#zipCode').val() != null){
		$('#zipCode').val( $.trim($('#zipCode').val().toUpperCase()));
		}
	});
	
	$('#countryName').blur(function()
	{
		usZipDisplay();	
    });
	
	$('#org_workflow_link').click(function(){
		
		if ($('#navigation').val()=="searchAddress" ||$('#navigation').val()=="addNextAdd" )
		   {
		   
		   	document.location.href =_context+'/cas/addressSearch.do';
		   }
		
		else if($('#navigation').val()=="maintainOrg")
			{
				document.location.href =_context+'/organization/findOrganization?id='+$('#organizationId').val();
			}
		else if($('#navigation').val().indexOf("addressRoleId") === 0 )
		{
			document.location.href =_context+'/addressRole/edit?'+$('#navigation').val();
		}
		else
			{
				document.location.href =_context+'/cas/organizationSearch.do';
			}
		
	});
	
	var url = _context +'/organization/address/autoComplete' ; 
		$('#provinceName').gatesAutocomplete({
			source: url ,
			autoSelectFirst:true,
			extraParams:{
				country: function () { return $('#countryName').val(); }
			},
			formatItem: function(item) {
				provinces=""+item.code+"-"+item.name;
				return provinces;
				
			},
			formatResult: function(item) {
				return item.name;
			},
			select: function(item) {
				$('#provinceName').val(item.name);
				$('#stateCode').val(item.code);
				$('#countryName').val("CA");
				provinces=""+item.code+"-"+item.name;
			}
		});	

	$('#countryName').change(function(){
		if(new String($('#countryName').val().toLowerCase())!="ca" && new String($('#countryName').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
		if($('#countryName').val() != null){
			$('#countryName').val( $.trim($('#countryName').val().toUpperCase()));
		}
		
	});
	$('#stateCode').change(function(){
		if(new String($('#countryName').val().toLowerCase())!="ca" && new String($('#countryName').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
	});
	$('#provinceName').change(function(){
		if(new String($('#countryName').val().toLowerCase())!="ca" && new String($('#countryName').val().toLowerCase()).ignoreCase!="canada"){
			provinces = "";
		}
		//D024850					
		if($('#provinceName').val() != null){
					$('#provinceName').val( $.trim($('#provinceName').val().toUpperCase()));
		}	
	});
	
});

function usZipDisplay()
{
	var countryName = $('#countryName').val();
	if(countryName !=null && (new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states"))
	{
		var zipCode = $.trim($("#zipCode").val());
		var split = zipCode.split("-");
		
		if(split.length==1 && zipCode.length>5)
		{
			var  val = zipCode.replace(/(.{5})/g,"$1-");
			$('#zipCode').val(val);
    	}
		if($('#zipCode').val().length>10)
		{
			$('#zipCode').val($('#zipCode').val().substr(0,10));
		}
		else if($('#zipCode').val().length==6)
		{
			$('#zipCode').val($('#zipCode').val().substr(0,5));
		}
	}
}

function evaluateForm()
{
	var id = document.organizationAddressForm.organizationId.value;
	//var name = document.organizationAddressForm.organizationName.value;
	var addrId = document.organizationAddressForm.organizationAddressId.value;
	if(addrId == null || addrId == "")
	{
		var ele = document.getElementById("perdictiveName");
		ele.style.display = "block";
	}
	else
	{
		var ele1 = document.getElementById("noEditName");
		ele1.style.display = "block";
	}
	if(addrId == null || addrId == "")
	{
		disableFields();
	}
	else
	{
		enableFields();
	}
}

function enableFields()
{
	var ele2 = document.getElementById("addHeader");
	ele2.style.display = "none";
	var ele3 = document.getElementById("maintainHeader");
	ele3.style.display = "block";

}

function disableFields()
{
	var ele2 = document.getElementById("addHeader");
	ele2.style.display = "block";
	var ele3 = document.getElementById("maintainHeader");
	ele3.style.display = "none";
	document.organizationAddressForm.addr_delete.disabled=true;
	document.organizationAddressForm.org_address.disabled=true;	
	document.organizationAddressForm.add_next_addr.disabled=true;	
}

//lookup window 
function organizationPopupSearch() {
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}
function organizationNameSearchUpdate(id){
	var values = id.split("|");
  	$('#organizationName').val(values[0]);
	$('#organizationNameHolder').val(values[0]);
  	$('#organizationId').val(values[1]);
  	if(values[3]=='Y' || values[3]=='y')
  	{
  		$('#organizationActive').attr('checked',true); 
  	}
  	$('#organizationNameHolder').focus();
}
/*************************************/

function isValidPhoneFields()
{
	var isValid = true;
	isValid = chechByCountryCode("phone");
	if(isValid)
	{
		isValid = chechByCountryCode("fax");
	}
	if(isValid)
	{
		isValid = chechByCountryCode("primFaxNotify");
	}
	if(isValid)
	{
		isValid = chechByCountryCode("secondFaxNotify");
	}
	return isValid;
	
}

function checkForFaxCountryCode(value)
{
	return chechForCountryCode(value.val(),"fax");
}
function checkForFaxNotifyCountryCode(value)
{
	return chechForCountryCode(value.val(),"primFaxNotify");
}
function checkFor2ndFaxNotifyCountryCode(value)
{
	return chechForCountryCode(value.val(),"secondFaxNotify");
}

function checkForPhoneAreaCode(value)
{
	return checkForAreaCode($('#phoneCountryCode').val(),value.val(),"phone");
}
function checkForFaxAreaCode(value)
{
	return checkForAreaCode($('#faxCountryCode').val(),value.val(),"fax");
}
function checkForFaxNotifyAreaCode(value)
{
	return checkForAreaCode($('#primFaxNotifyCountryCode').val(),value.val(),"primFaxNotify");
}
function checkFor2ndFaxNotifyAreaCode(value)
{
	return checkForAreaCode($('#secondFaxNotifyCountryCode').val(),value.val(),"secondFaxNotify");
}

function checkForPhoneExchangeCode(value)
{
	return checkForExchangeCode($('#phoneCountryCode').val(),value.val(),"phone");
}
function checkForFaxExchangeCode(value)
{
	return checkForExchangeCode($('#faxCountryCode').val(),value.val(),"fax");
}
function checkForFaxNotifyExchangeCode(value)
{
	return checkForExchangeCode($('#primFaxNotifyCountryCode').val(),value.val(),"primFaxNotify");
}
function checkFor2ndFaxNotifyExchangeCode(value)
{
	return checkForExchangeCode($('#secondFaxNotifyCountryCode').val(),value.val(),"secondFaxNotify");
}

function checkForPhoneStationCode(value)
{
	return checkForStationCode($('#phoneCountryCode').val(),value.val(),"phone");
}
function checkForFaxStationCode(value)
{
	return checkForStationCode($('#faxCountryCode').val(),value.val(),"fax");
}
function checkForFaxNotifyStationCode(value)
{
	return checkForStationCode($('#primFaxNotifyCountryCode').val(),value.val(),"primFaxNotify");
}
function checkFor2ndFaxNotifyStationCode(value)
{
	return checkForStationCode($('#secondFaxNotifyCountryCode').val(),value.val(),"secondFaxNotify");
}
function checkForPhoneExtentionCode(value)
{	
	return chechForExtentionCode($('#phoneCountryCode').val(),value.val(),"phone");
}
function checkForFaxExtentionCode(value)
{	
	return chechForExtentionCode($('#faxCountryCode').val(),value.val(),"fax");
}
function checkForFaxNotifyExtentionCode(value)
{	
	return chechForExtentionCode($('#primFaxNotifyCountryCode').val(),value.val(),"primFaxNotify");
}
function checkFor2ndFaxNotifyExtentionCode(value)
{	
	return chechForExtentionCode($('#secondFaxNotifyCountryCode').val(),value.val(),"secondFaxNotify");
}
/*************************************/


function chechByCountryCode(id)
{
	if($('#'+id+'CountryCode').val()!=null && $('#'+id+'CountryCode').val()!="")
	{
		if($('#'+id+'AreaCode').val()==null || $('#'+id+'AreaCode').val()=="")
		{
			$('#'+id+'AreaCode').validationEngine('showPrompt', 
					'Please provide '+id +' area code',
					'error', true);
			return false;
		}
		else if($('#'+id+'Exchange').val()==null || $('#'+id+'Exchange').val()=="")
		{
			$('#'+id+'Exchange').validationEngine('showPrompt', 
					'Please provide '+id +' exchange code',
					'error', true);
			return false;
		}
		else if($('#'+id+'Station').val()==null || $('#'+id+'Station').val()=="")
		{
			$('#'+id+'Station').validationEngine('showPrompt', 
					'Please provide '+id +' station code',
					'error', true);
			return false;
		}
	}
	return true;
}
function checkForAreaCode(countryCode,value,id)
{
	if(value.length>0)
	{
		setDefaultCountry(id,'AreaCode');
	}
	
	 if(countryCode=='1' && value.length != 3)
	 {
		 return 'For domestic phone numbers, area code must be 3 in length';
	 }
	 //D033876
	/* else if(countryCode!='1' && (value.length < 2 || value.length > 4))
	 {
		 return 'For foreign phone numbers, area code must be between 2 and 4 in length';
	 }*/
}
function setDefaultCountry(id,code)
{
	if(($("#defaultCountryCode").val()==null || $("#defaultCountryCode").val()==""))
	{
		$("#defaultCountryCode").val("1");
	}
	if($('#'+id+code).val().length>0)
	{
		if($('#'+id+'CountryCode').val()==null || $('#'+id+'CountryCode').val()=="")
		{
			$('#'+id+'CountryCode').val($("#defaultCountryCode").val());
		}
	}
}
function checkForExchangeCode(countryCode,value,id)
{
	if(value.length>0)
	{
		setDefaultCountry(id,'Exchange');
	}
	 if(countryCode=='1' && value.length != 3)
	 {
		 return 'For domestic phone numbers, exchange code must be 3 in length';
	 }
	 //D033876
	 /*else if(countryCode !='1' && value.length != 3 && value.length != 4)
	 {
		 return 'For foreign phone numbers, exchange code must be 3 or 4 in length';
	 }*/
}
function checkForStationCode(countryCode,value,id)
{
	if(value.length>0)
	{
		setDefaultCountry(id,'Station');
	}
	//D033876
	 if(countryCode=='1' && value.length != 4)
	 {
		 return 'Station code must be 4 in length';
	 }
}
function chechForExtentionCode(countryCode,value,id)
{
	if(value.length>0)
	{
		setDefaultCountry(id,'Extention');
	}
}


function validateZip(){
	var zipCode = $.trim($("#zipCode").val());
	var countryName = $.trim($("#countryName").val());
	var split = zipCode.split("-");
	if(new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states")
	{
		if(zipCode.length != 5 && zipCode.length != 10)
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		else if(zipCode.length == 5 && zipCode=="00000")
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		else if(split.length==2 && split[1]=="0000")
		{
			return "The ZIP CODE entered is invalid (NNNNN or NNNNN-NNNN)";
		}
		var zipRegEx = new RegExp(/^(([0-9]+)([\-]([0-9]+))?)$/);
        if (!zipRegEx.test($('#zipCode').val())) {
            return "The ZIP CODE entered is not numeric (NNNNN or NNNNN-NNNN)";
        }
	}
	else
	{
		if(zipCode.length == 10)
		{
			return "10th position of postal code must be blank for non US countries";
		}
	}
	/*if(split.length==1)
	{
		
		var  val = zipCode.replace(/(.{5})/g,"$1-");
		$('#zipCode').val(val);
	}
	if($('#zipCode').val().length>10)
	{
		$('#zipCode').val($('#zipCode').val().substr(0,10));
	}
	else if($('#zipCode').val().length==6)
	{
		$('#zipCode').val($('#zipCode').val().substr(0,5));
	}*/
	
	
	//return zipCode;
}

function validateCountryGroup() {
  var stateCode = $.trim($("#stateCode").val());
  var zipCode = $.trim($("#zipCode").val());
  var provinceName = $.trim($("#provinceName").val());
  var countryName = $.trim($("#countryName").val());
  //Updated for defect# 29917
  if(new String(countryName.toLowerCase())=="us" || new String(countryName.toLowerCase()).ignoreCase=="united states")
  {
	  if(stateCode.length == 0 || zipCode.length == 0)
	  {
		  return "State and Zip are required if Country is US";
	  }
	  else if(provinceName.length != 0)
	  {
		  return "Province not required if Country is US";
	  }
  }
  else if(new String(countryName.toLowerCase())=="ca" || new String(countryName.toLowerCase()).ignoreCase=="canada")
  {
	 /* if(provinceName.length == 0)
	  {
		  return "Province is required if Country is CA";
	  }*/
	  if(stateCode.length == 0)
	  {
		  return "State required if country is CA";
	  }
	  if(provinces == ""){
		  return "Please select province from predictive list if country is CA";
	  }
  }
 /* else
  {
	  if(provinceName.length == 0)
	  {
		  return "Province required if Country is not US";
	  }
	  else if(stateCode.length != 0)
	  {
		  return "State not required if Country is not US";
	  }
  }*/
}
/*function validateIsActive()
{
	var addressId = $.trim($("#organizationAddressId").val());
	var isActive = $.trim($("#isActive1").val());
	alert(addressId + ""+isActive);
}*/

/*function cancel() {
	var addrId = $("#organizationAddressId").val();
	var orgId = $("#organizationId").val();
	var navigation = $("#navigation").val();
	//alert( orgId+" : "+addrId);
	document.location.href =_context+'/organization/address/add?actionPerformed=cancel';
	if(navigation == "searchOrg")
	{
		document.location.href =_context+'/cas/organizationSearch.do';
			
	}
	else if(navigation == "maintainOrg")
	{
	   document.location.href =_context+'/organization/findOrganization?id='+orgId;
	}
	else 
	{
		document.location.href =_context+'/cas/addressSearch.do';	
	}
}*/



function removeErrorPointers(){
	   $('#organizationAddressForm').validationEngine('hideAll');
}

///*  <!--  JS FOR COLLAPSE/EXPAND -->  */
//
//// Add Organization Authorization 
//animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1')
//
//animatedcollapse.ontoggle=function($, divobj, state){ 
//	}
//
////INITIALIZT COLLAPSE/EXPAND
//animatedcollapse.init()
/************************************************************************/
 var flag=0;  
  $(function(){
	   
		/*// Dialog Link
		$('#org_save').click(function(){
			flag = 1;
			$('#org_auth_party').dialog('open');
			return false;
		});
	   // Dialog			
		$('#org_auth_party').dialog({
			autoOpen: false,
			width: 510,
			modal: true
		});*/
	   
	// Dialog Link
	
	 //Comments   
	  
	  tabSequence('#organizationAddressForm');
		var args = {
						entityType: 'ADDR',
						entityId: $('#organizationAddressId').val(),
						commentId:  'commentId'
					};
			$("#comment_link").comments(args);


		
	//History
		var historyArgs = {
				entityId: $('#organizationAddressId').val(),
				entity: 'com.matson.gates.cp.organization.domain.OrganizationAddress'
			};
		$("#history_link").history(historyArgs);
		
		
/*		$('#history_link').click(function(){
			flag = 4; 
			
			var organizationAddressId = $('#organizationAddressId').val();
			var url ="/gates/history/revisions?entityId=" + organizationAddressId+"&entityClassName=com.matson.gates.cp.organization.domain.OrganizationAddress";
			window.open (url, "historyWin","status=0,toolbar=0,width=900,height=600,scrollbars=1,titlebar=0");
			//$('#org_history').dialog('open');
			return false;
		});
	   // Dialog			
		$('#org_history').dialog({
			autoOpen: false,
			width: 800,
			modal: true
		});
		//Dialog Close
		$('#history_close').click(function(){
			flag = 0; 
			$('#org_history').dialog("close"); 
			return false;
		});*/

		
		
		
		//Delete Functionality
		
		// Dialog Link
		$('#addr_delete').click(function(){
			flag=6;
				$('#organizationActive').removeAttr('disabled');
				$('#bg_ap_delete').dialog('open');
			
			return false;
		});
		// Dialog			
		$('#bg_ap_delete').dialog({
			autoOpen: false,
			width: 510,
			modal: true
		});
		
		// Dialog Link
		$('#org_ap_delete').click(function(){
			flag=0;
			$('#bg_ap_delete').dialog("close"); 
			//$('#org_auth_party').dialog('open');
			//flag=1;
			return false;
		});
		
		// Dialog Link
		$('#org_ap_cancel').click(function(){
			flag=0;
			$('#organizationActive').attr('disabled','disabled');
			$('#bg_ap_delete').dialog("close"); 
			return false;
		});
});
 
	shortcut.add("Ctrl+S",function() {
		if(flag==0)
		{			
			$('#org_save').click();
		}
		else if(flag==1)
		{
			save();
			$('#org_ap_workflow_link').click();
		}
		else if(flag==3)
		{
			saveComment();
			$('#dialog_close1').click();
		}
	});		
	shortcut.add("Ctrl+D",function() {
		if(flag==0)
		{
			cancel();
			$('#org_workflow_link').click();
		}
		else if(flag==1)
		{
			$('#dialog_close').click();
		}
		else if(flag==3)
		{
			$('#dialog_close2').click();
		}
		else if(flag==6)
		{
			$('#org_ap_cancel').click();
		}
	});
	shortcut.add("Ctrl+A",function() {
		if(flag==0)
		{
			$('#addr_delete').click();
		}
	});
	shortcut.add("esc",function() {
		if(flag==0)
		{
			cancel();
			$('#org_workflow_link').click();
		}
		else if(flag==1)
		{
			$('#dialog_close').click();
		}
		else if(flag==2)
		{
			$('#workflow_close').click();
		}
		else if(flag==3)
		{
			$('#dialog_close1').click();
		}
		/*else if(flag==4)
		{
			$('#history_close').click();
		}
		else if(flag==5)
		{
			$('#compare_close').click();
		}*/
		else if(flag==6)
		{
			$('#org_ap_cancel').click();
		}
	});
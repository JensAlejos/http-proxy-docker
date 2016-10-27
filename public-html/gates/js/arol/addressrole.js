
//For validation engine set default event to null
$.validationEngine.defaults.validationEventTrigger = null;

//// Add Organization Authorization
//animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1');
//animatedcollapse.ontoggle = function($, divobj, state) {}
//
//// INITIALIZT COLLAPSE/EXPAND
//animatedcollapse.init();

function removeErrorPointers(){
	   $('#addressRoleForm').validationEngine('hideAll');
}

function removeAddress()
{
	$('#addressActive').attr('checked',false);
	$('#streetAddress').text("");
	$('#streetAddress2').text("");
	$('#streetAddress3').text("");
	$('#suite').text("");
	$('#city').text("");
	$('#state').text("");
	$('#zipCode').text("");
	$('#countryName').text("");
}

//predictive search 
$(document).ready(function() {
	
	 if ($('#owningOrganizationId').val()=="" && $('#usingOrganizationId').val()) {
		 $('#owningOrganizationId').val($('#usingOrganizationId').val());
	 }
	
	$('#contact_add').click(function(){
		document.location.href=_context+"/contact/maintain.html";
	});
	
	$('#clear').click(function(){
		var url=_context+'/addressRole/viewAdd?action=clear';
		if($('#usingOrganizationId').val().trim()!='' && $('#usingOrganizationId').val()!=undefined && $('#usingOrganizationId').val()!=null) {
			url=url+"&organizationId="+$('#usingOrganizationId').val();
		}
		document.location.href=url;
	});
	
	$('#addressRoleForm').validationEngine('attach');
	$("#usingOrganizationName").blur(function(){
		if($("#usingOrganizationName").val()==null || $("#usingOrganizationName").val()==""){
			$('#orgActive').attr('checked',false);
			$('#usingOrganizationId').val("");
			$('#owningOrganizationId').val("");
			$('#owningOrganizationAddressId').val("");
			removeAddress();
		}
	});
	$("#owningOrganizationName").change(function(){
		if($('#usingOrganizationId').val()!="") {
			$('#owningOrganizationId').val($('#usingOrganizationId').val());
		}
		else {
			$('#owningOrganizationId').val("");
		}
		$('#owningOrganizationAddressId').val("");
		removeAddress();
	});
	
	
	$('#salesRegionCode').change(function(){
		$('#salesRepCode').val('');
    });
	
	$('#contactName').change(function(){
		if($("#usingOrganizationName").val()==null || $("#usingOrganizationName").val()==""){
        	//$("#contactName").val(""); 
			//alert("please select Organization first.")
			$("#contactName").validationEngine('showPrompt', 'Please select Organization first.', 'error', true);
			$("#contactName").val("");
			$('#orgActive').attr('checked',false);
			
		}
    });
	
	
	//Blurr the data for invalid Contact ID
	$('#contactName').blur(function(){
		if($("#contactId").val()==null || $("#contactId").val()==""){
        	$("#contactName").val(""); 
    	}
		if($("#contactName").val()=="")
			{
				$("#contactId").val("");
			}
    });
	
	//Blurr the data for invalid territory code
	$('#salesRepCode').blur(function(){
		if($("#territoryCode").val()==null || $("#territoryCode").val()==""){
        	$("#salesRepCode").val(""); 
    	}
    });
	
	/*$('#carrierCode').change(function(){
        	$("#carrierCodeChange").val(""); 
    });
	//Blurr the data for invalid carrier code
	$('#carrierCode').blur(function(){
		if($("#carrierCodeChange").val()==null || $("#carrierCodeChange").val().trim()==""){
        	$("#carrierCode").val(""); 
    	}
    });*/
	
	//Blurr the data for invalid Port City code
	$('#cityCodeName').blur(function(){
		if($("#cityCode").val()==null || $("#cityCode").val().trim()==""){
        	$("#cityCodeName").val(""); 
    	}
		if($("#cityCodeName").val()==null || $("#cityCodeName").val().trim()=="")
		{
			$("#cityCode").val(""); 
		}
    });
	
	/*$('#carrierCode').change(function(){
		$("#carrierCode").val(""); 
	});*/
	
	
	
	// configuration for multi select boxes
	$.configureBoxes({		
		useFilters : false,
		useCounters : false
	});
	
	$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
	var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';

			$('#owningOrganizationName').gatesAutocomplete({
				source: url,
				mustMatch:true,
				formatItem: function(data) {
					return data.name; //+ "-" + data.code;
				},
				formatResult: function(data) {
					return data.name; // + "-" + data.code;
				},
				select: function(data) {
					$('#owningOrganizationName').val(data.name);
					$('#owningOrganizationId').val(data.id);
					$('#owningOrganizationId').trigger('change');
					$('#owningOrganizationAddressId').val("");
					removeAddress();
				}
			})
			.change(function() {
				if($('#owningOrganizationName').val()=='')
					{
						$('#owningOrganizationId').val('');
					}
			});

	
	$('#usingOrganizationName').gatesAutocomplete({
		source: url,
		formatItem: function(data) {
			return data.name; // + "-" + data.code;
		},
		formatResult: function(data) {
			return data.name; //+ "-" + data.code ;
		},
		select: function(data) {
			$('#usingOrganizationName').val(data.name);
			if(data.active=='Y'){
				$('#orgActive').attr('checked',true);
			}else{
				$('#orgActive').attr('checked',false);
			}
			$('#usingOrganizationId').val(data.id);
			$('#usingOrganizationId').trigger('change');
			$('#owningOrganizationName').val("");
			$('#owningOrganizationId').val(data.id);
			removeAddress();
		}
	});
	
	/*// code to bind pop up search
	$('#usingOrganizationName').gatesPopUpSearch({
		func : function() {
			usingOrganizationPopupSearch();
			$('#owningOrganizationName').val("");
			$('#owningOrganizationId').val("");	
		}
	});*/
	
	
	// code to bind pop up search
	$('#salesRepCode').gatesPopUpSearch({
		func : function() {
			salesRepPopupSearch();
		}
	});
	
	
	// code to bind pop up search for attn line contact
	$('#contactName').gatesPopUpSearch({
		func : function() {
			attnLinePopupSearch();
		}
	});
	
	
	// code to bind pop up search
	$('#usingOrganizationName').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch("using");
		}
	});
	
	// code to bind pop up search
	$('#owningOrganizationName').gatesPopUpSearch({
		func : function() {
			organizationPopupSearch("owning");
		}
	});
	
	$("#customerGroup_POPUP").click(function(){
		var code='';
		$("#box2View option").each(function() {
			 code = code + '|'+$(this).val();
		});
		if('' == code){
			alert('Please select Trade.');
		}
		else{	
			$('#customerGroup').dialog('open');
		}
	});
	
	
	$("#usingAddress_POPUP").click(function(){
		 $('#isUsingOrganization').val("true");
		 if ($('#usingOrganizationId').val()) {	
			
				$('#action').val("source"); 
			//	var url = _context + "/cas/addressPopUpSearch.do?filterValue1="+$('#usingOrganizationId').val();
				// skb 20120307 Changed to address Role lookup.	
				// TT 13577
				var url = _context + "/cas/addressRolemainlookup.do?filterValue1="+$('#usingOrganizationId').val();

				winBRopen(url,'winpops','700','500','no','no');	
		    } else {
		    	alert('Please select Using organization.');
		    }	
	    //$('#usingOrganizationName').val("");
		//$('#usingOrganizationId').val("");
		//$('#owningOrganizationName').val("");
		//$('#owningOrganizationId').val("");
	  
  });
	
	$("#owningAddress_PopUp").click(function(){
		$('#isUsingOrganization').val("false");
		if ($('#owningOrganizationId').val()=="" && $('#usingOrganizationId').val()!="") {
			 $('#owningOrganizationId').val($('#usingOrganizationId').val());
		}
		 if ($('#owningOrganizationId').val()!="") {
			 
				$('#action').val("source"); 
				$.ajax({
					   type: "GET",
					   url: _context +"/addressRole/getAddressIfOnlyOne",
					   data: {		 		 
						   organizationID: $('#owningOrganizationId').val()
					   },
					   success: function(responseText){
						   if(responseText.data=="Not Single") {
							   var url = _context + "/cas/addressMainLookUp.do?filterValue1="+$('#owningOrganizationId').val();
								winBRopen(url,'winpops','700','500','no','no');	
						   }
						   else {
							   addressSearchUpdate(responseText.data);
						   }
					   }
					   });
				
		    } else {
		    	alert('Please select Owning organization.');
		    }	
	    //$('#owningOrganizationName').val("");
		//$('#owningOrganizationId').val("");
  
 });
	$('#customerGroup').dialog({
		autoOpen: false,
		width: 510,
		modal: true,
		buttons: [
		          {
		              text: "Save",
		              click: function() {
		            	  $(this).dialog("close"); 
		              }
		          },
		          {
		              text: "Cancel",
		              click: function() {
		            	  $(this).dialog("close"); 
		              }
		          }
		      ]
	});	
	
});   // document ready function end

//lookup window 
function organizationPopupSearch(id) {
	if(id=="using"){
	this.usingPopUp='true';
	
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
	}
	
	if(id=="owning"){
		this.usingPopUp='false';
		
		var actionUrl = _context + "/cas/organizationlookup.do";
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);
		}
	
}

function organizationNameSearchUpdate(id){
	var values = id.split("|");
	 if(usingPopUp=="true")
	 {
		 $('#usingOrganizationName').val(values[0]);
		 $('#usingOrganizationId').val(values[1]);
		 $('#owningOrganizationId').val(values[1]);
		 $('#owningOrganizationName').val("");
		 if(values[3]=="Y"){
				$('#orgActive').attr('checked',true);
			}
		 else {
			 $('#orgActive').removeAttr('checked');
		 }
		 
		 
		 $('#clear').click();
	 }
	 if(usingPopUp=="false")
	{
		 $('#owningOrganizationName').val(values[0]);
		 $('#owningOrganizationId').val(values[1]);
		 if(values[3]=="Y"){
				$('#addressActive').attr('checked',true);
			}
		 else {
			 $('#addressActive').removeAttr('checked');
		 }
		 removeAddress();
		 $('#owningOrganizationAddressId').val('');
		 $('#owningOrganizationName').focus();
	}
	
}

function removeErrorPointers(){
	   $('#addressRoleForm').validationEngine('hideAll');
}




function validateAROLId()
{
	if($('#usingOrganizationId').val() == null || $('#usingOrganizationId').val() == "")
	{
		return "Please Select a valid Organization";
	}
}

/*$(function(){
	
	$('#owningOrganizationName').click(
			
			function(){				
			    if ($('#owningOrganizationId').val()) {	
					$('#action').val("source"); 
					var url = '../../cas/addressPopUpSearch.do?filterValue1='+$('#owningOrganizationId').val();
					winBRopen(url,'winpops','700','500','no','no');
					
			    } else {
			    	alert('Please select organization.');
			    }
			}
	
	);	
});*/



function cancel() {
	//document.location.href = _context + '/organization/add?actionPerformed=cancel';
	document.location.href = _context + '/cas/addressRoleSearch.do';
}

/*//lookup window 
function organizationPopupSearch() 
{
	var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
 // $('#owningOrganizationName').click(
			//function(){				
			    if ($('#owningOrganizationId').val()) {	
					$('#action').val("source"); 
					var url = _context + "/cas/addressPopUpSearch.do?filterValue1="+$('#owningOrganizationId').val();
					winBRopen(url,'winpops','700','500','no','no');
					
			    } else {
			    	alert('Please select C/O organization.');
			    }
		//	}
	
	//);	
	
}*/


//lookup window 
function usingOrganizationPopupSearch() 
{
	/*var actionUrl = _context + "/cas/organizationlookup.do";
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);*/
 // $('#owningOrganizationName').click(
			//function(){				
			    if ($('#usingOrganizationId').val()) {	
					$('#action').val("source"); 
					var url = _context + "/cas/addressPopUpSearch.do?filterValue1="+$('#usingOrganizationId').val();
					winBRopen(url,'winpops','700','500','no','no');	
			    } else {
			    	alert('Please select Using organization.');
			    }
		//	}
	
	//);	
	
}


function salesRepPopupSearch() {
	if ($('#salesRegionCode').val()!=-1) {
    	//var actionUrl = '${pageContext.servletContext.contextPath}/cas/salesReplookup.do';
		//var actionUrl = _context+'/cas/salesReplookup.do?filterValue1=&filterValue2=' + $('#salesRegionCode').val() ;
		var actionUrl = _context+'/cas/salesReplookup.do?filterValue1='+ $('#salesRepCode').val() + '&filterValue2=' + $('#salesRegionCode').val() ;
    	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'SalesRepSearch', windowStyle);	
    }
    else {
    	alert('Please select Sales Region.');
    }
} 

function attnLinePopupSearch() {
	if ($('#owningOrganizationId').val()) {	
		var orgName = '', filterValue2 = '', filterValue3 = '';
		if($("#owningOrganizationName").val()){
			orgName = $("#owningOrganizationName").val();
		}else {
			orgName = $("#usingOrganizationName").val();
		}
		if(orgName){
			 var index = orgName.lastIndexOf("-");
			 filterValue3 = orgName.substring(index+1);
			 filterValue2 = orgName.substring(0,index);
		}
		var url = _context + "/cas/attnLineContactlookup.do?filterValue1="+$('#owningOrganizationId').val()+"&filterValue2="+filterValue2+"&filterValue3="+filterValue3;
		winBRopen(url,'winpops','700','500','no','no');
		
    } else {
    	$("#contactName").validationEngine('showPrompt', 'Please select Organization first.', 'error', true);
    	//alert('Please select organization.');
    }
} 

function attnLineContactUpdate(id){
	var values = id.split("|");
  	$('#contactName').val(values[0]);
  	$('#contactId').val(values[1]);
	$('#contactName').focus();
}


function salesRepNameSearchUpdate(id){
	
	var values = id.split("|");
	
  	$('#salesRepCode').val(values[0]+"-"+values[1]);
  	$('#territoryCode').val(values[1]);
  	$('#salesRepCode').focus();
  	
}

function winBRopen(theURL, Name, popW, popH, scroll, loc) {
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
	Win = window.open(theURL, Name, winProp);
	if (parseInt(navigator.appVersion) >= 4) {
		Win.window.focus();
	}
}

function maintainCrossRef(){ 
	// need to modify
	if($('#addressRoleId').val() != null && $('#addressRoleId').val() != "")
	{
		document.location.href=_context+'/addressrole/crossreference/get?action=search&sId='+$('#addressRoleId').val() +"&searchPage=arol";
	}
	else
	{
		document.location.href=_context+'/addressrole/crossreference/viewAdd' +"?searchPage=arol";
	}
}


//methods for selecting all values from multi select menu
function submitAllSelect() {
	selectAll(getControl('box2View'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}// closing Select All Function

var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};

$(function() {
	
	var args = {
			entityType: 'AROL',
			entityId: $('#addressRoleId').val(),
			commentId:  $('#commentId').val()
		};
$("#commentLink").comments(args);

	var historyArgs = {
		entityId: $('#addressRoleId').val(),
		entity: 'com.matson.gates.cp.addressrole.domain.AddressRole'
	};
	$("#history_link").history(historyArgs);

});


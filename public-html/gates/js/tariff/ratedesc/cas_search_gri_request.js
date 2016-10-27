var dataName=null;
$(function() {
	tabSequence('#tabSequence');
});
$(document).ready( function() {
	//$('#in_implementation_date').val(priorDate);
	$("#in_implementation_date").datepicker({
		dateFormat : 'yy-mm-dd'
	});
	$("#in_last_verify_run_date").datepicker({
		dateFormat : 'yy-mm-dd'
	});
	$("#in_effective_date").datepicker({
		dateFormat : 'yy-mm-dd'
	});
	$( "#successDialog" ).dialog({
		resizable: false,
		autoOpen: false,
		height:'auto',
		width:300,
		modal: true,
		close: function(){
			var frm = document.forms["griSearchForm"];
			frm.method.value="show";
			postMethod('search',frm.method);
		},
		buttons: {
			"OK": function() {
				$( this ).dialog( "close" );
				var frm = document.forms["griSearchForm"];
				frm.method.value="show";
				postMethod('search',frm.method);
				/*postMethod('search',document.forms["rateDesriptionForm"].method);*/
			}
		}
	});
	
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
		 if(anyOneChecked){
			 
			 if (_readonly) {
					$('#GRI_delete').gatesDisable();   
					$('#authorization').gatesDisable();
			}
			 else
				 {
				 $('#GRI_delete').removeAttr("disabled");
				 }

			
		 }
		 else
			 {
			 $('#GRI_delete').attr("disabled","disabled");
			 }
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
		 
	
	$( "#showDialog" ).dialog({
		resizable: false,
		autoOpen: false,
		height:'auto',
		width:300,
		modal: true,
		buttons: {
			"OK": function() {
				$( this ).dialog( "close" );
			}
		}
	});
	 if(document.griSearchForm.delete1.value!=null && document.griSearchForm.delete1.value != "delete1")
		{
			$('#msgDiv').hide();
		}
		if(document.griSearchForm.delete1.value != null && document.griSearchForm.delete1.value == "delete1")
		{
			//$("#delete_success").dialog("open");
			var messageContent= "Record has been deleted successfully.";
			$('#msgDiv').html(messageContent)
			//alert("Record has been deleted successfully.");
		}
	// Disable the buttons by default
//	$('#addGriRequestId').attr("disabled","disabled");
	$('#GRI_delete').attr("disabled","disabled");
	
	$('form[name="griSearchForm"]').formatCasSearchForm({ 
	hasSavedSearchFeature: false, 
	customActions: [ ]
	});

	// code for source tariff predictive search		
	$('#in_source_code').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
 		 		 		 method: 'searchTariffSource',
 		 		 		 searchType: '11',
 		 		 		 groupType:  function() { return $('#in_group_type_code').val(); }
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
		 		$('#in_source_code').val(data.id);	
		 		$('input[name="grpId"]').val(data.id); // added for invalid group id
		 		if($('#in_group_type_code').val()=="01"){
		 			 $('#in_group_code').val(data.name);			    		
			    		if(!_displayonly){
			    			$('#addGriRequestId').removeAttr("disabled");
			    		}
		 		 }
		 }		 
	});	
	//Blur the data for invalid group Id
	$('#in_source_code').change(function(){
		if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
	      	$("#in_source_code").val("ALL"); 
	      	$("#in_group_code").val("ALL"); 
	  	}
		else
		{
			$("#in_source_code").val(dataName); 
	 		 if($('#in_group_type_code').val()=="01"){
	 			 $('#in_group_code').val(dataName);
	 		 }
			$('input[name="grpId"]').val("");
			}
	});
	
	//code for group name predictive
	$('#in_group_code').gatesAutocomplete({
		 source:  _context+'/cas/autocomplete.do',
		 extraParams: {
	 		 		 		 method: 'searchGroupName',
	 		 		 		 searchType: '10',
	 		 		 		 groupType:  function () { return $('#in_group_type_code').val(); },
	 		 		 		 sourceTariff:  function () { return $('#in_source_code').val(); }				 		 		 		 
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
		 		$('#in_group_code').val(data.id);	
		 		$('input[name="grpId"]').val(data.id);
	    		if(!_displayonly){
	    			$('#addGriRequestId').removeAttr("disabled");
	    		}
		 }		 
	});	
	//Blurr the data for invalid group Id
	$('#in_group_code').change(function(){
		if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
			$("#in_group_code").val("ALL");       	
		}
		else
		{
			$("#in_group_code").val(dataName); 
			$('input[name="grpId"]').val("");
		}	
	});
	
   //div for custom "Search" and "Clear" buttons

   $('.searchTable').after(
		'<div id="showCusButtons">' +	
		'<table>' +
		'<br></br>' +
		'<tr>' +
		  '<td><input type="button" onclick="javascript:searchValue();" value="Search" id="GRISeach" name="search" class="buttonNoFloat"> </td>'+
		  '<td><input type="button" onclick="javascript:resetGriForm();" id="clrdummy" value="Clear" name="Clear" class="buttonNoFloat"></td>' +
		'</tr>' +
	  	'</table>' +
	  	'</div>'	
  	);

    //Hide Cas Generated "Search" and "Clear" buttons

    $('.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();
   
   
    
    $('#in_group_code').keyup(function() {
    	var validComb= validateCombforMandatoryFiels();
    	if(! validComb){
    		
    		//$('#addGriRequestId').attr("disabled","disabled");
    	}else{
    		
    		//$('#addGriRequestId').removeAttr("disabled");
    	}
    });

    $('#in_source_code').keyup(function() {
    	var validComb= validateCombforMandatoryFiels();
    	if(! validComb){
    		
    		//$('#addGriRequestId').attr("disabled","disabled");
    	}else{
    		
    	//	$('#addGriRequestId').removeAttr("disabled");
    	}
    });
    var validComb= validateCombforMandatoryFiels();
    if(!validComb){

    	
    	//$('#addGriRequestId').attr("disabled","disabled");
    	$('#GRI_delete').attr("disabled","disabled");
    	
    }
    else
    	{
		
		//$('#addGriRequestId').removeAttr("disabled");
		
    	}
    
    
 // code to bind pop up search
	 $('#in_group_code').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#in_source_code').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	 
	
	
//    $('#in_source_code').change(function() {
//    	var grpType= $('#in_group_type_code').val();
//    	var srcTariff=$('#in_source_code').val();
//    	if(grpType=='01')
//    		{
//    		$('#in_group_code').val(srcTariff);
//    		
//    		if(_displayonly){}else
//    		$('#addGriRequestId').removeAttr("disabled");
//    		}
//    	else
//    		{
//    		$('#in_group_code').val("ALL");
//    		}
//        	
//
//    });
    $('#in_group_type_code').change(function() {
    	document.griSearchForm.delete1.value ="";
    	$('#msgDiv').hide();
    	setdefault();
    	$('input[name="grpId"]').val("");
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
			 
			 if (_readonly) {
					$('#GRI_delete').gatesDisable();   
					$('#authorization').gatesDisable();
			}
			 else
				 {
				 $('#GRI_delete').removeAttr("disabled");
				 }

			
		 }
		 else
			 {
			 $('#GRI_delete').attr("disabled","disabled");
			 }
	});
    
    
    var groupTypeCode = document.griSearchForm.groupTypeCode.value; 
    var sourceCode = document.griSearchForm.sourceCode.value;
    var groupCode = document.griSearchForm.groupCode.value;
    if(groupTypeCode!=null || groupTypeCode!='')
 		{
 		$('#in_group_type_code').val(groupTypeCode);
			
		}	 
 	 if(sourceCode!=null || sourceCode!='')
 		{
 		$('#in_source_code').val(sourceCode);
 		
 		} 
 	 if(groupCode!=null && groupCode!='' && groupCode!='ALL')
 		{
 		$('#in_group_code').val(groupCode);
 		
 		//$('#addGriRequestId').removeAttr("disabled");
 		} 


 	
 	

	//disable all buttons after reset
//	$("input[type=button][value=Search]").attr("disabled","disabled");
//	$('#addGriRequestId').attr("disabled","disabled");
 	if (_displayonly) {
		$('#addGriRequestId').attr("disabled","disabled");
		
	    }
});

function resetGriForm(){
	$('#msgDiv').hide();
	document.griSearchForm.delete1.value ="";
	$('#resultdiv').hide();
	//document.getElementById('in_group_type_code').value="ALL";
	document.getElementById('in_group_code').value="ALL";
	document.getElementById('in_source_code').value="ALL";
	document.getElementById('in_requestNumber').value="ALL";
	document.getElementById('in_status').selectedValue="ALL";
	$("#in_implementation_date").val("ALL");
	$("#in_effective_date").val("ALL");
	$("#in_last_verify_run_date").val("ALL");
	$("#in_implementation_user").val("ALL");
	$("#in_status").val("ALL");
	
	//disable all buttons after reset
	
	//$('#addGriRequestId').attr("disabled","disabled");
	$('#GRI_delete').attr("disabled","disabled");

}
function setdefault(){
	
	$('#resultdiv').hide();
	//document.getElementById('in_group_type_code').value="01";
	document.getElementById('in_group_code').value="ALL";
	document.getElementById('in_source_code').value="ALL";
	document.getElementById('in_requestNumber').value="ALL";
	document.getElementById('in_status').selectedValue="ALL";
	$('input[name="grpId"]').val("");
	
	//disable all buttons after reset
	
	//$('#addGriRequestId').attr("disabled","disabled");
	$('#GRI_delete').attr("disabled","disabled");

}
function addGriRequest(){
	document.griSearchForm.delete1.value = "";
	 var grpTyp = document.getElementById('in_group_type_code').value;
	 var grpCode =document.getElementById('in_group_code').value;
	 var sourceCode=document.getElementById('in_source_code').value;
	 var status='O';
	 document.location.href=_context+'/tm/griRequestProcessing/showForm?groupTypeCode='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&status='+status;
/*	 $.ajax({
		   type: "GET",
		   url: _context +"/tm/griRequestProcessing/validateItemCombination?",
		   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode,
		   success: function(msg){
			   if(msg=="NotValid"){
				   alert('Not a valid combination to add GRI Request.');
				   $('#showDialog').attr('title','Alert');
					$('#showDialog').text('Not a valid combination to add GRI Request.');
					$('#showDialog').dialog('open');
				   
				   return;
				}
			   else{
					document.location.href=_context+'/tm/griRequestProcessing/showForm?groupTypeCode='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&status='+status;
				}
		   	}
	});*/
}

function searchValue(){
	//submit the form for CAS search to custom Action
//	 var grpTyp = document.getElementById('in_group_type_code').value;
//	 var grpCode =document.getElementById('in_group_code').value;
//	 var sourceCode=document.getElementById('in_source_code').value;
//	 $.ajax({
//		   type: "GET",
//		   url: _context +"/tariff/itemFrtWrf/validateItemCombination?",
//		   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode,
//		   success: function(msg){
//		   if(msg=="NotValid"){
//			   alert('Not a valid combination to Search GRI Request.'); 
//			   return;
//			}
//			else{
				var frm = document.forms["griSearchForm"];
				frm.method.value="show";
				postMethod('search',frm.method);
				return true;
//			}
//	
//		}
//	 });
}
function searchValueDefault(){
	    $('#in_group_type_code').val(document.griSearchForm.groupTypeCode.value);
		$('#in_source_code').val(document.griSearchForm.sourceCode.value);
		$('#in_group_code').val(document.griSearchForm.groupCode.value);
		postMethod('search',document.griSearchForm.method);
		return true;	
	}

function loadreqno(rquestNo)
{
	
	document.location.href=_context +'/tm/griRequestProcessing/edit?requestId='+rquestNo;
}
function validateCombforMandatoryFiels(){
    var grpCode = document.getElementById('in_group_code').value;
    var sourceCode = document.getElementById('in_source_code').value;
    var validComb=false;
    
    if(grpCode!=null && grpCode!="" && grpCode!="ALL"
    	&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"){
    	    
    	validComb=true;
    }
    return validComb;
}

function submitFinalRequestForDelete(searchInp){
	$.ajax({
		   type: "POST",
		   url: _context +"/tm/traiffRate/deleteRateDescriptions?",
		   data: "rateIdstoDelete="+ searchInp,
		   success: function(msg){
				if(msg=="Success"){
					document.getElementById("successDialog").innerHTML='<div class="span-10 section-header last" >Selected Rate Descriptions Deleted SuccessFully.</div>';
					$('#successDialog').dialog('open');
				  /* alert('Selected Rate Descriptions Deleted SuccessFully.');
				   postMethod('search',document.forms["rateDesriptionForm"].method);*/
				}else{								
					/*alert('Error in Rate Descriptions Deletion.');*/
					$('#showDialog').attr('title','Error');
					$('#showDialog').text('Error in Rate Descriptions Deletion.');
					$('#showDialog').dialog('open');
												
				}
			 }
		 });
	
}

function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&currentFuture=Y";//+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&currentFuture=Y";//+$('#in_expiration_date_flag').val();
var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}

function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#in_source_code').val(values[0]);
  	
  	if($('#in_group_type_code').val()=="01"){
		 $('#in_group_code').val(values[0]);
	 }
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#in_group_code').val(values[0]);	 
}


function deleteRequest()
{
	var searchLength=document.griSearchForm.searchInput.length;
	var status=document.getElementById('in_status').value;
	var requestsToDelete="";			
	if(typeof(searchLength)=="undefined"){		
		searchLength=1;
	}		
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";
		
   		if(searchLength!=1){
   			checked = document.griSearchForm.searchInput[i].checked;
   			searchInp = document.griSearchForm.searchInput[i].value;
   		}else{
   			checked = document.griSearchForm.searchInput.checked;
   			searchInp = document.griSearchForm.searchInput.value;
   		}   		
		if(checked)
		{
			selCount=selCount+1;
			var selItem="";			
			var temp = new Array();
			temp = searchInp.split(',');
			selItem=temp[0];						
			requestsToDelete = requestsToDelete + selItem +",";			
		}
	}
	if(selCount==0){
		//alert("");
		$('#showDialog').attr('title','Alert');
		$('#showDialog').text('Please select at least one Item for deletion !!');
		$('#showDialog').dialog('open');
		return;
	}else{
		if(requestsToDelete !="")
        {		
			
				var r=confirm("Do you really want to delete the selected GRI Request(s)?"); 	  		
		   		if (r==true){ 	 		 	
		   		 $.ajax({
					   type: "POST",
					   url: _context +"/tm/griRequestProcessing/deleteGRIRequest?",
					   data: "requestsToDelete="+ requestsToDelete,
					   success: function(msg){
						   if (msg == "NORECORD"){
							    /* alert('Only Open requests can be deleted.');*/
							   
							   $('#showDialog').attr('title','Alert');
								$('#showDialog').text('Only Open requests can be deleted.');
								$('#showDialog').dialog('open');
							    }
						   else if (msg == "Success"){
//							   	var frm = document.forms["griSearchForm"];
//					   		    frm.method.value="show";
							   //$('#successDialog').text('Selected GRI Request Deleted SuccessFully.');
							   document.location.href =_context + "/cas//griSearch.do?delete1=delete1";
						   		/*alert('Selected GRI Request Deleted SuccessFully.');
						   		postMethod('search',document.forms["griSearchForm"].method);*/
					   		
					   		 	//postMethod('search',frm.method);
						   	}else{
						   		$('#showDialog').attr('title','Alert');
								$('#showDialog').text(msg);
								$('#showDialog').dialog('open');
						   		/*alert(msg);*/
						   	} 
						 }
					 });
		   		  }else{
		   			return;
		   		  }	
				
	    }
	}
}



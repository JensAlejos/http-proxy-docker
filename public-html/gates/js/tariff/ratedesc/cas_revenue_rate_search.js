

var fromRateID =null; 
$(document).ready(function(){	
	//Added for Defect D023587
	if(!_isAddLink)
		$('#add_link').css('visibility','hidden');
	if(!_isDelete)
		$('#delete').css('visibility','hidden');
	tabSequence('#tabSequence');
	
	replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());
	
	$('td.dataField:contains("From Group Type:")').attr("colspan","1");
	$('td.dataField:contains("Source Tariff:")').attr("colspan","1");
	$('td.dataField:contains("Group Name:")').attr("colspan","1");
	$('td.dataField:contains("Item Name:")').attr("colspan","1");
	$('td.dataField:contains("Rate:")').attr("colspan","1");
	$('td.dataField:contains("To Group Type:")').attr("colspan","1");
	$("#in_rate_description").parent("td").attr("colspan","3");
	//FIX FOR D025463
	$("#in_rate_description").attr('size',60);
	$('form[name="raterevenueSearchForm"]').formatCasSearchForm({ 
		hasSavedSearchFeature: false, 
		customActions: [ ]
	});	
	$("#in_expiration_date_flag").click(function() {
		if($('#in_expiration_date_flag').attr('checked')){
			 document.getElementById('in_expiration_date_flag').value="Y";
		}else{
			document.getElementById('in_expiration_date_flag').value="ALL";
		}
	});
	var validComb=false;
	 var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     
     if(grpCode!=null && grpCode!="" && grpCode!="ALL"
			&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
				&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
			    
			validComb=true;
		}	
		if(! validComb ){//first page load
			
			$("#in_expiration_date_flag").attr("checked", true);
			document.getElementById('in_expiration_date_flag').value="Y";
		}
		 if($("#in_expiration_date_flag").val()=="ALL"){
			    $("#in_expiration_date_flag").attr("checked", false);
		    }
	    else{
			    $("#in_expiration_date_flag").attr("checked", true);
		}	
	// updated start
	//FIX FOR D025463
	$('.searchTable').children().children().children('tr:nth-child(4)').hide();
	$('.searchTable').children().children().children('tr:nth-child(5)').hide();
	$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(5)').hide();
	$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(6)').hide();
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(5)').hide();
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(6)').hide();
	
	if(document.raterevenueSearchForm.delete1.value!=null && document.raterevenueSearchForm.delete1.value != "delete1")
	{
		$('#msgDiv').hide();
	}
	if(document.raterevenueSearchForm.delete1.value != null && document.raterevenueSearchForm.delete1.value == "delete1")
	{
		//$("#delete_success").dialog("open");
		var messageContent= "Record has been deleted successfully.";
		$('#msgDiv').html(messageContent)
		//alert("Record has been deleted successfully.");
	}
	
		$('#DUMMY_FROM_GROUP_TYPE_CODE').hide();	
		$('#DUMMY_TO_GROUP_TYPE_CODE').hide();	
		$('#FROM_ENTITY_ID').hide();	
		$('td.dataField:contains("Dummy1:")').hide();
		$('td.dataField:contains("Dummy2:")').hide();
		$('td.dataField:contains("FROM_ENTITY_ID:")').hide();
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();	
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').after(
				'<tr>'+
				'<td>'+
				'<div id="showButtons">' +	
				'<table>' +
				'<br></br>' +
				'<tr>' +
				  '<td><input type="button" onclick="javascript:searchValue();"  id = "revenue_search"  value="Search" name="search" class="buttonNoFloat"></td>' +
				  '<td><input type="button" onclick="setClear();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
				'</tr>' +
			  	'</table>' +
			  	'</div>'+
			  	'</td>'+
			  	'<tr>'
	);
		
	$('#revenueCancel').click(function() {
		 var currentFuture = $("#in_expiration_date_flag").val();
		document.location.href = _context+ '/cas/rateDesriptionSearch.do?currentFuture='+currentFuture+'&exitfrom='+'exit';
		});
		document.getElementById('in_from_group_type').readOnly=true;
		document.getElementById('in_source_code').readOnly=true;
		document.getElementById('in_group_code').readOnly=true;
		document.getElementById('in_item_name').readOnly=true;
		document.getElementById('in_rate_description').readOnly=true;
		document.getElementById('in_to_group_type').readOnly=true;
		
		setdefaults();
		
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

function replaceWithCheckBox($obj, checkedValue) {

	if ($obj.length == 0)
	return;
	var $elemx = $(document.createElement("input"));
	var name = $obj[0].name
	var id = $obj[0].id
	var value = $obj[0].value

	var val = (value == checkedValue);
	$elemx.attr({
		type : 'checkbox',
		id : id,
		name : name,
		checked : val,
		defaultChecked : val,
		value : checkedValue
	});
	$obj.replaceWith($elemx); 
}

//function for reset form
function setdefaults(){
	
    if (($(document).getUrlParam("groupTypeCode")) != null) {
    	$("#in_group_type_code").val(unescape($(document).getUrlParam("groupTypeCode")));
    }
    if($("#in_group_type_code").val() == '01') {
    	$("#in_from_group_type").val('FRT-FREIGHT');
    }
	if (($(document).getUrlParam("sourceCode")) != null){
		$("#in_source_code").val(unescape($(document).getUrlParam("sourceCode")));
	}
	if (($(document).getUrlParam("groupCode")) != null){
		$("#in_group_code").val(unescape($(document).getUrlParam("groupCode")));
	}
	if (($(document).getUrlParam("itemCode")) != null){
		$("#in_item_name").val(unescape($(document).getUrlParam("itemCode")));
	}
	if (($(document).getUrlParam("rateId")) != null){
		$("#in_rate_description").val(unescape($(document).getUrlParam("rate")));
	}
	if (($(document).getUrlParam("rateId")) != null){
		$("#in_rate_id").val(unescape($(document).getUrlParam("rateId")));
	}
	if (($(document).getUrlParam("groupToTypeCode")) != null){
		$("#in_for_group_type").val(unescape($(document).getUrlParam("groupToTypeCode")));
	}
	if($("#in_for_group_type").val() == '04') {
    	$("#in_to_group_type").val('RDV-REV DIV');
    }
    //alert(($(document).getUrlParam("flagFuture")));
	if (($(document).getUrlParam("flagFuture")) != null){
	    if(($(document).getUrlParam("flagFuture"))=='Y'){
	        $("#in_expiration_date_flag").attr('checked','checked');
	    }else{
	        $("#in_expiration_date_flag").removeAttr('checked');
	    }
         $("#in_expiration_date_flag").val(($(document).getUrlParam("flagFuture")));
	}
	
	
	/*if (($(document).getUrlParam("groupTypeCode")) != null) {
    	$("#DUMMY_FROM_GROUP_TYPE_CODE").val(unescape($(document).getUrlParam("groupTypeCode")));
    }
	if (($(document).getUrlParam("groupToTypeCode")) != null){
		$("#DUMMY_TO_GROUP_TYPE_CODE").val(unescape($(document).getUrlParam("groupToTypeCode")));
	}*/
	
	if (($(document).getUrlParam("screenName")) == "wharfage") {
		document.getElementById("in_group_type_code").readOnly=true;
		document.getElementById("in_source_code").readOnly=true;
		document.getElementById("in_group_code").readOnly=true;
		document.getElementById("in_item_name").readOnly=true;
		document.getElementById("in_for_group_type").readOnly=true;
    }
	if (($(document).getUrlParam("groupTypeCode")) != null && ($(document).getUrlParam("groupToTypeCode"))) {
		  
		   var frm = document.forms["raterevenueSearchForm"];	  
		   frm.method.value="show";	  
		   postMethod('search',frm.method);
		}
	
}


function addLinkRevenue(){
	var grpTypCode =document.getElementById('in_group_type_code').value;
	var currentFuture = $("#in_expiration_date_flag").val();
	
	if(grpTypCode!="ALL" && grpTypCode!=null && grpTypCode!="")
		{
		if(grpTypCode=="FRT-FREIGHT"){
			grpTypCode = "01";
		}
		
	 var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     var rate = document.getElementById('in_rate_description').value;
     var  fromRateId = $('input[name="rateId"]').val();
     var screen ="drayage";
    
     document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTypCode+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+fromRateId+'&screenName='+screen+'&isCurrentFuture='+currentFuture;
		}
	else
	{
		alert(" Source Tariff and Group Name is mandatory");
	}
}

//function for CAS Search
function searchValue(){
	   // alert(rateid)
    postMethod('search',document.raterevenueSearchForm.method);
	return true;	
}
function searchValueDefault(){
	 postMethod('search',document.raterevenueSearchForm.method);
		return true;
}
function setClear(){
	
   
	 $('#resultdiv').hide();
	 $('#msgDiv').hide();
		document.raterevenueSearchForm.delete1.value = "";

	// $('#revenue_search').attr("disabled","disabled");
	 $('#in_expiration_date_flag').attr("checked",true);
	 $('#in_expiration_date_flag').val('Y');
	 $('#add_link').attr("disabled","disabled");
	 $('#delete').attr("disabled","disabled");
	 
	
}
function loadSeq(conditionID){
	var searchLength = document.raterevenueSearchForm.searchInput.length;
	var condToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var currentFuture= $("#in_expiration_date_flag").val();
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.raterevenueSearchForm.searchInput[i].checked;
			searchInp = document.raterevenueSearchForm.searchInput[i].value;
		} else {
			checked = document.raterevenueSearchForm.searchInput.checked;
			searchInp = document.raterevenueSearchForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selCond = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selCond = temp[0];
			condToUpdate = condToUpdate + searchInp + ",";

		}
	}
	if (selCount == 0) {
		document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+conditionID+'&screenParam=revenueLinkage&isCurrentFuture='+currentFuture+'&screenName=drayage';
		//document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+conditionID+'&screenParam=revenueLinkage&key=From&screenName=drayage';
		} else {
			document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+condToUpdate+'&screenParam=revenueLinkage&isCurrentFuture='+currentFuture+'&screenName=drayage';
			//document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+condToUpdate+'&screenParam=revenueLinkage&key=From&screenName=drayage';
	}
}

function deleteRevenue()
{
	
	var searchLength=document.raterevenueSearchForm.searchInput.length;
	var condCanDel="";	
	 var  rateId = $('input[name="rateId"]').val();
	var fromEntityId=rateId;
	var fromEntityCode="TRRD";
	var tariffgrpType = "01";
	var grpType=$('#in_group_type').val();
	grpNameUse= document.getElementById('in_group_code').value;
	var grpCode = document.getElementById('in_group_code').value;
	grpSrcUse = document.getElementById('in_source_code').value;
	var sourceCode = document.getElementById('in_source_code').value;
	itmNameUse = document.getElementById('in_item_name').value;
	var itemCode=document.getElementById('in_item_name').value;
	var rate = document.getElementById('in_rate_description').value;
	var currentFuture = document.getElementById('in_expiration_date_flag').value;
	var rateId="";
	var screen="drayage";
	var tariffTogrpType = "04";
	var  fromRateId = $('input[name="rateId"]').val();
	if(typeof(searchLength)=="undefined"){		
		searchLength=1;
	}		
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";

   		if(searchLength!=1){
   			checked = document.raterevenueSearchForm.searchInput[i].checked;
   			searchInp = document.raterevenueSearchForm.searchInput[i].value;
   		}else{
   			checked = document.raterevenueSearchForm.searchInput.checked;
   			searchInp = document.raterevenueSearchForm.searchInput.value;
   		}   		
		if(checked)
		{
			selCount=selCount+1;
			var selItem="";			
			var temp = new Array();
			temp = searchInp.split(',');
			selItem=temp[0];						
			condCanDel = condCanDel + selItem +",";			
		}
	}
	if(selCount==0){
		alert("Please select at least one Item for deletion !!");
		return;
	}else{
		if(condCanDel !="")
        {		   
	   		var r=confirm("Do you really want to delete the selected record(s)?"); 	  		
	   		if (r==true){ 	 		 	
	   		 $.ajax({
				   type: "POST",
				   url: _context +"/condition/deleteTariffCondition?",
				   data: {
				   		condTodelete: condCanDel,
		 		 		 entityId: fromEntityId,
		 		 		 entityCode: fromEntityCode,
				   },
				   success: function(msg){
					   	if (msg == "Deleted Sucessfully"){						   		
					   		document.location.href =_context + "/cas/rateRevenueSearch.do?delete1=delete1"+'&groupTypeCode='+ tariffgrpType+"&sourceCode="+grpSrcUse+"&groupCode="+grpNameUse+"&itemCode="+itmNameUse+"&rateDescription="+rate+"&groupToTypeCode="+tariffTogrpType+"&screenName="+screen+"&isCurrentFuture="+currentFuture;

					   	}else{
					   		//alert(msg);
					   	} 
					 }
				 });
	   		  }else{
	   			return;
	   		  }		
	    }
	}
	
	/*var searchLength=document.raterevenueSearchForm.searchInput.length;
	var condCanDel="";	
	var tariffgrpType = "01";
	var grpType=$('#in_group_type').val();
	grpNameUse= document.getElementById('in_from_group_type').value;
	var grpCode = document.getElementById('in_group_code').value;
	grpSrcUse = document.getElementById('in_source_code').value;
	var sourceCode = document.getElementById('in_source_code').value;
	itmNameUse = document.getElementById('in_item_name').value;
	var itemCode=document.getElementById('in_item_name').value;
	var rate = document.getElementById('in_rate_description').value;
	var currentFuture = document.getElementById('in_expiration_date_flag').value;
	var rateId="";
	var tariffTogrpType = "04";
    var screen ="drayage";
	var searchLength = document.raterevenueSearchForm.searchInput.length;
	 var rate = document.getElementById('in_rate_description').value;
     var  fromRateId = $('input[name="rateId"]').val();
	var fromEntityCode="TRRD";
	if(typeof(searchLength)=="undefined"){		
		searchLength=1;
	}		
	var fromEntityId=rateId;
	var fromEntityCode="TRRD";
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";
		
   		if(searchLength!=1){
   			checked = document.raterevenueSearchForm.searchInput[i].checked;
   			searchInp = document.raterevenueSearchForm.searchInput[i].value;
   		}else{
   			checked = document.raterevenueSearchForm.searchInput.checked;
   			searchInp = document.raterevenueSearchForm.searchInput.value;
   		}   		
		if(checked)
		{
			selCount=selCount+1;
			var selItem="";			
			var temp = new Array();
			temp = searchInp.split(',');
			selItem=temp[0];						
			condCanDel = condCanDel + selItem +",";			
		}
	}
	if(selCount==0){
		alert("Please select at least one Item for deletion !!");
		return;
	}else{
		if(condCanDel !="")
        {		   
	   		var r=confirm("Do you really want to delete the selected record(s)?"); 	  		
	   		if (r==true){ 	 		 	
	   		 $.ajax({
				   type: "POST",
				  
				   url: _context +"/condition/deleteTariffCondition?",
				   data: {
				   		condTodelete: condCanDel,
		 		 		 entityId: fromEntityId,
		 		 		 entityCode: fromEntityCode,
				   },
				   success: function(msg){
					   	if (msg == "Deleted Sucessfully"){						   		
					   		document.location.href =_context + "/cas/rateRevenueSearch.do?delete1=delete1"+'&groupTypeCode='+ tariffgrpType+"&sourceCode="+grpSrcUse+"&groupCode="+grpNameUse+"&itemCode="+itmNameUse+"&rateDescription="+rate+"&groupToTypeCode="+tariffTogrpType+"&fromRateId="+fromRateId+"&screenName="+screen+"&isCurrentFuture="+currentFuture;
				   		 	
					   	}else{
					   		//alert(msg);
					   	} 
					 }
				 });
	   		  }else{
	   			return;
	   		  }		
	    }
	}*/
}
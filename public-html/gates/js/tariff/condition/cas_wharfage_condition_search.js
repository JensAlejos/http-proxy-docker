$(document).ready(function(){	

	tabSequence('#tabSequence');
	
	    $('#in_dummy_from_group_type').hide();	
	    $('#in_dummy_to_group_type').hide();
		$('#dummy_from_group_type_cd').hide();	
		$('#dummy_to_group_type_cd').hide();
		$('td.dataField:contains("Dummy1:")').hide();
		$('td.dataField:contains("Dummy2:")').hide();
		
		
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
		if(document.wharfageConditionSearchForm.delete1.value != "delete1")
		{
			$('#msgDiv').hide();
		}
		if(document.wharfageConditionSearchForm.delete1.value == "delete1")
		{
			//$("#delete_success").dialog("open");
		var messageContent= "Record has been deleted successfully.";
		$('#msgDiv').html(messageContent)
			//alert("Record has been deleted successfully.");
		}
		replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());
		setdefaults();
		$("#in_expiration_date_flag").click(function() {
			if($('#in_expiration_date_flag').attr('checked')){
				 document.getElementById('in_expiration_date_flag').value="Y";
				 document.wharfageConditionSearchForm.currentFuture.value=true;
			}else{
				document.getElementById('in_expiration_date_flag').value="ALL";
				document.wharfageConditionSearchForm.currentFuture.value=false;
			}
		});
		var currentFuture = document.wharfageConditionSearchForm.currentFuture.value;
		if(currentFuture=="true" || currentFuture==true || currentFuture=="Y"){
			$("#in_expiration_date_flag").attr("checked", true);
			document.getElementById('in_expiration_date_flag').value="Y";
			$("#in_expiration_date_flag").val("Y");
		}else{
			$("#in_expiration_date_flag").attr("checked", false);
			document.getElementById('in_expiration_date_flag').value="ALL";
			$("#in_expiration_date_flag").val("ALL");
		}
		var validComb=false;
		var grpCode = document.wharfageConditionSearchForm.groupTypeCode.value; 
		var sourceCode = document.wharfageConditionSearchForm.sourceCode.value;
		var itemCode=document.getElementById('in_item_name').value;
		if(grpCode!=null && grpCode!="" && grpCode!="ALL"
			&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
				&& itemCode!=null && itemCode!="" && itemCode!="ALL"){
			   
			validComb=true;
		}	
		if( !validComb ){//first page load
			
			$("#in_expiration_date_flag").attr("checked", true);
			 $('#in_expiration_date_flag').val('Y');
			 
		}
	
		$('form[name="wharfageConditionSearchForm"]').formatCasSearchForm({ 
			hasSavedSearchFeature: false, 
			customActions: [ ]
		});
		
		document.getElementById('in_from_group_type_code').readOnly=true;
		document.getElementById('in_source_code').readOnly=true;
		document.getElementById('in_group_code').readOnly=true;
		document.getElementById('in_item_name').readOnly=true;
		document.getElementById('in_to_group_type_code').readOnly=true;
		
		
		
		$("#in_from_group_type_code").attr("style","width: 120px");
		$("#in_source_code").attr('size',8);
		$("#in_group_code").attr('size',8);
		$("#in_item_name").attr('size',8);
		
		// div for "Search" and "Clear" buttons
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(3)').after(
				'<div id="showButtons">' +	
				'<table>' +
				'<br></br>' +
				'<tr>' +
				  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
				  '<td><input type="button" onclick="setClear();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
				'</tr>' +
			  	'</table>' +
			  	'</div>'	
		 );
		
		// hide CAS generated "Search" and "Clear" Button
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(3)').hide();
		
		$('#wharfageCancel').click(function() {
			
          var grpTypCode = document.getElementById('in_from_group_type_code').value;
          var srcCode = document.getElementById('in_source_code').value;
          var grpName = document.getElementById('in_group_code').value;
          var itemName = document.getElementById('in_item_name').value;
          var currentFuture = document.wharfageConditionSearchForm.currentFuture.value;
			$.ajax({
				   type: "GET",
				   url: _context +"/condition/getItemDetail?",
				   data: {
		 		 		 
					   grpTypCode : "01",
					   srcCode : srcCode,
					   grpName : grpName,
					   itemName :itemName
				   },
				   success: function(msg){
					 
					  var itemId =msg;
					   document.location.href=_context +'/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+itemId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit';
				   }
				   });
		
		 });
//		var item= unescape($(document).getUrlParam("itemCode"));
//		alert('item '+item);
		
		var screenName  = unescape($(document).getUrlParam("screenName"));
		if(screenName=="wharfage"){
			//itemCode=unescape($(document).getUrlParam("itemCode"));
			postMethod('search',document.wharfageConditionSearchForm.method);
			
		}
		
		var groupTypeCode = document.wharfageConditionSearchForm.groupTypeCode.value; 
		
		var groupCode = document.wharfageConditionSearchForm.groupCode.value;
		var currentFuture = document.wharfageConditionSearchForm.currentFuture.value;
		 
		
		  if(groupTypeCode!=null || groupTypeCode!='')
				{
			  if(groupTypeCode == '01') {
			    	$("#in_from_group_type_code").val('FRT-FREIGHT');
			 }
				}
			 if(sourceCode!=null || sourceCode!='')
				{
				$('#in_source_code').val(sourceCode);
				
				} 
			 if(groupCode!=null || groupCode!='')
				{
				$('#in_group_code').val(groupCode);
				$("input[type=button][value=Search]").removeAttr("disabled");
				} 
//			 if(itemCode!=null || itemCode!='')
//				{
//			
//				$('#in_item_name').val(itemCode);
//				} 
//		
			
			 if($("#in_expiration_date_flag").val()=="ALL"){
				    $("#in_expiration_date_flag").attr("checked", false);
			    }
		    else{
				    $("#in_expiration_date_flag").attr("checked", true);
			}	

});

//function for CAS Search
function searchValue(){
		document.wharfageConditionSearchForm.delete1.value = "";
		$('#msgDiv').hide();
		postMethod('search',document.wharfageConditionSearchForm.method);
		return true;	
	
}

//function for reset form
function setClear(){
	document.wharfageConditionSearchForm.delete1.value = "";
	$('#msgDiv').hide();
	$('#displaybase').remove();	
	//resetFileds(document.tariffConditionForm);
	/*document.tariffConditionForm.TO_KEY.checked = false;
	document.tariffConditionForm.DUMMY2.checked = false;
	document.tariffConditionForm.FROM_ENTITY_ID.checked = false;*/
	$('#in_expiration_date_flag').attr("checked",true);
	 $('#in_expiration_date_flag').val('Y');
	/*$("#GROUP_TYPE_CODE").val('01');
	$("#SOURCE_CODE").val('');
	$("#GROUP_CODE").val('');
	$("#ITEM_NAME").val('');
	$("#RATE_DESCRIPTION").val('');
	*/
}


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




function loadSeq(conditionID)
{
	var searchLength = document.wharfageConditionSearchForm.searchInput.length;
	var condToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	 var currentFuture= document.wharfageConditionSearchForm.currentFuture.value;
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.wharfageConditionSearchForm.searchInput[i].checked;
			searchInp = document.wharfageConditionSearchForm.searchInput[i].value;
		} else {
			checked = document.wharfageConditionSearchForm.searchInput.checked;
			searchInp = document.wharfageConditionSearchForm.searchInput.value;
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
		document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+conditionID+'&screenParam=WarfageLinkage&isCurrentFuture='+currentFuture+'&screenName=wharfage';
		} else {
			document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+condToUpdate+'&screenParam=WarfageLinkage&isCurrentFuture='+currentFuture+'&screenName=wharfage';
	}

	/*document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+conditionID;*/
}

function addLinkCondition()
{
	 var grpTyp = document.getElementById('in_from_group_type_code').value;
	
	 grpTyp = '01';
     var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     var currentFuture= document.wharfageConditionSearchForm.currentFuture.value;
     var screen ="link";
    
	var conditionID = $(":checkbox:checked").val();
	var pass= true;
	if((grpCode=="" || grpCode.toUpperCase()=="ALL")||(sourceCode=="" || sourceCode.toUpperCase()=="ALL")){
		pass= false;
	}
	if(pass){
		document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription=ALL&fromRateId=ALL&screenName=wharfage&isCurrentFuture='+currentFuture;
	}
	else{
		alert(" Source Tariff and Group Name is mandatory");
	}	
}





//function for reset form
function setdefaults(){	
    if (($(document).getUrlParam("groupTypeCode")) != null) {
    	$("#in_from_group_type_code").val(unescape($(document).getUrlParam("groupTypeCode")));
    }
    if($("#in_from_group_type_code").val() == '01') {
    	$("#in_from_group_type_code").val('FRT-FREIGHT');
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
	if (($(document).getUrlParam("groupToTypeCode")) != null){
		$("#in_to_group_type_code").val(unescape($(document).getUrlParam("groupToTypeCode")));
	}
	if($("#in_to_group_type_code").val() == '02') {
    	$("#in_to_group_type_code").val('WFG-WHARFAGE');
    }
	if (($(document).getUrlParam("groupTypeCode")) != null) {
    	$("#in_dummy_from_group_type").val(unescape($(document).getUrlParam("groupTypeCode")));
    }
	if (($(document).getUrlParam("groupToTypeCode")) != null){
		$("#in_dummy_to_group_type").val(unescape($(document).getUrlParam("groupToTypeCode")));
	}
	var currentFuture = document.wharfageConditionSearchForm.currentFuture.value;
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y"){
		$("#in_expiration_date_flag").attr("checked", true);
		document.getElementById('in_expiration_date_flag').value="Y";
		$("#in_expiration_date_flag").val("Y");
	}else{
		$("#in_expiration_date_flag").attr("checked", false);
		document.getElementById('in_expiration_date_flag').value="ALL";
		$("#in_expiration_date_flag").val("ALL");
	}
	if (($(document).getUrlParam("screenName")) == "wharfage") {
		document.getElementById("in_from_group_type_code").readOnly=true;
		document.getElementById("in_source_code").readOnly=true;
		document.getElementById("in_group_code").readOnly=true;
		document.getElementById("in_item_name").readOnly=true;
		document.getElementById("in_to_group_type_code").readOnly=true;
    }
	if (($(document).getUrlParam("groupTypeCode")) != null && ($(document).getUrlParam("groupToTypeCode"))) {
		  
		   var frm = document.forms["wharfageConditionSearchForm"];	  
		   frm.method.value="show";	  
		   postMethod('search',frm.method);
		}
	
}

function deleteCondition() {
	var searchLength=document.wharfageConditionSearchForm.searchInput.length;
	var condCanDel="";		
	var fromEntityId="";
	var fromEntityCode="TRSI";
	
	var tariffgrpType = "01";
	
			$("#in_from_group_type_code").val('01');
		
	var tariffTogrpType = "02";
	$("#in_to_group_type_code").val('02');
	
	 var tariffgrpName = document.getElementById('in_group_code').value;
     var tariffsrc = document.getElementById('in_source_code').value;
     var tariffItem = document.getElementById('in_item_name').value;
     var currentFuture = $('#in_expiration_date_flag').val(); 
     
	if(typeof(searchLength)=="undefined"){		
		searchLength=1;
	}		
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";
		
   		if(searchLength!=1){
   			checked = document.wharfageConditionSearchForm.searchInput[i].checked;
   			searchInp = document.wharfageConditionSearchForm.searchInput[i].value;
   		}else{
   			checked = document.wharfageConditionSearchForm.searchInput.checked;
   			searchInp = document.wharfageConditionSearchForm.searchInput.value;
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
					   	 document.location.href =_context + "/cas/wharfageConditionSearch.do?delete1=delete1"+'&groupTypeCode=' + tariffgrpType + '&sourceCode='+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture;			   		 	
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
}
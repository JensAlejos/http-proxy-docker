$(document).ready(
		function() {
			var dataName=null;
			setdefaults();
			$('#in_source_code').gatesAutocomplete({
				source:_context+'/cas/autocomplete.do',
			 	extraParams: {
		 		 		 		 method: 'searchTariffSource',
		 		 		 		 searchType: '11',
		 		 		 		 groupType:  function() { return $('#in_group_type_code').val(); }
				 		 	 },
				 formatItem: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 formatResult: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 select: function(data) {
				 		 $('#in_source_code').val(data.id);	
				 		 $('input[name="grpId"]').val(data.id);
				 		 if($('#in_group_type_code').val()=="01"){
				 			 $('#in_group_code').val(data.name);
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
				 if(anyOneChecked)
				 {
				 if (_readonly) {
						$('#_eventId_del').gatesDisable();   
						$('#authorization').gatesDisable();
				}
				 else
				 $('#_eventId_del').removeAttr("disabled");
				 
			     }
				 var grpTyp=$('#in_group_type_code').val();
				 if(anyOneChecked && grpTyp =='01' ){
					
					 if(!_readonlyGroupSearch){
						 $('#_eventId_replicate').removeAttr("disabled");
					 }
					 $('#_eventId_item').removeAttr("disabled");
					 $('#_eventId_condition').removeAttr("disabled");
				 }
				 else if(anyOneChecked && grpTyp !='01')
					 {
						 $('#_eventId_item').removeAttr("disabled");
						 $('#_eventId_condition').removeAttr("disabled");
					 }
				 else{
					 setdefaults();
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
			if(document.tariffGroupForm.delete1.value!=null && document.tariffGroupForm.delete1.value != "delete1")
			{
				$('#msgDiv').hide();
			}
			if(document.tariffGroupForm.delete1.value != null && document.tariffGroupForm.delete1.value == "delete1")
			{
				//$("#delete_success").dialog("open");
				var messageContent= "Record has been deleted successfully.";
				$('#msgDiv').html(messageContent)
				//alert("Record has been deleted successfully.");
			}
			//Blurr the data for invalid group Id
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

			 $('#in_group_code').gatesAutocomplete({
				 source:  _context+'/cas/autocomplete.do',
				 extraParams: {
		 		 		 		 method: 'searchGroupName',
		 		 		 		 searchType: '10',
		 		 		 		 groupType:  function () { return $('#in_group_type_code').val(); },
		 		 		 		 sourceTariff:  function () { return $('#in_source_code').val(); }				 		 		 		 
				 		 		},
				 formatItem: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
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
				 }		 
			});	
		//Blurr the data for invalid group Id
		 $('#in_group_code').change(function(){
				if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
		        	$("#in_group_code").val("ALL"); 
		    	}
				else{
					$("#in_group_code").val(dataName); 
					$('input[name="grpId"]').val("");
				}
		    }); 

			$('form[name="tariffGroupForm"]').formatCasSearchForm({
				hasSavedSearchFeature : false,
				customActions : []
			});
			
			$('#in_group_type_code').change(function(){	
			
				 $('#_eventId_replicate').attr("disabled","disabled");
				 $('#_eventId_item').attr("disabled","disabled");
				 $('#_eventId_condition').attr("disabled","disabled");
				 $('#_eventId_del').attr("disabled","disabled");
				 $('input[name="grpId"]').val("");
				javascript:resetFileds(this.form);
		    });
			
			// Source Tariff and Group Name-er should not be able to enter more then 6 char.
			
			$("#in_group_code").get(0).setAttribute("maxlength", 6);
			
			$("#in_source_code").get(0).setAttribute("maxlength", 6);


			replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());


			$("#in_expiration_date_flag").click(function() {
				if($('#in_expiration_date_flag').attr('checked')){
					 document.getElementById('in_expiration_date_flag').value="Y";
				}else{
					document.getElementById('in_expiration_date_flag').value="ALL";
				}

			});

			/*var grpCode = document.getElementById('in_group_code').value;
			var sourceCode = document.getElementById('in_source_code').value;
			var validComb=false;

			if(grpCode!=null && grpCode!="" && grpCode!="ALL"
				&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"
					){
				    
				validComb=true;
			}*/
			if(_noRecFlag == "null" ){//first page load
				$("#in_expiration_date_flag").attr("checked", true);
				document.getElementById('in_expiration_date_flag').value="Y";
			}
			
			// code to bind pop up search
			 $('#in_group_code').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
			 $('#in_source_code').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	 
			
			 
			 //reset page on change of group type
			 $("#in_group_type_code").change(function() {
				 $('#msgDiv').hide();
					document.tariffGroupForm.delete1.value ="";
					$("#in_source_code").val("ALL");
					$("#in_group_code").val("ALL");
					//hide display grid too
					if(document.getElementById("displaybase")!=null)
					{
					    document.getElementById("displaybase").style.display="none";
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
					
					if(anyOneChecked)
					 {
					 if (_readonly) {
							$('#_eventId_del').gatesDisable();   
							$('#authorization').gatesDisable();
					}
					 else
					 $('#_eventId_del').removeAttr("disabled");
					 
				     }
					 var grpTyp=$('#in_group_type_code').val();
					 if(anyOneChecked && grpTyp =='01' ){
						
						 if(!_readonlyGroupSearch){
							 $('#_eventId_replicate').removeAttr("disabled");
						 }
						 $('#_eventId_item').removeAttr("disabled");
						 $('#_eventId_condition').removeAttr("disabled");
					 }
					 else if(anyOneChecked && grpTyp !='01')
						 {
							 $('#_eventId_item').removeAttr("disabled");
							 $('#_eventId_condition').removeAttr("disabled");
						 }
					 else{
						 setdefaults();
					 }
				});
			 
			 /*	 $('div.searchTable').parent().parent().parent().children('tr:nth-child(3)').hide();*/
			
			// div for "Search" and "Clear" buttons
				$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').after(
						'<tr>'+
						'<td>'+
						'<div id="showButtons">' +	
						'<table>' +
						'<br></br>' +
						'<tr>' +
						  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
						  '<td><input type="button" onclick="setClear();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
						'</tr>' +
					  	'</table>' +
					  	'</div>'+
					  	'</td>'+
					  	'<tr>'
			);
			$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').remove();
			var groupTypeCode = document.tariffGroupForm.groupTypeCode.value; 
			var sourceCode = document.tariffGroupForm.sourceCode.value;
			var groupCode = document.tariffGroupForm.groupCode.value;
			var currentFuture = document.tariffGroupForm.currentFuture.value;
			//alert(currentFuture);
		
			if(groupTypeCode!=null && groupTypeCode!='' )
			{
			$('#in_group_type_code').val(groupTypeCode);
			}
	       if(sourceCode!=null && sourceCode!='')
			{
			$('#in_source_code').val(sourceCode);
			$("input[type=button][value=Search]").removeAttr("disabled");
	        }
	        if(groupCode!=null && groupCode!='')
		    {
		    $('#in_group_code').val(groupCode);
				 
		    }
	        if(currentFuture!=null && currentFuture!='')
		    {
	        	if(currentFuture=="Y"){
	        		$("#in_expiration_date_flag").attr("checked", true);
	        	}
	        	else{
		     $("#in_expiration_date_flag").attr("checked", false);
	        	}
	 }
	   	/*  removing this for javscript error*/
	     /*  if(_displayonly){
	    	   $('#_eventId_add').attr("disabled","disabled");
					 
				 }*/
	      
	       var _prefDate= $('input[name="prefDateSessionVar"]').val();	
			
			if(_prefDate!=null && _prefDate!=''){
				$("#preferencedate").val(_prefDate);
				$("#preferencedate").datepicker('setDate',_prefDate);
			}
			$('#in_expiration_date_flag').addClass('noTab');
			$('#displaybase a').addClass('noTab');
			$('#displaybase select').addClass('noTab');
			$('#displaybase input[type="checkbox"]').addClass('noTab');
			tabSequence('#tabSequence');
		});

 
function postMethod(methodName, obj) {
	
	var frm = obj.form;
	obj.value = methodName;
	if (methodName == "search") {
		if (frm.searchActionStatus != null) {
			frm.searchActionStatus.value = "1";
		}
	}
	var error = "";
	error = validateSearch();
	if (error == false) {
		alert("Search Criteria Required");
		return;
	} else {
		frm.submit();
	}
}

function validateSearch() {
return true;
}


function loadTariffGroupDetails(tariffServgrpId) {

	var tariffServgrpType = document.tariffGroupForm.filterValue1.value;
	var currentFuture=document.tariffGroupForm.filterValue4.value;
	var searchLength = document.tariffGroupForm.searchInput.length;
	var tariffServSrcCode=$('#in_source_code').val();
	var tariffServgrpCode=$('#in_group_code').val();
	var grpToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffGroupForm.searchInput[i].checked;
			searchInp = document.tariffGroupForm.searchInput[i].value;
		} else {
			checked = document.tariffGroupForm.searchInput.checked;
			searchInp = document.tariffGroupForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selGroup = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selGroup = temp[0];
			grpToUpdate = grpToUpdate + selGroup + ",";

		}
	}

	if (selCount == 0) {
		document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode+"&currentFuture="+currentFuture;
	} else {
		document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ grpToUpdate + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode+"&currentFuture="+currentFuture;
	}
}

function createTariffGroup() {
	var tariffServgrpId = "DUMMY";
	var tariffServgrpType = $('#in_group_type_code').val();
	var tariffServSrcCode=$('#in_source_code').val();
	var tariffServgrpCode=$('#in_group_code').val();
	document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
}

function replaceWithCheckBox($obj, checkedValue) {
	
	var status=false;
	//alert('checkedValue'+checkedValue);
	if(checkedValue=="Y" ){
		status=true;
	}else if (checkedValue=="N"||checkedValue=="ALL"){
		status=false;
	}
	//alert('status'+status);
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
	
	$("#in_expiration_date_flag").attr("checked", status);//should be checked by default
}

function deleteItem() {

	var searchLength = document.tariffGroupForm.searchInput.length;
	var grpcanDel = "";
	var grpcantDel = "";
	// alert('searchLength-'+searchLength);

	if (typeof (searchLength) == "undefined") {
		// alert('Inside undefined');
		searchLength = 1;
	}
	// alert('searchLength-'+searchLength);
	// alert('document.tariffGroupForm.searchInput.checked'+document.tariffGroupForm.searchInput.checked);

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffGroupForm.searchInput[i].checked;
			searchInp = document.tariffGroupForm.searchInput[i].value;
		} else {
			checked = document.tariffGroupForm.searchInput.checked;
			searchInp = document.tariffGroupForm.searchInput.value;
		}

		if (checked) {
			//alert("searchInp>>>>>>>>>>>>>>>" + searchInp);
			selCount = selCount + 1;
			var selGroup = "";
			var itemCnt = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selGroup = temp[0];
			itemCnt = temp[1];
			// alert('Selected grp'+selGroup +'has '+itemCnt +'items associated
			// !');
			if (itemCnt > 0) {
				grpcantDel = grpcantDel + selGroup + ",";
			} else {
				grpcanDel = grpcanDel + selGroup + ",";
			}

		}
	}
	if (selCount == 0) {
		alert("Please select at least one Group for deletion !!");
		return;
	} else {
		if (grpcantDel != "") {
			alert('Tariff group(s) '
					
					+ 'can not be deleted as there are some Tariff Items associated with it.!!');
			return;
		} else {
			
			//TO DO: AJAX calll to verify that there are no items and give alert and return
			
			//double verification for Existing of Item
			$.ajax({
			   type: "GET",
			   url: _context +"/tariffGroup/validateItemsForGroup?",
			   data: "grpIds="+grpcanDel,
			   success: function(msg){
				   if(msg=="NotValid"){
					   alert('Tariff group(s) '
								
								+ 'can not be deleted as there are some Tariff Items associated with it.!!');; 
					   return;
					}else{
			
							var r = confirm("Do you really want to delete the selected group(s)?");
							if (r == true) { 	 		 	
						   		 $.ajax({
									   type: "POST",
									   url: _context +"/tariffGroup/deleteTariffServiceGroup?",
									   data: "grpsTodelete="+ grpcanDel,
									   success: function(msg){
										   	if (msg == "Deleted Sucessfully"){
										   	 document.location.href =_context + "/cas//tariffServGrpSearch.do?delete1=delete1";
										   	}else{
										   		alert(msg);
										   	} 
										 }
									 });
						   		  } else {
								return;
							}
						}
				   }
			});
		}
	}
}
function replicateGroup()
{
	document.tariffGroupForm.delete1.value = "";
	var grpId = $(":checkbox:checked").val();
	var screen='01';
//	var grpI = grpId.split(",");
//	grpId = grpI[0];
	var tariffServgrpType = document.tariffGroupForm.filterValue1.value;

	var searchLength = document.tariffGroupForm.searchInput.length;
	var grpToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffGroupForm.searchInput[i].checked;
			searchInp = document.tariffGroupForm.searchInput[i].value;
		} else {
			checked = document.tariffGroupForm.searchInput.checked;
			searchInp = document.tariffGroupForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selGroup = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selGroup = temp[0];
			grpToUpdate = grpToUpdate + selGroup + ",";

		}
	}

	if (selCount == 0) {
		grpId=grpId;
	} else {
		grpId=grpToUpdate;
	}
	
	if(tariffServgrpType =='01')
		 
	{ 
		{document.location.href=_context+'/tm/replicateGroup/showForm?grpId='+grpId+'&screen='+screen;}
	}
	else{
		alert("Not a valid Group Type.");
	}
}
function conditionSearch()
{
	document.tariffGroupForm.delete1.value = "";
	var grpId = $(":checkbox:checked").val();
	var tariffgrpType=document.tariffGroupForm.filterValue1.value;
	var searchLength = document.tariffGroupForm.searchInput.length;
	var currentFuture=document.tariffGroupForm.filterValue4.value;
	var key="From";
	if(tariffgrpType!="01"){
			key="To";
	}
	var grpToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";
     
		if (searchLength != 1) {
			checked = document.tariffGroupForm.searchInput[i].checked;
			searchInp = document.tariffGroupForm.searchInput[i].value;
		} else {
			checked = document.tariffGroupForm.searchInput.checked;
			searchInp = document.tariffGroupForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selGroup = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selGroup = temp[0];
			grpToUpdate = grpToUpdate + selGroup;

		}
	}

	if (selCount>1) {
		alert("Select only One record for Condition Search");
		return;
	} else {
		$.ajax({
			   type: "GET",
			   url: _context +"/tariffGroup/getGrpDetailsOnItemSearch?",
			   data: "grpId="+grpToUpdate,
			   success: function(msg){
				   if(msg!=null && msg!=""){
					   var resp = new Array();
					   
					   resp=msg.split(',');
					   srcCode=resp[0];
					   grpCode=resp[1];
					   submiturl=_context +"/cas/tariffConditionSearch.do?";
					   submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+srcCode+"&groupCode="+grpCode+"&itemCode=ALL&rateDescription=ALL&from=group&currentFuture="+currentFuture+"&key="+key+"&from=group";
					   document.location.href =submiturl+submitdata;	
					}
				   }
			});
	}
}


function getValueFromhyperTag(obj)
{	var tempObj=obj.split(">");
    var tempObj1=tempObj[1].split("<");
    var returnObj = tempObj1[0]; 	
    return returnObj;
}


function itemSearch()
{
	document.tariffGroupForm.delete1.value = "";
	var grpId = $(":checkbox:checked").val();
	var tariffgrpType=document.tariffGroupForm.filterValue1.value;
	var searchLength = document.tariffGroupForm.searchInput.length;
	var currentFuture=document.tariffGroupForm.filterValue4.value;
	document.getElementById('in_expiration_date_flag').value=currentFuture;
	var grpToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffGroupForm.searchInput[i].checked;
			searchInp = document.tariffGroupForm.searchInput[i].value;
		} else {
			checked = document.tariffGroupForm.searchInput.checked;
			searchInp = document.tariffGroupForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selGroup = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selGroup = temp[0];
			grpToUpdate = grpToUpdate + selGroup;

		}
	}

	if (selCount>1) {
		alert("Select only One record for Item Search");
		return;
	} else {
		$.ajax({
			   type: "GET",
			   url: _context +"/tariffGroup/getGrpDetailsOnItemSearch?",
			   data: "grpId="+grpToUpdate,
			   success: function(msg){
				   if(msg!=null && msg!=""){
					   var resp = new Array();
					   resp=msg.split(',');
					   srcCode=resp[0];
					   grpCode=resp[1];
					 	submiturl=_context +"/cas/tariffItemSearch.do?from=_group&";
						submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+srcCode+"&groupCode="+grpCode+"&currentFuture="+currentFuture+"&tariffGrpId="+grpToUpdate;
						document.location.href =submiturl+submitdata;	
					}
				   }
			});
	}

}

function SourceTariffPopupSearch() {   
	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
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

function setdefaults(){
	 $('#_eventId_del').attr("disabled","disabled");
	 $('#_eventId_replicate').attr("disabled","disabled");
	 $('#_eventId_item').attr("disabled","disabled");
	 $('#_eventId_condition').attr("disabled","disabled");
	 $('input[name="grpId"]').val("");
	 
}
//function for CAS Search
function searchValue(){
	$('#msgDiv').hide();
	document.tariffGroupForm.delete1.value ="";
	if(($('#SOURCE_CODE').val()== "ALL" ) || ($('#SOURCE_CODE').val() == "all")) {
			alert('Source Tariff is mandatory');
			return false;	
	}
	if(($('#GROUP_CODE').val()== "ALL" ) || ($('#GROUP_CODE').val() == "all")) {
		alert('Group Name is mandatory');
		return false;	
    }	
	else{
		postMethod('search',document.tariffGroupForm.method);
		return true;	
	}	
}
function searchValueDefault(){
	$('#in_group_type_code').val(document.tariffGroupForm.groupTypeCode.value);
	$('#in_source_code').val(document.tariffGroupForm.sourceCode.value);
	$('#in_group_code').val(document.tariffGroupForm.groupCode.value);
	$('#in_expiration_date_flag').val(document.tariffGroupForm.currentFuture.value);
	var paging =document.tariffGroupForm.paging.value;
	var pagingStatus=is_int(paging);
	if(document.tariffGroupForm.currentFuture.value=="Y"){
		$("#in_expiration_date_flag").attr("checked", true);
	}
	
	if(($('#SOURCE_CODE').val()== "ALL" ) || ($('#SOURCE_CODE').val() == "all")) {
			alert('Source Tariff is mandatory');
			return false;	
	}
	if(($('#GROUP_CODE').val()== "ALL" ) || ($('#GROUP_CODE').val() == "all")) {
		alert('Group Name is mandatory');
		return false;	
    }	
	else{
		if(pagingStatus==false){
		postMethod('search',document.tariffGroupForm.method);
		return true;	
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
	
//on click of Clear button
function setClear(){
	$('#msgDiv').hide();
	document.tariffGroupForm.delete1.value ="";
	     //$('#in_group_type_code').val("01");
		 $('#resultdiv').hide();		
		 $("#in_source_code").val("ALL");
		 $("#in_group_code").val("ALL");
		 $('#_eventId_replicate').attr("disabled","disabled");
		 $('#_eventId_del').attr("disabled","disabled");
		 $('#in_expiration_date_flag').attr("checked",true);
		 $("#in_expiration_date_flag").val("Y");
		 document.tariffGroupForm.currentFuture.value='Y';
		 $('#_eventId_condition').attr("disabled","disabled");
		 $('input[name="grpId"]').val("");
		 
		 postMethod('delete',document.tariffGroupForm.method);
		
}  



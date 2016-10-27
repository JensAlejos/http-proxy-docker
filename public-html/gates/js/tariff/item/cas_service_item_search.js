var unselectedItemName = '';

$(document).ready(function() {
	// Blank out unselectedvalue on key down
	$('#in_item_name').keydown(function(e) {
		if(e.which != 13)  unselectedItemName = '';
	});

	//Searching by enter-key -- D020067
	$(document).keypress(function(e) {
		  if(e.which == 13) {
			  // Select unselected value
			    if(unselectedItemName != ''  ) {
					 $('#in_item_name').val(unselectedItemName);
				 }
				unselectedItemName = '';
				searchValue();
		  }
		});
	
	$( "#delete_success" ).dialog({
		resizable: false,
		autoOpen: false,
		height:110,
		width:300,
		modal: true,
		close: function(){
			var frm = document.forms["tariffItemForm"];
   		    frm.method.value="show";
   		 	postMethod('search',frm.method);
		},
		buttons: {
			"OK": function() {
				$( this ).dialog( "close" );
				var frm = document.forms["tariffItemForm"];
	   		    frm.method.value="show";
	   		 	postMethod('search',frm.method);
			}
		}
	});
	
	$( "#delete_error" ).dialog({
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
					$('#item_condition').gatesDisable();   
					$('#authorization').gatesDisable();
			}
			 else
				 $('#item_delete').removeAttr("disabled");
		 }
		 if(anyOneChecked && (grpTyp =='01'||grpTyp =='02')  &&  !_displayonly){
			 $('#item_replicate').removeAttr("disabled");
			 $('#item_condition').removeAttr("disabled");
			 $('#item_rate').removeAttr("disabled");
			// $('#item_delete').removeAttr("disabled");
		 }
		 else if(anyOneChecked && !(grpTyp =='01'||grpTyp =='02') && !_displayonly){
			 $('#item_condition').removeAttr("disabled");
			 $('#item_rate').removeAttr("disabled");
			 //$('#item_delete').removeAttr("disabled");
		 }
		 else{
			// $('#item_add').attr("disabled","disabled");
			 $('#item_replicate').attr("disabled","disabled");
			 $('#item_condition').attr("disabled","disabled");
			 $('#item_rate').attr("disabled","disabled");
			 $('#item_delete').attr("disabled","disabled");
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
	var dataName=null;
	$('form[name="tariffItemForm"]').formatCasSearchForm({ 
		hasSavedSearchFeature: false, 
		customActions: [ ]
		});

	//setting default values on form load
	 setdefaults();
	 if(document.tariffItemForm.delete1.value!=null && document.tariffItemForm.delete1.value != "delete1")
		{
			$('#msgDiv').hide();
		}
		if(document.tariffItemForm.delete1.value != null && document.tariffItemForm.delete1.value == "delete1")
		{
			//$("#delete_success").dialog("open");
			var messageContent= "Record has been deleted successfully.";
			$('#msgDiv').html(messageContent)
			//alert("Record has been deleted successfully.");
		}
	
	
	if( $('#in_source_code').val()=="ALL" && $("#in_group_code").val()=="ALL"){
		 $('#resultdiv').hide();
	}
	
	if(_readonlyItemSearch){
		$('#displaydiv').gatesDisable();
		$('#resultdiv').gatesDisable();
	}
		// code to convert dropdown to multiselect list box
	//disable submitViaEnter(event)
	 $("#in_source_code").removeAttr("onkeypress");
	 $("#in_group_code").removeAttr("onkeypress");
	 $("#in_item_name").removeAttr("onkeypress");

	//Source Tariff and Group Name-user should not be able to enter more then 6 char.
	 $("#in_group_code").get(0).setAttribute("maxlength", 6);
	 $("#in_source_code").get(0).setAttribute("maxlength", 6);
	 $("#in_item_name").get(0).setAttribute("maxlength", 8);


	// code for source tariff predictive search
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
			    		$("input[type=button][value=Search]").removeAttr("disabled");
			    		if(!_displayonly){
			    			$('#item_add').removeAttr("disabled");
			    		}
		 		 }
		 }		 
	});	

	//Blurr the data for invalid group Id
	 $('#in_source_code').change(function(){
			if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
	        	$("#in_source_code").val("ALL"); 
	        	$("#in_group_code").val("ALL"); 
	    	}
			else{
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
		 		$("input[type=button][value=Search]").removeAttr("disabled");
	    		if(!_displayonly){
	    			$('#item_add').removeAttr("disabled");
	    		}
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

       	
	//code for item predictive
		$('#in_item_name').gatesAutocomplete({
			source:  _context+'/cas/autocomplete.do',
			minLength: 1,
			 extraParams: {
			 		 		 	 method: 'searchItemName',
			 		 		     searchType: '43',
			 		 		 	 groupType:  function () { return $('#in_group_type_code').val(); },
			 		 		 	 sourceTariff:  function () { return $('#in_source_code').val(); },
			 		 		 	 groupName:  function () { return $('#in_group_code').val(); }		
			 		 		 },
			
			 formatItem: function(data) {
				 dataName=data.name;
			 	 $('input[name="itemId"]').val(data.id);
			 	 unselectedItemName = data.name;
			 	 return data.name;
			 },
			 formatResult: function(data) {
				 dataName=data.name;
			 	 $('input[name="itemId"]').val(data.id);
			 	 
			 	 return data.name;
			 },
			 select: function(data) {
				    unselectedItemName = '';
			 		$('#in_item_name').val(data.id);	
			 		$('input[name="itemId"]').val(data.id);			 		
			 },		 
			 onBlur: function( ) {
				 if(unselectedItemName != '') {
					 $('#in_item_name').val(unselectedItemName);
				 }
				 unselectedItemName = '';
			 }
		});	
		
		
		
		//Blurr the data for invalid item Id
		/*
		 $('#in_item_name').change(function(){
			if($('input[name="itemId"]').val()==null || $('input[name="itemId"]').val()==""){				
	     	    //  Do nothing
				$("#in_item_name").val("ALL");  
				
	 	  }		
			else{
				$("#in_item_name").val(dataName); 
				$('input[name="itemId"]').val("");
			}
	   }); 	*/
	
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
	
	// hide CAS generated "Search" and "Clear" Button
		 $('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').remove();

	//replaceWithCheckBox($("#in_expiration_date_flag"),'Y');
	replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());
	$("#in_expiration_date_flag").click(function() {
		if($('#in_expiration_date_flag').attr('checked')){
			 document.getElementById('in_expiration_date_flag').value="Y";
		}else{
			document.getElementById('in_expiration_date_flag').value="ALL";
		}

	});


	 $('#in_group_code').blur(function() {
	    	var validComb= validateCombforMandatoryFiels();
	    	if(! validComb){
	    		$("input[type=button][value=Search]").attr("disabled","disabled");
	    		$('#item_add').attr("disabled","disabled");
	    	}else{
	    		$("input[type=button][value=Search]").removeAttr("disabled");
	    		if(!_displayonly){
	    			$('#item_add').removeAttr("disabled");
	    		}

	    	}
	    });

	    $('#in_source_code').blur(function() {
	    	var validComb= validateCombforMandatoryFiels();
	    	if(! validComb){
	    		$("input[type=button][value=Search]").attr("disabled","disabled");
	    		$('#item_add').attr("disabled","disabled");
	    	}else{
	    		$("input[type=button][value=Search]").removeAttr("disabled");
	    		if(!_displayonly){
	    			$('#item_add').removeAttr("disabled");
	    		}
	    	}
	    });
	    var validComb= validateCombforMandatoryFiels();
	    if(!validComb){

	    	$("input[type=button][value=Search]").attr("disabled","disabled");
	    	$('#item_add').attr("disabled","disabled");
	    	$('#item_delete').attr("disabled","disabled");
	    	//first page load
			$("#in_expiration_date_flag").attr("checked", true);
			document.getElementById('in_expiration_date_flag').value="Y";

	    }
	    else
	    	{
			$("input[type=button][value=Search]").removeAttr("disabled");
			$('#item_add').removeAttr("disabled");

	    	}

	    $('#in_source_code').change(function() {
	    	var grpType= $('#in_group_type_code').val();
	    	var srcTariff=$('#in_source_code').val();
	    	if(grpType=='01')
	    		{
	    		$('#in_group_code').val(srcTariff);
	    		$("input[type=button][value=Search]").removeAttr("disabled");

	    		if(_displayonly){}else
	    		$('#item_add').removeAttr("disabled");
	    		}
	    	else
	    		{
	    		$('#in_group_code').val("ALL");
	    		}


	    });


	$('#TYPE').attr("multiple", "multiple");
	$('#TYPE').attr("size", "5");
	// code to bind pop up search
	 $('#in_group_code').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#in_source_code').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	 
	 $('#in_item_name').gatesPopUpSearch({func:function() {ItemPopupSearch()}});
	 
	 //code for enabling buttons on checkbox checked
	 $("input[type=checkbox][name=searchInput]").click(function() {

			var elements = $("input[type=checkbox][name=searchInput]");
			var anyOneChecked=false;
			jQuery.each(elements, function(element) {
		    	var checked = $(this).attr('checked');
				if(checked){
					anyOneChecked=true;
				}
			});
			 var grpTyp=$('#in_group_type_code').val();
			 if(anyOneChecked)
				 {
				 if (_readonly) {
						$('#item_condition').gatesDisable();
						$('#authorization').gatesDisable();
				}
				 else
					 $('#item_delete').removeAttr("disabled");
			 }


			 if(anyOneChecked && (grpTyp =='01'||grpTyp =='02')  &&  !_displayonly){
				 $('#item_replicate').removeAttr("disabled");
				 $('#item_condition').removeAttr("disabled");
				 $('#item_rate').removeAttr("disabled");
				// $('#item_delete').removeAttr("disabled");
			 }
			 else if(anyOneChecked && !(grpTyp =='01'||grpTyp =='02') && !_displayonly){
				 $('#item_condition').removeAttr("disabled");
				 $('#item_rate').removeAttr("disabled");
				 //$('#item_delete').removeAttr("disabled");
			 }
			 else{
				 if(anyOneChecked && _displayonly){ //D023444
					 $('#item_condition').removeAttr("disabled");
					 $('#item_rate').removeAttr("disabled");
				 } else {
				// $('#item_add').attr("disabled","disabled");
				 $('#item_replicate').attr("disabled","disabled");
				 $('#item_condition').attr("disabled","disabled");
				 $('#item_rate').attr("disabled","disabled");
				 $('#item_delete').attr("disabled","disabled");
			    }
			 }
		});


	 //reset page on change of group type
	 $("#in_group_type_code").change(function() {
		 document.tariffItemForm.delete1.value = "";
		 $("#msgDiv").hide();
			$("#in_source_code").val("ALL");
			$("#in_group_code").val("ALL");
			$("#in_item_name").val('ALL');
			$("input[type=button][value=Search]").attr("disabled","disabled");
			 $('#item_add').attr("disabled","disabled");
			//hide display grid too
			if(document.getElementById("displaybase")!=null)
			{
			    document.getElementById("displaybase").style.display="none";
			}
			$('input[name="grpId"]').val("");
	 });

	  var groupTypeCode = document.tariffItemForm.groupTypeCode.value;
	  var sourceCode = document.tariffItemForm.sourceCode.value;
	  var groupCode = document.tariffItemForm.groupCode.value;
	  var itemCode = document.tariffItemForm.itemCode.value;
	  var currentFuture = document.tariffItemForm.currentFuture.value;
	   if(groupTypeCode!=null && groupTypeCode!='' )
		{
		$('#in_group_type_code').val(groupTypeCode);
		
		}
	   if(sourceCode!=null && sourceCode!='' )
		{
		$('#in_source_code').val(sourceCode);
	
        }
	   if(groupCode!=null && groupCode!='')
		{
		$('#in_group_code').val(groupCode);
	   if(groupCode!='ALL'){
			$("input[type=button][value=Search]").removeAttr("disabled");
		}
	    else{	
				$("input[type=button][value=Search]").attr("disabled","disabled");
				$('#resultdiv').hide();
     	  }
	    }
	   if(itemCode!=null && itemCode!='')
		{
		 $('#in_item_name').val(itemCode);
		}
	   if(currentFuture!=null && currentFuture!='')
	    {
		if(currentFuture=="Y" || currentFuture=="true" || currentFuture==true){
       		$("#in_expiration_date_flag").attr("checked", true);
       		document.getElementById('in_expiration_date_flag').value="Y";
       	}
       	else{
	     $("#in_expiration_date_flag").attr("checked", false);
	     document.getElementById('in_expiration_date_flag').value="ALL";
       	}

	    }

		 if(_displayonly){
			 $('#item_add').attr("disabled","disabled");
		 }
		
		 var _prefDate= $('input[name="prefDateSessionVar"]').val();	
			
			if(_prefDate!=null && _prefDate!=''){
				$("#preferencedate").val(_prefDate);
				$("#preferencedate").datepicker('setDate',_prefDate);
			} 
			
			//setting tab sequence on form load
			$('#in_expiration_date_flag').addClass('noTab');
			$('#displaybase a').addClass('noTab');
			$('#displaybase select').addClass('noTab');
			$('#displaybase input[type="checkbox"]').addClass('noTab');
			tabSequence('#tabSequence');
			var from = document.tariffItemForm.from.value;
			   //$('#condition_Cancel').hide();	
			   
			   	if(from!=null && from!="" && from!="cancel"){
					   $('#item_Cancel').show();
				   }
				   else{
					   $('#item_Cancel').hide();	
				   }
			 $("#item_Cancel").click(function() {
				 var tariffId=document.tariffItemForm.tariffId.value;
				 if(from=="group"){
			 			document.location.href = _context + '/tariffGroup/showForm?tariffServgrpId='+tariffId+'&tariffServgrpType='+$('#in_group_type_code').val()+'&tariffServSrcCode='+sourceCode+'&tariffServgrpCode='+groupCode+'&screen=00&tariffGrpId=';
				   } 
				 else{
					   document.location.href = _context +'/cas/tariffServGrpSearch.do';
				   }
			 });
});

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

function ItemPopupSearch() {   
	var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&itemName="+$('#in_item_name').val()+"&currentFuture="+$('#in_expiration_date_flag').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	if($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL" && $('#in_group_code').val()!=null && $('#in_group_code').val()!="" && $('#in_group_code').val()!="ALL"){
		window.open(actionUrl, 'ItemNameSearch', windowStyle);    
	}
	else{
		//$('#delete_error').text('Source Tariff and Group Name Mandatory for Item Search');
   		//$('#delete_error').dialog('open');
		alert('Source Tariff and Group Name Mandatory for Item Search');
	}
}

function sourceTariffSearchUpdate(id){	
	var values = id.split("|");
	var grpType=$('#in_group_type_code').val();
	$('#in_source_code').val(values[0]);
	if(grpType=='01')
	{
		$('#in_group_code').val(values[0]);
		$("input[type=button][value=Search]").removeAttr("disabled");
		if(!_displayonly){
			$('#item_add').removeAttr("disabled");
		}
	}
 	
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#in_group_code').val(values[0]);
  	$('#item_add').attr("disabled",false);
  	$("input[type=button][value=Search]").removeAttr("disabled");
}

function replaceWithCheckBox($obj, checkedValue) {
    var status=false;
	if(checkedValue=="Y" ){
		status=true;
	}else if (checkedValue=="N"||checkedValue=="ALL"){
		status=false;
	}
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
function itemNameSearchUpdate(id){ 
	var values = id.split("|"); 
	$('#in_item_name').val(values[0]); 
	
	var validComb= validateCombforMandatoryFiels();
	if(! validComb){
		$("input[type=button][value=Search]").attr("disabled","disabled");
	}else{
		$("input[type=button][value=Search]").removeAttr("disabled");
	}
}

function addItem(){
	document.tariffItemForm.delete1.value = "";
    var grpTyp = document.getElementById('in_group_type_code').value;
    var grpCode = document.getElementById('in_group_code').value;
    var sourceCode = document.getElementById('in_source_code').value;
    var from = document.tariffItemForm.from.value;
    var currentFuture=document.tariffItemForm.filterValue5.value;
    if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture=true;
	}
	else{
		currentFuture=false;
	}
    //grpType,grpName,srcTariff
    $.ajax({
		   type: "GET",
		   url: _context +"/tariff/itemFrtWrf/validateItemCombination?",
		   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode,
		   success: function(msg){
			   if(msg=="NotValid"){
				   $('#delete_error').text('Not a valid combination to add items.');
			   		$('#delete_error').dialog('open');
				   return;
				}else{
				     if(grpTyp=='01' || grpTyp=='02')
				    	 {document.location.href=_context +'/tariff/itemFrtWrf/showForm?actionPerformed=add&grpid='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=FRT&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				     if(grpTyp=='03')
			    	     {document.location.href=_context +'/tariff/itemDra/add?actionPerformed=add&grpid='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=DRA&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				 	 if(grpTyp=='04')
				 	 {		 		
				 		{document.location.href=_context +'/tariffitemRevDiv/showForm?actionPerformed=add&grpTyp='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=RDV&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				 	 }	
				 	 if(grpTyp=='05')
				 	 {
						 {document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=MEQ&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				 	 }	
				 	 if(grpTyp=='06')
				 	 {
				 		{document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=MSH&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				 	 }	
				 	 if(grpTyp=='07')
				 	 {
				 		{document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+grpTyp+'&grpCode='+grpCode+'&sourceCode='+sourceCode+'&screen=ACC&mode=Add&from='+from+'&currentFuture='+currentFuture;}
				 	 } 
				}			
			 }
		 });
}

function loadItem(itemDesc)
{

	var itemVar = itemDesc.split("|");
	var itemId = itemVar[0];
	var groupTypec = itemVar[1];
	var searchLength = document.tariffItemForm.searchInput.length;
	var currentFuture=document.tariffItemForm.filterValue5.value;
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture=true;
	}
	else{
		currentFuture=false;
	}
	var itemsToUpdate = "";
	var from = document.tariffItemForm.from.value;
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffItemForm.searchInput[i].checked;
   			searchInp = document.tariffItemForm.searchInput[i].value;
		} else {
			checked = document.tariffItemForm.searchInput.checked;
   			searchInp = document.tariffItemForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selItem = temp[0];
			itemsToUpdate = itemsToUpdate + selItem + ",";

		}
	}

	if (selCount == 0) {
		itemId = itemId;
	} else {
		itemId = itemsToUpdate;
	}

	//alert("itemId : " + itemId);

	if(groupTypec =='01'||groupTypec =='02')
	{ 
		document.location.href=_context +'/tariff/itemFrtWrf/edit?actionPerformed=edit&itemId='+itemId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit&from='+from;
	}
	if(groupTypec =='03')
	{
		document.location.href=_context +'/tariff/itemDra/edit?actionPerformed=edit&itemId='+itemId+'&screen1=edit&mode=edit&currentFuture='+currentFuture+'&from='+from;
	}
	 if(groupTypec=='04')
 	 {
		 document.location.href=_context +'/tariffitemRevDiv/edit?actionPerformed=edit&itemId='+itemId+'&screen=RDV&mode=edit&currentFuture='+currentFuture+'&from='+from;
 	 }	
 	 if(groupTypec=='05')
 	 {	 		
 		 document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+itemId+'&screen=MEQ&mode=edit&currentFuture='+currentFuture+'&from='+from;
 	 }	
 	 if(groupTypec=='06')
 	 {
 		 document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+itemId+'&screen=MSH&mode=edit&currentFuture='+currentFuture+'&from='+from;
 	 }	
 	 if(groupTypec=='07')
 	 {
 		document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+itemId+'&screen=ACC&mode=edit&currentFuture='+currentFuture+'&from='+from;
 	 }
}

function replicateItem()
{
	document.tariffItemForm.delete1.value = "";
	var itemId = $(":checkbox:checked").val();
	var screen='01';
	 var grpTyp = document.getElementById('in_group_type_code').value;
	var searchLength = document.tariffItemForm.searchInput.length;
	var itemsToUpdate = "";
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffItemForm.searchInput[i].checked;
   			searchInp = document.tariffItemForm.searchInput[i].value;
		} else {
			checked = document.tariffItemForm.searchInput.checked;
   			searchInp = document.tariffItemForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selItem = temp[0];
			itemsToUpdate = itemsToUpdate + selItem + ",";
		}

	}

	if (selCount == 0) {
		itemId = itemId;
	} else {
		itemId = itemsToUpdate;
	}
	if(grpTyp =='01'||grpTyp =='02')
	{
		{document.location.href=_context +'/replicateTariffItem/showForm?actionPerformed=replicate&itemID='+itemId+'&mode=Replicate&screen='+screen;}
	}
	else{
		$('#delete_error').text("Not a valid Group Type.");
   		$('#delete_error').dialog('open');
	}
}

function conditionItem()
{
	document.tariffItemForm.delete1.value = "";
	var searchLength = document.tariffItemForm.searchInput.length;
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffItemForm.searchInput[i].checked;
			searchInp = document.tariffItemForm.searchInput[i].value;
		} else {
			checked = document.tariffItemForm.searchInput.checked;
			searchInp = document.tariffItemForm.searchInput.value;
		}

		if (checked) {
           grpId=searchInp;
           selCount = selCount + 1;
		}
	}
	 if (selCount>1) {
		$('#delete_error').text("Select only One record for Rate Search");
   		$('#delete_error').dialog('open');
		return;
	} else {

	var tariffgrpType=document.tariffItemForm.filterValue1.value;
	var tariffsrc=document.tariffItemForm.filterValue2.value;
	var tariffgrpName=document.tariffItemForm.filterValue3.value;
	var currentFuture=document.tariffItemForm.filterValue5.value;
	var from = document.tariffItemForm.from.value;
	var key ="From";
	if(tariffgrpType!="01"){
		key="To";
	}
	$.ajax({
		   type: "GET",
		   url: _context +"/tariff/itemFrtWrf/getItemDetailsOnItemSearch?",
		   data: "itemId="+grpId,
		   success: function(msg){
			   if(msg!=null && msg!=""){
					submiturl=_context +"/cas/tariffConditionSearch.do?";
					submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+msg+"&rateDescription="+"ALL"+"&from=item&currentFuture="+currentFuture+"&key="+key+'&parentFrom='+from;	
					document.location.href =submiturl+submitdata;		
				}
			   }
		});	
	}
}

function rateItem()
{

	document.tariffItemForm.delete1.value = "";
	var searchLength = document.tariffItemForm.searchInput.length;
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffItemForm.searchInput[i].checked;
			searchInp = document.tariffItemForm.searchInput[i].value;
		} else {
			checked = document.tariffItemForm.searchInput.checked;
			searchInp = document.tariffItemForm.searchInput.value;
		}

		if (checked) {
           grpId=searchInp;
           selCount = selCount + 1;
		}
	}
	if (selCount>1) {
		$('#delete_error').text("Select only One record for Condition Search");
   		$('#delete_error').dialog('open');
		return;
	}
	else {
	var tariffgrpType=document.tariffItemForm.filterValue1.value;
	var tariffsrc=document.tariffItemForm.filterValue2.value;
	var tariffgrpName=document.tariffItemForm.filterValue3.value;
	var currentFuture=document.tariffItemForm.filterValue5.value;
	$.ajax({
		   type: "GET",
		   url: _context +"/tariff/itemFrtWrf/getItemDetailsOnItemSearch?",
		   data: "itemId="+grpId,
		   success: function(msg){
			   if(msg!=null && msg!=""){
				   submiturl=_context +"/cas/rateDesriptionSearch.do?";
					submitdata="grpType="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+msg+"&from=item&currentFuture="+currentFuture;
					document.location.href =submiturl+submitdata;	
				}
			   }
		});

	}

}

function deleteItem()
{
	var searchLength=document.tariffItemForm.searchInput.length;
	var itemCanDel="";
	if(typeof(searchLength)=="undefined"){
		searchLength=1;
	}
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";

   		if(searchLength!=1){
   			checked = document.tariffItemForm.searchInput[i].checked;
   			searchInp = document.tariffItemForm.searchInput[i].value;
   		}else{
   			checked = document.tariffItemForm.searchInput.checked;
   			searchInp = document.tariffItemForm.searchInput.value;
   		}
		if(checked)
		{
			selCount=selCount+1;
			var selItem="";
			var temp = new Array();
			temp = searchInp.split(',');
			selItem=temp[0];
			itemCanDel = itemCanDel + selItem +",";
		}
	}
	if(selCount==0){
		/*$('#delete_error').text("Please select at least one Item for deletion !!");
   		$('#delete_error').dialog('open');*/
		alert("Please select at least one Item for deletion !!");
		return;
	}else{
		if(itemCanDel !="")
        {		   
	   		var r=confirm("Do you really want to delete the selected item(s)?"); 	  		
	   		if (r==true){
	   			blockUI();
	   		 $.ajax({
				   type: "POST",
				   url: _context +"/tariff/itemFrtWrf/deleteTariffServiceItem?",
				   data: "itemsTodelete="+ itemCanDel,
				   success: function(msg){
					   	if (msg == "Deleted Sucessfully"){
					   	 $.unblockUI();	
					   	 document.location.href =_context + "/cas//tariffItemSearch.do?delete1=delete1";
					   	}else{
					   		/*$('#delete_error').text(msg);
					   		$('#delete_error').dialog('open');*/
					   	    $.unblockUI();
					   		alert(msg);
					   	} 
					 },
				 error: function () { 
					 $.unblockUI();
					}
				 });
	   		  }else{
	   			return;
	   		  }
	    }
	}
}


var enableShortCuts = function() {
	   shortcut.add("Shift+D",function() {
		   deleteItem();
		});
}


//function for CAS Search
function searchValue(){
	document.tariffItemForm.delete1.value ="";

	if(($('#in_source_code').val()== "ALL" ) || ($('#in_source_code').val() == "all")) {
		$('#delete_error').text('Source Tariff is mandatory');
   		$('#delete_error').dialog('open');
			return false;	
	}
	if(($('#in_group_code').val()== "ALL" ) || ($('#in_group_code').val() == "all")) {
		$('#delete_error').text('Group Name is mandatory');
   		$('#delete_error').dialog('open');
		return false;	
    }	
	else{
	    document.tariffItemForm.groupCode.value = $('#in_group_code').val();
		postMethod('search',document.tariffItemForm.method);
		return true;
	}
}

function searchValueDefault(){
 	$('#in_group_type_code').val(document.tariffItemForm.groupTypeCode.value);
	$('#in_source_code').val(document.tariffItemForm.sourceCode.value);
	$('#in_group_code').val(document.tariffItemForm.groupCode.value);
	$('#in_item_name').val(document.tariffItemForm.itemCode.value);
	if(document.tariffItemForm.currentFuture.value!=null && document.tariffItemForm.currentFuture.value!="" && (document.tariffItemForm.currentFuture.value=="true" || document.tariffItemForm.currentFuture.value==true || document.tariffItemForm.currentFuture.value=="Y")){
		$('#in_expiration_date_flag').val("Y");
		$("#in_expiration_date_flag").attr("checked", true);
	}
	else{
		$('#in_expiration_date_flag').val(document.tariffItemForm.currentFuture.value);
	}
	var paging =document.tariffItemForm.paging.value;
	var pagingStatus=is_int(paging);
	
//	if(document.tariffItemForm.currentFuture.value=="Y"){
//		
//	}
	if(pagingStatus==false){
	if($('#in_group_code').val()!=null && $('#in_group_code').val()!='' && $('#in_group_code').val()!='ALL' ){
		postMethod('search',document.tariffItemForm.method);
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



function getValueFromhyperTag(obj)
{
	var tempObj=obj.split(">");
    var tempObj1=tempObj[1].split("<");
    var returnObj = tempObj1[0];
    return returnObj;

}

//function for reset form
function setdefaults(){

	 $('#item_replicate').attr("disabled","disabled");
	 $('#item_delete').attr("disabled","disabled");
	 $('#item_condition').attr("disabled","disabled");
	 $('#item_rate').attr("disabled","disabled");
	 $('input[name="grpId"]').val("");
}
//on click of Clear button
function setClear(){
	document.tariffItemForm.delete1.value ="";
	 $('#msgDiv').hide();
		 $('#resultdiv').hide();
		/* $("#in_group_type_code").val("01");*/
		 $("#in_source_code").val("ALL");
		 $("#in_group_code").val("ALL");
		 $("#in_item_name").val("ALL");
		 $('#item_add').attr("disabled","disabled");
		 $('#in_expiration_date_flag').attr("checked",true);
		 $("#in_expiration_date_flag").val("Y");
		 $("input[type=button][value=Search]").attr("disabled","disabled");
		 $('#item_replicate').attr("disabled","disabled");
		 $('#item_delete').attr("disabled","disabled");
		 $('#item_condition').attr("disabled","disabled");
		 $('#item_rate').attr("disabled","disabled");
		 $('input[name="grpId"]').val("");
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


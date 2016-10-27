var dataName=null;
$(document).ready(function(){
	
	$( "#delete_success" ).dialog({
		resizable: false,
		autoOpen: false,
		height:110,
		width:300,
		modal: true,
		close: function(){
			var frm = document.forms["tariffConditionForm"];
   		    frm.method.value="show";
   		 	postMethod('search',frm.method);
		},
		buttons: {
			"OK": function() {
				$( this ).dialog( "close" );
				var frm = document.forms["tariffConditionForm"];
	   		    frm.method.value="show";
	   		 	postMethod('search',frm.method);
				//searchValue();
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
				// $('#condition_delete').removeAttr("disabled");
				  
				 if (_readonly) {
						$('#condition_delete').gatesDisable();   
						$('#authorization').gatesDisable();
				}
				 else
				 {
				 $('#condition_delete').removeAttr("disabled");
				 }

			
				 if (_displayonly) {
						$('#condition_replicate').gatesDisable();   
						$('#authorization').gatesDisable();
				}
				 else
				 {
					 $('#condition_replicate').removeAttr("disabled");
						
				 }
				
			 }else{
				
				 $('#condition_delete').attr("disabled","disabled");
				 $('#condition_replicate').attr("disabled","disabled");
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
	if(document.tariffConditionForm.delete1.value != "delete1")
		{
			$('#msgDiv').hide();
		}
	if(document.tariffConditionForm.delete1.value == "delete1")
		{
			//$("#delete_success").dialog("open");
		var messageContent= "Record has been deleted successfully.";
		$('#msgDiv').html(messageContent)
			//alert("Record has been deleted successfully.");
		}
	$("#in_rate_description").attr('size',52);
//	$('#in_expiration_date_flag').val("Y");
	
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#add_edit').attr("disabled","disabled");
	$('#add_link').attr("disabled","disabled");
	$('#add_warning').attr("disabled","disabled");
	$("#in_for_group_type").attr("disabled","disabled");
	$('td.dataField:contains("Condition")').attr("align","left");
	
	$('td.dataField:contains("Condition:")').attr("colspan","1");
	$('td.dataField:contains("All")').attr("colspan","1");
	$('td.dataField:contains("Source Tariff*:")').attr("colspan","1");
	$('td.dataField:contains("Item:")').attr("colspan","1");
	$('td.dataField:contains("Edit")').attr("colspan","1");
	$('td.dataField:contains("Rate")').attr("colspan","1");

	$('td.dataField:contains("From/To Key")').attr("colspan","1");
	$('td.formField:contains("From")').attr("colspan","1");
	$('td.quickSearchFldBgColor:contains("From")').attr("colspan","1");
	$('td.dataField:contains("Link")').attr("colspan","1");
	$('td.dataField:contains("For Group Type")').attr("colspan","1");
	$('td.dataField:contains("Warning")').attr("colspan","1");

	$("#in_for_group_type").parent("td").attr("colspan","1");
	$("#in_item_name").parent("td").attr("colspan","0");
	$("#in_group_code").parent("td").attr("colspan","0");
	$("#in_expiration_date_flag").parent("td").attr("colspan","1");
	$("#in_source_code").parent("td").attr("colspan","0");
	$("#in_rate_description").parent("td").attr("colspan","3");
	$('td.dataField:contains("Group Name*")').css("text-align","left");
	
	
	
	$("#in_source_code").attr('size',12);
	
	$("#in_group_code").attr('size',7);
	$("#in_item_name").attr('size',6);
	
	
	/*$("#RATE_BASIS").attr('size',20);

in_source_code
	$("#RD_EXP_DATE").attr('size',3);
	$("#EQUIP_RESULT").attr('size',3);
	$("#ITEM_NAME").attr('size',3);*/

	$("#condition_Cancel").hide();
	
	// set defaults value  
	var paging =document.tariffConditionForm.paging.value;
	var pagingStatus=is_int(paging);
	if(pagingStatus==false){
	setdefaults();
	}
	
	// start - Added below code to escape tab on radio buttons
	$('#in_from_key').addClass('noTab');
	$('#in_to_key').addClass('noTab');
	$('#in_item_id').addClass('noTab');	 
	$('#in_condition_flag').addClass('noTab');
	$('#in_edit_mode').addClass('noTab');
	$('#in_link_mode').addClass('noTab');
	$('#in_warning_mode').addClass('noTab');
	// end - Added above code to escape tab on radio buttons
	
	 tabSequence('#tabSequence');
	 //tabSequence('#tariffConditionForm',false,false);
	$('form[name="tariffConditionForm"]').formatCasSearchForm({ 
		hasSavedSearchFeature: false, 
		customActions: [ ]
		});

	$('td.dataField:contains("in_item_id:")').hide();	
	$('td.dataField:contains("in_rate_id:")').css('display','none');
	//$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(6)').after('<td class="dataField" colspan"1">Hello<input type="hidden" value="Hello" id="hidden1"/></td>');
	$('td.dataField:contains("in_to_key:")').hide();
	$('#in_item_id').hide();
	$('#in_rate_id').hide();
	$('td.dataField:contains("Edit:")').hide();
	$('td.dataField:contains("Link:")').hide();
	$('td.dataField:contains("Warning:")').hide();
	
	
	/*$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(3)').append($('.searchTable input[type=radio]')[2]);
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(3)').append($('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').text());
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').text("");*/
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').append($('.searchTable input[type=radio]')[3]);
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').append($('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(8)').text());
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(8)').text("");
	
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').append($('.searchTable input[type=radio]')[4]);
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)')	.append($('.searchTable').children().children().children('tr:nth-child(4)').children('td:nth-child(2)').text());
	$('.searchTable').children().children().children('tr:nth-child(4)').children('td:nth-child(2)').text("");
	
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)').append($('.searchTable input[type=radio]')[5]);
	$('.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(4)')	.append($('.searchTable').children().children().children('tr:nth-child(4)').children('td:nth-child(4)').text());
	$('.searchTable').children().children().children('tr:nth-child(4)').children('td:nth-child(4)').text("");
	//commented below two lines for D031921
	/*$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(7)').append($('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(8)').html());
	$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(8)').html("");*/
	
	/*$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(4)').append($('.searchTable input[type=radio]')[1]);
	$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(4)').append($('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(6)').html());
	$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(6)').html("");
	$('.searchTable').children().children().children('tr:nth-child(2)').children('td:nth-child(7)').html("");*/
	
	
	
	/*var a=$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(6)').html();
	a='<div class="span-3">'+a+'</div><label class="span-1" style="margin-top:7px;">Item:</label><input type="text" role="textbox" size="10" id="in_item_name" name="filterValue4"/>';
	$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(6)').html(a);
	$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(7)').html('');
	$('.searchTable').children().children().children('tr:nth-child(1)').children('td:nth-child(8)').html('');*/
	
	
	
	
	$("#in_source_code").parent("td").attr("colspan","0");
	$("#in_group_code").parent("td").attr("colspan","0");
	$("#in_item_name").parent("td").attr("colspan","0");
	$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();
	 $('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').after(
				'<tr>'+
				'<td>'+
				'<div id="showButtons">' +	
				'<table>' +
				'<br></br>' +
				'<tr>' +
				  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
				  '<td><input type="button" onclick="javascript:setClear();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
				'</tr>' +
			  	'</table>' +
			  	'</div>'+
			  	'</td>'+
			  	'<tr>'
	);
	 
// hide CAS generated "Search" and "Clear" Button
	 
	//disable submitViaEnter(event)
	 $("#in_source_code").removeAttr("onkeypress");
	 $("#in_group_code").removeAttr("onkeypress");
	 $("#in_item_name").removeAttr("onkeypress");
	 $("#in_rate_description").removeAttr("onkeypress");
	
	 $("#in_group_type_code").attr("style","width: 120px");
	 $("#in_for_group_type").attr("style","width: 120px");
	 
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
				 $('#resultdiv').hide();
			 		$('#in_source_code').val(data.id);	
			 		$('#sourceCode').val(data.id);
			 		$('input[name="grpId"]').val(data.id); // added for invalid group id
			 		if($('#in_group_type_code').val()=="01"){
			 			 $('#in_group_code').val(data.name);	
			 			$("input[type=button][value=Search]").removeAttr("disabled");
			 			if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
							    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
								   &&  ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
								     ){								
						     $('#add_warning').removeAttr("disabled");
						 }	
						 else if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
								    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
								      && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")
									     && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
									      ){									 
							     $('#add_warning').removeAttr("disabled");
						 }
			 			  if (_displayonly) {
			 				
			 		      }else{
			 		 		 $('#add_edit').removeAttr("disabled");
			 				 $('#add_link').removeAttr("disabled");						 	
			 		      }
			 		}		 		
			 }		 
		});	
		
		//Blur the data for invalid group Id
		 $('#in_source_code').change(function(){
			 $('#resultdiv').hide();
			if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
	       	$("#in_source_code").val("ALL"); 
	       	$("#in_group_code").val("ALL"); 
			$("#in_item_name").val("ALL"); 
			$("#in_rate_description").val("ALL"); 
			$('input[name="itemId"]').val("");
			$('#in_rate_id').val("");
		 	$('input[name="ratId"]').val("");
		 	$('input[name="rateId"]').val("");	
	   	}
			else{
				$("#in_source_code").val(dataName); 
		 		 if($('#in_group_type_code').val()=="01"){
		 			 $('#in_group_code').val(dataName);
		 		 }
		 		 else{
		 			 $('#in_group_code').val("ALL");
		 		 }
				$('input[name="grpId"]').val("");
				$("#in_item_name").val("ALL"); 
				$("#in_rate_description").val("ALL"); 
				$('input[name="itemId"]').val("");
				$('#in_rate_id').val("");
			 	$('input[name="ratId"]').val("");
			 	$('input[name="rateId"]').val("");	
			}
	   }); 

		 
		 $("#in_link_mode").click(function(){			 
			  if(document.tariffConditionForm.in_from_key.checked == true){				  
					$('#in_for_group_type').removeAttr("disabled");
			  } else {
				  document.getElementById('in_for_group_type').value="ALL";
				   $('#in_for_group_type').attr("disabled","disabled");
			 }
			 
		 }); 
		 
		 $("#in_warning_mode").click(function(){
			 document.getElementById('in_for_group_type').value="ALL";
			 $("#in_for_group_type").attr("disabled","disabled");
			 
		 }); 
		 
		 $("#in_condition_flag").click(function(){
			 document.getElementById('in_for_group_type').value="ALL";
			 $("#in_for_group_type").attr("disabled","disabled");
			 
		 });
		 
		 $("#in_edit_mode").click(function(){
			 var grupType=$('#in_group_type_code').val();
			 document.getElementById('in_for_group_type').value="ALL";
			 $("#in_for_group_type").attr("disabled","disabled");
			 if(grupType!="01"){
				  document.tariffConditionForm.in_from_key.checked = true;
				  document.tariffConditionForm.in_to_key.checked = false;
				  document.tariffConditionForm.inToKey.value="From";
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
			 		if($('#in_group_type_code').val()=="01"){
			 		 if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
							    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
								   &&  ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
								     ){								
						     $('#add_warning').removeAttr("disabled");
					 }	
					 else if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
							    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
							      && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")
								     && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
								      ){									 
						     $('#add_warning').removeAttr("disabled");
						     $('#in_warning_mode').removeAttr("disabled");
					 }}
			 		 if (!_displayonly) {	
			 		 	$('#add_edit').removeAttr("disabled");
			 			$('#add_link').removeAttr("disabled");						
			 		 }	
			 }		 
		});		
		
		//Blurr the data for invalid group Id
		 $('#in_group_code').change(function(){
			 $('#resultdiv').hide();
			if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
		       	$("#in_group_code").val("ALL"); 
				$("#in_item_name").val("ALL"); 
				$("#in_rate_description").val("ALL"); 
				$('input[name="itemId"]').val("");
				$('#in_rate_id').val("");
			 	$('input[name="ratId"]').val("");
			 	$('input[name="rateId"]').val("");	
		   	}
			else{
				$("#in_group_code").val(dataName); 
			 	$('input[name="grpId"]').val("");
				$("#in_item_name").val("ALL"); 
				$("#in_rate_description").val("ALL"); 
				$('input[name="itemId"]').val("");
				$('#in_rate_id').val("");
			 	$('input[name="ratId"]').val("");
			 	$('input[name="rateId"]').val("");
			}
			if($("#in_group_code").val()=="ALL"){
				 $("input[type=button][value=Search]").attr("disabled","disabled");
				 $('#add_edit').attr("disabled","disabled");
				 $('#add_link').attr("disabled","disabled");
				 $('#add_warning').attr("disabled","disabled");
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
			 		 return data.name;
			 },
			 formatResult: function(data) {
				 dataName=data.name;
			 	 $('input[name="itemId"]').val(data.id);
			 		 return data.name;
			 },
			 select: function(data) {
			 		$('#in_item_name').val(dataName);	
			 		$('input[name="itemId"]').val(data.id);
			 		$('#in_item_name').change();
			 		 if (_displayonly) {
							$('#add_edit').attr("disabled","disabled");
							$('#add_link').attr("disabled","disabled");
							$('#add_warning').attr("disabled","disabled");
			 		 }	
			 }		 
		});	
		//Blurr the data for invalid item Id
		 $('#in_item_name').change(function(){
			 $('#resultdiv').hide();
			if($('input[name="itemId"]').val()==null || $('input[name="itemId"]').val()=="" || $('#in_item_name').val()==null || $('#in_item_name').val()==""){
		     	$("#in_item_name").val("ALL");    
				$('input[name="itemId"]').val("");
				$('#in_rate_description').val("ALL");
				$('#in_rate_id').val("");
			 	$('input[name="ratId"]').val("");
			 	$('input[name="rateId"]').val("");	
		 	}
			else{
				$("#in_item_name").val(dataName); 
				$('input[name="grpId"]').val("");
				$('input[name="itemId"]').val("");
				$('#in_rate_description').val("ALL");
				$('#in_rate_id').val("");
			 	$('input[name="ratId"]').val("");
			 	$('input[name="rateId"]').val("");	
			}
	   }); 	
		 $('#in_item_name').focus(function() {
			 if($('#in_item_name').val() == 'ALL')
			{
				 $('#in_item_name').val("");
			}
		});
		 $('#in_item_name').focusout(function() {
			 if($('#in_item_name').val() == '')
			 {
				 $('#in_item_name').val("ALL");
			 }
		 });
		//code for rate predictive
		$('#in_rate_description').gatesAutocomplete({
			 source:  _context+'/cas/autocomplete.do',
			 extraParams: {
	 		 		 	 method: 'searchRateDescription',
	 		 		     searchType: '45',
	 		 		 	 groupType:  function () { return $('#in_group_type_code').val(); },
	 		 		 	 sourceTariff:  function () { return $('#in_source_code').val(); },
	 		 		 	 groupName:  function () { return $('#in_group_code').val(); },		
	   		 		 	 itemName:  function () { return $('#in_item_name').val(); }		
	 		 		 },
			
			 formatItem: function(data) {
				 $('#in_rate_id').val(data.id);
			 	 $('input[name="ratId"]').val(data.id);
			 	$('input[name="rateId"]').val(data.id);	
				 if(data.flag==undefined){
					 data.flag ="" ;
				 }
				 if(data.city==undefined){
					 data.city ="" ;
				 }
				 if(data.desc==undefined){
					 data.desc ="" ;
				 }
				 dataName=data.name+"-"+data.flag+"-"+data.desc;
				 return dataName;
			 },
			 formatResult: function(data) {
			 	 $('#in_rate_id').val(data.id);
			 	 $('input[name="ratId"]').val(data.id);
			 	$('input[name="rateId"]').val(data.id);	
				 if(data.flag==undefined){
					 data.flag ="" ;
				 }
				 if(data.city==undefined){
					 data.city ="" ;
				 }
				 if(data.desc==undefined){
					 data.desc ="" ;
				 }
				 if(data.desc.indexOf("&#60;&#61;")!=-1){
					 data.desc=data.desc.replace("&#60;&#61;","<=");
				 }
				 dataName=data.name+"-"+data.flag+"-"+data.desc;
				 
				 
				 return dataName;
			 },
			 select: function(data) {
				 $('#resultdiv').hide();
				 	 $('#in_rate_id').val(data.id);
				 	 $('input[name="ratId"]').val(data.id);
				 	$('input[name="rateId"]').val(data.id);			 	 
				     if($('#in_group_type_code').val()=="01"){		
				    	 if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
								    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
									   &&  ($('#in_rate_id').val()==null || $('#in_rate_id').val()=="" || $('#in_rate_id').val()=="ALL")) 
									     ){								 
							     $('#add_warning').removeAttr("disabled");
						 }	
						 else if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
								    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
								      && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")
									     && ($('#in_rate_id').val()==null || $('#in_rate_id').val()=="" || $('#in_rate_id').val()=="ALL")) 
									      ){								 
							     $('#add_warning').removeAttr("disabled");
						 }				    	 
				    	 $('#add_warning').attr("disabled","disabled");
			 		 }
			 		 
			 		 if (_displayonly) {
							$('#add_edit').attr("disabled","disabled");
							$('#add_link').attr("disabled","disabled");
							$('#add_warning').attr("disabled","disabled");
					 }				 		
			 }		 
		});	
		 
		//Blurr the data for invalid rate Id
//		$('#in_rate_description').keypress(function(){
//			 if($('input[name="ratId"]').val()!=null || $('input[name="ratId"]').val()!=""){
//				 $("#in_rate_description").val(dataName);   
//			 }
//		});
		 $('#in_rate_description').change(function(){
			 $('#resultdiv').hide();
			 var rateDesc=$('#in_rate_description').val();
			 if(rateDesc=="" || rateDesc==null || rateDesc=="ALL" || rateDesc==undefined){
				 $('input[name="ratId"]').val("");
				 $('input[name="rateId"]').val("");	
			 }
			 if($('input[name="ratId"]').val()!=null && $('input[name="ratId"]').val()!=""){
				 $("#in_rate_description").val(dataName);   
					/*$('#in_rate_id').val(data.id);
				 	$('input[name="ratId"]').val(data.id);
				 	$('input[name="rateId"]').val(data.id);	*/
			 }
			 else{
				 $("#in_rate_description").val("ALL"); 
					$('#in_rate_id').val("");
				 	$('input[name="ratId"]').val("");
				 	$('input[name="rateId"]').val("");	
			 }

			 if($('#in_group_type_code').val()=="01"){		
		    	 if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
						    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
							   &&  ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
							     ){						 
					     $('#add_warning').removeAttr("disabled");
					     $('#in_warning_mode').removeAttr("disabled");
				 }	
				 else if((($('#in_source_code').val()!=null && $('#in_source_code').val()!="" && $('#in_source_code').val()!="ALL")
						    && ($('#in_group_code').val()!=null && $('#in_group_code').val()!="" || $('#in_group_code').val()!="ALL")
						      && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")
							     && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
							      ){						 
					     $('#add_warning').removeAttr("disabled");
					     $('#in_warning_mode').removeAttr("disabled");
				 }   	
	 		 }
		 });
		 
	// code to bind pop up search
	 $('#in_group_code').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#in_source_code').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
	 $('#in_item_name').gatesPopUpSearch({func:function() {ItemPopupSearch()}});	
	 $('#in_rate_description').gatesPopUpSearch({func:function() {RatePopupSearch()}});
	 
	 var _prefDate= $('input[name="prefDateSessionVar"]').val();	
		if(_prefDate!=null && _prefDate!=''){
			$("#preferencedate").val(_prefDate);
			$("#preferencedate").datepicker('setDate',_prefDate);
		}
		
		//Enabling Disabling
		var validComb= validateCombforMandatoryFiels();
		if(! validComb){
			$("input[type=button][value=Search]").attr("disabled","disabled");
			$('#add_edit').attr("disabled","disabled");
			$('#add_link').attr("disabled","disabled");
			$('#add_warning').attr("disabled","disabled");
		}else{
			$("input[type=button][value=Search]").removeAttr("disabled");		
		    $('#add_edit').removeAttr("disabled");
 			$('#add_link').removeAttr("disabled");
			 if($('#in_group_type_code').val()=="01"){
				 if(( validComb==true
						    && $('#in_rate_description').val()!=null && $('#in_rate_description').val()!="" && $('#in_rate_description').val()!="ALL")) 
							  {		    		     
						     $('#add_warning').attr("disabled","disabled");
					 }
		    	 if(( validComb==true
					    && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
						  ){		    		     
					     $('#add_warning').removeAttr("disabled");
				 }
		    	 if(( validComb==true
						  && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
							 && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")){		    		     
					     $('#add_warning').removeAttr("disabled");
				 }
		    	 $('#in_warning_mode').removeAttr("disabled");
	 		 }
			//$('#add_warning').removeAttr("disabled");			 
			if (_displayonly) {
				$('#add_edit').attr("disabled","disabled");
				$('#add_link').attr("disabled","disabled");
				$('#add_warning').attr("disabled","disabled");
			    }
		}
		
			
		// Disable the buttons by default
		$('#condition_delete').attr("disabled","disabled");
		$('#condition_replicate').attr("disabled","disabled");
		
		
		//Enabling Disabling
		// code to bind pop up search
		 $('#in_rate_description').gatesPopUpSearch({func:function() {organizationPopupSearch()}});
		
	/*	$('td.dataField:contains("in_item_id:")').hide();	
		$('td.dataField:contains("in_rate_id:")').hide();
		$('td.dataField:contains("in_to_key:")').hide();
		$('#in_item_id').hide();
		$('#in_rate_id').hide();
		$('td.dataField:contains("Edit:")').hide();
		$('td.dataField:contains("Link:")').hide();*/
		
		//replaceWithCheckBox($("#in_expiration_date_flag"),'Y');		
		replaceWithCheckBox($("#in_expiration_date_flag"),$("#in_expiration_date_flag").val());

		$("#in_expiration_date_flag").click(function() {
			if($('#in_expiration_date_flag').attr('checked')){
				 document.getElementById('in_expiration_date_flag').value="Y";
			}else{
				document.getElementById('in_expiration_date_flag').value="ALL";
			}
		});
		
		var grpCode = document.getElementById('in_group_code').value;
		var sourceCode = document.getElementById('in_source_code').value;
		var validComb1=false;

		if(grpCode!=null && grpCode!="" && grpCode!="ALL"
			&& sourceCode!=null && sourceCode!="" && sourceCode!="ALL"){
			validComb1=true;
		}		
		if(! validComb1 ){//first page load
			$("#in_expiration_date_flag").attr("checked", true);
			document.getElementById('in_expiration_date_flag').value="Y";
		}
		document.tariffConditionForm.in_condition_flag.checked = true;
		if((document.tariffConditionForm.in_edit_mode.checked == true) || (document.tariffConditionForm.in_warning_mode.checked == true) ||
				(document.tariffConditionForm.in_link_mode.checked == true))
		{
			document.tariffConditionForm.in_condition_flag.checked = false;	
		}
		
		if(document.getElementById('in_link_mode').checked == true)
			{			
			   if($('#in_group_type_code').val()=="01" && document.tariffConditionForm.in_from_key.checked == true){
					$('#in_for_group_type').removeAttr("disabled");
			   } else {
				    document.getElementById('in_for_group_type').value="ALL";
					$('#in_for_group_type').attr("disabled","disabled");
			  }
			   
			}
		
		document.tariffConditionForm.in_from_key.checked = true;
		if(document.tariffConditionForm.in_to_key.checked == true)
		{
			document.tariffConditionForm.in_from_key.checked = false;
		}
		if(document.tariffConditionForm.in_from_key.checked == true)
		{
			document.tariffConditionForm.in_to_key.checked = false;
		}
		$('#in_from_key').click( function()
		    {	
			  document.tariffConditionForm.in_from_key.checked = true;
			  document.tariffConditionForm.in_to_key.checked = false;			  
			  
			  if(document.tariffConditionForm.in_link_mode.checked == true){
					$('#in_for_group_type').removeAttr("disabled");
			  	} else {
			  		document.getElementById('in_for_group_type').value="ALL";
					$('#in_for_group_type').attr("disabled","disabled");
			  	}			  
			}
		 );		
		$('#in_to_key').click( function() 
			{		
			  document.tariffConditionForm.in_from_key.checked = false;
			  document.tariffConditionForm.in_to_key.checked = true;
			  document.getElementById('in_for_group_type').value="ALL";
			  $('#in_for_group_type').attr("disabled","disabled");
			}
		 ); 
		$('#in_condition_flag').click( function() 
			{
			  document.tariffConditionForm.in_condition_flag.checked = true;
			  document.tariffConditionForm.in_edit_mode.checked = false;
			  document.tariffConditionForm.in_link_mode.checked = false;
			  document.tariffConditionForm.in_warning_mode.checked = false;
			}
		 ); 	
		$('#in_edit_mode').click( function() 
			{
			  document.tariffConditionForm.in_condition_flag.checked = false;
			  document.tariffConditionForm.in_edit_mode.checked = true;
			  document.tariffConditionForm.in_link_mode.checked = false;
			  document.tariffConditionForm.in_warning_mode.checked = false;
			}
	    ); 
		$('#in_link_mode').click( function() 
			{
			  document.tariffConditionForm.in_condition_flag.checked = false;
			  document.tariffConditionForm.in_edit_mode.checked = false;
			  document.tariffConditionForm.in_link_mode.checked = true;
			  document.tariffConditionForm.in_warning_mode.checked = false;
			}
	    ); 
		$('#in_warning_mode').click( function() 
				{
				  document.tariffConditionForm.in_condition_flag.checked = false;
				  document.tariffConditionForm.in_edit_mode.checked = false;
				  document.tariffConditionForm.in_link_mode.checked = false;
				  document.tariffConditionForm.in_warning_mode.checked = true;
				}
		    ); 

		if($('#in_group_type_code').val()=="01"){
			$('#in_warning_mode').removeAttr("disabled");
		} else {
			$('#in_warning_mode').attr("disabled","disabled");
		}		
		
		// code to conver dropdown to multiselect list box

		$('#TYPE').attr("multiple", "multiple");
		$('#TYPE').attr("size", "5");
		// code to bind pop up search
		 
		//Disable /Enable Search Button as per change in User Input



		$('#in_group_code').keyup(function() {
			var validComb= validateCombforMandatoryFiels();
			var grpTypeCode = $("#in_group_type_code").val();
			if(! validComb){
				$("input[type=button][value=Search]").attr("disabled","disabled");
				$('#add_edit').attr("disabled","disabled");
				$('#add_link').attr("disabled","disabled");
				$('#add_warning').attr("disabled","disabled");
			}else{
				$("input[type=button][value=Search]").removeAttr("disabled");
 		 		$('#add_edit').removeAttr("disabled");
 				$('#add_link').removeAttr("disabled");
				if(grpTypeCode=='01')
				{ 					
					//$('#add_warning').removeAttr("disabled");
					if(( validComb==true
						    && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
							  ){			    		    
						     $('#add_warning').removeAttr("disabled");
					 }
			    	 if(( validComb==true
							  && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
								 && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")){			    		   
						     $('#add_warning').removeAttr("disabled");
					 }
			    	 $('#in_warning_mode').removeAttr("disabled");
				}
				$('#add_warning').attr("disabled","disabled");//was uncommented
			}
			if (_displayonly) {
				$('#add_edit').attr("disabled","disabled");
				$('#add_link').attr("disabled","disabled");
				$('#add_warning').attr("disabled","disabled");
			    }	
		});

		$('#in_source_code').keyup(function() {
			var validComb= validateCombforMandatoryFiels();
			var grpTypeCode = $("#in_group_type_code").val();
			if(! validComb){
				$("input[type=button][value=Search]").attr("disabled","disabled");
				$('#add_edit').attr("disabled","disabled");
				$('#add_link').attr("disabled","disabled");
				$('#add_warning').attr("disabled","disabled");				    
			}else{
				$("input[type=button][value=Search]").removeAttr("disabled");
 		 	    $('#add_edit').removeAttr("disabled");
 				$('#add_link').removeAttr("disabled");
				if(grpTypeCode=='01')
				{ 					
					//$('#add_warning').removeAttr("disabled");
					if(( validComb==true
						    && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
							  ){			    		     
						     $('#add_warning').removeAttr("disabled");
					 }
			    	 if(( validComb==true
							  && ($('#in_rate_description').val()==null || $('#in_rate_description').val()=="" || $('#in_rate_description').val()=="ALL")) 
								 && ($('#in_item_name').val()!=null && $('#in_item_name').val()!="" && $('#in_item_name').val()!="ALL")){			    		    
						     $('#add_warning').removeAttr("disabled");
					 }
			    	 $('#in_warning_mode').removeAttr("disabled");
				}
				$('#add_warning').attr("disabled","disabled");
			}
			if (_displayonly) {
				$('#add_edit').attr("disabled","disabled");
				$('#add_link').attr("disabled","disabled");
				$('#add_warning').attr("disabled","disabled");
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
				// $('#condition_delete').removeAttr("disabled");
				  
				 if (_readonly) {
						$('#condition_delete').gatesDisable();   
						$('#authorization').gatesDisable();
				}
				 else
				 {
				 $('#condition_delete').removeAttr("disabled");
				 }

			
				 if (_displayonly) {
						$('#condition_replicate').gatesDisable();   
						$('#authorization').gatesDisable();
				}
				 else
				 {
					 $('#condition_replicate').removeAttr("disabled");
						
				 }
				
			 }else{
				
				 $('#condition_delete').attr("disabled","disabled");
				 $('#condition_replicate').attr("disabled","disabled");
			 } 
		});
		
 
		 
		
		//reset page on change of group type
		$("#in_group_type_code").change(function() {
			$('#resultdiv').hide();
			$("#in_source_code").val("ALL");
			$("#in_group_code").val("ALL");
			$("#in_item_name").val('ALL');
			$("#in_rate_description").val('ALL');
			$("#in_rate_id").val('ALL');
			$("#ratId").val('');
			$("input[type=button][value=Search]").attr("disabled","disabled");
			$('#add_edit').attr("disabled","disabled");
			$('#add_link').attr("disabled","disabled");
			$('#add_warning').attr("disabled","disabled");
			$('#condition_delete').attr("disabled","disabled");
			$('#condition_replicate').attr("disabled","disabled");
			$('#condition_Cancel').hide();
			$('#msgDiv').hide();
			// Think this was Subhases change from release 1, assume he knew what he was doing.
			//document.tariffConditionForm.from.value="";
			document.getElementById('in_condition_flag').checked = true;
			document.getElementById('in_edit_mode').checked = false;
			document.getElementById('in_link_mode').checked = false;
			document.getElementById('in_warning_mode').checked = false;
			//hide display grid too
			if(document.getElementById("displaybase")!=null)
			{
			    document.getElementById("displaybase").style.display="none";
			}
	        var grpTypeCode = $(this).val();
	        var srcTrf = $("#in_source_code").val();
	        var grpNm = $("#in_group_code").val();	
	        var item = $("#in_item_name").val();	
	        var rate = $("#in_rate_description").val();
            if(grpTypeCode=='01')
            {	
        	   if((srcTrf!=null && srcTrf!="" && srcTrf!="ALL" 
        	                 && grpNm!=null && grpNm!="" && grpNm!="ALL"
        	                	  && rate==null || rate=="" || rate=="ALL"))
        	   {
        	       $('#add_warning').removeAttr("disabled");
        	   }
        	   if((srcTrf!=null && srcTrf!="" && srcTrf!="ALL" 
	                 && grpNm!=null && grpNm!="" && grpNm!="ALL"
	                	  && rate==null || rate=="" || rate=="ALL")
	                	       && item!=null && item!="" && item!="ALL")
			   {
			       $('#add_warning').removeAttr("disabled");
			   }
        	   $('#add_warning').attr("disabled","disabled");
        	   document.tariffConditionForm.in_to_key.checked = false;
	   		   document.tariffConditionForm.in_from_key.checked = true;
	   		   $('#in_warning_mode').removeAttr("disabled");	   			
        	} 
            else if(grpTypeCode=='02' || grpTypeCode=='03' || grpTypeCode=='04' || grpTypeCode=='05' || grpTypeCode=='06' || grpTypeCode=='07')
        	{       	 
				$('#add_warning').attr("disabled","disabled");	
				document.tariffConditionForm.in_to_key.checked = true;
	   			document.tariffConditionForm.in_from_key.checked = false;
	   			$('#in_warning_mode').attr("disabled","disabled");
        	}
            
            if(document.tariffConditionForm.in_from_key.checked == true && document.tariffConditionForm.in_link_mode.checked == true){
            	document.getElementById('in_for_group_type').value="ALL";
    			$('#in_for_group_type').removeAttr("disabled");
    	   } else {
    		    document.getElementById('in_for_group_type').value="ALL";
    			$('#in_for_group_type').attr("disabled","disabled");
    	   }            
            
	    });
	   if (_displayonly) {
					$('#add_edit').attr("disabled","disabled");
					$('#add_link').attr("disabled","disabled");
					$('#add_warning').attr("disabled","disabled");
				    }	
	   var screenName = $('input[name="screen"]').val();
		var from = document.tariffConditionForm.from.value;
		var parentFrom = document.tariffConditionForm.parentFrom.value;
	   //$('#condition_Cancel').hide();	
	   
	   	if(from!=null && from!="" && from!="cancel"){
	   		
			   $('#condition_Cancel').show();
		   }
		   else{			   
			   $('#condition_Cancel').hide();	
		   }
	   $("#condition_Cancel").click(function() {
		   var groupTypeCode = document.tariffConditionForm.groupTypeCode.value; 
		   var tariffId=document.tariffConditionForm.tariffId.value;
		   var currentFuture = document.tariffConditionForm.currentFuture.value;
		    var sourceCode = document.tariffConditionForm.sourceCode.value;
		    var groupCode = document.tariffConditionForm.groupCode.value;
		    var rateId=$("#ratId").val();
		    if(currentFuture==true || currentFuture=="true" || currentFuture=="Y"){
				 currentFuture=true;
			 }
			 else{
				 currentFuture=false; // D033899 . Controller method is having this as boolean parameter and prevviously it was asssigned ALL which result in HTTP 400
			 }
		   if(from=="_group"){
	 			document.location.href = _context + '/tariffGroup/showForm?tariffServgrpId='+tariffId+'&tariffServgrpType='+$('#in_group_type_code').val()+'&tariffServSrcCode='+sourceCode+'&tariffServgrpCode='+groupCode+'&screen=00&tariffGrpId=';
		   } 
		   if(from=="_item")
		   {
			   if($('#in_group_type_code').val()=="01" ||  $('#in_group_type_code').val()=="02"){
				   document.location.href = _context + '/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit&parentFrom='+parentFrom;
			   }
			   if($('#in_group_type_code').val()=="03"){
				   document.location.href = _context + '/tariff/itemDra/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture='+currentFuture+'&screen1=edit&mode=edit&parentFrom='+parentFrom;
			   }
			   if($('#in_group_type_code').val()=="04"){
				   document.location.href = _context + '/tariffitemRevDiv/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture='+currentFuture+'&screen=RDV&mode=edit&parentFrom='+parentFrom;
			   }
			   if($('#in_group_type_code').val()=="05"){
				   document.location.href = _context + '/generalServiceItem/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture='+currentFuture+'&screen=MEQ&mode=edit&parentFrom='+parentFrom;
			   }
			   if($('#in_group_type_code').val()=="06"){
				   document.location.href = _context + '/generalServiceItem/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture='+currentFuture+'&screen=MSH&mode=edit&parentFrom='+parentFrom;
			   }
			   if($('#in_group_type_code').val()=="07"){
				   document.location.href = _context + '/generalServiceItem/edit?actionPerformed=EXIT&itemId='+tariffId+'&currentFuture='+currentFuture+'&screen=ACC&mode=edit&parentFrom='+parentFrom;
			   }
		   }
		   if(from=="_rate"){
			   document.location.href = _context + '/tm/traiffRate/showForm?rateDescId='+tariffId+'&action=EXIT&currentFuture='+currentFuture;
		   }
		   if(from=="group"){
			   document.location.href = _context +'/cas/tariffServGrpSearch.do';
		   }
		   if(from=="item"){
			   document.location.href = _context +'/cas/tariffItemSearch.do?groupTypeCode='+ groupTypeCode + '&sourceCode='+ sourceCode + '&groupCode=' + groupCode+'&from='+parentFrom;
		   }
	   });
	   
	    var groupTypeCode = document.tariffConditionForm.groupTypeCode.value; 
	    var sourceCode = document.tariffConditionForm.sourceCode.value;
	    var groupCode = document.tariffConditionForm.groupCode.value;
	    var itemCode = document.tariffConditionForm.itemCode.value;
	    var currentFuture = document.tariffConditionForm.currentFuture.value;
	    var rateDescription =document.tariffConditionForm.rateDescription.value;
	    var rateId =document.tariffConditionForm.rateId.value;
	    var descriptionValueChange = document.tariffConditionForm.descriptionValueChanged.value;
	    if(groupTypeCode!=null || groupTypeCode!='' )
		{
			  if($('#in_group_type_code').val() != groupTypeCode) 
				  $('#condition_Cancel').hide();
				//$('#in_group_type').val(groupTypeCode);
		}
	    if(sourceCode!=null && sourceCode!='')
		{
			 if($('#in_source_code').val() != sourceCode) 
				  $('#condition_Cancel').hide();
			//$('#in_source_tariff').val(sourceCode);
	    }
		if(groupCode!=null && groupCode!='')
		{
			//$('#in_group_name').val(groupCode);
			if($('#in_group_code').val() != groupCode) 
				  $('#condition_Cancel').hide();
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
			if($('#in_item_name').val() != itemCode) 
				  $('#condition_Cancel').hide();
			//$('#in_item_name').val(itemCode);
		}
		if(rateId!=null && rateId!=''){
			if($('#in_rate_id').val() != rateId) 
				  $('#condition_Cancel').hide();
			//$('#in_rate_id').val(rateId);
		}
		
		if(rateDescription!=null && rateDescription!=''){
			if($('#in_rate_description').val() != rateDescription) 
				  $('#condition_Cancel').hide();
		//	$('#in_rate_description').val(rateDescription);
			if(descriptionValueChange == '1'){			
				$('#condition_Cancel').hide();
			}
		}	
		
		
		
	    if(currentFuture=="Y" || currentFuture==""){
			    $("#in_expiration_date_flag").attr("checked", true);
		    }
	    else{
			    $("#in_expiration_date_flag").attr("checked", false);
		}
	    

		// start - Added below code to escape tab on cas search table header and values
		$('#displaybase a').addClass('noTab');	
		$('#displaybase select').addClass('noTab');
		$('#displaybase input[type="checkbox"]').addClass('noTab');
		$('#displaybase input[id="chkbox"]').addClass('noTab');
		
		$('#displaybase a').attr("onfocus","blur()");
		$('#displaybase select').attr("onfocus","blur()");
		$('#displaybase input[type="checkbox"]').attr("onfocus","blur()");
		$('#displaybase input[id="chkbox"]').attr("onfocus","blur()");
		
		$('#displaybase a').attr("tabindex","-1");
		$('#displaybase select').attr("tabindex","-1");
		$('#displaybase input[type="checkbox"]').attr("tabindex","-1");
		$('#displaybase input[id="chkbox"]').attr("tabindex","-1");
		
		$('#displaybase a').attr("onblur","focusSet()");
		$('#displaybase select').attr("onblur","focusSet()");
		$('#displaybase input[type="checkbox"]').attr("onblur","focusSet()");
		$('#displaybase input[id="chkbox"]').attr("onblur","focusSet()");
		// end - Added below code to escape tab on cas search table header and values
			    
		if(($(document).getUrlParam("key")) != null) {    
			if(($(document).getUrlParam("key"))=="From"){
				document.tariffConditionForm.in_from_key.checked = true;
				document.tariffConditionForm.in_to_key.checked = false;
				document.tariffConditionForm.inToKey.value="From";
			}
			else if(($(document).getUrlParam("key"))=="To"){
				document.tariffConditionForm.in_to_key.checked = true;
				document.tariffConditionForm.in_from_key.checked = false;
				document.tariffConditionForm.inToKey.value="To";
			}
		}
		
 
		
});

//start - Added below code to escape tab on cas search table header and values
function focusSet(){
	document.getElementById("add_edit").focus();
}
//end - Added above code to escape tab on cas search table header and values

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
	window.open(actionUrl, 'ItemNameSearch', windowStyle);    
}

function RatePopupSearch() {
	
	rate =  $('#in_rate_description').val();
	item =  $('#in_item_name').val();
	var currentFuture=$("#in_expiration_date_flag").val();
	var rateVal="";
	var url = document.URL;
	if(rate=='')
	{
		rate = 'ALL';
		var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&itemName="+$('#in_item_name').val()+"&rateDesc="+encodeURIComponent(rate)+"&currentFuture="+currentFuture+"&url="+url;
	}
	if(rate=='ALL' || rate=='All' || rate=='all' )
	{
		var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&itemName="+$('#in_item_name').val()+"&rateDesc="+encodeURIComponent(rate)+"&currentFuture="+currentFuture+"&url="+url;
	}
	else if(rate!='ALL' || rate!='All' || rate!='all' )
	{
		var rateDesc = rate.split("-");
		if(rateDesc.length>3){
			for(var i=0;i<rateDesc.length;i++){
				if(i!=0 && i!=1 ){
					if(rateVal!=null && rateVal!=""){
						rateVal=rateVal+"-"+rateDesc[i];
					}
					else{
						rateVal=rateDesc[i];
					}
				}
			}
		}
		else{
			rateVal=rateDesc[2];
		}
		equipResult = rateDesc[0];
		odFlag = rateDesc[1];
		var actionUrl = _context+"/cas/ratelookup.do?grpTyp="+$('#in_group_type_code').val()+"&sourceTariff="+$('#in_source_code').val()+"&grpName="+$('#in_group_code').val()+"&itemName="+$('#in_item_name').val()+"&rateDesc="+encodeURIComponent(rateVal)+"&currentFuture="+currentFuture+"&url="+url;
	}		
	if(item=='' || item=='ALL' || item=='All' || item=='all' ){
		alert("Tariff Item is mandatory");
	}else{
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'RateSearch', windowStyle);    
	}
	
}


function sourceTariffSearchUpdate(id){

var values = id.split("|");
	$('#in_source_code').val(values[0]);
	dataName=values[0];
	var grpTypeCode = $("#in_group_type_code").val();
	var srcTrf = $('#in_source_code').val();
	var grpNm = $('#in_group_code').val();	
	var item = $('#in_item_name').val();
	var rate = $('#in_rate_description').val();
	if(grpTypeCode=='01')
	{ 	
		$('#in_group_code').val(srcTrf);
		$("input[type=button][value=Search]").removeAttr("disabled");
		if(srcTrf!=null && srcTrf!="" && srcTrf!="ALL")
		{
			$("input[type=button][value=Search]").removeAttr("disabled");
		 		$('#add_edit').removeAttr("disabled");
 				$('#add_link').removeAttr("disabled");			
				if(rate==null || rate=="" || rate=="ALL")         	       
				{
					$('#add_warning').removeAttr("disabled");
				}			
		}
	}
	if(srcTrf!=null && srcTrf!="" && srcTrf!="ALL")
	{
		if(grpNm!=null && grpNm!="" && grpNm!="ALL")
		{
			$("input[type=button][value=Search]").removeAttr("disabled");
		 	$('#add_edit').removeAttr("disabled");
 			$('#add_link').removeAttr("disabled");			
			if(grpTypeCode=='01' && (rate==null || rate=="" || rate=="ALL"))
			{ 	
				$('#add_warning').removeAttr("disabled");
			}
			else if(grpTypeCode=='01' 
				     && (item==null || item=="" || item=="ALL") 
					    && (rate==null || rate=="" || rate=="ALL"))
			{ 	
				$('#add_warning').removeAttr("disabled");
			}
			$('#add_warning').attr("disabled","disabled");
		}
	}
	if (_displayonly) {
		$('#add_edit').attr("disabled","disabled");
		$('#add_link').attr("disabled","disabled");
		$('#add_warning').attr("disabled","disabled");
	    }
	
}

function groupNameSearchUpdate(id){
var values = id.split("|");
	$('#in_group_code').val(values[0]);
	dataName=values[0];
	var grpTypeCode = $("#in_group_type_code").val();
	var srcTrf = $('#in_source_code').val();
	var grpNm = $('#in_group_code').val();
	var item = $('#in_item_name').val();
	var rate = $('#in_rate_description').val();
	if(srcTrf!=null && srcTrf!="" && srcTrf!="ALL")
	{
		if(grpNm!=null && grpNm!="" && grpNm!="ALL")
		{
			$("input[type=button][value=Search]").removeAttr("disabled");
		 	$('#add_edit').removeAttr("disabled");
 			$('#add_link').removeAttr("disabled");	
			$('#add_warning').attr("disabled","disabled");
			if(grpTypeCode=='01' && (rate==null || rate=="" || rate=="ALL"))
			{ 		
				$('#add_warning').removeAttr("disabled");
			}
			else if(grpTypeCode=='01' 
			     && (item==null || item=="" || item=="ALL") 
				    && (rate==null || rate=="" || rate=="ALL"))
			{ 	
				$('#add_warning').removeAttr("disabled");
			}
			
		}
	}
	if (_displayonly) {
		$('#add_edit').attr("disabled","disabled");
		$('#add_link').attr("disabled","disabled");
		$('#add_warning').attr("disabled","disabled");
	    }
}

function itemNameSearchUpdate(id){
	var values = id.split("|");
		dataName=values[0];
		$('#in_item_name').val(values[0]);
		$("input[type=button][value=Search]").removeAttr("disabled");
}

function rateSearchUpdate(id){
	$('#resultdiv').hide();
	var values = id.split("|");
	 if(values[2]=="null"){
		 values[2] ="" ;
	 }
	 if(values[3]=="null"){
		 values[3] ="" ;
	 }
	 if(values[4]=="null" || values[4]==null){
		 values[4] ="" ;
	 }
	 var delimited=values[4];
	 var finalDesc="";
	 var split=delimited.split("\\");
	 for(var index=0;index<split.length;index++) {
		 finalDesc=finalDesc+split[index];
	 }
	 
	var rateStr = values[1]+"-"+values[2]+"-"+finalDesc;
		dataName=rateStr;
		$('#in_rate_description').val(rateStr);
		$('#in_rate_id').val(values[0]);
	 	$('input[name="ratId"]').val(values[0]);
	 	$('input[name="rateId"]').val(values[0]);
	 	
		var srcTrf = $("#in_source_code").val();
        var grpNm = $("#in_group_code").val();	
        var item = $("#in_item_name").val();	
		 if((srcTrf!=null && srcTrf!="" && srcTrf!="ALL" 
             && grpNm!=null && grpNm!="" && grpNm!="ALL"
            	  && rateStr==null || rateStr=="" || rateStr=="ALL"))
		 {
		   $('#add_warning').removeAttr("disabled");
		 }
		 else if((srcTrf!=null && srcTrf!="" && srcTrf!="ALL" 
		     && grpNm!=null && grpNm!="" && grpNm!="ALL"
		    	  && rateStr==null || rateStr=="" || rateStr=="ALL")
		    	       && item!=null && item!="" && item!="ALL")
		 {
		   $('#add_warning').removeAttr("disabled");
		 }	 		 
		 $('#add_warning').attr("disabled","disabled");
		 $("input[type=button][value=Search]").removeAttr("disabled");
}


//Enabling Disabling Logic
function validateCombforMandatoryFiels(){
    var grpCode = document.getElementById('in_group_code').value;
    var sourceCode = document.getElementById('in_source_code').value;
   
    //alert('grpCode'+grpCode+'src'+ sourceCode);
    var validComb=false;
    
    if(grpCode!=null && grpCode!="" && grpCode!="ALL" && sourceCode!=null && sourceCode!="" && sourceCode!="ALL"){
    	validComb=true;
    }
    return validComb;
}

function closePrefPopUp() {
	
	 var r=confirm("All the unsaved Changes will be discarded!");
	 if (r==true)
	  {		
		 $('#condition_preference').dialog('close');
	  }
}

//function for CAS Search
function searchValue(){
	
	var inFromKey=document.tariffConditionForm.in_from_key.checked;
    var grupType=$('#in_group_type_code').val();
	if(grupType!=null && grupType!=''){
		if(grupType==01){
			document.tariffConditionForm.in_from_key.checked = true;
			document.tariffConditionForm.in_to_key.checked = false;
			document.tariffConditionForm.inToKey.value="From";
		}
		else{
			if(inFromKey!=true){
				document.tariffConditionForm.in_to_key.checked = true;
				document.tariffConditionForm.in_from_key.checked = false;
				document.tariffConditionForm.inToKey.value="To";
			}
			else{
				document.tariffConditionForm.in_to_key.checked = false;
				document.tariffConditionForm.in_from_key.checked = true;
				document.tariffConditionForm.inToKey.value="From";
			}
		}
	}
    if(($(document).getUrlParam("key")) != null) {    
		if(($(document).getUrlParam("key"))=="From"){
			document.tariffConditionForm.in_from_key.checked = true;
			document.tariffConditionForm.in_to_key.checked = false;
			document.tariffConditionForm.inToKey.value="From";
		}
		else if(($(document).getUrlParam("key"))=="To"){
			document.tariffConditionForm.in_to_key.checked = true;
			document.tariffConditionForm.in_from_key.checked = false;
			document.tariffConditionForm.inToKey.value="To";
		}
	}
    
	if(($('#in_source_code').val()== "ALL" ) || ($('#in_source_code').val() == "all") || ($('#in_source_code').val() == "All")) {
			alert('Source Tariff is mandatory');
			return false;	
	}
	
	
	if($('#in_expiration_date_flag').attr('checked')){
		 $("#in_expiration_date_flag").val("Y");
	}else{
		 $("#in_expiration_date_flag").val("N");
	}
	
	if(($('#in_group_code').val()== "ALL" ) || ($('#in_group_code').val() == "all") || ($('#in_group_code').val() == "All")) {
		alert('Group Name is mandatory');
		return false;	
    }	
	
	else{
		document.tariffConditionForm.delete1.value = "";
		var groupTypeCode=$("#in_group_type_code").val();
		var sourceCode= $("#in_source_code").val();
		var groupCode=$("#in_group_code").val();
		var itemCode=$("#in_item_name").val();
		var rateDescription=($("#in_rate_description").val());
		rateDescription = rateDescription.htmlEncode();
		//rateDescription = encodeURIComponent(rateDescription);
		var fromRateId=$('#in_rate_id').val();
		var currentFuture=$("#in_expiration_date_flag").val();
		
		$("#in_rate_description").val(rateDescription);
  		 $.ajax({
			   type: "POST",
			   url: _context +"/condition/onSearchSetContext",
			   data: {
				   		groupTypeCode: groupTypeCode,
				   		sourceCode: sourceCode,
				   		groupCode: groupCode,
				   		itemCode: itemCode,
				   		rateDescription : rateDescription,
				   		fromRateId: fromRateId,
				   		fromToKey:document.tariffConditionForm.inToKey.value,
				   		currentFuture :currentFuture,
	 		 },
			   success: function(responseText){
				   if (responseText.success == true) {
					   
	 					document.tariffConditionForm.method.value="show";
	 					postMethod('search',document.tariffConditionForm.method);
	 					return true;
	 				}
				 }
			 });
	}	
}
String.prototype.htmlEncode = function () {
    return String(this)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    	.replace(/=/g, '&#61;');

}
function searchDefaultValue(){
		//document.tariffConditionForm.delete1.value = "";
	    var paging =document.tariffConditionForm.paging.value;
	    var pagingStatus=is_int(paging);
	    $('#from').val(document.tariffConditionForm.from.value);
	 	if(pagingStatus==false){
	    $('#in_group_type_code').val(document.tariffConditionForm.groupTypeCode.value);
		$('#in_source_code').val(document.tariffConditionForm.sourceCode.value);
		$('#in_group_code').val(document.tariffConditionForm.groupCode.value);
		$('#in_item_name').val(document.tariffConditionForm.itemCode.value);
		//$('#in_rate_description').val(document.tariffConditionForm.rateDescription.value);
		$('#in_rate_id').val(document.tariffConditionForm.rateId.value);
		$('input[name="ratId"]').val(document.tariffConditionForm.rateId.value);
		$('#in_expiration_date_flag').val(document.tariffConditionForm.currentFuture.value);
		$('#sort_by').val("1");
		$('#sort_order').val("2");
		$('#starting_rownum').val("0");
		$('#page_size').val("100");
		 if(document.tariffConditionForm.currentFuture.value=="Y"){
			    $("#in_expiration_date_flag").attr("checked", true);
			    document.tariffConditionForm.currentFuture.value="Y";
		    }
	    else{
			    $("#in_expiration_date_flag").attr("checked", false);
			    $('#in_expiration_date_flag').val("ALL");
			    document.tariffConditionForm.currentFuture.value="ALL";
		}
		var grupType=$('#in_group_type_code').val();
		if(grupType!=null && grupType!=''){
			if(grupType==01){
				document.tariffConditionForm.in_from_key.checked = true;
				document.tariffConditionForm.in_to_key.checked = false;
				document.tariffConditionForm.inToKey.value="From";
			}
			else{

				document.tariffConditionForm.in_to_key.checked = true;
				document.tariffConditionForm.in_from_key.checked = false;
				document.tariffConditionForm.inToKey.value="To";
			
			}
		}
		if(($(document).getUrlParam("key")) != null) {    
			if(($(document).getUrlParam("key"))=="From"){
				document.tariffConditionForm.in_from_key.checked = true;
				document.tariffConditionForm.in_to_key.checked = false;
				document.tariffConditionForm.inToKey.value="From";
			}
			else if(($(document).getUrlParam("key"))=="To"){
				document.tariffConditionForm.in_to_key.checked = true;
				document.tariffConditionForm.in_from_key.checked = false;
				document.tariffConditionForm.inToKey.value="To";
			}
		}
//		if(document.tariffConditionForm.inToKey.value=="To" ){
//	    document.tariffConditionForm.in_to_key.checked = true;
//		document.tariffConditionForm.in_from_key.checked = false;
//		}
//	    else if(document.tariffConditionForm.inToKey.value=="From"){
//	    	document.tariffConditionForm.in_from_key.checked = true;
//			document.tariffConditionForm.in_to_key.checked = false;
//		}
	    document.tariffConditionForm.in_condition_flag.checked = true;
	    var rateDescription=($("#in_rate_description").val());
		rateDescription = rateDescription.htmlEncode();
		$("#in_rate_description").val(rateDescription);
		if($('#in_group_code').val()!=null && $('#in_group_code').val()!='' && $('#in_group_code').val()!='ALL' ){	
	  		 $.ajax({
				   type: "POST",
				   url: _context +"/condition/onSearchSetContext",
				   data: {
					   		groupTypeCode:  $('#in_group_type_code').val(),
					   		sourceCode: $('#in_source_code').val(),
					   		groupCode: $('#in_group_code').val(),
					   		itemCode: $('#in_item_name').val(),
					   		rateDescription : rateDescription,
					   		fromRateId: $('#in_rate_id').val(),
					   		fromToKey:document.tariffConditionForm.inToKey.value,
					   		currentFuture :document.tariffConditionForm.currentFuture.value,
		 		 },
				   success: function(responseText){
					   if (responseText.success == true) {
						    document.tariffConditionForm.method.value="show";
							postMethod('search',document.tariffConditionForm.method);
							return true;	
		 				}
					 }
				 });
			
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

//function for reset form

function resetForm(){
	document.tariffConditionForm.delete1.value = "";
	$('#displaybase').remove();	
	resetFileds(document.tariffConditionForm);
	//document.tariffConditionForm.in_to_key.checked = false;
	//document.tariffConditionForm.in_edit_mode.checked = false;
	//document.tariffConditionForm.in_link_mode.checked = false;
	$("#in_group_type_code").val('01');
	$("#in_source_code").val("ALL");
	$("#in_group_code").val("ALL");
	$("#in_item_name").val("ALL");
	$("#in_rate_description").val("ALL");
	//alert('reset2');
	//disable all buttons after reset
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#add_edit').attr("disabled","disabled");
	$('#add_link').attr("disabled","disabled");
	$('#add_warning').attr("disabled","disabled");
	
	$('#condition_delete').attr("disabled","disabled");
	$('#condition_replicate').attr("disabled","disabled");
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
		value : checkedValue,
		'class' : 'noTab'
	});
	$obj.replaceWith($elemx); 
	$("#in_expiration_date_flag").attr("checked", status);//should be checked by default
	//start Added below code to escape tab on check box
	$('#in_expiration_date_flag').attr('class','noTab');
	//end below above to escape tab on check box
}


function addEditCondition()
{
	document.tariffConditionForm.delete1.value = "";
	 var grpTyp = document.getElementById('in_group_type_code').value;
     var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     var rate = document.getElementById('in_rate_description').value;
     var fromRateId= $('#in_rate_id').val();
     var currentFuture =  $("#in_expiration_date_flag").val();
     var from = document.tariffConditionForm.from.value;
     var parentFrom = document.tariffConditionForm.parentFrom.value;
     var key="";
     if(fromRateId=="undefined" || fromRateId=="rateId" || fromRateId==0)
     {
    	 fromRateId=0;
     }
     else{
    	 var inToKey=document.tariffConditionForm.in_to_key.checked;
    		var inFromKey=document.tariffConditionForm.in_from_key.checked;
    		var key;
    		if(inToKey==true)
    		{
    			key='To';
    		}else if(inFromKey=true)
    		{
    			key='From';
    		}
     }
//     else{
//    	 key="From";
//     }
 	var inToKey=document.tariffConditionForm.in_to_key.checked;
	var inFromKey=document.tariffConditionForm.in_from_key.checked;
	var key;
	if(inToKey==true)
	{
		key='To';
	}else if(inFromKey=true)
	{
		key='From';
	}
    // $('#rateId').val(data.id);	
     var screen="edit";
     var conditionID = $(":checkbox:checked").val();
     var pass= true;
     
     if(rate!=null && rate!='' && rate!="ALL")
 	{
 		$.ajax({
 			   type: "GET",
 			   url: _context +"/condition/validateItemRateEntry?",
 			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&itemCode="+itemCode+"&rateID="+fromRateId,
 			   success: function(msg){
 				   if(msg=="NotValid"){
 					   alert('Not a valid combination of Group Name,Source Tariff,Item and rate to add Condition'); 
 					   return;
 					}
 				  else{
						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;	
					}
 			   }
 	 });
 	}
 	else if((itemCode==null || itemCode=='' || itemCode=="ALL"))
	{
		$.ajax({
			   type: "GET",
			   url: _context +"/tariff/itemFrtWrf/validateItemCombination?",
			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode,
			   success: function(msg){
				   if(msg=="NotValid"){
					   alert('Not a valid combination of Group Name and Source Tariff to add Condition.'); 
					   return;
					}else{
						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;	
					}
			   }
	    });
	}
	else
		{
		$.ajax({
			   type: "GET",
			   url: _context +"/tm/traiffRate/validateGrpItmCombination?",
			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&itemCode="+itemCode,
			   success: function(msg){
				   
				    if(msg=="NotValid"){
					   alert('Not a valid combination of Group Name,Source Tariff and Item to add Condition'); 
					   return;
					}else if (msg=="Error"){
						alert('Error in validating the Group and Item combination; please try again.'); 
						   return;
					}
					else{
						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;	 
					}
				 }
			 });
		}
	}

function loadSeq(conditionID)
{
	var searchLength = document.tariffConditionForm.searchInput.length;
	var currentFuture =  $("#in_expiration_date_flag").val();
	var condToUpdate = "";
	var screenName = $('input[name="screen"]').val();
	var from = document.tariffConditionForm.from.value;
	 var parentFrom = document.tariffConditionForm.parentFrom.value;
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}
	var parentFrom = document.tariffConditionForm.parentFrom.value;
	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffConditionForm.searchInput[i].checked;
			searchInp = document.tariffConditionForm.searchInput[i].value;
		} else {
			checked = document.tariffConditionForm.searchInput.checked;
			searchInp = document.tariffConditionForm.searchInput.value;
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
	var inToKey=document.tariffConditionForm.in_to_key.checked;
	var inFromKey=document.tariffConditionForm.in_from_key.checked;
	var key;
	if(inToKey==true)
	{
		key='To';
	}else if(inFromKey=true)
	{
		key='From';
	}
	if (selCount == 0) {
		document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+conditionID+'&screenParam=conditionSearch&key='+key+'&isCurrentFuture='+currentFuture+'&screenName='+screenName+'&from='+from+'&parentFrom='+parentFrom;
		} else {
		document.location.href = _context +'/condition/edit?actionPerformed=edit&conditionId='+ condToUpdate+'&screenParam=conditionSearch&key='+key+'&isCurrentFuture='+currentFuture+'&screenName='+screenName+'&from='+from+'&parentFrom='+parentFrom;
	}
}

function addLinkCondition()
{
	document.tariffConditionForm.delete1.value = "";
	 var grpTyp = document.getElementById('in_group_type_code').value;
	 var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     var rate = document.getElementById('in_rate_description').value;
     var fromRateId= $('#in_rate_id').val();
 	var inToKey=document.tariffConditionForm.in_to_key.checked;
	var inFromKey=document.tariffConditionForm.in_from_key.checked;
	var currentFuture =  $("#in_expiration_date_flag").val();
	var from = document.tariffConditionForm.from.value;
	 var parentFrom = document.tariffConditionForm.parentFrom.value;
	var key;
	if(inToKey==true)
	{
		key='To';
	}else if(inFromKey=true)
	{
		key='From';
	}
     
     if(fromRateId=="undefined" || fromRateId=="rateId")
	 {
	 fromRateId=0;
	 }
     var screen ="link";
     var conditionID = $(":checkbox:checked").val();
     if(rate!=null && rate!='' && rate!="ALL"){
  		$.ajax({
  			   type: "GET",
  			   url: _context +"/condition/validateItemRateEntry?",
  			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&itemCode="+itemCode+"&rateID="+fromRateId,
  			   success: function(msg){
  				   if(msg=="NotValid"){
  					   alert('Not a valid combination of Group Name,Source Tariff,Item and rate to add Condition'); 
  					   return;
  					}
  				  else{
  					 if(grpTyp == '01'){
  						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
  					 }
  					 else{
  						var toLinkage ="toLinkage";
  			  			document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&secondayLinkage='+toLinkage+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
  					 }
 					}
  			   }
  	 });
  	}
  	else if((itemCode==null || itemCode=='' || itemCode=="ALL")){
 		$.ajax({
 			   type: "GET",
 			   url: _context +"/tariff/itemFrtWrf/validateItemCombination?",
 			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode,
 			   success: function(msg){
 				   if(msg=="NotValid"){
 					   alert('Not a valid combination of Group Name and Source Tariff to add Condition.'); 
 					   return;
 					}else{
 	  					 if(grpTyp == '01'){
 	  						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
 	  					 }
 	  					 else{
 	  						var toLinkage ="toLinkage";
 	  			  			document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+fromRateId+'&screenName='+screen+'&secondayLinkage='+toLinkage+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
 	  					 }
 	 					}
 			   }
 	    });
 	}
 	else{
 		$.ajax({
 			   type: "GET",
 			   url: _context +"/tm/traiffRate/validateGrpItmCombination?",
 			   data: "grpType="+ grpTyp+"&grpName="+ grpCode+"&srcTariff="+ sourceCode+"&itemCode="+itemCode,
 			   success: function(msg){
 				   
 				    if(msg=="NotValid"){
 					   alert('Not a valid combination of Group Name,Source Tariff and Item to add Condition'); 
 					   return;
 					}else if (msg=="Error"){
 						alert('Error in validating the Group and Item combination; please try again.'); 
 						   return;
 					}
 					else{
 	  					 if(grpTyp == '01'){
 	  						document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+fromRateId+'&screenName='+screen+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
 	  					 }
 	  					 else{
 	  						var toLinkage ="toLinkage";
 	  			  			document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+fromRateId+'&screenName='+screen+'&secondayLinkage='+toLinkage+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
 	  					 }
 	 					}
 				 }
 			 });
 		}
}

function addWarningCondition()
{
	document.tariffConditionForm.delete1.value = "";
	 var grpTyp = document.getElementById('in_group_type_code').value;
     var grpCode = document.getElementById('in_group_code').value;
     var sourceCode = document.getElementById('in_source_code').value;
     var itemCode = document.getElementById('in_item_name').value;
     var rate = document.getElementById('in_rate_description').value;
     var fromRateId= $('input[name="ratId"]').val();
     var currentFuture =  $("#in_expiration_date_flag").val();
     var from = document.tariffConditionForm.from.value;
     var parentFrom = document.tariffConditionForm.parentFrom.value;
     if(fromRateId=="undefined" || fromRateId=="rateId")
	 {
	 fromRateId=0;
	 }
     var screen ="warning";
	var conditionID = $(":checkbox:checked").val();
	var pass= true;
	if((grpCode=="" || grpCode.toUpperCase()=="ALL")||(sourceCode=="" || sourceCode.toUpperCase()=="ALL")){
		pass= false;
	}
	
	if(pass){
	document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+encodeURIComponent(rate)+'&fromRateId='+fromRateId+'&screenName='+screen+'&isCurrentFuture='+currentFuture+'&from='+from+'&parentFrom='+parentFrom;
	}
	else{
		alert(" Source Tariff and Group Name is mandatory");
	}}

function replicateCondition()
{
	document.tariffConditionForm.delete1.value = "";
	var conditionId = $(":checkbox:checked").val();
	var screen='01';
	var currentFuture = document.tariffConditionForm.currentFuture.value;
	var searchLength = document.tariffConditionForm.searchInput.length;
	var conditionsToUpdate = "";
	var from = document.tariffConditionForm.from.value;
	if (typeof (searchLength) == "undefined") {
		searchLength = 1;
	}

	var selCount = 0;
	for ( var i = 0; i < searchLength; i++) {
		var checked = false;
		var searchInp = "";

		if (searchLength != 1) {
			checked = document.tariffConditionForm.searchInput[i].checked;
   			searchInp = document.tariffConditionForm.searchInput[i].value;
		} else {
			checked = document.tariffConditionForm.searchInput.checked;
   			searchInp = document.tariffConditionForm.searchInput.value;
		}

		if (checked) {
			selCount = selCount + 1;
			var selItem = "";
			var temp = new Array();
			temp = searchInp.split(',');
			selItem = temp[0];
			conditionsToUpdate = conditionsToUpdate + selItem + ",";
		}
	}	
	if (selCount == 0) {
		conditionId = conditionId;
	} else {
		conditionId = conditionsToUpdate;
	}	
	document.location.href= _context +'/condition/replicate/showForm?traiffConditionID='+conditionId+'&screen='+screen+'&isCurrentFuture='+currentFuture+'&from='+from;
}

//function for reset form
function setdefaults(){
	
    if (($(document).getUrlParam("groupTypeCode")) != null) {    	
	    $("#in_group_type_code").val(unescape($(document).getUrlParam("groupTypeCode")));
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
	if (($(document).getUrlParam("rateDescription")) != null){
	    $("#in_rate_description").val((unescape($(document).getUrlParam("rateDescription"))).htmlEncode());
	}
	
	if (($(document).getUrlParam("tariffRateDescriptionId")) != null){
		
		$('input[name="ratId"]').val(unescape($(document).getUrlParam("tariffRateDescriptionId")));
		
	}
	if(($(document).getUrlParam("key")) != null) {    
		if(($(document).getUrlParam("key"))=="From"){
			document.tariffConditionForm.in_from_key.checked = true;
			document.tariffConditionForm.in_to_key.checked = false;
		}
		else if(($(document).getUrlParam("key"))=="To"){
			document.tariffConditionForm.in_to_key.checked = true;
			document.tariffConditionForm.in_from_key.checked = false;
		}
	}
	//document.tariffConditionForm.in_from_key.checked = true;
	document.tariffConditionForm.in_condition_flag.checked = true;
	if (($(document).getUrlParam("groupTypeCode")) != null) {
	  if(document.getElementById("displaybase")!=null){
		  document.getElementById("displaybase").style.display="none";
	   }	  
	  
	   var frm = document.forms["tariffConditionForm"];	  
	   frm.method.value="show";	  
	   postMethod('search',frm.method);
	}
	if (_displayonly) {
		$('#add_edit').attr("disabled","disabled");
		$('#add_link').attr("disabled","disabled");
		$('#add_warning').attr("disabled","disabled");
	    }
	var grupType=$('#in_group_type_code').val();
    if(grupType!="01")
		{
		//document.tariffConditionForm.in_to_key.checked = true;
		//document.tariffConditionForm.in_from_key.checked = false;
	   }
	
}


function deleteCondition()
{
	var grpId=$('input[name="grpId"]').val();
	var itemId=$('input[name="itemId"]').val();
	var rateId= $('input[name="rateId"]').val();
	var fromEntityCode="";
	var fromEntityId="";
	if(rateId!=null && rateId!=""){
		fromEntityId=rateId;
		fromEntityCode="TRRD";
	}
	else if(itemId!=null && itemId!=""){
		fromEntityId=itemId;
		fromEntityCode="TRSI";
	}
	else if(grpId!=null && grpId!=""){
		fromEntityId=grpId;
		fromEntityCode="TRSV";
	}
	
	var searchLength=document.tariffConditionForm.searchInput.length;
	var condCanDel="";			
	if(typeof(searchLength)=="undefined"){		
		searchLength=1;
	}		
    var selCount=0;
   	for(var i=0; i < searchLength; i++)
    {
   		var checked=false;
   		var searchInp="";
		
   		if(searchLength!=1){
   			checked = document.tariffConditionForm.searchInput[i].checked;
   			searchInp = document.tariffConditionForm.searchInput[i].value;
   		}else{
   			checked = document.tariffConditionForm.searchInput.checked;
   			searchInp = document.tariffConditionForm.searchInput.value;
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
	   			blockUI();
	   		 $.ajax({
				   type: "POST",
				   url: _context +"/condition/deleteTariffCondition",
				   data: {
					   		condTodelete: condCanDel,
			 		 		 entityId: fromEntityId,
			 		 		 entityCode: fromEntityCode,
		 		 },
				   success: function(msg){
					   
					  // _context + "/cas/tariffConditionSearch.do?
					 
					   	if (msg == "Deleted Sucessfully"){
					        document.tariffConditionForm.delete1.value="delete1";
					        var frm = document.forms["tariffConditionForm"];
                            frm.method.value="show";
                            postMethod('search',frm.method);
					   	 //document.location.href =_context + "/cas/tariffConditionSearch.do?delete1=delete1";
					   	/*	$("#delete_success")
					   	    .dialog("open")
					   	    .queue(function(next){
					   	        $(this).dialog("open");
					   	        next(); // take this function out of queue a.k.a dequeue a.k.a notify done
					   	           // so the next function on the queue continues execution...
					   	    })
					   	    */
						   //	$('#delete_success').dialog('open');
					   	 
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

function setClear()
{
	blockUI();
	document.tariffConditionForm.delete1.value = "";
	$('#msgDiv').hide();
	$('#resultdiv').hide();
	//document.getElementById('in_group_type_code').value="01";
	document.getElementById('in_source_code').value="ALL";
	document.getElementById('in_group_code').value="ALL";
	document.getElementById('in_item_name').value="ALL";
	document.getElementById('in_rate_description').value="ALL";
	document.getElementById('in_for_group_type').value="ALL";
	//
	$('input[name="grpId"]').val("");
	$('input[name="itemId"]').val("");
	
	$('#in_expiration_date_flag').attr("checked",true);
	 $("#in_expiration_date_flag").val("Y");
	document.getElementById('in_from_key').checked = true;
	document.getElementById('in_to_key').checked = false;
	document.getElementById('in_condition_flag').checked = true;
	document.getElementById('in_edit_mode').checked = false;
	document.getElementById('in_link_mode').checked = false;
	document.getElementById('in_warning_mode').checked = false;
	//in_expiration_date_flag
	//in_from_key,in_to_key
	//in_condition_flag,in_edit_mode,in_link_mode
	
	//disable all buttons after reset
	$("input[type=button][value=Search]").attr("disabled","disabled");
	$('#in_for_group_type').attr("disabled","disabled");
	$('#add_edit').attr("disabled","disabled");
	$('#add_link').attr("disabled","disabled");
	$('#add_warning').attr("disabled","disabled");
	$('#condition_delete').attr("disabled","disabled");
	$('#condition_replicate').attr("disabled","disabled");
	$('#condition_Cancel').hide();
	$.unblockUI();
	//document.tariffConditionForm.from.value="";
	document.location.href = _context+"/cas/tariffConditionSearch.do?useCache=no&method=show";
	
}

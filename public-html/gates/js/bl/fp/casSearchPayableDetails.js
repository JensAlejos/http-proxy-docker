$(document).ready(function() {
	$('form[name="payableDetailSearchForm"]').formatCasSearchForm({ 
		hasSavedSearchFeature: false, 
		customActions: [ ]
		});
	
	// div for "Search" and "Clear" buttons
	$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').after(
			'<div id="showButtons">' +	
			'<table>' +
			'<tr>' +
			  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
			  '<td><input type="button" onclick="setClear();" value="Clear" name="clear" class="buttonNoFloat"></td>' +
			'</tr>' +
		  	'</table>' +
		  	'</div>'	
	 );
	
	// hide CAS generated "Search" and "Clear" Button
	$('div.searchTable').parent().parent().parent().children('tr:nth-child(4)').hide();
	
	setdefaults();
	
	$("#in_check_number").attr('size',11);
	$("#in_vin_no_unit_desc").attr('size',21);
	$("#in_begin_date").attr('size',10);
	$("#in_container_number").attr('size',11);
	$("#in_organization_code").attr('size',38);
	$("#in_end_date").attr('size',10);	
	
	//setting maxLengths for different fields
	
	$("#in_check_number").attr('maxLength',8);
	$("#in_vin_no_unit_desc").attr('maxLength',29);
	$("#in_begin_date").attr('maxLength',10);
	$("#in_container_number").attr('maxLength',11);
	$("#in_organization_code").attr('maxLength',38);
	$("#in_end_date").attr('maxLength',10);	
	
	
	
	//for hiding extra fields
	$('td.dataField:contains("in_shipment_sequence_no:")').hide();
	$('#in_shipment_sequence_no').hide();
	$('td.dataField:contains("in_entry_number:")').hide();
	$('#in_entry_number').hide();
	$('td.dataField:contains("in_fp_remit_advice_id:")').hide();
	$('#in_fp_remit_advice_id').hide();
	$('td.dataField:contains("in_organization_id:")').hide();
	$('#in_organization_id').hide();
	$('td.dataField:contains("in_newbegin_date:")').hide();
	$('#in_newbegin_date').hide();
	$('td.dataField:contains("in_newend_date:")').hide();
	$('#in_newend_date').hide();
	$('td.dataField:contains("in_using_orgn_id:")').hide();
	$('#in_using_orgn_id').hide();
	
	$('td.dataField:contains("in_search_criteria:")').hide();
	$('#in_search_criteria').hide();
	$('td.dataField:contains("in_arol_id:")').hide();
	$('#in_arol_id').hide();
	
	
	//code for remittance advice
	$('#in_fp_remit_advice').hide();
	$('#in_fp_remit_advice').parent().append(
     		  '<input id="remitType"   type="text" size="1" maxlength="3" value="FP" disabled/>'+'  '+
              '<input id="remitId"  type="text"  size="9" maxlength="8"/>'              
    );
	
	//code for shipment number
	$('#in_shipment_number').hide();
	$('#in_shipment_number').parent().append(
			'<input id="shipNo"   type="text" size="7" maxlength="7" />'+'<label align=middle> - </label>'+
            '<input id="shipSeqNo"  type="text"  size="2" maxlength="3"/>'          
    ); 
	
	//code for manual entry
	$('#in_prefix_code').hide();
	$('#in_prefix_code').parent().append(
			'<input id="manualEntryPrefix"   type="text" size="3" maxlength="3" />'+'<label align=middle> - </label>'+
            '<input id="manualEntryNo"  type="text"  size="8" maxlength="8"/>'          
    ); 
	
	
	if($('#in_organization_code').val()!=null &&  $('#in_organization_code').val()!='ALL' )
	{		
		$('#in_organization_id').val('');
		$('#in_arol_id').val('');
	}
	
	$('#remitId').val($('#in_fp_remit_advice_id').val());
	$('#shipNo').val($('#in_shipment_number').val());
	$('#shipSeqNo').val($('#in_shipment_sequence_no').val());
	$('#manualEntryPrefix').val($('#in_prefix_code').val());
	$('#manualEntryNo').val($('#in_entry_number').val());
	
	//to get the calendar on the fields
	$("#in_begin_date").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#in_end_date").datepicker({ dateFormat: 'mm-dd-yy' });
	
	$("#in_begin_date").click(function() {		
		removeErrorPointers();
	});
	$("#in_end_date").click(function() {		
		removeErrorPointers();
	});
	$("#shipNo").click(function() {	
		removeErrorPointers();
	});
	
	//onFocus and blur on fields which are not cas build
	 $('#shipNo').focus(function() {
		 if($("#shipNo").val()=='ALL'){
				$("#shipNo").val('');
		 }
		});			 
	 $('#shipNo').blur(function(){
		 if($("#shipNo").val()==''){
				$("#shipNo").val('ALL');
			}
    	});
	$("#remitId").click(function() {	
		removeErrorPointers();
	});
	$('#remitId').focus(function() {
		 if($("#remitId").val()=='ALL'){
				$("#remitId").val('');
		 }
		});			 
	 $('#remitId').blur(function(){
		 if($("#remitId").val()==''){
				$("#remitId").val('ALL');
			}
   	});
	$("#shipSeqNo").click(function() {	
		removeErrorPointers();
	});
	$('#shipSeqNo').focus(function() {
		 if($("#shipSeqNo").val()=='ALL'){
				$("#shipSeqNo").val('');
		 }
		});			 
	 $('#shipSeqNo').blur(function(){
		 if($("#shipSeqNo").val()==''){
				$("#shipSeqNo").val('ALL');
			}
  	});
	$("#manualEntryPrefix").click(function() {	
		removeErrorPointers();
	});
	$('#manualEntryPrefix').focus(function() {
		 if($("#manualEntryPrefix").val()=='ALL'){
				$("#manualEntryPrefix").val('');
		 }
		});			 
	 $('#manualEntryPrefix').blur(function(){
		 if($("#manualEntryPrefix").val()==''){
				$("#manualEntryPrefix").val('ALL');
			}
 	});
	$("#manualEntryNo").click(function() {	
		removeErrorPointers();
	});
	$('#manualEntryNo').focus(function() {
		 if($("#manualEntryNo").val()=='ALL'){
				$("#manualEntryNo").val('');
		 }
		});			 
	 $('#manualEntryNo').blur(function(){
		 if($("#manualEntryNo").val()==''){
				$("#manualEntryNo").val('ALL');
			}
 	});
	
	
	//setting default begin date and end date	
	var now = new Date();
	now.setDate(now.getDate()-90);	
	var priorDate = $.datepicker.formatDate('mm-dd-yy',now);
	if($('#in_begin_date').val()==null ||  $('#in_begin_date').val()=='ALL' && $('#in_search_criteria').val()!='true' )
	{		
		$('#in_begin_date').val(setFormattedDate(priorDate));		
	}	
	var now1 = new Date();
	var currentDate = $.datepicker.formatDate('mm-dd-yy',now1);		
	if($('#in_end_date').val()==null || $('#in_end_date').val()=='ALL' && $('#in_search_criteria').val()!='true')
	{
		$('#in_end_date').val(setFormattedDate(currentDate));	
	}
		
	
	
	//code for group name predictive
	$('#in_organization_code').gatesAutocomplete({
		 source:  _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 		 method: 'searchVendor',
		 		 		 searchType: '313',
		 		 	 },		
		 formatItem: function(data) {					 	 
		 	return data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
		 },
		 formatResult: function(data) {
		 		 return data.orgn_name+"-"+data.orgn_code+"-"+data.carrierCode;
		 },
		 select: function(data) {			 			
		 	 $('#in_organization_id').val(data.orgn_Id);
		 	 $('#in_using_orgn_id').val(data.using_OrgnId);	
		 	$('#in_arol_id').val(data.arol_Id);
		 	 onChangeOfOrgn(false);
		 },		
		 autoSelectFirst:true,					// code added for autoselect on tab out
			autoSelectCriteria:function(data){
				if(data.carrierCode.toUpperCase()==$('#in_organization_code').val().toUpperCase())
					return true;
				else if(data.orgn_code.toUpperCase()==$('#in_organization_code').val().toUpperCase())
					return true;
				else
					return false;
			}
	});		
	
	 //shipment no predictive search		
	 var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355';
	 $('#shipNo').gatesAutocomplete({
			source: url,
			//minLength: 7,
			formatItem: function(data) {
				return data.shpmntNo;
			},
			formatResult: function(data) {
				return data.shpmntNo;
			}, 
			select: function(data) {
				$('#shipNo').val(data.shpmntNo);
				$('#shipSeqNo').val('');
				//(shipment sequence no predictive search)
				//code to get filtered shipment sequence no for selected shipment No				
				 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354&parentSearch='+ $('#shipNo').val();
				 $('#shipSeqNo').gatesAutocomplete({
						source: url1,
						//minLength: 7,
						formatItem: function(data) {
							return data.sequenceNo;
						},
						formatResult: function(data) {
							return data.sequenceNo;
						}, 
						select: function(data) {
							$('#shipSeqNo').val(data.sequenceNo);							
						}
				});
			}
		});
	 
	 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354&parentSearch='+ $('#shipNo').val();
	 $('#shipSeqNo').gatesAutocomplete({
			source: url1,
			//minLength: 7,
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipSeqNo').val(data.sequenceNo);							
			}
	});
	
	 $('#in_organization_code').gatesPopUpSearch({func:function() {vendorPopupSearch()}});
	 
	 //on change functionality of each search criteria
	 $('#remitId').change(function()
		{
		 	onChangeOfRemit();
		});
	 $('#in_check_number').change(function()
				{
		 onChangeOfCheckNumber();
				});
	 $('#in_vin_no_unit_desc').change(function()
				{
		 onChangeOfVI();
				});
	 $('#shipNo').change(function()
				{
		 onChangeOfShipNo();
				});
	 $('#shipSeqNo').change(function()
				{
		 onChangeOfShipSeq();
				});
	 $('#manualEntryPrefix').change(function()
				{
		 onChangeOfMEPrefix();
				});
	 $('#manualEntryNo').change(function()
				{
		 onChangeofMEId();
				});
	 $('#in_container_number').change(function()
				{
		 onChangeOfContainer();
				});
	 $('#in_organization_code').change(function()
				{
		 onChangeOfOrgn(true);
				});
	 
	 //code commented as handled in SP
	/*//code to add Void check with check number 
		var table = document.getElementById("casQuickSearch");
		if(table!=null){
			
		for (var i = 1, row; row = table.rows[i]; i++) {
			  //check ur condition here
			  if(row.cells[10].innerHTML!='N'&& row.cells[10].innerHTML=='Y') {
				  var val=row.cells[9].innerHTML;
				  val=val+"(V)";
				  row.cells[9].innerHTML=val;
			  }  
		}
			
		}*/
	 
	 //code to check for condition of hyperlink in Manual Entry
		var table = document.getElementById("casQuickSearch");
		if(table!=null){
			
		for (var i = 1, row; row = table.rows[i]; i++) {
			  //check ur condition here
			  if(row.cells[13].innerHTML!='E') {
				  	var col=row.cells[3];
					var index1=col.innerHTML.indexOf(">");
					var index2=col.innerHTML.indexOf("</");
					var val=col.innerHTML.substring(index1+1,index2);
					col.innerHTML=val;
			  }  
		}
			
		}
	 
	 
	// hiding unnecessay fields from screen Void Check Field and Transaction_Type
	 $('td:nth-child(12),th:nth-child(12)').hide();
	 $('td:nth-child(14),th:nth-child(14)').hide();
	 //code to hide VIN Number in search result.
	 $('casQuickSearch td:nth-child(1),th:nth-child(1)').hide();
	 $('#casQuickSearch tbody td:nth-child(1)').hide();
	 
	/*Shipment Security */
	 enforceSecurityTitle(isPayabledetailsDisplay);
	 enforceSecurityDivAndButtons('displaydiv', isPayabledetailsDisplay);
	 enforceSecurityDivAndButtons('resultdiv', isPayabledetailsDisplay);
	 if(isManualEntryDisplay==false){
		$("#casQuickSearch td:nth-child(4)").each(function(){
		 	$(this).find('a').removeAttr('href');
		 });
	 }
	 if(isRemittanceAdviceSummaryDisplay==false){
		$("#casQuickSearch td:nth-child(10)").each(function(){
		 	$(this).find('a').removeAttr('href');  
		 });
	 }
		//shipment security code end
	 //code to check wither manual entry number is entetred or not
	 previouspage = document.URL;
	 var manualEntryCall=previouspage.lastIndexOf('manualEntryPrefix=');
	 if (manualEntryCall>= 0)
		 {
		 searchValue();
		 }
	 formatamount();
	 //D032567: Out of memory on GUI3
	 $(':input[onkeypress]').each( function() { $(this).removeAttr('onkeypress'); });
	 tabSequence('#payableDetailSearchForm',true,true);
});

function onChangeOfRemit()
{
$('#in_check_number').val('ALL');	
$('#in_vin_no_unit_desc').val('ALL');	
$('#shipNo').val('ALL');	
$('#shipSeqNo').val('ALL');	
$('#manualEntryPrefix').val('ALL');	
$('#manualEntryNo').val('ALL');	
$('#in_container_number').val('ALL');	
$('#in_organization_code').val('ALL');	
$('#in_using_orgn_id').val('ALL');
$('#in_arol_id').val('ALL');
}
function onChangeOfCheckNumber()
{
	$('#remitId').val('ALL');
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfVI()
{
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfShipNo()
{
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipSeqNo').val('');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfShipSeq()
{
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfMEPrefix()
{
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeofMEId()
{
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfContainer()
{
	$('#in_container_number').val($('#in_container_number').val().toUpperCase());
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_organization_code').val('ALL');	
	$('#in_using_orgn_id').val('ALL');
	$('#in_arol_id').val('ALL');
}
function onChangeOfOrgn(condition)
{
	
	$('#remitId').val('ALL');
	$('#in_check_number').val('ALL');	
	$('#in_vin_no_unit_desc').val('ALL');	
	$('#shipNo').val('ALL');	
	$('#shipSeqNo').val('ALL');	
	$('#manualEntryPrefix').val('ALL');	
	$('#manualEntryNo').val('ALL');	
	$('#in_container_number').val('ALL');	
	if(condition)
		{
		$('#in_using_orgn_id').val('ALL');
		$('#in_arol_id').val('ALL');
		$('#in_organization_code').val('ALL');
		}
}

function reformatDate(dateStr)
{	
	var sdate = dateStr.split("-");         // ex input "2010-01-18"
	var formattedDate =  sdate[2]+ "-" +sdate[0]+ "-" +sdate[1]; //ex out: "18/01/10"
	
	return formattedDate;
}


//date format functions
function setFormattedDate(fromDate){
	var todaysDate = new Date(fromDate);
	
	var day = todaysDate.getDate();
	if(eval(day<10)){
		day = '0'+day;
	}
	var month = eval(eval(todaysDate.getMonth())+eval(1));
	if(eval(month<10)){
		month = '0'+month;
	}
	var year = todaysDate.getFullYear();
	return month+"-"+day+"-"+year;
}

function searchValue()
{	
    if((($('#remitId').val()== "ALL" ) || ($('#remitId').val() == "all") || ($('#remitId').val() == "All") || ($('#remitId').val().trim() == ""))
			&& (($('#in_check_number').val()== "ALL" ) || ($('#in_check_number').val() == "all") || ($('#in_check_number').val() == "All") || ($('#in_check_number').val().trim() == ""))
			   && (($('#in_vin_no_unit_desc').val()== "ALL" ) || ($('#in_vin_no_unit_desc').val() == "all") || ($('#in_vin_no_unit_desc').val() == "All") || ($('#in_vin_no_unit_desc').val().trim() == ""))
			      && (($('#shipNo').val()== "ALL" ) || ($('#shipNo').val() == "all") || ($('#shipNo').val() == "All") || ($('#shipNo').val().trim() == ""))
	                 && (($('#shipSeqNo').val()== "ALL" ) || ($('#shipSeqNo').val() == "all") || ($('#shipSeqNo').val() == "All") || ($('#shipSeqNo').val().trim() == ""))        
	                    && (($('#manualEntryPrefix').val()== "ALL" ) || ($('#manualEntryPrefix').val() == "all") || ($('#manualEntryPrefix').val() == "All") || ($('#manualEntryPrefix').val().trim() == "")) 
	                       && (($('#in_container_number').val()== "ALL" ) || ($('#in_container_number').val() == "all") || ($('#in_container_number').val() == "All") || ($('#in_container_number').val().trim() == ""))
	                       && (($('#in_organization_code').val()== "ALL" ) || ($('#in_organization_code').val() == "all") || ($('#in_organization_code').val() == "All") || ($('#in_organization_code').val().trim() == ""))
	                       && (($('#manualEntryNo').val()== "ALL" ) || ($('#manualEntryNo').val() == "all") || ($('#manualEntryNo').val() == "All") || ($('#manualEntryNo').val().trim() == ""))
	                       
	) {			
    	setClear();
		$("#remitId").validationEngine('showPrompt', 'No search criteria entered', 'error', true);
		return false;	
	}	
	
	var beginDate;
	var endDate;
	if($('#in_begin_date').val()!=null && $('#in_begin_date').val()!='ALL')
	{
		beginDate = reformatDate($('#in_begin_date').val());		
		$('#in_newbegin_date').val(beginDate);
	}
	else
	{   
		$('#in_newbegin_date').val('');
		$('#in_search_criteria').val("true");
	}
	if($('#in_end_date').val()!=null && $('#in_end_date').val()!='ALL')
	{
		endDate = reformatDate($('#in_end_date').val());		
		$('#in_newend_date').val(endDate);
	}		
	else
	{						
		$('#in_newend_date').val('');
		$('#in_search_criteria').val("true");
	}
	
	//Doing date validation for a good date for begin date
	if($('#in_begin_date').val()!='ALL')
	{
		var valStartDate=$('#in_begin_date').val();
		var re=validateDate(valStartDate);
		if(re=="false"||re==false)
		{
			$('#in_begin_date').validationEngine('showPrompt', 'Begin Date Not Valid', 'error', 'topRight', true);
			return false;
		}
		else if(re=="date_not_in_format"||re==null||re=="null")
		{
			$('#in_begin_date').validationEngine('showPrompt', 'Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
			return false;
		}
	}
	
	//Doing date validation for a good date for end date
	if($('#in_end_date').val()!='ALL')
	{
		var valEndDate=$('#in_end_date').val();
		var re=validateDate(valEndDate);
		if(re=="false"||re==false)
		{
			$('#in_end_date').validationEngine('showPrompt', 'End Date Not Valid', 'error', 'topRight', true);
			return false;
		}
		else if(re=="date_not_in_format"||re==null||re=="null")
		{
			$('#in_end_date').validationEngine('showPrompt', 'Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
			return false;
		}
	}
	
	if($('#in_newbegin_date').val() > $('#in_newend_date').val() )
	{
		$("#in_end_date").validationEngine('showPrompt', 'Begin Date cannot be greater than End Date', 'error', true);
		return false;
	}
	
	//code to validate shipment number and sequence number
	var result=shipmentValidation();
	if(result)
	{
		return false;
	}
	
	var result=manualEntryValidation();
	if(result){
		return false;
	}
	$('#in_fp_remit_advice_id').val($('#remitId').val());
	$('#in_shipment_number').val($('#shipNo').val());
	$('#in_shipment_sequence_no').val($('#shipSeqNo').val());
	$('#in_prefix_code').val($('#manualEntryPrefix').val());
	$('#in_entry_number').val($('#manualEntryNo').val());
	postMethod('search',document.payableDetailSearchForm.method);
	formatamount();
	return true;
	
	  	
}

function shipmentValidation()
{
	var shipmentNumber=$('#shipNo').val();
	var shipmentSequenceNumber=$('#shipSeqNo').val();
	if(shipmentSequenceNumber!='ALL'&&$('#shipSeqNo').val()!='')
		{
		var len=shipmentSequenceNumber.length;
		if(len>=1)
			{
			if(shipmentNumber=='ALL'||shipmentNumber.length<7)
				{
				$("#shipNo").validationEngine('showPrompt', 'Enter Valid Shipment Number', 'error', true);
				$('#shipNo').val('');
				return true;
				}
			}
		}
}

function manualEntryValidation()
{
	var prefixManual=$('#manualEntryPrefix').val();
	var manualId=$('#manualEntryNo').val();
	if(prefixManual!='ALL'&&prefixManual!='')
		{
			var len=prefixManual.length;
			if(len>=1)
				{
				if(manualId=='ALL'||manualId=='')
				{
				$("#manualEntryNo").validationEngine('showPrompt', 'Enter Valid Manual Entry Number', 'error', true);
				return true;
				}
				}
		}
	if(manualId!='ALL'&&manualId!='')
	{
		var len=manualId.length;
		if(len>1)
			{
			if(prefixManual=='ALL'||prefixManual=='')
			{
			$("#manualEntryPrefix").validationEngine('showPrompt', 'Enter Valid Manual Entry Prefix Code', 'error', true);
			return true;
			}
			}
	}
}
//format
function formatamount()
{
	var table = document.getElementById("casQuickSearch");
	if(table!=null){
		
	for (var i = 1, row; row = table.rows[i]; i++) {
		  //check ur condition here
		   for (var j = 0, col; col = row.cells[j]; j++) {
			   //AMOUNT FORMATTING
			   var val = row.cells[6].innerHTML;
			   var formattedVal = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			   row.cells[6].innerHTML=formattedVal;
			   //DATE FORMATTING
			   var dateUnformatted=row.cells[4].innerHTML;
			   if(dateUnformatted!=""||dateUnformatted!=null||dateUnformatted.lenght>0)
			   {
				   var splitDate=dateUnformatted.split("-");
				   if(splitDate[0].length>2)
					   {
					   var formattedDate=splitDate[1]+"-"+splitDate[2]+"-"+splitDate[0];
					   row.cells[4].innerHTML=formattedDate;
					   }
			   }
		   }
		} 
	}
}
function setClear()
{
	 $('#resultdiv').remove();
	 $('#remitId').focus();
	 resetFileds(document.payableDetailSearchForm);
	 $('#remitId').val('');
	 $('#manualEntryPrefix').val('ALL');
	 $('#manualEntryNo').val('ALL');
	 $('#shipNo').val('ALL');
	 $('#shipSeqNo').val('ALL');
	 removeErrorPointers();

	 var now = new Date();
	 now.setDate(now.getDate()-90);	
	 var priorDate = $.datepicker.formatDate('mm-dd-yy',now);
	 $('#in_begin_date').val(setFormattedDate(priorDate));
	 var now1 = new Date();
     var currentDate = $.datepicker.formatDate('mm-dd-yy',now1);
     $('#in_end_date').val(setFormattedDate(currentDate));
}

function vendorPopupSearch() {	
	    var vendor = $('#in_organization_code').val();
	    var orgnId = $('#in_using_orgn_id').val();
	    if(vendor=='ALL'||orgnId=='ALL')
	    	{
	    		vendor="";
	    	}
	    var actionUrl = _context+"/cas//vendorLookup.do?vendor="+vendor+"|orgnId="+orgnId;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'VendorSearch', windowStyle); 
}

//functions to validate date
function validateDate(dateControl) {
		
		var valid = isGoodDate(dateControl);
		if(valid==null||valid=="null")
			{
			return null;
			}
		if (valid) {
			var r=dateControl.split("-");
			var month=r[0];
			var day=r[1];
			var year=r[2];
			
			if(day>31)
				{
				return false;
				}
			if(month>12)
				{
				return false;
				}
			 if (day=="31" && (month=="4" || month =="6" || month=="9" ||
					 				  month=="11" || month=="04" || month=="06" ||
					 				  month=="09")) {
				 							return false;
			 				} 
			 else if (month=="2" || month=="02"){
				    	 
				    	//leap year
						  if(year % 4==0){
							  if(year%100==0&&year%400==0)
								 {
								  	if(day=="30" || day=="31"){
										 
									  return false;
								  }
								  else{
									  return true;
								  }
								 }
							  else
								  {
								  if(day=="30" || day=="31"||day=="29"){
										 
									  return false;
								  }
								  else{
									  return true;
								  }
								  }
							
						  } else{
						         if(day=="29"||day=="30"||day=="31"){
						        	 return false;
							         }
						         else{
							        	 return true;
						         	}
							  }
				     }else
				    	 {
				    	 	return true;
				    	 }
		} 
		else {
			var msg=date_not_in_format;
			return msg;
		}
		
		return valid;
	}
	
	
	
	function isGoodDate(dt){
	    var a = dt.match(/\d{2}-\d{2}-\d{4}/);
	    return a;
	}
	
	//funtion to validate date ends

function orgnSearchUpdateTo(id){	
	var values = id.split("|");	
	var orgnID=values[0];
	var code = values[1].split("-");
	orgnName = code[0];
	orgnCode = code[1];
	carrierCode = values[2];
	if(carrierCode=="null"||carrierCode==null){
		carrierCode="";
	}
	else
		{
		carrierCode="-"+carrierCode;
		}
	var arolId = values[3];
	$('#in_organization_id').val(orgnID);
	$('#in_using_orgn_id').val(orgnID);
	$('#in_organization_code').val(values[1]+carrierCode); 
	$('#in_arol_id').val(arolId);
}

function loadManualEntry(manEntryDesc)
{
	//var transactionType = 'E';
	var manEntryVar = manEntryDesc.split("|");
	var manEntryId = manEntryVar[0];	
	var manEntry = manEntryVar[1].split("-");
	var manEntryPrefix = manEntry[0];
	var manEntryNo = manEntry[1];	
	
	document.location.href = _context
							+ '/fp/manualEntry/getManualEntry?prefix=' + manEntryPrefix + '&manualEntryNo='
							+ manEntryNo +'&flag='+'ME';	
}

function loadRemitAdvice(remitAdvDesc)
{
	var remitAdvVar = remitAdvDesc.split("|");
	var remitAdvId = remitAdvVar[0];
	var checkNo = remitAdvVar[1];
	var checkNoArray = checkNo.split(",");
	
	var index=checkNoArray[0].indexOf("(");
	if(index!=-1)
		{
		checkNo=checkNoArray[0].substring(0,index).trim();
		}else{
			checkNo = checkNoArray[0];
		}
		
	document.location.href = _context + '/fp/remitAdviceSummary/getRemitAdvSummary?fpRemitAdviceId='+remitAdvId
	+ '&apCheckNo='+ checkNo+'&flag='+'RAS';	
}

function ValidateDT(dt,i) {
	if (dt != null && dt != "") {
		//case1
		var date = dt;
		var dateSize = date.length;
		var newDate = date;
		var dt1 ;
		var mon1;
		var year1;
		if(dateSize == 6){
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,6);
			newDate=mon1+"-"+dt1+"-20"+year1;
		} else if(dateSize == 8){
			dt1  = date.substring(2,4); 
			mon1 = date.substring(0,2);
			year1 = date.substring(4,8);
			newDate=mon1+"-"+dt1+"-"+year1;
		}
		var valid = false;	
		if(isValidDate(newDate))
		{
			valid = true;
		}
		if(!valid) {	
			if(i==1){
				$('#in_newbegin_date').val("");
				$("#in_begin_date").validationEngine('showPrompt', 'Date entered is not a valid Date.', 'error', true);
				return false;
			}
			if(i==2){				
				$('#in_newend_date').val("");
				$("#in_end_date").validationEngine('showPrompt', 'Date entered is not a valid Date.', 'error', true);
				return false;
			}
		}else{		
			if(i==1){
				$('#in_newbegin_date').val(newDate);	}
			if(i==2){				
				$('#in_newend_date').val(newDate);	}			
		}
	}	
}

function isValidDate(date) {
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate = false;
    var len1 = date.length;
	if (matches == null) {
		if(date=='ALL'){
			return true;
		}
		if(len1 < '8' && len1>'10') {
			return false;
		}
		if(len1 == '8') {
			var dt1 = date.substring(2,4);
		    var mon1 = date.substring(0,2);
		    var mn = mon1-1;
		    var yr1 = date.substring(4,8);
			var composedDate = new Date(yr1, mn,dt1 );
			validDate = composedDate.getDate() == dt1 && composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
			if(validDate) {
				var newDate = mon1 + "-" + dt1 + "-" + yr1;
				return newDate;
			} else {
				return null;
			}
		}
	} else {
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);

		validDate = composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
		
		if(validDate) {	
			var newDate = matches[1] + "-" + d + "-" + y;
			return newDate;
		} else {
			return null;
		}
	}
}

function removeErrorPointers(){
	$('form[name="payableDetailSearchForm"]').validationEngine('hideAll');
	return true;
}

function setdefaults(){	
	if (($(document).getUrlParam("Mflag")) == 'LPME'){
		$('#in_fp_remit_advice_id').val("");
		$('#in_check_number').val("");
		$('#in_vin_no_unit_desc').val("");
		$('#in_shipment_number').val("");
		$('#in_shipment_sequence_no').val("");
		$('#in_container_number').val("");
		$('#in_organization_code').val("");
		if (($(document).getUrlParam("manualEntryPrefix")) != null) {
			$("#in_prefix_code").val(unescape($(document).getUrlParam("manualEntryPrefix")));
		}
		if (($(document).getUrlParam("manualEntryNo")) != null){
		    $("#in_entry_number").val(unescape($(document).getUrlParam("manualEntryNo")));
		}	
		if (($(document).getUrlParam("manualEntryNo")) != null && ($("#in_entry_number").val()!='ALL'&& $("#in_entry_number").val()!="") ) {
			   if(document.getElementById("displaybase")!=null){
				  document.getElementById("displaybase").style.display="none";
			   }	   
			   var frm = document.forms["payableDetailSearchForm"];
			   frm.method.value="show";
			   postMethod('search',frm.method);
		}
		else
			{
			
			}
	}
	if (($(document).getUrlParam("RASflag")) == 'LPRAS'){		
		$('#in_check_number').val("");
		$('#in_vin_no_unit_desc').val("");
		$('#in_shipment_number').val("");
		$('#in_shipment_sequence_no').val("");
		$("#in_prefix_code").val("");
		$("#in_entry_number").val("");
		$('#in_container_number').val("");
		$('#in_organization_code').val("");
		if (($(document).getUrlParam("fpRemitAdviceId")) != null) {
			$("#in_fp_remit_advice_id").val(unescape($(document).getUrlParam("fpRemitAdviceId")));
		}	
		if (($(document).getUrlParam("fpRemitAdviceId")) != null) {
			   if(document.getElementById("displaybase")!=null){
				  document.getElementById("displaybase").style.display="none";
			   }	   
			   var frm = document.forms["payableDetailSearchForm"];
			   frm.method.value="show";
			   postMethod('search',frm.method);
		}
	}
}
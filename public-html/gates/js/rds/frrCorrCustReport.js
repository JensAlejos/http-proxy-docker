$(function() {
	
	$("#freightCorrectionCustomerReportForm").validationEngine('attach');
	$("#startDate").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#endDate").datepicker({ dateFormat: 'mm-dd-yy' });
	
	$('#organizationName').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4',
		mustMatch:false,
		formatItem: function(data) {
			return data.name;
		},
		formatResult: function(data) {
			return data.name;
		}, 
		select: function(data) {
			$('#organizationName').attr("value",data.name);
			$('#organizationId').attr("value",data.id);
			$('#organizationNameHidden').attr("value",$('#organizationName').attr("value"));
		}
	});
	
	$('#organizationName').gatesPopUpSearch({func:function() {organizationPopupSearch();}});
	
	$('#organizationName').change(function() {
		
		if($("#organizationNameHidden").attr("value") != $("#organizationName").attr("value")) 
		{
			$("#organizationNameHidden").attr("value","");
			$("#organizationName").attr("value","");
		}
		
	});
	
	$('#exit').click(function(){
		window.close();
	});
	
	$('#runJob').click(function(){
		
		var isValid = true;
		var sDate = new Date($("#startDate").val());
		var eDate = new Date($("#endDate").val());
		$("#freightCorrectionCustomerReportForm").validationEngine('hide');
		
		if($.trim($("#startDate").attr("value")) == '') {
			$("#startDate").validationEngine('showPrompt','*This field is required.','error','topRight',true);	
			isValid = false;
		}
		else{
			if(!validateDate('startDate', false)){
				$('#startDate').validationEngine('showPrompt', 'Start Date is incorrect', 'error', 'topRight', true);
				isValid = false;
			}
		}
		
		if($.trim($("#endDate").attr("value")) == '') {
			$("#endDate").validationEngine('showPrompt','*This field is required.','error','topRight',true);	
			isValid = false;
		}
		else{
			if(!validateDate('endDate', false)){
				$('#endDate').validationEngine('showPrompt', 'End Date is incorrect', 'error', 'topRight', true);
				isValid = false;
			}
		}
		
		if($.trim($("#organizationName").attr("value")) == '') {
			$("#organizationName").validationEngine('showPrompt','*This field is required.','error','topRight',true);	
			isValid = false;
		}
		
		if(isValid == false){
			return;
		}
		
		if(sDate > eDate){
			$("#startDate").validationEngine('showPrompt','From Date should be less than Until Date','error','topRight',true);	
			isValid = false;
		}
		
		if(isValid == false){
			return;
		}

		showInfoMessage('msgDiv', 'Running Batch Job ...');
		//var queryString = $('#freightCorrectionCustomerReportForm').formSerialize();
		//window.open(_context+'/rds/frrCorrCustReport/runJob?'+queryString);
		$("#runJob").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context+"/rds/frrCorrCustReport/runJob",
			data : $('#freightCorrectionCustomerReportForm').formSerialize(),
			success : function(responseText) {
				$("#runJob").removeAttr("disabled");
				showSuccessMessage('msgDiv', 'Batch Job run successfully.');
			}
		});

	});
	
});

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
}

function removePopUps() {
	$("#freightCorrectionCustomerReportForm").validationEngine('hide');
}

function organizationPopupSearch() {
	var values=$('#organizationName').val().split("-");
	var param;
	if(values[0]!=null){
		param=values[0];
	}else{
		param=values[1];
	}			
	var actionUrl = _context+'/cas/orgSearchLookup.do?filterValue1='+param+'||QT';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function orgSearchUpdate(id){
	var values = id.split("|");
	var orgName = values[0];
	var orgCode = values[1];
	$('#organizationName').val(orgName+'-'+orgCode);
	$('#organizationId').attr("value",values[2]);
	}

function validateDate(dateId, showPrompt) {
	var date = $('#'+dateId).val();
	var dateSize = date.length;
	var day;
	var month;
	var fullYear;
	var newDate;
	if(dateSize == 6){
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(2,4), 10);
		fullYear = parseInt("20"+date.substring(4,6), 10);
		newDate = date.substring(0,2)+"-"+date.substring(2,4)+"-20"+date.substring(4,6);
	}
	else if(dateSize == 8)
	{
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(2,4), 10);
		fullYear = parseInt(date.substring(4,8), 10);
		newDate = date.substring(0,2)+"-"+date.substring(2,4)+"-"+
			date.substring(4,8);
	}
	else if(dateSize == 10)
	{
		month = parseInt(date.substring(0,2), 10);
		day = parseInt(date.substring(3,5), 10);
		fullYear = parseInt(date.substring(6,10), 10);
		newDate = date.substring(0,2)+"-"+date.substring(3,5)+"-"+
			date.substring(6,10);
	}
	else
	{
		if(showPrompt){
			$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
		}
		return false;
	}
	
	if(isNaN(day) || isNaN(month) || isNaN(fullYear))
	{
		if(showPrompt){
			$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
		}
		return false;
	}
	else
	{
		if(fullYear<1 || fullYear>9999)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else if(month<1 || month>12)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else if(day<1 || day>31)
		{
			if(showPrompt){
				$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
			}
			return false;
		}
		else
		{
			var isLeapYear = false;
			if((fullYear%4)==0)
				isLeapYear = true;
			
			if(month==2 && isLeapYear && day>29)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mmm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if(month==2 && !isLeapYear && day>28)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else if((month==4 || month==6 || month==9 || month==11)	&& day>30)
			{
				if(showPrompt){
					$('#'+dateId).validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
				}
				return false;
			}
			else
			{
				$('#'+dateId).val(newDate);
				return true;
			}
		}
	}
}
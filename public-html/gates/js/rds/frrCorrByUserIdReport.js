$(function() {
	$("#freightCorrectionByUserIdReportForm").validationEngine('attach');
	$("#startDate").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#endDate").datepicker({ dateFormat: 'mm-dd-yy' });
	
	$('#exit').click(function(){
		window.close();
	});
	
	$('#runJob').click(function(){
		var isValid = true;
		var sDate = new Date($("#startDate").val());
		var eDate = new Date($("#endDate").val());
		$("#freightCorrectionByUserIdReportForm").validationEngine('hide');
		
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
		
		if($.trim($("#userId").attr("value")) == '') {
			$("#userId").validationEngine('showPrompt','*This field is required.','error','topRight',true);	
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
		$("#runJob").attr("disabled", "disabled");

		$.ajax({
			type : "POST",
			url : _context+"/rds/frrCorrByUserIdReport/runJob",
			data : $('#freightCorrectionByUserIdReportForm').formSerialize(),
			success : function(responseText) {
				$("#runJob").removeAttr("disabled");
				showSuccessMessage('msgDiv', 'Batch Job run successfully.');
			}
		});

	});
	
});

function removePopUps() {
	$("#freightCorrectionByUserIdReportForm").validationEngine('hide');
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
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
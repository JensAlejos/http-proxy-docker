$(function() {
	
	$("#freightRecapReportForm").validationEngine('attach');
	$('#hd').hide();

	$('#tabSearchBox').hide();
	$("#startDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			validateStartDate();
		}
	});
	$("#endDate").datepicker({
		dateFormat: 'mm-dd-yy',
		onSelect : function(dateText, elem)
		{
			validateEndDate();
		}
	});
	
	$('#exit').click(function(){
		
		//document.location.href = _context+"/welcome.html";
		window.close();
	});
	
	$('#reset').click(function(){
		
		$('#startDate').val('');
		$('#endDate').val('');
		$('#direction').val("*");
		$('#msgSuccess').hide();
		$('#msgInfo').hide();
		$('#msgWarning').hide();
		$('#msgError').hide();
		
		
	});
	
	$('#runReport').click(function(){
		removeErrorPointers();
		if(validateStartDate() & validateEndDate()) {
			
			var urlStr = _context+'/booking/report/freightRecap/runReport';
			$.ajax({
				url: urlStr,
				data: $('#freightRecapReportForm').formSerialize(), 
				success: function(responseText) {
					showResponseMessages('msgDiv', responseText);
				}
			});
		}
	});
	
});

function validateStartDate()
{
	var isValid = true;
	if($('#startDate').val()=="")
	{
		$('#startDate').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
		isValid = false;
	}
	else if(!validateDate('startDate', false))
	{
		isValid = false;
		$('#startDate').validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
	}
	else{
		var startDate = $("#startDate").datepicker("getDate");
		
		/*var fullDate = new Date();
		//convert month to 2 digits 
		var twoDigitMonth = ((fullDate.getMonth()+1) < 10)? '0' + (fullDate.getMonth()+1) : (fullDate.getMonth()+1); 
		var twoDigitDate = ((fullDate.getDate()) < 10)? '0' + (fullDate.getDate()) : (fullDate.getDate());
		// mm-dd-yy
		var currentDate = twoDigitMonth + "-" + twoDigitDate + "-" + fullDate.getFullYear(); 
		var todaysDate = new Date(currentDate);
		
		if(startDate > todaysDate) {
			isValid = false;
			$('#startDate').validationEngine('showPrompt', '* Start Date must be less or equal than to Current Date', 'error', 'topRight', true);
		}
		else
		{*/
			if($('#endDate').val()!="" && validateDate('endDate', false))
			{
				var endDate = $("#endDate").datepicker("getDate");	
				if(/*endDate <= todaysDate && */startDate > endDate)
				{
					isValid = false;
					$('#startDate').validationEngine('showPrompt', '* Start Date must be less than or equal to End Date', 'error', 'topRight', true);
				}
			}
		/*}*/
	}
	return isValid;
}

function validateEndDate() {
	var isValid = true;
	if($('#endDate').val()=="")
	{
		isValid = false;
		$('#endDate').validationEngine('showPrompt', '* This is required', 'error', 'topRight', true);
	}
	else if(!validateDate('endDate', false))
	{
		isValid = false;
		$('#endDate').validationEngine('showPrompt', '* Enter date in Format(mm-dd-yyyy)', 'error', 'topRight', true);
	}
	else{
		var endDate = $("#endDate").datepicker("getDate");	
		/*var fullDate = new Date();
		//convert month to 2 digits 
		var twoDigitMonth = ((fullDate.getMonth()+1) < 10)? '0' + (fullDate.getMonth()+1) : (fullDate.getMonth()+1); 
		var twoDigitDate = ((fullDate.getDate()) < 10)? '0' + (fullDate.getDate()) : (fullDate.getDate());
		// mm-dd-yy
		var currentDate = twoDigitMonth + "-" + twoDigitDate + "-" + fullDate.getFullYear(); 
		var todaysDate = new Date(currentDate);
		
		if(endDate > todaysDate) {
			isValid = false;
			$('#endDate').validationEngine('showPrompt', '* End Date must be less than or equal to Current Date', 'error', 'topRight', true);
		}
		else
		{*/
			if($('#startDate').val()!="" && validateDate('startDate', false))
			{
				var startDate = $("#startDate").datepicker("getDate");	
				if(/*startDate <= todaysDate && */startDate > endDate)
				{
					isValid = false;
					$('#endDate').validationEngine('showPrompt', '* End Date must be greater than or equal to Start Date', 'error', 'topRight', true);
				}
			}
		/*}*/
	}
	return isValid;
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

function removeErrorPointers()
{
	$("#freightRecapReportForm").validationEngine('hideAll');
}

function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				
				messageContent += '<div id="msgError" class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div id="msgWarning" class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div id="msgInfo" class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div id="msgSuccess" class="message_success">' + array[i] + '</div>';
			}
		}
		if(messageContent!='')
		{
			$('#'+msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
  	}
}
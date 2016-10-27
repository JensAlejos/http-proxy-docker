$('#tabSearchBox').hide();
$('#hd').hide();
$(function() {
	$("#startDate").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#startDate").blur(function() {
		ValidateDT($("#startDate").val(),519);
	});
	$("#startDate").click(function() {
		removeErrorPointers();
	});
	
	$("#endDate").datepicker({ dateFormat: 'mm-dd-yy' });
	$("#endDate").blur(function() {
		ValidateDT($("#endDate").val(),5191);
	});
	$("#endDate").click(function() {
		removeErrorPointers();
	});
	$("#runReport").click(function() {
		runReport();
	});
	$("#clearButton").click(function() {
		resetFileds();
	});
	$("#exitButton").click(function() {
		closePopupWindow();
	});        
});

function resetFileds() {
        $("#startDate").attr("autocomplete", "off");
        $("#endDate").attr("autocomplete", "off");
        $('#startDate').val('');
        $('#endDate').val('');
        
        document.getElementById('reportFormat').selectedIndex = 1;
}

function closePopupWindow(){window.close();}

function runReport() {
	var inputData = $('#misRdvChangedReportForm').formSerialize();
	if($("#startDate").val()==''){
		alert("Start date is required ");
	} else if($("#endDate").val()==''){
		alert("End date is required ");
	} else {
		$.ajax({
			type : "POST",
			url : _context+"/tariff/report/tmt08or/runReport",
			data : inputData,
			success : function(responseText) {
				if(responseText.success)
					$('#msgDiv').html('<div class="message_success">Batch Job request submitted successfully</div>');
				else
					$('#msgDiv').html('<div class="message_error">An error occurred while triggerring the Batch Job</div>');
			}
		});
	}
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
			
			if(i==519){
				$("#in_date").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
				$("#in_date").val("");
			}
			if(i==5191){
				$("#in_end_date").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
				$("#in_end_date").val("");
			}
		}else{
			if(i==519){
				$('#in_date').val(newDate);	
			}
			if(i==5191){
				$('#in_end_date').val(newDate);	
			}
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

function getFormattedDate(){
	var todaysDate = new Date();
	
	var day = todaysDate.getDate();
	if(eval(day<10)){
		day = '0'+day;
	}
	var month = eval(eval(todaysDate.getMonth())+eval(1));
	if(eval(month<10)){
		month = '0'+month;
	}
	var year = todaysDate.getFullYear();
	return month + "-"+day+"-"+year;
	//return month+"-"+day+"-"+year;
}

function removeErrorPointers(){
	$('form[name="misRdvChangedReportForm"]').validationEngine('hideAll');
}
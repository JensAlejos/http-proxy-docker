$(document).ready(function () {
	$('#customerPaperRequestbyVVDForm').validationEngine('attach');
	//Defect D029778
	if($("#customsValue").val()=="Y")
		$("#customs").prop('checked',true);
	else
		$("#customs").prop('checked',false);
	if($("#ratedValue").val()=="T")
		$("#rated").prop('checked',true);
	else
		$("#rated").prop('checked',false);
		 
	/*$("#selectedPrinter").attr("disabled",true);*/
	//code to get Printer List on the basis of input parameters
	
	/*function getPrinterList ()
	{
		$("#selectedPrinter").attr("disabled",true);
		if($("#vesselCode").val!=''&&$("#selectedDocType").val!=-1)
		{
			var queryString = $("#customerPaperRequestbyVVDForm").formSerialize();
			$.ajax({
					type : "POST",
					url : _context + "/customerpaperbyVVD/getPrinterList",
					data : 	queryString,
					success : function(responseText) {
						$("#selectedPrinter").attr("disabled",false);
					}
			});
		}
	}*/
	
	//on click of send email button
	
	$('#sendEmail').click(function(){
		
		var count=checkValidPage();
		if($('#emailId').val()==''&& count==0)
		{
		$('#emailId').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
		}
		if(count==0)
		{
		if($("#rated").is(':checked')==false)
			{
				$("#ratedValue").val("F");
			}
			else
			{
				$("#ratedValue").val("T");
			}
			if($("#customs").is(':checked')==false)
			{
				$("#customsValue").val("N");
				//$("#customsChecked").val("false");
			}
			else
			{
				$("#customsValue").val("Y");
				//$("#customsChecked").val("true");
			}
		$('#customerPaperRequestbyVVDForm').attr('method','POST');
		$('#customerPaperRequestbyVVDForm').attr('action','sendEmailCustPaper');
		$('#customerPaperRequestbyVVDForm').submit();
		}
	});
	//for predictive of printer name
	var url = _context+'/cas/autocomplete.do?method=printerNamePsearch&searchType=373';	
	$('#selectedPrinter').gatesAutocomplete({
				 source:url ,
					formatItem: function(data) {
						return  data.name;
					},
					formatResult: function(data) {
						return  data.name;
					}, 
					select: function(data) {
						$('#selectedPrinter').val(data.name);					
						//$('#selectedPrinterID').val(data.id); // gives Printer ID
					}
				});	
	
		//###FOR LOOK UP of Printer:

		$('#selectedPrinter').gatesPopUpSearch({func:function() {printeNamePopupSearch()}});

	//Conditions when getPrinterList is to be called
	$("#vesselCode").change(function(){
		//getPrinterList();
	});
	$("#loadPort").change(function(){
		//getPrinterList();
	});
	$("#dischargePort").change(function(){
		//getPrinterList();
	});
	$("#selectedDocType").change(function(){

		if($('#selectedDocType').selected().val()=="FB")
		{
			if($("#rated").is(':checked')==false)
			{
				$('#rated').attr("checked", true);
				$('#rated').attr("disabled", true);
			}
			else
			{
				$('#rated').attr("disabled", true);
			}
		}
		else
		{
			if($("#rated").is(':checked')==true)
			{
				$('#rated').attr("disabled", false);
				$('#rated').attr("checked", false);
			}
		}
		//getPrinterList();
	});

	$('#Submit').click(function(){
		var count=checkValidPage();
		if($('#selectedPrinter').val()==''&& count==0)
		{
			$('#selectedPrinter').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
			count++;
		}
		if(count==0) {
			if($("#rated").is(':checked')==false)
			{
				$("#ratedValue").val("F");
			}
			else
			{
				$("#ratedValue").val("T");
			}
			if($("#customs").is(':checked')==false)
			{
				$("#customsValue").val("N");
				//$("#customsChecked").val(false);
			}
			else
			{
				$("#customsValue").val("Y");
				//$("#customsChecked").val(true);
			}
			$('#customerPaperRequestbyVVDForm').attr('method','POST');
			$('#customerPaperRequestbyVVDForm').attr('action','sendCustPaper');
			$('#customerPaperRequestbyVVDForm').submit();
		}
	});
	

	$("#vesselCode").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#vesselCode').val().length == 3){
	    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
		    	$('#voyage').focus();
	     }
		});
	$("#voyage").keyup(function(evt) {
		var theEvent = evt || window.event;
	  	var key = theEvent.keyCode || theEvent.which;
	  	if(key == '16' || key == '9' || key == '8' || key == '46')
	  		return;
	     if($('#voyage').val().length == 3){
	    	 $('#voyage').val($('#voyage').val().toUpperCase());
		    	$('#direction').focus();
	     }
	});

$("#direction").keyup(function(evt) {
	if($('#direction').val().length == 1){
    	 $('#direction').val($('#direction').val().toUpperCase());
    	 $('#loadPort').focus();
     }
});
}
);//document ready function ends here


function printeNamePopupSearch() {
	
	var actionUrl = _context+'/cas/printerNamelookup.do?filterValue1='+$('#selectedPrinter').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'PrinterNameSearch', windowStyle);
}

function printerNameSearchUpdate(id)
{
var values = id.split("|");
var printerName = values[0];
var printerId = values[1];	
$('#selectedPrinter').val(printerName);
}

function checkValidPage()
{
	var count=0;
	if($('#vesselCode').val()=='' && count==0)
	{
		$('#vesselCode').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#voyage').val()=='' && count==0)
	{
		$('#voyage').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#direction').val()=='' && count==0)
	{
		$('#direction').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#selectedDocType').selected().val()=='-1' && count==0)
	{
		$('#selectedDocType').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#copies').val()=='' && count==0)
	{
		$('#copies').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#selectedBillStatus').selected().val()=='-1'&&count==0)
	{
		$('#selectedBillStatus').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	if($('#selectedSortOption').selected().val()=='-1'&& count==0)
	{
		$('#selectedSortOption').validationEngine('showPrompt', 'This Field is Mandatory', 'error', 'topRight', true);
		count++;
	}
	return count;
}
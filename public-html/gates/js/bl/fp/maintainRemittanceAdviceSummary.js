


$(document).ready(function() {
	
		
	// attach validation engine with form
			$("#remittanceAdviceSummaryForm").validationEngine('attach');
	 	var status=$("#statusCode").val();
	
	 	var issueDate=$("#issueDate").val();
	 	var issueMedium=$("#issueMethodCode").val(); 
	 	var amount=$("#issueAmount").val();
	 	var amountSpilted=amount.split("$");
	 	$('#ReIssue').attr('disabled',true);	
	 	
	 	var amountIntval=parseInt(amountSpilted[1]);
	 if(status!="")
	 	{
		 $('#PayableDetails').attr('disabled',false);
		 //$('#ReIssue').attr('disabled',false);
	 	}
	 
	 var args = {
				entityType: 'FPRM',
				entityId: $('#fpRemitAdviceId').val(),
				commentId:  'commentId',
				displayCommentTypes: 'MEMO',
				commentTypesForGrid:'MEMO,SYS'
			};
	 var stats="Closed";
	$("#comment_link").comments(args);
	//status to be checked in equal ignore case as some places status value is Closed and some places it is CLOSED
	if(status.toUpperCase()==stats.toUpperCase() && (issueDate!=null && issueDate!='')  &&  (issueMedium!=null && issueMedium!='')&& amountIntval > 0)
 	{
		$('#ReIssue').attr('disabled',false);
 		$('#Fax_Number_check').attr('disabled',false);
 		$('#Email_Override_check').attr('disabled',true);
		$('#Email_Override_check').attr('disabled',false);
		$('#Fax_Number1').attr('disabled',false);
		$('#Fax_Number2').attr('disabled',false);
		$('#Fax_Number3').attr('disabled',false);
		$('#Fax_Number4').attr('disabled',false);
		$('#overrideEmail').attr('disabled',false);
 		
 	}
	 else
	{
		 $('#ReIssue').attr('disabled',true); 
		 $('#ReIssue').attr('disabled',true);
	 		$('#Fax_Number_check').attr('disabled',true);
	 		$('#Email_Override_check').attr('disabled',true);
			$('#Email_Override_check').attr('disabled',true);
			$('#Fax_Number1').attr('disabled',true);
			$('#Fax_Number2').attr('disabled',true);
			$('#Fax_Number3').attr('disabled',true);
			$('#Fax_Number4').attr('disabled',true);
			$('#overrideEmail').attr('disabled',true);
	}
	/*shipment security*/
	enforceSecurityTitle(isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("searchDiv",isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("jqgrid",isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("searchBtnDiv",isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("remittanceAdvideInfoDiv",isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("vendorInformationDiv",isRemittanceAdviceSummaryDisplay);
	enforceSecurityDivAndButtons("ReIssue",isRemittanceAdviceSummaryReissue);
	enforceSecurityDivAndButtons("PayableDetails",isPayableDetailDisplay);
	makeRemitGrid();
	tabSequence('#remittanceAdviceSummaryForm',true,false);
	$('#jqgrid a').addClass('noTab');
	$('#jqgrid input').addClass('noTab');
	$('#jqgrid select').addClass('noTab');
	$('#Fax_Number_check').addClass('noTab');
	$('#Fax_Number1').addClass('noTab');
	$('#Fax_Number2').addClass('noTab');
	$('#Fax_Number3').addClass('noTab');
	$('#Fax_Number4').addClass('noTab');
	$('#Email_Override_check').addClass('noTab');
	$('#overrideEmail').addClass('noTab');

});

function searchRemitAdvice()
{
       var fpRemitAdviceId = document.getElementById('fpRemitAdviceId').value;
	   var apCheckNo = parseInt((document.getElementById('apCheckNo').value),10);
	
	   document.location.href = _context+ '/fp/remitAdviceSummary/remittanceAdviceSummaryForm?fpRemitAdviceId='+fpRemitAdviceId+'&apCheckNo='+apCheckNo;
	   
	   //to sort the grid data on the basis of issue date column
	   $("#PaymentInfoGrid").setGridParam({sortname:'apCheckDate', sortorder: 'desc'}).trigger('reloadGrid');
	   

}

function isNumberKey(evt)
{
   var charCode = (evt.which) ? evt.which : event.keyCode
   if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;

   return true;
}
function paddingZero()
{
	var apCheckNo=document.getElementById('apCheckNo').value;
	  var apCheckNo1 = parseInt((document.getElementById('apCheckNo').value),10);
	  if(apCheckNo1!==""&&apCheckNo1==0 )
		{
		 // alert("inside ap check ");
		  $("#apCheckNo").validationEngine('showPrompt', 'AP Check number must be greater than 0', 'error', true);
		   return false;
		}
	if(apCheckNo!="")
		{	
	while(apCheckNo.length<8)
		{
		apCheckNo = '0' + apCheckNo;
		}
	document.getElementById('apCheckNo').value=apCheckNo;
	if( document.getElementById('fpRemitAdviceId').value!=null)
		{
		document.getElementById('fpRemitAdviceId').value="";
		}
		}
	return apCheckNo;
		}

function clearAPCheckNo()
{
	var remitAdvice=document.getElementById('fpRemitAdviceId').value;
	if(remitAdvice!="")
		{
		document.getElementById('apCheckNo').value="";
		}
	return;
}
function clearRemitAdvice()
{
	
	document.location.href = _context+ '/fp/remitAdviceSummary/clearRemitAdvSummary';

	return;
}

function payableDetails()
{
	  var fpRemitAdviceId = document.getElementById('fpRemitAdviceId').value;         
      var str=window.location.search; 
      if(str!=null && str!=""){ 
              var str=str.split('&'); 
              var newStr=str[2].split('=');                         
              if(newStr[1]=="RAS") 
              {                         
                      document.location.href = _context + '/cas/payableDetailSearch.do'; 
              } 
              else{                 
                      document.location.href = _context + '/cas/payableDetailSearch.do?fpRemitAdviceId='+fpRemitAdviceId 
                      +'&RASflag='+'LPRAS'; 
              } 
      }         
}


function reIssueRemitAdvice()
{	
	
	$("#remittanceAdviceSummaryForm").validationEngine('attach');
			
	/*var countryCode=$("#Fax_Number1").val();
	var areaCode=$("#Fax_Number2").val();
	var extentionCode=$("#Fax_Number3").val();
	var stationCode=$("#Fax_Number4").val();
	alert(areaCode);
	countryCode=countryCode+replace(/^\s+|\s+$/g,'');
	areaCode=areaCode+replace(/^\s+|\s+$/g,'');
	extentionCode=extentionCode+replace(/^\s+|\s+$/g,'');
	stationCode=stationCode+replace(/^\s+|\s+$/g,'');
	alert(areaCode);*/
	if($("#Fax_Number_check").is(':checked'))
	{
	 if($("#Fax_Number2").val()=="")
	{
		$('#Fax_Number2').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		return false;
		}
	else if($("#Fax_Number3").val()=="")
	{
		$('#Fax_Number3').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		return false;
		}
	else if($("#Fax_Number4").val()=="")
	{
		$('#Fax_Number4').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
		return false;
		}
		
	
	
	
		if($("#Fax_Number1").val()=="" || $("#Fax_Number1").val()=="1")
			{
			//alert("US country code");
			if($("#Fax_Number2").val()!="" && ($("#Fax_Number2").val().length<3||$("#Fax_Number2").val().length>3))
				{
				$("#Fax_Number2").validationEngine('showPrompt', 'Area code should be of 3 digits', 'error', true);
				
				return;
				}
			if($("#Fax_Number3").val()!="" &&($("#Fax_Number3").val().length<3||$("#Fax_Number3").val().length>3))
				{
				$("#Fax_Number3").validationEngine('showPrompt', 'Exchange Code should be of 3 digits', 'error', true);
				
				return false;
				}
			if($("#Fax_Number4").val()!="" &&($("#Fax_Number4").val().length<4||$("#Fax_Number4").val().length>4))
				{
				$("#Fax_Number4").validationEngine('showPrompt', 'Station Code should be of 4 digits', 'error', true);
				
				return false;
				}
			}
		if($("#Fax_Number1").val()!="" && $("#Fax_Number1").val()!="1")
			{
			if($("#Fax_Number2").val()!=="" && ($("#Fax_Number2").val().length<2||$("#Fax_Number2").val().length>4))
				{
				$("#Fax_Number2").validationEngine('showPrompt', 'Area code should be of 2, 3 or 4 digits', 'error', true);
				
				return false;
				}
			if($("#Fax_Number3").val()!=="" &&($("#Fax_Number3").val().length<3||$("#Fax_Number3").val().length>4))
			{
				$("#Fax_Number3").validationEngine('showPrompt', 'Exchange Code should be of 3 or 4digits', 'error', true);
				
			return false;
			}
			if($("#Fax_Number4").val()!=="" &&($("#Fax_Number4").val().length<4||$("#Fax_Number4").val().length>4))
			{
				$("#Fax_Number4").validationEngine('showPrompt', 'Station Code should be of 4 digits', 'error', true);
			
			return false;
			}
			
			}
	}
	
	
	if($("#Email_Override_check").is(':checked'))
	{
		if($("#overrideEmail").val()=="")
			{
			$('#overrideEmail').validationEngine('showPrompt', 'Email address must be provided', 'error', 'topRight', true);
			//alert("Please enter Override email address");
			return;
			}
		  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		  if(reg.test($("#overrideEmail").val()) == false)
			 {
			  //alert('Invalid Email Address');
			  return;
			 }
	}
	if($("#overrideEmail").val()!="" && !$("#Email_Override_check").is(':checked'))
	{
		$('#Email_Override_check').validationEngine('showPrompt', 'select the Email override option', 'error', 'topRight', true);
		//alert("select the Email override option");
		return;
	}
	if(!$("#Fax_Number_check").is(':checked')&& ($("#Fax_Number1").val()!=""||$("#Fax_Number2").val()!="" ||$("#Fax_Number3").val()!=""||$("#Fax_Number4").val()!=""))
	{
		$('#Fax_Number_check').validationEngine('showPrompt', 'select the FAX override option', 'error', 'topRight', true);
		//alert("Please check override fax checkbox");
		return;
	}
	var ans=confirm("Are you certain you want to Re-Issue Remittance Advice?");
	if(ans==false)
		{
		alert("Remit Advice will not get Re-Issued");
		}
	else{
		if(($("#overrideEmail").val()!="" && $("#overrideEmail").val()!=null)
		||($("#Fax_Number1").val()!="" && $("#Fax_Number1").val()!=null)
		||($("#Fax_Number2").val()!="" && $("#Fax_Number2").val()!=null)
		||($('#contactEmail').text()!="" && $('#contactEmail').text()!=null )
		||($("#areaCode").text()!="" && $("#areaCode").text()!=null )
		||($("#stationCode").text()!="" && $("#stationCode").text()!=null )){
		//var overrideEmail =$("#overrideEmail").val();
			
			/*var queryString = $('#remittanceAdviceSummaryForm').formSerialize();
			window.open(_context+'/fp/remitAdviceSummary/printdocument?'+queryString);*/
			
			var queryString = $('#remittanceAdviceSummaryForm').formSerialize(); 
			blockUI();
			$.ajax({
				async: false,
				type : "POST",
				url : _context+ '/fp/remitAdviceSummary/emaildocument',
				data : queryString,
				success : function(responseText) {
					$.unblockUI();
						showResponseMessages("msgDiv", responseText);
						 var args = {
									entityType: 'FPRM',
									entityId: $('#fpRemitAdviceId').val(),
									commentId:  'commentId',
									displayCommentTypes: 'MEMO',
									commentTypesForGrid:'MEMO,SYS'
								};
						 $("#comment_link").comments(args);
						return;
					
				}			
			});
			
			
		
//		$('#remittanceAdviceSummaryForm').attr('method','post');
//		$('#remittanceAdviceSummaryForm').attr('action','emaildocument');
//		$('#remittanceAdviceSummaryForm').submit();
		}
		else
		{
			var queryString = $('#remittanceAdviceSummaryForm').formSerialize();
			window.open(_context+'/fp/remitAdviceSummary/printdocument?'+queryString);
}		
		}
}

function overrideSingleCheckFax()

{
	
	if($('#Email_Override_check').is(':checked'))
	{
		$("#Fax_Number_check").validationEngine('showPrompt', 'Only one override option can be selected to re-issue the remittance advice.', 'error', 'topRight', true);

	}
	
	if($("#Fax_Number_check").is(':checked'))
		{
		if($("#Email_Override_check").is(':checked')||$("#overrideEmail").val()!="" )
			{
			$("#Email_Override_check").attr('checked',false);
			$("#overrideEmail").val('');
			return;
			}
		}

	}
function overrideSingleCheckEmail()
{
	if($("#Email_Override_check").is(':checked'))
	{
		if($("#Fax_Number_check").is(':checked'))
		{
			$('#Email_Override_check').validationEngine('showPrompt', 'Only one override option can be selected to re-issue the remittance advice.', 'error', 'topRight', true);
	
		}
		
		if($("#Fax_Number_check").is(':checked') ||$("#Fax_Number1").val()!=""||$("#Fax_Number2").val()!="" ||$("#Fax_Number3").val()!=""||$("#Fax_Number4").val()!="")
		{
		$("#Fax_Number_check").attr('checked',false);
		$("#Fax_Number1").val('');
		$("#Fax_Number2").val('');
		$("#Fax_Number3").val('');
		$("#Fax_Number4").val('');
		return;
		}
	}

	}
	//dfdf
function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}

		$('#'+msgDivId).html(messageContent);
		if(messageContent!='')
			window.scrollTo(0, 0);
  	}}





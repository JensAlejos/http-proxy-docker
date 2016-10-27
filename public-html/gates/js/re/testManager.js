$(document).ready(function() {
	// attach validation engine with form
	$("#rateEngineHeaderForm").validationEngine('attach');
	enforceSecurityDivAndButtons("ratingSetSave",_issaveenabled);
	enforceSecurityDivAndButtons("invokeRateEngine",_isinvokerateengine);
});

$(function() {
	$( "#tabs" ).tabs();
	
	var options = {
			success : showResponse, // post-submit callback
			dataType : 'json' 
		};
	
	$("#shipmentDate").datepicker({ dateFormat: 'mm-dd-yy' });
	
	if($("#reHeaderId").val()==null || $("#reHeaderId").val()==""){
		$("#ratingSet").hide();
		$("#ratingSetSave").attr("disabled", true);
		$("#invokeRateEngine").attr("disabled", true);
	}
	
	$("#ratingSetCopy").click(function(){
		
		var sourceRatingSetId = $('#sourceRatingSetId').val();
		
		if(sourceRatingSetId==null || sourceRatingSetId==""){
			alert('Source Rating Set Id should be specified');
		}
		else{
			document.location.href= _context +'/rateengine/copyRatingSet?sourceRatingSetId='+sourceRatingSetId;
		} 
		
	});
	
	$("#ratingSetSave").click(function(){
		
		$("#rateEngineHeaderForm").ajaxSubmit(options);
	});
	
	$("#cancel").click(function(){
		document.location.href= _context +'/rateengine/viewRateEngineTestManager';
	});
	
	//Dialog			
	$('#rating_options_dialog').dialog({
		autoOpen: false,
		width: 300,
		modal: true
	});
	
	
	$('#cancelRating')
	.click(
		function() {
			$('#rating_options_dialog').dialog('close');
		});
	
	$('#invokeRateEngine').click(function(){
		
		var s = jQuery("#rateChoiceGrid").jqGrid('getGridParam','selarrrow');
		var k = new Array();
		//alert("original"+s[0]);
		var rowIDs = jQuery("#rateChoiceGrid").getDataIDs(); 
        for(var r=0;r<s.length;r=r+1){   
				for (var i=0;i<rowIDs.length;i=i+1){ 
					rowData=jQuery("#rateChoiceGrid").getRowData(rowIDs[i]);
		        	if(s[r] == rowData.gridID){
		        		k[r] = rowData.reRatingChoiceSeqNbr;
		        		// $('#selectedChoiceGridRowId').val(k);
		        		//alert("seqNbr"+rowData.reRatingChoiceSeqNbr);
		        		//alert("changedTo"+s[r]);
		        	}
		        }
	      }
	     // alert("original/changed"+s[0]);
	    $('#selectedChoiceGridRowId').val(k);
		//document.location.href=_context+'/rateengine/invokeRateEngine?selectedId='+s;
		//_context +'/rateengine/invokeRateEngine
		$("#rateEngineHeaderForm").attr("action",'invokeRateEngine');
		$("#rateEngineHeaderForm").submit();
		
	});
	
});
	
function showResponse(responseText, statusText, xhr, $form) {

	if (responseText.messages) {
		var messages = responseText.messages;
		var messageContent = '';

		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}

		$('#msgDiv').html(messageContent);
	}
	
	if (responseText.success)
	{
		//$('#invokeRateEngine').attr("disabled", false);
		$('#invokeRateEngine').removeAttr("disabled");
		$("#gridIdForCommodities").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
		$("#gridIdForEquipments").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
		$("#gridIdForChargesPayable").setGridParam({rowNum:10,datatype:"json" }).trigger("reloadGrid");
		$("#gridIdForSpecialServices").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
		
	}
	else
		$('#invokeRateEngine').attr("disabled", true);

}






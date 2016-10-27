$(document).ready(function() {

	var options = {
		success : showResponse,
		datatype : 'json'
	};

	/*$('#addClause').click(function() { 
		_isQuoteClauseChanged = true;		
		if($("#standard").is(":checked")){
		$("#standardClauseCode").attr("disabled", false);
		}
		
		$("#custom").attr("disabled", false);
		$("#standard").attr("disabled", false);
		var queryString = $('#quoteClauseForm').formSerialize();
		if ($("#quoteClauseForm").validationEngine('validate'))
			//$('#quoteClauseForm').ajaxSubmit(options);
			$.ajax({
				type: "POST",
				url: _context +"/quote/clause/addQuoteClause",
				data: queryString,
				success: function(responseText){
					editAfterSaveClause();
					$("#quoteClauseForm").loadJSON(responseText.data);
					jQuery("#quoteClauseGrid").trigger('reloadGrid');
					showResponse(responseText);
				}
			});
		else
			return false;
	});*/

});

//pre-submit callback 
function showRequest(formData, jqForm, options) { 
	var queryString = $.param(formData);
	return true;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {	
	if (responseText.messages) {
		var messages = responseText.messages;
		var messageContent = '';
		
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
			    if(i==0){
			        messageContent += '<div class="message_error">' + array[i] + '</div>';
			    }else{
			        if(messageContent.indexOf(array[i]) == -1){
			        	messageContent += '<div class="message_error">' + array[i] + '</div>';        
			        }
			    }
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
		$('#msgDiv').html(messageContent);
	}
		$("#standardClauseCode").attr("value", "");		
		validateInstr = false;
		$("#text").attr("value", "");
		$("#id").attr("value", null);
		$("#isEditable").attr("value", false);;
		$("#clauseSource").attr("value", "");
		$("#clauseSourceTypeCode").attr("value", "");
		$('#isInstructionForUpdate').attr("value",false);		
		jQuery("#quoteClauseGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
		
}

$(document).ready(function() {
	
  enforceSecurityDivAndButtons("save", !_readonly);
	
  $('#exit').click(function(){
	  document.location.href =_context+'/';
	  
	});
  
  if(!_readonly)
  {
	  $('#save').click(function(){
		  $('#customerGroupListForm').attr("action","createUpdate");
		  $("#customerGroupListForm").submit();
	  });
  }
}); 

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}


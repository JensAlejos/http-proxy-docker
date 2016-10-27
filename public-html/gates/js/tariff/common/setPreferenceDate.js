$(function() {
	var _prefDate = $('#prefDateSessionVar').val();
	if(_prefDate!='' || _prefDate!=null){
		$('#preferencedate').val(_prefDate);
	}
	else{
		$("#preferencedate").datepicker('setDate', new Date());
	}
});
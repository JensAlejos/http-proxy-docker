$(function() {
	
	if($('#carrierCode').val() == '' ) {
		$('#carrierCode').val('ALL');
	}
	$('#carrierCode').focus(function() {
		if($('#carrierCode').val() == 'ALL') {
			$('#carrierCode').val('');
		}
	});
	$('#carrierCode').blur(function() {
		if($('#carrierCode').val() == '') {
			$('#carrierCode').val('ALL');
		}
	});
	
//	if($('#carrierType').val() == '' ) {
//		$('#carrierType').val('ALL');
//	}
//	$('#carrierType').focus(function() {
//		if($('#carrierType').val() == 'ALL') {
//			$('#carrierType').val('');
//		}
//	});
//	$('#carrierType').blur(function() {
//		if($('#carrierType').val() == '') {
//			$('#carrierType').val('ALL');
//		}
//	});
//	
	if($('#carrierName').val() == '' ) {
		$('#carrierName').val('ALL');
	}
	$('#carrierName').focus(function() {
		if($('#carrierName').val() == 'ALL') {
			$('#carrierName').val('');
		}
	});
	$('#carrierName').blur(function() {
		if($('#carrierName').val() == '') {
			$('#carrierName').val('ALL');
		}
	});
	
	
		$('.displaytagtable tbody tr:not([th]):odd').addClass("odd");
		$('.displaytagtable tbody tr:not([th]):even').addClass("even");
	
		$('#carrierSearch').click(function(){

			$("#carrierLookupForm").attr("action", "searchCarrier");
        	$("#carrierLookupForm").submit();	
	    });
		
		$('#reset').click(function(){
			document.getElementById('carrierCode').value="ALL";
		//	document.getElementById('carrierType').value="ALL";
			document.getElementById('carrierName').value="ALL";
			$("#displaydiv").hide();			

	    });

 });

function setCarrierValue(id,type,name) {	
	
	self.opener.carrierUpdate(id,type,name);
	window.close();         
}

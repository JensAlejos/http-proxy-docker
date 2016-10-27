$.validationEngine.defaults.validationEventTrigger = null;

$(document).ready(function() {
	
	// attach validation engine with form
	$("#manifestForm").validationEngine('attach');
	
	tabSequence('#manifestForm');
	
	if ($("#manifestType").val() == "BRD3AOR"){
		$('#arrivalDate').datepicker();
		$("#vesselCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#vesselCode').val().length == 3){
		    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
			    	$('#voyageNumber').focus();
		     }
			});
		$("#voyageNumber").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#voyageNumber').val().length == 3){
		    	 $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
			    //	$('#direction').focus();
			    	 $('#manifest').focus();
		     }
		});
		$("#action").change(function(){
			if($("#action :selected").val() == "I"){
				$('#arrivalDate').prop('disabled',false);
				$("input:file").prop('disabled', false);
				$("#actionDiv").append("<P style='color:red;'><B>REMINDER: PLEASE DELETE B/L FROM DESCARTE FIRST</B></P>")
			}else{
				$('#arrivalDate').prop('disabled',true);
				$("input:file").prop('disabled', true);
				$("#arrivalDate").val("");
				$("input:file").val("");
				$("P").remove( ":contains('REMINDER: PLEASE DELETE B/L FROM DESCARTE FIRST')" );
			}
		});
	}
	else if (($("#manifestType").val() == "BRD3EOR")
			|| ($("#manifestType").val() == "BRD38OR")) {
		$("#vesselCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#vesselCode').val().length == 3){
		    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
			    	$('#voyageNumber').focus();
		     }
			});
		$("#voyageNumber").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#voyageNumber').val().length == 3){
		    	 $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
			    	$('#direction').focus();
			    	
		     }
		});

	$("#direction").keyup(function(evt) {
		if($('#direction').val().length == 1){
	    	 $('#direction').val($('#direction').val().toUpperCase());
	    	 $('#loadPortCityCode').focus();
	     }
	});
	}
	else if (($("#manifestType").val() == "BRD36OR")) {
		$("#vesselCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#vesselCode').val().length == 3){
		    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
			    	$('#voyageNumber').focus();
		     }
			});
		$("#voyageNumber").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#voyageNumber').val().length == 3){
		    	 $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
			    	$('#direction').focus();
			    	
		     }
		});

	$("#direction").keyup(function(evt) {
		if($('#direction').val().length == 1){
	    	 $('#direction').val($('#direction').val().toUpperCase());
	    	 $('#loadPortCityCode').focus();
	     }
	});
	}
	else  if ($("#manifestType").val() == "BRD39OR") {
		$("#vesselCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#vesselCode').val().length == 3){
		    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
			    	$('#voyageNumber').focus();
		     }
			});
		$("#voyageNumber").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#voyageNumber').val().length == 3){
		    	 $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
			    	$('#direction').focus();
			    	
		     }
		});

	$("#direction").keyup(function(evt) {
		if($('#direction').val().length == 1){
	    	 $('#direction').val($('#direction').val().toUpperCase());
	    	 $('#loadPortCityCode').focus();
	     }
	});
	}
	else if ($("#manifestType").val() == "BRD53OR") {
		$("#vesselCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#vesselCode').val().length == 3){
		    	 $('#vesselCode').val($('#vesselCode').val().toUpperCase());
			    	$('#voyageNumber').focus();
		     }
			});
		$("#voyageNumber").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#voyageNumber').val().length == 3){
		    	 $('#voyageNumber').val($('#voyageNumber').val().toUpperCase());
			    	$('#direction').focus();
			    	
		     }
		});

	$("#direction").keyup(function(evt) {
		if($('#direction').val().length == 1){
	    	 $('#direction').val($('#direction').val().toUpperCase());
	    	 $('#loadPortCityCode').focus();
	     }
	});
	}
});
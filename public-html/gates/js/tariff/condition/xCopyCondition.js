 var somethingChanged = false;
$(document).ready(function () {
	
	tabSequence('#xCopyConditionForm');
	if(_readonlyReplicateCondition){
		$('#mainContent').gatesDisasble();
	}
	 $('input').change(function() { 
	        somethingChanged = true; 
	  }); 
	 
	var _pageMode='Add';
	var xCopyId=$('#xCopiedConditionId').val();
	var tariffConditionId=$('#tariffConditionId').val();
	//var xCopyId=45;
	 $("#xCopyConditionForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
			
		var  oldEffectiveDate = $('#effectiveDate').val();
		var  oldExpirationDate = $('#expirationDate').val();
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;		
		var newDate=$('#effectiveDate').val();
		if(xCopyId==null || xCopyId=='')
		{
			if(_prefDate!=null && _prefDate!=''){
				if(_pageMode=='Add'){
					$("#effectiveDate").datepicker('setDate',_prefDate);
				}
				$("#preferencedate").datepicker('setDate',_prefDate);
			}else{
				if(_pageMode=='Add'){
				$("#effectiveDate").datepicker('setDate', new Date());
				}
				$("#preferencedate").datepicker('setDate',new Date());
			}

		}
		else
		{
			$("#effectiveDate").datepicker('setDate',newDate);
			$('#xCopy').attr("disabled","disabled");
		}


		$('#xCopy').click(function(){
			
			if($("#xCopyConditionForm").validationEngine('validate')){
				$("#xCopyConditionForm").attr("action", "xCopyCondn");
	        	$("#xCopyConditionForm").submit(); 
	    	}else{
	    		return false;
	    	}
	    });

		
		$('#cancelXcopyCondition').click(function(){
			var currentFuture=$('#isCurrentFuture').val();
			 if(currentFuture==true || currentFuture=="true" || currentFuture=="Y"){
				 currentFuture='Y';
			 }
			 else{
				 currentFuture='N';
			 }
			var from = $('#from').val();
			//D029525
			var key = $('#key').val();
			if(somethingChanged){
			 var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true){
			 document.location.href =  _context + '/cas/tariffConditionSearch.do?from='+from+'&currentFuture='+currentFuture+'&key='+key;
			  }
			}
			else{
				 document.location.href =  _context + '/cas/tariffConditionSearch.do?from='+from+'&currentFuture='+currentFuture+'&key='+key;
			}
		});
});

function cancel() {
	
	
	 
}

function removeErrorPointers(){
		   $('#xCopyConditionForm').validationEngine('hideAll');
}



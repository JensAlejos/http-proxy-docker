var somethingChanged = false;
var dataName=null;
$(function() {
	 var _pageMode='Add';
	 var targetTariffGroupId = $("#targetTariffGroupId").val();	
	 var targetTariffGroupId1 = $("#targetTariffGroupId1").val();	
	 var grpId =  document.getElementById('tariffServiceGroupId');
	 $('#groupDetails').attr("disabled","disabled");
	 if((targetTariffGroupId == null)||(targetTariffGroupId == '')){
		  _pageMode='Add';
		  $('#newTariffServiceSourceCode').focus();
	}
	 else {
		 $('#groupDetails').removeAttr("disabled");
		 _pageMode='Edit';
		 $('#expirationDate').focus();
	 }
	
	 if(targetTariffGroupId1!=null && targetTariffGroupId1!=""){
		 $("#targetTariffGroupId").val(targetTariffGroupId1);	
		 $("#newTariffServiceSourceCode").val($("#newTariffServiceSourceCode1").val());	
		 $("#newTariffServiceGroupCode").val($("#newTariffServiceGroupCode1").val());	
		 $("#newTariffServiceSourceCode").attr("disabled","disabled");
		 $("#newTariffServiceGroupCode").attr("disabled","disabled");
		 $("#effectiveDate").val($("#effectiveDate1").val());	
		 $("#expirationDate").val($("#expirationDate1").val());
		 $("#effectiveDate").attr("disabled","disabled");
		 $("#expirationDate").attr("disabled","disabled");
		 $('#groupDetails').removeAttr("disabled");
		
		 _pageMode ="Edit"
	 }
	 
	 if(($('#descri').val()!="" )&& ($('#desc').val()!="null" && $('#descri').val()!=null))
	 {
		 	$('#desc').val($('#descri').val());
	 }
	 if($('#isAll').val()==true || $('#isAll').val()=="true")
	 {
		 	$('#isAll1').attr('checked','checked');
	 }
	 else if($('#isAll').val()==false || $('#isAll').val()=="false")
	 {
	    $('#isAll1').removeAttr('checked');
	 }
	 if($('#editCon').val()==true || $('#editCon').val()=="true")
	 {
	 	$('#checkbox1').attr('checked','checked');
	 }
	 if($('#linkCon').val()==true || $('#linkCon').val()=="true")
	 {
	 	$('#checkbox4').attr('checked','checked');
	 }
	 if($('#checkAll').val()==true || $('#checkAll').val()=="true")
	 {
	 	$('#isAll1').attr('checked','checked');
	 }
	 if($('#currentFuture').val()==true || $('#currentFuture').val()=="true")
	 {
	 	$('#isCurrentFuture').attr('checked','checked');
	 }
	
		 
	 
	 
	 
	 $("#isAll1").click(function() {
		 $('#editCon').val(true);
		 $('#linkCon').val(true);
		 if($('#isAll1').attr('checked')){
			    $('#isAll').val(true);
			    $('#isLinkCondition').val(true);
			    $('#isEditCondition').val(true);
				$('#checkbox1').attr('checked','checked');
				$('#checkbox4').attr('checked','checked');
		 }
		 else{
			    $('#isAll').val(false);
				$('#checkbox1').removeAttr('checked');
				$('#checkbox4').removeAttr('checked');
			}
	 });
	 $("#checkbox1").click(function() {
		 if($('#checkbox1').attr('checked')) {
			 $('#isEditCondition').val(true);
		 }
		 else
		 {
			 $('#isEditCondition').val(false);
		 }
		 if($('#checkbox1').attr('checked') && $('#checkbox4').attr('checked')){
			    $('#isAll').val(true);
			    $('#isAll1').attr('checked','checked');
		 }
		 else{
			    $('#isAll').val(false);
			    $('#isAll1').removeAttr('checked');
			}
	 });
	 
	 $("#checkbox4").click(function() {
		 if($('#checkbox4').attr('checked')) {
			 $('#isLinkCondition').val(true);
		 }
		 else
			 {
			 $('#isLinkCondition').val(false);
			 }
		 if($('#checkbox4').attr('checked') && $('#checkbox1').attr('checked')){
			    $('#isAll').val(true);
			    $('#isAll1').attr('checked','checked');
				
		 }
		 else{
			    $('#isAll').val(false);
			    $('#isAll1').removeAttr('checked');
			}
	 });
	
	
	 
	 
	 $("#replicateTariffGroupForm").validationEngine('attach');
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		
		var err = document.getElementById('errorMsgDiv');	
		var isCurrentFutu=document.getElementById('isCurrentFuture').checked;		
		if(_pageMode=='Add' && err != null)
		{
			document.getElementById('isCurrentFuture').checked=isCurrentFutu;
		}
		else if(_pageMode!='Add')
		{	
			document.getElementById('isCurrentFuture').checked=isCurrentFutu;
		}
		else
		{
			document.getElementById('isCurrentFuture').checked=true;
		}
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= $("#prefDateSessionVar").val();
		var grpEffDate=$("#effectiveDate").val();
	var targetTariffGroupId = $("#targetTariffGroupId").val();		
	if ((targetTariffGroupId == null || targetTariffGroupId == '')){	
			if (_prefDate != null && _prefDate != '') {
				if (_pageMode == 'Add' && err == null) {
					$("#effectiveDate").datepicker('setDate', _prefDate);
				}
				$("#preferencedate").datepicker('setDate', _prefDate);
			} else {
				if (_pageMode == 'Add' && err == null) {
					$("#effectiveDate").datepicker('setDate', new Date());
				}
				$("#preferencedate").datepicker('setDate', new Date());
			}
		if(targetTariffGroupId1!=null && targetTariffGroupId1!="")	{
			$("#effectiveDate").val($("#effectiveDate1").val());	
			$("#expirationDate").val($("#expirationDate1").val());
		}
	} else {
		$("#effectiveDate").datepicker('setDate', grpEffDate);
		$("#preferencedate").datepicker('setDate', _prefDate);
		if(targetTariffGroupId1!=null && targetTariffGroupId1!="")	{
			$("#effectiveDate").val($("#effectiveDate1").val());	
			$("#expirationDate").val($("#expirationDate1").val());
		}
	}

		$('#replicate').click(function(){
			
			if($("#replicateTariffGroupForm").validationEngine('validate')){
				$("#replicateTariffGroupForm").attr("action", "repTariffGroup");
	        	$("#replicateTariffGroupForm").submit(); 
	    	}else{
	    		return false;
	    	}
	    });
		
		 $('#groupDetails').click(function(){
			 var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
			 var targetTariffGroupId = $("#targetTariffGroupId").val();	
				var tariffgrpName=$('#tariffGroupCode').val();
				var tariffsrc=$('#tariffSourceCode').val();
				var isCurrentFutu=document.getElementById('isCurrentFuture').checked;	
				 if($('#isCurrentFuture').attr('checked')) {
					 $('#isCurrentFuture').val(true);
					 isCurrentFutu = true;
				 }
				 else
					 {
					 	$('#isCurrentFuture').val(false);
					 	 isCurrentFutu = false;
					 }
				 var grpId =$('#tariffServiceGroupId').val();
				 var screen=$('#screen').val();
				 var checkAll = $('#isAll').val();
				 var editCon = $('#isEditCondition').val();
				 var linkCon = $('#isLinkCondition').val();
				 var description = $('#desc').val();
				 
				 document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ targetTariffGroupId + '&tariffServgrpType=' + tariffgrpType+"&tariffServSrcCode="+tariffsrc+"&tariffServgrpCode="+tariffgrpName+"&currentFuture="+isCurrentFutu+"&screen1=Replicate&parentGrpId="+grpId+"&screen="+screen+"&checkAll="+checkAll+"&editCon="+editCon+"&linkCon="+linkCon+"&description="+description;
		 });
		 
		$('input').change(function() {
			somethingChanged = true;
		});
		$('checkbox').change(function() {

			somethingChanged = false;
		});
		$('textarea').change(function() {

			somethingChanged = true;
		});
		$('img').click(function() {

			somethingChanged = true;
		});
		$('select').change(function() {

			somethingChanged = true;
		});
		 $('table').click(function() { 

		        somethingChanged = true; 
		   });
		//Disabling of Next Button
		
			$('#itemNxtBtn').attr("disabled","disabled");
			var disableNext=$('#disableNextButton').val();
			if(disableNext=='true'){
				 $('#itemNxtBtn').attr("disabled","disabled");
			 }else{
				 $('#itemNxtBtn').removeAttr("disabled");
			 }
			//end disable
			
			$('#newTariffServiceSourceCode').blur(function() {
				 var tariffGrpName=$("#newTariffServiceSourceCode").val();
				 $("#newTariffServiceGroupCode").val(tariffGrpName);
			});
			
 }); 

//Next Functionality
 function loadNextTariffGroupDetails() {
		var tariffServgrpId = "NEXT";
		var screen='01';
		 if (somethingChanged) {
			 var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true){
				//document.location.href=_context+'/tm/replicateGroup/showForm?grpId='+tariffServgrpId+'&screen='+screen;
				 $('#successMsgDiv').hide();
				 $('#newTariffServiceSourceCode').val('');
				 $('#newTariffServiceGroupCode').val('');
				 $('#description').val('');
				 document.getElementById('isCurrentFuture').checked=true;
				 document.getElementById('isAll').checked=false;
				 document.getElementById('checkbox1').checked=false;
				 document.getElementById('checkbox4').checked=false;
				 $('#targetTariffGroupId').val('');
				 $('#newTariffServiceSourceCode').removeAttr("disabled");
				 $('#newTariffServiceGroupCode').removeAttr("disabled");
				 $('#effectiveDate').removeAttr("disabled");
				 $('#expirationDate').removeAttr("disabled");
				 $('#groupDetails').attr('disabled','disabled');
				 
				 $('#description').removeAttr("disabled");
				 var err = document.getElementById('errorMsgDiv');		
				 var _prefDate= $("#prefDateSessionVar").val();
						if (_prefDate != null && _prefDate != '') {
							if (err == null) {
								$("#effectiveDate").datepicker('setDate', _prefDate);
							}
							$("#preferencedate").datepicker('setDate', _prefDate);
						} else {
							if (_pageMode == 'Add' && err == null) {
								$("#effectiveDate").datepicker('setDate', new Date());
							}
							$("#preferencedate").datepicker('setDate', new Date());
						}
			  }
		 }
		 else{
			 $('#successMsgDiv').hide();
			 $('#newTariffServiceSourceCode').val('');
			 $('#newTariffServiceGroupCode').val('');
			 $('#effectiveDate').val('');
			 $('#expirationDate').val('');
			 $('#description').val('');
			 document.getElementById('isCurrentFuture').checked=true;
			 document.getElementById('isAll1').checked=false;
			 $('#isAll').val(false);
			 $('#isEditCondition').val(false);
			 $('#isLinkCondition').val(false);
			 $('#isCurrentFuture').val(true);
			 $('#isAll1').removeAttr('checked');
			 document.getElementById('checkbox1').checked=false;
			 document.getElementById('checkbox4').checked=false;
			 $('#targetTariffGroupId').val('');
			 $('#newTariffServiceSourceCode').removeAttr("disabled");
			 $('#newTariffServiceGroupCode').removeAttr("disabled");
			 $('#effectiveDate').removeAttr("disabled");
			 $('#expirationDate').removeAttr("disabled");
			 $('#description').removeAttr("disabled");
			 //D024681
			 $('#desc').removeAttr("disabled");
			 $('#groupDetails').attr('disabled','disabled');
			 var err = document.getElementById('errorMsgDiv');	
			 var _prefDate= $("#prefDateSessionVar").val();
				if (_prefDate != null && _prefDate != '') {
					if (err == null) {
						$("#effectiveDate").datepicker('setDate', _prefDate);
					}
					$("#preferencedate").datepicker('setDate', _prefDate);
				} else {
					if (err == null) {
						$("#effectiveDate").datepicker('setDate', new Date());
					}
					$("#preferencedate").datepicker('setDate', new Date());
				}
		 }
	}
 function removeErrorPointers() {
		$('#replicateTariffGroupForm').validationEngine('hideAll');
	}
 
 function cancel() {
	 var screen=$('#screen').val();
	   var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName=$('#tariffGroupCode').val();
		var tariffsrc=$('#tariffSourceCode').val();
		var tariffServiceGroupId=$('#tariffServiceGroupId').val();
	if(screen=='01'){
		 if (somethingChanged) {
			 var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true) {
				 document.location.href = _context + '/cas/tariffServGrpSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc;
			  }
			 }
			 else{
				 document.location.href = _context + '/cas/tariffServGrpSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc;
				 }
		}
	else{
		 if (somethingChanged) {
			 var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true) {
				 document.location.href = _context + '/tariffGroup/showForm?tariffServgrpId='+tariffServiceGroupId+'&tariffServgrpType='+tariffgrpType+'&tariffServSrcCode='+tariffsrc+'&tariffServgrpCode='+tariffgrpName;
			  }
			 }
			 else {
				 document.location.href = _context + '/tariffGroup/showForm?tariffServgrpId='+tariffServiceGroupId+'&tariffServgrpType='+tariffgrpType+'&tariffServSrcCode='+tariffsrc+'&tariffServgrpCode='+tariffgrpName;
				 }
		}
	}
 function populateGrpName(){
	 var tariffGrpName=$("#newTariffServiceSourceCode").val();
	 $("#newTariffServiceGroupCode").val(tariffGrpName);
 }
 var enableShortCuts = function() {
	   shortcut.add("Alt+C",function() {
			cancel();
		});
	   shortcut.add("Ctrl+S",function() {
		   $('#replicate').click();
		});
 }
 enableShortCuts();

var somethingChanged =false;
var isDateChanged =false;
var isInputChange="";
$(function() {
	var _pageMode='Add';
	
	if(_readonlyGroupModify){
		$('#tariffGrpModify').gatesDisable();
	}
	 $('input').change(function(){ 
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	   }); 
	
	 $('textarea').change(function() { 
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	   }); 
/*	 $('img').click(function() { 
		 isInputChange=true;
	        somethingChanged = true; 
	   }); */
	 $('select').change(function() { 
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else{
				 if((isInputChange==true || isInputChange=="true")){
					 if(somethingChanged==true || somethingChanged=='true'){
							somethingChanged=true;
						}
						else{
							somethingChanged=false;
						}
				 }
				 else{
					 somethingChanged = true; 
				 }
		    }
	   });
	 
		var args = {
				entityType: 'TRSV',
				entityId: $("#tariffServiceGroupId").val(),
				commentId: "commentId",
			};
		$("#comment_link").comments(args);
		
		//History popup	
		var historyArgs = {
				entityId: $('#tariffServiceGroupId').val(),
				entity: 'com.matson.gates.tm.group.domain.TariffServiceGroup'
			};
		$("#history_link").history(historyArgs);

	var grpId =  document.getElementById('tariffServiceGroupId');
	$('#groupItemBtn').attr("disabled","disabled");
	
	
	 if((grpId.value == null)||(grpId.value == '')){
		 _pageMode='Add'
	var grpTyp =  document.getElementById('tariffServiceGroupTypeCodeHidden');
	if (grpTyp.value == '01') {
		document.getElementById('group_type_Drop_down').selectedIndex = '00';		
	}
	if (grpTyp.value == '02') {
		document.getElementById('group_type_Drop_down').selectedIndex = '01';
	}
	if (grpTyp.value == '03') {		
		document.getElementById('group_type_Drop_down').selectedIndex = '02';
	}
	if (grpTyp.value == '04') {
		document.getElementById('group_type_Drop_down').selectedIndex = '03';
	}
	if (grpTyp.value == '05') {
		document.getElementById('group_type_Drop_down').selectedIndex = '04';
	}
	if (grpTyp.value == '06') {
		document.getElementById('group_type_Drop_down').selectedIndex = '05';
	}
	if (grpTyp.value == '07') {
		document.getElementById('group_type_Drop_down').selectedIndex = '06';
		}
	}
 else
	 {
	 $('#groupItemBtn').removeAttr("disabled");
	 _pageMode='Edit';
	 }
	 $("#tariffGrpForm").validationEngine('attach');
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;	
		var err = document.getElementById('errorMsgDiv');
		if(_prefDate!=null && _prefDate!=''){
			if(_pageMode=='Add' && err == null){
				$("#effectiveDate").datepicker('setDate',_prefDate);
			}
			$("#preferencedate").datepicker('setDate',_prefDate);
		}else{
			if(_pageMode=='Add' && err == null){
			$("#effectiveDate").datepicker('setDate', new Date());
			}
			$("#preferencedate").datepicker('setDate',new Date());
		}
	
		
		$('#group_type_Drop_down').change(function(){			
			var tariffServgrpId="DUMMY";
			var grpTypDrpDown=document.getElementById('group_type_Drop_down').value;
			var tariffServSrcCode="";
			var tariffServgrpCode="";
			document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + grpTypDrpDown+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
	    });
	$('#effectiveDate').change(function() {
		isDateChanged=true;
	});
	$('#expirationDate').change(function() {
		isDateChanged=true;
	});
	$('#grpSave').click(function(){
		if($("#tariffGrpForm").validationEngine('validate')){
			if($("#tariffServiceGroupId" ).val()==""){//Add request
				 $("#tariffGrpForm").attr("action", "createOrUpdateTariffGroup");
		         $("#tariffGrpForm").submit(); 
			}else{
				if(somethingChanged==false){
					alert("No fields have changed. Cannot update");
				}
				else{	
					blockUI();
					if(isDateChanged){
						$.ajax({
							   type: "POST",
							   url: _context +"/tariffGroup/validateGrpUpdateReqForDepEntities?", 
							   data: "grpPK="+ $("#tariffServiceGroupId" ).val() +"&effDate="+$("#effectiveDate" ).val()+"&expDate="+$("#expirationDate" ).val(),
							   success: function(msg){
								   	if(msg=="Success"){
								   		$("#tariffGrpForm").attr("action", "createOrUpdateTariffGroup");
										$("#tariffGrpForm").submit();
									}else if(msg=="Error"){
										 alert("Error Occured in Validation. Please try again.");
										 $.unblockUI();
										 return;
									}else{
											var r = confirm(msg+". Do you want to continue?");
											if (r == true) {
												$("#tariffGrpForm").attr("action", "createOrUpdateTariffGroup");
												$("#tariffGrpForm").submit();
											}else{
												$.unblockUI();
											   return;
											}
										}
									}
							   });
						 	}
						else{
							$("#tariffGrpForm").attr("action", "createOrUpdateTariffGroup");
							$("#tariffGrpForm").submit();
						}
					}
				}
	    	}else{
	    		return false;
	    	}
	    });
	 
	$('#newButton').click(function(){
			var grpTyp =  $('#tariffServiceGroupTypeCodeHidden1').val();
			var tariffServgrpId = "DUMMY";
			var tariffServSrcCode="";
			var tariffServgrpCode="";
			document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + grpTyp+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
			//document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + grpTyp;
    });
	
		//disable newButton
		var disableNewButton=$('#disableNewButton').val();
		
		$('#newButton').attr("disabled","disabled");
		if((grpId.value!= null)&&(grpId.value!= '') && disableNewButton!='true'){
			
			$('#newButton').removeAttr("disabled");
				_pageMode='onAdd';	
		}
		//disable at ADD mode
		if(_pageMode=='Add'){			
			$('#groupCondBtn').attr("disabled","disabled");
			$('#groupReplBtn').attr("disabled","disabled");
			$('#grpNxtBtn').hide();
		}
		else{
			if(_pageMode=='onAdd')
				{
				$('#grpNxtBtn').hide();
				}
			else
				{
				$('#grpNxtBtn').show();
				}
			$('#groupCondBtn').removeAttr("disabled");
			if(!_readonlyGroupModify){
				$('#groupReplBtn').removeAttr("disabled");
			}
		}				
		//end disable
		
		//Disabling of Next Button
		$('#grpNxtBtn').attr("disabled","disabled");
		var disableNext=$('#disableNextButton').val();
		if(disableNext=='true'){
			 $('#grpNxtBtn').attr("disabled","disabled");
			

		 }else{
			 $('#grpNxtBtn').removeAttr("disabled");

		 }
		//end disable

		$('#groupCondBtn').click(function(){	
			var tariffGrpId=$('#tariffServiceGroupId').val();
			var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
			var tariffgrpName=$('#tariffServiceGroupCode').val();
			var tariffsrc=$('#tariffServiceSourceCode').val();
			submiturl=_context +"/cas/tariffConditionSearch.do?";
			var currentFuture=$('#isCurrentFuture').val();
			var key="From";
			if(tariffgrpType!="01"){
				key="To";
			}
			if(currentFuture=="true"){
				currentFuture="Y";
			}
			else{
				currentFuture="ALL";
			}
			submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+"ALL"+"&rateDescription="+"ALL&from=_group&tariffGrpId="+tariffGrpId+"&key="+key+"&currentFuture="+currentFuture;
			document.location.href =submiturl+submitdata;		
	    });
		$('#groupItemBtn').click(function(){	
			var tariffGrpId=$('#tariffServiceGroupId').val();
			var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
			var tariffgrpName=$('#tariffServiceGroupCode').val();
			var tariffsrc=$('#tariffServiceSourceCode').val();
			submiturl=_context +"/cas/tariffItemSearch.do?";
			var currentFuture=$('#isCurrentFuture').val();
			if(currentFuture=="true"){
				currentFuture="Y";
			}
			else{
				currentFuture="ALL";
			}
			submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+"ALL"+"&rateDescription="+"ALL&from=group&tariffGrpId="+tariffGrpId+"&currentFuture="+currentFuture;
			document.location.href =submiturl+submitdata;	
	    });
		
		$("input[type=checkbox][name=ucheckalltariffcateg]").click(function() {
			
			var elements = $("input[type=radio][name=tariffServiceCategoryCode]");
			jQuery.each(elements, function(element) {
		    	var checked = $(this).attr('checked');
				if(checked){
					$(this).attr('checked', false);
				}
			});	
			
		});
		
     	 $('#tariffServiceSourceCode').change(function() {
    		 var srcCode=$('#tariffServiceSourceCode').val();
    		 $('#tariffServiceSourceCode').val(trim(srcCode));
    		 if($('#tariffServiceSourceCode').val()!=null && $('#tariffServiceSourceCode').val()!='')
    			 {
    			 	somethingChanged = true;
    			 }
    		 else
    			 {
    			 	somethingChanged = false;
    			 }
    		 
    	 });
     	
    	 $('#tariffServiceGroupCode').change(function() {
    		 var srcCode=$('#tariffServiceGroupCode').val();
    		 $('#tariffServiceGroupCode').val(trim(srcCode));
    		 if($('#tariffServiceGroupCode').val()!=null && $('#tariffServiceGroupCode').val()!='')
    			 {
    			 	somethingChanged = true;
    			 }
    		 else
    			 {
    			 	somethingChanged = false;
    			 }
    		 
    	 });
     	var oldDescription=$('#description').val();
     	$('#description').change(function() {
   		 var description=$('#description').val();
   		$('#description').val(trim(description));
   		var newDescription=trim(description);
   		
   		 if($('#description').val()!=null && $('#description').val()!='' && oldDescription!=newDescription)
   			 {
   			 	somethingChanged = true;
   			 }
   		 else
   			 {
   			 	somethingChanged = false;
   			 }
   		 
   	 });
     	
     	tabSequence('#tariffGrpForm');
	 
 });

 function ValidateRequired(){ 
	 var elements = $("input[type=radio][name=tariffServiceCategoryCode]");
	 var anyOneChecked=false;
		jQuery.each(elements, function(element) {
	    	var checked = $(this).attr('checked');
			if(checked){
				anyOneChecked=true;
			}
		});	
		
		if(!anyOneChecked){
			var grpTyp =  document.getElementById('tariffServiceGroupTypeCodeHidden');
			if((grpTyp.value == '01')||(grpTyp.value == '02')){
				return "Tariff Category is mandatory."; 
			}
		}		
 }
 
 function cancel() {
	 _pageMode = "Edit";
	 var grpId = $('#tariffServiceGroupId').val(); 
	   var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName=$('#tariffServiceGroupCode').val();
		var tariffsrc=$('#tariffServiceSourceCode').val();
		var screen= $('#screen').val(); 
		var screen1= $('#screen1').val();
		var parentGrpId= $('#parentGrpId').val(); 
		var effective=$('#effectiveDate').val(); 
		var expiry=$('#expirationDate').val(); 
		 var checkAll = $('#checkAll').val();
		 var editCon = $('#editCon').val();
		 var linkCon = $('#linkCon').val();
		 var desc = $('#description').val();
		 var currentFuture = $('#currentFuture').val();
		 
		
		
		if(grpId!='DUMMY' && grpId!=null && grpId!='' ){
			 if (somethingChanged) {
				 var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true)
				  {
					 if(screen1=="Replicate"){
						 document.location.href = _context + '/tm/replicateGroup/showForm?grpId='+parentGrpId+'&screen='+screen+'&screen1='+screen1+'&targetTariffGroupId='+grpId+'&newTariffServiceSourceCode='+tariffsrc+'&newTariffServiceGroupCode='+tariffgrpName+'&effective='+effective+'&expiry='+expiry+"&checkAll="+checkAll+"&editCon="+editCon+"&linkCon="+linkCon+"&desc="+desc+"&currentFuture="+currentFuture;
					 }
					 else{
						 document.location.href = _context + '/cas/tariffServGrpSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc+'&screen=&tariffGrpId=';
					 }
				  }
				}
			 else{
				 if(screen1=="Replicate"){
					 document.location.href = _context + '/tm/replicateGroup/showForm?grpId='+parentGrpId+'&screen='+screen+'&screen1='+screen1+'&targetTariffGroupId='+grpId+'&newTariffServiceSourceCode='+tariffsrc+'&newTariffServiceGroupCode='+tariffgrpName+'&effective='+effective+'&expiry='+expiry+"&checkAll="+checkAll+"&editCon="+editCon+"&linkCon="+linkCon+"&desc="+desc+"&currentFuture="+currentFuture;
				 }
				 else{
					 document.location.href = _context + '/cas/tariffServGrpSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc+'&screen=&tariffGrpId=';
				 }
			 	}
/*			 else{
				    document.location.href = _context + '/cas/tariffServGrpSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc+'&screen=&tariffGrpId=';
			 }	*/
			}
		else{
			if (somethingChanged) {
				 var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true)
				  {
					 document.location.href = _context + '/cas/tariffServGrpSearch.do';
				  }
			}
			else
			 {
			 document.location.href = _context + '/cas/tariffServGrpSearch.do';
			 }
		}
}

 function removeErrorPointers(){
	   $('#tariffGrpForm').validationEngine('hideAll');
}
 
 function changeToUpperCase(){	 
	 $('#tariffServiceSourceCode').val($(this).val().toUpperCase());
}

 //Next Functionality
 function loadNextTariffGroupDetails() {
		var tariffServgrpId = "NEXT";
		var tariffServgrpType = document.getElementById('tariffServiceGroupTypeCodeHidden').value;
		var tariffServSrcCode=$('#in_source_code').val();
		var tariffServgrpCode=$('#in_group_code').val();
		if (somethingChanged) {
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
				document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='
						+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
		  }
		}
		else
		{
			document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='
					+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
		}
	
}
 
function reloadGroupPage() {
		var tariffServgrpId = "DUMMY";
		var tariffServgrpType = "DUMMY";
		//var tariffServgrpType = $('#in_group_type_code').val();
		var tariffServSrcCode=$('#in_source_code').val();
		var tariffServgrpCode=$('#in_group_code').val();
		document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType+"&tariffServSrcCode="+tariffServSrcCode+"&tariffServgrpCode="+tariffServgrpCode;
		//document.location.href = _context +'/tariffGroup/showForm?tariffServgrpId='+ tariffServgrpId + '&tariffServgrpType=' + tariffServgrpType;
}

function limitText(limitField, limitCount, limitNum) {
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
}

function replicateGroup()
{
	var grpId =$('#tariffServiceGroupId').val();
	var screen='02';
	var tariffServgrpType = document.getElementById('tariffServiceGroupTypeCodeHidden').value;
		
	if(tariffServgrpType =='01')		 
	{ 
		if(grpId==null || grpId=='')
	   	{ 
	   		alert("Please save the Group before Replication");
	   	}
	   	else{
	   		document.location.href=_context+'/tm/replicateGroup/showForm?grpId='+grpId+ '&screen=' + screen;	   		
	   	}		
	}
	else{
		alert("Not a valid Group Type.");
	}
}
function isValidDate(controlName, format){
    var isValid = true;

    try{
        jQuery.datepicker.parseDate(format, jQuery('#' + controlName).val(), null);
    }
    catch(error){
        isValid = false;
    }

    return isValid;
}

function valdateEffDates()
{
	var effDate=isValidDate(effectiveDate, 'mm-dd-yyyy');
	//var expDate=isValidDate(expirationDate, 'mm-dd-yyyy');
	alert(effDate);
	if(effDate!='true')
		{
		alert('Enter valid Dates');
		}
}

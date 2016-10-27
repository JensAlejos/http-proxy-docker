 var somethingChanged = false;
 var isDateChanged =false;
 var isInputChange="";
$(function() {
	
	tabSequence('#generalServiceItemForm');
	  var tariffServiceItemId= $("#tariffServiceItemId").val();
	  var _pageMode='Add';
		if((tariffServiceItemId!= null)&&(tariffServiceItemId!= '')){
		
		_pageMode='Edit';
		}


		 $('input').change(function() {
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
		 $('input[type="radio"]').change(function() {
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
		 $('checkbox').change(function() {
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
		 $('img').click(function() {
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
		 
		 $('#tariffServiceItemCode').change(function() {
			 var portZone=$('#tariffServiceItemCode').val();
			 $('#tariffServiceItemCode').val(trim(portZone));
			 if($('#tariffServiceItemCode').val()!=null && $('#tariffServiceItemCode').val()!='')
				 {
				 	somethingChanged = true;
				 }
			 else
				 {
				 	somethingChanged = false;
				 }
			 
		 });
		 
	$(document).ready(function() {
		var args = {
				entityType: 'TRSI',
				entityId: $("#tariffServiceItemId").val(),
				commentId: "commentId"
			};
		$("#comment_link").comments(args);

		var args1 = {
				entityType: 'TRSV',
				entityId: $("#tariffServiceGroupId").val(),
				commentId: "groupCommentId",
				viewOnly: true,
				commentsFrame: 'grpCommentsFrame'
			};
		$("#grp_comment_link").comments(args1);

    });		
	
	$("#generalServiceItemForm").validationEngine('attach');

	$("#effectiveDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#expirationDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	// Set Pref date & eff date value from Session Var or Current Date.
	var _prefDate= document.getElementById('prefDateSessionVar').value;	
	var tariffServiceItemId = $("#tariffServiceItemId").val();	
	if(_prefDate!=null && _prefDate!=''){
		if(tariffServiceItemId==null || tariffServiceItemId==''){
			$("#effectiveDate").datepicker('setDate',_prefDate);
		}
		$("#preferencedate").datepicker('setDate',_prefDate);
	}else{
		if(tariffServiceItemId==null || tariffServiceItemId==''){
		$("#effectiveDate").datepicker('setDate', new Date());
		}
		$("#preferencedate").datepicker('setDate',new Date());
	}
	$('#effectiveDate').change(function() {
 		isDateChanged=true;
	});
	$('#expirationDate').change(function() {
 		isDateChanged=true;
	});
	
	$('#itemGenServiceSave').click(function() {
		if(_pageMode=="Edit"){
			 if(somethingChanged==true){
					if ($("#generalServiceItemForm").validationEngine('validate')) {
						$.ajax({
							   type: "POST",
							   url: _context +"/tariff/itemFrtWrf/validateItemUpdateReqForDepEntities?", 
							   data: "itemPK="+ tariffServiceItemId +"&effDate="+$("#effectiveDate" ).val()+"&expDate="+$("#expirationDate" ).val(),
							   success: function(msg){
								   	if(msg=="Success"){
										$("#generalServiceItemForm").attr("action", "createOrUpdateGeneralService");
										$("#generalServiceItemForm").submit();
										
									}else if(msg=="Error"){
										 alert("Error Occured in Validation. Please try again.");
										 return;
									}else{
										if(isDateChanged){
											var r = confirm(msg+". Do you want to continue?");
											if (r == true) {
												$("#generalServiceItemForm").attr("action", "createOrUpdateGeneralService");
												$("#generalServiceItemForm").submit();
											}else{
											   return;
											}
										}
										else{
											$("#generalServiceItemForm").attr("action", "createOrUpdateGeneralService");
											$("#generalServiceItemForm").submit();
										}
									}
							   }
						 });

					} else {
						return false;
					}
				}
			 else{
			 	alert("No fields have changed. Cannot update");
			 }}
	 else{
		if ($("#generalServiceItemForm").validationEngine('validate')) {
			$("#generalServiceItemForm").attr("action", "createOrUpdateGeneralService");
			$("#generalServiceItemForm").submit();
		} else {
			return false;
		}
	 }
	});	
	//disable newButton
	var disableNewButton=$('#disableNewButton').val();
	
	$('#itemNewBtn').attr("disabled","disabled");
	if((tariffServiceItemId!= null)&&(tariffServiceItemId!= '') && disableNewButton!='true'){
		
		$('#itemNewBtn').removeAttr("disabled");
			_pageMode='onAdd';	
	}
	//disable at ADD mode
	if(_pageMode=='Add'){			
		$('#itemGenCondBtn').attr("disabled","disabled");
		
		$('#itemNxtBtn').hide();
	}
	else{
		if(_pageMode=='onAdd')
			{
			$('#itemNxtBtn').hide();
			}
		else
			{
			$('#itemNxtBtn').show();
			}
		$('#itemGenCondBtn').removeAttr("disabled");
		
	}				
	//end disable
/*	//disable at ADD mode
	if($('#tariffServiceItemCode').val()==''){			
		$('#itemGenCondBtn').attr("disabled","disabled");			
	}
	else{
		$('#itemGenCondBtn').removeAttr("disabled");
	}	
	//end disable
	*/
	
	$('#itemGenCondBtn').click(function(){			
		var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName=$('#tariffGroupCode').val();
		var tariffsrc=$('#tariffSourceCode').val();
		var tariffItem=$('#tariffServiceItemCode').val(); 
		var currentFuture = $('#isCurrentFuture').val(); 
		var key="From"
		var from = $('#from').val();
		/*	if(tariffgrpType!="01"){
				key="To"
			}*/
		submiturl=_context +"/cas/tariffConditionSearch.do?";
		submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+tariffItem+"&rateDescription=ALL&from=_item&tariffGrpId="+tariffServiceItemId+"&currentFuture="+currentFuture+"&key="+key+"&parentFrom="+from;
		document.location.href =submiturl+submitdata;		
    });
	
	
	//Disabling of Next Button
	$('#itemNxtBtn').attr("disabled","disabled");
	var disableNext=$('#disableNextButton').val();
	if(disableNext=='true'){
		 $('#itemNxtBtn').attr("disabled","disabled");
		

	 }else{
		 $('#itemNxtBtn').removeAttr("disabled");

	 }
	
	var historyArgs = {
			entityId: $('#tariffServiceItemId').val(),
			entity: 'com.matson.gates.tm.item.domain.TariffServiceItem'
		};
	$("#history_link").history(historyArgs);
	
	
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
	
});

function rateItem()
{
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
	var tariffgrpName = $('#tariffGroupCode').val();
	var tariffsrc = $('#tariffSourceCode').val();
	var tariffItem = $('#tariffServiceItemCode').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	var tariffTogrpType = "02"
	submiturl = _context + "/cas/rateDesriptionSearch.do?";
	if(currentFuture=="true" || currentFuture==true  || currentFuture=="Y" || currentFuture=="y"){
		currentFuture='Y';
	}
	else{
		currentFuture='ALL';
	}
	submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture+"&from=_item";
	document.location.href = submiturl + submitdata;

}

//Next button click functionality
//Next Functionality
  function loadNextTariffItemDetails() {
		 var tariffServItemId = "NEXT";
		 var currentFuture = $('#isCurrentFuture').val(); 
		 if(currentFuture=="true" || currentFuture==true  || currentFuture=="Y" || currentFuture=="y"){
				currentFuture=true;
			}
			else{
				currentFuture='ALL';
			}
			if (somethingChanged) {
			var r = confirm("All the unsaved Changes will be discarded!");
			if (r == true) {
				document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+tariffServItemId+'&currentFuture='+currentFuture+'&screen=MEQ&mode=edit';
				}
			}
			else{
				document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+tariffServItemId+'&currentFuture='+currentFuture+'&screen=MEQ&mode=edit';
				}
	 /* var tariffServItemId = "NEXT";
 		
 		 var r=confirm("All the unsaved Changes will be discarded!");
 		 if (r==true)
 		  {
 				 				
 				
 				document.location.href=_context +'/generalServiceItem/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen=MEQ&mode=edit';
 		  }
 		 */
 	
 	}

  function cancel() {
	  var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName=$('#tariffGroupCode').val();
		var tariffsrc=$('#tariffSourceCode').val();
		var tariffItem=$('#tariffServiceItemCode').val(); 
		var from = $('#from').val();
		var currentFuture = $('#isCurrentFuture').val(); 
		 if(currentFuture=="true" || currentFuture==true  || currentFuture=="Y" || currentFuture=="y"){
				currentFuture=true;
			}
			else{
				currentFuture='ALL';
			}
	  if(somethingChanged)
		  {
			var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true)
			  {
				 document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&from='+from+'&currentFuture='+currentFuture;
			  }
		  }
	  else
		  {
		  		document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&from='+from+'&currentFuture='+currentFuture;
		  }

	}
       function removeErrorPointers() {
    		$('#generalServiceItemForm').validationEngine('hideAll');
    	}
       
function newItem(tariffServiceItemId){
	var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
	var tariffServiceItemId = $("#tariffServiceItemId").val();	
	var tariffgrpName=$('#tariffGroupCode').val();
	var tariffsrc=$('#tariffSourceCode').val();
	var from = $('#from').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture=true;
	}
	else{
		currentFuture=false;
	}
	if((tariffServiceItemId == null)||(tariffServiceItemId == '')){
		alert('Please save the record First');
		
	}
	else
		{
		
		if(tariffgrpType=='05')
	 	 {
			 {document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+tariffgrpType+'&grpCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&currentFuture='+currentFuture+'&screen=MEQ&mode=Add&from='+from;}
	 	 }	
	 	 if(tariffgrpType=='06')
	 	 {
	 		{document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+tariffgrpType+'&grpCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&currentFuture='+currentFuture+'&screen=MSH&mode=Add&from='+from;}
	 	 }	
	 	 if(tariffgrpType=='07')
	 	 {
	 		{document.location.href=_context +'/generalServiceItem/showForm?actionPerformed=add&grpTyp='+tariffgrpType+'&grpCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&currentFuture='+currentFuture+'&screen=ACC&mode=Add&from='+from;}
	 	 } 
		}
}
function limitText(limitField, limitCount, limitNum) {
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
}

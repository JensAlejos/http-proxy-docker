var somethingChanged = false;
var isDateChanged =false;
var isInputChange="";
$(function() {
	var _pageMode='Add';
	var tariffServiceItemId = $("#tariffServiceItemId").val();
	var itemName=null;
	var itemType=null;
	if ((tariffServiceItemId != null) && (tariffServiceItemId != '')) {

		_pageMode = 'Edit';
	}
	tabSequence('#revenueDivisionRouteCodeForm');
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
		
		$('#carrierCode').gatesAutocomplete({
			source: _context + '/tariffitemRevDiv/autoComp',

			formatItem: function(item) {

				return item.id+"("+item.name+")";
			},
			formatResult: function(item) {
				return item.id;
			},
			select: function(item) {
				$('#carrierType').text(item.type);
				$('#carrierName').text(item.name);				
				$('#carrierId').val(item.id);
				$('#hiddenCarrierCode').val(item.id);
			}	
			});
		
		
		var oldCarrierVal= $('#carrierCode').val();

		 $('#carrierCode').change(function() { 
			 var carrierCode=$('#carrierCode').val();
			 $('#carrierCode').val(trim(carrierCode));
			 var newCarrierVal= trim(carrierCode);
			 var carID=$('#carrierId').val();
			 
			 if(carID!=newCarrierVal){
				 $('#carrierId').val("");		
		    	}

			 if($('#carrierId').val()==null || $('#carrierId').val()==""){
				 
		        	$("#carrierCode").val(""); 
				 	$('#carrierType').text("");
					$('#carrierName').text("");			
		    }
			else
			{
				$('#carrierId').val("");
			}
			
		 	});
		 
    });		

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
		 var oldCarrierVal= $('#carrierCode').val();
		 $('#carrierCode').blur(function() { 
			 var carrierCode=$('#carrierCode').val();
			 $('#carrierCode').val(trim(carrierCode));
			 var newCarrierVal= trim(carrierCode);

			 if(oldCarrierVal!=newCarrierVal)
				{
					somethingChanged = true; 
				}
				/*else
				 {
				 	somethingChanged = false;
				 }*/
		 });

			 $('#tariffServiceItemCode').change(function() {
				 var portZone=$('#tariffServiceItemCode').val();
				 $('#tariffServiceItemCode').val(trim(portZone));
				 if($('#tariffServiceItemCode').val()!=null && $('#tariffServiceItemCode').val()!='')
					 {
					 	somethingChanged = true;
					 }
				 /*else
					 {
					 	somethingChanged = false;
					 }
				*/
				 
			 });
	$("#revenueDivisionRouteCodeForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
		$( "#expirationDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;	
		var itemEffDate=$('#effectiveDate').val();
		var tariffServiceItemId = $("#tariffServiceItemId").val();		
		if(tariffServiceItemId==null || tariffServiceItemId==''){
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
				$("#effectiveDate").datepicker('setDate',itemEffDate);
			}
		$('#effectiveDate').change(function() {
	 		isDateChanged=true;
		});
		$('#expirationDate').change(function() {
	 		isDateChanged=true;
		});
	$('#itemRevDivSave').click(function() {
		if(_pageMode=="Edit"){
			 if(somethingChanged==true){
					if ($("#revenueDivisionRouteCodeForm").validationEngine('validate')) {
						$.ajax({
							   type: "POST",
							   url: _context +"/tariff/itemFrtWrf/validateItemUpdateReqForDepEntities?", 
							   data: "itemPK="+ tariffServiceItemId +"&effDate="+$("#effectiveDate" ).val()+"&expDate="+$("#expirationDate" ).val(),
							   success: function(msg){
								   	if(msg=="Success"){
										$("#revenueDivisionRouteCodeForm").attr("action", "createOrUpdateRevenueDivision");
										$("#revenueDivisionRouteCodeForm").submit();
										
									}else if(msg=="Error"){
										 alert("Error Occured in Validation. Please try again.");
										 return;
									}else{
										if(isDateChanged){
											var r = confirm(msg+". Do you want to continue?");
											if (r == true) {
												$("#revenueDivisionRouteCodeForm").attr("action", "createOrUpdateRevenueDivision");
												$("#revenueDivisionRouteCodeForm").submit();
											}else{
											   return;
											}
										}
										else{
											$("#revenueDivisionRouteCodeForm").attr("action", "createOrUpdateRevenueDivision");
											$("#revenueDivisionRouteCodeForm").submit();
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
		if ($("#revenueDivisionRouteCodeForm").validationEngine('validate')) {
			$("#revenueDivisionRouteCodeForm").attr("action", "createOrUpdateRevenueDivision");
			$("#revenueDivisionRouteCodeForm").submit();
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
		$('#itemRevDivCondBtn').attr("disabled","disabled");
		
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
		$('#itemRevDivCondBtn').removeAttr("disabled");
		
	}				
	//end disable
	
	//Disabling of Next Button
	$('#itemNxtBtn').attr("disabled","disabled");
	var disableNext=$('#disableNextButton').val();
	if(disableNext=='true'){
		 $('#itemNxtBtn').attr("disabled","disabled");
		

	 }else{
		 $('#itemNxtBtn').removeAttr("disabled");

	 }
	//end disable
	$('#itemRevDivCondBtn').click(function(){			
		var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden1').val();
		var tariffgrpName=$('#tariffGroupCode').val();
		var tariffsrc=$('#tariffSourceCode').val();
		var tariffItem=$('#tariffServiceItemCode').val(); 
		var currentFuture = $('#isCurrentFuture').val(); 
		var key="From"
			var from = $('#from').val();
/*			if(tariffgrpType!="01"){
				key="To"
			}*/
		submiturl=_context +"/cas/tariffConditionSearch.do?";
		submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+tariffgrpName+"&itemCode="+tariffItem+"&rateDescription=ALL&from=_item&tariffGrpId="+tariffServiceItemId+"&currentFuture="+currentFuture+"&key="+key+"&parentFrom="+from;
		document.location.href =submiturl+submitdata;		
    });

	var historyArgs = {
			entityId: $('#tariffServiceItemId').val(),
			entity: 'com.matson.gates.tm.item.domain.TariffServiceItem'
		};
	$("#history_link").history(historyArgs);
	
	$('#carrierCode').gatesPopUpSearch({
		func : function() {
			carrierPopupSearch()
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
});

function rateItem()
{
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden1').val();
	var tariffgrpName = $('#tariffGroupCode').val();
	var tariffsrc = $('#tariffSourceCode').val();
	var tariffItem = $('#tariffServiceItemCode').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	var tariffTogrpType = "02"
	submiturl = _context + "/cas/rateDesriptionSearch.do?";
	var from = $('#from').val();
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture='Y';
	}
	else{
		currentFuture='ALL';
	}
	submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture+"&from=_item";
	document.location.href = submiturl + submitdata;

}



function cancel() {
	var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden1').val();
	var tariffgrpName=$('#tariffGroupCode').val();
	var tariffsrc=$('#tariffSourceCode').val();
	var tariffItem=$('#tariffServiceItemCode').val(); 
	 var from = $('#from').val();
	 var currentFuture = $('#isCurrentFuture').val(); 
		if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
			currentFuture='Y';
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

 function loadNextTariffItemDetails() {

	 var tariffServItemId = "NEXT";
	 var currentFuture = $('#isCurrentFuture').val(); 
		if (somethingChanged) {
		var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {

			document.location.href=_context +'/tariffitemRevDiv/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen=RDV&mode=edit&currentFuture='+currentFuture;
			}
		}
		else
			{
			document.location.href=_context +'/tariffitemRevDiv/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen=RDV&mode=edit&currentFuture='+currentFuture;
			}

 	
 	}
  
function removeErrorPointers() {
	$('#revenueDivisionRouteCodeForm').validationEngine('hideAll');
}

function newItem(tariffServiceItemId){
	var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden1').val();
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
		document.location.href=_context +'/tariffitemRevDiv/showForm?actionPerformed=add&grpTyp='+tariffgrpType+'&grpCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&currentFuture='+currentFuture+'&screen=RDV&mode=Add&from='+from;

}
function limitText(limitField, limitCount, limitNum) {
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
}

function carrierPopupSearch() {
	var actionUrl = _context + "/carrier/lookup/showForm?carrierCode="
			+ $('#carrierCode').val();
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CarrierSearch', windowStyle);
}
function carrierUpdate(id,type,name) {
	
	var carrierVar = id.split("(");
	var carrierID = carrierVar[0];
	var carrierName = carrierVar[1];	
	
	
	var oldCarrierCode=  $('#carrierCode').val();

		 if(oldCarrierCode!=carrierID)
			 {
			 somethingChanged = true; 
			 }
		if(carrierID!=null && carrierID!="")
		{
			$('#itemRevDivSave').removeAttr("disabled");
		}
	       
	$('#hiddenCarrierCode').val(carrierID);
	$('#carrierCode').val(carrierID);
	$('#carrierType').text(type);
	$('#carrierName').text(name);

}

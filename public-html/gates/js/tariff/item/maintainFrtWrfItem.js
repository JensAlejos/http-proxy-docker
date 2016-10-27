$(function() {
	tabSequence('#tariffItemFRTForm');
});
var _pageMode = 'Add';
var somethingChanged = false;
var isDateChanged =false;
var isInputChange="";
$(function() {
	var tariffServiceItemId = $("#tariffServiceItemId").val();
	$('#commodityGrid').trigger("reloadGrid");
	
	if ((tariffServiceItemId != null) && (tariffServiceItemId != '')) {
		_pageMode = 'Edit';
	}		
if(_readonlyItemModify){
		
		$('#frtWrfModifyDiv').gatesDisable();
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
/*	$('img').click(function() {
		somethingChanged = true;
	});*/
//	$('select').change(function() {
//
//		somethingChanged = true;
//	});
	 $('table').click(function() {
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
	 
	var args = {
		entityType : 'TRSI',
		entityId : $("#tariffServiceItemId").val(),
		commentId : "commentId"
	};
	$("#comment_link").comments(args);

	var args1 = {
		entityType : 'TRSV',
		entityId : $("#tariffServiceGroupId").val(),
		commentId : "groupCommentId",
		viewOnly : true,
		commentsFrame : 'grpCommentsFrame'
	};
	$("#grp_comment_link").comments(args1);


	/*var effDate = isValidDate('effectiveDate', 'mm-dd-yyyy');
	var expDate = isValidDate('expirationDate', 'mm-dd-yyyy');*/
	$('#effectiveDate').change(function() {
 		isDateChanged=true;
	});
	$('#expirationDate').change(function() {
 		isDateChanged=true;
	});
	$('#itemFrtWrfSave').click(function() {
		var tariffServiceItemId = $("#tariffServiceItemId").val();
		if (_pageMode == "Edit") {

			if (somethingChanged == true) {

				if ($("#tariffItemFRTForm").validationEngine('validate')) {
					blockUI();
					$.ajax({
						   type: "POST",
						   url: _context +"/tariff/itemFrtWrf/validateItemUpdateReqForDepEntities?", 
						   data: "itemPK="+ tariffServiceItemId +"&effDate="+$("#effectiveDate" ).val()+"&expDate="+$("#expirationDate" ).val(),
						   success: function(msg){
							   	if(msg=="Success"){
									$("#tariffItemFRTForm").attr("action", "saveFrtItem");
									$("#tariffItemFRTForm").submit();
									
								}else if(msg=="Error"){
									 alert("Error Occured in Validation. Please try again.");
									 $.unblockUI();
									 return;
								}else{
									if(isDateChanged){
										var r = confirm(msg+". Do you want to continue?");
										if (r == true) {
											$("#tariffItemFRTForm").attr("action", "saveFrtItem");
											$("#tariffItemFRTForm").submit();
										}else{
											$.unblockUI();
										   return;
										}
									}
									else{
										$("#tariffItemFRTForm").attr("action", "saveFrtItem");
										$("#tariffItemFRTForm").submit();
									}
								}
						   }
					 });

				} else {
					return false;
				}
			
			} else {
				alert("No fields have changed. Cannot update");
			}
		} else {
			if ($("#tariffItemFRTForm").validationEngine('validate')) {
			$("#tariffItemFRTForm").attr("action", "saveFrtItem");
			$("#tariffItemFRTForm").submit();
			}
			 else {
					return false;
				}
		}
	});
	
	var oldCurrentFutureCust=$('#isCurrentFuture').val();
	 $('#isCurrentFuture').change(function() {
		 var newCurrentFuture=document.getElementById('isCurrentFuture').checked;
		  if(oldCurrentFutureCust!=newCurrentFuture) {
		 		$.ajax({
		 			url : _context+'/tariff/itemFrtWrf/onChangeCurrentFutuFlag',
		 			type : "POST",
		 			data : {isCurrentFuture:newCurrentFuture},
		 			success : function(responseText) {
			 				if (responseText.success == true) {
			 					 $('#isCurrentFuture').val(newCurrentFuture);
			 					$('#commodityGrid').trigger("reloadGrid");
			 					return true;
			 				}
		 				}
		 		});
		 }
	 });
	
	$('#loadCommodityDescpage').click(function() {//D023444
		//if(! $(this).attr('disabled')){
		//if($(this).is(':disabled, [readonly]')) {
		//} else {
		var itemId = document.getElementById('tariffServiceItemId').value;
		var isCurrentFuture = document.getElementById('isCurrentFuture').checked;
		var grpId = document.getElementById('tariffServiceGroupId').value;
		var newItem=$('#isNewItem').val();
		//var flag = document.getElementById('isCurrentFuture').disabled;
		//if(flag == false){
		if($("#itemFrtWrfSave").is(':disabled')){ // if its disabled , avoid calling the link
			
		} else {
			document.location.href = _context+ '/tariff/itemCommodityDesc/showForm?actionPerformed=add&currentFuture='+isCurrentFuture+'&itemId='+ itemId+'&grpId='+grpId+'&newItem='+newItem;
		}
		//}
	});

	var grpTyp;
	grpTyp = document.getElementById('group_type');
	if (grpTyp.value == 'WFG') {

		document.getElementById('forWRFOnly').style.display = 'block';

	}
	if (grpTyp.value == 'FRT') {

		document.getElementById('forFrtOnly').style.display = 'block';

	}

	$("#tariffItemFRTForm").validationEngine('attach');

	$("#effectiveDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#expirationDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});

	// Set Pref date & eff date value from Session Var or Current Date.
	var _prefDate = document.getElementById('prefDateSessionVar').value;
	var itemEffDate = $('#effectiveDate').val();	
	var err = document.getElementById('errorMsgDiv');	
	var tariffServiceItemId = $("#tariffServiceItemId").val();
	if (tariffServiceItemId == null || tariffServiceItemId == '') {	
			
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
		
	} else {
		$("#effectiveDate").datepicker('setDate', itemEffDate);
	}
	//disable newButton
	var disableNewButton=$('#disableNewButton').val();
	$('#itemNewBtn').attr("disabled","disabled");
	if(tariffServiceItemId!=null && tariffServiceItemId!="" && disableNewButton!='true'){
		$('#itemNewBtn').removeAttr("disabled");
		_pageMode='onAdd';	
	}
	//disable at ADD mode
	if(_pageMode=='Add'){			
		$('#itemCondBtn').attr("disabled","disabled");
		$('#itemReplBtn').attr("disabled","disabled");
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
		$('#itemCondBtn').removeAttr("disabled");
		$('#itemReplBtn').removeAttr("disabled");
	}				
	//end disable
	
	//Disabling of Next Button
	$('#itemNxtBtn').attr("disabled","disabled");
	var disableNext=$('#disableNextButton').val();
	if(disableNext=='true'){
		 $('#itemNxtBtn').attr("disabled","disabled");
	 }else{
		 $('#itemNxtBtn').show();
		 $('#itemNxtBtn').removeAttr("disabled");
	 }
	//end disable

	$('#itemCondBtn').click(function() {
		var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName = $('#tariffGroupCode').val();
		var tariffsrc = $('#tariffSourceCode').val();
		var tariffItem = $('#tariffServiceItemCode').val();
		var currentFuture = $('#isCurrentFutu').val(); 
		var key="From"
		var from = $('#from').val();
		/*if(tariffgrpType!="01"){
			key="To"
		}*/
		if(currentFuture=="true")
		{
			currentFuture="Y";
		}
		submiturl = _context + "/cas/tariffConditionSearch.do?";
		submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem+"&rateDescription="+"ALL"+"&from=_item&currentFuture="+currentFuture+"&tariffGrpId="+tariffServiceItemId+"&key="+key+"&parentFrom="+from;
		document.location.href = submiturl + submitdata;
	});

	$('#itemFrtWfgCondBtn').click(function() {
		var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName = $('#tariffGroupCode').val();
		var tariffsrc = $('#tariffSourceCode').val();
		var tariffItem = $('#tariffServiceItemCode').val();
		var currentFuture = $('#isCurrentFutu').val(); 
		var tariffTogrpType = "02"
		submiturl = _context + "/cas/wharfageConditionSearch.do?";
		if(currentFuture=="true" || currentFuture==true){
			currentFuture='Y';
		}
		else{
			currentFuture='ALL';
		}
		submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture;
		document.location.href = submiturl + submitdata;
	});


	var historyArgs = {
		entityId : $('#tariffServiceItemId').val(),
		entity : 'com.matson.gates.tm.item.domain.TariffServiceItem'
	};
	$("#history_link").history(historyArgs);
	
	
	 if (_displayonly) {
		 $('#itemReplBtn').attr("disabled","disabled");
	 }	
	if(_pageMode=='Add'){
		document.getElementById('isCurrentFuture').disabled=true;
		}
});


function rateItem()
{
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
	var tariffgrpName = $('#tariffGroupCode').val();
	var tariffsrc = $('#tariffSourceCode').val();
	var tariffItem = $('#tariffServiceItemCode').val();
	var currentFuture = $('#isCurrentFutu').val(); 
	var tariffTogrpType = "02"
	submiturl = _context + "/cas/rateDesriptionSearch.do?";
	if(currentFuture=="true" || currentFuture==true){
		currentFuture='Y';
	}
	else{
		currentFuture='ALL';
	}
	submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture;
	document.location.href = submiturl + submitdata;

}
function validateMAndatory() {
	var SrcTrff;
	var TrffEffDate;
	var SrcTrffName;

	SrcTrffName = document.getElementById('itmNumber');
	SrcTrff = document.getElementById('tariffItemEffDateval');

	if (SrcTrff.value == '' || SrcTrffName.value == '') {

		alert('Please Enter Mandatory Fields  " Tariff Item Number and Effective Date" ');

	}

}
function removeErrorPointers() {
	$('#tariffItemFRTForm').validationEngine('hideAll');
}
function callAddCommodities() {
	document.location.href = 'item_Commodity_desc.html';
}
function cancel() {
	// document.location.href = _context +
	// '/organization/add?actionPerformed=cancel';
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden')
	.val();
   var tariffgrpName = $('#tariffGroupCode').val();
   var tariffsrc = $('#tariffSourceCode').val();
   var tariffItem = $('#tariffServiceItemCode').val();
   var from = $('#from').val();
   var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture='Y';
	}
	else{
		currentFuture='ALL';
	}
   var grpId = document.getElementById('tariffServiceGroupId').value;
	if (somethingChanged) {
		var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {
			document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&tariffGrpId='+grpId+'&from='+from+'&currentFuture='+currentFuture;
		}
	}
	else {
		document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&tariffGrpId='+grpId+'&from='+from+'&currentFuture='+currentFuture;
	}

}
// Next button click functionality
// Next Functionality
function loadNextTariffItemDetails() {
	var tariffServItemId = "NEXT";
	var newitem=$('#isNewItem').val();
	if (somethingChanged) {
	var r = confirm("All the unsaved Changes will be discarded!");
	if (r == true) {
		document.location.href=	_context + '/tariff/itemFrtWrf/edit?actionPerformed=edit&itemId='+tariffServItemId+'&currentFuture=&isNewItem='+newitem+'&screen=FRT&mode=edit';
		}
	}
	else
		{
		document.location.href=	_context + '/tariff/itemFrtWrf/edit?actionPerformed=edit&itemId='+tariffServItemId+'&currentFuture=&isNewItem='+newitem+'&screen=FRT&mode=edit';
		}

}

var enableShortCuts = function() {
	shortcut.add("Alt+C", function() {
		cancel();
	});

	shortcut.add("Ctrl+S", function() {
		$('#itemFrtWrfSave').click();
	});
}
function replicateItem() {
	var screen='02';
	var itemId = document.getElementById('tariffServiceItemId').value;
	var grpTyp = document.getElementById('tariffServiceGroupTypeCodeHidden').value;

	if (itemId == null || itemId == '') {
		alert("Please save the Item before Replication");
	} else {
		document.location.href = _context
				+ '/replicateTariffItem/showForm?actionPerformed=replicate&itemID='
				+ itemId + '&mode=Replicate&screen='+screen;

	}
}
function newItem(tariffServiceItemId) {
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
	var tariffServiceItemId = $("#tariffServiceItemId").val();
	var tariffgrpName = $('#tariffGroupCode').val();
	var tariffsrc = $('#tariffSourceCode').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture=true;
	}
	else{
		currentFuture=false;
	}
	if ((tariffServiceItemId == null) || (tariffServiceItemId == '')) {
		alert('Please save the record First' + tariffServiceItemId);

	} else {
		document.location.href = _context+ '/tariff/itemFrtWrf/showForm?actionPerformed=add&grpid='+ tariffgrpType + '&grpCode=' + tariffgrpName + '&sourceCode='+ tariffsrc + '&screen=FRT&mode=Add&currentFuture='+currentFuture;
	}
}
function limitText(limitField, limitCount, limitNum) {
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
}
function showEditCommodityDialog(id){
	var commodityIdsSel = jQuery("#commodityGrid").getGridParam('selarrrow');
	var commodityDescCmdyIds="";
	var isCurrentFuture = document.getElementById('isCurrentFuture').checked;
	
	if(commodityIdsSel!=null && commodityIdsSel!=""){
		commodityDescCmdyIds=commodityIdsSel;
	}
	else{
		commodityDescCmdyIds=id;
	}
	document.location.href = _context+ '/tariff/itemCommodityDesc/showEditForm?actionPerformed=edit&currentFuture='+isCurrentFuture+'&commodityDescCmdyIds='+commodityDescCmdyIds;
	
}
enableShortCuts();

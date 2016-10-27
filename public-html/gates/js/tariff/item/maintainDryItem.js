var somethingChanged = false;
var isDateChanged =false;
var isInputChange="";
$(function() {
	tabSequence('#tariffItemDRAForm');
	  var tariffServiceItemId= $("#tariffServiceItemId").val();
	  var _pageMode='Add';
		if((tariffServiceItemId!= null)&& (tariffServiceItemId!= '')){
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
	 $('#jqgrid').change(function() {
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
		 var newCarrierVal= $('#carrierCode').val();
		 if(oldCarrierVal!=newCarrierVal) {
			 somethingChanged = true; 
			 }
	   });

	 $('#portZoneNumber').change(function() {
		 var portZone=$('#portZoneNumber').val();
		 $('#portZoneNumber').val(trim(portZone));
		 if($('#portZoneNumber').val()!=null && $('#portZoneNumber').val()!=''){
			 	somethingChanged = true;
			 }
		 else {
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
	$('#effectiveDate').change(function() {
 		isDateChanged=true;
	});
	$('#expirationDate').change(function() {
 		isDateChanged=true;
	});
	$('#DryitemSave').click(function(){
		if(_pageMode=="Edit"){
			 if(somethingChanged==true){
					if ($("#tariffItemDRAForm").validationEngine('validate')) {
						$.ajax({
							   type: "POST",
							   url: _context +"/tariff/itemFrtWrf/validateItemUpdateReqForDepEntities?", 
							   data: "itemPK="+ tariffServiceItemId +"&effDate="+$("#effectiveDate" ).val()+"&expDate="+$("#expirationDate" ).val(),
							   success: function(msg){
								   	if(msg=="Success"){
										$("#tariffItemDRAForm").attr("action", "saveDraItem");
										$("#tariffItemDRAForm").submit();
										
									}else if(msg=="Error"){
										 alert("Error Occured in Validation. Please try again.");
										 return;
									}else{
										if(isDateChanged){
											var r = confirm(msg+". Do you want to continue?");
											if (r == true) {
												$("#tariffItemDRAForm").attr("action", "saveDraItem");
												$("#tariffItemDRAForm").submit();
											}else{
											   return;
											}
										}
										else{
											$("#tariffItemDRAForm").attr("action", "saveDraItem");
											$("#tariffItemDRAForm").submit();
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
		if($("#tariffItemDRAForm").validationEngine('validate')){
		$("#tariffItemDRAForm").attr("action", "saveDraItem");
		$("#tariffItemDRAForm").submit(); 
		}else{
    		return false;
    	}
	 }
    });

     var screenMode;
  	 screenMode = document.getElementById('screen_mode');
  	 $("#tariffItemDRAForm").validationEngine('attach'); 
  
  	$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});
	$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
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
	$('#draItemCondBtn').click(function(){			
		var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
		var tariffgrpName=$('#tariffGroupCode').val();
		var tariffsrc=$('#tariffSourceCode').val();
		var tariffItem=$('#portZoneNumber').val(); 
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
	
	//disable newButton
	var disableNewButton=$('#disableNewButton').val();
	$('#itemNewBtn').attr("disabled","disabled");
	if((tariffServiceItemId!= null)&&(tariffServiceItemId!= '') && disableNewButton!='true'){
		$('#itemNewBtn').removeAttr("disabled");
			_pageMode='onAdd';	
	}
	//disable at ADD mode
	if(_pageMode=='Add'){			
		$('#draItemCondBtn').attr("disabled","disabled");
		$('#itemNxt').hide();
	}
	else{
		if(_pageMode=='onAdd'){
			$('#itemNxt').hide();
			}
		else{
			$('#itemNxt').show();
			}
		$('#draItemCondBtn').removeAttr("disabled");
	}				
	//end disable
	//Disabling of Next Button
	$('#itemNxt').attr("disabled","disabled");
	var disableNext=$('#disableNextButton').val();
	if(disableNext=='true'){
		 $('#itemNxt').attr("disabled","disabled");
	 }else{
		 $('#itemNxt').removeAttr("disabled");
	 }
	
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
		
		 if($('#description').val()!=null && $('#description').val()!='' && oldDescription!=newDescription) {
			 	somethingChanged = true;
			 }
		 else{
			 	somethingChanged = false;
			 }
	 });
});
function rateItem()
{
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
	var tariffgrpName = $('#tariffGroupCode').val();
	var tariffsrc = $('#tariffSourceCode').val();
	var tariffItem = $('#portZoneNumber').val();
	var currentFuture = $('#isCurrentFuture').val(); 
	var tariffTogrpType = "02"
	submiturl = _context + "/cas/rateDesriptionSearch.do?";
	if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
		currentFuture='Y';
	}
	else{
		currentFuture='ALL';
	}
	var from = $('#from').val();
	submitdata = "groupTypeCode=" + tariffgrpType + "&sourceCode="+ tariffsrc + "&groupCode=" + tariffgrpName+ "&itemCode=" + tariffItem + "&groupToTypeCode="+ tariffTogrpType + "&screenName=wharfage&currentFuture="+currentFuture+"&from=_item";
	document.location.href = submiturl + submitdata;

}

function validateMAndatory(){
    var SrcTrff;
   	var TrffEffDate;
   	var SrcTrffName;
   	
   	SrcTrffName = document.getElementById('itmNumber');
   	SrcTrff = document.getElementById('tariffItemEffDateval');
   	if (SrcTrff.value == '' ||  SrcTrffName.value =='') {
   		alert('Please Enter Mandatory Fields  " Tariff Item Number and Effective Date" ');
   		}
   }
    
function cancel() {
	var tariffgrpType=$('#tariffServiceGroupTypeCodeHidden').val();
	var tariffgrpName=$('#tariffGroupCode').val();
	var tariffsrc=$('#tariffSourceCode').val();
	var tariffItem=$('#portZoneNumber').val(); 
	 var from = $('#from').val();
	 var currentFuture = $('#isCurrentFuture').val(); 
		if(currentFuture=="true" || currentFuture==true || currentFuture=="Y" || currentFuture=="y"){
			currentFuture='Y';
		}
		else{
			currentFuture='ALL';
		}
	if(somethingChanged){
	   var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true){
			 document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&from='+from+'&currentFuture='+currentFuture;
		  }
	   }
   else{
	   document.location.href = _context + '/cas/tariffItemSearch.do?groupTypeCode='+tariffgrpType+'&groupCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&itemCode='+tariffItem+'&from='+from+'&currentFuture='+currentFuture;
	   }
}
function callAddCommodities(){
   document.location.href='item_Commodity_desc.html';
}
   
 //Next button click functionality
   //Next Functionality
function loadNextTariffItemDetails() {
	var tariffServItemId = "NEXT";
	var currentFuture = $('#isCurrentFuture').val(); 
	if (somethingChanged) {
	var r = confirm("All the unsaved Changes will be discarded!");
	if (r == true) {
		document.location.href=_context +'/tariff/itemDra/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen1=edit&mode=edit&currentFuture='+currentFuture;
	}
}
else{
	document.location.href=_context +'/tariff/itemDra/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen1=edit&mode=edit&currentFuture='+currentFuture;
	}
}
     
   function removeErrorPointers(){
	   $('#tariffItemDRAForm').validationEngine('hideAll');
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
		document.location.href=_context +'/tariff/itemDra/add?actionPerformed=add&grpid='+tariffgrpType+'&grpCode='+tariffgrpName+'&sourceCode='+tariffsrc+'&currentFuture='+currentFuture+'&screen=DRA&mode=Add&from='+from;
	}
   
   function limitText(limitField, limitCount, limitNum) {
		if (limitField.value.length > limitNum) {
			limitField.value = limitField.value.substring(0, limitNum);
		} else {
			limitCount.value = limitNum - limitField.value.length;
		}
	}
   function carrierPopupSearch() {
		var actionUrl = _context + "/carrier/lookup/showForm?carrierCode="+ $('#carrierCode').val();
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
		$('#hiddenCarrierCode').val(carrierID);
		$('#carrierCode').val(carrierID);
		$('#carrierType').text(type);
		$('#carrierName').text(name);
	}

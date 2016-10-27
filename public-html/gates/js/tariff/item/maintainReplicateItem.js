var somethingChanged = false;
var dataName=null;
var isInputChange="";
$(function() {
	var _pageMode='Add';
	var itemId=document.getElementById('tariffServiceItemId').value;
	if(itemId!=null && itemId!="")
	{
		_pageMode='Edit';
	}
	if(_readonlyItemReplicate){
		$('#mainContent').gatesDisable();
	}
	if(!somethingChanged)
	{
	 $('#replicate').attr("readonly","disabled");
	 if(itemId!=null && itemId!="")
		{
		 $('#replicate').removeAttr('disabled');
		}
	}
    else
	{
	 $('#replicate').removeAttr('disabled');
	}
	 $('#targetGrpName').attr("disabled","disabled");
	 if( $('#tariffServiceGroupTypeCodeHidden').val()!=null && $('#tariffServiceGroupTypeCodeHidden').val()!='' && $('#tariffServiceGroupTypeCodeHidden').val()!='01' && (itemId==null || itemId=="")){
		 $('#targetGrpName').removeAttr('disabled'); 
	 }
	 if($('#tariffServiceGroupTypeCodeHidden').val()=='01'){
		 $('#targetGrpName').val($('#targetGrpTariff').val());
	 }
	$('#targetItemNo').change(function() {
		somethingChanged = true;
		$('#replicate').removeAttr('disabled');
	});
	$('#targetGrpTariff').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
 		 		 		 method: 'searchTariffSource',
 		 		 		 searchType: '11',
 		 		 		 groupType:  function() { return $('#tariffServiceGroupTypeCodeHidden').val(); }
		 		 	 },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 	dataName=data.name;
			 	$('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#targetGrpTariff').val(data.id);	
		 		 $('#grpId').val(data.id);
		 		 if($('#tariffServiceGroupTypeCodeHidden').val()=="01"){
		 			 $('#targetGrpName').val(data.name);
		 		 }
		 		$('#replicate').removeAttr('disabled');
		 }
	});		
	
	 if($('#isAll').val()==true || $('#isAll').val()=="true")
	 {
	 	$('#isAll').attr('checked','checked');
	 }
 else if($('#isAll').val()==false || $('#isAll').val()=="false")
	 {
	    $('#isAll').removeAttr('checked');
	 }
 $("#isAll1").click(function() {
	 if($('#isAll1').attr('checked')){
		 	$('#isAll').val(true);
			$('#checkbox1').attr('checked','checked');
			$('#checkbox2').attr('checked','checked');
			$('#checkbox3').attr('checked','checked');
			$('#checkbox4').attr('checked','checked');
			$('#checkbox5').attr('checked','checked');
			$('#checkbox7').attr('checked','checked');
			if($('#tariffServiceGroupTypeCodeHidden').val()==01){
				$('#checkbox6').attr('checked','checked');
			}
				 $('#checkbox5').removeAttr('disabled');
				 $('#checkbox7').removeAttr('disabled');
	 }
	 else{
		 	$('#isAll').val(false);
			$('#checkbox1').removeAttr('checked');
			$('#checkbox2').removeAttr('checked');
			$('#checkbox3').removeAttr('checked');
			$('#checkbox4').removeAttr('checked');
			$('#checkbox5').removeAttr('checked');
			$('#checkbox6').removeAttr('checked');
			$('#checkbox7').removeAttr('checked');
		}
 });
 $("#checkbox1").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 
 $("#checkbox4").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else		{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 $("#checkbox2").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
			
		}
 });
 $("#checkbox3").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 $("#checkbox5").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 $("#checkbox6").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 $("#checkbox7").click(function() {
	 if($('#checkbox1').attr('checked') && $('#checkbox2').attr('checked') && $('#checkbox3').attr('checked') && $('#checkbox4').attr('checked') && $('#checkbox5').attr('checked') && $('#checkbox6').attr('checked') && $('#checkbox7').attr('checked')){
		    $('#isAll').val(true);
		    $('#isAll1').attr('checked','checked');
	 }
	 else{
		    $('#isAll').val(false);
		    $('#isAll1').removeAttr('checked');
		}
 });
 
	//Blurr the data for invalid group Id
	 $('#targetGrpTariff').change(function(){
		 somethingChanged = true;
		
		 $('#replicate').removeAttr('disabled');
		if($('#grpId').val()==null || $('#grpId').val()==""){
//        	$("#targetGrpTariff").val("ALL"); 
//        	$("#targetGrpName").val("ALL"); 
    	}
		else
		{
			$("#targetGrpTariff").val(dataName); 
	 		 if($('#tariffServiceGroupTypeCodeHidden').val()=="01"){
	 			 $('#targetGrpName').val(dataName);
	 		 }
			$('#grpId').val("");
		}
    }); 

	 $('#targetGrpName').gatesAutocomplete({
		 source:  _context+'/cas/autocomplete.do',
		 extraParams: {
 		 		 		 method: 'searchGroupName',
 		 		 		 searchType: '10',
 		 		 		 groupType:  function () { return $('#tariffServiceGroupTypeCodeHidden').val(); },
 		 		 		 sourceTariff:  function () { return $('#targetGrpTariff').val(); }				 		 		 		 
		 		 		},
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 	dataName=data.name;
			 	$('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#targetGrpName').val(data.id);		
		 		 $('#grpId').val(data.id);
		 		$('#replicate').removeAttr('disabled');
		 }		 
	});	
//Blurr the data for invalid group Id
 $('#targetGrpName').change(function(){
	 somethingChanged = true;
	 $('#replicate').removeAttr('disabled');
		if($('#grpId').val()==null || $('#grpId').val()==""){
        //	$("#targetGrpName").val("ALL"); 
    	}
		else{
			$("#targetGrpName").val(dataName); 
			$('#grpId').val("");
		}
    }); 


	$("#replicateTariffItemForm").validationEngine('attach');
	$("#newEffDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#newExpDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	if($('#tariffServiceGroupTypeCodeHidden').val()==02){
		$('#checkbox6').attr("disabled","disabled");
	}
	deleteAllCookies();
	var _prefDate= $("#prefDateSessionVar").val();
	var itmEffDate=$("#newEffDate").val();
	var err = document.getElementById('errorMsgDiv');	
	if (itemId == null || itemId == '') {	
			if (_prefDate != null && _prefDate != '') {
				if (err == null) {
					$("#newEffDate").datepicker('setDate', _prefDate);
				}
				$("#preferencedate").datepicker('setDate', _prefDate);
			} else {
				if (err == null) {
				//	$("#newEffDate").datepicker('setDate', new Date());
				}
				$("#preferencedate").datepicker('setDate', new Date());
			}
	}
	else{
		$('#replicateItemSave').attr("disabled","disabled");
	}
	$('#replicateItemSave').click(function() {
		if ($("#replicateTariffItemForm").validationEngine('validate')) {
				if($("#targetGrpTariff").val()=="ALL" || $("#targetGrpTariff").val()=="All")
				{
					$('#targetGrpTariff').validationEngine('showPrompt', 'ALL is not valid Source Tariff', 'error', 'topRight', true);
					return false;
				}
				if($("#targetGrpName").val()=="ALL" || $("#targetGrpName").val()=="All")
				{
					$('#targetGrpName').validationEngine('showPrompt', 'ALL is not valid Group Name', 'error', 'topRight', true);
					return false;
				}
				$("#replicateTariffItemForm").attr("action", "repTariffItem");
				$("#replicateTariffItemForm").submit();
				somethingChanged =true;
				
		} else {
				return false;
		}
	});

	// code to bind pop up search
	 $('#targetGrpName').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
	 $('#targetGrpTariff').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	 

		//Disabling of Next Button
		$('#itemNxtBtn').attr("disabled","disabled");
		
		var disableNext=$('#disableNextButton').val();
		if(disableNext=='true'){
			 $('#itemNxtBtn').attr("disabled","disabled");
		 }else{
			 $('#itemNxtBtn').removeAttr("disabled");
		 }
		
		//Item Detail and new Button disable/enable
		//$('#itemNew').attr("disabled","disabled");
		$('#itemDetails').attr("disabled","disabled");
		
		if(itemId==null || itemId=='')
			{
			$('#itemDetails').attr("disabled","disabled");
		//	$('#itemNew').attr("disabled","disabled");
			}
		else
			{
			$('#itemDetails').removeAttr("disabled");
		//	$('#itemNew').removeAttr("disabled");
			}
		$('#itemDetails').click(function() {
			var itemId=document.getElementById('tariffServiceItemId').value;	
				{document.location.href=_context +'/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+itemId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit';}
		});
		//Disabling of Next Button
		$('#itemNxtBtn').attr("disabled","disabled");
		var disableNext=$('#disableNextButton').val();
		if(disableNext=='true'){
			 $('#itemNxtBtn').attr("disabled","disabled");
			

		 }else{
			 $('#itemNxtBtn').removeAttr("disabled");

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

			var oldCurrentFutureCust=$('#isCurrentFuture').val();
			 $('#isCurrentFuture').change(function() {
				 var newCurrentFuture=document.getElementById('isCurrentFuture').checked;
					  if(oldCurrentFuture!=newCurrentFuture)
						 {
							 document.getElementById('isCurrentFuture').checked=newCurrentFuture;
							 $('#isCurrentFuture').val(newCurrentFuture);
						 }
			 });

			/*if(_pageMode=='Add' && err != null && isCurrentFutu!=newCurrentFutu)
			{
				document.getElementById('isCurrentFuture').checked=newCurrentFutu;
			}
			else if(itemId!=null && itemId!="" && isCurrentFutu!=newCurrentFutu)
			{
				document.getElementById('isCurrentFuture').checked=newCurrentFutu;
			}
			else
			{
				document.getElementById('isCurrentFuture').checked=true;
			}*/
/*			$('#checkbox5').attr("disabled","disabled");
			$('#checkbox7').attr("disabled","disabled");
			
			 
			$('#checkbox3').click(function() {
				 if($('#checkbox3').is(':checked')){
					 $('#checkbox5').removeAttr('disabled');
					 $('#checkbox7').removeAttr('disabled');
				 }
				 else{
					 $('#checkbox5').removeAttr('checked');
					 $('#checkbox7').removeAttr('checked');
					 $('#checkbox5').attr("disabled","disabled");
					 $('#checkbox7').attr("disabled","disabled");
				 }
			});*/
});

function callSelectall(){
	//if($('#isAll').attr('checked')){
	$('#isAll').val(true);
	$('#checkbox1').attr('checked','checked');
	$('#checkbox2').attr('checked','checked');
	$('#checkbox3').attr('checked','checked');
	$('#checkbox4').attr('checked','checked');
	$('#checkbox5').attr('checked','checked');
	$('#checkbox7').attr('checked','checked');
	if($('#tariffServiceGroupTypeCodeHidden').val()==01){
		$('#checkbox6').attr('checked','checked');
	}
		 $('#checkbox5').removeAttr('disabled');
		 $('#checkbox7').removeAttr('disabled');
}
function uncheckSelectall(){
	$('#isAll').val(false);
	$('#checkbox1').removeAttr('checked');
	$('#checkbox2').removeAttr('checked');
	$('#checkbox3').removeAttr('checked');
	$('#checkbox4').removeAttr('checked');
	$('#checkbox5').removeAttr('checked');
	$('#checkbox6').removeAttr('checked');
	$('#checkbox7').removeAttr('checked');
}

function disableallfield(){
	$('#groupType').attr('disabled','disabled');
	$('#sourceTariff').attr('disabled','disabled');
	$('#groupName').attr('disabled','disabled');
	$('#itemNo').attr('disabled','disabled');
	$('#itemEffdate').attr('disabled','disabled');
	$('#itemExpdate').attr('disabled','disabled');
	$('#checkbox1').attr('checked','checked');
	$('#checkbox2').attr('checked','checked');
	$('#checkbox3').attr('checked','checked');
	$('#checkbox4').attr('checked','checked');
	$('#checkbox5').attr('checked','checked');
	$('#checkbox7').attr('checked','checked');
	if($('#tariffServiceGroupTypeCodeHidden').val()==01){
		$('#checkbox6').attr('checked','checked');
	}
}

function cancel() {
	var screen=$('#screen').val();
	var tariffgrpType = $('#tariffServiceGroupTypeCodeHidden').val();
   var tariffgrpName = $('#srcGrpName').val();
   var tariffsrc = $('#srcGrpTariff').val();
   var tariffItem = $('#srcItemNo').val();
   var srcTariffItemId=$('#srcTariffItemId').val();
   if(screen=='01')
	   {
		 if (somethingChanged) {
				var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true)
				  {
					 document.location.href = _context + '/cas/tariffItemSearch.do?';
				  }
		 }
		 else
			 {
			 document.location.href = _context + '/cas/tariffItemSearch.do?';
			 }
	   }
   else
	   {
		 if (somethingChanged) {
				var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true)
				  {
					 document.location.href=_context +'/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+srcTariffItemId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit';
				  }
		 }
		 else
			 {
			 document.location.href=_context +'/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+srcTariffItemId+'&currentFuture=&isNewItem=false&screen=FRT&mode=edit';
			 }
	   }
}
function referbackToparent() {
	// document.location.href = _context +
	// '/organization/add?actionPerformed=cancel';
	var itemId=document.getElementById('srcTariffItemId');
	//document.location.href=_context + '/tariff/itemFrtWrf/edit?actionPerformed=edit&itemId='+itemId+'&screen=FRT&mode=edit';
}

function callMandatory()
{
	var SrcTrff;
	var TrffEffDate;
	var SrcTrffName;
	
	SrcTrff = document.getElementById('tariffItemReplicateTargetTariffvalue');
	TrffEffDate = document.getElementById('tariffItemReplicateTargetTariffGrpName');
	SrcTrffName = document.getElementById('tariffItemReplicateTargetItemNo');
	if (SrcTrff.value == '' || TrffEffDate.value == '' || SrcTrffName.value == '') {
		alert('Please enter mandatory fields');
	}
	else
		{
		document.location.href='maintain_tariff_item_wrf_frt.html';
		}
}
function removeErrorPointers() {
	$('#replicateTariffItemForm').validationEngine('hideAll');
}
//Next button click functionality
//Next Functionality
  function loadNextTariffItemDetails() {
 		var tariffServItemId = "NEXT";
// 		 var r=confirm("All the unsaved Changes will be discarded!");
// 		 if (r==true)
 		$('#tariffServiceItemId').val('');
 		var itemId=$('#tariffServiceItemId').val();
		 $('#targetGrpTariff').removeAttr('disabled');
		 if( $('#tariffServiceGroupTypeCodeHidden').val()!=null && $('#tariffServiceGroupTypeCodeHidden').val()!='' && $('#tariffServiceGroupTypeCodeHidden').val()!='01' && (itemId==null || itemId=="")){
			 $('#targetGrpName').removeAttr('disabled'); 
		 }
		 //
		 $('#targetItemNo').removeAttr('disabled');
		 $('#newEffDate').removeAttr('disabled');
		 $('#newExpDate').removeAttr('disabled');
		 $('#tariffServiceItemId').removeAttr('disabled');
		 $('#description').removeAttr('disabled');
		 document.getElementById('isAll1').checked=false;
		 $('#isAll').val(false);
 			 //document.location.href=_context +'/replicateTariffItem/showForm?actionPerformed=replicate&itemID='+tariffServItemId+'&mode=Replicate';
 			 document.getElementById('isCurrentFuture').checked=true;
 			 $('#successMsgDiv').hide();
 			 $('#targetGrpTariff').val("");
 			 $('#targetGrpName').val("");
 			 $('#targetItemNo').val("");
 			 //$('#newExpDate').val("");
			 $('#description').val('');
			 $('#replicateItemSave').removeAttr('disabled');
			 $('#itemDetails').attr('disabled','disabled');
			 
			 uncheckSelectall();
		//	 $('form :checkbox').removeAttr('checked');
 		//  }
 	}
  function populateGrpName()
  {
 	 var tariffGrpName=$("#targetGrpTariff").val();
 	 //alert('tariffGrpName:: '+tariffGrpName);
 	 if(tariffGrpName!=null && tariffGrpName!='')
 		 {
 		 $("#targetGrpName").val(tariffGrpName);
 		 }
 	
  
  }
  function SourceTariffPopupSearch() {   
  	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#tariffServiceGroupTypeCodeHidden').val()+"&sourceTariff="+$('#targetGrpTariff').val();
  	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
}

function groupNamePopupSearch() {   
	var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#tariffServiceGroupTypeCodeHidden').val()+"&sourceTariff="+$('#targetGrpTariff').val()+"&grpName="+$('#targetGrpName').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'GroupNameSearch', windowStyle);    
}
function sourceTariffSearchUpdate(id){
	var values = id.split("|");
  	$('#targetGrpTariff').val(values[0]);
  	
}

function groupNameSearchUpdate(id){
	var values = id.split("|");
  	$('#targetGrpName').val(values[0]);
}
function newItem(tariffServiceItemId){
	var screen=$('#screen').val();
   	var itemId = document.getElementById('tariffServiceItemId').value;
  	 var grpTyp = document.getElementById('tariffServiceGroupTypeCodeHidden').value;	
	
  	if(itemId==null || itemId=='')
  	{ 
  		alert("Please save the Item first");
  	}
  	else{
  		document.location.href=_context +'/replicateTariffItem/showForm?actionPerformed=replicate&itemID='+itemId+'&mode=Replicate&screen='+screen;
  		
  	}
  }
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires="+new Date(0).toGMTString();
    }
}

animatedcollapse.init()


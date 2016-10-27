var somethingChanged = false;
var notFromList=[];
var dataName=null;
$(function() {
	
	if(null == $("#effectiveDate").val() || $("#effectiveDate").val().trim() == '')
		$("#effectiveDate").val($("#trrdEffectiveDate").val());
	//alert("now : "+sourceEffectiveDateString);
	tabSequence('#rateDescriptionReplicateForm');
	
	
			$("#box2Views").children().map(function() {
				var box2Text=$(this).text();
				var isFound=false;
				$("#box1Views").children().map(function() {
					if($(this).text()==box2Text) {
						$("#box1Views option[value="+$(this).val()+"]").remove();
						isFound=true;
					}
				}).get();
				if(!isFound) {
					notFromList.push(box2Text);
				}
			}).get();
	

	$('#addButton').click(function(){
		var isEquipmentValidationRequired=false;
		
		if($('#replicatePlanEquipFunctionCode').val().trim().length!=0 || $('#replicatePlanEquipLengthFeet').val().trim().length!=0) {
			if($('#replicatePlanEquipFunctionCode').val().trim().length==0) {
				$("#replicatePlanEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
			else if($('#replicatePlanEquipLengthFeet').val().trim().length==0) {
				$("#replicatePlanEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
			isEquipmentValidationRequired=true;
		}
		if($('#replicatePlanEquipHeightCode').val().trim().length!=0) {
			if($('#replicatePlanEquipFunctionCode').val().trim().length==0 || $('#replicatePlanEquipLengthFeet').val().trim().length==0) {
				$("#replicatePlanEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
				return false;
			}
		}
		if(isEquipmentValidationRequired) {
			$.ajax({
				type : "GET",
				url : _context+ "/tm/traiffRate/isEquipmentValid?",
				data : "planEquipFunctionCode="+ $("#replicatePlanEquipFunctionCode").val()+ "&planEquipLengthFeet="+ $("#replicatePlanEquipLengthFeet").val()+ "&planEquipHeightCode="+ $("#replicatePlanEquipHeightCode").val(),
				success : function(responseText) {
					var data = responseText.data;
					var isValid=true;
					if(data=='false'){
						$("#replicatePlanEquipFunctionCode").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
						isValid=false;
						return false;
					}
					else {
						var optionValue=$('#replicatePlanEquipFunctionCode').val().trim()+":"+$('#replicatePlanEquipLengthFeet').val().trim()+":"+$('#replicatePlanEquipHeightCode').val().trim();
						var optionText=$('#replicatePlanEquipFunctionCode').val()+$('#replicatePlanEquipLengthFeet').val()+$('#replicatePlanEquipHeightCode').val();
						
						var isAlreadyExisting=false;
						$("#box2Views").children().map(function() {
							if(optionText==$(this).text()) {
								isAlreadyExisting=true;
							}
						}).get();
						
						if(!isAlreadyExisting) {
							$('#box2Views').append($('<option selected value= '+ optionValue+'>').text(optionText));
							$('#replicatePlanEquipFunctionCode').val('');
							$('#replicatePlanEquipLengthFeet').val('');
							$('#replicatePlanEquipHeightCode').val('');
						}
						
						
						
						var selectedValues=$('#box1Views').val();
						if(selectedValues!=null) {
							for(var index=0;index<selectedValues.length;index++) {
								
								isAlreadyExisting=false;
								optionText=$("#box1Views option[value="+selectedValues[index]+"]").text();
								$("#box2Views").children().map(function() {
									if(optionText==$(this).text()) {
										isAlreadyExisting=true;
									}
								}).get();
								if(!isAlreadyExisting) {
									$("#box1Views").children().map(function() {
										if(selectedValues[index]==$(this).val()) {
											
												$('#box2Views').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
												$("#box1Views option[value="+$(this).val()+"]").remove();
											
											
										}
									}).get();
								}
							}
						}
					} 
					
				}
			}); 
		}
		else {
			var selectedValues=$('#box1Views').val();
			if(selectedValues!=null) {
				for(var index=0;index<selectedValues.length;index++) {
					
					isAlreadyExisting=false;
					optionText=$("#box1Views option[value="+selectedValues[index]+"]").text();
					$("#box2Views").children().map(function() {
						if(optionText==$(this).text()) {
							isAlreadyExisting=true;
						}
					}).get();
					if(!isAlreadyExisting) {
						$("#box1Views").children().map(function() {
							if(selectedValues[index]==$(this).val()) {
								
									$('#box2Views').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
									$("#box1Views option[value="+$(this).val()+"]").remove();
								
								
							}
						}).get();
						}
				}
			}
		}
		SortSubscribeFields("box2Views");
	});
	
	
	$('#removeButton').click(function(){
		//var movedToTextBox=false;
		var selectedValues=$('#box2Views').val();
		for(var index=0;index<selectedValues.length;index++) {
			/*$("#box2Views").children().map(function() {
				if(selectedValues[index]==$(this).val()) {
					$('#box1Views').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
					$("#box2Views option[value="+$(this).val()+"]").remove();
				}
			}).get();*/
			
			$("#box2Views").children().map(function() {
				if(selectedValues[index]==$(this).val()) {
					var optionValue=$(this).val();
					var split=optionValue.split(":");
					if(split!=null) {
						if(split.length>=2) {
							//if(!movedToTextBox) {
								/*$('#replicatePlanEquipFunctionCode').val(split[0]);
								$('#replicatePlanEquipLengthFeet').val(split[1]);
								if(split.length==3) {
									$('#replicatePlanEquipHeightCode').val(split[2]);
								}
								else {
									$('#replicatePlanEquipmentHeightCode').val('');
								}*/
								$(this).val('toRemove');
								$("#box2Views option[value=toRemove]").remove();
								//movedToTextBox=true;
							//}
						}
						else {
							var isAlreadyExisting=false;
							var isAppendAllowed=true;
							$("#box1Views").children().map(function() {
								if(optionValue==$(this).val()) {
									isAlreadyExisting=true;
								}
							}).get();
							if(!isAlreadyExisting) {
								for(var count=0;count<notFromList.length;count++) {
									if($(this).text()==notFromList[count]){
										isAppendAllowed=false;
										break;
									}
								}
								if(isAppendAllowed) {
									$('#box1Views').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
								}
							}
							if(isAppendAllowed) {
								$(this).remove();
							}
							else {
								$(this).remove();
							}
							//$("#box2Views option[value="+$(this).val()+"]").remove();
						}
					}
					else {
						var isAlreadyExisting=false;
						$("#box1Views").children().map(function() {
							if(optionValue==$(this).val()) {
								isAlreadyExisting=true;
							}
						}).get();
						var isAppendAllowed=true;
						if(!isAlreadyExisting) {
							for(var count=0;count<notFromList.length;count++) {
								if($(this).text()==notFromList[count]){
									isAppendAllowed=false;
									break;
								}
							}
							if(isAppendAllowed) {
								$('#box1Views').append($('<option selected value= '+ $(this).val()+'>').text($(this).text()));
							}
						}
						if(isAppendAllowed) {
							$(this).remove();
						}
						else {
							$(this).remove();
						}
					}
				}
			}).get();
		}
		SortSubscribeFields("box1Views");
	});
	
	
	if(_readonlyReplicationRate){
		$('#mainContent').gatesDisable();
	}
	
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
	 
	 $('#replicatePlanEquipFunctionCode').blur(function(){
		 if($('#replicatePlanEquipFunctionCode').val().trim()=='') {
			 $('#replicatePlanEquipFunctionCode').val('');
		 }
	});
	 
	 $('#replicatePlanEquipLengthFeet').blur(function(){
		 
		 if($('#replicatePlanEquipLengthFeet').val().trim()=='') {
			 $('#replicatePlanEquipLengthFeet').val('');
		 }
	});
	 
	 $('#replicatePlanEquipHeightCode').blur(function(){
		 if($('#replicatePlanEquipHeightCode').val().trim()=='') {
			 $('#replicatePlanEquipHeightCode').val('');
		 }
	});
		var _pageMode='Add';
		
		$('#repRateSave').click(function(){
			submitAllSelect();
			
			var isEquipmentValidationRequired=false;
			
			if($("#rateDescriptionReplicateForm").validationEngine('validate')){
				if($('#replicatePlanEquipFunctionCode').val().trim().length!=0 || $('#replicatePlanEquipLengthFeet').val().trim().length!=0) {
					if($('#replicatePlanEquipFunctionCode').val().trim().length==0) {
						$("#replicatePlanEquipFunctionCode").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
						return false;
					}
					else if($('#replicatePlanEquipLengthFeet').val().trim().length==0) {
						$("#replicatePlanEquipLengthFeet").validationEngine('showPrompt', 'Please provide a valid input', 'error', true);
						return false;
					}
					isEquipmentValidationRequired=true;
				}
				if(isEquipmentValidationRequired) {
					$.ajax({
						type : "GET",
						url : _context+ "/tm/traiffRate/isEquipmentValid?",
						data : "planEquipFunctionCode="+ $("#replicatePlanEquipFunctionCode").val()+ "&planEquipLengthFeet="+ $("#replicatePlanEquipLengthFeet").val()+ "&planEquipHeightCode="+ $("#replicatePlanEquipHeightCode").val(),
						success : function(responseText) {
							var data = responseText.data;
							var isValid=true;
							if(data=='false'){
								$("#replicatePlanEquipFunctionCode").validationEngine('showPrompt', 'Not a valid Equipment', 'error', true);
								isValid=false;
							}
							else {
								$("#replicateEquipmentCode").val($("#replicatePlanEquipFunctionCode").val()+$("#replicatePlanEquipLengthFeet").val()+$("#replicatePlanEquipHeightCode").val());
								$("#rateDescriptionReplicateForm").attr("action", "replicateRateDescription");								
						        $("#rateDescriptionReplicateForm").submit(); 
						    	
							} 
							
						}
					}); 
				}
				else {					
					
					if($('input[id=targetDirectionOrigin]:checked').val() == 'O'){
						$('#targetDirection').val($('input[id=targetDirectionOrigin]:checked').val());						
					}
					if($('input[id=targetDirectionDestination]:checked').val() == 'D'){
						$('#targetDirection').val($('input[id=targetDirectionDestination]:checked').val());
					}
					$("#replicateEquipmentCode").val($("#replicatePlanEquipFunctionCode").val()+$("#replicatePlanEquipLengthFeet").val()+$("#replicatePlanEquipHeightCode").val());
					$("#rateDescriptionReplicateForm").attr("action", "replicateRateDescription");
					
			        $("#rateDescriptionReplicateForm").submit(); 
				}
			}else{
	    		return false;
	    	}
	    });
	
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;		
		if(_prefDate!=null && _prefDate!=''){
			if(_pageMode=='Add'){
				$("#effectiveDate").datepicker('setDate',_prefDate);
				$("#effectiveDate").validationEngine('hidePrompt');
			}
			$("#preferencedate").datepicker('setDate',_prefDate);
		}
		else{
			if(_pageMode=='Add'){
			$("#effectiveDate").datepicker('setDate', new Date());
			$("#effectiveDate").validationEngine('hidePrompt');
			}
			$("#preferencedate").datepicker('setDate',new Date());
		}
		
	    /*   var screenMode;
	  	 screenMode = document.getElementById('screen_mode');
	  	 
	  	 if(screenMode.value == 'Add'){
	  		 
	  		 document.getElementById('itemNew').style.display = 'block';
	  		
	  	 }else
	  		 {
	  		 document.getElementById('itemNxt').style.display = 'block';
	  		 }*/
	  	$("#rateDescriptionReplicateForm").validationEngine('attach'); 
	  
	  	$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
			
		$("#effectiveDate").change(function(){
			if($('#effectiveDate').val()!=null && $('effectiveDate').val()!=""){
				$('#effectiveDate').validationEngine('hidePrompt');
			}
		});

		$.configureBoxes({
			useFilters : false,
			useCounters : false
		});
		
		// code to bind pop up search
		 $('#targetGrpName').gatesPopUpSearch({func:function() {groupNamePopupSearch()}});
		 $('#targetSrcTariff').gatesPopUpSearch({func:function() {SourceTariffPopupSearch()}});	
		 $('#targetItemName').gatesPopUpSearch({func:function() {ItemPopupSearch()}});	
		
		 
			//Disabling of Next Button
			$('#itemNxtBtn').attr("disabled","disabled");
			var disableNext=$('#disableNextButton').val();
			if(disableNext!='false'){
				$('#itemNxtBtn').attr("disabled","disabled");				 
			 }else{
				 $('#itemNxtBtn').removeAttr("disabled");
								 
			 }
			
			// City Auto complete
			$('#targetCity').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompCity',
				formatItem : function(city) {
				 	 document.getElementById('cityID').value=city.cityCode;
				 	 dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
					return dataName;
				},
				formatResult : function(city) {
				 	 dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
					return dataName;
				},
				select : function(city) {
					dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
					document.getElementById('cityID').value=city.cityCode;
					$('#targetCity').val(dataName);
				}
			});
			//Blurr the data for invalid group Id
			 $('#targetCity').change(function(){
				 var cityVal=$('#targetCity').val();
				 if(cityVal!='****') {
					 if(document.getElementById('cityID').value==null || document.getElementById('cityID').value=="" ){
							$('#targetCity').val("");
							//alert("Enter either be a valid City Code or the wildcard string, '****'");
				    	}
					else{
						$('#targetCity').val(dataName);
						$('#cityID').val("");
					}
				 }
			    }); 
			 
				$('#targetCity').gatesPopUpSearch({
					func : function() {
						cityPopupSearch()
					}
				});
				var directionCode=$('#targetDirection').val();
				if(directionCode!=null && directionCode!=""){
					if(directionCode=="O" || directionCode=="o"){
						$("#targetDirectionOrigin").prop("checked", true); 
					} 
					if(directionCode=="D" || directionCode=="d"){
						$("#targetDirectionDestination").prop("checked", true); 
					} 
				}
				
				$('#box1Views').dblclick(function() {
					$("#box1Views option:selected").prop("selected", false);
					
				});					
				
	  });

function SortSubscribeFields(fieldname) {
	var listitems =  $("#"+fieldname+" option");
	 listitems.sort(function(a, b) {
	 var compA = $(a).text().toUpperCase();
	 var compB = $(b).text().toUpperCase();
	 return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
	})
	$.each(listitems, function(idx, itm) {
		 $("#"+fieldname).append(itm);
	});
}
   

   function validateMAndatory()
   {
	   var SrcTrff;
   	var TrffEffDate;
   	var SrcTrffName;
   	
   	SrcTrffName = document.getElementById('itmNumber');
   	SrcTrff = document.getElementById('tariffItemEffDateval');
   
   	if (SrcTrff.value == '' ||  SrcTrffName.value =='') {

   		alert('Please Enter Mandatory Fields  " Tariff Item Number and Effective Date" ');

   		}
	
   }
   
   function dateCompare()
   {
	   var date1=document.getElementById('effectiveDate').value;
	   var date2=document.getElementById('expirationDate').value;
	   
	   var month1=date1.substring(5,7);
	   var month2=date2.substring(5,7);
	   
	   var day1=date1.substring(8,10);
	   var day2=date2.substring(8,10);
	   
	   var year1=date1.substring(0,4);
	   var year2=date2.substring(0,4);
	   
	   if(year1>year2)
		   {
		   return "Expiration date should be greater than effective date";
		   }
	   else if((year1==year2)&&(month1>month2))
		   {
		   return "Expiration date should be greater than effective date";
		   }
	   else if((year1==year2)&&(month1==month2)&&(day1>day2))
		   {
		   return "Expiration date should be greater than effective date";
		   }
   }
   
  
   function callAddCommodities(){
	   document.location.href='item_Commodity_desc.html';
   }
   
 //Next button click functionality
   //Next Functionality
     function loadNextTariffItemDetails() {
    		var tariffRateDescriptionId = "NEXT";
    		var screen=$('#screen').val();
    		//Added current Future value for Defect D025017
    		var currentFuture='ALL';
			if ($("#isCurrentFuture").is(":checked"))
				currentFuture='Y';
    		if(somethingChanged){
       		 var r=confirm("All the unsaved Changes will be discarded!");
    		 if (r==true)
    		  {
    			 document.location.href = _context +'/RateDescription/replicate/showForm?rateDescriptionId='+ tariffRateDescriptionId+'&screen='+screen+'&currentFuture='+currentFuture;
    		  }
    		}
    		else{
    			 document.location.href = _context +'/RateDescription/replicate/showForm?rateDescriptionId='+ tariffRateDescriptionId+'&screen='+screen+'&currentFuture='+currentFuture;
    		}
    	}
     
   function removeErrorPointers(){
	   $('#rateDescriptionReplicateForm').validationEngine('hideAll');
}
   
   function clearOrCopyGroupDetails() {
	   var srcTrf = document.getElementById('newSrcTrf').value;
	   var grpTyp = document.getElementById('newGrpType').value;
	   
	   if(grpTyp == 'FRT') {
		   document.getElementById('newGrpName').value=srcTrf;
	   }
	   
	   if(srcTrf == '') {
		   document.getElementById('newGrpName').value='';
		   document.getElementById('newItemName').value='';
	   }
	   
   }
   
   function loadNextReplicateDetails() {
		var rateDescId = "NEXT";
		
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
				 				
				
				document.location.href=_context +'/tariff/itemDra/edit?actionPerformed=edit&itemId='+tariffServItemId+'&screen1=edit&mode=edit';
		  }
		 
	
	}
   
   function AddType() 
   {
 	  /* if( $('#load option:selected').size()=='0'){
 		   alert('Please select atleast one Commodity Code');
 	   }*/
 	  /* else{*/
       $('#load option:selected').remove().appendTo('#load1');
   //}
   }
   function RemoveType() 
   {
 	   /*if( $('#load1 option:selected').size()=='0'){
 		   alert("Please select atleast one Commodity Code");
 	   }*/
 	  
 	  // else{
       $('#load1 option:selected').remove().appendTo('#load');
  
   //}
   }
   
   function cancel() {
	   var screen=$('#screen').val();
	   var tariffgrpType = $('#hiddenGroupTypeCode').val();
		var tariffgrpName = $('#grpName').val();
		var tariffsrc = $('#srcTariff').val();
		var tariffItem = $('#itemName').val();
		var rateId = $('#tariffRateDescriptionId').val();
		var currentFuture = $('#isCurrentFuture').val(); 
		
		   if(screen=='01')
		   {
			 if (somethingChanged) {
					var r=confirm("All the unsaved Changes will be discarded!");
					 if (r==true)
					  {
						 document.location.href = _context
							+ '/cas/rateDesriptionSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc+'&itemCode='+tariffItem+'&currentFuture='+currentFuture+'&exitfrom='+'exit';
					  }
			 }
			 else
				 {
				 document.location.href = _context
					+ '/cas/rateDesriptionSearch.do?grpType='+tariffgrpType+'&grpCode='+tariffgrpName+'&srcCode='+tariffsrc+'&itemCode='+tariffItem+'&currentFuture='+currentFuture+'&exitfrom='+'exit';
				 }
		   }
	   else
		   {
			 if (somethingChanged) {
					var r=confirm("All the unsaved Changes will be discarded!");
					 if (r==true)
					  {
						 document.location.href=_context +'/tm/traiffRate/showForm?rateDescId='+rateId+'&action=EXIT&currentFuture='+currentFutur+'&exitfrom='+'exit';
					  }
			 }
			 else
				 {
				 document.location.href=_context +'/tm/traiffRate/showForm?rateDescId='+rateId+'&action=EXIT&currentFuture='+currentFuture+'&exitfrom='+'exit';
				 }
		   }

	}
   
   function populateGrpName()
   {

  	 var tariffGrpName=$("#targetSrcTariff").val();
  	 //alert('tariffGrpName:: '+tariffGrpName);

  		 	$("#targetGrpName").val(tariffGrpName);

   
   }
  	
	
	//methods for selecting all values from multi select menu
	function submitAllSelect() {
		selectAll(getControl('box2Views'));
		deselectAll(getControl('box1Views'));
	}

	function selectAll(selObj) {
		if (selObj == null || selObj.options.length == 0)
			return false;
		var tmpOptObj;
		for ( var i = 0; i < selObj.options.length; i++) {
			tmpOptObj = selObj.options[i];
			if (!tmpOptObj.selected)
				tmpOptObj.selected = true;
		}// end if
	}// closing Select All Function
	
	function deselectAll(selObj) {
		if (selObj == null || selObj.options.length == 0)
			return false;
		var tmpOptObj;
		for ( var i = 0; i < selObj.options.length; i++) {
			tmpOptObj = selObj.options[i];
			if (tmpOptObj.selected){
				tmpOptObj.selected =false;
			}
		}// end if
	}

	var getControl = function(id) {
		var control = document.getElementById(id);
		if (!control)
			control = document.getElementById(getNetuiTagName(id, this));
		return control;
	};



	  function SourceTariffPopupSearch() {   
		  	var actionUrl = _context+"/cas/sourcetarifflookup.do?grpTyp="+$('#hiddenGroupTypeCode').val()+"&sourceTariff="+$('#targetSrcTariff').val();
		  	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'SourceTariffSearch', windowStyle);    
		}

		function groupNamePopupSearch() {   
			var actionUrl = _context+"/cas/groupnamelookup.do?grpTyp="+$('#hiddenGroupTypeCode').val()+"&sourceTariff="+$('#targetSrcTariff').val()+"&grpName="+$('#targetGrpName').val();
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'GroupNameSearch', windowStyle);    
		}
		function ItemPopupSearch() {   
			var actionUrl = _context+"/cas/itemnamelookup.do?grpTyp="+$('#hiddenGroupTypeCode').val()+"&sourceTariff="+$('#targetSrcTariff').val()+"&grpName="+$('#targetGrpName').val()+"&itemName="+$('#targetItemName').val();
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'ItemNameSearch', windowStyle);    
		}

		function sourceTariffSearchUpdate(id){
			var values = id.split("|");
				$('#targetSrcTariff').val(values[0]);
				
			}

			function groupNameSearchUpdate(id){
			var values = id.split("|");
				$('#targetGrpName').val(values[0]);
			}

			function itemNameSearchUpdate(id){
				var values = id.split("|");
					$('#targetItemName').val(values[0]);
			}

			function cityPopupSearch() {
				var actionUrl = _context + "/city/manualLookup/showForm?term="+ $('#targetCity').val();
				var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'CitySearch', windowStyle);
			}

			function cityUpdate(id) {
				$('#targetCity').val(id);
			}
   
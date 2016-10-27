  var somethingChanged = false;
  var somethingChangedButtons = true;
  var isInputChange="";
  var selectedOriginCityToList="";
  var selectedDestinationCityToList="";
  var originCityInclusive="";
  var destinationCityInclusive="";
  
  
 $(document).ready(function () {
	 //$('#cities').gatesDisable();
	 //alert('city disabled');
	 var cityFlag= true;
	 var loadDischargeFlag= true;
	 var rangeFlag= true;
	 var specialServiceFlag= true;
	 var misFlag= true;
	 var freightRateFlag= true;
	 var equipcondFlag= true;
	 var equiplistFlag= true;
	 var messFlag= true;
	 var addressRoleFlag= true;
	
	 if($('#conditionCityPortOriginPortToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 if($('#conditionCityPortDestinationPortToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 if($('#conditionCityPortBLOrignCityToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 if($('#conditionCityPortBLDestinationCityToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 if($('#conditionCityPortBargeOriginToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 if($('#conditionCityPortBargeDestinationToList option').length !=0)
	 {
		 cityFlag =0;
	 }
	 
	 if($('#ieRangeType1 option').val() != "." || $('#ieRangeType2 option').val() != "." || $('#ieRangeType3 option').val() != "."|| $('#ieRangeType4 option').val() != "." || $('#ieRangeType5 option').val() != ".")
	 {
		 rangeFlag =0;
	 }
	 
	 if($('#range1UnitOfMeasureCode option').length !=0 || $('#range2UnitOfMeasureCode option').length !=0 || $('#range3UnitOfMeasureCode option').length !=0 || $('#range4UnitOfMeasureCode option').length !=0 || $('#range5UnitOfMeasureCode option').length !=0)
	 {
		 rangeFlag =0;
	 }
	
	 if($('#conditionLoadDischargeSelectedLoadServiceToList option').length !=0)
	 {
		 loadDischargeFlag =0;
	 }
	 if($('#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList option').length !=0)
	 {
		 loadDischargeFlag =0;
	 }
	 if($('#conditionLoadDischargeServicePairToList option').length !=0)
	 {
		 loadDischargeFlag =0;
	 }
	 if($('#conditionMiscNote').val() !="")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscTrade option').val() != ".")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscOverFlowIndicator option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscAsFreighted option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscCertificationRequired option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscVehical option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscRollingStock option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscTrackCreated option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscMultiCommLine option').val() != " ")
	 {
		 misFlag =0;
	 }
	 if($('#conditionMiscMultiTrffItem option').val() != " ")
	 {
		 misFlag =0;
	 }
	
	 if($('#conditionSpecialServiceToList1 option').length !=0)
	 {
		 specialServiceFlag =0;
	 }
	 if($('#conditionSpecialServiceToList2 option').length !=0)
	 {
		 specialServiceFlag =0;
	 }
	 if($('#conditionSpecialServiceToList3 option').length !=0)
	 {
		 specialServiceFlag =0;
	 }
	 if($('#conditionSpecialServiceToList4 option').length !=0)
	 {
		 specialServiceFlag =0;
	 }
	 if($('#conditionSpecialServiceToList5 option').length !=0)
	 {
		 specialServiceFlag =0;
	 }
	 if($('#conditionrateBasisToList option').length !=0)
	 {
		 freightRateFlag =0;
	 }
	 if($('#conditionEquipmentSelectedList option').length !=0)
	 {
		 equipcondFlag =0;
	 }
	 if($('#conditionEqptFeatureSelLst option').length !=0)
	 {
		 equiplistFlag =0;
	 }
	 if($('#shipperAroleSelectedList option').length !=0)
	 {
		 addressRoleFlag =0;
	 }
	 if($('#consigeeAroleSelectedList option').length !=0)
	 {
		 addressRoleFlag =0;
	 }
	 if($('#debitorAroleSelectedList option').length !=0)
	 {
		 addressRoleFlag =0;
	 }
	 if($('#shipperOrganizationToList option').length !=0)
	 {
		 addressRoleFlag =0;
	 }
	 if($('#debitorOrganizationToList option').length !=0)
	 {
		 addressRoleFlag =0;
	 }
	 

	var destList = document.getElementById("conditionLoadDischargeLoadServiceFromList");
	$('#conditionLoadDischargeSelectedLoadServiceToList option').each(function(i, selected) {
		var toRemove = false;
			for ( var m = 0; m < destList.options.length; m++) {
				if ($(selected).val() == destList.options[m].value) {
						toRemove = true;
						break;
				} 
			}
			if(toRemove){
				$("#conditionLoadDischargeLoadServiceFromList option[value="+$(selected).val()+"]").remove();
			}
	});
	
	var destDisList = document.getElementById("conditionLoadDischargeDischargeServiceFromList");
	$('#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList option').each(function(i, selected) {
		var tobeRemoved = false;
			for ( var m = 0; m < destDisList.options.length; m++) {
				if ($(selected).val() == destDisList.options[m].value) {
					tobeRemoved = true;
						break;
				} 
			}
			if(tobeRemoved){
				$("#conditionLoadDischargeDischargeServiceFromList option[value="+$(selected).val()+"]").remove();
			}
	});
			
	 
	 tabSequence('#tariffConditonForm');
	 //Modified active Flag from Flags to False for Defect D025554
	 $( "#conditionAccordians1" ).accordion({
			autoHeight: false,
			 active: false,  //Modified from  cityFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 $( "#conditionAccordians2" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  loadDischargeFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 $( "#conditionAccordians3" ).accordion({
			autoHeight: false,
			 active: false,  //Modified from  rangeFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians4" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  specialServiceFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians5" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  misFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians6" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  freightRateFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 $( "#conditionAccordians7" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  equipcondFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians8" ).accordion({
			autoHeight: false,
			 active: false,  //Modified from  equiplistFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians9" ).accordion({
			autoHeight: false,
			 active: false,  //Modified from  messFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 
	 $( "#conditionAccordians10" ).accordion({
			autoHeight: false,
			 active: false, //Modified from  addressRoleFlag to false
			 multiple:true,
			 collapsible: true 
			});
	 var accOpts = {
		        //add change event callback
		        change: function(e, ui) {
		          if($(ui.oldContent).attr("id") == 'maintainConditionRanges')
		        	  {
		        	  $('#ieRange1').validationEngine('hidePrompt');
		        	  $('#ieRange2').validationEngine('hidePrompt');
		        	  $('#ieRange3').validationEngine('hidePrompt');
		        	  $('#ieRange4').validationEngine('hidePrompt');
		        	  $('#ieRange5').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan2').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan3').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan4').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan5').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan2').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan3').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan4').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan5').validationEngine('hidePrompt');
		        	  $('#ieRangeType1').validationEngine('hidePrompt');
		        	  $('#ieRangeType2').validationEngine('hidePrompt');
		        	  $('#ieRangeType3').validationEngine('hidePrompt');
		        	  $('#ieRangeType4').validationEngine('hidePrompt');
		        	  $('#ieRangeType5').validationEngine('hidePrompt');
		        	  }
		        }    
		      };
	
	 var accOpts2 = {
		        //add change event callback
		        change: function(e, ui) {
		        	  $('#ieRange1').validationEngine('hidePrompt');
		        	  $('#ieRange2').validationEngine('hidePrompt');
		        	  $('#ieRange3').validationEngine('hidePrompt');
		        	  $('#ieRange4').validationEngine('hidePrompt');
		        	  $('#ieRange5').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan2').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan3').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan4').validationEngine('hidePrompt');
		        	  $('#ieRangegreaterThan5').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan2').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan3').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan4').validationEngine('hidePrompt');
		        	  $('#ieRangeLesserthan5').validationEngine('hidePrompt');
		        	  $('#ieRangeType1').validationEngine('hidePrompt');
		        	  $('#ieRangeType2').validationEngine('hidePrompt');
		        	  $('#ieRangeType3').validationEngine('hidePrompt');
		        	  $('#ieRangeType4').validationEngine('hidePrompt');
		        	  $('#ieRangeType5').validationEngine('hidePrompt');
		        }    
		      };
	
	
		      $("#conditionAccordians3").accordion(accOpts);
		      $("#conditionAccordians1").accordion(accOpts2);
		      $("#conditionAccordians2").accordion(accOpts2);
	
   //Added for defect D017809
	if($("#accordionState").val() != ''){
		var accordianString = $("#accordionState").val();
		var accordianStringArray = accordianString.split("$$");
		if(accordianStringArray.length > 1){
			for(i = 1; i<accordianStringArray.length; i++){
				$("#"+accordianStringArray[i]).accordion('option', 'active' , 0);
			}
		}
			
	}
		      
	 
	if(_readonly){
	$('#generalConditionDescription').gatesDisable();
	$('.conditionTab').gatesDisable();
	}  
	 var tariffConditionId=this.forms[0].tariffConditionId.value;
	
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
	 $('#cityPortoriginPortto2').click(function() {
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
	 $('#cityPortoriginPortto1').click(function() {
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
	 $('#cityPortDestinationPortto2').click(function() {
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
	 
	 $('#cldLoadSeviceTo1').click(function() {
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
	 
	 $('#cldLoadSeviceTo2').click(function() {
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
	 
	 $('#cldDischargeServiceTo1').click(function() {
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
	 
	 $('#cldDischargeServiceTo2').click(function() {
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
	 
	 $('#cldServicePairTo1').click(function() {
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
	 
	 $('#cldServicePairTo2').click(function() {
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
	 
	 
	 $('#specialServiceL1to2').click(function() {
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
	 $('#specialServiceL2to2').click(function() {
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
	 $('#specialServiceL3to2').click(function() {
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
	 $('#specialServiceL4to2').click(function() {
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
	 $('#specialServiceL5to2').click(function() {
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
	 
	 $('#specialServiceL1to1').click(function() {
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
	 $('#specialServiceL2to1').click(function() {
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
	 $('#specialServiceL3to1').click(function() {
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
	 $('#specialServiceL4to1').click(function() {
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
	 $('#specialServiceL5to1').click(function() {
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
	 $('#conditionRateBasisto1').click(function() {
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
	 $('#equipmentto1').click(function() {
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

	 $('#equipmentto2').click(function() { //D033868
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

	 $('#equipmentFeatureto1').click(function() {
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
	 $('#cityPortDestinationPortto1').click(function() {
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
	 $('#cityPortBLoriginCityto2').click(function() {
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
	 $('#cityPortBLoriginCityto1').click(function() {
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
	 $('#cityPortPLDestinationCityto2').click(function() {
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
	 $('#cityPortPLDestinationCityto1').click(function() {
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
	 
	 $('#conditionRateBasisto2').click(function() {
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
	 
	 
	 $('#conditionRateBasisto1').click(function() {
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
	 
	 
	 
	 $('radio').change(function() {
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
	        somethingChanged = true; 
	   }); */
	 $('select').change(function() {
		 var isMultiSelect = $(this).attr('multiple');
		 if($(this).is(':disabled, [readonly]')) {
			 
		    }else if(null == isMultiSelect || isMultiSelect != 'multiple'){

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
/*	 $("input[type=button]").click(function() {
		 if(somethingChangedButtons==true || somethingChangedButtons=="true"){
			 somethingChanged = true; 
		 }
	 });*/
	 
	 if($('#screenName').val()=='wharfage' ){ 
		 $('#toGroup_type_Drop_down').attr("disabled",true);
		 $('#fromRate').attr("disabled", true);
	   }
	 if($('#screenName').val()=='drayage' ){ 
		 $('#toGroup_type_Drop_down').attr("disabled",true);
		 //D025671
		 $("#toItemLabel").html("<span class=\"mandatory\">*</span>");
		 $("#toItem").addClass("validate\[required\]");
		 $('#fromRate').attr("disabled", true);
		 $('#toGroup_type_Drop_down').val("04");
	   }
		var args = {
				entityType: 'TRCO',
				entityId: this.forms[0].tariffConditionId.value,
				commentId: "commentId"
			};
		$("#comment_link").comments(args);
	
		var args1 = {
				entityType: 'TRSV',
				entityId: this.forms[0].traiffGroupId.value,
				commentId: "GroupCommentId",
				viewOnly: true,
				commentsFrame: 'grpCommentsFrame'
			};
		$("#grp_comment_link").comments(args1);
		var args2 = {
				entityType: 'TRSI',
				entityId: this.forms[0].tariffItemId.value,
				commentId: "ItemCommentId",
				viewOnly: true,
				commentsFrame: 'itemCommentsFrame'
			};
		$("#item_comment_link").comments(args2);
		var args3 = {
				entityType: 'TRRD',
				entityId: this.forms[0].traiffRateId.value,
				commentId: "RateCommentId",
				viewOnly: true,
				commentsFrame: 'rateCommentsFrame'
			};
		$("#rate_comment_link").comments(args3);
		var args4 = {
				entityType: 'TRSV',
				entityId: this.forms[0].toTariffServiceGroupId.value,
				commentId: "toGroupCommentId",
				viewOnly: true,
				commentsFrame: 'togrpCommentsFrame'
			};
		$("#grp_to_comment_link").comments(args4);
			var args5 = {
				entityType: 'TRSI',
				entityId: this.forms[0].toItemId.value,
				commentId: "toItemCommentId",
				viewOnly: true,
				commentsFrame: 'toitemCommentsFrame'
			};
		$("#toitem_comment_link").comments(args5);
		var args6 = {
				entityType: 'TRRD',
				entityId: this.forms[0].toRateId.value,
				commentId: "toRateCommentId",
				viewOnly: true,
				commentsFrame: 'torateCommentsFrame'
			};
		$("#to_rate_comment_link").comments(args6);
		
		
		
		if($('#fromItem').val()!="" && $('#fromItem').val()!=null){
			document.getElementById("item_comment_link").style.display="block";
		}
		if($('#fromRate').val()!="" && $('#fromRate').val()!=null){
			document.getElementById("rate_comment_link").style.display="block";
		}
		if($('#toItem').val()!="" && $('#toItem').val()!=null){
			document.getElementById("toitem_comment_link").style.display="block";
		}

		if($('#toTariffServiceGroupName').val()!="" && $('#toTariffServiceGroupName').val()!=null){
			document.getElementById("grp_to_comment_link").style.display="block";
		}
		if($('#toRate').val()!="" && $('#toRate').val()!=null){
			document.getElementById("to_rate_comment_link").style.display="block";
		}

			
	 $("#toGroup_type_Drop_down option:nth-child(1)").remove();
	 // to disable message when page load first time//
	 if($('#tariffConditionId').val()==""){
	 $('#conditionBookingNewCheckBox').attr("disabled", true);
	 $('#conditionBillingNewCheckBox').attr("disabled", true);
	 $('#conditionQuoteNewCheckBox').attr("disabled", true);
	 }

      if (($(document).getUrlParam("screenName"))== 'link'  || ($(document).getUrlParam("screenName"))== 'wharfage' || ($(document).getUrlParam("screenName"))== 'warning') {
    	  $("#formGroup_type_Drop_down").attr("disabled", true);
		  $("#fromTariffServiceSourceCode").attr("disabled", true);
		  $("#fromTariffServiceGroupName").attr("disabled", true);
		  $("#fromItem").attr("disabled", true);
		  $("#fromRate").attr("disabled", true);
      } else {
    	  $("#formGroup_type_Drop_down").attr("disabled", true);
		  $("#fromTariffServiceSourceCode").attr("disabled", true);
		  $("#fromTariffServiceGroupName").attr("disabled", true);
		  $("#fromItem").attr("disabled", true);
		  $("#fromRate").attr("disabled", true);
	 }
     
      if (($(document).getUrlParam("secondayLinkage"))== 'toLinkage') {
    	 
    	  $("#toGroup_type_Drop_down").attr("disabled", true);
		  $("#toTariffServiceSourceCode").attr("disabled", true);
		  $("#toTariffServiceGroupName").attr("disabled", true);
		  $("#toItem").attr("disabled", true);
		  $("#toRate").attr("disabled", true);
		  $("#fromTariffServiceSourceCode").attr("disabled", false);
		  $("#fromTariffServiceGroupName").attr("disabled", false);
		  $("#fromItem").attr("disabled", false);
		  $("#fromRate").attr("disabled", false);
    		  
      }
      else{
    	  $("#formGroup_type_Drop_down").attr("disabled", true);
		  $("#fromTariffServiceSourceCode").attr("disabled", true);
		  $("#fromTariffServiceGroupName").attr("disabled", true);
		  $("#fromItem").attr("disabled", true);
		  $("#fromRate").attr("disabled", true);
      }
	 
	 $("#tariffConditonForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		
		
		
			 
		/*BR for Equipment feature lsit*/
		
		//$("#conditionEqptFeatureCode").attr("disabled", true);
		//$("#movementFromLsb").attr("disabled", true);
		//$("#movementToLsb").attr("disabled", true);
		
		$('#conditionEqptFeatLSBRadio').click(function(){
			if($('#conditionEqptFeatLSBRadio:checked').val()!==undefined){
			$("#conditionEqptFeatureCode").attr("disabled", false);
			$("#movementFromLsb").attr("disabled", false);
			//$("#movementToLsb").attr("disabled", false);
			$("#equipmentFeatureto1").attr("disabled", false);
			$("#equipmentFeatureto2").attr("disabled", true);
			
			
			}
	    });
		
		$('#conditionEqptFeatAvailLstRadio').click(function(){
			if($('#conditionEqptFeatAvailLstRadio:checked').val()!==undefined){
			$("#conditionEqptFeatureCode").attr("disabled", true);
			$("#movementFromLsb").attr("disabled", true);
			//$("#movementToLsb").attr("disabled", true);
			$("#equipmentFeatureto1").attr("disabled", false);
			$("#equipmentFeatureto2").attr("disabled", false);
			}
	    });
		
		//disable/enable newButton
		$('#condNewBtn').attr("disabled","disabled");
		$('#xCopyCndn').attr("disabled","disabled");
		$('#replicateCndn').attr("disabled","disabled");
		if((tariffConditionId!= null)&&(tariffConditionId!= '')){
			
			$('#condNewBtn').removeAttr("disabled");
			if(!_readonly){
				$('#xCopyCndn').removeAttr("disabled");
				$('#replicateCndn').removeAttr("disabled");
			}
		}
		//end disable
		$('#condNewBtn').click(function(){
			 var grpTyp = document.getElementById('formGroup_type_Drop_down').value;
			 var grpCode = document.getElementById('fromTariffServiceGroupName').value;
			 var sourceCode = document.getElementById('fromTariffServiceSourceCode').value;
			 var itemCode = document.getElementById('fromItem').value;
			 var rate = document.getElementById('fromRate').value;
			 var rateId = document.getElementById('fromRateId').value;
			 var screen1 = document.getElementById('screenName').value;
			 var screen ="link";
			 var key=$('#key').val();
			 var from = $('#from').val();
			 var currentFuture=$('#isCurrentFuture').val();
			 if(currentFuture==true || currentFuture=="true" || currentFuture=="Y"){
				 currentFuture='Y';
			 }
			 else{
				 currentFuture='N';
			 }
			 document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+rateId+'&screenName='+screen1+'&key='+key+'&isCurrentFuture='+currentFuture+'&from='+from;
		//	document.location.href=_context+'/condition/showForm?groupTypeCode='+grpTyp+'&groupCode='+grpCode+'&sourceCode='+sourceCode+'&itemCode='+itemCode+'&rateDescription='+rate+'&fromRateId='+rateId+'&screenName='+screen1;
		});
		
		$('#movementFromLsb').click(function(){
			var lsbCode =$("#conditionEqptFeatureCode").val().trim();
			var regExp="^[0-9a-zA-Z ]+$";
			if (lsbCode.match(regExp)) {
				 $('#conditionEqptFeatureSelLst')
		          .append($('<option>',{style:"color:blue",  value : lsbCode })
		          .text(lsbCode +"  "+ "LSB Code")); 
				 var status=0;
				 var changed = 1;//D033150
				 $("#conditionEqptFeatureSelLst option").each(function()
				 {   var eqpFeature= $(this).val();
				    
					 if(status==0 && lsbCode==eqpFeature){
						 status=1;
					 }
					 else if(status==1 && lsbCode==eqpFeature){
						 $("#conditionEqptFeatureSelLst option:last").remove();
						 changed = 0;
				         alert("Equipment feature is already in List ");
					 }
                 }
				 );

				 if(changed == 1){
					 somethingChanged=true;
				 }
			  }
			else if(lsbCode==null || lsbCode==''){
				 alert("Please enter a value");
			}
			else {
				  alert("No Special Characher Allowed");
				  $("#conditionEqptFeatureCode").val('');
				  return false;
			  }
			$("#conditionEqptFeatureCode").val('');
			
			}
		);
		
		
		
		
		
		/*for Address Role*/
		
		$('#shipperAroleMovementFrom').click(function(){
			if($("#conditionShipperAroleText").val()==""){
				alert("Shipper address role is required ");
			}
			else{
				
			var value =$("#conditionShipperAroleText").val();
			var Code =$("#conditionShipperAroleTextHidden").val();
			 $('#shipperAroleSelectedList')
	          .append($('<option>', {style:"color:blue",  value : Code })
	          .text(value )); 
			 $('#conditionShipperAroleText').val("");
			 somethingChanged=true;
		}}
		);
	/*
		$('#cldLoadSeviceTo1').click(function(){
			if($("#conditionLoadDischargeSelectedLoadServiceToList").val()!="")
			 somethingChanged=true; 
			
		});
		$('#cldDischargeServiceTo1').click(function(){
			
			 somethingChanged=true; 
			
		});
		$('#cldServicePairTo1').click(function(){
			
			 somethingChanged=true; 
			
		});
		*/
		
		$('#equipmentFeatureto1').click(function(){
		$("#conditionEqptFeatureSelLst option:selected").each(function() {
			
			  var lsbText = $(this).text();
			  var lsbTextRemove = lsbText.split(" ");
			  if(lsbTextRemove[1]=='LSB'){
				 alert('User chould not be able to remove LSB Code by Equipment remove control');
				 $('#conditionEqptFeatureSelLst')
		          .append($('<option>', {style:"color:blue" , value : lsbCode })
		          .text(lsbText)); 
			  }
			});
		});
		
		$('#consigneeAroleMovementFrom').click(function(){
			if($("#conditionConsigneeAroleText").val()==""){
				alert("Consignee address role is required ");
			}
			else{
			var value =$("#conditionConsigneeAroleText").val();
			var Code =$("#conditionConsigneeAroleTextHidden").val();
			 $('#consigeeAroleSelectedList')
	          .append($('<option>', {style:"color:blue", value : Code })
	          .text(value )); 
			 $('#conditionConsigneeAroleText').val("");
			 somethingChanged=true; 
			}
			
			 
		}
		);
		
		$('#debitorAroleSelectedFrom').click(function(){
			if($("#conditionDebitorAroleText").val()==""){
				alert("Debitor address Role is required ");
			}
			else{

			var value =$("#conditionDebitorAroleText").val();
			var Code =$("#conditionDebitorAroleTextHidden").val();
			 $('#debitorAroleSelectedList')
	          .append($('<option>',{style:"color:blue", value : Code })
	          .text(value )); 
			 $('#conditionDebitorAroleText').val("");
			 somethingChanged=true;
		}}
		);
		
		$('#fromRateImage').click(function(){
			
			var groupTypeCode = $('#formGroup_type_Drop_down').val();
			var groupSourceCode = $('#fromTariffServiceSourceCode').val();
			var groupName = $('#fromTariffServiceGroupName').val();
			var itemName = $('#fromItem').val();
			submiturl=_context +"/cas/conditionFromRateDesriptionSearch.do?";
			submitdata="groupTypeCode="+groupTypeCode+"&groupCode="+groupName+"&sourceCode="+groupSourceCode+"&itemCode="+itemName+"&fromCondition="+true;
			var actionUrl=submiturl+submitdata;
			
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'CustomerSearch', windowStyle);
			
		});

		
		$('#toRateImage').click(function(){
			
			var groupTypeCode = $('#toGroup_type_Drop_down').val();
			var groupSourceCode = $('#toTariffServiceSourceCode').val();
			var groupName = $('#toTariffServiceGroupName').val();
			var itemName = $('#toItem').val();
			submiturl=_context +"/cas/conditionToRateDesriptionSearch.do?";
			submitdata="groupTypeCode="+groupTypeCode+"&groupCode="+groupName+"&sourceCode="+groupSourceCode+"&itemCode="+itemName+"&toCondition="+true;
			var actionUrl=submiturl+submitdata;
			
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'CustomerSearch', windowStyle);
		});
		$('#shipperAroleMovementTo').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#shipperAroleSelectedList option:selected').remove();
			 somethingChanged=true;
	          
		});
		$('#consigneeAroleMovementTo').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#consigeeAroleSelectedList option:selected').remove();
			 somethingChanged=true;
	          
		});
		$('#debitorAroleSelectedTo').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#debitorAroleSelectedList option:selected').remove();
			 somethingChanged=true;
	          
		});
		
		/*for Address Role eNDS*/
	
		
		$('#movementToLsb').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#conditionEqptFeatureSelLst option:selected').remove();
	          
		}
		);
		
		///by default when page loads 
		if($("#conditionCityPortCriteriaCity").attr('checked')!='checked') {
			$("#cityPortBLoriginCityto1").attr("disabled", true);
			$("#cityPortBLoriginCityto2").attr("disabled", true);
			$("#cityPortPLDestinationCityto1").attr("disabled", true);
			$("#cityPortPLDestinationCityto2").attr("disabled", true);
			
			$("#cityPortBargeOriginto2").attr("disabled", true);
			$("#cityPortBargeOriginto1").attr("disabled", true);
			$("#cityPortBargeDestinationto2").attr("disabled", true);
			$("#cityPortBargeDestinationto1").attr("disabled", true);
		
			if(!_readonly){//D023445
				$("#cityPortoriginPortto2").removeAttr("disabled");
				$("#cityPortoriginPortto1").removeAttr("disabled");
				$("#cityPortDestinationPortto2").removeAttr("disabled");
				$("#cityPortDestinationPortto1").removeAttr("disabled");
			} else {
				//alert('disabling arrow');
				$("#cityPortoriginPortto2").attr("disabled", true);
				$("#cityPortoriginPortto1").attr("disabled", true);
				$("#cityPortDestinationPortto2").attr("disabled", true);
				$("#cityPortDestinationPortto1").attr("disabled", true);
			}
		}
		else {
			$("#cityPortBLoriginCityto1").removeAttr("disabled");
			$("#cityPortBLoriginCityto2").removeAttr("disabled");
			$("#cityPortPLDestinationCityto1").removeAttr("disabled");
			$("#cityPortPLDestinationCityto2").removeAttr("disabled");
			
			$("#cityPortBargeOriginto2").attr("disabled", true);
			$("#cityPortBargeOriginto1").attr("disabled", true);
			$("#cityPortBargeDestinationto2").attr("disabled", true);
			$("#cityPortBargeDestinationto1").attr("disabled", true);
			
			
			$("#cityPortoriginPortto2").attr("disabled", true);
			$("#cityPortoriginPortto1").attr("disabled", true);
			$("#cityPortDestinationPortto2").attr("disabled", true);
			$("#cityPortDestinationPortto1").attr("disabled", true);
		}
		
		$('#conditionCityPortCriteriaPorts').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			$("#cityPortoriginPortto1").attr("disabled", false);
			$("#cityPortoriginPortto2").attr("disabled", false);
			$("#cityPortDestinationPortto1").attr("disabled", false);
			$("#cityPortDestinationPortto2").attr("disabled", false);
			$("#cityPortBLoriginCityto1").attr("disabled", true);
			$("#cityPortBLoriginCityto2").attr("disabled", true);
			$("#cityPortPLDestinationCityto1").attr("disabled", true);
			$("#cityPortPLDestinationCityto2").attr("disabled", true);
			$("#cityPortBargeOriginto1").attr("disabled", true);
			$("#cityPortBargeOriginto2").attr("disabled", true);
			$("#cityPortBargeDestinationto1").attr("disabled", true);
			$("#cityPortBargeDestinationto2").attr("disabled", true);
			
			//$("select#conditionCityPortBLOrignCityToList").children().map(function() {selectedOriginCityToList=selectedOriginCityToList+$(this).text()+":"+ $(this).val()+";";}).get();
			//$("select#conditionCityPortBLDestinationCityToList").children().map(function() {selectedDestinationCityToList=selectedDestinationCityToList+$(this).text()+":"+ $(this).val()+";";}).get();
			
			
			  
			 /* if($('#conditionCityPortBLOriginCityInclusive').attr('checked')=="checked") {
				  originCityInclusive="I";
			  }
			  else {
				  originCityInclusive="E";
			  }
			  
			  if($('#conditionCityPortBLDestinationCityInclusive').attr('checked')=="checked") {
				  destinationCityInclusive="I";
			  }
			  else {
				  destinationCityInclusive="E";
			  }*/

			/*$('#conditionCityPortBLOrignCityToList option').each(function(index, option) {
			    $(option).remove();
			});
			$('#conditionCityPortBLDestinationCityToList option').each(function(index, option) {
			    $(option).remove();
			});*/
					
			$('#conditionCityPortCityFromList option').each(function(index, option) {
			    $(option).remove();
			});
			
			/*$('#conditionCityPortBLOriginCityInclusive').click();
			$('#conditionCityPortBLDestinationCityInclusive').click();*/
			
			$('#cities').jqGrid('setGridParam',	{ 
				url: _context + '/ports/grid',
				datatype:'json',
				page: 1
			})
			.trigger("reloadGrid");

			
		}
		);
		$('#conditionCityPortCriteriaBarge').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			$("#cityPortoriginPortto1").attr("disabled", true);
			$("#cityPortoriginPortto2").attr("disabled", true);
			$("#cityPortDestinationPortto1").attr("disabled", true);
			$("#cityPortDestinationPortto2").attr("disabled", true);
			$("#cityPortBLoriginCityto1").attr("disabled", true);
			$("#cityPortBLoriginCityto2").attr("disabled", true);
			$("#cityPortPLDestinationCityto1").attr("disabled", true);
			$("#cityPortPLDestinationCityto2").attr("disabled", true);
			$("#cityPortBargeOriginto1").attr("disabled", false);
			$("#cityPortBargeOriginto2").attr("disabled", false);
			$("#cityPortBargeDestinationto1").attr("disabled", false);
			$("#cityPortBargeDestinationto2").attr("disabled", false);
			/*$('#conditionCityPortBLOrignCityToList option').each(function(index, option) {
			    $(option).remove();
			});
			$('#conditionCityPortBLDestinationCityToList option').each(function(index, option) {
			    $(option).remove();
			});
			$('#conditionCityPortOriginPortToList option').each(function(index, option) {
			    $(option).remove();
			});
			$('#conditionCityPortDestinationPortToList option').each(function(index, option) {
			    $(option).remove();
			});*/
			
		}
		);
		$('#conditionCityPortCriteriaCity').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			$("#cityPortoriginPortto1").attr("disabled", true);
			$("#cityPortoriginPortto2").attr("disabled", true);
			$("#cityPortDestinationPortto1").attr("disabled", true);
			$("#cityPortDestinationPortto2").attr("disabled", true);
			$("#cityPortBLoriginCityto1").attr("disabled", false);
			$("#cityPortBLoriginCityto2").attr("disabled", false);
			$("#cityPortPLDestinationCityto1").attr("disabled", false);
			$("#cityPortPLDestinationCityto2").attr("disabled", false);
			$("#cityPortBargeOriginto1").attr("disabled", true);
			$("#cityPortBargeOriginto2").attr("disabled", true);
			$("#cityPortBargeDestinationto1").attr("disabled", true);
			$("#cityPortBargeDestinationto2").attr("disabled", true);
			
			
			$('#cities').jqGrid('setGridParam',	{ 
					url: _context + '/cities/grid',
					datatype:'json',
					page: 1
				})
				.trigger("reloadGrid");
			
			
			
			/*if(selectedOriginCityToList!="") {
				var codeValueArray=selectedOriginCityToList.split(";");
				for(var index=0;index<codeValueArray.length;index++) {
					var codeValue=codeValueArray[index].split(":");
					if(codeValue.length==2) {
						$('#conditionCityPortBLOrignCityToList').append($('<option>', {style : "color:blue",value : codeValue[1]}).text(codeValue[0]));
					}
				}
			}
			
			if(selectedDestinationCityToList!="") {
				var codeValueArray=selectedDestinationCityToList.split(";");
				for(var index=0;index<codeValueArray.length;index++) {
					var codeValue=codeValueArray[index].split(":");
					if(codeValue.length==2) {
						$('#conditionCityPortBLDestinationCityToList').append($('<option>', {style : "color:blue",value : codeValue[1]}).text(codeValue[0]));
					}
				}
			}
			
			selectedOriginCityToList="";
			selectedDestinationCityToList="";*/
			
			  
			/*if(originCityInclusive=="I" || originCityInclusive=="") {
				  $('#conditionCityPortBLOriginCityInclusive').click();
			  }
			  else {
				  $('#conditionCityPortBLOriginCityExclusive').click();
			  }
			  
			  if(destinationCityInclusive=="I" || destinationCityInclusive=="") {
				  $('#conditionCityPortBLDestinationCityInclusive').click();
			  }
			  else {
				  $('#conditionCityPortBLDestinationCityExclusive').click();
			  }*/
			  
			  /*originCityInclusive="";
			  destinationCityInclusive="";*/
			
			//$('#conditionCityPortBLDestinationCityToList').append($('<option>', {style : "color:blue",value : cityCode}).text(cityName));
			
		}
		);
		
		
		
		/*for disabling screenin edit mode*/
		var _prefDate= document.getElementById('prefDateSessionVar').value;
		var parentEffectiveDate= document.getElementById('parentEffectiveDate').value;
		var parentExpDate= document.getElementById('parentExpDate').value;
		var _pageMode;
		var err = document.getElementById('errorMsgDiv');		
		if(this.forms[0].tariffConditionId.value!="" ){
			$("#formGroup_type_Drop_down").attr("disabled", true);
			$("#fromTariffServiceSourceCode").attr("disabled", true);
			$("#fromTariffServiceGroupName").attr("disabled", true);
			$("#fromItem").attr("disabled", true);
			$("#fromRate").attr("disabled", true);
			$("#toGroup_type_Drop_down").attr("disabled", true);
			
			$("#toTariffServiceSourceCode").attr("disabled", true);
			$("#toTariffServiceGroupName").attr("disabled", true);
			$("#toItem").attr("disabled", true);
			$("#toRate").attr("disabled", true);
		    _pageMode = "EDIT";
		}
		else{
				if (($(document).getUrlParam("screenName"))!= 'wharfage' && ($(document).getUrlParam("screenName"))!= 'drayage') {
					//$("#effectiveDate").datepicker('setDate',parentEffectiveDate);
					$("#effectiveDate").datepicker('setDate',_prefDate);
					$("#expirationDate").datepicker('setDate',parentExpDate);
				}
		}
		 $('#saveCondition').click(function(){
			
			 //Added for defect D017809
			 var index = 1;
			 var active = '';
			 $("#accordionState").val('');
			 while (index <= 10){
				 active = $('#conditionAccordians'+index).children('h3').hasClass('ui-state-active');
				 if(active == true){
					 $("#accordionState").val( $("#accordionState").val() + '$$conditionAccordians' + index);	 
				 }
				 index ++;
			 }
			 
			 if(_pageMode=="EDIT"){
			 if(somethingChanged==true){
				
                       if(!$("#tariffConditonForm").validationEngine('validate') || !validateRangeFieldsOnSave() ){
                    	   return;
                       }
                       else{
                    	   captureSelectedOptions();
                    	   submitAllSelect();
                    	   var flag=true;
                    	   flag=validateCheckBox();
          				   if(flag!=null && !flag)
          					 {
          					 return false;
          			        } else{
			 				
			 				$("#tariffConditonForm").attr("action", "createOrUpdateTariffCondition");
			 				document.getElementById("somethingChangedAndSaved").value="true";
			 				document.getElementById("descriptionValueChangedAndSaved").value=1;
			 	        	$("#tariffConditonForm").submit();
          			     }
                       }
			 }
			 else{
			 	alert("No fields have changed. Cannot update");
			 }}
			 else{
				 if(!$("#tariffConditonForm").validationEngine('validate') || !validateRangeFieldsOnSave() ){
					 return;
				 }else{
					 	captureSelectedOptions();
					 	submitAllSelect();
					 	var flag=true;
					 	flag=validateCheckBox();
  				   if(flag!=null && !flag)
  					 {
  					 return false;
  			        } else{
  			        	
		 				$("#tariffConditonForm").attr("action", "createOrUpdateTariffCondition");
		 	        	$("#tariffConditonForm").submit();
  			        }
		 	    	}}
			 });


		$('#conditionBookingNewCheckBox').click(function(){
		 	if($('#conditionBookingNewCheckBox').is(':checked')){
				$('#conditionBookingMessageCode').attr("readonly",false);
				$('#conditionBookingMessageArea').attr("readonly",false);

			}
			else{
				$('#conditionBookingMessageCode').attr("readonly",true);
				$('#conditionBookingMessageArea').attr("readonly",true);
				$('#conditionBookingMessageCode').val("");
				$('#conditionBookingMessageArea').val("");
			}
		});
		$('#conditionBillingNewCheckBox').click(function(){
			
			if($('#conditionBillingNewCheckBox').is(':checked')){
				$('#conditionBillingMessageCode').attr("readonly",false);
				$('#conditionBillingMessageArea').attr("readonly",false);

			}
			else{
				$('#conditionBillingMessageCode').attr("readonly",true);
				$('#conditionBillingMessageArea').attr("readonly",true);
				$('#conditionBillingMessageCode').val("");
				$('#conditionBillingMessageArea').val("");

			}
		});
		$('#conditionQuoteNewCheckBox').click(function(){
			
			if($('#conditionQuoteNewCheckBox').is(':checked')){
				$('#conditionQuoteMessageCode').attr("readonly",false);
				$('#conditionQuoteMessageArea').attr("readonly",false);

			}
			else{
				$('#conditionQuoteMessageCode').attr("readonly",true);
				$('#conditionQuoteMessageArea').attr("readonly",true);
				$('#conditionQuoteMessageCode').val("");
				$('#conditionQuoteMessageArea').val("");
			}
		});
		
		
		$.fn.gatesPopUpSearch.defaults.imagePath = _context+"/resources/images/";
		$('#conditionShipperAroleText').gatesPopUpSearch({func:function() {arolePopupSearchFormCondition("02");}});
		$('#conditionConsigneeAroleText').gatesPopUpSearch({func:function() {arolePopupSearchFormCondition("03");}});
		$('#conditionDebitorAroleText').gatesPopUpSearch({func:function() {arolePopupSearchFormCondition("01");}});
		$('#conditionOrgText').gatesPopUpSearch({func:function() {orgPopupSearchFormCondition()}});
		
		/*$('#conditionShipperAroleImage').click(function(){
				arolePopupSearchFormCondition("02");
			}
		);
		
		
		$('#conditionConsigneeAroleImage').click(function(){
				arolePopupSearchFormCondition("03");
			
		});

		$('#conditionDebitorAroleImage').click(function(){
				arolePopupSearchFormCondition("01");
		});*/
		
		$('#ieRangegreaterThan').attr("disabled","disabled");
    	$('#ieRangeLesserthan').attr("disabled","disabled");
    	
    	$('#ieRangegreaterThan2').attr("disabled","disabled");
    	$('#ieRangeLesserthan2').attr("disabled","disabled");
    	
    	$('#ieRangegreaterThan3').attr("disabled","disabled");
    	$('#ieRangeLesserthan3').attr("disabled","disabled");
    	
    	$('#ieRangegreaterThan4').attr("disabled","disabled");
    	$('#ieRangeLesserthan4').attr("disabled","disabled");
    	
    	$('#ieRangegreaterThan5').attr("disabled","disabled");
    	$('#ieRangeLesserthan5').attr("disabled","disabled");
    	
    	$('#conditionShipperAroleImage').mouseover(function(){
    		$('#conditionShipperAroleImage').css('cursor', 'pointer');
    		
    		}); 
    	$('#conditionConsigneeAroleImage').mouseover(function(){
    		$('#conditionConsigneeAroleImage').css('cursor', 'pointer');
    		
    		}); 
    	$('#conditionDebitorAroleImage').mouseover(function(){
    		$('#conditionDebitorAroleImage').css('cursor', 'pointer');
    		
    		}); 
    	
    	
//		$('#ieRangeType1').change(function() {
//	        var ieRangeType = $(this).val();
//           if(ieRangeType!="."){
//        	 	 $('#ieRangegreaterThan').removeAttr("disabled");
//        	 	 $('#ieRangeLesserthan').removeAttr("disabled");
//        	  }
//           else
//        	   {
//        	   $('#ieRangegreaterThan').attr("disabled","disabled");
//               $('#ieRangeLesserthan').attr("disabled","disabled");
//        	   }
//        	   
//	    });
//		
//		$("#ieRangeType2").change(function() {
//	        var ieRangeType = $(this).val();
//           if(ieRangeType!="."){
//        	 	 $('#ieRangegreaterThan2').removeAttr("disabled");
//        	 	 $('#ieRangeLesserthan2').removeAttr("disabled");
//           }
//           else
//        	   {
//        	   $('#ieRangegreaterThan2').attr("disabled","disabled");
//               $('#ieRangeLesserthan2').attr("disabled","disabled");
//        	   }
//        	   
//	    });
//		
//		
//		$("#ieRangeType3").change(function() {
//	        var ieRangeType = $(this).val();
//           if(ieRangeType!="."){
//        	 	 $('#ieRangegreaterThan3').removeAttr("disabled");
//        	 	 $('#ieRangeLesserthan3').removeAttr("disabled");
//           }
//           else
//        	   {
//        	   $('#ieRangegreaterThan3').attr("disabled","disabled");
//               $('#ieRangeLesserthan3').attr("disabled","disabled");
//        	   }
//        	   
//	    });
//		
//		
//		$("#ieRangeType4").change(function() {
//	        var ieRangeType = $(this).val();
//           if(ieRangeType!="."){
//        	 	 $('#ieRangegreaterThan4').removeAttr("disabled");
//        	 	 $('#ieRangeLesserthan4').removeAttr("disabled");
//           }
//           else
//        	   {
//        	   $('#ieRangegreaterThan4').attr("disabled","disabled");
//               $('#ieRangeLesserthan4').attr("disabled","disabled");
//        	   }
//        	   
//	    });
//		
//		$("#ieRangeType5").change(function() {
//	        var ieRangeType = $(this).val();
//           if(ieRangeType!="."){
//        	 	 $('#ieRangegreaterThan5').removeAttr("disabled");
//        	 	 $('#ieRangeLesserthan5').removeAttr("disabled");
//           }
//           else
//        	   {
//        	   $('#ieRangegreaterThan5').attr("disabled","disabled");
//               $('#ieRangeLesserthan5').attr("disabled","disabled");
//        	   }
//        	   
//	    });
		
/*		$('#conditionOrgTextImage').click(function(){
				orgPopupSearchFormCondition();
		});*/
		
		$('#moveShipperOrgTo2').click(function(){
			if(($("#conditionOrgText").val()=="")){
				alert("Organization is required");
				}
		else{
			var value =$("#conditionOrgText").val();
			var Code =$("#conditionOrgTextHidden").val();
			 $('#shipperOrganizationToList')
	          .append($('<option>',{style:"color:blue" ,  value : Code })
	          .text(value )); 
			 $('#conditionOrgText').val("");
			 somethingChanged = true; 
			 
		}}
		);
		
		$('#moveConsigneeOrgTo2').click(function(){
			if(($("#conditionOrgText").val()=="")){
				alert("Organization is required");	}
			else{
				var value =$("#conditionOrgText").val();
				var Code =$("#conditionOrgTextHidden").val();
				 $('#consigneeOrganizationToList')
		          .append($('<option>', {style:"color:blue", value : Code })
		          .text(value )); 
				 $('#conditionOrgText').val("");
				 somethingChanged = true; 
			}}
			);
		
		$('#moveDebitorOrgTo2').click(function(){
			if(($("#conditionOrgText").val()=="")){
				alert("Organization is required");
					}
			else{
				
				var value =$("#conditionOrgText").val();
				var Code =$("#conditionOrgTextHidden").val();
				 $('#debitorOrganizationToList')
		          .append($('<option>', {style:"color:blue" , value : Code })
		          .text(value )); 
				 $('#conditionOrgText').val("");
				 somethingChanged = true; 

			}}
			);		
		$('#moveShipperOrgTo1').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#shipperOrganizationToList option:selected').remove();
			 somethingChanged = true; 
	          
		});
		$('#moveConsigneeOrgTo1').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#consigneeOrganizationToList option:selected').remove();
			 somethingChanged = true; 
	          
		});
		$('#moveDebitorOrgTo1').click(function(){
			/*var lsbCode =$("#conditionEqptFeatureCode").val();*/
			 $('#debitorOrganizationToList option:selected').remove();
			 somethingChanged = true; 
	          
		});
		
		// validation for range Tab//
		if (document.getElementById("ieRangeType1").selectedIndex == 0 )
		{
			$('#ieRangegreaterThan').attr("disabled" , true);
			$('#ieRangeLesserthan').attr("disabled" , true);
		}
		else{
			$('#ieRangegreaterThan').attr("disabled" , false);
			$('#ieRangeLesserthan').attr("disabled" , false);

		}
		if (document.getElementById("ieRangeType2").selectedIndex == 0 )
		{
			$('#ieRangegreaterThan2').attr("disabled" , true);
			$('#ieRangeLesserthan2').attr("disabled" , true);
		}
		else{
			$('#ieRangegreaterThan2').attr("disabled" , false);
			$('#ieRangeLesserthan2').attr("disabled" , false);

		}
		if (document.getElementById("ieRangeType3").selectedIndex == 0 )
		{
			$('#ieRangegreaterThan3').attr("disabled" , true);
			$('#ieRangeLesserthan3').attr("disabled" , true);
		}
		else{
			$('#ieRangegreaterThan3').attr("disabled" , false);
			$('#ieRangeLesserthan3').attr("disabled" , false);

		}
		if (document.getElementById("ieRangeType4").selectedIndex == 0 )
		{
			$('#ieRangegreaterThan4').attr("disabled" , true);
			$('#ieRangeLesserthan4').attr("disabled" , true);
		}
		else{
			$('#ieRangegreaterThan4').attr("disabled" , false);
			$('#ieRangeLesserthan4').attr("disabled" , false);

		}
		if (document.getElementById("ieRangeType5").selectedIndex == 0 )
		{
			$('#ieRangegreaterThan5').attr("disabled" , true);
			$('#ieRangeLesserthan5').attr("disabled" , true);
		}
		else{
			$('#ieRangegreaterThan5').attr("disabled" , false);
			$('#ieRangeLesserthan5').attr("disabled" , false);

		}
		var errDiv=$('#errorMsgDiv').val();
//		$('#range1UnitOfMeasureCode').attr("disabled" , true);
//		$('#range2UnitOfMeasureCode').attr("disabled" , true);
//		$('#range3UnitOfMeasureCode').attr("disabled" , true);
//		$('#range4UnitOfMeasureCode').attr("disabled" , true);
//		$('#range5UnitOfMeasureCode').attr("disabled" , true);

		$('#ieRangeType1').change(function(){
	     //   var ieRangeType = $(this).val();
			var rangeType=$('#ieRangeType1 :selected').text();
			$('#range1UnitOfMeasureCode').attr("disabled" , false);
			
           if(document.getElementById("ieRangeType1").selectedIndex == 0 ){
        	   	 $('#ieRange1').val("");
	        	 $('#ieRangegreaterThan').val('');
        	   	 $('#ieRangeLesserthan').val('');
        	   	$('#range1UnitOfMeasureCode').children().remove();
        	  }
           else
        	   {
	        	   $('#ieRangegreaterThan').attr("disabled" , false);
	               $('#ieRangeLesserthan').attr("disabled" , false);
                     $('#ieRangegreaterThan').val('0');
                     $('#ieRangeLesserthan').val('0');
                     blockUI();
	               var count=0;
	               $.ajax({
	   				   type: "POST",
	   				   url: _context +"/condition/loadUOMTypes",
	   				   data: {		 		 
	   					   rangeType: rangeType,
	   					   type:"1"
	   				   },
	   				   success: function(responseText){
	   					   $('#range1UnitOfMeasureCode').children().remove();
	   					   $.each(responseText.data.uomTypList,function(){
	   						   $('#range1UnitOfMeasureCode')
	   					          .append($('<option>', { value : responseText.data.uomTypList[count].code })
	   					          .text(responseText.data.uomTypList[count].description)); 
	   						   count++;
	   					   });
	   					   $.unblockUI();
	   				   }
	   				   });
        	   }
		});
		$('#ieRangeType2').change(function(){
			$('#range2UnitOfMeasureCode').attr("disabled" , false);
			var rangeType=$('#ieRangeType2 :selected').text();
			if (document.getElementById("ieRangeType2").selectedIndex == 0 )
			{
				$('#ieRange2').val("");
				$("#ieRangegreaterThan2").val('');
				$("#ieRangeLesserthan2").val('');
			 	$('#range2UnitOfMeasureCode').children().remove();
			}
			else
			{
				$('#ieRangegreaterThan2').attr("disabled" , false);
				$('#ieRangeLesserthan2').attr("disabled" , false);
				$("#ieRangegreaterThan2").val('0');
                $("#ieRangeLesserthan2").val('0');
                blockUI();
				var count=0;
				$.ajax({
					   type: "POST",
					   url: _context +"/condition/loadUOMTypes",
					   data: {		 		 
						   rangeType: rangeType,
						   type:"2"
					   },
					   success: function(responseText){
						   $('#range2UnitOfMeasureCode').children().remove();
						   $.each(responseText.data.uomTypList,function(){

							   $('#range2UnitOfMeasureCode')
						          .append($('<option>', { value : responseText.data.uomTypList[count].code })
						          .text(responseText.data.uomTypList[count].description)); 
							   count++;
						   });
						   $.unblockUI();
					   }
					   });
			}

			});

		$('#ieRangeType3').change(function(){
			$('#range3UnitOfMeasureCode').attr("disabled" , false);
			var rangeType=$('#ieRangeType3 :selected').text();
			if (document.getElementById("ieRangeType3").selectedIndex == 0 )
			{
				$('#ieRange3').val("");
				$("#ieRangegreaterThan3").val('');
				$("#ieRangeLesserthan3").val('');
			 	$('#range3UnitOfMeasureCode').children().remove();
			}
			else{
				$('#ieRangegreaterThan3').attr("disabled" , false);
				$('#ieRangeLesserthan3').attr("disabled" , false);
				$("#ieRangegreaterThan3").val('0');
                $("#ieRangeLesserthan3").val('0');
                blockUI();
				var count=0;
				$.ajax({
					   type: "POST",
					   url: _context +"/condition/loadUOMTypes",
					   data: {		 		 
						   rangeType: rangeType,
						   type:"3"
					   },
					   success: function(responseText){
						   $('#range3UnitOfMeasureCode').children().remove();
						   $.each(responseText.data.uomTypList,function(){

							   $('#range3UnitOfMeasureCode')
						          .append($('<option>', { value : responseText.data.uomTypList[count].code })
						          .text(responseText.data.uomTypList[count].description)); 
							   count++;
						   });
						   $.unblockUI();
					   }
					   });
			}
			});

		$('#ieRangeType4').change(function(){
			var rangeType=$('#ieRangeType4 :selected').text();
			$('#range4UnitOfMeasureCode').attr("disabled" , false);
			
			if (document.getElementById("ieRangeType4").selectedIndex == 0 )
			{
				$('#ieRange4').val("");
				$("#ieRangegreaterThan4").val('');
				$("#ieRangeLesserthan4").val('');
			 	$('#range4UnitOfMeasureCode').children().remove();
			}
			else{
				$('#ieRangegreaterThan4').attr("disabled" , false);
				$('#ieRangeLesserthan4').attr("disabled" , false);
				$("#ieRangegreaterThan4").val('0');
                $("#ieRangeLesserthan4").val('0');
                blockUI();
				var count=0;
				$.ajax({
					   type: "POST",
					   url: _context +"/condition/loadUOMTypes",
					   data: {		 		 
						   rangeType: rangeType,
						   type:"4"
					   },
					   success: function(responseText){
						   $('#range4UnitOfMeasureCode').children().remove();
						   $.each(responseText.data.uomTypList,function(){

							   $('#range4UnitOfMeasureCode')
						          .append($('<option>', { value : responseText.data.uomTypList[count].code })
						          .text(responseText.data.uomTypList[count].description)); 
							   count++;
						   });
						   $.unblockUI();
					   }
					   });
			}
			});

		$('#ieRangeType5').change(function(){
			
			var rangeType=$('#ieRangeType5 :selected').text();
			$('#range5UnitOfMeasureCode').attr("disabled" , false);
			if (document.getElementById("ieRangeType5").selectedIndex == 0 )
			{
				$('#ieRange5').val("");
				$("#ieRangegreaterThan5").val('');
				$("#ieRangeLesserthan5").val('');
			 	$('#range5UnitOfMeasureCode').children().remove();
			}
			else{
				$('#ieRangegreaterThan5').attr("disabled" , false);
				$('#ieRangeLesserthan5').attr("disabled" , false);
				$("#ieRangegreaterThan5").val('0');
                $("#ieRangeLesserthan5").val('0');
                blockUI();
				var count=0;
				$.ajax({
					   type: "POST",
					   url: _context +"/condition/loadUOMTypes",
					   data: {		 		 
						   rangeType: rangeType,
						   type:"5"
					   },
					   success: function(responseText){
						   $('#range5UnitOfMeasureCode').children().remove();
						   $.each(responseText.data.uomTypList,function(){
							   $('#range5UnitOfMeasureCode')
						          .append($('<option>', { value : responseText.data.uomTypList[count].code })
						          .text(responseText.data.uomTypList[count].description)); 
							   count++;
						   });
						   $.unblockUI();
					   }
					   });
				}
			});
		
//		$('#ieRangegreaterThan').keyup(function() {
//			  if(ieRangegreaterThan==0)
//			  {
//			  validateGreaterThenRangeFieldsOnChange();
//			  $("#ieRangegreaterThan").val('');
//			  return;
//			//  alert("Zero is not allowed");
//			  }
//		});
		
			$('#ieRangegreaterThan').blur(function() {
				  var ieRangegreaterThan =$("#ieRangegreaterThan").val();
				  ieRangegreaterThan= ieRangegreaterThan.replace(/\+/g, "");
				  $("#ieRangegreaterThan").val(ieRangegreaterThan);
//				  if(ieRangegreaterThan==0)
//				  {
//					//$("#ieRangegreaterThan").val('');  
//					$('#ieRangegreaterThan').validationEngine('showPrompt', 'Greater Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//				  	
//				  }
				  if(ieRangegreaterThan==null || isNaN(ieRangegreaterThan)) {
					  $('#ieRangegreaterThan').val('')
					 }
			});

			$('#ieRangeLesserthan').blur(function() {
				  var ieRangegreaterThan =parseInt($("#ieRangegreat	erThan").val());
				  var ieRangeLesserthan =parseInt($("#ieRangeLesserthan").val());
				   $("#ieRangeLesserthan").val(ieRangeLesserthan);
//				   if(ieRangeLesserthan==0) {
//					   $('#ieRangeLesserthan').validationEngine('showPrompt', 'Less Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					  	//$("#ieRangeLesserthan").val('');
//					 }
				   if(ieRangeLesserthan==null || isNaN(ieRangeLesserthan)) {
					  
					  	$("#ieRangeLesserthan").val('');
					 }
				  else if(ieRangegreaterThan > ieRangeLesserthan)
					  {
					  alert("'Greater Than' range value must be less than or equal to the corresponding 'Less Than' range value");
					  //$("#ieRangeLesserthan").val('');
					  return false;
					  }
			});
			
			$('#ieRangegreaterThan2').blur(function() {
				  var ieRangegreaterThan =$("#ieRangegreaterThan2").val();
				  ieRangegreaterThan= ieRangegreaterThan.replace(/\+/g, "");
				  $("#ieRangegreaterThan2").val(ieRangegreaterThan);
				  
//				  if(ieRangegreaterThan==0)
//				  {
//					  $('#ieRangegreaterThan2').validationEngine('showPrompt', 'Greater Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					  //$("#ieRangegreaterThan2").val('')
				//  }
				  if(ieRangegreaterThan==null || isNaN(ieRangegreaterThan)) {
					  $('#ieRangegreaterThan2').val('')
					 }
			});
			
			$('#ieRangeLesserthan2').blur(function() {
				 var ieRangegreaterThan =parseInt($("#ieRangegreaterThan2").val());
				 var ieRangeLesserthan =parseInt($("#ieRangeLesserthan2").val());
				  $("#ieRangeLesserthan2").val(ieRangeLesserthan);
//				  if( ieRangeLesserthan==0) {
//					   $('#ieRangeLesserthan2').validationEngine('showPrompt', 'Less Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					   //$("#ieRangeLesserthan2").val('')
//					 }
				   if(ieRangeLesserthan==null || isNaN(ieRangeLesserthan)) {
					   
					   $("#ieRangeLesserthan2").val('')
					 }
				  else if(ieRangegreaterThan > ieRangeLesserthan)
					  {
					  alert("'Greater Than' range value must be less than or equal to the corresponding 'Less Than' range value");
					  //$("#ieRangeLesserthan2").val('')
					  }
			});
			
			$('#ieRangegreaterThan3').blur(function() {
				  var ieRangegreaterThan =$("#ieRangegreaterThan3").val();
				  ieRangegreaterThan= ieRangegreaterThan.replace(/\+/g, "");
				  $("#ieRangegreaterThan3").val(ieRangegreaterThan);
//				  if(ieRangegreaterThan==0)
//					  {
//					  $('#ieRangegreaterThan3').validationEngine('showPrompt', 'Greater Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					  //$("#ieRangegreaterThan3").val('')
//					  }
				  if(ieRangegreaterThan==null || isNaN(ieRangegreaterThan)) {
					  $('#ieRangegreaterThan3').val('')
					 }
			});
			
			$('#ieRangeLesserthan3').blur(function() {
				  var ieRangegreaterThan =parseInt($("#ieRangegreaterThan3").val());
				  var ieRangeLesserthan =parseInt($("#ieRangeLesserthan3").val());
				  $("#ieRangeLesserthan3").val(ieRangeLesserthan);
//				  if(ieRangeLesserthan==0) {
//					  $('#ieRangeLesserthan3').validationEngine('showPrompt', 'Less Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					  //$("#ieRangeLesserthan3").val('')
//					 }
				  if(ieRangeLesserthan==null || isNaN(ieRangeLesserthan)) {
					  $("#ieRangeLesserthan3").val('')
					 }
				  else if(ieRangegreaterThan > ieRangeLesserthan)
					  {
					  alert("'Greater Than' range value must be less than or equal to the corresponding 'Less Than' range value");
					  //$("#ieRangeLesserthan3").val('')
					  }
			});
			
			$('#ieRangegreaterThan4').blur(function() {
				  var ieRangegreaterThan =$("#ieRangegreaterThan4").val();
				  ieRangegreaterThan= ieRangegreaterThan.replace(/\+/g, "");
				  $("#ieRangegreaterThan4").val(ieRangegreaterThan);
//				  if(ieRangegreaterThan==0)
//					  {
//						$('#ieRangegreaterThan4').validationEngine('showPrompt', 'Greater Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					    //$("#ieRangegreaterThan4").val('')
//					  }
				  if(ieRangegreaterThan==null || isNaN(ieRangegreaterThan)) {
					  $('#ieRangegreaterThan4').val('')
					 }
			});
			
			$('#ieRangeLesserthan4').blur(function() {
				  var ieRangegreaterThan =parseInt($("#ieRangegreaterThan4").val());
				  var ieRangeLesserthan =parseInt($("#ieRangeLesserthan4").val());
				  $("#ieRangeLesserthan4").val(ieRangeLesserthan);
//				  if(ieRangeLesserthan==0) {
//					   $('#ieRangeLesserthan4').validationEngine('showPrompt', 'Less Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					   //$("#ieRangeLesserthan4").val('')
//					 }
				  if(ieRangeLesserthan==null || isNaN(ieRangeLesserthan)) {
					   $("#ieRangeLesserthan4").val('')
					 }
				  else if(ieRangegreaterThan > ieRangeLesserthan)
					  {
					  alert("'Greater Than' range value must be less than or equal to the corresponding 'Less Than' range value");
					  //$("#ieRangeLesserthan4").val('')
					  }
			});
			
			$('#ieRangegreaterThan5').blur(function() {
				  var ieRangegreaterThan =$("#ieRangegreaterThan5").val();
				  ieRangegreaterThan= ieRangegreaterThan.replace(/\+/g, "");
				  $("#ieRangegreaterThan5").val(ieRangegreaterThan);
//				  if(ieRangegreaterThan==0)
//					  {
//					  $('#ieRangegreaterThan5').validationEngine('showPrompt', 'Greater Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					  //$("#ieRangegreaterThan5").val('')
//					  }
				  if(ieRangegreaterThan==null || isNaN(ieRangegreaterThan)) {
					  $('#ieRangegreaterThan5').val('')
					 }
			});
			
			$('#ieRangeLesserthan5').blur(function() {
				 var ieRangegreaterThan =parseInt($("#ieRangegreaterThan5").val());
				 var ieRangeLesserthan =parseInt($("#ieRangeLesserthan5").val());
				 $("#ieRangeLesserthan5").val(ieRangeLesserthan);
//				  if(ieRangeLesserthan==0) {
//					   $('#ieRangeLesserthan5').validationEngine('showPrompt', 'Less Than Amount Should Be Greater Than Zero', 'error', 'topRight', true);  
//					   //$("#ieRangeLesserthan5").val('')
//				  } 
				  if(ieRangeLesserthan==null || isNaN(ieRangeLesserthan)) {
					   $("#ieRangeLesserthan5").val('')
					 }
				  else if(ieRangegreaterThan > ieRangeLesserthan)
					  {
					  alert("'Greater Than' range value must be less than or equal to the corresponding 'Less Than' range value");
					  //$("#ieRangeLesserthan5").val('')
					  }
			});
//			
			$('#tariffConditonForm').submit(function() {
			    var form = document.getElementById("tariffConditonForm");  
			   
			        if (FormChanges(form).length == 0 && document.getElementById("tariffConditionId")!='' ) {  
			        	 var r=confirm("No fields have changed. Cannot update (Continue or cancel)");
			         
			        if (r==true)
			  		  {
			            	 return true;  
			  		  }  
			        else
			        {
			        	document.location.href = _context + '/cas/tariffConditionSearch.do';
			        	return false;
			        }
			      }
		     });
	
		//History popup	
		var historyArgs = {
				
				entityId: this.forms[0].tariffConditionId.value,
				entity: 'com.matson.gates.tm.condition.domain.TariffCondition'
			};
		$("#history_link").history(historyArgs);
		
		
		
	/*	$("#expirationDate").change(function() { 
			if(_pageMode=="EDIT"){
			if(this.value !=this.oldvalue){
				somethingChanged = true;
			}
			}
		});*/

		var oldDescription=$('#description').val();
	 	$('#description').change(function() {
			 var description=$('#description').val();
			$('#description').val(trim(description));
			var newDescription=trim(description);
			
			 if(oldDescription!=newDescription)
				 {
				 	somethingChanged = true;
				 }
			 else
				 {
				 	somethingChanged = false;
				 }
		 });
	 	
	 	$("#toGroup_type_Drop_down").change(function() {
	 		$("#toTariffServiceSourceCode").val("");
	 		$("#toTariffServiceGroupName").val("");
	 		$("#toItem").val("");
	 		$("#toRate").val("");
 		
	 	});

	 	 var autocompleteURL = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
         $('#conditionOrgText').gatesAutocomplete({
                source: autocompleteURL,
                mustMatch:false,
                formatItem: function(data) {
                    return data.name;
                },
                formatResult: function(data) {
                    return data.name;
                },
                select: function(data) {
                    $('#conditionOrgTextHidden').val(data.id);
                }
            })
            .change(function() {
                if($('#conditionOrgText').val()=='') {
                        $('#conditionOrgTextHidden').val('');
                    }
            });

            $('#conditionOrgText').blur(function(){
                if($('#conditionOrgText').val() == '') {
                    $('#conditionOrgTextHidden').val('');
                    $('#conditionOrgText').val('');
                }
            });
		
            
   	 	 var autocompleteURL = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
         $('#conditionConsigneeAroleText').gatesAutocomplete({
                source: autocompleteURL,
                mustMatch:false,
                formatItem: function(data) {
                    return data.name;
                },
                formatResult: function(data) {
                    return data.name;
                },
                select: function(data) {
                    $('#conditionConsigneeAroleTextHidden').val(data.id);
                    arolePopupSearchFormCondition("03");
                }
            })
            .change(function() {
                if($('#conditionConsigneeAroleText').val()=='')
                    {
                        $('#conditionConsigneeAroleTextHidden').val('');
                    }
            });
         $('#conditionShipperAroleText').gatesAutocomplete({
             source: autocompleteURL,
             mustMatch:false,
             formatItem: function(data) {
                 return data.name;
             },
             formatResult: function(data) {
                 return data.name;
             },
             select: function(data) {
                 $('#conditionShipperAroleTextHidden').val(data.id);
                 arolePopupSearchFormCondition("02");
             }
         })
         .change(function() {
             if($('#conditionShipperAroleText').val()=='')
                 {
                     $('#conditionShipperAroleTextHidden').val('');
                 }
         });
         $('#conditionDebitorAroleText').gatesAutocomplete({
             source: autocompleteURL,
             mustMatch:false,
             formatItem: function(data) {
                 return data.name;
             },
             formatResult: function(data) {
                 return data.name;
             },
             select: function(data) {
                 $('#conditionDebitorAroleTextHidden').val(data.id);
                 arolePopupSearchFormCondition("01");
             }
         })
         .change(function() {
             if($('#conditionDebitorAroleText').val()=='')
                 {
                     $('#conditionDebitorAroleTextHidden').val('');
                 }
         });
         $("select").each(function() { 
 	        var s = this; 
 	        for (i = 0; i < s.length; i++) 
 	            s.options[i].title = s.options[i].text; 
 	        if (s.selectedIndex > -1) 
 	            s.onmousemove = function() { s.title = s.options[s.selectedIndex].text; }; 
 	    }); 
         $('#shipperAroleSelectedList').mouseover(function() {
     		 $("select").each(function() { 
     		        var s = this; 
     		        for (i = 0; i < s.length; i++) 
     		            s.options[i].title = s.options[i].innerText; 
     		        if (s.selectedIndex > -1) 
     		            s.onmousemove = function() { s.title = s.options[s.selectedIndex].innerText; }; 
     		    }); 
     	});
         $('#consigeeAroleSelectedList').mouseover(function() {
     		 $("select").each(function() { 
     		        var s = this; 
     		        for (i = 0; i < s.length; i++) 
     		            s.options[i].title = s.options[i].innerText; 
     		        if (s.selectedIndex > -1) 
     		            s.onmousemove = function() { s.title = s.options[s.selectedIndex].innerText; }; 
     		    }); 
     	});
         $('#debitorAroleSelectedList').mouseover(function() {
     		 $("select").each(function() { 
     		        var s = this; 
     		        for (i = 0; i < s.length; i++) 
     		            s.options[i].title = s.options[i].innerText; 
     		        if (s.selectedIndex > -1) 
     		            s.onmousemove = function() { s.title = s.options[s.selectedIndex].innerText; }; 
     		    }); 
     	});
         
 });
 function captureSelectedOptions(){
	 var conditionEqptFeatureSelLstValues="";
	   $("#conditionEqptFeatureSelLst").children().map(function() {
		   conditionEqptFeatureSelLstValues=conditionEqptFeatureSelLstValues+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#conditionEqptFeatureSelLstValue').val(conditionEqptFeatureSelLstValues);
	   
	   var options="";
	   $("#shipperAroleSelectedList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#selectedShipperAroleSelectedListValue').val(options);
	   
	   options="";
	   $("#consigeeAroleSelectedList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#consigeeAroleSelectedListValue').val(options);
	   
	   options="";
	   $("#debitorAroleSelectedList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#selectedDebitorAroleSelectedListValue').val(options);
	   
	   options="";
	   $("#shipperOrganizationToList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#shipperOrganizationToListValue').val(options);
	   
	   options="";
	   $("#consigneeOrganizationToList").children().map(function() {
		   options=options+$(this).val()+"|"+$(this).text()+";";
		  }).get();
	   $('#consigneeOrganizationToListValue').val(options);
	   
	   options="";
	   $("#consigneeOrganizationToList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#consigneeOrganizationToListValue').val(options);
	   
	   options="";
	   $("#debitorOrganizationToList").children().map(function() {
		   options=options+$(this).val()+","+$(this).text()+";";
		  }).get();
	   $('#debitorOrganizationToListValue').val(options);
 }
 function FormChanges(form) {

	 // get form
		if (typeof form == "string") form = document.getElementById(form);
		if (!form || !form.nodeName || form.nodeName.toLowerCase() != "form") 
		return null;

		// find changed elements
		var changed = [], n, c, def, o, ol, opt;
		for (var e = 0, 	el = form.elements.length; e < el; e++) {
			n = form.elements[e];
			c = false;


			switch (n.nodeName.toLowerCase()) {

				// select boxes
				case "select":
					def = 0;
					for (o = 0, ol = n.options.length; o < ol; o++) {
						opt = n.options[o];
						c = c || (opt.selected != opt.defaultSelected);
						if (opt.defaultSelected) def = o;
					}
					if (c && !n.multiple) c = (def != n.selectedIndex);
					break;

				// input / textarea
				case "textarea":
				case "input":

					switch (n.type.toLowerCase()) {
						case "checkbox":
						case "radio":
							// checkbox / radio
							c = (n.checked != n.defaultChecked);
							break;
						default:
							// standard values
							c = (n.value != n.defaultValue);
							break;				
					}
					break;
			}

			if (c){ 
				changed.push(n);
			}
		}

		return changed;

	}


 
 function validGrpType(){
	 var toSection = $("#displayToSection").val();
	 var toSectionGrp = $("#toGroup_type_Drop_down").val();
	 
	 if((toSection == "true")&&(toSectionGrp=="01")){
		 return "Group Type Cannot be Frieght ";
		 
	 }
	 
 }
 
 function validItem(){
	 var toSectionitem = $("#toItem").val();
	 if(toSectionitem==null || toSectionitem=="" ){
		 return "Fill select Item First";
	 }
 }
 
 function cancel(screenName){
	 
	 var descriptionChangedAndSaved = document.getElementById("descriptionValueChangedAndSaved").value;
	  
	 var tariffrmgrpType=$('#formGroup_type_Drop_down').val();
	 var tariffgrpName=$('#fromTariffServiceGroupName').val();
	 var tariffsrc=$('#fromTariffServiceSourceCode').val();
	 var item=$('#fromItem').val();	
	 var key=$('#key').val();
	 var rate='';
	 var tariffRateDescriptionId='';
	 var currentFuture=$('#isCurrentFuture').val();
	 if(key=='From'){
		 rate=$('#fromRate').val();	 
	     tariffRateDescriptionId = $('#fromRateId').val();
	 }
	 if(key=='To'){
		 rate=$('#toRate').val();	 
	     tariffRateDescriptionId = $('#toRateId').val();
	}
	 var tarifftogrpType=$('#toGroup_type_Drop_down').val();
	 var screenName = $('#screenName').val();
	 var from = $('#from').val();
	 var parentFrom = $('#parentFrom').val();
	 if(currentFuture==true || currentFuture=="true" || currentFuture=="Y"){
		 currentFuture='Y';
	 }
	 else{
		 currentFuture='N';
	 }
	 if(somethingChanged){
	 var r=confirm("All the unsaved Changes will be discarded!");
	 if (r==true)
	  {
		 if (screenName!=null && screenName=='drayage') {
			 var tariffTogrpType="04";
			var tariffgrpType="01"; 
					submiturl=_context +"/cas/rateRevenueSearch.do?";
					submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+$('#fromTariffServiceGroupName').val()+"&itemCode="+$('#fromItem').val()+"&rateId="+$('#fromRateId').val()+"&rate="+$('#fromRate').val()+"&groupToTypeCode="+ tariffTogrpType+"&screenName=drayage&currentFuture="+currentFuture+"&parentFrom="+parentFrom;
					document.location.href =submiturl+submitdata;	
			//document.location.href = _context + '/cas/rateRevenueSearch.do?currentFuture='+currentFuture;	 		 
		 }
		 else if (screenName!=null && screenName=='wharfage') {
			 document.location.href = _context + '/cas/wharfageConditionSearch.do?groupTypeCode='+tariffrmgrpType+'&sourceCode='+tariffsrc+'&groupCode='+tariffgrpName+'&itemCode='+item+'&groupToTypeCode='+tarifftogrpType+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;
		 }
		 else {
			 if(from!=null && from!=""){
				 if(tariffRateDescriptionId!=null && tariffRateDescriptionId!="" && rate!=null && rate!="" && rate!=undefined){
					 document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&rate='+encodeURIComponent(rate)+'&key='+key+'&currentFuture='+currentFuture+'&screen='+screenName+'&parentFrom='+parentFrom;				 
				 }
				 else{
					 document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&key='+key+'&currentFuture='+currentFuture+'&screen='+screenName+'&parentFrom='+parentFrom;
				 }
			 }
			 else{
				 if(tariffRateDescriptionId!=null && tariffRateDescriptionId!="" && rate!=null && rate!="" && rate!=undefined){
					 document.location.href = _context + '/cas/tariffConditionSearch.do?from=cancel&tariffRateDescriptionId='+tariffRateDescriptionId+'&rate='+encodeURIComponent(rate)+'&key='+key+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;			 
				 }
				 else{
					 document.location.href = _context + '/cas/tariffConditionSearch.do?from=cancel&key='+key+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;
				 }
			 }
		 }	
	  }
	 }
	 else{
		 if (screenName!=null && screenName=='drayage') {
			 var tariffTogrpType="04";
				var tariffgrpType="01"; 
						submiturl=_context +"/cas/rateRevenueSearch.do?";
						submitdata="groupTypeCode="+ tariffgrpType+"&sourceCode="+tariffsrc+"&groupCode="+$('#fromTariffServiceGroupName').val()+"&itemCode="+$('#fromItem').val()+"&rateId="+$('#fromRateId').val()+"&rate="+$('#fromRate').val()+"&groupToTypeCode="+ tariffTogrpType+"&screenName=drayage&currentFuture="+currentFuture+'&parentFrom='+parentFrom;
						document.location.href =submiturl+submitdata;	
				//document.location.href = _context + '/cas/rateRevenueSearch.do?currentFuture='+currentFuture;	 		 
			 }
			 else if (screenName!=null && screenName=='wharfage') {
				 document.location.href = _context + '/cas/wharfageConditionSearch.do?groupTypeCode='+tariffrmgrpType+'&sourceCode='+tariffsrc+'&groupCode='+tariffgrpName+'&itemCode='+item+'&groupToTypeCode='+tarifftogrpType+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;
			 }
			 else
			 {
				 if(from!=null && from!=""){
					 if(tariffRateDescriptionId!=null && tariffRateDescriptionId!="" && rate!=null && rate!="" && rate!=undefined){
						 document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&tariffRateDescriptionId='+tariffRateDescriptionId+'&rate='+encodeURIComponent(rate)+'&key='+key+'&currentFuture='+currentFuture+'&screen='+screenName+'&parentFrom='+parentFrom+"&somethingChangedAndSaved="+descriptionChangedAndSaved;				 
					 }
					 else{
						 document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&key='+key+'&currentFuture='+currentFuture+'&screen='+screenName+'&parentFrom='+parentFrom+"&somethingChangedAndSaved="+descriptionChangedAndSaved;
					 }
				 }
				 else{
					 if(tariffRateDescriptionId!=null && tariffRateDescriptionId!="" && rate!=null && rate!="" && rate!=undefined){
						 document.location.href = _context + '/cas/tariffConditionSearch.do?from=cancel&tariffRateDescriptionId='+tariffRateDescriptionId+'&rate='+encodeURIComponent(rate)+'&key='+key+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;				 
					 }
					 else{
						 document.location.href = _context + '/cas/tariffConditionSearch.do?from=cancel&key='+key+'&currentFuture='+currentFuture+'&parentFrom='+parentFrom;
					 }
				 }
			 }	
		  } 
 	}
 
 
 function validDate(){
	    var str1 = document.getElementById("effectiveDate").value;
	    var str2 = document.getElementById("expirationDate").value;
	    var mon1  = parseInt(str1.substring(0,2),10);
	    var dt1 = parseInt(str1.substring(3,5),10);
	    var yr1  = parseInt(str1.substring(6,10),10);
	    var mon2  = parseInt(str2.substring(0,2),10);
	    var dt2  = parseInt(str2.substring(3,5),10);
	    var yr2  = parseInt(str2.substring(6,10),10);
	    var date1 = new Date(yr1, mon1, dt1);
	    var date2 = new Date(yr2, mon2, dt2);
	    
	    if(date2<date1){
	    	return "Effective Date Cannot be more then Expiration Date";
	    }
 }
 
 function validValue(){
	
	 var str1 = document.getElementById("ieRange1").value.toUpperCase();
	 document.getElementById("ieRange1").value=str1;
	 var str2 = document.getElementById("ieRange2").value.toUpperCase();
	 document.getElementById("ieRange2").value=str2;
	 var str3 = document.getElementById("ieRange3").value.toUpperCase();
	 document.getElementById("ieRange3").value=str3;
	 var str4 = document.getElementById("ieRange4").value.toUpperCase();
	 document.getElementById("ieRange4").value=str4;
	 var str5 = document.getElementById("ieRange5").value.toUpperCase();
	 document.getElementById("ieRange5").value=str5;
	 
	 var tru = true;
	 if(str1!=""){
	 if(!(str1=="I" ||str1=="E" )){
		 return "value of Range IE can only be I or E";
	 }}
	 if(str2!=""){
	 if(!(str2=="I" ||str2=="E")){
		 return "value of Range IE can only be I or E";
	 }
	 }
	 if(str3!=""){
	 if(!(str3=="I" ||str3=="E")){
		 return "value of Range IE can only be I or E";
	 }
	 }
	 if(str4!=""){
	 if(!(str4=="I" ||str4=="E")){
		 return "value of Range IE can only be I or E";
	 }}
	 if(str5!=""){
	 if(!(str5=="I" ||str5=="E")){
		 return "value of Range IE can only be I or E";
	 }}
	 
 }
 function xCopyCondition(conditionId)
 {
	 var currentFuture=$('#isCurrentFuture').val();
	 var from = $('#from').val();
	 //D029525
	 var key=$('#key').val();
	 if(conditionId.value!=null && conditionId.value!="") {
		 	document.location.href = _context +'/xCopyCondition/showForm?tariffConditionId='+conditionId.value+"&isCurrentFuture="+currentFuture+"&from="+from+"&key="+key;
		 }
	 else{
		 alert('Please save the Condition before XCOPY')
	 }
 }
 
 
 function validRange(a,b){
	 
	 if(a>=b){
		 return "Greater then value should be always less then Less Then Value";
	 }
 }
 
 function checkForLinkCond(){
	 var screen=document.getElementById("displayToSection").value;
	 var fromGrpType=document.getElementById("formGroup_type_Drop_down").value;
	 
	 if(screen.value=true){
		 if(fromGrpType!="01")
		 return " For Link Conditon Freight should be only from Group Type";
	 }
 }
 
 
 function checkForWarningCond(){
	 if(this.forms[0].screenHeader.value=="Warning Condition")
		 {
		 var fromGrpType=document.getElementById("formGroup_type_Drop_down").value;
		 if(fromGrpType!="01")
			 return " For Warning  Conditon Freight should be only from Group Type";
		 }
 }
 
 function checkForFormCOndition(){
	 var groupType=$('#formGroup_type_Drop_down').val().toUpperCase();
	 var sourceCode=$('#fromTariffServiceSourceCode').val().toUpperCase();
	 var groupName=$('#fromTariffServiceGroupName').val().toUpperCase();
	 var item=$('#fromItem').val().toUpperCase();
	 var rate=$('#fromRate').val().toUpperCase();
	 
	 if(groupType=='01'){
		 $('#fromTariffServiceGroupName').val(sourceCode);
		 groupName=sourceCode;	 
	 }
	 
	 if((sourceCode=="")||(sourceCode=="ALL")){
		 $('#fromTariffServiceGroupName').val("");
		 $('#fromItem').val("");
		 $('#fromRate').val("");
		 $('#fromTariffServiceGroupName').attr("disabled",true);
		 $('#fromItem').val("").attr("disabled",true);
		 $('#fromRate').val("").attr("disabled",true);
		 
	 }
	 else if((sourceCode!="")&&(sourceCode!="ALL")){
		 $('#fromTariffServiceGroupName').attr("disabled",false);
		 $('#fromItem').attr("disabled",false);
		 $('#fromRate').attr("disabled",false);
	 }
	 if((groupName=="")||(groupName=="ALL")){
		 $('#fromItem').val("");
		 $('#fromRate').val("");
		 $('#fromItem').attr("disabled",true);
		 $('#fromRate').attr("disabled",true);
	 }
	 else if((groupName!="")&&(groupName!="ALL")){
		 	
	 }
	 if((item=="")||(item=="ALL")){
		 $('#fromRate').val("");
		 $('#fromRate') .attr("disabled",true);
	 }
 }
 
 function checkForToCondition(){
	 checkForLinkCond();
	 var groupType=$('#toGroup_type_Drop_down').val().toUpperCase();
	 var sourceCode=$('#toTariffServiceSourceCode').val().toUpperCase();
	 var groupName=$('#toTariffServiceGroupName').val().toUpperCase();
	 var item=$('#toItem').val().toUpperCase();
	 var rate=$('#toRate').val().toUpperCase();
	 
	 if(groupType=='01'){
		 $('#toTariffServiceGroupName').val(sourceCode);
		 groupName=sourceCode;	
	 }
	 
	 if((sourceCode=="")||(sourceCode=="ALL")){
		 $('#toTariffServiceGroupName').val("");
		 $('#toItem').val("");
		 $('#toRate').val("");
		 $('#toTariffServiceGroupName').attr("disabled",true);
		 $('#toItem').val("").attr("disabled",true);
		 $('#toRate').val("").attr("disabled",true);
		 
	 }
	 else if((sourceCode!="")&&(sourceCode!="ALL")){
		 $('#toTariffServiceGroupName').attr("disabled",false);
		 $('#toItem').val("").attr("disabled",false);
		 $('#toRate').val("").attr("disabled",false);
	 }
	 if((groupName=="")||(groupName=="ALL")){
		 $('#toItem').val("");
		 $('#toRate').val("");
		 $('#toItem').attr("disabled",true);
		 $('#toRate').attr("disabled",true);
	 }
	 if((item=="")||(item=="ALL")){
		 $('#toRate').val("");
		 $('#toRate') .attr("disabled",true);
	 } 
	
 }
 
 function loadRateDescUpdate(data){
	 
	 var renderData = data[1]+"Equipment"+"-"+data[8]+data[2]+"City"+"-"+data[0]+"description";
	 $('#fromRate').val(renderData);
	 
	 $('#fromRateId').val(data[3]);
	 $('#fromTariffServiceSourceCode').val(data[5]);
	 $('#fromTariffServiceGroupName').val(data[6]);
	 $('#fromItem').val(data[7]);
	 	 	 	
	 
 }
function loadRateDescToUpdate(data){
	 
	 var renderData = data[1]+"Equipment"+"-"+data[8]+data[2]+"City"+"-"+data[0]+"description";
	 $('#toRate').val(renderData);
	 
	 $('#toRateId').val(data[3]);
	 $('#toTariffServiceSourceCode').val(data[5]);
	 $('#toTariffServiceGroupName').val(data[6]);
	 $('#toItem').val(data[7]);
	 	 	 	
	 
 }



function setMessageToUpdate(param){
	var itemVar = param.split("|");
	var message = itemVar[1];
	var code = itemVar[2];
	var sysCode = itemVar[3];
	var messageid=itemVar[0];
	if(sysCode=="BKNG"){
	$('#conditionBookingMessageCode').val(code);
	$('#conditionBookingMessageArea').val(message);
	$('#bookingMessageId').val(messageid);
	
	}
	else if(sysCode=="AUTOBILL"){
	$('#conditionBillingMessageCode').val(code);
	$('#conditionBillingMessageArea').val(message);
	$('#billingMessageId').val(messageid);
		
	}
	else if(sysCode=="QUOTES"){
	$('#conditionQuoteMessageCode').val(code);
	$('#conditionQuoteMessageArea').val(message);
	$('#quoteMessageId').val(messageid);
		
	}
}

function arolePopupSearchFormCondition(type){
	if(type=="02"){
		this.usingPopUp="02";
		var actionUrl = _context + "/cas/conditionAddressRoleLookUp.do?ADDR_TYPE=02&orgId="+ $('#conditionShipperAroleTextHidden').val()+"&orgName="+ $('#conditionShipperAroleText').val();
		var windowStyle = 'top=0,left=0,height=500,width=1200,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressRole', windowStyle);
		}
		if(type=="03"){
			this.usingPopUp="03";
			var actionUrl = _context + "/cas/conditionAddressRoleLookUp.do?ADDR_TYPE=03&orgId="+ $('#conditionConsigneeAroleTextHidden').val()+"&orgName="+ $('#conditionConsigneeAroleText').val();
			var windowStyle = 'top=0,left=0,height=500,width=1200,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'AddressRole', windowStyle);
		}
		if(type=="01"){
			this.usingPopUp="01";
			// passing ADDR_TYPE = 04 for Address Type to get set with FRTPAY in popup screen : D022581
			var actionUrl = _context + "/cas/conditionAddressRoleLookUp.do?ADDR_TYPE=04&orgId="+ $('#conditionDebitorAroleTextHidden').val()+"&orgName="+ $('#conditionDebitorAroleText').val();
			var windowStyle = 'top=0,left=0,height=500,width=1200,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'AddressRole', windowStyle);
		}
	
}

function orgPopupSearchFormCondition(){
	 var actionUrl = _context+"/cas/organizationlookup.do";
	    var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);

}

function organizationNameSearchUpdate(id){
	var org = id.split('|');
	var orgId = org[1];
	var orgAbb = org[2];
	$('#conditionOrgText').val(org[0]);
	$('#conditionOrgTextHidden').val(orgId);
}

function loadAddressRoleUpdate(data){
	var displayText =null;
	$.ajax({
		   type: "GET",
		   url: _context +"/addressRole/getAddressRoleDetail",
		   data: {
			   addressRoleId: data
		   },
		   success: function(msg){
			   displayText = msg;
			   if(usingPopUp=="02")
				{
					$("#conditionShipperAroleTextHidden").val(data);
					$('#conditionShipperAroleText').val(displayText);

			}
				if(usingPopUp=="03")
				{
					$('#conditionConsigneeAroleText').val(displayText);
					$("#conditionConsigneeAroleTextHidden").val(data);
			}

				if(usingPopUp=="01")
				{
					$('#conditionDebitorAroleText').val(displayText);
					$("#conditionDebitorAroleTextHidden").val(data);
			}

		   }
		   });
	
	
}
function replicateCondition(conditionId)
{
	var screen='02';
	var from = $('#from').val();
	 var currentFuture=$('#isCurrentFuture').val();
	 if(conditionId.value==null || conditionId.value=="")
	 {
		 alert('Please save the Condition before Replicate');
	 }
	 else{
	 document.location.href= _context +'/condition/replicate/showForm?traiffConditionID='+conditionId.value+'&screen='+screen+'&isCurrentFuture='+currentFuture+"&from="+from;
	 
	 }
}

function loadNextTariffCondDetails(){
	var condToUpdate = "NEXT";
	var screenParam=null;
	 var key=$('#key').val();
	 var from = $('#from').val();
	 var currentFuture=$('#isCurrentFuture').val();
	 if(currentFuture==true || currentFuture=="true" || currentFuture=="Y"){
		 currentFuture='Y';
	 }
	 else{
		 currentFuture='N';
	 }
	if($('#screenName').val()=='wharfage'){
		screenParam = "WarfageLinkage";
	}
	else if($('#screenName').val()=='drayage'){
		screenParam = "revenueLinkage";
	}
	else{
		screenParam = "conditionSearch";
	} 
	if (somethingChanged) {
		var r = confirm("All the unsaved Changes will be discarded!");
			if (r == true) {
				document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+condToUpdate+'&screenParam='+screenParam+'conditionSearch&key='+key+'&isCurrentFuture='+currentFuture+'&screenName='+screenName+'&from='+from;
			//	document.location.href = _context +'/condition/edit?actionPerformed=edit&conditionId='+ condToUpdate+'&screenParam='+screenParam+'&isCurrentFuture='+currentFuture;
			}
		}
	else
	{
		document.location.href=_context+'/condition/edit?actionPerformed=edit&conditionId='+condToUpdate+'&screenParam='+screenParam+'conditionSearch&key='+key+'&isCurrentFuture='+currentFuture+'&screenName='+screenName+'&from='+from;
	}
}

function validateCheckBox()
{
	 if($('#conditionCityPortOriginPortExclusive').is(':checked') && $('#conditionCityPortDestinationPortExclusive').val()=='E' && ($('#conditionCityPortOriginPortToList').val()=='' || $('#conditionCityPortOriginPortToList').val()==null))
	 {
		alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Origin Port" );
	    return false;
	 }
	 if($('#conditionCityPortDestinationPortExclusive').is(':checked') && $('#conditionCityPortDestinationPortExclusive').val()=='E'  && ($('#conditionCityPortDestinationPortToList').val()=='' || $('#conditionCityPortDestinationPortToList').val()==null))
	 {
		alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Destination Port" );
	    return false;
	 } 
	 if($('#conditionCityPortBLOriginCityExclusive').is(':checked') && $('#conditionCityPortBLOriginCityExclusive').val()=='E' && ($('#conditionCityPortBLOrignCityToList').val()=='' || $('#conditionCityPortBLOrignCityToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in B/L Origin City" );
	    return false;
	 } 
	 if($('#conditionCityPortBLDestinationCityExclusive').is(':checked') && $('#conditionCityPortBLDestinationCityExclusive').val()=='E' && ($('#conditionCityPortBLDestinationCityToList').val()=='' || $('#conditionCityPortBLDestinationCityToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in B/L Destination City" );
	    return false;
	 } 
	 if($('#conditionCityPortBargeOriginExclusive').is(':checked') && $('#conditionCityPortBargeOriginExclusive').val()=='E' && ($('#conditionCityPortBargeOriginToList').val()=='' || $('#conditionCityPortBargeOriginToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Barge Origin" );
	    return false;
	 } 
	 if($('#conditionCityPortBargeDestinationExclusive').is(':checked') && $('#conditionCityPortBargeDestinationExclusive').val()=='E' && ($('#conditionCityPortBargeDestinationToList').val()=='' || $('#conditionCityPortBargeDestinationToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Barge Destination" );
	    return false;
	 }
	 
	 
	 if($('#conditionLoadDischargeLoadServiceConditionExclusive').is(':checked') && $('#conditionLoadDischargeLoadServiceConditionExclusive').val()=='E' && ($('#conditionLoadDischargeSelectedLoadServiceToList').val()=='' || $('#conditionLoadDischargeSelectedLoadServiceToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Load Service" );
	    return false;
	 }
	 
	 if($('#conditionLoadDischargeDischargeConditionExclusive').is(':checked') && $('#conditionLoadDischargeDischargeConditionExclusive').val()=='E' && ($('#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList').val()=='' || $('#conditionLoadDischargeDischargeServiceSelectedLoadServiceToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Discharge Service" );
	    return false;
	 }
	 
	 if($('#conditionLoadDischargeServicePairConditionExclusive').is(':checked') && $('#conditionLoadDischargeServicePairConditionExclusive').val()=='E' && ($('#conditionLoadDischargeServicePairToList').val()=='' || $('#conditionLoadDischargeServicePairToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Load Discharge Service" );
	    return false;
	 }
	 
	 
	 if($('#conditionSpecialServiceList1ConditionExclusive').is(':checked') && $('#conditionSpecialServiceList1ConditionExclusive').val()=='E' && ($('#conditionSpecialServiceToList1').val()=='' || $('#conditionSpecialServiceToList1').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in List1" );
	    return false;
	 }
	 if($('#conditionSpecialServiceList2ConditionExclusive').is(':checked') && $('#conditionSpecialServiceList2ConditionExclusive').val()=='E' && ($('#conditionSpecialServiceToList2').val()=='' || $('#conditionSpecialServiceToList2').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in List2" );
	    return false;
	 }
	 if($('#conditionSpecialServiceList3ConditionExclusive').is(':checked') && $('#conditionSpecialServiceList3ConditionExclusive').val()=='E' && ($('#conditionSpecialServiceToList3').val()=='' || $('#conditionSpecialServiceToList3').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in List3" );
	    return false;
	 }
	 if($('#conditionSpecialServiceList4ConditionExclusive').is(':checked') && $('#conditionSpecialServiceList4ConditionExclusive').val()=='E' && ($('#conditionSpecialServiceToList4').val()=='' || $('#conditionSpecialServiceToList4').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in List4" );
	    return false;
	 }
	 if($('#conditionSpecialServiceList5ConditionExclusive').is(':checked') && $('#conditionSpecialServiceList5ConditionExclusive').val()=='E' && ($('#conditionSpecialServiceToList5').val()=='' || $('#conditionSpecialServiceToList5').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in List5" );
	    return false;
	 }
	 
	 
	 if($('#conditionRateBasisExclusive').is(':checked') && $('#conditionRateBasisExclusive').val()=='E' && ($('#conditionrateBasisToList').val()=='' || $('#conditionrateBasisToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Rate Basis" );
	    return false;
	 }
	 
	 if($('#conditionEquipmentExclusive').is(':checked') && $('#conditionEquipmentExclusive').val()=='E' && ($('#conditionEquipmentSelectedList').val()=='' || $('#conditionEquipmentSelectedList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Equipment List" );
	    return false;
	 }
	 
	 if($('#conditionEqptFeatureConditionExclusive').is(':checked')&& $('#conditionEqptFeatureConditionExclusive').val()=='E' && ($('#conditionEqptFeatureSelLst').val()=='' || $('#conditionEqptFeatureSelLst').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in LSB or Equipment Feature List" );
	    return false;
	 }
	 
	 
	 
	 
	 if($('#shipperAroleConditionExclusive').is(':checked') && $('#shipperAroleConditionExclusive').val()=='E' && ($('#shipperAroleSelectedList').val()=='' || $('#shipperAroleSelectedList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Shipper Aroles" );
	    return false;
	 }
	 if($('#consigneeAroleConditionExclusive').is(':checked') && $('#consigneeAroleConditionExclusive').val()=='E' && ($('#consigeeAroleSelectedList').val()=='' || $('#consigeeAroleSelectedList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Consignee Aroles" );
	    return false;
	 }
	 if($('#debitorAroleConditionExclusive').is(':checked') && $('#debitorAroleConditionExclusive').val()=='E' && ($('#debitorAroleSelectedList').val()=='' || $('#debitorAroleSelectedList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Debitor Aroles" );
	    return false;
	 }
	 if($('#shipperOrgConditionExclusive').is(':checked') && $('#shipperOrgConditionExclusive').val()=='E' && ($('#shipperOrganizationToList').val()=='' || $('#shipperOrganizationToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Shipper Organizations" );
	    return false;
	 }
	 if($('#consigneeOrgConditionExclusive').is(':checked') && $('#consigneeOrgConditionExclusive').val()=='E' && ($('#consigneeOrganizationToList').val()=='' || $('#consigneeOrganizationToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Consignee Organizations" );
	    return false;
	 }
	 if($('#debitorOrgConditionExclusive').is(':checked') && $('#debitorOrgConditionExclusive').val()=='E' && ($('#debitorOrganizationToList').val()=='' || $('#debitorOrganizationToList').val()==null))
	 {
	    alert("Condition cannot be saved/ Updated with Condition Type as Exclusive and no data in Debitor Organization" );
	    return false;
	 }
	 
 }

function hideMandatoryWhenDisabled() {
	if( $('#fromTariffServiceSourceCode').attr('disabled') == 'disabled') { 
		$('#popupSearchfromTariffServiceSourceCode').hide(); 
	};
	
	if( $('#fromTariffServiceGroupName').attr('disabled') == 'disabled') { 
		$('#popupSearchfromTariffServiceGroupName').hide(); 
	};
	
	if( $('#fromItem').attr('disabled') == 'disabled') { 
		$('#popupSearchfromItem').hide(); 
	};
	
	if( $('#fromRate').attr('disabled') == 'disabled') { 
	$('#popupSearchfromRate').hide(); 
	};
	
	if( $('#toTariffServiceSourceCode').attr('disabled') == 'disabled' ) { 
		document.getElementById('toTariffSourceTypeLabel').innerHTML='Source Tariff';
		$('#popupSearchtoTariffServiceSourceCode').hide(); 
	};
	
	if( $('#toTariffServiceGroupName').attr('disabled') == 'disabled') {
		document.getElementById('toTariffSerivceGroupLabel').innerHTML='Group Name';
		$('#popupSearchtoTariffServiceGroupName').hide(); 
	};
	
	
	if( $('#toItem').attr('disabled') == 'disabled') { 
		$('#popupSearchtoItem').hide(); 
	};
	
	if( $('#toRate').attr('disabled') == 'disabled') { 
	$('#popupSearchtoRate').hide(); 
	};
	
	if( $('#toGroup_type_Drop_down').attr('disabled') == 'disabled') { 
		document.getElementById('toTariffGroupTypeLabel').innerHTML='Group Type';
	};
	
	if( $('#formGroup_type_Drop_down').attr('disabled') == 'disabled') { 
		  document.getElementById('fromTariffGroupTypeLabel').innerHTML='Group Type';
	};
	
	if( $('#fromTariffServiceSourceCode').attr('disabled') == 'disabled') { 
		 document.getElementById('fromTariffSourceTypeLabel').innerHTML='Source Tariff';
 	};
 	
 	if( $('#fromTariffServiceGroupName').attr('disabled') == 'disabled') { 
 		document.getElementById('fromTariffGroupNameLabel').innerHTML='Group Name';
 	};
}

function validateRangeFieldsOnSave()
{
	var isValid = true;
	if($('#ieRange1').val()!=null && $('#ieRange1').val()!="" && ($('#ieRange1').val()=="I" || $('#ieRange1').val()=="E" ))
	{
		if(document.getElementById("ieRangeType1").selectedIndex == 0)
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeType1').validationEngine('showPrompt', 'Please select Range Type', 'error', 'topRight', true);
			isValid = false;
		}
	}
	else{
		if(($('#ieRange1').val()!=null && $('#ieRange1').val()!="")) 
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange1').validationEngine('showPrompt', 'value of Range IE can only be I or E', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#ieRange2').val()!=null && $('#ieRange2').val()!="" && ($('#ieRange2').val()=="I" || $('#ieRange2').val()=="E" ))
	{
		if(document.getElementById("ieRangeType2").selectedIndex == 0)
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeType2').validationEngine('showPrompt', 'Please select Range Type', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		if(($('#ieRange2').val()!=null && $('#ieRange2').val()!="")) 
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange2').validationEngine('showPrompt', 'value of Range IE can only be I or E', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#ieRange3').val()!=null && $('#ieRange3').val()!="" && ($('#ieRange3').val()=="I" || $('#ieRange3').val()=="E" ))
	{
		if(document.getElementById("ieRangeType3").selectedIndex == 0)
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeType3').validationEngine('showPrompt', 'Please select Range Type', 'error', 'topRight', true);
			isValid = false;
		}
	}
	else{
		if(($('#ieRange3').val()!=null && $('#ieRange3').val()!="")) 
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange3').validationEngine('showPrompt', 'value of Range IE can only be I or E', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#ieRange4').val()!=null && $('#ieRange4').val()!="" && ($('#ieRange4').val()=="I" || $('#ieRange4').val()=="E" ))
	{
		if(document.getElementById("ieRangeType4").selectedIndex == 0)
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeType4').validationEngine('showPrompt', 'Please select Range Type', 'error', 'topRight', true);
			isValid = false;
		}
	}else{
		if(($('#ieRange4').val()!=null && $('#ieRange4').val()!="")) 
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange4').validationEngine('showPrompt', 'value of Range IE can only be I or E', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if(($('#ieRange5').val()!=null && $('#ieRange5').val()!="") && ($('#ieRange5').val()=="I" || $('#ieRange5').val()=="E" ))
	{
		if(document.getElementById("ieRangeType5").selectedIndex == 0)
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeType5').validationEngine('showPrompt', 'Please select Range Type', 'error', 'topRight', true);
			isValid = false;
		}
	}
	else{
		if(($('#ieRange5').val()!=null && $('#ieRange5').val()!="")) 
			{
					if(!$('#maintainConditionRanges').is(':visible')){
						expandRangeDiv();
					}
					$('#ieRange5').validationEngine('showPrompt', 'value of Range IE can only be I or E', 'error', 'topRight', true);
					isValid = false;
			}
	}
	if(document.getElementById("ieRangeType1").selectedIndex != 0)
	{
		if($('#ieRange1').val()==null || $('#ieRange1').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange1').validationEngine('showPrompt', 'I/E Range Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangegreaterThan').val()==null || $('#ieRangegreaterThan').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangegreaterThan').validationEngine('showPrompt', 'Greater Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangeLesserthan').val()==null || $('#ieRangeLesserthan').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeLesserthan').validationEngine('showPrompt', 'Lesser Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if(document.getElementById("ieRangeType2").selectedIndex != 0)
	{
		if($('#ieRange2').val()==null || $('#ieRange2').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange2').validationEngine('showPrompt', 'I/E Range Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangegreaterThan2').val()==null || $('#ieRangegreaterThan2').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangegreaterThan2').validationEngine('showPrompt', 'Greater Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangeLesserthan2').val()==null || $('#ieRangeLesserthan2').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeLesserthan2').validationEngine('showPrompt', 'Lesser Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if(document.getElementById("ieRangeType3").selectedIndex != 0)
	{
		if($('#ieRange3').val()==null || $('#ieRange3').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange3').validationEngine('showPrompt', 'I/E Range Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangegreaterThan3').val()==null || $('#ieRangegreaterThan3').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangegreaterThan3').validationEngine('showPrompt', 'Greater Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangeLesserthan3').val()==null || $('#ieRangeLesserthan3').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeLesserthan3').validationEngine('showPrompt', 'Lesser Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if(document.getElementById("ieRangeType4").selectedIndex != 0)
	{
		if($('#ieRange4').val()==null || $('#ieRange4').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange4').validationEngine('showPrompt', 'I/E Range Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangegreaterThan4').val()==null || $('#ieRangegreaterThan4').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangegreaterThan4').validationEngine('showPrompt', 'Greater Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangeLesserthan4').val()==null || $('#ieRangeLesserthan4').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeLesserthan4').validationEngine('showPrompt', 'Lesser Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if(document.getElementById("ieRangeType5").selectedIndex != 0)
	{
		if($('#ieRange5').val()==null || $('#ieRange5').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRange5').validationEngine('showPrompt', 'I/E Range Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangegreaterThan5').val()==null || $('#ieRangegreaterThan5').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangegreaterThan5').validationEngine('showPrompt', 'Greater Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
		if($('#ieRangeLesserthan5').val()==null || $('#ieRangeLesserthan5').val()=="")
		{
			if(!$('#maintainConditionRanges').is(':visible')){
				expandRangeDiv();
			}
			$('#ieRangeLesserthan5').validationEngine('showPrompt', 'Lesser Than Amount Required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	return isValid;
}

function expandRangeDiv()
{
	collapseAll();
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all')[2].className
	= "ui-accordion-header ui-helper-reset ui-state-active ui-corner-top";
	$('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	$('#maintainConditionRanges').css('display', 'block');
	window.scrollTo(0, 400);
	//$('#routingLink').trigger('click');
}
function expandMessageDiv()
{
	collapseAll();
	$('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all')[3].className
	= "ui-accordion-header ui-helper-reset ui-state-active ui-corner-top";
	$('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	$('#maintainConditionMessages').css('display', 'block');
	
	window.scrollTo(0, 400);
	//$('#routingLink').trigger('click');
}
function collapseAll(){
	 $('.ui-accordion-content').attr('style','display:none');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top').removeClass('ui-state-active').
	 removeClass('ui-corner-top').addClass('ui-state-default').addClass('ui-corner-all');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all span').removeClass('ui-icon-triangle-1-s')
	 .addClass('ui-icon-triangle-1-e');
	 //$('#conditionAccordians').accordion('activate', false);
	 //window.scrollTo(0, 0);
}
function expandAll(){
	 $('.ui-accordion-content').attr('style','display:block');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').removeClass('ui-state-default').
	 removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	 window.scrollTo(0, 0);
}
function validateMessage(){
	var isValid = true;
	if($('#conditionBookingNewCheckBox').is(':checked')){
		if($('#conditionBookingMessageCode').val()==null || $('#conditionBookingMessageCode').val()==""){
			if(!$('#maintainConditionMessages').is(':visible')){
				expandMessageDiv();
			}
			$('#conditionBookingMessageCode').validationEngine('showPrompt', 'Messages required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#conditionBillingNewCheckBox').is(':checked')){
		if($('#conditionBillingMessageCode').val()==null || $('#conditionBillingMessageCode').val()==""){
			if(!$('#maintainConditionMessages').is(':visible')){
				expandMessageDiv();
			}
			$('#conditionBillingMessageCode').validationEngine('showPrompt', 'Messages required', 'error', 'topRight', true);
			isValid = false;
		}
	}
	if($('#conditionQuoteNewCheckBox').is(':checked')){
		if($('#conditionQuoteMessageCode').val()==null || $('#conditionQuoteMessageCode').val()==""){
			if(!$('#maintainConditionMessages').is(':visible')){
				expandMessageDiv();
			}
			$('#conditionQuoteNewCheckBox').validationEngine('showPrompt', 'Messages required', 'error', 'topRight', true);
			isValid = false;
		}
	}
}



function moveToNext(){
	var lsbCodeLength = document.getElementById("conditionEqptFeatureCode").value.length;
	if(lsbCodeLength == 3 ){
	  document.getElementById("movementFromLsb").focus();
	}
}

//function validRangeValue(){
//	
//	 var str1 = document.getElementById("ieRangegreaterThan").value.toUpperCase();
//	 document.getElementById("ieRangegreaterThan").value=str1;
//	 var str2 = document.getElementById("ieRangegreaterThan2").value.toUpperCase();
//	 document.getElementById("ieRangegreaterThan2").value=str2;
//	 var str3 = document.getElementById("ieRangegreaterThan3").value.toUpperCase();
//	 document.getElementById("ieRangegreaterThan3").value=str3;
//	 var str4 = document.getElementById("ieRangegreaterThan4").value.toUpperCase();
//	 document.getElementById("ieRangegreaterThan4").value=str4;
//	 var str5 = document.getElementById("ieRangegreaterThan5").value.toUpperCase();
//	 document.getElementById("ieRangegreaterThan5").value=str5;
//	 
//	 var tru = true;
//	 if(str1!="" && str1!=null){
//	 if(str1==0){
//		 return "Zero Not Allowed";
//	 }}
//	 if(str2!="" && str2!=null){
//		 if(str2==0){
//			 return "Zero Not Allowed";
//		 }
//	}
//	 if(str3!="" && str3!=null){
//		 if(str3==0){
//			 return "Zero Not Allowed";
//		 }
//	}
//	 if(str4!="" && str4!=null){
//		 if(str4==0){
//			 return "Zero Not Allowed";
//		 }
//	}
//	 if(str5!="" && str5!=null){
//		 if(str5==0){
//			 return "Zero Not Allowed";
//		 }
//	}
//}
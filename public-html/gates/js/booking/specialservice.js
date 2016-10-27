var _SpecialServiceGridCount = -1;
var POV_NAME = "PERSONAL AUTO";
var ALASKA_POV_NAME = "ALASKA AUTO";

function createSpecialServiceGrid(entityName) {
	$("#spSvcEntityName").val(entityName);
	var defaultHidden=false;
	//alert(entityName);
	//alert("spSvcEntityName :- "+$("#spSvcEntityName").val());
	//25729
	var specialServiceCol = [ 'NO','Special Service','Level','All','Equipment/<br>VINSight#','Units','Rate','Rate<br>Basis', 'Special Service Date', 'User', 'Last Update','Payee','Amount'];
	
	var specialServiceMod = [
	                         {name:'seqNo',index:'seqNo', width:0,editable:false, editoptions:{readonly:true,size:10}, hidden:true},
	                         {name:'specialServiceCode',index:'specialServiceCode', width:70,editable:false, formatter:'showlink', formatoptions : {
	                   				baseLinkUrl : "javascript:",
	                				showAction: "editSpecialService('",
	                				addParam: "');" }
	                               }, 
	                         {name:'processLevelCode',index:'processLevelCode', width:40,editable:false},
	                         {name:'isApplyToAll',index:'isApplyToAll', width:20,editable:false}, 
	                         {name:'equipmentVinsight',index:'equipmentVinsight', width:95,editable:false}, //Increased width for D028038 
	                         {name:'numberOfUnit',index:'numberOfUnit', width:40,editable:false}, 
	                         {name:'manualUserRate',index:'manualUserRate', width:100,editable:false,align:'right',//aligned to the right D026538
	                        	 formatter:'currency', 
	                        	 formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$"}
	                        	 }, 
	                         {name:'rateBasisCode',index:'rateBasisCode', width:40,editable:false}, 
	                         {name:'specialServiceDate',index:'specialServiceDate', width:60,editable:false, hidden:true}, 
	                       //Added code to create User,Date and Time grids in Special Service overlay 25729
	                         {name:'lastUpdateUser',index:'lastUpdateUser', width:60,editable:false},
	                         {name:'lastUpdateDate',index:'lastUpdateDate', width:90,editable:false},
	                         {name:'payee',index:'payee', width:185,editable:false}, //Decreased width for D028038
	                         {name:'amount',index:'amount', width:100,editable:false,align:'right',//aligned to the right D026538
	                        	 formatter:'currency', 
	                        	 formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$"}
                        	 }
	                        ];
	
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
	
	/*Booking Security*/
	var pagerMultiDelete = true;
	if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
		pagerMultiDelete = false;
	}
	
	if(entityName=='container'){
		//In case of container(maintenance/international maintenance)
		defaultHidden=true;
	}

	/*Booking Security*/
	
	if(isSpecialServiceDisplayOnly || isSpecialServiceModifiable){
		//commented below block for Defect 028731
	/*	if ($('#optionToReplicate').val() == "Commodity" || $('#optionToReplicate').val() == "Customer") {
			createGrid(
					"specialServiceGrid", // grid id for user
					"specialServicePager", // page id for user
					_context+'/booking/specialservice/load?entityName='+entityName,
					_context+'/booking/specialservice/add?entityName='+entityName,
					_context+'/booking/specialservice/update?entityName='+entityName, 
					_context+'/booking/specialservice/delete?entityName='+entityName, 
					_context+'/booking/specialservice/delete?entityName='+entityName,
					specialServiceCol, 
					specialServiceMod, 
					"Special Services",
					93,
					4,
					[4,8,12],
					true,
					pagerMultiDelete,
					false, //load once
					true, jsonReaderSpSvc,true,true,true,true,true,false,false,isSpecialServiceGridEdited,
					specialServiceGridLoadComplete,defaultHidden,true,false, specialServAfterSubmit);
		} else { */
			createGrid(
					"specialServiceGrid", // grid id for user
					"specialServicePager", // page id for user
					_context+'/booking/specialservice/load?entityName='+entityName,
					_context+'/booking/specialservice/add?entityName='+entityName,
					_context+'/booking/specialservice/update?entityName='+entityName, 
					_context+'/booking/specialservice/delete?entityName='+entityName, 
					_context+'/booking/specialservice/delete?entityName='+entityName,
					specialServiceCol, 
					specialServiceMod, 
					"Special Services",
					93,
					4,
					[4,8,12],
					true,
					pagerMultiDelete,
					false, //load once
					true, jsonReaderSpSvc,true,true,true,true,true,false,false,isSpecialServiceGridEdited,
					specialServiceGridLoadComplete,defaultHidden,true,false, specialServAfterSubmit);
	//	}
	}
	 $( "#specialServiceDialog" ).dialog({ autoOpen: false , width: 990 ,height:600, modal: true
			 ,
			 open: function()
			 {
				 tabSequence('#specialServiceDialog',false,false);
			 },
			close: function(){
			 tabSequence('#',true,false);	         	
			 }
		    , buttons: {
		         Cancel: function(){
		        	 	var xErrorCoordinate = window.pageXOffset;
			    		var yErrorCoordinate = window.pageYOffset;
		            	$( this ).dialog( "close" );
		            	isSpecialServiceChanged=false;
		            	removeErrorPointersSPSV();
		            	setTimeout(function(){
							window.scrollTo(xErrorCoordinate, yErrorCoordinate);
							}, 250);
		          },
		          Ok: function(){
		        	  /*Booking Security*/
		        	disableDialogButtonSPSV('specialServiceDialog', 'Ok');
		        	if((isSpecialServiceDisplayOnly && !isSpecialServiceModifiable) || $('#bookingStatusCode').val()=='CANC'){
		        		var xErrorCoordinate = window.pageXOffset;
			    		var yErrorCoordinate = window.pageYOffset;
		        		$("#specialServiceDialog").dialog( "close" );
		        		isSpecialServiceChanged=false;
		        		setTimeout(function(){
							window.scrollTo(xErrorCoordinate, yErrorCoordinate);
							}, 250);
		        		enableDialogButton('specialServiceDialog', 'Ok');
		        		return;
		        	}
		        	
		        	if(!isSpecialServiceChanged){
		        		if($("#isSpecialServiceAdd").val()=="true"){
		        			alert('Please add a Special Service before you Click Ok');
		        			isSpecialServiceChanged=false;
		        		}else{
		        			alert('Special Service cannot be updated since no fields have been changed');
		        			isSpecialServiceChanged=false;
		        		}
		        		enableDialogButton('specialServiceDialog', 'Ok');
			        	return;
		        	}
		        	
		        	
		        	if(validateSpecialServiceFields()){
		        		
	        			$("#specialServiceMasterForm").validationEngine('detach');
	        			$("#specialServiceMasterForm").validationEngine('attach');
	        			if ($("#specialServiceMasterForm").validationEngine('validate')) {
	        				removeErrorPointersSPSV();
			        	var specialService = $('#specialServiceMasterForm').formSerialize();
			        	var dataUrl = _context +"/booking/specialservice/add?entityName="+entityName;
			        	if($("#isSpecialServiceAdd").val()=="false"){
			        		dataUrl = _context +"/booking/specialservice/edit?entityName="+entityName;
			        	}
			        	if(entityName == 'quote' ){
			        		//D028494
			        		if(isRatingAssociated('add','0')){
			        		 if( !checkTargetProcessRating()){
			        			isSpecialServiceChanged=true;
			        			enableDialogButton('specialServiceDialog', 'Ok');
			        			return;
			        		}	}
			        	}
			        	blockUI();
			        	
			        	$.ajax({
			        		type: "POST",
			        		url: dataUrl,
			        		data: specialService,
			        		success: function(responseText){
			        			if(responseText.success){
			        				$('#msgDivSplSrv').hide();
			        				isBookingChanged = "Y";
			        				var xErrorCoordinate = window.pageXOffset;
						    		var yErrorCoordinate = window.pageYOffset;
			        				$("#specialServiceDialog").dialog( "close" );
			        				setTimeout(function(){
										window.scrollTo(xErrorCoordinate, yErrorCoordinate);
										}, 250);
			        				isSpecialServiceChanged=false;
			        				$("#specialServiceGrid").trigger('reloadGrid');
			        				
			        				var entityName=$("#spSvcEntityName").val();
			        				if(entityName == 'booking'){
			        					checkPremPovRDDPresent();
			        				}
			        				//D025855: Maintain Booking / Special Services Ok Button not working
			        				enableDialogButton('specialServiceDialog', 'Ok');
			        			}else{
			        				$('#msgDivSplSrv').hide();
			        				showSpSVMessages('msgDivSplSrv', responseText);
									$('#msgDivSplSrv').show();
									//D025855: Maintain Booking / Special Services Ok Button not working
									enableDialogButton('specialServiceDialog', 'Ok');
			        			}
			        		}
			        	});
			        	$.unblockUI();
	        		} else {
	        		    //D025855: Maintain Booking / Special Services Ok Button not working
	        			enableDialogButton('specialServiceDialog', 'Ok');
	        		}
		          } else{
		        	  enableDialogButton('specialServiceDialog', 'Ok');
		        	  $("#specialServiceMasterForm").validationEngine('detach');
		        	  $("#specialServiceMasterForm").validationEngine('attach');
		        	  $("#specialServiceMasterForm").validationEngine('validate');
		          }
	        } 
	 }});
	 
	 $('div[aria-labelledby="ui-dialog-title-specialServiceDialog"] .ui-icon-closethick').click(function(){
		var xErrorCoordinate = window.pageXOffset;
		var yErrorCoordinate = window.pageYOffset;
		setTimeout(function(){
			window.scrollTo(xErrorCoordinate, yErrorCoordinate);
			}, 250);
	 });
	 
	 $("#specialSerivceAdd").click(function(){
		 var entityName=$("#spSvcEntityName").val();
		 if(entityName == 'quote'){
			 jQuery('#quoteForm').validationEngine('hideAll');	 
		 }		 
		 specialServiceAddClick();
		 
		 return false;
	 });
	 
	 $('div[aria-labelledby="ui-dialog-title-specialServiceDialog"] div span[class="ui-icon ui-icon-closethick"]').click(function(){
		 removeErrorPointersSPSV();
	 });
	 
	/* tabSequence("#tabSequenceSPSV");*/
}

function checkPremPovRDDPresent(){
	
	
		var isPremPovPresent = false;
		if($("#isSpecialServiceAdd").val()=='true'){
			if($('input[name="specialServiceFormLine1\\.specialServiceCode"]').val()=="PREM-POV"){
				isPremPovPresent=true;
			}
			if($('input[name="specialServiceFormLine2\\.specialServiceCode"]').val()=="PREM-POV"){
				isPremPovPresent=true;
			}
			if($('input[name="specialServiceFormLine3\\.specialServiceCode"]').val()=="PREM-POV"){
				isPremPovPresent=true;
			}
			if($('input[name="specialServiceFormLine4\\.specialServiceCode"]').val()=="PREM-POV"){
				isPremPovPresent=true;
			}
			if($('input[name="specialServiceFormLine5\\.specialServiceCode"]').val()=="PREM-POV"){
				isPremPovPresent=true;
			}
		}
		if(isPremPovPresent){
			$('#msgDiv').html('<div class="message_warning">Added Special Service required Delivery date to be provided.</div>');
			$('#msgDiv').show();
		}
}


function removeErrorPointersSPSV()
{
	$("#specialServiceMasterForm").validationEngine('hideAll');
}

function specialServiceAddClick(){	
	var entityName=$("#spSvcEntityName").val();
	 var bookingStatusCode=$('#bookingStatusCode').val();
	 $('#msgDivSplSrv').hide();
	 //If have permission then only allowed to check for entity status
	 /*Booking Security*/
	 if(isSpecialServiceDisplayOnly && isSpecialServiceModifiable){
		 if(entityName == 'quote'){					 
			if(!($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR")) {
				alert("Special Services cannot be added for this quote status");
				return;
			}else{
				 if($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR"){
					 tabSequence("#tabSequenceSPSV");
					 openSpecialServices();
				}
			}	
		}else if(entityName == 'booking'){			
			if(bookingStatusCode==undefined || bookingStatusCode==null || bookingStatusCode=='' || bookingStatusCode!='CANC'){
				tabSequence("#tabSequenceSPSV");
				openSpecialServices();
			}
		}else if(entityName == 'container'){
			var shipmentStatus=$('#shipmentStatus').val();
			if( shipmentStatus==undefined || shipmentStatus==null || shipmentStatus=='' || (shipmentStatus !='ISSD' && shipmentStatus!='CORR')) {
				tabSequence("#tabSequenceSPSV");
				openSpecialServices();
			}else{
				//alert("Special Services cannot be added as Container has been ISSD or CORR.");
			}
		}
 	}
}
	 
var specialServAfterSubmit = function(result)
{
	
	if(result.success) {
		isBookingChanged = "Y";
	} else {
		result.messages = result.messagesMap;
		showSpSVMessages("msgDiv", result);
		
		console.log(result.messagesMap.error);
	}
};

var specialServiceGridLoadComplete = function(){
	var entityName=$("#spSvcEntityName").val();
	//$('#specialServicePager .ui-pg-input').attr("readonly", true);
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam("reccount");
	var specialServiceDisplayText = "  ";
	var isPreiumServicePresent = false;
	var premiumRDD = '';
	//18644
	var arrayServices="";
	var specialServiceDisplayText1 = "  ";
	if(specialServiceNumberCount>0){
		for(var i=1;i<=specialServiceNumberCount;i++){
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i , "specialServiceCode" );
			if(i==1){
				if(null!=specialService && specialService!=undefined && specialService!=false){
					//specialServiceDisplayText=specialServiceDisplayText+' - '+specialService;
					arrayServices=specialService;
				}
			}else{
				if(null!=specialService && specialService!=undefined && specialService!=false){
					//specialServiceDisplayText=specialServiceDisplayText+', '+specialService;
					arrayServices=arrayServices+','+specialService;
					
				}
			}
			
			//For Premium RDD
			if(specialService=='PREM-POV'){
				isPreiumServicePresent = true;
				premiumRDD =  $("#specialServiceGrid").jqGrid('getCell', i , "specialServiceDate" );
			}
		}
		var array1 =new Array();
		array1 = arrayServices.split(',');
		
		var array2 = new Array();
		
		for(var i=0; i<array1.length; i++) 
		{
		      var xx = true;
			for(var j=i+1; j<array1.length; j++)
			{
				if(array1[i] == array1[j])
					xx = false;					
			}	
			if(xx == true)
				{				
					array2.push(array1[i]);		
				}
		}
		for(var i=0; i<array2.length; i++)
			{
				var count=0;		
			for (var j=0;j<array1.length;j++)
				
				{
				if(array2[i]==array1[j])
					{
					count++;
					}
				}
			if(count>1)
				{				
				specialServiceDisplayText=specialServiceDisplayText+' | '+array2[i]+'('+count+')';
				}
			else
				{				
			specialServiceDisplayText=specialServiceDisplayText+' | '+array2[i];
			}
					
			}
		
	}
	if(isPreiumServicePresent && $.trim($('#loadDschServiceGroupCode').val()) == "AU" && isRoutingModifiable 
			&& ($.trim($('#customerGroupId :selected').text()) == POV_NAME || $.trim($('#customerGroupId :selected').text()) == ALASKA_POV_NAME))
	{
		$('#vvd_premium').show();
		$('#premiumRDD').attr("disabled", false);
		if(premiumRDD != null && premiumRDD != 'null' && premiumRDD != ''){
			$('#premiumRDD').val(premiumRDD);
		}
		/*if($('#milRequiredDeliveryDate').val()=='')
			$('#premiumRDD').val('01-01-0001');
		else
			$('#premiumRDD').val($('#milRequiredDeliveryDate').val());*/
	} 
	else 
	{
		$('#premiumRDD').val('');
		$('#premiumRDD').attr("disabled", true);
		$('#vvd_premium').hide();
	}
	
	
	if(entityName == 'quote'){
		setAccordianTabDetails('splServicesHeader',specialServiceDisplayText);
	}
	if(entityName=='booking' || entityName == 'quote'){
		
		
		$('#gridIdForClauses').trigger("reloadGrid");
		var userData = $("#specialServiceGrid").getGridParam('userData');
		// D029646: 	Haz Dray/special service on Container Maintenance 
		if(userData && userData.ACCORDIANDISPLAY) { 
			setAccordianTabDetails('splServicesHeader', userData.ACCORDIANDISPLAY);
		} else {
			setAccordianTabDetails('splServicesHeader',specialServiceDisplayText);
		}
		//D026261: 	FW: Maintain booking : SIT flag to VVD Routing 
		
		if(userData && userData.SITEXISTS) { 
			$('#isSIT').val("true");
		} else {
			$('#isSIT').val("false");
		}
		
	}
	if(entityName=='container'){
		setAccordianTabDetails('splServicesHeader',specialServiceDisplayText);
		$('div[id="gview_specialServiceGrid"] div span[class="ui-jqgrid-title"]').html("Special Services"+specialServiceDisplayText);
	}
	if(entityName == 'quote'){
		var allRows=$('#specialServiceGrid').children().children();
		for(var i=1;i<allRows.length;i++) {
			$($($('#specialServiceGrid').children().children()[i]).children()[3]).css('font-weight','bold');
		}
	}
	
};


function openSpecialServices(){
	//getRateBasisList();
	$("#specialServiceDialog" ).dialog( "option", "title", 'Special Services' );
	$("#specialServiceDialog" ).dialog('open'); 
	
	$("#specialServiceFormLine2").show();
	$("#specialServiceFormLine3").show();
	$("#specialServiceFormLine4").show();
	$("#specialServiceFormLine5").show();
	//defect 25729
	$("#useranddateHeader").hide();
	$("#useranddate").hide();
	$("#specialServiceDialog").height(550);
	$("#specialServiceMasterForm").clearForm();
	removeClassesForSpecialServiceForm();
	populateDefaultPageOptions();
	removeErrorPointersSPSV();
	$("#isSpecialServiceAdd").val("true");
	isSpecialServiceChanged=false;
	
}  

function isSpecialServiceGridEdited() {
	var numOfSpecialServices = $("#specialServiceGrid").getGridParam("reccount");
	var entityName=$("#spSvcEntityName").val();
	if(entityName == 'quote'){
		if(_SpecialServiceGridCount==-1){
			_SpecialServiceGridCount = numOfSpecialServices;
		}else if(_SpecialServiceGridCount > numOfSpecialServices){
			_isQuoteChanged = true;			
		}
		if(_SpecialServiceGridCount != numOfSpecialServices){
			passthru = false;
		}
	}	
	_SpecialServiceGridCount = numOfSpecialServices;
}

function canSpecialServiceGridDeleted(entityName){
	if(entityName != undefined && entityName == 'quote'){
		if(checkTargetProcessRating()){
			return _context+'/booking/specialservice/delete?entityName='+entityName;
		}else
			return null;
	}else{
		return _context+'/booking/specialservice/delete?entityName='+entityName;
	}
	
}



//Check if Target Process has FRT Charges, if yes prompt the user that FRT Charges will be deleted, Inaddition Delete non-Genric Charges
//D026514 Point 5
function  checkTargetProcessRating(){
	var isValid = true;
	$.ajax({
		type : "POST",
		url : _context + "/quote/charge/checkTargetProcess",
		async : false,
		success :  function(responseText){
			if(responseText.success){
				if(null!=responseText.data && undefined!=responseText.data){
					if(responseText.data){
						var r=confirm("All Charges will be deleted. Would you like to continue ");
						if (r==true)
						  {
							$.ajax({
								type : "POST",
								url: _context + "/quote/charge/deleteFRTCharges",
								async : false,
						        success: function(responseText){
						        	$("#quoteChargeLineGrid").trigger("reloadGrid");
						        }
						       
							});
							isValid = true;
						  }
						else
						  {
							isValid = false;
						  }
					}
				}
			}
		}
		
	});
	
	return isValid;
	
}

//D028494
function  isRatingAssociated(action,id){
	var isValid = false;
	var specialService = $('#specialServiceMasterForm').formSerialize();
	var entityName='quote';
	$.ajax({
		type : "POST",
		data : specialService,
		url : _context + "/booking/specialservice/isRatingAssociated?entityName="+entityName+'&action='+action+'&id='+id,
		async : false,
		success :  function(responseText){
			if(responseText.success){
				if(null!=responseText.data && undefined!=responseText.data){
					if(responseText.data){
							isValid = true;
						  }
						else
						  {
							isValid = false;
						  }
					}
				}
			}
		});
	return isValid;
}


function editSpecialService(id) {
	//getRateBasisList();
	var seqNo = id.split('=')[1];
	var bookingStatusCode=$('#bookingStatusCode').val();
	var entityName=$("#spSvcEntityName").val();
	if(entityName == 'quote'){
		if(!($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR")) {
			$("#specialServiceDialog").gatesDisable();
		}
	}else if(entityName == 'booking'){
		/*Booking Security*/
		if((isSpecialServiceDisplayOnly && !isSpecialServiceModifiable) || bookingStatusCode=='CANC'){
			$("#specialServiceDialog").gatesDisable();
		}
		else if(bookingStatusCode==undefined || bookingStatusCode==null || bookingStatusCode=='' || bookingStatusCode!='CANC'){
			$("#specialServiceDialog").gatesEnable();
		}
	}
	showSpecialServiceDialog(seqNo);
}

function showSpecialServiceDialog(seqNo){
	var entityName=$("#spSvcEntityName").val();
	isSpecialServiceChanged=false;
	var dataUrl = _context +"/booking/specialservice/getSpecialService?seqNo="+seqNo+'&entityName='+entityName;
	$("#specialServiceMasterForm").clearForm();
	$.ajax({
		url: dataUrl,
		success: function(responseText){
			$("#specialServiceDialog").gatesEnable();
			enableDialogButton('specialServiceDialog', 'Ok');
			
			removeClassesForSpecialServiceForm();
			populateDefaultPageOptions();
			$('#msgDivSplSrv').hide();
			$("#specialServiceDialog").dialog('open');
			$("#isSpecialServiceAdd").val("false");
			$("#specialServiceFormLine2").hide();
			$("#specialServiceFormLine3").hide();
			$("#specialServiceFormLine4").hide();
			$("#specialServiceFormLine5").hide();
			//defect 25729
			$("#useranddateHeader").show();
			$("#useranddate").show();
			$("#specialServiceMasterForm").loadJSON(responseText);
			$('input[name="specialServiceFormLine1\\.specialServiceCode"]').val(responseText.specialServiceFormLine1.specialServiceCode);
			$('input[name="specialServiceFormLine1\\.commodityLineNumber"]').val(responseText.specialServiceFormLine1.commodityLineNumber);
			$('input[name="specialServiceFormLine1\\.equipmentVinsight"]').val(responseText.specialServiceFormLine1.equipmentVinsight);
			$('input[name="specialServiceFormLine1\\.numberOfUnit"]').val(responseText.specialServiceFormLine1.numberOfUnit);
			$('input[name="specialServiceFormLine1\\.manualUserRate"]').val(responseText.specialServiceFormLine1.manualUserRate);
			$('select[name="specialServiceFormLine1\\.rateBasisCode"]').val(responseText.specialServiceFormLine1.rateBasisCode);
			$('input[name="specialServiceFormLine1\\.payee"]').val(responseText.specialServiceFormLine1.payee);
			$('#passThruCharge1').val(responseText.specialServiceFormLine1.passThruCharge);
			$('#passThruPayable1').val(responseText.specialServiceFormLine1.passThruPayable);
			var amountReadOnly = responseText.specialServiceFormLine1.amountReadOnly;
			if(amountReadOnly !=null && amountReadOnly !='' && ! isNaN(amountReadOnly) && amountReadOnly != undefined){
				amountReadOnly = parseFloat(amountReadOnly);
				$('input[name="specialServiceFormLine1\\.amountReadOnly"]').val(amountReadOnly.toFixed(2));
			}
			
			$("#specialServiceDialog").height(180);
			
			populateHiddenFields(1);
			applyUIValidations(1);
			checkRateBasisRequired(1);
			changeValueToDecimalFormat(1);
			var entityName=$("#spSvcEntityName").val();
			
			$('#msgDivSplSrv').hide();
			
			
			if(isSpecialServiceDisplayOnly && !isSpecialServiceModifiable){
				$("#specialServiceDialog").gatesDisable();
				disableDialogButtonSPSV('specialServiceDialog', 'Ok');
			}else if(isSpecialServiceDisplayOnly && isSpecialServiceModifiable) {
				
				if(entityName == 'quote'){
					if(!($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR")) {
						$("#specialServiceDialog").gatesDisable();
						disableDialogButtonSPSV('specialServiceDialog', 'Ok');
					}
				}else if(entityName == 'booking'){
					var bookingStatusCode=$('#bookingStatusCode').val();
					if(bookingStatusCode=='CANC'){
						$("#specialServiceDialog").gatesDisable();
						disableDialogButtonSPSV('specialServiceDialog', 'Ok');
					}
				}else if(entityName == 'container'){
					var shipmentStatus=$('#shipmentStatus').val();
					if(shipmentStatus =='ISSD' || shipmentStatus=='CORR') {
						$("#specialServiceDialog").gatesDisable();
						disableDialogButtonSPSV('specialServiceDialog', 'Ok');
					}
				}
			}
			
			removeErrorPointersSPSV();
			isSpecialServiceChanged=false;
		}
	});
}

function disableDialogButtonSPSV(dialogId, buttonName){
	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
}

function enableDialogButton(dialogId, buttonName){
	$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("enable");
}

function validateOkButton(){
	/*var isSuccessful=true;
	for(var i=1;i<=5;i++){
		var specialServiceCode= $('input[name="specialServiceFormLine'+i+'\\.specialServiceCode"]').val();
		var hiddenSpecialServiceCode= $('#specialServiceCode'+i).val();
		if((specialServiceCode!=null || specialServiceCode!="") && (hiddenSpecialServiceCode!=null || hiddenSpecialServiceCode!="") ){
			isSuccessful=false;
			break;
		}
	}
	return isSuccessful;*/
	
	if(isSpecialServiceChanged){
		return true;
	}
	return false;
}

function unloadSpecialServiceGrid(){
	$('#specialServiceGrid').jqGrid('GridUnload');
}

function loadSpecialServiceGrid(){
	$('#specialServiceGrid').trigger("reloadGrid");
}

function showSpSVMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}

		console.log('messageContent='+messageContent);
		$('#'+msgDivId).html(messageContent);
		
		if(messageContent!='')
			window.scrollTo(0, 0);
  	}
}
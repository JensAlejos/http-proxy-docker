
$(document).ready(function () {
	$("#spSvcEntityName").val('shipment');
	

	 $( "#specialServiceDialog" ).dialog({ autoOpen: false , width: 970 ,height:300, modal: true
		    , buttons: {
		          Ok: function(){
		        	  $('input[name="specialServiceFormLine1.manualUserRate"]').removeClass("validate[required]");
		        	  $('input[name="specialServiceFormLine1.rateBasisCode"]').removeClass("validate[required]");
		        		
	        		if ($("#specialServiceMasterForm").validationEngine('validate')) {
			        	var specialServiceData = $('#specialServiceMasterForm').formSerialize();
			        	var newDataUrl = _context +"/shipment/specialservice/add";//?entityName=shipment
			        	if($("#isSpecialServiceAdd").val()=="false"){
			        		newDataUrl = _context +"/shipment/specialservice/edit";//?entityName=shipment
			        	}
			        	$.ajax({
			        		type: "POST",
			        		url: newDataUrl,
			        		data: specialServiceData,
			        		success: function(responseText){
			        			if(responseText.success){
			        				$('#msgDivSplSrv').hide();
			        				$("#specialServiceDialog").dialog( "close" );
			        				$("#specialServiceGrid").trigger('reloadGrid');
			        			}else{
			        				$('#msgDivSplSrv').hide();
			        				showResponseMessages('msgDivSplSrv', responseText);
									$('#msgDivSplSrv').show();
			        			}
			        		}
			        	});
	        		}},
		         /* } else{
		        	  $("#specialServiceMasterForm").validationEngine('detach');
		        	  $("#specialServiceMasterForm").validationEngine('attach');
		        	  $("#specialServiceMasterForm").validationEngine('validate');
		          }*/

	        Clear: function(){
	        	$("#specialServiceMasterForm").clearForm();
         },
	        Cancel: function(){
	        	$("#specialServiceMasterForm").validationEngine('detach');
           	$( this ).dialog( "close" ); 
         }
	}});
	/* $("#specialSerivceAdd").click(function(){
		 //alert("Test Special");
		 if($('#shipmentNumberHidden').val()==''){
			 $('#equipmentVinsight1').hide();
			 $('#equipmentVinsight2').hide();
			 $('#equipmentVinsight3').hide();
			 $('#equipmentVinsight4').hide();
			 $('#equipmentVinsight5').hide();
		 }else{
			 $('#equipmentVinsight1').show();
			 $('#equipmentVinsight2').show();
			 $('#equipmentVinsight3').show();
			 $('#equipmentVinsight4').show();
			 $('#equipmentVinsight5').show();
		 }
		 $('#msgDivSplSrv').hide();
		 openSpecialServices();
	});*/

	 //_enforceSecuritySection('maintainShipmentHeader', 0, isMaintainbillhhgdsDisplayOnly, isMaintainbillhhgdsModifiable);
	 _enforceSecuritySection('maintainShipmentContainerDetail', 1, isMaintainbillhhgdsDisplayOnly, isMaintainbillhhgdsModifiable);
	 _enforceSecuritySection('shipmentCommodityHHGS', 2, isMaintainbillhhgdsDisplayOnly, isMaintainbillhhgdsModifiable);
	 _enforceSecuritySection('houseHoldSplService', 3, isMaintainbillhhgdsDisplayOnly, isMaintainbillhhgdsModifiable);
	 _enforceSecuritySection('shipmentClauseHHGS', 4, isMaintainbillhhgdsDisplayOnly, isMaintainbillhhgdsModifiable);

	 enforceSecurityDivAndButtons('maintainShipmentHeader', isMaintainbillhhgdsDisplayOnly);
	 enforceSecurityDivAndButtons('rate', isRateButtonEnable);
	 enforceSecurityDivAndButtons('save', isSaveButtonEnable);
	 enforceSecurityDivAndButtons('edit', isMaintainbillhhgdsUpdate);
	 enforceSecurityDivAndButtons('shipperOneTimeCustMainDiv', isMaintainbillhhgdsAdd);
	 enforceSecurityDivAndButtons('consigneeOneTimeCustMainDiv', isMaintainbillhhgdsAdd);
	 enforceSecurityDivAndButtons('commodityHHGSAdd', isMaintainbillhhgdsAdd);
	 enforceSecurityDivAndButtons('clauseHHGSAdd', isMaintainbillhhgdsAdd);
	 enforceSecurityDivAndButtons('specialSerivceAdd', isMaintainbillhhgdsAdd);
	 
 
});

var specialServiceGridLoadComplete = function(){
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam("reccount");
	var specialServiceDisplayText = "";
	//var specialServiceDisplayText = "Special Service ";
	if(specialServiceNumberCount>0){
		for(var i=1;i<=specialServiceNumberCount;i++){
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i , "specialServiceCode" );
			if(i==1){
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+' - '+specialService;
				}
			}else{
				if(null!=specialService && specialService!=undefined && specialService!=false){
					specialServiceDisplayText=specialServiceDisplayText+', '+specialService;
				}
			}
		}
	}
	setAccordianTabDetails('houseHoldSplService',specialServiceDisplayText);
	

	$("#clauseGridHHGS").trigger('reloadGrid');
};



function setShipmentSequenceNumberList(){
	$.ajax({
		type : "GET",
		url : _context +"/houseHoldShipment/getShipmentSeqNumberList",
		data : {
		},
		success : function(responseText) {
			if(responseText.success==true){
				 $("#shipmentSeqNumberSpcServ").get(0).options.length = 0;
				    $.each(responseText.data, function(index, shipmentNumberList) {
				    	 $("#shipmentSeqNumberSpcServ").get(0).options[$("#shipmentSeqNumberSpcServ").get(0).options.length] = new Option(shipmentNumberList.description, shipmentNumberList.code);
				    });
				
			}
			if ($("#unitOfMeasureSourceCode").val()=="I" ){
			       var a=$('#totalWeight').val().indexOf(".");
						 if(a>=0) {
						  var finalValue1=$('#totalWeight').val().substring(0,a);
						  $('#totalWeight').val(finalValue1);
			                 }
				   var b=$('#totalCube').val().indexOf(".");
					     if(b>=0) {
						  var finalValue2=$('#totalCube').val().substring(0,b);
						  $('#totalCube').val(finalValue2);
			                 } 		 
			
			
			}
		}
	});	
	
		
}
function openSpecialServices(){
	$("#specialServiceDialog" ).dialog( "option", "title", 'Special Services' );
	$("#specialServiceDialog" ).dialog('open'); 
	
	$("#specialServiceFormLine2").show();
	$("#specialServiceFormLine3").show();
	$("#specialServiceFormLine4").show();
	$("#specialServiceFormLine5").show();
	//$("#specialServiceDialog").height(90);
	$("#specialServiceMasterForm").clearForm();
	removeClassesForSpecialServiceForm();
	populateDefaultPageOptions();
	$('input[name*="commodityLineNumber"]').attr("disabled", true);
	var shipmentNumber=$('#shipmentNumberHidden').val();
	//alert("shipmentNumber:::"+shipmentNumber);
	if(null==shipmentNumber || shipmentNumber==''){
		$('input[name*="equipmentVinsight"]').removeClass("validate[required]");
		$('input[name*="equipmentVinsight"]').attr("disabled", true);
	}
	$("#isSpecialServiceAdd").val("true");
}  


function createSpecialServiceHHGSGrid(){
var specialServiceCol = [ 'Id','Seq','SS Code','Units','','Rate','RB','Amount','Payee','Notes','User', 'Last Upadte',''];
	
	var specialServiceMod = [
	                         {name:'seqNo',index:'seqNo', width:55,editable:false, editoptions:{readonly:true,size:10}, hidden:true},	                         
	                         {name:'specialServiceHHGSSeqNo',index:'specialServiceHHGSSeqNo', width:55,editable:false, editoptions:{readonly:true,size:10}},
	                         {name:'specialServiceCode',index:'specialServiceCode', width:80,editable:false, formatter:(isMaintainbillhhgdsUpdate==true? 'ssformatLink':'formatLink'), 
	                        	 formatoptions : {}
	                         
	                   				
	                               }, 
	                         {name:'numberOfUnit',index:'numberOfUnit', width:60,editable:false}, 
	                         {name:'processLevelCode',index:'processLevelCode', width:60,editable:false, hidden:true}, 
	                         {name:'manualUserRate',index:'manualUserRate', width:60,formatter:'number',formatoptions: {prefix:'$', thousandsSeparator:',', defaultValue:''},editable:false, align: 'right'}, 
	                         {name:'rateBasisCode',index:'rateBasisCode', width:50,editable:false}, 
	                         {name:'amount',index:'amount', width:70,formatter:'number',formatoptions: {prefix:'$', thousandsSeparator:',', defaultValue:''},editable:false, align: 'right'},  
	                         {name:'payee',index:'payee', width:180,editable:false}, 
	                         {name:'routingText',index:'routingText', width:230,editable:false}, 
	                        
	                         //Defect 24939
	                         //Added code to create User,Date and Time grids in Special Service overlay
	                         {name:'lastUpdateUser',index:'lastUpdateUser', width:60,editable:false},
	                         {name:'lastUpdateDate',index:'lastUpdateDate', width:90,editable:false},
	                         {name:'actions', index:'actions', width:30, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
	                        
	                        ];
	
	jQuery.extend($.fn.fmatter,
			{
		ssformatLink : function(cellvalue,
						options, rowdata) {
					if( readOnlyCommodityHHGSGrid == false && readOnlyClauses == false){
						return '<a href="javascript:editSpecialService('+rowdata.seqNo.toString()+
						')" style="text-decoration:underline;" >'+cellvalue+'</a>';
					}else{
						
						return cellvalue;
					}
				}
				});
	
	
	
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};

	createGrid(
			"specialServiceGrid", // grid id for user
			"specialServicePager", // page id for user
			_context+'/houseHoldShipment/specialService/load', 
			'', 
			'', 
			_context+'/houseHoldShipment/specialService/delete', 
			'',
			specialServiceCol, 
			specialServiceMod, 
			"Special Services",
			"auto",
			10,
			[10,20,30],
			false,
			false,
			false, //load once
			true, jsonReaderSpSvc,true,(isMaintainbillhhgdsDelete==true?false:true),true,true,true,false,false,false,specialServiceGridLoadComplete,false,true);
	
	
	 
}
function editSpecialService(id) {
	var seqNo = id;
	isSpecialServiceAdd ='false';
	HHGSSpecialServiceOverlay= "editSpecialService";
	 $(":button:contains('OK & New')").prop("disabled", true).addClass("ui-state-disabled");
	showSpecialServiceDialog(seqNo);
}

function showSpecialServiceDialog(seqNo){

	var dataUrl = _context +"/houseHoldShipment/specialService/getSpecialService?seqNo="+seqNo;
	$("#specialServiceMasterForm").clearForm();
	$.ajax({
		async:false,
		url: dataUrl,
		success: function(responseText){
			getRateBasisList();
			removeClassesForSpecialServiceForm();
		    $('#msgDivSplSrv').hide();
			$("#addHouseHoldSplServiceDialog").dialog('open');
			$("#addHouseHoldSplServiceDialog" ).dialog( "option", "title", 'Special Services' );
			$("#isSpecialServiceAdd").val("false");
			$("#shipmentHouseHoldSpecialServiceForm").loadJSON(responseText);
			$('#shipmentSeqNumberSpcServ').val(responseText.specialServiceHHGSSeqNo);
			$('input[name="specialServiceCode"]').val(responseText.specialServiceCode);
			$('#matchSeqNo').val(responseText.matchSeqNo);
			$('input[name="numberOfUnit"]').val(responseText.numberOfUnit);
			$('input[name="manualUserRate"]').val(responseText.manualUserRate);
			$('select[name="rateBasisCode"]').val(responseText.rateBasisCode);
			$('input[name="payee"]').val(responseText.payee);
			$('textarea[name="routingText"]').val(responseText.routingText);
			
			$('input[name="source"]').text(responseText.source);
			/*$('input[name="amount"').val(responseText.amount);*/
			$('input[name="chargeCodeExpected"]').val(responseText.chargeCodeExpected);
			$('#splSvcAddress').text(responseText.shipmentAddress);
		
			var cityStateZip="";
			if(responseText.city!=null){
			cityStateZip=responseText.city;
			}
			if(responseText.state!=null){
				cityStateZip=cityStateZip+'/'+responseText.state;
				}
			if(responseText.zip!=null){
				cityStateZip=cityStateZip+'/'+responseText.zip;
				}
			$('#splSvcAddrInfo').text(cityStateZip);			
			HHGSSpecialServiceOverlay= "editSpecialService";
			populateHiddenFields();
			applyUIValidations();
			checkRateBasisRequired();
			$('#shipmentSeqNumberSpcServ').focus();
			
			if(responseText.processLevelCode!=null && responseText.processLevelCode=='C'){
				$('#addHouseHoldSplServiceDialog').gatesDisable();
				 $(":button:contains('OK & New')").prop("disabled", true).addClass("ui-state-disabled");
				 $(":button:contains('Ok')").prop("disabled", true).addClass("ui-state-disabled");
				 $(":button:contains('Clear')").prop("disabled", true).addClass("ui-state-disabled");
				 $(":button:contains('Cancel')").prop("disabled", true).addClass("ui-state-disabled");
			}
			//tabSequence('#shipmentHouseHoldSpecialServiceForm');
		}
	});
}

function populateHiddenFields(){
	//Hidden fields population	
	$('#specialServiceCode').val($('input[name="specialServiceCode"]').val());
	$('#truckerAmount').val($('input[name="amount"]').val());
	
	$('#payeeHidden').val($('input[name="payee"]').val());
	
}
function unloadSpecialServiceGrid(){
	$('#specialServiceGrid').jqGrid('GridUnload');
}

function loadSpecialServiceGrid(){
	$('#specialServiceGrid').trigger("reloadGrid");
}

function setSpecialServicesDiv() {
	var specialServiceNumberCount = $("#specialServiceGrid").getGridParam(
			"reccount");
	var specialServiceDisplayText = "";
	//var specialServiceDisplayText = "Special Service ";
	if (specialServiceNumberCount > 0) {
		for ( var i = 1; i <= specialServiceNumberCount; i++) {
			var specialService = $("#specialServiceGrid").jqGrid('getCell', i,
					"specialServiceCode");
			if (i == 1) {
				if (null != specialService && specialService != undefined
						&& specialService != false) {
					specialServiceDisplayText = specialServiceDisplayText
							+ ' - ' + specialService;
				}
			} else {
				if (null != specialService && specialService != undefined
						&& specialService != false) {
					specialServiceDisplayText = specialServiceDisplayText
							+ ', ' + specialService;
				}
			}
		}
	}
	setAccordianTabDetails('houseHoldSplService', specialServiceDisplayText);
}

function setAccordianTabDetails(id, displayText) {
	$("#" + id).text(displayText);
}

function checkRateBasisRequired(){
	var manualUserRate=$('input[name="manualUserRate"]').val();
	var isManualCharge=$('input[name="isManualCharge"]').val();
	if(manualUserRate!=''){
		if($('select[name="rateBasisCode"] option:selected').text()==''){
			$('select[name="rateBasisCode"]').addClass('validate[required]');
		}else{
			$('select[name="rateBasisCode"]').removeClass('validate[required]');
		}
	}else if(manualUserRate==''){
		if(isManualCharge=='N' || isManualCharge==''){
			$('input[name="manualUserRate"]').removeClass('validate[required]');
			$('select[name="rateBasisCode"]').removeClass('validate[required]');
		}
	}
	if($('input[name="manualUserRate"]').val()!='' && 
			$('select[name="rateBasisCode"] option:selected').text()!=''){
		$('input[name="manualUserRate"]').addClass('validate[required]');
	}
	
	
	var truckerRateId=$('input[name="milTruckerRateId"]').val();
	var isMilTruckerCustomised=$('input[name="isMilTruckerRateCustomized"]').val();
	
	if(null!=truckerRateId && truckerRateId!='' && isMilTruckerCustomised=='N' ){
		var truckerRateAmount=$('truckerAmount').val();
		if(manualUserRate!=truckerRateAmount){
			$('input[name="source"]').val("AH Customised");
			$('input[name="isMilTruckerRateCustomized"]').val('Y');
			
		}else{
					}
	}
}


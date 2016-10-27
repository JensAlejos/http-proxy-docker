//changed for D023317
var containerUpdateSuccess = true;
var currentRowId='';
$(document).ready(function() {
	var temp1="";
	var containerCol = ['Id', 'ShipmentId','shipmentStatus', 'Container', 'Type', 'Seal','Old Seal','EquipmentLogId','Pieces','Kind','Weight','Cube','Pro Rate', 'PlanEquip','', '', 'Temperature', 'Scale', 'Status','StatusView','Action'];
	var containerMod = [
	               {name:'equipmentId', index:'equipmentId', hidden:true},
	               {name:'shipmentId', index:'shipmentId', hidden:true},
	               {name:'shipmentStatus', index:'shipmentStatus', hidden:true},
	               {name:'containerNoCheckDigit', index:'containerNoCheckDigit', width:180, sortable:true, edittype:'button',
					   editable:true,editrules : {required : true}, 
		            	editoptions: {maxlength: 13,
						dataEvents: [
									{
									//changed for D023317
		        		              type: 'click',
		        		              fn: function(e) {
		        		                  var el = $(this);
										  $(el).val($(el).val().toUpperCase());
										   openOverlay('?id='+$(el).val());
		        		             }
	            		          }
		            		      ]
		                      	}
						,formatter : 'showlink',
						formatoptions : {
							baseLinkUrl : "javascript:",
							showAction : "openOverlay('",
							addParam : "');"
						}},          
		           {name:'planEquipTypeCode', index:'planEquipTypeCode', width:60, sortable:true},
	               {name:'seal', index:'seal', width:90, sortable:true, editable:true, editoptions: {maxlength: 15}},
	               {name:'oldSeal', index:'oldSeal', hidden:true},
	               {name:'equipmentLogId', index:'equipmentLogId', hidden:true},
	               {name:'pieces',index:'pieces', sortable:true, width:90, editable:true, editoptions: {maxlength: 7},
	            	   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var pcs = $.trim(value);
	                			if(value != '' && $.trim(value) == ''){
	                				return [false, colname+": No blank spaces are allowed."];
	                			}
	                			if($("#"+currentRowId+"kind").val()!='' && pcs==''){
	                				return [false, colname+": This is required if Kind is entered."];
	                			}
	                			
	                			if(pcs!='' && pcs<0){
	                				return [false, colname+": This can't be less than zero."];
	                			}
	                			if(pcs!='' && pcs==0){
	                				return [false, colname+": This can't be zero."];
	                			}
	                			if(pcs!='' && !/^[0-9]+$/.test(pcs)){
	                				return [false, colname+": Only Numbers allowed."];
	                			}
	                			else if(pcs!='' && pcs>999999){
	                				return [false, colname+": This can't be greater than 999999. Decrease the no by "+(parseInt(pcs) - parseInt(999999))];
	                			}
	                			else{
	                				value = pcs;
									return [true,""];
								}
	                		}
	                	} 
	               },
	               {name:'kind',index:'kind',sortable:true, width:95, editable:true, 
	            	   editoptions: {maxlength: 4,
			            	   dataEvents: [
											{
			        		                    type: 'change',
			        		                    fn: function(e) {
			        		                    	var el = $(this);
			        		                    	$(el).val($(el).val().toUpperCase());
			        		                    }
		            		                }
			            		            ]
			               
	               }, 
	            	   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var kind = $.trim(value);
	                			if($.trim($("#"+currentRowId+"pieces").val())!='' && kind==''){
	                				return [false, colname+": This is required if Pieces is entered."];
	                			}
	                			/*else if(kind!='' && !/^[a-zA-Z]+$/.test(kind)){
	                				return [false, colname+": Only alphabets allowed."];
	                			}*/
	                			else{
	                				value = kind;
									return [true,""];
								}
	                		}
	                	} 
	               },
	               {name:'cntrWeight',index:'cntrWeight',sortable:true, width:122, editable:true,
	            	   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname){
	                			var reg7Number3DecimalPlaces = /^[0-9]{0,7}(\.[0-9]{1,3})?$/;
	                			var reg7Number = /^[0-9]{1,7}$/;
	                			var proRate = $.trim($("#"+currentRowId+"prorate").val());

	                			if((proRate != '' && proRate == 'W')  || value != ''){
		                			if(value != '' && $.trim(value)==''){
		                				value = $.trim(value);
		                				return [false, colname+":No blank spaces are allowed."];
		                			} 
		                			else{
		                				 switch($('#unitOfMeasureSourceCode').val())
		                			     {
		                			         case "M": 
		                			        	 if(isNaN(value)){ 
		         		            				return [false,colname+ ": Weight must be numeric."];
		         		            			 }
		                			        	 if(!reg7Number3DecimalPlaces.test(value)) {
		                			        		 return [false, colname+": Only 7 numbers before decimal and 3 numbers after decimal are allowed.No blank spaces are allowed."];
		                			        	 }
		                			        	 /*if(!isNaN(parseFloat(value)) && $.trim(parseFloat(value))>parseFloat($("#metricWeightLimit").val())) {
		                			        		 return [false, colname+": Weight can't exceed "+$("#metricWeightLimit").val()+"."];
		                			        	 }*/
		                			         break;
		                			         case "I": 
		                			        	 if(isNaN(value)){ 
		         		            				return [false,colname+ ": Weight must be numeric."];
		         		            			 }
		                			        	 if(!reg7Number.test(value)) {
		                			        		 return [false, colname+": Max 7 numbers are allowed. No blank spaces are allowed."];
		                			        	 }
		                			        	 
		                			        	 /*if(!isNaN(parseFloat(value)) && $.trim(parseFloat(value))>parseFloat($("#imperialWeightLimit").val())) {
		                			        		 return [false, colname+": Weight can't exceed "+$("#imperialWeightLimit").val()+"."];
		                			        	 }*/
		                			         break;
		                			     }
		                			}
	                			}
	                			return [true, ""];
	                		}
	            	   },
	            	   formatter:float3DecimalFormat
	               },
	               {name:'cntrCube',index:'cntrCube', sortable:true, width:90,editable:true,
	            	   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname){
	                			var reg6Number4DecimalPlaces = /^[0-9]{0,6}(\.[0-9]{1,4})?$/;
	                			var reg8Number = /^[0-9]{1,8}$/;
	                			var proRate = $.trim($("#"+currentRowId+"prorate").val());
	                			
	                			if((proRate != '' && proRate == 'C')  || value != ''){
		                		   if(value != '' && $.trim(value)==''){
		                				value = $.trim(value);
		                				return [false, colname+":No blank spaces are allowed."];
		                			}
		                			else{
		                				 switch($('#unitOfMeasureSourceCode').val())
		                			     {
		                			     	case "M": 
		                			     		 if(isNaN(value)){ 
		     	 		            				return [false,colname+ ": Cube must be numeric."];
		     	                				  }  
		                			        	 if(!reg6Number4DecimalPlaces.test(value)) {
		                			        		 return [false, colname+": Only 6 numbers before decimal and 4 numbers after decimal are allowed. No blank spaces allowed."];
		                			        	 }
		                			        	 else{
		                			        		 var reg4DecimalPlaces = /^\d+(?:\.\d{4})?$/;
		                			        		 //alert("reg4DecimalPlaces: " + reg4DecimalPlaces.test($("#cube").val()));
		                			        		 
		                			        		 if(reg4DecimalPlaces.test(value)) {
		                			        			 value = Math.round(parseFloat(value)*Math.pow(10,3))/Math.pow(10,3);
		                			        			 $("#"+currentRowId+"cntrCube").val(value);
		                			        			 //$("#cube").val(parseFloat(result).toFixed(3));
		                			            	}
		                			        	 }
		                			        	 
		                			         break;
		                			         case "I": 
		                			        	 if(isNaN(value)){ 
		     	 		            				return [false,colname+ ": Cube must be numeric."];
		     	                				  }  
		                			        	 if(!reg8Number.test(value)) {
		                			        		 return [false, colname+": Max 8 numbers are allowed. No blank spaces allowed."];
		                			        	}
		                			         break;
		                			         default: 
		                			        	 if(!reg6Number4DecimalPlaces.test(value)) {
		                			        		 return [false, colname+": Only 6 numbers before decimal and 4 numbers after decimal are allowed. No blank spaces allowed."];
		                			        	}
		                			     }
		                			}
	                			}
	                			return [true, ""];
	                		}
	            	   },
	            	   formatter:float3DecimalFormat
	               },
	               {name:'prorate',index:'prorate', width:100, sortable:true,editable:true, edittype:"select",editoptions:{value:":;C:C;W:W"}},
	               {name:'planEquipType', index:'planEquipType', hidden:true},
	               {name:'recFreightId', index:'recFreightId', hidden:true},
	 	           {name:'tempNotRequired', index:'tempNotRequired', hidden:true},
	               {name:'temp',index:'temp', width:60,sortable:true, editable:true, editoptions: {maxlength: 5,
				   dataEvents: [
									{  type: 'change',
									fn: function(e) { 
									var e1=$(this);
									if(e1.val()=="AMB" || e1.val()=="amb"){
									$('#'+currentRowId+'scale').attr('disabled',true);
									}else{$('#'+currentRowId+'scale').attr('disabled',false);
									}
									} } ]//Defect-25000 added code to disbale temperature scale field when temperature is AMB/amb
									
				   },
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			
	                			var temperature = $.trim(value);
								temp1=temperature;
								if(temperature != undefined && temperature != '' && temperature !== "AMB" && temperature!=="amb")
	                				$("#"+currentRowId+"temp").val(parseInt(temperature));
	                			var tempCurrentRowId = currentRowId.replace('_','');	
	                			var planEqValue = $('#containerGrid').jqGrid('getCell', tempCurrentRowId, 'planEquipType');
	                			//var planEqValue = $('#containerGrid').jqGrid('getCell', currentRowId1, 'planEquipType');

	                			if(planEqValue !='' && planEqValue !='R' && temperature !=''){
		            				return [false, colname+": This is valid only for refrigerated equipment."];
								}
	                			
	                			var tempNotReq = $('#containerGrid').jqGrid('getCell', tempCurrentRowId, 'tempNotRequired');
	                			
	                			console.log("currentRowId: "+currentRowId+" "+tempNotReq);
	                			var invalidTempMsg = "This is invalid.";
	                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
	                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
	                			//alert("isTempFirstLetterPlusDot: " + isTempFirstLetterPlusDot.test(value));
	                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
	                			//alert("regTemp: " + regTemp.test(value));
	                			//	D031084: 	International Container Maintenance - Unable to input Temp & Scale 
	                			var shipmentStatus = $('#containerGrid').jqGrid('getCell', tempCurrentRowId, 'shipmentStatus');
	                			//D030556
	                			if(tempNotReq === "true" && $.trim(value) != ''){
	                				if($.trim(value).toUpperCase() === "AMB"){
	                					return [true, ""];
	                				} else{
	                					return [false, colname+": This is valid only for operational refrigerated equipment."];
	                				}
								} else if(isTempFirstLetterPlusMinusDot.test(temperature)){
	                				return [false, colname+": "+invalidTempMsg];
	                			} else if(isTempFirstLetterPlusDot.test(temperature)){
	                				return [false, colname+": "+invalidTempMsg];
	                			} else if(temp1.toUpperCase()=="AMB" ){
	                				return [true,""];
	                			} else if(!regTemp.test(temperature)){
	                				return [false, colname+": "+invalidTempMsg];
	                			}else if((shipmentStatus == null || shipmentStatus == '') && planEqValue !='' && planEqValue =='R' && tempNotReq == "false" && $.trim(value)==''){
		            				return [false, colname+": This must be specified for refrigerated equipment."];
								} else {
									console.log('final else')
									return [true, ""];
								}
	                			
	                		}
	                	}},
	               {name:'scale',index:'scale', width:60,sortable:true, editable:true, edittype:"select", 
				   editoptions:{value:":;F:F;C:C"} ,
						editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
								var temp = $.trim($("#"+currentRowId+"temp").val());
	                			if(temp!='' && temp!=="AMB" && value=='' && temp!=="amb" && (!(isNaN(temp)))){
		            				return [false, colname+": This must be specified for Temperature."];
								}
	                			else if((temp=='' || temp==="AMB") && value!='' && temp==="amb"){
	                				return [false, colname+": This is valid only if Temperature is provided."];
	                			}
		            			else{
									return [true,""];
								}
	                		}
	                	} 	
	               },
	               {name:'statusView',index:'statusView',sortable:true, width:145, editable:true, editrules:{required:true}, edittype:"select",editoptions:{value:"Pre-Received:Pre-Received"}},
	               {name:'status', index:'status', hidden:true},
	               {name:'actions', index:'actions', width:95, align:"center", editable:false, search:false, sortable:false, formatter:'actions',
							formatoptions:{
	            		   keys:false,
						   delbutton : false, 
		            	editbutton:false,
		            	//changed for D023317
	            		 /*  url: _context+'/containerBilling/updateContainerGrid', 
	            			onEdit:function(rowId) {
	            				 //alert("onEdit rowId: " + rowId);
								 currentRowId = rowId+"_";
				                 if($('#containerGrid').jqGrid('getCell', rowId, 'equipmentId')!=''){
									$('#'+'containerGrid'+' tbody tr#'+rowId+' td input#'+rowId+'_containerNoCheckDigit').attr('disabled','disabled');
									$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView').attr('disabled','disabled');
									var containerStatus = $('#containerGrid tbody tr#'+rowId+' td[aria-describedby="containerGrid_statusView"]').attr('title');
									$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView option').text(containerStatus);
									//$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView').replaceWith(containerStatus);
								 }
				                 var shipmentStatus = $('#containerGrid').jqGrid('getCell', rowId, 'shipmentStatus');
				                 if(shipmentStatus != null && shipmentStatus != ''){
				                	 $('#'+currentRowId+'seal').attr('disabled',true);
				                	 $('#'+currentRowId+'temp').attr('disabled',true);
				                	 $('#'+currentRowId+'scale').attr('disabled',true);
				                 }else{
				                	 $('#'+currentRowId+'seal').attr('disabled',false);
				                	 $('#'+currentRowId+'temp').attr('disabled',false);
				                	 $('#'+currentRowId+'scale').attr('disabled',false);
				                 }
				                 
				                  if(shipmentStatus != null && shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'){
				                	  $('#msgDiv').show();
				                	  $('#msgDiv').html("<div class=\"message_warning\">Container has been ISSD or CORR,Freight Correction is required.</div>");
				                	  window.scrollTo(0, 0);
				                	  $('#containerGrid').jqGrid('restoreRow',rowId);
				                 }else{
				                	 $('#msgDiv').hide();
				                 }
				           },
				           afterSave: function() {
								$("#containerGrid").trigger('reloadGrid');
								return true;
							},
				           onSuccess:function(jqXHR){
								//alert("onSuccess currentRowId before: " + currentRowId);
								$('table[aria-labelledby="gbox_containerGrid"] tr[id="tr_equipmentId"] td [id="containerNoCheckDigit"]').type="text";
				        	   currentRowId='';
								return true;
							},
							afterRestore:function(){
								//alert("afterRestore before: " + currentRowId);
								$("#containerGrid").trigger("reloadGrid");
								currentRowId='';
							}*/
	            	   }
	               }

			   	];

	
	var jsonReaderContainer = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "equipmentId"
		};
	
	/*createGrid(
			"containerGrid", // grid id for user
			"containerGridPager", // page id for user 
			_context+'/containerBilling/loadContainerGrid', 
			_context+'/containerBilling/addContainerGrid', 
			_context+'/containerBilling/updateContainerGrid', 
			_context+'/containerBilling/delete', 
			'',
			containerCol, 
			containerMod, 
			"Containers",
			83,
			3,
			[3,6,9,12,15,18,21,24,27,30],
			true,
			false,
			false, //load once
			false, jsonReaderContainer,false,false,true,true,true,false,false,false,containerLoadComplete,false,true);
	
	$("#containerGrid").jqGrid('setGridParam',{
		onSelectRow: function(rowId){
			var selectedRow = jQuery("#containerGrid").getGridParam('selarrrow');
			if(selectedRow.length>1){
				$('#bill').attr("disabled", true);
			}
			else{
				var rowData = jQuery(this).getRowData(rowId); 
	            var shipmentId = rowData['shipmentId'];
				if(rowData['status']=="Received" && (shipmentId=="" || shipmentId==null)){
					$('#bill').attr("disabled", false);
				}
				else{
					$('#bill').attr("disabled", true);
				}
			}
		}
	}); */
	//changed for D023317
	$('#containerGrid').gatesGrid({
		caption: "Containers",
		colNames: containerCol,
		colModel: containerMod,
		jsonReader: jsonReaderContainer,
		pager: '#containerGridPager',
		rowNum: 20,
		rowList: [20,50,500],
		height: 520,
		multiselect:true,
		gatesOptions: {
			urls: {load: _context+'/containerBilling/loadContainerGrid',
				   add: _context+'/containerBilling/addContainerGrid', 
				   edit: _context+'/containerBilling/updateContainerGrid', 
				   del: _context+'/containerBilling/delete',
				    delMultiple: _context+'/containerBilling/delete'},
			loadComplete: containerLoadComplete,
			gridComplete:containerGridComplete,
			controls: {
				navBarAdd: false,
				navBarEdit: false,
				navBarDelete: true
			}
		},
		afterInsertRow: function(rowId,rowdata,rowelem ){
			 $('#containerNoCheckDigit').focus(); 
          },
		onSelectRow: function(rowId){
			
			var selectedRow = jQuery("#containerGrid").getGridParam('selarrrow');
			if(selectedRow.length > 1){
				$('#bill').attr("disabled", true);
			}
			else{
				var rowData = jQuery(this).getRowData(rowId); 
	            var shipmentId = rowData['shipmentId'];
				if($('#stsDiv').text() == 'APPR' && rowData['status']== "Received" && (shipmentId=="" || shipmentId==null)){
					$('#bill').attr("disabled", false);
				}
				else{
					$('#bill').attr("disabled", true);
				}
			}
			var isDisabled = $('#jqg_containerGrid_'+rowId).attr('disabled');
			if(isDisabled == 'disabled'){
				$('#jqg_containerGrid_'+rowId).removeAttr('checked');
				$('#'+'containerGrid'+' tbody tr#'+rowId+"'").removeClass("ui-state-highlight");
			}
			
			//D030363: 	D029804 container variance on MATU232028 (BK# 2178503)- container is not linked to the booking message
			var containerVarianceEnable = true;
			var selectedRows=jQuery("#containerGrid").jqGrid('getGridParam', 'selarrrow'); 
			for(var i=0;i<selectedRows.length;i++){
				var currentRow=$("#containerGrid").jqGrid('getRowData',selectedRows[i]); 
				if(currentRow.status == "Pre-Received"){
					containerVarianceEnable = false;
				}
			}
			
			if(selectedRow.length >= 1 && containerVarianceEnable){
				$('#containerVariance').attr("disabled", false);
			}else{
				$('#containerVariance').attr("disabled", true);
			}
		}
	});
});

//D025912:International Container Maintenance: should convert the alpha characters to upper case to find the equipment 
$('#containerNoCheckDigit').live( "change", function(e) {
	var el = $(this);
	$(el).val($(el).val().toUpperCase());
});

//Fix for - D024642
function float3DecimalFormat(cellvalue, options, rowObject){
	if(cellvalue != null && $.trim(cellvalue) != '' && $('#unitOfMeasureSourceCode').val() === "M"){
		return parseFloat(cellvalue).toFixed(3);
	}
	return $.trim(cellvalue);
}

function manageInlineCheckboxVisibility() {
	var colName ='status';
	var dataIDs = jQuery('#containerGrid').getDataIDs();
	for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
		var dataId = dataIDs[rowId];
		var colValue = $('#containerGrid').jqGrid('getCell', dataId, colName);
		if(colValue == 'Pre-Received'){
		//changed for D023317
		//	$('#'+'containerGrid'+' tbody tr#'+dataId+' td input#jqg_containerGrid_'+dataId+"'").attr('disabled','disabled');
			$('#'+'containerGrid'+' tbody tr#'+dataId+"'").removeClass("ui-state-highlight");
		} 
	}
}

function openOverlay(id) {
//changed for D023317
	var containerId1 = id.split('=')[1];
	var containerId = containerId1.split('-')[0]
	var shipmentStatus = $('#containerGrid').jqGrid('getCell', containerId, 'shipmentStatus');
	 if(shipmentStatus != null && shipmentStatus != ''){
		 $('#sealNumber').attr("readonly", true);
		 $('#sealNumber').css("background-color","lightgray");
		 $('#temperature').attr("readonly", true);
		 $('#temperature').css("background-color","lightgray");
		 
    	 $('#temperatureUnitOfMeasureCd').attr('disabled',true);
     }else{
    	 $('#sealNumber').attr("readonly", false);
		 $('#sealNumber').css("background-color","");
		 $('#temperature').attr("readonly", false);
		 $('#temperature').css("background-color","");
    	 $('#temperatureUnitOfMeasureCd').attr('disabled',false);
     }
	if(shipmentStatus != null && shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'){
		$('#msgDiv').show();
		$('#msgDiv').html("<div class=\"message_warning\">Container has been ISSD or CORR,Freight Correction is required.</div>");
		window.scrollTo(0, 0);
		return false;
	}else{
		$('#msgDiv').hide();
	}
	
	$.ajax({
		url : _context +"/containerBilling/getcontainerDtls",
		type : "GET",
		data : {
			containerID : containerId,
			bookingID : $('#shipmentNumber').val()},
		success : function(responseText) {
			clearWebPageSection('containerForm');
			if(responseText.success){			
				$("#containerForm").loadJSON(responseText.data);
				$("#containerDialog").dialog("option", "title", 'Container');
				$("#containerDialog").dialog("option", "buttons", [ {
					text : "Cancel",
					click : function() {
						cancelContainer();
					}
				}, {
					text : "Ok",
					click : function() {
						updateContainer();
					}
				} ]);
				
				
				$("#containerDialog").dialog('open');
				
				createSpecialServiceGrid("container");
				
				$("#referenceNumberGrid").trigger('reloadGrid');
				$("#specialServiceGrid").trigger('reloadGrid');
				$('#containerForm').validationEngine('attach');
				setContainerDefaults();
				
			}
//			Security Implementation
			if(isCtrBillMaintenanceModifiable == false && isCtrReferenceNumberModifiable == false && isSpecialServiceModifiable == false) {
				$(".ui-dialog-buttonpane button:contains('Ok')").attr("disabled", true).addClass('ui-state-disabled');
			}
			enforceSecurityOnReferenceNumbers();
			
		}
	});
	}

function updateContainer() {

	if ($("#containerForm").validationEngine('validate')) {
		var queryString = $('#containerForm').formSerialize();
		$.ajax({
			url : _context +"/containerBilling/updateContainer",
			type : "POST",
			data : queryString,
			success : function(responseText) {
				
				if (responseText.success == true) {
					$("#containerGrid").trigger("reloadGrid");
					
					$("#containerDialog").dialog('close');
				} else {

						$("#containerDialog").dialog('close');
				}
			}
		});
	} else
		return;
}
//changed for D023317
function updateContainerGrid() {
	
	var dataIDs = jQuery("#containerGrid").getDataIDs();
	for (var i = 0; i < dataIDs.length ; i++) {
	
		 var rowId = $('#containerGrid').getCell(dataIDs[i], 'equipmentId');
		
	   currentRowId = rowId+"_";
	    var shipmentStatus = $('#containerGrid').jqGrid('getCell', rowId, 'shipmentStatus');
	
				                	 
		var isSuccess = $('#containerGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/containerBilling/updateContainerGrid' //Url
	   );
	   if(!isSuccess && !(shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'))
	   {
	   containerUpdateSuccess=false;
	   break;
	   }
	   else
	   {
	   containerUpdateSuccess=true;
	}
	
	}
	 editAllContainers();
	return;
		
}

function manageInlineDeleteVisibility(gridId) {
	var dataIDs = jQuery('#' + gridId).getDataIDs();
	for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
		var dataId = $.trim(dataIDs[rowId]);
		var colValue = $('#' + gridId).jqGrid('getCell', dataId, 'status');
		if(colValue != 'Pre-Received'){
			$('#containerGrid tbody tr#'+dataId+' td div.ui-inline-del').hide();
		} 
		var shipmentId = $('#' + gridId).jqGrid('getCell', dataId, 'shipmentId');
		if(shipmentId != null && shipmentId != ''){
			$('#shipmentStatus').val(true);
		}
	}
}
var containerGridComplete = function(){
	var rowIDs = jQuery("#containerGrid").getDataIDs();
	var headerStr = "Container";
	if(rowIDs.length > 1){
		var dataId = rowIDs[0];
		var colValue = $('#containerGrid').jqGrid('getCell',dataId, 'containerNoCheckDigit');
		var colStatusValue = $('#containerGrid').jqGrid('getCell',dataId, 'status');
		headerStr = "Container - " + colValue +" | "+colStatusValue+ " | (Multiple)";
	}else if(rowIDs.length == 1){
		var dataId = rowIDs[0];
		var colValue = $('#containerGrid').jqGrid('getCell',dataId, 'containerNoCheckDigit');
		var colStatusValue = $('#containerGrid').jqGrid('getCell',dataId, 'status');
		headerStr = "Container - " + colValue +" | "+colStatusValue;
	}
     setAccordianTabDetails('containerHeader', headerStr);
     //changed for D023317
     editAllContainers();
    return true;
};

var containerLoadComplete = function(){
	//$('#cb_containerGrid').attr('disabled','disabled');
	//$('#containerGridPager .ui-pg-input').attr("readonly", true);
	manageInlineDeleteVisibility('containerGrid');
	manageInlineCheckboxVisibility();
	//Clears and hides error row
	$('table[aria-labelledby="gbox_containerGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_containerGrid"] thead tr[id="FormError"]').hide();
	
	//Clears input data for grid
	$('#tr_equipmentId td input').val('');
	$('#tr_equipmentId td select').val('');
	//Fix for - D024642
	if($('#unitOfMeasureSourceCode').val() === "M"){
		jQuery("#containerGrid").jqGrid('setLabel', 'cntrWeight', 'Weight(kgs)');
		jQuery("#containerGrid").jqGrid('setLabel', 'cntrCube', 'Cube(m)');
	} else{
		jQuery("#containerGrid").jqGrid('setLabel', 'cntrWeight', 'Weight(lbs)');
		jQuery("#containerGrid").jqGrid('setLabel', 'cntrCube', 'Cube(ft)');
	}
	enforceSecurityOnContainer();
	//changed for D023317
	   editAllContainers();
	  
	    $('table[aria-labelledby="gbox_containerGrid"] tr[id="tr_equipmentId"] td [id="containerNoCheckDigit"]').parent().html('<input type="text" maxlength="13" id="containerNoCheckDigit" name="containerNoCheckDigit" role="textbox" class="FormElement">');
	   currentRowId='';
	   $('#containerNoCheckDigit').focus();
	   
	  var rowIDs = jQuery("#containerGrid").getDataIDs();
				for (var i=0;i<rowIDs.length;i=i+1)
				 { 
				   var id = $('#containerGrid').getCell(rowIDs[i], 'equipmentId');
				   var rowData=jQuery("#containerGrid").getRowData(rowIDs[i]);
				   if(rowData.status!='Pre-Received'){
					  
				   $(".ui-inline-del", "#gbox_containerGrid #"+rowIDs[i]).hide();
					   $('#jqg_containerGrid_'+id).attr("checked",false);
					   $('#jqg_containerGrid_'+id).hide();
					    $('#jqg_containerGrid_'+id).attr('disabled','disabled');
					   $('table[aria-labelledby="gbox_containerGrid"] tbody tr#' + rowIDs[i]).removeClass('ui-state-highlight');
				   }
				 } 
	   
	return true;
};
//changed for D023317
function editAllContainers(){
	var rowIDs = jQuery("#containerGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowId = $('#containerGrid').getCell(rowIDs[i], 'equipmentId');
	   $('#containerGrid').jqGrid('editRow', rowId, false, ContainerOnEdit);
    }
}

var ContainerOnEdit=function(rowId) {
	            				 //alert("onEdit rowId: " + rowId);
								 currentRowId = rowId+"_";
				                 if($('#containerGrid').jqGrid('getCell', rowId, 'equipmentId')!=''){
							
									//$('#'+'containerGrid'+' tbody tr#'+rowId+' td input#'+rowId+'_containerNoCheckDigit').attr('disabled',true);
									
									$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView').attr('disabled','disabled');
									var containerStatus = $('#containerGrid tbody tr#'+rowId+' td[aria-describedby="containerGrid_statusView"]').attr('title');
									$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView option').text(containerStatus);
									//$('#'+'containerGrid'+' tbody tr#'+rowId+' td select#'+rowId+'_statusView').replaceWith(containerStatus);
								 }
				                 var shipmentStatus = $('#containerGrid').jqGrid('getCell', rowId, 'shipmentStatus');
				                 if(shipmentStatus != null && shipmentStatus != ''){
				                	 $('#'+currentRowId+'seal').attr('disabled',true);
				                	 $('#'+currentRowId+'temp').attr('disabled',true);
				                	 $('#'+currentRowId+'scale').attr('disabled',true);
				                 }else{
				                	 $('#'+currentRowId+'seal').attr('disabled',false);
				                	 $('#'+currentRowId+'temp').attr('disabled',false);
				                	 $('#'+currentRowId+'scale').attr('disabled',false);
				                 }
				                 
				                  if(shipmentStatus != null && shipmentStatus == 'ISSD' || shipmentStatus == 'CORR'){
				                	//  $('#msgDiv').show();
				                	//  $('#msgDiv').html("<div class=\"message_warning\">Container has been ISSD or CORR,Freight Correction is required.</div>");
				                	 // window.scrollTo(0, 0);
				                	  $('#containerGrid').jqGrid('restoreRow',rowId);
				                 }else{
				                	 //$('#msgDiv').hide();
				                 }
				           };

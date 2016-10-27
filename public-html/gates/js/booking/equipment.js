var currentRowId='';
var updateEquipmentErrorOccurred = false;
var equipmentUpdated = false;
/* Users will not add equipment to most conventional bookings. Collapse equipment grid as the standard and user will expand as needed */
var defaultHidden = false;
var somethingChanged; // Added this to remove grid delete error, can remove it if it is in the way.

$(function() {
	$("#maintain_characteristics").dialog({
		autoOpen : false,
		width : 540,
		modal : true,
		title: "Maintain Equipment Characteristics",
		open : function()
		{
			createEquipmentCharacteristicGrid();
		},
		close : function() {
			$('#currentEquipmentChars').val('');
			$('#characteristicsMsgDiv').html('');
			$('#gridIdForCharacteristic').jqGrid('GridUnload');
		}
	});
});
//D031125: 	Implement design for KFF Temperature and Dual Temperature Refers for the Alaska trade
function createEquipmentGrid(){
	equipmentUpdated = false;
	currentRowId='';
	var equipmentColNames = ['Id', 'Quantity', 'Type', 'Size','Height', 'E/F', 'Temp', 'F/C', 'Temp2', 'Characteristics', 'Actions'];
	var equipmentColModels = [
	               {name:'equipmentSeqNo', index:'equipmentSeqNo', editable:false, hidden:true},	     
	               {name:'quantityRequested', index:'quantityRequested', width:70, editable:true, 
	            	   editoptions: {
	            		   maxlength: 5,
	            		   dataEvents: [
	            		                {
	            		                    type: 'change',
	            		                    fn: function(e) {
	            		                    	//var newCodeValue = $(e.target).val();
            		                            // inline editing
            		                            var row = $(e.target).closest('tr.jqgrow');
            		                            var rowId = row.attr('id');
	            		                    	disableAddDelete(rowId);
	            		                    	if(rowId==undefined){
	            		                    		if($.trim($('#quantityRequested').val())==''){
	            		                    			$('#quantityRequested').val('');
		            		                    	}
            		                            }
	            		                    	else{
	            		                    		if($.trim($('#'+rowId+'_quantityRequested').val())==''){
	            		                    			$('#'+rowId+'_quantityRequested').val('');
		            		                    	}
	            		                    	}
	            		                    }
	            		                }
	            		            ]
	            	   }, 
	            	   editrules:{
	            		   custom:true,
	            		   custom_func:function (value, colname) {
	            				   if($.trim(value)!='undefined' && $.trim(value)!=null && $.trim(value)!=''){
	            					   if($.trim(value)<0){
			            				   return [false, colname+": Must be zero or greater than zero."];
			            			   }
		            				   else if(!/^[0-9\ ]+$/.test($.trim(value)) || $.trim(value)>32767){
			            				   return [false, colname+": Only numerics allowed between range[0-32767]."];
			            			   }
			            			   else{
			            				   return [true,""];
			            			   }
	            				   }
	            				   else{
		            				   return [true,""];
		            			   }
	            			   /*}*/
	            		   }
            	}},
	               {name:'eqpType',index:'eqpType', width:45, editable:true, 
            		editoptions: {
         			   size:1, 
         			   maxlength: 1,
         			   			   dataEvents: [
	            		                {
	            		                    type: 'change',
	            		                    fn: function(e) {
	            		                    	var row = $(e.target).closest('tr.jqgrow');
            		                            var rowId = row.attr('id');
	            		                    	disableAddDelete(rowId);
	            		                    }
	            		                },
	            		                    {
 	            		                	type: 'keyup', fn: function(event){
 	            		                		var el = $(this);
 	            		                		  		
 	            		                		var keyCode=event.keyCode;
 	            		                		if(keyCode==32 || (48<=keyCode && keyCode<=57)
	 	            		                				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
	 	            		                				|| (109<=keyCode && keyCode<=111))
	 	            		                		{
 	            		                			  	var maxlength = $(el).attr('maxlength'); // get maxlength value
 	            		                			     var inputlength = $(el).val().length; // get the length of the text
 	            		                			     
 	            		                			     if ( inputlength >= maxlength ){ // if the text is equal of more than the max length
 	            		                			    
 	            		                			    $(event.target).closest('td').next().find('input').focus();
 	            		                			    	 	
 	            		                			     } 
 	            		                			}
 	            		                	}
 	            		                    }
	            		            ]
         			   },
	            	   editrules:{
	                		required:true,
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			if(!/^[a-zA-Z]+$/.test($.trim(value))){
	                				return [false, colname+": Only alphabets allowed."];
	                			}
	                			else{
									return [true,""];
								}
	                		}
	                	}},
	               {name:'eqpSize',index:'eqpSize', width:45, editable:true, 
	                		editoptions: {
	                			size:2, 
	                			maxlength:2,
	                			dataEvents: [
	 	            		                {
	 	            		                    type: 'change',
	 	            		                    fn: function(e) {
	 	            		                    	var row = $(e.target).closest('tr.jqgrow');
	            		                            var rowId = row.attr('id');
	 	            		                    	disableAddDelete(rowId); 
	 	            		                    }
	 	            		                	},
	 	            		                    {
	 	            		                	type: 'keyup', fn: function(event){
	 	            		                		var el = $(this);
	 	            		                		
	 	            		                		var keyCode=event.keyCode;
	 	            		                		if(keyCode==32 || (48<=keyCode && keyCode<=57)
		 	            		                				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
		 	            		                				|| (109<=keyCode && keyCode<=111))
		 	            		                		{	
	 	            		                		var maxlength = $(el).attr('maxlength'); // get maxlength value
	 	            		                			     var inputlength = $(el).val().length; // get the length of the text
	 	            		                			     
	 	            		                			     if ( inputlength >= maxlength ){ // if the text is equal of more than the max length
	 	            		                			    
	 	            		                			    $(event.target).closest('td').next().find('input').focus();
	 	            		                			    	 	
	 	            		                			     } 
	 	            		                		}
	 	            		                	}
	 	            		                    }
	 	            		                
	 	            		            ]
	                			},  
		                	editrules:{
		                		/*required:true,*/
		                		custom:true,
		                		custom_func:function (value, colname) {
		                			if(($('#bookingTypeCode').val()=='B' && $.trim($('#shipmentNumber').val())=='' && $.trim(value)!='') || ($('#bookingTypeCode').val()=='B' && $.trim($('#shipmentNumber').val())!='') || ($('#bookingTypeCode').val()=='T' && $.trim(value)!='')){
			                			var tradeCode = $('#tradeCode').val();
			                			var portOfDischarge = $('#destinationPortCityCode').val();
			                			if($.trim(value)==''){
			                				return [false, colname+": Field is required."];
			                			}
			                			else if(!/^[0-9]+$/.test($.trim(value))){
			                				return [false, colname+": Only numerics allowed between range[0-99]."];
			                			}
			                			else if($.trim(value)==24 && (tradeCode=='G' || tradeCode=='F')){
				            				return [false, colname+": 24' equipment length is not allowed when the trade is G or F."];
										}
			                			else if($.trim(value)==45 && (portOfDischarge=='PUX' || portOfDischarge=='YAP'|| portOfDischarge=='UUK' || portOfDischarge=='PNP')){
			                				return [false, colname+": 45' equipment length is not allowed for port of discharge- PUX, YAP, UUK or PNP."];
			                			}
			                			else{
											return [true,""];
										}
		                			}
		                			else{
										return [true,""];
									}
		                		}
		                	}, formatter:formatZeroToSpace},
		            {name:'eqpHeight', index:'eqpHeight', width:50, editable:true, 
		                		editoptions: {
		                			size:1, 
		                			maxlength: 1,
		                			dataEvents: [
		 	            		                {
		 	            		                    type: 'change',
		 	            		                    fn: function(e) {
		 	            		                    	this.value = this.value.replace(/\s/g, "");
		 	            		                    	var row = $(e.target).closest('tr.jqgrow');
		            		                            var rowId = row.attr('id');
		 	            		                    	disableAddDelete(rowId);
		 	            		                    }
		 	            		                },
		            		                    {
		 	            		                	type: 'keyup', fn: function(event){
		 	            		                		var el = $(this);
		 	            		                		//D029611: Do not allow space char
		 	            		                		var keyCode=event.keyCode;
		 	            		                		if(keyCode == 32){
		 	            		                			this.value = this.value.replace(/\s/g, "");
		 	            		                			return false;
		 	            		                		}
		 	            		                		if((48<=keyCode && keyCode<=57)
 		 	            		                				|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
 		 	            		                				|| (109<=keyCode && keyCode<=111))
 		 	            		                		{	
		 	            		                		var maxlength = $(el).attr('maxlength'); // get maxlength value
		 	            		                			     var inputlength = $(el).val().length; // get the length of the text
		 	            		                			     
		 	            		                			     if ( inputlength >= maxlength ){ // if the text is equal of more than the max length
		 	            		                			    $(event.target).closest('td').next().find('select').focus();
		 	            		                			    	 	
		 	            		                			     } 
		 	            		                		}
		 	            		                	}
		 	            		                    }
		 	            		            ]
		                			}},
		            {name:'emptyFullCode', index:'emptyFullCode', width:50, editable:true, editrules:{required:true}, edittype:"select", formatter:'select', 
		                				editoptions:{
		                					value:"F:F;E:E", 
		                					defaultValue:'F',
		                					dataEvents: [
		         	            		                {
		         	            		                    type: 'change',
		         	            		                    fn: function(e) {
		         	            		                    	var row = $(e.target).closest('tr.jqgrow');
		                    		                            var rowId = row.attr('id');
		         	            		                    	disableAddDelete(rowId);
		         	            		                    }
		         	            		                }
		         	            		            ]
		                				}},
		            {name:'temperature', index:'temperature', width:70, editable:true, 
    					editoptions: {
		                	maxlength: 5,
		                	dataEvents: [
	 	            		                {
	 	            		                    type: 'change',
	 	            		                    fn: function(e) {
	 	            		                    	var row = $(e.target).closest('tr.jqgrow');
	            		                            var rowId = row.attr('id');
	 	            		                    	disableAddDelete(rowId);
	 	            		                    }
	 	            		                }
	 	            		            ]
		                }, 
		                formatter:'spaceFormatter',
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var tradeCode = $('#tradeCode').val();
	                			//Defect-25116-Added code to validate temperature when booking created from template
	                			if($('#bookingTypeCode').val()=='B' && ($.trim($('#bookingTemplateId').val())=='' || $.trim($('#shipmentNumber').val())!=''||$.trim($('#bookingTemplateId').val())!='')){
	                				var equipType = $.trim($("#"+currentRowId+"eqpType").val()).toUpperCase();
	                				if(tradeCode == 'A' && $.trim(value).toUpperCase()=='KFF' 
	                					&& (equipType == 'R' || equipType == 'D' || equipType == 'I')){
	                					return [true,""];
	                				}
	                				if(equipType != 'R' && $.trim(value)!=''){// && tradeCode != 'A'){
			            				return [false, colname+": This is valid only for refrigerated equipment."];
									}
	                				/*if(tradeCode == 'A' && $.trim($("#"+currentRowId+"eqpType").val()).toUpperCase()!='R' 
	                					&& $.trim(value)!='' && $.trim(value).toUpperCase()!='KFF'){
	                					return [false, colname+": This is valid only for refrigerated equipment."];
	                				}*/
	                				
	                				if($.trim(value).toUpperCase()=='AMB' || $.trim(value).toUpperCase()=='WA'){
	                					return [true,""];
	                				}
	                				
	                				var invalidTempMsg = "This is invalid.";
		                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
		                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
		                			//alert("isTempFirstLetterPlusDot: " + isTempFirstLetterPlusDot.test(value));
		                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
		                			//alert("regTemp: " + regTemp.test(value));
		                			if(isTempFirstLetterPlusMinusDot.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
		                			if(isTempFirstLetterPlusDot.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
		                			if(!regTemp.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
		                			if($.trim($("#"+currentRowId+"eqpType").val())!='' && $.trim($("#"+currentRowId+"eqpType").val()).toUpperCase()=='R' && $("#"+currentRowId+"emptyFullCode").val()=='F' && $.trim(value)==''){
			            				return [false, colname+": This must be specified for refrigerated equipment."];
									}
			            			else{
										return [true,""];
									}
	                			}
	                			else{
	                				return [true,""];
	                			}
	                		}
	                	}
		            },
		            {name:'temperatureUnitOfMeasureCd', index:'temperatureUnitOfMeasureCd', width:50, editable:true, edittype:"select", 
		            	editoptions:{
		            		value:":;C:C;F:F",
		            		dataEvents: [
	 	            		                {
	 	            		                    type: 'change',
	 	            		                    fn: function(e) {
	 	            		                    	var row = $(e.target).closest('tr.jqgrow');
	            		                            var rowId = row.attr('id');
	 	            		                    	disableAddDelete(rowId);
	 	            		                    }
	 	            		                }
	 	            		            ]
		            	},
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var tradeCode = $('#tradeCode').val();
	                			// D030132 removed exception for new booking from template
	                			if( $('#bookingTypeCode').val()=='B' ){
		                			var temp = $.trim($("#"+currentRowId+"temperature").val());
		                			var tempDual = $.trim($("#"+currentRowId+"temperatureDual").val());
		                			
		                			if(tradeCode != 'A' ){
	                					if($.trim(temp).toUpperCase()=='AMB' || $.trim(temp).toUpperCase()=='WA'){
		                					return [true,""];
		                				}
	                				}
		                			if(tradeCode == 'A'){
		                				if(((temp!='' && $.trim(temp).toUpperCase()!='AMB' && $.trim(temp).toUpperCase()!='WA' && $.trim(temp).toUpperCase()!='KFF' ) || 
		                						(tempDual!='' && $.trim(tempDual).toUpperCase()!='AMB' && $.trim(tempDual).toUpperCase()!='WA' && $.trim(tempDual).toUpperCase()!='KFF' )) && value==''){
				            				return [false, colname+": This must be specified for Temperature."];
										}
			                			else if((temp=='') && value!=''){
			                				return [false, colname+": This is valid only if Temperature is provided."];
			                			}
				            			else{
											return [true,""];
										}
		                			} else {
		                				if(temp!='' && value==''){
				            				return [false, colname+": This must be specified for Temperature."];
										}
			                			else if(temp=='' && value!=''){
			                				return [false, colname+": This is valid only if Temperature is provided."];
			                			}
				            			else{
											return [true,""];
										}
		                			}
	                			}
	                			else{
									return [true,""];
								}
	                		}
	                	}
		            },
		            {name:'temperatureDual', index:'temperatureDual', width:70, editable:true, 
    					editoptions: {
		                	maxlength: 5,
		                	dataEvents: [
	 	            		                {
	 	            		                    type: 'change',
	 	            		                    fn: function(e) {
	 	            		                    	var row = $(e.target).closest('tr.jqgrow');
	            		                            var rowId = row.attr('id');
	 	            		                    	disableAddDelete(rowId);
	 	            		                    }
	 	            		                }
	 	            		            ]
		                }, 
		                formatter:'spaceFormatter',
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var tradeCode = $('#tradeCode').val();
	                			//Defect-25116-Added code to validate temperature when booking created from template
	                			if($('#bookingTypeCode').val()=='B' && ($.trim($('#bookingTemplateId').val())=='' || $.trim($('#shipmentNumber').val())!=''||$.trim($('#bookingTemplateId').val())!='')){
	                				var equipType = $.trim($("#"+currentRowId+"eqpType").val()).toUpperCase();
	                				if(tradeCode == 'A' && $.trim(value).toUpperCase()=='KFF' 
	                					&& (equipType == 'R' || equipType == 'D' || equipType == 'I')){
	                					return [true,""];
	                				}
	                				if(tradeCode == 'A' && equipType != 'R' && $.trim(value)!='' ){
	                					return [false, colname+": This is valid only for refrigerated equipment."];
	                				}
	                				
	                				if($.trim(value).toUpperCase()=='AMB' || $.trim(value).toUpperCase()=='WA'){
	                					return [true,""];
	                				}
	                				
	                				var invalidTempMsg = "This is invalid.";
		                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
		                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
		                			//alert("isTempFirstLetterPlusDot: " + isTempFirstLetterPlusDot.test(value));
		                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
		                			//alert("regTemp: " + regTemp.test(value));
		                			if(isTempFirstLetterPlusMinusDot.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
		                			if(isTempFirstLetterPlusDot.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
		                			if(!regTemp.test($.trim(value))){
		                				return [false, colname+": "+invalidTempMsg];
		                			}
									return [true,""];
	                			}
	                			else{
	                				return [true,""];
	                			}
	                		}
	                	}
		            },
		            {name:'characteristics', index:'characteristics', width:310, editable:true, 
	                	/*edittype:'select', editoptions:{dataUrl:_context+'/booking/freight/getEqpRqtChars', multiple:true, style:'height:20px', defaultValue:' ',
		            	buildSelect:function(data){
			            		//alert("responseText: " + data);
			            		var responseText = jQuery.parseJSON(data);
			            		var s = '<select>';
			            		s += '<option value="Select">Select</option>';
			            		if (responseText.data && responseText.data.length) {
				            		for (var i = 0, l = responseText.data.length; i < l; i++) {
					            		var tariffTranslateCode = responseText.data[i].id.tariffTranslateCode;
					            		s += '<option value="' + tariffTranslateCode + '">' + tariffTranslateCode + '</option>';
				            		}
			            		}
			            		return s + "</select>";
		            		},*/
	                		editoptions:{readonly:true, 
		            		dataEvents: [
	 	            		                {
	 	            		                    type: 'change',
	 	            		                    fn: function(e) {
	 	            		                    	var row = $(e.target).closest('tr.jqgrow');
	            		                            var rowId = row.attr('id');
	 	            		                    	disableAddDelete(rowId);
	 	            		                    }
	 	            		                },
	 	            		                {
		 	            		                type: 'keydown',
			 	      		                    fn: function(event) {
			 	      		                    	  if (event.keyCode == 8) {
			 	      		                  	    	event.preventDefault();
			 	      		                  	    	return false;
			 	      		                  	    }
			 	      		                    }
	 	            		                }
	 	            		            ]	
		            	}/*,
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			if($('#bookingTypeCode').val()=='B' && ($.trim($('#bookingTemplateId').val())=='' || $.trim($('#shipmentNumber').val())!='')){
	                				var countSTOW = 0;
	                				var countVENT = 0;
	                				$.each(value.split(','), function(index, value1) {
	                				    if(value1.search('STOW')>=0){
	                				    	countSTOW = countSTOW + 1;
	                				    }
	                				    else if(value1.search('VENT')>=0){
	                				    	countVENT = countVENT + 1;
	                				    }
	                				});
	                				
	                				if(countSTOW>1){
	                					return [false, colname+": Only one of the STOWAD/STOWBD characteristic is allowed."];
	                				}
	                				else if(countVENT>1){
	                					return [false, colname+": Multiple VENT characteristics are not allowed."];
	                				}
	                				else{
	                					return [true,""];
	                				}
	                			}
	                			else{
									return [true,""];
								}
	                		}
	                	}*/
		            },
			   		{name:'actions', index:'actions', width:70, align:"center", editable:false, search:false, sortable:false, formatter:'actions', 
		            	formatoptions:{keys:false,
		            	delbutton : false, 
		            	editbutton:false,
			   		}}
			   	];
	
	jQuery.extend($.fn.fmatter , {
		spaceFormatter : function(cellvalue, options, rowdata) {
			return $.trim(cellvalue);
		}
	});

	var jsonReaderReference = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"equipmentSeqNo"
		};
	
	var lazy = false;
	
	var gatesCheetah = window.gatesCheetah || {};
	
	if (gatesCheetah && gatesCheetah.lazyLoadGrid === true) {
		var arrayLength = gatesCheetah.lazyGrids.length;
		for (var i = 0; i < arrayLength; i++) {
		    if (gatesCheetah.lazyGrids[i] === 'equipmentGrid') {
		    	lazy = true;
		    }
		}
	} 
	//D027890:multiple blank rows in Reference & Commodity
	var equipReadOnlyGrid = false;
	if(isCommodityDisplayOnly && !isCommodityModifiable){
		equipReadOnlyGrid = true;
	}
	
	$('#equipmentGrid').gatesGrid({
		lazy : lazy,
		caption: "Equipment",
		colNames: equipmentColNames,
		colModel: equipmentColModels,
		jsonReader: jsonReaderReference,
		height: "100%",
		autowidth: true,
		multiselect:true,
		hiddengrid: false,
		pager: '#equipmentGridPager',
		gatesOptions: {
			urls: {load: _context+'/booking/freight/loadEquipmentGrid', add: _context+'/booking/freight/addEquipment', 
				   edit: _context+'/booking/freight/updateEquipment', del: _context+'/booking/freight/deleteEquipment', 
				   delMultiple: _context+'/booking/freight/deleteEquipment'},
				   controls: {
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete:true
				   },
				   readOnly:equipReadOnlyGrid,
				   loadComplete: equipmentGridLoadComplete,
				   delFunction: function() {
					   console.log('del function');
					   saveAllEquipments();
				   }
		}
	});
	
	$("#equipmentGrid").jqGrid({
	    ajaxRowOptions: {async:false}
	});
	
	/*$("#editAllEquipments").click(function(){
		editAllEquipments();
	});
	
	$("#saveAllEquipments").click(function(){
		saveAllEquipments();
	});*/
	
	$(".HeaderButton", ("#gview_equipmentGrid")).click(function(){
		$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
		$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
		/*var xErrorCoordinate = window.pageXOffset;
		var yErrorCoordinate = window.pageYOffset;
		window.scrollTo(xErrorCoordinate, yErrorCoordinate);
		setTimeout(function(){
			if($("#equipmentGrid").is(':visible')){
				showSelectedCharacteristics();
			}
		}, 250);*/
	});
}

function unloadEquipmentGrid(){
	$('#equipmentGrid').jqGrid('GridUnload');
}

function loadEquipmentGrid(){
	$('#equipmentGrid').trigger("reloadGrid");
}
var addBound = false;
var deleteAddedRow = false;
var errorRowId;
var errorRowData;
var equipmentGridLoadComplete = function(){
	
	var userData = $("#equipmentGrid").getGridParam('userData');
	console.log('userData.EMPTYFLAG='+userData.EMPTYFLAG);
	if(userData.EMPTYFLAG == 'TRUE') {
		if($('#equipmentEmptyFlag').val() == 'FALSE') {
			$('#isVgmRequiredDefault').html("No");
		} 
	} else {
		if($('#equipmentEmptyFlag').val() == 'TRUE') {
			// got to look up vgm
			checkVGM();
		}
	}
	$('#equipmentEmptyFlag').val(userData.EMPTYFLAG);
		
	
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
	currentRowId='';
	var tradeCode = $('#tradeCode').val();
	var grid = $("#equipmentGrid");
	var pos=getColumnIndexByName(grid,'temperatureDual');
	if(tradeCode != 'A'){	
		grid.jqGrid('hideCol', grid.getGridParam("colModel")[pos].name);
		$("#tr_equipmentSeqNo td:nth-child(11)").hide();
	} else {
		grid.jqGrid('showCol', grid.getGridParam("colModel")[pos].name);
		$("#tr_equipmentSeqNo td:nth-child(11)").show();
	}
	
	/*Booking Security*/
	if((isCommodityDisplayOnly && !isCommodityModifiable) || $("#bookingStatusCode").val()=='CANC'){
	    setTimeout(function(){
            $("#maintainBookingCommodity").gatesDisable();
            $('#tr_equipmentSeqNo').hide();
            $('#del_equipmentGrid').hide();
            $('#gview_equipmentGrid input').attr("disabled", true);
            $('#gview_equipmentGrid select').attr("disabled", true);
		},500);
	}else{
		$('#gview_equipmentGrid input').attr("disabled", false);
		$('#gview_equipmentGrid select').attr("disabled", false);
		enableEquipmentAddDelete();
	}
	var xCoordinate = window.pageXOffset;
	var yCoordinate = window.pageYOffset;
	editAllEquipments();
	
	equipmentUpdated = false;
	if(!deleteAddedRow){
		resetEquipmentAddRow();
	}
	if(!addBound){
		$("#gbox_equipmentGrid #sData").click(function(e){
			if(!$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="tr_equipmentSeqNo"] td a[id="sData"]').is(':visible'))
				e.preventDefault();
			else
			{
				//Call saveAllEquipments this only when there are no errors 
				if($('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').css('display') != 'table-row'){
					saveAllEquipments();
				}
				if(updateEquipmentErrorOccurred){
					deleteAddedRow = true;
				} else {
					deleteAddedRow = false;
				}
				freightModified = true;
				isBookingChanged = "Y";
				currentRowId = '';
				return true;
			}
		});
		addBound = true;
	}
	//D025714: 	Booking - adding and updating equipment not fully working - pressing + Add - error msgs not displaying for refrigerated equip
	//Delete added row when there is error in existing records.
	if(deleteAddedRow){
		var rowIDs = jQuery("#equipmentGrid").getDataIDs();
		var rowId = $('#equipmentGrid').getCell(rowIDs[rowIDs.length - 1], 'equipmentSeqNo');
		
		 var isSuccess = $('#equipmentGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/booking/freight/deleteEquipment' //Url
	      );
		  if(isSuccess){
			$('#equipmentGrid').jqGrid('delRowData',rowId);
		  }
		//Restore error record data
		$("#"+errorRowId+"_quantityRequested").val(errorRowData[0]);
		$("#"+errorRowId+"_eqpType").val(errorRowData[1]);
		$("#"+errorRowId+"_eqpSize").val(errorRowData[2]);
		$("#"+errorRowId+"_eqpHeight").val(errorRowData[3]);
		$("#"+errorRowId+"_emptyFullCode").val(errorRowData[4]);
		$("#"+errorRowId+"_temperature").val(errorRowData[5]);
		$("#"+errorRowId+"_temperatureUnitOfMeasureCd").val(errorRowData[6]);
		$("#"+errorRowId+"_temperatureDual").val(errorRowData[7]);
		$("#"+errorRowId+"_characteristics").val(errorRowData[8]);
		//Re validate row
		var isSuccess = $('#equipmentGrid').jqGrid(
			   'saveRow', 
			   errorRowId, 
			   null, //onsuccessfunc
			   _context+'/booking/freight/updateEquipment' //Url
	    );
	}
	$('#equipmentGridPager .ui-pg-div').click(function(e){
		freightModified = true;
		isBookingChanged = "Y";
		currentRowId = '';
		return true;
	});
	
	$('#1_quantityRequested').blur();
	window.scrollTo(xCoordinate, yCoordinate);
	
	// Set accordian
	var rows = $('#equipmentGrid').jqGrid('getDataIDs');
	var display = "";
	var stowSelected = false;
	if($('#bookingTypeCode').val()!='B'){
		stowSelected = true;
	}
	for(var index=0;index<rows.length;index++) {
		var qnty = $("#"+rows[index]+"_quantityRequested").val();
		var type = $("#"+rows[index]+"_eqpType").val();
		var size = $("#"+rows[index]+"_eqpSize").val();
		var height = $("#"+rows[index]+"_eqpHeight").val();
		var charArray = $("#"+rows[index]+"_characteristics").val().split(", ");
		//D032540 start
		var tmp = $("#"+rows[index]+"_temperature").val();
		var tmpUomCd = $("#"+rows[index]+"_temperatureUnitOfMeasureCd").val();
		if(index != 0) display += ", ";
		if(tmp!=null && tmp!=''){
			display += qnty+"x "+type+size+height+'('+tmp+"°"+tmpUomCd+')';
			}else{
			display += qnty+"x "+type+size+height;
			}
		//D032540 end
		//+$(dataFromTheRow.eqpSize).val()+$(dataFromTheRow.eqpHeight).val();
		if(tradeCode != 'A'){
			$("#"+rows[index]+"_temperatureDual").val("");
			//D031169: 	Priority Stow to have a new selection list only for Alaska
			var newChar = "";
			for (var i = 0; i < charArray.length; i++) {
				if (!$.trim(charArray[i]).match("STOW") ||  $.trim(charArray[i]) == "STOWAD" ||
						$.trim(charArray[i]) == "STOWBD") {
					if(newChar == ""){
						newChar = charArray[i];
					} else {
						newChar = newChar + ", " + charArray[i];
					}
				}
			}
			$("#"+rows[index]+"_characteristics").val(newChar);
		} else if(!stowSelected){
			for (var i = 0; i < charArray.length; i++) {
				if ($.trim(charArray[i]).match("STOW")
						//D033747: 	STOW on equipment line not updating top of booking page!
						//&& $.trim(charArray[i]) != "STOWAD"
						&& $.trim(charArray[i]) != "STOWBD") {
					$('#stowCharAlaska option[value="'+charArray[i]+'"]').attr('selected', 'selected');
					stowSelected = true;
					break;
				}
			}
		}
	}
	if(!stowSelected){
		$('#stowCharAlaska option[value=""]').attr('selected', 'selected');
	}
	
	if(display.length > 0) {
		$("#maintainBookingEquipmentId").html(" | "+display);
	} else {
		$("#maintainBookingEquipmentId").html("");
	}
	
	return true;
};

function typeValidation(value){
	if(!/^[a-zA-Z]+$/.test($.trim(value))){
		return false;
	}
	else{
		return true;
	}
}

function sizeValidation(value){
	var tradeCode = $('#tradeCode').val();
	var portOfDischarge = $('#destinationPortCityCode').val();
	if(!/^[0-9]+$/.test($.trim(value))){
		return false;
	}
	else if($.trim(value)==24 && (tradeCode=='G' || tradeCode=='F')){
		return false;
	}
	else if($.trim(value)==45 && (portOfDischarge=='PUX' || portOfDischarge=='YAP'|| portOfDischarge=='UUK' || portOfDischarge=='PNP')){
		return false;
	}
	else{
		return true;
	}
}

function editAllEquipments(){
	var rowIDs = jQuery("#equipmentGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowId = $('#equipmentGrid').getCell(rowIDs[i], 'equipmentSeqNo');
	   $('#equipmentGrid').jqGrid('editRow', rowId, false, equipmentOnEdit);
    }
}

function saveAllEquipments(){
	updateEquipmentErrorOccurred = false;
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
	var rowIDs = jQuery("#equipmentGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowId = $('#equipmentGrid').getCell(rowIDs[i], 'equipmentSeqNo');
	   currentRowId = rowId+'_';
	   var isSuccess = $('#equipmentGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/booking/freight/updateEquipment' //Url
	   );
	   
	   if(!isSuccess){
		   updateEquipmentErrorOccurred = true;
		   //Store error record
		   currentRowId = '';
		   errorRowId = rowId;
		   errorRowData = [$("#"+rowId+"_quantityRequested").val(),
							$("#"+rowId+"_eqpType").val(),
							$("#"+rowId+"_eqpSize").val(),
							$("#"+rowId+"_eqpHeight").val(),
							$("#"+rowId+"_emptyFullCode").val(),
							$("#"+rowId+"_temperature").val(),
							$("#"+rowId+"_temperatureUnitOfMeasureCd").val(),
							$("#"+rowId+"_temperatureDual").val(),
							$("#"+rowId+"_characteristics").val()];
		   break;
		}
	   else
		   $('#equipmentGrid').jqGrid('editRow', rowId, false, equipmentOnEdit);
    }
	if(!updateEquipmentErrorOccurred){
		equipmentUpdated = false;
	}
}

var equipmentOnEdit = function(rowId){ 
	$('#'+rowId+'_characteristics').css('width', '263px');
	$('#'+rowId+'_characteristics').gatesPopUpSearch({
		func : function() {
			openEquipmentSelectDialog(rowId);
		}
	});
};

/** D024154, try to allow both add and update */
function disableAddDelete(rowId){
	if(rowId!=null && rowId!='' && rowId!=undefined){
		//$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
		//$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
		equipmentUpdated = true;
		//$('#tr_equipmentSeqNo').hide();
		//$('#del_equipmentGrid').hide();
		freightModified = true;
		isBookingChanged = "Y";
	}
	
	/*if($('#msgDivFrt div').hasClass('message_error')==true && $('#msgDivFrt div').html()=='Validation error(s) in equipment lines.'){
		$('#msgDivFrt').hide();
		$('#msgDivFrt').html('');
	}*/
}

function hideEquipmentInlineEditDelete(){
	$("div.ui-pg-div.ui-inline-edit", "#equipmentGrid").hide();
	$("div.ui-pg-div.ui-inline-del", "#equipmentGrid").hide();
}

function enableEquipmentAddDelete(){
		$('#tr_equipmentSeqNo').show();
		$('#del_equipmentGrid').show();
}

function resetEquipmentAddRow(){
	$('#quantityRequested').val('');
	$('#eqpType').val('');
	$('#eqpSize').val('');
	$('#eqpHeight').val('');
	$('#emptyFullCode').val('F');
	$('#temperature').val('');
	$('#temperatureUnitOfMeasureCd').val('');
	$('#temperatureDual').val('');
	$('#characteristics').val("");
	$('#characteristics').css('width', '263px');
	/*if($('#clr').length==0)
	{
		var $clearButton = $("<a href=\"javascript:void(0)\" id=\"clr\" class=\"fm-button ui-state-default ui-corner-all\" style=\"margin-left:8px;\" onclick=\"$('#characteristics').val('');\">x</a>");
		$('#characteristics').after($clearButton);
	}*/
	$('#characteristics').gatesPopUpSearch({
		func : function() {
			openEquipmentSelectDialog(0);
		}
	});
}

function validateEquipmentOnTradeAndPODChange(showMessage){
	var validation = false;
	$.ajax({
		url: _context+'/booking/freight/validateEquipmentOnTradeAndPODChange?trade='+$('#tradeCode').val()+'&pod='+$('#destinationPortCityCode').val(),
		async:false,
		success: function(responseText){
			if(!responseText.success){
				if(showMessage)
				{
					window.scrollTo(0, 0);
					$('#msgDiv').show();
					$('#msgDiv').html("<div class=\"message_error\">"+responseText.messages.error[0]+"</div>");
					triggerErrorMessageAlert();
				}
				validation = false;
			}
			else{
				validation = true;
			}
		}
	});
	return validation;
}

function formatZeroToSpace(cellvalue, options, rowObject){
	if($.trim(cellvalue)=='0'){
		cellvalue='';
	}
return cellvalue;
}

function autotab(event, object)
{
	var keyCode = event.keyCode;
	
	if(keyCode==32 || (48<=keyCode && keyCode<=57)
			|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
			|| (109<=keyCode && keyCode<=111))
	{
		if(object.value.length >= object.getAttribute("maxlength"))
		{
			if($(object).attr("id")=="newDirection" || $(object).attr("id")=="bkdDirection")
				$(object).blur();
			else
				$(object).next().focus();
		}
	}
	return true;
}

function showSelectedCharacteristics(){
	/*//$('#characteristics').scrollTop(0);
	var rowIDs = jQuery("#equipmentGrid").getDataIDs(); 
    for (var i=1;i<=rowIDs.length;i=i+1){ 
    	var $s = $('#'+i+'_characteristics');///selector of multilselect of row
    	if($s.val() != undefined){
	    	var indexTop = $s.find('[value="'+$s.val()[0]+'"]').index();
	    	$s.scrollTop((17*indexTop)+8.5);
    	}
    	//else
    	//	$s.scrollTop(0);
    }*/
	
	var rowIDs = jQuery("#equipmentGrid").getDataIDs(); 
    for (var i=0;i<rowIDs.length;i=i+1){ 
    	var id = '#'+rowIDs[i]+'_characteristics';
    	if($(id).val() != undefined){
    		var valArr = $(id).val();
    		$(id+' option').attr('selected', false);
    		for(var j= valArr.length-1; j>=0; j--)
			{
    			$(id+' option[value="'+valArr[j]+'"]').attr('selected', 'selected');
			}
    	}
    }
}

function openEquipmentSelectDialog(rowId)
{
	$('#equipmentGrid').setSelection(rowId, true);
	var idPrefix = "";
	if(rowId!=0)
		idPrefix = rowId+"_";
	$('#currentEquipmentChars').val($('#'+idPrefix+"characteristics").val());
	$("#maintain_characteristics").dialog("option", "buttons",
	[{
		text : "Cancel",
		click : function() {
			$("#maintain_characteristics").dialog("close");
		}
	},
	{
		text : "Ok",
		click : function() {
			var selRowIds = jQuery('#gridIdForCharacteristic').jqGrid('getGridParam', 'selarrrow');
			var characts = "";
		  	for (var i=0;i<selRowIds.length;i=i+1)
		    { 
		  		var rowData=jQuery("#gridIdForCharacteristic").getRowData(selRowIds[i]);
		  		if(i==0)
		  		{
		  			characts = rowData.description;
		  		}
		  		else
		  		{
		  			characts = characts+", "+rowData.description;
		  		}
			}
		  	var countSTOW = 0;
			var countVENT = 0;
			$.each(characts.split(', '), function(index, value1) {
			    if(value1.search('STOW')>=0){
			    	countSTOW = countSTOW + 1;
			    }
			    else if(value1.search('VENT')>=0){
			    	countVENT = countVENT + 1;
			    }
			});
			
			if(countSTOW>1){
				$('#characteristicsMsgDiv').html('<div class="message_error">Only one of the STOW characteristic is allowed</div>');
			}
			else if(countVENT>1){
				$('#characteristicsMsgDiv').html('<div class="message_error">Multiple VENT characteristics are not allowed</div>');
			}
			else{
				if($('#'+idPrefix+"characteristics").val()!=characts && idPrefix!='')
					disableAddDelete(rowId);
				$('#'+idPrefix+"characteristics").val(characts);
				$('#'+idPrefix+"characteristics").closest('td').attr('title', characts);
				//D031169: 	Priority Stow to have a new selection list only for Alaska
				var rows = $('#equipmentGrid').jqGrid('getDataIDs');
				var stowSelected = false;
				if($('#bookingTypeCode').val()!='B'){
					stowSelected = true;
				}
				for(var index=0;index<rows.length;index++) {
					var charArray = $("#"+rows[index]+"_characteristics").val().split(", ");
					if($('#tradeCode').val() == 'A' && !stowSelected){
						for (var i = 0; i < charArray.length; i++) {
							if ($.trim(charArray[i]).match("STOW")
									//D033747: 	STOW on equipment line not updating top of booking page!
									//&& $.trim(charArray[i]) != "STOWAD"
									&& $.trim(charArray[i]) != "STOWBD") {
								$('#stowCharAlaska option[value="'+charArray[i]+'"]').attr('selected', 'selected');
								stowSelected = true;
								break;
							}
						}
					} else {
						break;
					}
				}
				if(!stowSelected){
					$('#stowCharAlaska option[value=""]').attr('selected', 'selected');
				}
				$("#maintain_characteristics").dialog("close");
			}
		}
	}]);
	var xErrorCoordinate = window.pageXOffset;
	var yErrorCoordinate = window.pageYOffset;
	$("#maintain_characteristics").dialog('open');
	setTimeout(function(){
		window.scrollTo(xErrorCoordinate, yErrorCoordinate);
		var offset = {left:$('div[aria-labelledby="ui-dialog-title-maintain_characteristics"]').offset().left, top:yErrorCoordinate+100};
			$('div[aria-labelledby="ui-dialog-title-maintain_characteristics"]').offset(offset);
		}, 250);
}

function createEquipmentCharacteristicGrid(){
	//Create VVD Table on main page
	var colNames = ['Code', 'Characteristics'];
	
	var colModel = [ {
		name : 'code',
		hidden : true
	}, {
		name : 'description',
		width : 100
	}];
	

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "code"
	};

	/*Booking Security*/
		createGrid("gridIdForCharacteristic", // grid id for party
		"pagerIdForCharacteristic", // page id for party
		_context+'/booking/freight/loadEquipmentCharacteristicsGrid?tradeCode='+$('#tradeCode').val(), // geturl
		'', // addurl
		'', // edit url
		'', //delete url
		'',// delete selected URL
		colNames, 
		colModel, 
		"Select Characteristics",// caption
		'auto',// height
		25,// row num
		[25],// row list
		true,// multiselect
		false,// multidelete
		false,// load once
		true, // read only grid
		jsonReader, // json reader
		true, // hide edit
		true, // hide delete
		true, // autowidth
		false, // rownumbers
		true, // hide custom add row
		false,// hide pager row
		null,// custom edit method
		characteristicGridComplete,// custom grid complete
		null,// custom load complete
		false,// default hidden
		true);// row Color Based On status
		
}

var characteristicGridComplete = function()
{
	$('td[aria-describedby="gridIdForCharacteristic_description"]').css('text-align','center');
	 var rowIDs = jQuery("#gridIdForCharacteristic").getDataIDs();
	 var charArr = $('#currentEquipmentChars').val().split(", ");
	 
	 for (var j=0;j<rowIDs.length;j++)
     {
		 var rowData=jQuery("#gridIdForCharacteristic").getRowData(rowIDs[j]);
		 var id = $('#gridIdForCharacteristic').getCell(rowIDs[j], 'code');
		 
		 for(var i=0; i<charArr.length; i++)
		 {
			if($.trim(charArr[i])==rowData.description)
			{
				$('#jqg_gridIdForCharacteristic_'+id).trigger("click");
				$('#jqg_gridIdForCharacteristic_'+id).attr("checked", true);
				break;
			}
		 }
     }
};

var getColumnIndexByName = function(grid,columnName) {
	var cm = grid.jqGrid('getGridParam','colModel');
	for (var i=0,l=cm.length; i<l; i++) {
	    if (cm[i].name===columnName) {
	        return i;
	    }
	}
	return -1;
	};

function clearEquipRow(rowId)
{
	if($("#"+rowId+"_characteristics").val()!='')
		disableAddDelete(rowId);
	$("#"+rowId+"_characteristics").val('');
	$("#"+rowId+"_characteristics").closest('td').attr('title', '');
}
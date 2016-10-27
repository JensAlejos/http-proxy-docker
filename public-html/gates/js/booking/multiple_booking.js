var currentRowId='';
var firstLoad;
isMultipleBookingChanged = "N";
//changed for D023317
var equipmentUpdateStatus=true;
//D025993
var addBound=false;
var GOVERNMENT_NAME = "GOVERNMENT";

$(function() {
	
	isMultipleBookingChanged = "N";
	$('#selectButtonDiv').show();
	currentRowId='';
	
	jQuery('#multipleBookingForm').submit(function(){
	        return false;
	 });
	
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
	
	$('#templateNumber').keydown(function(evt) { 
		  var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '13'){
			  $('#templateNumber').blur();
			  //checkTemplate();
		  }
		  return true;
	}); 
	
	$('#templateNumber').change(function(evt) { 
		checkTemplate();
	}); 
	
	$('#templateNumber').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Template Number",
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  function() { return 'T'; }
	 	},
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			$('#templateNumber').val(data.shno);
			//$('#templateNumber').blur();
			loadTemplate(data.shno);
			isMultipleBookingChanged = "N";
		}
	});
	
	var colNamesForEquipment = ['Id', 'Quantity', 'Type', 'Size','Height', 'E/F', 'Temp', 'F/C', 'Characteristics', 'Actions'];
	
	var colModelForEquipment = [
             	               {name:'equipmentSeqNo', index:'equipmentSeqNo', editable:false, hidden:true},	     
				               {name:'quantityRequested', index:'quantityRequested', width:80, editable:true, editoptions: {maxlength: 5}, 
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
				            		   }
			            	}},
				               {name:'eqpType',index:'eqpType', width:50, editable:true, editoptions: {size:1, maxlength: 1},
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
				               {name:'eqpSize',index:'eqpSize', width:50, editable:true, editoptions: {size:2, maxlength:2}, 
					                	editrules:{
					                		custom:true,
					                		custom_func:function (value, colname) {
					                			if($.trim(value)!=''){
						                			var tradeCode = $('#tradeCode').val();
						                			var portOfDischarge = $('#destinationPortCityCode').val();
						                			if(!/^[0-9]+$/.test($.trim(value))){
						                				return [false, colname+": Only numerics allowed between range[0-99]."];
						                			}
						                			else if($.trim(value)==24 && (tradeCode=='G' || tradeCode=='F')){
							            				return [false, colname+": 24� equipment length  is not allowed when the trade is G or F."];
													}
						                			else if($.trim(value)==45 && (portOfDischarge=='PUX' || portOfDischarge=='YAP'|| portOfDischarge=='UUK' || portOfDischarge=='PNP')){
						                				return [false, colname+": 45� equipment is not allowed for port of discharge- PUX, YAP, UUK or PNP."];
						                			}
						                			else{
														return [true,""];
													}
					                			}
					                			else{
													return [true,""];
												}
					                		}
					                	}},
					            {name:'eqpHeight', index:'eqpHeight', width:50, editable:true, editoptions: {size:1, maxlength: 1}},
					            {name:'emptyFullCode', index:'emptyFullCode', width:55, editable:true, editrules:{required:true}, edittype:"select", formatter:'select', editoptions:{value:"F:F;E:E", defaultValue:'F'}},
					            {name:'temperature', index:'temperature', width:80, editable:true, editoptions: {maxlength: 5}, formatter:'spaceFormatter',
					            	editrules:{
				                		custom:true,
				                		custom_func:function (value, colname) {
				                			//D032717: 	GATES - Multiple Bookings - KFF 
				                			var tradeCode = $('#tradeCode').val();
				                			var equipType = $.trim($("#"+currentRowId+"eqpType").val()).toUpperCase();
			                				if(tradeCode == 'A' && $.trim(value).toUpperCase()=='KFF' 
			                					&& (equipType == 'R' || equipType == 'D' || equipType == 'I')){
			                					return [true,""];
			                				}
			                				if(equipType != 'R' && $.trim(value)!=''){// && tradeCode != 'A'){
					            				return [false, colname+": This is valid only for refrigerated equipment."];
											}
				                			/*if($.trim($("#"+currentRowId+"eqpType").val()).toUpperCase()!='R' && $.trim(value)!=''){
					            				return [false, colname+": This is valid only for refrigerated equipment."];
											}*/
				                			if(equipType!='' && equipType=='R' && $("#"+currentRowId+"emptyFullCode").val()=='F' && $.trim(value)==''){
					            				return [false, colname+": This must be specified for refrigerated equipment."];
											}
				                			if(value!='')
				                			{
				                				var upperCase = value.toUpperCase();
				                				if(upperCase == 'WA' || upperCase == 'AMB')
				                					return [true,""];
				                				else
				                				{
					                				var invalidTempMsg = "This is invalid.";
						                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
						                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
						                			
						                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
						                			
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
				                			}
				                			else
				                				return [true,""];
				                		}
				                	}
					            },
					            {name:'temperatureUnitOfMeasureCd', index:'temperatureUnitOfMeasureCd', width:55, editable:true, edittype:"select", editoptions:{value:":;C:C;F:F"},
					            	editrules:{
				                		custom:true,
				                		custom_func:function (value, colname) {
				                			var temp = $.trim($("#"+currentRowId+"temperature").val());
				                			//D026142
				                			//D032717: 	GATES - Multiple Bookings - KFF 
				                			if(temp!=''&& temp.toUpperCase()!='WA'&& temp.toUpperCase()!='AMB' && temp.toUpperCase()!='KFF' && value==''){
					            				return [false, colname+": This must be specified for Temperature."];
											}
				                			else if(temp=='' && value!=''){
				                				return [false, colname+": This is valid only if Temperature is provided."];
				                			}
					            			else{
												return [true,""];
											}
				                		}
				                	}},
					            {name:'characteristics', index:'characteristics', width:287, editable:true, 
				                	/*edittype:'select', 
					            	editoptions:{dataUrl:_context+'/booking/multipleBooking/getEqpRqtChars', multiple:true, size:1, style:'height:20px', defaultValue:' ', 
					            	buildSelect:function(data){
						            		
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
					            		}	
					            	}*/
				                	editoptions:{readonly:true, 
				            		dataEvents: [
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
						            	}
					            },
						   		{name:'actions', index:'actions', width:70, align:"center", editable:false, search:false, sortable:false, formatter:'actions', 
					            	formatoptions:{keys:false,
										 delbutton : false, 
											editbutton:false
											//changed for D023317
									/*onEdit: function(rowId){ 
										currentRowId = rowId+"_";
										/*$('table#multipleBookingEquipmentGrid tbody tr#'+rowId+' td[aria-describedby="multipleBookingEquipmentGrid_characteristics"] select').height(30);*/
										//showSelectedCharacteristics();
										//$('#'+rowId+'_characteristics').css('width', '240px');
										/*if($('#'+rowId+'_clr').length==0)
										{
											var $clearButton = $("<a href=\"javascript:void(0)\" class=\"fm-button ui-state-default ui-corner-all\" style=\"color:#2779aa;margin-left:8px;\" id=\""+rowId+"_clr\" onclick=\"clearEquipRow("+rowId+");\">x</a>");
											$('#'+rowId+'_characteristics').after($clearButton);
										}*/
									/*	$('#'+rowId+'_characteristics').gatesPopUpSearch({
											func : function() {
												openEquipmentSelectDialog(rowId);
											}
										});
									},
									onSuccess:function(jqXHR){
										var result = eval('(' + jqXHR.responseText + ')');
										if(result.success==false){
											var messages = result.messages;
											$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"] td').html(messages[0]);
											$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"]').show();
											return false;
										}
										
										currentRowId='';
										isMultipleBookingChanged = "Y";
										$('#multipleBookingEquipmentGrid').trigger("reloadGrid");
										return true;
									},
									/*afterSave:function()
									{
										setEquipmentGridCaption();
										return true;
									},*/
									/*afterRestore:function(){
										currentRowId='';
										$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"] td').html("");
										$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"]').hide();
									}*/
						   		}}
            			   	];

	
	jQuery.extend($.fn.fmatter , {
		spaceFormatter : function(cellvalue, options, rowdata) {
			return $.trim(cellvalue);
		}
	});

	var jsonReaderforEquipment = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"equipmentSeqNo"
		};
	
	createGrid(
			"multipleBookingEquipmentGrid", // grid id for user
			"multipleBookingEquipmentPager", // page id for user
			_context+'/booking/multipleBooking/loadEquipment', 
			_context+'/booking/multipleBooking/addEquipment', 
			_context+'/booking/multipleBooking/updateEquipment', 
			_context+'/booking/multipleBooking/deleteEquipment', 
			_context+'/booking/multipleBooking/deleteEquipment', 
			colNamesForEquipment, 
			colModelForEquipment, 
			"Equipment",
			"auto",
			500,
			[10,50,100,200,500],
			true,
			true,
			false, //load once
			false, jsonReaderforEquipment, false, false, true, true, 
			false, false, null, equipmentGridComplete, equipmentLoadComplete,
			false, true, false, equipmentAfterSubmit);

var colNamesForVVD = ['Id', 'VVD', 'Quantity', 'Booking Numbers','Status', ''];
	
 var colModelVVD = [
       {name:'vvdSeqNo', hidden:true},
       {name:'vvd', index:'vvd', width:185, editable:true, editrules:{required:true}, editoptions:{readonly:true, size:'20', 
    	   dataEvents: [
		                {
		                    type: 'keydown',
		                    fn: function(event) {
		                    	  if (event.keyCode == 8) {
		                  	    	/*if($(this).attr('id')=='vvd')
	                  	    		{
		                  	    		var startIndex = this.selectionStart;
		                  	    		var endIndex = this.selectionEnd;
		                  	    		if(startIndex!=endIndex)
		                  	    		{
		                  	    			var oldVal = $(this).val();
		                  	    			var newVal = oldVal.substr(0, startIndex) + oldVal.substr(endIndex, oldVal.length);
		                  	    			$(this).val(newVal);
		                  	    		}
	                  	    		}*/
		                  	    	event.preventDefault();
		                  	    	return false;
		                  	    }
		                    }
		                 }
		              ]
       			}
	   },
       {name:'quantity', index:'quantity', width:50, editable:true, editoptions:{defaultValue:'1'}, editrules:{required:true, custom:true, 
			custom_func: function (value, colname) {
				var isValid = validateForPositiveIntegers(value);
    			if(!isValid) {
    				return [false, "* Please enter positive integer value"];
    			} else {
    				return [true,""];
    			}
			}}},
       {name:'booking',index:'booking', width:290},
       {name:'status',index:'status', width:75}, 
       {name:'actions', width:50, formatter:'actions',formatoptions:{keys:true, editbutton:true, delbutton:true, 
    	   afterSave: function()
			{
				isMultipleBookingChanged = "Y";
				return true;
			}
       }}];
  
  
  var jsonReaderForVVD = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			cell : "cell",
			repeatitems : false,
			id : "vvdSeqNo"
		};

		createGrid("multipleBookingVVDGrid", // grid id for party
		"multipleBookingVVDPager", // page id for party
		_context+'/booking/multipleBooking/loadVVD', // geturl
		_context+'/booking/multipleBooking/addVVD', // addurl
		_context+'/booking/multipleBooking/updateVVD', // edit url
		_context+'/booking/multipleBooking/deleteVVD', //delete URL
		_context+'/booking/multipleBooking/deleteVVD',// delete selected URL
		colNamesForVVD, colModelVVD, "VVD",// caption
		'auto',// height
		500,// row num
		[10,50,100,200,500],// row list
		true,// multiselect
		true,// multidelete
		false,// load once
		false, // read only grid
		jsonReaderForVVD, // json reader
		false, // hide edit
		false, // hide delete
		true, // autowidth
		true, // rownumbers
		true, // hide custom add row
		false,// hide pager row
		null,// custom edit method
		vvdGridComplete,// custom grid complete
		vvdLoadComplete,// custom load complete
		false,// default hidden
		true,// row Color Based On status
		false,
		multipleVVDAfterSubmit);
		
		$("#multipleBookingVVDGrid").jqGrid('setGridParam',{
			beforeSelectRow: function(rowId, e) {
				 var rowData = jQuery("#multipleBookingVVDGrid").getRowData(rowId);
				 if(rowData.status==null || rowData.status==''){
					 return true;
				 }
				 else
					 return false;
			 }
		});
		
		$('#cancel').click(function()
		{
			if(isMultipleBookingChanged == "Y")
			{
				var r = confirm('All unsaved changes would be discarded. Continue?');
				if(r)
					document.location.href = _context + '/';
			}
			else
				document.location.href = _context + '/';
		});
		
		$('#clear').click(function()
		{
			clearTemplate();
		});
		
		if(_multipleBookingUpdate)
		{
			$('#save').click(function()
			{
			//changed for D023317
			updateMultipleBookingEquipmentGrid();
			
			if(equipmentUpdateStatus)
			{
				var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs(); 
				for (var i=0;i<rowIDs.length;i=i+1)
			    { 
			       var rowData=jQuery("#multipleBookingEquipmentGrid").getRowData(rowIDs[i]);
			       if($.trim(rowData.eqpType)=='R')
		    	   {
			    	   if(checkTemp(rowData.temperature, rowData.emptyFullCode)==false)
		    		   {
			    		   alert("Valid Temperature required for refrigerated equipment");
			    		   return;
		    		   }
		    	   }
			    }
				$('#cancel').attr("disabled", true);
				$('#save').attr("disabled", true);
				$('#clear').attr("disabled", true);
				$('#msgDiv').html('<div class="message_info">Creating multiple bookings...</div>');
				window.scrollTo(0, 0);
				blockUI();
				$.ajax({
					url : _context +"/booking/multipleBooking/saveMultipleBooking",
					success : function(responseText) {
						if(responseText.success)
						{
							$('#msgDiv').html('<div class="message_success">'+responseText.messages.success[0]+'</div>');
							window.scrollTo(0, 0);
							isMultipleBookingChanged = "N";
							$("#multipleBookingEquipmentGrid").trigger("reloadGrid");
						}
						else
						{
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
							$('#msgDiv').html(messageContent);
							window.scrollTo(0, 0);
						}
						$('#cancel').attr("disabled", false);
						$('#clear').attr("disabled", false);
						$("#multipleBookingVVDGrid").trigger("reloadGrid");
						$.unblockUI();
					}
				});
			}
			});
		}

		$('#templateNumber').focus();
});
var deleteAddedRow = false;
var errorRowId;
var errorRowData;
var equipmentLoadComplete = function()
{
	clearAddRows('equipmentSeqNo');
	//hides add row
	if(!_isEquipAdd || $.trim($('#templateId').val())=='' || $.trim($('#rollingStockIndicator').val())=='true' || $.trim($('#totalEquipCount').val())=='-1'
		|| ($.trim($('#customerGroup').val())==GOVERNMENT_NAME && $.trim($('#mbuIndicator').val())=='Y')
		|| ($.trim($('#loadDschGroupCode').val())!='CY' && $.trim($('#loadDschGroupCode').val())!="CON" && $.trim($('#loadDschGroupCode').val())!="LCL"))
		$("#tr_equipmentSeqNo", "#gbox_multipleBookingEquipmentGrid").hide();
	else
	{
		$("#tr_equipmentSeqNo", "#gbox_multipleBookingEquipmentGrid").show();
		$('#characteristics').attr('selected', false);
		$("#characteristics").scrollTop(0);
	}
	
	//Clears and hides error row
	$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"]').hide();
	
	$('#gbox_multipleBookingEquipmentGrid .ui-pg-input').attr("readonly", true);
	//D025993

	if(!addBound){
		$('#gbox_multipleBookingEquipmentGrid #sData').click(function(){
		if($('table[aria-labelledby="gbox_multipleBookingEquipmentGrid"] thead tr[id="FormError"]').css('display') != 'table-row'){
						updateMultipleBookingEquipmentGrid();
					}
		
		if(equipmentUpdateStatus){
					deleteAddedRow = false;
				} else {
					deleteAddedRow = true;
				}
			isMultipleBookingChanged = "Y";
		});
		addBound=true;
		}
	if(!deleteAddedRow){
		resetEquipmentAddRow();
	}
	if(deleteAddedRow){
	
		/*var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs();
		var rowId = $('#multipleBookingEquipmentGrid').getCell(rowIDs[rowIDs.length - 1], 'equipmentSeqNo');
		 $('#multipleBookingEquipmentGrid').jqGrid('editRow', rowId, false, EquipmentOnEdit);
		 var isSuccess1 = $('#multipleBookingEquipmentGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/booking/multipleBooking/deleteEquipment' //Url
	      );
		if(isSuccess1){
			$('#multipleBookingEquipmentGrid').jqGrid('delRowData',rowId);
		  }
		  */
		//Restore error record data
		$('#multipleBookingEquipmentGrid').jqGrid('editRow', errorRowId, false, EquipmentOnEdit);
		$("#"+errorRowId+"_quantityRequested").val(errorRowData[0]);
		$("#"+errorRowId+"_eqpType").val(errorRowData[1]);
		$("#"+errorRowId+"_eqpSize").val(errorRowData[2]);
		$("#"+errorRowId+"_eqpHeight").val(errorRowData[3]);
		$("#"+errorRowId+"_emptyFullCode").val(errorRowData[4]);
		$("#"+errorRowId+"_temperature").val(errorRowData[5]);
		$("#"+errorRowId+"_temperatureUnitOfMeasureCd").val(errorRowData[6]);
		$("#"+errorRowId+"_characteristics").val(errorRowData[7]);
		//Re validate row
		 
		var isSuccess2 = $('#multipleBookingEquipmentGrid').jqGrid(
			   'saveRow', 
			   errorRowId, 
			   null, //onsuccessfunc
			   _context+'/booking/multipleBooking/updateEquipment' //Url
	    ); 
	
		deleteAddedRow = false;
	}
	currentRowId='';
	
	$('#characteristics').val("");
	$('#characteristics').css('width', '240px');
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
	//changed for D023317
	editAllEquipment();
	return true;
};

var equipmentGridComplete = function()
{
    setTimeout(function(){
         /*
         var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs();
         for (var i=0;i<rowIDs.length;i=i+1)
         {
             console.log("ids .."+rowIDs[i])
             if(!_isEquipEdit)
                    $("#gbox_multipleBookingEquipmentGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
             if(!_isEquipDelete)
                    $("#gbox_multipleBookingEquipmentGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();
         }*/
         // D028992
         if(!_isEquipEdit){
            $('#gview_multipleBookingEquipmentGrid input').attr("disabled", true);
            $('#gview_multipleBookingEquipmentGrid select').attr("disabled", true);
         }
         if(!_isEquipDelete){
            $('#del_multipleBookingEquipmentGrid').hide();
         }
     },500);

     setEquipmentGridCaption();
     return true;
};

var equipmentAfterSubmit = function(){
	isMultipleBookingChanged = "Y";
};

var vvdLoadComplete = function()
{
	clearAddRows('vvdSeqNo');
	//hides add row
	if(!_isVvdAdd || $('#templateId').val()=='' || $('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()=='' || $('#isValidVVD').val()=="N")
		$("#tr_vvdSeqNo", "#gbox_multipleBookingVVDGrid").hide();
	else
		$("#tr_vvdSeqNo", "#gbox_multipleBookingVVDGrid").show();
	
	$('#vvd').css('width', '166px');
	
	if($('#clr').length==0)
	{
		var html= "<a href=\"javascript:void(0)\" id=\"clr\"" +
				" style=\"margin-left:8px;margin-right:8px;float:right;\" onclick=\"$('#vvd').val('');\"" +
				" onmouseover=\"jQuery(this).addClass('ui-state-hover');\" onmouseout=\"jQuery(this).removeClass('ui-state-hover');\" >" +
				"<span class=\"ui-icon ui-icon-trash\"></span></a>";
		var $clearButton = $(html);
		$('#vvd').after($clearButton);
	}
	
	$('#vvd').gatesPopUpSearch({
		func : function() {
			openSearchVVD("multipleBooking");
		},
		imagePath:_context+'/resources/images'
	});
	
	//Clears and hides error row
	$('table[aria-labelledby="gbox_multipleBookingVVDGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_multipleBookingVVDGrid"] thead tr[id="FormError"]').hide();
	
	$('#gbox_multipleBookingVVDGrid #sData').click(function(){
		isMultipleBookingChanged = "Y";
	});
	
	return true;
};

var vvdGridComplete = function()
{
	 if(_multipleBookingUpdate)
		 $('#save').attr("disabled", true);
	 
	 var rowIDs = jQuery("#multipleBookingVVDGrid").getDataIDs(); 
     for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var id = $('#multipleBookingVVDGrid').getCell(rowIDs[i], 'vvdSeqNo');
       var rowData=jQuery("#multipleBookingVVDGrid").getRowData(rowIDs[i]);
       if(_isVvdEdit)
	   {
    	   if((rowData.status==null || rowData.status=='') && $('#isValidVVD').val()=="Y")
    		   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").show();
    	   else
    		   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
	   }
       else
    	   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
       
       if(_isVvdDelete)
	   {
    	   if(rowData.status==null || rowData.status=='')
       		   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").show();
    	   else
    	   {
    		   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();
    		   $('#jqg_multipleBookingVVDGrid_'+id).attr("checked",false);
        	   $('#jqg_multipleBookingVVDGrid_'+id).hide();
    	   }
	   }
       else
    	   $("#gbox_multipleBookingVVDGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();
       
       if((rowData.status==undefined || rowData.status==null || rowData.status=='') && _multipleBookingUpdate && $('#isValidVVD').val()=="Y")
    	   $('#save').attr("disabled", false);
    }
    
    $('#gbox_multipleBookingVVDGrid .ui-pg-input').attr("readonly", true);
    
    if($("#multipleBookingVVDGrid").getGridParam("reccount")==0 && $('#isValidVVD').val()=="N")
	{
    	$('#isValidVVD').val("Y");
	}
    if(!_isVvdEdit)
    {
        setTimeout(function(){
             $('#gview_multipleBookingVVDGrid input').attr("disabled", true);
             $('#gview_multipleBookingVVDGrid select').attr("disabled", true);
        },500);
    }
    if(!_isVvdDelete)
	{
		//$("#gbox_multipleBookingVVDGrid .cbox").attr("disabled", true);
		setTimeout(function(){
             $('#del_multipleBookingVVDGrid').hide();
            },500);
	}
	else
	{
		$('#jqgh_multipleBookingVVDGrid_cb').html('<input type="checkbox" id="multiselect_multipleBookingVVDGrid" />');
		$("#multiselect_multipleBookingVVDGrid").click(function(){
			$("#multipleBookingVVDGrid").resetSelection();
			
			if($("#multiselect_multipleBookingVVDGrid").attr("checked")=="checked")
			{
				  var rowIDs = jQuery("#multipleBookingVVDGrid").getDataIDs(); 
			      for (var i=0;i<rowIDs.length;i=i+1)
			      { 
			    	  var id = $('#multipleBookingVVDGrid').getCell(rowIDs[i], 'vvdSeqNo');
			    	  var rowData=jQuery("#multipleBookingVVDGrid").getRowData(rowIDs[i]);
			    	  if(rowData.status!=undefined && rowData.status!=null && rowData.status!='')
			    	  {
			    		  $('#jqg_multipleBookingVVDGrid_'+id).attr("checked",false);
			    	  }
			    	  else
			    	  {
			    		  $('#jqg_multipleBookingVVDGrid_'+id).attr("checked",true);
		 		    	  $('#multipleBookingVVDGrid').setSelection(rowIDs[i], true);
			    	  }
			      }
			}
			return true;
		});
	}
     
    return true;
};

var multipleVVDAfterSubmit = function()
{
	isMultipleBookingChanged = "Y";
};
	
function validateForPositiveIntegers(value) {
	var re = new RegExp("^[0-9]+$");
	if (value<=0) {
		return false;
	} else if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

function createVVDSearchGrid()
{
	var colNames = [ 'Trip Seq No', 'Voyage', 'Sail Date', 'Arrival Date', 'Cutoff Date'];
	
	var colModel = [ {
		name : 'tripSeqNo',
		hidden : true
	}, {
		name : 'voyageString',
		width : 300,
		align : 'center'
	}, {
		name : 'dateOfDeparture',
		align : 'center',
		width : 200
	}, {
		name : 'dateOfArrival',
		align : 'center',
		width : 200
	}, {
		name : 'cutOffdate',
		align : 'center',
		width : 200
	}];
	

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "tripSeqNo"
	};

	createGrid("vvdResultGrid", // grid id for vvd Results
	"vvdResultPager", // page id for party
	_context+'/booking/routing/loadSearchResults', // geturl
	'', // addurl
	'', // edit url
	'', //delete url
	'',// delete selected URL
	colNames, colModel, "Search Results",// caption
	"auto",// height
	500,// row num
	[10,50,100,200,500],// row list
	true,// multiselect
	false,// multidelete
	false,// load once
	true, // read only grid
	jsonReader, // json reader
	true, // hide edit
	true, // hide delete
	false, // autowidth
	false, // rownumbers
	true, // hide custom add row
	false,// hide pager row
	null,// custom edit method
	null,// custom grid complete
	vvdResultGridLoadComplete,// custom load complete
	false,// default hidden
	true);// row Color Based On status
}

var vvdResultGridLoadComplete = function(){
	if(firstLoad == "Y")
	{
		//$('#selectButtonDiv').hide();
		$('#searchVVDButton').trigger('click');
		firstLoad = "N";
		$('#vvdResultPager .ui-pg-input').attr("readonly", true);
	}
	else
		$.unblockUI();
	/*else
	{	
		if($("#vvdResultGrid").getGridParam("reccount")>0){
			$('#selectButtonDiv').show();
		}
		else{
			$('#selectButtonDiv').hide();
		}
	}*/
};

function templatePopUpSearch()
{
	var actionUrl = _context +"/cas/templateSearch.do?templateValue1="+prepareInputForCASTemplateScreen();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'TemplateSearch', windowStyle);
}

function templateUpdate(id)
{
	var results = id.split("|");
	//var templateId = results[2];
	var templateNo = results[0];
	//var templateDesc = results[4];
	$('#templateNumber').val('');
	loadTemplate(templateNo);
}

function checkTemplate(){
	if($('#templateNumber').val()!=''){
		  if($('#templateNumber').val().length==7 && $('#templateNumber').val().toUpperCase().indexOf('T')==0)
			  loadTemplate($('#templateNumber').val());
		  else
		  {
			 // clearTemplate();
			  $('#msgDiv').html('<div class="message_error">Invalid Template Number</div>');
			  window.scrollTo(0, 0);
			  $('#templateNumber').val($('#shipmentNumber').val());
		  }
	  }
	  else
	  {
		 // clearTemplate();
		  if($('#shipmentNumber').val()!='')
		  {
			  $('#msgDiv').html('<div class="message_warning">Please use Clear button to clear out template data</div>');
			  window.scrollTo(0, 0);
			  $('#templateNumber').val($('#shipmentNumber').val());
		  }
	  }
}

function loadTemplate(templateNo)
{
	clearTemplateForm();
	$('#msgDiv').html('<div class="message_info">Loading template.....</div>');
	window.scrollTo(0, 0);
	$.ajax({
		url: _context +"/booking/multipleBooking/populateTemplateData",
		type:"GET",
		data:{/*templateId:templateId, */templateNo:templateNo/*, templateDesc:templateDesc*/},
		success: function(responseText){
			$('#multipleBookingForm').loadJSON(responseText.data);
			$('#originPortCityCode').val(responseText.data.portOfLoading);
			$('#destinationPortCityCode').val(responseText.data.portOfDischarge);
			$("#multipleBookingEquipmentGrid").trigger("reloadGrid");
			$("#multipleBookingVVDGrid").trigger("reloadGrid");
			if(responseText.success)
			{
				$('#msgDiv').html('<div class="message_success">'+responseText.messages.success[0]+'</div>');
				if(responseText.messages.warn.length > 0)
					$('#msgDiv').html($('#msgDiv').html()+'<div class="message_warning">'+responseText.messages.warn[0]+'</div>');
				isMultipleBookingChanged = "N";
				setTimeout(function(){
					if($('#isValidVVD').val()=="N")
					{
						var conf = confirm("VVD(s) not valid for current template POL/POD. Press OK to delete existing VVDs and select valid VVDs");
						if(conf)
						{
							$.ajax({
								url: _context +"/booking/multipleBooking/clearVVD",
								type:"GET",
								success: function(responseText){
									$('#isValidVVD').val("Y");
									$("#multipleBookingVVDGrid").trigger("reloadGrid");
								}
							});
						}
					}
				}, 500);
			}
			else
			{
				$('#msgDiv').html('<div class="message_error">'+responseText.messages.error[0]+'</div>');
			}
				
			window.scrollTo(0, 0);
			$('#templateNumber').focus();
			$('ul.ui-autocomplete').hide();
		}
	});
}

function clearTemplateForm()
{
	$('#multipleBookingForm input:hidden').val('');
	$('.cutOff').html('');
}

function clearTemplate()
{
	$.ajax({
		url : _context +"/booking/multipleBooking/cancel",
		type:"GET",
		success : function(responseText) {
			$('#multipleBookingForm').loadJSON(responseText.data);
			$('#originPortCityCode').val("");
			$('#destinationPortCityCode').val("");
			$("#multipleBookingEquipmentGrid").trigger("reloadGrid");
			$("#multipleBookingVVDGrid").trigger("reloadGrid");
			isMultipleBookingChanged = "N";
			$('#templateNumber').focus();
			$('#msgDiv').html('<div class="message_success">Screen has been refreshed</div>');
		}
	});
}

function prepareInputForCASTemplateScreen(){
	var data="||||||";

	data = data + $('#shipperName').text()+'|';
	data = data + $('#shipperAdd').text()+'|';
	data = data + $('#shipperAroleId').val()+'|';
	data = data + $('#shipperOrgId').val() +'|';
	//Defect# 26080
	/*data = data + $('#consigneeName').text()+'|';
	data = data + $('#consigneeAdd').text()+'|';
	data = data + $('#consigneeAroleId').val()+'|';
	data = data + $('#consigneeOrgId').val() +'|';*/
	data = data + '||||';
	data = data + '|||||||';
	
	return data;
}

function checkTemp(value, emptyFullCode)
{
	if(emptyFullCode=='F' && $.trim(value)==''){
		return false;
	}
	if(value!='')
	{
		var upperCase = value.toUpperCase();
		if(upperCase == 'WA' || upperCase == 'AMB')
			return true;
		else
		{
			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
			
			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,1})?$/;
			
			if(isTempFirstLetterPlusMinusDot.test($.trim(value))){
				return false;
			}
			if(isTempFirstLetterPlusDot.test($.trim(value))){
				return false;
			}
			if(!regTemp.test($.trim(value))){
				return false;
			}
			return true;
		}
	}
	else
		return true;
}

function showSelectedCharacteristics(){
	var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs(); 
    for (var i=0;i<rowIDs.length;i=i+1){ 
    	var id = '#'+rowIDs[i]+'_characteristics';
    	if($(id).val() != undefined){
    		var valArr = $(id).val();
    		$(id+' option').attr('selected', false);
    		for(var j= valArr.length-1; j>=0; j--)
			{
    			if(valArr[j]!='Select')
    				$(id+' option[value="'+valArr[j]+'"]').attr('selected', 'selected');
			}
    	}
    }
}

function openEquipmentSelectDialog(rowId)
{
	$('#multipleBookingEquipmentGrid').setSelection(rowId, true);
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
				$('#characteristicsMsgDiv').html('<div class="message_error">Only one of the STOWAD/STOWBD characteristic is allowed</div>');
			}
			else if(countVENT>1){
				$('#characteristicsMsgDiv').html('<div class="message_error">Multiple VENT characteristics are not allowed</div>');
			}
			else{
				$('#'+idPrefix+"characteristics").val(characts);
				$('#'+idPrefix+"characteristics").closest('td').attr('title', characts);
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
		_context+'/booking/multipleBooking/loadEquipmentCharacteristicsGrid', // geturl
		'', // addurl
		'', // edit url
		'', //delete url
		'',// delete selected URL
		colNames, 
		colModel, 
		"Select Characteristics",// caption
		'auto',// height
		20,// row num
		[20],// row list
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

function clearEquipRow(rowId)
{
	$("#"+rowId+"_characteristics").val('');
	$("#"+rowId+"_characteristics").closest('td').attr('title', '');
}

function clearAddRows(id)
{
	$('#tr_'+id+' input').val('');
	$("#tr_'+id+' select").val($("this option:first").val());
}

function setEquipmentGridCaption()
{
	var caption = "Equipment";
	 var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs();
	 if(rowIDs.length>0)
	 {
		 caption = caption + " - ";
		 for (var i=0;i<rowIDs.length;i=i+1)
	     { 
			 var id = $('#multipleBookingEquipmentGrid').getCell(rowIDs[i], 'equipmentSeqNo');
		     var rowData=jQuery("#multipleBookingEquipmentGrid").getRowData(id);
			 if(i==0)
				 caption = caption + rowData.eqpType + rowData.eqpSize + rowData.eqpHeight;
			 else
				 caption = caption + ", " + rowData.eqpType + rowData.eqpSize + rowData.eqpHeight;
	     }
	 }
     $('#gbox_multipleBookingEquipmentGrid .ui-jqgrid-title').text(caption);
}
//changed for D023317
function editAllEquipment(){
	var rowIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowId = $('#multipleBookingEquipmentGrid').getCell(rowIDs[i], 'equipmentSeqNo');
	   $('#multipleBookingEquipmentGrid').jqGrid('editRow', rowId, false, EquipmentOnEdit);
    }
	currentRowId='';
}
var EquipmentOnEdit=function(rowId) {
	            				 //alert("onEdit rowId: " + rowId);
								 currentRowId = rowId+"_";
				                 $('#'+rowId+'_characteristics').css('width', '240px');
								 $('#'+rowId+'_characteristics').gatesPopUpSearch({
											func : function() {
												openEquipmentSelectDialog(rowId);
											}
										});
				           };
						   
function resetEquipmentAddRow(){
	$('#quantityRequested').val('');
	$('#eqpType').val('');
	$('#eqpSize').val('');
	$('#eqpHeight').val('');
	$('#emptyFullCode').val('F');
	$('#temperature').val('');
	$('#temperatureUnitOfMeasureCd').val('');
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

						   
function updateMultipleBookingEquipmentGrid() {

	equipmentUpdateStatus=true;
	var dataIDs = jQuery("#multipleBookingEquipmentGrid").getDataIDs();
	for (var i = 0; i < dataIDs.length ; i++) {
		
		 var rowId = $('#multipleBookingEquipmentGrid').getCell(dataIDs[i], 'equipmentSeqNo');
		
	   currentRowId = rowId+"_";
	                   	 
		var isSuccess = $('#multipleBookingEquipmentGrid').jqGrid(
			   'saveRow', 
			   rowId, 
			   null, //onsuccessfunc
			   _context+'/booking/multipleBooking/updateEquipment' //Url
	   );
	   if(!isSuccess )
	   {	
	   equipmentUpdateStatus=false;
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
							$("#"+rowId+"_characteristics").val()];
	   break;
	   }
	   	
	}
	 editAllEquipment();
	return;
		
}
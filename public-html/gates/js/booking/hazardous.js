var countryPhoneCodes = null;
var emergencyPhoneCountryCode="";
function createHazGrid(){
	var currentRowId='';
	var colNames = ['Id','HazCleared','UN/ NA', 'Hzd Code', 'Hzd Class', 'Flash Pt', 'F/C', 'Package Group', 'Country Code', 'Area Code', 'Exchange Code', 'Station Code', 'Ext','Actions'];
	var colModels = [
	               {name:'hazSeqNo', index:'hazSeqNo', hidden:true},	
	               {name:'hazCleared', index:'hazCleared', hidden:true},
	               {name:'hazardousFreightPrefixCode',index:'hazardousFreightPrefixCode', width:33, editable:true, editoptions: {maxlength: 2},
	            	   editrules:{
	            		   required:true,
	            		   custom: true,
	            		   custom_func:function(value,colname) {
	                			if($('#currentCommodityLine').val() == 0) {
	                				return [false,"Add commodity line before adding hazards"];
	                			} 
	                			return [true,""];
	            		   }
	            		   
	            		  /* custom:true,
	            		   custom_func:function (value, colname) {
	            			   //alert("hazardousFreightPrefixCode: " + value);
	            			   if($.trim(value)=='' && $.trim($("#"+currentRowId+"hazardousFreightCode").val())=='' && $.trim($("#"+currentRowId+"hazardousFreightClassCode").val())==''){
	            				   return [false, colname+": UN/NA or Hzd Class is required."];
	            			   }
	            			   else if($.trim(value)=='' && $.trim($("#"+currentRowId+"hazardousFreightCode").val())!='' && $.trim($("#"+currentRowId+"hazardousFreightClassCode").val())==''){
	            				   return [false, colname+": UN is required."];
	            			   }
	            			   return [true,""];
	            		   }*/
	            	   }
	               },
	               {name:'hazardousFreightCode',index:'hazardousFreightCode', width:43, editable:true, editoptions: {maxlength: 4}, 
	            	   editrules:{
	            		   required:false
	            		  /* custom:true,
	            		   custom_func:function (value, colname) {
	            			   //alert("hazardousFreightCode: " + value);
	            			   if($.trim(value)=='' && $.trim($("#"+currentRowId+"hazardousFreightPrefixCode").val())!='' && $.trim($("#"+currentRowId+"hazardousFreightClassCode").val())==''){
	            				   return [false, colname+": NA is required."];
	            			   }
	            			   return [true,""];
	            		   }*/
	            	   }
	               },	
	               {name:'hazardousFreightClassCode',index:'hazardousFreightClassCode', width:125, editable:true, editoptions: {maxlength: 10}, editrules:{required:false}},
	               {name:'hazardousFlashPointTemp',index:'hazardousFlashPointTemp', width:60, editable:true, editoptions: {maxlength: 5},
	            	   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			//alert("flashPt: " + value);
	                			if($.trim(value)==''){
	                				return [true,""];
	                			}
	                			if(!/^([0-9]){1,5}?$/.test($.trim(value))){
	                				return [false, colname+": This should be numeric."];
	                			}
	                			return [true,""];
	                		}
	                	}},
		           {name:'hazardousFlashPointUomCode', index:'hazardousFlashPointUomCode', width:55, editable:true, edittype:"select", 
		            	editoptions:{value:":;C:C;F:F"},
		            	editrules:{
	                		custom:true,
	                		custom_func:function (value, colname) {
	                			var temp = $.trim($("#"+currentRowId+"hazardousFlashPointTemp").val());
	                			if(temp!='' && value==''){
		            				return [false, colname+": This must be specified for Flash Pt."];
								}
	                			else if(temp=='' && value!=''){
	                				return [false, colname+": This is valid only if Flash Pt is provided."];
	                			}
		            			else{
									return [true,""];
								}
	                		}
	                	}},
	               {name:'hazardousPackageGroupCode',index:'hazardousPackageGroupCode', width:60, editable:true, editoptions: {maxlength: 3}},
	              /* {name:'emergencyPhoneCountryCode', index:'emergencyPhoneCountryCode', width:150, editable:true, 
	            	   editrules:{
	            		   custom:true,
	            		   custom_func:function (value, colname) {
	            			   	 //alert("emergencyPhoneCountryCode: " + value);
	            			   	 emergencyPhoneCountryCode = value;
	            				 //alert("checkForDefaultValue:" + value);
	            			   
		        				 if($.trim(value)=='' && ($("#"+currentRowId+"emergencyPhoneAreaCode").val()!='' || $("#"+currentRowId+"emergencyPhoneExchange").val()!=''|| $("#"+currentRowId+"emergencyPhoneStation").val()!='')){
		        					 $("#"+currentRowId+"emergencyPhoneCountryCode").val("1");
		        					 emergencyPhoneCountryCode = 1;
		        					 //return [false, colname+": This is required."];
		        				 }
		        				 return [true,""];
	            		   }}, edittype:"select", formatter:'select', editoptions:{value: countryPhoneCodes, defaultValue:'default'}},*/
	               {name:'emergencyPhoneCountryCode', index:'emergencyPhoneCountryCode', width:60, editable:true, 
	            	   editrules:{
	            		   custom:true,
	            		   custom_func:function (value, colname) {
	            			   	/* emergencyPhoneCountryCode = value;
	            			   
		        				 if($.trim(value)=='' && ($("#"+currentRowId+"emergencyPhoneAreaCode").val()!='' || $("#"+currentRowId+"emergencyPhoneExchange").val()!=''|| $("#"+currentRowId+"emergencyPhoneStation").val()!='')){
		        					 $("#"+currentRowId+"emergencyPhoneCountryCode").val($('input[name="consignee\\.contactPhoneCountryCode"]').val());
		        					 emergencyPhoneCountryCode = $('input[name="consignee\\.contactPhoneCountryCode"]').val();
		        					 //return [false, colname+": This is required."];
		        				 }*/
	            			   
	            			   if($.trim(value)=='' && ($("#"+currentRowId+"emergencyPhoneAreaCode").val()!='' || $("#"+currentRowId+"emergencyPhoneExchange").val()!=''|| $("#"+currentRowId+"emergencyPhoneStation").val()!=''))
	            				   return [false, colname+": This is required."];
		        			   return [true,""];
	            		   }}, editoptions:{maxlength:3}},
	               
				   {name:'emergencyPhoneAreaCode', index:'emergencyPhoneAreaCode', width:60,editable:true, 
	            			   editrules:{number: true,
	            				   custom:true,
	            				   custom_func:function (value, colname) {
	            					   //alert("emergencyPhoneAreaCode: " + value);
	            					   	if($.trim(value)=='' && (/*$.trim($("#"+currentRowId+"emergencyPhoneCountryCode").val())!='' ||*/ $("#"+currentRowId+"emergencyPhoneExchange").val()!=''|| $("#"+currentRowId+"emergencyPhoneStation").val()!='')){
	            							 return [false, colname+": This is required."];
	            						}
	            						else if($.trim(value)!=''){
	            							if(emergencyPhoneCountryCode=='1' && value.length != 3){
	            								 return [false, colname+": For domestic phone numbers, this must be 3 in length."];
	            							}
	            							else if(emergencyPhoneCountryCode!='1' && (value.length < 2 || value.length > 4)){
	            								 return [false, colname+": For foreign phone numbers, this must be between 2 and 4 in length."];
	            							}
	            						}
	            						return [true,""];
	    	            		   }}, editoptions:{size:5,maxlength:4}},
				   {name:'emergencyPhoneExchange', index:'emergencyPhoneExchange', width:60,editable:true, 
					   editrules:{number: true,
					   custom:true,
					   custom_func:function (value, colname) {
						   //alert("emergencyPhoneExchange: " + value);
						   if($.trim(value)=='' && (/*$.trim($("#"+currentRowId+"emergencyPhoneCountryCode").val())!='' ||*/ $("#"+currentRowId+"emergencyPhoneAreaCode").val()!=''|| $("#"+currentRowId+"emergencyPhoneStation").val()!='')){
								 return [false, colname+": This is required."];
							 }
							else if($.trim(value)!=''){
								 if(emergencyPhoneCountryCode=='1' && value.length != 3)
								 {
									 return [false, colname+": For domestic phone numbers, this must be 3 in length."];
								 }
								 else if(emergencyPhoneCountryCode !='1' && value.length != 3 && value.length != 4)
								 {
									 return [false, colname+": For foreign phone numbers, this must be 3 or 4 in length."];
								 } 
							 }
							 return [true,""];
					   }}, editoptions:{size:5,maxlength:4}},
				   {name:'emergencyPhoneStation', index:'emergencyPhoneStation', width:60,editable:true, 
						   editrules:{number: true,
							   custom:true,
							   custom_func:function (value, colname) {
								   //alert("emergencyPhoneStation: " + value);
								   if($.trim(value)=='' && (/*$.trim($("#"+currentRowId+"emergencyPhoneCountryCode").val())!='' ||*/ $("#"+currentRowId+"emergencyPhoneAreaCode").val()!=''|| $("#"+currentRowId+"emergencyPhoneExchange").val()!='')){
										 return [false, colname+": This is required."];
								   }
								   else if($.trim(value)!=''){
										if(value.length != 4){
											 return [false, colname+": This must be 4 in length."];
										}
								   }
								   return [true,""];
							   }}, editoptions:{size:5,maxlength:4}},
				   {name:'emergencyPhoneExtension',index:'emergencyPhoneExtension', width:60,editable:true, 
						   editrules:{number: true,
							   custom:true,
							   custom_func:function (value, colname) {
								   //alert("emergencyPhoneStation: " + value);
								   if($.trim(value)!='' && (/*$.trim($("#"+currentRowId+"emergencyPhoneCountryCode").val())=='' ||*/ $("#"+currentRowId+"emergencyPhoneAreaCode").val()==''|| $("#"+currentRowId+"emergencyPhoneExchange").val()=='')){
										 return [false, colname+": The country code, area code, exchange and station must be entered if extension is provided."];
									 }
									/*else if($.trim(value)!=''){
										 if(value.length != 4)
										 {
											 return [false, colname+": This must be 4 in length."];
										 }
									 }*/
									 return [true,""];
							   }
						   }, editoptions:{size:5,maxlength:4}},
				   {name:'actions', index:'actions', width:70, align:"center", editable:false, search:false, sortable:false, formatter:'actions', 
					   formatoptions:{keys:true,
							onEdit: function(rowId){ 
								//alert("onEdit rowId: " + rowId);
								currentRowId = rowId+"_";
							},
							onSuccess:function(jqXHR){
								//alert("onSuccess");
								//alert("onSuccess currentRowId before: " + currentRowId);
								currentRowId='';
								//alert("onSuccess currentRowId after: " + currentRowId);
								return true;
							},
							afterRestore:function(){
								//alert("afterRestore before: " + currentRowId);
								currentRowId='';
								//alert("afterRestore after: " + currentRowId);
							},
							afterSave:function(){
								//alert("afterSave");
								freightModified = true;
								isBookingChanged = "Y";
								loadHazGrid();
								return true;
							}
				   	}}
			   	];

	var jsonReaderReference = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "hazSeqNo"
		};
		
	//D027890:multiple blank rows in Reference & Commodity
	var hazReadOnlyGrid = false;
	if(isCommodityDisplayOnly && !isCommodityModifiable){
		hazReadOnlyGrid = true;
	}
	
	createGrid(
			"hazGrid", // grid id for TCN
			"hazGridPager", // page id for TCN
			_context+'/booking/freight/loadHazGrid', 
			_context+'/booking/freight/addHaz', 
			_context+'/booking/freight/updateHaz', 
			_context+'/booking/freight/deleteHaz', 
			_context+'/booking/freight/deleteHaz',
			colNames, 
			colModels, 
			"Hazardous",
			83,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			hazReadOnlyGrid, jsonReaderReference, false, false, true, true, 
			false, false, false, false, hazGridLoadComplete, false, true, false, hazardousAfterSubmit);
}

var hazGridLoadComplete = function(){
	/*Booking Security*/
	if((isCommodityDisplayOnly && !isCommodityModifiable) || $("#bookingStatusCode").val()=='CANC'){
		//$("div.ui-pg-div.ui-inline-del").hide();
		//$("div.ui-pg-div.ui-inline-edit").hide();
		$("div.ui-pg-div.ui-inline-edit", "#hazGrid").hide();
		$("div.ui-pg-div.ui-inline-del", "#hazGrid").hide();
		$('table[aria-labelledby="gbox_hazGrid"] thead tr[id="tr_hazSeqNo"] td a[id="sData"]').hide();
		$('#del_hazGrid').hide();
		$('#gview_hazGrid input').attr("disabled", true);
		$('#gview_hazGrid select').attr("disabled", true);
	}else{
		//$("div.ui-pg-div.ui-inline-del").show();
		//$("div.ui-pg-div.ui-inline-edit").show();
		$("div.ui-pg-div.ui-inline-edit", "#hazGrid").show();
		$("div.ui-pg-div.ui-inline-del", "#hazGrid").show();
		$('table[aria-labelledby="gbox_hazGrid"] thead tr[id="tr_hazSeqNo"] td a[id="sData"]').show();
		$('#gview_hazGrid input').attr("disabled", false);
		$('#gview_hazGrid select').attr("disabled", false);
		$('#del_hazGrid').show();
	}
	
	$('#gbox_hazGrid #sData').click(function(){
			freightModified = true;
			isBookingChanged = "Y";
		
	});
	
	resetAddRow();
	$("#hazGrid").resetSelection();
	};

function unloadHazGrid(){
	$('#hazGrid').jqGrid('GridUnload');
}

function loadHazGrid(){
	//alert("loadEquipmentGrid");
	$('#hazGrid').trigger("reloadGrid");
}

function makeHazExpandCollapsed(){
	if($("#hazGrid").getGridParam("reccount")>0){
		if(!$('#hazGrid').is(':visible')){
			$(".ui-jqgrid-titlebar-close",$("#hazGrid")[0].grid.cDiv).click();
		}
	}else{
		if($('#hazGrid').is(':visible')){
			$(".ui-jqgrid-titlebar-close",$("#hazGrid")[0].grid.cDiv).click();
		}
	}
}

function populateCountryPhoneCodes(){
	
	function callBack(responseText){
		if(responseText.success){
			countryPhoneCodes = responseText.data;
			//alert("countryPhoneCodes: " + countryPhoneCodes);
		}
	}
	
	populateCountryPhoneCodesRequest(callBack);
}

function populateCountryPhoneCodesRequest(callBack){
	var gatesCheetah = window.gatesCheetah || {};
	if (gatesCheetah && gatesCheetah.countryPhoneCodes && gatesCheetah.countryPhoneCodes !== null)  {
		console.log('Cheetah: populateCountryPhoneCodesRequest from cache');
		callBack(gatesCheetah.countryPhoneCodes);
		return;
	}	
	console.log('Cheetah: populateCountryPhoneCodesRequest from Ajax');
	$.ajax({
		url: _context +"/booking/freight/getCountryPhoneCodes",
		success: callBack
	});
}

function resetAddRow(){
	$('#hazardousFreightPrefixCode').val('');
	$('#hazardousFreightCode').val('');
	$('#hazardousFreightClassCode').val('');
	$('#hazardousFlashPointTemp').val('');
	$('#hazardousFlashPointUomCode').val('');
	$('#hazardousPackageGroupCode').val('');
	$('#emergencyPhoneCountryCode').val($('input[name="consignee\\.contactPhoneCountryCode"]').val());
	if($('input[name="consignee\\.contactPhoneCountryCode"]').val()=='' && $('input[name="consignee\\.contactPhoneAreaCode"]').val()!='')
		$('#emergencyPhoneCountryCode').val('1');
	$('#emergencyPhoneAreaCode').val('');
	$('#emergencyPhoneExchange').val('');
	$('#emergencyPhoneStation').val('');
	$('#emergencyPhoneExtension').val('');
}

var hazardousAfterSubmit = function(result){
	if(result.success){
		freightModified = true;
		isBookingChanged = "Y";
	}
};
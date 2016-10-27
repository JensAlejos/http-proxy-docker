$(document).ready(function () {
	
	//loadHeader();
	if($.trim($('#bookingIdHeader').val()) == 'error'){
		$('#msgDivBkpo').html("<div class=\"message_error\">Booking Not Found.</div>");
		window.scrollTo(0, 0);
		$('#msgDivBkpo').show();
		
	}
	if($.trim($('#fromMenu').val()) == 'true'){ 
		$('#bpoCancel').hide();
	}else{
		$('#bookingNumber').attr('disabled',true);
	}
	
	if($('#bookingNumber').val() == ''){
		$('#bpoSave').hide();
		$("#bpOverrideDefaultGrid").trigger('reloadGrid');
		$("#bpOverrideSupplementGrid").trigger('reloadGrid');
	}else{
		$('#msgDivBkpo').html("<div class=\"message_info\">Successfully Loaded.</div>");
		window.scrollTo(0, 0);
		$('#msgDivBkpo').show();
	}
	
	$('#bookingNumber').bind('keypress', function(event){
		//keyCode for enter key is 13 and for tab out is 9
		if(event.keyCode == 13 || event.keyCode == 9) {
			$('#bookingNumber').val($('#bookingNumber').val().toUpperCase());
			if($('#bookingNumber').val()!='' && $.trim($('#bookingNumber').val()).length == 7){
				var bookingNumber = $('#bookingNumber').val();
				showLoadingMessage('L'); 
				$("#bookingPrintForm").attr("action","showBPOFormMenu?bookingNumber="+bookingNumber);
				cleanForm();
				$("#bookingPrintForm").attr("method","GET");
				$("#bookingPrintForm").submit();
				//cleanForm();
			}else{
				return false;
			}
		}
    });
	
	$('#bookingNumber').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: "Booking Number",
	 	extraParams: {
		 		 method: 'searchBKNumber',
		 		 searchType: '230',
		 		 parentSearch:  function() { return ''; }
	 	},
		minLength: 7,
		formatItem: function(data) {
			return data.shno;
		},
		formatResult: function(data) {
			return data.shno;
		}, 
		select: function(data) {
			var bookingNumber = $('#bookingNumber').val(); 
			showLoadingMessage('L'); 
			cleanForm();
			$("#bookingPrintForm").attr("action","showBPOFormMenu?bookingNumber="+bookingNumber);
			$("#bookingPrintForm").attr("method","GET");
			$("#bookingPrintForm").submit();
			
		}
	});
	
	var colNamesForUsers = ['Id','Form Type','Source', '#Copies', 'Location','Hold', 'Mail-SVC', 'Last Updated User ID','Last Updated Date','', 'Actions'];
	var colModelForUsers = [
			   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
			   		{name: 'formTypeCode', index: 'formTypeCode', width:200, editable: true, edittype: "select",
						   editoptions: {dataUrl:_context+'/booking/bpOverride/loadBPOverrideFormType'},
					   	   editrules:{
				   				required:true,
		                		custom:true,
					   		    custom_func:function (value, colname) {
			            			if(value == 'default'){
			            				return [false,colname+ ": Please Select Form type."];
			            			}else{
										return [true,""];
									}
					   		    }
				   			}
			   		},
			   		{name:'bookingSource', index:'bookingSource', width:75, editable:false},
			   		{name:'numberOfCopies', index:'numberOfCopies', width:75, editable:true, editoptions: {maxlength: 3}, 
			   			editrules:{
			   				required:true,
	                		custom:true,
				   		    custom_func:function (value, colname) {
		            			if(!/^[0-9]+$/.test($.trim(value))){
		            				return [false,colname+ ":  Non numeric value is not allowed."];
		            			}else{
									return [true,""];
								}
				   		    }
			   			}
			   		},
			   		{name: 'cityCode', index: 'cityCode', width:75, editable: true, edittype: "select", 
			   			editoptions: {value:":"},
			   			editrules:{
			   				required:true,
	                		custom:true,
				   		    custom_func:function (value, colname) {
		            			if(value == 'default'){
		            				return [false,colname+ ": Please Select Location."];
		            			}else{
									return [true,""];
								}
				   		    }
			   			}
		  	   		},		   		
			   		{name: 'isHold', index: 'isHold', width:75, editable: true, 
						   edittype: "select", 
						   editoptions: {value:"N:No;Y:Yes",defaultValue:"N"},
						   editrules:{
				   			   required:true,
		                	   custom:true,
					   		   custom_func:function (value, colname) {
			            			if(value == ''){
			            				return [false,colname+ ":  Please Select Hold."];
			            			}else{
										return [true,""];
									}
					   		    }
			   			}
			   		},
			   		{name: 'mailServiceCode', index: 'mailServiceCode', width:75, 
			   						   editable: true, 
			   						   edittype: "select", 
			   						   editoptions: {dataUrl:_context+'/booking/bpOverride/loadBPOverrideMailSVCType'},
			   						   editrules:{
							   			   required:false}
			   		},
			   		{name: 'lastUpdateUser', index: 'lastUpdateUser', width:140, editable: false},
			   		{name: 'lastUpdateDate', index: 'lastUpdateDate', width:125, editable: false},
			   		{name:'dataUpdated', index:'dataUpdated', hidden :true},
			   		{	name:'actions',
			   			index:'actions',
			   			width:100, 
			   			align:"center", 
			   			formatter:'actions', 
			   			formatoptions:{
			   			keys:true,
			   			url: _context+'/booking/bpOverride/editBPODefaultGrid', 
			   			afterSave: function() { 
			   				loadDefaultGrid();
			   				loadSupplementGrid();
							return true;
						}, 
						afterRestore: function() { 
			   				loadDefaultGrid();
			   				loadSupplementGrid();
							return false;
						} 
			   		}}
			   	];
	
	var colModelForUsers1 = [
	    			   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
	    			   		{name: 'formTypeCode', index: 'formTypeCode', width:200, editable: true, edittype: "select",
	    						   editoptions: {dataUrl:_context+'/booking/bpOverride/loadBPSupplementFormType'
	    							   ,
	   								dataEvents: [
	   						                      {  type: 'change',
	   						                         fn: function(e) {
	   						                        	 var rowId = $(e.target).closest("tr.jqgrow").attr("id");
	   						                        	 var formType = this.value;
	   						                        	 
	   						                        	 if(typeof rowId=='undefined' && formType != null && formType != undefined && formType != "undefined"){						                        		 
	   									                    $.ajax({
	   									                  	type: "GET",
	   									                  	url: _context +"/booking/bpOverride/loadPrintLocation",
	   									                  	data: "formType="+ formType,
	   									                  	async: false,
	   									                  	success: function(responseText){	
	   									                  	$('select#cityCode').children().remove().end();
	   						                 				$('select#cityCode').append($("<option/>", {
	   						                 					value : 'default',
	   						                 					text : "Please select"
	   						                 				}));
	   									                  		var response = responseText.split("-");				   
	   									                  		for(i=0;i<response.length-1;i++){
	   									                  			$('select#cityCode').append($("<option/>", {
	   									                  			value : response[i],
	   									                  			text : response[i]
	   									                  	}));
	   									                  	}  				   	 
	   									                  	}
	   									                  });								                        	
	   						                        	 } else if(typeof rowId!='undefined'){
	   						                        		var prntRowId = rowId;
	   						                 			var defaultOption = "";
	   						                 			if(prntRowId != null && prntRowId != undefined && prntRowId != "undefined"){
	   						                 		     //formType= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(3)').attr('title');
	   						                 		     defaultOption= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(6)').attr('title');
	   						                 			}
	   						                 			 $('select#'+prntRowId+'_cityCode').children().remove().end();
	   						                 				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
	   						                 					value : 'default',
	   						                 					text : "Please select"
	   						                 				}));
	   						                 		 $.ajax({
	   						                 			   type: "GET",
	   						                 			   url: _context +"/booking/bpOverride/loadPrintLocation",
	   						                 			   data: "formType="+ formType,
	   						                 			   async: false,
	   						                 			   success: function(responseText){				   	
	   						                 				   var response = responseText.split("-");				   
	   						                 				   for(i=0;i<response.length-1;i++){
	   						                 					   $('select#'+prntRowId+'_cityCode').append($("<option/>", {
	   						                 						   value : response[i],
	   						                 						   text : response[i]
	   						                 						}));
	   						                 				   }  				   	 
	   						                 				 }
	   						                 			 });
	   						                 		 if(defaultOption != null && defaultOption != undefined && defaultOption != "undefined" && defaultOption.trim() != ""){	 
	   						                 		      $('select#'+prntRowId+'_cityCode').val(defaultOption.trim());
	   						                 		   	}
	   						                        	 }
	   						                         }
	   						                      }
	   						                   ]},
	    					   	   editrules:{
	    				   				required:true,
	    		                		custom:true,
	    					   		    custom_func:function (value, colname) {
	    			            			if(value == 'default'){
	    			            				return [false,colname+ ": Please Select Form type."];
	    			            			}else{
	    										return [true,""];
	    									}
	    					   		    }
	    				   			}
	    			   		},
	    			   		{name:'bookingSource', index:'bookingSource', width:75, editable:false},
	    			   		{name:'numberOfCopies', index:'numberOfCopies', width:75, editable:true, editoptions: {maxlength: 3}, 
	    			   			editrules:{
	    			   				required:true,
	    	                		custom:true,
	    				   		    custom_func:function (value, colname) {
	    		            			if(!/^[0-9]+$/.test($.trim(value))){
	    		            				return [false,colname+ ":  Non numeric value is not allowed."];
	    		            			}else{
	    									return [true,""];
	    								}
	    				   		    }
	    			   			}
	    			   		},
	    			   		{name: 'cityCode', index: 'cityCode', width:75, editable: true, edittype: "select", 
	    			   			editoptions: {value:":"},
	    			   			editrules:{
	    			   				required:true,
	    	                		custom:true,
	    				   		    custom_func:function (value, colname) {
	    		            			if(value == 'default'){
	    		            				return [false,colname+ ": Please Select Location."];
	    		            			}else{
	    									return [true,""];
	    								}
	    				   		    }
	    			   			}
	    		  	   		},		   		
	    			   		{name: 'isHold', index: 'isHold', width:75, editable: true, 
	    						   edittype: "select", 
	    						   editoptions: {value:"N:No;Y:Yes",defaultValue:"N"},
	    						   editrules:{
	    				   			   required:true,
	    		                	   custom:true,
	    					   		   custom_func:function (value, colname) {
	    			            			if(value == ''){
	    			            				return [false,colname+ ":  Please Select Hold."];
	    			            			}else{
	    										return [true,""];
	    									}
	    					   		    }
	    			   			}
	    			   		},
	    			   		{name: 'mailServiceCode', index: 'mailServiceCode', width:100, 
	    			   						   editable: true, 
	    			   						   edittype: "select", 
	    			   						   editoptions: {dataUrl:_context+'/booking/bpOverride/loadBPOverrideMailSVCType'},
	    			   						   editrules:{
	    							   			   required:false}
	    			   		},
	    			   		{name: 'lastUpdateUser', index: 'lastUpdateUser', width:150, editable: false},
	    			   		{name: 'lastUpdateDate', index: 'lastUpdateDate', width:140, editable: false},
	    			   		{name:'dataUpdated', index:'dataUpdated', hidden :true},
	    			   		{	name:'actions',
	    			   			index:'actions',
	    			   			width:100, 
	    			   			align:"center", 
	    			   			formatter:'actions', 
	    			   			formatoptions:{
	    			   			keys:true,
	    			   			url: _context+'/booking/bpOverride/editBPOSupplementGrid', 
	    			   			afterSave: function() { 
	    			   				loadDefaultGrid();
	    			   				loadSupplementGrid();
	    							return true;
	    						}, 
	    						afterRestore: function() { 
	    			   				loadDefaultGrid();
	    			   				loadSupplementGrid();
	    							return false;
	    						} 
	    			   		}}
	    			   	];
	
	
	var jsonReaderBookingPrint = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
	
	
	createGrid(
			"bpOverrideDefaultGrid", 
			"bpOverrideDefaultPagerGrid", 
			_context+'/booking/bpOverride/loadBPODefaultGrid', 
			'',
			_context+'/booking/bpOverride/editBPODefaultGrid', 
			_context+'/booking/bpOverride/removeBPOGrid',
			'',
			colNamesForUsers,colModelForUsers,"Override Default",
		    240,12,[12],false,false,
			false,false, jsonReaderBookingPrint,
			false, false,true, true, true, true,null,null,
			/*false,false,true,true,false,true,false,false,*/
			customloadOverride,false,true);
	
	
	createGrid(
			"bpOverrideSupplementGrid", 
			"bpOverrideSupplementPagerGrid", 
			_context+'/booking/bpOverride/loadBPOSupplementGrid', 
			_context+'/booking/bpOverride/addBPOSupplementGrid',
			_context+'/booking/bpOverride/editBPOSupplementGrid', 
			_context+'/booking/bpOverride/removeBPSupplementGrid', '',colNamesForUsers,colModelForUsers1,"Supplement Default",
			240, 12, [12, 24, 36], false, false,
			false, false, jsonReaderBookingPrint, false, false, 
			true, true, true, true,
			null, null, customloadSupplement, false, true);
	
	jQuery("#bpOverrideDefaultGrid").jqGrid('setGridParam',{
		onSelectRow:function(rowid, status){		
			var formType= "any";
			var prntRowId = jQuery("#bpOverrideDefaultGrid").jqGrid('getGridParam','selrow');
			var defaultOption = "";
			if(prntRowId != null && prntRowId != undefined && prntRowId != "undefined"){
		     formType= $('#bpOverrideDefaultGrid #'+prntRowId+' td:nth-child(3)').attr('title');
		     defaultOption= $('#bpOverrideDefaultGrid #'+prntRowId+' td:nth-child(6)').attr('title');
			}
			 $('select#'+prntRowId+'_cityCode').children().remove().end();
				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
					value : 'default',
					text : "Please select"
				}));
		 $.ajax({
			   type: "GET",
			   url: _context +"/booking/bpOverride/loadPrintLocation",
			   data: "formType="+ formType,
			   async: false,
			   success: function(responseText){				   	
				   var response = responseText.split("-");				   
				   for(i=0;i<response.length-1;i++){
					   $('select#'+prntRowId+'_cityCode').append($("<option/>", {
						   value : response[i],
						   text : response[i]
						}));
				   }  				   	 
				 }
			 });
		 if(defaultOption != null && defaultOption != undefined && defaultOption != "undefined" && defaultOption.trim() != ""){	 
		      $('select#'+prntRowId+'_cityCode').val(defaultOption.trim());
		   	}
	}
});
	jQuery("#bpOverrideSupplementGrid").jqGrid('setGridParam',{
		onSelectRow:function(rowid, status){		
			var formType= "any";
			var prntRowId = jQuery("#bpOverrideSupplementGrid").jqGrid('getGridParam','selrow');
			var defaultOption = "";
			if(prntRowId != null && prntRowId != undefined && prntRowId != "undefined"){
		     formType= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(3)').attr('title');
		     defaultOption= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(6)').attr('title');
			}
			 $('select#'+prntRowId+'_cityCode').children().remove().end();
				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
					value : 'default',
					text : "Please select"
				}));
		 $.ajax({
			   type: "GET",
			   url: _context +"/booking/bpOverride/loadPrintLocation",
			   data: "formType="+ formType,
			   async: false,
			   success: function(responseText){				   	
				   var response = responseText.split("-");				   
				   for(i=0;i<response.length-1;i++){
					   $('select#'+prntRowId+'_cityCode').append($("<option/>", {
						   value : response[i],
						   text : response[i]
						}));
				   }  				   	 
				 }
			 });
		 if(defaultOption != null && defaultOption != undefined && defaultOption != "undefined" && defaultOption.trim() != ""){	 
		      $('select#'+prntRowId+'_cityCode').val(defaultOption.trim());
		   	}
	}
});
	
	
	enforceBPOOverrideUserSecurityRolesAndPermissions();
	
	$('#bookingNumber').focus();
	
});


function isNumeric(value){
	return /^[0-9]+$/.test($.trim(value));
}

function cleanForm(){
	$('#placeOfRecieptHeader').text("");
	$('#customerGroupHeader').text("");
	$('#bookingStatusHeader').text("");
	$('#portOfLoadingHeader').text("");
	$('#shipperHeader').text("");
	$('#tradeCode1').text("");
	$('#portOfDischargeHeader').text("");
	
	$('#consigneeHeader').text("");
	$('#vvdHeader').text("");
	$('#placeOfDelevieryHeader').text("");
	$('#ldSVCHeader').text("");
	
}

function loadDefaultGrid() {
	$("#bpOverrideDefaultGrid").trigger('reloadGrid');
}

function loadSupplementGrid() {
	$("#bpOverrideSupplementGrid").trigger('reloadGrid');
}


var customloadOverride = function(){
	if($('#bookingNumber').val() != ''){
		$('#gview_bpOverrideDefaultGrid div table thead tr#tr_seqNo').hide();
		
		$('table[aria-labelledby="gbox_bpOverrideDefaultGrid"] thead tr[id="FormError"] td').html("");
		$('table[aria-labelledby="gbox_bpOverrideDefaultGrid"] thead tr[id="FormError"]').hide();
		currentRowId = '';
		
		manageInlineDeleteVisibility('bpOverrideDefaultGrid');
		manageInlineEditVisibilityWithStatus('bpOverrideDefaultGrid');
		enforceSecurityOnBPOOverrideGrid();
	}else{
		$('#gview_bpOverrideDefaultGrid div table thead tr#tr_seqNo').hide();
	}
};

var customloadSupplement = function(){ 
	if($('#bookingNumber').val() != ''){
		var loadFirst = $('#loadFirst').val();
		if(loadFirst == 'true'){
			$('#loadFirst').val("false");
			validateBillingExists('bpOverrideSupplementGrid');
			validateAROLExists('bpOverrideSupplementGrid');
			validateTradeCCPCExists('bpOverrideSupplementGrid');
		}
	
		$('table[aria-labelledby="gbox_bpOverrideSupplementGrid"] thead tr[id="FormError"] td').html("");
		$('table[aria-labelledby="gbox_bpOverrideSupplementGrid"] thead tr[id="FormError"]').hide();
		currentRowId = '';
		manageInlineDeleteVisibility('bpOverrideSupplementGrid');
		manageInlineEditVisibilityWithStatus('bpOverrideSupplementGrid');
		enforceSecurityOnBPOSupplementGrid();
	}else{
		$('#gview_bpOverrideSupplementGrid div table thead tr#tr_seqNo').hide();
	}
};



// validate billing exists.
function validateBillingExists(gridId){
		$.ajax({
				url: _context +"/booking/bpOverride/validateBilling",
				type:'POST',
				success: function(responseText){
					if (responseText.messages.info.length > 0) {
						hideUpdateBKPO(gridId);
						showResponseMessages1('msgDivBkpo',responseText);
						window.scrollTo(0, 0);
						$('#msgDivBkpo').show();
					}
					
				}
			});
		
	};
	
	function validateAROLExists(gridId){
		$.ajax({
				url: _context +"/booking/bpOverride/validateAROL",
				type:'POST',
				success: function(responseText){
					
					if (responseText.messages.info.length > 0) {
						hideUpdateBKPO(gridId);
						showResponseMessages1('msgDivBkpo',responseText);
						window.scrollTo(0, 0);
						$('#msgDivBkpo').show();
					}
					
					
				}
			});
		
	};
	
	// validate billing exists.
	function validateTradeCCPCExists(gridId){
			$.ajax({
					url: _context +"/booking/bpOverride/validateTradeCCPC",
					type:'POST',
					success: function(responseText){
						if (responseText.messages.error.length > 0) {
							hideUpdateBKPO('bpOverrideSupplementGrid');
							showResponseMessages1('msgDivBkpo',responseText);
							window.scrollTo(0, 0);
							$('#msgDivBkpo').show();
							//return false;
						}
						
					}
				});
			
		};
	function hideUpdateBKPO(gridId){
		$('#bpoSave').hide();
		if(gridId == 'bpOverrideSupplementGrid'){
			$('#gview_bpOverrideSupplementGrid div table thead tr#tr_seqNo').hide();
		}
		manageInlineEditVisibility('bpOverrideDefaultGrid');
		manageInlineEditVisibility('bpOverrideSupplementGrid');
	}
	
	function manageInlineEditVisibility(gridId) {
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var loopId = 0; loopId < dataIDs.length ; loopId++) {
			var rowId =	dataIDs[loopId];
			$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-edit').hide();
			$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').hide();
		}
	}
	function manageInlineEditVisibilityWithStatus(gridId) {
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		
		if(document.getElementById("tradeCode1").innerText=='A-ALASKA' || document.getElementById("tradeCode1").innerText=='ALASKA'){
			for (var loopId = 0; loopId < dataIDs.length ; loopId++) {
				var rowId =	dataIDs[loopId];
				var colName ='formTypeCode';
				var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
				if(colValue != undefined && colValue != null && colValue != 'Freight Bill Prepaid RATED' 
					&& colValue != 'Freight Bill Collect RATED'){
					$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-edit').hide();
				}
			}
		}
	}
	function manageInlineDeleteVisibility(gridId) {
		var colName ='bookingSource';
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		
		for (var loopId = 0; loopId < dataIDs.length ; loopId++) {
			var rowId =	dataIDs[loopId];
			var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
			if(colValue == 'Booking' || colValue == 'Template' ){
				//$('#'+gridId+' tbody tr#'+rowId).css("background-color", "RED");
				var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
				for(var i = 0; i < columns.length ; i++){
					var tdElement = columns[i];
					if($(tdElement).attr("aria-describedby")==gridId+'_bookingSource'){
						$(tdElement).css("background-color", "#FC4E4E");
					}
				}
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').show();
			} else{
				//D026225
				if(colValue == 'AROL'  || colValue == 'Debtor'||colValue == 'Shipper'|| colValue == 'Consignee' 
					|| colValue == 'Shipper-Xref' || colValue == 'Consignee-Xref' ){
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_bookingSource'){
							$(tdElement).css("background-color", "#DBE23C");
						}
					}
				}
				if(colValue == 'Trade' ){
					//$('#'+gridId+' tbody tr#'+rowId).css("background-color", "GREEN");
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_bookingSource'){
							$(tdElement).css("background-color", "#409C40");
						}
					}
				}
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').hide();
			}
		}
	}

	// BKPO save 
	function saveBKPO(){
		/*if($.trim($('#bookingNumber').val()) == ''){
			$('#bookingNumber').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
			return false;
		} */if($.trim($('#bookingNumber').val()) != $('#tempBookingNumber').val()){
			$('#bookingNumber').validationEngine('showPrompt', '* Booking must be loaded first.', 'error', 'topRight', true);
			return false;
		}
	showLoadingMessage('S');
		var urlStr = _context +"/booking/bpOverride/saveBPO";
		//$('#msgDivBkpo').hide();
		 $.ajax({
			type: "POST",
			url: urlStr,
		
			success: function(responseText){
				showResponseMessages1('msgDivBkpo',responseText);
				$("#bpOverrideDefaultGrid").trigger('reloadGrid');
				$("#bpOverrideSupplementGrid").trigger('reloadGrid');
				$("#bookingNumber").attr("disabled",false);
				$('#bpoSave').attr("disabled",false);
				$('#bpoCancel').attr("disabled",false);
			}
		 
		}); 

	};
	
	function showLoadingMessage(type){ 
		
		$('#bpoSave').attr("disabled",true);
		$('#bpoCancel').attr("disabled",true);
		
		if(type == 'L'){
			$('#msgDivBkpo').html("<div class=\"message_info\">Loading Booking "+ $("#bookingNumber").val() +" ...</div>");
		}else if(type == 'S'){
			$("#bookingNumber").attr("disabled",true);
			$('#msgDivBkpo').html("<div class=\"message_info\">Updating Booking ...</div>");
		}
		window.scrollTo(0, 0);
		$('#msgDivBkpo').show();
	}
	
	//Exit 
	function exitBKPO(id) {
		var colValueDefaultGrid = dataUpdated('bpOverrideDefaultGrid');
		var colValueSupplementGrid = dataUpdated('bpOverrideSupplementGrid');
		var bookingNumber = $('#bookingNumber').val();
		var isTemplate = false;
		if($('#bookingNumber').val().indexOf("T") == 0){
			isTemplate = true;
		}
		if(colValueDefaultGrid == 'true' || colValueSupplementGrid == 'true') {
			var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
			if (isConfirm) {
				if(isTemplate){
					document.location.href = _context +'/booking/template/showTemplateForm?templateNumber='+bookingNumber;
				}else{
					document.location.href = _context +'/booking/showForm?bookingNumber='+bookingNumber;
				}
			}
		} else {
			if(isTemplate){
				document.location.href = _context +'/booking/template/showTemplateForm?templateNumber='+bookingNumber;
			}else{
				document.location.href = _context +'/booking/showForm?bookingNumber='+bookingNumber;
			}
		}
	};
	
	function dataUpdated(gridId) {
		var isDataUpdated = 'false';
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var rowId = 1; rowId <= dataIDs.length ; rowId++) {
			var colValue = $('#' + gridId).jqGrid('getCell', rowId, 'dataUpdated');
			if(colValue == 'true') {
				isDataUpdated = 'true';
				break;
			}else
				isDataUpdated =  'false';
		}
		return isDataUpdated;
	}
	
	function showResponseMessages1(msgDivId, responseText)  { 
	
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
	
		$('#'+msgDivId).html(messageContent);
		if(messageContent!='')
		{
			window.scrollTo(0, 0);
		}
  	}
}

function enforceBPOOverrideUserSecurityRolesAndPermissions() {
	if(isBPOOverrideModifiable == false && isBPOSupplementAdd == false && isBPOSupplementUpdate == false && isBPOSupplementDelete == false) {
		$('#bpoSave').css('visibility','hidden');
	} 
	enforceSecurityOnBPOOverrideGrid();
	enforceSecurityOnBPOSupplementGrid();
}

function enforceSecurityOnBPOOverrideGrid() {
	if(isBPOOverrideModifiable == false) {
		$('#bpOverrideDefaultGrid tbody tr td div.ui-inline-edit').hide();
	}
}

function enforceSecurityOnBPOSupplementGrid() {
	if(isBPOSupplementAdd == false) {
		$('#gview_bpOverrideSupplementGrid div table thead tr#tr_seqNo').hide();
	}
	if(isBPOSupplementUpdate == false) {
		$('#bpOverrideSupplementGrid tbody tr td div.ui-inline-edit').hide();
	}
	if(isBPOSupplementDelete == false) {
		$('#bpOverrideSupplementGrid tbody tr td div.ui-inline-del').hide();
	}
}

function openCustPaperPrintCharSearch(trade) {
	var actionUrl = _context + "/cas/custPaperPrintCharSearch.do?trade="+trade;
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	var myWindow = window.open(actionUrl, 'CustomerPaperPrintCharSearch', windowStyle);
	
}
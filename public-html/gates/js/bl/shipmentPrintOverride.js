var hideSupplimentAdd=false;
var hideSupplimentUpdate=false;
var hideSupplimentDelete=false;
var hideUpdate=false;
var changedGrid = false;
$(function(){
	$('#shipmentCorrectionNumber').change(function(){
		if($('#shipmentCorrectionNumber').val()!=null && $('#shipmentCorrectionNumber').val()!=undefined && $('#shipmentCorrectionNumber').val().trim()!="") {
			$('#shipmentCorrectionNumberValue').val($('#shipmentCorrectionNumber').val());
		}
	});
	
	$('#fetchShipmentInfo').click(
			function(){
				$('#msgDivBkpo').hide();
				var count = 0;
				/*var e = document.getElementById("shipmentCorrectionNumber");
				var strUser = e.options[e.selectedIndex].value;
				alert(strUser);*/
				if($('#shipmentNumber').val()=='')
				{
					$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
					count++;
				}
				/*else if($('#shipmentSequenceNumber').val()=='')
				{
					$('#shipmentSequenceNumber').validationEngine('showPrompt', '* This field is required', 'error', 'topRight', true);
					count++;
				}
				else if($('#shipmentCorrectionNumber').val()=='')
				{
					//$('#shipmentCorrectionNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
					count++;
				}*/
				if(count==0) {
					//added against 18175 to lock screen
					blockUI();
				//alert("Inside Fun call");
				displayShipment();
				$('#shipmentCorrectionNumber').val();
				}
			});
	if($('#shipmentNumber').val()!=''&& (getParamByName("shipmentIdHeader")==null||getParamByName("shipmentIdHeader")=='')){
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			//shipment_sequence_number="000";
			$.ajax({
				async: false,
				type : "POST",
				url : _context + "/shipment/defaultShipmentSequenceNumber",
				data : {				
					shipment_number :shipment_number,
				},
				success : function(responseText) {
					var shipmentSequenceNumber=responseText.data;
					shipment_sequence_number=shipmentSequenceNumber;
					$('#anyChangesDone').val("N");
				}			
			});
		
		}
		$("#shipmentSequenceNumber").val(shipment_sequence_number);
		//------------
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			// start for defect 019028
			$.ajax({
				async: false,
				type : "POST",
				url : _context +"/shipment/header/shipmentCorrectionNumberList",
				data : {
					shipmentNumber : shipment_number,
					shipmentSequenceNumber : shipment_sequence_number,
				},
				success : function(responseText) {
					var list= responseText.data.shipmentCorrectionNumberList;
					$('#shipmentCorrectionNumber option').remove();								
					$.each(list, function(index,codeDescription) {
						$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
					});								
					document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
					$('#anyChangesDone').val("N");
				}
			});
			shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
			
		}
		
		$('#fetchShipmentInfo').trigger("click");
	}
	
	
	 $("#shipmentCorrectionNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#fetchShipmentInfo').click();
			}
		});
	 shipmentSequenceNumber
		$("#shipmentNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#shipmentSequenceNumber').val('');
				$('#shipmentCorrectionNumber option').remove();
				$('#shipmentSequenceNumber').attr('disabled', false);
				$('#shipmentCorrectionNumber').attr('disabled', false);
				$('#fetchShipmentInfo').click();				
			}
		});
		
		$("#shipmentSequenceNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#shipmentCorrectionNumber option').remove();
				$('#shipmentCorrectionNumber').attr('disabled', false);
				$('#fetchShipmentInfo').click();				
			}
		});
	
});




$(document).ready(function () {
	$(document).attr('title','GATES: Billing Print Options Override');
	$("#shipmentPrintOverrideForm").validationEngine('attach');
	
	var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355'
	$('#shipmentNumber').gatesAutocomplete({
		minLength: 7,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 		method: 'searchShpmntNoForHeader',
	 		searchType: '355',
	 	},
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			//if($('#shipmentSequenceNumber').val() == null	|| $('#shipmentSequenceNumber').val() == ""){
			//populate seq number and correction number default on shipment number change start
				$.ajax({
					async: false,
					type : "POST",
					url : _context + "/shipment/defaultShipmentSequenceNumber",
					data : {				
						shipment_number :$('#shipmentNumber').val(),
					},
					success : function(responseText) {
						var shipmentSequenceNumber=responseText.data;
						$('#shipmentSequenceNumber').val(shipmentSequenceNumber);
						$('#shipmentCorrectionNumber').attr('disabled', false);
						$.ajax({
							type : "POST",
							url : _context +"/shipment/header/shipmentCorrectionNumberList",
							data : {
								shipmentNumber : $("#shipmentNumber").val(),
								shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
							},
							success : function(responseText) {
								var list= responseText.data.shipmentCorrectionNumberList;
								$('#shipmentCorrectionNumber option').remove();								
								$.each(list, function(index,codeDescription) {
									$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								});								
								document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
								//$('#anyChangesDone').val("Y");
							}
						});
					}			
				});
		}
	});

	
	//code for shipment sequence no predictive search
	 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354';
	 $('#shipmentSequenceNumber').gatesAutocomplete({
			source: url1,
			extraParams:
			{
				parentSearch:function() 
				{ 
					return $("#shipmentNumber").val(); 
				}
			},
			//minLength: 7,
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipmentSequenceNumber').val(data.sequenceNo);
				$('#shipmentCorrectionNumber').attr('disabled', false);
				//alert($("#shipmentSequenceNumber").val());
				$.ajax({
					type : "POST",
					url : _context +"/shipment/header/shipmentCorrectionNumberList",
					data : {
						shipmentNumber : $("#shipmentNumber").val(),
						shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
					},
					success : function(responseText) {
						//alert("I am correction success");
						var list= responseText.data.shipmentCorrectionNumberList;
						$('#shipmentCorrectionNumber option').remove();		
						var shipmentCorrectionNumberOption='';
						$.each(list, function(index,codeDescription) {
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";									
							
						});								
						//document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
						$('#shipmentCorrectionNumber').val(shipmentCorrectionNumberOption);
						//$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
					}
				});
			}
		});
	
	
	
	
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentSequenceNumber').attr('disabled', true);
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});
	var isvalid=setCorrectionNumber();
	/*if (!isvalid){
		return false;
	}*/
	
	
	var colNamesForUsers = ['Id','','Form Type','Source', '#', 'Loc','Hold', 'Mail-SVC','Last Upd User','Date', '', ''];
	var colModelForUsersSupp = [
	    			   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
	    			   		{name:'printOverrideSourceCode', index:'printOverrideSourceCode', hidden:true},
	    			   		{name: 'formTypeCode', index: 'formTypeCode', width:300, editable: true, edittype: "select",
	    						   editoptions: {dataUrl:_context+'/shipmentPrntOptnsOverride/loadBPSupplementFormType',
	    								dataEvents: [
	    						                      {  type: 'change',
	    						                         fn: function(e) {
	    						                        	 var rowId = $(e.target).closest("tr.jqgrow").attr("id");
	    						                        	 var formType = this.value;
	    						                        	 $('select#cityCode').children().remove().end();
	    						                        	 $('select#cityCode').append($("<option/>", {
	    						             					value : 'default',
	    						             					text : "Please select"
	    						             				}));
	    						                        	 if(typeof rowId=='undefined' && formType != null && formType != undefined && formType != "undefined"){						                        		 
	    									                    $.ajax({
	    									                  	type: "GET",
	    									                  	url: _context +"/shipmentPrntOptnsOverride/loadPrintLocation",
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
	    						                        	 } else if (typeof rowId!='undefined'){
	    						                        		 var prntRowId = rowId;
	    						                     			var defaultOption = "";
	    						                     			if(prntRowId != null && prntRowId != undefined && prntRowId != "undefined"){
	    						                     		    // formType= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(4)').attr('title');
	    						                     		     defaultOption= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(7)').attr('title');
	    						                     			}
	    						                     			 $('select#'+prntRowId+'_cityCode').children().remove().end();
	    						                     				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
	    						                     					value : 'default',
	    						                     					text : "Please select"
	    						                     				}));
	    						                     		 $.ajax({
	    						                     			   type: "GET",
	    						                     			   url: _context +"/shipmentPrntOptnsOverride/loadPrintLocation",
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
	    						                   ]
	    			   		},
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
	    			   		{name:'shipmentSource', index:'shipmentSource', width:70, editable:false},
	    			   		{name:'numberOfCopies', index:'numberOfCopies', width:60, editable:true, editoptions: {maxlength: 3}, 
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
	    			   		{name: 'cityCode', index: 'cityCode', width:80, editable: true,editoptions: {maxlength: 5}, edittype: "select", 
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
	    			   		{name: 'isHold', index: 'isHold', width:50, editable: true, 
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
	    			   		{name: 'mailServiceCode', index: 'mailServiceCode', width:90, 
	    			   						   editable: true, 
	    			   						   edittype: "select", 
	    			   						   editoptions: {dataUrl:_context+'/shipmentPrntOptnsOverride/loadBPOverrideMailSVCType'},
	    			   						   editrules:{
	    							   			   required:false}
	    			   		},
	    			   		{name: 'lastUpdateUser', index: 'lastUpdateUser', width:100, editable: false},
	    			   		{name: 'lastUpdateDate', index: 'lastUpdateDate', width:100, editable: false},
	    			   		{name:'dataUpdated', index:'dataUpdated', hidden :true},
	    			   		{name:'actions', index:'actions', width:60, align:"center", formatter:'actions', formatoptions:{
	    			   			keys:true,
	    			   			//D026673: 	BILLING: Billing Document Distribution - OVERRIDE DEFAULT - FORM TYPE SHOULD BE PROTECTE 
	    			   			onEdit: function(rowId){
	    			   				changedGrid = true;
	    			   				var tableId = $(this).attr('id');
	    			   				$('#'+tableId+' #'+rowId+ ' td:nth-child(4) select').attr('disabled', true);
	    			   			},
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
	var colModelForUsers = [
			   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
			   		{name:'printOverrideSourceCode', index:'printOverrideSourceCode', hidden:true},
			   		{name: 'formTypeCode', index: 'formTypeCode', width:300, editable: true, edittype: "select",
						   editoptions: {dataUrl:_context+'/shipmentPrntOptnsOverride/loadBPOverrideFormType'}
			   		},
			   		{name:'shipmentSource', index:'shipmentSource', width:70, editable:false},
			   		{name:'numberOfCopies', index:'numberOfCopies', width:60, editable:true, editoptions: {maxlength: 3}, 
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
			   		{name: 'cityCode', index: 'cityCode', width:80, editable: true,editoptions: {maxlength: 5}, edittype: "select", 
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
			   		{name: 'isHold', index: 'isHold', width:50, editable: true, 
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
			   		{name: 'mailServiceCode', index: 'mailServiceCode', width:90, 
			   						   editable: true, 
			   						   edittype: "select", 
			   						   editoptions: {dataUrl:_context+'/shipmentPrntOptnsOverride/loadBPOverrideMailSVCType'},
			   						   editrules:{
							   			   required:false}
			   		},
			   		{name: 'lastUpdateUser', index: 'lastUpdateUser', width:100, editable: false},
			   		{name: 'lastUpdateDate', index: 'lastUpdateDate', width:100, editable: false},
			   		{name:'dataUpdated', index:'dataUpdated', hidden :true},
			   		{name:'actions', index:'actions', width:60, align:"center", formatter:'actions', formatoptions:{
			   			keys:true,
			   			//D026673: 	BILLING: Billing Document Distribution - OVERRIDE DEFAULT - FORM TYPE SHOULD BE PROTECTE 
			   			onEdit: function(rowId){
			   				changedGrid = true;
			   				var tableId = $(this).attr('id');
			   				$('#'+tableId+' #'+rowId+ ' td:nth-child(4) select').attr('disabled', true);
			   			},
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
	
	/* permisssion Shipment  security*/
	hideUpdate=isprintoverrideUpdate==false?true:false;
	hideSupplimentAdd=isprintoverridesupplAdd==false?true:false;
	hideSupplimentUpdate=isprintoverridesupplUpdate==false?true:false;
	hideSupplimentDelete=isprintoverridesupplDelete==false?true:false;
	
	enforceSecurityTitle(isprintoverrideDisplayOnly);
	enforceSecurityDivAndButtons ("mainDiv",isprintoverrideDisplayOnly);
	enforceSecurityDivAndButtons ("headerDiv",isprintoverrideDisplayOnly);
	enforceSecurityDivAndButtons ("bpoCancel",isprintoverrideDisplayOnly);
	enforceSecurityDivAndButtons ("bpoSave",isprintoverrideUpdate);
	
	createGrid(
			"bpOverrideDefaultGrid", 
			"bpOverrideDefaultPagerGrid", 
			_context+'/shipmentPrntOptnsOverride/loadBPODefaultGrid', 
			'', _context+'/shipmentPrntOptnsOverride/editBPODefaultGrid', 
			_context+'/shipmentPrntOptnsOverride/removeBPOGrid', '',colNamesForUsers,colModelForUsers,"Override Default",
		    "auto",12,[12],false,false,
			false,false, jsonReaderBookingPrint,  hideUpdate, hideUpdate, 
			true, true, true, true,
			null,null,customloadOverride,false,true);
	
	
	createGrid(
			"bpOverrideSupplementGrid", 
			"bpOverrideSupplementPagerGrid", 
			_context+'/shipmentPrntOptnsOverride/loadBPOSupplementGrid', 
			_context+'/shipmentPrntOptnsOverride/addBPOSupplementGrid',
			_context+'/shipmentPrntOptnsOverride/editBPOSupplementGrid', 
			_context+'/shipmentPrntOptnsOverride/removeBPSupplementGrid', '',colNamesForUsers,colModelForUsersSupp,"Supplement Default",
			150, 12, [12, 24, 36], false, false,
			false, hideSupplimentAdd, jsonReaderBookingPrint, hideSupplimentUpdate, hideSupplimentDelete, 
			true, true, true, true,
			null, null, customloadSupplement, false, true);
	enableDisablePrintSaveButton();
	
	jQuery("#bpOverrideDefaultGrid").jqGrid('setGridParam',{
		onSelectRow:function(rowid, status){		
			var formType= "any";
			var prntRowId = jQuery("#bpOverrideDefaultGrid").jqGrid('getGridParam','selrow');
			var defaultOption = "";
			if(prntRowId != null && prntRowId != undefined && prntRowId != "undefined"){
		     formType= $('#bpOverrideDefaultGrid #'+prntRowId+' td:nth-child(4)').attr('title');
		     defaultOption= $('#bpOverrideDefaultGrid #'+prntRowId+' td:nth-child(7)').attr('title');
			}
			 $('select#'+prntRowId+'_cityCode').children().remove().end();
				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
					value : 'default',
					text : "Please select"
				}));
		 $.ajax({
			   type: "GET",
			   url: _context +"/shipmentPrntOptnsOverride/loadPrintLocation",
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
		     formType= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(4)').attr('title');
		     defaultOption= $('#bpOverrideSupplementGrid #'+prntRowId+' td:nth-child(7)').attr('title');
			}
			 $('select#'+prntRowId+'_cityCode').children().remove().end();
				$('select#'+prntRowId+'_cityCode').append($("<option/>", {
					value : 'default',
					text : "Please select"
				}));
		 $.ajax({
			   type: "GET",
			   url: _context +"/shipmentPrntOptnsOverride/loadPrintLocation",
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
});

function getParamByName( name )
{
 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
 var regexS = "[\\?&]"+name+"=([^&#]*)";
 var regex = new RegExp( regexS );
 var results = regex.exec( window.location.href );
 if( results == null )
  return "";
else
 return results[1];
}


function setCorrectionNumber(){
	var corrNum = getParamByName( 'shipmentCorrectionNumber' );
	
	$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(corrNum, corrNum);
	}


function loadDefaultGrid() {
	$("#bpOverrideDefaultGrid").trigger('reloadGrid');
}

function loadSupplementGrid() {
	$("#bpOverrideSupplementGrid").trigger('reloadGrid');
}


var customloadOverride = function(){
	$('#gview_bpOverrideDefaultGrid div table thead tr#tr_seqNo').hide();
	
	$('table[aria-labelledby="gbox_bpOverrideDefaultGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_bpOverrideDefaultGrid"] thead tr[id="FormError"]').hide();
	currentRowId = '';
	
	manageInlineDeleteVisibility('bpOverrideDefaultGrid');
	manageInlineEditVisibilityWithStatus('bpOverrideDefaultGrid');
	//for 22735
	hideActionButtonsDefaultGrid();
};

var customloadSupplement = function(){ 
	var loadFirst = $('#loadFirst').val();
	
	if(loadFirst == 'true'){
		//$('#FormError').remove();
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
	hideSuppGrid();
	//$('#FormError').remove();
};

function enableDisablePrintSaveButton(){
	var status = $('#shipmentStatusHeader').text();
	if (status == 'ISSUED' || status == 'CORRECTED' || isprintoverrideUpdate==false) {
		$('#bpoSave').attr('disabled', true);
	}else{
		$('#bpoSave').attr('disabled', false);
	}
}

// validate billing exists.
function validateBillingExists(gridId){
		$.ajax({
				url: _context +"/shipmentPrntOptnsOverride/validateBilling",
				type:'POST',
				success: function(responseText){
					if (responseText.messages.info.length > 0) {
						hideUpdateBKPO(gridId);
						showResponseMessages1('msgDivBkpo',responseText);
						$('#msgDivBkpo').show();
					}
					
				}
			});
		
	};
	
	function validateAROLExists(gridId){
		$.ajax({
				url: _context +"/shipmentPrntOptnsOverride/validateAROL",
				type:'POST',
				success: function(responseText){
					
					if (responseText.messages.info.length > 0) {
						hideUpdateBKPO(gridId);
						showResponseMessages1('msgDivBkpo',responseText);
						$('#msgDivBkpo').show();
					}
					
				}
			});
		
	};
	
	function displayShipment() {
		$('#shipmentSequenceNumber').removeAttr("disabled");
		$('#shipmentCorrectionNumber').removeAttr("disabled");
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		/*if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			shipment_sequence_number="000";
		}
		if(shipment_correction_number == ""	|| shipment_correction_number == null){
			shipment_correction_number="000";
		}*/
		//alert("Test1::"+_context);
		
		/** Populating Shipment sequence number from database*/
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			$.ajax({
				async: false,
				type : "POST",
				url : _context + "/shipment/defaultShipmentSequenceNumber",
				data : {				
					shipment_number :shipment_number,
				},
				success : function(responseText) {
					var shipmentSequenceNumber=responseText.data;
					shipment_sequence_number=shipmentSequenceNumber;
				}			
			});
		}
		
		$("#shipmentSequenceNumber").val(shipment_sequence_number);
		
		/** Populating Shipment Correction Number number Hard coded*/
		
		if(shipment_correction_number == ""	|| shipment_correction_number == null)
		{
		$.ajax({
			type : "POST",
			url : _context +"/shipment/header/shipmentCorrectionNumberList",
			data : {
				shipmentNumber : shipment_number,
				shipmentSequenceNumber : shipment_sequence_number,
			},
			success : function(responseText) {
				var list= responseText.data.shipmentCorrectionNumberList;
				
				//alert(list);
				$('#shipmentCorrectionNumber option').remove();		
				$.each(list, function(index,codeDescription) {
					$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				});								
				document.getElementById("shipmentCorrectionNumber").selectedIndex=0;
				//$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());
				//$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
				
			}
			});
		
		
		}
		if($('#shipmentCorrectionNumberValue').val()!="" && $('#shipmentCorrectionNumberValue').val()!=null)
			$('#shipmentCorrectionNumber').val($('#shipmentCorrectionNumberValue').val());
		shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
				
				$.ajax({
					type : "POST",
					url : _context + "/shipmentPrntOptnsOverride/populateShipment",
					data : {
						shipment_number :shipment_number,
						shipment_sequence_number :shipment_sequence_number,
						shipment_correction_number :shipment_correction_number,
					},
					success : function(responseText) {
						//alert("Test2");
						// Clear fields of Shipment form and reset the defaults
						var shipmentId=null;
						if(null!=responseText.data)
						shipmentId = responseText.data.shipmentId;
						if (shipmentId == null || shipmentId == undefined
								|| shipmentId == "") {
							//alert("Test3");
							//showNonExistBillMessage();
							//return;
		                    // showLoadingMessage();
							//clearShipmentForm();
							if (responseText.messages.error.length == 0) {
								//alert("Success :No error");
								clearPrintHeader(responseText); 
								createSuppGrid();
								//D026361
								openHoldsUnreleasedDialog('Override');
								$("#bpOverrideDefaultGrid").trigger('reloadGrid');
								
								$("#bpOverrideSupplementGrid").trigger('reloadGrid');
								
							}else{
								showResponseMessages1("msgDivBkpo", responseText); 
								$('#msgDivBkpo').show();
								clearPrintHeader(responseText); 
								$("#bpOverrideDefaultGrid").jqGrid("clearGridData", true);
								$("#bpOverrideSupplementGrid").jqGrid("clearGridData", true);
								//showNonExistBillMessage();
								
							}
						}
						//added against 18175 to lock screen
						$.unblockUI();
						
					},
					error : function(responseText) {
						//alert("Test4");
						//showNonExistBillMessage();
						//added against 18175 to lock screen
						$.unblockUI();						
					}
				});
			}
		
	

	function clearPrintHeader(responseText) {
		if(null!=responseText.data){
		//alert("responseText.data.vvdHeader:::"+responseText.data.vvdHeader);
		//alert("responseText.data.vvdHeader:::"+responseText.data.routingHeader);
		//	alert(responseText.data.shipmentSequenceNumber);
		//document.getElementById("shipmentSequenceNumber").value=responseText.data.shipmentSequenceNumber;
		document.getElementById("vvdHeader").innerText =responseText.data.vvdHeader;
		//
		document.getElementById("shipmentStatusHeader").innerText =responseText.data.shipmentStatusHeader;
		document.getElementById("customerGroupHeader").innerText =responseText.data.customerGroupHeader;
		document.getElementById("tradeCodeValueHeader").innerText =responseText.data.tradeCodeValueHeader;
		document.getElementById("ldSVCHeader").innerText =responseText.data.ldSVCHeader;
		document.getElementById("shipperHeader").innerText =responseText.data.shipperHeader;
		document.getElementById("consigneeHeader").innerText =responseText.data.consigneeHeader;
		document.getElementById("debtorHeader").innerText =responseText.data.debtorValueHeader;
		document.getElementById("printRoutingHeader").innerText =responseText.data.routingHeader;
		document.getElementById("memoBill").innerText = responseText.data.memoBill?'Yes':'No';
		if(responseText.data.shipmentStatusHeader=='CORRECTED' || responseText.data.shipmentStatusHeader=='ISSUED'){
			$('#bpoSave').attr('disabled', true);
		}else{
			$('#bpoSave').attr('disabled', false);
		}
		}else{
			document.getElementById("vvdHeader").innerText ="";
			document.getElementById("shipmentStatusHeader").innerText ="";
			document.getElementById("customerGroupHeader").innerText ="";
			document.getElementById("tradeCodeValueHeader").innerText ="";
			document.getElementById("ldSVCHeader").innerText ="";
			document.getElementById("shipperHeader").innerText ="";
			document.getElementById("consigneeHeader").innerText ="";
			document.getElementById("debtorHeader").innerText ="";
			document.getElementById("printRoutingHeader").innerText ="";
			$('#bpoSave').attr('disabled', true);
		}
		//document.getElementById("printRoutingHeader").innerText =responseText.data.routingHeader;
		/*$('#freightReceivedDate').val("");
		document.getElementById("template").innerText ="";
		document.getElementById("statusCode").innerText ="";
		$('#customerGroupId option').remove();	
		document.getElementById("billType").selectedIndex=0;*/
	}
	
	// validate billing exists.
	function validateTradeCCPCExists(gridId){
			$.ajax({
					url: _context +"/shipmentPrntOptnsOverride/validateTradeCCPC",
					type:'POST',
					success: function(responseText){
						if (responseText.messages.error.length > 0) {
							hideUpdateBKPO('bpOverrideSupplementGrid');
							showResponseMessages1('msgDivBkpo',responseText);
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
		}
	}
	
	function manageInlineDeleteVisibility(gridId) {
		var colName ='shipmentSource';
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		
		for (var loopId = 0; loopId < dataIDs.length ; loopId++) {
			var rowId =	dataIDs[loopId];
			var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
			var newColValue = $('#' + gridId).jqGrid('getCell', rowId, 'printOverrideSourceCode');
			if(newColValue!="O" && newColValue!="o")
			{
				if(newColValue ==null || newColValue=="" || newColValue=="S" || newColValue=="s")
				{
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
							$(tdElement).css("background-color", "#FC4E4E");
						}
					}
					$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').show();
				}
				else if(newColValue=="T" || newColValue=="t")
				{
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
							$(tdElement).html('Template');
							$(tdElement).css("background-color", "#FC4E4E");
						}
					}
					$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').show();
				}
				else if(newColValue=="B" || newColValue=="b")
				{
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
							$(tdElement).css("background-color", "#FC4E4E");
							$(tdElement).html('Booking');
						}
					}
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').show();
				}
			}
			else{
			if(colValue == 'Bill' && isprintoverridesupplDelete){ // security
				var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
				for(var i = 0; i < columns.length ; i++){
					var tdElement = columns[i];
					if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
						$(tdElement).css("background-color", "#FC4E4E");
					}
				}
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').show();
			} else{
				if(colValue == 'AROL' || colValue == 'Shipper'|| colValue == 'Debtor' ||colValue == 'Consignee' 
					|| colValue == 'Shipper-Xref' || colValue == 'Consignee-Xref'){
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
							$(tdElement).css("background-color", "#DBE23C");
						}
					}
				}
				if(colValue == 'Trade' ){
					//$('#'+gridId+' tbody tr#'+rowId).css("background-color", "GREEN");
					var columns = $('#'+gridId+' tbody tr#'+rowId+' td');
					for(var i = 0; i < columns.length ; i++){
						var tdElement = columns[i];
						if($(tdElement).attr("aria-describedby")==gridId+'_shipmentSource'){
							$(tdElement).css("background-color", "#409C40");
						}
					}
				}
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-del').hide();
			}
		}
	}
}
	
	function manageInlineEditVisibilityWithStatus(gridId) {
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		if(document.getElementById("shipmentStatusHeader").innerText=='CORRECTED' || document.getElementById("shipmentStatusHeader").innerText=='ISSUED'){
			for (var loopId = 0; loopId < dataIDs.length ; loopId++) {
				var rowId =	dataIDs[loopId];
				//var colValue = $('#' + gridId).jqGrid('getCell', rowId, colName);
				$('#'+gridId+' tbody tr#'+rowId+' td div.ui-inline-edit').hide();
				
			}
		}
		if(document.getElementById("tradeCodeValueHeader").innerText=='A-ALASKA' || document.getElementById("tradeCodeValueHeader").innerText=='ALASKA'
			|| document.getElementById("tradeCodeValueHeader").innerText=='A - ALASKA'){
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

	// BKPO save 
	function saveBKPO(){
		changedGrid=false;
		if($("#shipmentNumber").val() !='' && $("#shipmentSequenceNumber").val() !=''){
			var urlStr = _context +"/shipmentPrntOptnsOverride/saveBPO";
			$('#msgDivBkpo').hide();
			 $.ajax({
				type: "POST",
				url: urlStr,
			
				success: function(responseText){
					showResponseMessages1('msgDivBkpo',responseText);
					$('#msgDivBkpo').show();
					$("#bpOverrideDefaultGrid").trigger('reloadGrid');
					$("#bpOverrideSupplementGrid").trigger('reloadGrid');
				}
			}); 
		}else{
			return false;
		}
		

	};
	
	//Exit 
	function exitBKPO(id) {
		var colValueDefaultGrid = dataUpdated('bpOverrideDefaultGrid');
		var colValueSupplementGrid = dataUpdated('bpOverrideSupplementGrid');
		
		if (($(document).getUrlParam("navigationFrom")) == 'BK'){
			if(colValueDefaultGrid == 'true' || colValueSupplementGrid == 'true' || changedGrid == true) {
				var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
				if (isConfirm) {
					//window.close();
					document.location.href = _context +"/booking/showForm?checkLastBookingLoaded=true&userFromMenu=Y&bookingNumber=#"+$('#shipmentNumber').val();
				}
			} else {
				//window.close();
				document.location.href = _context +"/booking/showForm?checkLastBookingLoaded=true&userFromMenu=Y&bookingNumber=#"+$('#shipmentNumber').val();
			}
		}
		else{
				if(colValueDefaultGrid == 'true' || colValueSupplementGrid == 'true'|| changedGrid == true) {
					var isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
					if (isConfirm) {
						//window.close();
						document.location.href=_context+"/shipment/showForm";
					}
				} else {
					//window.close();
					document.location.href=_context+"/shipment/showForm";
				}
		}
	};
	
	
	function openCustPaperPrintCharSearch() {
		var trade = $("#tradeCodeValueHeader").text().split("-")[1];
		
		var actionUrl = _context + "/cas/custPaperPrintCharSearch.do?trade="+trade;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		var myWindow = window.open(actionUrl, 'CustomerPaperPrintCharSearch', windowStyle);
		
	}
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
	
	
	function removeErrorPointers() {
		$('#shipmentPrintOverrideForm').validationEngine('hideAll');
	}
function createSuppGrid(){
	$('table[aria-labelledby="gbox_bpOverrideSupplementGrid"] thead tr[id="FormError"]').remove();
	$('#gview_bpOverrideSupplementGrid div table thead tr#tr_seqNo').remove();
	
}
function showNonExistBillMessage() {
	$('#msgDiv').html("<div class=\"message_error\">Shipment not found.</div>");
	$('#msgDiv').show();
}	

function hideSuppGrid(){
	if(document.getElementById("shipmentStatusHeader").innerText=='CORRECTED' || 
			document.getElementById("shipmentStatusHeader").innerText=='ISSUED'){
		$("div.ui-pg-div.ui-inline-del","#gbox_bpOverrideSupplementGrid").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-edit","#gbox_bpOverrideSupplementGrid").css("visibility", 'hidden');
		$("div[id=gbox_bpOverrideSupplementGrid] #sData").css("visibility", 'hidden');
		$('#gview_bpOverrideSupplementGrid input').css("visibility", 'hidden');
		$('#gview_bpOverrideSupplementGrid select').css("visibility", 'hidden');
	}
	if(document.getElementById("tradeCodeValueHeader").innerText=='A-ALASKA' || document.getElementById("tradeCodeValueHeader").innerText=='ALASKA'
		|| document.getElementById("tradeCodeValueHeader").innerText=='A - ALASKA'){
	for(i=0;i<$('select#formTypeCode').children().length;i++){
		if($('select#formTypeCode').children()[i] != undefined && $('select#formTypeCode').children()[i] != null && $('select#formTypeCode').children()[i].value != 'Please Select'
				&& $('select#formTypeCode').children()[i].value != 'Freight Bill Prepaid RATED' && $('select#formTypeCode').children()[i].value != 'Freight Bill Collect RATED'){
			$('select#formTypeCode').children()[i].remove();
		}
	}	
	}
}
//for 22735
function hideActionButtonsDefaultGrid(){
	if(document.getElementById("shipmentStatusHeader").innerText=='CORRECTED' || 
			document.getElementById("shipmentStatusHeader").innerText=='ISSUED'){
		$("div.ui-pg-div.ui-inline-edit","#gbox_bpOverrideDefaultGrid").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-del","#gbox_bpOverrideDefaultGrid").css("visibility", 'hidden');

	}
}
				
			
			

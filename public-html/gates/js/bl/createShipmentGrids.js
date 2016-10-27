function createShipmentPartieGrid(){
	//$('#maintainShipmentParties').block({ message: "Loading Shipment Party ..." });
	// party grid config
	var colNames = [ 'Id','Type Code', '','Type', 'One Time Customer',
			'Organization Name','C/O Org Name', 'Address','Province', 'Country', 'Override', 'Cash',
			'', '', '' ];
	var colModel = [ {
		name : 'partySeqNo', 
		index : 'partySeqNo',
		hidden : true
	}, {
		name : 'partyTypeCode',
		index : 'partyTypeCode',
		hidden : true
	}, {
		name : 'totalDeliveryPartyCount',
		index : 'totalDeliveryPartyCount',
		hidden : true
	},{
		name : 'partyTypeDescription',
		index : 'partyTypeDescription',
		width : 150,
		formatter : ('showlink'),
		formatoptions : {
			baseLinkUrl : "javascript:",
			showAction : "showEditPartyDialog('",
			addParam : "');"
		}
	}, {
		name : 'isOneTimeCustomer',
		index : 'isOneTimeCustomer',
		width : 70,
		formatter : 'oneTimeViewFormatter'
	}, {
		name : 'organizationName',
		index : 'organizationName',
		width : 250
	}, {
		name : 'careOf',
		index : 'careOf',
		width : 120
	}, {
		name : 'address',
		index : 'address',
		width : 250
	},{
		name : 'provinceName',
		index : 'provinceName',
		width : 50	
	},{
		name : 'countryName',
		index : 'countryName',
		width : 50	
	}, {
		name : 'isCpPartyOverridden',
		index : 'isCpPartyOverridden',
		width : 70,
		formatter : 'overrideViewFormatter' // Changed for Defect D018129
	}, {
		name : 'orgCreditStatus',
		index : 'orgCreditStatus',
		width : 70
	}, {
		name : 'partyAddressCustomized',
		index : 'partyAddressCustomized',
		hidden : true
	}, {
		name : 'addressRoleId',
		index : 'addressRoleId',
		hidden : true
	}, {
		name : 'actions',
		index : 'actions',
		width : 70,
		hidden : true,
		formatter : 'actions',
		formatoptions : {
			keys : true,
			editbutton : false,
			delbutton : true
			/*delOptions : {
				delData : {
					debtor : defaultDebtor
				}
			}*/
		}
	} ];
	
	jQuery.extend($.fn.fmatter,
			{
				creditViewFormatter : function(cellvalue,
						options, rowdata) {
					if (cellvalue == 'Y'
							|| cellvalue == 'true' || cellvalue == true)
						return "Yes";
					else if (rowdata.partyTypeDescription!='Also Notify Party'
						&& rowdata.partyTypeDescription!='To Order B/L Party' &&
							(cellvalue == 'N'
							|| cellvalue == 'false' || cellvalue == false))
						return "No";
					else
						return "";
				},
				//Added start for defect --D018129
				overrideViewFormatter : function(cellvalue,
						options, rowdata) {
					if (cellvalue == true
							|| cellvalue == 'true'|| cellvalue == 'Y')
						return "Yes";
					/*else if (rowdata.partyTypeDescription!='Also Notify Party'
						&& rowdata.partyTypeDescription!='To Order B/L Party' &&
							(cellvalue == false
							|| cellvalue == 'false' || cellvalue == 'N'))
						return "No";*/
					else
						return "";
				},
				//Added end for defect --D018129
				oneTimeViewFormatter : function(cellvalue,
						options, rowdata) {
					if (cellvalue == 'Y'
							|| cellvalue == 'true' || cellvalue == true)
						return "Yes";
					else if (cellvalue == 'N'
							|| cellvalue == 'false' || cellvalue == false)
						return "No";
					else
						return "";
				},
				formatLink : function(cellvalue,
						options, rowdata) {
						return cellvalue;
				}
			});

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "partySeqNo"
	};

	var partiesDelData = {
		shipperArolId : function() { return $('input[name="shipper\\.addressRoleId"]').val(); },
		consigneeArolId : function() { return $('input[name="consignee\\.addressRoleId"]').val(); },
		tradecode : function() { return $('#tradeCode').val(); }
	};

	createGrid("gridIdForParties", // grid id for party
	"pagerIdForParties", // page id for party
	_context+'/shipment/party/load', // geturl
	'', // addurl
	'', // edit url
	'',
	_context+'/shipment/party/delete',// delete selected URL
	colNames, colModel, "Parties",// caption
	83,// height
	3,// row num
	[ 3, 6, 9 ],// row list
	true,// multiselect
	true,// multidelete
	false,// load once
	true, // read only grid
	jsonReader, // json reader
	true, // hide edit
	true, // hide delete
	true, // autowidth
	true, // rownumbers
	true, // hide custom add row
	false,// hide pager row
	null,// custom edit method
	partiesGridComplete,// custom grid complete
	null,// custom load complete
	false,// default hidden
	true,// row Color Based On status
	false,// celledit
	partiesAfterSubmit,
	false, // isSearch
	partiesDelData//delExtraParam
	);
	
	
	$("#gridIdForParties").jqGrid('setGridParam',{
		delOptions: {url: _context+'/shipment/party/deleteParty', caption: "Confirmation", msg: "Do you want to delete record(s)?",/* delData : {
			debtor : $('#prepaidCollectCode :selected').val()
		},*/
			afterSubmit:function(response, postdata)
			{
				var result = eval('(' + response.responseText + ')');
				if(result.success==false)
				{
					var messageContent = '';
					var len = result.messages.length;
					for (var i=0; i<len; i++) {
						messageContent += '<div class="message_error">' + result.messages[i] + '</div>';
					}
					$('#msgDiv').html(messageContent);
					window.scrollTo(0, 0);
				}
				return [true,""];
			}
		}
	});
	//$('#maintainShipmentParties').unblock();
}
var partiesAfterSubmit = function(result)
{
	//if(result.success)
	//	isBookingChanged = "Y";
};
function createShipmentReferenceNumberGrid(){
//	$('#maintainShipmentRefNumberMarks').block({ message: "Loading Shipment Reference ..." });

	var isEdit=false;
	var colNamesReferenceNumber = [ 'Id', 'Process Level',
			'Copy Bill To Header', 'SHAC', 'Type',
			'Reference Number', 'Actions' ];
	var colModelReferenceNumber = [
			{
				name : 'seqNo',
				index : 'seqNo',
				width : 55,
				hidden : true
			},
			{
				name : 'processLevelCode',
				index : 'processLevelCode',
				width : 55,
				hidden : true
			},
			{
				name : 'isCopyBillToHeader',
				index : 'isCopyBillToHeader',
				width : 55,
				hidden : true
			},
			{
				name : 'shipmentAddnlChrsticIdDs',
				index : 'shipmentAddnlChrsticIdDs',
				width : 55,
				hidden : true
			},
			{
				name : 'typeCode',
				index : 'typeCode',
				width : 200,
				editable : true,
				editrules : {
					required : true,
					custom : true,
					custom_func : function(value, colname) {
						if (value == '') {
							return [ false,
									"Type cannot be blank." ];
						} else {
							return [ true, "" ];
						}
					}
				},
				formatter : 'select',
				edittype : "select",
				editoptions : {
					value : "S:Shipper;C:Consignee;B:Both S&C;F:Forwarder;I:ITN;E:ITN-Exempt;T:Military TCN;A:Alaska/Hawaii Booking;O: Original Booking"
				}
			},
			{
				name : 'referenceNumberNotation',
				index : 'referenceNumberNotation',
				width : 200,
				editable : true,
				editrules : {
					maxlength : 20,
					custom : true,
					custom_func : function(value, colname) {
						var result = true;
						if(! isEdit){
							if (value.indexOf(',') != -1) {
								var patt = value.split(',');
								for ( var i = 0; i < patt.length; i++) {
									if ($.trim(patt[i]) == '') {
										result = false;
										break;
									}
								}
							}
						}
						if (null == value || $.trim(value) == '') {
							return [ false,
									"Reference Number cannot be spaces when Reference Type is present." ];
						}
						if (!result) {
							return [ false,
									"Reference Number cannot be spaces when Reference Type is present." ];
						} else {
							return [ true, "" ];
						}
					}
				},
				editoptions : {
					maxlength : 20
				},
				//formatter : "textarea",
				//edittype : "textarea",								
				//editoptions : {multiple: true}
				
			}, {
				name : 'actions',
				index : 'actions',
				width : 100,
				align : "center",
				editable : false,
				search : false,
				sortable : false,
				formatter : 'actions',
				formatoptions : {
					keys : true,
					onEdit: function(rowId){
						isEdit=true;
						$("div.ui-pg-div.ui-inline-del","#gbox_referenceNumberGrid").css("visibility", 'hidden');
					}
				}
			} ];

	var jsonReaderReference = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "seqNo"
	};

	var hideAdd=isReferenceNumberMarksAdd==true?false:true;
	var hideUpdate=isReferenceNumberMarksUpdate==true?false:true;
	var hideDelete=isReferenceNumberMarksDelete==true?false:true;		
	//hidedelete and hideupdate added for D028800
	createGrid("referenceNumberGrid", // grid id for user
	"pagerGrid", // page id for user
	_context+'/shipment/referenceNumber/load',
			_context+'/shipment/referenceNumber/add',
			_context+'/shipment/referenceNumber/update',
			_context+'/shipment/referenceNumber/delete',
			_context+'/shipment/referenceNumber/deleteSelected',
			colNamesReferenceNumber, colModelReferenceNumber,
			"Reference Number(s)", 275, 10, [ 10, 20, 30], !hideDelete,	//height changes as per defect 21876
			!hideDelete, false, // load once hideEdit/Del
			false, jsonReaderReference, hideUpdate, true, true,
			true, true, false, false, false,
			referenceGridLoadComplete, false, true);
	$('#del_referenceNumberGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
	$('#sData','#gbox_referenceNumberGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
	
	//$('#maintainShipmentRefNumberMarks').unblock();
}

function createShipmentRoutingGrid(){
//	$('#maintainShipmentRouting').block({ message: "Loading Shipment Routing ..." });
	//Create VVD Table on main page
	var colNames = [ 'Sequence No', 'Route Sequence No', 'Vessel Voyage Direction', 'Port of Loading', 'Port of Discharge', 'Sail Date', 'Arrival Date','extensionType'];
	
	var colModel = [ {
		name : 'bookingVoyageSeqNo',
		width : 70
	}, {
		name : 'routeSequenceNumber',
		hidden : true
	}, {
		name : 'vesselVoyageDirection',
		width : 170
	}, {
		name : 'loadPortCode',
		width : 130
	}, {
		name : 'dischargePortCode',
		width : 130
	},
	{
		name : 'sailDate',
		width : 100
	}, {
		name : 'arrivalDate',
		width : 100
	}, {
		name: 'extensionType',
		hidden : true
	}];
	

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "bookingVoyageSeqNo"
	};

	createGrid("vvdRoutingGrid", // grid id for party
	"vvdRoutingPager", // page id for party
	_context+'/shipment/routing/loadVVDGrid', // geturl
	'', // addurl
	'', // edit url
	'', //delete url
	'',// delete selected URL
	colNames, colModel, "",// caption
	83,// height
	3,// row num
	[ 3, 6, 9 ],// row list
	false,// multiselect
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
	null,// custom grid complete
	null,// custom load complete
	false,// default hidden
	true);// row Color Based On status
	
//	$('#maintainShipmentRouting').unblock();
	createShipmentCommodityGrid();
}

function createShipmentCommodityGrid(){
	//$('#maintain_commodity_shipment').block({ message: "Loading Shipment Commodity..." });
	if($('#loadDschServiceGroupCode').val()!=null && $('#loadDschServiceGroupCode').val().trim()=="CY"){
		
		createContainerGrid();
		createShipmentMixedCommodityGrid();
	}
  if($('#loadDschServiceGroupCode').val()!=null && $('#loadDschServiceGroupCode').val().trim()=="AU"){
		
		createShipmentCommodityAutoGrid();
	}
	
  if($('#loadDschServiceGroupCode').val()!=null && $('#loadDschServiceGroupCode').val().trim()=="CON"){
	  $('#convGrid').GridUnload();
		createShipmentCommodityConvGrid();
	}
  if($('#loadDschServiceGroupCode').val()!=null && $('#loadDschServiceGroupCode').val().trim()=="LCL"){
	  $('#convGrid').GridUnload();
		createShipmentCommodityLclGrid();
	}
	
 // $('#maintain_commodity_shipment').unblock();
}

function createContainerGrid(){
	//D031125: 	Implement design for KFF Temperature and Dual Temperature Refers for the Alaska trade
	var colNamesForContainer = ['id', 'This','', 'Line', '  +  ','','','W/C', 'Equipment #','','Seal Nbr','Type/Size','','Temp','Scale','Temp2','Overflow','Sub','',''];
	var colModelForContainer = [ {name:'shipmentFreightId', index:'shipmentFreightId', width:5,editable:false, hidden:true, formatter:'integer'},
	                             {name:'isContainerLinked', index:'isContainerLinked', width:42, editable: false },
	                             {name:'shipmentFreightSeqNumber', index:'shipmentFreightSeqNumber',width:35, editable:false, hidden:true, formatter:'integer', width:70},
	                             {name:'firstCommodityLineNumber', index:'firstCommodityLineNumber',width:30, editable:false, hidden:false,  width:70},
	                              {name:'isLinkedMoreCommodity', index:'isLinkedMoreCommodity', width:35, editable:false},
	                              {name:'eqptType', index:'eqptType', width:15, editable: false,hidden:true},
	                              {name:'isEmpty', index:'isEmpty', width:15, editable: false,hidden:true},
	                              {name:'prorateCode', index:'prorateCode', width:35, hidden:false,editable: false},
	                              {name:'equipDesc', index:'equipDesc', width:102, hidden:false,editable: false},
	                               {name:'equipmentId', index:'equipmentId', width:110, hidden:true,editable: false},
	                               {name:'sealNumber', index:'sealNumber', width:85, editable:true,editoptions: {maxlength: 10} },
	                               {name:'eqptDetail', index:'eqptDetail', width:88, editable:false},
	                               {name:'isPreReceivedContainer', index:'isPreReceivedContainer',hidden:true, editable:false},
	                               {name:'temperature', index:'temperature', width:50, editable:true,editrules:{ required:true },
	                            	   editoptions: {maxlength: 5,
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
	           	                			var tradeCode = $('#tradeCode').val();
	           	                			//alert("currentRowId: "+currentRowId);
	           	                			
	           	                		/*	if($.trim($("#"+currentRowId+"eqptType").val())!='R' && $.trim(value)!=''){
	           		            				return [false, colname+": This is valid only for refrigerated equipment."];
	           								}*/
	           	                			var currentRowId = jQuery("#commodityGrid").jqGrid('getGridParam','selrow');
	           	                			var invalidTempMsg = "This is invalid.";
	           	                			
	           	                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
	           	                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
	           	                			//alert("isTempFirstLetterPlusDot: " + isTempFirstLetterPlusDot.test(value));
	           	                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,2})?$/;
	           	                			//alert("regTemp: " + regTemp.test(value));
	           	                			if ( $.trim(value) == "amb"){
												value = "AMB";											
												$("#"+currentRowId+"_temperature").add("AMB");
											}
	           	                			if ( $.trim(value) == "kff"){
												value = "KFF";											
												$("#"+currentRowId+"_temperature").add("KFF");
											}
	           	                			var tempValid = false;
	           	                			var equipType = jQuery("#commodityGrid").getRowData(currentRowId).eqptType.toUpperCase();
	           	                			if((tradeCode == 'A' && $.trim(value) == "KFF") || (equipType == 'R' && $.trim(value) == "AMB")){
	           	                				tempValid = true;
	           	                			}
	           	                			if(!tempValid){
		           	                			if(isTempFirstLetterPlusMinusDot.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(isTempFirstLetterPlusDot.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(!regTemp.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(equipType != 'R' && $.trim(value) != 'KFF' && $.trim(value) != ''){
		           	                				return [false, colname+": This value is not allowed for Non-Reefer container."];
		           	                			}
		           	                			if($.trim($("#"+currentRowId+"eqpType").val())!='' && $.trim($("#"+currentRowId+"eqptType").val()).toUpperCase()=='R' && $("#"+currentRowId+"isEmpty").val()=='F' && $.trim(value)==''){
		           		            				//return [false, colname+": This must be specified for refrigerated equipment."];
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
	                               {name:'temperatureCode', index:'temperatureCode', width:40, editable:true,edittype:'select',editoptions:{value:":;C:C;F:F"},editrules:{ required:true },
	                               editrules:{
	       	                		custom:true,
	       	                		custom_func:function (value, colname,id) {
	       	                			currentRowId= id;
	       	                			var temp = $.trim($("#"+currentRowId+"temperature").val());
	       	                			
	       									return [true,""];
	       								
	       	                		}
	       	                	}
	                               },
	                               {name:'temperatureDual', index:'temperatureDual', width:50, editable:true,editrules:{ required:true },
	                            	   editoptions: {maxlength: 5,
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
	           	                			var tradeCode = $('#tradeCode').val();
	           	                			//alert("currentRowId: "+currentRowId);
	           	                			
	           	                		/*	if($.trim($("#"+currentRowId+"eqptType").val())!='R' && $.trim(value)!=''){
	           		            				return [false, colname+": This is valid only for refrigerated equipment."];
	           								}*/
	           	                			var currentRowId = jQuery("#commodityGrid").jqGrid('getGridParam','selrow');
	           	                			var invalidTempMsg = "This is invalid.";
	           	                			
	           	                			var isTempFirstLetterPlusMinusDot = /^[+-.]$/;
	           	                			var isTempFirstLetterPlusDot = /^[+-](\.)$/;
	           	                			//alert("isTempFirstLetterPlusDot: " + isTempFirstLetterPlusDot.test(value));
	           	                			var regTemp = /^[+-]?[0-9]{0,2}(\.[0-9]{0,2})?$/;
	           	                			//alert("regTemp: " + regTemp.test(value));
	           	                			if ( $.trim(value) == "amb"){
												value = "AMB";											
												$("#"+currentRowId+"_temperatureDual").add("AMB");
											}
	           	                			if ( $.trim(value) == "kff"){
												value = "KFF";											
												$("#"+currentRowId+"_temperatureDual").add("KFF");
											}
	           	                			var tempValid = false;
	           	                			var equipType = jQuery("#commodityGrid").getRowData(currentRowId).eqptType.toUpperCase();
	           	                			if((tradeCode == 'A' && $.trim(value) == "KFF") || (equipType == 'R' && $.trim(value) == "AMB")){
	           	                				tempValid = true;
	           	                			}
	           	                			if(!tempValid){
		           	                			if(isTempFirstLetterPlusMinusDot.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(isTempFirstLetterPlusDot.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(!regTemp.test($.trim(value))){
		           	                				return [false, colname+": "+invalidTempMsg];
		           	                			}
		           	                			if(equipType != 'R' && $.trim(value) != 'KFF' && $.trim(value) != ''){
		           	                				return [false, colname+": This value is not allowed for Non-Reefer container."];
		           	                			}
		           	                			if($.trim($("#"+currentRowId+"eqpType").val())!='' && $.trim($("#"+currentRowId+"eqptType").val()).toUpperCase()=='R' && $("#"+currentRowId+"isEmpty").val()=='F' && $.trim(value)==''){
		           		            				//return [false, colname+": This must be specified for refrigerated equipment."];
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
	                               {name:'overflow', index:'overflow', width:60, editable:true,edittype:'select',editoptions:{value:"Y:Yes;N:No"}, editrules:{ required:true } }, 
	                               {name:'sub', index:'sub', width:50, editable:false },
	                               
	                              {name:'actionLinkUnlink', index:'actionLinkUnlink', width:80, formatter:(isCommodityBLCNLink==true?'showlink': 'formatLinkBLCN'), formatoptions : {
		                   				baseLinkUrl : "javascript:",
		                				showAction: "actionToLinkUnLink('",
		                				addParam: "');" }
		                               },
		                               {name:'edit', index:'edit', width:55, editable:false, formatter:'actions',formatoptions:{
		                            	   onEdit:function(rowid) {
		                            		if(
		                            				jQuery("#commodityGrid").getRowData(rowid).isContainerLinked =="" ||
		                            				jQuery("#commodityGrid").getRowData(rowid).isContainerLinked ==null)
		                            			{ 
		                            			$('#FormError').html("");
		                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            			$("div.ui-pg-div.ui-inline-cancel", "#"+rowid).remove();
		                            			$("div.ui-pg-div.ui-inline-save", "#"+rowid).remove();
		                            			$("#commodityGrid").jqGrid('restoreRow',rowid) ; 
		                            			$('#commodityGrid').trigger('reloadGrid');
		                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            			
		                            			return;
		                            			}
		                            		$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            		saveBillBeforeBillButton = true;
		                            		var equipType = jQuery("#commodityGrid").getRowData(rowid).eqptType;
		                            		var tradeCode = $('#tradeCode').val();
		                            		if((tradeCode != "A" && equipType!="R") || 
		                            				(tradeCode == "A" && equipType != "R" && equipType != "D" && equipType != "I")){
		                            		var grid = $("#commodityGrid");
		                            				var pos=getColumnIndexByName(grid,'temperature');
		                            				var pos2=getColumnIndexByName(grid,'temperatureCode');
		                            				var pos3=getColumnIndexByName(grid,'temperatureDual');
		                            				var allIds = $('#commodityGrid').jqGrid('getDataIDs');
		                            				var cells = $("tbody > tr.jqgrow > td:nth-child("+(pos+1)+")",grid[0]);
		                            				var cells2 = $("tbody > tr.jqgrow > td:nth-child("+(pos2+1)+")",grid[0]);
		                            				var cells3 = $("tbody > tr.jqgrow > td:nth-child("+(pos3+1)+")",grid[0]);
		                            				for (var i = 0; i < allIds.length; i++) {
		                            			        var cell = $(cells[i]);
		                            			        var cell2 = $(cells2[i]);
		                            			        var cell3 = $(cells3[i]);
		                            			        $('input[type="text"]',cell).attr("disabled",true);
		                            			        $('input[type="text"]',cell3).attr("disabled",true);
		                            			       $('select',cell2).attr("disabled",true);
		                            				}
		                            		}
		                            		var equip=jQuery("#commodityGrid").getRowData(rowid).eqptType;
		                            		var emptyval=jQuery("#commodityGrid").getRowData(rowid).isEmpty;
		                            		//D027650 ---changed and enabled seal number for all types--- D034169
		                            		/*if(equip=="F"||equip=="T"||equip=="A"||emptyval=="E"){
		                            			var grid = $("#commodityGrid");
	                            				var pos=getColumnIndexByName(grid,'sealNumber');
	                            				var allIds = $('#commodityGrid').jqGrid('getDataIDs');
	                            				var cells = $("tbody > tr.jqgrow > td:nth-child("+(pos+1)+")",grid[0]);
	                            				for (var i = 0; i < allIds.length; i++) {
	                            			        var cell = $(cells[i]);
	                            			        $('input[type="text"]',cell).attr("disabled",true);
	                            				}
	                            				
		                            		}*/
		                            		
		                            	   },
		                            	 //D027692 start
		                            	   afterSave: function()
											{
		                            		  $('#isAnyGridChanged').val("true");
		                            		  return true;
											}
		                            	 //D027692 end
		                               }
		                               }
	                              
	                              
	                               ];
	// for security
	jQuery.extend($.fn.fmatter,{
		formatLinkBLCN : function(cellvalue,
				options, rowdata) {
				return '';
		}
	});
	
	var jsonReaderContainer = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"shipmentFreightId"
				               };
	
	createGrid("commodityGrid", "pagerCommodityGrid",
			'../shipmentCommodity/loadContainerGrid',
			'', '../shipmentCommodity/updateContainerGrid', 
			'',
			'',
			colNamesForContainer, colModelForContainer, "Containers", 
			"auto", 10, [ 10, 20, 30 ],false, false, false, false,
			jsonReaderContainer,isCommodityBLCNUpdate?false:true,true,false,false,false,false,false,false,containerGridLoad,false,false);
	
	
}

function createShipmentMixedCommodityGrid(){
	currentRowId='';
	
	var colNamesForCommodity = ['id', 'Line', '','Item', ' Net Wt(kg)','Cube(M)','Pieces','Kind','Note','Commodity Descripition',''];
	var colModelForCommodity = [ {name:'shipmentItemId', index:'shipmentItemId', width:5,editable:false, hidden:true, formatter:'integer'},
	                             {name:'unitOfCommodityDisplay', index:'unitOfCommodityDisplay',width:58, editable: false },
	                             {name:'unitOfCommodity', index:'unitOfCommodity',hidden:true ,width:58, editable: false },
	                             {name:'itemNumber', index:'itemNumber',width:65, editable:false, hidden:false, width:70, align:'right', classes:'monotype'},
	                             {name:'netWeight', index:'netWeight', width:75,formatter:'number', editable:false, align:'right',formatoptions: {decimalPlaces: 3, thousandsSeparator: ""}},
	                             {name:'cube', index:'cube', width:75, editable: false,formatter:'integer',hidden:false, align:'right'},
	                             {name:'piece', index:'piece', width:75, editable: false,formatter:'integer',hidden:false,align:'right'},
	                              
	                              {name:'kind', index:'kind', width:90, editable: false},
	                               {name:'note', index:'note', width:70, editable:false },
	                               {name:'commodityDesc', index:'commodityDesc', width:200, editable:false},
	                               {
	   								name : 'actions',
	   								index : 'actions',
	   								width : 100,
	   								align : "center",
	   								editable : true,
	   								search : false,
	   								sortable : false,
	   								formatter : 'actions',
	   								formatoptions : {
	   									keys : true,
	   									onEdit: function(rowId){
	   										
	   										openUpdateComodityOverLay(rowId);
	   									}
	                               
	   								}
	   							}  
	                               ];
	var jsonReaderContainer = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"unitOfCommodity"
				               };
	$('#mixcommodityGrid').gatesGrid({
		caption: "Commodity",
		colNames: colNamesForCommodity,
		colModel: colModelForCommodity,
		jsonReader: jsonReaderContainer,
		pager: '#pagermixCommodityGrid',
		rownumbers :false,
		rowList: [ 10,20,30 ],
		height:"auto",
		footerrow: true,
		userDataOnFooter: false,
		gatesOptions: {
			urls: {
				load: '../shipmentCommodity/loadCommodityGrid',
				del:'../shipmentCommodity/deleteCommodityGrid'	
			},
			controls: {
				navBar: true,
				navBarAdd: false,
				navBarEdit: false,
				navBarDelete: false, //- multiDelete
				
				inlineAdd: isCommodityBLMXAdd, //- hideCustomAddRow
				inlineEdit: isCommodityBLMXUpdate, //- hideEdit
				inlineDelete: isCommodityBLMXDelete //- hideDelete
			},
			loadComplete :loadComplete
		}
	
		
	});
	
	
}

function createShipmentCommodityAutoGrid(){
	
	currentRowId='';
	var colNamesForPov = ['id','','This','Line','Vinsight#','Make','Model', 'Year','Dimensions(LxWxH)','VIN','LSB','Tier','Equip#','Wgt','',''];
	var colModelForPov = [
	                       {name:'shipmentFreightAutoId', index:'shipmentFreightAutoId',editable:false, hidden:true, formatter:'integer'},
	                       {name:'shipmentFreightId', index:'shipmentFreightId',editable:false, hidden:true, formatter:'integer'},
                             {name:'isContainerLinked', index:'isContainerLinked', width:20, editable: false },
	                       {name:'firstCommodityLineNumber', index:'firstCommodityLineNumber',width:20, editable:false, hidden:false, formatter:'integer', width:70},
	                       {name:'receivedUnitId', index:'receivedUnitId', width:80, editable:false},
	                       {name:'vehicalMade', index:'vehicalMade', width:50, editable: false,hidden:false},
	                       {name:'vehicalModel', index:'vehicalModel', width:50, editable: false,hidden:false},
	                       {name:'vehicalYear', index:'vehicalYear', width:30, hidden:false,editable: false},
	                       {name:'receivedUnitDimension', index:'receivedUnitDimension', width:100, hidden:false,editable: false},
	                       {name:'vin', index:'vin', width:80, editable:false },
	                       {name:'autoLSB', index:'autoLSB', width:30, editable:false},
	                       {name:'rateCatCode', index:'rateCatCode', width:35, editable:false },
	                       {name:'equipmentId', index:'equipmentId', width:80, editable:true,editrules:{ required:true },editoptions: {maxlength: 10},
	                            	   editrules:{}
	                               },
	                       {name:'weight', index:'weight', width:35, editable:false},
	                       {name:'edit', index:'edit', width:60, editable:false, formatter:'actions',formatoptions:{
	                            	   onEdit:function(rowid) {
	                            		if(jQuery("#povGrid").getRowData(rowid).action =="LINK")
	                            			{ $("#povGrid").jqGrid('restoreRow',rowid) ; 
	                            			$('#FormError').html("");
	                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
	                            			$("div.ui-pg-div.ui-inline-cancel", "#"+rowid).remove();
	                            			$("div.ui-pg-div.ui-inline-save", "#"+rowid).remove();
	                            			$('#povGrid').trigger('reloadGrid');
	                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
	                            			
	                            			return;
	                            			}
	                            		$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
	                            		 
	                            		  $("div.ui-pg-div.ui-inline-del","#povGrid").remove();
	                            	
	                                   }
	                               }
	                            	    },
	                               {name:'actionLinkUnlink', 
	                                    index:'actionLinkUnlink',formatter : 'showlink',
	                                    formatoptions : {
	                    					baseLinkUrl : "javascript:",
	                    					showAction : "actionToLinkUnLinkPov('",
	                    					addParam : "');"
	                    				}
	                            	    
	                               	,
	            				    width:50,
	            				    editable:false }
	                              
	                               ];
	// for security
	jQuery.extend($.fn.fmatter,{
		formatLinkBLAU : function(cellvalue,
				options, rowdata) {
				return '';
		}
	});
	
	var jsonReaderPov = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"shipmentFreightId"
				               };
	$('#povGrid').gatesGrid({
		
		colNames: colNamesForPov,
		colModel: colModelForPov,
		jsonReader: jsonReaderPov,
		pager: '#pagerPovGrid',
		rowNum:10,
		height:"auto",
		rowList: [ 10, 20 ,30 ],
		
		gatesOptions: {
			urls: {
				load: '../shipmentCommodity/loadAutoGrid', 
				edit: '../shipmentCommodity/editAutoGrid' 
			},
			controls: {
				navBar: true,
				navBarAdd: false,
				navBarEdit: false,
				navBarDelete: false, //- multiDelete
				
				inlineAdd: false, //- hideCustomAddRow
				inlineEdit: true, //- hideEdit
				inlineDelete: false //- hideDelete
				
				
				
				
				
				
			},
			loadComplete: callloadCompleteAuto
		},
		beforeEditCell: function(rowid, cellname, value, iRow, iCol) {
		   // here identify row based on rowid
		   // if the row should not be editable than simply make the cells noneditable using
			jQuery('#commodityGrid').editCell(iRow, iCol, false);
			jQuery('#commodityGrid').jqGrid("restoreCell", iRow, iCol);
		}
          
		
		
	});
}

function createShipmentCommodityLclGrid(){
	
	currentRowId='';
	var colNamesForLcl = ['id','','','', 'This', 'Line', 'Unit Description ','Dims(LxWxH)','', 'VinSight#','','','Equip#','Temperature','Scale','','','',''];
	var colModelForLcl = [ 
	                            	{name:'shipmentConvFreightId', index:'shipmentConvFreightId',editable:false, hidden:true, formatter:'integer'},
	                            	{name:'shipmentFreightSeqNumber', index:'shipmentFreightSeqNumber',editable:false, hidden:true},
	                            	{name:'militaryTcnHidden', index:'militaryTcnHidden',editable:false, hidden:true},
	                            	 {name:'shipmentFreightId', index:'shipmentFreightId',editable:false, hidden:true, formatter:'integer'},
	                            	 {name:'isContainerLinked', index:'isContainerLinked', width:20,shrinkToFit:true, editable: false },
	                            	 {name:'firstCommodityLineNumber', index:'firstCommodityLineNumber',width:20,shrinkToFit:true, editable:false, hidden:false, formatter:'integer'},
	                            	 //Increased the maxlnegth for defect D028271
	                            	 {name:'unitDescription', index:'unitDescription',width:90,shrinkToFit:true, editable:true, edittype:'text',hidden:false,editoptions: {size:10, maxlength: 29}, 
	                            		 },
	                            	 {name:'receivedUnitDimension', index:'receivedUnitDimension', width:70,shrinkToFit:true, hidden:false,editable: false},
	                            	 
	                            	 {name:'routingLoadDischargePairCode', index:'routingLoadDischargePairCode', hidden:true, editable:false},
	                            	 {name:'receivedUnitId', index:'receivedUnitId', width:70, editable:false},
	                            	 {name:'receivedUnitPackageType', index:'receivedUnitPackageType', hidden:true, editable:false},
	                            	 {name:'receivedUnitPieceCount', index:'receivedUnitPieceCount', hidden:true, editable:false},
	                            	 {name:'equipmentId', index:'equipmentId', width:70,shrinkToFit:true, editable:true,required:false,editoptions: {maxlength: 10}},
	                            	 {name:'temperature', index:'temperature', width:60,shrinkToFit:true, editable:true,required:false,editoptions: {maxlength: 10}},
	                            	   {name:'temperatureCode', index:'temperatureCode', width:40, editable:true,edittype:'select',editoptions:{value:":;C:C;F:F"},editrules:{ required:true },
                                     	                               editrules:{
                                     	       	                		custom:true,
                                     	       	                		custom_func:function (value, colname,id) {
                                     	       	                			currentRowId= id;
                                     	       	                			var temp = $.trim($("#"+currentRowId+"temperature").val());

                                     	       									return [true,""];

                                     	       	                		}
                                     	       	                	}
                                     	                               },
	                            	 {name:'edit', index:'edit', width:50,shrinkToFit:true, editable:false, formatter:'actions',formatoptions:{
		                            	  onEdit:function(rowid) {
			                            		
		                            		  if(jQuery("#convGrid").getRowData(rowid).actionLinkUnlink =="LINK" )
		                            			{ $("#convGrid").jqGrid('restoreRow',rowid) ; 
		                            			$('#FormError').html("");
		                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            			$("div.ui-pg-div.ui-inline-cancel", "#"+rowid).remove();
		                            			$("div.ui-pg-div.ui-inline-save", "#"+rowid).remove();
		                            			$('#convGrid').trigger('reloadGrid');
		                            			if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
		                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            			
		                            			return;
		                            			}
		                            		  $("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
		                            		 
		                            		  $("div.ui-pg-div.ui-inline-del","#convGridDiv").remove();
		                            		 
		                            		
		                                   }
		                               }
		                              },
		                              {name:'isDeletable', index:'isDeletable', width:30,shrinkToFit:true, formatter:(isCommodityBLCVDelete==true?'showlink': 'formatLinkBLCV'), formatoptions : {
			                   				baseLinkUrl : "javascript:",
			                				showAction: "actionDelete('",
			                				addParam: "');" }
			                               },
						             {name:'actionLinkUnlink', index:'actionLinkUnlink', width:50,shrinkToFit:true, formatter: (isCommodityBLCVLink==true?'showlink': 'formatLinkBLCV'), formatoptions : {
							                   				baseLinkUrl : "javascript:",
							                				showAction: "actionToLinkUnLinkConv('",
							                				addParam: "');" }
							                               },
							         {name:'loadDischargeServicePair', index:'loadDischargeServicePair',hidden:true}
	                            	 
	                            	 ];
		// for security
		jQuery.extend($.fn.fmatter,{
			formatLinkBLCV : function(cellvalue,
					options, rowdata) {
					return '';
			}
		});
	
	var jsonReaderLcl = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"shipmentFreightSeqNumber"
				               };


	createGrid("convGrid", "pagerconvGrid",
			'../shipmentCommodity/loadConventionalGrid',
			'../shipmentCommodity/addConventionalGrid',
			'../shipmentCommodity/updateConventionalGrid', 
			'',
			'',
			colNamesForLcl, colModelForLcl, "Less Than Container Load", 
			"auto", 10, [ 10, 20, 30 ],false, false, false, false,
			jsonReaderLcl,isCommodityBLCVUpdate?false:true,true,true,true,false,false,false,false,lclGridLoadComplete,false,false);	
	
	

}
function createShipmentStpOffGrid(){
	var isStopOffUpdate=true;
	//var isStopOffsDelete=true;
	var stopOffsCol = [ 'Stop#','Organization','Description','TotalQuantity/Weight','Port','Arole'];
	var stopOffsMod = [
	                   
					{name :'positionInContainer',index: 'positionInContainer',width:40,editable:false,editoptions:{readonly:true,size:5}},  
	                {name:'party',index:'party', width:350,editable:false, formatter:(isStopOffUpdate==true?'showlink': 'formatLink'), formatoptions : {
	             				baseLinkUrl : "javascript:",
	          				showAction: "editStopOff('",
	          				addParam: "');" }
	                         }, 
	               
	                {name:'description',index:'description', width:250,editable:false},
	                {name:'totalQuantityByWeight',index:'totalQuantityByWeight', width:150,editable:false},
					 {name:'portCode',index:'portCode', width:40,editable:false},
					{name:'addressRoleId', index:'addressRoleId',editable:false, hidden:true}
	                  ];
	     jQuery.extend($.fn.fmatter,
				{
				formatLink : function(cellvalue,
					options, rowdata) {
					return cellvalue;
					}
				});
		var jsonReaderStopOff = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "positionInContainer",
		clear:true
	};
		createGrid(
				"stpOffGrid", // grid id for user
				"stpOffPager", // page id for user
				_context+'/shipment/stopoff/load', 
				_context+'/shipment/stopoff/add', 
				_context+'/shipment/stopoff/update', 
				'', 
				'',
				stopOffsCol, 
				stopOffsMod, 
				"Stop Offs",
				"auto",
				3,
				[3,6,9],
				true,
				false,
				false, //load once
				true, jsonReaderStopOff,false,false,true,true,true,false,false,false,stopOffsGridLoadComplete,false,true);
		
		//$('#maintainShipmentSpecialServices').unblock();
		
		$('#del_stopOffsGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
		
	}
function createShipmentStopOffsGrid(){
var isStopOffUpdate=true;
var isStopOffsDelete=true;
var stopOffsCol = [ 'Stop#','Organization','Description','TotalQuantity/Weight','Port','Arole'];
var stopOffsMod = [
                   
				{name :'positionInContainer',index: 'positionInContainer',width:40,editable:false,editoptions:{readonly:true,size:5}},  
                {name:'party',index:'party', width:350,editable:false, formatter:(isStopOffUpdate==true?'showlink': 'formatLink'), formatoptions : {
             				baseLinkUrl : "javascript:",
          				showAction: "editStopOff('",
          				addParam: "');" }
                         }, 
               
                {name:'description',index:'description', width:250,editable:false},
                {name:'totalQuantityByWeight',index:'totalQuantityByWeight', width:150,editable:false},
				 {name:'portCode',index:'portCode', width:40,editable:false},
				{name:'addressRoleId', index:'addressRoleId',editable:false, hidden:true}
                  ];
     jQuery.extend($.fn.fmatter,
			{
			formatLink : function(cellvalue,
				options, rowdata) {
				return cellvalue;
				}
			});
	var jsonReaderStpOff = {
	root : "rows",
	page : "page",
	total : "total",
	records : "records",
	repeatitems : false,
	cell : "cell",
	id : "positionInContainer",
	clear:true
};
	createGrid(
			"stopOffsGrid", // grid id for user
			"stopOffsPager", // page id for user
			_context+'/shipment/stopoff/load', 
			_context+'/shipment/stopoff/add', 
			_context+'/shipment/stopoff/update', 
			_context+'/shipment/stopoff/deleteStop', 
			_context+'/shipment/stopoff/delete',
			stopOffsCol, 
			stopOffsMod, 
			"Stop Offs",
			"auto",
			10,
			[10,20,30],
			true,
			isStopOffsDelete,
			false, //load once
			true, jsonReaderStpOff,false,false,true,true,true,false,false,false,stopOffsGridLoadComplete,false,true);
	
	//$('#maintainShipmentSpecialServices').unblock();
	
	$('#del_stopOffsGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
	
}
function createShipmentItemStopOffsGrid(){
	var counter=0;
	//var isStopOffUpdate=true;
	//var isStopOffsDelete=true;
	var itemStopOffsCol = [ 'Seq #','shipmentItemId','shipmentStopOffSeqNo','shipmentItemStopOffId','Tariff Item','Description','TotalItemQty','Qty','TotalItemWeight','Weight','action'];
	var itemStopOffsMod = [
					{name:'itemStopOffSeqNumber', index:'itemStopOffSeqNumber',editable:false,hidden:true, formatter:'integer'},
					{name:'shipmentItemId', index:'shipmentItemId',editable:false, hidden:true, formatter:'integer'},
	                {name:'shipmentStopOffSeqNo', index:'shipmentStopOffSeqNo',editable:false, hidden:true, formatter:'integer'},
	                {name:'shipmentItemStopOffId', index:'shipmentItemStopOffId',editable:false, hidden:true, formatter:'integer'},
	                {name :'tariffItem',index: 'tariffItem',width:20,editable:false,editoptions:{readonly:true,size:7}},  
					 {name:'description',index:'description', width:70,editable:false},
					  {name:'totalItemQuantity',index:'totalItemQuantity', width:30,editable:false},
	                {name:'quantity',index:'quantity', width:20,editable:true,edittype:'text',editoptions: {
	            		   maxlength: 5, dataEvents: [
	            		                {
	            		                    type: 'change',
	            		                    fn: function(e) {
	            		                    	var row = $(e.target).closest('tr.jqgrow');
            		                            var rowId = row.attr('id');
												counter=rowId;
												isStopChanged='Y';
	            		                    	//disableAddDelete(rowId);
												if(rowId==undefined){
	            		                    		if($.trim($('#quantity').val())==''){
	            		                    			$('#quantity').val('');
		            		                    	}
            		                            }
	            		                    	else{
	            		                    		if($.trim($('#'+rowId+'_quantity').val())==''){
	            		                    			$('#'+rowId+'_quantity').val('');
		            		                    	}
	            		                    	}
	            		                    }
	            		                }]},editrules:{
	            		   custom:true,
	            		   custom_func:function (value, colname) {
									
									var wgt = $.trim($("#"+counter+"_weight").val());
									if(wgt != '' && value == '' ){
		                			return [false, colname+":weight without quantity."];
		                			} 
									if(wgt == '' && value != '' ){
		                			return [false, colname+":quantity without weight."];
		                			}
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
	                {name:'totalItemWeight',index:'totalItemWeight', width:30,editable:false           		   },
										   {name:'weight',index:'weight', width:20,editable:true, edittype:'text',
										   editoptions: {
											dataEvents: [
	            		                {
	            		                    type: 'change',
	            		                    fn: function(e) {
	            		                    	var row = $(e.target).closest('tr.jqgrow');
            		                            var rowId = row.attr('id');
            		                            counter=rowId;
            		                            isStopChanged='Y';	            		        
												if(rowId==undefined){
	            		                    		if($.trim($('#weight').val())==''){
	            		                    			$('#weight').val('');
		            		                    	}
            		                            }
	            		                    	else{
	            		                    		if($.trim($('#'+rowId+'_weight').val())==''){
	            		                    			$('#'+rowId+'_weight').val('');
		            		                    	}
	            		                    	}
	            		                    }
	            		                }]},
										   editrules:{
	                		custom:true,
	                		custom_func:function (value, colname){
	                			var reg7Number3DecimalPlaces = /^[0-9]{0,7}(\.[0-9]{1,3})?$/;
	                			var reg7Number = /^[0-9]{1,7}$/;
	                			var qty = $.trim($("#"+counter+"_quantity").val());
									if(qty != '' && value == '' ){
		                			return [false, colname+":quantity without weight."];
		                			} 
									if(qty == '' && value != '' ){		                			
									return [false, colname+":weight without quantity."];
		                			}
		                		//	else{
		                				 //switch($('#unitOfMeasureSourceCode').val())
		                			     //{
		                			       //  case "M": 
		                			        	 if(isNaN(value)){ 
		         		            				return [false,colname+ ": Weight must be numeric."];
		         		            			 }
		                			        	 if(!reg7Number3DecimalPlaces.test(value)) {
		                			        		 return [false, colname+": Only 7 numbers before decimal and 3 numbers after decimal are allowed.No blank spaces are allowed."];
		                			        	 }
		                			        	 /*if(!isNaN(parseFloat(value)) && $.trim(parseFloat(value))>parseFloat($("#metricWeightLimit").val())) {
		                			        		 return [false, colname+": Weight can't exceed "+$("#metricWeightLimit").val()+"."];
		                			        	 }*/
		                			       //  break;
		                			       //  case "I": 
		                			        	// if(isNaN(value)){ 
		         		            			//	return [false,colname+ ": Weight must be numeric."];
		         		            			// }
		                			        	// if(!reg7Number.test(value)) {
		                			        	//	 return [false, colname+": Max 7 numbers are allowed. No blank spaces are allowed."];
		                			        	// }
		                			        	 
		                			        	 /*if(!isNaN(parseFloat(value)) && $.trim(parseFloat(value))>parseFloat($("#imperialWeightLimit").val())) {
		                			        		 return [false, colname+": Weight can't exceed "+$("#imperialWeightLimit").val()+"."];
		                			        	 }*/
		                			        // break;
		                			    // }
		                			//}
	                			//}
	                			return [true, ""];
	                		}
	            	   },
	            	   formatter:float3DecimalFormat
	                            		   },
										   {name:'actions', index:'actions', width:20, align:"center", editable:false, search:false, sortable:false, formatter:'actions', 
                				formatoptions:{keys:true,
					          	delbutton : false, 
					          	editbutton:true,
						   		}}
	                  ];
       jQuery.extend($.fn.fmatter,
				{
				formatLink : function(cellvalue,
					options, rowdata) {
					return cellvalue;
					}
				});
	var jsonReaderItmStpOff = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "itemStopOffSeqNumber",
		clear:true
	};
			createGrid(
				"itemstopOffsGrid", // grid id for user
				"itemstopOffsPager", // page id for user
				_context+'/shipment/stopoff/loadItemStops', 
				_context+'/shipment/stopoff/addItemStops', 
				_context+'/shipment/stopoff/updateItemStops', 
				'', 
				'',
				itemStopOffsCol, 
				itemStopOffsMod, 
				"ItemStopOffs",
				"auto",
				10,
				[10,20,30],
				false,
				false,
				false, //load once
				false, jsonReaderItmStpOff,false, // hide edit
			true, // hide delete
			true, // autowidth
			true, // rownumbers
			true, // hide custom add row,
			true,false,false,itemStopOffsGridComplete,itemStopOffsGridLoadComplete,false,false);
		
		//$('#maintainShipmentSpecialServices').unblock();
		
		$('#del_stopOffsGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
		
	}
		function createShipmentStopOffHazardGrid(){
	
	  console.log("createStopOffHazardGrid");
	  var colNames = ['Id','Stop #', 'Unit Id','UN/NA #','Hzd Class','Description','Pkg Grp','Pieces','Kind','Weight','Lmt Qty' ];
	  
	  var colModel = [
	       {name:'shipmentHazardId',hidden:true},
	       {name:'stopNumber',  width:50},
	       {name:'unitId', width:50},	       
	       {name:'hazTypeAndNumber',width:50},
	       {name:'hazPrimaryClass',width:50},
	       {name:'hazCommodityName',width:100},
	       {name:'hazPackageGroup',width:50},
	       {name:'hazPieces',width:50},
	       {name:'hazPiecesUomCode',width:50},
	       {name:'hazWeight',width:50},
	       {name:'hazLimitedQuantity',width:50,formatter:'select', stype:'select', edittype:'select', editoptions: { value: "false:No;true:Yes" }}
	   ];
	  
	  var jsonReaderHaz = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "shipmentHazardId"
			};
		createGrid("StpOffHazardGrid", // grid id for hazard
			"StpOffHazardPager", // page id for hazard
			_context+'/shipment/stopoff/loadHazard', // geturl
			'', // addurl
			'',
			'',
			'',
			colNames, colModel, "Hazardous",// caption
			"auto",// height
			10,// row num
			[5,10,20],// row list
			true,// multiselect
			false,// multidelete 
			false,// load once
			true, // read only grid
			jsonReaderHaz, // json reader
			true, // hide edit
			true, // hide delete
			true, // autowidth
			true, // rownumbers
			true, // hide custom add row
			false,// hide pager row
			null,// custom edit method
			stpoffHazardGridComplete,// custom grid complete
			stpoffHazardLoadComplete,// custom load complete
			false,// default hidden
			true);// row Color Based On status
			
			
}
function createShipmentCommodityConvGrid(){
	
	
	currentRowId='';
	var colNamesForConventional = ['id','','','', 'This', 'Line', 'Unit Description ','Dims(LxWxH)','VIN','', 'VinSight#','Equip#','TCN#','','','',''];
	var colModelForConventional = [ 
	                            	{name:'shipmentConvFreightId', index:'shipmentConvFreightId',editable:false, hidden:true, formatter:'integer'},
	                            	{name:'shipmentFreightSeqNumber', index:'shipmentFreightSeqNumber',editable:false, hidden:true},
	                            	{name:'militaryTcnHidden', index:'militaryTcnHidden',editable:false, hidden:true},
	                            	 {name:'shipmentFreightId', index:'shipmentFreightId',editable:false, hidden:true, formatter:'integer'},
	                            	 {name:'isContainerLinked', index:'isContainerLinked', width:25,shrinkToFit:true, editable: false },
	                            	 {name:'firstCommodityLineNumber', index:'firstCommodityLineNumber',width:30,shrinkToFit:true, editable:false, hidden:false, formatter:'integer'},
	                            	 //Increased the maxlnegth for defect D028271
	                            	 {name:'unitDescription', index:'unitDescription',width:110,shrinkToFit:true, editable:true, edittype:'text',hidden:false,editoptions: {size:10, maxlength: 29}, 
	                            		 editrules:{ required:true,
	                            			         custom:true,
			           	                		     custom_func:function (value, colname) {
			           	                			var invalidCharMsg = "This is invalid.";
			           	                			var charRegex = /^[0-9a-zA-Z\ \'\&]+$/;
			           	                		    if(!charRegex.test($.trim(value))){
			           	                				return [false, colname+": "+invalidCharMsg];
			           	                			}
			           	                		 else{
			           									return [true,""];
			           								}}}},
	                            	 {name:'receivedUnitDimension', index:'receivedUnitDimension', width:100,shrinkToFit:true, hidden:false,editable: false},
	                            	 {name:'vinNumber', index:'vinNumber', width:130,shrinkToFit:true, hidden:false,editable: true, editoptions: {maxlength: 17}, 
	                            		 editrules:{ required:false,
                        			         custom:true,
	           	                		     custom_func:function (value, colname) {
	           	                			/*var invalidCharMsg = "This is invalid.";
	           	                			var alphaRegex = /^[0-9a-zA-Z\ \'\&]+$/;
	           	                		    if(!alphaRegex.test($.trim(value))){
	           	                				return [false, colname+": "+invalidCharMsg];
	           	                			}else{*/
	           									return [true,""];
	           								//}
	           	                		    }}
	                            	 ,edittype:'text',editoptions: {maxlength: 17}},
	                            	 {name:'routingLoadDischargePairCode', index:'routingLoadDischargePairCode', hidden:true, editable:false},
	                            	 {name:'receivedUnitId', index:'receivedUnitId', width:60, editable:false},
	                            	 {name:'equipmentId', index:'equipmentId', width:85,shrinkToFit:true, editable:true,required:false,editoptions: {maxlength: 10}},
	                            	 {name:'militaryTcn', index:'militaryTcn', width:140,shrinkToFit:true, editable:true, editoptions: {maxlength: 17},  editrules:{
	             	            		custom:true,
	            	            	
	            	            		custom_func:function (value, colname) {
	            	            			
	            	            			// D030696
	            	            			if($.trim(value) == null || $.trim(value) == ''){
	            	            				if($('#militaryIbsStatusCode').val()!=''){
	            	            					return [false, colname+": Field is required."];
	            	            				}
	            	            				return [true,""];
	            	            			}else{
	            	            				if(value.length != 17){
            		            					return [false, colname+": This must be 17 characters long."];
            		            				}
	            	            				else if(!/^[0-9A-Za-z$]+$/.test(value)){
	            	                				return [false, colname+": This contains invalid characters."];
	            	                			}
	            		            			else{
	            		            				var valTIN= false;
	            		            				
	            		            				if($.trim(value)!=null ){
	            		            					$.ajax({
	            		            						async:false,
	            		            						url : _context +"/shipmentCommodity/validateTIN",
	            		            						type : "GET",
	            		            						data : {
	            		            							
	            		            							validateTIN: $.trim(value)
	            		            						},
	            		            						success : function(responseText) {
	            		            							if(responseText.success==false){
	            		            								valTIN= true;
	            		            						}
	            		            							else{
	            		            								var isConfirm = confirm("TCN is not unique. Exists on another Shipment. Override? (Y/N)");
	            		            								if (isConfirm) {
	            		            									valTIN= true;
	            		            							}else{
	            		            								valTIN= false;
	            		            								
	            		            							}
	            		            							}}});
	            		            					}
	            		            				
	            		            				
	            		            				
	            		            				if(valTIN == true){
	            		            					return [true,""];
	            		            				}else{
	            		            					return [false,""];
	            		            				}
	            		            				
	            		            				
	            		            				if($.trim(value).length == 17){
	            		            					return [true,""];
	            		            				}
	            		            				else {
	            		            					return [false, colname+": This must be 17 characters long."];
	            		            				}
	            								}
	            	            			}
	            		            			
	           	                		 }},editoptions: {maxlength: 17}},
	           	                			{name:'edit', index:'edit', width:50,shrinkToFit:true, editable:false, formatter:'actions',formatoptions:{
				                            	  onEdit:function(rowid) {
				                            		
				                            		  if(jQuery("#convGrid").getRowData(rowid).actionLinkUnlink =="LINK" )
				                            			{ $("#convGrid").jqGrid('restoreRow',rowid) ; 
				                            			$('#FormError').html("");
				                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
				                            			$("div.ui-pg-div.ui-inline-cancel", "#"+rowid).remove();
				                            			$("div.ui-pg-div.ui-inline-save", "#"+rowid).remove();
				                            			$('#convGrid').trigger('reloadGrid');
				                            			if($("#convGrid").getGridParam("reccount")>0){ $('#tr_shipmentConvFreightId').hide();};
				                            			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
				                            			
				                            			return;
				                            			}
				                            		  $("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
				                            		 
				                            		  $("div.ui-pg-div.ui-inline-del","#convGridDiv").remove();
				                            		 
				                            		
				                                   }
				                               }
				                              },
	           	                				                              
	           	                	{name:'isDeletable', index:'isDeletable', width:30,shrinkToFit:true, formatter:(isCommodityBLCVDelete==true?'showlink': 'formatLinkBLCV'), formatoptions : {
						                   				baseLinkUrl : "javascript:",
						                				showAction: "actionDelete('",
						                				addParam: "');" }
						                               },
						             {name:'actionLinkUnlink', index:'actionLinkUnlink', width:60,shrinkToFit:true, formatter: (isCommodityBLCVLink==true?'showlink': 'formatLinkBLCV'), formatoptions : {
							                   				baseLinkUrl : "javascript:",
							                				showAction: "actionToLinkUnLinkConv('",
							                				addParam: "');" }
							                               },
							         {name:'loadDischargeServicePair', index:'loadDischargeServicePair',hidden:true}
	                            	 
	                            	 ];
		// for security
		jQuery.extend($.fn.fmatter,{
			formatLinkBLCV : function(cellvalue,
					options, rowdata) {
					return '';
			}
		});
	
	var jsonReaderConventional = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"shipmentFreightSeqNumber"
				               };


	createGrid("convGrid", "pagerconvGrid",
			'../shipmentCommodity/loadConventionalGrid',
			'../shipmentCommodity/addConventionalGrid',
			'../shipmentCommodity/updateConventionalGrid', 
			'',
			'',
			colNamesForConventional, colModelForConventional, "Conventional", 
			"auto", 10, [ 10, 20, 30 ],false, false, false, false,
			jsonReaderConventional,isCommodityBLCVUpdate?false:true,true,true,true,false,false,false,false,convGridLoadComplete,false,false);	
	
	
}

function createShipmentSpecialServiceGrid(){
	
//	$('#maintainShipmentSpecialServices').block({ message: "Loading Shipment Special Service ..." });
var specialServiceCol = [ 'NO','Special Service','Lvl','All','Equipment/<br>VINsight#','Units','Rate', 'Rate Basis', 'User', 'Last Update', 'Payee','C/O Org','Amount'];
	
	var specialServiceMod = [
	                         {name:'seqNo',index:'seqNo', width:55,editable:false, editoptions:{readonly:true,size:10}, hidden:true},
	                         {name:'specialServiceCode',index:'specialServiceCode', width:80,editable:false, formatter:(isSpecialServiceUpdate==true?'showlink': 'formatLink'), formatoptions : {
	                   				baseLinkUrl : "javascript:",
	                				showAction: "editSpecialService('",
	                				addParam: "');" }
	                               }, 
	                         {name:'processLevelCode',index:'processLevelCode', width:30,editable:false},
	                         {name:'isApplyToAll',index:'isApplyToAll', width:30,editable:false},
	                         //Increased width for defect D026220
	                         {name:'equipmentVinsight',index:'equipmentVinsight', width:90,editable:false}, 
	                         {name:'numberOfUnit',index:'numberOfUnit', width:60,editable:false}, 
	                         {name:'manualUserRate',index:'manualUserRate', width:60,formatter:'number',formatoptions: {prefix:'$', thousandsSeparator:',', defaultValue:''},editable:false, align: 'right'}, //for currency formatter
	                         {name:'rateBasisCode',index:'rateBasisCode', width:40,editable:false},
	                        
	                         //Defect 24939
	                         //Added code to create User,Date and Time grids in Special Service overlay
	                         {name:'lastUpdateUser',index:'lastUpdateUser', width:60,editable:false},
	                         {name:'lastUpdateDate',index:'lastUpdateDate', width:90,editable:false},
	                         //{name:'specialServiceDate',index:'specialServiceDate', width:60,editable:false}, 
	                         {name:'payee',index:'payee', width:100,editable:false}, 
	                         {name:'careOf',index:'careOf', width:90,editable:false},
	                         {name:'amount',index:'amount', width:70,formatter:'number',formatoptions: {prefix:'$', thousandsSeparator:',', defaultValue:''},editable:false, align: 'right'} //for currency formatter
	                        ];
				jQuery.extend($.fn.fmatter,
					{
					formatLink : function(cellvalue,
						options, rowdata) {
						return cellvalue;
				}
				});
	
	var jsonReaderSpSvc = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo",
			clear:true
		};

	createGrid(
			"specialServiceGrid", // grid id for user
			"specialServicePager", // page id for user
			_context+'/shipment/specialservice/load', 
			_context+'/shipment/specialservice/add', 
			_context+'/shipment/specialservice/update', 
			_context+'/shipment/specialservice/delete', 
			_context+'/shipment/specialservice/delete',
			specialServiceCol, 
			specialServiceMod, 
			"Special Services",
			"auto",
			10,
			[10,20,30],
			true,
			isSpecialServiceDelete,
			false, //load once
			true, jsonReaderSpSvc,true,true,true,true,true,false,false,false,specialServiceGridLoadComplete,false,true);
	
	//$('#maintainShipmentSpecialServices').unblock();
	createShipmentCommodityGrid();
	$('#del_specialServiceGrid').bind('click',function(){ saveBillBeforeBillButton = true; });
	
}

function createShipmentClauseGrid(){
	
//	$('#maintainBookingClauses').block({ message: "Loading Shipment Clause ..." });
	  var colNames = ['Id','Clause Code', 'Is Editable', 'Clause Type','Text','Source','' ];
	  
	  var colModel = [
	       {name:'clauseSeqNo', hidden:true},
	       {name:'standardClauseCode', index:'standardClauseCode', width:100},
	       {name:'isEditable', hidden:true},
	       {name:'clauseTypeCode', index:'clauseTypeCode', width:100},
	       {name:'clauseText',index:'clauseText', width:350, editable:true, edittype:"textarea", editrules : { required : true, custom:true, custom_func:validateMaxlength}, editoptions : {rows : 2, cols : 50}},
	       {name:'clauseSource',index:'clauseSource', width:150}, 
	       {name:'actions', width:50,hidden : true, formatter:'actions',formatoptions:{keys:true, editbutton:true, delbutton:true,
	    	   afterRestore:function()
	    	   {
	    		 //Clears and hides error row
	    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"] td').html("");
	    			$('table[aria-labelledby="gbox_gridIdForClauses"] thead tr[id="FormError"]').hide();
	    	   }
	       }}];
	  
	  //alert("TTEEEEEEEEEset");
	  var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "clauseSeqNo"
			};

			createGrid("gridIdForClauses", // grid id for party
			"pagerIdForClauses", // page id for party
			_context+'/shipment/clause/load', // geturl
			'', // addurl
			_context+'/shipment/clause/updateClause', // edit url
			'',
			_context+'/shipment/clause/delete',// delete selected URL
			colNames, colModel, "Clauses",// caption
			90,// height
			3,// row num
			[3,6,9],// row list
			true,// multiselect
			isClausesDelete,// multidelete //Modified to this value from default true for D028950 
			false,// load once
			false, // read only grid
			jsonReader, // json reader
			false, // hide edit
			true, // hide delete
			true, // autowidth
			true, // rownumbers
			true, // hide custom add row
			false,// hide pager row
			null,// custom edit method
			clauseGridComplete,// custom grid complete
			clauseLoadComplete,// custom load complete
			false,// default hidden
			true);// row Color Based On status
			

			$("#gridIdForClauses").jqGrid('setGridParam',{
				delOptions: {url: _context+'/shipment/clause/deleteClause', caption: "Confirmation", msg: "Please CONFIRM request to DELETE",
					beforeSubmit:function(postdata)
					{
						rowData=jQuery("#gridIdForClauses").getRowData(postdata);
						/*if(rowData.standardClauseCode=='BOND' )//&& $('#isInBond :selected').val()=='true'
						{
							$('#msgDiv').html('<div class="message_error">'+'BOND clause cannot be deleted'+'</div>');
							window.scrollTo(0, 0);
							$('#eData').trigger('click');
							return [false,""];
						}
						else*/{
							return [true,""];
						}
					}
				}
			});
		
			
	//		$('#maintainBookingClauses').unblock();
			
}


function createShipmentHazardGrid(){
	
	  console.log("createHazardGrid");
	  var colNames = ['Id','gridid','hazid','archivehazid','seq','Stop #', 'Unit Id', 'UN/NA','UN/NA #','Hzd Code','Hzd Class','Description','Pkg Grp','Pieces','Kind','Weight','Lmt Qty' ];
	  
	  var colModel = [
	       {name:'shipmentHazardId', hidden:true},
	       {name:'gridId', hidden:true},
	       {name:'commodityLineId', hidden:true},
	       {name:'archiveCommodityLineId', hidden:true},
	       {name:'seqNumber', hidden:true},
	       {name:'stopNumber',  width:40},
	       {name:'unitId', width:100},
	       {name:'hazType', hidden:true},
	       {name:'hazTypeAndNumber',width:70},
	       {name:'hazNumber', hidden:true},
	       {name:'hazPrimaryClass',width:50},
	       {name:'hazCommodityName',width:200},
	       {name:'hazPackageGroup',width:50},
	       {name:'hazPieces',width:50},
	       {name:'hazPiecesUomCode',width:50},
	       {name:'hazWeight',width:50},
	       {name:'hazLimitedQuantity',width:50,formatter:'select', stype:'select', edittype:'select', editoptions: { value: "false:No;true:Yes" }}
	       
	   ];
	  
	  var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "gridId"
			};

			createGrid("hazardGrid", // grid id for hazard
			"hazardPager", // page id for hazard
			_context+'/shipment/hazard/load', // geturl
			'', // addurl
			'',
			'',
			'',
			colNames, colModel, "Hazardous",// caption
			"auto",// height
			10000,// row num
			[10000],// row list
			false,// multiselect
			false,// multidelete 
			false,// load once
			true, // read only grid
			jsonReader, // json reader
			true, // hide edit
			true, // hide delete
			true, // autowidth
			true, // rownumbers
			true, // hide custom add row
			true,// hide pager row
			null,// custom edit method
			hazardGridComplete,// custom grid complete
			hazardLoadComplete,// custom load complete
			false,// default hidden
			true, // row Color Based On status
			null,
			null,
			null,
			null,
			true); // Footer
			

			
			
}


function createShipmentHazardDialogGrid(){
	
	  console.log("createHazardDialogGrid");
	  var colNames = ['Id','gridid','Haz id','archive id','Stop #', 'Unit Id', 'UN/NA','UN/NA #','Hzd Code','Hzd Class','Description','Pkg Grp','Pieces','Kind','Weight','Lmt Qty','Seq' ];
	  
	  var colModel = [
	       {name:'shipmentHazardId', hidden:true},
	       {name:'gridId', hidden:true},
	       {name:'commodityLineId', hidden:true},
	       {name:'archiveCommodityLineId', hidden:true},
	       {name:'stopNumber',  width:40},
	       {name:'unitId', index:'unitId', jsonMap:'unitId', width:100,  edittype:'select', editable:false}, 
	       {name:'hazType', hidden:true},
	       {name:'hazTypeAndNumber',width:70},
	       {name:'hazNumber', hidden:true},
	       {name:'hazPrimaryClass',width:50},
	       {name:'hazCommodityName',width:200},
	       {name:'hazPackageGroup',width:50},
	       {name:'hazPieces',width:50},
	       {name:'hazPiecesUomCode',width:50},
	       {name:'hazWeight',width:50},
	       {name:'hazLimitedQuantity',width:50,formatter:'select', stype:'select', edittype:'select', editoptions: { value: "false:No;true:Yes" }},
	       {name:'seqNumber',width:50}
	   ];
	  
	  var jsonReader = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				cell : "cell",
				repeatitems : false,
				id : "gridId"
			};

			createGrid("hazardDialogGrid", // grid id for hazard
			"hazardDialogGrid", // page id for hazard
			_context+'/shipment/hazard/loadEditor', // geturl
			'', // addurl
			'',
			'',
			'',
			colNames, colModel, "Hazard Editor",// caption
			"auto",// height
			10000,// row num
			[5,10,20],// row list
			true,// multiselect
			false,// multidelete 
			false,// load once
			true, // read only grid
			jsonReader, // json reader
			true, // hide edit
			true, // hide delete
			true, // autowidth
			true, // rownumbers
			true, // hide custom add row
			true,// hide pager row
			null,// custom edit method
			hazardEditorGridComplete,// custom grid complete
			hazardEditorLoadComplete,// custom load complete
			false,// default hidden
			true // row Color Based On status		
			);
			

			

			// Disable grids on select
			$("#hazardDialogGrid").jqGrid('setGridParam',{
				beforeSelectRow: function(rowid, e) //this function is used when you select rows
				{
					console.log('before row select');
				    //means when your check box is disabled,you can't check your check box              
					if( $("#jqg_hazardDialogGrid_"+rowid).attr("disabled") )
					{
						return false;
					}
				    	return true; 
					},
				onSelectAll: function(aRowids,status) // this function is used when you select all check box
				{
					console.log('onSelectAll');
					if (status) 
					{
						for(var i=0;i<aRowids.length;i++)
						{
							if( $("#jqg_hazardDialogGrid_"+aRowids[i]).attr("disabled"))
							{
								$("#jqg_hazardDialogGrid_" + aRowids[i]).removeAttr("checked");
								$("#hazardDialogGrid").setSelection(aRowids[i],false);

							}
						}

				     }

				}
			});	
			
}

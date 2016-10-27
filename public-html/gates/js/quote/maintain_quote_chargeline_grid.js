var _chargeDeleted = false;

function autocomplete_el(value, options) {
	var $ac = $('<input size="4" type="text"/>');
	$ac.val(value);	
	$ac.gatesAutocomplete({
		mustMatch : true,
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'getChrgeLnDesc',
		 		 searchType: '266'		 		 
	 	},
		formatItem : function(data) {
			return data.code + "-" + data.desc;
		},
		formatResult : function(data) {
			return data.code + "-" + data.desc;
		},
		select : function(data) {
			if(data.levelChageCode != null){
				$('#level').val(data.levelChageCode);
			}
			return data.code + "-" + data.desc;
		},
		autoSelectFirst:true,
		autoSelectCriteria :function(item){
			if(item.code.toUpperCase()==$('#'+thisId).val().toUpperCase()) {
				return true;
			}
			else{
				return false;
			}
		}
	});
	
	// returning element back to jqGrid
	return $ac;
}

function autocomplete_value(elem, op, value) {
	if (op == "set") {
		$(elem).val(value);
	}
	return $(elem).val();
}

var disableChargeGrid = false;
if(isChargeDisplay && !isChargeModifiable){
	disableChargeGrid = true;
}
var _chargeGridCount = -1;
var _totalChargeGridCount = -1;
var currentRowId='';
$(document).ready(
		function() {
			
			var isAddable = false;
			var isDeletable = true;
			var isEditableRow = '';
			var oldCmdtyLineNo = '';
			currentRowId='';
			if($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR") {
				isAddable = false;
				isEditableRow = {name : 'actions', index : 'actions', width : 80, align : "center", editable : false, search : false, sortable : false, formatter : 'actions', 
						formatoptions : {
							keys : true,
							onEdit : function(rowId){
								currentRowId = rowId;
								genericId = "#" + rowId + "_generic";
								$(genericId).val("Y");
								return true;
							},
							afterSave: function() {
								//Issue: to clear the edited charge's ID from session so that in next delete call, it should not take this id by default.
								$("#quoteChargeLineGrid").resetSelection();
								$("#quoteChargeLineGrid").trigger('reloadGrid');								
								return true;
							}
						}
				};				
			}if($('#statusCode').val()=="ISSD" || $('#statusCode').val()=="BKGD" ||
					(isChargeDisplay && !isChargeModifiable)) {
				isAddable = true;
				isDeletable = false;
				isEditableRow = {name : 'actions', index : 'actions', width : 80, align : "center", editable : false, search : false, sortable : false};
			}
			/*if($($('#passThru').val() == 'Y'){
				isEditableRow = {name : 'actions', index : 'actions', width : 80, align : "center", editable : false, search : false, sortable : false};
			}*/
			var colNamesForCharges = ['id', 'Source Rate Number', 'Level', 'Cmdy #', 'Cmdty Line Seq No',  'Code', 'Unit', 'Rate', 'RB', 'Amount', 'Eff Date', 'Exp Date', 'Generic', 'Pass thru', 'Min WT/CB', 'Actions'];
			var colModelForCharges = [ 
			            {name : 'chargeId', index : 'chargeId', editable : false, width : 30, hidden : true},
			            {name : 'sourceRateNumber', index : 'sourceRateNumber', editable : true, hidden : true},
			            {name : 'level', align:'center', label : 'Level', index : 'level', editable : true, width : 46, edittype: 'text', 
			            	editrules : {
			            		required : true,
			            		maxlength :1,
			            		custom:true,
			            		custom_func:function (value, colname,id) {	
			            			var levelId = "";
									var descriptionCode = "";
			            			if(currentRowId == ""){
			            				levelId = "#level";
										descriptionCode = "#description";
			            			}else{
			            				levelId = "#"+currentRowId+"_level";
										descriptionCode = "#"+currentRowId+"_description";
			            			}
									
									if(/^[a-zA-Z]$/.test($(levelId).val())){
			            				$(levelId).val(($(levelId).val()).toUpperCase());
			            			}
			            			if(value!="C" && value!="S" && value!="E"){
			            				return [false,"Please enter Level only as C, E or S"];
			            			} else {
			            				if((($(descriptionCode).val()== 'AD2-ADVANCE FOR DELIVERY') ||
												($(descriptionCode).val()== 'OVR-ACI ZONE PICKUP'))
												&& ($(levelId).val()!='C')){
											return [false, "* Please enter Level as 'C' for Door To Ramp Or Overland Charge"];
										}			            				
			            			}
			            			return [true,""];
			            		}
			            	},
			            	editoptions: {
			            		dataEvents: [{
			            		type: 'blur',			            		
			            		fn: function(event) {
			            			var levelId = "";
									var cmdtyId = "";
			            			if(currentRowId == ""){
			            				levelId = "#level";
										cmdtyId = "#chargeCmdyLineNo";
			            			}else{
			            				levelId = "#"+currentRowId+"_level";
										cmdtyId = "#"+currentRowId+"_chargeCmdyLineNo";
			            			}
									
									if(/^[a-zA-Z]$/.test($(levelId).val())){
			            				$(levelId).val(($(levelId).val()).toUpperCase());
			            				if(!($(levelId).val()=='S' || $(levelId).val()=='C' || $(levelId).val()=='E')){
			            					return [false,"Please enter Level only as C, E or S"];
			            				}
			            			}									
			            			if($(levelId).val()=='S') {			            				
			            				oldCmdtyLineNo = $(cmdtyId).val(); 
			            				$(cmdtyId).val('');
			            				$(cmdtyId).attr("disabled", true);
			            			} else if($(levelId).val()=='C' || $(levelId).val()=='E' ) {
			            				$(cmdtyId).removeAttr("disabled");
			            				if(oldCmdtyLineNo != ''){
			            					$(cmdtyId).val(oldCmdtyLineNo);	
			            				}
			            			}
			            		}
			            	}]},
			            	hidden : false
			            },
			            {name : 'chargeCmdyLineNo', align:'center', label : 'Cmdy #', index : 'chargeCmdyLineNo', width : 60, editable : true, edittype: 'text',
							editrules : {
								custom:true,
			            		custom_func:function (value, colname,id) {			            			
									
			            			var isValid = validateForPositiveIntegers(value);
			            			var levelId = "";				
									var descriptionCode = "";
			            			if(currentRowId == ""){
			            				levelId = "#level";				
										descriptionCode = "#description";
			            			}else{
			            				levelId = "#"+currentRowId+"_level";				
										descriptionCode = "#"+currentRowId+"_description";	
			            			}
			            			
			            			
									if((($(descriptionCode).val()== 'AD2-ADVANCE FOR DELIVERY') ||
											($(descriptionCode).val()== 'OVR-ACI ZONE PICKUP'))
											&& ($(levelId).val()!='C')){
										return [false, "* Please enter Level as 'C' for Door To Ramp Or Overland Charge"];
									}
			            			if(!isValid) {
			            				if(value == "" && $(levelId).val() != "" && ($(levelId).val()).toUpperCase() == 'S'){			            					
			            					return [true,""];
										}else{
											return [false, "* Please enter valid Commodity Line number"];	
										}
			            				
			            			} else {
			            				return [true,""];
			            			}
			            		}
							},
							editoptions:{maxlength:6}, hidden : false, sorttype:"int"}, 
						{name : 'chargeCommoditySequenceNo', label : 'Seq No', index : 'chargeCommoditySequenceNo', editable : false, width : 30, hidden : true, formatter : 'integer'},
						{name : 'description', label : 'Code', index : 'description', width : 58, editable:true,  editrules:{required:true}, 
							edittype : 'custom',
							editoptions : {
									size:20, 
									maxlength:3,
									custom_element :  autocomplete_el,  
									custom_value   : autocomplete_value,
									custom_func:function (value, colname,id) {
										var levelId = "";
										if(currentRowId == ""){
											levelId = "#level";
										}else{
											levelId = "#"+currentRowId+"_level";
										}
										
										if(((value== 'AD2-ADVANCE FOR DELIVERY') ||
												(value== 'OVR-ACI ZONE PICKUP'))
												&& ($(levelId).val()!='C')){
											return [false, "* Please enter level as 'C' for Door To Ramp Or Overland Charge"];
										}
									}
								},
								title: false,
								formatter:'descriptionFormatter'
							},
						{name : 'unit', label : 'Unit', index : 'unit', align:'right', width : 80, editable:true, edittype: 'text', 
							editrules:{required:true, custom:true,
								custom_func: function (value, colname) {
									var isValid = validateForPositiveIntegers(value);
									quoteChargeLineGridUpdate();
			            			if(!isValid) {
			            				return [false, "* Please enter valid decimal value"];
			            			} else {
			            				return [true,""];
			            			}
								}
							}, 
							editoptions:{size:20, maxlength: 11, defaultValue:'0', dataEvents: [{
								type: 'change',
								fn: function(event) {
									var currUnitId = this.id;
									var idPrefix = (currUnitId.split("_")[0])+"_";
									if(idPrefix=="unit_")
										idPrefix = "";
									calculateChargeLineAmount(idPrefix);
								},
								type: 'focus',
								fn: function(event) {
									var currUnitId = this.id;
									var value = $('#'+currUnitId).val();
									if(value == '0'){
										$('#'+currUnitId).val("");
									}
								}
							}]
								}, formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 0}},
						{name : 'rate', label : 'Rate', index : 'rate', width:70, editable:true, edittype: 'text', 
								align:'right',
								editrules:{required:true,
								custom: true,
								custom_func : function (value, colname) {
									var isValid = validateFloatingNumber(value);
			            			if(!isValid) {
			            				return [false, "* Please enter valid decimal value"];
			            			} else {
			            				return [true,""];
			            			}
								}
							}, 
							editoptions:{size:20, maxlength:8,defaultValue:'0.00', dataEvents: [{
								type: 'change',
								fn: function(event) {
									var currRateId = this.id;
									var idPrefix = (currRateId.split("_")[0])+"_";
									if(idPrefix=="rate_")
										idPrefix = "";
									calculateChargeLineAmount(idPrefix);
								},
								type: 'focus',
								fn: function(event) {
									var currUnitId = this.id;
									var value = $('#'+currUnitId).val();
									if(value == '0.00'){
										$('#'+currUnitId).val("");
									}
								}
							}]
							}, formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2} },
						{name : 'rateBasis', align:'center', label : 'RB', index : 'rateBasis', width:48, editable:true, editrules:{required:true}, formatter:'rateBasisFormatter', title:false, edittype: "select",
							editoptions: {value:":Select;A:A-PER POUND;B:B-NO RATE-NO CHRG;C:C-PER 100 LBS;D:D-DIMENSIONAL WGT;E:E-EACH;F:F-CUBIC FEET;K:K-THOUSAND KILOS;L:L-LINEAR FOOT;M:M-MEASUREMENT TON;N:N-NO CHARGE;P:P-PERCENT;S:S-SHIPMENT;T:T-CUBIC METER;U:U-PER UNIT (PIECE);W:W-WEIGHT TON;X:X-DERIVED;Z:Z-MINIMUM;2:2-THOUSAND BOARD FT;3:3-LONG TON;4:4-LINEAR METER",
								defaultValue:'default',
								dataEvents: [{
								type: 'change',
								fn: function(event) {
									var currRateBasisId = this.id;
									var idPrefix = (currRateBasisId.split("_")[0])+"_";
									if(idPrefix=="rateBasis_")
										idPrefix = "";
									calculateChargeLineAmount(idPrefix);
								}
							}]
								} },
						{name : 'amount', align:'right', label : 'Amount', index : 'amount', width:100, /*editable:true, editrules:{}, editoptions:{size:1, readonly:true}, */formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2} },
						{name : 'effectiveDt', align:'center', label : 'Eff Date', index : 'effectiveDt', width:105, /*editable:true, editrules:{required:true}, editoptions:{size:10, readonly:true, defaultValue:'01-01-0001'},*/ sorttype:'date', datefmt:'mm-dd-YYYY'},
						{name : 'expirationDt', align:'center', label : 'Exp Date', index : 'expirationDt', width:100, /*editable:true, editrules:{required:true}, editoptions:{size:10, readonly:true, defaultValue:'12-31-9999'},*/ sorttype:'date', datefmt:'mm-dd-YYYY'},
						{name : 'generic', align:'center', label : 'Generic', index : 'generic', width:62 /*, editable:true, editrules:{required:true}, editoptions:{size:1, readonly:true, defaultValue:'Y'}*/},
						{name : 'passThru', align:'center', label : 'Pass thru', index : 'passThru', width:75 /*, editable:true, editoptions:{size:1, readonly:true, defaultValue:'N'}*/},
						{name : 'minWgt', label : 'Min WT/CB', align:'right', index : 'minWgt', width:90, /*editable:true, editoptions:{size:1, readonly:true},
							editrules:{required:false},*/ formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 0}},
						isEditableRow
						];
			
			jQuery.extend($.fn.fmatter,
					{
						descriptionFormatter : function(cellvalue, options, rowdata) {
							return "<div style='width:48px;' title='"+cellvalue+"'>"+cellvalue.split("-")[0]+"</div>";
						},
						rateBasisFormatter : function(cellvalue, options, rowdata) {
							var oSelect = options.colModel.editoptions.value;
							var so = oSelect.split(";");
							var retvalue = "";
							for(var i=0; i<so.length;i++){
								sv = so[i].split(":");
								if(sv[0].toString()==cellvalue)
								{
									retvalue = sv[1];
									break;
								}
							}
							return "<div style='width:50px;' title='"+retvalue+"'>"+cellvalue+"</div>";
						}
					});
			jQuery.extend($.fn.fmatter.descriptionFormatter , {
			    unformat : function(cellvalue, options, cell) {
			    return $('div', cell).attr('title');
			}
		});

			
			var jsonReaderCharge = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "chargeId"
			};

			createGrid("quoteChargeLineGrid", //grid Id
					"pagerQuoteChargeLineGrid", //pager Id
					'/gates/quote/charge/loadChargeLineGrid', // load URL
					'/gates/quote/charge/addChargesGrid', //Add URL
					'/gates/quote/charge/editChargesGrid', // Edit URL
					'/gates/quote/charge/deleteChargesGrid', // Delete URL
					'/gates/quote/charge/deleteSelectedCharge', // Multidelete URL
					colNamesForCharges, // Colnames
					colModelForCharges, //colmodel
					"Charge Line", //caption
					'auto', // height
					10, // rownum
					[ 10, 20, 30 ], // rowList
					true, //multiselect
					isDeletable, //multidelete
					false, //load one
					isAddable, // isReadOnly
					jsonReaderCharge, // json reader
					false, // hide edit
					false, // hide delete
					true, // autowidth
					true, // row numbers
					false, // hide custom add row
					false, // hide pager row
					null, // custom Edit method
					isChargeGridEdited, // custom grid complete
					quoteChargesGridLoadComplete, // custom load complete
					false, // default hidden
					true // row color based on status
					);
			
		});

var quoteChargesGridLoadComplete = function(){	
	//Issue: to clear the edited charge's ID from session so that in next delete call, it should not take this id by default.
	$("#quoteChargeLineGrid").resetSelection();
	checkEditKeys();
	refreshTotal();
	refreshDates();
	return true;
};

function checkEditKeys(){
	
	var rowIDs = jQuery("#quoteChargeLineGrid").getDataIDs(); 
	  for (var i=0;i<rowIDs.length;i=i+1){ 
	    var rowData=jQuery("#quoteChargeLineGrid").getRowData(rowIDs[i]);
	    var trElement = jQuery("#"+ rowIDs[i],jQuery('#quoteChargeLineGrid'));
	    if (rowData.passThru=='Y') {	
	    	 $( $($(trElement.children()).children()[3]).children()[0]).hide();
	    	 $( $($(trElement.children()).children()[3]).children()[1]).hide();
	        /*jQuery("#quoteChargeLineGrid").jqGrid('setRowData',rowIDs[i],'actions',{formatoptions:{hidden : true}});*/
	    }
	  }
}


function setQuoteChargeTabDetails(){
	var rowIDs = jQuery("#quoteChargeLineGrid").getDataIDs(); 
	var chargesDisplayText = "";
	for (var i=0;i<rowIDs.length;i=i+1)
    {
		var rowData=jQuery("#quoteChargeLineGrid").getRowData(rowIDs[i]);
		var quoteCharge = rowData.description.split("-")[0];
		quoteCharge = quoteCharge + "";
		if(chargesDisplayText=='')
			chargesDisplayText = quoteCharge;
		else
			chargesDisplayText = chargesDisplayText + ", "+quoteCharge;
    }
	if(chargesDisplayText!="")
		 chargesDisplayText = " - " + chargesDisplayText;
	setAccordianTabDetails('quoteChargesHeader',chargesDisplayText);
};

var isChargeGridEdited = function () {
	var numOfCharges = $("#quoteChargeLineGrid").getGridParam("reccount");
	var totalCharges = jQuery("tr", "#quoteChargeLineGrid").length - 1;
	if(_totalChargeGridCount == -1){
		_totalChargeGridCount = totalCharges;
	}
	else if(_totalChargeGridCount > totalCharges || totalCharges == 0){
		$('#statusCode').val("PEND");
		_totalChargeGridCount =  totalCharges;
		_chargeDeleted = true;
	}else{
		_totalChargeGridCount =  totalCharges;
	}
	
	if(_chargeGridCount==-1 ){
		_chargeGridCount = numOfCharges;
	}else if(_chargeGridCount > numOfCharges){
		_isQuoteChanged = true;
		_isChargeAttributeChanged = true;

	}
	_chargeGridCount = numOfCharges;
	
	setQuoteChargeTabDetails();
	
	return true;
};

function refreshTotal() {
	var url = "/gates/quote/getTotal";
	$.get(url, function(responseText) {		
		$('#quoteTotalVal').val(responseText);
		$('#quoteTotalValue').val(responseText);		
		$('#quoteTotal').val(responseText);
	});
	return true;
}

function refreshDates() {
	var url = "/gates/quote/refreshDates";
	$.get(url, function(response) {		
		$('#effectiveDate').val(response.effectiveDate);
		$('#expirationDate').val(response.expirationDate);
		$("#effectiveDateLabel").text(response.effDateLabel);
	});
	return true;
}

function quoteChargeLineGridUpdate(value, colname){
	_isQuoteChanged = true;
	_isChargeAttributeChanged = true;
	$('#statusCode').val("PEND");
	return [true,""];
}

function descriptionPopupSearch() {   
	var actionUrl = _context + 'cas/searchDescChargeQT.do';
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'Description', windowStyle);    
}

function calculateChargeLineAmount(idPrefix) {
	
}

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

function validateFloatingNumber(value) {
	var re = new RegExp(/^[\-\+]?(([0-9]+)([\.,]([0-9]+))?|([\.,]([0-9]+))?)$/);
	if (value<=0 || value > 99999.99) {
		return false;
	} else if (!re.test(value)) {
		return false;
	} else {
		return true;
	}
}

function autocomplete_element(value, options) {
	var $ac = $('<input type="text" size="44" onblur="validateCodeNDesc(this.id);"/>');
	$ac.val(value);
	// creating autocomplete
	/*var url = _context + '/cas/autocomplete.do?method=getSpecialService&searchType=222';*/
	$ac.gatesAutocomplete({
		/*source : url,*/
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
		 		 method: 'getSpecialService',
		 		 searchType: '222'
		 		 /*parentSearch:  function() { return $('input[name="shipper\\.organizationId"]').val() + '|02|'+$('#tradeCode').val(); }*/
	 	},
		formatItem : function(data) {
			return data.code + "-" + data.desc;
		},
		formatResult : function(data) {
			return data.code + "-" + data.desc;
		},
		select : function(data) {
			var idPrefix = (($ac.attr('id')).split("_")[0])+"_";
			if(idPrefix=="descriptionAndCode_")
				idPrefix = "";
			var specialServiceCodeId = "#"+idPrefix+"specialServiceCode";
			var descId = "#"+idPrefix+"desc";
			$(specialServiceCodeId).val(data.code);
			$(descId).val(data.desc);
		}
	});
	// returning element back to jqGrid
	return $ac;
}

var customLoadComplete=function(){
	$("#descriptionAndCode").css("width","210px");
	$("#descriptionAndCode").gatesPopUpSearch({
		func : function() {
			splSearchPopupSearch();
		}
	});
};

function specialSearchUpdate(id) {
	var values=id.split('|');
	id=id.replace('|','-');
	$("#specialServiceCode").val(values[0]);
	$("#desc").val(values[1]);
	$("#descriptionAndCode").val(id);
}

splSearchPopupSearch = function(elem) {
	var actionUrl = _context + '/cas/spclServLookup.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'SpecialSearch', windowStyle);
};

function autocomplete_value(elem, op, value) {
	if (op == "set") {
		$(elem).val(value);
	}
	return $(elem).val();
}
var disableCommodityGrid = false;
if(_readonlyCommodity){
	disableCommodityGrid = true;
}
	

function showServiceGrid() {
	var colNames = [ 'Id', 'code', 'desc', 'Description', 'Quantity', 'Actions' ];
	var colModel = [{name : 'serviceId', index : 'serviceId', editable : false, hidden : true},
	                {name : 'specialServiceCode', index : 'specialServiceCode', editable : true, hidden : true/*,  editrules : {edithidden:true }*/},
	                {name : 'desc', index : 'desc', editable : true, hidden : true/*, editrules : {edithidden:true }*/},
					{name : 'descriptionAndCode', index : 'descriptionAndCode', width : 300, editable : true, editrules : { required : true, custom:true,custom_func:quoteCmdtyServiceGridUpdate },
						edittype : 'custom',
						editoptions : {
								custom_element :  autocomplete_element,  
								custom_value   : autocomplete_value
							}
					},
					{name : 'specialServiceNumericCode', index : 'specialServiceNumericCode', width : 70, editable : true, edittype: 'text', editrules : {required : true, integer:true, minValue:1}, editoptions : {size : 20}, formatter : 'integer', sorttype:"int"},
					{name : 'actions', index : 'actions', width : 70, align : "center", editable : false, search : false, sortable : false, formatter : 'actions', formatoptions : {keys : true} }];

	var jsonReaderService = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "serviceId"
	};
	
	createGrid("specialServicesGrid", // grid id
			"specialServicesPager", // pager id
			'/gates/quote/commodity/loadSpecialServicesGrid',
			'/gates/quote/commodity/addSpecialServicesGrid',
			'/gates/quote/commodity/editSpecialServicesGrid',
			'/gates/quote/commodity/deleteSpecialServicesGrid',
			'/gates/quote/commodity/deleteSelectedSpecialServicesGrid',
			colNames, colModel, "Special Services", 70, 3, [3, 6, 9 ], 
			true, true, false, disableCommodityGrid, jsonReaderService, false, false, false, true, 
			false, false, false, false, customLoadComplete, false, true);
}

function quoteCmdtyServiceGridUpdate(value, colname) {
	_isCommodityChanged = true;
	return [true,""];
}

function validateCodeNDesc(id) {
	var idPrefix = (id.split("_")[0])+"_";
	if(idPrefix=="descriptionAndCode_") {
		idPrefix = "";
	}
	var specialServiceCodeId = "#" + idPrefix + "specialServiceCode";
	var descId = "#" + idPrefix + "desc";
	var descriptionAndCodeId = "#" + id;
	
	if($(specialServiceCodeId).val()=='' || $(descId).val()=='') {
		$(descriptionAndCodeId).val('');
		$(specialServiceCodeId).val('');
		$(descId).val('');
	} else if(($(specialServiceCodeId).val()+"-"+$(descId).val())!=$(descriptionAndCodeId).val()) {
		$(descriptionAndCodeId).val('');
		$(specialServiceCodeId).val('');
		$(descId).val('');
	}
}

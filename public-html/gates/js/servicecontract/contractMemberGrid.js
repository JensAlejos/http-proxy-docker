$(document).ready(function () {
	var _isGridReadOnly=true;
	if($('#isGridReadOnly').val()=="false")
	{
		_isGridReadOnly=false;
	}
	else
	{
		_isGridReadOnly=true;
	}
	if(!_has_perm_add)
	{
		_isGridReadOnly=true;
	}
	var colNamesForMembers = ['Id','Affiliated Member','Organization Id', 'Date Added', 'Action'];
	var colModelForMembers = [
	                          	{name:'id',index:'id', width:55, editable:true, hidden:true},
	                          	{name:'memberOrgName',index:'memberOrgName', width:75, editable:true, editrules:{required:true}, 
	                          		'edittype'    : 'custom',
	                          		'editoptions' : {
											size:30,
											'custom_element' :  autocomplete_element,  
											'custom_value'   : autocomplete_value , 
											

										}  
	                          	},
	                          	{name:'memberOrgId',index:'memberOrgId', width:75,edittype:'text',editable:true,editrules:{editHidden:true},editoptions:{size:10,readonly:true},hidden:false},
	                          	{name:'effectiveDate',index:'effectiveDate', width:75,edittype:'text', editable:true, editoptions:{size:12,readonly:true,defaultValue:setFormattedDate},editrules:{required:true}},
	                          	{name:'actions', index:'actions', width:15, align:"center", editable:false, search:false, sortable:false,formatter:'actions',  formatoptions:{keys:true}}

	                          	];
	
	var defaultJsonReader = {
	        root: "rows",
	        page: "page",
	        total: "total",
	        records: "records",
	        repeatitems: false,
	        cell: "cell",
	        id: "id"
	    };
	
	createGrid(
			"gridIdForMembers", // grid id for Members
			"pagerIdForMembers", // page id for Members
			'/gates/serviceContract/member/getContractMembers', 
			'/gates/serviceContract/member/addMember', 
			'/gates/serviceContract/member/editMember', 
			'/gates/serviceContract/member/deleteMembers', 
			'/gates/serviceContract/member/multipleDeleteMembers',
			colNamesForMembers, 
			colModelForMembers, 
			"Affiliated Members",100
			,10 ,[10,20,30] ,
			!_readonly && _has_perm_deleteall, /* multiselect */
			!_readonly && _has_perm_deleteall, /* multidelete */
			true, /* loadOnce */
			_isGridReadOnly, /* readOnlyGrid */
			defaultJsonReader, /* jsonReader */
			true, /* hideEdit */
			!_has_perm_delete, /* hideDelete */
			true, /* autowidth */
			true, /* rownumbers */
			!_has_perm_add /* hideCustomAddRow */
	);


});

/**************************************************************************/	
	function autocomplete_element(value, options) {
		  // creating input element
		  var $ac = $('<input type="text" onblur="checkBlur(this.value);"/>');
		  // setting value to the one passed from jqGrid
		  $ac.val(value);
		  // creating autocomplete
		 var url = _context+'/cas/autocomplete.do?method=searchOrganization&searchType=4';
		  $ac.gatesAutocomplete({
				source: url,
				mustMatch: true,
				formatItem: function(data) {
					var orgStatus = 'InActive';
					if(data.active=='Y'){
						orgStatus='Active';
					}
					return data.name + "-" + orgStatus;
				},
				formatResult: function(data) {
					return data.name ;//+ "-" + data.code;
				},
				select: function(data) {
					//$('#parentOrganizationId').val(data.id);
					//$('#parentOrganizationName').val(data.name);
					$('input#memberOrgId').val(data.id);
					//$('input#createDate').val(setFormattedDate());
					$('input#createDate').attr('disabled',true);
				}
			});
		  
		  // returning element back to jqGrid
		  return $ac;
		}
	
	function checkBlur(val){
		if(val==''){
			$('input#memberOrgId').val('');
		}
	}
		function autocomplete_value(elem, op, value) {
		  if (op == "set") {
		    $(elem).val(value);
		  }
		  return $(elem).val();
		}

/**************************************************************************/
	//Date formatter
		function setFormattedDate(){
			var todaysDate = new Date();
			var day = todaysDate.getDate();
			if(eval(day<10)){
				day = '0'+day;
			}
			var month = eval(eval(todaysDate.getMonth())+eval(1));
			if(eval(month<10)){
				month = '0'+month;
			}
			var year = todaysDate.getFullYear();
			return month+"-"+day+"-"+year;
		}
		

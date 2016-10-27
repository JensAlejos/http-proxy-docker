function ValidateDate(){ 
	
	var str1 = document.getElementById("expirationDate").value; 
	var str2 = document.getElementById("effectiveDate").value; 
	var mon1  = parseInt(str1.substring(0,2),10);  
	var dt1 = parseInt(str1.substring(3,5),10);  
	var yr1  = parseInt(str1.substring(6,10),10);  
	var mon2  = parseInt(str2.substring(0,2),10);  
	var dt2 = parseInt(str2.substring(3,5),10);  
	var yr2  = parseInt(str2.substring(6,10),10);  
	var endDate = new Date(yr1, mon1, dt1); 
	var startDate = new Date(yr2, mon2, dt2);
	if(endDate < startDate)  {
		
		//alert("Start date cannot be greater than End Date.Please re-enter the End Date.");  
		//document.getElementById("expirationDate").value = "";
		return "Start date cannot be greater than End Date.Please re-enter the End Date."; 
		}  
	} 

	$(function() {
		tabSequence('#serviceContractForm');
		$( "#effectiveDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
		$( "#expirationDate" ).datepicker({ dateFormat: 'mm-dd-yy' });
	});

$(document).ready(function () {
	
	var action = $( "#actionPerformed" ).val();
	//var organizationCopyId = document.serviceContractCopyForm.organizationId.value;
	if(action == "copy")
	{
		var ele = document.getElementById("copyTeriff");
		ele.style.display = "block";
		var ele1 = document.getElementById("jqgrid");
		ele1.style.display = "none";
	}
	else
	{
		var ele = document.getElementById("copyTeriff");
		ele.style.display = "none";
		var ele1 = document.getElementById("jqgrid");
		ele1.style.display = "block";
	}
	
	
	
	var colNamesForTariffs = ['ID','Internal Tariff #', 'Date Added', 'User Id', 'Action'];
	var colModelForTariffs = [
	                 {name:'id',index:'id', width:55, editable:true,hidden:true},
	                 {name:'internalServiceContractNbr',index:'internalServiceContractNbr', width:75, editable:true, editrules:{required:true},
	                	'classes'	  : 'toUpperCaseInGrid', 
                   		'edittype'    : 'custom',
                  		'editoptions' : {
								size:10,
								'custom_element' :  autocomplete_element,  
								'custom_value'   : autocomplete_value  
								

							}  
                  	},
                  	{name:'createDateInString',index:'createDateInString', width:75,edittype:'text', editable:true, editoptions:{defaultValue:setFormattedDate,readonly:true}, editrules:{required:true}},
			   		{name:'createUser',index:'createUser', width:75, edittype:'text', editable:true, editoptions:{defaultValue:setUser,readonly:true}, editrules:{required:true}},
			   		{name:'actions', index:'actions', width:25, align:"center", formatter:'actions', formatoptions:{keys:true}}
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
			"gridIdForTariffs", // grid id for tariffs
			"pagerIdForTariffs", // page id for tariffs
			'/gates/serviceContract/getTariffs', 
			'/gates/serviceContract/addTariff', 
			'/gates/serviceContract/editTariff', 
			'/gates/serviceContract/deleteTariff', 
			'/gates/serviceContract/multipleDeleteTariff',
			colNamesForTariffs, 
			colModelForTariffs, 
			"Internal Tariffs Numbers",100
			,10 ,[10,20,30] ,
			!_readonly, /* multiselect */
			!_readonly, /* multidelete */
			true,
			_readonly,
			null, /* jsonReader */
			_readonly, /* hideEdit */
			_readonly /* hideDelete */			
		);

});
/**************************************************************************/	
function autocomplete_element(value, options) {
	  // creating input element
	  var $ac = $('<input type="text"/>');
	  // setting value to the one passed from jqGrid
	  $ac.val(value);
	  // creating autocomplete
	 var url = _context+'/cas/autocomplete.do?method=searchGroupNameForServiceContract&searchType=10';
	  $ac.gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.name;
			},
			formatResult: function(data) {
				return data.name;
			},
			select: function(data) {
				//$('#parentOrganizationId').val(data.id);
				//$('#parentOrganizationName').val(data.name);
				//alert(data.id);
				$('input#internalServiceContractNbr').val(data.name);
				//$('input#createDateInString').val(setFormattedDate());
				$('input#createDateInString').attr('disabled',true);
				//$('input#createUser').val(setUser());
				$('input#createUser').attr('disabled',true);
				//alert($('input#internalServiceContractNbr').val());
				
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
		
		function setUser()
		{
			//alert($( "#createUserForTariff" ).val());
			return $( "#createUserForTariff" ).val();
		}
/**************************************************************************/
		window.onload=function(){
			$('#expirationDate').change(function(){
					$('#internalServiceContractNbr').focus();
				});
			};

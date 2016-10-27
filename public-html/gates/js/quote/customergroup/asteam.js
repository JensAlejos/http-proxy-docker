$(document).ready(function() {
	
  enforceSecurityDivAndButtons("save", !_readonly);
	
  $('#exit').click(function(){
	  document.location.href =_context+'/';
  });
  
  if(!_readonly)
  {
	  $('#save').click(function(){
		  $('#acctSpecialistTeamListForm').attr("action","createUpdate");
		  $("#acctSpecialistTeamListForm").submit();
	  });
  }
  
  function autocomplete_el(value, options) {
		var $ac = $('<input type="text"/>');
		$ac.val(value);
		var accSpId = "";
		//commented for Defect D026297
		/*$(":focus").each(function() {
			accSpId = ($(this).attr("id")).trim();
		}); */
		var url = _context+'/cas/autocomplete.do?method=getCustGrp&searchType=269';	//&parentSearch=ASTEAM|'+accSpId;
		$ac.gatesAutocomplete({
			source : url,
			mustMatch:true,
			extraParams: {
				parentSearch:function(){return 'ASTEAM|'+accSpId }
			},
			formatItem : function(data) {
				return data.label;
			},
			formatResult : function(data) {
				return data.label;
			},
			select : function(data) {
				$('#defaultCustomerGroupId').val(data.value);				
				//$('#defaultCustomerGroupName').val(data.label); //todo: set the customer group id. 
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

	 function checkForMinValue(value, colname) {
		 if (value.length!=10){
		   return [false,'Please enter a valid 10 digit number'];	
		} else  
		{	
	    	return [true,""];
		}
	} 
	function checkForEmail(value, colname) {
		if(/@/i.test(value)){
			var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
			if(filter.test(value)==false)
			{
			   return [filter.test(value),'Please enter a valid email address'];	
			} 
			else 
			{	
		    	return [true,""];
			}
		}
		else 
		{	
	    	return [true,""];
		}	
	} 
	
	$(function() {

			var colNames = ['Id','Team Id', 'Team Code','Team Name','Phone','Fax','Email Address','Customer Group Id','Customer Group',''];
			var colModel=[						
						{name:'id',index:'id', width:1,key:true,editable:false,
							editoptions:{readonly:true,size:10},hidden:true},
						{name:'acctSpecialistTeamId',index:'acctSpecialistTeamId',editable:true,
							hidden:true},
						{name:'acctSpecialistTeamCode',index:'acctSpecialistTeamCode', width:50,editable:true, 
							editrules:{required:true}, editoptions:{size:20,maxlength:8}
							,searchoptions:{ignoreCase:true}},
						{name:'acctSpecialistTeamName',index:'acctSpecialistTeamName', width:90,editable:true, 
							editrules:{required:true}, editoptions:{size:20,maxlength:30}},
						{name:'phoneNumber',index:'phoneNumber', width:60,editable:true, 
							editrules:{required:true,number:true,custom:true,custom_func:checkForMinValue}, editoptions:{size:20,maxlength:10}},
						{name:'faxNumber',index:'faxNumber', width:60,editable:true, 
							editrules:{required:true,number:true,custom:true,custom_func:checkForMinValue}, editoptions:{size:20,maxlength:10}},
						{name:'emailAddress',index:'emailAddress', width:90,editable:true, 
							editrules:{required:false,custom:true,custom_func:checkForEmail}, editoptions:{size:20,maxlength:50}},
						{name:'defaultCustomerGroupId',index:'defaultCustomerGroupId', width:1,editable:true,
							hidden:true},
						{name:'defaultCustomerGroupName',index:'defaultCustomerGroupName', width:80,
							editable:true, editrules:{required: false},
							edittype:"custom", 
							editoptions:{ 
								custom_element :  autocomplete_el,  
								custom_value   : autocomplete_value
						}},
						{name:'actions', index:'actions', width:30, align:"center", 
									formatter:'actions', formatoptions:{keys:true}, search:false}
				   	 ];
	
			createGrid(
					"asTeamGrid", 
					"asTeamPager", 
					'loadgrid.html', 
					'addgridrow.html', 
					'editgridrow.html', 
					'deletegridrow.html', 
					'deletegridrow.html',
					colNames, 
					colModel, 
					"A.S. Team", 
					'auto',
					20,
					[20,40,60] ,
					false, /* multiselect */
					false, /* multidelete */
					true,
					_readonly,
					false, /* jsonReader */
					_readonly, /* hideEdit */
					_readonly, /* hideDelete */
					true, /*autowidth*/
					true, /*rownumbers*/
					false, /*hideCustomAddRow*/
					false, /*hidePagerRow*/
					null, /*customEditMethod*/
					null, /*customGridComplete*/
					null,
					null,
					null,
					null,
					null,
					true);
			//$("#asTeamGrid").jqGrid('filterToolbar',{stringResult: true, searchOnEnter: false, defaultSearch: 'cn',ignoreCase: true});
			/*$("#asTeamGrid").jqGrid('navGrid','#asTeamPager',
			          {edit:false, add:false, del:false, search:true, refresh:false});*/
	});
  
  
}); 

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}


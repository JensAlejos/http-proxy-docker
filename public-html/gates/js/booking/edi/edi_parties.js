var isFirstTime = "Y";
var havePartiesChanged = false;
var selectedRowId = '';

$(function() {
	
		if(_isPartiesDisplay)
		{
		  $("#partiesButton").click(function(){
				$( "#partiesDialog" ).dialog( "option", "title", 'PARTIES' );
				$("#partiesDialog").dialog('open'); 
			} ); 
		}
	    
	    $( "#partiesDialog" ).dialog({ autoOpen: false , width: 979, modal: true
	        , buttons: {
	            'Exit': function(){
	            	if(havePartiesChanged)
	            	{
	            		var change = '';
	            		if($('#isAcceptHddn').val()=='Y')
	            			change = "undo Accept";
	            		else
	            			change = "Accept";
	            		var r = confirm("Arol Id or one-time customer has changed. Do you want to exit without saving those changes? To save the changes press Cancel and then click "+change);
	            		if(r)
	            		{
	            			havePartiesChanged = false;
	            			$(this).dialog("close");
	            		}
	            		else
	            			return;
	            	}
	            	else
	            		$(this).dialog("close");
	            }
            },
            open:function()
            {
            	isFirstTime = "Y";
            	clearPartiesForm();
            	$('#partiesDiv').hide();
            	createPartiesGrid();
            	$('#partiesStatusCode').text($('#statusCode').text());
            	if(_isAcceptAllPresent)
            		$('#acceptAll').attr("disabled", $('#mainAcceptAll').attr("disabled"));
            },
            close:function()
            {
            	$('#partiesGrid').jqGrid('GridUnload');
            	isFirstTime = "Y";
            	havePartiesChanged = false;
            	selectedRowId = '';
            	$('#partiesMsgDiv').html('');
            	$('#statusCode').text($('#partiesStatusCode').text());
            	if(_isAcceptAllPresent)
            		$('#mainAcceptAll').attr("disabled", $('#acceptAll').attr("disabled"));
            	$("#ediPartiesGrid").trigger("reloadGrid");
            	$("#ediProblemLogGrid").trigger("reloadGrid");
            }
        });
	    
	   if( _isAcceptAllPresent)
	   {
		    $('#acceptAll').click(function()
			{
		    	changePartyStatusFunction(0, 1);
			});
	   
		    $('#mainAcceptAll').click(function()
			{
		    	changePartyStatusFunction(0, 0);
			});
	    }
});

function createPartiesGrid()
{
	var colNames = ['Id','Accept','Party','Template','EDI','Action'];
	
	var colModel = [
	                {name:'partySeqNo', hidden:true},
	                {name:'isAccept', hidden:true},
			    	{name:'partyDesc',index:'partyDesc', width:150, 
			    		formatter : 'editFormatter'
					},
			    	{name:'template',index:'template', width:295},
			    	{name:'edi',index:'edi', width:295},
			    	{name:'link', sortable:false, width:150, align : 'center',
			    		formatter:'enableDisableFormatter'
			    	},
	               ];
	
	jQuery.extend($.fn.fmatter,
			{
				editFormatter : function(cellvalue, options, rowdata) {
					
					return "<a id='link_" + rowdata.partySeqNo + "' href='#' onclick='javascript:showRowEdit("
					+ rowdata.partySeqNo + ");' style='color:#000000;' >"+cellvalue+"</a>";
					
				},
				enableDisableFormatter : function(cellvalue, options, rowdata) {
					if(cellvalue!=null)
					{
						if($('#isShowLink').val()=='Y' && _isPartiesUpdate)
							return "<a href='javascript:changePartyStatus("
								+ rowdata.partySeqNo + ");' style='color:black; font-weight:bold;' >"+cellvalue+"</a>";
						else
							return "<div style='color:grey; text-decoration:underline; font-weight:normal;' >"+cellvalue+"</div>";
					}
					else
						return "";
					/*"<button class='undoAccept buttonNoFloat' type='button' onclick='changePartyStatus("
					+ rowdata.partySeqNo + ", false);' >Undo Accept</button>";*/
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

		createGrid("partiesGrid", // grid id for party
		"partiesPager", // page id for party
		_context+'/booking/edi/parties/loadParties', // geturl
		'', // addurl
		'', // edit url
		'',
		'',// delete selected URL
		colNames, colModel, "Parties",// caption
		138,// height
		6,// row num
		[ 6, 12, 18 ],// row list
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
		partiesGridComplete,// custom grid complete
		null,// custom load complete
		false,// default hidden
		true);// row color based on status
		
		$("#partiesGrid").jqGrid('setGridParam',{
			beforeSelectRow :function(rowId)
			{
				if(rowId!=selectedRowId)
				{
					if(havePartiesChanged)
					{
						var change = '';
	            		if($('#isAcceptHddn').val()=='Y')
	            			change = "undo Accept";
	            		else
	            			change = "Accept";
	            		var r = confirm("Arol Id or one-time customer has changed. Do you want to exit without saving those changes? To save the changes press Cancel and then click "+change);
						if(r)
						{
							$('#partiesDiv').hide();
							selectedRowId = rowId;
							havePartiesChanged = false;
							$('#partiesMsgDiv').html('');
							return true;
						}
						else
							return false;
					}
					else
					{
						havePartiesChanged = false;
						$('#partiesDiv').hide();
						$("#partiesGrid").resetSelection();
						selectedRowId = rowId;
						$('#partiesMsgDiv').html('');
						return true;
					}
				}
				else
					return true;
			}
		});
		
		/*$("#partiesGrid").jqGrid('setGridParam',{
			onSelectRow:function(rowId)
			{
				showRowEdit(rowId);
			}
		});*/
}

var partiesGridComplete = function()
{
	 $('#gbox_partiesGrid .ui-pg-input').attr("readonly", true);
	 
	 var rowIDs = jQuery("#partiesGrid").getDataIDs();
	 /*for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var rowData=jQuery("#partiesGrid").getRowData(rowIDs[i]);
       if (rowData.isAccept=='Y')
       {
    	   $("div.accept", "#gbox_partiesGrid #"+rowIDs[i]).attr("disabled", true);
    	   $("div.undoAccept", "#gbox_partiesGrid #"+rowIDs[i]).attr("disabled", false);
       }
       else
	   {
    	   $("div.accept", "#gbox_partiesGrid #"+rowIDs[i]).attr("disabled", false);
    	   $("div.undoAccept", "#gbox_partiesGrid #"+rowIDs[i]).attr("disabled", true);
	   }
     }*/
	 
	 if(isFirstTime == "Y" && $("#partiesGrid").getGridParam("reccount")>0)
	 {
		 $('#gbox_partiesGrid #link_'+rowIDs[0]).trigger('click');
		 isFirstTime = "N";
		 selectedRowId = rowIDs[0];
	 }
	 
	 $('#pg_partiesPager .ui-pg-button.ui-corner-all').click(function()
     {
    	if(!$(this).hasClass('ui-state-disabled'))
    		pagerClickFunction();
     });
	 
	 $('#pg_partiesPager .ui-pg-selbox').change(function()
     {
    		pagerClickFunction();
     });
};

function showRowEdit(rowId)
{
	if(havePartiesChanged)
	{
		var change = '';
		if($('#isAcceptHddn').val()=='Y')
			change = "undo Accept";
		else
			change = "Accept";
		var r = confirm("Arol Id or one-time customer has changed. Do you want to exit without saving those changes? To save the changes press Cancel and then click "+change);
		if(r)
		{
			havePartiesChanged = false;
			showEditFunction(rowId);
		}
		else
			return;
	}
	else
		showEditFunction(rowId);
}

function showEditFunction(rowId)
{
	selectedRowId = rowId;
	jQuery("#partiesGrid").setSelection(rowId, true); 
	clearPartiesForm();
	$.ajax({
		url : _context +"/booking/edi/parties/editPartyDetails",
		data : {partySeqNo:rowId},
		success : function(responseText) {
			showResponseMessages("partiesMsgDiv", responseText);
			if(responseText.success)
			{
				$('#ediShmtNameAddressForm').loadJSON(responseText.data);
				$('#orgNameHddn').val(responseText.data.orgName);
				$('#isAcceptHddn').val(responseText.data.isAccept);
				$('#templateArolHddn').val(responseText.data.templateAroleId);
				
				//console.log('arol='+responseText.data.addressRoleId);
				
				if(responseText.data.addressRoleId==0 ||  responseText.data.addressRoleId=='0' || responseText.data.addressRoleId==null) {
					$('#addressRoleId').val('');
					$('#address').val('');
				}
				
				if($('#shipmentPartyTypeCode').val()=='03')
					displayDivConsignee();
				else
					displayDiv();
					
				if(responseText.data.templateNumber==null || responseText.data.templateNumber=='')
            		$('#partiesMsgDiv').html('<div class="message_info">Booking Template not Found</div>');
					
				if(responseText.data.isTemplateCustomized=="Y")
					$('#isTemplateCustomized').css('color','green');
				else
					$('#isTemplateCustomized').css('color','black');
				
				if(responseText.data.templateOrderBl=='Y')
					$('#templateOrderBl').css('color','red');
				else
					$('#templateOrderBl').css('color','black');
				
				if($('#templateArolHddn').val()!='' && $('#addressRoleId').val()!='' 
					&& $('#templateArolHddn').val()!=$('#addressRoleId').val())
				{
					$('#templateNameAndAddress').css('color','red');
					$('#ediNameAndAddress').css('color','red');
				}
				else
				{
					$('#templateNameAndAddress').css('color','black');
					$('#ediNameAndAddress').css('color','black');
				}
				
				bindSearchOperations();
			}
		}
	});
}

function displayDivConsignee()
{
  $('#partiesDiv').show();
  $('#orderBlDiv').show();
}

function displayDiv()
{
	$('#partiesDiv').show();
	$('#orderBlDiv').hide();
}

function changePartyStatus(rowId)
{
	if(havePartiesChanged)
	{
		if(rowId!=selectedRowId && selectedRowId!='')
		{
			var change = '';
			if($('#isAcceptHddn').val()=='Y')
				change = "undo Accept";
			else
				change = "Accept";
			var r = confirm("Arol Id or one-time customer has changed. Do you want to exit without saving those changes? To save the changes press Cancel and then click "+change);
			if(r)
			{
				return;
			}
			else
			{
				havePartiesChanged = false;
				selectedRowId ='';
				$('#partiesDiv').hide();
				$("#partiesGrid").resetSelection();
				$('#partiesMsgDiv').html('');
				changePartyStatusFunction(rowId, 1);
			}
		}
		else
		{
			var oneTimer = '';
			if($('#isOneTimer').attr("checked"))
				oneTimer = "Y";
			else
				oneTimer = "N";
			
			$.ajax({
				url : _context +"/booking/edi/parties/savePartyDetails",
				data : {
					partySeqNo:rowId, 
					oneTimer: oneTimer,
					arolId: $('#addressRoleId').val(),
					orgId: $('#orgId').val(),
					orgName: $('#orgName').val(),
					address: $('#address').val()
					},
				success : function(responseText) {
					changePartyStatusFunction(rowId, 1);
				}
			});
		}
	}
	else
		changePartyStatusFunction(rowId, 1);
}

function changePartyStatusFunction(rowId, callingParty)
{
	var statusCode = '';
	if(callingParty==0)
		statusCode = $('#statusCode').text();
	else
		statusCode = $('#partiesStatusCode').text();
	
	$.ajax({
		url : _context +"/booking/edi/parties/changePartyStatus",
		data : {
			partySeqNo:rowId, 
			ediShipReqId: $('#ediShmtRequestId').val(),
			statusCode: statusCode 
			},
		success : function(responseText) {
			showResponseMessages("partiesMsgDiv", responseText);
			if(responseText.success)
			{
				var newStatusCode = responseText.data.split(",")[0];
				var isAccepted = responseText.data.split(",")[1];
				
				if(callingParty==0)
				{
					$('#statusCode').text();
					$("#ediPartiesGrid").trigger("reloadGrid");
					if(_isAcceptAllPresent && isAccepted=="Y")
						$('#mainAcceptAll').attr("disabled", true);
					else if(_isAcceptAllPresent && isAccepted=="N")
						$('#mainAcceptAll').attr("disabled", false);
				}
				else if(callingParty ==1)
				{
					$('#partiesStatusCode').text(responseText.data.split(",")[0]);
					havePartiesChanged = false;
					selectedRowId ='';
					$('#partiesDiv').hide();
					$("#partiesGrid").resetSelection();
					$('#partiesMsgDiv').html('');
					$("#partiesGrid").trigger("reloadGrid");
					if(_isAcceptAllPresent && isAccepted=="Y")
						$('#acceptAll').attr("disabled", true);
					else if(_isAcceptAllPresent && isAccepted=="N")
						$('#acceptAll').attr("disabled", false);
				}
				$("#ediProblemLogGrid").trigger("reloadGrid");
			}
		}
	});
}

function bindSearchOperations(){
	
	if($('#isShowLink').val()=='Y' && $('#isAcceptHddn').val()!='' && $('#isAcceptHddn').val()!='Y' && _isPartiesUpdate)
	{
		$('#orgName').attr("disabled", false);
		$('#isOneTimer').attr("disabled", false);
		$('#address').attr("disabled", false);
		 
	    $('#orgName').gatesAutocomplete({
	    	source:_context+'/cas/autocomplete.do',
	    	name: 'Customer Name',
		 	extraParams: {
 		 		 method: 'searchOrg',
 		 		 searchType: '229',
 		 		parentSearch:  function() { return "BK"; }
		 	},
			formatItem : function(data) {
				return data.abbr + "-" + data.name;
			},
			formatResult : function(data) {
				return data.abbr + "-" + data.name;
			},
			select : function(data) {
				/*$('#orgName').val(data.abbr);*/
				$('#orgNameHddn').val(data.abbr + "-" + data.name);
				console.log($('#orgNameHddn').val());
				$('#orgId').val(data.id);
				$("#addressRoleId").val("");
				havePartiesChanged = true;
			}
		});
	}
    else
    {
    	 $('#orgName').attr("disabled", true);
    	 $('#isOneTimer').attr("disabled", true);
    	 $('#address').attr("disabled", true);
    }
    
	
	// Parties Pop-Up Search
	$('input[name="orgName"]').gatesPopUpSearch({
		func : function() {
			partiesPopupSearch();
		}
	});
	
    $('#address').gatesPopUpSearch({
		func : function() {
			addressPopupSearch();
		}
	});
    
	$('#isOneTimer').change(function(){
			
			if($('#isShowLink').val()=='Y' && $('#isAcceptHddn').val()!='')
			{
				havePartiesChanged = true;
				if($('#isOneTimer').attr("checked")==true)
				{
					$('#orgName').val('');
					//$('#orgName').attr("readonly", true);
					$('#orgNameHddn').val('');
					$('#addressRoleId').val('');
					$('#address').val('');
					$('#orgId').val('');
				}
				else
				{
					//$('#orgName').attr("readonly", false);
				}
				
				if($('#isAcceptHddn').val()=='Y' && !$('#isOneTimer').attr("checked"))
					changePartyStatus(selectedRowId);
				else if($('#isAcceptHddn').val()=='N' && $('#isOneTimer').attr("checked"))
					changePartyStatus(selectedRowId);
			}
			else
			{
				if($('#isOneTimer').attr("checked"))
					$('#isOneTimer').attr("checked", false);
				else
					$('#isOneTimer').attr("checked", true);
			}
		});

	$('#orgName').change(function(){
		if($('#orgName').val()!=$('#orgNameHddn').val())
			{
				$('#orgName').val('');
				$('#orgNameHddn').val('');
				$('#orgId').val('');
				$('#addressRoleId').val('');
				$('#address').val('');
				havePartiesChanged = true;
				if($('#isAcceptHddn').val()=='Y')
					changePartyStatus(selectedRowId);
				
			}
		});
}

function orgSearchUpdate(id) {
		var values = id.split("|");
		$('input[name="orgName"]').val(values[0]+"-"+values[1]);
		$('input[name="orgNameHddn"]').val(values[0]+"-"+values[1]);
		$('input[name="orgId"]').val(values[2]);
		$('#addressRoleId').val('');
		$('#address').val('');
		addressPopupSearch();
		
		
}
		
function partiesPopupSearch() {
	orgCaller = 'parties';
	var partiesName = $('input[name="orgName"]').val();
	var splitpartiesName = "";
	var actionUrl = "";
	if (partiesName.indexOf("-") > 0) {
		splitpartiesName = partiesName.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+ encodeURIComponent(splitpartiesName[0]) +'|'
		+ $('#tradeCode').val() + '|BK|||'+encodeURIComponent(splitpartiesName[1]);
	} else {
		splitpartiesName = partiesName;
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='
				+ encodeURIComponent(partiesName) + '|'+$('#tradeCode').val() + '|BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function addressPopupSearch() {
	if(_isPartiesUpdate)
	{
		if($('#isShowLink').val()=='Y' && $('#isAcceptHddn').val()!=''/* && !$('#isOneTimer').attr("checked")*/)
		{
			if($.trim($('#orgId').val())!='')
			{
				var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
				+ encodeURIComponent($('#orgId').val());
				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'AddressSearch', windowStyle);
			}
			else
				alert("Please select organization first");
		}
	}
}

function addroleUpdate(data)
{
	var values = data.split("|");
	$('#addressRoleId').val(values[9]);
	$('#address').val(values[7]);
	
	havePartiesChanged = true;
	
	$('#isOneTimer').attr("checked", false);
	
	if($('#templateAroleId').val()!='' && $('#addressRoleId').val()!='' 
		&& $('#templateAroleId').val()!=$('#addressRoleId').val())
	{
		$('#templateNameAndAddress').css('color','red');
		//$('#ediNameAndAddress').css('color','red');
	}
	else
	{
		$('#templateNameAndAddress').css('color','black');
		//$('#ediNameAndAddress').css('color','black');
	}
	
	if($('#isAcceptHddn').val()=='N')
		changePartyStatus(selectedRowId);
}
  	
function clearPartiesForm()
{
	$("#ediShmtNameAddressForm").clearForm();
	
	//Setting hidden variables to blank
	$('#partySeqNo').val('');
	$('#shipmentPartyTypeCode').val('');
	$('#isAcceptHddn').val('');
	$('#orgNameHddn').val('');
	$('#orgId').val('');
	$('#templateArolHddn').val('');
	
	havePartiesChanged = false;
	//$('#orgName').attr("readonly", false);
	
	//Setting display fields to blank
	$('#templateNumber').html('');
	$('#isTemplateCustomized').html('');
	$('#templateOrderBl').html('');
	$('#templateLastUpdateDate').html('');
	$('#templateLastUpdateTime').html('');
	$('#templateLastUpdateUser').html('');
	$('#templateOrgAbbr').html('');
	$('#templateAroleId').html('');
	$('#isAccept').html('');
	$('#lastUpdateDate').html('');
	$('#lastUpdateTime').html('');
	$('#lastUpdateUser').html('');
}	

function pagerClickFunction()
{
	havePartiesChanged = false;
	selectedRowId ='';
	$('#partiesDiv').hide();
	$('#partiesMsgDiv').html('');
}
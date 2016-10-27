/*var currContactRowId;*/
var firstLoad = "Y";
var methodCode="00";
var digits = "0123456789";
//non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
//characters which are allowed in international phone numbers
//(a leading + is OK)
var validWorldPhoneChars = phoneNumberDelimiters + "+";
//Minimum no of digits in an international phone no.
var minDigitsInIPhoneNumber = 10;

$(document).ready(function() {
	isRemovable=true;
	isEditable="showlink";
	link =  'addToGrid';
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "id"
	};
	//change for D019984
	var colNames = ['Id','isSelected','Document Id','Contact Id', 'Phone Contact Id','Customer Id','Customer','Contact Name <span class="mandatory">*</span>',
	                'Primary Method <span class="mandatory">*</span>','CP','Email/Fax <span class="mandatory">*</span>',''];
	var colModel=[						
				{name:'id',index:'id', width:1,key:true,hidden:true},
				{name:'isSelected',index:'isSelected',hidden:true},
				{name:'documentContactId',index:'documentContactId',hidden:true},
				{name:'orgnContactId',index:'orgnContactId',hidden:true},
				{name:'orgnContactPhoneId',index:'orgnContactPhoneId',hidden:true},
				{name:'organizationId',index:'organizationId',hidden:true},
				{name:'organizationName',index:'organizationName', width:80,editable:true,
						/*editrules:{required:true},*/ editoptions:{size:80,maxlength:50}},
				{name:'orgnContactName',index:'orgnContactName', width:80,editable:true,
					editrules:{required:true}, editoptions:{size:120,maxlength:65}},
				{name:'communicationMethodCode',index:'communicationMethodCode', width:70, editable:true,
						editrules:{required: true,custom:true,custom_func:checkForDefaultValue},
						edittype:"select",formatter:'select', 
						editoptions:{/*dataUrl:_context+'/booking/senddocument/communicationMethodRefData',*/
							/*value:"<c:out value='${communicationMethodRefData}' escapeXml='false'/>",*/
							value:{'0':'Please Select', '1':'Primary Email', '2':'Alternate Email', '3':'Fax'},
							defaultValue:'0',
							 dataEvents :[{ type: 'change', fn: function(e) {
										//var typeCodeSelected = $("#typeCode").val();
										var typeCodeSelected = e.target.value;
										methodCode=typeCodeSelected;
										var idPrefix = $(this).attr('id').split("communicationMethodCode")[0];
										if(typeCodeSelected != 0)
											$('#'+idPrefix+'fromCPGrid').val('N');
										$('#'+idPrefix+'valueGrid').val('');
										if(typeCodeSelected==3)
										{
											$("#"+idPrefix+"valueGrid").attr('maxlength','20');
											alert("Please enter full phone number starting with country code and include dashes");
										}
										else
										{
											$("#"+idPrefix+"valueGrid").attr('maxlength','50');
										}
									}//end fun 
								} // end type
							] // dataevents 
					}
				},
				{name:'fromCPGrid',index:'fromCPGrid', width:20,editable:true, 
					/* editrules:{required:true}, */ editoptions:{readonly:true,size:10}},
				{name:'valueGrid',index:'valueGrid', width:60,editable:true, 
					editrules:{required:true,custom:true,custom_func:checkForMethodValue},
					editoptions:{size:20,maxlength:50}, formatter : function(cellvalue, options, rowdata){
						return $.trim(cellvalue);
					}
				},
				{name:'actions', index:'actions', width:30, align:"center", formatter:'actions', 
						formatoptions:{
							keys:true,
							editbutton: _isContactUpdate,
							delbutton: _isContactDelete,
							editformbutton: false/*,
							onEdit : function(rowId)
							{
								currContactRowId = rowId.toString();
								return true;
							},
							onSuccess: function()
							{
								var rowData=jQuery("#contactGrid").getRowData(currContactRowId);
								 if(rowData.isSelected==true || rowData.isSelected=='true')
									 jQuery("#contactGrid").jqGrid('setSelection',currContactRowId);
								 else
									 jQuery("#contactGrid").jqGrid('resetSelection',currContactRowId);
								return true;
							}, 
							onError: function()
							{
								var rowData=jQuery("#contactGrid").getRowData(currContactRowId);
								 if(rowData.isSelected==true || rowData.isSelected=='true')
									 jQuery("#contactGrid").jqGrid('setSelection',currContactRowId);
								 else
									 jQuery("#contactGrid").jqGrid('resetSelection',currContactRowId);
								return true;
							}*/
						}
					}
		];

		createGrid(
				"contactGrid", 
				"contactGridPager", 
				'loadgrid.html', 
				'addgridrow.html', 
				'editgridrow.html', 
				'deletegridrow.html', 
				'deletegridrow.html',
				colNames, 
				colModel, 
				"Contact Grid",150
				,10 ,[10,20,30] ,
				true, /* multiselect */
				false, /* multidelete */
				false,
				!_isContactAdd,
				jsonReader, /* jsonReader */
				!_isContactUpdate, /* hideEdit */
				!_isContactDelete, /* hideDelete */
				true, 
				true, 
				false, 
				false, 
				customEditMethod, 
				customGridComplete,// custom grid complete
				customLoadComplete,// custom load complete
				false,// default hidden
				true);// row Color Based On status	
		
		$("#contactGrid").jqGrid('setGridParam',{
			/*beforeShowForm:function(formid)
			{
				currContactRowId = $("#DelData>td:nth-child(1)").text();
				return true;
			},*/
			beforeSelectRow:function(rowId)
			{
				return false;
			}/*,
			onClose : function()
			{
				var rowData=jQuery("#contactGrid").getRowData(currContactRowId);
				if(rowData.isSelected==true || rowData.isSelected=='true')
					 jQuery("#contactGrid").jqGrid('setSelection',currContactRowId);
				else
					 jQuery("#contactGrid").jqGrid('resetSelection',currContactRowId);
				return true;
			}*/
		});
});

function customLoadComplete()
{
	if($('#isSendAllowed').val()=='true' || $('#shipmentId').val().indexOf('T')!=-1)
		$("#tr_id", "#gbox_contactGrid").show();
	else
		$("#tr_id", "#gbox_contactGrid").hide();
	
	$('#gbox_contactGrid .ui-pg-input').attr("readonly", true);
}

function customGridComplete()
{
	//Clears and hides error row
	$('table[aria-labelledby="gbox_contactGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_contactGrid"] thead tr[id="FormError"]').hide();
	
	if(firstLoad=='N')
		 $("#multiselect_contactGrid").attr("checked",false);
	
	$('#organizationName').val('');
	$('#orgnContactName').val('');
	$('#fromCPGrid').val('');
	$('#communicationMethodCode').val('0');
	
	var rowIDs = jQuery("#contactGrid").getDataIDs(); 
	for (var i=0;i<rowIDs.length;i=i+1)
	{
		/*if(!_isContactUpdate)
     		$("#gbox_contactGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-edit").hide();
		
		if(!_isContactDelete)
     		$("#gbox_contactGrid #"+rowIDs[i]+" div .ui-pg-div.ui-inline-del").hide();*/
		
		var id = $('#contactGrid').getCell(rowIDs[i], 'id');
		var isSelected = $('#contactGrid').getCell(rowIDs[i], 'isSelected');
		if(isSelected=='true')
		{
			/*var trElement = jQuery("#"+ rowIDs[i],jQuery('#contactGrid'));
			$(trElement).trigger('click');
			$('#'+id).attr("aria-selected","true");
			$('#'+id).attr("class","ui-widget-content jqgrow ui-row-ltr ui-state-highlight");*/
			$('#jqg_contactGrid_'+id).attr("checked","checked");
		}
	} 
	if(firstLoad=='Y')
	{
		firstLoad="N";
		if(!_isContactUpdate)
		{
			//$("#contactGrid").children().bind('click', function(){ return false; });
			//$("#cb_contactGrid").attr("disabled", true);
			$("#gbox_contactGrid .cbox").attr("disabled", true);
		}
		else
		{
			//$("#cb_contactGrid").hide();
			//if($("#multiselect_contactGrid").length==0)
				$('#jqgh_contactGrid_cb').html('<input type="checkbox" id="multiselect_contactGrid" />');
			$("#multiselect_contactGrid").click(function(){
				var rowIDs = jQuery("#contactGrid").getDataIDs(); 
				var checked = false;
				if($("#multiselect_contactGrid").attr("checked")=="checked")
					checked = "checked";
			      for (var i=0;i<rowIDs.length;i=i+1){ 
			    	  var id = $('#contactGrid').getCell(rowIDs[i], 'id');
			    	  $('#jqg_contactGrid_'+id).attr("checked",checked);
			      }
				return true;
			});
		}
	}
}; 

function customEditMethod(id,a,b,c)
{
	/*currContactRowId = id;*/
	var rowIDs = jQuery("#contactGrid").getDataIDs(); 
	var index = -1;
    for (var i=0;i<rowIDs.length;i=i+1)
    {
    	index = $('#contactGrid').getCell(rowIDs[i], 'id');
    	
    	if(id == index)
		{
    		index = i;
			break;
		}
    }
    
    var contactId = $('#contactGrid').getCell(rowIDs[index], 'orgnContactId');
	var fromCP = $('#contactGrid').getCell(rowIDs[index], 'fromCPGrid');
	var replaceValue = $('#contactGrid').getCell(rowIDs[index], 'valueGrid');
	
	if(fromCP=="Y")
	{
		addOrReplaceContact(contactId,fromCP,replaceValue);
	}
	else
	{
		$.fn.fmatter.rowactions(id,a,b,c);
	}   			
};

function addOrReplaceContact(contactId,fromCP,replaceValue)
{
	var srt='<div class="prepend-1 span-10 section-header last" >'+
				'<table id="contact"">'+
				' <div class="span-10">'+
					'<thead><tr>'+
						'<th style=" width:50px;"></th>'+
						'<th style=" width:300px;">'+
							'Contact Name&nbsp;&nbsp;</a></th>'+
						'<th style=" width:300px;">'+
							'Value&nbsp;&nbsp;</th>'+
					'</tr></thead>'+
					'<tbody>';

					
	var isAvailable = false;
	
	var avail = $('#availableContactList').val().split(',');
	
	for(var i =0; i<avail.length;i=i+5)
	{
		var row="";	
		
		if(avail[i] == contactId)
		{
			var isFound = false;
			var rowIDs = jQuery("#contactGrid").getDataIDs(); 
			for (var j=0;j<rowIDs.length;j=j+1)
			{
				var valueGrid = $('#contactGrid').getCell(rowIDs[j], 'valueGrid');
				if(avail[i+4]==valueGrid)
				{
					isFound = true;
					break;
				}
			}
			if(!isFound)
			{
				row=row+'<tr class="odd">'+									
				'<td class="default"><input type="checkbox"'+ 
					'name="contactCodeSelected" '+
					'id="contactCodeSelected" value='+avail[i+4]+' /></td>'+
				'<td class="default">'+avail[i+2]+'</td>'+
				'<td class="default">'+avail[i+4]+'</td></tr>';
				isAvailable=true;
			}
		}
		srt=srt+row;
	}
	srt = srt +	'</tbody>'+
				'</table></div>'+
				'<div class="prepend-top span-9"></div>'+
				'<div class="clear prepend-1 span-6">'+
				'</div>';
	
	if(fromCP=='Y' && isAvailable==true)
	{
		var $dialog = $('<div id="replaceContactDiv"></div>');
		$dialog.html(srt).dialog({
		  		autoOpen: true,
		        title: 'Add/Replace With Below Email/Fax',
		        width: 510,
		        modal: true,
		        close: function()
		        {
					/*var rowData=jQuery("#contactGrid").getRowData(currContactRowId);
					 if(rowData.isSelected==true || rowData.isSelected=='true')
						 jQuery("#contactGrid").jqGrid('setSelection',currContactRowId);
					 else
						 jQuery("#contactGrid").jqGrid('resetSelection',currContactRowId);*/
		        	$("#replaceContactDiv").dialog("destroy");
		        	$('#replaceContactDiv').remove();
		        },
		        buttons: {
					"Add": function() {
						var count = $("#contactCodeSelected:checked").length;
						if(count>0)
						{
							var values = "";
							 $.each($("#contactCodeSelected:checked"), 
								  function() {
									
									values=values+$(this).val()+"|";
									$(this).attr('checked', false);
									
								   //values.push($(this).val()); 
							}); 
							$('#secondaryContactString').val(values);
							var queryString = $('#sendDocumentForm').formSerialize();
							$.ajax({
								url : _context +"/booking/senddocument/addToGrid/addSecondary",
								type : "POST",
								data : queryString,
								success : function(responseText) {
									showResponseMessages(responseText.messages);
									if(responseText.success)
										jQuery("#contactGrid").trigger('reloadGrid');
									$("#replaceContactDiv").dialog("close");
								}
							});
						}
						else
						{
							alert("Please select a contact to replace.");
						}
					}, 
					"Replace": function() {
						var count = $("#contactCodeSelected:checked").length;
						if(count==1)
						{
							var values = replaceValue+"|";
							 $.each($("#contactCodeSelected:checked"), 
								  function() {
									
									values=values+$(this).val()+"|";
									$(this).attr('checked', false);
									
								   //values.push($(this).val()); 
							}); 
							 
							$('#secondaryContactString').val(values);
							var queryString = $('#sendDocumentForm').formSerialize();
							$.ajax({
								url : _context +"/booking/senddocument/addToGrid/replace",
								type : "POST",
								data : queryString,
								success : function(responseText) {
									showResponseMessages(responseText.messages);
									if(responseText.success)
										jQuery("#contactGrid").trigger('reloadGrid');
									$("#replaceContactDiv").dialog("close");
								}
							});
						}
						else if(count>1)
						{
							alert("Please select only one contact to replace.");
						}
						else
						{
							alert("Please select a contact to replace.");
						}
						
					}, 
					"Cancel": function() {
						$("#replaceContactDiv").dialog("close");
					}
				}
		  });
	}
	else if(isAvailable==true)
	{
		alert("Please select a CP Contact to Add or Replace.");
		return false;
	}
	else
	{
		alert("No Contact available to add/replace");
		return false;
	}
}

function isInteger(s){
	 var i;
	 for (i = 0; i < s.length; i++)
	 {   
	     // Check that current character is number.
	     var c = s.charAt(i);
	     if (((c < "0") || (c > "9"))) return false;
	 }
	 // All characters are numbers.
	 return true;
}

function trim(s){   
	 var i;
	 var returnString = "";
	 // Search through string's characters one by one.
	 // If character is not a whitespace, append to returnString.
	 for (i = 0; i < s.length; i++)
	 {   
	     // Check that current character isn't whitespace.
	     var c = s.charAt(i);
	     if (c != " ") returnString += c;
	 }
	 return returnString;
}

function winBRopen(theURL, Name, popW, popH, scroll, loc) {
	var winleft = (screen.width - popW) / 2;
	var winUp = (screen.height - popH) / 2;
	winProp = "width=" + popW + ",height=" + popH + ",left=" + winleft + ",top=" + winUp + ",scrollbars=" + scroll + ",resizable,menubar=" + loc;
	Win = window.open(theURL, Name, winProp);
	if (parseInt(navigator.appVersion) >= 4) {
		Win.window.focus();
	}
}

function stripCharsInBag(s, bag){   
	 var i;
	 var returnString = "";
	 // Search through string's characters one by one.
	 // If character is not in bag, append to returnString.
	 for (i = 0; i < s.length; i++)
	 {   
	     // Check that current character isn't whitespace.
	     var c = s.charAt(i);
	     if (bag.indexOf(c) == -1) returnString += c;
	 }
	 return returnString;
}

function checkInternationalPhone(strPhone){
	strPhone=trim(strPhone);
	s=stripCharsInBag(strPhone,validWorldPhoneChars);
	return (isInteger(s) && s.length >= minDigitsInIPhoneNumber);
}

function checkForDefaultValue(value, colname) {
	if (colname ='communicationMethodCode' && value == '0'){
	   return [false,'Please select Type'];	
	}
	else 
	{	
    	return [true,""];
	}
}

function checkForMethodValue(value, colname) {
	if(methodCode==3)
	{
		strPhone=trim(value);
		if(strPhone.length<13 || strPhone.length>18){
			return [false,'Please enter a valid fax number: [country(1-3)]-[area(2-4)]-[station(3-4)]-[exchange(4)]'];
		}
		var codes = strPhone.split('-');
		if(codes.length!=4){
			return [false,'Please enter a valid fax number: [country]-[area]-[station]-[exchange]'];
		}
		if(codes[0].length<1 || codes[0].length>3){
			return [false,'Please enter country code: [country]-[area]-[station]-[exchange]'];
		}
		if(codes[0]=='1' || codes[0]=='01' || codes[0]=='001'){
			if(codes[1].length!=3 || codes[2].length!=3 ||codes[3].length!=4){
				return [false,'Please enter valid US number: area(3), station(3), exchange(4)'];
			}
		}
		else{
			if(codes[1].length<2 || codes[1].length>4 || 
					   codes[2].length<3 || codes[2].length>4 || codes[3].length!=4){
				return [false,'Please enter valid Int. number: area(2-4), station(3-4), exchange(4)'];
			}
		}
		if (checkInternationalPhone(value)==false)
		{
			return [false,'Please enter a valid fax number: [country]-[area]-[station]-[exchange]'];
		}		
	}
	else if(methodCode==1 || methodCode==2)
	{
		if(value.length>50)
		{
			return [false,'Please enter a valid email address'];	
		}
		var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		if(filter.test($.trim(value))==false)
		{
		   return [false,'Please enter a valid email address'];	
		} 
	}
	return [true,""];
}
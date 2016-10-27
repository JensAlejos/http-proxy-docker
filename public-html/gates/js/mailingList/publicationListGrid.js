$(document).ready(
		function () {
			var colNames=['id', 'Publication Id', 'Publication', 'Short Name', 'Description', 'Owner', 'Eff. Date', 'Exp. Date', 'Last Mail Date', 'Upd. ON/BY', ''];
			var colModel=[
			              {name:'id',index:'id', editable:false,hidden:true, formatter:'number', 
			               cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
			              {name:'mailPublicationId',index:'publicationId', editable:false,hidden:true, formatter:'number', 
				               cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
	   					  {name:'name',index:'name', width:115, editable:true, editrules:{required:true},editoptions: {maxlength:35}},
				          {name:'shortName',index:'shortName', width:20, editable:true, editoptions:{size:8},editoptions: {maxlength:7}},
			              {name:'description',index:'description', hidden:true,editable:true,editoptions: {maxlength:25}},
			              {name:'owner',index:'owner',hidden:true, editable:true, editrules:{required:true}, editoptions:{size:10,maxlength:25, defaultValue:$('#user').val()}},
			              {name:'effectiveDateStr',index:'effectiveDateStr', width:25, editrules:{required:true,custom:true,custom_func:checkEffectiveDate}, editable:true,  
					   			editoptions:{size:100, 
			   						 dataInit:function(el){ $(el).datepicker(
			 																	{
			 																			dateFormat:'mm-dd-yy', 
			 																			
			 																	}
			   						 										).width(80); 
			   						 					},  
			   						 				defaultValue:setFormattedDate 
			   						 }},
			   			  {name:'expirationDateStr',index:'expirationDateStr', width:25, editrules:{required:true,custom:true,custom_func:checkDate}, editable:true,  
			   				 editoptions:{size:100,
			   					 dataInit:function(el){ $(el).datepicker(
						 													{
						 															dateFormat:'mm-dd-yy', 
						 													}
						   						 						).width(80); 
						   						 	  },  
						   						 defaultValue:sixtyDaysAddedToDate 
						   		}},
					      {name:'lastMailDateStr',index:'lastMailDateStr', width:25, editable:true, editoptions:{readonly:true, size:10}},
			              //{name:'updatedOnStr',index:'updatedOnStr', width:22, editable:true, editoptions:{readonly:true, size:10, defaultValue:setFormattedDate},editrules:{required:true}},
			              //{name:'updatedBy',index:'updatedBy', width:22, editable:true, editoptions:{readonly:true, size:10, defaultValue:$('#user').val()}},
			              {name:'updateByOn',index:'updateByOn', width:63, editable:true, editoptions:{readonly:true, size:20, defaultValue:$('#updatedByOn').val()}},			       
			              {name:'actions', index:'actions', width:20, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true,afterSave:isAnyChangeInGrid}}
			              /*{name:'actions', width:50, formatter:'actions',
                      		formatoptions:{keys:true,editbutton:true, delbutton:true,
                      			afterSave:isAnyChangeInGrid
                      		}}*/
			              ];
						createGrid(
								'publicationListGrid', // grid id for Standing Instruction
								'publicationListPager', // page id for Standing Instruction
								'/gates/publicationList/loadGrid', 
								'/gates/publicationList/addPublication', 
								'/gates/publicationList/editPublication',
								'/gates/publicationList/deletePublication', 
								'/gates/publicationList/deleteSelectedPublication',
								colNames, 
								colModel, 
								'Publication List',
								210
								,10 ,[10,20,30] ,
								!_readonly, /* multiselect */
								!_readonly, /* multidelete */
								true,
								_readonly,
								null, /* jsonReader */
								_readonly, /* hideEdit */
								_readonly /* hideDelete */);					

	}
);


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
	return month + "-"+day+"-"+year;
	//return month+"-"+day+"-"+year;
}
function sixtyDaysAddedToDate(){
	var todaysDate = new Date();
	todaysDate.setDate(todaysDate.getDate() + 60);
	var day = todaysDate.getDate();
	if(eval(day<10)){
		day = '0'+day;
	}
	var month = eval(eval(todaysDate.getMonth())+eval(1));
	if(eval(month<10)){
		month = '0'+month;
	}
	var year = todaysDate.getFullYear();
	return month + "-"+day+"-"+year;
	//return month+"-"+day+"-"+year;
}

var expiryDateStr="Not Checked";
var effectiveDateStr="Not Checked";

function checkEffectiveDate(value, colname)
{
	effectiveDateStr=value;
	if(effectiveDateStr != "Not Checked" && expiryDateStr != "Not Checked")
	{
		var effectiveDate=new Date(effectiveDateStr);
		var expiryDate=new Date(expiryDateStr);
		if(effectiveDate>expiryDate)
		{
			effectiveDateStr="Not Checked";
			return [false,"Effective Date can not be after Expiration Date"];
		}
		expiryDateStr="Not Checked";
		effectiveDateStr="Not Checked";
	}
	return [true,""];
}

function checkDate(value, colname) 
{
	expiryDateStr=value;
	if(effectiveDateStr != "Not Checked" && expiryDateStr != "Not Checked")
	{
		var effectiveDate=new Date(effectiveDateStr);
		var expiryDate=new Date(expiryDateStr);
		if(effectiveDate>expiryDate)
		{
			expiryDateStr="Not Checked";
			effectiveDateStr="Not Checked";
			return [false,"Expiration Date can not be prior to Effective Date."];
		}
		expiryDateStr="Not Checked";
		effectiveDateStr="Not Checked";
	}
	return [true,""];
}




$(document).ready(function(){
	$('#build_mailing_list').click(
		function()
		{
			if($('#idHolderForPublication').val()==1)
			{
				document.location.href =_context+'/mailingList/edit?publicationId='+$('#mailPublicationId').val();
			
			}
			else
			{
			var selectedMulti = $('#publicationListGrid').getGridParam('selarrrow');
			var selected = $('#publicationListGrid').getGridParam('selrow');
			if(selected!=null && selectedMulti!=null)
				{
					if(selectedMulti.length == "1")
					{
						var rowData = $('#publicationListGrid').getRowData(selected); 
						var publicationId = rowData["mailPublicationId"];
						var length=publicationId.length;
						var pubId=publicationId.substring(0,length-3);
						if(pubId!="0")
						{		
							document.location.href =_context+'/mailingList/edit?publicationId='+pubId;
						}
						else
						{
							alert('Please save this publication first.');
						}
					}
					else
					{
						alert("Please select a single Publication.");
						return false;
					}
				}
			
			else
				{
					alert("Please select atleast one Publication.");
					return false;
				}
			}
		}	
	);
});
function funcReload(){
	alert('reached here');
}

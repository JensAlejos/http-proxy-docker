$(document).ready(
		function () {
			tabSequence('#addressRoleStandingInstructionForm');
			var colNames=['id', 'standingInstructionId', 'SIType', 'Subject', 'Comments', 'Effective Date', 'Exp. Date','Date/Time', 'UserID',''];
			var colModel=[
			              {name:'id',index:'id', width:50, editable:false,hidden:true, formatter:'number', 
			               cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;'}},
			               {name:'standingInstructionId',index:'standingInstructionId', width:20, editable:false,hidden:true, formatter:'number', 
				               cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;'}},
				           {name:'type',index:'type', width:14, editable: true, 
		   						   edittype: "select", 
		   						   editrules: { required: true },
		   						editoptions: {value:"DOC:DOC;CSS:CSS"}},
			              {name:'subject',index:'subject', width:40, editable:true, editrules:{required:true},editoptions: {maxlength:40}},
			              {name:'comment',index:'comment', width:40, editable:true, editrules:{required:true},editoptions: {maxlength:78}},
			              {name:'effectiveDateStr',index:'effectiveDateStr', width:15, editable:true, edittype: "datepicker", editrules:{required:true,custom:true,custom_func:checkEffectiveDate},
					   			editoptions:{size:16, 
			   						 dataInit:function(el){ $(el).datepicker(
			 																	{
			 																			dateFormat:'mm-dd-yy', 
			 																			
			 																	}
			   						 										).width(80); 
			   						 					},  
			   						 defaultValue: function(){ 
			   							 						var currentTime = new Date(); 
			   							 						var month = parseInt(currentTime.getMonth() + 1); 
			   							 						month = month <= 9 ? "0"+month : month; 
			   							 						var day = currentTime.getDate(); 
			   							 						day = day <= 9 ? "0"+day : day; 
			   							 						var year = currentTime.getFullYear(); 
			   							 						return month+"-"+day + "-"+year; 
			   							 					},
			   						   					 dataEvents :[{ type: 'change', fn: function(e) {
			   												//var typeCodeSelected = $("#typeCode").val();
			   												if(e.target.value.length==0)
			   													{
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
			   													e.target.value=month + "-" + day + "-" + year;
			   													}
			   												}//end fun 
			   					   					 } // end type
			   					   					 ] // dataevents  
			   						 },
			   						},
			              {name:'expiryDateStr',index:'expiryDateStr', width:15, editable:true, edittype: "datepicker", 
					   			editoptions:{size:16, 
			   						 dataInit:function(el){ $(el).datepicker(
			 																	{
			 																			dateFormat:'mm-dd-yy', 
			 																			
			 																	}
			   						 										).width(80); 
			   						 					},  
			   						 defaultValue: function(){ 
			   							 						var month = "12"; 
			   							 						var day = "31"; 			   							 						 
			   							 						var year = "9999"; 
			   							 						return month + "-"+day+"-"+year; 
			   							 					} 
			   						 },
			   						editrules:{required:true,custom:true,custom_func:checkDate}
			              	},
			             
			             
                          {name:'lastUpdateDateStr',index:'lastUpdateDateStr', width:20, editable:true, editoptions:{readonly:true, size:10, defaultValue:setFormattedDateTime},editrules:{required:true}},
			              {name:'lastUpdateUser',index:'lastUpdateUser', width:20, editable:true, editoptions:{readonly:true, size:8, defaultValue:$('#user').val()}},
			              {name:'actions', index:'actions', width:15, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions:{keys:true}}
			              ];
			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "id"
				};
						createGrid(
								'standingInstructionGrid', // grid id for Standing Instruction
								'standingInstructionPager', // page id for Standing Instruction
								'/gates/addressRole/standingInstruction/loadGrid', 
								'/gates/addressRole/standingInstruction/addInstruction', 
								'/gates/addressRole/standingInstruction/editInstruction',
								'/gates/addressRole/standingInstruction/deleteSelectedInstruction', 
								'/gates/addressRole/standingInstruction/deleteSelectedInstruction',
								colNames, 
								colModel, 
								'Standing Instruction',
								100
								,10 ,[10,20,30] ,true,true,true,_readonly);					

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
	return month + "-" + day + "-" + year;
	//return month+"-"+day+"-"+year;
}

function setFormattedDateTime(){
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
	var hours=todaysDate.getHours();
	var minutes=todaysDate.getMinutes();
	
	var seconds=todaysDate.getSeconds();
	return month + "-" + day + "-" + year+" "+hours+":"+minutes+":"+seconds;
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
			return [false,"Expiration Date can not be prior to Effective Date "];
		}
		expiryDateStr="Not Checked";
		effectiveDateStr="Not Checked";
	}
	return [true,""];
}

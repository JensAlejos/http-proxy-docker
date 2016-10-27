$(document).ready(
		function() {

			var choiceGridColNames= ['Choice Id', 'Choice Seq No', 'Choice Seq No', 'Selectable', 'Choices Text','Choice Assist Text'];
			var choiceGridColModel= [ 
			                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true, formatter:'number'},
			                        {name:'reGenericId',index:'reGenericId', width:100, editable:false, formatter:'choiceFormatter'},
			          				{name:'choiceSeqNum',index:'choiceSeqNum', width:100, hidden:true, editable:false},
			                        {name:'selectable',index:'selectable', width:50, hidden:true, editable:false},
			        				{name:'messageTextValue',index:'messageTextValue', width:720, editable:false, formatter:lineFormatter},
			        				{name:'choiceAssistText',index:'choiceAssistText', hidden:true, width:700, editable:false}
			                       ];
			
			jQuery.extend($.fn.fmatter , {
				choiceFormatter : function(cellvalue, options, rowdata) {
					if(rowdata.selectable == true)
						return "<a href='javascript:concludeRating("+rowdata.reRatingChoiceId+");' >"+cellvalue+"</a>";
					else
						return cellvalue;
				}
			});
			

			var jsonReaderChoice = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "reRatingChoiceId"
			};

			createGrid("reChoiceGrid", "pagerReChoiceGrid",
					'/gates/quote/loadReChoiceGrid',
					'', '', '', '',
					choiceGridColNames, choiceGridColModel,
					"List Of Choice Messages",'auto', 5, [ 5, 10, 15 ], false, false, false, true,
					jsonReaderChoice,true,true,true,false,false,false,false,choiceGridComplete,false,false,true);
		});


function concludeRating(id)
{		
	$("#reChoiceGrid").jqGrid("clearGridData", true);
	$('#re_choice_dialog').dialog( "close" );
	// send Quote To Rate			
	var form = document.getElementById("quoteForm");
	var queryString = $('#quoteForm').formSerialize();
	blockUI();
	$.ajax({
		   type: "POST",				   							   
		   url: _context +"/quote/concludeRating?id="+id,
		   data: queryString,
		   success: function(responseText){			   
			   if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');					
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").trigger('reloadGrid');
				    $('#reErrContinueBtn').hide();
					$('#reErrCloseBtn').show();
					calculateInchesToFtErrors(responseText.data);
					_isQuoteChanged = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
				}else if(responseText.data.rateView == "showChoice"){
					$('#re_choice_dialog').dialog('open');					
					$("#ratingChoiceForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
					$("#frt").val(responseText.data.frtCharges);
					if(responseText.data.isAllChoicesUnSelectable != null 
							&& responseText.data.isAllChoicesUnSelectable == "Y"){
						$('#reChoiceCloseBtn').hide();	
						$('#reChoiceContinueBtn').show();
					}else{
						$('#reChoiceCloseBtn').show();	
						$('#reChoiceContinueBtn').hide();	
					}											
				    jQuery("#reChoiceGrid").trigger('reloadGrid');
				    calculateInchesToFtChoices(responseText.data);
				}else if(responseText.data.rateView == "showWarning"){											
					$('#re_error_dialog').dialog('open');
					$(".ui-dialog-titlebar-close").hide();
					$("#ratingErrorForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
				    jQuery("#reErrorGrid").trigger('reloadGrid');
				    $('#reErrCloseBtn').hide();
					$('#reErrContinueBtn').show();
					$('#quoteForm').loadJSON(responseText.data);
					setHistoryTab(responseText);
					setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
					$("#issueQuote").removeAttr("disabled");
					calculateInchesToFtErrors(responseText.data);
					showResponseMessages(responseText.messages);					
				}
				else {
					$('#quoteForm').loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					setHistoryTab(responseText);
					setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					$("#issueQuote").removeAttr("disabled");
					showResponseMessages(responseText.messages);
					if(!((responseText.messages.hasOwnProperty("error") && responseText.messages.error.length > 0) || 
							(responseText.messages.hasOwnProperty("warn") && responseText.messages.warn.length > 0))){
						scrollWinBottom();
					}
					_isQuoteChanged = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
				}	
			   $.unblockUI();
		   }
	});	
}

var choiceGridComplete = function()
{
	var rowIDs = jQuery("#reChoiceGrid").getDataIDs(); 
	for (var i=0;i<rowIDs.length;i=i+1)
	{ 
		var rowData=jQuery("#reChoiceGrid").getRowData(rowIDs[i]);
		var trElement = jQuery("#"+ rowIDs[i],jQuery('#reChoiceGrid'));
		$(trElement.children()[4]).attr('title',rowData.choiceAssistText);
		if(rowData.selectable=='false' || rowData.selectable==false)
		{
			$(trElement).css('color', 'red');
		}
		else
		{
			$(trElement).css('color', 'black');
		}
	}	
	return true;
};

//for 22658
//changed because the font has been changed to courier new which takes more space. Also modified the formattter
function lineFormatter( input, options, rowObject )
{
	if(input.length>90){
			var finalString="";
			var text1= input.substr(0, 90);
			//finalSting=text1;
			firstText="";
			var lengthFirstText=0;
			var array=[];
			var count=0;
			
			while(text1!=""){
				
		
				indexOfSpace= text1.lastIndexOf(" ");
				//indexOfSpace=text1.length-indexOfSpace;
				if(text1<90){
					if(indexOfSpace>0){
					firstText= text1.substring(0, indexOfSpace+1);
					}else{
					firstText= text1.substring(0, 90);	
					}
				}else{
					firstText=text1;
				}
				lengthFirstText= firstText.length + lengthFirstText;
				finalString=finalString+firstText;
				
				text1=input.substr(lengthFirstText,90);
				
				//if(text1.indexOf(' ') >= 0){
				if(firstText.match(/^\s+$/) === null && firstText!="") {
				array[count]=firstText;
				count++;
				}
	
			}
			
			 //i=count;
			 var lineInGrid="";
			 for(var i=(count-1); i>=0;i--){
				 if(i==count-1){
					 lineInGrid=  array[i] + lineInGrid;
				 }else{
				 lineInGrid= array[i] + "</br>" +lineInGrid;
				 }
			 }
			 return lineInGrid;
	}
	else{
			return input;
	}
}

function calculateInchesToFtChoices(responseText){
	var length = responseText.cmdtyLength; 
	var width = responseText.cmdtyWidth; 
	var height = responseText.cmdtyHeight;
	$("#ratingChoiceForm input[name=cmdtyLength]").val("");
	$("#ratingChoiceForm input[name=cmdtyWidth]").val("");
	$("#ratingChoiceForm input[name=cmdtyHeight]").val("");
	
	
	if(!(isNaN(length))) {
		if (length == "") {
			length = 0;
		}
		var lengthFt = parseInt(length / 12);
		var lengthIn = length % 12;
		$("#ratingChoiceForm input[name=cmdtyLength]").val(lengthFt +"'" + lengthIn + "''");
	}
	if(!(isNaN(width))) {
		if (width == "") {
			width = 0;
		}
		var widthFt = parseInt(width / 12);
		var widthIn = width % 12;
		$("#ratingChoiceForm input[name=cmdtyWidth]").val(widthFt +"'" + widthIn + "''");
	}
	if(!(isNaN(height))) {
		if (height == "") {
			height = 0;
		}
		var heightFt = parseInt(height / 12);
		var heightIn = height % 12;
		$("#ratingChoiceForm input[name=cmdtyHeight]").val(heightFt +"'" + heightIn + "''");
	}	
}

function calculateInchesToFtErrors(responseText){
	var length = responseText.cmdtyLength; 
	var width = responseText.cmdtyWidth; 
	var height = responseText.cmdtyHeight;
	$("#ratingErrorForm input[name=cmdtyLength]").val("");
	$("#ratingErrorForm input[name=cmdtyWidth]").val("");
	$("#ratingErrorForm input[name=cmdtyHeight]").val("");
	
	
	if(!(isNaN(length))) {
		if (length == "") {
			length = 0;
		}
		var lengthFt = parseInt(length / 12);
		var lengthIn = length % 12;
		$("#ratingErrorForm input[name=cmdtyLength]").val(lengthFt +"'" + lengthIn + "''");
	}
	if(!(isNaN(width))) {
		if (width == "") {
			width = 0;
		}
		var widthFt = parseInt(width / 12);
		var widthIn = width % 12;
		$("#ratingErrorForm input[name=cmdtyWidth]").val(widthFt +"'" + widthIn + "''");
	}
	if(!(isNaN(height))) {
		if (height == "") {
			height = 0;
		}
		var heightFt = parseInt(height / 12);
		var heightIn = height % 12;
		$("#ratingErrorForm input[name=cmdtyHeight]").val(heightFt +"'" + heightIn + "''");
	}	
}
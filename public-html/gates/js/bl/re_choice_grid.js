//$(document).ready(
//		function() {
//
//			var choiceGridColNames= ['Choice Id', 'Choice Seq No', 'Selectable', 'Choices Text'];
//			var choiceGridColModel= [ 
//			                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true, formatter:'number'},
//			          				{name:'choiceSeqNum',index:'choiceSeqNum', width:100, editable:false, formatter:'choiceFormatter'},
//			                        {name:'selectable',index:'selectable', width:50, editable:false},
//			        				{name:'messageTextValue',index:'messageTextValue', width:700, editable:false}			        				
//			                       ];
//			
////			jQuery.extend($.fn.fmatter , {
////				choiceFormatter : function(cellvalue, options, rowdata) {
////					if(rowdata.selectable == true){
////						alert(rowdata.reRatingChoiceId);
////						return "<a href='javascript:concludeRating("+rowdata.reRatingChoiceId+");' >"+cellvalue+"</a>";
////					}
////						
////					else
////						return cellvalue;
////				}
////			});
//			
//
//			var jsonReaderChoice = {
//				root : "rows",
//				page : "page",
//				total : "total",
//				records : "records",
//				repeatitems : false,
//				cell : "cell",
//				id : "reRatingChoiceId"
//			};
//
//			createGrid("reChoiceGrid", "pagerReChoiceGrid",
//					'/gates/maintainRate/loadReChoiceGrid',
//					'', '', '', '',
//					choiceGridColNames, choiceGridColModel,
//					"List Of Choice Messages", 70, 5, [ 5, 10, 15 ], true, false, false, true,
//					jsonReaderChoice,true,true,true,false,false,false,false,false,false,false,true);
//		});


function createChoiceGrid(pageURL){
	var choiceGridColNames= ['Choice Id', 'Choice Seq No', 'Selectable', 'Choices Text','Choice AssistText'];
	var choiceGridColModel= [ 
	                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true, formatter:'number'},
	          				{name:'choiceSeqNum',index:'choiceSeqNum', width:100, editable:false, formatter:'choiceFormatter'},
	                        {name:'selectable',index:'selectable', width:50, editable:false},
	        				{name:'messageTextValue',index:'messageTextValue', width:700, editable:false},
	        				{name:'choiceAssistText',index:'choiceAssistText', hidden:true, width:700, editable:false}
	                       ];
	
//	jQuery.extend($.fn.fmatter , {
//		choiceFormatter : function(cellvalue, options, rowdata) {
//			if(rowdata.selectable == true){
//				alert(rowdata.reRatingChoiceId);
//				return "<a href='javascript:concludeRating("+rowdata.reRatingChoiceId+");' >"+cellvalue+"</a>";
//			}
//				
//			else
//				return cellvalue;
//		}
//	});
	

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
			'/gates'+pageURL+'/loadReChoiceGrid',
			'', '', '', '',
			choiceGridColNames, choiceGridColModel,
			"List Of Choice Messages", 70, 5, [ 5, 10, 15 ], true, false, false, true,
			jsonReaderChoice,true,true,true,false,false,false,false,onGridComplete,false,false,true);
	
	("#reChoiceGrid").trigger('reloadGrid');
}

function onGridComplete (){
	var rowIDs = jQuery("#reChoiceGrid").getDataIDs(); 
    for (var i=0;i<rowIDs.length;i=i+1){ 
      var rowData=jQuery("#reChoiceGrid").getRowData(rowIDs[i]);
      var trElement = jQuery("#"+ rowIDs[i],jQuery('#reChoiceGrid'));
      $(trElement.children()[3]).attr('title',rowData.choiceAssistText);
    }
}

function concludeRating(page, id)
{		
//	$('#re_choice_dialog').dialog( "close" );
	
	var url = "";
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		"/concludeRating?id="+id;
	}
	
	$.ajax({
		   type: "POST",				   							   
		   url: _context + page + url,
		   success: function(responseText){			   
			   if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
				}else if(responseText.data.rateView == "showChoice"){
					$('#re_choice_dialog').dialog('open');
					$("#ratingChoiceForm").loadJSON(responseText.data);
//					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
					if(responseText.data.isAllChoicesUnSelectable != null 
							&& responseText.data.isAllChoicesUnSelectable == "Y"){
						$('#reChoiceCloseBtn').hide();	
						$('#reChoiceContinueBtn').show();
					}else{
						$('#reChoiceCloseBtn').show();	
						$('#reChoiceContinueBtn').hide();	
					}											
				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#shipmentForm').loadJSON(responseText.data);
					showResponseMessages(responseText.messages);
				}
				else {
					$('#shipmentForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					showResponseMessages(responseText.messages);
				}	
			   
		   }
	});	
}

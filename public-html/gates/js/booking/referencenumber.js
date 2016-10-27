$(document)
		.ready(
				function() {
					var isEdit=false;
					var colNamesReferenceNumber = [ 'Id', 'Process Level',
							'Copy Bill To Header', 'SHAC', 'Type',
							'Reference Number', 'Actions' ];
					var colModelReferenceNumber = [
							{
								name : 'seqNo',
								index : 'seqNo',
								width : 55,
								hidden : true
							},
							{
								name : 'processLevelCode',
								index : 'processLevelCode',
								width : 55,
								hidden : true
							},
							{
								name : 'isCopyBillToHeader',
								index : 'isCopyBillToHeader',
								width : 55,
								hidden : true
							},
							{
								name : 'shipmentAddnlChrsticIdDs',
								index : 'shipmentAddnlChrsticIdDs',
								width : 55,
								hidden : true
							},
							{
								name : 'typeCode',
								index : 'typeCode',
								width : 150,
								editable : true,
								editrules : {
									required : true,
									custom : true,
									custom_func : function(value, colname) {
										if (value == '') {
											return [ false,
													"Type cannot be blank." ];
										} else {
											return [ true, "" ];
										}
									}
								},
								formatter : 'select',
								edittype : "select",
								editoptions : {
									value : ":Select;S:Shipper;C:Consignee;B:Both S&C;F:Forwarder;I:ITN;E:ITN-Exempt;T:Military TCN;A:Alaska/Hawaii Booking;O: Original Booking"
								}
							},
							{
								name : 'referenceNumberNotation',
								index : 'referenceNumberNotation',
								width : 200,								
								editable : true,
								editrules : {									
									custom : true,
									custom_func : function(value, colname) {
										var result = true;
										if(! isEdit){
											if (value.indexOf(',') != -1) {
												if($.trim(value) == ','){
													result = false;
												}
											}
										}
										if (null == value || $.trim(value) == '' ) {
											return [ false,
													"Reference Number cannot be spaces when Reference Type is present." ];
										}
										
										if (!result) {
											return [ false,
													"Reference Number cannot be spaces when Reference Type is present." ];
										} else {
											return [ true, "" ];
										}
									}
								},
								editoptions : {
									maxlength : 20
								},
								//formatter : "textarea",
								//edittype : "textarea",								
								//editoptions : {multiple: true}
							}, {
								name : 'actions',
								index : 'actions',
								width : 100,
								align : "center",
								editable : false,
								search : false,
								sortable : false,
								formatter : 'actions',
								formatoptions : {
									keys : true,
									url: _context+'/booking/referenceNumber/update', 
									onEdit: function(rowId){										
										isEdit=true;
									},
									afterSave: function()
									{
										isBookingChanged = "Y";
										isEdit=false;
										if(!isReferenceNumberMarksDeletable)
										{
										  $(".ui-icon.ui-icon-trash").hide();
										}										
										return true;
									},
									afterRestore: function(){
										isEdit=false;										
									}
								}
							} ];

					var jsonReaderReference = {
						root : "rows",
						page : "page",
						total : "total",
						records : "records",
						repeatitems : false,
						cell : "cell",
						id : "seqNo"
					};
					
					/*Booking Security*/
					var pagerMultiDelete = true;
					//D027890:multiple blank rows in Reference & Commodity
					var refNoReadOnlyGrid = false;
					if(isReferenceNumberMarksDisplayOnly && !isReferenceNumberMarksModifiable){
						pagerMultiDelete = false;
						refNoReadOnlyGrid = true;
					}
					
					/*Booking Security*/
					if(isReferenceNumberMarksDisplayOnly || isReferenceNumberMarksModifiable){
						createGrid("referenceNumberGrid", // grid id for user
						"pagerGrid", // page id for user
						_context+'/booking/referenceNumber/load',//load URL
						_context+'/booking/referenceNumber/add',// add URL
						_context+'/booking/referenceNumber/update',// edit URL
						_context+'/booking/referenceNumber/delete',// delete URL
						_context+'/booking/referenceNumber/deleteSelected',//multidelete URL
						colNamesReferenceNumber, //colnames
						colModelReferenceNumber,//colmodel
						"Reference Number(s)", //caption
						268, //height
						10, //rownum
						[ 10, 20, 30 ], //rowlist
						true,//multiselect
						pagerMultiDelete, //multidelete
						false, // load once 
						refNoReadOnlyGrid, //read only grid
						jsonReaderReference, //Json reader
						false, //hide edit
						false, //hide delete
						true, //autowidth
						true, //row numbers
						true, //hidecustom Add row
						false, //hide pager row
						null, //custom edit method
						null, //custom grid complete
						referenceGridLoadComplete, // custom load complete
						false, //default hidden
						true, //row color based on status
						false, //cell edit
						refGridAfterSubmit // delete after submit
						);
						
					}
					
					$('#marksAndNumbers')
							.change(
									function() {
										if ($('#marksAndNumbers').val() == ''
												|| $('#marksAndNumbers').val() == null) {
											$('#marksHeaderCheckBox').attr(
													'checked', false);
										} else {
											$('#marksHeaderCheckBox').attr(
													'checked', true);
										}
									});
					/*$('#marksAndNumbers').bind('paste', function(event){
						var pastedText = undefined;
						  if (window.clipboardData && window.clipboardData.getData) { // IE
						    pastedText = window.clipboardData.getData('Text');
						  } else if (e.clipboardData && e.clipboardData.getData) {
						    pastedText = e.clipboardData.getData('text/plain');
						  }
						setTimeout(function(){
							wrapTextArea('marksAndNumbers', 20);
							}, 250);
						return true;
					});
					
					$('#marksAndNumbers').live('keyup', function(evt){
						
						var keyCode = evt.keyCode;
						if(keyCode==32 || (48<=keyCode && keyCode<=57)
								|| (65<=keyCode && keyCode<=90) || (96<=keyCode && keyCode<=107) 
								|| (109<=keyCode && keyCode<=111))
						{
				            //alert("Line Length exceeded 20 characters");
				            //evt.preventDefault(); // prevent characters from appearing
							//formatMarksAndNumbers();
							wrapTextArea('marksAndNumbers', 20);
						}
						return true;
					});*/
					
					$('#marksAndNumbers').blur(function(event){
						wrapTextArea('marksAndNumbers', 20);
						
						var noOfLines = $('#marksAndNumbers').val().split('\n');
						var marksAndNumbers = "";
						var rowCount = 1;
						var emptyRow = false;
						$.each(noOfLines, function(index, value) {
							if($.trim(value) == '') {
								rowCount += 1;
								emptyRow = true;
							} else {
								marksAndNumbers += value.replace(/^\s+/,'');
								emptyRow = false;
							}
							if(index < (noOfLines.length - rowCount) && !emptyRow) {
								marksAndNumbers += '\n';
							}
						});
						$('#marksAndNumbers').val(marksAndNumbers);
						
						return true;
					});

				});

var referenceGridLoadComplete = function() {
	//$('#pagerGrid .ui-pg-input').attr("readonly", true);
	$('#referenceNumberNotation').parent().html("<textarea multiple=\"multiple\" id=\"referenceNumberNotation\" name=\"referenceNumberNotation\" cols=\"20\" rows=\"2\" role=\"textbox\" multiline=\"true\" class=\"FormElement\" style=\"resize: none; width: 190px;\"></textarea>");
	var referenceNumberCount = $("#referenceNumberGrid").getGridParam(
			"reccount");
	if (referenceNumberCount > 0) {
		$('#referenceHeaderCheckBox').attr('checked', true);
	} else {
		$('#referenceHeaderCheckBox').attr('checked', false);
	}
	
	$('#gbox_referenceNumberGrid #sData').click(function(){
		if($("#gbox_referenceNumberGrid #referenceNumberNotation")
				.attr("readonly") == 'readonly')
			return false;
		else
		{
			isBookingChanged = "Y";
			return true;
		}
	});
	
	$("#gbox_referenceNumberGrid #typeCode").live('keydown', function(evt){
		var theEvent = evt || window.event;
		  var key = theEvent.keyCode || theEvent.which;
		  if(key == '9' && $("#gbox_referenceNumberGrid #typeCode :selected").val()==''){
			  $('#marksAndNumbers').focus();
			  return false;
		  }
		  return true;
	});
	
	
	
	referenceNumberAddRowEnableDisable();
	
	$("#gbox_referenceNumberGrid #typeCode").change(function(){
		referenceNumberAddRowEnableDisable();
		$('#referenceNumberNotation').focus();
	});
	
	resetRefAddRow();
	hideGridsEditDelete();
};

function resetRefAddRow(){
	$("#gbox_referenceNumberGrid #referenceNumberNotation").val('');
	$('#gbox_referenceNumberGrid #typeCode').selected().val('');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").attr("readonly", true);
	$("#gbox_referenceNumberGrid #sData").css('background-color','#D8D8D8');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").css('resize','none');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").css('width','190px');
	$("#gbox_referenceNumberGrid #referenceNumberNotation").attr('rows','2');	
}

var refGridAfterSubmit = function(result)
{
	if(result.success){
		isBookingChanged = "Y";
	}
};

function referenceNumberAddRowEnableDisable()
{
	if($("#gbox_referenceNumberGrid #typeCode :selected").val()=='')
	{
		$("#gbox_referenceNumberGrid #referenceNumberNotation").val('');
		$("#gbox_referenceNumberGrid #referenceNumberNotation").attr("readonly", true);
		$("#gbox_referenceNumberGrid #sData").css('background-color','#D8D8D8');
	}
	else
	{
		$("#gbox_referenceNumberGrid #referenceNumberNotation").attr("readonly", false);
		$("#gbox_referenceNumberGrid #sData").css('background-color','#cae0f7');
	}
}

function wrapTextArea(textAreaId, maxLength)
{
	 var valToPrint = '';
	 var valArr = $('#'+textAreaId).val().split("\n");
	 var remainder = '';
	 for(var i = 0; i < valArr.length; i++) 
	 {
		 var lineLength = '';
		 if(remainder != '')
		 {
			valToPrint = valToPrint + "\n" + remainder;
			remainder = '';
		 }
		 if(valArr[i].length > maxLength)
		 {
			 var firstTime = true;
			 if(i != 0)
				 valToPrint = valToPrint + "\n";
			 var lineArr = valArr[i].split(" ");
			 for(var k=0;k<lineArr.length;k++)
			 {
				var word = remainder;
				if(lineLength != '' && word !='')
					word = lineLength + ' ' + word;
				else
					word = lineLength + word;
				
				if(word.length > maxLength)
				{
					if(firstTime)
						valToPrint = valToPrint + remainder;
					else
						valToPrint = valToPrint + "\n" + remainder;
					firstTime = false;
					remainder = '';
					lineLength = remainder;
					
					word = lineArr[k];
					if(lineLength != '' && word !='')
						word = lineLength + " " + word;
					else
						word = lineLength + word;
					
					if(word.length > maxLength)
					{
						if(lineArr[k].length > maxLength)
						{
							 var count = Math.floor(lineArr[k].length/maxLength);
							 for(var j=1; j<=count; j++)
							 {
								 if(firstTime)
									 valToPrint = valToPrint + lineArr[k].substr(0,maxLength);
								 else
									 valToPrint = valToPrint + "\n" + lineArr[k].substr(0,maxLength);
								 firstTime = false;
								 lineLength = lineArr[k].substr(0,maxLength);
								 lineArr[k] = lineArr[k].substr(maxLength);
							 }
							 remainder = lineArr[k];
						}
						else
						{
							if(firstTime)
								valToPrint = valToPrint + lineArr[k];
							else
								valToPrint = valToPrint + "\n" + lineArr[k];
							firstTime = false;
							lineLength = lineArr[k];
						}
					}
					else
					{
						if(lineLength!='' || k!=0)
						{
							valToPrint = valToPrint + " " + lineArr[k];
							lineLength = lineLength + " " + lineArr[k];
							firstTime = false;
						}
						else if(lineArr[k] != 0)
						{
							valToPrint = valToPrint + lineArr[k];
							lineLength = lineLength + lineArr[k];
							firstTime = false;
						}
					}
				}
				else
				{
					if(lineLength!='' && remainder !='')
					{
						valToPrint = valToPrint + " " + remainder;
						lineLength = lineLength + " " + remainder;
						firstTime = false;
					}
					else if(remainder !='')
					{
						valToPrint = valToPrint + remainder;
						lineLength = lineLength + remainder;
						firstTime = false;
					}
					
					word = lineArr[k];
					if(lineLength != '' && word!='')
						word = lineLength + " " + word;
					else
						word = lineLength + word;
					
					if(word.length > maxLength)
					{
						if(lineArr[k].length > maxLength)
						{
							 var count = Math.floor(lineArr[k].length/maxLength);
							 for(var j=1; j<=count; j++)
							 {
								 if(firstTime)
									 valToPrint = valToPrint + lineArr[k].substr(0,maxLength);
								 else
									 valToPrint = valToPrint + "\n" + lineArr[k].substr(0,maxLength);
								 firstTime = false;
								 lineLength = lineArr[k].substr(0,maxLength);
								 lineArr[k] = lineArr[k].substr(maxLength);
							 }
							 remainder = lineArr[k];
						}
						else
						{
							if(firstTime)
								valToPrint = valToPrint + lineArr[k];
							else
								valToPrint = valToPrint + "\n" + lineArr[k];
							firstTime = false;
							lineLength = lineArr[k];
						}
					}
					else
					{
						if(lineLength!='' || k!=0)
						{
							valToPrint = valToPrint + " " + lineArr[k];
							lineLength = lineLength + " " + lineArr[k];
							firstTime = false;
						}
						else if(lineArr[k] != '')
						{
							valToPrint = valToPrint + lineArr[k];
							lineLength = lineLength + lineArr[k];
							firstTime = false;
						}
					}
				}
			}
		 }
		 else
		 {
			if(i==0)
				valToPrint = valArr[i];
			else
				valToPrint = valToPrint + "\n" + valArr[i];
			lineLength = valArr[i];
		 }
	 }
	 if(remainder != '')
	 {
		 if(valToPrint !='')
			 valToPrint = valToPrint + "\n" + remainder;
		 else
			 valToPrint = valToPrint + remainder; 
	 }
		 
	 $('#'+textAreaId).val(valToPrint);
}

//already present in clause.js
/*function imposeMaxLength(Object, MaxLen) {
	return (Object.value.length <= MaxLen - 1);
}*/
var isCustomizeNameAddressFormChanged = "N";
var insertOn = false;
var insertClickCount = 0;
var ctrlDown = false;
var shiftDown = false;

$(function() {
	
	isCustomizeNameAddressFormChanged = "N";
	$('#bookingHeaderForm').validationEngine('attach');

	$('#bookingHeaderForm :input').change(function()
			{
		isCustomizeNameAddressFormChanged = "Y";
			});

	$('#bookingHeaderForm select').change(function()
			{
		isCustomizeNameAddressFormChanged = "Y";
			});

	document.title = 'GATES: Customize Name And Address';
	/*if($('#bookingNumber').html()!='')
		$(document).attr('title',document.title+' - '+$('#bookingNumber').html());
	else{
		if($('#bookingNotFound').val()=='Y' && $('#navigationFromMenu').val()!='Y'){
			showErrorMessage('msgDiv', 'Booking not found.');
		}
		$(document).attr('title',document.title);
	}*/
		

	$("[id^=custcb]").each(function() {
		var idName = $(this).attr("id");
		var custcbNo = idName.substr(idName.length - 1);

		if ($(this).is(':checked')) {
			$("#customta" + custcbNo).css('color', 'green');
			//$("#customta" + custcbNo).removeAttr("disabled");
			$("#resetcb" + custcbNo).removeAttr("disabled");
		} else {
			$("#customta" + custcbNo).css('color', 'black');
			//$("#customta" + custcbNo).attr("disabled", "disabled");
			$("#resetcb" + custcbNo).attr("disabled", "disabled");
		}
		
		$("#custcb" + custcbNo).attr("disabled", "disabled");
	});
	
	
	$("[id^=default]").each(function() {
		var valToPrint = "";
		var i=0;
		var valArr = $(this).html().split("\n");
		for(i=0;i<valArr.length-1;i++){
			valToPrint+=valArr[i]+"<br>";
		}
		valToPrint+=valArr[i];
		$(this).html(valToPrint);
	});
	
	
	checkForEnableDisableSave();
	
	$('#custNameAddSave').click(function() {
						if($('#bookingNumber').val()==''){
							$('#bookingNumber').validationEngine('showPrompt', 'Please re-enter Booking Number to continue.', 'error', 'topRight', true);
							return;
						}
						clearResponseMessages('msgDiv');
						var gridDiff = 0;

						var validationOK = true;
						var tradeType = $("#tradeType").val();
						$("[id^=customta]")
								.each(
										function() {
											var isValid = true;
											var noOfLines = $(this).attr("value").split("\n");
											var currentElement = $(this);
											var idName = $(this).attr("id");
											var index = idName.substr(idName.length - 1);
											
											if ($.trim($(this).attr("value")) == '') {
												isValid = false;
												validationOK = false;
												$(currentElement).validationEngine('showPrompt','Customize Name and Address should not be empty.','error','topRight',true);
											} else if(tradeType == 'domestic' && noOfLines.length > 6) {
												isValid = false;
												validationOK = false;
												$(currentElement).validationEngine('showPrompt','Max. 6 lines can be entered.','error','topRight',true);
											} else if(tradeType != 'domestic' && noOfLines.length > 8) { 
												isValid = false;
												validationOK = false;
												$(currentElement).validationEngine('showPrompt','Max. 8 lines can be entered.','error','topRight',true);
											}
											else{
												if($('#custcb' + index).is(':checked')){
													$.each(noOfLines,function(index,value){
														//$('#bookingHeaderForm').validationEngine('hide');
														$('.formError').remove();
														if(tradeType == 'domestic' && $.trim(value).length > 40) {
															isValid = false;
															validationOK = false;
															var start = currentElement[0].value.indexOf(value);
															var end = start + value.length;
															$(currentElement).validationEngine('showPrompt','Cannot have more than 40 characters.','error','topRight',true);
															createSelection($(currentElement)[0], start, end);
															return false;
														} else if(tradeType != 'domestic' && $.trim(value).length > 50) {
															isValid = false;
															validationOK = false;
															$(currentElement).validationEngine('showPrompt','Cannot have more than 50 characters.','error','topRight',true);
															return false;
														}
													}
													);
												}
											}
											
											if(isValid == true){
												$(currentElement).validationEngine('hide');
												if($('#party' + index).val() == 'Shipper') {
													if($('#custcb' + index).is(':checked')){
														if($('#navigationFromMenu').val()=='N'){
															//window.opener.$('input[name="shipper\\.organizationName"]').css('color', 'green');
														}
													}
													else{
														if($('#navigationFromMenu').val()=='N'){
															//window.opener.$('input[name="shipper\\.organizationName"]').css('color', 'black');
														}
													} 
													gridDiff++;
												}
												
												if($('#party' + index).val() == 'Consignee') {
													if($('#custcb' + index).is(':checked')){
														if($('#navigationFromMenu').val()=='N'){
															//window.opener.$('input[name="consignee\\.organizationName"]').css('color', 'green');
														}
													}else{
														if($('#navigationFromMenu').val()=='N'){
															//window.opener.$('input[name="consignee\\.organizationName"]').css('color', 'black');
														}
													}
														
													
													gridDiff++;
												}
												
												if($('#custcb' + index).is(':checked') && ($('#party' + index).val() != 'Shipper' || $('#party' + index).val() != 'Consignee')) {
													if($('#navigationFromMenu').val()=='N'){
														//window.opener.$('#gridIdForParties').jqGrid('setCell', (index-gridDiff), 'organizationName','','',{style: 'color : green'},'');
													}
												} else {
													if($('#navigationFromMenu').val()=='N'){
														//window.opener.$('#gridIdForParties').jqGrid('setCell', (index-gridDiff), 'organizationName','','',{style: 'color : black'},'');
													}
													
												}
											}
											if(!isValid) {
												return isValid; 
											}
										});

						if (validationOK == false)
							return false;
						else{
							$("[id^=customta]").each(function() {
								$(this).validationEngine('hide');
							});
						}
						
						showInfoMessage('msgDiv','Saving Customized Information ...');
						
						var custCheckBoxList = '';
						
						$("[id^=custcb]").each(function() {
							
							if ($(this).is(':checked')) {
								custCheckBoxList+='Y';
							} else {
								custCheckBoxList+='N';
							}
						});

						var custNameAdd = $('#bookingHeaderForm').formSerialize();

						$
								.ajax({
									type : "POST",
									url : _context +"/booking/customizednameandaddress/save",
									data : custNameAdd+"&custCheckBoxList="+custCheckBoxList,
									success : function(responseText) {
										
										$("[id^=custcb]").each(function() {
											var idName = $(this).attr("id");
											var custcbNo = idName.substr(idName.length - 1);

											if ($(this).is(':checked')) {
												$("#customta" + custcbNo).css('color', 'green');
											} else {
												$("#customta" + custcbNo).css('color', 'black');
											}
										});
										
										showSuccessMessage('msgDiv','Customized Information saved successfully.');
										isCustomizeNameAddressFormChanged = "N";
									}
								});

					});

	$('#custNameAddCancel').click(function() {
		if(isCustomizeNameAddressFormChanged == 'Y'){
			var isConfirm = confirm("All the unsaved changes will be discarded.Please confirm!");
			if (isConfirm) {
				if($('#bookingNumber').val()!='' && $('#bookingNumber').val().length >=7 && $('#bookingNumber').val().indexOf('T') !=-1){
					document.location.href= _context +"/booking/template/showTemplateForm?templateNumber="+$('#bookingNumber').val();
				}else{
					document.location.href= _context +"/booking/showForm?checkLastBookingLoaded=true&bookingNumber=";
				}
			}
		}
		else{
			if($('#bookingNumber').val()!='' && $('#bookingNumber').val().length >=7 && $('#bookingNumber').val().indexOf('T') !=-1){
				document.location.href= _context +"/booking/template/showTemplateForm?templateNumber="+$('#bookingNumber').val();
			}else{
				document.location.href= _context +"/booking/showForm?checkLastBookingLoaded=true&bookingNumber=";
			}
		}
	});

	$("[id^=resetcb]").click(function() {
		var idName = $(this).attr("id");
		var resetcbNo = idName.substr(idName.length - 1);
		$("#customta" + resetcbNo).css('color', 'black');
		$("#customta" + resetcbNo).validationEngine('hide');
		$("#custcb" + resetcbNo).attr('checked', false);

		if ($(this).is(':checked')) {
			var valToPrint = "";
			var i=0;
			var valArr = $("#default" + resetcbNo).html().split("<br>");
			for(i=0;i<valArr.length-1;i++){
				var varA = valArr[i].replace(/&amp;/g, "&");
				valToPrint+=varA+"\n";
				
			}
			var varB = valArr[i].replace(/&amp;/g, "&");
			valToPrint+=varB;
			$("#customta" + resetcbNo).attr("value",valToPrint);
		}
		else{
			$(this).attr("disabled", "disabled");
		}
		
		checkForEnableDisableSave();
	});

	$("[id^=custcb]").click(function() {
		var idName = $(this).attr("id");
		var custcbNo = idName.substr(idName.length - 1);
		$("#customta" + custcbNo).css('color', 'black');
		$("#customta" + custcbNo).validationEngine('hide');
		$("#resetcb" + custcbNo).attr('checked', false);
		
		if ($(this).is(':checked')) {
			$("#resetcb" + custcbNo).removeAttr("disabled");
		} else {
			$("#resetcb" + custcbNo).attr("disabled", "disabled");		
			}
		
		checkForEnableDisableSave();
		
	});
	//changed for 22427
	$("[id^=customta]").bind('paste', function(event) {
		var idName = $(this).attr("id");
		
		var tradeType = $("#tradeType").val();
		var charsAllowedInLine = 0;

		if(tradeType == 'domestic') {
			charsAllowedInLine = 40;
		} else {
			charsAllowedInLine = 50;
		}
		var textStr = "";
		var text = "";
		var newLineIndex = -1;
		
		setTimeout(function() {
			text = $('#' + idName).val();
			var selectionIndex = $('#' + idName)[0].selectionStart;
	    	if(text.length < charsAllowedInLine ) {
	    		$('#' + idName).val(text);
	    	} else {
	    		while($.trim(text) != '') {
        			newLineIndex = text.indexOf("\n", 1); 
        			if(newLineIndex > -1 && newLineIndex <= (charsAllowedInLine + 1)) {
        				if(newLineIndex == (charsAllowedInLine + 1)) {
        					textStr += text.substring(0, charsAllowedInLine) + "\n";
	            			text = text.substr(charsAllowedInLine);
        				} else {
	            			textStr += text.substring(0, (newLineIndex + 1));
	            			text = text.substr(newLineIndex + 1);
        				}
            		} else {
								if(text.length > charsAllowedInLine)
								{
								var line = wordWrap(text, charsAllowedInLine);
								
            			textStr += text.substr(0, line.indexOf("\n", 1))+"\n";
						text = text.replace(/^\n+/,'').substr(line.indexOf("\n", 1)+1);
						}
						else
						{
						textStr += text.substr(0,charsAllowedInLine)+"\n";
						text = text.replace(/^\n+/,'').substr(charsAllowedInLine);
						}
            			
            			selectionIndex++;
            		}
	        	}
	    		$('#' + idName).val(textStr.substr(0, (textStr.length )));
	    		
	    		if($('#' + idName).val().substr(selectionIndex - 1, 1) == '\n') {
	    			$('#' + idName)[0].setSelectionRange(selectionIndex-1, selectionIndex-1);
		        } else {
		        	$('#' + idName)[0].setSelectionRange(selectionIndex -1, selectionIndex -2);
		        }
	    	}
		}, 50);
		
    });
	
//Added for 22427
function wordWrap(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
    do {                    
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        // Inserts new line at maxWidth position, the word is too long to wrap
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
            done = true;
    } while (!done);

    return res;
}

function testWhite(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
};


//changed for 22427
	$("[id^=customta]").live('keydown', function(event) {
		var keyCode = event.keyCode; 
		if(keyCode != 9) {			
			if(keyCode == 17) {
				ctrlDown = true;
			} else if(keyCode == 16) {
				shiftDown = true;
			}

			var idName = $(this).attr("id");
			var originalAddress = $('#' + idName).val();
			if(!ctrlDown) {
				setTimeout(function() {
					var tradeType = $("#tradeType").val();
					var linesAllowed = 0;
					var charsAllowedInLine = 0;

					if(tradeType == 'domestic') {
						linesAllowed = 6;
						charsAllowedInLine = 40;
					} else {
						linesAllowed = 8;
						charsAllowedInLine = 50;
					}

					var data = "";
					
					var customAddress = $('#' + idName).val();
					var selectionIndex = $('#' + idName)[0].selectionStart;
					var lines = customAddress.split('\n');
					var currentRow = customAddress.substr(0, selectionIndex).split("\n").length;
					var startOfLineIndex = customAddress.substr(0, selectionIndex).lastIndexOf('\n') + 1;
					var inputPos = selectionIndex - startOfLineIndex;
					if (lines.length > linesAllowed || (lines.length > linesAllowed && keyCode == 13) || customAddress.substr(selectionIndex).length -1 >= ((charsAllowedInLine * (linesAllowed - currentRow)) + (charsAllowedInLine - inputPos + (linesAllowed - currentRow)))) {
						//if (lines.length > linesAllowed || (lines.length == linesAllowed && lines[linesAllowed - 1].length > charsAllowedInLine) || (lines.length == linesAllowed && lines[linesAllowed - 1].length <= charsAllowedInLine && keyCode == 13) || (lines.length == linesAllowed && lines[currentRow - 1].length > charsAllowedInLine) || (lines.length == linesAllowed && lines[currentRow - 1].length <= charsAllowedInLine && keyCode == 13)) {
						$('#' + idName).val(originalAddress);

						event.preventDefault();
						return;
					} else {
						for (var lineIndex = 0 ; lineIndex in lines ; lineIndex++) {
							if(currentRow == lineIndex + 1) {
								if(lines[lineIndex].length <= charsAllowedInLine) {
									data += lines[lineIndex] + '\n';
								} else {
									if(currentRow == linesAllowed) {
										data += originalAddress.split('\n')[lineIndex];
									} else {
										if(lines[lineIndex].length > charsAllowedInLine) {
											var remainingRows = linesAllowed - currentRow;
											if(customAddress.substr(selectionIndex).length -1 <= ((charsAllowedInLine * (linesAllowed - currentRow)) + (charsAllowedInLine - inputPos + (linesAllowed - currentRow)))) {
												
													var str = wordWrap(lines[lineIndex], charsAllowedInLine);
													var str1= lines[lineIndex].substr(str.length); 
												//data += lines[lineIndex].substr(charsAllowedInLine);
												if(lines[parseInt(lineIndex) + 1] != undefined) {
												data += str;
												if(lines.length > linesAllowed-1)
												{
														alert ("Max Rows limit reached");

												}
												else
												{
												data += str1+'\n';
												}
												
													//lines[parseInt(lineIndex)]=str;	
													//lines[parseInt(lineIndex) + 1] = str1 +' '+ lines[parseInt(lineIndex) + 1];
												} else {
													//lines[parseInt(lineIndex) + 1] = lines[lineIndex].substr(charsAllowedInLine);
													
													lines[parseInt(lineIndex)]=str;
													lines[parseInt(lineIndex) + 1] = str1;
												}
												while(remainingRows > 0) {
													var wrapText = '';
													lineIndex = lineIndex + 1;
													if(lines[lineIndex] != undefined) {
														if(lines[lineIndex].length < charsAllowedInLine) {
															data += wrapText + lines[lineIndex].substr(0, charsAllowedInLine) + '\n';
															wrapText = '';
														} else if(lines[lineIndex].length == charsAllowedInLine) {
															if(wrapText == '') {
																data += lines[lineIndex].substr(0, charsAllowedInLine) + '\n';
															} else {
																data += wrapText + lines[lineIndex].substr(0, charsAllowedInLine - 1) + '\n';
																wrapText = lines[lineIndex].substr(charsAllowedInLine - 1);
															}
														}  else {
														str = wordWrap(lines[lineIndex], charsAllowedInLine);
													str1= lines[lineIndex].substr(str.length); 
														
															data += wrapText +str;
															wrapText = str1;
														}
														if(wrapText != '') {
															if(lines[parseInt(lineIndex) + 1] != undefined) {
																lines[parseInt(lineIndex) + 1] = wrapText+' '+ lines[parseInt(lineIndex) + 1]; 
															} else {
																lines[parseInt(lineIndex) + 1] = wrapText;
															}

														}
													}
													remainingRows--;
												}	

											} else {
												data = originalAddress;
											}
										}
									}
								}
							} else {
								data += lines[lineIndex] + '\n';
							}
						}
					}

					if(data.substr(data.length - 1, data.length) == '\n') {
						$('#' + idName).val(data.substr(0, data.length - 1));
					} else {
						$('#' + idName).val(data);
					}

					if(!shiftDown) {
						if($('#' + idName).val().substr(selectionIndex - 1, 1) == '\n') {
							if((keyCode >= 37 && keyCode <= 40) || keyCode == 13) 
								$('#' + idName)[0].setSelectionRange(selectionIndex, selectionIndex);
							else 
								$('#' + idName)[0].setSelectionRange(selectionIndex + 1, selectionIndex + 1);
						} else {
							$('#' + idName)[0].setSelectionRange(selectionIndex, selectionIndex);
						}
					}
				}, 50);       
			}
		}
	}).keyup(function(event) {
    	if(event.keyCode == 17) {
    		ctrlDown = false;
    	} else if(event.keyCode == 16) {
    		shiftDown = false;
    	}
    	
    });
	
	$("[id^=customta]").blur(function() {
		var idName = $(this).attr("id");
		var addressIndex = idName.substr(idName.length - 1);
		var customAddress = $('#' + idName).val();
		customAddress = $.trim(customAddress.replace(/\n/g, ""));
		
		var customizedLines = $('#' + idName).val().split('\n');
		var defaultLines = $('#default' + addressIndex).html().split("<br>");
		
		var srcLines;
		var targetLines;
		if(customizedLines.length > defaultLines.length) {
			srcLines = customizedLines; 
			targetLines = defaultLines;
		} else if(customizedLines.length <= defaultLines.length) {
			srcLines = defaultLines;
			targetLines = customizedLines; 
		}
		$.each(srcLines, function(index, value) {
			if($('<div />').html($.trim(value)).text() == $('<div />').html($.trim(targetLines[index])).text()) {
				$("#custcb" + addressIndex).attr('checked', false);
				$("#resetcb" + addressIndex).attr("disabled", "true");
				$("#customta" + addressIndex).css('color', 'black');
			} else {
				$("#custcb" + addressIndex).attr('checked', true);
				$("#resetcb" + addressIndex).removeAttr("disabled");
				$("#customta" + addressIndex).css('color', 'green');
				
				return false;
			}
		});
		
		var linesAllowed = 0;
		if($.trim($("#tradeType").val()) == 'domestic') {
			linesAllowed = 6;
		} else {
			linesAllowed = 8;
		}
		if(customizedLines.length > linesAllowed) {
			$('#' + idName).validationEngine('showPrompt','Max. ' + linesAllowed + ' lines can be entered.','error','topRight',true);
		}
		
		$("#resetcb" + addressIndex).attr('checked', false);
		checkForEnableDisableSave();
	});
	if($('#navigationFromMenu').val()!='N' && $('#bookingNotFound').val()!='Y'){
		loadHeader();
	}
	
	/*if($('#navigationFromMenu').val()=='N')
		$('#custNameAddCancel').show();
	else
		$('#custNameAddCancel').hide();*/
	$('#custNameAddCancel').show();
	
	$('#bookingNumber').focus();
	tabSequence('#bookingHeaderForm',false,false);
	
	/*$(document).keydown(function(event) {
		var keyCode = event.keyCode; 
		if(keyCode == 45 && insertClickCount % 2 == 0) {
			insertClickCount++;
			insertOn = true;
		} else if(keyCode == 45 && insertClickCount % 2 != 0) {
			insertOn = false;
			insertClickCount++;
		}
	});*/
	
});

function loadHeader(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/loadCommonHeader",
		success: function(responseText){
			if (responseText.messages.error.length == 0) {
				showJSON(responseText);
			}
		}
	});
}

function checkForEnableDisableSave(){
	
	var isCustCBSelected = false;
	var isResetCBSelected = false;

	$("[id^=custcb]").each(function() {
		if ($(this).is(':checked')) {
			isCustCBSelected = true;
			return false;
		}
	});

	$("[id^=resetcb]").each(function() {
		if ($(this).is(':checked')) {
			isResetCBSelected = true;
			return false;
		}
	});
	
	if((isCustCBSelected == true)||(isResetCBSelected == true))
	{
		if(isCustomizeNameAddressModifiable == true) {
			$('#custNameAddSave').removeAttr("disabled");
		}
		else {
			$('#custNameAddSave').attr("disabled", "disabled");
		}
	}
	else{
		$('#custNameAddSave').attr("disabled", "disabled");
	}
}


function showSuccessMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_success">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showErrorMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_error">' + text + '</div>');
	window.scrollTo(0, 0);
}

function clearResponseMessages(msgDivId) {
	$('#' + msgDivId).html("");
}

function findNthString(str, search, pos){
    var count = 0;
    var index = str.indexOf(search);
    while(count != pos){
        index = str.indexOf(search, index+1);
        count++;
    }
    return index;
}

function createSelection(field, start, end) {
    if( field.createTextRange ) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}

function formatAddressWhenInsertModeOff(idName, lines, currentRow, cursorPos, selectionIndex, lines, currentRow, cursorPos, selectionIndex, linesAllowed, charsAllowedInLine, event) {
	var data = "";
	if (lines.length > linesAllowed && (lines.length >= linesAllowed && lines[currentRow - 1].length == charsAllowedInLine) || (lines.length >= linesAllowed && lines[currentRow - 1].length < charsAllowedInLine && event.keyCode == 13)) {
    	if(lines.length > linesAllowed) {
    		var textStr = $('#' + idName).val();
    		$('#' + idName).val(textStr.substr(0, findNthString(textStr, '\n', (linesAllowed-1))));
    	}
    	$('#' + idName)[0].setSelectionRange(selectionIndex, selectionIndex);
        event.preventDefault();
        return;
    } else {
    	
        for (var lineIndex = 0 ; lineIndex < lines ; lineIndex++) {
        	var inputPos = selectionIndex - cursorPos;
        	if(currentRow == parseInt(lineIndex) + 1) {
        		if(lines[lineIndex].length <= charsAllowedInLine) {
        			data += lines[lineIndex].substr(0, inputPos) + lines[lineIndex].substr(inputPos + 1) + '\n';
        		} else if(lines[lineIndex].length > charsAllowedInLine) {
        				if(inputPos <= charsAllowedInLine) {
        					data += lines[lineIndex].substr(0, inputPos) + lines[lineIndex].substr(inputPos + 1, charsAllowedInLine) + '\n';
        				} else {
        					data += lines[lineIndex].substr(0, charsAllowedInLine) + '\n';
        				}
        				var wrapText = lines[lineIndex].substr(charsAllowedInLine);
        				if(lines[parseInt(lineIndex) + 1] != undefined && lines[parseInt(lineIndex) + 1].length >= 0) {
        					data += wrapText + lines[parseInt(lineIndex) + 1].substr(1, charsAllowedInLine - wrapText.length) + '\n';
        				} else {
        					if(lineIndex <= linesAllowed - 2) {
        						lines[parseInt(lineIndex) + 1] = '\n' + wrapText;
	        					data += lines[parseInt(lineIndex) + 1];
        					} else {
        						data += lines[lineIndex].substr(0, charsAllowedInLine);
        					}
        				}
    				lineIndex = lineIndex + 1;
        		}
        	} else {
        		data += lines[lineIndex] + '\n';
        	}
        }
    }
	
	return data; 
}
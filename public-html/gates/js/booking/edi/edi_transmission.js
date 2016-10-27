var rowIndex = 0;
$(document).ready(function () {
	
	createEDIGrid();
	
	$('#ediShmtRequestId').bind('blur', function(event) {	
		var ediShmtRequestId = $.trim($('#ediShmtRequestId').val());
		if(ediShmtRequestId != undefined && ediShmtRequestId !='' && ediShmtRequestId > 0) {
			loadHeader(ediShmtRequestId, $.trim($('#ediShmtRequestId').val()));
		}
    });
	
	$('#ediShmtRequestId').change(function(){
		var ediShmtRequestId = $.trim($('#ediShmtRequestId').val());
		if(ediShmtRequestId != undefined && ediShmtRequestId !='' && ediShmtRequestId > 0) {
			loadHeader(ediShmtRequestId, $.trim($('#ediShmtRequestId').val()));
		}
		clearForm();
	});
	
	$('#ediShmtRequestId').bind('keydown', function(event) {
		//keyCode for enter key is 13 and for tab out is 9
		if(event.keyCode == 13 || event.keyCode == 9 || event.which == 13 || event.which == 9) {
			
			var ediShmtRequestId = $.trim($('#ediShmtRequestId').val());
			if(ediShmtRequestId != undefined && ediShmtRequestId !='' && ediShmtRequestId > 0) {
				loadHeader(ediShmtRequestId, $.trim($('#ediShmtRequestId').val()));
			}
		}
    });
	
	//For Edi Booking, Predictive Search on shipment no#
	 var url = _context+'/cas/autocomplete.do?method=getEdiTransBkNoDetails&searchType=286'; 
		$('#shipmentNumber').gatesAutocomplete({	
			source: url,
			mustMatch: true,
			minLength: 7,
			name: 'Booking Number',
			formatItem: function(data) {
				return data.shipNo;
			},
			formatResult: function(data) {
				return data.shipNo;
			}, 
			select: function(data) {
				$('#msgDiv').html("<div class=\"message_info\">Loading EDI booking "+ $("#shipmentNumber").val() +" ...</div>");
				$('#msgDiv').show();
				var shmtNo = $('#shipmentNumber').val();
				clearForm();
				$('#shipmentNumber').val(shmtNo);
				$('#ediShmtRequestId').val(data.ediId);
				$('#versionNumber').val(data.version);
				$('#bookingStatusCode').text(data.bkStatus);
				$('#statusCode').text(data.ediStatus);
				$('#tradingPartnerCode').text(data.tp);
				$('#currentRecord').text(data.curVer);
				$('#shipperShipmentNumber').text(data.shipperShipID);
				$('#billExists').text(data.billExist);
				
				$('#msgDiv').html("<div class=\"message_info\">Successfully Loaded</div>");
				$('#searchEDI').removeAttr('disabled');
			}
		});
		
	$('#searchEDI').click(function() {
		$('#searchEDI').attr('disabled', 'disabled');
		$('#msgDiv').html("<div class=\"message_info\">Loading EDI Transmission records ...</div>");
		$('#msgDiv').show();
		
		$('#lineDataDescription').css({ 'display': 'none'});
		$('#lineDataDesc').text('');
		
		var urlStr = _context + "/booking/edi/transmission/search";
		var ediForm = $('#ediForm').formSerialize();
		$.ajax({
			type: "POST",
			url: urlStr,
			data: ediForm, 
			success: function(responseText) {
				showResponseMessages('msgDiv', responseText);
				$('#msgDiv').show();
				$('#searchEDI').removeAttr('disabled');
				if((responseText.data != undefined || responseText.data != null) && responseText.data.length > 0) {
					$('#ediSearchResults').css({ 'display': 'block'});
				}
				$("#ediTransmissionGrid").trigger('reloadGrid');
			}
		});
	});
	
	$('#ediShmtRequestId').change(function() {
		var ediShmtRequestId = $('#ediShmtRequestId').val();
		if($.trim($('#shipmentNumber').val()) != undefined && $.trim($('#shipmentNumber').val()) != '') {
			clearForm();
			$('#ediShmtRequestId').val(ediShmtRequestId);
		}
	});
	
	$('#shipmentNumber').change(function() {
		var shipmentNumber = $('#shipmentNumber').val();
		if($.trim($('#ediShmtRequestId').val()) != undefined && $.trim($('#ediShmtRequestId').val()) != '') {
			clearForm();
			$('#shipmentNumber').val(shipmentNumber);
		}
	});
	
	if(_isLineDataEdit)
	{
		$('#ui-icon-pencil').click(function() {
			$('#'+gridId +' tbody tr#'+rowId+' div.ui-inline-edit').show();
			$('#lineDataDesc').text($.trim(jQuery('#ediTransmissionGrid').getRowData(rowId).lineData));
		});
	}
	
	$('#clearEDIForm').click(function() {
		clearForm();
		$('#recordType').val($("#recordType option:first").val());
		$('#searchEDI').attr('disabled', 'disabled');
		$('#ediShmtRequestId').trigger('focus');
	});
	
	$('#versionNumber').change(function() {
		var versionNumber = $('#versionNumber').val();
		var shipmentNumber = $('#shipmentNumber').val();
		clearForm();
		$('#shipmentNumber').val(shipmentNumber);
		$('#versionNumber').val(versionNumber);
	});
	
	if($('#ediShmtRequestId').val() != undefined && $.trim($('#ediShmtRequestId').val()) != '') {
		var event = jQuery.Event('blur');
		event.keyCode = 13;
		event.which = 13;
		$('#ediShmtRequestId').trigger(event);
	}
	
	$('#recordTypeInSearch').val($('#recordType').val());
	
	$('#recordType').change(function() {
		$('#recordTypeInSearch').val($('#recordType').val());
	});
	
	$('#ediShmtRequestId').focus();
	
	if($.trim($('#userFrom').val()) != 'menu') {
		$('#exitEDI').show();
	} else{
		$('#exitEDI').hide();
	}
	
	$('#exitEDI').click(function() {
		var userFrom = $.trim($('#userFrom').val());
		var bkRefNo = "";
		if(userFrom.indexOf('|') > -1) {
			if(userFrom.split('|').length > 0) { 
				bkRefNo = userFrom.split('|')[1];
				if($.trim(bkRefNo) == '') 
					bkRefNo = null;
			} else 
				bkRefNo = null;
		}
		if(userFrom == 'ediQueue') {
			document.location.href = _context + "/cas/ediBookingQueueSearch.do";
		} else if(userFrom.length > 8 && userFrom.substr(0, 9) == 'ediDetail') {
			document.location.href = _context + '/booking/edi/showForm?ediBkngRefNum=' + bkRefNo + '&ediShmtReqId=' + $.trim($('#ediShmtRequestId').val());
		}
	});
	tabSequence('#ediForm',false,false);
});		


var customloadComplete = function() {
	
	if(!_isLineDataEdit)
	{
		//$('.ui-icon-trash').hide();
		$('.ui-icon-pencil').hide();
	}
	
	$('tr#tr_ediTransmissionLineNumber').hide();

	$('tr#FormError').hide();
	$('tr#FormError td').html('');
	$('#lineDataDesc').text($.trim(jQuery('#ediTransmissionGrid').getRowData(rowIndex).lineData));
	// to wrap-up text
	//$('#ediTransmissionGrid tbody tr td').css('white-space', 'normal');
};

function showResponseMessages(msgDivId, responseText)  { 
  	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for (var i=0; i<len; i++) {
				
				messageContent += '<div class="message_error">' + array[i] + '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_warning">' + array[i] + '</div>';
			}
		}
		
		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_info">' + array[i] + '</div>';
			}
		}

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for (var i=0; i<len; i++) {
				messageContent += '<div class="message_success">' + array[i] + '</div>';
			}
		}
		if(messageContent!='')
		{
			$('#'+msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
  	}
}

function showLineData(id) {
	
	var rowId = id.split('=')[1];
	$('#lineDataDescription').css({ 'display': 'block'});
	$('#lineDataDesc').text($.trim(jQuery('#ediTransmissionGrid').getRowData(rowId).lineData));
	$('#lineDataDesc').css('word-wrap', 'break-word');
	
}

function clearForm() {
	$('#ediShmtRequestId').val('');
	$('#shipmentNumber').val('');
	$('#versionNumber').val('');
	$('#bookingStatusCode').text('');
	$('#statusCode').text('');
	$('#tradingPartnerCode').text('');
	$('#currentRecord').text('');
	$('#shipperShipmentNumber').text('');
	$('#billExists').text('');
	
	$('#ediSearchResults').css({ 'display': 'none'});
	$('#lineDataDescription').css({ 'display': 'none'});
	$('#msgDiv').html('');
	$('#msgDiv').hide();
	$('#commentsDiv').hide();
	
}

function createEDIGrid() {
	var colNames = ['Line No.', '', 'Line Data', ''];
	var colModel = [

           		{name:'ediTransmissionLineNumber', index:'ediTransmissionLineNumber', width:50, editable:false, formatter : 'showlink',
					formatoptions : {
						baseLinkUrl : "javascript:",
						showAction : "showLineData('",
						addParam : "');"}
           		},
           		{name:'lineData',index:'lineData', width:850, align:'left', hidden:true}, 
           		{name:'lineDataInGrid',index:'lineDataInGrid', width:850, align:'left',  editable:true, editoptions: {maxlength:73}, title: false, 
           			formatter : function(cellvalue, options, rowdata){
							return "<div title='"+rowdata.lineData+"' >"+cellvalue+"</div>";
					}
           		},
                {name:'actions', index:'actions', width:55, align:"center",  
                   	 search:false, sortable:false, formatter:'actions', 
                   	 formatoptions:{keys:true, delbutton : false, 
                   		afterSave: function(rowId) {
							$("#ediTransmissionGrid").trigger('reloadGrid');
							
							$('#msgDiv').html("<div class=\"message_success\">Line data updated successfully</div>");
							$('#msgDiv').show();
							rowIndex = rowId;
							return true;
						 }, 
						 onEdit: function(rowId) {
							$('#lineDataDesc').text($.trim(jQuery('#ediTransmissionGrid').getRowData(rowId).lineData));
							$('#' + rowId + '_lineDataInGrid').val(jQuery('#ediTransmissionGrid').getRowData(rowId).lineData);
							$('#' + rowId + '_lineDataInGrid').attr('maxlength', 512);
							return true;
						 }
                   	 }
               	 }
                ]; 
	
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "ediTransmissionLineNumber"
		};
	
	createGrid(
			"ediTransmissionGrid",
			"ediTransmissionPager",
			_context+'/booking/edi/transmission/loadEDIGrid', 
			'', 
			_context+'/booking/edi/transmission/editEDIGrid', 
			'', 
			'',
			colNames, 
			colModel, 
			'Line',
			135, 
			'5',
			[5,10,15,20,25,30,35,40,45,50,55,60,65,70],
			false, false, false, false,
			jsonReader,
			false,true,true,false,true,false,false,false,
			customloadComplete,false,true);
}

function loadHeader(ediShmtRequestId, shipmentNumber) {
	$('#msgDiv').html("<div class=\"message_info\">Loading EDI booking "+ $("#shipmentNumber").val() +" ...</div>");
	$('#msgDiv').show();	
	$.ajax({
		type: "GET",
		url: _context+'/booking/edi/transmission/loadHeader', 
		data: {ediShmtRequestId: $("#ediShmtRequestId").val(), shipmentNumber: $("#shipmentNumber").val()},
		success: function(responseText){
			if (responseText.messages.error.length > 0) {
				var ediId = $("#ediShmtRequestId").val();
				clearForm();
				$("#ediShmtRequestId").val(ediId);
				$('#searchEDI').attr('disabled', 'disabled');
			} else {
				$('#ediForm').loadJSON(responseText.data);
				$('#bookingStatusCode').text(responseText.data.bookingStatusCode);
				$('#statusCode').text(responseText.data.statusCode);
				$('#tradingPartnerCode').text(responseText.data.tradingPartnerCode);
				$('#currentRecord').text(responseText.data.isCurrentRecord);
				$('#shipperShipmentNumber').text(responseText.data.shipperShipmentNumber);
				$('#billExists').text(responseText.data.billExists);
				$('#recordType').val($('#recordTypeInSearch').val());
				$('#searchEDI').removeAttr('disabled');
			}
			showResponseMessages('msgDiv', responseText);
			$('#msgDiv').show();
		}
	});
}
$(document).ready(function () {
	var totalCharges = $.trim($("#totalCharges").text());
	if(totalCharges == '') {
		$("#totalCharges").text("$0.00");
	} else {
		$("#totalCharges").text("$" + totalCharges);
	}

	var maxLengthForPayment = 6;
	
	var colNames = [' ', 'Amount($)','Pay Type','Paid By','Reference','CC Authorization','Name','User Id','Date & Time', '', ' '];
	
	var colModel = [
            		 {name:'sequenceNumberDs',index:'sequenceNumberDs', hidden:true},
            		 {name:'paymentAmount',index:'paymentAmount', width:35,edittype:'text', summaryType: 'sum',  
            			 editable:true, hidden:false, 
            			 editoptions: {
            				 dataEvents: [{ 
				            	   type: 'keypress', fn: function(e) {
				            		   if(e.keyCode == 46 || $('#paymentAmount').val().indexOf('.') >= 0)
				            			   maxLengthForPayment = 9;
				            		   else
				            			   maxLengthForPayment = 6;
				            		   $('#paymentAmount').attr('maxlength', maxLengthForPayment);
			            		   } 
				               }], 
            				             
						 },
            			 
            			 
            			 editrules:{
            				 required:true,
            				 custom:true,
            				 custom_func:function (value, colname) {
            					 if(!/^[-]?[0-9][0-9]{0,9}(\.[0-9]{0,9})?$/.test($.trim(value))){
                					 return [false,colname+ ": Only numerics allowed."];
                				 } else {
                					 return [true,""];
                				 }
            				 }
        				 }, formatter: 'currency', formatoptions: {thousandsSeparator: ''} 
                     },
                     
                     {name:'paymentTypeCode',index:'paymentTypeCode', width:70, edittype:'select', formatter:'select', 
                		 editoptions:{value:"3:Visa/Master/CreditCard;1:CASH/Traveler\'s Cheque;2:Money order/Cheque;4:Discover Card;6:CO CK"}, editable:true},
                    	
                     {name:'paidByCode',index:'paidByCode', width:30,edittype:'select',edittype:'select', 
                    	 formatter:'select',editoptions:{value:"S:Shipper;C:Consignee;B:Bill;O:Other"},editable:true, hidden:false},
                     
                     {name:'paymentReferenceNumber',index:'paymentReferenceNumber',width:40,edittype:'text',editable:true,hidden:false,editoptions: {maxlength: 20}},
            		 {name:'creditCardAuthorizationNbr',index:'creditCardAuthorizationNbr', width:60,edittype:'text',
                    	 editable:true, hidden:false,editoptions: {maxlength: 10}},
        			 {name:'otherPayer',index:'otherPayer', width:40, edittype:'text', editable:true, hidden:false,editoptions: {maxlength: 32}},
                     {name:'createUser',index:'createUser', width:58, editable:false},
                     {name:'createDate',index:'createDate',width:58,align:'left', editable:false},
                     {name:'hideEditDelete', index:'hideEditDelete', hidden :true},
                     {name:'actions', index:'actions', width:25, align:"center", editable:false, 
                    	 search:false, sortable:false, formatter:'actions', formatoptions:{keys:true, 
                    		 afterSave: function(rowId) {
     							$("#bookingPaymentGrid").trigger('reloadGrid');
     							return true;
     						 }
 						 }
                     }
                 ]; 	
	
	var jsonReaderPayment = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "sequenceNumberDs"
		};
	
	createGrid(
			"bookingPaymentGrid", // grid id for user
			"bookingPaymentPager", // page id for user
			_context+'/booking/updatepayment/loadPaymentGrid', 
			_context+'/booking/updatepayment/addPayment', 
			_context+'/booking/updatepayment/editPayment', 
			_context+'/booking/updatepayment/deletePayment', 
			'',
			colNames, 
			colModel, 
			'Payment Transaction',
			130,
			'50',
			[50,60,70],
			false, false, false, false,
			jsonReaderPayment,
			false,false,true,true,false,true,false,false,
			customloadComplete,false,true);
	
	// Exit
	$('#paymentExit').click(function(){
		if(src=="" || src=="null")
			{
				var isDataUpdated = 'false';
				var dataIDs = jQuery('#bookingPaymentGrid').getDataIDs();
				for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
					var colValue = jQuery("#bookingPaymentGrid").getRowData(dataIDs[rowId]).hideEditDelete;
					if(colValue == false || colValue == 'false') {
						isDataUpdated = 'true';
						break;
					}else
						isDataUpdated =  'false';
				}
				var isConfirm = false;
				if(isDataUpdated == 'true') {
					isConfirm = confirm("All the unsaved Changes will be discarded. Please confirm!");
					if (isConfirm == 'true' || isConfirm == true) {
						exitPayment();
					} 
				} else {
					exitPayment();
				}
			}
		else if(src=="BILL")
			{
				document.location.href = _context +'/cas/shipmentTrackingSearch.do?searchAgain=true';
			}
		else if(src=="BILLS")
			{
				document.location.href = _context +'/cas/billsForBookingSearch.do';
			}
	});
	
	function exitPayment() {
		$.ajax({
			url: _context+"/booking/updatepayment/exit",
			success: function(responseText){
				if(responseText.success){
					// window.opener.loadHoldGrid("D");
					document.location.href = _context +'/booking/showForm?bookingNumber=' + $('#bookingNumberId').val();
				}
			}
		});
	}
	
	// Save Payment
	$('#paymentSave').click(function(){
		if($('#bookingNumberId').val()==''){
			$('#bookingNumberId').validationEngine('showPrompt', 'Please re-enter Booking Number to continue.', 'error', 'topRight', true);
			return;
		}
		if($("#bookingPaymentGrid").getGridParam("reccount")!=0){
			$('#msgDiv').html('');
			var bookingPaymentForm = $('#bookingPaymentForm').formSerialize();
			var urlStr = _context+"/booking/updatepayment/save";
			$.ajax({
				type: "POST",
				url: urlStr,
				data: bookingPaymentForm,
				success: function(responseText){
					showResponseMessages('msgDiv', responseText);
					$("#bookingPaymentGrid").trigger('reloadGrid');
				}
			});
		}
		else{
			$('#msgDiv').html('<div class="message_info">There is no payment line to be saved.</div>');
			window.scrollTo(0, 0);
		}
	});
	
	showPaymentMessages();
	
	/*var args = {
			entityType: 'BKNG',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:''
		   };
	getCommentTypes(args);*/
	
	$('#commentsDiv').show();
	
	if($('#userFromMenu').val()=='Y'){
		$('#paymentExit').hide();
	}else{
		$('#paymentExit').show();
	}

	if($('#bookingNumberId').val()==''){
		$('#paymentSave').attr("disabled",true);
	}else{
		$('#paymentSave').attr("disabled",false);
	}

	enforceUserSecurityRolesAndPermissions();
	
	$('#bookingNumberId').focus();
	//Display Unreleased Holds Grid on initial display
	openUnreleasedHoldGridOnIntialDisplay("payment");
	
	if($('#bookingNumberId').val() != undefined && $.trim($('#bookingNumberId').val()) != '') {
		createCommentFunc();
	}
	tabSequence('#bookingPaymentForm',false,false);
	
	if(src != undefined && (src == 'BILL' || src == 'BILLS')) {
		$('#paymentSave').css('visibility','hidden');
		$('#holdRelease').css('visibility','hidden');
	} else {
		$('#paymentSave').css('visibility','visible');
		//Added for Security Defect D027280
		if(holdReleaseEnabled) 
		   {
			$('#holdRelease').css('visibility','visible');  
		   }
	}
		
});

	function showPaymentMessages() {
		messageStr = $("#warnMsg").val();
		if(messageStr != '') {
			messageStr = messageStr.replace('[', '');
			messageStr = messageStr.replace(']', '');
		}
		var array = messageStr.split(',');
		var length = array.length;
		if(array == '' || array == ' ') {
			length = 0;
		}
		var messageContent = '';
		if (length > 0) {
			messageContent = '<div class="message_warning">';
			for (var i = 0; i < length; i++) {
				messageContent += array[i];
				if(length > 1)
					messageContent += "<br>";
			}
			messageContent += '</div>';
		$('#msgDiv').html(messageContent);
		}
		if(messageContent!='') {
			window.scrollTo(0, 0);
		}
	}

	var customloadComplete = function() {
		if($('#bookingNumberId').val() != undefined && $.trim($('#bookingNumberId').val()) != '') {
			
			var totalPaid = $("#bookingPaymentGrid").jqGrid('getCol', 'paymentAmount', false, 'sum').toFixed(2).toString();
			
			$("#totalPaid").text('$' + totalPaid);
			var totalCharges = $("#totalCharges").text();
			if($("#totalCharges").text().indexOf("$") > -1)
				totalCharges = totalCharges.substr(totalCharges.indexOf("$") + 1);
			var balDue = 0;
			balDue = (totalCharges - totalPaid).toFixed(2).toString();
			
			$("#balanceDue").text('$' + balDue);
			
			manageInlineVisibility();
			$('table[aria-labelledby="gbox_bookingPaymentGrid"] thead tr[id="FormError"] td').html("");
			$('table[aria-labelledby="gbox_bookingPaymentGrid"] thead tr[id="FormError"]').hide();

			enforceSecurityOnPaymentGrid();
		} else {
			$("#totalCharges").text('');
			$("#totalPaid").text('');
			$("#balanceDue").text('');
		}
		
		if(src!=undefined && (src=='BILL' || src=='BILLS')) {
			$('#sData','#gbox_bookingPaymentGrid').hide();
		}
		else{
			$('#sData','#gbox_bookingPaymentGrid').show();
		}
		
	};
	
	function manageInlineVisibility() {
		
		var dataIDs = jQuery('#bookingPaymentGrid').getDataIDs();

		for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
			var colValue = jQuery("#bookingPaymentGrid").getRowData(dataIDs[rowId]).hideEditDelete;
			if(colValue == 'true' || colValue == true) { 
				$("tr#"+$.jgrid.jqID(dataIDs[rowId])+ " div.ui-inline-edit").hide();
				$("tr#"+$.jgrid.jqID(dataIDs[rowId])+ " div.ui-inline-del").hide();
			} else {
				$("tr#"+$.jgrid.jqID(dataIDs[rowId])+ " div.ui-inline-edit").show();
				$("tr#"+$.jgrid.jqID(dataIDs[rowId])+ " div.ui-inline-del").show();
			}
		}
	}
	
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
	
	
	function getCommentTypes(args){
		$.ajax({
			url: _context +"/comments/commentTypes",
			data: {
				entity: 'BKNG',
				contextScreen: 'maintainbooking'
			},
			success: function(responseText){
				if(responseText.success==true){
					var commentTypes=responseText.data;
					var string="";
					for(var i=0;i<commentTypes.length;i++){
						if(i<commentTypes.length-1){
							string=string+commentTypes[i]+",";
						}else{
							string=string+commentTypes[i];
						}
					}
					args.commentTypesForGrid=string;
					$("#comment_link").comments(args);
					
				}
			}
		});
	}
	
	function enforceUserSecurityRolesAndPermissions() {
		enforceSecurityOnPaymentGrid();
		enforceSecurityOnPaymentHoldRelease();
		enforceSecurityOnPaymentHoldPopup();
		enforceSecurityOnPaymentComments();
	}
	
	function enforceSecurityOnPaymentGrid() {
		if(isPaymentModifiable == false) {
			$('#tr_sequenceNumberDs').hide();
			$('.ui-icon-pencil').hide();
			$('.ui-icon-trash').hide();
			$('#paymentSave').css('visibility','hidden');
			$('#paymentSave').addClass('noTab');
		}
	}

	function enforceSecurityOnPaymentHoldPopup() {
		if(!isHoldOverlayBottomEnabled) {
			$('#holdsDiv').css('display', 'none');
		}
	}
	
	function enforceSecurityOnPaymentHoldRelease() {
		if(!holdReleaseEnabled) {
			$('#holdRelease').css('visibility','hidden');
			$('#holdRelease').addClass('noTab');
		}
	}
	
	function enforceSecurityOnPaymentComments() {
		if(isPaymentCommentsDisplay == false) {
			$('#commentsDiv').css('visibility','hidden');
			
		} 
	}
	
	function createCommentFunc() {
		var args = {
				entityType: 'BKNG',
				entityId: $('#bookingId').val(),
				commentId: 'commentId',
				displayCommentTypes: 'ALL',
				commentTypesForGrid:''
			   };
		getCommentTypes(args);
	}
$(document).ready(function () {
	
	var seqAjaxCompleted=true;
	var corrAjaxCompleted=true;
	
	if($("#shipmentCorrectionNumber").val()!=null)
	{
	$('#shipmentSequenceNumber').attr('disabled', false);
	$('#shipmentCorrectionNumber').attr('disabled', false);
	}
	$("#billHistoryForm").validationEngine('attach');
	
	$('#release_audit').click(function(){
		auditReleaseClick();
	});
	
		var titleValue=$('#hoverDetailsAudit').val();
		 $("#release_audit").attr('title',titleValue);
	
	//added when shipment not present in session
	if($('#shipmentSequenceNumber').val()==null||$('#shipmentSequenceNumber').val()=='')
		{
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
		$('#shipmentSequenceNumber').attr('disabled', true);
		}
	//added against 18175 to lock screen
	else{
		blockUI();
		}
	
	$('#go').click(function(){
		
		var count=0;
		//$('#shipmentCorrectionNumber').attr('disabled', false);
		if($('#shipmentNumber').val()=='')
		{
			$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
			count++;
		}
		if(count==0) {
			//added against 18175 to lock screen
			if($('#shipmentSequenceNumber').val().length==3){
			blockUI();
			}			
			$('#billHistoryForm').attr('method','POST');
			$('#billHistoryForm').attr('action','findBillInfo');
			$('#billHistoryForm').submit();
		}
	}
	);
	
	var colNames=['Correction Sequence', 'User ID', 'Date', 'Time'];
	var colModel=[
	            	  {name:'fc',index:'fc', width:270,editable:true},
	            	  {name:'userId',index:'userId', width:100,editable:true},
	            	  {name:'fcDate',index:'fcDate', width:120,editable:true},
	            	  {name:'fcTime',index:'fcTime', width:110,editable:true},
	            	  ];
	createGrid(
			'freightcorrectiondetailsGrid', // grid id for Standing Instruction
			'freightcorrectionDetails', // page id for Standing Instruction
			'/gates/bill_status_history/loadGrid', 
			'', 
			'',
			'', 
			'',
			colNames, 
			colModel, 
			'',
			210
			,10 ,[10,20,30] ,
			false, /* multiselect */
			false, /* multidelete */
			true,
			true,/* isReadOnly */
			null,/* JSON */
			false, /* hideEdit */
			false /* hideDelete */
	);

	var colNames=['id','', 'Audit Key', 'User ID', 'Date', 'Time'];
	var colModel=[
	              {name:'id',index:'id', editable:false,hidden:true, formatter:'number', 
	            	  cellattr: function (rowId, val, rawObject, cm, rdata) { return 'style = text-align: right;';}},
	            	  {name:'auditDescription',index:'auditDescription',width:50, editable:false, hidden:true},
	            	  {name:'auditKey',index:'auditKey', width:270,editable:true,
	            	  cellattr: function (rowId, val, rawObj, cm, rdata)
                  		{
	            		  return 'title="' +' ' + rawObj.auditDescription + '"';
                  		}
	            	  },
	            	  {name:'userId',index:'userId', width:100,editable:true},
	            	  {name:'auditDate',index:'auditDate', width:120,editable:true},
	            	  {name:'auditTime',index:'auditTime', width:110,editable:true},
	            	  ];
	createGrid(
			'auditdetailsGrid', // grid id for Standing Instruction
			'auditDetails', // page id for Standing Instruction
			'/gates/bill_status_history/loadGrid1', 
			'', 
			'',
			'', 
			'',
			colNames, 
			colModel, 
			'',
			210
			,10 ,[10,20,30] ,
			false, /* multiselect */
			false, /* multidelete */
			true,
			true,/* isReadOnly */
			null,/* JSON */
			false, /* hideEdit */
			false /* hideDelete */
	);
	
	//setting parameters enabled and disabled
	if($('#hoverId').val()=='')
	{
		$('#release_audit').attr("disabled",true);
	}
	//Shipment# Predictive Search
	var url =_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355';
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#docDistribution').click(function(){
	var url = "/shipmentPrntOptnsOverride/getPrintOptionOverride";
	document.location.href=_context + url;
	});

	$('#shipmentNumber').keyup(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});
	
	$('#shipmentNumber').gatesAutocomplete({
		source: url,
		minLength: 7,
		autoSelectWhenSingle:true,
		autoSelectFirst:true,
		formatItem: function(data) {
			return data.shpmntNo;
		},
		formatResult: function(data) {
			return data.shpmntNo;
		}, 
		select: function(data) {
			
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			//written here to capture latest value for $('#shpmntNo').val()
			//code for shipment sequence no predictive search
			
			
			$.ajax({
				async: false,
				type : "POST",
				url : _context + "/shipment/defaultShipmentSequenceNumber",
				data : {				
					shipment_number :$('#shipmentNumber').val(),
				},
				success : function(responseText) {
					var shipmentSequenceNumber=responseText.data;
					$('#shipmentSequenceNumber').val(shipmentSequenceNumber);
					$('#shipmentCorrectionNumber').attr('disabled', false);
					$.ajax({
						type : "GET",
						url : _context +"/bill_status_history/shipmentCorrectionNumberList",
						data : {
							shipmentNumber : $("#shipmentNumber").val(),
							shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
						},
						success : function(responseText) {
							var list= responseText.data.shipmentCorrectionNumberList;
							$('#shipmentCorrectionNumber option').remove();
							var shipmentCorrectionNumberOption='';
							$.each(list, function(index,codeDescription) {
								$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
							});	
							$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
							$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
						}
					});
				}			
			});
			
		}
	});
	
	 $('#shipmentSequenceNumber').gatesAutocomplete({
			source: _context+'/cas/autocomplete.do',
			extraParams: {
							method : "searchShpmntSeqNo",
							searchType : "354",
							parentSearch : function() {return $('#shipmentNumber').val();}
						},
			//minLength: 7,
			autoSelectWhenSingle:true,
			autoSelectFirst:true,
			formatItem: function(data) {
				return data.sequenceNo;
			},
			formatResult: function(data) {
				return data.sequenceNo;
			}, 
			select: function(data) {
				$('#shipmentSequenceNumber').val(data.sequenceNo);
				$('#shipmentCorrectionNumber').attr('disabled', false);
				$.ajax({
					type : "GET",
					url : _context +"/bill_status_history/shipmentCorrectionNumberList",
					data : {
						shipmentNumber : $("#shipmentNumber").val(),
						shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
					},
					success : function(responseText) {
					
						var list= responseText.data.shipmentCorrectionNumberList;
						$('#shipmentCorrectionNumber option').remove();
						var shipmentCorrectionNumberOption='';
						$.each(list, function(index,codeDescription) {
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
						});	
						$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
						$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
					}
				});
			}
		});
	 
	 $("#shipmentCorrectionNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#go').click();
			}
		});
		$("#shipmentNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#shipmentSequenceNumber').val('');
				$('#shipmentSequenceNumber').attr('disabled', false);
				$('#shipmentCorrectionNumber').attr('disabled', false);
				generateDefaultShipmentNumber();
				do{
					setTimeout(function(){
						if(seqAjaxCompleted && corrAjaxCompleted) {
							$('#go').click();
						}
					},100);
					
				}while(!seqAjaxCompleted || !corrAjaxCompleted);
			}
		});
		
		$("#shipmentSequenceNumber").keyup(function(event) {
			if (event.keyCode == 13) {
				$('#shipmentCorrectionNumber').attr('disabled', false);
				generateShipmentCorrectionNumberList();
				do{
					
					setTimeout(function(){
						if(corrAjaxCompleted) {
							$('#go').click();
						}
						
					},100);
					}while(!corrAjaxCompleted);
			}
		});
	 
	
	
	$('#cancel').click(function(){
		
		$("#billHistoryForm").validationEngine('detach');
		var hyperLink=$('#navigationUrl').val();
		var method=$('#method').val();
		$('#billHistoryForm').attr('method',method);
		$('#billHistoryForm').attr('action',hyperLink);
		$('#billHistoryForm').submit();
		//document.location.href=hyperLink;
	});
	
	if($('#shipmentNumber').val()!=''){
		var msgDivVal = document.getElementById('infoMsgDiv');
		var msgDivValSuccess = document.getElementById('successMsgDiv');
		var msgDivValWarn = document.getElementById('warnMsgDiv');
		var msgDivValError = document.getElementById('errorMsgDiv');
		
		//added against 18175 to lock screen
		$.unblockUI();
		// D024938 
		$('#shipmentCorrectionNumber').attr('disabled', false);
		$('#shipmentSequenceNumber').attr('disabled', false);
		if(msgDivVal== null && msgDivValSuccess==null && msgDivValWarn==null && msgDivValError==null){
			$('#go').trigger("click");
		}else if((msgDivVal.innerHTML==''&& msgDivValSuccess.innerHTML=='' && msgDivValWarn.innerHTML==''&& msgDivValError.innerHTML=='')){
			$('#go').trigger("click");
		}
		
	}
	
	/*Permission Shipment Security*/
	enforceSecurityDivAndButtons("mainDiv", isbillstatushistoryDisplayOnly);
	enforceSecurityDivAndButtons("cancel", isbillstatushistoryDisplayOnly);
	enforceSecurityDivAndButtons("release_audit", isbillstatushistoryAuditRelease);
	enforceSecurityTitle(isbillstatushistoryDisplayOnly);
	tabSequence('#billHistoryForm',false,false);
	
	$("#maintainBillBtnForBillHistory").click(function() {
 		document.location.href = _context+"/shipment/showForm?shipment_number="+$("#shipmentNumber").val()+"&shipment_sequence_number="+$('#shipmentSequenceNumber').val()+
			"&shipment_correction_number="+$('#shipmentCorrectionNumber').val();
 	});
});


function removeErrorPointers() {
	$('#billHistoryForm').validationEngine('hideAll');
}

function generateShipmentCorrectionNumberList()
{
	corrAjaxCompleted=false;
	$.ajax({
		type : "GET",
		url : _context +"/bill_status_history/shipmentCorrectionNumberList",
		data : {
			shipmentNumber : $("#shipmentNumber").val(),
			shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
		},
		success : function(responseText) {
			corrAjaxCompleted=true;
			var list= responseText.data.shipmentCorrectionNumberList;
			$('#shipmentCorrectionNumber option').remove();
			var shipmentCorrectionNumberOption='';
			$.each(list, function(index,codeDescription) {
				$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
				shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
			});	
			$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
			$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
		},
		error: function ()
		{
			corrAjaxCompleted=true;
		}
	});
}

function generateDefaultShipmentNumber()
{
	$('#shipmentNumber').val($('#shipmentNumber').val());
	$('#shipmentNumberHidden').val($('#shipmentNumber').val());
	$('#shipmentSequenceNumber').attr('disabled', false);
	$('#shipmentSequenceNumber').val('');
	seqAjaxCompleted=false;
	$.ajax({
		async: false,
		type : "POST",
		url : _context + "/shipment/defaultShipmentSequenceNumber",
		data : {				
			shipment_number :$('#shipmentNumber').val(),
		},
		success : function(responseText) {
			seqAjaxCompleted=true;
			var shipmentSequenceNumber=responseText.data;
			$('#shipmentSequenceNumber').val(shipmentSequenceNumber);
			$('#shipmentCorrectionNumber').attr('disabled', false);
			corrAjaxCompleted=false;
			$.ajax({
				type : "GET",
				url : _context +"/bill_status_history/shipmentCorrectionNumberList",
				data : {
					shipmentNumber : $("#shipmentNumber").val(),
					shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
				},
				success : function(responseText) {
					corrAjaxCompleted=true;
					var list= responseText.data.shipmentCorrectionNumberList;
					$('#shipmentCorrectionNumber option').remove();
					var shipmentCorrectionNumberOption='';
					$.each(list, function(index,codeDescription) {
						$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
					});	
					$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
					$('select[id*="shipmentCorrectionNumber"]').attr("selectedIndex",0);
				},
				error :function()
				{
					corrAjaxCompleted=true;
				}
			});
		},
		error : function ()
		{
			seqAjaxCompleted=true;
			corrAjaxCompleted=true;
		}
	});
}

function auditReleaseClick(){
	if($('#hoverId').val()!=''){
		var id=$('#hoverId').val();
		blockUI();
		$.ajax({
			   type: "GET",
			   url: _context +"/shipment/releaseAudit",
			   data: "id="+ id,
			   success: function(responseText, statusText, xhr, $form){
				   showResponseMessages('msgDiv',responseText);
				   $.unblockUI();
				  
				   var messages = responseText.messages;
				   if (messages.success.length > 0 ) 
				   {
				   		var shipmentNumberHeader = $("#shipmentNumber").val();
						
						var shipment_sequence_number = $("#shipmentSequenceNumber").val();
						var shipment_correction_number = $("#shipmentCorrectionNumber").val();
						
						if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
							shipment_sequence_number="000";
						}
						if(shipment_correction_number == ""	|| shipment_correction_number == null){
							shipment_correction_number="000";
						}
						var url = "/bill_status_history/find?shipmentNumber="+
							shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
							"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=maintainRate";
						window.location = _context + url;	
				   }
			   }
			 });
			
	}
	}

function showResponseMessages(msgDivId, responseText) {
	if (responseText.messages) {

		var messages = responseText.messages;
		var messageContent = '';
		if (messages.error.length > 0) {
			var array = messages.error;
			var len = messages.error.length;
			for ( var i = 0; i < len; i++) {

				messageContent += '<div class="message_error">' + array[i]
						+ '</div>';
			}
		}

		if (messages.warn.length > 0) {
			var array = messages.warn;
			var len = messages.warn.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_warning">' + array[i]
						+ '</div>';
			}
		}

		if (messages.info.length > 0) {
			var array = messages.info;
			var len = messages.info.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_info">' + array[i]
						+ '</div>';
			}
		}
		if (messages.success.length > 0 ) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
						+ '</div>';
			}
		}
		//D032210 - Scroll to the top only if there is any error
		if (messageContent != '') {
			$('#' + msgDivId).html(messageContent);
			if (messages.error.length > 0 || messages.warn.length > 0){
				window.scrollTo(0, 0);
			}
		}
	}
}

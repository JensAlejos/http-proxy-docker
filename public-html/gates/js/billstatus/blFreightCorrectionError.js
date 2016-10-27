$(document).ready(function () {
	

	var seqAjaxCompleted=true;
	var corrAjaxCompleted=true;
	if(null!=$('#shipmentNumber').val() && $.trim($('#shipmentNumber').val())!=''){
		//added against 18175 to lock screen
		$.unblockUI();
	}
	if($("#shipmentCorrectionNumber").val()!=null)
	{
	$('#shipmentSequenceNumber').attr('disabled', false);
	$('#shipmentCorrectionNumber').attr('disabled', false);
	}
	if($("#shipmentSequenceNumber").val()!=null)
	{
	$('#shipmentSequenceNumber').attr('disabled', false);
	}
	
	//added when shipment not present in session
	if($('#shipmentSequenceNumber').val()==null||$('#shipmentSequenceNumber').val()=='')
		{
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
		$('#shipmentSequenceNumber').attr('disabled', true);
		}
	$("#blFrtCorrectionErrorForm").validationEngine('attach');
	
	$('#go').click(function(){
		var count=0;
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		//$('#shipmentCorrectionNumber').attr('disabled', false);
		if($('#shipmentNumber').val()=='')
		{
			$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
			count++;
		}
		
		/** Populating Shipment sequence number from database*/
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			generateDefaultShipmentNumber();
		}
	
		/** Populating Shipment Correction Number number Hard coded*/
		else if(shipment_correction_number == ""	|| shipment_correction_number == null){
			generateShipmentCorrectionNumberList();
	}
	
		if(count==0) {
			//added against 18175 to lock screen
			if($('#shipmentSequenceNumber').val().length==3){
			blockUI();
			}
			
			do{
				setTimeout(function(){
					if(corrAjaxCompleted) {
						$('#blFrtCorrectionErrorForm').attr('method','POST');
						var hyperLink=$('#navigationUrl').val();
						if(hyperLink=="1"||hyperLink==1 || window.location.hash =="#Nav1")
							{
							$('#blFrtCorrectionErrorForm').attr('action','findBillInfo#Nav1');
							}else{
								$('#blFrtCorrectionErrorForm').attr('action','findBillInfo');
								}
						$('#blFrtCorrectionErrorForm').submit();
					}
				},100);
			}while(!seqAjaxCompleted || !corrAjaxCompleted);
				
		}
	});
	if($('#shipmentNumber').val()==''){
	}else{
	var msgDivVal = document.getElementById('infoMsgDiv');
	var msgDivValSuccess = document.getElementById('successMsgDiv');
	var msgDivValWarn = document.getElementById('warnMsgDiv');
	var msgDivValError = document.getElementById('errorMsgDiv');
	

	if(msgDivVal== null && msgDivValSuccess==null && msgDivValWarn==null && msgDivValError==null){
		$('#go').trigger("click");
	}else if((msgDivVal==''&& msgDivValSuccess=='' && msgDivValWarn==''&& msgDivValError=='')){
		$('#go').trigger("click");
	}
	}
	
	var colNames=['Field Changed', 'Changed From', 'Changed To'];
	var colModel=[
	            	  {name:'fieldChanged',index:'fieldChanged', width:150,editable:true},
	            	  {name:'changedFrom',index:'changedFrom', width:150,editable:true},
	            	  {name:'changedTo',index:'changedTo', width:150,editable:true},
	            	  ];
	createGrid(
			'freightcorrectionerrordetailsGrid', // grid id for Standing Instruction
			'freightcorrectionerrorDetails', // page id for Standing Instruction
			'/gates//bl/freightCorrectionErrors/loadGrid', 
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
	


	//Shipment# Predictive Search
	var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355'
	$('#shipmentNumber').gatesAutocomplete({
		source: url,
		minLength: 7,
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
						url : _context +"/bl/freightCorrectionErrors/shipmentCorrectionNumberList",
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
					url : _context +"/bl/freightCorrectionErrors/shipmentCorrectionNumberList",
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
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentSequenceNumber').attr('disabled', true);
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});

	$('#shipmentSequenceNumber').change(function() {
		$('#shipmentCorrectionNumber option').remove();
		$('#shipmentCorrectionNumber').attr('disabled', true);
	});
	
	
	$('#cancel').click(function(){
		var hyperLink=$('#navigationUrl').val();
		var shipmentNumber1=$('#shipmentNumber').val();
		
		var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
		if(hyperLink=="1"||hyperLink==1 || window.location.hash =="#Nav1")
			{
			document.location.href=_context+"/bill/frtcorrection/find?shipmentNumber="+ shipmentNumber1+"&shipmentSequenceNumber="+shipmentSequenceNumber1+"&shipmentCorrectionNumber=000";
			}
		else
			{
			document.location.href=_context;
			}
	});
	/*shipment Security*/
	enforceSecurityDivAndButtons('mainDiv',isBLERDisplayOnly);
	enforceSecurityDivAndButtons('cancel',isBLERDisplayOnly);
	enforceSecurityTitle(isBLERDisplayOnly);
	tabSequence('#billFrtCorrectionForm',false,false);
});

function removeErrorPointers() {
	$('#blFrtCorrectionErrorForm').validationEngine('hideAll');
}
function generateShipmentCorrectionNumberList()
{
	$('#shipmentCorrectionNumber').attr('disabled', false);
	
	corrAjaxCompleted=false;
	$.ajax({
		async: false,
		type : "GET",
		url : _context +"/bl/freightCorrectionErrors/shipmentCorrectionNumberList",
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
				async: false,
				type : "GET",
				url : _context +"/bl/freightCorrectionErrors/shipmentCorrectionNumberList",
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

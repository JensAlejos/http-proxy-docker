var doesChange =false;
var doesFieldChange = false;
var operation = "add";
var hideEdit=false;
var hideDelete=false;
var charge=" ";
var units=" ";
$(document).ready(function () {
	
	$('#maintainBill').click(function(){
		var shipmentNumber1=$('#shipmentNumber').val();
		var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
		var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
		document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ";
	});
	//22087 - charges button added
	$("#shipmentChargeBtn").click(function() {
		
			var shipmentNumberHeader = $("#shipmentNumber").val();
			
			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();
			
			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
				shipment_sequence_number="000";
			}
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				shipment_correction_number="000";
			}
				var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
				shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
				"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2";
				window.location = _context + url;
		}	);

	shortcut.add("F9", function() {
	    billClick();
	});
	
	if(null!=$('#shipmentNumber').val() && $.trim($('#shipmentNumber').val())!=''){
		displayShipment();
	}
	
	function displayShipment() {
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
			$.ajax({
				async: false,
				type : "POST",
				url : _context + "/shipment/defaultShipmentSequenceNumber",
				data : {				
					shipment_number :shipment_number,
				},
				success : function(responseText) {
					var shipmentSequenceNumber=responseText.data;
					$("#shipmentSequenceNumber").val(shipmentSequenceNumber);
				}			
			});
		}
	}
	
	
	$('#save').click(function() {
		blockUI();
		$.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/save",
			success : function(responseText) {
				$.unblockUI();
				showResponseMessages("msgDiv", responseText);
				$('#entityVersion').val(responseText.data.entityVersion);
				$("#payableChargeGrid").trigger('reloadGrid');
				var totaCharges = responseText.data.totalCharges;
				if(totaCharges != null ){
					var formattedTotalCharges = totaCharges.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
					document.getElementById("totalCharges").innerHTML=formattedTotalCharges;
					
				}
				calculateSubtotal();
				//document.getElementById("subTotalPayable").innerHTML=responseText.data.subTotalPayable;
				var totalPables = responseText.data.totalPayable;
				if(totalPables != null ){
					var formattedTotalPayables = totalPables.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					document.getElementById("totalPayable").innerHTML=formattedTotalPayables;
					
				}
				document.getElementById("billStatus").innerHTML=responseText.data.billStatus;
				doesChange = false;
				captureOnlyGridActions();
			}
		})
	});
	var navarray = [];
	var addhyperLink=$('#navigationUrl').val();
	navarray.push(addhyperLink);
	
	//D025224
	var unitOverlayRegex=/^ *[0-9]+ *$/ ;
	var $unitOverlayField = $('#unitsOverlay');
	$unitOverlayField.data('oldVal',$unitOverlayField.val());
	
	$('#unitsOverlay').focus(function() {
		$unitOverlayField = $('#unitsOverlay');
		$unitOverlayField.data('oldVal',$unitOverlayField.val());
	});
	$('#unitsOverlay').change(function(){
		//change
		$unitOverlayField = $('#unitsOverlay');
		
		if(!unitOverlayRegex.test($unitOverlayField.val()) )
		{
			alert("Unit must be an integer");
			$unitOverlayField.val($unitOverlayField.data('oldVal'));
		} else {
			$unitOverlayField.val(Number($unitOverlayField.val()).toFixed(0));
			units=$unitOverlayField.val();
			if($('#equipmentNumber').val()!=null){
				//alert("change");
				doesFieldChange=true;
			}
		}
		units=$('#unitsOverlay').val();
		/*if($('#equipmentNumber').val()!=null){
			//alert("change");
			doesFieldChange=true;
		}*/
		});
	var commodityOverlayRegex=/^ *[0-9]+ *$/ ;
	var  $commodityOverlayField =  $('#commodityOverlay');
	$commodityOverlayField.data('oldVal',$commodityOverlayField.val());
	
	$('#commodityOverlay').focus(function() {
		$commodityOverlayField = $('#commodityOverlay');
		$commodityOverlayField.data('oldVal',$commodityOverlayField.val());
	});
	
	$('#commodityOverlay').change(function(){
		$commodityOverlayField = $('#commodityOverlay');
		
		if(!commodityOverlayRegex.test($commodityOverlayField.val()) )
		{
			alert("Commodity must be an integer");
			$commodityOverlayField.val($commodityOverlayField.data('oldVal'));
		} else {
			$commodityOverlayField.val(Number($commodityOverlayField.val()).toFixed(0));
			if($('#equipmentNumber').val()!=null){
				//alert("change");
				doesFieldChange=true;
			}
		}
		});	
	
	var rateOverlayRegex=/^\d{0,5}(?:\.\d{1,2})?$/ ;
	var $rateOverlayField = $('#rateOverlay');
	$rateOverlayField.data('oldVal',$rateOverlayField.val());
	
	$('#rateOverlay').focus(function() {
		$rateOverlayField = $('#rateOverlay');
		$rateOverlayField.data('oldVal',$rateOverlayField.val());
	});
	
	$('#rateOverlay').change(function(){
		$rateOverlayField = $('#rateOverlay');
		
		if(!rateOverlayRegex.test($rateOverlayField.val()) )
		{
			alert("Rate must be between 0 and 99,999.99 and not more than 2 decimal places.");
			$rateOverlayField.val($rateOverlayField.data('oldVal'));
		} else {
			$rateOverlayField.val(Number($rateOverlayField.val()).toFixed(2));
			if($('#equipmentNumber').val()!=null){
				//alert("change");
				doesFieldChange=true;
			}
		}
		});
	$('#chargeCodeOverlay').change(function(){
		if($('#equipmentNumber').val()!=null){
			//alert("change");
			doesFieldChange=true;
		}
		});
	$('#payeeOverlay').change(function(){
		$('#organizationId').val("");
		if($('#equipmentNumber').val()!=null){
			//alert("change");
			doesFieldChange=true;
		}
		});

	
	if($('#shipmentSequenceNumber').val().length==3){
		$('#shipmentSequenceNumber').attr('disabled', false); 
		$('#shipmentCorrectionNumber').attr('disabled', false);
		$('#equipmentNumber').attr('disabled', false);
		$('#chargeCode').attr('disabled', false);
	}

	$('#transmit').click(function() {
		var length = jQuery("#payableChargeGrid").jqGrid('getGridParam','selarrrow').length;
		if( length > 0){
			alert(" No selection allowed");
			return false;
		}
		if (confirmMessage()) {
			blockUI();
			doesChange=false;
			$.ajax({
				type : "POST",
				url : _context + "/billLadingPayable/transmit",
				data : 	queryString,
				success : function(responseText) {
					$.unblockUI();
					$('#billLadingPayableForm').loadJSON(responseText.data);
					showResponseMessages("msgDiv", responseText);
					var list= responseText.data.shipmentCorrectionNumberList;
					$('#shipmentCorrectionNumber option').remove();
					$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = null;
					var shipmentCorrectionNumberOption='';
					$.each(list, function(index,codeDescription) {

						$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";

					});
					loadPageElement(responseText);
					reloadGridValues();
					
					$('#save').attr("disabled", false);
					if(responseText.data.shipmentCorrectionNumber != '000' )
						$('#bill').attr('disabled', true);
					else
						$('#bill').attr('disabled', false);
					
					
					var list= responseText.data.equipmentNumberList;
					$('#equipmentNumber option').remove();
					var equipmentNumberOption='';
					
//					$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//					equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
					$.each(list, function(index,codeDescription) {
						$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
					});	
					$('#equipmentNumberOptions').val(equipmentNumberOption);
					$('#billLadingPayableForm').loadJSON(responseText.data); 
					$('select[id*="equipmentNumber"]').attr("s",0);
					
				}
		});
//			transmitShipment();
		}else{
			return ;
		}
	});

	
	$('#bill').click(function() {
			billClick();
	});
	function billClick()
	{
		blockUI();
		$.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/save",
			success : function(responseText) {
				$.unblockUI();
				if(responseText.success==false){
					showResponseMessages("msgDiv", responseText);
					return;
				}
				showResponseMessages("msgDiv", responseText);
				$("#payableChargeGrid").trigger('reloadGrid');
				var totaCharges = responseText.data.totalCharges;
				if(totaCharges != null ){
					var formattedTotalCharges = totaCharges.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
					document.getElementById("totalCharges").innerHTML=formattedTotalCharges;
					
				}
				calculateSubtotal();
				//document.getElementById("subTotalPayable").innerHTML=responseText.data.subTotalPayable;
				var totalPables = responseText.data.totalPayable;
				if(totalPables != null ){
					var formattedTotalPayables = totalPables.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					document.getElementById("totalPayable").innerHTML=formattedTotalPayables;
					
				}
				doesChange = false;
				captureOnlyGridActions();
				rateBill();
				
			}
		});
		
//		if (confirmMessage()) {
//			blockUI();
//			doesChange=false;
//			rateBill();
//		}else{
//			return;
//		}
	}
	
	$('#equipmentNumberOverlay').live(
			"change",
			(function() {
				$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/populateCommodity",
					data : {
						equipmentId : $("#equipmentNumberOverlay").val(),
						
					},
					success : function(responseText) {
						$('#commodityOverlay').val(responseText.data);
					}
			 });
	}));
			

	//code for getting charge code list
	var queryString = $("#billLadingPayableForm").formSerialize();
	$.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/chargeCodeList",
			data : 	queryString,
			success : function(responseText) {
				var list= responseText.data.chargeCodeList;
				$('#chargeCode option').remove();
				$('#chargeCodeOverlay option').remove();
				var chargeCodeOption='';
				$("#chargeCode").get(0).options[$("#chargeCode").get(0).options.length] = new Option("ALL", "ALL");
				/*$("#chargeCodeOverlay").get(0).options[$("#chargeCodeOverlay").get(0).options.length] = new Option("ALL", "ALL");*/
				chargeCodeOption=chargeCodeOption+"ALL"+":"+"ALL"+";";
				$.each(list, function(index,codeDescription) {
					var description = "";
					if(codeDescription.codeDescription != null)
						description = codeDescription.codeDescription;
					var option = new Option(codeDescription.code + " : " + description, codeDescription.code);
					/*if(codeDescription.code == 'DRA')
						option.selected = true;*/
					$("#chargeCode").get(0).options[$("#chargeCode").get(0).options.length] = option; 
					$("#chargeCodeOverlay").get(0).options[$("#chargeCodeOverlay").get(0).options.length] = new Option(codeDescription.code + " : " + description, codeDescription.code);
					
					chargeCodeOption=chargeCodeOption+codeDescription.description+":"+codeDescription.code+";";
				});
				
				$('#chargeCodeOptions').val(chargeCodeOption);
				$('#billLadingPayableForm').loadJSON(responseText.data);
				
				$('select[id*="chargeCode"]').attr("s",0);
			}
	});
	
	$.ajax({
		type : "POST",
		url : _context + "/billLadingPayable/rateBasisList",
		data : 	queryString,
		success : function(responseText) {
			var list= responseText.data.rateBasisListOverlay;
			$('#rateBasisOverlay option').remove();
			var chargeCodeOption='';
/*			$("#rateBasisOverlay").get(0).options[$("#rateBasisOverlay").get(0).options.length] = new Option("ALL", "ALL");
			chargeCodeOption=chargeCodeOption+"ALL"+":"+"ALL"+";";
*/			$.each(list, function(index,codeDescription) {
				$("#rateBasisOverlay").get(0).options[$("#rateBasisOverlay").get(0).options.length] = new Option(codeDescription.code+"-"+codeDescription.description, codeDescription.code);
				chargeCodeOption=chargeCodeOption+codeDescription.code+"-"+codeDescription.description+":"+codeDescription.code+";";
			});	
			$('#rateBasisOptionsOverlay').val(chargeCodeOption);
			$('#billLadingPayableForm').loadJSON(responseText.data); 
			$('select[id*="rateBasisOptionsOverlay"]').attr("s",0);
		}
});
	
	// code for equipment number list
	$("#shipmentCorrectionNumber").change(function(){
	$('#equipmentNumber option').remove();
	resetPage();
	var queryString = $("#billLadingPayableForm").formSerialize();
	$.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/equipmentCodeList",
			data : 	queryString,
			success : function(responseText) {
				var list= responseText.data.equipmentNumberList;
				$('#equipmentNumber option').remove();
				var equipmentNumberOption='';
//				$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//				equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
				$.each(list, function(index,codeDescription) {
					$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
					equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
				});	
				$('#equipmentNumberOptions').val(equipmentNumberOption);
				$('#billLadingPayableForm').loadJSON(responseText.data); 
				$('select[id*="equipmentNumber"]').attr("s",0);
			}
	});
	});
	
	//charge code change functionality
	$("#chargeCode").live(
			"change",
			(function() {
				var queryString = $("#billLadingPayableForm").formSerialize();
				$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/setChargeCode",
						data : {
							chargeCode : $("#chargeCode").val(),
						},
					success : function(responseText) {
						reloadGridValues();
						calculateSubtotal();
					}
			});
	}));
	
	// code for equipment attributes
	$("#equipmentNumber").change(function(){	
	resetPage();
	var queryString = $("#billLadingPayableForm").formSerialize();
	$.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/equipmentAttributes",
			data : 	queryString,
			success : function(responseText) {
				$('#billLadingPayableForm').loadJSON(responseText.data);
				loadPageElement(responseText);
				if($("#equipmentNumber").val()=="ALL")
				{
				    $("#typeSizeEquipment").html("");
				}
				reloadGridValues();
				calculateSubtotal();
	
			}
	});
	});
	$('#shipmentSequenceNumber').change(function(){
		resetPage();
		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();

		/** Populating Shipment Correction Number number Hard coded*/
		
			$.ajax({
				async: false,
				type : "GET",
				url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
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
					$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
				}
			});
			
			shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
		
			var queryString = $("#billLadingPayableForm").formSerialize();
			$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/equipmentCodeList",
					data : 	queryString,
					success : function(responseText) {
						$.unblockUI();
						var list= responseText.data.equipmentNumberList;
						$('#equipmentNumber option').remove();
						var equipmentNumberOption='';
//						$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//						equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
						$.each(list, function(index,codeDescription) {
							$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
						});	
						$('#equipmentNumberOptions').val(equipmentNumberOption);
						$('#billLadingPayableForm').loadJSON(responseText.data); 
						$('select[id*="equipmentNumber"]').attr("s",0);
					}
			}); 	
			
			
	});
	$("#billLadingPayableForm").validationEngine('attach');
	function removeErrorPointers() {
		$('#billLadingPayableForm').validationEngine('hideAll');
	}
	$('#go').click(function(){
		var count=0;

		var shipment_number = $("#shipmentNumber").val();
		var shipment_sequence_number = $("#shipmentSequenceNumber").val();
		var shipment_correction_number = $("#shipmentCorrectionNumber").val();
		
		if($('#shipmentNumber').val()==''||$('#shipmentNumber').val()==null)
		{
			$('#shipmentNumber').validationEngine('showPrompt', '*This field is mandatory', 'error', 'topRight', true);
			count++;
		}
		
		if(count==0) {
		if (confirmMessage()) {
			blockUI();
			/*var count=0;
			//$('#shipmentCorrectionNumber').attr('disabled', false);
			if($('#shipmentNumber').val()=='')
			{
				$('#shipmentNumber').validationEngine('showPrompt', 'Bill Number is mandatory', 'error', 'topRight', true);
				count++;
			}
			if(count==0) {*/
				var queryString = $("#billLadingPayableForm").formSerialize();
				$.ajax({
						type : "POST",
						url : _context + "/billLadingPayable/findBillInfo",
						data : 	queryString,
						success : function(responseText) {
							$.unblockUI();
							if (responseText.success == true) {
							$('#billLadingPayableForm').loadJSON(responseText.data);
							showResponseMessages("msgDiv", responseText);
							var list= responseText.data.shipmentCorrectionNumberList;
							$('#shipmentCorrectionNumber option').remove();
							var shipmentCorrectionNumberOption='';
							$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = null;
							$.each(list, function(index,codeDescription) {

								$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";

							});
							loadPageElement(responseText);
							$("#shipmentCorrectionNumber").val(responseText.data.shipmentCorrectionNumber);
							reloadGridValues();
							
							$('#save').attr("disabled", false);
							if(responseText.data.shipmentCorrectionNumber != '000' )
								$('#bill').attr('disabled', true);
							else
								$('#bill').attr('disabled', false);
							}else{
								resetPage();
								showResponseMessages("msgDiv", responseText);
							}
						}
				});
			//}
			doesChange = false;
			captureOnlyGridActions();
			removeErrorPointers();
		}else{
			return;
		}
		}
		
		
	}
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
			resetPage();
			doesChange = false;
			$('#equipmentNumber option').remove();
			$('#shipmentNumber').val(data.shpmntNo);
			$('#shipmentNumberHidden').val($('#shipmentNumber').val());
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentSequenceNumber').val('');
			reloadGridValues();
			
			//code to get default shipmentsequence number 
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
					
	////code to get default shipmentcorrection number list
					$.ajax({
						/*type : "GET",
						url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
						data : {
							shipmentNumber : $("#shipmentNumber").val(),
							shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
						},
						success : function(responseText) {
						
							var list= responseText.data.shipmentCorrectionNumberList;
							$('#shipmentCorrectionNumber option').remove();
							var shipmentCorrectionNumberOption='';
							$('#shipmentCorrectionNumberOptions').val('');
							$.each(list, function(index,codeDescription) {
								$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
								shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
							});	
							$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
							$('select[id*="shipmentCorrectionNumber"]').attr("s",0);*/
						
							async: false,
							type : "GET",
							url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
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
								$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
							
						
							
	//code to bring equipment list on default value selection
							$('#equipmentNumber').attr('disabled', false);
							var queryString = $("#billLadingPayableForm").formSerialize();
							$.ajax({
									type : "POST",
									url : _context + "/billLadingPayable/equipmentCodeList",
									data : 	queryString,
									success : function(responseText) {
										$.unblockUI();
										var list= responseText.data.equipmentNumberList;
										$('#equipmentNumber option').remove();
										var equipmentNumberOption='';
//										$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//										equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
										$.each(list, function(index,codeDescription) {
											$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
											equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
										});	
										$('#equipmentNumberOptions').val(equipmentNumberOption);
										$('#billLadingPayableForm').loadJSON(responseText.data); 
										$('select[id*="equipmentNumber"]').attr("s",0);
									}
							});
							$('#chargeCode').attr('disabled', false);
						}
					});
					shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
				}			
			});
			$('#go').trigger("click");
			
		}
	});
	
	//written here to capture latest value for $('#shpmntNo').val()
	//code for shipment sequence no predictive search
	
	$('#shipmentSequenceNumber').gatesAutocomplete({
		source: _context+'/cas/autocomplete.do',
		extraParams: {
						method : "searchShpmntSeqNo",
						searchType : "354",
						parentSearch : function() {return $('#shipmentNumber').val();}
					},
		minLength: 3,
		formatItem: function(data) {
			return data.sequenceNo;
		},
		noMatchHandler : function() {	
			//$('#shipmentSequenceNumber').validationEngine('showPrompt', 'Shipment not found', 'error', true);
			$('#shipmentCorrectionNumber option').remove();
			$('#shipmentCorrectionNumber').attr('disabled', true);
			$('#equipmentNumber option').remove();
			$('#equipmentNumber').attr('disabled', true);
			$('#chargeCode').attr('disabled', true);
		} ,
		formatResult: function(data) {
			return data.sequenceNo;
		},  
		select: function(data) {
			$('#shipmentSequenceNumber').val(data.sequenceNo);
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			doesChange = false;
			blockUI();
			$.ajax({
				/*type : "GET",
				url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
				data : {
					shipmentNumber : $("#shipmentNumber").val(),
					shipmentSequenceNumber : $("#shipmentSequenceNumber").val(),
				},
				success : function(responseText) {
				
					var list= responseText.data.shipmentCorrectionNumberList;
					$('#shipmentCorrectionNumber option').remove();
					var shipmentCorrectionNumberOption='';
					$('#shipmentCorrectionNumberOptions').val('');
					$.each(list, function(index,codeDescription) {
						$("#shipmentCorrectionNumber").get(0).options[$("#shipmentCorrectionNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
						shipmentCorrectionNumberOption=shipmentCorrectionNumberOption+codeDescription.description+":"+codeDescription.code+";";
					});	
					$('#shipmentCorrectionNumberOptions').val(shipmentCorrectionNumberOption);
					$('select[id*="shipmentCorrectionNumber"]').attr("s",0);*/
				
				async: false,
				type : "GET",
				url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
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
					$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
					
					var ship=$("#shipmentNumber").val();
					var seq= $("#shipmentSequenceNumber").val();
					var corr= $("#shipmentCorrectionNumber").val();
					//confirm("Start checking \nShip "+ship+"\nSeq "+seq+"\nCorr "+corr);
					//code to bring equipment list on default value selection
					$('#equipmentNumber').attr('disabled', false);
					var queryString = $("#billLadingPayableForm").formSerialize();
					$.ajax({
							type : "POST",
							url : _context + "/billLadingPayable/equipmentCodeList",
							data : 	queryString,
							success : function(responseText) {
								$.unblockUI();
								var list= responseText.data.equipmentNumberList;
								$('#equipmentNumber option').remove();
								var equipmentNumberOption='';
//								$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//								equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
								$.each(list, function(index,codeDescription) {
									$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
									equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
								});	
								$('#equipmentNumberOptions').val(equipmentNumberOption);
								$('#billLadingPayableForm').loadJSON(responseText.data); 
								$('select[id*="equipmentNumber"]').attr("s",0);
								
							}
					
					});
					$('#chargeCode').attr('disabled', false);
				}
			});
			shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
			
			var ship=$("#shipmentNumber").val();
			var seq= $("#shipmentSequenceNumber").val();
			var corr= $("#shipmentCorrectionNumber").val();
			//confirm("End checking \nShip "+ship+"\nSeq "+seq+"\nCorr "+corr);
			
			$('#go').trigger("click");
			
		}
	});	
	
	$('#cancel').click(function(){
		var hyperLink=$('#navigationUrl').val();
		var shipmentNumber1=$('#shipmentNumber').val();
		var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
		var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
		var firstPage = $(document).getUrlParam("firstPage");
		if(hyperLink=="2"||hyperLink==2){
				document.location.href=_context+"/shipment/showForm?firstPage="+firstPage;//?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=bllp";
		}else if(hyperLink=="HHGS"){
			var url = "/houseHoldShipment/showForm?";
			window.location = _context + url;
		}else if(hyperLink=="maintainRate"){
			document.location.href=_context+"/maintainRate/loadShipmentDetails?shipmentNumber="+shipmentNumber1+"&shipmentSequenceNumber="+shipmentSequenceNumber1+"&shipmentCorrectionNumber="+shipmentCorrectionNumber1+"&navigationUrl="+hyperLink+"&firstPage="+firstPage;
		}else{
				document.location.href=_context;
		}
});
	
	$("#shipmentCorrectionNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#equipmentNumber').attr('disabled', false);
			var queryString = $("#billLadingPayableForm").formSerialize();
			$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/equipmentCodeList",
					data : 	queryString,
					success : function(responseText) {
						$.unblockUI();
						var list= responseText.data.equipmentNumberList;
						$('#equipmentNumber option').remove();
						var equipmentNumberOption='';
//						$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//						equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
						$.each(list, function(index,codeDescription) {
							$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
						});	
						$('#equipmentNumberOptions').val(equipmentNumberOption);
						$('#billLadingPayableForm').loadJSON(responseText.data); 
						$('select[id*="equipmentNumber"]').attr("s",0);
					}
			});
			$('#chargeCode').attr('disabled', false);
			
			
			$('#go').trigger("click");
		}
	});
	
	$("#shipmentNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentSequenceNumber').val('');
			$('#shipmentSequenceNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			$('#shipmentCorrectionNumber').attr('disabled', false);
			
			
			var shipment_number = $("#shipmentNumber").val();
			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();
			
			/** Populating Shipment sequence number from database*/
			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
				$.ajax({
					async: false,
					type : "POST",
					url : _context + "/shipment/defaultShipmentSequenceNumber",
					data : {				
						shipment_number :shipment_number,
					},
					success : function(responseText) {
						var shipmentSequenceNumber=responseText.data;
						shipment_sequence_number=shipmentSequenceNumber;
					}			
				});
			}
			
			$("#shipmentSequenceNumber").val(shipment_sequence_number);
			
			/** Populating Shipment Correction Number number Hard coded*/
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				$.ajax({
					async: false,
					type : "GET",
					url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
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
						$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
					}
				});
				shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
			}
			
			$('#equipmentNumber').attr('disabled', false);
			var queryString = $("#billLadingPayableForm").formSerialize();
			$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/equipmentCodeList",
					data : 	queryString,
					success : function(responseText) {
						$.unblockUI();
						var list= responseText.data.equipmentNumberList;
						$('#equipmentNumber option').remove();
						var equipmentNumberOption='';
//						$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//						equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
						$.each(list, function(index,codeDescription) {
							$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
						});	
						$('#equipmentNumberOptions').val(equipmentNumberOption);
						$('#billLadingPayableForm').loadJSON(responseText.data); 
						$('select[id*="equipmentNumber"]').attr("s",0);
					}
			});
			$('#chargeCode').attr('disabled', false);
			
			
			$('#go').trigger("click");
		}
	});
	
	$("#shipmentSequenceNumber").keyup(function(event) {
		if (event.keyCode == 13) {
			$('#shipmentCorrectionNumber').attr('disabled', false);
			$('#shipmentCorrectionNumber option').remove();
			var shipmentCorrectionNumberOption='';
			$("#shipmentCorrectionNumber").val('');
			/** Populating Shipment Correction Number number Hard coded*/
			var shipment_number = $("#shipmentNumber").val();
			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();
			
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				$.ajax({
					async: false,
					type : "GET",
					url : _context +"/billLadingPayable/shipmentCorrectionNumberList",
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
						$('select[id*="shipmentCorrectionNumber"]').attr("s",0);
					}	
				});
				shipment_correction_number= $("#shipmentCorrectionNumber").val()==null ? '000' : $("#shipmentCorrectionNumber").val();
			}
			
			$('#equipmentNumber').attr('disabled', false);
			var queryString = $("#billLadingPayableForm").formSerialize();
			$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/equipmentCodeList",
					data : 	queryString,
					success : function(responseText) {
						$.unblockUI();
						var list= responseText.data.equipmentNumberList;
						$('#equipmentNumber option').remove();
						var equipmentNumberOption='';
//						$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option("ALL", "ALL");
//						equipmentNumberOption=equipmentNumberOption+"ALL"+":"+"ALL"+";";
						$.each(list, function(index,codeDescription) {
							$("#equipmentNumber").get(0).options[$("#equipmentNumber").get(0).options.length] = new Option(codeDescription.description, codeDescription.code);
							equipmentNumberOption=equipmentNumberOption+codeDescription.description+":"+codeDescription.code+";";
						});	
						$('#equipmentNumberOptions').val(equipmentNumberOption);
						$('#billLadingPayableForm').loadJSON(responseText.data); 
						$('select[id*="equipmentNumber"]').attr("s",0);
					}
			});
			$('#chargeCode').attr('disabled', false);
			
			
			$('#go').trigger("click");
		}
	});
	
	$('#shipmentNumber').change(function() {
		$('#shipmentSequenceNumber').val('');
		$('#shipmentCorrectionNumber option').remove();
	//	$('#shipmentCorrectionNumber').attr('disabled', true);  Defect D24770
	//	$('#shipmentSequenceNumber').attr('disabled', true);  Defect 24770
		$('#equipmentNumber option').remove();
		$('#equipmentNumber').attr('disabled', true);
		$('#chargeCode').attr('disabled', true);
		var urlStr = '';
		urlStr = _context + "/billLadingPayable/clearGrid";
		$.ajax({
			type : "GET",
			url : urlStr,
			success : function(responseText) {
				$("#payableChargeGrid").trigger('reloadGrid');
			}
		});
	});

	$('#shipmentSequenceNumber').blur(function() {
		if($('#shipmentSequenceNumber').val().length<3){
		$('#shipmentCorrectionNumber option').remove();
	//	$('#shipmentCorrectionNumber').attr('disabled', true); Defect 24770
		$('#equipmentNumber option').remove();
		$('#equipmentNumber').attr('disabled', true);
		$('#chargeCode').attr('disabled', true);
		}});
	
	//method to call payable add clause
	$('#payableClauseAdd').click(function() {
		operation = "add";
		clearOverlayFields();
		//Defect:24972 added blank to the dropdown of chargeCode and rateBasis
		//D026165
		if($('#chargeCodeOverlay').val()!= 0)
		{
		$('#chargeCodeOverlay').prepend("<option value='0'> </option>");
		}
		if($('#rateBasisOverlay').val()!= 0)
		{
		$('#rateBasisOverlay').prepend("<option value='0'> </option>");
		}
		$('#chargeCodeOverlay').val(" ");
		$('#rateBasisOverlay').val(" ");
		$("#addChargeDialog1").dialog('open');
        $('#payeeAddressOverlay').attr("disabled",true);
		//$('#equipmentNumberOverlay').val(responseText.data);
		$('#chargeOverlayDIV').attr("style","visibility:hidden");
		$('#payOverlayDIV').attr("style","visibility:hidden");
		$(":button:contains('Ok & New')").prop("disabled", false)
			.removeClass("ui-state-disabled");
//		$(":button:contains('Ok')").prop("disabled", true)
//			.addClass("ui-state-disabled");
		var queryString = "chargeCode="
			+ $('#chargeCodeOverlay').val();
		
		$
		.ajax({
			type : "GET",
			url : _context + "/billLadingPayable/returnEquipment",
			data:{
				chargeCode : $("#chargeCodeOverlay").val()
			},
			success : function(responseText) {
				$('#equipmentNumberOverlay').val(responseText.data);
				$.ajax({
					type : "POST",
					url : _context + "/billLadingPayable/validateCharge",
					data : queryString,
					success : function(responseText) {
						$('#popupSearchaddressLookUpImage').attr("style","display: block;vertical-align: middle;margin-top:7px;");
						charge=responseText.data[0]; //Defect-24830-Added to get the process level 
						if( responseText.data[0] == "E" && $('#rateBasisOverlay').val() == "E"){
							 $('#unitsOverlay').attr("disabled",true);
							 $('#unitsOverlay').val(1);
						 }else{
							 $('#unitsOverlay').attr("disabled",false);
							// $('#unitsOverlay').val(units);//Defect-25194-Addded to retain the units entered.
						 }	 
						if(responseText.data[0] == "S" || responseText.data[0] == "C"){
							$('#equipmentNumberOverlay').val("");
							$('#equipmentNumberOverlay').attr("disabled",true);
							$('#equipmentNumberOverlayImg').attr("style","display: none;");
							
						}else{
							$('#equipmentNumberOverlay').attr("disabled",false);
							$('#equipmentNumberOverlayImg').attr("style","display: block;vertical-align: middle;margin-top:6px;");
						}
						 if(responseText.data[0] == "S" || responseText.data[0	] == "E"){
							 $('#commodityOverlay').val(""); $('#commodityOverlay').attr("disabled",true);
							 $('#commodityOverlay').val(responseText.data[1]);
							 
						 }else{
								 $('#commodityOverlay').attr("disabled",false);
						 }
						 
						 $.ajax({
								type : "POST",
								url : _context + "/billLadingPayable/populateCommodity",
								data : {
									equipmentId : $("#equipmentNumberOverlay").val(),
									
								},
								success : function(responseText) {
									$('#commodityOverlay').val(responseText.data);
								}
						 });
						
					}
				});
			}
		});
		//Defect-24830-Added function to get units value based on processlevel and rateBasis
		$('#rateBasisOverlay').change(function () {	
			if($('#rateBasisOverlay').val()=="E" && charge=="E"){
				  $('#unitsOverlay').attr("disabled",true);
			 $('#unitsOverlay').val(1);
		 }else{
			 $('#unitsOverlay').attr("disabled",false);
				//$('#unitsOverlay').val(units);//Defect-25194-Addded to retain the units entered.
			 	//$('#unitsOverlay').val('');
				}
			 
			 });
		
		
		
	
	
	});
	
	// method to be called when dialog is opened
	
	$("#addChargeDialog1").dialog({
		autoOpen : false,
		width :1000,
		modal : true,
		title: 'Add / Update Payables',
		open:function(){
			$("#clause").validationEngine('attach');
			tabSequence('#addChargeDialog1',false,false);
		},
		buttons:{
			Cancel:function()
			{
				if(confirmMessage1()){
				$('#unitsOverlay').val("");
				$('#selectedChargeId').val("");
				$('#rateOverlay').val("");
				$('#chargeCodeOverlay').val("");
				$('#rateBasisOverlay').val("");
				$('#equipmentNumberOverlay').val("");
                $('#payeeAddressOverlay').val("");
				$('#commodityOverlay').val("");
				$('#addressRoleId').val("");
				$("#addChargeDialog1").dialog("close");
				reloadGridValues();
				}
			},
			'Ok & New':function()
			{
				//added to prevent manual payable addition
				if($('#billStatus').html()=="PENDING" || $('#billStatus').html()=="F/C PENDING"){
					alert("Manual Payable Addition/Updation not allowed for bill status PEND");
					return;
				}
				if($('#rateOverlay').val() == null || $('#rateOverlay').val() ==''){
					alert(' Please provide Rate . ');
					return ;
				}
				//D025208
				if($('#rateBasisOverlay').val() == null || $('#rateBasisOverlay').val() =='' ||
						$('#rateBasisOverlay').val() == 0){
					alert(' Please provide rateBasis . ');
					return ;
				}
				if($('#addressRoleId').val() == null || $('#addressRoleId').val() =='' ||
						$('#addressRoleId').val() == 0){
					alert(' Please provide addressRole  . ');
					return ;
				}
				if($('#payeeOverlay').val() == null || $('#payeeOverlay').val() ==''){
					alert(' Please provide payee  . ');
					return ;
				}
				if($('#unitsOverlay').val() == null || $('#unitsOverlay').val() ==''){
					alert(' Please provide Units . ');
					return ;
				}
				if($('#equipmentNumberOverlay').is(':enabled'))
				{
				if($('#equipmentNumberOverlay').val() == null || $('#equipmentNumberOverlay').val()== '')
				{
				  alert('Please provide equipment number');
				  return;
				}
				}
				doesFieldChange=false;
				//D025208
				if($('#commodityOverlay').val() != null && $('#commodityOverlay').val() !=''){
					if(parseInt($('#commodityOverlay').val()) > parseInt($('#totalCommodity').val()) || $('#commodityOverlay').val() < 1 ){
						alert(' Not A Valid Commodity line');
						return ;
					} 
				}
				
				var queryString = "units="+$('#unitsOverlay').val()+"&rate="+$('#rateOverlay').val()+
								  "&chargeCode="+$('#chargeCodeOverlay').val()+
								  "&rateBasis="+$('#rateBasisOverlay').val()+
								  "&equipment="+$('#equipmentNumberOverlay').val()+
								  "&commodity="+$('#commodityOverlay').val()+
								  "&payee="+$('#payeeOverlay').val()+
								  "&addressRole="+$('#addressRoleId').val();
				$.ajax({
						type : "POST",
						url : _context + "/billLadingPayable/addCharge",
						data : 	queryString,
						success : function(responseText) {
							if(responseText.success == false){
								alert(responseText.message);
								return;
							}else{
								//$("#addChargeDialog1").dialog("close");
								doesChange = true;
								reloadGridValues();
								clearOverlayFields();
							}
								
						}
				});
			},
			Ok:function()
 			{
				doesFieldChange=false;
				
				//added to prevent manual payable addition
				if($('#billStatus').html()=="PENDING" || $('#billStatus').html()=="F/C PENDING"){
					alert("Manual Payable Addition/Updation not allowed for bill status PEND");
					return;
				}
				
				if($('#rateOverlay').val() == null || $('#rateOverlay').val() ==''){
					alert(' Please provide Rate . ');
					return ;
				}
				//D025208
				if($('#rateBasisOverlay').val() == null || $('#rateBasisOverlay').val() =='' ||
						$('#rateBasisOverlay').val() == 0){
					alert(' Please provide rateBasis . ');
					return ;
				}
				if($('#addressRoleId').val() == null || $('#addressRoleId').val() =='' ||
						$('#addressRoleId').val() == 0){
					alert(' Please provide addressRole  . ');
					return ;
				}
				if($('#payeeOverlay').val() == null || $('#payeeOverlay').val() ==''){
					alert(' Please provide payee  . ');
					return ;
				}
				if($('#unitsOverlay').val() == null || $('#unitsOverlay').val() ==''){
					alert(' Please provide Units . ');
					return ;
				}
				if($('#equipmentNumberOverlay').is(':enabled'))
				{
				if($('#equipmentNumberOverlay').val() == null || $('#equipmentNumberOverlay').val()== '')
				{
				  alert('Please provide equipment number');
				  return;
				}
				}
//				if($('#commodityOverlay').val() == null || $('#commodityOverlay').val() ==''){
//					alert(' Commodity line missing for the charge. ');
//					return ;
//				}
//				else{
				//D025208
				if($('#commodityOverlay').val() != null && $('#commodityOverlay').val() != ''){
					if(parseInt($('#commodityOverlay').val()) > parseInt($('#totalCommodity').val()) || $('#commodityOverlay').val() < 1){
						alert(' Not A Valid Commodity line');
						return ;
					} 
				}
			//	}
					var queryString = "units="
														+ $('#unitsOverlay')
																.val()
														+ "&rate="
														+ $('#rateOverlay')
																.val()
														+ "&chargeCode="
														+ $(
																'#chargeCodeOverlay')
																.val()
														+ "&rateBasis="
														+ $('#rateBasisOverlay')
																.val()
														+ "&equipment="
														+ $(
																'#equipmentNumberOverlay')
																.val()
														+ "&commodity="
														+ $('#commodityOverlay')
																.val()
														+ "&payee="
														+ $('#payeeOverlay')
																.val()
														+ "&addressRole="
														+ $('#addressRoleId')
																.val()+
														"&selectedChargeId="+
														$('#selectedChargeId')
														.val();
					var urlValue = "";
					if(operation == "add"){
							urlValue= "/billLadingPayable/addCharge";
					}else if (operation == "update"){
							urlValue= "/billLadingPayable/editCharge";
					}
					$.ajax({
							type : "POST",
							url : _context+ urlValue,
							data : queryString,
							success : function(responseText) {
									if(responseText.success == false){
												alert(responseText.message);
										return;
									}else{
										$("#addChargeDialog1").dialog("close");
										doesChange = true;
										reloadGridValues();
									}
								}
							});
						},
			Clear:function()
			{
				doesFieldChange=false;
				$('#unitsOverlay').val("");
				$('#selectedChargeId').val("");
				$('#rateOverlay').val("");
				$('#chargeCodeOverlay').val("");
				$('#rateBasisOverlay').val("");
				$('#equipmentNumberOverlay').val("");
				$('#commodityOverlay').val("");
				$('#addressRoleId').val("");
				
				$('#payeeOverlay').val("");
                $('#payeeAddressOverlay').val("");
				$('#payOverlay').html("");
				$('#chargeOverlay').html("");

			}
			
		},
		close : function() {
			$("#clause").validationEngine('hideAll');
			$("#clause").validationEngine('detach');
			tabSequence('#billLadingPayableForm',true,false);
			$("#payableChargeGrid").trigger('reloadGrid');// for 23744
		}
	});
	
	/* permisssion Shipment  security*/
	
	enforceSecurityTitle(isPayableDisplayOnly);
	enforceSecurityDivAndButtons ("mainDiv",isPayableDisplayOnly);
	enforceSecurityDivAndButtons ("cancel",isPayableDisplayOnly);
	
	enforceSecurityDivAndButtons("payableClauseAdd",isPayableAdd);
	enforceSecurityDivAndButtons("transmit",isPayableTransmit);
	enforceSecurityDivAndButtons("bill",isPayableBill);
	
	if(!(isPayableAdd || isPayableUpdate ||isPayableDelete)){
		enforceSecurityDivAndButtons ("save",false);
	}else{
		enforceSecurityDivAndButtons ("save",true);
	}
	
	hideEdit = isPayableUpdate==false?true:false;
	hideDelete=isPayableDelete==false?true:false;
	
	
	
	tabSequence('#billLadingPayableForm',false,false);

	captureOnlyGridActions();
});


$(function() {
	
		makeGridForReError("billLadingPayable");
	

		$('#chargeCodeOverlay').live(
			"change",
			(function() {
				var queryString = "chargeCode="
					+ $('#chargeCodeOverlay').val();

				$
				.ajax({
					type : "GET",
					url : _context + "/billLadingPayable/returnEquipment",
					data:{
						chargeCode : $("#chargeCodeOverlay").val()
					},
					success : function(responseText) {
						$('#equipmentNumberOverlay').val(responseText.data);
						$.ajax({
							type : "POST",
							url : _context + "/billLadingPayable/validateCharge",
							data : queryString,
							success : function(responseText) {
								$('#popupSearchaddressLookUpImage').attr("style","display: block;vertical-align: middle;margin-top:7px;");
								charge=responseText.data[0]; //Defect-24830-Added to get the process level 
								if( responseText.data[0] == "E" && $('#rateBasisOverlay').val() == "E"){
									
									//alert("inside first func rate cond");
									  $('#unitsOverlay').attr("disabled",true);
									 $('#unitsOverlay').val(1);
								 }else{
									 $('#unitsOverlay').val(" "); 
									 	$('#unitsOverlay').attr("disabled",false);
								 }	 
								if(responseText.data[0] == "S" || responseText.data[0] == "C"){
									$('#equipmentNumberOverlay').val("");
									$('#equipmentNumberOverlay').attr("disabled",true);
									$('#equipmentNumberOverlayImg').attr("style","display: none;");
									
								}else{
									$('#equipmentNumberOverlay').attr("disabled",false);
									$('#equipmentNumberOverlayImg').attr("style","display: block;vertical-align: middle;margin-top:6px;");
								}
								//D026132
								 if(responseText.data[0] == "S" ){
									 $('#commodityOverlay').val(""); 
									 $('#commodityOverlay').attr("disabled",true);
									 $('#commodityOverlay').val(responseText.data[1]);
								 }else if(responseText.data[0] == "E" )
								 {
									$('#commodityOverlay').val(""); 
									$('#commodityOverlay').attr("disabled",true);
								 }
								 else if(responseText.data[0] == "C" )
								 {		
										$('#commodityOverlay').val(""); 
										if (responseText.data[1]>1)
										{ 
										$('#commodityOverlay').attr("disabled",false);
										}
										 else
										 {
										 $('#commodityOverlay').val(responseText.data[1]); 
										 $('#commodityOverlay').attr("disabled",true);
										 }
								 }
								 							 
								
							}
						});
					}
				});
				
			}));
		
		
		 
	var colNamesForMaintainChargeGrid = ['','','','#','Equipment#','Code', 'PL', 'Units','Rate','RB','Charge','Payee','Pay','User','Last Update','TXN','Seq#',''];

	var colModelForMaintainChargeGrid = [
	                                     	{name:'chargeId', index:'chargeId', width:100, editable: false,hidden:true },
	                                     	{name:'address', index:'address', width:100, editable: false, hidden:true},
	                                     	{name:'descChargeCode', index:'descChargeCode', width:100, editable: true, hidden:true},//23744 making this hidden field as editable so that edit charge can popup on 'onEdit'
	                                        {name:'line', index:'line', width:40, editable: false },
	                                        {name:'equipmentIdDispl', index:'equipmentId', width:165, editable: false },
	                                        {name:'chargeCD', index:'chargeCD', width:65, editable: false,
	                                        	//to display charge code on mouse hover against D020540
	                                        	cellattr: function (rowId, val, rawObj, cm, rdata)
	                                        	{
		                                    
		                                    
	                                        	return 'title="' +' ' + rawObj.descChargeCode + '"';
	                                        	}
	                                        		
	                                        
	                                        },
	                                        {name:'pL', index:'pL', width:40, editable: false, align:'center' },
	                                        {name:'units', index:'units', width:75, editable: false },
	                                        {name:'rate', index:'rate', width:125, editable: false, align:'right', formatter: numberFormat},
	                                        {name:'rateBasis', index:'rateBasis', width:40, editable: false, align:'center' },
	                                        {name:'charge', index:'charge', width:125, editable: false, align:'right', formatter: numberFormat},
	                                        {name:'payee', index:'payee', width:150, editable: false,   
	                                        	//to display payee address as mouse hover against D20356
	                                        			cellattr: function (rowId, val, rawObject, cm, rdata) {
	                                        	        return 'title="' +' ' + rawObject.address + '"';
	                                        	    }
	                                        },
	                                        {name:'pay', index:'pay', width:50, editable: false, align:'center' },
	                                        {name:'user', index:'user', width:100, editable: false },
	                                        {name:'dateTime', index:'dateTime', width:135, editable: false},
	                                        {name:'transaction', index:'transaction', width:85, editable: false },
											{name:'sequenceNumber', index:'sequenceNumber', width:75, editable: false },
	                                        {
				   								name : 'actions',
				   								index : 'actions',
				   								width : 100,
				   								align : "center",
				   								editable : false,//23744 changing editable to false from true
				   								search : false,
				   								sortable : false,
				   								formatter : 'actions',
				   								formatoptions : {
				   									keys : true,
				   									onEdit: function(rowId){
				   										
				   										openUpdateComodityOverLay(rowId);
				   									}
				   								}
				   							}  
								   ];
	var jsonReader = {root:"rows", page:"page",	total:"total", records:"records", repeatitems:false, cell:"cell", id:"chargeId" };

	createGrid(
			"payableChargeGrid", // grid id for user
			"payablePagerChargeGrid", // page id for user
			'/gates/billLadingPayable/loadGrid',  //get url
			'', //add url
			'/gates/billLadingPayable/editGrid', //edit url
			'/gates/billLadingPayable/deleteCharge', //delete url
			'/gates/billLadingPayable/deleteCharge', // delete multi select url //for 22002 multidelete
			colNamesForMaintainChargeGrid, 
			colModelForMaintainChargeGrid, 
			" ",
			"auto",
			10,
			[10,20,30],
			true,
			!hideDelete,
			false, //load once
			false, jsonReader,hideEdit,true,true,true,true,false,false,false,onLoading,false,true);
	
	
	
	

	$('#equipmentNumberOverlayImg').click(function(){
		casEquipmentVinsightLookup();
		//processUIValidations(index);
	});
	
	//var organizationId ="";
	//var url = _context+ '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK|';
/*	$('#payeeOverlay').gatesAutocomplete({
		source : url,
		minLength: 4,
		formatItem : function(data) {
			$('#organizationId').val("");
//			$('#payeeAddress').val("");
			return data.name + "-" + data.abbr;
		},
		formatResult : function(data) {
			return data.abbr + "-" + data.name;
		},
		select : function(data) {
//			$('#payeeAddress').val("");
			$('#payeeOverlay').val(data.abbr + "-" + data.name);
			organizationId = data.id;
			$('#organizationId').val(organizationId);
			$('#payeeOverlay').val($('#payeeOverlay').val());
			consigneeAroleLookUpSearch();
		},
		autoSelectFirst:true,						// code added for autoselect on tab out
		autoSelectCriteria:function(data){
		 if(data.abbr.toUpperCase()==$('#payeeOverlay').val().toUpperCase())
			 return true;
		 else if(data.abbr.toUpperCase()==$('#payeeOverlay').val().toUpperCase())
			 return true;
		 else 
			 return false;
	 }
	});*/
	
	//added -- to disable popup if addressRole is one 23556
	var orgId='';
	$('#payeeOverlay').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
		name: "Payee",
	 	extraParams: {
	 			 method: 'getPayeeSearch',
		 		 searchType: '289'
	 	},
	 	formatItem : function(item) {
	 		if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 			return item.name+"-"+item.abbr+"-"+item.carr;	
	 		}else{
	 			return item.name+"-"+item.abbr;
	 		}
	 	},
	 	formatResult: function(item) {
	 		//if(item.carr!='' && item.carr!='undefined' && item.carr!=undefined){
	 		//	return item.name+"-"+item.abbr+"-"+item.carr;	
	 		//}else{

	 			return item.name+"-"+item.abbr;
	 		//}
	 	},
	 	select : function(item) {
	 		//$('#payeeAddress').val("");//
	 		$('#payeeOverlay').val(item.name+"-"+item.abbr);//
	 		orgId=item.orgid;	
	 		$('#organizationId').val(orgId);
	 		$('#payeeOverlay').val($('#payeeOverlay').val());//
	 		if(item.count==1 || (item.carr!='' && item.carr!='undefined' && item.carr!=undefined)){
	 			console.log(item.arolid);
	 			//setting address role ID if it is one
                fetchAddresssDetails(item); //D032638
	 			$('#addressRoleId').val(item.arolid);
	 			
	 		}
	 		else if(item.count>1){
	 			consigneeAroleLookUpSearch();
	 		}
	 	},
		autoSelectFirst:true,		// code added for autoselect on tab out
		autoSelectCriteria:function(item){
		 if(item.abbr.toUpperCase()==$('#payeeOverlay').val().toUpperCase()){
			 return true;
		}else if(item.carr!='undefined' && item.carr!=null){
				if(item.carr.toUpperCase()==$('#payeeOverlay').val().toUpperCase()){
				 return true;
				}else
				return false;
		 }else if(item.name.toUpperCase()==$('#payeeOverlay').val().toUpperCase()){
			 return true;
		 }	 
		 else {
			 return false;
		 }
	 }
	});
	
	$('#addressLookUpImage').gatesPopUpSearch({
		func : function() {
			consigneeAroleLookUpSearch();
		}
	});
	
	if($('#shipmentNumber').val()!=''){
		$('#go').trigger("click");
	}

});






function clearOverlayFields(){
	$('#unitsOverlay').val("");
	$('#selectedChargeId').val("");
	$('#rateOverlay').val("");
	$('#chargeCodeOverlay').val("");
	$('#rateBasisOverlay').val("");
	$('#equipmentNumberOverlay').val("");
	$('#commodityOverlay').val("");
	$('#addressRoleId').val("");
	$('#payeeOverlay').val("");
	$('#payOverlay').html("");
    $('#payeeAddressOverlay').val("");
	$('#chargeOverlay').html("");
	$('#equipmentNumberOverlay').val("");
}

function consigneeAroleLookUpSearch(){
	//var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='+ $('#organizationId').val() + '&filterValue2=03'+'&filterValue3=';
	var actionUrl = _context + '/cas/addRoleSPSRLookup.do?filterValue1='+$('#organizationId').val()+'&filterValue2=04';
	//condition of organization id to prevent pop up if organization id is not set
		if($.trim($("#payeeOverlay").val())!='' && ($('#organizationId').val().trim()!='' && $('#organizationId').val()!='ALL' && $('#organizationId').val()!=0 ) ){
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, '', windowStyle);
		}
		else{
			alert("Select Payee first.");
		}
}
function addroleUpdate(data) {
	var values = data.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('#payeeAddress').val(finalAddress);
	$('#addressRoleId').val(values[9]);
}

function formatAddRoleDscrForSC(nameQualifier, addressLine1, city, state) {
	var nameQualifierTemp = "";
	var addressLine1Temp = "";
	var cityTemp = "";
	var stateTemp = "";
	
	if (nameQualifier != "") {
		nameQualifierTemp = nameQualifier;
	}
	if (addressLine1 != "") {
		if (nameQualifierTemp != "") {
			addressLine1Temp = " - " + addressLine1;
		} else {
			addressLine1Temp =  addressLine1;
		}
	}
	if (city != "") {
		cityTemp = " - " + city;
	}
	if (state != "") {
		stateTemp = ", " + state;
	}
	 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
}

function loadPageElement(responseText)
{
	document.getElementById("vvd").innerHTML=responseText.data.vvd;
	document.getElementById("billStatus").innerHTML=responseText.data.billStatus;
	document.getElementById("ldService").innerHTML=responseText.data.ldService;
	document.getElementById("customerGroup").innerHTML=responseText.data.customerGroup;
	document.getElementById("routing").innerHTML=responseText.data.routing;
	document.getElementById("rateDate").innerHTML=responseText.data.rateDate;
	document.getElementById("tariffNumber").innerHTML=responseText.data.tariffNumber;
	document.getElementById("trade").innerHTML=responseText.data.tradeValue;
	var seqNum=document.getElementById("seqNumber").innerHTML=responseText.data.seqNumber;
	if(seqNum==""|| seqNum==null)						//used to replace null with blank
		{
		document.getElementById("seqNumber").innerHTML="";
		}
	document.getElementById("comodityCount").innerHTML=responseText.data.comodityCount;
	document.getElementById("countUnRlsdHold").innerHTML=responseText.data.countUnRlsdHold;
	document.getElementById("countSplService").innerHTML=responseText.data.countSplService;
	document.getElementById("equpPieceCount").innerHTML=responseText.data.equpPieceCount;
	document.getElementById("preBillTransmit").innerHTML=responseText.data.preBillTransmit;
	var totaCharges = responseText.data.totalCharges;
	if(totaCharges != null){
	var formattedTotalCharges = totaCharges.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	document.getElementById("totalCharges").innerHTML=formattedTotalCharges;
	}
	calculateSubtotal();
	//document.getElementById("subTotalPayable").innerHTML=responseText.data.subTotalPayable;
	var totalPables = responseText.data.totalPayable;
	if(totalPables != null){
	var formattedTotalPayables = totalPables.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	document.getElementById("totalPayable").innerHTML=formattedTotalPayables;
	}
	if(($("#equipmentNumber").val())!="ALL")
	{
		var typeSize=document.getElementById("typeSizeEquipment").innerHTML=responseText.data.typeSizeEquipment;
		if(typeSize==""||typeSize==null)			//used to replace null with blank
			document.getElementById("typeSizeEquipment").innerHTML="";
	
	}
	else
		{
		document.getElementById("typeSizeEquipment").innerHTML="";
		}
		
	$('#totalCommodity').val(responseText.data.totalCommodity);
	
	$('#loadDischargePair').val(responseText.data.loadDischargePair);
}

function resetPage()
{
	document.getElementById("vvd").innerHTML='';
	document.getElementById("billStatus").innerHTML='';
	document.getElementById("ldService").innerHTML='';
	document.getElementById("customerGroup").innerHTML='';
	document.getElementById("routing").innerHTML='';
	document.getElementById("rateDate").innerHTML='';
	document.getElementById("tariffNumber").innerHTML='';
	document.getElementById("trade").innerHTML='';
	document.getElementById("seqNumber").innerHTML='';
	document.getElementById("comodityCount").innerHTML='';
	document.getElementById("hold").innerHTML='';
	document.getElementById("equpPieceCount").innerHTML='';
	document.getElementById("preBillTransmit").innerHTML='';
	document.getElementById("totalCharges").innerHTML='';
	document.getElementById("subTotalPayable").innerHTML='';
	document.getElementById("totalPayable").innerHTML='';
	document.getElementById("typeSizeEquipment").innerHTML='';
	$('#chargeCode').val('ALL');
}
function resetPage1()
{
	document.getElementById("vvd").innerHTML='';
	document.getElementById("billStatus").innerHTML='';
	document.getElementById("ldService").innerHTML='';
	document.getElementById("customerGroup").innerHTML='';
	document.getElementById("routing").innerHTML='';
	document.getElementById("rateDate").innerHTML='';
	document.getElementById("tariffNumber").innerHTML='';
	document.getElementById("trade").innerHTML='';
	document.getElementById("seqNumber").innerHTML='';
	document.getElementById("comodityCount").innerHTML='';
	document.getElementById("hold").innerHTML='';
	document.getElementById("equpPieceCount").innerHTML='';
	document.getElementById("preBillTransmit").innerHTML='';
	document.getElementById("totalCharges").innerHTML='';
	document.getElementById("subTotalPayable").innerHTML='';
	document.getElementById("totalPayable").innerHTML='';
}

function reloadGridValues(){
	
	$("#payableChargeGrid").trigger('reloadGrid');
}

function openUpdateComodityOverLay(rowId) {
	$('#chargeOverlayDIV').attr("style","visibility:visible");
	$('#payOverlayDIV').attr("style","visibility:visible");
	operation = "update";
	params = "rowId=" + rowId;
	$
			.ajax({
				type : "GET",
				url : _context + "/billLadingPayable/editPayable",
				data : params,
				success : function(responseText) {
					// for 23744
					$("#payableChargeGrid").trigger('reloadGrid');
					
					if (responseText.success == true){
						$('#msgDivCommodityOverlay').html("");
						$(":button:contains('Ok & New')").prop("disabled", true)
								.addClass("ui-state-disabled");
//						$(":button:contains('Ok')").prop("disabled", false)
//							.removeClass("ui-state-disabled");
						$("#addChargeDialog1").dialog("option", "title",
								'Add / Update Payables');
						mixCommOverlayMode = "edit";
						$('#selectedChargeId').val(responseText.data.chargeId);
						$('#unitsOverlay').val(responseText.data.units);
						$('#rateOverlay').val(responseText.data.rate);
						$('#chargeCodeOverlay').val(responseText.data.chargeCD);
						$('#rateBasisOverlay').val(responseText.data.rateBasis);
						$('#equipmentNumberOverlay').val(responseText.data.equipmentId);
						$('#commodityOverlay').val(responseText.data.line);
						$('#payeeOverlay').val(responseText.data.payee);
						$('#payeeAddressOverlay').val(responseText.data.payeeAddress);
						$('#payeeAddressOverlay').attr("disabled",true);
						$('#chargeOverlay').html(responseText.data.charge);
						$('#payOverlay').html(responseText.data.pay);
						$('#addressRoleId').val(responseText.data.addressRoleId);
						$("#addChargeDialog1").dialog('open');
						var queryString = "chargeCode="
							+ $('#chargeCodeOverlay').val();
						$
						.ajax({
							type : "GET",
							url : _context + "/billLadingPayable/returnEquipment",
							data:{
								chargeCode : $("#chargeCodeOverlay").val()
							},
							success : function(responseText) {
								if(responseText.data != '')
									$('#equipmentNumberOverlay').val(responseText.data);
								$.ajax({
									type : "POST",
									url : _context + "/billLadingPayable/validateCharge",
									data : queryString,
									success : function(responseText) {
										$('#popupSearchaddressLookUpImage').attr("style","display: block;vertical-align: middle;margin-top:7px;");
										if(responseText.data[0] == "S" || responseText.data[0] == "C"){
											$('#equipmentNumberOverlay').val("");
											$('#equipmentNumberOverlay').attr("disabled",true);
											$('#equipmentNumberOverlayImg').attr("style","display: none;");
											
										}else{
											$('#equipmentNumberOverlay').attr("disabled",false);
											$('#equipmentNumberOverlayImg').attr("style","display: block;vertical-align: middle;margin-top:6px;");
										}
										 if(responseText.data[0] == "S" || responseText.data[0	] == "E"){
											$('#commodityOverlay').attr("disabled",true);
											if(responseText.data[1] != null && responseText.data[1] != '')
												$('#commodityOverlay').val(responseText.data[1]);
										 }else{
												 $('#commodityOverlay').attr("disabled",false);
										 }
											 
										
									}
								});
							}
						});
						
					}
					

				}
			});
	
	
	
}	

function setValueInCommodityOverlayEdit(data){
	$('#mixCommItem').val(data.itemNumber);
	$('#mixCommPieces').val(data.piece);
	$('#mixCommNetWgt').val(data.netWeight);
	$('#mixCommKind').val(data.kind);
	$('#mixCommCube').val(data.cube);
	$('#mixCommNote').val(data.note);
	$('#mixCommCommDesc').val(data.commodityDesc);
	$('#mixCommItemId').val(data.item);
	$('#mixCommShipmentItemId').val(data.shipmentItemId);
	$('#mixCommUnitOfCommodity').val(data.unitOfCommodity);
	
	$('#mixCommodityCommoditycommentId').val(data.commentId);
	$('#mixCommodityCommodityCode').val(data.commodityCode);
	
}

function consigneeAddressPopupSearch() {
	orgCaller = 'consignee';
	var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1='
			+ $('#payeeOverlay').val() + '&filterValue2=03'+'&filterValue3='+$('#tradeCode').val();
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);
}

function fetchAddresssDetails(item){
	
	$.ajax({
		type : "POST",
		url : _context +"/shipment/specialservice/getAddressDetails",
		data : {
			addressId: item.addid
		},
		success : function(responseText) {
			
			
			$('#payeeAddressOverlay').val(responseText.data);
			
			
		
		}
	});
}

function casEquipmentVinsightLookup(){
	
	var shipmentNum= $("#shipmentNumber").val();
	var seqNum= $("#shipmentSequenceNumber").val();
	var corrNum= $("#shipmentCorrectionNumber").val();
	var LDSGroupCode = $('#loadDischargePair').val();
	var equpId=$('#equipmentNumberOverlay').val().trim();
	var equipPiece= $('#equpPieceCount').html();
	var status= $('#billStatus').html();
	var recDate = $('#rateDate').html();
	var ldServ =  $('#ldService').html();
	
	//defect-25770
	var urlCY="/cas/billLadingFreightlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ LDSGroupCode.trim()+","+recDate+","+status+","+equpId+","+ ldServ+","+equipPiece+",";
	var urlAU="/cas/billLadingUnitlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+LDSGroupCode.trim()+","+recDate+","+status+","+equpId+","+ldServ+","+equipPiece+","+"&reload=true";		
	var urlCON="/cas/billOfLadFrtListConvlookup.do?"+shipmentNum+","+seqNum+","+corrNum+","+ldServ+","+recDate+","+status+","+equpId+","+LDSGroupCode.trim()+","+equipPiece+","+"&reload=true";
	
	//var urlAU="/cas/billLadingUnitlookup.do?"+shipmentNum+","+seqNum+","+corrNum+",,,,"+equpId+",,,";	
//	var urlCON="/cas/billLadingFreightConvSearch.do?"+shipmentNum+","+seqNum+","+corrNum+",,,,,,9";


	var actionUrl="";
	if(LDSGroupCode=='AU'){
		actionUrl = _context+urlAU;
	}else if(LDSGroupCode=='CON'){
		actionUrl = _context+urlCON;
	}else if(LDSGroupCode=='LCL'){
		actionUrl = _context+urlCON;
	}else{
		actionUrl = _context+urlCY;
	}
	//actionUrl = _context + '/cas/receivedUnitsLookupSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, '', windowStyle);

}

function loadVinNumber(id)
{
 //alert("loadVinNumber"+id)	;
	var casData = id.split('|');
	 $('#equipmentNumberOverlay').val(casData[0]);
	 $.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/populateCommodity",
			data : {
				equipmentId : $("#equipmentNumberOverlay").val(),
				
			},
			success : function(responseText) {
				$('#commodityOverlay').val(responseText.data);
			}
	 });
}

function loadConEquipmentNumber(id){
	//alert("loadVinNumber"+id);
	var casData = id.split('|');
	 $('#equipmentNumberOverlay').val(casData[0]);
	 $.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/populateCommodity",
			data : {
				equipmentId : $("#equipmentNumberOverlay").val(),
				
			},
			success : function(responseText) {
				$('#commodityOverlay').val(responseText.data);
			}
	 });
}

function saveShipment(){
	$("#billLadingPayableForm").attr("action","save");
	var queryString = $("#billLadingPayableForm").formSerialize();
	$("#billLadingPayableForm").submit();
}

function transmitShipment(){
	$("#billLadingPayableForm").attr("action","transmit");
	var queryString = $("#billLadingPayableForm").formSerialize();
	$("#billLadingPayableForm").submit();
	
}


function onLoading(){
	if(  $("#billStatus").html() == "PENDING" || $("#billStatus").html() == "DESCRIBED" ||
			$("#billStatus").html() == "RATED" || $("#billStatus").html() == "IN AUDIT"){
		$('#transmit').attr("disabled", false);
	}else{
		$('#transmit').attr("disabled", true);
	}	
	$("#sData").hide();
	$("div.ui-pg-div.ui-inline-del").hide();
	
	if($("#billStatus").html() == "ISSUED" || $("#billStatus").html() == "CORRECTED" ||  !(isPayableAdd || isPayableUpdate ||isPayableDelete) ){
		$("div.ui-pg-div.ui-inline-edit").hide();
		$("div.ui-pg-div.ui-inline-add").hide();
		$('#del_payableChargeGrid').hide();
		$("#sData").hide();
		$('#payableClauseAdd').attr("style","display:none");
		$('#save').attr("disabled",true);
		$('#bill').attr("disabled",true);
	}else{
		$("div.ui-pg-div.ui-inline-add").hide();
		if(isPayableDelete){
		$('#del_payableChargeGrid').show();
		}
		if(isPayableUpdate){
		$("div.ui-pg-div.ui-inline-edit").show();
		}
		if(isPayableAdd){
		$('#payableClauseAdd').attr("style","display:block");
		}
		$('#save').attr("disabled",false);
		$('#bill').attr("disabled",false);
	} 
	
	if($('#comodityCount').html() =='' || $('#comodityCount').html() == "0"){
		$('#payableClauseAdd').attr("style","display:none");
	}
	//22735
	if($("#billStatus").html() == "ISSUED" || $("#billStatus").html() == "CORRECTED"){
		//to disable checkbox 22735
		$("#cb_payableChargeGrid").attr('disabled',true);
		$("[id^=jqg_payableChargeGrid]").attr('disabled',true);
		//to disable action column 22735
		$("div.ui-pg-div.ui-inline-edit","#gbox_payableChargeGrid").css("visibility", 'hidden');
		$("div.ui-pg-div.ui-inline-del","#gbox_payableChargeGrid").css("visibility", 'hidden');
	}else{
		//to reenable checkboxes 22735
		$("#cb_payableChargeGrid").attr('disabled',false);
		$("[id^=jqg_payableChargeGrid]").attr('disabled',false);
	}
}


function loadEquipmentNumber(id){
	var casData = id.split('|');
	 $('#equipmentNumberOverlay').val(casData[0]);
	 $.ajax({
			type : "POST",
			url : _context + "/billLadingPayable/populateCommodity",
			data : {
				equipmentId : $("#equipmentNumberOverlay").val(),
				
			},
			success : function(responseText) {
				$('#commodityOverlay').val(responseText.data);
			}
	 });
}


function rateBill(){
	
	var queryString = $("#billLadingPayableForm").formSerialize();
	blockUI();
	$.ajax({
		type : "POST",
		url : _context + "/billLadingPayable/rateBill",
		data : queryString,
		success : function(responseText) {
			$.unblockUI();
			if (responseText.messages.error.length == 0) {
				
				if(responseText.data.rateView == "showError"){
					$("#billLadingPayableForm").loadJSON(responseText.data);
					loadErrorOverLay(responseText);		
					
					$('#re_error_dialog').dialog( "open" );
					$("#reErrorGrid").trigger('reloadGrid');
				}else if(responseText.data.rateView == "showChoices"){
					$("#billLadingPayableForm").loadJSON(responseText.data);
					loadChoiceOverLay(responseText);

					$('#re_choice_dialog').dialog( "open" );
//					createChoiceGrid('/billLadingPayable');
					$("#reChoiceGrid").trigger('reloadGrid');
				}else if (responseText.data.rateView == "hold"){
					if(responseText.data.targetPage!="Maintain Bill"){
					navigateToTargetPage('',responseText.data.targetPage, 
							$("#shipmentNumber").val(), $("#shipmentSequenceNumber").val(),$("#shipmentCorrectionNumber").val(),
							"BLFP");
					}else{
						document.location.href=_context+"/shipment/showForm";
					}
//					openHoldsUnreleasedDialog('shipment','/billLadingPayable/loadUnreleasedHolds');
//					$("#holdsUnreleased").attr("style","visibilty:visible");
//					$('#holdUnreleasedGrid').trigger('reloadGrid');
					$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
				}if(responseText.data.rateView == "exception"){
					$('#msgDiv').html("<div class=\"message_error\">"+responseText.data.billManagerException+"</div>");
					return;
				}else if(responseText.data.rateView == "blank"){
					$('#msgDiv').html("<div class=\"message_success\">Bill Manager request successfully completed</div>");
//					openHoldsUnreleasedDialog('shipment');
				}
				else if(responseText.data.rateView == "Success"){
					showResponseMessages("msgDiv", responseText);
					document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
					$("#shipmentNumber").val()+'&shipmentSequenceNumber='+$("#shipmentSequenceNumber").val()
					+'&shipmentCorrectionNumber=000&navigationUrl=billLadingPayable&commodityDisplay=last';
				}
				$("#chargeGrid").trigger('reloadGrid');
			}
			else{
				showResponseMessages("msgDiv", responseText);
				return;
			}
		}
	});

}



function confirmMessage(){
	if(doesChange == true){
		var r= confirm("Changes done have not been saved. Do you wish to continue Y or N ?");
		if(r ==  true){
			return true;
		}else{
			return false;
		}
	}else{
		return true;
	}
	
}

function confirmMessage1(){
	if(doesFieldChange == true){
		var r= confirm("Changes done have not been saved. Do you wish to continue Y or N ?");
		if(r ==  true){
			doesFieldChange=false;
			return true;
		}else{
			return false;
		}
	}else{
		return true;
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

		if(messageContent!=''){
			$('#'+msgDivId).html(messageContent);
			window.scrollTo(0, 0);
		}
  	}
}


function concludeRatingForShipment(id)
{		
	$('#re_choice_dialog').dialog( "close" );
	var url = "";
	if($('#reUseSelection').val() != undefined && $('#reUseSelection').val() != ""){
		url = "/billLadingPayable/concludeRating?id="+id+"&reUseSelection="+$('#reUseSelection').val();
	}else{
		url = "/billLadingPayable/concludeRating?id="+id;
	}
	
	blockUI();
	$.ajax({
		   type: "POST",				   							   
		   url: _context + url,
		   success: function(responseText){	
			   $.unblockUI();
			   if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');
					loadErrorOverLay(responseText);		
					$("#reErrorGrid").trigger('reloadGrid');
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
				}else if(responseText.data.rateView == "showChoices"){
					loadChoiceOverLay(responseText);
					$("#ratingChoiceForm").loadJSON(responseText.data);
					$("#reChoiceGrid").trigger('reloadGrid');
					

//					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
//					if(responseText.data.isAllChoicesUnSelectable != null 
//							&& responseText.data.isAllChoicesUnSelectable == "Y"){
//						$('#reChoiceCloseBtn').hide();	
//						$('#reChoiceContinueBtn').show();
//					}else{
//						$('#reChoiceCloseBtn').show();	
//						$('#reChoiceContinueBtn').hide();	
//					}											
				    jQuery("#reChoiceGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){
											
					$('#re_error_dialog').dialog('open');
					$("#ratingErrorForm").loadJSON(responseText.data);
//					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				    jQuery("#reErrorGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#shipmentForm').loadJSON(responseText.data);
					showResponseMessages("msgDiv", responseText);
				}else if(responseText.data.rateView == "Success"){
					showResponseMessages("msgDiv", responseText);
					document.location.href = _context+ "/maintainRate/loadShipmentDetails?shipmentNumber="+ 
					$("#shipmentNumber").val()+'&shipmentSequenceNumber='+$("#shipmentSequenceNumber").val()
					+'&shipmentCorrectionNumber=000&navigationUrl=2';
				}
				else {
					$('#shipmentForm').loadJSON(responseText.data);
					jQuery("#chargeGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					showResponseMessages("msgDiv", responseText);
				}	
			   
		   }
	});	
}
function calculateSubtotal()
{
	var queryString = $("#billLadingPayableForm").formSerialize();
	var subTotal ="";
	var formattedSubTotal ="";
	
	$.ajax({
		type : "POST",
		url : _context + "/billLadingPayable/reloadSubPayable",
		data : 	queryString,
		success : function(responseText) {
			subTotal = responseText.data;
			if(subTotal != null){
			formattedSubTotal = subTotal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			document.getElementById("subTotalPayable").innerHTML=formattedSubTotal;
			}
						
				}
		});
}

function onClickSpclSvc (){
	var shipmentNumber1=$('#shipmentNumber').val();
	var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
	var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
	document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ#SpclSvc";
}

function onClickHold (){
	var shipmentNumber1=$('#shipmentNumber').val();
	var shipmentSequenceNumber1=$('#shipmentSequenceNumber').val();
	var shipmentCorrectionNumber1=$('#shipmentCorrectionNumber').val();
	document.location.href=_context+"/shipment/showForm?shipment_number="+shipmentNumber1+"&shipment_sequence_number="+shipmentSequenceNumber1+"&shipment_correction_number="+shipmentCorrectionNumber1+"&src=FTWQ#Hold";
}

function addroleUpdateForSPSR(data) {
	var values = data.split("|");
	var finalAddress = formatAddRoleDscrForSC(values[4],values[7],values[2],values[6]);//nameQualifier, addressLine1, city, state)
	$('#payeeAddress').val(finalAddress);
    $('#payeeAddressOverlay').val(finalAddress);
	$('#addressRoleId').val(values[9]);
}

//Fix for - D024950
function numberFormat(cellvalue, options, rowObject){
	if(cellvalue != null && $.trim(cellvalue) != ''){
		return cellvalue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return $.trim(cellvalue);
}


// D029073, this method should do something, but what?
function loadConVinNumber(id){
	//alert("loadVinNumber"+id);
	var casData = id.split('|');
	$("#equipmentNumberOverlay").val(casData[0]);

}
$(document).ready(function () {

	// attach validation engine with form

	$("#shipmentNumber").focus();
	/*$("#cancelBill").tabout(function()
			{
				$("#shipmentNumber").focus();
			});*/

	if(null!=$('#shipmentNumber').val() && $.trim($('#shipmentNumber').val())!=''){
		displayShipment();
		//added against 18175 to lock screen
		$.unblockUI();
	}
	//Added against 25291 to disable buttons based on status
    function validateButton() {
        var status = $('#statusCode').val();
        /* D027024 */
        var enableFreightCorrections = $('#enableFreightCorrections').val();
        if (enableFreightCorrections === 'false') {
            $('#initiate').prop("disabled", true);
            $('#append').prop("disabled", true);
            $('#confirm').prop("disabled", true);
            $('#cancelFC').prop("disabled", true);
            $('#cancelBill').prop("disabled", true);
            return;
        }
        /* D027024 */
        $('#auditRemark').val('');
        if (status == 'ISSD') {
            $('#confirm').prop("disabled", true);
            $('#cancelFC').prop("disabled", true);
            $('#cancelBill').prop("disabled", true);
            $('#append').prop("disabled", true);
        } else if (status == 'CORR') {
            var isappend = $('#isAppendEnable').val();
            if (isappend == "false") {
                $('#append').prop("disabled", true);
            }
            else {
                $('#append').prop("disabled", false);
            }
            $('#confirm').prop("disabled", true);
            $('#cancelFC').prop("disabled", true);
            $('#cancelBill').prop("disabled", true);
        }
        else if (status == 'INPD' || status == 'INPP' || status == 'INPA') {
            $('#append').prop("disabled", true);
            $('#confirm').prop("disabled", true);
            $('#initiate').prop("disabled", true);
        } else if (status == 'INPR') {
            $('#initiate').prop("disabled", true);
            $('#append').prop("disabled", true);
        } else {
            $('#confirm').prop("disabled", true);
            $('#initiate').prop("disabled", true);
            $('#cancelFC').prop("disabled", true);
            $('#append').prop("disabled", true);
            $('#cancelBill').prop("disabled", true);
        }
    }
	function displayShipment() {
		validateButton();//Added against 25291 to disable buttons based on status
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

	$('#shipmentCorrectionNumber').attr("disabled","disabled");
	/* if($('#shipmentNumber').val()!='' && $('#shipmentNumber').val().length == 7 && $('#shipmentSequenceNumber').val()!='' && $('#shipmentSequenceNumber').val().length ==3 )
	{
		$('#go').removeAttr("disabled","disabled");
	} */


	/* $('#shipmentSequenceNumber').blur(function(){
	if($('#shipmentNumber').val()!='' && $('#shipmentNumber').val().length == 7 && $('#shipmentSequenceNumber').val()!='' && $('#shipmentSequenceNumber').val().length ==3 )
		{
			$('#go').removeAttr("disabled","disabled");
		}
	}); */

	if($('#hasChanged').val()!="1")
		{
			$('#save').attr("disabled","disabled");
		}
	else
	{
		$('#save').removeAttr("disabled");
	}

	$('#go').click(function(){
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {
			$('#shipmentCorrectionNumber').removeAttr("disabled");
			document.location.href=_context+'/bill/frtcorrection/find?shipmentNumber='+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber='+$('#shipmentCorrectionNumber').val();

		//added against 18175 to lock screen
		if($('#shipmentCorrectionNumber').val().length==3){
		blockUI();
		}
		}
		return false;
	});

	$('#clear').click(function(){
		/*$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {
	    document.location.href=_context+'/bill/frtcorrection/?shipment_number='+ $('#shipmentNumber').val()+'&shipment_sequence_number='+$('#shipmentSequenceNumber').val()+'&shipment_correction_number='+$('#shipmentCorrectionNumber').val()+'&src=FTWQ';
		}*/
		document.location.href=_context+'/bill/frtcorrection/clear';
		return false;
	});
	clickShipmentChargesBtn();
	clickShipmentPayablesBtn();

	$('#exit').click(function(){
		var firstPage = $(document).getUrlParam("firstPage");
		if($('#sourceScreen').val()=='SETUP')
			{
				document.location.href=_context+'/billingSetup/loadShipmentDetail?firstPage='+firstPage;
			}
		else if($('#sourceScreen').val()=='BILL')
		{
			document.location.href=_context+'/shipment/showForm?firstPage='+firstPage;
		}else if($('#sourceScreen').val()=='HHGS')
		{
			var url = "/houseHoldShipment/showForm?firstPage="+firstPage;
			window.location = _context + url;
		}
		else if($('#sourceScreen').val()=='CHARGES')
		{
			document.location.href=_context+'/maintainRate/showform?firstPage='+firstPage;
		}
		else
			{
				document.location.href=_context+'/welcome.html';
			}
	});

	$('#save').click(function(){
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {
			$('#shipmentCorrectionNumber').removeAttr("disabled");
			$('#billFrtCorrectionForm').attr('action','update');
			$('#billFrtCorrectionForm').submit();
		}
		return false;
	});

	/*if($('#entireSetAllowed').val()=="N")
		{
			$("#entireSet").attr("disabled", true);
		}*/

	$('input[type="radio"]').change(function()
			{

					if($("#entireSet").attr("checked")==true ||
							$("#entireSet").attr("checked")=='true'||$("#entireSet").attr("checked")=='checked')
					{
						$('#entireSetOrIndividual').val("Entire");
					}
					else if($("#individual").attr("checked")==true ||
							$("#individual").attr("checked")=='true'||$("#individual").attr("checked")=='checked')
					{
						$('#entireSetOrIndividual').val("Individual");
					}
			});

	$('#initiate').click(function(){
		$('#buttonClickedName').val("Initiate");
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {

			if($('#freightCorrectionErrorCodeWithDesc').val()!='')
			{
				$('#freightCorrectionErrorCodeWithDesc').validationEngine('showPrompt', 'Error Code is allowed for Confirm and Cancel Bill actions only.', 'error', 'topRight', true);
				return false;
			}

			//if($('#isHouseHoldBill').val()==("true"))

			if($('#entireSetAllowed').val()==("Y") || $('#isHouseHoldBill').val()==("true"))
			{	if($('#isHouseHoldBill').val()==("true")){
					$('#labelContent').html("Bill type is house hold goods and more than one bill exists.");
				}	else{
					$('#labelContent').html("Bill  is prorated and more than one bill exists.");
				}
				$('#houseHold_correction_overlay').dialog('open');
					$('#entireSetOrIndividual').val("");

					if($('#entireSetAllowed').val()==("Y")) {
						$("#entireSet").attr("checked","checked");
						$("#entireSet").removeAttr("disabled");
					} else {
						$("#individual").attr("checked","checked");
						$("#entireSet").prop("disabled",true);
					}
					$('input[type="radio"]').trigger('change');
					/*$("#entireSet").removeAttr("checked");
					$("#individual").removeAttr("checked");*/

				}else if ($('#entireSetAllowed').val()==("setExists")){
					$('#labelContent').html("Bill  is prorated and more than one bill exists.");
					$('#houseHold_correction_overlay').dialog('open');
					$('#entireSetOrIndividual').val("");
					$("#individual").attr("checked","checked");
					$("#entireSet").prop("disabled",true);
					$('input[type="radio"]').trigger('change');
				}else{
					$('#shipmentCorrectionNumber').removeAttr("disabled");
					$('#billFrtCorrectionForm').attr('action','initiate');
					$('#billFrtCorrectionForm').submit();
				}
		}
		return false;
	});

	$('#append').click(function(){
		$('#buttonClickedName').val("Append");
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {

			if($('#freightCorrectionErrorCodeWithDesc').val()!='')
			{
				$('#freightCorrectionErrorCodeWithDesc').validationEngine('showPrompt', 'Error Code is allowed for Confirm and Cancel Bill actions only.', 'error', 'topRight', true);
				return false;
			}

			//if($('#isHouseHoldBill').val()==("true"))
			if($('#entireSetAllowed').val()==("Y"))
			{	if($('#isHouseHoldBill').val()==("true")){
				$('#labelContent').html("Bill type is house hold goods and more than one bill exists.");
			}	else{
				$('#labelContent').html("Bill  is prorated and more than one bill exists.");
			}
				$('#houseHold_correction_overlay').dialog('open');
				$('#entireSetOrIndividual').val("");
				$("#individual").attr("checked","checked");
				//D030199
				$("#entireSet").prop("disabled",true);
				$('input[type="radio"]').trigger('change');
				//$('input[type="radio"]').trigger('change');
				/*$("#entireSet").removeAttr("checked");
				$("#individual").removeAttr("checked");	*/
			}
		else
		    {
				$('#shipmentCorrectionNumber').removeAttr("disabled");
				$('#billFrtCorrectionForm').attr('action','append');
				$('#billFrtCorrectionForm').submit();
			}
		}
		return false;
	});

	$('#confirm').click(function(){
		$('#buttonClickedName').val("Confirm");
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {

		if($("#freightCorrectionErrorCodeWithDesc").val()==null || $("#freightCorrectionErrorCodeWithDesc").val()=="")
		{
			$('#freightCorrectionErrorCodeWithDesc').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
			return false;
    	}

		if($("#auditRemark").val()==null || $("#auditRemark").val()=="")
		{
			$('#auditRemark').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
			return false;
    	}
		if($('#freightCorrectionErrorCode').val()=='')
			{
				$('#freightCorrectionErrorCode').val($("#freightCorrectionErrorCodeWithDesc").val());
			}

		//if($('#isHouseHoldBill').val()==("true"))
		console.log('entireSetAllowed='+$('#entireSetAllowed').val()+" "+$('#isHouseHoldBill').val());

		if($('#entireSetAllowed').val()==("Y") )
		{	if($('#entireSetAllowed').val()==("Y") && $('#isHouseHoldBill').val()==("true")){
			$('#labelContent').html("Bill type is house hold goods and more than one bill exists.");
		}	else if ($('#entireSetAllowed').val()==("Y")){
			$('#labelContent').html("Bill  is prorated and more than one bill exists.");
		}
			$('#houseHold_correction_overlay').dialog('open');
			$('#entireSetOrIndividual').val("");
			$("#entireSet").attr("checked","checked");
			$('input[type="radio"]').trigger('change');
			/*$("#entireSet").removeAttr("checked");
			$("#individual").removeAttr("checked");*/

		}
		 else if($('#isHouseHoldBill').val()==("true")){
        			$('#labelContent').html("Bill type is house hold goods and more than one bill exists.");
        			$('#houseHold_correction_overlay').dialog('open');
        			$('#entireSetOrIndividual').val("");
        			$("#individual").attr("checked","checked");
        			$("#entireSet").prop("disabled",true);
        			$('input[type="radio"]').trigger('change');
         }else
			{
				$('#shipmentCorrectionNumber').removeAttr("disabled");
				$('#billFrtCorrectionForm').attr('action','confirm');
				$('#billFrtCorrectionForm').submit();
			}
		}
		return false;
	});

	$('#cancelBill').click(function(){
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {

		if($("#freightCorrectionErrorCodeWithDesc").val()==null || $("#freightCorrectionErrorCodeWithDesc").val()=="")
		{
			$('#freightCorrectionErrorCodeWithDesc').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
			return false;
    	}



		if($("#auditRemark").val()==null || $("#auditRemark").val()=="")
		{
			$('#auditRemark').validationEngine('showPrompt', '*This field is required', 'error', 'topRight', true);
			return false;
    	}



    	if($("#auditRemark").val().length > 255)
		{
			$('#auditRemark').validationEngine('showPrompt', "Can't be more than 255 character", 'error', 'topRight', true);
			return false;
		}

		if($('#freightCorrectionErrorCode').val()=='')
		{
			$('#freightCorrectionErrorCode').val($("#freightCorrectionErrorCodeWithDesc").val());
		}

			$('#shipmentCorrectionNumber').removeAttr("disabled");
			$('#billFrtCorrectionForm').attr('action','cancelBill');
			$('#billFrtCorrectionForm').submit();
		}
		return false;
	});

	$('#cancelFC').click(function(){
		$('#buttonClickedName').val("cancelFC");
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {

			if($('#freightCorrectionErrorCodeWithDesc').val()!='')
			{
				$('#freightCorrectionErrorCodeWithDesc').validationEngine('showPrompt', 'Error Code is allowed for Confirm and Cancel Bill actions only.', 'error', 'topRight', true);
				return false;
			}

			//if($('#isHouseHoldBill').val()==("true"))
			if($('#entireSetAllowed').val()==("Y"))
			{	if($('#isHouseHoldBill').val()==("true")){
				$('#labelContent').html("Bill type is house hold goods and more than one bill exists.");
			}	else{
				$('#labelContent').html("Bill  is prorated and more than one bill exists.");
			}
				$('#houseHold_correction_overlay').dialog('open');
				$('#entireSetOrIndividual').val("");
				$("#entireSet").attr("checked","checked");
				$('input[type="radio"]').trigger('change');
				/*$("#entireSet").removeAttr("checked");
				$("#individual").removeAttr("checked");*/

			}
			else
			{
				$('#shipmentCorrectionNumber').removeAttr("disabled");
				$('#billFrtCorrectionForm').attr('action','cancelFC');
				$('#billFrtCorrectionForm').submit();
			}
		}
		return false;
	});

	$('#sendDoc').click(function(){
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {
	    document.location.href=_context+'/printFreightBill/go?shipmentNumber='+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber='+$('#shipmentCorrectionNumber').val()+'&source=FC';
		}
		return false;
	});

	$('#bill').click(function(){
		$("#billFrtCorrectionForm").validationEngine('attach');
		if ($("#billFrtCorrectionForm").validationEngine('validate')) {
		    if($('#isHouseHoldBill').val()==("true")){
		        var url = "/houseHoldShipment/showForm?shipment_number="+$('#shipmentNumber').val()+'&src=FTWQ';
		        window.location = _context + url;
		    }else{
	            document.location.href=_context+'/shipment/showForm?shipment_number='+ $('#shipmentNumber').val()+'&shipment_sequence_number='+$('#shipmentSequenceNumber').val()+'&shipment_correction_number='+$('#shipmentCorrectionNumber').val()+'&src=FTWQ';
		    }
		}
		return false;
	});


		//code for shipment no predictive search
		 //var url =	_context+'/cas/autocomplete.do?method=searchShpmntNo&searchType=353';
		 //var url =	_context+'/cas/autocomplete.do?method=searchShpmntNoForHeader&searchType=355';
	var url =	_context+'/cas/autocomplete.do?method=searchShipmentAndMinSeqNo&searchType=350';
		 $('#shipmentNumber').gatesAutocomplete({
				source: url,
				minLength: 7,
				formatItem: function(data) {
					return data.SHMT_NO;
				},
				formatResult: function(data) {
					return data.SHMT_NO;
				},
				//autoSelectFirst:true,
				select: function(data) {
					$('#shipmentNumber').val(data.SHMT_NO);
					//$('#hiddenSrcForPrdctv').val(data.source);
					/*if($('#shipmentSequenceNumber').val()=="")
						{*/
							$('#shipmentSequenceNumber').val(data.SEQ_NO);
						//}
					$('#go').trigger("click");
				}
			});


		//written here to capture latest value for $('#shpmntNo').val()
			//code for shipment sequence no predictive search
			 var url1 =	_context+'/cas/autocomplete.do?method=searchShpmntSeqNo&searchType=354';
			 $("#shipmentSequenceNumber").gatesAutocomplete({
					source: url1,
					extraParams:
					{
						parentSearch:function()
						{
							return $("#shipmentNumber").val();
						}
					},
					//minLength: 7,
					formatItem: function(data) {
						return data.sequenceNo;
					},
					formatResult: function(data) {
						return data.sequenceNo;
					},
					autoSelectFirst:true,
					select: function(data) {
						$("#shipmentSequenceNumber").val(data.sequenceNo);
						$('#go').trigger("click");
					}
				});

		/* //Blurr the data for invalid Organization Id
			 $('#shipmentNumber').blur(function(){
				if($("#hiddenSrcForPrdctv").val()==null || $("#hiddenSrcForPrdctv").val()==""){
		        	$("#shipmentNumber").val("");
		        	$("#shipmentNumber").validationEngine('showPrompt', 'Please enter  a valid shipment name', 'error', true);
					return false;
		    	}
		    });  */

		// code for predictive search for tariff
		var url = _context+'/cas/autocomplete.do?method=frtErrorCodePsearch&searchType=360';
		 $('#freightCorrectionErrorCodeWithDesc').gatesAutocomplete({
			 source:url ,
				formatItem: function(data) {
					return data.id + "-" + data.name;
				},
				formatResult: function(data) {
					return data.id + "-" + data.name;
				},
				select: function(data) {
					$('#freightCorrectionErrorCodeWithDesc').val(data.id + "-" + data.name);
					//$('#freightCorrectionErrorCodeWithDesc').val(data.id);
					$('#freightCorrectionErrorCode').val(data.id);
				},
				autoSelectFirst:true,
				onChange:function(){
					/*if($("#freightCorrectionErrorCodeWithDesc").val()!=$('#freightCorrectionErrorCode').val())
						$('#freightCorrectionErrorCode').val('');*/
				}
			});

		 //code to bind POP-Up Search
		 $('#freightCorrectionErrorCodeWithDesc').gatesPopUpSearch({func:function() {errorCodePopupSearch();}});

		/*$("#sendDoc").focusout(function()
			{
				$("#shipmentNumber").focus();
			});*/
		 var shipNum = getParamByName( 'shipmentNumber' );

		 if($('#shipmentNumber').val()!='' && (shipNum==null || shipNum=="") && ($('#msgDiv').text().trim().length==0)){

			 $('#go').trigger("click");
			}


		 var args = {
					entityType: 'SHMT',
					entityId: $('#shipmentId').val(),
					commentId:  'commentId',
					displayCommentTypes: 'CDBTR,DISPUTE,HZRD,OPS,PCCOL,PDBTR,WEBE,WIRE,CSS,DOC,KICK,PCACTY,PCCSS,SYS,WEBS'
				};
		$("#comment_link").comments(args);


		/*$("#freightCorrectionErrorCodeWithDesc").change(function(){
			if($("#freightCorrectionErrorCodeWithDesc").val()!=$('#freightCorrectionErrorCode').val())
			$('#freightCorrectionErrorCode').val('');
		});*/

		/*permission shipment security*/
		/*alert("isfreightcorrectionDisplayOnly="+isfreightcorrectionDisplayOnly);
		alert("isfreightcorrectionConfirm="+isfreightcorrectionConfirm);
		alert("isfreightcorrectionCancelBill="+isfreightcorrectionCancelBill);*/
		enforceSecurityDivAndButtons("mainDiv", isfreightcorrectionDisplayOnly);
		enforceSecurityDivAndButtons("confirm", isfreightcorrectionConfirm);
		enforceSecurityDivAndButtons("initiate", isfreightcorrectionInitiate);
		enforceSecurityDivAndButtons("save", isfreightcorrectionUpdate);
		enforceSecurityDivAndButtons("append", isfreightcorrectionAppend);
		enforceSecurityDivAndButtons("cancelFC", isfreightcorrectionCancelFc);
		enforceSecurityDivAndButtons("cancelBill", isfreightcorrectionCancelBill);
		enforceSecurityDivAndButtons("sendDoc", isfreightcorrectionSenddoc);
		enforceSecurityTitle(isfreightcorrectionDisplayOnly);
		enforceSecurityDivAndButtons('shipmentChargesBtn', isChargesDisplayOnly);//charges
		enforceSecurityDivAndButtons('shipmentPayablesBtn', isPayablesDisplayOnly);//payables


		$('input').blur(function() {
			$('form').validationEngine('detach');
			});
		tabSequence('#billFrtCorrectionForm',false,false);
	});//end of document.ready

	function removeErrorPointers() {
		$('#billFrtCorrectionForm').validationEngine('detach');
	}

	function errorCodePopupSearch() {
		var values=$('#freightCorrectionErrorCodeWithDesc').val().split("-");
		var param;
		if(values[0]!=null){
			param=values[0];
		}else{
			param=values[1];
		}
		var actionUrl = _context+'/cas/billingFrtCorrtnErrcodelookup.do?filterValue1='+param;
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'ErrorCodeSearch', windowStyle);
	}

	function errCodeSearchUpdate(id){
		var values = id.split("|");
		var errCode = values[0];
		var errDesc = values[1];
		$('#freightCorrectionErrorCodeWithDesc').val(errCode+'-'+errDesc);
		$('#freightCorrectionErrorCode').val(errCode);
		$('#freightCorrectionErrorCodeDesc').val(errDesc);
		}

	function getParamByName( name )
	{
	 name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	 var regexS = "[\\?&]"+name+"=([^&#]*)";
	 var regex = new RegExp( regexS );
	 var results = regex.exec( window.location.href );
	 if( results == null )
	  return "";
	else
	 return results[1];
	}

	function  clickShipmentChargesBtn(){

		$("#shipmentChargesBtn").click(function() {
			//if(!checkActionValidation()){return; }
			//if(checkDirtyData()==false){return; }
			var shipmentNumberHeader = $("#shipmentNumber").val();

			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();

			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
				shipment_sequence_number="000";
			}
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				shipment_correction_number="000";
			}
			/*if((changeInShipperConsignee==true || changeInParties==true || changeInRefNumberMarks==true || changeInRoutingVVD==true ||
					changeInCommodity==true || changeInMilitary==true || changeInSpecialServices==true || changeInClauses==true ||
					changeInShipmentHold==true || changeInShipmentOverride==true ||
					changeInPartiesGrid==true || changeInSpecialServiceGrid==true || changeInClausesGrid==true || changeInHoldGrid==true || oneTimeCustomerAdded==true)
					&& ($('#statusCode').text() != 'ISSUED') && ($('#statusCode').text() != 'CORRECTED') && ($('#statusCode').text() != "")){

						var conf= confirm('All unsaved changes will be discarded. Continue?');
				   		if(conf== true ){
				   			var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
							shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
							"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2";
						window.location = _context + url;
				   		}
			}else{*/
				var firstPage = $(document).getUrlParam("firstPage");
				var url = "/maintainRate/loadShipmentDetails?shipmentNumber="+
				shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
				"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2"+"&firstPage="+firstPage;
				window.location = _context + url;
			//}


		}	);
	}
	function clickShipmentPayablesBtn(){
		$("#shipmentPayablesBtn").click(function() {
			//if(!checkActionValidation()){return; }
			//if(checkDirtyData()==false){return; }
			var shipmentNumberHeader = $("#shipmentNumber").val();

			var shipment_sequence_number = $("#shipmentSequenceNumber").val();
			var shipment_correction_number = $("#shipmentCorrectionNumber").val();

			if(shipment_sequence_number == null	|| shipment_sequence_number == ""){
				shipment_sequence_number="000";
			}
			if(shipment_correction_number == ""	|| shipment_correction_number == null){
				shipment_correction_number="000";
			}
			var firstPage = $(document).getUrlParam("firstPage");
			var url = "/billLadingPayable/find?shipmentNumber="+
				shipmentNumberHeader+"&shipmentSequenceNumber="+shipment_sequence_number+
				"&shipmentCorrectionNumber="+shipment_correction_number+"&navigationUrl=2"+"&firstPage="+firstPage;
			window.location = _context + url;

		}	);
		}


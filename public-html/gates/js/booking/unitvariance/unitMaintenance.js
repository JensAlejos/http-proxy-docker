var prevTCN = null;
$(function() {

	$('#unitMaintenanceForm').validationEngine('attach');
	$('#commentsDiv').hide();
	$('#receivedUnitId').bind('keypress',
			function(event) {
				// keyCode for enter key is 13
				if (event.keyCode == 13) {
					fetchUnitMaintenanceDetails();
				}
			});

	$('#uMaintenanceExit').click(function() {
		$.ajax({
			url: _context+"/unit_variance_and_vvd/unit_maintenance/exit",
			success: function(responseText){
				if(responseText.success){
					document.location.href = _context +"/cas/receivedUnitsSearch.do";
				}
			}
		});
	});

	$('#uMaintenanceSave').click(function() {

		$("#phoneAreaCode").attr("value",$.trim($("#phoneAreaCode").attr("value")));
		$("#phoneExchange").attr("value",$.trim($("#phoneExchange").attr("value")));
		$("#phoneStation").attr("value",$.trim($("#phoneStation").attr("value")));
		$("#phoneExtension").attr("value",$.trim($("#phoneExtension").attr("value")));
		$("#phoneCountryCode").attr("value",$.trim($("#phoneCountryCode").attr("value")));
		$("#altNotifyParty").attr("value",$.trim($("#altNotifyParty").attr("value")));

		if (!$("#unitMaintenanceForm").validationEngine('validate')) {
			return;
		}
		var isValid = true;
		if(prevTCN!=$('#tcn').val())
		{
		console.log("tcn Change");
		var localPrevTCN = prevTCN;
		blockUI();
		$.ajax({
			type : "POST",
			async: false,
			url : _context +"/unit_variance_and_vvd/unit_maintenance/validateTcn",
			data : $('#unitMaintenanceForm').formSerialize()+"&bookingBilling="+$('#bookingBilling').html().split(" ")[0],
			success : function(responseText) {
				$.unblockUI();
				if(!responseText.success) {
					console.log(responseText);

					if(responseText.data == "TCN not unique for the booking") {
						window.alert(responseText.data);
						$('#tcn').val(localPrevTCN);
						isValid = false;
						return false;
					} else if(responseText.data == "TCN is not unique, override?"){
						var result = window.confirm(responseText.data);
						if (result == false) {
						   $('#tcn').val(localPrevTCN);
						   isValid = false;
						   return false;
						}
					} else {
						window.alert("Unexpected error validating TCN, contact support");
						$('#tcn').val(localPrevTCN);
						isValid = false;
						return false;
					}


					prevTCN = $('#tcn').val();

				}
			}
		});
		}

		/* D026477
		if( ($("#phoneCountryCode").attr("value") == '') || ($("#phoneCountryCode").attr("value") == '1') || ($("#phoneCountryCode").attr("value") == '01') ){

			if($("#phoneAreaCode").attr("value") == '') {
				$("#phoneAreaCode").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneAreaCode").attr("value").length != 3) {
				$("#phoneAreaCode").validationEngine('showPrompt','Area Code is always a 3 digit number.','error','topRight',true);
				isValid = false;
			}

			if($("#phoneExchange").attr("value") == '') {
				$("#phoneExchange").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneExchange").attr("value").length != 3) {
				$("#phoneExchange").validationEngine('showPrompt','Exchange Code is always a 3 digit number.','error','topRight',true);
				isValid = false;
			}

			if($("#phoneStation").attr("value") == '') {
				$("#phoneStation").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneStation").attr("value").length != 4) {
				$("#phoneStation").validationEngine('showPrompt','Station Code is always a 4 digit number.','error','topRight',true);
				isValid = false;
			}

			if(isValid == false){
				return;
			}

		}
		else {

			if($("#phoneAreaCode").attr("value") == '') {
				$("#phoneAreaCode").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneAreaCode").attr("value").length != 3) {
				$("#phoneAreaCode").validationEngine('showPrompt','Area Code is always a 3 digit number.','error','topRight',true);
				isValid = false;
			}

			if($("#phoneExchange").attr("value") == '') {
				$("#phoneExchange").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneExchange").attr("value").length != 3) {
				$("#phoneExchange").validationEngine('showPrompt','Exchange Code is always a 3 digit number.','error','topRight',true);
				isValid = false;
			}

			if($("#phoneStation").attr("value") == '') {
				$("#phoneStation").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			else if($("#phoneStation").attr("value").length != 4) {
				$("#phoneStation").validationEngine('showPrompt','Station Code is always a 4 digit number.','error','topRight',true);
				isValid = false;
			}*/

			if(($("#phoneAreaCode").attr("value") !='') ||( $("#phoneAreaCode").attr("value") !='' )|| ($("#phoneExchange").attr("value") !='' )){
			if($("#phoneAreaCode").attr("value") == '') {
				$("#phoneAreaCode").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			if($("#phoneExchange").attr("value") == '') {
				$("#phoneExchange").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
			if($("#phoneStation").attr("value") == '') {
				$("#phoneStation").validationEngine('showPrompt','*This field is required.','error','topRight',true);
				isValid = false;
			}
		}
		if($("#phoneAreaCode").attr("value") !='' && $("#phoneAreaCode").attr("value").length != 3) {
			$("#phoneAreaCode").validationEngine('showPrompt','Area Code is always a 3 digit number.','error','topRight',true);
			isValid = false;
		}

		if($("#phoneExchange").attr("value") !='' && $("#phoneExchange").attr("value").length != 3) {
			$("#phoneExchange").validationEngine('showPrompt','Exchange Code is always a 3 digit number.','error','topRight',true);
			isValid = false;
		}
		if($("#phoneStation").attr("value") !='' && $("#phoneStation").attr("value").length != 4) {
			$("#phoneStation").validationEngine('showPrompt','Station Code is always a 4 digit number.','error','topRight',true);
			isValid = false;
		}


			if(isValid == false){
				return;
			}

		//}

		//	D028820: 	PROD / Diversion to the origin port , re,ove check
		/*
		if($.trim($("#unitPortOfDischarge").attr("value")) == $.trim($("#unitPortOfLoading").html())) {
			$("#unitPortOfDischarge").validationEngine('showPrompt','Port of Discharge cannot be same as Port of Loading.','error','topRight',true);
			return ;
		} */

		if($("#vinSightHidden").attr("value") != $("#receivedUnitId").val())
		{
			showErrorMessage('msgDiv','VINSight# must not be changed.');
			return;
		}
		else
		{
			clearResponseMessages('msgDiv');
		}



		$.ajax({
			type : "POST",
			url : _context +"/unit_variance_and_vvd/unit_maintenance/validatePOD",
			data : { portOfDischarge : $.trim($("#unitPortOfDischarge").attr("value")) },
			success : function(responseText) {

				if (responseText.messages.error.length > 0){
					showResponseMessages("msgDiv", responseText);
				}
				else{
					showInfoMessage('msgDiv', 'Saving Received Unit Details ...');
					$("#tcn").removeAttr("disabled");
					$.ajax({
						type : "POST",
						url : _context +"/unit_variance_and_vvd/unit_maintenance/save",
						data : $('#unitMaintenanceForm').formSerialize()+"&bookingBilling="+$('#bookingBilling').html().split(" ")[0],
						success : function(responseText) {
							$("#lastChangedByGates").html(responseText.data);
							prevTCN = $('#tcn').val();
							showResponseMessages("msgDiv", responseText);
						}
					});
					tcnEnable();
				}
			}
		});
	});

	$('#unitPortOfDischarge').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompCityWithParameter?param=withPort',
				name: "Destination Port City Code",
				autoSelectWhenSingle:true,
				  autoSelectFirst:true,
					autoSelectCriteria:function(item) {
					   if(item != null){
					     return 'true';
					  }
					  else {
					     return 'false';
					  }
					},

				formatItem : function(item) {
					return item.cityCode;
				},
				formatResult : function(item) {
					return item.cityCode;
				},
				select : function(item) {
					$('#unitPortOfDischarge').attr("value", item.cityCode);
				}
			});

	$('#unitPortOfDischarge').gatesPopUpSearch({
		func : function() {
			portPopupSearch($.trim($('#unitPortOfDischarge').attr("value")));
		}
	});

	$('#unitConsignee').gatesAutocomplete({
				source : _context + '/cas/autocomplete.do?method=searchOrg&searchType=229&parentSearch=BK',
				name: "Organization Name",
				autoSelectWhenSingle:true,
				  autoSelectFirst:true,
					autoSelectCriteria:function(item) {
					   if(item != null){
					     return 'true';
					  }
					  else {
					     return 'false';
					  }
					},
				formatItem : function(data) {
					return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
				},
				formatResult : function(data) {
					return data.name + "-" + data.abbr;//data.abbr + "-" + data.name;
				},
				select : function(data) {

					$('#unitConsignee').attr("value", data.name + "-" + data.abbr);

					$('#organizationNamHidden').attr("value",$('#unitConsignee').attr("value"));

					$('#consigneeOrganizationId').attr("value", data.id);
					$('#trade').attr("value",data.trade);

					$('#unitConsigneeAddress').attr("value", "");
					$("#unitContact").attr("value","");
					$("#phoneAreaCode").attr("value","");
					$("#phoneExchange").attr("value","");
					$("#phoneStation").attr("value","");
					$("#phoneExtension").attr("value","");
					$("#phoneCountryCode").attr("value","");

					singleAddressPartiesCall();
					//consigneeAddressPopupSearch();

					$('#unitConsigneeAddress').gatesAutocomplete({
								source : _context + '/cas/autocomplete.do?method=searchAddRoleBK&searchType=234&parentSearch='+ $('#consigneeOrganizationId').attr("value")+ '|03'+$('#trade').attr("value"),
								name: "Organization Address",
								autoSelectWhenSingle:true,
								autoSelectFirst:true,
									autoSelectCriteria:function(item) {
									   if(item != null){
									     return 'true';
									  }
									  else {
									     return 'false';
									  }
									},
								formatItem : function(data) {
									return getOrganizationAddress(data);
								},
								formatResult : function(data) {
									return getOrganizationAddress(data);
								},
								select : function(data) {
									$('#unitConsigneeAddress').attr("value",getOrganizationAddress(data));
									$('#unitConsigneeAddressRoleId').attr("value",data.addRole);
									$('#organizationAddressHidden').attr("value",$('#unitConsigneeAddress').attr("value"));
								}
							});
				}
			});



	$('#tcn').focus(function() {
		prevTCN = $('#tcn').val();
	});
	/*
	$('#tcn').change(function() {
		console.log("tcn Change");
		var localPrevTCN = prevTCN;
		blockUI();
		$.ajax({
			type : "POST",
			async: false,
			url : _context +"/unit_variance_and_vvd/unit_maintenance/validateTcn",
			data : $('#unitMaintenanceForm').formSerialize()+"&bookingBilling="+$('#bookingBilling').html().split(" ")[0],
			success : function(responseText) {
				$.unblockUI();
				if(!responseText.success) {
					console.log(responseText);

					if(responseText.data == "TCN not unique for the booking") {
						window.alert(responseText.data);
						$('#tcn').val(localPrevTCN);
						return false;
					} else if(responseText.data == "TCN is not unique, override?"){
						var result = window.confirm(responseText.data);
						if (result == false) {
						   $('#tcn').val(localPrevTCN);
						   return false;
						}
					} else {
						window.alert("Unexpected error validating TCN, contact support");
						$('#tcn').val(localPrevTCN);
						return false;
					}


					prevTCN = $('#tcn').val();

				}
			}
		});




	});
	*/

	$('#unitConsignee').change(function() {
		if($("#organizationNamHidden").attr("value") != $("#unitConsignee").attr("value")){
			$("#organizationNamHidden").attr("value","");
			$("#unitConsignee").attr("value","");
			$('#unitConsigneeAddress').attr("value", "");
			$("#unitContact").attr("value","");
			$("#phoneAreaCode").attr("value","");
			$("#phoneExchange").attr("value","");
			$("#phoneStation").attr("value","");
			$("#phoneExtension").attr("value","");
			$("#phoneCountryCode").attr("value","");
		}

	});

	$('#unitConsigneeAddress').change(function() {
		if($("#organizationAddressHidden").attr("value") != $("#unitConsigneeAddress").attr("value")){
			$("#organizationAddressHidden").attr("value","");
			$("#unitConsigneeAddress").attr("value","");
			$("#unitContact").attr("value","");
			$("#phoneAreaCode").attr("value","");
			$("#phoneExchange").attr("value","");
			$("#phoneStation").attr("value","");
			$("#phoneExtension").attr("value","");
			$("#phoneCountryCode").attr("value","");
		}

	});

	$('#unitConsignee').gatesPopUpSearch({
		func : function() {
			consigneePopupSearch($('#unitConsignee').attr("value"));
		}
	});

	$('#unitConsigneeAddress').gatesPopUpSearch({
		func : function() {
			consigneeAddressPopupSearch();
		}
	});


	$("#recordCount").attr("value",0);
	$("#currentRecordNo").attr("value",0);


    $('#uMaintenancePrevious').click(function() {
    	$("#uMaintenancePrevious").attr("disabled", "disabled");
		$("#uMaintenanceNext").attr("disabled", "disabled");
    	$("#currentRecordNo").attr("value",parseInt($("#currentRecordNo").attr("value"))-1);
    	var records = $("#receivedUnitQuery").val().split("|");
    	$("#receivedUnitId").attr("value",records[parseInt($("#currentRecordNo").attr("value"))-1]);
    	$("#isNext").attr("value","false");
    	fetchUnitMaintenanceDetails();
	});

    $('#uMaintenanceNext').click(function() {
    	$("#uMaintenancePrevious").attr("disabled", "disabled");
		$("#uMaintenanceNext").attr("disabled", "disabled");
    	$("#currentRecordNo").attr("value",parseInt($("#currentRecordNo").attr("value"))+1);
    	var records = $("#receivedUnitQuery").val().split("|");
    	$("#receivedUnitId").attr("value",records[parseInt($("#currentRecordNo").attr("value"))-1]);
    	$("#isNext").attr("value","true");
    	fetchUnitMaintenanceDetails();
	});


	if($("#receivedUnitId").val() != '') {
		var records = $("#receivedUnitQuery").val().split("|");
		$("#recordCount").attr("value",records.length);
		$("#currentRecordNo").attr("value",1);
		$("#isScreenLinkedToSearchReceivedUnit").attr("value","true");
		fetchUnitMaintenanceDetails();
	}


	//Display Unreleased Holds Grid on initial display
	openUnreleasedHoldGridOnIntialDisplay("unitMaintenance");

	/*var args = {
			entityType: 'RCUT',
			entityId: $('#receivedUnitId').val(),
			commentId: 'commentId',
			displayCommentTypes: ''
		   };
	getCommentTypes(args);*/

	enforceUserSecurityRolesAndPermissions();


	$('#uMaintenanceBill').click(function(){
		rateBill();
	});


	$( "#re_choice_dialog" ).dialog({
		autoOpen: false,
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {


		},
	});



 $( "#re_error_dialog" ).dialog({
		autoOpen: false,
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {


		},
	});

 $('#reErrCloseBtn').click(function(){
		$("#re_error_dialog").dialog('close');
	});

	$('#reErrContinueBtn').click(function(){
		$("#re_error_dialog").dialog('close');
	});

	$('#reChoiceCloseBtn').click(function(){
		$("#re_choice_dialog").dialog('close');
	});

	$('#reChoiceContinueBtn').click(function() {
		//TODO: Handle this scenario here. Call to RE should pursue from here.

		var length = jQuery("#reChoiceGrid").jqGrid('getGridParam','selarrrow').length;
		if( length > 1){
			alert(" Please Select only one Rating Choice");
			return false;
		}else{
			$('#re_choice_dialog').dialog( "close" );
			var containerArr = jQuery("#reChoiceGrid").jqGrid('getGridParam','selarrrow');
			var idArray = "";
			 for(var i=0; i<length;i++){
					concludeRating(containerArr[i]);
			 }

		}

	});

	var choiceGridColNames= ['Choice Id', 'Choice Seq No', 'Selectable', 'Choices Text'];
	var choiceGridColModel= [
	                        {name:'reRatingChoiceId',index:'reRatingChoiceId', hidden:true, formatter:'number'},
	          				{name:'choiceSeqNum',index:'choiceSeqNum', width:100, editable:false, formatter:'choiceFormatter'},
	                        {name:'selectable',index:'selectable', width:50, editable:false},
	        				{name:'messageTextValue',index:'messageTextValue', width:700, editable:false}
	                       ];
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
			'/gates//unit_variance_and_vvd/unit_maintenance/loadReChoiceGrid',
			'', '', '', '',
			choiceGridColNames, choiceGridColModel,
			"List Of Choice Messages", 70, 5, [ 5, 10, 15 ], true, false, false, true,
			jsonReaderChoice,true,true,true,false,false,false,false,false,false,false,true);


	var errorGridColNames= ['Error Id', 'Cmdy Line', 'Sev', 'Error Text','YP','Source Tariff','Group Name','Item','Rate'];
	var errorGridColModel= [
	                        {name:'reErrorMessageId',index:'reErrorMessageId', hidden:true, formatter:'number'},
	          				{name:'commoditySeqNbr',index:'commoditySeqNbr', width:100, editable:false },
	        				{name:'messageSeverity',index:'messageSeverity', width:50, sorttype:'date', editable:false },
	        				{name:'messageTextValue',index:'messageTextValue', width:260, editable:false },
	        				{name:'typeValue',index:'typeValue', width:50, editable:false },
	        				{name:'courceTariffId',index:'sourceTariffId', width:127, editable:false },
	        				{name:'groupName',index:'groupName', width:127, editable:false },
	        				{name:'item',index:'item', width:80, editable:false },
	        				{name:'rate',index:'rate', width:80, editable:false },
	                         ];

	var jsonReaderError = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "reErrorMessageId"
	};

	createGrid("reErrorGrid", "pagerReErrorGrid",
			'/gates//unit_variance_and_vvd/unit_maintenance/loadReErrorGrid',
			'', '', '', '',
			errorGridColNames, errorGridColModel,
			"List Of Error/Warning Messages", 70, 5, [ 5, 10, 15 ], false, false, false, true,
			jsonReaderError,true,true,true,false,false,false,false,false,false,false,true);



	$('#receivedUnitId').focus();

	if($('#receivedUnitId').val() != ''){
		fetchUnitMaintenanceDetails();
	}
	tabSequence('#unitMaintenanceForm',false,false);

});


function singleAddressPartiesCall(){
	$.ajax({
		type : "POST",
		url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=234&parentSearch="+encodeURIComponent($('#consigneeOrganizationId').val() + '|03|'+$('#trade').val()),
		success : function(responseText) {
			if(responseText.length == 1){
				$('#unitConsigneeAddress').attr("value",getOrganizationAddress(responseText[0]));
				$('#unitConsigneeAddressRoleId').attr("value",responseText[0].addRole);
				$('#organizationAddressHidden').attr("value",$('#unitConsigneeAddress').attr("value"));
			} else {
				consigneeAddressPopupSearch();
			}
			
		}
	});
}


function enforceUserSecurityRolesAndPermissions(){
	/* Hold Release */
	if(holdReleaseEnabled) {
		$('#holdRelease').css('visibility','visible');
	}
	else{
		$('#holdRelease').css('visibility','hidden');
		$('#holdRelease').addClass('noTab');
	}
	
	/* Hold Overlay Bottom*/
	if(isHoldOverlayBottomEnabled) {
		$('#holdsDiv').hide();
	}
	else{
		$('#holdsDiv').show();
	}
	/*Bill Button */
	if(isBillDisplay)
		{
		 $('#uMaintenanceBill').css('visibility','visible');
		}
	else
		{
		 $('#uMaintenanceBill').css('visibility','hidden');
		}
}


function getOrganizationAddress(data) {
	if((data.nameQual == '') && (data.stAdd == '') && (data.city == '') && (data.state == ''))
		return "";
	else if((data.nameQual == '') && (data.stAdd == '') && (data.city == '') && (data.state != ''))
		return data.state;
	else if((data.nameQual == '') && (data.stAdd == '') && (data.city != '') && (data.state == ''))
		return data.city;
	else if((data.nameQual == '') && (data.stAdd == '') && (data.city != '') && (data.state != ''))
		return data.city+","+data.state;
	else if((data.nameQual == '') && (data.stAdd != '') && (data.city == '') && (data.state == ''))
		return data.stAdd;
	else if((data.nameQual == '') && (data.stAdd != '') && (data.city == '') && (data.state != ''))
		return data.stAdd+ "-"+data.state;
	else if((data.nameQual == '') && (data.stAdd != '') && (data.city != '') && (data.state == ''))
		return data.stAdd+ "-"+data.city;
	else if((data.nameQual == '') && (data.stAdd != '') && (data.city != '') && (data.state != ''))
		return data.stAdd+ "-"+data.city+","+ data.state;
	else if((data.nameQual != '') && (data.stAdd == '') && (data.city == '') && (data.state == ''))
		return data.nameQual;
	else if((data.nameQual != '') && (data.stAdd == '') && (data.city == '') && (data.state != ''))
		return data.nameQual+"-"+data.state;
	else if((data.nameQual != '') && (data.stAdd == '') && (data.city != '') && (data.state == ''))
		return data.nameQual+"-"+data.city;
	else if((data.nameQual != '') && (data.stAdd == '') && (data.city != '') && (data.state != ''))
		return data.nameQual+"-"+data.city+ ","+ data.state;
	else if((data.nameQual != '') && (data.stAdd != '') && (data.city == '') && (data.state == ''))
		return data.nameQual+"-"+data.stAdd;
	else if((data.nameQual != '') && (data.stAdd != '') && (data.city == '') && (data.state != ''))
		return data.nameQual+"-"+data.stAdd+"-"+data.state;
	else if((data.nameQual != '') && (data.stAdd != '') && (data.city != '') && (data.state == ''))
		return data.nameQual+"-"+data.stAdd+"-"+data.city;
	else if((data.nameQual != '') && (data.stAdd != '') && (data.city != '') && (data.state != ''))
		return data.nameQual+"-"+data.stAdd+"-"+data.city+","+ data.state;
}


function getAddress(values) {
	if((values[4] == '') && (values[7] == '') && (values[2] == '') && (values[6] == ''))
		return "";
	else if((values[4] == '') && (values[7] == '') && (values[2] == '') && (values[6] != ''))
		return values[6];
	else if((values[4] == '') && (values[7] == '') && (values[2] != '') && (values[6] == ''))
		return values[2];
	else if((values[4] == '') && (values[7] == '') && (values[2] != '') && (values[6] != ''))
		return values[2]+","+values[6];
	else if((values[4] == '') && (values[7] != '') && (values[2] == '') && (values[6] == ''))
		return values[7];
	else if((values[4] == '') && (values[7] != '') && (values[2] == '') && (values[6] != ''))
		return values[7]+ "-"+values[6];
	else if((values[4] == '') && (values[7] != '') && (values[2] != '') && (values[6] == ''))
		return values[7]+ "-"+values[2];
	else if((values[4] == '') && (values[7] != '') && (values[2] != '') && (values[6] != ''))
		return values[7]+ "-"+values[2]+","+ values[6];
	else if((values[4] != '') && (values[7] == '') && (values[2] == '') && (values[6] == ''))
		return values[4];
	else if((values[4] != '') && (values[7] == '') && (values[2] == '') && (values[6] != ''))
		return values[4]+"-"+values[6];
	else if((values[4] != '') && (values[7] == '') && (values[2] != '') && (values[6] == ''))
		return values[4]+"-"+values[2];
	else if((values[4] != '') && (values[7] == '') && (values[2] != '') && (values[6] != ''))
		return values[4]+"-"+values[2]+ ","+ values[6];
	else if((values[4] != '') && (values[7] != '') && (values[2] == '') && (values[6] == ''))
		return values[4]+"-"+values[7];
	else if((values[4] != '') && (values[7] != '') && (values[2] == '') && (values[6] != ''))
		return values[4]+"-"+values[7]+"-"+values[6];
	else if((values[4] != '') && (values[7] != '') && (values[2] != '') && (values[6] == ''))
		return values[4]+"-"+values[7]+"-"+values[2];
	else if((values[4] != '') && (values[7] != '') && (values[2] != '') && (values[6] != ''))
		return values[4]+"-"+values[7]+"-"+values[2]+","+ values[6];
}

function fetchUnitMaintenanceDetails() {
	clearAllUnitMaintenanceFields();
	disableTextualFields();
	disableSaveNextPrevious();
	disableBill();

	if (!$("#unitMaintenanceForm").validationEngine('validate')) {
		return;
	}

	$("#unitMaintenanceForm").validationEngine('hide');
	showInfoMessage('msgDiv', 'Loading VINSight# ' + $("#receivedUnitId").val() + ' ...');
	$("#receivedUnitId").attr("disabled", "true");

	$.ajax({
		type : "POST",
		url : _context +"/unit_variance_and_vvd/unit_maintenance/displayUnit",
		data : {
			vinSightNumber : $("#receivedUnitId").val()
		},
		success : function(responseText) {
			if (responseText.messages.error.length == 0) {
				//getReceivedUnit1Details(responseText);
				//getReceivedUnit2Details(responseText);
				$('#unitMaintenanceForm').loadJSON(responseText.data);
				prevTCN = $('#tcn').val();
				if (((responseText.data.bookingId == undefined) || (responseText.data.bookingId == null) || (responseText.data.bookingId == ''))) {
					clearBookingFields();
					disableTextualFields();
					disableSaveNextPrevious();
					disableBill();
				} else {
					$('#bookingId').val(responseText.data.bookingId);
					if ((responseText.data.shipmentId == undefined) || (responseText.data.shipmentId == null) || (responseText.data.shipmentId == '')) {
						//getBookingDetails(responseText);
						var bookingNo = responseText.data.bookingBilling;
						if(bookingNo.charAt(0) == 'T'){
							disableBill();
						}
						else{
							if(responseText.data.status == 'APPR'){
								enableBill();
							}
							else {
								disableBill();
							}
						}
					}
					else
					{
						//getShipmentDetails(responseText);
						disableBill();
					}
					
					if(isUnitMaintenanceModifiable == true) {
						enableTextualFields();
						enableSave();
					}
					else {
						disableTextualFields();
						disableSave();
					}
				}
				
				//if(responseText.data.receivedUnitLog.eventCode == 'OUT GATE')
					//$("#unitPortOfDischarge").attr("disabled", "true");

				if (responseText.data.isCancelInVinsight == 'Y') {
					disableTextualFields();
					disableSaveNextPrevious();
					disableBill();
					showWarningMessage('msgDiv', 'Unit has been Cancelled.');
				} else {
					if (((responseText.data.bookingId == undefined) || (responseText.data.bookingId == null) || (responseText.data.bookingId == ''))) {
						showInfoMessage('msgDiv', 'Unit Displayed. No Booking found.');
					} else {
						$("#vinSightHidden").attr("value",$("#receivedUnitId").val());
						$("#vinSightHidden").attr("value",$("#receivedUnitId").val());
						$("#tcnHidden").attr("value",$("#tcn").val());
						tcnEnable();
						
						
						showInfoMessage('msgDiv', 'Unit Displayed.');
					}
				}
				
				//Comment Id
				//$('#receivedUnit\\.commentId').val(responseText.data.receivedUnit.commentId);
				createCommentFunc();
				$('#commentsDiv').show();
			} else {
				clearAllUnitMaintenanceFields();
				disableTextualFields();
				disableSaveNextPrevious();
				disableBill();
				showResponseMessages("msgDiv", responseText);
				$('#commentsDiv').hide();
			}
			
			$("#receivedUnitId").removeAttr("disabled");
			
			if( $("#isScreenLinkedToSearchReceivedUnit").attr("value") == "true" ){
				if(parseInt($("#recordCount").attr("value")) > 1){
					$("#uMaintenancePrevious").attr("disabled", "disabled");
					$("#uMaintenanceNext").removeAttr("disabled");
				}
				else{
					$("#uMaintenancePrevious").attr("disabled", "disabled");
					$("#uMaintenanceNext").attr("disabled", "disabled");
				}
				
				if( $("#isNext").attr("value") == "true" ){
					if(parseInt($("#currentRecordNo").attr("value")) == parseInt($("#recordCount").attr("value"))){
			    		$("#uMaintenancePrevious").removeAttr("disabled");
			    		$("#uMaintenanceNext").attr("disabled", "disabled");
			    	}
			    	else{
			    		$("#uMaintenancePrevious").removeAttr("disabled");
			    		$("#uMaintenanceNext").removeAttr("disabled");
			    	}
				}
				else if( $("#isNext").attr("value") == "false" ){
					if(parseInt($("#currentRecordNo").attr("value")) == 1){
			    		$("#uMaintenancePrevious").attr("disabled", "disabled");
			    		$("#uMaintenanceNext").removeAttr("disabled");
			    	}
			    	else{
			    		$("#uMaintenancePrevious").removeAttr("disabled");
			    		if(parseInt($("#currentRecordNo").attr("value")) == parseInt($("#recordCount").attr("value"))){
			        		$("#uMaintenanceNext").attr("disabled", "disabled");
			        	}
			        	else{
			        		$("#uMaintenanceNext").removeAttr("disabled");
			        	}
			    	}
					
				}
			}
			//Display Unreleased Holds Grid on initial display
			openUnreleasedHoldGridOnIntialDisplay("unitMaintenance");
			enforceUserSecurityRolesAndPermissions();
		}
	});

}

function removePopUps() {
	$("#unitMaintenanceForm").validationEngine('hide');
}

function addroleUpdate(id) {
	var values = id.split("|");
	$('#unitConsigneeAddress').attr("value",getAddress(values));
	$('#unitConsigneeAddressRoleId').attr("value", values[9]);
}

function orgSearchUpdate(id) {
	var values = id.split("|");
	$('#unitConsignee').attr("value", values[1] + "-" + values[0]);
	$('#consigneeOrganizationId').attr("value", values[2]);
	
	if( $.trim(values[3]) == 'null' )
		$('#trade').attr("value","");
	else
	{
		var tradeV = $.trim(values[3]).split(",");
	    $('#trade').attr("value",tradeV[0]);
	}
	
	$('#unitConsigneeAddress').attr("value", "");
	$("#unitContact").attr("value","");
	$("#phoneAreaCode").attr("value","");
	$("#phoneExchange").attr("value","");
	$("#phoneStation").attr("value","");
	$("#phoneExtension").attr("value","");
	$("#phoneCountryCode").attr("value","");
	
	singleAddressPartiesCall();
	//consigneeAddressPopupSearch();
}

function consigneeAddressPopupSearch() {
	var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1=' + $('#consigneeOrganizationId').attr("value") + '&filterValue2=03' + '&filterValue3='+ $('#trade').attr("value");
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'AddressSearch', windowStyle);
}

function consigneePopupSearch(consignee) {
	var splitconsigneeName = "";
	var actionUrl = "";
	if (consignee.indexOf("-") > 0) {
		splitconsigneeName = consignee.split("-");
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=|' + '|BK|||'+ splitconsigneeName[0];
	} else {
		actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + consignee + '|' + '|BK';
	}
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);
}

function portPopupSearch(param) {
	var actionUrl = _context + "/city/manualLookup/showForm?term=" + param	+ "|" + "Y";
	var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CitySearch', windowStyle);
}

function cityUpdate(id) {
	var end= id.indexOf(",");
	var values=id.substr(0,end);
	end = values.indexOf(" ");
	var cityCode=values.substr(0,end);

	/*if($.trim(value[2]) == 'true'){
		clearResponseMessages('msgDiv');
		$('#unitPortOfDischarge').attr("value", cityCode);
	}
	else{
		showErrorMessage('msgDiv','Port of Discharge is not a valid port city.');
		$('#unitPortOfDischarge').attr("value", cityCode);
	}*/
	$('#unitPortOfDischarge').attr("value", cityCode);
}

function clearResponseMessages(msgDivId) {
	$('#' + msgDivId).html("");
}

function showInfoMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_info">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showWarningMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_warning">' + text + '</div>');
	window.scrollTo(0, 0);
}

function showErrorMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_error">' + text + '</div>');
	window.scrollTo(0, 0);
}

/*function getReceivedUnit1Details(responseText) {
	$("#received").html(responseText.data.receivedUnitLog.eventDate);
	$("#currentEvent").html(responseText.data.receivedUnitLog.eventCode);
	$("#estAvailableDate").html(responseText.data.receivedUnit.estimateAvailablePickupDate);
	$("#vin").html(responseText.data.receivedUnit.vinNumber);
	$("#year").html(responseText.data.receivedUnit.vehicleYear);
	$("#make").html(responseText.data.receivedUnit.vehicleMake);
	$("#model").html(responseText.data.receivedUnit.vehicleModel);
	$("#weight").html(responseText.data.receivedUnit.weight);
	$("#description").html(responseText.data.receivedUnit.description);
	var l,w,h;
	
	if(responseText.data.receivedUnit.length == null)
		l="";
	else
		l=responseText.data.receivedUnit.length + "'";
	
	if(responseText.data.receivedUnit.width == null)
		w="";
	else
		w=responseText.data.receivedUnit.width + "'";
	
	if(responseText.data.receivedUnit.height == null)
		h="";
	else
		h=responseText.data.receivedUnit.height + "'";
	
	$("#lwh").html(l+" "+w+" "+h);
	$("#inland").html(responseText.data.receivedUnit.isAutoInlandMove);
	$("#dealerAuctionLocation").html(responseText.data.receivedUnit.dealerAuctionLocationCode);
}

function getReceivedUnit2Details(responseText) {
	
	var rVesselCode,rVoyage,rDirection,tVesselCode,tVoyage,tDirection;
	
	if(responseText.data.receivedUnit.receivedForVesselCode == null)
		rVesselCode = "";
	else
		rVesselCode = responseText.data.receivedUnit.receivedForVesselCode;
	
	if(responseText.data.receivedUnit.receivedForVoyage == null)
		rVoyage = "";
	else
		rVoyage = responseText.data.receivedUnit.receivedForVoyage;
	
	if(responseText.data.receivedUnit.receivedForDirectionSeq == null)
		rDirection = "";
	else
		rDirection = responseText.data.receivedUnit.receivedForDirectionSeq;
	
	if(responseText.data.receivedUnit.triggerVesselCode == null)
		tVesselCode = "";
	else
		tVesselCode = responseText.data.receivedUnit.triggerVesselCode;
	
	if(responseText.data.receivedUnit.triggerVoyage == null)
		tVoyage = "";
	else
		tVoyage = responseText.data.receivedUnit.triggerVoyage;
	
	if(responseText.data.receivedUnit.triggerDirectionSeq == null)
		tDirection = "";
	else
		tDirection = responseText.data.receivedUnit.triggerDirectionSeq;
	
	$("#receivedForVVD").html(rVesselCode + " "+ rVoyage + " "+ rDirection);

	$("#loadedForVVD").html(tVesselCode + " "+ tVoyage + " "+ tDirection);

	$("#unitPortOfLoading").html(responseText.data.receivedUnit.originPortCityCode);
	$("#unitPortOfDischarge").attr("value",$.trim(responseText.data.receivedUnit.destinationPortCityCode));
	$("#unitConsignee").attr("value", responseText.data.organizationNam);
	$("#unitConsigneeAddress").attr("value", responseText.data.organizationAddress);
	$("#unitConsigneeAddressRoleId").attr("value", responseText.data.receivedUnit.consigneeAddressRoleId);
	$("#unitContact").attr("value", responseText.data.receivedUnit.consigneeContactName);
	
	$("#phoneAreaCode").attr("value",$.trim(responseText.data.receivedUnit.consigneeAreaCode));
	$("#phoneExchange").attr("value",$.trim(responseText.data.receivedUnit.consigneePhoneExchange));
	$("#phoneStation").attr("value",$.trim(responseText.data.receivedUnit.consigneePhoneStation));
	$("#phoneExtension").attr("value",$.trim(responseText.data.receivedUnit.consigneePhoneExtension));
	$("#phoneCountryCode").attr("value",$.trim(responseText.data.receivedUnit.consigneeCountryCode));
	
	$("#alternatePickupPartyName").attr("value",$.trim(responseText.data.receivedUnit.alternatePickupPartyName));
	$("#lastChangedByVINSight").html(responseText.data.receivedUnit.vinsightLastUpdateDate + " " + responseText.data.receivedUnit.vinsightLastUpdateUser);
}

function getBookingDetails(responseText) {
	var oVesselCode,oVoyage,oDirection;
	$("#bNumber").html(responseText.data.booking.header.shipmentNumber);
	$("#bStatus").html(responseText.data.booking.header.bookingStatusCode);
	$("#bShipper").html(responseText.data.booking.shipper.organizationName);
	$("#bLoadService").html(responseText.data.booking.routing.loadServiceCode);
	$("#bDischargeService").html(
			responseText.data.booking.routing.dischargeServiceCode);
	
	if(responseText.data.booking.routing.originalVesselCode == null)
		oVesselCode = "";
	else
		oVesselCode = responseText.data.booking.routing.originalVesselCode;
	
	if(responseText.data.booking.routing.originalVoyage == null)
		oVoyage = "";
	else
		oVoyage = responseText.data.booking.routing.originalVoyage;
	
	if(responseText.data.booking.routing.originalDirectionSeq == null)
		oDirection = "";
	else
		oDirection = responseText.data.booking.routing.originalDirectionSeq;
	
	
	$("#bVVD").html(oVesselCode + " "+ oVoyage + " "+ oDirection);
	$("#bPortOfLoading").html(
			responseText.data.booking.routing.originPortCityCode);
	$("#bPortOfDischarge").html(
			responseText.data.booking.routing.destinationPortCityCode);
	$("#bConsignee").html(responseText.data.booking.consignee.organizationName);
	$("#bConsigneeAddress").html(responseText.data.booking.consignee.address);
	$("#bContact").html(responseText.data.receivedUnit.consigneeContactName);
	$("#bLastChangedByGates").html(
			responseText.data.receivedUnit.lastUpdateDate + " "
			+ responseText.data.receivedUnit.lastUpdateUser);
}


function getShipmentDetails(responseText) {
	var oVesselCode,oVoyage,oDirection;
	$("#bNumber").html(responseText.data.shipment.shipmentNumber+" "+responseText.data.shipment.shipmentSequenceNumber);
	$("#bStatus").html(responseText.data.shipment.statusCode);
	$("#bShipper").html(responseText.data.booking.shipper.organizationName);
	$("#bLoadService").html(responseText.data.shipment.loadServiceCode);
	$("#bDischargeService").html(responseText.data.shipment.dischargeServiceCode);
	
	if(responseText.data.shipment.vesselCodeInitialTrigger == null)
		oVesselCode = "";
	else
		oVesselCode = responseText.data.shipment.vesselCodeInitialTrigger;
	
	if(responseText.data.shipment.voyageInitialTrigger == null)
		oVoyage = "";
	else
		oVoyage = responseText.data.shipment.voyageInitialTrigger;
	
	if(responseText.data.shipment.directionSeqInitialTrigger == null)
		oDirection = "";
	else
		oDirection = responseText.data.shipment.directionSeqInitialTrigger;
	
	
	$("#bVVD").html(oVesselCode + " "+ oVoyage + " "+ oDirection);
	$("#bPortOfLoading").html(responseText.data.shipment.originPortCityCode);
	$("#bPortOfDischarge").html(responseText.data.shipment.destinationPortCityCode);
	$("#bConsignee").html(responseText.data.booking.consignee.organizationName);
	$("#bConsigneeAddress").html(responseText.data.booking.consignee.address);
	$("#bContact").html(responseText.data.receivedUnit.consigneeContactName);
	$("#bLastChangedByGates").html(responseText.data.receivedUnit.lastUpdateDate + " "+ responseText.data.receivedUnit.lastUpdateUser);
}*/


function clearReceivedUnit1Fields() {
	$("#received").html("");
	$("#currentEvent").html("");
	$("#estAvailableDate").html("");
	$("#vin").html("");
	$("#year").html("");
	$("#make").html("");
	$("#model").html("");
	$("#weight").html("");
	$("#description").html("");
	$("#lwh").html("");
	$("#inland").html("");
	$("#dealerAuctionLocn").html("");
	$("#tcn").attr("value", "");
	$("#tcnHidden").attr("value", "");
	$("#tcn").attr("value", "");
	$("#shipmentId").attr("value", "");
}

function clearReceivedUnit2Fields() {
	$("#receivedForVVD").html("");
	$("#loadedForVVD").html("");
	$("#unitPortOfLoading").html("");
	$("#unitPortOfDischarge").attr("value", "");
	$("#unitConsignee").attr("value", "");
	$("#unitConsigneeAddress").attr("value", "");
	$("#unitConsigneeAddressRoleId").attr("value", "");
	$("#unitContact").attr("value", "");
	$("#phoneAreaCode").attr("value", "");
	$("#phoneExchange").attr("value", "");
	$("#phoneStation").attr("value", "");
	$("#phoneExtension").attr("value", "");
	$("#phoneCountryCode").attr("value", "");
	$("#altNotifyParty").attr("value", "");
	$("#lastChangedByVINSight").html("");

	
}

function clearBookingFields() {
	$("#bookingBilling").html("");
	$("#status").html("");
	$("#shipper").html("");
	$("#loadService").html("");
	$("#dischargeService").html("");
	$("#vvd").html("");
	$("#portOfLoading").html("");
	$("#portOfDischarge").html("");
	$("#consignee").html("");
	$("#consigneeAddress").html("");
	$("#contact").html("");
	$("#lastChangedByGates").html("");
}

function clearAllUnitMaintenanceFields() {
	clearReceivedUnit1Fields();
	clearReceivedUnit2Fields();
	clearBookingFields();
}

function disableTextualFields() {
	$("#unitPortOfDischarge").attr("disabled", "true");
	$("#unitConsignee").attr("disabled", "true");
	$("#unitConsigneeAddress").attr("disabled", "true");
	$("#unitContact").attr("disabled", "true");
	$("#phoneAreaCode").attr("disabled", "true");
	$("#phoneExchange").attr("disabled", "true");
	$("#phoneStation").attr("disabled", "true");
	$("#phoneExtension").attr("disabled", "true");
	$("#phoneCountryCode").attr("disabled", "true");
	$("#altNotifyParty").attr("disabled", "true");
	$("#mandatoryPhone").html("");
}

function enableTextualFields() {
	$("#unitPortOfDischarge").removeAttr("disabled");
	$("#unitConsignee").removeAttr("disabled");
	$("#unitConsigneeAddress").removeAttr("disabled");
	$("#unitContact").removeAttr("disabled");
	$("#phoneAreaCode").removeAttr("disabled");
	$("#phoneExchange").removeAttr("disabled");
	$("#phoneStation").removeAttr("disabled");
	$("#phoneExtension").removeAttr("disabled");
	$("#phoneCountryCode").removeAttr("disabled");
	$("#altNotifyParty").removeAttr("disabled");
	$("#mandatoryPhone").html("*");
}

function disableSaveNextPrevious() {
	$("#uMaintenanceSave").attr("disabled", "disabled");
	$("#uMaintenancePrevious").attr("disabled", "disabled");
	$("#uMaintenanceNext").attr("disabled", "disabled");
}

function disableBill() {
	$("#uMaintenanceBill").attr("disabled", "disabled");
}

function enableBill() {
	$("#uMaintenanceBill").removeAttr("disabled");
}

function enableSave() {
	$("#uMaintenanceSave").removeAttr("disabled");
}

function disableSave() {
	$("#uMaintenanceSave").attr("disabled", "disabled");
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

		if (messages.success.length > 0) {
			var array = messages.success;
			var len = messages.success.length;
			for ( var i = 0; i < len; i++) {
				messageContent += '<div class="message_success">' + array[i]
				+ '</div>';
			}
		}

		$('#' + msgDivId).html(messageContent);
		window.scrollTo(0, 0);
	}
}


function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'RCUT',
			contextScreen: ''
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
				args.displayCommentTypes=string;
				$("#comment_link").comments(args);
				
			}
		}
	});
}

function rateBill(){
	$.ajax({
		type: "GET",
		url: _context +"/booking/batchbill/requestBill",
		data: {
			bookingIds: $("#bookingId").val(),
		},
		success: function(responseText){
			showResponseMessages("msgDiv", responseText);
		}
	});
//	blockUI();
//	$.ajax({
//		type: "GET",
//		url: _context +"/unit_variance_and_vvd/unit_maintenance/checkbill",
//		data : $('#unitMaintenanceForm').formSerialize(),
//		success: function(responseText){
//			$.unblockUI();
//			if (responseText.messages.error.length == 0) {
//				
//				if(responseText.data.rateView == "showError"){
//					$("#bookingForm").loadJSON(responseText.data);
//					$('#shipmentNumOverLay').val(responseText.data.ratingError.shipmentNumber);
//					$('#statusCodeOverlay').val(responseText.data.ratingError.statusCode);
//					
//					$('#unitOfMeasureSourceOverLay').val(responseText.data.ratingError.unitOfMeasureSourceCode);
//					$('#loadServicesOverLay').val(responseText.data.ratingError.loadServiceCodeRE);
//					$('#routingDetOverLay').val(responseText.data.ratingError.routingDetailsRE);
//					$('#dischargeServicesOverlay').val(responseText.data.ratingError.dischargeServiceCodeRE);
//					
//					$('#re_error_dialog').dialog( "open" );
//					$("#reErrorGrid").trigger('reloadGrid');
//				}else if(responseText.data.rateView == "showChoices"){
//					$("#bookingForm").loadJSON(responseText.data);
//					$('#shipmentNumOverLayChoice').val(responseText.data.ratingChoice.shipmentNumber);
//					$('#statusCodeOverlayChoice').val(responseText.data.ratingChoice.statusCode);
//					
//					$('#unitOfMeasureSourceOverLayChoice').val(responseText.data.ratingChoice.unitOfMeasureSourceCode);
//					$('#loadServicesOverLayChoice').val(responseText.data.ratingChoice.loadServiceCodeRE);
//					$('#routingDetOverLayChoice').val(responseText.data.ratingChoice.routingDetailsRE);
//					$('#dischargeServicesOverlayChoice').val(responseText.data.ratingChoice.dischargeServiceCodeRE);
//					$('#re_choice_dialog').dialog( "open" );
//					$("#reChoiceGrid").trigger('reloadGrid');
//				}
//				else if (responseText.data.rateView == "hold"){
//					openHoldsUnreleasedDialog('booking');
////					$("#holdsUnreleased").attr("style","visibilty:visible");
////					$('#holdUnreleasedGrid').trigger('reloadGrid');
//				}
//				if(responseText.data.rateView == "exception"){
//					alert(responseText.data.billManagerException);
//					return;
//				}
//		}
//	}
//	});
}

function createCommentFunc() {
	var args = {
			entityType: 'RCUT',
			entityId: $('#receivedUnitId').val(),
			commentId: 'commentId',
			displayCommentTypes: ''
		   };
	getCommentTypes(args);
}


function validateTcn(field, rules, i, options){
	 console.log('validateTCN '+($("#tcn").val().length) +" - "+$("#tcnHidden").val().length );
	 if($("#tcn").val().length == 0 ) {
		 if($("#tcnHidden").val().length != 0 ) {
			 rules.push('required');
			 return  '*TCN must be 17 characters';
		 } else {
			 return tcnAllowedCharacters();
		 }
	 }
	 else if($("#tcn").val().length == 17  ) {
		 return tcnAllowedCharacters();
	 } else {
		 return  '*TCN must be 17 characters';
		 
	} 
}


function tcnAllowedCharacters() {
	 var regex = new RegExp("^[a-zA-Z0-9\$]+$");
	 
	 if (!regex.test($("#tcn").val())) {
		 return "Allowed TCN Characters are (0-9, A-Z, $)";
	 } 
}

function tcnEnable() {
	if($("#tcn").val().length == 0 || $("#shipmentId").val().length != 0) {
		$("#tcn").attr("disabled", "disabled");
	} else {
		$("#tcn").removeAttr("disabled");
	}
}

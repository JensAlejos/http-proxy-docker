/**
 *  Javascript File for maintain Quote.
 *  Other files to be referred for quote screen are 
 *  quote_customer.js
 *  quote_routing.js
 *  quote_notify.js
 */

var _isQuoteChanged = false;
var _isQuoteReplicated = false;
var _isQuoteClauseChanged = false;
var _isRatingAttributeChanged = false;
var _isChargeAttributeChanged = false;
var _isQuoteNumberChanged = false;
var re_itemNo="";
var re_tariffNo="";
var re_groupName="";
var src_code="QT";
var quoteString = "";


$(function() {	

	blockUI();
	
	elRTE.prototype.options.panels.web2pyPanel = [ 'bold', 'italic',
		                                   			'underline', 'forecolor', 'hilitecolor', 'justifyleft',
		                                   			'justifyright', 'justifycenter', 'justifyfull', 'formatblock',
		                                   			'fontsize', 'fontname', 'insertorderedlist', 'insertunorderedlist',
		                                   			'link', 'image', ];

	elRTE.prototype.options.toolbars.web2pyToolbar = [ 'web2pyPanel', 'tables' ];
	   	
	
	$("#kickerTemplatesDivDialog").dialog({
		title: 'Alert Email Templates',
		autoOpen: false, 
		autoResize : true, 
		minHeight: 0, 
		modal: true, 
		width: 850,
		buttons : [ {
			text : "Exit",
			click : function() {
				$(this).dialog("close");
			}
		}, {
			text : "Send",
			click : function() {
			    var myGrid = $('#sendKickerGrid');
			    var selRowId = myGrid.jqGrid ('getGridParam', 'selrow');
			    if (null == selRowId) {
			    	alert('Please select a template');
			    	return;
			    }
			    var templateId = myGrid.jqGrid ('getCell', selRowId, 'templateId');
				applyAndSendKicker(templateId);
			}
		} ]
	});
	
	$("#sendKickerDivDialog-isHtml").val('false'); // initial state for SendEmail overlay
	
	$("#sendKickerDivDialog").dialog({ // initializing overlay for SendEmail
		title : 'Send Alert Email',
		autoOpen : false,
		autoResize : true,
		minHeight : 0,
		modal : true,
		width : 1024,
		buttons : {
			Exit : function() {
				$(this).dialog("close");
			},
			Send : function() {
				console.log('Sending alert .. isHtml?' + $('#sendKickerDivDialog-isHtml').val());
				blockUI();
				var urlStr = _context +"/booking/sendBookingKicker";
				var data = {
					emailBody : ($('#sendKickerDivDialog-isHtml').val() == 'true') ? $('#sendKickerDivDialog-emailBody').elrte('val'):$('#sendKickerDivDialog-emailBody').val() ,
					emailTo : $('#sendKickerDivDialog-emailTo').val(),
					emailCc : $('#sendKickerDivDialog-emailCc').val(),
					emailSubject : $('#sendKickerDivDialog-emailSubject').val(),
					quoteId : $('#sendKickerDivDialog-quoteId').val(),
					templateId : $('#sendKickerDivDialog-templateId').val()
				}
				$.ajax({
					type: "POST",
					url: urlStr,
					data: data,
					dataType:'json',
					success: function(responseData){
						console.log('Sending alert ... Success');
						$.unblockUI();
						alert("Email Alert sent successfully");
						$(this).dialog("close");
					},
					error: function(jqXHR,textStatus,errorThrown) {
						console.log('Sending alert ... Error');
						$.unblockUI();
						alert("Email Alert could not be sent");
						$(this).dialog("close");
					}
				});
			}
		}
	});
	
	
	if($(document).getUrlParam("error") == 'y'){
		$.ajax({
			type: "GET",
			url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
			//data: queryString,
			success: function(responseText){
				showResponseMessages(responseText.messages);
				$.unblockUI();
			}
		});
	}
	
	
	$(window).load(function() {
		setRoutingHeader();		
		setServiceDescriptionTitle();
		if($("#selectedCustomerGroup").val() == ""){
			$("#customerGroup").val("");
		}
		//IE 9.0 compatibility code for LDSP
		if(($("#quoteId").val() == "" && $("#callingEntityMethod").val() != "Duplicate" && 
				 $("#callingEntityMethod").val() != "correctQuote" && $("#callingEntityMethod").val() != "getQuote")){
			$("#loadServiceCode :selected").text("");
			$("#dischargeServiceCode :selected").text("");
			
			$("#loadServiceCode :selected").val("");
			$("#dischargeServiceCode :selected").val("");
			setRoutingHeader();
		}
		if(($("#quoteId").val() != "" || 
				$("#callingEntityMethod").val() == "replicateQuote" || 
				$("#callingEntityMethod").val() == "correctQuote" ) && $("#organizationId").val() == "" 
					&& ($("#contactFirstName").val() != "" || $("#contactLastName").val() != "")){
			setOTCEntityProperties();
			loadOneTimeCustDetails();	/*Should be toggled on start */	
		}else{
			$("#showOneTimeCustomerCheck").attr("disabled",true);	
		}
		
		if($("#callingEntityMethod").val() != undefined && ($("#callingEntityMethod").val() == "showNewForm"
			|| $("#callingEntityMethod").val() == "Duplicate" || $("#callingEntityMethod").val() == "returnClause") ){
			onlyOneGroup();
		}
		
		if($("#addressRoleId").val()!="" && $("#organizationId").val()!="" 
			&& $("#addressRoleId").val()!=null && $("#organizationId").val()!=null){		
			var contactNameDataList = "";	
			$('#contactName').empty();
			$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + $("#organizationId").val() + "|" + $("#addressRoleId").val(),
				function(contacts) {	
					$('#contactName').append("<option value=''>Select</option>");
					$(contacts).each(function() {
						var formattedName = getFormattedName(validateForUndefined(this.label), 
								validateForUndefined(this.dept), validateForUndefined(this.title));
						var option = $('<option />');
						option.attr('value', this.value).text(unescape(formattedName.replace(/ /g, "%A0")));
						$('#contactName').append(option);
						contactNameDataList += this.value + "!?" + this.label + "!?"
								+ validateForUndefined(this.phcntry) + "!?" 
								+ validateForUndefined(this.pharea) + "!?" 
								+ validateForUndefined(this.phexch) + "!?" 
								+ validateForUndefined(this.phstcde) + "!?" 
								+ validateForUndefined(this.phextn) + "!?" 
								+ validateForUndefined(this.fxcntry) + "!?" 
								+ validateForUndefined(this.fxarea) + "!?" 
								+ validateForUndefined(this.fxexch) + "!?" 
								+ validateForUndefined(this.fxstcde) + "!?" 
								+ validateForUndefined(this.email) + "|"; 
						
						if($("#contactId").val() == this.value){
							$("#contactName option[value='" + this.value + "']").attr("selected", "selected");
						}
					});
					$("#contactNameDataList").val(contactNameDataList);
					if(!($('#statusCode').val() == "ISSD" || $('#statusCode').val() == "BKGD")){
						$('#contactName').trigger('blur');
					}
					$("#callingEntityMethod").val("");
					if($("#contactName").val() != "" && $("#contactName").val() != null){
						$.ajax({
							type: "GET",
							url: _context +"/quote/getContactName?contactId="+$("#contactName").val(),				
							success: function(responseText){					
								$("#notifyContactName").val(responseText.data);
								$.unblockUI();
							}
						});
					}else{
						var contactFullName = "";
						if($("#contactFirstName").val() != ""){
							contactFullName = $("#contactFirstName").val().trim();
						}
						if($("#contactLastName").val() != ""){
							if(contactFullName != ""){
								contactFullName = contactFullName + " " + $("#contactLastName").val().trim();	
							}else{
								contactFullName = contactFullName + $("#contactLastName").val().trim();
							}
						}
						$("#notifyContactName").val(contactFullName);
					}
			});
		}else{
			$("#callingEntityMethod").val("");
		}
        // this code will run after all other $(document).ready() scripts
        // have completely finished, AND all page elements are fully loaded.
		if ($('#quoteId').val()== "" && $('#statusCode').val()== ""){
			expandAll();
		}
		if ($('#quoteId').val()!= "" && ($('#statusCode').val()== "ISSD" || $('#statusCode').val()== "BKGD")) {
			disableControlsOnQuoteScreen();
			
			$("#effectiveDateLabel").text("Quote Effective Date");
			$('#expirationHeader').html("");
			var newText1 = '<label for="expirationDate" id="expirationDateLabel" class="span-1 label">TO</label>';
					
			$("#expirationHeader").append(newText1);
			$("#effectiveDate").text($("#estimatedShipDate").val());
			var d = new Date($("#estimatedShipDate").val());
	        d.setDate($("#estimatedShipDate").val() + 30);        
	        $("#expirationDate").text(d);
		} else if ($('#quoteId').val()!= "" && ($("#quoteChargeLineGrid").getGridParam("reccount") > 0)){
			$("#effectiveDateLabel").text("Rate Effective Date");
		}
		$("#quoteTotalVal").val($("#quoteTotal").val());
		$("#quoteTotalValue").val($("#quoteTotal").val());
		
		
		$("#notifyMailHidden").val($("#notifyMailId").val());
		$("#notifyFaxHidden").val($("#notifyFax").val());	
		setAccordianTabDetails("customerNameDiv", " - "+$("#customerName").val());
		
		jQuery("#quoteCommodityGrid").trigger('reloadGrid');		
		
		if($("#isQuoteReplicated").val() == "true" || $("#isQuoteReplicated").val() == true){
			_isQuoteReplicated = true;
		}
		if($("#isQuoteChanged").val() == "true"){
			_isQuoteClauseChanged = true;
		}
		
		if($("#showOneTimeCustomerCheck").is(":checked")){
			$("#notifyContactName").val($("#contactName").text());
		}/*else{
			
		}*/
		
		$.unblockUI();
		$("#quoteExpandAll").focus();
		setZipCodeOnScreen();
		setQuoteTitle($("#quoteId").val(),$("#quoteNumber").val(),$("#quoteVersionNumber").val());
		if($(document).getUrlParam("isQuoteClauseChanged") == 'true'){
			$('#quoteSave').trigger("click");
		}
	});
	
	$("#noTabSet input").attr("tabindex", "-1"); 
	
	$("input:checkbox[id=isConstructed]").click(function(){
		$("[id$=isConstructed]").focus();
		$("#isConstructedCmdy").attr("checked", true);
	});
	
	$("#imperial").click(function(){
		$("[id$=imperial]").focus();
		$("input:radio[name=unitOfMeasureSourceCode]").val("I");
		/*if ($("#imperial").is(":checked")) {*/
			$("#jqgh_quoteCommodityGrid_weightPound").text("Weight");
			$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cube");
			var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
			if (commodityRecords >0){
				for (var i=1;i<=commodityRecords; i++) {
					var weightKG = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
					var weightLBS = convertKGToPound(weightKG);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightLBS );
					
					var volumeMetric = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
					var volumeImp = convertToImperialVolume(volumeMetric);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeImp );
				}
			}
		/*} */
	});
	$("#metric").click(function(){
		$("[id$=metric]").focus();
		$("input:radio[name=unitOfMeasureSourceCode]").val("M");
		/* if ($("#metric").is(":checked")) {*/
			$("#jqgh_quoteCommodityGrid_weightPound").text("Wgt KG");
			$("#jqgh_quoteCommodityGrid_cubicFeet").text("Cubic Meter");
			var commodityRecords = $("#quoteCommodityGrid").getGridParam("reccount");
			if (commodityRecords >0){
				for (var i=1;i<=commodityRecords; i++) {
					var weightLBS = $("#quoteCommodityGrid").jqGrid('getCell', i , "weightPound" );
					var weightKG = convertPoundToKG(weightLBS);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "weightPound", weightKG );
					
					var volumeImp = $("#quoteCommodityGrid").jqGrid('getCell', i , "cubicFeet" );
					var volumeMetric = convertToMetricVolume(volumeImp);
					$("#quoteCommodityGrid").jqGrid('setCell', i , "cubicFeet", volumeMetric );
				}
			}
		/*}*/
	});
	
	var defaultUpdateText = "Do you want to save changes? ";
		
	var confirmText = defaultUpdateText;
	var statusCode = $('#statusCode').val();
	/*
	 * 0. Default Conditions
	 */
	
	$("#quoteForm").validationEngine('attach');
	
	$("#estimatedShipDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	
	$("<option value='' selected='selected'></option>").prependTo("#dischargeServiceCode");
	$("<option value='' selected='selected'></option>").prependTo("#loadServiceCode");
	$("<option value='' ></option>").prependTo("#customerGroup");	

	if ($('#estimatedShipDate').val() == "") {
		$('#estimatedShipDate').val(getCurrentDate());
	}
	
	if ($('#total').text() == "") {
		$('#total').text("0.00");
	}
	
	/*
	 * 1. Selector framework implementation
	 */
	
	$("#quoteForm input").change(function() {
		if (!($(this).is("#customerDiv input") || $(this).is("#OneTimeCustomerDialog input") || $(this).attr('id') == "quoteNumber" || $(this).attr('id') == "quoteVersionNumber")) {
			_isRatingAttributeChanged = true;
			$("#isQuoteChanged").val("true");
		}
		
		if($(this).attr('id') == "quoteNumber" || $(this).attr('id') == "quoteVersionNumber"){
			_isQuoteNumberChanged = true;
			$("#isQuoteNumberChanged").val("true");
		}
		
		/*if($(this).attr('id') != "quoteNumber"){
			_isQuoteChanged = true;
			$("#isQuoteChanged").val("true");
		}else{
			_isQuoteNumberChanged = true;
			$("#isQuoteNumberChanged").val("true");
		}*/
	});
	
	$("#quoteForm select").change(function() {
		_isQuoteChanged = true;
		if (!($(this).is("#customerDiv select") || $(this).is("#OneTimeCustomerDialog select") || $(this).attr('id') == "quoteNumber" || $(this).attr('id') == "quoteVersionNumber")) {
			_isRatingAttributeChanged = true;
			/*$("#isQuoteChanged").val("true");
			alert("Quote Changed Select true");*/
		}
	});
	
	$("#emailAddress").change(function() {
		_isQuoteChanged = true;
	});
	
	$('.noCheckforChange').change(function() {
		_isQuoteChanged = false;
	});
	
	$("#quoteIdNumber").val($("#quoteId").val());
	quoteString = $("#quoteId").val()  + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val(); 

	/*
	 * 2. Code for Comments Section
	 */
	var args = {
		entityType: 'QUOT',
		entityId: $('#quoteId').val(),
		commentId:  'commentId',
		displayCommentTypes: 'QTE'
	};
	$("#comment_link").comments(args);
	//getCommentTypes(args);
	
	//$("#comment_link").comments(args);

	//Dialog
	$('#statusHistoryDialog').dialog({
		autoOpen: false,
		width: 410,
		modal: true
	});
	
	var historyArgs = {
		entityId: $('#quoteId').val(),
		entity: 'com.matson.gates.qt.domain.Quote'
	};
	
	$("#history_link").history(historyArgs);
	
	/*
	 * 3. Function Calls
	 */
	checkForFormCondition();
	setEstimatedShipDate();
		
	if ($('#quoteId').val()== "" ) {
		$("#commentsNHistoryDiv").css("visibility", "hidden");
	}
	
	$('#tradeCode').focus(function() {
		if($('#blOriginCityCode').is(":disabled")){
			this.form.originPortCityCode.focus();
		}
	});
	
	
	$('#isConstructed').click(function() {
		var numOfCommodities = $("#quoteCommodityGrid").getGridParam("reccount");
		if(numOfCommodities > 1){
			$('#isConstructed').removeAttr("checked");
			$('#isConstructedCmdy').removeAttr("checked");
			alert("Quote cannot be constructed as there are multiple commodity exists.");
			return;
		}
		var numOfCharges = $("#quoteChargeLineGrid").getGridParam("reccount");
		if (!$('#isConstructed').is(":checked") && numOfCharges > 0) {
			for (var i = 1; i<=numOfCharges; i++) {
				var chargeType = $("#quoteChargeLineGrid").jqGrid('getCell', i , "description" );
				chargeType = chargeType + " ";
				if(chargeType.indexOf("-") != -1){
					chargeType = chargeType.split("-")[0];
				}
				if (chargeType == "OVR" || chargeType == "OVR-ACI ZONE PICKUP") {
					$('#isConstructed').attr("checked", true);
					alert("To unselect, please delete the Overland charges from Charge Line");
					return;
				}
			}
		}
	});
	
	/*Open a Pop-Up Window for Door To Ramp Search*/
	/*$('#openDoorRamp').click(function() {
		jQuery('#quoteForm').validationEngine('hideAll');
		if($('#statusCode').val()=="ISSD" || $('#statusCode').val()=="BKGD") {
			alert("Trucker Rates cannot be added for this quote status");
			return;
		}
		var actionUrl = _context + "/cas/doorToRampSearch.do?estShipDt="+$("#estimatedShipDate").val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'DoorToRampSearch', windowStyle);		
	});	 */
	
	/*Open a Pop-Up Window for Overland Search*/
	$('#openOverland').click(function() {
		jQuery('#quoteForm').validationEngine('hideAll');
		if($('#statusCode').val()=="ISSD" || $('#statusCode').val()=="BKGD") {
			alert("Overland Charges cannot be added for this quote status");
			return;
		}
		
		var selectedRows = $("#quoteCommodityGrid").jqGrid("getGridParam", "selarrrow");
		
		if (selectedRows.length != 1 && $("#quoteCommodityGrid").getGridParam("reccount") > 1) {
			alert("Please select only 1 Commodity for which Overland Charges are to be added.");
			return;
		}

		if (selectedRows.length == 0) {
			if($("#quoteCommodityGrid").getGridParam("reccount") == 1){
				var id = jQuery("#quoteCommodityGrid").getDataIDs()[0];
				$("#quoteCommodityGrid").jqGrid("setSelection", id);
				selectedRows = $("#quoteCommodityGrid").jqGrid("getGridParam", "selarrrow");
			}
		}

		var equipTypeCode = $("#quoteCommodityGrid").jqGrid('getCell', selectedRows[0] , "planEquipTypeCode" );
		var tariff = $("#quoteCommodityGrid").jqGrid('getCell', selectedRows[0] , "tariffNumber" );
		var item = $("#quoteCommodityGrid").jqGrid('getCell', selectedRows[0] , "tariffServiceItemCode" );
		var equipType="*";
		var equipLength="";
		var equipHeight="";
		if (equipTypeCode != "" && equipTypeCode!=null) {
			equipType = equipTypeCode.substr(0,1);
			equipLength = equipTypeCode.substr(1,2);
			equipHeight = equipTypeCode.substr(3);
		}
		var isOverland = "N";
		var loadService;
		var dschService;
		var selectedLoadService = $('#loadServiceCode :selected').val();
		var selectedDschService = $('#dischargeServiceCode :selected').val();
		
		$('#loadDschPairsListHidden option').each(function(){
			loadService = (this.text.split(",")[1]).split("=")[1];
			dschService = (this.text.split(",")[2]).split("=")[1];
			
			if (selectedLoadService == loadService && selectedDschService == dschService) {
				isOverland = (this.text.split(",")[21]).split("=")[1];
			}
			
		});
		
		if(($('#loadServiceCode :selected').val() != "") &&
		   ($('#dischargeServiceCode :selected').val() != "") &&
		   $('#isConstructed').is(':checked') && (isOverland=='Y' || isOverland.trim() == "")) {	
			
			var param = "";
			var direction ="O";
			orgPlace=breakCityCode($("#blOriginCityCode").val());
			orgPort=breakCityCode($("#originPortCityCode").val());
			destPlace=breakCityCode($("#blDestinationCityCode").val());
			destPort=breakCityCode($("#destinationPortCityCode").val());
			ldServ=$('#loadServiceCode :selected').val();
			dschServ=$('#dischargeServiceCode :selected').val();
			estShDt=$("#estimatedShipDate").val();
			
			param = "";
			orgPlace=$("#blOriginCityCode").val();
			orgPort=$("#originPortCityCode").val();
			destPlace=$("#blDestinationCityCode").val();
			destPort=$("#destinationPortCityCode").val();
			
			estShDt=$("#estimatedShipDate").val();
			if(ldServ=='IM' || ldServ == 'IMS'){
				direction ="O";
			}else if (dschServ=='IM' || dschServ == 'IMS'){
				direction ="D";
			}
			if(orgPort!=null){
				param = direction + '|' + orgPort + '|' + orgPlace + '|' + estShDt + '|' + destPort + '|'+ destPlace + '|' 
					+ equipType + '|' + equipLength + '|' + equipHeight + '|' + ldServ + '|' + dschServ;
			}
			var actionUrl = _context + "/cas/overLandSearch.do?params=" + param;
			var windowStyle = 'top=0,left=0,height=600,width=1100,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'OverlandSearch', windowStyle);

			// Anil Jindal :: Commenting below peace of code since we do not require to evaluate link conditions now -- 11/15/2012.
		/*	$.get(url, function(responseText) {
				var index=responseText.indexOf(',');
				while(index!=-1) {
					responseText=responseText.replace(',','&comma');
					index=responseText.indexOf(',');
				}
				var index=responseText.indexOf('[');
				while(index!=-1) {
					responseText=responseText.replace('[','');
					index=responseText.indexOf('[');
				}
				var index=responseText.indexOf(']');
				while(index!=-1) {
					responseText=responseText.replace(']','');
					index=responseText.indexOf(']');
				}
				
				
			});*/

		} else {
			collapseAll();
			scrollWin();
			alert("An overland charge must have the Constructed Flag checked and an appropriate load/discharge service pair");
		}
	});

	/*
	 * 4. Quote Actions - Save, Update
	 */

	$('#quoteSave').click(function() {	
		
		var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();

		if(quoteString == newQuoteString){
			expandAll();
			
			var statusCodeVal = $('#statusCode').val();		
			var quoteIdVal = $('#quoteId').val();
					
			if ( !$("#quoteForm").validationEngine('validate') ){
				return;
			}
			validateEstShipDate();
			var isOkToSave = doMandatoryChecks();
			if(!isOkToSave){
				scrollWin();
				return;
			}
			var queryString = $('#quoteForm').formSerialize();
			if(!$("#drayagePickupZipCode").is(":disabled")){
				if($("#drayagePickupZoneCode").val() == ""){
					isOkToSave = false;
				}
			}
			if(!$("#drayageDeliveryZipCode").is(":disabled")){
				if($("#drayageDeliveryZoneCode").val() == ""){
					isOkToSave = false;
				}
			}
			if(!isOkToSave){
				blockUI();
				$.ajax({
					type: "GET",
					url: _context +"/quote/showAlertMessage?message=NoZoneFound",
					//data: queryString,
					success: function(responseText){
						showResponseMessages(responseText.messages);
						$.unblockUI();
					}
				});
				scrollWin();
				return;
			}
			
			if(_isQuoteNumberChanged == true && _isQuoteChanged == false ){
				if($('#quoteNumber').val() != ''){
					var isQuoteOk = checkQuote();
					if(!isQuoteOk){
						blockUI();
						$.ajax({
							type: "GET",
							url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
							//data: queryString,
							success: function(responseText){
								document.location.href = _context + '/quote/showNewForm?error=y';
								$.unblockUI();
								$("#isQuoteNumberChanged").val("false");
								$("#isQuoteChanged").val("false");
							}
						});
						scrollWin();
						return;
					}
				}
			}

			// save quote if quoteId is null
			if (quoteIdVal == "") {
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/saveQuote?deleteNonGenericCharges=false",
					data: queryString,
					success: function(responseText){
						$("#quoteForm").loadJSON(responseText.data);
						setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
						setHistoryTab(responseText);
						$("#quoteIdNumber").val($("#quoteId").val());
						quoteString = $("#quoteId").val()  + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val(); 
						jQuery("#quoteCommodityGrid").trigger('reloadGrid');
						jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
						jQuery("#specialServiceGrid").trigger('reloadGrid');
						showResponseMessages(responseText.messages);
						$("#commentsNHistoryDiv").css("visibility", "visible");
						$("#entityVersion").val(responseText.data.entityVersion);
						$("#commentId").val(responseText.data.commentId);
						_isQuoteChanged = false;
						_isQuoteReplicated = false;
						_isRatingAttributeChanged = false;
						_isQuoteClauseChanged = false;
						_isCommodityRatingAttributeChanged = false;
						$("#isQuoteNumberChanged").val("false");
						$("#isQuoteChanged").val("false");
						$.unblockUI();
					}
				});
			} else {
				// update quote if quoteId is present
				//isQuoteChanged is used to check if Clauses are added/updated/deleted
				if (_isQuoteChanged == true || $("#isQuoteChanged").val() == "true") {
					if (quoteIdVal) {
						if ((_isCommodityRatingAttributeChanged || _isRatingAttributeChanged) && $("#quoteChargeLineGrid").getGridParam("reccount") > 0) {
							var r = confirm(confirmText);
							if (r == true) {
								updateQuote(queryString);
								$("#isQuoteNumberChanged").val("false");
								$("#isQuoteChanged").val("false");
							} else {
								return true;
							}
						} else {
							updateQuote(queryString);
							$("#isQuoteNumberChanged").val("false");
							$("#isQuoteChanged").val("false");
						}
					}
				} else {
					alert("No fields have changed. Cannot update");
				}
			}
		}
		else{
			alert("Quote No./version has been changed. Please reload the page.");
		}
		/**/
		/*$("#quoteForm").submit();*/				
	});	

	/**
	 * START SECTION : RATE QUOTE
	 */
	/*START - JS Code for Trace Level Calculation*/
	//Dialog
	$('#re_error_dialog').dialog({
		autoOpen: false,
		width: 1000,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {
			$(".ui-dialog-titlebar-close").show();
		},
		buttons : {
			  "Exit" : {
		         text: "Exit",
		         id: "reErrCloseBtn",
		         click: function(){
		        	 $('#re_error_dialog').dialog( "close" );
		          }   
		       },
			  "List Rate" : {
		    	  text: "List Rate",
			      id: "reErrListRateBtn",
			      click: function(){
			    			window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&sourceCode="+
			    					re_tariffNo+"&groupCode="+re_groupName
			    					+"&itemCode="+re_itemNo+"&src="+src_code);
			    			        //+"&src=QT"
			      }        
		       },
		      "Continue" : {
		    	  text: "Continue",
			      id: "reErrContinueBtn",
			      click: function(){
			    	  //$('#reErrorGrid').jqGrid('GridUnload');
			  		$('#re_error_dialog').dialog( "close" );
			      }
		      }
		}
	});
	
	$('#re_choice_dialog').dialog({
		autoOpen: false,
		width: 1000,
		modal: true,
		closeOnEscape: false,
		buttons : {
			  "Exit" : {
		         text: "Exit",
		         id: "reChoiceCloseBtn",
		         click: function(){
		        	 $('#re_choice_dialog').dialog( "close" );
		          }   
		       },
		      "List Rate" : {
		    	  text: "List Rate",
			      id: "reChoiceListRateBtn",
			      click: function(){
			    			window.open(_context+ "/cas/rateDesriptionBillSearch.do?from=item&sourceCode="+
			    					re_tariffNo+"&groupCode="+re_tariffNo
			    					+"&itemCode="+re_itemNo+"&src="+src_code);
			    			        //+"&src=QT"
			      }
		        },
		       "Continue" : {
		    	  text: "Continue",
			      id: "reChoiceContinueBtn",
			      click: function(){
			    	  $('#re_choice_dialog').dialog( "close" );
			          concludeRating(0);
			      }
		      }
		}
	});
  	
	$('#quoteTrace')
	.click(
		function() {
			var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
			if(quoteString == newQuoteString){
				expandAll();
				if ( !$("#quoteForm").validationEngine('validate')) {
					return;
				}
				
				var isOkToSave = doMandatoryChecks();
				if(!isOkToSave){
					scrollWin();
					return;
				}			
				
				if(!$("#drayagePickupZipCode").is(":disabled")){
					if($("#drayagePickupZoneCode").val() == ""){
						isOkToSave = false;
					}
				}
				if(!$("#drayageDeliveryZipCode").is(":disabled")){
					if($("#drayageDeliveryZoneCode").val() == ""){
						isOkToSave = false;
					}
				}
				if(!isOkToSave){
					blockUI();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoZoneFound",
						//data: queryString,
						success: function(responseText){
							showResponseMessages(responseText.messages);
							$.unblockUI();
						}
					});
					scrollWin();
					return;
				}
				
				if($("#quoteCommodityGrid").getGridParam("reccount") > 0){
					var statusCodeVal = $('#statusCode').val();		
					
					if (statusCodeVal == "BKGD") {
						alert ("Can't Rate quote since a booking already exists");
						return;
					}else if(statusCodeVal == "ISSD"){
						alert ("Can't Rate quote since a status is Issued");
						return;
					}
					if ($('#quoteId').val() != "") {
						if ((_isCommodityRatingAttributeChanged || _isRatingAttributeChanged) 
								&& $("#quoteChargeLineGrid").getGridParam("reccount") > 0) {
							var r = confirm(confirmText);
							if (r == true) {
								$('#rating_options_dialog').dialog('open');			
								$('#lowTrace').attr("checked", true);
								$('#optionToRate').val("1");
							} else {
								return true;
							}
						}else{
							$('#rating_options_dialog').dialog('open');			
							$('#lowTrace').attr("checked", true);
							$('#optionToRate').val("1");						
						}
					}else{
						$('#rating_options_dialog').dialog('open');			
						$('#lowTrace').attr("checked", true);
						$('#optionToRate').val("1");					
					}
				}else{
					blockUI();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoCommodityToRate",
						//data: queryString,
						success: function(responseText){
							showResponseMessages(responseText.messages);
							$.unblockUI();
						}
					});
				}
			}
			else{
				alert("Quote No./version has been changed. Please reload the page.");
			}
		});
	
	
	
	$('#quoteRate')
	.click(
		function() {
			var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
			if(quoteString == newQuoteString){
				expandAll();
				
				if ( !$("#quoteForm").validationEngine('validate')) {
					return;
				}
				validateEstShipDate();
				var isOkToSave = doMandatoryChecks();
				if(!isOkToSave){
					scrollWin();
					return;
				}			
				
				if(!$("#drayagePickupZipCode").is(":disabled")){
					if($("#drayagePickupZoneCode").val() == ""){
						isOkToSave = false;
					}
				}
				if(!$("#drayageDeliveryZipCode").is(":disabled")){
					if($("#drayageDeliveryZoneCode").val() == ""){
						isOkToSave = false;
					}
				}
				if(!isOkToSave){
					blockUI();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoZoneFound",
						//data: queryString,
						success: function(responseText){
							showResponseMessages(responseText.messages);
							$.unblockUI();
						}
					});
					scrollWin();
					return;
				}
				if(_isQuoteNumberChanged == true && _isQuoteChanged == false){
					if($('#quoteNumber').val() != ''){
						var isQuoteOk = checkQuote();
						if(!isQuoteOk){
							blockUI();
							$.ajax({
								type: "GET",
								url: _context +"/quote/showAlertMessage?message=NoQuoteFound",
								//data: queryString,
								success: function(responseText){
									showResponseMessages(responseText.messages);
									$.unblockUI();
									document.location.href = _context + '/quote/showNewForm';
									$("#isQuoteNumberChanged").val("false");
									$("#isQuoteChanged").val("false");
								}
							});
							scrollWin();
							return;
						}
					}
				}
				if($("#quoteCommodityGrid").getGridParam("reccount") > 0){
					var statusCodeVal = $('#statusCode').val();		
					
					if (statusCodeVal == "BKGD") {
						alert ("Can't Rate quote since a booking already exists");
						return;
					}else if(statusCodeVal == "ISSD"){
						alert ("Can't Rate quote since a status is Issued");
						return;
					}
					/*if ($('#quoteId').val() != "") {
						if ((_isCommodityRatingAttributeChanged || _isRatingAttributeChanged) 
								&& $("#quoteChargeLineGrid").getGridParam("reccount") > 0) {*/
							//var r = confirm(confirmText);
							
							//confirmTextFinal = "<p>" + confirmText + "</p>";
							//$(confirmTextFinal).dialog({
					          // modal : true, 
					          //  title: "Change Confirmation",
					                     // buttons: {
					                              /// 'Ok': function(){
					                            	   $('#optionToRate').val("0");
					       								$('#startRating').trigger("click");
					                                   //$(this).dialog('close');      
					                              // },
					                               //'Cancel': function(){
					                                 //  $(this).dialog('close');   
					                                //   return true;
					                              // }
					                          // }
					                  // });				           
					             
							 
							/*if (r == true) {
								
								$('#optionToRate').val("0");
								$('#startRating').trigger("click");
							} else {
								return true;
							}*/
						/*}else{						
							$('#optionToRate').val("0");
							$('#startRating').trigger("click");
						}
					}else{					
						$('#optionToRate').val("0");
						$('#startRating').trigger("click");
					}*/
				}else{
					blockUI();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoCommodityToRate",
						success: function(responseText){
							showResponseMessages(responseText.messages);
							$.unblockUI();
						}
					});
				}
			}
			else{
				alert("Quote No./version has been changed. Please reload the page.");
			}
		});
	
	//Dialog			
	$('#rating_options_dialog').dialog({
		autoOpen: false,
		width: 300,
		modal: true
	});
	
	/*function openDialog(message){
	$('#quoteRate').dialog({
		autoOpen : false,
		modal: true,
		closeOnEscape: false,
		show : message,
		title : "Change Confirmation ",
		Buttons: {
			"true" : {
				text: "Ok"
			},
			"false" : {
				text: "Close"
				}
			}
		});
	};*/

			
	
	
	// Code to set "Customer" or "Commodity" on click of Options
	$('#noTrace').click(function(){
		$('#optionToRate').val("0");		
	});

	$('#lowTrace').click(function(){
		$('#optionToRate').val("3");		
	});
	
	$('#mediumTrace').click(function(){
		$('#optionToRate').val("5");
	});
	
	$('#highTrace').click(function(){
		$('#optionToRate').val("7");
	});
	
	$('#cancelRating')
	.click(
		function() {
			$('#rating_options_dialog').dialog('close');
		});
	
	$('#startRating')
	.click(
		function() {			
			if ($("#rating_options_dialog").dialog( "isOpen" )===true) {
				$('#rating_options_dialog').dialog('close');
			}
			var quoteIdVal = $('#quoteId').val();
			
			
			if ( !$("#quoteForm").validationEngine('validate')) {
				return;
			}
			validateEstShipDate();
			var queryString = $('#quoteForm').formSerialize();
			// save quote if quoteId is null
			if (quoteIdVal == "") {
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/quote/saveQuote?deleteNonGenericCharges=false",
					data: queryString,
					success: function(responseText){
						$("#quoteForm").loadJSON(responseText.data);
						setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
						setHistoryTab(responseText);
						$("#quoteIdNumber").val($("#quoteId").val());
						quoteString = $("#quoteId").val()  + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val(); 
						showResponseMessages(responseText.messages);
						$("#commentId").val(responseText.data.commentId);
						$("#entityVersion").val(responseText.data.entityVersion);
						$("#commentsNHistoryDiv").css("visibility", "visible");
						_isQuoteChanged = false;
						_isQuoteReplicated = false;
						_isQuoteClauseChanged = false;
						_isRatingAttributeChanged = false;
						_isCommodityRatingAttributeChanged = false;
						jQuery("#quoteCommodityGrid").trigger('reloadGrid');
						jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
						jQuery("#specialServiceGrid").trigger('reloadGrid');
						if(!(responseText.messages.error.length > 0)){
							rateQuoteCall();	
						}else{
							$.unblockUI();
						}
					}
				});
			} else {
				var quoteStatus = $('#statusCode').val();				
				if( _isCommodityRatingAttributeChanged || _isChargeAttributeChanged){
					blockUI();
					// update quote if quoteId is present				
					$.ajax({
						type: "POST",
						url: _context +"/quote/updateQuote?quoteStatus=PEND&deleteNonGenericCharges=true"+"&chargeDeleted="+_chargeDeleted,
						data: queryString,
						success: function(responseText) {
							 $("#entityVersion").val(responseText.data.entityVersion);
							showResponseMessages(responseText.messages);
							setHistoryTab(responseText);
							_isQuoteChanged = false;
							_isQuoteReplicated = false;
							_isQuoteClauseChanged = false;
							_isRatingAttributeChanged = false;
							_isChargeAttributeChanged = false;
							_isCommodityRatingAttributeChanged = false;
							setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
							jQuery("#quoteCommodityGrid").trigger('reloadGrid');
							jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
							jQuery("#specialServiceGrid").trigger('reloadGrid');
							if(!(responseText.messages.error.length > 0)){
								rateQuoteCall();	
							}else{
								$.unblockUI();	
							}
							
						}
					});
				}else{
					blockUI();
					// update quote if quoteId is present				
					$.ajax({
						type: "POST",
						url: _context +"/quote/updateQuote?quoteStatus="+quoteStatus+"&deleteNonGenericCharges=false"+"&chargeDeleted="+_chargeDeleted,
						data: queryString,
						success: function(responseText) {
							
							 $("#entityVersion").val(responseText.data.entityVersion);
							showResponseMessages(responseText.messages);
							setHistoryTab(responseText);
							_isQuoteChanged = false;
							_isQuoteReplicated = false;
							_isQuoteClauseChanged = false;
							_isRatingAttributeChanged = false;
							_isChargeAttributeChanged = false;
							_isCommodityRatingAttributeChanged = false;
							setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
							jQuery("#quoteCommodityGrid").trigger('reloadGrid');
							jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
							jQuery("#specialServiceGrid").trigger('reloadGrid');
							if(!(responseText.messages.error.length > 0)){
								rateQuoteCall();	
							}else{
								$.unblockUI();	
							}
							
						}
					});
				}
			}
		});
	
	
	$('#cancelBtn')
	.click(function() {
		var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
		if(quoteString == newQuoteString){		
			var quotePrevSt = $('#statusCode').val();
			var queryString = $('#quoteForm').formSerialize();
			var quoteStatus = "CNCL";	
			if(quotePrevSt != "CNCL" ){
			$.ajax({
				type: "POST",
				url: _context +"/quote/updateQuote?quoteStatus="+quoteStatus+"&deleteNonGenericCharges=false"+"&chargeDeleted="+_chargeDeleted,
				data: queryString,
				success: function(responseText) {
					blockUI();
					$("#quoteForm").loadJSON(responseText.data);
					 $("#entityVersion").val(responseText.data.entityVersion);
					showResponseMessages(responseText.messages);
					setHistoryTab(responseText);
					_isQuoteChanged = false;
					_isQuoteReplicated = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
					
					jQuery("#quoteCommodityGrid").trigger('reloadGrid');
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					jQuery("#specialServiceGrid").trigger('reloadGrid');
					$.unblockUI();	
					
					
				}
			});
			
			}
			else{
				
				alert("Quote already in canceled state");
			}
		}
		else{
			alert("Quote No./version has been changed. Please reload the page.");
		}
	});
	
/************* START - JS Code for Replicate Quote *************/
	
	$('#quoteReplicate')
	.click(
		function() {
			var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
			if(quoteString == newQuoteString){
				if($('#quoteId').val() == undefined || $('#quoteId').val() == ""){
					blockUI();
					$.ajax({
						type: "GET",
						url: _context +"/quote/showAlertMessage?message=NoQuoteIdToReplicate",					
						success: function(responseText){
							showResponseMessages(responseText.messages);
							$.unblockUI();
						}
					});
				}else{
					var statusCodeVal = $('#statusCode').val();				
					if (!(statusCodeVal == "BKGD" || statusCodeVal == "ISSD") && (_isQuoteChanged == true)) {
						confirmText = "Do you want to save the existing Quote before replicating";
						$('#quoteSave').trigger("click");					
					}
					$('#replicate_options').dialog('open');
					$("#replicateAll").attr("checked" , true);
					$('#optionToReplicate').val("Correct");	
					if(_isQuoteChanged){
						$("#replicate_options").dialog("widget").animate({top: "400px"}, "fast");
						$('html,body').animate({
							scrollTop: $("#msgDiv").offset().top
							}, 200);
					}
					confirmText = defaultUpdateText;	
				}
			}
			else{
				alert("Quote No./version has been changed. Please reload the page.");
			}
		});
	
	//Dialog			
	$('#replicate_options').dialog({
		autoOpen: false,
		width: 310,
		modal: true,
		top : $(window).scrollTop()
	});
	
	$('#quoteStatusHistory').click(function() {
		$('#statusHistoryDialog').dialog('open');
	});

	// Code to set "Customer" or "Commodity" on click of Options
	$('#replicateCustomer').click(function(){
		$('#optionToReplicate').val("Customer");		
	});
	
	$('#replicateAll').click(function(){
		$('#optionToReplicate').val("Correct");		
	});
		
	$('#replicateCommodity').click(function(){
		$('#optionToReplicate').val("Commodity");
		
	});
	
	$('#cancelReplicate').click(function() {
		$('#replicate_options').dialog('close');
	});

	$('#okReplicate').click(function() {
		$('#replicate_options').dialog('close');
		if($('#optionToReplicate').val() == "Correct"){
			correctQuoteForReplicateAll();
		}else{	
			$("#quoteForm").attr("action", "replicateQuote");
			$("#quoteForm").submit();
		}
		
	});
	
/************* END - JS Code for Replicate Quote *************/
	//Uncomment for create Booking button
	/*$('#createBooking').click(function() {		
		var quoteId = $('#quoteIdNumber').val();
		var quoteNumber = $('#quoteNumber').val();
		var quoteVersionNumber = $('#quoteVersionNumber').val();
		var quoteParameters = quoteId + "|" + quoteNumber + "|" + quoteVersionNumber;
		if(quoteNumber != '' && quoteVersionNumber != '' && $('#statusCode').val() == 'ISSD'){
			document.location.href = _context+"/booking/createBookingFromQuote?quoteParameters="+quoteParameters;
		}else{
			alert("Only ISSD status Quotes valid for Booking creation.");
		}
	});*/
	
/************* START - JS Code for Issue Quote *************/
	$('#issueQuote')
	.click(
		function() {
			var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
			if(quoteString == newQuoteString){
				expandAll();
				var isOkToSave = doMandatoryChecks();
				if(!isOkToSave){
					scrollWin();
					return;
				}
				var statusCodeVal = $('#statusCode').val();
				
				
				if ( !$("#quoteForm").validationEngine('validate') ){
					return;
				}
				validateEstShipDate();
				var queryString = $('#quoteForm').formSerialize();
				if((statusCodeVal == null)||(statusCodeVal == "")||(statusCodeVal == "ISSD")||(statusCodeVal == "BKGD")){				
					alert ("Can't Issue quote since Quote is not in APPR state.");
					return;
				}else if(statusCodeVal == "PEND"){
					alert ("Quote must be in Appoved status before it can be issued.  Press Save and Calculate.");
					return;
				}
				else{
					var quoteStatus = $('#statusCode').val();				
					if ($('#quoteId').val() != "") {
						if ((_isCommodityRatingAttributeChanged || _isRatingAttributeChanged) 
								&& $("#quoteChargeLineGrid").getGridParam("reccount") > 0) {
							var r = confirm(confirmText);
							if (r == true) {
								//if(_isCommodityChanged || _isChargeAttributeChanged){
								if( _isCommodityRatingAttributeChanged /*|| _isChargeAttributeChanged*/){
									blockUI();
									// update quote if quoteId is present				
									$.ajax({
										type: "POST",
										url: _context +"/quote/updateQuote?quoteStatus=PEND&deleteNonGenericCharges=true"+"&chargeDeleted="+_chargeDeleted,
										data: queryString,
										success: function(responseText) {
											$("#entityVersion").val(responseText.data.entityVersion);
											showResponseMessages(responseText.messages);
											setHistoryTab(responseText);
											_isQuoteChanged = false;
											_isQuoteReplicated = false;
											_isQuoteClauseChanged = false;
											_isRatingAttributeChanged = false;
											_isChargeAttributeChanged = false;
											_isCommodityRatingAttributeChanged = false;
											setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
											jQuery("#quoteCommodityGrid").trigger('reloadGrid');
											jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
											jQuery("#specialServiceGrid").trigger('reloadGrid');
											if(!(responseText.messages.error.length > 0)){
												$.unblockUI();
												sendQuoteToIssue();	
											}else{
												$.unblockUI();	
											}
											
										}
									});
								}else{
									sendQuoteToIssue();	
								}
							} else {
								return true;
							}
						}else{						
							if( _isCommodityRatingAttributeChanged /*|| _isChargeAttributeChanged*/){
								blockUI();
								// update quote if quoteId is present				
								$.ajax({
									type: "POST",
									url: _context +"/quote/updateQuote?quoteStatus=PEND&deleteNonGenericCharges=true"+"&chargeDeleted="+_chargeDeleted,
									data: queryString,
									success: function(responseText) {
										$("#entityVersion").val(responseText.data.entityVersion);
										showResponseMessages(responseText.messages);
										setHistoryTab(responseText);
										_isQuoteChanged = false;
										_isQuoteReplicated = false;
										_isQuoteClauseChanged = false;
										_isRatingAttributeChanged = false;
										_isChargeAttributeChanged = false;
										_isCommodityRatingAttributeChanged = false;
										setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
										jQuery("#quoteCommodityGrid").trigger('reloadGrid');
										jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
										jQuery("#specialServiceGrid").trigger('reloadGrid');
										if(!(responseText.messages.error.length > 0)){
											$.unblockUI();
											sendQuoteToIssue();	
										}else{
											$.unblockUI();	
										}
										
									}
								});
							}else{							
								blockUI();
								// update quote if quoteId is present				
								$.ajax({
									type: "POST",
									url: _context +"/quote/updateQuote?quoteStatus=APPR&deleteNonGenericCharges=false"+"&chargeDeleted="+_chargeDeleted,
									data: queryString,
									success: function(responseText) {
										$("#entityVersion").val(responseText.data.entityVersion);
										showResponseMessages(responseText.messages);
										setHistoryTab(responseText);
										_isQuoteChanged = false;
										_isQuoteReplicated = false;
										_isQuoteClauseChanged = false;
										_isRatingAttributeChanged = false;
										_isChargeAttributeChanged = false;
										_isCommodityRatingAttributeChanged = false;
										setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
										jQuery("#quoteCommodityGrid").trigger('reloadGrid');
										jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
										jQuery("#specialServiceGrid").trigger('reloadGrid');
										if(!(responseText.messages.error.length > 0)){
											$.unblockUI();
											sendQuoteToIssue();	
										}else{
											$.unblockUI();	
										}
										
									}
								});
							}
						}
					}else{
						if($('#statusCode').val() != "" && $('#statusCode').val() == "PEND"){
							if ((_isCommodityRatingAttributeChanged || _isRatingAttributeChanged) 
									&& $("#quoteChargeLineGrid").getGridParam("reccount") > 0) {
								var r = confirm(confirmText);
								if (r == true) {
									blockUI();
									// update quote if quoteId is present				
									$.ajax({
										type: "POST",
										url: _context +"/quote/saveQuote?deleteNonGenericCharges=true",
										data: queryString,
										success: function(responseText) {
											$("#entityVersion").val(responseText.data.entityVersion);
											setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
											showResponseMessages(responseText.messages);
											setHistoryTab(responseText);
											_isQuoteChanged = false;
											_isQuoteReplicated = false;
											_isQuoteClauseChanged = false;
											_isRatingAttributeChanged = false;
											_isChargeAttributeChanged = false;
											_isCommodityRatingAttributeChanged = false;
											jQuery("#quoteCommodityGrid").trigger('reloadGrid');
											jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
											jQuery("#specialServiceGrid").trigger('reloadGrid');
											if(!(responseText.messages.error.length > 0)){
												$.unblockUI();
												sendQuoteToIssue();	
											}else{
												$.unblockUI();	
											}
											
										}
									});	
								}else{
									return true;
								}
							}else{
	
								blockUI();
								// update quote if quoteId is present				
								$.ajax({
									type: "POST",
									url: _context +"/quote/saveQuote?deleteNonGenericCharges=false",
									data: queryString,
									success: function(responseText) {
										$("#entityVersion").val(responseText.data.entityVersion);
										setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
										showResponseMessages(responseText.messages);
										setHistoryTab(responseText);
										_isQuoteChanged = false;
										_isQuoteReplicated = false;
										_isQuoteClauseChanged = false;
										_isRatingAttributeChanged = false;
										_isChargeAttributeChanged = false;
										_isCommodityRatingAttributeChanged = false;
										jQuery("#quoteCommodityGrid").trigger('reloadGrid');
										jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
										jQuery("#specialServiceGrid").trigger('reloadGrid');
										if(!(responseText.messages.error.length > 0)){
											$.unblockUI();
											sendQuoteToIssue();	
										}else{
											$.unblockUI();	
										}
										
									}
								});
							}
						}else{
							blockUI();
							// update quote if quoteId is present				
							$.ajax({
								type: "POST",
								url: _context +"/quote/saveQuote?deleteNonGenericCharges=false",
								data: queryString,
								success: function(responseText) {
									$("#entityVersion").val(responseText.data.entityVersion);
									setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
									showResponseMessages(responseText.messages);
									setHistoryTab(responseText);
									_isQuoteChanged = false;
									_isQuoteReplicated = false;
									_isQuoteClauseChanged = false;
									_isRatingAttributeChanged = false;
									_isChargeAttributeChanged = false;
									_isCommodityRatingAttributeChanged = false;
									jQuery("#quoteCommodityGrid").trigger('reloadGrid');
									jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
									jQuery("#specialServiceGrid").trigger('reloadGrid');
									if(!(responseText.messages.error.length > 0)){
										$.unblockUI();
										sendQuoteToIssue();	
									}else{
										$.unblockUI();	
									}
									
								}
							});	
						}
					}
				}
			}
			else{
				alert("Quote No./version has been changed. Please reload the page.");
			}
		});
/************* END - JS Code for Issue Quote *************/	
	
	$('#quoteClear').click(function() {		
		if (_isQuoteChanged || _isQuoteReplicated) {
			var r = confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r == true) {
				document.location.href = _context + '/quote/showNewForm';
			}
		} else {
			document.location.href = _context + '/quote/showNewForm';
		}
	});
	
	$('#quoteCancel').click(function() {		
		if (_isQuoteChanged || _isQuoteClauseChanged || _isQuoteReplicated) {
			var r = confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r == true) {
				document.location.href = _context + '/cas/quoteSearch.do?isRefresh=true';
			}
		} else {
			document.location.href = _context + '/cas/quoteSearch.do?isRefresh=true';
		}
	});
	
	/*
	 * 7. Commodity Scripts
	 */

	$('#commDscrAnchor').click(function(event) {
		event.preventDefault();
	});
	
	$('#showCommodityDscr').click(function() {		
		jQuery('#quoteForm').validationEngine('hideAll');
		if(isCommodityDisplayOnly && isCommodityModifiable){
			if($('#statusCode').val()=="" || $('#statusCode').val()=="PEND" || $('#statusCode').val()=="APPR") {
				if($("#isConstructed").is(":checked") && $("#quoteCommodityGrid").getGridParam("reccount") == 1){
					alert("Only 1 commodity can be added for a Constructed Quote.");
					return;
				}
				var routing = hasRoutingDetails();
				if (routing == true) {					
					showAddCommodityDialog();
				} else {					
					alert("To add commodity, Please provide routing details.");
					return;
				}
			} else {
				alert("Commodity cannot be added for this quote status");
				return;
			}	
		}
		
	});
	
	$("#closeStatusHistory").click(function() {
		$("#statusHistoryDialog").dialog('close');
	});

	
	
	refreshDates();
	
	
	//Quote Special Service
	createSpecialServiceGrid("quote");	
	
	//Security Implmentation	
	enforceSecurityOnQuote();
	tabSequence('#quoteForm',false,false);
	
	$('#QuoteFromSelection').val($('#quoteNumber').val());
	
});

function rateQuoteCall() {		
		$.ajax({
		   type: "POST",				   							   
		   url: _context +"/quote/rateQuote?optionToRate="+$("#optionToRate").val(),
		   success: function(responseText){	
				if (responseText.data.rateView == "showError") {						
					$('#re_error_dialog').dialog('open');
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					jQuery("#specialServiceGrid").trigger('reloadGrid');
					$("#ratingErrorForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					re_itemNo=responseText.data.errorMessagesForm[0].item;
					re_groupName=responseText.data.errorMessagesForm[0].groupName;
					re_tariffNo=responseText.data.errorMessagesForm[0].sourceTariffId;
				    jQuery("#reErrorGrid").trigger('reloadGrid');
					$('#reErrContinueBtn').hide();
					$('#reErrCloseBtn').show();
					calculateInchesToFtErrors(responseText.data);
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					_isQuoteChanged = false;
					_isQuoteReplicated = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
				}else if(responseText.data.rateView == "showChoice"){
					re_itemNo=responseText.data.itemNumber;
					re_tariffNo=responseText.data.tariffId;
					$('#re_choice_dialog').dialog('open');
					$("#reChoiceGrid").jqGrid("clearGridData", true).trigger("unloadGrid");
					$("#ratingChoiceForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reChEstShipDate").val(responseText.data.estimatedShipDateString);
					$("#frt").val(responseText.data.frtCharges);
					if(responseText.data.isAllChoicesUnSelectable != null 
							&& responseText.data.isAllChoicesUnSelectable == "Y"){
						$('#reChoiceCloseBtn').hide();							
					}else{
						$('#reChoiceContinueBtn').hide();	
					}											
				    jQuery("#reChoiceGrid").trigger('reloadGrid');
				    calculateInchesToFtChoices(responseText.data);
				    jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
				}else if(responseText.data.rateView == "showWarning"){											
					$('#re_error_dialog').dialog('open');		
					$(".ui-dialog-titlebar-close").hide();
					$("#ratingErrorForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					$("#reErrEstShipDate").val(responseText.data.estimatedShipDateString);
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					jQuery("#specialServiceGrid").trigger('reloadGrid');
				    jQuery("#reErrorGrid").trigger('reloadGrid');
					$('#reErrCloseBtn').hide();
					$('#reErrContinueBtn').show();
					$('#quoteForm').loadJSON(responseText.data);
					setHistoryTab(responseText);
					setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
					$("#issueQuote").removeAttr("disabled");
					showResponseMessages(responseText.messages);
					calculateInchesToFtErrors(responseText.data);
				}
				else {
					$('#quoteForm').loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					setHistoryTab(responseText);
					setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);					
					jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
					jQuery("#specialServiceGrid").trigger('reloadGrid');
					$("#issueQuote").removeAttr("disabled");
					showResponseMessages(responseText.messages);
					if(!((responseText.messages.hasOwnProperty("error") && responseText.messages.error.length > 0) || 
							(responseText.messages.hasOwnProperty("warn") && responseText.messages.warn.length > 0))){
						scrollWinBottom();
					}
					_isQuoteChanged = false;
					_isQuoteReplicated = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
				}	
				$.unblockUI();
		   }
	});
}

/**
 * END SECTION : RATE QUOTE
 */

function updateQuote(queryString) {	
	var quoteStatus = $('#statusCode').val();
	//if(_isCommodityChanged || _isChargeAttributeChanged){
	if( _isCommodityRatingAttributeChanged || _isRatingAttributeChanged/*|| _isChargeAttributeChanged*/){
		blockUI();
		$.ajax({
			type: "POST",
			url: _context +"/quote/updateQuote?quoteStatus=PEND&deleteNonGenericCharges=true"+"&chargeDeleted="+_chargeDeleted,
			data: queryString,
			success: function(responseText) {
				$("#quoteForm").loadJSON(responseText.data);
				setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
				setHistoryTab(responseText);
				showResponseMessages(responseText.messages);
				$("#entityVersion").val(responseText.data.entityVersion);
				jQuery("#quoteCommodityGrid").trigger('reloadGrid');
				jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
				jQuery("#specialServiceGrid").trigger('reloadGrid');
				_isQuoteChanged = false;
				_isQuoteReplicated = false;
				_isQuoteClauseChanged = false;
				_isRatingAttributeChanged = false;
				_isCommodityRatingAttributeChanged = false;
				_isChargeAttributeChanged = false;
				$.unblockUI();
			}
		});
	}else{
		blockUI();
		$.ajax({
			type: "POST",
			url: _context +"/quote/updateQuote?quoteStatus="+quoteStatus+"&deleteNonGenericCharges=false"+"&chargeDeleted="+_chargeDeleted,
			data: queryString,
			success: function(responseText) {
				$("#quoteForm").loadJSON(responseText.data);
				setHistoryTab(responseText);
				setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
				showResponseMessages(responseText.messages);
				$("#entityVersion").val(responseText.data.entityVersion);
				jQuery("#quoteCommodityGrid").trigger('reloadGrid');
				jQuery("#quoteChargeLineGrid").trigger('reloadGrid');
				jQuery("#specialServiceGrid").trigger('reloadGrid');
				_isQuoteChanged = false;
				_isQuoteReplicated = false;
				_isQuoteClauseChanged = false;
				_isRatingAttributeChanged = false;
				_isCommodityRatingAttributeChanged = false;
				_isChargeAttributeChanged = false;
				$.unblockUI();
			}
		});
	}
}


/*
 * Functions specific to Date Fields
 */

function setEstimatedShipDate(){	
	if($('#quoteId').val()== "")
		$("#estimatedShipDate").datepicker('setDate', new Date());	
}

function loadCharges() {
	//var queryString = $('#quoteForm').formSerialize();
	blockUI();
	$.ajax({
		type: "GET",
		url: _context +"/quote/charge/loadChargeLineGrid",
		//data: queryString,
		success: function(responseText){
			$.unblockUI();
		}
	});
	
}

/*function doorToRampSearchUpdate(id) {
	// FR_CITY|ZIP_CODE|STATE|RAMP_DESC|TRUCKER_NAME|CARRIER|RSDNTL|EQUIP|RATE|DIR|HAZ|DP|OVER_RATE|FREE_TIME|EFF_DATE|END_DATE|NOTE
	var values = id.split("|");	
	$('#level').val("C");
	$('#chargeCmdyLineNo').removeAttr("disabled");
	if($("#quoteCommodityGrid").getGridParam("reccount") == 1){
		$('#chargeCmdyLineNo').val("1");
	}
		
	$('#unit').val(1);
	$('#description').val('AD2-ADVANCE FOR DELIVERY');
	$('#rate').val(values[8]);
	$('#rateBasis').val('E');
	$('#amount').val(values[8]);
	$('#effectiveDt').val(values[14]);
	$('#expirationDt').val(values[15]);
	$('#generic').val('Y');
	$('#passThru').val('Y');
	$('#minWgt').val(0);
	$('#sourceRateNumber').val(values[17]);
}*/

function overlandSearchUpdate(id) {
	
	//OUT_ORDES,OUT_EQUIP,OUT_RATE,OUT_RB,OUT_SRCTARF,OUT_ROUCDE, OUT_ROUCDEDES, OUT_RATDES,OUT_EFFDT,OUT_EXPDT, OUT_TRRDSID
	var values = id.split("|");
	
	if($("#quoteCommodityGrid").getGridParam("reccount") == 1){
		var rateValue = "";
		var srcRateNo = 0;
		if(values[5] == null || values[5] == "" || values[5]=="null"){
			srcRateNo = 0;
		}else{
			srcRateNo = values[5]; 
		}
		if (values[2]==null || values[2] == "" || values[2]=="null") {		
			rateValue = "0.00";
		} else {		
			rateValue = values[2]+"";
		}
		var selectedRows = $("#quoteCommodityGrid").jqGrid("getGridParam", "selarrrow");
		$.ajax({
			url: _context+"/quote/charge/addChargesGrid",
			type: "POST",
			data: {sourceRateNumber:srcRateNo,
				level:"C",
				chargeCmdyLineNo:"1",
				description: "OVR-ACI ZONE PICKUP",
				unit:$("#quoteCommodityGrid").jqGrid('getCell', selectedRows[0]  , "equipmentCount" ),
				rate:rateValue,
				rateBasis:"E"
			},
			success: function(){
				_isQuoteChanged = true;			
				$("#quoteChargeLineGrid").trigger('reloadGrid');
			}
		});
	}else{
		$('#level').val("C");
		$('#chargeCmdyLineNo').removeAttr("disabled");
		if($("#quoteCommodityGrid").getGridParam("reccount") == 1){
			$('#chargeCmdyLineNo').val("1");
		}
		$('#unit').val(1);
		$('#description').val('OVR-ACI ZONE PICKUP');
		if (values[2]==null || values[2] == "" || values[2]=="null") {
			$('#rate').val("0.00");
			$('#amount').val("0.00");
		} else {
			$('#rate').val(values[2]);
			$('#amount').val(values[2]);
		}
		$('#rateBasis').val('E');
		$('#effectiveDt').val(values[8]);
		$('#expirationDt').val(values[9]);
		$('#generic').val('Y');
		$('#passThru').val('Y');
		$('#minWgt').val(0);
	}	
}

/*
 * Functions specific to Routing Details
 */
function checkForFormCondition(){
	$('#tradeCode').attr("readonly",true);
}

/*
 * Functions specific to Buttons Click
 */
function addClause() {	
	$("#quoteForm").validationEngine('detach');
	/*if (_isQuoteChanged || _isQuoteReplicated)*/
	var newQuoteString = $("#quoteId").val() + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val();
	if(quoteString == newQuoteString){
		if (_isQuoteChanged ) {
			var r = confirm("All the unsaved changes will be discarded - Do you want to proceed?");
			if (r == true) {
				if($("#quoteId").val() != ""){
					$('#quoteForm').attr("action","clause/showForm?quoteId="+$("#quoteId").val());	
				}else{
					$('#quoteForm').attr("action","clause/showForm");
				}
				
				$('#quoteForm').submit();
			}
		} else {
			if($("#quoteId").val() != ""){
				$('#quoteForm').attr("action","clause/showForm?quoteId="+$("#quoteId").val());	
			}else{
				$('#quoteForm').attr("action","clause/showForm");
			}
			
			$('#quoteForm').submit();
		}
	}
	else{
		alert("Quote No./version has been changed. Please reload the page.");
	}
}

function clearAll() {
	$('#addRolDesc').val("");
	
	clearContactDetails();	// Method in quote_commodity.js
	
	$('#loadServiceCode').val("");
	$('#dischargeServiceCode').val("");
	$('#tradeCode').val("");
	$('#blOriginCityCode').val("");
	$('#originPortCityCode').val("");
	$('#destinationPortCityCode').val("");
	$('#blDestinationCityCode').val("");
	$('#drayagePickupZipCode').val("");
	
	$('#drayagePickupZoneCode').val("");
	$('#drayageDeliveryZipCode').val("");
	$('#drayageDeliveryZoneCode').val("");
}	

function sendQuoteToIssue(){
	$("#quoteForm").attr("action", "issueQuote");
	$("#quoteForm").submit();
}

function sendQuoteToCorrect(){
	$("#quoteForm").attr("action", "correctQuote");
	$("#quoteForm").submit();
}

/*START - JS Code for Correct Quote*/
function correctQuoteForReplicateAll(){

	var statusCodeVal = $('#statusCode').val();	
	if(statusCodeVal != "ISSD" && statusCodeVal != "CNCL"){
		if (statusCodeVal == "BKGD") {
			alert ("Can't correct quote since a booking already exists");
			return;
		}
		alert ("Only ISSD (issued status) quotes can be replicated");
		return;
	}

	if (_isQuoteChanged == true) {	
		blockUI();
		var form = document.getElementById("quoteForm");
		if (FormChanges(form).length == 0 && quoteIdVal) {
			var queryString = $('#quoteForm').formSerialize();
			$.ajax({
				type: "POST",
				url: _context +"/quote/updateQuote",
				data: queryString,
				success: function(responseText) {	
					_isQuoteChanged = false;
					_isQuoteReplicated = false;
					_isQuoteClauseChanged = false;
					_isRatingAttributeChanged = false;
					_isChargeAttributeChanged = false;
					_isCommodityRatingAttributeChanged = false;
					$("#quoteForm").loadJSON(responseText.data);
					$("#entityVersion").val(responseText.data.entityVersion);
					setMeasurementSourceValue(responseText.data.unitOfMeasureSourceCode);
					setHistoryTab(responseText);
					$("#estimatedShipDate").val(responseText.data.estShipDateString);
					$("#quoteIdNumber").val($("#quoteId").val());
					quoteString = $("#quoteId").val()  + "-" + $("#quoteNumber").val() + "-" + $("#quoteVersionNumber").val(); 
					$("#entityVersion").val(responseText.data.entityVersion);
					showResponseMessages(responseText.messages);
					$.unblockUI();
				}					
			});								
		}
	} 
	
	sendQuoteToCorrect();
	
}
/*END - JS Code for Correct Quote*/
/*
 * Common Functions
 */

function removeQuoteErrorPointers() {
	$('#quoteForm').validationEngine('hideAll');
}

function disableControlsOnQuoteScreen(){
	//1. Quote Details
	$('#isConstructed').attr("disabled",true);
	$("#customerName").attr("disabled",true);
	$("#customerGroup").attr("disabled",true);
	
	$("#addressLine1").attr("disabled",true);
	$("#quoteSuite").attr("disabled",true);
	$("#cityStateZip").attr("disabled",true);
	
	$("#addRolDesc").attr("disabled",true);
	$("#referenceNumber").attr("disabled",true);
	$("#contactName").attr("disabled",true);
	$("#showOneTimeCustomerCheck").attr("disabled",true);
	$("#showOneTimeCustomer").gatesDisable();
	$('#routingDiv').gatesDisable();
	$('#equipmentDiv').gatesDisable();
	$('#commodityDiv').gatesDisable();
	$('#imperial').attr("disabled", true);
	$('#metric').attr("disabled", true);
	$('#lengthMt').attr("disabled", true);
	$('#heightMt').attr("disabled", true);
	$('#widthMt').attr("disabled", true);
	
	$('#cubicMt').attr("disabled", true);
	$('#totalCubicMt').attr("disabled", true);
	$('#weightMt').attr("disabled", true);
	$('#totalWeightMt').attr("disabled", true);
	$('#emailAddress').attr("disabled", true);
	$('#faxCountryCode').attr("disabled", true);
	$('#faxAreaCode').attr("disabled", true);
	$('#faxStation').attr("disabled", true);
	$('#faxExchange').attr("disabled", true);
	$('#phoneAreaCode').attr("disabled", true);
	$('#phoneExchange').attr("disabled", true);
	$('#phoneStation').attr("disabled", true);
	$('#phoneExtension').attr("disabled", true);
	$('#phoneCountryCode').attr("disabled", true);
}


function FormChanges(form) {

 // get form
	if (typeof form == "string") form = document.getElementById(form);
	if (!form || !form.nodeName || form.nodeName.toLowerCase() != "form") 
	return null;
	// find changed elements
	var changed = [], n, c, def, o, ol, opt;
	for (var e = 0, el = form.elements.length; e < el; e++) {
		n = form.elements[e];
		c = false;
		switch (n.nodeName.toLowerCase()) {

			// select boxes
			case "select":
				def = 0;
				for (o = 0, ol = n.options.length; o < ol; o++) {
					opt = n.options[o];
					c = c || (opt.selected != opt.defaultSelected);
					if (opt.defaultSelected) def = o;
				}
				if (c && !n.multiple) c = (def != n.selectedIndex);
				break;
			// input / textarea
			case "textarea":
			case "input":
				switch (n.type.toLowerCase()) {
					case "checkbox":
					case "radio":
						// checkbox / radio
						c = (n.checked != n.defaultChecked);
						break;
					default:
						// standard values
						c = (n.value != n.defaultValue);
						break;			
				}
				break;
		}
		if (c){ 
			changed.push(n);
		}
	}
	return changed;	
}

function hasRoutingDetails() {
	var routing = true;
	if ($("#loadServiceCode").val() == "") {
		routing = false;
	}
	if ($("#dischargeServiceCode").val() == "") {
		routing = false;
	}
	if ($("#estimatedShipDate").val() == "") {
		routing = false;
	}
	if ($("#originPortCityCode").val() == "") {
		routing = false;
	}
	if ($("#destinationPortCityCode").val() == "") {
		routing = false;
	}
	return routing;

}

function setHistoryTab(responseText) {
	if (responseText.data.createUser != null) {
		$('#createUser').val(responseText.data.createUser);
	}
	if (responseText.data.createDate != null) {
		$('#createDate').val(getDate(new Date(responseText.data.createDate)));
	}

	if (responseText.data.pendingUser != null) {
		$('#pendingUser').val(responseText.data.pendingUser);
	}
	if (responseText.data.pendingDate != null) {
		$('#pendingDate').val(getDate(new Date(responseText.data.pendingDate)));
	}

	if (responseText.data.approveUser != null) {
		$('#approveUser').val(responseText.data.approveUser);
	}
	if (responseText.data.approveDate != null) {
		$('#approveDate').val(getDate(new Date(responseText.data.approveDate)));
	}

	if (responseText.data.issuedUser != null) {
		$('#issuedUser').val(responseText.data.issuedUser);
	}
	if (responseText.data.issuedDate != null) {
		$('#issuedDate').val(getDate(new Date(responseText.data.issuedDate)));
	}

	if (responseText.data.bookedUser != null) {
		$('#bookedUser').val(responseText.data.bookedUser);
	}
	if (responseText.data.bookedDate != null) {
		$('#bookedDate').val(getDate(new Date(responseText.data.bookedDate)));
	}

	if (responseText.data.lastUpdateUser != null) {
		$('#lastUpdateUser').val(responseText.data.lastUpdateUser);
	}
	if (responseText.data.lastUpdateDate != null) {
		$('#lastUpdateDate').val(
				getDate(new Date(responseText.data.lastUpdateDate)));
	}
}

function getDate(Date){
	return (formatDatePattern(new String(Date.getMonth()+1))+"-"+formatDatePattern(new String(Date.getDate()))+"-"+Date.getFullYear());
	
}
function formatDatePattern(a){
	if(a.length < 2){
		return "0"+a;
	}
	else{
	 return	a;
	}
}

function breakCityCode(cityName){
	var values=cityName.split("-");
	return values[0];
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'QUOT',
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

function enforceSecurityOnQuote(){
	//Customer
	_enforceSecuritySection('customerDiv', 'customerMainDiv', isCustomerDisplay,isCustomerModifiable);
	
	//Routing
	_enforceSecuritySection('routingDiv', 'routingMainDiv', isRoutingDisplay,isRoutingModifiable);
	
	/*Commodity*/
	_enforceSecuritySection('commodityLine', 'commodityDivGrid', isCommodityDisplayOnly, isCommodityModifiable);
	
	/*Special Services*/
	_enforceSecuritySection('specialServicesLine', 'specialServicesDivGrid', isSpecialServiceDisplayOnly, isSpecialServiceModifiable);
	
	/*Charges */
	_enforceSecuritySection('chargeLine', 'chargeDivGrid', isChargeDisplay, isChargeModifiable);
	
	/*Door to Ramp*/
	/*enforceSecurityDivAndButtons('openDoorRampDiv',isDoorToRampListDisplayOnly);*/
	
	/*Overland Ramp*/
	enforceSecurityDivAndButtons('openOverlandDiv',isOverlandChargeListDisplayOnly);
}

function _enforceSecuritySection(sectionId, sectionName, _displayOnly, _modifiableOnly){
	if(_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(_displayOnly && !_modifiableOnly){
		disableSection(sectionId);
	}else if(!_displayOnly && _modifiableOnly){
		enableSection(sectionId);
	}else if(!_displayOnly && !_modifiableOnly){
		hideSection(sectionName);
	}
}

function enforceSecurityDivAndButtons(selector, _enabled){
	if(_enabled){
		$("#"+selector).css('visibility','visible');
	}else{
		$("#"+selector).css('visibility','hidden');
	}
}

function disableSection(sectionId){
	$('#'+sectionId).gatesDisable();
}

function enableSection(sectionId){
	$('#'+sectionId).gatesEnable();
}
function hideSection(sectionName){
	$('#'+sectionName).hide();
}

function collapseAll(){
	 jQuery('#quoteForm').validationEngine('hideAll');
	 $('.ui-accordion-content').attr('style','display:none');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top').removeClass('ui-state-active').
	 removeClass('ui-corner-top').addClass('ui-state-default').addClass('ui-corner-all');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all span').removeClass('ui-icon-triangle-1-s')
	 .addClass('ui-icon-triangle-1-e');
}
function expandAll(){
	 jQuery('#quoteForm').validationEngine('hideAll');
	 $('.ui-accordion-content').attr('style','display:block');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all').removeClass('ui-state-default').
	 removeClass('ui-corner-all').addClass('ui-state-active').addClass('ui-corner-top');
	 $('.ui-accordion-header.ui-helper-reset.ui-state-active.ui-corner-top span').removeClass('ui-icon-triangle-1-e')
	 .addClass('ui-icon-triangle-1-s');
	 window.scrollTo(0, 0);
}
function setAccordianTabDetails(id,displayText){$("#"+id).text(displayText);}

function setRoutingHeader()
{
	var displayText = " ";
	
	var loadService = "";
	if($('#loadServiceCode :selected').val()!='')
		loadService = " - " + $('#loadServiceCode option:selected').text();
	var dischargeService = "";
	if($('#dischargeServiceCode :selected').val()!='')
		dischargeService = " - " + $('#dischargeServiceCode option:selected').text();
	
	var cities = "";
	if($('#blOriginCityCode').val()!='')
		cities = $('#blOriginCityCode').val();
	if($('#originPortCityCode').val()!='')
	{
		if(cities=='')
			cities = $('#originPortCityCode').val();
		else
			cities = cities + " - " + $('#originPortCityCode').val();
	}
	if($('#destinationPortCityCode').val()!='')
	{
		if(cities=='')
			cities = $('#destinationPortCityCode').val();
		else
			cities = cities + " - " + $('#destinationPortCityCode').val();
	}
	if($('#blDestinationCityCode').val()!='')
	{
		if(cities=='')
			cities = $('#blDestinationCityCode').val();
		else
			cities = cities + " - " + $('#blDestinationCityCode').val();
	}
	if(cities!='')
		cities = " | " + cities;
	
	var shipmentDate = "";
	if($('#estimatedShipDate').val()!="")
		shipmentDate = " | " + $('#estimatedShipDate').val();
	
	displayText = displayText + loadService + dischargeService + cities + shipmentDate;
	setAccordianTabDetails('routingHeader', displayText);	
}

function setCommodityTabDetails(commodityCount){
	
	var rowIDs = jQuery("#quoteCommodityGrid").getDataIDs(); 
	var commodityDisplayText = "";
	for (var i=0;i<rowIDs.length;i=i+1)
    {
		var rowData=jQuery("#quoteCommodityGrid").getRowData(rowIDs[i]);
		var tariffCode = rowData.tariffNumber;
		var itemCode = rowData.tariffServiceItemCode;
		var commodityCode = rowData.customerCommodityDescription;
		
		
		tariffCode = tariffCode + "";
		itemCode = itemCode + "";
		commodityCode = commodityCode + "";
		if(commodityCode.trim().length == 0){
			commodityCode = rowData.tariffCommodityDescription;
		}
		if(commodityDisplayText=='')
			commodityDisplayText = tariffCode + "|" + itemCode + "|" + commodityCode;
		else
			commodityDisplayText = commodityDisplayText + ", " + tariffCode + "|" + itemCode + "|" + commodityCode;
    }
	if(commodityDisplayText!="")
		commodityDisplayText = " - " + commodityDisplayText;
	setAccordianTabDetails('maintainQuoteCommodityId',commodityDisplayText);

}

function setCommodityTabDetailsOnEdit(commodityCount, custCommodityDesc, tariffCmdtyDesc){
	if(commodityCount==0){
		setAccordianTabDetails('maintainQuoteCommodityId', "");
	}
	var commodityDisplayText = " - ";
	var i=0;
	if(commodityCount>0){
		while(i<commodityCount){
			i = i + 1;
			if(i != 1){
				commodityDisplayText = commodityDisplayText + ", ";
			}
			var firstRowData = jQuery("#quoteCommodityGrid").getRowData(i);
			if(firstRowData.tariffNumber!='undefined' && firstRowData.tariffNumber!=null && $.trim(firstRowData.tariffNumber)!=''){
				commodityDisplayText = commodityDisplayText + firstRowData.tariffNumber + " | ";
			}
			
			if(firstRowData.tariffServiceItemCode!='undefined' && firstRowData.tariffServiceItemCode!=null && $.trim(firstRowData.tariffServiceItemCode)!=''){
				commodityDisplayText = commodityDisplayText + firstRowData.tariffServiceItemCode + " | ";
			}
			commodityDisplayText = commodityDisplayText + (custCommodityDesc!=''&&custCommodityDesc!=null?custCommodityDesc:tariffCmdtyDesc);
		}
		setAccordianTabDetails('maintainQuoteCommodityId', commodityDisplayText);
	}
}

function setCommodityTabDetailsOnAdd(commodityCount, custCommodityDesc, tariffCmdtyDesc){
	
	var commodityDisplayText = " - ";
	var i=0;
	if(commodityCount>0){
		while(i<commodityCount){
			i = i + 1;
			if(i != 1){
				commodityDisplayText = commodityDisplayText + ", ";
			}
			var firstRowData = jQuery("#quoteCommodityGrid").getRowData(i);
			if(firstRowData.tariffNumber!='undefined' && firstRowData.tariffNumber!=null && $.trim(firstRowData.tariffNumber)!=''){
				commodityDisplayText = commodityDisplayText + firstRowData.tariffNumber + " | ";
			}	
			
			if(firstRowData.tariffServiceItemCode!='undefined' && firstRowData.tariffServiceItemCode!=null && $.trim(firstRowData.tariffServiceItemCode)!=''){
				commodityDisplayText = commodityDisplayText + firstRowData.tariffServiceItemCode + " | ";
			}
			commodityDisplayText = commodityDisplayText + (custCommodityDesc!=''&&custCommodityDesc!=null?custCommodityDesc:tariffCmdtyDesc);
		}
	}
	if(commodityDisplayText != " - "){
		commodityDisplayText = commodityDisplayText + ", ";
	}
	
	if($("#tariffNo").val()!='undefined' && $("#tariffNo").val()!=null && $.trim($("#tariffNo").val())!=''){
		commodityDisplayText = commodityDisplayText + $("#tariffNo").val() + " | ";
	}
	
	if($("#itemNo").val()!='undefined' && $("#itemNo").val()!=null && $.trim($("#itemNo").val())!=''){
		commodityDisplayText = commodityDisplayText + $("#itemNo").val() + " | ";
	}
	
	commodityDisplayText = commodityDisplayText + (custCommodityDesc!=''&&custCommodityDesc!=null?custCommodityDesc:tariffCmdtyDesc);
	setAccordianTabDetails('maintainQuoteCommodityId', commodityDisplayText);
	
}

function setMeasurementSourceValue(val){
	if(val == 'I'){
		$("#imperial").attr("checked", true);
		$("#metric").removeAttr("checked");
	}else if(val == 'M'){
		$("#metric").attr("checked", true);
		$("#imperial").removeAttr("checked");
	}
}

function checkQuote(){
	var flag = true;
	blockUI();
	var quoteNo = $('#quoteNumber').val();
	$.ajax({
		type: "GET",
		async: false,
		url: _context + "/quote/findIfQuoteExists?quoteNumber=" + quoteNo ,
		success: function(responseText){
			   if(responseText.data == ""){
				   flag = false;
				   $.unblockUI();
			   }
			   else{
				   document.location.href=_context+'/quote/getQuote?quoteId='+responseText.data;
			   }
			}
		});
		return flag;
}

function doMandatoryChecks(){
	var ismailAndFaxCheck = true;
	if(($("#showOneTimeCustomerCheck").is(":checked") == true 
			||($("#customerName").val() != "" && $("#addRolDesc").val())) 
			&& ((($("#contactId").val() != null && $("#contactId").val().trim().length > 0)|| 
					$("#contactFirstName").val() != "" || 
					$("#contactLastName").val() != ""))){
		if($("#phoneCountryCode").val().trim() == "" && $("#phoneAreaCode").val().trim() == ""
			&& $("#phoneExchange").val().trim() == "" && $("#phoneStation").val().trim() == ""){
			openCustomerDivBlock();
			$('#phoneCountryCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			openCustomerDivBlock();
			$('#phoneAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			openCustomerDivBlock();
			$('#phoneExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			openCustomerDivBlock();
			$('#phoneStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
			return false;			
		}
		
		if($("#phoneCountryCode").val().trim() == "" || $("#phoneCountryCode").val().trim() == "1"
			|| $("#phoneCountryCode").val().trim() == "01"){
			if($("#phoneAreaCode").val().trim() == "" || $("#phoneAreaCode").val().trim().length != 3){
				if($("#phoneAreaCode").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;	
				}else{
					openCustomerDivBlock();
					$('#phoneAreaCode').validationEngine('showPrompt', 'Area Code is always a 3 digit number.', 'error', 'topRight', true);
					return false;
				}
			}
			if($("#phoneExchange").val().trim() == "" || $("#phoneExchange").val().trim().length != 3){
				if($("#phoneExchange").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;	
				}else{
					openCustomerDivBlock();
					$('#phoneExchange').validationEngine('showPrompt', 'Exchange Code is always a 3 digit number.', 'error', 'topRight', true);
					return false;
				}
				
			}
			if($("#phoneStation").val().trim() == "" || $("#phoneStation").val().trim().length != 4){
				if($("#phoneStation").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;
				}else{
					openCustomerDivBlock();
					$('#phoneStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
					return false;
				}
				
			}
		}else{
			if($("#phoneAreaCode").val().trim() == "" || $("#phoneAreaCode").val().trim().length < 2 
					|| $("#phoneAreaCode").val().trim().length > 4){
				if($("#phoneAreaCode").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;	
				}else{
					openCustomerDivBlock();
					$('#phoneAreaCode').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
					return false;
				}
			}
			if($("#phoneExchange").val().trim() == "" || $("#phoneExchange").val().trim().length < 3 
					|| $("#phoneExchange").val().trim().length > 4 ){
				if($("#phoneExchange").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;	
				}else{
					openCustomerDivBlock();
					$('#phoneExchange').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number.', 'error', 'topRight', true);
					return false;
				}
				
			}
			if($("#phoneStation").val().trim() == "" || $("#phoneStation").val().trim().length != 4){
				if($("#phoneStation").val().trim() == ""){
					openCustomerDivBlock();
					$('#phoneStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
					return false;
				}else{
					openCustomerDivBlock();
					$('#phoneStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
					return false;
				}
			}
		}
		if($("#emailAddress").val().trim() == "" && $("#faxCountryCode").val().trim() == "" && $("#faxAreaCode").val().trim() == ""
			&& $("#faxExchange").val().trim() == "" && $("#faxStation").val().trim() == ""){
				ismailAndFaxCheck = false;
		}
		
		
		if($("#emailAddress").val().trim() == ""){
			if($("#faxCountryCode").val().trim() == "" && $("#faxAreaCode").val().trim() == ""
				&& $("#faxExchange").val().trim() == "" && $("#faxStation").val().trim() == ""){				
				/*if($("#ldspGroupCode").val().trim() == "CY"){
					$('#msgDiv').html("<div class=\"message_error\">Please Provide Either Fax Number or Email Details</div>");
					$('#msgDiv').show();
					return false;
				}
				else{
					return true;
				}*/
			}if(ismailAndFaxCheck){
				if($("#faxCountryCode").val().trim() == "" || $("#faxCountryCode").val().trim() == "1"
					|| $("#faxCountryCode").val().trim() == "01"){
					if($("#faxAreaCode").val().trim() == "" || $("#faxAreaCode").val().trim().length != 3){
						if($("#faxAreaCode").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;	
						}else{
							openCustomerDivBlock();
							$('#faxAreaCode').validationEngine('showPrompt', 'Area Code is always a 3 digit number.', 'error', 'topRight', true);
							return false;
						}
					}
					if($("#faxExchange").val().trim() == "" || $("#faxExchange").val().trim().length != 3){
						if($("#faxExchange").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;	
						}else{
							openCustomerDivBlock();
							$('#faxExchange').validationEngine('showPrompt', 'Exchange Code is always a 3 digit number.', 'error', 'topRight', true);
							return false;
						}
						
					}
					if($("#faxStation").val().trim() == "" || $("#faxStation").val().trim().length != 4){
						if($("#faxStation").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;
						}else{
							openCustomerDivBlock();
							$('#faxStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
							return false;
						}
						
					}
				}else{
					if($("#faxAreaCode").val().trim() == "" || $("#faxAreaCode").val().trim().length < 2 
							|| $("#faxAreaCode").val().trim().length > 4){
						if($("#faxAreaCode").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;	
						}else{
							openCustomerDivBlock();
							$('#faxAreaCode').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
							return false;
						}
					}
					if($("#faxExchange").val().trim() == "" || $("#faxExchange").val().trim().length < 3 
							|| $("#faxExchange").val().trim().length > 4 ){
						if($("#faxExchange").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;	
						}else{
							openCustomerDivBlock();
							$('#faxExchange').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number.', 'error', 'topRight', true);
							return false;
						}
						
					}
					if($("#faxStation").val().trim() == "" || $("#faxStation").val().trim().length != 4){
						if($("#faxStation").val().trim() == ""){
							openCustomerDivBlock();
							$('#faxStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
							return false;
						}else{
							openCustomerDivBlock();
							$('#faxStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
							return false;
						}
					}
				}
			}
			
			if($('#preferMail').is(':checked')){
				openCustomerDivBlock();
				$('#emailAddress').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
				return false;
			}						
		}else if($("#faxCountryCode").val().trim() == "" && $("#faxAreaCode").val().trim() == ""
				&& $("#faxExchange").val().trim() == "" && $("#faxStation").val().trim() == ""){			
			if($('#preferFax').is(':checked')){
				openCustomerDivBlock();
				$('#faxCountryCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
				openCustomerDivBlock();
				$('#faxAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
				openCustomerDivBlock();
				$('#faxExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
				openCustomerDivBlock();
				$('#faxStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
				return false;
			}
		}else if(!$("#faxCountryCode").val().trim() == "" || !$("#faxAreaCode").val().trim() == ""
			|| !$("#faxExchange").val().trim() == "" || !$("#faxStation").val().trim() == ""){
			if($("#faxCountryCode").val().trim() == "" || $("#faxCountryCode").val().trim() == "1"
				|| $("#faxCountryCode").val().trim() == "01"){
				if($("#faxAreaCode").val().trim() == "" || $("#faxAreaCode").val().trim().length != 3){
					if($("#faxAreaCode").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;	
					}else{
						openCustomerDivBlock();
						$('#faxAreaCode').validationEngine('showPrompt', 'Area Code is always a 3 digit number.', 'error', 'topRight', true);
						return false;
					}
				}
				if($("#faxExchange").val().trim() == "" || $("#faxExchange").val().trim().length != 3){
					if($("#faxExchange").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;	
					}else{
						openCustomerDivBlock();
						$('#faxExchange').validationEngine('showPrompt', 'Exchange Code is always a 3 digit number.', 'error', 'topRight', true);
						return false;
					}
					
				}
				if($("#faxStation").val().trim() == "" || $("#faxStation").val().trim().length != 4){
					if($("#faxStation").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;
					}else{
						openCustomerDivBlock();
						$('#faxStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
						return false;
					}
					
				}
			}else{
				if($("#faxAreaCode").val().trim() == "" || $("#faxAreaCode").val().trim().length < 2 
						|| $("#faxAreaCode").val().trim().length > 4){
					if($("#faxAreaCode").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxAreaCode').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;	
					}else{
						openCustomerDivBlock();
						$('#faxAreaCode').validationEngine('showPrompt', 'Area Code is a 2 to 4 digit number.', 'error', 'topRight', true);
						return false;
					}
				}
				if($("#faxExchange").val().trim() == "" || $("#faxExchange").val().trim().length < 3 
						|| $("#faxExchange").val().trim().length > 4 ){
					if($("#faxExchange").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxExchange').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;	
					}else{
						openCustomerDivBlock();
						$('#faxExchange').validationEngine('showPrompt', 'Exchange Code is a 3 or 4 digit number.', 'error', 'topRight', true);
						return false;
					}
					
				}
				if($("#faxStation").val().trim() == "" || $("#faxStation").val().trim().length != 4){
					if($("#faxStation").val().trim() == ""){
						openCustomerDivBlock();
						$('#faxStation').validationEngine('showPrompt', '*This field is required.', 'error', 'topRight', true);
						return false;
					}else{
						openCustomerDivBlock();
						$('#faxStation').validationEngine('showPrompt', 'Station Code is always a 4 digit number.', 'error', 'topRight', true);
						return false;
					}
				}
			}
		}
	}else{
		//Added for Defect D027160
		if(($("#showOneTimeCustomerCheck").is(":checked") == true 
				||($("#customerName").val() != "" && $("#addRolDesc").val() != ""))){
				$('#msgDiv').html("<div class=\"message_error\">Please Provide Contact Name</div>");
				$('#msgDiv').show();
				return false;
			}
		//Commented for Defect D027160
		/*if(!(($("#contactName").val() != null && $("#contactName").val().trim().length > 0)|| 
				$("#contactFirstName").val() != "" || 
				$("#contactLastName").val() != "")){
			$('#msgDiv').html("<div class=\"message_error\">Please Provide Contact Name</div>");
			$('#msgDiv').show();
			return false;  
		} */
	}
	return true;
}

function setServiceDescriptionTitle(){
	
	if($("#loadServiceCode").get(0) != undefined){
		var loadServiceSize = $("#loadServiceCode").get(0).length;
		for(var i=0; i<loadServiceSize; i++){
			var codeJS = $("#loadServiceCode").get(0).options[i].value;
			if(codeJS != ""){
				$('#serviceDescriptions option').each(function(){
					var code = this.text.split(",")[0];
					var description = this.text.split(",")[1];
					if(code.split("=")[1] == codeJS){
						$("#loadServiceCode").get(0).options[i].title = codeJS + '-' + description.split("=")[1];
					}				
				});
			}
		}
	}
	
	if($("#dischargeServiceCode").get(0) != undefined){
		var loadServiceSize = $("#dischargeServiceCode").get(0).length;
		for(var i=0; i<loadServiceSize; i++){
			var codeJS = $("#dischargeServiceCode").get(0).options[i].value;
			if(codeJS != ""){
				$('#serviceDescriptions option').each(function(){
					var code = this.text.split(",")[0];
					var description = this.text.split(",")[1];
					if(code.split("=")[1] == codeJS){
						$("#dischargeServiceCode").get(0).options[i].title = codeJS + '-' +description.split("=")[1];
					}				
				});
			}
		}
	}
}

function setZipCodeOnScreen(){
	$('#zipCustomer').val($('#zipCode').val());
}

function openCustomerDivBlock(){
	document.getElementById('customerMainDiv').style.display = 'block';
	window.scrollTo(0, 180);
}
function setQuoteTitle(quoteId, quoteNumber, quoteVersion){
		
	var quoteTitle = $('title').text().split("-");
	var finalTitle = quoteTitle[0];
	if(quoteNumber!=null && quoteNumber!=''){
		finalTitle = finalTitle+" - "+quoteNumber;
		if(quoteVersion!=null && quoteVersion!=''){
			finalTitle = finalTitle+" - "+quoteVersion;
		}
	}else if(quoteId!=null && quoteId!=''){
		finalTitle = finalTitle+" - "+quoteId;
	}
	quoteString = quoteId + "-" + quoteNumber + "-" + quoteVersion; 

	document.title = finalTitle;
}

function openSendAlerts() {
	console.log("openSendAlerts");

	var kickerColNames = ['Id', 'Category', 'Customer Group', 'Name', 'Description', 'Subject Line', 'From', 'To', 'isHtml', 'CC', 'Create User', 'Create Date', 'User', 'Update Date'];

	var kickerColModel = [
	     	       {name:'templateId', hidden:true, width:25},
	     	       {name:'category', hidden:false, width:90},
	     	        {name:'customerGroups', hidden:false, width:100},
	     	       {name:'name', hidden:false},
	     	       {name:'description', hidden:false},
	     	       {name:'emailSubject', hidden:false},
	     	       {name:'emailFrom', hidden:true},
	     	       {name:'emailTo', hidden:false},
	     	       {name:'isHtml', hidden:true},
	     	       {name:'emailCC', hidden:true},
	     	       {name:'createUser', hidden:true},
	     	       {name:'createDate', hidden:true},
	     	       {name:'lastUpdateUser', hidden:true},
	     	       {name:'lastUpdateDate', hidden:true, "formatter":"date"}
				];
	
	var jsonReaderReference = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"templateId"
		};
	
	$('#sendKickerGrid').jqGrid({        
	   	url:_context+'/booking/loadEmailTemplates?module=Quote',
		datatype: "json",
	   	colNames:kickerColNames,
	   	colModel:kickerColModel,
	   	rowNum:10,
	   	pager: '#sendKickerPager',
	    viewrecords: true,
	    caption:'Templates',
	    sortName: 'templateId',
	    sortorder: "desc",
	    loadonce: true,
	    jsonReader : jsonReaderReference,
	    height: "100%",
	    multiselect: true,
	    beforeSelectRow: function(rowid, e){
	        jQuery("#sendKickerGrid").jqGrid('resetSelection');
	        return(true);
	    }
	}).navGrid("#sendKickerPager",{edit:false,add:false,del:false});
	
	$("#kickerTemplatesDivDialog").dialog('open');
}

function applyAndSendKicker(templateId) {
	
	blockUI();
	var urlStr = _context +"/quote/getQuoteKickerSource?quoteId="+$('#quoteId').val()+"&templateId="+templateId;
	$.ajax({
		type: "GET",
		url: urlStr,
		dataType:'json',
		success: function(responseData){
			
			//var length = responseData.data.length ? parseInt(responseData.data.length) : 9999;
			
			var key = "body=";
			var start = responseData.data.mailto.indexOf(key) + key.length;
			var toEncode = responseData.data.mailto.substring(start);
			var noEncode = responseData.data.mailto.substring(0,start);
			var fullMailTo = noEncode + encodeURIComponent(toEncode);
			
			var length = fullMailTo.length;
			
			if (responseData.data.isHtml == 'true' || length > 1500) {

				console.log ('openSendQuoteKicker called. templateId:' + templateId);
				$("#kickerTemplatesDivDialog").dialog('close'); // close templates grid
				$("#sendKickerDivDialog").dialog('open'); // opens SendEmail overlay
				
				if ($('#sendKickerDivDialog-isHtml').val() == 'true') { // if previous email was HTML, then reset Body
					$('#sendKickerDivDialog-emailBody').elrte('destroy');
					$('#sendKickerDivDialog-bodyContainer').html("<textarea id='sendKickerDivDialog-emailBody' style='width:950px;height:400px;'></textarea>");	
				} else {
					$('#sendKickerDivDialog-emailBody').val(''); // clear out	
				}

				$('#sendKickerDivDialog-form input[type=text]').val(''); // clear out form fields
				$('#sendKickerDivDialog-form input[type=hidden]').val(''); // clear out form fields
								
				if (responseData.data.isHtml == 'true') {
					var opts = {
							cssClass : 'el-rte',
							height : 400,
							width : 900,
							toolbar : 'web2pyToolbar',
							cssfiles : [ 'elrte-1.3/css/elrte-inner.css' ]
						}
					$("#sendKickerDivDialog-emailBody").elrte(opts).elrte('val', responseData.data.emailBody);	
				} else {
					$("#sendKickerDivDialog-emailBody").val(responseData.data.emailBody);
				}
				
				$('#sendKickerDivDialog-emailTo').val(responseData.data.emailTo);
				$('#sendKickerDivDialog-emailSubject').val(responseData.data.emailSubject);
				$('#sendKickerDivDialog-emailCc').val(responseData.data.emailCc);
				$('#sendKickerDivDialog-quoteId').val(responseData.data.quoteId);
				$('#sendKickerDivDialog-templateId').val(responseData.data.templateId);
				$('#sendKickerDivDialog-isHtml').val(responseData.data.isHtml);
				
			} else {

 				$('#sendKickerHref').attr("href",noEncode + encodeURIComponent(toEncode));
				$('#sendKickerHref')[0].click();	
			}

			$.unblockUI();
		},
		error: function(jqXHR,textStatus,errorThrown) {
			$.unblockUI();
			alert("Error getting template "+textStatus);
		}
	});
}

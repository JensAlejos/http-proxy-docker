var updateEquipmentErrorOccurred = false;
var equipmentUpdated = false;

$(document).ready(function () {	
	var colNamesGrid = ['Id','transient','subVariance','freightEquipRqmtId','Booked Quantity','EquipmentType','E/F','Received','','Actions'];
	var  colModelGrid= [
			   		{name:'seqNo', label: 'seqNo', index:'seqNo', hidden:true},
			   		{name:'transient', label: 'transient', index:'seqNo', hidden:true},
			   		{name:'subVariance', label: 'subVariance', index:'seqNo', hidden:true},
			   		{name:'freightEquipRqmtId', index:'freightEquipRqmtId', hidden:true},
			 		
			   		{name:'quantityRequested', index:'quantityRequested', width:75, editable:true,editoptions: {maxlength: 3},  
			   			editrules:{
			   				required:true,
	                		custom:true,
				   		    custom_func:function (value, colname) {
		            			if(!/^[0-9]+$/.test($.trim(value))){
		            				return [false,colname+ ": Only numerics allowed."];
		            			}else{
									return [true,""];
								}
				   		    }
			   			}
			   		},
 			   		{name:'planEquipTypeCode', index:'planEquipTypeCode', width:125,editable:true, 
			   			editoptions: {maxlength: 3},  
			   			editrules:{
			   				required:true,
	                		custom:true,
				   		    custom_func:function (value, colname) {
		            			if(!/^[0-9]+$/.test($.trim(value))){
		            				return [true,""];
		            			}else{
									return [true,""];
								}
				   		    }
			   			}
			   		},
			   		{name:'emptyFullCode', index:'emptyFullCode', width:125, editable:true},
			   		{name:'received', index:'received', width:75, editable:false},
			   		{name:'multipleComodity', label: 'multipleComodity',hidden:true},
			   		{name:'actions', index:'actions', width:100, align:"center", formatter:'actions', formatoptions:{
			   			keys:true,
			   			url: _context+'/containerVariance/editContainerizedGrid', 
			   			
			   			onEdit:function(dataId) {
			   				console.log('edit '+dataId);
			   				var dataIDs = jQuery('#containerizedGrid').getDataIDs();
			   				var rowId = 0;
			   				for (; rowId < dataIDs.length ; rowId++) {
			   					if(dataId == dataIDs[rowId]) break;
			   				}
			   				if(rowId < dataIDs.length) {
			   					$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').hide();
								$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-del').show();
								$('#containerizedGrid').setCell(dataId,'transient','0');
			   				}
								
			             },
			   			afterSave: function() {
							$("#containerizedGrid").trigger('reloadGrid');
							$('#isUpdate').val("true");
							$('#isGridUpdate').val("false");
							return true;
						},
						afterRestore:function(){ 
							$('#isGridUpdate').val("false");
							$("#containerizedGrid").trigger('reloadGrid');
							return true;
						}
			   		}},
			   	];
	var jsonReader = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "seqNo"
		};
	$('#containerizedGrid').gatesGrid({
		caption: "Equipment Variance",
		colNames: colNamesGrid,
		colModel: colModelGrid,
		jsonReader: jsonReader,
		pager: '#containerizedPagerGrid',
		rowNum: 3,
		rowList: [3,6,9],
		height: 83,
		multiselect:true,
		gatesOptions: {
			urls: {load: _context+'/containerVariance/loadContainerizedGrid', 
				   edit: _context+'/containerVariance/editContainerizedGrid', 
				   del:  _context+'/containerVariance/deleteFrtEqpRqmt'},
			loadComplete: customloadLoad,
			controls: {
				navBarAdd: false,
				navBarEdit: false,
				navBarDelete: false
			}
		},
		onSelectRow: function(rowId){
			var selectedRow = jQuery("#containerizedGrid").getGridParam('selrow');
			var isDisabled = $('#jqg_containerizedGrid_'+selectedRow).attr('disabled');
			if(isDisabled == 'disabled'){
				 $('#jqg_containerizedGrid_'+selectedRow).removeAttr('checked');
				 $('#'+'containerizedGrid'+' tbody tr#'+selectedRow+"'").removeClass("ui-state-highlight");
			}
		},
		delOptions: {
            onclickSubmit: function(rp_ge, rowid) {
            	return deleteEquipment(rowid);
            },
        }
	});
		
	$('#containerVarianceForm').validationEngine('attach');

	$('#containerNumber').bind('keydown',function(event) {
		// keyCode for enter key is 13
		if (event.keyCode == 13 || event.keyCode == 9) {
				displayConatinerDtls("C");
		}
	});	
	
	$('#containerNumber').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: 'Container Number',
	 	extraParams: {
		 		 method: 'searchContainer',
		 		 searchType: '288',
	 	},
		minLength: 10,
		formatItem: function(data) {
			return data.contNo;
		},
		formatResult: function(data) {
			return data.contNo;
		}, 
		select: function(data) {
			displayConatinerDtls("C");
		}
	});
	$('#approveBooking').attr("disabled","disabled");	
	$('#approveBooking').click(function(){
		 approveBooking();
	});
	 
	$('#containerMaintenance').click(function(){
		var bookingNo=$('#shippingIdHeaderDiv').text();
		if(bookingNo == ''){
			bookingNo = $('#bookingId').val();
		}
		if(bookingNo != null && bookingNo != ""){
			if($('#tradeDiv').text().substr(0,1) == 'F'){
				document.location.href = _context+ '/containerBilling/showForm?header.shipmentNumber='+bookingNo;
			}else{
				document.location.href = _context + '/receivedContainer/showForm?header.shipmentNumber='+bookingNo;
			}
			
		}
		else{
			alert('Booking Details Not Found');
		}
	});
	if($('#source').val() == '' ||$('#source').val()== null || $('#source').val() == 'C'){
		$('#containerExit').hide();
	
	}
	$('#containerExit').click(function(){
		var source = $('#source').val();
		var bookingNo=$('#shippingIdHeaderDiv').text();
		if(bookingNo == ''){
			bookingNo = $('#bookingId').val();
		}
		if(source != null && source != ""  && source != 'C'){
			if($('#isUpdate').val()== 'true'){
				var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
				if (isConfirm) {
					document.location.href = _context +'/cas/containerListbyBookingSearch.do?bookingId='+bookingNo;
				}
				else{
					return;
				}
			}
			else{
				document.location.href = _context +'/cas/containerListbyBookingSearch.do?bookingId='+bookingNo;
			}
		}/*else{
			var bookingNo=$('#shippingIdHeaderDiv').text();
			if(bookingNo == ''){
				bookingNo = $('#bookingId').val();
			}
			if(bookingNo!=null && bookingNo!=""){
				if($('#isUpdate').val()== 'true'){
					var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
					if (isConfirm) {
						document.location.href = _context +'/cas/containerListbyBookingSearch.do?bookingId='+bookingNo;
					}
					else{
						return;
					}
				}
				else{
					document.location.href = _context +'/cas/containerListbyBookingSearch.do?bookingId='+bookingNo;
				}
			}else{
				alert('Booking Details Not Found');
			}
		}*/
		
	});
	
	$('#vvdButton').click(function(){
		document.location.href = _context +'/cas/bklistbyvvdSearch.do';
	});
	
	
	var source = $('#source').val();
	if(source != null && source != "" ){
		displayConatinerDtls("B");
	}
	$('#commentsDiv').hide();
	
	/*var args = {
			entityType: 'RCFT',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: ''
		   };
	getCommentTypes(args);*/
	
	enforceCtrVarianceUserSecurityRolesAndPermissions();
	$('#containerNumber').focus();


	$('#billButton').click(function(){
		var isAutoBill = $('#isAutoBill').val();
		if(isAutoBill == 'true'){
			$.ajax({
				type: "GET",
				url: _context +"/booking/createBatchBillForBookings",
				data: {
					bookingId: $('#bookingIdForBilling').val(),
					receivedFreightIds: $('#currentContainerReceivedFreightId').val()+"|",
					callingModule: "BOOKING",
					callingPage: "CVARIANC",
					processMode: "BK"
				},
				success: function(responseText){
					showResponseMessages("msgDiv", responseText);
					//D027662
					var doesHoldsExist = responseText.data;
					if(doesHoldsExist!="" && doesHoldsExist == "holdsExists"){
						alert("Booking holds exist.  Please resolve booking holds or initiate billing from maintain booking");
					}
					captureUIChangesWithGrid();
				}
			});
		}else{
			$('#msgDiv').html("<div class=\"message_error\">This is not an Autobill Container</div>");
			window.scrollTo(0, 0);
		}
	});

/*	$('#billButton').click(function(){
		var isAutoBill = $('#isAutoBill').val();
		if(isAutoBill == 'true'){
			$.ajax({
				type: "GET",
				url: _context +"/booking/batchbill/requestBill",
				data: {
					bookingIds: $('#bookingIdForBilling').val(),
				},
				success: function(responseText){
					showResponseMessages("msgDiv", responseText);
				}
			});
		}else{
			$('#msgDiv').html("<div class=\"message_error\">This is not an Autobill Container</div>");
			window.scrollTo(0, 0);
		}
	});
*/	
	$('#maintainBooking').click(function(){
		var container = $('#containerNumber').val();
		var bookingNumber = $('#shippingIdHeaderDiv').text();
		document.location.href = _context +'/booking/showForm?userFromMenu=variance_'+container+'&bookingNumber='+bookingNumber;
	});
	
	if($('#containerNumber').val() != undefined && $.trim($('#containerNumber').val()) != '') {
		createCommentFunc();
	}
	tabSequence('#containerVarianceForm',false,false);
	//D025866
	captureUIChangesWithGrid();
});

function onClickSubEquip(){ 
	var checkedLength = $('#containerizedGrid tbody input:checked').length;
	
	if(checkedLength == 0){
		$('#msgDiv').html("<div class=\"message_error\">select atleast one container for substition</div>");
		window.scrollTo(0, 0);
		return false;
	}
	if(checkedLength > 1){
		$('#msgDiv').html("<div class=\"message_error\">select only one container for substition</div>");
		window.scrollTo(0, 0);
		return false;
	}
	if($("#subAuth1:checked").length == 0 && $("#subAuth2:checked").length == 0){
		$('#msgDiv').html("<div class=\"message_error\">select sub Auth </div>");
		window.scrollTo(0, 0);
		return false;
	}
	if(showLoadingMessage('S') != false){
		var selRow =jQuery("#containerizedGrid").getGridParam('selarrrow');
		var subEquipId= $('#containerizedGrid').jqGrid('getCell', selRow, 'freightEquipRqmtId');
		$('#subFreightEquipId').val(subEquipId);
	
		
		var subAuthVal = "";
		if($("#subAuth1:checked").length == 1){
			subAuthVal = $("#subAuth1:checked").val();
		}else{
			subAuthVal = $("#subAuth2:checked").val();
		}
		var varEquipAssId = $("#varianceFreightAssignmentId").val();
		
		var isVVDVariance = false;
		var vvdVari = $('input:checkbox[name=isVVDVariance]').is(':checked');
	        var destVari = $('input:checkbox[name=isRoutingVariance]').is(':checked');
	        if(vvdVari || destVari ){
	            isVVDVariance = true;
	           }

		$.ajax({
			type: "POST",
			url: _context +"/containerVariance/subsitituteEquipment",
			data: {subFreightEquipId:subEquipId,
				subAuthVal:subAuthVal,
				varianceFreightAssignmentId:varEquipAssId,
				isVVDVariance:isVVDVariance,},
			success: function(responseText){
				if (responseText.messages.error.length == 0) {
					showJSON(responseText);
					reloadContainerGrids();
				}
				showResponseMessages("msgDiv", responseText);
				if(responseText.data.bookingId == null){
					$("#containerNumber").attr("disabled",false);
				}
				
				onclickButtonEnable();
			}
		});
	}
}
function onClickUndoSubEquip(){
	if(showLoadingMessage('U') != false){
		var varFreAssId = $('#varianceFreightAssignmentId').val();
		$.ajax({
			type: "POST",
			url: _context +"/containerVariance/undoSub",
			data: {varFreAssId:varFreAssId,},
			success: function(responseText){
				if (responseText.messages.error.length == 0) {
					$('#msgDiv').show();
					showJSON(responseText);
					reloadContainerGrids();
				}
				showResponseMessages("msgDiv", responseText);
			
				if(responseText.data.bookingId == null){
					$("#containerNumber").attr("disabled",false);
				}
				onclickButtonEnable();
			}
		});
	}
}
function onClickAcceptGems(){
	var gemsVVD = $('#gemsVvdDiv').text();
	if(gemsVVD == "" || gemsVVD.trim() ==""){
		$('#msgDiv').html("<div class=\"message_error\">Vessel/Voyage specified is invalid.</div>");
		window.scrollTo(0, 0);
		return false;
	}
	
	
	var vvdVarianceExists = $('input:checkbox[name=isVVDVariance]').is(':checked');
	if(vvdVarianceExists == true || vvdVarianceExists == 'true'){
		if($("#vvdSubAuth1:checked").length == 0 && $("#vvdSubAuth2:checked").length == 0){
			$('#msgDiv').html("<div class=\"message_error\">select change VVD Auth </div>");
			window.scrollTo(0, 0);
			return false;
		} else {
			$('#msgDiv').html("");
		}
	}
	
	
	var vvdSubAuthVal = "";
	if($("#vvdSubAuth1:checked").length == 1){
		vvdSubAuthVal = $("#vvdSubAuth1:checked").val();
	}else{
		vvdSubAuthVal = $("#vvdSubAuth2:checked").val();
	}
	if(vvdVarianceExists == false|| vvdVarianceExists == 'false'){
        vvdSubAuthVal = "N";
    }
	//D030951: 	Container Variance: warning message when ves/voy has already sailed	
	blockUI();
	$.ajax({
		url: _context +"/containerVariance/validateVVD",
		success: function(responseText){
			$.unblockUI();
			if(responseText.success) {
				acceptGEMS(vvdVarianceExists, vvdSubAuthVal);
			} else {
				if(responseText.data=='Sail') {
					var r = confirm("Sail Date for this VVD has Already Passed. Continue?");
					if(r)
						acceptGEMS(vvdVarianceExists, vvdSubAuthVal);
						
				} else {
					acceptGEMS(vvdVarianceExists, vvdSubAuthVal);
				}
			}
		}
	});
}

function acceptGEMS(vvdVarianceExists, vvdSubAuthVal){
	if(showLoadingMessage('AGems') != false){
		var currentFreightEquipId = $('#currentFreightEquipId').val();
		$.ajax({
			type: "POST",
			url: _context +"/containerVariance/acceptGems",
			data:{vvdVarianceExists:vvdVarianceExists,vvdSubAuthVal:vvdSubAuthVal,
				currentFreightEquipId:currentFreightEquipId},
				success: function(responseText){
					if (responseText.messages.error.length == 0) {
						$('#msgDiv').show();
						showJSON(responseText);
						reloadContainerGrids();
					}
					showResponseMessages("msgDiv", responseText);
					
					if(responseText.data.bookingId == null){
						$("#containerNumber").attr("disabled",false);
					}
					onclickButtonEnable();
			}
		});
	}
}

function onClickAcceptGates(){
	if(showLoadingMessage('AGems') != false){	
		var vvdVarianceExists = $('input:checkbox[name=isVVDVariance]').is(':checked');
		$.ajax({
			type: "POST",
			url: _context +"/containerVariance/acceptGates",
			data:{vvdVarianceExists:vvdVarianceExists},
			success: function(responseText){
					if (responseText.messages.error.length == 0) {
						$('#msgDiv').show();
						showJSON(responseText);
						reloadContainerGrids();
					}
					showResponseMessages("msgDiv", responseText);
					if(responseText.data.bookingId == null){
						$("#containerNumber").attr("disabled",false);
					}
					onclickButtonEnable();
				}
		});
	}
}


function onClickSave(){
	//D026148
	blockUI();
	if(showLoadingMessage('Save') != false){
		saveAllEquipments();
		$.ajax({
				type: "POST",
				url:  _context +"/containerVariance/saveContainer",
	
			success: function(responseText){
					if (responseText.messages.error.length == 0) {
						$('#msgDiv').show();
						showJSON(responseText);
						reloadContainerGrids();
					}
					showResponseMessages("msgDiv", responseText);
					$("#containerNumber").attr("disabled",false);
					$('#containerSave').attr("disabled",false);
					$('#isUpdate').val("false");
					$('#isGridUpdate').val("false");
					onclickButtonEnable();
					$.unblockUI();
					captureUIChangesWithGrid();
				}
			});
	}else{
		$.unblockUI();
	}
	
};


function save(){
	if($('#isGridUpdate').val()== 'true'){
		var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
		if (isConfirm) {
			save();
		}
		else{
			return;
		}
	}else{
		save();			
	}
	
}
function approveBooking(){
	if(showLoadingMessage('A') != false){
		var booking = $('#containerVarianceForm').formSerialize();
		var bookingNo=$('#bookingIdHeader').val();
		if ($("#containerVarianceForm").validationEngine('validate')) {
			if(bookingNo!=null && bookingNo!=""){
				$.ajax({
					type: "POST",
					url: _context +"/containerVariance/approveBooking",
					data: booking,
					success: function(responseText){
							if (responseText.messages.error.length == 0) {
								$('#msgDiv').show();
								showJSON(responseText);
								reloadContainerGrids();
							}
							showResponseMessages("msgDiv", responseText);
							if(responseText.data.bookingId == null){
								$("#containerNumber").attr("disabled",false);
							}
							onclickButtonEnable();
						}
					});
			}
			else{
				alert('Booking Details Not Found');
			}
		}
		else {
			return false;
		}
	}
}
function deleteEquipment(rowid) {

	
	if( $('#containerizedGrid').getRowData(rowid).transient == 0) {
		// Not yet saved, delete localy
		
		// Hise popup 
		$('#delmodcontainerizedGrid').hide();
		$('body div[class="ui-widget-overlay"]').removeClass('ui-widget-overlay');

		// Restore container.
		$('#containerizedGrid tbody tr#'+rowid+' td div.ui-inline-add').show();
		$('#containerizedGrid tbody tr#'+rowid+' td div.ui-inline-del').hide();
		$('#containerizedGrid').setCell(rowid,'transient','1');
		$('#'+'containerizedGrid'+' tbody tr#'+rowid+' td input#'+rowid+'_quantityRequested ').removeAttr("disabled");
		return true;
	} else {
	    // Delete on the server.
	
		$('#delmodcontainerizedGrid').hide();
		$('body div[class="ui-widget-overlay"]').removeClass('ui-widget-overlay');
		if(showLoadingMessage('D') != false){	
			id="3";
			$.ajax({
				url : _context +"/containerVariance/deleteFrtEqpRqmt",
				type : "POST",
				data : {id:id},
				success : function(responseText) {
						if (responseText.success == true) {
							$('#isDelete').val(false);
							$('#msgDiv').show();
							showJSON(responseText);
							reloadContainerGrids();
						}
						showResponseMessages("msgDiv", responseText);
						if(responseText.data.bookingId == null){
							$("#containerNumber").attr("disabled",false);
						}
						onclickButtonEnable();
						}
				});
		}
		return true;
	}
}
	
function onClickNextButton(){ 
	if($('#isUpdate').val()== 'true'){
		var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
		if (isConfirm) {
			$('#isUpdate').val("false");
			displayConatinerDtls('N');
		}
		else{
			return;
		}
	}else{
		displayConatinerDtls('N');
	}
	
};
function onClickPreButton(){ 
	if($('#isUpdate').val()== 'true'){
		var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
		if (isConfirm) {
			displayConatinerDtls('P');
		}
		else{
			return;
		}
	}else{
		displayConatinerDtls('P');
	}
};

function enableDisableButtons(index, listSize) {
	if(index <= 0) {
		$("#prevButton").attr("disabled", true);
	} else {
		$("#prevButton").removeAttr("disabled");
	}
	if(index >= listSize - 1) {
		$("#nextButton").attr("disabled", true);
	} else {
		$("#nextButton").removeAttr("disabled");
	}
}
function onclickButtonDisable(varExists){
	window.scrollTo(0, 0);
	if(!varExists){
		//$("#undoSubButton").attr("disabled",true);
		$("#acceptGems").attr("disabled",true);
		$("#acceptGates").attr("disabled",true);
		//$("#containerSubEquip").attr("disabled",true);
		var bookingStatus = $('#stsDiv').text();
		if(bookingStatus != 'APPR'){
			$("#billButton").attr("disabled",true);
		}else{
			$("#billButton").attr("disabled",false);
		}
	}else{
		$("#containerExit").attr("disabled",true);
		$("#containerMaintenance").attr("disabled",true);
		$("#billButton").attr("disabled",true);
		//$("#undoSubButton").attr("disabled",true);
		$("#acceptGems").attr("disabled",true);
		$("#acceptGates").attr("disabled",true);
		//$("#containerSave").attr("disabled",true);
		//$("#containerSubEquip").attr("disabled",true);
	}
	
	
	
}
function enableDisableRoutingbutton(){
	var vvdVari = $('input:checkbox[name=isVVDVariance]').is(':checked');
	var destVari = $('input:checkbox[name=isRoutingVariance]').is(':checked');
	var contVari = $('input:checkbox[name=isContainerCountVariance]').is(':checked');
	var equipVari = $('input:checkbox[name=isEquipmentTypeVariance]').is(':checked');
	var statusVari = $('input:checkbox[name=isStatausVariance]').is(':checked');

	if(vvdVari){
		$('#gemsVvdDiv').css("background-color", "#FD1");
		$('#gatesVVdDiv').css("background-color", "#FD1");
		$('#vari1').css("background-color", "#FD1");
		
	}else{
		$('#gemsVvdDiv').css("background-color", "");
		$('#gatesVVdDiv').css("background-color", "");
		$('#vari1').css("background-color", "");
	}
	// add permission for update
	if(isContVarianceModifiable){
		if((vvdVari || destVari) &&!contVari && !equipVari && !statusVari){
			$("#acceptGems").attr("disabled",false);
			$("#acceptGates").attr("disabled",false);
		}
		$("#containerSave").attr("disabled",false);
	}
	
	var isbill=$('#billingStarted').val();
	var bookingStatus = $('#stsDiv').text();
	if(bookingStatus == 'APPR' && isbill != null && isbill == 'false' && vvdVari == false && destVari == false && contVari == false && equipVari == false && statusVari == false ){
		$("#billButton").attr("disabled",false);
	}else{
		$("#billButton").attr("disabled",true);
	}
}
function onclickButtonEnable(){
	var bookingId = $('#shippingIdHeaderDiv').text();
	if(bookingId != null && bookingId != ''){
		$("#containerSave").attr("disabled",false);
		enableDisableRoutingbutton();
	}else{
		$("#containerSave").attr("disabled",true);
	}
	window.scrollTo(0, 0);
	$("#containerExit").attr("disabled",false);
	$("#containerMaintenance").attr("disabled",false);
	
	// add permission
	enforceSecurityOnApprove();
}

var customloadLoad = function(){
		$('#gview_containerizedGrid div table thead tr#tr_seqNo').hide();
		$('#gview_containerizedGrid div table thead th#containerizedGrid_cb div input#cb_containerizedGrid').attr('style','display:none');
		
		manageInlineAddVisibility('containerizedGrid');
		manageInlineCheckboxVisibility('containerizedGrid');
		var subEnable = $('#isEquipVariance').val();
		var isCountVariance = $('#isCountVariance').val();
		var undoSubEnable = $('#isSubsVariance').val();
		if(undoSubEnable != null && undoSubEnable == 'true'){ 
			$('#undoSubButton').removeAttr('disabled');
			//$('#containerSubEquip').attr('disabled','disabled');
		}else{
			if((subEnable != null && subEnable == 'true') ||(isCountVariance != null && isCountVariance != '' && isCountVariance == 'true')){ 
				$('#containerSubEquip').removeAttr('disabled');
				$('#undoSubButton').attr('disabled','disabled');
			}
		}
		if($("#varianceExists").val() == 'false'){
  			onclickButtonDisable(false);
  		}
		// add permission 
		enforceSecurityOnSub();
		enforceSecurityOnCtrVarianceModifiable();	
		editAllEquipments();
		//D026149
		$("#1_quantityRequested").focus();
	};

function addRow(dataId) {
	console.log('ADD row');
	//D032910: 	Container Variance: Do not allow add of Reefer or Insul
	$('table[aria-labelledby="gbox_containerizedGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_containerizedGrid"] thead tr[id="FormError"]').hide();
	var eqType = $('#'+dataId+'_planEquipTypeCode').val().substring(0,1);
	if(eqType == 'R' || eqType == 'I'){
		$('table[aria-labelledby="gbox_containerizedGrid"] thead tr[id="FormError"] td').html("Reefer and Insulated type equipment must be added on Maintain Booking page");
		$('table[aria-labelledby="gbox_containerizedGrid"] thead tr[id="FormError"]').show();
	} else {
		$('#containerizedGrid').setCell(dataId,'transient','0');
		$('#containerizedGrid tbody tr#'+dataId+' td div.ui-inline-del').show();
		
		$('#containerizedGrid tbody tr#'+dataId+' td div.ui-inline-add').hide();
		$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#'+dataId+'_quantityRequested ').removeAttr("disabled");
		$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#'+dataId+'_quantityRequested ').focus();
	}
}	
	
function manageInlineAddVisibility(gridId) {
		var colName ='freightEquipRqmtId';
		var colName1 = 'planEquipTypeCode';
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
			var dataId = dataIDs[rowId];
			var colValue = $('#' + gridId).jqGrid('getCell', dataId, colName);
			var colValue1 = $('#' + gridId).jqGrid('getCell', dataId, colName1);
			var deletedEqType = $('#eqpuipType').text();
			var isDelete = $('#isDelete').val();
			$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-del').hide();
			$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').hide();
			
			console.log('isDelete'+isDelete);
			console.log('deletedEqType'+deletedEqType);
			console.log('colValue1'+colValue1);
			
			if(isDelete ==  'true' && deletedEqType == colValue1){
				console.log('showDelete');
				$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#jqg_containerizedGrid_'+dataId+"'").attr('disabled','disabled');
				$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-del').show();
			} 
			
			var recEquipType = $('#eqpuipType').text();
			if(colValue1 == recEquipType && $('#isContainerCountVariance').attr('checked') == 'checked'){
				var columns = jQuery("#"+ dataId + " td",jQuery('#'+gridId));
				for(var i = 0; i < columns.length ; i++)
				{
					var tdElement = columns[i];
					if($(tdElement).attr("aria-describedby")=='containerizedGrid_quantityRequested')
					{
						$(tdElement).css("background-color", "#FD1");
					}
				}
			}
			
			if(colValue == false ){
				$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#jqg_containerizedGrid_'+dataId+"'").attr('disabled','disabled');
				//add permission for update
				if(isContVarianceModifiable){
					$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').show();
					$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-del').hide();
					$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').replaceWith('<div class="ui-inline-add"><a href="javascript:addRow('+dataId+')" style = "margin-bottom:-9px;" id="sData" class="fm-button ui-state-default ui-corner-all fm-button-icon-left">Add<span class="ui-icon ui-icon-plus"></span></a></div>');
					$('#containerizedGrid').setCell(dataId,'transient','1');
					$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#'+dataId+'_quantityRequested ').attr('disabled','disabled');
					
				}
				
			} else {
				// Hide the pencil for inline edit.
				//$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').hide();
			}
		}
	}


function manageInlineCheckboxVisibility(gridId) {
		var colName ='subVariance';
		var colName1 ='multipleComodity';
		var colName2 = 'planEquipTypeCode';
		var dataIDs = jQuery('#' + gridId).getDataIDs();
		for (var rowId = 0; rowId < dataIDs.length ; rowId++) {
			var dataId = dataIDs[rowId];
			var colValue = $('#' + gridId).jqGrid('getCell', dataId, colName);
			var colValue1 = $('#' + gridId).jqGrid('getCell', dataId, colName1);
			var colValue2 = $('#' + gridId).jqGrid('getCell', dataId, colName2);
			var subEnable = $('#isEquipVariance').val();
			var isCountVar = $('#isCountVariance').val();
			if(colValue1 == 'true'){
				$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').attr('title','Fix on Maintain Booking');
				$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit').attr('onclick','#');
				$('#'+gridId+' tbody tr#'+dataId+' td div.ui-inline-edit span').replaceWith('Fix on Maintain Booking');
			}
			$("#maintainBooking").attr("disabled",false);
			if(colValue2 == $("#eqpuipType").text()){
				$('#'+'containerizedGrid'+' tbody tr#'+dataId+' td input#jqg_containerizedGrid_'+dataId+"'").attr('disabled','disabled');
				$('#'+'containerizedGrid'+' tbody tr#'+dataId+"'").removeClass("ui-state-highlight");
			} 
		}
	}

function showLoadingMessage(type){
	if(type == 'S' ||type == 'U' || type == 'Save' || type == 'A' || type == 'D' || type == 'AGems'){
		if(confirmBilling() == false){
			return false;
		}
	}
	$("#containerNumber").attr("disabled",true);
	onclickButtonDisable();
	if(type == 'L'){
		clearFormContainer();
		$('#msgDiv').html("<div class=\"message_info\">Loading container  ...</div>");
	}else if(type == 'S'){
		//$('#containerSubEquip').attr('disabled','disabled');
		$('#msgDiv').html("<div class=\"message_info\">Substituting container "+ $("#containerNumber").val() +" ...</div>");
	}else if(type == 'U'){
		$('#undoSubButton').attr('disabled','disabled');
		$('#msgDiv').html("<div class=\"message_info\">UndoSubstituting container "+ $("#containerNumber").val() +" ...</div>");
	}else if(type == 'Save'){ 
		$('#containerSave').attr('disabled','disabled');
		//$('#containerSubEquip').attr('disabled','disabled');
		$('#msgDiv').html("<div class=\"message_info\">Updating container ...</div>");
	}else if(type == 'A'){
		$('#approveBooking').attr('disabled','disabled');
		$('#msgDiv').html("<div class=\"message_info\">Updating Booking "+ $('#shippingIdHeaderDiv').val() +" ...</div>");
	}else if(type == 'D'){
		$('#msgDiv').html("<div class=\"message_info\">Deleting Equipment ...</div>");
	}else if(type == 'AGems'){
		$('#msgDiv').html("<div class=\"message_info\">Resolving container variance ...</div>");
	}
	
	$('#msgDiv').show();
	return true;
}

function displayConatinerDtls(source){
	showLoadingMessage('L');
	$('#containerNumber').val($('#containerNumber').val().toUpperCase());
	var contaienrNumber=$('#containerNumber').val();
	
	if ($("#containerVarianceForm").validationEngine('validate')) {
		$.ajax({
			type: "POST",
			url: _context +"/containerVariance/loadBookingContainerDtls",
		data: {containerNumber: contaienrNumber,
				source: source
			},
			success: function(responseText){ 
				if (responseText.messages.error.length == 0) {
					showJSON(responseText);
					reloadContainerGrids();
				}
				var source = responseText.data.source;
				if(source != null && source != "" && source != 'C'){ 
					enableDisableButtons(responseText.data.index,responseText.data.containerListSize);
					$('#containerNumber').val(responseText.data.containerNumber);
					$("#containerNumber").attr("disabled",true);
				}else{
					$("#containerNumber").attr("disabled",false);
				}
				showResponseMessages("msgDiv", responseText);
				onclickButtonEnable();
				captureUIChangesWithGrid();
			}
		});
	}
	else {
		return false;
	}
}
function showJSON(responseText)  {
	    $("#containerVarianceForm").loadJSON(responseText.data);
		$("#bookingIdHeader").val(responseText.data.bookingHeaderDetailForm.shippingIdHeader);
		$("#shippingIdHeaderDiv").val(responseText.data.bookingHeaderDetailForm.shippingIdHeader);
		$('#shippingIdHeaderDiv').text(responseText.data.bookingHeaderDetailForm.shippingIdHeader);
		$("#isAutoBill").val(responseText.data.bookingHeaderDetailForm.isAutoBill);
		$('#bookingIdForBilling').val(responseText.data.bookingHeaderDetailForm.bookingIdHeader);
		$('#stsDiv').text(responseText.data.bookingHeaderDetailForm.bookingStatusHeader);
		$("#varianceExists").val(responseText.data.varianceExists);
		$("#shipmentStatus").val(responseText.data.shipmentStatus);
		
		var sts=	responseText.data.bookingHeaderDetailForm.bookingStatusHeader;

		//if(sts=='CANC' || sts=='OFFR'){
		if(sts != 'APPR'){
			$('#stsDiv').css("background-color", "#FD1");
			$('#vari5').css('background-color','#FD1');
			$("#isStatausVariance").attr("checked", "true");
			if(sts=='CANC' || sts=='OFFR'){
				$('#approveBooking').removeAttr("disabled");
			}
		}else{
			$('#vari5').css('background-color','');
			$('#stsDiv').css("background-color", "");
			$("#isStatausVariance").removeAttr("checked");
			$('#approveBooking').attr("disabled","disabled");	
		}
		
		var isVVDVariance = responseText.data.isVVDVariance;
		if (isVVDVariance == true){
			$("#isVVDVariance").attr("checked", "true");
		}else {
			$("#isVVDVariance").removeAttr("checked");
		}
		
		
		
		
		$('#shipperDiv').text(responseText.data.bookingHeaderDetailForm.shipper.organizationName);
		$('#porDiv').text(responseText.data.bookingHeaderDetailForm.placeOfRecieptHeader);
		$('#consigneeDiv').text(responseText.data.bookingHeaderDetailForm.consignee.organizationName);
		$('#polDiv').text(responseText.data.bookingHeaderDetailForm.portOfLoadingHeader);
		var tradeCode =responseText.data.bookingHeaderDetailForm.tradeCodeHeader+"-"+responseText.data.bookingHeaderDetailForm.tradeCodeValueHeader;
		$('#tradeDiv').text(tradeCode);
		if($('#tradeDiv').text().substr(0,1) == 'F'){
			$('#containerMaintenance').val('Intl Cntr Maintenance');
		}else{
			$('#containerMaintenance').val('Container Maintenance');
		}
		$('#podDiv').text(responseText.data.bookingHeaderDetailForm.portOfDischargeHeader);
		$('#custDiv').text(responseText.data.bookingHeaderDetailForm.customerGroupHeader);
		$('#poDeDiv').text(responseText.data.bookingHeaderDetailForm.placeOfDelevieryHeader);
		$('#vvdDiv').text(responseText.data.bookingHeaderDetailForm.vvdHeader);
		$('#ldsDiv').text(responseText.data.bookingHeaderDetailForm.ldSVCHeader);
		
		$('#shipperAddressDiv').text(responseText.data.bookingHeaderDetailForm.shipper.address);
		$('#consigneeAddressDiv').text(responseText.data.bookingHeaderDetailForm.consignee.address);
		$('#shipperC/oDiv').text(responseText.data.bookingHeaderDetailForm.shipperCareOf);
		$('#consigneeC/oDiv').text(responseText.data.bookingHeaderDetailForm.consigneeCareOf);	
		//$('#eqpuipTypeDiv').text(responseText.data.eqpuipType);
		
		$("#routingVarianceForm").loadJSON(responseText.data.routingVarianceForm);
		var gemsVC = responseText.data.routingVarianceForm.gemsVessel==null?"":responseText.data.routingVarianceForm.gemsVessel;
		var gemsV = responseText.data.routingVarianceForm.gemsVoyage==null?"":responseText.data.routingVarianceForm.gemsVoyage;
		var gemsD = responseText.data.routingVarianceForm.gemsDirection==null?"":responseText.data.routingVarianceForm.gemsDirection;
		$('#gemsVvdDiv').text(gemsVC+" "+gemsV+" "+gemsD);
		$('#gemsOriginPortCityCodeDiv').text(responseText.data.routingVarianceForm.gemsOriginPortCityCode);
		
		$('#gemsBlOriginCityCodeDiv').text(responseText.data.routingVarianceForm.gemsBlOriginCityCode);
		$('#gemsDestinationPortCityCodeDiv').text(responseText.data.routingVarianceForm.gemsDestinationPortCityCode);	
		$('#gemsBlDestinationCityCodeDiv').text(responseText.data.routingVarianceForm.gemsBlDestinationCityCode);
		
		var gatsVC = responseText.data.routingVarianceForm.vesselCode==null?"":responseText.data.routingVarianceForm.vesselCode;
		var gatsV = responseText.data.routingVarianceForm.voyage==null?"":responseText.data.routingVarianceForm.voyage;
		var gatsD = responseText.data.routingVarianceForm.directionSeq==null?"":responseText.data.routingVarianceForm.directionSeq;
		$('#gatesVVdDiv').text(gatsVC+" "+gatsV+" "+gatsD);
		//$('#gatesblOriginCityCodeDiv').text(responseText.data.routingVarianceForm.blOriginCityCode);
		$('#gatesoriginPortCityCodeDiv').text(responseText.data.routingVarianceForm.originPortCityCode);
		
		$('#gatesblOriginCityCodeDiv').text(responseText.data.routingVarianceForm.blOriginCityCode);
		$('#gatesdestinationPortCityCodeDiv').text(responseText.data.routingVarianceForm.destinationPortCityCode);	
		$('#gatesblDestinationCityCodeDiv').text(responseText.data.routingVarianceForm.blDestinationCityCode);
		
		var isRoutingVariance = responseText.data.isRoutingVariance;
		if (isRoutingVariance == true){
			$('#vari2').css('background-color','#FD1');
			/*if($('#gatesblOriginCityCodeDiv').text() != $('#gemsBlOriginCityCodeDiv').text()){
				$('#gemsBlOriginCityCodeDiv').css("background-color", "#FD1");
				$('#gatesblOriginCityCodeDiv').css("background-color", "#FD1");
			}*/
			if($('#gemsDestinationPortCityCodeDiv').text() != $('#gatesdestinationPortCityCodeDiv').text()){
				$('#gemsDestinationPortCityCodeDiv').css("background-color", "#FD1");
				$('#gatesdestinationPortCityCodeDiv').css("background-color", "#FD1");
			}
			if($('#gemsBlDestinationCityCodeDiv').text() != $('#gatesblDestinationCityCodeDiv').text()){
				$('#gemsBlDestinationCityCodeDiv').css("background-color", "#FD1");
				$('#gatesblDestinationCityCodeDiv').css("background-color", "#FD1");
			}
			$("#isRoutingVariance").attr("checked", "true");
		}else {
			$('#vari2').css('background-color','');
			$("#isRoutingVariance").removeAttr("checked");
			$('#gemsBlOriginCityCodeDiv').css("background-color", "");
			$('#gemsDestinationPortCityCodeDiv').css("background-color", "");
			$('#gemsBlDestinationCityCodeDiv').css("background-color", "");
			
			$('#gatesblOriginCityCodeDiv').css("background-color", "");
			$('#gatesdestinationPortCityCodeDiv').css("background-color", "");
			$('#gatesblDestinationCityCodeDiv').css("background-color", "");
		}
		
		var isContCountVariance = responseText.data.isContainerCountVariance;
		$('#isCountVariance').val(isContCountVariance);
		if (isContCountVariance == null){
			$("#isContainerCountVariance").removeAttr("checked");
			$('#vari3').css("background-color", "");
		}else if(isContCountVariance == true){
			$("#isContainerCountVariance").attr("checked", "true");
			$('#vari3').css("background-color", "#FD1");
		}
		$('#isSubsVariance').val(responseText.data.isSubstitute);
		
		var isEquipVariance = responseText.data.isEquipmentTypeVariance;
		$('#isEquipVariance').val(isEquipVariance);
		
		if(isEquipVariance == true){
			$('#eqpuipType').css('background-color','#FD1');
			$('#vari4').css('background-color','#FD1');			
			$("#isEquipmentTypeVariance").attr("checked", "true");
		}else{
			$("#isEquipmentTypeVariance").removeAttr("checked");
			$('#eqpuipType').css('background-color','');
			$('#vari4').css('background-color','');
		}
		
		var subbed = responseText.data.subbed;
		if(subbed == null){
			$('#subbed').text("");
			$('#eqpuipType').css('color','');
		} else {
			$('#eqpuipType').css('color','Red');
			$('#subbed').css('color','Red');
		}
		var subAuth = responseText.data.subAuth;
		$("#subAuth2").removeAttr("checked");
		$("#subAuth1").removeAttr("checked");
		if(subAuth != null && subAuth != ''){
			if(subAuth == 'E'){
				$("#subAuth2").attr("checked", "true");
			}else if(subAuth == 'S'){
				$("#subAuth1").attr("checked", "true");
			}
			
		}
		
		var vvdSubAuth = responseText.data.vvdSubAuth;
		$("#vvdSubAuth1").removeAttr("checked");
		$("#vvdSubAuth2").removeAttr("checked");
		if(vvdSubAuth != null && vvdSubAuth != ''){
			if(vvdSubAuth == 'S'){
				$("#vvdSubAuth1").attr("checked", "true");
			}else if(vvdSubAuth == 'C'){
				$("#vvdSubAuth2").attr("checked", "true");
			}
			
		}
		
		$('#commentsDiv').show();
		$('#commentId').val(responseText.data.commentId);
		$('#currentContainerReceivedFreightId').val(responseText.data.currentContainerReceivedFreightId);
		// add permission for comment
		enforceSecurityOnContVarianceComments();
		enforceSecurityOnApprove();
		
		createCommentFunc();
	}
function clearFormContainer(){
		$('#isUpdate').val("false");
		$('#isGridUpdate').val("false");
		
		$('#shipmentStatus').val("");
		$("#bookingIdHeader").val("");
		$("#bookingIdForBilling").val("");		
		$("#shippingIdHeaderDiv").val("");
		$('#shippingIdHeaderDiv').text("");
		$('#stsDiv').text("");
		
		var sts=	"";
		if(sts=='CANC' || sts=='OFFR'){
			$('#approveBooking').removeAttr("disabled");
		}
		else{	
			$('#approveBooking').attr("disabled","disabled");	
			
		}
		$("#subAuth2").removeAttr("checked");
		$("#subAuth1").removeAttr("checked");
		
		$("#vvdSubAuth1").removeAttr("checked");
		$("#vvdSubAuth2").removeAttr("checked");
		
		$('#isSubsVariance').val("");
		$('#recievedFreight').text("");
		$('#quantityRequested').text("");
		$('#subbed').text("");
		$('#eqpuipType').text("");
		$('#isCountVariance').val(false);
		//$('#containerSubEquip').attr("disabled","disabled");
		
		
		$('#isEquipmentTypeVariance').removeAttr("checked");
		$('#isRoutingVariance').removeAttr("checked");
		$('#isContainerCountVariance').removeAttr("checked");
		$('#isVVDVariance').removeAttr("checked");
		$('#isStatausVariance').removeAttr("checked");
		
		$('#vari1').css('background-color','');
		$('#vari2').css('background-color','');
		$('#vari3').css('background-color','');
		$('#vari4').css('background-color','');
		$('#vari5').css('background-color','');
		
		
		$('#shipperDiv').text("");
		$('#porDiv').text("");
		$('#consigneeDiv').text("");
		$('#polDiv').text("");
		$('#tradeDiv').text("");
		$('#podDiv').text("");
		$('#custDiv').text("");
		$('#poDeDiv').text("");
		$('#vvdDiv').text("");
		$('#ldsDiv').text("");
		$('#shipperAddressDiv').text("");
		$('#consigneeAddressDiv').text("");
		$('#shipperC/oDiv').text("");
		$('#consigneeC/oDiv').text("");	
		$('#eqpuipTypeDiv').text("");
		
		$("#routingVarianceForm").loadJSON("");
		$('#gatesVVdDiv').text("");
		$('#gatesblOriginCityCodeDiv').text("");
		$('#gatesoriginPortCityCodeDiv').text("");
		$('#gatesdestinationPortCityCodeDiv').text("");	
		$('#gatesblDestinationCityCodeDiv').text("");
		$('#gemsVvdDiv').text("");
		$('#gemsBlOriginCityCodeDiv').text("");
		$('#gemsOriginPortCityCodeDiv').text("");
		$('#gemsDestinationPortCityCodeDiv').text("");	
		$('#gemsBlDestinationCityCodeDiv').text("");
		$('#isStatausVariance').text("");
		reloadContainerGrids();
		
		$('#commentsDiv').hide();
		$('#commentId').val('');
		$('#currentContainerReceivedFreightId').val('');
	}
function setAccordianTabDetails(id, displayText){
  		$("#"+id).text(displayText);
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
					//D032689
					if(array[i] != 'VVD sailed. Update not allowed' && array[i] != 'Container has already been loaded to a vessel'){
						clearFormContainer();
					}
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
			$('#'+msgDivId).html(messageContent);
			if(messageContent!='')
			{
				window.scrollTo(0, 0);
			}
	  	}
	}


function confirmBilling(){
	var billingStarted = $("#billingStarted").val();
	var gridUpdate= $('#isGridUpdate').val();
	var isConfirm = true;
	if(billingStarted == 'true' && gridUpdate == 'true'){
		return isConfirm = confirm("Grid Unsaved changes will be discarded-Billing has started, Please confirm to proceed!");
	}else if(billingStarted == 'true' && gridUpdate == 'false'){
		return isConfirm = confirm("Billing has started, Please confirm to proceed!");
	}else if(billingStarted == 'false' && gridUpdate == 'true'){
		return isConfirm = confirm("Grid Unsaved changes will be discarded. Please confirm to proceed!");
	}
	return isConfirm;
}
function scrollWin(){
		$('html,body').animate({
		scrollTop: $("#msgDiv").offset().top
		}, 200);
	}
	  //common method for reloading all grids for booking
function reloadContainerGrids(){
  		$("#specialServiceGrid").trigger('reloadGrid');
  		$("#containerizedGrid").trigger('reloadGrid');
  	}

//add permission for comment
function enforceSecurityOnContVarianceComments() {
	if(isContVarianceCommentsDisplay && isContVarianceCommentsModifiable) {
		$('#commentsDiv').css('display', 'block');
	} else if(isContVarianceCommentsDisplay == false && isContVarianceCommentsModifiable == false) {
		$('#commentsDiv').css('display', 'none');
	} else if(isContVarianceCommentsDisplay == true && isContVarianceCommentsModifiable == false) {
		$('#commentsDiv').css('display', 'block');
		//TODO: for Comments Save disabling
	} else if(isContVarianceCommentsDisplay == false && isContVarianceCommentsModifiable == true) {
		$('#commentsDiv').css('display', 'block');
	}
}

function getCommentTypes(args){
	$.ajax({
		url: _context +"/comments/commentTypes",
		data: {
			entity: 'RCFT',
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
				args.commentTypesForGrid=string;
				$("#comment_link").comments(args);
				
			}
		}
	});
}

function enforceCtrVarianceUserSecurityRolesAndPermissions() {
	enforceSecurityOnCtrVarianceModifiable();
	enforceSecurityOnApprove();
	enforceSecurityOnSub();
	enforceSecurityOnContainerMaintenance();
	//D027304 :For Billbutton security permission
	enforceSecurityOnBill();
}

function enforceSecurityOnCtrVarianceModifiable() {
	if(isContVarianceModifiable == false){
		$('#containerizedGrid tbody tr td div.ui-inline-del').hide();
		$('#containerizedGrid tbody tr td div.ui-inline-edit').hide();
		$('#acceptGems').css('visibility','hidden');
		$('#acceptGems').addClass('noTab');
		$('#acceptGates').css('visibility','hidden');
		$('#acceptGates').addClass('noTab');
		$('#containerSave').css('visibility','hidden');
		$('#containerSave').addClass('noTab');
		
	}
}

function enforceSecurityOnApprove() {
	if(isContVarianceBookingApprove == false){
		$('#approveBooking').css('visibility','hidden');
		$('#approveBooking').addClass('noTab');
	}
}

function enforceSecurityOnSub() {
	if(isContVarianceSubstitute == false) {
		$('#containerSubEquip').css('visibility','hidden');
		$('#containerSubEquip').addClass('noTab');
		$('#undoSubButton').css('visibility','hidden');
		$('#undoSubButton').addClass('noTab');
	}
}
//D027304
function enforceSecurityOnBill() {
	if(isBillDisplay == false)
		{
		   $('#billButton').css('visibility','hidden');
		   $('#billButton').addClass('noTab');
		}
}

function enforceSecurityOnContainerMaintenance() {
	if(isCtrMaintenanceDisplay == false && isCtrMaintenanceModifiable == false) {
		$('#containerMaintenance').css('visibility','hidden');
		$('#containerMaintenance').addClass('noTab');
	}
}

function createCommentFunc() {
	var isDeleteAllowed = false;
	var isEditAllowed = false;
	var args = {
			entityType: 'RCFT',
			entityId: $('#bookingId').val(),
			commentId: 'commentId',
			displayCommentTypes: 'ALL',
			commentTypesForGrid:'ALL',
			isDeleteAllowed:isDeleteAllowed,
			isEditAllowed:isEditAllowed
		   };
	getCommentTypes(args);
}

function editAllEquipments(){
	
	var rowIDs = jQuery("#containerizedGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	   var rowid = $('#containerizedGrid').getCell(rowIDs[i], 'seqNo');
	   $('#containerizedGrid').jqGrid('editRow', rowid);
	   
	   $('#'+'containerizedGrid'+' tbody tr#'+rowid+' td input#'+rowid+'_planEquipTypeCode ').attr('disabled','disabled');
	   $('#'+'containerizedGrid'+' tbody tr#'+rowid+' td input#'+rowid+'_emptyFullCode ').attr('disabled','disabled');
      
	   if( $('#containerizedGrid').getRowData(rowid).transient == 1 ) {
		   $('#'+'containerizedGrid'+' tbody tr#'+rowid+' td input#'+rowid+'_quantityRequested ').attr('disabled','disabled');
	   }
	   
    }
    
}


function saveAllEquipments(){
	
	updateEquipmentErrorOccurred = false;
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_equipmentGrid"] thead tr[id="FormError"]').hide();
	var rowIDs = jQuery("#containerizedGrid").getDataIDs();
	for (var i=0;i<rowIDs.length;i=i+1)
    { 
	  	
	   var rowId = $('#containerizedGrid').getCell(rowIDs[i], 'seqNo');
	   
	   console.log("edit "+rowId+" "+$('#containerizedGrid').getRowData(rowId).transient);
	   // not transient
	   if( $('#containerizedGrid').getRowData(rowId).transient != 1) {
		   console.log('save row '+rowId);
		   currentRowId = rowId+'_';
		   var isSuccess = $('#containerizedGrid').jqGrid(
				   'saveRow', 
				   rowId, 
				   null, //onsuccessfunc
				   _context+'/containerVariance/editContainerizedGrid' //Url
		   );
		   
		   if(!isSuccess){
			   updateEquipmentErrorOccurred = true;
				break;
			}
		   else
			   $('#containerizedGrid').jqGrid('editRow', rowId);
	   }
    }
	if(!updateEquipmentErrorOccurred){
		equipmentUpdated = false;
	} 
	
}
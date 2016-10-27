$(document).ready(function () {
	//$('#msgDivBill').html("<div class=\"message_info\">Loading billing information for "+ $("#shipmentNumber").val() +" ...</div>");
	//$('#msgDivBill').show();
	
	$("#billOverlayContent").show();
	
	
	/*$('#billStartedButton').click(function(){
		$('div[aria-labelledby="ui-dialog-title-billBookingDialog"]').removeClass('transparent');
		$("#billOverlayContent").show();
		$("#billStartedButton").hide();
    });*/	

	$('#billOverlayCloseButton').click(function(){
		/*if($("#bookingStatusCode").val()=='APPR')
			expandAll();
		else
			collapseAll();*/
		readOnlyFieldsForBilledBookings();
		$("#billBookingDialog").dialog("close");
    });	

	//default hide grids
	$('#receivedFreightGridDiv').hide();
	$('#receivedUnitsGridDiv').hide();
	
	if($('#bookingTypeCode').val()=='B'){
/*		createAndLoadBilledFreightGrid();
		createAndLoadBilledUnitGrid();*/
	}
});

function createAndLoadBilledFreightGrid(){
	var receivedFreightsColNames = ['Id', 'billNoHidden','billNoCorrection','Bill #', 'Status', 'More','W/C','Container','PR','Type/Size','VVD','POD','Consignee'];
	var receivedFreightsColModels = [
	               {name:'seqNo', hidden:true},
	               //{name:'billNo', width:80, editable:false},
	               {name:'billNoHidden', hidden:true},
	               {name:'billNoCorrection', hidden:true},
	               {
	            	    name:'billNo', 
	            	    width:80, 
	            	    editable:false,
	            	    formatter : 'showlink',
		   					formatoptions : {
			   					baseLinkUrl : "javascript:",
			   					showAction : "navigateToMaintainBillFromContainerGrid('",
			   					addParam: "');"
		   					}
	               },
	               {name:'status', width:80, editable:false},
	               {name:'more', width:40, editable:false},
	               {name:'wOrC', width:40, editable:false},
	               {name:'container', width:120, editable:false},
	               {name:'proRate', width:30, editable:false},
	               //{name:'preReceived', width:100, editable:false},
	               {name:'equipmentType', width:75, editable:false},
	               {name:'vvd', width:80, editable:false},
	               {name:'portOfDischarge', width:60, editable:false},
	               {name:'consignee', width:300, editable:false}
			   	];

	var jsonReaderReceivedFreight = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"seqNo"
		};

	createGrid("receivedFreightGrid", // grid id for party
			"receivedFreightPager", // page id for party
			'../booking/bill/loadReceivedFreight', // geturl
			'', // addurl
			'', // edit url
			'', //delete url
			'',// delete selected URL
			receivedFreightsColNames, receivedFreightsColModels, "Received Containers",// caption
			83,// height
			3,// row num
			[ 3, 6, 9 ],// row list
			false,// multiselect
			false,// multidelete
			false,// load once
			true, // read only grid
			jsonReaderReceivedFreight, // json reader
			true, // hide edit
			true, // hide delete
			true, // autowidth
			false, // rownumbers
			true, // hide custom add row
			false,// hide pager row
			null,// custom edit method
			null,// custom grid complete
			receivedFreightGridLoadComplete,// custom load complete
			false,// default hidden
			true);// row Color Based On status
}


function createAndLoadBilledUnitGrid(){
	var receivedUnitsColNames = ['Id', 'billNoHidden','billNoCorrection','Bill #','Status', 'VINSight#', 'VIN','Description','DLAC','POD','Consignee'];
	var receivedUnitsColModels = [
	               {name:'seqNo', hidden:true},
	               {name:'billNoHidden', hidden:true},
	               {name:'billNoCorrection', hidden:true},
	               {
	            	    name:'billNo', 
	            	    width:60, 
	            	    editable:false,
	            	    formatter : 'showlink',
		   					formatoptions : {
			   					baseLinkUrl : "javascript:",
			   					showAction : "navigateToMaintainBillFromUnitGrid('",
			   					addParam: "');"
		   					}
	               },
	               //{name:'billNo', width:80, editable:false},
	               {name:'status', width:60, editable:false},
	               {name:'vinSinghtNo', width:90, editable:false},
	               {name:'vin', width:130, editable:false},
	               {name:'description', width:160, editable:false},
	               {name:'dLac', width:80, editable:false},
	               {name:'portOfDischarge', width:50, editable:false},
	               {name:'consignee', width:260, editable:false}
			   	];

	var jsonReaderReceivedUnits = {
			root:"rows",
			page:"page",
			total:"total",
			records:"records",
			repeatitems:false,
			cell:"cell",
			id:"seqNo"
		};

	createGrid("receivedUnitsGrid", // grid id for party
			"receivedUnitsPager", // page id for party
			_context+'/booking/bill/loadReceivedUnit', // geturl
			'', // addurl
			'', // edit url
			'', //delete url
			'',// delete selected URL
			receivedUnitsColNames, receivedUnitsColModels, "Received Units",// caption
			83,// height
			3,// row num
			[ 3, 6, 9 ],// row list
			false,// multiselect
			false,// multidelete
			false,// load once
			true, // read only grid
			jsonReaderReceivedUnits, // json reader
			true, // hide edit
			true, // hide delete
			true, // autowidth
			false, // rownumbers
			true, // hide custom add row
			false,// hide pager row
			null,// custom edit method
			null,// custom grid complete
			receivedUnitsGridLoadComplete,// custom load complete
			false,// default hidden
			true);// row Color Based On status
}

//for billed bookings
function readOnlyFieldsForBilledBookings(){
	$('#isAutobill').attr('disabled', true);
	//$('#autobillOptionCode').attr('disabled', true);
	$('#autobillTriggerCode').attr('disabled', true);
}

function navigateToMaintainBillFromUnitGrid(id){
	
	var gridId = id.split('=')[1];

		
		
		var shipmentSequenceNumber = jQuery("#receivedUnitsGrid").getRowData(gridId).billNo;
		var shipment_number = $("#billShipmentNumber").text();
		var shipmentCorrectionNumber ="000";
		
		var url ="";
		url = "/shipment/showForm?shipment_number="+shipment_number+"&shipment_sequence_number="+shipmentSequenceNumber+
		"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ";
		window.location = _context + url;
	//document.location.href = _context+ "/shipment/showForm?shipment_number="+shipmentNumber+"&shipment_sequence_number="+shipmentSequenceNumber+"&shipment_correction_number="+shipmentCorrectionNumber+"&src=";
}

function navigateToMaintainBillFromContainerGrid(id){
	
	var gridId = id.split('=')[1];
	
		
		
		var shipmentSequenceNumber = jQuery("#receivedFreightGrid").getRowData(gridId).billNo;
		var shipment_number = $("#billShipmentNumber").text();
		var shipmentCorrectionNumber ="000";
		
		var url ="";
		url = "/shipment/showForm?shipment_number="+shipment_number+"&shipment_sequence_number="+shipmentSequenceNumber+
		"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ";
		window.location = _context + url;
	//document.location.href = _context+ "/shipment/showForm?shipment_number="+shipmentNumber+"&shipment_sequence_number="+shipmentSequenceNumber+"&shipment_correction_number="+shipmentCorrectionNumber+"&src=";
}



function loadBillStartedGrids(){
	createAndLoadBilledFreightGrid();
	createAndLoadBilledUnitGrid();
	$('#receivedFreightGrid').trigger("reloadGrid");
	$('#receivedUnitsGrid').trigger("reloadGrid");
}

function receivedFreightGridLoadComplete(){
	var receivedFreightCount = $("#receivedFreightGrid").getGridParam("reccount");
	//alert("receivedFreightCount->"+receivedFreightCount);
	if(receivedFreightCount>0)
		$('#receivedFreightGridDiv').show();
	else
		$('#receivedFreightGridDiv').hide();
	//$('#msgDivBill').html("<div class=\"message_info\">Successfully Displayed.</div>");
	//$('#msgDivBill').show();
	//chkIfBillStartedOverlayHyperLinkToShow();
}

function receivedUnitsGridLoadComplete(){
	var receivedUnitCount = $("#receivedUnitsGrid").getGridParam("reccount");
	//alert("receivedUnitCount->"+receivedUnitCount);
	if(receivedUnitCount>0)
		$('#receivedUnitsGridDiv').show();
	else
		$('#receivedUnitsGridDiv').hide();
	//$('#msgDivBill').html("<div class=\"message_info\">Successfully Displayed.</div>");
	//$('#msgDivBill').show();
	//chkIfBillStartedOverlayHyperLinkToShow();
}

/*function chkIfBillStartedOverlayHyperLinkToShow(){
	var receivedUnitCount = $("#receivedUnitsGrid").getGridParam("reccount");
	var receivedFreightCount = $("#receivedFreightGrid").getGridParam("reccount");
	if(receivedUnitCount > 0 || receivedFreightCount > 0){
		$('#billingStartedHyperlink').show();
	}
}
*/
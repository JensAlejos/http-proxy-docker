var lastChangeSource = "";

$(function() {

	$('#selectButtonDiv').hide();
	$('#vvdChangeAuthPartyCode').attr('disabled', true);
	
	
	$('#vvdChangeAuthPartyCode').change(
	   function()
	   {
		   var vvd = $('#vessel').val()+$('#voyage').val()+$('#direction').val();
		   if(vvd=='' & $('#vvdChangeAuthPartyCode :selected').val()!='')
		   {
			   $('#vvdChangeAuthPartyCode').val('');
			   $('#msgOverLayDiv').html('<div class="message_error">Change Source not allowed</div>');
			   window.scrollTo(0, 0);
		   }
		   else
		   {
			   $.ajax({
					url : _context +"/shipment/routing/validateChangeSource",
					data : {changeSource:$('#vvdChangeAuthPartyCode :selected').val(), vvd:vvd},
					success : function(responseText) {
						showResponseMessages('msgOverLayDiv', responseText);
						if(!responseText.success)
					   {
						   $('#vvdChangeAuthPartyCode').val(lastChangeSource);
						  // showResponseMessages('msgOverLayDiv', responseText);
					   }
						else
							lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
					}
			   });
		   }
	   });
	
	   
	//Create VVD Table on main page
	var colNames = [ 'Sequence No', 'Route Sequence No', 'Vessel Voyage Direction', 'Port of Loading', 'Port of Discharge', 'Sail Date', 'Arrival Date', 'ExtensionType'];
	
	var colModel = [ {
		name : 'bookingVoyageSeqNo',
		width : 70
	}, {
		name : 'routeSequenceNumber',
		hidden: true
	}, {
		name : 'vesselVoyageDirection',
		width : 170
	}, {
		name : 'loadPortCode',
		width : 130
	}, {
		name : 'dischargePortCode',
		width : 130
	},
	{
		name : 'sailDate',
		width : 100
	}, {
		name : 'arrivalDate',
		width : 100
	}, {
		name: 'extensionType',
		hidden : true
	}];
	

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "bookingVoyageSeqNo"
	};

	createGrid("vvdRoutingGrid", // grid id for party
	"vvdRoutingPager", // page id for party
	_context+'/shipment/routing/loadVVDGrid', // geturl
	'', // addurl
	'', // edit url
	'', //delete url
	'',// delete selected URL
	colNames, colModel, "",// caption
	83,// height
	3,// row num
	[ 3, 6, 9 ],// row list
	false,// multiselect
	false,// multidelete
	false,// load once
	true, // read only grid
	jsonReader, // json reader
	true, // hide edit
	true, // hide delete
	true, // autowidth
	false, // rownumbers
	true, // hide custom add row
	false,// hide pager row
	null,// custom edit method
	null,// custom grid complete
	null,// custom load complete
	false,// default hidden
	true);// row Color Based On status
	
});

function createVVDSearchGrid(filter)
{
	var colNames = [ 'Trip Seq No', 'Voyage', 'Sail Date', 'Arrival Date', 'Cutoff Date'];
	
	var colModel = [ {
		name : 'tripSeqNo',
		hidden : true
	}, {
		name : 'voyageString',
		width : 300,
		align : 'center',
		formatter : 'showlink',
		formatoptions : {
			baseLinkUrl : "javascript:",
			showAction : "selectTrip('",
			addParam : ", filter="+filter+"');",
		}
	}, {
		name : 'dateOfDeparture',
		align : 'center',
		width : 200
	}, {
		name : 'dateOfArrival',
		align : 'center',
		width : 200
	}, {
		name : 'cutOffdate',
		align : 'center',
		width : 200
	}];
	

	var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		cell : "cell",
		repeatitems : false,
		id : "tripSeqNo"
	};

	createGrid("vvdResultGrid", // grid id for vvd Results
	"vvdResultPager", // page id for party
	_context+'/shipment/routing/loadSearchResults', // geturl
	'', // addurl
	'', // edit url
	'', //delete url
	'',// delete selected URL
	colNames, colModel, "Search Results",// caption
	232,// height
	10,// row num
	[ 10, 20, 30 ],// row list
	false,// multiselect
	false,// multidelete
	false,// load once
	true, // read only grid
	jsonReader, // json reader
	true, // hide edit
	true, // hide delete
	false, // autowidth
	false, // rownumbers
	true, // hide custom add row
	false,// hide pager row
	null,// custom edit method
	null,// custom grid complete
	null,// custom load complete
	false,// default hidden
	true);// row Color Based On status

}

function selectTrip(params)
{
	var seqNo = params.split(',')[0].split('=')[1];
	var filter = params.split(',')[1].split('=')[1];
	$.ajax({
		url : _context +"/shipment/routing/validateSailDate?tripSeqNo="+seqNo,
		success : function(responseText) {
			if(responseText.success)
			{
				if(filter=='routing'){
					showSelectedTripInRouting(seqNo);
				}
				else if(filter=='wiredown'){
					showSelectedVVDInWiredown(seqNo);
				}
				else if(filter=='freight'){
					showSelectedVVDInFreight(seqNo);
				}
			}
			else
			{
				if(responseText.data=='Sail')
				{
					var r = confirm("Sail Date for this VVD has Already Passed. Select?");
					if(r)
					{
						if(filter=='routing'){
							showSelectedTripInRouting(seqNo);
						}
						else if(filter=='wiredown'){
							showSelectedVVDInWiredown(seqNo);
						}
						else if(filter=='freight'){
							showSelectedVVDInFreight(seqNo);
						}
					}
				}
				else
				{
					alert("An error has occurred while selecting vvd");
				}
			}
		}
	});
}

function showSelectedTripInRouting(seqNo){
	
	var queryString =$('#shipmentHouseHoldBasicDetailForm').formSerialize();
	
	$.ajax({
		url : _context +"/shipment/routing/selectTrip?tripSeqNo="+seqNo,
		type: "POST",
		data:queryString,
		success : function(responseText) {
			if(responseText.success)
			{
				$("#vvdRouting").loadJSON(responseText.data);
				$('#msgOverLayDiv').html(""); //HHGS
				$("#vvdRoutingGrid").setGridParam({rowNum : 3, datatype : "json"}).trigger("reloadGrid");
				$("#vvdSearchDialog").dialog('close');
				checkVVDVesselDefaultValue();
				checkVVDVoyageDefaultValue();
				checkIssuePtDefaultValue();
				populateDomesticRoutingExportInstructions();
				setRoutingHeader();
				$('#vessel').val(responseText.data.vessel);
				$('#voyage').val(responseText.data.voyage);
				$('#direction').val(responseText.data.direction);
			}
			else
				alert("An error has occurred while selecting vvd");
		}
	});
}

function showSelectedVVDInFreight(seqNo){
	$.ajax({
		url : _context +"/shipment/routing/selectTripBySeqNo",
		data : {tripSeqNo : seqNo},
		success : function(responseText) {
			if(responseText.success)
			{
				$("#bkdVessel").val(responseText.data.vessel);
				$("#bkdVoyage").val(responseText.data.voyage);
				$("#bkdDirection").val(responseText.data.direction);
				$("#bookedForVVDSeqNo").val(seqNo);
				$("#vvdSearchDialog").dialog('close');
			}
			else
			{
				$("#bookedForVVDSeqNo").val("");
				alert(responseText.messages.error[0]);
			}
		}
	});
}

function showSelectedVVDInWiredown(seqNo) {
	$.ajax({
		url : _context +"/wiredownMaintenance/selectTrip?tripSeqNo=" + seqNo,
		data : {changeSource : $("#vvdChangeAuthPartyCode :selected").val()},
		success : function(responseText) {
			if(responseText.success)
			{
				$("#vvdRouting").loadJSON(responseText.data.routing);
				$("#vvdRoutingGrid").setGridParam({rowNum : 3, datatype : "json"}).trigger("reloadGrid");
				
	              
				$("#vvdSearchDialog").dialog('close');
			}
			else
			{
				alert(responseText.messages.error[0]);
			}
		}
	});
}

function processChangeSource()
{
	if($('#bookingStatusCode').val()=='INCP')
		$('#vvdChangeAuthPartyCode').attr('disabled', false);
	else
		lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
}

function validateVVD()
{
	 $("#vessel").val(($("#vessel").val()).toUpperCase()); 
	 $("#direction").val(($("#direction").val()).toUpperCase()); 
	
	if($('#vessel').val()=='' || $('#voyage').val()=='' || $('#direction').val()=='')
	{
		$.ajax({
			url: _context +"/shipment/routing/removeVVD",
			success: function(responseText){
				$("#originalVVD").loadJSON(responseText);
				//$("#vvdCutOff").loadJSON(responseText);
				$("#vvdRoutingGrid").trigger("reloadGrid");
				$('#vvdChangeAuthPartyCode').val('');
				lastChangeSource = "";
				checkVVDVesselDefaultValue();
				checkVVDVoyageDefaultValue();
				checkIssuePtDefaultValue();
				//populateDomesticRoutingExportInstructions();
				setRoutingHeader();
			}
		});
	}
	else if($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()=='')
	{
		alert("Please select Port of Loading and Port of Discharge first");
		clearVVD();
	}
	else
	{ clearOverlayMessage();
		$.ajax({
			url: _context +"/shipment/routing/validateVVDandItinerary",
			data: {vessel: $('#vessel').val(), voyage: $('#voyage').val(), direction: $('#direction').val(),originPort: $('#originPortCityCode').val(),
				destinationPort: $('#destinationPortCityCode').val()},
			success: function(responseText){
				
				showResponseMessages('msgOverLayDiv', responseText);
				if(responseText.success)
					{
						validateSailDate();
						$('#msgOverLayDiv').html(""); //HHGS
					}
				else
				{
					
					clearVVD();
				}
			}
		});
	}
}

function clearVVD()
{
	$.ajax({
		url: _context +"/shipment/routing/removeVVD",
		success: function(responseText){
			$("#vvdRouting").loadJSON(responseText);
			lastChangeSource = "";
			//$("#vvdCutOff").loadJSON(responseText);
			$("#vvdRoutingGrid").setGridParam({rowNum : 3, datatype : "json"}).trigger("reloadGrid");
			checkVVDVesselDefaultValue();
			checkVVDVoyageDefaultValue();
			checkIssuePtDefaultValue();
			//populateDomesticRoutingExportInstructions();
			setRoutingHeader();
		}
	});
}
function poulateVVDLegs()
{
	$.ajax({
		url: _context +"/shipment/routing/getItinerary",
		//data: {vessel: $('#vessel').val(), voyage: $('#voyage').val(), direction: $('#direction').val(), originPort: $('#originPortCityCode').val(), destinationPort: $('#destinationPortCityCode').val()},
		success: function(responseText){
			showResponseMessages('msgOverLayDiv', responseText);
			$("#vvdRouting").loadJSON(responseText.data);
			//$("#vvdCutOff").loadJSON(responseText.data);
			$("#vvdRoutingGrid").trigger("reloadGrid");
			checkVVDVesselDefaultValue();
			checkVVDVoyageDefaultValue();
			checkIssuePtDefaultValue();
			populateDomesticRoutingExportInstructions();
			setRoutingHeader();
			/*if(responseText.success)
				$("#vvdChangeAuthPartyCode").val(lastChangeSource);
			else
				lastChangeSource = "";*/
		}
	});
}
function validateSailDate()
{
	$.ajax({
		url: _context +"/shipment/routing/validateSailDateForVVD",
		data: {vessel: $('#vessel').val(), voyage: $('#voyage').val(), direction: $('#direction').val(), originPort: $('#originPortCityCode').val(), destinationPort: $('#destinationPortCityCode').val()},
		success: function(responseText){
			if(responseText.success)
				poulateVVDLegs();
			else
			{
				var r = confirm("Sail Date for this VVD has Already Passed. Select?");
				if(r)
					poulateVVDLegs();
				else
					clearVVD();
			}
		}
	});
}
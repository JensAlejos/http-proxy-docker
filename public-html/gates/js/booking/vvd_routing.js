var lastChangeSource = "";
var firstLoad;

$(function() {

	//$('#selectButtonDiv').hide();
	
	$('#vvdChangeAuthPartyCode').change(
	   function()
	   {
		  /*if($('#bookingStatusCode :selected').val()== 'INCP' || lastChangeSource=='')
		  {*/
			   if(($('#vessel').val()=='' || $('#voyage').val()=='' || $('#direction').val()=='')
					   && $('#vvdChangeAuthPartyCode :selected').val()!='')
			   {
				   $('#vvdChangeAuthPartyCode').val('');
				   $('#msgDiv').html('<div class="message_error">Change Source not allowed</div>');
				   window.scrollTo(0, 0);
				   triggerErrorMessageAlert();
			   }
			   else
			   {
				   var vvd = $('#bkdVessel').val()+handleVoyage($('#bkdVoyage').val())+$('#bkdDirection').val();
				   $.ajax({
						url : _context +"/booking/routing/validateChangeSource",
						data : {changeSource:$('#vvdChangeAuthPartyCode :selected').val(), vvd:vvd},
						success : function(responseText) {
							showResponseMessages('msgDiv', responseText);
							if(!responseText.success)
						   {
							   $('#vvdChangeAuthPartyCode').val(lastChangeSource);
							  // showResponseMessages('msgDiv', responseText);
						   }
							else
								lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
						}
				   });
			   }
		  /*}
		  else
		  {
			  $('#vvdChangeAuthPartyCode').val(lastChangeSource);
			  $('#msgDiv').html('<div class="message_error">Change Source cannot be changed</div>');
			  window.scrollTo(0, 0);
		  }*/
	   });
	
	   
	//Create VVD Table on main page
	var colNames = [ 'Sequence No', 'Route Sequence No', 'Vessel Voyage Direction', 'Port of Loading', 'Port of Discharge', 'Sail Date', 'Arrival Date','extensionType'];
	
	var colModel = [ {
		name : 'bookingVoyageSeqNo',
		width : 70
	}, {
		name : 'routeSequenceNumber',
		hidden : true
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
		name : 'extensionType',
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

	/*Booking Security*/
	if(isRoutingDisplayOnly || isRoutingModifiable){
		createGrid("vvdRoutingGrid", // grid id for party
		"vvdRoutingPager", // page id for party
		_context+'/booking/routing/loadVVDGrid', // geturl
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
		vvdMainGridComplete,// custom grid complete
		null,// custom load complete
		false,// default hidden
		true);// row Color Based On status
		
		$("#vvdRoutingGrid").jqGrid('setGridParam',{
			beforeSelectRow: function(rowId, e) {
					 return false;
			 }
		});
	}
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
			addParam : ", filter="+filter+"');"
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
	_context+'/booking/routing/loadSearchResults', // geturl
	'', // addurl
	'', // edit url
	'', //delete url
	'',// delete selected URL
	colNames, colModel, "Search Results",// caption
	232,// height
	500,// row num
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
	vvdSearchLoadComplete,// custom load complete
	false,// default hidden
	true);// row Color Based On status

}

var vvdMainGridComplete = function()
{
	 $('#vvdRoutingPager .ui-pg-input').attr("readonly", true);
	 $.ajax({
			url: _context +"/booking/routing/getRoutingInstructions",
			success: function(responseText){
				if($("#overrideRouteInstruction").val()!='')
				{
					if($("#overrideRouteInstruction").val()==responseText)
					{
						$('#overrideRouteInstruction').css('color','black');
						setOverridesHeader();
					}
					else
					{
						//D028751: 	**gates PROD**F trade maintain booking- DEFECT IN BKG OVERRIDES - domestic routing export instructions
						/*if($('#bookingId').val()=='')
						{
							$("#overrideRouteInstruction").val(responseText);
							$('#overrideRouteInstruction').css('color','black');
							setOverridesHeader();
						}
						else
						{*/
							$('#overrideRouteInstruction').css('color','green');
							$('#overrideHeaderCheckBox').attr('checked', true);
							setOverridesHeader();
						//}
					}
				}
				else
				{
					$("#overrideRouteInstruction").val(responseText);
					$('#overrideRouteInstruction').css('color','black');
					setOverridesHeader();
				}
			}
	 });
};

function selectTrip(params)
{
	var seqNo = params.split(',')[0].split('=')[1];
	var filter = params.split(',')[1].split('=')[1];
	
	var rowIDs = jQuery("#vvdResultGrid").getDataIDs(); 
	for (var i=0;i<rowIDs.length;i=i+1)
	{
	   var rowData=jQuery("#vvdResultGrid").getRowData(rowIDs[i]);
	   if((rowData.tripSeqNo).toString() == seqNo)
	   {
		   var vvds = rowData.voyageString.split("  --  ")[0].split(" ");
		   var selectedVessel = vvds[0];
		   var selectedVoyage = handleVoyage(vvds[1]);
		   var selectedDirection = vvds[2];
		   if(selectedVessel == $('#vessel').val() && selectedVoyage == handleVoyage($('#voyage').val())
				   && selectedDirection == $('#direction').val() && $("#sailDate").val() != '')
			   alert("VVD already present on booking");
		   else
		   {
			   $.ajax({
					url : _context +"/booking/routing/selectTripFromGrid",
					data :{
						tripSeqNo:seqNo,
						callingParty : filter,
						blOrigin: $('#blOriginCityCode').val()
					},
					success : function(responseText) {
						if(responseText.success)
						{
							if(filter=='routing'){
								selectTripSuccessFunction(responseText);
							} else if(filter=='freight'){
								freightSuccessFunction(responseText);
							}
							$("#vvdSearchDialog").dialog('close');
							var estShipDate = $('#estShip').text();
							var estimatedDropOffDate =$('#estimatedDropOffDate').val();
							if(filter=='routing' && estShipDate!='' && estimatedDropOffDate!='' && new Date($('#estimatedDropOffDate').val()).getTime() > new Date(estShipDate).getTime()){
							//$('#estimatedDropOffDate').validationEngine('showPrompt', '* Est Drop Off date cannot be greater than Est Ship date.', 'error', 'topRight', true);
							alert("Est Drop Off date cannot be greater than Est Ship date.");
							return false;
							}
						}
						else
						{
							if(responseText.data=='Sail')
							{
								var r = confirm("Sail Date for this VVD has Already Passed. Select?");
								if(r){
									selectTripAfterDateConfirmation('lookUp', filter);
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
	   }
	}
}

function selectTripAfterDateConfirmation(callingType, filter){
	$('#msgDiv').html('');
	$.ajax({
		url : _context +"/booking/routing/selectTripAfterDateConfirmation",
		data: {
			callingParty:filter,
			blOrigin: $('#blOriginCityCode').val()
			},
		success : function(responseText) {
			if(responseText.success)
			{
				if(filter=='routing')
					selectTripSuccessFunction(responseText);
				else if(filter=='freight')
					freightSuccessFunction(responseText);
				
				if(callingType == 'lookUp')
					$("#vvdSearchDialog").dialog('close');
				else if(callingType == 'manual')
					$.unblockUI();
			}
			else
			{
				if(callingType == 'lookUp')
					alert("An error has occurred while selecting vvd");
				else if(callingType == 'manual')
				{
					$.unblockUI();
					if(filter=='routing')
						showResponseMessages('msgDiv', responseText);
					else if(filter=='freight')
						showResponseMessages('msgDivFrt', responseText);
				}
			}
		}
	});
}

function clearVoyage() {
	$('#newVoyage').val("");
	$('#newDirection').val("");
}

function clearDirection() {
	$('#newDirection').val("");
}

function validateVVD(filter)
{
	var vesselSelector = '';
	var voyageSelector = '';
	var directionSelector = '';
	
	if(filter == 'routing')
	{
		vesselSelector = "#newVessel";
		voyageSelector = "#newVoyage";
		directionSelector = "#newDirection";
	}
	else if(filter == 'freight')
	{
		vesselSelector = "#bkdVessel";
		voyageSelector = "#bkdVoyage";
		directionSelector = "#bkdDirection";
	}
	
	$(vesselSelector).val(($(vesselSelector).val()).toUpperCase()); 
	$(directionSelector).val(($(directionSelector).val()).toUpperCase()); 
	 
	if($('#originPortCityCode').val()=='' || $('#destinationPortCityCode').val()=='')
	{
		alert("Please select Port of Loading and Port of Discharge first");
	}
	else if($(vesselSelector).val()!='' && $(voyageSelector).val()!='' && $(directionSelector).val()!='')
	{
		if($(vesselSelector).val()==$('#vessel').val() && handleVoyage($(voyageSelector).val())==handleVoyage($('#voyage').val())
				&& $(directionSelector).val()==$('#direction').val() && $("#sailDate").val() != '')
		{
			alert("VVD same as already present on booking");
		}
		else
		{
			if(filter == 'routing')
				$('#msgDiv').html('');
			else if(filter == 'freight')
				$('#msgDivFrt').html('');
			blockUI();
			$.ajax({
				url: _context +"/booking/routing/validateVVDManual",
				data: { vessel: $(vesselSelector).val(),
						voyage: handleVoyage($(voyageSelector).val()), 
						direction: $(directionSelector).val(),
						originPort: $('#originPortCityCode').val(),
						destinationPort: $('#destinationPortCityCode').val(),
						callingParty : filter,
						blOrigin: $('#blOriginCityCode').val()
				  	},
				success: function(responseText){
					if(responseText.success)
					{
						selectTripSuccessFunction(responseText);
						if(filter == 'routing')
							showResponseMessages('msgDiv', responseText);
						else if(filter == 'freight')
							showResponseMessages('msgDivFrt', responseText);
						$.unblockUI();
					}
					else
					{
						if(responseText.data=='Sail')
						{
							var r = confirm("Sail Date for this VVD has Already Passed. Select?");
							if(r)
								selectTripAfterDateConfirmation('manual', filter);
							else
								$.unblockUI();
						}
						else
						{
							if(filter == 'routing')
								showResponseMessages('msgDiv', responseText);
							else if(filter == 'freight')
								showResponseMessages('msgDivFrt', responseText);
							$.unblockUI();
						}
					}
				}
			});
		}
	}
}

function selectTripSuccessFunction(responseText)
{
	$('#vvdCutOff input').val('');
	$('#vvdCutOff .cutOff').text('');
	$("#vvdRouting").loadJSON(responseText.data);
	$("#vvdCutOff").loadJSON(responseText.data);
	$("#vvdChangeAuthPartyCode").val(lastChangeSource);
	$("#vvdRoutingGrid").trigger("reloadGrid");
	checkVVDVesselDefaultValue();
	$('#overrideInitialVesselName').val(responseText.data.overrideInitialVesselName);
	checkVVDVoyageDefaultValue();
	checkIssuePtDefaultValue();
	setRoutingHeader();
	setFirstVVD();
	isBookingChanged = "Y";
	$('#msgDiv').html('');
	
	if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) != 
		($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text()) 
		&& $('#bookingId').val()!='' && isRoutingModifiable)
	{
		$('#vvdChangeAuthPartyCode').attr('disabled', false);
		$('#changeSourceLabel').html("Change Source<span class='mandatory'>*</span>");
	}
	else if(($('#vessel').val()+handleVoyage($('#voyage').val())+$('#direction').val()) == 
		($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text())
		&& $("#vvdChangeAuthPartyCode :selected").val()=='')
	{
		$('#vvdChangeAuthPartyCode').attr('disabled', true);
		$('#changeSourceLabel').html("Change Source");
	}
	
	$("#bkdVessel").val($('#vessel').val());
	$("#bkdVoyage").val(handleVoyage($('#voyage').val()));
	$("#bkdDirection").val($('#direction').val());
	$("#estShip").html($('#sailDate').val());
	
	isBookingChanged = "Y";
}

function freightSuccessFunction(responseText)
{
	$("#bkdVessel").val(responseText.data.vessel);
	$("#bkdVoyage").val(responseText.data.voyage);
	$("#bkdDirection").val(responseText.data.direction);
	$("#estShip").html(responseText.data.sailDate);
	
	if(($('#bkdVessel').val()+handleVoyage($('#bkdVoyage').val())+$('#bkdDirection').val()) != 
		($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text()) 
		&& $('#bookingId').val()!='' && isRoutingModifiable)
	{
		$('#vvdChangeAuthPartyCode').attr('disabled', false);
		$('#changeSourceLabel').html("Change Source<span class='mandatory'>*</span>");
	}
	else if(($('#bkdVessel').val()+handleVoyage($('#bkdVoyage').val())+$('#bkdDirection').val()) == 
		($('#originalVesselCode').text()+handleVoyage($('#originalVoyage').text())+$('#originalDirectionSeq').text())
		&& $("#vvdChangeAuthPartyCode :selected").val()=='')
	{
		$('#vvdChangeAuthPartyCode').attr('disabled', true);
		$('#changeSourceLabel').html("Change Source");
	}
	
	$('#freightVVDModified').val('Y');
	isBookingChanged = "Y";
	$('#msgDivFrt').html('');
}

function clearVVD()
{
	$.ajax({
		url: _context +"/booking/routing/removeVVD",
		success: function(responseText){
			$("#vvdRouting").loadJSON(responseText);
			lastChangeSource = "";
			$("#vvdCutOff").loadJSON(responseText);
			$("#vvdRoutingGrid").trigger("reloadGrid");
			checkVVDVesselDefaultValue();
			checkVVDVoyageDefaultValue();
			checkIssuePtDefaultValue();
			checkDomesticRoutingInstructions();
			setRoutingHeader();
		}
	});
}


function processChangeSource()
{
	$('#vvdChangeAuthPartyCode').attr('disabled', true);
	if($('#bookingId').val()!='' && isRoutingModifiable && $('#vvdChangeAuthPartyCode :selected').val()!='')
	{
		lastChangeSource = $('#vvdChangeAuthPartyCode :selected').val();
		$('#changeSourceLabel').html("Change Source<span class='mandatory'>*</span>");
	}
	else
	{
		lastChangeSource = "";
		$('#changeSourceLabel').html("Change Source");
	}
}

var vvdSearchLoadComplete = function()
{
	if(firstLoad == "Y")
	{
		$('#searchVVDButton').trigger('click');
		firstLoad = "N";
		$('#vvdResultPager .ui-pg-input').attr("readonly", true);
	}
	else
		$.unblockUI();
};

function refreshVVDInfo()
{
	/*$.ajax({
		url: _context +"/booking/routing/refreshVVDInfoAfterSave",
		success: function(responseText){
			$('#originalVVD').loadJSON(responseText);
			setRoutingHeader();*/
			$('#newVessel').val('');
			$('#newVoyage').val('');
			$('#newDirection').val('');
		/*}
	});*/
	if($('#overrideInitialLtvDate').val() =='01-01-0001')
		$('#overrideInitialLtvDate').val('');
}

function handleVoyage(voyage)
{
	if(voyage.length==1)
		voyage = "00" + voyage;
	else if(voyage.length==2)
		voyage = "0" + voyage;
	
	return voyage;
}
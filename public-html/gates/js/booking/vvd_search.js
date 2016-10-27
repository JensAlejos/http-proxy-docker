$(function() {
	   $('#availabilityDate').datepicker({ dateFormat: 'mm-dd-yy' });
	   $('#deliveryDate').datepicker({ dateFormat: 'mm-dd-yy' });
	 
	   $('#searchVVDButton').click(function()
	   {
		   if(validateSearchVVDFields())
		   {
			   var queryString = $('#vvdSearchForm').formSerialize();
			   blockUI();
			   $.ajax({
					url: _context +"/booking/routing/searchTrip",
					data: queryString,
					type:'POST',
					success: function(responseText){
						$("#vvdResultGrid").trigger("reloadGrid");
						if(responseText.success==true)
						{
							$("#vvdResultGridDiv").show();
							$("#vvdSearchDialog").dialog({height: 730});
						}
						else
						{
							$.unblockUI();
							alert(responseText.messages.error[0]);
						}
					}
				});
		   }
	});
	   
	 //Hiding vvd_search.jsp on initial display
		$("#vvdSearchDialog").hide();
       
  });

function createVVDSearchDialog(filter){
	//alert("createVVDSearchDialog: " + filter);
	var buttons = {};
	if(filter=='multipleBooking')
	{
		buttons = {
				"Cancel":function()
				{
					$("#vvdSearchDialog").dialog('close');
				},
				"Select VVDs" :function()
				{
					var selRowIds = jQuery('#vvdResultGrid').jqGrid('getGridParam', 'selarrrow');
					if(selRowIds==null || selRowIds=='')
					{
						alert("Please select VVDs");
					}
					else
					{
						var vvds = "";
					  	for (var i=0;i<selRowIds.length;i=i+1)
					    { 
					  		var rowData=jQuery("#vvdResultGrid").getRowData(selRowIds[i]);
					  		if(i==0)
					  		{
					  			vvds = rowData.voyageString;
					  		}
					  		else
					  		{
					  			vvds = vvds+", "+rowData.voyageString;
					  		}
						}
					  	$('#vvd').val(vvds);
					  	$("#vvdSearchDialog").dialog('close');
					}
				},
				"Export To Excel":function()
				{
					var link = document.createElement("a");    
					link.id="vvdGridExport";
					$("#vvdSearchDialog").append(link);
					jQuery("#vvdGridExport").attr({
					    'download': "VVD_Search_Results",
					    'href': _context+ "/booking/routing/vvdGridExport"
					}); 
					jQuery('#vvdGridExport')[0].click();    
					$("#vvdSearchDialog").remove(link);
				}
			};
	}
	else
	{
		buttons = {
				"Cancel":function()
				{
					$("#vvdSearchDialog").dialog('close');
				},
				"Export To Excel":function()
				{
					var link = document.createElement("a");    
					link.id="vvdGridExport";
					$("#vvdSearchDialog").append(link);
					jQuery("#vvdGridExport").attr({
					    'download': "VVD_Search_Results",
					    'href': _context+ "/booking/routing/vvdGridExport"
					}); 
					jQuery('#vvdGridExport')[0].click();    
					$("#vvdSearchDialog").remove(link);
				}
		};
	}
	$("#vvdSearchDialog").dialog({
		autoOpen : false,
		width : 990,
		modal : true,
		title: "Search VVD",
		open : function()
		{
			$("#vvdSearchDialog").dialog({height: 400});
			$("#vvdSearchForm").clearForm();
			$('#duration').val("30");
			if(filter=='freight' && $('#estimatedDropOffDate').val()!==''
				&& validateDate('estimatedDropOffDate', false) && validateWithCurrentDate())
			{
				$('#availabilityDate').val($('#estimatedDropOffDate').val());
				$('.searchCriteria')[0].checked = true;
			}
			else
			{
				$('.searchCriteria')[2].checked = true;
			}
			$("#vvdResultGridDiv").hide();
			$('#vvdSearchForm').validationEngine('attach');
			firstLoad = "Y";
			createVVDSearchGrid(filter);
		},
		close : function() {
			$("#vvdSearchForm").validationEngine('hideAll');
			$('#vvdSearchForm').validationEngine('detach');
			$('#vvdResultGrid').jqGrid('GridUnload');
			firstLoad = "Y";
		},
		buttons: buttons
	});
}

function validateSearchVVDFields()
{
	$("#vvdSearchForm").validationEngine('hideAll');
	
	if($("#searchCriteria:checked").val()==undefined)
	{
		$("#searchCriteria").validationEngine('showPrompt', 'Please select a search criteria', 'error', true);
		return false;
	}
	else if($("#searchCriteria:checked").val()=='A' && ($('#availabilityDate').val()==null || $('#availabilityDate').val()==''))
	{
		$("#availabilityDate").validationEngine('showPrompt', 'Please enter arrival cutt off date', 'error', true);
		return false;
	}
	else if($("#searchCriteria:checked").val()=='D' && ($('#deliveryDate').val()==null || $('#deliveryDate').val()==''))
	{
		$("#deliveryDate").validationEngine('showPrompt', 'Please enter delivery cutt off date', 'error', true);
		return false;
	}
	else
		return true;
}

function openSearchVVD(filter)
{
	if(filter=='freight' && $('#estimatedDropOffDate').val()!==''
				&& validateDate('estimatedDropOffDate', false) && !validateWithCurrentDate())
	{
		$('#bkdVessel').validationEngine('showPrompt', '* Enter a valid Est drop off in MM-dd-yyyy format greater than\ equal to current date.', 'error', 'topRight', true);
		return false;
		//alert("Please enter a valid date in MM-dd-yyyy format gretear than equal to current date");
	}
	else
	{
		if($('#originPortCityCode').val()!='' && $('#destinationPortCityCode').val()!='')
		{
			if((filter=='routing' || filter=='freight') && ($('#originPortCityCodeDescription').val()=='' || 
					$('#destinationPortCityCodeDescription').val()==''))
				alert("Please select Port of Loading and Port of Discharge first");
			else
			{
				$.ajax({
					url: _context +"/booking/routing/showSearchForm",
					data:{pol:$('#originPortCityCode').val(), pod:$('#destinationPortCityCode').val()},
					success: function(responseText){
						createVVDSearchDialog(filter);
						$("#vvdSearchForm").loadJSON(responseText);
						$("#vvdSearchDialog").dialog('open');
					}
				});
			}
		}
		else
			alert("Please select Port of Loading and Port of Discharge first");
	}
}

function validateWithCurrentDate()
{
	/*var todaysDate = new Date();
	var enteredDate = $("#estimatedDropOffDate").datepicker("getDate");
	if(enteredDate < todaysDate)
		return false;
	else
		return true;*/
	
		var fullDate = new Date();
		//convert month to 2 digits 
		var twoDigitMonth = ((fullDate.getMonth()+1) < 10)? '0' + (fullDate.getMonth()+1) : (fullDate.getMonth()+1); 
		var twoDigitDate = ((fullDate.getDate()) < 10)? '0' + (fullDate.getDate()) : (fullDate.getDate());
		// mm-dd-yy
		var currentDate = twoDigitMonth + "-" + twoDigitDate + "-" + fullDate.getFullYear(); 
		
		if(new Date($('#estimatedDropOffDate').val()).getTime() < new Date(currentDate).getTime()){
			return false;
		}
		else{
			return true;
		}
}
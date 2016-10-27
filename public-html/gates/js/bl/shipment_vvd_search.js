$(function() {
	   $('#availabilityDate').datepicker({ dateFormat: 'mm-dd-yy',minDate:-90, maxDate:"+270D" });
	   $('#deliveryDate').datepicker({ dateFormat: 'mm-dd-yy',minDate:-90, maxDate:"+270D" });
	   
	   $('#searchVVDButton').click(function()
	   {
		   if(validateSearchVVDFields())
		   {
			   var queryString = $('#vvdSearchForm').formSerialize();
			   $.ajax({
					url: _context +"/shipment/routing/searchTrip",
					data: queryString,
					type:'POST',
					success: function(responseText){
						if(responseText.success==true)
						{
							$("#vvdResultGrid").setGridParam({rowNum : 10, datatype : "json"}).trigger("reloadGrid");
							$("#vvdResultGridDiv").show();
							$("#vvdSearchDialog").dialog({height: 730});
						}
						else
							alert(responseText.messages.error[0]);
					}
				});
		   }
	});
	   
	 //Hiding vvd_search.jsp on initial display
		$("#vvdSearchDialog").hide();
       
  });

function createVVDSearchDialog(filter){
	//alert("createVVDSearchDialog: " + filter);
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
			$("#vvdResultGridDiv").hide();
			$('#vvdSearchForm').validationEngine('attach');
			createVVDSearchGrid(filter);
		},
		close : function() {
			$('#vvdResultGrid').jqGrid('GridUnload');
		},
		buttons:{
			Cancel:function()
			{
				$('#vvdSearchForm').validationEngine('detach');
				$("#vvdSearchDialog").dialog('close');
			},
			"Export To Excel":function()
			{
				var link = document.createElement("a");    
				link.id="vvdGridExport";
				$("#vvdSearchDialog").append(link);
				jQuery("#vvdGridExport").attr({
				    'download': "VVD_Search_Results",
				    'href': _context+ "/shipment/routing/vvdGridExport"
				}); 
				jQuery('#vvdGridExport')[0].click();    
				$("#vvdSearchDialog").remove(link);
			}
		}
	});
}

function validateSearchVVDFields()
{
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
	//alert("openSearchVVD: " + filter);
	if(!($("#statusCode").text()=='ISSUED' || $("#statusCode").text()=='CORRECTED' || isRoutingModifiable==false)){
	if($('#originPortCityCodeDescription').val()!='' && $('#destinationPortCityCodeDescription').val()!='')
	{
		$.ajax({
			url: _context +"/shipment/routing/showSearchForm",
			data:{pol:$('#originPortCityCode').val(), pod:$('#destinationPortCityCode').val()},
			success: function(responseText){
				createVVDSearchDialog(filter);
				$("#vvdSearchDialog").dialog('open');
				$("#vvdSearchForm").loadJSON(responseText);
			}
		});
	}
	else
		alert("VVD cannot be selected as Origin and Destination Port not present.");
	}
}
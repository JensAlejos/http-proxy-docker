var oldForm;


$(function() {
	//Function for security on buttons for defect D027288
	enableSecurityOnButtons();
	$('#moveToBooking')
	.bind(
			'keydown',
			function(event) {
				if (event.keyCode == 13 || event.keyCode == 9) {
					var containerCount = $("#moveToBooking").val().length;
					 if(containerCount == '0'){
						 clearMoveToBookingFields();
							$("#transferBtn").attr("disabled", "disabled");
							$("#linkBtn").attr("disabled", "disabled");
					 }else{
							var containerCount = $("#moveToBooking").val().length;
							if(containerCount == '7')
							{
								var currentBooking = $("#currentBookingForDisplay").val();
								var moveToBooking = $("#moveToBooking").val();
								if(currentBooking != moveToBooking)
								{
									var queryString = $('#freightAssignmentForm').formSerialize();
									blockUI();
									$.ajax({
										type: "POST",
										url: _context +"/containerLinkage/getBookingDetailsForBooking",
										data: queryString,
										success: function(responseText){
											$.unblockUI();
											$("#freightAssignmentForm").loadJSON(responseText.data);
											populateFieldsForAjax(responseText);
											showResponseMessages(responseText.messages);

											validateDateTimeMoveTo();
											$('#freightAssignmentForm').validationEngine('detach');
											$('#freightAssignmentForm').validationEngine('attach');
											
											var currentBookingForDisplay =$("#currentBookingForDisplay").val();
											if(currentBookingForDisplay!=null && currentBookingForDisplay !=""){
											$("#moveToAssignedDate").val($("#currentAssignedDate").val());
											$("#moveToAssignedTime").val($("#currentAssignedTime").val());
											$("#moveToReleasedTime").val($("#currentReleasedTime").val());
											$("#moveToReleasedDate").val($("#currentReleasedDate").val());
											}
											enableDisableButtons();
										}
									});
								}
								else
								{
									$("#transferBtn").attr("disabled", "disabled");
									showErrorMessage('msgDiv','Current booking and move to booking cannot be same.');
								}
							}

							else
							{
								alert("Please enter booking number of 7 characters");
							}
						
						}
					 }
			});
	
	$('#currentBookingForDisplay').bind('keydown',function(event) {
				if (event.keyCode == 13 || event.keyCode == 9) {
					var containerCount = $("#currentBookingForDisplay").val().length;
					 if(containerCount == '0'){
						 $('#currentShipperNameForDisplay').html('');
							$('#currentVvdForDisplay').html('');
							$('#currentPortOfLoadingForDisplay').html('');
							$('#currentBookingStatusForDisplay').html('');
							$('#currentPortOfDischargeForDisplay').html('');
							$('#varianceByGemsForDisplay').html('');
							$('#varianceByBookingForDisplay').html('');
							$("#currentBookingForDisplay").val("");
							$("#currentAssignedDate").val("");
							$("#currentAssignedTime").val("");
							$("#currentReleasedDate").val("");
							$("#currentReleasedTime").val("");
							disableAllButtons();
					 }else{
							var queryString = $('#freightAssignmentForm').formSerialize();
							blockUI();
							$.ajax({
								type: "POST",
								url: _context +"/containerLinkage/getReceivedBookingForCurrentBooking",
								data: queryString,
								success: function(responseText){
									$.unblockUI();
									$("#freightAssignmentForm").loadJSON(responseText.data);
									populateFieldsForAjax(responseText);
									jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
									showResponseMessages(responseText.messages);
									var currentTime = $("#currentReleasedDate").val();
									if(currentTime==''||currentTime==null){
										disableAllButtons();
									}else{
										$("#deleteLink").removeAttr("disabled");
										$("#unlinkBtn").removeAttr("disabled");
										$("#saveBtn").removeAttr("disabled");
										// If this page just loaded, capture the container #.
										if(!$("#containerNoHidden").val()) 
										{
											$("#containerNoHidden").val($("#containerHead").val());
										}
									}
								}
							});
				
					 }
					 }
			});
	
	
	$('#currentBookingForDisplay').focusout(function() {
		//Added space condition for D031009
		if ($('#currentBookingForDisplay').val().length== '0' || $('#currentBookingForDisplay').val()==" "){
			$('#currentShipperNameForDisplay').html('');
			$('#currentVvdForDisplay').html('');
			$('#currentPortOfLoadingForDisplay').html('');
			$('#currentBookingStatusForDisplay').html('');
			$('#currentPortOfDischargeForDisplay').html('');
			$('#varianceByGemsForDisplay').html('');
			$('#varianceByBookingForDisplay').html('');
			$("#currentBookingForDisplay").val("");
			$("#currentAssignedDate").val("");
			$("#currentAssignedTime").val("");
			$("#currentReleasedDate").val("");
			$("#currentReleasedTime").val("");
			disableAllButtons();
		}
	});	

	/*$('#moveToBooking')
				.bind(
						'keypress',
						function(event) {
							// keyCode for enter key is 13
							if (event.keyCode == 13) {
								var containerCount = $("#moveToBooking").val().length;
								 if(containerCount == '7')
					        	 {
									 var currentBooking = $("#currentBooking").val();
									 var moveToBooking = $("#moveToBooking").val();
									 if(currentBooking != moveToBooking)
										 {
												var queryString = $('#freightAssignmentForm').formSerialize();
												$.ajax({
													type: "POST",
															url: _context +"/containerLinkage/getBookingDetailsForBooking",
															data: queryString,
															success: function(responseText){
																$("#freightAssignmentForm").loadJSON(responseText.data);
																populateFieldsForAjax(responseText);
																showResponseMessages(responseText.messages);

																validateDateTimeMoveTo();
																$('#freightAssignmentForm').validationEngine('detach');
																$('#freightAssignmentForm').validationEngine('attach');
																enableDisableButtons();
															}
														});
										 }
									 else
										 {
										 $("#transferBtn").attr("disabled", "disabled");
										 alert("Current booking and move to booking cannot be same.");
										 }
													}

							else
								{
								alert("Please enter booking number of 7 characters");
								}
							}
							});		
	 */
	var url = _context
	+ '/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch=B';
	$('#currentBookingForDisplay')
	.gatesAutocomplete(
			{
				source : url,
				minLength : 7,
				formatItem : function(data) {
					return data.shno;
				},
				formatResult : function(data) {
					return data.shno;
				},
				select : function(data) {

							var queryString = $('#freightAssignmentForm').formSerialize();
							$.ajax({
								type: "POST",
								url: _context +"/containerLinkage/getReceivedBookingForCurrentBooking",
								data: queryString,
								success: function(responseText){
									$("#freightAssignmentForm").loadJSON(responseText.data);
									populateFieldsForAjax(responseText);
									jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
									showResponseMessages(responseText.messages);
									var currentTime = $("#currentReleasedDate").val();
									if(currentTime==''||currentTime==null){
										disableAllButtons();
									}else{
										$("#deleteLink").removeAttr("disabled");
										$("#unlinkBtn").removeAttr("disabled");
										$("#saveBtn").removeAttr("disabled");
									}
									//D026572
									if(!$("#containerNoHidden").val()) 
									{
										$("#containerNoHidden").val($("#containerHead").val());
									}
								}
							});
					
				}
			});
	
	// Booking# Predictive Search
	var url = _context
	+ '/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch=B';
	$('#moveToBooking')
	.gatesAutocomplete(
			{
				source : url,
				minLength : 7,
				formatItem : function(data) {
					return data.shno;
				},
				formatResult : function(data) {
					return data.shno;
				},
				select : function(data) {

					var containerCount = $("#moveToBooking").val().length;
					if(containerCount == '7')
					{
						var currentBooking = $("#currentBookingForDisplay").val();
						var moveToBooking = $("#moveToBooking").val();
						if(currentBooking != moveToBooking)
						{
							var queryString = $('#freightAssignmentForm').formSerialize();
							$.ajax({
								type: "POST",
								url: _context +"/containerLinkage/getBookingDetailsForBooking",
								data: queryString,
								success: function(responseText){
									$("#freightAssignmentForm").loadJSON(responseText.data);
									populateFieldsForAjax(responseText);
									showResponseMessages(responseText.messages);

									validateDateTimeMoveTo();
									$('#freightAssignmentForm').validationEngine('detach');
									$('#freightAssignmentForm').validationEngine('attach');
									
									var currentBookingForDisplay =$("#currentBookingForDisplay").val();
									if(currentBookingForDisplay!=null && currentBookingForDisplay !=""){
									$("#moveToAssignedDate").val($("#currentAssignedDate").val());
									$("#moveToAssignedTime").val($("#currentAssignedTime").val());
									$("#moveToReleasedTime").val($("#currentReleasedTime").val());
									$("#moveToReleasedDate").val($("#currentReleasedDate").val());
									var date= $("#moveToReleasedDate").val();
										if(date=='12-31-9999')
										{
											$("#moveToReleasedTime").removeClass("validate\[required\]");
										}
										else
										{
											$("#moveToReleasedTime").addClass("validate[required]");
										}
									}
									enableDisableButtons();
								}
							});
						}
						else
						{
							$("#transferBtn").attr("disabled", "disabled");
							showErrorMessage('msgDiv','Current booking and move to booking cannot be same.');
						}
					}

					else
					{
						alert("Please enter booking number of 7 characters");
					}
				}
			});
	$('#containerHead').focus(); 
});

$(function() {
	
	//D026475
	
	$("#moveToReleasedDate").change(function() {
		var date= $("#moveToReleasedDate").val();
		if(date=='12-31-9999')
		{
			$("#moveToReleasedTime").removeClass("validate\[required\]");
			//D029908
			if($("#moveToReleasedTime").val() == ''){
				$("#moveToReleasedTime").val("00:00:00");
			}
		}
		else
		{
			$("#moveToReleasedTime").addClass("validate[required]");
		}
	});
	$("#moveToReleasedTime").change(function() {
		var date= $("#moveToReleasedDate").val();
		if(date=='12-31-9999')
		{
			$("#moveToReleasedTime").removeClass("validate\[required\]");
			//D029908
			if($("#moveToReleasedTime").val() == ''){
				$("#moveToReleasedTime").val("00:00:00");
			}
		}
		else
		{
			$("#moveToReleasedTime").addClass("validate[required]");
		}
	});
	$("#currentReleasedDate").change(function() {
		var date=$("#currentReleasedDate").val();
		if(date=='12-31-9999')
		{
			$("#currentReleasedTime").removeClass("validate\[required\]");
		}
		else
		{
			$("#currentReleasedTime").addClass("validate[required]");
		}
	});
	
	$("#currentReleasedTime").change(function() {
		var date=$("#currentReleasedDate").val();
		if(date=='12-31-9999')
		{
			$("#currentReleasedTime").removeClass("validate\[required\]");
		}
		else
		{
			$("#currentReleasedTime").addClass("validate[required]");
		}
	});
	$('#goBtn').click(function(){
		$('#freightAssignmentForm').validationEngine('detach');
		//var containerCount = $("#containerHead").val().length;
		//if(containerCount == '10'){
			$("#containerHead").val(($("#containerHead").val()).toUpperCase()); 
			$("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
			$("#freightAssignmentForm").submit();
		//D027127: 	Container linkage will not accept odd container numbers 
		//}else{
		//	alert("Please enter container number of 10 characters");
		//}	
	});
	
	$('#containerHead').change(function()
	{
		/* clear loaded data until container is page is reloaded */
		clear();
	});
	
	$("#containerNoHidden").attr("value",$("#containerHead").val());
	$('#containerHead').bind('keydown',function(event) {
				// keyCode for enter key is 13
				if (event.keyCode == 13 ) {
					$('#freightAssignmentForm').validationEngine('detach');
					//var containerCount = $("#containerHead").val().length;
					//if(containerCount == '10'){
						$("#containerHead").val(($("#containerHead").val()).toUpperCase()); 
						$("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
						$("#freightAssignmentForm").submit();
					//D027127
					//}else{
					//	alert("Please enter container number of 10 characters");
					//}							
				}
			});		
	$('#containerHead').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
		name: 'Container Number',
	 	extraParams: {
	 		method: 'searchContainer',
		 		 searchType: '288',
	 	},
		minLength: 10,
		formatItem: function(data) {
			return data.contNo.trim();
		},
		formatResult: function(data) {
			return data.contNo.trim();
		}, 
		select: function(data) {
			$("#containerHead").val(($("#containerHead").val().trim()).toUpperCase()); 
			$("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
			/*$("#freightAssignmentForm").submit(); */
			clear();
		}
	});
});




/*$('#containerHead').live("change", (function()
		{
	         var containerCount = $("#containerHead").val().length;
	         if(containerCount == '10')
	        	 {
		     $("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
			 $("#freightAssignmentForm").submit();	
	        	 }
	         else
	        	 {
	        	 alert("Please enter container number of 10 characters");

	        	 }




}));
 */
/*function isOverlappingBass()
{

	 return false;
}*/

$(document).ready(function() 
		{

	/*$('#containerHead').gatesAutocomplete({
		//source: url,
		source:_context+'/cas/autocomplete.do',
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

				$('#freightAssignmentForm').validationEngine('detach');
				var containerCount = $("#containerHead").val().length;
				 if(containerCount == '10')
	        	 {
		     $("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
			 $("#freightAssignmentForm").submit();
			   	 }
	         else
	        	 {
	        	 alert("Please enter container number of 10 characters");

	        	 }							

		}
	});*/
	
	var isLoadedFromSearch= $("#isLoadedFromSearch").val();
	if(isLoadedFromSearch == "true"){ 
		/*$('#containerHead').attr("readonly","readonly");
		$('#currentBookingForDisplay').attr("readonly","readonly");
		*/
		$('#containerHead').attr("disabled","disabled");
		$('#currentBookingForDisplay').attr("disabled","disabled");
	}

	var isContainerInvaild = $("#isContainerInvalid").val();
	if(isContainerInvaild == "true") 
	{
		$("#moveToBooking").attr("disabled", "disabled");
	}
	else if(isContainerInvaild == "false") 
	{
		$("#moveToBooking").removeAttr("disabled");
	}

	populateVvd();

	$('#freightAssignmentForm').validationEngine('attach');


	$("#currentAssignedDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#currentReleasedDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});
	$("#moveToAssignedDate").datepicker({
		dateFormat : 'mm-dd-yy'
	}); 
	$("#moveToReleasedDate").datepicker({
		dateFormat : 'mm-dd-yy'
	});

	enableDisableButtons();
	//$("#deleteLink").removeAttr("disabled");
	
	oldForm = $('#freightAssignmentForm').formSerialize();
	var currentAssignDate =  $("#currentAssignedDate").val();
	var currentReleaseDate = $("#currentReleasedDate").val(); 
	var moveToAssignDate =  $("#MoveToAssignedDate").val();
	var moveToReleaseDate = $("#moveToReleasedDate").val(); 
	
	var isLoadedFromSearch= $("#isLoadedFromSearch").val();
	if(isLoadedFromSearch == "true")
		{
		if(currentAssignDate != '' || currentReleaseDate != '' || moveToAssignDate != '' || moveToReleaseDate != '' ||
			currentAssignDate != null || currentReleaseDate != null || moveToAssignDate != null || moveToReleaseDate != null)
			{
			$("#deleteLink").removeAttr("disabled");
			$("#linkBtn").attr("disabled", "disabled");
			$("#transferBtn").attr("disabled", "disabled");
			$("#unlinkBtn").attr("disabled", "disabled");
			$("#saveBtn").attr("disabled", "disabled");
			}
		}
	
	forBillingStarted();


	/*$('#containerHead').focusout(function(){
			var containerCount = $("#containerHead").val().length;
	         if(containerCount == '10')
	        	 {
			$("#freightAssignmentForm").attr("action", "getCurrentBookingForContainer");
			 $("#freightAssignmentForm").submit();	
	        	 }
	    });*/

	var isBookingAssignmentRequired = $("#isBookingAssignmentRequired").val();
	if(isBookingAssignmentRequired == 'true')
	{
		$("#deleteLink").attr("disabled", "disabled");
		$("#linkBtn").attr("disabled", "disabled");
		$("#transferBtn").attr("disabled", "disabled");
		$("#unlinkBtn").attr("disabled", "disabled");
		$("#saveBtn").attr("disabled", "disabled");
		//D031064: 	Defects | Please clear Incomplete Booking Assignments 
		$("#currentBookingForDisplay").attr("disabled", "disabled");
		$("#moveToBooking").attr("disabled", "disabled");
	}


	validateDateTimeCurrent();
	$('#linkBtn').click(function()
			{ 
		var containerCount = $("#currentBookingForDisplay").val().length;
		if(containerCount == '0'){
				$("#currentReleasedTime").removeClass("validate\[required\]");
				$("#currentReleasedDate").removeClass("validate\[required\]");
				$("#currentAssignedDate").removeClass("validate\[required\]");
				$("#currentAssignedTime").removeClass("validate\[required\]");	
		}
		if($("#freightAssignmentForm").validationEngine('validate'))
		{
			var containerNo = $("#containerHead").val();
			var moveToBkgNo = $("#moveToBooking").val();
			if(containerNo != '' && moveToBkgNo != '')
			{
				if($("#containerNoHidden").attr("value") == $("#containerHead").val())
				{
					var moveToAssignedDateForCheck = $("#moveToAssignedDate").val();
					var moveToReleasedDateForCheck = $("#moveToReleasedDate").val();
					if((isValidDate(moveToAssignedDateForCheck)!=null) && (isValidDate(moveToReleasedDateForCheck)!=null))
					{
						if(Boolean(assignedReleasedDateValidationMoveTo()))
						{
							var selected = $("#isMoveToBookingWithIncompleteBass").val();
							if (selected == "true") 
							{
								alert(" Booking Assignment Maintenance required, use �Booking Assignment Maintenance�");
							}
							else
							{
								/* var bassOpenDate="12-31-9999 00:00:00";
						 var isBassOpenForSameEquipment =  $("#isBassOpenForSameEquipment").val();
						 if((Date.parse(moveToReleasedDateForCheck)< Date.parse(bassOpenDate)) && isBassOpenForSameEquipment && (isOverLappingBass() || isPartialBass()))
							 {
							 var r=confirm("Assignmnt dates overlap pre-existing assignmnt. Continue(Y or N)?");
		        	 		 if (r==true)
		        	 		 {*/
								var queryString = $('#freightAssignmentForm').formSerialize();
								blockUI();
								$.ajax({
									type: "POST",
									url: _context +"/containerLinkage/linkContainer",
									data: queryString,
									success: function(responseText){
										$.unblockUI();
										$("#freightAssignmentForm").loadJSON(responseText.data);
										populateFieldsForAjax(responseText);
										jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
										showResponseMessages(responseText.messages);					
										enableDisableButtons();
										forBillingStarted();
										$("#moveToReleasedDate").removeClass("validate\[required\]");
										$("#moveToReleasedTime").removeClass("validate\[required\]");
										$("#moveToAssignedDate").removeClass("validate\[required\]");
										$("#moveToAssignedTime").removeClass("validate\[required\]");
										oldForm = $('#freightAssignmentForm').formSerialize();
									}
								});
								/*}
							}*/	 
							}
						}
					}

					else
					{
						alert("Please enter a valid date in mm-dd-yyyy format");
					}
				}
				else
				{
					showErrorMessage('msgDiv','Record must be displayed immediately prior to Link.');
				}
			}
			else
			{
				showErrorMessage('msgDiv','Container Number and Booking Number are Mandetory.');
			}
		}
			});
	$('#unlinkBtn').click(function()
			{
		if($("#freightAssignmentForm").validationEngine('validate'))
		{
			var currentAssignedDateForCheck = $("#currentAssignedDate").val();
			var currentReleasedDateForCheck = $("#currentReleasedDate").val();
			if((isValidDate(currentAssignedDateForCheck)!=null) && (isValidDate(currentReleasedDateForCheck)!=null))
			{
				var queryString = $('#freightAssignmentForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/containerLinkage/unlinkContainer",
					data: queryString,
					success: function(responseText){
						$.unblockUI();
						$("#freightAssignmentForm").loadJSON(responseText.data);
						populateFieldsForAjax(responseText);
						jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						showResponseMessages(responseText.messages);
						enableDisableButtons();
						$("#currentReleasedDate").removeClass("validate\[required\]");
						$("#currentReleasedTime").removeClass("validate\[required\]");
						$("#currentAssignedDate").removeClass("validate\[required\]");
						$("#currentAssignedTime").removeClass("validate\[required\]");
						$("#moveToReleasedDate").removeClass("validate\[required\]");
						$("#moveToReleasedTime").removeClass("validate\[required\]");
						$("#moveToAssignedDate").removeClass("validate\[required\]");
						$("#moveToAssignedTime").removeClass("validate\[required\]");
						oldForm = $('#freightAssignmentForm').formSerialize();
					}
				}); 
			} 
			else
			{
				alert("Please enter valid date in mm-dd-yyyy format");
			}
		}
			});
	$('#transferBtn').click(function()
			{
		if($("#freightAssignmentForm").validationEngine('validate'))
		{
			var containerNo = $("#containerHead").val();
			var moveToBkgNo = $("#moveToBooking").val();
			if(containerNo != '' && moveToBkgNo != '')
			{
				if($("#containerNoHidden").attr("value") == $("#containerHead").val())
				{
					if(Boolean(assignedReleasedDateValidationMoveTo()))
					{
						var currentAssignedDateForCheck = $("#currentAssignedDate").val();
						var currentReleasedDateForCheck = $("#currentReleasedDate").val();
						var moveToAssignedDateForCheck = $("#moveToAssignedDate").val();
						var moveToReleasedDateForCheck = $("#moveToReleasedDate").val();
						if((isValidDate(currentAssignedDateForCheck)!=null) && (isValidDate(currentReleasedDateForCheck)!=null) && (isValidDate(moveToAssignedDateForCheck)!=null) && (isValidDate(moveToReleasedDateForCheck)!=null))
						{
							var selected = $("#isMoveToBookingWithIncompleteBass").val();
							if (selected == "true")  
							{
								alert(" Booking Assignment Maintenance required, use �Booking Assignment Maintenance�");
							}
							else
							{
								/*var bassOpenDate="12-31-9999 00:00:00";
           	 			 		var isBassOpenForSameEquipment =  $("#isBassOpenForSameEquipment").val();
           	 			 		if((Date.parse(moveToReleasedDateForCheck)< Date.parse(bassOpenDate)) && isBassOpenForSameEquipment && (isOverLappingBass() || isPartialBass()))
           	 			 			{
           	 			 			var r=confirm("Assignmnt dates overlap pre-existing assignmnt. Continue(Y or N)?");
           	 			 			if (r==true)
           	 			 				{*/
								var queryString = $('#freightAssignmentForm').formSerialize();
								blockUI();
								$.ajax({
									type: "POST",
									url: _context +"/containerLinkage/transferContainerLinkage",
									data: queryString,
									success: function(responseText){
										$.unblockUI();
										$("#freightAssignmentForm").loadJSON(responseText.data);
										populateFieldsForAjax(responseText);
										jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
										showResponseMessages(responseText.messages);
										enableDisableButtons();
										//forBillingStarted();
										$("#moveToReleasedDate").removeClass("validate\[required\]");
										$("#moveToReleasedTime").removeClass("validate\[required\]");
										$("#moveToAssignedDate").removeClass("validate\[required\]");
										$("#moveToAssignedTime").removeClass("validate\[required\]");
										oldForm = $('#freightAssignmentForm').formSerialize();
									}
								}); 
								/*}
           	 			 			}*/

							}
						}
					}
					else
					{
						alert("Please enter a valid date in mm-dd-yyyy format");
					}
				}
				else
				{
					showErrorMessage('msgDiv','Container Number must not be changed.');
				}
			}
			else
			{
				showErrorMessage('msgDiv','Container Number and Booking Number are Mandetory.');
			}
		}
			});
	$('#deleteLink').click(function()
			{
		var queryString = $('#freightAssignmentForm').formSerialize();
		var r = false;
		var status = $("#bassStatusCode").val();
		if(status == 'V'){
			$.ajax({
				async: false,
				type: "POST",
				url: _context +"/containerLinkage/checkDuplicateLinkage",
				data: queryString,
				success: function(responseText){
					if(responseText.success==true){
						 r=confirm("An Invalid Linkage also exists for this Container/Booking.   Click OK to confirm you really want to delete the Valid Linkage, or click Cancel");
					}else{
						 r=confirm("Are you sure you want to delete this link ?");
					}
				}
			});
		}else{
			 r=confirm("Are you sure you want to delete this link ?");
		}
		if (r==true)
		{			
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/containerLinkage/deleteLinkage",
				data: queryString,
				success: function(responseText){
					$.unblockUI();
					$("#freightAssignmentForm").loadJSON(responseText.data);
					populateFieldsForAjax(responseText);
					jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					showResponseMessages(responseText.messages);
					enableDisableButtons();
					$("#moveToReleasedDate").removeClass("validate\[required\]");
					$("#moveToReleasedTime").removeClass("validate\[required\]");
					$("#moveToAssignedDate").removeClass("validate\[required\]");
					$("#moveToAssignedTime").removeClass("validate\[required\]");
					$("#currentReleasedDate").removeClass("validate\[required\]");
					$("#currentReleasedTime").removeClass("validate\[required\]");
					$("#currentAssignedDate").removeClass("validate\[required\]");
					$("#currentAssignedTime").removeClass("validate\[required\]");
					$("#deleteLink").attr("disabled", "disabled");
					oldForm = $('#freightAssignmentForm').formSerialize();
				}
			});
		}
			});

	$('#saveBtn').click(function()
			{
		if($("#freightAssignmentForm").validationEngine('validate'))
		{
			var currentAssignedDateForCheck = $("#currentAssignedDate").val();
			var currentReleasedDateForCheck = $("#currentReleasedDate").val();
			if((isValidDate(currentAssignedDateForCheck)!=null) && (isValidDate(currentReleasedDateForCheck)!=null))
			{

				if(Boolean(assignedReleasedDateValidationCurrent()))
				{

					var oldReleasedDate = $("#oldReleasedDate").val(); 
					var oldAssignedDate = $("#oldAssignedDate").val();
					var newReleasedDate = $("#currentReleasedDate").val();
					var newAssignedDate = $("#currentAssignedDate").val();
					if((Date.parse(oldAssignedDate) > Date.parse(newAssignedDate) || Date.parse(oldReleasedDate) < Date.parse(newReleasedDate)) || isIncompleteBass())
					{
						//D025885
						//var r=confirm("BASS date overlap and incomplt EQLG cycle detected. Continue(Y/N) ?");
						var r=confirm("Booking assignment date overlap and incomplete equipment log cycle detected. Continue(Y/N) ?");
						if (r==true)
						{
							save();   	 
						}
					}
					else
					{
						save();
					}
				}
			}
			else
			{
				alert("Please enter a valid date in mm-dd-yyyy format");
			}
		}
			});

	$('#exitBtn').click(function() {
		// D024676 : Fix for unsaved pop up shown on exit
		var newForm = $('#freightAssignmentForm').formSerialize();
		if(newForm != oldForm){
			var r=confirm("All the unsaved Changes will be discarded!");
			if (r==true) {
				document.location.href = _context + '/cas/bkULContainerSearch.do?isRefresh=true';
			} 
		} else {
			document.location.href = _context + '/cas/bkULContainerSearch.do?isRefresh=true';
		}
	});
	$('#clearBtn').click(function(){
		/*$('#moveToShipperNameForDisplay').html('');
		$('#moveToVvdForDisplay').html('');
		$('#moveToPortOfDischargeForDisplay').html('');
		$('#moveToBookingStatusForDisplay').html('');
		$('#moveToPortOfLoadingForDisplay').html('');
		$('#moveToVarianceByGemsForDisplay').html('');
		$('#moveToVarianceByBookingForDisplay').html('');
		$("#moveToBooking").val("");
		$("#moveToAssignedDate").val("");
		$("#moveToAssignedTime").val("");
		$("#moveToReleasedDate").val("");
		$("#moveToReleasedTime").val("");*/
		$("#currentReleasedDate").removeClass("validate\[required\]");
		$("#currentReleasedTime").removeClass("validate\[required\]");
		$("#currentAssignedDate").removeClass("validate\[required\]");
		$("#currentAssignedTime").removeClass("validate\[required\]");
		$("#freightAssignmentForm").attr("action", "clearContainerLinkage");
     	$("#freightAssignmentForm").submit();  
	}); 
	 tabSequence('#freightAssignmentForm',false,false);
	 createCommentFunc();
		}); 

//document ready function ends

function populateFieldsForAjax(responseText)
{
	$("#movementDate").val(responseText.data.movementDate);
	$("#type").val(responseText.data.type);
	$("#origVesselCode").val(responseText.data.origVesselCode);
	$("#origVoyage").val(responseText.data.origVoyage);
	$("#origDirection").val(responseText.data.origDirection);
	$("#portOfLoading").val(responseText.data.portOfLoading);
	$("#portOfDischarge").val(responseText.data.portOfDischarge);
	$("#placeOfDelivery").val(responseText.data.placeOfDelivery);
	$("#shipperName").val(responseText.data.shipperName);
	$('#shipperAddress').val(responseText.data.shipperAddress);

	$("#currentBooking").val(responseText.data.currentBooking);
	$("#currentPortOfDischarge").val(responseText.data.currentPortOfDischarge);
	$("#currentShipperName").val(responseText.data.currentShipperName);
	$("#currentBookingStatus").val(responseText.data.currentBookingStatus);
	$("#currentPortOfLoading").val(responseText.data.currentPortOfLoading);
	$("#currentReleasedTime").val(responseText.data.currentReleasedTime);
	$("#currentReleasedDate").val(responseText.data.currentReleasedDate);
	$("#currentAssignedTime").val(responseText.data.currentAssignedTime);
	$("#currentAssignedDate").val(responseText.data.currentAssignedDate);
	$('#varianceByGems').val(responseText.data.varianceByGems);
	$('#varianceByBooking').val(responseText.data.varianceByBooking);
	$("#currentBookingFreightAssgnId").val(responseText.data.currentBookingFreightAssgnId);
	$("#bassStatusCode").val(responseText.data.bassStatusCode);
	$("#currentOrigVesselCode").val(responseText.data.currentOrigVesselCode);
	$("#currentOrigVoyage").val(responseText.data.currentOrigVoyage);
	$("#currentOrigDirection").val(responseText.data.currentOrigDirection);

	$("#moveToBooking").val(responseText.data.moveToBooking);
	$("#moveToPortOfDischarge").val(responseText.data.moveToPortOfDischarge);
	$("#moveToShipperName").val(responseText.data.moveToShipperName);
	$("#moveToBookingStatus").val(responseText.data.moveToBookingStatus);
	$("#moveToPortOfLoading").val(responseText.data.moveToPortOfLoading);
	$("#moveToAssignedDate").val(responseText.data.moveToAssignedDate);
	$("#moveToAssignedTime").val(responseText.data.moveToAssignedTime);
	$("#moveToReleasedTime").val(responseText.data.moveToReleasedTime);
	$("#moveToReleasedDate").val(responseText.data.moveToReleasedDate);
	$('#moveToVarianceByGems').val(responseText.data.moveToVarianceByGems);
	$('#moveToVarianceByBooking').val(responseText.data.moveToVarianceByBooking);
	$("#moveToBookingFreightAssgnId").val(responseText.data.moveToBookingFreightAssgnId);
	$("#moveToOrigVesselCode").val(responseText.data.moveToOrigVesselCode);
	$("#moveToOrigVoyage").val(responseText.data.moveToOrigVoyage);
	$("#moveToOrigDirection").val(responseText.data.moveToOrigDirection);


	$("#isMoveToBookingWithIncompleteBass").val(responseText.data.isMoveToBookingWithIncompleteBass);
	$("#isBassOpenForSameEquipment").val(responseText.data.isBassOpenForSameEquipment);
	$("#latestAssignedDate").val(responseText.data.latestAssignedDate);
	$("#isOverlappingBass").val(responseText.data.isOverlappingBass);
	$("#oldReleasedDate").val(responseText.data.oldReleasedDate);
	$("#oldAssignedDate").val(responseText.data.oldAssignedDate);
	$("#isIncompleteLogEvents").val(responseText.data.isIncompleteLogEvents);	

	$("#movementDateForDisplay").html(responseText.data.movementDate);
	$('#typeForDisplay').html(responseText.data.type);
	/*$('#origVesselCode').html(responseText.data.origVesselCode);
	$('#origVoyage').html(responseText.data.origVoyage);
	$('#origDirection').html(responseText.data.origDirection);*/
	$('#portOfLoadingForDisplay').html(responseText.data.portOfLoading);
	$('#portOfDischargeForDisplay').html(responseText.data.portOfDischarge);
	$('#placeOfDeliveryForDisplay').html(responseText.data.placeOfDelivery);
	$('#shipperNameForDisplay').html(responseText.data.shipperName);
	$('#shipperAddressForDisplay').html(responseText.data.shipperAddress);

	$("#currentBookingForDisplay").val(responseText.data.currentBooking);
	$('#currentBookingStatusForDisplay').html(responseText.data.currentBookingStatus);
	$('#currentPortOfLoadingForDisplay').html(responseText.data.currentPortOfLoading);
	$('#currentShipperNameForDisplay').html(responseText.data.currentShipperName);
	$('#currentPortOfDischargeForDisplay').html(responseText.data.currentPortOfDischarge);
	$('#varianceByGemsForDisplay').html(responseText.data.varianceByGems);
	$('#varianceByBookingForDisplay').html(responseText.data.varianceByBooking);

	populateVvd();
	populateMoveToVvd();
	populateCurrentVvd();
	$("#moveToShipperNameForDisplay").html(responseText.data.moveToShipperName);
	$("#moveToBookingStatusForDisplay").html(responseText.data.moveToBookingStatus);
	$("#moveToPortOfDischargeForDisplay").html(responseText.data.moveToPortOfDischarge);
	$("#moveToPortOfLoadingForDisplay").html(responseText.data.moveToPortOfLoading);
	$('#moveToVarianceByGemsForDisplay').html(responseText.data.moveToVarianceByGems);
	$('#moveToVarianceByBookingForDisplay').html(responseText.data.moveToVarianceByBooking);
	$("#currentDate").val(responseText.data.currentDate);
	$("#hawaiiDate").val(responseText.data.hawaiiDate);
	$("#chinaDate").val(responseText.data.chinaDate);
	$("#honoluluDate").val(responseText.data.honoluluDate);
	$("#guamDate").val(responseText.data.guamDate);
	$("#commentId").val(responseText.data.commentId);
	$("#entityId").val(responseText.data.entityId);
	createCommentFunc();
}

function clear(responseText)
{
	$("#movementDate").val('');
	$("#type").val('');
	$("#origVesselCode").val('');
	$("#origVoyage").val('');
	$("#origDirection").val('');
	$("#portOfLoading").val('');
	$("#portOfDischarge").val('');
	$("#placeOfDelivery").val('');
	$("#shipperName").val('');
	$('#shipperAddress').val('');

	$("#currentBooking").val('');
	$("#currentPortOfDischarge").val('');
	$("#currentShipperName").val('');
	$("#currentBookingStatus").val('');
	$("#currentPortOfLoading").val('');
	$("#currentReleasedTime").val('');
	$("#currentReleasedDate").val('');
	$("#currentAssignedTime").val('');
	$("#currentAssignedDate").val('');
	$('#varianceByGems').val('');
	$('#varianceByBooking').val('');
	$("#currentBookingFreightAssgnId").val('');
	$("#currentOrigVesselCode").val('');
	$("#currentOrigVoyage").val('');
	$("#currentOrigDirection").val('');

	$("#moveToBooking").val('');
	$("#moveToPortOfDischarge").val('');
	$("#moveToShipperName").val('');
	$("#moveToBookingStatus").val('');
	$("#moveToPortOfLoading").val('');
	$("#moveToAssignedDate").val('');
	$("#moveToAssignedTime").val('');
	$("#moveToReleasedTime").val('');
	$("#moveToReleasedDate").val('');
	$('#moveToVarianceByGems').val('');
	$('#moveToVarianceByBooking').val('');
	$("#moveToBookingFreightAssgnId").val('');
	$("#moveToOrigVesselCode").val('');
	$("#moveToOrigVoyage").val('');
	$("#moveToOrigDirection").val('');


	$("#isMoveToBookingWithIncompleteBass").val('');
	$("#isBassOpenForSameEquipment").val('');
	$("#latestAssignedDate").val('');
	$("#isOverlappingBass").val('');
	$("#oldReleasedDate").val('');
	$("#oldAssignedDate").val('');
	$("#isIncompleteLogEvents").val('');

	$("#movementDateForDisplay").html('');
	$('#typeForDisplay').html('');

	$('#portOfLoadingForDisplay').html('');
	$('#portOfDischargeForDisplay').html('');
	$('#placeOfDeliveryForDisplay').html('');
	$('#shipperNameForDisplay').html('');
	$('#shipperAddressForDisplay').html('');

	$("#currentBookingForDisplay").val('');
	$('#currentBookingStatusForDisplay').html('');
	$('#currentPortOfLoadingForDisplay').html('');
	$('#currentShipperNameForDisplay').html('');
	$('#currentPortOfDischargeForDisplay').html('');
	$('#varianceByGemsForDisplay').html('');
	$('#varianceByBookingForDisplay').html('');

	populateVvd();
	populateMoveToVvd();
	populateCurrentVvd();
	$("#moveToShipperNameForDisplay").html('');
	$("#moveToBookingStatusForDisplay").html('');
	$("#moveToPortOfDischargeForDisplay").html('');
	$("#moveToPortOfLoadingForDisplay").html('');
	$('#moveToVarianceByGemsForDisplay').html('');
	$('#moveToVarianceByBookingForDisplay').html('');
	$("#currentDate").val('');
	$("#hawaiiDate").val('');
	$("#chinaDate").val('');
	$("#honoluluDate").val('');
	$("#guamDate").val('');
	$("#commentId").val('');
	$("#eventLogGridTable").jqGrid("clearGridData", true);

}

function save()
{
	if(checkForDateTime())
	{
		var queryString = $('#freightAssignmentForm').formSerialize();
		blockUI();
		$.ajax({
			type: "POST",
			url: _context +"/containerLinkage/saveContainerLinkage",
			data: queryString,
			success: function(responseText){
				$.unblockUI();
				$("#freightAssignmentForm").loadJSON(responseText.data);
				populateFieldsForAjax(responseText);
				jQuery("#eventLogGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				showResponseMessages(responseText.messages);
				enableDisableButtons();
				oldForm = $('#freightAssignmentForm').formSerialize();
			}
		});
	}
}

function validateDateTimeMoveTo() {

	var moveToBooking = $("#moveToBooking").val();
	if (moveToBooking != "" || moveToBooking != null )
	{
		$("#moveToReleasedDate").addClass("validate[required] datepicker");
		$("#moveToReleasedTime").addClass("validate[required]");
		$("#moveToAssignedDate").addClass("validate[required] datepicker");
		$("#moveToAssignedTime").addClass("validate[required]");
		var date=$("#currentReleasedDate").val();
		if(date=='12-31-9999')
		{
			$("#moveToReleasedTime").removeClass("validate\[required\]");
		}
		else
		{
			$("#moveToReleasedTime").addClass("validate[required]");
		}

	}
	else
	{
		$("#moveToReleasedDate").removeClass("validate\[required\]");
		$("#moveToReleasedTime").removeClass("validate\[required\]");
		$("#moveToAssignedDate").removeClass("validate\[required\]");
		$("#moveToAssignedTime").removeClass("validate\[required\]");
	}
}

function validateDateTimeCurrent() {

	var currentBooking = $("#currentBookingForDisplay").val();
	if (Boolean(currentBooking))
	{
		$("#currentReleasedDate").addClass("validate[required]");
		$("#currentReleasedTime").addClass("validate[required]");
		$("#currentAssignedDate").addClass("validate[required]");
		$("#currentAssignedTime").addClass("validate[required]");

	}
	else
	{
		$("#currentReleasedDate").removeClass("validate\[required\]");
		$("#currentReleasedTime").removeClass("validate\[required\]");
		$("#currentAssignedDate").removeClass("validate\[required\]");
		$("#currentAssignedTime").removeClass("validate\[required\]");
	}
}

function enableDisableButtons()
{
	var containerNo = $("#containerHead").val();
	var currentBkg = $("#currentBookingForDisplay").val();
	var moveToBkg = $("#moveToBooking").val();
	if (containerNo == '' || containerNo == null) 
	{
		$("#deleteLink").attr("disabled", "disabled");
		$("#linkBtn").attr("disabled", "disabled");
		$("#transferBtn").attr("disabled", "disabled");
		$("#unlinkBtn").attr("disabled", "disabled");
		$("#saveBtn").attr("disabled", "disabled");
	}
	else if(containerNo != '' || containerNo != null)			
	{
		// current booking is not null and move to booking is null
		// boolean returns true for value and false for blank
		if(Boolean(currentBkg) && !Boolean(moveToBkg) )   
			//if((currentBkg != '' || currentBkg != null)&&(moveToBkg == '' || moveToBkg== null))
		{
			if(isContainerLinkageDeletable)
			{
				$("#deleteLink").removeAttr("disabled");
			}
			else
			{
				$("#deleteLink").attr("disabled", "disabled");
			}

			if(isContainerLinkageUnLinkable)
			{
				$("#unlinkBtn").removeAttr("disabled");
			}
			else
			{
				$("#unlinkBtn").attr("disabled", "disabled");
			}
			if(isContainerLinkageUpdatable)
			{
				$("#saveBtn").removeAttr("disabled");
			}
			else
			{
				$("#saveBtn").attr("disabled", "disabled");
			}
			$("#transferBtn").attr("disabled", "disabled");
			$("#linkBtn").attr("disabled", "disabled");
		}

		// current booking is null and move to booking is not null
		if(!Boolean(currentBkg) && Boolean(moveToBkg) )
			// if((currentBkg == '' || currentBkg == null)&&(moveToBkg != '' || moveToBkg != null))
		{
			if(isContainerLinkageLinkable)
			{
				$("#linkBtn").removeAttr("disabled");
			}
			else
			{
				$("#linkBtn").attr("disabled", "disabled");
			}
			$("#deleteLink").attr("disabled", "disabled");
			$("#transferBtn").attr("disabled", "disabled");
			$("#unlinkBtn").attr("disabled", "disabled");
			$("#saveBtn").attr("disabled", "disabled");
		}

		// both current booking and move to booking is not null
		if(Boolean(currentBkg) && Boolean(moveToBkg) ) 
			//if((currentBkg != '' || currentBkg != null)&&(moveToBkg != '' || moveToBkg != null))
		{
			$("#deleteLink").attr("disabled", "disabled");
			$("#linkBtn").attr("disabled", "disabled");
			if(isContainerLinkageTransferable)
			{
				$("#transferBtn").removeAttr("disabled");
			}
			else
			{
				$("#transferBtn").attr("disabled", "disabled");
			}
			$("#unlinkBtn").attr("disabled", "disabled");
			$("#saveBtn").attr("disabled", "disabled");				 
		}

		// both current booking and move to booking is null
		if(!Boolean(currentBkg) && !Boolean(moveToBkg) )
			// if ((currentBkg == '' || currentBkg == null)&&(moveToBkg == '' || moveToBkg == null)) 
		{
			$("#deleteLink").attr("disabled", "disabled");
			$("#linkBtn").attr("disabled", "disabled");
			$("#transferBtn").attr("disabled", "disabled");
			$("#unlinkBtn").attr("disabled", "disabled");
			$("#saveBtn").attr("disabled", "disabled");
		}
	}	
		
}

function assignedReleasedDateValidationCurrent()
{
	var assignDate = $("#currentAssignedDate").val()+" "+$("#currentAssignedTime").val(); 
	var releaseDate = $("#currentReleasedDate").val()+" "+$("#currentReleasedTime").val();
	if(Date.parse(assignDate) > Date.parse(releaseDate))
	{
		alert('Released date/time must be greater than assigned date/time');
		return false;
	}
	return true;
}

function assignedReleasedDateValidationMoveTo()
{
	var assignDate = $("#moveToAssignedDate").val()+" "+$("#moveToAssignedTime").val(); 
	var releaseDate = $("#moveToReleasedDate").val()+" "+$("#moveToReleasedTime").val();
	if(Date.parse(assignDate) > Date.parse(releaseDate))
	{
		alert('Released date/time must be greater than assigned date/time');
		return false;
	}
	return true;
}

function isIncompleteBass()
{

	var listEventLog = jQuery("#eventLogGridTable").getDataIDs();	

	var isIgtPresent = false;
	var isDfvPresent = false;
	var isLtvPresent = false;
	var isOgPresent = false;

	for(var j=0;j<listEventLog.length;j++)
	{ 				 
		rowData=jQuery("#eventLogGridTable").getRowData(listEventLog[j]);	
		var event = rowData.event;
		var isOg = event.indexOf("OG");
		if(isOg != '-1')
		{
			isOgPresent = true;
		}
		if(event == 'IGT')
		{
			isIgtPresent = true;
		}
		if(event == 'DFV')
		{
			isDfvPresent = true;
		}
		if(event == 'LTV')
		{
			isLtvPresent = true;
		}

	}
	if(isIgtPresent == true && isDfvPresent == true && isLtvPresent == true && isOgPresent == true)
	{
		return false;
	}
	else
	{
		return true;
	}
}

function populateVvd()
{
	var origVesselCode=$("#origVesselCode").val(); 
	var origVoyage=$("#origVoyage").val(); 
	var origDirection=$("#origDirection").val();
	var vvd='';
	if(origVesselCode != '' && origVesselCode != 'null' && origVoyage !='' && origVoyage !='null' && origDirection !='' && origDirection !='null')
	{
		vvd=origVesselCode+" "+origVoyage+" "+origDirection;
		$("#vvdForDisplay").html(vvd);
	}
	else
	{
		$("#vvdForDisplay").html(vvd);
	}
}

function populateMoveToVvd()
{
	var moveToOrigVesselCode=$("#moveToOrigVesselCode").val(); 
	var moveToOrigVoyage=$("#moveToOrigVoyage").val(); 
	var moveToOrigDirection=$("#moveToOrigDirection").val();
	var vvd='';
	if(moveToOrigVesselCode != '' && moveToOrigVesselCode != 'null' && moveToOrigVoyage !='' && moveToOrigVoyage !='null' && moveToOrigDirection !='' && moveToOrigDirection !='null')
	{
		vvd=moveToOrigVesselCode+" "+moveToOrigVoyage+" "+moveToOrigDirection;
		$("#moveToVvdForDisplay").html(vvd);
	}
	else
	{
		$("#moveToVvdForDisplay").html(vvd);
	}
}

function populateCurrentVvd()
{
	var currentOrigVesselCode=$("#currentOrigVesselCode").val(); 
	var currentOrigVoyage=$("#currentOrigVoyage").val(); 
	var currentOrigDirection=$("#currentOrigDirection").val();
	var vvd='';
	if(currentOrigVesselCode != '' && currentOrigVesselCode != 'null' && currentOrigVoyage !='' && currentOrigVoyage !='null' && currentOrigDirection !='' && currentOrigDirection !='null')
	{
		vvd=currentOrigVesselCode+" "+currentOrigVoyage+" "+currentOrigDirection ;
		$("#currentVvdForDisplay").html(vvd);
	}
	else
	{
		$("#currentVvdForDisplay").html(vvd);
	}
}

function checkForDateTime()
{
	var isFarEastTrade=$("#isFarEastTrade").val(); 
	var isGuamTrade=$("#isGuamTrade").val(); 
	var isHawaiiTrade=$("#isHawaiiTrade").val(); 
	var isHawaiiNiTrade=$("#isHawaiiNiTrade").val(); 
	var isMainlandTrade=$("#isMainlandTrade").val(); 
	var isMidPacificTrade=$("#isMidPacificTrade").val(); 
	var isPuertoRicoTrade=$("#isPuertoRicoTrade").val(); 
	var bassOpenDate="12-31-9999 00:00:00";

	var hawaiiDate=$("#hawaiiDate").val(); 
	var chinaDate=$("#chinaDate").val(); 
	var honoluluDate=$("#honoluluDate").val(); 
	var guamDate=$("#guamDate").val(); 
	var currentDate= $("#currentDate").val(); 
	var assignDate = $("#currentAssignedDate").val()+" "+$("#currentAssignedTime").val(); 
	var releaseDate = $("#currentReleasedDate").val()+" "+$("#currentReleasedTime").val();

	if(isHawaiiTrade == 'Y')
	{
		if(Date.parse(assignDate) > Date.parse(currentDate))
		{
			alert('When trade is Hawai : Assigned Date cannot be greater then current date:'+currentDate);
			return false;
		}
		if(Date.parse(releaseDate) < Date.parse(bassOpenDate))
		{
			if(Date.parse(releaseDate) > Date.parse(hawaiiDate))
			{
				alert('When trade is Hawai and assignment is closed : Released Date cannot be greater then current Hawaii date:'+hawaiiDate);
				return false;
			}
		}
	}
	if(isFarEastTrade == 'Y')
	{
		if(Date.parse(assignDate) > Date.parse(chinaDate))
		{
			alert('When trade is Far East : Assigned Date cannot be greater then current China date:'+chinaDate);
			return false;
		}
		if(Date.parse(releaseDate) < Date.parse(bassOpenDate))
		{
			if(Date.parse(releaseDate) > Date.parse(chinaDate))
			{
				alert('When trade is Far East and assignment is closed : Released Date cannot be greater then current China date:'+chinaDate);
				return false;
			}
		}
	}
	if(isGuamTrade == 'Y')
	{
		if(Date.parse(assignDate) > Date.parse(guamDate))
		{
			alert('When trade is Guam : Assigned Date cannot be greater then current Guam date:'+guamDate);
			return false;
		}
		if(Date.parse(releaseDate) < Date.parse(bassOpenDate))
		{
			if(Date.parse(releaseDate) > Date.parse(guamDate))
			{
				alert('When trade is Guam and assignment is closed : Released Date cannot be greater then current Guam date:'+guamDate);
				return false;
			}
		}
	}
	if(isMainlandTrade == 'Y')
	{
		if(Date.parse(assignDate) > Date.parse(currentDate))
		{
			alert('When trade is Mainland : Assigned Date cannot be greater then current date');
			return false;
		}
		if(Date.parse(releaseDate) < Date.parse(bassOpenDate))
		{
			if(Date.parse(releaseDate) > Date.parse(currentDate))
			{
				alert('When trade is Mainland and assignment is closed : Released Date cannot be greater then current date');
				return false;
			}
		}
	}
	if(isMainlandTrade == 'N' && isGuamTrade == 'N' && isFarEastTrade == 'N' && isHawaiiTrade == 'N')
	{
		if(Date.parse(assignDate) > Date.parse(currentDate))
		{
			alert('Assigned Date/Time cannot be greater then current date');
			return false;
		}
		if(Date.parse(releaseDate) < Date.parse(bassOpenDate))
		{
			if(Date.parse(releaseDate) > Date.parse(currentDate))
			{
				alert('Released Date/Time cannot be greater then current date');
				return false;
			}
		}
	}
	return true;
}
//D026796
function createCommentFunc( entityId){
var entityId= entityId
var isDeleteAllowed = false;
var isEditAllowed = false;
if($('#bookingTypeCode').val()=="T")
{
	isDeleteAllowed = true;
	isEditAllowed = true;
}
var args = {
		entityType: 'BKNG',
		entityId:$("#entityId").val() ,
		commentId: 'commentId',
		displayCommentTypes: 'ALL',
		commentTypesForGrid:'',
		isDeleteAllowed:isDeleteAllowed,
		isEditAllowed:isEditAllowed
	   };

getCommentTypes(args);
}
function getCommentTypes(args){
/*if($('#bookingId').val()==null || $('#bookingId').val()==''){
	return;
}*/
$.ajax({
	url: _context +"/comments/commentTypes",
	data: {
		entity: 'BKNG',
		contextScreen: 'containerLinkage'
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
			// For template overriden the values.
			if($('#bookingTypeCode').val()=="T"){
				args.displayCommentTypes='CSS,DOC,OPS';
				args.commentTypesForGrid='CSS,DOC,OPS';
			}else{
				args.commentTypesForGrid=string;
			}
			$("#comment_link").comments(args);
		}
	}
});

}
function isValidDate(date)
{
	var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
	var validDate=false;


	var len1=date.length;

	//   alert('matches:'+matches);

	if (matches == null) 		
	{			
		if(len1<'8' && len1>'10')
		{
			return false;
		}
		if(len1=='0'){
			return date;
		}
		if(len1=='8')
		{	
			var dt1  = date.substring(2,4); 
			var mon1 = date.substring(0,2); 
			var mn=mon1-1;
			var yr1  = date.substring(4,8);
			var composedDate = new Date(yr1, mn,dt1 );		
			validDate=composedDate.getDate() == dt1 &&

			composedDate.getMonth() == mn &&

			composedDate.getFullYear() == yr1;

			if(validDate)		
			{	var newDate=mon1+"-"+dt1+"-"+yr1;

			return newDate;		
			}				
			else		
			{
				return null;				
			}				
		}

	}
	else
	{
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];

		var composedDate = new Date(y, m, d);			

		validDate=composedDate.getDate() == d &&

		composedDate.getMonth() == m &&

		composedDate.getFullYear() == y;

		if(validDate)		
		{	
			var newDate=matches[1]+"-"+d+"-"+y;
			return newDate;		
		}

		else		
		{
			return null;

		}
	}



}

function forBillingStarted()
{
	var isBillingStarted=$("#isBillingStarted").val();
	//D026020
	if(isBillingStarted == "true")
	{
		//alert("Billing Started");
		$('#billingStartedHyperlink').show();
	} else {
		$('#billingStartedHyperlink').hide();
	}
}

function isOverLappingBass()
{
	var releaseDate = $("#moveToReleasedDate").val()+" "+$("#moveToReleasedTime").val() ;
	var latestAssignedDate = $("#latestAssignedDate").val();

	var dateRelease=new Date(releaseDate);
	var newAssignedDate=new Date();
	newAssignedDate = newAssignedDate.setDate(dateRelease.getDate()+5);

	if(dateRelease > Date.parse(latestAssignedDate) && dateRelease <= newAssignedDate)
	{
		return true;
	}
	return false;
}

function isPartialBass()
{
	var releaseDate = $("#moveToReleasedDate").val()+" "+$("#moveToReleasedTime").val();
	var latestAssignedDate = $("#latestAssignedDate").val();
	if(Date.parse(releaseDate) < Date.parse(latestAssignedDate))
	{
		return true;
	}
	return false;
}
function showErrorMessage(msgDivId, text) {
	$('#' + msgDivId).html('<div class="message_error">' + text + '</div>');
}

function disableAllButtons(){
	$("#deleteLink").attr("disabled", "disabled");	
	$("#unlinkBtn").attr("disabled", "disabled");
	$("#saveBtn").attr("disabled", "disabled");
	$("#transferBtn").attr("disabled", "disabled");
	$("#linkBtn").attr("disabled", "disabled");
}

function clearMoveToBookingFields(){
	$('#moveToShipperNameForDisplay').html('');
	$('#moveToVvdForDisplay').html('');
	$('#moveToPortOfDischargeForDisplay').html('');
	$('#moveToBookingStatusForDisplay').html('');
	$('#moveToPortOfLoadingForDisplay').html('');
	$('#moveToVarianceByGemsForDisplay').html('');
	$('#moveToVarianceByBookingForDisplay').html('');
	$("#moveToBooking").val("");
	$("#moveToAssignedDate").val("");
	$("#moveToAssignedTime").val("");
	$("#moveToReleasedDate").val("");
	$("#moveToReleasedTime").val("");
	
}
// Function for security on buttons for defect D027288
function enableSecurityOnButtons(){
	if(!isContainerLinkageLinkable)
		$("#linkBtn").css('visibility','hidden');
	if(!isContainerLinkageUnLinkable)
		$("#unlinkBtn").css('visibility','hidden');
	if(!isContainerLinkageTransferable)
		$('#transferBtn').css('visibility','hidden');
	if(!isContainerLinkageDeletable)
		$('#deleteLink').css('visibility','hidden');
}

function callCurrtBkng(){
	
	currentShpmtNumber = $("#currentBookingForDisplay").val();
	window.open("/gates/billingSetup/loadShipmentDetail?shipmentNumber="+currentShpmtNumber+"&source=CNLK","_self");
	
	
}

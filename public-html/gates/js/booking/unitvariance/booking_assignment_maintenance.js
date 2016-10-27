$(function() {
	
	//D026921: 	Maintain Booking to Assignment Maintenance
	var containerNo=$(document).getUrlParam("containerNo");
	if(containerNo!=null && containerNo!=""){
		$("#containerNo").val(containerNo); 
		$("#bookingAssignmentMaintenanceForm").attr("action","loadUsingContainerNoFromScreen");
		$("#bookingAssignmentMaintenanceForm").submit();
	}
	
	$('#containerNo').bind('keydown',function(event) {
						// keyCode for enter key is 13
						if ($("#bookingAssignmentMaintenanceForm").validationEngine('validate')) {
							var containerCount = $("#containerNo").val().length;
							if ((event.keyCode == 13 ||event.keyCode == 9 ) && containerCount == 10) {
								$("#containerNo").val(($("#containerNo").val()).toUpperCase()); 
								$("#bookingAssignmentMaintenanceForm").attr("action","loadUsingContainerNoFromScreen");
								$("#bookingAssignmentMaintenanceForm").submit();
							} else if ((event.keyCode == 13 || event.keyCode == 9 ) && containerCount != 10) {
								alert("Please enter container number of 10 characters");
							} else {
							}
						}
					});
	
	$('#containerNo').gatesAutocomplete({
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
			$("#containerNo").val(($("#containerNo").val().trim()).toUpperCase()); 
			$("#bookingAssignmentMaintenanceForm").attr("action","loadUsingContainerNoFromScreen");
			$("#bookingAssignmentMaintenanceForm").submit();
		}
	});
	
	$('#containerNo').focus();
});

// $('#containerNo').live(
// "change",
// (function() {
// var containerCount = $("#containerNo").val().length;
// if (containerCount != 10) {
// alert("Container number must be 10 characters");
// } else {
// $("#bookingAssignmentMaintenanceForm").attr("action",
// "loadUsingContainerNoFromScreen");
// $("#bookingAssignmentMaintenanceForm").submit();
// }
// }));

$(document)
		.ready(
				function() {
					$('#bookingAssignmentMaintenanceForm').validationEngine(
							'attach');
					var bookingOne = $('#bookingOne').val();
					var bookingTwo = $('#bookingTwo').val();
					var containerNo = $('#containerNo').val();

					if (containerNo == null || containerNo == "") {
						disableAllFields();
					} else if (containerNo != '' || containerNo != null) {
						 if((bookingOne == null || bookingOne == "")&&(bookingTwo == null || bookingTwo == "")){
								disableAllFields();
							}
						 else if ((bookingOne != null || bookingOne != "")&&(bookingTwo == null || bookingTwo == "")) {
							disableBookingTwoAndMerge();
						} 
						else
							disableButtons(); 
					}

					$("#checkboxOne").click(
							function() {
					
								var bookingOne = $('#bookingOne').val();
								var bookingTwo = $('#bookingTwo').val(); 
								if((bookingOne != null || bookingOne != "")&&(bookingTwo == null || bookingTwo == "")){
									$("#acceptAssignmentBtn").attr("disabled",
											false);
								}else{
									if ($('#checkboxTwo').attr('checked')
										&& $('#checkboxOne').attr('checked')) {
									$("#acceptAssignmentBtn").attr("disabled",
											false);
									$("#mergeAssignmentBtn").attr("disabled",
											true);
								} else if ($('#checkboxTwo').attr('checked')
										|| $('#checkboxOne').attr('checked')) {
									$("#mergeAssignmentBtn").attr("disabled",
											false);
									$("#acceptAssignmentBtn").attr("disabled",
											true);
								} else {
									disableButtons();
								
								}
								}/*else if((bookingOne != null || bookingOne != "")&&(bookingTwo == null || bookingTwo == "")){
									$("#mergeAssignmentBtn").attr("disabled",
											true);
								}*/
							});

					$("#checkboxTwo").click(
							function() {
								if ($('#checkboxOne').attr('checked')
										&& $('#checkboxTwo').attr('checked')) {
									$("#acceptAssignmentBtn").attr("disabled",
											false);
									$("#mergeAssignmentBtn").attr("disabled",
											true);
								} else if ($('#checkboxOne').attr('checked')
										|| $('#checkboxTwo').attr('checked')) {
									$("#mergeAssignmentBtn").attr("disabled",
											false);
									$("#acceptAssignmentBtn").attr("disabled",
											true);
								} else {
									disableButtons();
								}
							});

					$('#acceptAssignmentBtn')
							.click(
									function() {
										$("#bookingAssignmentMaintenanceForm")
												.attr("action",
														"acceptIncompleteAssignment");
										$("#bookingAssignmentMaintenanceForm")
												.submit();
									});

					$('#mergeAssignmentBtn')
							.click(
									function() {
										if ( $('#checkboxOne').attr('checked')) {
										 var r=confirm("Assignment for Booking 2 will be deleted, events merged to Booking 1.Do you want to continue?  ");
					        	 		 if (r==true)
					        	 		 {
										$("#bookingAssignmentMaintenanceForm")
												.attr("action",
														"mergeBookingAssignment");
										$("#bookingAssignmentMaintenanceForm")
												.submit();
					        	 		 }
										}else{
											var r=confirm("Assignment for Booking 1 will be deleted, events merged to Booking 2.Do you want to continue? ");
						        	 		 if (r==true)
						        	 		 {
											$("#bookingAssignmentMaintenanceForm")
													.attr("action",
															"mergeBookingAssignment");
											$("#bookingAssignmentMaintenanceForm")
													.submit();
						        	 		 }	
										}
									});

					$('#exitBtn')
							.click(
									function() {
										//var r = confirm("All the unsaved Changes will be discarded!");
										//if (r == true) {
											var isOpeningFromSearch = $(
													"#isOpeningFromSearch")
													.val();
											if (isOpeningFromSearch == 'true') {
												document.location.href = _context
														+ '/cas/bkIncmpBKAssignSearch.do';

											} else {
												document.location.href = _context
														+ '/cas/bkIncmpBKAssignSearch.do?isRefresh=true';
											}

										//}
									});
					
					function disableBookingTwoAndMerge() {
						$("#checkboxTwo").attr("disabled", "disabled");
						$("#mergeAssignmentBtn").attr("disabled", "disabled");
						$("#acceptAssignmentBtn").attr("disabled", "disabled");
					}

					function disableAllFields() {
						$("#checkboxOne").attr("disabled", "disabled");
						$("#checkboxTwo").attr("disabled", "disabled");
						$("#acceptAssignmentBtn").attr("disabled", "disabled");
						$("#mergeAssignmentBtn").attr("disabled", "disabled");
					}

					function disableButtons() {
						$("#acceptAssignmentBtn").attr("disabled", "disabled");
						$("#mergeAssignmentBtn").attr("disabled", "disabled");
					}

					enforceSecurity();
					tabSequence('#bookingAssignmentMaintenanceForm',false,false);
				});

					function enforceSecurity()
					{
						if(!isBookingAssignmentMergable)
							hideAllFields();
							//disableAllFields();
						
						if(!isBookingAssignmentAcceptable)
							hideAllFields();
							//disableAllFields();

						if(!isBookingAssignmentMergable && !isBookingAssignmentAcceptable)
							hideAllFields();
							//disableAllFields();

					}
					
					function hideAllFields() {
						document.getElementById("checkboxOne").style.visibility="hidden";
						document.getElementById("checkboxTwo").style.visibility="hidden";
						document.getElementById("acceptAssignmentBtn").style.visibility="hidden";
						document.getElementById("mergeAssignmentBtn").style.visibility="hidden";
					}

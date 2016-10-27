	var isDispatchChanged= "N";
	function add() {
		
		var isDetailPageVisible = $('#displayPage').is(':visible');
		
		if(isDetailPageVisible == false)
			{
				document.getElementById('displayPage').style.display = 'block';
				$('#spotRequirementTypeCode').focus();
				//D027780
				if($("#spotRequirementTypeCode").get(0).options.length == 1){
					var messageContent = $('#msgDiv').html();
					messageContent += '<div class="message_warning">Invalid type for the Load Discharge service.</div>';
					$('#msgDiv').html(messageContent);
				}
			}
		//else
			loadNewPage();
			$("#saveBtn").attr("disabled","disabled");
		//animatedcollapse.hide('searchGridDiv');

		$("#dispatchBillGridTable").jqGrid('setGridState','hidden'); 
		 
		disableAllFields(); 
		//D027413
		$("#createDispatchSpecialInstructionsHeader").html("");
		$("#createDispatchLocationHeader").html("");
		$("#createDispatchStatusHeader").html("");
		$("#createDispatchSendingMethodHeader").html("");
		$("#DepotRailInformationHeader").html("");
		$("#createDispatchDepot").html("");
		$("#createDispatchRampCode").html("");
		$("#createDispatchRampName").html("");
		$("#bookingNumberForDispatch").val("BK");
		$("#inbond").attr("value", "");
		document.getElementById('hazardous').style.display = 'none';
		isDispatchChanged="N";
	}
	//animatedcollapse.addDiv('searchGridDiv', 'fade=0,speed=1,hide=0')

	function showSearch() {
		$("#dispatchBillGridTable").jqGrid('setGridState','visible'); 
		//animatedcollapse.show('searchGridDiv'); 
	}



	animatedcollapse.init();

	animatedcollapse.addDiv('railDepotDiv', 'fade=0,speed=1,hide=1');
	animatedcollapse.addDiv('statusDiv', 'fade=0,speed=1,hide=1');

/*
	$('#appointmentTimeAm').live("change", (function() {
		$("#requiredTime").attr("disabled", "disabled");
		$("#requiredTime").val("");
	}));
	
	$('#appointmentTimePm').live("change", (function() {
		$("#requiredTime").attr("disabled", "disabled");
		$("#requiredTime").val("");
	}));
	
	$('#requiredTime').live("change", (function() {		
		
	
	}));
*/
	
	//D028935
	$('#asInstructions').live("change",(function() {
		var asInstruction=$('#asInstructions').val();
			$('#createDispatchSpecialInstructionsHeader').html(asInstruction.substring(0,80));
		isDispatchChanged="Y";
		}));
	
	$('#weight').live("change",(function() {
		isDispatchChanged="Y";
		}));
	$('#seal').live("change",(function() {
		isDispatchChanged="Y";
		}));
	$('#appointmentTimeAm').live("change", (function() {
	if($('#bookingTypeCode').val()!='T'){
	$("#saveBtn").attr("disabled","disabled");	}
		if($("#requiredTime").val())
		{
			var r=confirm("Appointment time will be blanked out");
			if (r==true)
			{
				$("#requiredTime").val("");
			}else
			{
				$(appointmentTimeAm).attr('checked', false);
				$(appointmentTimePm).attr('checked', false);	
			}
		}
		openTruckerRatePopupOnApptTimeSelection();
		
		if($('#requiredDate').val()!="null" && $('#requiredDate').val()!="" && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!="" && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!="" && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
					$('#appointmentTimePm').is(':checked') || (Boolean($("#requiredTime").val()))))
			 {
			$("#saveBtn").removeAttr("disabled");
			if($('#isRequestOutZone').val() == 'true'){
			 $("#saveAndSendBtn").removeAttr("disabled");
             }		 
			 }
		isDispatchChanged="Y";
	}));

	$('#appointmentTimePm').live("change", (function() {
	if($('#bookingTypeCode').val()!='T')
	{
	$("#saveBtn").attr("disabled","disabled");
	}
		if($("#requiredTime").val())
		{
			var r=confirm("Appointment time will be blanked out");
			if (r==true)
			{
				$("#requiredTime").val("");
			}else
			{
				$(appointmentTimeAm).attr('checked', false);
				$(appointmentTimePm).attr('checked', false);	
			}
		}
		 openTruckerRatePopupOnApptTimeSelection();
		 if($('#requiredDate').val()!="null" && $('#requiredDate').val()!="" && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!="" && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!="" && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
					$('#appointmentTimePm').is(':checked') || (Boolean($('#requiredTime').val()))))
			 {
				 $("#saveBtn").removeAttr("disabled"); 
			 
			  if($('#isRequestOutZone').val() == 'true'){
			     $("#saveAndSendBtn").removeAttr("disabled");
             }
			 }isDispatchChanged="Y";
	}));

	$('#requiredTime').live("change", (function() {	
	if($('#bookingTypeCode').val()!='T'){
	$("#saveBtn").attr("disabled","disabled");
	}
	$(appointmentTimeAm).attr('checked', false);
	$(appointmentTimePm).attr('checked', false);
		if($('#requiredDate').val()!="null" && $('#requiredDate').val()!="" && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!="" && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!="" && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
			$('#appointmentTimePm').is(':checked') || (Boolean($('#requiredTime').val()))))
			 {
			$("#saveBtn").removeAttr("disabled");
			if($('#isRequestOutZone').val() == 'true'){
			 $("#saveAndSendBtn").removeAttr("disabled");
             }		 
			 }
			 isDispatchChanged="Y";
	}));
	
	//D025363
	$('#rampName').live("change", (function() {
	$("#createDispatchRampName").html($('#rampName').val());
	isDispatchChanged="Y";
	}));
	
	$('#rampCode').live("change", (function() {
	isDispatchChanged="Y";
	$("#createDispatchRampCode").html($('#rampCode').val());
	}));
	$('#depot').live("change", (function() {
	$("#createDispatchDepot").html($('#depot').val());
	isDispatchChanged="Y";
	}));
	
	$('#equipment').live("change", (function() {
//		$("#spotPullForm").attr("action", "loadTemplateDetails");
//     	$("#spotPullForm").submit(); 
     	
		var dispatchType = $("#spotRequirementTypeCode").val();
		var bookingTypeCode = $("#bookingTypeCode").val();
		var containerNbr = $('#containerNumberForDispatch').val();

		if (dispatchType == 'R') 
			return;
		
		var selectedEquipment = $('#equipment').val();
		if(selectedEquipment == '')
			return;
		
		if (dispatchType == 'S' || dispatchType == 'L')
				loadTemplateDetails();
		else
		{
			if(bookingTypeCode=='T')
			{
				loadTemplateDetails();
			}
			else
			{
				if(containerNbr != '')
					loadTemplateDetails();
			}
		}
		isDispatchChanged="Y";
	}));


	$('#sendType').live("change", (function() {

		var selected = $("#sendType").val();
		if (selected == 'e') {
			document.getElementById('addDocumentContact').style.display = 'block';

		} else if (selected == 'f') {
			document.getElementById('faxDiv').style.display = 'block';

		}
		isDispatchChanged="Y";
	}));

	/*$('#sendEmail').live("change", (function() {
		var selected = $("#sendEmail").val();

		if (selected == 'e') {
			document.getElementById('emailDiv').style.display = 'block';
			document.getElementById('faxDiv').style.display = 'none';
		}

	}));

	$('#sendFax').live("change", (function() {
		var selected = $("#sendFax").val();

		if (selected == 'f') {
			document.getElementById('faxDiv').style.display = 'block';
			document.getElementById('emailDiv').style.display = 'none';
		}
	}));*/


//	$('#containerNumberForDispatch').live("change", (function() {
//
//		document.getElementById('typeField').style.display = 'block';
//		document.getElementById('hazardous').style.display = 'block';
//
//	}));
 

	/*
	$(function() {

		$("#oneTimeCustomerDialog").dialog({
			autoOpen : false,
			width : 960,
			modal : true,
			buttons : {
				Cancel : function() {
					$(this).dialog("close");
				},
				Save : function() {
					$(this).dialog("close");
				},
				Clear : function() {
					$(this).dialog("close");
				},

			}
		});
	});

	function openOneTimeCustomer() {
		$("#oneTimeCustomerDialog").dialog("option", "title",
				'One Timer Customer');
		$("#oneTimeCustomerDialog").dialog('open');
	} */
	
	$("#spotOnPull").click(function() {

		$("#bookingNumber").removeAttr("disabled");
	});

	$(function() {

		$("#sendingMethodDialog")
				.dialog(
						{
							autoOpen : false,
							width : 450,
							modal : true,
							buttons : {
								Cancel : function() {
									$(this).dialog("close");
								},
								Add : function() {

									$(this).dialog("close");
									document.getElementById('sendingMethodDiv').style.display = 'block';

								},
								Clear : function() {
									$(this).dialog("close");
								},

							}
						});
		
		$('#bookingNumber').focus();
	});
	
	
	function openSendingMethodOverlay() {
		$("#sendingMethodDialog").dialog("option", "title", '');
		$("#sendingMethodDialog").dialog('open');
	}

	var tableData5 = [ {
		id : "1",
		email : "matson@matson.com",
		fax : "323 233 3936"
	}, {
		id : "2",
		email : "",
		fax : ""
	}, {
		id : "3",
		email : "",
		fax : ""
	}, {
		id : "4",
		email : "",
		fax : ""
	}, ];
	$(function() {
		$("#grid5").jqGrid({
			/*url:'/spring-jqgrid-integration/krams/crud',
			datatype: 'json',*/
			data : tableData5,
			datatype : "local",
			//mtype: 'GET',
			postData : {},
			colNames : [ 'Id', 'Email', 'Fax', '' ],
			colModel : [ {
				name : 'id',
				index : 'id',
				width : 30,
				editable : false,
				editoptions : {
					readonly : true,
					size : 10
				},
				hidden : true
			}, {
				name : 'email',
				index : 'email',
				width : 120,
				editable : false
			}, {
				name : 'fax',
				index : 'fax',
				width : 120,
				editable : false
			}, {
				name : 'myac',
				index : 'myac',
				width : 55,
				editable : false,
				formatter : 'actions',
				formatoptions : {
					keys : true,
					addbutton : true,
					editbutton : true,
					delbutton : true,
					editformbutton : false
				}
			}, ],
			rowNum : 8,
			rowList : [ 5, 10, 15 ],
			height : "auto",
			autowidth : true,
			rownumbers : false,
			pager : '#pager5',
			caption : "Email/Fax",
			sortname : 'id',
			viewrecords : true,
			sortorder : "asc",
			multiselect : true,
			emptyrecords : "Empty records",
			loadonce : false,
			gridComplete : function() {
				jQuery('#grid5').jqGrid('editRow', 1, false);
			}
		});
	});

	/*function openAddEmailFaxContact() {
		$("#addFaxEmailDialog").dialog("option", "title",
				'Add Email/Fax Contact');
		$("#addFaxEmailDialog").dialog('open');
	}*/

	/*$(function() {

		$("#addFaxEmailDialog").dialog({
			autoOpen : false,
			width : 500,
			height : 300,
			modal : true,
			buttons : {
				Add : function() {
					$(this).dialog("close");
				},
				Close : function() {
					$(this).dialog("close");
				},

			}
		});
	});*/

	function openTruckerDetails() {

		showTruckerDialog();
	}

	$(function() {

		$("#truckerDialog").dialog({
			autoOpen : false,
			width : 900,
			height : 350,
			modal : true,
			open : function() {
				$('#overlayTruckerCode').html($("#truckerCode").val());
				jQuery("#truckerDetailsGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
			},
			buttons : {
				OK : function() {
					$(this).dialog("close");
				},

			}
		});
	});

	var faxtableData = [ {
		id : "1",
		contactName : "",
		commMethod : "",
		fromCp : "",
		value : ""
	}, {
		id : "2",
		contactName : "Safeway/Robin Warren",
		commMethod : "Primary Email",
		fromCp : "Y",
		value : "nwarren@matson.com"
	}, {
		id : "3",
		contactName : "Safeway/Krista Stauffer",
		commMethod : "Primary Email",
		fromCp : "N",
		value : "kstauffer@matson.com"
	}, {
		id : "4",
		contactName : "DHX/Graham",
		commMethod : "FAX",
		fromCp : "N",
		value : "1-480-736-5217"
	},

	];

	$(function() {
		$("#grid_fax")
				.jqGrid(
						{
							/*url:'/spring-jqgrid-integration/krams/crud',
							datatype: 'json',*/
							data : faxtableData,
							datatype : "local",
							//mtype: 'GET',
							postData : {},

							colNames : [ 'Id', 'Organisation/Contact Name',
									'Primary Communication Method', 'From CP',
									'Value', '', '' ],

							colModel : [

							{
								name : 'id',
								index : 'id',
								width : 55,
								editable : false,
								hidden : true,
								editoptions : {
									readonly : true,
									size : 10
								},
								hidden : true
							}, {
								name : 'contactName',
								index : 'contactName',
								width : 180,
								editable : false,
								editrules : {
									required : true
								},
								editoptions : {
									size : 20
								}
							}, {
								name : 'commMethod',
								index : 'commMethod',
								width : 200,
								editable : false,
								editrules : {
									required : true
								},
								editoptions : {
									size : 20
								}
							}, {
								name : 'fromCp',
								index : 'fromCp',
								width : 120,
								editable : false,
								editrules : {
									required : true
								},
								editoptions : {
									size : 20
								}
							}, {
								name : 'value',
								index : 'value',
								width : 180,
								editable : false,
								editrules : {
									required : true
								},
								editoptions : {
									size : 20
								}
							}, {
								name : 'edit',
								label : ' ',
								index : 'edit',
								width : 40,
								editable : false
							}, {
								name : 'clear',
								label : ' ',
								index : 'clear',
								width : 40,
								editable : false
							},

							],
							rowNum : 5,
							rowList : [ 5, 10, 15 ],
							height : "auto",
							autowidth : false,
							rownumbers : false,
							pager : '#pager_grid_fax',
							sortname : 'id',
							viewrecords : true,
							sortorder : "asc",
							multiselect : true,
							caption : "Email/Fax",
							emptyrecords : "Empty records",
							loadonce : false,
							loadComplete : function() {
							},
							gridComplete : function() {
								var ids = jQuery("#grid_fax").jqGrid(
										'getDataIDs');
								for ( var i = 0; i < ids.length; i++) {
									var cl = ids[i];
									be = "<input class='buttonNoFloat' type='button' value='C' onclick=\"javascript:alert('COMMENT!!');\" />";
									ce = "<img src=\"${pageContext.servletContext.contextPath}\/resources\/images\/edit.png\" alt='search'  border='0' style='margin:0px; vertical-align:middle;' onclick=\"javascript:openContactGridOverlay();\" />";
									de = "<img src=\"${pageContext.servletContext.contextPath}\/resources\/images\/edit.png\" alt='search'  border='0' style='margin:0px; vertical-align:middle;' onclick=\"javascript:openContactGridOverlay();\" />";
									le = "<img src=\"${pageContext.servletContext.contextPath}\/resources\/images\/edit.png\" alt='search'  border='0' style='margin:0px; vertical-align:middle;' onclick=\"javascript:openContactGridOverlay();\" />";

									me = "<input class='buttonNoFloat' type='button' value='D' onclick=\"javascript:alert('COMMENT!!');\" />";
									ne = "<img src=\"${pageContext.servletContext.contextPath}\/resources\/images\/u392a.png\" alt='delete'  border='0' style='margin:0px; vertical-align:middle; height:20px;' onclick=\"javascript:callAddCustomer();\" />";

									je = "<img src=\"${pageContext.servletContext.contextPath}\/resources\/images\/u388_r.png\" alt='delete'  border='0' style='margin:0px; vertical-align:middle; height:20px;' onclick=\"javascript:callAddCustomer();\" />";

									jQuery("#grid_fax").jqGrid('setRowData',
											ids[0], {
												edit : je
											});
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[1], {
												edit : ce
											});
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[2], {
												edit : de
											});
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[3], {
												edit : le
											});
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[i + 1], {
												clear : ne
											});

									pe = "<textarea class='span-16' rows='1' cols='20' "+ids[0]+">";

									jQuery("#grid_fax").jqGrid('setRowData',
											ids[0], {
												contactName : pe
											});
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[0], {
												value : pe
											});
									ke = "<select><option></option><option>Primary Email</option><option>Fax</option><option>Alternate Email</option></select"+ids[0]+">";
									jQuery("#grid_fax").jqGrid('setRowData',
											ids[0], {
												commMethod : ke
											});

								}
							},
							oneditfunc : function() {
								alert("edited");
							},
							jsonReader : {
								root : "rows",
								page : "page",
								total : "total",
								records : "records",
								repeatitems : false,
								cell : "cell",
								id : "id"
							},

						});
		$("#grid_fax").jqGrid('navGrid', '#pager_grid_fax', {
			edit : false,
			add : false,
			del : false,
			search : false,
			refresh : false
		}, {}, {}, {}, {
			sopt : [ 'eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew' ],
			closeOnEscape : true,
			multipleSearch : true,
			closeAfterSearch : true
		});

	});

	function openContactGridOverlay() {
		$("#contactGridDialog").dialog("option", "title", '');
		$("#contactGridDialog").dialog('open');
	}

	$(function() {

		$("#contactGridDialog").dialog({
			autoOpen : false,
			width : 400,
			height : 240,
			modal : true,
			buttons : {
				Add : function() {
					$(this).dialog("close");
				},
				Replace : function() {
					$(this).dialog("close");
				},

			}
		});
	});

	add_email_fax_table = [ {
		id : "1",
		type : "email",
		contact : "abc@ww.com"
	}, {
		id : "2",
		type : "email",
		contact : "xyz@ww.com"
	}, {
		id : "3",
		type : "fax",
		contact : "11-1111-1111"
	},

	];

	$(function() {
		$("#grid_add_fax").jqGrid({
			/*url:'/spring-jqgrid-integration/krams/crud',
			datatype: 'json',*/
			data : add_email_fax_table,
			datatype : "local",
			//mtype: 'GET',
			postData : {},

			colNames : [ 'Id', 'Type', 'Contact', '' ],

			colModel : [

			{
				name : 'id',
				index : 'id',
				width : 55,
				editable : false,
				hidden : true,
				editoptions : {
					readonly : true,
					size : 10
				},
				hidden : true
			}, {
				name : 'type',
				index : 'type',
				width : 160,
				editable : false,
				editrules : {
					required : true
				},
				editoptions : {
					size : 20
				}
			}, {
				name : 'contact',
				index : 'contact',
				width : 120,
				editable : false,
				editrules : {
					required : true
				},
				editoptions : {
					size : 20
				}
			}, {
				name : 'actions',
				index : 'actions',
				width : 60,
				align : "center",
				editable : false,
				search : false,
				sortable : false,
				formatter : 'actions',
				formatoptions : {
					keys : true,
					addbutton : false,
					editbutton : true,
					delbutton : false
				}
			},

			],
			rowNum : 5,
			rowList : [ 5, 10, 15 ],
			height : "auto",
			autowidth : false,
			rownumbers : false,
			pager : '#pager_grid_add_fax',
			sortname : 'id',
			viewrecords : true,
			sortorder : "asc",
			multiselect : true,
			emptyrecords : "Empty records",
			loadonce : false,
			loadComplete : function() {
			},

			jsonReader : {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "id"
			},

		});
		$("#add_email_fax_table").jqGrid('navGrid', '#pager_grid_add_fax', {
			edit : false,
			add : false,
			del : false,
			search : false,
			refresh : false
		}, {}, {}, {}, {
			sopt : [ 'eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew' ],
			closeOnEscape : true,
			multipleSearch : true,
			closeAfterSearch : true
		});

	});

	trucker_detail_table = [ {
		id : "1",
		trucker : "AMPF",
		firstName : "Abc",
		lastName : "xyz",
		title : "Mr",
		department : "Admin",
		phoneNumber : "480-480-490",
		extension : "0000"
	},

	];

	$(function() {
		$("#grid_trucker_details").jqGrid(
				{
					/*url:'/spring-jqgrid-integration/krams/crud',
					datatype: 'json',*/
					data : trucker_detail_table,
					datatype : "local",
					//mtype: 'GET',
					postData : {},

					colNames : [ 'Id', 'Trucker', 'First Name', 'Last Name',
							'Title', 'Department', 'Phone number', 'Extension',
							'' ],

					colModel : [

					{
						name : 'id',
						index : 'id',
						width : 55,
						editable : false,
						hidden : true,
						editoptions : {
							readonly : true,
							size : 10
						},
						hidden : true
					}, {
						name : 'trucker',
						index : 'trucker',
						width : 160,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'firstName',
						index : 'firstName',
						width : 120,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'lastName',
						index : 'lastName',
						width : 120,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'title',
						index : 'title',
						width : 80,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'department',
						index : 'department',
						width : 120,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'phoneNumber',
						index : 'phoneNumber',
						width : 120,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'extension',
						index : 'extension',
						width : 70,
						editable : false,
						editrules : {
							required : true
						},
						editoptions : {
							size : 20
						}
					}, {
						name : 'actions',
						index : 'actions',
						width : 60,
						align : "center",
						editable : false,
						search : false,
						sortable : false,
						formatter : 'actions',
						formatoptions : {
							keys : true,
							addbutton : false,
							editbutton : false,
							delbutton : false
						}
					},

					],
					rowNum : 5,
					rowList : [ 5, 10, 15 ],
					height : "auto",
					autowidth : false,
					rownumbers : false,
					pager : '#pager_grid_trucker_details',
					sortname : 'id',
					viewrecords : true,
					sortorder : "asc",
					multiselect : true,

					emptyrecords : "Empty records",
					loadonce : false,
					loadComplete : function() {
					},
					jsonReader : {
						root : "rows",
						page : "page",
						total : "total",
						records : "records",
						repeatitems : false,
						cell : "cell",
						id : "id"
					},

				});
		$("#grid_trucker_details").jqGrid('navGrid', '#pager_grid_add_fax', {
			edit : false,
			add : false,
			del : false,
			search : false,
			refresh : false
		}, {}, {}, {}, {
			sopt : [ 'eq', 'ne', 'lt', 'gt', 'cn', 'bw', 'ew' ],
			closeOnEscape : true,
			multipleSearch : true,
			closeAfterSearch : true
		});

	});


	$('#spotRequirementTypeCode').live(
			"change",
			(function() {
				var dispatchType = $("#spotRequirementTypeCode").val();
				if(dispatchType=='' || dispatchType== null){
					add();
					return;
				}
				var bookingTypeCode = $("#bookingTypeCode").val();
				var noOfEquipments = $("#equipment option").length ;
				$("#saveBtn").attr("disabled","disabled");
				loadContainers();
				if(bookingTypeCode=='T')
				{
					populatePortCode();
					if (dispatchType == 'S' || dispatchType == 'L')
					{
						$("#equipment").removeAttr("disabled");
						$("#containerNumberForDispatch").editableDropdown("enable");						
						
						if(0 == noOfEquipments)
							alert('Booking does not have any equipment');
						
						if(1 == noOfEquipments)
						 {
							var selectedEquipment = $('#equipment').val();
							if(selectedEquipment == '')							
								return;
							loadTemplateDetails();
						 }
					}
					else
					{						
						$("#equipment").removeAttr("disabled");
						
						if(0 == noOfEquipments)
							alert('Booking does not have any equipment');

						if(1 == noOfEquipments)
						 {
							var selectedEquipment = $('#equipment').val();
							if(selectedEquipment == '')							
								return;
							loadTemplateDetails();
						 }
						else {
							 var selectedEquipment = $('#equipment').val();
							 if(selectedEquipment!=''){
									loadTemplateDetails();
								}
							 }
					}
				}
				else
				{
					populatePortCode();
					if (dispatchType == 'S' || dispatchType == 'L' || dispatchType == 'R') 
					{
						$("#equipment").removeAttr("disabled");
						$("#containerNumberForDispatch").editableDropdown("enable");						
						
						if(0 == noOfEquipments)
							alert('Booking does not have any equipment');
						
						if(1 == noOfEquipments)
						 {
							var selectedEquipment = $('#equipment').val();
							if(selectedEquipment == '')							
								return;
							
							if(dispatchType != 'R')
								loadTemplateDetails();
							else
							{
								var containerNbr = $('#containerNumberForDispatch').val();
								if(containerNbr != '')
									loadTemplateDetails();	
							}
						 }
						else {
							 var selectedEquipment = $('#equipment').val();
							 if(selectedEquipment!=''){
									loadTemplateDetails();
								}
							 }
						
					} else
					{
						$("#equipment").removeAttr("disabled");
						$("#containerNumberForDispatch").editableDropdown("enable");
						var selectedEquipment = $('#equipment').val();
						if(selectedEquipment == '')
						{
						//alert('Please select equipment');
						return;
						}
						var containerNbr = $('#containerNumberForDispatch').val();
						if(containerNbr != '')
							loadTemplateDetails();

					}
				}

				enableDisableFieldsBasedOnDispatchType();
				$("#selectInputIdContainer").focus();
				isDispatchChanged="Y";

			}));
 


	var alfrescoURL="";
	var portCodeForPredictive='';
	
	$(document).ready(function() {

		setInZoneMandatoryChecks();
		
		if($("#dispatchRequestId").val()!="")
			alfrescoURL = "/documentHistory/?doctype=gspDispatch&identifier="+$('#dispatchRequestId').val();

		$('#spotPullForm').validationEngine('attach');

		$("#requiredDate").datepicker({
			dateFormat : 'mm-dd-yy'
		});
		$("#portCutOffDate").datepicker({
			dateFormat : 'mm-dd-yy'
		});
		$("#vesselCutOffDate").datepicker({
			dateFormat : 'mm-dd-yy'
		}); 
		$("#inlandCutoffDate").datepicker({
			dateFormat : 'mm-dd-yy'
		}); 

		$('#containerNumberForDispatch').editableDropdown({
			mustMatch: false,
			change: function() {
				var dispatchType = $("#spotRequirementTypeCode").val();
				if($("#selectInputIdContainer").val() == ''){
				$("#typeField").html("");
				}
				else
				{
				$("#selectInputIdContainer").validationEngine('hide');
				loadEquipementTypeForContainer();
				}
				//if (dispatchType == 'S' || dispatchType == 'L') 
				//{
					//return;
				//}				
				//else
				//{
				var dispatchType = $("#spotRequirementTypeCode").val();
				var bookingTypeCode = $("#bookingTypeCode").val();
				var containerNbr = $('#containerNumberForDispatch').val();
					var selectedEquipment = $('#equipment').val();
					if(selectedEquipment == '')
					{
						alert('Please select equipment');
						return;
					}
				//}
				
				if (dispatchType == 'S' || dispatchType == 'L')
				{
				loadTemplateDetails();
				}
				else
				{
					if(bookingTypeCode=='T')
					{
						loadTemplateDetails();
					}
					else
					{
						if(containerNbr != '')
							loadTemplateDetails();
					}
				}
				//loadTemplateDetails();
			}
		});
		
		//D025372: 	Dispatch/Rail Bill Detail: Clear Type
		$("#selectInputIdContainer").live("change", (function(){
			if($(this).val() == ''){
				$("#typeField").html("");
			}
			else
			{
			 $("#selectInputIdContainer").validationEngine('hide');
			 isDispatchChanged="Y";
			}
		}));
		
		
		$('#imgSpecialServiceCodeLine1').click(function(){
			var index=1;
			casSpSvcCodeLookup(index);
		});
		
		$('#imgTruckerRateLine1').click(function(){
			var index=1;
			casTruckerLookup(index);
		});
		
		$('#imgPayeeLine1').click(function(){
			var index=1;
			casPayeeLookup(index);
		});
		
		$('#equipmentVinsight1').click(function(){
			var index="1";
			casEquipmentVinsightLookup(index);
		});
		
		$('#equipmentVinsight1').hide();
		//Cas search Integration
		casPredictiveSearchOnAllLines();

		$('#isSpotOnPullForDispatch').click(function() {
			if ($(this).is(':checked')) {
				$("#bookingNumberForDispatch").removeAttr("disabled");
				// Defect 25451
				$("#isSpotOnPullForDispatch").val("true");
				$("#bookingNumberForDispatch").val("");
			} else {

				$("#bookingNumberForDispatch").attr("disabled", "disabled");
				$("#bookingNumberForDispatch").val("BK");
				// Defect 25451
				$("#isSpotOnPullForDispatch").val("false");
			}
			isDispatchChanged="Y";
		});
		if($('#isSpotOnPullForDispatch').is(':checked')) {
				$("#bookingNumberForDispatch").removeAttr("disabled");
				$("#isSpotOnPullForDispatch").val("true");
				if($("#bookingNumberForDispatch").val()=='')
				{
				$("#bookingNumberForDispatch").val("");
				}
				}
				
				
		$('#isInbond').click(function() {
			if ($(this).is(':checked')) {
				$("#inbond").removeAttr("disabled");
				$(this).val(true);
			} else {
				$("#inbond").attr("disabled", "disabled");
				$("#inbond").val("");
				$(this).val(false);
			}
			isDispatchChanged="Y";
		});
		
		if ($('#isInbond').is(':checked')) {
			$("#inbond").removeAttr("disabled");
			$(this).val(true);
		}

		$('#requiredTime').focusout(function() {
		
			if ($('#requiredTime').val()){
				var result = formatTime(this);
				if(!result)
				{									
					$('#requiredTime').focus();
					return result;
				}
				openTruckerRatePopupOnApptTimeSelection();
				$(appointmentTimeAm).attr('checked', false);
				$(appointmentTimePm).attr('checked', false);
				if(!Boolean($('#requiredTime').val())){
				$("#saveBtn").attr("disabled","disabled");
				}
				
				return result;
			}
		});	

		$('#openTime').focusout(function() {
			if ($('#openTime').val()){
				var result = formatTime(this);
				if(!result)
				{
					$('#openTime').focus();
					$('#openTime').validationEngine('showPrompt', '* Invalid Time Format, Enter Time in hh:mm format', 'error','topRight', true);
				}
				else
					$('#openTime').validationEngine('hideAll');
				return result;
			}
		});	

		$('#closeTime').focusout(function() {
			if ($('#closeTime').val()){
				var result = formatTime(this);
				if(!result)
				{
					$('#closeTime').focus();
					$('#closeTime').validationEngine('showPrompt', '* Invalid Time Format, Enter Time in hh:mm format', 'error','topRight', true);
				}
				else
					$('#closeTime').validationEngine('hideAll');
				return result;
			}
		}); 
		var tradeCode=$("#tradeCode").val();		
		var isRequestOutZone = $('#isRequestOutZone').val();
		if(tradeCode=='A' )
		{
		if(isRequestOutZone=='true')
		{
		setCalendarForApptDate();
		}
		}
		else
		{
		setCalendarForApptDate();
		}
        //D025735, Save disabled until rate is populated
		$('#requiredDate').live("change", (function() {
			 //$("#rate").val("");
			 if($('#bookingTypeCode').val()!='T')
			 {
			 $("#saveBtn").attr("disabled", "disabled");
			 }
			 	if(!validateContainerNo())
					return;
			var apptTime = $("#requiredTime").val();
			 if (
					$('#appointmentTimeAm').is(':checked') ||
					$('#appointmentTimePm').is(':checked') ||
					Boolean(apptTime) ) 
			   {
					openTruckerRatePopupOnApptTimeSelection();
			   }
			 if($('#requiredDate').val()!="null" && $('#requiredDate').val()!=" " && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!=" " && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!=" " && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
					$('#appointmentTimePm').is(':checked')|| (Boolean($('#requiredTime').val()) )))
			 {
				 $("#saveBtn").removeAttr("disabled"); 
			 }
			 isDispatchChanged="Y";
		}));

		$('#saveBtn').click(function(){
			if($("#spotPullForm").validationEngine('validate'))
			{		
				if(!validateContainerNo())
					return;				
				if (!validateForOneLocation())
					return;
				if (!openCloseTimeValidation())
					return;
				if(!validateApptDateTime())
					return;
				if($("#truckerCode").val() && $("#rate").val())
				{
				if(!validateTruckerRateForOutZone())
					return;
				if(!validateTruckerCodeForInZone())
					return;
				if(!validateContactForOutZone())
					return;
				}//D030104
				
				setSelectedDocumentContacts();
				var queryString = $('#spotPullForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/createdispatch/saveDispatchRequest",
					data: queryString,
					success: function(responseText){
						$.unblockUI();
						showResponseMessages(responseText.messages);
						$("#spotPullForm").loadJSON(responseText.data);						
						$("#currentTime").val(responseText.data.currentTime);
						jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
						jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						
						enableDisableFieldsBasedOnDispatchType();
						
				        $("#containerNumberForDispatch").get(0).options.length = 0;
				        
				        if(responseText.data.containerList != null)
				        $.each(responseText.data.containerList, function(index, containerList) {
				            $("#containerNumberForDispatch").get(0).options[$("#containerNumberForDispatch").get(0).options.length] = new Option(containerList.description, containerList.code);
				        });

				        var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
				        $("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});

						$('#statusCodeDiv').html(responseText.data.statusCode);
						$('#refNo').html(responseText.data.dispatchRequestId);
						$('#remarks').html(responseText.data.remarks);
						$("#DocumentHistory").attr("disabled", "disabled");
						//oldForm = $('#spotPullForm').formSerialize();
						isDispatchChanged="N";
					}
				});
			}
		});

		
		$('#saveAndSendBtn').click(function(){
			if($("#spotPullForm").validationEngine('validate'))
			{	
				
				var isSendingSectionVisible = $('#conditionAccordians5').is(':visible');
				
				if(isSendingSectionVisible == true)
				{	
					var rowIDs = '';
					rowIDs=jQuery("#contactGrid").getDataIDs();
					
					if ($('#isEdi').is(':checked')) 
					{
						//do nothing  allow to send					
					}
					else
					{
						setSelectedDocumentContacts();
						
						var selContacts = $('#selectedContacts').val();
						if(Boolean(selContacts))
						{
							//do nothing  allow to send		
						}else
						{
							$('#msgDiv').html('<div class="message_error">'+'Select contact(s) to send'+'</div>');
							window.scroll(0, 0);
							return;
						}
					}
				}
				if(!validateContainerNo())
					return;	
				if (!validateForOneLocation())
					return;
				if (!openCloseTimeValidation())
					return;
				if(!validateApptDateTime())
					return;
				if(!validateTruckerRateForOutZone())
					return;
				if(!validateContactForOutZone())
					return;

				
				var queryString = $('#spotPullForm').formSerialize();
				blockUI();
				$.ajax({
					type: "POST",
					url: _context +"/createdispatch/saveAndSendDispatchRequest",
					data: queryString,
					success: function(responseText){
						$.unblockUI();
						showResponseMessages(responseText.messages);
						$("#spotPullForm").loadJSON(responseText.data);	
						//D030888: 	GATES Performance	
						if (responseText.messages) {
							if(responseText.messages.success.length > 0){
								sendDispatchRequest();
							}
						}
						jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
						jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
						jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
						
						alfrescoURL = "/documentHistory/?doctype=gspDispatch&identifier="+$('#dispatchRequestId').val();

						enableDisableFieldsBasedOnDispatchType();
						
				        $("#containerNumberForDispatch").get(0).options.length = 0;
				        
				        if(responseText.data.containerList != null)
				        $.each(responseText.data.containerList, function(index, containerList) {
				            $("#containerNumberForDispatch").get(0).options[$("#containerNumberForDispatch").get(0).options.length] = new Option(containerList.description, containerList.code);
				        });

				        var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
				        $("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});

						$('#statusCodeDiv').html(responseText.data.statusCode);
						$('#refNo').html(responseText.data.dispatchRequestId);
						$('#remarks').html(responseText.data.remarks);						
						//oldForm = $('#spotPullForm').formSerialize();
						isDispatchChanged="N";
					}
				});
				
			}
		});

		$('#deleteBtn').click(function(){
				var r=confirm("Are you sure you want to delete this request?");
				if (r==true)
				{
					deleteDispatchRequest();
				}
		});

		$('#newBtn').click(function(){			
			loadNewPage();	
			//D027413, Cleared the accordions when clicked on new button.
			$('#createDispatchSpecialInstructionsHeader').html("");
			$("#createDispatchLocationHeader").html("");
			$("#createDispatchStatusHeader").html("");
			$("#createDispatchSendingMethodHeader").html("");
			$("#DepotRailInformationHeader").html("");
			$("#createDispatchDepot").html("");
			$("#createDispatchRampCode").html("");
			$("#createDispatchRampName").html("");
			$("#inbond").attr("value", "");
			
		});

		$('#copyBtn').click(function(){
			setSelectedDocumentContacts();
			var queryString = $('#spotPullForm').formSerialize();		
			blockUI();
			$.ajax({
				type: "POST",
				url: _context +"/createdispatch/copyAndNewDispatchRequest",
				data: queryString,
				success: function(responseText){
					$.unblockUI();
					$("#spotPullForm").loadJSON(responseText.data);
					showResponseMessages(responseText.messages);
					jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
					jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');				
					$("#dispatchRequestId").val(responseText.data.dispatchRequestId);
					//disableAllFields();
					//$("#spotRequirementTypeCode").removeAttr("disabled");
					//populateFieldsFromAjaxResponse(responseText);
					enableDisableFieldsBasedOnDispatchType();
					//D025386: 	Dispatch/Rail Bill Detail: Copy button functionality
					$("#spotRequirementTypeCode").removeAttr("disabled");
					$("#containerNumberForDispatch").editableDropdown("enable");
					$('.ui-editableDropdown input').val('');
					$("#containerNumberForDispatch").attr('value', '');
					$('#typeField').html('');
					$('#statusCodeDiv').html('');
					$('#booked').val('');
					$("#equipment").removeAttr("disabled");
					//$('#statusCodeDiv').html(responseText.data.statusCode);
					$('#refNo').html('');
					$('#remarks').html('');
					$("#DocumentHistory").attr("disabled", "disabled");
					//D026334, App Date not required when clicked on copy btn 
				    $("#requiredDate").val('');  
				    setCalendarForApptDate();
					isDispatchChanged="Y";
				    //D027780
				    if($("#spotRequirementTypeCode").get(0).options.length == 1){
						var messageContent = $('#msgDiv').html();
						messageContent += '<div class="message_warning">Invalid type for the Load Discharge service.</div>';
						$('#msgDiv').html(messageContent);
					}
				}
			});
		});

		$('#cancelBtn').click(function(){
			//D030749
			if( $("#spotRequirementTypeCode").val() =='R' )
			{
			var r=confirm("Please confirm CANCEL - request already sent.");
			}
			else
			{
				var r=confirm("Are you sure you want to cancel this request?");
			}
			if (r==true)
			{
				var status =   $("#statusCode").val();
				if(status == 'OPEN')
	            {
					deleteDispatchRequest();
				}
				else
				{				
					var queryString = $('#spotPullForm').formSerialize();
					blockUI();
					$.ajax({
						type: "POST",
						url: _context +"/createdispatch/cancelDispatchRequest",
						data: queryString,
						success: function(responseText){
							$.unblockUI();
							//D025486
							//$("#saveAndSendBtn").attr("disabled", "disabled");
							$("#cancelBtn").attr("disabled", "disabled");
							$("#spotPullForm").loadJSON(responseText.data);
							showResponseMessages(responseText.messages);
							jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
							jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
							jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
							$('#statusCodeDiv').html(responseText.data.statusCode);
							//oldForm = $('#spotPullForm').formSerialize();
							isDispatchChanged="N";
						}
					});
				}
			}
		});

//		$('#spotRequirementTypeCode').live("change",(function() {

		var dispatchType = $("#spotRequirementTypeCode").val();
		
	    // code to bind pop up search on trucker text box
		 $('#truckerCode').gatesPopUpSearch({func:function() {truckerPopupSearch(true)}});

		 populatePortCode();
		 
		 $('#truckerCode').gatesAutocomplete({
			 source: _context+'/cas/autocomplete.do',
				extraParams: {
					  method: 'searchTrucker',
					  searchType: '241',
					  parentSearch:  function() { 
						  return portCodeForPredictive; }
				},
				formatItem : function(item) {
					$('#truckerArolId').val(item.ADDRESS_ROLE_ID);
					return item.TRUCKER_CODE + "-" + item.TRUCKER_NAME;
				},
				formatResult : function(item) {
					$('#truckerArolId').val(item.ADDRESS_ROLE_ID);
					$('#truckerName').val(item.TRUCKER_NAME);
					$('#rate').val('');
					return item.TRUCKER_CODE;// + "-" + item.cityName;
				},
				select : function(item) {
				}
		 });


	    var bookingStatus = $("#bookingStatus").val();
	    var bookingTypeCode = $("#bookingTypeCode").val();
	    
	    if(bookingStatus == 'APPR' || bookingStatus == 'OFFR' || bookingTypeCode=='T')
	    	{
	    		$("#addBtn").removeAttr("disabled");
    			$("#sendBtn").removeAttr("disabled");	    		
	    	}
	   	else
	   		{
	   			$("#addBtn").attr("disabled", "disabled");
	   			$("#sendBtn").attr("disabled", "disabled");
	   		}
	    if($("#spotRequirementTypeCode option").size() <=1){
		$("#addBtn").attr("disabled", "disabled");
		}
		var isRequestOutZone = $('#isRequestOutZone').val();
		if(isRequestOutZone == 'false')
			$("#sendBtn").attr("disabled", "disabled");
		
		$('#searchBtn').click(function(){
			
			var bookingNumber =  $("#bookingNumber").val();
			var bookingNumberLength = bookingNumber.length;
			
			if(bookingNumberLength != 7)
			{
				alert('Booking number should be of 7 digits');
				return false;
			}
			$('#searchType').val('S');	
			document.getElementById('displayPage').style.display = 'none';
			$("#spotPullForm").attr("action", "loadDispatchRequestByShipmentNumber"/*+bookingId+"&containerNbr="+containerNbr+"&requestType="+requestType */);
		    $("#spotPullForm").submit(); 
			});
		 
			
		var args = {
				entityType: 'SPRQ',
				entityId: $('#dispatchRequestId').val(),
				commentId:  'commentId',
				displayCommentTypes: ''
			};
		getCommentTypes(args);
		//D020000, For booking comments in dispatch
		var isDeleteAllowed = false;
		var isEditAllowed = false;
		if($('#bookingTypeCode').val()=="T")
		{
			isDeleteAllowed = true;
			isEditAllowed = true;
		}
		var bookingArgs = {
				entityType: 'BKNG',
				entityId: $('#bookingId').val(),
				commentId: 'bookingCommentId',
				displayCommentTypes: 'ALL',
				commentTypesForGrid:'',
				isDeleteAllowed:isDeleteAllowed,
				isEditAllowed:isEditAllowed
			   };	
		getBookingCommentTypes(bookingArgs);
		
		var url = _context+'/cas/autocomplete.do?method=searchBKNumber&searchType=230&parentSearch='+$('#bookingTypeCode').val();
		$('#bookingNumberForDispatch').gatesAutocomplete({
		source: url,
		minLength: 3,
		formatItem: function(data) {
		return data.shno;
		},
		formatResult: function(data) {
		return data.shno;
		},
		select: function(data) {
		//showLoadingMessage();
		$('#bookingNumberForDispatch').val(data.shno);
		}
		});
		
		 // D020433 -- Starts --
			$('#depot').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompDepotPredictive',
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
					return item.longDesc;// + " " + item.cityName;
				},
				formatResult : function(item) {
					return item.longDesc;// + "-" + item.cityName;
				},
				select : function(item) {
					$('#depotCodeHidden').val(item.longDesc);
					//D025363
					$("#createDispatchDepot").html(item.longDesc);
					somethingChanged = true;
					isDispatchChanged="Y";
				}
			});
			
			$('#depot').gatesPopUpSearch({
				func : function() {
					placePopupSearchForDepot($('#depot').val(), 2);
				}
		 // D020433 -- Ends --
			});
			
			$('#rampCode').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompCityPredictive',
				// Defect 25312
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
					if(item.stateCode != " " && item.stateCode != undefined){
						return item.cityCode+"-"+item.cityName+","+item.stateCode;	
					}
					else{
						return item.cityCode+"-"+item.cityName;
					}
				},
				formatResult : function(item) {
					if(item.stateCode != " " && item.stateCode != undefined){
						return item.cityCode+"-"+item.cityName+","+item.stateCode;	
					}
					else{
						return item.cityCode+"-"+item.cityName;
					}
				},
				select : function(item) {
					var desc = "";
					if(item.stateCode != " " && item.stateCode != undefined){
						desc =  item.cityCode+"-"+item.cityName+","+item.stateCode;		
					}
					else{
						desc = item.cityName;
					}
					
					$('#rampCode').val(desc);
					$('#rampCodeHidden').val(item.cityCode);
					//D025363
					$("#createDispatchRampCode").html(desc);
					somethingChanged = true;
					isDispatchChanged="Y";
				}
			});
			
			$('#rampCode').gatesPopUpSearch({
				func : function() {
					placePopupSearch($('#rampCode').val(), 5);
				}
			});
			
					
			$('#originRampCode').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompCityPredictive',
				// Defect 25312
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
					return item.cityCode + " " + item.cityName;
				},
				formatResult : function(item) {
					return item.cityCode;// + "-" + item.cityName;
				},
				select : function(item) {
				}
			});
			
			$('#originRampCode').gatesPopUpSearch({
				func : function() {
					placePopupSearch($('#originRampCode').val(), 3);
				}
			});
			
			$('#destinationRampCode').gatesAutocomplete({
				source : _context + '/tm/Autocomplete/autoCompCityPredictive',
				// Defect 25312
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
					return item.cityCode + " " + item.cityName;
				},
				formatResult : function(item) {
					return item.cityCode;// + "-" + item.cityName;
				},
				select : function(item) {
				}
			});

			$('#destinationRampCode').gatesPopUpSearch({
				func : function() {
					placePopupSearch($('#destinationRampCode').val(), 4);
				}
			});

			

			
			$('#organisations').gatesPopUpSearch({
				func : function() {
					organizationPopupSearch();
				}
			});
			
			 /*
			 * For Customer Predictive Search
			 */
			// var url = _context + '/cas/autocomplete.do?method=searchOrganization&searchType=206';	
			$('#organisations').gatesAutocomplete({
				source: _context+'/cas/autocomplete.do',//url,
				extraParams: {
					  method: 'searchOrg',
					  searchType: '229',
					  parentSearch: ''
					},
				formatItem : function(data) {
					return data.name + "-" + data.abbr;
				},
				formatResult : function(data) {
					return data.name + "-" + data.abbr;
				},
				select : function(data) {
					$("#orgName").val(data.name + "-" + data.abbr);
					$("#organizationId").val(data.id);
					$("#addRolDesc").val("");
					$("#addressRoleId").val("");
					clearContactDetails();
					
					//var urlForAddressSearch = _context + '/cas/autocomplete.do?method=searchAddRolDesc&searchType=245&parentSearch='+ $("#organizationId").val();
					$('#addRolDesc').gatesAutocomplete({
						//source: urlForAddressSearch,
						source: _context+'/cas/autocomplete.do',
						extraParams: {
							  method: 'searchAddRolDesc',
							  searchType: '245',
							  parentSearch:  function() { 
								  return $("#organizationId").val(); }
							},
						formatItem: function(data) {
							return formatAddRoleDscr(data.name, data.address, data.city, data.state);
						},
						formatResult: function(data) {
							return formatAddRoleDscr(data.name, data.address, data.city, data.state);
						},
						select: function(data) {
							$("#addRolDesc").val(data.address);
							$("#addressRoleId").val(data.id);
							//$("#contact").val(data.address);
							//$("#cityStateZip").val(data.city);
							//$("#quoteSuite").val(data.suite);
							$("#city").val(data.city);
							$("#state").val(data.state);
							$("#zip").val(data.zip);
							populateLocationData();
							//$("#country").val(data.cntry);
							somethingChanged = true;
							isDispatchChanged="Y";					
							}
						 });
					singleAddressCall();
				}
			});
			
			var urlForAddressSearch = _context + '/cas/autocomplete.do?method=searchAddRolDesc&searchType=245&parentSearch='+ $("#organizationId").val();
			$('#addRolDesc').gatesAutocomplete({
				source: urlForAddressSearch,
				formatItem: function(data) {
					return formatAddRoleDscr(data.name, data.address, data.city, data.state);
				},
				formatResult: function(data) {
					return formatAddRoleDscr(data.name, data.address, data.city, data.state);
				},
				select: function(data) {
					$("#addRolDesc").val(data.address);
					$("#addressRoleId").val(data.id);
					$("#city").val(data.city);
					$("#state").val(data.state);
					$("#zip").val(data.zip);
					somethingChanged = true;
					isDispatchChanged="Y";					
					}
			 });
			
			
			$('#addRolDesc').gatesPopUpSearch({
				func : function() {
					//addRolDescPopupSearch();
					custAddressPopupSearch();
				}
			});
			
			$('#organisations').change(function() {		
				if ($('#organisations').val() != $('#orgName').val()) {
					$('#addRolDesc').val("");
					$("#organizationId").val("");
					clearContactDetails();
					somethingChanged = true;
					isDispatchChanged="Y";
				}
			});
			
			$('#addRolDesc').change(function() {
				$('#addressId').val("");
				clearContactDetails();
				//$("#addressLine1").trigger("change");
				somethingChanged = true;
				isDispatchChanged="Y";
			});
			

			
			$('#sendBtn').click(
					
					function()
					{
						var selectedMulti = $('#dispatchBillGridTable').getGridParam('selarrrow');
						var selected = $('#dispatchBillGridTable').getGridParam('selrow');
						if(selected!=null && selectedMulti!=null)
						{ 					   
								if(selectedMulti.length > 0)
								{
									var rowData = $('#dispatchBillGridTable').getRowData(selected); 
									var dispatchRequestId = rowData["dispatchRequestId"];
									var status = rowData["status"];
									var length=dispatchRequestId.length;
									var dispatchRequestId=dispatchRequestId.substring(0,length-3);
									$('#selectedDispatchRequest').val(dispatchRequestId);
									var selectedDispatchRequest = $('#selectedDispatchRequest').val();
									
									if(status == 'CANCEL' || status == 'COMPLETE' || status == 'CANACK' || status == 'PENDING')
									{
									 alert("Status of the selected request should not be COMPLETE, INGATED, CANACK or PENDING");
									 return;
									}
									else{
									if(selectedMulti.length == 1)
									{
										var queryString = $('#spotPullForm').formSerialize();
										blockUI();
										$.ajax({
											type: "POST",
											url: _context +"/createdispatch/sendFromSearchScreenSpotPullRequest",
											data: queryString,
											success: function(responseText){
												$.unblockUI();
												$("#spotPullForm").loadJSON(responseText.data);
												showResponseMessages(responseText.messages);
												jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
												jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
												jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
												//oldForm = $('#spotPullForm').formSerialize();
												isDispatchChanged="N";
										}
										});
									  //document.location.href =_context+'/createdispatch/sendFromSearchScreenSpotPullRequest?dispatchRequestId='+dispatchRequestId;
									}
								   else
								   {
									   alert("Please Select a Single Dispatch Request only.");
									   return false;
								   }
								}
							}
						else
							{
								alert("Please Select One Dispatch Request to Send.");
								return false;
							}
						}
						else
						{
							alert("Please select atleast one Dispatch Request.");
							return false;
						}
						
					});

			/*if($('#userFromMenu').val()=='Y'){
				$('#exitBtn').hide();
			}else{
				$('#exitBtn').show();
			}
			*/
			//Exit 
			var exitFlag = false;
			$('#exitBtn').click(function() {
				//window.setTimeout("window.close()", 0);
				//document.location.href = '/gates/createdispatch/exit';
				var newForm = $('#spotPullForm').formSerialize();
					exitFlag = true;
				if(isDispatchChanged=="Y" )
				{
				var isConfirm = confirm("All the unsaved changes will be discarded. Please confirm to proceed!");
						if (isConfirm) {
							$.ajax({
							type: "POST",
							url: _context +"/createdispatch/exit",
							success: function(responseText){
								if($.trim($('#userFromMenu').val()) == 'booking') {
								if($('#bookingNumber').val().indexOf('T')!=-1){
								document.location.href = _context + '/booking/template/showTemplateForm?templateNumber='+ $('#bookingNumber').val();
								}else{
								document.location.href = _context + '/booking/showForm?bookingNumber='+ $('#bookingNumber').val();
								}
								} else if($.trim($('#userFromMenu').val()) == 'wiredown' && $.trim($('#prevURL').val()) != undefined && $.trim($('#prevURL').val()) != '') {
								document.location.href = $.trim($('#prevURL').val());
								}
								else if($.trim($('#userFromMenu').val()) == 'Y')
								{
								document.location.href = _context + '/welcome.html';
								}
								}
							});
						}
						else{
							exitFlag = false;
							return;
						}
				}
				else {
				$.ajax({
							type: "POST",
							url: _context +"/createdispatch/exit",
							success: function(responseText){
								if($.trim($('#userFromMenu').val()) == 'booking') {
								if($('#bookingNumber').val().indexOf('T')!=-1){
								document.location.href = _context + '/booking/template/showTemplateForm?templateNumber='+ $('#bookingNumber').val();
								}else{
								document.location.href = _context + '/booking/showForm?bookingNumber='+ $('#bookingNumber').val();
								}
								} else if($.trim($('#userFromMenu').val()) == 'wiredown' && $.trim($('#prevURL').val()) != undefined && $.trim($('#prevURL').val()) != '') {
								document.location.href = $.trim($('#prevURL').val());
								}
								else if($.trim($('#userFromMenu').val()) == 'Y')
								{
								document.location.href = _context + '/welcome.html';
								}
								}
							});
				}
				
			});
		$(window).bind('beforeunload', function(event){
		var newForm = $('#spotPullForm').formSerialize();
		 if(isDispatchChanged=="Y" && !exitFlag ) {
			 exitFlag = false;
			 event.stopImmediatePropagation();
			 return 'You have unsaved changes!';
		 }
		 exitFlag = false;
	});
			//vaibhav
			//D025375,025452
			$('#truckerCode').focusout(function(){
				if($('#truckerCode').val().trim()!='' && $('#truckerArolId').val().trim()!='' && $('#rate').val().trim()!='')
				{
				loadDocumentContactDetails(false);
                }
			/*	if($('#truckerName').val().trim()!=''){
				$("#saveBtn").removeAttr("disabled");
				if($('#isRequestOutZone').val() == 'true')
					$("#saveAndSendBtn").removeAttr("disabled");
				} */
			});
			
		/*	$('#truckerCode').focusout(function(){
				if($('#truckerCode').val().trim()!=''&&$('#truckerName').val().trim()!=''&& $('#rate').val().trim()!=''){
				$("#saveBtn").removeAttr("disabled");	
				if($('#isRequestOutZone').val() == 'true')
					$("#saveAndSendBtn").removeAttr("disabled");
				}
			});*/
	    	$('#rate').focusout(function(){
				if($('#truckerCode').val().trim()!=''&&$('#truckerName').val().trim()!=''&& $('#rate').val().trim()!=''){
				$("#saveBtn").removeAttr("disabled");	
				if($('#isRequestOutZone').val() == 'true')
                    $("#saveAndSendBtn").removeAttr("disabled");
				}
				else
					{
					if($('#bookingTypeCode').val()!='T')
					{
					$("#saveBtn").attr("disabled", "disabled");
					}
					$("#saveAndSendBtn").attr("disabled", "disabled");
					}
			});  
			
			$('#bookingNumber').gatesAutocomplete({
				//source: url,
				source:_context+'/cas/autocomplete.do',
			 	extraParams: {
				 		 method: 'searchBKNumber',
				 		 searchType: '230',
				 		 parentSearch:  function() { return ''; }
			 	},
				minLength: 7,
				formatItem: function(data) {
					return data.shno;
				},
				formatResult: function(data) {
					return data.shno;
				}, 
				select: function(data) {
					var bookingNumber =  $("#bookingNumber").val();
					var bookingNumberLength = bookingNumber.length;
					if(bookingNumberLength != 7){
						alert('Booking number should be of 7 digits');
						return false;
					}
					$('#searchType').val('B');
					document.getElementById('displayPage').style.display = 'none';
					$("#spotPullForm").attr("action", "loadDispatchRequestByShipmentNumber"/*+bookingId+"&containerNbr="+containerNbr+"&requestType="+requestType */);
					//oldForm = $('#spotPullForm').formSerialize();
				    $("#spotPullForm").submit();
					isDispatchChanged="N";
				}
			});

			var dispatchRequestId = $("#dispatchRequestId").val();
			
			if(dispatchRequestId >0 )
			{
				document.getElementById('displayPage').style.display = 'block';
				//animatedcollapse.hide('searchGridDiv');
				$("#spotRequirementTypeCode").attr("disabled", "disabled");
				$("#dispatchBillGridTable").jqGrid('setGridState','hidden'); 
				$("#comment_link").removeAttr("disabled");
				$("#DocumentHistory").removeAttr("disabled");
				enableDisableFieldsBasedOnDispatchType();
			}
			else
			{
				$("#deleteBtn").attr("disabled", "disabled");
				$("#cancelBtn").attr("disabled", "disabled");
				$("#DocumentHistory").attr("disabled", "disabled");
			};
			
			//D025370: 	Dispatch/Rail Bill Detail: Tabout Issue
			var tabbedfromEqu = false;
			var tabbedfromCntr = false;
			$('#equipment').bind('keydown', function(e) { 
				var keyCode = e.keyCode || e.which; 
				if (keyCode == 9) {
					tabbedfromEqu = true;
				} 
			});
			
			$('.ui-editableDropdown input').bind('keydown', function(e) { 
				var keyCode = e.keyCode || e.which; 
				if (keyCode == 9) {
					tabbedfromCntr = true;
				} 
			});
			
			$('.ui-editableDropdown input').next().focusin(function() { 
				if(tabbedfromEqu){
					$('.ui-editableDropdown input').focus();
					tabbedfromEqu = false;
				}
			});
			
			$('.ui-editableDropdown input').focusout(function() { 
				if(tabbedfromCntr){
					$('.ui-editableDropdown input').next().focus();
					$('.ui-editableDropdown input').next().addClass("ui-state-focus");
					//if(!validateContainerNo())
					//return;	
					tabbedfromCntr = false;
				}
				
			});
		
			enableDisableForSecurity();
			tabSequence('#spotPullForm',false,false);
			
   if($('#depot').val()==" "){
	   $("#createDispatchDepotInformationHeader").html('');
   }
	   
   if($('#rampCode').val()==" "){
	   $("#createDispatchRampCityInformationHeader").html('');
   }
  
   if($('#rampName').val()==" "){
	  $("#createDispatchRailRoadInformationHeader").html('');
   }
	isDispatchChanged="N";
	//oldForm = $('#spotPullForm').formSerialize();		
	});   // document ready function ends

	function truckerPopupSearch(openPopup) {

		var isRequestOutZone = $('#isRequestOutZone').val();
		var dispatchType = $("#spotRequirementTypeCode").val();
		var requiredDate = $("#requiredDate").val();
		
		if(isRequestOutZone == 'true')
		{
			if($("#bookingTypeCode").val()!='T' && !Boolean(requiredDate))
			{
				alert('Appt Date is mandatory for rate calculation of out-zone requests.'); 
				return false;
			}			
			if(!Boolean(dispatchType))
			{
				alert('Dispatch Type is mandatory for rate calculation of out-zone requests.'); 
				return false;
			}			

			var locationList = jQuery("#dispatchLocationGridTable").getDataIDs();	
			// alert(lista.length);
		 	if($("#bookingTypeCode").val()!='T' &&  locationList.length<1)
		 	{
		 		alert("Atleast one location should be present for rate calculation of out-zone requests.");
		 		return false;
			}

		}
		
		//enhancement for fetching rates for alaska outzone
		var tradeCode=$("#tradeCode").val();
		var loadSvc = $("#loadServiceCode").val();
		var dschSvc = $("#dischargeServiceCode").val();
		var flag1= false;
		var flag2= false;
		if((loadSvc=='DS'||loadSvc=='IMS')&& (dispatchType=='S'||dispatchType=='P'||dispatchType=='L')){ flag1= true;}
		if((dschSvc=='DS'||dschSvc=='IMS')&& (dispatchType=='D'||dispatchType=='U'||dispatchType=='E')){ flag2= true;}
		if (tradeCode=='A' && $('#isRequestOutZone').val() == 'true' && (flag1 || flag2)){
			$("#rate").val('');	
			var queryString = $('#spotPullForm').formSerialize();
			$.ajax({
				async: false,
		        type: "POST",
				url: _context +"/createdispatch/getAlaskaOutzoneRate",
				data: queryString,
				success: function(responseText){
				$("#truckerCode").val('');	
				$("#truckerArolId").val(responseText.data.truckerArolId);
				$("#rate").val(responseText.data.rate);
				$('#truckerName').val(responseText.data.truckerName);
				
				}
			});
		if($("#truckerArolId").val() !='' && $('#truckerName').val()!='' && $("#rate").val() !=''){
			loadDocumentContactDetails(true);
				if($('#requiredDate').val()!="null" && $('#requiredDate').val()!="" && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!="" && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!="" && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
			$('#appointmentTimePm').is(':checked') || (Boolean($('#requiredTime').val()))))
			 {
			$("#saveBtn").removeAttr("disabled");
			if($('#isRequestOutZone').val() == 'true'){
			 $("#saveAndSendBtn").removeAttr("disabled");
             }		 
			 }
			return true;
			}
		}
/*		 
	filterValue1        IN IN_TRUCKER_CODE              varchar(30),
	filterValue2        IN IN_PORT_CODE                 varchar(10),
	filterValue3		IN  IN_SPOT_REQUIREMENT_TYPE_CODE char(1),
	filterValue4		IN  IN_BOOKING_ID               BIGINT  ,
	filterValue5		IN  IN_SERVICE_ITEM_CODE        VARCHAR(8),
	filterValue6		IN  IN_ZIP_CODE                 VARCHAR(9),
	filterValue7		IN  IN_REQUIRED_DATE            DATETIME,
	filterValue8        IN  in_eq_type                  varchar(1),
	filterValue9		IN  in_eq_ht                    varchar(1),
	filterValue10		IN  in_eq_len                   varchar(2),
	filterValue11		IN  IN_SHC_FLAG                 char(1),
    filterValue12		IN  IN_STATE_CODE               VARCHAR(9),

 */
		var filterValue1 = $('#truckerCode').val();
		
		var filterValue2='';
		var filterValue6=''; // zip code needed for zone calculation
		
		var filterValue3 = $("#spotRequirementTypeCode").val();
		
		if (filterValue3 == 'S' || filterValue3 == 'P' || filterValue3 == 'L') 
		{			
			filterValue6 =$('#bookingPickUpZipCode').val(); 
			filterValue2 = $('#originPortCityCode').val();
		}
		else
		{
			filterValue6 =$('#bookingDeliveryZipCode').val();
			filterValue2 = $('#destPortCityCode').val();
		}
		
		var filterValue4 = $("#bookingId").val();
		var filterValue5 =''; // zone..needs to be calculated in stored proc itself.
		
		var filterValue7 = $("#requiredDate").val();
		var bookingTypeCode = $("#bookingTypeCode").val();
		 if(bookingTypeCode=='T')
		 {
		 var currentDate = new Date(new Date().getTime());
			var day = currentDate.getDate();
			var month = currentDate.getMonth() + 1;
			var year = currentDate.getFullYear();
		 filterValue7=month+"-"+day+"-"+year;
		 }
		var filterValue8 = $("#equipmentType").val();
		var filterValue9 = $("#equipmentHeight").val();
		var filterValue10 = $("#equipmentSize").val();
		var filterValue11 = 'N'; // 'N' for 1 location 'Y' for multiple locations.
		
		var locationList = jQuery("#dispatchLocationGridTable").getDataIDs();
		//if(locationList.length>1)
		//	filterValue11 = 'Y'; // 'N' for 1 location 'Y' for multiple locations.
		
		var state='';
		for(var j=0;j<locationList.length;j++)
		{ 				 
			rowData=jQuery("#dispatchLocationGridTable").getRowData(locationList[j]);		
			state=rowData.state;
			break;
		}
		
		var filterValue12 = state;
		var multipleRatesFound = $("#multipleRatesFound").val(); // should be true only after click of save 
		var bookingTypeCode = $("#bookingTypeCode").val();
		
// open search trucker only in case of template booking
//		if(isRequestOutZone == 'false' && multipleRatesFound == 'false' && bookingTypeCode=='T')
		/*if(bookingTypeCode=='T')
		{
			
			var actionUrl = '../cas/truckerSearchSpotAndPullLookup.do?filterValue1='+ filterValue1 + '&filterValue2='+ filterValue2 + '&autoSearch=true' ;
			
			var actionUrlWithPipe =  filterValue1  
			+ '|'+ filterValue2 
			;
			
			$.ajax({
				type : "POST",
				url : _context +"/cas/autocomplete.do?method=searchTrucker&searchType=241&term="+filterValue1+"&parentSearch="+filterValue2,
						
						success : function(responseText) {
							
							if(responseText!= null && responseText.length==1 ){
								
								truckerSearchUpdate(responseText[0].truckerInfo); 							
								
							} else {
							// call popup
								var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
								window.open(actionUrl, 'AddressPopSearch', windowStyle);

							}
						},
						error : function(responseText) { 
							// call popup
							var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
							window.open(actionUrl, 'AddressPopSearch', windowStyle);

							
						}

						
					});

			
			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
			window.open(actionUrl, 'AddressPopSearch', windowStyle);	
		}
		else*/
		//{
			var actionUrl = '../cas/truckerRateSelectionSearch.do?filterValue1='+ filterValue1  
			+ '&filterValue2='+ filterValue2 
			+ '&filterValue3='+ filterValue3
			+ '&filterValue4='+ filterValue4
			+ '&filterValue5='+ filterValue5
			+ '&filterValue6='+ filterValue6
			+ '&filterValue7='+ filterValue7
			+ '&filterValue8='+ filterValue8
			+ '&filterValue9='+ filterValue9
			+ '&filterValue10='+ filterValue10
			+ '&filterValue11='+ filterValue11							
			+ '&filterValue12='+ filterValue12
			+ '&autoSearch=true'
			;

			var actionUrlWithPipe =  filterValue1  
			+ '|'+ filterValue2 
			+ '|'+ filterValue3
			+ '|'+ filterValue4
			+ '|'+ filterValue5
			+ '|'+ filterValue6
			+ '|'+ filterValue7
			+ '|'+ filterValue8
			+ '|'+ filterValue9
			+ '|'+ filterValue10
			+ '|'+ filterValue11							
			+ '|'+ filterValue12
			;

			var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';

			if(openPopup)
				window.open(actionUrl, 'TruckerRatePopSearch', windowStyle);
			else{
				blockUI();
			$.ajax({
				type : "POST",
				url : _context +"/cas/autocomplete.do?method=getTruckerRateSelection&searchType=275&parentSearch="+encodeURIComponent(actionUrlWithPipe),
						
						success : function(responseText) {
							$.unblockUI();
							if(responseText!= null && responseText.length==1 ){
								
								truckerSearchRateUpdate(responseText[0].truckerInfo); 							
								
							} else {
								if(responseText.length>1){ //D026662,Fix for trucker pop-up
							// call popup
								window.open(actionUrl, 'TruckerRatePopSearch', windowStyle);
								}
								//D029104
								else
								{
								var messageContent = $('#msgDiv').html();
								messageContent += '<div class="message_error"> No Rate Found.</div>';
								$('#msgDiv').html(messageContent);
								$("#saveBtn").removeAttr("disabled"); //D030104
								$("#saveAndSendBtn").attr("disabled", "disabled");
								}
								
							}
						},
						error : function(responseText) { 
							// call popup
							window.open(actionUrl, 'TruckerRatePopSearch', windowStyle);
							
						}

						
					});
					
			
		}
	}			

	function truckerSearchRateUpdate(id)
	{
		var values = id.split("|");
		$('#truckerCode').val(values[0]);		
		$('#truckerName').val(values[1]);
		var bookingTypeCode = $("#bookingTypeCode").val();
		if(bookingTypeCode!='T')
		{
		$('#rate').val(values[2].replace(/,/g,''));
		}
		$('#truckerArolId').val(values[7]);
		loadDocumentContactDetails(true);
		if($('#requiredDate').val()!="null" && $('#requiredDate').val()!="" && $('#requiredDate').val()!=undefined && 
			 $('#truckerName').val()!="null" && $('#truckerName').val()!="" && $('#truckerName').val()!=undefined 
			 && $("#rate").val()!="null" && $("#rate").val()!="" && $("#rate").val()!=undefined && ($('#appointmentTimeAm').is(':checked') ||
			$('#appointmentTimePm').is(':checked') || (Boolean($('#requiredTime').val()))))
			 {
			$("#saveBtn").removeAttr("disabled");
			if($('#isRequestOutZone').val() == 'true'){
			 $("#saveAndSendBtn").removeAttr("disabled");
             }		 
			 }
		
	}
	
	function truckerSearchUpdate(id)
	{
		var values = id.split("|");
		$('#truckerCode').val(values[0]);
		$('#truckerName').val(values[1]);
		$('#truckerArolId').val(values[2]);
		$('#rate').val('');
		loadDocumentContactDetails(true);
		
	}
	
	function truckerSearchOverrideUpdate(id)
	{
		var values = id.split("|");
		$('#truckerCode').val('');		
		$('#truckerName').val(values[0]);
		$('#truckerArolId').val(values[1]);
		$('#rate').val('');
		
		var isRequestOutZone = $('#isRequestOutZone').val();
		if(isRequestOutZone == 'true')
		{
			$("#saveAndSendBtn").removeAttr("disabled");
		}

		loadDocumentContactDetails(true);
		
	}

	function disableAllFields()
	{
		$("#requiredDate").attr("disabled", "disabled");
		$("#requiredTime").attr("disabled", "disabled");
		$("#equipment").attr("disabled", "disabled");
		$("#containerNumberForDispatch").editableDropdown("disable");
		$("#truckerName").attr("disabled", "disabled");
		$("#rate").attr("disabled", "disabled");
		$("#originRampCode").attr("disabled", "disabled");
		$("#destinationRampCode").attr("disabled", "disabled");
		$("#isSpotOnPullForDispatch").attr("disabled", "disabled");
		$("#isInbond").attr("disabled", "disabled");
		$("#bookingNumberForDispatch").attr("disabled", "disabled");
		$("#isOkToSub").attr("disabled", "disabled");
		$("#portCutOffDate").attr("disabled", "disabled");		
		$("#inbond").attr("disabled", "disabled");
		$("#seal").attr("disabled", "disabled");
		$("#truckerCode").attr("disabled", "disabled");
		$("#weight").attr("disabled", "disabled");
		$("#appointmentTimeAm").attr("disabled", "disabled");
		// D025377   
		$("#appointmentTimeAm").prop('checked', false);
		$("#appointmentTimePm").attr("disabled", "disabled");
		// D025377  
		$("#appointmentTimePm").prop('checked', false);
		$("#comment_link").attr("disabled", "disabled");
		$("#saveAndSendBtn").attr("disabled", "disabled");
		$("#DocumentHistory").attr("disabled", "disabled");
		
	} 

	function populateLocationData()
	{
		var queryString = $('#dispatchLocationGridForm').formSerialize();
		$.ajax({
			        type: "POST",
					url: _context +"/createdispatch/getContactDetails",
					data: queryString,
					success: function(responseText){
						$("#dispatchLocationGridForm").loadJSON(responseText.data);
						requestForContactList('bookingAddressRole');
						populateFieldsForLocation(responseText);
					}
				});
	}
	function populateFieldsForLocation(responseText)
	{
		$("#dispatchLocationGridForm.contactName").val(responseText.data.contactName);
		$("#dispatchLocationGridForm.email").val(responseText.data.email);
		$("#dispatchLocationGridForm.fax1").val(responseText.data.fax1);
		$("#dispatchLocationGridForm.fax2").val(responseText.data.fax2);
		$("#dispatchLocationGridForm.fax3").val(responseText.data.fax3);
		$("#dispatchLocationGridForm.fax4").val(responseText.data.fax4);
		$("#dispatchLocationGridForm.fax5").val(responseText.data.fax5);
	}
	//	D025364
	function requestForContactList(source){
		if(null!=$('input[name="addressRoleId"]').val() && $('input[name="addressRoleId"]').val()!=''){
			$.ajax({
				type : "POST",
				url : _context +"/booking/arole/getContactList",
				data : {
					addressRoleId : $('input[name="addressRoleId"]').val()
				},
				success : function(responseText) {
					$('#contactId').children().remove();
					$('#contactId').append($("<option/>", {value : "",text : "Select"}));
					$.each(responseText.data.contactListForm, function(index, value) {
						$('#contactId').append($("<option/>", {
									value : value.contactId,
									text : value.contactDesc
						}));
					});
					if(responseText.data.primaryBookingContId!=undefined){
						$('select[name="'+source+'\\.contactId"]').val(responseText.data.primaryBookingContId);
					}else{
						$('select[name="'+source+'\\.contactId"]').val('');
					}
					//requestForContactDetails(source);
				}
			});
		}
	}

	function enableDisableFieldsBasedOnDispatchType()
	{
		setInZoneMandatoryChecks();
		var tradeCode=$("#tradeCode").val();
		var isRequestOutZone = $('#isRequestOutZone').val();
		if(tradeCode=='A' )
		{
		if(isRequestOutZone=='true')
		{
		setCalendarForApptDate();
		}
		}
		else
		{
		setCalendarForApptDate();
		}
		var dispatchType = $("#spotRequirementTypeCode").val();
	
		if (dispatchType == 'P') {
			$("#isSpotOnPullForDispatch").removeAttr("disabled");
			if($("#isSpotOnPullForDispatch").is(':checked')){
				$("#bookingNumberForDispatch").removeAttr("disabled");
				if($("#bookingNumberForDispatch").val()=='')
				{
				$("#bookingNumberForDispatch").val("");
				}
			}
		} else
		{	
			$("#isSpotOnPullForDispatch").attr("disabled", "disabled");
			$("#bookingNumberForDispatch").attr("disabled", "disabled");
			$("#bookingNumberForDispatch").val("BK");
		}

		if (dispatchType == 'R') 
		{
			$("#requiredDate").attr("disabled", "disabled");
			$("#requiredDate").val("");
			$("#requiredTime").attr("disabled", "disabled");
			$("#requiredTime").val("");
			$("#appointmentTimeAm").attr("disabled", "disabled");
			$("#appointmentTimeAm").prop('checked', false);
			$("#appointmentTimePm").attr("disabled", "disabled");
			$("#appointmentTimePm").prop('checked', false);
			$("#originRampCode").removeAttr("disabled");
			$("#destinationRampCode").removeAttr("disabled");
			$("#saveBtn").attr("disabled", "disabled");
			$("#rate").attr("disabled", "disabled");
			$("#rate").val("");
			$("#deleteBtn").attr("disabled", "disabled");
			$("#truckerCode").attr("disabled", "disabled");
			$("#truckerCode").val("");
			$("#seal").removeAttr("disabled");
			$("#weight").removeAttr("disabled");			
			$("#saveAndSendBtn").removeAttr("disabled");
			//document.getElementById('railInfoDiv').style.display = 'none';
			$('#conditionAccordians2').hide();
			$("#originRampCode").addClass("validate[required]");
			$("#destinationRampCode").addClass("validate[required]");
			$("#seal").addClass("validate[required]");
			$("#weight").addClass("validate[required]");
			$("#isInbond").removeAttr("disabled");	
		} else
		{
			$("#requiredDate").removeAttr("disabled");
			$("#requiredTime").removeAttr("disabled");
			$("#appointmentTimeAm").removeAttr("disabled");
			$("#appointmentTimePm").removeAttr("disabled");
			$("#originRampCode").attr("disabled", "disabled");
			$("#originRampCode").val("");
			$("#destinationRampCode").attr("disabled", "disabled");
			$("#destinationRampCode").val("");
			//D027470, To enable Save on template.
			$("#saveBtn").removeAttr("disabled");
			$("#rate").removeAttr("disabled");			
			$("#truckerName").removeAttr("disabled");
			$("#isInbond").removeAttr("disabled");	
		//	$("#seal").removeAttr("disabled");
			$("#portCutOffDate").attr("disabled", "disabled");
			$("#truckerCode").removeAttr("disabled");						
		}
 
		if (dispatchType == 'S' || dispatchType == 'L') {
			$("#isOkToSub").removeAttr("disabled");		
			$("#spotRequirementTypeCode").removeAttr("disabled");
			$("#equipment").removeAttr("disabled");
			$("#containerNumberForDispatch").editableDropdown("enable");
			$("#weight").attr("disabled", "disabled");
			//D026832, Seal and weight not required for request type 'L'.
			$("#seal").attr("disabled", "true");
		/*	if(dispatchType == 'L')
				$("#weight").removeAttr("disabled");*/
		} else
		{	
			$("#isOkToSub").attr("disabled", "disabled");
			$("#weight").removeAttr("disabled");
			if(dispatchType == 'E')
				$("#weight").attr("disabled", "disabled");

		}
		
		var dispatchRequestId = $("#dispatchRequestId").val();
		
		var openSHCOverlay = $("#openSHCOverlay").val();
		if(openSHCOverlay == 'true')
		{
			openSpecialServices();
		}
		
		var bookingTypeCode = $("#bookingTypeCode").val();
		var multipleRatesFound = $("#multipleRatesFound").val();
		//D029204
		$("#rate").attr("readonly", "readonly");
		if(bookingTypeCode=='T')
		{
		$("#requiredDate").attr("disabled", "disabled");
		$('#vesselCutOffDate').attr("disabled","disabled");
		}
		var truckerCode = $("#truckerCode").val();
		var rate = $("#rate").val();
		var isRequestOutZone = $("#isRequestOutZone").val();
		var tradeCode=$("#tradeCode").val();
		if (dispatchType != 'R') 
		{
			if(isRequestOutZone == 'true')
			{
				if((!Boolean(rate)|| rate == "0.00") && !Boolean(truckerCode))
					$("#saveAndSendBtn").attr("disabled", "disabled");
				else
					$("#saveAndSendBtn").removeAttr("disabled");
				if(tradeCode!='A'&& (!Boolean(rate)|| rate == "0.00"))
					$("#saveAndSendBtn").attr("disabled", "disabled");
			}
		}
		else
			$("#saveAndSendBtn").removeAttr("disabled");
		
		if(isRequestOutZone == 'false' && dispatchType !='R')
		{
			//document.getElementById('railInfoDiv').style.display = 'none';
			$('#conditionAccordians2').hide();
			$("#saveAndSendBtn").attr("disabled", "disabled");
			$("#sendBtn").attr("disabled", "disabled");			
		}
		
		var bookingTypeCode = $("#bookingTypeCode").val();
		if(bookingTypeCode!='T')
			$("#truckerCode").attr("readonly", "readonly");
		else
			$("#truckerCode").removeAttr("readonly");
		
		var disableDepotOrValidateLocation = $("#disableDepotOrValidateLocation").val();
		if(disableDepotOrValidateLocation == 'true')
			//document.getElementById('railInfoDiv').style.display = 'none';
			$('#conditionAccordians2').hide();
		else
			$('#conditionAccordians2').show();
		
		var isHazardous = $("#isHazardous").val();
		if(isHazardous == 'true' && $('#hazardousCode').text()!='N' )
			document.getElementById('hazardous').style.display = 'block';
		
		if($('#truckerArolId').val() != null && 
				$('#truckerArolId').val().trim() != "" && 
				$('#truckerArolId').val().trim() != "0")
		{
			//document.getElementById('sendContactMethodDiv').style.display = 'block';			
			var isRequestOutZone = $('#isRequestOutZone').val();	
			if(isRequestOutZone == 'true')
				$('#conditionAccordians5').show();
		}
		else
		{
			//document.getElementById('sendContactMethodDiv').style.display = 'none';
			//$("#saveBtn").attr("disabled", "disabled");
			$('#conditionAccordians5').hide();
			
		}
		
		var currentStatus = $("#statusCode").val();
		
	    if(currentStatus == 'COMPLETE' || currentStatus == 'INGATED' || currentStatus == 'CANACK')
	   	{
    		$("#saveBtn").attr("disabled", "disabled");
    		$("#saveAndSendBtn").attr("disabled", "disabled");
	   	}
	    	
		var bookingTypeCode = $("#bookingTypeCode").val();
		if (currentStatus == 'TEMPLATE' || bookingTypeCode=='T') 
		{
			$("#weight").attr("disabled", "disabled");
			$("#seal").attr("disabled", "disabled");
			//$("#requiredDate").attr("disabled", "disabled");
			$("#portCutOffDate").attr("disabled", "disabled");
			$("#inbond").attr("disabled", "disabled");
			$("#isInbond").attr("disabled", "disabled");
			$("#bookingNumberForDispatch").attr("disabled", "disabled");
			$("#containerNumberForDispatch").editableDropdown("disable");
			//D027470, Commented to enable Save on template.
			//$("#rate").attr("disabled", "disabled");
			$("#saveAndSendBtn").attr("disabled", "disabled");
		};

		if(dispatchRequestId >0 )
		{
			
			document.getElementById('displayPage').style.display = 'block';
			$("#spotRequirementTypeCode").attr("disabled", "disabled");
			$("#equipment").attr("disabled", "disabled");
			if (dispatchType == 'S' || dispatchType == 'L')
				$("#containerNumberForDispatch").editableDropdown("enable");
			else
				$("#containerNumberForDispatch").editableDropdown("disable");
			
			$("#comment_link").removeAttr("disabled");
			$("#DocumentHistory").removeAttr("disabled");

			if(currentStatus == 'PENDING' || currentStatus == 'OPEN' || currentStatus == 'TEMPLATE')
				$("#deleteBtn").removeAttr("disabled");				
			else
				$("#deleteBtn").attr("disabled", "disabled");
			
			if(currentStatus == 'OPEN' || currentStatus == 'PENDING' || currentStatus == 'TEMPLATE' || currentStatus == 'COMPLETE' || currentStatus == 'INGATED' || currentStatus == 'CANACK' || currentStatus == 'CANCEL' || currentStatus == 'CANSENT')
				$("#cancelBtn").attr("disabled", "disabled");
			else	
				$("#cancelBtn").removeAttr("disabled");
			disableFieldsForRail();
			//D025486
			if(currentStatus == 'CANSENT')
				$("#saveAndSendBtn").attr("disabled", "disabled");
				
		}
		//025452, Disabled save and send button for in-zone dispatches.
		if($('#isRequestOutZone').val() == 'false')
		{
			$("#saveAndSendBtn").attr("disabled", "disabled");
		}
		var tradeCode=$("#tradeCode").val();
		var loadSvc = $("#loadServiceCode").val();
					var dschSvc = $("#dischargeServiceCode").val();
					//if (loadService == 'P' || loadService == 'PIZ')
					if(tradeCode=='A' && (loadSvc == 'P' || loadSvc == 'PIZ' || dschSvc== 'P' || dschSvc == 'PIZ' ))
					{
						if (currentStatus != 'TEMPLATE' && bookingTypeCode!='T'){
						$("#saveAndSendBtn").removeAttr("disabled");}
					$("#sendBtn").removeAttr("disabled");
					if($("#rate").val()==0 && $("#truckerCode").val!='')
					{
					$("#rate").removeAttr("readonly");
					}
					}
		
		if(($("#rate").val() == null || $("#rate").val().trim() == "0.00"|| $("#rate").val().trim() == "") && ($('#bookingTypeCode').val()!='T' 
			&&  $("#spotRequirementTypeCode").val() != 'R'  && $("#tradeCode").val()!='A') )
		{
		$("#saveBtn").attr("disabled", "disabled");
		}
		
	}
	 
	function setSelectedDocumentContacts(){
		if($('#truckerArolId').val() != null && 
				$('#truckerArolId').val().trim() != "" && 
				$('#truckerArolId').val().trim() != "0")
		{
			$('#selectedContacts').val("");
			var rowIDs = jQuery("#contactGrid").getDataIDs(); 
			var selection = "";
			for (var i=0;i<rowIDs.length;i=i+1)
			{ 
				var id = $('#contactGrid').getCell(rowIDs[i], 'id');
				var value= $('#contactGrid').getCell(rowIDs[i], 'valueGrid');
				var isSelected =$('#jqg_contactGrid_'+id).attr("checked");
				if(isSelected=="checked")
				{
				selection = selection+value+"|";
				}
			}
			$('#selectedContacts').val(selection);
		}
	}
	
	function placePopupSearch(place, id) {
		var values=place.split("-");
		var param=values[0];
		_callingFunc = id;
		var actionUrl = _context + "/city/manualLookup/showForm?term=" + param;
		var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CitySearch', windowStyle);
	}
	
	 // D020433 -- Starts --
	function placePopupSearchForDepot(place, id) {
		var values=place.split("-");
		var param=values[0];
		_callingFunc = id;
		var actionUrl = _context + "/depot/manualLookup/showForm?term=" + param;
		var windowStyle = 'top=50,left=100,height=500,width=600,scrollbars=0,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'DepotSearch', windowStyle);
	}
	
	function depotUpdate(id) {
		$('#depot').val(id);
		$('#depotCodeHidden').val(id);
		$("#createDispatchDepot").html($('#depot').val());
	}
	 // D020433 -- Ends --
	function cityUpdate(id) {
		var end = id.indexOf(",");
		var values = id.substr(0, end);
		end = values.indexOf(" ");
		var len = values.length;
		var cityCode = values.substr(0, end);
		var cityName = values.substr(end + 1, len);
		var value = cityCode + "-" + cityName;
		if (_callingFunc == '2') {
			$('#depot').val(cityCode);
			$('#depotCodeHidden').val(cityCode);
		}
	   if (_callingFunc == '5') {
			$('#rampCode').val(value + id.substr(id.indexOf(","), id.length));
			$('#rampCodeHidden').val(cityCode);
			//$('#rampName').val(cityName);
		}
	   if (_callingFunc == '3') {
			$('#originRampCode').val(cityCode);
		}
	   if (_callingFunc == '4') {
			$('#destinationRampCode').val(cityCode);
		}
	   $("#createDispatchRampCode").html(value);
	}
	
	function validateWeight()
	{
		var selected = $("#spotRequirementTypeCode").val();

		if((selected == 'r') && ($('#weight').val() == null || $('#weight').val() == ""))
		{
			return "Please enter weight"; 
		}
	}
	
	function validateForOneLocation()
	{		
		var lista = jQuery("#dispatchLocationGridTable").getDataIDs();	
	 	if(lista.length<1)
	 	{
	 		alert("Atleast one location should be present in the location grid");
	 		return false;
		}
	 	return true;
	}
	
	function openCloseTimeValidation(){
		if($('#bookingTypeCode').val()=='T')
			return true;
		var loadService = $("#loadServiceCode").val();
		if (loadService == 'P' || loadService == 'PIZ')
		{
			var dispatchType = $("#spotRequirementTypeCode").val();
			if (dispatchType == 'S' || dispatchType == 'P' || dispatchType == 'L' ) 
			{			         
				var lista = jQuery("#dispatchLocationGridTable").getDataIDs();			
				for(j=0;j<lista.length;j++)
				{ 				 
					rowData=jQuery("#dispatchLocationGridTable").getRowData(lista[j]);	
				
					var oTime=rowData.openTime;
					var cTime=rowData.closeTime;
					var seq=rowData.seqNo;
					
					if(seq == '1')
					{				 
						if(oTime == '' || oTime == null || cTime == '' || cTime == null)
						{
							alert('Open Time And Close Time Mandatory for 1st Location.'); 
							return false;
						}	
					}
				}			
			}
		}
		
		var dischargeService = $("#dischargeServiceCode").val();		
		if (dischargeService == 'P' || dischargeService == 'PIZ')
		{
			var dispatchType = $("#spotRequirementTypeCode").val();		 
			if (dispatchType == 'D' || dispatchType == 'U' || dispatchType == 'E' ) 
			{			
				var lista = jQuery("#dispatchLocationGridTable").getDataIDs();			
				for(j=0;j<lista.length;j++)
				{ 				 
					rowData=jQuery("#dispatchLocationGridTable").getRowData(lista[j]);				
					var oTime=rowData.openTime;
					var cTime=rowData.closeTime;
					var seq=rowData.seqNo;					
					if(seq == '1')
					{					 
						if(oTime == '' || oTime == null || cTime == '' || cTime == null)
						{
							alert('Open Time And Close Time Mandatory for 1st Location.'); 
							return false;
						}	
					}
				 }			
			}
		}
		return true;
	} 

	function validateContactForOutZone(){
		
		var dispatchType = $("#spotRequirementTypeCode").val();
		if (dispatchType == 'R')
			return true;
		
		var isRequestOutZone = $("#isRequestOutZone").val();
		if(isRequestOutZone == 'true')
		{
				var lista = jQuery("#dispatchLocationGridTable").getDataIDs();			
				for(var j=0;j<lista.length;j++)
				{ 				 
					rowData=jQuery("#dispatchLocationGridTable").getRowData(lista[j]);				
					var contact=rowData.contactName;
					var phoneNumber = rowData.phoneNumber;
					if((contact == '' || contact == null) && (phoneNumber == '' || phoneNumber == null) )
					{
						alert('Contact is mandatory for all locations.'); 
						return false;
					}						
				}					
		}
		
		return true;
	} 

	function validateTruckerRateForOutZone()
	{
		var dispatchType = $("#spotRequirementTypeCode").val();
		if (dispatchType == 'R') 
			return true;
		
		var isRequestOutZone = $("#isRequestOutZone").val();
		var requiredDate = $("#requiredDate").val();
		var rate = $("#rate").val();
		var truckerCode = $('#truckerCode').val();		
		var truckerArolId = $('#truckerArolId').val();
		
//		if(isRequestOutZone == 'true')
//		{
		if(Boolean(requiredDate) && $('#bookingTypeCode').val()!='T')
		{
				if(rate == '' || rate == null )
				{
					alert('Rate is mandatory.'); 
					return false;
				}									
				
			if(Boolean(rate))
			{
				if(!Boolean(truckerCode) && !Boolean(truckerArolId))
				{
					alert('Please select or override trucker.'); 
					return false;					
				}				
			}	
		}
//		}		
		return true;
	} 

	function validateTruckerCodeForInZone()
	{
		var dispatchType = $("#spotRequirementTypeCode").val();
		if (dispatchType == 'R') 
			return true;
		
		var isRequestOutZone = $("#isRequestOutZone").val();
		var requiredDate = $("#requiredDate").val();
		var truckerCode = $("#truckerCode").val();
		
		if(isRequestOutZone == 'false')
		{
			if(Boolean(requiredDate))
			{
				if(truckerCode == '' || truckerCode == null )
				{
					alert('Trucker Code is mandatory for in-zone requests.'); 
					return false;
				}									
			}			
		}		
		return true;
	} 

	function populateFieldsFromAjaxResponse(responseText)
	{
		$("#truckerCode").val(responseText.data.truckerCode);
        $("#rate").val(responseText.data.rate);
        $("#isSpotOnPullForDispatch").val(responseText.data.isSpotOnPullForDispatch);
		$("#originRampCode").val(responseText.data.originRampCode);
		$("#destinationRampCode").val(responseText.data.destinationRampCode);
		$("#isOkToSub").val(responseText.data.isOkToSub);
		$("#isInbond").val(responseText.data.isInbond);
		$("#inbond").val(responseText.data.inbond);
		$("#portCode").val(responseText.data.portCode);
		$("#remarks").html(responseText.data.remarks);
		$("#depot").val(responseText.data.depot);
		$("#rampCode").val(responseText.data.rampCode);	
		$("#rampName").val(responseText.data.rampName);
		$("#requiredDate").val(responseText.data.requiredDate);
		$("#oldApptDate").val(responseText.data.oldApptDate);
		$("#requiredTime").val(responseText.data.requiredTime);
		$("#statusCode").val(responseText.data.statusCode);
		$("#dispatchRequestId").val(responseText.data.dispatchRequestId);
		$("#commentId").val(responseText.data.commentId);
		$("#bookingTemplateId").val(responseText.data.bookingTemplateId);
		$("#weight").val(responseText.data.weight);
		$("#spotRequirementTypeCode").val(responseText.data.spotRequirementTypeCode);
		$("#equipment").val(responseText.data.equipment);
		$("#containerNumberForDispatch").val(responseText.data.containerNumberForDispatch);
		$("#currentTime").val(responseText.data.currentTime);
		$("#currentDate").val(responseText.data.currentDate);
		$("#vesselCutOffDate").val(responseText.data.vesselCutOffDate);	
		$("#portContact").val(responseText.data.portContact);
		$("#portCode").val(responseText.data.portCode);
		$("#seal").val(responseText.data.seal);
		$("#weight").val(responseText.data.weight);
		$("#truckerArolId").val(responseText.data.truckerArolId);
		
        $("#containerNumberForDispatch").get(0).options.length = 0;
        $.each(responseText.data.containerList, function(index, containerList) {
            $("#containerNumberForDispatch").get(0).options[$("#containerNumberForDispatch").get(0).options.length] = new Option(containerList.description, containerList.code);
        });
		
        var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
        $("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});

	}
	


//	$(function() {
//		$( "#locationDialog" ).dialog({
//			autoOpen: false, 
//			width: 1000,
//			modal: true
//		});
//	});
	
	/*$('#dispatchBtn').click(function(){
			var shipmentId =$("#shipmentId").val();
			var shipmentTemplateId =$("#shipmentTemplateId").val();
			$("#spotPullForm").attr("action", "loadDispatchRequestByShipmentTemplateId?id="+shipmentId+"&shipmentTemplateId="+shipmentTemplateId);
	    $("#spotPullForm").submit(); 
		});
*/ 

	function organizationPopupSearch() {
		var values=$('#organisations').val().split("-");
		var param;
		if(values[1]!=null){
			param=values[1];
		}else{
			param=values[0];
		}
	    var actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1='+param+'||QT';
	    var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'CustomerSearch', windowStyle);
	}

	/*function addRolDescPopupSearch() {
		if ($('#organisations').val()) {
			if ($("#organizationId").val()) {
				var actionUrl = _context
						+ '/cas/addressRolePopUpSearch.do?filterValue1='
						+ $("#organizationId").val();			
				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'CustomerSearch', windowStyle);
				} else {
				alert('Please select organization');
			}
		}
	}*/
	
	function custAddressPopupSearch() {
   		var orgId=$('#organizationId').val();
   		if ( (orgId==null) ||($.trim(orgId)=='' || orgId=='0') ) { 
   			alert("PLEASE SELECT ORGANIZATION");
   		} else {
   			if($("#organizationId").val()){
   				var actionUrl =  _context + '/cas/addRoleBKLookup.do?filterValue1='+$("#organizationId").val();
   				var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
   				window.open(actionUrl, 'CustomerAddressSearch', windowStyle);		
   			}
   		}
   	}
	
	function addroleUpdate(id){
		var values = id.split("|");
		var addressLineArray = values[7].split(",");
		var address = formatAddRoleDscr(values[4], addressLineArray[0], values[2], values[6]);
		var city = formatCityStateZip(values[2], values[6], values[8]);
		$("#addRolDesc").val("");
		$("#addressLine1").val("");
		$("#city").val("");
		$("#state").val("");
		$("#addressRoleId").val(values[9]);
		if(address!=null && address!="null")
		{
		$("#addRolDesc").val(address);
		}
		//D028385
		if(addressLineArray[0]!=null && addressLineArray[0]!="null")
		{
		$("#addressLine1").val(addressLineArray[0]);
		}
		//$("#cityStateZip").val(city);
		//$("#quoteSuite").val(values[5]);
		if(values[2]!=null && values[2]!="null")
		{
		$("#city").val(values[2]);
		}
		if(values[6]!=null && values[6]!="null" )
		{
		$("#state").val(values[6]);
		}
		$("#zip").val(values[8].substring(0,5));
		//$("#country").val(values[9]);
		
		somethingChanged = true; 
		isDispatchChanged="Y";
		var inp1 = $("#addressRoleId").val();
		var inp2 = $("#organizationId").val();
		
		if((inp1!="" && inp1!="ALL")&&(inp2!="" && inp2!="ALL")){
			$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + inp2 + "|" + inp1);
			somethingChanged = true;
			isDispatchChanged="Y";
		}
		populateLocationData();
		
		
   	}
 

	function orgSearchUpdate(id){
		var values = id.split("|");
		$("#organizationId").val(values[2]);
		var orgCode = values[1];
		var orgName= values[0];
		$('#organisations').val(orgCode+'-'+orgName);
		
		$("#addRolDesc").val("");
		$("#addressRoleId").val("");
		clearContactDetails();
		somethingChanged = true;
		isDispatchChanged="Y";
		var urlForAddressSearch = _context+'/cas/autocomplete.do?method=searchAddRolDesc&searchType=245&parentSearch='+ $("#organizationId").val();
		 $('#addRolDesc').gatesAutocomplete({		 	
			source: urlForAddressSearch,
			formatItem: function(data) {
				return formatAddRoleDscr(data.name, data.address, data.city, data.state);
			},
			formatResult: function(data) {
				return formatAddRoleDscr(data.name, data.address, data.city, data.state);
			}, 
			select: function(data) {
				
				$('#addRolDesc').val(data.address);
				$("#addressRoleId").val(data.id);
				/*$("#addressLine1").val(data.address);
				$("#cityStateZip").val(data.city);
				$("#quoteSuite").val(data.suite);*/
				$("#city").val(data.city);
				$("#state").val(data.state);
				$("#zip").val(data.zip);
				//$("#country").val(data.cntry);
				isDispatchChanged="Y";
				somethingChanged = true;
				 
			}
		});
		 
		 singleAddressCall();
	}
	
	
	function formatAddRoleDscr(nameQualifier, addressLine1, city, state) {
		var nameQualifierTemp = "";
		var addressLine1Temp = "";
		var cityTemp = "";
		var stateTemp = "";
		
		if (nameQualifier != "") {
			nameQualifierTemp = nameQualifier;
		}
		if (addressLine1 != "") {
			if (nameQualifierTemp != "") {
				addressLine1Temp = " - " + addressLine1;
			} else {
				addressLine1Temp =  addressLine1;
			}
		}
		if (city != "") {
			cityTemp = " - " + city;
		}
		if (state != ""&& state!='null') {
			stateTemp = ", " + state;
		}
		 return nameQualifierTemp + addressLine1Temp + cityTemp + stateTemp;
	}
	
	/*function addressRoleSearchUpdate(id) {
		// ADDRESS_ROLE_ID,ORGANIZATION_ID,NAME_QUALIFIER,C_O_ABBREV,ADDRESS,SUITE,CITY,STATE,ZIP,COUNTRY,ADDRESS_TYPE_DESC,ACTIVE
		
		var values = id.split("|");
		var addressLineArray = values[4].split(",");
		var address = formatAddRoleDscr(values[2], addressLineArray[0], values[6], values[7]);
		var city = formatCityStateZip(values[6], values[7], values[8]);
		
		$("#addressRoleId").val(values[0]);
		$("#addRolDesc").val(address);
		//$("#addressLine1").val(addressLineArray[0]);
		//$("#cityStateZip").val(city);
		//$("#quoteSuite").val(values[5]);
		$("#city").val(values[6]);
		$("#state").val(values[7]);
		$("#zip").val(values[8]);
		//$("#country").val(values[9]);
		
		somethingChanged = true; 
		
		var inp1 = $("#addressRoleId").val();
		var inp2 = $("#organizationId").val();
		
		if((inp1!="" && inp1!="ALL")&&(inp2!="" && inp2!="ALL")){
			$.getJSON(_context+'/cas/autocomplete.do?method=getContacts&searchType=213&parentSearch=' + inp2 + "|" + inp1);
			somethingChanged = true;
		}
		populateLocationData();
	}*/
	
	function formatCityStateZip(city, state, zipcode) {
		var cityTemp = "";
		var stateTemp = "";
		var zipcodeTemp = "";
		
		if (city != "") {
			cityTemp = city;
		}
		if (state != "") {
			if (cityTemp != "") {
				stateTemp = "," + state;
			} else {
				stateTemp =  state;
			}
		}
		if (zipcode != "") {
			zipcodeTemp = " - " + zipcode;
		}
		 return cityTemp + stateTemp + zipcodeTemp;
	}
	
	function clearContactDetails() {
		$("#city").val("");
		$("#state").val("");
		$("#zip").val("");
		$("#email").val("");
		$("#contactName").val("");	
		$("#fax1").val("");
		$("#fax2").val("");
		$("#fax3").val("");
		$("#fax4").val("");
		$("#fax5").val("");
		}
	

	function hoursFunction()
	{  

	    var i = 0;
	    var openHour;
	    var closeHour;

	    for(i=1;i<8;i++)
	    {
	     openHour = document.getElementById("openTime" + i).value;
	     closeHour= document.getElementById("closeHours" + i).value;

	    if(openHour > closeHour)
	    {   
	        document.getElementById('error').innerHTML= "Error at " + i;  
	        return false; 
	    }
	    document.getElementById('error').innerHTML= "No Error occured";  
	    return true;
	    }
	}
	
	function deleteDispatchRequest()
	{  
		var queryString = $('#spotPullForm').formSerialize();	
		blockUI();
		$.ajax({
			type: "POST",
			url: _context +"/createdispatch/deleteDispatchRequest",
			data: queryString,
			success: function(responseText){
				$.unblockUI();
				$("#spotPullForm").loadJSON(responseText.data);
				showResponseMessages(responseText.messages);
				jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
				jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
				populateFieldsFromAjaxResponse(responseText);										
				document.getElementById('displayPage').style.display = 'none';
				$("#spotRequirementTypeCode").removeAttr("disabled");
				$('#portContact').html("");
				$('#portCode').html("");
				$('#dateAndTime').html("");
				$('#statusCodeDiv').html("");					
				$("#dispatchBillGridTable").jqGrid('setGridState','visible');
				//oldForm = $('#spotPullForm').formSerialize();
				isDispatchChanged="N";
				}
		});
	}

	function loadTemplateDetails()
	{  
		var queryString = $('#spotPullForm').formSerialize();
		blockUI();
		$.ajax({
			async: false,
			type: "POST",
			url: _context +"/createdispatch/loadTemplateDetails",
			data: queryString,
			success: function(responseText){
				showResponseMessages(responseText.messages);		
				if(responseText.messages.error.length == 0)
				{
				//D025867, Not to populate pickup number when clicked on add/new/copy buttons in dispatch.
					/*for(var i=0;i<responseText.data.dispatchLocationGrid.length;i++){
						if(responseText.data.dispatchLocationGrid.pickupNumber!=" "){
						responseText.data.dispatchLocationGrid[i].pickupNumber=" ";
						}
						 }*/
					$("#spotPullForm").loadJSON(responseText.data);
					$("#equipmentHeight").val(responseText.data.equipmentHeight);
					jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					var bookingTypeCode = $("#bookingTypeCode").val();
					/*if( bookingTypeCode=='T' && (responseText.data.truckerName==''||responseText.data.truckerName==null))
						{
						truckerPopupSearch(true);
						
						}*/
					enableDisableFieldsBasedOnDispatchType();			
				
			        $("#spotRequirementTypeCode").get(0).options.length = 0;
			        $.each(responseText.data.dispatchTypeList, function(index, dispatchTypeList) {
			            $("#spotRequirementTypeCode").get(0).options[$("#spotRequirementTypeCode").get(0).options.length] = new Option(dispatchTypeList.description, dispatchTypeList.code);
			        });
			        
					$("#spotRequirementTypeCode").val(responseText.data.spotRequirementTypeCode);
					
			        $("#containerNumberForDispatch").get(0).options.length = 0;
			        
			        if(responseText.data.containerList != null)
			        $.each(responseText.data.containerList, function(index, containerList) {
			            $("#containerNumberForDispatch").get(0).options[$("#containerNumberForDispatch").get(0).options.length] = new Option(containerList.description, containerList.code);
			        });
					
			        var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
			        $("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});
					
					$('#statusCodeDiv').html(responseText.data.statusCode);
					$('#typeField').html(responseText.data.typeField);
				     // D025496 -- Starts --
					//if(($('#equipment').text() != null && $('#equipment').text().trim().indexOf("R") == 0) 
							//|| (responseText.data.typeField != null && responseText.data.typeField.indexOf("R") == 0))						
					//	$('#tempField').html("33 F");
					 // D025496 -- Ends --
					if( $("#characteristicCode").get(0) != null)
						$("#characteristicCode").get(0).options.length = 0;
				     $.each(responseText.data.characteristicCodeList, function(index, characteristicCodeList) {
				         $("#characteristicCode").get(0).options[$("#characteristicCode").get(0).options.length] = new Option(characteristicCodeList.description, characteristicCodeList.code);
				     });
				        
	//				popDispatchType(responseText.data.dispatchTypeList);
					
				    $("#truckerCode").val(responseText.data.truckerCode);
				    $("#truckerName").val(responseText.data.truckerName);
		//	        $("#rate").val(responseText.data.rate);
					$("#isSpotOnPullForDispatch").val(responseText.data.isSpotOnPullForDispatch);
		            $("#bookingNumberForDispatch").val(responseText.data.bookingNumberForDispatch);
	//				$("#originRampCode").val(responseText.data.originRampCode);
	//				$("#destinationRampCode").val(responseText.data.destinationRampCode);
	//				$("#isOkToSub").val(responseText.data.isOkToSub);
	//				$("#portCode").val(responseText.data.portCode);
	//				$("#remarks").val(responseText.data.remarks);
	//				$("#depot").val(responseText.data.depot);
	                // D025387 --- Starts ---
					$("#rampCode").val(responseText.data.rampCode);	
					$("#rampCodeHidden").val(responseText.data.rampCodeHidden);	
					// D025387 --- Ends ---
	//				$("#rampName").val(responseText.data.rampName);
	                
	                //D025500 -- Starts --
					$("#portCutOffDate").val(responseText.data.portCutOffDate);	
					$("#portCutOffDate").removeAttr('disabled');
					//D025500 -- Ends --
					
					//Vaibhav
					$("#selectedContactId").get(0).options.length = 0;
			        $.each(responseText.data.contactList, function(index, contactList) {
			            $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
			        });
			        jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
					$("#availableContactList").val(responseText.data.availableContactList);
					//alert("loadTemplateDetails "+$("#truckerCode").val());
					//D029117
					if($('#asInstructions').val() != null && 
							$('#asInstructions').val().trim() != "")
					{	
					var asInstruction=$('#asInstructions').val();
					$('#createDispatchSpecialInstructionsHeader').html(asInstruction.substring(0,80));
					}
					var isHazardous = $("#isHazardous").val();
					if(isHazardous == 'true')
						document.getElementById('hazardous').style.display = 'block';
	
					//$.unblockUI();
					var isSHCRate=$("#isSHCRate").val();
					if(isSHCRate == "true")
					{
						var r=confirm("Booking does not have required special service. Do you want to continue?");
						if (r==true) {
							showEditLocationDialog(1);
						} 
					}else{
						//$.unblockUI();
						//D021783
						if(responseText.data.spotRequirementTypeCode != 'R')
							showEditLocationDialog(1);
					}
					// --- D025561 Starts ---
					if($('#truckerArolId').val() != null && 
							$('#truckerArolId').val().trim() != "" && 
							$('#truckerArolId').val().trim() != "0")
					{
						//document.getElementById('sendContactMethodDiv').style.display = 'block';			
						var isRequestOutZone = $('#isRequestOutZone').val();	
						if(isRequestOutZone == 'true')
							$('#conditionAccordians5').show();
					}
					else
					{
						//document.getElementById('sendContactMethodDiv').style.display = 'none';
						$('#conditionAccordians5').hide();
					}
					// --- D025561 Ends ---
				}
				else
				{
			        var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
			        $("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});
			        //D025372: 	Dispatch/Rail Bill Detail: clear type
			        $('#typeField').html("");
				}
				$.unblockUI();
			}
		});
		//D025735
		if(($("#rate").val() == null || $("#rate").val().trim() == "") && ($('#bookingTypeCode').val()!='T' &&  $("#spotRequirementTypeCode").val() != 'R'))
	 	$("#saveBtn").attr("disabled", "disabled");
	}

	function validateContainerNumberForDispatch(field, rules, i, options) {
		
		var dispatchType = $("#spotRequirementTypeCode").val();
		var containerNbr = $('#containerNumberForDispatch').val();
		
		if (dispatchType == "D" || dispatchType == "P" || dispatchType == "U" || dispatchType == "E") {
			if (containerNbr=="" || containerNbr==null)
			{
				var rulesLength = rules.length;
				rules[rulesLength] = "required";
				return "Container number is mandatory";
			} 
		}
	}
	
	
	function validateEquipmentId(field, rules, i, options) {

		var dispatchType = $("#spotRequirementTypeCode").val();
		var equipment = $('#equipment').val();
		
//		if (dispatchType == "S" || dispatchType == "L" || dispatchType == "R")
//		{
			if (equipment=="" || equipment==null)
			{
				var rulesLength = rules.length;
				rules[rulesLength] = "required";
				return "Equipment is mandatory";
			} 
//		}
	}

	function showTruckerDialog(){
		
		var dispatchType = $("#spotRequirementTypeCode").val();
//
		if (dispatchType != 'R') {
//			$("#truckerDialog").dialog("option", "title", 'Trucker Details');
//			$("#truckerDialog").dialog('open');			
//		}

		var queryString = $('#spotPullForm').formSerialize();

		$.ajax({
			url: "../createdispatch/showTruckerDetails",
			type: "POST",
			data: queryString,
			success: function(responseText){
				var truckTitle = $("#truckerCode").val();
				$("#truckerDialog").dialog("option", "title", 'Trucker Details'+" - "+truckTitle);
				$("#truckerDialog").dialog('open');			
			}
		});
		}
	}

	function updateDefaultValuesOnStatusGrid()
	{
		var lista = jQuery("#dispatchLocationGridTable").getDataIDs();			
		for(j=0;j<lista.length;j++)
		{ 				 
			rowData=jQuery("#dispatchLocationGridTable").getRowData(lista[j]);	
		
			var oTime=rowData.openTime;
			var cTime=rowData.closeTime;
			var seq=rowData.seqNo;
			
			if(seq == '1')
			{				 
				if(oTime == '' || oTime == null || cTime == '' || cTime == null)
				{
					alert('Open Time And Close Time Mandatory for 1st Location.'); 
					return false;
				}	
			}
		}
	}
	
	function validateContainerNo() {

		var dispatchType = $("#spotRequirementTypeCode").val();
		var containerNo = $('#containerNumberForDispatch').val();		
		var bookingTypeCode = $("#bookingTypeCode").val();
		
		if(bookingTypeCode == 'T')
			return true;

		if (dispatchType == "P" || dispatchType == "D" || dispatchType == "U" || dispatchType == "E" || dispatchType == "R")
		{
			if (containerNo=="" || containerNo==null)
			{
				//alert('Container Number is mandatory');
				$('.ui-editableDropdown input').attr('id','selectInputIdContainer');
				$('#selectInputIdContainer').validationEngine('showPrompt','*This field is required.','error','topRight',true);
				return false;
			} 
		}
		$('.ui-editableDropdown input').attr('id','selectInputIdContainer');
		$("#selectInputIdContainer").validationEngine('hide');
		return true;
	}

	function validateApptDateTime() 
	{
		var bookingTypeCode = $("#bookingTypeCode").val();
		
		if(bookingTypeCode == 'T')
			return true;
	
		var apptDate = $("#requiredDate").val();	
		var apptTime = $("#requiredTime").val();
		if(Boolean(apptDate))
		{
			if ($('#appointmentTimeAm').is(':checked')) {
				return true;
			}
			if ($('#appointmentTimePm').is(':checked')) {
				return true;
			}
			
			if(Boolean(apptTime)) {					
				return true;
			}
			alert('Appointment Time or Am-Pm indicator is mandatory');
			return false;			
		}
		
		if(Boolean(apptTime) || $('#appointmentTimeAm').is(':checked') 
				|| $('#appointmentTimePm').is(':checked')) 
		{
			if(!Boolean(apptDate))
			{
				alert('Appointment Date is mandatory when appointment time or am-pm is present');
				return false;				
			}
		}
		return true;
	}

	
	/*  special services START*/
	function openSpecialServices(){
		$( "#specialServiceDialog" ).dialog( "option", "title", 'Special Services' );
		$( "#specialServiceDialog" ).dialog('open'); 
	}  


	$(function() { 
		
	    $( "#specialServiceDialog" ).dialog({ autoOpen: false , width: 980 ,height:280, modal: true
	    , buttons: {
	         Cancel: function(){
	            	$( this ).dialog( "close" ); 
	                },
	                Ok: function(){ 
	                if(validateSpecialServiceCode())
	                	{
	                saveSpecialService(); 
	                var manualUserRate = $('#manualUserRate').val();
	                $("#rate").val(manualUserRate);
	                	}
	                },             
		               
	               
	    }});
		});
	
	function saveSpecialService(){
		var queryString = $('#specialServiceForm').formSerialize();
		$.ajax({
				url: "../createdispatch/saveSpecialServices",
				type: "POST",
				data: queryString,
				success: function(responseText){
						$("#specialServiceDialog").dialog('close');
				}
			});
	}
	
	function casSpSvcCodeLookup(index) {
		spsvCodeLineNumber=index;
		var specialServiceCode = $('input[name="specialServiceCode"]').val();
		var actionUrl = _context + '/cas/spclSrvBKLookup.do?filterValue1='+ specialServiceCode;
		
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'SpecialService Search', windowStyle);
	}
	
	function casTruckerLookup(index) {
		truckerLineNumber=index;
		var actionUrl = _context + '/cas/bookingtruckerRateSearch.do';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'Trucker Rate Search', windowStyle);
	}
	
	function casPayeeLookup(index) {
		payeeLineNumber=index;
		var actionUrl = _context + '/cas/addRoleBKLookup.do?filterValue1=125&filterValue2=02';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'AddressSearch', windowStyle);
	} 
	
	function casPredictiveSearchOnAllLines(){
		var url = _context+'/cas/autocomplete.do?method=getSpclSrvcBK&searchType=256&param=ALL';
		$('input[name="specialServiceCode"]').gatesAutocomplete({
			source: url,
//			source:_context+'/cas/autocomplete.do',
//		 	extraParams: {
//		 			 method: 'getSpclSrvcBK',
//			 		 searchType: '256' ,
//			 		 param : 'ALL'
//		 	},
			formatItem: function(data) {
				return data.id+"-"+data.desc;
			},
			formatResult: function(data) {
				return data.id;
			}, 
			select: function(data) {
				var index=1;
				//$('#specialServiceFormLine1\\.specialServiceDesc').val(data.id+'-'+data.desc);
				$('input[name="specialServiceCode"]').val(data.id);
				$('#specialServiceCode1').val(data.id);
				populateFields(data,index);
			}
		});	
	}
		
	function populateFields(data,index){
				
	//Process level code
	$('input[name="processLevelCode"]').val(data.level);
	// is manual charge
	$('input[name="isManualCharge"]').val(data.manchrg);
	// Charge Code
	$('input[name="chargeCodeExpected"]').val(data.chgres);
	// is required qty
	$('input[name="isRequireQuantity"]').val(data.reqqty);
	// is required date
	$('input[name="isRequireDate"]').val(data.reqdt);
	$('input[name="source"]').val("Manual");
	$('input[name="isMilTruckerRateCustomized"]').val("N");

		
	}
	
	function spclServiceUpdate(id){
		var values = id.split("|");
		
		
		$('#specialServiceDesc').val(values[0]+'-'+values[6]);
		$('input[name="specialServiceCode"]').val(values[0]);
		//Process level code
		$('input[name="processLevelCode"]').text(values[1]);
		$('input[name="processLevelCode"]').val(values[1]);
		// is manual charge
		$('input[name="isManualCharge"]').val(values[4]);
		// Charge Code
		$('input[name="chargeCodeExpected"]').val(values[5]);
		// is required qty
		$('input[name="isRequireQuantity"]').val(values[3]);
		// is required date
		$('input[name="isRequireDate"]').val(values[2]);
		$('input[name="source"]').text("Source");
		$('input[name="isMilTruckerRateCustomized"]').val("N");
		
	}

	function truckerRateUpdate(id){
		var values = id.split("|");
		$('input[name="payee"]').val(values[1]);
		$('input[name="milTruckerRateId"]').val(values[0]);
		$('input[name="manualUserRate"]').val(values[7]);
		$('select[name="rateBasisCode"]').selected().val("E");
		$('input[name="source"]').val("AH");
		// Adding Drop and Pull
		$('select[name="isDropOrPull"]').selected().val(values[10]);
		//Only Payee or Trucker can be associated with Special Service
		$('input[name="addressRoleId"]').val("");
		$.ajax({
			type : "POST",
			url : "/gates/booking/specialservice/getTruckerRoutingText",
			data : {
				// Ramp City Code
				truckerRampCityCode: values[5],
				//Ramp
				truckerRamp: values[19],
				// Freight Location Code
				truckerFreightLocationCode: values[4]
			},
			success : function(responseText) {
				$('input[name="routingText"]').val(responseText.data);
			}
		});
	}
	
	
	function payeeLookupUpdate(id){ 
        var values = id.split("|"); 
        $('input[name="payee"]').val(values[7]); 
        //Name, Addr_Line1, Addr_line2, Suite, City 
        var routingText=values[7]+","+values[9]+","+values[13]+","+values[4]; 
        $('input[name="routingText"]').val(routingText); 
        $('input[name="milTruckerRateId"]').val(""); 
        $('input[name="addressRoleId"]').val(values[1]); 
}

	function casEquipmentVinsightLookup(index){
		equipmentVinsightLineNumber=index;
		var actionUrl = _context + '/cas/receivedUnitsLookupSearch.do';
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'Recieved Unit List', windowStyle);
	}
	
	function receivedUnits(id){
		var myData=id.split('|');
		//var shipmentNumber=$('#shipmentNumberHidden').val();
		if(myData.length>1){
			
				$('input[name="equipmentVinsight"]').val(myData[0]); 
				return;
				}	
		else{
			showErrorMessage();
		}
	}
	
	function validateSpecialServiceCode()
	{
		var specialServiceCode=$('#specialServiceCode').val();
		var manualUserRate =$('#manualUserRate').val();
		if(specialServiceCode == 'ADV' || specialServiceCode == 'AD2')
			{
			if(manualUserRate != null)
				{
			return true;
				}
			else
				{
				alert("Rate is mandatory");
				}
			}
		else
			{
			alert("Select ADV or AD2");
			}
		return false;
	}


	//Vaibhav
	function loadDocumentContactDetails(isFromTruckerPopUp)
	{  
		
		var isRequestOutZone = $('#isRequestOutZone').val();	
		//inzone truckers AMPF and PGTP are set as EDI. D029000
		if(isRequestOutZone == 'false' && ($("#truckerCode").val()=="PGTP" || $("#truckerCode").val()=="AMPF"))
			return;
		
		var dispatchType = $("#spotRequirementTypeCode").val();		
		if (dispatchType == 'R') 
			return;

		var queryString = $('#spotPullForm').formSerialize();
		
		$.ajax({
			type: "POST",
			async:false,
			url: _context +"/createdispatch/loadDocumentContactDetails",
			data: queryString,
			success: function(responseText){
				$("#availableContactList").val(responseText.data.availableContactList);
				responseText.data.availableContactList =null;
				$("#spotPullForm").loadJSON(responseText.data);
				showResponseMessages(responseText.messages);
				$("#truckerArolId").val(responseText.data.truckerArolId);
				$("#selectedContactId").get(0).options.length = 0;
		        $.each(responseText.data.contactList, function(index, contactList) {
		            $("#selectedContactId").get(0).options[$("#selectedContactId").get(0).options.length] = new Option(contactList.description, contactList.code);
		        });
				
				jQuery("#contactGrid").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				//alert("loadTemplateDetails "+$("#truckerCode").val());
				//document.getElementById('sendContactMethodDiv').style.display = 'block';
				$('#conditionAccordians5').show();
				if(isFromTruckerPopUp)
				{
					populateContactifOnlyOnePresent();
					var isRequestOutZone = $('#isRequestOutZone').val();
					var tradeCode=$("#tradeCode").val();
					//if(isRequestOutZone == 'true')
					//{
					if(isRequestOutZone == 'false' && tradeCode=='A' )	
					{
					$('#isEdi').attr('checked','checked');
					$('#isContact').attr("disabled","disabled");
					}
					else
					{					
					$('#isContact').attr('checked','checked');
					$('#isEdi').attr("disabled","disabled");
					$('#addDocumentContact').show();	
					}						
					//}
				}
			}
		});
		
	}
	function validatePhoneNo(namePrefix)
	{
		if($('input[name="'+namePrefix+'CountryCode"]').val()=='' && $('input[name="'+namePrefix+'AreaCode"]').val()=='' && $('input[name="'+namePrefix+'Exchange"]').val()=='' && $('input[name="'+namePrefix+'Station"]').val()=='' && $('input[name="'+namePrefix+'Extension"]').val()=='')
			return true;
		else
		{
			if(!validateForPositiveIntegers($('input[name="'+namePrefix+'CountryCode"]').val()))
			{
				$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
				return false;
			}
			else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'AreaCode"]').val()))
			{
				$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
				return false;
			}
			else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Station"]').val()))
			{
				$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
				return false;
			}
			else if(!validateForPositiveIntegers($('input[name="'+namePrefix+'Exchange"]').val()))
			{
				$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Extension"]').val()!='' && 
					!validateForPositiveIntegers($('input[name="'+namePrefix+'Extension"]').val()))
			{
				$('input[name="'+namePrefix+'Extension"]').validationEngine('showPrompt', 'Please enter only numbers', 'error', 'topRight', true);
			}
			else if($('input[name="'+namePrefix+'CountryCode"]').val()=='')
			{
				$('input[name="'+namePrefix+'CountryCode"]').validationEngine('showPrompt', 'Please enter country code', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'AreaCode"]').val()=='')
			{
				$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Please enter area code', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Exchange"]').val()=='')
			{
				$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Please enter exchange code', 'error', 'topRight', true);
				return false;
			}
			else if($('input[name="'+namePrefix+'Station"]').val()=='')
			{
				$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Please enter station code', 'error', 'topRight', true);
				return false;
			}
		
			
			if($('input[name="'+namePrefix+'CountryCode"]').val()=='01' || $('input[name="'+namePrefix+'CountryCode"]').val()=='1')
			{
				if($('input[name="'+namePrefix+'AreaCode"]').val().length!=3)
				{
					$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Area code must be of 3 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Exchange"]').val().length!=3)
				{
					$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Exchange must be of 3 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Station"]').val().length!=4)
				{
					$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Extension"]').val().length>7)
				{
					$('input[name="'+namePrefix+'Extension"]').validationEngine('showPrompt', 'extension code must be of 1-7 digits', 'error', 'topRight', true);
					return false;
				}
				else
					return true;
			}
			else
			{
				if($('input[name="'+namePrefix+'AreaCode"]').val().length<2)
				{
					$('input[name="'+namePrefix+'AreaCode"]').validationEngine('showPrompt', 'Area code must be of 2-4 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Exchange"]').val().length<3)
				{
					$('input[name="'+namePrefix+'Exchange"]').validationEngine('showPrompt', 'Exchange must be of 3-4 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Station"]').val().length!=4)
				{
					$('input[name="'+namePrefix+'Station"]').validationEngine('showPrompt', 'Station code must be of 4 digits', 'error', 'topRight', true);
					return false;
				}
				else if($('input[name="'+namePrefix+'Extension"]').val().length>7)
				{
					$('input[name="'+namePrefix+'Extension"]').validationEngine('showPrompt', 'extension code must be of 1-7 digits', 'error', 'topRight', true);
					return false;
				}
				else
					return true;
			}
		}
	}

	function validateForPositiveIntegers(value) {
		var re = new RegExp("^[0-9]+$");
		if (value<0) {
			return false;
		} else if (!re.test(value)) {
			return false;
		} else {
			return true;
		}
	}

	function showResponseMessagesSpot(msgDivId, responseText)  { 
	  	if (responseText.messages) {

			var messages = responseText.messages;
			var messageContent = '';
			if (messages.error.length > 0) {
				var array = messages.error;
				var len = messages.error.length;
				for (var i=0; i<len; i++) {
					
					messageContent += '<div class="message_error">' + array[i] + '</div>';
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
				window.scrollTo(0, 0);
	  	}
	}

	function selectForFormSerialize(radioButtonObj, value)
	{
		$(radioButtonObj).attr("checked", true);
		$(radioButtonObj).val(value);
	}
	
	function getCommentTypes(args){
		$.ajax({
			url: _context +"/comments/commentTypes",
			data: {
				entity: 'SPRQ',
				contextScreen: 'spotpull'
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
	//D020000, For booking comments in dispatch
	function getBookingCommentTypes(args){
		/*if($('#bookingId').val()==null || $('#bookingId').val()==''){
			return;
		}*/
		
		$.ajax({
			url: _context +"/comments/commentTypes",
			data: {
				entity: 'BKNG',
				contextScreen: 'maintainbooking'
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
					$("#booking_comment_link").comments(args);
				}
			}
		});

	}
	/*
	function getBKNGCommentTypes(argsbkng){
		$.ajax({
			url: _context +"/comments/bkCommentTypes",
			data: {
				entity: 'BKNG',
				contextScreen: 'spotpull'
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
					argsbkng.displayCommentTypes=string;
					$("#bkngComment").comments(argsbkng);
					
				}
			}
		});
	}
	*/   
	function loadNewPage()
	{
		var queryString = $('#spotPullForm').formSerialize();
		blockUI();
		$.ajax({
			type: "POST",
			async: false,
			url: _context +"/createdispatch/newDispatchRequest",
			data: queryString,
			success: function(responseText){
				$.unblockUI();
				$("#spotPullForm").loadJSON(responseText.data);
				showResponseMessages(responseText.messages);
				jQuery("#dispatchLocationGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');					
				jQuery("#dispatchStatusGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
				jQuery("#dispatchBillGridTable").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');				
				disableAllFields();
				$("#spotRequirementTypeCode").removeAttr("disabled");
				populateFieldsFromAjaxResponse(responseText);
				$('#portContact').html("");
				$('#portCode').html("");
				$('#dateAndTime').html("");
				$('#statusCodeDiv').html("");	
				$('#refNo').html("");
				$('#truckerName').val("");
				//D025377: Dispatch/Rail Bill Detail: Add and New buttons functionality
				$('#asInstructions').val("");
				$("#bookingNumberForDispatch").val("BK");
				$("#isSpotOnPullForDispatch").prop('checked', false);
				$("#isInbond").prop('checked', false);
				$('#typeField').html("");
				$('#booked').val('');
							
		        $("#spotRequirementTypeCode").get(0).options.length = 0;
		        $.each(responseText.data.dispatchTypeList, function(index, dispatchTypeList) {
		            $("#spotRequirementTypeCode").get(0).options[$("#spotRequirementTypeCode").get(0).options.length] = new Option(dispatchTypeList.description, dispatchTypeList.code);
		        });

		        $("#equipment").get(0).options.length = 0;
		        $.each(responseText.data.equipmentList, function(index, equipmentList) {
		            $("#equipment").get(0).options[$("#equipment").get(0).options.length] = new Option(equipmentList.description, equipmentList.code);
		        });

		        $('#spotRequirementTypeCode').focus();
		        $("#DocumentHistory").attr("disabled", "disabled");
				$("#saveBtn").attr("disabled", "disabled");
//		        $('#alfresco_button').hide();
		        //D027780
		        if($("#spotRequirementTypeCode").get(0).options.length == 1){
					var messageContent = $('#msgDiv').html();
					messageContent += '<div class="message_warning">Invalid type for the Load Discharge service.</div>';
					$('#msgDiv').html(messageContent);
				}
				//oldForm = $('#spotPullForm').formSerialize();
				isDispatchChanged="N";
			}
		});

	}
	
	function enableDisableForSecurity()
	{
		//For Delete,Send and Copy visbility hidden added for Defect D027289
		if(isDispatchSearchable && isDispatchDisplayable && !isDispatchDeletable)
		{
			$("#cancelBtn").attr("disabled", "disabled");
			// $("#deleteBtn").attr("disabled", "disabled");
			$("#deleteBtn").css('visibility','hidden');
		}
		if(isDispatchSearchable && isDispatchDisplayable && !isDispatchUpdatable)
		{
			$("#saveBtn").attr("disabled", "disabled");
			$("#saveAndSendBtn").attr("disabled", "disabled");
			// $("#copyBtn").attr("disabled", "disabled");
			 $("#copyBtn").css('visibility','hidden');
			$("#newBtn").attr("disabled", "disabled");
			$("#cancelBtn").attr("disabled", "disabled");
			// $("#deleteBtn").attr("disabled", "disabled");
			$("#deleteBtn").css('visibility','hidden');
			$("#truckerCode").attr("disabled", "disabled");
			$('#locationOverlayDiv').gatesDisable();
			disableDialogButton('locationDialog','Ok');
			$('#rampCode').attr("disabled","disabled");
			$('#depot').attr("disabled","disabled");
			$("#addBtn").attr("disabled", "disabled");
			//$("#sendBtn").attr("disabled", "disabled");
			$("#sendBtn").css('visibility','hidden');
			$("#selectedContactId").attr("disabled", "disabled");
			document.getElementById('locationAddDiv').style.display = 'none';
			
			$('#requiredDate').attr("disabled","disabled");
			$('#requiredTime').attr("disabled","disabled");
			$('#appointmentTimePm').attr("disabled","disabled");
			$('#appointmentTimeAm').attr("disabled","disabled");
			$('#rate').attr("disabled","disabled");
			$('#weight').attr("disabled","disabled");
			$('#originRampCode').attr("disabled","disabled");
			$('#destinationRampCode').attr("disabled","disabled");
			$('#seal').attr("disabled","disabled");
			$('#portCutOffDate').attr("disabled","disabled");
			$('#isOkToSub').attr("disabled","disabled");
			$('#bookingNumberForDispatch').attr("disabled","disabled");
			$('#isSpotOnPullForDispatch').attr("disabled","disabled");
			$('#inbond').attr("disabled","disabled");
			$('#isInbond').attr("disabled","disabled");
			$('#rampName').attr("disabled","disabled");
			$('#vesselCutOffDate').attr("disabled","disabled");
			$('#asInstructions').attr("disabled","disabled");
			$('#isEdi').attr("disabled","disabled");
			$('#isContact').attr("disabled","disabled");
		}
		if(!isDispatchSearchable)
			{
			$("#searchBtn").attr("disabled", "disabled");
			$("#addBtn").attr("disabled", "disabled");
			//$("#sendBtn").attr("disabled", "disabled");
			$("#sendBtn").css('visibility','hidden');
			}
		if(isDispatchSearchable && !isDispatchDisplayable)
			{
			$("#addBtn").attr("disabled", "disabled");
			//$("#sendBtn").attr("disabled", "disabled");
			$("#sendBtn").css('visibility','hidden');
			}
		//Added changes for defect D027298
		if(($("#sendBtn").css("visibility") == "hidden") || ($("#saveBtn").css("visibility") == "hidden"))
		 {
		  $("#saveAndSendBtn").css('visibility','hidden');
		 }
		else if($("#sendBtn").is(":disabled") || $("#saveBtn").is(":disabled"))
		{
			  $("#saveAndSendBtn").attr("disabled","disabled");
		}

	}
	function disableDialogButton(dialogId, buttonName){
		$("#"+dialogId+"~ .ui-dialog-buttonpane").contents().find("button:contains('"+buttonName+"')").button("disable");
	}
	
	function hideGridsEditDeleteIcons(gridId){
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-pencil"]').hide();
		$('table[aria-labelledby="gbox_'+gridId+'"] tbody tr td div span[class="ui-icon ui-icon-trash"]').hide();
	}

	function formatTime(obj) {
	    var valTime = new RegExp("^([0-1][0-9]|[2][0-3]):([0-5][0-9])$");
	    var objFormField = obj;
	    var txt = objFormField.value;
	    if ((txt != "") || (txt.length != 0)) {
	        txt = txt.replace(/[^\d]/g,'');
	        if (txt.length == 4)
	            txt = txt.substr(0,2) + ":" + txt.substr(2,4);
	        if (txt.length == 3)
	            txt = txt.substr(0,2) + ":" + txt.substr(2,3)+"0";
	        if (txt.length == 2)
	            txt = txt + ":00";
	        if (txt.length == 1)
	            txt = txt + "0:00";

	        //objFormField.value = txt.substr(0,2) + ":" + txt.substr(2,4);
	        //if (objFormField.value.match(valTime) == null) {
	        if (txt.match(valTime) == null) {
	            //alert('Please enter a valid time. Use HH:mm format.');
	            objFormField.focus();
	            //document.getElementById(objFormField).focus();
	            return false;
	        } else {
	            objFormField.value = txt;
	        }
	    }
	    return true;
	}
	
	function populateContactifOnlyOnePresent()
	{
		var noOfContacts = $("#selectedContactId option").length ;				
		
		if(2 == noOfContacts)
		 {			
			$("#selectedContactId").val(document.getElementById('selectedContactId').options[1].value);
			$('#spotPullForm').attr('action','addToGrid/addPrimary');
			$('#spotPullForm').ajaxSubmit(options);
		 }

	}
	
	function setInZoneMandatoryChecks()
	{
		var isRequestOutZone = $('#isRequestOutZone').val();
		if(isRequestOutZone == 'false')
		{
			$("#Open").html("Open Time<span class=\"mandatory\">*</span>");
			$("#Close").html("Close Time<span class=\"mandatory\">*</span>");			
		}
	}
	
	function openTruckerRatePopupOnApptTimeSelection()
	{
		var openTruckerPopup = true;
		/*if($("#oldApptDate").val())
		{
			var apptDate = $("#requiredDate").val();
			var oldApptDate = $("#oldApptDate").val();			
			if(Date.parse(apptDate) == Date.parse(oldApptDate))
				openTruckerPopup=false;
		}*/

//	open overlay for in-zone and out-zone both if trucker code or rate not present
//		var isRequestOutZone = $('#isRequestOutZone').val();

//		if(isRequestOutZone == 'false')
//		{
		if($('#bookingTypeCode').val()!='T')
		{
		if($("#truckerCode").val())
		{
		loadDocumentContactDetails(true);
		}
		if(!$("#truckerCode").val() || !$("#rate").val() || $("#rate").val()=='0.00')
		{
		
			if(openTruckerPopup)
			{
				truckerPopupSearch(false);
			}
		}
		}
		else
		{
		if($("#truckerCode").val())
		{
		loadDocumentContactDetails(true);
		}
		if(!$("#truckerCode").val() && !$("#rate").val())
		{
		
			if(openTruckerPopup)
			{
				truckerPopupSearch(false);
			}
		}		
		}
//		}
/*		else
		{
			if(!$("#truckerCode").val() || !$("#rate").val())
			{
				if(openTruckerPopup)
				{
					truckerPopupSearch(false);
				}
			}
		}
*/	
			}

	function setCalendarForApptDate()
	{
		var minDateVar = new Date();		
		var currentDate = new Date();
		var currentApptDate  = new Date($("#requiredDate").val());

		if($("#requiredDate").val())
		{
			 if(Date.parse(currentApptDate) > Date.parse(currentDate))
				 minDateVar=new Date(currentDate);
			 else
				 minDateVar=new Date(currentApptDate);
		}
		
//		if($("#requiredDate").val())
//			minDateVar = new Date($("#requiredDate").val()); 
			
		$("#requiredDate").datepicker({
			minDate : minDateVar
		});
		$("#requiredDate").datepicker("option", "minDate", minDateVar);

		$("#requiredDate").datepicker({
			maxDate : '+60d'
		});
		$("#requiredDate").datepicker("option", "maxDate", '+60d');

	}
	
	function singleAddressCall(){
		$.ajax({
			type : "POST",
			url : _context +"/cas/autocomplete.do?method=searchSingleAddressforBK&searchType=245&parentSearch="+ $("#organizationId").val(),
			
			success : function(responseText) {
				if(responseText.length == 1){
					
					data = responseText[0];
					var nameQualifier='';
					if(data.name!='' && data.name!=null)
					{
					nameQualifier = data.name;
					}
					var add = data.address;
					var city = responseText[0].city;
					var state = responseText[0].state;
					var finalAddress = formatAddRoleDscr(nameQualifier, add, city, state);
					
					$("#addRolDesc").val(finalAddress);
					$("#addressRoleId").val(data.id);
					$("#city").val(data.city);
					$("#state").val(data.state);
					$("#zip").val(data.zip);
					populateLocationData();
					//$("#country").val(data.cntry);
					somethingChanged = true;					
					isDispatchChanged="Y";
				}
				else
					{
					custAddressPopupSearch();
					}
			}
		});
	}
	
	function populatePortCode()
	{
		var dispatchType = $("#spotRequirementTypeCode").val();
		
		 if (dispatchType == 'S' || dispatchType == 'P' || dispatchType == 'L') 
		 {			
			 portCodeForPredictive = $('#originPortCityCode').val();
	     }
		 else
		 {
			 portCodeForPredictive = $('#destPortCityCode').val();
		 }
		 
	}
	function loadContainers()
	{
	var queryString = $('#spotPullForm').formSerialize();
		$.ajax({
			async: false,
	        type: "POST",
			url: _context +"/createdispatch/loadContainers",
			data: queryString,
			success: function(responseText)
			{	
			$("#spotPullForm").loadJSON(responseText.data);
			showResponseMessages(responseText.messages);
			$("#containerNumberForDispatch").get(0).options.length = 0;
			$.each(responseText.data.containerList, function(index, containerList) {
            $("#containerNumberForDispatch").get(0).options[$("#containerNumberForDispatch").get(0).options.length] = new Option(containerList.description, containerList.code);
			});
		
			var containerNo = responseText.data.containerNumberForDispatch; //$("#containerNumberForDispatch").val();
			$("#containerNumberForDispatch").editableDropdown("selectOption", {value: containerNo, text: containerNo});
			
			var containerType = responseText.data.typeField;
			$('select[name^="equipment"] option:selected').attr("selected",null);
			$.each(responseText.data.equipmentList, function(index, equipmentList) {
				var type=equipmentList.description;
				if(type==containerType)
				{
					$('select[name^="equipment"] option[value="'+equipmentList.code+'"]').attr("selected","selected");
				}
			});
			}
		});
	

	}
	
	
	function loadEquipementTypeForContainer()
	{
	var queryString = $('#spotPullForm').formSerialize();
		$.ajax({
			async: false,
	        type: "POST",
			url: _context +"/createdispatch/loadEquipementTypeForContainer",
			data: queryString,
			success: function(responseText)
			{	
			$("#spotPullForm").loadJSON(responseText.data);
			showResponseMessages(responseText.messages);
			var containerType = responseText.data.typeField;
			$('select[name^="equipment"] option:selected').attr("selected",null);
			$.each(responseText.data.equipmentList, function(index, equipmentList) {
		    var type=equipmentList.description;
			if(type==containerType)
			{
			$('select[name^="equipment"] option[value="'+equipmentList.code+'"]').attr("selected","selected");
			}
		    });
			}
		});
	

	}
	function disableFieldsForRail()
	{
		var dispatchType = $("#spotRequirementTypeCode").val();
		if (dispatchType == 'R')
			{
			disableAllFields();
			$("#comment_link").attr("disabled", "disabled");
			//$("#saveAndSendBtn").attr("disabled", "disabled");
			$("#DocumentHistory").attr("disabled", "disabled");
			$("#saveBtn").attr("disabled", "disabled");
			//$("#cancelBtn").attr("disabled", "disabled"); D030749
			$("#deleteBtn").attr("disabled", "disabled");
			}
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
		   	url:_context+'/booking/loadEmailTemplates?module=Dispatch',
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
		
		console.log ('applyAndSendKicker called. templateId:' + templateId);
		
		blockUI();
		var urlStr = _context +"/createdispatch/getKickerSource?dispatchRequestId="+$('#dispatchRequestId').val()+"&templateId="+templateId;
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
					$('#sendKickerDivDialog-dispatchRequestId').val(responseData.data.dispatchRequestId);
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
	

	function sendDispatchRequest() {
		var queryString = $('#spotPullForm').formSerialize();
		$.ajax({
			type : "POST",
			url : _context + "/createdispatch/sendDispatchRequest",
			data : queryString,
			success : function(responseText) {
				if(responseText.messages.error.length > 0){
					showResponseMessages(responseText.messages);
				}
			}
		});
	}
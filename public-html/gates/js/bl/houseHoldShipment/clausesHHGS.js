var clauseCode = "";
var printOnBill ="";
var somethingChangedClause="";
var ccodechanged="";
$(document).ready(function(){
	
	$('#houseHoldClauseForm').validationEngine('attach');
	
	$('#houseHoldClauseForm input').change(function(){
		somethingChangedClause = true;
	});	
	
	$('#standardClauseCode').change(function(){
		somethingChangedClause = true;
		 ccodechanged=true;
	});
	
	$('#text').change(function(){
		somethingChangedClause = true;
	});
	
	$('#seq').change(function(){
		somethingChangedClause = true;
	});
	
	
	// create add clause dialog at body onload
	createDialog('Add Clause');	
	
	$('#clauseHHGSAdd').click(function(){
		clearClause();
		setShipmentSeqNumber();		
	});
	
	//Autocomplete and lookup for standard clause
 	$('#standardClauseCode').gatesAutocomplete({
		source: '../cas/autocomplete.do?method=getBkStandardClause&searchType=297',
		formatItem: function(data) {
			return data.Code;
		},
		formatResult: function(data) {
			return data.Code;
		}, 
		select: function(data) {
			//isClauseChanged = "Y";
			$("#text").attr("readonly", true);
			$('#standardClauseCode').val(data.Code);
			clauseCode = data.Code;
			$('#text').val(data.FullClause);
			$('#isEditable').val(data.is_editable); 
			printOnBill="Y"; // need to set this value from autocomplete
			if($('#isEditable').val()=='Y')
				$("#text").attr("readonly", false);
			somethingChangedClause = true;
		}
	});	
	
	//look up on overlay
	$('#standardClauseCode').gatesPopUpSearch({func:function() {standardClausePopupSearch();}});
	
	$('input[type="radio"]').change(function()
			{
				
					if($("#custom").attr("checked")==true || 
							$("#custom").attr("checked")=='true'||$("#custom").attr("checked")=='checked')
					{
						//selectForFormSerialize(this, 'C');
						customClickFunction();
					}
					else if($("#instruction").attr("checked")==true || 
							$("#instruction").attr("checked")=='true'||$("#instruction").attr("checked")=='checked')
					{
						//selectForFormSerialize(this, 'S');
						standardClickFunction();
					}
			});
	
	
	
	
	
	$("#standardClauseCode").change(function()
			{
				
				if($("#standardClauseCode").val()=="" || $("#standardClauseCode").val()!=clauseCode)
				{					
					//alert($("#standardClauseCode").val());
					clauseCode = "";
					$("#standardClauseCode").val('');
					$('#text').val("");
					$("#isEditable").val("");
					$("#text").attr("readonly", true);
				}
			});
});

function setShipmentSeqNumber(){
	
		$.ajax({
				url : _context +"/houseHoldShipment/clause/openAddClause",
				type : "GET",				
				success : function(responseText) {
					if(responseText.success==true){
						overlayButtonAction= "addClause";
						setShipmentNumberDropDown(responseText);
						var urlValue =  _context +"/houseHoldShipment/clause/addClause";
						createDialog('Add Clause',urlValue);
						//$('#shipmentHouseHoldForm').clearForm();
						$("#seq").removeAttr("disabled");						
						$("#standardClauseCode").removeAttr("disabled");
						$("#standardClauseCode").removeAttr("readOnly");
						$("#custom").removeAttr("disabled");
						$( "#addHouseHoldClauseDialog" ).dialog('open'); 
						//tabSequence('#houseHoldClauseForm');
						somethingChangedClause="";
						$('#msgDivClauseOverlay').html("");
						//D032460 -Default ALL when new clause HHGDS
						$("#seq").val("ALL");
					}else
					{
						/*$("div#msgDiv").html('<div class="message_info">Load Shipment first.</div>');*/
						return false;
					}
						}
				});
}
function createDialog(titleValue,urlValue) {
	$('#instruction').attr("checked","checked");
	
	
	$( "#addHouseHoldClauseDialog" ).dialog({
		autoOpen : false,
		width :634,
		modal : true,
		title: titleValue,
		close : function()
		{
			$('#houseHoldClauseForm').validationEngine('hideAll');
			tabSequence('#shipmentHouseHoldForm',true,false);
		},
		open : function(){
			tabSequence('#addHouseHoldClauseDialog',false,false);
		},
		buttons:{
			Cancel:function()
			{
				if(ccodechanged==true || somethingChangedClause == true)
					{
					 var conf= confirm('Changes have been made but not saved, do you want to continue(Y/N) ?');
				   		if(conf== true )
				   		{
				   			$('#houseHoldClauseForm').validationEngine('hideAll');
				   			$("#addHouseHoldClauseDialog").dialog('close');
				   			somethingChangedClause = false;	
				   			ccodechanged = false;
				   		}
					}
				else
				{
					$('#houseHoldClauseForm').validationEngine('hideAll');
					$("#addHouseHoldClauseDialog").dialog('close');
				}
			},
			Ok:function()
			{	
				if($('#houseHoldClauseForm').validationEngine('validate'))
					{
						if(printOnBill=="Y") //BR8
							{
								var url =""; 
								if(overlayButtonAction == "editClause"){
									url= _context+"/houseHoldShipment/clause/updateClause";
								}else{
									url =_context+"/houseHoldShipment/clause/addClause";
								}
								
								$('.message_error').hide();	//to hide server side messages
									$.ajax({
												url : url,
												type : "GET",
												data : $('#houseHoldClauseForm').formSerialize(),
												success : function(responseText) {
													if(responseText.success==true)
													{
														//$("#clauseGridHHGS").trigger("reloadGrid");
														jQuery("#clauseGridHHGS").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
														$("#addHouseHoldClauseDialog").dialog('close');
													}else{
														showResponseMessages("msgDivClauseOverlay", responseText);
													}
													
												}
									       });
							}
						else{
							alert("Standard clause for a billing can be added  if Print on Bill = Y.");
						}
					}
				else
					return false;
				
			},
			'Ok & New':function()
			{	
				if($('#houseHoldClauseForm').validationEngine('validate'))
					{
						if(printOnBill=="Y") //BR8
							{
								var url =""; 
								if(overlayButtonAction == "editClause"){
									url= _context+"/houseHoldShipment/clause/updateClause";
								}else{
									url =_context+"/houseHoldShipment/clause/addClause";
								}
								
								$('.message_error').hide();	//to hide server side messages
									$.ajax({
												url : url,
												type : "GET",
												data : $('#houseHoldClauseForm').formSerialize(),
												success : function(responseText) {
													if(responseText.success==true)
													{
														//$("#clauseGridHHGS").trigger("reloadGrid");
														jQuery("#clauseGridHHGS").setGridParam({rowNum:10,datatype:"json" }).trigger('reloadGrid');
													}else{
														showResponseMessages("msgDivClauseOverlay", responseText);
													}
													
												}
									       });
							}
						else{
							alert("Standard clause for a billing can be added  if Print on Bill = Y.");
						}
					}
				
				standardClickFunction();
				return false;
					
				
			},
			Clear:function()
			{
				standardClickFunction();
			}
					
	}});
}




function clearClause()
{
	$('#seq').val('seq1');
	$('#standardClauseCode').val('');
	$('#text').val('');
	$('#text').attr("readonly",true);
	clauseCode = "";
}

//look up methods  ---start
function standardClausePopupSearch() {
	var actionUrl =  _context + '/cas/bkstandardClauseSearch.do';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'StandardClauseSearch', windowStyle);
}

function setStandardClause(id) {
	//isClauseChanged = "Y";
	$("#text").attr("readonly", true);
	var values = id.split("|");	
	$('#standardClauseCode').val(values[0]);
	clauseCode = values[0];
	$('#text').val(values[1]);
	$('#isEditable').val(values[2]);
	printOnBill=values[3];
	if($('#isEditable').val()=='Y')
		{
			$("#text").attr("readonly", false);
		}
}



//look up methods  ---end

function customClickFunction()
{
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("Y");
	$("#standardClauseCode").attr("disabled", true);
	printOnBill="N";
	//$("#standardClauseCode").removeClass("validate[required]");
	//$("#text").removeClass("validate[required]");
	//This will disable Add button while selecting custom radio button.
	$(":button:contains('Ok')").prop("disabled", true).addClass("ui-state-disabled");
	$("#text").attr("disabled", true);
}

function standardClickFunction()
{
	clauseCode = "";
	$("#standardClauseCode").val('');
	$("#text").val("");
	$("#isEditable").val("");
	$("#seq").focus();
	$("#seq").val('ALL');
	$("#standardClauseCode").attr("disabled", false);
	$("#instruction").attr('checked','checked');
	$("#custom").removeAttr('checked');
	printOnBill="Y";
	//$("#standardClauseCode").addClass("validate[required]");
	//$("#text").addClass("validate[required]");
	//This will enable Add button while selecting standard radio button.
	$(":button:contains('Ok')").prop("disabled", false).removeClass("ui-state-disabled");
	$("#text").attr("readonly", false);	
	$("#text").attr("disabled", false);	
	$('#msgDivClauseOverlay').hide();
}
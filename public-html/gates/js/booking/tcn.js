var isOperDoneOnce = false;
var GOVERNMENT_NAME = "GOVERNMENT";

function createTCNGrid(){
	isOperDoneOnce = false;
	var currentRowId = null;
	var currentTCN = "";
	var colNames = ['Id','TCN', 'TcnExists', 'Actions'];
	var colModels = [
	               {name:'tcnSeqNo', index:'tcnSeqNo',hidden:true},	                               
	               {name:'militaryTcn',index:'militaryTcn', width:300, editable:true, editoptions: {maxlength: 17}, formatter:'upperCaseFormatter', editrules:{
	            		custom:true,
	            		required:true,
	            		custom_func:function (value, colname) {
		            			if(!/^[0-9A-Za-z$]+$/.test($.trim(value))){
	                				return [false, colname+": This contains invalid characters."];
	                			}
		            			else{
		            				if($.trim(value).length == 17){
		            					return [true,""];
		            				}
		            				else{
		            					return [false, colname+": This must be 17 characters long."];
		            				}
								}
		            		}
	            	}},
	               {name:'tcnExists', index:'tcnExists', hidden:true},	
			   	   {name:'actions', index:'actions', width:100, align:"center", editable:false, search:false, sortable:false, formatter:'actions', formatoptions : {
						keys : true,
						onEdit: function(rowId, value){ 
							//alert("onEdit rowId1: " + rowId);
							currentRowId = rowId;
							currentTCN = $("#"+currentRowId+"_militaryTcn").val();
						},
						onSuccess:function(jqXHR){ 
							//alert("onSuccess jqXHR: " + jqXHR.responseText);
							var result = eval('(' + jqXHR.responseText + ')');
							var rows = result.rows;
							//alert("rows: " + rows);
							//alert("currentRowId: " + currentRowId);
							showPieceCountWarnMsg();
							if (rows!=null) {
								var success = true;
								for (var i = 0, l = rows.length; i < l; i++) {
				            		if(rows[i].tcnSeqNo==currentRowId && rows[i].tcnExists==true){
				            			success = false;
				            			var isConfirm = confirm("TCN is not unique, override?");
				        				if (!isConfirm) {
				        					//alert("isConfirm: " + isConfirm);
				        					$.ajax({
				        						type: "POST",
				        						url: _context +"/booking/freight/updateTCN",
				        						data: {id:currentRowId, militaryTcn:currentTCN, tcnExists:false, validate:false},
				        						success:function(responseText){
				        							//loadTCNGrid();
				        						}
				        					});
				        				}
				        				else{
				        					$.ajax({
				        						type: "POST",
				        						url: _context +"/booking/freight/updateTCN",
				        						data: {id:currentRowId, militaryTcn:rows[i].militaryTcn, tcnExists:false, validate:false},
				        						success:function(responseText){
				        							loadTCNGrid();
				        						}
				        					});
				        				}
				        				break;
				            		}
				            		/*else{
			        					return true;
			        				}*/
								}
								
								if(success){
									return true; 
								}
							} 
							else{
								if(result.success==false){
									if(result.messages!=null){
										var errorMsgs = result.messages;
										var str= "";
										for (var i = 0; i < errorMsgs.length; i++) {
											str += errorMsgs[i];
										}
										$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"] td').html(str);
										$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"]').show();
									}
								}
							}
						},
						afterRestore:function(){
							//alert("afterRestore before: " + currentRowId);
							//alert("afterRestore before: " + currentTCN);
							currentRowId='';
							currentTCN="";
							$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"] td').html("");
							$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"]').hide();
							//alert("afterRestore after: " + currentRowId);
						},
						afterSave:function(){
							isBookingChanged = "Y";
							return true;
						}
					}}
			   	];
	
	jQuery.extend($.fn.fmatter , {
		upperCaseFormatter : function(cellvalue, options, rowdata) {
			return cellvalue.toUpperCase();
		}
	});

	var jsonReaderReference = {
			root : "rows",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false,
			cell : "cell",
			id : "tcnSeqNo"
		};

	/*createGrid(
			"tcnGrid", // grid id for user
			"tcnGridPager", // page id for user
			_context+'/booking/freight/loadTCNGrid', 
			_context+'/booking/freight/addTCN', 
			_context+'/booking/freight/updateTCN', 
			_context+'/booking/freight/deleteTCN', 
			_context+'/booking/freight/deleteTCN',
			colNames, 
			colModels, 
			"TCN",
			90,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			false, jsonReaderReference, false, false, true, true, false, false,
			null, false);*/
	
	createGrid(
			"tcnGrid", // grid id for TCN
			"tcnGridPager", // page id for TCN
			_context+'/booking/freight/loadTCNGrid', 
			_context+'/booking/freight/addTCN', 
			_context+'/booking/freight/updateTCN?validate='+true, 
			_context+'/booking/freight/deleteTCN', 
			_context+'/booking/freight/deleteTCN',
			colNames, 
			colModels, 
			"TCN",
			83,
			3,
			[3,6,9],
			true,
			true,
			false, //load once
			false, jsonReaderReference, false, false, false, true, 
			false, false, false, false, tcnGridLoadComplete, false, true, false, tcnAfterSubmit);
	
	$("#tcnGrid").jqGrid('setGridParam',{
		afterInsertRow: function(rowid, rowdata, rowelem){
			//alert(rowdata.tcnExists);
			isOperDoneOnce = true;
			if(rowdata.tcnExists!=null && rowdata.tcnExists==true){
				var isConfirm = confirm("TCN is not unique, override?");
				if (!isConfirm) {
					$.ajax({
						type: "POST",
						url: _context +"/booking/freight/deleteTCN",
						data: {id:rowid},
						success:function(responseText){
							loadTCNGrid();
							isOperDoneOnce = false;
						}
					});
				}
			}
			//alert("rowdata.totalTcnCount: " + rowdata.totalTcnCount);
		}
	});
	
	/*$('#gbox_tcnGrid #sData').click(function(e){
			if($("#equipmentGrid").getGridParam("reccount")!=0){
				$('#msgDivFrt').html('<div class="message_error">*** Equipment and TCN grid are mutually exclusive.</div>');
				triggerErrorMessageAlert('msgDivFrt');
				e.preventDefault();
				return false;
			}
	});*/
}

function unloadTCNGrid(){
	$('#tcnGrid').jqGrid('GridUnload');
}

function loadTCNGrid(){
	//alert("loadEquipmentGrid");
	$('#tcnGrid').trigger("reloadGrid");
}

var tcnGridLoadComplete = function(){
	//alert("isOperDoneOnce: " + isOperDoneOnce);
	if(isOperDoneOnce){
		showPieceCountWarnMsg();
	}
	
	//$('#bookingForm').validationEngine('validate');
	//$('#bookingForm').validationEngine('attach');
	$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_tcnGrid"] thead tr[id="FormError"]').hide();
	
	resetTCNAddRow();
	
	if($("#tcnGrid").getGridParam("reccount")>0){
		//setIBSCodeMandatory();
		if($('#militaryIbsStatusCode option:selected').text()!=''){
			setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
		}
	}
	else{
		if($('#totalCommodityLines').text()!='' && $('#totalCommodityLines').text()!='0' && $('#totalCommodityLines').text()!='1'){
			validateTCNExists();
		}
		else{
			//resetIBSCode();
			resetCargoPickup();
			resetCargoDelivery();
		}
	}
	
	$('#gbox_tcnGrid #sData').click(function(){
		isBookingChanged = "Y";
	});
};


function showPieceCountWarnMsg(){
	if($("#tcnGrid").getGridParam("records")!=0 && $("#tcnGrid").getGridParam("records")!=$('#pieceCount').val()){
		$('#msgDivFrtTcn').html('<div class="message_warning">Pieces Count does not equal number of TCNs</div>');
		$('#msgDivFrtTcn').show();
	}
	else{
		$('#msgDivFrtTcn').html('');
		$('#msgDivFrtTcn').hide();
	}
}

//D016178- Sets/resets IBS code for MBU commodity
function validateTCNExists(){
	if($.trim($('#customerGroupId :selected').text())==GOVERNMENT_NAME && ($.trim($('#loadDschServiceGroupCode').val())=='CON' || $.trim($('#loadDschServiceGroupCode').val())=='LCL') && $('#isAllowBookingUnit').val()=="Y"){
		$.ajax({
			url: _context +"/booking/freight/validateTCNExists",
			async: false,
			success: function(responseText){
				if(responseText.success){
					//setIBSCodeMandatory();
					if($('#militaryIbsStatusCode option:selected').text()!=''){
						setCargoPickupDeliveryMandatory($('#militaryIbsStatusCode option:selected').text().split(":")[1]);
					}
				}
				else{
					 //resetIBSCode();
					 resetCargoPickup();
					 resetCargoDelivery();
				}
					
			}
		
		});
	}
}

function resetTCNAddRow(){
	$('#militaryTcn').val('');
}

var tcnAfterSubmit = function(result){
	if(result.success){
		isBookingChanged = "Y";
	}
};
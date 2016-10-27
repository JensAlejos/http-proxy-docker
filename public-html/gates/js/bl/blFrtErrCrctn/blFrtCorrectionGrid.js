var isChanged=false;
$(document).ready(function () {
	
	
            var colNames=['id', 'FC#', 'Date', 'User ID', 'Err', 'Description', 'Current Amt USD', 'Change Amt USD', '','auditRemark'];
			var colModel=[
			              {name:'id',index:'id', width:55, editable:true, hidden:true},
			              {name:'shipmentCorrectionNumber',index:'shipmentCorrectionNumber', width:14,editable:false,
			            	  formatter : 'showlink',
			            	 
                              formatoptions : {
              					baseLinkUrl : "javascript:",
              					showAction : "actionToLinkUnLink('",
              					addParam : "');"
              				}},
	   					  {name:'correctDate',index:'correctDate', width:28, editable:false, editrules:{required:true}},
				          {name:'correctedUser',index:'correctedUser', width:50, editable:false, editoptions:{size:8},editoptions: {maxlength:7}},
			              /*{name:'freightCorrectionErrorCode',index:'freightCorrectionErrorCode', width:17,editable:true,editoptions: {maxlength:25,custom:true,
			            	  custom_func:function() {
			            		  isChanged=true;
			            		  alert("here"+isChanged);
			            	  }},*/
			            	  {name:'freightCorrectionErrorCode',index:'freightCorrectionErrorCode', width:25, editrules:{required:true,custom:true,custom_func:setChanged},editoptions: {maxlength:4}, editable:true,  
				        	  'classes'	  : 'toUpperCaseInGrid', 
			                   		'edittype'    : 'custom',
			                  		'editoptions' : {
											size:10,
											'custom_element' :  autocomplete_element,  
											'custom_value'   : autocomplete_value  
											

										}  
			            	  },
			              {name:'description',index:'description',width:90, editable:false, editrules:{required:true}, editoptions:{size:10,maxlength:25}},
			              {name:'shipmentChargeAmountUSD',index:'shipmentChargeAmountUSD', width:35, editrules:{required:true,custom:true}, editable:false,
			            	  formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ "}},
			   			  {name:'changeAmountUSD',index:'changeAmountUSD', width:35, editrules:{required:true,custom:true}, editable:false,
			   				formatter:'currency', formatoptions:{decimalSeparator:".", thousandsSeparator: ",", decimalPlaces: 2, prefix: "$ "}},
			   				{name:'edit', index:'edit', width:25, editable:false, formatter:'actions',formatoptions:{
                         	   onEdit:function(rowid) {
                         			//$('#FormError').html("");
                         			$("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
                         			//$("div.ui-pg-div.ui-inline-cancel", "#"+rowid).remove();
                         			//$("div.ui-pg-div.ui-inline-save", "#"+rowid).remove();
                         			 //$("#billFrtCorrectionGrid").jqGrid('restoreRow',rowid) ; 
                         			// $('#billFrtCorrectionGrid').trigger('reloadGrid');
                         			// $("div.ui-pg-div.ui-inline-del", "#"+rowid).remove();
                         	   }
                             }
                            },
                            {name:'auditRemark',index:'auditRemark',hidden:true},
                            ];
						createGrid(
								'billFrtCorrectionGrid', // grid id 
								'billFrtCorrectionPager', // page id 
								'/gates/bill/frtcorrection/loadGrid', 
								'', 
								'/gates/bill/frtcorrection/editFrtCorrection',
								'', 
								'',
								colNames, 
								colModel, 
								'Details',
								100
								,10 ,[10,20,30] ,
								false, /* multiselect */
								false, /* multidelete */
								true,
								false,/* isReadOnly */
								null,/* JSON */
								false, /* hideEdit */
								true, /* hideDelete */
								true,
								true,
								true,/*hideCustomAddRow*/
								false,
								false,
								hideAdd,hideAdd
								);
						
			jQuery("#billFrtCorrectionGrid").jqGrid('setGridParam',{
				onSelectRow:function(rowid, status){
					console.log("onSelectRow: " + rowid);
					var fc = $("#billFrtCorrectionGrid").jqGrid('getCell', rowid, 'shipmentCorrectionNumber') || "" ;//FC#
					var auditRemark = $("#billFrtCorrectionGrid").jqGrid('getCell', rowid, 'auditRemark') || "";
					//D027392, Removed the extra close brace, it made grid re-appear. 
					if (auditRemark && auditRemark != '') {
						$('#fcAuthorization').val("FC# " + fc + " : " + auditRemark);
					} else {
						$('#fcAuthorization').val("");
					}
					return true;
				}
			});						
						
});

function hideAdd()
{
	$("#gview_billFrtCorrectionGrid").find("#tr_id").hide();
}

function setChanged(value, colname)
{
		isChanged=true;
		$("#hasChanged").val('1');
		$('#save').removeAttr("disabled");
		return [true,""];
}

/**************************************************************************/
function autocomplete_element(value, options) {
	  // creating input element
	  var $ac = $('<input type="text"/>');
	  // setting value to the one passed from jqGrid
	  $ac.val(value);
	  // creating autocomplete
	 var url = _context+'/cas/autocomplete.do?method=frtErrorCodePsearch&searchType=360';	
	  $ac.gatesAutocomplete({
			source: url,
			mustMatch:true,
			formatItem: function(data) {
				return data.id;
			},
			formatResult: function(data) {
				return data.id;
			},
			select: function(data) {
				$('input#freightCorrectionErrorCode').val(data.id);
				//$('input#createDateInString').val(setFormattedDate());
				
			}
		});
	  
	  // returning element back to jqGrid
	  return $ac;
	}

	function autocomplete_value(elem, op, value) {
	  if (op == "set") {
	    $(elem).val(value);
	  }
	  return $(elem).val();
	}


/*function autocomplete_element(value, options) {
	  // creating input element
	  var $ac = $('<input type="text" onblur="checkBlur(this.value);"/>');
	  // setting value to the one passed from jqGrid
	  $ac.val(value);
	  // creating autocomplete
	 var url = _context+'/cas/autocomplete.do?method=frtErrorCodePsearch&searchType=360';	
	  $ac.gatesAutocomplete({
			source: url,
			mustMatch: true,
			formatItem: function(data) {
				return data.id + "-" + data.name;
			},
			formatResult: function(data) {
				return data.id ;
			},
			select: function(data) {
				$('input#freightCorrectionErrorCode').val(data.id);
			}
		});
	  
	  // returning element back to jqGrid
	  return $ac;
	}

function checkBlur(val){
	if(val==''){
		$('input#freightCorrectionErrorCode').val('');
	}
}
	function autocomplete_value(elem, op, value) {
	  if (op == "set") {
	    $(elem).val(value);
	  }
	  return $(elem).val();
	}*/

/**************************************************************************/
	function actionToLinkUnLink(id){
		var newID =id.split('=')[1];
		var corrNo=jQuery("#billFrtCorrectionGrid").getRowData(newID).shipmentCorrectionNumber;
		//alert("corrNO="+corrNo);
		var options=corrNo+":"+corrNo+";";
		//alert("options"+options);
		  document.location.href=_context+'/bl/freightCorrectionErrors/find?shipmentNumber='+ $('#shipmentNumber').val()+'&shipmentSequenceNumber='+$('#shipmentSequenceNumber').val()+'&shipmentCorrectionNumber='+corrNo+'&navigationUrl='+1;
		}	
	
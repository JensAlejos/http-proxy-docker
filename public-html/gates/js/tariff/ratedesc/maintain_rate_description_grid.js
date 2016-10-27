//Customer Rate Grid
var custRateadded=false;
$(function() {
	
	var screenName='1';
			var colNames=['Id', 'Status', 'Effective Date', 'Expiration Date','Rate','Source Rate Amount','Source Rate Basis','xCopy','Action','isInValidRange'];
			var colModel = [ {
				name : 'tariffRateAmountId',
				index : 'tariffRateAmountId',
				width : 55,
				editable : false,
				hidden : true,
				editoptions : {
					readonly : true,
					size : 10
				}
			},{
				name : 'status',
				index : 'status',
				width : 50,
				editable : false,
				editoptions : {
					size : 20
				},
				formatter : 'showlink',
				formatoptions : {
	   				baseLinkUrl : "javascript:",
					showAction: "editCustomerRateGrid('",
					addParam: "');" 
				}
			},{
				name : 'effectiveDateStr',
				index : 'effectiveDateStr',
				width : 130,		
				sortable : true,
				sorttype : 'date',				
				editable : true,
				editoptions : {
					size : 20,maxlengh: 10,
		              dataInit: function(element) {
							var _prefDate = $('#prefDateSessionVar').val();
							 $(element).datepicker({dateFormat: 'mm-dd-yy', showOn: 'both'});
		            			if (_prefDate != null && _prefDate != '') {
		            					 $(element).datepicker('setDate', _prefDate);
		            			} else {
		            					 $(element).datepicker('setDate', new Date());
		            			}
		              }
				},
				editrules:{required:true,
					custom:true,
             		custom_func:function (value, colname){
             			var matches = /^(\d{2})[-\-](\d{2})[-\-](\d{4})$/;
                			if($.trim(value)==''){
                				value = $.trim(value);
                				return [false, colname+":No blank spaces are allowed."];
                			} 
                			else{
         			        	 if(!matches.test(value)) {
         			        		 return [false, colname+": Input must match this pattern: mm-dd-yyyy"];
         			        	 }
                			}
                			return [true, ""];
             		}	
				} 
			}, {
				name : 'expirationDateStr',
				index : 'expirationDateStr',
				width : 130,		
				editable : true,
				afterShowForm : function (Id) {$('#expirationDateStr').attr('autocomplete', 'off'); } ,
				editoptions : {
					size : 20,maxlengh: 10,
		              dataInit: function(element) {
		                  $(element).datepicker({ dateFormat: 'mm-dd-yy', showOn: 'both'});
		              }
				},
				editrules:{required:false,
					custom:true,
             		custom_func:function (value, colname){
             			var matches = /^(\d{2})[-\-](\d{2})[-\-](\d{4})$/;
                			if($.trim(value)==''){
                				value = $.trim(value);
                				return [false, colname+":No blank spaces are allowed."];
                			} 
                			else{
         			        	 if(!matches.test(value)) {
         			        		 return [false, colname+": Input must match this pattern: mm-dd-yyyy"];
         			        	 }
                			}
                			return [true, ""];
             		}	
				}
			},{
				name : 'tariffRateAmount',
				index : 'tariffRateAmount',
				width : 110,
				editable : true,
				sortable : true,
				align: 'right',
				formatter: 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2},			
				editoptions : {
					size : 20,maxlength: 12,
					dataEvents: [
			                      {
			                    	  type: 'blur',
			                          fn: function(e) {
			                   			var reg5Number2DecimalPlaces = /^(\+|-)?[0-9]{0,8}(\.[0-9]{1,2})?$/;
			                   			var value=this.value;
			                  			if($.trim(value)==''){
			                  				value = $.trim(this.value);
			                  				return [false, colname+":No blank spaces are allowed."];
			                  			} 
			                  			else{
			           			        	 if(!reg5Number2DecimalPlaces.test(value)) {
			           			        	value="";
			           			        	 $('input#tariffRateAmount').validationEngine('showPrompt', 'Please enter valid numeric value.', 'error', 'topRight', true);
			           			        	 return false;
			           			        	 }
			           			        	 else{
			           			        		 $('input#tariffRateAmount').validationEngine('hidePrompt');
			           			        		return true;
			           			        	 }
			                  				}
			                          }
			                      }
				                ]
				},
				editrules:{required:true,
					custom:true,
             		custom_func:function (value, colname){
             			var reg5Number2DecimalPlaces = /^(\+|-)?[0-9]{0,8}(\.[0-9]{1,2})?$/;
            			if($.trim(value)==''){
            				value = $.trim(value);
            				return [false, colname+":No blank spaces are allowed."];
            			} 
            			else{
     			        	 if(!reg5Number2DecimalPlaces.test(value)) {
     			        		value="";
     			        		 return [false, "Please enter valid numeric value."];
     			        	 	}
     			        	 else{
     			          		 $('input#tariffRateAmount').validationEngine('hidePrompt');
     			          		return [true, ""];
     			        	 }
            				}
            			return [true, ""];
             			}
					}
			}
			,  {
				id: 'sourceRateTariffRateAmt',
				name : 'sourceRateTariffRateAmt',
				index : 'sourceRateTariffRateAmt',
				width : 110,
				editable : false,
				editoptions : {
					size : 20
				},
				align: 'right',
				  formatter : 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2,defaultValue:""},				
				editoptions : {
					size : 20
				}
			},
			{
				name : 'sourceRateTariffRateConversionCode',
				index : 'sourceRateTariffRateConversionCode',
				width : 110,
				editable : false,
				editoptions : {
					size : 20
				}
			},{
				name : 'xCopy',
				width : 110,
				editable : false,
				formatter : linkFormat,
				
			},
			{
				name : 'actions',
				index : 'actions',
				width : 80,
				align : "center",
				editable : false,
				search : false,
				sortable : true,
				formatter : 'actions',
				formatoptions : {
					keys : false
			}},
			
			{ 
				id: 'isInValidRange',
				name : 'isInValidRange',
				index : 'isInValidRange',
				width : 2,
				
				hidden : true
				
			}
			
			];
			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "tariffRateAmountId"
			};

			function linkFormat(cellvalue, options, rowObject ){
				var rateID=$("#rateDescId").val();
				var tariffRateId=rowObject.tariffRateAmountId;
				var exitflag="Y";
				var currentFuture = $('#isCurrentFuture').val(); 
				if(currentFuture==true || currentFuture=='true' || currentFuture=='Y'){
					currentFuture='Y';
				}
				else{
					currentFuture='N';
				}
				if(rateID!=null && rateID!="" && tariffRateId!=null && tariffRateId!=""){
					if(_displayonly || _displayonly==true || _displayonly=="true"){
						return "XCopy";
					}
					else{
						return '<a href="../../copyCustomerRate/showForm?tariffRateDescriptionId='+ rateID +  '&tariffRateAmountId=' + rowObject.tariffRateAmountId +'&screenName='+screenName+'&exit='+exitflag+'&currentFuture='+currentFuture+'">xCopy</a>';
					}
				}
				else{
					return "XCopy";
				}
			}
			var multidelete=true;
			var multiselect=true;
			var inlineAdd=true;
			if (_displayonly) {
				multidelete=false;
				multiselect=false;
				inlineAdd=false;
			}
			var defaultHidden=false;
			var custCharge=$('#isCustomerCharge').val();
			var frtCharge=$('#isFreightPayableCharge').val();
			var custChargeExpand=$('#expandCustomerCharge').val();
			
			var rateID=$("#rateDescId").val();
			var grpType=$('#grpType').val();
			if(rateID!=null && rateID!=''){
				
				if((frtCharge=='false' ||frtCharge==false)  && (custCharge =='true' || custCharge==true)){
					if(grpType=='03' || grpType=='07'){
						defaultHidden=false;
					}
				}
				else if(grpType=='03' || grpType=='07'){
					//FIX: TT#D025667
					if($('#dispFrtPayRateGrid').val()=='true' || $('#dispFrtPayRateGrid').val()==true){
						defaultHidden=true;
					}
				}
			}
//			if(custChargeExpand!="true"){
//				defaultHidden=true;
//			}
			$('#customerRateGrid').gatesGrid({
				caption: "Customer Rate",
				colNames: colNames,
				colModel: colModel,
				jsonReader: jsonReader,
				pager: '#customerRatePager',
				rowNum: 3,
				rowList: [3,10,30,100],
				height: 100,
				multiselect:multiselect,
				autowidth: false,
				rownumbers: true,
				hiddengrid:defaultHidden,
				hoverrows:false,
				
				gatesOptions: {
					rowColorBasedOnStatus:true,
					urls: {load: _context+'/tm/traiffRate/loadCustomerRates',add : _context+'/tm/traiffRate/addCustomerRates', delMultiple: _context+'/tm/traiffRate/deleteCustomerRates'},
					controls: {
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete: multidelete,
						inlineAdd: inlineAdd, //- hideCustomAddRow
						inlineEdit: false, //- hideEdit
						inlineDelete: false //- hideDelete
					},
					loadComplete: customerGridLoadComplete,
					gridComplete: function() {
					    var rows = $("#customerRateGrid").getDataIDs(); 
					    for (var i = 0; i < rows.length; i++) {
					        var status = $("#customerRateGrid").getCell(rows[i],"status");
					        if(status == "C"){          
					            $("#customerRateGrid").jqGrid('setRowData',rows[i],false, {background:'#f3f3f3'});            
					        }
					    }
					},
				},
				afterInsertRow: function(rowid, aData) {  //set condiditonal formatting
					if(rowid==null){
						custRateadded=true;
					}
		        },
		      
		        onSelectRow: function(rowid,status,e){ 
		        	var cusRateIdsSel = jQuery("#customerRateGrid").getGridParam('selarrrow');
					var frtRateIdsSel = jQuery("#frtPayRateGrid").getGridParam('selarrrow');
					var cusRateIdsSelLen=0;
					var frtRateIdsSelLen=0;
					if (cusRateIdsSel!=undefined){
						cusRateIdsSelLen=cusRateIdsSel.length;
					}
					if (frtRateIdsSel!=undefined){
						frtRateIdsSelLen=frtRateIdsSel.length;
					}
		        	if((cusRateIdsSelLen + frtRateIdsSelLen) > 0){
		        		if(!_displayonly){
		        			$('#rateXCopy').removeAttr("disabled");
		        		}
		        	}
		        	else{
		        		$('#rateXCopy').attr("disabled","disabled");	
		        	}
		        	
		        	var rows = $("#customerRateGrid").getDataIDs(); 
				    for (var i = 0; i < rows.length; i++) {
				        var status = $("#customerRateGrid").getCell(rows[i],"status");
				        if(status == "C"){          
				            $("#customerRateGrid").jqGrid('setRowData',rows[i],false, {background:'#f3f3f3'});   
				        }
				        if(status == "E"){          
				            $("#customerRateGrid").jqGrid('setRowData',rows[i],false, {background:'#FFBABA'});     
				        }
				        if(status == "F"){          
				            $("#customerRateGrid").jqGrid('setRowData',rows[i],false, {background:'#F1EA00'}); 
				        }
				    }
		         },
			});
			$('#gbox_customerRateGrid #del_customerRateGrid').click(function() {
			
				if(somethingChanged == true || somethingChanged == 'true')
					{
					
						somethingChanged=true;
					}
				else if (somethingChanged == false || somethingChanged == 'false') 
					{
					
						somethingChanged=false;
					}
			  });
			$('#gbox_customerRateGrid #sData').click(function() {
				  somethingChanged=true;
			  });
		  $("#pg_customerRatePager").click(function() {
			  somethingChanged=false;
		  });
		  
});
// Frt Payable Rate Grid
$(function() {
	var screenName='1';
			var colNames=['Id', 'Status', 'Seq No.','Effective Date', 'Expiration Date', 'Rate','Source Rate Amount','Source Rate Basis', 'Carrier', 'Base Rate', 'Adjust Factor','Adjust Type', 'xCopy','isInValidRange'];
			var colModel = [ {
				name : 'frtPayableRateAmountId',
				index : 'frtPayableRateAmountId',
				width : 50,
				editable : false,
				hidden : true,
				editoptions : {
					readonly : true,
					size : 10
				},
				hidden : true
			},{
				name : 'status',
				index : 'status',
				width : 50,
				editable : false,
				editoptions : {
					size : 20
				},
				formatter : 'showlink',
				formatoptions : {
					baseLinkUrl : "javascript:",
					showAction: "editFrtRateGrid('",
					addParam: "');" 
				}
			}, {
				name : 'tariffRatePayableAmountId',
				index : 'tariffRatePayableAmountId',
				width : 40,
				editable : false,
				editoptions : {
					readonly : true,
					size : 10
				},
			},
			{
				name : 'effectiveDateStr',
				index : 'effectiveDateStr',
				width : 90,				
				editable : false,
				editoptions : {
					size : 20
				},
				formatter :'date',
				formatoptions :{
					srcformat:'Y-m-d', 
					newformat:'m-d-Y',
					}
			}, {
				name : 'expirationDateStr',
				index : 'expirationDateStr',
				width : 90,
				editable : false,
				editoptions : {
					size : 20
				},
				formatter :'date',
				formatoptions :{
					srcformat:'Y-m-d', 
					newformat:'m-d-Y',
					}
			}, {
				name : 'frtPayableRateAmount',
				index : 'frtPayableRateAmount',
				width : 100,
				editable : false,
				editoptions : {
					size : 20
				},
				align: 'right',
				formatter: 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2},				
				editoptions : {
					size : 20
				}
			},  {
				id: 'sourceRateTariffRateAmt',
				name : 'sourceRateTariffRateAmt',
				index : 'sourceRateTariffRateAmt',
				width : 70,
				editable : false,
				editoptions : {
					size : 20
				},
				align: 'right',
				  formatter : 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2,defaultValue:""},				
				editoptions : {
					size : 20
				}
			}, {
				name : 'sourceRateTariffRateConversionCode',
				index : 'sourceRateTariffRateConversionCode',
				width : 70,
				editable : false,
				editoptions : {
					size : 20
				}
				
				
			},{
				name : 'carrierCode',
				index : 'carrierCode',
				width : 60,
				editable : false,
				editoptions : {
					size : 20
				}
			}, {
				name : 'baseRateAmount',
				index : 'baseRateAmount',
				width : 80,
				editable : false,
				align: 'right',
				formatter: 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2},				
				editoptions : {
					size : 20
				}
			},{
				name : 'rateAdjustmentAmount',
				index : 'rateAdjustmentAmount',
				width : 80,
				editable : false,
				align: 'right',
				formatter: 'number',
				formatoptions: {decimalSeparator: ".", thousandsSeparator: ",", decimalPlaces: 2},				
				editoptions : {
					maxlength: 8,
					size : 20
				}
			}, {
				name : 'rateAdjustmentUnitCode',
				index : 'rateAdjustmentUnitCode',
				width : 55,
				editable : false,
				editoptions : {
					size : 20
				}
			},
			{
				name : 'xCopy',
				width : 50,
				formatter : linkFormat
			}
			,{
				name : 'isInValidRange',
				index : 'isInValidRange',
				width : 20,
				hidden: true
			},
			];
				function linkFormat( cellvalue, options, rowObject ){
				var rateID=$("#rateDescId").val();
				var exitflag="Y";
				var currentFuture = $('#isCurrentFuture').val(); 
				var wholeFlag=document.getElementById('roundToNearestDollar1').checked;
				if(_displayonly || _displayonly==true || _displayonly=="true"){
					return "XCopy";
				}
				else{
					return '<a href="../../copyFrtPayableRate/showForm?tariffRateDescriptionId='+ rateID + '&frtPayableRateAmountId=' + rowObject.frtPayableRateAmountId + "&screenName="+screenName+"&exit="+exitflag+"&wholeFlag="+wholeFlag+'&isCurrentFuture='+currentFuture+'">xCopy</a>';
				}
			}
			var jsonReader = {
					root : "rows",
					page : "page",
					total : "total",
					records : "records",
					repeatitems : false,
					cell : "cell",
					id : "frtPayableRateAmountId"
				};
			var multidelete=true;
			var multiselect=true;
			if (_displayonly) {
				multidelete=false;
				multiselect=false;
			}
			var defaultHidden=false;
/*			var frtCharge=$('#isFreightPayableCharge').val();
			var tariffgrpType = $('#grpType').val();
			var expandFreightPayableCharge=$('#expandFreightPayableCharge').val();
			var rateID=$("#rateDescId").val();
			if(expandFreightPayableCharge!="true" && (rateID==null &&  rateID==''))
			{
					defaultHidden=true;
			}
*//*			else if(rateID!=null &&  rateID!=''){
					if(grpType=='07'){
						defaultHidden=true;
					}
			}*/
			$('#frtPayRateGrid').gatesGrid({
				caption: "Payable Rates",
				colNames: colNames,
				colModel: colModel,
				jsonReader: jsonReader,
				pager: '#frtPayRatePager',
				rowNum: 10,
				rowList: [10,20,30,100],
				height: 250,
				multiselect:true,
				autowidth: false,
				rownumbers: false,
				hiddengrid:defaultHidden,
				hoverrows:false,
				gatesOptions: {
					rowColorBasedOnStatus:true,
					urls: {load: _context+'/tm/traiffRate/loadFrtPayableRates',add : _context+'/tm/traiffRate/addFrtPayableRates', delMultiple: _context+'/tm/traiffRate/deleteFrtPayableRates'},
					controls: {
						navBarAdd: false,
						navBarEdit: false,
						navBarDelete: multidelete,
						inlineAdd: false, //- hideCustomAddRow
						inlineEdit: false, //- hideEdit
						inlineDelete: false //- hideDelete
					},
					loadComplete:frtGridComplete,
					gridComplete: function() {
					    var rows = $("#frtPayRateGrid").getDataIDs(); 
					    for (var i = 0; i < rows.length; i++) {
					        var status = $("#frtPayRateGrid").getCell(rows[i],"status");
					        if(status == "C"){          
					            $("#frtPayRateGrid").jqGrid('setRowData',rows[i],false, {background:'#f3f3f3'});            
					        }
					    }
					},
				},
		        onSelectRow: function(rowid,status,e){ 
		        	var cusRateIdsSel = jQuery("#customerRateGrid").getGridParam('selarrrow');
					var frtRateIdsSel = jQuery("#frtPayRateGrid").getGridParam('selarrrow');
					var cusRateIdsSelLen=0;
					var frtRateIdsSelLen=0;
					if (cusRateIdsSel!=undefined){
						cusRateIdsSelLen=cusRateIdsSel.length;
					}
					if (frtRateIdsSel!=undefined){
						frtRateIdsSelLen=frtRateIdsSel.length;
					}
					if((cusRateIdsSelLen + frtRateIdsSelLen) > 0){
						if(!_displayonly){
							$('#rateXCopy').removeAttr("disabled");
						}
					}
					else{
						$('#rateXCopy').attr("disabled","disabled");	
					}
					var rows = $("#frtPayRateGrid").getDataIDs(); 
				    for (var i = 0; i < rows.length; i++) {
				        var status = $("#frtPayRateGrid").getCell(rows[i],"status");
				        if(status == "C"){          
				            $("#frtPayRateGrid").jqGrid('setRowData',rows[i],false, {background:'#f3f3f3'});   
				        }
				        if(status == "E"){          
				            $("#frtPayRateGrid").jqGrid('setRowData',rows[i],false, {background:'#FFBABA'});     
				        }
				        if(status == "F"){          
				            $("#frtPayRateGrid").jqGrid('setRowData',rows[i],false, {background:'#F1EA00'}); 
				        }
				    }
		         },
			});	
			$('#gbox_frtPayRateGrid #del_frtPayRateGrid').click(function() {
				
				if(somethingChanged == true || somethingChanged == 'true')
					{
					
						somethingChanged=true;
					}
				else if (somethingChanged == false || somethingChanged == 'false') 
					{
					
						somethingChanged=false;
					}
			  });
			$('#gbox_frtPayRateGrid #sData').click(function() {
				  somethingChanged=true;
			  });
		  $("#pg_frtPayRatePager").click(function() {
			  somethingChanged=false;
		  });
});
var customerGridLoadComplete = function(){
	//alert("freightGridLoadComplete");
	var customerGridCount = $("#customerRateGrid").getGridParam("reccount");
	//var rateId=$('#rateDescId').val();
	 $('#customerRatePager .ui-pg-input').attr("readonly", true);
	 if(customerGridCount==0){	
			//$('#effectiveDateStr').val($('#effectiveDate').val());
			$('table[aria-labelledby="gbox_customerRateGrid"] thead tr[id="tr_tariffRateAmountId"]').show();
			somethingChanged=false;
		}	
		else
		{
			$('table[aria-labelledby="gbox_customerRateGrid"] thead tr[id="tr_tariffRateAmountId"]').hide();
			//somethingChanged=true;
			
		}
	 var rowIDs = jQuery("#customerRateGrid").getDataIDs();
	 for (var i=0;i<rowIDs.length;i=i+1)
    { 
      var rowData=jQuery("#customerRateGrid").getRowData(rowIDs[i]);
      var id=rowIDs[i];
      
      if((rowData.isInValidRange == 'true' || rowData.isInValidRange == true)) { 
   	   var columns = jQuery("#"+ id + " td",jQuery('#customerRateGrid'));
			for(var j = 0; j < columns.length ; j++)//3
			{
				var tdElement = columns[j];
				if($(tdElement).attr("aria-describedby")=='customerRateGrid_sourceRateTariffRateAmt')
				{
					$(tdElement)
					.html('******');
				}
				if((rowData.isRateBasisValid == 'false' || rowData.isRateBasisValid == false)) { 
					if($(tdElement).attr("aria-describedby")=='customerRateGrid_sourceRateTariffRateConversionCode')
					{
						$(tdElement)
						.html('*');
					}
				}
			}
      } 
      
	// Hides blank row on grid creation as readonly parameter is false to include form error row 
	$('table[aria-labelledby="gbox_freightGrid"] thead tr[id="tr_seqNo"]').hide();
	//Hides Error row on grid reload
	$('table[aria-labelledby="gbox_freightGrid"] thead tr[id="FormError"] td').html("");
	$('table[aria-labelledby="gbox_freightGrid"] thead tr[id="FormError"]').hide();

    //  $("#gridIdForParties").jqGrid ('getCell',rowIDs[i] , ).hide();

    }
	
};


var frtGridComplete = function()
{
	 $('#frtPayRatePager .ui-pg-input').attr("readonly", true);

	 var rowIDs = jQuery("#frtPayRateGrid").getDataIDs();
	 for (var i=0;i<rowIDs.length;i=i+1)
     { 
       var rowData=jQuery("#frtPayRateGrid").getRowData(rowIDs[i]);
       var id=rowIDs[i];
       var sorceVal = rowData[6];
    
       if((rowData.isInValidRange == 'true' || rowData.isInValidRange == true)) { 
    	   var columns = jQuery("#"+ id + " td",jQuery('#frtPayRateGrid'));
			for(var j = 0; j < columns.length ; j++)//3
			{
				var tdElement = columns[j];
				if($(tdElement).attr("aria-describedby")=='frtPayRateGrid_sourceRateTariffRateAmt')
				{
					$(tdElement)
					.html('******');
				}
				if((rowData.isRateBasisValid == 'false' || rowData.isRateBasisValid == false)) { 
					if($(tdElement).attr("aria-describedby")=='frtPayRateGrid_sourceRateTariffRateConversionCode')
					{
						$(tdElement)
						.html('*');
					}
				}
			}
       } 
     }
};
function editCustomerRateGrid(id) {
	var seqNo = id.split('=')[1];
	showEditCustomerRateDialog(seqNo);
}
function editFrtRateGrid(id) {
	var seqNo = id.split('=')[1];
	showEditFrtRateDialog(seqNo);
}
function isNumber(n) {
	  if(n !=null && n !=' '){
	    var index = n.indexOf(".");
	    if(index >0){
	          var lastdigits=n.substring(index+1,n.length);
	          if( lastdigits !='' && lastdigits.length >2 ) return false;
	    }
	  }


	  return !isNaN(parseFloat(n)) && isFinite(n);
}
function stripCommas(str) {
	  if(str=='' || str== null) return '';
	  return str.replace(/,/g, '');
}
//Numeric only control handler
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function () {
                    $(this).keydown(function (e) {
                        var key = (e.which) ? e.which : e.keyCode;
                        //alert(key+".."+e.ctrlKey);
                        if (!e.shiftKey && !e.altKey &&
                        // numbers
                            (key >= 48 && key <= 57) ||
                        // Numeric keypad
                            (key >= 96 && key <= 105) ||
                        // comma, period and minus, . on keypad
                           key == 190 || key == 188|| key == 189 || key == 109 || key == 110 ||
                        // Backspace and Tab and Enter
                           key == 8 || key == 9 || key == 13 ||
                        // Home and End
                           key == 35 || key == 36 ||
                        // left and right arrows
                           key == 37 || key == 39 ||
                        // Del and Ins
                           key == 46 || key == 45 ||
                         //  a , v to use with ctrl
                           (e.ctrlKey &&  key >= 65))
                            return true;

                        return false;
                    });

             });
};
function formatDollar(num) {
    negative = 1;
    if(num < 0){
      negative = -1;
      num = (-1)*num;
    }
    var p = num.toFixed(2).split(".");
    var chars = p[0].split("").reverse();
    var newstr = '';
    var count = 0;
    for (x in chars) {
        count++;
        if(count%3 == 1 && count != 1) {
            newstr = chars[x] + ',' + newstr;
        } else {
            newstr = chars[x] + newstr;
        }
    }
    finalStr = newstr + "." + p[1];
    if(negative < 0){
         finalStr = "-"+finalStr;
    }
    return finalStr;
}

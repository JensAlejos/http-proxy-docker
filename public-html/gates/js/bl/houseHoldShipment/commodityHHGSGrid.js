var readOnlyCommodityHHGSGrid = false;
var readOnlyClauses = false;
$(document).ready(
		function() {
			/*var colNamesForCommodity = ['','','','','','','#','', 'Seq','Status', 'P/C', 'Bill To ','','Pcs','GBL#', 'Name','Net Wgt ','Cube ','Tariff','Item','L/D Svc','PLR','PLD',''];
			var colModelForCommodity = [ 
			                            {name:'shipmentBillToAddressRoleName', index:'shipmentBillToAddressRoleName', hidden:true, editable: false },
			                            {name:'shipmentAddress', index:'shipmentAddress', hidden:true, editable: false },
			                            {name:'city', index:'city', hidden:true, editable: false },
			                            {name:'state', index:'state', hidden:true, editable: false },
			                            {name:'zip', index:'zip', hidden:true, editable: false },
			                            {name:'shipmentId', index:'shipmentId', hidden:true, editable: false },
			                            {name:'commoditySeqNumber', index:'commoditySeqNumber', width:15, editable: false },
			                             {name:'householdGoodsSequenceNbr', index:'householdGoodsSequenceNbr', width:5,editable:false, hidden:true, formatter:'integer'},
			                             //{name:'shipmentBillToIsOneTimeCustomer', index:'shipmentBillToIsOneTimeCustomer', width:10,editable:false, hidden:true},
			                             
			                             {name:'shipmentSeqNumber', index:'shipmentSeqNumber', width:26, editable: false, formatter:(isMaintainBillDisplay==true?'showlink': 'formatLink'), formatoptions : {
				                   				baseLinkUrl : "javascript:",
				                				showAction: "moveToMaintainShipment('",
				                				addParam: "');" } },
			                             {name:'shipmentStatusCode', index:'shipmentStatusCode',width:35, editable:false, hidden:false
				                               }, 
			                             {name:'shipmentResponsiblePartyCode', index:'shipmentResponsiblePartyCode',width:25, editable:false,
				                            	   
			                             }, 
			                              {name:'shipmentBillToAddressRoleNamewthoutAbbr', index:'shipmentBillToAddressRoleNamewthoutAbbr', width:134, editable:false, formatter:(isMaintainbillhhgdsUpdate==true?'conditionlShowLink': 'formatLink'), formatoptions : {
			                   
	                                        	
			                            	  baseLinkUrl : "javascript:",
				                				showAction: "editHHGSCommodity('",
				                				addParam: "');" },
				                				cellattr: function (rowId, val, rawObj, cm, rdata)
	                                        	{
		                                    
	                                        	return 'title="' +' ' + rawObj.shipmentAddressRoleName +" " + rawObj.shipmentAddress+" "+ rawObj.city+" "+ rawObj.state+rawObj.zip + '"';
	                                        	}
	                                        	}},
				                				
			                              {name:'shipmentAddressRoleId', index:'shipmentAddressRoleId',  editable:false,hidden:true},
			                              {name:'commodityPcs', index:'commodityPcs', width:47, editable: false,hidden:false},
			                              {name:'gblNumber', index:'gblNumber', width:84, editable: false,hidden:false},
			                              {name:'householdGoodsMarkForName', index:'householdGoodsMarkForName', width:104, hidden:false,editable: false},
			                               {name:'weight', index:'weight', width:60, hidden:false,editable: false, formatter : weightFormatter},
			                               {name:'cube', index:'cube', width:60, editable:false ,formatter : weightFormatter},
			                               {name:'tariff', index:'tariff', width:46, editable:false},
			                               {name:'item', index:'item', width:52, editable:false},
			                               {name:'loadDschServc', index:'loadDschServc', width:40, editable:false},
			                               {name:'placeOfReceipt', index:'placeOfReceipt', width:30, editable:false},
			                               {name:'placeOfDelivery', index:'placeOfDelivery', width:39, editable:false},
			           	                   {name:'edit', index:'edit', width:25, editable:false, formatter:'actions'}
			                               ];
			jQuery.extend($.fn.fmatter,
					{
				conditionlShowLink : function(cellvalue,
								options, rowdata) {
					if(rowdata.householdGoodsSequenceNbr!=null){
						return '<a href="javascript:editHHGSCommodity('+rowdata.householdGoodsSequenceNbr.toString()+
						')" style="text-decoration:underline;" >'+cellvalue+'</a>';
					}else{
						
						return cellvalue;
					}
				}
						});
			
			function showlinkHHGDS(cellvalue,
					options, rowdata){
				
				jQuery.extend($.fn.fmatter,
						{
					showLink : function(cellvalue,
					options, rowdata){
						return cellvalue;
					}
						});
			}
				
			var jsonReaderContainer = {
											root:"rows",
											page:"page",
											total:"total",
											records:"records", 
											cell:"cell",
											repeatitems:false,
											id:"householdGoodsSequenceNbr"
						               };
	
			

			createGrid("commodityHHGS", "commodityHHGSPager",
					'../houseHoldShipment/loadCommodityGrid',
					'', '', 
					'../houseHoldShipment/deleteCommodityGrid',
					'',
					colNamesForCommodity, colModelForCommodity, "Containers", 
					"auto", 10, [ 10, 20, 30 ],false, false, false, readOnlyCommodityHHGSGrid,
					jsonReaderContainer,true,(isMaintainbillhhgdsDelete==true?false:true),false,false,false,false,false,false,commodityHHGSLoadComplete,false,false);
			
			*/
	});

function createCommodityHHGSGrid(){
	
	var colNamesForCommodity = ['','','','','','','#','', 'Seq','Status', 'P/C', 'Bill To ','','Pcs','GBL#', 'Name','Net Wgt ','Cube ','Tariff','Item','L/D Svc','PLR','PLD',''];
	var colModelForCommodity = [ 
	                            {name:'shipmentBillToAddressRoleName', index:'shipmentBillToAddressRoleName', hidden:true, editable: false },
	                            {name:'shipmentAddress', index:'shipmentAddress', hidden:true, editable: false },
	                            {name:'city', index:'city', hidden:true, editable: false },
	                            {name:'state', index:'state', hidden:true, editable: false },
	                            {name:'zip', index:'zip', hidden:true, editable: false },
	                            {name:'shipmentId', index:'shipmentId', hidden:true, editable: false },
	                            {name:'commoditySeqNumber', index:'commoditySeqNumber', width:15, editable: false },
	                             {name:'householdGoodsSequenceNbr', index:'householdGoodsSequenceNbr', width:5,editable:false, hidden:true, formatter:'integer'},
	                             //{name:'shipmentBillToIsOneTimeCustomer', index:'shipmentBillToIsOneTimeCustomer', width:10,editable:false, hidden:true},
	                             
	                             {name:'shipmentSeqNumber', index:'shipmentSeqNumber', width:26, editable: false, formatter:(isMaintainBillDisplay==true?'showlink': 'formatLink'), formatoptions : {
		                   				baseLinkUrl : "javascript:",
		                				showAction: "moveToMaintainShipment('",
		                				addParam: "');" } },
	                             {name:'shipmentStatusCode', index:'shipmentStatusCode',width:35, editable:false, hidden:false
		                               }, 
	                             {name:'shipmentResponsiblePartyCode', index:'shipmentResponsiblePartyCode',width:25, editable:false,
		                            	   
	                             }, 
	                              {name:'shipmentBillToAddressRoleNamewthoutAbbr', index:'shipmentBillToAddressRoleNamewthoutAbbr', width:134, editable:false, formatter:(isMaintainbillhhgdsUpdate==true?'conditionlShowLink': 'formatLink'), formatoptions : {
	                   
                                    	
	                            	 /* baseLinkUrl : "javascript:",
		                				showAction: "editHHGSCommodity('",
		                				addParam: "');" },*/
		                				cellattr: function (rowId, val, rawObj, cm, rdata)
                                    	{
                                    
                                    	return 'title="' +' ' + rawObj.shipmentAddressRoleName +" " + rawObj.shipmentAddress+" "+ rawObj.city+" "+ rawObj.state+rawObj.zip + '"';
                                    	}
                                    	}},
		                				
	                              {name:'shipmentAddressRoleId', index:'shipmentAddressRoleId',  editable:false,hidden:true},
	                              {name:'commodityPcs', index:'commodityPcs', width:47, editable: false,hidden:false},
	                              {name:'gblNumber', index:'gblNumber', width:84, editable: false,hidden:false},
	                              {name:'householdGoodsMarkForName', index:'householdGoodsMarkForName', width:104, hidden:false,editable: false},
	                               {name:'weight', index:'weight', width:60, hidden:false,editable: false, formatter : weightFormatter},
	                               {name:'cube', index:'cube', width:60, editable:false ,formatter : weightFormatter},
	                               {name:'tariff', index:'tariff', width:46, editable:false},
	                               {name:'item', index:'item', width:52, editable:false},
	                               {name:'loadDschServc', index:'loadDschServc', width:40, editable:false},
	                               {name:'placeOfReceipt', index:'placeOfReceipt', width:30, editable:false},
	                               {name:'placeOfDelivery', index:'placeOfDelivery', width:39, editable:false},
	           	                   {name:'edit', index:'edit', width:25, editable:false, formatter:'actions'}
	                               ];
	jQuery.extend($.fn.fmatter,
			{
		conditionlShowLink : function(cellvalue,
						options, rowdata) {
			if((rowdata.householdGoodsSequenceNbr!=null && readOnlyCommodityHHGSGrid == false) 
					&&(rowdata.shipmentStatusCode!='ISSUED' && rowdata.shipmentStatusCode!='CORRECTED' )){
				return '<a href="javascript:editHHGSCommodity('+rowdata.householdGoodsSequenceNbr.toString()+
				')" style="text-decoration:underline;"'+' title="'+' '+rowdata.shipmentAddress+'" >'+cellvalue+'</a>';
			}else{
				
				return '<span title="'+' '+rowdata.shipmentAddress+'" >'+cellvalue+'</span>';
			}
		}
				});
	
	function showlinkHHGDS(cellvalue,
			options, rowdata){
		
		jQuery.extend($.fn.fmatter,
				{
			showLink : function(cellvalue,
			options, rowdata){
				return cellvalue;
			}
				});
	}
	
	var jsonReaderContainer = {
									root:"rows",
									page:"page",
									total:"total",
									records:"records", 
									cell:"cell",
									repeatitems:false,
									id:"commoditySeqNumber"
				               };

	
	
	
	createGrid("commodityHHGS", "commodityHHGSPager",
			'../houseHoldShipment/loadCommodityGrid',
			'', '', 
			'../houseHoldShipment/deleteCommodityGrid',
			'',
			colNamesForCommodity, colModelForCommodity, "Drops", 
			"auto", 10, [ 10, 20, 30 ],false, false, false, readOnlyCommodityHHGSGrid,
			jsonReaderContainer,true,(isMaintainbillhhgdsDelete==true?false:true),false,false,false,false,false,false,commodityHHGSLoadComplete,false,false);
}

function weightFormatter( cellvalue, options, rowObject){
	if ($('#measurementSourceHHGS').text()=="I" ){
	       var a=cellvalue.indexOf(".");
				 if(a>=0) {
				  var finalValue1=cellvalue.substring(0,a);
				  return finalValue1;
	                 }
		  
	}else{
		return cellvalue;
	}
	
}
function commodityHHGSLoadComplete(){
	
	if($("#commodityHHGS").getGridParam("reccount")==0){
		
		$('#percentageCommodityGridTotal').text("");
		$('#commodityGridTotal').text("");
	}else{
		
		var allIds = $('#commodityHHGS').jqGrid('getDataIDs');
	
		var sumOfWeights = "0.0";
		var sumOfCube ="0.0";
		var perceOfWeights = "0.0";
		var perceOfCube ="0.0";
		var sumOfWt="0.0";
		var sumOfCb="0.0";
		var decimalIndex;

		//var seqNumber = '';
		for (var i = 0; i < allIds.length; i++) {
			sumOfWeights = String(parseFloat(sumOfWeights) + parseFloat(jQuery("#commodityHHGS").getRowData(allIds[i]).weight));
			sumOfCube =String(parseFloat(sumOfCube) + parseFloat(jQuery("#commodityHHGS").getRowData(allIds[i]).cube));
            var status = jQuery("#commodityHHGS").getRowData(allIds[i]).shipmentStatusCode;
            var isDeletable ='false';
			if(status == "PENDING" || status == "RATED" || status == "DESCRIBED" || status == "IN AUDIT"){
			    isDeletable = 'true';
			}else {
			    isDeletable = 'false';
			}
			//if(seqNumber == jQuery("#commodityHHGS").getRowData(allIds[i]).shipmentSeqNumber){
			   if(status == "F/C PENDING" || status == "F/C RATED" || status == "F/C DESCRIBED" || status == "F/C AUDIT"){
			      isDeletable = 'true';
			   }
			//}else{
			//    seqNumber = jQuery("#commodityHHGS").getRowData(allIds[i]).shipmentSeqNumber;
			//}

			if(isDeletable == 'false'){
			   $($("div.ui-pg-div.ui-inline-del")[i], "#"+$('#commodityHHGS').jqGrid('getDataIDs')[i]).hide();
			}
	      }
		sumOfWeights = format_number_cube(sumOfWeights);
		sumOfCube = format_number_cube(sumOfCube);
		sumOfWt = format_number_cube($('#totalWeight').val());
		sumOfCb  = format_number_cube($('#totalCube').val());
		if(sumOfWt !="0.0" && sumOfWt!="0.000")
		{
		    perceOfWeights = ((+sumOfWeights)/(+sumOfWt))*100;
		    perceOfWeights = (perceOfWeights).toFixed(1); 
		    /*decimalIndex=perceOfWeights.indexOf(".");
			perceOfWeights = perceOfWeights.substring(0,decimalIndex+2);*/
		}
		else perceOfWeights="";
		
		if(sumOfCb != "0.0" && sumOfCb!="0.000")
		{
			perceOfCube = +((+sumOfCube)/(+sumOfCb))*100;
			perceOfCube = (perceOfCube).toFixed(1);
			/*decimalIndex=perceOfCube.indexOf(".");
			perceOfCube = perceOfCube.substring(0,decimalIndex+2);*/
		}
		else perceOfCube="";
		if(sumOfWeights==sumOfWt && sumOfCube ==sumOfCb && disableRateButtonWhenStdBillExist){
			$('#rate').attr("disabled",false);
			
		}else
			{
				$('#rate').attr("disabled",true);
			}
			if(sumOfWeights!="0.0" && sumOfWeights!="0.000" ) sumOfWeights = (+sumOfWeights).toFixed(0);
			else sumOfWeights="";
			if(sumOfCube!="0.0" && sumOfCube!="0.000") sumOfCube = (+sumOfCube).toFixed(0);
			else sumOfCube="";
		    $('#commodityGridTotal').text(sumOfWeights+" "+" "+sumOfCube);
		    if(perceOfWeights=="" && perceOfCube=="")  $('#percentageCommodityGridTotal').text("");
		    else if (perceOfCube=="" && perceOfWeights!="")    $('#percentageCommodityGridTotal').text(perceOfWeights+"%");
		    else if (perceOfCube!="" && perceOfWeights=="")    $('#percentageCommodityGridTotal').text(" "+perceOfCube+"%");
		    else $('#percentageCommodityGridTotal').text(perceOfWeights+"%"+" "+" "+perceOfCube+"%");
		
		
	}
	
	setCommodityDiv();
	//$(this).find("td").addClass('gridtip');
	/*$.ajax({
		 type:"GET",
		 url:_context+"/houseHoldShipment/loadCommodityGrid",
		 data : {
			 houseHoldGoodSeqNumber :  householdGoodsSequenceNbr
			
			},
		 success: function(responseText){
			 if(responseText.success==true){
				 	var $grid = jQuery("#commodityHHGS");
				 	var rows = $grid[0].rows;
				 	var cRows = rows.length;
				 	for (var i=1;i<cRows ;i++) {
				 		$("#commodityHHGS").setCell(rowid[i],'shipmentAddressRoleName','','',{'title':responseText.data.shipmentAddress +" "+ responseText.data.city+" "+responseText.data.state+" "+responseText.data.zip});
				 	}
			 }
		 }
	});*/
			 
	/*var ids = $('#commodityHHGS').jqGrid('getDataIDs');
	$.ajax({
		 type:"GET",
		 url:_context+"/houseHoldShipment/loadCommodityGrid",
		 data : {
			 houseHoldGoodSeqNumber :  householdGoodsSequenceNbr
			
			},
		 success: function(responseText){
			 if(responseText.success==true){
	
				 var $grid = jQuery("#commodityHHGS");
				 var row ;
				 var rows = $grid[0].rows;
				 var cRows = rows.length;
				 for (var i=1;i<cRows ;i++) {
					 row = rows[i];
					 cellsOfRow = row.cells;
				        var rowData = grid.jqGrid('getRowData',id);
				        $('#'+ cellsOfRow[6],grid[0]).attr('title', responseText.data.shipmentAddress +" "+ responseText.data.city+" "+responseText.data.state+" "+responseText.data.zip);

			 }
		 }
		 }
		});*/
    
   
	
	
	
}

function editHHGSCommodity(id){
	var householdGoodsSequenceNbr =id;
	
	$.ajax({
		 type:"GET",
		 url:_context+"/houseHoldShipment/editCommodity",
		 data : {
			 houseHoldGoodSeqNumber :  householdGoodsSequenceNbr
			
			},
		 success: function(responseText){
			 if(responseText.success==true){
					$('#shipmentAddressLine1').text("");
		        	$('#shipmentCityStateZip').text("");
		        	
					$('#loadServiceCodeHHGS').val("");
					$('#dschServiceCodeHHGS').val("");
				 $('#msgDivCommodityOverlay').html("");
				 $('#shipmentHouseHoldItemForm').clearForm();
				 $('#shipmentHouseHoldItemForm').loadJSON(responseText.data);
				 //alert(responseText.data.shipmentBillToIsOneTimeCustomer);
			 $('#tariffHHGS').val(responseText.data.tariff);
			 $('#shipmentAddressLine1').text(responseText.data.shipmentAddress);
			 $('#shipmentCityStateZip').text(responseText.data.city+" "+responseText.data.state+" "+responseText.data.zip);
			 $('#shipmentCommodityHHGSNos').text(responseText.data.commoditySeqNumber);
			 $("#commodityHHGSOverlay").dialog( "option", "title", 'Update Commodity' );
	           $("#commodityHHGSOverlay").dialog('open');
			 commodityHHGSMode ="editHHGSCommodity";
			 $('#separateBill').val("N");
	        $('#separateBill').prop("disabled", true);
			 //tabSequence('#shipmentHouseHoldItemForm');
			 //$(":button:contains('Ok & New')").prop("disabled", true).removeClass("ui-state-disabled");
			 if ($('#measurementSourceHHGS').text()=="I" ){
			       var a=$('#weight').val().indexOf(".");
						 if(a>=0) {
						  var finalValue1=$('#weight').val().substring(0,a);
						  $('#weight').val(finalValue1);
			                 }
				   var b=$('#cube').val().indexOf(".");
					     if(b>=0) {
						  var finalValue2=$('#cube').val().substring(0,b);
						  $('#cube').val(finalValue2);
			                 } 		 
			
			
			}
			 
			 $('#shipmentAddressRoleName').focus();
		 }
		 }
	});
}

function  moveToMaintainShipment(id){
	var gridId = id.split('=')[1];
var reccountContainerGrid = $('#commodityHHGS').jqGrid('getDataIDs');
	
	for (var i = 0; i < reccountContainerGrid.length; i++) {
	if((jQuery("#commodityHHGS").getRowData( $('#commodityHHGS').jqGrid('getDataIDs')[i]).shipmentId =="")|| 
			(jQuery("#commodityHHGS").getRowData( $('#commodityHHGS').jqGrid('getDataIDs')[i]).shipmentId == null)){
		alert("Please save the Bill..All the unsaved Changes will be discarded.");
		return false;
	}
	}
	var shipmentSequenceNumber = jQuery("#commodityHHGS").getRowData(gridId).shipmentSeqNumber;
	var shipment_number = $("#shipmentNumber").val();
	var shipmentCorrectionNumber ="000";
	
	var url ="";
	url = "/shipment/showForm?shipment_number="+shipment_number+"&shipment_sequence_number="+shipmentSequenceNumber+
	"&shipment_correction_number="+shipmentCorrectionNumber+"&src=FTWQ";
	window.location = _context + url;

}
	

var getColumnIndexByName = function(grid,columnName) {
	var cm = $("#commodityGrid").jqGrid('getGridParam','colModel');
	for (var i=0,l=cm.length; i<l; i++) {
	    if (cm[i].name===columnName) {
	        return i;
	    }
	}
	return -1;
	};
	
	function format_number_cube(number){
		pnumber = number;
		decimals=3;
		    if (isNaN(pnumber)) { return 0};
		    if (pnumber=='') { return 0};
		     
		    var snum = new String(pnumber);
		    var sec = snum.split('.');
		    var whole = parseFloat(sec[0]);
		    var result = '';
		     
		    if(sec.length > 1){
		        var dec = new String(sec[1]);
		        dec = String(parseFloat(sec[1])/Math.pow(10,(dec.length - decimals)));
		        dec = String(whole + Math.round(parseFloat(dec))/Math.pow(10,decimals));
		        var dot = dec.indexOf('.');
		        if(dot == -1){
		            dec += '.'; 
		            dot = dec.indexOf('.');
		        }
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    } else{
		        var dot;
		        var dec = new String(whole);
		        dec += '.';
		        dot = dec.indexOf('.');     
		        while(dec.length <= dot + decimals) { dec += '0'; }
		        result = dec;
		    }   
		   return result;
		
	}

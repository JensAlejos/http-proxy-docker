$(document).ready(function() { 
	
	//validations
	 $("#documentForm").validationEngine('attach');
	 
	 $("#fromDateInString").datepicker({
	        dateFormat: 'MM yy',
	        changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,

	        onClose: function(dateText, inst) {
	            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	            $(this).val($.datepicker.formatDate('yy-mm', new Date(year, month, 1)));
	        }
	    });

	    $("#fromDateInString").focus(function () {
	        $(".ui-datepicker-calendar").hide();
	        $("#ui-datepicker-div").position({
	            my: "center top",
	            at: "center bottom",
	            of: $(this)
	        });
	    });
	    $(".ui-datepicker-month").change(function(){
	    	 var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	         var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	         $("#fromDateInString").val($.datepicker.formatDate('yy-mm', new Date(year, month, 1)));
	    });
	    $(".ui-datepicker-year").change(function(){
	    	 var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
	         var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
	         $("#fromDateInString").val($.datepicker.formatDate('yy-mm', new Date(year, month, 1)));
	    });
	 
	/* $( "#fromDateInString" ).datepicker({ 
		 	changeMonth: true,
	        changeYear: true,
	        showButtonPanel: true,
	        dateFormat: 'mm-yy',
	        onClose: function(dateText, inst) { 
	            $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
	        }
		 
	});*/
	// $( "#fromDateInString" ).datepicker('setDate', '+0');
	    $("#fromDateInString").val($.datepicker.formatDate('yy-mm', new Date()));
	 
	 $( "#fromDateInString" ).change(function(){
		 validateDate();
	 });
	 
	 
	$('#Cancel').click(function(){	
		document.location.href = _context+"/welcome.html";
	});	
	
	$('#PrintReport').click(function(){	 
		var selection = "";
		var rowIDs = jQuery("#reportGrid").getDataIDs(); 
		for (var i=0;i<rowIDs.length;i=i+1)
		{ 
			var id = $('#reportGrid').getCell(rowIDs[i], 'id');
			var isSelected =$('#jqg_reportGrid_'+id).attr("checked");
			if(isSelected=="checked")
			{
				selection = selection+id+"|";
			}
		}
		if($('#selectedPrinter').val() == ''){
			alert("Please select a printer");
		}
		else if (selection == ""){
			alert("Please select a document to print");
		}
		
		else{
			var queryString = "selected="+selection+"&printer="+$('#selectedPrinter').val();
			blockUI();
			$.ajax({
				type: "GET",
				url: _context+"/alfresco/print",
				data: queryString,
				success: function(responseText){
					$.unblockUI();
					if(responseText.success)
					{
						alert("Document sent to printer");
					}else if (responseText.messages) {
						var messages = responseText.messages;
						if(messages.info && messages.info.length>0){
							alert(""+messages.info);
						}
						else if(messages.warn && messages.warn.length>0){
							alert(""+messages.warn);
						}
						else if(messages.error && messages.error.length>0){
							alert(""+messages.error);
						}
					}
				},
				error: function(responseText){
					$.unblockUI();
					alert("Error while printing");
				}
			}); 
		}	
	});
	
	$('#clear').click(function(){
		 document.location.href = _context+"/alfresco/reportHistory";
	});

	$('#search').click(function(){
		if($('#reportSelected').val()=="0:0"){
			alert("Please select a report to search documents");
		}
		else if($("#documentForm").validationEngine('validate') && validateDate()){
	    	var formData = "report=" + $("#reportSelected").val()+"&fromMonth="+$( "#fromDateInString" ).val();
	    	$("#reportGrid")[0].clearToolbar(false);
	    	$("#reportGrid").jqGrid('clearGridData');
	    	blockUI();
	    	$.ajax({ 
	    		url : _context +"/alfresco/searchReportHistory", 
	            data: formData,
	            type: 'post',
	            success: function(responseText) {
	            	$.unblockUI();
					if (responseText.success) {
						if (responseText.data.numRows > 0) {
							$("#reportGrid").setGridParam({datatype:'json'}).trigger("reloadGrid",[{page:1}]);
						} else {
							setMessage(responseText);
						}
					}	                
	            },
			 	error: function(responseText){
			 		$.unblockUI();
					alert("Error while retrieving documents.");
				}
	    	});	 			
			
		}
	});
 
	 isRemovable=true;
	 isEditable="showlink";
	 link =  'addToGrid';
	 var jsonReader = {
		root : "rows",
		page : "page",
		total : "total",
		records : "records",
		repeatitems : false,
		cell : "cell",
		id : "id"
	};
	 
	function openDocLink(cellValue, options, rowdata, action) {
 		var url = _context + "/alfresco/openDocument?docId=" + rowdata.documentId ;
 		var reportType = $("#reportSelected").val().split(":")[0];
        return "<A style='text-decoration: underline; color: blue; cursor:pointer;' target='_blank' onclick='javascript:window.open(\"" + url +"\");'>" + reportType + "</A>"
    }

	$('#reportGrid').jqGrid({
		caption: 'Document History',
		url: _context + "/alfresco/loadDocumentHistory",
		datatype : 'local',
		mtype : 'GET',
		colModel : [
			/* { id:'docURL', name : 'docURL', index : 'docURL', label : ' ',width:25, align:'center'}, */
			{ id:'id', name : 'id', index : 'id', label : 'Id',key:true,editable:false,hidden:true},
		    { id:'documentName', name : 'documentName', index : 'documentName', label : 'documentName',editable:false,hidden:true},
			{ id:'documentType', name : 'documentType', index : 'documentType', label : 'Document Type',width:140,editable:false,sortable:false, formatter:openDocLink},
		    { id:'reportDescription', name : 'reportDescription', index : 'reportDescription', label : 'reportDescription',editable:false,hidden:true,sortable:false},
			{ id:'identifier', name : 'identifier', index : 'identifier', label : 'Report',width:180,editable:false,sortable:false},
			{ id:'sendingMethod', name : 'sendingMethod', index : 'sendingMethod', label : 'Distribution Type',width:150,editable:false,sortable:false},
			{ id:'createUser', name : 'createUser', index : 'createUser', label : 'Create User',width:200,editable:false,sortable:false},
			{ id:'createDateString', name : 'createDateString', index : 'createDateString', label : 'Create Date/Time',width:260,editable:false}
		],
		pager : '#reportGridPager',
		rowNum : 10,
		rowList : [ 10, 20, 50, 100 ],
		height: '100px',
		width: 'auto',
		sortname: 'createDateString',
		multiselect: true,
		sortorder: 'desc',
		viewrecords : true,
		gridview : true,
		loadonce : false,
		altRows:true,
	    altclass:'uiAltRowClass',
		jsonReader: {
			repeatitems: false, id: "0"
		},
		loadComplete: function() {
			$('#reportGrid').setGridHeight('auto');
		},
		gridComplete: function(){
			var rowIDs = jQuery("#reportGrid").getDataIDs(); 
		      for (var i=0;i<rowIDs.length;i=i+1){ 
		        var rowData=jQuery("#reportGrid").getRowData(rowIDs[i]);
		        var trElement = jQuery("#"+ rowIDs[i],jQuery('#reportGrid'));
		        $(trElement.children()[5]).attr('title',rowData.reportDescription);
		      }
		},
		ignoreCase: true
	})	
	 .jqGrid('filterToolbar',{stringResult: true, searchOnEnter: true, defaultSearch: 'cn'}); 	
	
	//to default the focus to Subject field
	$("#identifier").focus();
 		
});


function validateDate(){
	//var fromDate = $( "#fromDateInString" ).datepicker("getDate");
	//alert ($("#fromDateInString").val()+ "::"+fromDate);
	/*if (diff < 0){
		//return "From date should be greater than to date";
		$("#toDateInString").validationEngine('showPrompt', 'From date should be greater than to date', 'error', false);
		return false;
	}*/
	
	return true;
}
 
 $('#selectedPrinter').gatesAutocomplete({
	 source:_context+'/cas/autocomplete.do?method=printerNamePsearch&searchType=373' ,
		formatItem: function(data) {
			return  data.name;
		},
		formatResult: function(data) {
			return  data.name;
		}, 
		select: function(data) {
			$('#selectedPrinter').val(data.name);					
			//$('#selectedPrinter').val(data.id); // gives Printer ID
		}
});	
		
//hide all inline validation error messages
 function removeErrorPointers(){
 	   $('#documentForm').validationEngine('hideAll');
 }
 
//FOR PRINTER LOOK UP:
$('#selectedPrinter').gatesPopUpSearch({func:function() {printeNamePopupSearch()}}); 
	 function printeNamePopupSearch() {
		
		var actionUrl = _context+'/cas/printerNamelookup.do?filterValue1='+$('#selectedPrinter').val();
		var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
		window.open(actionUrl, 'PrinterNameSearch', windowStyle);
	}

	function printerNameSearchUpdate(id)
	{
		var values = id.split("|");
		var printerName = values[0];
		var printerId = values[1];	
		$('#selectedPrinter').val(printerName);
	} 
	
	function setMessage(responseText)
	{
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

			
			$('#msgDiv').html('').append(messageContent);
		}
	}
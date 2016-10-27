$(document).ready(function(){
		

	$('#hd').hide();

		$('#tabSearchBox').hide();
		$('input[type=button][value=RunReport]').parent().get(0).outerHTML = $('input[type=button][value=RunReport]').parent().get(0).outerHTML.replace(/&nbsp;/g,"");
		$('input[type=button][value=Reset]').parent().get(0).outerHTML = $('input[type=button][value=Reset]').parent().get(0).outerHTML.replace(/&nbsp;/g,"");
		//$('input[type=button][value=Reset]').html($('input[type=button][value=Reset]').html().replace(/&nbsp;/g,""));
		
		$('input[type=button][value="RunReport"]').attr("onClick", "javascript:runReport(this.form.method);");
		
		
		$('input[type=button][value=Reset]').parent().parent().prepend(
		'<td nowrap=""><input class="buttonNoFloat" onclick="javascript:exit()" value="Exit" type="button"></td>');
		
		if($('#report_id').val() == '520')
		{
			$('[name="parameterValue1"]').parent().parent().parent().parent().parent().parent().hide();
			$('[name="parameterValue1"]').val($('#reportUserId').val());
			$('[name="parameterValue2"]').val($('#reportUserFirstName').val());
		

		}
			if($('#report_id').val() == '411' || $('#report_id').val() == '410' || $('#report_id').val() == '413' || $('#report_id').val() == '407' || $('#report_id').val() == '408' 
					|| $('#report_id').val() == '409' || $('#report_id').val() == '412' || $('#report_id').val() == '414'  || $('#report_id').val() == '416' || $('#report_id').val() == '419'
					|| $('#report_id').val() == '518' || $('#report_id').val() == '511' || $('#report_id').val() == '507' || $('#report_id').val() == '502' || $('#report_id').val() == '504'
					|| $('#report_id').val() == '516' || $('#report_id').val() == '512' || $('#report_id').val() == '520' || $('#report_id').val() == '509' || $('#report_id').val() == '519'
					|| $('#report_id').val() == '503' || $('#report_id').val() == '521' ) {
				
				$("select[name=savedQuery]").parent().parent().parent().parent().hide();
				if($('#report_id').val() == '411' || $('#report_id').val() == '410' || $('#report_id').val() == '502' || $('#report_id').val() == '518' 
					|| $('#report_id').val() == '507' || $('#report_id').val() == '503'
					|| $('#report_id').val() == '519' || $('#report_id').val() == '504'
					|| $('#report_id').val() == '511' || $('#report_id').val() == '520' || $('#report_id').val() == '509'
					|| $('#report_id').val() == '516' || $('#report_id').val() == '512'
					|| $('#report_id').val() == '521' || $('#report_id').val() == '412'  || $('#report_id').val() == '416'
					|| $('#report_id').val() == '414' || $('#report_id').val() == '413'  || $('#report_id').val() == '407'  || $('#report_id').val() == '409'
					|| $('#report_id').val() == '408'
					
				) {
					$("input[name=executionType][value='2']").attr("checked","checked");
					
				}
				$("input[name=executionType]").parent().parent().parent().parent().hide();
			}
			
			if($('#report_id').val() == '503'){
				$("#INDATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#INDATE").blur(function() {
					if($("#INDATE").val()==''){
						$("#INDATE").val('ALL');
					}
					ValidateDT($("#INDATE").val(),503);
				});
				$("#INDATE").click(function() {
					if($("#INDATE").val()=='ALL'){
						$("#INDATE").val('');
					}
					removeErrorPointers();
				});
			}
			
			if($('#report_id').val() == '518'){
				$("#INDATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#INDATE").blur(function() {
					if($("#INDATE").val()==''){
						$("#INDATE").val('ALL');
					}
					ValidateDT($("#INDATE").val(),518);
				});
				$("#INDATE").click(function() {
					if($("#INDATE").val()=='ALL'){
						$("#INDATE").val('');
					}
					removeErrorPointers();
				});
			}
			if($('#report_id').val() == '519'){
				$("#in_date").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#in_date").blur(function() {
					if($("#in_date").val()==''){
						$("#in_date").val('ALL');
					}
					ValidateDT($("#in_date").val(),519);
				});
				$("#in_date").click(function() {
					if($("#in_date").val()=='ALL'){
						$("#in_date").val('');
					}
					removeErrorPointers();
				});
				
				$("#in_end_date").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#in_end_date").blur(function() {
					if($("#in_end_date").val()==''){
						$("#in_end_date").val('ALL');
					}
					ValidateDT($("#in_end_date").val(),5191);
				});
				$("#in_end_date").click(function() {
					if($("#in_end_date").val()=='ALL'){
						$("#in_end_date").val('');
					}
					removeErrorPointers();
				});
			}
			
			if($('#report_id').val() == '516'){
				$("#IN_EFF_DATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#IN_EFF_DATE").blur(function() {
					if($("#IN_EFF_DATE").val()==''){
						$("#IN_EFF_DATE").val('ALL');
					}
					ValidateDT($("#IN_EFF_DATE").val(),516);
				});
				$("#IN_EFF_DATE").click(function() {
					if($("#IN_EFF_DATE").val()=='ALL'){
						$("#IN_EFF_DATE").val('');
					}
					removeErrorPointers();
				});
			}
			if($('#report_id').val() == '511'){
				$("#IN_DATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#IN_DATE").blur(function() {
					if($("#IN_DATE").val()==''){
						$("#IN_DATE").val('ALL');
					}
					ValidateDT($("#IN_DATE").val(),511);
				});
				$("#IN_DATE").click(function() {
					if($("#IN_DATE").val()=='ALL'){
						$("#IN_DATE").val('');
					}
					removeErrorPointers();
				});
			}
			if($('#report_id').val() == '507'){
				$("#IN_START_DATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#IN_END_DATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#IN_START_DATE").blur(function() {
					if($("#IN_START_DATE").val()==''){
						$("#IN_START_DATE").val('ALL');
					}
					ValidateDT($("#IN_START_DATE").val(),5071);
				});
				$("#IN_START_DATE").click(function() {
					if($("#IN_START_DATE").val()=='ALL'){
						$("#IN_START_DATE").val('');
					}
					removeErrorPointers();
				});
				$("#IN_END_DATE").blur(function() {
					if($("#IN_END_DATE").val()==''){
						$("#IN_END_DATE").val('ALL');
					}
					ValidateDT($("#IN_END_DATE").val(),5072);
				});
				$("#IN_END_DATE").click(function() {
					if($("#IN_END_DATE").val()=='ALL'){
						$("#IN_END_DATE").val('');
					}
					removeErrorPointers();
				});
			}
			if($('#report_id').val() == '502' || $('#report_id').val() == '521' ){
				$("#IN_EFF_DATE").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#IN_EFF_DATE").blur(function() {
					if($("#IN_EFF_DATE").val()==''){
						$("#IN_EFF_DATE").val('ALL');
					}
					ValidateDT($("#IN_EFF_DATE").val(),502);
				});
				$("#IN_EFF_DATE").click(function() {
					if($("#IN_EFF_DATE").val()=='ALL'){
						$("#IN_EFF_DATE").val('');
					}
					removeErrorPointers();
				});
			}
			if($('#report_id').val() == '512'){
				$("#start_date").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#end_date").datepicker({ dateFormat: 'mm-dd-yy' });
				$("#start_date").blur(function() {
					if($("#start_date").val()==''){
						$("#start_date").val('ALL');
					}
					ValidateDT($("#start_date").val(),5121);
				});
				$("#end_date").blur(function() {
					if($("#end_date").val()==''){
						$("#end_date").val('ALL');
					}
					ValidateDT($("#end_date").val(),5122);
				});
				$("#start_date").click(function() {
					if($("#start_date").val()=='ALL'){
						$("#start_date").val('');
					}
					removeErrorPointers();
				});
				$("#end_date").click(function() {
					if($("#end_date").val()=='ALL'){
						$("#end_date").val('');
					}
					removeErrorPointers();
				});
			}
			
			if($('#report_id').val() == '509'){
				$("#IN_ORG_NAME").charLimit({limit: 57});
				 $('#IN_ORG_NAME').gatesAutocomplete({
					 source: _context+'/cas/autocomplete.do',
					 name:'ORG NAME',
						extraParams: {
							  method: 'searchOrg',
							  searchType: '229',
							  parentSearch:  function() { 
								  $('#IN_ORG_ID').val('');
								  return $('#IN_ORG_ID').val(); 
							}
						},
						mustMatch: true,
						//defaultValue:'ALL',
						formatItem: function(data) {
							return data.abbr + "-" + data.name;
						},
						formatResult: function(data) {
							return data.abbr + "-" + data.name;
						}, 
						select: function(data) {
							$('#IN_ORG_ID').val(data.id);
						}
					});
				 $('#IN_ORG_NAME').gatesPopUpSearch({func:function() {organizationPopupSearch()}});
				 $("#IN_ORG_ID").parent("td").hide();
				 $('td.dataField:contains("IN_ORG_ID:")').hide();
				 $('#IN_ORG_NAME').click(function() {
					 removeErrorPointers();
			 	 });
				 
			}
			
			
			
			
			if($('#report_id').val() == '500' || $('#report_id').val() == '501') {
				//var searchMethod="javascript:runReport(this.form.method);"
				$("select[name=savedQuery]").parent().parent().parent().parent().hide();
				$("input[name=executionType][value='2']").attr("checked","checked");
				$("input[name=executionType]").parent().parent().parent().parent().hide();
				/*$("#in_start_date").parent().parent().parent().parent().parent().parent().parent().parent().children('tr:nth-child(4)').hide()
				$("#in_start_date").parent().parent().parent().parent().parent().parent().parent().parent().append('<tr><td><input type="button" class="buttonNoFloat" onclick="javascript:resetFileds(this.form)" value="Reset"><input type="button" class="buttonNoFloat" id="runReportButton" value="RunReport"></td></tr>');
				$('#runReportButton').attr('onclick',searchMethod); */
			
				
				//Disabling browser autocomplete
				$("#in_start_date").attr("autocomplete","off");
				$("#in_end_date").attr("autocomplete","off");
				
				$('#in_start_date').datepicker({ dateFormat:'mm-dd-yy'}).width(80);
				$('#in_end_date').datepicker({ dateFormat:'mm-dd-yy'}).width(80);
				$('#in_end_date').click( function() {
					if($('#in_end_date').val() == 'ALL') {
						$('#in_end_date').val('');
					}
					removeErrorPointers();
				});
				$('#in_start_date').click( function() {
					if($('#in_start_date').val() == 'ALL') {
						$('#in_start_date').val('');
					}
					removeErrorPointers();
				});
				$('#in_start_date').blur( function() {
					if($('#in_start_date').val() == '') {
						$('#in_start_date').val('ALL');
					}
				});
				$('#in_end_date').blur( function() {
					if($('#in_end_date').val() == '') {
						$('#in_end_date').val('ALL');
					}
				});
				
			}
			
			$('#in_source_code').gatesAutocomplete({
				source:_context+'/cas/autocomplete.do',
			 	extraParams: {
		 		 		 		 method: 'searchTariffSource',
		 		 		 		 searchType: '11',
		 		 		 		 groupType:  function() { return $('#in_group_type_code').val(); }
				 		 	 },
				 formatItem: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 formatResult: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 select: function(data) {
				 		 $('#in_source_code').val(data.id);	
				 		 $('input[name="grpId"]').val(data.id);
				 		 /*if($('#in_group_type_code').val()=="01"){
				 			 $('#in_group_code').val(data.name);
				 		 }*/
				 }
			});	
			
			 $('#in_source_code').change(function(){
					if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
			        	$("#in_source_code").val("ALL"); 
			        	$("#in_group_code").val("ALL"); 
			    	}
					else
					{
						$("#in_source_code").val(dataName); 
				 		 /*if($('#in_group_type_code').val()=="01"){
				 			 $('#in_group_code').val(dataName);
				 		 }*/
						$('input[name="grpId"]').val("");
					}
			    }); 
			 
			 $('#in_group_code').gatesAutocomplete({
				 source:  _context+'/cas/autocomplete.do',
				 extraParams: {
		 		 		 		 method: 'searchGroupName',
		 		 		 		 searchType: '10',
		 		 		 		 groupType:  function () { return $('#in_group_type_code').val(); },
		 		 		 		 sourceTariff:  function () { return $('#in_source_code').val(); }				 		 		 		 
				 		 		},
				 formatItem: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 formatResult: function(data) {
					 	dataName=data.name;
					 	$('input[name="grpId"]').val(data.id);
				 		 return data.name;
				 },
				 select: function(data) {
				 		 $('#in_group_code').val(data.id);		
				 		 $('input[name="grpId"]').val(data.id);
				 }		 
			});	
		//Blurr the data for invalid group Id
		 $('#in_group_code').change(function(){
				if($('input[name="grpId"]').val()==null || $('input[name="grpId"]').val()==""){
		        	$("#in_group_code").val("ALL"); 
		    	}
				else{
					$("#in_group_code").val(dataName); 
					$('input[name="grpId"]').val("");
				}
		    }); 
		 
		/*	$('#in_group_type_code').change(function(){	
				
				 $('#_eventId_replicate').attr("disabled","disabled");
				 $('#_eventId_item').attr("disabled","disabled");
				 $('#_eventId_condition').attr("disabled","disabled");
				 $('#_eventId_del').attr("disabled","disabled");
				 $('input[name="grpId"]').val("");
				javascript:resetFileds(this.form);
		    });*/
			 //reset page on change of group type
			 $("#in_group_type_code").change(function() {
				 $('#msgDiv').hide();
					//document.tariffGroupForm.delete1.value ="";
					$("#in_source_code").val("ALL");
					$("#in_group_code").val("ALL");
					$("#IN_EFF_DATE").val("ALL");
					//hide display grid too       
			 });
			 
			 $("#in_group_code").click(function() {
					if($("#in_group_code").val()=='ALL'){
						$("#in_group_code").val('');
					}
					removeErrorPointers();
				});
			 $("#in_source_code").click(function(){
				 if($("#in_source_code").val()=='ALL'){
					 $("#in_source_code").val('');
				 }
			 })
	    	
	      });
			
	
			function removeErrorPointers(){
				$('form[name="runReportForm"]').validationEngine('hideAll');
			}
			
			function validateSearch(){
				if($('#report_id').val() == '511'){
					if($("#IN_DATE").val() == null || $("#IN_DATE").val() == "" || $("#IN_DATE").val() == "ALL"){
						$("#IN_DATE").validationEngine('showPrompt', 'Please provide Date', 'error', true);
						//alert("Date is mandatory.");
						return false;
					}
				}
				
				/* if($('#report_id').val() == '502'){
					if($("#IN_EFF_DATE").val() == null || $("#IN_EFF_DATE").val() == "" || $("#IN_EFF_DATE").val() == "ALL"){
						$("#IN_EFF_DATE").validationEngine('showPrompt', 'Please provide Effective Date', 'error', true);
						//alert("Effective Date is mandatory.");
						return false;
					}
				} */
				
				
				if($('#report_id').val() == '518'){
					if($("#INDATE").val() == null || $("#INDATE").val() == "" || $("#INDATE").val() == "ALL"){
						$("#INDATE").validationEngine('showPrompt', 'Please provide Input Date', 'error', true);
						//alert("Input Date is mandatory.");
						return false;
					}
				}
				if($('#report_id').val() == '516'){
					if($("#IN_EFF_DATE").val() == null || $("#IN_EFF_DATE").val() == "" || $("#IN_EFF_DATE").val() == "ALL"){
						$("#IN_EFF_DATE").validationEngine('showPrompt', 'Please provide Effective Date', 'error', true);
						//alert("Effective Date is mandatory.");
						return false;
					}
				}
				if($('#report_id').val() == '509'){
					if($("#IN_ORG_ID").val() == null || $("#IN_ORG_ID").val() == "" || $("#IN_ORG_ID").val() == "ALL"){
						$("#IN_ORG_NAME").val('');
						$("#IN_ORG_NAME").validationEngine('showPrompt', 'Please provide Organization Name', 'error', true);
						//alert("Organization Name is mandatory.");
						return false;
					}
				}
				if($('#report_id').val() == '507'){
					if($("#IN_START_DATE").val() == null || $("#IN_START_DATE").val() == "" || $("#IN_START_DATE").val() == "ALL"){
						$("#IN_START_DATE").validationEngine('showPrompt', 'Please provide Start Date', 'error', true);
						//alert("Start Date is mandatory.");
						return false;
					}
					if($("#IN_END_DATE").val() == null || $("#IN_END_DATE").val() == "" || $("#IN_END_DATE").val() == "ALL"){
						$("#IN_END_DATE").validationEngine('showPrompt', 'Please provide End Date', 'error', true);
						//alert("End Date is mandatory.");
						return false;
					}
					if((($.datepicker.parseDate( "mm-dd-yy", $('#IN_START_DATE').val()))-($.datepicker.parseDate( "mm-dd-yy", $('#IN_END_DATE').val())))/(1000*60*60*24) >0){
						$("#IN_END_DATE").validationEngine('showPrompt', 'Please enter correct Date Range.', 'error', true);
						return false;	
					}
				}
				
				if($('#report_id').val() == '512'){
					if($("#start_date").val() == null || $("#start_date").val() == "" || $("#start_date").val() == "ALL"){
						$("#start_date").validationEngine('showPrompt', 'Please provide Start Date', 'error', true);
						//alert("Start Date is mandatory.");
						return false;
					}
					if($("#end_date").val() == null || $("#end_date").val() == "" || $("#end_date").val() == "ALL"){
						$("#end_date").validationEngine('showPrompt', 'Please provide End Date', 'error', true);
						//alert("End Date is mandatory.");
						return false;
					}
				}
				
			}
	
			function organizationPopupSearch() {
				var values=$('#IN_ORG_NAME').val().split("-");
				var param;
				if(values[1]!=null){
					param=values[1];
				}else{
					param=values[0];
				}
			    var actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=' + param+'||QT';
			    var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
				window.open(actionUrl, 'CustomerSearch', windowStyle);
			}
			
/* 			function organizationNameSearchUpdate(id){
				var values = id.split("|");		
				$('#IN_ORG_ID').val(values[1]);
				$('#IN_ORG_NAME').val(values[2]+"-"+values[0]);
			}
 */			
			function orgSearchUpdate(id){
				var values = id.split("|");
				$("#IN_ORG_ID").val(values[2]);
				var orgCode = values[1];
				var orgName= values[0];
				$('#IN_ORG_NAME').val(orgCode+'-'+orgName);
			}
			function ValidateDT(dt,i) {
				if (dt != null && dt != "") {
					//case1
					var date = dt;
					var dateSize = date.length;
					var newDate = date;
					var dt1 ;
					var mon1;
					var year1;
					if(dateSize == 6){
						dt1  = date.substring(2,4); 
						mon1 = date.substring(0,2);
						year1 = date.substring(4,6);
						newDate=mon1+"-"+dt1+"-20"+year1;
					} else if(dateSize == 8){
						dt1  = date.substring(2,4); 
						mon1 = date.substring(0,2);
						year1 = date.substring(4,8);
						newDate=mon1+"-"+dt1+"-"+year1;
					}
					var valid = false;	
					if(isValidDate(newDate))
					{
						valid = true;
					}
					if(!valid) {
						if(i==518){
							$("#INDATE").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#INDATE").val("");
						}
						if(i==519){
							$("#in_date").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#in_date").val("");
						}
						if(i==5191){
							$("#in_end_date").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#in_end_date").val("");
						}
						if(i==511){
							$("#IN_DATE").validationEngine('showPrompt', 'Input Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#IN_DATE").val("");
						}
						if(i==5071){
								$("#IN_START_DATE").validationEngine('showPrompt', 'Start Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
								$("#IN_START_DATE").val("");
						}
						if(i==5072){
								$('#IN_END_DATE').val("");
								$("#IN_END_DATE").validationEngine('showPrompt', 'End Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							}
						if(i==502){
							$('#IN_EFF_DATE').val("");
							$("#IN_EFF_DATE").validationEngine('showPrompt', 'Effective Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
						}
						if(i==516){
							$('#IN_EFF_DATE').val("");
							$("#IN_EFF_DATE").validationEngine('showPrompt', 'Effective Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
						}
						if(i==5121){
							$("#start_date").validationEngine('showPrompt', 'Start Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#start_date").val("");
						}
						if(i==5122){
							$("#end_date").validationEngine('showPrompt', 'End Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
							$("#end_date").val("");
						}
					}else{
						if(i==518){
							$('#INDATE').val(newDate);	
						}
						if(i==519){
							$('#in_date').val(newDate);	
						}
						if(i==5191){
							$('#in_end_date').val(newDate);	
						}
						if(i==511){
							$('#IN_DATE').val(newDate);	
						}
						if(i==5071){
							$('#IN_START_DATE').val(newDate);	
						}
						if(i==5072){
							$('#IN_END_DATE').val(newDate);	
						}
						if(i==502){
							$('#IN_EFF_DATE').val(newDate);	
						}
						if(i==516){
							$('#IN_EFF_DATE').val(newDate);
						}
						if(i==5121){
							$('#start_date').val(newDate);
						}
						if(i==5122){
							$('#end_date').val(newDate);
						}
					}
				}	
			}

			function isValidDate(date) {
				var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
				var validDate = false;
			    var len1 = date.length;
				if (matches == null) {
					if(date=='ALL'){
						return true;
					}
					if(len1 < '8' && len1>'10') {
						return false;
					}
					if(len1 == '8') {
						var dt1 = date.substring(2,4);
					    var mon1 = date.substring(0,2);
					    var mn = mon1-1;
					    var yr1 = date.substring(4,8);
						var composedDate = new Date(yr1, mn,dt1 );
						validDate = composedDate.getDate() == dt1 && composedDate.getMonth() == mn && composedDate.getFullYear() == yr1;
						if(validDate) {
							var newDate = mon1 + "-" + dt1 + "-" + yr1;
							return newDate;
						} else {
							return null;
						}
					}
				} else {
					var d = matches[2];
					var m = matches[1] - 1;
					var y = matches[3];
					var composedDate = new Date(y, m, d);

					validDate = composedDate.getDate() == d && composedDate.getMonth() == m && composedDate.getFullYear() == y;
					
					if(validDate) {	
						var newDate = matches[1] + "-" + d + "-" + y;
						return newDate;
					} else {
						return null;
					}
				}
			}
			
			
			
			function getFormattedDate(){
				var todaysDate = new Date();
				
				var day = todaysDate.getDate();
				if(eval(day<10)){
					day = '0'+day;
				}
				var month = eval(eval(todaysDate.getMonth())+eval(1));
				if(eval(month<10)){
					month = '0'+month;
				}
				var year = todaysDate.getFullYear();
				return month + "-"+day+"-"+year;
				//return month+"-"+day+"-"+year;
			}
			function runReport(method) {
				if($('#report_id').val() == '500' || $('#report_id').val() == '501') {
					var today=getFormattedDate();
					var startDate=new Date($('#in_start_date').val());
					var endeDate=new Date($('#in_end_date').val());
					
					if($('#in_start_date').val() == '') {
						$("#in_start_date").validationEngine('showPrompt', 'Start Date is mandatory', 'error', true);
						return false;
					}
					if($('#in_end_date').val() == '') {
						$("#in_end_date").validationEngine('showPrompt', 'End Date is mandatory', 'error', true);
						return false;
					}
					
					if(endeDate > today)
					 {
						$("#in_end_date").validationEngine('showPrompt', 'End Date can not be greater than current date', 'error', true);
						return false;
					 }
					if(startDate> endeDate)
					 {
						$("#in_end_date").validationEngine('showPrompt', 'End Date can not be prior to Start Date', 'error', true);
						return false;
					 }
				}
			postRunReport('search',method, '');
			
			
			}
			

			function validateEmail(email) {
			  var emailPattern = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
			  return emailPattern.test(email);
			}

			function validateFax(fax) {
			  var faxNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;  
				return faxNumberPattern.test(fax);  
			}  
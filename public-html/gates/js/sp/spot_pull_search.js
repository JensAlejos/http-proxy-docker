$(document).ready(function() {
		
		
		$('form[name="spotAndPullRequestSearchForm"]').formatCasSearchForm({ 
			hasSavedSearchFeature: true, 
			customActions: [ 
			]
		});
		
		$('#casQuickSearch tr').removeClass('odd');
		 $('#casQuickSearch tr').removeClass('even');
		 $('#casQuickSearch td:nth-child(14),th:nth-child(14)').hide();
		
		$( "#at_least_one_request_selected" ).dialog({
    		resizable: false,
    		autoOpen: false,
    		height:100,
    		width:450,
    		modal: true,
    		buttons: {
    			"OK": function() {
    				$( this ).dialog( "close" );
    			}
    		}
    	});
     	
		$("#IN_PORT_CODE option[value='PDA']").remove();
  
//		$('#printBtn').click(function(){
//	     	var url='../spotpull/printFromSearchScreenSpotPullRequest/?id=24';
//	     	var newWindow = window.open(url,'name','height=500,width=500');
//	     	newWindow.print();
//	     	return false;
//
//		});

		// div for "Search" and "Clear" buttons
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(3)').after(
			'<div id="showButtons">' +	
			'<table>' +
			'<tr>' +
			  '<td><input type="button" onclick="javascript:searchValue();" value="Search" name="search" class="buttonNoFloat"></td>' +
			  '<td><input type="button" onclick="javascript:resetForm();" value="Clear" id="clear" name="clear" class="buttonNoFloat"></td>' +
			'</tr>' +
		  	'</table>' +
		  	'</div>'	
		);
		
		
		if($('#IN_SHIPPER').val() != null && $('#IN_SHIPPER').val() != ""
			 && $('#IN_SHIPPER').val() != "ALL") {
			if($('#IN_SHIPPER').val().indexOf('|') >=0 ){
				var tokens = $('#IN_SHIPPER').val().split('|');
				$('#IN_SHIPPER').val(tokens[0]);
				shipperId = tokens[1];
			}
				
			
		}
			//$('#IN_SHIPPER').val($('#IN_SHIPPER').val() + '|' + shipperId);
	
		// hide CAS generated "Search" and "Clear" Button
		$('div.searchTable').parent().parent().parent().children('tr:nth-child(5)').hide();
		
		if('<%=request.getParameter("isRefresh") %>' != 'null' && '<%=request.getParameter("isRefresh") %>' == 'true')
			searchValueDefault();
	
		 // hide test text box
		 //$('div.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(7)').hide();
        // $('div.searchTable').children().children().children('tr:nth-child(3)').children('td:nth-child(8)').hide();
         

         //Append new custom fields for equipment
		
		$("#IN_VESSEL").attr("maxlength","3");
		$("#IN_VOYAGE").attr("maxlength","3");
		$("#IN_DIRECTION").attr("maxlength","1");	
		$("#IN_VESSEL").attr("size","1");
		$("#IN_VOYAGE").attr("size","1");
		$("#IN_DIRECTION").attr("size","1");
		$("td.dataField:contains('IN_VOYAGE:')").hide();
		$("td.dataField:contains('IN_DIRECTION:')").hide();		
		var voy_display = $("#IN_VOYAGE");
		var dir_display = $("#IN_DIRECTION");
		$("#IN_VOYAGE").remove();
		$("#IN_DIRECTION").remove();
		$("#IN_VESSEL").closest('td').append(voy_display).append("  ").append(dir_display);
		$("#IN_VESSEL").closest('td').after($("#IN_USER_ID").closest('td'));
		$("#IN_VESSEL").closest('td').after($("td.dataField:contains('User ID:')"));		
		$("#IN_USER_ID").closest('td').after($("#IS_CHANGED").closest("td"));
		$("#IN_USER_ID").closest('td').after($("td.dataField:contains('Is Changed:')"));
		$('#IN_USER_PORT_LIST').closest('td').after($("td.dataField:contains('IN_VOYAGE:')"));
		$('#IN_USER_PORT_LIST').closest('td').after($("td.dataField:contains('IN_DIRECTION:')"));
		$('#IN_USER_PORT_LIST').parent().parent().hide();
		// Predictive search on booking_csr field
		$('#IN_USER_ID').gatesAutocomplete({
					source: _context+'/cas/autocomplete.do',
					name: 'User Id',
					extraParams: {
				 		 method: 'getBookingCSR',
				 		 searchType: '2001',
				 	},
				 	//mustMatch : true,
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
					formatItem: function(data) {
						return data.id;
					},
					formatResult: function(data) {
						return data.id;
					},
					select: function(data) {
						$('#IN_USER_ID').val(data.id);
					}	
			});
	var vess= false;
		 	$("#IN_VESSEL").focus(function(){
		 		vess= false;
				if($("#IN_VESSEL").val()== "ALL"){
					$("#IN_VESSEL").val('');
				} else
					$(this).select();
				 removeErrorPointers();
			});
		 	
		 	$("#IN_VESSEL").keydown(function(evt) {
				var theEvent = evt || window.event;
			  	var key = theEvent.keyCode || theEvent.which;
			  	if(key == '16' || key == '9' || key == '8' || key == '46')
			  		return;
			     /* if($('#IN_VESSEL').val().length == 3 && vess)
				    	$('#IN_VOYAGE').focus(); */
			     
			     if(!vess){
				  		vess= true;
				  		$(this).select();
			     }
				});
		 	

			$("#IN_VESSEL").keyup(function(evt) {
				var theEvent = evt || window.event;
			  	var key = theEvent.keyCode || theEvent.which;
			  	if(key == '16' || key == '9' || key == '8' || key == '46')
			  		return;
			     if($('#IN_VESSEL').val().length == 3 && vess)
				    	$('#IN_VOYAGE').focus();
			     
			     
				});
			
			$("#IN_VOYAGE").click(function(){
				if($("#IN_VOYAGE").val()== "ALL"){
					$("#IN_VOYAGE").val('');
				}
				removeErrorPointers();
			}).keyup(function(evt) {
				var theEvent = evt || window.event;
			  	var key = theEvent.keyCode || theEvent.which;
			  	if(key == '16' || key == '9' || key == '8' || key == '46')
			  		return;
			     if($('#IN_VOYAGE').val().length == 3)
				    	$('#IN_DIRECTION').focus();
				});
			var chkvoy = true;
			 $("#IN_VOYAGE").focus(function(){
				 chkvoy = true;
					if($("#IN_VOYAGE").val()== "ALL"){
						$("#IN_VOYAGE").val('');
					} else
						$(this).select();
					 removeErrorPointers();
				});
			$("#IN_VOYAGE").blur(function(){
				if($("#IN_VOYAGE").val()== ""){
					$("#IN_VOYAGE").val('ALL');
				}
				removeErrorPointers();
			});
			
			
			
			
		$('#IN_SHIPPER').width($('#IN_SHIPPER').width()-5); 
		
		$('#IN_SHIPPER').gatesAutocomplete({
			source: _context+'/cas/autocomplete.do',
			extraParams: {
				  method: 'searchOrg',
				  searchType: '229',
				  parentSearch:  function() {
					  
					  return "BK"; }
				},
				autoSelectFirst:true,
			formatItem: function(data) {
				return data.name + "-" + data.abbr;
			},
			formatResult: function(data) {
				return data.name+"-"+data.abbr;
			}, 
			select: function(data) {
			    //$('#IN_SHIIPPER_ID').val(data.id);
				
				shipperId = data.id;
			}
		});	
		$('#IN_SHIPPER').gatesPopUpSearch({
			func : function() {
				custNamePopupSearch();
			}
		});

		$('#IN_EQUIPMENT').parent().append(
         		  '<input id="planEquipFunctionCode" name="planEquipFunctionCode" type="text" value="ALL" size="1" maxlength="1"/>'+
         			  '&nbsp;<input id="planEquipLengthFeet" name="planEquipLengthFeet" type="text" value="ALL"  size="1" maxlength="2"/>'+
         			  '&nbsp;<input id="planEquipHeightCode" name="planEquipHeightCode" type="text" value="ALL"  size="1" maxlength="1"/>'
         		   			
           	); 
          $('#IN_EQUIPMENT').hide();
          
          if($("#IN_EQUIPMENT").val() != null && $("#IN_EQUIPMENT").val() != '' && $("#IN_EQUIPMENT").val() != 'ALL'){
        	  if($("#IN_EQUIPMENT").val().substring(0,1)!= '*')
        		  $("#planEquipFunctionCode").val($("#IN_EQUIPMENT").val().substring(0,1));
        	  if($("#IN_EQUIPMENT").val().substring(1,3)!= '**')
        		  $("#planEquipLengthFeet").val($("#IN_EQUIPMENT").val().substring(1,3));
        	  var ht = $("#IN_EQUIPMENT").val().substring(3,4);
        	  if(ht == '?')
        	  	$("#planEquipHeightCode").val('');
        	  else if(ht == '$')
        		  $("#planEquipHeightCode").val('ALL');
        	  else
        		  $("#planEquipHeightCode").val(ht);
          }
          
          $("#planEquipFunctionCode").click(function(){
  			if($('#planEquipFunctionCode').val()== "ALL"){
  				$("#planEquipFunctionCode").val('');
  			}
  			 removeErrorPointers();
  		 });
          $("#planEquipFunctionCode").blur(function(){
				if($('#planEquipFunctionCode').val()== ""){
					$("#planEquipFunctionCode").val('ALL');
				}
				 removeErrorPointers();
			});
          $("#planEquipLengthFeet").click(function(){
    			if($('#planEquipLengthFeet').val()== "ALL"){
    				$("#planEquipLengthFeet").val('');
    			}
    			 removeErrorPointers();
    		 });
          $("#planEquipLengthFeet").blur(function(){
				if($('#planEquipLengthFeet').val()== ""){
					$("#planEquipLengthFeet").val('ALL');
				}
				 removeErrorPointers();
			});
         /* $("#planEquipHeightCode").click(function(){
    			if($('#planEquipHeightCode').val()== "ALL"){
    				$("#planEquipHeightCode").val('');
    			}
    			 removeErrorPointers();
    		 });
          $("#planEquipHeightCode").blur(function(){
				if($('#planEquipHeightCode').val()== ""){
					$("#planEquipHeightCode").val('ALL');
				}
				 removeErrorPointers();
			});*/
          //$("#IN_EQUIPMENT").val($("#planEquipFunctionCode").val() + $("#planEquipLengthFeet").val() +$("#planEquipHeightCode").val());

          $('td.dataField:contains("Spot:")').hide();
          $("#IN_TYPE_SPOT").parent("td").hide();
          
          $('td.dataField:contains("Pull:")').hide();
          $("#IN_TYPE_PULL").parent("td").hide();
          
          $('td.dataField:contains("Delivery drop:")').hide();
          $("#IN_TYPE_DELIVERY").parent("td").hide();
          
          $('td.dataField:contains("Liveload:")').hide();
          $("#IN_TYPE_LIVELOAD").parent("td").hide();
          
          $('td.dataField:contains("Live unload:")').hide();
          $("#IN_TYPE_LIVEUNLOAD").parent("td").hide();
          
          $('td.dataField:contains("Empty pickup:")').hide();
          $("#IN_TYPE_EMPTYPICKUP").parent("td").hide();
          
          $('td.dataField:contains("Reefer:")').hide();
          $("#IN_CATEGORY_REEFER").parent("td").hide();
          
          $('td.dataField:contains("Military:")').hide();
          $("#IN_CATEGORY_MILITARY").parent("td").hide();
          
          $('td.dataField:contains("All Others:")').hide();
          $("#IN_CATEGORY_ALL").parent("td").hide();
          
          $('#IN_SENT').attr("size","12");
          $('#IN_REF').width($('#IN_SENT').width()); 
          $('#IN_AS_GROUP').width($('#IN_SENT').width()); 
          
          $('#IN_TYPE').parent().hide();
          $("td.dataField:contains('TEST:')").closest('td').hide();
          $('#IN_TEST').parent().hide();
          $('#IN_TYPE').parent().after(
         		  '<td colspan="4">' +
         		  '<input type="checkbox" id="spot" checked="true"></input>Spot' +
         		  '<input type="checkbox" id="pull" checked="true"></input>Pull' +
         		  '<input type="checkbox" id="delivery" checked="true"></input>Delivery drop' +
         		  '<input type="checkbox" id="liveload" checked="true"></input>Liveload' +
         		  '<input type="checkbox" id="liveunload" checked="true"></input>Live unload' +
         		 '<input type="checkbox" id="emptyPickUp" checked="true"></input>Empty pickup' +
         		  '</td>'
           	); 
          $('#spot').parent().addClass("dataField");
          $('#spot').parent().attr("style","text-align:left;");
          
          if($('#IN_TYPE').val()!=null && $('#IN_TYPE').val() != 'ALL'){
        	  if($('#IN_TYPE').val().substring(0,1)=='N')
        		  $('#spot').removeAttr("checked");
        	  if($('#IN_TYPE').val().substring(1,2)=='N')
        		  $('#pull').removeAttr("checked");
        	  if($('#IN_TYPE').val().substring(2,3)=='N')
        		  $('#delivery').removeAttr("checked");
        	  if($('#IN_TYPE').val().substring(3,4)=='N')
        		  $('#liveload').removeAttr("checked");
        	  if($('#IN_TYPE').val().substring(4,5)=='N')
        		  $('#liveunload').removeAttr("checked");
        	  if($('#IN_TYPE').val().substring(5,6)=='N')
        		  $('#emptyPickUp').removeAttr("checked");
          }
          
          $('#IN_BOOKING_NUMBER').attr("maxlength","7");
          $('#IN_CONTAINER_NBR').attr("maxlength","11");
          
          $('#IN_BOOKING_NUMBER').blur(function() {
        	  if($('#IN_BOOKING_NUMBER').val() != null && $('#IN_BOOKING_NUMBER').val() != 'ALL' && 
 					 ($('#IN_BOOKING_NUMBER').val().length !=7 || !isNumeric($('#IN_BOOKING_NUMBER').val())) ){
 					$("#IN_BOOKING_NUMBER").validationEngine('showPrompt', 'Please provide valid Booking', 'error', true);
 					return false;
 				}
        	  
        	  
 		 });
          
          $('#IN_APPT_DATE').attr("size","6");
          $('#IN_THRU').attr("size","6");
          $("td.dataField:contains('Thru:')").closest('td').hide();
          $('#IN_APPT_DATE').parent().append('Thru:').append( $('#IN_THRU'));
          $('#IN_APPT_DATE').parent().addClass("dataField");
          
         
          $('#IN_CATEGORY').parent().hide();
          //$('#IN_CATEGORY').parent().hide();
          $('#IN_CATEGORY').parent().after(
         		  '<td colspan="2">' +
         		 '<input type="checkbox" id="reefer" checked="true"></input>Reefer' +
        		  '<input type="checkbox" id="military" checked="true"></input>Military' +
        		  '<input type="checkbox" id="allother" checked="true"></input>All Other' +
         		  '</td>'
           	); 
          
          $('#reefer').parent().addClass("dataField");
          $('#reefer').parent().attr("style","text-align:left;");
          
          if($('#IN_CATEGORY').val()!=null && $('#IN_CATEGORY').val() != 'ALL'){
        	  if($('#IN_CATEGORY').val().substring(0,1)=='N')
        		  $('#reefer').removeAttr("checked");
        	  if($('#IN_CATEGORY').val().substring(1,2)=='N')
        		  $('#military').removeAttr("checked");
        	  if($('#IN_CATEGORY').val().substring(2,3)=='N')
        		  $('#allother').removeAttr("checked");

          }
          
          $('#IN_APPT_DATE').parent().attr("style","text-align:left;");
          
          $('#IN_REF').attr("maxlength","80");
          $('#IN_SHIPPER').attr("maxlength","32");
          
          
          //$('.dataField').css("font-size","87%");
		  $('.searchTable td').css("padding","1");
		  $('#IN_TRADE').width($('#IN_BOOKING_NUMBER').width());
		  
		  $('#clear').keypress(function(e) {
			  if(e.which == 13) {
					resetForm();
					$("#IN_PORT_CODE").trigger('focus');
					return false;
			  }
			});
		  
		  
		  $('#IN_TRUCKER').gatesAutocomplete({
				 source: _context+'/cas/autocomplete.do',
					extraParams: {
						  method: 'searchTruckerOnly',
						  searchType: '241',
						  parentSearch:  function() { 
							  var portlist = '';
							  if($('#IN_PORT_CODE').val() != null && $('#IN_PORT_CODE').val()=='ALL'){
								  $('#IN_PORT_CODE option').each(function() { 
										if($(this).attr('value') != 'ALL'){
											if(portlist.length>0)
												portlist += "-";
											portlist += $(this).attr('value')  ;
										}
									});
							  } else
								  portlist = $('#IN_PORT_CODE').val();
								
							  
							  return portlist; }
						},
					mustMatch: true,
					autoSelectFirst:true,
					//defaultValue:'ALL',
					formatItem: function(data) {
						return data.TRUCKER_CODE+"-"+data.TRUCKER_NAME;
					},
					formatResult: function(data) {
						return data.TRUCKER_CODE+"-"+data.TRUCKER_NAME;
					}, 
					select: function(data) {
						$('#IN_TRUCKER').val(data.TRUCKER_CODE+"-"+data.TRUCKER_NAME);
					}
				});	
			 
			// code to bind pop up search
			$('#IN_TRUCKER').gatesPopUpSearch({func:function() {truckerPopupSearch();}});
			
			 $('#IN_TRUCKER').width($('#IN_REF').parent("td").width()); 
          
          // Hide equipment fields generated by CAS.

         /* $('td.dataField:contains("EqFun:")').hide();
          $("#in_eq_fun_cd").parent("td").hide();

          $('td.dataField:contains("EqLen:")').hide();
          $("#in_eq_len_ft").parent("td").hide();

          $('td.dataField:contains("EqHt:")').hide();
          $("#in_eq_ht_cd").parent("td").hide();          
         
          document.getElementById('planEquipFunctionCode').value =$('#in_eq_fun_cd').val();
          document.getElementById('planEquipLengthFeet').value =$('#in_eq_len_ft').val();
          document.getElementById('planEquipHeightCode').value =$('#in_eq_ht_cd').val();*/
         
          /*replaceWithCheckBox($("#IN_TYPE_SPOT"),$("#IN_TYPE_SPOT").val());
          replaceWithCheckBox($("#IN_TYPE_PULL"),$("#IN_TYPE_PULL").val());
          replaceWithCheckBox($("#IN_TYPE_DELIVERY"),$("#IN_TYPE_DELIVERY").val());
          replaceWithCheckBox($("#IN_TYPE_LIVELOAD"),$("#IN_TYPE_LIVELOAD").val());
          replaceWithCheckBox($("#IN_TYPE_LIVEUNLOAD"),$("#IN_TYPE_LIVEUNLOAD").val());
          
          replaceWithCheckBox($("#IN_CATEGORY_REFER"),$("#IN_CATEGORY_REFER").val());
          replaceWithCheckBox($("#IN_CATEGORY_MILITARY"),$("#IN_CATEGORY_MILITARY").val());
          replaceWithCheckBox($("#IN_CATEGORY_ALL"),$("#IN_CATEGORY_ALL").val());*/
         
         
     	$( "#at_least_one_request_selected" ).dialog({
    		resizable: false,
    		autoOpen: false,
    		height:100,
    		width:450,
    		modal: true,
    		buttons: {
    			"OK": function() {
    				$( this ).dialog( "close" );
    			}
    		}
    	});
	
     	$('#IN_PORT_CODE').change(function() { 

     	   var ajaxURL = "autocomplete.do?method=getSPTruckerTadeCGByPort&searchType=273&parentSearch=" + ($('#IN_PORT_CODE').val()=='ALL'?'':$('#IN_PORT_CODE').val());
     		$.getJSON(ajaxURL, function(jd) {
     			if($('#IN_PORT_CODE').val() !=null && $('#IN_PORT_CODE').val() != 'PHX' && $('#IN_PORT_CODE').val() != ''){
     				$('#IN_TRUCKER').removeAttr("disabled");
     				$('#IN_TRUCKER').val('ALL');
	     			/*$('#IN_TRUCKER option').remove();
	     			$('#IN_TRUCKER').append('<option value="ALL" selected="selected">ALL</option>');
	     			var tarr = new Array();
	     			$(jd).each(function(key, val){
	     				if (val.type == "TR" && jQuery.inArray(val.CODE, tarr) === -1 ) {
	     	             tarr.push(val.CODE);
	     	             $('#IN_TRUCKER').append('<option value="' + val.CODE + '" >' + val.CODE + '</option>');
	     	    		}
	     				
	    			});*/
     			} else{
     				$('#IN_TRUCKER').attr("disabled", "disabled");
         			//$('#IN_AS_GROUP').removeAttr("disabled");
     			}
     			
     			$('#IN_TRADE option').remove();
     			$('#IN_TRADE').append('<option value="ALL" selected="selected">ALL</option>');
     			var tarr = new Array();
     			$(jd).each(function(key, val){
     				if (val.type == "TD" && jQuery.inArray(val.CODE, tarr) === -1 ) {
     	             tarr.push(val.CODE);
     	             $('#IN_TRADE').append('<option value="' + val.CODE.split("-",-1)[0] + '" >' + val.CODE.split("-",-1)[1] + '</option>');
     	    		}
     				
     			});
     			   
     		  });
     			   
     	});
     	
     	$('#IN_PORT_CODE').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#reefer').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#military').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#allother').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#spot').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#pull').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#delivery').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#liveload').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#liveunload').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#IN_THRU').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#IN_APPT_DATE').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#IN_TRADE').click(function() {
	   	     removeErrorPointers();
	   		});
     	$('#IN_STATUS').click(function() {
	   	     removeErrorPointers();
	   		});
     	
     	$('#planEquipFunctionCode').change(function() { 
     		if($('#planEquipFunctionCode').val() == '')
     			$('#planEquipFunctionCode').val('ALL');
     	});
     	
     	$('#planEquipLengthFeet').change(function() { 
     		if($('#planEquipLengthFeet').val() == '')
     			$('#planEquipLengthFeet').val('ALL');
     	});
     	
     	/*$('#planEquipHeightCode').change(function() { 
     		if($('#planEquipHeightCode').val() == '')
     			$('#planEquipHeightCode').val('ALL');
     	});*/
     	
     	var chktype =true;
		var chksize = true;
		
		$('#planEquipFunctionCode').click(function() {
   	     removeErrorPointers();
   		});
		$('#planEquipLengthFeet').click(function() {
	   	     removeErrorPointers();
	   		});
		$('#planEquipHeightCode').click(function() {
	   	     removeErrorPointers();
	   		});
		$("#planEquipFunctionCode").keydown(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if(chktype){
		    	 this.select();
		    	 chktype = false;
		     }
			});
		
		$("#planEquipFunctionCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#planEquipFunctionCode').val().length == 1){
			    	//$('#IN_VOY').focus();
			    	$('#planEquipLengthFeet').select();
			    	chktype =true;
		     }
			}); 
		$("#planEquipLengthFeet").focus(function(evt) {
			chksize = true;
		});
		
		$("#planEquipLengthFeet").keydown(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if(chksize){
		    	 this.select();
		    	 chksize = false;
		    	 $("#planEquipLengthFeet").val('');
		     }
			});
		
		$("#planEquipLengthFeet").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		  	if(chksize){
		    	 this.select();
		    	 chksize = false;
		    	 $("#planEquipLengthFeet").val('');
		     }
		     if($('#planEquipLengthFeet').val().length == 2){
			    	//$('#IN_VOY').focus();
			    	$('#planEquipHeightCode').select();
			    	//chkvoy = true;
		     }
			}); 
		$("#planEquipHeightCode").keyup(function(evt) {
			var theEvent = evt || window.event;
		  	var key = theEvent.keyCode || theEvent.which;
		  	if(key == '16' || key == '9' || key == '8' || key == '46')
		  		return;
		     if($('#planEquipHeightCode').val().length == 1){
			    	//$('#IN_VOY').focus();
			    	$('#IN_CONTAINER_NBR').focus();
			    	//chkvessel =true;
		     }
			}); 
		
     	$(":checkbox").click(function() {
     		 if($("#casQuickSearch").find(":checkbox:checked").length >0) {
     		 	$('#snd').removeAttr("disabled");
     		 	$('#printBtn').removeAttr("disabled");
     		 	$('#comp').removeAttr("disabled");
	     		$('#stat').removeAttr("disabled");
     		 } else {
     			 $('#snd').attr("disabled", "disabled");
     			$('#printBtn').attr("disabled", "disabled");
     			$('#comp').attr("disabled", "disabled");
     			$('#stat').attr("disabled", "disabled");
     		 }
     		 });
     	
     	$("td.dataField:contains('Appointment Date')").mandatory();
     	//$("td.dataField:contains('Trade')").mandatory();
     	//$("td.dataField:contains('Status')").mandatory();
     	$("td.dataField:contains('Category')").mandatory();
     	
     	$('#casQuickSearch th:nth-child(1):nth-child(1)').html('');
		$('#casQuickSearch th:nth-child(1):nth-child(1)').append('<input type="checkbox" id="chkbox" name="chkbox" class="fieldText">');
		
		$('#chkbox').bind('change', function () {
				var checkedStatus = this.checked;
	            $("#casQuickSearch td:nth-child(1) input:checkbox").each(function() {
	                this.checked = checkedStatus;
	            });
	            if($("#casQuickSearch").find(":checkbox:checked").length >0) {
	     		 	$('#snd').removeAttr("disabled");
	     		 	$('#printBtn').removeAttr("disabled");
	     		 	$('#comp').removeAttr("disabled");
		     		$('#stat').removeAttr("disabled");
	     		 } else {
	     			 $('#snd').attr("disabled", "disabled");
	     			$('#printBtn').attr("disabled", "disabled");
	     			$('#comp').attr("disabled", "disabled");
	     			$('#stat').attr("disabled", "disabled");
	     		 }
					
			}); 
     	
     	if(!_listonlySearchResult){
    		$('#displaydiv').gatesDisable();
    		$('#resultdiv').gatesDisable();
    	
    	}
        if( !(_print || _send || _complete ) ){
        	$("#casQuickSearch :checkbox").attr("disabled", "disabled");
    	
    	}
        if(!_print)
        	$("#printBtn").css('visibility','hidden');
        if(!_send)
        	$("#snd").css('visibility','hidden');
        if(!_complete)
        	$("#comp").css('visibility','hidden');

        
        if(!_typehyperLink){
        	$("#casQuickSearch td:nth-child(2)").each(function(){
				var aTxt = $(this).text();
			 	$(this).html(aTxt);  
			 });
        }
        
        tabSequence('#spotAndPullRequestSearchForm',false,false);
	});  // document ready function end


function truckerPopupSearch() {
	  var portlist = '';
	  if($('#IN_PORT_CODE').val() != null && $('#IN_PORT_CODE').val()=='ALL'){
		  $('#IN_PORT_CODE option').each(function() { 
				if($(this).attr('value') != 'ALL'){
					if(portlist.length>0)
						portlist += "-";
					portlist += $(this).attr('value')  ;
				}
			});
	  } else
		  portlist = $('#IN_PORT_CODE').val();
	var actionUrl = _context + '/cas/truckerSearchSpotAndPullLookup.do?filterValue1='+$('#IN_TRUCKER').val().split('-')[0]+'&filterValue2='+portlist+ '&autoSearch=true';
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'TruckerSearch', windowStyle);
}  

function truckerSearchUpdate(id){
	var values = id.split("|");
	$('#IN_TRUCKER').val(values[0]+'-'+values[1]);
}


function custNamePopupSearch() {
	var actionUrl = _context + '/cas/orgSearchLookup.do?filterValue1=ALL|ALL|BK|||'+($('#IN_SHIPPER').val().search("-") <=0 ?'ALL':encodeURIComponent($('#IN_SHIPPER').val().split("-",-1)[1]));
	var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	window.open(actionUrl, 'CustomerSearch', windowStyle);	
}


function orgSearchUpdate(id){
var values=id.split('|');
$('#IN_SHIPPER').val(values[0] + '-' + values[1]);
shipperId = values[2];



}
	
function removeErrorPointers(){
	$('form[name="spotAndPullRequestSearchForm"]').validationEngine('hideAll');
}


function send()
{
	var flag = 'true';
	var count = $("#casQuickSearch").find(":checkbox:checked").length;
	if(count!=1){
		alert("Please select only one Request");
		return false;
	}
	$("#casQuickSearch").find(":checkbox:checked").each(function(index) { 
		 if($(this).parent().parent().children("td:nth-child(5)").text()== ("COMPLETE") || 
				 $(this).parent().parent().children("td:nth-child(5)").text()== "INGATED" ||
				 $(this).parent().parent().children("td:nth-child(5)").text()== ("CANACK")) {
			 $('#snd').attr("disabled", "disabled");
			 alert("Status of the selected request should not be COMPLETE, INGATED or CANACK");
			 flag = 'false';
			 return false;
		 }
	 });
	if(flag == 'true'){
		var dispatchid = [];	
		$("#casQuickSearch").find(":checkbox:checked").each(function(index) { 
			 var values = $(this).val().split(",");
			 dispatchid.push(values[0]); 
		 });
		 //url call
		blockUI();
		 $.ajax({ 
             type: "GET", 
             datatype: "json", 
             url:'/gates/spotpull/sendFromSearchScreenSpotPullRequest?id='+ dispatchid, 
             data: '' , 
             success: function(responseText){ 
                     showMessages(responseText); 
             } 
		 });
		// searchValueDefault();
	}

}

function showMessages(responseText)  { 
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

          $('#msgDiv').html(messageContent); 
          $("input[name='msg_Div']").val($('#msgDiv').html()); 
          if(messageContent!='') 
          { 
                  window.scrollTo(0, 0); 
          } 
          searchValueDefault(); 
    } 
} 

function print()
{
	var count = $("#casQuickSearch").find(":checkbox:checked").length;
	/*if(count!=1){
		alert("Please select only one Request");
		return false;
	}*/
	var dispatchid = [];	
	$("#casQuickSearch").find(":checkbox:checked").each(function(index) { 
		 var values = $(this).val().split(",");
		 dispatchid.push(values[0]); 
	 });
    for(var i=0;i<dispatchid.length;i++)
	{
	var disId=dispatchid[i];
	if(disId!='on' && disId!= null &&  disId!='' && disId!='ALL' ){
	blockUI();
	var url='../spotpull/printFromSearchScreenSpotPullRequest/?id='+disId;
 	var newWindow = window.open(url,'name'+disId,'height=500,width=500');
 	newWindow.print();
 	}
	}
	$.unblockUI();
 	return false;

}

function complete()
{
	var flag = 'true';
	/*var count = $("#casQuickSearch").find(":checkbox:checked").length;
	if(count!=1){
		alert("Please select only one Request");
		return false;
	}*/
	$("#casQuickSearch").find(":checkbox:checked").each(function(index) { 
		 if($(this).parent().parent().children("td:nth-child(5)").text() == ("COMPLETE") ) {
			 $('#comp').attr("disabled", "disabled");
			 alert("Status of the selected request should not be COMPLETE");
			 flag = 'false';
			 return false;
		 }
	 });
	if(flag == 'true'){
		var dispatchid = [];	
		$("#casQuickSearch").find(":checkbox:checked").each(function(index) { 
			 var values = $(this).val().split(",");
			 if(values[0]!='on' && values[0]!= null &&  values[0]!='' && values[0]!='ALL' ){
				 dispatchid.push(values[0]);
				}
		 });
		 //url call
		blockUI();
		$.ajax({ 
            type: "GET", 
            datatype: "json", 
            url:'/gates/spotpull/completeSearchScreenSpotPullRequest?id='+ dispatchid, 
            data: '' , 
            success: function(responseText){ 
                    showMessages(responseText); 
            } 
		 });
	}

}

/*function status()
{
	var count = $(":checkbox:checked").length;
	if(count!=1){
		alert("Please select only one Request");
		return false;
	}
	var dispatchid = [];	
	 $(":checkbox:checked").each(function(index) { 
		 var values = $(this).val().split(",");
		 dispatchid.push(values[0]); 
	 });
	 //url call

}*/

function searchValueDefault(){
	
	if($('#IN_SHIPPER').val() != null && $('#IN_SHIPPER').val() != ""
		 && $('#IN_SHIPPER').val() != "ALL")
		$('#IN_SHIPPER').val($('#IN_SHIPPER').val() + '|' + shipperId);
	blockUI();
	postMethod('search',document.spotAndPullRequestSearchForm.method);
	return true;
}


	
	function setFormattedDate(fromDate){
		var d = $.datepicker.parseDate('mm-dd-yy',  fromDate);
		return $.datepicker.formatDate( "mm-dd-yy", d);
	}
	
	function searchValue(){
		$('#msgDiv').html('');
		
		
		$("input[name='msg_Div']").val('');
		
		/*document.getElementById('in_eq_fun_cd').value=document.getElementById('planEquipFunctionCode').value;
		document.getElementById('in_eq_len_ft').value=document.getElementById('planEquipLengthFeet').value;
		document.getElementById('in_eq_ht_cd').value=document.getElementById('planEquipHeightCode').value;*/
		
		if($('#IN_BOOKING_NUMBER').val() != null && $('#IN_BOOKING_NUMBER').val() != 'ALL' && 
				 ($('#IN_BOOKING_NUMBER').val().length !=7 || !isNumeric($('#IN_BOOKING_NUMBER').val())) ){
				$("#IN_BOOKING_NUMBER").validationEngine('showPrompt', 'Please provide valid Booking', 'error', true);
				return false;
		}
		
		if($('#IN_TRUCKER').val().indexOf('-') === -1)  
			$('#IN_TRUCKER').val('ALL');
		
		$("#IN_EQUIPMENT").val('ALL');
		
		if($('#planEquipLengthFeet').val()!= null && $('#planEquipLengthFeet').val()!= "ALL")
			$('#planEquipLengthFeet').val($('#planEquipLengthFeet').val().toUpperCase());
		if($('#planEquipFunctionCode').val()!= null && $('#planEquipFunctionCode').val()!= "ALL")
			$('#planEquipFunctionCode').val($('#planEquipFunctionCode').val().toUpperCase());
		if($('#planEquipHeightCode').val()!= null && $('#planEquipHeightCode').val()!= "ALL")
			$('#planEquipHeightCode').val($('#planEquipHeightCode').val().toUpperCase());
				
		var portlist = '';
		$('#IN_PORT_CODE option').each(function() { 
			if($(this).attr('value') != 'ALL'){
				if(portlist.length>0)
					portlist += "-";
				portlist += $(this).attr('value')  ;
			}
		});
		
		$('#IN_USER_PORT_LIST').val(portlist);
		
		var type = "";
		if($('#spot').is(':checked')){ type += "Y";}	else {type += "N";}
		if($('#pull').is(':checked')){ type += "Y";}	else {type += "N";}
		if($('#delivery').is(':checked')){ type += "Y";}	else {type += "N";}
		if($('#liveload').is(':checked')){ type += "Y";}	else {type += "N";}
		if($('#liveunload').is(':checked')){ type += "Y";}	else {type += "N";}
		if($('#emptyPickUp').is(':checked')){ type += "Y";}	else {type += "N";}
		
		$('#IN_TYPE').val(type);
		
		var category = "";
		if($('#reefer').is(':checked')){ category += "Y";}	else {category += "N";}
		if($('#military').is(':checked')){ category += "Y";}	else {category += "N";}
		if($('#allother').is(':checked')){ category += "Y";}	else {category += "N";}
		
		
		
		$('#IN_CATEGORY').val(category);
		if($('#IN_BOOKING_NUMBER').val() == null || $('#IN_BOOKING_NUMBER').val() == 'ALL'){ 
			
			if($('#IN_TYPE').val().indexOf("Y")<0 ){
				$("#liveunload").validationEngine('showPrompt', 'Please select at least one Type.', 'error', true);
				return false;
			}else if($('#IN_CATEGORY').val().indexOf("Y")<0 ){
				$("#allother").validationEngine('showPrompt', 'Please select at least one Category.', 'error', true);
				return false;
			}
			else if ($('#IN_PORT_CODE').val()== null || $('#IN_PORT_CODE').val()== "" ) {
				$("#IN_PORT_CODE").validationEngine('showPrompt', 'Port is mandatory.', 'error', true);
				return false;	
			}/*else if ($('#IN_TRADE').val()== null || $('#IN_TRADE').val()== "" ||  $('#IN_TRADE').val()== "ALL" ) {
				$("#IN_TRADE").validationEngine('showPrompt', 'Trade is mandatory.', 'error', true);
				return false;	
			}else if ($('#IN_STATUS').val()== null || $('#IN_STATUS').val()== "" ||  $('#IN_STATUS').val()== "ALL" ) {
				$("#IN_STATUS").validationEngine('showPrompt', 'Status is mandatory.', 'error', true);
				return false;	
			}*/else if ($('#IN_APPT_DATE').val()== null || $('#IN_APPT_DATE').val()== "" ||  $('#IN_APPT_DATE').val()== "ALL" ) {
				$("#IN_APPT_DATE").validationEngine('showPrompt', 'Appointment Date is mandatory.', 'error', true);
				return false;	
			}else if ($('#IN_THRU').val()== null || $('#IN_THRU').val()== "" ||  $('#IN_THRU').val()== "ALL" ) {
				$("#IN_THRU").validationEngine('showPrompt', 'Thru Date is mandatory.', 'error', true);
				return false;	
			}
		}
		/*else {
			$('#IN_APPT_DATE').val('ALL');
			$('#IN_THRU').val('ALL');
		}*/
		
		if (($('#IN_APPT_DATE').val()== null || $('#IN_APPT_DATE').val()== "" ||  $('#IN_APPT_DATE').val()== "ALL" ) 
				&& $('#IN_THRU').val()!= null && $('#IN_THRU').val()!= "" &&  $('#IN_THRU').val()!= "ALL"  ){
			$("#IN_APPT_DATE").validationEngine('showPrompt', 'Please enter Appointment Date.', 'error', true);
			return false;
		} else if (($('#IN_THRU').val()== null || $('#IN_THRU').val()== "" ||  $('#IN_THRU').val()== "ALL" ) && 
				$('#IN_APPT_DATE').val()!= null && $('#IN_APPT_DATE').val()!= "" &&  $('#IN_APPT_DATE').val()!= "ALL" ) {
			$("#IN_THRU").validationEngine('showPrompt', 'Please enter Thru Date.', 'error', true);
			return false;	
		}
		if($('#planEquipLengthFeet').val()!= null && $('#planEquipLengthFeet').val()== "24" && $('#IN_TRADE').val()!= null
				&& ($('#IN_TRADE').val().split('-')[0]== 'G' || $('#IN_TRADE').val().split('-')[0]== 'F')){
			$("#planEquipHeightCode").validationEngine('showPrompt', ' 24 Feet equipment length  is not allowed when the trade is G or F', 'error', true);
			return false;	
		}
		else if($('#planEquipLengthFeet').val()!= null && $('#planEquipLengthFeet').val()== "45" && $('#IN_PLACE_OF_DELIVERY').val()!= null
				&& ($('#IN_PORT_OF_DISCHARGE').val().split('-')[0]== 'PUX' || $('#IN_PORT_OF_DISCHARGE').val().split('-')[0]== 'YAP'
					|| $('#IN_PORT_OF_DISCHARGE').val().split('-')[0]== 'UUK' || $('#IN_PORT_OF_DISCHARGE').val().split('-')[0]== 'PNP'	)){
			$("#IN_PORT_OF_DISCHARGE").validationEngine('showPrompt', ' 45 Feet equipment is not allowed for PODe PUX , YAP , UUK or PNP', 'error', true);
			return false;	
		}
		else if((($('#IN_THRU').datepicker("getDate")).getTime()-($('#IN_APPT_DATE').datepicker("getDate")).getTime()) <0){
			$("#IN_THRU").validationEngine('showPrompt', 'Thur Date cannot be less than from date.', 'error', true);
			return false;	
		}else if(((($('#IN_THRU').datepicker("getDate")).getTime()-($('#IN_APPT_DATE').datepicker("getDate")).getTime())/(1000*60*60*24)) >31){
			$("#IN_THRU").validationEngine('showPrompt', 'Date Range cannot be greater than 31 days.', 'error', true);
			return false;	
		}
		/*else if(!($('#planEquipLengthFeet').val()!= null && $('#planEquipLengthFeet').val()== "ALL" &&
				$('#planEquipFunctionCode').val()!= null && $('#planEquipFunctionCode').val()== "ALL" )){
				if(!($('#planEquipLengthFeet').val()!= "ALL" && $('#planEquipFunctionCode').val()!= "ALL" 
						)){
					$("#planEquipHeightCode").validationEngine('showPrompt', 'Please enter All Equipment fields.', 'error', true);
					return false;	
				}else if($('#planEquipLengthFeet').val()!= "ALL" && $('#planEquipLengthFeet').val().length != 2){
					$("#planEquipHeightCode").validationEngine('showPrompt', 'Please enter Correct Equipment Length.', 'error', true);
					return false;	
				}*/
				
		var equpval = '';
		if($('#planEquipFunctionCode').val()== null || $('#planEquipFunctionCode').val()== ''
			|| $('#planEquipFunctionCode').val()== ' ' || $('#planEquipFunctionCode').val()== 'ALL')
			equpval = '*';
		else 
			equpval = $('#planEquipFunctionCode').val();
		
		
		if($('#planEquipLengthFeet').val()== null || $('#planEquipLengthFeet').val()== ''
			|| $('#planEquipLengthFeet').val()== ' ' || $('#planEquipLengthFeet').val()== 'ALL')
			equpval += '**';
		else {
			if($('#planEquipLengthFeet').val()!= "ALL" && $('#planEquipLengthFeet').val().length != 2){
				$("#planEquipHeightCode").validationEngine('showPrompt', 'Please enter Correct Equipment Length.', 'error', true);
				return false;	
			}
			equpval += $('#planEquipLengthFeet').val();
		}
		
		
		if($('#planEquipHeightCode').val()== null || $('#planEquipHeightCode').val()== '')
			equpval += '?';
		else if($('#planEquipHeightCode').val()== ' ' || $('#planEquipHeightCode').val()== 'ALL')
			equpval += '$';
		else
			equpval += $('#planEquipHeightCode').val();
		
		$("#IN_EQUIPMENT").val(equpval);
		
		$('#IN_VESSEL').val($('#IN_VESSEL').val().toUpperCase());
		$('#IN_VOYAGE').val($('#IN_VOYAGE').val().toUpperCase());
		$('#IN_DIRECTION').val($('#IN_DIRECTION').val().toUpperCase());
		
		if($('#IN_VESSEL').val()!= null && $('#IN_VESSEL').val()!= "ALL"  && $('#IN_VESSEL').val()!= ""
			&& $('#IN_VOYAGE').val()!= null && $('#IN_VOYAGE').val()!= "ALL" && $('#IN_VOYAGE').val()!= ""
				&& $('#IN_DIRECTION').val()!= null && $('#IN_DIRECTION').val()!= "ALL" && $('#IN_DIRECTION').val()!= "") {
			if($('#IN_VOYAGE').val().length == 2)				
				$('#IN_VOYAGE').val('0' + $('#IN_VOYAGE').val());
			else if($('#IN_VOYAGE').val().length == 1)
				$('#IN_VOYAGE').val('00' + $('#IN_VOYAGE').val());
			
			
			
        	$.ajax
    	    ({
    	          type: "POST",
    	        url: _context+'/cas/autocomplete.do?method=getTripFromFirstVV&parentSearch='+$('#IN_VESSEL').val()+"-"+$('#IN_VOYAGE').val()+"-"+$('#IN_DIRECTION').val(),
    	        //datatype: "java.lang.String", 
    	          success: function(data)
    	          {	
    	    	  
    	        	  if(data=='true' ){
    	        		  blockUI();
    	        		  postMethod('search',document.spotAndPullRequestSearchForm.method);
    	        		  //$.unblockUI();
    	        	   }
    	        	  else
    	        		  $("#IN_DIRECTION").validationEngine('showPrompt', 'Please provide valid VVD.', 'error', true); 
    	          },
    		    error: function(request,status,errorThrown) {
    		    	$("#IN_DIRECTION").validationEngine('showPrompt', 'Please provide valid VVD.', 'error', true);
    		      }

    	       }); 
        	}		
			else {	
			
		if($('#IN_SHIPPER').val() != null && $('#IN_SHIPPER').val() != ""
			 && $('#IN_SHIPPER').val() != "ALL")
			$('#IN_SHIPPER').val($('#IN_SHIPPER').val() + '|' + shipperId);
			blockUI();
			postMethod('search',document.spotAndPullRequestSearchForm.method);
			}
		return true;
	}
	
	
	function resetForm(){
		//$('#TRUCKER_CODE').removeAttr("disabled");
	 	resetFileds(document.spotAndPullRequestSearchForm);
	 	
	 	$('#msgDiv').html('');
		
		$("input[name='msg_Div']").val('');
	 	$('#resultdiv').remove();
		removeErrorPointers();
	 	
	 	var now = new Date();
	 	now.setDate(now.getDate()+5);
		$('#IN_THRU').val(setFormattedDate($.datepicker.formatDate('mm-dd-yy',now)));
		
		now = new Date();
	 	now.setDate(now.getDate()-1);
		var priorDate = $.datepicker.formatDate('mm-dd-yy',now);
		$('#IN_APPT_DATE').val(setFormattedDate(priorDate));
		
		$('#spot').attr("checked", "checked");
		$('#pull').attr("checked", "checked");
		$('#delivery').attr("checked", "checked");
		$('#liveload').attr("checked", "checked");
		$('#liveunload').attr("checked", "checked");
		
		$('#reefer').attr("checked", "checked");
		$('#military').attr("checked", "checked");
		$('#allother').attr("checked", "checked");
		$('#planEquipLengthFeet').val('ALL');
		$('#planEquipFunctionCode').val('ALL');
		$('#planEquipHeightCode').val('ALL');
		$("#IN_EQUIPMENT").val('ALL');
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
		dt1 = date.substring(2,4);
		mon1 = date.substring(0,2);
		year1 = date.substring(4,6);
		newDate=mon1+"-"+dt1+"-20"+year1;
		} else if(dateSize == 8){
		dt1 = date.substring(2,4);
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
		if(i==1){
		$('#IN_APPT_DATE').val("ALL");
		$("#IN_APPT_DATE").validationEngine('showPrompt', 'From Appointment Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
		_validated=false;
		}
		if(i==2){
		$('#IN_THRU').val("ALL");
		$("#IN_THRU").validationEngine('showPrompt', 'To Appointment Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
		_validated=false;
		}
		if(i==3){
			$('#IN_SENT').val("ALL");
			$("#IN_SENT").validationEngine('showPrompt', 'Sent On or Before Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)', 'error', true);
			_validated=false;
			}
		}else{
		if(i==1){
		$('#IN_APPT_DATE').val(newDate);
		}
		if(i==2){
		$('#IN_THRU').val(newDate);
		}
		if(i==3){
			$('#IN_SENT').val(newDate);
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
	
	/*function replaceWithCheckBox($obj, checkedValue) {

		var status=false;
		
		if(checkedValue=="Y" ){
			status=true;
		}else if (checkedValue=="N"||checkedValue=="ALL"){
			status=false;
		}
		
		 if ($obj.length == 0) return; 
		 var $elemx = $(document.createElement("input"));
		 var name = $obj[0].name;
		 var id = $obj[0].id;
		 var value = $obj[0].value;
		 var val = (value == checkedValue);
		 $elemx.attr({type:'checkbox',id:id,name:name,checked:val,defaultChecked:val,value:checkedValue});
		 $obj.replaceWith($elemx); 
		 
		// $("#IN_TYPE_SPOT").attr("checked", status);//should be checked by default
	}*/
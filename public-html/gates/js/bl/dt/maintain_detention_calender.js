$(document).ready(function () {
	$('#detentionCalenderForm').validationEngine('attach');
	$('#year').validationEngine('validate');
	
	makeGrid();


	$(function() {
		tabSequence('#detentionCalenderForm');
		tabseq();//Defect-18468
		
	});	
	function tabseq(){
		$('a').addClass('noTab');
		$('.ui-pg-selbox').addClass('noTab');
		$('.ui-pg-input').addClass('noTab');
		}
	

	$('#fetchCalenderInfo').click(function() {
		
		if($("#year").val()==0 || ($("#year").val().length<4 ||$("#year").val().length>4))
		{
			$("#year").validationEngine('showPrompt', 'Year should be of 4 digits', 'error', true);
			return false;
		}
		else{
			if($("#year").val()==0000)
			{
				$("#year").validationEngine('showPrompt', 'Please enter Valid Year', 'error', true);
				return false;
			}
			else
			{
				if(isAnyChangeOnPage()) {
					if(!confirm('You have unsaved changes!')) {
						return;
					}
				}
				displayCalender();
				captureOnlyGridActions();
				return true;
			}
		}
	});

	function makeGrid() {
		var colNames=['','Holiday','Date','Actions'];
		var colModel=[   
		              {name:'id',index:'id',hidden:true},
		              {name:'holidaydsc',index:'holidaydsc', width:400,editrules:{required:true},editable:true,classes : 'toUpperCaseInGrid'},
		              {name:'date',index:'date', width:400, editrules:{required:true,custom:true,custom_func:validateDate}, editable:true,  
		            	  editoptions:{size:250,maxlength:10,
		            		  dataInit:function(el){ $(el).datepicker(
		            				  {
		            					  dateFormat:'mm-dd-yy', 

		            				  }
		            		  ).width(150); 
		            		  },  

		            	  }},
		            	  {name:'actions', width:250, sortable:false,formatter:'actions', 
		            	  formatoptions : {
									keys : true,
									editbutton:true,
									delbutton:true,
									
		            	  }}];
		var jsonReaderSpSvc = {
				root : "rows",
				page : "page",
				total : "total",
				records : "records",
				repeatitems : false,
				cell : "cell",
				id : "id"
			};

		var detentionCalenderGridLoadComplete = function() {
			if(isMaintainDetentionCalendarAdd){
				$('#sData').show();
				$('#gview_calenderdetailsGrid input').css("visibility", 'visible');
			}else{
				$('#sData').hide();
				$('#gview_calenderdetailsGrid input').css("visibility", 'hidden');
			}
		};
		createGrid(
				'calenderdetailsGrid', // grid id for Standing Instruction
				'calenderDetails', // page id for Standing Instruction
				_context+'/detentionCalender/loadCalenderGrid',
				_context+'/detentionCalender/addgridrow',
				_context+'/detentionCalender/updategrid', // edit url
				_context+'/detentionCalender/deletegrid',// delete url
				'',
				colNames,
				colModel, 
				'Calendar Details',
				'auto'
				,20 ,[20,30,40] ,
				false, /* multiselect */
				false, /* multidelete */
				false,
				false/* isReadOnly */,
				jsonReaderSpSvc, (isMaintainDetentionCalendarUpdate==true?false:true), (isMaintainDetentionCalendarDelete==true?false:true), true,
				true, false, false, false, false,
				detentionCalenderGridLoadComplete, false, true);
	}
	function displayCalender(){


		$.ajax({
			type :"POST",
			url  :_context + "/detentionCalender/populateHoliday",
			data :{
				year : $("#year").val(),
			},
			success : function(responseText) {

				// Clear fields of Shipment form and reset the defaults

				if (responseText.success==true) {

					$("#calenderdetailsGrid").trigger('reloadGrid');
					if (responseText.messages) {
						var messages = responseText.messages;
						var messageContent = '';
						
				if(true)
					{
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
					}

						
						$('#msgDiv').html('').append(messageContent);
					} 
					document.getElementById('jqgrid1').innerHTML='<table id="calenderdetailsGrid"></table>'+
					'<div id="calenderDetails"></div>';
					makeGrid();
				}
			}

		});
	}
	$(function() {
		$('#saveCalender').click(function(){		
			saveCalender();
			captureOnlyGridActions();
		});
	});


	function saveEnable()
	{
		if($('#enableSave').val()=="false"||$('#enableSave').val()==false)
		{
		$('#saveCalender').attr('abled', true);
		}
	
	}
	function saveCalender(){ 
		showSavingMessage();
		var calender = $('#detentionCalenderForm').formSerialize();
		var urlStr = '';
		urlStr = _context + "/detentionCalender/createUpdate";
		$.ajax({
			type : "POST",
			url : urlStr,
			data : calender,
			success : function(responseText) {

				// Clear fields of Shipment form and reset the defaults

				if (responseText.success==true) {
					
					$("#calenderdetailsGrid").trigger('reloadGrid');
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
					$("#calenderdetailsGrid").trigger('reloadGrid');
					
					document.getElementById('jqgrid1').innerHTML='<table id="calenderdetailsGrid"></table>'+
					'<div id="calenderDetails"></div>';
					makeGrid();					
				}
			}

		}});
	}

	function showSavingMessage() {

		//alert("Successfully saved");
		$('#msgDiv').html("<div class=\"message_info\"Saved.</div>");

		$('#msgDiv').show();
	}	 

	
	function validateDate(dateControl, colname) {
		
		var valid = isGoodDate(dateControl);
		if (valid) {
			var r=dateControl.split("-");
			
			var month=r[0];
			var day=r[1];
			var year=r[2];
			if(day>31||day=="0"||day=="00"||month=="0"||month=="00"||month>"12"||year=="0000"){
				return [false,"Invalid Date"];
			}
			
			 if (day=="31" && (month=="4" || month =="6" || month=="9" ||
					 				  month=="11" || month=="04" || month=="06" ||
					 				  month=="09")) {
				 							return [false,"Invalid Date"]; // only 1,3,5,7,8,10,12 has 31 days
			 				} else if (month=="2" || month=="02"){
				    	 
				    	//leap year
						  if(year % 4==0){
							  if(year%100==0&&year%400==0)
								 {
								  	if(day=="30" || day=="31"){
										 
									  return [false,"Invalid Date"];
								  }
								  else{
									  return [true,''];
								  }
								 }
							  else
								  {
								  if(day=="30" || day=="31"||day=="29"){
										 
									  return [false,"Invalid Date"];
								  }
								  else{
									  return [true,''];
								  }
								  }
							
						  } else{
						         if(day=="29"||day=="30"||day=="31"){
						        	 return [false,"Invalid Date"];
							         }
						         else{
							        	 return [true,''];
						         	}
							  }
				     }else
				    	 {
				    	 	return [true,''];
				    	 }
		} 
		
		else {
			return [false,"Date entered is not a valid Date. Enter date in Format(MM-dd-yyyy)"];
		}
		
		return valid;
	}
	
	
	
	function isGoodDate(dt){
	    var a = dt.match(/\d{2}-\d{2}-\d{4}/);
	    return a;
	}

	captureOnlyGridActions();
	
	/*Shipment Security*/
	enforceSecurityTitle(isMaintainDetentionCalendarDisplayOnly);
	enforceSecurityDivAndButtons("jqgrid1",isMaintainDetentionCalendarDisplayOnly);
	enforceSecurityDivAndButtons("contentdiv",isMaintainDetentionCalendarDisplayOnly);
	enforceSecurityDivAndButtons("buttondiv",isMaintainDetentionCalendarDisplayOnly);	
	enforceSecurityDivAndButtons("saveCalender", isMaintainDetentionCalendarModifiable);
	

	
});


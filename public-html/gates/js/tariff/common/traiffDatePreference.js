var somethingChanged = false;
var originalDate="";
var newDate="";
var isChange=false;
var count=0;
$(function() {
	originalDate=$('input[name="prefDateSessionVar"]').val();	
	$('#serverresp').hide();
	$( "#preferencedate" ).datepicker({dateFormat: 'mm-dd-yy'});
		$('#preferencedate').change(function() {
			newDate=$('#preferencedate').val();
			if(originalDate!=newDate){
				isInputChange=true;
				isChange=true;
			}
		});
		$('#preferencedate').blur(function() {
/*			if(originalDate!=null && originalDate!=""){
				$( "#preferencedate" ).val(originalDate);
			}*/
			if($( "#preferencedate" ).val()=="ALL"){
				$( "#preferencedate" ).val("");
			}
		});
		$('#group_preference').dialog({
			autoOpen: false,
			width: 400,
			modal: true,
			beforeClose: function() {
				 var ready = closePrefPopUp();
				 return ready;
		        },
		});
		
		$('#prefCancel').click(function(){
			count=1;
			closePrefPopUp();
		});

        $('.prefrences').click(function() {
			isInputChange=true;
			$.ajax({
				   type: "GET",
				   url: _context +"/tariffGroup/onOpenPreferencedialog?",
				   success: function(msg){
					   if(msg!=null && msg!=""){
						   $("#preferencedate" ).val(msg);
						   return;
						}
				   }
			});
			count=0;
			$("#preferencedate" ).val(originalDate);
			$('#group_preference').dialog('open');
			$('#serverresp').hide();
			return false;
		});

		$('#preferencedate').keyup(function() {
			$('#serverresp').hide();
		});
		
		$('#preferencedate').click(function() {
			$('#serverresp').hide();
		});
 }); 

 function saveUserPreference(){
		var preferenceDate = $('#preferencedate').val();
		
		if (isChange == true) {
			var isValidateDate= isValidDate(preferenceDate);
			if(isValidateDate==null ){
				alert('Default Effective Date entered is not a valid Date.Enter date in Format(MM-dd-yyyy)');
			}
			else{

				$.ajax({
					   type: "GET",
					   url: _context +"/userPreference/savePreference?",
					   data: "preferenceDate="+ preferenceDate,
					   success: function(msg){
						   newDate=$("#preferencedate").val();
						   //$('#prefDateSessionVar').val(newDate);
						   isInputChange=true;
						   isChange = false; 
						   originalDate=newDate;
						   count=0;
						   $('#group_preference').dialog('close');
						 }
					 });
			}
		}
		else{
			alert("No fields have changed. Cannot update");
		}
	 }
	function closePrefPopUp() {
		if(count!=0 && count!=-1){
			if (isChange==true) {
				 var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true){
					 $("#preferencedate" ).val($('#prefDateSessionVar').val());
					 count=-1;
					 isChange=false;
					 $('#serverresp').hide();
					 $('#group_preference').dialog('close');
					 return true;
					
				  }
				 else{
					 return false;
				 }
			}
			else
			{
				count=-1;
				 $('#serverresp').hide();
				 $('#group_preference').dialog('close');
				 return true;
			}
		}
		else if(count==0){
			if (isChange==true) {
				 var r=confirm("All the unsaved Changes will be discarded!");
				 if (r==true){
					 $("#preferencedate" ).val( $('#prefDateSessionVar').val());
					 isChange=false;
					 $('#serverresp').hide();
					 return true;
				  }
				 else{
					 return false;
				 }
			}
			else
			{
				 $('#serverresp').hide();
				 return true;
			}
		}
	}
	function preference() {
		$.ajax({
			   type: "GET",
			   url: _context +"/tariffGroup/onOpenPreferencedialog?",
			   success: function(msg){
				   if(msg!=null && msg!=""){
					   $("#preferencedate" ).val(msg);
					   return;
					}
			   }
		});
		$('#group_preference').dialog('open');
	}

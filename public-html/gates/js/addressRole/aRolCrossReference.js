$(document).ready(function() {
	$('#isSourceArolActive').attr('disabled',true);
	$('#isDestinationArolActive').attr('disabled',true);
	$('#sourceTrades').attr('disabled',true);
	$('#destinationTrades').attr('disabled',true);
	
	
	// attach validation engine with form
	//$("#addressRoleCrossReferenceForm").validationEngine('attach');
	
	$('#sourceStatus').attr('checked',$('#isSourceArolActive').val() );
	$('#destinationStatus').attr('checked',$('#isDestinationArolActive').val() );
	
	// configuration for multi select boxes
	$.configureBoxes({
		useFilters : false,
		useCounters : false
	});

    if(($("#sourceAddressRoleId").val()==null || $("#sourceAddressRoleId").val()=="") &&
    		($("#destinationAddressRoleId").val()==null || $("#destinationAddressRoleId").val()==""))
    {
    	$("#saveXref").attr("disabled", true);    	
	}
    else
	{
		/*$("#sourceOrganizationName").attr("disabled", true);
		$("#destinationOrganizationName").attr("disabled", true);
		$("#searchXref").attr("disabled", true);  */ 
	}
	
   $('#saveXref').click(function(){ 
	   if($("#addressRoleCrossReferenceForm").validationEngine('validate')){
		    $('#isSourceArolActive').attr('disabled',false);
			$('#isDestinationArolActive').attr('disabled',false);
			
		    submitAllSelect();
		    
		    var numberOfBox2Rows = getControl('box2View').options.length;
			   if(numberOfBox2Rows > 0){
				   $("#addRemoveReferenceTypeFlag").val('add');
			   } else {
				   $("#addRemoveReferenceTypeFlag").val('remove');
			   }
		    
			$("#addressRoleCrossReferenceForm").submit(); 
	  	}else{
	  		return false;
	  	}   
   });
   
   $('#searchXref').click(function(){
	   if($("#sourceAddressRoleId").val()==null || $("#sourceAddressRoleId").val()=="")
		{
		   $("#sourceOrganizationName").val(""); 
			$("#sourceOrganizationName").validationEngine('showPrompt', 'Please Search a valid source address role.', 'error', true);
		}
	   else if($("#destinationAddressRoleId").val()==null || $("#destinationAddressRoleId").val()=="")
		{
		   $("#destinationOrganizationName").val(""); 
			$("#destinationOrganizationName").validationEngine('showPrompt', 'Please Search a valid destination address role.', 'error', true);
		}
	   else /*if($("#addressRoleCrossReferenceForm").validationEngine('validate'))*/{
			document.location.href =_context+'/addressrole/crossreference/get?sId='+
			document.addressRoleCrossReferenceForm.sourceAddressRoleId.value+"&dId="+
			document.addressRoleCrossReferenceForm.destinationAddressRoleId.value+"&action=session"; 
   	}/*else{
   		return false;
   	}*/
   });

   $('#cancelXref').click(function(){
	   if ($('#searchPage').val()=="arolsrch")
		   {
		   
		   	document.location.href =_context+'/cas/addressRoleSearch.do';
		   }
	   
	   else if ($('#searchPage').val()=="arol")
	   {
		   if($("#sourceAddressRoleId").val().length==0)
			   {
			   	document.location.href =_context+'/addressRole/viewAdd';
			   }
		   else
			   {
			   		document.location.href =_context+'/addressRole/edit?addressRoleId='+$("#sourceAddressRoleId").val();
			   }
	   }
	   else if ($('#searchPage').val()=="refhistsrch")
	   {
		   	document.location.href =_context+'/cas/addRoleCrossRefHistSearch.do';
	   } 
	   
	   else
		   {
		   		document.location.href =_context+'/cas/addressRoleCrossReferenceSearch.do';
		   }
	   
   });
   
	$('#sourceOrganizationName').blur(function(){
		if($("#sourceOrganizationId").val()==null || $("#sourceOrganizationId").val()==""){
        	$("#sourceOrganizationName").val(""); 
    	}
		else if($("#sourceOrganizationName").val()=="")
		{
			$("#sourceOrganizationId").val("");
		}
    });
	$('#destinationOrganizationName').blur(function(){
		if($("#destinationOrganizationId").val()==null || $("#destinationOrganizationId").val()==""){
        	$("#destinationOrganizationName").val(""); 
    	}
		else if($("#destinationOrganizationName").val()=="")
		{
			$("#destinationOrganizationId").val("");
		}
    });
   
});



	function removeErrorPointers(){
		   $('#organizationAddressForm').validationEngine('hideAll');
		   $("#sourceOrganizationName").validationEngine('hideAll');
		   $("#destinationOrganizationName").validationEngine('hideAll');
	}
//methods for selecting all values from multi select menu
function submitAllSelect() {
	selectAll(getControl('box2View'));
}

function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (!tmpOptObj.selected)
			tmpOptObj.selected = true;
	}// end if
}// closing Select All Function


var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};


///*  <!--  JS FOR COLLAPSE/EXPAND -->  */
//
//// Add Organization Authorization 
//animatedcollapse.addDiv('authorization', 'fade=0,speed=1,hide=1')
//
//animatedcollapse.ontoggle=function($, divobj, state){ 
//	}
//
////INITIALIZT COLLAPSE/EXPAND
//animatedcollapse.init()

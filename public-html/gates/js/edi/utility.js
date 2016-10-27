 var isChanged = false;
 
jQuery.extend({
    stringify  : function stringify(obj) {         
        if ("JSON" in window) {
            return JSON.stringify(obj);
        }

        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';

            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);

            for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") {
                        v = '"' + v + '"';
                    } else if (t == "object" && v !== null){
                        v = jQuery.stringify(v);
                    }

                    json.push((arr ? "" : '"' + n + '":') + String(v));
                }
            }

            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
});

function removeTestErrorPointers() {	
	$("#CustomerAuth").validationEngine('hideAll');	
}	

function removeCAErrorPointers() {	
	$("#CustomerAuth").validationEngine('hideAll');	
}
function buildServiceContractDialog(addOp){		
	
	$( "#maintainServiceContractDialog" ).dialog({
		autoOpen: false, 
		width: 1050,
		modal: true,
		closeOnEscape: false,
		open : function() {
			tabSequence('#maintainServiceContractDialog',false,false);
		},
		beforeClose: function() {

		},
		close : function(ev, ui) {
			$("#CustomerAuth").validationEngine('hideAll');
		    $(this).remove();
		 },
		buttons : {	        
		}
	});
	
	var buttons = new Array();
	 buttons.push({
	        text: "Exit",
	        click: function() { 
				if(isChanged==true){						
					var r = confirm("All the unsaved Changes will be discarded!");
					if (r == true) {
						$("#CustomerAuth").validationEngine('hideAll');
			        	$("#maintainServiceContractDialog").dialog("close"); 
			        	searchValue();
					}				
				}
				else{
		        	$("#CustomerAuth").validationEngine('hideAll');
		        	$("#maintainServiceContractDialog").dialog("close"); 
		        	searchValue();
		        	
				}
	        	
	        }
	    });
	 
	 buttons.push({
	        text: "Save",
	        click: function() { callServiceContractSave(false); }
	    });
	 
	 if(addOp != null && addOp=='Y'){
		 buttons.push({
		        text: "Save & Add Next",
		        click: function() { callServiceContractSave(true); }
		    });		
	 }
   $( "#maintainServiceContractDialog" ).dialog( "option", "buttons",  buttons );
}
function callServiceContractSave(nextFlag){
	var queryString = $('#CustomerAuth').formSerialize();
	if ( !$("#CustomerAuth").validationEngine('validate') ) {
		return;
	}
	actionUrl = _context+"/edi/serviceContractValidate";
	$.ajax({
		url: actionUrl,
		type: "POST",
		cache:false,
		data: queryString,
		success: function(responseText){
			if(responseText.success){
				saveServiceContract(nextFlag);
			}else{
				var msg = "";
				 $.each(responseText.messages.error,function(index,node){					 
					 msg += "\n"+node;
				 }); 
				//$("#msgDiv").empty();
				//$("#msgDiv").append(msg);
				alert(msg); 
			}		
			
		}
	});
}
function saveServiceContract(nextFlag){
	
	var queryString = $('#CustomerAuth').formSerialize();
	
	if ( !$("#CustomerAuth").validationEngine('validate') ) {
		return;
	}	

	actionUrl = _context+"/edi/serviceContractSave";
	$.ajax({
		url: actionUrl,
		type: "POST",
		data: queryString,
		success: function(responseText){
			
			$('#CustomerAuth').validationEngine('hideAll');
			if(responseText.success){
				if(nextFlag){
					$("#format").val("");
					$("#document").val("");
						
					$("#msgDiv").empty();
					$("#msgDiv").append("Operation completed successfully.");
					isChanged=false;
					console.log("Setting isChanged to false, now isChanged:"+isChanged);
				}else{
					$("#msgDiv").empty();
					$("#msgDiv").append("Operation completed successfully.");
					isChanged=false;
					console.log("Setting isChanged to false, now isChanged:"+isChanged);
					//searchValue();
				}
			}else{
				$("#msgDiv").empty();
				$("#msgDiv").append("Operation not completed successfully.");
			}
			
			
		}
	});
}

function buildCustomerAuthorizationDialog(addOp){		
	
	 $( "#maintainCustomerAuthorizationDialog" ).dialog({
		autoOpen: false, 
		width: 1100,
		modal: true,
		closeOnEscape: false,
		open : function() {
			//This will order tabbing from top to bottom then left to right
			tabSequenceCustom('#maintainCustomerAuthorizationDialog',false,false);
		},
		close : function(ev, ui) {
		    $(this).remove();
		 },
		buttons : {       
		}
	});
	 
	 var buttons = new Array();
	 buttons.push({
	        text: "Exit",
	        click: function() { 
				console.log("isChanged value in utility js:"+isChanged);
				if(isChanged==true){
					var r = confirm("All the unsaved Changes will be discarded!");
					if (r == true) {
						$("#CustomerAuth").validationEngine('hideAll');
			        	$("#maintainCustomerAuthorizationDialog").dialog("close");
			        	searchValue();
					}				
				}
				else{
		        	$("#CustomerAuth").validationEngine('hideAll');
		        	$("#maintainCustomerAuthorizationDialog").dialog("close");
		        	searchValue();
				}
	        }
	    });
	 
	 buttons.push({
	        text: "Save",
	        click: function() { callSaveCA(false); }
	    });
	 
	 if(addOp != null && addOp=='Y'){
		 buttons.push({
		        text: "Save & Add Next",
		        click: function() { callSaveCA(true);  }
		    });		
	 }
    $( "#maintainCustomerAuthorizationDialog" ).dialog( "option", "buttons",  buttons );
}
function addCommnetsButton(){
	$(":button:contains('Save')").after('<span id=comment_link1><a class="comments" href="#"></a><span id ="count"></span></span>');

}
function buildTradingPartnerDialog(addOp){		
	
	 $( "#maintainTPDialog" ).dialog({
		autoOpen: false, 
		width: 1100,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {					
			var r = confirm("All the unsaved Changes will be discarded!");
			if (r == false) {
				return false;
			}					
		},
		close : function(ev, ui) {
		    $(this).remove();
		 },
		buttons : {       
		}
	});
	 
	 var buttons = new Array();
	 buttons.push({
	        text: "Exit",
	        click: function() { $("#tradePartnerForm").validationEngine('hideAll');$("#maintainTPDialog").dialog("close"); }
	    });
	 
	 buttons.push({
	        text: "Save",
	        click: function() { saveTradingPartner(); }
	    });
	 
	/* if(addOp != null && addOp=='Y'){
		 buttons.push({
		        text: "Save & Add Next",
		        click: function() { saveCANext(); }
		    });
	 }*/
	
  $( "#maintainTPDialog" ).dialog( "option", "buttons",  buttons );
}

function saveTradingPartner(){
	
	var queryString = $('#tradePartnerForm').formSerialize();
	if ( !$("#tradePartnerForm").validationEngine('validate') ) {
		return;
	}
	actionUrl = _context+"/tradingPartner/saveTP";
	$.ajax({
		url: actionUrl,
		type: "POST",
		cache:false,
		data: queryString,
		success: function(responseText){
			if(responseText.success){
				searchValue();
			}else{
				var msg = "";
				 $.each(responseText.messages.error,function(index,node){					 
					 msg += "\n"+node;
				 });				
				alert(msg); 
			}	
		}
	});
}

function callSaveCA(nextFlag){
	var queryString = $('#CustomerAuth').formSerialize();
	if ( !$("#CustomerAuth").validationEngine('validate') ) {
		return;
	}
	var validateStatus = false;
	actionUrl = _context+"/edi/validateCA";
	$.ajax({
		url: actionUrl,
		type: "POST",
		cache:false,
		data: queryString,
		success: function(responseText){
			if(responseText.success){
				saveCA(nextFlag);
			}else{
				var msg = "";
				 $.each(responseText.messages.error,function(index,node){					 
					 msg += "\n"+node;
				 }); 
				//$("#msgDiv").empty();
				//$("#msgDiv").append(msg);
				alert(msg); 
			}			
		}
	});
}
function saveCA(nextFlag){
	var queryString = $('#CustomerAuth').formSerialize();
	actionUrl = _context+"/edi/add";
	$.ajax({
		url: actionUrl,
		type: "POST",
		cache:false,
		data: queryString,
		success: function(responseText){
			if(responseText.success){
				if(nextFlag){
					$("#format").val("");
					$("#document").val("");
					$("#partyType").val("");			
					$("#msgDiv").empty();
					$("#msgDiv").append("Operation completed successfully.");
					isChanged=false;
					console.log("Setting isChanged to false, now isChanged:"+isChanged);
				}else{
					$("#msgDiv").empty();
					$("#msgDiv").append("Operation completed successfully.");
					isChanged=false;
					console.log("Setting isChanged to false, now isChanged:"+isChanged);
					//searchValue();
				}
			}else{
				$("#msgDiv").empty();
				$("#msgDiv").append("Operation not completed successfully.");
			}
			
			
		}
	});
}


function buildThirdPartyDialog(addOp){		
	
	 $( "#maintainTPDialog" ).dialog({
		autoOpen: false, 
		width: 1100,
		modal: true,
		closeOnEscape: false,
		beforeClose: function() {					
			var r = confirm("All the unsaved Changes will be discarded!");
			if (r == false) {
				return false;
			}					
		},
		close : function(ev, ui) {
		    $(this).remove();
		 },
		buttons : {       
		}
	});
	 
	 var buttons = new Array();
	 buttons.push({
	        text: "Exit",
	        click: function() { $("#tradePartnerForm").validationEngine('hideAll');$("#maintainTPDialog").dialog("close"); }
	    });
	 
	 buttons.push({
	        text: "Save",
	        click: function() { saveThirdParty(); }
	    });
	 
	/* if(addOp != null && addOp=='Y'){
		 buttons.push({
		        text: "Save & Add Next",
		        click: function() { saveCANext(); }
		    });
	 }*/
	
 $( "#maintainTPDialog" ).dialog( "option", "buttons",  buttons );
}

function saveThirdParty(){
	var queryString = $('#tradePartnerForm').formSerialize();
	if ( !$("#tradePartnerForm").validationEngine('validate') ) {
		return;
	}
	actionUrl = _context+"/tradingPartner/save3rdParty";
	$.ajax({
		url: actionUrl,
		type: "POST",
		cache:false,
		data: queryString,
		success: function(responseText){
			if(responseText.success){
				searchValue();
			}else{
				var msg = "";
				 $.each(responseText.messages.error,function(index,node){					 
					 msg += "\n"+node;
				 });
				alert(msg); 
			}	
			
		}
	});
}
function makeEmptyIf(srcId,targetId){
		if($("#"+srcId).val() == null || $("#"+srcId).val() == "ALL" ||$("#"+srcId).val().trim() ==''){
			$("#"+targetId).val("");
		}
}
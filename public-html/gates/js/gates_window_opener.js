/*
 * Close GATES window if sessionId does not match JSESSIONID cookie;
 * this happens when,
 * 1. there is an existing GATES window
 * 2. session times out
 * 3. user launches another GATES window (which will be in a new session)
 * 4. user starts working on the old GATES window
 */
/*
window.onload=function() {
	// if ($('#_session_id').html() != $.cookie("JSESSIONID")) {
	var newWindowPrefix = 'gates_';
	var currWindowName = window.name? window.name: '';
	
	var sessionIdFromCookie = $.cookie("JSESSIONID");
	var sessionIdFromPage = $('#_session_id').html();
	var sessionIdFromWindowName = currWindowName.substr(newWindowPrefix.length);
	
	// if currWindowName does not start with newWindowPrefix
	if (currWindowName.substr(0, newWindowPrefix.length) == newWindowPrefix) {
		if (sessionIdFromPage != sessionIdFromWindowName) {
			window.name = newWindowPrefix + sessionIdFromPage;
			
			// console.log("Closing Window: [" +	$('#_session_id').html() + "] != [" + $.cookie("JSESSIONID") + "] - "+window.name);
			
			alert('You cannot open multiple browser windows/tabs within the same HTTP session');
			window.close();
		}
	}
};
*/
var searchBound = false;
$(document).ready(function(){
	
	/*
	 * prevent controls to open new browser tab/window; 
	 * don't allow these on hyperlinks:
	 *   - Ctrl-Click
	 *   - Shift-Click
	 *   - Context menu (right-click)
	 */
	$('a[href]').click(function(event) {
		if(event.ctrlKey  == true || event.shiftKey==true) {
			event.preventDefault();
		}
	}).bind("contextmenu", function(e) {
		e.preventDefault();
	});
	
	//D021215: 	Session Variable clear/change shortcut
	if(!searchBound){
		searchBound = true;
		//D029442: 
		if($("#textfield5").val()!= null  && $("#textfield5").val() != undefined  && $("#textfield5").val() != 'undefined' && $("#textfield5").val()[0]=="T"){
			$("#textfield5").val("");
			$.ajax({
					url: "/gates/workingContext/setContext",
					type: "POST",
					data: {key:"BK_BOOKING",value:""},
					success: function(responseText){
						$("#textfield5").removeAttr('style');
					}
				});
		}
		$("#textfield5").keydown(function (e) {
	        // Allow: backspace, delete, tab, escape, enter and .
	        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
	             // Allow: Ctrl+A
	            (e.keyCode == 65 && e.ctrlKey === true) || 
	            // Allow: Ctrl+V
	            (e.keyCode == 86 && e.ctrlKey === true) || 
	             // Allow: home, end, left, right
	            (e.keyCode >= 35 && e.keyCode <= 39)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	            e.preventDefault();
	        }
	    });
		
		$('#textfield5').change(function(){
			var searchText = $("#textfield5").val();
			if(searchText != '' && searchText.length == 7 && isNumeric(searchText)){
				$.ajax({
					url: "/gates/workingContext/setContext",
					type: "POST",
					data: {key:"BK_BOOKING",value:searchText},
					success: function(responseText){
						$("#textfield5").removeAttr('style');
					}
				});
			} else {
				$("#textfield5").attr('style', 'background-color:#F69999');
			}
		});
	}

	//openGatesWindow();
});
    
//	D021215: 	Session Variable clear/change shortcut
function getSearchFieldValue(delay){
	setTimeout(
			function() {  
				$.ajax({
					url: "/gates/workingContext/getContext",
					type: "GET",
					data: {key:"BK_BOOKING"},
					success: function(responseText){
						$("#textfield5").val(responseText.data);
					}
				});
			}
		,delay);
}

function openGatesWindow() {
	var newWindowPrefix = 'gates_';
	var newWindowName =  newWindowPrefix + $.cookie('JSESSIONID');
    
	var currWindowName = window.name? window.name: '';

	// if currWindowName does not start with newWindowPrefix
	if (currWindowName.substr(0, newWindowPrefix.length) != newWindowPrefix) {
		var height = window.screen.availHeight-28-20;
		var width = window.screen.availWidth-10;
		
		var url=window.location.href;   
		
		newWindows = window.open(url, newWindowName,
				'height=' + height + ',width=' + width + 'menubar=no,left=0,top=0,scrollbars=yes,resizable=yes,status=yes');

		//!- ChromeFrame crashes with a small timeout value (e.g. in milli-seconds)
		setTimeout(function() {
		    window.close();
		}, 3000);
	
		if (newWindows || newWindows != null) {
			hideGatesUI();
			$('body').append('<div>You can safely close this window</div>');
			
		} else {
			hideGatesUI();
			$('body').append('<div>Pop-up blocker is detected. Please click <a onclick="openGatesWindow()">here</a> to start application.</div>');
		}
	}
}

function hideGatesUI() {
	$('div').hide();
}

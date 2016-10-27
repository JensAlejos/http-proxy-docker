var initialValues = new Array();
var changedArray = new Array();
var ignoreGrid=false;
function captureChanges(){
	ignoreGrid=true;
	initialValues = new Array();
	changedArray = new Array();
	$('#isAnyGridChanged').val("false");
	captureAllChanges(ignoreGrid);
}
function captureUIChangesWithGrid(){
	ignoreGrid=false;
	initialValues = new Array();
	changedArray = new Array();
	$('#isAnyGridChanged').val("false");
	captureAllChanges(ignoreGrid);
}
function captureOnlyGridActions() {
	initialValues = new Array();
	changedArray = new Array();
	$('#isAnyGridChanged').val("false");
	clearGridLists();
	 $(window).bind('beforeunload', function(event){
		 if(isAnyChangeOnPage()) {
			 event.stopImmediatePropagation();
			 return 'You have unsaved changes!';
		 }
	});
}
function resetFieldChanges(ids) {
	var idArray=ids.split(",");
	for(var index=0;index<idArray.length;index++) {
		var toRemove=changedArray.indexOf(idArray[index]);
		changedArray.splice(toRemove,1);
		initialValues[idArray[index]]=$('#'+idArray[index]).val();
	}
}
function captureAllChanges(ignore){
	ignoreGrid=ignore;
	initialValues = new Array();
	changedArray = new Array();
	clearGridLists();
	//D021215: 	search_field in header will not be considered as change
	var inputSelect='input:not(:disabled):not(:hidden):not(".ignoreInComparison"):not(".search_field"),select:not(:disabled):not(".ignoreInComparison"),textarea:not(:disabled):not(".ignoreInComparison")';
	$(inputSelect).live('focus',function() {
		if(ignoreGrid) {
			if(isInsideJQGrid($(this))) {
				return;
			}
		}
		if(initialValues[$(this).attr('id')]==undefined || initialValues[$(this).attr('id')]==null) {
			initialValues[$(this).attr('id')]=$(this).val();
			initialValues[initialValues.length]=$(this).attr('id');
		}
	});
	
	$('input[type=radio]').live('mouseover',function() {
		var name=$(this).attr('name');
		var checkedRadio=getSelectedRadio(name);
		if(initialValues[name]==undefined || initialValues[name]==null) {
			initialValues[name]=checkedRadio;
			initialValues[initialValues.length]=name;
		}
	});
	
	function getSelectedRadio(name) {
		var allRadios=$('input[name='+name+']');
		var checkedRadio='';
		for(var index=0;index<allRadios.length;index++) {
		   if($(allRadios[index]).is(':checked')) {
			   checkedRadio=$(allRadios[index]).attr('id');
			   break;
		   }
		}
		return checkedRadio;
	}
	
	$(inputSelect).live('input',function() {
		var element=$(this);
		changeEvent(element);
	});
	
	$(inputSelect).live('change',function() {
		var element=$(this);
		if(element.context.localName=="select") {
			changeEvent(element);
		}
	});
	
	 var origHook;

	    // There might already be valhooks for the "text" type
	 if ($.valHooks.text)
	        // Preserve the original valhook function
	        origHook = $.valHooks.text.set;
	 else
	        // Make room for a new valhook
	        $.valHooks.text = {};

	 $.valHooks.text.set = function (el) {
		 changesFromValueSetter(el);
	 };
	 
	    // There might already be valhooks for the "textarea" type
	 if ($.valHooks.textarea)
	        // Preserve the original valhook function
	        origHook = $.valHooks.text.set;
	 else
	        // Make room for a new valhook
	        $.valHooks.textarea = {};

	 $.valHooks.textarea.set = function (el) {
			 changesFromValueSetter(el);
	 };
	 
	// There might already be valhooks for the "textarea" type
	 if ($.valHooks.select)
	        // Preserve the original valhook function
	        origHook = $.valHooks.text.set;
	 else
	        // Make room for a new valhook
	        $.valHooks.select = {};

	 $.valHooks.select.set = function (el) {
			 changesFromValueSetter(el);
	 };
	 
	 
	 $(window).bind('beforeunload', function(event){
		 if(isAnyChangeOnPage()) {
			 event.stopImmediatePropagation();
			 return 'You have unsaved changes!';
		 }
		   
	});
}
function changesFromValueSetter(el) {
	var classes=$(el).attr('class');
	 if(classes!=undefined && classes!=null && classes.indexOf('captureValueSetter')>=0) {
	 if(ignoreGrid) {
			if(isInsideJQGrid($(el))) {
				return;
			}
		}
		if(initialValues[$(el).attr('id')]==undefined || initialValues[$(el).attr('id')]==null) {
			var elId=$(el).attr('id');
			if(elId==null) {
				$(el).addClass('ignoreInComparison');
			}
			else {
				initialValues[$(el).attr('id')]=$(el).val();
				initialValues[initialValues.length]=$(el).attr('id');
			}
		}
		 setTimeout(function() {
			 changeEvent(el);
		 },200);
	 }
}
function isInsideJQGrid(element) {
	var idElement=$(element).attr('id');
	
	if(idElement!=null && idElement!=undefined) {
		var position=idElement.search("jqg");
		
		if(position>=0) {
			return true;
		}
	}

	var closestDiv=$(element).closest('div');
	var classDiv=$(closestDiv).attr('class');
	
	if(classDiv!=null && classDiv!=undefined ) {
		if(classDiv.search("jqg")>=0) {
			return true;
		}
		closestDiv=$(element).closest(closestDiv);
		classDiv=$(closestDiv).attr('class');
		if(classDiv!=null && classDiv!=undefined && classDiv.search("jqg")>=0) {
			return true;
		}
		else {
			var parentDiv=$(closestDiv).parent();
			classDiv=$(parentDiv).attr('class');
			if(classDiv!=null && classDiv!=undefined) {
				if(classDiv.search("jqg")>=0){
					return true;
				}
			}
		}
		return false;
	}
	else {
		closestDiv=$(element).closest(closestDiv);
		classDiv=$(closestDiv).attr('class');
		if(classDiv!=null && classDiv!=undefined && classDiv.search("jqg")>=0) {
			return true;
		}
		else {
			var parentDiv=$(closestDiv).parent();
			classDiv=$(parentDiv).attr('class');
			if(classDiv!=null && classDiv!=undefined) {
				if(classDiv.search("jqg")>=0){
					return true;
				}
			}
		}
		return false;
	}
	return true;
}
function changeEvent(element) {
	//setTimeout(function() {
	if($(element).attr('type')=="radio") {
		var name=$(element).attr('name');
		var value=getSelectedRadio(name);
		var initialValue=initialValues[name];
		if(initialValue==value) {
			var index=changedArray.indexOf($(element).attr('id'));
			changedArray.splice(index,1);
		}
		else {
			if($(element).attr('id') == null || $(element).attr('id')==undefined) {
				$(element).addClass('ignoreInComparison');
			}
			else {
				changedArray[changedArray.length]=$(this).attr('id');
			}
		}
	}
	else if($(element).context.localName=="input" && $(element).attr('type')=="checkbox") {
		if(ignoreGrid) {
			if(isInsideJQGrid($(element))) {
				return;
			}
		}
		if($(element).attr('id') == null || $(element).attr('id')==undefined) {
			$(element).addClass('ignoreInComparison');
		
			if(initialValues[$(element).attr('id')]==undefined || initialValues[$(element).attr('id')]==null) {
				var isChecked=$(element).attr("checked");
				if(isChecked==element || isChecked=="true" || isChecked=="checked") {
					initialValues[$(element).attr('id')]="unchecked";
				}
				else {
					initialValues[$(element).attr('id')]="checked";
				}
				
				changedArray[changedArray.length]=$(element).attr('id');
			}
			else {
				var isChecked=$(element).attr('checked');
				if(initialValues[$(element).attr('id')]==undefined) {
					
				}
				if(isChecked=="true" || isChecked=="checked" || isChecked==true) {
					isChecked="checked";
				}
				else {
					isChecked="unchecked";
				}
				if(initialValues[$(element).attr('id')]==isChecked){
					var index=changedArray.indexOf($(element).attr('id'));
					changedArray.splice(index,1);
				}
				else {
					changedArray[changedArray.length]=$(element).attr('id');
				}
			}
		}
	}
	else if(initialValues[$(element).attr('id')]==$(element).val()) {
		if(ignoreGrid) {
			if(isInsideJQGrid($(element))) {
				return;
			}
		}
		var index=changedArray.indexOf($(element).attr('id'));
		changedArray.splice(index,1);
	}
	else {
		if(ignoreGrid) {
			if(isInsideJQGrid($(element))) {
				return;
			}
		}
		var index=changedArray.indexOf($(element).attr('id'));
		if(index<0) {
			if($(element).attr('id') == null || $(element).attr('id')==undefined) {
				$(element).addClass('ignoreInComparison');
			}
			else {
				changedArray[changedArray.length]=$(element).attr('id');
			}
		}
	}
	//},200);
}
function isAnyChangeInGrid() {
	//D034310 - This call is not required on load. Added check.
	if (document.readyState == "complete"){
		$.ajax({
			type : "GET",
			url : _context + "/gridChange/hasAnyGridChanged",
			success : function(responseText) {
				$('#isAnyGridChanged').val(responseText);
			}
		});
	}
}

function clearGridLists() {
	$.ajax({
		type : "GET",
		url : _context + "/gridChange/clearGridLists",
		success : function(responseText) {
		}
	});
}

function clearGrids(gridIds) {
	$.ajax({
		type : "GET",
		url : _context + "/gridChange/clearGrids",
		data: {
			grids:gridIds
		},
		success : function(responseText) {
		}
	});
}

function isAnyChangeOnPage() {
	if(changedArray.length>0 || $('#isAnyGridChanged').val()=="true") {
		return true;
	}
	return false;
}
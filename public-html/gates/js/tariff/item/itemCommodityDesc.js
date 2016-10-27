var somethingChanged = false;
var isInputChange="";
var len=0;
$(function() {
	 $("select").each(function() { 
	        var s = this; 
	        for (i = 0; i < s.length; i++) 
	            s.options[i].title = s.options[i].text; 
	        if (s.selectedIndex > -1) 
	            s.onmousemove = function() { s.title = s.options[s.selectedIndex].text; }; 
	    }); 

	tabSequence('#itemCommodityForm');
	if(_readonlyItemCommodity){
		$('#mainContent').gatesDisable();
	}
	var commodityDescCmdyId=$("#commodityDescCmdyId").val();
	 var _pageMode='Add';
	if(commodityDescCmdyId!=null && commodityDescCmdyId!='')
		{
		_pageMode='Edit';
		}
		 $('input').change(function() {
			 if($(this).is(':disabled, [readonly]')) {
				 
			    }else{
					 if((isInputChange==true || isInputChange=="true")){
						 if(somethingChanged==true || somethingChanged=='true'){
								somethingChanged=true;
							}
							else{
								somethingChanged=false;
							}
					 }
					 else{
						 somethingChanged = true; 
					 }
			    }
		}); 
		 $('checkbox').change(function() {
			 if($(this).is(':disabled, [readonly]')) {
				 
			    }else{
					 if((isInputChange==true || isInputChange=="true")){
						 if(somethingChanged==true || somethingChanged=='true'){
								somethingChanged=true;
							}
							else{
								somethingChanged=false;
							}
					 }
					 else{
						 somethingChanged = true; 
					 }
			    }
		});
		 $('textarea').change(function() {
			 if($(this).is(':disabled, [readonly]')) {
				 
			    }else{
					 if((isInputChange==true || isInputChange=="true")){
						 if(somethingChanged==true || somethingChanged=='true'){
								somethingChanged=true;
							}
							else{
								somethingChanged=false;
							}
					 }
					 else{
						 somethingChanged = true; 
					 }
			    }
		}); 
		 $('img').click(function() {
			 if($(this).is(':disabled, [readonly]')) {
				 
			    }else{
					 if((isInputChange==true || isInputChange=="true")){
						 if(somethingChanged==true || somethingChanged=='true'){
								somethingChanged=true;
							}
							else{
								somethingChanged=false;
							}
					 }
					 else{
						 somethingChanged = true; 
					 }
			    }
		}); 
		 $('#descP').change(function() {
			 if($(this).is(':disabled, [readonly]')) {
				 
			    }else{
					 if((isInputChange==true || isInputChange=="true")){
						 if(somethingChanged==true || somethingChanged=='true'){
								somethingChanged=true;
							}
							else{
								somethingChanged=false;
							}
					 }
					 else{
						 somethingChanged = true; 
					 }
			    }
		});

		 len=codesOnLoad(getControl('box2View'));
		 $("#box2View option").each(function(index,item){ len = len+2*index + 3* $(item).val(); });
		//disable newButton
		var disableNewButton=$('#disableNewButton').val();
		$('#itemNewBtn').attr("disabled","disabled");
		if(disableNewButton=='true'){
			 $('#itemNewBtn').attr("disabled","disabled");
		 }else{
			 $('#itemNewBtn').removeAttr("disabled");
		 }
		//end disable
				
		//Disabling of Next Button
		$('#itemNxtBtn').attr("disabled","disabled");	
		var disableNext=$('#disableNextButton').val();
		if(disableNext=='true'){
			 $('#itemNxtBtn').attr("disabled","disabled");
		 }else{
			 $('#itemNxtBtn').removeAttr("disabled");
		 }
		//end disable
			
	$('#itemCommodityAdd').click(function(){
		if(_pageMode=="Edit"){
			submitAllSelect();
			var lenNOw=codesOnLoad(getControl('box2View'));
			$("#box2View option").each(function(index,item){ lenNOw = lenNOw+2*index + 3* $(item).val(); });
			if(lenNOw!=len){
				somethingChanged=true;
			}
			if(somethingChanged==true){
		 			if($("#itemCommodityForm").validationEngine('validate')){
		 				$("#itemCommodityForm").attr("action", "createOrUpdateCommodity");
		 	        	$("#itemCommodityForm").submit(); 
		 	    	}else{
		 	    		return false;
		 	    	}
			}
		else{
			 	alert("No fields have changed. Cannot update");
			 }}
	 else{
		if($("#itemCommodityForm").validationEngine('validate')){
			submitAllSelect();
			$("#itemCommodityForm").attr("action", "createOrUpdateCommodity");
        	$("#itemCommodityForm").submit(); 
    	}else{
    		return false;
    	}
	 }
    });
	
	$('#commoditySaveNew').click(function(){
		$('#isSaveNew').val("Y");
		if(_pageMode=="Edit"){
			submitAllSelect();
			var lenNOw=codesOnLoad(getControl('box2View'));
			$("#box2View option").each(function(index,item){ lenNOw = lenNOw+2*index + 3* $(item).val(); });
			if(lenNOw!=len){
				somethingChanged=true;
			}
			if(somethingChanged==true){
		 			if($("#itemCommodityForm").validationEngine('validate')){
		 				$("#itemCommodityForm").attr("action", "createOrUpdateCommodity");
		 	        	$("#itemCommodityForm").submit(); 
		 	    	}else{
		 	    		return false;
		 	    	}
			}
		else{
			 	alert("No fields have changed. Cannot update");
			 }}
	 else{
		if($("#itemCommodityForm").validationEngine('validate')){
			submitAllSelect();
			$("#itemCommodityForm").attr("action", "createOrUpdateCommodity");
        	$("#itemCommodityForm").submit(); 
    	}else{
    		return false;
    	}
	 }
    });
	
	var args = {
			entityType: 'TRSI',
			entityId: $("#itemId").val(),
			commentId: "commentId",
			viewOnly: true,
			commentsFrame: 'itemCommentsFrame'
		};
	$("#item_comment_link").comments(args);
	
	var args1 = {
			entityType : 'TRSV',
			entityId : $("#tariffServiceGroupId").val(),
			commentId : "groupCommentId",
			viewOnly : true,
			commentsFrame : 'grpCommentsFrame'
		};
		$("#grp_comment_link").comments(args1);

	
	 $("#itemCommodityForm").validationEngine('attach');
		
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;	
		
		var commodityDescCmdyId = $("#commodityDescCmdyId").val();		
		
		if(_prefDate!=null && _prefDate!=''){
			if(commodityDescCmdyId==null || commodityDescCmdyId==''){
				$("#preferencedate").datepicker('setDate',_prefDate);
			}
			
		}else{
			if(commodityDescCmdyId==null || commodityDescCmdyId==''){
				$("#preferencedate").datepicker('setDate',new Date());
			}
			
		}

		$.configureBoxes({
			useFilters : true,
			useCounters : false,
		});
		
	$("#itemCommodityCancel").click( function () {
		var itemId = $("#itemId").val();
		var currentFuture = $("#currentFuture").val();
		var lenNOw=codesOnLoad(getControl('box2View'));
		$("#box2View option").each(function(index,item){ lenNOw = lenNOw+2*index + 3* $(item).val(); });
		var newitem = $("#isNewItem").val();
		if(lenNOw!=len){
			somethingChanged=true;
		}
		if(somethingChanged)
		{
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
			 document.location.href = _context + '/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+itemId+'&currentFuture='+currentFuture+'&isNewItem='+newitem+'&screen=FRT&mode=edit';
		  }
		}
		else
		{
			document.location.href = _context + '/tariff/itemFrtWrf/edit?actionPerformed=EXIT&itemId='+itemId+'&currentFuture='+currentFuture+'&isNewItem='+newitem+'&screen=FRT&mode=edit';
		}

	});
	
	//Filter ListBox Values using Testbox
	var keys=[];
	var values=[];

	var options=$('#box1View option');
	$.each(options, function (index, item) {
	    keys.push(item.value);
	    values.push(item.innerHTML);
	    $('#box1View') .append($('<option>', { value : item.value }).text(item.innerText)); 
	});

	$('#box1Filter').keyup(function() {
		var filter  = $(this).val();
		DoListBoxFilter('#box1View', filter, keys, values);
		 $("select").each(function() { 
		        var s = this; 
		        for (i = 0; i < s.length; i++) 
		            s.options[i].title = s.options[i].innerText; 
		        if (s.selectedIndex > -1) 
		            s.onmousemove = function() { s.title = s.options[s.selectedIndex].innerText; }; 
		    }); 
	});
		
	$('#box1Filter').gatesPopUpSearch({func:function() {commodityPopupSearch()}});
	
	var historyArgs = {
			entityId: $('#commodityDescCmdyId').val(),
			entity: 'com.matson.gates.tm.item.domain.TariffItemCommodityDesc'
		};
	$("#history_link").history(historyArgs);
	
	$("#commodityRemarks").keyup(function(){
		 if($("#commodityRemarks").val().length>76)
			 {
	  		  alert("Cannot be greater than 76 characters");
			 $("#commodityRemarks").val($("#commodityRemarks").val().substr(0, 76));
			 
			 }
	 });
	colorproblemlist();
});
       
function removeErrorPointers(){
    	   $('#itemCommodityForm').validationEngine('hideAll');
    }
     
function submitAllSelect() {
	selectAll(getControl('box2View'));
	deselectAll(getControl('box1View'));
}
function deselectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	for ( var i = 0; i < selObj.options.length; i++) {
		tmpOptObj = selObj.options[i];
		if (tmpOptObj.selected){
			tmpOptObj.selected =false;
		}
	}// end if
}
function selectAll(selObj) {
	if (selObj == null || selObj.options.length == 0)
		return false;
	var tmpOptObj;
	//if(len!=selObj.options.length){
		for ( var i = 0; i < selObj.options.length; i++) {
			tmpOptObj = selObj.options[i];
			if (!tmpOptObj.selected){
				tmpOptObj.selected = true;
			}
		}
}
function codesOnLoad(selObj) {
		return selObj.options.length;
}
var getControl = function(id) {
	var control = document.getElementById(id);
	if (!control)
		control = document.getElementById(getNetuiTagName(id, this));
	return control;
};
function commodityPopupSearch() {
	
	 var actionUrl = _context+'/cas/commoditylookup.do?filterValue1='+$('#box1Filter').val();	
	 var windowStyle = 'top=0,left=0,height=500,width=1000,scrollbars=1,resizable=1,status=1,toolbar=0,menubar=0,location=0';
	 window.open(actionUrl, 'CommoditySearch', windowStyle);
	}
function commoditySearchUpdate(values){
  	
  	$('#box1Filter').val(values);
}
function newItem(){
	var commodityDescCmdyId=$('#commodityDescCmdyId').val();
	var tariffServiceItemId = $("#itemId").val();	
	var groupId = $("#tariffServiceGroupId").val();
	if((commodityDescCmdyId == null)||(commodityDescCmdyId == '')){
		alert('Please save the record First');
	}
	else
	{
		document.location.href=_context+'/tariff/itemCommodityDesc/showForm?actionPerformed=add&itemId='+tariffServiceItemId+'&grpId='+groupId;
	}
}
//Next button click functionality
//Next Functionality
function loadNextTariffItemDetails() {
	var commodityDescCmdyId = "NEXT";
	if (somethingChanged) {
		var r = confirm("All the unsaved Changes will be discarded!");
		if (r == true) {
			document.location.href = _context+ '/tariff/itemCommodityDesc/showEditForm?actionPerformed=edit&commodityDescCmdyIds='+commodityDescCmdyId;
		}
	}
	else
	{
		document.location.href = _context+ '/tariff/itemCommodityDesc/showEditForm?actionPerformed=edit&commodityDescCmdyIds='+commodityDescCmdyId;
	}
}
function setClear(){
	 //$('#primaryCommodity').attr("checked",true);
	 $("#commodityDescription").val("");
	 $("#commodityRemarks").val("");
	 $("#box1Filter").val("");
	 $("#box2View").val("");
	 obj = document.getElementById('box2View');
	 document.getElementById('box2View').innerHTML = "";
}
function setClearNew(){
	 //$('#primaryCommodity').attr("checked",true);
	$('#commodityDescCmdyId').val("");
	 $("#box1Filter").val("");
	 $("#box2View").val("");
	 obj = document.getElementById('box2View');
	 document.getElementById('box2View').innerHTML = "";
}
function DoListBoxFilter(listBoxSelector, filter, keys, values) {
    var list = $(listBoxSelector);
    var selectBase = '<option value="{0}">{1}</option>';

    list.empty();
    for (i = 0; i < values.length; ++i) { 

        var value = values[i];

        if (value == "" || value.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
            var temp = '<option value="'+keys[i]+'">'+value+'</option>' ;
            list.append(temp);
            colorproblemlist();
        }
    }
}
function colorproblemlist(selobj) {
    ob = document.getElementById('box1View');
    
    for (var i = 0; i < ob.options.length; i++) {
        var option = ob.options[i];
        var len=option.text.length;
        	switch(option.text.substr(len-1,len))
            {
               case "F":
                   option.style.background = "#F1EA00";
               break;
               case "E":
                   option.style.background = "FFBABA";
               break;
        }
    }
  /*  var options=$('#box1View option');
	$.each(options, function (index, item) {
		   $('#box1View')
	          .append($('<option>', { value : option.value })
	          .text(option.innerHTML)); 
	   });*/
}

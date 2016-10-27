var somethingChanged = false;
var dataName=null;
$(document).ready(function () {
	//if($('#trgtFromGrpTypeHidden').val()!='01')
	// Subhas's change, hope he knew what he was doing
	tabSequence('#replicateConditonForm');
	if(_readonlyReplicateCondition){
		$('mainContent').gatesDisable();
	}
	$('#itemNxtBtn').attr("disabled","disabled");
	var _pageMode='Add';
	var rateDescId=null;
	$("#trgtFromRateDesc").attr("disabled", "disabled");
	$("#trgtToRateDesc").attr("disabled", "disabled");
	

	if($("#trgtFromItemName").val()!=null && $("#trgtFromItemName").val()!=""){
		$("#trgtFromRateDesc").removeAttr("disabled");
	}
	if($("#trgtToItemName").val()!=null && $("#trgtToItemName").val()!=""){
		$("#trgtToRateDesc").removeAttr("disabled");
	}
	var fromGrpType =  document.getElementById('fromGroup_type_Drop_down');
	
	$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	
	if(fromGrpType!=null && fromGrpType!=""){
	if (fromGrpType.value == '01') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '00';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '02') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '01';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '03') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '02';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '04') {		
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '03';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '05') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '04';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '06') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '05';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
	if (fromGrpType.value == '07') {
		document.getElementById('fromGroup_type_Drop_down').selectedIndex = '06';
		$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
	}
}
	if($('#trgtFromGrpTypeHidden').val()=="01"){
		$("#trgtFromGrpName").attr("disabled", "disabled");	
	}	
	$('#fromGroup_type_Drop_down').change(function(){
		if($('#fromGroup_type_Drop_down').val()!="01"){
			$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
			$("#trgtFromGrpName").removeAttr("disabled");
			$('#trgtFromSrcTariff').val("");
			$('#trgtFromGrpName').val("");		
			$('#trgtFromItemName').val("");	
		}
		else{
			$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
			$("#trgtFromGrpName").attr("disabled", "disabled");	
			$('#trgtFromGrpTypeHidden').val($('#fromGroup_type_Drop_down').val());
			$('#trgtFromSrcTariff').val("");
			$('#trgtFromGrpName').val("");		
			$('#trgtFromItemName').val("");	
		}
	});
	// code for source tariff predictive search		
	$('#trgtFromSrcTariff').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		extraParams: {
 		 		 	 method: 'searchTariffSource',
 		 		     searchType: '11',
 		 		     groupType:  function () { return $('#fromGroup_type_Drop_down').val(); }
		 },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#trgtFromSrcTariff').val(data.id);
		 		 $('#grpId').val(data.id);
		 		 $('#trgtFromRateDesc').val("");
			 		if($('#fromGroup_type_Drop_down').val()=="01"){
			 			 $('#trgtFromGrpName').val(data.name);	
			 		}	
		 }		 
	});	
			
	//Blur the data for invalid group Id
	$('#trgtFromSrcTariff').change(function(){
		$('#rateDescList').children().remove();
		$('#trgtFromItemName').val("");	
		$('#trgtFromRateDesc').val("");	
 		$('#itemId').val("");
		if($('#grpId').val()==null || $('#grpId').val()==""){
       	$("#trgtFromSrcTariff").val(""); 
       	$("#trgtFromGrpName").val(""); 
		}
		else{
			$("#trgtFromSrcTariff").val(dataName); 
	 		 if($('#fromGroup_type_Drop_down').val()=="01"){
	 			 $('#trgtFromGrpName').val(dataName);
	 		 }
			$('#grpId').val("");
		}
		
	}); 
	
	//code for group name predictive
	$('#trgtFromGrpName').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		extraParams: {
 		 	 method: 'searchGroupName',
 		     searchType: '10',
 		   groupType:  function () { return $('#fromGroup_type_Drop_down').val(); },
	       sourceTariff:  function () { return $('#trgtFromSrcTariff').val(); }
	 	
       },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#trgtFromGrpName').val(dataName);		
		 		$('#grpId').val(data.id);
		 }		 
	});		
	//Blurr the data for invalid group Id
	$('#trgtFromGrpName').change(function(){	
		 $('#trgtFromItemName').val("");
		 $('#rateDescList').children().remove();
		if($('#grpId').val()==null || $('#grpId').val()==""){		
	 	$("#trgtFromGrpName").val("");       	
		}
		else{
			$("#trgtFromGrpName").val(dataName);
			$('#grpId').val("");
		}
	}); 
	
	 $('#trgtFromGrpName').change(function(){
			if($('#grpId').val()==null || $('#grpId').val()==""){
	      	$("#in_group_code").val("");       	
	  	  }
		else{
			$("#trgtFromGrpName").val(dataName); 
			$('#grpId').val("");
//			$('input[name="itemId"]').val("");
//			$('input[name="ratId"]').val("");
		}
	    }); 
	//code for item predictive
	$('#trgtFromItemName').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		minLength: 1,
		extraParams: {
		   method: 'searchItemName',
		   searchType: '43',
		   groupType:  function () { return $('#fromGroup_type_Drop_down').val(); },
	       sourceTariff:  function () { return $('#trgtFromSrcTariff').val(); },
		   groupName:  function () { return $('#trgtFromGrpName').val(); }
	 	
      },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#itemId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		 $('#trgtFromItemName').val(data.id);	
		 		$('#itemId').val(data.id);
		 		$('#trgtFromRateDesc').val("");
		 		$("#trgtFromRateDesc").removeAttr("disabled");
		 }		 
	});		
		
	//Blurr the data for invalid item Id
	$('#trgtFromItemName').change(function(){
		 $('#rateDescList').children().remove();
		 $('#trgtFromRateDesc').val("");
		if($('#itemId').val()==null || $('#itemId').val()==""){
		$("#trgtFromItemName").val("");       	
	  }
		else{
			$('#trgtFromItemName').val(dataName);	
	 		$('#itemId').val("");
	 		$("#trgtFromRateDesc").removeAttr("disabled");
		}
	}); 	
		
	//code for rate predictive
	$('#trgtFromRateDesc').gatesAutocomplete({
			source:  _context+'/cas/autocomplete.do',
			extraParams: {
				   method: 'searchRateDescription',
				   searchType: '45',
				   groupType:  function () { return $('#fromGroup_type_Drop_down').val(); },
				   sourceTariff:  function () { return $('#trgtFromSrcTariff').val(); },
				   groupName:  function () { return $('#trgtFromGrpName').val(); },
				   itemName:  function () { return $('#trgtFromItemName').val(); }
		   },
			 formatItem: function(data) {
			 		 return data.name;
			 },
			 formatResult: function(data) {
				 dataName=data.name;
			 	 $('#rateId').val(data.id);
			 	 var flag=data.flag
			 	 var city=data.city;
			 	 if(flag==undefined || flag==null){
			 		flag="";
			 	 }
			 	 if(city==undefined || city==null){
			 		city="";
				 }
			 	 var desc=data.desc;
			 	 if(desc==undefined || desc==null){
			 		desc="";
			 	 }
				 return data.name+"-"+flag+"-"+city+"-"+desc;
			 },
			 select: function(data) {
		 		 $('#trgtFromRateDesc').val(data.id);
		 		 $('#rateId').val(data.id);	
			 }		 
	});	
	
	//Blurr the data for invalid item Id
	$('#trgtFromRateDesc').change(function(){
		if($('#rateId').val()==null || $('#rateId').val()==""){
		$("#trgtFromRateDesc").val("");       	
	  }
		else{
			$('#rateId').val("");
		}
	}); 	
//	
	var toGrpType =  document.getElementById('trgtToGrpTypeHidden');
	if (toGrpType.value == '02') {
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '00';		
	}
	if (toGrpType.value == '03') {
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '01';
	}
	if (toGrpType.value == '04') {		
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '02';
	}
	if (toGrpType.value == '05') {
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '03';
	}
	if (toGrpType.value == '06') {
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '04';
	}
	if (toGrpType.value == '07') {
		document.getElementById('toGroup_type_Drop_down').selectedIndex = '05';
	}
	// code for source tariff predictive search		
	$('#trgtToSrcTariff').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		extraParams: {
			   method: 'searchTariffSource',
			   searchType: '11',
			   groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
	      },
		 formatItem: function(data) {
		 	 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#grpId').val(data.id);
		 		 return data.name;
		 },
		 select: function(data) {
		 		$('#trgtToSrcTariff').val(dataName);	
		 		$('#grpId').val(data.id);		 		
		 }		 
	});	
	
	//Blurr the data for invalid group Id
	 $('#trgtToSrcTariff').change(function(){
		if($('#grpId').val()==null || $('#grpId').val()==""){
       	$("#trgtToSrcTariff").val(""); 
       	$("#trgtToGrpName").val(""); 
   	}
		else
		{
			$("#trgtToSrcTariff").val(dataName); 
			$('#grpId').val("");
		}
		$('#trgtToRateDesc').val("");
		$('#trgtToItemName').val("");		 
 		$('#itemId').val("");
   });	
	
	
	//code for group name predictive
	$('#trgtToGrpName').gatesAutocomplete({
			 source:  _context+'/cas/autocomplete.do',
			 extraParams: {
	 		 		 		 method: 'searchGroupName',
	 		 		 		 searchType: '10',
	 		 		 		 groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
	 		 		 		 sourceTariff:  function () { return $('#trgtToSrcTariff').val(); }				 		 		 		 
	 		 		 },
			 formatItem: function(data) {
			 		 return data.name;
			 },
			 formatResult: function(data) {
				 dataName=data.name;
			 	 $('#grpId').val(data.id);
			 		 return data.name;
			 },
			 select: function(data) {
				 	$('#trgtToGrpName').val(dataName);	
			 		$('#grpId').val(data.id);
			 		
			 }	
	});		
	//Blurr the data for invalid group Id
	 $('#trgtToGrpName').change(function(){
		if($('#grpId').val()==null || $('#grpId').val()==""){
      	$("#trgtToGrpName").val(""); 
  	}
		else
		{
			$("#trgtToGrpName").val(dataName); 
			$('#grpId').val("");
		}
		$('#trgtToRateDesc').val("");
		$('#trgtToItemName').val("");		 
 		$('#itemId').val("");
  });	
	
	//code for item predictive
	$('#trgtToItemName').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		minLength: 1,
		 extraParams: {
	 		 		 	 method: 'searchItemName',
	 		 		     searchType: '43',
	 		 		 	 groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
	 		 		 	 sourceTariff:  function () { return $('#trgtToSrcTariff').val(); },
	 		 		 	 groupName:  function () { return $('#trgtToGrpName').val(); }		
	 		 		 },
		
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#itemId').val(data.id);
		 	 return data.name;
		 },
		 select: function(data) {
		 		$('#trgtToItemName').val(data.id);	
		 		$('input[name="itemId"]').val(data.id);			 		
		 }	
	});		
	//Blurr the data for invalid item Id
	$('#trgtToItemName').change(function(){
		if($('#itemId').val()==null || $('#itemId').val()==""){
		$("#trgtToItemName").val("");       	
	  }
		else{
			$('#trgtToItemName').val(dataName);		 
	 		$('#itemId').val("");
	 		$("#trgtToRateDesc").removeAttr("disabled");
		}
		$('#trgtToRateDesc').val("");
	}); 	

	//code for rate predictive
	$('#trgtToRateDesc').gatesAutocomplete({
		source:  _context+'/cas/autocomplete.do',
		extraParams: {
			   method: 'searchRateDescription',
			   searchType: '45',
			   groupType:  function () { return $('#toGroup_type_Drop_down').val(); },
			   sourceTariff:  function () { return $('#trgtToSrcTariff').val(); },
			   groupName:  function () { return $('#trgtToGrpName').val(); },
			   itemName:  function () { return $('#trgtToItemName').val(); }
	   },
		 formatItem: function(data) {
		 		 return data.name;
		 },
		 formatResult: function(data) {
			 dataName=data.name;
		 	 $('#rateId').val(data.id);
		 	 var flag=data.flag
		 	 var city=data.city;
		 	 if(flag==undefined && flag==null){
		 		flag="";
		 	 }
		 	 if(city==undefined && city==null){
		 		city="";
			 }
		 	 var desc=data.desc;
		 	 if(desc==undefined && desc==null){
		 		desc="";
		 	 }
			 return data.name+"-"+flag+"-"+city+"-"+data.desc;
		 },
		 select: function(data) {
		 		 $('#trgtToRateDesc').val(data.id);
		 		 $('#rateId').val(data.id);	
		 		var rateId=$('#rateId').val();
		 		$('#trgtToRateDescHidden').val(rateId);
		 		$('#trgtToRateId').val(data.id);
		 		
		 }		 
	});	
	//Blurr the data for invalid item Id
	$('#trgtToRateDesc').change(function(){
		if($('#rateId').val()==null || $('#rateId').val()==""){
		$("#trgtToRateDesc").val("");       	
	  }
	else{
	 		 $('#rateId').val("");	
		}
	}); 
	 $("#replicateConditonForm").validationEngine('attach');
		$( "#effectiveDate" ).datepicker({dateFormat: 'mm-dd-yy'});		
		$( "#expirationDate" ).datepicker({dateFormat: 'mm-dd-yy'});
		var replicateConditionId=$('#replicateConditionId').val();
		// Set Pref date & eff date value from Session Var or Current Date.
		var _prefDate= document.getElementById('prefDateSessionVar').value;		
		var newDate=$('#effectiveDate').val();
		if(replicateConditionId!=null && replicateConditionId!='')
		{
			$("#effectiveDate").datepicker('setDate',newDate);
		}
		else
		{
			if(_prefDate!=null && _prefDate!=''){
				if(_pageMode=='Add'){
					//$("#effectiveDate").datepicker('setDate',_prefDate);
				}
				$("#preferencedate").datepicker('setDate',_prefDate);
			}else{
				if(_pageMode=='Add'){
			//	$("#effectiveDate").datepicker('setDate', new Date());
				}
				$("#preferencedate").datepicker('setDate',new Date());
			}
		}
		$('#saveReplicate').click(function(){
			submitAllSelect();
			if($("#replicateConditonForm").validationEngine('validate')){
				$("#replicateConditonForm").attr("action", "replicateCondition");
	        	$("#replicateConditonForm").submit(); 
	    	}else{
	    		return false;
	    	}
	    });
		if(replicateConditionId!=null && replicateConditionId!='')
		{
			$('#saveReplicate').attr("disabled","disabled");
		}
		var rateDescHiddenList=$('#rateDescListHidden').val();
		var tempList = new Array();
		tempList = rateDescHiddenList.split(',');
		var count=0;
		if(rateDescHiddenList!=null && rateDescHiddenList!=""){
			   $('#rateDescList').children().remove();
			   $.each(tempList,function(){
				   var rateIdList=new Array();
				   rateIdList  =tempList[count].split(":");
				   $('#rateDescList')
			          .append($('<option>', { value : rateIdList[1]})
			          .text(rateIdList[0])); 
				   count++;
			   });
		}
		
		$('#addRateDesc').click(function(){
			if($("#trgtFromRateDesc").val()!=null && $("#trgtFromRateDesc").val()!=""){
				var rateDesc =$("#trgtFromRateDesc").val();
				var fromRateId=$("#srcFromRateId").val();
				var rateId=$('#rateId').val();
					if(fromRateId!=null && fromRateId!="" && (rateId=="" || rateId==null)){
						$('#rateDescList').append($('<option>', { value : fromRateId }).text(rateDesc)); 
						$("#srcFromRateId").val("");
					}
					else{
						$('#rateDescList') .append($('<option>', { value : rateId }).text(rateDesc)); 
					}
					 $("#trgtFromRateDesc").val("");
				}
			else{
				return false;
			}
			});
			$('input').change(function() {
				somethingChanged = true;
			});
			$('checkbox').change(function() {
				somethingChanged = false;
			});
			$('textarea').change(function() {
				somethingChanged = true;
			});
			$('img').click(function() {
				somethingChanged = true;
			});
			$('select').change(function() {
				somethingChanged = true;
			});
			 $('table').click(function() { 
			        somethingChanged = true; 
			   });
		// code to bind pop up search
			 
		
			var disableNext=$('#disableNextButton').val();
			if(disableNext=='true'){
				 $('#itemNxtBtn').attr("disabled","disabled");
			 }else{
				 $('#itemNxtBtn').removeAttr("disabled");
			 }
});
function cancel(conditionID) {
	var screen=$('#screen').val();
	//var conditionID=$('#tariffConditionId').val();
	var tariffgrpType = $('#srcFromGrpType').val();
    var tariffgrpName = $('#srcFromGrpName').val();
    var tariffsrc = $('#srcFromSrcTariff').val();
    var tariffItem = $('#srcFromItemName').val();
	var currentFuture= $('#isCurrentFuture').val();
	 if(currentFuture==true || currentFuture=="true"){
		 currentFuture='Y';
	 }
	 else{
		 currentFuture='N';
	 }
	var from = $('#from').val();
	if(screen=='01')
	{
		if(somethingChanged)
		{
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
		 document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&isCurrentFuture='+currentFuture;
		  }
		}
	else
		{
		document.location.href = _context + '/cas/tariffConditionSearch.do?from='+from+'&isCurrentFuture='+currentFuture;
		}
	}
	else
	{
		if(somethingChanged)
		{
		 var r=confirm("All the unsaved Changes will be discarded!");
		 if (r==true)
		  {
		 document.location.href = _context + '/condition/edit?actionPerformed=edit&conditionId='+conditionID.value+'&screenParam=conditionSearch'+'&isCurrentFuture='+currentFuture+"&from="+from;
		  }
	}
	else
	{
		document.location.href = _context + '/condition/edit?actionPerformed=edit&conditionId='+conditionID.value+'&screenParam=conditionSearch'+'&isCurrentFuture='+currentFuture+"&from="+from;
		}
	}
}
function removeErrorPointers(){
	   $('#replicateConditonForm').validationEngine('hideAll');
}

//methods for selecting all values from multi select menu
function submitAllSelect() {
	selectAll(getControl('rateDescList'));
}

function delSelect()
{
	removeOptions(getControl('rateDescList'));
}
function removeOptions(selectbox)
{
var i;
for(i=selectbox.options.length-1;i>=0;i--)
{
if(selectbox.options[i].selected)
selectbox.remove(i);
}
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
function populateGrpName()
{
	 var tariffGrpName=$("#trgtFromSrcTariff").val();
	 //alert('tariffGrpName:: '+tariffGrpName);
	 var grpType=$("#trgtFromGrpTypeHidden").val();
	 if(grpType=='01')
	{
		 $("#trgtFromGrpName").val(tariffGrpName);
	}
 }

//Next button click functionality
//Next Functionality
function loadNextTariffConditionDetails() {
		var conditionId = "NEXT";
		var screen=$('#screen').val();
		var currentFuture= $('#isCurrentFuture').val();
		var from = $('#from').val();
		if(somethingChanged)
		{
			 var r=confirm("All the unsaved Changes will be discarded!");
			 if (r==true)
			  {
				 
				 document.location.href= _context +'/condition/replicate/showForm?traiffConditionID='+conditionId+'&screen='+screen+'&isCurrentFuture='+currentFuture+'&from='+from;
			  }
		}
		else{
			document.location.href= _context +'/condition/replicate/showForm?traiffConditionID='+conditionId+'&screen='+screen+'&isCurrentFuture='+currentFuture+'&from='+from;
		}
	}
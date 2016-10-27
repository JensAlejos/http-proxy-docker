var dataName=null; 
$(document).ready(function () {
		var dataName=null;
	 // code for source tariff predictive search		
	 $('#derivedSourceTariff').gatesAutocomplete({
	 	source:_context+'/cas/autocomplete.do',
		 	extraParams: {
 		 		 method: 'searchTariffSource',
 		 		 searchType: '11',
 		 		 groupType:  function() { return $('#tariffServiceGroupTypeCodeHidden').val(); }
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
	 	 		$('#derivedSourceTariff').val(data.name);	
	 	 		$('#grpId').val(data.id);
	 	 		 if($('#tariffServiceGroupTypeCodeHidden').val()=="01"){
	 	 			 $('#derivedGroupName').val(data.name);	 			 
	 	 		 }
	 	 }		 
	 });		 

	 //Blurr the data for invalid group Id
	 $('#derivedSourceTariff').change(function(){
	 	if($('#grpId').val()==null || $('#grpId').val()==""){
		   	$("#derivedSourceTariff").val("ALL"); 
		   	$("#derivedGroupName").val("ALL"); 
		   	$("#derivedItemCode").val("ALL");       	
	 	}
	 	else{
	 		$('#derivedSourceTariff').val(dataName);	
 	 		 if($('#tariffServiceGroupTypeCodeHidden').val()=="01"){
 	 			 $('#derivedGroupName').val(dataName);	 			 
 	 		 }
  	 		$('#grpId').val("");
 	 		$('#itemId').val("");
	 	}
	 }); 

	 $('#derivedGroupName').gatesAutocomplete({
	 	source:  _context+'/cas/autocomplete.do',
		 extraParams: {
		 		 		 		 method: 'searchGroupName',
		 		 		 		 searchType: '10',
		 		 		 		 groupType:  function () { return $('#tariffServiceGroupTypeCodeHidden').val(); },
		 		 		 		 sourceTariff:  function () { return $('#derivedSourceTariff').val(); }				 		 		 		 
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
	 	 		$('#derivedGroupName').val(data.id);	
	 	 		 $('#grpId').val(data.id);
	 		 	 }		 
	 });

	 //Blurr the data for invalid group Id
	 $('#derivedGroupName').change(function(){
		 
	 	if($("#grpId").val()==null || $("#grpId").val()==""){
	 		$("#derivedGroupName").val("ALL"); 
	 		$("#derivedItemCode").val("ALL");     
	 	 }
	 	else{
 	 		$('#derivedGroupName').val(dataName);	
	 		 $('#grpId').val("");
	 		$('#itemId').val("");
	 	}
	 }); 

	 $('#derivedItemCode').gatesAutocomplete({
	 	source:  _context+'/cas/autocomplete.do',
	 	minLength: 1,
		extraParams: {
		 		 		 		 method: 'searchItemName',
		 		 		 		 searchType: '43',
		 		 		 		 groupType:  function () { return $('#tariffServiceGroupTypeCodeHidden').val(); },
		 		 		 		 sourceTariff:  function () { return $('#derivedSourceTariff').val(); },				 		 		 		 
		 		 		 		 groupName:  function () { return $('#derivedGroupName').val(); }
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
	 	 		$('#derivedItemCode').val(data.id);
	 	 		 $('#itemId').val(data.id);
	 	 }		 
	 });		 

	 //Blurr the data for invalid item Id
	 $('#derivedItemCode').change(function(){
		 
		if($("#itemId").val()==null || $("#itemId").val()==""){
	 	$("#derivedItemCode").val("ALL");       	
	   }
		else{
	 		$('#derivedItemCode').val(dataName);
	 		 $('#itemId').val("");
		}
	 }); 
	 
		// City Auto complete
		$('#derivedCityCode').gatesAutocomplete({
			source : _context + '/tm/Autocomplete/autoCompCity',
			formatItem : function(city) {
			 	 //document.getElementById('derivedCityCode').value=city.cityCode;
			 	 dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
				return dataName;
			},
			formatResult : function(city) {
			 	 dataName=city.cityCode;// + " " + city.cityName + "," + city.stateCode;
				return dataName;
			},
			select : function(city) {
				dataName=city.cityCode + " " + city.cityName + "," + city.stateCode;
				//document.getElementsByName('cityCode').value=city.cityCode;
				$('#derivedCityCode').val(city.cityCode);
			}
		});

 });
 $(document).ready(function () {
     var dataName=null;
	 var defalutSrcTariff=$('#targetSrcTariff').val();
	 var defalutGrpName=$('#targetGrpName').val();
	 var defalutItemName=$('#targetItemName').val();
	 $('#targetSrcTariff').gatesAutocomplete({
		source:_context+'/cas/autocomplete.do',
	 	extraParams: {
	 		 		 method: 'searchTariffSource',
	 		 		 searchType: '11',
	 		 		 groupType:  function() { return $('#hiddenGroupTypeCode').val(); }
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
			$('#targetSrcTariff').val(data.id);		
			if($('#hiddenGroupTypeCode').val()=='01'){
				$('#targetGrpName').val(data.id);
				}
			$('#grpId').val(data.id);
		}	
	});	
//Blur the data for invalid group Id
$('#targetSrcTariff').change(function(){
	$('#targetGrpName').val("");
	$("#targetItemName").val("");   
	if($('#grpId').val()==null || $('#grpId').val()==""){
  	$('#targetSrcTariff').val(defalutSrcTariff); 
  	$('#targetGrpName').val(defalutGrpName); 
	}
	else{
		$('#targetSrcTariff').val(dataName);		
		if($('#hiddenGroupTypeCode').val()=='01')
			{
			$('#targetGrpName').val(dataName);
			}
		$('#grpId').val("");
	}
}); 

$('#targetGrpName').gatesAutocomplete({
	source:  _context+'/cas/autocomplete.do',
	 extraParams: {
 		 		 method: 'searchGroupName',
 		 		 searchType: '10',
 		 		 groupType:  function () { return $('#hiddenGroupTypeCode').val(); },
 		 		 sourceTariff:  function () { return $('#targetSrcTariff').val(); }				 		 		 		 
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
		$('#targetGrpName').val(data.id);
		$('#grpId').val(data.id);
	}	
});	

//Blurr the data for invalid group Id
$('#targetGrpName').change(function(){
	if($('#grpId').val()==null || $('#grpId').val()==""){
		$("#targetGrpName").val(defalutGrpName);       	
	  }
	else{
		$("#targetGrpName").val(dataName);
		$('#grpId').val("")
	}
}); 

//code for item predictive
$('#targetItemName').gatesAutocomplete({
	 source:  _context+'/cas/autocomplete.do',
	 minLength: 1,
	 extraParams: {
 		 		 method: 'searchItemName',
 		 		 searchType: '43',
 		 		 groupType:  function () { return $('#hiddenGroupTypeCode').val(); },
 		 		 sourceTariff:  function () { return $('#targetSrcTariff').val(); },				 		 		 		 
 		 		 groupName:  function () { return $('#targetGrpName').val(); }
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
	 		$('#targetItemName').val(data.id);	
	 		$('#itemId').val(data.id);
	 }		 
});	

//Blurr the data for invalid item Id
$('#targetItemName').change(function(){
	if($('#itemId').val()==null || $('#itemId').val()==""){
	$("#targetItemName").val(defalutItemName);       	
  }
	else {
		$("#targetItemName").val(dataName);   
			$('#itemId').val("");
		}
}); 
});